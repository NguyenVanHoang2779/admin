<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="6">
          <h4 class="pt-1">Quản Lý Chạy Và Xuất Lương Cho Sale</h4>
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
      <b-row>
        <b-col md="2">
          <h5>Chọn vị trí</h5>
          <multiselect
            v-model="type"
            label="name"
            track-by="name"
            selectedLabel=""
            deselectLabel=""
            selectLabel="Chọn"
            :options="types"
            :searchable="false"
            :allow-empty="false">
          </multiselect>
        </b-col>
        <b-col md="6">
          <h5>Chọn Sale</h5>
          <multiselect class="multiselect-primary" :close-on-select="false"
           v-model="listUserSelected"
           :options="users"
           placeholder="Chọn Sale (Mặc Định Chọn Tất Cả)"
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
          <b-progress :value="isProcess" :variant="`success`" v-if="isProcess >= 0" height="6px" style="margin: 4px 0 0 0" />
        </b-col>
        <b-col>
          <h5>Quản Lý</h5>
          <b-button class="btn btn-outline-primary" @click="openSaleInformation = !openSaleInformation">Xem Thông Tin Sale</b-button>
          <b-button class="btn btn-outline-linux" @click="calculateSalesSalary">Chạy Lương</b-button>
          <b-button class="btn btn-outline-info" @click="showSaleSalary">Xem Lương</b-button>
          <b-button class="btn btn-outline-google" @click="exportSalarySale" :disabled="isProcess > -1">Xuất Lương <i v-if="isProcess >= 0" class="fa fa-spinner fa-spin"></i></b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row v-if="openSaleInformation">
        <b-col md="3">
          <b-form-input
            class="mb-3"
            v-model="filter"
            type="search"
            id="filterInput"
            placeholder="Nhập Nội Dung Để Lọc"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row v-if="openSaleInformation">
        <b-table
          class="ml-3"
          :fields="fieldsSale"
          :items="listSales"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          striped
          hover
        ></b-table>
      </b-row>
      <b-row class="d-flex justify-content-center" v-if="openSaleInformation">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-row>
      <hr>
      <b-row v-if="openSaleSalary">
        <b-table
          class="ml-3"
          :fields="fieldSaleSalary"
          :items="dataSaleSalary"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          striped
          hover
        ></b-table>
      </b-row>
      <b-row class="d-flex justify-content-center" v-if="openSaleSalary">
        <b-pagination
          v-model="currentPage"
          :total-rows="rowsSalary"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import saleService from 'domain/services/sale-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'show-sale-salary',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper
  },

  data: () => ({
    salaryMonth: new Moment(),
    listUserSelected: [],
    users: [],
    listSales: [],
    fieldsSale: [
      {key: 'id_user', label: 'ID User', sortable: true},
      {key: 'group_id', label: 'Group ID', sortable: true},
      {key: 'username', label: 'Tên Tài Khoản', sortable: true},
      {key: 'fullname', label: 'Họ Và Tên', sortable: true},
      {key: 'region', label: 'Miền', sortable: true},
      {key: 'resign_date', label: 'Ngày Nghỉ Việc', sortable: true},
      {key: 'staff_code', label: 'Staff Code', sortable: true},
      {key: 'address_name', label: 'Địa Chỉ', sortable: true},
      {key: 'station_name', label: 'Thuộc Kho', sortable: true},
      {key: 'ranking', label: 'Cấp Độ', sortable: true},
      {key: 'manager_level', label: 'Cấp Độ Quản Lý', sortable: true},
      {key: 'join_date', label: 'Ngày Vào', sortable: true},
      {key: 'start_date_day', label: 'Ngày Lương Chuẩn', sortable: true}
    ],
    filter: null,
    perPage: 7,
    currentPage: 1,
    openSaleInformation: false,
    fieldSaleSalary: [
      {key: 'year', label: 'Năm', sortable: true},
      {key: 'month', label: 'Tháng', sortable: true},
      {key: 'user_id', label: 'User ID', sortable: true},
      {key: 'username', label: 'Tên Tài Khoản', sortable: true},
      {key: 'fullname', label: 'Họ Và Tên', sortable: true},
      {key: 'name', label: 'Thuộc Kho', sortable: true},
      {key: 'leave_salary', label: 'Lương Phép', sortable: true},
      {key: 'emp_ds_salary_m1', label: 'Lương Doanh Số Tháng 1 Chính Thức', sortable: true},
      {key: 'emp_ds_salary_m2', label: 'Lương Doanh Số Tháng 2 Chính Thức', sortable: true},
      {key: 'allowance_manager', label: 'Phụ Cấp Quản Lý', sortable: true},
      {key: 'prob_ds_salary_m1', label: 'Lương Doanh Số Tháng 1 Thử Việc', sortable: true},
      {key: 'prob_ds_salary_m2', label: 'Lương Doanh Số Tháng 2 Thử Việc', sortable: true},
      {key: 'emp_holiday_salary', label: 'Lương Lễ Chính Thức', sortable: true},
      {key: 'prob_holiday_salary', label: 'Lương Lễ Thử Việc', sortable: true},
      {key: 'emp_guaranteed_salary', label: 'Lương Đảm Bảo Chính Thức', sortable: true},
      {key: 'prob_guaranteed_salary', label: 'Lương Đảm Bảo Thử Việc', sortable: true},
      {key: 'total_salary', label: 'Tổng Lương', sortable: true}
    ],
    dataSaleSalary: [],
    openSaleSalary: false,
    timeExport: null,
    isProcess: -1,
    dataTable: [],
    types: [
      {id: 1, name: 'Sale B2C'},
      {id: 2, name: 'B2B + NT'},
      {id: 4, name: 'Sale C2C'}
    ],
    type: {id: 1, name: 'Sale B2C'},
    typeCall: 1
  }),

  created () {
    this.getAllSales()
  },

  mounted () {},

  watch: {
    salaryMonth: function (newVal, oldVal) {
      this.getAllSales()
    },
    type: function (newValue, oldValue) {
      this.typeCall = newValue.id
      this.getAllSales()
    }
  },

  computed: {
    rows () {
      return this.listSales.length
    },
    rowsSalary () {
      return this.dataSaleSalary.length
    }
  },

  methods: {
    getAllSales () {
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      let type = 'salary'
      let typeCall = this.typeCall
      saleService.getAllSales({month, year, type, typeCall}).then(res => {
        if (res.data.success) {
          this.users = []
          this.listSales = []
          this.listUserSelected = []
          commonHelper.showMessage(res.data.message, 'success')
          res.data.data.forEach(sale => {
            this.listSales.push({
              'id_user': sale.ErpUser.id,
              'group_id': sale.ErpUser.group_id,
              'username': sale.ErpUser.username,
              'fullname': sale.ErpUser.fullname,
              'mp_id': sale.ErpMasterProfile.id,
              'region': sale.ErpMasterProfile.region,
              'resign_date': sale.ErpMasterProfile.resign_date,
              'staff_code': sale.ErpMasterProfile.staff_code,
              'address_name': sale.ErpAddress.name,
              'station_name': sale.ErpStation.name,
              'ranking': sale.ErpEmpProfile.ranking,
              'manager_level': sale.ErpEmpProfile.manager_level,
              'join_date': sale.ErpEmpProfile.join_date,
              'start_date_day': sale.ErpEmpProfile.start_date_day
            })
            this.users.push({'id': sale.ErpUser.id, 'name': sale.ErpUser.username + ` (${sale.ErpUser.fullname})`})
          })
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui Lòng Thử Lại Sau', 'warning')
      })
    },
    openManageExportFile () {
      window.open('manage-export-excel', '_blank')
    },
    showSaleSalary () {
      let saleIds = []
      this.listUserSelected.forEach(e => { saleIds.push(e.id) })
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      saleService.getSaleSalary({'user_id': saleIds, month, year, 'typeCall': this.typeCall}).then(res => {
        this.dataTable = []
        this.dataSaleSalary = []
        if (res.data.success) {
          this.openSaleSalary = true
          this.dataTable = res.data.data
          res.data.data.forEach(element => {
            this.dataSaleSalary.push({
              'year': element.year,
              'month': element.month,
              'user_id': element.user_id,
              'username': element.username,
              'fullname': element.fullname,
              'name': element.station_name,
              'leave_salary': element.salary_detail.leave_salary,
              'emp_ds_salary_m1': element.salary_detail.emp_ds_salary_m1,
              'emp_ds_salary_m2': element.salary_detail.emp_ds_salary_m2,
              'allowance_manager': element.salary_detail.allowance_manager,
              'prob_ds_salary_m1': element.salary_detail.prob_ds_salary_m1,
              'prob_ds_salary_m2': element.salary_detail.prob_ds_salary_m2,
              'emp_holiday_salary': element.salary_detail.emp_holiday_salary,
              'prob_holiday_salary': element.salary_detail.prob_holiday_salary,
              'emp_guaranteed_salary': element.salary_detail.emp_guaranteed_salary,
              'prob_guaranteed_salary': element.salary_detail.prob_guaranteed_salary,
              'total_salary': element.total_salary
            })
          })
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch((e) => {
        console.log('err ' + e)
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },
    calculateSalesSalary () {
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      let typeCall = this.typeCall
      if (this.listUserSelected.length > 0) {
        this.listUserSelected.forEach(sale => {
          saleService.createSalaryForEachSale({user_id: sale.id, month, year, typeCall}).then(res => {
            if (res.data.success) {
              commonHelper.showMessage(res.data.message, 'success')
            } else {
              commonHelper.showMessage(res.data.message, 'warning')
            }
          }).catch(() => {
            commonHelper.showMessage('Có lỗi xẩy ra', 'warning')
          })
        })
      } else {
        saleService.createSalaryForEachSale({month: month, year: year, typeCall}).then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).catch(() => {
          commonHelper.showMessage('Có lỗi xẩy ra', 'warning')
        })
      }
    },
    exportSalarySale () {
      let saleIds = []
      this.listUserSelected.forEach(e => { saleIds.push(e.id) })
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      let typeCall = this.typeCall
      let params = {
        'month': month,
        'year': year,
        'user_id': saleIds,
        'typeCall': typeCall
      }
      saleService.exportSalarySale(params).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.location.href = res.data.data.url_file
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    }
  }
}
</script>
