<template>
    <div class="full-width">
        <vue-echart style="width: 100%" v-if="dataDraw != null" :options="salary" :auto-resize="true"/>
    </div>
</template>

<style scoped>
    .full-width {
        width: 100% !important;
    }
</style>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import salaryService from 'domain/services/salary-service'
export default {
  name: 'optimize-data-over-all',
  components: {
    'vue-echart': ECharts
  },
  props: {
    dataDraw: {}
  },
  created () {
    this.drawChartOverView()
  },
  watch: {
    dataDraw (newValue, oldValue) {
      this.drawChartOverView()
    }
  },
  data: () => ({
    salary: {
      title: {
        text: 'Lương Kpi'
      },
      color: ['red', 'blue', 'green'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: [
          'Tb lương thực tế',
          'Tb lương chuẩn',
          'Tổng lương thực tính  (Bấm để hiện / ẩn)'
        ]
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
        // data: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Tb lương thực tế',
          type: 'line',
          // stack: 'kpi',
          // areaStyle: {},
          data: []
        },
        {
          name: 'Tb lương chuẩn',
          type: 'line',
          // stack: 'kpi',
          // areaStyle: {},
          data: []
        },
        {
          name: 'Tổng lương thực tính  (Bấm để hiện / ẩn)',
          type: 'line',
          // stack: 'kpi',
          // areaStyle: {},
          data: []
        }
      ]
    }
  }),
  methods: {
    drawChartOverView () {
      let dataSend = {
        data_date_key: this.dataDraw[0].data_date_key,
        user_id: this.dataDraw[0].user_id
      }
      this.salary.xAxis.data = []
      this.salary.series[0].data = []
      this.salary.series[1].data = []
      this.salary.series[2].data = []
      salaryService.getDetailOptimizeSalary(dataSend).then(res => {
        if (res.data.success) {
          Object.values(res.data.data).forEach(element => {
            this.salary.xAxis.data.push(`${element.date}`)
            this.salary.series[0].data.push(parseInt(element.avg_real_salary))
            this.salary.series[1].data.push(parseInt(element.avg_gena_salary))
            this.salary.series[2].data.push(parseInt(element.salary))
          })
        }
      })
    }
  }
}
</script>
