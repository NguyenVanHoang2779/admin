<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Quản lý dữ liệu công việc tài xế</div>
    </h4>
    <b-card no-body>
      <b-card-body>
        <div class="row">
          <div class="col-md-4 border-left border-success" style="background: #ebf5fb">
            <div style="padding: 10px 5px 0 5px;">
              <b-form-group label="Chọn kho">
                <select-stations :multiple="false" :disabled="disabledCol1"
                                 @selected="setSelectedStation"></select-stations>
              </b-form-group>
            </div>
            <div style="padding: 10px 5px 0 5px;">
              <b-form-group label="Chọn loại tài xế">
                <multiselect v-model="selectedPositionJob"
                             label="name"
                             track-by="code"
                             :options="listPositionJobs"
                             :taggable="true"
                             placeholder="Chọn"
                             @input="setSelectedPositionJob"
                             :disabled="disabledCol1"
                ></multiselect>
              </b-form-group>
            </div>
            <div style="padding: 10px 5px 0 5px;">
              <b-form-group label="Chọn tài xế">
                <multiselect v-model="selectedDriverId"
                             label="name"
                             track-by="code"
                             :options="listDriverId"
                             :taggable="true"
                             placeholder="Chọn"
                             @input="setSelectedDriver"
                             :disabled="disabledCol1"
                ></multiselect>
              </b-form-group>
            </div>
          </div>
          <div class="col-md-auto"></div>
          <div class="col-md-3">
            <div style="margin-bottom: 10px; width: 100%">
              <div class="border-left border-danger center-input">
                <label class="form-label">Mã nhân viên</label>
                <b-form-input id="inputLive"
                              v-model.trim="typedCodAlias"
                              :disabled="disabledCol2[0]"
                              type="text"
                              :state="aliasState"
                              @input="typingCol2(0)"
                              aria-describedby="inputLiveFeedback"
                              placeholder="Nhập alias"></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">
                  <!-- This will only be shown if the preceeding input has an invalid state -->
                  Vui lòng kiểm tra lại alias
                </b-form-invalid-feedback>
              </div>
            </div>
            <div style="margin-bottom: 10px">
              <div class="border-left border-danger center-input">
                <label class="form-label">Tên đăng nhập</label>
                <b-form-input id="inputLive"
                              v-model.trim="typedUserName"
                              :disabled="disabledCol2[1]"
                              type="text"
                              :state="usernameState"
                              @input="typingCol2(1)"
                              aria-describedby="inputLiveFeedback"
                              placeholder="Nhập username"></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">
                  <!-- This will only be shown if the preceeding input has an invalid state -->
                  Vui lòng kiểm tra lại username
                </b-form-invalid-feedback>
              </div>
            </div>
            <div>
              <div class="border-left border-danger center-input">
                <label class="form-label">ID nhân viên</label>
                <b-form-input id="inputLive"
                              v-model.trim="typedDriverId"
                              :disabled="disabledCol2[2]"
                              type="number"
                              :state="idState"
                              @input="typingCol2(2)"
                              aria-describedby="inputLiveFeedback"
                              placeholder="Nhập id"></b-form-input>
                <b-form-invalid-feedback id="inputLiveFeedback">
                  <!-- This will only be shown if the preceeding input has an invalid state -->
                  Vui lòng kiểm tra lại ID
                </b-form-invalid-feedback>
              </div>
            </div>
          </div>
          <div class="col-md-auto"></div>
          <div v-if="typeof infoDriver.driver_id !== 'undefined'" class="col-md-4"
               style="text-align: center; background-color: #FAFAFA; margin-right: 40px">
            <div class="media col-md-10 col-lg-8 col-xl-7 py-5 mx-auto">
              <img :src="baseUrl + '/static/img/noimage.png'" alt class="d-block ui-w-100 rounded" width="300"
                   height="300">
              <div class="media-body ml-5">
                <h5 class="font-weight-bold mb-4">{{infoDriver.fullname}} - {{infoDriver.driver_id}}</h5>

                <div class="text-muted mb-4">
                  <p><strong>Kho: </strong>{{infoDriver.station_name}} - {{infoDriver.station_id}}</p>
                  <p v-if="infoDriver.position_job === '49'"><strong>Vị trí: Tài xế liên tỉnh</strong>
                  <p v-if="infoDriver.position_job === '65'"><strong>Vị trí: Tài xế nội tỉnh</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="col-md-4" style="text-align: center; background-color: #FAFAFA; margin-right: 40px">
            <div class="media col-md-10 col-lg-8 col-xl-7 py-5 mx-auto">
              <img :src="baseUrl + '/static/img/noimage.png'" alt class="d-block ui-w-100 rounded" width="300"
                   height="300">
              <div class="media-body ml-5">
                <h5 class="font-weight-bold mb-4">...................</h5>

                <div class="text-muted mb-4">
                  <p><strong>Kho: </strong>.......................</p>
                  <p><strong>Vị trí: </strong>......................</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: -30px; padding-bottom: -20px">
          <div class="col-md-4" style="padding: 10px">
            <b-form-group label="Khoảng thời gian">
              <v-date-picker color="green" placeholder="Chọn khoảng thời gian"
                             mode="range" v-model="selectedRangeTime" :model-config="modelConfig" locale="vi"/>
