<template>
  <div>
    <b-row>
      <b-col>
        <div class="w-100 d-flex justify-content-between align-content-center mt-2 my-auto">
          <div class="mt-3">
            <h5 style="font-weight: bold">Điểm dừng - Sản lượng - Km</h5>
          </div>
          <div class="mt-3" style="cursor: default">
            <span @click="stateChartDriver = true" :class="{'tab-choose': stateChartDriver}">Sản lượng</span> | <span @click="stateChartDriver = false" :class="{'tab-choose': !stateChartDriver}">Km</span>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="p-3 mb-3 d-flex justify-content-center">
        <div>
          <div class="demo-vertical-spacing delivery-pick-container" style="overflow: auto">
            <vue-c3 :handler="barHandler" style="min-height: 400px" :style="customWidth" class="delivery-pick-chart" id="delivery-pick"></vue-c3>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import kpiProfilesService from 'domain/services/kpi-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import { mapGetters } from 'vuex'

export default {
  name: 'ChartPercentDriver',
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
    point: ['Số điểm dừng', 0, 0, 0, 0, 0, 0],
    weight: ['Sản lượng', 0, 0, 0, 0, 0, 0],
    distance: ['Km', 0, 0, 0, 0, 0, 0],
    type: this.position,
    stateChartDriver: true
  }),
  computed: {
    barOptions: function () {
      return {
        color: {pattern: ['#00904A', '#EEBF5C', '#EEBF5C']},
        data: {
          x: 'x',
          columns: this.columns,
          axes: this.axes,
          types: this.types
        },
        tooltip: {
          grouped: false
        },
        bar: {
          width: 15
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
              text: 'y label',
              position: 'outer-top'
            }
          },
          y2: this.yFormat
        },
        grid: {
          y: {
            show: true
          }
        }
      }
    },
    customWidth () {
      return {
        width: this.columns[0].length * (this.dataSend.viewType === 'date' ? 48 : 64) + 'px'
      }
    },
    axes () {
      return {
        'Số điểm dừng': 'y',
        'Sản lượng': 'y2',
        'Km': 'y2'
      }
    },
    types () {
      return {
        'Số điểm dừng': 'bar',
        'Sản lượng': 'bar',
        'Km': 'bar'
      }
    },
    yLabel () {
      return 'Điểm'
    },
    y2Label () {
      if (this.stateChartDriver) {
        return 'Sản lượng (T)'
      } else {
        return 'Km'
      }
    },
    yFormat () {
      return {
        show: true,
        type: 'linear',
        label: {
          text: 'y2 label',
          position: 'outer-top'
        },
        tick: {
          format: function (d) {
            return d
          }
        },
        min: 0,
        padding: {top: 0, bottom: 0}
      }
    },
    columns () {
      return [
        this.xAxis,
        this.point,
        this.stateChartDriver ? this.weight : this.distance
      ]
    },
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    barOptions () {
      this.barHandler.$emit('dispatch', chart => {
        const options = {
          columns: this.columns
        }
        let idUnload = ['Km', 'Sản lượng', 'data1', 'data2', 'data3']
        chart.unload({
          ids: idUnload,
          done: function () {
            chart.load(options)
          }
        })
        chart.axis.labels({
          x: this.dataSend.viewType === 'date' ? 'Ngày' : 'Tháng',
          y: this.yLabel,
          y2: this.y2Label
        })
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataDeliveryPick()
      }
    }
  },
  updated () {},
  mounted () {
    this.barHandler.$emit('init', this.barOptions)
    this.barHandler.$emit('dispatch', (chart) => chart.resize())
  },
  methods: {
    getDataDeliveryPick () {
      let dataSend = {
        user_id: this.$route.params.id,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType
      }
      kpiProfilesService.getDataDeliveryPick(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.xAxis = data.x
            this.point = data.point
            this.weight = data.weight
            this.distance = data.distance
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
    this.getDataDeliveryPick()
  }
}
</script>

<style src="@/vendor/libs/c3/c3.scss" lang="scss"></style>
<!--<style src="@/asset/libs/c3/c3.scss" lang="scss"></style>-->
<style src="@/assets/sass/components/OverviewProfile.scss" lang="scss"></style>

<style scoped>
.tab-choose {
  color: #00904A;
}
@media only screen and (min-width: 992px) {
  .delivery-pick-chart {
    min-width: 950px;
  }
  .delivery-pick-container {
    width: 950px;
  }
}
@media only screen and (min-width: 1200px) {
  .delivery-pick-chart {
    min-width: 1100px;
  }
  .delivery-pick-container {
    width: 1100px;
  }
}
@media only screen and (min-width: 1400px) {
  .delivery-pick-chart {
    min-width: 1300px;
  }
  .delivery-pick-container {
    width: 1300px;
  }
}

@media only screen and (min-width: 1600px) {
  .delivery-pick-chart {
    min-width: 1350px;
  }
  .delivery-pick-container {
    width: 1350px;
  }
}
</style>
