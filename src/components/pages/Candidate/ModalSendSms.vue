<template>
  <div>
      <b-modal :id="id" :title="appointmentType === 'interview' ? 'Hẹn phỏng vấn': 'Hẹn nhận việc'" size="lg" @hidden="resetData" static>
        <div v-if="candidate && ['expect_join', 'interview'].includes(appointmentType)">
          <form action="" autocomplete="off">
          <b-form-row>
            <b-col md="6">
            <b-form-group
              label="Ngày hẹn gặp"
            >
              <span slot="label">Ngày hẹn gặp <span class="text-danger">(*)</span></span>
              <datepicker class="dp-fixed-width"
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
            <b-col md="6">
            <b-form-group
              label="Giờ hẹn gặp"
            >
              <span slot="label">Giờ hẹn gặp <span class="text-danger" v-show="sendSms">(*)</span></span>
              <b-input-group>
                <b-form-radio-group
                  id="radio-time-appointment"
                  v-model="appointmentSession"
                  name="radio-time-appointment"
                  class="ml-2"
                >
                  <b-form-radio value="1" class="d-inline session-radio">
                    Sáng
                    <b-select :options="morningTime" v-model="appointmentTime" class="d-inline mr-2"></b-select>
                  </b-form-radio>
                  <b-form-radio value="2" class="d-inline">
                    Chiều
                    <b-select :options="afternoonTime" v-model="appointmentTime" class="d-inline"></b-select>
                  </b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-group
            label-cols-md="12"
            label="Kho hẹn gặp"
          >
            <span slot="label">Kho hẹn gặp <span class="text-danger">(*)</span></span>
            <single-select-station
              custom-class=""
              :station-id="stationId"
              @handleSelectedStation="selectStation"
            ></single-select-station>
          </b-form-group>
          <b-form-group
            label-cols-md="12"
            label="Địa chỉ kho"
          >
            <span slot="label">Địa chỉ kho <span class="text-danger" v-show="sendSms">(*)</span></span>
            <b-input
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
        >
          Gửi tin nhắn hẹn {{ appointmentType === 'interview' ? 'phỏng vấn' : 'nhận việc' }} tới ứng viên
        </b-checkbox>
        <b-alert :show="!!sendSms" variant="warning">
          <b>Lưu ý: Không thể thay đổi thời gian, địa điểm hẹn gặp khi đã gửi tin nhắn cho ứng viên !</b>
        </b-alert>
        <div v-if="sendSms">
          <label for="message-sms" class="font-weight-bold">Preview nội dung tin nhắn</label>
          <div id="message-sms">
            <div v-if="candidate">
                <span v-if="['expect_join', 'interview'].includes(appointmentType)">
                  GHTK {{ appointmentType === 'interview' ? 'mời' : 'chúc mừng' }} Bạn {{ appointmentType === 'interview' ? 'đến phỏng vấn' : 'đã trúng tuyển' }}
                  {{ candidate.job_name && ('vị trí ' + candidate.job_name) }}
                  . Vui lòng <span v-if="+candidate.job_id < 4">cập nhật hồ sơ tại <a href="#">Link</a> và</span>
                  chuẩn bị CMND/CCCD và Sổ hộ khẩu (photo công chứng). Thời gian hẹn gặp
                  {{ appointmentTime && ('vào lúc ' + appointmentTime + 'h') }}
                  <!-- {{ expectJoinTimeTo && (' - ' + expectJoinTimeTo + 'h') }} -->
                  {{ appointmentDate && (' ngày ' + formatDate(appointmentDate, 'DD.MM.YYYY')) }}
                  <span v-if="stationId">{{' tại kho ' + stationName + (appointmentStation ? (', ' + appointmentStation) : '') }}</span>
                  {{ this.curUser && this.curUser.MasterProfile && this.curUser.MasterProfile.tel && ('. Liên hệ: ' + this.curUser.MasterProfile.tel) }}
                </span>
                <span v-if="appointmentType === 'contact_fail'">
                  GHTK đã nhận được thông tin ứng tuyển {{ this.candidate.job_name && ('vị trí ' + this.candidate.job_name)}} của bạn nhưng không liên hệ được với bạn. Vui lòng để ý điện thoại
                  {{ this.curUser && this.curUser.MasterProfile && this.curUser.MasterProfile.tel && (' hoặc liên lạc lại ' + this.curUser.MasterProfile.tel + ' để trao đổi công việc.') }}
                </span>
            </div>
          </div>
        </div>
        <div slot="modal-footer" class="w-100 text-center">
          <b-btn variant="success" @click="sendSmsToCandidate"><i class="fas fa-paper-plane" v-show="!!sendSms"></i> Cập nhật thông tin</b-btn>
        </div>
      </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="css" scoped>
  #message-sms {
    border: 1px solid rgba(24, 28, 33, 0.1);
    border-radius: 0.25rem;
    background-color: #f1f1f2;
    opacity: 1;
    min-height: 6rem;
    overflow: auto;
    resize: vertical;
    padding: 0.438rem 0.875rem;
  }
  .session-radio >>> .custom-control-label::before {
    top: 0;
  }
</style>

