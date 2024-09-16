<template>
  <div class="fcDetailWorkShift">
    <div class="modal-content overflow-hidden" v-loading="loading">
      <div class="modal-header border-bottom-grey bg-white text-dark">
        <h4 class="modal-title">Chi tiết chấm công /
          <span class="group">{{ currentUser.position_job }}</span> /
          <span class="fullname">{{ currentUser.fullName }}</span> /
          <span>
                    {{ currentUser.workTypeDes }}
                    </span>
          <span class="time-range">
                          ( Từ <span class="range-from">{{ formatDate(from, 'DD/MM/YYYY') }}</span> đến
                        <span class="range-to">{{ formatDate(to, 'DD/MM/YYYY') }}</span> )
                    </span>
        </h4>
        <button type="button" class="btn text-dark bg-white" @click="$bvModal.hide('modal-checkin-calendar')">x</button>
      </div>
      <div class="modal-body rounded">
        <div class="row">
          <div class="col-md-4 border-grey p-3 m-2 rounded aui-panel" id="workshift-statistics">
            <ul>
              <li>Công đã chấm: <b>{{ statistics.approved.total}}<span
                v-if="currentUser.work_type =='by_hours'">h</span><span v-else> công</span>
                <span v-if="currentUser.work_type !='by_hours' && !(null===statistics.required_workshift)"> / {{ statistics.required_workshift }}  công chuẩn </span>
              </b>
              </li>
              <ul style="margin-top:0px;">
                <li class="" v-if="currentUser.work_type !='by_hours'"> Công thường (Đã duyệt / Chờ duyệt):
                  <b>{{ statistics.approved.normal }}</b>
                  / <b>{{ statistics.pending.normal }}</b>
                </li>
                <li v-if="currentUser.work_type != 'by_hours'" class=""> Công xoay ca (Đã duyệt / Chờ duyệt):
                  <b>{{ statistics.approved.round_robin }}</b>/<b>{{ statistics.pending.round_robin }}</b>
                </li>
                <li v-if="currentUser.work_type != 'by_hours'" class="">
                  Công tăng ca thường (Đã duyệt / Chờ duyệt):
                  <b>{{ statistics.approved.over_time }} / {{ statistics.pending.over_time }}</b>
                  - <span style="font-size: 11px; font-style: italic"> Đã quy đổi công thường</span>
                </li>
              </ul>
              <li v-if="statistics.approved.holiday_over_time != 0 || statistics.pending.holiday_over_time != 0"
                  class="">
                Công tăng ca ngày lễ (Đã duyệt / Chờ duyệt):
                <b>{{ statistics.approved.holiday_over_time }} / {{ statistics.pending.holiday_over_time }}</b>
              </li>
              <li v-if="statistics.approved.holiday != 0">
                <b>Công nghỉ lễ : {{ statistics.holiday }}</b> ( Ngày {{ statistics.list_holiday }} )
              </li>
              <li class="">
                Xin nghỉ có lương (Đã duyệt / Chờ duyệt):
                <b>{{ statistics.approved.on_leave }}</b> / <b>{{ statistics.pending.on_leave }}</b>
              </li>
              <li class="">
                Xin nghỉ không lương (Đã duyệt / Chờ duyệt):
                <b>{{ statistics.approved.on_leave_no_sal }}</b> / <b>{{ statistics.pending.on_leave_no_sal }}</b>
              </li>
            </ul>
          </div>
          <div class="col-md-5 border-grey p-3 m-2 rounded aui-panel" id="history-update-worktype">
            <ul>
              <li>Loại hình công việc hiện tại: <b>{{ currentUser.work_type_desc }}</b></li>
              <li>Lịch sử cập nhật loại hình làm việc:
                <ul>
                  <li v-for="(workType, key) in currentUser.historyWorkType" :key="key" class="">
                    <span class="created">{{ workType.modified }}</span>, cập nhật thành <b><span class="work-type">{{workType.work_type}}</span></b>
                    <span class="shift" v-if="workType.shift"><b>/{{workType.shift}}</b></span>
                    <span class="user-modified" v-if="workType.modified_by">bởi  {{workType.group}} <b>{{ workType.modified_by }}</b></span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="aui-panel" id='calendar_popup' v-loading="loadingCalendar">
          <FullCalendar
            :options="calendarOptions"
          ></FullCalendar>
        </div>
      </div>
    </div>
    <modal-update-checkin
      ref="modalUpdateChecking"
      :modal-update-checkin-id="updateCheckinModal"
      @checkinId="handleCheckinId"
      @type="handleType"
      @reloadCalendar="handleReloadCalendar"
      :checkin-id.sync="curCheckinLogId"
      :type="type"
      :date-picked="pickedDate"
      :history-modal-id="'checkin-history-modal'"
      :user-id="currentUser.id"
      @getHistories="getHistories"
      :histories="workshiftActivities"
    ></modal-update-checkin>
  </div>
