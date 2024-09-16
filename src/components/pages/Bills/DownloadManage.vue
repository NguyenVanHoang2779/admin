<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading text-center">Quản lý download</h4>
        </div>
        <form>
            <b-form-row>
                <div class="col-md-6">
                    <b-form-group label="Người tạo">
                        <b-form-input
                                v-model="subjects"
                                type="text"
                                placeholder="Nhiều người tạo cách nhau bằng dấu phẩy. Ví dụ: amdmin,user1...">
                        </b-form-input>
                    </b-form-group>
                </div>
                <div class="col-md-6">
                    <b-form-group label="File">
                        <b-form-input
                                v-model="uuid"
                                type="text"
                                placeholder="Nhiều tên file cách nhau bằng dấu phẩy. Ví dụ: file1,file2...">
                        </b-form-input>
                    </b-form-group>
                </div>
            </b-form-row>
            <b-form-row>
                <div class="col-md-6">
                    <b-form-group
                            label="Kiểu dữ liệu">
                        <multiselect
                                v-model="selectExportType"
                                track-by="name"
                                label="name"
                                placeholder="Chọn kiểu dữ liệu"
                                :options="exportTypes"
                                :searchable="false"
                                :allow-empty="false">
                        </multiselect>
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
                        />
                    </b-form-group>
                </div>
            </b-form-row>
            <b-form-row>
                <div class="col-md-12">
                    <div class="align-content-center text-center">
                        <b-btn type="button" @click="resetForm">
                            Nhập lại
                        </b-btn>
                        <b-btn type="button" class="btn btn-success" @click="searchFileDownload(pageData.currentPage, true)">
                            <i class="sidenav-icon ion ion-md-search"></i>
                            Tìm kiếm
                        </b-btn>
                    </div>
                </div>
            </b-form-row>
        </form>
        <br>
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
                                <th width="25%">Thông tin xuất file</th>
                                <th width="60%">Chi tiết</th>
                                <th width="10%">Trạng thái</th>
                                <th width="5%">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(fileItem,index) in listFiles" :key="index">
                                <td scope="row" :data-file-id="fileItem.id">
                                    <span>ID: </span><span class="font-weight-bold">{{ fileItem.id }}</span><br/>
                                    <span>Thời gian: </span><span class="font-weight-bold">{{ fileItem.created }}</span><br/>
                                    <span>Người tạo: </span><span class="font-weight-bold">{{ fileItem.subject }}</span><br/>
                                    <span>Loại file: </span><span
                                        class="font-weight-bold">{{ fileItem.type }}</span><br/>
                                </td>
                                <td>
                                    <span>- Thời gian tạo hóa đơn: </span><br/>
                                    <span>&nbsp;&nbsp;&nbsp;Từ: </span><span class="font-weight-bold">&nbsp;&nbsp;{{ fileItem.options.timefrom }} 00:00:00</span><br/>
                                    <span>&nbsp;&nbsp;&nbsp;Đến: </span><span class="font-weight-bold">{{ fileItem.options.timeto }} 23:59:59</span><br/>
                                    <span>- Kiểu hóa đơn: </span><span class="font-weight-bold">{{ fileItem.options.bill_type }}</span><br/>
                                    <span v-if="fileItem.options.station">
                                        <span>- Kho: </span><span class="font-weight-bold">{{ fileItem.options.station }}</span><br/>
                                    </span>
                                    <span v-if="fileItem.options.cod">
                                        <span>- Cod: </span><span class="font-weight-bold">{{ fileItem.options.cod }}</span><br/>
                                    </span>
                                    <span v-if="fileItem.options.createdUsername">
                                        <span>- Người tạo hóa đơn: </span><span class="font-weight-bold">{{ fileItem.options.createdUsername }}</span><br/>
                                    </span>
                                    <span v-if="fileItem.options.billCode">
                                        <span>- Mã hóa đơn: </span><span class="font-weight-bold">{{ fileItem.options.billCode }}</span><br/>
                                    </span>
                                    <span v-if="fileItem.options.pkgAlias">
                                        <span>- Mã đơn hàng: </span><span class="font-weight-bold">{{ fileItem.options.pkgAlias }}</span><br/>
                                    </span>
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
</template>
<script>
import billService from 'domain/services/bill-service'
import Multiselect from 'vue-multiselect'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    Multiselect,
    Datepicker
  },
  data: () => ({
    subjects: '',
    uuid: '',
    listFiles: [],
    selectExportType: { name: 'Chọn kiểu dữ liệu', export_type: '' },
    exportTypes: [
      { name: 'Chọn kiểu dữ liệu', export_type: '' },
      { name: 'Chi tiết hóa đơn COD', export_type: 'detail_bill_cod' }
    ],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
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
    `,
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  }),
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
  methods: {
    resetForm: function () {
      this.subjects = ''
      this.uuid = ''
    },
    searchFileDownload: function (page, newSearchConditions) {
      let self = this
      let dataSend = {
        'subjects': self.subjects,
        'uuid': self.uuid,
        'export_type': self.selectExportType.export_type,
        'page': page,
        'limit': self.pageData.perPage,
        'date_from': self.customFormatter(this.from),
        'date_to': self.customFormatter(this.to)
      }

      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      self.loadingExcel = true
      billService.billDownloadInfo(dataSend).then(response => {
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
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    dateSelectedFromInChild: function (date) {
      this.from = date
    },
    dateSelectedToInChild: function (date) {
      this.to = date
    }
  },
  created () {
    if (this.$route.query.type === 'detail_cod') {
      this.selectExportType = { name: 'Chi tiết hóa đơn COD', export_type: 'detail_bill_cod' }
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
    .multiselect--active {
        z-index: 99;
    }
</style>
