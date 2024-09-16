<template>
  <div>
    <b-row>
      <b-card no-body style="margin-bottom: 1%; width: 100%;">
        <b-card-body>
          <b-row>
            <b-col cols="6">
              <h4 class="section-head">Chạy và xuất lương giám sát xe tải:</h4>
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
                v-model="userInfo"
                label="name"
                track-by="id"
                selectedLabel=""
                :hide-selected="true"
                deselectLabel=""
                selectLabel="Chọn"
                placeholder="Chọn nhân viên giám sát xe tải"
                :options="listTruckMonitorOption"
                :searchable="true"
                :multiple="false"
                :allow-empty="false">
              </multiselect>
            </b-col>
            <b-col>
              <b-btn variant="outline-primary" class="w-100" @click="calSalTruckMonitor" :disabled="isProcessing">Tính toán lương <i class="fa fa-calculator abc"></i></b-btn>
            </b-col>
            <b-col>
              <b-btn variant="outline-success" class="w-100" :disabled="isProcessing" @click="exportAllSalary">Xuất lương <i class="fa fa-file-excel abc"></i><i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-btn>
            </b-col>
          </b-row>
          <br>
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
        </b-card-body>
      </b-card>
    </b-row>
    <b-row v-if="isHiddenSal">
      <b-card no-body style="width: 100%">
        <b-card-body class="bodyCus">
          <div class="block-grid block-grid-profile">
            <div class="user-card">
              <h3 class="section-head">Hồ sơ</h3>
              <div class="user-content">
                <img src="https://dauso1900.vn/wp-content/uploads/2020/04/84181473_2862109443850624_6202619776917831680_o.png" alt="">
                <div class="user-info">
                  <h4>{{this.info_user.fullname}}</h4>
                  <h1>{{this.info_user.seniority}} <small>Ngày thâm niên</small></h1>
                </div>
                <button id="btn_disable_user" class="user-sum">
                  {{this.info_user.statusAccount}}
                </button>
              </div>
            </div>
            <div class="user-card">
              <div class="header_sal" style="display: flex"><h3 class="section-head" style="width: 30%;">Thông tin chi tiết lương:</h3>
                <multiselect
                  style="width: 12%;margin-top: -0.7%;margin-left: -12%;"
                  class="multiselect-primary"
                  v-model="station"
                  label="name"
                  track-by="id"
                  selectedLabel=""
                  deselectLabel=""
                  selectLabel="Chọn"
                  placeholder="Kho"
                  :options="listStation"
                  :searchable="true"
                  :multiple="false"
                  :allow-empty="false">
                </multiselect></div>
              <div class="sal-content" style="display: flex;">
                <div class="cNumberKpi">
                  <div class="divKpi"><i class="ion ion-md-square-outline text-primary"></i><span>Công chuẩn: {{this.dataSal.require_workshift_in_month}}</span></div>
                  <div class="divKpi"><i class="ion ion-md-square-outline text-primary" style="color:red !important;"></i><span>Công kpi: {{this.dataSal.total_count_kpi}}</span></div>
                  <div class="divKpi"><i class="ion ion-md-square-outline text-primary" style="color:greenyellow !important;"></i><span>Số ngày tăng ca: {{this.dataSal.overtime_workday}}</span></div>
                  <div class="divKpi"><i class="ion ion-md-square-outline text-primary" style="color:darkslategray !important;"></i><span>Công lễ: {{this.dataSal.count_kpi_holiday_converted}}</span></div>
                  <div class="divKpi"><i class="ion ion-md-square-outline text-primary" style="color:#6610f2 !important;"></i><span>Công phép: {{this.dataSal.count_on_leave}}</span></div>
                  <div class="divKpi"><i class="ion ion-md-square-outline text-primary" style="color:#02bc77 !important;"></i><span>Công thử việc: {{this.dataSal.probationary_total_count_kpi}}</span></div>
                </div>
                <div class="total_sal">
                  <b-btn variant="outline-success">Tổng lương: {{this.convertNumber(this.dataSal.total_salary)}}</b-btn>
                </div>
                <div>
                  <img src="https://cache.giaohangtietkiem.vn/d/bad448291acd402d9347c659b078cae8.png?width=95&height=300" alt="">
                </div>
                <div class="detail_sal_lv1">
                  <div class="col sal-ot"><b-btn variant="outline-success">Lương tăng ca: {{this.convertNumber(this.dataSal.salary_ot)}}</b-btn></div>
                  <div class="col sal-trip"><b-btn variant="outline-danger" @click="show = !show">Lương chuyến: {{this.convertNumber(this.dataSal.salary_kpi)}}</b-btn></div>
                  <div class="col sal-holiday"><b-btn variant="outline-primary">Lương lễ: {{this.convertNumber(this.dataSal.salary_holiday)}}</b-btn></div>
                  <div class="col sal-leave"><b-btn variant="outline-warning" style="border-color: #50420f!important; color: black!important">Lương phép: {{this.convertNumber(this.dataSal.salary_leave)}}</b-btn></div>
                  <div class="col sal-rank"><b-btn variant="outline-success" style="border-color:#4b5876 !important;">Lương cấp bậc: {{this.convertNumber(this.dataSal.salary_ranking)}}</b-btn></div>
                  <div class="col sal-prob"><b-btn variant="outline-secondary">Lương thử việc: {{this.convertNumber(this.dataSal.salary_probationary)}}</b-btn></div>
                  <div class="col sal-na"><b-btn variant="outline-secondary">Phụ cấp đêm: {{this.convertNumber(this.dataSal.salary_night_allowance)}}</b-btn></div>
                </div>
                <div v-if="!show" class="hint_sal">(Click vào từng loại lương để xem chi tiết)</div>
                <Transition name="bounce">
                  <div v-if="show">
                    <div class="user-card">
                      <h5>Chi tiết lương chuyến</h5>
                      <div class="user-content sal-detail-lv2">
                        <div><p style="color:#10ad47;">* Lương chuyến = (lương tham chiếu x Công kpi) / (Công chuẩn + Số ngày tăng ca)</p></div>
                        <div><p> = ({{this.convertNumber(this.dataSal.salary_reference)}} x {{this.dataSal.total_count_kpi}}) / ({{this.dataSal.require_workshift_in_month}} + {{this.dataSal.overtime_workday}}) = {{this.convertNumber(this.dataSal.salary_kpi)}} đ</p></div>
                        <div><p style="color:red;">* Lương tham chiếu được tính dựa trên:</p></div>
                        <div><p style="color:#15badf;">1. Sản lượng ĐH đúng/ngày </p></div>
                        <div><p>= (Tổng ĐH đúng kho x công KPI) / (Tổng công cả kho x Số ngày phát sinh chuyến)</p></div>
                        <div><p>= ({{this.convertNumber(this.dataSal.total_pkg_station)}} x {{this.dataSal.total_count_kpi}}) / ({{this.dataSal.total_kpi_station}} x {{this.dataSal.number_day_trip}}) = {{this.dataSal.quantity_day}} ĐH</p></div>
                        <div><p style="color:#af18cb;">2. TB chuyến đúng/ngày</p></div>
                        <div><p>= (Tổng hệ số chuyến đúng kho x công KPI) / (Tổng công cả kho x Số ngày phát sinh chuyến)</p></div>
                        <div><p> = ({{this.dataSal.total_factor_trip}} x {{this.dataSal.total_count_kpi}}) / ({{this.dataSal.total_kpi_station}} x {{this.dataSal.number_day_trip}}) = {{this.dataSal.avg_trip_day}} Chuyến</p></div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </b-row>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
