<template>
    <div>
        <div class="ui-block">
            <b-form-row>
                <h4 class="ui-block-heading col-md-6">Gán cam kết hoàn</h4>
                <div class="col-md-6 center">
                    <b-button
                            @click="showImportModal"
                            class="btn btn-success"
                    >
                        <i class="sidenav-icon ion ion-md-information-circle"></i>
                        Thông tin các gói cam kết hoàn
                    </b-button>
                    <b-button class="btn btn-warning">
                        <sidenav-router-link to="/shops/return-coupon-result"><i class="sidenav-icon ion ion-md-fastforward"></i>Kết quả cam kết hoàn</sidenav-router-link>
                    </b-button>
                </div>
            </b-form-row>
            <div>
                <form>
                    <div class="form-filter">
                        <b-form-row>
                            <div class="col-md-6">
                                <b-form-group label="Mã shop">
                                    <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: S1,S2..." v-model="shops.shop_code"/>
                                </b-form-group>
                            </div>
                            <div class="col-md-6">
                                <b-form-group label="CSKH">
                                    <select-ctmCare @selected="selected.ctmCare = $event" ref="select_ctmCare"></select-ctmCare>
                                </b-form-group>
                            </div>
                        </b-form-row>
                        <b-form-row>
                            <div class="col-md-3">
                                <b-form-group
                                        label="Chọn kiểu shop">
                                    <multiselect
                                            v-model="selectShopType"
                                            track-by="name"
                                            label="name"
                                            placeholder="Chọn kiểu shop"
                                            :options="shopTypes"
                                            :searchable="false"
                                            :allow-empty="false">
                                    </multiselect>
                                </b-form-group>
                            </div>
                            <div class="col-md-3">
                                <b-form-group label="Gói cam kết hoàn">
                                    <select-rc-type @selected="selected.rcType = $event" ref="select_rcType"></select-rc-type>
                                </b-form-group>
                            </div>
                            <div class="col-md-6">
                                <b-form-group
                                        label="Thời gian áp dụng">
                                    <multiselect
                                            v-model="selectExpireType"
                                            track-by="name"
                                            label="name"
                                            placeholder="Chọn thời gian áp dụng"
                                            :options="expireTypes"
                                            :searchable="false"
                                            :allow-empty="false">
                                    </multiselect>
                                </b-form-group>
                            </div>
                        </b-form-row>
                    </div>
                    <b-form-row>
                        <div class="align-content-center center">
                            <ladda-btn
                                    :loading="loading[7]"
                                    @click.native="searchShop(pageData.currentPage, true, 7)"
                                    data-style="zoom-out"
                                    class="btn btn-success"
                            >
                                <i class="sidenav-icon ion ion-md-search"></i>
                                Tìm shop
                            </ladda-btn>
                        </div>
                    </b-form-row>
                    <!-- Modal edit bank -->
                    <div>
                        <b-modal ref="myModalRefRcShop" title="Sửa thông tin cam kết hoàn shop" @ok="handleOk" modal-class="model_bank" size="400"
                                 ok-title="Lưu" cancel-title="Đóng" static>
                            <div  class="no-data" v-if="successModel === false">
                                <b-alert show dismissible variant="warning">
                                    <i class="sidenav-icon ion ion-ios-warning"></i>
                                    {{ notEmpty }}
                                </b-alert>
                            </div>
                            <div v-if="errEditShopInfo" v-for="msg in message">
                                <b-alert show dismissible variant="warning">
                                    <i class="sidenav-icon ion ion-ios-warning"></i>
                                    {{ msg }}
                                </b-alert>
                            </div>
                            <form @submit.stop.prevent="handleSubmit">
                                <b-form-group>
                                    <b-form-group class="col mb-0">
                                        <label class="font-weight-bold">Mã shop</label>
                                        <b-input type="text" v-model="sendShopCode" :disabled="true"/>
                                    </b-form-group>
                                </b-form-group>

                                <b-form-group>
                                    <multi-select-rc-shop
                                            @selectedRcShop="selected.rcTypeShop = $event"
                                            @selectedNumberPkg="numberPkg = $event"
                                            @selectedReValue="reValue = $event"
                                            @selectedMonthExpire="monthExpire = $event"
                                            ref="select_rc_shop"
                                    >
                                    </multi-select-rc-shop>
                                </b-form-group>
                            </form>
                        </b-modal>
                    </div>
                </form>
            </div>
            <div v-if="successSave">
                <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
                    {{ msgNotify }}
                </b-alert>
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
                                    <th width="45%">Thông tin cam kết hoàn</th>
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
                                        <br/>
                                        <span class="font-weight-bold">Số ĐT: </span><span>{{ dataShops.Shop.tel }}</span> <br/>
                                        <span class="font-weight-bold">Email: </span><span>{{ dataShops.Shop.email }}</span> <br/>
                                        <span class="font-weight-bold">CSKH: </span><span>{{ dataShops.Shop.ctm_care }}</span> <br/>
                                        <span class="font-weight-bold">Trạng thái: </span><span>{{ dataShops.Shop.shop_status_id | shopStatus }}</span> <br/>
                                        <span class="font-weight-bold">Thời gian tạo: </span><span>{{ dataShops.Shop.created }}</span> <br/>
                                    </td>
                                    <td class="bill-info">
                                        <span class="font-weight-bold">Gói: </span><span class="badge align-text-bottom badge-success">{{ dataShops.ReturnCouponType.name }}</span> <br/>
                                        <span class="font-weight-bold">Số đơn hàng: </span><span>{{ dataShops.ReturnCouponShop.number_pkg }}</span> <br/>
                                        <span class="font-weight-bold">Tỉ lệ cam kết: </span><span v-if="dataShops.ReturnCouponShop.re_value > 0">
                                        {{ dataShops.ReturnCouponShop.re_value }} %</span><br/>
                                        <span class="font-weight-bold">Số tháng đã chạy / áp dụng: </span><span v-if="dataShops.ReturnCouponType.name" class="font-weight-bold text-danger">
                                        {{ dataShops.ReturnCouponShop.month_run }} / {{ dataShops.ReturnCouponShop.month_expire }}</span> <br/>
                                        <span class="font-weight-bold">Thời gian gán: </span><span>{{ dataShops.ReturnCouponShop.created }}</span> <br/>
                                        <br/>
                                        <span class="font-weight-bold">Cập nhật: </span><span>{{ dataShops.ReturnCouponShop.modified }}</span>
                                    </td>
                                    <td>
                                        <ladda-btn
                                                @click.native="editShopInfo(dataShops.Shop.code, dataShops.Shop.order)"
                                                data-style="zoom-out"
                                                class="btn btn-success"
                                                :disabled="!isCanEdit"
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
            <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingTransfer" />
            <b-modal ref="rcTypeInfoModal" size="lg" title="Thông tin các gói cam kết hoàn" static>
                <div class="d-block">
                    <div class="table-responsive mb-4">
                        <table class="table mb-0 table-bordered table-striped">
                            <thead class="" style="width: 100%">
                            <tr>
                                <th width="10%">Mã</th>
                                <th width="30%">Tên gói</th>
                                <th width="60%">Chi tiết</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="info in rcTypeInfo" class="tr-bill">
                                <td>
                                    <span class="font-weight-bold">{{ info.ReturnCouponType.id }}</span>
                                </td>
                                <td class="bill-info">
                                    <span class="font-weight-bold">{{ info.ReturnCouponType.name }}</span>
                                </td>
                                <td>
                                    <span class="font-weight-bold" v-html="info.ReturnCouponType.desc"></span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="modal-footer" class="w-100">
                    <b-btn class="float-right" variant="default" @click="hideImportModal">
                        Đóng
                    </b-btn>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import SelectCtmCare from 'components/elements/FilterBox/SelectCtmCare'
