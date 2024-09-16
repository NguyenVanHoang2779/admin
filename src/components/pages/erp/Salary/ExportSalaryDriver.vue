<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Tool lương tài xế</div>
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------Tool xuất bảng lương tài xế -------------------------------------------------------------->
<!--    <b-card no-body class="mb-1">-->
<!--      <b-card-header>-->
<!--        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>-->
<!--          Xuất bảng lương tài xế-->
<!--          <div class="collapse-icon"></div>-->
<!--        </a>-->
<!--      </b-card-header>-->
<!--      <b-collapse id="accordion1" accordion="accordion">-->
<!--        <b-card-body>-->
<!--          <div class="form-row">-->
<!--            <div class="col-md mb-4">-->
<!--              <div class="border-left border-danger center-input">-->
<!--                <label class="form-label">Chọn tháng lương</label>-->
<!--                <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="col-md col-xl-2 mb-4">-->
<!--              <label class="form-label d-none d-md-block">&nbsp;</label>-->
<!--              <ladda-btn :loading="one.loadingButton" @click.native="exportSalaryDriver" data-style="expand-right"-->
<!--                         class="btn btn-primary" style="width: 100%">-->
<!--                Export-->
<!--              </ladda-btn>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-row">-->
<!--            <div class="col-md mb-4">-->
<!--              <b-form-textarea id="textarea1"-->
<!--                               v-model="one.userNames"-->
<!--                               placeholder="Các username cách nhau bởi dấu phẩy"-->
<!--                               :rows="5"-->
<!--                               :max-rows="6">-->
<!--              </b-form-textarea>-->
<!--            </div>-->
<!--          </div>-->
<!--        </b-card-body>-->
<!--      </b-collapse>-->
<!--    </b-card>-->

    <!------------------------------------------------Chạy lại lương -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2>
          Chạy lại lương tài xế lưu snapshots( cơ chế cũ)
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion2" :visible="two.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md mb-1">
              <label class="form-label">Chọn tháng chạy lại</label>
              <vue-monthly-picker v-model="two.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="two.loadingButton" @click.native="runDriverSalary" data-style="expand-right"
                         class="btn btn-danger" style="width: 100%">
                Chạy lại lương
              </ladda-btn>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md mb-4">
              <b-form-textarea id="textarea1"
                               v-model="two.userNames"
                               placeholder="Các username cách nhau bởi dấu phẩy"
                               :rows="5"
                               :max-rows="6">
              </b-form-textarea>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(two.responseMessage).length >1">
            <tree-view :data="two.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------Tool xuất bảng lương tài xế theo khoảng thơi gian -------------------------------------------------------------->
