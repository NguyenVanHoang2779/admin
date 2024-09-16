<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading">Duyệt phiên tăng ca tài xế</h4>
<!--      <h6 class="ui-block-heading">(Hãy chọn tháng và tỉnh + kho hoặc tháng và tên đăng nhập)</h6>-->
      <div class="search-form">
        <form>
          <b-form-row>
            <!--Box chọn tháng -->
            <div class="col-md-2">
              <label class="form-label">Chọn tháng</label>
<!--              <b-form-group label="Chọn tháng">-->
                <vue-monthly-picker v-model="user.selectedMonth"></vue-monthly-picker>
<!--              </b-form-group>-->
            </div>
            <div class="col-md-4 mb-5">
              <label class="form-label">Chọn tỉnh</label>
              <multiselect v-model="provinceModel"
                           :options="optionProvinces"
                           placeholder="Chọn tỉnh"
                           :searchable="true"
                           track-by="ErpAddressService"
                           label="ErpAddressService"
                           :allow-empty="false"
                           :custom-label="customRecordProvince"
                            @input="getListStations">
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </div>
            <div class="col-md-4 mb-5">
              <label class="form-label">Chọn kho</label>
              <multiselect class="multiselect-success"
                           v-model="stationModel"
                           :options="optionStations"
                           selectLabel="Chọn kho"
                           track-by="ErpStation"
                           label="ErpStation"
                           :searchable="true"
                           :allow-empty="true"
                           :custom-label="customRecordStation"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </div>
<!--            <div class="col-md-2">-->
<!--              <b-form-group label="Tên đăng nhập">-->
<!--                <b-input type="text" placeholder="Nhập tên đăng nhập" v-model="user.username"/>-->
<!--              </b-form-group>-->
<!--            </div>-->
            <div class="col-md-2">
<!--              <b-form-group label="&nbsp">-->
                <label class="form-label"> &nbsp; </label>
                <div class="align-content-center center">
                  <ladda-btn :loading="user.loadingButton" @click.native="searchInfo" data-style="expand-right"
                             class="btn btn-primary" style="width: 100%">
                    Lấy thông tin
                  </ladda-btn>
                </div>
<!--              </b-form-group>-->
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="result" id="results"><br/>
        <b-card no-body v-if="listDates">
          <!-- / Table controls -->
          <div class="table-result" >
            <!-- Table -->
            <div class="table-responsive mb-4">
              <b-table
                responsive
                striped hover
                v-if="listDates != null"
                :fields="fields"
                :items="listDates"
                :per-page="perPage"
                :current-page="currentPage"
              >
                <template v-slot:cell(status)="row">
                  <b-form-select style="width: 150px;" v-model="row.item.status" :options="status_types" @change="updateStatusRecord(row.item)"></b-form-select>
                </template>
                <template v-slot:cell(history)="row">
                  <b-button-group>
                    <b-button size="sm" class="mr-1 btn btn btn-outline-success" @click="showReviewHistory(row.item.ss_id)" v-b-modal.myModal>
                      Lịch sử duyệt
                    </b-button>
                  </b-button-group>
                </template>
              </b-table>

              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
            </div>
          </div>
        </b-card>
        <div class="no-data" v-if="!listDates">
          Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
        </div>
      </div>
    </div>
    <!-- Modal template -->
    <b-modal id="myModal" ref="slideModal" size="lg" hide-footer>
      <div slot="modal-title">
        Lịch sử duyệt phiên
      </div>
      <div>
        <ul id="history">
          <li v-for="item in dataHistory" :key="item.message" style="padding: 2px;">
            {{ item.time_created }} - <b>{{ item.username }}/({{ item.fullname }}) </b> cập nhật từ <b>{{ item.status_before}}</b> sang <b>{{ item.status_after }}</b>
          </li>
        </ul>
      </div>
    </b-modal>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-simple-calendar/vue-simple-calendar.scss" lang="scss"></style>
<style src="vue-simple-calendar/dist/static/css/holidays-us.css" lang="css"></style>
<style src="@/vendor/libs/sweet-modal-vue/sweet-modal-vue.scss" lang="scss"></style>

<script>
import driverOtSessionService from 'domain/services/driver-ot-session-service'
import InputTag from 'vue-input-tag'
import flatPickr from 'vue-flatpickr-component'
import VueMonthlyPicker from 'vue-monthly-picker'
import moment from 'moment'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'

moment.suppressDeprecationWarnings = true

