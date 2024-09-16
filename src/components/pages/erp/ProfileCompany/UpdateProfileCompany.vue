<template>
    <div class="update-master">
        <div class="top-title">
            <h2 v-if="!isEdit">Thêm hồ sơ công ty</h2>
            <h2 v-else>Sửa hồ sơ công ty</h2>
            <div class="top-title__right-button">
                <ladda-btn :loading="isProcessingUpdate" @click.native="editCompanyProfile()" data-style="expand-right" class="btn btn-info">
                    <i class="icon ion-md-archive"></i> Cập nhật hồ sơ
                </ladda-btn>
                <router-link :to="{name: 'manager-master-company-profile'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header ttcn-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ttcn><i class="ion  ion-ios-add-circle"></i> Thông tin công ty</a>
                            </h6>
                            <b-collapse id="accordion-ttcn" visible>
                                <div class="card-body">
                                    <b-form-row>
                                        <b-media v-if="isEdit" vertical-align="center" class="col-md-2 col-lg-2 col-xl-2 text-center position-relative image-profile">
                                            <b-img :src="companyProfile.image_logo" style="width: 120px; height: 160px; object-fit: cover" alt="avatar"/>
                                        </b-media>
                                        <div class="col-md-10 col-lg-10 col-xl-10">
                                            <b-form-row class="mb-2">
                                            </b-form-row>
                                            <b-form-row>
                                                <b-form-group label="Trạng thái profile" id="group-fullname" class="col-md-3">
                                                    <b-form-select v-model="companyProfile.status" :options="statusOptions" :disabled="isPermissionForDisable"></b-form-select>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Loại đối tác <span class='red-text'>(*)</span>
                                                    </template>
                                                    <b-form-select v-model="companyProfile.organization_type" :options="selectRegions" class="mb-3" name="organization_type" v-validate="'required'" :disabled="isPermissionForDisable">
                                                        <template v-slot:first>
                                                            <option :value="null" disabled>-- Chọn loại đối tác --</option>
                                                        </template>
                                                    </b-form-select>
                                                    <span v-show="errors.firstRule('organization_type') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Tên công ty <span class='red-text'>(*)</span>
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.fullname"
                                                            id="fullname"
                                                            name="fullname"
                                                            v-validate="'required'"
                                                            placeholder="Tên công ty"
                                                            :class="{'is-danger': errors.has('fullname')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('fullname') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Tên rút gọn <span class='red-text'>(*)</span>
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.short_name"
                                                            id="short_name"
                                                            name="short_name"
                                                            v-validate="'required'"
                                                            placeholder="Tên công ty"
                                                            :class="{'is-danger': errors.has('short_name')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('short_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Mã số thuế <span class='red-text'>(*)</span>
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.tax_iden_number"
                                                            id="tax_iden_number"
                                                            name="tax_iden_number"
                                                            v-validate="'required'"
                                                            placeholder="Mã số thuế"
                                                            :class="{'is-danger': errors.has('tax_iden_number')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('tax_iden_number') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group>
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Tài khoản ngân hàng
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.bank_account_number"
                                                            id="bank_account_number"
                                                            name="bank_account_number"
                                                            v-validate="'required'"
                                                            placeholder="Tài khoản ngân hàng"
                                                            :class="{'is-danger': errors.has('bank_account_number')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('bank_account_number') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Tên ngân hàng
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.bank_name"
                                                            id="bank_name"
                                                            name="bank_name"
                                                            v-validate="'required'"
                                                            placeholder="Tên ngân hàng"
                                                            :class="{'is-danger': errors.has('bank_name')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('bank_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Đại diện pháp lý
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.legal_representative_name"
                                                            id="legal_representative_name"
                                                            name="legal_representative_name"
                                                            v-validate="'required'"
                                                            placeholder="Đại diện pháp lý"
                                                            :class="{'is-danger': errors.has('legal_representative_name')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('guarantor_name') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Số điện thoại liên hệ
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.contact_tel"
                                                            id="contact_tel"
                                                            name="contact_tel"
                                                            v-validate="{required: true, numeric: true}"
                                                            placeholder="Điện thoại liên hệ"
                                                            :class="{'is-danger': errors.has('contact_tel')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('contact_tel') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                    <span v-show="errors.firstRule('contact_tel') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Email liên hệ
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.contact_email"
                                                            id="contact_email"
                                                            name="contact_email"
                                                            v-validate="{required: true, email:true}"
                                                            placeholder="Email liên hệ"
                                                            :class="{'is-danger': errors.has('contact_email')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('contact_email') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                    <span v-show="errors.firstRule('contact_email') == 'email'" class="help is-danger">Email không đúng định dạng </span>
                                                </b-form-group >
                                                <b-form-group label="Miền" class="col-md-3">
                                                    <single-select-profile-region
                                                            @handleSelectedRegion="handleSelectedRegion"
                                                            :region="companyProfile.region" :is-disabled="isPermissionForDisable">
                                                    </single-select-profile-region>
                                                </b-form-group >
                                                <b-form-group class="col-md-3">
                                                    <template slot='label'>
                                                        Địa chỉ văn phòng
                                                    </template>
                                                    <b-form-input
                                                            v-model="companyProfile.current_address_detail"
                                                            id="current_address_detail"
                                                            name="current_address_detail"
                                                            v-validate="'required'"
                                                            placeholder="Địa chỉ văn phòng"
                                                            :class="{'is-danger': errors.has('current_address_detail')}"
                                                            :disabled="isPermissionForDisable"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('current_address_detail') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                            </b-form-row>
                                        </div>
                                    </b-form-row>
                                </div>
                            </b-collapse>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="isEdit && isAirLine">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header ttcn-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-list-vehicles><i class="ion  ion-ios-add-circle"></i> Thông tin AWB</a>
                            </h6>
                            <b-collapse id="accordion-list-vehicles" visible>
                                <b-card-body>
                                    <list-air-way-bill :company-id="this.$route.params.id"></list-air-way-bill>
                                </b-card-body>
                            </b-collapse>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <b-card no-body class="mb-2" v-if="isEdit && !(isAirLine || isPermissionForDisable)">
            <h6 class="card-header">
                <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-list-users><i class="ion  ion-ios-add-circle"></i> Danh sách tài khoản liên kết</a>
            </h6>
            <b-collapse id="accordion-list-users" visible>
                <b-card-body>
                    <div v-if="!listUsers || listUsers.length === 0">
                        Chưa có tài khoản nào được tạo.
                        <router-link :to="{name: 'add-user-company', params: { id: this.$route.params.id }}" class="btn btn-outline-success btn-sm"><i class="ion ion-ios-add"></i> Thêm tài khoản mới</router-link>
                    </div>
                    <div v-else>
                        <company-profile-list-user :list-users="listUsers" :list-vehicles="listVehicles" @getCompanyProfile="getCompanyProfile()"></company-profile-list-user>
                        <router-link :to="{name: 'add-user-company', params: { id: this.$route.params.id }}" class="btn btn-outline-success btn-sm"><i class="ion ion-ios-add"></i> Thêm tài khoản mới</router-link>
                    </div>
                </b-card-body>
            </b-collapse>
        </b-card>

        <div class="row" v-if="isEdit && !isAirLine">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header ttcn-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-list-vehicles><i class="ion  ion-ios-add-circle"></i> Thông tin xe được liên kết</a>
                            </h6>
                            <b-collapse id="accordion-list-vehicles" visible>
                                <b-card-body>
                                    <div v-if="!listVehicles || listVehicles.length === 0">
                                        Chưa có xe thuê nào được tạo
                                        <router-link :to="{name: 'add-vehicle-company', params: { id: this.$route.params.id }}" v-if="showButtonAddTruck" class="btn btn-outline-success btn-sm"><i class="ion ion-ios-add"></i> Thêm xe liên kết</router-link>
                                    </div>
                                    <div v-else>
                                        <company-list-vehicle :list-vehicles.sync="listVehicles" @reloadTruck="getCompanyProfile"></company-list-vehicle>
                                        <router-link :to="{name: 'add-vehicle-company', params: { id: this.$route.params.id }}" v-if="showButtonAddTruck" class="btn btn-outline-success btn-sm"><i class="ion ion-ios-add"></i> Thêm xe liên kết</router-link>
                                    </div>
                                </b-card-body>
                            </b-collapse>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="!isPermissionForDisable">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header ttcn-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.price-rent-car><i class="ion  ion-ios-add-circle"></i> Bảng giá</a>
                            </h6>
                            <b-collapse id="price-rent-car" visible>
                                <price-unit v-bind:company_id="this.$route.params.id"></price-unit>
                            </b-collapse>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      <div class="row" v-if="isEdit && !isAirLine">
        <div class="col-md-12">
          <div class="card mb-4">
            <div class="row no-gutters row-bordered">
              <div class="col-md-12 col-lg-12 col-xl-12">
                <h6 class="card-header ttcn-header d-flex justify-content-between">
                  <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-list-rents><i class="ion ion-ios-add-circle"></i> Kế hoạch vận hành xe thuê</a>
                  <div>
                    <b-btn class="btn btn-outline-success btn-sm" v-b-modal.upload-rent-plan><i class="fas fa-upload"></i> Tải file </b-btn>
                    <router-link :to="{name: 'add-truck-plan', params: { id: this.$route.params.id }}" class="btn btn-outline-success btn-sm ml-1"><i class="ion ion-ios-add"></i> Thêm mới</router-link>
                  </div>
                </h6>
                <b-collapse id="accordion-list-rents" visible>
                  <b-card-body>
                    <div>
                      <rent-list-plan :profileId="this.$route.params.id" :isFresh="isRefresh"></rent-list-plan>
                    </div>
                  </b-card-body>
                </b-collapse>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Danh sách tài xế xe thuê -->
      <div class="row" v-if="isEdit && !isAirLine">
        <div class="col-md-12">
          <div class="card mb-4">
            <div class="row no-gutters row-bordered">
              <div class="col-md-12 col-lg-12 col-xl-12">
                <h6 class="card-header ttcn-header d-flex justify-content-between">
                  <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-list-driver-rents><i class="ion ion-ios-add-circle"></i> Thông tin tài xế xe thuê</a>
                  <div>
                    <b-btn class="btn btn-outline-success btn-sm" v-b-modal.upload-rent-driver><i class="fas fa-upload"></i> Tải file </b-btn>
                    <router-link :to="{name: 'add-truck-driver', params: { id: this.$route.params.id }}" class="btn btn-outline-success btn-sm ml-1"><i class="ion ion-ios-add"></i> Thêm mới tài xế</router-link>
                  </div>
                </h6>
                <b-collapse id="accordion-list-driver-rents" visible>
                  <b-card-body>
                    <div>
                      <rent-list-driver :profileId="this.$route.params.id" :isFresh="isRefreshDriver"></rent-list-driver>
                    </div>
                  </b-card-body>
                </b-collapse>
              </div>
            </div>
          </div>
        </div>
      </div>

