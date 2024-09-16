<template>
  <div>
    <div class="d-flex justify-content-center mb-3 w-100">
      <vue-c3 :handler="donutHandler" ></vue-c3>
    </div>
    <div class="d-inline-flex justify-content-center w-100">
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Lương ngoài giờ</p>
        <p class="m-0" style="font-weight: bold">{{ FormatNumber(luong_ngoai_gio) }} đ</p>
      </div>
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Vượt định mức</p>
        <p class="m-0" style="font-weight: bold">{{vuot_dinh_muc}} %</p>
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
  name: 'ChartCirclePerson',
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
    luong_ngoai_gio: 0,
    vuot_dinh_muc: 0,
    chi_phi_lao_cong: 0,
    chi_phi_bao_ve: 0,
    luong_qlmd: 0,
    luong_gskv: 0,
    luong_xlhh: 0,
    luong_cod: 0,
    luong_nvbc: 0,
    dataColumns: [],
    type: 'trung_chuyen',
    idUnload: [],
    emptyData: 1
  }),
  computed: {
    options: function () {
      return {
        color: {pattern: ['rgb(217, 217, 217)', '#D2494D', '#E3666A', '#E79292', '#EDC4C4', '#F6D3D3']},
        legend: {
          position: 'right',
          hide: 'empty'
        },
        data: {
          columns: this.dataColumns,
          type: 'donut'
        },
        donut: {
          title: 'CP nhân sự',
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
        this.getDataCostPerson()
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
            ['Chi phí lao công', this.chi_phi_lao_cong],
            ['Chi phí bảo vệ', this.chi_phi_bao_ve],
            ['Lương QLMD', this.luong_qlmd],
            ['Lương GSKV', this.luong_gskv],
            ['Lương XLHH', this.luong_xlhh]
          ]
        } else {
          this.dataColumns = [
            ['empty', 1],
            ['Chi phí lao công', 0],
            ['Chi phí bảo vệ', 0],
            ['Lương QLMD', 0],
            ['Lương GSKV', 0],
            ['Lương XLHH', 0]
          ]
        }
        this.idUnload = ['Chi phí lao công', 'Chi phí bảo vệ', 'Lương QLMD', 'Lương GSKV', 'Lương XLHH', 'empty']
      } else {
        if (this.emptyData !== 1) {
          this.dataColumns = [
            ['empty', 0],
            ['Chi phí lao công', this.chi_phi_lao_cong],
            ['Chi phí bảo vệ', this.chi_phi_bao_ve],
            ['Lương COD', this.luong_cod],
            ['Lương NVBC', this.luong_nvbc],
            ['Lương XLHH', this.luong_xlhh]
          ]
        } else {
          this.dataColumns = [
            ['empty', 1],
            ['Chi phí lao công', 0],
            ['Chi phí bảo vệ', 0],
            ['Lương COD', 0],
            ['Lương NVBC', 0],
            ['Lương XLHH', 0]
          ]
        }
        this.idUnload = ['Chi phí lao công', 'Chi phí bảo vệ', 'Lương COD', 'Lương NVBC', 'Lương XLHH', 'empty']
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
    getDataCostPerson () {
      let dataSend = {
        nStationID: this.$route.params.nStationID,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType,
        type: 'chi_phi'
      }
      stationProfilesService.getDataCostPerson(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let dataChart = response.data.data.ratio
            this.chi_phi_lao_cong = dataChart.medium_expense
            this.chi_phi_bao_ve = dataChart.medium_reimbursement
            this.luong_xlhh = dataChart.medium_salary_xlhh
            this.luong_ngoai_gio = response.data.data.overtime_pay
            this.vuot_dinh_muc = response.data.data.beyond_the_norm
            this.type = response.data.data.type
            if (response.data.data.type === 'trung_chuyen') {
              this.luong_qlmd = dataChart.medium_salary_qlmd
              this.luong_gskv = dataChart.medium_salary_gskv
              if (Number(dataChart.medium_expense) || Number(dataChart.medium_reimbursement) || Number(dataChart.medium_salary_xlhh) || Number(dataChart.medium_salary_qlmd) || Number(dataChart.medium_salary_gskv)) {
                this.emptyData = 0
              } else {
                this.emptyData = 1
              }
            } else {
              this.luong_cod = dataChart.medium_salary_cod
              this.luong_nvbc = dataChart.medium_salary_nvbc
              if (Number(dataChart.medium_expense) || Number(dataChart.medium_reimbursement) || Number(dataChart.medium_salary_xlhh) || Number(dataChart.medium_salary_cod) || Number(dataChart.medium_salary_nvbc)) {
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
    this.getDataCostPerson()
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
