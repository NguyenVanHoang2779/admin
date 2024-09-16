<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-6 text-center">
      <span class="text-muted font-weight-light">Nội thành HN - ĐN - HCM</span>
    </h4>
    <ecom-table-district-delivering-report :childRes="childRes"></ecom-table-district-delivering-report>
    <div class="echarts">
      <vue-echart :options="pieOptions" :auto-resize="true"></vue-echart>
    </div>
    <!-- Pagination -->
      <b-card-body class="pt-0 pb-3" v-if="childRes.length !== 0">
          <div class="row">
              <div class="col-sm pt-3">
                  <b-pagination :total-rows="pageData.totalItems"
                      v-model="pageData.currentPage"
                      :limit="pageData.limit"
                      v-on:change="pageChanged"
                  />
              </div>
              <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
              </div>
          </div>
      </b-card-body>
      <!-- / Pagination -->
    <div class="relative-loading">
      <ecom-loading-wandering-cubes :enable="appLoading"></ecom-loading-wandering-cubes>
    </div>
  </div>
</template>

<style>
.echarts {
  width: 100% !important;
}

.relative-loading {
  position: relative;
}
</style>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'

import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import dashboardV2 from 'domain/admin/dashboardV2'
import EcomTableDistrictDeliveringReport from 'components/tables/EcomTableDistrictDeliveringReport'
import EcomLoadingWanderingCubes from 'components/elements/loading/EcomLoadingWanderingCubes'

export default {
  name: 'pie-district-delivering-report',

  components: {
    'vue-echart': ECharts,
    EcomTableDistrictDeliveringReport,
    EcomLoadingWanderingCubes
  },

  props: ['fromDate', 'toDate', 'isChange'],

  data: () => ({
    pieOptions: {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
        backgroundColor: '#46494d',
        textStyle: {
          fontSize: 11
        }
      },
      series: [{
        name: '',
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: [],
        itemStyle: {
          normal: {
            shadowBlur: 50,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            shadowBlur: 50,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }],
      animationDuration: 2000
    },
    childRes: [],
    appLoading: true,
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      limit: 10
    }
  }),

  created () {
    this.getPieOptions()
  },

  watch: {
    isChange: function (newIsChange, oldIsChange) {
      this.getPieOptions()
    }
  },

  methods: {
    getPieOptions: function () {
      let params = {}
      this.setDefault()
      params['from'] = this.fromDate
      params['to'] = this.toDate
      params['currentPage'] = this.pageData.currentPage
      dashboardV2.getDistrictDelivering(params)
        .then((response) => {
          if (response.data.success) {
            this.appLoading = false
            this.childRes = response.data.data.tableData
            this.pieOptions.series[0].data = response.data.data.chartData
            this.pageData.totalItems = parseInt(response.data.data.pagination.totalItems)
            this.pageData.totalPages = response.data.data.pagination.totalPages
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setDefault: function () {
      this.appLoading = true
      this.pieOptions.series[0].data = []
      this.childRes = []
    },

    pageChanged: function (currentPage) {
      this.pageData.currentPage = currentPage
      this.getPieOptions()
    }
  }
}
</script>
