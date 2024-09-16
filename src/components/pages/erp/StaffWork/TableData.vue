<template>
<div class="table-data">
  <table class="table table-sm mb-0">
    <thead>
      <tr class="text-center">
        <th class="w-30"><b>{{curWork ? tableDataHeader[works[curWork].table_data_type].header1 : tableDataHeader['common'].header1}}</b></th>
        <th><b>{{curWork ? tableDataHeader[works[curWork].table_data_type].header2 : tableDataHeader['common'].header2}}</b></th>
        <th class="w-15"><b>{{curWork ? tableDataHeader[works[curWork].table_data_type].header3 : tableDataHeader['common'].header3}}</b></th>
      </tr>
    </thead>
    <tbody class="position-relative" v-loading="!infinityMode && loading">
      <template v-for="(data, idx) in listData">
        <OrderRowDataV2
          v-if="data && ['staff_order', 'staff_identity'].includes(data.work_category)"
          :allow-explain="allowExplain"
          :order="data.order"
          :type="data.type"
          :approve_report_wrong_identity="data.approve_report_wrong_identity"
          :duty="orderData.duty"
          :key="idx"
          :editableTag="tagData.editTag"
          :updateVal="recordUpdateVal"
          @action="action(data, ...arguments, idx)"
        />
        <!-- <ReportLostIdentityCard
          v-if="data && data.work_category === 'lost_identity_card'"
          :order="data"
          :duty="orderData.duty"
          :key="idx"
          :editableTag="tagData.editTag"
          :updateVal="recordUpdateVal"
          @action="action(data, ...arguments, idx)"
        /> -->
        <EkycImageChangeRowData
          v-if="data && data.work_category === 'ekyc_image_changes'"
          :order="data"
          :duty="orderData.duty"
          :key="idx"
          :editableTag="tagData.editTag"
          :updateVal="recordUpdateVal"
          @action="action(data, ...arguments, idx)"
        />
        <ProfileWalletRowData
          v-if="data && data.work_category === 'wallet'"
          :key="idx"
          :profileWallet="data"
          :editableTag="tagData.editTag"
          :updateVal="recordUpdateVal"
          @action="action(data, ...arguments, idx)"
        />
        <ContractLogDetail
          v-if="data && data.work_category === 'staff_order_contract'"
          :allow-explain="allowExplain"
          @action="action(data, ...arguments, idx)"
          :updateVal="recordUpdateVal"
          :order="data"
          :key="idx"
        />
        <template v-if="data && data.work_category === 'checkin'">
          <CheckinLogDetailV2
            v-for="(checkin, idxCheckin) in (data && data.check_ins)"
            :allow-explain="allowExplain"
            :key="checkin.checkin_log.id + '_' + idxCheckin + '_' + idx"
            :editableTag="tagData.editTag"
            :idx="idxCheckin"
            :user-checkin="data"
            :checkin="checkin"
            :updateVal="recordUpdateVal"
            @action="action(data, ...arguments, idx)"
          />
        </template>
      </template>
      <tr v-show="(!listData || !listData.length) && !infinityMode">
        <td colspan="10">
          <div class="mih-25 d-flex justify-content-center align-items-center">
            <b v-show="!loading">Không có dữ liệu phù hợp !</b>
          </div>
        </td>
      </tr>
      <b-modal id="modal-phone-number" title="Gọi ứng viên" centered ref="phone-number" title-class="w-100" header-class="text-center" hide-footer size="sm">
        <div class="d-block text-start">
          <div><b>Họ tên:</b> {{userPhoneNumber.fullName}}</div>
          <div><b>Vị trí:</b> {{userPhoneNumber.positionName}}</div>
          <div><b>Số điện thoại:</b> {{userPhoneNumber.tel}}</div>
        </div>
        <div class="row mt-3">
          <div class="col text-center">
            <button class="btn btn-ghtk rounded text-white" @click="closeModalPhone()">Đóng</button>
          </div>
        </div>
      </b-modal>
      <b-modal id="modal-checkin-calendar" title="Chi tiết công" modal-class="modal-xxl">
        <DetailWorkShift :user-id="checkinData.curUser" :shift-range="workShift" />
      </b-modal>
      <ModalUpdateCheckin
        @reloadCalendar="getTypeWork()"
        @changeDataOfCheckinLog="updateCheckinOk"
        :userId="checkinData.curUser"
        :checkin-id="checkinData.curCheckin"
        :prStatus="checkinData.curAction"
      />
      <b-modal title="Cập nhật người xử lý" id="modal-edit-censor-staff-work" hide-footer>
        <CensorV2 :order="curData.data" :order-id="orderData.curOrderId" @action="actionUpdateRecord"/>
      </b-modal>
      <b-modal id="modal-update-staff-order" static modal-class="modal-xxl" title="THÔNG TIN ĐỀ XUẤT" hide-footer @hide="resetUpdateStatusData">
        <UpdateOrder
          :id-order="orderData.curOrderId"
          :approve_report_wrong_identity="orderData.approve_report_wrong_identity"
          :modal-style="true"
          @addOrderOk="getTypeWork()"
          @changeStatusOk="changeStatusOrderOk"
        />
      </b-modal>
      <b-modal static title="Nhập lý do từ chối" centered id="reject-order-reason-modal" @hide="resetUpdateStatusData">
        <textarea
          name="reject-reason-input"
          rows="4"
          class="form-control"
          v-model="orderData.rejectReason"
        ></textarea>
        <div slot="modal-footer" class="w-100 text-center">
          <b-btn variant="success" @click="updateStatus(curData.data, 'tu_choi')">OK</b-btn>
          <b-btn variant="danger" @click="$bvModal.hide('reject-order-reason-modal')">Hủy</b-btn>
        </div>
      </b-modal>
      <HrTagModal
        :scope="'global'"
        :open="tagData.openModalHrTag"
        :attachPermission="tagData.attach"
        :recordId="tagData.recordId"
        :tableName="tagData.tableName"
        :tags="tagData.tags"
        @action="actionUpdateRecord"
      />
      <ModalNote
        id="modal-note"
        @save="saveNote"
      />
      <b-modal title="Cập nhật người xử lý" title-class="w-100" header-class="text-center" id="modal-edit-handler" hide-footer>
        <CensorV3 :censor-data="walletData.handlerData" @action="updateHandler" />
      </b-modal>
      <modal-explanation
        type="staff_work"
        id="modal-expain-staff-work"
        :record="explainData"
        @confirmExplain="explain"
      />
      <ModalCheckBeforeApproveContract
        :data-check="dataCheckBeforeApproveContract"
        :is-show="isShowModalCheckBeforeApproveContract"
        @toggleModal="toggleModalCheckBeforeApproveContract"
        @continueApprove="updateStatus(curData.data, 'duyet', true)"
      />
    </tbody>
  </table>
  <infinite-loading spinner="spiral" @infinite="getTypeWork" v-if="infinityMode">
    <div slot="no-more" class="text-center">Đã đến cuối trang !</div>
    <div slot="no-results" class="text-center">Không có dữ liệu nào !</div>
  </infinite-loading>
