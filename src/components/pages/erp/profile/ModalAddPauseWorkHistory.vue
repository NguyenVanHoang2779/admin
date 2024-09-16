<template>
  <div>
    <b-modal id="modal-add-work-transfer" v-model="show" static size="lg" @show="caclProfile(users)" @hidden="close">
      <div slot="modal-title">
        {{ modalTitle }}<b-button variant="link" @click="showLog = true">(Xem lịch sử thay đổi)</b-button>
      </div>
      <div class="col-md-12">
        <b-form-row>
            <b-form-group :label="startDateLabel" class="col-md-4 ctm-required" v-if="showStartDate">
                <datepicker
                    v-model="startDate"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="Ngày bắt đầu nghỉ"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                />
            </b-form-group>
            <b-form-group label="Ngày kết thúc" class="col-md-4 ctm-required" v-if="showEndDate">
                <datepicker
                    v-model="endDate"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="Ngày kết thúc"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                />
            </b-form-group>
            <b-form-group label="Ngày phê duyệt" class="col-md-4">
                <datepicker
                    v-model="dateOfApproval"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="Ngày phê duyệt"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                />
            </b-form-group>
            <b-form-group label="Loại thay đổi" class="col-md-12 ctm-required">
                <b-form-select v-model="type" :options="typeOptions" placeholder="Chọn loại thay đổi"></b-form-select>
            </b-form-group>
            <b-form-group v-if="reasonOptions" label="Lý do" class="col-md-12 ctm-required">
              <b-form-select
                v-model="reason"
                :options="reasonOptions"
              >
              </b-form-select>
            </b-form-group>
            <b-form-group label="Chọn loại bảo hiểm" class="col-md-12">
              <b-form-select
                v-model="planInsurance"
                :options="insuranceOptions"
                placeholder="Chọn loại thay đổi">
              </b-form-select>
            </b-form-group>
        </b-form-row>
        <b-form-row v-if="showPaidOption">
          <b-form-group label="Trả lương" :class="{'col-md-6': showPaidPercent, 'col-md-12': !showPaidPercent}" class="ctm-required">
            <b-form-select
              v-model="paid"
              :options="paidOptions"
            >
            </b-form-select>
          </b-form-group>
          <b-form-group label="% Phạt lương" class="col-md-6 ctm-required" v-if="showPaidPercent">
            <b-form-input v-model="paidInPercent" placeholder="Nhập % lương" type="number"></b-form-input>
          </b-form-group>
        </b-form-row>
        <b-form-row v-if="showOtherInput">
             <b-form-group label="Lý do khác" class="col-md-12 ctm-required">
              <b-form-textarea
                id="textarea"
                v-model="otherReason"
                placeholder="Nhập lý do..."
                rows="1"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
        </b-form-row>
        <b-form-row v-if="showNoteInput">
             <b-form-group label="Ghi chú" class="col-md-12 ctm-required">
                <b-form-textarea
                  id="textarea"
                  v-model="otherReason"
                  placeholder="Thêm ghi chú..."
                  rows="1"
                  max-rows="6"
                ></b-form-textarea>
            </b-form-group>
        </b-form-row>
        <b-form-row class="ctm-last-row">
            <b-form-group label="Người đề xuất" class="col-md-6">
              <single-select-user
                @onChange="data => selectUser(data, 'proposer')"
                :reset="resetSelectUser"
                :isSelectMainUser="'yes'"
              />
            </b-form-group>
            <b-form-group label="Người quyết định" class="col-md-6">
              <single-select-user
                @onChange="data => selectUser(data, 'approver')"
                :reset="resetSelectUser"
                :isSelectMainUser="'yes'"
              />
            </b-form-group>
        </b-form-row>
        <b-form-row>
          <b-form-file v-model="file" drop-placeholder="Tệp đính kèm..."></b-form-file>
        </b-form-row>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="close()">Hủy</button>
        <button type="button" class="btn btn-primary" @click="done">Đồng ý</button>
      </template>
    </b-modal>
    <ModalProfileLog :show="showLog" @close="showLog = false" :profile-id="profiles"></ModalProfileLog>
    <b-modal v-if="isUpdateStatusMp" id="modal-confirm-change-status-mp" title="Cập nhật trạng thái tạm dừng/ Ngừng công tác" centered hide-footer>
      <p class="text-center" style="font-size: 16px">Việc cập nhật này sẽ làm thay đổi trạng thái MP của nhân viên. Bạn có chắc chắn muốn xác nhận?</p>
      <div class="d-flex justify-content-center mt-2">
        <b-btn variant="ghtk" @click="confirmAddPauseWorkHistory" class="w-50">Xác nhận</b-btn>
      </div>
    </b-modal>
    <b-modal v-else id="modal-confirm-add-log-work-history" title="Thêm log lịch sử tạm dừng/ Ngừng công tác" centered hide-footer>
      <p class="text-center" style="font-size: 16px">Thao tác này chỉ bổ sung log lịch sử công tác và không làm thay đổi trạng thái của MP. Bạn có chắc chắn muốn xác nhận?</p>
      <div class="d-flex justify-content-center mt-2">
        <b-btn variant="ghtk" @click="confirmAddLogPauseWorkHistory" class="w-50">Xác nhận</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import commonHelper from 'infrastructures/helpers/common-helpers'
