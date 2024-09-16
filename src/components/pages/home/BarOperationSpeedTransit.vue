<template>
  <div>
    <b-card class="echart-size-150" no-body>
      <h6 class="pt-3 pl-4">Thời gian TB trung chuyển</h6>
      <b-row>
        <b-col md="6">
          <vue-echart :options="options" :auto-resize="true"></vue-echart>
        </b-col>
        <b-col md="4">
          <table class="table mb-0 table-bordered table-color" v-if="tableData">
            <thead>
              <tr>
                <th>Số kho TB phải đi qua</th>
                <th>Tổng số đơn được tính</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{tableData.so_kho_tb_noi_tinh}}</td>
                <td v-numeral>{{tableData.tong_don_noi_tinh}}</td>
              </tr>
              <tr>
                <td>{{tableData.so_kho_tb_lien_tinh}}</td>
                <td v-numeral>{{tableData.tong_don_lien_tinh}}</td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
    </b-card>
  </div>
</template>
<style>
.table-color{
  background-color: #2f4554;
  color: #fff;
}
</style>
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
  name: 'bar-operation-speed-transit',

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
        data: ['chờ chuyển đi', 'di chuyển']
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
        data: ['đơn nội tỉnh', 'đơn liên tỉnh'],
        show: false,
        inverse: true
      },
      series: []
    },
    firstTime: true,
    appLoading: true,
    tableData: null
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

      dashboardV4.getOperationSpeedTransitBarData(params)
        .then((res) => {
          if (res.data.success) {
            this.tableData = res.data.data.tableData
            let d1 = 0
            let d2 = 0
            res.data.data.chartData.forEach(item => {
              d1 += item.data[0]
            })
            res.data.data.chartData.forEach(item => {
              d2 += item.data[1]
            })
            let t = res.data.data.chartData.map((item) => {
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
              if (item.name === 'di chuyển') {
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
      this.tableData = null
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
