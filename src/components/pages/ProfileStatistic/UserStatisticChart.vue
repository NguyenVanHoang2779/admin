<template>
  <b-card-group>
    <div class="w-25 advance"  v-if="isShowAdvance">
      <b-form-group label="Trạng thái">
        <b-form-select v-model="user_status" :options="statusOptions" size="sm"></b-form-select>
      </b-form-group>
      <b-form-group label='Nâng cao'>
        <b-form-radio-group class="clear-padding" v-model="advanceStat" size="sm" stacked>
          <b-form-radio name="advance" value="gender">Giới tính</b-form-radio>
          <b-form-radio name="advance" value="department">Bộ phận</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
      <b-form-group class="radio-scroll clear-margin" label="Vị trí" v-if="advanceStat === 'department'">
        <b-form-radio-group class="clear-padding" size="sm" stacked v-model="department" :options="departmentOptions">
        </b-form-radio-group>
      </b-form-group>
    </div>
    <b-card img-top class="chart-w-100">
      <vue-echart @click="handleSelect" :options="pieOptions" :auto-resize="true"></vue-echart>
      <div class="btn-wraper">
        <b-btn variant="default" :class="isShowAdvance ? 'btn-left' : 'btn-center'" @click="toggleAdvance">
          <i :class="isShowAdvance ? 'ion ion-ios-arrow-back' : 'ion ion-ios-arrow-forward'"></i>
          {{isShowAdvance ? `Ẩn nâng cao` : `Nâng cao`}}
        </b-btn>
        <b-btn v-if="!exporting" variant="outline-info" class="btn-right" @click="exportUserStat()"> Xuất dữ liệu</b-btn>
        <b-btn v-else variant="outline-primary" class="exporting-btn btn-right">
            <span>
              <div class="sk-folding-cube sk-primary">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
              </div>
              Đang xuất...</span>
          </b-btn>
      </div>
    </b-card>
  </b-card-group>
</template>

<style lang="scss" scoped>
  .chart-w-100 .echarts {
    width: unset
  }
  .btn-wraper {
    position: relative;
    height: 25px;
  }
  .btn-left {
    position: absolute;
    left: 0;
  }
  .btn-right {
    position: absolute;
    right: 0;
  }
  .btn-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%)
  }

  .advance {
    margin-right: 15px;
  }

  .radio-scroll .custom-controls-stacked {
    max-height: 277px;
    overflow-y: scroll
  }
  .clear-padding{
    padding: 0!important
  }
  .clear-margin{
    margin: 0!important
  }

  .exporting-btn {
    span {
      position: relative; padding-left: 20px
    }
    .sk-folding-cube{
      position: absolute; height: 12px; width: 12px; top: -37px; left: 0
    }
  }
</style>

<script>

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'

import profileStatisticService from 'domain/services/profile-statistic-service'

