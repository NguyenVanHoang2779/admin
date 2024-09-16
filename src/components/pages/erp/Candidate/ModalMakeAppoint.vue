<template>
    <div class="modal-make-appoint">
        <b-modal id='modal-make-appoint' :title="statuses && statuses[appointmentType] ? statuses[appointmentType].name : ''" size="lg" @shown="initModal" @hide="resetData" static>
            <div v-if="candidate && ['contact', 'expect_join', 'interview'].includes(appointmentType)">
                <form action="" autocomplete="off">
                    <b-form-row>
                      <b-col md="8">
                        <b-form-group label="Ngày hẹn gặp">
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
            <b-alert :show="!!sendSms" variant="warning">
                <b>Lưu ý: Không thể thay đổi thời gian, địa điểm hẹn gặp khi đã gửi tin nhắn cho ứng viên !</b>
            </b-alert>
            <div v-if="sendSms && appointmentType !== 'contact'">
                <label for="message-sms" class="font-weight-bold">Preview nội dung tin nhắn</label>
                <div id="message-sms">
                    <div v-if="candidate">
                        <span v-if="appointmentType === 'expect_join' && getJobType(candidate.recruitment_channel, candidate.job_id, (currentJobDriverXData ? currentJobDriverXData.job_type : null)) === jobTypes.ANOTHER">
                            GHTK chúc mừng bạn đã trúng tuyển vị trí {{getJobName(currentJobDriverXData, candidate)}} <span v-if="stationId">{{' tại Kho: ' + stationName + '.' }}</span>{{(appointmentStation ? (' Đ/c: ' + appointmentStation) : '') }}. Vui lòng chuẩn bị CMND/CCCD và Sổ hộ khẩu (photo công chứng).{{ appointmentTime && (' Nhận việc vào lúc ' + appointmentTime) }} {{ appointmentDate && (' ngày ' + formatDate(appointmentDate, 'DD.MM.YYYY') + '.') }} {{this.curUser && this.curUser.MasterProfile && this.curUser.MasterProfile.tel && (' Mọi thắc mắc liên hệ SĐT: ' + this.curUser.MasterProfile.tel + '.') }}
                        </span>
                        <span v-if="appointmentType === 'expect_join' && getJobType(candidate.recruitment_channel, candidate.job_id, (currentJobDriverXData ? currentJobDriverXData.job_type : null)) === jobTypes.COD_XLHH">
                            GHTK thông báo bạn trúng tuyển vị trí {{getJobName(currentJobDriverXData, candidate)}} <span v-if="stationId">{{' tại Kho: ' + stationName + '.'}}</span>{{(appointmentStation ? (' Đ/c: ' + appointmentStation) : '') }}. Vui lòng chuẩn bị hồ sơ bao gồm: CMND/CCCD, SHK, sơ yếu lý lịch, giấy bảo lãnh dân sự (tất cả công có công chứng) và xác nhận tư pháp. {{ appointmentTime && (' Nhận việc vào lúc ' + appointmentTime) }} {{ appointmentDate && (' ngày ' + formatDate(appointmentDate, 'DD.MM.YYYY') + '.') }}{{this.curUser && this.curUser.MasterProfile && this.curUser.MasterProfile.tel && (' Mọi thắc mắc liên hệ SĐT: ' + this.curUser.MasterProfile.tel) }}
                        </span>
                        <span v-if="appointmentType === 'expect_join' && getJobType(candidate.recruitment_channel, candidate.job_id, (currentJobDriverXData ? currentJobDriverXData.job_type : null)) === jobTypes.DRIVER">
                            GHTK thông báo bạn trúng tuyển vị trí {{getJobName(currentJobDriverXData, candidate)}} <span v-if="stationId">{{' tại Kho: ' + stationName + '.'}}</span>{{(appointmentStation ? (' Đ/c: ' + appointmentStation) : '') }}. Vui lòng chuẩn bị hồ sơ bao gồm: CMND/CCCD, SHK, sơ yếu lý lịch, giấy bảo lãnh dân sự (tất cả công có công chứng) và xác nhận tư pháp, giấy khám sức khỏe chuyên dụng. {{ appointmentTime && (' Nhận việc vào lúc ' + appointmentTime) }} {{ appointmentDate && (' ngày ' + formatDate(appointmentDate, 'DD.MM.YYYY') + '.') }}{{this.curUser && this.curUser.MasterProfile && this.curUser.MasterProfile.tel && (' Mọi thắc mắc liên hệ SĐT: ' + this.curUser.MasterProfile.tel) }}
                        </span>
                        <span v-if="appointmentType === 'interview'">
                            GHTK mời bạn đến phỏng vấn vị trí {{getJobName(currentJobDriverXData, candidate)}} {{ appointmentTime && ('vào lúc ' + appointmentTime) }} {{ appointmentDate && (' ngày ' + formatDate(appointmentDate, 'DD.MM.YYYY')) }} <span v-if="stationId">{{' tại Kho: ' + stationName + '.'}}</span> Đ/c:{{ (appointmentStation ? (' ' + appointmentStation) : '') }}. Khi đến phỏng vấn, vui lòng mang theo CMND/CCCD. {{ this.curUser && this.curUser.MasterProfile && this.curUser.MasterProfile.tel && (' Mọi thắc mắc liên hệ SĐT: ' + this.curUser.MasterProfile.tel) + '.'}}
                        </span>
                        <span v-if="appointmentType === 'contact_fail'">
                            GHTK đã nhận được thông tin ứng tuyển {{getJobName(currentJobDriverXData, candidate)}} của bạn nhưng không liên hệ được với bạn. Vui lòng để ý điện thoại
                            {{ this.curUser && this.curUser.MasterProfile && this.curUser.MasterProfile.tel && (' hoặc liên lạc lại ' + this.curUser.MasterProfile.tel + ' để trao đổi công việc.') }}
                        </span>
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
import candidateService from 'domain/services/candidate-service'

