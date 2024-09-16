<template>
    <div>
        <div class="ui-block">
            <b-form-row>
                <h4 class="ui-block-heading col-md-6">Kết quả chiết khấu</h4>
                <div class="col-md-12 right">
                    <b-button
                        @click="showModalUploadResultDeduction"
                        class="btn btn-primary"
                    >
                        <i class="sidenav-icon ion ion-md-cloud-upload"></i>
                        Upload Kết quả chiết khấu
                    </b-button>
                    <b-button
                            @click="redirectNewDeductionManage"
                            class="btn btn-success"
                    >
                        <i class="sidenav-icon ion ion-md-information-circle"></i>
                        Quản lý chiết khấu mới
                    </b-button>
                    <b-button class="btn btn-warning">
                        <sidenav-router-link to="/shops/new-deduction"><i class="sidenav-icon ion ion-md-fastforward"></i>Gán gói chiết khấu</sidenav-router-link>
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
                                <b-form-group label="Gói chiết khấu">
                                    <select-dd-type @selected="selected.ddType = $event" ref="select_ddType"></select-dd-type>
                                </b-form-group>
                            </div>
                            <div class="col-md-3">
                                <b-form-group label="Chọn tháng tính chiết khấu:">
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
                                    @click="searchNewDeductionResult(pageData.currentPage, true)"
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
                            <b-btn v-bind:disabled="!canViewAll || listShops.length == 0" v-if="canViewAll && listShops.length > 0" type="button" class="btn btn-danger" @click="downloadFileZip">
                                <i class="sidenav-icon ion ion-md-cloud-download"></i>
                                Tải file zip
                            </b-btn>
                            <b-btn v-bind:disabled="!canViewAll || listShops.length == 0" v-if="canViewAll && listShops.length > 0" type="button" class="btn btn-primary" @click="confirmDeduction">
                                <i class="sidenav-icon ion ion-md-power"></i>
                                Chốt chiết khấu
                            </b-btn>
                            <b-btn v-bind:disabled="!canViewAll || listShops.length == 0" v-if="canViewAll && listShops.length > 0 && canSendMail" type="button" class="btn btn-warning" @click="sendMailAll">
                                <i class="sidenav-icon ion ion-md-trending-up"></i>
                                Gửi mail
                            </b-btn>
                        </div>
                    </b-form-row>
                </form>
            </div>
            <div v-if="successSendMail">
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
            <div class="download-file-banks" v-if="listShops.length > 0">
                <div>
                    <div class="total-fee">
                        <span class="font-weight-bold" v-if="exportedFileVibInternal.length > 0">
                            File chuyển tiền theo lô nội bộ VIB:
                            <a
                                    :href="domainDownload + exportedFileVibInternal"
                                    target="_blank"
                            >
                                Tải xuống
                            </a>
                        </span> <br v-if="exportedFileVibInternal.length > 0"/>
                        <span class="font-weight-bold" v-if="exportedFileVibInterbank.length > 0">
                            File chuyển tiền theo lô liên ngân hàng VIB:
                            <a
                                    :href="domainDownload + exportedFileVibInterbank"
                                    target="_blank"
                            >
                                Tải xuống
                            </a>
                        </span> <br v-if="exportedFileVibInterbank.length > 0"/>
                    </div>
                </div>
            </div>
            <!-- Count Money -->
            <div class="row fee-count" v-if="listShops.length > 0">
                <div>
                    <div class="total-fee"></div>
                    <div class="total-fee">
                        <span class="font-weight-bold">Shop chưa gửi mail: {{ mailNoneStt.totalShop }}</span> <br/>
                        <span class="font-weight-bold">Tổng tiền ship: {{ mailNoneStt.totalShipMoney }}</span><br />
                        <span class="font-weight-bold">Tổng tiền CK: {{ mailNoneStt.totalDdMoney }}</span> <br />
                    </div>
                    <div class="total-fee">
                        <span class="font-weight-bold">Shop đang gửi mail: {{ mailSendingStt.totalShop }}</span> <br/>
                        <span class="font-weight-bold">Tổng tiền ship: {{ mailSendingStt.totalShipMoney }}</span><br />
                        <span class="font-weight-bold">Tổng tiền CK: {{ mailSendingStt.totalDdMoney }}</span> <br />
                    </div>
                    <div class="total-fee">
                        <span class="font-weight-bold">Shop đã gửi mail: {{ mailDoneStt.totalShop }}</span> <br/>
                        <span class="font-weight-bold">Tổng tiền ship: {{ mailDoneStt.totalShipMoney }}</span><br />
                        <span class="font-weight-bold">Tổng tiền CK: {{ mailDoneStt.totalDdMoney }}</span> <br />
                    </div>
                    <div class="total-fee">
                        <span class="font-weight-bold">Shop không gửi mail: {{ mailNotStt.totalShop }}</span> <br/>
                        <span class="font-weight-bold">Tổng tiền ship: {{ mailNotStt.totalShipMoney }}</span><br />
                        <span class="font-weight-bold">Tổng tiền CK: {{ mailNotStt.totalDdMoney }}</span> <br />
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
                                    <th width="45%">Thông tin chiết khấu</th>
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
                                        <span class="badge align-text-bottom badge-secondary" v-if="dataShops.RpDbNewDeductionResult.send_mail_stt == 0">Chưa gửi mail</span>
                                        <span class="badge align-text-bottom badge-warning" v-if="dataShops.RpDbNewDeductionResult.send_mail_stt == 1">Đang gửi mail</span>
                                        <span class="badge align-text-bottom badge-success" v-if="dataShops.RpDbNewDeductionResult.send_mail_stt == 2">Đã gửi mail</span>
                                        <span class="badge align-text-bottom badge-danger" v-if="dataShops.RpDbNewDeductionResult.send_mail_stt == 3">Không gửi mail</span>
                                        <span class="badge align-text-bottom badge-secondary" v-if="dataShops.RpDbNewDeductionResult.dd_status == 0">Chưa chốt CK</span>
                                        <span class="badge align-text-bottom badge-primary" v-if="dataShops.RpDbNewDeductionResult.dd_status == 1">Đã chốt CK</span>
                                        <span class="badge align-text-bottom badge-success" v-if="dataShops.RpDbNewDeductionResult.dd_status == 2">Đã đối soát</span>
                                        <br/><br/>
                                        <span class="font-weight-bold">Gói: </span>
                                        <span class="font-weight-bold text-danger">{{ dataShops.NewDeduction.name }}</span><br/>
                                        <span class="font-weight-bold">Tổng đơn hoàn thành: </span>
                                        <span>{{ dataShops.RpDbNewDeductionResult.number_pkg_done }}</span><br/>
                                        <span class="font-weight-bold">Tổng đơn chiết khấu: </span>
                                        <span class="font-weight-bold text-danger">{{ dataShops.RpDbNewDeductionResult.number_pkg_deduction }}</span><br/>
                                        <span class="font-weight-bold">Tổng tiền ship đơn CK: </span>
                                        <span>{{ dataShops.RpDbNewDeductionResult.ship_money }}</span><br/>
                                        <span class="font-weight-bold">Tổng tiền chiết khấu: </span>
                                        <span class="font-weight-bold text-danger">{{ dataShops.RpDbNewDeductionResult.dd_money }}</span><br/>
                                        <br/>
                                        <span class="font-weight-bold">Thời gian gán:</span>
                                        <span>{{ dataShops.RpDbNewDeductionResult.date_config }}</span><br/>
                                    </td>
                                    <td>
                                        <a :href="domainDownload + dataShops.RpDbNewDeductionResult.filepath"
                                           target="_blank"
                                           :class="{'disabled': (dataShops.RpDbNewDeductionResult.filepath === '')}"
                                        >
                                            Tải file
                                        </a>
                                        <br/><br/><br/>
                                        <b-btn v-if="canViewAll && listShops.length > 0 && dataShops.RpDbNewDeductionResult.send_mail_stt == 0 && dataShops.RpDbNewDeductionResult.dd_status == 0"
                                               type="button" class="float-right btn btn-warning" @click="notSendMail(dataShops.RpDbNewDeductionResult.id, dataShops.Shop.code)">
                                            Không gửi mail
                                        </b-btn>

                                        <br/><br/><br/>
                                        <button
                                          type="button"
                                          class="btn btn-link"
                                          v-if="canViewAll && dataShops.RpDbNewDeductionResult.send_mail_stt == 0"
                                          @click="deleteDeduction(dataShops)"
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
        </div>
        <modal-upload-result-deduction></modal-upload-result-deduction>
    </div>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import SelectCtmCare from 'components/elements/FilterBox/SelectCtmCare'
