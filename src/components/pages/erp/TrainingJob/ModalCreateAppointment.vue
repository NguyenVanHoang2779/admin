<template>
  <b-modal :class="'modal-custom modal-custom-600'" id='modal-create-appointment' centered title="Hẹn lịch"
           @hidden="hideModal" hide-header hide-footer static>
    <div class="modal-header-custom text-center" style="line-height: 2rem">
      <span class="text-header">Hẹn lịch</span>
      <button type="button" aria-label="Close" class="close" style="font-size: 27px" @click="hideModal()">×</button>
    </div>
    <div v-loading="loading" class="">
      <div class="p-4">
        <b-row class="d-flex align-items-center mb-2">
          <b-col md="3" class="pr-0">
            <b class="b-label">Tiêu đề<span class="text-danger">*</span></b>
          </b-col>
          <b-col md="9" class="pl-0">
            <b-input  v-model="title"></b-input>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center mb-2">
          <b-col md="3" class="pr-0">
            <b class="b-label">Mô tả</b>
          </b-col>
          <b-col md="9" class="pl-0">
            <b-textarea  v-model="note"></b-textarea>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center mb-2">
          <b-col md="3" class="pr-0">
            <b class="b-label">Thời gian<span class="text-danger">*</span></b>
          </b-col>
          <b-col md="9" class="pl-0">
              <div class="d-flex justify-content-between">
                <div class="w-60">
                  <Datepicker
                    v-model="optionStart.day"
                    format="dd-MM-yyyy"
                    :disabled-dates="{ to: disableToDate() }"
                    class="from-date"
                    :bootstrapStyling= "true"
                    placeholder="Ngày bắt đầu"
                  ></Datepicker>
                </div>
                <div>
                  <b-select placeholder="Giờ" :options="appointmentHourOptions" v-model="optionStart.hour"></b-select>
                </div>
                <div>
                  <b-select placeholder="Phút" :options="appointmentMinuteOptions" v-model="optionStart.minute"></b-select>
                </div>
              </div>
              <div class="d-flex justify-content-between mt-1">
                <div class="w-60">
                  <Datepicker
                    v-model="optionEnd.day"
                    format="dd-MM-yyyy"
                    class="from-date"
                    :bootstrapStyling= "true"
                    placeholder="Ngày kết thúc"
                  ></Datepicker>
                </div>
                <div>
                  <b-select  placeholder="Giờ" :options="appointmentHourOptions" v-model="optionEnd.hour"></b-select>
                </div>
                <div>
                  <b-select  placeholder="Phút" :options="appointmentMinuteOptions" v-model="optionEnd.minute"></b-select>
                </div>
              </div>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center mb-2">
          <b-col md="3" class="pr-0">
            <b class="b-label">Nhắc trước</b>
          </b-col>
          <b-col md="9" class="pl-0">
            <b-select class="select-ghtk" placeholder="Nhắc trước" :options="optionRemind.options" v-model="optionRemind.value"></b-select>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center mb-2">
          <b-col md="3" class="pr-0">
            <b class="b-label">Địa điểm<span class="text-danger">*</span></b>
          </b-col>
          <b-col md="9" class="pl-0">
            <SingleSelectStation
              placeholder="Địa điểm"
              @handleSelectedStation="opt => stationId = opt ? opt.id : null"
              :stationId="stationId"/>
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="text-center">
      <b-btn size="md" style="line-height: 1rem; width: 8rem;" class="mt-4 rounded mb-2 btn-ghtk font-initial" :disabled="disableAction" @click="sentAppointment()">Xác nhận</b-btn>
      <b-btn v-if="this.isShowRemoveAppointment" size="md" style="line-height: 1rem; width: 8rem;" class="mt-4 rounded mb-2 btn-outline-danger" :disabled="disableAction" @click="sentRemoveAppointment()">Xóa</b-btn>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style scoped lang="scss">
.text-header {
  font-size: 18px;
  font-weight: 500;
}
.modal-header-custom {
  background-color: #069255;
  color: white;
  position: relative;
  padding: 5px 10px;
}
.modal-header-custom .close {
  opacity: 0.8;
  color: white;
  font-size: 22px;
  font-weight: 400;
  position: absolute;
  top: 50%;
  right: 10px;
  margin: 0;
  padding: 0;
  line-height: 1.47;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
}
::placeholder {
  color: #828282;
}
.b-label {
  font-size: 16px;
}
.from-date {
  width: 100%;
}
</style>

<script>
import trainingService from 'domain/services/training-service'

// helper
import Datepicker from 'vuejs-datepicker'
import helper from 'infrastructures/helpers/common-helpers'
import dateHelper from 'infrastructures/helpers/date'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import SingleSelectStation from '../../../elements/common/SingleSelectStation.vue'

