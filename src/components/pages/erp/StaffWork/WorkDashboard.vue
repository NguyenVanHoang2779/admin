<template>
  <div class="small-scrollbar work-dash">
    <!-- Header + Action -->
    <b-row class="header my-2 align-items-center">
      <b-col md="2">
        <h4 class="m-0 text-black">Cần xử lý</h4>
      </b-col>
      <b-col md="10" class="text-right">
        <div class="d-flex justify-content-end align-item-center">
          <div class="tab-work-scroll">
            <div class="pre-tab pre-tab-left" v-if="tabScroll.leftShow">
              <div class="pre-btn text-ghtk" @click="scroll('tab-work', 'left')">
                <i class="ion ion-ios-arrow-back"></i>
              </div>
            </div>
            <div class="work-options" v-scroll="checkScrollTab" v-resize="checkScrollTab" id="tab-work">
              <button
                v-for="(work, key) in works"
                :key="key"
                :class="curWork === key ? 'btn-ghtk' : 'btn-ghtk-disable'"
                class="btn btn-pill mr-1"
                @click="switchTab(key)"
                :id="work.dom_id"
                v-show="showButton(key)"
              >
                {{ work.desc }}
                <span>
                  <span v-show="!loading['statistic_' + work.type]">({{ statistics[key] || 0 }})</span>
                  <i v-show="loading['statistic_' + work.type]" class="fas fa-spinner fa-pulse"></i>
                </span>
              </button>
            </div>
            <div class="pre-tab pre-tab-right" v-if="tabScroll.rightShow">
              <div class="pre-btn text-ghtk" @click="scroll('tab-work', 'right')">
                <i class="ion ion-ios-arrow-forward"></i>
              </div>
            </div>
          </div>
          <div class="ml-4 list-tag-btn">
            <span class="text-ghtk cursor-pointer mx-2" @click="handleToggleModalHrTag"><i class="fas fa-plus"></i> Tag</span>
          </div>
        </div>
      </b-col>
    </b-row>

    <div v-if="works[curWork].dashboard_type === 'common'">
      <!-- Filter  -->
      <div class="row filter pb-2 justify-content-between input-border">
        <div class="mb-1 input-filter z-100">
          <single-select-user
            class="multiselect-ghtk multiselect-no-horizontal"
            @onChange="op => {filter.employee = op ? op.id : null}"
            placeholder="Họ tên/username"
            :reset="resetEmployee"
          ></single-select-user>
        </div>
        <b-form-group class="mb-1 input-filter">
          <input
            class="z-5 form-control"
            type="number"
            placeholder="CMND/CCCD"
            v-model="filter.identify_id"
            :disabled="false"
            @input="helper.validValue(filter, 'identify_id', { length: 12 })"
          />
        </b-form-group>
        <div class="mb-1 input-filter z-100">
          <MultiSelectDepartment
            class="multiselect-ghtk multiselect-no-horizontal"
            :department-ids="filter.department"
            :auto-close="true"
            :hide-selected="true"
            placeholder="Bộ phận"
            @handleDepartmentSelected="handleDepartmentSelected"
          />
        </div>
        <div class="mb-1 input-filter z-100">
          <MultiSelectPosition
            class="multiselect-ghtk multiselect-no-horizontal"
            :department-ids="filter.department"
            :position-ids="filter.position"
            :auto-close="true"
            :hide-selected="true"
            placeholder="Vị trí"
            @handlePositionSelected="handlePositionSelected"
          />
        </div>
        <div class="mb-1 input-filter z-100">
          <MultiSelectWorkType
            :customMultiselectClass="'multiselect-ghtk multiselect-no-horizontal'"
            @handleSelectedWorkType="handleSelectedWorkType"
            :positionCustom="filter.position"
            :multiple="true"
            :placeholder="'Hình thức làm việc'"
          />
        </div>
        <b-form-group class="mb-1 input-filter">
          <input
            class="form-control"
            type="number"
            placeholder="Mã đề xuất"
            v-model="filter.order_id"
            :disabled="false"
            @input="helper.validValue(filter, 'order_id', { length: 12 })"
          />
        </b-form-group>
        <div class="mb-1 input-filter z-100">
          <MultiSelectHrTag
            :reload="tagData.reload"
            :tableName="this.workMapTable[this.curWork]"
            :customClass="'multiselect-ghtk multiselect-no-horizontal'"
            :auto-close="true"
            :hide-selected="true"
            placeholder="Thẻ"
            @handleHrTagSelected="handleHrTagSelected"
          />
        </div>
        <div class="mb-1 input-filter z-5">
          <MultiSelectRegion
            :customClass="'multiselect-ghtk multiselect-no-horizontal'"
            :regions="filter.region ? filter.region : ''"
            @handleSelectedRegion="handleSelectedRegion"
          />
        </div>
        <div class="mb-1 input-filter z-5">
          <multi-select-province
            :customClass="'multiselect-ghtk multiselect-no-horizontal'"
            :province-ids="filter.province"
            :region="filter.region"
            :auto-close="true"
            :hide-select="true"
            @handleProvinceSelected="handleProvinceSelected"
          ></multi-select-province>
        </div>
        <div class="mb-1 input-filter z-5">
          <multi-select-station
            class="multiselect-ghtk multiselect-no-horizontal"
            :province-ids="filter.province"
            :auto-close="true"
            :hide-select="true"
            @input="handleStationSelected"
          ></multi-select-station>
        </div>
        <div class="mb-1 input-filter z-5">
          <single-select-user
            class="multiselect-ghtk multiselect-no-horizontal"
            @onChange="op => {filter.handler = op ? op.id : null}"
            placeholder="Người xử lý"
            :reset="resetEmployee"
          ></single-select-user>
        </div>
        <div class="mb-1 input-filter">
          <v-date-picker
            v-model="filter.deadline"
            mode="range"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Hạn xử lý', style: 'font-size:14px; line-height: unset', class: 'form-control rounded' }"
            :popover="{visibility: 'focus'}"
          />
        </div>
        <div class="mb-1 input-filter">
          <v-date-picker
            v-model="filter.created"
            mode="range"
            locale="vi"
            color="green"
            :input-props="{ placeholder: 'Ngày tạo', style: 'font-size:14px; line-height: unset', class: 'form-control rounded' }"
            :popover="{visibility: 'focus'}"
          />
        </div>
        <div class="text-right input-filter">
          <button class="btn btn-ghtk rounded w-100" @click="search">Tìm kiếm</button>
        </div>
      </div>
      <!-- deadline filter -->
      <p v-if="hasDeadline">
        Bạn có
        <span
          class="cursor-pointer text-underline-hover" style="color: #4c9aff"
          @click="getOverDueData"
        >
          {{totalOverdue}}</span>
        đề xuất quá hạn
      </p>
      <!-- Table data  -->
      <TableData
        class="table-sticky mh-75"
        @action="action"
        :cur-work="curWork"
        :overdue="overdueDash"
        :paging="page"
        :filter="filter"
        :getWorkTrigger="getWorkTrigger"
      />
      <!-- paging  -->
      <div class="row mt-3 align-items-center">
        <div class="col col-md-6 text-left">
          <b>
            Bản ghi/ trang
          </b>
          <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block" v-model="page.perPage" @change="getWork()">
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <div class="z-0 d-inline-block">
            <b-pagination
              class="paginator-ghtk mb-0"
              size="sm"
              align="left"
              v-model="page.curPage"
              :total-rows="+page.totalRow"
              :per-page="+page.perPage"
              @input="getWork()"
            >
            </b-pagination>
          </div>
        </div>
        <div class="col col-md-6 text-right">
          <div v-if="curWork === 'insurance_order'" class="d-inline-block">
            <b-dd
              v-if="checkPermissionExportAllPage()"
              v-show="!orderData.fileExport"
              :disabled="orderData.exporting"
              right dropup
              variant="ghtk"
              toggle-class="rounded mr-2"
            >
              <span slot="button-content">
                <i class="fas" :class="!orderData.exporting ? 'fa-file-excel' : 'fa-spinner fa-pulse'"></i> {{ orderData.exporting ? 'Đang xuất...' : 'Xuất data' }}
              </span>
              <b-dd-item-btn @click="exportOrderHr('insurance_list')">Danh sách BHXH</b-dd-item-btn>
              <b-dd-item-btn @click="exportOrderHr('contract')" disabled>Danh sách hợp đồng</b-dd-item-btn>
              <b-dd-item-btn @click="exportOrderHr('insurance_viettel')">File mã hóa BHXH Viettel</b-dd-item-btn>
              <b-dd-item-btn @click="exportOrderHr('insurance_efy')">File mã hóa BHXH EFY</b-dd-item-btn>
            </b-dd>
            <b-btn v-show="!!orderData.fileExport" variant="ghtk" @click="downloadFile" class="rounded mr-2">
              <i class="fas fa-download"></i> Tải file
            </b-btn>
          </div>
          <b-dd right variant="ghtk" class="justify-content-end" toggle-class="rounded" dropup>
            <span slot="button-content">
              <i class="ion ion-ios-add"></i> Tạo đề xuất
            </span>
            <b-dd-item-btn id="wd-btn-create-insurance-order" @click="createOrder('TM')">BHXH</b-dd-item-btn>
            <b-dd-item-btn id="wd-btn-create-contract-order" @click="createOrder('new_contract')">Hợp đồng</b-dd-item-btn>
            <b-dd-item-btn id="wd-btn-create-resign-order" @click="createOrder('resign')">Nghỉ việc</b-dd-item-btn>
          </b-dd>
        </div>
      </div>
    </div>

    <div v-if="works[curWork].dashboard_type === 'profile_documents'">
      <ProfileManagement />
    </div>
    <div v-else-if="works[curWork].dashboard_type === 'tax'">
      <manage-dependant></manage-dependant>
    </div>
    <div v-else-if="works[curWork].dashboard_type === 'union'">
      <manager-union></manager-union>
    </div>
    <div v-else-if="works[curWork].dashboard_type === 'child_frame'">
      <iframe
        :src="getUrlIframe(works[curWork].path_name)"
        :title="works[curWork].desc"
        :id="elementId.sosIframe"
        width="100%"
        style="height: 92vh;"
        class="border-0"
      ></iframe>
    </div>
    <div v-else-if="works[curWork].dashboard_type === 'profile_car_driver'">
      <iframe
        :src="getUrlIframeProfileCarDriver(works[curWork].path_name)"
        :title="works[curWork].desc"
        :id="elementId.sosIframe"
        width="100%"
        style="height: 92vh;"
        class="border-0"
      ></iframe>
    </div>
    <!-- modal  -->
    <b-modal id="modal-create-order" static modal-class="modal-xxl" title="THÔNG TIN ĐỀ XUẤT" hide-footer>
      <UpdateOrder
        :modal-style="true"
        :order-type="orderData.createOrderType"
        @addOrderOk="getWork()"
      />
    </b-modal>
    <HrTagModal
      :scope="'global'"
      :open="tagData.openModalHrTag"
      :attachPermission="false"
      :tableName="this.workMapTable[this.curWork]"
      :tags="tagData.tags"
      @action="actionUpdateRecord"
    />
  </div>
