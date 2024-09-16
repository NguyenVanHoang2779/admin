<template>
    <div class="work-schedule-config">
        <div class="ui-block">
            <h4 class="ui-block-heading" style="display: inline-flex">Cấu hình lịch làm việc cho COD</h4>
            <a href="https://gdrives.ghtk.co/s/sZ6PaMs7Gngprbp" target="_blank" class="float-right"><b-btn size="sm" variant="outline-danger">Hướng dẫn sử dụng</b-btn></a>
        </div>
        <div class="mt-2">
          <b-row>
            <b-col md="2">
              <single-select-region @keyup.enter="getConfig()" :region="region" @handleSelectedRegion="handleSelectedRegion"></single-select-region>
            </b-col>
            <b-col md="2">
              <single-select-province @keyup.enter="getConfig()" :custom-class="''" :provinceId="provinceId" @handleSelectedProvince="handleSelectedProvince"></single-select-province>
            </b-col>
            <b-col md="2">
              <single-select-station @keyup.enter="getConfig()" :custom-class="''" :provinceId="provinceId" :stationId="userInfo && userInfo.hasOwnProperty('Station') ? userInfo.Station.id : null" @handleSelectedStation="handleSelectedStation"></single-select-station>
            </b-col>
            <b-col md="2">
              <b-form-select v-model="codType" :options="codTypeOptions" class="only-bottom-border" @change="getAmountHumanOfStation(), getConfig()">
              </b-form-select>
            </b-col>
            <b-col md="2">
              <vue-monthly-picker v-model="selectedMonth"></vue-monthly-picker>
            </b-col>
            <b-col class="text-right">
              <b-button class="btn btn-primary" @click="getConfig()">Xem config</b-button>
            </b-col>
          </b-row>
          <div class="d-flex mt-2 py-3 wrap-info-station">
            <div class="wrap-amount" v-for="amount in amountHumanOld"><strong>{{amount.name}}: </strong><span :class="amount.is_total ? 'badge-success amount-cod' : 'bg-secondary amount-cod'">{{amount.amount}}</span></div>
            <b-btn size="sm" variant="success" v-if="!isCopy && this.checkInRangeTimeConfig()" @click="copyConfig">Sao chép config tháng trước</b-btn>
            <b-btn size="sm" variant="success" v-if="isCopy && this.checkInRangeTimeConfig()" disabled @click="copyConfig">Đang sao chép config</b-btn>
          </div>
          <div class="d-flex mt-2 py-3 wrap-info-station">
            <div class="wrap-amount" v-for="amount in amountHumanNew"><strong>{{amount.name}}: </strong><span :class="amount.is_total ? 'badge-success amount-cod' : 'bg-secondary amount-cod'">{{amount.amount}}</span></div>
            <b-btn size="sm" variant="success" @click="createScheduleForNewUser">Tạo lịch cho cod mới</b-btn>
          </div>
        </div>
      <div class="mb-3">
        <div class="wrapper-list-shop-vote" v-loading="isLoadingConfig">
            <table class="table table-hover table-bordered table-vertical" v-for="(week, weekIndex) in configs">
                <thead class="thead-dark">
                <tr>
                  <th>Tuần
                    <div class="dropdown">
                      <i class="ion ion-md-copy cursor-pointer dropbtn"></i>
                      <div class="dropdown-content">
                        <a href="#" v-for="(weekLite, weekLiteIndex) in configs" v-if="weekLiteIndex !== weekIndex" @click="duplicateConfig(weekIndex, weekLiteIndex)">
                          Coppy config cho tuần {{weekLiteIndex + 1}}
                        </a>
                      </div>
                    </div>
                  </th>
                  <th>Ngày</th>
                  <th>% Sáng</th>
                  <th>SL sáng</th>
                  <th>% Chiều</th>
                  <th>SL chiều</th>
                  <th>% Tối</th>
                  <th>SL tối</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(data, dateIndex) in week" :key="'date' + dateIndex" :class="(dateIndex+1) % 7 ? '' : 'text-danger'">
                  <td>{{ weekIndex + 1 }}</td>
                  <td>{{ data.day_vn }}</td>
                  <td>
                    <input
                            type="number"
                            v-model="data.shift_morning"
                            @input="verifyData($event, weekIndex, dateIndex, 'shift_morning'), calcuAmountByPercent($event, weekIndex, dateIndex, 'shift_morning')"
                            min="0" max="100"
                            class="form-control d-inline-block text-center"
                    />
                  </td>
                  <td>
                    <input
                            type="number"
                            min="0" max="100"
                            v-model="data.amount_morning"
                            class="form-control d-inline-block text-center"
                            @input="calcuPercentByAmount($event, weekIndex, dateIndex, 'amount_morning')"
                    />
                  </td>
                  <td>
                    <input
                            type="number"
                            min="0" max="100"
                            v-model="data.shift_afternoon"
                            @input="verifyData($event, weekIndex, dateIndex, 'shift_afternoon'), calcuAmountByPercent($event, weekIndex, dateIndex, 'shift_afternoon')"
                            class="form-control d-inline-block text-center"
                    />
                  </td>
                  <td>
                    <input
                            type="number"
                            min="0" max="100"
                            v-model="data.amount_afternoon"
                            class="form-control d-inline-block text-center"
                            @input="calcuPercentByAmount($event, weekIndex, dateIndex, 'amount_afternoon')"
                    />
                  </td>
                  <td>
                    <input
                            type="number"
                            min="0" max="100"
                            v-model="data.shift_evening"
                            @input="verifyData($event, weekIndex, dateIndex, 'shift_evening'), calcuAmountByPercent($event, weekIndex, dateIndex, 'shift_evening')"
                            class="form-control d-inline-block text-center"
                    />
                  </td>
                  <td>
                    <input
                            type="number"
                            min="0" max="100"
                            v-model="data.amount_evening"
                            class="form-control d-inline-block text-center"
                            @input="calcuPercentByAmount($event, weekIndex, dateIndex, 'amount_evening')"
                    />
                  </td>
                </tr>
                </tbody>
              </table>
        </div>
        <div class="text-center mt-3">
          <b-btn v-if="!isSavingConfig" variant="success" class="buttonSave" @click="saveConfig">Lưu config</b-btn>
          <b-btn v-if="isSavingConfig" variant="success" class="buttonSave" >Đang lưu config lịch<i class="fa fa-spin fa-spinner ml-3"></i></b-btn>
          <b-btn v-if="this.checkInRangeTimeConfig() && !isCreatingSchedule" variant="success" class="buttonSave" @click="createWorkSchedule">
          <span>Tạo lịch làm việc</span>
          </b-btn>
          <b-btn v-if="isCreatingSchedule" variant="success" class="buttonSave" >Đang tạo lịch làm việc<i class="fa fa-spin fa-spinner ml-3"></i></b-btn>
        </div>
      </div>
    </div>
