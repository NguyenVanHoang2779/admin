<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading text-center">Chuyển Tiền COD Nhanh</h4>
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
                                <b-form-group label="Chọn kho">
                                    <select-stations @selected="selected.stations = $event" ref="select_stations"></select-stations>
                                </b-form-group>
                            </div>
                        </b-form-row>
                        <b-form-row>
                            <div class="col-md-6">
                                <b-form-group label="Chọn ngân hàng">
                                    <select-bank-shop @selected="selected.banks = $event" ref="select_banks"></select-bank-shop>
                                </b-form-group>
                            </div>
                            <div class="col-md-6">
                                <b-form-group label="Chọn loại đơn">
                                    <select-package-type @selected="selected.packageTypes = $event" ref="select_package_types"></select-package-type>
                                </b-form-group>
                            </div>
                        </b-form-row>
                    </div>
                    <b-form-row>
                        <div class="align-content-center center">
                            <b-button
                                    @click="resetForm"
                                    class="btn"
                            >
                                Nhập lại
                            </b-button>
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
                </form>
            </div>
            <div v-if="successTransfer">
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
                                    <th width="40%">Thông tin shop</th>
                                    <th width="50%">Chi tiết chuyển tiền</th>
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
                                        <span class="font-weight-bold">Email: </span><span>{{ dataShops.Shop.email }}</span> <br/>
                                        <span class="font-weight-bold">Kiểu đối soát: </span>
                                            <span v-if="dataShops.Shop.audit == 'manual'">
                                              Đối soát thủ công
                                            </span>
                                            <span v-if="dataShops.Shop.audit == 'auto'">
                                              Đối soát tự động
                                            </span>
                                        <br/><br/>
                                        <span class="font-weight-bold">Email đối soát: </span><span>{{ dataShops.Shop.against_email }}</span> <br/>
                                        <span class="font-weight-bold">Số tài khoản: </span><span>{{ dataShops.Shop.against_bank_account }}</span> <br/>
                                        <span class="font-weight-bold">Tên người hưởng: </span><span>{{ dataShops.Shop.against_bank_own }}</span> <br/>
                                        <span class="font-weight-bold">Mã Ngân hàng: </span><span>{{ dataShops.Shop.against_bank_name }}</span> <br/>
                                    </td>
                                    <td class="bill-info">
                                        <span class="font-weight-bold">Tổng thu hộ: </span><span>{{ parseFloat(dataShops.Shop.total_pick_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí ship: </span><span>{{ parseFloat(dataShops.Shop.total_ship_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí bảo hiểm: </span><span>{{ parseFloat(dataShops.Shop.total_insurance) | toCurrency }}</span><br/>
                                        <span class="font-weight-bold">Shop trả trước: </span><span>{{ parseFloat(dataShops.Shop.total_prepayment) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí chuyển hoàn: </span><span>{{ parseFloat(dataShops.Shop.total_return_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Khuyến mãi: </span><span>{{ parseFloat(dataShops.Shop.total_discount) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí thay đổi địa chỉ giao: </span><span>{{ parseFloat(dataShops.Shop.total_ch_addr_fee) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Phí chuyển khoản: </span><span>{{ parseFloat(dataShops.Shop.transfer_fee) | toCurrency }}</span> <br/><br/>
                                        <span class="font-weight-bold">Tiền chuyển shop: </span><span>{{ parseFloat(dataShops.Shop.total_cashback) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Số lượng ĐH: </span><span>{{ dataShops.Shop.count_pkg }}</span> <br/>
                                    </td>
                                    <td>
                                        <ladda-btn
                                                @click.native="showModal(dataShops.Shop.order, dataShops.Shop.transfer_fee, dataShops.Shop.code)"
                                                data-style="zoom-out"
                                                class="btn btn-success"
                                                :disabled="!dataShops.Shop.canTransfer"
                                        >
                                            Chuyển tiền
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
            <b-modal ref="quickTransferModal" size="lg" scrollable title="Xác nhận chuyển tiền">
                <div class="row pb-5">
                    <div class="col-md-4">
                        <span class="font-weight-bold">Tổng thu hộ: {{ shopTotalPickMoney | toCurrency }}</span> <br />
                        <span class="font-weight-bold">Tổng tiền chuyển: {{ shopTotalCashBack | toCurrency }}</span> <br />
                        <span class="font-weight-bold">SL ĐH: {{ shopTotalPkgTransfer }}</span> <br />
                    </div>
                    <div class="col-md-4">
                        <span class="font-weight-bold">Phí ship: {{ shopTotalShipMoney | toCurrency }}</span> <br />
                        <span class="font-weight-bold">Shop trả trước: {{ shopTotalPrepayment | toCurrency }}</span> <br />
                        <span class="font-weight-bold">Phí chuyển hoàn: {{ shopTotalReturnFee | toCurrency }}</span> <br />
                    </div>
                    <div class="col-md-4">
                        <span class="font-weight-bold">Phí bảo hiểm: {{ shopTotalInsurance | toCurrency }}</span> <br />
                        <span class="font-weight-bold">Phí thay đổi địa chỉ giao: {{ shopTotalChAddrFee | toCurrency }}</span> <br />
                        <span class="font-weight-bold">Khuyến mãi: {{ shopTotalDiscountAmount | toCurrency }}</span> <br />
                        <span class="font-weight-bold">Phí chuyển khoản: {{(shopTotalCashBack > 0) ? shopTransferFee : 0 | toCurrency }}</span> <br />
                    </div>
                </div>
                <div v-if="failTransfer">
                    <b-alert show dismissible variant="danger">
                        <i class="sidenav-icon ion ion-ios-warning"></i>
                        {{ message }}
                    </b-alert>
                </div>
                <div class="d-block scrollable strip">
                    <div class="table-responsive mb-4">
                        <table class="table mb-0 table-bordered table-striped">
                            <thead class="" style="width: 100%">
                                <tr>
                                    <th width="40%">Thông tin đơn hàng</th>
                                    <th width="35%">Ghi chú</th>
                                    <th width="25%">
                                      <select-checkbox @selected-type="filterSelectedType"
                                                       @re-selected-pkg="reSelectPkg"
                                                       :data-select="selected.packageTypes"></select-checkbox>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr class="no-data" v-if="filterPkgData.length == 0">
                              <td colspan="3" style="height: 200px; vertical-align: middle">
                                <b-alert show variant="warning">Không tìm thấy dữ liệu phù hợp, vui lòng kiểm tra lại!</b-alert>
                              </td>
                            </tr>
                            <tr v-for="pkg in filterPkgData" class="tr-bill">
                                <td>
                                    <a
                                            :href="clickAlias(pkg.alias)"
                                            target="_blank"
                                            class="text-decoration-none text-alias"
                                    >
                                        {{ pkg.alias }}
                                    </a> <br />
                                    <span class="font-weight-bold">Trạng thái: </span> {{ packageStatuses[pkg.package_status_id] }} <br/>
                                    <span class="font-weight-bold">Tiền thu hộ: </span> {{ parseFloat(pkg.pick_money) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Phí ship: </span> {{ parseFloat(pkg.ship_money) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Phí bảo hiểm: </span> {{ parseFloat(pkg.insurance) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Shop trả trước: </span> {{ parseFloat(pkg.prepayment) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Phí chuyển hoàn: </span> {{ parseFloat(pkg.return_fee) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Khuyến mãi: </span> {{ parseFloat(pkg.discount) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Phí thay đổi địa chỉ giao: </span> {{ parseFloat(pkg.ch_addr_fee) | toCurrency }}<br/>
                                    <span class="font-weight-bold">Tiền chuyển shop: </span> {{ parseFloat(pkg.cashback) | toCurrency }}<br/>
                                </td>
                                <td class="bill-info">
                                    <span class="font-weight-bold" v-if="pkg.is_freeship == 1">Free Ship cho khách</span>
                                    <span class="font-weight-bold" v-if="pkg.is_freeship == 0">Khách trả tiền Ship</span>
                                    <br/>
                                    <span class="font-weight-bold">Loại đơn: </span> {{ pkg.region_type | regionType }}<br/>
                                </td>
                                <td>
                                    <b-form-checkbox
                                        v-model="selectedPkgs"
                                        :value="pkg.order"
                                    >
                                        <span class="font-weight-bold">Chọn</span>
                                    </b-form-checkbox>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <template v-slot:modal-footer="{ ok }">
                    <ladda-btn
                      :loading="loading[8]"
                      @click.native="handleOk(8)"
                      data-style="zoom-out"
                      class="btn btn-primary"
                      :disabled="disableConfirm"
                    >
                      Xác nhận chuyển tiền
                    </ladda-btn>
                </template>
            </b-modal>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import transferService from 'domain/services/transfer-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectPackageType from 'components/elements/FilterBox/SelectPackageType'
import SelectBankShop from 'components/elements/FilterBox/SelectBankShop'
import SelectCheckbox from 'components/forms/SelectCheckbox'

Vue.use(BlockUI)

export default {
  components: {
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom,
    SidenavRouterLink,
    SelectStations,
    SelectBankShop,
    SelectCheckbox,
    SelectPackageType
  },
  data: () => ({
    selected: {
      stations: [],
      packageTypes: [],
      banks: []
    },
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
    packageStatuses: [],
    isManageAllShop: false,
    successTransfer: false,
    failTransfer: false,
    dismissSeconds: 5,
    dismissCountDownSE: 0,
    msgNotify: '',
    message: '',
    shopOrderTransfer: '',
    shopCodeTransfer: '',
    shopTotalCashBack: '',
    shopTotalPickMoney: '',
    shopTotalDiscountAmount: '',
    shopTotalPrepayment: '',
    shopTotalReturnFee: '',
    shopTotalShipMoney: '',
    shopTotalInsurance: '',
    shopTotalChAddrFee: '',
    shopTransferFee: '',
    shopTotalPkgTransfer: '',
    packageWaitTransfer: [],
    filterPkgData: [],
    listPkgOrder: [],
    selectedPkgs: [],
    allSelected: false,
    transferDone: false,
    selectAuditType: { name: 'Tất cả', code: '' },
    auditType: [
      { name: 'Tất cả', code: '' },
      { name: 'Đối soát thủ công', code: 'manual' },
      { name: 'Đối soát tự động', code: 'auto' }
    ],
    disableConfirm: true
  }),
  methods: {
    resetForm: function () {
      // Reset data of component select box
      this.shops.shop_code = ''
      this.$refs.select_stations.reset()
      this.$refs.select_banks.reset()
      this.$refs.select_package_types.reset()
    },
    showModal: function (shopOrder, transferFee, shopCode) {
      this.shopOrderTransfer = shopOrder
      this.shopCodeTransfer = shopCode
      this.packageWaitTransfer = []
      this.listPkgOrder = []
      this.selectedPkgs = []
      this.shopTransferFee = 0
      this.failTransfer = false
      let dataSend = {
        'shop_order': shopOrder,
        'package_type': this.selected.packageTypes
      }
      transferService.viewPackageWaitTransfer(dataSend).then(response => {
        if (response.data.success) {
          this.packageWaitTransfer = response.data.options.packages
          this.listPkgOrder = response.data.options.listPkgOrder
          this.shopTransferFee = transferFee
        } else {
          this.packageWaitTransfer = []
          this.listPkgOrder = []
          this.shopTransferFee = 0
        }
        this.filterPkgData = JSON.parse(JSON.stringify(this.packageWaitTransfer))
        this.selectedPkgs = this.listPkgOrder
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
      })
      this.$refs.quickTransferModal.show()
    },
    hideModal: function () {
      this.$refs.quickTransferModal.hide()
    },
    clickAlias: function (alias) {
      return '/admin?alias=' + alias
    },
    searchShop: function (page, newSearchConditions, i) {
      let self = this

      let dataSend = {
        'shop_code': self.shops.shop_code,
        'station_id': self.selected.stations,
        'against_bank_name': self.selected.banks,
        'package_type': self.selected.packageTypes,
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
      transferService.searchShopQuickTransfer(dataSend).then(response => {
        if (response.data.success) {
          self.packageStatuses = response.data.options.packageStatuses
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
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
    handleOk (i) {
      let data = {
        'shop_order': this.shopOrderTransfer,
        'list_pkg_order': this.selectedPkgs
      }
      this.handleSubmit(data, i)
    },
    handleSubmit: function (data, i) {
      if (!confirm('Bạn chắc chắn muốn chuyển tiền ' + this.selectedPkgs.length +
        ' đơn hàng cho shop ' + this.shopCodeTransfer + '?')) {
        return
      }
      let self = this
      self.loadingTransfer = true
      this.startLoading(i)
      transferService.quickTransfer(data).then(result => {
        if (result.data.success) {
          self.$refs.quickTransferModal.hide()
          self.searchShop(self.pageData.currentPage, true, 7)
          self.transferDone = true
          self.msgNotify = result.data.message
          self.failTransfer = false
        } else {
          self.loadingTransfer = false
          self.failTransfer = true
          self.transferDone = false
          self.message = result.data.message
        }
        self.updateLoadingValue(i, false)
      }).catch(error => {
        if (error) {
          self.loadingTransfer = false
          alert('Có lỗi xảy ra. Vui lòng kiểm tra lại!')
        }
        self.updateLoadingValue(i, false)
      }).then(function () {
        if (self.transferDone) {
          self.successTransfer = true
          self.dismissCountDownSE = self.dismissSeconds
        }
        self.updateLoadingValue(i, false)
      })
    },
    filterSelectedType: function (e) {
      this.listPkgOrder = []
      this.filterPkgData = []
      for (const pkg in this.packageWaitTransfer) {
        if (e.includes(this.packageWaitTransfer[pkg].region_type)) {
          this.listPkgOrder.push(this.packageWaitTransfer[pkg].order)
          this.filterPkgData.push(this.packageWaitTransfer[pkg])
        }
      }
      this.selectedPkgs = this.listPkgOrder.slice()
    },
    reSelectPkg: function (e) {
      this.selectedPkgs = []
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
    selectedPkgs: function (newVal, oldVal) {
      // Tính lại tổng tiền dựa trên số đơn hàng selected
      this.shopTotalCashBack = 0
      this.shopTotalPickMoney = 0
      this.shopTotalDiscountAmount = 0
      this.shopTotalPrepayment = 0
      this.shopTotalReturnFee = 0
      this.shopTotalShipMoney = 0
      this.shopTotalInsurance = 0
      this.shopTotalChAddrFee = 0
      this.shopTotalPkgTransfer = newVal.length
      for (const pkg in this.packageWaitTransfer) {
        if (newVal.includes(this.packageWaitTransfer[pkg].order)) {
          this.shopTotalCashBack += parseFloat(this.packageWaitTransfer[pkg].cashback)
          this.shopTotalPickMoney += parseFloat(this.packageWaitTransfer[pkg].pick_money)
          this.shopTotalDiscountAmount += parseFloat(this.packageWaitTransfer[pkg].discount)
          this.shopTotalPrepayment += parseFloat(this.packageWaitTransfer[pkg].prepayment)
          this.shopTotalReturnFee += parseFloat(this.packageWaitTransfer[pkg].return_fee)
          this.shopTotalShipMoney += parseFloat(this.packageWaitTransfer[pkg].ship_money)
          this.shopTotalInsurance += parseFloat(this.packageWaitTransfer[pkg].insurance)
          this.shopTotalChAddrFee += parseFloat(this.packageWaitTransfer[pkg].ch_addr_fee)
        }
      }
      if (this.shopTotalCashBack > 0) {
        this.shopTotalCashBack -= parseFloat(this.shopTransferFee)
        if (this.shopTotalCashBack > 0) {
          this.disableConfirm = false
        }
      } else {
        this.disableConfirm = true
      }
    }
  },
  filters: {
    toCurrency: function (value) {
      if (typeof value !== 'number' || value === 0) {
        return value
      }
      let formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })
      return formatter.format(value)
    },
    regionType: function (value) {
      if (!value) return ''
      if (value === 'noitinh') {
        return 'Nội tỉnh'
      } else if (value === 'noimien') {
        return 'Nội miền'
      } else if (value === 'lienmien') {
        return 'Liên miền'
      } else if (value === 'dacbiet') {
        return 'Đặc biệt'
      } else {
        return ''
      }
    },
    areaType: function (value) {
      if (!value) return ''
      if (value === 'noithanh') {
        return 'Nội thành'
      } else if (value === 'ngoaithanh') {
        return 'Ngoại thành'
      } else if (value === 'huyenxa') {
        return 'Huyện, xã'
      } else {
        return ''
      }
    }
  },
  created () {
    this.searchShop(this.pageData.currentPage)
  }
}
</script>
<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<style lang="scss" scoped>
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
    .errorClass {
        border: 1px solid red;
    }
    .emptyInput {
        border: 1px solid red;
    }
    .fee-count {
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
    .fee-transfer {
        display: table-cell;
        vertical-align: top;
        padding-left: 15px;
    }
    .form-filter {
        border: 1px solid #ccc;
        border-radius: 5px;
        background: white;
        padding: 20px;
    }
    >>> .modal-body {
        padding: 5px;
    }
    .fee-count-transfer > div {
        padding: 0 50px;
    }
    .loading-container .loading-backdrop {
        background: #fff !important;
        opacity: .7 !important;
    }
    .loading-container .loading {
        background: none !important;
        box-shadow: none !important;
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
    .log-bill {
        margin: 10px;
    }
    .scrollable {
        max-height: 600px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .strip>div:nth-child(odd){
        background: #f8f8f8;
    }
</style>
