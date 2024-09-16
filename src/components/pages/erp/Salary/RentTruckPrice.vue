<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Tool cước xe thuê
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------1. Tool xuất cước xe thuê theo tháng -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          1. Xuất cước xe thuê theo tháng
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" :visible="one.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-2 mb-1">
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
              <label class="form-label">Chọn tháng xuất cước</label>
              <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md-4 mb-5">
              <label class="form-label">Chọn công ty</label>
              <multiselect class="multiselect-success"
                           v-model="customerCompany"
                           :options="company"
                           placeholder="Chọn Công ty xuất cước"
                           selectedLabel="Đã chọn"
                           deselectLabel="Bỏ chọn"
                           selectLabel="Chọn"
                           track-by="ErpCompanyProfile"
                           label="ErpCompanyProfile"
                           :searchable="true"
                           :multiple="true"
                           :hide-selected="true"
                           :allow-empty="true"
                           :clearOption="true"
                           :custom-label="customRecord"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </div>
            <div class="col-md-2 mb-2">
              <label class="form-label">Loại tuyến</label>
              <multiselect
                v-model="route_type"
                label="name"
                track-by="name"
                selectedLabel=""
                deselectLabel=""
                selectLabel="Chọn"
                :options="route_types"
                :searchable="false"
                :allow-empty="false">
              </multiselect>
            </div>
            <div class="col-md-3 col-xl-2 mb-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="one.loadingButton" @click.native="exportPriceRentTruckAllByMonth" data-style="expand-right"
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

    <!------------------------------------------------2. Tool xuất cước xe thuê theo từng ngày -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2>
          2. Xuất cước xe thuê chi tiết từng ngày
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion2" :visible="two.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md mb-4">
              <label class="form-label">Chọn ngày xuất cước</label>
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
            <div class="col-md-4 mb-5">
              <label class="form-label">Chọn công ty</label>
              <multiselect class="multiselect-success"
                           v-model="customerCompany"
                           :options="company"
                           placeholder="Chọn Công ty xuất cước"
                           selectedLabel="Đã chọn"
                           deselectLabel="Bỏ chọn"
                           selectLabel="Chọn"
                           track-by="ErpCompanyProfile"
                           label="ErpCompanyProfile"
                           :searchable="true"
                           :multiple="true"
                           :hide-selected="true"
                           :allow-empty="true"
                           :clearOption="true"
                           :custom-label="customRecord"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </div>
            <div class="col-md-2 mb-2">
              <label class="form-label">Loại tuyến</label>
              <multiselect
                v-model="route_type"
                label="name"
                track-by="name"
                selectedLabel=""
                deselectLabel=""
                selectLabel="Chọn"
                :options="route_types"
                :searchable="false"
                :allow-empty="false">
              </multiselect>
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="two.loadingButton" @click.native="exportPriceRentTruckDetail" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(two.responseMessage).length >1">
            <tree-view :data="two.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------3. Chạy lại cước xe thuê theo tháng -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion3>
          3. Chạy lại cước xe thuê
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion3" :visible="three.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md mb-1">
              <label class="form-label">Chọn tháng chạy lại cước</label>
              <vue-monthly-picker v-model="three.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="three.loadingButton" @click.native="runPriceRentTruck" data-style="expand-right"
                         class="btn btn-danger" style="width: 100%">
                Chạy lại cước
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(three.responseMessage).length >1">
            <tree-view :data="three.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------4. Tool chạy cước xe khô theo tháng -------------------------------------------------------------->
    <b-card no-body class="mb-1" >
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion4>
          4. Chạy cước xe khô
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion4" :visible="four.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-2 mb-1">
              <label class="form-label">Chọn tháng</label>
              <vue-monthly-picker v-model="four.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md-2 col-xl-2 mb-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="four.loadingButton" @click.native="runDryRentTruck" data-style="expand-right"
                         class="btn btn-danger" style="width: 100%">
                Chạy lại cước xe khô
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(four.responseMessage).length >1">
            <tree-view :data="four.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>

        </b-card-body>
      </b-collapse>
    </b-card>
    <!------------------------------------------------5. Tool xuất xe khô theo tháng -------------------------------------------------------------->
    <b-card no-body class="mb-1" >
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion5>
          5. Xuất cước xe khô theo tháng
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion5" :visible="five.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-2 mb-1">
              <label class="form-label">Chọn tháng</label>
              <vue-monthly-picker v-model="five.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md-2 col-xl-2 mb-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="five.loadingButton" @click.native="exportDryRentTruck" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(five.responseMessage).length >1">
            <tree-view :data="five.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>

        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------6. Tool xuất nhanh chi tiết xe thuê theo tháng -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion6>
          6. Xuất nhanh chi tiết xe thuê theo tháng
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion6" :visible="six.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-2 mb-1">
              <label class="form-label">Chọn tháng</label>
              <vue-monthly-picker v-model="six.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md-2 col-xl-2 mb-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="six.loadingButton" @click.native="exportDetailRentTruckQuick" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(six.responseMessage).length >1">
            <tree-view :data="six.responseMessage" :options="{maxDepth: 1}"></tree-view>
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
                        <div class="btn btn-sm btn-outline-danger" v-if="row.item.can_remove" @click="removeExportFileQuick(row.item.code)">
                          <i class="fa fa-times"></i>
                        </div>
                        <div class="btn btn-sm btn-outline-info"  @click="downloadRentTruckFileQuick(row.item.code)">
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
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import rentTruckService from 'domain/services/rent-truck-service'
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
  name: 'rent-truck-price',
  metaInfo: {
    title: 'Tool cước xe thuê'
  },
  components: {
    SelectStations,
    flatPickr,
    LaddaBtn,
    rentTruckService,
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
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },

    two: {
      visible: false,
      loadingButton: false,
      selectedDate: moment(new Date()).format('YYYY/MM/DD'),
      responseMessage: {}
    },
    three: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },
    four: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },
    five: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM/DD'),
      responseMessage: {}
    },
    six: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },
    inputDisable: false,

    buttonBackGround: {
      backgroundColor: '#EEEEEE'
    },

    company: [],
    customerCompany: [],
    salaryData: [],
    runSuccessProgres: 0,
    countListCompany: 0,
    listFiles: [],
    perPage: 10,
    currentPage: 1,
    export_types: [
      {id: 1, name: 'Tổng hợp theo tháng'}
      // {id: 2, name: 'Chi tiết tất cả các ngày'}
    ],
    exp_type: {id: 1, name: 'Tổng hợp theo tháng'},

    route_types: [
      {id: 0, name: 'Tất cả các loại'},
      {id: 1, name: 'Nội thành'},
      {id: 2, name: 'Liên tỉnh'},
      {id: 5, name: 'Liên miền'}
    ],
    route_type: {id: 0, name: 'Tất cả các loại'},
    controlGetListFile: {
      numberRunning: 0
    },
    intervalGetListFile: null,
    dateCheckPoint: null
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

  created () {
    this.getListCompany()
    this.getListFiles()
  },

  methods: {
    getListCompany: function () {
      let month = moment(this.one.selectedMonth).format('YYYY/MM')
      let strDate = month.split('/')
      let dataSend = {
        'month': strDate[1],
        'year': strDate[0]
      }
      rentTruckService.getListCompany(dataSend).then(res => {
        if (res.data.success) {
          this.company = res.data.data
          this.countListCompany = res.data.count
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    customRecord: function ({ErpCompanyProfile}) {
      return `${ErpCompanyProfile.fullname}`
    },
    exportPriceRentTruckAllByMonth: function () {
      this.one.loadingButton = true
      let month = moment(this.one.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let expType = this.exp_type.id
      let routeType = this.route_type.id
      let companies = this.company
      if (this.customerCompany.length > 0) {
        companies = this.customerCompany
      }
      // console.log(companies)
      let dataSend = {
        'year': str[0],
        'month': str[1],
        'export_type': expType,
        'route_type': routeType,
        'companies': companies
      }
      console.log(dataSend)
      rentTruckService.exportPriceRentTruckAll(dataSend).then(res => {
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
    exportPriceRentTruckDetail: function () {
      this.two.loadingButton = true
      let date = moment(this.two.selectedDate).format('YYYY-MM-DD')
      let expType = this.exp_type.id
      let routeType = this.route_type.id
      let companies = this.company
      if (this.customerCompany.length > 0) {
        companies = this.customerCompany
      }
      let dataSend = {
        'date': date,
        'export_type': expType,
        'route_type': routeType,
        'companies': companies
      }
      console.log(dataSend)
      rentTruckService.exportPriceRentTruckDetail(dataSend).then(res => {
        // console.log(res.data.path)
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          // window.location.href = res.data.path
          window.open(res.data.path, '_blank')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.two.loadingButton = false
      })
    },
    runPriceRentTruck: function () {
      this.three.loadingButton = true
      let month = moment(this.three.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let dataSend = {
        'year': str[0],
        'month': str[1]
      }
      console.log(dataSend)
      rentTruckService.runPriceRentTruck(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.three.loadingButton = false
      })
    },
    getListFiles: function () {
      this.dateCheckPoint = this.$route.query.dateCheckPoint
      let dataSend = {
        'date_check_point': this.dateCheckPoint
      }
      rentTruckService.getListFiles(dataSend).then(res => {
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
        'code': code,
        'date_check_point': this.dateCheckPoint
      }
      commonHelper.showMessage('Đang thực hiện', 'success')
      rentTruckService.removeExportFile(dataSend).then(res => {
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
    runDryRentTruck: function () {
      this.four.loadingButton = true
      let month = moment(this.four.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let dataSend = {
        'year': str[0],
        'month': str[1]
      }
      rentTruckService.runDryRentTruck(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.open(res.data.path, '_blank')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.four.loadingButton = false
      })
    },
    exportDryRentTruck: function () {
      this.five.loadingButton = true
      let month = moment(this.five.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let dataSend = {
        'year': str[0],
        'month': str[1]
      }

      rentTruckService.exportDryRentTruck(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.open(res.data.path, '_blank')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.five.loadingButton = false
      })
    },
    exportDetailRentTruckQuick: function () {
      this.six.loadingButton = true
      let month = moment(this.six.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let dataSend = {
        'year': str[0],
        'month': str[1]
      }
      rentTruckService.exportDetailRentTruckQuick(dataSend).then(res => {
        if (res.data.success) {
          this.getListFiles()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).then(() => {
        this.six.loadingButton = false
      })
    },
    downloadRentTruckFileQuick: function (code) {
      if (!code) return
      commonHelper.showMessage('Vui lòng chờ!!!', 'success')

      let dataSend = {
        'code': code
      }

      rentTruckService.downloadRentTruckFileQuick(dataSend).then(res => {
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
    removeExportFileQuick: function (code) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi?')) return
      if (!code) return

      let dataSend = {
        'code': code,
        'date_check_point': this.dateCheckPoint
      }
      commonHelper.showMessage('Đang thực hiện', 'success')
      rentTruckService.removeExportFileQuick(dataSend).then(res => {
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
    }
  }
}
</script>