<!--              <flat-pickr v-model="selectedRangeTime" :config="rangeConfig" placeholder="Chọn khoảng thời gian"/>-->
<!--              <p v-if="selectedRangeTime !== '' " style="font-size: 13px; line-height: 30px"><i>&emsp;(*) ứng với-->
<!--                dữ liệu từ <span style="color: red">{{selectedRangeTime.split(' to ')[0]}} 00:00:00</span> đến <span-->
<!--                  style="color: red">{{selectedRangeTime.split(' to ')[1]}} 23:59:59</span></i></p>-->
            </b-form-group>
          </div>
          <div class="col-md-4" style="padding: 10px">
            <label class="form-label d-none d-md-block">&nbsp;</label>
            <ladda-btn @click.native="runProcess" :loading="loadingButton"
                       data-style="expand-right" class="btn btn-primary" style="width: 40%">
              Chạy
            </ladda-btn>
          </div>
          <div class="col-md-1 offset-md-3" style="padding: 10px">
            <label class="form-label d-none d-md-block">&nbsp;</label>
            <b-btn size="sm" variant="outline-danger" @click="resetAllFields"><i class="ion ion-md-refresh"></i> Reset
            </b-btn>
          </div>
          <div class="d-inline-block">
        </div>
        </div>
        <br>
        <!--<hr class="border-light container-m&#45;&#45;x my-5">-->
      </b-card-body>
    </b-card>
    <sweet-modal ref="modalShowBag" :title="titleModalShowBag">
      <div  style="text-align:justify">
        <b><i>Mã bao:</i></b> {{listBags}}
      </div>
    </sweet-modal>
    <b-modal ref="modalConfirmUpdate" hide-footer static>
      <div class="d-block text-center">
        <h4>Bạn có chắc chắn muốn cập nhật dữ liệu làm việc cho tài xế này không?</h4>
      </div>
      <b-btn class="mt-3" variant="outline-success" block @click="saveDataChange">Xác nhận</b-btn>
    </b-modal>
    <br>
    <b-card no-body>
      <!-- Table controls -->
      <b-card-body>
        <div class="row">
          <b-tabs class="nav-tabs-top mb-4" v-model="tabIndex" nav-wrapper-class="w-200" style="width: 100%">
            <b-tab v-for="(dataDate, key) in dataAllDate" :key="key" :title="dataDate.date"
                   :title-link-class="linkClass(key)">
              <div class="card-body col-md-12" style="width: 100%">