.monthly-picker >>> .input {
  max-width: 125px !important;
  font-weight: bold;
  color: red;
  justify-content: center;
}
.multiselect >>> .multiselect__tags{
  border-color: #63c70b !important;
}

.header_sal >>> .multiselect__tags{
  border-color: #000000 !important;
}

.c-red {
  color: red;
}
.iconCus {
  font-size: 35px;
  margin-left: 15px;
  color: #3fd93f;
}
.bodyCus{
  --color-main:#396aff;
  --bg2: #dce5ff;
  --bg: #fbfefd;
  --main-accent:#e9eefd;
  --main-text:#4b5876;
  --shadow: rgba(17, 17, 26, 0.1) 2px 2px 16px;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

#menu-toggle{
  display: none;
}
#menu-toggle:checked ~ .sidebar{
  left:-345px;
}
#menu-toggle:checked ~ .main-content{
  margin-left:0px;
  width: 100vw;
}
.img_admin{
  width: 54px;
  height: 54px;
  margin-top: 4px;
  object-fit: cover;
  border-radius: 50%;
}
.sidebar{
  width: 345px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 1rem 1.2rem;
  transition: left 300ms;
}

.sidebar-container{
  height: 100%;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 1.2rem;
}

.brand h2{
  color: #444;
}

.hint_sal {
  margin-top: 10%;
  margin-left: 5%;
}

.sal-content .cNumberKpi {
  margin-top: 2%;
}

.cNumberKpi {
  width: 11%;
}

.cNumberKpi .divKpi {
  margin-bottom: 31%;
  position: relative;
  padding-top: 1%;
}

