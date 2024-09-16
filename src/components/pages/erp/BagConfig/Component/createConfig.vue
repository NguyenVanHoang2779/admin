<template>
  <b-modal id="create-config" modal-class="modal-md" hide-footer @close="resetForm">
    <template v-slot:modal-title>
      <h3 class="text-muted"><i class="fa fa-cog"></i> Tạo mới - Cập nhật</h3>
    </template>
    <b-row class="mb-3">
      <b-col>
        <b-form-group label="Chọn kho:">
          <multiselect
            class="multiselect-info custom-multiselect"
            :options="stationOptions"
            :multiple="multiple"
            v-model="dataSend.src_st_id"
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
    <b-row class="mb-3" v-if="isCreatedConfig">
      <b-col>
        <b-form-group label="Chọn username (tối đa 5 người):">
          <select-user @model="handleUserSelected($event)"
                       :limit=5
                       :resetUserSelected="resetUserSelected"
                       :station-ids="stationIds"
          ></select-user>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3" v-if="!isCreatedConfig">
      <b-col>
        <b-form-group label="Username:">
          <b-form-input :disabled=true :value="usernameEdit"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col md="6">
        <b-form-group label="Chọn thời gian bắt đầu ca:">
          <flat-pickr v-model="dataSend.ws_begin_datetime" :config="timeConfig"
                      style="background-color: #fff;"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Chọn thời gian kết thúc ca:">
          <flat-pickr v-model="dataSend.ws_end_datetime" :config="timeConfig"
                      style="background-color: #fff;"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col md="6">
        <b-form-group label="Chọn ngày có hiệu lực:">
          <datepicker
            placeholder="Chọn ngày có hiệu lực"
            v-model="dataSend.from_date"
            class="from-date"
            :format="customFormatter"
            :bootstrapStyling="true"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Chọn ngày hết hiệu lực:">
          <datepicker
            placeholder="Chọn ngày hết hiệu lực"
            v-model="dataSend.to_date"
            class="to-date"
            :format="customFormatter"
            :bootstrapStyling="true"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <!--    chon tinh dich-->
    <b-row class="mb-3">
      <b-col>
        <b-form-group label="Chọn tỉnh đích:">
          <multiselect
            class="multiselect-secondary"
            :options="provinceOptions"
            v-model="dataSend.list_province"
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
        <b-button class="mt-3" v-if="isCreatedConfig" variant="outline-warning" block @click="resetDataSend()"><i
          class="fa fa-undo"></i> Reset Nhập
        </b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-success" v-if="isCreatedConfig" block @click="createConfig()"><i
          class="fa fa-plus"></i> Tạo Mới
        </b-button>
        <b-button class="mt-3" variant="outline-info" v-else block @click="updateConfig()"><i
          class="fa fa-edit"></i> Cập Nhật
        </b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" variant="outline-danger" block @click="cancel()"><i class="fa fa-times"></i> Hủy Bỏ
        </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import SelectUser from './SelectUser'
import Moment from 'moment'
import CompanyProfileService from 'domain/services/company-profile-service'
import flatPickr from 'vue-flatpickr-component'
import Datepicker from 'vuejs-datepicker'
import 'flatpickr/dist/flatpickr.css'

