<template>
  <div class="status-wrap">
    <select
      :class="getCandidateStatusClass(candidate.status)"
      @change="updateStatus(candidate)"
      :disabled="disabled"
      @close="onCancelUpdateApointment"
      class="form-control-sm border-0"
      v-model="status"
    >
      <option value="new"><span>Đã ứng tuyển</span></option>
      <option value="selected"><span>Trúng tuyển</span></option>
      <option value="save_info"><span >Lưu thông tin</span></option>
      <option value="taken"><span >Nhận việc</span></option>
    </select>
    <b-modal v-model="show">
      <template #modal-title>
        Lý do lưu thông tin<span class="required">*</span>
      </template>
      <b-form-textarea
        id="textarea"
        v-model="reasonSaveInfo"
        placeholder="Nhập lý do lưu thông tin"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
      <template #modal-footer>
        <button type="button" class="btn btn-secondary" @click="show = false">Hủy</button>
        <button type="button" class="btn btn-primary" @click="updateStatus">Đồng ý</button>
      </template>
    </b-modal>
    <b-modal v-model="showAppointment" size="lg">
      <template #modal-title>
        Hẹn nhận việc
      </template>
        <div>
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
            <b-input
              placeholder="Địa chỉ kho"
              v-model="appointmentStation"
            ></b-input>
          </b-form-group>
        </div>
      <template #modal-footer>
        <button type="button" class="btn btn-secondary" @click="onCancelUpdateApointment">Hủy</button>
        <button type="button" class="btn btn-primary" @click="updateAppointment">Đồng ý</button>
      </template>
    </b-modal>

  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<script>
import Candidate from 'domain/entities/Candidate'
import Datepicker from 'vuejs-datepicker'
import stationService from 'domain/services/station-service'
import driverxService from 'domain/services/driverx-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import moment from 'moment'

export default {
  components: {Datepicker, SingleSelectStation},
  props: ['candidate', 'id', 'disabled'],
  data () {
    return {
      show: false,
      status: 'new',
      reasonSaveInfo: null,
      showAppointment: false,
      appointmentDate: null,
      appointmentSession: null,
      appointmentTime: null,
      stationId: null,
      appointmentStation: null,
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
      ],
      reasonSaveinfOption: [
        { text: 'Không liên hệ được', value: 'contact_fail' },
        { text: 'Hủy ứng tuyển', value: 'cancel_recruit' },
        { text: 'Trượt phỏng vấn', value: 'rejected' },
        { text: 'Từ chối nhận việc', value: 'refused' },
        { text: 'khác', value: 'other' }
      ]
    }
  },
  mounted () {
    this.status = this.candidate.status
    this.stationId = this.candidate.interview_station_id
    this.appointmentDate = moment(this.candidate.interview_time || null).format('YYYY-MM-DD')
    this.appointmentTime = moment(this.candidate.interview_time || null).format('H')
    this.initStatus = this.candidate.status
  },
  methods: {
    getCandidateStatusClass (status) {
      let candidate = new Candidate()
      return candidate.getStatusClass(status)
    },
    expectJoinFrom () {
      let today = new Date()
      today.setDate(today.getDate() - 1)
      return today
    },
    updateStatus () {
      if (this.status === 'save_info' && !this.reasonSaveInfo) this.show = true
      else if (this.status === 'selected') this.showAppointment = true
      else {
        this.$emit('changeStatus', {id: this.id, status: this.status, note: this.reasonSaveInfo})
        this.reasonSaveInfo = null
        this.show = false
        this.showAppointment = false
      }
    },
    async updateAppointment () {
      let data = {
        id: this.candidate.candidate_id,
        sendSms: false
      }
      if (!this.appointmentDate) return alert('Vui lòng nhập ngày hẹn gặp !')
      if (!this.appointmentTime) return alert('Vui lòng nhập đầy đủ khoảng thời gian có thể hẹn gặp !')
      if (!this.stationId) return alert('Vui lòng chọn kho hẹn gặp !')

      data.appointment_date = moment(this.appointmentDate).format('YYYY-MM-DD')
      data.appointment_time = this.appointmentTime
      data.appointment_station = this.appointmentStation
      data.station_id = this.stationId
      data.job_id = this.candidate.job_id

      const response = await driverxService.updateAppointment(data)
      if (response.data.success) this.$emit('changeStatus', {id: this.id, status: this.status, note: this.reasonSaveInfo})
      else this.status = this.initStatus
      this.showAppointment = false
    },
    onCancelUpdateApointment () {
      this.showAppointment = false
      this.status = this.initStatus
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
    }
  },
  watch: {
    candidate (candidate) {
      this.status = candidate.status
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
  }
}
</script>

<style scoped lang="scss">
.status-wrap {
  display: -moz-inline-grid;
  display: inline-grid;
  display: -ms-inline-grid;

  option {
    color: black;
    background-color: white;
  }
}
.required{
  color: red;
}
</style>
