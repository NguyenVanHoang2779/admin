<template>
  <div>
    <h4 class="ui-block-heading">
      Tổng quan vận hành
    </h4>
    <hr>
    <div class="mb-5">
      <filter-time @handleSelectedDate="handleSelectedDate" @handleSelectedRangeTimeCompare="handleSelectedRangeTimeCompare"></filter-time>
    </div>
    <div class="ui-block mb-5">
      <div class="mb-1">
        <b-row>
          <b-col>
            <h5 class="ui-block-heading">
              Tổng quan lấy/giao/trả
            </h5>
          </b-col>
          <b-col offset-md="6">
            <modal-explain-operation-overview></modal-explain-operation-overview>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <div class="mb-2">
          <b-row>
            <b-col md="6"><multi-select-province @handleProvinceSelected="handleProvinceSelected"></multi-select-province></b-col>
            <b-col md="3"><multi-select-station-6h :provinceIds="provinceIds" @handleStation6hSelected="handleStation6hSelected"></multi-select-station-6h></b-col>
            <b-col md="3"><multi-select-station-12h :provinceIds="provinceIds" @handleStation12hSelected="handleStation12hSelected"></multi-select-station-12h></b-col>
          </b-row>
        </div>
        <div>
          <b-row>
            <b-col md="6"><single-select-package-area-type @handleSelectedPackageAreaType="handleSelectedPackageAreaType"></single-select-package-area-type></b-col>
            <b-col md="6"><single-select-package-status-type @handleSelectedPackageStatusType="handleSelectedPackageStatusType"></single-select-package-status-type></b-col>
          </b-row>
        </div>
      </div>
      <div>
        <table-operation-overview :dateRange="dateRange" :dateRangeCompare="dateRangeCompare" :provinceIds="provinceIds" :stationIds="stationIds" :packageAreaTypeId="packageAreaTypeId" :packageStatusTypeId="packageStatusTypeId"></table-operation-overview>
      </div>
    </div>
    <div class="ui-block mb-5">
      <div class="mb-1">
        <b-row>
          <b-col>
            <h5 class="ui-block-heading">
              Chi tiết tốc độ vận hành
            </h5>
          </b-col>
          <b-col offset-md="6">
            <modal-explain-operation-speed></modal-explain-operation-speed>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col md="6"><multi-select-province @handleProvinceSelected="handleProvinceSelectedSpeed"></multi-select-province></b-col>
          <b-col md="3"><multi-select-station-6h :provinceIds="provinceIdsSpeed" @handleStation6hSelected="handleStation6hSelectedSpeed"></multi-select-station-6h></b-col>
          <b-col md="3"><multi-select-station-12h :provinceIds="provinceIdsSpeed" @handleStation12hSelected="handleStation12hSelectedSpeed"></multi-select-station-12h></b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <b-row v-if="myToggle">
          <b-col md="4">
            <table-operation-speed-pick :dateRange="dateRange" :provinceIds="provinceIdsSpeed" :stationIds="stationIdsSpeed" :dateRangeCompare="dateRangeCompare" :isReload="true"></table-operation-speed-pick>
          </b-col>
          <b-col md="4">
            <table-operation-speed-deliver :dateRange="dateRange" :provinceIds="provinceIdsSpeed" :stationIds="stationIdsSpeed" :dateRangeCompare="dateRangeCompare" :isReload="true"></table-operation-speed-deliver>
          </b-col>
          <b-col md="4">
            <table-operation-speed-return :dateRange="dateRange" :provinceIds="provinceIdsSpeed" :stationIds="stationIdsSpeed" :dateRangeCompare="dateRangeCompare" :isReload="true"></table-operation-speed-return>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col md="6">
            <bar-operation-speed-pick-deliver :dateRange="dateRange" :provinceIds="provinceIdsSpeed" :stationIds="stationIdsSpeed" :isReload="true"></bar-operation-speed-pick-deliver>
          </b-col>
          <b-col md="6">
            <bar-operation-speed-return :dateRange="dateRange" :provinceIds="provinceIdsSpeed" :stationIds="stationIdsSpeed" :isReload="true"></bar-operation-speed-return>
          </b-col>
        </b-row>
        <div class="mt-2" v-if="dateRange && dateRange.fromDate !== today">
          <b-row>
            <b-col md="2" offset-md="10">
              <b-btn :pressed.sync="myToggle" :variant="variant" class="btn btn-sm">{{myToggle === false ? ' Bấm' : 'Bỏ'}} xem so sánh</b-btn>
            </b-col>
          </b-row>
        </div>
      </div>
      <div>
        <b-row v-if="speedTransitSwitch">
          <b-col md="12">
            <table-operation-speed-transit :dateRange="dateRange" :provinceIds="provinceIdsSpeed" :stationIds="stationIdsSpeed" :dateRangeCompare="dateRangeCompare" :isReload="true"></table-operation-speed-transit>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col md="12">
            <bar-operation-speed-transit :dateRange="dateRange" :provinceIds="provinceIdsSpeed" :stationIds="stationIdsSpeed" :isReload="true"></bar-operation-speed-transit>
          </b-col>
        </b-row>
        <div class="mt-2" v-if="dateRange && dateRange.fromDate !== today">
          <b-row>
            <b-col md="2" offset-md="10">
              <b-btn :pressed.sync="speedTransitSwitch" :variant="variantSpeedTransit" class="btn btn-sm">{{speedTransitSwitch === false ? ' Bấm' : 'Bỏ'}} xem so sánh</b-btn>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
    <div class="ui-block mb-5">
      <h5 class="ui-block-heading">
        Báo cáo giao/lấy/trả
      </h5>
      <div class="mb-3">
        <b-row>
          <b-col md="6"><multi-select-province @handleProvinceSelected="handleProvinceSelectedReport"></multi-select-province></b-col>
          <b-col md="6"><multi-select-station :provinceIds="provinceIdsReport" @handleStationSelected="handleStationSelectedReport"></multi-select-station></b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col md="4">
            <pie-operation-report-failed-pick :dateRange="dateRange" :provinceIds="provinceIdsReport" :stationIds="stationIdsReport"></pie-operation-report-failed-pick>
          </b-col>
          <b-col md="4">
            <pie-operation-report-failed-deliver :dateRange="dateRange" :provinceIds="provinceIdsReport" :stationIds="stationIdsReport"></pie-operation-report-failed-deliver>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col md="4">
            <pie-operation-report-delay-pick :dateRange="dateRange" :provinceIds="provinceIdsReport" :stationIds="stationIdsReport"></pie-operation-report-delay-pick>
          </b-col>
          <b-col md="4">
            <pie-operation-report-delay-deliver :dateRange="dateRange" :provinceIds="provinceIdsReport" :stationIds="stationIdsReport"></pie-operation-report-delay-deliver>
          </b-col>
          <b-col md="4">
            <pie-operation-report-delay-return :dateRange="dateRange" :provinceIds="provinceIdsReport" :stationIds="stationIdsReport"></pie-operation-report-delay-return>
          </b-col>
        </b-row>
      </div>
    </div>
    <div class="ui-block mb-5">
      <div class="mb-1">
        <b-row>
          <b-col>
            <h5 class="ui-block-heading">
              Năng suất COD
            </h5>
          </b-col>
          <b-col offset-md="6">
            <modal-explain-operation-cod-performance></modal-explain-operation-cod-performance>
          </b-col>
        </b-row>
      </div>
      <div class="mb-2">
        <b-row>
          <b-col md="6"><multi-select-province @handleProvinceSelected="handleProvinceSelectedCod"></multi-select-province></b-col>
          <b-col md="6"><multi-select-station :provinceIds="provinceIdsCod" @handleStationSelected="handleStationSelectedCod"></multi-select-station></b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col md="3"><date-time @handleSelectedDateTime="handleSelectedDateTime" :type="1"></date-time></b-col>
          <b-col md="3"><date-time @handleSelectedDateTime="handleSelectedDateTimeCompare" :type="2" :dateValue="dateCompare"></date-time></b-col>
          <b-col md="3"><single-select-don-diem @handleSelectedDonDiem="handleSelectedDonDiem"></single-select-don-diem></b-col>
          <b-col md="3"><multi-select-ca @handleSelectedCa="handleSelectedCa"></multi-select-ca></b-col>
        </b-row>
      </div>
      <div>
        <table-operation-cod-performance :provinceIds="provinceIdsCod" :stationIds="stationIdsCod" :date="date" :dateCompare="dateCompare" :donDiemId="donDiemId" :caIds="caIds"></table-operation-cod-performance>
      </div>
    </div>
  </div>
