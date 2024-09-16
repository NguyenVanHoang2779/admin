<template>
  <div>
    <b-card class="default-pie-chart" no-body>
      <h6 class="pt-3 pl-4">Nguyên nhân delay giao</h6>
      <vue-echart :options="options" :auto-resize="true"></vue-echart>
      <sk-rotating-plane v-if="appLoading"></sk-rotating-plane>
    </b-card>
  </div>
</template>
<style>
.default-pie-chart .echarts {
  width: auto !important;
  height: 300px !important;
}
</style>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import dashboardV4 from 'domain/admin/dashboardV4'
import SkRotatingPlane from 'components/elements/loading/SkRotatingPlane'

export default {
  name: 'pie-operation-report-delay-deliver',

  components: {
    'vue-echart': ECharts,
    SkRotatingPlane
  },

  props: [
    'dateRange',
    'provinceIds',
    'stationIds'
  ],

  data: () => ({
    options: {
      title: {
        text: 'Biểu đồ',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
        backgroundColor: '#46494d',
        textStyle: {
          fontSize: 11
        }
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [
          'GHTK quá tải',
          'Người nhận hẹn giao ca sau',
          'Không gọi được người nhận',
          'Người nhận hẹn ngày giao',
          'Người nhận chuyển địa chỉ',
          'Địa chỉ người nhận sai',
          'Do điều kiện thời tiết',
          'Đối tác hẹn thời gian giao hàng',
          'Không tìm thấy hàng',
          'SĐT người nhận sai',
          'Lý do khác'
        ]
      },
      series: [{
        name: '',
        type: 'pie',
        radius: '45%',
        center: ['70%', '70%'],
        data: [],
        itemStyle: {
          normal: {
            shadowBlur: 50,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            show: false,
            position: 'center'
          }
        }
      }],
      animationDuration: 2000
    },
    firstTime: true,
    appLoading: true
  }),

  created () {
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

      dashboardV4.getOperationReportDelayDeliverPieChartData(params)
        .then((res) => {
          if (res.data.success) {
            this.options.series[0].data = res.data.data
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
      this.options.series[0].data = []
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
