<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row>
          <b-col cols="5">
            <b-row>
              <h4 class="mt-1 ml-2">Tổng quan kỳ lương: &nbsp;</h4>
              <vue-monthly-picker
                class="monthly-picker"
                v-model="salaryMonth"
                :alignment="`center`"
                :dateFormat="`MM-YYYY`"
                :min="minMonth"
                :clearOption="false"
              ></vue-monthly-picker>
            </b-row>
          </b-col>
          <b-col class="mt-1" cols="6">
            <h4>{{fullname}}</h4>
          </b-col>
          <b-col cols="1">
            <a :href="`https://admin.giaohangtietkiem.vn/admin/co_che_luong/sale.html`" target="_blank">Xem cơ chế lương</a>
          </b-col>
        </b-row>
        <hr>
        <b-row>
          <b-col class="mt-1">
            <h5>
              <b-button @click="showCollapseSalary = !showCollapseSalary" size="sm" variant="outline-dark">
                <i v-if="!showCollapseSalary" class="ion ion-ios-arrow-forward"></i>
                <i v-else class="ion ion-ios-arrow-down"></i>
              </b-button>
              &nbsp;Lương dự kiến: &nbsp;
              <span v-numeral v-text="Math.floor(totalSalary)"></span>
            </h5>
          </b-col>
        </b-row>
        <b-collapse id="collapse-1" v-model="showCollapseSalary">
          <b-row>
            <b-col>
              <ul>
                <li>Lương doanh số tháng 1: &nbsp; <span v-numeral v-text="Math.floor(salaryDetail.prob_ds_salary_m1 + salaryDetail.emp_ds_salary_m1)"></span></li>
                <li>Lương doanh số tháng 2: &nbsp; <span v-numeral v-text="Math.floor(salaryDetail.prob_ds_salary_m2 + salaryDetail.emp_ds_salary_m2)"></span></li>
                <li>Công chuẩn: &nbsp; {{timeSheet.total_work_date}}/{{timeSheet.require_work_date}}</li>
              </ul>
            </b-col>
            <b-col>
              <ul>
                <li>Lương lễ: &nbsp; <span v-numeral v-text="Math.floor(salaryDetail.prob_holiday_salary + salaryDetail.emp_holiday_salary)"></span></li>
                <li>Lương phép: &nbsp; <span v-numeral v-text="Math.floor(salaryDetail.leave_salary)"></span></li>
                <li>Công phép: &nbsp; {{timeSheet.leave.has_salary}}</li>
              </ul>
            </b-col>
            <b-col>
              <ul>
                <li>Phụ cấp quản lý: &nbsp; <span v-numeral v-text="Math.floor(salaryDetail.allowance_manager)"></span></li>
                <li>Trừ tiền nghỉ không lương: &nbsp; <span v-numeral v-text="Math.floor(salaryDetail.prob_leave_without_salary + salaryDetail.emp_leave_without_salary)"></span></li>
                <li>Số ngày nghỉ không lương: &nbsp; {{timeSheet.leave.without_salary}}</li>
              </ul>
            </b-col>
          </b-row>
        </b-collapse>
        <b-row>
          <b-col>
            <h5><b-button @click="showCollapseDetailKpi = !showCollapseDetailKpi" size="sm" variant="outline-dark">
              <i v-if="!showCollapseDetailKpi" class="ion ion-ios-arrow-forward"></i>
              <i v-else class="ion ion-ios-arrow-down"></i>
              </b-button>
              &nbsp;Kpi chi tiết:
            </h5>
          </b-col>
        </b-row>
        <b-collapse id="collapse-2" v-model="showCollapseDetailKpi">
          <b-row>
            <b-col>
              <ul>
                <li>Số shop: &nbsp; {{kpiEmployee.total_shop}}</li>
                <li>Tổng doanh số: &nbsp; <span v-numeral v-text="Math.floor(kpiEmployee.prob_ds_m1 + kpiEmployee.emp_ds_m1 + kpiEmployee.prob_ds_m2 + kpiEmployee.emp_ds_m2)"></span></li>
              </ul>
            </b-col>
            <b-col>
              <ul>
                <li>Tổng số đơn: &nbsp; {{kpiEmployee.total_pkgs}}</li>
                <li>Doanh số tháng 1: &nbsp; <span v-numeral v-text="Math.floor(kpiEmployee.prob_ds_m1 + kpiEmployee.emp_ds_m1)"></span></li>
              </ul>
            </b-col>
            <b-col>
              <ul>
                <li>Cấp bậc quản lý: &nbsp; {{kpiEmployee.manager_level}}</li>
                <li>Doanh số tháng 2: &nbsp; <span v-numeral v-text="Math.floor(kpiEmployee.prob_ds_m2 + kpiEmployee.emp_ds_m2)"></span></li>
              </ul>
            </b-col>
          </b-row>
        </b-collapse>
        <b-row>
          <b-col>
            <b-row class="ml-1">
              <h5 class="mt-2">Chi tiết shop: &nbsp;</h5>
              <!--<flat-pickr-->
                <!--class="w-200px h-30px bg-white mr-2"-->
                <!--v-model="salaryRangeTime"-->
                <!--:config="config"-->
                <!--placeholder="Chọn khoảng thời gian"-->
                <!--name="date"-->
                <!--:events="['onClose']"-->
                <!--@on-close="checkTypeRangeTime()"-->
              <!--&gt;</flat-pickr>-->
              </b-row>
          </b-col>
        </b-row>
        <div class="row">
          <b-form-group label="Ngày bắt đầu" class="col-sm-3">
            <datepicker
                    v-model="from"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    placeholder=" Ngày bắt đầu"
            />
          </b-form-group>
          <b-form-group label="Ngày kết thúc" class="col-sm-3">
            <datepicker
                    v-model="to"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    placeholder=" Ngày kêt thúc"
            />
          </b-form-group>
          <b-form-group class="col-sm-3" label=" Tùy chọn">
            <b-button variant="primary" @click="getShopDetail()"><i class="ion ion-ios-search"></i> Tìm kiếm</b-button>
          </b-form-group>
        </div>
        <b-row class="mt-1">
          <b-col>
            <ul>
              <li>Tổng số shop: &nbsp; {{totalAllShop}}</li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Tổng số đơn: &nbsp; {{totalOrderPackages}}</li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Tổng doanh số: &nbsp; <span v-numeral v-text="Math.floor(totalOrderRevenue)"></span></li>
            </ul>
          </b-col>
          <b-col>
            <b-form-input size="sm" v-model="filter" placeholder="Tìm kiếm ..."></b-form-input>
          </b-col>
        </b-row>
        <b-table
          id="data-shop"
          ref="dataTable"
          :items="dataShopDetail"
          :fields="fields"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          :per-page="paginConfig.per_page"
          :current-page="paginConfig.current_page"
          style="text-align: center;"
          class="card-table"
          responsive
          :filter="filter"
          @filtered='onFiltered'>
        </b-table>

        <b-pagination v-if="totalAllShop > 0"
                      class="mt-2"
                      v-model="paginConfig.current_page"
                      :total-rows="totalAllShop"
                      :per-page="paginConfig.per_page"
                      align="center"
                      size="sm"
        ></b-pagination>
      </b-card-body>
    </b-card>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
  .monthly-picker >>> .input {
    max-width: 85px !important;
    font-weight: bold;
    color: red;
  }

  .red-color {
    color: red;
  }

  .content-center {
    text-align: center;
  }

  .month-salary {
      width: 100px;
      margin-right: 10px;
  }

  .shop-detail-time {
      width: 200px;
      height: 25px;
  }

  .mpicker-pos {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .total {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin-bottom: 20px !important;
  }

  .circle {
    height: 30px !important;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import saleService from 'domain/services/sale-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'show-sale-salary',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    Datepicker
  },

  data: () => ({
    sale: null,
    fullname: null,
    minMonth: new Moment('2019-10'),
    salaryMonth: new Moment().format('YYYY-MM'),
    showCollapseSalary: false,
    showCollapseDetailKpi: false,
    totalSalary: 0,
    salaryDetail: {
      prob_guaranteed_salary: 0,
      prob_ds_salary_m1: 0,
      prob_ds_salary_m2: 0,
      prob_holiday_salary: 0,
      prob_leave_without_salary: 0,
      emp_guaranteed_salary: 0,
      emp_ds_salary_m1: 0,
      emp_ds_salary_m2: 0,
      emp_holiday_salary: 0,
      emp_leave_without_salary: 0,
      leave_salary: 0,
      allowance_manager: 0
    },
    kpiEmployee: {
      total_shop: 0,
      total_pkgs: 0,
      total_revenue: 0,
      emp_ds_m1: 0,
      emp_ds_m2: 0,
      prob_ds_m1: 0,
      prob_ds_m2: 0,
      manager_level: null
    },
    timeSheet: {
      total_work_date: 0,
      require_work_date: 0,
      holiday: 0,
      leave: {
        has_salary: 0,
        without_salary: 0
      }
    },
    salaryRangeTime: null,
    config: {
      mode: 'range',
      altInput: true,
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      minDate: '2019-09-21',
      theme: 'light'
    },
    paginConfig: {
      per_page: 10,
      current_page: 1,
      total_row: 0
    },
    filter: null,
    totalShop: 0,
    totalPackages: 0,
    totalRevenue: 0,
    dataShopDetail: [],
    fields: [
      { key: 'shop_code', label: 'Mã shop', sortable: true },
      { key: 'shop_name', label: 'Tên shop', sortable: true },
      { key: 'shop_created', label: 'Thời gian tạo', sortable: true },
      { key: 'first_time_success', label: 'Thời gian lấy thành công', sortable: true },
      { key: 'pkgs_1', label: 'Số đơn hàng thành T1', sortable: true },
      { key: 'revenue_1', label: 'Doanh số tháng 1', sortable: true },
      { key: 'pkgs_2', label: 'Số đơn hàng thành T2', sortable: true },
      { key: 'revenue_2', label: 'Doanh số tháng 2', sortable: true }
    ],
    isBusyRangeTime: true,
    isBusyMonth: true,
    from: new Date(),
    to: new Date()
  }),

  created () {
    this.getUserInfo()
  },

  mounted () {},

  watch: {
    salaryMonth: function (newVal, oldVal) {
      this.calSalarySale()
      this.getSalaryRangeTimeByMonth()
    }
  },

  computed: {
    totalAllShop () {
      return this.dataShopDetail.length
    },
    totalOrderPackages () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += (item.pkgs_1 + item.pkgs_2)
      })
      return totalOrder
    },
    totalOrderRevenue () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += (item.revenue_1 + item.revenue_2)
      })
      return totalRevenue
    }
  },

  methods: {
    getUserInfo: function () {
      saleService.getCurrentUserInfo().then(res => {
        if (res.data.success) {
          this.sale = res.data.data
          this.fullname = this.sale.ErpUser.fullname
          this.salaryMonth = new Moment(res.data.times.to)
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    calSalarySale: function () {
      let times = this.salaryMonth.format('YYYY-MM').toString().split('-')
      let dataSend = {
        user_id: this.sale.ErpUser.id,
        month: times[1],
        year: times[0]
      }
      saleService.calSaleSalaryByMonth(dataSend).then(res => {
        if (res.data.success) {
          this.totalSalary = res.data.total_salary
          this.salaryDetail = res.data.salary_detail
          this.kpiEmployee = res.data.detail.kpi_employee
          this.timeSheet = res.data.detail.time_sheet
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    getShopDetail () {
      if (this.from > this.to) {
        commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!', 'warning')
        return
      }
      let data = {
        from: Moment(this.from).format('YYYY-MM-DD'),
        to: Moment(this.to).format('YYYY-MM-DD')
      }
      saleService.getShopDetailInRangeTime(data).then(res => {
        if (res.data.success) {
          this.dataShopDetail = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
    },

    checkTypeRangeTime () {
      let times = (this.salaryRangeTime + '').split(' to ')
      if (times.length < 1) {
        commonHelper.showMessage('Sai định dạng thời gian!', 'warning')
      }
    },

    onFiltered (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    },

    getSalaryRangeTimeByMonth: function () {
      let times = this.salaryMonth.format('YYYY-MM').split('-')
      let data = {
        year: times[0],
        month: times[1]
      }
      saleService.getSalryRangeTime(data).then(res => {
        if (res.data.success) {
          let yesterday = new Moment()
          yesterday = yesterday.subtract(1, 'days')
          let to = yesterday
          let salaryMonth = new Moment(res.data.times.end_date)
          if (yesterday > salaryMonth) {
            to = salaryMonth
          }
          this.salaryRangeTime = res.data.times.start_date + ' to ' + to.format('YYYY-MM-DD')
          // this.salaryRangeTime = res.data.times.start_date + ' to ' + res.data.times.end_date
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
    }
  }
}
</script>
