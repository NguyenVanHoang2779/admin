<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="6">
          <h4 class="pt-1">Quản Lý Dữ Liệu COD Trung Chuyển Partime</h4>
        </b-col>
        <b-col cols="6">
          <b-row class="pl-3">
            <h4 class="mt-1 mr-3">Chọn kỳ lương</h4>
            <vue-monthly-picker
              class="monthly-picker"
              v-model="salaryMonth"
              placeHolder="Chọn kỳ lương"
              :alignment="`center`"
              :dateFormat="`MM-YYYY`"
              :clearOption="false"
            ></vue-monthly-picker>
          </b-row>
        </b-col>
      </b-row>
      <hr>
      <b-row class="mb-2">
        <b-col class="mt-2" md="2">
          <multi-select-region
            :auto-close="true"
            :hide-selected="true"
            @handleRegionSelected="handleRegionSelected"
          >
          </multi-select-region>
        </b-col>
        <b-col class="mt-2" md="2">
          <multi-select-province
            @handleProvinceSelected="handleProvinceSelected"
            :display-all="true"
            :limit-prop=99999
            :region="regionIds"
            :auto-close="false"
            :hide-selected="true"
          />
        </b-col>
        <b-col class="mt-2" md="2">
          <multi-select-station
            @handleStationSelected="handleStationSelected"
            :province-ids="provinceIds"
            :display-all="true"
            :limit-prop=99999
            :auto-close="false"
            :hide-selected="true"
          />
        </b-col>
        <b-col class="mt-2" md="1">
          <b-form-checkbox
            v-model="is_group_by_date"
          >
            Xuất chi tiết từng ngày
          </b-form-checkbox>
        </b-col>
        <b-col>
            <b-button @click="getListUser" class="btn btn-outline-primary mt-2 mr-3"><i class="ion ion-ios-eye"></i> Lấy Danh Sách User</b-button>
            <b-button @click="getDataTransitByCondition" class="btn btn-outline-info mt-2 mr-3"><i class="ion ion-ios-eye"></i> Lấy Dữ Liệu</b-button>
            <b-button @click="exportDataToExcel" class="btn btn-outline-success mt-2 w-150 mr-3"><i class="ion ion-md-cloud-download"></i> Xuất Dữ Liệu</b-button>
            <b-button @click="openManageFileExported" class="btn btn-outline-secondary mt-2 w-150 mr-3"><i class="ion ion-md-cloud-download"></i> Các File Đã Xuất</b-button>
        </b-col>
      </b-row>
      <b-row class="mt-1 mb-3">
        <b-col class="mt-2">
          <multiselect class="multiselect-primary" :close-on-select="false"
           v-model="listUserSelected"
           :options="users"
           placeholder="Chọn COD (Mặc định lấy tất COD lấy được)"
           selectedLabel="Đã chọn"
           deselectLabel="Bỏ chọn"
           selectLabel="Chọn"
           label="name"
           track-by="name"
           :searchable="true"
           :multiple="true"
           :hide-selected="true"
           :allow-empty="true"
           :clearOption="true"
          >
            <span slot="noResult">Rất tiếc, không tìm thấy!</span>
          </multiselect>
        </b-col>
      </b-row>
      <b-row class="mb-1 mt-1">
        <b-col>
          <b-button class="ml-1 btn btn-outline-primary" v-for="user in listsUser" :key="user" @click="changeDisplayData(user)">{{user}}</b-button>
        </b-col>
        <b-col md="3">
          <b-form-input
            v-if="dataTransit.length > 0"
            class="mb-3"
            v-model="filter"
            type="search"
            id="filterInput"
            placeholder="Nhập Nội Dung Để Lọc"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row id="all-data-transit" v-if="dataTransit.length > 0">
        <b-table
          hover striped
          :items="dataTransit"
          :fields="fields"
          :filter="filter"
        >
          <template v-slot:cell(date)="row">
            <b-button size="sm" class="btn btn-outline-primary" @click="getDetailDataByDate(row.item)">{{row.item.date}}</b-button>
          </template>
        </b-table>
      </b-row>
      <hr>
      <br>
      <b-row v-if="dataDetailByDate.length > 0">
        <h5 class="ml-1">Thông Tin Chi Tiết Theo Ngày</h5>
      </b-row>
      <b-row id="data-detail-by-date" v-if="dataDetailByDate.length > 0">
        <b-table
          :fields="fieldsDetailByDate"
          :items="dataDetailByDate"
          striped
          hover
        >
          <template v-slot:cell(station_id)="row">
            <b-button size="sm" class="btn btn-outline-primary" @click="getDataDetailByStation(row.item)">{{row.item.station_id}}</b-button>
          </template>
        </b-table>
      </b-row>
      <hr>
      <br>
      <b-row v-if="dataDetailStations">
        <h5 class="ml-1">Thông Tin Chi Tiết Theo Kho</h5>
      </b-row>
      <b-row id="data-detail-by-station" v-if="dataDetailStations">
        <table class="table table-hover">
          <tr>
            <th>Các Packages Nhập</th>
            <th>Các Packages Lấy</th>
          </tr>
          <tr>
            <th>
              <b-badge size="lg" class="badge badge-outline-primary ml-3 mr-3 mt-3 mb-3" v-for="(type, pkg) in dataDetailStations.transit" :key="pkg">{{pkg}} Nặng {{type}} kg</b-badge>
            </th>
            <th>
              <b-badge size="lg" class="badge badge-outline-primary ml-3 mr-3 mt-3 mb-3" v-for="(type, pkg) in dataDetailStations.import" :key="pkg">{{pkg}}  Nặng {{type}} kg</b-badge>
            </th>
          </tr>
        </table>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CustomerCareService from 'domain/services/customer-care-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import MultiSelectStation from './ConfigCheckinComponent/MultiSelectStation'
