<template>
    <div class="d-none d-md-block main-content">
        <b-row class="mx-0 header my-2 align-items-center">
            <b-col md="4" >
                <h4 class="m-0">Quản lý hợp đồng</h4>
            </b-col>
            <b-col md="8" class="text-right">
                <b-btn id="cm-top-header-tab-all" :variant="isActiveTab === 'all' ? 'ghtk' : 'outline-ghtk-color-custom'" class="btn-radius pd-5" @click="searchOrder('all')">Tất cả</b-btn>
                <b-btn id="cm-top-header-tab-new" :variant="isActiveTab === 'new' ? 'ghtk' : 'outline-ghtk-color-custom'" class="btn-radius pd-5" @click="searchOrder('new')">
                  Ký mới
                  <span v-show="!loadingAmount">({{ contractAmount.new }})</span>
                  <i v-show="loadingAmount" class="fas fa-spinner fa-pulse text-ghtk"></i>
                </b-btn>
                <b-btn id="cm-top-header-tab-renew-contract" :variant="isActiveTab === 'resign' ? 'ghtk' : 'outline-ghtk-color-custom'"  class="btn-radius pd-5" @click="searchOrder('resign')">
                  Tái ký
                  <span v-show="!loadingAmount">({{ contractAmount.resign }})</span>
                  <i v-show="loadingAmount" class="fas fa-spinner fa-pulse text-ghtk"></i>
                </b-btn>
                <b-btn id="cm-top-header-tab-appendix" :variant="isActiveTab === 'appendix' ? 'ghtk' : 'outline-ghtk-color-custom'"  class="btn-radius pd-5" @click="searchOrder('appendix')">
                  Phụ lục HĐ
                  <span v-show="!loadingAmount">({{ contractAmount.appendix }})</span>
                  <i v-show="loadingAmount" class="fas fa-spinner fa-pulse text-ghtk"></i>
                </b-btn>
