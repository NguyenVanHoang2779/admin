<template>
  <div class="fcDetailWorkShift">
    <b-modal :id="modalUpdateCheckinId" ref="edit-checkin-log" :title="title" size="xl" content-class="overflow-hidden" modal-class="modal-xl" header-class="text-dark bg-white" @hidden="hideModal">
      <template #modal-title>
        <h4 class="modal-title" style="font-size: 16px">
          {{title}} / <span>{{ currentUser.fullName }}</span> /
          <span>{{ currentUser.department }}</span> /
          <span>{{ currentUser.position_job }}</span> /
          <span>{{ currentUser.workTypeDes }}</span>
        </h4>
      </template>
      <div v-loading="loading || loadingDetail">
        <div class="row pt-1 pb-1 pl-3">
          <label class="fw-b-grey col-md-2 text-right">Ngày chấm công *</label>
          <b-form-input
            class="col-md-4 text-left input-checkin-date"
            :disabled="!!checkinLog.day_on"
            size="xs"
            v-model="checkinLog.day_on"
          />
          <label v-if="type === 'edit'" class="font-weight-bold fw-b-grey  col-md-2 text-right mb-0">Giờ checkin:</label>
          <span v-if="type === 'edit' && !this.editCheckinTime"
                class="col-md-2"> {{ formatedCheckinTime }} </span>
          <b-form-input
            v-if="type === 'edit' && editCheckinTime"
            class="col-md-3 text-left input-checkin-date mr-2"
            size="xs"
            type="datetime-local"
            v-model="checkinLog.checkin_time"
          />
          <button class="btn btn-ghtk rounded btn-edit-time"  v-if="type === 'edit' && !editCheckinTime" @click="editCheckinTime = !editCheckinTime">
            <i class="fa fa-pencil-alt"></i>
          </button>
        </div>
        <div class="row pt-1 pb-1 pl-3 align-items-center">
          <label class="fw-b-grey col-md-2 text-right mb-0">Loại</label>
          <b-form-select class="col-md-4" v-model="checkinLog.on_leave" :disabled="type === 'edit'" :options="type === 'edit' ? onLeavesEdit : onLeaves"></b-form-select>
          <label v-if="type === 'edit'" class="font-weight-bold fw-b-grey  col-md-2 text-right mb-0">Giờ checkout:</label>
          <span v-if="type === 'edit' && !this.editCheckoutTime" class="col-md-2"> {{formatedCheckoutTime}} </span>
          <b-form-input
            v-if="type === 'edit' && editCheckoutTime"
            class="col-md-3 text-left input-checkin-date mr-2"
            size="xs"
            type="datetime-local"
            v-model="checkinLog.checkout_time"
          />
          <button class="btn btn-ghtk rounded btn-edit-time" v-if="type === 'edit' && !editCheckoutTime" @click="editCheckoutTime = !editCheckoutTime">
            <i class="fa fa-pencil-alt"></i>
          </button>
        </div>
        <div v-if="checkinLog.on_leave === 'on_leave' || checkinLog.on_leave === 1" class="row pt-1 pb-1 pl-3">
          <label class="fw-b-grey col-md-2 text-right">Dùng quỹ phép</label>
          <b-form-select class="col-md-4" v-model="checkinLog.leave_type" :options="leaveTypes"></b-form-select>
          <label class="col-md-2 text-right" v-if="type === 'edit'">Lý do:</label>
          <span v-if="type === 'edit'" class="font-weight-bold col-md-4"> {{checkinLog.reason ? checkinLog.reason : checkinLog.note || ''}} </span>
        </div>
        <div class="row pt-1 pb-1 pl-3" v-if="checkinLog.on_leave !== 'on_leave' && checkinLog.on_leave !== 1 && currentUser && currentUser.work_type != 'by_hours'">
          <label class="fw-b-grey col-md-2 text-right">Chấm công *</label>
          <b-form-select class="col-md-4" v-model="checkinLog.checkin_type" :options="checkinTypes"></b-form-select>
          <label v-if="checkinLog.checkin_type === 'over_time'" class="col-md-2 text-right">Lý do:</label>
          <span v-if="type === 'edit' && checkinLog.checkin_type === 'over_time'" class="font-weight-bold col-md-4"> {{checkinLog.reason ? checkinLog.reason : checkinLog.note || ''}} </span>
          <b-form-input
            v-if="type === 'create' && checkinLog.checkin_type === 'over_time'"
            class="col-md-3 text-left input-checkin-date"
            size="xs"
            type="text"
            v-model="checkinLog.note"
          />
        </div>
        <div class="row pt-1 pb-1 pl-3 align-items-center">
          <label class="fw-b-grey col-md-2 text-right mb-0">Thời gian *</label>
          <b-form-select class="col-md-4" v-model="checkinLog.shift_on" :options="shifts"></b-form-select>
          <label v-if="type === 'edit'" class="font-weight-bold fw-b-grey  col-md-2 text-right mb-0">Gửi lên bởi:</label>
          <span v-if="type === 'edit'" class="col-md-4 font-weight-bold"> {{checkinLog.user_created_name}} / {{checkinLog.created}} </span>
        </div>
        <div class="row pt-1 pb-1 pl-3 align-items-center">
          <label class="fw-b-grey col-md-2 text-right mb-0">Ca làm việc</label>
          <b-form-select class="col-md-4" v-model="checkinLog.shift_detail" :options="shiftDetails"></b-form-select>
          <label v-if="type === 'edit'" class="font-weight-bold fw-b-grey  col-md-2 text-right mb-0">Duyệt bởi:</label>
          <span v-if="type === 'edit'" class="col-md-4 font-weight-bold">{{checkinLog.status !== 'pending' ? ((checkinLog.user_modified_name || 'Admin') + ' / ' + checkinLog.modified) : ''}}</span>
        </div>
        <div v-if="checkinLog.shift_on === 'day' || checkinLog.shift_on === 'night'" class="row pt-1 pb-1 pl-3">
          <label class="fw-b-grey col-md-2 text-right">Số giờ</label>
          <b-form-input
            class="col-md-2 text-left input-checkin-date rounded"
            size="xs"
            type="number"
            v-model="checkinLog.hours"
          />
        </div>

        <div class="row pt-1 pb-1 pl-3">
          <label class="fw-b-grey col-md-2 text-right">Trạng thái</label>
          <b-form-select class="col-md-4" v-model="checkinLog.status" :options="statuses" :disabled="type === 'create'"></b-form-select>
          <label v-if="type === 'edit' && approveLevel1Text !== 'Chưa duyệt lần 1'" class="font-weight-bold fw-b-grey  col-md-2 text-right">Duyệt lần 2 bởi:</label>
          <span v-if="type === 'edit' && approveLevel1Text !== 'Chưa duyệt lần 1'" class="col-md-4 font-weight-bold">{{approveLevel2Text}}</span>
        </div>
        <div class="row pt-1 pb-1 pl-3">
          <label class="fw-b-grey col-md-2 text-right">Kho</label>
          <div class="col-md-4 p-0">
            <single-select-station
              custom-class="col-md-4 p-0"
              @handleSelectedStation="op => (checkinLog.station_id = op ? op.id : null)"
              :station-id="type === 'edit' ? checkinLog.station_id : currentUser.stationId"
              selectLabel=""
              placeholder="Kho làm việc"
            >
            </single-select-station>
          </div>
          <label v-if="type === 'edit'" class="col-md-2 text-right">Lịch sử cập nhật:</label>
          <div v-if="type === 'edit'" class="col-md-4 font-weight-bold"><a @click="openHistoryModal()" class="text-underline-hover cursor-pointer text-success">Bấm để xem</a></div>
        </div>
        <div v-if="showMessage" class="row pt-1 pb-1 pl-3">
          <label class="fw-b-grey col-md-2 text-right">Thông báo:</label>
          <span class="col-md-4 font-weight-bold p-0"> {{checkinLog.message}} </span>
        </div>
      </div>
      <template #modal-footer>
        <div class="w-100">
          <div v-if="type !== 'create' && checkinLogOld.status && checkinLogOld.status === checkinLog.status" class="modal-status" :class="checkinLog.status">
            {{checkinStatus}}
          </div>
          <b-button
            variant="success"
            size="md"
            class="float-right rounded"
            @click="editCheckinLog"
          >
            {{btnAddTitle}}
          </b-button>
        </div>
      </template>
    </b-modal>
    <b-modal :id="historyModalId" ref="checkin-history" size="lg" header-class="text-dark bg-white" hide-footer>
      <template #modal-title>
        <h4 class="modal-title text-dark font-weight-bold" style="font-size: 16px">
          Lịch sử cập nhật dữ liệu chấm công
        </h4>
      </template>
      <div class="d-block text-center" v-loading="loadingModal">
        <ul v-if="!emptyWorkShiftActivities">
          <li v-for="(activity, key) in workshiftActivities" :key="key">
            <div class="text-align-left">
              <span v-html="activity.created_at"></span>
              - <b><span v-if="activity.user_update_username !== 'admin'">{{activity.user_update_position}} / </span></b>
              <b><span>{{activity.user_update_username}}</span></b>
              - <b><span>{{activity.user_update_fullname}}</span></b>
              <span>{{activity.action === 'UPDATE' ? ' đã cập nhật ' : 'Đã tạo'}} bản ghi như sau:</span>
            </div>
            <ul class='activity-update text-left'>
              <li>Loại: <span>{{activity.on_leave == 0 ? 'Chấm công': 'Xin nghỉ'}}</span></li>
              <li>Chấm công: <span>{{activity.checkin_type}}</span></li>
              <li>Ca: <span>{{activity.shift_on}}</span></li>
              <li v-if="activity.hours">Số giờ: <span>{{activity.hours}}</span></li>
              <li>Trạng thái: <span>{{activity.status}}</span></li>
              <li>Kho: <span>{{getStationNameById(activity)}}</span></li>
            </ul>
          </li>
        </ul>
        <h4 v-else>Không có bản ghi lịch sử dữ liệu chấm công!</h4>
      </div>
    </b-modal>
  </div>