</template>

<script>
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import checkinManageService from 'domain/services/checkin-manage-service'
import userService from 'domain/services/user-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import ModalUpdateCheckin from './ModalUpdateCheckin'
import moment from 'moment'
export default {
  name: 'detail-work-shift',

  components: {
    FullCalendar,
    ModalUpdateCheckin
  },

  data () {
    return {
      loading: false,
      loadingCalendar: false,
      updateCheckinModal: 'edit-checkin-log',
      curCheckinLogId: null,
      type: null,
      currentUser: {
        id: null,
        department: null,
        historyWorkType: [],
        workType: null,
        workTypeDes: null,
        position_job: null,
        fullName: null,
        stationId: null
      },
      statistics: {
        approved: {
          over_time: null,
          holiday: null,
          on_leave_no_sal: null,
          on_leave: null,
          holiday_over_time: null,
          normal: null,
          round_robin: null,
          total: null
        },
        pending: {
          on_leave_no_sal: null,
          holiday_over_time: null,
          over_time: null,
          round_robin: null,
          normal: null
        },
        list_holiday: null,
        holiday: null,
        required_workshift: null,
        from: null,
        to: null
      },
      pickedDate: null,
      from: null,
      to: null,
      calendarOptions: {
        plugins: [
          dayGridPlugin, interactionPlugin
        ],
        initialView: 'dayGridMonth',
        dayCellDidMount: this.buttonAddRender,
        validRange: this.validRange,
        headerToolbar: {
          left: 'title',
          center: '',
          right: 'prev next'
        },
        firstDay: 1,
        locale: 'vi',
        selectable: false,
        height: 'auto',
        slotEventOverlap: false,
        events: [],
        weekends: true,
        eventContent: this.eventContent,
        showNonCurrentDates: false
      },
      workshiftActivities: []
    }
  },
  props: {
    userId: {
      default: null
    },
    shiftRange: { }
  },
  watch: {
    shiftRange: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal && newVal.from && newVal.to) {
          this.from = this.formatDate(moment(newVal.from))
          this.to = this.formatDate(moment(newVal.to).add(1, 'days'))
          this.getInforUser()
        }
      }
    }
  },

  mounted () {
    if (!this.userId) this.getInforUser()
  },

  methods: {
    validRange: function (arg) {
      return {
        start: this.from,
        end: this.to
      }
    },
    eventContent: function (arg) {
      let eventObj = arg.event
      if (!eventObj.title) return ''
      let event = JSON.parse(eventObj.title)
      let instance = this
      let checkDate = moment(event.day_on).format('YYYY-MM-DD')
      this.renderBtnAdd(instance, checkDate)

      let status = ''
      switch (event.status) {
        case 'pending' :
          status = '<span class="status"> / ' + event.text_status + '</span>'
          break
        case 'approved':
          status = '<span class="approved status"> / ' + event.text_status + '</span>'
          break
        case 'rejected':
          status = '<span class="rejected status"> / ' + event.text_status + '</span>'
          break
        case 'rejected_by_autojob':
          status = '<span class="rejected status"> / ' + event.text_status + '</span>'
          break
        default:
          status = ''
      }
      let textShift = ''
      if (event.id) {
        if (this.currentUser.work_type === 'by_hours') {
          textShift += event.hours + 'h'
        } else {
          textShift = event.text_shift ? (event.text_shift.includes('Tăng ca') ? event.text_shift.replace('Tăng ca - ', '') : (event.text_shift.includes('- Nhóm theo giờ')
            ? event.text_shift.replace('- Nhóm theo giờ', '') : event.text_shift)) : 'Chưa xác định'
        }
      }
      let shift = event.id ? `<span class="text_shift_on" style="max-width: 100px; width: inherit; padding-right: 2px; padding-left: 2px; text-align: center;
      ${this.currentUser.work_type === 'by_hours' ? 'min-width: 35px;' : 'min-width: 50px;'}` +
        '"> ' + textShift + '</span>' : ''
      let title = event.id ? event.title : (event.day_type === 'normal' ? 'Không có dữ liệu chấm công' : 'Ngày nghỉ')
      let classStatus = 'pending-request'
      let eventHtml = '<div id="event-cal-' + Math.ceil(Math.random(50) * 10) + '" class="' + classStatus + ' edit-event cursor-pointer fc-day-grid-event fc-h-event fc-start fc-end" ' + '" style="background-color:' + event.color + ';' + 'border-color:' + event.color + ';' + 'display:' + (event.display ? `none ` : ``) + '">' + '<span class="fc-content text-white" style="display: flex; align-items: center; flex-wrap: wrap">' + shift + '<span class="fc-title">' + title + '</span>' + status + '</span>' + '</div>'
      let eventDom = new DOMParser().parseFromString(eventHtml, 'text/html').documentElement
      eventDom.onclick = function () {
        instance.editCheckinLog(event.id, eventObj.startStr)
      }
      return {domNodes: [eventDom]}
    },
    renderBtnAdd (instance, checkDate) {
      let tdDay = document.querySelectorAll("[data-date='" + checkDate + "']")
      let tdDayTop = document.querySelectorAll("[data-date='" + checkDate + "'] > div > .fc-daygrid-day-top ")
      if (tdDay[0] && tdDayTop[0]) {
        let span = document.createElement('SPAN')
        span.classList.add('add-checkin-log')
        span.onclick = function () {
          instance.editCheckinLog(null, checkDate)
        }
        span.innerHTML = '+'
        span.style.visibility = 'hidden'
        tdDayTop[0].append(span)

        tdDay[0].onmouseover = function () {
          let addBtn = document.querySelectorAll("[data-date='" + checkDate + "'] > div > .fc-daygrid-day-top > .add-checkin-log")
          for (let k = 0; k < addBtn.length; k++) {
            addBtn[k].style.visibility = 'visible'
          }
        }
        tdDay[0].onmouseleave = function () {
          let addBtn = document.querySelectorAll("[data-date='" + checkDate + "'] > div > .fc-daygrid-day-top > .add-checkin-log")
          for (let k = 0; k < addBtn.length; k++) {
            addBtn[k].style.visibility = 'hidden'
          }
        }
      }
    },

    buttonAddRender: function (info) {
      let instance = this
      let checkDate = moment(info.date).format('YYYY-MM-DD')
      let tdDay = document.querySelectorAll("[data-date='" + checkDate + "']")
      let tdDayTop = document.querySelectorAll("[data-date='" + checkDate + "'] > div > .fc-daygrid-day-top ")
      if (tdDay[0] && tdDayTop[0]) {
        let span = document.createElement('SPAN')
        span.classList.add('add-checkin-log')
        span.onclick = function () {
          instance.editCheckinLog(null, checkDate)
        }
        span.innerHTML = '+'
        span.style.visibility = 'hidden'
        tdDayTop[0].append(span)

        tdDay[0].onmouseover = function () {
          let addBtn = document.querySelectorAll("[data-date='" + checkDate + "'] > div > .fc-daygrid-day-top > .add-checkin-log")
          for (let k = 0; k < addBtn.length; k++) {
            addBtn[k].style.visibility = 'visible'
          }
        }
        tdDay[0].onmouseleave = function () {
          let addBtn = document.querySelectorAll("[data-date='" + checkDate + "'] > div > .fc-daygrid-day-top > .add-checkin-log")
          for (let k = 0; k < addBtn.length; k++) {
            addBtn[k].style.visibility = 'hidden'
          }
        }
      }
    },
    validCalendarRange: function (curDate) {
      return {start: this.from, end: this.to}
    },

    editCheckinLog (id, pickedDate) {
      this.curCheckinLogId = id
      this.type = this.curCheckinLogId ? 'edit' : 'create'
      this.pickedDate = moment(pickedDate).format('YYYY-MM-DD')
      this.$bvModal.show(this.updateCheckinModal)
    },

    handleCheckinId (newVal) {
      this.curCheckinLogId = newVal
    },

    handleType (newVal) {
      this.type = newVal
    },

    handleReloadCalendar (newVal) {
      this.$emit('reloadPage', true)
      if (newVal) this.getInforUser()
    },

    formatCheckinData (data) {
      data.forEach(function (checkin, idx, arr) {
        const checkinFormat = checkin
        if (!checkin.id && (new Date(checkin.day_on) > new Date() || checkin.day_type === 'sunday_off' || checkin.day_type === 'normal')) {
          checkinFormat.color = 'transparent'
          checkinFormat.display = 'none'
        } else if (!checkin.id && checkin.day_type !== 'normal') {
          checkinFormat.color = '#8c8586'
        } else {
          checkinFormat.color = checkin.status === 'approved' ? '#088a4bc2' : (checkin.status === 'pending' ? '#8c8586' : '#c41626')
        }
        checkinFormat.start = checkin.start
        checkinFormat.title = checkin.on_leave ? 'Xin nghỉ' : checkin.text_checkin_type
        checkinFormat.type = checkin.text_checkin_type
        checkinFormat.text_day_type = checkin.text_day_type
        arr[idx] = {
          color: checkinFormat.color,
          id: checkin.id,
          start: new Date(checkin.day_on),
          end: new Date(checkin.day_on),
          allDay: true,
          title: JSON.stringify(checkinFormat)
        }
      })
      return data
    },

    getInforUser () {
      this.loading = true
      let params = {
        user_id: this.userId
      }
      userService.getUserDetailInfo(params)
        .then(res => {
          if (res.data.success) {
            let userInfo = res.data.userInfo
            this.currentUser.fullName = userInfo.fullName
            this.currentUser.position_job = userInfo.positionName
            this.currentUser.department = userInfo.departmentName
            this.currentUser.workType = userInfo.workType
            this.currentUser.workTypeDes = userInfo.workTypeDes
            this.currentUser.id = userInfo.userId
            this.currentUser.stationId = userInfo.station
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu người dùng!', 'warning')
          }
        })
        .then(() => {
          this.getDataCalendarForUser()
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },

    getDataCalendarForUser () {
      let params = {
        user_id: this.currentUser.id,
        from: this.from,
        to: this.to
      }
      this.loadingCalendar = true
      checkinManageService.getDataCalendarForUser(params)
        .then(res => {
          if (res.data.success) {
            this.currentUser.historyWorkType = res.data.history_update_worktype
            this.statistics = res.data.statistics.approved ? res.data.statistics : this.statistics
            this.calendarOptions.events = this.formatCheckinData(res.data.data)
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu chấm công!', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loadingCalendar = false
        })
    },

    formatDate (date, format = 'YYYY-MM-DD') {
      return commonHelper.formatDate(date, format)
    },

    getHistories (checkinId) {
      checkinManageService.getActivitiesOfCheckinLog({
        checkin_id: checkinId,
        from: this.formatDate(this.shiftRange.from),
        to: this.formatDate(this.shiftRange.to)
      })
        .then(res => {
          if (res.data.success) {
            this.workshiftActivities = commonHelper.cloneDeep(res.data.data)
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu lịch sử duyệt công!', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
    }
  }
}
</script>
<style src="@/assets/sass/components/sgw-checkin-manage.scss" lang="scss"></style>
<style lang="scss" scoped>
.aui-panel {
  border: 1px solid #ccc;
  border-radius: 6px;
  display: block;
  margin: 10px 0;
  padding: 12px;
  position: relative;
}
</style>