<!--                <b-btn variant="outline-ghtk" class="btn-radius pd-5" @click="searchOrder('liquid')">Thanh lý</b-btn>-->
            </b-col>
        </b-row>
        <div class="d-flex mt-3">
            <div class="filter-select-container">
                <b-row class="mx-0 filter pb-1 border-bottom">
                    <b-col md="2" lg="2" class="mb-1">
                        <input
                                placeholder="CMND/ Mã profile"
                                v-model="filter.staffCode"
                                class="form-control rounded"
                                @keyup.enter="listOrder()"
                        />
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <input
                                placeholder="Họ tên"
                                v-model="filter.fullname"
                                class="form-control rounded"
                                @keyup.enter="listOrder()"
                        />
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <multi-select-department
                            :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal rounded'"
                            :department-ids="filter.department"
                             @handleDepartmentSelected="handleDepartmentSelected"
                         >
                        </multi-select-department>
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <multi-select-position
                            :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal rounded'"
                            :position-ids="filter.position"
                            @handlePositionSelected="handlePositionSelected"
                        ></multi-select-position>
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <multi-select-region
                            :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal rounded'"
                            :auto-close="true"
                            :hide-selected="true"
                            @handleSelectedRegion="handleSelectedRegion"
                        ></multi-select-region>
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <multi-select-province
                            :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal rounded'"
                            :province-ids="filter.province"
                            :auto-close="true"
                            :hide-select="true"
                            @handleProvinceSelected="handleProvinceSelected"
                        ></multi-select-province>
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <single-select-user
                                :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal rounded'"
                                @select="op => {filter.censor = op ? op.id : null}"
                                placeholder="Người xử lý"
                        ></single-select-user>
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1 placeholder-contain">
                        <v-date-picker
                                v-model="range_deadline"
                                mode="range"
                                locale="vi"
                                color="green"
                                class="rounded"
                                :input-props="{ placeholder: 'Hạn xử lý ', style: 'font-size:14px; line-height: unset; border-radius: 0; border-color: #e8e8e8' }"
                                :popover="{visibility: 'focus'}"
                        />
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <single-select-user
                                :custom-class="'multiselect-ghtk multiselect-no-horizontal rounded'"
                                @select="op => {filter.creator = op ? op.id : null}"
                                placeholder="Người tạo"
                        ></single-select-user>
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1 placeholder-contain">
                        <v-date-picker
                                v-model="range_created"
                                mode="range"
                                locale="vi"
                                color="green"
                                class="rounded"
                                :input-props="{ placeholder: 'Thời gian tạo ', style: 'font-size:14px; line-height: unset; border-radius: 0; border-color: #e8e8e8' }"
                                :popover="{visibility: 'focus'}"
                        />
                    </b-col>
                    <b-col  md="2" lg="2" class="mb-1">
                        <select-order-type
                                :custom-class="'multiselect-ghtk multiselect-no-horizontal rounded'"
                                :type="filter.type"
                                :group-alias="'contract'"
                                :multiple="true"
                                :auto-close="true"
                                @input="selectOrderType"
                                :append-category="true"
                        ></select-order-type>
                    </b-col>
                    <b-col md="2" lg="2" class="mb-1">
                        <select-order-status
                                :custom-class="'multiselect-ghtk multiselect-no-horizontal rounded'"
                                class="z-3"
                                :multiple="true"
                                :status="filter.status"
                                @input="selectOrderStatus"
                        ></select-order-status>
                    </b-col>
                </b-row>
            </div>
            <div class="search-button-container">
                <b-row class="mx-0 filter pb-1">
                    <b-col md="12" class="text-right">
                        <multi-select-station
                                :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal rounded'"
                                :station-ids="filter.station"
                                :auto-close="true"
                                :hide-select="true"
                                @handleStationSelected="handleStationSelected"
                        ></multi-select-station>
                        <b-btn variant="ghtk" @click="listOrder()" class="mt-1" style="border-radius: 5px; width: 100%"><i class="fas fa-search"></i> Tìm kiếm</b-btn>
                    </b-col>
                </b-row>
            </div>
        </div>

        <div class="order-table row mx-0">
            <div class="col col-12 table-content">
                <table class="table table-hover bg-white table-order-list w-100 d-block table-responsive-sm">
                    <thead>
                    <tr class="header-row">
                        <th class="text-center candidate-col">Thông tin ứng viên</th>
                        <th class="text-center log-col">Chi tiết log</th>
                        <th class="text-center action-col">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody class="position-relative" v-loading="loading">
                    <tr v-for="(order, idx) in orders" :key="idx">
                        <td>
                            <div>
                                <strong :class="codGroupIds.includes(parseInt(order.profile_info.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                                @click="redirectProfile(order.profile_info.group_id, order.profile_info.user_id)">
                                {{order.profile_info.fullname}} ({{order.profile_info.username}})
                                </strong>
                            </div>
                            <div>
                                <span>{{order.profile_info.position_name}} - {{order.profile_info.province}} - {{order.profile_info.station}}</span>
                            </div>
                            <div>
                                <span>{{order.profile_info.tel}}</span>
                            </div>
                            <div class="d-flex mt-3">
                                <b-btn variant="ghtk" class="btn-user mr-2 cm-btn-view-profile" name="cm-btn-view-profile" @click="openLink(order.profile_info.group, order.profile_info.id, order.profile_info.user_id)">Xem profile</b-btn>
                                <b-btn variant="ghtk" class="btn-user cm-btn-chat" name="cm-btn-chat" @click="gotoGroupChat(order)"><img src="../../../../assets/images/chat.png" class="icon-award" alt=""> Chat</b-btn>
                            </div>
                        </td>
                        <td>
                            <div>
                                <strong>{{genCodeOrder(order.order_id, order.category === 'contract' ? 'HĐ' : 'BH')}}</strong>
                                <span v-if="order.contract_info">
                                - <span>{{genTypeContractName(order.contract_info.type_contract)}}</span>
                                - <span>Tính KPI: {{ +order.contract_info.has_kpi ? 'Có' : 'Không' }}</span>
                                </span>
                                <span v-if="isActiveTab === 'appendix'"> - {{ order.type.name }}</span>
                            </div>
                            <div v-if="order.contract_info">
                              <span v-if="order.contract_info.end_date && order.type_alias !== 'new_appendix'">Thời hạn: {{ formatDate(order.contract_info.start_date, 'DD/MM/YYYY') }} - {{ formatDate(order.contract_info.end_date, 'DD/MM/YYYY') }}</span>
                              <span v-if="!order.contract_info.end_date && order.type_alias !== 'new_appendix'">Không thời hạn</span>
                              <span class="d-flex" v-if="order.type_alias === 'new_appendix'">
                                Ngày bắt đầu hiệu lực: {{ helper.isEmpty(order.contract_info.effect_date) ? '' : formatDate(order.contract_info.effect_date, 'DD/MM/YYYY') }}
                              </span>
                            </div>
                            <div>
                                <strong>Hạn xử lý: {{helper.isEmpty(order.deadline) ? '' : formatDate(order.deadline, 'HH:mm:ss DD/MM/YYYY')}}</strong>
                                <strong class="d-flex">Trạng thái: {{order.status_desc}}</strong>
                            </div>
                            <div class="mt-2">
                                <time-line
                                  :item-style="{
                                    'padding': '0px',
                                    'fontSize': '14px'
                                  }"
                                  :logs="order.logs"
                                  :append-action="!['da_duyet', 'tu_choi', 'da_huy', 'hoan_thanh'].includes(order.status)"
                                  message-field="message"
                                  @action="logAction(order, ...arguments)"
                                ></time-line>
                            </div>
                        </td>
                        <td class="text-center">
                            <b-btn v-if="isShowAction(order.permission, 'view')" variant="outline-ghtk"
                              class="action-btn cm-btn-view-contract" name="cm-btn-view-contract" @click="detailOrder(order.order_id)">
                              {{ order.type_alias === 'new_contract' ? 'Xem hợp đồng' : 'Xem phụ lục'}}
                             </b-btn>
                            <b-btn v-if="isShowAction(order.permission, 'approve') && !order.isApproving" variant="outline-ghtk"
                              class="action-btn mt-2 cm-btn-approve-contract" name="cm-btn-approve-contract" @click="checkStatusUpdate(order, idx, 'duyet')">Duyệt</b-btn>
                            <b-btn v-if="isShowAction(order.permission, 'approve') && order.isApproving" variant="outline-ghtk"
                              class="action-btn mt-2"><i class="fa fa-spin fa-spinner"></i> Đang duyệt</b-btn>
                            <b-btn v-if="isShowAction(order.permission, 'reject')" variant="outline-ghtk"
                              class="action-btn mt-2 cm-btn-reject-contract" name="cm-btn-reject-contract" @click="checkStatusUpdate(order, idx, 'tu_choi')">Từ chối</b-btn>
                        </td>
                    </tr>
                    <tr v-show="!orders || !orders.length">
                        <td class="text-center align-middle no-result" colspan="6">
                            <div class="w-100">Không có đề xuất nào !</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
