<template>
  <div>
    <h3>Quản lí tăng ca</h3>
    <b-row>
      <b-col cols="2">
        <b-input v-model="dataSearch.termName" placeholder="Họ tên/Username nhân viên" />
      </b-col>
      <b-col cols="2">
        <single-select-region @handleSelectedRegion="handleSelectedRegion" :region="dataSearch.regionId"></single-select-region>
      </b-col>
      <b-col cols="2">
        <single-select-province @handleSelectedProvince="handleSelectedProvince" :provinceId="dataSearch.provinceId" :regionName="dataSearch.regionId"></single-select-province>
      </b-col>
      <b-col cols="2">
        <single-select-station @handleSelectedStation="handleSelectedStation" :provinceId="dataSearch.provinceId"></single-select-station>
      </b-col>
      <b-col cols="2">
        <v-date-picker mode="range" color="green" content="Chọn thời gian" :popover="{visibility: 'focus'}"
          :input-props='{placeholder: "Chọn thời gian đăng ký"}' v-model="dataSearch.time" locale="vi"/>
      </b-col>
      <b-col md="2">
        <multi-select-department :department-ids="dataSearch.departmentIds" @handleDepartmentSelected="handleDepartmentSelected"></multi-select-department>
      </b-col>
      <b-col md="2" class="mb-2">
        <multi-select-position :position-ids="dataSearch.positionIds" @handlePositionSelected="handlePositionSelected" :department-ids="dataSearch.departmentIds"></multi-select-position>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12" class="text-right" >
        <b-btn id="search-btn" variant="primary" @click="getWorkingOvertimes()"><span class="ion ion-md-search" ></span> Tìm kiếm</b-btn>
        <b-btn id="reset-btn" variant="outline-primary" @click="resetSearch()"><span class="ion ion-md-refresh" ></span> Làm lại</b-btn>
        <b-btn variant="success" @click="dataSearch.export = true, getWorkingOvertimes()"><i class="fas fa-file-excel"></i> Xuất dữ liệu</b-btn>
      </b-col>
    </b-row>
    <b-table-simple hover responsive outlined class="table-bordered mt-2">
      <b-thead head-variant="light">
        <b-tr>
          <b-th>Mã NV</b-th>
          <b-th>Miền</b-th>
          <b-th>Tỉnh</b-th>
          <b-th>Kho</b-th>
          <b-th>Username</b-th>
          <b-th>Họ và Tên</b-th>
          <b-th>Vị trí</b-th>
          <b-th>Loại đăng ký</b-th>
          <b-th>Ca đăng ký</b-th>
          <b-th>Lý do</b-th>
          <b-th>Ngày tăng ca</b-th>
          <b-th>Thời gian tạo</b-th>
        </b-tr>
      </b-thead>
        <b-tbody>
          <b-tr v-for="(item ,index) in items" v-bind:key="`${index}-${item.id}`">
            <b-td>{{item.staff_code}}</b-td>
            <b-td>{{item.region}}</b-td>
            <b-td>{{item.province_name}}</b-td>
            <b-td>{{item.station_name}}</b-td>
            <b-td>{{item.username}}</b-td>
            <b-td>{{item.fullname}}</b-td>
            <b-td>{{item.position_name}}</b-td>
            <b-td>{{checkinType[item.checkin_type]}}</b-td>
            <b-td>{{shiftDetails[item.shift_detail]}}</b-td>
            <b-td>{{item.note}}</b-td>
            <b-td>{{item.register_date}}</b-td>
            <b-td>{{item.created}}</b-td>
          </b-tr>
        </b-tbody>
    </b-table-simple>
    <div v-if="items.length === 0" class="text-center">Không có dữ liệu phù hợp</div>
    <div class="mt-3">
      <b-row>
        <b-col md="6">
          <b-pagination
          v-model="pageData.current"
          :total-rows="pageData.totalItems"
          :per-page="pageData.perPage"
          v-on:change="pageChanged"
          aria-controls="my-table"
          align="left"
          ></b-pagination>
        </b-col>
        <b-col md="6">
          <span class="text-muted">Trang {{ pageData.current }} trên {{ pageData.totalPages }}</span>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<style scoped>
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
// import Moment from 'moment'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectRegion from 'components/elements/common/SingleSelectProfileRegion'
import SalaryService from 'domain/services/salary-service'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import moment from 'moment'

