<template>
  <div>
    <b-card class="echart-size-150" no-body>
      <h6 class="pt-3 pl-4">Thời gian TB trả hàng</h6>
      <vue-echart :options="options" :auto-resize="true"></vue-echart>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
    </b-card>
  </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'
import formatLib from 'infrastructures/helpers/format.js'
let formatTimeDhm = formatLib.formatTimeDhm

export default {
  name: 'bar-operation-speed-return',

  components: {
    'vue-echart': ECharts,
    SkRotatingPlane
  },

  props: [
    'dateRange',
    'provinceIds',
    'stationIds',
    'isReload'
  ],

  data: () => ({
    options: {
      tooltip: {
      },
      legend: {
        data: ['chờ trả', 'trả xong']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        show: false
      },
      yAxis: {
        type: 'category',
        data: ['đơn đúng', 'đơn sai'],
        show: false,
        inverse: true
      },
      series: []
    },
    firstTime: true,
    appLoading: true
  }),

  created () {
    if (this.isReload) {
      this.callAPI()
    }
  },

  watch: {
    provinceIds: function (newValue, oldValue) {
      this.callAPI()
    },

    dateRange: function (newValue, oldValue) {
      this.callAPI()
    },

    stationIds: function (newValue, oldValue) {
      this.callAPI()
    }
  },

  methods: {
    getData: function () {
      this.setDefault()
      let params = {
        from: this.dateRange.fromDate,
        to: this.dateRange.toDate,
        province: this.provinceIds,
        station: this.stationIds
      }

      dashboardV4.getOperationSpeedReturnBarData(params)
        .then((res) => {
          if (res.data.success) {
            let d1 = 0
            let d2 = 0
            res.data.data.forEach(item => {
              d1 += item.data[0]
            })
            res.data.data.forEach(item => {
              d2 += item.data[1]
            })
            let t = res.data.data.map((item) => {
              let m = {
                name: item.name,
                type: 'bar',
                stack: 'sum',
                label: {
                  normal: {
                    show: false,
                    position: 'insideTopLeft',
                    formatter: (params) => {
                      return formatTimeDhm(params.value)
                    }
                  }
                },
                data: item.data,
                tooltip: {
                  formatter: (params) => {
                    return params.seriesName + ': ' + formatTimeDhm(params.value)
                  }
                }
              }
              if (item.name === 'trả xong') {
                m.data = [
                  {
                    value: m.data[0],
                    label: {
                      show: true,
                      position: 'top',
                      formatter: formatTimeDhm(d1),
                      color: '#333'
                    }
                  },
                  {
                    value: m.data[1],
                    label: {
                      show: true,
                      position: 'bottom',
                      formatter: formatTimeDhm(d2),
                      color: '#333'
                    }
                  }
                ]
              }

              return m
            })
            this.options.series = t
            this.options.yAxis.show = true
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
      this.options.series = []
      this.options.yAxis.show = false
    },

    callAPI: function () {
      if (this.firstTime === true) {
        if (this.dateRange && this.provinceIds) {
          this.getData()
          this.firstTime = false
        }
      } else {
        this.getData()
      }
    }
  }
}
</script>
