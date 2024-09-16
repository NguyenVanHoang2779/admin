<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading">Thống kê profile</h4>
    </div>
    <hr />
    <b-row>
      <b-col>
        <single-select-profile-region @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
      </b-col>
      <b-col>
        <single-select-province :region-name="'' + filter.region" @handleSelectedProvince="handleSelectedProvince"></single-select-province>
      </b-col>
      <b-col>
        <single-select-station :province-id="filter.provinceId" @handleSelectedStation="handleSelectedStation"></single-select-station>
      </b-col>
      <b-col class="text-right">
        <b-btn class="btn-custom" @click="getStats">Thống kê</b-btn>
      </b-col>
    </b-row>
    <b-row class="mb-3">
        <b-col md="6">
            <div class="card chart-fullwidth">
              <div class="card-body back-smoke">
                <user-statistic-chart :filter="filter" :departments="listDepartment" :reload="reload"></user-statistic-chart>
              </div>
            </div>
        </b-col>
        <b-col md="6">
            <div class="card chart-fullwidth">
              <div class="card-body back-smoke">
                <age-statistic-chart :filter="filter" :departments="listDepartment" :reload="reload"></age-statistic-chart>
                <!-- <master-profile-statistic-chart :filter="filter"></master-profile-statistic-chart> -->
              </div>
            </div>
        </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col md="6">
          <div class="card chart-fullwidth">
            <div class="card-body">
              <vue-echart :options="pieData.gender" :auto-resize="true"></vue-echart>
            </div>
          </div>
      </b-col>
      <b-col md="6">
          <div class="card chart-fullwidth">
            <div class="card-body">
              <vue-echart :options="pieData.cnb_confirmed" :auto-resize="true"></vue-echart>
            </div>
          </div>
      </b-col>
    </b-row>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<style scoped>
  .chart-fullwidth .echarts{
    width: auto;
  }
  .btn-custom{
    min-width: 150px;
    background: #8caabf;
    font-weight: 500;
    text-transform: uppercase;
  }
  .btn-custom:hover{
    background: #4e728b;
  }
  .back-smoke{
    background: #f5f5f5
  }
</style>

<script>
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import flatPickr from 'vue-flatpickr-component'

import UserStatisticChart from './UserStatisticChart'
import MasterProfileStatisticChart from './MasterProfileStatisticChart'
import AgeStatisticChart from './AgeStatisticChart'

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import moment from 'moment'

import profileStatisticService from 'domain/services/profile-statistic-service'
import profileService from 'domain/services/profile-service'
export default {
  name: 'profile-statistic',

  components: {
    'vue-echart': ECharts,
    SingleSelectProfileRegion,
    SingleSelectProvince,
    SingleSelectStation,
    UserStatisticChart,
    MasterProfileStatisticChart,
    AgeStatisticChart,
    flatPickr
  },

  data: () => ({
    reload: false,
    flatPickrConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y'
    },

    pieOptions: {
      title: {
        text: '',
        subtext: '',
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
        x: 'right',
        y: '20%',
        data: []
      },
      series: [{
        name: 'Trạng thái',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: [],
        itemStyle: {
          normal: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }],
      animationDuration: 2000
    },

    pieData: {
      user_status: {},
      master_profile_status: {},
      gender: {},
      cnb_confirmed: {}
    },

    barOptions: {
      title: {
        text: 'Titlter here',
        subtext: 'Sub title here',
        x: 'center'
      },
      color: ['#2F4554'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
      },
      grid: {
        left: '5%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Col-1', 'Col-2', 'Col-3', 'Col-4', 'Col-5', 'Col-6', 'Col-7'],
          axisTick: {
            alignWithLabel: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Số lượng',
          type: 'bar',
          barWidth: '30%',
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ]
    },

    barData: {
      age: {}
    },

    filter: {
      region: '',
      provinceId: '',
      stationId: ''
    },

    pieStats: ['user_status', 'master_profile_status', 'gender', 'cnb_confirmed'],
    barStats: ['age'],
    listDepartment: []
  }),

  created () {
    this.pieStats.forEach(stat => {
      this.pieData[stat] = JSON.parse(JSON.stringify(this.pieOptions))
    })

    this.setTitles()

    this.getStats()

    this.getListDepartment()
  },

  methods: {
    testFunc (event) {
      console.log(event)
    },

    handleSelectedRegion (option) {
      this.filter.region = option ? option.id : ''
    },

    handleSelectedProvince (option) {
      this.filter.provinceId = option ? option.id : ''
    },

    handleSelectedStation (option) {
      this.filter.stationId = option ? option.id : ''
    },

    getStats () {
      this.reload = !this.reload
      let startDate = null
      let endDate = null

      // get start_date, end_date
      if (this.filter.dateRange) {
        let range = this.filter.dateRange.split('to').map(item => item.trim())
        if (range.length === 2) {
          startDate = moment(range[0], 'DD-MM-YYYY').format('YYYY-MM-DD')
          endDate = moment(range[1], 'DD-MM-YYYY').format('YYYY-MM-DD')
        }
      }

      let dataSend = {
        'region': this.filter.region,
        'province_id': this.filter.provinceId,
        'station_id': this.filter.stationId,
        'start_date': startDate,
        'end_date': endDate
      }

      profileStatisticService.getStats(dataSend)
        .then(response => {
          if (response.data.success) {
            // Fill data to pieChart
            this.pieStats.forEach(stat => {
              this.pieData[stat].series[0].data = []
              this.pieData[stat].legend.data = []

              let data = response.data.data[stat]
              data.forEach(element => {
                this.pieData[stat].series[0].data.push({
                  name: element.name,
                  value: parseInt(element.value)
                })
                this.pieData[stat].legend.data.push(element.name)
              })
            })

            // Fill data to barChart
            this.barStats.forEach(stat => {
              this.barData[stat].xAxis[0].data = []
              this.barData[stat].series[0].data = []
              let data = response.data.data[stat]
              data.forEach(element => {
                this.barData[stat].series[0].data.push({
                  name: element.name,
                  value: parseInt(element.value)
                })
                this.barData[stat].xAxis[0].data.push(element.name)
              })
            })
          }
        })
    },

    setTitles () {
      this.pieData.user_status.title.text = 'User Profile'
      this.pieData.user_status.title.subtext = 'Trạng thái'

      this.pieData.master_profile_status.title.text = 'Master Profile'
      this.pieData.master_profile_status.title.subtext = 'Trạng thái'

      this.pieData.gender.title.text = 'Giới tính'
      this.pieData.gender.title.subtext = 'Tỉ lệ giới tính'

      this.pieData.cnb_confirmed.title.text = 'Trạng thái xác nhận hồ sơ'
      this.pieData.cnb_confirmed.subtext = 'Trạng thái'

      this.barStats.forEach(stat => {
        this.barData[stat] = JSON.parse(JSON.stringify(this.barOptions))
      })

      this.barData.age.title.text = 'Độ tuổi nhân viên'
      this.barData.age.title.subtext = ' (Số lượng/Tuổi)'
    },

    getListDepartment () {
      profileService.getDepartmentList()
        .then(res => {
          if (res.data.success) {
            this.listDepartment = res.data.data.map(department => { return {'text': department.name, 'value': department.id} })
          }
        })
    }
  }
}
</script>
