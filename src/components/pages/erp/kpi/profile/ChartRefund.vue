<template>
  <div>
    <div class="d-flex justify-content-center mb-3">
      <vue-c3 :handler="donutHandler" ></vue-c3>
    </div>
    <div class="d-inline-flex justify-content-center w-100 mb-3">
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Số đơn BH TB</p>
        <p class="m-0" style="font-weight: bold">{{avgTicket}} ĐH/tháng</p>
      </div>
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Tiền BH TB</p>
        <p class="m-0" style="font-weight: bold">{{avgMoney}} VNĐ</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import kpiProfilesService from 'domain/services/kpi-profiles-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ChartRefund',
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
    lateDP: 0,
    broken: 0,
    lossPkg: 0,
    emptyData: 1,
    avgTicket: 0,
    avgMoney: 0
  }),
  computed: {
    options: function () {
      return {
        color: {pattern: ['#DEA52B', '#EEBF5C', '#F2D392', '#d9d9d9']},
        legend: {
          position: 'right',
          hide: 'empty'
        },
        data: {
          columns: [
            ['Quá hạn giao/trả', this.lateDP],
            ['Mất/thiếu hàng', this.lossPkg],
            ['Vỡ hỏng', this.broken],
            ['empty', this.emptyData]
          ],
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
          columns: [
            ['Quá hạn giao/trả', this.lateDP],
            ['Mất/thiếu hàng', this.lossPkg],
            ['Vỡ hỏng', this.broken],
            ['empty', this.emptyData]
          ]
        }
        chart.load(options)
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataRefund()
      }
    }
  },
  mounted () {
    this.donutHandler.$emit('init', this.options)
    this.donutHandler.$emit('dispatch', (chart) => chart.resize())
  },
  methods: {
    getDataRefund () {
      let dataSend = {
        user_id: this.$route.params.id,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType
      }
      kpiProfilesService.getDataRefund(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.lateDP = data.late_d_p
            this.lossPkg = data.loss_pkg
            this.broken = data.broken_pkg
            this.avgTicket = data.avg_ticket
            this.avgMoney = data.avg_money
            if (data.late_d_p || data.loss_pkg || data.broken_pkg) {
              this.emptyData = 0
            } else {
              this.emptyData = 1
            }
            this.$forceUpdate()
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
    this.getDataRefund()
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
