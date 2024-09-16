<template>
  <div class="text-black">
    <div class="d-flex my-3 mx-2">
      <h4 class="w-30 px-0 d-flex align-items-center mb-0">
        Chốt ca {{currentDate}}
      </h4>
      <div class="z-3" style="width: 54%">
          <select-team
              :disabled="checkShowSelectTeam"
              :placeholder="placeholderSelectTeam"
              :multiple="false"
              :auto-close="true"
              :hide-selected="true"
              @change="handleTeamSelected"
          />
      </div>
        <button style="width: 14%" class="btn btn-ghtk rounded text-white lh-0-8 ml-3" @click="lockShift">Hoàn thành</button>
    </div>
    <div v-if="isShowTab(task.alias)" class="row mx-2" :key="'to_do_' + key" v-for="(task, key) in to_do">
      <b-btn
          @click="toggleWorkBlock(key)"
          class="font-weight-500 border w-100 text-left d-flex justify-content-between text-black text-black"
          style="background-color: #F7F7F7">
          <div>
            {{ task.desc }}
            <span v-show="!loading['statistic_' + key]">({{ task.total }})</span>
            <i v-show="loading['statistic_' + key]" class="fas fa-spinner fa-pulse text-ghtk"></i>
          </div>
          <i class="fa mt-1 mr-1" style="color: #a3a4a6;" :class="task.open ? 'fa-chevron-down' : 'fa-chevron-up'"></i>
      </b-btn>
      <b-collapse
        v-model="task.open"
        class="w-100 border table-sticky"
        :id="task.alias"
        :class="[classCollapseButton, task.alias === 'recruitment' ? 'recruitment_wrapper' : '']"
      >
        <CandidateBoard
          v-if="key === 'recruitment'"
          v-show="isShowContentTab(key)"
          :teamId="filter.team_id"
          :isLoadFirstTime="isShowContentTab(key)"
          :triggerCandidate="triggerCandidate"
          :isStaffShiftPage="isStaffShiftPage"
          @load="loadCandidate"
          @changeTotalCandidates="changeTotalCandidates"
          @explainCandidate="showModalExplainCandidate"
          @finishedClosingShift="closeCandidateBoard"
          @unfinishedClosingShift="openCandidateBoard"
        />
        <div v-if="key === 'sos_me'" v-show="isShowContentTab(key)">
          <template>
            <iframe
              :src="getUrlIframeSosMe"
              :id="elementId.sosIframe"
              title="SOS.ME"
              width="100%"
              style="height: 53vh;"
              class="border-0"
            ></iframe>
          </template>
        </div>
        <TrainingBoard
          v-if="key === 'training' && task.open"
          v-show="isShowContentTab(key)"
          :teamId="filter.team_id"
          @explain="reloadCountTraining()"
        />
        <DocumentBoard
          v-if="key === 'document' && isShowContentTab(key)"
          :teamId="filter.team_id"
          :getDocumentTrigger="to_do.document.getTrigger"
          @modifyTotalDocument="action"
        />
        <DataStaffWork
          class="table-sticky mh-100"
          v-if="key === 'staff_work'"
          v-show="isShowContentTab(key)"
          :filter="to_do.staff_work.filter"
          :getWorkTrigger="to_do.staff_work.getTrigger"
          :paging="to_do.staff_work.paging"
          :infinity-mode="true"
          :allow-explain="true"
          @load="loadStaffWork"
          @action="action"
        />
        <StopWorkDashboard
          v-if="key === 'off_work' && isShowContentTab(key)"
          :getResignTrigger="to_do.off_work.getTrigger"
          :teamId="filter.team_id"
          :showElement="false"
          @getTotal="getTotal"
          @action="action"/>
        <StaffOnboardDashboard
          v-if="key === 'on_board' && isShowContentTab(key)"
          @action="action"
          :getOnboardTrigger="to_do.on_board.getTrigger"
          :teamId="filter.team_id"
          :showElement="false"
          @getTotal="getTotal"/>
      </b-collapse>
    </div>

    <!--modal-->
    <modal-explanation
      :type="typeModal"
      :id="modal_explain_id"
      :record="record"
      @confirmExplain="explain"
    />

    <!--modal backdrop-->
    <div
      id="modal-explain___BV_modal_backdrop_"
      class="modal-backdrop modal-backdrop-hrm"
      :class="showModalBackdrop ? '' : 'd-none' "
    ></div>
  </div>
