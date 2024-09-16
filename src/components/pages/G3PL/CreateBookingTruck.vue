<template>
  <div>
    <div class="ui-block">
      <h3 class="ui-block-heading text-left">BOOK XE THUÊ</h3>
      <div>
        <b-form>
          <div class="form-filter">
            <h4 class="text-center">THÔNG TIN LỘ TRÌNH</h4>
            <hr>
            <b-form-row>
              <b-col md="8">
                <b-form-group label="Chọn lộ trình">
                  <b-form-radio-group
                    v-model="selected_template"
                    :options="options_template"
                    class="mb-3"
                    value-field="item"
                    text-field="name"
                    disabled-field="notEnabled"
                  ></b-form-radio-group>
                </b-form-group>
              </b-col>
            </b-form-row>
            <div v-if="selected_template === 1">
              <b-form-row>
                <b-col md="8">
                  <b-form-group>
                    <label class="form-label">Tên lộ trình <span class="text-danger">(*)</span></label>
                    <b-form-input
                      type="text"
                      v-model.trim="dataInput.name"
                      placeholder="Nhập tên lộ trình"
                      autocomplete="off"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col md="8">
                  <b-form-group>
                    <label class="form-label">Loại lộ trình <span class="text-danger">(*)</span></label>
                    <b-form-select v-model="dataInput.type_route" :options="options_type_route" />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col md="8">
                  <b-form-group>
                    <label class="form-label">Kho <span class="text-danger">(*)</span></label>
                    <single-select-station-by-type-post-office-and-station
                      @onChange="selectedStationOfTemplate"
                      ref="stationComponent"
                    ></single-select-station-by-type-post-office-and-station>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row v-for="(point, index) in points" :key="index">
                <b-col md="8" v-if="index === 0">
                  <b-form-group>
                    <label class="form-label">Điểm dừng {{ index + 1 }} <span class="text-danger" v-if="flagPoint(index)">(*)</span></label>
                    <single-select-stop-point
                      @onChange="selectedStopPoint"
                      :index="index"
                      ref="stopPointComponent"
                    ></single-select-stop-point>
                  </b-form-group>
                </b-col>
                <b-col md="6" v-else>
                  <b-form-group>
                    <label class="form-label">Điểm dừng {{ index + 1 }} <span class="text-danger" v-if="flagPoint(index)">(*)</span></label>
                    <single-select-stop-point
                      @onChange="selectedStopPoint"
                      :index="index"
                      ref="stopPointComponent"
                    ></single-select-stop-point>
                  </b-form-group>
                </b-col>
                <b-col md="1" v-if="index !== 0">
                  <b-form-group>
                    <label class="form-label">Leadtime <span class="text-danger">(*)</span></label>
                    <b-form-select v-model="point.hour" :options="options_hours"/>
                  </b-form-group>
                </b-col>
                <b-col md="1" v-if="index !== 0">
                  <b-form-group>
                    <label class="form-label">&nbsp;</label>
                    <b-form-select v-model="point.minute" :options="options_minutes"/>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group>
                    <label class="form-label">Giờ hẹn đến <span class="text-danger">(*)</span></label>
                    <b-form-input v-if="index === 0" class="height-38" type="time" v-model="point.time_from"></b-form-input>
                    <b-form-input v-else type="time" class="height-38" v-model="point.time_from" disabled></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="1">
                  <b-form-group>
                    <label class="form-label">&nbsp;</label>
                    <b-form-select v-if="index === 0" v-model="point.time_day" :options="options_time_day"></b-form-select>
                    <b-form-select v-else v-model="point.time_day" :options="options_time_day" disabled></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="1">
                  <b-form-group>
                    <template v-slot:label>&nbsp;</template>
                    <ladda-btn
                      :loading="false"
                      @click.native="deleteThisRow(index)"
                      data-style="expand-right"
                      class="btn btn-md btn-outline-danger"
                      v-if="!flagPoint(index)" >
                      <i class="ion ion-md-trash"></i>
                    </ladda-btn>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <ladda-btn @click.native="addStopPoint" data-style="expand-right" class="btn btn-outline-success add-point">
                +Thêm điểm dừng
              </ladda-btn>
            </div>

            <div v-else>
              <b-form-row>
                <b-col md="8">
                  <b-form-group>
                    <label class="form-label">Tên lộ trình <span class="text-danger">(*)</span></label>
                    <single-select-template-booking @onChange="selectedName" ref="nameComponent"></single-select-template-booking>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col md="8">
                  <b-form-group label-for="label">
                    <label class="form-label">Loại lộ trình</label>
                    <b-form-select v-model="dataInput.type_route" :options="options_type_route" :disabled="true" />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col md="8">
                  <b-form-group>
                    <label class="form-label">Kho</label>
                    <b-form-input type="text" v-model="dataInput.station_name" disabled></b-form-input>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row v-for="(point, index) in pointsCreated" :key="index">
                <b-col md="8">
                  <b-form-group>
                    <label class="form-label">Điển dừng {{ index + 1 }}</label>
                    <b-form-input type="text" v-model="point.name" disabled></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group>
                    <label class="form-label">Giờ hẹn đến</label>
                    <b-form-input class="height-38" type="time" v-model="point.time_from" disabled></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="1">
                  <b-form-group>
                    <label class="form-label">&nbsp;</label>
                    <b-form-select v-model="point.time_day" :options="options_time_day" disabled></b-form-select>
                  </b-form-group>
                </b-col>
              </b-form-row>
            </div>

            <h4 class="text-center mt-5">THÔNG TIN CHUYẾN XE</h4>
            <hr>
            <b-form-row>
              <b-col md="8">
                <b-form-group>
                  <label class="form-label">Loại chuyến <span class="text-danger">(*)</span></label>
                  <single-select-g3-p-l
                    @onChange="selectedTypeTrip"
                    field="type_trip"
                    label-custom="Chọn loại chuyến"
                    ref="typeTripComponent"
                  ></single-select-g3-p-l>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group>
                  <label class="form-label">Thời gian đặt <span class="text-danger">(*)</span></label>
                  <datepicker
                    v-model="dataInput.time_book_from"
                    :bootstrapStyling="true"
                    :format="customFormatter"
                  />
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group>
                  <label class="form-label">Đến <span class="text-danger">(*)</span></label>
                  <datepicker
                    v-model="dataInput.time_book_to"
                    :bootstrapStyling="true"
                    :format="customFormatter"
                    class="to-date"
                  />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="8">
                <b-form-group label-for="station">
                  <label class="form-label">Lí do <span class="text-danger">(*)</span></label>
                  <single-select-g3-p-l
                    @onChange="selectedReasonBooking"
                    field="reason_booking"
                    label-custom="Chọn lí do"
                    ref="reasonBookingComponent"
                  ></single-select-g3-p-l>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row v-if="reason_booking_temp == 'Lí do khác'">
              <b-col md="8">
                <b-form-group>
                  <b-input type="text" placeholder="Nhập lí do" v-model="reasonBookingOther"></b-input>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="8">
                <b-form-group label="Hãng xe">
                  <multi-select-org-company
                    @onChange="selectedTypeOrg"
                    ref="typeOrgComponent"
                  ></multi-select-org-company>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="8">
                <b-form-group label-for="station">
                  <label class="form-label">Trọng tải xe <span class="text-danger">(*)</span></label>
                  <single-select-g3-p-l
                    @onChange="selectedWeight"
                    field="weight"
                    label-custom="Chọn trọng tải"
                    ref="weightComponent"
                  ></single-select-g3-p-l>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-row>
              <b-col md="1">
                <label class="form-label">Người đặt</label>
              </b-col>
              <b-col md="7">
                {{ getUserBooking }}
              </b-col>
            </b-row>
            <div class="text-center">
              <ladda-btn :loading="loadingButton" class="btn btn-success" data-style="expand-right" @click.native="booking">Đặt xe</ladda-btn>
            </div>
          </div>
        </b-form>
      </div>
      <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingTransfer" />
    </div>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import Booking from 'domain/entities/Booking'
