<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="6">
          <h4 class="pt-1">Chạy và xuất lương CSKH C2C:</h4>
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
      <br>
      <b-row>
        <b-col md="6">
          <multiselect
            class="multiselect-primary"
            v-model="listCustomer"
            label="name"
            track-by="name"
            selectedLabel=""
            :hide-selected="true"
            deselectLabel=""
            selectLabel="Chọn"
            placeholder="Chọn cskh"
            :options="listCustomerOption"
            :searchable="true"
            :multiple="true"
            :allow-empty="false">
          </multiselect>
        </b-col>
        <b-col>
          <b-btn variant="outline-primary" class="w-100" @click="showSalaryCustomerC2c" :disabled="isProcessing">Tính toán lương <i class="fa fa-calculator abc"></i> <i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-btn>
        </b-col>
        <b-col>
          <b-btn variant="outline-info" class="w-100" :disabled="isProcessing" @click="showSnapShotSalary">Xem lương đã chạy <i class="fa fa-eye"></i> <i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-btn>
        </b-col>
        <b-col>
          <b-btn variant="outline-secondary" class="w-100" :disabled="isProcessing" @click="calSalary">Chạy lại Lương <i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-btn>
        </b-col>
        <b-col>
          <b-btn variant="outline-success" class="w-100" :disabled="isProcessing" @click="exportDataFromClient">Xuất lương <i class="fa fa-file-excel"></i></b-btn>
        </b-col>
      </b-row>
      <br>
      <b-row class="mb-2">
        <b-col cols="1">
          <h5 class="pt-2">Chọn số bản ghi</h5>
        </b-col>
        <b-col cols="1">
          <multiselect
            class="multiselect-primary"
            v-model="numberRecord"
            label="name"
            track-by="name"
            selectedLabel=""
            :hide-selected="true"
            deselectLabel=""
            selectLabel="Chọn"
            placeholder="Chọn số bản ghi"
            :options="optionsNumber"
            :searchable="true"
            :multiple="false"
            :allow-empty="false">
          </multiselect>
        </b-col>
      </b-row>
      <b-row class="mb-2">
        <b-col cols="3">
          <span style="padding-bottom: 10px; font-weight: 600;" v-if="isProgress" class="mt-3">{{progressTitle}}</span>
          <i v-if="this.progressTitle === 'Đã hoàn thành'" class="sidenav-icon ion ion-ios-done-all iconCus mr-2"/>
        </b-col>
      </b-row>
      <b-progress v-if="isProgress" :max="maxProgress" height="1.5rem">
        <b-progress-bar :value="valueProgress" :label="`${((valueProgress / maxProgress) * 100).toFixed(2)}%`"></b-progress-bar>
      </b-progress>
      <div class="mt-3 mb-3" v-if="isProgress"><span>Thời gian: </span>{{ time }} ms</div>
      <b-row>
        <b-table
          responsive
          :fields="fieldsSalary"
          :items="dataSalary"
          :per-page="paginConfig.per_page"
          :current-page="paginConfig.current_page"
        >
        </b-table>
      </b-row>
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
.iconCus {
  font-size: 35px;
  margin-left: 15px;
  color: #3fd93f;
}
</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CustomerCareService from 'domain/services/customer-care-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import { BProgress } from 'bootstrap-vue'