<!--                <div>-->
<!--                  <h5>&#9679; Dữ liệu dùng để tính lương lưu trên hệ thống:</h5>-->
<!--                  <div-->
<!--                    v-if="-->
<!--                    dataDate.reportData.length === 0 ||-->
<!--                    typeof (dataDate.reportData) === 'undefined' ||-->
<!--                    (!(dataDate.reportData.stations_km) && !(dataDate.reportData.points_km_update))"-->
<!--                    class="p-3 mb-2 bg-danger text-white">-->
<!--                    Vui lòng kiểm tra lại thông tin chấm công của tài xế hoặc liên hệ kỹ thuật để giải đáp!-->
<!--                  </div>-->
<!--                  <div v-else>-->
<!--                    <ul>-->
<!--                      <li><b>Số điểm: </b>{{dataDate.reportData.station_points}} Điểm</li>-->
<!--                      <li><b>Số Km: </b>{{parseInt(dataDate.reportData.distance_stations) / 1000}} Km</li>-->
<!--                      <li><b>Số đơn: </b>{{dataDate.reportData.count_pkgs}} Đơn</li>-->
<!--                      <li><b>Chi tiết: </b>-->
<!--                        <b-btn-->
<!--                          style="padding: 0; margin-top: -2px"-->
<!--                          variant="link"-->
<!--                          :width = 1000-->
<!--                          title="Dữ liệu log loại điểm"-->
<!--                          v-b-popover.hover.focus.rightbottom.html="showLogReport(dataDate.reportData.stations_km, dataDate.reportData.points_km_update)">-->
<!--                          Nhấn vào đây để xem-->
<!--                        </b-btn>-->
<!--                      </li>-->
<!--                      <li><b>Lần cuối cập nhật:</b> <i style="color: #24abf2">{{dataDate.reportData.modified}}</i> bởi <i style="color: red">{{dataDate.reportData.update_by_username}}</i></li>-->
<!--                    </ul>-->
<!--                  </div>-->
<!--                </div>-->
                <h5>&#9679; Log xuất nhập:</h5>
                <div
                  v-if="dataDate.data.length === 0 && (typeof (dataAllDateBackup[key]) === 'undefined' || dataAllDateBackup[key].length < 1)"
                  class="p-3 mb-2 bg-danger text-white">
                  Không có dữ liệu lên xuống tải
                </div>
                <div class="table-result">
                  <!-- Table -->
                  <div v-if="dataDate.data.length !== 0" class="table-responsive mb-4">
                    <table class="table mb-0 table-bordered" style="text-align: center; vertical-align: middle">
                      <thead class="">
                      <tr>
                        <th rowspan="2" style="width: 5%; vertical-align: middle">STT</th>
                        <th rowspan="2" style="width: 10%; vertical-align: middle">ID điểm dừng</th>
                        <th rowspan="2" style="width: 15%; vertical-align: middle">Tên điểm dừng</th>
                        <th rowspan="2" style="width: 5%; vertical-align: middle">Tọa độ</th>
                        <th colspan="4">Log lên xuống tải</th>
                        <th rowspan="2" style="width: 5%; vertical-align: middle">Actions</th>
                      </tr>
                      <tr>
                        <th>Loại</th>
                        <th>Số bao</th>
                        <th>Điều phối thao tác</th>
                        <th>Thời gian</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(dataInPoint, stt) in dataDate.data">
                        <td style="vertical-align: middle">{{stt+1}}</td>
                        <td style="vertical-align: middle">{{dataInPoint.point_id}}</td>
                        <td style="vertical-align: middle">{{dataInPoint.point_name}}</td>
                        <td style="vertical-align: middle" v-if="dataInPoint.lat_lng">{{dataInPoint.lat_lng}}</td>
                        <td style="vertical-align: middle" v-else>Không tìm thấy, vui lòng cập nhật</td>
                        <td style="text-align: left;">
                          <div
                            v-for="(log, index) in dataInPoint.list_his_truck"
                            :class="index % 2 === 0 ? 'p-1 bg-light text-dark mb-0' : 'p-1 bg-white text-dark mb-0'">
                            <i v-if="log.type === 'down'" class="ion ion-md-arrow-down"
                               style="color: red; display: inline-block;"><b>&nbsp;Xuống tải</b></i>
                            <i v-if="log.type === 'up'" class="ion ion-md-arrow-up"
                               style="color: green; display: inline-block;"><b>&nbsp;Lên tải</b></i>
                          </div>
                        </td>
                        <td style="text-align: left;">
                          <div
                            v-for="(log, index) in dataInPoint.list_his_truck"
                            :class="index % 2 === 0 ? 'bg-light text-dark mb-0' : 'bg-white text-dark mb-0'">
                            <b-button style="padding: 2px 10px 3px" @click="showBags(log)" variant="link">
                              {{log.bags.length}} bao
                            </b-button>
                          </div>
                        </td>
                        <td style="text-align: left;">
                          <div
                            v-for="(log, index) in dataInPoint.list_his_truck"
                            :class="index % 2 === 0 ? 'p-1 bg-light text-dark mb-0' : 'p-1 bg-white text-dark mb-0'">
                            {{log.operator}}
                          </div>
                        </td>
                        <td style="text-align: left;">
                          <div
                            v-for="(log, index) in dataInPoint.list_his_truck"
                            :class="index % 2 === 0 ? 'p-1 bg-light text-dark mb-0' : 'p-1 bg-white text-dark mb-0'">
                            {{log.created}}
                          </div>
                        </td>
