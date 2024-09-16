<template>
  <div>
    <div class="ui-block">
      <b-form-row>
        <h4 class="ui-block-heading col-md-10">Quản lý Shop sai thông tin ngân hàng</h4>
      </b-form-row>
      <div>
        <form>
          <div class="form-filter">
            <b-form-row>
              <div class="col-md-4">
                <b-form-group label="Mã shop">
                  <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy" v-model="shops.shop_code"/>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Email">
                  <b-input type="text" placeholder="Nhiều email cách nhau bởi dấu phẩy" v-model="shops.shop_email"/>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Tên">
                  <b-input type="text" placeholder="Nhiều tên cách nhau bởi dấu phẩy" v-model="shops.shop_name"/>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-4">
                <b-form-group label="Điện thoại">
                  <b-input type="text" placeholder="Nhiều số điện thoại cách nhau bởi dấu phẩy" v-model="shops.shop_tel"/>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Trạng thái shop">
                  <select-shop-stt @selected="selected.shopStt = $event" ref="select_shopStt"></select-shop-stt>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Kiểu shop">
                  <select-shop-type @selected="selected.shopType = $event" ref="select_shopType"></select-shop-type>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-4">
                <b-form-group label="Chọn kho">
                  <select-stations @selected="selected.stations = $event" ref="select_stations"></select-stations>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Thời gian">
                  <multiselect
                      v-model="selectTimeType"
                      track-by="name"
                      label="name"
                      placeholder="Chọn kiểu thời gian"
                      :options="timeType"
                      selectLabel=""
                      selectedLabel=""
                      deselectLabel=""
                      :allow-empty="false">
                  </multiselect>
                </b-form-group>
              </div>
              <div class="col-md-2">
                <b-form-group label="Từ:">
                  <datepicker
                      v-model="from"
                      :bootstrapStyling="true"
                      :format="customFormatter"
                      class="from-date"
                      :clear-button="true"
                      :typeable="true"
                      @cleared="from = ''"
                      v-on:selected="dateSelectedFromInChild"
                      v-bind:disabled="inputDisable"
                  />
                </b-form-group>
              </div>
              <div class="col-md-2">
                <b-form-group label="Đến:">
                  <datepicker
                      v-model="to"
                      :bootstrapStyling="true"
                      :format="customFormatter"
                      class="to-date"
                      :clear-button="true"
                      :typeable="true"
                      @cleared="to = ''"
                      v-on:selected="dateSelectedToInChild"
                      v-bind:disabled="inputDisable"
                  />
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <select-province-and-district
                  @getProvince="selected.province = $event"
                  @getDistrict="selected.district = $event" ref="select_province_district"></select-province-and-district>
              <div class="col-md-4">
                <b-form-group label="CSKH">
                  <select-ctmCare @selected="selected.ctmCare = $event" ref="select_ctmCare"></select-ctmCare>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-4">
                <b-form-group label="Người tạo">
                  <select-user-shop @selected="selected.user_created = $event" ref="select_user_created"></select-user-shop>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Người gửi mail">
                  <select-user-shop @selected="selected.user_email = $event" ref="select_user_email"></select-user-shop>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Người quản lý">
                  <select-user-shop @selected="selected.user_manager = $event" ref="select_user_manager"></select-user-shop>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-4">
                <b-form-group label="Sai tên người hưởng">
                  <multiselect
                    v-model="selectErBankOwn"
                    track-by="code"
                    return="code"
                    label="name"
                    placeholder="Chọn kiểu sai thông tin"
                    :options="typeErrorBankOwn"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel=""
                    :multiple="true">
                  </multiselect>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Sai số tài khoản">
                  <multiselect
                    v-model="selectErBankAccount"
                    track-by="code"
                    label="name"
                    placeholder="Chọn kiểu sai thông tin"
                    :options="typeErrorBankAccount"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel=""
                    :multiple="true">
                  </multiselect>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Kiểu đối soát">
                  <multiselect
                    v-model="selectAuditType"
                    track-by="name"
                    label="name"
                    placeholder="Chọn kiểu đối soát"
                    :options="auditType"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel=""
                    :allow-empty="false">
                  </multiselect>
                </b-form-group>
              </div>
            </b-form-row>
            <div>
              <input
                  type="checkbox"
                  v-bind:value=1
                  v-model="checkboxAuditing"
                  name="Auditing"
                  @click="checkAuditing($event)"
              >
              Shop có đơn đang chờ đối soát
            </div>
          </div>
          <b-form-row>
            <div class="align-content-center center">
              <ladda-btn
                  @click.native="resetForm"
                  data-style="zoom-out"
                  class="btn"
              >
                Nhập lại
              </ladda-btn>
              <ladda-btn
                  :loading="loading[7]"
                  @click.native="searchShop(pageData.currentPage, true, 7)"
                  data-style="zoom-out"
                  class="btn btn-success"
              >
                <i class="sidenav-icon ion ion-md-search"></i>
                Tìm kiếm
              </ladda-btn>
            </div>
          </b-form-row>
          <!-- Modal edit bank -->
          <div>
            <b-modal ref="myModalRefTransfer" title="Sửa thông tin ngân hàng" @ok="handleOk" modal-class="model_bank" size="400"
                     ok-title="Lưu" cancel-title="Đóng" static>
              <div  class="no-data" v-if="successModel === false">
                <b-alert show dismissible variant="warning">
                  <i class="sidenav-icon ion ion-ios-warning"></i>
                  {{ notEmpty }}
                </b-alert>
              </div>
              <div v-if="errEditBankInfo" v-for="msg in message">
                <b-alert show dismissible variant="warning">
                  <i class="sidenav-icon ion ion-ios-warning"></i>
                  {{ msg }}
                </b-alert>
              </div>
              <form @submit.stop.prevent="handleSubmit">
                <b-form-group>
                  <b-form-group class="col mb-0">
                    <label class="font-weight-bold">Email</label>&nbsp;&nbsp;<label class="text-danger">{{ invalidShop.invalid_email }}</label>
                    <b-input v-bind:class="{ errorClass: errEmail }" @keyup.native="errEmail = false" placeholder="Nhập email đối soát" type="text" v-model="againstEmail"/>
                  </b-form-group>
                </b-form-group>

                <b-form-group>
                  <b-form-group class="col mb-0">
                    <label class="font-weight-bold">Chủ tài khoản NH</label>&nbsp;&nbsp;<label class="text-danger">{{ invalidShop.invalid_bank_own }}</label>
                    <b-input v-bind:class="{ errorClass: errBankName }" @keyup.native="errBankName = false" placeholder="Nguyễn Văn A" type="text" v-model="bankName"/>
                  </b-form-group>
                </b-form-group>

                <b-form-group>
                  <b-form-group class="col">
                    <label class="font-weight-bold">Số TK</label>&nbsp;&nbsp;<label class="text-danger">{{ invalidShop.invalid_bank_account }}</label>
                    <b-input v-bind:class="{ errorClass: errBankAcc }" @keyup.native="errBankAcc = false" placeholder="0987xxxxxx" type="text" v-model="bankAccount"/>
                  </b-form-group>
                </b-form-group>

                <b-form-group>
                  <select-bank-model
                      @selectedBank="selected.bank = $event"
                      @selectedBankBrand="selected.bankBrand = $event"
                      ref="select_banks_model"
                  >
                  </select-bank-model>
                </b-form-group>
              </form>
            </b-modal>
          </div>
        </form>
      </div>
      <!-- Fill data -->
      <div class="result" id="results" v-if="checkResult">
        <b-card no-body v-if="listShops.length > 0">
          <!-- / Table controls -->
          <div class="table-result">
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination :total-rows="pageData.totalItems"
                                v-model="pageData.currentPage"
                                :per-page="pageData.perPage"
                                v-on:change="pageChanged"
                  />
                  Tổng số shop: {{ pageData.totalItems }}
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
            <!-- / Pagination -->
            <!-- Table -->
            <div class="table-responsive mb-4">
              <table class="table mb-0 table-bordered table-striped">
                <thead class="" style="width: 100%">
                <tr>
                  <th width="45%">Thông tin shop</th>
                  <th width="45%">Thông tin tài khoản</th>
                  <th width="5%">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="dataShops in listShops" class="tr-bill">
                  <td>
                    <span class="badge align-text-bottom badge-success" v-if="dataShops.Shop.shop_type == 1">PRO</span>
                    <span class="badge align-text-bottom badge-danger" v-if="dataShops.Shop.shop_type == 2">VIP</span>
                    <span class="badge align-text-bottom badge-info" v-if="dataShops.Shop.shop_type == 3">PRE</span>
                    <span class="font-weight-bold">{{ dataShops.Shop.code }} - {{ dataShops.Shop.name }}</span> <br/>
                    <span class="font-weight-bold">Số ĐT: </span><span>{{ dataShops.Shop.tel }}</span> <br/>
                    <span class="font-weight-bold">Email: </span><span>{{ dataShops.Shop.email }}</span> <br/>
                    <span class="font-weight-bold">Địa chỉ: </span><span>{{ dataShops.Shop.first_address }}</span> <br/>
                    <span  v-if="isManageAllShop"><span class="font-weight-bold">Kho: </span><span>{{ dataShops.Shop.station_name }}</span> <br/></span>
                    <span class="font-weight-bold">Thời gian tạo: </span><span>{{ dataShops.Shop.created }}</span> <br/>
                    <span class="font-weight-bold">Người tạo: </span><span v-if=" dataShops.Shop.created_username === null">Shop tự đăng ký</span>
                    <span>{{ dataShops.Shop.created_username }}</span> <br/>
                    <span class="font-weight-bold">CSKH: </span><span>{{ dataShops.Shop.ctm_care }}</span> <br/>
                    <span class="font-weight-bold">Trạng thái: </span><span>{{ dataShops.Shop.shop_status_id | shopStatus }}</span> <br/>
                  </td>
                  <td class="bill-info">
                    <span class="font-weight-bold">Tên người liên hệ: </span><span>{{ dataShops.Shop.against_fullname }}</span> <br/>
                    <span class="font-weight-bold">Điện thoại: </span><span>{{ dataShops.Shop.against_tel }}</span> <br/>
                    <span class="font-weight-bold">Email: </span><span>{{ dataShops.Shop.against_email }}</span>
                    <span class="text-danger" v-if="dataShops.InvalidBankInfo.invalid_email != null">  {{ dataShops.InvalidBankInfo.invalid_email }}</span> <br/>
                    <span class="font-weight-bold">Chủ tài khoản ngân hàng: </span><span>{{ dataShops.Shop.against_bank_own }}</span>
                    <span class="text-danger" v-if="dataShops.InvalidBankInfo.invalid_bank_own != null">  {{ dataShops.InvalidBankInfo.invalid_bank_own }}</span> <br/>
                    <span class="font-weight-bold">Số tài khoản ngân hàng: </span><span>{{ dataShops.Shop.against_bank_account }}</span>
                    <span class="text-danger" v-if="dataShops.InvalidBankInfo.invalid_bank_account != null">  {{ dataShops.InvalidBankInfo.invalid_bank_account }}</span> <br/>
                    <span class="font-weight-bold">Ngân hàng: </span><span v-if="dataShops.Shop.bank_name === ''">{{ dataShops.Shop.against_bank_name }}</span>
                    <span>{{ dataShops.Shop.bank_name }}</span><br/>
                    <span class="font-weight-bold">Chi nhánh ngân hàng: </span><span v-if="dataShops.Shop.brand_name === ''">{{ dataShops.Shop.against_bank_brand }}</span>
                    <span>{{ dataShops.Shop.brand_name }}</span><br/>
                  </td>
                  <td>
                    <ladda-btn
                        @click.native="editBankInfo(dataShops.Shop.code, dataShops.Shop.against_bank_account,
                        dataShops.Shop.against_bank_own, dataShops.Shop.against_email, dataShops.Shop.order)"
                        data-style="zoom-out"
                        class="btn btn-success"
                    >
                      <i class="sidenav-icon ion ion-md-create"></i>
                      Sửa
                    </ladda-btn>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination :total-rows="pageData.totalItems"
                                v-model="pageData.currentPage"
                                :per-page="pageData.perPage"
                                v-on:change="pageChanged"
                  />
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
          </div>
        </b-card>
        <div class="no-data" v-if="listShops.length == 0">
          <b-alert show dismissible variant="warning">
            <i class="sidenav-icon ion ion-ios-warning"></i>
            Không có dữ liệu phù hợp, vui lòng thử lại.
          </b-alert>
        </div>
      </div>
      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
      <BlockUI message="" :html="htmlTransfer" v-if="loadingTransfer" />
    </div>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectProvinceAndDistrict from 'components/elements/FilterBox/SelectProvinceAndDistrict'
