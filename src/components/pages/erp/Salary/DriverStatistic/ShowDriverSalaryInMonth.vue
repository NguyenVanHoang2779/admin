<template>
  <div>
    <b-card class="mb-1" no-body>
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          <b>I. Lịch sử làm việc</b>
        </a>
      </b-card-header>
      <b-card-body>
        <div class="form-row">
          <div class="col-md-3 mb-1"></div>
          <div class="col-md-3 mb-1">
            <label class="form-label">Chọn tháng xuất lương</label>
            <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>
          </div>
          <div class="col-md-3 col-xl-3 mb-3">
            <label class="form-label d-none d-md-block">&nbsp;</label>
            <ladda-btn :loading="one.loadingButton" @click.native="getDriverSalary" data-style="expand-right"
                        class="btn btn-primary" style="width: 100%">
              Tìm Kiếm
            </ladda-btn>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <b-modal modal-class="modal-xxl" id="modal-1" title="Thông tin phiên:" hide-footer :header-bg-variant="'success'">
      <ShowDriverSessionData :sessionId="parseInt(sessionId)" :driverId="this.$route.query.driver_id"/>
    </b-modal>
    <b-card class="mb-1" no-body v-if="this.month && this.year">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          <h3 class="cm-underlined">Tháng {{this.month+'/'+this.year}}</h3>
        </a>
      </b-card-header>
      <b-card-body>
        <h5>{{one.errorMessage}}</h5>
        <div class="row" v-if="driverSalary">
          <b-card class="col-md-5" :style="{fontSize: '16px'}">
            <div>
              <div class="row">
                <label class="w-50" ><b>Tổng lương trong tháng:</b></label>
                <label class="w-50"><b>{{Math.floor(driverSalary.total_salary).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</b></label>
              </div>
            </div>

            <div>
              <div class="row">
                <label class="w-50"><b>Lương cứng:</b></label>
                <label class="w-50"><b>{{driverSalary.fix_salary ? Math.floor(driverSalary.fix_salary.employee_time + driverSalary.fix_salary.probationary_time).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") : 0}}{{' VNĐ'}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Tổng Km:</label>
                <label class="w-50 "><b>{{driverSalary.total_distance+ ' km'}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Tổng điểm:</label>
                <label class="w-50 "><b>{{driverSalary.total_points}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Công thường:</label>
                <label class="w-50 "><b>{{driverSalary.timesheet ? driverSalary.timesheet.count_normal_round_robin : '0'}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Số ngày đi làm:</label>
                <label class="w-50 "><b>{{driverSalary.count_work_date}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Số ngày làm đêm:</label>
                <label class="w-50 "><b>{{driverSalary.allowance_part_time ? driverSalary.allowance_part_time.allowance_time : 0}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Điểm TB/ngày:</label>
                <label class="w-50 "><b>{{driverSalary.points_per_date}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Km TB/ngày:</label>
                <label class="w-50 "><b>{{driverSalary.distance_per_date}}</b></label>
              </div>
            </div>

            <div>
              <div class="row">
                <label class="w-50 "><b>Lương sản lượng:</b></label>
                <label class="w-50 "><b>{{Math.floor(driverSalary.pro_salary).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Tổng sản lượng:</label>
                <label class="w-50 "><b>{{driverSalary.count_packages+' ĐH'}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Toàn trình:</label>
                <label class="w-50 "><b>{{driverSalary.quality_quota+" %"}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Thưởng sản lượng:</label>
                <label class="w-50 "><b>{{Math.floor(driverSalary.quality_reward_packages) + ' ĐH'}}</b></label>
              </div>
            </div>

            <div>
              <div class="row">
                <label class="w-50 "><b>Lương tăng ca:</b></label>
                <label class="w-50"><b>{{driverSalary.over_time_salary ? Math.floor(driverSalary.over_time_salary.employee_time + driverSalary.over_time_salary.probationary_time).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") : 0}}{{' VNĐ'}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Công tăng ca:</label>
                <label class="w-50"><b>{{driverSalary.timesheet ? driverSalary.timesheet.count_ot_kpi_workshift : 0}}</b></label>
              </div>
            </div>

            <div>
              <div class="row">
                <label class="w-50 "><b>Lương lễ:</b></label>
                <label class="w-50"><b>{{Math.floor(driverSalary.holiday_salary).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</b></label>
              </div>
              <div class="row">
                <label class="w-50 ">Công lễ:</label>
                <label class="w-50"><b>{{driverSalary.timesheet ? driverSalary.timesheet.holiday : 0}}</b></label>
              </div>
            </div>

            <div>
              <div class="row">
                <label class="w-50 "><b>Lương cấp bậc:</b></label>
                <label class="w-50"><b>{{Math.floor(driverSalary.ranking_salary).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</b></label>
              </div>
            </div>
          </b-card>

          <b-card class="col-md-7">

            <div v-for="(value, key ,index) in listDriverSessionByDay" :key="index">
              <b-card class="mb-1" no-body>
                <b-card-header>
                  <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle="(index+1).toString()">
                    {{key}}
                    <div class="collapse-icon"></div>
                  </a>
                </b-card-header>
                <b-collapse :id="(index+1).toString()" :accordion="(index+1).toString()">
                    <b-card-body>
                      <div v-if="value.length <= 0">
                        Không có dữ liệu công việc
                      </div>
                      <div v-else>
                        <b-card v-for="(dataSession, index) in value" :key="index">
                          <label><b>{{'Ca '+(index+1)}}</b></label>
                          <div>
                            <div class="row">
                              <label :style="{width: '25%'}">Mã phiên:</label>
                              <b>{{dataSession.ss_id}}</b>
                            </div>
                            <div class="row">
                              <label :style="{width: '25%'}">Tổng Km:</label>
                              <b>{{dataSession.distance/1000 + " km"}}</b>
                            </div>
                            <div class="row">
                              <label :style="{width: '25%'}">Tổng điểm:</label>
                              <b>{{dataSession.count_points + " điểm"}}</b>
                            </div>
                            <div class="row">
                              <label :style="{width: '25%'}">Tổng Sản lượng:</label>
                              <b>{{dataSession.count_packages+" đơn"}}</b>
                            </div>
                            <b-button variant="success" class="float-right" v-b-modal.modal-1 @click="showPopup = !showPopup; sessionId=dataSession.ss_id; $bvModal.show('modal-1')" >Xem chi tiết</b-button>
                          </div>
                        </b-card>
                      </div>
                    </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </b-card>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import VueMonthlyPicker from 'vue-monthly-picker'
import driverSessionService from 'domain/services/driver-session-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import ShowDriverSessionData from './ShowDriverSessionData'
import moment from 'moment'

export default {
  components: {
    VueMonthlyPicker,
    LaddaBtn,
    ShowDriverSessionData
  },
  data: () => ({
    one: {
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      errorMessage: ''
    },
    driverSalary: null,
    listDriverSessionByDay: [],
    showPopup: true,
    sessionId: '',
    month: '',
    year: ''
  }),
  methods: {
    getDriverSalary: function () {
      this.one.loadingButton = true
      let parameters = this.$route.query
      let driverId = parameters.driver_id
      let timeSelect = moment(this.one.selectedMonth).format('YYYY/MM')
      let str = timeSelect.split('/')
      this.month = str[1]
      this.year = str[0]

      let data = {
        'driverId': driverId,
        'month': this.month,
        'year': this.year
      }
      driverSessionService.getDriverSalaryInMonth(data).then(res => {
        if (res.data.success) {
          this.one.errorMessage = ''
          this.driverSalary = res.data.data
          this.listDriverSessionByDay = this.driverSalary.listSessionByDays
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          this.one.errorMessage = res.data.message
          this.driverSalary = null
          this.listDriverSessionByDay = []
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
        .then(() => {
          this.one.loadingButton = false
        })
    }
  }
}
</script>
