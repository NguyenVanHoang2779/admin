<template>
  <div class="d-none d-block fit-view-screen small-scrollbar main-stop-work">
    <!--  Tag  -->
    <b-row v-if="showElement" class="mx-0 header my-2 align-items-center">
      <b-col md="2" sm="3">
        <h4 class="m-0">
          <b class="txt-title-main">Nghỉ việc</b>
        </h4>
      </b-col>
      <b-col md="10" sm="9" class="text-right header-tag">
        <button
          v-for="(val, key) in statistics"
          :key="key"
          :class="cur_work === key ? 'btn-ghtk text-white' : 'btn-ghtk-disable'"
          class="btn btn-pill mb-1 mr-1"
          :id="val.id"
          :name="val.name"
          @click="searchOrder(val.status, key)"
        >
          {{ val.desc }}
          <span v-if="val.status && val.status !== 'allOrder'">
            <span v-show="!loadingTotal">({{ val.total }})</span>
            <i v-show="loadingTotal" class="fas fa-spinner fa-pulse"></i>
          </span>
        </button>
        <span class="text-ghtk cursor-pointer mx-2" @click="handleToggleModalHrTag(null)"><i class="fas fa-plus"></i> Tag</span>
      </b-col>
    </b-row>

    <!--  Bộ lọc  -->
    <div v-if="showElement" class="row box-input-filter filter pb-2 justify-content-between input-border">
      <div class="input-filter mb-2 mt-2">
        <multi-select-province
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :province-ids="filter.province"
          :auto-close="true"
          :hide-select="true"
          @handleProvinceSelected="handleProvinceSelected"
        ></multi-select-province>
      </div>
      <div class="input-filter mb-2 mt-2">
        <multi-select-station
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :station-ids="filter.station"
          :province-ids="filter.province"
          :auto-close="true"
          :hide-select="true"
          @handleStationSelected="handleStationSelected"
        ></multi-select-station>
      </div>
      <div class="input-filter mb-2 mt-2">
        <single-select-user
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          @onChange="selectedUser"
          placeholder="Nhân viên">
        </single-select-user>
      </div>
      <div class="input-filter mb-2 mt-2">
        <multi-select-position
          :department-ids="filter.department_id"
          :position-ids="filter.position_id"
          @handlePositionSelected="handlePositionSelected"
          :auto-close="false"
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :hide-selected="true">
        </multi-select-position>
      </div>
      <div class="input-filter mb-2 mt-2">
        <MultiSelectHrTag
          :reload="reloadTag"
          :tableName="'stop_working'"
          :disabled="!editableTag"
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :auto-close="true"
          :hide-selected="true"
          v-model="this.filter.tag"
          placeholder="Tag"
          @handleHrTagSelected="handleHrTagSelected"
        />
      </div>
      <div class="input-filter mb-2 mt-2">
        <v-date-picker
          :custom-class="'z-3 multiselect-ghtk inp-date'"
          v-model="filter.resign_info"
          locale="vi"
          color="green"
          :input-props="{ placeholder: 'Ngày', style: 'font-size:14px; border-radius: 0; border-color: #e8e8e8; padding: 8px 16px;', class: 'form-control rounded' }"
          :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="input-filter mb-2 mt-2">
        <b-btn class="btn_search" name='stop-work-btn-search' id='stop-work-btn-search' variant="ghtk" @click="searchOrder()">Tìm kiếm</b-btn>
      </div>
    </div>

    <!-- Data -->
    <div class="order-table row mx-0 table-data" :class="showElement ? 'table-sticky' : ''">
      <div class="col col-12 table-content" :class="showElement ? '' : 'p-0'">
        <table class="table table-hover table-order-list w-100 table-responsive-sm">
          <thead>
          <tr class="header-row" :class="showElement ? 'screen-off' : 'staff-shift'">
            <th class="text-center profile-col"><b>Nhân viên</b></th>
            <th class="text-center log-col"><b>Trạng thái</b></th>
            <th class="text-center action-col"><b>Thao tác</b></th>
          </tr>
          </thead>
          <tbody class="position-relative" v-loading="loading">
          <template v-for="(data, index) in orders" v-if="checkShowData(index)">
            <RowData :data="data" :checkDuty="checkDuty" :editableTag="editableTag" :key="index" :index="index"
                     :searchOrder="filter.search_order" :showAction="showElement"
                     @changeAction="changeAction" />
          </template>
          <tr v-show="(!orders || !orders.length)">
            <td colspan="10">
              <div class="mih-25 d-flex justify-content-center align-items-center">
                <b v-show="!loading">Không có dữ liệu phù hợp !</b>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--  Phân trang  -->
    <!-- paging  -->
    <div class="row mt-3 mb-3 mr-2 align-items-center" v-if="showElement">
      <div class="col col-md-9 text-left">
        <b>
          Bản ghi/ trang
        </b>
        <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block" v-model="page.per_page" @change="listOrder()">
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
            v-model="page.current"
            :total-rows="+page.total"
            :per-page="+page.per_page"
            @input="listOrder"
          >
          </b-pagination>
        </div>
      </div>
    </div>

    <!--  Show modal  -->
    <div class="modal-order row">
      <b-modal id="modal-order-stop-work" centered static modal-class="modal-xxl align-items-center" title="THÔNG TIN ĐỀ XUẤT"
               header-class="justify-content-center font-weight-bold" hide-footer @hide="resetCurOrder()">
        <update-order-stop-work
          :id-order="curOrder.id || null"
          :modal-style="true"
          :order-type="createOrderType"
          @addOrderOk="addOrderOk"
          @changeStatusOk="updateRelateOrderStatus"
          hide-footer
        ></update-order-stop-work>
      </b-modal>
      <b-modal class="d-flex align-items-center" centered static title="Nhập lý do từ chối" id="reject-modal" header-class="justify-content-center" modal-class="align-items-center" hide-footer>
        <div class="text-center justify-content-cente mb-2 txt-reason">Bạn có chắc chắn muốn từ chối nhân viên này?</div>
        <textarea
          name="reject-reason-input"
          rows="5"
          class="form-control"
          v-model="rejectReason"
          placeholder=""
        ></textarea>
        <div class="w-100 justify-content-center d-flex border-0 btn__action mt-2">
          <b-btn class="btn__close text-white mr-1" @click="$bvModal.hide('reject-modal'); resetUpdateStatusData()">Đóng</b-btn>
          <b-btn class="btn__save text-white"
                 name='stop-work-btn-confirm-reject-reason' id='stop-work-btn-confirm-reject-reason' @click="updateStatus(idxCurrentOrderUpdateStatus, 'tu_choi', rejectReason)">Xác nhận</b-btn>
        </div>
      </b-modal>
      <b-modal id="reject-reason-modal" title="Ghi chú" centered title-class="w-100" header-class="text-center" modal-class="align-items-center" hide-footer size="sm">
        <b-form-group label-size="lg">
        <textarea
          class="rounded form-control"
          v-model.trim="rejectReason"
          name="reject-reason-input"
          rows="4"
          placeholder="Nhập ghi chú"
        ></textarea>
        </b-form-group>
        <div class="d-flex justify-content-between" v-loading="loading.note">
          <button class="btn btn-m-closed rounded text-white lh-0-8" @click="$bvModal.hide('reject-reason-modal'); resetUpdateStatusData()">Đóng</button>
          <button name='stop-work-btn-save-note' id='stop-work-btn-save-note' class="btn btn-ghtk rounded text-white lh-0-8" @click="updateStaffLog(idxCurrentOrderUpdateStatus ,rejectReason)">Lưu</button>
        </div>
      </b-modal>
      <ModalLiquidateContract
        :contractId="contract.id"
        :id="'detail-liquidate-contract-stop-work'"
        :title="'Thanh lý hợp đồng ' + contract.contract_number"
        :edit="true"
        @updateOk="updateLiquidateOk"
      />
      <b-modal title="Cập nhật người xử lý" centered id="modal-censor-order" static v-loading="loading"
               header-class="justify-content-center" modal-class="modal-xs align-items-center" hide-footer>
        <div class="modal-body list-user-censor" v-if="allDataCensor">
          <div v-for="(censor, key) in allDataCensor" :key="key">
            <div class="d-flex justify-content-between align-self-center content-censor mb-2">
              <div class="info-censor align-items-center d-flex" v-if="censor">
                <div class="avt-censor mr-2" v-if="censor.avatar">
                  <img :src="censor.avatar"
                       alt="avt-user-censor" width="30" height="30">
                </div>
                <div class="name-censer mr-2 font-14">
                  {{ censor.fullname }} - {{ censor.username || '' }} - {{ censor.position_name }}
                </div>
                <div class="btn-chat mr-2">
                  <b-btn class="btn__chat border-0 btn btn-default p-0" @click="gotoGroupChat(censor)">
                    <img src="../../../../assets/images/ic-chat.png" alt="icon chat" width="24" height="24">
                  </b-btn>
                </div>
              </div>
              <div class="btn-delete-user">
                <b-btn class="btn text-danger border-danger btn-outline-default btn-sm"
                       @click="updateCensor(idHrOrder, {id: censor.id, name: censor.name, order_id: censor.order_id || null}, 'delete', actionHandler)" >Xóa</b-btn>
              </div>
            </div>
            <hr class="mt-2 mb-2">
          </div>
        </div>
        <div class="d-flex justify-content-between border-0">
          <div class="input-user-censor">
            <single-select-user
              @onChange="selectedUserCensor"
              :reset="resetUser"
              :user="userCensor"
              placeholder="Nhập người xử lý">
            </single-select-user>
          </div>
          <div class="footer-btn">
            <b-btn class="btn btn__them"
                   @click="updateCensor(idHrOrder, userCensor,'add', actionHandler)">Thêm</b-btn>
          </div>
        </div>
      </b-modal>
      <b-modal id="modal-order-off-work" static modal-class="modal-xxl" title="THÔNG TIN ĐỀ XUẤT" hide-footer @hide="resetCurOrder">
        <update-order
          :id-order="orderId || null"
          :modal-style="true"
          :order-type="orderType"
          @addOrderOk="listOrder()"
        ></update-order>
      </b-modal>
    </div>

    <!--  HrTag  -->
    <HrTagModal :open="openModalHrTag" :attachPermission="curTagData.attach" :scope="'global'"
                :recordId="curTagData.record.id" :tableName="'stop_working'" :tags="tags" @action="actionUpdateRecord">

    </HrTagModal>

    <infinite-loading ref="infiniteLoading" v-if="!showElement" spinner="spiral" @infinite="infiniteHandlerOffWork">
      <div slot="no-more" class="text-center">Đã đến cuối trang!</div>
      <div slot="no-results" class="text-center">
        <span v-if="orders">Đã đến cuối trang!</span>
        <span v-else>Không có dữ liệu nào! </span>
      </div>
    </infinite-loading>
  </div>
