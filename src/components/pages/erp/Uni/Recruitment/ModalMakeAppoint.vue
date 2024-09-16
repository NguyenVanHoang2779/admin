<template>
  <div class="modal-make-appoint">
    <b-modal id='modal-make-appoint' :title="statuses && statuses[appointmentType] ? statuses[appointmentType].name : ''" size="lg" @shown="initModal" @hide="resetData" static>
      <div v-if="candidate && ['contact', 'expect_join', 'interview'].includes(appointmentType)">
        <form action="" autocomplete="off">
          <b-form-row>
            <b-col md="8">
              <b-form-group label="Ngày hẹn gặp">
                <span slot="label">Ngày hẹn gặp <span class="text-danger">(*)</span></span>
                <datepicker
                    class="dp-fixed-width"
                    v-model="appointmentDate"
                    name="join-date"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="--/--/----"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    :disabled-dates="{ to: expectJoinFrom() }"
                />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group label="Thời gian hẹn gặp (Giờ, phút)">
                <span slot="label">Thời gian hẹn gặp (Giờ, phút) <span class="text-danger" v-show="sendSms">(*)</span></span>
                <b-form-row>
                  <b-col md="6">
                    <b-select placeholder="Giờ" :options="appointmentHourOptions" v-model="appointmentHour"></b-select>
                  </b-col>
                  <b-col md="6">
                    <b-select placeholder="Phút" :options="appointmentMinuteOptions" v-model="appointmentMinute"></b-select>
                  </b-col>
                </b-form-row>
              </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-group
            label-cols-md="12"
            label="Kho hẹn gặp"
            v-if="appointmentType !== 'contact'"
          >
            <span slot="label">Kho hẹn gặp <span class="text-danger">(*)</span></span>
            <single-select-station
              custom-class=""
              :station-id="stationId"
              @select="selectStation"
            ></single-select-station>
          </b-form-group>
          <b-form-group
            label-cols-md="12"
            label="Địa chỉ kho"
            v-if="appointmentType !== 'contact'"
          >
            <span slot="label">Địa chỉ kho <span class="text-danger" v-show="sendSms">(*)</span></span>
            <b-input
              disabled="disabled"
              placeholder="Địa chỉ kho"
              v-model="appointmentStation"
            ></b-input>
          </b-form-group>
        </form>
      </div>
      <b-checkbox
        id="checkbox-send-sms"
        v-model="sendSms"
        name="checkbox-send-sms"
        :value="true"
        :unchecked-value="false"
        class="mb-1"
        v-if="appointmentType !== 'contact'"
      >
        Gửi tin nhắn hẹn {{ appointmentType === 'interview' ? 'phỏng vấn' : 'nhận việc' }} tới ứng viên
      </b-checkbox>
<!--      <b-alert :show="!!sendSms" variant="warning">-->
<!--        <b>Lưu ý: Không thể thay đổi thời gian, địa điểm hẹn gặp khi đã gửi tin nhắn cho ứng viên !</b>-->
<!--      </b-alert>-->
      <div v-if="sendSms && appointmentType !== 'contact'">
        <label for="message-sms" class="font-weight-bold m-2 mb-3">Xem trước nội dung tin nhắn </label>
        <div id="message-sms">
          <div v-loading="!convertedMessage[0] || !convertedMessage[1]">
            {{convertedMessage[0]}}
            <a :href="this.linkGoogleMap + this.stationLat + ',' + this.stationLng">{{ this.linkGoogleMap + this.stationLat + ',' + this.stationLng }}</a>
            <br><br>
            {{convertedMessage[1]}}
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="w-100 text-center">
        <b-btn variant="success" id='modal-make-appoint-btn-update' name='modal-make-appoint-btn-update' @click="sendSmsToCandidate"><i class="fas fa-paper-plane" v-show="!!sendSms"></i> {{textActionSave}}</b-btn>
      </div>
    </b-modal>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<style lang="scss" scoped>
.modal-make-appoint {
  #message-sms {
    border: 1px solid rgba(24, 28, 33, 0.1);
    border-radius: 0.25rem;
    background-color: #FFF8E1;
    opacity: 1;
    min-height: 6rem;
    overflow: auto;
    resize: vertical;
    padding: 0.438rem 0.875rem;
  }
  .session-radio >>> .custom-control-label::before {
    top: 0;
  }
}
</style>

<script>
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'
import dateHelper from 'infrastructures/helpers/date'