<script>
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'

import Datepicker from 'vuejs-datepicker'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
// service
import stationService from 'domain/services/station-service'
import candidateService from 'domain/services/candidate-service'

import { mapGetters } from 'vuex'

export default {
  name: 'modal-send-sms',

  components: {
    SingleSelectStation,
    Datepicker
  },

  props: {
    id: {
      type: String,
      default: 'modal-send-sms'
    },
    candidate: {
      type: Object,
      default: _ => ({})
    },
    nextStatus: {
      type: String
    }
  },

  data: _ => ({
    appointmentDate: null,
    appointmentSession: null,
    appointmentTime: null,
    // expectJoinTimeTo: null,
    appointmentStation: null,
    stationId: null,
    stationName: null,
    sendSms: false,
    morningTime: [
      { value: 8, text: '8h' },
      { value: 9, text: '9h' },
      { value: 10, text: '10h' },
      { value: 11, text: '11h' }
    ],
    afternoonTime: [
      { value: 14, text: '14h' },
      { value: 15, text: '15h' },
      { value: 16, text: '16h' },
      { value: 17, text: '17h' }
    ]
  }),

  created () {
  },

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),

    appointmentType () {
      if (this.nextStatus) return this.nextStatus
      return this.candidate.status
    }

  },

  watch: {
    candidate: {
      immediate: true,
      handler () {
        if (this.candidate.status === 'expect_join') this.appointmentDate = this.candidate.expected_join_date
        else if (this.candidate.status === 'interview') this.appointmentDate = this.candidate.expected_interview_date
        else this.appointmentDate = null
        this.stationId = this.curUser && this.curUser.Station && this.curUser.Station.id
      }
    },

    appointmentTime (newVal, oldVal) {
      if (!newVal) this.appointmentSession = null
      else if (+newVal < 12) this.appointmentSession = 1
      else this.appointmentSession = 2
    },

    appointmentSession (newVal, oldVal) {
      if (+newVal === 1) {
        if (!this.appointmentTime || this.appointmentTime > 12) this.appointmentTime = 8
        return
      }
      if (+newVal === 2) {
        if (!this.appointmentTime || this.appointmentTime < 12) this.appointmentTime = 14
        return
      }
      this.appointmentTime = null
    }
  },

  methods: {
    sendSmsToCandidate () {
      let data = {
        candidate_id: this.candidate.id
      }
      if (!this.appointmentDate) {
        alert('Vui lòng nhập ngày hẹn gặp !')
        return
      }
      if (!this.appointmentTime) {
        alert('Vui lòng nhập đầy đủ khoảng thời gian có thể hẹn gặp !')
        return
      }
      if (!this.stationId) {
        alert('Vui lòng chọn kho hẹn gặp !')
        return
      }
      if (this.sendSms) {
        if (!this.appointmentStation) {
          alert('Vui lòng nhập địa điểm hẹn gặp !')
          return
        }
        if (!this.appointmentTime) {
          alert('Vui lòng nhập giờ hẹn gặp !')
          return
        }
      }
      data.appointment_date = this.appointmentDate
      data.appointment_time = this.appointmentTime + 'h'
      data.appointment_station = this.appointmentStation
      data.sendSms = this.sendSms
      data.stationId = this.stationId
      data.stationName = this.stationName
      data.nextStatus = this.nextStatus

      candidateService.sendSmsToCandidate(data)
        .then(res => {
          if (res.data.success) {
            this.$emit('updateAppointmentOk', data)
            helper.showMessage(
              res.data.message || (this.appointmentType === 'interview' ? 'Cập nhật thời gian hẹn nhận việc thành công' : 'Gửi tin nhắn đến ứng viên thành công'),
              'success'
            )
            // Cập nhật lại trạng thái gửi sms
            if (this.sendSms && res.data.sendSmsSuccess) this.$set(this.candidate, 'sentSms', this.appointmentType)
            // update log và ngày hẹn gặp
            if (['expect_join', 'interview'].includes(this.appointmentType)) {
              if (this.appointmentType === 'expect_join') this.candidate.expected_join_date = this.appointmentDate
              if (this.appointmentType === 'interview') this.candidate.expected_interview_date = this.appointmentDate
              if (res.data.data.log) this.candidate.logs.push(res.data.data.log)
            }
            this.$bvModal.hide(this.id)
          } else {
            helper.showMessage(
              res.data.message || (this.appointmentType === 'interview' ? 'Cập nhật thời gian hẹn nhận việc thất bại' : 'Không gửi được tin nhắn đến ứng viên !'),
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
        return
      }
      this.stationId = station.id
      stationService.getStationInfo({ station_id: station.id })
        .then(res => {
          if (res.data.success) {
            this.appointmentStation = res.data.data.address
            this.stationName = res.data.data.name
          } else {
            this.appointmentStation = null
            this.stationName = null
          }
        })
        .catch(e => {
          this.appointmentStation = null
          this.stationName = null
        })
    },

    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },

    resetData () {
      this.appointmentTime = null
      this.appointmentSession = null
      // this.expectJoinTimeTo = null
      this.sendSms = null
    }
  }
}
</script>