</template>
<script>
import FilterTime from 'components/pages/home/FilterTime'
import MultiSelectProvince from 'components/pages/home/MultiSelectProvince'
import MultiSelectStation from 'components/pages/home/MultiSelectStation'
import SingleSelectPackageAreaType from 'components/pages/home/SingleSelectPackageAreaType'
import SingleSelectPackageStatusType from 'components/pages/home/SingleSelectPackageStatusType'
import TableOperationSpeedPick from 'components/pages/home/TableOperationSpeedPick'
import TableOperationSpeedDeliver from 'components/pages/home/TableOperationSpeedDeliver'
import TableOperationSpeedTransit from 'components/pages/home/TableOperationSpeedTransit'
import TableOperationSpeedReturn from 'components/pages/home/TableOperationSpeedReturn'
import PieOperationReportFailedPick from 'components/pages/home/PieOperationReportFailedPick'
import PieOperationReportFailedDeliver from 'components/pages/home/PieOperationReportFailedDeliver'
import PieOperationReportDelayPick from 'components/pages/home/PieOperationReportDelayPick'
import PieOperationReportDelayDeliver from 'components/pages/home/PieOperationReportDelayDeliver'
import PieOperationReportDelayReturn from 'components/pages/home/PieOperationReportDelayReturn'
import TableOperationOverview from 'components/pages/home/TableOperationOverview'
import TableOperationCodPerformance from 'components/pages/home/TableOperationCodPerformance'
import SingleSelectDonDiem from 'components/pages/home/SingleSelectDonDiem'
import MultiSelectCa from 'components/pages/home/MultiSelectCa'
import DateTime from 'components/pages/home/DateTime'
import moment from 'moment'
import BarOperationSpeedPickDeliver from 'components/pages/home/BarOperationSpeedPickDeliver'
import BarOperationSpeedReturn from 'components/pages/home/BarOperationSpeedReturn'
import BarOperationSpeedTransit from 'components/pages/home/BarOperationSpeedTransit'
import ModalExplainOperationOverview from 'components/pages/home/ModalExplainOperationOverview'
import ModalExplainOperationSpeed from 'components/pages/home/ModalExplainOperationSpeed'
import ModalExplainOperationCodPerformance from 'components/pages/home/ModalExplainOperationCodPerformance'
import MultiSelectStation6h from 'components/pages/home/MultiSelectStation6h'
import MultiSelectStation12h from 'components/pages/home/MultiSelectStation12h'

