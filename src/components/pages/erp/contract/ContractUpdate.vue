<template>
  <div class="row">
      <div class="col-md-12 contract-detail">
          <div class="card mb-4">
                  <div class="row no-gutters row-bordered">
                      <div class="col-md-8 col-lg-12 col-xl-8">
                          <h6 class="card-header"><i class="ion  ion-ios-cloud-done"></i> Cập nhật thông tin hợp đồng - <b>{{contract_update.contract_number}}</b></h6>
                          <div class="card-body">
                              <b-form-row>
                                  <b-form-group label="Nhập ngày kí hợp đồng" class="col-md-12">
                                      <datepicker
                                              v-model="contract_update.contract_date"
                                              :typeable=true
                                              format='yyyy-MM-dd'
                                              :bootstrapStyling="true"
                                              :monday-first="true"
                                              :full-month-name="true"
                                              placeholder="Chọn ngày kí hợp đồng"
                                              :calendar-button="true"
                                              calendar-button-icon="ion ion-md-calendar"
                                              :clear-button="true"
                                              @input="onChangeContractDate"
                                      />
                                  </b-form-group>
                                  <b-form-group label="Chọn ngày HĐ có hiệu lực" class="col-md-6">
                                      <datepicker
                                              v-model="contract_update.start_date"
                                              :typeable=true
                                              format="yyyy-MM-dd"
                                              :bootstrapStyling="true"
                                              :monday-first="true"
                                              :full-month-name="true"
                                              placeholder="Ngày HĐ có hiệu lực"
                                              :calendar-button="true"
                                              calendar-button-icon="ion ion-md-calendar"
                                              :clear-button="true"
                                              @input="onChangeStartDate"
                                      />
                                  </b-form-group>
                                  <b-form-group label="Chọn ngày kết thúc hợp đồng" class="col-md-6" v-if ="contract_update.contract_type !== 'indefinite'">
                                      <datepicker
                                              v-model="contract_update.end_date"
                                              :typeable=true
                                              format='yyyy-MM-dd'
                                              :bootstrapStyling="true"
                                              :monday-first="true"
                                              :full-month-name="true"
                                              placeholder="Chọn ngày kết thúc"
                                              :calendar-button="true"
                                              calendar-button-icon="ion ion-md-calendar"
                                              :clear-button="true"/>
                                  </b-form-group>
                                  <b-form-group label="" class="col-md-12">
                                      <b-form-checkbox
                                              v-model="contract_update.has_kpi"
                                              value="1"
                                              unchecked-value="0"
                                      >
                                          <b>Tính lương theo KPI</b>
                                      </b-form-checkbox>
                                  </b-form-group>
                              </b-form-row>
                          </div>
                          <div class="card-footer border-0 text-center py-3">
                              <b-row>
                                <b-col md="4" offset="2"><b-btn class="btn btn-md btn-outline-warning" @click="saveContract"><i class="ion ion-ios-save"></i>&nbsp; Lưu thông tin hợp đồng</b-btn></b-col>
                                <b-col md="2"><router-link :to="{name: 'contract-detail', params: {id: contract_update.id || null }}" class="btn btn-md btn-outline-info"><i class="ion ion-md-eye"></i> Xem hợp đồng</router-link></b-col>
                              </b-row>
                          </div>
                      </div>
                      <div class="col-md-4 col-lg-12 col-xl-4 current-salary" v-if="user">
                          <h6 class="card-header"><i class="ion ion-ios-person"></i>&nbsp;Thông tin cá nhân</h6>
                          <div class="card-body">
                              <div class="row">
                                  <div class="col-6 col-xl-5 text-muted mb-3">Mã nhân viên</div>
                                  <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{user.staff_code}}</span></div>
                                  <div class="col-6 col-xl-5 text-muted mb-3">Họ tên</div>
                                  <div class="col-6 col-xl-7 mb-3">
                                      <span class="text-big">{{ user.fullname }}</span> <sup class="text-success"></sup>
                                  </div>
                                  <div class="col-6 col-xl-5 text-muted mb-3">Số CMT</div>
                                  <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{user.national_id}}</span> </div>
                                  <div class="col-6 col-xl-5 text-muted mb-3">Vị trí</div>
                                  <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{user.department}} - {{user.position}}</span></div>
                                  <div class="col-6 col-xl-5 text-muted mb-3">Kho</div>
                                  <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{user.station}}</span></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
      </div>
  </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import Notifications from 'vue-notification'
import staffService from 'domain/services/staff-service'
import Contract from 'domain/entities/Contract'

Vue.use(Notifications)
export default {
  name: 'contract-update',
  components: {
    Notification,
    Multiselect,
    Datepicker
  },
  data: () => ({
    contract_id: null,
    contract: null,
    user: null,
    mode: 'update',
    showCreateButton: true,
    appLoading: false,
    contract_update: {},
    options: {
      contract_type: Contract.getTypeOptions()
    },
    notify: {
      message: '',
      class: '',
      title: ''
    }
  }),
  methods: {
    getContractById: function () {
      let params = {
        id: this.$route.params.id
      }
      staffService.getContractById(params)
        .then((res) => {
          if (res.data.success) {
            this.user = res.data.data.user
            this.contract = res.data.data.contract
            this.contract_id = res.data.data.contract.id
            this.contract_update = JSON.parse(JSON.stringify(this.contract))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    showNotification: function (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'create-appendix',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify
      })
    },
    saveContract () {
      this.notify.success = false
      this.notify.title = 'Không thành công'
      let dataSend = this.contract_update
      dataSend.contract_id = this.contract.id
      dataSend.type_contract = this.contract_update.contract_type
      if (this.contract_update.contract_type === 'indefinite') {
        this.contract_update.end_date = null
      }
      staffService.updateContract(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.notify.success = true
            this.notify.title = 'Thành công'
          }
          this.notify.message = response.data.message
        }
      }).then(() => {
        this.showNotification(this.notify.success)
        if (this.notify.success) {
          setTimeout(function () {
            location.reload()
          }, 600)
        }
      })
    },
    updateAppendix: function (dataAppendix) {
      // Get data appendix
      this.appendix = dataAppendix
    },
    alertNotFound () {
      this.$emit('not_found', true)
    }
  },
  created () {
    this.getContractById()
  }
}
</script>

<style scoped>
    .row-bordered{
        overflow: unset;
    }
    .alert{
        max-width: 600px;
        margin: 0 auto;
    }
</style>
