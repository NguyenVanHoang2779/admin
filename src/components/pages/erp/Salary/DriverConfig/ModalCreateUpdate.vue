<template>
  <b-modal id="create-config-driver" modal-class="modal-md" hide-footer @close="resetForm()">
    <template v-slot:modal-title>
      <h4 class="text-muted"><i class="fa fa-cog"></i> Config bỏ phạt tài xế</h4>
    </template>
    <b-row class="mb-3">
      <b-col>
        <label class="form-label">Mở từ ngày(ngày mở thêm - thường lúc chốt lương)</label>
        <datepicker v-model="from" placeholder="" :bootstrapStyling="true" :format="customFormatter"/>
      </b-col>
      <b-col>
        <label class="form-label">Đến Ngày(ngày mở thêm - thường lúc chốt lương)</label>
        <datepicker v-model="to"  placeholder="" :bootstrapStyling="true" :format="customFormatter" />
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <label class="form-label">Áp dụng từ ngày(ngày duyệt - các ngày đã quá hạn duyệt)</label>
        <datepicker v-model="start" placeholder="" :bootstrapStyling="true" :format="customFormatter"/>
      </b-col>
      <b-col>
        <label class="form-label">Đến Ngày(ngày duyệt - các ngày đã quá hạn duyệt)</label>
        <datepicker v-model="end"  placeholder="" :bootstrapStyling="true" :format="customFormatter" />
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <multiselect
          class="multiselect-info"
          :options="regionOptions"
          v-model="regionOption"
          selectLabel="Chọn"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          placeholder="Chọn Miền"
          label="name"
          track-by="id"
          :preserve-search="true"
          :hide-selected="true"
        />
      </b-col>
      <b-col v-if="regionOption.id !== 0 && regionOption.id > 0">
        <multiselect
          class="multiselect-info"
          :options="provinceOptions"
          v-model="provinceOption"
          placeholder="Chọn Tỉnh"
          selectLabel="Chọn"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          :multiple="true"
          label="name"
          track-by="id"
          :preserve-search="true"
          :hide-selected="true"
        />
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col v-if="regionOption.id !== 0 && regionOption.id > 0">
        <multiselect
          class="multiselect-info"
          :options="stationOptions"
          :multiple="true"
          v-model="stationOption"
          selectLabel="Chọn"
          selectedLabel="Đã chọn"
          deselectLabel="Bỏ chọn"
          placeholder="Chọn Kho"
          label="name"
          track-by="id"
          :preserve-search="true"
          :hide-selected="true"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-textarea
          v-model="desc"
        ></b-textarea>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button class="mt-3" variant="outline-dark" block @click="resetForm()">Reset Nhập <i class="fa fa-undo"></i></b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-success" v-if="idEdit === null" block @click="createConfig()">Tạo Mới <i class="fa fa-plus"></i></b-button>
        <b-button class="mt-3" variant="outline-info" v-if="idEdit !== null" block @click="createConfig()">Cập Nhật <i class="fa fa-edit"></i></b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-warning" block @click="cancel()">Hủy Bỏ <i class="fa fa-times"></i></b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<style scoped>
.custom-select-work-shift {
  width: 100%;
}
</style>