<!--        Phân trang-->
        <div class="paging mt-2 mx-3 paging-container">
            <div class="z-0 d-inline-block paginator-ghtk">
                <b-pagination
                        class="mb-1"
                        size="sm"
                        align="left"
                        v-model="page.current"
                        :total-rows="page.total"
                        :per-page="page.per_page"
                        @input="listOrder()"
                >
                </b-pagination>
            </div>
            <b class="float-left">Trang {{ page.current }}/{{ Math.ceil(page.total/page.per_page) }}</b>
            <b-btn right variant="ghtk" class="float-right mb-2" id="cm-btn-create-order-contract" v-if="permission" @click="detailOrder(null, 'new_contract')">
                <span slot="button-content">
                  <i class="fas fa-plus"></i> Tạo đề xuất
                </span>
            </b-btn>
        </div>

        <b-modal id="modal-order" static modal-class="modal-xxl" title="THÔNG TIN ĐỀ XUẤT" hide-footer @hide="resetCurOrder">
            <update-order
                    :id-order="orderId || null"
                    :modal-style="true"
                    :order-type="createOrderType"
                    :edit="permission"
                    @addOrderOk="listOrder()"
                    @changeStatusOk="listOrder()"
            ></update-order>
        </b-modal>
        <b-modal title="Cập nhật người xử lý" id="modal-edit-censor" hide-footer>
          <Censor :order="editCensorOrder" :order-id="editCensorOrder.order_id" />
        </b-modal>
        <LogUpdateOrder :log-id="logUpdateId" id="view-log-update" />

        <b-modal static title="Nhập lý do từ chối" id="reject-reason-modal" @hide="resetUpdateStatusData">
          <textarea
                  name="reject-reason-input"
                  rows="4"
                  class="form-control"
                  v-model="rejectReason"
          ></textarea>
            <div slot="modal-footer" class="w-100 text-center">
                <b-btn variant="success" @click="updateStatus(currOrder, 'tu_choi', rejectReason)">OK</b-btn>
                <b-btn variant="danger" @click="$bvModal.hide('reject-reason-modal')">Hủy</b-btn>
            </div>
        </b-modal>
        <ModalCheckBeforeApproveContract
          :data-check="dataCheckBeforeApprove"
          :is-show="isShowModalCheckBeforeApprove"
          @toggleModal="toggleModalCheckBeforeApprove"
          @continueApprove="updateStatus(currOrder, 'duyet', rejectReason, true)"
        />
    </div>
