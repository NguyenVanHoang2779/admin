<template>
  <b-row>
    <b-row class="col-md-12">
      <b-col md="12" class="d-flex justify-content-between">
        <h3 v-if="isAdd">Thêm mới kế hoạch</h3>
        <h3 v-else>Sửa đổi kế hoạch</h3>
        <router-link :to="{name: 'edit-master-profile-company', params: { id: this.profileId }}" class="btn btn-default btn-md" title="Về màn sửa hồ sơ công ty"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
      </b-col>
    </b-row>
    <b-card class="mt-3 col-md-12">
      <b-card-body class="col-md-12">
        <b-row>
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Ngày bắt đầu chạy <span class="text-danger">*</span></span>
              <datepicker
                placeholder="Chọn ngày bắt đầu chạy"
                v-model="plan.from_date"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                :disabled="disabled"
              />
            </b-form-group>
          </b-col>
          <b-col md="1"></b-col>
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Ngày kết thúc chạy</span>
              <datepicker
                placeholder="Chọn ngày kết thúc chạy"
                v-model="plan.to_date"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Tuyến chạy <span class="text-danger">*</span></span>
              <multiselect
                v-if="isAdd"
                class="multi-plan"
                placeholder="Chọn mã tuyến/tên tuyến chạy"
                v-model="plan.router"
                :options="routerOptions"
                label="text"
                track-by="value"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :searchable="true"
                :clear-on-select="false"
                :disabled="disabled"
              >
                <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
              </multiselect>
              <b-form-input v-if="isEdit" v-model="plan.router_name" :disabled="disabled"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="1"></b-col>
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Kho xuất <span class="text-danger">*</span></span>
              <multiselect
                v-if="isAdd"
                placeholder="Chọn kho xuất"
                v-model="plan.station_id"
                :options="stationOptions"
                label="name"
                track-by="id"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :searchable="true"
                :clear-on-select="false"
                :disabled="disabled"
              >
                <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
              </multiselect>
              <b-form-input v-if="isEdit" v-model="plan.station_name" :disabled="disabled"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Số chiều <span class="text-danger">*</span></span>
              <multiselect
                placeholder="Chọn số chiều xe chạy"
                v-model="plan.number_dimensional"
                :options="numberOptions"
                label="text"
                track-by="value"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :searchable="true"
                :clear-on-select="false"
                :disabled="disabled"
              >
                <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col md="1"></b-col>
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Công cụ dụng cụ <span class="text-danger">*</span></span>
              <b-form-input placeholder="Nhập thông tin công cụ dụng cụ" v-model="plan.tool" :disabled="disabled"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Biển kiểm soát <span class="text-danger">*</span></span>
              <multiselect
                v-if="isAdd"
                placeholder="Chọn BKS"
                v-model="plan.code"
                :options="codeOptions"
                label="text"
                track-by="text"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :searchable="true"
                :clear-on-select="false"
                :disabled="disabled"
              >
                <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
              </multiselect>
              <b-form-input v-if="isEdit" v-model="plan.code_name" :disabled="disabled"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Tài xế <span class="text-danger">*</span></span>
              <multiselect
                v-if="isAdd"
                placeholder="Chọn tên tài xế/CCCD"
                v-model="plan.user"
                :options="driverOptions"
                label="name"
                track-by="id"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :searchable="true"
                :clear-on-select="false"
                @input="onChangeDriverName()"
                :disabled="disabled"
              >
                <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
              </multiselect>
              <b-form-input v-if="isEdit" v-model="plan.fullname" :disabled="disabled"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="1"></b-col>
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Số điện thoại</span>
              <b-form-input v-model="plan.tel" :disabled="true"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col md="5">
            <b-form-group label-cols-sm="3">
              <span slot="label">Ghi chú</span>
              <b-form-input placeholder="Nhập ghi chú" v-model="plan.note" :disabled="disabled"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="d-flex justify-content-center" style="margin-top: 5rem">
          <b-btn class="btn btn-submit-ghtk btn-md text-center" @click="updateRentTruckPlan"> Lưu thông tin </b-btn>
        </b-row>
      </b-card-body>
    </b-card>
  </b-row>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import moment from 'moment'

