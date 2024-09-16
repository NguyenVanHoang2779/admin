<template>
  <div>
    <div class="d-flex justify-content-center mb-3">
      <vue-c3 :handler="donutHandler" ></vue-c3>
    </div>
    <div class="d-inline-flex justify-content-center w-100 mb-3">
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Số đơn BH TB</p>
        <p class="m-0" style="font-weight: bold">{{ FormatNumber(so_don_bh_tb) }} /người</p>
      </div>
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Tiền BH TB</p>
        <p class="m-0" style="font-weight: bold">{{ FormatNumber(tien_bh_tb) }} đ/người</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import stationProfilesService from 'domain/services/station-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ChartCircleRefund',
  components: {
    VueC3
  },
  props: {
    dataSend: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    donutHandler: new Vue(),
    nghi_mat_hang: 0,
    vo_hong: 0,
    ton_hang_tren_xe: 0,
    khac: 0,
    qua_han_giao_tra: 0,
    mat_thieu_hang: 0,
    so_don_bh_tb: 0,
    tien_bh_tb: 0,
    dataColumns: [],
    type: 'trung_chuyen',
    idUnload: [],
    emptyData: 1
  }),
  computed: {
    options: function () {
      return {
        color: {pattern: ['rgb(217, 217, 217)', '#DEA52B', '#EEBF5C', '#F2D392', '#F7E5BF']},
        legend: {
          position: 'right',
          hide: 'empty'
        },
        data: {
          columns: this.dataColumns,
          type: 'donut'
        },
        donut: {
          title: 'Bồi hoàn',
          label: {
            format: function (value, ratio, id) {
              return id === 'empty' ? '' : Math.round(ratio * 100) + '%'
            }
          }
        },
        tooltip: {
          show: false
        }
      }
    }
  },
  watch: {
    options () {
      this.donutHandler.$emit('dispatch', chart => {
        const options = {
          columns: this.dataColumns
        }
        chart.unload({
          ids: this.idUnload,
          done: function () {
            chart.load(options)
          }
        })
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataChartRefund()
      }
    }
  },
  mounted () {
    this.donutHandler.$emit('init', this.options)
    this.donutHandler.$emit('dispatch', (chart) => chart.resize())
  },
  methods: {
    setDataChart () {
      if (this.type === 'trung_chuyen') {
        if (this.emptyData !== 1) {
          this.dataColumns = [
            ['empty', 0],
            ['Nghi mất hàng', this.nghi_mat_hang],
            ['Vỡ hỏng', this.vo_hong],
            ['Tồn hàng trên xe', this.ton_hang_tren_xe],
            ['Khác', this.khac]
          ]
        } else {
          this.dataColumns = [
            ['empty', 1],
            ['Nghi mất hàng', 0],
            ['Vỡ hỏng', 0],
            ['Tồn hàng trên xe', 0],
            ['Khác', 0]
          ]
        }
        this.idUnload = ['Nghi mất hàng', 'Vỡ hỏng', 'Tồn hàng trên xe', 'Khác', 'empty']
      } else {
        if (this.emptyData !== 1) {
          this.dataColumns = [
            ['empty', 0],
            ['Quá hạn giao/trả', this.qua_han_giao_tra],
            ['Mất/thiếu hàng', this.mat_thieu_hang],
            ['Vỡ hỏng', this.vo_hong],
            ['Khác', this.khac]
          ]
        } else {
          this.dataColumns = [
            ['empty', 1],
            ['Quá hạn giao/trả', 0],
            ['Mất/thiếu hàng', 0],
            ['Vỡ hỏng', 0],
            ['Khác', 0]
          ]
        }
        this.idUnload = ['Quá hạn giao/trả', 'Mất/thiếu hàng', 'Vỡ hỏng', 'Khác', 'empty']
      }
    },
    FormatNumber (num) {
      num = Number(num)
      num = num.toLocaleString('it-IT', {style: 'currency', currency: 'VND'})
      let locationVND = num.indexOf('VND')
      if (locationVND !== -1) {
        num = num.slice(0, locationVND - 1)
      }
      num = num.replaceAll('.', ',')
      return num
    },
    getDataChartRefund () {
      let dataSend = {
        nStationID: this.$route.params.nStationID,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType,
        type: 'boi_hoan'
      }
      stationProfilesService.getDataCostPerson(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let dataChart = response.data.data.ratio_reimbursement
            this.vo_hong = dataChart.damaged_goods
            this.khac = dataChart.other
            this.so_don_bh_tb = response.data.data.count_order
            this.tien_bh_tb = response.data.data.money
            this.type = response.data.data.type
            if (response.data.data.type === 'trung_chuyen') {
              this.nghi_mat_hang = dataChart.loss_of_goods
              this.ton_hang_tren_xe = dataChart.inventory
              if (Number(dataChart.damaged_goods) || Number(dataChart.other) || Number(dataChart.loss_of_goods) || Number(dataChart.inventory)) {
                this.emptyData = 0
              } else {
                this.emptyData = 1
              }
            } else {
              this.qua_han_giao_tra = dataChart.inventory
              this.mat_thieu_hang = dataChart.loss_of_goods
              if (Number(dataChart.damaged_goods) || Number(dataChart.other) || Number(dataChart.inventory) || Number(dataChart.loss_of_goods)) {
                this.emptyData = 0
              } else {
                this.emptyData = 1
              }
            }
            this.setDataChart()
            this.$forceUpdate()
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
    this.getDataChartRefund()
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
</style>