</template>

<script>
import SingleSelectRegion from 'components/elements/common/SingleSelectRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import VueMonthlyPicker from 'vue-monthly-picker'
import workScheduleService from 'domain/services/work-schedule-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import moment from 'moment'
import { mapGetters } from 'vuex'
import CommonEntity from 'domain/entities/CommonEntity'

export default {
  name: 'WorkScheduleConfig',
  components: {
    SingleSelectRegion,
    SingleSelectProvince,
    SingleSelectStation,
    VueMonthlyPicker,
    LaddaBtn
  },
  data: () => ({
    region: null,
    provinceId: null,
    stationId: null,
    has_config: false,
    has_schedule: false,
    start_date_can_config: null,
    end_date_can_config: null,
    selectedMonth: moment(new Date()).format('YYYY-MM'),
    isLoadingConfig: false,
    configs: [],
    amountHumanOld: [],
    amountHumanNew: [],
    permissions: {
      view: false,
      edit: false,
      edit_min_max: false
    },
    codTypeOptions: [
      {value: 'delivery', text: 'COD giao'},
      {value: 'pick', text: 'COD lấy'},
      {value: 'return', text: 'COD trả'},
      {value: 'xteam', text: 'COD XTEAM'},
      {value: 'pkxteam', text: 'PK XTEAM'}
    ],
    codType: 'delivery',
    isSavingConfig: false,
    isCreatingSchedule: false,
    isCopy: false
  }),

  created () {
    this.checkCanRedirect()
  },

  watch: {
    selectedMonth: function (newValue, oldValue) {
      this.getConfig()
      this.getAmountHumanOfStation()
    }
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),

    amountFulltime () {
      let amount = 0
      this.amountHumanOld.forEach((value) => {
        if (value.name === 'Full-time') amount = value.amount
      })
      return amount
    }
  },

  methods: {
    checkInRangeTimeConfig () {
      let q = new Date()
      let m = q.getMonth()
      let d = q.getDate()
      let y = q.getFullYear()
      let currDate = new Date(y, m, d, 7, 0, 0)
      let startDateCanConfig = new Date(this.start_date_can_config)
      let endDateCanConfig = new Date(this.end_date_can_config)
      if (currDate.getTime() < startDateCanConfig.getTime() || currDate.getTime() > endDateCanConfig) {
        return false
      } else {
        return true
      }
    },
    handleSelectedRegion: function (option) {
      this.region = option ? option.id : null
    },
    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : null
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : null
    },

    duplicateConfig (originConfig, desConfig) {
      this.configs[desConfig].forEach((value, index) => {
        value.amount_afternoon = this.configs[originConfig][index].amount_afternoon
        value.amount_evening = this.configs[originConfig][index].amount_evening
        value.amount_morning = this.configs[originConfig][index].amount_morning
        value.shift_afternoon = this.configs[originConfig][index].shift_afternoon
        value.shift_evening = this.configs[originConfig][index].shift_evening
        value.shift_morning = this.configs[originConfig][index].shift_morning
      }, this)
    },

    async getPermissions () {
      this.isLoadingConfig = true
      let dataSend = {
        station_id: this.stationId
      }
      try {
        const response = await workScheduleService.getPermissions(dataSend)
        if (response.data.success) {
          this.permissions = response.data.data
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      } catch (error) {
        console.log(error)
        commonHelper.showMessage('Có lỗi xảy ra khi lấy thông tin quyền config', 'warning')
      }
      this.isLoadingConfig = false
    },

    async getAmountHumanOfStation () {
      let params = {
        station_id: this.stationId,
        cod_type: this.codType,
        month: moment(new Date(this.selectedMonth)).format('YYYY-MM')
      }
      try {
        const response = await workScheduleService.getAmountHumanOfStation(params)
        this.amountHumanOld = response.data.data['old']
        this.amountHumanNew = response.data.data['new']
      } catch (error) {
        console.log(error)
        commonHelper.showMessage('Có lỗi xảy ra khi lấy thông tin quyền config', 'warning')
      }
    },

    async getConfig () {
      await this.getPermissions()
      if (!this.permissions.view) {
        this.configs = []
        this.has_config = false
        this.has_schedule = false
        this.start_date_can_config = null
        this.end_date_can_config = null
        return commonHelper.showMessage('Không có quyền xem config', 'warning')
      }
      this.isLoadingConfig = true
      let dataSend = {
        month: moment(new Date(this.selectedMonth)).format('YYYY-MM'),
        cod_type: this.codType,
        station_id: this.stationId
      }
      workScheduleService.getConfigByMonth(dataSend).then(response => {
        if (response.data.success) {
          this.configs = response.data.data['config']
          this.has_config = response.data.data['has_config']
          this.has_schedule = response.data.data['has_schedule']
          this.start_date_can_config = response.data.data['start_date_can_config']
          this.end_date_can_config = response.data.data['end_date_can_config']
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch((error) => {
        console.log(error)
        commonHelper.showMessage('Có lỗi xảy ra', 'warning')
      }).then(() => {
        this.isLoadingConfig = false
      })
    },

    saveConfig () {
      if (!this.checkInRangeTimeConfig()) {
        commonHelper.showMessage('Không nằm trong khoảng thời gian config lịch. Thời gian config từ ' + this.start_date_can_config + ' đến ' + this.end_date_can_config)
        return
      }
      if (this.has_config) {
        if (!confirm(`Bạn có chắc chắn muốn lưu config này. Hãy tạo lại lịch làm việc cho cod sau khi tạo config thành công nhé!`)) {
          return
        }
      }
      for (let i = 0; i < this.configs.length; i++) {
        for (let j = 0; j < 7; j++) {
          if (!this.validateDataDate(this.configs[i][j].shift_morning, i, j, 'shift_morning') ||
                  !this.validateDataDate(this.configs[i][j].shift_afternoon, i, j, 'shift_afternoon') ||
                  !this.validateDataDate(this.configs[i][j].shift_evening, i, j, 'shift_evening')) {
            commonHelper.showMessage('Dữ liệu nhập vào không đúng khoảng min - max cho phép!', 'warning')
            return
          }
        }
      }
      let dataSend = {
        station_id: this.stationId,
        cod_type: this.codType,
        month: moment(new Date(this.selectedMonth)).format('YYYY-MM'),
        data: this.configs
      }
      this.isSavingConfig = true
      workScheduleService.updateConfig(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(`Cập nhật cấu hình  thành công`, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch((error) => {
        console.log(error)
        commonHelper.showMessage('Có lỗi xảy ra', 'warning')
      }).finally(() => {
        this.isSavingConfig = false
      })
    },
    createScheduleForNewUser () {
      let dataSend = {
        station_id: this.stationId,
        cod_type: this.codType,
        month: moment(new Date(this.selectedMonth)).format('YYYY-MM'),
        amount_full: this.amountFulltime
      }
      workScheduleService.createScheduleForNewUser(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.getAmountHumanOfStation()
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch((error) => {
        console.log(error)
        commonHelper.showMessage('Có lỗi xảy ra', 'warning')
      })
    },

    createWorkSchedule () {
      this.isCreatingSchedule = true
      let dataSend = {
        station_id: this.stationId,
        cod_type: this.codType,
        month: moment(new Date(this.selectedMonth)).format('YYYY-MM'),
        amount_full: this.amountFulltime
      }
      workScheduleService.createWorkSchedule(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch((error) => {
        console.log(error)
        commonHelper.showMessage('Có lỗi xảy ra', 'warning')
      }).finally(() => {
        this.isCreatingSchedule = false
      })
    },

    copyConfig () {
      let dataSend = {
        station_id: this.stationId,
        cod_type: this.codType,
        month: moment(new Date(this.selectedMonth)).format('MM'),
        year: moment(new Date(this.selectedMonth)).format('YYYY'),
        amount_full: this.amountFulltime
      }
      this.isCopy = true
      workScheduleService.copyConfig(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.getConfig()
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).catch((error) => {
        console.log(error)
        commonHelper.showMessage('Có lỗi xảy ra', 'warning')
      }).then(() => {
        this.isCopy = false
      })
    },

    calcuAmountByPercent (event, weekIndex, dateIndex, shift) {
      let amount = ''
      if (shift === 'shift_morning') {
        amount = 'amount_morning'
      } else if (shift === 'shift_afternoon') {
        amount = 'amount_afternoon'
      } else {
        amount = 'amount_evening'
      }
      this.configs[weekIndex][dateIndex][amount] = Math.ceil(event.target.value * this.amountFulltime / 100)
    },

    calcuPercentByAmount (event, weekIndex, dateIndex, amount) {
      let shift = ''
      if (amount === 'amount_morning') {
        shift = 'shift_morning'
      } else if (amount === 'amount_afternoon') {
        shift = 'shift_afternoon'
      } else {
        shift = 'shift_evening'
      }
      this.configs[weekIndex][dateIndex][shift] = Math.ceil(event.target.value / this.amountFulltime * 100)
    },

    verifyData (event, weekIndex, dateIndex, shift) {
      if (!this.validateDataDate(event.target.value, weekIndex, dateIndex, shift)) {
        commonHelper.showMessage('Dữ liệu nhập vào không đúng khoảng min - max cho phép!', 'warning')
      }
    },

    validateDataDate (value, weekIndex, dateIndex, shift) {
      let currentDateData = this.configs[weekIndex][dateIndex]
      if (parseInt(value) > 100 || isNaN(parseInt(value))) {
        return false
      }
      let suffix = ''
      if (shift === 'shift_morning') {
        suffix = '_morning'
      } else if (shift === 'shift_afternoon') {
        suffix = '_afternoon'
      } else {
        suffix = '_evening'
      }
      let minShift = 'min' + suffix
      let maxShift = 'max' + suffix

      if (parseInt(currentDateData[shift]) < parseInt(currentDateData[minShift]) || parseInt(currentDateData[shift]) > parseInt(currentDateData[maxShift])) {
        return false
      }

      return true
    },

    async checkCanRedirect () {
      try {
        let result = await workScheduleService.checkCanRedirect({
          'config_alias': 'redirect_manage_work_schedule'
        })
        if (result.data && result.data.success === true) {
          location.href = CommonEntity.KPI_BASE_URL + window.location.pathname
        } else {
          await this.getConfig()
          await this.getAmountHumanOfStation()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .buttonSave {
    width: 30%;
  }
  .ui-block {
    border-bottom: 1px solid #eeeeee;
  }
  .amount-cod {
    padding: 2px 8px;
    color: white;
    border-radius: 4px;
  }
  .wrap-amount {
    margin-right: 30px;
  }
  .wrap-info-station {
    padding: 10px 0px;
    border-bottom: 1px solid #eeeeee;
    border-top: 1px solid #eeeeee;
  }
  .work-schedule-config {
    table {
      tr {
        th, td {
          text-align: center;
          vertical-align : middle;
        }
      }
      input {
        border: none;
        outline: none;
        height: 2rem;
        background: transparent;
        border-bottom: 1px #ccc solid;
        width: 5rem;
      }
    }
  }

  .week-header {
    display: flex;
    margin-bottom: 5px;

    &__item {
      &-action {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .dropbtn {
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    background: transparent;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 240px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-content a:hover {background-color: #f1f1f1}

  .dropdown:hover .dropdown-content {
    display: block;
  }
</style>
