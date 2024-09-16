<template>
  <div>
    <b-row>
      <b-col>
        <div class="w-100 d-flex justify-content-between align-content-center mt-2 my-auto">
          <div class="mt-3">
            <h5 style="font-weight: bold">Sản lượng - Chất lượng (theo khâu)</h5>
          </div>
          <div class="mt-3 d-flex" style="cursor: default">
            <div v-for="(item, index) of titleXlhhs">
              <span @click="stateChartXlhh = item.key" :class="{'tab-choose': stateChartXlhh === item.key}">{{item.value}}</span>
              <span v-if="Number(index) !== 4" style="margin-right: 3px"> | </span>
            </div>
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
  name: 'ChartPercentXlhh',
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
    data1: ['data1', 0, 0, 0, 0, 0, 0],
    data2: ['data2', 0, 0, 0, 0, 0, 0],
    data3: ['data3', 0, 0, 0, 0, 0, 0],
    import: ['Sản lượng nhập', 0, 0, 0, 0, 0, 0],
    importTrue: ['Sản lượng nhập đúng', 0, 0, 0, 0, 0, 0],
    importPercent: ['Chất lượng nhập', 0, 0, 0, 0, 0, 0],
    export: ['Sản lượng xuất', 0, 0, 0, 0, 0, 0],
    exportTrue: ['Sản lượng xuất đúng', 0, 0, 0, 0, 0, 0],
    exportPercent: ['Chất lượng xuất', 0, 0, 0, 0, 0, 0],
    p2b: ['Sản lượng làm hàng', 0, 0, 0, 0, 0, 0],
    p2bTrue: ['Sản lượng làm hàng đúng', 0, 0, 0, 0, 0, 0],
    p2bPercent: ['Chất lượng làm hàng', 0, 0, 0, 0, 0, 0],
    sorting: ['Sản lượng sorting', 0, 0, 0, 0, 0, 0],
    sortingTrue: ['Sản lượng sorting đúng', 0, 0, 0, 0, 0, 0],
    sortingPercent: ['Chất lượng sorting', 0, 0, 0, 0, 0, 0],
    pallet: ['Sản lượng nhập chuồng', 0, 0, 0, 0, 0, 0],
    palletTrue: ['Sản lượng nhập chuồng đúng', 0, 0, 0, 0, 0, 0],
    palletPercent: ['Chất lượng nhập chuồng', 0, 0, 0, 0, 0, 0],
    type: this.position,
    stateChartXlhh: '',
    titleXlhhs: []
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
            }
          },
          y: this.yFormat,
          y2: this.y2Format
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
        width: this.xAxis.length * (this.dataSend.viewType === 'date' ? 48 : 64) + 'px'
      }
    },
    axes () {
      return {
        'Sản lượng nhập': 'y',
        'Sản lượng nhập đúng': 'y',
        'Chất lượng nhập': 'y2',
        'Sản lượng xuất': 'y',
        'Sản lượng xuất đúng': 'y',
        'Chất lượng xuất': 'y2',
        'Sản lượng làm hàng': 'y',
        'Sản lượng làm hàng đúng': 'y',
        'Chất lượng làm hàng': 'y2',
        'Sản lượng sorting': 'y',
        'Sản lượng sorting đúng': 'y',
        'Chất lượng sorting': 'y2',
        'Sản lượng nhập chuồng': 'y',
        'Sản lượng nhập chuồng đúng': 'y',
        'Chất lượng nhập chuồng': 'y2'
      }
    },
    types () {
      return {
        'Sản lượng nhập': 'bar',
        'Sản lượng nhập đúng': 'bar',
        'Chất lượng nhập': 'line',
        'Sản lượng xuất': 'bar',
        'Sản lượng xuất đúng': 'bar',
        'Chất lượng xuất': 'line',
        'Sản lượng làm hàng': 'bar',
        'Sản lượng làm hàng đúng': 'bar',
        'Chất lượng làm hàng': 'line',
        'Sản lượng sorting': 'bar',
        'Sản lượng sorting đúng': 'bar',
        'Chất lượng sorting': 'line',
        'Sản lượng nhập chuồng': 'bar',
        'Sản lượng nhập chuồng đúng': 'bar',
        'Chất lượng nhập chuồng': 'line'
      }
    },
    yLabel () {
      if (['import', 'export', 'pallet'].includes(this.stateChartXlhh)) {
        return 'Bao'
      } else {
        return 'ĐH'
      }
    },
    y2Label () {
      return 'Tỷ lệ'
    },
    yFormat () {
      return {
        type: 'linear',
        label: {
          text: 'y label',
          position: 'outer-top'
        }
      }
    },
    y2Format () {
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
        },
        min: 0,
        max: 100,
        padding: {top: 0, bottom: 0}
      }
    },
    columns () {
      switch (this.stateChartXlhh) {
        case 'import':
          return [
            this.xAxis,
            this.import,
            this.importTrue,
            this.importPercent
          ]
        case 'export':
          return [
            this.xAxis,
            this.export,
            this.exportTrue,
            this.exportPercent
          ]
        case 'p2b':
          return [
            this.xAxis,
            this.p2b,
            this.p2bTrue,
            this.p2bPercent
          ]
        case 'sorting':
          return [
            this.xAxis,
            this.sorting,
            this.sortingTrue,
            this.sortingPercent
          ]
        case 'pallet':
          return [
            this.xAxis,
            this.pallet,
            this.palletTrue,
            this.palletPercent
          ]
        default:
          return [
            this.xAxis,
            this.data1,
            this.data2,
            this.data3
          ]
      }
    },
    unloadKey () {
      return [
        'data1',
        'data2',
        'data3',
        'Sản lượng nhập',
        'Sản lượng nhập đúng',
        'Chất lượng nhập',
        'Sản lượng xuất',
        'Sản lượng xuất đúng',
        'Chất lượng xuất',
        'Sản lượng làm hàng',
        'Sản lượng làm hàng đúng',
        'Chất lượng làm hàng',
        'Sản lượng sorting',
        'Sản lượng sorting đúng',
        'Chất lượng sorting',
        'Sản lượng nhập chuồng',
        'Sản lượng nhập chuồng đúng',
        'Chất lượng nhập chuồng'
      ]
    }
  },
  watch: {
    barOptions () {
      this.barHandler.$emit('dispatch', chart => {
        const options = {
          columns: this.columns
        }
        chart.unload({
          ids: this.unloadKey,
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
            let data = response.data.data.data_chart
            this.xAxis = data.x_axis
            this.import = data.total_import
            this.importTrue = data.total_import_true
            this.importPercent = data.total_import_percent
            this.export = data.total_export
            this.exportTrue = data.total_export_true
            this.exportPercent = data.total_export_percent
            this.p2b = data.total_p2b
            this.p2bTrue = data.total_p2b_true
            this.p2bPercent = data.total_p2b_percent
            this.sorting = data.total_sorting
            this.sortingTrue = data.total_sorting_true
            this.sortingPercent = data.total_sorting_percent
            this.pallet = data.total_pallet
            this.palletTrue = data.total_pallet_true
            this.palletPercent = data.total_pallet_percent
            this.titleXlhhs = Object.values(response.data.data.info_chart)
            this.stateChartXlhh = this.titleXlhhs[0].key
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
