<template>
  <div>
    <b-card class="card_header">
      <h1 class="font-weight-bold py-3 mb-4" style="text-align: center">
        Lương trung chuyển
      </h1>
      <b-row class="form">
        <b-col>
            <vue-monthly-picker v-model="one.selectedMonth" style="height: 40.5px;"></vue-monthly-picker>
        </b-col>
        <b-col>
          <ladda-btn :loading="one.loadingButton" @click.native="getSalaryTrans" data-style="expand-right"
                     class="btn btn-primary" style="width: 100%;height: 89%;">
            Kiểm tra
          </ladda-btn>
        </b-col>
      </b-row>
    </b-card>
    <b-card no-body class="mb-1 crad-id " v-if="showData">
      <b-row class="container">
        <b-col>
          <b-row id="a">
            <b-col class="b" style="margin-left: 25px;" >
              <ul style="list-style: none">
                <li><h4>Lương trung chuyển</h4></li>
                <li><h4>Lương sản lượng</h4></li>
                 <li><h4>Tổng sản lượng</h4></li>
                <li><h4>Lương theo km</h4></li>
                 <li><h4>Tổng km</h4></li>
                <li><h4>Lương tăng ca</h4></li>
                <li v-if="transList.sumSalaryOvertime != 0"><h4>Số ngày tăng ca</h4></li>
              </ul>
            </b-col>
            <b-col>
              <ul style="list-style: none" class="c">
                <li><h4>{{ transList.salaryTransits }} đ</h4></li>
                <li><h4>{{ transList.sumByLevel }} đ</h4></li>
                <li> <h4>{{ transList.number_packages }} ĐH</h4></li>
                <li><h4>{{ transList.sumByDistance }} đ</h4></li>
                <li><h4>{{ transList.distance }} km</h4></li>
                <li><h4> {{ transList.sumSalaryOvertime }} đ</h4></li>
                <li v-if="transList.sumSalaryOvertime != 0"><h4> {{ transList.sumOvertime }} ngày </h4></li>
              </ul>
            </b-col>
          </b-row>
          <b-row>
            <span style="padding: 25px 57px;" v-if="transList.sumSalaryOvertime != 0"><i><b>Thông tin chi tiết những ngày tăng ca</b></i></span>
          </b-row>
          <b-row v-for="(detaiO) in detailOt" v-if="transList.sumSalaryOvertime != 0" :key="detaiO.date">

            <b-col>
              <ul class="detailot">
                <li><h4>Ngày tăng ca</h4></li>
                <li><h4>Số Km</h4></li>
                <li><h4>Lương</h4></li>
              </ul>
            </b-col>
            <b-col>
              <ul class="detailot" id="detailot">
                <li><h4>{{ detaiO.date }}</h4></li>
                <li><h4>{{ detaiO.total_distance }} km</h4></li>
                <li><h4>{{ (detaiO.salary_ot).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,")}}{{' đ'}} </h4></li>
              </ul>
            </b-col>
          </b-row>
        </b-col>
        <b-col style="margin-top: 3%;">
          <b-card  v-for="(day) in dayTransList" :key="day" >
            <b-card-header>
              <span @click="getTransByDay(day)" class="d-flex justify-content-between text-dark"
                    v-b-toggle="day">
                {{ day }}
                <div class="collapse-icon"></div>
              </span>
            </b-card-header>
            <b-collapse :visible="one.visible" accordion="accordion" v-bind:id="day">
              <b-card-body>
                <div v-if="!transByDayList.length">
                  <b-card-header style="border: none;"> <i>không có dữ liệu trong ngày này</i> </b-card-header>

                </div>
                <div :key="index" class="form-row" v-for="(detailTrans, index ) in transByDayList"  v-else>
                    <b-card-header style="border: none;">
                      <div>
                        <b-button @click="detailTransBySession(detailTrans.ss_id)"  v-b-modal.modalContent style="background-color: #02a065 !important;" >Ca {{ index + 1 }}</b-button>
                      </div>
                    </b-card-header>
                  <b-row class="ca">
                    <b-col>
                      <ul style="list-style:none" class="icon_day">
                        <span class="ion d-block ion-ios-flame" id="ca_icon"></span>
                        <li>Mã phiên</li>
                        <span class="ion d-block ion-ios-briefcase" id="ca_icon"></span>
                        <li>Tổng Km</li>
                        <span class="ion d-block ion-md-pin" id="ca_icon" ></span>
                        <li style="margin: 5px;">Tổng điểm</li>
                        <span class="ion d-block ion-ios-paper" id="ca_icon" ></span>
                        <li>Tổng SL quy đổi</li>
                        <span class="ion d-block ion-md-contrast" id="ca_icon" ></span>
                        <li>Bắt Đầu</li>
                        <span class="ion d-block ion-ios-stopwatch" id="ca_icon" ></span>
                        <li>Kết Thúc</li>
                      </ul>
                    </b-col>
                    <b-col>
                      <ul style="list-style:none">
                        <li>{{ detailTrans.ss_id }}</li>
                        <li>{{ detailTrans.distance }} km</li>
                        <li>{{ detailTrans.point }} điểm</li>
                        <li>{{ detailTrans.sumsl }} ĐH</li>
                        <li>{{ detailTrans.time_start }}</li>
                        <li>{{ detailTrans.time_end }}</li>
                      </ul>
                    </b-col>
                  </b-row>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-col>
      </b-row>
    </b-card>
<!--    modal-->
    <b-modal style="background-color: #02a065;" title="DANH SÁCH ĐIỂM" id="modalContent" hide-footer>
      <div>
        <ul v-for="(detailByDay, index) in detailTransByDayList" style="list-style: none;  border-bottom: 1px solid #33333326;">
            <span class="ion d-block ion-ios-home" style="float: left;margin-right: 4px;"></span>
            <li v-if="detailByDay.statusP != 'approved'" style="color: red" >
              <b>{{detailByDay.nameP}}({{ detailByDay.pointName }})</b>
            </li>
            <li v-else>
              <b>{{detailByDay.nameP}}({{ detailByDay.pointName }})</b>
            </li>
            <li v-if="index === firstAccept">
              <b-badge variant="info">Điểm bắt đầu</b-badge>
            </li>
            <li>Tọa độ điểm dừng: <b>{{detailByDay.point_coordination}}</b></li>
            <li>Tọa độ checkin: <b>{{detailByDay.cod_point_coordination}}</b></li>
            <li>Khoảng cách checkin: <b>{{detailByDay.distanceCheck}} m</b></li>
            <li>Số km: <b>{{detailByDay.distances}} Km</b></li>
            <li>Đến nơi: <b>{{ detailByDay.arrivial }}</b></li>
            <li>Kết thúc: <b>{{detailByDay.time_end}}</b></li>
            <li>Tổng đơn nhập: <b>{{detailByDay.pkg_import}} ĐH</b></li>
            <li>Tổng đơn xuất: <b>{{detailByDay.pkg_transit}} ĐH</b></li>
            <li>Sản lượng quy đổi: <b>{{ detailByDay.sl }} ĐH</b></li>
            <div  v-if="detailByDay.statusP != 'approved'">
              <li><b>Trạng thái: </b><b>Hủy bỏ </b></li>
              <div v-if="detailByDay.reasonP == 'cod_long_distance'">
                <li><b>Lý do: khoảng cách lớn hơn 200m</b> </li>
              </div>
              <div v-else>
                <li><b>Lý do: Không có sản lượng </b> </li>
              </div>
            </div>
            <div v-else>
              <li><b>Trạng thái: Chấp nhận </b></li>
            </div>
        </ul>
      </div>
    </b-modal>
  </div>
</template>
<style lang="scss" src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss"></style>
<style lang="scss" src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss"></style>

<style scoped>
#usermonth {
  width: 100%;
  height: 100%;
}
#useryear {
  width: 100%;
  height: 100%;
}
.icon_day li {
  margin: 10%;
}

