<template>
    <div>

        <h4 class="py-3 mb-4">
            <p class="font-weight-bold m-0">Xuất lương COD Công thức > 35</p>
        </h4>

        <!-- Header -->
        <div class="border-right-0 border-left-0 ui-bordered container-m--x mb-4">
            <div class="row no-gutters row-bordered row-border-light">
                <div class="col-md-9">
                    <div class="media-body container-p-x py-4">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <div><strong :class="projectData.status === 3 ? 'text-danger text-large' : 'text-primary text-large'">{{completedPercent(projectData.tasks,
                                projectData.completedTasks)}}%</strong> đã hoàn thành
                            </div>
                            <div class="text-muted small">{{projectData.tasks - projectData.completedTasks}} running,
                                {{projectData.completedTasks}} completed
                            </div>
                        </div>
                        <b-progress :value="completedPercent(projectData.tasks, projectData.completedTasks)"  :variant="projectData.status === 3 ? 'danger' : 'primary' " height="4px"/>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="container-p-x py-4">
                        <div class="row">
                            <div class="process-status">
                                <div class="text-muted small">Trạng thái</div>
                                <strong class="text-big" :class="`text-${statuses[projectData.status].color}`">{{statuses[projectData.status].title}}</strong>
                            </div>
                            <div class="process-status">
                                <div class="text-muted small">&nbsp;</div>
                                <a v-if="projectData.status === 2" @click="showModal('stopProcess')" href="#" class="button-stop-process text-danger text-big "><i
                                        class="ion ion-md-close-circle-outline"></i>&nbsp;<strong>Dừng tiến trình</strong></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- / Header -->

        <div class="row">
            <div class="col-md-8 col-xl-9">

                <!-- Description -->
                <b-card class="mb-4">
                    <div class="row">
                        <div class="col-md-6">
                            <div style="margin-bottom: 10px; width: 100%">
                                <div class="border-left border-danger center-input">
                                    <label class="form-label">Chọn đối tượng</label>
                                    <multiselect v-model="optionData.value"
                                                 label="name"
                                                 track-by="code"
                                                 :disabled = "optionData.disabled"
                                                 :options="optionData.options"
                                                 :taggable="true"
                                                 placeholder="Chọn"
                                                 @input="setSelectedTypeExport"
                                    ></multiselect>
                                </div>
                            </div>
                            <div class="nav-tabs-righ" style="margin-bottom: 10px; width: 100%">
                                <div class="border-left border-danger center-input">
                                    <label class="form-label">Chọn tháng lương</label>
                                    <vue-monthly-picker :disabled = "optionData.disabled" @input="changeMonthPicker" v-model="optionData.selectedMonth"></vue-monthly-picker>
                                </div>
                            </div>
                            <div class="nav-tabs-righ" style="margin-bottom: 10px; width: 100%">
                                <div v-if="$route.query.type === 'date'" class="border-left border-danger center-input">
                                    <label class="form-label">Chọn khoảng thời gian</label>
