<template>
  <div class="select-user-work-type">
    <multiselect
      v-model="option"
      :options="options"
      :disabled="disabled"
      label="shiftInterval"
      track-by="shiftInterval"
      placeholder="Chọn ca làm việc"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      @select="op => $emit('select', op)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn ca làm việc</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-shift',

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
  data: () => ({
    hoursPerShift: 10,
    option: null,
    options: []
  }),

  created () {
    this.getConfigShift(this.hoursPerShift)
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedShift', newValue)
    },

    shift: function () {
      this.option = this.shift ? this.options.find((item) => item.from === this.shift.from) : null
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options && this.options.length) {
        this.option = this.options.find(option => {
          return option.from === this.shift.from
        })
      }
    },

    getConfigShift (hoursPerShift) {
      if (!hoursPerShift) return
      for (let i = 0; i < 24; i++) {
        let endShift = i + 10
        if (endShift > 24) endShift -= 24
        let tempFrom = i < 10 ? '0' + i + ':00:00' : i + ':00:00'
        let tempTo = endShift < 10 ? '0' + endShift + ':00:00' : endShift + ':00:00'
        let tempShift = {from: tempFrom, shiftInterval: i + 'h - ' + endShift + 'h', to: tempTo}
        this.options.push(tempShift)
      }
      if (this.shift) {
        this.setSelectedOption()
      }
    }
  }
}
</script>
