<template>
  <b-row>
    <b-col md="10" class="p-3 mb-3 d-flex justify-content-center">
      <div style="overflow: auto" class="salary-container">
        <vue-c3 :handler="lineHandler" :style="customWidth" style="min-height: 400px" class="salary-chart" id="salary"></vue-c3>
      </div>
    </b-col>
    <b-col md="2">
      <div>
        <div v-if="position === 'Xe công ty'" class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Xếp hạng khu vực</p>
          <p class="m-0" style="font-weight: bold">{{ranking}}</p>
        </div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0 p-0">Năng suất TB<span class="m-0 p-0" v-if="dataSend.viewType === 'date'">/ngày</span><span class="m-0 p-0" v-if="dataSend.viewType === 'month'">/tháng</span>
          </p>
          <p class="m-0" style="font-weight: bold"><span>{{timePerDate}} H | {{pointPerDate}} điểm | {{kmPerDate}} km | {{weightPerDte}} T</span></p>
        </div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Lương tài xế TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(salaryDriver) }} đ </p>
        </div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Chi phí TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(avgCost) }} đ</p>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import truckProfilesService from 'domain/services/truck-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ChartLineTruck',
  components: {
    VueC3
  },
  props: {
    dataSend: {
      type: Object,
      required: true
    },
    position: {
      type: String,
      required: true
    }
  },
  data: () => ({
    lineHandler: new Vue(),
    state: true,
    type: this.position,
    xAxis: ['x', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    fuelCost: ['Chi phí xăng dầu', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    repairDepre: ['Chi phí sửa chữa, bảo dưỡng', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    botCost: ['Chi phí BOT', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    refund: ['Bồi hoàn', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ranking: '0/0',
    timePerDate: 0,
    pointPerDate: 0,
    kmPerDate: 0,
    weightPerDte: 0,
    salaryDriver: 0,
    avgCost: 0
  }),
  computed: {
    lineOptions: function () {
      return {
        color: {pattern: ['#EB1414', '#E9693D', '#F59E9E', '#DEA52B']},
        data: {
          x: 'x',
          columns: [
            this.xAxis,
            this.fuelCost,
            this.repairDepre,
            this.botCost,
            this.refund
          ],
          axes: this.axes,
          types: this.types
        },
        tooltip: {
          grouped: false
        },
        axis: {
          x: {
            type: 'category',
            label: {
              text: 'Tháng',
              position: 'outer-right'
            },
            count: 11
          },
          y: {
            type: 'linear',
            label: {
              text: 'Tiền',
              position: 'outer-top'
            },
            min: 0,
            padding: {top: 0, bottom: 0}
          }
        },
        grid: {
          y: {
            show: true
          }
        }
      }
    },
    axes () {
      return {
        'Bồi hoàn': 'y',
        'Chi phí BOT': 'y',
        'Chi phí sửa chữa, bảo dưỡng': 'y',
        'Chi phí xăng dầu': 'y'
      }
    },
    types () {
      return {
        'Bồi hoàn': 'line',
        'Chi phí BOT': 'line',
        'Chi phí sửa chữa, bảo dưỡng': 'line',
        'Chi phí xăng dầu': 'line'
      }
    },
    yLabel () {
      return 'Tiền'
    },
    customWidth () {
      return {
        width: this.xAxis.length * 64 + 'px'
      }
    }
  },
  watch: {
    lineOptions () {
      this.lineHandler.$emit('dispatch', chart => {
        const options = {
          columns: [
            this.xAxis,
            this.fuelCost,
            this.repairDepre,
            this.botCost,
            this.refund
          ]
        }
        chart.unload({
          ids: ['data1', 'data2', 'data3', 'data4', 'Bồi hoàn', 'Chi phí BOT', 'Chi phí sửa chữa, bảo dưỡng', 'Chi phí xăng dầu'],
          done: function () {
            chart.load(options)
          }
        })
        chart.axis.labels({
          x: 'Tháng',
          y: this.yLabel
        })
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataChartCostTruck()
      }
    }
  },
  updated () {},
  mounted () {
    this.lineHandler.$emit('init', this.lineOptions)
    this.lineHandler.$emit('dispatch', (chart) => chart.resize())
  },
  methods: {
    FormatNumber (num) {
      if (num !== null) {
        return (num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      } else return num
    },
    getDataChartCostTruck () {
      let dataSend = {
        truck_order: this.$route.params.truck_order,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType
      }
      truckProfilesService.getDataChartCostTruck(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.xAxis = data.x_axis
            this.fuelCost = data.fuel_cost
            this.repairDepre = data.repair_depre
            this.botCost = data.bot_cost
            this.refund = data.refund
            this.ranking = data.ranking
            this.timePerDate = data.time_per_date
            this.pointPerDate = data.point_per_date
            this.kmPerDate = data.km_per_date
            this.weightPerDte = data.weight_per_date
            this.salaryDriver = data.salary_driver
            this.avgCost = data.avg_cost

            if (response.data.message !== 'success') {
              commonHelper.showMessage(response.data.message, 'warning')
            }
          } else {
            commonHelper.showMessage('Bạn không có quyền truy cập', 'error')
          }
        }
      }).catch((e) => {
        commonHelper.showMessage('Bạn không có quyền lấy dữ liệu', 'warning')
      }).then(() => {
      })
    }
  },
  created () {
    this.getDataChartCostTruck()
  }
}
</script>

<style src="@/vendor/libs/c3/c3.scss" lang="scss"></style>
<style src="@/assets/sass/components/OverviewProfile.scss" lang="scss"></style>

<style scoped>
.box-penalty {
  background: #FBFBFB;
  border: 0.5px solid rgba(151, 151, 151, 0.2);
  box-sizing: border-box;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
}

@media only screen and (min-width: 992px) {
  .salary-chart {
    min-width: 800px;
  }
  .salary-container {
    width: 800px;
  }
}
@media only screen and (min-width: 1200px) {
  .salary-chart {
    min-width: 950px;
  }
  .salary-container {
    width: 950px;
  }
}
@media only screen and (min-width: 1400px) {
  .salary-chart {
    min-width: 1000px;
  }
  .salary-container {
    width: 1110px;
  }
}

@media only screen and (min-width: 1600px) {
  .salary-chart {
    min-width: 1100px;
  }
  .salary-container {
    width: 1200px;
  }
}
</style>
