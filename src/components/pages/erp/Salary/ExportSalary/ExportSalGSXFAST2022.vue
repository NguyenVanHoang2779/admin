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
                    place-holder="Chọn kỳ lương"
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
              Xuất Lương GSXFAST 2022</ladda-btn>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import Multiselect from 'vue-multiselect'
import SalaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import debounce from 'debounce'

export default {
  mounted () {
  },
  components: {
    VueMonthlyPicker,
    LaddaBtn,
    Multiselect,
    debounce,
    commonHelper,
    SalaryService
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
      let parmas = {
        month: this.salaryMonth.format('MM'),
        year: this.salaryMonth.format('YYYY')
      }
      SalaryService.exportSalaryByMonthGsXFast(parmas)
        .then((res) => {
          if (res.data.success) {
            window.location.href = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
          this.buttonExport.loading = false
        })
        .catch((e) => {
          this.buttonExport.loading = false
          console.log(e)
        })
    },
    formatterParams (key, params) {
      if (!params) return ''
      else if (typeof params === 'object') {
        if (params.length === 0) return ''
        else return key + '[]=' + params.join('&' + key + '[]=') + '&'
      } else return key + '=' + params + '&'
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss" scoped></style>
