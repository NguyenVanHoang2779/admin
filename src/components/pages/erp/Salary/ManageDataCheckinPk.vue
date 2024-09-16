<template>
  <div>
    <b-modal id="modal-1" modal-class="modal-xs" v-if="showModal" @close="showModal = true" :hide-footer="true"
             :hide-header="true">
      <div class="panel">
        <label>Chi tiết chỉnh sửa</label>
        <hr>
        <table class="table table-bordered table-sm text-center">
          <thead>
          <tr>
            <th  scope="col">Ngày</th>
            <th  scope="col">Trạng thái cũ</th>
            <th  scope="col">Trạng thái mới</th>
            <th  scope="col">Người chỉnh sửa</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in this.dataDetaiLog">
            <th>{{item.created}}</th>
            <th>{{item.status_old}}</th>
            <th>{{item.status_new}}</th>
            <th>{{item.user_created}}</th>
          </tr>
          </tbody>
        </table>
        <div class="mb-4 text-center">
        <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
      </div>
      </div>
    </b-modal>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <h3>Quản Lý Liệu Checkin Pk</h3>
      </b-row>
      <hr>
      <b-row>
        <b-col sm="3">
          <h4>Chọn Tỉnh</h4>
          <multi-select-province
            @handleProvinceSelected="handleProvinceSelected"
            :hide-selected="true"
          ></multi-select-province>
        </b-col>
        <b-col sm="3">
          <h4>Chọn Kho</h4>
          <multi-select-stations
            :province-ids="provinceIds"
            @handleStationSelected="handleStationSelected"
          ></multi-select-stations>
        </b-col>
        <b-col sm="3">
          <!--<h4>Chọn Khoảng Thời Gian <span class="require">(*)</span></h4>-->
          <!--<b-form-group>-->
            <!--<flat-pickr v-model="selectedRangeTime" :config="rangeConfig" placeholder="Chọn khoảng thời gian"/>-->
            <!--<p v-if="selectedRangeTime !== '' " style="font-size: 13px; line-height: 30px"><i>&emsp;(*) ứng với-->
              <!--dữ liệu từ <span style="color: red">{{selectedRangeTime.split(' to ')[0]}} 00:00:00</span> đến <span-->
                <!--class="require">{{selectedRangeTime.split(' to ')[1]}} 23:59:59</span></i></p>-->
          <!--</b-form-group>-->
          <b-form-group>
            <h4>Ngày bắt đầu</h4>
            <datepicker
                    v-model="from"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    placeholder=" Ngày bắt đầu"
            />
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <h4>Ngày kết thúc</h4>
            <datepicker
                    v-model="to"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    placeholder=" Ngày kết thúc"
            />
          </b-form-group>
        </b-col>
        <b-col md="4">
        </b-col>
      </b-row>
      <b-row>
        <div class="col-sm-12 text-right">
        <b-button class="btn btn-outline-info ml-3" @click="getDataCheckinByCondition">Lấy Dữ Liệu</b-button>
        <b-button class="btn btn-outline-success ml-3" @click="exportDataToExcel" :disabled="isProcessing">Xuất Data <i v-if="isProcessing" class="fa fa-spinner fa-spin"></i></b-button>
        <b-button class="btn btn-outline-secondary ml-3" @click="openManageFileExported">Quản Lý Các Files Đã Xuất</b-button>
        </div>
      </b-row>
    </b-card-body>
    <b-card-body>
      <b-row v-if="listsDate != null">
        <b-button class="center btn btn-outline-info ml-3 mr-1 mb-3 mt-3" v-for="date in listsDate" :key="date" @click="chooseDataOfDate(date)">{{date}}</b-button>
      </b-row>
      <b-row class="ml-1">
        <b-col><h5>Có Tất Cả {{dataCheckin.length}} Checkin Trong Ngày {{datePicked}}</h5></b-col>
        <b-col>
          <b-form-input
            class="mb-3"
            v-model="filter"
            type="search"
            id="filterInput"
            placeholder="Nhập Nội Dung Để Lọc"
          ></b-form-input>
        </b-col>
        <b-col md="1">
          <b-button class="ml-1" variant="outline-success" @click="open">Thêm checkin</b-button>
        </b-col>
      </b-row>
      <b-row class="ml-1 mr-1 text-center">
        <b-table
          responsive
          striped hover
          v-if="dataCheckin != null"
          :fields="fields"
          :items="dataCheckin"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="filter"
        >
          <template v-slot:cell(statusCheckin)="row">
            <b-form-select style="width: 150px;" v-model="row.item.statusCheckin" :options="optionStatus" @change="updateStatusCheckin(row.item)"></b-form-select>
          </template>
          <template v-slot:cell(distance)="row">
            {{row.item.distance}} m
          </template>
          <template v-slot:cell(modified_by)="row">
            <b-btn v-if="row.item.modified_by !== null" variant="outline-primary borderless icon-btn" class="btn-xs" @click="detailLog(row.item.checkin_id)">
              <i class="d-block fas fa-tasks"></i>
            </b-btn>
          </template>
        </b-table>
      </b-row>
      <b-row class="d-flex justify-content-center">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-row>
      <b-modal id="manage-checkin-user" no-close-on-backdrop size="md" title="Quản lý checkin"
               title-tag="h3" cancel-title="Hủy bỏ" static
               :hide-footer="true" @close="close"
      >
        <div>
          <span style="color: red">Để thêm ca checkin cho COD từ ngày 17-08-2022, thao tác tại
             <router-link :to="`export-data-checkin-pkV2`" style="color: #1c99e6"> đây </router-link>
          </span>
        </div>
        <div v-if="userInfo != null" class="box-user">
          <b-row><b-col>Tên tài khoản:</b-col><b-col>{{userInfo.username}}</b-col></b-row>
          <b-row><b-col>Họ tên cod:</b-col><b-col>{{userInfo.fullname}}</b-col></b-row>
          <b-row><b-col>Vị trí:</b-col><b-col>{{userInfo.position_name}}</b-col></b-row>
          <b-row><b-col>Miền:</b-col><b-col>{{userInfo.region_name}}</b-col></b-row>
          <b-row><b-col>Loại hình lv:</b-col><b-col>{{userInfo.work_type_description}}</b-col></b-row>
          <b-row><b-col>Tỉnh:</b-col><b-col>{{userInfo.province_name}}</b-col></b-row>
          <b-row><b-col>Kho:</b-col><b-col>{{userInfo.station_name}}</b-col></b-row>
        </div>
        <br>
        <b-row class="mb-3">
          <b-col md="3"><b-button class="custom-btn-form" variant="outline-secondary" size="sm"><strong>Username</strong></b-button></b-col>
          <b-col>
            <b-input
              placeholder="Nhập tài khoản"
              v-model="textSearch"
              list="list-user"
            ></b-input>
            <datalist id="list-user" v-if="listUserSearch != null">
              <option v-for="username in listUserSearch" :value="username"></option>
            </datalist>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="3">
            <b-button class="custom-btn-form" variant="outline-secondary" size="sm"><strong>Địa Điểm</strong></b-button>
          </b-col>
          <b-col>
            <multi-select-stop-point
              @handleStopPointSelected="handlePointSearch"
              :display-all="true"
              :place-hoder="`Chọn địa điểm làm hàng`"
              :limit-prop=99999
              :multiSelect="false"
              :auto-close="true"
              :hide-selected="true"
            >
            </multi-select-stop-point>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="3">
            <b-button class="custom-btn-form" variant="outline-secondary" size="sm"><strong>Chọn Ngày</strong></b-button>
          </b-col>
          <b-col>
            <b-input type="date" v-model="checkinDate"></b-input>
          </b-col>
        </b-row>
        <b-row v-if="this.configTimeCheckin != null" class="mb-3">
          <b-row v-for="(config, index) in this.configTimeCheckin" :key="index" class="ml-3 mb-1">
            <b-btn-group class="float-right">
              <b-button variant="outline-secondary">Ca {{index + 1}}</b-button>
              <b-button variant="outline-secondary">Bắt đầu: {{config.start}}</b-button>
              <b-button variant="outline-secondary">Muộn: {{config.late}}</b-button>
              <b-button variant="outline-secondary">Kết thúc: {{config.end}}</b-button>
              <b-form-checkbox class="ml-3 mt-3" :value=index v-model="workShift"></b-form-checkbox>
            </b-btn-group>
          </b-row>
        </b-row>
        <b-btn-group class="float-right">
          <b-button class="custom-btn-modal" variant="outline-info" @click="getConfigCheckin">Lấy Config Ca</b-button>
          <b-button class="custom-btn-modal" variant="outline-primary" @click="cancel">Hủy Bỏ</b-button>
          <b-button class="custom-btn-modal" variant="outline-success" @click="checkinThisWorkShift()">Checkin</b-button>
        </b-btn-group>
      </b-modal>
    </b-card-body>
  </b-card>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
  .require {
    color: red;
  }
  .custom-btn-form {
    height: 38px;
    width: 100px;
  }
  .custom-btn-modal {
    height: 38px;
    width: 150px;
  }
  .box-user {
    box-shadow: 1px 1px 1px #26B4FF, -1px -1px 1px #26B4FF;
    border-radius: 10px;
    padding: 5px;
  }
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStations from './ConfigCheckinComponent/MultiSelectStation'
import flatPickr from 'vue-flatpickr-component'
import SalaryService from 'domain/services/salary-service'
import MultiSelectStopPoint from 'components/elements/common/MultiSelectStopPoint'
import debounce from 'debounce'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
export default {
  name: 'export-data-checkin-pk',

  components: {
    commonHelper,
    Multiselect,
    MultiSelectProvince,
    MultiSelectStations,
    flatPickr,
    MultiSelectStopPoint,
    debounce,
    Datepicker,
    Moment
  },

  data: () => ({
    provinceIds: null,
    stationIds: null,
    users: [{id: 1, name: 'minmin'}, {id: 3, name: 'minmin3'}, {id: 2, name: 'minmin2'}],
    listUserIdsSelected: null,
    selectedRangeTime: '',
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'Y-m-d',
      altFormat: 'Y-m-d'
    },
    startDate: null,
    endDate: null,
    fields: [
      {key: 'checkin_id', label: 'ID Checkin', sortable: true},
      {key: 'config_id', label: 'ID Config', sortable: true},
      {key: 'idUser', label: 'ID User', sortable: true},
      {key: 'username', label: 'Tên Tài Khoản', sortable: true},
      {key: 'fullname', label: 'Họ Và Tên', sortable: true},
      {key: 'stationName', label: 'Thuộc Kho', sortable: true},
      {key: 'checkinPlace', label: 'Địa Điểm Checkin', sortable: true},
      {key: 'checkinTime', label: 'Thời Gian Checkin', sortable: true},
      {key: 'ws', label: 'Ca Checkin', sortable: true},
      {key: 'is_late', label: 'Checkin Muộn', sortable: true},
      {key: 'statusCheckin', label: 'Trạng Thái', sortable: true},
      {key: 'count_bill', label: 'Số lượng đơn', sortable: true},
      {key: 'distance', label: 'Khoảng cách', sortable: true},
      {key: 'createdByUserId', label: 'Tạo Bởi', sortable: true},
      {key: 'modified', label: 'Chỉnh sửa lần cuối', sortable: true},
      {key: 'modified_by', label: 'Chi tiết chỉnh sửa', sortable: true}
    ],
    dataCheckin: [],
    listsDate: null,
    datePicked: null,
    dataResponse: [],
    perPage: 10,
    currentPage: 1,
    filter: null,
    openManageFiles: false,
    timeExport: null,
    isProcessing: false,
    // Tạo checkin
    pointId: null,
    status: 'approved',
    optionStatus: [
      { value: 'approved', text: 'approved' },
      { value: 'rejected', text: 'rejected' },
      { value: 'manager_approved', text: 'manager_approved' },
      { value: 'rejected_auto', text: 'rejected_auto ', disabled: true },
      { value: 'rejected_count_bill', text: 'rejected_count_bill ', disabled: true }
    ],
    textSearch: null,
    listUserSearch: null,
    userId: null,
    workShift: [],
    checkinDate: null,
    configTimeCheckin: null,
    userInfo: null,
    from: new Date(),
    to: new Date(),
    showModal: true,
    dataDetaiLog: []
  }),

  watch: {
    selectedRangeTime: function () {
      this.startDate = this.selectedRangeTime.split(' to ')[0]
      this.endDate = this.selectedRangeTime.split(' to ')[1]
    },
    textSearch: function (newValue, oldValue) {
      if (newValue === null) return
      if (newValue.length > 2) {
        this.searchUser(newValue)
      }
    }
  },

  created () {
  },

  mounted () {
  },

  computed: {
    rows () {
      return this.dataCheckin.length
    }
  },

  methods: {
    close () {
      this.$bvModal.hide('manage-checkin-user')
    },
    cancel () {
      this.$bvModal.hide('manage-checkin-user')
    },
    open () {
      this.$bvModal.show('manage-checkin-user')
    },
    handlePointSearch (option) {
      this.pointId = option ? option.id : null
    },
    handleProvinceSelected (option) {
      this.provinceIds = option ? option.map(element => element.id).toString() : null
    },

    handleStationSelected (option) {
      this.stationIds = option ? option.map(elemenet => elemenet.id).toString() : null
    },

    getDataCheckinByCondition: function () {
      if (this.from > this.to) {
        commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!', 'warning')
        return
      }
      if (this.stationIds === null) return commonHelper.showMessage('Vui Lòng Chọn Kho', 'warning')
      // if (this.startDate === null || this.endDate === null) return commonHelper.showMessage('Vui Lòng Chọn Khoảng Thời Gian', 'warning')
      let from = Moment(this.from).format('YYYY-MM-DD')
      let to = Moment(this.to).format('YYYY-MM-DD')
      let stationIds = this.stationIds
      SalaryService.getAllDataCheckinByCondition({from, to, stationIds}).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          this.dataResponse = res.data.data
          this.listsDate = Object.keys(res.data.data)
          this.datePicked = this.listsDate[0]
          Object.keys(res.data.data[this.datePicked]).forEach(element => {
            this.dataCheckin.push(res.data.data[this.datePicked][element])
          })
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          this.clearData()
        }
      }).catch(() => {
        commonHelper.showMessage('Có Lỗi Xảy Ra. Vui Lòng Thử Lại Sau', 'warning')
      })
    },

    clearData () {
      this.dataCheckin = []
      this.dataResponse = []
      this.datePicked = null
      this.listsDate = null
    },

    chooseDataOfDate (date) {
      this.dataCheckin = []
      this.datePicked = date
      Object.keys(this.dataResponse[date]).forEach(element => {
        this.dataCheckin.push(this.dataResponse[date][element])
      })
    },

    exportDataToExcel () {
      if (this.from > this.to) {
        commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!', 'warning')
        return
      }
      // if (this.startDate === null || this.endDate === null) return commonHelper.showMessage('Vui Lòng Chọn Khoảng Thời Gian', 'warning')
      if (this.stationIds === null && this.provinceIds === null) return commonHelper.showMessage('Vui Lòng Chọn Kho Hoặc Tỉnh', 'warning')
      if (this.timeExport === null) {
        let date = new Date()
        this.timeExport = date.getTime()
      }
      let from = Moment(this.from).format('YYYY-MM-DD')
      let to = Moment(this.to).format('YYYY-MM-DD')
      let stationIds = this.stationIds
      let provinceIds = this.provinceIds
      this.isProcessing = true
      SalaryService.exportDataCheckin({from, to, stationIds, provinceIds, time: this.timeExport}).then(res => {
        if (res.data.success) {
          this.timeExport = null
          this.isProcessing = false
          window.location.href = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
          setTimeout(() => {
            this.exportDataToExcel()
          }, 15000)
        }
      }).catch(() => {
        this.isProcessing = false
        commonHelper.showMessage('Có Lỗi Xảy Ra. Vui Lòng Thử Lại', 'warning')
      })
    },

    openManageFileExported () {
      window.open('manage-export-excel', '_blank')
    },

    resetFormCheckin () {
      this.userId = null
      this.pointId = null
      this.workShift = []
      this.textSearch = null
      this.configTimeCheckin = null
      this.userInfo = null
      this.checkinDate = null
    },

    createCheckin () {
      for (let userId in this.listUserSearch) {
        if (this.listUserSearch[userId] === this.textSearch) {
          this.userId = userId
          break
        }
      }
      if (this.userId === null) return commonHelper.showMessage('Không tìm thấy id của user', 'warning')
      if (this.pointId === null) return commonHelper.showMessage('Vui lòng chọn địa điểm làm hàng', 'warning')
      if (this.workShift.length === 0) return commonHelper.showMessage('Vui lòng chọn thời gian checkin', 'warning')
      SalaryService.addCheckinUser({
        'userId': this.userId,
        'pointId': this.pointId,
        'workShift': this.workShift,
        'status': this.status,
        'dateCheckin': this.checkinDate
      }).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(`Thêm checkin cho user ${this.textSearch} thành công`, 'success')
          this.$bvModal.hide('manage-checkin-user')
          this.resetFormCheckin()
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning'))
    },
    searchUser: debounce(function (textSearch) {
      if (textSearch === null || textSearch.length < 3) return null
      SalaryService.getUser({username: textSearch}).then(res => {
        if (res.data.success) {
          this.userInfo = res.data.data
          this.userId = res.data.data.user_id
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          this.userInfo = null
          commonHelper.showMessage('User không tồn tại', 'warning')
        }
      }).catch(() => commonHelper.show('Có lỗi xảy ra khi search user. Vui lòng thử lại sau', 'warning'))
    }, 1000),

    updateStatusCheckin (checkin) {
      if (!confirm('Bạn có chắc muốn thay đổi')) {
        if (checkin.statusCheckin === 'approved') checkin.statusCheckin = 'rejected'
        else checkin.statusCheckin = 'approved'
        return
      }
      SalaryService.updateStatusCheckin({
        'id': checkin.checkin_id,
        'status': checkin.statusCheckin,
        'date_checkin': checkin.checkinTime
      }).then(res => {
        if (res.data.success) return commonHelper.showMessage(res.data.message, 'success')
        return commonHelper.showMessage(res.data.message, 'warning')
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning'))
    },

    getConfigCheckin () {
      if (this.pointId === null) return commonHelper.showMessage('Vui lòng chọn địa điểm làm hàng', 'warning')
      if (this.checkinDate === null) return commonHelper.showMessage('Vui lòng chọn ngày', 'warning')
      if (this.userId === null) return commonHelper.showMessage('Không tìm thấy user id', 'warning')
      let dataSend = {
        'date': this.checkinDate,
        'user_id': this.userId,
        'point': [this.pointId]
      }
      let dateCheck = new Date(this.checkinDate)
      let dateNewCf = new Date('2020-07-20')
      if (dateCheck > dateNewCf) {
        SalaryService.getConfigUser(dataSend).then(res => {
          if (res.data.success) {
            this.configTimeCheckin = JSON.parse(res.data.data.times)
            return commonHelper.showMessage('Lấy config ca thành công', 'success')
          }
          this.configTimeCheckin = null
          return commonHelper.showMessage(res.data.message, 'warning')
        }).catch(() => commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning'))
      } else {
        SalaryService.getConfigCheckinCod(dataSend).then(res => {
          if (res.data.success) {
            this.configTimeCheckin = JSON.parse(res.data.data[0].times)
            commonHelper.showMessage('Lấy config ca thành công', 'success')
          } else {
            this.configTimeCheckin = null
            commonHelper.showMessage('Không tìm thấy config checkin', 'warning')
          }
        }).catch(() => commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning'))
      }
    },

    checkinThisWorkShift () {
      if (this.workShift.length < 1) return
      if (!confirm(`Đồng ý thêm ${this.workShift.length} checkin cho cod ${this.textSearch}`)) {
        return false
      }
      this.createCheckin()
    },
    detailLog (id) {
      let data = {
        'id': id
      }
      this.dataDetaiLog = []
      SalaryService.getLogPkBus(data).then(res => {
        if (res.data.success) {
          this.dataDetaiLog = res.data.data
        } else {
          return commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning'))
      this.$bvModal.show('modal-1')
    }
  }
}
</script>