</div>
</template>

<style lang="scss" scoped>
  .table-data {
    border-bottom: 1px solid #ddd;
    table {
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      thead {
        width: 100%;
      }
    }
    th {
      height: 3rem;
      vertical-align: middle;
      background-color: #f7f7f7;
    }
  }
</style>

<script>
// custom component
import ModalUpdateCheckin from 'components/pages/erp/CheckinManager/ModalUpdateCheckin'
import DetailWorkShift from 'components/pages/erp/CheckinManager/DetailWorkShift'
import CheckinLogDetailV2 from './checkinLogDetailV2'
import OrderRowDataV2 from 'components/pages/erp/HrOrder/OrderRowDataV2'
import HrTagModal from 'components/pages/erp/HrOrder/HrTagModal'
import Censor from 'components/pages/erp/HrOrder/Censor'
import CensorV2 from 'components/pages/erp/HrOrder/CensorV2'
import ContractLogDetail from './ContractLogDetail.vue'
import EkycImageChangeRowData from 'components/pages/erp/HrOrder/EkycImageChangeRowData'
import ReportLostIdentityCard from 'components/pages/erp/HrOrder/ReportLostIdentityCard'
import UpdateOrder from 'components/pages/erp/HrOrder/UpdateOrder'
import ProfileWalletRowData from './ProfileWalletRowData.vue'
import ModalNote from './ModalNote.vue'
import CensorV3 from '../StaffOnboard/CensorV3.vue'
import ModalExplanation from '../ClosingShift/ModalExplanation.vue'
import ModalCheckBeforeApproveContract from 'components/pages/erp/HrOrder/ModalCheckBeforeApproveContract'

