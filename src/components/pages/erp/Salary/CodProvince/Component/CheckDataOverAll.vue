<template>
  <div>
    <br>
    <b-row>
      <b-col>
        <h5>Nhập username</h5>
        <b-form-input v-model="userName" :disabled="codAlias !== ''"></b-form-input>
      </b-col>
      <b-col>
        <h5>Nhập mã cod</h5>
        <b-form-input v-model="codAlias" :disabled="userName !== ''"></b-form-input>
      </b-col>
      <b-col>
        <h5>Nhập năm</h5>
        <b-form-input v-model="year"></b-form-input>
      </b-col>
      <b-col>
        <h5><br></h5>
        <b-button @click="showSalaryByYear" variant="primary" :disabled="isProcessing !== false">Xem thống kê <i v-if="isProcessing !== false" class="fa fa-spin fa-spinner"></i></b-button>
      </b-col>
    </b-row>
    <hr class="mt-3 mb-3">
    <b-row>
      <vue-echart v-if="dataOverAll != null" class="full-width" :options="salary"/>
    </b-row>
    <hr class="mt-3 mb-3">
    <b-row>
      <vue-echart v-if="dataOverAll != null" class="full-width" :options="quantity"/>
    </b-row>
  </div>
</template>

<style scoped>
  .btn-header {
    width: 250px;
  }
  .full-width {
    width: 100%;
  }
</style>

<script>
import SalaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
export default {
  name: 'check-data-over-all',
  components: {
    'vue-echart': ECharts
  },
  watch: {
    codAlias (newVal, oldVal) {
      if (newVal !== '') {
        this.userName = ''
      }
    },
    userName (newVal, oldVal) {
      if (newVal !== '') {
        this.codAlias = ''
      }
    }
  },
  data: () => ({
    codAlias: '',
    userName: '',
    year: '2020',
    dataOverAll: null,
    isProcessing: false,
    salary: {
      title: {
        text: 'Lương Kpi'
      },
      color: ['green', 'purple', 'blue', 'orange', 'brown', 'red', 'yellow', 'cyan'],
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
          'Lương năng suất',
          'Thù lao điểm',
          'Thưởng tốc độ',
          'Thưởng chất lượng lấy',
          'Thưởng chất lượng giao',
          'Thưởng chất lượng trả',
          'Lương tích lũy cân nặng',
          'Lương tăng ca',
          'Lương phụ cấp tối'
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
          name: 'Lương năng suất',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Thù lao điểm',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Thưởng tốc độ',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Thưởng chất lượng lấy',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Thưởng chất lượng giao',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Thưởng chất lượng trả',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Lương tích lũy cân nặng',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Lương tăng ca',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        },
        {
          name: 'Lương phụ cấp tối',
          type: 'line',
          stack: 'kpi',
          areaStyle: {},
          data: []
        }
      ]
    },
    quantity: {
      title: {
        text: 'Lương Kpi'
      },
      color: ['green', 'purple', 'blue', 'orange', 'pink'],
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
          'Tổng đơn giao thành công',
          'Tổng đơn lấy thành công',
          'Tổng đơn trả thành công',
          'Tổng điểm lấy thành công',
          'Tổng điểm trả thành công'
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
          name: 'Tổng đơn giao thành công',
          type: 'line',
          stack: 'quantityPkg',
          areaStyle: {},
          data: []
        },
        {
          name: 'Tổng đơn lấy thành công',
          type: 'line',
          stack: 'quantityPkg',
          areaStyle: {},
          data: []
        },
        {
          name: 'Tổng đơn trả thành công',
          type: 'line',
          stack: 'quantityPkg',
          areaStyle: {},
          data: []
        },
        {
          name: 'Tổng điểm lấy thành công',
          type: 'line',
          stack: 'quantityPkg',
          areaStyle: {},
          data: []
        },
        {
          name: 'Tổng điểm trả thành công',
          type: 'line',
          stack: 'quantityPkg',
          areaStyle: {},
          data: []
        }
      ]
    }
  }),
  methods: {
    showSalaryByYear () {
      if (this.year === '') return commonHelper.showMessage('Vui điền năm', 'warning')
      let dataSend = null
      if (this.codAlias !== '') {
        dataSend = {
          year: this.year,
          cod_alias: this.codAlias
        }
      }
      if (this.userName !== '') {
        dataSend = {
          year: this.year,
          username: this.userName
        }
      }
      if (dataSend === null) return commonHelper.showMessage('Vui lòng điền username hoặc mã cod')
      this.isProcessing = true
      SalaryService.showSalaryByYear(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.dataOverAll = res.data.data
          this.drawChartOverView(this.dataOverAll)
          this.isProcessing = false
        } else {
          commonHelper.showMessage(res.data.message)
          this.dataOverAll = null
          this.isProcessing = false
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra! Vui lòng thử lại sau', 'warning'))
    },

    drawChartOverView (dataOverView) {
      this.salary.xAxis.data = []
      this.salary.series[0].data = []
      this.salary.series[1].data = []
      this.salary.series[2].data = []
      this.salary.series[3].data = []
      this.salary.series[4].data = []
      this.salary.series[5].data = []
      this.salary.series[6].data = []
      this.salary.series[7].data = []
      this.salary.series[8].data = []
      // sản lượng
      this.quantity.xAxis.data = []
      this.quantity.series[0].data = []
      this.quantity.series[1].data = []
      this.quantity.series[2].data = []
      this.quantity.series[3].data = []
      this.quantity.series[4].data = []
      if (dataOverView === null) return null
      Object.values(dataOverView).forEach(data => {
        this.salary.xAxis.data.push(`Tháng ${data.month}`)
        this.salary.series[0].data.push(parseInt(data.salary_cod_province.d_p_r_salary)) // Lương năng suất
        this.salary.series[1].data.push(parseInt(data.salary_cod_province.pl_salary)) // Thù lao điểm
        this.salary.series[2].data.push(parseInt(data.salary_cod_province.d_reward_speed_salary)) // Thưởng tốc độ
        this.salary.series[3].data.push(parseInt(data.salary_cod_province.p_reward_quality_salary)) // Thưởng chất lượng lấy
        this.salary.series[4].data.push(parseInt(data.salary_cod_province.d_reward_quality_salary)) // Thưởng chất lượng giao
        this.salary.series[5].data.push(parseInt(data.salary_cod_province.r_reward_quality_salary)) // Thưởng chất lượng trả
        this.salary.series[6].data.push(parseInt(data.salary_cod_province.weight_salary)) // Lương tích lũy cân nặng
        this.salary.series[7].data.push(parseInt(data.salary_cod_province.bonus_work_on_sunday)) // Lương tăng ca
        this.salary.series[8].data.push(parseInt(data.salary_cod_province.bonus_work_on_night)) // Lương phụ cấp tối
        // sản lượng
        this.quantity.xAxis.data.push(`Tháng ${data.month}`)
        this.quantity.series[0].data.push(parseInt(data.salary_cod_province.d_pkg_success))
        this.quantity.series[1].data.push(parseInt(data.salary_cod_province.p_pkg_success))
        this.quantity.series[2].data.push(parseInt(data.salary_cod_province.r_pkg_success))
        this.quantity.series[3].data.push(parseInt(data.salary_cod_province.p_pl_success))
        this.quantity.series[4].data.push(parseInt(data.salary_cod_province.r_pl_success))
      })
    }
  }
}
</script>