<!--    <b-card no-body class="mb-1">-->
<!--      <b-card-header>-->
<!--        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion3>-->
<!--          Xuất bảng lương tài xế theo khoảng thời gian-->
<!--          <div class="collapse-icon"></div>-->
<!--        </a>-->
<!--      </b-card-header>-->
<!--      <b-collapse id="accordion3" :visible="three.visible" accordion="accordion">-->
<!--        <b-card-body>-->
<!--          <div class="form-row">-->
<!--            <div class="col-md-4 mb-4">-->
<!--              <label class="form-label"> Chọn ngày bắt đầu </label>-->
<!--              <datepicker-->
<!--                v-model="three.selectedStartDate"-->
<!--                format="dd-MM-yyyy"-->
<!--                :bootstrapStyling="true"-->
<!--                :monday-first="true"-->
<!--                :full-month-name="true"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="col-md-4 mb-4">-->
<!--              <label class="form-label"> Chọn ngày kết thúc </label>-->
<!--              <datepicker-->
<!--                v-model="three.selectedEndDate"-->
<!--                format="dd-MM-yyyy"-->
<!--                :bootstrapStyling="true"-->
<!--                :monday-first="true"-->
<!--                :full-month-name="true"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="col-md col-xl-2 mb-4">-->
<!--              <label class="form-label d-none d-md-block">&nbsp;</label>-->
<!--              <ladda-btn :loading="three.loadingButton" @click.native="exportSalaryDriverRangeTime" data-style="expand-right"-->
<!--                         class="btn btn-primary" style="width: 100%">-->
<!--                Export-->
<!--              </ladda-btn>-->
<!--            </div>-->
<!--          </div>-->
<!--        </b-card-body>-->
<!--      </b-collapse>-->
<!--    </b-card>-->
    <!------------------------------------------------Tool xuất bảng lương tài xế theo cơ chế mới -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion4>
          Xuất bảng lương tài xế theo cơ chế mới
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion4" :visible="four.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-2 mb-2"></div>
             <b-col class="col-md-2 mb-2">
               <label class="form-label">Loại tài xế</label>
              <b-form-select :options="typeDriver" v-model="four.type">
              </b-form-select>
            </b-col>
            <div class="col-md-2 mb-2">
                <label class="form-label">Chọn tháng lương</label>
                <vue-monthly-picker v-model="four.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="four.loadingButton" @click.native="exportKpiSalaryDriver" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
        </b-card-body>
        <div class="result" id="results"><br/>
          <b-card no-body v-if="listFiles">
            <!-- / Table controls -->
            <div class="table-result" >
              <!-- Table -->
              <div class="table-responsive mb-4">
                <b-table
                  class="ml-1 mr-1"
                  :fields="fields"
                  :items="listFiles"
                  :per-page="perPage"
                  :current-page="currentPage"
                >
                  <template
                    v-slot:cell(actions)="row"
                  >
                    <div>
                      <!-- Chỉ có thể xóa tiến trình được cho phép -->
                      <div class="btn btn-sm btn-outline-danger"  v-if="row.item.can_remove ||  dateCheckPoint" @click="removeExportFileDataDriver(row.item.code)">
                        <i class="fa fa-times"></i>
                      </div>
                      <a class="btn btn-sm btn-outline-info" v-if="row.item.status === 'success'" :href="row.item.path">
                        <i class="ion ion-md-cloud-download"></i>
                      </a>
                    </div>
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
              </div>
            </div>
          </b-card>
          <div class="no-data" v-if="!listFiles">
            Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
          </div>
        </div>
      </b-collapse>
    </b-card>
    <!------------------------------------------------Tool xuất bảng lương tài xế theo khoảng thơi gian theo cơ chế mới -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion5>
          Xuất bảng lương tài xế theo khoảng thời gian (theo cơ chế mới)
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion5" :visible="five.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <b-col class="col-md-2 mb-2">
              <label class="form-label">Loại tài xế</label>
              <b-form-select :options="typeDriver" v-model="five.type">
              </b-form-select>
            </b-col>
            <div class="col-md-4 mb-4">
              <label class="form-label"> Chọn ngày bắt đầu </label>
              <datepicker
                v-model="five.selectedStartDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
              />
            </div>
            <div class="col-md-4 mb-4">
              <label class="form-label"> Chọn ngày kết thúc </label>
              <datepicker
                v-model="five.selectedEndDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
              />
            </div>
            <div class="col-md col-xl-2 mb-2">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="five.loadingButton" @click.native="exportKpiSalaryDriverRangeTime" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div class="result" id="results"><br/>
            <b-card no-body v-if="listFiles">
              <!-- / Table controls -->
              <div class="table-result" >
                <!-- Table -->
                <div class="table-responsive mb-4">
                  <b-table
                    class="ml-1 mr-1"
                    :fields="fields"
                    :items="listFiles"
                    :per-page="perPage"
                    :current-page="currentPage"
                  >
                    <template
                      v-slot:cell(actions)="row"
                    >
                      <div>
                        <!-- Chỉ có thể xóa tiến trình được cho phép -->
                        <div class="btn btn-sm btn-outline-danger"  v-if="row.item.can_remove ||  dateCheckPoint" @click="removeExportFileDataDriver(row.item.code)">
                          <i class="fa fa-times"></i>
                        </div>
                        <a class="btn btn-sm btn-outline-info" v-if="row.item.status === 'success'" :href="row.item.path">
                          <i class="ion ion-md-cloud-download"></i>
                        </a>
                      </div>
                    </template>
                  </b-table>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </div>
            </b-card>
            <div class="no-data" v-if="!listFiles">
              Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <!------------------------------------------------Tool xuất bảng lương phiên tài xế theo cơ chế mới -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion6>
          Xuất bảng lương phiên tài xế theo cơ chế mới( dành cho đường dài)
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion6" :visible="six.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-2 mb-2"></div>
            <div class="col-md-2 mb-2">
                <label class="form-label">Chọn tháng lương</label>
                <vue-monthly-picker v-model="six.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="six.loadingButton" @click.native="exportSsLienMienKpi" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
        </b-card-body>
        <div class="result" id="results"><br/>
          <b-card no-body v-if="listFiles">
            <!-- / Table controls -->
            <div class="table-result" >
              <!-- Table -->
              <div class="table-responsive mb-4">
                <b-table
                  class="ml-1 mr-1"
                  :fields="fields"
                  :items="listFiles"
                  :per-page="perPage"
                  :current-page="currentPage"
                >
                  <template
                    v-slot:cell(actions)="row"
                  >
                    <div>
                      <!-- Chỉ có thể xóa tiến trình được cho phép -->
                      <div class="btn btn-sm btn-outline-danger"  v-if="row.item.can_remove ||  dateCheckPoint" @click="removeExportFileDataDriver(row.item.code)">
                        <i class="fa fa-times"></i>
                      </div>
                      <a class="btn btn-sm btn-outline-info" v-if="row.item.status === 'success'" :href="row.item.path">
                        <i class="ion ion-md-cloud-download"></i>
                      </a>
                    </div>
                  </template>
                </b-table>
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  aria-controls="my-table"
                ></b-pagination>
              </div>
            </div>
          </b-card>
          <div class="no-data" v-if="!listFiles">
            Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
          </div>
        </div>
      </b-collapse>
    </b-card>
    <!------------------------------------------------Tool chạy lại lịch sử công việc của tài -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion8>
          Chạy lại lịch sử công việc của tài xế( cơ chế mới)
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion8" :visible="eight.visible" accordion="accordion8">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-4 mb-4">
              <label class="form-label"> Chọn ngày bắt đầu </label>
              <datepicker
                v-model="eight.selectedStartDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
              />
            </div>
            <div class="col-md-4 mb-4">
              <label class="form-label"> Chọn ngày kết thúc </label>
              <datepicker
                v-model="eight.selectedEndDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
              />
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="eight.loadingButton" @click.native="runDriverHistories" data-style="expand-right"
                         class="btn btn-danger" style="width: 100%">
                Chạy lại
              </ladda-btn>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <!------------------------------------------------Tool chạy bỏ phạt theo phiên tài xế -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion7>
          Chạy bỏ phạt theo phiên
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion7" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md mb-4">
              <b-form-textarea id="textarea1"
                               v-model="seven.ss_id"
                               placeholder="Các ss_id cách nhau bởi dấu phẩy"
                               :rows="5"
                               :max-rows="6">
              </b-form-textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="seven.loadingButton" @click.native="runCancelSs" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Run
              </ladda-btn>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <notifications group="notifications-default" />
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import moment from 'moment'
import VueMonthlyPicker from 'vue-monthly-picker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import salaryService from 'domain/services/salary-service'
import Datepicker from 'vuejs-datepicker'
import TreeView from 'vue-json-tree-view'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(TreeView)

