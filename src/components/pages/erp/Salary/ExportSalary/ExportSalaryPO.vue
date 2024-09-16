<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row class="justify-content-md-center">
          <b-col md="2">Chọn tháng</b-col>
          <b-col md="5"></b-col>
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
          <b-col md="3">
            <multiselect
              class="multiselect-primary"
              v-model="stationIds"
              :options="listStations"
              placeholder="Chọn kho (mặc định là tất cả)"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel="Chọn"
              track-by="name"
              label="name"
              :disabled="false"
              :searchable="true"
              :multiple="true"
              :hide-selected="true"
              :allow-empty="true"
              :close-on-select="false"
            ></multiselect>
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
              Xuất file lương Post Office</ladda-btn>
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
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import debounce from 'debounce'

export default {
  mounted () {
    this.getListStations()
  },
  components: {
    VueMonthlyPicker,
    LaddaBtn,
    Multiselect,
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
      let tempStationIds = this.stationIds
      tempStationIds = tempStationIds.map((value) => value.id)
      // xu li dinh dang  stationsids
      if (tempStationIds.length === 0) tempStationIds = null
      try {
        let dataSend = {
          month: this.salaryMonth.format('MM'),
          year: this.salaryMonth.format('YYYY'),
          stations: tempStationIds
        }
        let result = await SalaryService.exportSalaryPO(dataSend)
        this.buttonExport.loading = false
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
          let path = result.data.data
          let isUrl = this.validURL(path)
          if (isUrl) {
            window.location.href = path
          } else {
            commonHelper.showMessage('Có lỗi xảy ra, đường dẫn tải về không hợp lệ')
          }
        }
      } catch (e) {
        this.buttonExport.loading = false
        commonHelper.showMessage('Có lỗi xảy ra khi xuất file')
      }
    },
    validURL (str) {
      var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ) // fragment locator
      return !!pattern.test(str)
    },
    async getListStations () {
      try {
        let res = await SalaryService.getListStationsPO()
        this.listStations = res.data.data
        commonHelper.showMessage(res.data.message, 'success')
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho')
      }
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss" scoped></style>
