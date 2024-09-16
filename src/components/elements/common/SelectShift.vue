<template>
  <div class="select-user-work-type d-flex">
    <multiselect
      v-model="optionStart"
      :options="optionTimes"
      :disabled="disabled"
      label="label"
      track-by="value"
      placeholder="Bắt đầu ca"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      @select="handleStartChange"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Bắt đầu ca</span>
    </multiselect>
    <span class="col-1 pt-2"><i class="fa fa-arrow-right" aria-hidden="true"></i></span>
    <multiselect
      v-model="optionEnd"
      :options="optionTimes"
      :disabled="disabled"
      label="label"
      track-by="value"
      placeholder="Kết thúc ca"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      @select="handleEndChange"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Kết thúc ca</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'select-shift',

  components: {
    Multiselect
  },

  props: {
    disabled: {
      default: false
    },

    shift: {
      default: ''
    }
  },
  computed: {
    helper: _ => helper
  },
  data: () => ({
    minHoursPerShift: 10,
    maxHoursPerShift: 14,
    optionStart: null,
    optionEnd: null,
    optionTimes: [],
    tempShift: {
      from: null,
      to: null
    }
  }),

  created () {
    this.getConfigTime()
  },

  watch: {
    shift: function () {
      this.optionStart = this.shift ? this.optionTimes.find((item) => item.value === this.shift.from) : null
      this.optionEnd = this.shift ? this.optionTimes.find((item) => item.value === this.shift.to) : null
    }
  },

  methods: {
    setSelectedOption () {
      if (this.optionTimes && this.optionTimes.length) {
        this.optionStart = this.shift ? this.optionTimes.find((item) => item.value === this.shift.from) : null
        this.optionEnd = this.shift ? this.optionTimes.find((item) => item.value === this.shift.to) : null
      }
    },
    getConfigTime () {
      for (let i = 0; i < 24; i++) {
        let time = i < 10 ? {label: '0' + i + ':00', value: '0' + i + ':00:00'} : {label: i + ':00', value: i + ':00:00'}
        this.optionTimes.push(time)
      }
      if (this.shift) {
        this.tempShift = this.shift
        this.setSelectedOption()
      }
    },
    validationShift () {
      if (this.tempShift.from === null || this.tempShift.to === null) {
        return
      }
      let from = parseInt(this.tempShift.from.split(':')[0])
      let to = parseInt(this.tempShift.to.split(':')[0])
      let hourPerShift = from < to ? to - from : (24 - from) + to

      if (hourPerShift < this.minHoursPerShift || hourPerShift > this.maxHoursPerShift) {
        return helper.showMessage(`Khung giờ của ca làm việc không được nhỏ hơn ${this.minHoursPerShift} tiếng và lớn hơn ${this.maxHoursPerShift} tiếng.`, 'warning')
      }
    },
    handleStartChange (e) {
      this.tempShift.from = e.value
      this.validationShift()
      this.handleShiftChange()
    },
    handleEndChange (e) {
      this.tempShift.to = e.value
      this.validationShift()
      this.handleShiftChange()
    },
    handleShiftChange () {
      this.$emit('select', this.tempShift)
    }
  }
}
</script>