moment.suppressDeprecationWarnings = true

export default {
  name: 'export-driver-salary',

  metaInfo: {
    title: 'Tool lương tài xế'
  },

  components: {
    LaddaBtn,
    VueMonthlyPicker,
    salaryService,
    Datepicker
  },

  data: () => ({
    one: {
      visible: false,
      loadingButton: false,
      userNames: '',
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },

    two: {
      visible: false,
      loadingButton: false,
      userNames: '',
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },

    three: {
      visible: false,
      loadingButton: false,
      selectedStartDate: new Date(moment().format('YYYY') + '-' + moment().format('MM') + '-21'),
      selectedEndDate: new Date(moment().format('YYYY') + '-' + moment().format('MM') + '-20')
    },

    four: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      type: 0,
      responseMessage: {}
    },

    five: {
      visible: false,
      loadingButton: false,
      selectedStartDate: new Date(moment().format('YYYY') + '-' + moment().format('MM') + '-21'),
      selectedEndDate: new Date(moment().format('YYYY') + '-' + moment().format('MM') + '-20'),
      type: 0
    },

    six: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },

    seven: {
      visible: false,
      loadingButton: false,
      ss_id: '',
      responseMessage: {}
    },
    eight: {
      visible: false,
      loadingButton: false,
      selectedStartDate: moment(new Date()).format('YYYY/MM/DD'),
      selectedEndDate: moment(new Date()).format('YYYY/MM/DD')
    },

    listFiles: [],
    perPage: 10,
    currentPage: 1,
    controlGetListFile: {
      numberRunning: 0,
      number: 0
    },
    dateCheckPoint: null,
    intervalGetListFile: null,
    fields: [
      {key: 'code', label: 'Mã code', sortable: true, thStyle: 'width: 10%'},
      {key: 'name', label: 'Tên file', sortable: true, thStyle: 'width: 30%'},
      {key: 'status', label: 'Trạng thái', sortable: true, thStyle: 'width: 10%'},
      {key: 'export_by', label: 'Người tạo', sortable: true, thStyle: 'width: 10%'},
      {key: 'time_start', label: 'Thời gian tạo file', sortable: true, thStyle: 'width: 15%'},
      {key: 'time_end', label: 'Thời gian kết thúc', sortable: true, thStyle: 'width: 15%'},
      {key: 'actions', label: 'Thao tác', sortable: true, thStyle: 'width: 10%'}
    ],

    buttonBackGround: {
      backgroundColor: '#EEEEEE'
    },
    typeDriver: [
      {value: 0, text: 'Nội thành'},
      {value: 1, text: 'Liên tỉnh'},
      {value: 2, text: 'Đường dài'}
    ]
  }),

  computed: {
    rows () {
      return this.listFiles.length
    }
  },

  created () {
    this.getListFilesDataDriver()
  },

  watch: {
    controlGetListFile: {
      handler: function () {
        if (this.controlGetListFile.numberRunning > 0 && this.controlGetListFile.number < 5) {
          this.intervalGetListFile = setInterval(() => {
            if (this.controlGetListFile.numberRunning > 0 && this.controlGetListFile.number < 5) {
              this.getListFilesDataDriver()
            }
          }, 90000)
        } else {
          clearInterval(this.intervalGetListFile)
        }
      },
      deep: true
    }
  },

  methods: {
    exportSalaryDriver () {
      this.one.loadingButton = true
      let month = moment(this.one.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let usernames = ''
      if (this.one.userNames === '') {
        usernames = ''
      } else {
        usernames = this.one.userNames.split(',')
      }
      let dataSend = {
        'year': str[0],
        'month': str[1],
        'usernames': usernames
      }
      console.log(dataSend)
      salaryService.exportSalaryDriver(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          window.open(response.data.file_path, '_blank')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.one.loadingButton = false
      })
    },
    runDriverSalary () {
      this.two.loadingButton = true
      let month = moment(this.two.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let usernames = ''
      if (this.two.userNames === '') {
        usernames = ''
      } else {
        usernames = this.two.userNames.split(',')
      }
      let dataSend = {
        'year': str[0],
        'month': str[1],
        'usernames': usernames
      }
      console.log(dataSend)
      salaryService.runDriverSalary(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.two.loadingButton = false
      })
    },
    exportSalaryDriverRangeTime () {
      this.three.loadingButton = true
      let startDate = moment(this.three.selectedStartDate).format('YYYY-MM-DD')
      let endDate = moment(this.three.selectedEndDate).format('YYYY-MM-DD')
      let dataSend = {
        'start_date': startDate,
        'end_date': endDate
      }
      salaryService.exportSalaryDriverRangeTime(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.open(res.data.path, '_blank')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.three.loadingButton = false
      })
    },
    getListFilesDataDriver: function () {
      this.dateCheckPoint = this.$route.query.dateCheckPoint
      salaryService.getListFilesSalaryDriver().then(res => {
        if (res.data.success) {
          this.listFiles = res.data.data
          this.controlGetListFile.numberRunning = res.data.data.filter(item => item.status === 'running').length
          this.controlGetListFile.number += 1
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    exportKpiSalaryDriver () {
      this.four.loadingButton = true
      let month = moment(this.four.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let dataSend = {
        'year': str[0],
        'month': str[1],
        type: this.four.type
      }
      salaryService.exportKpiSalaryDriver(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.getListFilesDataDriver()
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.four.loadingButton = false
      })
    },
    exportKpiSalaryDriverRangeTime () {
      this.five.loadingButton = true
      let startDate = moment(this.five.selectedStartDate).format('YYYY-MM-DD')
      let endDate = moment(this.five.selectedEndDate).format('YYYY-MM-DD')
      let dataSend = {
        'start_date': startDate,
        'end_date': endDate,
        'type': this.five.type
      }
      salaryService.exportKpiSalaryDriverRangeTime(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.getListFilesDataDriver()
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.five.loadingButton = false
      })
    },
    removeExportFileDataDriver: function (code) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi?')) return
      if (!code) return
      this.controlGetListFile.number = 0

      let dataSend = {
        'code': code,
        'date_check_point': this.dateCheckPoint
      }
      commonHelper.showMessage('Đang thực hiện', 'success')
      salaryService.removeExportFileDataDriver(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getListFilesDataDriver()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        commonHelper.showMessage('Đã xảy ra lỗi', 'warning')
        console.log(error)
      })
    },
    exportSsLienMienKpi () {
      this.six.loadingButton = true
      let month = moment(this.six.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let dataSend = {
        'year': str[0],
        'month': str[1]
      }
      salaryService.exportSsLienMienKpi(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.getListFilesDataDriver()
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.six.loadingButton = false
      })
    },
    runCancelSs () {
      if (this.seven.ss_id === '') return
      this.seven.loadingButton = true
      let ssIds = this.seven.ss_id.split(',')
      let dataSend = {
        'ss_id': ssIds
      }
      console.log(dataSend)
      salaryService.runCancelSs(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.one.loadingButton = false
      })
    },
    runDriverHistories () {
      this.eight.loadingButton = true
      let startDate = moment(this.eight.selectedStartDate).format('YYYY-MM-DD')
      let endDate = moment(this.eight.selectedEndDate).format('YYYY-MM-DD')
      let dataSend = {
        'start_date': startDate,
        'end_date': endDate
      }
      console.log(dataSend)
      salaryService.runDriverHistories(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.eight.loadingButton = false
      })
    }
  }
}
</script>
