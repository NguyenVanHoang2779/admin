<template>
  <div>
    <div class="d-flex justify-content-center mb-3 w-100">
      <vue-c3 :handler="donutHandler" ></vue-c3>
    </div>
    <div class="d-inline-flex justify-content-center w-100">
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Số thẻ phạt TB</p>
        <p class="m-0" style="font-weight: bold">{{avgCard}}</p>
      </div>
      <div class="border border-1 mr-3 px-3 py-1 box-penalty" style="width: 200px">
        <p class="m-0">Số lần bị report</p>
        <p class="m-0" style="font-weight: bold">{{totalReport}}</p>
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
  name: 'ChartPenalty',
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
    review: 0,
    major: 0,
    other: 0,
    emptyData: 1,
    avgCard: 0,
    totalReport: 0
  }),
  computed: {
    options: function () {
      return {
        color: {pattern: ['#D2494D', '#E79292', '#EDC4C4', '#d9d9d9']},
        legend: {
          position: 'right',
          hide: 'empty'
        },
        data: {
          columns: [
            ['Đánh giá thái độ', this.review],
            ['Lỗi nghiệp vụ', this.major],
            ['Khác', this.other],
            ['empty', this.emptyData]
          ],
          type: 'donut'
        },
        donut: {
          title: 'Phạt thẻ',
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
            ['Đánh giá thái độ', this.review],
            ['Lỗi nghiệp vụ', this.major],
            ['Khác', this.other],
            ['empty', this.emptyData]
          ]
        }
        chart.load(options)
      })
    },
    dataSend () {
      if (!this.dataSend.isLog) {
        this.getDataPenalty()
      }
    }
  },
  mounted () {
    this.donutHandler.$emit('init', this.options)
    this.donutHandler.$emit('dispatch', (chart) => chart.resize())
  },
  methods: {
    getDataPenalty () {
      let dataSend = {
        user_id: this.$route.params.id,
        from: this.dataSend.from,
        to: this.dataSend.to,
        view_type: this.dataSend.viewType
      }
      kpiProfilesService.getDataPenalty(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.review = data.p_review
            this.major = data.p_major
            this.other = data.p_handle
            this.avgCard = data.avg_card
            this.totalReport = data.total_report
            if (Number(data.p_review) || Number(data.p_major) || Number(data.p_handle)) {
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
    this.getDataPenalty()
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
