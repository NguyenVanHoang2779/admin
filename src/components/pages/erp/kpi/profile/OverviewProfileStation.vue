<template>
  <div class="w-100" style="box-sizing: border-box; min-height: 500px">
    <div class="w-100 d-flex justify-content-between align-content-center mt-2 my-auto">
        <div class="d-inline-flex custom-tab cursor-pointer my-auto">
          <div class="px-2 py-0 my-auto" :class="{log: !isLog}" @click="changeTab(false)"><span>Tổng quan</span></div>
          <div class="px-2 py-0 my-auto" :class="{log: isLog}" @click="changeTab(true)"><span>Log chi tiết</span></div>
        </div>
      <div class="d-inline-flex align-content-center">
        <div class="my-auto mr-2" v-if="isLog">
          <span id="spanAll" class="font-weight-bold my-auto btn active" style="margin: 0px 10px 0 10px;" @click="changeChannelLog('', 'spanAll')">Tất cả {{ counterLog }}</span> |
          <span id="spanCost" class="font-weight-bold my-auto btn" style="margin: 0px 10px 0 10px;" @click="changeChannelLog('cost', 'spanCost')">Chi Phí {{ dataLogCounter.costCounter }}</span> |
          <span id="spanOperation" class="font-weight-bold my-auto btn" style="margin: 0px 10px 0 10px;" @click="changeChannelLog('operation', 'spanOperation')" >Vận hành {{ dataLogCounter.operationCounter }}</span>
          <span id="spanAllocation" class="font-weight-bold my-auto btn" style="margin: 0px 10px 0 10px;" @click="changeChannelLog('allocation', 'spanAllocation')" >Cấp phát {{ dataLogCounter.allocationCounter }}</span>
        </div>
          <div>
            <b-dropdown id="dropdown-right" right class="ml-2" toggle-class="bg-white text-body" style="border: 1px solid #828282; border-radius: 5px">
              <template #button-content>
                <span class="mr-1">{{formatDate(dataSend.from)}} - {{formatDate(dataSend.to)}}</span>
              </template>
              <b-dropdown-item @click="selectRangeTime(1)" class="border border-1 font-weight-bold">
                7 ngày trước
                <div>{{sevenDayBefore}}</div>
              </b-dropdown-item>
              <b-dropdown-item @click="selectRangeTime(2)" class="border border-1 font-weight-bold">
                30 ngày trước
                <div>{{thirtyDayBefore}}</div>
              </b-dropdown-item>
              <b-dropdown-item @click="selectRangeTime(3)" class="border border-1 font-weight-bold">
                Tuần này
                <div>{{currentWeek}}</div>
              </b-dropdown-item>
              <b-dropdown-item @click="selectRangeTime(4)" class="border border-1 font-weight-bold">
                Tuần trước
                <div>{{lastWeek}}</div>
              </b-dropdown-item>
              <b-dropdown-item @click="selectRangeTime(5)" class="border border-1 font-weight-bold">
                Tháng trước
                <div>{{lastMonth}}</div>
              </b-dropdown-item>
              <b-dropdown-item href="#" v-b-modal.modal-profile-time class="border border-1 font-weight-bold">
                Tùy chọn
                <div>Chọn khoảng thời gian</div>
              </b-dropdown-item>
              <b-modal id="modal-profile-time" hide-footer size="lg" centered title="Tùy chọn khoảng thời gian">
                <template #modal-header="{ close }">
                  <div style="display: flex;align-items: center; width: 100%;">
                    <button type="button" class="btn btn-success" style="background: #00904A;" @click="$bvModal.hide('modal-profile-time')"><i
                      class="fas fa-angle-left"></i></button>
                    <div style="text-align: center; width: 85%;"><p style="margin: 0px;">Tùy chọn khoảng thời gian</p></div>
                  </div>
                </template>
                <b-row>
                  <b-col>
                    <div class="display-center mb-4">
                      <input type="radio" name="green_status" id="rd-1" value='date' v-model="status"
                             style="width: 15px; height: 15px;"/><label for="rd-1" class="radio-button">Ngày</label>
                      <input type="radio" name="green_status" id="rd-2" value='month' v-model="status"
                             style="width: 15px; height: 15px;"/><label for="rd-2" class="radio-button">Tháng</label>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="6">
                    <b-row>
                      <b-col sm="2" class="label-penalty-search">
                        <label class="font-italic m-0">Từ:</label>
                      </b-col>
                      <b-col sm="10">
                        <datepicker
                          v-if="status=='date'"
                          v-model="from"
                          format="dd/MM/yyyy"
                          :bootstrapStyling="true"
                          :monday-first="true"
                          :full-month-name="true"
                          :calendar-button="true"
                          calendar-button-icon="ion ion-md-calendar"
                          :clear-button="true"
                          placeholder=""
                        />
                        <vue-monthly-picker
                          v-else
                          v-model="from"
                        >
                        </vue-monthly-picker>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="6">
                    <b-row>
                      <b-col sm="2" class="label-penalty-search">
                        <label class="font-italic m-0">Đến:</label>
                      </b-col>
                      <b-col sm="10">
                        <datepicker
                          v-if="status=='date'"
                          v-model="to"
                          format="dd/MM/yyyy"
                          :bootstrapStyling="true"
                          :monday-first="true"
                          :full-month-name="true"
                          :calendar-button="true"
                          calendar-button-icon="ion ion-md-calendar"
                          :clear-button="true"
                          placeholder=""
                        />
                        <vue-monthly-picker
                          v-else
                          v-model="to">
                        </vue-monthly-picker>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-button class="mt-3 btn-success" block @click="accept">Xác nhận</b-button>
              </b-modal>
            </b-dropdown>
          </div>
      </div>
    </div>
    <div class="overview-content mt-4 pb-4" v-show="!isLog">
      <b-row>
        <b-col>
          <div>
            <h5 style="font-weight: bold">Chi phí & bồi hoàn</h5>
          </div>
        </b-col>
      </b-row>
      <div class="w-100">
          <chart-line-station :data-send="dataSend" :position="position"/>
        </div>
      <b-row>
        <b-col md="6">
          <div>
            <chart-circle-person :data-send="dataSend"/>
          </div>
        </b-col>
        <b-col md="6">
          <div>
            <chart-circle-refund :data-send="dataSend"/>
          </div>
        </b-col>
      </b-row>
      <chart-bar-and-line-station :data-send="dataSend" :type-station="position"/>
    </div>
    <div class="overview-log mt-4 pb-4" v-if="isLog">
      <div class="list-wrapper" id="log-detail" @scroll="onScroll">

        <div class="black-line"></div>

        <div class="list-item-wrapper" v-for="(data) in dataLogDetail">
          <div class="list-bullet"></div>
          <div class="list-item">
            <div class="list-content">
              <span>{{ data.created_at }}:
              </span>
              <span v-if="data.bad" style="color: red;">
              &#9888;
              </span>
              <span>{{ data.content }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import ChartLineStation from './ChartLineStation.vue'
import VueMonthlyPicker from 'vue-monthly-picker'
import ChartCircleRefund from './ChartCircleRefund.vue'
import ChartCirclePerson from './ChartCirclePerson.vue'
import ChartBarAndLineStation from './ChartBarAndLineStation.vue'
import stationProfilesService from 'domain/services/station-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'OverviewProfileTruck',
  components: {
    Datepicker,
    ChartLineStation,
    ChartCircleRefund,
    ChartCirclePerson,
    ChartBarAndLineStation,
    VueMonthlyPicker,
    stationProfilesService,
    commonHelper
  },
  props: {
    position: {
      type: String,
      required: true
    }
  },
  data: () => ({
    from: null,
    to: null,
    status: 'month',
    value: '',
    isLog: false,
    range_time: null,
    time_format: null,
    dataSend: {
      from: null,
      to: null
    },
    dataLogCounter: {
      costCounter: 0,
      operationCounter: 0,
      allocationCounter: 0
    },
    counterLog: 0,
    dataLogDetail: [],
    maxTime: null,
    maxId: null,
    isLimit: false,
    limit: 30,
    statusApi1: true,
    channelLog: ''
  }),
  watch: {
    range_time: function (newVal, oldVal) {
      this.getStartEndFromTimeRange()
    },
    status: function (newVal, oldVal) {
      this.from = null
      this.to = null
    },
    dataSend () {
      this.changeTimeRequest()
    },
    isLog () {
      this.changeTimeRequest()
      if (this.isLog) {
        this.getLogDetail()
        document.addEventListener('scroll', this.onScroll)
      } else {
        document.removeEventListener('scroll', this.onScroll)
      }
      this.dataSend = {
        from: this.dataSend.from,
        to: this.dataSend.to,
        viewType: this.status,
        isLog: this.isLog
      }
    }
  },
  computed: {
    sevenDayBefore: () => {
      let d = new Date()
      d.setDate(d.getDate() - 6)
      return moment(d).format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY')
    },
    currentWeek: () => {
      let d = new Date()
      let curDayInWeek = d.getDay()
      let firstInWeek = d.setDate(d.getDate() - curDayInWeek + 1)
      return moment(firstInWeek).format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY')
    },
    lastWeek: () => {
      let d = new Date()
      let curDayInWeek = d.getDay()
      let lastInWeek = d.setDate(d.getDate() - curDayInWeek)
      let firstInWeek = d.setDate(new Date(lastInWeek).getDate() - 6)
      return moment(firstInWeek).format('DD/MM/YYYY') + ' - ' + moment(lastInWeek).format('DD/MM/YYYY')
    },
    thirtyDayBefore: () => {
      let d = new Date()
      d.setDate(d.getDate() - 30)
      return moment(d).format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY')
    },
    lastMonth: () => {
      let d = new Date()
      let month = d.getMonth()
      let lastDay = new Date(d.getFullYear(), month, 0)
      return moment(lastDay).format(`01/MM/YYYY`) + ' - ' + moment(lastDay).format('DD/MM/YYYY')
    },
    default: () => {
      let from = null
      let d = new Date()
      let currentYear = d.getFullYear()
      let currentMonth = d.getMonth() + 1
      let sixMonthBefore = currentMonth - 5
      from = new Date(currentYear, sixMonthBefore, 0)
      if (sixMonthBefore <= 0) {
        sixMonthBefore = 12 + sixMonthBefore
        from = new Date(currentYear - 1, sixMonthBefore, 0)
      }
      return moment(from).format(`DD/MM/YYYY`) + ' - ' + moment().format('DD/MM/YYYY')
    }
  },
  mounted () {
    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      if (modalId === 'modal-profile-time') {
        this.from = null
        this.to = null
      }
    })
  },
  methods: {
    formatDate (date, format = 'DD/MM/YYYY') {
      return commonHelper.formatDate(date, format)
    },
    changeTab (event) {
      this.isLog = event
    },
    reverseFormatDate (date) {
      return date.split('/').reverse().join('-')
    },
    getStartEndFromTimeRange () {
      if (this.$route.query.from && this.$route.query.to) {
        this.time_format = {
          from: this.$route.query.from,
          to: this.$route.query.to
        }
        return true
      }

      if (!this.range_time) {
        this.time_format = {
          from: moment().format('01/MM/YYYY'),
          to: moment().format('DD/MM/YYYY')
        }
        return true
      }
      this.time_format = {
        from: moment(this.range_time.start).format('DD/MM/YYYY'),
        to: moment(this.range_time.end).format('DD/MM/YYYY')
      }
    },
    selectRangeTime (key) {
      switch (key) {
        case 1:
          this.status = 'date'
          this.dataSend = {
            from: this.reverseFormatDate(this.sevenDayBefore.split(' - ')[0]),
            to: this.reverseFormatDate(this.sevenDayBefore.split(' - ')[1]),
            viewType: this.status,
            isLog: this.isLog
          }
          break
        case 2:
          this.status = 'date'
          this.dataSend = {
            from: this.reverseFormatDate(this.thirtyDayBefore.split(' - ')[0]),
            to: this.reverseFormatDate(this.thirtyDayBefore.split(' - ')[1]),
            viewType: this.status,
            isLog: this.isLog
          }
          break
        case 3:
          this.status = 'date'
          this.dataSend = {
            from: this.reverseFormatDate(this.currentWeek.split(' - ')[0]),
            to: this.reverseFormatDate(this.currentWeek.split(' - ')[1]),
            viewType: this.status,
            isLog: this.isLog
          }
          break
        case 4:
          this.status = 'date'
          this.dataSend = {
            from: this.reverseFormatDate(this.lastWeek.split(' - ')[0]),
            to: this.reverseFormatDate(this.lastWeek.split(' - ')[1]),
            viewType: this.status,
            isLog: this.isLog
          }
          break
        case 5:
          this.status = 'date'
          this.dataSend = {
            from: this.reverseFormatDate(this.lastMonth.split(' - ')[0]),
            to: this.reverseFormatDate(this.lastMonth.split(' - ')[1]),
            viewType: this.status,
            isLog: this.isLog
          }
          break
        case 6:
          this.dataSend = {
            from: this.reverseFormatDate(this.default.split(' - ')[0]),
            to: this.reverseFormatDate(this.default.split(' - ')[1]),
            viewType: this.status,
            isLog: this.isLog
          }
          break
      }
    },
    accept () {
      if (!this.from || !this.to) return commonHelper.showMessage('Không được để trống thời gian', 'warning')
      if (moment(this.from).format('YYYY-MM-DD') > moment(this.to).format('YYYY-MM-DD')) {
        return commonHelper.showMessage('Khoảng thời gian không hợp lệ', 'warning')
      }
      this.dataSend = {
        from: moment(this.from).format('YYYY-MM-DD'),
        to: moment(this.to).format('YYYY-MM-DD'),
        viewType: this.status,
        isLog: this.isLog
      }
      this.from = null
      this.to = null
      this.$bvModal.hide('modal-profile-time')
    },
    changeTimeRequest () {
      if (this.isLog) {
        this.getLogCounterStation()
        this.dataLogDetail = []
        this.isLimit = true
        this.maxTime = null
        this.maxId = null
        this.statusApi1 = true
        this.getLogDetail()
      }
    },
    changeChannelLog ($value, typeSpan) {
      if (!document.getElementById(typeSpan).classList.contains('active')) {
        document.getElementById(typeSpan).classList.add('active')
      }
      if (typeSpan !== 'spanAll' && document.getElementById('spanAll').classList.contains('active')) {
        document.getElementById('spanAll').classList.remove('active')
      }
      if (typeSpan !== 'spanCost' && document.getElementById('spanCost').classList.contains('active')) {
        document.getElementById('spanCost').classList.remove('active')
      }
      if (typeSpan !== 'spanOperation' && document.getElementById('spanOperation').classList.contains('active')) {
        document.getElementById('spanOperation').classList.remove('active')
      }
      if (typeSpan !== 'spanAllocation' && document.getElementById('spanAllocation').classList.contains('active')) {
        document.getElementById('spanAllocation').classList.remove('active')
      }
      this.channelLog = $value
      this.dataLogDetail = []
      this.isLimit = true
      this.maxTime = null
      this.maxId = null
      this.statusApi1 = true
      this.getLogDetail()
    },
    getLogCounterStation () {
      let parmas = {
        nStationID: this.$route.params.nStationID,
        start_date: this.dataSend.from,
        end_date: this.dataSend.to
      }
      stationProfilesService.getLogCounterStation(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataLogCounter = res.data.data
            this.counterLog = this.dataLogCounter.operationCounter + this.dataLogCounter.costCounter + this.dataLogCounter.allocationCounter
          } else {
            commonHelper.showMessage('Bạn không có quyền truy cập', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getLogDetail () {
      if (!this.isLimit || !this.statusApi1) {
        return
      }
      let parmas = {
        nStationID: this.$route.params.nStationID,
        start_date: this.dataSend.from,
        end_date: this.dataSend.to,
        max_time: this.maxTime,
        limit: this.limit,
        max_id: this.maxId,
        channel_log: this.channelLog
      }
      this.statusApi1 = false
      stationProfilesService.getLogDetail(parmas)
        .then((res) => {
          if (res.data.success) {
            if (this.maxTime !== res.data.max_time) {
              this.dataLogDetail = this.dataLogDetail.concat(res.data.data)
              this.isLimit = res.data.is_limit
              this.maxTime = res.data.max_time
              this.maxId = res.data.max_id
            }
          } else {
            commonHelper.showMessage('Bạn không có quyền truy cập', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.statusApi1 = true
        })
    },
    getDataLogIncident () {
      this.channelLog = 'issue'
      this.dataLogDetail = []
      this.isLimit = true
      this.maxTime = null
      this.maxId = null
      this.statusApi1 = true
      document.addEventListener('scroll', this.onScroll)
      this.getLogCounterStation()
      this.getLogDetail()
    },
    onScroll () {
      const html = document.querySelector('html')
      const body = document.querySelector('body')
      if ((window.innerHeight + html.scrollTop + 200) >= body.scrollHeight && this.statusApi1 && this.isLimit) {
        this.getLogDetail()
      }
    }
  },
  created () {
    this.getStartEndFromTimeRange()
    this.selectRangeTime(6)
    this.changeTimeRequest()
  }
}
</script>

<style src="@/assets/sass/components/OverviewProfile.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-penalty-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style scoped>
.custom-tab {
  padding: 1px;
  border: 1px solid #828282;
  border-radius: 40px;
}
.log {
  background-color: #00904A;
  color: #FFFFFF;
  border: 2px solid #00904A;
  border-radius: 20px;
  padding-left: 2px;
  padding-right: 2px;
}
.month-picker {
  background-color: white;
  color: black;
  border: 1px solid;
  border-radius: 5px;
}
input[name="green_status"] {
  accent-color: #00904A;
}
.radio-button {
  font-size: 15px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 0px;
}
.display-center {
  display: flex;
  align-items: center;
  text-align: center;
}
.list-wrapper {
  position:relative;
}
.list-item-wrapper {
  display: flex;
  align-items: center;
  position:relative;
}
.list-bullet {
  float:left;
  margin-right:20px;
  background:#14a05b;
  height:5px;
  width:5px;
  border-radius:100px;
  color:white;
  text-align:center;
}
.list-item {
  display:flex;
  align-items: center;
}
.black-line {
  background:#14a05b;
  z-index:3;
  width:1px;
  height:100%;
  position:absolute;
  left:2px;
}
.list-content {
  padding-top: 5px;
  padding-bottom: 5px;
}
.active {
  color: green!important;
}
.tab-choose {
  color: #00904A;
}
</style>
