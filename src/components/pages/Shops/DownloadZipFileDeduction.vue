/* eslint-disable */
<template>
  <div>
    <div class="ui-block">
      <b-form-row>
        <h4 class="ui-block-heading col-md-6">Quản lý tải file zip chiết khấu</h4>
        <div class="col-md-6 center">
          <b-button class="btn btn-warning">
            <div v-if="selectExportType.export_type === 'return_coupon'">
              <sidenav-router-link to="/shops/return-coupon-result"><i class="sidenav-icon ion ion-md-fastforward"></i>Kết quả cam kết hoàn</sidenav-router-link>
            </div>
            <div v-if="selectExportType.export_type === 'deduction_update'">
              <sidenav-router-link to="/deduction-again"><i class="sidenav-icon ion ion-md-fastforward"></i>Chạy lại chiết khấu thường</sidenav-router-link>
            </div>
          </b-button>
        </div>
      </b-form-row>
    </div>
    <div class="form-filter">
    <form>
      <b-form-row>
        <div class="col-md-6">
          <b-form-group label="Từ:">
            <datepicker
              v-model="from"
              :bootstrapStyling="true"
              :format="customFormatter"
              class="from-date"
              v-on:selected="dateSelectedFromInChild"
            />
          </b-form-group>
        </div>
        <div class="col-md-6">
          <b-form-group label="Đến:">
            <datepicker
              v-model="to"
              :bootstrapStyling="true"
              :format="customFormatter"
              class="to-date"
              v-on:selected="dateSelectedToInChild"
            />
          </b-form-group>
        </div>
      </b-form-row>
      <b-form-row>
        <div class="col-md-12">
          <b-form-group label="Kiểu dữ liệu">
            <multiselect
              v-model="selectExportType"
              track-by="name"
              label="name"
              placeholder="Cam kết hoàn"
              :options="exportTypes"
              :searchable="false"
              :allow-empty="false">
            </multiselect>
          </b-form-group>
        </div>
      </b-form-row>
    </form>
    </div>
    <b-form-row>
      <div class="col-md-12 center">
        <div class="align-content-center text-center">
          <b-btn type="button" class="btn btn-success" @click="searchFileDownload(pageData.currentPage, true)">
            <i class="sidenav-icon ion ion-md-search"></i>
            Tìm kiếm
          </b-btn>
        </div>
      </div>
    </b-form-row>
    <br>
    <div class="result" id="results">
      <b-card no-body v-if="showResult">
        <div class="table-result" >
          <!-- Table -->
          <div class="table-responsive mb-4">
            <table class="table mb-0 table-bordered">
              <thead class="" style="width: 100%">
              <tr>
                <th>Ngày</th>
                <th>Tên</th>
                <th>Link</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(fileItem,index) in listFiles" :key="index">
                <td scope="row" :data-file-id="fileItem.id">
                  <span></span><span class="font-weight-bold">{{ fileItem.date }}</span><br/>
                </td>
                <td scope="row" :data-file-id="fileItem.id">
                  <span></span><span class="font-weight-bold">{{ fileItem.name }}</span><br/>
                </td>
                <td>
                  <b-link
                    target="_blank"
                    :class="{'disabled': (fileItem.status === 'none' || fileItem.status === 'process')}"
                    :href="domainDownload + fileItem.filepath">
                    Download Link
                  </b-link>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Pagination -->
        <b-card-body class="pt-0 pb-3">
          <div class="row">
            <div class="col-sm pt-3">
              <b-pagination
                :total-rows="pageData.totalItems"
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
        <!-- / Pagination -->
      </b-card>

      <div class="no-data" v-if="!showResult">
        <b-alert show variant="danger"> Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác!</b-alert>
      </div>
      <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="loadingExcelHtml" v-if="loadingExcel" />
    </div>
  </div>
</template>
<script>
import shopService from 'domain/services/shop-service'
import Multiselect from 'vue-multiselect'
import BlockUI from 'vue-blockui'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import Vue from 'vue'
import config from 'config/app.base'
import { SidenavRouterLink } from '@/vendor/libs/sidenav'

Vue.use(BlockUI)

export default {
  components: {
    Multiselect,
    Datepicker,
    SidenavRouterLink
  },
  data: () => ({
    from: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    to: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    subjects: '',
    listFiles: [],
    selectExportType: {name: 'Cam kết hoàn', export_type: 'return_coupon'},
    exportTypes: [
      { name: 'Cam kết hoàn', export_type: 'return_coupon' },
      { name: 'Chiết khấu thường', export_type: 'deduction' },
      { name: 'Chiết khấu thường điều chỉnh', export_type: 'deduction_update' },
      { name: 'Chiết Khấu đặc biệt', export_type: 'new_deduction' }
    ],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 50,
      sortBy: 'id',
      sortDesc: false
    },
    domainDownload: config.domainDownloadFile,
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
  computed: {
    showResult: function () {
      return (this.listFiles.length > 0)
    }
  },
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
    searchFileDownload: function (page, newSearchConditions) {
      let self = this
      let dataSend = {
        'date_from': self.customFormatter(this.from),
        'date_to': self.customFormatter(this.to),
        'export_type': self.selectExportType.export_type,
        'page': page,
        'limit': self.pageData.perPage
      }

      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      self.loadingExcel = true
      shopService.downloadZipFileDeduction(dataSend).then(response => {
        if (response.data.success) {
          self.listFiles = response.data.data
          self.pageData.totalItems = response.data.options.total
          self.pageData.totalPages = response.data.options.total_page
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.loadingExcel = false
      })
    },
    pageChanged: function (page) {
      this.searchFileDownload(page)
      this.pageData.currentPage = page
    },
    setDefaultTime: function (monthDD) {
      this.from = monthDD
      this.to = monthDD
    }
  },
  created () {
    if (this.$route.query.month) {
      this.from = this.$route.query.month
      this.to = this.$route.query.month
    }
    switch (this.$route.query.type) {
      case 'deduction_update':
        this.selectExportType.name = 'Chiết khấu thường điều chỉnh'
        this.selectExportType.export_type = 'deduction_update'
        break
      case 'return_coupon':
        this.selectExportType.name = 'Cam kết hoàn'
        this.selectExportType.export_type = 'return_coupon'
        break
    }
    this.searchFileDownload(this.pageData.currentPage) // Get data users
  }
}
</script>
<style scoped>
a.disabled {
  color: red;
  pointer-events: none;
  cursor: not-allowed;
}
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
</style>
