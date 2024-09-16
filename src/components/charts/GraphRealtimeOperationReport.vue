<template>
  <div>
    <b-row>
      <b-col cols="12" md="9">
        <div class="echart">
          <select-provinces @selectedProvinces="handerSelectedProvinces"></select-provinces>
          <vue-echart :options="lineOptions" :auto-resize="true"></vue-echart>
        </div>
      </b-col>
      <b-col cols="12" md="3">
        <ecom-table-realtime-operation-report :childRes="childRes"></ecom-table-realtime-operation-report>
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
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import dashboardV2 from 'domain/admin/dashboardV2'
import EcomTableRealtimeOperationReport from 'components/tables/EcomTableRealtimeOperationReport'
import EcomLoadingWanderingCubes from 'components/elements/loading/EcomLoadingWanderingCubes'
import SelectProvinces from 'components/elements/FilterBox/SelectProvinces'

const percents = ['Tỉ lệ hoàn thành', 'Tỉ lệ không giao được', 'Tỉ lệ hủy']

export default {
  name: 'graph-realtime-operation-report',

  components: {
    'vue-echart': ECharts,
    EcomTableRealtimeOperationReport,
    EcomLoadingWanderingCubes,
    SelectProvinces
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
      color: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#A379BC', '#1aadce', '#492970', '#f28f43', '#77a1e5'],
      legend: {
        data: ['Đơn hàng mới', 'Đơn hàng hoàn thành', 'Đơn hàng không giao được',
          'Đơn hàng hủy', 'Đơn hàng lấy thành công', 'Tỉ lệ hoàn thành', 'Tỉ lệ không giao được',
          'Tỉ lệ hủy', 'Active shops'
        ]
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#46494d',
        textStyle: {
          fontSize: 11
        },
        formatter: function (params) {
          let output = '<b>' + params[0].name + '</b><br/>'
          for (let i = 0; i < params.length; i++) {
            if (percents.includes(params[i].seriesName)) {
              output += params[i].marker + params[i].seriesName + ': ' + params[i].value + '%'
            } else {
              output += params[i].marker + params[i].seriesName + ': ' + params[i].value
            }

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
        boundaryGap: false
      },
      yAxis: {
        name: 'Số lượng đơn hàng',
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: {
          color: 'rgb(77, 117, 158)'
        },
        splitLine: { show: false },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, .08)' }
        },
        axisLabel: { color: 'rgba(0, 0, 0, .5)' }
      },
      series: []
    },
    childRes: [],
    appLoading: true,
    selectedProvinceIds: ''
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
      params['province'] = this.selectedProvinces
      params['reportType'] = 2
      dashboardV2.getRealtimeOperation(params)
        .then((response) => {
          if (response.data.success) {
            this.appLoading = false
            let data = response.data.data.data
            this.childRes = response.data.data.sum
            for (let key in this.childRes) {
              if (percents.includes(key)) {
                this.childRes[key] += '%'
              }
            }
            this.lineOptions.xAxis.data = response.data.data.dates
            this.lineOptions.series = []
            for (let key in data) {
              this.lineOptions.series.push({
                'name': key,
                'type': 'line',
                'showSymbol': true,
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

    handerSelectedProvinces: function (selectedProvinces) {
      this.selectedProvinces = selectedProvinces.toString()
      this.getLineOptions()
    }
  }
}
</script>