<!--                                    <flat-pickr v-model="optionData.rangeTime" :config="optionData.rangeConfig" placeholder="Chọn" />-->
                                  <v-date-picker color="green" placeholder="Chọn khoảng thời gian"
                                                 mode="range" v-model="optionData.rangeTime" locale="vi"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div>
                                <b-form-textarea
                                        id="textarea-state"
                                        v-model.trim="textData.value"
                                        :state="textData.value.length >= 1"
                                        :placeholder="textData.placeholder"
                                        :disabled="typeof optionData.value.code === 'undefined' || optionData.value.code === 'allCod' || optionData.selectedMonth === '' || optionData.disabled"
                                        :rows="$route.query.type === 'date' ? 8 : 4"
                                ></b-form-textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label d-none d-md-block">&nbsp;</label>
                                    <ladda-btn @click.native="showModal('createSalary')"
                                               :loading="buttonRun.loading" data-style="expand-right"
                                               class="btn btn-info" style="width: 100%">
                                        Chạy lương
                                    </ladda-btn>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label d-none d-md-block">&nbsp;</label>
                                    <ladda-btn @click.native="showModal('exportFile')" :disabled="buttonExport.disabled"
                                               :loading="buttonExport.loading" data-style="expand-right"
                                               class="btn btn-success" style="width: 100%">
                                        Xuất excel
                                    </ladda-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-card>
                <!-- / Description -->

                <!-- Attached files -->
                <b-card no-body header="Các file lương COD đã xuất" header-tag="h6" body-class="p-3" class="mb-4">
                    <b-card-body v-if="typeof tableData.originalArticlesData !== 'undefined' && tableData.originalArticlesData.length > 0">
                        <div class="row pr-bar">
                            <div class="col">
                                Số lượng: &nbsp;
                                <b-select size="sm" v-model="tableData.perPage" :options="[5, 10, 15, 20]"
                                          class="d-inline-block w-auto"/>
                                trên {{tableData.articlesData.length}} file
                            </div>
                            <div class="col">
                                <b-input
                                        size="sm" placeholder="Tìm kiếm..." class="d-inline-block float-lg-right w-50"
                                        @input="filter($event)"/>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <b-table
                                    id='dataTable'
                                    ref='dataTable'
                                    :items="tableData.articlesData"
                                    :fields="tableData.fields"
                                    :sort-by.sync="tableData.sortBy"
                                    :sort-desc.sync="tableData.sortDesc"
                                    :striped="true"
                                    :bordered="true"
                                    :current-page="tableData.currentPage"
                                    :per-page="tableData.perPage"
                                    style="text-align: center;"
                                    class="card-table">
                                <template v-slot:cell(title)="data">
                                    <a :href="data.item.path">{{data.item.name}}</a>
                                </template>
                                <template  v-slot:cell(status)="data">
                                    <b-badge variant="outline-success" v-if="data.item.status === 'completed'">
                                        Completed
                                    </b-badge>
                                    <b-badge variant="outline-danger" v-if="data.item.status === 'canceled'">Canceled
                                    </b-badge>
                                    <b-badge variant="outline-info" v-if="data.item.status === 'running'">Running
                                    </b-badge>
                                </template>
                                <template v-slot:cell(action)="data">
                                    <div class="row justify-content-center">
                                        <b-btn variant="outline-success borderless icon-btn" class="btn-xs"
                                               @click="showModal('renameFile', data.item.code)"><i class="ion ion-md-create"></i></b-btn>
                                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                                               @click="showModal('deleteFile', data.item.code)"><i class="ion ion-md-close"></i></b-btn>
                                        <b-btn v-if="data.item.status !== 'canceled'" variant="outline-primary borderless icon-btn" class="btn-xs"
                                               @click="downloadFile(data.item.path)"><i class="ion ion-md-download"></i></b-btn>
                                    </div>
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div class="col-sm text-sm-left text-center pt-3">
                                <span class="text-muted" v-if="totalItems">Trang {{ tableData.currentPage }} trên {{ totalPages }}</span>
                            </div>
                            <div class="col-sm pt-3">
                                <b-pagination class="justify-content-center justify-content-sm-end m-0"
                                              v-if="totalItems"
                                              v-model="tableData.currentPage"
                                              :total-rows="totalItems"
                                              :per-page="tableData.perPage"
                                              size="sm"/>
                            </div>
                        </div>
                    </b-card-body>
                </b-card>
                <!-- / Attached files -->
            </div>
            <div class="col-md-4 col-xl-3">
                <!-- Project details -->
                <b-card v-if="projectData.code !== ''" no-body class="mb-4">
                    <b-card-header header-tag="h6">Thông tin file đang xuất</b-card-header>
                    <b-list-group :flush="true">
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">Mã</div>
                            <div class="project-detail"><a href="javascript:void(0)">{{projectData.code}}</a></div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">Loại</div>
                            <div class="project-detail"><a href="javascript:void(0)">{{projectData.type}}</a></div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">Trạng thái</div>
                            <div class="project-detail"><i><strong>{{statuses[projectData.status].title}}</strong></i>
                            </div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">Tháng lương</div>
                            <div class="project-detail"><strong>{{projectData.monthYear}}</strong></div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">Thời gian chạy</div>
                            <div class="project-detail">{{projectData.timeStart}}</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">Người chạy</div>
                            <div class="project-detail">{{projectData.exportBy}}</div>
                        </b-list-group-item>
                    </b-list-group>
                </b-card>
                <!-- / Project details -->
            </div>
        </div>
        <notifications group="notifications-default"/>
        <loading-mini-bottom :enable="tableData.loadingBottom"></loading-mini-bottom>
        <b-modal ref="myModalRef" hide-footer static>
            <div class="d-block text-center">
                <h4>{{modalInfo.textNotify}}</h4>
            </div>
            <div role="group" v-if="this.modalInfo.currentAction === 'renameFile'">
                <label for="input-live">Tên file mới:</label>
                <b-form-input
                        id="input-live"
                        v-model="modalInfo.rename"
                        :state="renameState"
                        aria-describedby="input-live-help input-live-feedback"
                        placeholder="Vui lòng điền tên file"
                        trim
                ></b-form-input>
                <b-form-invalid-feedback id="input-live-feedback">
                    Tên dài ít nhất 10 ký tự
                </b-form-invalid-feedback>
                <b-form-text id="input-live-help"></b-form-text>
            </div>
            <b-btn class="mt-3" variant="outline-primary" block @click="confirmAction">Xác nhận</b-btn>
        </b-modal>
        <!--Block UI-->
        <b-card>
            <BlockUI message="" :html="blockUI.html" v-if="blockUI.loading" />
        </b-card>
    </div>