.ca ul li {
  width: 130%;
  margin: 5px
}
.month-year-display input {
  height: 40.5px;
}
#a {
  margin-top: 6.8%;
}
#a ul {
  padding: 0px;
  margin: 0px;
}

.crad-id {
  overflow: hidden;
  border: 1px solid #00000045;
  margin-bottom: 50px !important;

}
.card-body {
  padding: 0px 0px;
}

#a .col-md-6 {
  padding: 0 !important;
}
#ca_icon{
  float: left;margin-right: 4px;
}
#a h4 {
  margin-bottom: 8px;
  font-weight: 500 !important;
}
.detailot{
  list-style: none;
  padding-left: 45px;
  padding-top: 20px;
}
#detailot{
  padding: 20px 36px;
}
#a h6 {
margin-bottom: 8px;
font-weight: 400;
}
#detailot li h4 {
  font-weight: 500 !important;
}

#a .b ul li {
padding: 10px 22px;
}
#a .b ul li h4{
font-weight: 400 !important;
font-size: 16px;
}
#a .c li {
padding: 10px 22px;
font-size: 16px;
}
.d-flex {
background-color: white;
border: none;
}
.modal-content {
  max-width: 50%;
  margin: 0 auto;
}
.modal-header {
background-color: #02a065;
border-radius: 15px 15px 0 0;
}

