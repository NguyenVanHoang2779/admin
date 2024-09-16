<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Tool xuất điểm dừng của tài xế
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------1. Xuất dữ liệu điểm dừng tài xế theo khoảng thời gian -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          1. Xuất dữ liệu điểm dừng tài xế theo khoảng thời gian
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" :visible="one.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-3 mb-1">
              <label class="form-label">Chọn ngày bắt đầu</label>
              <datepicker
                v-model="one.dateFrom"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
              />
            </div>
            <div class="col-md-3 mb-1">
              <label class="form-label">Chọn ngày kết thúc</label>
              <datepicker
                v-model="one.dateTo"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
              />
            </div>
            <div class="col-md-2 col-xl-2 mb-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="one.loadingButton" @click.native="exportDriverPointDataByDate" data-style="expand-right"
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
                        <div class="btn btn-sm btn-outline-danger" v-if="row.item.can_remove" @click="removeFileDriverSsPoint(row.item.code)">
                          <i class="fa fa-times"></i>
                        </div>
                        <div class="btn btn-sm btn-outline-info" @click="downloadFileDriverSsPoint(row.item.code)">
                          <i class="ion ion-md-cloud-download"></i>
                        </div>
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
import driverSessionService from 'domain/services/driver-session-service'
import TreeView from 'vue-json-tree-view'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

Vue.use(TreeView)

moment.suppressDeprecationWarnings = true

export default {
  components: {
    driverSessionService,
    Datepicker,
    commonHelper,
    LaddaBtn,
    controlGetListFile: {
      numberRunning: 0
    }
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
      dateFrom: moment(new Date()).format('YYYY/MM/DD'),
      dateTo: moment(new Date()).format('YYYY/MM/DD'),
      responseMessage: {}
    },
    listFiles: [],
    perPage: 10,
    currentPage: 1,
    intervalGetListFile: null,
    dateCheckPoint: null,
    controlGetListFile: {
      numberRunning: 0
    }
  }),

  computed: {
    rows () {
      return this.listFiles.length
    }
  },

  watch: {
    controlGetListFile: {
      handler: function () {
        // call api getListFile khi vẫn còn tiến trình running. Các lần call cách nhau 90000ms
        if (this.controlGetListFile.numberRunning > 0) {
          this.intervalGetListFile = setInterval(() => {
            if (this.controlGetListFile.numberRunning > 0) {
              this.getListFileDriverSsPointData()
            }
          }, 90000)
        } else {
          clearInterval(this.intervalGetListFile)
        }
      },
      deep: true
    }
  },

  created () {
    this.getListFileDriverSsPointData()
  },

  methods: {
    getListFileDriverSsPointData: function () {
      this.dateCheckPoint = this.$route.query.dateCheckPoint
      let dataSend = {
        'date_check_point': this.dateCheckPoint
      }
      driverSessionService.getListFileDriverSsPointData(dataSend).then(res => {
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
    exportDriverPointDataByDate: function () {
      this.one.loadingButton = true
      let dataSend = {
        'from': moment(this.one.dateFrom).format('YYYY/MM/DD'),
        'to': moment(this.one.dateTo).format('YYYY/MM/DD')
      }
      driverSessionService.exportDriverPointDataByDate(dataSend).then(res => {
        if (res.data.success) {
          this.getListFileDriverSsPointData()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.one.loadingButton = false
      })
    },
    downloadFileDriverSsPoint: function (code) {
      if (!code) return
      commonHelper.showMessage('Vui lòng chờ!!!', 'success')

      let dataSend = {
        'code': code
      }

      driverSessionService.downloadFileDriverSsPoint(dataSend).then(res => {
        if (res.data.success) {
          if (res.data.path) {
            commonHelper.showMessage(res.data.message, 'success')
            window.open(res.data.path, '_blank')
          }
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        commonHelper.showMessage('Đã xảy ra lỗi', 'warning')
        console.log(error)
      })
    },
    removeFileDriverSsPoint: function (code) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi?')) return
      if (!code) return

      let dataSend = {
        'code': code,
        'date_check_point': this.dateCheckPoint
      }
      commonHelper.showMessage('Đang thực hiện', 'success')
      driverSessionService.removeFileDriverSsPoint(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.getListFileDriverSsPointData()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        commonHelper.showMessage('Đã xảy ra lỗi', 'warning')
        console.log(error)
      })
    }
  }
}
</script>