import SelectRcType from 'components/elements/FilterBox/SelectRcType'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import shopService from 'domain/services/shop-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import config from 'config/app.base'
import axios from 'axios'
import SelectUserShop from 'components/elements/FilterBox/SelectUserShop'
import MultiSelectRcShop from 'components/elements/FilterBox/MultiSelectRcShop'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'

Vue.use(BlockUI)

export default {
  components: {
    SelectCtmCare,
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom,
    SelectRcType,
    SelectUserShop,
    MultiSelectRcShop,
    SidenavRouterLink
  },
  data: () => ({
    selected: {
      ctmCare: [],
      rcType: '',
      rcTypeShop: []
    },
    from: '',
    to: '',
    shops: {
      shop_code: ''
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
        <h5 class="text-center mb-0">LOADING...</h5>`,
    listShops: [],
    inputDisable: false,
    packageStatuses: [],
    successModel: true,
    rcShopId: '',
    sendShopCode: '',
    sendShopOrder: '',
    rcTypeShop: [],
    numberPkg: [],
    reValue: [],
    monthExpire: [],
    message: [],
    errEditShopInfo: false,
    notEmpty: '',
    checkboxAuditing: '',
    invalidShop: '',
    errRcType: [],
    errNumberPkg: [],
    errReValue: [],
    errMonthExpire: [],
    countOk: 0,
    isManageAllShop: false,
    successSave: false,
    dismissSeconds: 10,
    dismissCountDownSE: 0,
    msgNotify: '',
    rcTypeInfo: '',
    isCanEdit: false,
    selectExpireType: { name: 'Chọn thời gian áp dụng', expire_type: '' },
    expireTypes: [
      { name: 'Chọn thời gian áp dụng', expire_type: '' },
      { name: 'Đã hết thời gian áp dụng', expire_type: 'expired' },
      { name: 'Còn thời gian áp dụng', expire_type: 'not_expired' }
    ],
    selectShopType: { name: 'Chọn kiểu shop', shop_type: '' },
    shopTypes: [
      { name: 'Chọn kiểu shop', type: '' },
      { name: 'Pro', type: '1' },
      { name: 'Standard', type: '0' }
    ]
  }),
  methods: {
    showImportModal: function () {
      this.$refs.rcTypeInfoModal.show()
    },
    hideImportModal: function () {
      this.$refs.rcTypeInfoModal.hide()
    },
    getRcTypeInfo: function () {
      axios.get(config.baseApiUrl + 'shops/getRcTypeInfo').then(response => {
        if (response.data.success) {
          this.rcTypeInfo = response.data.data
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    resetForm: function () {
      // Reset data of component select box
      this.shops.shop_code = ''
      this.$refs.select_ctmCare.reset()
      this.$refs.select_rcType.reset()
    },
    searchShop: function (page, newSearchConditions, i) {
      let self = this

      let dataSend = {
        'shop_code': self.shops.shop_code,
        'ctm_care_id': self.selected.ctmCare,
        'rc_type_id': self.selected.rcType,
        'expire_type': self.selectExpireType.expire_type,
        'shop_type': self.selectShopType.type,
        'page': page
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      // Enable loading
      self.loadingTransfer = true
      this.startLoading(i)
      shopService.searchReturnCouponShop(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
          self.isCanEdit = response.data.options.isCanEdit
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
        self.loadingTransfer = false
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

      this.errRcType = []
      this.errNumberPkg = []
      this.errReValue = []
      this.errMonthExpire = []
      this.countOk = 0
      if (this.selected.rcTypeShop) {
        for (let i = 0; i < this.selected.rcTypeShop.length; i++) {
          this.errRcType[i] = false
          this.errNumberPkg[i] = false
          this.errReValue[i] = false
          this.errMonthExpire[i] = false
          if (((parseInt(this.selected.rcTypeShop[i].code) !== 6) && !this.selected.rcTypeShop[i].numberPkg) ||
            !this.selected.rcTypeShop[i].monthExpire ||
            (![7].includes(parseInt(this.selected.rcTypeShop[i].code)) && !this.selected.rcTypeShop[i].reValue)
          ) {
            if ((parseInt(this.selected.rcTypeShop[i].code) !== 6) && !this.selected.rcTypeShop[i].numberPkg) {
              this.errNumberPkg[i] = true
            }
            if ((parseInt(this.selected.rcTypeShop[i].code) !== 7) && !this.selected.rcTypeShop[i].reValue) {
              this.errReValue[i] = true
            }
            if (!this.selected.rcTypeShop[i].monthExpire) {
              this.errMonthExpire[i] = true
            }
            this.notEmpty = 'Không được để trống thông tin'
            this.successModel = false
            this.errEditShopInfo = false
            this.loadingTransfer = false
            this.$refs.select_rc_shop.submit(this.errRcType, this.errNumberPkg, this.errReValue, this.errMonthExpire)
          } else {
            this.countOk++
            this.errRcType[i] = false
            this.errNumberPkg[i] = false
            this.errReValue[i] = false
            this.errMonthExpire[i] = false
            this.$refs.select_rc_shop.submit(this.errRcType, this.errNumberPkg, this.errReValue, this.errMonthExpire)
          }
        }

        if (this.countOk === this.selected.rcTypeShop.length) {
          this.successModel = true
        }
      }
      if (this.successModel) {
        this.notEmpty = ''
        this.successModel = true
        this.errRcType = []
        this.errNumberPkg = []
        this.errReValue = []
        this.errMonthExpire = []
        this.$refs.select_rc_shop.submit(this.errRcType, this.errNumberPkg, this.errReValue, this.errMonthExpire)
        data = {
          'rc_shop': this.selected.rcTypeShop,
          's_order': this.sendShopOrder
        }
        this.handleSubmit(data, this.sendShopCode)
      }
    },
    handleSubmit: function (data, shopCode) {
      if (!confirm('Bạn chắc chắn muốn cập nhật gói cam kết hoàn của shop ' + shopCode + '?')) {
        this.loadingTransfer = false
        return
      }
      this.loadingTransfer = true
      this.errEditShopInfo = false
      shopService.saveRcShop(data).then(result => {
        if (result.data.success) {
          this.$refs.myModalRefRcShop.hide()
          this.searchShop(this.pageData.currentPage, false, 7)
          this.successModel = true
          this.successSave = true
          this.dismissCountDownSE = this.dismissSeconds
          this.msgNotify = result.data.message
        } else {
          this.loadingTransfer = false
          this.message = result.data.message_error
          this.errEditShopInfo = true
        }
      })
    },
    editShopInfo: function (shopCode, shopOrder) {
      this.$refs.myModalRefRcShop.show()
      this.errRcType = []
      this.errNumberPkg = []
      this.errReValue = []
      this.errMonthExpire = []
      this.errEditShopInfo = false
      this.successModel = true
      let data = {
        'shop_order': shopOrder
      }
      this.sendShopCode = shopCode
      this.sendShopOrder = shopOrder
      this.$refs.select_rc_shop.submit(this.errRcType, this.errNumberPkg, this.errReValue, this.errMonthExpire)
      this.$refs.select_rc_shop.fillOption(data)
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
  },
  created () {
    this.getRcTypeInfo()
  }
}
</script>
<style scoped>
    .center {
        text-align: center;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .form-filter {
        border: 1px solid #ccc;
        border-radius: 5px;
        background: white;
        padding: 20px;
    }
    .bill-info {
        position: relative;
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