#modalContent___BV_modal_content_{
border-radius: 50px 50px 15px 15px  !important;
}
.form div input {
height: 40px;

}
.form div button {
height: 40px;
background-color: #02a065;;
}
.container{
max-width: 100%;
}
.card_header {
padding: 2% 34% 3% 30%;
margin: 0 0 1%;
border: 1px solid #00000045;
}
.form-row{
margin-right: 0 !important;
margin-left: 0 !important;
border-bottom: 1px solid #33333326;
}
h4, .h4 {
font-size: 16px !important;
font-weight: 400 !important;
}
.modal-body {
  margin-bottom: 20px;
}
</style>

<script>

import Vue from 'vue'
import moment from 'moment'
import TreeView from 'vue-json-tree-view'
import VueMonthlyPicker from 'vue-monthly-picker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import transitscod from 'domain/services/transitscod-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(TreeView)

moment.suppressDeprecationWarnings = true

export default {
  name: 'transits-cod',
  metaInfo: {
    title: 'Lịch sử lương trung chuyển tỉnh '
  },
  components: {
    VueMonthlyPicker,
    LaddaBtn
  },
  data: () => ({
    user: {
      user_id: null,
      month: null,
      year: null

    },
    one: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },
    transList: null,
    dayTransList: [],
    transByDayList: [],
    detailTransByDayList: [],
    showData: false,
    firstAccept: null,
    detailOt: []
  }),

  methods: {
    getSalaryTrans () {
      // lấy lương
      this.one.loadingButton = true
      let month = moment(this.one.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let param = this.$route.query
      transitscod.getSalaryTrans({
        user_id: param.user_id,
        month: str[1],
        year: str[0]
      }).then(response => {
        let err = 'cancel'
        if (response.data.message) {
          commonHelper.showMessage(response.data.message, 'warning')
          this.one.loadingButton = false
          throw err
        } else {
          return response.data
        }
      })
        .then(data => {
          this.detailOt = data.detailOvertime
          this.transList = data
          this.dayTransList = data.dateList
          this.showData = true
        })
        .then(() => {
          this.one.loadingButton = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTransByDay (day) {
      // chi tiết ngày có trans
      let param = this.$route.query
      transitscod.getTransByDay({
        user_id: param.user_id,
        date: day
      }).then(response => {
        return response.data
      })
        .then(data => {
          this.transByDayList = data
        })
    },
    detailTransBySession (detailTrans) {
      let param = this.$route.query
      // chi tiết ca trong ngày
      transitscod.detailTransBySession({
        user_id: param.user_id,
        ss_id: detailTrans
      }).then(response => {
        return response.data
      })
        .then(data => {
          this.firstAccept = data.findIndex(e => e.statusP === 'approved')
          this.detailTransByDayList = data
        })
    }
  }
}
</script>
