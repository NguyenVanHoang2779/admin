<template>
  <div>
    <h4 class="ui-block-heading">
      Tổng quan shop
    </h4>
    <hr class="mb-5">
    <div class="ui-block mb-5">
      <div>
        <b-row>
          <b-col>
            <h5 class="ui-block-heading">
              Tình hình tăng trưởng shop - thời gian thực
            </h5>
          </b-col>
          <b-col offset-md="6">
            <modal-explain-shop></modal-explain-shop>
          </b-col>
        </b-row>
      </div>
      <div class="mb-2">
        <filter-time @handleSelectedDate="handleSelectedDate" @handleSelectedRangeTimeCompare="handleSelectedRangeTimeCompare"></filter-time>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col md="12"><multi-select-province @handleProvinceSelected="handleProvinceSelected"></multi-select-province></b-col>
        </b-row>
      </div>
      <div>
        <table-shop-realtime :dateRange="dateRange" :provinceIds="provinceIds" :dateRangeCompare="dateRangeCompare"></table-shop-realtime>
      </div>
    </div>
    <div class="ui-block mb-5">
      <div class="mb-3">
        <filter-time-evolution @handleSelectedDate="handleSelectedDateEvolution"></filter-time-evolution>
      </div>
      <div class="mb-1">
        <b-row>
          <b-col>
            <h5 class="ui-block-heading">
              Diễn biến thời gian
            </h5>
          </b-col>
          <b-col offset-md="6">
            <modal-explain-shop></modal-explain-shop>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col><multi-select-province @handleProvinceSelected="handleProvinceSelectedTime"></multi-select-province></b-col>
          <b-col cols="3"><filter-shop @handleFilterShop="handleFilterShopTime"></filter-shop></b-col>
        </b-row>
      </div>
      <div>
        <line-chart-shop-time :dateRange="dateRangeEvolution" :provinceIds="provinceIdsTime" :filterShopTimeId="filterShopTimeId"></line-chart-shop-time>
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
            <modal-explain-shop></modal-explain-shop>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <b-row>
          <b-col><multi-select-limit-province @handleProvinceSelected="handleProvinceSelectedSpace"></multi-select-limit-province></b-col>
          <b-col cols="3"><filter-shop @handleFilterShop="handleFilterShopSpace"></filter-shop></b-col>
        </b-row>
      </div>
      <div>
        <line-chart-shop-space :dateRange="dateRangeEvolution" :provinceIds="provinceIdsSpace" :filterShopSpaceId="filterShopSpaceId"></line-chart-shop-space>
      </div>
    </div>
  </div>
</template>
<script>
import FilterTime from 'components/pages/home/FilterTime'
import MultiSelectProvince from 'components/pages/home/MultiSelectProvince'
import TableShopRealtime from 'components/pages/home/TableShopRealtime'
import FilterTimeEvolution from 'components/pages/home/FilterTimeEvolution'
import FilterShop from 'components/pages/home/FilterShop'
import LineChartShopTime from 'components/pages/home/LineChartShopTime'
import MultiSelectLimitProvince from 'components/pages/home/MultiSelectLimitProvince'
import LineChartShopSpace from 'components/pages/home/LineChartShopSpace'
import ModalExplainShop from 'components/pages/home/ModalExplainShop'

export default {
  name: 'overview-shop',

  components: {
    FilterTime,
    MultiSelectProvince,
    TableShopRealtime,
    FilterTimeEvolution,
    FilterShop,
    LineChartShopTime,
    MultiSelectLimitProvince,
    LineChartShopSpace,
    ModalExplainShop
  },

  data: () => ({
    dateRange: null,
    dateRangeCompare: null,
    provinceIds: null,
    dateRangeEvolution: null,
    provinceIdsTime: null,
    filterShopTimeId: null,
    provinceIdsSpace: null,
    filterShopSpaceId: null
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

    handleProvinceSelected: function (provinceOptions) {
      this.provinceIds = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleSelectedDateEvolution: function (dateRange) {
      this.dateRangeEvolution = dateRange
    },

    handleProvinceSelectedTime: function (provinceOptions) {
      this.provinceIdsTime = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleFilterShopTime: function (option) {
      this.filterShopTimeId = option ? option.id : null
    },

    handleProvinceSelectedSpace: function (provinceOptions) {
      this.provinceIdsSpace = provinceOptions ? provinceOptions.map((item) => item.id).toString() : ''
    },

    handleFilterShopSpace: function (option) {
      this.filterShopSpaceId = option ? option.id : null
    }
  }
}
</script>