.cNumberKpi div i {
  position: absolute;
  top: 0;
  left: 0;
}

.cNumberKpi div span {
  position: absolute;
  left: 15%;
  bottom: -16px;
}

.sal-content .total_sal {
  margin-top: 10%;
  margin-left: 2%;
}

.sal-content .detail_sal_lv1 button {
  width: 206px;
}

.sal-content .detail_sal_lv1 .sal-ot button{
  margin-left: -22%;
  margin-top: -6%;
  background-color: #fbfbfb;
}
.sal-content .detail_sal_lv1 .sal-trip button{
  margin-left: -22%;
  margin-top: 11%;
}
.sal-content .detail_sal_lv1 .sal-holiday button{
  margin-left: -23%;
  margin-top: 11%;
}
.sal-content .detail_sal_lv1 .sal-leave button{
  margin-left: -24%;
  margin-top: 10%;
}
.sal-content .detail_sal_lv1 .sal-rank button{
  margin-left: -25%;
  margin-top: 7%;
}
.sal-content .detail_sal_lv1 .sal-prob button{
  margin-left: -25%;
  margin-top: 6%;
}

 .sal-content .detail_sal_lv1 .sal-na button{
   margin-left: -25%;
   margin-top: 6%;
   background-color: #fbfbfb;
 }

.brand h2 span{
color: var(--color-main);
font-size: 2.5rem;
display: inline-block;
margin-right: .5rem;
}
.sidebar-avartar{
display: grid;
grid-template-columns: 70px auto;
align-items: center;
border:2px solid var(--main-accent);
padding: .1rem .7rem;
border-radius: 7px;
margin: 2.5rem 0rem;
}

.avartar-info{
display: flex;
justify-content: space-evenly;
align-items: center;
}
.sidebar-menu li{
margin-bottom: .2rem;
}

.sidebar-menu a{
text-decoration:none!important;
color:var(--main-text);
display: block;
padding: .7rem;
}
.sidebar-menu a.active{
background: var(--main-accent);
padding: .7rem;
border-radius: 10px;
}
.header-action{
display: inline-block;
margin-left: 79%;
}

.sidebar-menu a span:first-child{
display: inline-block;
margin-right:  .8rem;
font-size: 1.5rem;
color: var(--color-main);
}
.btn{
border-radius: 3px!important;
}
.btn-main{
border:2px solid rgb(180, 238, 46) !important;
background: rgb(251, 251, 251)!important;
color: rgb(59, 59, 59)!important;
font-weight: 700!important;
display: flex!important;
align-items: center!important;
}
.btn-main:hover{
cursor: pointer;
background: rgb(224, 58, 58)!important;
}
.main-content{
margin-left: 345px;
width: calc(100vw - 345px);
padding: 1rem 1.2rem;
padding-right: 2rem;
transition: margin-left 300ms;

}
header{
display: flex;
justify-content: space-between;
padding-top: .5rem;

}
.header-title-wrapper{
display: flex;

}
.header-title-wrapper label{
display: inline-block;
color: var(--color-main);
margin-right: 1rem;
font-size: 1.8rem;
}

.header-title h1{
color: var(--main-text);
font-weight: 600;
}
.header-title p{
color:#666;
font-size: .9rem;
}
.header-title p span{
color: red;
font-size: 1.2rem;
display: inline-block;
margin-left: .5rem;
}
main{
padding-top: 2.5rem;
padding-bottom: 2.5rem;
}

.user-sum{
background: var(--main-accent);
border: 1px solid var(--color-main);
padding: 0.8rem;
border-radius: 10px;
font-weight: 600;
color: var(--main-text);
}

.analytics{
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-gap:2.5rem;
margin-bottom: 3rem;
}
.analytic{
box-shadow: var(--shadow);
padding: 1.5rem;
border-radius: 10px;
display: flex;
padding-left: 2rem;

}
.analytic-info h4{
font-weight: 400;
color: #555;
font-size: .98rem;

}
.analytic-info h1{
color: var(--main-text);
font-weight: 600;
}

.analytic-info h1 small{
color: var(--main-text);
font-size: .6rem;
}
.text-danger{
color: red;
}
.analytic:first-child .analytic-icon{
background: #dce5ff;
color: #0e52e7;
}

.analytic:nth-child(2) .analytic-icon{
background: #dce5ff;
color: #07b7fd;
}

.analytic:nth-child(3) .analytic-icon{
background: #dce5ff;
color: #33db11;
}

.analytic:nth-child(4) .analytic-icon{
background: #dce5ff;
color: #ec1616;
}
.analytic-icon{
width: 40px;
height: 40px;
border-radius: 50%;
display: grid;
place-items: center;
margin-right: .8rem;
}

