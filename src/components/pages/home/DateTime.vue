<template>
  <div>
    <flat-pickr v-model="date" :config="dateConfig" placeholder="Chọn ngày" />
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'date-time',

  components: {
    flatPickr
  },

  props: ['type', 'dateValue'],

  data: () => ({
    date: null,
    dateConfig: {
      altInput: true,
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d'
    }
  }),

  created () {
    this.date = this.setDate(this.type)
  },

  watch: {
    date: function (newValue, oldValue) {
      this.$emit('handleSelectedDateTime', newValue)
    },

    dateValue: function (newValue, oldValue) {
      this.date = newValue
    }
  },

  methods: {
    setDate: function (type) {
      if (type === 1) {
        return moment().format('YYYY-MM-DD')
      } else {
        return moment().subtract(1, 'weeks').format('YYYY-MM-DD')
      }
    }
  }
}
</script>
