<template>
  <b-col>
    <b> Chốt ca</b>
    <b-row class="mb-3 mt-2">
      <b-col sm="3">
        <label class="col-form-label">Cần chốt</label>
      </b-col>
      <b-col sm="9">
        <b-select :options="numberOfShift" size="sm" :value="initialTimes" @change="handleTimes($event)" class="w-auto" />
      </b-col>
    </b-row>

    <b v-show="initialTimes > 0">Hạn chốt ca</b>
    <b-row class="mb-2 mt-2" v-for="shiftIndex in initialTimes" :key="shiftIndex">
      <b-col sm="3">
        <label>Ca {{shiftIndex}}</label>
      </b-col>
      <b-col sm="9" class="form-line d-flex">
        <b-form-input size="sm" type="time" :value="computedDetails[shiftIndex - 1].time" @input="handleDetailTime($event, shiftIndex - 1)" class="input-size mr-3" required />
        <b-select :options="DayConfirms" size="sm" :value="computedDetails[shiftIndex - 1].date" @input="handleDetailDay($event, shiftIndex - 1)" class="w-auto" required />
      </b-col>
    </b-row>
    <div v-for="errorMessage in errorMessages"><i class="text-danger">{{ errorMessage }}</i></div>
  </b-col>
</template>

<script>
import multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'

export default {
  name: 'ConfirmWorkShift',
  components: {
    multiselect,
    ManageLineService
  },
  props: {
    initialTimes: {
      type: Number,
      default: 0
    },
    initialDetails: {
      type: Array,
      default: () => ([
        {time: null, date: null},
        {time: null, date: null},
        {time: null, date: null}
      ])
    },
    errorMessages: {
      type: Array,
      default: () => ([])
    },
    SessionIndex: {
      type: Number,
      required: true
    }
  },
  mounted () {
  },
  data: () => ({
    MAX_WORK_SHIFT: 3,
    WorkShiftOptions: DeliveryScript.workShiftOptions,
    DayOptions: DeliveryScript.dayOfWeekOptions,
    times: this.initialTimes,
    numberOfShift: [
      {value: 1, text: '1 ca'},
      {value: 2, text: '2 ca'},
      {value: 3, text: '3 ca'}
    ],
    DayConfirms: [
      {value: '0', text: 'Ngày xuất giao'},
      {value: '1', text: 'Ngày xuất giao + 1'}
    ]
  }),
  methods: {
    handleTimes (val) {
      this.changeData({times: val})
    },
    handleDetailTime (val, index) {
      const details = this.initialDetails
      details[index].time = val
      this.changeData({details: details})
    },
    handleDetailDay (val, index) {
      const details = this.initialDetails
      details[index].date = val
      this.changeData({details: details})
    },
    changeData (newData) {
      const newConfig = {
        ...{times: this.initialTimes, details: this.initialDetails},
        ...newData
      }
      this.$emit('handleConfirmWorkShifts', newConfig)
    }
  },
  computed: {
    computedDetails () {
      return this.initialDetails
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.input-size {
  width: 110px !important;
}
</style>
