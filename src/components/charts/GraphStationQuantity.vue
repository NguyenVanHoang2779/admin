<template>
  <div>
    <b-row>
      <b-col cols="12" md="9">
        <div class="echart">
          <select-lv-station @selectedStations="handerSelectedStations"></select-lv-station>
          <vue-echart :options="lineOptions" :auto-resize="true"></vue-echart>
        </div>
      </b-col>
      <b-col cols="12" md="3">
        <ecom-table-station-quantity-report :childRes="childRes"></ecom-table-station-quantity-report>
      </b-col>
    </b-row>
    <div class="relative-loading">
      <ecom-loading-wandering-cubes :enable="appLoading"></ecom-loading-wandering-cubes>
    </div>
  </div>
</template>

<style>
.echarts {
  width: 100% !important;
}
.relative-loading {
  position: relative;
}
</style>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import dashboardV5 from 'domain/admin/dashboardV5'
import EcomLoadingWanderingCubes from 'components/elements/loading/EcomLoadingWanderingCubes'
import EcomTableStationQuantityReport from 'components/tables/EcomTableStationQuantityReport'
import SelectLvStation from 'components/elements/FilterBox/SelectLvStation'

const percents = ['Nhân sự']
const thirdParty = ['Xuất']
export default {
  name: 'GraphStationQuantity',

  components: {
    EcomTableStationQuantityReport,
    'vue-echart': ECharts,
    EcomLoadingWanderingCubes,
    SelectLvStation
  },

  props: ['fromDate', 'toDate', 'isChange'],

  data: () => ({
    lineOptions: {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0',
        containLabel: true
      },
      color: ['#0070A8', '#00ACEE', '#97D7D7', '#90A6E6'],
      legend: {
        data: ['Cần xử lý', 'Nhập', 'Nhân sự', 'Xuất']
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        textStyle: {
          fontSize: 11,
          color: '#8b8b8b'
        },
        formatter: function (params) {
          let output = '<b>' + params[0].name + '</b><br/>'
          for (let i = 0; i < params.length; i++) {
            // if (percents.includes(params[i].seriesName)) {
            //   output += params[i].marker + params[i].seriesName + ': ' + params[i].value + '%'
            // } else {
            output += params[i].marker + params[i].seriesName + ': ' + params[i].value
            // }

            if (i !== params.length - 1) {
              output += '<br/>'
            }
          }
          return output
        }
      },
      xAxis: {
        data: [],
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, .08)' }
        },
        axisLabel: { color: 'rgba(0, 0, 0, .5)' },
        boundaryGap: true
      },
      yAxis: [{
        name: 'Sản lượng(đơn)',
        nameTextStyle: {
          color: 'rgba(0, 0, 0, .5)'
        },
        splitLine: { show: false },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, .08)' }
        },
        axisLabel: { color: 'rgba(0, 0, 0, .5)' }
      }, { name: 'Nhân sự(người)',
        nameTextStyle: {
          color: 'rgba(0, 0, 0, .5)'
        },
        splitLine: { show: false },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, .08)' }
        },
        axisLabel: { color: 'rgba(0, 0, 0, .5)' }
      }],
      series: [
      ]
    },
    childRes: [],
    appLoading: true,
    selectedStationIds: ''
  }),

  created () {
  },

  watch: {
    isChange: function (newIsChange, oldIsChange) {
      this.getLineOptions()
    }
  },

  methods: {
    getLineOptions: function () {
      this.setDefault()
      let params = {}
      params['from'] = this.fromDate
      params['to'] = this.toDate
      params['station'] = this.selectedStationIds
      params['reportType'] = 2
      dashboardV5.getStationQuantityV5(params)
        .then((response) => {
          if (response.data.success) {
            this.appLoading = false
            let data = response.data.data.data
            this.childRes = response.data.data.sum
            // for (let key in this.childRes) {
            //   if (percents.includes(key)) {
            //     this.childRes[key] += '%'
            //   }
            // }
            this.lineOptions.xAxis.data = response.data.data.dates.map(function (str) {
              return str.replace('|', '\n')
            })
            this.lineOptions.series = []
            for (let key in data) {
              if (thirdParty.includes(key)) {
                this.lineOptions.series.push({
                  'name': key,
                  'type': 'line',
                  'showSymbol': true,
                  'data': data[key]
                })
                continue
              }

              if (percents.includes(key)) {
                this.lineOptions.series.push({
                  'name': key,
                  'type': 'line',
                  'showSymbol': true,
                  'data': data[key],
                  'yAxisIndex': 1
                })
                continue
              }
              this.lineOptions.series.push({
                'name': key,
                'type': 'bar',
                'stack': 'numberOfOrders',
                'showSymbol': true,
                'barMaxWidth': '38',
                'yAxisIndex': 0,
                'data': data[key]
              })
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setDefault: function () {
      this.appLoading = true
      this.lineOptions.series = []
      this.childRes = []
    },

    handerSelectedStations: function (selectedStations) {
      this.selectedStationIds = selectedStations.toString()
      this.getLineOptions()
    }
  }
}
</script>