.section-head{
font-size: 1.4rem;
font-weight: 600;
margin-bottom: 1rem;

}

.section-head-detail-lv2{
  position: relative;
  font-weight: 600;
  margin-bottom: 1rem;
}

.sal-detail-lv2 div {
  position: relative;
  width: 588px;
  padding: 2%;
}
.sal-detail-lv2 div p {
  position: absolute;
  top: 0;
  left: 0;
}
.block-grid{
display: grid;
grid-template-columns: 60% auto;
grid-gap:3rem;
}
.block-grid-profile{
display: grid;
grid-template-columns: 16% auto;
grid-gap:3rem;
}
.user-content, .sal-content{
background: #fff;
box-shadow: var(--shadow);
border-radius: 15px;
padding: 1rem 2rem;
text-align: center;
}
.user-content img{
width: 200px;
margin: 1.5rem 0rem;
}
.sal-content img{
width: 108px;
  margin: -0.1rem 0rem;
}

.user-info{
margin-bottom: 1rem;
}
.user-info h3,.user-info h4
.user-info h1{
color: var(--main-text);
}

.user-info h1{
font-weight: 600;
margin-top: .4rem;
}
.user-info h1 small{
font-weight: 600;
font-size: 1rem;
}

.graph-head select{
background: #eee;
border-radius: 10px;
height: 35px;
padding: .5rem 2rem;
border: none;
outline: none;
}

#statistics_user_province{
position: absolute;
top: -42px;
left: 411px;
width: 200px;
height: 100px;
background-color: #f2f69d;
border: 1px solid rgb(236, 51, 51);
border-radius: 5px;
text-align: center;
display: none;
}

.graph-content-register{
border-radius: 0px;
margin-right: 50px;
margin-bottom: 20px;
}
._info_wrapper{
display: flex;
justify-content: space-between;
margin: 10px 20px auto 20px;
padding-bottom: 10px;
border-bottom: 1px solid rgb(206, 201, 201) ;

}
._info_wrapper ._time_register{
color:#666;
font-size: 15px;
}
._info_wrapper .user_info_row{
display: flex;
}
._info_wrapper .user_info_row img{
width: 38px;
height: 38px;
border-radius: 50%;
object-fit: cover;
}
._info_wrapper .user_info_row .detail_name_and_id{
font-family: "Poppins";
margin-left: 15px;
padding: 2px;
}
._info_wrapper .user_info_row .detail_name_and_id div{
font-size: 14px;
font-weight: 700;
margin-top: -3px;
margin-bottom: 6px;
}
._info_wrapper .user_info_row .detail_name_and_id span{
color: rgb(102, 97, 97);
font-size: 15px;
}

.admin_lists_user_table .tableUser{
margin-right: 48px;
height: 400px;
overflow:hidden;
}
.admin_lists_user_table .tableUser:hover{
overflow-y: scroll;
}
.tableUser::-webkit-scrollbar {
width: 6px;
height: 10px;

}
.tableUser::-webkit-scrollbar-thumb {
border-radius: 8px;
background: #c2c9d2;
}

/* table users list */
.tableUser .table .th_id{
  padding-top: 20px;
}
.tableUser .table .td_info_user{
  display: flex;
}
.tableUser .table .td_info_user img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.tableUser .table .td_info_user span{
  display: inline-block;
  margin-left: 10px;
  margin-top: 8px;
  font-weight: 700;
}
.tableUser .table .td_email{
  padding-top: 21px;
}

.tableUser .table .td_comment_like{
  padding-top: 21px;
  padding-left: 25px;
}

.tableUser .table .td_status .blocked{
  display: inline-block;
  padding: 6px;
  background-color: red;
  font-weight: 700;
  border-radius: 3px;
}

.tableUser .table .td_status .active{
  display: inline-block;
  padding: 12px;
  background-color: greenyellow;
  font-weight: 700;
  border-radius: 3px;
}

.tableUser .table .td_detail_user a{
  display: inline-block;
  text-decoration: none;
  margin-top: 8px;
  font-size: 18px;
  cursor: pointer;
}

</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import TruckMonitorService from 'domain/services/truck-monitor-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import { BProgress } from 'bootstrap-vue'