</template>

<style scoped>
  .recruitment_wrapper {
    position: relative;
  }

  .closing-shift-wrapper > * {
    color: black;
  }

  .has_one_tab {
    max-height: calc(100vh - 110px);
    overflow-y: auto;
  }
  .has_multiple_tab {
    max-height: 53vh;
    overflow-y: auto;
  }

  #sos_me {
    overflow-y: hidden;

    &.show-modal-backdrop-hrm {
      z-index: 1090;
    }
  }

  .modal-backdrop-hrm {
    background-color: #000;
  }
</style>

<script>
// helpers
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'
import { eventBus } from '@/main'

// store
import store from '@/store'

// custom components
import SelectTeam from 'components/elements/common/SelectTeam'
import DocumentBoard from './DocumentBoard'
import ModalExplanation from './ModalExplanation'
import DataStaffWork from '../StaffWork/TableData.vue'

// service
import profileManagerService from 'domain/services/profile-mamanger-service'
import staffShiftService from 'domain/services/staff-shift-service'
import trainingService from 'domain/services/training-service'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'

// entities
import StaffWork from 'domain/entities/StaffWork.js'
import StopWorkDashboard from 'components/pages/erp/StaffStopWork/StopWorkDashboard'
import StaffOnboardDashboard from 'components/pages/erp//StaffOnboard/StaffOnboardDashboard'
import CandidateBoard from './NewCandidateBoard'
import TrainingBoard from './TrainingBoard'
import configs from '@/config/app.base'
import ticketService from '@/domain/services/Erp/ticket-service'
import {mapGetters} from 'vuex'