</template>

<style lang="scss" scoped>
  .tab-work-scroll {
    position: relative;
    display: flex;
    width: 80%;
    justify-content: end;
    align-items: center;
  }
  .list-tag-btn {
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  .pre-tab {
    top: 0;
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    z-index: 100;
    &-left {
      left: -1.75rem;
      &:after {
        content: "";
        pointer-events: none;
        height: 100%;
        width: 3rem;
        background: linear-gradient(to right,rgba(255, 255, 255, 0.98) 20%,rgba(255,255,255,0) 80%);
      }
    }
    &-right {
      right: -1.75rem;
      &:before {
        content: "";
        pointer-events: none;
        height: 100%;
        width: 3rem;
        background: linear-gradient(to left,rgba(255, 255, 255, 0.98) 20%,rgba(255,255,255,0) 80%);
      }
    }
  }
  .pre-btn {
    font-size: x-large;
    padding: 0 0.5rem;
    cursor: pointer;
  }
  .work-options {
    overflow: auto;
    white-space: nowrap;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
  .filter {
    padding: 0 0.5rem 0 0.5rem;
  }
  .input-filter {
    width: 14.28%;
    padding: 0 0.25rem;
  }
  .input-border {
    input {
      border-radius: 4px;
    }
  }
  .table-data {
    border-bottom: 1px solid #ddd;
    table {
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
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
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectWorkType from 'components/elements/common/MultiSelectWorkType'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectHrTag from 'components/elements/common/MultiSelectHrTag'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import HrTagModal from 'components/pages/erp/HrOrder/HrTagModal'
import UpdateOrder from 'components/pages/erp/HrOrder/UpdateOrder'
import ProfileManagement from 'components/pages/erp/ProfileManager/ProfileManagement'
import ManageDependant from '../../DependantPerson/ManageDependant'
import ManagerUnion from '../../Union/ManagerUnion'
import TableData from './TableData.vue'
import Multiselect from 'vue-multiselect'
import moment from 'moment'

// service
import checkinService from 'domain/services/checkin-service'
import hrStatisticService from 'domain/services/hr-statistic-service'
import hrOrderService from 'domain/services/hr-order-service'
import hrTagService from 'domain/services/hr-tag-service'
import staffWorkService from 'domain/services/staff-work-service'
import profileService from 'domain/services/profile-service'
import profileManagerService from 'domain/services/profile-mamanger-service'
import dependantPersonService from '../../../../domain/services/dependant-person-service'
import hrmTicketService from 'domain/services/Erp/ticket-service'
import ticketService from '@/domain/services/Erp/ticket-service'
import profileCarDriverService from '@/domain/services/Erp/profile-car-driver-service'
import userService from '@/domain/services/user-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import {mapGetters} from 'vuex'

// store
import store from '@/store'

// entities
import StaffWork from 'domain/entities/StaffWork.js'

// mixins
import ExportMixin from 'mixins/ExportMixin'

// config
import configs from '@/config/app.base'

export default {
  name: 'work-dashboard',

  mixins: [ExportMixin],

  components: {
    ManagerUnion,
    ProfileManagement,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    SingleSelectUser,
    MultiSelectDepartment,
    MultiSelectWorkType,
    MultiSelectPosition,
    MultiSelectHrTag,
    HrTagModal,
    UpdateOrder,
    TableData,
    Multiselect,
    ManageDependant
  },

  props: {
    scrollMode: {
      type: Boolean
    },
    blankMode: {
      type: Boolean
    },
    modalPhoneNumber: {
      type: String,
      default: 'modalPhoneNumber'
    }
  },

  data: _ => ({
    elementId: {
      sosIframe: 'iframe-sos-me-need-handle'
    },
    messageType: {
      closingShift: 'sos_closing_shift',
      requestAuth: 'hrm_authentication_request',
      reloadStatisticSosMe: 'reload_statistic_sos_me',
      reloadStatisticProfileCarDriver: 'reload_data',
      refreshIamToken: 'hrm_refresh_iam_token'
    },
    loading: {
      statistic_ekyc_image_changes: false,
      statistic_checkin: false,
      statistic_contract: false,
      statistic_hr_order: false,
      statistic_rejected: false,
      statistic_profile_documents: false,
      statistic_wallet: false,
      statistic_tax: false,
      statistic_union: false,
      statistic_sos_me: false,
      statistic_profile_car_driver: false
    },
    page: {
      curPage: 1,
      totalRow: 0,
      perPage: 10
    },
    filter: {
      workCategory: null,
      workFilter: null,
      region: null,
      province: null,
      station: null,
      employee: null,
      department: null,
      deadline: null,
      position: null,
      handler: null,
      created: null,
      order_id: null,
      identify_id: null,
      tag: null,
      date: null,
      status: null
    },
    orderData: {
      createOrderType: null,
      fileExport: null,
      exporting: false
    },
    works: StaffWork.works,
    workMapTable: StaffWork.workMapTable,
    workMapFilter: StaffWork.workMapFilter,
    workMapCategory: StaffWork.workMapCategory,
    resetEmployee: false,
    reloadTag: 0,
    userPhoneNumber: [],
    statistics: {
      lost_identity_card: null,
      ekyc_image_changes: null,
      checkin_not_approve: null,
      user_info_order: null,
      new_contract_order: null,
      continue_contract_order: null,
      need_active_wallet: null,
      insurance_order: null,
      profile_documents: null,
      sos_me: null,
      rejected: null,
      union: null,
      tax: null,
      profile_car_driver: null
    },
    totalOverdue: 0,
    recordUpdateVal: {
      type: '',
      data: null
    },
    tabScroll: {
      leftShow: false,
      rightShow: false
    },
    workHasDeadline: StaffWork.workHasDeadline,
    getWorkTrigger: false,
    curWork: null,
    tagData: {
      tags: [],
      reload: 0,
      openModalHrTag: false
    },
    overdueDash: false,
    permissionShowButton: {}
  }),

  watch: {
    curUser: function (newVal) {
      console.log(this.curUser)
    }
  },

  mounted () {
    helper.importLibraryTracingLogs()
    let el = document.getElementById('tab-work')
    if (el) this.checkScrollTab(null, el)
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
  },

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),

    helper () {
      return helper
    },
    hasDeadline () {
      return this.workHasDeadline.includes(this.workMapCategory[this.curWork])
    }
  },

  created () {
    this.checkShowProfileCarDriver()
    this.startListenIframeEvent()
    this.getWork('lost_identity_card')
    // lost_identity_card
    // this.getStatisticCheckinNeedReview()
    this.getStatisticHrOrder()
    this.getAmountContractByType()
    this.getStatisticProfileDocument()
    this.getStatisticTax()
    this.getStatisticUnion()
    this.getStatisticEkycImageChange()
    this.getStatisticSos()
    this.getStatisticProfileCarDriver()
    this.getStatisticReportLostIdentityCard()
    this.getStatisticWork({workFilter: this.workMapFilter.rejected})
  },

  methods: {
    action (action) {
      if (action.action === 'updateOverdueCount') this.totalOverdue = action.data
    },

    switchTab (key) {
      this.overdueDash = false
      this.getWork(key)
    },

    showButton (key) {
      if (key === 'profile_car_driver') {
        return this.permissionShowButton['profile_car_driver'] || false
      }

      return true
    },

    async checkShowProfileCarDriver () {
      try {
        const res = await userService.canPer({'permission': 'user.view-profile-car-driver'})
        this.permissionShowButton['profile_car_driver'] = res.data.success || false
        return
      } catch (error) {
        this.permissionShowButton['profile_car_driver'] = false
      }
      this.permissionShowButton['profile_car_driver'] = false
    },

    checkScrollTab (evt, el) {
      if (el.scrollWidth > el.offsetWidth) {
        this.tabScroll.rightShow = true
        this.tabScroll.leftShow = true
      } else {
        this.tabScroll.rightShow = false
        this.tabScroll.leftShow = false
      }
      if (el.scrollLeft < 3) {
        this.tabScroll.leftShow = false
      } else if (el.offsetWidth + el.scrollLeft + 3 >= el.scrollWidth) {
        this.tabScroll.rightShow = false
      }
    },

    scroll (el, type) {
      el = document.getElementById(el)
      if (!el) return
      el.scroll({left: el.scrollLeft + (type === 'right' ? 150 : -150)})
    },

    actionUpdateRecord (action) {
      if (action.action === 'refreshHrTag') {
        this.getTags()
        this.tagData.reload++
      }
      if (action.action === 'closeHrTag') {
        this.tagData.openModalHrTag = false
      }
    },

    search () {
      this.overdueDash = false
      this.getWork(null, 1)
    },

    detailOrder (orderIdx, orderType, orderId) {
      this.hr_order_data.create_order_type = orderType || null
      this.$bvModal.show('modal-order')
    },

    checkStatusUpdate (action) {
      if (action === 'tu_choi') {
        this.$bvModal.show('reject-reason-modal')
        return
      }

      this.updateStatus(this.hr_order_data.cur_order, action)
    },

    handleToggleModalHrTag () {
      this.tagData.openModalHrTag = true
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
        .finally(() => {
          // this.loading = false
        })
    },

    getAmountContractByType () {
      this.loading.statistic_contract = true
      hrOrderService.getAmountContractByType()
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              for (const type in res.data.data) {
                if (type === 'new') {
                  this.statistics.new_contract_order = res.data.data[type]
                }
                if (type === 'resign') {
                  this.statistics.continue_contract_order = res.data.data[type]
                }
                if (type === 'appendix') {
                  this.statistics.appendix_contract_order = res.data.data[type]
                }
              }
            }
          } else {
            helper.showMessage(res.data.message || 'Không lấy được số lượng đề xuất !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.loading.statistic_contract = false
        })
    },

    getStatisticWork (filter = null) {
      this.loading.statistic_rejected = true
      this.loading.statistic_wallet = true
      staffWorkService.getStatisticWork(filter)
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              for (let o of res.data.data.staff_order || []) {
                if (o.status !== 'tu_choi') continue
                if (['insurance'].includes(o.category)) this.statistics.rejected += o.total
                if (['new_contract', 'change_info', 'new_appendix'].includes(o.alias)) this.statistics.rejected += +o.total
              }
              for (let c of res.data.data.checkin || []) {
                if (c.status !== 'rejected') continue
                this.statistics.rejected += +c.total
              }
              for (let w of res.data.data.wallet || []) {
                if (!w.wallet_required) continue
                if (!w.wallet_active) this.statistics.need_active_wallet += +w.total
              }
            }
            this.page.totalRow = res.data.total || 0
          } else {
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu thống kê đề xuất bị từ chối !')
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê bị từ chối !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.loading.statistic_rejected = false
          this.loading.statistic_wallet = false
        })
    },

    getStatisticHrOrder () {
      this.loading.statistic_hr_order = true
      hrStatisticService.getStatisticHrOrder()
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              for (const type in res.data.data) {
                if (type === 'insurance') {
                  this.statistics.insurance_order = res.data.data[type].num_need_action || 0
                }
                if (type === 'user_info') {
                  this.statistics.user_info_order = res.data.data[type].num_need_action || 0
                }
              }
            }
          } else {
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu thống kê đề xuất !')
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.loading.statistic_hr_order = false
        })
    },

    async getStatisticUnion () {
      try {
        this.loading.statistic_union = true
        const res = await hrmTicketService.getStatisticUnion()
        if (res.data.success) {
          this.statistics.union = res.data.data.count || 0
        } else {
          helper.showMessage(res.data.message || 'Không lấy được số liệu công đoàn!')
        }
      } catch (e) {
        helper.showMessage('Không lấy được số liệu công đoàn!')
        console.log(e.message)
      } finally {
        this.loading.statistic_union = false
      }
    },

    async getStatisticTax () {
      try {
        this.loading.statistic_tax = true
        const {data} = await dependantPersonService.dependantPersonCheck({
          isCount: true
        })
        this.statistics.tax = data.data.total || 0
      } catch (e) {
        helper.showMessage('Không lấy được số liệu hồ sơ!')
        console.log(e.message)
      } finally {
        this.loading.statistic_tax = false
      }
    },

    async getStatisticProfileDocument () {
      try {
        this.loading.statistic_profile_documents = true
        const {data} = await profileManagerService.getDocuments({
          status: {
            name: 'Chưa duyệt'
          },
          isCount: true
        })
        this.statistics.profile_documents = data.data.total || 0
      } catch (e) {
        helper.showMessage('Không lấy được số liệu hồ sơ!')
        console.log(e.message)
      } finally {
        this.loading.statistic_profile_documents = false
      }
    },

    async getStatisticEkycImageChange () {
      try {
        this.loading.statistic_profile_documents = true
        const {data} = await hrOrderService.getEkycImageChanges({
          is_count: true
        })
        this.statistics.ekyc_image_changes = data.data.total || 0
      } catch (e) {
        helper.showMessage('Không lấy được số liệu chưa duyệt ảnh chụp lại!')
      } finally {
        this.loading.statistic_profile_documents = false
      }
    },

    async getStatisticReportLostIdentityCard () {
      try {
        this.loading.statistic_profile_documents = true
        const {data} = await hrOrderService.getReportLostIdentityCardOrder({
          is_count: true,
          need_action: true
        })
        this.statistics.lost_identity_card = data.data.total || 0
      } catch (e) {
        helper.showMessage('Không lấy được số liệu báo mất CMND/CCCD!')
      } finally {
        this.loading.statistic_profile_documents = false
      }
    },

    getStatisticCheckinNeedReview () {
      this.loading.statistic_checkin = true
      checkinService.getStatisticCheckinNeedReview({start_month: 1})
        .then(res => {
          if (res.data.success) {
            for (const type in (res.data.data || {})) {
              if (type === 'checkin_not_approve') this.statistics.checkin_not_approve = res.data.data[type].total
            }
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy thông tin thống kê !')
        })
        .finally(_ => {
          this.loading.statistic_checkin = false
        })
    },

    async getStatisticSos () {
      try {
        this.loading.statistic_sos_me = true
        const res = await ticketService.getCountSosTicket()
        if (res.data.success) {
          this.statistics.sos_me = res.data.data.count
        } else {
          helper.showMessage(res.data.message || 'Không lấy được thông tin ticket SOS!')
        }
      } catch (error) {
        helper.showMessage('Không lấy được thông tin ticket SOS!')
      } finally {
        this.loading.statistic_sos_me = false
      }
    },

    async getStatisticProfileCarDriver () {
      try {
        this.loading.statistic_profile_car_driver = true
        const res = await profileCarDriverService.getCountProfileCarDriver()
        if (res.data.success) {
          this.statistics.profile_car_driver = res.data.data
        } else {
          helper.showMessage(res.data.message || 'Không lấy được thông tin hồ sơ xe thuê!')
        }
      } catch (error) {
        helper.showMessage('Không lấy được thông tin hồ sơ xe thuê!')
      } finally {
        this.loading.statistic_profile_car_driver = false
      }
    },

    resetFilter () {
      for (const field in this.filter) {
        if (field === 'status') continue
        this.filter[field] = null
      }
      this.resetEmployee = !this.resetEmployee
    },

    createOrder (orderType) {
      this.orderData.createOrderType = orderType || null
      this.$bvModal.show('modal-create-order')
    },

    getWork (work = null, page) {
      if (page) this.page.curPage = page
      if (work) {
        this.curWork = work
        // get total overdue work
        this.resetFilter()
        if (this.workMapFilter[work]) this.filter.workFilter = this.workMapFilter[work]
        this.filter.workCategory = this.workMapCategory[work] || null
        this.tagData.reload++
        if (this.hasDeadline) this.getOverdueCount(this.filter)
      }

      if (this.overdueDash) {
        this.resetFilter()
        if (this.workMapFilter[this.curWork]) this.filter.workFilter = this.workMapFilter[this.curWork]
        this.filter.workCategory = this.workMapCategory[this.curWork] || null
        this.filter.deadlineOverdue = {
          end: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
      } else {
        this.filter.deadlineOverdue = null
      }
      this.getWorkTrigger = !this.getWorkTrigger
    },

    getOverDueData () {
      this.overdueDash = true
      this.getWork(null, 1)
    },

    getOverdueCount (filter) {
      let countFilter = {...filter}
      countFilter.deadline = {
        end: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
      countFilter.is_count = 1
      countFilter.censor = this.curUser.User && this.curUser.User.id
      staffWorkService.getDataWork(countFilter)
        .then(res => {
          if (res.data.success) {
            this.totalOverdue = res.data.total || 0
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin công việc !')
            console.log(res.data.message || 'Có lỗi khi lấy thông tin công việc !')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          // this.loading = false
        })
    },

    exportOrderHr (exportType = null) {
      this.orderData.exporting = true
      let filter = {...this.filter}
      delete filter.workCategory
      delete filter.workFilter
      filter.exportType = exportType
      filter.group = null
      filter.type = null
      if (this.range_time) {
        filter.start_date = this.range_time.start || null
        filter.end_date = this.range_time.end || null
      }
      hrOrderService.exportOrderHr(filter)
        .then(res => {
          if (res.data.success) {
            if (res.data.data.job_id) {
              this.checkJobExport(res.data.data.job_id)
            } else helper.showMessage('Không tạo được Job xuất dữ liệu !', 'warning')
          } else {
            this.orderData.exporting = false
            helper.showMessage(res.data.message || 'Có lỗi xảy ra không thể xuất dữ liệu !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra không thể xuất dữ liệu !', 'warning')
        })
    },

    checkJobExport (jobId) {
      if (!jobId) helper.showMessage('Không có Job id !', 'warning')
      let getJobStatus = setInterval(_ => {
        profileService.checkJobStatus({job_id: jobId})
          .then(res => {
            if (res.data.success) {
              if (res.data.data.job_status === 'closed') {
                clearInterval(getJobStatus)
                this.orderData.exporting = false
                this.orderData.fileExport = res.data.data.path || res.data.data.url
                helper.showMessage('Đã xuất xong dữ liệu đề xuất bảo hiểm', 'success')
              }
            } else {
              helper.showMessage(res.data.message, 'warning')
              clearInterval(getJobStatus)
              this.orderData.exporting = false
            }
          })
          .catch(e => {
            console.log(e)
            clearInterval(getJobStatus)
            helper.showMessage('Có lỗi xảy ra khi kiểm tra Job xuất dữ liệu !', 'warning')
          })
      }, 2000)
    },

    downloadFile () {
      if (this.orderData.fileExport) window.open(this.orderData.fileExport, '_blank')
      this.orderData.fileExport = null
    },

    handleSelectedRegion (ops) {
      this.filter.region = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },

    handleDepartmentSelected (ops) {
      this.filter.department = ops ? ops.map(item => item.id).toString() : ''
    },

    handlePositionSelected (ops) {
      this.filter.position = ops ? ops.map(item => item.id).toString() : ''
    },

    handleSelectedWorkType (ops) {
      this.filter.work_type_id = ops ? ops.map(item => item.id).toString() : ''
    },

    handleHrTagSelected (ops) {
      this.filter.tag = ops ? ops.map(item => item.id).toString() : ''
    },

    getUrlIframe (path) {
      return configs.domainHrmFe + path
    },

    getUrlIframeProfileCarDriver (path) {
      let token = helper.getToken()
      token = token.replace('Bearer', '').replace(/\s/g, '')

      return configs.domainQLTSFe + path + '?token=' + token
    },

    startListenIframeEvent () {
      window.addEventListener('message', (event) => {
        if (event.origin === configs.domainHrmFe) {
          switch (event.data.type) {
            case this.messageType.requestAuth:
              store.dispatch('sendMessageToHrm', this.elementId.sosIframe)
              break
            case this.messageType.refreshIamToken:
              window.location.reload()
              break
            case this.messageType.reloadStatisticSosMe:
              this.getStatisticSos()
              break
            default:
              break
          }
        } else if (event.origin === configs.domainQLTSFe) {
          switch (event.data.type) {
            case this.messageType.reloadStatisticProfileCarDriver:
              this.getStatisticProfileCarDriver()
              break
            default:
              break
          }
        }
        return false
      })
    }
  }
}
</script>
