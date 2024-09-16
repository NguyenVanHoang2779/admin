<template>
  <div>
    <table class="table-candidate-list table" style="max-height: 68vh">
      <thead>
      <tr class="header-row">
        <th class="text-center candidate-col">Thông tin ứng viên</th>
        <th class="text-center log-col">Chi tiết log</th>
        <th class="text-center action-col">Thao tác</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(candidate, idx) in getListCandidates()" :key="idx" class="table-candidate-content">
        <td class="info-col-content">
          <div class="candidate-info-wrap">
            <div class="candidate-info-container">
              <div class="d-flex" style="flex: 1">
                <div class="image-user">
                  <img v-bind:src="candidate.avatar || defaultAvatar" alt="">
                </div>
                <div class="candidate-info">
                  <div>
                    <strong>{{candidate.name}}</strong> <strong style="color: #069255">{{getAppointment(candidate)}}</strong>
                  </div>
                  <div v-if="candidate.job">
                    <span>{{candidate.job.name || ''}}</span>
                  </div>
                  <div>
                    <span>Khu vực đăng ký: </span>
                    <span v-if="candidate.job_district">{{candidate.job_district.name }}</span>
                    <span v-if="candidate.job_province">{{ candidate.job_province.name}}</span>
                  </div>
                  <Document v-if="showDocumentInfo" :candidateId="candidate.id" :documents="getDocument(candidate.id)" @showDocumentCandidate="showDocument"></Document>
                </div>
              </div>
              <div class="candidate-info-action">
                <div>
                  <b-btn
                    variant="outline-ghtk"
                    class="action-btn btn-pill btn-sm candidate-info-action__btn"
                    @click="openLink('/adm/recruitment/candidate/edit/' + candidate.id)"
                    id='candidate-btn-view'
                    name='candidate-btn-view'
                  >
                    Xem
                  </b-btn>
                </div>
                <div>
                  <b-btn
                    variant="outline-ghtk"
                    id='candidate-btn-call'
                    name='candidate-btn-call'
                    class="action-btn btn-pill btn-sm mt-2 candidate-info-action__btn"
                    @click="openModalContact(candidate)"
                  >
                    Gọi
                  </b-btn>
                </div>
                <div>
                  <b-btn
                    variant="outline-ghtk"
                    id='candidate-btn-call'
                    name='candidate-btn-call'
                    class="action-btn btn-pill btn-sm mt-2 candidate-info-action__btn"
                    @click="toChannelChat(candidate.id)">
                    Chat
                  </b-btn>
                </div>
              </div>
            </div>
            <div class="candidate-tag">
              <div class="candidate-status-box" v-for="status in statuses.filter((v) => { return v.id !== 'saveinfo' })" :key="status.id">
                <div @click="onClickTagStatus(candidate, status.id)">
                  <div :class="getClassTagStatus(candidate.status, status.id)">{{ status.name }}</div>
                </div>
              </div>
              <div class="candidate-tag-box" v-for="(tag) in candidate.tags" :key="tag.id">
                <div class="candidate-tag-item">{{ tag.name }}</div>
                <i @click="detachTag(candidate, tag)" class="candidate-delete-tag fa fa-times-circle"></i>
              </div>
              <b-button class="tag-manage" pill size="sm" variant="outline-secondary" @click="openTagManage(candidate)">+ Tag</b-button>
            </div>
          </div>
        </td>
        <td class="log-col-content">
          <time-line
            :item-style="{'padding': '0px', 'fontSize': '14px'}"
            :message-field="'message'"
            :logs="candidate.logs"
            :time-field="'time'"
          ></time-line>
        </td>
        <td class="text-center action-col-content">
          <div>
            <b-btn
              v-if="isInStatusMain(candidate) && !candidate.explained"
              variant="outline-ghtk"
              class="action-btn btn-sm w-50"
              @click="makeAppointment(candidate)">Hẹn lịch</b-btn>
            <b-btn
              v-if="candidate.status === 'expect_join' && !candidate.explained" variant="outline-ghtk"
              class="action-btn mt-2 btn-sm w-50"
              @click="showModalCreateUser(candidate)">Duyệt</b-btn>
            <b-btn
              variant="outline-ghtk"
              class="action-btn mt-2 btn-sm w-50"
              @click="openModalNote(candidate)">Ghi chú</b-btn>
            <b-btn
              v-if="isInStatusMain(candidate) && !candidate.explained"
              variant="outline-danger"
              class="action-btn mt-2 btn-sm w-50"
              @click="openModalRejectCandidate(candidate)">Từ chối</b-btn>
            <b-btn
              v-if="isCloseShift && isInStatusMain(candidate) && !candidate.explained"
              variant="outline-danger"
              class="action-btn mt-2 btn-sm w-50"
              @click="onClickExplanation(candidate)">Giải trình</b-btn>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <ModalRejectCandidate
      :curCandidate="curCandidate"
      @rejectCandidate="rejectCandidate"
      @hideModal="resetCandidate"
    >
    </ModalRejectCandidate>
    <ModalNote
      :modal-id="'candidate-note-modal'"
      @makeNote="noteCandidate"
      @hideModal="resetCandidate">
    </ModalNote>
    <ModalContactCandidate
      :candidate="curCandidate"
      @hideModal="resetCandidate"
    >
    </ModalContactCandidate>
    <ModalReviewCandidate
      :candidate="curCandidate"
      :reviewType="reviewType"
      @reviewCandidateSuccess="openModalMakeAppoint(curCandidate)"
    >
    </ModalReviewCandidate>
    <ModalMakeAppoint
      id="modal-make-appoint"
      :appointment-type="appointmentType"
      :next-status="appointmentType"
      :candidate="curCandidate"
      :idStation="curCandidate ? curCandidate.station_id : ''"
      @updateAppointmentOk="updateAppointmentOk"
      :text-action-save="'Cập nhật thông tin'"
      @closeModal="resetDataModalMakeAppointment"
    ></ModalMakeAppoint>
    <ModalCreateUser
      id="modal-quick-create-user"
      :candidate="curCandidate"
      :jobId="jobId || ''"
      :candidateJobId="candidateJobId || ''"
      @createUserSuccess="hideModalCreateUser"
    >
    </ModalCreateUser>
    <ModalViewDocument
      :currentDocument="currentDocument"
    ></ModalViewDocument>
  </div>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}