import SelectDdType from 'components/elements/FilterBox/SelectDeductionType'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import deductionService from 'domain/services/deduction-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import ModalUploadResultDeduction from './ModalUploadResultDeduction'
import axios from 'axios'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    SidenavRouterLink,
    SelectCtmCare,
    SelectDdType,
    LaddaBtn,
    Datepicker,
    Multiselect,
    ModalUploadResultDeduction
  },
  data: () => ({
    selected: {
      ctmCare: [],
      ddType: []
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
    btnDisableZip: true,
    canViewAll: false,
    exportedFileVibInternal: '',
    exportedFileVibInterbank: '',
    errorExport: false,
    msgErr: '',
    canSendMail: false,
    selectSendMailStt: '',
    sendMailStt: [
      { name: 'Chưa gửi mail', stt: '0' },
      { name: 'Đang gửi mail', stt: '1' },
      { name: 'Đã gửi mail', stt: '2' },
      { name: 'Không gửi mail', stt: '3' }
    ],
    successSendMail: false,
    dismissSeconds: 5,
    dismissCountDownSE: 0,
    msgNotify: '',
    mailNoneStt: {
      totalShop: '0',
      totalShipMoney: '0',
      totalDdMoney: '0'
    },
    mailSendingStt: {
      totalShop: '0',
      totalShipMoney: '0',
      totalDdMoney: '0'
    },
    mailDoneStt: {
      totalShop: '0',
      totalShipMoney: '0',
      totalDdMoney: '0'
    },
    mailNotStt: {
      totalShop: '0',
      totalShipMoney: '0',
      totalDdMoney: '0'
    }
  }),
  methods: {
    clearExcels: function () {
      this.exportedFileVibInternal = ''
      this.exportedFileVibInterbank = ''
    },
    slug: function (idNdr) {
      return '/admin/new-deduction/downloadDdPkg/' + idNdr
    },
    downloadFileZip: function () {
      let self = this
      let dataSend = {
        'month_deduction': self.customFormatterMonth(this.monthDeduction)
      }
      self.loadingExcel = true
      deductionService.downloadFileZip(dataSend).then(response => {
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
    customFormatterMonth (month) {
      return moment(month).format('YYYY-MM')
    },
    monthSelectedInChild: function (month) {
      this.monthDeduction = month
    },
    resetForm: function () {
      this.shops.shop_code = ''
      this.$refs.select_ctmCare.reset()
      this.$refs.select_ddType.reset()
      this.selectSendMailStt = ''
    },
    getSummaries: function (dataSend) {
      let self = this

      self.mailNoneStt.totalShop = '0'
      self.mailNoneStt.totalShipMoney = '0'
      self.mailNoneStt.totalDdMoney = '0'

      self.mailSendingStt.totalShop = '0'
      self.mailSendingStt.totalShipMoney = '0'
      self.mailSendingStt.totalDdMoney = '0'

      self.mailDoneStt.totalShop = '0'
      self.mailDoneStt.totalShipMoney = '0'
      self.mailDoneStt.totalDdMoney = '0'

      self.mailNotStt.totalShop = '0'
      self.mailNotStt.totalShipMoney = '0'
      self.mailNotStt.totalDdMoney = '0'
      deductionService.getSummaries(dataSend).then(response => {
        if (response.data.success && response.data.data) {
          let d = response.data.data
          d.forEach(function (item) {
            if (item.mail_stt === '0') {
              self.mailNoneStt.totalShop = item.total_shop
              self.mailNoneStt.totalShipMoney = item.ship_money
              self.mailNoneStt.totalDdMoney = item.dd_money
            }
            if (item.mail_stt === '1') {
              self.mailSendingStt.totalShop = item.total_shop
              self.mailSendingStt.totalShipMoney = item.ship_money
              self.mailSendingStt.totalDdMoney = item.dd_money
            }
            if (item.mail_stt === '2') {
              self.mailDoneStt.totalShop = item.total_shop
              self.mailDoneStt.totalShipMoney = item.ship_money
              self.mailDoneStt.totalDdMoney = item.dd_money
            }
            if (item.mail_stt === '3') {
              self.mailNotStt.totalShop = item.total_shop
              self.mailNotStt.totalShipMoney = item.ship_money
              self.mailNotStt.totalDdMoney = item.dd_money
            }
          })
        } else {
        }
      })
    },
    searchNewDeductionResult: function (page, newSearchConditions) {
      let self = this
      self.canSendMail = false
      self.errorExport = false
      let dataSend = {
        'shop_code': self.shops.shop_code,
        'ctm_care_id': self.selected.ctmCare,
        'dd_id_result': self.selected.ddType,
        'month_deduction': self.customFormatterMonth(this.monthDeduction),
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
      deductionService.searchNewDeductionResult(dataSend).then(response => {
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
        'dd_id_result': self.selected.ddType,
        'month_deduction': self.customFormatterMonth(this.monthDeduction),
        'send_mail_stt': self.selectSendMailStt.stt
      }
      self.loadingExcel = true
      deductionService.exportNewDeductionResult(dataSend).then(response => {
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
    pageChanged: function (page) { // Event check pagination change
      this.searchNewDeductionResult(page)
      this.pageData.currentPage = page
    },
    redirectNewDeductionManage: function () {
      window.open('/adm/shops/manage-new-deduction')
    },
    exportBankTransfer: function () {
      let self = this

      self.errorExport = false
      self.loadingExcel = true
      let dataSend = {
        'shop_code': self.shops.shop_code,
        'ctm_care_id': self.selected.ctmCare,
        'dd_id_result': self.selected.ddType,
        'month_deduction': self.customFormatterMonth(this.monthDeduction),
        'send_mail_stt': self.selectSendMailStt.stt
      }
      deductionService.exportBankTransfer(dataSend).then(response => {
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
    bankDownload: function (fileName) {
      return '/admin/new-deduction/bankDownload/' + fileName
    },
    confirmDeduction: function () {
      let self = this

      if (!confirm('Bạn chắc chắn muốn chốt chiết khấu ' + self.customFormatterMonth(this.monthDeduction) + '?')) {
        return
      }
      self.successSendMail = false
      self.loadingExcel = true
      let dataSend = {
        'month_deduction': self.customFormatterMonth(this.monthDeduction)
      }
      axios.get(config.baseApiUrl + 'new-deduction/confirmNewDeduction', {'params': dataSend}).then(response => {
        if (response.data.success) {
          self.loadingExcel = false
          self.searchNewDeductionResult(1, true)
          self.successSendMail = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.msg ? response.data.msg : 'Đã chốt chiết khấu ' + self.customFormatterMonth(this.monthDeduction) + ' thành công!'
        } else {
          alert(response.data.msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi khi chốt chiết khấu, vui lòng thử lại!')
        }
      }).then(
        self.loadingExcel = false
      )
    },
    sendMailAll: function () {
      let self = this

      if (!confirm('Bạn chắc chắn muốn gửi mail chiết khấu cho ' + self.pageData.totalItems + ' shop?')) {
        return
      }
      self.successSendMail = false
      self.loadingExcel = true
      let dataSend = {
        'month_deduction': self.customFormatterMonth(this.monthDeduction),
        'send_mail_stt': self.selectSendMailStt.stt
      }
      axios.get(config.baseApiUrl + 'new-deduction/sendMailNewDeduction', {'params': dataSend}).then(response => {
        if (response.data.success) {
          self.selectSendMailStt = ''
          self.loadingExcel = false
          self.searchNewDeductionResult(1, true)
          self.successSendMail = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.msg ? response.data.msg : 'Lệnh gửi mail chiết khấu mới cho shop đã được kích hoạt!'
        } else {
          alert(response.data.msg)
        }
      }).catch(error => {
        if (error) {
          alert('Có lỗi khi gửi mail chiết khấu, vui lòng thử lại!')
        }
      }).then(
        self.loadingExcel = false
      )
    },
    notSendMail: function (ndrId, shopCode) {
      let self = this

      if (!confirm('Bạn chắc chắn muốn KHÔNG GỬI MAIL chiết khấu cho shop ' + shopCode + '?')) {
        return
      }
      self.successSendMail = false
      self.loadingExcel = true
      axios.get(config.baseApiUrl + 'new-deduction/notSendMail/' + ndrId).then(response => {
        if (response.data.success) {
          self.loadingExcel = false
          self.searchNewDeductionResult(this.pageData.currentPage, true)
          self.successSendMail = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.msg ? response.data.msg : 'Shop đã được đưa vào danh sách không gửi mail chiết khấu!'
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
    deleteDeduction: function (data) {
      let self = this
      const shopCode = data.Shop.code
      if (!confirm('Bạn chắc chắn muốn XÓA KẾT QUẢ chiết khấu của shop ' + shopCode + '?')) {
        return
      }
      const deductionResultId = data.RpDbNewDeductionResult.id
      self.loadingExcel = true
      deductionService.deleteDeductionResult({deductionResultId}).then(response => {
        if (response.data.success) {
          alert(response.data.message)
          self.searchNewDeductionResult(self.pageData.currentPage, true)
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
    },
    showModalUploadResultDeduction: function () {
      this.$bvModal.show('modal-upload-result-deduction')
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
    .right {
        text-align: right;
        margin: 0 auto;
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