</template>

<script>
// custom components
import checkinManageService from 'domain/services/checkin-manage-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import userService from 'domain/services/user-service'

// entities
import CheckinLog from 'domain/entities/CheckinLog'

// helpers
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-update-checkin',
  components: {
    SingleSelectStation
  },

  data () {
    return {
      loading: false,
      editCheckinTime: false,
      editCheckoutTime: false,
      title: '',
      shifts: CheckinLog.shifts,
      checkinTypes: CheckinLog.checkinTypes,
      statuses: CheckinLog.statuses,
      shiftDetails: CheckinLog.shiftDetails,
      onLeaves: CheckinLog.onLeaves,
      leaveTypes: [],
      onLeavesEdit: CheckinLog.onLeavesEdit,
      btnAddTitle: '',
      checkinLog: {
        reason: null,
        checkin_time: null,
        work_hour: null,
        checkout_time: null,
        id: null,
        created: null,
        created_by: null,
        group_of_approver_level1: null,
        group_of_approver_level2: null,
        approved_level1_by: null,
        approved_level2_by: null,
        approved_level1_at: null,
        approved_level2_at: null,
        day_on: null,
        status: null,
        change_data: 0,
        shift_on: null,
        shift_detail: '',
        checkin_type: '',
        station_id: '',
        leave_type: '',
        work_type: null,
        on_leave: false
      },
      currentUser: {
        id: null,
        department: null,
        historyWorkType: [],
        workType: null,
        workTypeDes: null,
        position_job: null,
        fullName: null,
        stationId: null
      },
      checkinLogOld: {},
      workshiftActivities: null,
      loadingModal: false,
      loadingDetail: false
    }
  },
  props: {
    modalUpdateCheckinId: {
      type: String,
      default: 'modal-update-checkin'
    },
    historyModalId: {
      type: String,
      default: 'modal-checkin-history'
    },
    checkinId: {
      default: null
    },
    prStatus: {
      type: String
    },
    type: {
      type: String,
      default: 'edit'
    },
    datePicked: {
      default: null
    },
    userId: {
      default: null
    },
    histories: {
      type: Array
    }
  },

  watch: {
    type: {
      handler (newVal) {
        if (newVal === 'edit' || newVal === 'create') this.renderTextByType()
      },
      immediate: true
    },
    checkinId: {
      deep: true,
      handler (newVal) {
        if (newVal) this.getDetailCheckinLog()
      },
      immediate: true
    },
    prStatus: {
      handler (newVal) {
        if (newVal) this.checkinLog.status = (newVal !== 'update' ? newVal : (this.checkinLogOld.status ? this.checkinLogOld.status : 'approved'))
      },
      immediate: true
    },
    userId: {
      handler (newVal) {
        if (newVal) this.getCalendarInfo()
      },
      immediate: true
    },
    datePicked: {
      handler (newVal) {
        if (newVal) this.checkinLog.day_on = newVal
      },
      immediate: true
    },
    histories: {
      handler: function (val) {
        this.loadingModal = false
        this.workshiftActivities = JSON.parse(JSON.stringify(val))
      },
      deep: true
    }
  },

  computed: {
    emptyWorkShiftActivities () {
      return commonHelper.isEmpty(this.workshiftActivities)
    },
    formatedCheckinTime () {
      return this.checkinLog.checkin_time ? moment(this.checkinLog.checkin_time).format('YYYY-MM-DD HH:mm:ss') : 'Không có thời gian checkin'
    },
    formatedCheckoutTime () {
      return this.checkinLog.checkout_time ? moment(this.checkinLog.checkout_time).format('YYYY-MM-DD HH:mm:ss') : 'Không có thời gian checkout'
    },
    checkinStatus () {
      return CheckinLog.getCheckinStatus(this.checkinLog.status)
    },
    approveLevel1Text () {
      return this.checkinLog.approved_level1_by ? this.checkinLog.group_of_approver_level1 + ' ' + this.checkinLog.approved_level1_by + '/' + this.checkinLog.approved_level1_at : 'Chưa duyệt lần 1'
    },
    approveLevel2Text () {
      return this.checkinLog.approved_level2_by ? this.checkinLog.group_of_approver_level2 + ' ' + this.checkinLog.approved_level2_by + '/' + this.checkinLog.approved_level2_at : 'Chưa duyệt lần 2'
    },
    showMessage () {
      return !commonHelper.isEmpty(this.checkinLog.message)
    }
  },

  mounted () {
    this.renderTextByType()
  },

  created () {
    this.getLeaveType()
  },

  methods: {
    getLeaveType () {
      userService.getAllLeaveType()
        .then(res => {
          if (res.data.success) {
            this.leaveTypes = res.data.data
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu loại nghỉ phép!', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    renderTextByType () {
      if (this.type === 'create') {
        this.title = 'Tạo bản ghi chấm công'
        this.btnAddTitle = 'Thêm mới'
        this.checkinLog.status = 'approved'
        this.checkinLog.checkin_type = 'normal'
        this.checkinLog.shift_detail = null
        this.checkinLog.shift_on = 'none'
        this.checkinLog.on_leave = 'check_in'
        this.checkinLog.reason = null
        this.checkinLog.message = null
        this.checkinLog.leave_type = 1
        this.checkinLog.hours = null
        this.checkinLog.note = null
        // this.checkinLog.checkin_type = 'over_time'
        // this.allowEdit = false
      }
      if (this.type === 'edit') {
        this.title = 'Phê duyệt dữ liệu chấm công'
        this.btnAddTitle = 'Cập nhật'
        // this.allowEdit = true
      }
    },
    getCalendarInfo () {
      this.loading = true
      let params = {
        user_id: this.userId
      }
      userService.getUserDetailInfo(params)
        .then(res => {
          if (res.data.success) {
            let userInfo = res.data.userInfo
            this.currentUser.fullName = userInfo.fullName
            this.currentUser.position_job = userInfo.positionName
            this.currentUser.department = userInfo.departmentName
            this.currentUser.workType = userInfo.workType
            this.currentUser.workTypeDes = userInfo.workTypeDes
            this.currentUser.id = userInfo.userId
            this.currentUser.stationId = userInfo.station
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu người dùng!', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },

    hideModal: function () {
      this.resetDefault()
    },

    openHistoryModal () {
      this.loadingModal = true
      this.$emit('getHistories', this.checkinLog.id)
      this.$bvModal.show(this.historyModalId)
    },
    editCheckinLog () {
      if (this.type === 'edit') {
        this.changeDataOfCheckinLog()
      }
      if (this.type === 'create') {
        this.createCheckinLog()
      }
    },
    changeDataOfCheckinLog () {
      let params = {
        checkin_id: this.checkinLog.id,
        status: this.checkinLog.status,
        shift_on: this.checkinLog.shift_on,
        shift_detail: this.checkinLog.shift_detail,
        checkin_type: this.checkinLog.checkin_type,
        station_id: this.checkinLog.station_id,
        leave_type: this.checkinLog.leave_type,
        change_data: 1
      }
      if (this.currentUser.work_type === 'by_hours' && this.checkinLog.hours && (this.checkinLog.hours <= 0 || this.checkinLog.hours > 16)) {
        commonHelper.showMessage('Số giờ cần lớn hơn 0 và nhỏ hơn 16 giờ')
        return false
      }
      if (this.checkinLog.status !== 'approved' && this.checkinLog.status !== 'rejected') {
        commonHelper.showMessage('Bạn chưa chọn DUYỆT hay TỪ CHỐI bản ghi chấm công!', 'warning')
        return false
      }
      if (!this.checkinLog.station_id) {
        commonHelper.showMessage('Vui lòng chọn kho làm việc')
        return false
      }
      if (!this.checkinLog.shift_on || this.checkinLog.shift_on === 'draft') {
        commonHelper.showMessage('Ca làm việc không hợp lệ', 'warning')
        return false
      }
      if (this.checkinLog.shift_on === 'day' || this.checkinLog.shift_on === 'night') params.hours = this.checkinLog.hours
      if (moment(this.checkinLog.checkin_time).format('YYYY-MM-DD HH:mm:ss') !== moment(this.checkinLogOld.checkin_time).format('YYYY-MM-DD HH:mm:ss')) params.checkin_time = moment(this.checkinLog.checkin_time).format('YYYY-MM-DD HH:mm:ss')
      if (moment(this.checkinLog.checkout_time).format('YYYY-MM-DD HH:mm:ss') !== moment(this.checkinLogOld.checkout_time).format('YYYY-MM-DD HH:mm:ss')) params.checkout_time = moment(this.checkinLog.checkout_time).format('YYYY-MM-DD HH:mm:ss')
      this.loading = true
      checkinManageService.changeDataOfCheckinLog(params)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message || 'Cập nhật dữ liệu thành công!', 'success')
            this.$emit('changeDataOfCheckinLog', params)
            this.$bvModal.hide(this.modalUpdateCheckinId)
          } else {
            commonHelper.showMessage(res.data.message || 'Có lỗi xảy ra khi cập nhật dữ liệu chấm công!', 'warning')
          }
        })
        .then(() => {
          // this.getDetailCheckinLog()
          this.$emit('reloadCalendar', true)
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    createCheckinLog () {
      let params = {
        day_on: this.checkinLog.day_on,
        checkin_type: this.checkinLog.checkin_type,
        shift_on: this.checkinLog.shift_on,
        shift_detail: this.checkinLog.shift_detail,
        user_id: this.currentUser.id,
        station_id: this.checkinLog.station_id,
        work_type_id: this.currentUser.workType,
        on_leave: this.checkinLog.on_leave,
        leave_type: this.checkinLog.leave_type
      }
      if (this.checkinLog.checkin_type === 'over_time') params.note = this.checkinLog.note
      if (this.checkinLog.shift_on === 'day' || this.checkinLog.shift_on === 'night') params.work_hour = this.checkinLog.hours
      this.loading = true
      checkinManageService.createCheckinLog(params)
        .then(res => {
          if (res.data.success) {
            this.loading = false
            commonHelper.showMessage(res.data.message || 'Thêm mới dữ liệu thành công', 'success')
            this.$bvModal.hide(this.modalUpdateCheckinId)
          } else {
            commonHelper.showMessage(res.data.message || 'Có lỗi xảy ra trong quá trình thêm mới dữ liệu!', 'warning')
          }
        })
        .then(() => {
          this.$emit('reloadCalendar', true)
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    getDetailCheckinLog () {
      let params = {
        checkin_id: this.checkinId
      }
      this.loadingDetail = true
      checkinManageService.getDetailCheckinLog(params)
        .then(res => {
          if (res.data.success) {
            this.checkinLog = res.data.data
            if (this.checkinLog.checkin_time) this.checkinLog.checkin_time = moment(this.checkinLog.checkin_time).format('YYYY-MM-DDTkk:mm')
            if (this.checkinLog.checkout_time) this.checkinLog.checkout_time = moment(this.checkinLog.checkout_time).format('YYYY-MM-DDTkk:mm')
            this.checkinLogOld = JSON.parse(JSON.stringify(this.checkinLog))
            if (this.prStatus) {
              this.checkinLog.status = (this.prStatus !== 'update' ? this.prStatus : this.checkinLog.status)
            }
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu chấm công!', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loadingDetail = false
        })
    },
    resetDefault () {
      this.$emit('checkinId', null)
      this.$emit('type', null)
      this.editCheckinTime = false
    },
    getStationNameById (activity) {
      let cacheKey = 'allStationOfGHTK'
      let listStationCached = sessionStorage.getItem(cacheKey)
      let station = listStationCached ? JSON.parse(listStationCached).find(item => Number(item.id) === Number(activity.station_id)) : ''
      return station ? station.name : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.aui-panel {
  border: 1px solid #ccc;
  border-radius: 6px;
  display: block;
  margin: 10px 0;
  padding: 12px;
  position: relative;
}
.bg-light-grey {
  background-color: #f5f5f5 !important;
  padding: 14px 15px 15px !important;
  margin-bottom: 0 !important;
  text-align: right !important;
  background-color: #f5f5f5 !important;
  border-top: 1px solid #ddd !important;
}

#modal-update-checkin, #edit-checkin-log{
  .modal-status {
    font-size: 16px;
    font-family: Arial, sans-serif;
    position: absolute;
    padding: 5px 65px;
    color: #fff;
    font-weight: bold;
    transform: rotate(45deg);
    left: -42px;
    bottom: 30px;
  }
  .fw-b-grey {
    color: #707070;
  }
  .pending {
    background: #c0c0c0;
    padding: 5px 42px;
    left: -44px;
    bottom: 37px;
  }
  .approved {
    background: #088a4b;
  }
  .rejected {
    background: #df6161;
  }
  .rejected_by_autojob {
    background: #df6161;
    left: -66px;
    bottom: 40px;
  }
  .input-checkin-date{
    font-size: 14px;
  }
}
.text-underline-hover:hover {
  text-decoration: underline;
}
.modal-content {
  overflow: hidden;
}
.modal-header {
  background-color: #fff !important;
}
.text-align-left {
  text-align: left;
  padding: 5px;
  font-size: 15px;
}
.btn-edit-time {
  height: 25px;
  width: 25px;
  padding: 2px 2px;
}

</style>

<style lang="css" scoped>
.custom-select >>> option:disabled {
  background: #e9e7e7;
}
</style>
