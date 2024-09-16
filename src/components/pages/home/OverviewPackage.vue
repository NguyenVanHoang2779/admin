<template>
  <div>
    <h4 class="ui-block-heading">
      Tổng quan đơn
    </h4>
    <hr class="mb-5">
    <div class="ui-block mb-5">
      <div class="mb-1">
        <b-row>
          <b-col>
            <h5 class="ui-block-heading">
              Tình hình tăng trưởng đơn - thời gian thực
            </h5>
          </b-col>
          <b-col offset-md="6">
            <modal-explain-package></modal-explain-package>
          </b-col>
        </b-row>
      </div>
      <div class="mb-2">
        <filter-time @handleSelectedDate="handleSelectedDate" @handleSelectedRangeTimeCompare="handleSelectedRangeTimeCompare"></filter-time>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col><multi-select-province @handleProvinceSelected="handleProvinceSelectedForRealTime"></multi-select-province></b-col>
        </b-row>
      </div>
      <div>
        <table-package-realtime :dateRange="dateRange" :provinceIds="provinceIdsForRealTime" :dateRangeCompare="dateRangeCompare"></table-package-realtime>
      </div>
    </div>
    <div class="ui-block">
      <div class="mb-1">
        <b-row>
          <b-col>
            <h5 class="ui-block-heading">
              Diễn biến không gian
            </h5>
          </b-col>
          <b-col offset-md="6">
            <modal-explain-package></modal-explain-package>
          </b-col>
        </b-row>
      </div>
      <div class="mb-2">
        <filter-time-evolution @handleSelectedDate="handleSelectedDateEvolution"></filter-time-evolution>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col cols="6"><multi-select-limit-province @handleProvinceSelected="handleProvinceSpaceSelected"></multi-select-limit-province></b-col>
          <b-col cols="6"><filter-package-space @handleFilterPackageSpace="handleFilterPackageSpace"></filter-package-space></b-col>
        </b-row>
      </div>
      <div>
        <line-chart-package-space :dateRange="dateRangeEvolution" :provinceIds="provinceIdsForSpace" :compareId="packageSpaceCompareId"></line-chart-package-space>
      </div>
    </div>
  </div>
</template>
<script>
import FilterTime from 'components/pages/home/FilterTime'
import MultiSelectProvince from 'components/pages/home/MultiSelectProvince'
import TablePackageRealtime from 'components/pages/home/TablePackageRealtime'
import FilterTimeEvolution from 'components/pages/home/FilterTimeEvolution'
import FilterPackageTime from 'components/pages/home/FilterPackageTime'
import FilterPackageSpace from 'components/pages/home/FilterPackageSpace'
import LineChartPackageSpace from 'components/pages/home/LineChartPackageSpace'
import MultiSelectLimitProvince from 'components/pages/home/MultiSelectLimitProvince'
import ModalExplainPackage from 'components/pages/home/ModalExplainPackage'

export default {
  name: 'overview-package',

  components: {
    FilterTime,
    MultiSelectProvince,
    TablePackageRealtime,
    FilterTimeEvolution,
    FilterPackageTime,
    FilterPackageSpace,
    LineChartPackageSpace,
    MultiSelectLimitProvince,
    ModalExplainPackage
  },

  data: () => ({
    dateRange: null,
    dateRangeCompare: null,
    provinceIdsForRealTime: null,
    dateRangeEvolution: null,
    provinceIdsForTime: null,
    packageTimeCompareId: null,
    packageSpaceCompareId: null,
    provinceIdsForSpace: null
  }),

  created () {
  },

  methods: {
    handleSelectedDate: function (dateRange) {
      this.dateRange = dateRange
    },

    handleSelectedRangeTimeCompare: function (dateRangeCompare) {
      this.dateRangeCompare = dateRangeCompare
    },

    handleProvinceSelectedForRealTime: function (provinceOptions) {
      this.provinceIdsForRealTime = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleSelectedDateEvolution: function (dateRange) {
      this.dateRangeEvolution = dateRange
    },

    handleProvinceSelectedForTime: function (provinceOptions) {
      this.provinceIdsForTime = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleFilterPackageTime: function (compareOption) {
      this.packageTimeCompareId = compareOption.id
    },

    handleFilterPackageSpace: function (compareId) {
      this.packageSpaceCompareId = compareId
    },

    handleProvinceSpaceSelected: function (provinceOptions) {
      this.provinceIdsForSpace = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    }
  }
}
</script>