import MultiSelectProvince from './TransitComponent/MultiSelectProvince'
import MultiSelectRegion from './TransitComponent/MultiSelectRegion'
import SalaryService from 'domain/services/salary-service'

export default {
  name: 'export-salary',

  components: {
    Multiselect,
    commonHelper,
    CustomerCareService,
    VueMonthlyPicker,
    Moment,
    MultiSelectStation,
    MultiSelectProvince,
    MultiSelectRegion,
    SalaryService
  },

  data: () => ({
    option: null,
    regionIds: null,
    provinceIds: null,
    stationIds: null,
    users: [],
    listUserSelected: [],
    minMonth: new Moment('2019-10'),
    maxMonth: new Moment().format('YYYY-MM'),
    salaryMonth: new Moment(),
    saveDataResponse: null,
    fields: [
      {key: 'date', label: 'Ngày', sortable: true},
      {key: 'user_id', label: 'ID User', sortable: true},
      {key: 'username', label: 'Tên Tài Khoản', sortable: true},
      {key: 'fullname', label: 'Họ Và Tên', sortable: true},
      {key: 'position_name', label: 'Vị Trí', sortable: true},
      {key: 'name', label: 'Thuộc Kho', sortable: true},
      {key: 'province_name', label: 'Tỉnh', sortable: true},
      {key: 'region', label: 'Miền', sortable: true},
      {key: 'alias', label: 'Alias', sortable: true},
      {key: 'cod_id', label: 'ID COD', sortable: true},
      {key: 'staff_code', label: 'Staff Code', sortable: true},
      {key: 'total_import', label: 'Tổng Package Nhập', sortable: true},
      {key: 'total_transit', label: 'Tổng Package Lấy', sortable: true},
      {key: 'total_reward', label: 'Tổng Thưởng ĐH Quy Đổi', sortable: true},
      {key: 'total_km', label: 'Tổng Số Mét', sortable: true},
      {key: 'total_convert', label: 'Tổng ĐH Quy Đổi', sortable: true},
      {key: 'reward_salary', label: 'Lương Thưởng Tốc Độ', sortable: true},
      {key: 'km_salary', label: 'Lương KM', sortable: true},
      {key: 'pkg_salary', label: 'Lương Sản Lượng', sortable: true}
    ],
    dataTransit: [],
    listsUser: null,
    dataPicked: null,
    filter: null,
    openManageFile: false,
    fieldsDetailByDate: [
      {key: 'station_id', label: 'Id Kho', sortable: true},
      {key: 'name', label: 'Tên Kho', sortable: true},
      {key: 'station_serial', label: 'Thứ Tự Di Chuyển', sortable: true},
      {key: 'distance', label: 'Khoảng Cách (Mét)', sortable: true},
      {key: 'count_transit_pkgs', label: 'Số Packages Lấy', sortable: true},
      {key: 'count_import_pkgs', label: 'Số Packages Nhập', sortable: true},
      {key: 'count_converted_pkgs', label: 'Số Đơn Hàng Quy Đổi', sortable: true},
      {key: 'count_reward_pkgs', label: 'Số Đơn Thưởng Quy Đổi', sortable: true},
      {key: 'arrival_time', label: 'Thời Gian Đến Kho', sortable: true},
      {key: 'leave_time', label: 'Thời Gian Rời Kho', sortable: true}
    ],
    dataDetailByDate: [],
    dataDetailStations: null,
    userForSearchStation: null,
    provinceIdsByRegion: null,
    is_group_by_date: false
  }),

  created () {
    this.getListUser()
  },

  mounted () {},

  watch: {
  },

  computed: {},

  methods: {
    handleProvinceSelected (option) {
      if (typeof option[0] !== 'undefined') {
        this.provinceIds = option.map(option => option.id).toString()
      } else {
        this.provinceIds = null
      }
    },

    handleStationSelected (option) {
      if (typeof option[0] !== 'undefined') {
        this.stationIds = option.map(option => option.id).toString()
      } else {
        this.stationIds = null
      }
    },

    handleRegionSelected (option) {
      this.regionIds = option ? option.id : null
    },

    getListUser () {
      if (this.stationIds !== null) {
        this.getAllCodByStationIds(this.stationIds)
      } else if (this.provinceIds !== null) {
        this.getAllCodByProvinceIds(this.provinceIds)
      } else this.getAllCodByRegionIds(this.regionIds)
    },

    getAllCodByRegionIds (region) {
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      SalaryService.getAllCodByCondition({region, month, year}).then(res => {
        this.fillUsernameToSelect(res)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },

    getAllCodByProvinceIds (province) {
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      SalaryService.getAllCodByCondition({province, month, year}).then(res => {
        this.fillUsernameToSelect(res)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },

    getAllCodByStationIds (station) {
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      SalaryService.getAllCodByCondition({station, month, year}).then(res => {
        this.fillUsernameToSelect(res)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },

    fillUsernameToSelect (data) {
      if (data.data.success) {
        this.users = []
        let dataExtract = data.data.data
        commonHelper.showMessage(data.data.message, 'success')
        for (let userInfo in data.data.data) {
          this.users.push({id: dataExtract[userInfo]['ErpSgwTransitKpi']['tr_uid'], name: dataExtract[userInfo]['ErpUser'].username + ` (${dataExtract[userInfo]['ErpUser'].fullname} - Kho ${dataExtract[userInfo]['ErpStation'].name})`})
        }
      } else {
        this.users = []
        commonHelper.showMessage(data.data.message, 'warning')
      }
    },

    exportDataToExcel () {
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      let userIds
      if (this.users.length > 0 && this.listUserSelected.length === 0) {
        userIds = this.users.map(element => element.id).toString()
      } else if (this.listUserSelected.length > 0) {
        userIds = this.listUserSelected.map(element => element.id).toString()
      } else {
        return commonHelper.showMessage('Vui lòng chọn user cần xuất', 'warning')
      }
      SalaryService.exportDataTransit({user_ids: userIds, month, year, is_group_by_date: this.is_group_by_date}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.location.href = res.data.data
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại', 'warning')
      })
    },

    getDataTransitByCondition () {
      this.dataDetailStations = null
      this.dataDetailByDate = []
      let userIds
      if (this.users.length > 0 && this.listUserSelected.length === 0) {
        userIds = this.users.map(element => element.id).toString()
      } else if (this.listUserSelected.length > 0) {
        userIds = this.listUserSelected.map(element => element.id).toString()
      } else {
        return commonHelper.showMessage('Vui lòng chọn user cần xuất', 'warning')
      }
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      SalaryService.getDataTransitByCondition({month, year, userIds}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.saveDataResponse = res.data.data
          this.listsUser = Object.keys(res.data.data)
          this.dataPicked = this.listsUser[0]
          Object.keys(res.data.data[this.dataPicked]).forEach(element => {
            this.dataTransit.push(res.data.data[this.dataPicked][element])
          })
          let e = document.getElementById('all-data-transit')
          e.scrollIntoView({behavior: 'smooth'})
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.clearData()
        }
      }).catch((e) => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },

    getDetailDataByDate (dataSearch) {
      this.dataDetailStations = null
      SalaryService.getTransitDetailByDate({'date': dataSearch.date, 'username': dataSearch.username}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage('Lấy dữ liệu thành công', 'success')
          this.dataDetailByDate = res.data.data.data_in_station
          this.userForSearchStation = res.data.data.user_info.username
          let e = document.getElementById('data-detail-by-date')
          e.scrollIntoView({behavior: 'smooth'})
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.dataDetailByDate = []
          this.userForSearchStation = null
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },

    getDataDetailByStation (dataSearch) {
      SalaryService.getTransitDataByStation({'arrival_time': dataSearch.arrival_time, 'leave_time': dataSearch.leave_time, 'station_id': dataSearch.station_id, 'username': this.userForSearchStation})
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.dataDetailStations = res.data.data
            let e = document.getElementById('data-detail-by-station')
            e.scrollIntoView({behavior: 'smooth'})
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.dataDetailStations = null
          }
        })
        .catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
        })
    },

    changeDisplayData (user) {
      this.dataTransit = []
      Object.keys(this.saveDataResponse[user]).forEach(element => {
        this.dataTransit.push(this.saveDataResponse[user][element])
      })
      this.dataDetailStations = null
      this.dataDetailByDate = []
    },

    clearData () {
      this.dataTransit = []
      this.saveDataResponse = []
      this.dataPicked = null
      this.listsUser = null
      this.dataDetailByDate = []
      this.dataDetailStations = null
    },

    openManageFileExported () {
      window.open('manage-export-excel', '_blank')
    }
  }
}
</script>
