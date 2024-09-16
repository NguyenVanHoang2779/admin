<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading text-center">Xác Nhận Thanh Toán Nợ Một Phần</h4>
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
                                <b-form-group label="Trạng thái">
                                    <multiselect
                                            v-model="selectRequestStatus"
                                            track-by="name"
                                            label="name"
                                            placeholder="Chọn trạng thái"
                                            :options="requestStatus"
                                            :searchable="false"
                                            :allow-empty="false">
                                    </multiselect>
                                </b-form-group>
                            </div>
                        </b-form-row>
                        <b-form-row>
                            <div class="col-md-6">
                                <b-form-group label="Mã hóa đơn âm">
                                    <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy" v-model="shops.bill_code"/>
                                </b-form-group>
                            </div>
                            <div class="col-md-3">
                                <b-form-group label="Từ:">
                                    <datepicker
                                            v-model="from"
                                            :bootstrapStyling="true"
                                            :format="customFormatter"
                                            class="from-date"
                                            v-on:selected="dateSelectedFromInChild"
                                            v-bind:disabled="inputDisable"
                                    />
                                </b-form-group>
                            </div>
                            <div class="col-md-3">
                                <b-form-group label="Đến:">
                                    <datepicker
                                            v-model="to"
                                            :bootstrapStyling="true"
                                            :format="customFormatter"
                                            class="to-date"
                                            v-on:selected="dateSelectedToInChild"
                                            v-bind:disabled="inputDisable"
                                    />
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
                                    @click.native="searchRequest(pageData.currentPage, true, 7)"
                                    data-style="zoom-out"
                                    class="btn btn-success"
                            >
                                <i class="sidenav-icon ion ion-md-search"></i>
                                Tìm kiếm
                            </ladda-btn>
                              <b-button
                                    @click="exportFile"
                                    class="btn btn-primary"
                            >
                            <i class="sidenav-icon ion ion-ios-filing"></i>
                                Xuất file
                            </b-button>
                        </div>
                    </b-form-row>
                </form>
            </div>
            <div v-if="successConfirm">
                <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
                    {{ msgNotify }}
                </b-alert>
            </div>
            <!-- Fill data -->
            <div class="result" id="results" v-if="checkResult">
                <b-card no-body v-if="listRequest.length > 0">
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
                                    Tổng số yêu cầu: {{ pageData.totalItems }}
                                </div>
                                <div class="col-sm text-sm-left text-center pt-3">
                                    <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                                </div>
                            </div>
                        </b-card-body>
                        <!-- / Pagination -->
                        <!-- Table -->
                        <div class="table-responsive mb-4">
                            <table class="table mb-0 table-bordered">
                                <thead class="" style="width: 100%">
                                <tr>
                                    <th width="45%">Thông tin hóa đơn âm</th>
                                    <th width="45%">Yêu cầu thanh toán một phần</th>
                                    <th width="10%" class="text-center">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(dataReq, index) in listRequest" class="tr-bill">
                                    <td>
                                        <span class="badge align-text-bottom badge-success" v-if="dataReq.Shop.shop_type == 1">PRO</span>
                                        <span class="badge align-text-bottom badge-danger" v-if="dataReq.Shop.shop_type == 2">VIP</span>
                                        <span class="badge align-text-bottom badge-info" v-if="dataReq.Shop.shop_type == 3">PRE</span>
                                        <span class="badge align-text-bottom badge-success">{{ dataReq.Shop.code }} - {{ dataReq.Shop.name }}</span> <br/>
                                        <br/>
                                        <span class="font-weight-bold">Mã hóa đơn: </span><span class="text-danger">{{ dataReq.Bill.code }}</span> <br/>
                                        <span class="font-weight-bold">Tiền shop nợ hiện tại: </span><span class="text-danger">{{ parseFloat(dataReq.DebtBill.money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Tiền đã thanh toán một phần: </span><span class="text-danger">{{ parseFloat(dataReq.DebtBill.paid_part_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Bill Status: </span><span>{{ dataReq.DebtBill.b_stat }}</span> <br/>
                                        <span class="font-weight-bold">COD Status: </span><span>{{ dataReq.DebtBill.cod_stat }}</span> <br/>
                                    </td>
                                    <td class="bill-info">
                                        <span class="font-weight-bold">Tiền shop thanh toán một phần: </span><span class="text-danger">{{ parseFloat(dataReq.PayPartDebt.paid_money) | toCurrency }}</span> <br/>
                                        <span class="font-weight-bold">Thời gian thanh toán: </span><span>{{ dataReq.PayPartDebt.paid_time }}</span> <br/>
                                        <span class="font-weight-bold">Người yêu cầu: </span><span>{{ dataReq.PayPartDebt.created_username }}</span> <br/>
                                        <br/>
                                        <span class="font-weight-bold">Trạng thái duyệt: </span>
                                        <span class="text-danger" v-if="dataReq.PayPartDebt.status == 0">Chờ duyệt</span>
                                        <span class="text-danger" v-if="dataReq.PayPartDebt.status == 1">Đã duyệt</span>
                                        <span class="text-danger" v-if="dataReq.PayPartDebt.status == 2">Từ chối duyệt</span>
                                        <span class="text-danger" v-if="dataReq.PayPartDebt.status == 3">Đã revert</span>
                                        <br/>
                                        <span class="font-weight-bold">Người duyệt: </span><span class="font-weight-bold user-transfer" v-if="dataReq.PayPartDebt.confirmed_username == null">Chưa có</span>
                                        <span class="font-weight-bold" v-else-if="dataReq.PayPartDebt.confirmed_username != null">{{ dataReq.PayPartDebt.confirmed_username }}</span> <br/>
                                        <span class="font-weight-bold">Thời gian duyệt: </span>
                                        <span v-if="[1,3].includes(parseInt(dataReq.PayPartDebt.status))">{{dataReq.PayPartDebt.modified}}</span>
                                    </td>
                                    <td class="bill-info text-center">
                                        <ladda-btn
                                                v-if="dataReq.PayPartDebt.status == 1 && canConfirm
                                                 && (['none', 'writeoff'].includes(dataReq.DebtBill.b_stat) || (dataReq.DebtBill.b_stat === 'done' && parseInt(dataReq.DebtBill.money) < 0))"
                                                @click.native="revertPayPart(dataReq, index)"
                                                data-style="zoom-out"
                                                class="btn btn-warning"
                                                size="sm" style="width: 110px"
                                        >
                                            Revert
                                        </ladda-btn>
                                        <ladda-btn
                                                v-if="dataReq.PayPartDebt.status == 0 && (canConfirm && ['none', 'writeoff'].includes(dataReq.DebtBill.b_stat))"
                                                @click.native="confirmPayPart(dataReq, index)"
                                                data-style="zoom-out"
                                                class="btn btn-success"
                                                size="sm" style="width: 110px"
                                        >
                                            Duyệt
                                        </ladda-btn>
                                        <br/><br/>
                                        <ladda-btn
                                                v-if="dataReq.PayPartDebt.status == 0 && canConfirm"
                                                @click.native="rejectPayPart(dataReq, index)"
                                                data-style="zoom-out"
                                                class="btn btn-danger"
                                                size="sm" style="width: 110px"
                                        >
                                            Từ chối
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
                <div class="no-data" v-if="listRequest.length == 0">
                    <b-alert show dismissible variant="warning">
                        <i class="sidenav-icon ion ion-ios-warning"></i>
                        Không có dữ liệu phù hợp, vui lòng thử lại.
                    </b-alert>
                </div>
            </div>
            <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
            <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingTransfer" />
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import billService from 'domain/services/bill-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import moment from 'moment'
import axios from 'axios'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom,
    SidenavRouterLink
  },
  data: () => ({
    shops: {
      shop_code: '',
      bill_code: ''
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
    listRequest: [],
    successConfirm: false,
    dismissSeconds: 5,
    dismissCountDownSE: 0,
    msgNotify: '',
    message: '',
    inputDisable: false,
    disableConfirm: true,
    selectRequestStatus: { name: 'Chờ duyệt', code: '0' },
    requestStatus: [
      { name: 'Chờ duyệt', code: '0' },
      { name: 'Đã duyệt', code: '1' },
      { name: 'Từ chối duyệt', code: '2' },
      { name: 'Đã revert', code: '3' }
    ],
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    canConfirm: false
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
      this.$refs.select_banks.reset()
    },
    searchRequest: function (page, newSearchConditions, i) {
      let self = this

      let dataSend = {
        'shop_code': self.shops.shop_code,
        'bill_code': self.shops.bill_code,
        'rq_status': self.selectRequestStatus.code,
        'created_from': self.customFormatter(self.from),
        'created_to': self.customFormatter(self.to),
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
      billService.searchRequestPayPartDebt(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listRequest = response.data.options.requests
          self.canConfirm = response.data.options.can_confirm
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
      this.searchRequest(page)
      this.pageData.currentPage = page
    },
    revertPayPart: function (dataReq, index) {
      if (!confirm('Bạn chắc chắn muốn REVERT yêu cầu thanh toán nợ ' + dataReq.PayPartDebt.paid_money + 'đ cho hóa đơn ' + dataReq.Bill.code +
        ' của shop ' + dataReq.Shop.code + '?')) {
        return
      }
      this.loadingTransfer = true
      billService.revertPayPartDebt(dataReq.PayPartDebt.id).then(result => {
        if (result.data.success) {
          this.loadingTransfer = false
          axios.get(config.baseApiUrl + 'bills/getInfoRequestPayPartById/' + dataReq.PayPartDebt.id).then(response => {
            if (response.data.success) {
              dataReq.PayPartDebt.confirmed_username = response.data.info.confirmed_username
              dataReq.PayPartDebt.status = response.data.info.status
              dataReq.DebtBill.money = response.data.info.debt_money
              dataReq.DebtBill.paid_part_money = response.data.info.paid_part_money
              dataReq.PayPartDebt.modified = response.data.info.modified
              this.listBills.splice(index, 1, dataReq)
            }
          })
          alert(result.data.message)
        } else {
          alert(result.data.message)
          this.loadingTransfer = false
        }
      }).catch(error => {
        if (error) {
        }
        this.loadingTransfer = false
      }).then(function () {
        this.loadingTransfer = false
      })
    },
    confirmPayPart: function (dataReq, index) {
      if (!confirm('Bạn chắc chắn muốn DUYỆT yêu cầu thanh toán nợ ' + dataReq.PayPartDebt.paid_money + 'đ cho hóa đơn ' + dataReq.Bill.code +
        ' của shop ' + dataReq.Shop.code + '?')) {
        return
      }
      this.loadingTransfer = true
      billService.confirmPayPartDebt(dataReq.PayPartDebt.id).then(result => {
        if (result.data.success) {
          this.loadingTransfer = false
          axios.get(config.baseApiUrl + 'bills/getInfoRequestPayPartById/' + dataReq.PayPartDebt.id).then(response => {
            if (response.data.success) {
              dataReq.PayPartDebt.confirmed_username = response.data.info.confirmed_username
              dataReq.PayPartDebt.status = response.data.info.status
              dataReq.DebtBill.money = response.data.info.debt_money
              dataReq.DebtBill.paid_part_money = response.data.info.paid_part_money
              dataReq.PayPartDebt.modified = response.data.info.modified
              this.listBills.splice(index, 1, dataReq)
            }
          })
          alert(result.data.message)
        } else {
          alert(result.data.message)
          this.loadingTransfer = false
        }
      }).catch(error => {
        if (error) {
        }
        this.loadingTransfer = false
      }).then(function () {
        this.loadingTransfer = false
      })
    },
    rejectPayPart: function (dataReq, index) {
      if (!confirm('Bạn chắc chắn muốn TỪ CHỐI yêu cầu thanh toán nợ ' + dataReq.PayPartDebt.paid_money + 'đ cho hóa đơn ' + dataReq.Bill.code +
        ' của shop ' + dataReq.Shop.code + '?')) {
        return
      }
      this.loadingTransfer = true
      billService.rejectPayPartDebt(dataReq.PayPartDebt.id).then(result => {
        if (result.data.success) {
          this.loadingTransfer = false
          axios.get(config.baseApiUrl + 'bills/getInfoRequestPayPartById/' + dataReq.PayPartDebt.id).then(response => {
            if (response.data.success) {
              dataReq.PayPartDebt.confirmed_username = response.data.info.confirmed_username
              dataReq.PayPartDebt.status = response.data.info.status
              this.listBills.splice(index, 1, dataReq)
            }
          })
          alert(result.data.message)
        } else {
          alert(result.data.message)
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        this.loadingTransfer = false
      })
    },
    exportFile: function () {
      let self = this
      let dataSend = {
        'shop_code': self.shops.shop_code,
        'bill_code': self.shops.bill_code,
        'rq_status': self.selectRequestStatus.code,
        'created_from': self.customFormatter(self.from),
        'created_to': self.customFormatter(self.to)
      }
      self.loadingTransfer = true
      billService.exportPayPartDebt(dataSend).then(result => {
        self.loadingTransfer = false
        if (result.data.success) {
          window.location.href = result.data.data
        } else {
          let msg = result.data.msg ? result.data.msg : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.loadingTransfer = false
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
    }
  },
  mounted: function () {
    this.searchRequest(this.pageData.currentPage, true)
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
    .show-package {
        position: absolute;
        top: 10px;
        right: 0;
        border: 1px solid #ccc;
        padding: 0px;
        border-radius: 5px;
        color: #1e70cd;
    }
    .errorClass {
        border: 1px solid red;
    }
</style>