export default {
  name: 'export-salary-c2c',

  components: {
    Multiselect,
    commonHelper,
    CustomerCareService,
    VueMonthlyPicker,
    Moment,
    BProgress
  },

  props: [],

  data: () => ({
    time: 0,
    optionsNumber: [
      {'name': 1, 'value': 1},
      {'name': 5, 'value': 5},
      {'name': 10, 'value': 10},
      {'name': 15, 'value': 15},
      {'name': 20, 'value': 20}
    ],
    numberRecord: {'name': 1, 'value': 1},
    isProgress: false,
    progressTitle: 'Đang tính toán bảng lương...',
    valueProgress: 0,
    maxProgress: 0,
    minMonth: new Moment('2020-11'),
    maxMonth: new Moment().format('YYYY-MM'),
    salaryMonth: new Moment(),
    listCustomerOption: [],
    listCustomer: [],
    month: Moment(new Moment()).format('MM'),
    year: Moment(new Moment()).format('YYYY'),
    isProcessing: false,
    fieldsSalary: [
      { key: 'month', label: 'Tháng', sortable: true },
      { key: 'year', label: 'Năm', sortable: true },
      { key: 'username', label: 'Tên tài khoản', sortable: true },
      { key: 'position_name', label: 'Vị trí', sortable: true },
      { key: 'department', label: 'Mô tả vị trí', sortable: true },
      { key: 'type_contract', label: 'Loại hợp đồng', sortable: true },
      { key: 'fullname', label: 'Họ và tên', sortable: true },
      { key: 'region', label: 'Miền', sortable: true },
      { key: 'province_name', label: 'Tỉnh', sortable: true },
      { key: 'station_name', label: 'Kho', sortable: true },
      { key: 'join_date', label: 'Ngày vào', sortable: true },
      { key: 'start_date_day', label: 'Ngày lương chuẩn', sortable: true },
      { key: 'work_shift_count_kpi_sunday', label: 'Công chuẩn', sortable: true },
      { key: 'total_work_date', label: 'Tổng công', sortable: true },
      { key: 'employee_work_shift', label: 'Tổng công chính thức', sortable: true },
      { key: 'probation_work_shift', label: 'Tổng công thử việc', sortable: true },
      { key: 'probation_work_shift_ot', label: 'Tổng công tăng ca thử việc', sortable: true },
      { key: 'employee_work_shift_ot', label: 'Tổng công tăng ca chính thức', sortable: true },
      { key: 'leave', label: 'Nghỉ phép', sortable: true },
      { key: 'holiday', label: 'Nghỉ lễ', sortable: true },
      { key: 'average_speed', label: 'Tốc độ chat trung bình', sortable: true },
      { key: 'total_chat', label: 'Tổng tin nhắn chat', sortable: true },
      { key: 'bonus_slow_minute', label: 'Thưởng phạt chat chậm', sortable: true },
      { key: 'kpi_chat', label: 'Lương kpi chat', sortable: true },
      { key: 'total_shop_chat', label: 'Tổng Shop chat', sortable: true },
      { key: 'total_shop_review', label: 'Tổng Shop Review', sortable: true },
      { key: 'total_shop_satify', label: 'Tổng Shop Hài Lòng', sortable: true },
      { key: 'percent_shop_satify', label: 'Phần Trăm hài Lòng', sortable: true },
      { key: 'percent_shop_vote', label: 'Phần Trăm shop vote', sortable: true },
      { key: 'punish_shop_vote', label: 'Phạt shop vote', sortable: true },
      { key: 'punish_shop_satify', label: 'Phạt Shop hài lòng', sortable: true },
      { key: 'kpi_salary', label: 'Lương Kpi Hài Lòng', sortable: true },
      { key: 'pro_holiday', label: 'Lương lễ thử việc', sortable: true },
      { key: 'pro_leave', label: 'Lương phép thử việc', sortable: true },
      { key: 'leave_salary', label: 'Lương Phép', sortable: true },
      { key: 'holiday_salary', label: 'Lương Lễ', sortable: true },
      { key: 'overtime_p', label: 'Lương Tăng Ca Thử Việc', sortable: true },
      { key: 'overtime_e', label: 'Lương Tăng Ca Chính Thức', sortable: true },
      { key: 'probation', label: 'Lương Thử Việc', sortable: true },
      { key: 'grantee_salary', label: 'Lương Đảm Bảo', sortable: true },
      { key: 'kpi', label: 'Lương Theo Kpi', sortable: true },
      { key: 'final_kpi', label: 'Lương Chốt', sortable: true }
    ],
    dataSalary: [],
    paginConfig: {
      per_page: 5,
      current_page: 1,
      total_row: 0
    },
    isSnapShot: 0
  }),

  created () {
    this.getAllCustomerC2c()
  },

  watch: {
    salaryMonth (newVal, oldVal) {
      this.month = Moment(newVal).format('MM')
      this.year = Moment(newVal).format('YYYY')
    }
  },

  methods: {
    exportDataFromClient () {
      if (this.dataSalary.length < 1) return commonHelper.showMessage('Dữ liệu hiển thị hiện tại đang rỗng')
      let header = []
      this.fieldsSalary.forEach(e => {
        header[e.key] = e.label
      })
      let dataSend = {
        header_export: Object.assign({}, header),
        data_export: this.dataSalary
      }
      CustomerCareService.exportDataFromClient(dataSend).then(res => {
        if (res.data.success) {
          window.location.href = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      })
    },
    calSalary () {
      this.isSnapShot = 1
      this.showSalaryCustomerC2c()
    },
    getAllCustomerC2c () {
      CustomerCareService.getAllCustomerC2c({month: this.month, year: this.year}).then(res => {
        if (res.data.success) {
          this.listCustomerOption = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message, 'warning')
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại sau', 'warning')
      })
    },
    showSalaryCustomerC2c () {
      this.progressTitle = 'Đang tính toán bảng lương...'
      this.paginConfig.total_row = 0
      this.dataSalary = []
      if (this.time !== 0) this.time = 0
      let now = new Date()
      let since = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      let timeline = now.getTime() - since.getTime()
      let timerId = setInterval(() => {
        now = new Date()
        this.time = now.getTime() - since.getTime() - timeline
      }, 10)
      if (this.listCustomer.length === 0) {
        this.listCustomer = this.listCustomerOption
      }
      this.maxProgress = this.listCustomer.length
      this.valueProgress = 0
      this.isProgress = true
      this.isProcessing = true
      this.dataSalary = []
      let listUserId = this.listCustomer.map((option) => option.id)
      if (this.listCustomer.length > 1) {
        listUserId = this.chunkArray(listUserId, this.numberRecord.value)
      } else {
        listUserId = [listUserId]
      }
      listUserId.forEach(item => {
        CustomerCareService.showSalaryCustomerC2c({month: this.month, year: this.year, listUserId: item, is_snap: this.isSnapShot}).then(res => {
          if (res.data.success) {
            this.paginConfig.total_row += res.data.data.length
            this.valueProgress += res.data.data.length
            this.dataSalary = this.dataSalary.concat(res.data.data)
            if (this.valueProgress === this.maxProgress) {
              this.progressTitle = 'Đã hoàn thành'
              clearInterval(timerId)
              return commonHelper.showMessage(res.data.message, 'success')
            }
            return true
          }
          commonHelper.showMessage(res.data.message, 'warning')
          this.progressTitle = 'Xảy ra lỗi khi tính lương'
          clearInterval(timerId)
        }).catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
        }).finally(() => {
          this.isProcessing = false
          this.isSnapShot = 0
        })
      })
    },
    showSnapShotSalary () {
      let userId = this.listCustomer.map(e => e.id).toString()
      this.isProcessing = true
      this.dataSalary = []
      this.paginConfig.total_row = 0
      CustomerCareService.getDataSalaryC2c({month: this.month, year: this.year, user_ids: userId}).then(res => {
        if (res.data.success) {
          this.paginConfig.total_row = res.data.data.length
          res.data.data.forEach(e => {
            this.dataSalary.push({
              'month': this.month,
              'year': this.year,
              'username': e['info_user'][0]['ErpUser']['username'],
              'position_name': e['info_user'][0]['ErpEmpPosition']['position_name'],
              'department': e['info_user'][0]['ErpEmpPosition']['department'],
              'type_contract': e.details.type_contract,
              'fullname': e['info_user'][0]['ErpUser']['fullname'],
              'region': e['info_user'][0]['ErpMasterProfile']['region'],
              'province_name': e['info_user'][0]['ErpAddress']['name'],
              'station_name': e['info_user'][0]['ErpStation']['name'],
              'join_date': e['info_user'][0]['ErpEmpProfile']['join_date'],
              'start_date_day': e['info_user'][0]['ErpEmpProfile']['start_date_day'],
              'work_shift_count_kpi_sunday': e.details.work_shift_count_kpi_sunday,
              'total_work_date': e.details.total_work_date,
              'employee_work_shift': e.details.employee.work_shift,
              'probation_work_shift': e.details.probationary.work_shift,
              'probation_work_shift_ot': e.details.probationary.work_shift_ot,
              'employee_work_shift_ot': e.details.employee.work_shift_ot,
              'leave': e.details.leave.has_salary,
              'holiday': e.details.holiday,
              'average_speed': e.salary_detail.chat.average_speed,
              'total_chat': e.salary_detail.chat.total_chat,
              'bonus_slow_minute': e.salary_detail.chat.bonus_slow_minute,
              'kpi_chat': e.salary_detail.chat.kpi_chat,
              'total_shop_chat': e.salary_detail.satisfy.total_shop_chat,
              'total_shop_review': e.salary_detail.satisfy.total_shop_review,
              'total_shop_satify': e.salary_detail.satisfy.total_shop_satify,
              'percent_shop_satify': e.salary_detail.satisfy.percent_shop_satify,
              'percent_shop_vote': e.salary_detail.satisfy.percent_shop_vote,
              'punish_shop_vote': e.salary_detail.satisfy.punish_shop_vote,
              'punish_shop_satify': e.salary_detail.satisfy.punish_shop_satify,
              'kpi_salary': e.salary_detail.satisfy.kpi_salary,
              'pro_holiday': e.salary_detail.pro_holiday,
              'pro_leave': e.salary_detail.pro_leave,
              'leave_salary': e.salary_detail.leave,
              'holiday_salary': e.salary_detail.holiday,
              'overtime_p': e.salary_detail.overtime_p,
              'overtime_e': e.salary_detail.overtime_e,
              'probation': e.salary_detail.probation,
              'grantee_salary': e.salary_detail.grantee_salary,
              'kpi': e.salary_detail.kpi,
              'final_kpi': e.salary_detail.final_kpi
            })
          })
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message, 'warning')
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      }).finally(() => {
        this.isProcessing = false
      })
    },
    chunkArray (arr, chunkSize) {
      let results = []
      while (arr.length) {
        results.push(arr.splice(0, chunkSize))
      }
      return results
    }
  }
}
</script>