export default {
  name: 'manage-working-weekend',

  components: {
    commonHelper,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectRegion,
    SalaryService,
    MultiSelectDepartment,
    MultiSelectPosition
  },

  data: () => ({
    items: [],
    checkinType: {
      'over_time': 'Tăng ca',
      'round_robin': 'Xoay ca'
    },
    shiftOn: {
      'day': 'Cả ngày',
      'morning': 'Sáng',
      'afternoon': 'Chiều',
      'evening': 'Tối'
    },
    shiftDetails: {
      'morning_afternoon': 'Sáng - Chiều',
      'morning_evening': 'Sáng - Tối',
      'afternoon_evening': 'Chiều - Tối',
      'morning': 'Sáng',
      'afternoon': 'Chiều',
      'evening': 'Tối'
    },
    dataSearch: {
      termName: '',
      provinceId: '',
      stationId: '',
      regionId: '',
      time: {
        start: '',
        end: ''
      },
      export: false,
      departmentIds: [],
      positionIds: []
    },
    pageData: {
      current: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10
    }
  }),

  created () {
    this.dataSearch.time.start = new Date()
    this.dataSearch.time.end = new Date()
    this.getWorkingOvertimes()
  },

  mounted () {
  },

  watch: {
  },

  computed: {},

  methods: {
    handleSelectedProvince (option) {
      this.dataSearch.provinceId = option ? option.id : null
    },

    handleSelectedStation (option) {
      this.dataSearch.stationId = option ? option.id : null
    },

    handleSelectedRegion (option) {
      this.dataSearch.regionId = option ? option.id : null
    },

    handleDepartmentSelected: function (option) {
      this.dataSearch.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    handlePositionSelected: function (option) {
      this.dataSearch.positionIds = option ? option.map((item) => item.id).toString() : ''
    },

    resetSearch () {
      this.dataSearch = {
        termName: '',
        provinceId: '',
        stationId: '',
        regionId: '',
        time: {
          start: '',
          end: ''
        },
        export: false,
        departmentIds: [],
        positionIds: []
      }
      this.getWorkingOvertimes()
    },
    pageChanged (page) { // Event check pagination change
      this.pageData.current = page
      this.getWorkingOvertimes()
    },
    getWorkingOvertimes () {
      let dataSearch = {
        page: this.pageData.current,
        termName: this.dataSearch.termName || '',
        provinceId: this.dataSearch.provinceId || '',
        stationId: this.dataSearch.stationId || '',
        regionId: this.dataSearch.regionId || '',
        export: this.dataSearch.export || '',
        departmentIds: this.dataSearch.departmentIds || '',
        positionIds: this.dataSearch.positionIds || ''
      }
      if (this.dataSearch.time && this.dataSearch.time.start & this.dataSearch.time.end) {
        dataSearch.start = moment(new Date(this.dataSearch.time.start)).format('YYYY-MM-DD')
        dataSearch.end = moment(new Date(this.dataSearch.time.end)).format('YYYY-MM-DD')
      }
      this.dataSearch.export = false
      this.$startLoading()
      SalaryService.getWorkingOvertimes(dataSearch).then(response => {
        if (response.data.success) {
          if (response.data.exportedLink) {
            window.open(response.data.exportedLink, '_blank')
            return commonHelper.showMessage('Xuất dữ liệu đăng ký tăng ca thành công', 'success')
          }
          this.pageData.totalItems = response.data.pagination.totalItems || 0
          this.pageData.perPage = response.data.pagination.perPage || 0
          this.pageData.totalPages = response.data.pagination.totalPages || 0
          this.pageData.current = response.data.pagination.current || 1
          this.items = response.data.data
        } else {
          commonHelper.showMessage(response.data.message, 'warn')
        }
      }).then(() => {
        this.$stopLoading()
      })
    }
  }
}
</script>