.action-btn {
  border-radius: 20px;
  text-align: center;
  .action-btn__explain {
    border: 1px solid #D40000;
    color: #D40000;
  }
  .action-btn__explain:hover {
    color: #FFFFFF;
  }
}

.candidate-tag {
  margin: 5px;
  .candidate-tag-box{
    background-color: #069255;
    color: #fff;
    text-align: center;
    display: inline-block;
    position: relative;
    margin: 5px;
    &:hover .candidate-delete-tag{
      display: block;
    }
    .candidate-tag-item{
      padding: 6px 18px;
      cursor: pointer;
    }
  }
  .candidate-status-box{
    background-color: #ccc;
    color: #fff;
    text-align: center;
    display: inline-block;
    position: relative;
    margin: 5px;
    &:hover{
      background-color: #069255;
    }
    .candidate-status-item{
      padding: 6px 10px;
      cursor: pointer;
      &.active{
        background-color: #069255;
      }
    }
  }
  .candidate-delete-tag{
    display: none;
    position: absolute;
    top: -5px;
    right: -5px;
    color: #000;
    cursor: pointer;
  }
}

.tag-manage {
  font-size: 0.894rem;
  padding: 6px 18px;
  color: #069255;
  border: 0;
  background: none;
  &:focus{
    box-shadow: none
  }
  .focus{
    box-shadow: none
  }
}

.btn-filter-tag {
  margin: 5px;
}

.tag-filter {
  overflow-x: auto;
  display: flex;
}

.table-candidate-content {
  .info-col-content .candidate-info-wrap {
    display: block;
  }
}

.candidate-info-container {
  width: 100%;
  display: flex;
}

.candidate-info-action {
  width: 20%;
  text-align: right;
  .candidate-info-action__btn {
    width: 50px;
  }
}