export default {
  name: 'overview-operation',

  components: {
    FilterTime,
    MultiSelectProvince,
    MultiSelectStation,
    SingleSelectPackageAreaType,
    SingleSelectPackageStatusType,
    TableOperationSpeedPick,
    TableOperationSpeedDeliver,
    TableOperationSpeedTransit,
    TableOperationSpeedReturn,
    PieOperationReportFailedPick,
    PieOperationReportFailedDeliver,
    PieOperationReportDelayPick,
    PieOperationReportDelayDeliver,
    PieOperationReportDelayReturn,
    TableOperationOverview,
    SingleSelectDonDiem,
    MultiSelectCa,
    TableOperationCodPerformance,
    DateTime,
    BarOperationSpeedPickDeliver,
    BarOperationSpeedReturn,
    BarOperationSpeedTransit,
    ModalExplainOperationOverview,
    ModalExplainOperationSpeed,
    ModalExplainOperationCodPerformance,
    MultiSelectStation6h,
    MultiSelectStation12h
  },

  data: () => ({
    dateRange: null,
    dateRangeCompare: null,
    provinceIds: null,
    provinceIdsSpeed: null,
    packageAreaTypeId: null,
    packageStatusTypeId: null,
    provinceIdsReport: null,
    stationIdsReport: null,
    provinceIdsCod: null,
    stationIdsCod: null,
    donDiemId: null,
    caIds: null,
    date: null,
    dateCompare: null,
    myToggle: false,
    variant: 'outline-secondary',
    speedTransitSwitch: false,
    variantSpeedTransit: 'outline-secondary',
    today: moment().format('YYYY-MM-DD'),
    station6hs: null,
    station12hs: null,
    station6hSpeeds: null,
    station12hSpeeds: null
  }),

  created () {
  },

  computed: {
    stationIds: function () {
      let s6h = this.station6hs ? this.station6hs : []
      let s12h = this.station12hs ? this.station12hs : []
      let ids = [...s6h, ...s12h]
      return ids ? ids.map((item) => item.id).toString() : ''
    },

    stationIdsSpeed: function () {
      let s6h = this.station6hSpeeds ? this.station6hSpeeds : []
      let s12h = this.station12hSpeeds ? this.station12hSpeeds : []
      let ids = [...s6h, ...s12h]
      return ids ? ids.map((item) => item.id).toString() : ''
    }
  },

  watch: {
    date: function (newValue, oldValue) {
      this.dateCompare = moment(newValue).subtract(1, 'weeks').format('YYYY-MM-DD')
    }
  },

  methods: {
    handleSelectedDate: function (dateRange) {
      this.dateRange = dateRange
    },

    handleSelectedRangeTimeCompare: function (dateRangeCompare) {
      this.dateRangeCompare = dateRangeCompare
    },

    handleProvinceSelected: function (provinceOptions) {
      this.provinceIds = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleSelectedPackageAreaType: function (option) {
      this.packageAreaTypeId = option ? option.map((item) => item.id).toString() : ''
    },

    handleSelectedPackageStatusType: function (option) {
      this.packageStatusTypeId = option ? option.map((item) => item.id).toString() : ''
    },

    handleProvinceSelectedSpeed: function (provinceOptions) {
      this.provinceIdsSpeed = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleProvinceSelectedReport: function (option) {
      this.provinceIdsReport = option ? option.map((item) => item.id).toString() : ''
    },

    handleStationSelectedReport: function (options) {
      this.stationIdsReport = options ? options.map((item) => item.id).toString() : ''
    },

    handleProvinceSelectedCod: function (options) {
      this.provinceIdsCod = options ? options.map((item) => item.id).toString() : ''
    },

    handleStationSelectedCod: function (options) {
      this.stationIdsCod = options ? options.map((item) => item.id).toString() : ''
    },

    handleSelectedDonDiem: function (option) {
      this.donDiemId = option ? option.id : ''
    },

    handleSelectedCa: function (options) {
      this.caIds = options ? options.map((item) => item.id).toString() : ''
    },

    handleSelectedDateTime: function (date) {
      this.date = date
    },

    handleSelectedDateTimeCompare: function (date) {
      this.dateCompare = date
    },

    handleStation6hSelected: function (options) {
      this.station6hs = options
    },

    handleStation12hSelected: function (options) {
      this.station12hs = options
    },

    handleStation6hSelectedSpeed: function (options) {
      this.station6hSpeeds = options
    },

    handleStation12hSelectedSpeed: function (options) {
      this.station12hSpeeds = options
    }
  }
}
</script>