</template>

<style lang="scss" scoped>
  .header {
    &-tag .btn {
      height: 36px;
      padding: 6px 10px;
      border-radius: 20px;
    }
  }
  .btn-m-closed {
    background: #BDBDBD;
  }
  .lh-0-8 {
    line-height: 0.8rem;
  }
  .btn-ghtk-disable {
    color: #069255;
  }

  .box-input-filter {
    padding: 0 19px;
    display: flex;
    justify-content: space-around;
    .input-filter {
      z-index: 1000;
      width: 14%;
      padding: 0 0.25rem;
      .btn_search {
        border-radius: 6px;
        width: 100%;
      }

      .multiselect .multiselect__single, .multiselect .multiselect__tag {
        max-width: 78% !important;
      }
    }
  }

  .order-table {
    .header-row {
      border: 1px solid #E5E5E5;
      th {
        vertical-align: middle;
        border: 1px solid #E5E5E5;
        background: #FAFAFA;
        top: -1px;
        box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.4);
        height: 50px;
        font-weight: 500;
        color: #000000;
      }
      .profile-col {
        width: 30%;
      }
      .log-col {
        width: auto;
      }
      .action-col{
        width: 15%;
      }
    }

    .screen-off {
      z-index: 10;
      position: sticky;
    }

    .staff-shift {
      th {
        z-index: 1000;
        position: inherit;
      }
    }

    td {
      border: 1px solid #E5E5E5;
    }
  }

  .table-sticky {
    max-height: 750px;
  }

  .order-table::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  #reject-reason-modal, #reject-modal {
    .modal-dialog{
      width: 100% !important;
    }
    .modal-header {
      display: flex !important;
      justify-content: center !important;
      align-self: center;
      .modal-title {
        text-align: center;
        font-weight: bold;
        color: #FFFFFF;
        font-size: 18px;
      }
      .close {
        display: none !important;
      }
    }
    .modal-body {
      .txt-reason {
        color: #000000;
        font-size: 0.894rem;
        font-weight: bold;
      }
      textarea {
        border-radius: 10px;
      }
      padding-top: 0;
    }
    .btn {
      border-radius: 6px;
      height: 40px;
      padding: 5px;
      width: 100px;
      text-align: center;
      align-self: center;
    }
    .btn__close {
      background: #BDBDBD !important;
    }
    .btn__save {
      background: #069255 !important;
    }
  }

  #modal-censor-order {
    .modal-dialog{
      width: 100% !important;
    }
    .modal-header {
      display: flex;
      justify-content: center;
      .close {
        display: none;
      }
    }
    .modal-body {
      color: #000000;
      padding-top: 0;
      .name-censer{
        font-weight: 500;
      }
      .avt-censor img {
        border-radius: 50%;
      }
      .btn-delete-user {
        background: none;
        display: flex;
        .btn {
          padding: 0 6px 0 6px;
          color: #D50000;
          border-radius: 5px;
          font-size: 13px;
          align-self: center;
          width: 45px;
        }
      }
    }
    .input-user-censor {
      width: 88%;
    }
    .modal-footer > div {
      color: #000000;
      width: 100% !important;
    }
    .footer-btn {
      display: flex;
      .btn__them {
        background: #00904A;
        height: 22px;
        width: 45px;
        border-radius: 6px;
        padding: 0;
        font-size: 13px;
        align-self: end;
      }
    }
  }

  img {
    object-fit: cover;
  }

  .txt-title-main {
    color: #000000;
  }
