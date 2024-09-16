<template>
  <b-card no-body>
    <b-card-body>
      <b-row><h4>Tool Quản Lý Lương Cod Tỉnh</h4></b-row>
      <b-row>
        <b-col md="2"><b-button variant="primary" class="btn-header" @click="changeUserView('show_salary')">Xem Lương <i class="fa fa-coins"></i></b-button></b-col>
        <b-col md="2"><b-button variant="primary" class="btn-header" @click="changeUserView('check_data_over_all')">Thống Kê Tổng Hợp <i class="fa fa-search"></i></b-button></b-col>
        <b-col md="2"><b-button variant="primary" class="btn-header" @click="changeUserView('check_data_detail')">Xuất Dữ Liệu Chi Tiết <i class="fa fa-search-plus"></i></b-button></b-col>
        <b-col md="2"><b-button variant="primary" class="btn-header" @click="changeUserView('export_salary')">Export Bảng Lương <i class="fa fa-download"></i></b-button></b-col>
      </b-row>
      <show-salary-cod-province v-if="isOpenShowSalary"/>
      <check-data-over-all v-if="isOpenCheckDataOverAll"/>
      <check-data-detail v-if="isOpenCheckDataDetail"/>
      <export-salary v-if="isExportSalary"/>
    </b-card-body>
    <br>
  </b-card>
</template>

<style scoped>
  .btn-header {
    width: 250px;
  }
</style>

<script>
import ShowSalaryCodProvince from './Component/ShowSalaryCodProvince'
import CheckDataDetail from './Component/CheckDataDetail'
import CheckDataOverAll from './Component/CheckDataOverAll'
import ExportSalary from './Component/ExportSalary'
export default {
  name: 'manage-salary-cod-province',
  components: {
    ShowSalaryCodProvince,
    CheckDataOverAll,
    CheckDataDetail,
    ExportSalary
  },
  data: () => ({
    isOpenShowSalary: false,
    isOpenCheckDataOverAll: false,
    isOpenCheckDataDetail: false,
    isExportSalary: false
  }),
  methods: {
    changeUserView (option) {
      this.resetUserView()
      if (option === 'show_salary') this.isOpenShowSalary = true
      if (option === 'check_data_over_all') this.isOpenCheckDataOverAll = true
      if (option === 'check_data_detail') this.isOpenCheckDataDetail = true
      if (option === 'export_salary') this.isExportSalary = true
    },
    resetUserView () {
      this.isOpenShowSalary = false
      this.isOpenCheckDataOverAll = false
      this.isOpenCheckDataDetail = false
      this.isExportSalary = false
    }
  },
  created () {
    this.isOpenShowSalary = true
  }
}
</script>
