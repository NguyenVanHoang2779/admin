<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Tool cod trung chuyển tỉnh
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------1. Tool xuất lương cod trung chuyển theo tháng -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          1. Xuất lương cod trung chuyển tỉnh
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" :visible="one.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-3 mb-1">
              <label class="form-label">Chọn loại xuất</label>
              <multiselect
                v-model="exp_type"
                label="name"
                track-by="name"
                selectedLabel=""
                deselectLabel=""
                selectLabel="Chọn"
                :options="export_types"
                :searchable="false"
                :allow-empty="false">
              </multiselect>
            </div>
            <div class="col-md-2 mb-1">
              <label class="form-label">Chọn tháng xuất lương</label>
              <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md-2 col-xl-2 mb-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="one.loadingButton" @click.native="exportTransitCodAllByMonth" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(one.responseMessage).length >1">
            <tree-view :data="one.responseMessage" :options="{maxDepth: 1}"></tree-view>
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
                        <div class="btn btn-sm btn-outline-danger"  v-if="row.item.can_remove" @click="removeExportFile(row.item.code)">
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

    <!------------------------------------------------2. Tool xuất lương cod trung chuyển theo tên username -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2>
          2. Xuất lương cod trung chuyển tỉnh theo username
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion2" :visible="two.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-10 mb-1">
              <label class="form-label">Chọn tháng lương</label>
              <vue-monthly-picker v-model="two.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md-2 mb-1">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn
                :loading="two.loadingButton"
                @click.native="exportTransitCodAllByUsername"
                data-style="expand-right"
                class="btn btn-primary"
                style="width: 100%">
                  Export
              </ladda-btn>
            </div>
            <b-form-textarea
              rows="6"
              max-rows="10"
              placeholder="Nhập username"
              v-model="exp_usernames"
            >
            </b-form-textarea>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------3. Tool xuất lương cod trung chuyển trong khoảng thời gian -------------------------------------------------------------->
    <b-card no-body class="mb-1" style=" margin-bottom: 15% !important; ">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion3>
          3. Xuất lương cod trung chuyển tỉnh theo một khoảng thời gian
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion3" :visible="three.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-4 mb-4">
              <label class="form-label"> Chọn ngày bắt đầu </label>
              <datepicker
                v-model="three.selectedStartDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
              />
            </div>
            <div class="col-md-4 mb-4">
              <label class="form-label"> Chọn ngày kết thúc </label>
              <datepicker
                v-model="three.selectedEndDate"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
              />
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="three.loadingButton" @click.native="exportTransitCodSalaryByRangeTime" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
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
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import salaryService from 'domain/services/salary-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import TreeView from 'vue-json-tree-view'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'

Vue.use(TreeView)

moment.suppressDeprecationWarnings = true

export default {
  name: 'rent-truck-price',
  metaInfo: {
    title: 'Tool lương cod trung chuyển tỉnh'
  },
  components: {
    flatPickr,
    LaddaBtn,
    salaryService,
    VueMonthlyPicker,
    Multiselect,
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
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },
    two: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },
    three: {
      visible: false,
      loadingButton: false,
      selectedStartDate: new Date(moment().format('YYYY') + '-' + moment().format('MM') + '-21'),
      selectedEndDate: new Date(moment().format('YYYY') + '-' + moment().format('MM') + '-20')
    },
    inputDisable: false,
    listFiles: [],
    perPage: 10,
    currentPage: 1,

    buttonBackGround: {
      backgroundColor: '#EEEEEE'
    },
    export_types: [
      {id: 1, name: 'Tổng hợp theo tháng'},
      // {id: 2, name: 'Chi tiết theo ngày'},
      {id: 2, name: 'Tất cả các điểm'}
    ],
    exp_type: {id: 1, name: 'Tổng hợp theo tháng'},
    exp_usernames: '',
    controlGetListFile: {
      numberRunning: 0
    },
    intervalGetListFile: null
  }),
  computed: {
    rows () {
      return this.listFiles.length
    }
  },
  created () {
    this.getListFiles()
  },
  watch: {
    controlGetListFile: {
      handler: function () {
        // call api getListFile khi vẫn còn tiến trình running. Các lần call cách nhau 90000ms
        if (this.controlGetListFile.numberRunning > 0) {
          this.intervalGetListFile = setInterval(() => {
            if (this.controlGetListFile.numberRunning > 0) {
              this.getListFiles()
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
    getListFiles: function () {
      salaryService.getListFiles().then(res => {
        if (res.data.success) {
          this.listFiles = res.data.data
          this.controlGetListFile.numberRunning = res.data.data.filter(item => item.status === 'running').length
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    removeExportFile: function (code) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi?')) return
      if (!code) return

      let dataSend = {
        'code': code
      }
      commonHelper.showMessage('Đang thực hiện', 'success')
      salaryService.removeExportFile(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getListFiles()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        commonHelper.showMessage('Đã xảy ra lỗi', 'warning')
        console.log(error)
      })
    },
    exportTransitCodAllByMonth: function () {
      this.one.loadingButton = true
      let month = moment(this.one.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let expType = this.exp_type.id
      let dataSend = {
        'year': str[0],
        'month': str[1],
        'exp_type': expType
      }
      console.log(dataSend)
      salaryService.exportTransitCodSalary(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          if (expType === 1) {
            window.open(res.data.path, '_blank')
          } else {
            this.getListFiles()
          }
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.one.loadingButton = false
      })
    },
    exportTransitCodAllByUsername: function () {
      this.two.loadingButton = true
      let time = moment(this.two.selectedMonth).format('YYYY/MM')
      let str = time.split('/')
      let usernames = this.exp_usernames.split(',')
      let dataSend = {
        'year': str[0],
        'month': str[1],
        'usernames': usernames
      }
      salaryService.exportTransitCodSalaryByUsername(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.open(res.data.path, '_blank')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.two.loadingButton = false
      })
    },
    exportTransitCodSalaryByRangeTime: function () {
      this.three.loadingButton = true
      let startDate = moment(this.three.selectedStartDate).format('YYYY-MM-DD')
      let endDate = moment(this.three.selectedEndDate).format('YYYY-MM-DD')
      let dataSend = {
        'start_date': startDate,
        'end_date': endDate
      }
      salaryService.exportTransitCodSalaryByRangeTime(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.open(res.data.path, '_blank')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.three.loadingButton = false
      })
    }
  }
}
</script>
