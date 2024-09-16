<template>
    <div class="work-schedule-manage">
        <div class="ui-block">
            <h4 class="ui-block-heading" style="display: inline-flex">Màn hình quản lý lịch làm việc</h4>
            <div class="d-inline-block">
                <b-button
                        :class="viewType === 'date' ? 'active' : ''" class="custom-button"
                        variant="outline-primary"
                        @click="changeView('date')"
                >
                Xem theo ngày
                </b-button>
                <b-button
                        :class="viewType === 'cod' ? 'active' : ''" class="custom-button"
                        variant="outline-primary"
                        @click="changeView('cod')"
                >
                    Xem theo cod
                </b-button>
            </div>
            <a href="https://gdrives.ghtk.co/s/sZ6PaMs7Gngprbp" target="_blank" class="float-right"><b-btn size="sm" variant="outline-danger">Hướng dẫn sử dụng</b-btn></a>
        </div>
        <div class="mt-2 text-danger">
          <p>**Ghi chú: Yêu cầu config lịch làm việc trước ngày chủ nhật của tuần trước tuần cần config. Vui lòng chọn tuần để config. **</p>
          <p>Config lịch đúng</p>
          <ul>
            <li>Cod fulltime và parttime đủ 6 ngày đi làm + 1 ngày nghỉ trong tuần</li>
            <li>Cod parttime chủ nhật chỉ đi làm chủ nhật</li>
          </ul>
          <p>Config tăng ca/xoay ca</p>
          <ul>
            <li>Hạn config tăng ca/xoay ca ngày N là trước 23h ngày N-1</li>
            <li>Ngày config tăng ca/xoay ca phải là lịch nghỉ của Cod</li>
          </ul>
          <b-btn v-b-modal.rule-ot size="sm" variant="success">RULE DUYỆT TĂNG CA</b-btn>
          <b-modal size="lg" id="rule-ot" centered title="Duyệt công tăng ca">
            <p class="my-4 text-danger"><span>***** LƯU Ý:</span>Chỉ được chấm tăng vào ngày có lịch nghỉ. Công tăng ca chỉ duyệt tự động nếu đi làm đủ 6 ngày trên tuần trừ tuần có lễ, tết và hôm đó có hóa đơn nằm trong khoảng thời gian checkin. Hệ thống sẽ setup duyệt vào cuối mỗi tuần, quét cả tuần đủ điều kiện mới duyệt.</p>
            <ul>
              <li>Trường hợp làm không đủ 6 ngày, công OT hợp lệ là chấm vào ngày nghỉ, có hóa đơn sẽ được tự động chuyển sang xoay ca</li>
              <li>Trường hợp làm đủ 6 ngày nhưng thời gian chốt ca nằm ngoài thời gian checkin=> không hợp lệ, hệ thống hủy duyệt, chủ động liên hệ BĐH HR để giải trình và duyệt</li>
              <li>Trường hợp là HĐLĐ và tồn tại ngày nghỉ phép trong tuần + có chấm tăng ca vào ngày có lịch nghỉ, hệ thống không duyệt tự động, chủ động liên hệ BĐH HR để duyệt</li>
            </ul>
          </b-modal>
        </div>
        <div class="mt-2">
            <b-row>
