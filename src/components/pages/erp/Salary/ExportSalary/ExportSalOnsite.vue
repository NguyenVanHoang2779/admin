<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row class="justify-content-md-center">
          <b-col md="2">Chọn tháng</b-col>
          <b-col md="2"></b-col>
        </b-row>
        <b-row class="justify-content-md-center mb-2">
          <b-col md="2">
            <vue-monthly-picker
                class="monthly-picker"
                v-model="salaryMonth"
                placeholder="Chọn kỳ lương"
                :alignment="`center`"
                :dateFormat="`MM-YYYY`"
                :clearOption="false"
            ></vue-monthly-picker>
          </b-col>
          <b-col md="2">
            <ladda-btn
                :loading="buttonExport.loading"
                data-style="expand-right"
                :disabled="buttonExport.disabled"
                @click.native="exportToExcel"
                class="btn btn-info"
                style="width: 100%"
            >
              <i class="ion ion-md-cloud-download"></i>
              Xuất Lương Onsite</ladda-btn>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import SalaryService from 'domain/services/salary-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import debounce from 'debounce'

export default {
  mounted () {
  },
  components: {
    VueMonthlyPicker,
    LaddaBtn,
    debounce
  },
  data () {
    return {
      salaryMonth: new Moment(),
      buttonExport: {
        loading: false,
        disabled: false
      },
      stationIds: [],
      listStations: [],
      isLoading: false
    }
  },
  methods: {
    async exportToExcel () {
      this.buttonExport.loading = true
      try {
        let dataSend = {
          month: this.salaryMonth.format('MM'),
          year: this.salaryMonth.format('YYYY')
        }
        let result = await SalaryService.exportSalaryOnsite(dataSend)
        this.buttonExport.loading = false
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
          window.location.href = result.data.path
        }
      } catch (e) {
        this.buttonExport.loading = false
        commonHelper.showMessage('Có lỗi xảy ra khi xuất file')
      }
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss" scoped></style>
