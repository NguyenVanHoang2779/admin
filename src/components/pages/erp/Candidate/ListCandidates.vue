<template>
    <div class="list-candidate-wrapper">
        <table class="table-candidate-list table">
        <thead>
            <tr class="header-row">
                <th class="text-center candidate-col">Thông tin ứng viên</th>
                <th class="text-center log-col">Chi tiết log</th>
                <th class="text-center action-col">Thao tác</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(candidate, idx) in listCandidates" :key="idx" class="table-candidate-content">
                <td class="info-col-content">
                    <div class="candidate-info-wrap">
                        <div class="candidate-info-container">
                            <div class="d-flex" style="flex: 1">
                            <div class="image-user">
                                <img v-bind:src="candidate.avatar" alt="">
                            </div>
                            <div class="candidate-info">
                                <div>
                                    <strong>{{candidate.name}}</strong> <strong style="color: #069255">{{formatDateExpect(candidate)}}</strong>
                                </div>
                                <div>
                                  <span>{{candidate.job_name}}</span>
                                </div>
                                <div>
                                    <span>Khu vực đăng ký: {{candidate.register_place}}</span>
                                </div>
                            </div>
                            </div>
                                <div class="candidate-info-action">
                                <div>
                                    <b-btn
                                        variant="outline-ghtk"
                                        class="action-btn btn-pill btn-sm candidate-info-action__btn"
                                        @click="openLink('/adm/candidate/edit/' + candidate.id)"
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
                            </div>
                        </div>
                        <div class="candidate-tag">
                            <div class="candidate-status-box" v-for="status in statuses.filter((v) => { return v.id !== 'saveinfo' })" :key="status.id">
                                <div @click="onClickTagStatus(candidate, status.id)">
                                    <div :class="getClassTagStatus(candidate.status, status.id)">{{ status.name }}</div>
                                </div>
                            </div>
                            <div class="candidate-tag-box" v-for="(tag, indexTag) in candidate.tags" :key="tag.id">
                                <div class="candidate-tag-item">{{ tag.name }}</div>
                                <i @click="onDetach(candidate, tag, indexTag)" class="candidate-delete-tag fa fa-times-circle"></i>
                            </div>
                            <b-button class="tag-manage" pill size="sm" variant="outline-secondary" @click="openTagManage(candidate)">+ Tag</b-button>
                        </div>
                    </div>
                </td>
                <td class="log-col-content">
                    <time-line
                        :item-style="{
                            'padding': '0px',
                            'fontSize': '14px'
                        }"
                        :message-field="'message'"
                        :logs="candidate.logs"
                        :time-field="'time'"
                    ></time-line>
                </td>
                <td class="text-center action-col-content">
                    <div v-if="showActionButton(candidate.isExplainedToday, isStaffShiftPage)">
                        <b-btn v-if="isInStatusMain(candidate)" variant="outline-ghtk" class="action-btn btn-sm w-50" @click="makeAppointment(candidate)">Hẹn lịch</b-btn>
                        <b-btn v-if="isInStatusMain(candidate) && isHasPermission('approve') && candidate.recruitment_channel !== 'driverx'"
                               variant="outline-ghtk" class="action-btn mt-2 btn-sm w-50"  @click="showModalCreateUser(candidate)">
                          Duyệt
                        </b-btn>
                        <b-btn v-if="isInStatusMain(candidate) && isHasPermission('approve') && candidate.recruitment_channel === 'driverx'"
                               variant="outline-ghtk" class="action-btn mt-2 btn-sm w-50" @click="showModalJob(candidate, 'taken_job')">
                          Duyệt
                        </b-btn>
                        <b-btn v-if="!isStaffShiftPage" variant="outline-ghtk" class="action-btn mt-2 btn-sm w-50" @click="openModalNote(candidate)">
                          Ghi chú
                        </b-btn>
                        <b-btn v-if="isInStatusMain(candidate) && isHasPermission('deny') && candidate.recruitment_channel !== 'driverx'"
                               variant="outline-danger" class="action-btn mt-2 btn-sm w-50"
                               @click="openModalDenyCandidate(candidate, 'saveinfo')">
                          Từ chối
                        </b-btn>
                        <b-btn
                            v-if="isInStatusMain(candidate) && isHasPermission('deny') && candidate.recruitment_channel === 'driverx'"
                            variant="outline-danger" class="action-btn mt-2 btn-sm w-50"
                            @click="showModalJob(candidate, 'saveinfo')"
                        >
                            Từ chối
                        </b-btn>
                        <b-btn
                            variant="outline-danger"
                            v-if="isStaffShiftPage"
                            class="action-btn action-btn__explain mt-2 btn-sm w-50"
                            @click="explain(candidate)"
                        >
                          Giải trình
                        </b-btn>
                      </div>
                </td>
            </tr>
      </tbody>
    </table>

        <modal-make-appoint
            id="modal-make-appoint"
            :appointment-type="appointmentType"
            :next-status="appointmentType"
            :candidate="curCandidate"
            :idStation="curCandidate ? curCandidate.station_id : ''"
            @updateAppointmentOk="updateAppointmentOk"
            :text-action-save="'Cập nhật thông tin'"
            :currentJobDriverX="currentJobDriverX"
            :isStaffShiftPage="isStaffShiftPage"
            @closeModal="resetDataModalMakeAppointment"
        ></modal-make-appoint>

        <ModalNote
            :currentCandidate="curCandidate"
        >
        </ModalNote>

        <!-- modal show job driver x -->
        <modal-show-job
            id="modal-show-job"
            :candidate="curCandidate"
            :typeCandidateJob="typeCandidateJob"
            @clickAction="showModalCandidateJob"
        >
        </modal-show-job>

        <ModalSelectJobDriverX
            :candidate="curCandidate"
            :typeAppointment="appointmentType"
            @selectedJobDriverX="reviewCandidateDriverX"
        >
        </ModalSelectJobDriverX>

      <!-- quick create user -->
        <modal-quick-create-user
            v-if="curCandidate"
            id="modal-quick-create-user"
            :candidate="curCandidate"
            :jobId="jobId || ''"
            :candidateJobId="candidateJobId || ''"
            @createUserSuccess="createUserSuccess"
        ></modal-quick-create-user>

        <ModalDenyCandidate
            :curCandidate="curCandidate"
            @updateStatusCandidateToSaveInfo="updateStatusCandidateToSaveInfo"
        >
        </ModalDenyCandidate>

        <ModalContact
            :curCandidate="curCandidate">
        </ModalContact>

        <HrTagModalV2
            :open="openTagModal"
            :tags="tags"
            :globalTags="globalTags"
            :tableName="tableName"
            :recordId="recordId"
            :attach-permission="attachPermission"
            :scope='scope'
            :isStaffShiftPage="isStaffShiftPage"
            @toggleTagManage="toggleTagManage"
            @action="closeTagManage()"
            @refreshCandidate="reloadCandidates()"
            @refreshModelTags="refreshModelTags"
            @refresh="refreshHrTags"
            @attachTagSuccess="addTagForCandidate"
        />

        <ModalReviewCandidate
            :candidateId="recordId"
            :candidate="curCandidate"
            :reviewType="reviewType"
            :jobDriverX="currentJobDriverX"
            @reviewCandidateSuccess="openModalMakeAppoint(curCandidate)"
        >
        </ModalReviewCandidate>
    </div>