</template>

<!-- Page -->
<style src="@/vendor/styles/pages/projects.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-data-tables/vue-data-tables.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style>
    .loading-container .loading-backdrop {
        background: #fff !important;
        opacity: .7 !important;
    }
    .loading-container .loading {
        background: none !important;
        box-shadow: none !important;
    }
</style>
<script>
import cycleTime from 'infrastructures/helpers/date.js'
import flatPickr from 'vue-flatpickr-component'
import draggable from 'vuedraggable'
import Multiselect from 'vue-multiselect'
import VueMonthlyPicker from 'vue-monthly-picker'
import moment from 'moment'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import salaryService from 'domain/services/kpi-cod-service'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import Vue from 'vue'
import {ClientTable} from 'vue-tables-2'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import BlockUI from 'vue-blockui'

Vue.use(BlockUI)
Vue.use(ClientTable)

const optionsSelect = [
  {name: 'Tất cả COD', code: 'allCod'},
  {name: 'Theo công thức lương', code: 'followFormula'},
  {name: 'Theo mã COD', code: 'followAlias'},
  {name: '', code: ''}
]
export default {
  name: 'export-salary-cod-v2',
  metaInfo: {
    title: 'Export Salary Cod'
  },
  components: {
    flatPickr,
    draggable,
    Multiselect,
    VueMonthlyPicker,
    LaddaBtn,
    salaryService,
    LoadingMiniBottom,
    SweetModal,
    SweetModalTab
  },
  data: () => ({
    optionData: {
      disabled: false,
      value: optionsSelect[0],
      options: optionsSelect,
      selectedMonth: moment(new Date((new Date()).setMonth((new Date()).getMonth() - 1)), 'YYYY/MM'),
      rangeConfig: {
        mode: 'range',
        altInput: true,
        dateFormat: 'Y-m-d',
        altFormat: 'Y-m-d',
        defaultDate: [],
        // disable: [
        // ]
        minDate: '',
        maxDate: ''
      },
      rangeTime: ''
    },
    buttonRun: {
      loading: false,
      disabled: false
    },
    buttonExport: {
      loading: false,
      disabled: false
    },
    textData: {
      value: '',
      placeholder: '',
      disabled: false
    },
    statuses: {
      1: {title: 'Hoàn thành', color: 'success'},
      2: {title: 'Đang chạy', color: 'warning'},
      3: {title: 'Buộc dừng', color: 'danger'},
      4: {title: 'Tiến trình rỗng', color: 'info'},
      5: {title: 'Gộp file', color: 'info'},
      6: {title: 'Lỗi xuất file', color: 'danger'}
    },
    projectData: {
      status: 4,
      tasks: 0,
      completedTasks: 0,
      type: '',
      name: '',
      code: '',
      timeStart: '',
      lastUpdate: '',
      monthYear: '',
      exportBy: '',
      director: ''
    },
    tableData: {
      searchKeys: ['title', 'month', 'year', 'type', 'status', 'time_start', 'time_end', 'export_by', 'cancel_by'],
      sortBy: 'date',
      sortDesc: false,
      perPage: 5,
      fields: [
        { key: 'title', label: 'File Name', sortable: true },
        { key: 'month', label: 'Month', sortable: true },
        { key: 'year', label: 'Year', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'time_start', label: 'Time Start', sortable: true, tdClass: 'font-italic' },
        { key: 'time_end', label: 'Time End', sortable: true, tdClass: 'font-italic' },
        { key: 'export_by', label: 'Export By', sortable: true, tdClass: 'font-italic' },
        { key: 'cancel_by', label: 'Cancel By', sortable: true, tdClass: 'font-italic' },
        { key: 'action', label: 'Action', sortable: false, tdClass: 'text-center text-nowrap justify-content-center', thStyle: 'min-width: 4%' }
      ],
      articlesData: [],
      originalArticlesData: [],
      currentPage: 1,
      loadingBottom: false

    },
    modalInfo: {
      textNotify: '',
      currentAction: '',
      currentCode: null,
      rename: ''
    },
    blockUI: {
      loading: false,
      html: `
<div class="sk-folding-cube sk-primary"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>
<h5 class="text-center mb-0">Dữ liệu đang cập nhật...</h5>`
    },
    idGetCompletedTasks: null
  }),
  methods: {
    completedPercent (tasks, completed) {
      if (tasks === 0) return 0
      return Math.round((completed / tasks) * 100)
    },
    setSelectedTypeExport () {
      if (typeof this.optionData.value.code === 'undefined') {
        this.textData.placeholder = ''
      } else {
        if (this.optionData.value.code === 'allCod') this.textData.placeholder = ''
        if (this.optionData.value.code === 'followFormula') this.textData.placeholder = 'Các công thức lương cách nhau bởi dấu phẩy'
        if (this.optionData.value.code === 'followAlias') this.textData.placeholder = 'Các mã COD cách nhau bởi dấu phẩy'
      }
    },
    exportSalaryCod () {
      let queue = 'cal_salary_6'
      if (this.$route.query.queue) queue = this.$route.query.queue
      if (this.projectData.status !== 4) {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Thông báo',
          text: 'Vui lòng reload lại trang để thực tiện tác vụ tiếp theo'
        })
        return
      }
      if (
        typeof this.optionData.value.code === 'undefined' ||
        this.optionData.selectedMonth === '' ||
        (this.optionData.value.code !== 'allCod' && this.textData.value === '') ||
        (this.$route.query.type === 'date' && !this.optionData.rangeTime)
      ) {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Thông báo',
          text: 'Vui lòng nhập đầy đủ thông tin'
        })
        return
      }
      this.buttonExport.loading = true
      this.optionData.disabled = true
      let date = this.optionData.selectedMonth.toDate()
      let dataSend = {
        'type': this.optionData.value.code,
        'year': date.getFullYear(),
        'month': date.getMonth() + 1,
        'from_date': '',
        'to_date': '',
        'list_formulas': (this.optionData.value.code === 'followFormula' && typeof this.optionData.value.code !== 'undefined') ? this.textData.value : '',
        'list_cods': (this.optionData.value.code === 'followAlias' && typeof this.optionData.value.code !== 'undefined') ? this.textData.value : '',
        'queue': queue
      }
      if ((this.$route.query.type === 'date' && this.optionData.rangeTime)) {
        dataSend.from_date = moment(new Date(this.optionData.rangeTime.start)).format('YYYY-MM-DD')
        dataSend.to_date = moment(new Date(this.optionData.rangeTime.end)).format('YYYY-MM-DD')
      }
      salaryService.apiExportSalaryCodV2(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Thông báo',
            text: response.data.message
          })
          if (response.data.success) {
            if (response.data.hasOwnProperty('path')) {
              this.$notify({
                group: 'notifications-default',
                type: '',
                title: 'Thành công',
                text: 'Xuất file thành công'
              })
              this.projectData.status = 1
              this.buttonExport.loading = false
              this.optionData.disabled = false
              this.getAllFileExportInMonthSalary()
              window.location.href = response.data.path
              return
            }
            // Set data hiển thị
            this.projectData.code = response.data.data.exportFileInfo.code
            this.projectData.name = response.data.data.exportFileInfo.name
            this.projectData.exportBy = response.data.data.exportFileInfo.export_by
            this.projectData.monthYear = `${response.data.data.exportFileInfo.month}/${response.data.data.exportFileInfo.year}`
            this.projectData.timeStart = response.data.data.exportFileInfo.time_start
            this.projectData.status = 2
            this.projectData.type = response.data.data.exportFileInfo.type
            this.projectData.tasks = response.data.data.exportFileInfo.count_task
            this.projectData.director = response.data.data.exportFileInfo.director

            // Đọc thông tin chạy lương
            this.licenseJobExportSalary()
          }
          // if (response.data.hasOwnProperty('path')) {
          //   window.location.href = response.data.path
          // }
        }
      }).catch((e) => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
        console.log(e)
      }).then(() => {
        this.buttonExport.loading = false
        this.optionData.disabled = false
      })
    },
    licenseJobExportSalary () {
      this.idGetCompletedTasks = setInterval(this.getCompletedTasks, 10000)
    },
    getCompletedTasks () {
      if (this.projectData.completedTasks >= this.projectData.tasks) {
        clearInterval(this.idGetCompletedTasks)
        this.idGetCompletedTasks = null
        this.mergeAllFileToExport()
        this.projectData.status = 5
      } else {
        salaryService.apiGetCountTasksProcessV2({
          'time_start': this.projectData.timeStart,
          'director': this.projectData.director,
          'code': this.projectData.code
        }).then(response => {
          if (response.data.hasOwnProperty('success')) {
            this.$notify({
              group: 'notifications-default',
              type: response.data.success ? '' : 'bg-danger text-white',
              title: response.data.success ? 'Thành công' : 'Thông báo',
              text: response.data.message
            })
            if (response.data.success) {
              if (this.projectData.status !== 3) {
                this.projectData.completedTasks = response.data.count
              }
            } else {
              clearInterval(this.idGetCompletedTasks)
              this.idGetCompletedTasks = null
              this.projectData.status = 6
            }
          }
        }).catch(() => {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: 'Đã có lỗi xảy ra.'
          })
        }).then(() => {
          if (this.projectData.completedTasks >= this.projectData.tasks) {
            clearInterval(this.idGetCompletedTasks)
            this.idGetCompletedTasks = null
            this.mergeAllFileToExport()
            this.projectData.status = 5
          }
        })
      }
    },
    mergeAllFileToExport () {
      salaryService.apiMergeAllFileToExportV2({
        'path': this.projectData.director,
        'code': this.projectData.code
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Thông báo',
            text: response.data.message
          })
          if (response.data.success) {
            this.projectData.status = 1
            window.location.href = response.data.path
          }
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.buttonExport.loading = false
        this.optionData.disabled = false
        this.getAllFileExportInMonthSalary()
      })
    },
    cancelProcess () {
      if (this.projectData.status === 2) {
        clearInterval(this.idGetCompletedTasks)
        this.idGetCompletedTasks = null
        this.projectData.status = 3
      }
      salaryService.apiCancelProcessExportSalary({
        'path': this.projectData.director,
        'code': this.projectData.code
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Thông báo',
            text: response.data.message
          })
          if (response.data.success) {
            // this.projectData.status = 1
          }
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.buttonExport.loading = false
        this.optionData.disabled = false
        this.getAllFileExportInMonthSalary()
      })
    },
    getAllFileExportInMonthSalary () {
      if (this.optionData.selectedMonth !== '') {
        this.tableData.articlesData = []
        this.tableData.originalArticlesData = []
        this.tableData.loadingBottom = true
        let date = this.optionData.selectedMonth.toDate()
        salaryService.apiGetAllFileExportInMonthSalary({
          year: date.getFullYear(),
          month: date.getMonth() + 1
        }).then(response => {
          if (response.data.hasOwnProperty('success')) {
            this.$notify({
              group: 'notifications-default',
              type: response.data.success ? '' : 'bg-danger text-white',
              title: response.data.success ? 'Thành công' : 'Thông báo',
              text: response.data.message
            })
            if (response.data.success) {
              this.tableData.articlesData = response.data.data
              this.tableData.originalArticlesData = this.tableData.articlesData.slice(0)
            }
          }
        }).catch(error => {
          console.log(error)
        }).then(() => {
          this.tableData.loadingBottom = false
        })
      }
    },
    filter (value) {
      const val = value.toLowerCase()
      const filtered = this.tableData.originalArticlesData.filter(d => {
        console.log()
        return Object.keys(d)
          .filter(k => this.tableData.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(val) !== -1 || !val
      })
      this.tableData.articlesData = filtered
    },
    renameFile (code, newName) {
      this.tableData.articlesData = []
      this.tableData.originalArticlesData = []
      this.tableData.loadingBottom = true
      salaryService.apiRenameFileSalaryCodExport({
        'code': code,
        'new_name': newName
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Thông báo',
            text: response.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.getAllFileExportInMonthSalary()
      })
    },
    deleteFile (code) {
      this.tableData.articlesData = []
      this.tableData.originalArticlesData = []
      this.tableData.loadingBottom = true
      salaryService.apiDeleteFileSalaryCodExport({
        'code': code
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Thông báo',
            text: response.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.getAllFileExportInMonthSalary()
      })
    },
    downloadFile (path) {
      window.location.href = path
    },
    confirmAction () {
      if (this.modalInfo.currentAction === 'deleteFile') this.deleteFile(this.modalInfo.currentCode)
      if (this.modalInfo.currentAction === 'renameFile') this.renameFile(this.modalInfo.currentCode, this.modalInfo.rename)
      if (this.modalInfo.currentAction === 'exportFile') this.exportSalaryCod()
      if (this.modalInfo.currentAction === 'stopProcess') this.cancelProcess()
      if (this.modalInfo.currentAction === 'createSalary') this.createSalary()
      this.$refs.myModalRef.hide()
    },
    showModal (action, code = null) {
      this.modalInfo.rename = ''
      this.modalInfo.currentAction = action
      this.modalInfo.currentCode = code
      if (action === 'deleteFile') this.modalInfo.textNotify = 'Bạn có chắc muốn xóa file này?'
      if (action === 'exportFile') this.modalInfo.textNotify = 'Vui lòng xác nhận việc xuất file lương!'
      if (action === 'renameFile') this.modalInfo.textNotify = 'Điền tên file mới bên dưới!'
      if (action === 'stopProcess') this.modalInfo.textNotify = 'Bạn có chắc muốn dừng tiến trình xuất file?'
      if (action === 'createSalary') this.modalInfo.textNotify = 'Càng nhiều COD càng mất nhiều thời gian, đợi chút rồi xuất lương mới đúng nhé!'
      this.$refs.myModalRef.show()
    },
    createSalary () {
      this.buttonRun.loading = true
      this.optionData.disabled = true
      let date = this.optionData.selectedMonth.toDate()
      let str = this.optionData.rangeTime.split(' to ')
      let dataSend = {
        'type': this.optionData.value.code,
        'year': date.getFullYear(),
        'month': date.getMonth() + 1,
        'formulas': (this.optionData.value.code === 'followFormula' && typeof this.optionData.value.code !== 'undefined') ? this.textData.value : '',
        'codAlias': (this.optionData.value.code === 'followAlias' && typeof this.optionData.value.code !== 'undefined') ? this.textData.value : ''
      }
      console.log(dataSend)
      if (str.length === 2) {
        dataSend.from = str[0]
        dataSend.to = str[1]
      }
      salaryService.apiCreateSalary(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((e) => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
        console.log(e)
      }).then(() => {
        this.buttonRun.loading = false
        this.optionData.disabled = false
      })
    },
    checkDataStartProcess () {
      salaryService.apiGetLastProcessInTable({}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Thông báo',
            text: response.data.message
          })
          if (response.data.success) this.blockUI.loading = false
          if (response.data.has_running) {
            this.projectData.code = response.data.data.exportFileInfo.code
            this.projectData.name = response.data.data.exportFileInfo.name
            this.projectData.exportBy = response.data.data.exportFileInfo.export_by
            this.projectData.monthYear = `${response.data.data.exportFileInfo.month}/${response.data.data.exportFileInfo.year}`
            this.projectData.timeStart = response.data.data.exportFileInfo.time_start
            this.projectData.status = 2
            this.projectData.type = response.data.data.exportFileInfo.type
            this.projectData.tasks = response.data.data.exportFileInfo.count_task
            this.projectData.director = response.data.data.exportFileInfo.director
            // Đọc thông tin chạy lương
            this.licenseJobExportSalary()
            this.buttonExport.loading = true
            this.optionData.disabled = true
          }
        }
      }).catch(error => {
        console.log(error)
      }).then(() => {
        this.blockUI.loading = false
      })
    },
    changeDefaultRangeDate () {
      let date = this.optionData.selectedMonth.toDate()
      this.$set(this.optionData.rangeConfig, 'minDate', `${date.getFullYear()}-${date.getMonth()}-21`)
      this.$set(this.optionData.rangeConfig, 'maxDate', `${date.getFullYear()}-${date.getMonth() + 1}-20`)
    },
    changeMonthPicker () {
      this.getAllFileExportInMonthSalary()
      if (this.$route.query.type === 'date') this.changeDefaultRangeDate()
    }
  },
  computed: {
    renameState () {
      return this.modalInfo.rename.length >= 10
    },
    totalItems () {
      return this.tableData.articlesData.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.tableData.perPage)
    }
  },
  updated () {
  },
  beforeDestroy () {
    clearInterval(this.idGetCompletedTasks)
    this.idGetCompletedTasks = null
  },
  created () {
    let timeOption = cycleTime.getMonthSalaryByDate(moment().add(-1, 'months').format('YYYY-MM-DD'))
    this.optionData.selectedMonth = moment(new Date(timeOption.to), 'YYYY/MM')
    if (this.$route.query.type === 'date') this.changeDefaultRangeDate()
    this.blockUI.loading = true
    this.checkDataStartProcess()
    this.getAllFileExportInMonthSalary()
  }
}
</script>

<style scoped>
    .center-input {
        background: #ebf5fb;
        padding: 5px 5px 13px 5px;
    }
    .project-detail {
        margin-left: 10%;
    }
    .process-status {
        padding: 10px;
    }
    .button-stop-process:hover {
        color: #ff7b7e !important;
    }
</style>
