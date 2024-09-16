<template>
  <b-row>
    <b-col md="10" class="p-3 mb-3 d-flex justify-content-center">
      <div style="overflow: auto" class="salary-container">
        <vue-c3 :handler="barHandler" style="min-height: 400px" :style="customWidth" class="salary-chart" id="salary"></vue-c3>
      </div>
    </b-col>
    <b-col md="2">
      <div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Xếp hạng khu vực</p>
          <p class="m-0" style="font-weight: bold">{{rankingOfCod}}</p>
        </div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0 p-0">Năng suất TB<span class="m-0 p-0" v-if="dataSend.viewType === 'date'">/ngày</span><span class="m-0 p-0" v-if="dataSend.viewType === 'month'">/tháng</span>
          </p>
          <p class="m-0" v-html="avg_productivity" style="font-weight: bold"></p>
        </div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Lương TB</p>
          <p class="m-0" style="font-weight: bold">{{salaryAvg}} VNĐ </p>
        </div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Phạt lương TB</p>
          <p class="m-0" style="font-weight: bold">{{penaltyAvg}} VNĐ</p>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import kpiProfilesService from 'domain/services/kpi-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ChartBar',
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
    barHandler: new Vue(),
    xAxis: ['x', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    salary: ['Lương', 0, 0, 0, 0, 0, 0],
    reward: ['Thưởng', 0, 0, 0, 0, 0, 0],
    penalty: ['Phạt', 0, 0, 0, 0, 0, 0],
    refund: ['Bồi hoàn', 0, 0, 0, 0, 0, 0],
    salaryAvg: 0,
    penaltyAvg: 0,
    avg_productivity: 0,
    rankingOfCod: '0/0'
  }),
  computed: {
    barOptions: function () {
      return {
        color: {pattern: ['#00904A', '#64522a', '#D2494D', '#EEBF5C']},
        data: {
          x: 'x',
          columns: [
            this.xAxis,
            this.salary,
            this.reward,
            this.penalty,
            this.refund
          ],
          type: 'bar',
          groups: [
            ['Lương', 'Thưởng']
          ],
          stack: {
            normalize: true
          }
        },
        tooltip: {
          grouped: false
        },
        bar: {
          width: 12
        },
        axis: {
          x: {
            type: 'category',
            label: {
              text: 'Tháng',
              position: 'outer-right'
            }
          },
          y: {
            type: 'linear',
            label: {
              text: 'Tiền',
              position: 'outer-top'
            },
            tick: {
              format: function (d) {
                return d < 1000000 ? d + ' VNĐ' : ((d / 1000000)).toFixed(2) + ' tr'
              }
            }
          }
        },
        grid: {
          y: {
            show: true
          }
        },
        legend: {
          inset: {
            anchor: 'top-right',
            x: 0,
            y: 30,
            step: 2
          }
        }
      }
    },
    customWidth () {
      return {
        width: this.xAxis.length * 64 + 'px'
      }
    }
  },
  updated () {},
  mounted () {
    this.barHandler.$emit('init', this.barOptions)
    this.barHandler.$emit('dispatch', (chart) => chart.resize())
  },
  watch: {
    barOptions () {
      this.barHandler.$emit('dispatch', chart => {
        const options = {
          columns: [
            this.xAxis,
            this.salary,
            this.reward,
            this.penalty,
            this.refund
          ]
        }
        let idUnload = ['Lương', 'Thưởng', 'Phạt', 'Bồi hoàn']
        chart.unload({
          id: idUnload,
          done: function () {
            chart.load(options)
          }
        })
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataSalaryReward()
        this.getDataTabOverview()
      }
    }
  },
  methods: {
    getDataSalaryReward () {
      let dataSend = {
        user_id: this.$route.params.id,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType
      }
      kpiProfilesService.getDataSalaryReward(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.xAxis = data.x_axis
            this.salary = data.gross_salary
            this.reward = data.sum_reward_salary
            this.penalty = data.penalty_salary
            this.refund = data.refund_salary
            this.penaltyAvg = data.avg_penalty
            this.salaryAvg = data.avg_salary
            this.avg_productivity = data.avg_productivity
            this.rankingOfCod = data.ranking
          } else {
            commonHelper.showMessage(response.data.message, 'error')
          }
        }
      }).catch((e) => {
        commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'error')
      }).then(() => {
      })
    }
  },
  created () {
    this.getDataSalaryReward()
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