import SelectUserShop from 'components/elements/FilterBox/SelectUserShop'
import SelectCtmCare from 'components/elements/FilterBox/SelectCtmCare'
import SelectShopStt from 'components/elements/FilterBox/SelectShopStt'
import SelectShopType from 'components/elements/FilterBox/SelectShopType'
import SelectBankModel from 'components/elements/FilterBox/SelectBankModel'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import shopService from 'domain/services/shop-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import config from 'config/app.base'
import axios from 'axios'

Vue.use(BlockUI)

export default {
  components: {
    SelectCtmCare,
    SelectStations,
    SelectProvinceAndDistrict,
    SelectUserShop,
    SelectShopStt,
    SelectShopType,
    SelectBankModel,
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom
  },
  data: () => ({
    selected: {
      shopStt: [],
      shopType: [],
      stations: [],
      province: [],
      district: [],
      ctmCare: [],
      user_created: '',
      user_email: '',
      user_manager: '',
      auditType: ''
    },
    from: '',
    to: '',
    shops: {
      shop_code: '',
      shop_email: '',
      shop_tel: '',
      shop_name: ''
    },
    loading: [false, false, false, false, false, false, false, false, false, false, false, false],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    checkResult: false,
    appLoading: false,
    loadingTransfer: false,
    htmlTransfer: `<div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>
        <h5 class="text-center mb-0">Đang xử lý...</h5>`,
    listShops: [],
    inputDisable: false,
    packageStatuses: [],
    selectTimeType: { name: 'Thời gian tạo', code: 'created' },
    timeType: [
      { name: 'Thời gian tạo', code: 'created' },
      { name: 'Thời gian gửi email', code: 'last_sent_consultant_email' },
      { name: 'Đã tạo đơn hàng', code: 'created_packages' },
      { name: 'Không có đơn hàng nào', code: 'no_created_packages' },
      { name: 'Đơn hàng đầu tiên', code: 'first_completed' }
    ],
    selectAuditType: { name: 'Tất cả', code: '' },
    auditType: [
      { name: 'Tất cả', code: '' },
      { name: 'Đối soát thủ công', code: 'manual' },
      { name: 'Đối soát tự động', code: 'auto' }
    ],
    selectErBankOwn: [],
    selectedErBankOwn: [],
    typeErrorBankOwn: [
      { name: 'Tên tài khoản rỗng', code: 'bank_own_empty' },
      { name: 'Tên tài khoản có ký tự không hợp lệ', code: 'bank_own_invalid' },
      { name: 'Tên tài khoản vượt quá 50 ký tự', code: 'bank_own_max' },
      { name: 'Số tài khoản và tên tài khoản không khớp nhau', code: 'bank_own_not_match' }
    ],
    selectErBankAccount: [],
    selectedErBankAccount: [],
    typeErrorBankAccount: [
      { name: 'Số tài khoản rỗng', code: 'bank_acc_empty' },
      { name: 'Số tài khoản ít hơn 6 ký tự', code: 'bank_acc_min' },
      { name: 'Số tài khoản có ký tự không hợp lệ', code: 'bank_acc_invalid' },
      { name: 'Số tài khoản không được vượt quá 50 ký tự', code: 'bank_acc_max' }
    ],
    successModel: true,
    bankAccount: '',
    bankName: '',
    sendShopCode: '',
    againstEmail: '',
    message: [],
    errEditBankInfo: false,
    notEmpty: '',
    auditing: '',
    checkboxAuditing: '',
    invalidShop: '',
    errEmail: false,
    errBankName: false,
    errBankAcc: false,
    errBank: false,
    errBankBrand: false,
    isManageAllShop: false
  }),
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    dateSelectedFromInChild: function (date) {
      this.from = date
    },
    dateSelectedToInChild: function (date) {
      this.to = date
    },
    resetForm: function () {
      // Reset data of component select box
      this.shops.shop_code = ''
      this.shops.shop_email = ''
      this.shops.shop_name = ''
      this.shops.shop_tel = ''
      this.$refs.select_shopStt.reset()
      this.$refs.select_shopType.reset()
      this.$refs.select_stations.reset()
      this.from = ''
      this.to = ''
      this.$refs.select_province_district.reset()
      this.$refs.select_ctmCare.reset()
      this.$refs.select_user_created.reset()
      this.$refs.select_user_email.reset()
      this.$refs.select_user_manager.reset()
      this.selectAuditType = { name: 'Tất cả', code: '' }
      this.selectErBankOwn = []
      this.selectErBankAccount = []
      this.selectTimeType = { name: 'Thời gian tạo', code: 'created' }
    },
    checkAuditing: function (e) {
      if (e.target.checked) {
        this.auditing = e.target.checked
      } else {
        this.auditing = ''
      }
    },
    searchShop: function (page, newSearchConditions, i) {
      let self = this

      let dataSend = {
        'code': self.shops.shop_code,
        'email': self.shops.shop_email,
        'name': self.shops.shop_name,
        'tel': self.shops.shop_tel,
        'shop_status_id': self.selected.shopStt,
        'shop_type': self.selected.shopType,
        'station_id': self.selected.stations,
        'date_type': self.selectTimeType.code,
        'date_from': self.from === '' ? '' : this.customFormatter(self.from),
        'date_to': self.to === '' ? '' : this.customFormatter(self.to),
        'province_id': self.selected.province,
        'district_id': self.selected.district,
        'user_id': self.selected.ctmCare,
        'created_user_id': self.selected.user_created,
        'consultant_id': self.selected.user_email,
        'manager_id': self.selected.user_manager,
        'audit': self.selectAuditType.code,
        'auditing': self.auditing,
        'invalid_bank_own': self.selectedErBankOwn,
        'invalid_bank_account': self.selectedErBankAccount,
        'page': page
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      // Enable loading
      self.appLoading = true
      this.startLoading(i)
      shopService.searchShopIncorrectBankInfo(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
          self.isManageAllShop = response.data.options.isManageAllShop
          self.updateLoadingValue(i, false)
        } else {
          self.updateLoadingValue(i, false)
        }
      }).catch(error => {
        if (error) {
          self.updateLoadingValue(i, false)
        }
      }).then(function () {
        self.updateLoadingValue(i, false)
        self.appLoading = false
      })
    },
    startLoading (i) {
      if (this.loading[i]) {
        return
      }
      this.updateLoadingValue(i, true)
    },
    updateLoadingValue (index, value) {
      this.loading[index] = value
      // Trigger update
      this.loading = this.loading.slice(0)
    },
    pageChanged: function (page) { // Event check pagination change
      this.searchShop(page)
      this.pageData.currentPage = page
    },
    handleOk (evt) {
      evt.preventDefault()
      this.loadingTransfer = true
      let data = ''

      this.errBankAcc = false
      this.errBankName = false
      this.errEmail = false
      this.errBank = false
      this.errBankBrand = false
      if (!this.bankAccount || !this.bankName || !this.selected.bank || !this.selected.bankBrand) {
        if (!this.bankAccount) {
          this.errBankAcc = true
        }
        if (!this.bankName) {
          this.errBankName = true
        }
        if (!this.selected.bank) {
          this.errBank = true
        }
        if (!this.selected.bankBrand) {
          this.errBankBrand = true
        }
        this.notEmpty = 'Không được để trống thông tin'
        this.successModel = false
        this.errEditBankInfo = false
        this.loadingTransfer = false
        this.$refs.select_banks_model.submit(this.errBank, this.errBankBrand)
      } else {
        this.notEmpty = ''
        this.successModel = true
        this.errBankAcc = false
        this.errBankName = false
        this.errEmail = false
        this.errBank = false
        this.errBankBrand = false
        this.$refs.select_banks_model.submit(this.errBank, this.errBankBrand)
        data = {
          'email': this.againstEmail,
          'bank': this.selected.bank,
          'bank_brand': this.selected.bankBrand,
          'bank_account': this.bankAccount,
          'bankName': this.bankName,
          'shop_code': this.sendShopCode
        }
        this.handleSubmit(data)
      }
    },
    handleSubmit: function (data) {
      this.loadingTransfer = true
      shopService.saveBankInfo(data).then(result => {
        if (result.data.success) {
          this.$refs.myModalRefTransfer.hide()
          this.searchShop(this.pageData.currentPage, true, 7)
          this.loadingTransfer = false
          this.errEditBankInfo = false
          this.successModel = true
        } else {
          this.loadingTransfer = false
          this.message = result.data.message_error
          this.errEmail = result.data.error.errEmail
          this.errBankName = result.data.error.errBankName
          this.errBankAcc = result.data.error.errBankAcc
          this.errEditBankInfo = true
        }
      })
    },
    editBankInfo: function (shopCode, stk, bkName, email, shopOrder) {
      this.$refs.myModalRefTransfer.show()
      this.errBankAcc = false
      this.errBankName = false
      this.errEmail = false
      this.errBank = false
      this.errBankBrand = false
      this.errEditBankInfo = false
      this.successModel = true
      this.$refs.select_banks_model.submit(this.errBank, this.errBankBrand)
      let data = {
        'shop_code': shopCode
      }
      this.sendShopCode = shopCode
      this.bankAccount = stk
      this.bankName = bkName
      this.againstEmail = email
      this.$refs.select_banks_model.fillOption(data)
      axios.get(config.baseApiUrl + 'AdShopBank/getInvalidShop/' + shopOrder).then(response => {
        if (response.data.success) {
          this.invalidShop = response.data.data
        }
      })
    }
  },
  computed: {
    totalItems () {
      return this.listBills.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  watch: {
    selectErBankOwn (newValues) {
      this.selectedErBankOwn = newValues.map(obj => obj.code)
    },
    selectErBankAccount (newValues) {
      this.selectedErBankAccount = newValues.map(obj => obj.code)
    }
  },
  filters: {
    shopStatus: function (value) {
      if (!value) return ''
      if (value === '1') {
        return 'Đang làm việc'
      } else if (value === '2') {
        return 'Đã dừng'
      } else if (value === '3') {
        return 'Chưa kiểm duyệt'
      } else {
        return 'Tiếp tục liên hệ'
      }
    }
  }
}
</script>
<style scoped>
  .center {
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .fee-count, .download-file-banks {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
    display: block;
    margin: 10px 0;
    padding: 12px;
    position: relative;
    background-color: white;
  }
  .total-fee {
    box-sizing: border-box;
    display: table-cell;
    vertical-align: top;
    padding-left: 60px;
  }
  .form-filter {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    padding: 20px;
  }
  .bill-show-package {
    position: absolute;
    top: 10px;
    right: 0;
    border: 1px solid #ccc;
    padding: 0px;
    border-radius: 5px;
    color: #1e70cd;
  }
  .bill-info {
    position: relative;
  }
  .package-bill {
    margin: 10px;
  }
  .text-alias {
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  span >>> .summary-content, span >>> table {
    display: none;
  }
  .multiselect--active {
    z-index: 99;
  }
  >>> div.modal .modal-dialog.modal-400 {
    width: 40% !important;
  }
  >>> div.modal .modal-dialog.modal-400 .btn-secondary {
    margin-bottom: 0px !important;
    width: 16% !important;
  }
  .errorClass {
    border: 1px solid red;
  }
  .emptyInput {
    border: 1px solid red;
  }
</style>