</template>

<style lang="scss" scoped>
    .filter-select-container {
        width: 85%;
    }
    .search-button-container {
        width: 15%;
        text-align: right;
    }
    .table-order-list {
        max-height: 75vh;
        overflow: auto;
    }
    .header-sticky th {
        background: white;
        position: sticky;
        top: -1px;
        box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.4);
        z-index: 1;
    }
    .order-table table {
        min-height: 25vh;
        border-bottom: solid 1px #f1f1f1;
        color: #000000;
    }
    .status-col, .deadline-col, .action-col {
        width: 10%;
    }
    .candidate-col {
        width: 20%;
    }
    .log-col {
        width: 68%;
    }
    .action-col {
        width: 12%;
    }
    .page-input {
        z-index: 0;
    }
    .font-14 {
        font-size: 14px;
    }
    .font-13 {
        font-size: 13px;
    }
    td {
        border-bottom: 1px solid #ddd;
    }
    .no-result {
        font-size: 14px;
        width: calc(100vw - 52px);
    }
    .btn-radius {
        border-radius: 20px;
    }
    .pd-5 {
        padding-bottom: 5px;
        padding-top: 5px;
    }
    .btn-user {
        padding: 0;
        border-radius: 15px;
        font-size: 0.83rem;
        width: 44%;
        text-align: center;
    }
    .action-btn {
        border-radius: 20px;
        width: 90%;
        padding: 5px 0 5px 0;
        text-align: center;
    }
    .header-row {
        background-color: #f1f1f1;
        font-size: 16px;
        font-weight: 500;
    }
</style>

<script>
// custom component
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import SelectOrderStatus from './SelectOrderStatus'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import UpdateOrder from './UpdateOrder'
import TimeLine from '../StaffLog/TimeLine.vue'
import Censor from './Censor'
import SelectOrderType from './SelectOrderType'
import LogUpdateOrder from './LogUpdateOrder'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'

// service
import hrOrderService from 'domain/services/hr-order-service'
import newStaffService from 'domain/services/new-staff.service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
import Contract from 'domain/entities/Contract'
import moment from 'moment'
import ManageListCod from 'domain/entities/ManageListCod'
import {mapGetters} from 'vuex'

// component
import ModalCheckBeforeApproveContract from 'components/pages/erp/HrOrder/ModalCheckBeforeApproveContract'