export default {
  name: 'update-truck-plan',

  components: {
    Datepicker,
    Multiselect
  },

  props: [],

  data: () => ({
    plan: {
      from_date: '',
      to_date: '',
      router: '',
      station_id: '',
      number_dimensional: '',
      tool: '',
      code: '',
      user: '',
      tel: '',
      note: '',
      fullname: '',
      code_name: '',
      router_name: '',
      station_name: ''
    },
    routerOptions: [],
    numberOptions: [
      { value: '1', text: '1 chiều' },
      { value: '2', text: '2 chiều' }
    ],
    codeOptions: [],
    driverOptions: [],
    stationOptions: [],
    profileId: '',
    detailPlan: [],
    planId: '',
    disabled: false
  }),

  computed: {
    isAdd: function () {
      return this.$route.name === 'add-truck-plan'
    },

    isEdit: function () {
      return this.$route.name === 'edit-truck-plan'
    }
  },

  watch: {
    '$route.params.id': function () {
    },
    /* routerOptions () {
      this.getDetailRentTruckPlan(this.planId)
    }, */
    'plan.router': function (v) {
      if (v && typeof v === 'object' && this.isEdit) {
        this.plan.router = this.routerOptions.find(item => item.id === v.id)
      }
    },
    'plan.station_id': function (v) {
      if (v && typeof v === 'object' && this.isEdit) {
        this.plan.station_id = this.stationOptions.find(item => item.id === v.id)
      }
    },
    'plan.code': function (v) {
      if (v && this.isEdit) {
        this.plan.code = this.codeOptions.find(item => item.text === v.text)
      }
    },
    'plan.user': function (v) {
      if (v && typeof v === 'object' && this.isEdit) {
        this.plan.user = this.driverOptions.find(item => item.id === v.id)
      }
    }
  },

  mounted: function () {
    this.getDetailRentTruckPlan(this.planId)
  },

  created () {
    if (this.isAdd) {
      this.profileId = this.$route.params.id
      this.getCodeByRentTrucks()
      this.getAllStations()
      this.getListRoutes()
      this.getListRentDriverByCompanys()
    } else {
      if (this.$route.params.id) {
        this.disabled = true
        this.planId = this.$route.params.id
        this.profileId = this.$route.query.profile_id
        this.getAllStations()
        this.getListRoutes()
        this.getCodeByRentTrucks()
        this.getListRentDriverByCompanys()
      }
    }
  },

  methods: {
    moment (data) {
      return moment(data)
    },
    getCodeByRentTrucks () {
      this.$startLoading()
      let dataRequest = {
        profile_id: this.profileId
      }
      CompanyProfileService.getCodeByRentTrucks(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.codeOptions = res.data.data
          } else {
            this.codeOptions = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    getAllStations () {
      this.$startLoading()
      CompanyProfileService.getAllStations()
        .then((res) => {
          if (res.data.success) {
            this.stationOptions = res.data.data
          } else {
            this.stationOptions = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    getListRoutes () {
      this.$startLoading()
      CompanyProfileService.getListRoutes()
        .then((res) => {
          if (res.data.success) {
            this.routerOptions = res.data.data
          } else {
            this.routerOptions = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    getListRentDriverByCompanys () {
      this.$startLoading()
      let dataRequest = {
        profile_id: this.profileId
      }
      CompanyProfileService.getListRentDriverByCompanys(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.driverOptions = res.data.data
          } else {
            this.driverOptions = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    onChangeDriverName () {
      if (this.plan.user) {
        this.plan.tel = this.plan.user.tel
      } else {
        this.plan.tel = ''
      }
    },
    updateRentTruckPlan () {
      let dataSend = new FormData()
      if (this.isAdd) {
        dataSend.append('profile_id', this.profileId || '')
        dataSend.append('from_date', moment(this.plan.from_date).format('YYYY-MM-DD') !== 'Invalid date' ? moment(this.plan.from_date).format('YYYY-MM-DD') : '' || '')
        dataSend.append('to_date', moment(this.plan.to_date).format('YYYY-MM-DD') !== 'Invalid date' ? moment(this.plan.to_date).format('YYYY-MM-DD') : '' || '')
        dataSend.append('router_id', this.plan.router ? this.plan.router.value : '')
        dataSend.append('station_id', this.plan.station_id ? this.plan.station_id.id : '')
        dataSend.append('number_dimensional', this.plan.number_dimensional ? this.plan.number_dimensional.value : '')
        dataSend.append('tool', this.plan.tool || '')
        dataSend.append('code', this.plan.code ? this.plan.code.text : '')
        dataSend.append('rent_driver_id', this.plan.user ? this.plan.user.id : '')
        dataSend.append('note', this.plan.note || '')
      } else {
        dataSend.append('id', this.planId || '')
        dataSend.append('profile_id', this.profileId || '')
        dataSend.append('to_date', moment(this.plan.to_date).format('YYYY-MM-DD') !== 'Invalid date' ? moment(this.plan.to_date).format('YYYY-MM-DD') : '' || '')
      }
      CompanyProfileService.updateRentTruckPlan(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.$router.push({ name: 'edit-master-profile-company', params: { id: this.profileId } })
            this.reset()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    },
    getDetailRentTruckPlan (id) {
      this.$startLoading()
      let dataRequest = {
        id: id,
        profile_id: this.profileId
      }
      CompanyProfileService.getDetailRentTruckPlan(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.detailPlan = res.data.data
            this.plan.from_date = this.detailPlan.from_date
            this.plan.to_date = this.detailPlan.to_date
            this.plan.router = this.detailPlan.router_id
            this.plan.station_id = this.detailPlan.station_id
            this.plan.number_dimensional = this.numberOptions.find(item => item.value === this.detailPlan.number_dimensional)
            this.plan.tool = this.detailPlan.tool
            this.plan.code = this.plan.code_name = this.detailPlan.code
            this.plan.user = this.detailPlan.rent_driver_id
            if (this.plan.router) {
              this.plan.router = this.routerOptions.find(item => item.value === this.plan.router)
            }
            this.plan.router_name = this.detailPlan.router_name
            if (this.plan.station_id) {
              this.plan.station_id = this.stationOptions.find(item => item.id === this.plan.station_id)
            }
            this.plan.station_name = this.detailPlan.station_name
            if (this.plan.code) {
              this.plan.code = this.codeOptions.find(item => item.text === this.plan.code)
            }
            if (this.plan.user) {
              this.plan.user = this.driverOptions.find(item => item.id === this.plan.user)
            }
            this.plan.fullname = this.detailPlan.fullname
            this.plan.tel = this.detailPlan.tel
            this.plan.note = this.detailPlan.note
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    reset () {
      this.planId = ''
      this.plan.from_date = ''
      this.plan.to_date = ''
      this.plan.router = ''
      this.plan.station_id = ''
      this.plan.number_dimensional = ''
      this.plan.tool = ''
      this.plan.code = ''
      this.plan.user = ''
      this.plan.tel = ''
      this.plan.note = ''
      this.plan.code_name = ''
      this.plan.fullname = ''
      this.plan.router_name = ''
      this.plan.station_name = ''
    }
  }
}
</script>

<style scoped>
.btn-submit-ghtk {
  background-color: #00904A;
  border-radius: 3px;
}
</style>