export default {
  name: 'closing-shift-board',

  components: {
    CandidateBoard,
    TrainingBoard,
    StaffOnboardDashboard,
    StopWorkDashboard,
    SelectTeam,
    DocumentBoard,
    ModalExplanation,
    DataStaffWork
  },

  data: _ => ({
    elementId: {
      sosIframe: 'iframe-sos-closing-shift'
    },
    showModalBackdrop: false,
    messageType: {
      closingShift: 'sos_closing_shift',
      requestAuth: 'hrm_authentication_request',
      refreshIamToken: 'hrm_refresh_iam_token',
      reloadStatisticSosMe: 'reload_statistic_sos_closing_shift',
      reloadClosingShiftSos: 'reload_closing_shift_sos',
      closeTabSosMe: 'close_tab_sos_me',
      showModalHrm: 'show_modal_hrm',
      hideModalHrm: 'hide_modal_hrm'
    },
    isStaffShiftPage: true,
    triggerCandidate: 0,
    permission: {
      view_tab: [],
      view_immediately: false
    },
    to_do: {
      training: {
        total: 0,
        alias: 'training',
        statisticFunc: 'getStatisticTrainingSyllabus',
        dataFunc: '',
        desc: 'Đào tạo',
        open: true,
        isShow: false,
        getTrigger: false
      },
      recruitment: {
        total: 0,
        alias: 'recruitment',
        statisticFunc: '',
        dataFunc: '',
        desc: 'Tuyển dụng',
        getTrigger: false,
        isShow: false,
        open: false
      },
      sos_me: {
        total: 0,
        alias: 'sos_me',
        statisticFunc: 'getStatisticSos',
        dataFunc: null,
        getTrigger: false,
        paging: {
          curPage: 1,
          perPage: 10
        },
        filter: {},
        desc: 'SOS.ME',
        isShow: false,
        open: false
      },
      staff_work: {
        total: 0,
        alias: 'staff_work',
        statisticFunc: null,
        dataFunc: null,
        getTrigger: false,
        paging: {
          curPage: 1,
          perPage: 5
        },
        filter: {
          workToDay: 1,
          teamId: null,
          workCategory: 'checkin,staff_order,staff_order_contract,wallet,staff_identity',
          notGetDelay: 'count',
          workFilter: {
            // ...StaffWork.workMapFilter.checkin_not_approve,
            ...StaffWork.workMapFilter.staff_order_contract,
            ...StaffWork.workMapFilter.staff_order,
            ...StaffWork.workMapFilter.lost_identity_card_hr
          }
        },
        desc: 'Cần xử lý',
        isShow: false,
        open: false
      },
      on_board: {
        total: 0,
        alias: 'on_board',
        statisticFunc: '',
        getTrigger: false,
        dataFunc: '',
        desc: 'Nhận việc',
        isShow: false,
        open: false
      },
      off_work: {
        total: 0,
        alias: 'off_work',
        statisticFunc: '',
        getTrigger: false,
        dataFunc: '',
        desc: 'Nghỉ việc',
        isShow: false,
        open: false
      },
      document: {
        total: 0,
        alias: 'document',
        statisticFunc: 'getStatisticProfileDocument',
        dataFunc: 'getStatisticProfileDocument',
        desc: 'Hồ sơ chưa duyệt',
        open: false,
        isShow: false,
        getTrigger: false
      }
    },
    filter: {
      team_id: null
    },
    modal_explain_id: 'modal-explain',
    loading: {
      statistic_staff_work: false,
      statistic_on_board: false,
      statistic_off_work: false,
      statistic_document: false,
      statistic_recruitment: false,
      statistic_training: false,
      statistic_sos_me: false
    },
    record: {
      id: null,
      full_name: null,
      status: null,
      deadline: null
    },
    typeModal: 'recruitment',
    dataUpdateLog: {},
    actionLog: {
      recruitment: 'explainRecruitment',
      off_work: 'explainResignWork',
      on_board: 'explainOnboardWork',
      staff_work: 'explainNeedResolveWork'
    },
    currentCandidate: null
  }),

  watch: {
    'filter.team_id' (newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.sendTeamIdToIframe()
      }
    },
    'curUser' () {
      this.lockShiftForHeadHunter()
    }
  },

  created () {
    this.getPermission()
    if (this.permission.view_immediately) {
      this.getData()
    }
    this.initLoading()
    this.startListenIframeEvent()
  },

  mounted () {
    this.lockShiftForHeadHunter()
  },

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),
    currentDate: function () {
      return moment().format('DD/MM/YYYY')
    },
    moment: function () {
      return moment
    },
    helper: function () {
      return helper
    },
    getUrlIframeSosMe () {
      return configs.domainHrmFe + '/closing-shift-sos'
    },
    classCollapseButton () {
      let classCollapse = this.permission.view_tab.length > 1 ? 'has_multiple_tab' : 'has_one_tab'
      if (this.showModalBackdrop) {
        classCollapse += ' show-modal-backdrop-hrm'
      }

      return classCollapse
    },
    checkShowSelectTeam () {
      return !!(this.curUser && this.curUser.ErpPosition && parseInt(this.curUser.ErpPosition.id) === 297)
    },
    placeholderSelectTeam () {
      if (this.curUser && this.curUser.ErpPosition && parseInt(this.curUser.ErpPosition.id) === 297) {
        return 'Đối với Headhunter không cần chọn nhóm chốt ca'
      }
      return 'Chọn nhóm chốt ca'
    }
  },

  methods: {
    lockShiftForHeadHunter () {
      // Đối với headhunter không chốt ca theo team mà chốt ca theo user
      if (this.curUser && this.curUser.ErpPosition && parseInt(this.curUser.ErpPosition.id) === 297) {
        // headhunter không lấy theo team nên không ảnh hưởng gì nếu team là -1
        this.filter.team_id = -1
        this.getData()
      }
    },
    sendTeamIdToIframe () {
      const data = {
        type: this.messageType.closingShift,
        payload: {
          teamId: this.filter.team_id
        }
      }
      this.sendMessageToIframe(data)
    },
    sendMessageToIframe (data) {
      let target = document.getElementById(this.elementId.sosIframe)
      if (target) {
        target.contentWindow.postMessage(data, configs.domainHrmFe)
      }
    },
    getPermission () {
      this.$startLoading()
      staffShiftService.getClosingShiftBoardPermission()
        .then(res => {
          if (res.data.success) {
            this.permission = res.data.data
            Object.keys(this.to_do).forEach(key => {
              this.to_do[key].isShow = this.permission.view_tab.includes(this.to_do[key].alias)
              this.to_do[key].open = this.permission.view_immediately
            })
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy phân quyền!')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra!')
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    isShowTab (tabName) {
      return Array.isArray(this.permission.view_tab) && this.permission.view_tab.includes(tabName)
    },

    isShowContentTab (tabName) {
      return !helper.isEmpty(this.filter.team_id) ||
        (Array.isArray(this.permission.view_tab) && this.permission.view_tab.includes(tabName) && this.permission.view_immediately)
    },

    toggleWorkBlock (task) {
      this.to_do[task].open = !this.to_do[task].open
      if (this.to_do[task].open && task !== 'recruitment') {
        this.getData(task)
      } else if (task === 'recruitment' && this.isShowContentTab(this.to_do[task].alias)) {
        if (this.to_do[task].open) {
          this.triggerCandidate++
        }
      } else if (!this.isShowContentTab(this.to_do[task].alias)) {
        this.to_do.recruitment.total = 0
      }
    },

    action (action) {
      this.dataUpdateLog = {}
      if (action.action === 'modify_total_statistic') { // Update lại số lượng count khi có thao tác duyêt, ...
        this.to_do[action.data.key].total += action.data.value
      }
      // show modal giải trình nghi viec
      if (action.action === 'showModalExplainResign') {
        this.showModalExplainOffWork(action)
      }
      // show modal giải trình nhan viec
      if (action.action === 'showModalExplainOnboard') {
        this.showModalExplainOnboard(action)
      }

      if (action.action === 'explain') {
        this.typeModal = 'staff_work'
        this.record.full_name = action.data.fullname
        this.record.status = action.data.status
        this.record.deadline = action.data.deadline
        this.dataUpdateLog = action.data
        this.$bvModal.show(this.modal_explain_id)
      }

      if (action.action === 'check_open' && !action.checkOpen) {
        this.to_do[action.screen].open = false
      }
    },

    initLoading () {
      Object.keys(this.to_do).map((toDo) => {
        this.loading['statistic_' + toDo] = false
      })
    },

    closeCandidateBoard () {
      this.to_do.recruitment.open = false
    },

    openCandidateBoard () {
      this.to_do.recruitment.open = true
    },

    showModalExplainCandidate (candidate) {
      this.currentCandidate = candidate
      this.typeModal = 'recruitment'
      this.dataUpdateLog = {
        'action': this.actionLog.recruitment,
        'content': '',
        'candidate_id': candidate.id
      }

      this.record = {
        id: candidate.id,
        full_name: candidate.name,
        status: null,
        deadline: null
      }

      let appointment = 'expected_contact'
      switch (candidate.status) {
        case 'contact':
          this.record.status = 'Cần liên hệ'
          break
        case 'interview':
          this.record.status = 'Hẹn phỏng vấn'
          appointment = 'expected_interview'
          break
        case 'expect_join':
          this.record.status = 'Hẹn nhận việc'
          appointment = 'expected_join'
          break
      }

      if (candidate.appointments && candidate.appointments[appointment]) {
        this.record.deadline = candidate.appointments[appointment]['appointment_time']
      } else {
        this.record.deadline = new Date()
      }

      this.$nextTick(() => {
        this.$bvModal.show(this.modal_explain_id)
      })
    },

    // chọn team
    handleTeamSelected (option) {
      if (option) {
        this.loading.statistic_on_board = true
        this.loading.statistic_off_work = true
        this.to_do.on_board.open = true
        this.to_do.off_work.open = true
      }
      this.filter.team_id = option ? option.id : ''
      if (this.filter.team_id) this.getData()
      else {
        for (const work in this.to_do) {
          this.to_do[work].total = 0
        }
      }
    },

    // giải trình
    explain (reason) {
      if (this.dataUpdateLog.action === this.actionLog.recruitment) {
        return this.explanationRecruitment(reason)
      }

      this.$set(this.dataUpdateLog, 'content', reason)
      this.$startLoading()
      staffShiftService.explain(this.dataUpdateLog)
        .then(res => {
          if (res.data.success) {
            if (this.dataUpdateLog.action === this.actionLog.off_work) {
              this.to_do.off_work.getTrigger = !this.to_do.off_work.getTrigger
            } else if (this.dataUpdateLog.action === this.actionLog.on_board) {
              this.to_do.on_board.getTrigger = !this.to_do.on_board.getTrigger
            }
            helper.showMessage(res.data.message || 'Giải trình thành công !', 'success')
          } else {
            helper.showMessage(res.data.message || 'Giải trình thất bại !')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra !')
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
          this.closeModalExplain()
        })
    },

    explanationRecruitment (reason) {
      this.$startLoading()

      const data = {
        emp_team_id: parseInt(this.filter.team_id),
        content: reason
      }

      recruitmentService.closeShiftExplanation(this.currentCandidate.id, data)
        .then(res => {
          if (res.data.success) {
            this.currentCandidate.logs.push(res.data.data)
            this.currentCandidate.explained = true
            this.to_do.recruitment.total -= 1

            helper.showMessage('Giải trình thành công.', 'success')
            eventBus.$emit('afterExplainCandidateSuccess', this.currentCandidate)
          } else {
            helper.showMessage(res.data.message || 'Giải trình thất bại!')
          }
        })
        .catch(e => {
          helper.showMessage(e.message || 'Lỗi xảy ra, vui lòng liên hệ IT để được hỗ trợ!', 'error')
        })
        .finally(_ => {
          this.$stopLoading()
          this.closeModalExplain()
        })
    },

    closeModalExplain () {
      this.dataUpdateLog = {}
      this.record = {}
      this.currentCandidate = null
      this.$bvModal.hide(this.modal_explain_id)
    },

    // chốt ca
    lockShift () {
      if (!this.filter.team_id) {
        helper.showMessage('Vui lòng chọn nhóm chốt ca !')
        return
      }
      this.$startLoading()
      staffShiftService.lockShift({team_id: this.filter.team_id})
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Chốt ca thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Chốt ca thất bại !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    // call api get data and statistic by config when chose team
    getData (workType = null) {
      if (!this.filter.team_id && !this.permission.view_immediately) return
      if (workType === 'on_board') this.loading.statistic_on_board = true
      if (workType === 'off_work') this.loading.statistic_off_work = true
      this.resetFilter(workType)
      let aliCalled = {}
      for (const work in this.to_do) {
        if (!this.to_do[work].isShow) continue
        if (workType && work !== workType) continue
        let filter = {...(this.to_do[work].filter || {}), ...{team_id: this.filter.team_id}}
        if (this.to_do[work].statisticFunc && !aliCalled[this.to_do[work].statisticFunc]) {
          this[this.to_do[work].statisticFunc](filter)
          aliCalled[this.to_do[work].statisticFunc] = true
        }

        if (this.to_do[work].dataFunc && !aliCalled[this.to_do[work].dataFunc]) {
          this[this.to_do[work].dataFunc](filter)
          aliCalled[this.to_do[work].dataFunc] = true
        }

        if (this.to_do[work].getTrigger !== undefined) {
          this.to_do[work].getTrigger = !this.to_do[work].getTrigger
        }
      }
    },

    resetFilter (workType = null) {
      // reset filter màn cần xử lý
      if (!workType || workType === 'staff_work') this.setFilterStaffWork()
    },

    // ----- profile management logic -----
    async getStatisticProfileDocument (filter) {
      try {
        this.loading.statistic_document = true
        const {data} = await profileManagerService.getDocuments({
          status: {
            name: 'Chưa duyệt'
          },
          mp_status: 'pause,disable',
          isCount: true,
          ...filter
        })
        this.to_do.document.total = data.data.total
        if (+this.to_do.document.total === 0) this.to_do.document.open = false
        else this.to_do.document.open = true
      } catch (e) {
        helper.showMessage('Không lấy được số liệu hồ sơ!')
        console.log(e.message)
      } finally {
        this.loading.statistic_document = false
      }
    },
    // ----- End profile management logic -----

    async getStatisticTrainingSyllabus (filter) {
      try {
        this.loading.statistic_training = true
        const {data} = await trainingService.getDataConfirmShift({
          only_count: true,
          ...filter
        })
        this.to_do.training.total = data.data.total
        // if (+this.to_do.training.total === 0) this.to_do.training.open = false
        // else this.to_do.training.open = true
      } catch (e) {
        helper.showMessage('Không lấy được thông tin chốt ca đào tạo.')
        console.log(e.message)
      } finally {
        this.loading.statistic_training = false
      }
    },

    // ----- staff work logic region -----
    loadStaffWork (data) {
      this.loading.statistic_staff_work = data.loading
      if (!data.loading) {
        this.to_do.staff_work.total = data.total
        // if (+data.total === 0) this.to_do.staff_work.open = false
        // else this.to_do.staff_work.open = true
        if (!this.to_do.staff_work.open && +data.total > 0) {
          this.to_do.staff_work.open = true
        }
      }
    },

    setFilterStaffWork () {
      this.to_do.staff_work.filter.teamId = this.filter.team_id
      this.to_do.staff_work.paging.curPage = 1
    },

    loadCandidate (data) {
      this.loading.statistic_recruitment = data.loading
    },

    changeTotalCandidates (data) {
      this.to_do.recruitment.total = data.total
    },

    // ----- staff onboard logic region -----
    getTotal (action) {
      this.loading.statistic_off_work = false
      this.loading.statistic_on_board = false
      if (action.action === 'total_off_work') {
        this.to_do.off_work.total = action.total
      }
      if (action.action === 'total_on_board') {
        this.to_do.on_board.total = action.total
      }
    },

    reloadCountTraining () {
      let filter = { team_id: this.filter.team_id }
      this[this.to_do['training'].statisticFunc](filter)
    },

    showModalExplainOffWork (action) {
      this.typeModal = 'off_work'
      let data = action.order
      let allStatus = ''
      this.record = {
        full_name: data.profile_info.fullname || null,
        deadline: data.resign_info.resign_date || moment().format('DD/MM/YYYY')
      }
      if (data.status === 'cho_duyet') {
        allStatus = 'Duyệt đề xuất. '
      }
      // if (!data.checkStatusBHXH && !data.checkChotSo) {
      //   allStatus = allStatus + 'Chốt sổ BHXH, '
      // }
      // if (!data.statusContract) {
      //   allStatus = allStatus + 'Thanh lý hợp đồng.'
      // }
      this.record.status = allStatus
      this.dataUpdateLog = {
        master_profile_id: data.profile_info.id,
        user_id: data.profile_info.user_id,
        order_id: data.id,
        action: this.actionLog.off_work,
        content: ''
      }
      this.$bvModal.show(this.modal_explain_id)
    },

    showModalExplainOnboard (action) {
      this.typeModal = 'onboard'
      let data = action.data
      let allStatus = ''
      let status = data.onboard_status
      if (status.ekyc.status === undefined || status.ekyc.status === 'pending') {
        allStatus = allStatus + 'Hoàn thành eKYC, '
      }
      if (status.deposit.status === undefined || status.deposit.status === 'pending') {
        allStatus = allStatus + 'Đóng cọc, '
      }
      if (status.contract.status === undefined || status.contract.status === 'pending') {
        allStatus = allStatus + 'Ký hợp đồng, '
      }
      if (status.active_wallet !== undefined && status.active_wallet.show && (status.active_wallet.status === undefined || status.active_wallet.status === 'pending')) {
        allStatus = allStatus + 'Kích hoạt ví, '
      }
      this.record = {
        full_name: data.fullname || null,
        deadline: data.comeback_date || data.join_date,
        status: allStatus
      }
      this.dataUpdateLog = {
        master_profile_id: data.id,
        user_id: data.user_id,
        action: this.actionLog.on_board,
        content: ''
      }
      this.$bvModal.show(this.modal_explain_id)
    },

    async getStatisticSos () {
      if (!this.filter.team_id) {
        return
      }
      try {
        this.loading.statistic_sos_me = true
        const res = await ticketService.getCountClosingShiftSos({ team_id: this.filter.team_id })
        if (res.data.success) {
          this.to_do.sos_me.total = res.data.data.count
          this.sendMessageToIframe({
            type: this.messageType.reloadClosingShiftSos
          })
        } else {
          helper.showMessage(res.data.message || 'Không lấy được thông tin ticket SOS!')
        }
      } catch (error) {
        helper.showMessage('Không lấy được thông tin ticket SOS!')
      } finally {
        this.loading.statistic_sos_me = false
        if (+this.to_do.sos_me.total > 0) {
          this.to_do.sos_me.open = true
        }
      }
    },

    startListenIframeEvent () {
      window.addEventListener('message', (event) => {
        if (event.origin !== configs.domainHrmFe) {
          return
        }
        switch (event.data.type) {
          case this.messageType.closingShift:
            this.sendTeamIdToIframe()
            break
          case this.messageType.requestAuth:
            store.dispatch('sendMessageToHrm', this.elementId.sosIframe)
            break
          case this.messageType.refreshIamToken:
            window.location.reload()
            break
          case this.messageType.reloadStatisticSosMe:
            this.getStatisticSos()
            break
          case this.messageType.closeTabSosMe:
            this.to_do.sos_me.open = false
            break
          case this.messageType.showModalHrm:
            this.showModalBackdrop = true
            document.body.classList.add('modal-open')
            break
          case this.messageType.hideModalHrm:
            this.showModalBackdrop = false
            document.body.classList.remove('modal-open')
            break
          default:
            break
        }
      })
    }
  }
}
</script>
