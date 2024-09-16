<template>
  <div>
    <b-row>
      <b-col>
        <div class="w-100 d-flex justify-content-between align-content-center mt-2 my-auto">
          <div class="mt-3">
            <h5 style="font-weight: bold">Tỷ lệ giao/lấy/trả hàng thành công</h5>
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

export default {
  name: 'ChartBarAndLine',
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
    columns: [
      ['x', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
      ['data1', 0, 0, 0, 0, 0, 0],
      ['data2', 0, 0, 0, 0, 0, 0],
      ['data3', 0, 0, 0, 0, 0, 0]
    ],
    state: true,
    type: this.position
  }),
  computed: {
    barOptions: function () {
      return {
        color: {pattern: ['#00904A', '#EEBF5C', '#E9693D']},
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
          y2: {
            show: true,
            type: 'linear',
            label: {
              text: 'y2 label',
              position: 'outer-top'
            },
            tick: {
              format: function (d) {
                return d >= 0 ? d + '%' : '-'
              }
            },
            min: 0,
            max: 100,
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
    customWidth () {
      return {
        width: this.columns[0].length * (this.dataSend.viewType === 'date' ? 64 : 80) + 'px'
      }
    },
    axes () {
      return {
        'ĐH cần giao/lấy/trả': 'y',
        'ĐH giao/lấy/trả TC': 'y',
        'Tỷ lệ giao/lấy/trả thành công': 'y2'
      }
    },
    types () {
      return {
        'ĐH cần giao/lấy/trả': 'bar',
        'ĐH giao/lấy/trả TC': 'bar',
        'Tỷ lệ giao/lấy/trả thành công': 'line'
      }
    },
    yLabel () {
      return 'Đơn hàng'
    },
    y2Label () {
      return 'Tỷ lệ'
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
            return d >= 0 ? d + '%' : '-'
          }
        }
      }
    }
  },
  watch: {
    barOptions () {
      this.barHandler.$emit('dispatch', chart => {
        const options = {
          columns: this.columns
        }
        chart.unload({
          ids: ['data1', 'data2', 'data3', 'ĐH cần giao/lấy/trả', 'ĐH giao/lấy/trả TC', 'Tỷ lệ giao/lấy/trả thành công'],
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
            this.columns = Object.values(response.data.data)
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
