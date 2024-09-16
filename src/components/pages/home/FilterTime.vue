<template>
  <div>
    <b-row>
      <b-col md="4">
        <span>Chọn thời gian xem gợi ý:</span>
        <multiselect
          class="multiselect-primary"
          v-model="option"
          :options="options"
          placeholder="Chọn thời gian gợi ý xem"
          label="name"
          track-by="name"
          selectedLabel="Đã chọn"
          deselectLabel="Đã chọn"
          selectLabel="Chọn"
          @input="handleSelectedTime(option)"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </multiselect>
      </b-col>
      <b-col md="4">
        <span>Chọn khoảng xem:</span>
        <flat-pickr v-model="range" :config="rangeConfig" placeholder="Chọn khoảng thời gian"/>
      </b-col>
      <b-col md="4">
        <span>Chọn khoảng so sánh:</span>
        <flat-pickr v-model="rangeCompare" :config="rangeCompareConfig" placeholder="Chọn khoảng so sánh"/>
      </b-col>
    </b-row>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import Multiselect from 'vue-multiselect'

export default {
  name: 'filter-time',

  components: {
    flatPickr,
    Multiselect
  },

  data: () => ({
    range: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      defaultDate: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    },
    rangeCompare: null,
    rangeCompareConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      defaultDate: [moment().subtract(7, 'day').format('YYYY-MM-DD'), moment().subtract(7, 'day').format('YYYY-MM-DD')]
    },
    option: {
      id: 1,
      name: 'Hôm nay'
    },
    options: [
      {
        id: 1,
        name: 'Hôm nay'
      },
      {
        id: 2,
        name: 'Hôm qua'
      },
      {
        id: 3,
        name: 'Cùng ngày tuần trước'
      },
      {
        id: 4,
        name: 'Tuần này'
      },
      {
        id: 5,
        name: 'Tuần trước'
      },
      {
        id: 6,
        name: 'Tháng này'
      },
      {
        id: 7,
        name: 'Tháng trước'
      }
    ]
  }),

  created () {
    this.range = moment().format('YYYY-MM-DD') + ' to ' + moment().format('YYYY-MM-DD')
  },

  watch: {
    range: function (newValue, oldValue) {
      let fromDate = null
      let toDate = null
      let range = newValue.split('to').map(item => item.trim())

      if (range.length === 2) {
        fromDate = moment(range[0]).format('YYYY-MM-DD')
        toDate = moment(range[1]).format('YYYY-MM-DD')
      }

      this.$emit('handleSelectedDate', {
        fromDate: fromDate,
        toDate: toDate
      })
      this.setCompareRangeTime(fromDate, toDate)
    },

    rangeCompare: function (newValue, oldValue) {
      let range = newValue.split('to').map(item => item.trim())
      if (range.length === 2) {
        let fromCompareDate = moment(range[0]).format('YYYY-MM-DD')
        let toCompareDate = moment(range[1]).format('YYYY-MM-DD')
        this.$emit('handleSelectedRangeTimeCompare', {fromCompareDate: fromCompareDate, toCompareDate: toCompareDate})
      }
    }
  },

  methods: {
    handleSelectedTime: function (option) {
      let id = option ? option.id : null
      switch (id) {
        case 1:
          this.range = moment().format('YYYY-MM-DD') + ' to ' + moment().format('YYYY-MM-DD')
          break
        case 2:
          this.range = moment().subtract(1, 'day').format('YYYY-MM-DD') + ' to ' + moment().subtract(1, 'day').format('YYYY-MM-DD')
          break
        case 3:
          this.range = moment().subtract(7, 'day').format('YYYY-MM-DD') + ' to ' + moment().subtract(7, 'day').format('YYYY-MM-DD')
          break
        case 4:
          this.range = moment().startOf('isoWeek').format('YYYY-MM-DD') + ' to ' + moment().endOf('isoWeek').format('YYYY-MM-DD')
          break
        case 5:
          this.range = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD') + ' to ' + moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
          break
        case 6:
          this.range = moment().startOf('month').format('YYYY-MM-DD') + ' to ' + moment().endOf('month').format('YYYY-MM-DD')
          break
        case 7:
          this.range = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD') + ' to ' + moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
          break
        default:
          break
      }
    },

    setCompareRangeTime: function (from, to) {
      if (from === null && to === null) {
        this.rangeCompare = ''
      } else {
        let diffDay = moment(to).diff(moment(from), 'days')
        if (diffDay <= 0) {
          this.rangeCompare = moment(from).subtract(1, 'weeks').format('YYYY-MM-DD') + ' to ' + moment(to).subtract(1, 'weeks').format('YYYY-MM-DD')
        } else if (diffDay < 29) {
          this.rangeCompare = moment(from).subtract(1, 'months').format('YYYY-MM-DD') + ' to ' + moment(to).subtract(1, 'months').format('YYYY-MM-DD')
        } else {
          this.rangeCompare = moment(from).subtract(1, 'years').format('YYYY-MM-DD') + ' to ' + moment(to).subtract(1, 'years').format('YYYY-MM-DD')
        }
      }
    }
  }
}
</script>
