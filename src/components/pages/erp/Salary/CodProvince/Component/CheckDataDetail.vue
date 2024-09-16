<template>
  <b-card-body>
    <b-row><h3 class="ml-3">Config Vùng Của Coupon</h3></b-row>
    <br>
    <b-row>
      <b-col>
        <multi-select-province
          @handleProvinceSelected="handleProvinceSelected"
          :display-all="true"
          :limit-prop=99999 :auto-close="false"
          :hide-selected="true"
        >
        </multi-select-province>
      </b-col>
      <b-col>
        <multi-select-station
          @handleStationSelected="handleStationSelected"
          :province-ids="provinceIds"
          :display-all="true"
          :limit-prop=99999 :auto-close="false"
          :hide-selected="true"
        >
        </multi-select-station>
      </b-col>
      <b-col>
        <datepicker
          v-model="fromDate"
          :format="customFormatter"
          class="from-date"
          :bootstrapStyling="true"
          placeholder="Ngày bắt đầu"
        ></datepicker>
      </b-col>
      <b-col>
        <datepicker
          v-model="toDate"
          :format="customFormatter"
          class="from-date"
          :bootstrapStyling="true"
          placeholder="Ngày kết thúc"
        ></datepicker>
      </b-col>
      <b-col md="1">
        <b-btn variant="outline-info" @click="exportIndicatorCod()" :disabled="isBusy">Xuất file <i v-if="isBusy" class="fa fa-spin fa-spinner"></i></b-btn>
      </b-col>
    </b-row>
  </b-card-body>
</template>
<style scoped>
.non-blur >>> .multiselect--disabled {
  opacity: 1!important;
  pointer-events: auto;
}
</style>
<script>
import Multiselect from 'vue-multiselect'
import MultiSelectProvince from 'components/pages/erp/Salary/TransitComponent/MultiSelectProvince'
import MultiSelectStation from '../../ConfigCheckinComponent/MultiSelectStation'
import commonHelper from 'infrastructures/helpers/common-helpers'
import salaryService from 'domain/services/salary-service'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'export-indicator-cod',
  components: {
    MultiSelectProvince,
    MultiSelectStation,
    Multiselect,
    Datepicker
  },
  data: () => ({
    dataUpdate: null,
    provinceIds: null,
    stationIds: null,
    fromDate: null,
    toDate: null,
    isBusy: false
  }),
  watch: {},
  created () {},
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    handleProvinceSelected (option) {
      this.provinceIds = option ? option.map((item) => item.id).toString() : null
    },
    handleStationSelected (option) {
      this.stationIds = option ? option.map((item) => item.id).toString() : null
    },
    exportIndicatorCod () {
      this.isBusy = true
      if (this.fromDate === null) return commonHelper.showMessage('Vui lòng chọn ngày bắt đầu')
      if (this.toDate === null) return commonHelper.showMessage('Vui lòng chọn ngày kết thúc')
      let fromDate = this.customFormatter(this.fromDate)
      let toDate = this.customFormatter(this.toDate)
      salaryService.exportIndicatorCod({from_date: fromDate, to_date: toDate, province_id: this.provinceIds, station_id: this.stationIds}).then(res => {
        if (res.data.success) {
          window.location.href = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      }).finally(() => {
        this.isBusy = false
      })
    }
  }
}
</script>