export default {
  name: 'contract-sign',
  props: {
    orderCode: {
      default: null
    },

    categoryAlias: {
      default: null
    },

    groupAlias: {
      default: null
    }
  },

  components: {
    MultiSelectProvince,
    MultiSelectStation,
    SelectOrderStatus,
    MultiSelectRegion,
    MultiSelectDepartment,
    MultiSelectPosition,
    UpdateOrder,
    Censor,
    LogUpdateOrder,
    TimeLine,
    ManageListCod,
    SelectOrderType,
    SingleSelectUser,
    ModalCheckBeforeApproveContract
  },

  data: _ => ({
    loading: false,
    loadingAmount: false,
    loadingMissDeadlineOrder: false,
    exporting: false,
    fileExport: null,
    isApproving: [],
    dataCheckBeforeApprove: [],
    isShowModalCheckBeforeApprove: false,
    page: {
      current: 1,
      total: 0,
      per_page: 10
    },
    orderId: null,
    currOrder: null,
    isActiveTab: 'all',
    createOrderType: null,
    range_deadline: null,
    range_created: null,
    filter: {
      subType: 'all',
      staffCode: null,
      censor: null,
      creator: null,
      type: null,
      fromCreated: null,
      toCreated: null,
      department: null,
      fromDeadline: null,
      toDeadline: null,
      region: null,
      province: null,
      station: null,
      position: null,
      fullname: null,
      status: null
    },
    contractAmount: {
      new: 0,
      resign: 0,
      appendix: 0
    },
    typeContract: Contract.arrayTypeContract,
    range_time: null,
    orders: [],
    rejectReason: null,
    curOrder: {
      idx: null,
      id: null
    },
    resetEmployee: false,
    contractId: null,
    editCensorOrder: {},
    logUpdateId: null,
    codGroupIds: ManageListCod.codGroupIds,
    permission: true
  }),

  created () {
    this.listOrder()
    this.getAmountContractByType()
  },

  mounted () {
    helper.importLibraryTracingLogs()
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
  },

  computed: {
    helper: function () {
      return helper
    },
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    canApproveNotQualifyContract: function () {
      if (!this.userInfo || !this.userInfo.ErpPosition) {
        return false
      }
      return [110, 271, 270, 272, 269, 286, 154].includes(parseInt(this.userInfo.ErpPosition.id))
    }
  },

  watch: {
    categoryAlias (newVal) {
      if (newVal) {
        this.filter.category = newVal
        this.filter.group = null
        this.listOrder(true)
      } else this.filter.category = null
    },

    groupAlias (newVal) {
      if (newVal) {
        this.filter.category = null
        this.filter.group = newVal
        this.listOrder(true)
      }
    }
  },

  methods: {
    async gotoGroupChat (order) {
      if (!order || !order.order_id) return
      if (!order.channel_id) { // Tạo group chat nếu chưa có
        const res = await newStaffService.createDirectChat({user_id: order.profile_info.user_id})
        const {success, message, data} = res.data
        if (success) {
          order.channel_id = data.channel_id
        } else {
          helper.showMessage(message)
          return
        }
      }
      window.open('https://ghtk.me/channel/internal/' + order.channel_id, '_blank')
    },

    logAction (order, data) {
      if (!data || !data.action) return
      if (data.action === 'censor') {
        if (['da_duyet', 'tu_choi', 'hoan_thanh', 'da_huy'].includes(order.status)) return
        this.editCensorOrder = order
        this.$bvModal.show('modal-edit-censor')
      } else if (data.action === 'view-log-update') {
        this.logUpdateId = data.data
        this.$bvModal.show('view-log-update')
      }
    },

    formatDate (value, format = 'HH:mm:ss DD/MM/YYYY') {
      return moment(value).format(format)
    },

    isShowAction (permission, action) {
      return permission.includes(action)
    },

    searchOrder (subType) {
      this.filter.subType = subType
      this.isActiveTab = subType
      this.listOrder()
    },

    genTypeContractName (type) {
      let data = this.typeContract.find((option) => (option.value === type)) || null
      if (data !== null) return data.desc
      return null
    },

    genCodeOrder (id, prefix = 'BH', postfix = '', codeLength = 6) {
      return helper.genCode(id, prefix, postfix, codeLength)
    },

    resetUpdateStatusData () {
      this.currOrder.isApproving = false
      this.currOrder = null
      this.rejectReason = null
    },

    resetCurOrder () {
      this.orderId = null
      this.createOrderType = null
    },

    detailOrder (orderId, orderType) {
      if (orderId) {
        this.orderId = orderId
      } else {
        this.createOrderType = orderType || null
      }
      this.$bvModal.show('modal-order')
    },

    listOrder () {
      let timeFormatDeadline = this.range_deadline != null ? this.getStartEndFromTimeRange(this.range_deadline) : {}
      let timeFormatCreated = this.range_created != null ? this.getStartEndFromTimeRange(this.range_created) : {}
      this.filter.fromDeadline = timeFormatDeadline.from
      this.filter.toDeadline = timeFormatDeadline.to
      this.filter.fromCreated = timeFormatCreated.from
      this.filter.toCreated = timeFormatCreated.to
      let data = {...this.filter}
      data.perPage = this.page.per_page
      data.page = this.page.current

      this.loading = true
      hrOrderService.getOrderContracts(data)
        .then(res => {
          if (res.data.success) {
            this.orders = res.data.data
            this.permission = res.data.permission
            this.getTotal()
          } else {
            helper.showMessage(res.data.message || 'Không lấy được danh sách đề xuất !')
          }
        })
        .catch(e => {
          // helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
        })
    },

    getTotal () {
      let data = {...this.filter}
      data.perPage = this.page.per_page
      data.page = this.page.current

      // this.loading = true
      hrOrderService.getTotal(data)
        .then(res => {
          if (res.data.success) {
            this.page.total = +res.data.data
          } else {
            helper.showMessage(res.data.message || 'Không lấy được số lượng đề xuất !')
          }
        })
        .catch(e => {
          // helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .then(_ => {
          // this.loading = false
        })
    },

    getAmountContractByType () {
      let data = {...this.filter}

      this.loadingAmount = true
      hrOrderService.getAmountContractByType(data)
        .then(res => {
          if (res.data.success) {
            this.contractAmount = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Không lấy được số lượng đề xuất !')
          }
        })
        .catch(e => {
          // helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .then(_ => {
          this.loadingAmount = false
        })
    },

    checkStatusUpdate (order, idx, action) {
      this.currOrder = order

      if (action === 'tu_choi') {
        this.$bvModal.show('reject-reason-modal')
        return
      }

      this.updateStatus(order, action, this.rejectReason)
    },

    updateStatus (order, action, rejectReason, isContinueApprove = false) {
      if (!order || !order.order_id) return
      if (action === 'tu_choi' && !rejectReason) {
        alert('Vui lòng nhập lý do từ chối')
        return
      }
      let data = {
        id: order.order_id,
        action: action,
        reason: rejectReason,
        isContinueApprove: isContinueApprove
      }
      if (action === 'duyet') this.currOrder.isApproving = true
      let needClearUpdateData = true
      if (isContinueApprove) {
        needClearUpdateData = false
      }
      hrOrderService.updateStatus(data)
        .then(res => {
          this.currOrder.isApproving = false
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật trạng thái thành công !', 'success')
            if (action === 'tu_choi') {
              this.$bvModal.hide('reject-reason-modal')
            } else if (action === 'duyet' && isContinueApprove) {
              this.toggleModalCheckBeforeApprove(false)
            }
            res.data.id = data.id
            this.listOrder()
            needClearUpdateData = true
          } else {
            if (action === 'duyet' && res.data.data && res.data.data.is_valid === false) {
              needClearUpdateData = false
              this.dataCheckBeforeApprove = res.data.data.data_check
              this.toggleModalCheckBeforeApprove(true)
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
          if (needClearUpdateData) {
            this.resetUpdateStatusData()
          }
        })
    },

    resetFilter () {
      for (const field in this.filter) {
        this.filter[field] = null
      }
      this.listOrder()
    },

    openLink (group, profileId, userId) {
      if (group === 'COD') {
        window.open('https://admin.giaohangtietkiem.vn/adm/profile/cods/' + userId, '_blank')
      }
      window.open('https://admin.giaohangtietkiem.vn/adm/profile/master/edit/' + profileId, '_blank')
    },

    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleSelectedRegion (ops) {
      this.filter.region = ops ? ops.map(op => op.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },

    handleDepartmentSelected: function (option) {
      this.filter.department = option ? option.map((item) => item.id).toString() : ''
    },

    handlePositionSelected: function (option) {
      this.filter.position = option ? option.map((item) => item.id).toString() : ''
    },

    selectOrderType (ops) {
      this.filter.type = ops ? ops.map(item => item.id).toString() : ''
    },

    selectOrderStatus (ops) {
      this.filter.status = ops ? ops.map(item => item.value).toString() : ''
    },

    getStartEndFromTimeRange (range) {
      return {
        from: moment(range.start).format('YYYY-MM-DD'),
        to: moment(range.end).format('YYYY-MM-DD')
      }
    },

    redirectProfile (groupId, userId) {
      ManageListCod.redirectProfile(groupId, userId)
    },

    toggleModalCheckBeforeApprove (isShow) {
      this.isShowModalCheckBeforeApprove = isShow
    }
  }
}
</script>
