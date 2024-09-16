<template>
  <div>
    <div class="ui-block">
        <b-form-row>
            <h4 class="ui-block-heading col-md-6">Kết quả cam kết hoàn</h4>
            <div class="col-md-6 center">
                <b-button
                        @click="showImportModal"
                        class="btn btn-success"
                >
                    <i class="sidenav-icon ion ion-md-information-circle"></i>
                    Thông tin các gói cam kết hoàn
                </b-button>
                <b-button class="btn btn-warning">
                    <sidenav-router-link to="/shops/return-coupon"><i class="sidenav-icon ion ion-md-fastforward"></i>Gán cam kết hoàn</sidenav-router-link>
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
              <div class="col-md-6">
                <b-form-group label="Gói cam kết hoàn">
                  <select-rc-type @selected="selected.rcType = $event" ref="select_rcType"></select-rc-type>
                </b-form-group>
              </div>
              <div class="col-md-3">
                <b-form-group label="Chọn tháng tính phí hoàn:">
                  <datepicker
                    v-model="monthDeduction"
                    :minimum-view="'month'"
                    :maximum-view="'month'"
                    :bootstrapStyling="true"
                    :format="customFormatterMonth"
                    v-on:selected="monthSelectedInChild"
                  />
                </b-form-group>
              </div>
              <div class="col-md-3">
                <b-form-group label="Trạng thái gửi mail">
                  <multiselect
                    v-model="selectSendMailStt"
                    track-by="name"
                    label="name"
                    placeholder="Chọn trạng thái"
                    :options="sendMailStt"
                    :searchable="false"
                    :allow-empty="false">
                  </multiselect>
                </b-form-group>
              </div>
            </b-form-row>
          </div>
          <b-form-row>
            <div class="align-content-center center">
              <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="loadingExcelHtml" v-if="loadingExcel" />
              <b-button
                @click="resetForm"
                class="btn"
              >
                Nhập lại
              </b-button>
              <b-button
                class="btn btn-success"
                @click="searchReturnCouponResult(pageData.currentPage, true)"
              >
                <i class="sidenav-icon ion ion-md-search"></i>
                Tìm kiếm
              </b-button>
              <b-button
                class="btn btn-success"
                @click="exportResult()"
              >
                <i class="sidenav-icon ion ion-md-cloud-download"></i>
                Xuất File Chi Tiết
              </b-button>
              <b-btn v-bind:disabled="!canViewAll || listShops.length == 0" v-if="canViewAll && listShops.length > 0" type="button" class="btn btn-danger" @click="downloadRcFileZip">
                <i class="sidenav-icon ion ion-md-cloud-download"></i>
                Tải file zip
              </b-btn>
              <b-btn v-bind:disabled="!canViewAll || listShops.length == 0" v-if="canViewAll && listShops.length > 0" type="button" class="btn btn-primary" @click="confirmReturnCoupon">
                <i class="sidenav-icon ion ion-md-power"></i>
                Chốt cam kết hoàn
              </b-btn>
              <b-btn v-bind:disabled="!canViewAll || listShops.length == 0" v-if="canViewAll && listShops.length > 0 && canSendMail" type="button" class="btn btn-warning" @click="sendMailAll">
                <i class="sidenav-icon ion ion-md-trending-up"></i>
                Gửi mail
              </b-btn>
            </div>
          </b-form-row>
        </form>
      </div>
      <div v-if="successConfirm">
        <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
            {{ msgNotify }}
        </b-alert>
      </div>
      <!-- Sinh file chuyển tiền theo lô -->
      <div class="row checkbox-bill table-responsive" v-if="canViewAll && listShops.length > 0">
        <a href="javascript:void(0);" @click="exportBankTransfer"><span class="badge badge-primary float-right">Sinh file chuyển tiền theo lô</span></a>
      </div>
      <!-- Error message -->
      <div class="no-data" v-if="errorExport === true">
        <b-alert show dismissible variant="warning">
          <i class="sidenav-icon ion ion-ios-warning"></i>
          {{ msgErr }}
        </b-alert>
      </div>
      <!-- File Detail -->
      <div class="download-file-banks" v-if="listShops.length > 0 && (exportedFileVibInternal.length || exportedFileVibInterbank.length)">
        <div>
          <div class="total-fee">
            <span class="font-weight-bold" v-if="exportedFileVibInternal.length > 0">
              File chuyển tiền theo lô nội bộ VIB:
              <a :href="domainDownload + exportedFileVibInternal" target="_blank">
                  Tải xuống
              </a>
            </span>
            <br v-if="exportedFileVibInternal.length > 0"/>
            <span class="font-weight-bold" v-if="exportedFileVibInterbank.length > 0">
                File chuyển tiền theo lô liên ngân hàng VIB:
                <a :href="domainDownload + exportedFileVibInterbank" target="_blank">
                  Tải xuống
                </a>
            </span>
            <br v-if="exportedFileVibInterbank.length > 0"/>
          </div>
        </div>
      </div>
      <!-- Count Money -->
      <div class="row fee-count" v-if="listShops.length > 0">
        <div>
          <div class="total-fee"></div>
          <div class="total-fee">
            <span class="font-weight-bold">Shop chưa gửi mail: {{ mailNoneStt.totalShop }}</span> <br/>
            <span class="font-weight-bold">Tổng tiền hoàn: {{ mailNoneStt.totalReturnMoney }}</span> <br />
          </div>
          <div class="total-fee">
            <span class="font-weight-bold">Shop đang gửi mail: {{ mailSendingStt.totalShop }}</span> <br/>
            <span class="font-weight-bold">Tổng tiền hoàn: {{ mailSendingStt.totalReturnMoney }}</span> <br />
          </div>
          <div class="total-fee">
            <span class="font-weight-bold">Shop đã gửi mail: {{ mailDoneStt.totalShop }}</span> <br/>
            <span class="font-weight-bold">Tổng tiền hoàn: {{ mailDoneStt.totalReturnMoney }}</span> <br />
          </div>
          <div class="total-fee">
            <span class="font-weight-bold">Shop không gửi mail: {{ mailNotStt.totalShop }}</span> <br/>
            <span class="font-weight-bold">Tổng tiền hoàn: {{ mailNotStt.totalReturnMoney }}</span> <br />
          </div>
        </div>
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
                  <th width="45%">Thông tin chi tiết</th>
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
                  <td>
                      <span class="font-weight-bold">Trạng thái: </span>
                      <span class="badge align-text-bottom badge-secondary" v-if="dataShops.RpDbReturnCouponResult.send_mail_stt == 0">Chưa gửi mail</span>
                      <span class="badge align-text-bottom badge-warning" v-if="dataShops.RpDbReturnCouponResult.send_mail_stt == 1">Đang gửi mail</span>
                      <span class="badge align-text-bottom badge-success" v-if="dataShops.RpDbReturnCouponResult.send_mail_stt == 2">Đã gửi mail</span>
                      <span class="badge align-text-bottom badge-danger" v-if="dataShops.RpDbReturnCouponResult.send_mail_stt == 3">Không gửi mail</span>
                      <span class="badge align-text-bottom badge-secondary" v-if="dataShops.RpDbReturnCouponResult.dd_status == 0">Chưa chốt CKH</span>
                      <span class="badge align-text-bottom badge-primary" v-if="dataShops.RpDbReturnCouponResult.dd_status == 1">Đã chốt CKH</span>
                      <span class="badge align-text-bottom badge-success" v-if="dataShops.RpDbReturnCouponResult.dd_status == 2">Đã đối soát</span>
                      <br/><br/>
                      <span class="font-weight-bold">Gói: </span>
                      <span class="font-weight-bold text-danger">{{ dataShops.RpDbReturnCouponType.name }}</span><br/>
                      <span class="font-weight-bold">Tỉ lệ cam kết với Shop: </span>
                      <span class="font-weight-bold text-danger" v-if="dataShops.RpDbReturnCouponResult.re_value_config">
                          {{ dataShops.RpDbReturnCouponResult.re_value_config }}%
                      </span><br/>
                      <span class="font-weight-bold">Tỉ lệ hoàn thực tế: </span>
                      <span v-if="dataShops.RpDbReturnCouponResult.re_value">{{ dataShops.RpDbReturnCouponResult.re_value }}%</span><br/>
                      <span class="font-weight-bold">Số đơn cam kết với Shop: </span>
                      <span class="font-weight-bold text-danger">{{ dataShops.RpDbReturnCouponResult.number_pkg_config }}</span><br/>
                      <span class="font-weight-bold">Số đơn lấy thành công: </span>
                      <span>{{ dataShops.RpDbReturnCouponResult.number_pkg_picked }}</span><br/>
                      <span class="font-weight-bold">Số đơn hoàn thành: </span>
                      <span>{{ dataShops.RpDbReturnCouponResult.number_pkg_done }}</span><br/>
                      <span class="font-weight-bold">Đơn không giao được hàng: </span>
                      <span>{{ dataShops.RpDbReturnCouponResult.number_pkg_return }}</span><br/>
                      <span class="font-weight-bold">Số đơn thỏa mãn tỉ lệ cam kết: </span>
                      <span>{{ dataShops.RpDbReturnCouponResult.number_pkg }}</span><br/>
                      <span class="font-weight-bold">Số tiền hoàn lại Shop: </span>
                      <span class="font-weight-bold text-danger">{{ dataShops.RpDbReturnCouponResult.return_money }}</span><br/>
                      <span class="font-weight-bold">Thời gian gán gói:</span>
                      <span>{{ dataShops.RpDbReturnCouponResult.date_config }}</span><br/>
                  </td>
                  <td>
                      <a :href="domainDownload + dataShops.RpDbReturnCouponResult.filepath"
                         target="_blank"
                         :class="{'disabled': (dataShops.RpDbReturnCouponResult.filepath == null)}"
                      >
                          Tải file
                      </a>
                      <br/><br/><br/>
                      <b-btn v-if="canViewAll && listShops.length > 0 && dataShops.RpDbReturnCouponResult.send_mail_stt == 0 && dataShops.RpDbReturnCouponResult.dd_status == 0"
                             type="button" class="float-right btn btn-warning" @click="notSendMail(dataShops.RpDbReturnCouponResult.id, dataShops.Shop.code)">
                          Không gửi mail
                      </b-btn>
                      <br/><br/><br/>
                      <button v-if="canViewAll"
                        type="button"
                        class="btn btn-link"
                        @click="deleteCouponResult(dataShops)"
                      >
                          <span class="ion ion-ios-trash"></span>
                          Xóa
                      </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-card>
        <div class="no-data" v-if="listShops.length == 0">
          <b-alert show dismissible variant="warning">
            <i class="sidenav-icon ion ion-ios-warning"></i>
            Không có dữ liệu phù hợp, vui lòng thử lại.
          </b-alert>
        </div>
      </div>
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

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import SelectCtmCare from 'components/elements/FilterBox/SelectCtmCare'
import SelectRcType from 'components/elements/FilterBox/SelectRcType'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import shopService from 'domain/services/shop-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import config from 'config/app.base'
import axios from 'axios'

