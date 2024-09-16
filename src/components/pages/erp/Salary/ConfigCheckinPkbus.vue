<template>
  <div class="content">
    <div class="headerD">
      <b-row>
        <b-col md="6">
          <h4 mt="2">Config Checkin Cod</h4>
        </b-col>
        <b-col md="6">
          <router-link :to="{path: '/salary/config-checkin-cod-v3', query: {user_id: this.$route.query.user_id}}" v-if="listConfig.length === 0" class="btn customRouteL">Tạo config</router-link>
        </b-col>
      </b-row>
    </div>
    <b-card v-if="isLoadInfo" no-body class="cardInfo">
      <b-row>
        <b-col md="1">
          <div class="avatar"><img :src="infoUser.avatar" alt=""></div>
        </b-col>
        <b-col md="10" mt="3" class="infoUsers">
          <div class="detailConfig" style="margin-bottom: 8px">{{infoUser.staffCode}} - {{infoUser.fullName}}</div>
          <div class="row">
            <span class="col-md-2 mr-4" style="font-size: 14px; font-weight: 600;">Loại cod: <span style="font-size: 14px; font-weight: 400;">{{infoUser.positionName}}</span></span>
            <span class="col-lr-3 mr-5 ml-3 spanStation" style="font-size: 14px; font-weight: 600;">Bưu cục: <span style="font-size: 14px; font-weight: 400;">{{infoUser.stationName}}</span></span>
            <span class="col-md-2 ml-4 mr-5" style="font-size: 14px; font-weight: 600;">Thâm niên: <span style="font-size: 14px; font-weight: 400;">{{infoUser.seniority}} năm</span></span>
            <span class="col" style="font-size: 14px; font-weight: 600;">Hình thức: <span style="font-size: 14px; font-weight: 400;">{{infoUser.workType}}</span></span>
          </div>
          <div class="row formulaS">
            <b-col md="6">
              <span class="detailConfig">Công thức lương: </span><span>{{ infoUser.formula }}</span>
            </b-col>
            <b-col md="6" class="nameFormula">
              <span class="detailConfig">Tên công thức lương: </span><span style="font-size: 14px;">{{ infoUser.formulaName }}</span>
            </b-col>
          </div>
        </b-col>
      </b-row>
    </b-card>
    <b-card v-for="(item, index) in listConfig.slice().reverse()" :key="index" no-body>
      <b-row class="mb-3 mt-4">
        <b-col md="6">
          <span class="detailNumberConfig customNumberConfig">Config: {{ item.config_id }} </span >
        </b-col>
        <b-col md="3">
          <span class="detailConfig">Trạng thái: </span><span v-if="item.status_config == '1'" style="font-size: 14px; color:green; font-weight: 600;">Đang áp dụng</span><span v-if="item.status_config == '2'" style="font-size: 14px; color:#d26c07; font-weight: 600;">Chưa áp dụng</span>
        </b-col>
        <b-col md="3" style="margin-top: -0.8%">
          <router-link :to="{path: '/salary/config-checkin-cod-v3', query: {user_id: infoUser.id, config_id: item.config_id}}" class="btn btnDelete" style="background-color:#02b371 !important;" v-if="item.status_config == '1' && listConfig.length === 1">Tạo config</router-link>
          <b-button v-if="item.status_config == '2'" @click="deleteConfig(item.config_id)" class="btn btnDelete"> Xoá</b-button>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <b-col md="2">
          <span class="detailConfig">Ngày bắt đầu:</span>
        </b-col>
        <b-col md="4" class="customDate">
          <vue-date-picker
            v-model="item.start_date"
            format="yyyy-MM-dd"
            disabled
          ></vue-date-picker>
        </b-col>
        <b-col md="6">
          <span class="detailConfig">Loại cấu hình: </span><span v-if="item.object_type == 2" style="font-size: 14px;">Theo người dùng</span><span v-if="item.object_type == 1" style="font-size: 14px;">Theo kho</span>
        </b-col>
      </b-row>
      <b-row class="mb-4">
        <b-col md="2">
          <span class="detailConfig">Đến hết ngày:</span>
        </b-col>
        <b-col md="4" class="customDate">
          <span class="customEndDate">
            {{convertDate(listConfig.slice().reverse()[index + 1] ?  listConfig.slice().reverse()[index + 1].start_date : 0) }}
          </span>
        </b-col>
      </b-row>
      <b-row class="mb-lg-5" style="margin-bottom:1.5rem!important;">
        <b-col md="2">
          <span class="detailConfig">Số lần về bưu cục:</span>
        </b-col>
        <b-col md="4" class="customMul ctNumberConfig">
          <span>{{Object.keys(item.config).length}}</span>
        </b-col>
      </b-row>
      <b-row v-for="(configShift, i) in item.config" :key="i" class="mb-2 customShift customConfigTime" style="margin-left:19.9%; margin-bottom: 1.2%!important;">
        <b-col md="1">
          <span class="customSpanConfig">{{configShift.shift}}</span>
        </b-col>
        <b-col md="2">
          <span class="customStylePointName">
            {{configShift.point_name}}
          </span>
        </b-col>
        <b-col md="2">
          <span class="customStylePointTime">
            Bắt đầu: {{(configShift.start.length > 5 ) ? configShift.start.slice(-8, -3) : configShift.start}}
          </span>
        </b-col>
        <b-col md="2">
          <span class="customStylePointTime">
            Muộn: {{(configShift.late.length > 5 ) ? configShift.late.slice(-8, -3) : configShift.late}}
          </span>
        </b-col>
        <b-col md="2">
          <span class="customStylePointTime">
            Kết thúc: {{(configShift.end.length > 5 ) ? configShift.end.slice(-8, -3) : configShift.end}}
          </span>
        </b-col>
      </b-row>
      <b-row class="customBtnAdd">
        <router-link :to="{path: '/salary/config-checkin-cod-v3', query: {user_id: infoUser.id, config_id: item.config_id}}" class="btn customRouteLink" v-if="item.status_config == '2'">+ Chỉnh sửa</router-link>
      </b-row>
    </b-card >
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
.content >>> .card{
  margin-top: 22px;
  margin-bottom: 22px;
  padding-left: 20px;
  padding-bottom: 1%;
  border-radius: 5px;
  box-shadow: rgb(201 196 196 / 15%) 6.95px 2.95px 2.6px;
}
.content >>> .cardHeader {
  padding-bottom: 0%!important;
}
.avatar >>> img {
  width: 98px!important;
  height: 98px !important;
  border-radius: 50% !important;
  object-fit: cover;
  margin-top: 19%;
}
.customShift >>> .btnS {
  margin-top: -0.65rem !important;
  margin-left: -4rem;
  border-radius: 6px;
}
.customShift >>> .btnE {
  margin-top: -0.65rem !important;
  margin-left: 4px;
  border-radius: 6px;
}
.customShift >>> .multiselect {
  margin-left: -17%;
}
.customConfigTime >>> .btnStart {
  width: 100%;
  padding-right: 0;
  border-right: none;
  background-color: #f1f1f2;
}
.customConfigTime >>> .btnStartTime {
  width: 5%;
  padding-left: 3%;
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.customConfigTime >>> .btnStartTime:focus{
  border-color: #e7e7e7 !important;
}

.detailConfig {
  margin-top: 2.6%;
  font-weight: 600;
  font-size: 14px;
}
.detailNumberConfig {
  font-weight: 600;
  font-size: 14px;
}
.customConfigTime >>> .customSpanConfig {
  display: inline-block;
  margin-left: 2%;
  width: 67%;
  height: 124%;
  text-align: center;
  padding-top: 15%;
  border-radius: 5px;
  border: 1px solid #e7e7e7;
  background-color: #f1f1f2;
}
.ctNumberConfig >>> span {
  display: inline-block;
  margin-left: -10%;
  margin-top: -4%;
  width: 11%;
  height: 155%;
  text-align: center;
  padding-top: 1.6%;
  border-radius: 5px;
  border: 1px solid #e7e7e7;
  background-color: #ffd43a;
}
.customDate >>> input, .customMul >>> .multiselect {
  width: 132px !important;
  height: 36px !important;
  margin-left: -23% !important;
  margin-top: -7px !important;
  text-align: center !important;
  font-size: 15px !important;
  font-weight: 400 !important;
  border-radius: 4px;
  border: 1px solid #dddddd;
  outline: none;
}
.infoUsers {
  margin-left: 3%;
}

.customDate >>> input:focus {
  outline: 1px solid rgb(26 239 38);
}
.customDate >>> .vdp-datepicker__calendar {
  margin-left: -105px !important;
}
.customDate >>> header{
  color: white !important;
  height: 70px !important;
  background: rgb(102 187 106) !important;
}
.cardHeader >>> h3 {
  margin-left: 0.8%;
  margin-top: 1.2%;
  margin-bottom: 1.2%;
  font-size: 22px;
}
.customDate >>> .up{
  font-size: 165% !important;
  margin-top: 14px;
}
.customBtn >>> .btn {
  margin-top: -0.65rem !important;
  border-radius: 6px;
}
.customBtnDelete >>> .btn {
  margin-left: -206%;
  border-radius: 12%;
  width: 44%;
}
.customBtnAdd >>> .btn {
  margin-left: 14.5%;
  margin-top: 1%;
  margin-left: 21.8%;
  border-radius: 5%;
  padding-right: 1%;
}
.customMul >>> .multiselect {
  width: 98px !important;
  margin-left: -55px!important;
  margin-top: -9px !important;
  border: none;
}
.ctNumberConfig >>> .multiselect {
  margin-left: -38px !important;
  width: 13% !important;
  border: none;
}
.customStylePointName, .customStylePointTime {
  display: inline-block;
  margin-left: -22%;
  padding-top: 6%;
  text-align: center;
  width: 136%;
  height: 124%;
  border: 1px solid rgb(24 28 33 / 6%);
  background-color: #f1f1f2;
  border-radius: 5px;
}
.customStylePointTime{
  margin-left: 6%;
  width: 108%;
}
.customNumberConfig {
  display: inline-block;
  text-align: center;
  border-radius: 5px;
}
.customEndDate {
  display: inline-block;
  margin-left: -23%;
  margin-top: -2%;
  width: 37.5%;
  height: 152%;
  padding-top: 2%;
  text-align: center;
  background-color: #fafafa;
  border-radius: 5px;
  border: 1px solid #dddddd;
}
.customRouteLink {
  border-radius: 6%;
  margin-top: 42%;
  margin-right: 85%;
  float: right;
  background-color: #02b371;
  font-weight: 600;
  color: white;
  outline: none;
}
.customRouteLinkCreate {
  float: right;
  margin-top: 3%;
  background-color: #02b371;
  font-weight: 600;
  color: white;
  outline: none;
  margin-right: 8%;
}
.btnDelete {
  margin-right: 32%;
  float: right;
  background-color: red;
  font-weight: 600;
  color: white;
  outline: none;
  border-radius: 6%;
}
.spanStation {
  margin-left: 3.8% !important;
}
.formulaS {
  margin-top: 1%;
}
.nameFormula {
  margin-left: -28.5%;
}
.customRouteL {
  border-radius: 6%;
  margin-right: 4%;
  float: right;
  margin-top: -1%;
  background-color: #02b371;
  font-weight: 600;
  color: white;
  outline: none;
}
@media screen and (min-width: 1281px) {
  .ctNumberConfig >>> span {
    width: 8%;
    height: 171%;
  }
  .customConfigTime >>> .customSpanConfig {
    width: 51%;
    height: 124%;
    padding-top: 11%;
  }
  .cardHeader >>> h3 {
    margin-top: 1%;
    font-size: 26px;
    margin-left: 0.5%;
  }
  .customNumberConfig {
    margin-top: -1%;
    height: 114%;
  }
  .customEndDate {
    width: 23.2%;
  }
  .customStylePointName {
    margin-left: -28%;
    padding-top: 4%;
    height: 124%;
  }
  .customStylePointTime{
    margin-left: 1%;
    width: 108%;
  }
  .customBtnAdd >>> .btn {
    margin-top: 0.5%;
    margin-left: 21.1%;
  }
  .customRouteLink {
    margin-top: 22%;
  }
  .spanStation {
    margin-left: -0.2% !important;
    margin-right: 8%!important;
  }
  .customBtnAdd >>> .btn {
    margin-left: 21%;
  }
  .detailConfig {
    margin-top: 1.9%
  }
  .customEndDate {
    height: 149%;
    padding-top: 1%;
  }
  .formulaS {
    margin-top: 0.5%;
  }
  .infoUsers {
    margin-left: -1%;
    margin-top: -6px!important;
  }
  .nameFormula {
    margin-left: -32.8%;
  }
  .content >>> .cardInfo {
    height: 119px;
  }
  .avatar >>> img {
    margin-top: 9%;
  }
  .ctNumberConfig >>> span {
    margin-left: -23%;
  }
}
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import Multiselect from 'vue-multiselect'
import SalaryServicePkbus from 'domain/services/salary-service-pkbus'
import MultiSelectStopPoint from './ConfigCheckinComponent/MultiSelectStopPoint'
import VueDatePicker from 'vuejs-datepicker'

export default {
  name: 'config-checkin-cod-v3',
  components: {
    commonHelper,
    VueMonthlyPicker,
    Moment,
    Multiselect,
    MultiSelectStopPoint,
    VueDatePicker
  },
  data: () => ({
    infoUser: {
      fullName: '',
      avatar: '',
      staffCode: '',
      positionName: '',
      stationName: '',
      seniority: '',
      workType: '',
      formula: '',
      formulaName: ''
    },
    listConfig: [],
    userId: null,
    isLoadInfo: false,
    isLoading: false
  }),
  watch: {
    numberReturn: function (newVal, oldVal) {
      this.changeNumberReturnPostOffices()
    }
  },
  created () {
    this.getInfoUserPkBus()
    this.getAllConfigByUserId()
  },
  computed: {},
  methods: {
    getInfoUserPkBus () {
      this.isLoadInfo = false
      this.isLoading = true
      let params = {
        'userId': this.$route.query.user_id
      }
      SalaryServicePkbus.getInfoUserPkBus(params)
        .then((res) => {
          if (res.data.success) {
            let data = res.data.data
            this.infoUser.id = data.id
            this.infoUser.staffCode = data.staff_code
            this.infoUser.avatar = data.image_profile
            this.infoUser.fullName = data.fullname
            this.infoUser.positionName = data.position_name
            this.infoUser.stationName = data.station_name
            this.infoUser.seniority = data.seniority
            this.infoUser.workType = data.work_type
            this.infoUser.formula = data.formula
            this.infoUser.formulaName = data.formula_name
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.isLoading = false
        })
    },
    convertDate (date) {
      if (date === 0) {
        return 'Không giới hạn'
      } else {
        let d = new Date(date)
        let beforeOneDay = new Date(d.getTime() - 86400000)
        return (beforeOneDay.getFullYear()) + '-' + ('0' + (beforeOneDay.getMonth() + 1)).slice(-2) + '-' + ('0' + beforeOneDay.getDate()).slice(-2)
      }
    },
    getAllConfigByUserId () {
      let params = {
        'userId': this.$route.query.user_id
      }
      SalaryServicePkbus.getAllConfigByUserId(params)
        .then((res) => {
          if (res.data.success) {
            this.listConfig = res.data.data
            this.isLoadInfo = true
            if (res.data.data.length > 0) { return commonHelper.showMessage(res.data.message, 'success') }
            return commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // eslint-disable-next-line camelcase
    deleteConfig (config_id) {
      if (!confirm('Bạn có chắc chắn muốn xóa config này không')) return 1
      let params = {
        'configId': config_id
      }
      SalaryServicePkbus.deleteConfig(params)
        .then((res) => {
          if (res.data.success) {
            this.getAllConfigByUserId()
            return commonHelper.showMessage(res.data.message, 'success')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
