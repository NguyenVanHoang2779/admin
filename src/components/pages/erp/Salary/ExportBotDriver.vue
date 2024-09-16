<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Tool xuất thao tác tại BOT của tài xế
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------1. Xuất thao tác tại BOT của tài xế từng ngày -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          Xuất thao tác tại BOT của tài xế từng ngày
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" :visible="one.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-4 mb-4">
              <label class="form-label">Chọn ngày xuất</label>
                <datepicker
                  v-model="one.selectedDate"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                />
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="one.loadingButton" @click.native="exportBOTPoints" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(one.responseMessage).length >1">
            <tree-view :data="one.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <!------------------------------------------------2. Xuất data chi tiết theo ngày của tài xế -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2>
          Xuất dữ liệu chi tiết của tài xế theo từng ngày
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion2" :visible="two.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-4 mb-4">
              <label class="form-label">Chọn ngày xuất</label>
              <datepicker
                v-model="two.selectedDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
              />
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="two.loadingButton" @click.native="exportSalaryDriverDetail" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(two.responseMessage).length >1">
            <tree-view :data="two.responseMessage" :options="{maxDepth: 1}"></tree-view>
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
                        <div class="btn btn-sm btn-outline-danger"  v-if="row.item.can_remove" @click="removeExportFileDataDriver(row.item.code)">
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
    <notifications group="notifications-default" />
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import salaryService from 'domain/services/salary-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import TreeView from 'vue-json-tree-view'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectWhStaffs from 'components/elements/FilterBox/SelectWhStaffs'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'

Vue.use(TreeView)

moment.suppressDeprecationWarnings = true

export default {
  name: 'export-bot-driver',
  metaInfo: {
    title: 'Tool xuất thao tác tại BOT'
  },
  components: {
    SelectStations,
    flatPickr,
    LaddaBtn,
    salaryService,
    VueMonthlyPicker,
    SweetModal,
    SweetModalTab,
    Multiselect,
    SelectWhStaffs,
    Datepicker
  },
  data: () => ({
    fields: [
      {key: 'code', label: 'Mã code', sortable: true, thStyle: 'width: 10%'},
      {key: 'name', label: 'Tên file', sortable: true, thStyle: 'width: 30%'},
      {key: 'status', label: 'Trạng thái', sortable: true, thStyle: 'width: 10%'},
      {key: 'export_by', label: 'Người tạo', sortable: true, thStyle: 'width: 10%'},
      {key: 'time_start', label: 'Thời gian tạo file', sortable: true, thStyle: 'width: 15%'},
      {key: 'time_end', label: 'Thời gian kết thúc', sortable: true, thStyle: 'width: 15%'},
      {key: 'actions', label: 'Thao tác', sortable: true, thStyle: 'width: 10%'}
    ],
    one: {
      visible: false,
      loadingButton: false,
      selectedDate: moment(new Date()).format('YYYY/MM/DD'),
      responseMessage: {}
    },
    two: {
      visible: false,
      loadingButton: false,
      selectedDate: moment(new Date()).format('YYYY/MM/DD'),
      responseMessage: {}
    },
    inputDisable: false,
    listFiles: [],
    perPage: 10,
    currentPage: 1,

    buttonBackGround: {
      backgroundColor: '#EEEEEE'
    }
  }),
  computed: {
    rows () {
      return this.listFiles.length
    }
  },
  created () {
    this.getListFilesDataDriver()
  },
  mounted () {
    this.getListRunningFilesDataDriver()
  },
  methods: {
    exportBOTPoints: function () {
      this.one.loadingButton = true
      let date = moment(this.one.selectedDate).format('YYYY-MM-DD')
      let dataSend = {
        'date': date
      }
      console.log(dataSend)
      salaryService.exportBOTPoints(dataSend).then(res => {
        console.log(res.data.path)
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.open(res.data.path, '_blank')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.one.loadingButton = false
      })
    },
    exportSalaryDriverDetail: function () {
      this.two.loadingButton = true
      let date = moment(this.two.selectedDate).format('YYYY-MM-DD')
      let dataSend = {
        'date': date
      }
      salaryService.exportSalaryDriverDetail(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.two.loadingButton = false
      })
    },
    getListFilesDataDriver: function () {
      salaryService.getListFilesDataDriver().then(res => {
        if (res.data.success) {
          this.listFiles = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    removeExportFileDataDriver: function (code) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi?')) return
      if (!code) return
      let param = this.$route.query
      let dataSend = {
        'code': code,
        'date_check_point': param.deleteDate
      }
      commonHelper.showMessage('Đang thực hiện', 'success')
      salaryService.removeExportFileDataDriver(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getListFilesDataDriver()
          this.getListRunningFilesDataDriver()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        commonHelper.showMessage('Đã xảy ra lỗi', 'warning')
        console.log(error)
      })
    },
    getListRunningFilesDataDriver: function () {
      this.two.loadingButton = true
      let param = this.$route.query
      let dataSend = {
        'deleteDate': param.deleteDate
      }
      salaryService.getListRunningFilesDataDriver(dataSend).then(res => {
        if (res.data.success) {
          this.listFiles = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.two.loadingButton = false
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