// build-in Component
import InfiniteLoading from 'vue-infinite-loading'

// service
import userService from 'domain/services/user-service'
import hrOrderService from 'domain/services/hr-order-service'
import hrTagService from 'domain/services/hr-tag-service'
import staffWorkService from 'domain/services/staff-work-service'
import staffShiftService from 'domain/services/staff-shift-service'

// entities
import ManageListCod from 'domain/entities/ManageListCod'
import StaffWork from 'domain/entities/StaffWork.js'
import Order from 'domain/entities/Order.js'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

export default {
  name: 'table-data',

  components: {
    InfiniteLoading,
    EkycImageChangeRowData,
    ReportLostIdentityCard,
    ModalUpdateCheckin,
    DetailWorkShift,
    CheckinLogDetailV2,
    OrderRowDataV2,
    Censor,
    CensorV2,
    HrTagModal,
    ContractLogDetail,
    UpdateOrder,
    ProfileWalletRowData,
    ModalNote,
    CensorV3,
    ModalExplanation,
    ModalCheckBeforeApproveContract
  },

  props: {
    infinityMode: {
      default: false
    },
    allowExplain: {
      default: false
    },
    curWork: {
      type: String
    },
    filter: {
      type: Object,
      default: _ => ({})
    },
    paging: {
      type: Object,
      default: _ => ({})
    },
    getWorkTrigger: {
      default: false
    },
    overdue: {
      default: false
    }
  },

  data: _ => ({
    loading: false,
    listData: [],
    works: StaffWork.works,
    workMapTable: StaffWork.workMapTable,
    tableDataHeader: StaffWork.tableDataHeader,
    curData: {
      data: null,
      workCategory: null,
      workType: null,
      recordId: null
    },
    orderData: {
      curOrderId: null,
      duty: [],
      rejectReason: null,
      approve_report_wrong_identity: false
    },
    checkinData: {
      curCheckin: null,
      curUser: null,
      curAction: null
    },
    walletData: {
      curProfile: null,
      curProfileExtend: null,
      handlerData: {}
    },
    userPhoneNumber: [],
    recordUpdateVal: {
      type: '',
      data: null
    },
    codGroupIds: ManageListCod.codGroupIds,
    tagData: {
      tableName: null,
      record: {},
      attach: true,
      editTag: true,
      openModalHrTag: false,
      tags: []
    },
    workShift: {
      from: null,
      to: null
    },
    stateLoad: null,
    explainData: {},
    isShowModalCheckBeforeApproveContract: false,
    dataCheckBeforeApproveContract: null
  }),

  created () {
    if (!this.infinityMode) this.getTypeWork()
  },

  watch: {
    getWorkTrigger () {
      this.listData = []
      if (this.infinityMode && this.stateLoad) {
        this.stateLoad.reset()
      } else {
        this.getTypeWork()
      }
    },

    curWork (newVal) {
      if (this.workMapTable[newVal]) this.getTags()
      if (newVal.alias === 'rejected') this.tagData.editTag = false
      else this.tagData.editTag = true
    },

    loading (newVal) {
      this.$emit('load', {loading: newVal, total: this.paging.totalRow})
    }
  },

  methods: {
    getTypeWork ($state = null) {
      let filter = {...this.filter}
      filter.per_page = this.paging.perPage
      filter.current_page = this.paging.curPage
      if (!helper.isEmpty(filter.deadlineOverdue)) {
        filter.deadline = filter.deadlineOverdue
        delete filter.deadlineOverdue
      }

      switch (this.curWork) {
        case 'new_contract_order':
        case 'continue_contract_order':
          filter.limit = filter.per_page
          filter.page = filter.current_page
          if (filter.employee) {
            filter.censorLogin = 0
          }
          break
        case 'insurance_order':
        case 'user_info_order':
          if (filter.employee) {
            filter.censorLogin = 0
          }
          break
      }

      if ($state) this.stateLoad = $state
      if (this.curWork === 'ekyc_image_changes') this.getStatisticEkycImageChange(filter)
      else this.getDataWork(filter)
    },
    async getStatisticEkycImageChange (filter) {
      try {
        this.loading = true
        const {data} = await hrOrderService.getEkycImageChanges(filter)
        if (data.success) {
          this.listData = data.data.imageChanges || []
          this.listData.map(el => {
            el.fixedTags = []
            el.fixedTags.push(Order.getTagByOrderType(el.order.order_type_id))
          })
          this.paging.totalRow = data.data.total || 0
        } else {
          helper.showMessage(data.message || 'Có lỗi khi lấy thông tin công việc !')
          console.log(data.message || 'Có lỗi khi lấy thông tin công việc !')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    getDataWork (filter) {
      this.loading = true
      staffWorkService.getDataWork(filter)
        .then(res => {
          if (res.data.success) {
            // add fix tag
            res.data.data.map(el => {
              if (!el.work_type) return
              if (el.work_type === 'checkin_not_approve') {
                el.fixedTags = []
                el.fixedTags.push({
                  value: el.work_type,
                  name: 'Công chưa duyệt',
                  style: {'background-color': '#D98840', 'color': 'white'}
                })
              }
              if (el.work_type === 'need_active_wallet') {
                el.fixedTags = []
                el.fixedTags.push({
                  value: el.work_type,
                  name: 'Chưa kích hoạt ví',
                  style: {'background-color': '#acabab', 'color': 'white'}
                })
              }
              if (el.work_type === 'user_info_order') {
                el.order.fixedTags = []
                if (el.type.alias === 'modify_ekyc_info') {
                  el.order.fixedTags.push({
                    value: el.work_type,
                    name: 'Cập nhật eKYC',
                    style: {'background-color': '#d9534f', 'color': 'white'}
                  })
                } else {
                  el.order.fixedTags.push({
                    value: el.work_type,
                    name: 'Cập nhật thông tin',
                    style: {'background-color': '#73AC83', 'color': 'white'}
                  })
                }
              }
              if (el.work_type === 'insurance_order') {
                el.order.fixedTags = []
                el.order.fixedTags.push({
                  value: el.work_type,
                  name: 'Bảo hiểm',
                  style: {'background-color': '#70A6E4', 'color': 'white'}
                })
              }
              if (el.work_type === 'new_contract_order') {
                el.fixedTags = []
                el.fixedTags.push({
                  value: el.work_type,
                  name: 'Ký mới',
                  style: {'background-color': '#DDC52F', 'color': 'white'}
                })
              }
              if (el.work_type === 'continue_contract_order') {
                el.fixedTags = []
                el.fixedTags.push({
                  value: el.work_type,
                  name: 'Tái ký',
                  style: {'background-color': '#DDC52F', 'color': 'white'}
                })
              }
              if (el.work_type === 'appendix_contract_order') {
                el.fixedTags = []
                el.fixedTags.push({
                  value: el.work_type,
                  name: 'Phụ lục HĐ',
                  style: {'background-color': '#DDC52F', 'color': 'white'}
                })
              }
              if (el.work_type === 'new_contract_order') {
                el.fixedTags = []
                el.fixedTags.push({
                  value: el.work_type,
                  name: 'Ký mới',
                  style: {'background-color': '#DDC52F', 'color': 'white'}
                })
              }
              if (el.work_type === 'continue_contract_order') {
                el.fixedTags = []
                el.fixedTags.push({
                  value: el.work_type,
                  name: 'Tái ký',
                  style: {'background-color': '#DDC52F', 'color': 'white'}
                })
              }
            })

            // assign data
            if (!this.infinityMode) {
              this.listData = res.data.data
              if (this.overdue) this.$emit('action', {action: 'updateOverdueCount', data: res.data.total})
            } else {
              if (res.data.data.length) {
                if (this.stateLoad) this.stateLoad.loaded()
                this.paging.curPage++
                this.listData.push(...res.data.data)
                if (!helper.isEmpty(this.filter.teamId)) {
                  this.sortListData()
                }
              } else if (this.stateLoad) {
                this.stateLoad.complete()
              }
            }
            this.paging.totalRow = res.data.total || 0
            if (res.data.duty) this.orderData.duty = res.data.duty
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin công việc !')
            console.log(res.data.message || 'Có lỗi khi lấy thông tin công việc !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
        })
    },

    sortListData () {
      let listExplained = []
      let listNotExplained = []
      for (let i = 0; i < this.listData.length; i++) {
        if (!this.listData[i].explained) {
          listNotExplained.push(this.listData[i])
        } else {
          listExplained.push(this.listData[i])
        }
      }
      for (let i = 0; i < listExplained.length; i++) {
        listExplained[i].lastExplainedLog = this.getLastExplainedLog(listExplained[i].logs)
      }
      listExplained.sort((a, b) => {
        if (a.lastExplainedLog.created > b.lastExplainedLog.created) {
          return 1
        }
        if (a.lastExplainedLog.created < b.lastExplainedLog.created) {
          return -1
        }

        return 0
      })
      this.listData = listNotExplained.concat(listExplained)
    },

    getLastExplainedLog (logs) {
      if (helper.isEmpty(logs)) {
        return null
      }
      const totalLogs = logs.length
      let lastLog = null
      for (let i = 0; i < totalLogs; i++) {
        if ((logs[i].type === 'explain' || logs[i].action === 'explainNeedResolveWork') && (lastLog === null || lastLog.created < logs[i].created)) {
          lastLog = logs[i]
        }
      }
      return lastLog
    },

    action (data, action, idx) {
      // Phân quyền duyệt đề xuất báo sai cmnd/cccd cho position 270, 271, 272
      if (
        data.order &&
        data.order.status &&
        data.type &&
        data.type.alias &&
        data.order.status === Order.PENDING_STATUS &&
        data.approve_report_wrong_identity &&
        data.type.alias === 'modify_ekyc_info'
      ) {
        this.orderData.approve_report_wrong_identity = true
      }

      this.curData.curIdx = idx
      this.curData.data = data
      if (!this.curData.data) return
      this.curData.workCategory = data.work_category || action.work_category || action.data.work_category
      this.curData.workType = data.work_type || action.work_type || action.data.work_type
      if (['staff_order', 'staff_order_contract', 'staff_identity'].includes(this.curData.workCategory)) {
        if (['continue_contract_order', 'new_contract_order', 'appendix_contract_order'].includes(this.curData.workType)) {
          this.curData.data.id = data.order_id || null
        } else {
          this.curData.data = data.order
        }
        this.orderData.curOrderId = this.curData.data.id
        this.curData.recordId = this.curData.data.id
      } else if (this.curData.workCategory === 'checkin') {
        this.curData.recordId = action.data.checkinId || null
      } else if (this.curData.data.work_category === 'ekyc_image_changes') {
        this.orderData.curOrderId = this.curData.data.order.id
        this.curData.data.id = data.order.id || null
      }

      if (action.action === 'censor') {
        this.$bvModal.show('modal-edit-censor-staff-work')
      }
      if (action.action === 'handler') {
        this.$bvModal.show('modal-edit-handler')
        this.walletData.handlerData = {
          action: 'active_wallet',
          masterProfileId: action.data.master_profile_id,
          censors: action.data.handlers || []
        }
      }
      if (action.action === 'duyet') {
        this.updateStatus(this.curData.data, 'duyet')
      }
      if (action.action === 'tu_choi') {
        this.$bvModal.show('reject-order-reason-modal')
      }
      if (action.action === 'phone') {
        this.handleToggleModalPhoneNumber(action.data.user_id)
      }
      if (action.action === 'chat') {
        this.gotoGroupChat({id: action.data.user_id})
      }
      if (action.action === 'note') {
        this.walletData.curProfile = action.data.master_profile_id
        this.walletData.curProfileExtend = action.data.master_profile_extend_id
        this.$bvModal.show('modal-note')
      }
      if (action.action === 'view_profile_cod') {
        ManageListCod.redirectProfile(
          action.data.group_id || this.curData.order.profile_info.group_id,
          action.data.user_id || this.curData.order.profile_info.user_id,
          action.data.master_profile_id || this.curData.order.profile_info.id
        )
      }
      if (action.action === 'tag') {
        if (!action.work_type) action.work_type = this.curData.workType || null
        if (!action.work_category) action.work_category = this.curData.workCategory || null
        this.handleToggleModalHrTag(action)
      }
      if (action.action === 'detail_order') {
        this.$bvModal.show('modal-update-staff-order')
      }
      if (action.action === 'action_checkin') {
        this.checkinData.curUser = +action.data.userId
        if (action.data.action === 'show_calendar') {
          let monthSalary = this.getMonthSalary()
          this.workShift.from = monthSalary.from
          this.workShift.to = monthSalary.to
          this.$bvModal.show('modal-checkin-calendar')
        } else {
          this.checkinData.curCheckin = action.data.checkinId || null
          this.checkinData.curAction = action.data.action
          this.$bvModal.show('modal-update-checkin')
        }
      }
      if (action.action === 'explain') {
        this.explainData = action.data
        this.explainData.action = 'explainNeedResolveWork'
        this.explainData.status = this.works[this.curData.workType || action.work_type].desc
        this.curData.recordId = this.explainData.ref_id
        this.$bvModal.show('modal-expain-staff-work')
      }
    },

    // giải trình
    explain (reason) {
      this.explainData.content = reason
      this.$startLoading()
      staffShiftService.explain(this.explainData)
        .then(res => {
          if (res.data.success) {
            this.$bvModal.hide('modal-expain-staff-work')
            // cập nhật log giả trình
            this.updateDataAfterAction('log', res.data.data)
            this.updateDataAfterAction('explained')
            // Sắp xếp lại bản ghi theo thời gian giải trình
            this.sortListData()
            // đếm lại số công việc
            this.getNumStaffWorkOnDay()
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
        })
    },

    // lấy số công việc còn lại cần làm để có thể chốt ca trong ngày
    getNumStaffWorkOnDay () {
      if (!this.filter.teamId) return
      this.$emit('load', {loading: true})
      staffShiftService.getNumStaffWorkOnDay({team_id: this.filter.teamId})
        .then(res => {
          if (res.data.success) {
            this.paging.totalRow = res.data.total
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy số công việc cần xử lý !')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi khi lấy số công việc cần xử lý !')
          console.log(e)
        })
        .finally(_ => {
          this.$emit('load', {loading: false, total: this.paging.totalRow})
        })
    },

    actionUpdateRecord (action) {
      if (action.action === 'attachTag') {
        if (this.tagData.record.tags && action.data) {
          this.tagData.record.tags.push(action.data)
          this.recordUpdateVal.type = 'tag'
          this.recordUpdateVal.data = this.tagData.record
        }
      }
      if (action.action === 'closeHrTag') {
        this.tagData.openModalHrTag = false
      }
    },

    updateHandler () {
      this.curData.data.handlers = this.walletData.handlerData.censors || []
    },

    updateStatus (order, action, isContinueApprove = false) {
      if (action === 'tu_choi' && !this.orderData.rejectReason) {
        alert('Vui lòng nhập lý do từ chối !')
        return
      }
      let data = {
        id: order.id,
        action: action,
        reason: this.orderData.rejectReason,
        isContinueApprove: isContinueApprove
      }
      hrOrderService.updateStatus(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật trạng thái thành công !', 'success')
            order.censors = res.data.censors
            order.status = res.data.update_status
            if (order && order.logs) order.logs.unshift(...res.data.data)
            if (action === 'tu_choi') {
              this.$bvModal.hide('reject-order-reason-modal')
            } else if (action === 'duyet' && isContinueApprove) {
              this.toggleModalCheckBeforeApproveContract(false)
            }
            if (['duyet', 'tu_choi'].includes(action)) {
              if (this.infinityMode) {
                this.getNumStaffWorkOnDay()
                this.updateDataAfterAction('remove')
              } else this.getTypeWork()
              if (order.is_overdue) this.$emit('action', {action: 'totalOverdue', data: -1})
            }
          } else {
            if (action === 'duyet' && res.data.data && res.data.data.is_valid === false) {
              this.dataCheckBeforeApproveContract = res.data.data.data_check
              this.toggleModalCheckBeforeApproveContract(true)
            } else {
              helper.showMessage(res.data.message || 'Không thể chuyển trạng thái của đề xuất !', 'warning')
            }
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra, không thay đổi được trạng thái đề xuất !', 'warning')
        })
        .finally(_ => {
          this.resetUpdateStatusData()
        })
    },

    changeStatusOrderOk (data) {
      if (this.curData.workCategory === 'staff_order') {
        this.curData.data.censors = data.censors || null
        this.curData.data.status = data.update_status
        if (data.data) this.curData.data.logs.unshift(...data.data)
      }
      if (this.curData.workCategory === 'staff_order_contract') {
        this.curData.data.censors = data.censors || null
        this.curData.data.status = data.update_status
        if (data.data) this.curData.data.logs.unshift(...data.data)
      }
      if (this.infinityMode && ['da_duyet', 'tu_choi', 'hoan_thanh', 'da_huy'].includes(data.update_status)) {
        this.updateDataAfterAction('remove')
      }
    },

    resetUpdateStatusData () {
      this.orderData.curOrderId = null
      this.orderData.rejectReason = null
    },

    updateCheckinOk (data) {
      if (['rejected', 'approved'].includes(data.status)) {
        this.getNumStaffWorkOnDay()
        this.updateDataAfterAction('remove')
      }
    },

    updateDataAfterAction (action = null, data = null) {
      let idxCheckin = -1
      if (this.curData.workType === 'checkin_not_approve') {
        idxCheckin = this.curData.data.check_ins.findIndex(el => (+el.checkin_log.id === +this.curData.recordId))
      }
      if (action === 'remove') {
        if (this.curData.workType === 'checkin_not_approve') {
          if (this.curData.data.check_ins[idxCheckin]) {
            if (this.listData.splice(this.curData.curIdx, 1).length > 1) this.curData.data.check_ins.splice(idxCheckin, 1)
            else this.listData.splice(this.curData.curIdx, 1)
          }
        } else {
          this.listData.splice(this.curData.curIdx, 1)
        }
      } else if (action === 'log') {
        if (data) {
          if (this.curData.workType === 'checkin_not_approve') {
            if (!data.time) data.time = data.created
            if (this.curData.data.check_ins[idxCheckin]) this.curData.data.check_ins[idxCheckin].logs.push(data)
          } else this.curData.data.logs.push(data)
        }
      } else if (action === 'add_handler') {
        if (data) this.curdata.data.handler.push(data)
      } else if (action === 'explained') {
        if (this.curData.workType === 'checkin_not_approve') {
          if (this.curData.data.check_ins[idxCheckin]) this.$set(this.curData.data.check_ins[idxCheckin], 'explained', true)
        } else if (this.curData.workCategory === 'staff_order') {
          this.$set(this.curData.data, 'explained', true)
        } else if (this.curData.workCategory === 'staff_order_contract') {
          this.curData.data.explained = true
        }
      } else if (action === 'load_num_work') {
        this.getNumStaffWorkOnDay()
      }
    },

    handleToggleModalHrTag (data) {
      console.log(data)
      if (data.work_category === 'staff_order_contract') {
        this.tagData.recordId = data.data.order_id
      }
      if (data.work_category === 'checkin') {
        this.tagData.recordId = data.data.checkin_log.id
      }
      if (data.work_category === 'wallet') {
        this.tagData.recordId = data.data.master_profile_extend_id
      }
      if (data.work_category === 'staff_order') {
        this.tagData.recordId = data.data.id
      }
      if (data.work_category === 'ekyc_image_changes') {
        this.tagData.recordId = this.curData.data.order.id
      }
      this.tagData.tableName = this.workMapTable[data.work_type]
      this.tagData.attach = true
      this.tagData.record = data.data
      this.tagData.openModalHrTag = true
    },

    handleToggleModalPhoneNumber (userId) {
      if (userId) {
        let params = {
          user_id: userId,
          get_full_tel: true
        }
        this.getUserInfo(params)
        this.$bvModal.show('modal-phone-number')
      } else helper.showMessage('Không lấy được dữ liệu số điện thoại người dùng!', 'warning')
    },

    getUserInfo (params) {
      userService.getUserDetailInfo(params)
        .then(res => {
          if (res.data.success) {
            this.userPhoneNumber = res.data.userInfo
          } else {
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu người dùng!', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
    },

    getTags () {
      let params = {
        table_name: this.workMapTable[this.curWork]
      }
      hrTagService.getList(params)
        .then(res => {
          if (res.data.success) {
            this.tagData.tags = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu thẻ tag!', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
    },

    getMonthSalary (date) {
      if (!date) date = moment()
      else date = moment(date)

      let monthSalary = {
        from: null,
        to: null
      }

      monthSalary.from = date.subtract(20, 'days').format('YYYY-MM') + '-' + '21'
      monthSalary.to = moment(monthSalary.from).add(1, 'months').format('YYYY-MM') + '-' + '20'

      return monthSalary
    },

    saveNote (note) {
      if (!note) return
      let log = {
        master_profile_id: this.walletData.curProfile,
        ref_id: this.walletData.curProfileExtend,
        group_type: 'wallet',
        action: 'noteWallet',
        note: note
      }
      this.$startLoading()
      staffWorkService.staffLog(log)
        .then(res => {
          if (res.data.success) {
            this.getTypeWork()
            this.$bvModal.hide('modal-note')
          } else helper.showMessage(res.data.message || 'Không thêm được ghi chú !')
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    gotoGroupChat (user) {
      if (!user || !user.id) return
      if (user.channel_id) {
        window.open('https://ghtk.me/channel/internal/' + user.channel_id, '_blank')
      } else { // Tạo group chat nếu chưa có
        hrOrderService.createDirectChat({
          // Thêm user_id fix lỗi, k loại bỏ userId sợ ảnh hưởng đến hàm chung
          userId: user.id,
          user_id: user.id
        })
          .then(res => {
            if (res.data.success) {
              let channelId = res.data.data.channel_id
              window.open('https://ghtk.me/channel/internal/' + channelId, '_blank')
            } else {
              helper.showMessage(res.data.message || 'Tạo direct chat thất bại !')
            }
          })
          .catch(e => {
            helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
            console.log(e)
          })
      }
    },
    closeModalPhone () {
      this.userPhoneNumber = {}
      this.$bvModal.hide('modal-phone-number')
    },
    toggleModalCheckBeforeApproveContract (isShow) {
      this.isShowModalCheckBeforeApproveContract = isShow
    }
  }
}
</script>
