<template>
    <div class="update-user">
        <div class="notification-truck">
            <b-alert
                    :variant="notify_user.type"
                    dismissible
                    fade
                    :show="notify_user.showDismissibleAlert"
                    @dismissed="notify_user.showDismissibleAlert = false"
            >
                {{notify_user.message}}
            </b-alert>
        </div>
        <div class="row header">
            <div class="col-md-8">
                <h2 v-if="isAdd">Thêm tài khoản</h2>
                <h2 v-else>Sửa thông tin tài khoản</h2>
            </div>
            <div class="col-md-4">
                <b-row>
                    <b-col md="12" class="text-right">
                        <router-link :to="{name: 'manager-master-company-profile'}" class="btn btn-outline-success ml-1"><i class="ion ion-ios-arrow-back"></i> Quản lý Profile Công ty</router-link>
                    </b-col>
                </b-row>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 create-user">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-4 find-master-profile">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                                <h6 class="card-header"><i class="ion  ion-ios-add-circle"></i>&nbsp;Thông tin profile công ty</h6>
                                <div class="card-body">
                                    <b-form-group v-if="isAdd" class="w-100" label="Tìm kiếm Profile">
                                        <b-input-group>
                                            <single-select-company-profile
                                                    v-model="masterInfo.id"
                                                    :show-info="true"
                                                    @handleChooseProfileCompany="handleChooseProfileCompany"
                                                    :master-id="masterInfo.id"
                                            >
                                            </single-select-company-profile>
                                        </b-input-group>
                                    </b-form-group>
                                    <div class="row">
                                        <div class="col-6 col-xl-5 text-muted mb-3">Loại công ty</div>
                                        <div class="col-6 col-xl-7 mb-3">
                                            <span class="text-big">{{masterInfo.organization_type}}</span>
                                        </div>
                                        <div class="col-6 col-xl-5 text-muted mb-3">Tên công ty</div>
                                        <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.fullname}}</span> </div>
                                        <div class="col-6 col-xl-5 text-muted mb-3">Mã số thuế</div>
                                        <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.tax_iden_number}}</span> </div>
                                        <div class="col-6 col-xl-5 text-muted mb-3">Điện thoại liên hệ</div>
                                        <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.contact_tel}}</span> </div>
                                        <div class="col-6 col-xl-5 text-muted mb-3">Email liên hệ</div>
                                        <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.contact_email}}</span> </div>
                                    </div>
                                    <div>
                                        <router-link :to="{name: 'edit-master-profile-company', params: { id: masterInfo.id }}" class="">Chi tiết profile công ty<i class="ion ion-ios-arrow-dropright"></i></router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8 input-user-info">
                            <div class="row no-gutters">
                                <div class="col-md-12 col-lg-12 col-xl-12">
                                    <h6 class="card-header"><i class="ion  ion-ios-add-circle"></i> Thông tin tài khoản</h6>
                                    <div class="card-body">
                                        <b-form-row>
                                            <b-form-group class="col-md-4">
                                                <template slot='label'>
                                                    Loại tài khoản
                                                </template>
                                                <b-form-select v-model="typeAccount" :options="optionTypeAccounts" class="mb-3" :disabled="isAdd ? false :true"></b-form-select>
                                            </b-form-group>
                                            <b-form-group class="col-md-4">
                                                <template slot='label'>
                                                    Tên tài khoản
                                                </template>
                                                <b-form-input
                                                        v-model="userdata.username"
                                                        id="username"
                                                        name="username"
                                                        v-validate="'required'"
                                                        placeholder="Nhập username (nên có tên công ty phía trước)"
                                                        :disabled="isAdd ? false :true"
                                                        :class="{'is-danger': errors.has('username')}"
                                                >
                                                </b-form-input>
                                                <span v-show="errors.firstRule('username') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group class="col-md-4"  label="Bộ phận">
                                                <single-select-department
                                                        @handleSelectedDepartment="handleSelectedDepartment"
                                                        :department-id="userdata.department_id"
                                                        :is-disabled="true"
                                                >
                                                </single-select-department>
                                                <input v-validate="'required'" v-model="userdata.department_id" type="hidden" name="input-department" >
                                                <span v-show="errors.firstRule('input-department') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                            <b-form-group class="col-md-4" label="Vị trí">
                                                <single-select-position
                                                        @handleSelectedPosition="handleSelectedPosition"
                                                        :department-id="userdata.department_id"
                                                        :position-job="userdata.position_job"
                                                        :is-disabled="true"
                                                >
                                                </single-select-position>
                                                <input v-validate="'required'" v-model="userdata.position_job" type="hidden" name="input-position" >
                                                <span v-show="errors.firstRule('input-position') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group class="col-md-4">
                                                <template slot='label'>
                                                    Nhập mật khẩu
                                                </template>
                                                <b-form-input
                                                        v-model="userdata.password"
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        v-validate="'required'"
                                                        placeholder="Nhập password"
                                                        :class="{'is-danger': errors.has('password')}"
                                                >
                                                </b-form-input>
                                                <span v-show="errors.firstRule('username') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                            <b-form-group class="col-md-4">
                                                <template slot='label'>
                                                    Nhập lại mật khẩu
                                                </template>
                                                <b-form-input
                                                        v-model="userdata.password_confirm"
                                                        id="password_confirm"
                                                        name="password_confirm"
                                                        type="password"
                                                        v-validate="'required'"
                                                        placeholder="Nhập lại password"
                                                        :class="{'is-danger': errors.has('password_confirm')}"
                                                >
                                                </b-form-input>
                                                <span v-show="errors.firstRule('password_confirm') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row v-if="!isAddManager">
                                            <b-form-group class="col-md-4">
                                                <template slot='label'>
                                                    Chọn xe tải gán
                                                </template>
                                                <b-input-group>
                                                    <single-select-truck
                                                            v-model="userdata.truck_order"
                                                            :show-info="true"
                                                            @handleChooseTruck="handleChooseTruck($event)"
                                                            :truck-order="userdata.truck_order"
                                                            :list-vehicles="listVehicles"
                                                    >
                                                    </single-select-truck>
                                                </b-input-group>
                                            </b-form-group>
                                        </b-form-row>
                                    </div>
                                    <div v-show="!$route.params.id" class="card-body">
                                        <div role="alert" aria-live="polite" style="text-align: center" aria-atomic="true" class="alert alert-danger">Vui lòng chọn profile trước khi thêm tài khoản ! nếu chưa có vui lòng tạo Profile</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer border-0 text-center py-3">
            <ladda-btn v-if="isAdd" :loading="isProcessingUpdate" @click.native="addUser()" data-style="expand-right" class="btn btn-primary">
                <i class="ion ion-ios-add"></i> Thêm tài khoản
            </ladda-btn>
            <ladda-btn v-else :loading="isProcessingUpdate" @click.native="editUser()"  data-style="expand-right" class="btn btn-info">
                <i class="icon ion-md-archive"></i> Cập nhật tài khoản
            </ladda-btn>
        </div>
        <notifications group='add-user-company'></notifications>
    </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import CompanyProfileService from 'domain/services/company-profile-service'
