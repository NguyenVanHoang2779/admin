<template>
  <div>
    <b-row>
      <b-col class="pr-5">
        <b-button-group>
          <b-btn variant="outline-primary" class="mr-3" :class="{'active': activeMarket == 'day'}" @click="handleSelectedTime('day')">Diễn biến theo ngày</b-btn>
          <b-btn variant="outline-primary" class="mr-3" :class="{'active': activeMarket == 'week'}" @click="handleSelectedTime('week')">Diễn biến theo tuần</b-btn>
          <b-btn variant="outline-primary" :class="{'active': activeMarket == 'month'}" @click="handleSelectedTime('month')">Diễn biến theo tháng</b-btn>
        </b-button-group>
      </b-col>
      <b-col class="p-0"><flat-pickr v-model="range" :config="rangeConfig" placeholder="Chọn khoảng thời gian"/></b-col>
    </b-row>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'

export default {
  name: 'filter-time-evolution',

  components: {
    flatPickr
  },

  data: () => ({
    range: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      defaultDate: [moment().subtract(7, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    },
    fromDate: null,
    toDate: null,
    activeMarket: 'day'
  }),

  created () {
    this.fromDate = moment().subtract(7, 'day').format('YYYY-MM-DD')
    this.toDate = moment().format('YYYY-MM-DD')
  },

  computed: {
    dateRange: function () {
      return {
        fromDate: this.fromDate,
        toDate: this.toDate,
        type: this.activeMarket
      }
    }
  },

  watch: {
    dateRange: function (newValue, oldValue) {
      this.$emit('handleSelectedDate', newValue)
    },

    range: function (newValue, oldValue) {
      let range = newValue.split('to').map(item => item.trim())
      if (range.length === 2) {
        this.fromDate = moment(range[0]).format('YYYY-MM-DD')
        this.toDate = moment(range[1]).format('YYYY-MM-DD')
      }
    }
  },

  methods: {
    handleSelectedTime: function (selectedValue) {
      switch (selectedValue) {
        case 'day':
          this.activeMarket = 'day'
          break
        case 'week':
          this.activeMarket = 'week'
          break
        case 'month':
          this.activeMarket = 'month'
          break
        default:
          break
      }
    }
  }
}
</script>