.candidate-info {
  width: 82%;
}

.image-user {
  padding: 5px 5px 5px 5px;
  width: 66px;
  height: 66px;
}

.image-user img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.table-candidate-list {
  min-height: 25vh;
  max-height: 75vh;
  overflow: auto;
  border: 1px solid #f1f1f2;
  background-color: #fff;
  thead {
    width: 100%;
    .header-row {
      .candidate-col {
        width: 30%;
      }
      .log-col {
        width: 55%;
      }
      .action-col {
        width: 15%;
      }
      .candidate-col, .log-col, .action-col {
        font-weight: bolder;
        height: 3rem;
        vertical-align: middle;
        background-color: #f7f7f7;
        border-top: 0;
      }
      th {
        position: sticky;
        z-index: 2;
        top: -2px;
      }
    }
  }

  td {
    border-bottom: none;
    border-right: 1px solid rgba(24, 28, 33, 0.06) !important;
  }
}
</style>
<script>

// helper
import helper from 'infrastructures/helpers/common-helpers'
import { eventBus } from '@/main'

// service
import candidateService from 'domain/services/candidate-service'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
import hrTagService from 'domain/services/hr-tag-service'

// Entity
import MasterProfile from 'domain/entities/MasterProfile'
import CandidateLog from 'domain/entities/CandidateLog'

// component
import TimeLine from '../../common/TimeLine.vue'

import ModalRejectCandidate from './ModalRejectCandidate.vue'
import ModalNote from '../../common/ModalNote.vue'
import ModalContactCandidate from './ModalContactCandidate.vue'
import ModalReviewCandidate from './ModalReviewCandidate.vue'
import ModalMakeAppoint from './ModalMakeAppoint.vue'
import ModalCreateUser from './ModalCreateUser.vue'
import ModalViewDocument from './ModalViewDocument.vue'
import Document from './Document.vue'

