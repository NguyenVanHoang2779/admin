<template>
  <div>
    <h4 class="ui-block-heading">
      Tổng quan sản lượng Liên vùng
    </h4>
    <div class="overview-external-form">
      <form>
        <b-form-row>
            <b-form-group label="Chọn cách hiển thị" class="col-md-2">
                <single-select-type-chart :multiple="false" @selected="setSelectedTypeChart" ref="select_type_chart" placehoder="Chọn cách hiển thị" ></single-select-type-chart>
            </b-form-group>
            <b-form-group label="Chọn kiểu bao" class="col-md-2">
                <select-bag-type :multiple="true" @selected="setSelectedBagType" ref="select_bag_type" placehoder="Chọn kiểu bao" ></select-bag-type>
            </b-form-group>
            <b-form-group label="Chọn kiểu vận chuyển" class="col-md-2">
                <select-transport-type :multiple="true" @selected="setSelectedTransportType" ref="select_transport_type" placehoder="Chọn kiểu vận chuyển" ></select-transport-type>
            </b-form-group>
            <b-form-group label="Chọn kho" class="col-md-6">
<!--                <select-stations :multiple="true" @selected="setSelectedStation" ref="select_stations" placehoder="Nhập kho cần tìm kiếm" ></select-stations>-->
                <select-external-stations :multiple="true" @selected="setSelectedStation" ref="select_external_stations" placehoder="Nhập kho cần tìm kiếm"></select-external-stations>
            </b-form-group>
        </b-form-row>
        <b-form-row>
            <div class="col-md mb-3">
                <label class="form-label d-none d-md-block">Chọn mốc </label>
                <select-action-type :multiple="false" @selected="setSelectedActionType" ref="select_action_type" placehoder="Nhập Action"></select-action-type>
            </div>
          <div class="col-md mb-3">
              <label class="form-label d-none d-md-block">Chọn Ngày Bắt Đầu </label>
              <flat-pickr v-model="startDateTime" :config="{altInput: true, animate: false , enableTime:true, dateFormat: 'Y-m-d H:i' }" placeholder="Chọn ngày"/>
          </div>
          <div class="col-md mb-3">
              <label class="form-label d-none d-md-block">Chọn Ngày Kết Thúc </label>
              <flat-pickr v-model="endDateTime" :config="{altInput: true, animate: false , enableTime:true, dateFormat: 'Y-m-d H:i' }" placeholder="Chọn ngày"/>
          </div>
          <div class="col-md-3 text-right">
              <b-form-group >
                  <label class="form-label">&nbsp;</label>
                  <div class="align-content-center center">
                      <b-btn type="button" variant="primary" @click="getExternalDataFromImpala"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                      <b-btn type="reset" variant="default" @click="resetForm"><i class="sidenav-icon ion ion-md-sync"></i>Nhập lại</b-btn>
                  </div>
              </b-form-group>
          </div>
        </b-form-row>
      </form>
    </div>
    <b-card class="card-height">
        <vue-echart :options="dataCharts" :auto-resize="true" class="w-100 h-100"></vue-echart>
    </b-card>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped lang="scss">
    .card-height {
        height: 680px;
    }
    .card-height .echarts {
        height: auto;
    }
</style>
<script>

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import SingleSelectTypeChart from 'components/pages/External/SingleSelectTypeChart'
import SelectBagType from 'components/pages/External/SelectBagType'
import SelectTransportType from 'components/pages/External/SelectTransportType'
import SelectActionType from 'components/pages/External/SelectActionType'
import flatPickr from 'vue-flatpickr-component'
import dashboardExternal from 'domain/admin/dashboardExternal'
import SelectExternalStations from 'components/pages/erp/staff/SelectExternalStations'

export default {

  name: 'overview-external',

  components: {
    'vue-echart': ECharts,
    SingleSelectTypeChart,
    SelectBagType,
    SelectTransportType,
    SelectActionType,
    flatPickr,
    dashboardExternal,
    SelectExternalStations
  },

  data: () => ({
    selectedStation: '',
    selectedTypeChart: '',
    selectedBagType: '',
    selectedTransportType: '',
    selectedActionType: '',
    startDateTime: '',
    endDateTime: '',
    dataCharts: {
      title: {
        text: 'Tong Quan Lien Vung'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Ha Noi', 'Ho Chi Minh', 'Da Nang', 'Mien Bac', 'Mien Trung', 'Mien Nam']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [

      ]
    }
  }),

  methods: {

    setSelectedStation (stationIds) {
      this.selectedStation = stationIds
    },
    setSelectedTypeChart (typeChartCode) {
      this.selectedTypeChart = typeChartCode
    },

    setSelectedBagType (bagType) {
      this.selectedBagType = bagType
    },

    setSelectedTransportType (transportType) {
      this.selectedTransportType = transportType
    },

    setSelectedActionType (actionType) {
      this.selectedActionType = actionType
    },

    getExternalDataFromImpala () {
      if (!this.selectedTypeChart || !this.selectedBagType || !this.selectedTransportType || !this.selectedStation || !this.selectedActionType || !this.startDateTime || !this.endDateTime) return
      let dataSend = {
        'type_chart': this.selectedTypeChart,
        'bag_type': this.selectedBagType,
        'transport_type': this.selectedTransportType,
        'station_ids': this.selectedStation,
        'action_type': this.selectedActionType,
        'start_date_time': this.startDateTime,
        'end_date_time': this.endDateTime
      }
      this.$startLoading()
      dashboardExternal.getExternalDataFromImpala(dataSend).then(response => {
        if (response.data.success) {
          this.dataCharts.xAxis.data = response.data.data.xAxis
          this.dataCharts.series = response.data.data.series
        } else {
          this.success = false
        }
      }).then(() => {
        this.$stopLoading()
      }).catch(e => {
        console.log(e)
      })
    },

    resetForm () {
      // Reset data of component select box
      this.$refs.select_type_chart.reset()
      this.$refs.select_bag_type.reset()
      this.$refs.select_transport_type.reset()
      this.$refs.select_stations.reset()
    }

  }
}
</script>