import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
// service
import stationService from 'domain/services/station-service'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
import { mapGetters } from 'vuex'
import commonHelpers from '../../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'ModalMakeAppoint',

  components: {
    SingleSelectStation,
    Datepicker,
    flatPickr
  },

  props: {
    candidate: {
      type: Object,
      default: _ => ({})
    },
    textActionSave: {
      type: String,
      default: _ => ('Lưu thông tin')
    },
    nextStatus: {
      type: String
    },
    appointmentType: {
      type: String,
      default: ''
    }
  },

  data: _ => ({
    appointmentDate: null,
    appointmentHour: null,
    appointmentMinute: null,
    appointmentTime: null,
    appointmentStation: null,
    messageSms: '',
    stationId: null,
    stationName: null,
    stationLat: null,
    stationLng: null,
    sendSms: false,
    dataCandidate: null,
    appointmentHourOptions: [],
    appointmentMinuteOptions: dateHelper.getListMinuteOptions(),
    linkGoogleMap: 'https://www.google.com/maps?q=',

    statuses: {
      contact: {
        id: 'contact',
        name: 'Cần liên hệ',
        sendSmsSuccessMsg: 'Cập nhật thời gian cần liên hệ thành công',
        sendSmsFailMsg: 'Cập nhật thời gian cần liên hệ thất bại'
      },
      interview: {
        id: 'interview',
        name: 'Hẹn phỏng vấn',
        sendSmsSuccessMsg: 'Gửi tin nhắn đến ứng viên thành công',
        sendSmsFailMsg: 'Không gửi được tin nhắn đến ứng viên !'
      },
      expect_join: {
        id: 'expect_join',
        name: 'Hẹn nhận việc',
        sendSmsSuccessMsg: 'Cập nhật thời gian hẹn nhận việc thành công',
        sendSmsFailMsg: 'Cập nhật thời gian hẹn nhận việc thất bại'
      }
    },

    mapAppointmentType: {
      contact: 'expected_contact',
      interview: 'expected_interview',
      expect_join: 'expected_join'
    }
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),
    convertedMessage: function () {
      const date = this.appointmentDate ? commonHelpers.format_date(this.appointmentDate, 'DD-MM-YYYY') : ''
      const time = this.appointmentTime ? this.appointmentTime : ''
      const station = this.stationId ? this.stationName : ''
      const address = this.appointmentStation ? this.appointmentStation : ''
      let sms = commonHelpers.removeVietnameseAccent(this.messageSms
        .replace(':date', date)
        .replace(':time', time)
        .replace(':station', station)
        .replace(':address', address))
      const [addressSms, smsPrepare] = sms.split(':link_map.')
      return [
        addressSms,
        smsPrepare
      ]
    }
  },

  watch: {
    candidate: {
      immediate: true,
      handler () {
        this.dataCandidate = Object.assign({}, this.candidate)
      }
    },
    // dataCandidate: {
    //   immediate: true,
    //   handler () {
    //     if (this.dataCandidate) {
    //       this.stationId = this.curUser && this.curUser.Station && this.curUser.Station.id
    //     }
    //   }
    // },

    appointmentHour (newVal, oldVal) {
      if (newVal) {
        this.appointmentTime = `${newVal}h${this.appointmentMinute}`
      }
    },

    appointmentMinute (newVal, oldVal) {
      if (newVal) {
        this.appointmentTime = `${this.appointmentHour}h${newVal}`
      }
    }
  },

  created () {
    this.appointmentHourOptions = this.getAppointmentHourOptions()
    if (this.candidate) {
      this.dataCandidate = Object.assign({}, this.candidate)
    }
  },

  methods: {
    async fetchDataAppointment () {
      let data = {
        candidate_id: this.candidate.id,
        type: this.mapAppointmentType[this.appointmentType]
      }
      const response = await recruitmentService.getSchedule(data)
      if (response.data.success) {
        data = response.data.data
        this.stationId = data.station_id ? data.station_id : null
        this.appointmentDate = data.appointment_date ? data.appointment_date : ''
        this.appointmentHour = data.appointment_hour ? data.appointment_hour : ''
        this.appointmentMinute = data.appointment_minute ? data.appointment_minute : ''
        this.messageSms = data.message
      } else {
        this.stationId = this.dataCandidate.station_id
        console.log(response.data.message || 'Không lấy được job')
      }
      this.createStationInfo()
    },

    initModal () {
      this.fetchDataAppointment()
    },

    setAppointTime (strTime) {
      if (strTime) {
        let timeArr = strTime.split('h')
        if (timeArr.length === 2) {
          this.appointmentHour = timeArr[0]
          this.appointmentMinute = timeArr[1]
        }
      }
    },

    getAppointmentHourOptions () {
      return dateHelper.getListHourOptions().filter((option) => {
        let hourValue = parseInt(option.value)
        return [8, 9, 10, 11, 14, 15, 16, 17].includes(hourValue)
      })
    },

    validateFromSendSmsToCandidate () {
      if (!this.appointmentDate) {
        alert('Vui lòng nhập ngày hẹn gặp !')
        return false
      }
      if (!this.appointmentHour) {
        alert('Vui lòng nhập giờ hẹn gặp !')
        return false
      }
      if (!this.appointmentMinute) {
        alert('Vui lòng nhập phút hẹn gặp !')
        return false
      }
      if (!this.appointmentTime) {
        alert('Vui lòng nhập đầy đủ khoảng thời gian có thể hẹn gặp !')
        return false
      }
      if (!this.stationId && this.appointmentType !== 'contact') {
        alert('Vui lòng chọn kho hẹn gặp !')
        return false
      }
      if (this.sendSms) {
        if (!this.appointmentStation) {
          alert('Vui lòng nhập địa điểm hẹn gặp !')
          return false
        }
        if (!this.appointmentTime) {
          alert('Vui lòng nhập giờ hẹn gặp !')
          return false
        }
      }
      return true
    },

    formatDateToString (date) {
      const year = date.toLocaleString('default', {year: 'numeric'})
      const month = date.toLocaleString('default', {month: '2-digit'})
      const day = date.toLocaleString('default', {day: '2-digit'})

      return [year, month, day].join('-')
    },

    sendSmsToCandidate () {
      if (!this.validateFromSendSmsToCandidate()) {
        return false
      }
      let data = {
        candidate_id: this.dataCandidate.id
      }

      data.appointment_date = this.appointmentDate
      data.appointment_time = commonHelpers.format_date(this.appointmentDate) + ' ' + `${this.appointmentHour}:${this.appointmentMinute}`
      data.send_message = this.sendSms ? this.sendSms : 0
      data.station_id = this.stationId
      if (this.appointmentType === 'contact') {
        data.type = 'expected_contact'
      } else if (this.appointmentType === 'interview') {
        data.type = 'expected_interview'
      } else {
        data.type = 'expected_join'
      }

      recruitmentService.createSchedule(data)
        .then(res => {
          if (res.data.success) {
            this.$emit('updateAppointmentOk')
            helper.showMessage(
              res.data.message || (this.statuses[this.appointmentType].sendSmsSuccessMsg),
              'success'
            )
            this.closeModal()
          } else {
            helper.showMessage(
              res.data.message || (this.statuses[this.appointmentType].sendSmsFailMsg),
              'warning'
            )
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra !', 'warning')
        })
    },

    expectJoinFrom () {
      let today = new Date()
      today.setDate(today.getDate() - 1)
      return today
    },

    selectStation (station) {
      if (!station || !station.id) {
        this.appointmentStation = null
        this.stationId = null
        this.stationName = null
        this.stationLat = null
        this.stationLng = null
        return
      }
      this.stationId = station.id
      this.createStationInfo()
    },

    createStationInfo () {
      if (this.stationId) {
        stationService.getStationInfo({ station_id: this.stationId })
          .then(res => {
            if (res.data.success) {
              this.appointmentStation = res.data.data.address
              this.stationName = res.data.data.name
              this.stationLat = res.data.data.lat
              this.stationLng = res.data.data.lng
            } else {
              this.appointmentStation = null
              this.stationName = null
              this.stationLat = null
              this.stationLng = null
            }
          })
          .catch(e => {
            this.appointmentStation = null
            this.stationName = null
            this.stationLat = null
            this.stationLng = null
          })
      }
    },

    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },

    closeModal () {
      this.$bvModal.hide(this.id)
      this.resetData()
    },

    resetData () {
      this.$emit('closeModal')
      this.appointmentHour = null
      this.appointmentMinute = null
      this.appointmentTime = null
      this.appointmentStation = null
      this.appointmentDate = null
      this.sendSms = null
    }
  }
}
</script>