export default {
  name: 'ListCandidate',
  components: {
    ModalViewDocument,
    ModalNote,
    ModalRejectCandidate,
    TimeLine,
    ModalContactCandidate,
    ModalReviewCandidate,
    ModalMakeAppoint,
    ModalCreateUser,
    Document
  },
  props: {
    listCandidates: {
      default: []
    },
    newCandidates: {
      type: Array,
      default: () => []
    },
    candidateJobId: {
      default: ''
    },
    jobId: {
      default: ''
    },
    permissions: {
      default () {
        return []
      }
    },
    originTags: {
      default () {
        return []
      }
    },
    originGlobalTags: {
      default () {
        return []
      }
    },
    isCloseShift: {
      default: false
    }
  },

  data () {
    return {
      dataListCandidates: this.listCandidates,
      totalCandidate: 0,
      showDocumentInfo: true,
      currentDocument: [],
      statuses: [
        {
          id: 'contact',
          name: 'Cần liên hệ'
        },
        {
          id: 'interview',
          name: 'Hẹn phỏng vấn'
        },
        {
          id: 'expect_join',
          name: 'Hẹn nhận việc'
        },
        {
          id: 'saveinfo',
          name: 'Từ chối'
        }
      ],
      curCandidate: {
        id: null,
        status: null,
        evaluate: null,
        apply_date: null,
        name: null,
        station_id: null,
        register_place: null,
        phone: null
      },
      typeCandidateJob: 'taken_job',
      appointmentType: null,
      appointmentTime: null,
      recordId: null,
      reviewType: null,
      attachPermission: true,
      reasonRejectTag: [],
      openTagModal: false,
      tags: this.originTags,
      globalTags: this.originGlobalTags,
      tableName: 'sgw_candidates',
      scope: 'private',
      currentJobDriverX: null,
      defaultAvatar: 'https://cache.giaohangtietkiem.vn/d/b04440d8dc4a05f744f1680ad42ecd1c.jpg?width=450&height=450',
      documents: []
    }
  },

  async created () {
    eventBus.$on('afterExplainCandidateSuccess', this.afterExplainCandidateSuccess)
    if (!this.isCloseShift) {
      await this.getCountDocument()
      this.showDocumentInfo = false
      this.$nextTick(() => {
        this.showDocumentInfo = true
      })
    }
  },

  mounted () {
    // this.getTags()
  },

  destroyed () {
    eventBus.$off('afterExplainCandidateSuccess', this.afterExplainCandidateSuccess)
  },

  watch: {
    originTags (newVal) {
      this.tags = newVal
    },

    async listCandidates () {
      if (this.totalCandidate !== this.listCandidates.length) {
        this.totalCandidate = this.listCandidates.length
        if (this.isCloseShift) {
          this.sortListCandidates()
        }
      }
      await this.getCountDocument()

      this.showDocumentInfo = false
      this.$nextTick(() => {
        this.showDocumentInfo = true
      })
    },

    originGlobalTags (newVal) {
      this.globalTags = newVal
    }
  },
  methods: {
    getDocument (candidateId) {
      try {
        const documents = JSON.parse(JSON.stringify(this.documents))
        return documents[candidateId]
      } catch (e) {
        return {
          count_required: 0,
          count_current: 0,
          status: ''
        }
      }
    },

    async getCountDocument () {
      const candidateIds = this.isCloseShift ? this.newCandidates.map(candidate => candidate.id) : this.listCandidates.map(candidate => candidate.id)
      if (candidateIds.length > 0) {
        this.loadingDocument = true
        await recruitmentService.getCountDocument({'candidate_id': candidateIds})
          .then(res => {
            if (res.data.success) {
              for (const doc in res.data.data) {
                this.documents[doc] = res.data.data[doc]
              }
            } else {
              helper.showMessage(res.data.message || 'Có lỗi khi lấy document!')
            }
          })
          .catch(e => {
            helper.showMessage(e.message || 'Lỗi xảy ra, vui lòng liên hệ IT để được hỗ trợ!', 'error')
          })
        this.loadingDocument = false
      }
    },

    getListCandidates () {
      return this.isCloseShift ? this.dataListCandidates : this.listCandidates
    },
    showDocument (currentDocument) {
      this.currentDocument = currentDocument
      this.$bvModal.show('modal-view-document')
    },

    resetCandidate () {
      this.curCandidate = null
    },

    getStatusName (key) {
      let currentStatus = this.statuses.find((element) => element.id === key)
      return currentStatus.name
    },

    reloadCandidates () {
      this.$bvModal.hide('')
      this.$emit('reloadCandidates')
    },

    formatDateTime (date) {
      let dateTime = new Date(date)
      var hours = dateTime.getHours()
      var minutes = dateTime.getMinutes()
      minutes = minutes < 10 ? '0' + minutes : minutes
      var strTime = hours + 'h' + minutes
      return 'Hẹn ' + strTime + ' ' + dateTime.getDate() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getFullYear()
    },

    getAppointment (candidate) {
      if (candidate.status === 'contact' && candidate.appointments.expected_contact) {
        return this.formatDateTime(candidate.appointments.expected_contact.appointment_time)
      }
      if (candidate.status === 'interview' && candidate.appointments.expected_interview) {
        return this.formatDateTime(candidate.appointments.expected_interview.appointment_time)
      }
      if (candidate.status === 'expect_join' && candidate.appointments.expected_join) {
        return this.formatDateTime(candidate.appointments.expected_join.appointment_time)
      }
      return ''
    },

    isInStatusMain (candidate) {
      return ['contact', 'interview', 'expect_join'].includes(candidate.status)
    },

    openModalRejectCandidate (candidate) {
      this.curCandidate = candidate
      this.$bvModal.show('modal-reject-candidate')
    },

    refreshModelTags (data) {
      this.$emit('refreshModelTags', data)
    },

    addTagForCandidate ({tag, log}) {
      this.curCandidate.tags = this.curCandidate.tags || []
      this.curCandidate.logs = this.curCandidate.logs || []
      this.curCandidate.tags.push(tag)
      this.curCandidate.logs.push(log)
    },

    makeAppointment (candidate) {
      this.appointmentType = candidate.status
      this.openModalMakeAppoint(candidate)
    },

    openModalMakeAppoint (candidate) {
      this.curCandidate = candidate
      this.$bvModal.show('modal-make-appoint')
    },

    closeModalMakeAppoint () {
      this.resetDataModalMakeAppointment()
      this.$bvModal.hide('modal-make-appoint')
    },

    isHasPermission (action) {
      return this.permissions.includes(action)
    },

    showModalJob (candidate, type) {
      this.curCandidate = candidate
      this.typeCandidateJob = type
      this.$bvModal.show('modal-show-job')
    },

    openModalNote (candidate) {
      this.curCandidate = candidate
      this.$bvModal.show('candidate-note-modal')
    },

    async noteCandidate (note) {
      let formData = {
        candidate_id: this.curCandidate.id,
        note: note
      }

      try {
        const res = await recruitmentService.noteCandidate(formData)
        if (res.data.success) {
          this.reloadCandidates()
          helper.showMessage(res.data.message, 'success')
        } else {
          helper.showMessage(res.data.message || 'Không từ chối được ứng viên !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.$bvModal.hide('candidate-note-modal')
      }
    },

    openTagManage (candidate) {
      this.$emit('openTagOfCandidate', candidate)
    },

    async openModalContact (candidate) {
      try {
        const res = await recruitmentService.getPhoneCandidate({user_id: candidate.user_id})
        if (res.data.success) {
          this.curCandidate = {...{phone: res.data.data.phone}, ...candidate}
          this.$bvModal.show('modal-contact-candidate')
        } else {
          helper.showMessage(res.data.message || 'Không lấy được số điện thoại của ứng viên !', 'warning')
        }
      } catch (e) {
        console.log(e)
      }
    },

    async detachTag (candidate, tag) {
      if (confirm('Bạn có chắc muốn bỏ gắn tag ' + tag.name + ' ?')) {
        try {
          const data = await recruitmentService.detachTag({
            tag_id: tag.tag_id,
            candidate_id: candidate.id
          })
          if (data.data.success) {
            helper.showMessage(data.data.message, 'success')
            candidate.tags = candidate.tags.filter(function (element) {
              return element.tag_id !== tag.tag_id
            })
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        } catch (e) {
          helper.showMessage(e.message, 'warning')
        } finally {
        }
      }
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    mappingStatusCandidateWithCandidateJob (driverxJobStatus) {
      if (driverxJobStatus === 'new') {
        return 'contact'
      }
      if (driverxJobStatus === 'selected') {
        return 'expect_join'
      }
      if (driverxJobStatus === 'interview') {
        return 'interview'
      }
      if (driverxJobStatus === 'save_info') {
        return 'saveinfo'
      }
      if (driverxJobStatus === 'taken') {
        return 'take_job'
      }
      return null
    },

    updateAppointmentOk () {
      this.reloadCandidates()
      this.closeModalMakeAppoint()
    },

    showModalCandidateJob (data) {
      this.curCandidate = data.candidate
      if (data.status === 'saveinfo') {
        if (!data.reason) {
          alert('Vui lòng nhập lý do từ chối')
          return
        }
        this.reasonRejectJob = data.reason || null
        this.updateStatusCandidate(this.curCandidate, data.status)
      } else {
        this.jobId = data.job.job_id
        this.candidateJobId = data.job.id
        this.$bvModal.hide('modal-show-job')
        this.$bvModal.show('modal-quick-create-user')
      }
    },

    showModalCreateUser (candidate) {
      this.curCandidate = candidate
      this.$bvModal.show('modal-quick-create-user')
    },

    hideModalCreateUser () {
      this.$bvModal.hide('modal-quick-create-user')
      this.reloadCandidates()
    },

    createUserSuccess (data) {
      this.$emit('createUserSuccess', data)
    },

    closeTagManage () {
      this.recordId = null
      this.openTagModal = false
    },

    async rejectCandidate ({reason, reasonRejectTag}) {
      let formData = {
        tag_id: reasonRejectTag,
        reason: reason
      }

      try {
        const res = await recruitmentService.rejectCandidate(formData, this.curCandidate.id)
        if (res.data.success) {
          helper.showMessage(res.data.message, 'success')
          this.reloadCandidates()
        } else {
          helper.showMessage(res.data.message || 'Không từ chối được ứng viên !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.curCandidate = null
        this.$bvModal.hide('modal-reject-candidate')
      }
    },

    toggleTagManage (recordId, state) {
      this.recordId = recordId
      this.openTagModal = state
    },

    async refreshHrTags () {
      // await this.getTags()
    },

    async toChannelChat (candidateId) {
      try {
        const res = await recruitmentService.toChannelChat({'candidate_id': candidateId})
        if (res.data.success) {
          window.open(res.data.data.link)
        } else {
          helper.showMessage(res.data.message || 'Không lấy được kênh chat của ứng viên !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
      }
    },

    async getTags () {
      try {
        const {data} = await hrTagService.getList({
          scope: 'private',
          table_name: 'sgw_candidates'
        })

        this.tags = data.success ? data.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            table_name: item.table_name
          }
        }) : []

        const gData = await hrTagService.getList({
          scope: 'global',
          table_name: 'sgw_candidates'
        })

        this.globalTags = gData.data.success ? gData.data.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            table_name: item.table_name
          }
        }) : []
      } catch (e) {
        console.log(e)
      } finally {
      }
    },

    validateFormUpdateStatus (candidate, newStatus, jobDriverX = null) {
      if (!jobDriverX && candidate.status === newStatus) {
        return false
      }
      if (newStatus === 'saveinfo') {
        if (!this.reasonRejectJob && this.reasonRejectTag.length < 1) {
          helper.showMessage('Vui lòng chọn tag hoặc điền lý do từ chối!', 'warning')
          return false
        }

        if (this.reasonRejectJob && this.reasonRejectJob.length < 10) {
          helper.showMessage('Nhập lý do khác không được ít hơn 10 ký tự!', 'warning')
          return false
        }
      }
      return true
    },

    /**
     * Get class for tag status
     * @param candidateStatus
     * @param statusTag
     * @returns {string}
     */
    getClassTagStatus (candidateStatus, statusTag) {
      let classTag = 'candidate-status-item'

      if (candidateStatus === statusTag) {
        classTag += ' active'
      }
      return classTag
    },

    onClickTagStatus (candidate, statusSelected) {
      if (!helper.isEmpty(candidate.profile_status) && candidate.profile_status !== MasterProfile.DISABLE_STATUS) {
        helper.showMessage('Bạn không thể chuyển trạng thái vì tài khoản ứng viên đã được duyệt', 'warning')
        return
      }
      this.handleSelectTagStatus(candidate, statusSelected)
    },

    /**
     * Select next step when change status candidate
     *
     * @returns {Promise<void>}
     */
    async handleSelectTagStatus (candidate, statusSelected) {
      this.recordId = candidate ? candidate.id : null
      this.curCandidate = candidate
      this.appointmentType = statusSelected

      let statusJob = candidate.status
      if (statusSelected === 'interview') {
        if (candidate.appointments.expected_interview) {
          this.appointmentTime = candidate.appointments.expected_interview.appointment_time
        }
        if (statusJob === 'contact') {
          this.reviewType = 'contact_interview'
          this.reviewCandidate(candidate.id)
        } else {
          this.openModalMakeAppoint(candidate)
        }
      } else if (statusSelected === 'expect_join') {
        if (candidate.appointments.expected_join) {
          this.appointmentTime = candidate.appointments.expected_join.appointment_time
        }
        if (statusJob === 'contact') {
          this.reviewType = 'contact_expect_join'
          this.reviewCandidate(candidate.id)
        } else if (statusJob === 'interview') {
          this.reviewType = 'interview_expect_join'
          this.reviewCandidate(candidate.id)
        } else {
          this.openModalMakeAppoint(candidate)
        }
      } else if (statusSelected === 'contact') {
        if (candidate.appointments.expected_contact) {
          this.appointmentTime = candidate.appointments.expected_contact.appointment_time
        }
        this.openModalMakeAppoint(candidate)
      }
    },

    reviewCandidate () {
      this.$bvModal.show('modal-review-candidate')
    },

    async updateStatusCandidate (candidate, newStatus, jobDriverX = null) {
      let activeCandidateIndex = this.listCandidates.findIndex((element) => {
        return element.id === candidate.id
      })
      if (!this.validateFormUpdateStatus(candidate, newStatus, jobDriverX)) return false
      let data = {}
      if (newStatus === 'saveinfo' && (this.reasonRejectJob || this.reasonRejectTag)) {
        data = {
          id: candidate.id,
          newStatus: newStatus,
          reason: this.reasonRejectJob || null,
          reasonTag: this.reasonRejectTag || [],
          jobDriverXId: jobDriverX ? jobDriverX.job_id : null
        }
      } else {
        data = {
          id: candidate.id,
          newStatus: newStatus,
          jobDriverXId: jobDriverX ? jobDriverX.job_id : null
        }
      }
      this.saveOk = true
      try {
        const res = await candidateService.updateStatusCandidate(data)
        if (res.data.success) {
          this.listCandidates[activeCandidateIndex].status = newStatus
          this.listCandidates[activeCandidateIndex].logs = candidate.logs || []
          this.listCandidates[activeCandidateIndex].logs = [...candidate.logs, ...res.data.data.candidate_log]
          helper.showMessage(res.data.message, 'success')
        } else {
          helper.showMessage(res.data.message || 'Không cập nhật được trạng thái cho ứng viên !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.curCandidate = null
        this.saveOk = false
        this.loading = false
        this.reasonRejectJob = null
        this.reasonRejectTag = []
        this.$bvModal.hide('modal-show-job')
        this.$bvModal.hide('modal-deny-candidate')
      }
    },

    async onDetach (candidate, tag, indexTag) {
      try {
        if (confirm('Bạn có chắc muốn bỏ gắn tag ' + tag.name + ' ?')) {
          const response = await hrTagService.detach({
            table_name: this.tableName,
            record_id: candidate.id,
            hr_tag_id: tag.id
          })

          if (response.data.success) {
            candidate.tags.splice(indexTag, 1)
            candidate.logs.push(response.data.candidate_log)
          } else {
            helper.showMessage(response.data.message, 'warning')
          }
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      }
    },

    resetDataModalMakeAppointment () {
      this.curCandidate = null
      this.appointmentType = null
      this.recordId = null
      this.currentJobDriverX = null
      this.appointmentTime = null
    },

    onClickExplanation (candidate) {
      this.$emit('explanation', candidate)
    },

    afterExplainCandidateSuccess (candidate) {
      this.sortListCandidates()
    },

    sortListCandidates () {
      let listExplainedCandidates = []
      let listNotExplainedCandidates = []
      for (let i = 0; i < this.listCandidates.length; i++) {
        if (!this.listCandidates[i].explained) {
          listNotExplainedCandidates.push(this.listCandidates[i])
        } else {
          listExplainedCandidates.push(this.listCandidates[i])
        }
      }

      for (let i = 0; i < listExplainedCandidates.length; i++) {
        listExplainedCandidates[i].lastExplainedLog = this.getLastExplainedLog(listExplainedCandidates[i].logs)
      }
      listExplainedCandidates.sort((a, b) => {
        if (a.lastExplainedLog.datetime > b.lastExplainedLog.datetime) {
          return 1
        }
        if (a.lastExplainedLog.datetime < b.lastExplainedLog.datetime) {
          return -1
        }

        return 0
      })

      this.dataListCandidates = listNotExplainedCandidates.concat(listExplainedCandidates)
    },

    getLastExplainedLog (logs) {
      if (helper.isEmpty(logs)) {
        return null
      }
      const totalLogs = logs.length
      let lastLog = null
      for (let i = 0; i < totalLogs; i++) {
        if (CandidateLog.listExplainAction.includes(logs[i].action) && (lastLog === null || lastLog.datetime < logs[i].datetime)) {
          lastLog = logs[i]
        }
      }
      return lastLog
    }
  }
}
</script>
