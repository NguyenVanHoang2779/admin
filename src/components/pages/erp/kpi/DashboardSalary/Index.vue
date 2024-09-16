<template>
<div>
  <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-3">
    <div>Quản lý biến động lương</div>
  </h4>
  <b-card class="mb-3">
    <b-row>
      <b-col sm="4" class="mb-3">
        <label class="font-italic">Nhân viên:</label>
        <select-user @model="searchData.selectCodeCod = $event" :holder="'Chọn nhân viên'" :value="searchData.selectCodeCod"></select-user>
      </b-col>
      <b-col sm="4">
        <label class="font-italic">Tháng lương:</label>
        <vue-monthly-picker v-model="searchData.selectedMonth"></vue-monthly-picker>
      </b-col>
      <b-col class="mt-4" xs="12">
        <b-row class="my-1">
          <b-col class="d-flex justify-content-lg-center justify-content-xl-center justify-content-xxl-end mb-1">
            <ladda-btn :loading="loading.search" data-style="zoom-out"
                       class="btn btn-success w-200px" @click.native="getSalaryUser">
              <i class="ion ion-md-search"></i> Tìm kiếm
            </ladda-btn>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-card>
  <b-card no-body style="overflow-x: auto">
    <table class="table table-hover">
      <thead class="bg-secondary text-white table-bordered">
      <tr>
        <th style="width: 20%; min-width: 200px">Thông tin nhân viên</th>
        <th style="width: 80%; min-width: 1200px">Biến động lương</th>
      </tr>
      </thead>
      <tbody class="table-bordered">
      <tr v-for="item in dataConfig" :key="item.index">
        <td style="width: 20%; min-width: 200px">
          <div class="row mb-1 pt-1">
            <!--                Thông tin người bị phạt-->
            <div class="col-md">
              <i class="ion ion-ios-contact font-size-130-percent"></i>
              <span>
                    {{ item.user_info.alias }}/
                    {{ item.user_info.username }}/
                    {{ item.user_info.fullname }}/
                    {{ item.user_info.province_name }}/
                    {{ item.user_info.station_name }}/
                    {{ item.user_info.position_name }}
                  </span>
              <br/>
              <hr/>
              <span>
                Ca làm việc: {{ item.user_info.work_shift }}
              </span>
              <br/>
              <span>
                Kiểu làm việc: {{ item.user_info.work_type_description }}
              </span>
              <br/>
              <hr/>
              <span>Số ngày công: {{ item.total_workday }}</span>
            </div>
          </div>
        </td>
        <td style="width: 80%; min-width: 1200px">
          <div class="echarts m-0 p-0">
            <vue-echart :options="item.lineOptions" :auto-resize="true"></vue-echart>
          </div>
          <div class="text-center">
            <span class="font-weight-bold">Biểu đồ: </span>Biến động lương tháng {{ item.month }}/{{ item.year }}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </b-card>
</div>
</template>

<style scoped>
.echarts {
  width: 100% !important;
}
</style>

<script>
import VueMonthlyPicker from 'vue-monthly-picker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import debounce from 'debounce'
import SelectUser from './SelectUser'
import moment from 'moment'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import salaryDashboard from 'domain/services/salary-dashboard-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'index',
  components: {
    VueMonthlyPicker,
    LaddaBtn,
    debounce,
    SelectUser,
    'vue-echart': ECharts,
    commonHelper
  },
  data: () => ({
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 5,
      totalItems: 0
    },
    dataConfig: [],
    searchData: {
      selectCodeCod: [],
      selectedMonth: moment(new Date()).format('YYYY/MM')
    },
    loading: {
      search: false
    }
  }),
  methods: {
    getSalaryUser () {
      if (this.searchData.selectCodeCod.length === 0) return commonHelper.showMessage('Vui lòng chọn COD')
      let dataSearch = {
        user_ids: this.searchData.selectCodeCod,
        month: new Date(this.searchData.selectedMonth).getMonth() + 1,
        year: new Date(this.searchData.selectedMonth).getFullYear()
      }
      this.dataConfig = []
      this.loading.search = true
      salaryDashboard.getAllSalaryUserInMonth(dataSearch).then((res) => {
        if (res.data.hasOwnProperty('success')) {
          if (res.data.success) {
            let data = res.data.data
            Object.values(data).forEach(item => {
              this.dataConfig.push({
                user_id: item.user_id,
                total_workday: item.total_workday,
                user_info: item.user_info,
                month: item.month,
                year: item.year,
                lineOptions: {
                  color: '#647c8a',
                  title: {
                    text: 'Line chart'
                  },
                  legend: {
                    data: ['line']
                  },
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#46494d',
                    textStyle: {
                      fontSize: 11
                    }
                  },
                  xAxis: {
                    data: item.cur_date,
                    axisLine: {
                      lineStyle: {color: 'rgba(0, 0, 0, .08)'}
                    },
                    axisLabel: {color: 'rgba(0, 0, 0, .5)'}
                  },
                  yAxis: {
                    splitLine: {show: true},
                    axisLine: {
                      lineStyle: {color: 'rgba(0, 0, 0, .08)'}
                    },
                    axisLabel: {color: 'rgba(0, 0, 0, .5)'}
                  },
                  series: [{
                    type: 'line',
                    showSymbol: false,
                    data: item.total_salary
                  }],
                  animationDuration: 2000
                }
              })
              this.$forceUpdate()
            })
            if (this.dataConfig.length === 0) {
              commonHelper.showMessage('Không có dữ liệu lương', 'warning')
            } else {
              commonHelper.showMessage('Lấy dữ liệu thành công', 'success')
            }
          } else {
            this.dataConfigs = []
            commonHelper.showMessage('Có lỗi khi lấy dữ liệu phạt', 'error')
          }
        }
      }).catch(e => {
        commonHelper.showMessage('Có lỗi khi lấy dữ liệu phạt', 'error')
      }).then(() => {
        this.loading.search = false
      })
    }
  },
  created () {
  }
}
</script>
