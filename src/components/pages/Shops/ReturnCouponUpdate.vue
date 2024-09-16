<template>
    <div>
        <div>
            <div class="ui-block">
                <h4 class="ui-block-heading text-center">Điều chỉnh cam kết hoàn</h4>
                <div class="col-md-6 center">
                    <b-button
                            @click="showImportModal"
                            class="btn btn-success"
                    >
                        <i class="sidenav-icon ion ion-md-cloud-upload"></i>
                        Upload CKH điều chỉnh
                    </b-button>
                </div>
            </div>
            <form>
                <b-form-row>
                    <div class="col-md-6">
                        <b-form-group label="Chọn tháng tính CKH:">
                            <datepicker
                                    v-model="monthDeduction"
                                    :minimum-view="'month'"
                                    :maximum-view="'month'"
                                    :bootstrapStyling="true"
                                    :format="customFormatterMonth"
                                    class="month-deduction"
                                    v-on:selected="monthSelectedInChild"
                            />
                        </b-form-group>
                    </div>
                    <div class="col-md-6">
                        <b-form-group label="Trạng thái:">
                            <multiselect
                                    id="input_deduction_stt"
                                    v-model="selectDeductionStatus"
                                    track-by="name"
                                    label="name"
                                    placeholder="Chọn trạng thái"
                                    :options="DeductionStt"
                                    :searchable="false"
                                    :allow-empty="false">
                            </multiselect>
                        </b-form-group>
                    </div>
                </b-form-row>
                <b-form-row>
                    <div class="align-content-center center">
                        <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="loadingExcelHtml" v-if="loadingExcel" />
                        <ladda-btn
                                :loading="loading[1]"
                                @click.native="searchRCUpdate(pageData.currentPage, true, 1)"
                                data-style="zoom-out"
                                class="btn btn-success"
                        >
                            <i class="sidenav-icon ion ion-md-search"></i>
                            Thông tin shop
                        </ladda-btn>
                        <b-btn v-bind:disabled="btnDisablerunDD" v-if="!btnDisablerunDD && canRunDD" type="button" class="btn btn-danger" @click="runDD">
                            <i class="sidenav-icon ion ion-md-play"></i>
                            Chạy CKH
                        </b-btn>
                        <b-btn v-bind:disabled="btnDisableDD" v-if="!btnDisableDD" type="button" class="btn btn-primary" @click="exportFileDD">
                            <i class="sidenav-icon ion ion-md-cloud-download"></i>
                            Tải file kết quả
                        </b-btn>
                        <b-btn v-bind:disabled="btnDisableZip" v-if="!btnDisableZip" type="button" class="btn btn-danger" @click="exportFileZip">
                            <i class="sidenav-icon ion ion-md-cloud-download"></i>
                            Tải file zip
                        </b-btn>
                    </div>
                </b-form-row>
            </form>
        </div>
        <div v-if="successRun">
            <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
                {{ msgNotify }}
            </b-alert>
        </div>
        <div v-if="errorRun">
            <b-alert :show="dismissCountDownEE" dismissible variant="warning" @dismissed="dismissCountDownEE=0">
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
                                <th width="50%">Thông tin shop</th>
                                <th width="45%">Thông tin Cam kết hoàn</th>
                                <th width="5%">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="dataShops in listShops" class="tr-bill">
                                <td>
                                    <span class="font-weight-bold">Mã shop: </span>
                                    <span class="badge align-text-bottom badge-success"> {{ dataShops.Shop.code }} - {{ dataShops.Shop.name }}</span>
                                    <br/><br/>
                                    <span class="font-weight-bold">Gói cam kết hoàn: </span> {{ dataShops.ReturnCouponType.name }}<br/>
                                    <span class="font-weight-bold">Mã gói CKH: </span> {{ dataShops.ReturnCouponUpdate.rc_type_id }}<br/>
                                    <span class="font-weight-bold">Tháng cam kết hoàn: </span> {{ dataShops.ReturnCouponUpdate.month_dd }}<br/>
                                    <br/>
                                    <span class="font-weight-bold">Thời gian upload: </span> {{ dataShops.ReturnCouponUpdate.created }}<br/>
                                </td>
                                <td>
                                    <span class="font-weight-bold">Trạng thái: </span>
                                    <span class="badge align-text-bottom badge-danger" v-if="dataShops.ReturnCouponUpdate.status == 1">Chưa chạy</span>
                                    <span class="badge align-text-bottom badge-warning" v-if="dataShops.ReturnCouponUpdate.status == 2">Đang chạy</span>
                                    <span class="badge align-text-bottom badge-success" v-if="dataShops.ReturnCouponUpdate.status == 3">Đã chạy xong</span>
                                    <span class="badge align-text-bottom badge-success" v-if="dataShops.ReturnCouponResult.rc_status == 1">Đủ điều kiện CKH</span>
                                    <span class="badge align-text-bottom badge-danger" v-if="dataShops.ReturnCouponResult.rc_status == 2">Không đủ điều kiện CKH</span>
                                    <br/><br/>
                                    <span class="font-weight-bold">Sản lượng cam kết: </span> {{ dataShops.ReturnCouponUpdate.number_pkg }}<br/>
                                    <span class="font-weight-bold">Tỉ lệ cam kết: </span><span v-if="dataShops.ReturnCouponUpdate.rc_type_id != 1">
                                        {{ dataShops.ReturnCouponUpdate.re_value }} %</span><br/>
                                    <br/>
                                    <span class="font-weight-bold">Số đơn được hoàn phí trả: </span> {{ dataShops.ReturnCouponResult.number_pkg }}<br/>
                                </td>
                                <td>
                                    <ladda-btn
                                            @click.native="removeShop(dataShops.ReturnCouponUpdate)"
                                            data-style="zoom-out"
                                            class="btn btn-success"
                                            v-if="canRunDD && dataShops.ReturnCouponUpdate.status == 1"
                                    >
                                        <i class="sidenav-icon ion ion-ios-trash"></i>
                                        Xóa
                                    </ladda-btn>
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
        <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
        <!-- Import file Modal Component -->
        <b-modal ref="importExcelModal" title="Import Excel Shop Deduction Info" static>
            <div class="d-block text-center">
                <b-alert variant="success" show v-if="isUploadSuccess == 1">{{ uploadMsg ? uploadMsg : 'Upload file thành công' }}</b-alert>
                <b-alert variant="danger" show v-if="isUploadSuccess == -1">{{ uploadMsg ? uploadMsg : 'Upload file không thành công' }}</b-alert>
                <!-- <h3>Hello From My Modal!</h3> -->
                <b-form-file v-model="importFile" variant="outline-default" :state="Boolean(importFile)" placeholder="Chọn file..."
                             accept=".xls*" ref="importFile"
                >
                </b-form-file>
                <div class="mt-3">File đã chọn: {{importFile && importFile.name}}</div>
                <ladda-btn
                        :loading="loading[0]"
                        @click.native="uploadFile(0)"
                        data-style="zoom-out"
                        class="btn btn-primary"
                        v-if="importFile"
                >
                    <i class="sidenav-icon ion ion-md-filing"></i>
                    Upload
                </ladda-btn>
            </div>
            <div slot="modal-footer" class="w-100">
                <b-btn class="float-right" variant="default" @click="hideImportModal">
                    Đóng
                </b-btn>
            </div>
        </b-modal>
    </div>