import { mapGetters } from 'vuex'

export default {
  name: 'modal-make-appoint',

  components: {
    SingleSelectStation,
    Datepicker,
    flatPickr
  },

  props: {
    currentJobDriverX: {
      default: null
    },
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
    },
    isStaffShiftPage: {
      type: Boolean,
      default: false
    }
  },

  data: _ => ({
    currentJobDriverXData: this.currentJobDriverX,
    appointmentDate: null,
    appointmentHour: null,
    appointmentMinute: null,
    appointmentTime: null,
    appointmentStation: null,
    stationId: null,
    stationName: null,
    sendSms: false,
    dataCandidate: null,
    appointmentHourOptions: [],
    appointmentMinuteOptions: dateHelper.getListMinuteOptions(),
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
    jobTypes: {
      COD_XLHH: 'COD_XLHH',
      DRIVER: 'DRIVER',
      ANOTHER: 'ANOTHER'
    },
    jobTypesDriverX: {
      COD: 'driver',
      XLHH: 'part_time',
      DRIVER: 'truck_driver',
      XTEAM: 'xteam',
      ANOTHER: null
    }
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    })
  },

  watch: {
    candidate: {
      immediate: true,
      handler () {
        this.dataCandidate = Object.assign({}, this.candidate)
      }
    },
    dataCandidate: {
      immediate: true,
      handler () {
        if (this.dataCandidate) {
          this.updateAppointDateTime()
          this.stationId = this.curUser && this.curUser.Station && this.curUser.Station.id
        }
      }
    },

    appointmentType (newVal, oldVal) {
      if (newVal) {
        this.updateAppointDateTime()
      }
    },

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
    initModal () {
      this.currentJobDriverXData = this.currentJobDriverX
      this.stationId = this.dataCandidate.station_id
      this.createStationInfo()
    },

    updateAppointDateTime () {
      if (this.appointmentType === 'expect_join') {
        this.appointmentDate = this.dataCandidate.expected_join_date
        this.setAppointTime(this.dataCandidate.expected_join_time)
      } else if (this.appointmentType === 'interview') {
        this.appointmentDate = this.dataCandidate.expected_interview_date
        this.setAppointTime(this.dataCandidate.expected_interview_time)
      } else if (this.appointmentType === 'contact') {
        this.appointmentDate = this.dataCandidate.expected_contact_date
        this.setAppointTime(this.dataCandidate.expected_contact_time)
      } else {
        this.appointmentDate = null
      }
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

    getJobName (currentJobDriverXData, candidate) {
      return currentJobDriverXData ? currentJobDriverXData.job_type_format : candidate.job_name
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

    sendSmsToCandidate () {
      if (!this.validateFromSendSmsToCandidate()) {
        return false
      }
      let data = {
        candidate_id: this.dataCandidate.id,
        job_id: this.currentJobDriverXData ? this.currentJobDriverXData.job_id : null
      }

      data.appointment_date = this.appointmentDate
      data.appointment_time = `${this.appointmentHour}h${this.appointmentMinute}`
      data.appointment_station = this.appointmentStation
      data.sendSms = this.sendSms
      data.stationId = this.stationId
      data.stationName = this.stationName
      data.nextStatus = this.nextStatus
      data.appointmentType = this.appointmentType

      candidateService.sendSmsToCandidate(data)
        .then(res => {
          if (res.data.success) {
            // update log và ngày hẹn gặp
            if (['expect_join', 'interview', 'contact'].includes(this.appointmentType) && this.dataCandidate) {
              if (this.appointmentType === 'expect_join') {
                this.dataCandidate.expected_join_date = this.appointmentDate
                this.dataCandidate.expected_join_time = data.appointment_time
              }
              if (this.appointmentType === 'interview') {
                this.dataCandidate.expected_interview_date = this.appointmentDate
                this.dataCandidate.expected_interview_time = data.appointment_time
              }
              if (this.appointmentType === 'contact') {
                this.dataCandidate.expected_contact_date = this.appointmentDate
                this.dataCandidate.expected_contact_time = data.appointment_time
              }
              if (res.data.data.log) {
                this.dataCandidate.logs.push(res.data.data.log)
              }
            }
            // Cập nhật lại khu vực đăng ký
            this.dataCandidate.station_id = data.stationId
            this.dataCandidate.register_place = this.stationName
            let emitData = {
              data: res.data,
              candidate: this.dataCandidate,
              newStatus: this.appointmentType,
              jobDriverX: this.currentJobDriverXData ? this.currentJobDriverXData : null
            }
            this.$emit('updateAppointmentOk', emitData)
            helper.showMessage(
              res.data.message || (this.statuses[this.appointmentType].sendSmsSuccessMsg),
              'success'
            )
            // Cập nhật lại trạng thái gửi sms
            if (this.sendSms && res.data.sendSmsSuccess) {
              this.$set(this.dataCandidate, 'sentSms', this.appointmentType)
            }
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

    getJobType (sourceRecruitment, jobId, jobType = null) {
      if (sourceRecruitment !== 'driverx') {
        if (Number(jobId) === 1 || Number(jobId) === 3) {
          return this.jobTypes.COD_XLHH
        } else if (Number(jobId) === 2) {
          return this.jobTypes.DRIVER
        }
      } else if (jobType != null) {
        if (jobType === this.jobTypesDriverX.COD || jobType === this.jobTypesDriverX.XLHH) {
          return this.jobTypes.COD_XLHH
        } else if (jobType === this.jobTypesDriverX.DRIVER) {
          return this.jobTypes.DRIVER
        }
      }
      return this.jobTypes.ANOTHER
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
      this.createStationInfo()
    },

    createStationInfo () {
      if (this.stationId) {
        stationService.getStationInfo({ station_id: this.stationId })
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
      this.sendSms = null
      this.currentJobDriverXData = null
    }
  }
}
</script>
