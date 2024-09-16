<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row class="mb-5">
          <b-col md="6">
            <h1>Xuất lương liên vùng</h1>
          </b-col>
          <b-col md="2"></b-col>
          <div class="float-md-right">
            <b-col>
              <b-form-group label="Định dạng xuất file">
                <b-form-radio-group
                  id="radio-group-1"
                  v-model="type"
                  :options="types"
                  name="radio-options"
                ></b-form-radio-group>
              </b-form-group>
            </b-col>
          </div>

          <b-col md="2">
            <ladda-btn
              :loading="buttonExport.loading"
              data-style="expand-right"
              :disabled="buttonExport.disabled"
              @click.native="exportToExcel"
              class="btn btn-primary"
              style="width: 100%"
            >
              <i class="ion ion-md-cloud-download" />Xuất file
            </ladda-btn>
          </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col md="2">Chọn tháng</b-col>
          <b-col md="8"></b-col>
        </b-row>
        <b-row class="justify-content-md-center mb-2">
          <b-col md="3">
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
          <b-col md="3">
            <multiselect
              class="multiselect-primary"
              v-model="userIds"
              :options="listUsers"
              placeholder="Chọn user (mặc định là tất cả)"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel="Chọn"
              track-by="name"
              label="name"
              @search-change="asyncFind"
              :disabled="false"
              :searchable="true"
              :multiple="true"
              :hide-selected="true"
              :allow-empty="true"
              :close-on-select="false"
              :loading="isLoading"
            ></multiselect>
          </b-col>
          <b-col md="1">
            <b-button variant="outline-success" @click="getLuongLV">
              <i class="sidenav-icon ion ion-md-search"></i>Tìm Kiếm
            </b-button>
          </b-col>
        </b-row>
        <!-- table -->
        <b-table
          striped
          hover
          responsive
          :fields="fieldsDataConfigCheckin"
          :items="dataConfig"
          :per-page="perPage"
          :current-page="currentPage"
        ></b-table>
        <hr />
        <b-row class="d-flex justify-content-center">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
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
      visible: false,
      stationIds: [],
      listStations: [],
      type: 'excel',
      types: ['csv', 'excel'],
      userIds: [],
      listUsers: [],
      isLoading: false,
      perPage: 5,
      currentPage: 1,
      dataConfig: [],
      fieldsDataConfigCheckin: [
        { key: 'username', label: 'username', sortable: true },
        { key: 'fullname', label: 'Họ tên', sortable: true },
        { key: 'station', label: 'Tên kho', sortable: true },
        { key: 'province', label: 'Tên tỉnh', sortable: true },
        { key: 'checkin', label: 'Tổng công thực tế', sortable: true },
        {
          key: 'total_product_kpi_raw',
          label: 'KPI tổng thực làm',
          sortable: true
        },
        { key: 'average_kpi', label: 'KPI trung bình', sortable: true },
        {
          key: 'productivity_salary',
          label: 'Lương sản lượng',
          sortable: true
        },
        { key: 'manager_salary', label: 'Lương quản lý', sortable: true },
        { key: 'kpi_salary', label: 'Lương KPI', sortable: true },
        { key: 'total_salary', label: 'Tổng lương', sortable: true }
      ]
    }
  },
  computed: {
    rows () {
      return this.dataConfig.length
    }
  },
  watch: {
    stationIds: function (newVal, oldVal) {
      this.asyncFind(null)
    }
  },
  methods: {
    async exportToExcel () {
      this.buttonExport.loading = true
      let tempStationIds = this.stationIds
      let tempUserIds = this.userIds
      tempUserIds = tempUserIds.map((value) => value.id)
      tempStationIds = tempStationIds.map((value) => value.id)
      // xu li dinh dang  stationsids
      if (tempStationIds.length === 0) tempStationIds = null
      try {
        let dataSend = {
          month: this.salaryMonth.format('MM'),
          year: this.salaryMonth.format('YYYY'),
          stations: tempStationIds,
          users: tempUserIds,
          type: this.type
        }
        let result = await SalaryService.exportSalaryLV(dataSend)
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
            commonHelper.showMessage('Có lỗi xảy ra')
          }
        }
      } catch (e) {
        this.buttonExport.loading = false
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    },
    async getListStations () {
      try {
        let res = await SalaryService.getListStations()
        this.listStations = res.data.data
        commonHelper.showMessage(res.data.message, 'success')
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
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
    asyncFind: debounce(async function (query) {
      let tempStationIds = this.stationIds
      tempStationIds = tempStationIds.map((value) => value.id)
      let dataSend = {
        term: query,
        stations: tempStationIds
      }
      this.isLoading = true
      try {
        // let res = await SalaryService.autoCompleteUserLV(dataSend)
        let res = await SalaryService.apiGetUserLV(dataSend)
        this.listUsers = res.data
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    }, 500),
    async getLuongLV () {
      let tempStationIds = this.stationIds
      tempStationIds = tempStationIds.map((value) => value.id)
      let tempUserIds = this.userIds
      tempUserIds = tempUserIds.map((value) => value.id)
      // xu li dinh dang  stationsids
      if (tempStationIds.length === 0) tempStationIds = null
      try {
        let dataSend = {
          month: this.salaryMonth.format('MM'),
          year: this.salaryMonth.format('YYYY'),
          stations: tempStationIds,
          users: tempUserIds,
          type: this.type
        }
        let result = await SalaryService.getLuongLV(dataSend)
        if (result.data.success === false) {
          commonHelper.showMessage(result.data.message, 'failed')
        } else {
          commonHelper.showMessage(result.data.message, 'success')
          this.dataConfig = result.data.data
          this.countSearchConfig = result.data.data.length
        }
      } catch (e) {
        commonHelper.showMessage('Có lỗi xảy ra')
      }
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss" scoped></style>
