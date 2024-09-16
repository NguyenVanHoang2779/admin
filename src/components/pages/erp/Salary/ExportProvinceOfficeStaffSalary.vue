<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Xuất bảng lương nhân viên văn phòng theo kho Tỉnh</div>
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------1. Tool Xuất bảng lương nhân viên văn phòng tỉnh-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          Xuất lương nhân viên văn phòng kho tỉnh
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" :visible="one.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md mb-4">
              <b-form-group label="Chọn kho (Để trống nếu chọn tất cả)">
                <select-province-stations :multiple="true" @selected="setSelectedStation"></select-province-stations>
              </b-form-group>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md mb-4">
              <label class="form-label">Chọn ngày (Từ đầu kỳ lương đến ngày hiện tại)</label>
              <datepicker
                      v-model="one.selectedDate"
                      format="dd-MM-yyyy"
                      :bootstrapStyling="true"
                      :monday-first="true"
                      :full-month-name="true"
                      placeholder="Ngày xuất lương"
                      :required="true"
                      :calendar-button="true"
                      calendar-button-icon="ion ion-md-calendar"
                      :clear-button="true"
              />
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="one.loadingButton" @click.native="exportProvinceOfficeStaff" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import moment from 'moment'
import VueMonthlyPicker from 'vue-monthly-picker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import SelectProvinceStations from 'components/pages/erp/Salary/SelectProvinceStations'
import salaryService from 'domain/services/salary-service'
import Datepicker from 'vuejs-datepicker'

export default {

  name: 'export-province-office-staff-salary',

  metaInfo: {
    title: 'Xuất bảng lương nhân viên văn phòng Tỉnh'
  },

  components: {
    LaddaBtn,
    VueMonthlyPicker,
    SelectProvinceStations,
    salaryService,
    Datepicker
  },

  data: () => ({
    one: {
      visible: true,
      selectedDate: '',
      selectedStations: '',
      responseMessage: {}
    },
    buttonBackGround: {
      backgroundColor: '#EEEEEE'
    }
  }),

  methods: {
    setSelectedStation (stationIds) {
      this.one.selectedStations = stationIds
    },

    exportProvinceOfficeStaff () {
      if (!this.one.selectedDate) return
      let dataSend = {
        date: moment(this.one.selectedDate).format('YYYY-MM-DD'),
        station_ids: this.one.selectedStations
      }
      salaryService.exportProvinceOfficeStaff(dataSend).then(response => {
        this.one.responseMessage = response.data
        if (response.data.hasOwnProperty('success') && response.data.success === true) {
          window.open(response.data.file_path, '_blank')
        }
      }).then(() => {
        this.one.loadingButton = false
      })
    }

  }
}
</script>