import SingleSelectTruck from 'components/elements/common/SingleSelectTruck'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectCompanyProfile from 'components/elements/common/SingleSelectCompanyProfile'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(VeeValidate)
export default {
  name: 'update-user-company',
  components: {
    LaddaBtn,
    Notification,
    Multiselect,
    MultiSelectUser,
    SingleSelectDepartment,
    SingleSelectPosition,
    SingleSelectCompanyProfile,
    SingleSelectTruck
  },
  data: () => ({
    isProcessingUpdate: false,
    leaders: null,
    employees: null,
    typeAccount: null,
    optionTypeAccounts: [
      { value: null, text: 'Chọn loại tài khoản' },
      { value: 1, text: 'Tài khoản thường' },
      { value: 2, text: 'Tài khoản quản lý' }
    ],
    isAddManager: false,
    userdata: {
      id: null,
      company_id: null,
      department_name: 'Vận hành xe tải',
      department_id: 11,
      position_job: '',
      created: '',
      created_by: '',
      modified_by: '',
      password: '',
      password_confirm: '',
      username: '',
      fullname: '',
      contact_tel: '',
      truck_order: ''
    },
    listVehicles: [],
    masterInfo: {
      id: ''
    },
    toogleLog: false,
    canCustomUserName: false,
    notify: {
      message: '',
      class: '',
      title: '',
      duration: ''
    },
    notify_user: {
      showDismissibleAlert: false,
      message: '',
      type: ''
    }
  }),

  created () {
    if (this.isAdd) {
      if (this.$route.params.id) {
        this.masterInfo.id = this.$route.params.id
        this.getCompanyProfile()
      }
    } else {
      if (!this.$route.params.id) {
        return
      }

      // load profile to edit
      if (this.$route.params.id) {
        this.getUserCompany()
      }
    }
  },

  computed: {
    isAdd: function () {
      return this.$route.name === 'add-user-company'
    },

    isEdit: function () {
      return this.$route.name === 'edit-user-company'
    }
  },

  watch: {
    typeAccount: function (newVal, oldVal) {
      if (newVal === 2) {
        this.isAddManager = true
        this.userdata.position_job = '129'
      } else {
        this.isAddManager = false
        this.userdata.position_job = '99'
      }
    }
  },

  methods: {
    showNotification (success) {
      let classNotify = 'bg-success text-white'
      if (!success) {
        classNotify = 'bg-warning text-dark'
      }
      this.$notify({
        group: 'add-user',
        title: this.notify.title,
        text: this.notify.message,
        type: classNotify,
        duration: this.notify.duration
      })
    },
    validateForm () {
      if (this.whStaffPositions.includes(parseInt(this.userdata.position_job))) {
        if (!this.userdata.default_work || this.userdata.default_work.length === 0) {
          this.notify.success = false
          this.notify.message = 'Vui lòng chọn công việc mặc định'
          this.showNotification(false)
          return false
        }
      }
      return true
    },

    getListVehiclesOfCompany () {
      CompanyProfileService.getListVehiclesOfCompany(this.masterInfo.id).then(response => {
        if (response.data.success) {
          this.listVehicles = response.data.data
        }
      })
    },

    addUser () {
      let dataSend = {
        'company_id': this.masterInfo.id,
        'typeAccount': this.typeAccount,
        'username': this.userdata.username,
        'department_id': this.userdata.department_id,
        'position_job': this.userdata.position_job,
        'password': this.userdata.password,
        'password_confirm': this.userdata.password_confirm,
        'truck_order': this.userdata.truck_order
      }
      CompanyProfileService.addUser(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let userId = response.data.data.user_id
            commonHelper.showMessage(response.data.message, 'success')
            this.$router.push({ name: 'edit-user-company', params: { id: userId } })
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
            this.showNotification(false)
          }
        } else {
          this.notify.success = false
        }
      }).catch(e => {
        this.notify.success = false
        this.notify.message = 'Có lỗi xảy ra, liên hệ IT để được hỗ trợ'
        this.showNotification(false)
      }).then(() => {
        this.isProcessingUpdate = false
      })
    },

    editUser () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let dataSend = {
            'company_id': this.masterInfo.id,
            'typeAccount': this.typeAccount,
            'user_id': this.userdata.id,
            'username': this.userdata.username,
            'password': this.userdata.password,
            'password_confirm': this.userdata.password_confirm,
            'truck_order': this.userdata.truck_order
          }
          CompanyProfileService.editUser(dataSend).then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                // let userId = response.data.data.user_id
                this.$notify({
                  group: 'default',
                  type: 'text-white bg-primary',
                  text: response.data.message
                })
                // this.$router.push({ name: 'edit-user-company', params: { id: userId } })
              } else {
                this.$notify({
                  group: 'default',
                  type: 'text-white bg-warning',
                  title: 'Xảy ra lỗi',
                  text: response.data.message
                })
                this.showNotification(false)
              }
            } else {
              this.notify.success = false
            }
          }).catch(e => {
            this.notify.success = false
            this.notify.message = 'Có lỗi xảy ra, liên hệ IT để được hỗ trợ'
            this.showNotification(false)
          }).then(() => {
            this.isProcessingUpdate = false
          })
        } else {
          this.isProcessingUpdate = false
          this.notify.success = false
          this.notify.message = 'Vui lòng nhập đủ thông tin yêu cầu'
          this.showNotification(false)
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    handleSelectedDepartment (option) {
      this.userdata.department_id = option ? option.id : ''
      this.userdata.department = option ? option.name : ''
    },

    handleSelectedPosition (option) {
      this.userdata.position_job = option ? option.id : ''
    },

    handleChooseProfileCompany (option) {
      this.masterInfo.id = option ? option.id : ''
      this.getCompanyProfile(option.id)
    },

    getCompanyProfile () {
      let dataSend = {
        'master_id': this.masterInfo.id
      }
      CompanyProfileService.getCompanyProfile(dataSend).then((response) => {
        if (response.data.success) {
          this.masterInfo = response.data.data.detail
          this.getListVehiclesOfCompany()
        }
      })
    },

    getUserCompany () {
      let dataRequest = {
        user_id: this.$route.params.id
      }
      CompanyProfileService.getUserCompany(dataRequest).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let infoUser = response.data.data[0]
            this.masterInfo = infoUser.OrganizationProfile
            this.userdata.username = infoUser.ErpUser.username
            this.userdata.id = infoUser.ErpUser.id
            this.userdata.truck_order = infoUser.Truck.order
            this.userdata.position_job = infoUser.EmpProfile.position_job
            // Check xem có phải là tk quản lý xe thuê không
            if (infoUser.EmpProfile.position_job === '129') {
              this.isAddManager = true
              this.typeAccount = 2
            } else {
              this.isAddManager = false
              this.typeAccount = 1
            }
            this.getListVehiclesOfCompany()
          } else {
            this.notify.success = false
            this.notify.message = response.data.message
            this.showNotification(false)
          }
        } else {
          this.notify.message = 'Có lỗi xảy ra, không load được thông tin tài khoản'
          this.showNotification(false)
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    handleChooseTruck (option) {
      this.userdata.truck_order = option ? option.order : ''
    }
  }
}
</script>

<style>
    .row-bordered {
        overflow: unset;
    }

    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }

    #checkbox-default-work .custom-checkbox {
        margin-top: 3px;
        width: 22%;
    }
</style>