export default {
  name: 'export-salary-truck-monitor',

  components: {
    Multiselect,
    commonHelper,
    TruckMonitorService,
    VueMonthlyPicker,
    Moment,
    BProgress
  },

  props: [],

  data: () => ({
    time: 0,
    isProgress: false,
    progressTitle: 'Đang tính toán bảng lương...',
    valueProgress: 0,
    maxProgress: 100,
    minMonth: new Moment('2022-09'),
    maxMonth: new Moment().format('YYYY-MM'),
    salaryMonth: new Moment(),
    listTruckMonitorOption: [],
    userInfo: [],
    month: Moment(new Moment()).format('MM'),
    year: Moment(new Moment()).format('YYYY'),
    isProcessing: false,
    infoUser: {
      fullname: '',
      seniority: 0,
      statusAccount: ''
    },
    listDataSal: [],
    dataSal: {},
    show: false,
    station: {},
    listStation: [],
    isHiddenSal: false
  }),

  created () {
    this.getAllStaffTruckMonitor()
  },

  watch: {
    salaryMonth (newVal, oldVal) {
      this.month = Moment(newVal).format('MM')
      this.year = Moment(newVal).format('YYYY')
    },
    station (newVal, oldVal) {
      this.dataSal = this.listDataSal[this.station.id]
    }
  },

  methods: {
    calSalTruckMonitor: async function () {
      try {
        if (typeof this.userInfo.id === 'undefined') {
          return commonHelper.showMessage('Vui lòng chọn user', 'warning')
        }
        if (typeof this.month === 'undefined' || typeof this.year === 'undefined') {
          return commonHelper.showMessage('Vui lòng chọn kì lương', 'warning')
        }
        const res = await TruckMonitorService.getInfoSalaryUser({user_id: this.userInfo.id, month: this.month, year: this.year})
        if (res.data.success) {
          this.info_user = res.data.data.info_user
          this.listDataSal = res.data.data.data_sal
          this.listStation = res.data.data.list_station
          this.station = this.listStation[0]
          this.dataSal = this.listDataSal[this.station.id]
          this.isHiddenSal = true
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          this.isHiddenSal = false
          return commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (err) {
        console.log(err)
        return commonHelper.showMessage(err, 'warning')
      }
    },

    getAllStaffTruckMonitor: async function () {
      try {
        const res = await TruckMonitorService.getAllStaffTruckMonitor()
        if (res.data.success) {
          this.listTruckMonitorOption = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'warning')
        }
      } catch (err) {
        console.log(err)
        return commonHelper.showMessage('Có lỗi xảy ra', 'warning')
      }
    },

    exportAllSalary: async function () {
      if (this.listTruckMonitorOption.length === 0) {
        return commonHelper.showMessage('Bạn không có quyền xuất lương hoặc không tìm được danh sách user')
      }
      this.valueProgress = 0
      this.progressTitle = 'Đang tính toán lương...'
      if (this.time !== 0) this.time = 0
      let now = new Date()
      let since = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      let timeline = now.getTime() - since.getTime()
      let timerId = setInterval(() => {
        now = new Date()
        this.time = now.getTime() - since.getTime() - timeline
      }, 10)
      let listUserId = []
      if (this.userInfo.length === 0) {
        this.maxProgress = this.listTruckMonitorOption.length
        listUserId = this.listTruckMonitorOption.map((option) => option.id)
      } else {
        listUserId = [this.userInfo.id]
        this.maxProgress = 1
      }
      this.valueProgress = 0
      this.isProgress = true
      this.isProcessing = true
      this.dataSalary = []
      listUserId.forEach(item => {
        TruckMonitorService.calSalary({month: this.month, year: this.year, user_id: item}).then(async res => {
          if (res.data.success) {
            this.valueProgress += 1
            if (res.data.data.length !== 0) {
              this.dataSalary = this.dataSalary.concat(res.data.data)
            }
            if (this.valueProgress === this.maxProgress) {
              this.progressTitle = 'Đã tính toán xong. Đang tiến hành xuất lương...'
              const response = await TruckMonitorService.exportAllSalary({data_export: this.dataSalary})
              if (response.data.success) {
                window.location.href = response.data.data
                this.progressTitle = 'Đã hoàn thành'
                clearInterval(timerId)
                this.isProcessing = false
                return commonHelper.showMessage(response.data.message, 'success')
              }
              this.progressTitle = 'Xảy ra lỗi khi xuất lương'
              clearInterval(timerId)
              this.isProcessing = false
              return commonHelper.showMessage(response.data.message, 'warning')
            }
          }
        }).catch(() => {
          clearInterval(timerId)
          return commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
        })
      })
    },
    convertNumber (x) {
      x = Number(x)
      x = x.toLocaleString('it-IT', {style: 'currency', currency: 'VND'})

      let locationVND = x.indexOf('VND')
      if (locationVND !== -1) {
        x = x.slice(0, locationVND - 1)
      }
      return x
    }
  }
}
</script>
