<template>
  <div>
    <b-modal id="modal-add-work-transfer" v-model="show" static size="lg" @show="caclProfile(users)" @hidden="close">
      <div slot="modal-title">
        Thêm lịch sử công tác<b-button variant="link" @click="showLog = true">(Xem lịch sử thay đổi)</b-button>
      </div>
      <div class="col-md-12">
        <b-form-row>
            <b-form-group label="Ngày ban hành" class="col-md-4">
                <datepicker
                    v-model="enacted"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="Ngày ban hành"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                />
            </b-form-group>
            <b-form-group label="Ngày hiệu lực" class="col-md-4">
                <datepicker
                    v-model="startDate"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    placeholder="Ngày hiệu lực"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                />
            </b-form-group>
            <b-form-group label="Phân loại" class="col-md-4 ctm-required">
                <b-form-select v-model="type" :options="typeOptions" placeholder="Chọn loại thay đổi"></b-form-select>
            </b-form-group>

        </b-form-row>

        <!-- Thay đổi kho -->
        <b-form-row v-if="type === 'station'">
             <b-form-group label="Thay đổi từ" class="col-md-6 ctm-required">
                <single-select-station
                    @handleSelectedStation="data => onSelect(data, 'station', 'from')"
                    selectLabel="Chọn"
                />
            </b-form-group>

            <b-form-group label="Thay đổi thành" class="col-md-6 ctm-required">
                <single-select-station
                    @handleSelectedStation="data => onSelect(data, 'station', 'to')"
                    selectLabel="Chọn"
                />
            </b-form-group>
        </b-form-row>

        <!-- Vị trí -->
        <b-form-row v-if="type === 'position'">
             <b-form-group label="Thay đổi từ" class="col-md-6 ctm-required">
                <single-select-position @handleSelectedPosition="data => onSelect(data, 'position','from')" />
            </b-form-group>

            <b-form-group label="Thay đổi thành" class="col-md-6 ctm-required">
                <single-select-position @handleSelectedPosition="data => onSelect(data, 'position', 'to')" />
            </b-form-group>
        </b-form-row>

        <!-- Hình thức -->
        <b-form-row v-if="type === 'jobType'">
             <b-form-group label="Thay đổi từ" class="col-md-6 ctm-required">
                <single-select-work-type @handleSelectedWorkType="data => onSelect(data, 'jobType', 'from')"
                :position-job="positionJob"
                />
            </b-form-group>
            <b-form-group label="Thay đổi thành" class="col-md-6 ctm-required">
                <single-select-work-type @handleSelectedWorkType="data => onSelect(data, 'jobType', 'to')"
                :position-job="positionJob"
                />
            </b-form-group>
        </b-form-row>

        <!-- Bổ nhiệm / giáng chức -->
        <b-form-row v-if="type === 'appoint' || type === 'reduction'">
             <b-form-group label="Thay đổi từ" class="col-md-6 ctm-required">
                <single-select-duty @handleSelected="data => onSelect(data, 'duty', 'from')"/>
            </b-form-group>

            <b-form-group label="Thay đổi thành" class="col-md-6 ctm-required">
               <single-select-duty @handleSelected="data => onSelect(data, 'duty', 'to')"/>
            </b-form-group>
        </b-form-row>

        <b-form-row class="ctm-last-row">
            <b-form-group label="Thời gian thử thách (tháng)" class="col-md-4">
              <b-form-input type="number" v-model="probationary" min="0"></b-form-input>
            </b-form-group>
             <b-form-group label="Người đề xuất" class="col-md-4">
                <single-select-user @onChange="data => selectUser(data, 'proposer')" :reset="resetSelectUser" :isSelectMainUser="'yes'"/>
            </b-form-group>
            <b-form-group label="Người quyết định" class="col-md-4">
                <single-select-user @onChange="data => selectUser(data, 'approver')" :reset="resetSelectUser" :isSelectMainUser="'yes'"/>
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
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import SingleSelectDuty from 'components/elements/common/SingleSelectDuty'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import commonHelper from 'infrastructures/helpers/common-helpers'
import userService from 'domain/services/user-service'
import ModalProfileLog from './ModalProfileLog'
import moment from 'moment'

