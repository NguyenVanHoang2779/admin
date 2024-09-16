<template>
    <b-card no-body class="mb-4" style="max-height: 94%; height: 94%">
        <b-card-header header-tag="h6" class="with-elements">
            <div class="row">
              <div> &nbsp;</div>
              <div>Ticket bạn xử lý trong &nbsp;</div>
                <div>
                    <div class="dropdown">
                        <select v-model="multipleValue" @change="dayWeekMonth()">
                            <option v-for="time in multipleOptions" :value="time"  >{{time.name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="card-header-elements ml-auto">
                <b-btn variant="outline-primary" class="btn-xs icon-btn md-btn-flat"><i class="ion ion-md-sync"></i></b-btn>
            </div>
        </b-card-header>
        <div>
            <div>
                <div>
<!--                    <vue-echart @legendselectchanged="onClickChart" style="width: auto; height: 260px" :options="pieOptions" :auto-resize="true"></vue-echart>-->
                  <vue-echart @legendselectchanged="onClickChart($event)"  style="width: auto; height: 260px" :options="pieOptions" :auto-resize="true"></vue-echart>
                </div>
            </div>
        </div>
    </b-card>
</template>

<script>
import PieChart from '../js/PieChart'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import sosService from 'domain/services/internal-sos-service'
import moment from 'moment'

const optionSelectTime = [
  { code: 1, name: 'Hôm nay' },
  { code: 2, name: '7 ngày gần đây' },
  { code: 3, name: '1 tháng gần đây' },
  { code: 4, name: 'Tất cả thời gian' }
]
export default {
  name: 'chart-sos-ticket',
  components: {
    PieChart,
    'vue-echart': ECharts,
    sosService
  },
  watch: {
    multipleValue () {
      this.$emit('timeChange', this.time)
    }
  },
  data () {
    return {
      pieOptions: {
        tooltip: {
          show: false
        },
        legend: {
          orient: 'vertical',
          // icon: 'triangle',
          formatter: name => {
            let itemValue = this.pieOptions.series[0].data.filter(item => item.name === name)
            return `${name}: ${itemValue[0].value}`
          },
          right: 10,
          top: 20,
          bottom: 20
        },
        series: [
          {
            name: 'SOS nội bộ',
            type: 'pie',
            radius: '70%',
            center: ['30%', '50%'],
            color: ['#fe3266', '#3977ad', '#6cbd7d'],
            data: [
              {value: 0, name: 'Chưa tiếp nhận'},
              {value: 0, name: 'Đang xử lý'},
              {value: 0, name: 'Đã xử lý'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            emphasis: {
              label: {
                show: true,
                formatter: '{b}\n{d}%'
              }
            },
            label: {
              normal: {
                formatter: '',
                position: 'inside'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            }
          }
        ],
        graphic: [
          {
            id: 'xxx',
            type: 'image',
            onclick: function () {
            }
          }
        ]
      },
      multipleOptions: optionSelectTime,
      multipleValue: optionSelectTime[2]
    }
  },
  created () {
    this.dayWeekMonth()
  },
  methods: {
    onClickChart (event) {
      let status = []
      for (let i = 0; i < 3; i++) {
        if (event.selected[this.pieOptions.series[0].data[i].name]) {
          status.push(i + 1)
        }
      }
      this.dayWeekMonth(status)
    },
    showDataResponse (time) {
      sosService.apiGetCountTicketGroupByType(time).then(response => {
        if (response.hasOwnProperty('data')) {
          for (let i = 0; i < 3; i++) {
            this.pieOptions.series[0].data[i].value = response.data.data[i + 1]
          }
        }
      })
    },
    dayWeekMonth (status = [1, 2, 3]) {
      let today = new Date()
      let time = {
        end: moment(today).format('YYYY-MM-DD 23:59:59'),
        start: '',
        status: status
      }
      if (this.multipleValue.code === 1) {
        time.start = moment(today).format('YYYY-MM-DD 00:00:00')
      }
      if (this.multipleValue.code === 2) {
        today.setDate(today.getDate() - 7)
        time.start = moment(today).format('YYYY-MM-DD 00:00:00')
      }
      if (this.multipleValue.code === 3) {
        today.setMonth(today.getMonth() - 1)
        time.start = moment(today).format('YYYY-MM-DD 00:00:00')
      }
      if (this.multipleValue.code === 4) {
        time.start = time.end = ''
      }
      this.showDataResponse(time)
      this.$emit('timeChange', time)
    }
  }
}
</script>
<style scoped>
</style>
