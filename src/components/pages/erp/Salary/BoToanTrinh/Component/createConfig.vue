<template>
  <b-modal id="create-config-quality" modal-class="modal-md" hide-footer @close="resetForm()">
    <template v-slot:modal-title>
      <h3 class="text-muted"><i class="fa fa-cog"></i> Bỏ toàn trình</h3>
    </template>
    <b-row class="mb-3">
      <b-col md="6" class="mb-2">
        <b-form-group label="Chọn thời gian bỏ toàn trình:">
          <v-date-picker v-if="isCreatedConfig" color="green"
                         mode="range" v-model="range_time" locale="vi"/>
          <v-date-picker v-if="!isCreatedConfig" v-model="date" color="green" locale="vi"/>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Chọn loại toàn trình:">
          <b-form-select v-model="type" :options="qualityType"></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <b-form-group label="Chọn miền:">
          <multiselect
            class="multiselect-info"
            :options="regionOptions"
            v-model="regionOption"
            placeholder="Chọn Miền"
            label="name"
            track-by="id"
            :multiple="false"
            :preserve-search="true"
            :hide-selected="true"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Chọn tỉnh:">
          <multiselect
            class="multiselect-info"
            :options="provinceOptions"
            v-model="provinceOption"
            placeholder="Chọn Tỉnh"
            :multiple="true"
            label="name"
            track-by="id"
            :preserve-search="true"
            :hide-selected="true"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="Chọn kho:">
          <multiselect
            class="multiselect-info"
            :options="stationOptions"
            :multiple="multiple"
            v-model="stationOption"
            placeholder="Chọn Kho"
            label="name"
            track-by="id"
            :close-on-select="!multiple"
            :preserve-search="true"
            :hide-selected="true"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <b-button class="mb-1 mr-2" size="sm" variant="outline-primary" @click="selectAllStation">Chọn tất cả các kho</b-button>
        <b-button class="mb-1 mr-2" size="sm" variant="outline-primary" @click="selectAllStationLVorNV">Chọn tất cả các kho liên vùng</b-button>
        <b-button class="mb-1 mr-2" size="sm" variant="outline-primary" @click="selectAllStationLVorNV($event,'NV')">Chọn tất cả các kho nội vùng</b-button>
        <b-button class="mb-1 mr-2" size="sm" variant="outline-primary" @click="selectAllStationLVorNV($event,'Hub')">Chọn tất cả các kho Hub</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button class="mt-3" v-if="isCreatedConfig" variant="outline-warning" block @click="resetForm()"><i class="fa fa-undo"></i> Reset Nhập </b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-success" v-if="idGroup === null" block @click="createConfig()"><i class="fa fa-plus"></i> Tạo Mới </b-button>
        <b-button class="mt-3" variant="outline-info" v-if="idGroup !== null" block @click="updateConfig()"><i class="fa fa-edit"></i> Cập Nhật </b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-danger" block @click="cancel()"><i class="fa fa-times"></i> Hủy Bỏ </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import addressService from 'domain/services/address-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import VCalendar from 'v-calendar'
import cycleTime from 'infrastructures/helpers/date.js'
import SalaryService from 'domain/services/salary-service'

