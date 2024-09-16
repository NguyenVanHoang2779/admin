<template>
  <b-row>
    <b-col md="10" class="p-3 mb-3 d-flex justify-content-center">
      <div style="overflow: auto" class="salary-container">
        <vue-c3 :handler="lineHandler" :style="customWidth" style="min-height: 400px" class="salary-chart" id="salary"></vue-c3>
      </div>
    </b-col>
    <b-col md="2">
      <div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Chi phí TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(chi_phi_tb) }} đ </p>
        </div>
        <div class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Bồi hoàn TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(boi_hoan_tb) }} đ </p>
        </div>
        <div v-if="type === 'trung_chuyen'" class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Lương XLHH TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(luong_XLHH_tb) }} đ </p>
        </div>
        <div v-if="type === 'trung_chuyen'" class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Lương GSKV TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(luong_GSKV_tb) }} đ</p>
        </div>
        <div v-if="type === 'buu_cuc'" class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Lương COD TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(luong_COD_tb) }} đ </p>
        </div>
        <div v-if="type === 'buu_cuc'" class="border border-1 px-3 py-1 box-penalty mt-3 float-right" style="width: 200px">
          <p class="m-0">Lương NVBC TB</p>
          <p class="m-0" style="font-weight: bold">{{ FormatNumber(luong_NVBC_tb) }} đ</p>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import stationProfilesService from 'domain/services/station-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ChartLineStation',
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
    type: '',
    xAxis: ['x', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    chi_phi_CSVC: ['Chi phí CSVC', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    chi_phi_nhan_su: ['Chi phí nhân sự', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    boi_hoan: ['Chi phí bồi hoàn', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    chi_phi_tb: 0,
    boi_hoan_tb: 0,
    luong_XLHH_tb: 0,
    luong_GSKV_tb: 0,
    luong_COD_tb: 0,
    luong_NVBC_tb: 0
  }),
  computed: {
    lineOptions: function () {
      return {
        color: {pattern: ['#EB1414', '#F59E9E', '#DEA52B']},
        data: {
          x: 'x',
          columns: [
            this.xAxis,
            this.chi_phi_CSVC,
            this.chi_phi_nhan_su,
            this.boi_hoan
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
        'Chi phí CSVC': 'y',
        'Chi phí nhân sự': 'y',
        'Chi phí bồi hoàn': 'y'
      }
    },
    types () {
      return {
        'Chi phí CSVC': 'line',
        'Chi phí nhân sự': 'line',
        'Chi phí bồi hoàn': 'line'
      }
    },
    yLabel () {
      return 'Tiền'
    },
    customWidth () {
      return {
        width: this.xAxis.length * 80 + 'px'
      }
    }
  },
  watch: {
    lineOptions () {
      this.lineHandler.$emit('dispatch', chart => {
        const options = {
          columns: [
            this.xAxis,
            this.chi_phi_CSVC,
            this.chi_phi_nhan_su,
            this.boi_hoan
          ]
        }
        chart.unload({
          ids: ['Chi phí CSVC', 'Chi phí nhân sự', 'Chi phí bồi hoàn'],
          done: function () {
            chart.load(options)
          }
        })
        chart.axis.labels({
          x: this.dataSend.viewType === 'date' ? 'Ngày' : 'Tháng',
          y: this.yLabel
        })
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataChartCostStation()
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
      num = Number(num)
      num = num.toLocaleString('it-IT', {style: 'currency', currency: 'VND'})
      let locationVND = num.indexOf('VND')
      if (locationVND !== -1) {
        num = num.slice(0, locationVND - 1)
      }
      num = num.replaceAll('.', ',')
      return num
    },
    getDataChartCostStation () {
      let dataSend = {
        nStationID: this.$route.params.nStationID,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType
      }
      stationProfilesService.getDataChartCostStation(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.xAxis = data.x_axis
            this.chi_phi_CSVC = data.expense_csvc
            this.chi_phi_nhan_su = data.expense_personnel
            this.boi_hoan = data.reimbursement
            this.chi_phi_tb = data.medium_expense
            this.boi_hoan_tb = data.medium_reimbursement
            this.type = data.type
            if (data.type === 'trung_chuyen') {
              this.luong_XLHH_tb = data.medium_salary_xlhh
              this.luong_GSKV_tb = data.medium_salary_gskv
            } else {
              this.luong_COD_tb = data.medium_salary_cod
              this.luong_NVBC_tb = data.medium_salary_nvbc
            }
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
    this.getDataChartCostStation()
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