<script>
import addressService from 'domain/services/address-service'
import StationService from 'domain/services/station-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import driverConfigService from 'domain/services/driver-config-value'
import Multiselect from 'vue-multiselect'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'create-config',

  components: {
    'multiselect': Multiselect,
    VueMonthlyPicker,
    Moment,
    Datepicker,
    driverConfigService
  },

  props: {
    regionOptions: {},
    optionFine: {},
    editConfig: {},
    isCreatedConfig: {},
    getConfig: Function
  },

  data: () => ({
    regionOption: [],
    provinceOptions: [],
    stationOptions: [],
    provinceOption: [],
    stationOption: [],
    from: null,
    to: null,
    start: null,
    end: null,
    desc: null,
    isReady: false,
    idEdit: null
  }),

  watch: {
    regionOption: function (newValue, oldValue) {
      this.getAllProvince(newValue.id)
    },
    provinceOption: function (newValue, oldValue) {
      this.getAllStation()
    },
    stationOption: function (newValue, oldValue) {
    },
    editConfig: function (newValue, oldValue) {
      this.editConfigFine()
    },
    isCreatedConfig: function (newValue, oldValue) {
      if (newValue) this.resetForm()
    }
  },

  created () {
    this.getAllProvince(1)
  },

  methods: {
    resetForm () {
      this.regionOption = []
      this.provinceOptions = []
      this.stationOptions = []
      this.provinceOption = []
      this.stationOption = []
      this.from = null
      this.to = null
      this.start = null
      this.end = null
      this.desc = null
      this.isReady = false
      this.idEdit = null
      this.$emit('resetForm')
    },
    cancel () {
      this.resetForm()
      this.$bvModal.hide('create-config-driver')
    },
    customFormatter (date) {
      return Moment(date).format('YYYY-MM-DD')
    },
    getAllProvince: function (regionId) {
      // this.provinceOption = []
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

    getAllStation: function (stationOption = null) {
      // this.stationOption = []
      this.stationOptions = []
      let data = {}
      if (this.provinceOption.length > 0) {
        data.province_ids = this.provinceOption.map(province => province.id)
      }
      StationService.getListStationByProvinceIds(data).then(res => {
        if (res.data.data.length === 0) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho')
        this.stationOptions = res.data.data
        if (stationOption !== null) {
          if (typeof stationOption !== 'undefined') this.stationOption = Object.values(stationOption)
        }
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách kho'))
    },

    createConfig () {
      if (this.from === null || this.to === null) return commonHelper.showMessage('Khoảng thời gian mở duyệt không hợp lệ')
      if (this.start === null || this.end === null) return commonHelper.showMessage('Khoảng thời gian duyệt không hợp lệ')
      // Phân 2 case: case 1 - mở cho all, case 2 - mở theo tùy chọn
      let dataSend = {}
      if (this.regionOption.length === 0) {
        dataSend = {
          from: Moment(this.from).format('YYYY-MM-DD'),
          to: Moment(this.to).format('YYYY-MM-DD'),
          start: Moment(this.start).format('YYYY-MM-DD'),
          end: Moment(this.end).format('YYYY-MM-DD'),
          desc: this.desc
        }
      }

      if (this.regionOption.length !== 0) {
        if (this.stationOption.length > 0 && this.provinceOption.length === 0) return commonHelper.showMessage('Vui lòng chọn tỉnh')
        if (this.regionOption.id === 0) {
          // cho case ca nuoc
          this.provinceOption = []
          this.stationOption = []
        }
        dataSend = {
          region: this.regionOption,
          province: this.provinceOption,
          station: this.stationOption,
          from: Moment(this.from).format('YYYY-MM-DD'),
          to: Moment(this.to).format('YYYY-MM-DD'),
          start: Moment(this.start).format('YYYY-MM-DD'),
          end: Moment(this.end).format('YYYY-MM-DD'),
          desc: this.desc
        }
      }

      if (this.idEdit !== null) {
        dataSend.idEdit = this.idEdit
      }

      driverConfigService.apiCreateConfigBoPhat(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.resetForm()
          this.$bvModal.hide('create-config-driver')
          this.getConfig()
        } else {
          commonHelper.showMessage(res.data.message)
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra khi tạo config bỏ phạt'))
    },
    editConfigFine () {
      if (this.editConfig === null) return
      this.from = this.editConfig.from_date
      this.to = this.editConfig.to_date
      this.start = this.editConfig.start_date
      this.end = this.editConfig.end_date
      this.regionOption = this.editConfig.region_info
      this.provinceOption = this.editConfig.provinces
      this.stationOption = this.editConfig.stations
      this.idEdit = this.editConfig.id_config
      this.desc = this.editConfig.desc
    }
  }
}
</script>
