<template>
  <div>
    <b-row>
      <b-col cols="12" md="9">
        <select-provinces @selectedProvinces="handerSelectedProvinces"></select-provinces>
        <div class="echart">
          <vue-echart :options="lineOptions" :auto-resize="true"></vue-echart>
        </div>
      </b-col>
      <b-col cols="12" md="3">
        <ecom-table-performance-accountant-report :childRes="childRes"></ecom-table-performance-accountant-report>
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
import EcomTablePerformanceAccountantReport from 'components/tables/EcomTablePerformanceAccountantReport'
import EcomLoadingWanderingCubes from 'components/elements/loading/EcomLoadingWanderingCubes'
import SelectProvinces from 'components/elements/FilterBox/SelectProvinces'

export default {
  name: 'graph-performance-accountant-report',

  components: {
    'vue-echart': ECharts,
    EcomTablePerformanceAccountantReport,
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
      legend: {
        data: ['Tiền thu hộ', 'Tiền dịch vụ', 'Tiền trả shop']
      },
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
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        name: 'VND',
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
      params['province'] = this.selectedProvinceIds
      params['reportType'] = 2
      dashboardV2.getPerformanceAccountant(params)
        .then((response) => {
          if (response.data.success) {
            this.appLoading = false
            let data = response.data.data.data
            this.childRes = response.data.data.sum
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

    handerSelectedProvinces: function (selectedProvinceIds) {
      this.selectedProvinceIds = selectedProvinceIds
      this.getLineOptions()
    }
  }
}
</script>
