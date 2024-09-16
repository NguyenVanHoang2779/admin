<template>
  <div>
    <br>
    <b-row>
      <b-col>
        <h5 class="mt-1 mr-3">Nhập username</h5>
        <b-input v-model="userName"></b-input>
      </b-col>
      <b-col>
        <h5 class="mt-1 mr-3">Nhập cod alias</h5>
        <b-input v-model="codAlias"></b-input>
      </b-col>
      <b-col>
        <h5 class="mt-1 mr-3">Chọn kỳ lương</h5>
        <vue-monthly-picker
          class="monthly-picker"
          v-model="salaryMonth"
          placeHolder="Chọn kỳ lương"
          :alignment="`center`"
          :dateFormat="`MM-YYYY`"
          :clearOption="false"
        ></vue-monthly-picker>
      </b-col>
      <b-col md="1">
        <h5 class="mt-1 mr-3">Xem lương</h5>
        <b-button variant="primary" v-if="isGetSalaryMonthProcess == false" @click="showSalary()"><i class="fa fa-search"></i></b-button>
        <b-button variant="primary" v-if="isGetSalaryMonthProcess == true"><i class="fa fa-spin fa-spinner"></i></b-button>
      </b-col>
      <b-col md="1">
        <h5 class="mt-1 mr-3">Cơ chế lương</h5>
        <button class="btn btn-primary" @click="openLink(`https://admin.giaohangtietkiem.vn/admin/co_che_luong/cong_thuc_luong_cod/dteam_1000.html`)">Xem</button>
      </b-col>
      <b-col md="1">
        <h5 class="mt-1 mr-3">Doc giải thích</h5>
        <button class="btn btn-primary" @click="openLink(`https://docs.google.com/spreadsheets/d/1VPpa86YkEzAbZGfbI-JHYcwFTrSNVWiXtlrl0j4Q3iY/edit#gid=1164366224`)">Xem</button>
      </b-col>
    </b-row>
    <hr class="mt-3 mb-3">
    <b-row v-if="infoSalaryMonth != null">
      <b-col md="3">
        <h4><b-badge variant="primary">Lịch sử công việc (Mới)</b-badge></h4>
        <b-card class="view box-card">
          <h4><strong>Mã COD: <span class="require align-content-right">{{infoSalaryMonth.cod_alias}}</span></strong></h4>
          <h4><strong>Họ tên: <span class="align-content-right">{{infoSalaryMonth.fullname}}</span></strong></h4>
          <h5><strong class="mr-5">Thực / Tổng phiên </strong> <span class="align-content-right">{{infoSalaryMonth.count_session.on_session}} / {{infoSalaryMonth.count_session.standard}}</span></h5>
          <h5 class="ml-3">Phiên tối <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.night_session}}</span></h5>
          <h5 class="ml-3">Tổng phiên tăng ca <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.overtime_session}}</span></h5>
          <h5 class="ml-3">Phiên tăng ca thường <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.overtime_normal_session}}</span></h5>
          <h5 class="ml-3">Phiên tăng ca lễ <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.overtime_holiday_session}}</span></h5>
          <h5 class="ml-3">Phiên thiếu <span class="align-content-right">{{infoSalaryMonth.count_session.off_session}}</span></h5>
          <h5 class="ml-3">Phiên cần đi làm <span class="align-content-right">{{infoSalaryMonth.count_session.require_session}}</span></h5>
          <h5><strong class="mr-5">Công </strong></h5>
          <h5 class="ml-3">Công lễ <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.holiday}}</span></h5>
          <h5 class="ml-3">Công phép <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.leave}}</span></h5>
          <h5><strong>Tổng điểm tháng <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.d_pkg_success + infoSalaryMonth.salary_cod_province.p_pl_success + infoSalaryMonth.salary_cod_province.r_pl_success}}</span></strong></h5>
          <h5 class="ml-3">Giao thành công <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.d_pkg_success}}</span></h5>
          <h5 class="ml-3">Điểm lấy thành công <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.p_pl_success}}</span></h5>
          <h5 class="ml-3">Điểm trả thành công <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.r_pl_success}}</span></h5>
          <h5><strong>Thưởng giao <span class="align-content-right">{{Math.round((infoSalaryMonth.salary_cod_province.d_pkg_reward_speed + infoSalaryMonth.salary_cod_province.d_pkg_reward_quality) * 100) / 100}}</span></strong></h5>
          <h5 class="ml-3">Tốc độ giao <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.d_pkg_reward_speed}}</span></h5>
          <h5 class="ml-3">Chất lượng giao <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.d_pkg_reward_quality}}</span></h5>
          <h5><strong>Tích lũy kg</strong></h5>
          <h5 class="ml-3">giao <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.d_pkg_weight}} kg</span></h5>
          <h5 class="ml-3">Lấy & trả <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.p_r_pkg_weight}} kg</span></h5>
          <h5><strong>Tổng thù lao tạm tính <span class="align-content-right">{{Math.ceil(infoSalaryMonth.total_salary)}} đ</span></strong></h5>
          <h5 class="ml-3">Thù lao theo điểm <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.pl_salary}} đ</span></h5>
          <h5 class="ml-3">Thù lao NS <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.d_p_r_salary}} đ</span></h5>
          <h5 class="ml-3">Thù lao thưởng <span class="align-content-right">{{Math.ceil(infoSalaryMonth.salary_cod_province.reward_salary)}} đ</span></h5>
          <h5 class="ml-3">Thù lao tích lũy kg <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.weight_salary}} đ</span></h5>
          <h5 class="ml-3">Phụ cấp tối <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.bonus_work_on_night}} đ</span></h5>
          <h5 class="ml-3">Lương phụ cấp linh động <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.allowance_type_salary}} đ</span></h5>
          <h5 class="ml-3">Tổng lương tăng ca <span class="align-content-right">{{calSalaryOverTime(infoSalaryMonth.list_over_time_salary)}} đ</span></h5>
          <h5 class="ml-3">Lương lễ <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.holiday_salary}} đ</span></h5>
          <h5 class="ml-3">Lương phép <span class="align-content-right">{{infoSalaryMonth.salary_cod_province.leave_salary}} đ</span></h5>
          <h5 v-if="calSalaryOverTime(infoSalaryMonth.list_over_time_salary) > 0"><strong>Danh sách tăng ca</strong></h5>
          <h5 class="ml-3" v-for="(salaryOvertime, dateOverTime) in infoSalaryMonth.list_over_time_salary">Ngày {{dateOverTime}} <span class="align-content-right">{{salaryOvertime}} đ</span></h5>
          <b-button
            variant="outline-dark"
            block
            class="mb-3"
            v-for="(onSession, date) in infoSalaryMonth.list_off_sessions" :key="date"
            @click="showSalaryDate(date)"
          ><strong><span class="align-content-left">Ngày {{date}}</span><span class="align-content-right">{{onSession}}/ {{infoSalaryMonth.is_part_time_emp ? 1 : 2}} Phiên <i class="fa fa-check text-primary" v-if="date == dateSelectedSalary && infoSalaryDate != null"></i></span></strong></b-button>
        </b-card>
      </b-col>

      <b-col md="3">
        <h4><b-badge variant="primary">Dữ liệu tổng hợp theo vùng</b-badge></h4>
        <b-card class="box-card view">
          <div v-for="(data, area) in infoSalaryMonth.salary_cod_province.detail_pkg_by_area" :key="area">
            <h5><b-badge variant="primary">Vùng {{area}}</b-badge></h5>
            <h5><strong>Tổng đơn giao <span class="align-content-right">{{data.deliver_total}} ĐH</span></strong></h5>
            <h5>Đơn giao thành công <span class="align-content-right">{{data.deliver_success}} ĐH</span></h5>
            <h5><strong>Tổng đơn lấy <span class="align-content-right">{{data.pick_total}} ĐH</span></strong></h5>
            <h5><strong class="mr-5">Đơn lấy thành công </strong> <span class="align-content-right">{{data.pick_success}} ĐH</span></h5>
            <h5><strong>Tổng đơn trả <span class="align-content-right">{{data.return_total}} ĐH</span></strong></h5>
            <h5><strong>Tổng đơn trả thành công <span class="align-content-right">{{data.return_package_success}} ĐH</span></strong></h5>
            <h5><strong>Tổng điểm trả thành công <span class="align-content-right">{{data.return_success}} ĐH</span></strong></h5>
            <h5><strong>Đơn xe tải đón shop <span class="align-content-right">{{data.pick_truck}} ĐH</span></strong></h5>
            <h5><strong>Đơn đơn lấy bổ sung <span class="align-content-right">{{data.pick_add}} ĐH</span></strong></h5>
            <h5><strong>Đơn trả bổ sung <span class="align-content-right">{{data.return_add}} ĐH</span></strong></h5>
            <h5><strong>Cân nặng giao <span class="align-content-right">{{data.deliver_weight}} Kg</span></strong></h5>
            <h5><strong>Cân nặng lấy trả <span class="align-content-right">{{data.pick_return_weight}} Kg</span></strong></h5>
            <hr>
          </div>
        </b-card>
      </b-col>

      <b-col md="3" v-if="infoSalaryMonth != null">
        <h4 class="ml-3"><b-badge variant="primary">Thông tin thêm</b-badge></h4>
        <b-card class="box-card view ml-3">
          <h5><strong>Loại hợp đồng <span class="align-content-right">{{infoSalaryMonth.contract.type_contract}}</span></strong></h5>
          <h5>Tên loại hợp đồng <span class="align-content-right">{{infoSalaryMonth.contract.type_name}}</span></h5>
          <h5><strong>Ngày vào chính thức <span class="align-content-right">{{infoSalaryMonth.join_date}}</span></strong></h5>
          <h5><strong>Ngày lương chuẩn <span class="align-content-right">{{infoSalaryMonth.start_date}}</span></strong></h5>
          <h5><strong>Ngày nghỉ việc <span class="align-content-right">{{infoSalaryMonth.resign_date}}</span></strong></h5>
          <h5><strong>Ngày active <span class="align-content-right">{{infoSalaryMonth.active_date}}</span></strong></h5>
          <h5><strong>Ngày disable <span class="align-content-right">{{infoSalaryMonth.disable_date}}</span></strong></h5>
          <h5><strong>Có phải user chính <span class="align-content-right">{{infoSalaryMonth.main_user}}</span></strong></h5>
          <h5><strong>Có đang được tính theo partime <span class="align-content-right">{{infoSalaryMonth.is_part_time_emp}}</span></strong></h5>
          <h5><strong>Kho <span class="align-content-right">{{infoSalaryMonth.station_name}}</span></strong></h5>
          <h5><strong>Tỉnh<span class="align-content-right">{{infoSalaryMonth.province_name}}</span></strong></h5>
          <h5><strong>Miền <span class="align-content-right">{{infoSalaryMonth.region_id == 10 ? 'Miền Bắc' : infoSalaryMonth.region_id == 20 ? 'Miền Trung' : 'Miền Nam'}}</span></strong></h5>
        </b-card>
      </b-col>

      <b-col md="3" v-if="infoSalaryDate != null">
        <h4 class="ml-3"><b-badge variant="primary">Dữ liệu theo ngày</b-badge></h4>
        <b-card class="box-card view ml-3">
          <h4><strong>Ngày: {{dateSelectedSalary}}</strong></h4>
          <div v-for="(data, ws) in infoSalaryDate" :key="ws">
            <h5><b-badge variant="primary">Phiên {{ws.charAt(ws.length - 1)}}</b-badge><span class="align-content-right"><b-button size="sm" variant="outline-primary" @click="showDetailByDate(ws)">Chi tiết đơn</b-button></span></h5>
            <h5><strong>Tổng đơn lấy thành công <span class="align-content-right">{{data.pick_packages_success}} ĐH</span></strong></h5>
            <h5><strong>Tổng đơn trả thành công <span class="align-content-right">{{data.return_packages_success}} ĐH</span></strong></h5>
            <h5><strong>Tổng đơn giao thành công <span class="align-content-right">{{data.deliver_packages_success}} ĐH</span></strong></h5>
            <h5><strong>Cân nặng tích lũy giao <span class="align-content-right">{{data.weight_deliver_accumulation}} Kg</span></strong></h5>
            <h5><strong>Cân nặng tích lũy lấy <span class="align-content-right">{{data.weight_pick_accumulation}} Kg</span></strong></h5>
            <h5><strong>Cân nặng tích lũy trả <span class="align-content-right">{{data.return_accumulation_weight}} Kg</span></strong></h5>
            <h5><strong>Tổng điểm lấy thành công <span class="align-content-right">{{data.pick_place_success}} điểm</span></strong></h5>
            <h5><strong>Tổng điểm trả thành công <span class="align-content-right">{{data.return_place_success}} điểm</span></strong></h5>

            <h5><strong>Tốc độ giao <span class="align-content-right">{{data.kpi_reward_cod_province.deliver_average_speed}} ĐH</span></strong></h5>
            <h5><strong>Thưởng tốc độ giao <span class="align-content-right">{{data.kpi_reward_cod_province.deliver_reward_speed}} phút</span></strong></h5>
            <h5><strong>Thưởng chất lược giao <span class="align-content-right">{{data.kpi_reward_cod_province.deliver_reward_quantity}} ĐH</span></strong></h5>
            <h5><strong>Tỉ lệ giao thành công <span class="align-content-right">{{data.kpi_reward_cod_province.deliver_quantity_percent}}</span></strong></h5>
            <h5><strong>Thưởng chất lượng lấy <span class="align-content-right">{{data.kpi_reward_cod_province.pick_reward_quantity}} ĐH</span></strong></h5>
            <h5><strong>Phần trăm lấy đúng ca hẹn <span class="align-content-right">{{data.kpi_reward_cod_province.pick_quantity_percent}}</span></strong></h5>
            <h5><strong>Tốc độ lấy <span class="align-content-right">{{data.kpi_reward_cod_province.pick_average_speed}} phút</span></strong></h5>
            <h5><strong>Thưởng chất lượng trả <span class="align-content-right">{{data.kpi_reward_cod_province.return_reward_quantity}} ĐH</span></strong></h5>
            <h5><strong>Phần trăm trả thành công <span class="align-content-right">{{data.kpi_reward_cod_province.return_quantity_percent}}</span></strong></h5>
            <h5><strong> Phần trăm toàn trình trả<span class="align-content-right">{{data.kpi_reward_cod_province.return_quality_percent}}</span></strong></h5>

            <h5><strong>Mốc thưởng tăng / giảm <span class="align-content-right">{{data.area_status}} mốc</span></strong></h5>
            <hr>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <hr class="mt-3 mr-3" id="data-by-date">
    <b-row class="ml-1 mr-1" v-if="infoDetail != null">
      <b-tabs class="box-card" content-class="mt-3" pills card fill active-nav-item-class="font-weight-bold text-uppercase text-white"
              nav-wrapper-class="font-weight-bold text-uppercase">
        <b-tab v-for="(data, type) in infoDetail" :key="type" :title="type">
          <b-table
                   :fields="fieldsInfoDetail"
                   :items="Object.values(data)"
          >
            <template v-slot:cell(stt)="row">
              {{row.index + 1}}
            </template>

            <template v-slot:cell(toc_do_chot_ca)="row">
              {{getTimeDiff(row.item)}}
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
    </b-row>
  </div>
