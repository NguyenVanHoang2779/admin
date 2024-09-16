<template>
  <div>
    <b-card class="mb-1" no-body>
      <b-card-body>
        <div class="form-row">
          <div class="col-md-2 mb-1"></div>
          <div class="col-md-4 mb-1">
            <label class="form-label">Chọn tháng tổng kết</label>
            <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>
          </div>
          <div class="col-md-2 mb-1">
            <label class="form-label">Chọn Loại tuyến</label>
            <b-form-select v-model="routeType" :options="routeTypeOPtions"></b-form-select>
          </div>
          <div class="col-md-2 col-xl-2 mb-1">
            <label class="form-label d-none d-md-block">&nbsp;</label>
            <ladda-btn :loading="one.loadingButton" @click.native="getDriverSalary" data-style="expand-right"
                        class="btn btn-primary" style="width: 100%">
              Tìm Kiếm
            </ladda-btn>
          </div>
        </div>
      </b-card-body>
    </b-card>
    <b-modal id="modal-1" modal-class="modal-xxl" title="Thông tin phiên:" hide-footer :header-bg-variant="'success'" v-if="!companyId">
      <ShowDriverSessionData :sessionId="parseInt(sessionId)" :driverId="this.$route.query.driver_id"/>
    </b-modal>
    <b-modal id="modal-1" modal-class="modal-xxl" title="Thông tin phiên:" hide-footer :header-bg-variant="'success'" v-if="companyId">
      <ShowDriverSessionData :sessionId="parseInt(sessionId)"/>
    </b-modal>
    <b-card class="mb-1" no-body v-if="this.month && this.year">
      <b-card-header v-if="rentTruckCost">
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          <h3 class="cm-underlined" v-if="driverId && !companyId">Cước tài xế {{rentTruckCost.name}} Tháng {{this.month+'/'+this.year}}</h3>
          <h3 class="cm-underlined" v-if="companyId">Cước công ty {{rentTruckCost.name}} Tháng {{this.month+'/'+this.year}}</h3>
        </a>
      </b-card-header>
      <b-card-body>
        <h5>{{one.errorMessage}}</h5>
        <div class="row" v-if="rentTruckCost">
          <b-card class="col-md-5" :style="{fontSize: '16px'}">
            <div class="row">
              <label class="w-50" ><b>Tổng cước tạm tính:</b></label>
              <label class="w-50"><b>{{Math.floor(rentTruckCost.total_price_rent_truck).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</b></label>
            </div>
            <div class="row">
              <label class="w-50" >Cước Liên miền:</label>
              <label class="w-50">{{Math.floor(rentTruckCost.region_price_rent_truck).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</label>
            </div>
            <div class="row">
              <label class="w-50" >Cước Liên tỉnh:</label>
              <label class="w-50">{{Math.floor(rentTruckCost.province_price_rent_truck).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</label>
            </div>
            <div class="row">
              <label class="w-50" >Cước Nội thành:</label>
              <label class="w-50">{{Math.floor(rentTruckCost.city_price_rent_truck).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</label>
            </div>
            <div class="row">
              <label class="w-50" ><b>Tổng xe chạy:</b></label>
              <b>{{Math.floor(rentTruckCost.total_truck_run) + " Xe"}}</b>
            </div>
            <div class="row">
              <label class="w-50" ><b>Tổng số chuyến:</b></label>
              <b>{{rentTruckCost.total_ss + ' Chuyến'}}</b>
            </div>
            <div class="row">
              <label class="w-50" ><b>Tổng Km:</b></label>
              <b>{{Math.floor(rentTruckCost.total_distance) + " Km"}}</b>
            </div>
          </b-card>

          <b-card class="col-md-7">

            <div v-for="(value, key ,index) in listSessionWithDate" :key="index">
              <b-card class="mb-1" no-body>
                <b-card-header>
                  <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle="(index+1).toString()" @click="getRentTructCostInDate(key)">
                    <b class="w-50">{{key}}</b>
                    <div>{{value.number_truck + ' Xe / ' + value.number_session + ' Chuyến / ' + Math.floor(value.distance) + ' Km'}}</div>
                    <div class="collapse-icon"></div>
                  </a>
                </b-card-header>
                <b-collapse :id="(index+1).toString()" accordion="accordion">
                    <b-card-body>
                      <div v-if="message">
                        {{message}}
                      </div>
                      <div v-else>
                        <div v-for="(dataSessionWithTruck,key, index) in listSessionWithDate[key]['listSession']" :key="index">
                          <label><b>{{key}}</b></label>
                          <b-card v-for="(dataSession, index) in dataSessionWithTruck" :key="index">
                            <div class="row">
                              <div class="col-md-10 mb-1" :style="{'margin' : '0'}">
                                <label class="row" :style="{'color': dataSession.reason ? 'red' : ''}">
                                  <b>
                                  {{'Phiên '+ dataSession.session_number}}
                                  {{dataSession.reason ? '/' : ''}}
                                  {{dataSession.reason == 'mapping_none' ? 'Lộ trình không được tính cước' :
                                      dataSession.reason == 'point_real_none' ? 'Không có điểm phát sinh trong phiên' :
                                      dataSession.reason == 'price_rent_truck_none' ? 'Lộ trình chưa có cước' :
                                      dataSession.reason}}
                                  </b>
                                </label>
                                <div>
                                  <div class="row">
                                    <label class="w-25">Mã phiên:</label>
                                    <div>{{dataSession.ss_id}}</div>
                                  </div>
                                  <div class="row">
                                    <label class="w-25">Tuyến:</label>
                                    <div>{{dataSession.route_name}}</div>
                                  </div>
                                  <div class="row">
                                    <label class="w-25">Tổng Km:</label>
                                    <div>{{Math.floor(dataSession.distance) + " km"}}</div>
                                  </div>
                                  <div class="row">
                                    <label class="w-25">Tổng điểm:</label>
                                    <div>{{dataSession.point_number}}</div>
                                  </div>
                                  <div class="row">
                                    <label class="w-25"><b>Cước tạm tính:</b></label>
                                    <b>{{Math.floor(dataSession.rent_truck).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") +' VNĐ'}}</b>
                                  </div>
                                </div>
                              </div>
                              <div></div>
                              <button :style="{'fontSize':'30px', 'border': 'none', 'outline': 'none', 'background': 'none', 'cursor': 'pointer'}"
                                      class="col-md-2 mb-1 fa fa-angle-right"
                                      @click="showPopup = !showPopup; sessionId=dataSession.ss_id; $bvModal.show('modal-1')" >
                              </button>
                            </div>
                          </b-card>
                        </div>
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
      selectedMonth: moment(new Date(), 'YYYY/MM'),
      errorMessage: ''
    },
    rentTruckCost: null,
    listSessionWithDate: [],
    showPopup: true,
    sessionId: '',
    driverId: '',
    companyId: '',
    month: '',
    year: '',
    routeTypeOPtions: [
      {value: 0, text: 'Tất cả'},
      {value: 5, text: 'Liên miền'},
      {value: 2, text: 'Liên tỉnh'},
      {value: 1, text: 'Nội thành'}
    ],
    routeType: 0,
    message: ''
  }),
  created () {
    let parameters = this.$route.query
    this.driverId = parameters.driver_id
    this.companyId = parameters.company_id
  },
  methods: {
    getDriverSalary () {
      this.one.loadingButton = true
      let timeSelect = moment(this.one.selectedMonth).format('YYYY/MM')
      let str = timeSelect.split('/')
      this.month = str[1]
      this.year = str[0]

      let data = {
        'companyId': this.companyId,
        'driverId': this.driverId,
        'month': this.month,
        'year': this.year,
        'type': this.routeType
      }
      driverSessionService.getRentTructCostInMonth(data).then(res => {
        if (res.data.success) {
          this.one.errorMessage = ''
          this.rentTruckCost = res.data.data
          this.listSessionWithDate = this.rentTruckCost.list_date
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          this.one.errorMessage = res.data.message
          this.rentTruckCost = null
          this.listSessionWithDate = []
          commonHelper.showMessage(res.data.message, 'warning')
        }
      })
        .then(() => {
          this.one.loadingButton = false
        })
    },
    getRentTructCostInDate (date) {
      if (this.listSessionWithDate[date]['listSession']) {
        return
      }
      this.message = 'Đang lấy dữ liệu'
      let data = {
        'companyId': this.companyId,
        'driverId': this.driverId,
        'type': this.routeType,
        'date': moment(date).format('YYYY-MM-DD')
      }
      driverSessionService.getRentTructCostCompanyInDate(data).then(res => {
        if (res.data.success) {
          this.listSessionWithDate[date]['listSession'] = res.data.data.list_session
          this.message = ''
        } else {
          this.listSessionWithDate.date = []
          this.message = res.data.message
        }
      })
    }
  }
}
</script>
