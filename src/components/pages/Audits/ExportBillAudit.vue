<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading text-center">Xuất lại file biên bản đối soát</h4>
            <div>
                <div class="col-md-6 center">
                    <button class="btn btn btn-primary btn-secondary" @click="showModal()">Xuất file</button>
                </div>
                <form>
                    <div class="form-filter">
                        <b-form-row>
                            <div class="col-md-4">
                              <b-form-group label="Mã bill">
                                  <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: S1,S2..." v-model="billCodeSearch"/>
                              </b-form-group>
                            </div>
                            <div class="col-md-4">
                                <b-form-group label="Từ ngày:">
                                    <datepicker
                                        v-model="from"
                                        :bootstrapStyling="true"
                                        :format="customFormatter"
                                        class="from-date"
                                        :calendar-button="true"
                                        calendar-button-icon="ion ion-md-calendar"
                                        v-on:selected="dateSelectedFromInChild"
                                    />
                                </b-form-group>
                            </div>
                            <div class="col-md-4">
                                <b-form-group label="Đến ngày:">
                                    <datepicker
                                        v-model="to"
                                        :bootstrapStyling="true"
                                        :format="customFormatter"
                                        class="from-date"
                                        :calendar-button="true"
                                        calendar-button-icon="ion ion-md-calendar"
                                        v-on:selected="dateSelectedToInChild"
                                    />
                                </b-form-group>
                            </div>
                        </b-form-row>
                    </div>
                    <b-form-row>
                        <div class="align-content-center center">
                            <b-button @click="resetForm" class="btn">
                                Nhập lại
                            </b-button>
                            <ladda-btn
                                    :loading="loading[1]"
                                    @click.native="searchExportBill(pageData.currentPage, true, 1)"
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
            <div v-if="successAudit">
                <b-alert :show="dismissCountDownSE" dismissible variant="success" @dismissed="dismissCountDownSE=0">
                    {{ msgNotify }}
                </b-alert>
            </div>
            <!-- Fill data -->
            <div class="result" id="results" v-if="checkResult">
                <b-card no-body v-if="exportBillAudits.length > 0">
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
                                  <b>Tổng số bill audit export: <span class="red-text">{{ pageData.totalItems }}</span></b>
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
                                    <th width="30%">Mã bill</th>
                                    <th width="20%">Link tải file</th>
                                    <th width="30%">Trạng thái</th>
                                    <th width="20%">Thời gian tạo</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(exportBillAudit) in exportBillAudits" class="tr-bill">
                                    <td>
                                      {{ exportBillAudit.Bill.code }}
                                    </td>
                                    <td>
                                      <b-link v-if="exportBillAudit.ExportBillAudit.filepath"
                                        target="_blank"
                                        :href="domainDownload + exportBillAudit.ExportBillAudit.filepath">
                                        Tải file
                                      </b-link>
                                    </td>
                                    <td>
                                      <b-badge variant="outline-danger" v-if="exportBillAudit.ExportBillAudit.status_id === '1'">{{listStatus[1]}}</b-badge>
                                      <b-badge variant="outline-primary" v-if="exportBillAudit.ExportBillAudit.status_id === '2'">{{listStatus[2]}}</b-badge>
                                      <b-badge variant="outline-success" v-if="exportBillAudit.ExportBillAudit.status_id === '3'">{{listStatus[3]}}</b-badge>
                                    </td>
                                    <td>
                                      {{ exportBillAudit.ExportBillAudit.created }}
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
                <div class="no-data" v-if="exportBillAudits.length == 0">
                    <b-alert show dismissible variant="warning">
                        <i class="sidenav-icon ion ion-ios-warning"></i>
                        Không có dữ liệu phù hợp, vui lòng thử lại.
                    </b-alert>
                </div>
            </div>
            <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
            <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingAudit" />
            <b-modal ref="ExportBillModal" size="lg" scrollable title="Xuất file biên bản đối soát" hide-footer :no-close-on-backdrop="true">
              <div class="d-block">
                <b-alert variant="success" v-model="showSuccessMsg">{{ exportBillSuccessMsg ? exportBillSuccessMsg : 'Upload file thành công' }}</b-alert>
                <b-alert variant="danger" v-model="showErrorMsg">{{ exportBillErrorMsg ? exportBillErrorMsg : 'Upload file không thành công' }}</b-alert>
                <b-form-group label="Mã bill">
                  <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: S1,S2..." v-model="billCode"/>
                </b-form-group>
                <div class="center">
                  <ladda-btn
                    :loading="loadingButton"
                    @click.native="exportBill(billCode)"
                    data-style="zoom-out"
                    class="btn btn-primary"
                  >
                    Export
                  </ladda-btn>
                </div>
              </div>
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
import auditService from 'domain/services/audit-service'
import billService from 'domain/services/bill-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import moment from 'moment'
import config from 'config/app.base'

Vue.use(BlockUI)

const listStatus = {
  1: 'Chưa xử lý',
  2: 'Đang xử lý',
  3: 'Đã xử lý'
}

export default {
  components: {
    Datepicker,
    Multiselect,
    LaddaBtn,
    LoadingMiniBottom,
    SidenavRouterLink
  },
  data: () => ({
    htmlTransfer: `<div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>
        <h5 class="text-center mb-0">LOADING...</h5>`,
    billCode: '',
    billCodeSearch: '',
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    listStatus: listStatus,
    exportBillSuccessMsg: '',
    exportBillErrorMsg: '',
    showSuccessMsg: false,
    showErrorMsg: false,
    loading: [false],
    loadingButton: false,
    domainDownload: config.domainDownloadFile,
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
    loadingAudit: false,
    exportBillAudits: [],
    successAudit: false,
    dismissSeconds: 5,
    dismissCountDownSE: 0
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
      this.billCodeSearch = ''
      this.from = moment().format('YYYY-MM-DD')
      this.to = moment().format('YYYY-MM-DD')
    },
    resetFormModal: function () {
      this.billCode = ''
      this.showSuccessMsg = false
      this.showErrorMsg = false
    },
    exportBill: function (billCode) {
      let self = this
      let dataSend = {
        'bill_code': self.billCode
      }
      self.loadingButton = true
      billService.exportBillAudit(dataSend).then(result => {
        if (result.data.success) {
          self.showSuccessMsg = true
          self.showErrorMsg = false
          self.exportBillSuccessMsg = 'Export thành công'
        } else {
          self.showErrorMsg = true
          self.showSuccessMsg = false
          self.exportBillErrorMsg = result.data.msg ? result.data.msg : 'Có lỗi xảy ra'
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.loadingButton = false
      })
    },
    searchExportBill: function (page, newSearchConditions, i) {
      let self = this
      if (self.from && self.to && this.customFormatter(self.from) > this.customFormatter(self.to)) {
        alert('Bạn phải nhập Thời gian Từ ngày nhỏ hơn hoặc bằng thời gian tạo đến ngày!')
        return
      }
      let dataSend = {
        'bill_code': self.billCodeSearch,
        'from': this.customFormatter(self.from),
        'to': this.customFormatter(self.to),
        'page': page
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      // Enable loading
      self.loadingAudit = true
      this.startLoading(i)
      auditService.listExportBillAudit(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.exportBillAudits = response.data.options.exportBillAudits
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
        self.loadingAudit = false
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
      this.searchExportBill(page)
      this.pageData.currentPage = page
    },
    showModal: function () {
      this.resetFormModal()
      this.$refs.ExportBillModal.show()
    },
    hideModal: function () {
      this.resetFormModal()
      this.$refs.ExportBillModal.hide()
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
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
</style>