<!--                        <td style="vertical-align: middle">-->
<!--                          <b-btn type="button" class="btn btn-success pt-1" variant="danger"-->
<!--                                 @click="deletePoint(key, stt)"> Loại điểm-->
<!--                          </b-btn>-->
<!--                        </td>-->
                      </tr>
                      </tbody>
                    </table>
                  </div>
<!--                  <div v-if="!(dataDate.data.length === 0 && (typeof (dataAllDateBackup[key]) === 'undefined' || dataAllDateBackup[key].length < 1))" class="row">-->
<!--                    <div v-if="!(dataDate.reportData.length === 0 || typeof (dataDate.reportData) === 'undefined')" class="col-md-4 offset-md-9">-->
<!--                      <b-button-->
<!--                        :disabled="typeof (dataAllDateBackup[key]) === 'undefined' || dataAllDateBackup[key].length < 1"-->
<!--                        @click="rollbackDeletePoint(key)" variant="outline-danger">-->
<!--                        <i class="ion ion-ios-undo"></i>&nbsp;Hoàn tác-->
<!--                      </b-button>-->
<!--                      <ladda-btn @click.native="clickButtonUpdate(dataDate.date, dataDate.data)" :loading="loadingButtonSave"-->
<!--                                 data-style="expand-right" class="btn btn-success" style="width: 40%">-->
<!--                        Lưu thay đổi-->
<!--                      </ladda-btn>-->
<!--                    </div>-->
<!--                  </div>-->
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </b-card-body>
      <!-- / Table controls -->

      <!-- Table -->
      <hr class="border-light m-0">
      <div class="table-responsive">
      </div>

      <!-- Pagination -->
      <b-card-body class="pt-0 pb-3">
      </b-card-body>
      <!-- / Pagination -->

    </b-card>
    <notifications group="notifications-default"/>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect'
import salaryService from 'domain/services/salary-service'
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import moment from 'moment'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'

