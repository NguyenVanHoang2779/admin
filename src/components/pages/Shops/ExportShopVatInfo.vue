<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row>
          <h4 class="ml-2 mt-1">Export thông tin Shop yêu cầu xuất hóa đơn: &nbsp;</h4>
          <flat-pickr
            class="w-200px h-30px bg-white mr-2"
            v-model="rangeTime"
            :config="config"
            placeholder="Chọn khoảng thời gian"
            name="date"
            :events="['onClose']"
          ></flat-pickr>
          <b-button variant="success" class="ml-5 mt-1 w-123" @click="exportDataToExcel()"><i class="ion ion-md-cloud-download"></i> Xuất Excel</b-button>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .monthly-picker >>> .input {
    max-width: 85px !important;
    font-weight: bold;
    color: red;
  }
</style>
<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import config from '../../../config/app.base'
export default {
  name: 'ExportShopVatInfo',
  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper
  },

  data: () => ({
    rangeTime: null,

    config: {
      mode: 'range',
      altInput: true,
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      theme: 'light'
    }
  }),
  methods: {
    exportDataToExcel: function () {
      if (this.rangeTime === null) {
        commonHelper.showMessage('Vui lòng chọn thời gian!', 'warning')
        return
      }
      let times = this.rangeTime.split(' to ')
      let data = null
      if (times.length > 1) {
        data = {
          from: times[0] + ' 00:00:00',
          to: times[1] + ' 23:59:59'
        }
      } else {
        data = {
          from: times[0] + ' 00:00:00',
          to: times[0] + ' 23:59:59'
        }
      }
      window.open(config.baseApiUrl + 'AdShops/exportExcelShopVatInfo?date_from=' + data['from'] + '&date_to=' + data['to'])
    }
  }
}
</script>