<!--        <div class="row">-->
<!--            <div class="col-md-12">-->
<!--                <div class="card mb-4">-->
<!--                    <div class="row no-gutters row-bordered">-->
<!--                        <div class="col-md-12 col-lg-12 col-xl-12">-->
<!--                            <h6 class="card-header ttcn-header">-->
<!--                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.price-rent-car><i class="ion  ion-ios-add-circle"></i> Hợp đồng</a>-->
<!--                            </h6>-->
<!--                            <b-collapse id="price-rent-car" visible>-->
<!--                                <div style="margin-left: 20px;margin-top: 10px">-->
<!--                                    <a href="">Hợp đồng từ ngày 2017-12-20 đến 2018-12-20</a>-->
<!--                                </div>-->
<!--                                <div style="margin-left: 20px;margin-top: 5px; margin-bottom: 10px">-->
<!--                                    <a href="">Hợp đồng từ ngày 2019-12-20 đến 2021-12-20</a>-->
<!--                                </div>-->
<!--                            </b-collapse>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
      <ModalUploadRentPlan id="upload-rent-plan" :profile-id="companyProfile.id" :is-show="isShowModalUploadRentPlan" @toggleModal="toggleModalUploadRentPlan" :is-hide-footer="true"/>
      <ModalUploadRentDriver id="upload-rent-driver" :profile-id="companyProfile.id" :is-show="isShowModalUploadRentDriver" @toggleModal="toggleModalUploadRentDriver" :is-hide-footer="true"/>
    </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style lang="scss" scoped>
    @import "src/assets/sass/components/master-profile";
    .mt-8 {
        margin-top: 8px;
    }