<!--                <b-col md="2">-->
<!--                    <single-select-region :is-disabled="permissionAll()" :region="region" @handleSelectedRegion="handleSelectedRegion"></single-select-region>-->
<!--                </b-col>-->
<!--                <b-col md="2">-->
<!--                    <single-select-province :is-disabled="permissionAll()" :custom-class="''" :provinceId="provinceId" @handleSelectedProvince="handleSelectedProvince"></single-select-province>-->
<!--                </b-col>-->
                <b-col md="2">
                    <single-select-station :custom-class="''" :provinceId="provinceId" :stationId="userInfo && userInfo.hasOwnProperty('Station') ? userInfo.Station.id : null" @handleSelectedStation="handleSelectedStation"></single-select-station>
                </b-col>
                <b-col md="2" v-if="viewType === 'date'">
                    <b-form-select v-model="codType" :options="codTypeOptions" class="only-bottom-border" @change="getAmountHumanOfStation(), getSchedule()">
                    </b-form-select>
                </b-col>
                <b-col md="2" v-if="viewType === 'cod'">
                    <input type="text" placeholder="username, Họ tên" v-model="keyword" @keyup.enter="getSchedule()" class="form-control" />
                </b-col>
                <b-col md="2">
                    <vue-monthly-picker v-model="selectedMonth"></vue-monthly-picker>
                </b-col>
                <b-col md="2" v-if="viewType === 'date'">
                    <b-form-select v-model="week" :options="weekOptions" class="only-bottom-border">
                    </b-form-select>
                </b-col>
                <b-col md="2" class="mb-2" v-if="viewType === 'cod'">
                    <v-date-picker mode="range" v-model="range_time" locale="vi" :popover="{visibility: 'focus'}"
                                   color="green"
                                   :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'font-size:14px; line-height: unset' }"
                                   @keyup.enter="getSchedule()"/>
                </b-col>
                <b-col md="4" class="text-right">
                    <b-button class="btn btn-primary" @click="search(); getAmountHumanOfStation();">Tìm kiếm</b-button>
                </b-col>
            </b-row>
            <div class="d-flex mt-2 py-3 wrap-info-station">
                <div class="wrap-amount" v-for="amount in amountHumanOld"><strong>{{amount.name}}: </strong><span :class="amount.is_total ? 'badge-success amount-cod' : 'bg-secondary amount-cod'">{{amount.amount}}</span></div>
            </div>
            <div class="d-flex mt-2 py-3 wrap-info-station">
                <div class="wrap-amount" v-for="amount in amountHumanNew"><strong>{{amount.name}}: </strong><span :class="amount.is_total ? 'badge-success amount-cod' : 'bg-secondary amount-cod'">{{amount.amount}}</span></div>
            </div>
        </div>
        <div v-if="viewType === 'date'">
          <div class="mb-3">
            <div class="wrapper-list-shop-vote" v-loading="isLoadingConfig">
              <div v-if="dataFail.length > 0">
                <table class="table table-hover table-bordered table-vertical">
                  <thead class="thead-dark">
                  <th>Thông tin Cod sai lịch</th>
                  <th>Tuần</th>
                  <th>Lý do config sai</th>
                  </thead>
                  <tbody>
                  <tr  v-for="(item) in dataFail">
                    <td>{{item.fullname}} / {{item.username}}</td>
                    <td>{{item.week}}</td>
                    <td>{{item.reason}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        <div class="mb-3">
            <div class="wrapper-list-shop-vote" v-loading="isLoadingConfig">
                <div v-if="scheduleTmps.length > 0">
                    <table class="table table-hover table-bordered table-vertical">
                        <thead class="thead-dark">
                        <th>Tháng</th>
                        <th>Tuần</th>
                        <th>Ngày</th>
                        <th>Loại lịch</th>
                        <th>Ca Sáng</th>
                        <th>Ca Chiều</th>
                        <th>Ca Tối</th>
                        </thead>
                        <tbody v-for="(schedule, index) in scheduleTmps">
                          <tr>
                            <td rowspan="2">{{schedule.month}}</td>
                            <td rowspan="2">{{schedule.week}}</td>
                            <td rowspan="2">{{schedule.dateFormat}}</td>
                            <td style="font-weight: bold">Công thường</td>
                            <td style="min-width: 200px">
                              <multi-select-user :disabled="isDisabled(schedule.date)" @onChange="selectedMorning($event, index)" :users="schedule.morning" :station-id="userInfo && userInfo.hasOwnProperty('Station') ? stationId : null" :cod-type="codType"></multi-select-user>
                            </td>
                            <td style="min-width: 200px">
                              <multi-select-user :disabled="isDisabled(schedule.date)" @onChange="selectedAfternoon($event, index)" :users="schedule.afternoon" :station-id="userInfo && userInfo.hasOwnProperty('Station') ? stationId : null" :cod-type="codType"></multi-select-user>
                            </td>
                            <td style="min-width: 200px">
                              <multi-select-user :disabled="isDisabled(schedule.date)" @onChange="selectedEvening($event, index)" :users="schedule.evening" :station-id="userInfo && userInfo.hasOwnProperty('Station') ? stationId : null" :cod-type="codType"></multi-select-user>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="1" style="font-weight: bold">Tăng ca/Xoay ca</td>
                            <td colspan="3">
                              <multi-select-user :disabled="isDisabled(schedule.date, 'overtime')" @onChange="selectedOvertime($event, index)" :users="schedule.overtime" :station-id="userInfo && userInfo.hasOwnProperty('Station') ? stationId : null" :cod-type="codType"></multi-select-user>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    Chưa tạo lịch làm việc. <br>
                    Để tạo lịch làm việc vui lòng truy cập vào: <a href="https://admin.giaohangtietkiem.vn/adm/work-schedule/config"> Config lịch làm việc cho cod</a>
                </div>
                <div class="d-flex justify-content-center mt-2 py-3 wrap-info-station">
                  <b-button class="btn btn-success" :disabled="week == null" @click="updateSchedule">Cập nhập lịch của tuần</b-button>
                </div>
            </div>
        </div>
        </div>
        <div v-if="viewType === 'cod'">
            <div class="mb-3">
                <div class="wrapper-list-shop-vote" v-loading="isLoadingConfig">
                    <div v-if="schedulesByCods.length > 0">
                        <table class="table table-hover table-bordered table-vertical">
                            <thead class="thead-dark">
                            <th>Thông tin cod</th>
                            <th>Loại cod</th>
                            <th>Hình thức làm việc</th>
                            <th>Ngày</th>
                            <th>Ca làm việc</th>
                            <th>Thời gian tạo lịch</th>
                            <th>Tăng ca/Xoay ca</th>
                            </thead>
                            <tbody>
                            <tr  v-for="(schedule, index) in schedulesByCods" :key="index">
                                <td>{{schedule.fullname}} - {{schedule.username}}</td>
                                <td>{{schedule.cod_type}}</td>
                                <td>{{schedule.work_type_description}}</td>
                                <td>{{schedule.date}}</td>
                                <td>
                                    <b-btn variant="success" size="sm" v-if="+schedule.work_shift_morning === 1">Ca sáng</b-btn>
                                    <b-btn variant="success" size="sm" v-if="+schedule.work_shift_afternoon === 1">Ca chiều</b-btn>
                                    <b-btn variant="success" size="sm" v-if="+schedule.work_shift_evening === 1">Ca tối</b-btn>
                                </td>
                                <td>
                                    {{schedule.created}}
                                </td>
                                <td>
                                    <b-btn v-if="+schedule.is_work === 1" variant="primary" size="sm">Có</b-btn>
                                    <b-btn v-else variant="secondary" size="sm">Không</b-btn>
                                </td>
<!--                                <td>{{schedule.log}}</td>-->
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        Chưa tạo lịch làm việc. <br>
                        Để tạo lịch làm việc vui lòng truy cập vào: <a href="https://admin.giaohangtietkiem.vn/adm/work-schedule/config"> Config lịch làm việc cho cod</a>
                    </div>
                    <div class="mt-3" v-if="totalPages > 1">
                        <b-row>
                            <b-col md="6">
                                <b-pagination
                                        :total-rows="totalItems"
                                        v-model="currentPage"
                                        :per-page="perPage"
                                        v-on:input="getSchedule"
                                />
                            </b-col>
                            <b-col md="6">
                                <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SingleSelectRegion from 'components/elements/common/SingleSelectRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import VueMonthlyPicker from 'vue-monthly-picker'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import workScheduleService from 'domain/services/work-schedule-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
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
    MultiSelectUser
  },
  data: () => ({
    viewType: 'date',
    keyword: null,
    viewTypeOption: [
      {value: 'date', text: 'Xem theo ngày'},
      {value: 'cod', text: 'Xem theo cod'}
    ],
    range_time: null,
    region: null,
    provinceId: null,
    stationId: null,
    selectedMonth: moment(new Date()).format('YYYY-MM'),
    isLoadingConfig: false,
    schedulesByCods: [],
    schedules: [],
    scheduleTmps: [],
    dataFail: [],
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
    weekOptions: [],
    week: 1,
    codType: 'delivery',
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    disableUpdate: false
  }),

  created () {
    this.checkCanRedirect()
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {},

  methods: {
    changeView (viewType) {
      this.viewType = viewType
      this.getSchedule()
      this.getAmountHumanOfStation()
    },
    updateSchedule () {
      if (!this.week) {
        return commonHelper.showMessage('Vui lòng chuận tuần cần config', 'error')
      }
      let data = {
        schedule: this.scheduleTmps,
        cod_type: this.codType,
        station_id: this.stationId,
        week: this.week,
        month: moment(new Date(this.selectedMonth)).format('MM'),
        year: moment(new Date(this.selectedMonth)).format('YYYY')
      }
      workScheduleService.updateSchedule(data).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          this.getSchedule()
        } else {
          this.dataFail = response.data.data
          commonHelper.showMessage(response.data.message, 'error')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    filterByWeek () {
      this.dataFail = []
      this.scheduleTmps = this.schedules.filter((schedule) => {
        if (this.week) {
          return parseInt(schedule.week) === parseInt(this.week)
        } else {
          return true
        }
      })
    },

    getAmountHumanOfStation () {
      let params = {
        station_id: this.stationId,
        month: moment(new Date(this.selectedMonth)).format('YYYY-MM'),
        cod_type: this.codType,
        view_type: this.viewType
      }
      workScheduleService.getAmountHumanOfStation(params).then(response => {
        if (response.data.success) {
          this.amountHumanOld = response.data.data['old']
          this.amountHumanNew = response.data.data['new']
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getScheduleByCod () {
      this.isLoadingConfig = true
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let dataSend = {
        station_id: this.stationId,
        view_type: this.viewType,
        keyword: this.keyword,
        month: moment(new Date(this.selectedMonth)).format('YYYY-MM'),
        from: timeRange.from || null,
        to: timeRange.to || null,
        page: this.currentPage,
        limit: this.perPage
      }
      workScheduleService.getScheduleByCod(dataSend).then(response => {
        if (response.data.success) {
          this.schedulesByCods = response.data.data.data
          this.totalItems = response.data.data.count
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
    getScheduleByDate () {
      this.isLoadingConfig = true
      let dataSend = {
        week: this.week,
        month: moment(new Date(this.selectedMonth)).format('MM'),
        year: moment(new Date(this.selectedMonth)).format('YYYY'),
        station_id: this.stationId,
        cod_type: this.codType,
        view_type: this.viewType
      }
      workScheduleService.getScheduleByDate(dataSend).then(response => {
        if (response.data.success) {
          this.schedules = response.data.data['result']
          this.scheduleTmps = response.data.data['result']
          this.weekOptions = response.data.data['listWeek']
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
    search () {
      this.currentPage = 1
      this.getSchedule()
    },
    getSchedule () {
      this.dataFail = []
      if (this.viewType === 'date') this.getScheduleByDate()
      if (this.viewType === 'cod') this.getScheduleByCod()
    },
    getStartEndFromTimeRange (rangeTime) {
      return {
        from: moment(rangeTime.start).format('YYYY-MM-DD'),
        to: moment(rangeTime.end).format('YYYY-MM-DD')
      }
    },
    selectedMorning (option, index) {
      this.scheduleTmps[index].morning = option
    },

    selectedAfternoon (option, index) {
      this.scheduleTmps[index].afternoon = option
    },

    selectedEvening (option, index) {
      this.scheduleTmps[index].evening = option
    },

    selectedOvertime (option, index) {
      this.scheduleTmps[index].overtime = option
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
    isDisabled: function (date, type = 'normal') {
      let d = new Date(date)
      if (type === 'overtime' || this.codType === 'xteam') {
        d.setHours(23, 59)
      } else {
        d.setHours(23)
      }
      let now = new Date()
      now.setDate(now.getDate() + 1)
      return d.getTime() <= now.getTime()
    },

    async checkCanRedirect () {
      try {
        let result = await workScheduleService.checkCanRedirect({
          'config_alias': 'redirect_manage_work_schedule'
        })
        if (result.data && result.data.success === true) {
          location.href = CommonEntity.KPI_BASE_URL + window.location.pathname
        } else {
          this.getAmountHumanOfStation()
          this.getSchedule()
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

    .custom-button {
        padding: 3px 12px;
        font-size: 0.9em;
        margin-right: 5px;
        margin-bottom: 5px;
    }
</style>