Vue.use(BlockUI)

export default {
  components: {
    SidenavRouterLink,
    SelectCtmCare,
    SelectRcType,
    LaddaBtn,
    Datepicker,
    Multiselect
  },
  data: () => ({
    selected: {
      ctmCare: [],
      rcType: []
    },
    monthDeduction: moment().subtract(1, 'month').format('YYYY-MM'),
    shops: {
      shop_code: ''
    },
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 50,
      sortBy: 'id',
      sortDesc: false
    },
    domainDownload: config.domainDownloadFile,
    checkResult: false,
    listShops: [],
    loadingExcel: false,
    loadingExcelHtml: `
      <div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
      <h5 class="text-center mb-0">LOADING...</h5>
    `,
    rcTypeInfo: '',
    btnDisableZip: true,
    canViewAll: false,
    exportedFileVibInternal: '',
    exportedFileVibInterbank: '',
    errorExport: false,
    successConfirm: false,
    dismissSeconds: 5,
    dismissCountDownSE: 0,
    msgNotify: '',
    selectSendMailStt: '',
    sendMailStt: [
      { name: 'Chưa gửi mail', stt: '0' },
      { name: 'Đang gửi mail', stt: '1' },
      { name: 'Đã gửi mail', stt: '2' },
      { name: 'Không gửi mail', stt: '3' }
    ],
    canSendMail: false,
    mailNoneStt: {
      totalShop: '0',
      totalReturnMoney: '0'
    },
    mailSendingStt: {
      totalShop: '0',
      totalReturnMoney: '0'
    },
    mailDoneStt: {
      totalShop: '0',
      totalReturnMoney: '0'
    },
    mailNotStt: {
      totalShop: '0',
      totalReturnMoney: '0'
    }
  }),
  methods: {
    clearExcels: function () {
      this.exportedFileVibInternal = ''
      this.exportedFileVibInterbank = ''
    },
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
    slug: function (idRcR) {
      return '/admin/shops/downloadRcPkg/' + idRcR
    },
    downloadRcFileZip: function () {
      let self = this
      let dataSend = {
        'month_return_coupon': self.customFormatterMonth(this.monthDeduction)
      }
      self.loadingExcel = true
      shopService.downloadRcFileZip(dataSend).then(response => {
        if (response.data.success) {
          this.$router.push({path: '/shops/download-zip-file-deduction', query: {month: response.data.data.month, type: response.data.data.type}})
        } else {
          let msg = response.data.msg ? response.data.msg : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Hãy thử lại nhé!')
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    bankDownload: function (fileName) {
      return '/admin/shops/bankDownload/' + fileName
    },
    getSummaries: function (dataSend) {
      let self = this

      self.mailNoneStt.totalShop = '0'
      self.mailNoneStt.totalReturnMoney = '0'

      self.mailSendingStt.totalShop = '0'
      self.mailSendingStt.totalReturnMoney = '0'

      self.mailDoneStt.totalShop = '0'
      self.mailDoneStt.totalReturnMoney = '0'

      self.mailNotStt.totalShop = '0'
      self.mailNotStt.totalReturnMoney = '0'

      shopService.getSummaryReturnCoupon(dataSend).then(response => {
        if (response.data.success && response.data.data) {
          let d = response.data.data
          d.forEach(function (item) {
            if (item.mail_stt === '0') {
              self.mailNoneStt.totalShop = item.total_shop
              self.mailNoneStt.totalReturnMoney = item.total_return_money
            }
            if (item.mail_stt === '1') {
              self.mailSendingStt.totalShop = item.total_shop
              self.mailSendingStt.totalReturnMoney = item.total_return_money
            }
            if (item.mail_stt === '2') {
              self.mailDoneStt.totalShop = item.total_shop
              self.mailDoneStt.totalReturnMoney = item.total_return_money
            }
            if (item.mail_stt === '3') {
              self.mailNotStt.totalShop = item.total_shop
              self.mailNotStt.totalReturnMoney = item.total_return_money
            }
          })
        }
      })
    },
    customFormatterMonth (month) {
      return moment(month).format('YYYY-MM')
    },
    monthSelectedInChild: function (month) {
      this.monthDeduction = month
    },
    resetForm: function () {
      this.shops.shop_code = ''
      this.$refs.select_ctmCare.reset()
      this.$refs.select_rcType.reset()
    },
    exportBankTransfer: function () {
      let self = this

      self.errorExport = false
      self.loadingExcel = true
      let dataSend = {
        'shop_code': self.shops.shop_code,
        'ctm_care': self.selected.ctmCare,
        'rc_type': self.selected.rcType,
        'month_return_coupon': self.customFormatterMonth(this.monthDeduction),
        'send_mail_stt': self.selectSendMailStt.stt
      }
      shopService.exportBankTransfer(dataSend).then(response => {
        if (response.data.success && response.data.data.files) {
          var files = response.data.data.files
          for (var i in files) {
            self[i] = files[i]
          }
          self.errorExport = false
        } else {
          self.errorExport = true
          self.msgErr = response.data.msg ? response.data.msg : 'Có lỗi khi sinh file. Hãy thử lại nhé!'
        }
      }).catch(error => {
        if (error) {
          self.errorExport = true
          self.msgErr = 'Có lỗi khi sinh file. Hãy thử lại nhé!'
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    searchReturnCouponResult: function (page, newSearchConditions) {
      let self = this
      self.canSendMail = false
      let dataSend = {
        'shop_code': self.shops.shop_code,
        'ctm_care': self.selected.ctmCare,
        'rc_type': self.selected.rcType,
        'month_return_coupon': self.customFormatterMonth(this.monthDeduction),
        'send_mail_stt': self.selectSendMailStt.stt,
        'page': page,
        'limit': self.pageData.perPage
      }
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
        this.clearExcels()
        this.getSummaries(dataSend)
      }
      self.loadingExcel = true
      shopService.searchReturnCouponResult(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
          self.canViewAll = response.data.options.canViewAll
          if (self.selectSendMailStt.stt === '0') {
            self.canSendMail = true
          }
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    exportResult: function () {
      let self = this
      let dataSend = {
        'shop_code': self.shops.shop_code,
        'ctm_care': self.selected.ctmCare,
        'rc_type': self.selected.rcType,
        'month_return_coupon': self.customFormatterMonth(this.monthDeduction)
      }
      self.loadingExcel = true
      shopService.exportReturnCouponResult(dataSend).then(response => {
        if (response.data.success) {
          window.location.href = response.data.data
        } else {
          let msg = response.data.msg ? response.data.msg : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Hãy thử lại nhé!')
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    confirmReturnCoupon: function () {
      let self = this

      if (!confirm('Bạn chắc chắn muốn chốt cam kết hoàn ' + self.customFormatterMonth(this.monthDeduction) + '?')) {
        return
      }
      self.successConfirm = false
      self.loadingExcel = true
      let dataSend = {
        'month_return_coupon': self.customFormatterMonth(this.monthDeduction)
      }
      axios.get(config.baseApiUrl + 'shops/confirmReturnCoupon', {'params': dataSend}).then(response => {
        if (response.data.success) {
          self.loadingExcel = false
          self.searchReturnCouponResult(1, true)
          self.successConfirm = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.msg ? response.data.msg : 'Đã chốt cam kết hoàn ' + self.customFormatterMonth(this.monthDeduction) + ' thành công!'
        } else {
          alert(response.data.msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi khi chốt cam kết hoàn, vui lòng thử lại!')
        }
      }).then(
        self.loadingExcel = false
      )
    },
    sendMailAll: function () {
      let self = this

      if (!confirm('Bạn chắc chắn muốn gửi mail cam kết hoàn cho ' + self.pageData.totalItems + ' shop?')) {
        return
      }
      self.successConfirm = false
      self.loadingExcel = true
      let dataSend = {
        'month_return_coupon': self.customFormatterMonth(this.monthDeduction),
        'send_mail_stt': self.selectSendMailStt.stt
      }
      axios.get(config.baseApiUrl + 'shops/sendMailReturnCoupon', {'params': dataSend}).then(response => {
        if (response.data.success) {
          self.selectSendMailStt = ''
          self.loadingExcel = false
          self.searchReturnCouponResult(1, true)
          self.successConfirm = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.msg ? response.data.msg : 'Lệnh gửi mail cho shop đã được kích hoạt!'
        } else {
          if (response.data.msg) {
            alert(response.data.msg)
          } else {
            alert('Có lỗi khi gửi mail cam kết hoàn, vui lòng thử lại!')
          }
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi khi gửi mail cam kết hoàn, vui lòng thử lại!')
        }
      }).then(
        self.loadingExcel = false
      )
    },
    notSendMail: function (rcrId, shopCode) {
      let self = this

      if (!confirm('Bạn chắc chắn muốn KHÔNG GỬI MAIL cam kết hoàn cho shop ' + shopCode + '?')) {
        return
      }
      self.successConfirm = false
      self.loadingExcel = true
      axios.get(config.baseApiUrl + 'shops/notSendMailReturnCoupon/' + rcrId).then(response => {
        if (response.data.success) {
          self.loadingExcel = false
          self.searchReturnCouponResult(this.pageData.currentPage, true)
          self.successConfirm = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.msg ? response.data.msg : 'Shop đã được đưa vào danh sách không gửi mail cam kết hoàn!'
        } else {
          alert(response.data.msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra, vui lòng thử lại!')
        }
      }).then(
        self.loadingExcel = false
      )
    },
    pageChanged: function (page) { // Event check pagination change
      this.searchReturnCouponResult(page)
      this.pageData.currentPage = page
    },
    deleteCouponResult: function (data) {
      let self = this
      const shopCode = data.Shop.code
      if (!confirm('Bạn chắc chắn muốn XÓA KẾT QUẢ chiết khấu của shop ' + shopCode + '?')) {
        return
      }
      const couponResultId = data.RpDbReturnCouponResult.id
      self.loadingExcel = true
      shopService.deleteCouponResult({couponResultId}).then(response => {
        if (response.data.success) {
          alert(response.data.message)
          self.searchReturnCouponResult(this.pageData.currentPage, true)
        } else {
          let msg = response.data.message ? response.data.message : 'Có lỗi xảy ra. Hãy thử lại nhé!'
          alert(msg)
        }
        self.loadingExcel = false
      }).catch(error => {
        if (error) {
          alert('Có lỗi xảy ra. Hãy thử lại nhé!')
        }
      }).then(function () {
        self.loadingExcel = false
      })
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
  .form-filter {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    padding: 20px;
  }
  .center {
    text-align: center;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .checkbox-bill {
    margin: 0 auto;
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
  a.disabled {
    color: red;
    pointer-events: none;
    cursor: not-allowed;
  }
</style>