</style>

<script>
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import CompanyProfileListUser from 'components/pages/erp/ProfileCompany/ListUserForCompany'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectBank from 'components/elements/common/SingleSelectBank'
import SingleSelectBankBrand from 'components/elements/common/SingleSelectBankBrand'
import SingleSelectRelation from 'components/elements/common/SingleSelectRelation'
import MasterCompanyProfile from 'domain/entities/MasterCompanyProfile'
import CompanyProfileService from 'domain/services/company-profile-service'
import CompanyListVehicle from './CompanyListVehicle'
import PriceUnit from './PriceUnit'
import ListAirWayBill from './ListAirWayBill'
import commonHelper from 'infrastructures/helpers/common-helpers'
import RentListPlan from './RentListPlan'
import ModalUploadRentPlan from './ModalUploadRentPlan'
import ModalUploadRentDriver from './ModalUploadRentDriver'
import RentListDriver from './RentListDriver'
import { mapGetters } from 'vuex'

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'update-master-profile',

  components: {
    LaddaBtn,
    SingleSelectRelation,
    SingleSelectProfileRegion,
    Notification,
    Multiselect,
    Datepicker,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    CompanyProfileListUser,
    SingleSelectDepartment,
    SingleSelectBank,
    SingleSelectBankBrand,
    SingleSelectPosition,
    CompanyListVehicle,
    ListAirWayBill,
    PriceUnit,
    RentListPlan,
    ModalUploadRentPlan,
    RentListDriver,
    ModalUploadRentDriver
  },

  data: () => ({
    currUser: {},
    toggleLog: false,
    isLoading: false,
    isProcessingUpdate: false,
    listUsers: [],
    listVehicles: [],
    listAwbs: [],
    statusOptions: MasterCompanyProfile.statusOptions,
    keyword: '',
    contract: null,
    companyProfile: {
      status: 'active', // Trạng thái
      organization_type: null, // Loại tổ chức
      fullname: '', // Tên công ty
      short_name: '', // Tên rút gọn
      region: '', // Miền
      cooperate_date: '',
      terminate_date: '',
      legal_representative_name: '',
      legal_representative_tel: '',
      legal_representative_cmnd: '',
      current_address_province: '', // Chỗ hiện tại  Tỉnh/TP
      current_address_district: '', // Chỗ hiện tại  Quận/Huyện
      current_address_sub_district: '', // Chỗ hiện tại Xã/phường
      current_address_detail: '', // Chỗ hiện tại / Chi tiết
      contact_tel: '',
      contact_email: '',
      bank_name: '', // Tên ngân hàng ( bank_code)
      bank_account_number: '', // Số TK ngân hàng
      bank_account_name: '', // Tên chủ TK ngân hàng
      bank_brand: '', // Chi nhánh ngân hàng
      tax_iden_number: '', // Mã số thuế
      image_logo: '',
      cnb_confirmed: 0
    },
    selectRegions: [
      { value: 'Vận tải Đường bộ', text: 'Vận tải Đường bộ' },
      { value: 'Vận tải Đường sắt', text: 'Vận tải Đường sắt' },
      { value: 'Vận tải Hàng không', text: 'Vận tải Hàng không' },
      { value: 'Vận tải Đường thủy', text: 'Vận tải Đường thủy' },
      { value: 'Shop', text: 'Shop' }
    ],
    notify: {
      message: '',
      class: '',
      title: ''
    },
    allowEditLeave: false,
    permissions: null,
    imageProfile: null,
    isShowModalUploadRentPlan: false,
    isRefresh: false,
    isShowModalUploadRentDriver: false,
    isRefreshDriver: false,
    isPermission: false,
    isPermissionForDisable: false,
    showButtonAddTruck: true,
    statusToQlts: 0
  }),

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    isEdit: function () {
      return this.$route.params.id > 0
    },
    isAirLine: function () {
      return this.companyProfile.organization_type === 'Vận tải Hàng không'
    }
  },

  created () {
    this.getStatusCompanyProfileToQlts()
    this.getCompanyProfile()
    this.checkPermission()
  },

  mounted () {

  },

  methods: {
    getCompanyProfile: function () {
      this.$startLoading()
      this.isLoading = true
      // load profile to edit
      let dataRequest = {
        master_id: this.$route.params.id
      }
      CompanyProfileService.getCompanyProfile(dataRequest).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (!response.data.isSameProfile) {
            this.$router.push('/profile-company/masters')
          }
          if (response.data.success) {
            let data = response.data.data
            this.companyProfile = data.detail
            this.listUsers = data.listUsers
            this.listVehicles = data.listVehicles
          } else {
            this.companyProfile = null
            this.notify.success = false
            this.notify.message = response.data.message
            this.showNotification(false)
          }
        } else {
          this.companyProfile = null
          this.notify.success = false
          this.notify.message = 'Có lỗi xảy ra, không load được thông tin profile'
          this.showNotification(false)
        }
      }).catch((error) => {
        this.companyProfile = null
        console.log(error)
      }).then(() => {
        this.isLoading = false
        this.$stopLoading()
      })
    },

    editCompanyProfile () {
      let dataSend = new FormData()
      dataSend.append('id', this.companyProfile.id)
      dataSend.append('fullname', this.companyProfile.fullname)
      dataSend.append('short_name', this.companyProfile.short_name)
      dataSend.append('status', this.companyProfile.status)
      dataSend.append('region', this.companyProfile.region)
      dataSend.append('organization_type', this.companyProfile.organization_type)
      dataSend.append('tax_iden_number', this.companyProfile.tax_iden_number)
      dataSend.append('bank_account_number', this.companyProfile.bank_account_number)
      dataSend.append('bank_name', this.companyProfile.bank_name)
      dataSend.append('contact_tel', this.companyProfile.contact_tel)
      dataSend.append('contact_email', this.companyProfile.contact_email)
      dataSend.append('current_address_detail', this.companyProfile.current_address_detail)
      dataSend.append('legal_representative_name', this.companyProfile.legal_representative_name)

      CompanyProfileService.editCompanyProfile(dataSend)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
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

    handleSelectedRegion (option) {
      this.companyProfile.region = option ? option.id : ''
    },

    toggleModalUploadRentPlan (isShow) {
      this.isShowModalUploadRentPlan = isShow
      this.isRefresh = !this.isRefresh
    },

    toggleModalUploadRentDriver (isShow) {
      this.isShowModalUploadRentDriver = isShow
      this.isRefreshDriver = !this.isRefreshDriver
    },

    checkPermission () {
      if (this.userInfo.ErpPosition.id === '129') {
        this.showButtonAddTruck = false
      }
      let params = {provider_id: this.$route.params.id}
      CompanyProfileService.checkPermission(params)
        .then(res => {
          if (res.data.success) {
            this.isPermission = res.data.success
          }
          if (this.$route.params.id > 0 && res.data.isNCC) {
            this.isPermissionForDisable = true
          }
        })
        .catch(err => {
          console.log('Has error in checkHO ', err)
        })
    },

    getStatusCompanyProfileToQlts () {
      let params = {}
      CompanyProfileService.getStatusCompanyProfileToQlts(params)
        .then(res => {
          if (res.data.success) {
            this.statusToQlts = res.data.data.data
            if (this.statusToQlts === 1) {
              window.location.href = '/adm/error/404'
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