</template>

<style scoped>
  .btn-header {
    width: 250px;
  }
  .box-card {
    box-shadow: -1px -1px 2px black, 1px 1px 2px black;
  }
  .view {
    height: 600px;
    overflow: auto;
  }
  .align-content-right {
    float: right;
  }
  .align-content-left {
    float: left;
  }
  .require {
    color: red;
  }
</style>

<script>
import VueMonthlyPicker from 'vue-monthly-picker'
import SalaryService from 'domain/services/salary-service'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'show-salary-cod-province',
  components: {
    VueMonthlyPicker,
    Moment
  },
  data: () => ({
    salaryMonth: new Moment(),
    codAlias: '',
    userName: '',
    infoSalaryMonth: null,
    infoSalaryDate: null,
    infoDetail: null,
    fieldsInfoDetail: [
      {key: 'stt', label: 'Stt', sortable: true},
      {key: 'pkg_order', label: 'Mã đơn', sortable: true},
      {key: 'area', label: 'Vùng', sortable: true},
      {key: 'workshift', label: 'Ca', sortable: true},
      {key: 'weight', label: 'Cân nặng tích lũy', sortable: true},
      {key: 'd_speed', label: 'Tốc độ giao (phút)', sortable: true},
      {key: 'd_success', label: 'Giao thành công ?', sortable: true},
      {key: 'pick_speed', label: 'Tốc độ lấy (phút)', sortable: true},
      {key: 'p_success', label: 'Lấy thành công ?', sortable: true},
      {key: 'p_true', label: 'Lấy đúng toàn trình ?', sortable: true},
      {key: 'r_success', label: 'Trả thành công ?', sortable: true},
      {key: 'r_true', label: 'Trả đúng toàn trình ?', sortable: true},
      {key: 'cod_bao', label: 'Cod báo', sortable: true},
      {key: 'chot_ca', label: 'Chốt ca', sortable: true},
      {key: 'address', label: 'Địa điểm', sortable: true},
      {key: 'dang_don', label: 'Thời gian đăng đơn', sortable: true},
      {key: 'f_hen_lay', label: 'Ngày hẹn lấy đầu tiên', sortable: true},
      {key: 'ca_hen_lay', label: 'Ca hẹn lấy', sortable: true},
      {key: 'xuat_giao', label: 'Xuất giao', sortable: true},
      {key: 'xuat_tra', label: 'Xuất trả', sortable: true},
      {key: 'toc_do_chot_ca', label: 'Tốc độ chốt ca', sortable: true}
    ],
    dateSelectedSalary: null,
    isGetSalaryMonthProcess: false
  }),
  watch: {
    userName: function (oldValue, newValue) {
      this.codAlias = ''
    }
  },
  methods: {
    getTimeDiff: function (data) {
      if (data.xuat_giao === null) return null
      let timeDiff = (new Date(data.chot_ca).getTime() - new Date(data.xuat_giao).getTime()) / 1000 / 60 / 60
      return Math.abs(Math.round(timeDiff * 100) / 100) + ' giờ'
    },
    showSalary: function () {
      if (this.codAlias.length === 0 && this.userName.length === 0) return commonHelper.showMessage('Vui lòng nhập cod alias hoặc username', 'warning')
      let dataSend
      if (this.codAlias.length > 0) {
        dataSend = {
          cod_alias: this.codAlias,
          year: this.salaryMonth.format('YYYY'),
          month: this.salaryMonth.format('MM')
        }
      } else {
        dataSend = {
          username: this.userName,
          year: this.salaryMonth.format('YYYY'),
          month: this.salaryMonth.format('MM')
        }
      }
      this.isGetSalaryMonthProcess = true
      SalaryService.showSalary(dataSend).then(res => {
        if (res.data.success) {
          commonHelper.showMessage('Lấy dữ liệu thành công', 'success')
          this.infoSalaryMonth = res.data.data
          this.codAlias = this.infoSalaryMonth.cod_alias
          this.infoSalaryDate = null
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.infoSalaryMonth = null
        }
        this.isGetSalaryMonthProcess = false
      }).catch((e) => {
        commonHelper.showMessage('Có lỗi xảy ra. vui lòng thử lại sau', 'warning')
      })
    },
    showSalaryDate (date) {
      if (this.codAlias === null) return commonHelper.showMessage('Vui lòng nhập cod alias', 'warning')
      this.infoSalaryDate = null
      SalaryService.showSalaryDate({cod_alias: this.codAlias, date}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage('Lấy dữ liệu thành công', 'success')
          delete res.data.data.cod_penalty
          this.infoSalaryDate = res.data.data
          this.dateSelectedSalary = date
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.infoSalaryDate = null
          this.dateSelectedSalary = null
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning'))
    },
    showDetailByDate (workShift) {
      if (this.codAlias === null) return commonHelper.showMessage('Vui lòng nhập cod alias', 'warning')
      if (this.dateSelectedSalary == null) return commonHelper.showMessage('Vui lòng truyền ngày')
      SalaryService.showDataDetailByDate({cod_alias: this.codAlias, date: this.dateSelectedSalary, work_shift: workShift.charAt(workShift.length - 1)}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage('Lấy dữ liệu thành công', 'success')
          this.infoDetail = res.data.data
          let scrollToElelent = document.getElementById('data-by-date')
          scrollToElelent.scrollIntoView({behavior: 'smooth'})
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.infoDetail = null
        }
      }).catch((e) => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      })
    },
    openLink (url) {
      window.open(url, '_blank')
    },
    calSalaryOverTime (listOverTimeSalary) {
      if (listOverTimeSalary.length === 0) return 0
      let listSalary = (Object.values(listOverTimeSalary))
      return listSalary.reduce(this.sumArray)
    },
    sumArray (total, currentValue) {
      return total + currentValue
    }
  }
}
</script>