const optionPostionJobs = [
  {name: 'Tất cả', code: 0},
  {name: 'Tài xế liên tỉnh', code: 49},
  {name: 'Tài xế nội tỉnh', code: 56}
]
export default {
  name: 'driver-data-work-manager',
  metaInfo: {
    title: 'Driver Data Work'
  },
  components: {
    Multiselect,
    salaryService,
    flatPickr,
    LaddaBtn,
    SelectStations,
    moment,
    SweetModal,
    SweetModalTab
  },
  data: () => ({
    // Options
    selectedStation: '',
    selectedDriverId: '',
    listDriverId: [],
    listDriverFollowPosition: [],
    listPositionJobs: optionPostionJobs,
    selectedPositionJob: optionPostionJobs[0],
    selectedRangeTime: '',
    typedCodAlias: '',
    typedUserName: '',
    typedDriverId: '',
    disabledCol1: false,
    disabledCol2: [false, false, false],
    loadingButton: false,
    modelConfig: {
    },
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'Y-m-d',
      altFormat: 'Y-m-d'
    },
    infoDriver: {},
    // Data show
    forceToStop: false,
    loadingButtonSave: false,
    titleModalShowBag: '',
    listBags: '',
    readyToShow: true,
    tabIndex: 0,
    dataAllDate: [],
    dataAllDateBackup: [],
    // Data Update
    dataSendUpdate: {}
  }),

  computed: {
    aliasState () {
      if (/(T|t)([0-9]+)/.test(this.typedCodAlias) || this.typedCodAlias === '') return true
      return false
    },
    idState () {
      if (this.typedDriverId > 1000000) return false
      return true
    },
    usernameState () {
      return true
    },
    totalItems () {
      return this.articlesData.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  methods: {
    setSelectedPositionJob () {
      if (this.listDriverFollowPosition.length !== 0) {
        if (this.selectedPositionJob.code === 0 || !this.selectedPositionJob) this.listDriverId = this.listDriverFollowPosition[49].concat(this.listDriverId = this.listDriverFollowPosition[65])
        if (this.selectedPositionJob.code === 49) this.listDriverId = this.listDriverFollowPosition[49]
        if (this.selectedPositionJob.code === 56) this.listDriverId = this.listDriverFollowPosition[65]
        if (this.selectedPositionJob.code === '') this.listDriverId = this.listDriverFollowPosition[65]
      }
    },
    setSelectedStation (stationIds) {
      if (!stationIds) return
      this.selectedStation = stationIds
      this.listDriverId = []
      salaryService.apiGetAllDriversFromStation({stationId: stationIds}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
        if (response.data.hasOwnProperty('data')) {
          this.listDriverFollowPosition = response.data.data
          this.setSelectedPositionJob()
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
      })
    },
    setSelectedDriver () {
      if (this.selectedDriverId) {
        this.disabledCol2 = [true, true, true]
      } else {
        this.disabledCol2 = [false, false, false]
      }
    },
    typingCol2 (id) {
      this.disabledCol2 = [true, true, true]
      this.disabledCol2[id] = false
      if (this.typedUserName === '' && this.typedDriverId === '' && this.typedCodAlias === '') {
        this.disabledCol1 = false
        this.disabledCol2 = [false, false, false]
      } else {
        this.disabledCol1 = true
      }
    },
    resetAllFields () {
      this.selectedStation = ''
      this.selectedDriverId = ''
      this.selectedPositionJob = optionPostionJobs[0]
      this.selectedRangeTime = ''
      this.typedCodAlias = ''
      this.typedUserName = ''
      this.typedDriverId = ''
      this.disabledCol1 = false
      this.disabledCol2 = [false, false, false]
      this.loadingButton = false
      this.titleModalShowBag = ''
      this.listBags = ''
      this.readyToShow = true
      this.tabIndex = 0
      this.dataAllDate = []
      this.dataAllDateBackup = []
      this.forceToStop = true
    },
    linkClass (idx) {
      if (this.tabIndex === idx) {
        return ['bg-primary', 'text-white']
      } else {
        return ['bg-light', 'text-default']
      }
    },
    runProcess () {
      if (this.selectedRangeTime === '') return false
      if (!this.selectedDriverId && !this.typedCodAlias && !this.typedDriverId && !this.typedUserName) return false
      let rangetime = [
        moment(new Date(this.selectedRangeTime.start)).format('YYYY-MM-DD'),
        moment(new Date(this.selectedRangeTime.end)).format('YYYY-MM-DD')
      ]
      this.loadingButton = true
      this.dataAllDate = []
      salaryService.apiGetInfoDriver({
        codAlias: this.typedCodAlias,
        userName: this.typedUserName,
        driverId: this.typedDriverId ? this.typedDriverId : this.selectedDriverId.code,
        fromDate: rangetime[0],
        toDate: rangetime[1]
      }).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message ? response.data.message : 'Lấy thông tin tài xế thành công'
          })
          if (response.data.success) {
            this.infoDriver = response.data.data
          } else {
            this.readyToShow = false
            return 0
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
        if (typeof this.infoDriver.driver_id === 'undefined') {
          this.loadingButton = false
          return 0
        } else {
          this.forceToStop = false
          let range = [
            moment(new Date(this.selectedRangeTime.start)).format('YYYY-MM-DD'),
            moment(new Date(this.selectedRangeTime.end)).format('YYYY-MM-DD')
          ]
          this.getDataDateByDate(this.infoDriver.driver_id, range[0], range[1])
        }
      })
    },
    getDataDateByDate (driverId, from, to) {
      let dataSend = {
        'driverId': driverId,
        'date': from
      }
      salaryService.apiGetDataWorkDriverInRangeTime(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            if (response.data.hasOwnProperty('data')) {
              if (this.forceToStop) return
              this.dataAllDate.push({
                date: from,
                data: response.data.data,
                reportData: response.data.reportData
              })
            }
          }
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra khi lấy dữ liệu ngày ' + (new Date(from)).toLocaleDateString()
        })
        this.loadingButton = false
        return 0
      }).then(() => {
        if (this.forceToStop) return
        if (moment(new Date(from)).format('YYYY-MM-DD') === moment(new Date(to)).format('YYYY-MM-DD')) {
          this.loadingButton = false
          return
        }
        let nextDate = moment(new Date(from)).add(1, 'days').format('YYYY-MM-DD')
        this.getDataDateByDate(driverId, nextDate, to)
      })
    },
    showBags (log) {
      this.titleModalShowBag = `${log.bags.length} bao`
      this.listBags = log.bags.toString()
      this.listBags = this.listBags.replace(/,/g, ', ')
      this.$refs.modalShowBag.open()
    },
    deletePoint (key, stt) {
      if (typeof (this.dataAllDateBackup[key]) === 'undefined') this.dataAllDateBackup[key] = []
      this.dataAllDateBackup[key].push(this.dataAllDate[key].data.slice(0))
      this.dataAllDate[key].data.splice(stt, 1)
      let i
      for (i = 0; i < this.dataAllDate[key].data.length; i++) {
        if (typeof (this.dataAllDate[key].data[i + 1]) === 'undefined') break
        if (this.dataAllDate[key].data[i].point_id === this.dataAllDate[key].data[i + 1].point_id) {
          this.dataAllDate[key].data[i].list_his_truck = this.dataAllDate[key].data[i].list_his_truck.concat(this.dataAllDate[key].data[i + 1].list_his_truck)
          this.dataAllDate[key].data.splice(i + 1, 1)
        }
      }
    },
    rollbackDeletePoint (key) {
      if (typeof (this.dataAllDateBackup[key]) === 'undefined' || this.dataAllDateBackup[key].length < 1) return
      this.dataAllDate[key].data = this.dataAllDateBackup[key].pop()
    },
    showLogReport (log, logUpdate) {
      if (logUpdate) log = logUpdate
      let i
      let res = ''
      let index = 1
      for (i = 0; i < log.length; i++) {
        if (log[i].status === 'approved') {
          res = `${res}<p class="text-success">${index++}. ${log[i].point_name}`
          if (typeof log[i].info.reason !== 'undefined' && log[i].info.reason === 'first_point') {
            res = `${res}: Điểm xuất phát</p>`
          } else {
            res = `${res}: ${parseInt(log[i].info.distance) / 1000} Km</p>`
          }
        }
        if (log[i].status === 'reject' && log[i].reason !== 'duplicated') {
          res = `${res}<p class="text-danger">${index++}. ${log[i].point_name}`
          if (log[i].reason === 'fast_speed') {
            res = `${res}: Tốc độ tạm tính quá lớn (${Math.round(log[i].info.speed * 100) / 100} Km/h)</p>`
          }
          if (log[i].reason === 'to_not_lat_lng') {
            res = `${res}: Chưa config tọa độ điểm</p>`
          }
        }
      }
      return res
    },
    saveDataChange () {
      console.log(this.dataSendUpdate)
      if (!this.dataSendUpdate) return
      this.$refs.modalConfirmUpdate.hide()
      this.loadingButtonSave = true
      salaryService.apiUpdateDriverReportDataManually(this.dataSendUpdate).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
          if (response.data.success) {
            if (response.data.hasOwnProperty('data')) {
            }
          }
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra khi lấy dữ liệu ngày '
        })
        this.loadingButton = false
        return 0
      }).then(() => {
        this.loadingButtonSave = false
      })
    },
    clickButtonUpdate (date, data) {
      this.dataSendUpdate = {
        date: date,
        driver_id: this.infoDriver.driver_id,
        position_job: this.infoDriver.position_job,
        data: data
      }
      this.$refs.modalConfirmUpdate.show()
    }
  },

  mounted () {
  },

  created () {
  },
  updated () {
  }
}
</script>

<style scoped>
  .center-input {
    background: #ebf5fb;
    padding: 5px 5px 13px 5px;
  }

  .tab-content {
    background-color: red;
  }

  .popover {
    width: 100%;
  }

</style>