export default {
  name: 'create-config',

  components: {
    'multiselect': Multiselect,
    VueMonthlyPicker,
    Moment,
    VCalendar
  },

  props: {
    regionOptions: {},
    editConfig: {},
    isCreatedConfig: {}
  },

  data: () => ({
    multiple: true,
    date: new Date(),
    range_time: null,
    time_format: null,
    regionOption: [],
    provinceOptions: [],
    stationOptions: [],
    provinceOption: [],
    stationOption: [],
    isReady: false,
    idGroup: null,
    qualityType: [
      {
        text: 'All',
        value: '1'
      },
      {
        text: 'Po - Trung Chuyển Lấy',
        value: '2'
      },
      {
        text: 'Po - Trung Chuyển Trả',
        value: '3'
      },
      {
        text: 'Po - Xuất Trả',
        value: '4'
      },
      {
        text: 'Po - Xuất Giao',
        value: '5'
      },
      {
        text: 'Po - Chat - tiếp nhận',
        value: '6'
      },
      {
        text: 'Po - Chat - Phản hồi',
        value: '7'
      },
      {
        text: 'Po - Giao Thành công',
        value: '8'
      },
      {
        text: 'XLH - P2B',
        value: '9'
      },
      {
        text: 'XLH - SORTING',
        value: '10'
      },
      {
        text: 'XLH -  EXPORT',
        value: '11'
      },
      {
        text: 'XLH -  PALLET',
        value: '12'
      },
      {
        text: 'XLH -  IMPORT',
        value: '13'
      }
    ],
    type: '1'
  }),

  watch: {
    range_time: function () {
      this.getStartEndFromTimeRange()
    },
    regionOption: function (newValue, oldValue) {
      this.getAllProvince(newValue.id)
    },
    provinceOption: function (newValue, oldValue) {
      this.getAllStation()
    },
    stationOption: function (newValue, oldValue) {
    },
    editConfig: function (newValue, oldValue) {
      if (newValue === null) return
      try {
        this.editConfigFine()
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },
    isCreatedConfig: function (newValue, oldValue) {
      if (newValue) this.resetForm()
    }
  },

  created () {
    this.getAllProvince(1)
    this.getStartEndFromTimeRange()
  },

  methods: {
    resetForm () {
      this.regionOption = []
      this.provinceOptions = []
      this.stationOptions = []
      this.provinceOption = []
      this.stationOption = []
      this.type = 1 // lay
      this.isReady = false
      this.idGroup = null
      this.multiple = true
      this.$emit('resetForm')
    },
    cancel () {
      this.resetForm()
      this.$bvModal.hide('create-config-quality')
    },
    customFormatter (date) {
      return Moment(date).format('YYYY-MM-DD')
    },
    getAllProvince: function (regionId) {
      // if (this.editConfig !== null && !this.isReady) return 1
      this.provinceOption = []
      this.provinceOptions = []
      let data = {}
      if (regionId !== 1) data = {'region': regionId}
      addressService.getProvincesByRegion(data).then(res => {
        if (res.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách tỉnh!')
        for (let provinceId in res.data) {
          this.provinceOptions.push({id: provinceId, name: res.data[provinceId]})
        }
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh'))
    },

    getAllStation: function () {
      // if (this.editConfig !== null && !this.isReady) return 1
      this.stationOption = []
      this.stationOptions = []
      let data = {}
      if (this.provinceOption.length === 0) {
        SalaryService.getListStationsToanTrinh().then(res => {
          if (res.data.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho')
          this.stationOptions = res.data.data
        }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách kho'))

        return
      }

      if (this.provinceOption.length > 0) {
        data.province_ids = this.provinceOption.map(province => province.id)
      }
      SalaryService.getListStationByProvinceIdsV2(data).then(res => {
        if (res.data.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho')
        this.stationOptions = res.data.data
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách kho'))
    },

    selectAllStationLVorNV: function (event, type = 'LV') {
      // if (this.editConfig !== null && !this.isReady) return 1
      this.stationOption = []
      this.stationOptions = []
      let data = {}

      if (this.provinceOption.length > 0) {
        data.province_ids = this.provinceOption.map(province => province.id)
      }
      data.type = type
      SalaryService.getListStationsByCondition(data).then(res => {
        if (res.data.data.length === 0) return commonHelper.showMessage('Không có kho nào')
        this.stationOption = res.data.data
      }).catch(() => {
        this.stationOption = []
        commonHelper.showMessage('Có lỗi khi xử lý danh sách kho')
      })
    },

    async createConfig () {
      try {
        if (this.stationOption.length === 0) {
          commonHelper.showMessage('Chưa chọn kho')
          return
        }

        let listStationId = this.stationOption.map(e => e.id)

        let dataSend = {
          start_date: this.time_format['from'],
          end_date: this.time_format['to'],
          station_id: listStationId,
          type: this.type
        }
        // gui request len server
        let result = await SalaryService.removeQuality(dataSend)
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
          this.$emit('afterCreatedConfig')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    editConfigFine () {
      this.stationOption = this.stationOptions.filter(e => +e.id === +this.editConfig.station_id)
      this.type = this.editConfig.type
      this.stationOption = this.stationOption[0]
      this.idGroup = this.editConfig.id
      this.date = new Date(this.editConfig.date)
      this.multiple = false
    },

    getStartEndFromTimeRange () {
      if (!this.range_time) {
        let startYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('YYYY'))
        let startMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('MM')) - 1
        let startDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).from, 'YYYY-MM-DD').format('DD'))

        let endYear = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('YYYY'))
        let endMonth = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('MM')) - 1
        let endDay = parseInt(Moment(cycleTime.daysInThisMonth(21, 20).to, 'YYYY-MM-DD').format('DD'))

        this.range_time = {
          start: new Date(startYear, startMonth, startDay),
          end: new Date(endYear, endMonth, endDay)
        }

        this.time_format = {
          from: cycleTime.daysInThisMonth(21, 20).from,
          to: cycleTime.daysInThisMonth(21, 20).to
        }
        return true
      }
      this.time_format = {
        from: Moment(this.range_time.start, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        to: Moment(this.range_time.end, 'DD-MM-YYYY').format('YYYY-MM-DD')
      }
    },

    async updateConfig () {
      try {
        if (this.stationOption.id === null) {
          commonHelper.showMessage('Chưa chọn kho')
          return
        }
        let date = Moment(this.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        let dataSend = {
          id: this.editConfig.id,
          date: date,
          station_id: this.stationOption.id,
          type: this.type
        }
        // gui request len server
        let result = await SalaryService.updateConfigTRQ(dataSend)
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
          this.$emit('afterCreatedConfig')
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    selectAllStation () {
      this.stationOption = [...this.stationOptions]
    }
  }
}
</script>
