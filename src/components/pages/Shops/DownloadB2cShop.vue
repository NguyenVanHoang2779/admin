<template>
    <div>
        <div class="ui-block">
            <h3 class="text-center">Tải file phí chia sẻ doanh thu shop sử dụng API B2C + Haravan</h3>
            <div>
                <form>
                    <div class="form-filter">
                        <b-form-row>
                            <div class="col-md-12">
                                <b-form-group label="Chọn tháng:">
                                    <datepicker
                                            v-model="monthExport"
                                            :minimum-view="'month'"
                                            :maximum-view="'month'"
                                            :bootstrapStyling="true"
                                            :format="customFormatterMonth"
                                            class="month-deduction"
                                            v-on:selected="monthSelectedInChild"
                                    />
                                </b-form-group>
                            </div>
                        </b-form-row>
                    </div>
                    <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="loadingExcelHtml" v-if="loadingExcel" />
                    <b-form-row>
                        <div class="align-content-center center">
                            <div class="col-md-12 text-center">
                                <b-button
                                        class="btn btn-success"
                                        @click="searchFileExport(pageData.currentPage, true)"
                                >
                                    <i class="sidenav-icon ion ion-md-search"></i>
                                    Tìm kiếm
                                </b-button>
                            </div>
                        </div>
                    </b-form-row>
                </form>
            </div>
            <div class="result" id="results">
                <b-card no-body v-if="showResult">
                    <b-card-body class="pt-0 pb-3">
                        <div class="row">
                            <div class="col-sm pt-3">
                                <b-pagination
                                        :total-rows="pageData.totalItems"
                                        v-model="pageData.currentPage"
                                        :per-page="pageData.perPage"
                                        v-on:change="pageChanged"
                                />
                                Tổng số file: {{ pageData.totalItems }}
                            </div>
                            <div class="col-sm text-sm-left text-center pt-3">
                                <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                            </div>
                        </div>
                    </b-card-body>
                    <div class="table-result" >
                        <!-- Table -->
                        <div class="table-responsive mb-4">
                            <table class="table mb-0 table-bordered">
                                <thead class="" style="width: 100%">
                                <tr>
                                    <th width="25%">Thông tin file</th>
                                    <th width="60%">Chi tiết</th>
                                    <th width="10%">Trạng thái</th>
                                    <th width="5%">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(fileItem,index) in listFiles" :key="index">
                                    <td scope="row" :data-file-id="fileItem.id">
                                        <span>ID: </span><span class="font-weight-bold">{{ fileItem.id }}</span><br/>
                                        <span>Thời gian tạo file: </span><span class="font-weight-bold">{{ fileItem.created }}</span><br/>
                                    </td>
                                    <td>
                                        <span>- Mã shop: </span><span class="font-weight-bold">{{ fileItem.options.shop }}</span><br/>
                                        <span>- Thời gian hoàn thành đơn: </span><br/>
                                        <span>&nbsp;&nbsp;&nbsp;Từ: </span><span class="font-weight-bold">&nbsp;&nbsp;{{ fileItem.options.firstDate }}</span><br/>
                                        <span>&nbsp;&nbsp;&nbsp;Đến: </span><span class="font-weight-bold">{{ fileItem.options.lastDate }}</span><br/>
                                    </td>
                                    <td>
                                        <span>{{ fileItem.status }}</span><br/>
                                        <span class="font-weight-bold">{{ fileItem.process }}</span>
                                    </td>
                                    <td>
                                        <b-link
                                                target="_blank"
                                                :class="{'disabled': (fileItem.status === 'none' || fileItem.status === 'process')}"
                                                :href="domainDownload + fileItem.filepath">
                                            Tải file
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
    </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Multiselect from 'vue-multiselect'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import shopService from 'domain/services/shop-service'
import moment from 'moment'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    LaddaBtn,
    Datepicker,
    Multiselect
  },
  data: () => ({
    monthExport: moment().subtract(1, 'month').format('YYYY-MM'),
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    listFiles: [],
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
  methods: {
    customFormatterMonth (month) {
      return moment(month).format('YYYY-MM')
    },
    monthSelectedInChild: function (month) {
      this.monthExport = month
    },
    searchFileExport: function (page, newSearchConditions) {
      let self = this
      let dataSend = {
        'page': page,
        'limit': self.pageData.perPage,
        'month_export': self.customFormatterMonth(this.monthExport)
      }

      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      self.loadingExcel = true
      shopService.searchFileExport(dataSend).then(response => {
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
      this.searchFileExport(page)
      this.pageData.currentPage = page
    }
  },
  computed: {
    showResult: function () {
      return (this.listFiles.length > 0)
    },
    totalItems () {
      return this.listFiles.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  created () {
    this.searchFileExport(this.pageData.currentPage) // Get data users
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
    a.disabled {
        color: red;
        pointer-events: none;
        cursor: not-allowed;
    }
</style>
