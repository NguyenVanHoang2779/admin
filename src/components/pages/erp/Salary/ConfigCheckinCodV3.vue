<template>
  <div class="content">
      <div class="headerD">
        <b-row>
          <router-link v-if="this.objectType.value === 2" :to="{path: '/salary/manage-checkin-cod', query: {object_type: this.objectType.value, object_id: this.objectId}}" style="color: #545454;"> <i class="fas fa-angle-left" style="font-size: 30px; margin-left: 76%;"></i></router-link>
          <router-link v-if="this.objectType.value === 1" :to="{path: '/salary/manage-checkin-cod', query: {object_type: this.objectType.value, object_id: this.objectId, formula: Number(this.formula.code)}}" style="color: #545454;"> <i class="fas fa-angle-left" style="font-size: 30px; margin-left: 76%;"></i></router-link>
          <h4 mt="2" v-if="type === 'update'">Chỉnh sửa config COD</h4>
          <h4 mt="2" v-if="type === 'create'">Tạo config COD</h4>
        </b-row>
      </div>
    <div class="cardSearch">
      <b-row class="top topRowCustom align-items-center">
        <b-col md="3">
          <span class="spanSearch">Phạm vi áp dụng:</span>
          <multiselect
            v-model="objectType"
            placeholder="Chọn pham vi áp dụng"
            label="name"
            track-by="value"
            selectedLabel="Chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :options="listObjectType"
            :searchable="true"
            deselect-label="Không thể bỏ chọn"
            :allow-empty="false"
            :disabled="isDisabled"
          >
          </multiselect>
        </b-col>
        <b-col md="3" v-if="objectType.value == 1">
          <span class="spanSearch">Áp dụng cho kho:</span>
          <multiselect
            v-model="station"
            placeholder="Chọn kho"
            label="name"
            track-by="id"
            selectedLabel="Chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :options="listStation"
            :searchable="true"
            :allow-empty="false"
            :disabled="isDisabled"
          >
          </multiselect>
        </b-col>
        <b-col md="3" v-if="objectType.value == 1">
          <span class="spanSearch">Công thức lương:</span>
          <multiselect
            v-model="formula"
            placeholder="Chọn công thức lương"
            label="name"
            track-by="code"
            selectedLabel="Chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :options="listFormula"
            :searchable="true"
            :allow-empty="false"
          >
          </multiselect>
        </b-col>
        <b-col md="3" class="colUsername" v-if="objectType.value == 2">
          <span class="spanSearch spanUsername">Đối tượng áp dụng:</span>
          <b-input v-model="username" :disabled="isDisabled" :placeholder="`Nhập tên người dùng`"></b-input>
        </b-col>
      </b-row>
    </div>
    <b-card no-body>
        <b-row class="mb-4 mt-4">
          <b-col md="2">
            <span class="detailConfig">Ngày bắt đầu:</span>
          </b-col>
          <b-col md="4" class="customDate">
            <vue-date-picker
              v-model="startDate"
              format="yyyy-MM-dd"
              placeholder="Chọn ngày bắt đầu"
            ></vue-date-picker>
          </b-col>
        </b-row>
        <b-row class="mb-lg-5" style="margin-bottom: 1rem !important;">
          <b-col md="2">
            <span class="detailConfig">Số lần về bưu cục:</span>
          </b-col>
          <b-col md="4" class="customMul ctNumberConfig">
            <multiselect
              class="numberRe"
              v-model="numberReturn"
              :options="optionConfig"
              selectedLabel=""
              deselectLabel=""
              selectLabel=""
            >
            </multiselect>
          </b-col>
          <b-col md="6">
            <i v-if="isDone == 2" class="sidenav-icon ion ion-ios-done-all iconDone mr-2"/>
          </b-col>
        </b-row>
        <b-row v-for="(configShift, index) in listConfig" :key="index" class="mb-2 customShift customConfigTime" style="margin-left:5%;">
          <b-col md="1">
            <span class="customSpanConfig">{{index + 1}}</span>
          </b-col>
          <b-col v-if="objectType.value === 1" md="3">
            <multiselect
              :id="index+'0'"
              style="height: 41px;"
              v-model="station"
              placeholder="Chọn kho"
              label="name"
              track-by="id"
              selectedLabel="Chọn"
              deselectLabel="Bỏ chọn"
              selectLabel="Chọn"
              :options="listStation"
              :searchable="true"
              :allow-empty="false"
              :disabled="true"
            >
            </multiselect>
          </b-col>
          <b-col v-if="objectType.value === 2" md="3">
            <multiselect
              :id="index+'0'"
              style="height: 41px;"
              placeholder="Chọn điểm làm hàng"
              label="name"
              track-by="name"
              v-model="configShift.pointDetails"
              :options="listStopPoint"
              selectedLabel=""
              deselectLabel=""
              selectLabel=""
            >
            </multiselect>
          </b-col>
          <b-col md="2" class="customTimeShift">
            <b-input-group style="width: 121%;">
              <b-input-group-prepend>
                <b-input-group-text class="btnStart" :id="index+'1'">Bắt đầu: </b-input-group-text>
              </b-input-group-prepend>
                <b-form-input
                  :id="index+'1'+'2'"
                  class="btnStartTime"
                  v-model="configShift.start"
                  type="time"
                ></b-form-input>
            </b-input-group>
          </b-col>
          <b-col md="2" class="customTimeShift">
            <b-input-group style="width: 111%;">
              <b-input-group-prepend>
                <b-input-group-text class="btnStart" :id="index+'2'" >Muộn: </b-input-group-text>
              </b-input-group-prepend>
                <b-form-input
                  :id="index+'2'+'2'"
                  class="btnStartTime"
                  v-model="configShift.late"
                  type="time"
                ></b-form-input>
            </b-input-group>
          </b-col>
          <b-col md="2" class="customTimeShift" style="margin-right: 0% !important; margin-left: -6.5%!important;">
            <b-input-group style="width: 122%;">
              <b-input-group-prepend>
                <b-input-group-text class="btnStart" :id="index+'3'">Kết thúc: </b-input-group-text>
              </b-input-group-prepend>
                <b-form-input
                  :id="index+'3'+'2'"
                  class="btnStartTime"
                  v-model="configShift.end"
                  type="time"
                ></b-form-input>
            </b-input-group>
          </b-col>
          <b-col md="1" class="customBtnDelete" style="margin-left: 2%">
            <b-button @click="listConfig.splice(index, 1); numberReturn--" variant="outline-danger"><i class="sidenav-icon ion ion-ios-trash"/></b-button>
          </b-col>
        </b-row>
        <b-row class="customBtnAdd">
          <b-button @click="numberReturn++" variant="outline-success"> + Thêm ca</b-button>
        </b-row>
      <b-row>
        <b-col md="12">
          <b-button :disabled="isLoading" v-if=" type==='create'" class="float-right btnConfig" variant="success" style="border-radius: 6%" @click="Config('create')"> Tạo mới</b-button>
          <b-button :disabled="isLoading" v-if=" type==='update' " class="float-right btnConfig" variant="success" style="border-radius: 6%" @click="Config('update')"> Cập nhật</b-button>
        </b-col>
      </b-row>
    </b-card >
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .content >>> .card{
    margin-bottom: 14px;
    padding-left: 20px;
    border-radius: 5px;
    box-shadow: rgb(201 196 196 / 15%) 6.95px 2.95px 2.6px;
  }
  .content >>> .cardHeader {
    height: 58px;
  }
  .content >>> .cardInfo {
    margin-top: 22px;
    margin-bottom: 22px;
    padding-left: 15px;
    padding-top: 1.2%;
    padding-bottom: 1.2%;
    border-radius: 5px;
  }
  .cardSearch {
    margin-top: 1%;
    margin-bottom: 1.5%;
  }
  .spanSearch {
    display: inline-block;
    margin-top: 2%;
    font-weight: 500;
    margin-bottom: 2.5%;
    padding-bottom: 1%;
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
    font-weight: 600;
    font-size: 14px;
  }
  .customConfigTime >>> .customSpanConfig {
    display: inline-block;
    margin-left: 2%;
    width: 61%;
    height: 95%;
    text-align: center;
    padding-top: 8%;
    border-radius: 5px;
    border: 1px solid #e7e7e7;
  }
  .customDate >>> input {
    width: 25% !important;
    height: 36px !important;
    margin-left: -14% !important;
    margin-top: -7px !important;
    text-align: center !important;
    font-size: 15px !important;
    font-weight: 400 !important;
    border-radius: 4px;
    border: 1px solid #dddddd;
    outline: none;
  }
  .customMul >>> .multiselect {
    width: 30% !important;
    height: 36px !important;
    margin-left: -10% !important;
    margin-top: -7px !important;
    text-align: center !important;
    font-size: 15px !important;
    font-weight: 400 !important;
    border-radius: 4px;
    border: 1px solid #dddddd;
    outline: none;
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
  .customDate >>> .up{
    font-size: 165% !important;
    margin-top: 14px;
  }
  .customBtn >>> .btn {
    margin-top: -0.65rem !important;
    border-radius: 6px;
  }
  .customBtnDelete >>> .btn {
    margin-left: -3%;
    border-radius: 12%;
    width: 70%;
  }
  .customBtnAdd >>> .btn {
    margin-top: 0.5%;
    margin-left: 7.2%;
    border-radius: 6%;
    padding-right: 1%;
  }
  .customMul >>> .multiselect {
    width: 98px !important;
    margin-left: -55px!important;
    margin-top: -9px !important;
    border: none;
  }
  .ctNumberConfig >>> .multiselect {
    margin-left: -8% !important;
    width: 19% !important;
    border: none;
  }
  .iconError, .iconDone {
    color: green;
    font-size: 353%;
    margin-top: -12%;
    margin-right: 5%;
    padding-left: 60%;
    padding-top: 0;
  }
  .iconError {
    color: red !important;
  }
  .infoCod {
    margin-top: 2%;
  }
  .customTimeShift {
    margin-left: -5%;
    margin-right: 6.7%;
  }
  .btnConfig {
    margin-bottom: 1.5%;
    margin-right: 16%;
  }
  .typeConfig {
    margin-left: -39%;
  }
  .headerD >>> h4 {
    margin-top: 0.3%;
    margin-left: 1.8%;
  }
  @media screen and (min-width: 1281px) {
    .infoCod {
      margin-top: 1.3%;
      margin-left: -2%;
    }
    .customConfigTime >>> .customSpanConfig {
      width: 40%;
    }
    .customTimeShift {
      margin-right: 8%;
    }
    .customBtnDelete >>> .btn {
      margin-left: 12%;
      width: 40%;
    }
    .customBtnAdd >>> .btn {
      margin-left:6.4%;
    }
    .customShift >>> .multiselect {
      margin-left: -20%;
      height: 44px;
    }
    .btnConfig {
      margin-bottom: 1.5%;
      margin-right: 13.2%;
    }
    .typeConfig {
      margin-left: -42.8%;
    }
    .customDate >>> input {
      width: 18% !important;
      margin-left: -24% !important;
    }
    .headerD >>> h4 {
      margin-top: 0.1%;
      margin-left: 1.5%;
    }
    .ctNumberConfig >>> .multiselect {
      margin-left: -18% !important;
      width: 12% !important;
      border: none;
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
import stationService from 'domain/services/station-service'
import SalaryService from 'domain/services/salary-service'

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
    info: {
      id: null,
      fullName: ''
    },
    objectId: null,
    startDate: null,
    pointName: null,
    listConfig: [],
    optionConfig: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    numberReturn: 0,
    value: [],
    listStopPoint: [],
    pointStopUser: [],
    type: 'create',
    isLoading: false,
    isDone: 0,
    dataBefore: [],
    dateBefore: null,
    statusConfig: 0,
    idTimeErr: -1,
    listObjectType: [
      {'name': 'Theo kho', 'value': 1},
      {'name': 'Theo người dùng', 'value': 2}
    ],
    objectType: {'name': 'Theo người dùng', 'value': 2},
    listStation: [],
    station: {},
    listFormula: [],
    formula: {},
    username: null,
    isDisabled: false
  }),
  watch: {
    numberReturn: function (newVal, oldVal) {
      this.changeNumberReturnPostOffices()
    }
  },
  created () {
    let param = this.$route.query
    if (param.hasOwnProperty('config_id') && param.hasOwnProperty('type')) {
      if (Number(param.type) === 2) {
        this.type = 'update'
      }
      this.isDisabled = true
      this.getConfig()
    } else {
      this.numberReturn = 4
      let today = new Date()
      let date = (today.getFullYear()) + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1)
      this.startDate = date
      this.getListPointStop()
      this.getListStation()
      this.getAllFormula()
    }
  },
  computed: {},
  methods: {
    async getConfig () {
      await Promise.all([
        this.getListPointStop(),
        this.getListStation(),
        this.getAllFormula()
      ])
      await this.getConfigById()
    },
    getListPointStop: async function () {
      try {
        const res = await SalaryServicePkbus.getListStopPointByUser()
        this.listStopPoint = res.data.data
        commonHelper.showMessage('Lấy danh sách điểm dừng thành công', 'success')
      } catch (err) {
        console.log(err)
        commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách điểm dừng. Vui lòng thử lại sau', 'warning')
      }
    },
    getAllFormula: async function () {
      try {
        const res = await SalaryService.getAllFormulaCod()
        this.listFormula = res.data
        commonHelper.showMessage('Lấy danh sách công thức lương thành công', 'success')
      } catch (err) {
        console.log(err)
        commonHelper.showMessage('Có lỗi xảy ra khi lấy công thức lương. Vui lòng thử lại sau', 'warning')
      }
    },
    getListStation: async function () {
      try {
        const res = await stationService.getAllStationByProvinceIds()
        this.listStation = res.data.data
        commonHelper.showMessage('Lấy danh sách kho thành công', 'success')
      } catch (err) {
        console.log(err)
        commonHelper.showMessage('Có lỗi xảy ra khi lấy danh sách kho. Vui lòng thử lại sau', 'warning')
      }
    },
    getConfigById () {
      let params = {
        'configId': this.$route.query.config_id
      }
      SalaryServicePkbus.getConfigByConfigId(params)
        .then((res) => {
          if (res.data.success) {
            let data = res.data.data
            this.startDate = data.start_date
            this.statusConfig = data.status_config
            this.objectId = data.object_id
            if (this.statusConfig === 1) {
              let today = new Date()
              let date = (today.getFullYear()) + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1)
              this.startDate = date
            }
            if (data.object_type === '2') {
              this.username = data.username
              this.objectType = {'name': 'Theo người dùng', 'value': 2}
            } else {
              this.station = this.listStation.find((option) => option.id === data.object_id)
              this.formula = this.listFormula.find((option) => option.code === Number(data.formula))
              this.objectType = {'name': 'Theo kho', 'value': 1}
            }
            let listShift = data.config
            for (let i = 0; i < listShift.length; i++) {
              let time = listShift[i].times
              this.listConfig.push({
                start: time.start,
                late: time.late,
                end: time.end,
                pointDetails: this.searchData(listShift[i].point_id)
              })
            }
            this.numberReturn = this.listConfig.length
            this.dataBefore = JSON.parse(JSON.stringify(this.listConfig))
            this.dateBefore = data.start_date
            return commonHelper.showMessage('Lấy dữ liệu thành công', 'success')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    Config: function () {
      if (this.type === 'update' && JSON.stringify(this.listConfig) === JSON.stringify(this.dataBefore) && this.startDate === this.dateBefore) {
        return commonHelper.showMessage('Vui lòng nhập thay đổi', 'warning')
      }
      if (this.idTimeErr !== -1) {
        if (this.idTimeErr.slice(-1) !== '0') {
          document.getElementById(this.idTimeErr).style.borderColor = 'rgba(24, 28, 33, 0.1)'
          document.getElementById(this.idTimeErr + '2').style.borderColor = 'rgba(24, 28, 33, 0.1)'
        } else {
          document.getElementById(this.idTimeErr).parentElement.style.setProperty('border-color', 'rgba(24, 28, 33, 0.1)', 'important')
        }
      }
      this.isDone = 0
      this.isLoading = true
      let dataSend = {
        start_date: this.startDate,
        formula: this.formula.code ? this.formula.code : null,
        object_type: this.objectType.value,
        numberReturn: this.numberReturn,
        config: this.listConfig,
        type: this.type
      }
      if (this.objectType.value === 2) {
        dataSend.username = this.username
      } else {
        dataSend.object_id = this.station.id
      }
      if (this.type === 'update') {
        dataSend.config_id = this.$route.query.config_id
      }

      SalaryServicePkbus.createConfigCheckinV3(dataSend)
        .then((response) => {
          if (response.data.success) {
            let data = response.data.data
            this.isDone = 2
            commonHelper.showMessage(response.data.message, 'success')
            let queryData = {
              object_type: data.object_type,
              object_id: data.object_id
            }
            if (Number(data.object_type) === 1) {
              queryData.formula = data.formula
            }
            this.$router.push({path: '/salary/manage-checkin-cod', query: queryData})
          } else {
            this.isDone = 1
            if (typeof response.data.data !== 'undefined') {
              this.idTimeErr = response.data.data
              if (this.idTimeErr.slice(-1) !== '0') {
                document.getElementById(response.data.data).style.borderColor = 'red'
                document.getElementById(response.data.data + '2').style.borderColor = 'red'
              } else {
                document.getElementById(this.idTimeErr).parentElement.style.setProperty('border-color', 'red', 'important')
              }
            }
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
        .catch(() => {
          commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
        })
        .then(() => {
          this.isLoading = false
        })
    },
    changeNumberReturnPostOffices () {
      if (this.numberReturn > 9) {
        this.numberReturn = 9
        return commonHelper.showMessage('Giới hạn tối đa 9 lần về bưu cục', 'warning')
      }
      let nR = Number(this.numberReturn)
      let nShift = this.listConfig.length
      if (nR < nShift) {
        this.listConfig.splice(nR, nShift - nR)
      } else if (nR !== nShift) {
        for (let i = nShift; i < this.numberReturn; i++) {
          this.listConfig.push({
            start: null,
            late: null,
            end: null,
            pointDetails: []})
        }
      }
    },
    searchData (data) {
      let arr = this.listStopPoint.filter((stopPoint) => stopPoint.id === data)
      return arr[0]
    }
  }
}
</script>
