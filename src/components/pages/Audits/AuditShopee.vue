<template>
  <div>
    <div class="ui-block">
      <b-form-row>
        <h4 class="ui-block-heading col-md-6">Đối soát Shopee</h4>
        <div class="col-md-6 center">
          <b-button
                  @click="showImportModal"
                  class="btn btn-success"
          >
            <i class="sidenav-icon ion ion-md-filing"></i>
            Upload đơn hàng
          </b-button>
          <button class="btn btn-primary"><sidenav-router-link to="/audit/upload-manage">Quản lý upload</sidenav-router-link></button>
          <button class="btn btn-warning"><sidenav-router-link to="/audit/download-manage">Quản lý download</sidenav-router-link></button>
        </div>
      </b-form-row>
      <div>
        <form>
          <div class="form-filter">
            <b-form-row>
              <div class="col-md-6">
                <b-form-group label="Mã đơn hàng">
                  <b-input type="text" placeholder="Nhập mã đơn hàng cách nhau bởi dấu phẩy" v-model="shopeeAuditPackage.pkg_order"/>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group label="Người upload">
                  <b-input type="text" placeholder="Nhập tên người upload file" v-model="shopeeAuditPackage.uploaded_username"/>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-12">
                <b-form-group label="Trạng thái">
                  <multiselect
                          v-model="selectStatus"
                          track-by="name"
                          label="name"
                          placeholder="Chọn trạng thái"
                          :options="statusTypes"
                          :searchable="false"
                          :allow-empty="false">
                  </multiselect>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-6">
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
              <div class="col-md-6">
                <b-form-group label="Đến:">
                  <datepicker
                          v-model="to"
                          :bootstrapStyling="true"
                          :format="customFormatter"
                          class="from-date"
                          v-on:selected="dateSelectedToInChild"
                          v-bind:disabled="inputDisable"
                  />
                </b-form-group>
              </div>
            </b-form-row>
          </div>
          <b-form-row>
            <div class="align-content-center center">
              <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="loadingExcelHtml" v-if="loadingExcel" />
              <ladda-btn
                      @click.native="resetForm"
                      data-style="zoom-out"
                      class="btn"
              >
                Nhập lại
              </ladda-btn>
              <ladda-btn
                      :loading="loading[1]"
                      @click.native="searchAuditPackage(pageData.currentPage, true, 1)"
                      data-style="zoom-out"
                      class="btn btn-success"
              >
                <i class="sidenav-icon ion ion-md-search"></i>
                Tìm kiếm
              </ladda-btn>
              <b-btn type="button" class="btn btn-success" @click="exportFileV2">
                <i class="sidenav-icon ion ion-md-filing"></i>
                Xuất file
              </b-btn>
            </div>
          </b-form-row>
        </form>
      </div>
      <!-- Fill data -->
      <div class="result" id="results" v-if="checkResult">
        <b-card no-body v-if="listAuditPackages.length > 0">
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
                  Tổng số đơn hàng: {{ pageData.totalItems }}
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
                    <th width="90%">Thông tin đơn hàng</th>
                    <th width="10%">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dataPackages in listAuditPackages" class="tr-bill">
                    <td>
                      <span><b>Mã đơn hàng:  </b> </span>
                      <a
                              :href="clickAlias(dataPackages.Package.alias)"
                              target="_blank"
                              class="text-decoration-none text-alias"
                      >
                        {{ dataPackages.Package.alias }}
                      </a> <br />
                      <span class="font-weight-bold" v-if="dataPackages.Package.is_freeship == 1">Free Ship cho khách</span>
                      <span class="font-weight-bold" v-if="dataPackages.Package.is_freeship == 0">Khách trả tiền Ship</span>
                      <br/><br/>
                      <span class="font-weight-bold">Trạng thái: </span> {{ packageStatuses[dataPackages.Package.package_status_id] }} <br/>
                      <span class="font-weight-bold">Tiền thu hộ: </span> {{ dataPackages.Package.getFinalPickMoney }}<br/>
                      <span class="font-weight-bold">Phí dịch vụ: </span> {{ dataPackages.Package.isExcludeInsuranceFee }}<br/>
                      <span class="font-weight-bold">Shop trả trước: </span> {{ dataPackages.Package.getFinalPrePaidAmount }}<br/>
                      <span class="font-weight-bold">Phí đồng kiểm: </span> {{ dataPackages.Package.getFinalCoCheckFee }}<br/>
                      <span class="font-weight-bold">Phí chuyển hoàn: </span> {{ dataPackages.Package.getFinalReturnFee }}<br/>
                      <span class="font-weight-bold">Khuyến mãi: </span> {{ dataPackages.Package.discountAmount }}<br/>
                      <span class="font-weight-bold">Tiền trả shop: </span> {{ dataPackages.Package.finalCashBack }}<br/>
                      <span class="font-weight-bold">Tên KH: </span> {{ dataPackages.Package.customer_fullname }} <br/>
                      <span class="font-weight-bold">Địa chỉ: </span> {{ dataPackages.Package.customer_first_address }} - {{ dataPackages.Package.customer_last_address }} <br/>
                      <span class="font-weight-bold">ĐT KH: </span> {{ dataPackages.Package.customer_tel }} <br/>
                      <span><b>Người upload: </b>{{ dataPackages.PackageWaudit ? dataPackages.PackageWaudit.uploaded_username : '' }}</span>
                    </td>
                    <td>
                      <b-button size="sm" variant="danger" @click="deleteAuditPackage(dataPackages.Package.order)">
                        <i class="ion ion-md-trash"></i>
                        Xóa
                      </b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-card>
        <div class="no-data" v-if="listAuditPackages.length == 0">
          <b-alert show dismissible variant="warning">
            <i class="sidenav-icon ion ion-ios-warning"></i>
            Không có dữ liệu phù hợp, vui lòng thử lại.
          </b-alert>
        </div>
      </div>
      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>

    <!-- Import file Modal Component -->
    <b-modal ref="importExcelModal" title="Import Excel đối soát"
      static
    >
      <div class="d-block text-center">
        <b-alert variant="success" show v-if="isUploadSuccess == 1">Upload file thành công</b-alert>
        <b-alert variant="danger" show v-if="isUploadSuccess == -1">{{ uploadErrorMsg ? uploadErrorMsg : 'Upload file không thành công' }}</b-alert>
        <!-- <h3>Hello From My Modal!</h3> -->
        <b-form-file v-model="importFile" variant="outline-default" :state="Boolean(importFile)" placeholder="Chọn file..."
          accept=".csv" ref="importFile"
        >
        </b-form-file>
        <div class="mt-3">File đã chọn: {{importFile && importFile.name}}</div>
        <!-- <b-btn variant="primary" @click="uploadFile">
          Upload
        </b-btn> -->
        <ladda-btn
                :loading="loading[0]"
                @click.native="uploadFile(0)"
                data-style="zoom-out"
                class="btn btn-primary"
                v-if="importFile"
        >
          <i class="sidenav-icon ion ion-md-search"></i>
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

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import auditService from 'domain/services/audit-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    Datepicker,
    Multiselect,
    LaddaBtn,
    SidenavRouterLink,
    LoadingMiniBottom
  },
  data: () => ({
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    shopeeAuditPackage: {
      pkg_order: '',
      uploaded_username: ''
    },
    selectStatus: { name: 'Tất cả', status_type: '' },
    statusTypes: [
      { name: 'Tất cả', status_type: '' },
      { name: 'Chưa đối soát', status_type: 'not_audited' },
      { name: 'Đã đối soát', status_type: 'audited' }
    ],
    isUploadSuccess: 0,
    loading: [false, false],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    appLoading: false,
    listAuditPackages: [],
    packageAjax: [],
    inputDisable: false,
    checkResult: false,
    packageStatuses: [],
    packageDebtBill: [],
    loadingSum: false,
    uploadErrorMsg: '',
    importFile: null,
    loadingExcel: false,
    loadingExcelHtml: `
      <div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
      <h5 class="text-center mb-0">LOADING...</h5>
    `
  }),
  methods: {
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
      if (fileExtension !== 'csv') {
        alert('Bạn phải upload file định dạng .csv!')
        return
      }

      let dataSend = new FormData()
      dataSend.append('file_upload', self.importFile)

      self.uploadErrorMsg = ''
      self.startLoading(i)
      auditService.uploadFileAuditShopee(dataSend).then(response => {
        if (response.data.success) {
          self.isUploadSuccess = 1
          self.updateLoadingValue(i, false)
          window.location.href = '/adm/audit/upload-manage?success=true'
        } else {
          self.isUploadSuccess = -1
          if (response.data.message) {
            self.uploadErrorMsg = response.data.message
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
    searchAuditPackage: function (page, newSearchConditions, i) {
      let self = this

      let dataSend = {
        'pkg_alias': self.shopeeAuditPackage.pkg_order,
        'uploaded_username': self.shopeeAuditPackage.uploaded_username,
        'created_from': this.customFormatter(self.from),
        'created_to': this.customFormatter(self.to),
        'status': this.selectStatus.status_type,
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
      auditService.searchAuditPackage(dataSend).then(response => {
        if (response.data.success) {
          self.checkResult = response.data.success
          self.packageStatuses = response.data.options.packageStatuses
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listAuditPackages = response.data.options.packages
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
    deleteAuditPackage: function (pkgOrder) {
      if (!confirm('Bạn chắc chắn muốn xóa?')) {
        return
      }

      let dataSend = {
        'pkg_order': pkgOrder
      }
      auditService.deleteWAuditPackage(dataSend).then(response => {
        if (response.data.success) {
          alert('Xóa thành công!!')
          this.searchAuditPackage(this.pageData.currentPage)
        } else {
          alert('Xóa không thành công!! Hãy thử lại')
        }
      }).catch(error => {
        if (error) {
          alert('Xóa không thành công!! Hãy thử lại')
        }
      })
    },
    exportFile: function () {
      let self = this
      let domainDownload = config.domainDownloadFile

      let dataSend = {
        'pkg_alias': self.shopeeAuditPackage.pkg_order,
        'uploaded_username': self.shopeeAuditPackage.uploaded_username,
        'created_from': this.customFormatter(self.from),
        'created_to': this.customFormatter(self.to),
        'status': this.selectStatus.status_type
      }
      self.loadingExcel = true
      auditService.exportFile(dataSend).then(response => {
        if (response.data.success) {
          window.location.href = domainDownload + response.data.data
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
    exportFileV2: function () {
      let self = this
      let dataSend = {
        'pkg_alias': self.shopeeAuditPackage.pkg_order,
        'uploaded_username': self.shopeeAuditPackage.uploaded_username,
        'created_from': this.customFormatter(self.from),
        'created_to': this.customFormatter(self.to),
        'status': this.selectStatus.status_type
      }
      self.loadingExcel = true
      auditService.exportFileV2(dataSend).then(response => {
        self.$router.push('/audit/download-manage')
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
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
      this.shopeeAuditPackage.pkg_order = ''
      this.shopeeAuditPackage.uploaded_username = ''
    },
    resetModal: function () {
      this.isUploadSuccess = 0
      this.uploadErrorMsg = ''
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
      this.searchAuditPackage(page)
      this.pageData.currentPage = page
    },
    clickAlias: function (alias) {
      return '/admin?alias=' + alias
    }
  },
  computed: {
    totalItems () {
      return this.listBills.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
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
  .loading-sum {
    position: absolute;
    top:50%;
    left:48%;
    transform: translate(-50%, -50%);
    height: 100px;
  }
  .lds-spinner {
    color: #26B4FF;
    display: inline-block;
    position: relative;
    width: 0px;
    height: 0px;
  }
  .lds-spinner div {
    transform-origin: 32px 32px;
    animation: lds-spinner 1.2s linear infinite;
  }
  .lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 29px;
    width: 5px;
    height: 14px;
    border-radius: 20%;
    background: #26B4FF;
    z-index: 10;
  }
  .lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  .lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  .lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  .lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  .lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  .lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  .lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  .lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  .lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  .lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  .lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  .lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

</style>
