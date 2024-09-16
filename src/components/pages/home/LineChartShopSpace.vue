<template>
  <div>
    <b-card>
      <vue-echart :options="lineOptions" :auto-resize="true" class="w-100"></vue-echart>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
    </b-card>
  </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'

export default {
  name: 'line-chart-shop-space',

  components: {
    'vue-echart': ECharts,
    SkRotatingPlane
  },

  props: [
    'dateRange',
    'provinceIds',
    'filterShopSpaceId'
  ],

  data: () => ({
    firstTime: true,
    lineOptions: {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        containLabel: true
      },
      legend: {},
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#46494d',
        textStyle: {
          fontSize: 11
        }
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, .08)' }
        },
        axisLabel: { color: 'rgba(0, 0, 0, .5)' },
        data: []
      },
      yAxis: {
        type: 'value',
        nameLocation: 'middle',
        nameGap: 20,
        nameTextStyle: {
          color: 'rgb(77, 117, 158)'
        },
        splitLine: { show: false },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, .08)' }
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, .5)'
        }
      },
      series: []
    },
    appLoading: true
  }),

  created () {
  },

  computed: {
  },

  watch: {
    dateRange: function (newValue, oldValue) {
      this.callAPI()
    },

    provinceIds: function (newValue, oldValue) {
      this.callAPI()
    },

    filterShopSpaceId: function (newValue, oldValue) {
      this.callAPI()
    }
  },

  methods: {
    getChartShopSpaceData: function () {
      this.setDefault()
      let params = {
        from: this.dateRange.fromDate,
        to: this.dateRange.toDate,
        timeType: this.dateRange.type,
        province: this.provinceIds,
        compare: this.filterShopSpaceId
      }

      dashboardV4.getChartShopSpaceData(params)
        .then((res) => {
          if (res.data.success) {
            this.lineOptions.legend.data = res.data.data.legendData
            this.lineOptions.xAxis.data = res.data.data.timeList
            this.lineOptions.series = res.data.data.series
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    setDefault: function () {
      this.appLoading = true
      this.lineOptions.legend.data = []
      this.lineOptions.xAxis.data = []
      this.lineOptions.series = []
    },

    callAPI: function () {
      if (this.firstTime === true) {
        if (this.dateRange && this.provinceIds && this.filterShopSpaceId) {
          this.getChartShopSpaceData()
          this.firstTime = false
        }
      } else {
        this.getChartShopSpaceData()
      }
    }
  }
}
</script>