import userService from 'domain/services/user-service'
import ModalProfileLog from './ModalProfileLog'
import moment from 'moment'
import pauseWork from './PauseWorkConst'

function initialState () {
  return {
    show: false,
    showLog: false,
    reason: null,
    otherReason: '',
    showOtherInput: false,
    startDate: null,
    endDate: null,
    type: null,
    file: null,
    proposer: null,
    approver: null,
    dateOfApproval: null,
    typeOptions: pauseWork.pausWorkOptions,
    positionJob: '',
    profiles: '',
    resetSelectUser: false,
    reasonOptions: null,
    note: '',
    showNoteInput: false,
    paidOptions: pauseWork.paidOptions,
    showPaidOption: false,
    paid: '',
    paidInPercent: 0,
    showPaidPercent: false,
    quitWorkType: null,
    planInsurance: null,
    insuranceOptions: pauseWork.insuranceOptions,
    showEndDate: true,
    showStartDate: true,
    resignType: null,
    startDateLabel: 'Ngày bắt đầu nghỉ',
    cancelResignOptions: pauseWork.cancelResignOptions
  }
}

export default {
  components: {
    Datepicker,
    SingleSelectUser,
    ModalProfileLog
  },

  props: {
    open: {default: false},
    users: {default: []},
    isUpdateStatusMp: {default: false},
    modalTitle: {
      type: String,
      required: true
    }
  },

  data: () => initialState(),

  watch: {
    open (status) {
      this.show = status
    },
    paid (val) {
      if (val === 'Phạt lương') {
        this.paidInPercent = 0
        this.showPaidPercent = true
      } else if (val === 'Không trả lương') {
        this.paidInPercent = 100
        this.showPaidPercent = true
      } else {
        this.showPaidPercent = false
        this.paidInPercent = 0
      }

      this.note = val
    },
    paidInPercent (val) {
      if (val) this.note = `${this.paid}: Phạt ${val}% lương`
    },
    type (val) {
      this.showPaidOption = false
      this.reason = null
      this.resignType = null
      switch (val) {
        case 'suspend':
          this.reasonOptions = pauseWork.suspendOptions
          this.quitWorkType = 'pause'
          this.showEndDate = true
          this.showStartDate = true
          break
        case 'off_no_salary':
          this.reasonOptions = pauseWork.unpaidLeaveOptions
          this.quitWorkType = 'pause'
          this.showEndDate = true
          this.showStartDate = true
          break
        case 'pause':
          this.reasonOptions = pauseWork.pauseContract
          this.quitWorkType = 'pause'
          this.showEndDate = true
          this.showStartDate = true
          break
        case 'normal_quit':
          this.reasonOptions = pauseWork.normalLeaveOptions
          this.quitWorkType = 'resign'
          this.showEndDate = false
          this.showStartDate = true
          this.resignType = 'nghi_dung_quy_trinh'
          break
        case 'arbitrarily_quit':
          this.showPaidOption = true
          this.reasonOptions = pauseWork.immediatelyResign
          this.quitWorkType = 'resign'
          this.showEndDate = false
          this.showStartDate = true
          this.resignType = 'nghi_ngang'
          break
        case 'fired':
          this.showPaidOption = true
          this.reasonOptions = pauseWork.firedOptions
          this.quitWorkType = 'resign'
          this.showEndDate = false
          this.showStartDate = true
          this.resignType = 'sa_thai'
          break
        case 'comeback':
          this.reasonOptions = pauseWork.reactivateOptions
          this.quitWorkType = 'cancleResign'
          this.showEndDate = false
          this.showStartDate = true
          break
        default:
          this.reasonOptions = null
          break
      }
    },
    reason (v) {
      if (v === 'Khác') this.showOtherInput = true
      else {
        this.showOtherInput = false
        this.otherReason = ''
      }
    },
    showPaidOption (v) {
      if (!v) {
        this.paid = ''
        this.paidInPercent = 0
      }
    },
    quitWorkType (v) {
      if (v === 'cancleResign') this.startDateLabel = 'Ngày bắt đầu đi làm lại'
      else this.startDateLabel = 'Ngày bắt đầu nghỉ'
    }
  },

  methods: {
    selectUser (user, type) {
      if (type === 'proposer') this.proposer = user
      if (type === 'approver') this.approver = user
    },

    confirmAddPauseWorkHistory () {
      if (this.quitWorkType === 'cancleResign') this.addCancelPauseWorkHistory()
      else this.addPauseWorkHistory()
    },

    confirmAddLogPauseWorkHistory () {
      this.addLogPauseWorkHistory()
    },

    done () {
      let validate = this.basicValidate()
      if (validate.status) {
        if (this.isUpdateStatusMp) {
          this.$bvModal.show('modal-confirm-change-status-mp')
        } else {
          this.$bvModal.show('modal-confirm-add-log-work-history')
        }
      } else {
        commonHelper.showMessage(validate.message, 'warning')
      }
    },

    async addPauseWorkHistory () {
      try {
        this.$startLoading()
        let reqData = this.genCommonRequestData()
        const {data} = await userService.updatePauseWorkHistory(reqData)
        if (data.success) {
          this.$emit('refreshParent')
          this.$emit('refresh')
          commonHelper.showMessage('Thêm lịch sử công tác thành công', 'success')
          return this.close()
        }
        commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },
    async addCancelPauseWorkHistory () {
      this.$startLoading()
      let reqData = this.genCommonRequestData()
      try {
        reqData.append('id', this.$route.params.id)
        reqData.append('reason', this.reason)
        const {data} = await userService.addCancelPauseWorkHistory(reqData)
        if (data.success) {
          this.$emit('refreshParent')
          this.$emit('refresh')
          commonHelper.showMessage('Thêm lịch sử công tác thành công', 'success')
          return this.close()
        }
        commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },
    async addLogPauseWorkHistory () {
      try {
        this.$startLoading()
        let reqData = this.genCommonRequestData()
        const {data} = await userService.addLogPauseWorkHistory(reqData)
        if (data.success) {
          this.$emit('refreshParent')
          this.$emit('refresh')
          commonHelper.showMessage('Thêm lịch sử công tác thành công', 'success')
          return this.close()
        }
        commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },
    genCommonRequestData () {
      let reqData = new FormData()
      reqData.append('id', this.$route.params.id)
      reqData.append('file', this.file)
      reqData.append('type', this.type)
      if (this.planInsurance) reqData.append('plan_insurance', this.planInsurance)
      reqData.append('quit_work_type', this.quitWorkType)
      reqData.append('resign_fine', this.paidInPercent)
      if (this.resignType) reqData.append('resign_type', this.resignType)
      if (this.quitWorkType === 'cancleResign') {
        if (this.startDate) {
          reqData.append('startDate', moment(this.startDate).format('YYYY-MM-DD'))
          reqData.append('comebackDate', moment(this.startDate).format('YYYY-MM-DD'))
        }
      } else {
        if (this.startDate) reqData.append('startDate', moment(this.startDate).format('YYYY-MM-DD'))
        if (this.endDate) reqData.append('endDate', moment(this.endDate).format('YYYY-MM-DD'))
      }
      if (this.endDate) reqData.append('dateOfApproval', moment(this.dateOfApproval).format('YYYY-MM-DD'))
      if (this.proposer) reqData.append('proposer', this.proposer.id)
      if (this.approver) reqData.append('approver', this.approver.id)
      reqData.append('resign_reason', this.reason === 'Khác' ? this.otherReason : this.reason)
      reqData.append('note', this.note)
      if (this.quitWorkType === 'cancleResign') {
        reqData.append('resign_type', 'cancel_resign')
        if (this.reason === this.cancelResignOptions.find(item => item.value === 'comeback').text) {
          reqData.append('comeback_type', 'normal')
        }
      }

      return reqData
    },
    basicValidate () {
      if (this.type === null) return { status: false, message: 'Vui lòng chọn loại thay đổi' }
      if (this.showPaidOption && !this.paid) return { status: false, message: 'Vui lòng chọn hình thức trả lương' }
      if (!this.reason) return { status: false, message: 'Vui lòng thêm lý do nghỉ việc' }
      if (this.paidInPercent && this.paidInPercent < 0) return { status: false, message: '% phạt lương không hợp lệ' }
      if (this.showPaidPercent && !this.paidInPercent) return { status: false, message: 'Vui lòng nhập % phạt lương' }

      return {status: true}
    },

    close () {
      Object.assign(this.$data, initialState())
      this.$bvModal.hide('modal-confirm-change-status-mp')
      this.$bvModal.hide('modal-confirm-add-log-work-history')
      this.$emit('toggle', false)
    },

    caclProfile (userList) {
      userList.forEach(u => {
        this.positionJob += `${u.EmpPosition.id},`
        this.profiles += `${u.EmpProfile.id},`
      })

      this.resetSelectUser = !this.resetSelectUser
    }
  }
}
</script>