</style>

<script>
// custom component
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import ModalLiquidateContract from 'components/pages/erp/contract/ModalLiquidateContract'
import HrTagModal from 'components/pages/erp/HrOrder/HrTagModal'
import MultiSelectHrTag from 'components/elements/common/MultiSelectHrTag'
import UpdateOrderStopWork from 'components/pages/erp/StaffStopWork/UpdateOrderStopWork'
import UpdateOrder from 'components/pages/erp/HrOrder/UpdateOrder'
import RowData from 'components/pages/erp/StaffStopWork/RowData'

// service
import hrOrderService from 'domain/services/hr-order-service'
import hrTagService from 'domain/services/hr-tag-service'
// entities
import ManageListCod from 'domain/entities/ManageListCod'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import InfiniteLoading from 'vue-infinite-loading'
// import moment from 'moment'
import TimeLine from '../StaffLog/TimeLine'
import { mapGetters } from 'vuex'

export default {
  name: 'order-dashboard-quit-job',
  props: {
    teamId: {
      default: null
    },
    showElement: {
      type: Boolean,
      default: true
    },
    getResignTrigger: {
      default: false
    }
  },

  components: {
    RowData,
    UpdateOrder,
    UpdateOrderStopWork,
    MultiSelectPosition,
    TimeLine,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectRegion,
    SingleSelectUser,
    ModalLiquidateContract,
    HrTagModal,
    MultiSelectHrTag,
    InfiniteLoading
  },

  data: _ => ({
    loading: false,
    loadingTotal: true,
    statusDeposit: false,
    page: {
      current: 0,
      total: null,
      per_page: null
    },
    filter: {
      province: null,
      station: null,
      typeStopWork: 'stop_working',
      resign_info: null,
      username: null,
      department_id: null,
      position_id: null,
      search_order: false,
      statusOrderStop: null,
      tagName: null,
      tag: null
    },
    contract: {
      id: null,
      status: null,
      contract_number: null
    },
    orders: [],
    createOrderType: 'insurance',
    curOrder: {
      idx: null,
      id: null
    },
    idxCurrentOrderUpdateStatus: null,
    rejectReason: null,
    profile: null,
    statusOrder: null,
    totalOrderStop: 0,
    totalChotSo: 0,
    totalThanhLy: 0,
    totalDeposit: 0,
    totalAll: 0,
    allDataCensor: [],
    actionHandler: null,
    idHrOrder: null,
    userCensor: null,
    userCensorAccount: false,
    masterId: null,
    statistics: {
      allOrder: {
        status: 'allOrder',
        tableName: 'stop_working',
        type: 'all',
        desc: 'Tất cả',
        id: 'stop-work-btn-all',
        name: 'stop-work-btn-all',
        total: this.totalAll
      },
      stop_working: {
        tableName: 'stop_working',
        status: 'cho_duyet',
        type: 'stop_working',
        desc: 'Chưa duyệt đề xuất',
        id: 'stop-work-btn-pending',
        name: 'stop-work-btn-pending',
        total: 0
      },
      chua_thu_hoi_ccdc: {
        tableName: 'stop_working',
        status: 'chua_thu_hoi_ccdc',
        type: 'status_CCDC',
        desc: 'Chưa thu hồi CCDC',
        total: 0,
        id: 'stop-work-btn-not-refund-ccdc',
        name: 'stop-work-btn-not-refund-ccdc'
      },
      chua_thanhtoan_coc: {
        tableName: 'stop_working',
        status: 'chua_thanhtoan_coc',
        type: 'new_deposit',
        desc: 'Chưa thanh toán cọc',
        total: 0,
        id: 'stop-work-btn-deposit-not-paid',
        name: 'stop-work-btn-deposit-not-paid'
      },
      chua_chotso_bhxh: {
        tableName: 'stop_working',
        status: 'co_ket_qua',
        type: 'suplly_bhxh',
        desc: 'Chưa chốt sổ BHXH',
        total: 0,
        id: 'stop-work-btn-not-complete-social-insurance',
        name: 'stop-work-btn-not-complete-social-insurance'
      },
      chua_thanhly_hd: {
        tableName: 'stop_working',
        status: 'chua_thanhly_hd',
        type: 'new_contract',
        desc: 'Chưa thanh lý HĐ',
        total: 0,
        id: 'stop-work-btn-contract-liquidation',
        name: 'stop-work-btn-contract-liquidation'
      }
    },
    cur_work: {},
    openModalHrTag: false,
    curTagData: {
      record: {},
      attach: true
    },
    recordUpdateVal: {
      type: '',
      data: null
    },
    reloadTag: 0,
    tags: [],
    hr_order_data: {
      cur_type: {},
      cur_order: {},
      duty: [],
      reject_reason: null,
      create_order_type: null
    },
    editableTag: true,
    resetUser: false,
    cur_tag: {
      tableName: 'all_stop_work'
    },
    checkReason: false,
    checkDuty: true,
    orderId: null,
    orderType: 'stop_working',
    totalPerPage: 6,
    checkLoadData: true,
    checkLoadTotal: true
  }),

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  watch: {
    cur_work: {
      deep: true,
      handler: function (newVal, oldval) {
        if (newVal.tableName) {
          this.getTags()
          this.reloadTag++
        }
        if (newVal.alias === 'rejected') this.editableTag = false
        else this.editableTag = true
      }
    },
    getResignTrigger () {
      this.orders = []
      this.page.current = 1
      if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.stateChanger.reset()
      // this.listTotalOrder(this.teamId
      this.listOrder(null, true)
    }
  },

  created () {
    if (this.showElement && !this.teamId) {
      this.listOrder()
      // this.getTags()
      this.listTotalOrder()
      this.cur_work = 'allOrder'
    } else {
      this.page.current = 1
      this.page.per_page = 6
      // this.listTotalOrder(this.teamId)
      this.listOrder(null, true)
    }
  },

  mounted () {
    helper.importLibraryTracingLogs()
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
  },

  methods: {
    infiniteHandlerOffWork ($state) {
      this.page.current += 1
      if (this.checkLoadData) this.listOrder($state, false)
    },
    listOrder ($state = null, reset = false) {
      if (!this.checkLoadData) return
      if (this.teamId) this.showElement = false
      this.checkLoadData = false
      let data = {...this.filter}
      data.perPage = this.page.per_page
      data.page = this.page.current
      data.teamId = this.teamId || null
      this.loading = true
      this.$startLoading()
      hrOrderService.getAllOrderOrUserStopWork(data)
        .then(res => {
          if (res.data.success) {
            if (!helper.isEmpty($state)) {
              if (helper.isEmpty(res.data.data)) {
                $state.complete()
                this.loading = false
              } else if (!reset) {
                this.orders.push(...res.data.data)
                this.loading = false
                $state.loaded()
              }
            }
            this.checkDuty = res.data.checkDuty
            this.page.total = +res.data.total
            this.totalAll = res.data.total || 0
            this.resetUser = true
            if (this.teamId) {
              if (reset || helper.isEmpty($state)) {
                this.orders = res.data.data
                if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.stateChanger.reset()
                this.page.current = 1
              }
            } else {
              this.orders = res.data.data
            }
            let checkOpen = false
            if (this.orders && this.orders.length > 0) checkOpen = true
            this.$emit('action', {action: 'check_open', checkOpen: checkOpen, screen: 'off_work'})
            this.$emit('getTotal', {action: 'total_off_work', total: res.data.total || 0})
          } else {
            if (!helper.isEmpty($state)) {
              $state.complete()
            }
            helper.showMessage(res.data.message || 'Không lấy được danh sách đề xuất !')
          }
          this.checkLoadData = true
          this.loading = false
          this.$stopLoading()
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.checkLoadData = true
          this.loading = false
          this.$stopLoading()
        })
    },

    listTotalOrder (teamId = null) {
      // if (!this.checkLoadTotal) return
      this.checkLoadTotal = false
      this.loading = true
      this.$startLoading()
      hrOrderService.getCountOrderStopWork({teamId: teamId})
        .then(res => {
          if (res.data.success) {
            if (this.teamId) {
              this.$emit('getTotal', {action: 'total_off_work', total: res.data.data.total || 0})
            } else {
              this.statistics.stop_working.total = res.data.data.totalOrderStop || 0
              this.statistics.chua_chotso_bhxh.total = res.data.data.totalChotSo || 0
              this.statistics.chua_thanhly_hd.total = res.data.data.totalThanhLy || 0
              this.statistics.chua_thanhtoan_coc.total = res.data.data.totalDeposit || 0
              this.statistics.chua_thu_hoi_ccdc.total = res.data.data.totalCCDC || 0
            }
          } else {
            helper.showMessage(res.data.message || 'Không lấy được số lượng các đề xuất !')
          }
          this.checkLoadTotal = true
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loading = false
          this.checkLoadTotal = true
          this.loadingTotal = false
          this.$stopLoading()
        })
    },

    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },

    handleDepartmentSelected (ops) {
      this.filter.department_id = ops ? ops.map(item => item.id).toString() : ''
    },

    handlePositionSelected (ops) {
      this.filter.position_id = ops ? ops.map(item => item.id).toString() : ''
    },

    selectedUser (option) {
      this.filter.username = option
    },

    selectedUserCensor (option = null) {
      this.userCensor = option
    },

    searchOrder (status = null, key = null) {
      this.loading = true
      if (status) {
        this.filter.statusOrderStop = status
      } else if (this.filter.province || this.filter.tag || this.filter.username || this.filter.resign_info || this.filter.station ||
        this.filter.department_id || this.filter.position_id) {
        this.filter.search_order = true
      }
      if (key) {
        this.cur_work = key
      }
      this.filter.typeStopWork = null
      if (key === 'allOrder') {
        this.resetCurOrder()
      }
      if (this.teamId) {
        this.page.current = 1
        this.page.per_page = this.totalPerPage
      }
      this.listOrder()
    },

    // hiện nút duyệt, từ chối, ghi chú
    allowConfirm (status) {
      return ['da_duyet', 'da_duyet_leader', 'da_duyet_supervisor', 'tu_choi', 'hoan_thanh'].includes(status)
    },

    // Duyệt đề xuất
    updateStatus (idx, action, rejectReason = null) {
      if (!action || !this.orders[idx] || !this.orders[idx].order || !this.orders[idx].order.id) return
      if (action === 'tu_choi' && !rejectReason) {
        alert('Vui lòng nhập lý do từ chối')
        return
      }
      let data = {
        id: this.orders[idx].order.id,
        action: action,
        reason: rejectReason
      }
      hrOrderService.updateStatus(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật trạng thái thành công !', 'success')
            if (action === 'tu_choi') {
              this.$bvModal.hide('reject-modal')
            }
            res.data.id = data.id
            this.updateRelateOrderStatus(res.data)
            if (this.teamId) {
              this.page.current = 1
              this.page.per_page = this.totalPerPage
            }
            this.listOrder()
            this.cur_work = 'allOrder'
          } else {
            helper.showMessage(res.data.message || 'Không thể chuyển trạng thái của đề xuất !', 'warning')
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

    resetCurOrder () {
      this.curOrder.id = null
      this.actionHandler = null
      this.curOrder.idx = null
      this.filter.search_order = false
      this.filter.statusOrderStop = null
      this.orderId = null
    },

    addOrderOk () {
      // this.filter.statusOrderStop = 'co_ket_qua'
      if (this.teamId) {
        this.page.current = 1
        this.page.per_page = this.totalPerPage
      }
      this.listOrder()
      this.listTotalOrder(this.teamId)
      this.$bvModal.hide('modal-order-stop-work')
      this.$bvModal.hide('modal-order-off-work')
    },

    updateRelateOrderStatus (resData) {
      if (!resData || !resData.id || !this.orders || !this.orders.length) return
      let newStatus = resData.update_status || resData.status
      for (let idx in this.orders) {
        if (+this.orders[idx].order.id === +resData.id && this.orders[idx].order.status !== newStatus) {
          this.orders[idx].order.status = newStatus
          // cập nhật lại người duyệt
          if (resData.censors) {
            this.orders[idx].order.censors = resData.censors
          } else {
            this.orders[idx].order.censors = null
          }
          // Cập nhật thêm log
          if (this.orders[idx].order.logs && Array.isArray(this.orders[idx].order.logs) && resData.data) {
            this.orders[idx].order.logs.unshift(resData.data)
          } else {
            this.orders[idx].order.logs = [resData.data]
          }
        }
        if (this.orders[idx].order.relate_order && this.orders[idx].order.relate_order.hrOrder && +this.orders[idx].order.relate_order.hrOrder.id === +resData.id) {
          if (this.orders[idx].order.relate_order.hrOrder.status !== newStatus) this.orders[idx].order.relate_order.hrOrder.status = newStatus
        }
      }
    },

    resetUpdateStatusData () {
      this.idxCurrentOrderUpdateStatus = null
      this.rejectReason = ''
      this.actionHandler = null
      this.$bvModal.hide('reject-reason-modal')
      this.$bvModal.hide('reject-modal')
      if (this.teamId) this.listTotalOrder(this.teamId)
    },

    // show modal
    checkShowModal (idx, action) {
      if (action === 'ghi_chu') {
        this.idxCurrentOrderUpdateStatus = idx
        this.rejectReason = null
        this.$bvModal.show('reject-reason-modal')
      }
      if (action === 'tu_choi') {
        this.idxCurrentOrderUpdateStatus = idx
        this.$bvModal.show('reject-modal')
      }
      if (action === 'chot_so') {
        this.resetCurOrder()
        this.curOrder.idx = idx
        if (this.orders[idx].order.relate_order) {
          this.curOrder.id = this.orders[idx].order.relate_order.hrOrder.id
        }
        this.$bvModal.show('modal-order-stop-work')
      }

      // if (action === 'thanhly_hd') {
      //   this.idxCurrentOrderUpdateStatus = idx
      //   if (this.orders[idx].order.contract) {
      //     this.contract.id = this.orders[idx].order.contract.id
      //   }
      //   this.$bvModal.show('detail-liquidate-contract')
      // }
    },

    updateLiquidateOk (data) {
      this.contract.status = data.contract_status
      this.contract.liquidate_date = data.liquidate_date
      if (this.teamId) {
        this.page.current = 1
        this.page.per_page = this.totalPerPage
      }
      this.listOrder()
      this.listTotalOrder(this.teamId)
    },

    showModalContract (profileId) {
      this.getProfileInfo(profileId)
    },

    // xác nhận thanh lý hợp đồng
    getProfileInfo (profileId) {
      if (!profileId) return
      let params = {
        profileId: profileId,
        category: 'contract'
      }
      this.loading = true
      hrOrderService.getProfile(params)
        .then(res => {
          if (res.data.success) {
            this.staffCodeAlert = null
            this.contract = res.data.data.contract
            this.$bvModal.show('detail-liquidate-contract-stop-work')
            this.loading = false
          } else {
            helper.showMessage(res.data.message || 'Không lấy được thông tin người lao động, vui lòng thử lại sau !', 'warning')
            this.loading = false
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          this.loading = false
        })
    },

    // show modal censor
    showListCensorOrder (orderId) {
      if (!orderId) return
      this.userCensor = null
      this.idHrOrder = orderId
      this.$startLoading()
      this.loading = true
      hrOrderService.getCensorForOrder({order_id: orderId})
        .then(res => {
          if (res.data.success) {
            this.allDataCensor = res.data.data
            this.$bvModal.show('modal-censor-order')
            this.loading = false
          } else {
            helper.showMessage(res.data.message || 'Lấy danh sách người xử lý đề xuất không thành công!')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          this.loading = false
        })
        .finally(_ => {
          this.loading = false
          this.$stopLoading()
        })
    },

    updateCensor (orderId, op, type = 'add', action = null) {
      if (action) {
        this.updateUserHandler(op, type, action)
        return
      }
      if (!orderId || !op) {
        alert('Thiếu thông tin truyền vào !')
        return
      }
      if (type === 'delete') {
        alert('Bạn có chắc chắn muốn xóa người này khỏi xử lý đề xuất !')
      }
      let data = {
        order: orderId,
        censor: op,
        type: type
      }
      this.loading = true
      this.$startLoading()
      hrOrderService.updateCensor(data)
        .then(res => {
          if (res.data.success) {
            if (this.teamId) {
              this.page.current = 1
              this.page.per_page = this.totalPerPage
            }
            this.listOrder()
            this.showListCensorOrder(orderId)
            helper.showMessage(res.data.message || 'Cập nhật thành công người xử lý đề xuất !', 'success')
          } else {
            this.loading = false
            helper.showMessage(res.data.message || 'Cập nhật Không thành công người xử lý đề xuất !')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.userCensor = null
          this.loading = false
          this.$stopLoading()
        })
    },

    showListCensorAccount (data) {
      this.allDataCensor = data.allDataCensor || null
      this.actionHandler = data.action
      this.masterId = data.master_id || null
      this.userCensorAccount = true
      this.$bvModal.show('modal-censor-order')
    },

    gotoGroupChat (censor) {
      if (!censor || !censor.id) return
      if (censor.channel_id) {
        window.open('https://i.ghtklab.com/channel/internal/' + censor.channel_id, '_blank')
      } else { // Tạo group chat nếu chưa có
        hrOrderService.createDirectChat({userId: censor.id})
          .then(res => {
            if (res.data.success) {
              let channelId = res.data.data.channel_id
              window.open('https://i.ghtklab.com/channel/internal/' + channelId, '_blank')
            } else {
              helper.showMessage(res.data.message || 'Tạo direct chat thất bại !')
            }
          })
          .catch(e => {
            helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau!')
            console.log(e)
          })
          .finally(_ => {
            this.loading = false
          })
      }
    },

    updateUserHandler (op, type, action) {
      if (type === 'delete') {
        alert('Bạn có chắc chắn muốn xóa người này khỏi xử lý đề xuất!')
      }
      let data = {
        order_id: op.order_id || null,
        censor: op,
        type: type,
        action: action,
        master_id: this.masterId
      }
      this.loading = true
      this.$startLoading()
      hrOrderService.updateUserHandler(data)
        .then(res => {
          if (res.data.success) {
            if (this.teamId) {
              this.page.current = 1
              this.page.per_page = this.totalPerPage
            }
            this.listOrder()
            this.$bvModal.hide('modal-censor-order')
            this.masterId = null
            this.userCensor = null
            helper.showMessage(res.data.message || 'Cập nhật thành công người xử lý đề xuất!', 'success')
          } else {
            this.masterId = null
            helper.showMessage(res.data.message || 'Cập nhật Không thành công người xử lý đề xuất!')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau!')
          this.actionHandler = null
        })
        .finally(_ => {
          this.loading = false
          this.userCensor = null
          this.actionHandler = null
          this.$stopLoading()
        })
    },

    handleToggleModalHrTag (data = null) {
      if (helper.isEmpty(data)) {
        this.curTagData.attach = false
        this.openModalHrTag = true
        return
      }
      if (data) {
        this.curTagData.attach = true
        this.curTagData.record = data
        this.openModalHrTag = true
        this.getTags()
      }
    },

    actionUpdateRecord (action) {
      if (this.teamId) {
        this.page.current = 1
        this.page.per_page = this.totalPerPage
      }
      if (action.action === 'attachTag') {
        this.listOrder()
        this.reloadTag++
        if (this.curTagData.record.tags && action.data) {
          this.curTagData.record.tags.push(action.data)
          this.recordUpdateVal.type = 'tag'
          this.recordUpdateVal.data = this.curTagData.record
        }
      }
      if (action.action === 'refreshHrTag') {
        this.getTags()
        this.listOrder()
        this.reloadTag++
      }
      if (action.action === 'closeHrTag') {
        this.openModalHrTag = false
      }
      if (action.action === 'view_profile_cod') {
        ManageListCod.redirectProfile(action.data.group_id, action.data.user_id, action.data.id)
      }
      if (action.action === 'view_group_chat') {
        if (action.channel_id) {
          // var domain = 'https://i.ghtklab.com'
          var domain = 'https://ghtk.me'
          window.open(domain + '/channel/internal/' + action.channel_id, '_blank')
        }
      }
      if (action.action === 'view_order') {
        this.orderId = action.order_id
        this.$bvModal.show('modal-order-off-work')
      }
    },

    getTags () {
      let params = {
        table_name: 'stop_working',
        scope: 'global'
      }
      hrTagService.getList(params)
        .then(res => {
          if (res.data.success) {
            this.tags = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu thẻ tag!', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau!', 'warning')
          console.log(e)
        })
        .finally(() => {
          // this.loading = false
        })
    },

    action (order, action) {
      if (action.action === 'tag') {
        this.handleToggleModalHrTag(order.order)
      }
    },

    handleHrTagSelected (ops) {
      this.filter.tag = ops ? ops.map(item => item.id).toString() : ''
    },

    updateStaffLog (idx, note) {
      if (!note) {
        alert('Vui lòng nhập thông tin!')
        return
      }

      let data = {
        master_profile_id: this.orders[idx].order.profile_id,
        user_id: this.orders[idx].order.profile_info.user_id,
        id: this.orders[idx].order.id,
        note: note
      }

      this.loading = true
      this.$startLoading()
      hrOrderService.updateStaffLog(data)
        .then(res => {
          if (res.data.success) {
            if (this.teamId) {
              this.page.current = 1
              this.page.per_page = this.totalPerPage
            }
            this.listOrder()
            this.resetUpdateStatusData()
            helper.showMessage(res.data.message || 'Thêm ghi chú thành công!', 'success')
          } else {
            helper.showMessage(res.data.message || 'Thêm ghi chú Không thành công!')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
        })
        .finally(_ => {
          this.loading = false
          this.$stopLoading()
        })
    },

    checkShowData (idx) {
      var data = this.orders[idx].order

      // TH ko co team Id
      if (!this.teamId) {
        if (data.check_deposit && data.statusContract && data.check_transfer && data.status === 'hoan_thanh' && !this.filter.search_order) {
          if (data.relate_order) {
            if (data.checkStatusBHXH) {
              return false
            }
          } else if (data.checkChotSo) {
            return false
          }
        }
        return true
      } else {
        // TH co team Id (man chot ca)
        if (data.checkTick && data.checkTick.tickChotSo && data.checkTick.tickContract && data.checkTick.tickOrder) {
          return false
        }
        return true
      }
    },

    changeAction (data) {
      if (data.action === 'checkShowModal') {
        this.checkShowModal(data.index, data.status)
        return false
      }

      if (data.action === 'showListCensorOrder') {
        this.showListCensorOrder(data.orderId)
        return false
      }

      if (data.action === 'action') {
        this.action(data.data, data.arguments)
        return false
      }

      if (data.action === 'showListCensorAccount') {
        this.showListCensorAccount(data.data)
        return false
      }

      if (data.action === 'handleToggleModalHrTag') {
        this.handleToggleModalHrTag(data.data)
        return false
      }

      if (data.action === 'actionUpdateRecord') {
        this.actionUpdateRecord(data.data)
        return false
      }

      if (data.action === 'updateStatus') {
        this.updateStatus(data.index, data.status, data.note)
        return false
      }

      if (data.action === 'showModalContract') {
        this.contract = data.contract
        this.$bvModal.show('detail-liquidate-contract-stop-work')
        // this.showModalContract(data.profileId)
        return false
      }

      if (data.action === 'showModalExplainResign') {
        this.$emit('action', {action: data.action, order: data.order})
      }
    }
  }
}
</script>
