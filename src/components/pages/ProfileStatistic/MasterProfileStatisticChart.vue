<template>
    <div>
        <vue-echart :options="pieOptions" :auto-resize="true"></vue-echart>
    </div>
</template>

<script>

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'

import profileStatisticService from 'domain/services/profile-statistic-service'

export default {
  name: 'master-profile-statistic-chart',

  components: {
    'vue-echart': ECharts
  },

  props: [
    'filter',
    'reload'
  ],

  data: () => ({
    flatPickrConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y'
    },

    pieOptions: {
      title: {
        text: 'Master Profile',
        subtext: 'Trạng thái',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
        backgroundColor: '#46494d',
        textStyle: {
          fontSize: 11
        }
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        y: '20%',
        data: []
      },
      series: [{
        name: 'Trạng thái',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: [],
        itemStyle: {
          normal: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }],
      animationDuration: 2000
    }
  }),

  created () {
    this.getStats()
  },

  watch: {
    reload: function (newVal, oldVal) {
      this.getStats()
    }
  },

  methods: {

    handleSelectedRegion (option) {
      this.filter.region = option ? option.id : ''
    },

    handleSelectedProvince (option) {
      this.filter.provinceId = option ? option.id : ''
    },

    handleSelectedStation (option) {
      this.filter.stationId = option ? option.id : ''
    },

    getStats () {
      let dataSend = {
        'region': this.filter.region,
        'province_id': this.filter.provinceId,
        'station_id': this.filter.stationId,
        'start_date': this.filter.startDate,
        'end_date': this.filter.endDate,
        'types': ['master_profile_status']
      }

      profileStatisticService.getStats(dataSend)
        .then(response => {
          if (response.data.success) {
            this.pieOptions.series[0].data = []
            this.pieOptions.legend.data = []
            let data = response.data.data['master_profile_status']
            data.forEach(element => {
              this.pieOptions.series[0].data.push({
                name: element.name,
                value: parseInt(element.value)
              })
              this.pieOptions.legend.data.push(element.name)
            })
          }
        })
    }
  }
}
</script>