export default {
  name: 'user-statistic-chart',

  components: {
    'vue-echart': ECharts
  },

  props: [
    'filter',
    'departments',
    'reload'
  ],

  data: () => ({
    flatPickrConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y'
    },

    pieOptions: {
      title: {
        text: 'User Profile',
        subtext: 'Trạng thái',
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
        x: 'bottom',
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

    statusLocale: {
      '1': 'Khóa tạm thời',
      '2': 'Khóa vĩnh viễn',
      '3': 'Đang hoạt động'
    },

    isShowAdvance: false,

    advanceStat: '',
    department: null,
    departmentOptions: [],
    filters: {},
    reqData: {},
    user_status: null,
    statusOptions: [
      {text: 'Tất cả trạng thái', value: null},
      {text: 'Khóa tạm thời', value: 1},
      {text: 'Khóa vĩnh viễn', value: 2},
      {text: 'Đang hoạt động', value: 3}
    ],

    advances: {
      null: 'Trạng thái',
      gender: 'Giới tính',
      department: 'Bộ phận'
    },

    exporting: false
  }),

  created () {
    this.getUserStat(null, null)
    this.departmentOptions = JSON.parse(JSON.stringify(this.departments))
  },

  watch: {
    reload: function (newVal, oldVal) {
      if (this.department) {
        this.getUserStat(this.user_status, {department: this.department})
      } else this.getUserStat(this.user_status, this.advanceStat)
    },

    advanceStat: function (newVal, oldVal) {
      this.getUserStat(this.user_status, newVal)
      this.pieOptions.title.subtext = this.advances[newVal + '']
      this.department = null
    },

    user_status: function (newVal, oldVal) {
      if (this.department) {
        this.getUserStat(this.user_status, {department: this.department})
      } else this.getUserStat(this.user_status, this.advanceStat)
      this.pieOptions.title.text = this.statusOptions.find(option => option.value === newVal).text
    },

    department: function (newVal, oldVal) {
      if (newVal) {
        this.pieOptions.title.subtext = newVal
        this.getUserStat(this.user_status, {department: newVal})
      }
    },

    departments: function (newVal, oldVal) {
      this.departmentOptions = JSON.parse(JSON.stringify(this.departments))
    }
  },

  methods: {
    handleSelect (event) {
      let statusId = Object.keys(this.statusLocale).find(key => this.statusLocale[key] === event.name)
      if (statusId) {
        this.isShowAdvance = true
        this.advanceStat = 'gender'
        this.user_status = statusId
      } else {
        let department = Object.keys(this.departmentLocale).find(key => this.departmentLocale[key] === event.name)
        if (department) this.getDepartment()
      }
    },

    getUserStat (statusId, advance) {
      let dataSend = {
        region: this.filter.region,
        province_id: this.filter.provinceId,
        station_id: this.filter.stationId,
        start_date: this.filter.startDate,
        end_date: this.filter.endDate,
        advance: advance,
        status_id: statusId
      }
      this.reqData = dataSend
      profileStatisticService.getUserStat(dataSend)
        .then(response => {
          this.pieOptions.series[0].data = []
          this.pieOptions.legend.data = []
          let data = response.data.data

          // Default: No advance option -> Map status_id to status_name
          if (!advance) {
            data.forEach(element => {
              this.pieOptions.series[0].data.push({
                name: this.statusLocale[element.name],
                value: parseInt(element.value)
              })
              this.pieOptions.legend.data.push(this.statusLocale[element.name])
            })
            return
          }

          // Limit number of element on pie to 6
          if (advance === 'department') {
            this.departmentOptions = JSON.parse(JSON.stringify(this.departments))
            data.forEach(datum => {
              let index = this.departments.findIndex(depart => depart.text === datum.name)
              if (index >= 0) {
                this.departmentOptions[index].text = datum.name + ' (' + datum.value + ')'
              }
            })
            for (let i = Math.max(0, data.length - 5); i < data.length; i++) {
              this.pieOptions.series[0].data.push({
                name: data[i].name,
                value: parseInt(data[i].value)
              })
              this.pieOptions.legend.data.push(data[i].name)
            }

            let countOther = 0
            for (let i = 0; i < data.length - 5; i++) countOther += parseInt(data[i].value)
            this.pieOptions.series[0].data.push({
              name: 'Bộ phận khác',
              value: countOther
            })
            this.pieOptions.legend.data.push('Bộ phận khác')
          } else {
            data.forEach(element => {
              this.pieOptions.series[0].data.push({
                name: element.name,
                value: parseInt(element.value)
              })
              this.pieOptions.legend.data.push(element.name)
            })
          }
        })
    },

    getDepartment () {

    },

    getPosition () {
    },

    exportUserStat () {
      this.exporting = true
      profileStatisticService.exportUserStat(this.reqData)
        .then(res => {
          if (res.data.success) {
            window.location.href = res.data.URL
            this.$notify({
              group: 'default',
              type: 'text-white bg-primary',
              title: 'Xuất file thành công',
              text: 'Đã xuất xong file'
            })
          } else {
            this.$notify({
              group: 'default',
              type: 'text-white bg-warning',
              title: 'Xảy ra lỗi',
              text: res.data.message
            })
          }
          this.exporting = false
        })
    },

    toggleAdvance () {
      this.isShowAdvance = !this.isShowAdvance
      if (!this.isShowAdvance) {
        this.pieOptions.title.text = 'User Profile'
        this.user_status = null
        this.advanceStat = null
        this.getUserStat(null, null)
      }
    }
  }
}
</script>