import moment from 'moment'
import * as _ from 'lodash'
import SingleSelectStopPoint from 'components/elements/common/SingleSelectStopPoint'
import MultiSelectOrgCompany from 'components/elements/common/MultiSelectOrgCompany'
import SingleSelectG3PL from 'components/elements/common/SingleSelectG3PL'
import SingleSelectTemplateBooking from 'components/elements/common/SingleSelectTemplateBooking'
import SingleSelectStationByTypePostOfficeAndStation from 'components/elements/common/SingleSelectStationByTypePostOfficeAndStation'
import G3PL from 'domain/services/g3pl-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import WebStorage from 'infrastructures/web-storage'

Vue.use(BlockUI)

export default {
  name: 'CreateBookingTruck',
  components: {
    SingleSelectStationByTypePostOfficeAndStation,
    SingleSelectStopPoint,
    MultiSelectOrgCompany,
    SingleSelectG3PL,
    SingleSelectTemplateBooking,
    Datepicker,
    LaddaBtn
  },
  data: () => ({
    errors: [],
    user_book: '',
    reasonBookingOther: '',
    reason_booking_temp: '',
    loadingButton: false,
    selected_template: 1,
    storage: null,
    dataInput: {
      template_id: 0,
      type_trip: '',
      reason_booking: '',
      weight: '',
      station_id: 0,
      station_name: '',
      time_book_from: '',
      time_book_to: '',
      name: '',
      type_route: null,
      created_by: '',
      org_company_ids: [],
      points: {
        ids: [],
        names: [],
        lats: [],
        longs: [],
        time_froms: [],
        time_days: [],
        addresses: [],
        station_ids: []
      }
    },
    points: [
      {
        id: null,
        name: '',
        lat: '',
        long: '',
        time_from: '',
        time_day: 0,
        address: '',
        lead_time: 0,
        hour: 0,
        minute: 0,
        station_id: 0
      },
      {
        id: null,
        name: '',
        lat: '',
        long: '',
        time_from: '',
        time_day: 0,
        address: '',
        lead_time: 0,
        hour: 0,
        minute: 0,
        station_id: 0
      }
    ],
    options_type_route: Booking.optionsTypeRoute,
    options_hours: [],
    options_minutes: [],
    options_time_day: Booking.optionsTimeDay,
    options_template: Booking.optionsTemplate,
    loadingTransfer: false,
    htmlTransfer: `<div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>
        <h5 class="text-center mb-0">LOADING...</h5>`,
    pointsCreated: []
  }),
  methods: {
    initHours () {
      let cacheKey = 'hourOfLeadtime'
      let listCached = this.storage.get(cacheKey)
      if (listCached) {
        this.options_hours = listCached
      } else {
        let hours = []
        for (let i = 0; i <= 96; i++) {
          hours.push({value: i, text: i + ' giờ'})
        }
        this.options_hours = hours
        this.storage.set(cacheKey, this.options_hours)
      }
    },
    initMinutes () {
      let cacheKey = 'minuteOfLeadtime'
      let listCached = this.storage.get(cacheKey)
      if (listCached) {
        this.options_minutes = listCached
      } else {
        let minutes = []
        for (let i = 0; i <= 60; i++) {
          minutes.push({value: i, text: i + ' phút'})
        }
        this.options_minutes = minutes
        this.storage.set(cacheKey, this.options_minutes)
      }
    },
    async booking () {
      this.errors = []
      this.loadingButton = true
      let checkLeadTime = await this.isLeadtimeNull()
      if (checkLeadTime && this.selected_template === 1) {
        commonHelper.showMessage('Tồn tại Leadtime (0 giờ 0 phút) không hợp lệ. Vui lòng chọn giờ hẹn đến của điểm sau phải lớn hơn điểm trước', 'error')
        this.loadingButton = false
        return
      }

      let checkLeadtimeLimit = await this.validateLeadtimeLimit()
      if (checkLeadtimeLimit && this.selected_template === 1) {
        commonHelper.showMessage('Tồn tại Leadtime không hợp lệ. Vui lòng chọn Leadtime không quá 96 giờ', 'error')
        this.loadingButton = false
        return
      }

      await this.asyncDataInput()

      const dataSend = {
        type_route: this.dataInput.type_route,
        stop_point_arr: this.dataInput.points.ids
      }
      await G3PL.validateStopPoint(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success === false) {
            commonHelper.showMessage(response.data.message, 'error')
            this.loadingButton = false
          } else {
            G3PL.booking(this.dataInput)
              .then(response => {
                if (response.data.hasOwnProperty('success')) {
                  this.loadingButton = false
                  if (response.data.success === true) {
                    commonHelper.showMessage('Tạo chuyến thành công', 'success')
                    this.resetForm()
                  } else {
                    commonHelper.showMessage(response.data.message, 'error')
                  }
                }
              }).catch((error) => {
                if (error.response) {
                  let response = error.response
                  if (response.status === 422) {
                    this.errors = response.data && response.data.message ? response.data.message : ''
                    commonHelper.showMessage(this.errors, 'error')
                  }
                }
                this.loadingButton = false
              })
          }
        }
      }).catch((e) => {
        console.log(e)
        this.loadingButton = false
      })
    },
    asyncDataInput () {
      if (_.isEmpty(this.dataInput.org_company_ids)) {
        delete this.dataInput.org_company_ids
      }
      if (this.dataInput.template_id === 0) {
        delete this.dataInput.template_id
      }

      this.dataInput.created_by = this.getUserBooking
      this.dataInput.time_book_to = this.customFormatter(this.dataInput.time_book_to)
      this.dataInput.time_book_from = this.customFormatter(this.dataInput.time_book_from)

      const object = this.selected_template === 1 ? this.points : this.pointsCreated
      this.asyncDataPoints(object)
      this.asyncReason()
    },
    resetForm () {
      if (this.selected_template === 1) {
        for (let i = 0; i < this.points.length; i++) {
          this.$refs.stopPointComponent[i].resetValue()
        }
        this.$refs.stationComponent.resetValue()
      }
      if (this.selected_template === 2) {
        this.$refs.nameComponent.resetValue()
      }
      this.$refs.reasonBookingComponent.resetValue()
      this.$refs.typeTripComponent.resetValue()
      this.$refs.typeOrgComponent.resetValue()
      this.$refs.weightComponent.resetValue()
      this.reasonBookingOther = ''
      this.reason_booking_temp = ''
      this.dataInput = {
        template_id: 0,
        type_trip: '',
        reason_booking: '',
        weight: '',
        station_id: 0,
        station_name: '',
        time_book_from: '',
        time_book_to: '',
        name: '',
        type_route: null,
        org_company_ids: [],
        points: {
          ids: [],
          names: [],
          lats: [],
          longs: [],
          time_froms: [],
          time_days: [],
          addresses: [],
          station_ids: []
        }
      }
      this.pointsCreated = []
      this.points = [
        {
          id: null,
          name: '',
          lat: '',
          long: '',
          time_from: '',
          time_day: 0,
          address: '',
          lead_time: 0,
          hour: 0,
          minute: 0,
          station_id: 0
        },
        {
          id: null,
          name: '',
          lat: '',
          long: '',
          time_from: '',
          time_day: 0,
          address: '',
          lead_time: 0,
          hour: 0,
          minute: 0,
          station_id: 0
        }
      ]
    },
    flagPoint (index) {
      return !!((index === 0 || index === 1))
    },
    asyncDataPoints (object) {
      this.dataInput.points = {
        ids: [],
        names: [],
        lats: [],
        longs: [],
        time_froms: [],
        time_days: [],
        addresses: [],
        station_ids: []
      }
      for (let i = 0; i < object.length; i++) {
        this.dataInput.points.ids[i] = object[i].id
        this.dataInput.points.names[i] = object[i].name
        this.dataInput.points.lats[i] = object[i].lat
        this.dataInput.points.longs[i] = object[i].long
        this.dataInput.points.time_froms[i] = object[i].time_from
        this.dataInput.points.time_days[i] = object[i].time_day
        this.dataInput.points.addresses[i] = object[i].address
        this.dataInput.points.station_ids[i] = object[i].station_id
      }
    },
    addStopPoint () {
      this.points.push({
        id: null,
        name: '',
        lat: '',
        long: '',
        time_from: '',
        time_day: 0,
        address: '',
        lead_time: 0,
        hour: 0,
        minute: 0,
        station_id: 0
      })
    },
    deleteThisRow (index) {
      this.points.splice(index, 1)
    },
    selectedStopPoint (option) {
      if (!_.isNil(option.selected)) {
        this.points[option.index].id = option.selected.id
        this.points[option.index].name = option.selected.name
        this.points[option.index].lat = option.selected.lat
        this.points[option.index].long = option.selected.long
        this.points[option.index].address = option.selected.address
        this.points[option.index].station_id = option.selected.station_id
      }
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    selectedTypeOrg (option) {
      if (!_.isNil(option)) {
        this.dataInput.org_company_ids = _.map(option, 'id')
      }
    },
    selectedTypeTrip (option) {
      if (!_.isNil(option)) {
        this.dataInput.type_trip = option.id
      }
    },
    selectedWeight (option) {
      if (!_.isNil(option)) {
        this.dataInput.weight = option.id
      }
    },
    selectedReasonBooking (option) {
      if (!_.isNil(option)) {
        this.dataInput.reason_booking = option.id
        this.reason_booking_temp = option.id
      }
    },
    selectedStationOfTemplate (option) {
      if (!_.isNil(option)) {
        this.dataInput.station_id = option.id
        this.dataInput.station_name = option.name
      }
    },
    selectedName (option) {
      if (_.isNil(option)) {
        return
      }
      this.pointsCreated = []
      this.loadingTransfer = true
      this.dataInput.name = option.name
      this.dataInput.type_route = option.type
      this.dataInput.template_id = option.id
      this.dataInput.station_id = option.station_id
      this.dataInput.station_name = option.station_name
      G3PL.getStopPointByTemplateId({ id: option.id })
        .then(response => {
          if (response.data.hasOwnProperty('success')) {
            if (response.data.success === true) {
              const listStopPointSelected = response.data.data
              listStopPointSelected.forEach(val => {
                this.pointsCreated.push({
                  id: String(val.ghtk_id),
                  name: val.name,
                  lat: val.lat,
                  long: val.long,
                  time_from: val.time_from,
                  time_day: val.time_day,
                  address: val.address,
                  lead_time: 0,
                  hour: 0,
                  minute: 0,
                  station_id: val.station_id
                })
              })
            }
          }
          this.loadingTransfer = false
        }).catch((error) => {
          console.log(error)
          this.loadingTransfer = false
        })
    },
    isLeadtimeNull () {
      let leadtimeArr = Object.values(_.mapValues(this.points, 'lead_time'))
      leadtimeArr.shift()
      return !!_.includes(leadtimeArr, 0)
    },
    asyncReason () {
      if (this.dataInput.reason_booking === Booking.reasonOther || _.isEmpty(this.dataInput.reason_booking)) {
        this.dataInput.reason_booking = this.reasonBookingOther
      }
    },
    validateLeadtimeLimit () {
      for (let i = 1; i < this.points.length; i++) {
        if (this.points[i].lead_time > 4 * 24 * 60) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    points: {
      deep: true,
      handler: function () {
        if (!_.isEmpty(this.points[0].time_from)) {
          for (let i = 1; i < this.points.length; i++) {
            this.points[i].lead_time = (this.points[i].hour * 60) + this.points[i].minute
            let startDate = this.points[i - 1].time_from.split(':')
            let momentStartDate = moment('2020-12-10')
            momentStartDate.set({hours: startDate[0], minutes: startDate[1]})
            const time = momentStartDate.add(this.points[i].lead_time, 'minutes')
            this.points[i].time_from = time.format('HH:mm')
            this.points[i].time_day = time.format('DD') - 10 + Number(this.points[i - 1].time_day)
          }
        }
      }
    },
    selected_template: {
      deep: true,
      handler: function () {
        this.dataInput.name = ''
        this.dataInput.type_route = null
        this.dataInput.template_id = 0
        this.dataInput.station_id = 0
        this.dataInput.station_name = ''
        this.dataInput.points = {
          ids: [],
          names: [],
          lats: [],
          longs: [],
          time_froms: [],
          time_days: [],
          addresses: [],
          station_ids: []
        }
        this.points = [
          {
            id: null,
            name: '',
            lat: '',
            long: '',
            time_from: '',
            time_day: 0,
            address: '',
            lead_time: 0,
            hour: 0,
            minute: 0,
            station_id: 0
          },
          {
            id: null,
            name: '',
            lat: '',
            long: '',
            time_from: '',
            time_day: 0,
            address: '',
            lead_time: 0,
            hour: 0,
            minute: 0,
            station_id: 0
          }
        ]
        this.pointsCreated = []
        this.reasonBookingOther = ''
      }
    }
  },
  computed: {
    getUserBooking () {
      return this.$store.state.userInfo.User ? this.$store.state.userInfo.User.username : ''
    }
  },
  created () {
    this.storage = new WebStorage()
    this.initHours()
    this.initMinutes()
  }
}
</script>

<style lang="scss" scoped>
  .center {
    text-align: center;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .form-filter {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    padding: 20px;
  }
  .add-point {
    z-index: 0;
  }
  .height-38 {
    height: 38px;
  }
</style>