export default {
  name: 'review-driver-ot-session',
  metaInfo: {
    title: 'Duyệt phiên tăng ca tài xế'
  },
  components: {
    driverOtSessionService,
    flatPickr,
    VueMonthlyPicker,
    InputTag,
    LaddaBtn,
    Multiselect
  },
  data: () => ({
    fields: [
      {key: 'ss_id', label: 'Mã phiên', sortable: true, thStyle: 'width: 5%'},
      {key: 'username', label: 'Người tạo', sortable: true, thStyle: 'width: 5%'},
      {key: 'fullname', label: 'Họ tên người tạo', sortable: true, thStyle: 'width: 10%'},
      {key: 'route_name', label: 'Tuyến', sortable: true, thStyle: 'width: 15%'},
      {key: 'time_start', label: 'Thời gian bắt đầu phiên', sortable: true, thStyle: 'width: 10%'},
      {key: 'time_end', label: 'Thời gian kết thúc phiên', sortable: true, thStyle: 'width: 10%'},
      {key: 'date_ot', label: 'Thời gian chấm tăng ca', sortable: true, thStyle: 'width: 10%'},
      {key: 'user_1_duyet', label: 'Người duyệt lần 1', sortable: true, thStyle: 'width: 10%'},
      {key: 'user_2_duyet', label: 'Người duyệt lần 2', sortable: true, thStyle: 'width: 10%'},
      {key: 'status', label: 'Trạng thái', sortable: true, thStyle: 'width: 10%'},
      {key: 'history', label: 'Lịch sử', sortable: true, thStyle: 'width: 5%'}
    ],
    provinceModel: [],
    optionProvinces: [],
    stationModel: [],
    optionStations: [],
    perPage: 10,
    currentPage: 1,
    dataHistory: [],
    user: {
      username: '',
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM'),
      responseMessage: {}
    },
    listDates: [],
    events: [],
    status_types: []
    // status_types: [
    //   { value: 'approved', text: 'approved' },
    //   { value: 'rejected', text: 'rejected' },
    //   { value: 'pending', text: 'pending' }
    // ]
  }),
  created () {
    this.getListProvince()
  },
  watch: {
    provinceModel: function (newValue, oldValue) {
      this.stationModel = []
    }
  },
  computed: {
    rows () {
      return this.listDates.length
    }
  },
  methods: {
    getListProvince: function () {
      driverOtSessionService.getListProvinces().then(res => {
        if (res.data.success) {
          this.optionProvinces = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getListStations: function () {
      let provinceId = this.provinceModel.ErpAddressService.addresses_id
      console.log(provinceId)
      if (provinceId > 0) {
        let dataSend = {
          'provinceID': provinceId
        }
        driverOtSessionService.getListStations(dataSend).then(res => {
          if (res.data.success) {
            this.optionStations = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    customRecordProvince: function ({ErpAddressService}) {
      return `${ErpAddressService.prefix}  ${ErpAddressService.name}`
    },
    customRecordStation: function ({ErpStation}) {
      return `${ErpStation.name}`
    },
    searchInfo () {
      // this.user.loadingButton = true
      let month = moment(this.user.selectedMonth).format('YYYY/MM')
      let strDate = month.split('/')
      let provinceID = 0
      // console.log(this.provinceModel)
      if (this.provinceModel.length !== 0) {
        provinceID = this.provinceModel.ErpAddressService.addresses_id
      }
      let stationID = 0
      if (this.stationModel.length !== 0) {
        stationID = this.stationModel.ErpStation.id
      }
      if (stationID === 0 && (this.user.username === null || this.user.username === '' || this.user.username === undefined)) {
        alert('Bạn chưa nhập đủ thông tin!')
      } else {
        let dataSend = {
          'username': this.user.username,
          'month': strDate[1],
          'year': strDate[0],
          'provinceID': provinceID,
          'stationID': stationID
        }
        console.log(dataSend)

        driverOtSessionService.searchDriverOtSession(dataSend).then(response => {
          if (response.data.success) {
            this.listDates = response.data.data
            this.status_types = response.data.status
            commonHelper.showMessage(response.data.message, 'success')
          } else {
            this.success = false
            commonHelper.showMessage(response.data.message, 'warning')
          }
        }).then(() => {
          this.user.loadingButton = false
        })
      }
    },
    updateStatusRecord (data) {
      if (!confirm('Bạn có chắc muốn thay đổi?')) {
        if (data.status === 'approved') data.status = 'rejected'
        else data.status = 'approved'
        return
      }
      driverOtSessionService.updateStatusRecord({
        'ss_id': data.ss_id,
        'status': data.status
      }).then(res => {
        if (res.data.success) return commonHelper.showMessage(res.data.message, 'success')
        return commonHelper.showMessage(res.data.message, 'warning')
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning'))
    },
    showReviewHistory (sessionID) {
      this.dataHistory = []
      console.log(sessionID)
      let dataSend = {
        'ss_id': sessionID
      }
      driverOtSessionService.showReviewHistory(dataSend).then(response => {
        if (response.data.success) {
          this.dataHistory = response.data.data
          commonHelper.showMessage(response.data.message, 'success')
          this.$refs.slideModal.show()
        } else {
          this.success = false
          commonHelper.showMessage(response.data.message, 'warning')
        }
      })
    }
  }
}
</script>
<style scoped>
  .center {
    margin: 0 auto;
  }

  .align-content-center {
    text-align: center;
  }
</style>
