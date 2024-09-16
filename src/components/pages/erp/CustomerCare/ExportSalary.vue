<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="6">
          <h4 class="pt-1">Chạy và xuất lương CSKH B2C:</h4>
        </b-col>
        <b-col cols="6">
          <b-row class="pl-3">
            <h5 class="pt-2"><span class="c-red">(*)</span> Chọn kỳ lương: &nbsp;</h5>
            <vue-monthly-picker
              class="monthly-picker"
              v-model="salaryMonth"
              :alignment="`center`"
              :dateFormat="`MM-YYYY`"
              :min="minMonth"
              :max="maxMonth"
              :clearOption="true"
            ></vue-monthly-picker>
          </b-row>
        </b-col>
      </b-row>
      <hr>
      <b-row class="mb-2">
        <b-col xl="2" md="2" class="mt-2">
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
        <b-col xl="6" md="8" class="mt-2">
          <multiselect class="multiselect-success"
            v-model="customerCares"
            :options="users"
            placeholder="Chọn CSKH cần chạy lương"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            track-by="ErpUser"
            label="ErpUser"
            :searchable="true"
            :multiple="true"
            :hide-selected="true"
            :allow-empty="true"
            :clearOption="true"
            :custom-label="customRecord"
          >
            <span slot="noResult">Rất tiếc, không tìm thấy!</span>
          </multiselect>
          <b-progress :value="countCustomerCare == 0 ? 0 : (runSuccessCust/countCustomerCare)*100" :max="100" variant="success" show-progress class="mt-2"></b-progress>
        </b-col>
        <b-col xl="4" md="2" class="right">
          <b-button variant="danger"  class="mt-2 w-130" @click="createDataSalary"><i class="ion ion-md-color-wand"></i> Chạy lương</b-button>
          <b-button variant="success"  class="mt-2 w-130" @click="showSalary"><i class="ion ion-ios-eye"></i> Show lương</b-button>
          <b-button variant="primary" class="mt-2 w-130" @click="exportToExcel"><i class="ion ion-md-cloud-download"></i> Xuất lương</b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col cols="3">
          <b-form-input class="search-size" size='sm' v-model="filter" placeholder="Tìm kiếm ..."></b-form-input>
        </b-col>
        <b-col>
          <p><b>Show lương: <span class="c-red">{{salaryData.length}}/{{countCustomerCare}}</span> cskh</b></p>
        </b-col>
      </b-row>
      <br>
      <div>
        <b-table
          responsive
          sticky-header
          class="card-table"
          ref="dataTable"
          :items="salaryData"
          :fields="fields"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          :per-page="paginConfig.per_page"
          :current-page="paginConfig.current_page"
          style="text-align: center;"
          :filter="filter"
          @filtered='onFiltered'
        ></b-table>
      </div>
      <b-pagination v-if="paginConfig.total_row > 0"
        class="mt-2"
        v-model="paginConfig.current_page"
        :total-rows="paginConfig.total_row"
        :per-page="paginConfig.per_page"
        align="center"
        size="sm"
      ></b-pagination>
    </b-card-body>
  </b-card>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .monthly-picker >>> .input {
    max-width: 85px !important;
    font-weight: bold;
    color: red;
  }

  .c-red {
    color: red;
  }

  .cus-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .right {
    text-align: center;
  }

  .w-130 {
    width: 130px;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CustomerCareService from 'domain/services/customer-care-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'

export default {
  name: 'export-salary',

  components: {
    Multiselect,
    commonHelper,
    CustomerCareService,
    VueMonthlyPicker,
    Moment
  },

  props: [],

  data: () => ({
    filter: null,
    isBusy: false,
    users: [],
    customerCares: [],
    salaryData: [],
    runSuccessCust: 0,
    countCustomerCare: 0,
    minMonth: new Moment('2019-10'),
    maxMonth: new Moment().format('YYYY-MM'),
    salaryMonth: new Moment(),
    types: [
      {id: 1, name: 'Tất cả'},
      {id: 2, name: 'Leader'},
      {id: 3, name: 'CSKH'}
    ],
    type: {id: 1, name: 'Tất cả'},
    paginConfig: {
      per_page: 5,
      current_page: 1,
      total_row: 0
    },
    fields: [
      { key: 'user_id', label: 'User ID', sortable: true },
      { key: 'is_main', label: 'Is main user', sortable: true },
      { key: 'staff_code', label: 'Mã nhân viên', sortable: true },
      { key: 'station_id', label: 'ID kho', sortable: true },
      { key: 'station_name', label: 'Kho', sortable: true },
      { key: 'full_name', label: 'Họ tên', sortable: true },
      { key: 'user_name', label: 'Tên đăng nhập', sortable: true },
      { key: 'group_name', label: 'Nhóm tài khoản', sortable: true },
      { key: 'ranking', label: 'Cấp bậc', sortable: true },
      { key: 'manager_level', label: 'Cấp bậc quản lý', sortable: true },
      { key: 'position_name', label: 'Vị trí', sortable: true },
      { key: 'contract_number', label: 'Hợp đồng', sortable: true },
      { key: 'contract_type', label: 'Loại hợp đồng', sortable: true },
      { key: 'start_contract_date', label: 'Ngày bắt đầu HĐ', sortable: true },
      { key: 'type_name', label: 'Thông tin HĐ', sortable: true },
      { key: 'end_contract_date', label: 'Ngày kết thúc HĐ', sortable: true },
      { key: 'salary_for_ot', label: 'Mức lương áp dụng tính ot', sortable: true },
      { key: 'salary_for_holiday', label: 'Mức lương áp dụng tính lễ', sortable: true },
      { key: 'count_tet_day', label: 'Số ngày tăng tết nguyên đám', sortable: true },
      { key: 'tet_bonus', label: 'Phụ cấp tết nguyên đám', sortable: true },
      { key: 'salary_for_leave', label: 'Mức lương áp dụng tính phép', sortable: true },
      { key: 'region', label: 'Miền', sortable: true },
      { key: 'join_date', label: 'Ngày vào chính thức', sortable: true },
      { key: 'work_shift_count_kpi_sunday', label: 'Công chuẩn', sortable: true },
      { key: 'emp_work_shift', label: 'Công chính thức', sortable: true },
      { key: 'prob_work_shift', label: 'Công thử việc', sortable: true },
      { key: 'emp_ot_work_shift', label: 'Công tăng ca chính thức', sortable: true },
      { key: 'prob_ot_work_shift', label: 'Công tăng ca thử việc', sortable: true },
      { key: 'emp_holiday', label: 'Công lễ chính thức', sortable: true },
      { key: 'prob_holiday', label: 'Công lễ thử việc', sortable: true },
      { key: 'leave_has_salary', label: 'Nghỉ phép', sortable: true },
      { key: 'total_shop', label: 'Số shop', sortable: true },
      { key: 'total_pro_shop', label: 'Số shop pro', sortable: true },
      { key: 'total_quantity_pkg', label: 'Số đơn hàng thành công', sortable: true },
      { key: 'return_percent', label: 'Tỷ lệ hoàn', sortable: true },
      { key: 'satisfied_percent', label: 'Tỷ lệ hài lòng', sortable: true },
      { key: 'change_return_percent', label: 'Tỷ lệ thay đổi tỷ lệ hoàn', sortable: true },
      { key: 'total_shop_grow_up', label: 'Tổng shop tăng trưởng', sortable: true },
      { key: 'total_shop_gone_away', label: 'Tổng shop rời bỏ', sortable: true },
      { key: 'percent_gone_away', label: 'Tỉ lệ rời bỏ', sortable: true },
      { key: 'first_percent_grow_up', label: 'Tỉ lệ tăng trưởng ban đầu', sortable: true },
      { key: 'percent_shop_grow_up', label: 'Tỉ lệ tăng trưởng đã tính phạt', sortable: true },
      { key: 'minimum_salary', label: 'Lương đảm bảo', sortable: true },
      { key: 'prob_salary', label: 'Lương thử việc', sortable: true },
      { key: 'emp_ot_salary', label: 'Lương tăng ca chính thức', sortable: true },
      { key: 'prob_ot_salary', label: 'Lương tăng ca thử việc', sortable: true },
      { key: 'leave_salary', label: 'Lương nghỉ phép', sortable: true },
      { key: 'emp_holiday_salary', label: 'Lương lễ chính thức', sortable: true },
      { key: 'prob_holiday_salary', label: 'Lương lễ thử việc', sortable: true },
      { key: 'quantity_salary', label: 'Kpi chăm sóc', sortable: true },
      { key: 'change_percent_return_salary', label: 'Kpi hoàn', sortable: true },
      { key: 'satisfied_salary', label: 'Lương tỷ lệ hài lòng', sortable: true },
      { key: 'allowance_manager', label: 'Phụ cấp quản lý', sortable: true },
      { key: 'grow_up_salary', label: 'Kpi tăng trưởng', sortable: true },
      { key: 'revenue_salary', label: 'Kpi kinh doanh', sortable: true },
      { key: 'kpi_salary', label: 'Lương kpi', sortable: true },
      { key: 'total_salary', label: 'Tổng lương', sortable: true }
    ],
    typeCall: null
  }),

  created () {
    this.getCustomterCares()
  },

  mounted () {},

  watch: {
    type: function (newValue, oldValue) {
      this.users = this.customerCares = []
      this.salaryData = []
      if (newValue.id === 1) {
        this.getCustomterCares()
        this.typeCall = null
      } else if (newValue.id === 2) {
        this.getCustomerCareLeader()
        this.typeCall = 1
      } else {
        this.getCustomerCareMember()
        this.typeCall = 2
      }
    }
  },

  computed: {},

  methods: {
    getCustomterCares: function () {
      CustomerCareService.getCustomerCares().then(res => {
        if (res.data.success) {
          this.users = res.data.data
          this.countCustomerCare = res.data.count
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    customRecord: function ({ErpUser, ErpStation, ErpAddress}) {
      return `${ErpUser.username} - ${ErpStation.name} - ${ErpAddress.name}`
    },

    getCustomerCareLeader: function () {
      CustomerCareService.getAllLeaderCustomerCareB2C().then(res => {
        if (res.data.success) {
          this.users = res.data.data
          this.countCustomerCare = res.data.count
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    getCustomerCareMember: function () {
      CustomerCareService.getAllMemberCustomerCareB2C().then(res => {
        if (res.data.success) {
          this.users = res.data.data
          this.countCustomerCare = res.data.count
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    createDataSalary: function () {
      this.runSuccessCust = 0
      let data = this.users
      this.times = this.salaryMonth.format('YYYY-MM').split('-')
      if (this.customerCares.length > 0) {
        data = this.customerCares
      }
      this.countCustomerCare = data.length
      data.forEach(element => {
        let dataSend = {
          month: this.times[1],
          year: this.times[0],
          user_id: element.ErpUser.id
        }
        if (this.typeCall === 1) {
          CustomerCareService.createLeaderSalary(dataSend).then(res => {
            if (res.data.success) {
              this.runSuccessCust += 1
              commonHelper.showMessage(res.data.message, 'success')
            } else {
              commonHelper.showMessage(res.data.message, 'warning')
            }
          }).catch(() => {
            commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
          })
        } else if (this.typeCall === 2) {
          CustomerCareService.createMemberSalary(dataSend).then(res => {
            if (res.data.success) {
              this.runSuccessCust += 1
              commonHelper.showMessage(res.data.message, 'success')
            } else {
              commonHelper.showMessage(res.data.message, 'warning')
            }
          }).catch(() => {
            commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
          })
        } else commonHelper.showMessage('Vui chọn chạy cho member hoặc cho leader')
      })
    },

    onFiltered (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    },

    showSalary: function () {
      let data = this.users
      this.times = this.salaryMonth.format('YYYY-MM').split('-')
      if (this.customerCares.length > 0) {
        data = this.customerCares
      }
      let dataSend = {
        type: this.type.id,
        month: this.times[1],
        year: this.times[0],
        users: data
      }
      CustomerCareService.showCustomerCareB2CSalary(dataSend).then(res => {
        if (res.data.success) {
          this.salaryData = res.data.data
          this.paginConfig.total_row = res.data.count
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    exportToExcel: function () {
      if (this.type.id === 1) {
        commonHelper.showMessage('Không thể xuất dữ liệu lương leader và cskh trong cùng một file!', 'warning')
        return
      }
      if (this.salaryData.length < 1) {
        commonHelper.showMessage('Không có dữ liệu lương, Hãy show lương trước lúc xuất excel!', 'warning')
        return
      }
      this.times = this.salaryMonth.format('YYYY-MM').split('-')
      let dataSend = {
        salary_data: this.salaryData,
        type: this.type.id,
        month: this.times[1],
        year: this.times[0]
      }
      CustomerCareService.exportCustomerCareB2CSalary(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.location.href = res.data.path
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