function initialState () {
  return {
    show: false,
    showLog: false,
    enacted: null,
    startDate: null,
    type: null,
    file: null,
    proposer: null,
    approver: null,
    probationary: 0,
    typeOptions: [
      { value: null, text: 'Chọn loại thay đổi' },
      { value: 'station', text: 'Kho' },
      { value: 'position', text: 'Vị trí' },
      { value: 'jobType', text: 'Hình thức' },
      { value: 'appoint', text: 'Bổ nhiệm' },
      { value: 'reduction', text: 'Giáng chức' }
    ],
    station: {
      from: null,
      to: null
    },
    position: {
      from: null,
      to: null
    },
    duty: {
      from: null,
      to: null
    },
    jobType: {
      from: null,
      to: null
    },
    positionJob: '',
    profiles: '',
    from: null,
    to: null,
    fromText: null,
    toText: null,
    resetSelectUser: false
  }
}

export default {
  components: {
    Datepicker,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectWorkType,
    SingleSelectDuty,
    SingleSelectUser,
    ModalProfileLog
  },

  props: {
    open: {default: false},
    users: {default: []}
  },

  data: () => initialState(),

  watch: {
    open (status) {
      this.show = status
    }
  },

  methods: {
    onSelect (data, type, subType) {
      if (subType === 'from') this[type].from = data
      if (subType === 'to') this[type].to = data
    },

    selectUser (user, type) {
      if (type === 'proposer') this.proposer = user
      if (type === 'approver') this.approver = user
    },

    async done () {
      let validate = this.basicValidate()
      if (validate.status) {
        this.caclFromTo()
        try {
          this.$startLoading()

          let reqData = new FormData()
          reqData.append('masterProfileId', this.$route.params.id)
          reqData.append('file', this.file)
          reqData.append('type', this.type)
          if (this.enacted) reqData.append('enacted', moment(this.enacted).format('YYYY-MM-DD'))
          if (this.startDate) reqData.append('startDate', moment(this.startDate).format('YYYY-MM-DD'))
          reqData.append('from', this.from)
          reqData.append('to', this.to)
          reqData.append('fromText', this.fromText)
          reqData.append('toText', this.toText)
          if (this.proposer) reqData.append('proposer', this.proposer.id)
          if (this.approver) reqData.append('approver', this.approver.id)
          if (this.probationary) reqData.append('probationary', this.probationary)

          const {data} = await userService.updateWorkHistory(reqData)
          if (data.success) {
            this.$emit('refresh')
            commonHelper.showMessage('Thêm lịch sử công tác thành công', 'success')
            this.close()
          } else {
            commonHelper.showMessage(data.message, 'warning')
          }
        } catch (e) {
          commonHelper.showMessage(e.message, 'warning')
        } finally {
          this.$stopLoading()
        }
      } else {
        commonHelper.showMessage(validate.message, 'warning')
      }
    },

    basicValidate () {
      if (this.type === null) return { status: false, message: 'Vui lòng chọn loại thay đổi' }
      if (this.type === 'station' && (!this.station.from || !this.station.to)) return { status: false, message: 'Vui lòng chọn kho trước và sau khi thay đổi' }
      if (this.type === 'position' && (!this.position.from || !this.position.to)) return { status: false, message: 'Vui lòng chọn vị trí trước và sau khi thay đổi' }
      if (this.type === 'jobType' && (!this.jobType.from || !this.jobType.to)) return { status: false, message: 'Vui lòng chọn hình thức làm việc trước và sau khi thay đổi' }
      if ((this.type === 'appoint' || this.type === 'reduction') && (!this.duty.from || !this.duty.to)) return { status: false, message: 'Vui lòng chọn chức vụ trước và sau khi thay đổi' }
      if (this.probationary < 0) return { status: false, message: 'Thời gian thử thách không hợp lệ' }
      return {status: true}
    },

    caclFromTo () {
      if (this.type === 'appoint' || this.type === 'reduction') {
        this.from = this.duty.from.id
        this.to = this.duty.to.id
        this.fromText = this.duty.from.name
        this.toText = this.duty.to.name
      } else {
        this.from = this[this.type].from.id
        this.to = this[this.type].to.id
        this.fromText = this[this.type].from.name
        this.toText = this[this.type].to.name
      }
    },

    close () {
      this.$emit('toggle', false)
      Object.assign(this.$data, initialState())
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

<style>
.ctm-last-row {
  align-items: center;
}

.ctm-required .col-form-label:after {
  content:"*";
  color:red;
}

.custom-file-label{
  z-index: 0
}

.custom-file-input{
  z-index: 0;
}
</style>