export default {
  name: 'create-config',

  components: {
    'multiselect': Multiselect,
    Moment,
    Datepicker,
    flatPickr,
    SelectUser
  },

  props: {
    regionOptions: {},
    editConfig: {},
    isCreatedConfig: {}
  },

  computed: {
    usernameEdit () {
      return this.editConfig !== null ? this.editConfig.username : ''
    },
    stationIds () {
      if (this.dataSend.src_st_id !== null && this.dataSend.src_st_id.id !== null) {
        return this.dataSend.src_st_id.id
      } else {
        return this.stationOptions.map(e => e.id)
      }
    }
  },

  data: () => ({
    timeConfig: {
      enableTime: true,
      noCalendar: true,
      altInput: true
    },
    dataSend: {
      ws_begin_datetime: null,
      ws_end_datetime: null,
      from_date: Moment().format('YYYY-MM-DD'),
      to_date: null,
      src_st_id: null,
      list_province: null,
      user_id: null
    },
    multiple: false,
    date: new Date(),
    time_format: null,
    regionOption: [],
    provinceOptions: [],
    stationOptions: [],
    provinceOption: [],
    stationOption: [],
    isReady: false,
    idGroup: null,
    resetUserSelected: false
  }),

  watch: {
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
    this.getAllStation()
    this.getAllProvince()
  },

  methods: {
    handleUserSelected (event) {
      this.dataSend.user_id = event ? event.map((item) => item.id) : null
    },
    resetForm () {
      this.provinceOption = []
      this.stationOption = []
      this.resetDataSend()
      this.isReady = false
      this.idGroup = null
    },
    cancel () {
      this.resetForm()
      this.$bvModal.hide('create-config')
    },
    customFormatter (date) {
      return Moment(date).format('DD-MM-YYYY')
    },
    getAllProvince: function () {
      this.provinceOption = []
      this.provinceOptions = []
      CompanyProfileService.getListProvinceBagConfig().then(res => {
        if (!res.data.success) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách tỉnh!')
        else this.provinceOptions = res.data.data
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách tỉnh'))
    },

    getAllStation: function () {
      // if (this.editConfig !== null && !this.isReady) return 1
      this.stationOption = []
      this.stationOptions = []
      CompanyProfileService.getListStationBagConfig().then(res => {
        if (!res.data.success) return commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho')
        this.stationOptions = res.data.data
      }).catch(() => commonHelper.showMessage('Có lỗi khi xử lý danh sách kho'))
    },

    async createConfig () {
      try {
        // kiem tra xem du truong chua
        if (
          this.dataSend.ws_begin_datetime === null || this.dataSend.user_id === null ||
          this.dataSend.user_id.length === 0 || this.dataSend.src_st_id === null ||
          this.dataSend.list_province === null || this.dataSend.ws_end_datetime === null
        ) {
          return commonHelper.showMessage('Nhập đầy đủ thông tin')
        }

        // format data
        let dataSend = {
          ws_begin_datetime: this.dataSend.ws_begin_datetime,
          ws_end_datetime: this.dataSend.ws_end_datetime,
          from_date: Moment(this.dataSend.from_date).format('YYYY-MM-DD'),
          src_st_id: this.dataSend.src_st_id.id,
          list_province: this.dataSend.list_province.map(e => e.id),
          user_id: this.dataSend.user_id
        }
        if (this.dataSend.to_date !== null) {
          dataSend.to_date = Moment(this.dataSend.to_date).format('YYYY-MM-DD')
        }

        // gui request len server
        let result = await CompanyProfileService.createBagConfig(dataSend)
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
          this.$emit('afterCreatedConfig')
          this.cancel()
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    editConfigFine () {
      this.idGroup = this.editConfig.id
      this.dataSend.src_st_id = this.stationOptions.filter(e => e.id === this.editConfig.src_st_id)[0]

      this.dataSend.user_id = this.editConfig.user_id

      this.dataSend.list_province = this.editConfig.list_province.map(e => {
        return {id: e.province_id, name: e.province_name}
      })

      this.dataSend.from_date = this.editConfig.from_date
      this.dataSend.to_date = this.editConfig.to_date

      this.dataSend.ws_begin_datetime = this.editConfig.ws_begin_datetime
      this.dataSend.ws_end_datetime = this.editConfig.ws_end_datetime

      this.multiple = false
    },

    async updateConfig () {
      try {
        // kiem tra xem du truong chua
        if (
          this.dataSend.ws_begin_datetime === null || this.dataSend.user_id === null ||
          this.dataSend.user_id.length === 0 || this.dataSend.src_st_id === null ||
          this.dataSend.list_province === null || this.dataSend.ws_end_datetime === null
        ) {
          return commonHelper.showMessage('Nhập đầy đủ thông tin')
        }

        // format data
        let dataSend = {
          id: this.editConfig.id,
          ws_begin_datetime: this.dataSend.ws_begin_datetime,
          ws_end_datetime: this.dataSend.ws_end_datetime,
          from_date: Moment(this.dataSend.from_date).format('YYYY-MM-DD'),
          src_st_id: this.dataSend.src_st_id.id,
          list_province: this.dataSend.list_province.map(e => e.id),
          user_id: this.dataSend.user_id
        }
        if (this.dataSend.to_date !== null) {
          dataSend.to_date = Moment(this.dataSend.to_date).format('YYYY-MM-DD')
        }

        // gui request len server
        let result = await CompanyProfileService.updateBagConfigById(dataSend)
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
          this.$emit('afterCreatedConfig')
          this.cancel()
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },

    resetDataSend () {
      this.editConfig = null
      this.resetUserSelected = !this.resetUserSelected
      this.dataSend = {
        ws_begin_datetime: '12:00',
        ws_end_datetime: '12:00',
        from_date: Moment().format('YYYY-MM-DD'),
        to_date: null,
        src_st_id: null,
        list_province: null
      }
    }
  }
}
</script>

<style scoped>
</style>