</template>
<style lang="scss" scoped>
    ::placeholder {
        color: #828282;
    }

    .list-candidate-wrapper {
      max-height: calc(100vh - 215px);
      min-height: 25vh;
      overflow: auto;
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

// service
import candidateService from 'domain/services/candidate-service'
import hrTagService from 'domain/services/hr-tag-service'

// Entity
import MasterProfile from 'domain/entities/MasterProfile'

// component
import ModalMakeAppoint from './ModalMakeAppoint'
import TimeLine from '../StaffLog/TimeLine.vue'
import ModalNote from './ModalNote'
import ModalShowJob from 'components/pages/Candidate/ModalShowJob'
import ModalQuickCreateUser from '../../Candidate/ModalDriverxCreateUser'
import ModalDenyCandidate from './ModalDenyCandidate'
import ModalContact from './ModalContact'
import HrTagModalV2 from '../HrOrder/HrTagModalV2'
import ModalExplanation from '../ClosingShift/ModalExplanation'
import ModalSelectJobDriverX from './ModalSelectJobDriverX'

import moment from 'moment'
import ModalReviewCandidate from './ModalReviewCandidate'

export default {
  name: 'ListCandidates',
  components: {
    ModalReviewCandidate,
    ModalNote,
    ModalMakeAppoint,
    TimeLine,
    ModalShowJob,
    ModalQuickCreateUser,
    ModalDenyCandidate,
    HrTagModalV2,
    ModalContact,
    ModalExplanation,
    ModalSelectJobDriverX
  },
  props: {
    listCandidates: {
      default: null
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
    isStaffShiftPage: {
      default: false
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
    }
  },

  data () {
    return {
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
        idx: null,
        candidate_id: null,
        status: null,
        statusText: null,
        evaluate: null,
        reason_saveinfo: null,
        apply_date: null,
        name: null,
        station_id: null,
        isExplainedToday: false,
        register_place: null
      },
      typeCandidateJob: 'taken_job',
      appointmentType: null,
      recordId: null,
      reviewType: null,
      attachPermission: true,
      reasonRejectTag: [],
      openTagModal: false,
      tags: this.originTags,
      globalTags: this.originGlobalTags,
      tableName: 'sgw_candidates',
      scope: 'private',
      currentJobDriverX: null
    }
  },

  mounted () {
    this.getTags()
  },

  watch: {
    originTags (newVal) {
      this.tags = newVal
    },

    originGlobalTags (newVal) {
      this.globalTags = newVal
    }
  },
  methods: {
    reloadCandidates () {
      this.$emit('reloadCandidates')
    },

    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },

    formatDateExpect (candidate) {
      let date = ''
      let time = ''
      switch (candidate.status) {
        case 'contact':
          if (candidate.expected_contact_date) {
            date = this.formatDate(candidate.expected_contact_date)
            time = candidate.expected_contact_time || ''
          }
          break
        case 'interview':
          if (candidate.expected_interview_date) {
            date = this.formatDate(candidate.expected_interview_date)
            time = candidate.expected_interview_time || ''
          }
          break
        case 'expect_join':
          if (candidate.expected_join_date) {
            date = this.formatDate(candidate.expected_join_date)
            time = candidate.expected_join_time || ''
          }
          break
      }
      if (date) return 'Hẹn ' + time + ' ' + date
      return ''
    },

    isInStatusMain (candidate) {
      return ['contact', 'interview', 'expect_join'].includes(candidate.status)
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

    showActionButton (isExplainedToday, isStaffShiftPage) {
      if (isStaffShiftPage && parseInt(isExplainedToday) === 1) {
        return false
      }
      return true
    },

    explain (candidate) {
      this.$emit('explainCandidate', candidate)
    },

    openModalSelectJobDriverX (candidate, status) {
      this.curCandidate = candidate
      this.recordId = candidate.candidate_id
      this.appointmentType = status
      this.$bvModal.show('modal-select-job-driver-x')
    },

    reviewCandidateDriverX ({jobDriverX}) {
      this.currentJobDriverX = jobDriverX
      this.handleSelectTagStatus(this.curCandidate, this.appointmentType, jobDriverX)
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
      this.$bvModal.show('modal-note-candidate')
    },

    openTagManage (candidate) {
      this.curCandidate = candidate
      this.recordId = candidate ? candidate.id : null
      this.attachPermission = !!candidate
      this.openTagModal = true
    },

    openModalContact (candidate) {
      this.curCandidate = candidate
      this.$bvModal.show('modal-contact-candidate')
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    openModalDenyCandidate (candidate) {
      this.curCandidate = candidate
      this.$bvModal.show('modal-deny-candidate')
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

    updateAppointmentOk ({data, candidate, newStatus, jobDriverX}) {
      let activeCandidateIndex = this.listCandidates.findIndex((element) => {
        return element.id === candidate.id
      })
      Object.keys(this.listCandidates[activeCandidateIndex]).forEach((key) => {
        if (candidate.hasOwnProperty(key)) {
          this.listCandidates[activeCandidateIndex][key] = candidate[key]
        }
      })

      this.closeModalMakeAppoint()
      if (jobDriverX && this.mappingStatusCandidateWithCandidateJob(jobDriverX.status) !== newStatus) {
        this.updateStatusCandidate(candidate, newStatus, jobDriverX)
      } else if (!jobDriverX && candidate.status !== newStatus) {
        this.updateStatusCandidate(candidate, newStatus)
      } else if (this.isStaffShiftPage && data.is_hide_in_staff_shift) {
        this.reloadCandidates()
      }
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

    createUserSuccess (data) {
      this.$emit('createUserSuccess', data)
    },

    closeTagManage () {
      this.recordId = null
      this.openTagModal = false
    },

    updateStatusCandidateToSaveInfo ({reasonRejectJob, reasonRejectTag}) {
      this.reasonRejectJob = reasonRejectJob
      this.reasonRejectTag = reasonRejectTag
      this.updateStatusCandidate(this.curCandidate, 'saveinfo')
    },

    toggleTagManage (recordId, state) {
      this.recordId = recordId
      this.openTagModal = state
    },

    async refreshHrTags () {
      await this.getTags()
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
      if (candidate.recruitment_channel !== 'driverx') {
        this.handleSelectTagStatus(candidate, statusSelected)
      } else {
        this.openModalSelectJobDriverX(candidate, statusSelected)
      }
    },

    /**
     * Select next step when change status candidate
     *
     * @returns {Promise<void>}
     */
    async handleSelectTagStatus (candidate, statusSelected, jobDriverX = null) {
      this.recordId = candidate ? candidate.id : null
      this.curCandidate = candidate
      this.appointmentType = statusSelected

      if (jobDriverX) {
        let statusJob = jobDriverX.status

        if ((statusJob === 'new' && statusSelected === 'interview')) {
          this.reviewType = 'contact_interview'
          this.reviewCandidate(candidate.id)
        } else if (statusJob === 'new' && statusSelected === 'expect_join') {
          this.reviewType = 'contact_expect_join'
          this.reviewCandidate(candidate.id)
        } else if (statusJob === 'interview' && statusSelected === 'expect_join') {
          this.reviewType = 'interview_expect_join'
          this.reviewCandidate(candidate.id)
        } else {
          this.openModalMakeAppoint(candidate)
        }
      } else {
        let statusJob = candidate.status

        if ((statusJob === 'contact' && statusSelected === 'interview')) {
          this.reviewType = 'contact_interview'
          this.reviewCandidate(candidate.id)
        } else if (statusJob === 'contact' && statusSelected === 'expect_join') {
          this.reviewType = 'contact_expect_join'
          this.reviewCandidate(candidate.id)
        } else if (statusJob === 'interview' && statusSelected === 'expect_join') {
          this.reviewType = 'interview_expect_join'
          this.reviewCandidate(candidate.id)
        } else {
          this.openModalMakeAppoint(candidate)
        }
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
          if (this.isStaffShiftPage && res.data.data.is_hide_in_staff_shift) {
            this.reloadCandidates()
          }
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
    }

  }
}
</script>
