<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading text-center">Quản lý upload</h4>
    </div>
    <form>
      <b-form-row>
        <div class="col-md-12">
          <b-form-group
              horizontal
              :label-cols="1"
              label="Người upload"
              label-for="input_subjects">
            <b-form-input
                v-model="subjects"
                type="text"
                id="input_subjects"
                placeholder="Nhiều người tạo cách nhau bằng dấu phẩy. Ví dụ: amdmin,user1...">
            </b-form-input>
          </b-form-group>
        </div>
      </b-form-row>
      <b-form-row>
        <div class="col-md-12">
          <b-form-group
              horizontal
              :label-cols="1"
              label="File ID"
              label-for="input_uuid">
            <b-form-input
                v-model="uuid"
                type="text"
                id="input_uuid"
                placeholder="Nhiều tên file cách nhau bằng dấu phẩy. Ví dụ: file1,file2...">
            </b-form-input>
          </b-form-group>
        </div>
      </b-form-row>
      <b-form-row>
        <div class="col-md-6">
          <b-form-group
              horizontal
              :label-cols="2"
              label="Từ">
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
          <b-form-group
              horizontal
              :label-cols="1"
              label="Đến">
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
    <b-alert :show="dismissCountDown"
             dismissible
             variant="success"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged">
      Upload file thành công
    </b-alert>
    <div class="result" id="results">
      <b-card no-body v-if="showResult">
        <div class="table-result" >
          <!-- Table -->
          <div class="table-responsive mb-4">
            <table class="table mb-0 table-bordered">
              <thead class="" style="width: 100%">
                <tr>
                  <th>File</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fileItem,index) in listFiles" :key="index">
                  <td scope="row" :data-file-id="fileItem.id">
                    <span>ID: </span><span class="font-weight-bold">{{ fileItem.id }}</span><br/>
                    <span>Thời gian: </span><span class="font-weight-bold">{{ fileItem.created }}</span><br/>
                    <span>Người tạo: </span><span class="font-weight-bold">{{ fileItem.subject }}</span><br/>
                    <span>File ID: </span><span class="font-weight-bold">{{ fileItem.uuid }}</span><br/>
                    <span>Tên file: </span><span class="font-weight-bold">{{ fileItem.old_filename }}</span><br/>
                  </td>
                  <td>
                    <span>{{ fileItem.status }}</span><br/>
                    <span class="font-weight-bold">{{ fileItem.process }} / {{ fileItem.total }} dòng</span>
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

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import auditService from 'domain/services/audit-service'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import config from 'config/app.base'

Vue.use(BlockUI)

export default {
  components: {
    Datepicker
  },
  data: () => ({
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    loading: [false, false],
    subjects: '',
    uuid: '',
    listFiles: [],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    inputDisable: false,
    domainDownload: config.domainDownloadFile,
    dismissCountDown: 0,
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
    resetForm: function () {
      this.subjects = ''
      this.uuid = ''
    },
    searchFileDownload: function (page, newSearchConditions) {
      let self = this
      let dataSend = {
        'subjects': self.subjects,
        'uuid': self.uuid,
        'created_from': this.customFormatter(self.from),
        'created_to': this.customFormatter(self.to),
        'page': page,
        'limit': self.pageData.perPage
      }

      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      self.loadingExcel = true
      auditService.fileUploadInfo(dataSend).then(response => {
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
        self.resetForm()
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
    pageChanged: function (page) {
      this.searchFileDownload(page)
      this.pageData.currentPage = page
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  },
  computed: {
    showResult: function () {
      return (this.listFiles.length > 0)
    }
  },
  created () {
    let url = new URL(window.location)
    let success = url.searchParams.get('success')
    if (success && success === 'true') {
      this.dismissCountDown = 5
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
</style>