</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import shopService from 'domain/services/shop-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import axios from 'axios'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    customFormatterMonth (month) {
      return moment(month).format('YYYY-MM')
    },
    dateSelectedFromInChild: function (date) {
      this.from = date
    },
    dateSelectedToInChild: function (date) {
      this.to = date
    },
    monthSelectedInChild: function (month) {
      this.monthDeduction = month
    },
    removeShop: function (shop) {
      if (!confirm('Bạn chắc chắn muốn xóa thông tin điều chỉnh CKH của shop ' + shop.shop_code + '?')) {
        return
      }
      let self = this
      self.loadingExcel = true
      axios.get(config.baseApiUrl + 'shops/removeRCUpdate/' + shop.id).then(response => {
        if (response.data.success) {
          self.loadingExcel = false
          self.searchRCUpdate(self.pageData.currentPage, true, 7)
          self.successRun = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.message ? response.data.message : 'Xóa thông tin CKH shop ' + shop.shop_code + ' thành công.'
        } else {
          self.loadingExcel = false
          alert('Không thể xóa thông tin CKH shop ' + shop.shop_code + ', vui lòng kiểm tra lại!')
        }
      })
    },
    runDD: function () {
      let self = this
      if (!confirm('Bạn muốn chạy lại CKH ' + self.customFormatterMonth(this.monthDeduction) + ' cho các shop này?')) {
        return
      }
      let dataSend = {
        'month_deduction': self.customFormatterMonth(this.monthDeduction),
        'stt': self.deductions.stt
      }
      self.loadingExcel = true
      self.successRun = false
      self.errorRun = false
      shopService.runReturnCouponUpdate(dataSend).then(response => {
        if (response.data.success) {
          self.selectDeductionStatus = []
          self.selectDeductionStatus = { name: 'Đang chạy', dd_stt: '2' }
          self.searchRCUpdate(self.pageData.currentPage, true, 7)
          self.successRun = true
          self.dismissCountDownSE = self.dismissSeconds
          self.msgNotify = response.data.message ? response.data.message : 'Chạy lại CKH thành công. Vui lòng chờ hệ thống hoàn tất quá trình chiết khấu!'
        } else {
          self.errorRun = true
          self.dismissCountDownEE = self.dismissSeconds
          self.msgNotify = response.data.message ? response.data.message : 'Có lỗi xảy ra. Hãy thử lại nhé!'
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    exportFileDD: function () {
      let self = this
      let dataSend = {
        'month_deduction': self.customFormatterMonth(this.monthDeduction)
      }
      self.loadingExcel = true
      shopService.exportFileRCUpdate(dataSend).then(response => {
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
    exportFileZip: function () {
      let self = this
      let dataSend = {
        'month_deduction': self.customFormatterMonth(this.monthDeduction)
      }
      self.loadingExcel = true
      shopService.exportFileZipRCUpdate(dataSend).then(response => {
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
    showImportModal: function () {
      this.resetModal()
      this.$refs.importExcelModal.show()
    },
    hideImportModal: function () {
      this.$refs.importExcelModal.hide()
    },
    uploadFile: function (i) {
      let self = this

      if (!self.importFile) {
        alert('Bạn chưa chọn file upload!')
        return
      }

      let fileExtension = this.importFile.name.split('.').pop()
      if (['xlsx', 'xls'].indexOf(fileExtension) < 0) {
        alert('Bạn phải upload file định dạng Excel .xlsx hoặc .xls !')
        return
      }

      let dataSend = new FormData()
      dataSend.append('file_upload', self.importFile)

      self.uploadMsg = ''
      self.startLoading(i)
      shopService.uploadFileRCUpdate(dataSend).then(response => {
        if (response.data.success) {
          self.isUploadSuccess = 1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.updateLoadingValue(i, false)
        } else {
          self.isUploadSuccess = -1
          if (response.data.message) {
            self.uploadMsg = response.data.message
          }
          self.updateLoadingValue(i, false)
        }
      }).catch(error => {
        if (error) {
          self.isUploadSuccess = -1
          self.updateLoadingValue(i, false)
        }
      }).then(function () {
        self.updateLoadingValue(i, false)
        self.appLoading = false
      })
    },
    searchRCUpdate: function (page, newSearchConditions, i) {
      let self = this
      let dataSend = {
        'month_deduction': self.customFormatterMonth(this.monthDeduction),
        'dd_stt': self.selectDeductionStatus.dd_stt,
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
      shopService.searchRCUpdate(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
          self.canRunDD = response.data.options.canRunDD
          if (self.listShops.length > 0) {
            if (self.selectDeductionStatus.dd_stt === '1') {
              self.btnDisablerunDD = false
              self.btnDisableDD = true
              self.btnDisableZip = true
            } else if (self.selectDeductionStatus.dd_stt === '2') {
              self.btnDisablerunDD = true
              self.btnDisableDD = true
              self.btnDisableZip = true
            } else if (self.selectDeductionStatus.dd_stt === '3') {
              self.btnDisablerunDD = true
              self.btnDisableDD = false
              self.btnDisableZip = false
            }
          } else {
            self.btnDisablerunDD = true
            self.btnDisableDD = true
            self.btnDisableZip = true
          }
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
    resetModal: function () {
      this.isUploadSuccess = 0
      this.uploadMsg = ''
      this.$refs.importFile.reset()
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
      this.searchRCUpdate(page)
      this.pageData.currentPage = page
    }
  },
  data: () => ({
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    monthDeduction: moment().subtract(1, 'month').format('YYYY-MM'),
    deductions: {
      stt: ''
    },
    selectDeductionStatus: { name: 'Chưa chạy', dd_stt: '1' },
    DeductionStt: [
      { name: 'Chưa chạy', dd_stt: '1' },
      { name: 'Đang chạy', dd_stt: '2' },
      { name: 'Đã chạy xong', dd_stt: '3' }
    ],
    loading: [false, false],
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
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    isUploadSuccess: 0,
    appLoading: false,
    listShops: [],
    checkResult: false,
    uploadMsg: '',
    importFile: null,
    successRun: false,
    errorRun: false,
    dismissSeconds: 3,
    dismissCountDownSE: 0,
    dismissCountDownEE: 0,
    msgNotify: '',
    btnDisableDD: true,
    btnDisableZip: true,
    btnDisablerunDD: true,
    canRunDD: false
  })

}
</script>
<style scoped>
    .center {
        text-align: center;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .multiselect--active {
        z-index: 99;
    }
</style>