// eslint-disable-next-line no-unused-vars
const ID_STATION_GHTK_BUILDING = 4558
export default {
  name: 'modal-create-appointment',

  components: {
    Multiselect,
    Datepicker,
    SingleSelectStation
  },
  props: [
    'classDetail',
    'triggerCreateAppointment'
  ],

  data: _ => ({
    optionStart: {
      day: null,
      hour: null,
      minute: null
    },
    optionEnd: {
      day: null,
      hour: null,
      minute: null
    },
    stationId: null,
    optionRemind: {
      value: null,
      options: [
        {
          text: 'Nhắc trước',
          value: null
        },
        {
          text: 'Nhắc trước 15 phút',
          value: 15
        },
        {
          text: 'Nhắc trước 30 phút',
          value: 30
        },
        {
          text: 'Nhắc trước 1 tiếng',
          value: 60
        }
      ]
    },
    appointmentHourOptions: dateHelper.getListHourOptions(),
    appointmentMinuteOptions: dateHelper.getListMinuteOptions(),
    note: '',
    title: '',
    loading: false,
    disableAction: false,
    classInfo: null,
    isShowRemoveAppointment: false
  }),

  created () {
  },

  computed: {
  },

  watch: {
    'triggerCreateAppointment': {
      handler: function (newVal, oldVal) {
        this.classInfo = this.classDetail
        this.setData(this.classInfo)
        this.showBtnRemoveAppointment(this.classInfo)
      }
    }
  },

  methods: {
    disableToDate () {
      let today = moment().subtract(1, 'days')
      return today.toDate()
    },

    showBtnRemoveAppointment (classInfo) {
      if (classInfo.period.start_appointment != null) {
        this.isShowRemoveAppointment = true
      } else {
        this.isShowRemoveAppointment = false
      }
    },

    hideModal () {
      this.$bvModal.hide('modal-create-appointment')
    },

    setData (classInfo) {
      if (classInfo.period.start_appointment != null) {
        this.setValueDataClassPeriod(classInfo)
      } else {
        this.setDefaultData(classInfo)
      }
    },

    setValueDataClassPeriod (classInfo) {
      let dateStart = moment(classInfo.period.start_appointment)
      this.optionStart.day = dateStart.toDate()
      this.optionStart.hour = dateStart.format('HH')
      this.optionStart.minute = dateStart.format('mm')

      let dateFinish = moment(classInfo.period.finish_appointment)
      this.optionEnd.day = dateFinish.toDate()
      this.optionEnd.hour = dateFinish.format('HH')
      this.optionEnd.minute = dateFinish.format('mm')

      this.stationId = classInfo.period.address_id
      this.optionRemind.value = classInfo.period.remind_appointment
      this.note = classInfo.period.note_appointment
      this.title = classInfo.period.title_appointment
    },

    setDefaultData () {
      let dateStart = moment().add(5, 'minutes')
      this.optionStart.day = dateStart.toDate()
      this.optionStart.hour = dateStart.format('HH')
      this.optionStart.minute = dateStart.format('mm')

      let dateFinish = dateStart.add(30, 'minutes')
      this.optionEnd.day = dateFinish.toDate()
      this.optionEnd.hour = dateFinish.format('HH')
      this.optionEnd.minute = dateFinish.format('mm')

      this.stationId = ID_STATION_GHTK_BUILDING
      this.optionRemind.value = null
      this.title = 'Lịch hẹn'
      this.note = ''
    },

    sentAppointment () {
      this.disableAction = true
      let dateStart = moment(this.optionStart.day).format('YYYY-MM-DD')
      let dateEnd = moment(this.optionEnd.day).format('YYYY-MM-DD')
      let data = {
        class_period_id: this.classInfo.period.id,
        start_appointment: `${dateStart} ${this.optionStart.hour}:${this.optionStart.minute}:00`,
        finish_appointment: `${dateEnd} ${this.optionEnd.hour}:${this.optionEnd.minute}:00`,
        address_id: this.stationId,
        note_appointment: this.note,
        title_appointment: this.title,
        remind_appointment: this.optionRemind.value
      }
      if (this.classInfo.period.start_appointment == null) {
        this.createAppointment(data)
      } else {
        this.updateAppointment(data)
      }
    },

    sentRemoveAppointment () {
      this.disableAction = true
      let data = {
        class_period_id: this.classInfo.period.id
      }
      this.removeAppointment(data)
    },

    createAppointment (data) {
      trainingService.createAppointment(data)
        .then((res) => {
          this.showMessage(res)
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message) {
            helper.showMessage(e.response.data.message)
          }
        })
        .then(() => {
          this.disableAction = false
        })
    },

    updateAppointment (data) {
      trainingService.updateAppointment(data)
        .then((res) => {
          this.showMessage(res)
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message) {
            helper.showMessage(e.response.data.message)
          }
        })
        .then(() => {
          this.disableAction = false
        })
    },

    removeAppointment (data) {
      trainingService.removeAppointment(data)
        .then((res) => {
          this.showMessage(res)
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message) {
            helper.showMessage(e.response.data.message)
          }
        })
        .then(() => {
          this.disableAction = false
        })
    },

    showMessage (res) {
      if (res.data.success) {
        helper.showMessage(res.data.message, 'success')
        this.$bvModal.hide('modal-create-appointment')
        this.$emit('refreshPage')
      } else {
        helper.showMessage(res.data.message || 'Gặp lỗi khi cập nhật lịch hẹn !', 'warning')
      }
    }
  }
}
</script>
