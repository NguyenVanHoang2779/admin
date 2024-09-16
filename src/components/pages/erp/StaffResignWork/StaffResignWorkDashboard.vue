<template>
  <div class="d-none d-block fit-view-screen small-scrollbar main-stop-work">
    <!--  Tag  -->
    <b-row class="mx-0 header my-2 align-items-center">
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
          @click="searchResign(val.tab, key)"
        >
          {{ val.desc }}
          <span v-if="val.tab && val.tab !== 'all'">
            <span v-show="!loadingTotal">({{ val.total }})</span>
            <i v-show="loadingTotal" class="fas fa-spinner fa-pulse"></i>
          </span>
        </button>
        <span class="text-ghtk cursor-pointer mx-2" @click="handleToggleModalHrTag(null)"><i class="fas fa-plus"></i> Tag</span>
      </b-col>
    </b-row>

    <!--  Bộ lọc  -->
    <div class="row box-input-filter filter pb-2 justify-content-between input-border">
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
        <b-btn class="btn_search" name='stop-work-btn-search' id='stop-work-btn-search' variant="ghtk"
               @click="searchResign()">Tìm kiếm
        </b-btn>
      </div>
    </div>

    <!-- Data -->
    <div class="order-table row mx-0 table-data table-sticky">
      <div class="col col-12 table-content">
        <table class="table table-hover table-order-list w-100 table-responsive-sm">
          <thead>
          <tr class="header-row screen-off">
            <th class="text-center profile-col"><b>Nhân viên</b></th>
            <th class="text-center log-col"><b>Trạng thái</b></th>
            <th class="text-center action-col"><b>Thao tác</b></th>
          </tr>
          </thead>
          <tbody class="position-relative" v-loading="loading">
          <template v-for="(data, index) in listData">
            <RowData :data="data" :editableTag="editableTag" :key="index" :index="index" :search="filter.search" :permission="permission"
                     @changeAction="changeAction"/>
          </template>
          <tr v-show="(!listData || listData.length < 1)">
            <td colspan="10">
              <div class="d-flex justify-content-center align-items-center">
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
    <div class="row mt-3 mb-3 mr-2 align-items-center">
      <div class="col col-md-9 text-left">
        <b>
          Bản ghi/ trang
        </b>
        <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                v-model="page.per_page" @change="getDataUserResign()">
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
            @input="getDataUserResign"
          >
          </b-pagination>
        </div>
      </div>
    </div>
    <!--  Show modal  -->
    <div class="modal-order row">
          <b-modal id="modal-order-resign-work" centered static modal-class="modal-xxl align-items-center" title="THÔNG TIN ĐỀ XUẤT CHỐT SỔ BẢO HIỂM XÃ HỘI"
                   header-class="justify-content-center font-weight-bold" hide-footer @hide="resetCurData()">
            <update-order-resign-work
              :id-order="curOrder.id || null"
              :modal-style="true"
              :order-type="typeInsurance"
              @addOrderOk="addOrderOk"
              :profileId="masterId"
              :edit="permission.edit_action"
              hide-footer></update-order-resign-work>
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
                     name='resign-work-btn-confirm-reject-reason' id='resign-work-btn-confirm-reject-reason' @click="updateStatus(idxCurrentOrderUpdateStatus, 'tu_choi', rejectReason)">Xác nhận</b-btn>
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
              <button name='resign-work-btn-save-note' id='resign-work-btn-save-note' class="btn btn-ghtk rounded text-white lh-0-8" @click="updateStaffLogNote(idxCurrentOrderUpdateStatus ,rejectReason)">Lưu</button>
            </div>
          </b-modal>
          <ModalLiquidateContract
            :contractId="contract.contract_id"
            :id="'detail-liquidate-contract-resign-work'"
            :title="'Thanh lý hợp đồng ' + contract.contract_number"
            :edit="permission.edit_action"
            @updateOk="updateLiquidateOk"
          />
          <b-modal title="Cập nhật người xử lý" centered id="modal-censor-order" static
                   header-class="justify-content-center" modal-class="modal-xs align-items-center" hide-footer>
            <div class="modal-body list-user-censor" v-if="censors">
              <div v-for="(censor, key) in censors" :key="key">
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
          <b-modal id="modal-order-off-work" static modal-class="modal-xxl" title="THÔNG TIN ĐỀ XUẤT NGHỈ VIỆC" hide-footer @hide="resetCurData">
            <update-order
              :id-order="orderId || null"
              :modal-style="true"
              :order-type="typeResign"
              @addOrderOk="addOrderOk()"
            ></update-order>
          </b-modal>
        </div>

    <!--  HrTag  -->
    <HrTagModal :open="openModalHrTag" :attachPermission="curTagData.attach" :scope="'global'"
                    :recordId="curTagData.record.id" :tableName="'stop_working'" :tags="tags" @action="actionUpdateRecord"></HrTagModal>
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

    .action-col {
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
  .modal-dialog {
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
  .modal-dialog {
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

    .name-censer {
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
import UpdateOrderResignWork from 'components/pages/erp/StaffResignWork/UpdateOrderResignWork'
import UpdateOrder from 'components/pages/erp/HrOrder/UpdateOrder'
import RowData from 'components/pages/erp/StaffResignWork/RowData'
import hrOrderServiceNew from 'domain/services/hr-order-service-new'

// service
import staffResignService from 'domain/services/staff-resign-service'
import hrOrderService from 'domain/services/hr-order-service'
import hrTagService from 'domain/services/hr-tag-service'
// entities
import ManageListCod from 'domain/entities/ManageListCod'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import InfiniteLoading from 'vue-infinite-loading'
// import moment from 'moment'
import TimeLine from '../StaffLog/TimeLine'
import {mapGetters} from 'vuex'

export default {
  name: 'staff-resign-work-dashboard',

  components: {
    RowData,
    UpdateOrder,
    UpdateOrderResignWork,
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
    loadingResign: {
      ProfileInfo: false,
      orderInfo: false
    },
    loadingTotal: true,
    statusDeposit: false,
    page: {
      current: 1,
      total: 0,
      per_page: 10
    },
    filter: {
      province: null,
      station: null,
      typeResign: 'stop_working',
      resign_info: null,
      username: null,
      department_id: null,
      position_id: null,
      search: false,
      tabResign: null,
      tagName: null,
      tag: null
    },
    contract: {
      id: null,
      status: null,
      contract_number: null
    },
    listData: [],
    censors: [],
    typeInsurance: 'insurance',
    typeResign: 'stop_working',
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
    actionHandler: null,
    idHrOrder: null,
    userCensor: null,
    userCensorAccount: false,
    masterId: null,
    statistics: {
      all: {
        tab: 'all',
        tableName: 'stop_working',
        type: 'all',
        desc: 'Tất cả',
        id: 'stop-work-btn-all',
        name: 'stop-work-btn-all',
        total: this.totalAll
      },
      not_confirm_order_resign: {
        tableName: 'stop_working',
        tab: 'not_confirm_order_resign',
        type: 'stop_working',
        desc: 'Chưa duyệt đề xuất',
        id: 'stop-work-btn-pending',
        name: 'stop-work-btn-pending',
        total: 0
      },
      not_confirm_recall_asset: {
        tableName: 'stop_working',
        tab: 'not_confirm_recall_asset',
        type: 'status_CCDC',
        desc: 'Chưa thu hồi CCDC',
        total: 0,
        id: 'stop-work-btn-not-refund-ccdc',
        name: 'stop-work-btn-not-refund-ccdc'
      },
      not_confirm_payment_deposit: {
        tableName: 'stop_working',
        tab: 'not_confirm_payment_deposit',
        type: 'new_deposit',
        desc: 'Chưa thanh toán cọc',
        total: 0,
        id: 'stop-work-btn-deposit-not-paid',
        name: 'stop-work-btn-deposit-not-paid'
      },
      not_confirm_order_insurance: {
        tableName: 'stop_working',
        tab: 'not_confirm_order_insurance',
        type: 'suplly_bhxh',
        desc: 'Chưa chốt sổ BHXH',
        total: 0,
        id: 'stop-work-btn-not-complete-social-insurance',
        name: 'stop-work-btn-not-complete-social-insurance'
      },
      not_confirm_liquidation_contract: {
        tableName: 'stop_working',
        tab: 'not_confirm_liquidation_contract',
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
    totalPerPage: 6,
    checkLoadData: true,
    checkLoadTotal: true,
    permission: []
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
    }
  },

  created () {
    this.getDataUserResign()
    this.getStatisticUserResign()
    this.cur_work = 'all'
  },

  mounted () {
    helper.importLibraryTracingLogs()
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
  },

  methods: {
    // reset data
    resetCurData () {
      this.censors = []
      this.curOrder.id = null
      this.actionHandler = null
      this.curOrder.idx = null
      this.filter.search = false
      this.filter.tabResign = null
      this.orderId = null
    },

    resetUpdateStatusData () {
      this.censors = []
      this.idxCurrentOrderUpdateStatus = null
      this.rejectReason = ''
      this.actionHandler = null
      this.$bvModal.hide('reject-reason-modal')
      this.$bvModal.hide('reject-modal')
    },
    // end reset

    // get data
    getDataUserResign () {
      if (!this.checkLoadData) return
      this.checkLoadData = false
      let data = {...this.filter}
      data.perPage = this.page.per_page
      data.page = this.page.current
      this.loading = true
      staffResignService.getDataUserResign(data)
        .then(res => {
          if (res.data.success) {
            this.listData = res.data.data
            if (this.filter.search) {
              this.page.total = res.data.totalSearch
            }
            this.permission = res.data.permission
          } else {
            helper.showMessage(res.data.message || 'Không lấy được danh sách đề xuất !')
          }
          this.checkLoadData = true
          this.loading = false
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.checkLoadData = true
          this.loading = false
          this.masterId = null
        })
    },

    getStatisticUserResign () {
      if (!this.checkLoadTotal) return
      let data = {...this.filter}
      this.checkLoadTotal = false
      this.loading = true
      this.$startLoading()
      staffResignService.getStatisticUserResign(data)
        .then(res => {
          if (res.data.success) {
            this.statistics.not_confirm_order_resign.total = res.data.totalOrder || 0
            this.statistics.not_confirm_order_insurance.total = res.data.totalInsurance || 0
            this.statistics.not_confirm_liquidation_contract.total = res.data.totalContract || 0
            this.statistics.not_confirm_payment_deposit.total = res.data.totalDeposit || 0
            this.statistics.not_confirm_recall_asset.total = res.data.totalAsset || 0
            this.statistics.all.total = res.data.totalAll || 0
            this.page.total = res.data.totalAll || 0
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
    // end get data

    // filter
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

    handleHrTagSelected (ops) {
      this.filter.tag = ops ? ops.map(item => item.id).toString() : ''
    },

    selectedUser (option) {
      this.filter.username = option
    },

    selectedUserCensor (option = null) {
      this.userCensor = option
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

    searchResign (tab = null, key = null) {
      this.loading = true
      this.filter.search = false
      if (tab) {
        this.page.current = 1
        this.page.per_page = 10
        this.filter.tabResign = tab
      } else if (this.filter.province || this.filter.tag || this.filter.username || this.filter.resign_info || this.filter.station ||
        this.filter.department_id || this.filter.position_id) {
        this.filter.search = true
      }
      if (key) {
        this.cur_work = key
        this.page.total = this.statistics[key].total || 0
      }
      this.filter.typeResign = null
      if (key === 'all') {
        this.resetCurData()
      }
      this.getStatisticUserResign()
      this.getDataUserResign()
    },
    // end filter

    // show modal
    checkShowModal (idx, action) {
      if (helper.isEmpty(this.listData[idx])) return
      this.masterId = null
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
        this.curOrder.idx = this.listData[idx].profile_id || null
        this.masterId = this.listData[idx].profile_id || null
        this.curOrder.id = null
        if (!helper.isEmpty(this.listData[idx].orderInsurance)) {
          this.curOrder.id = this.listData[idx].orderInsurance.hrOrder.id
        }
        this.$bvModal.show('modal-order-resign-work')
      }
    },

    changeAction (data) {
      if (data.action === 'checkShowModal') {
        this.checkShowModal(data.index, data.status)
        return false
      }

      if (data.action === 'showListCensors') {
        this.masterId = data.masterId
        this.idHrOrder = data.orderId
        this.actionHandler = data.type
        this.censors = data.censors
        this.$bvModal.show('modal-censor-order')
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
        this.$bvModal.show('detail-liquidate-contract-resign-work')
        return false
      }
    },
    // end show modal

    // action
    // update user handler
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
            this.getDataUserResign()
            this.$bvModal.hide('modal-censor-order')
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
    updateCensor (orderId, op, type = 'add', action = null) {
      if (!orderId || !op) {
        alert('Thiếu thông tin truyền vào !')
        return
      }
      if (action && action !== 'order_resign' && action !== 'chot_so_bhxh') {
        this.updateUserHandler(op, type, action)
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
            this.getDataUserResign()
            this.$bvModal.hide('modal-censor-order')
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

    // action xem, goi, tag, chat
    actionUpdateRecord (action) {
      if (action.action === 'attachTag') {
        this.getDataUserResign()
        this.reloadTag++
        if (this.curTagData.record.tags && action.data) {
          this.curTagData.record.tags.push(action.data)
          this.recordUpdateVal.type = 'tag'
          this.recordUpdateVal.data = this.curTagData.record
        }
      }
      if (action.action === 'refreshHrTag') {
        this.getTags()
        this.getDataUserResign()
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

    // Duyệt đề xuất nghi viec
    updateStatus (idx, action, rejectReason = null) {
      if (!action || !this.listData[idx] || !this.listData[idx] || !this.listData[idx].id) return
      if (action === 'tu_choi' && !rejectReason) {
        alert('Vui lòng nhập lý do từ chối')
        return
      }
      if (action === 'duyet' || action === 'tu_choi') {
        this.approveResign(idx, action, rejectReason)
        return
      }
      let data = {
        id: this.listData[idx].id,
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
            this.getStatisticUserResign()
            this.getDataUserResign()
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

    async approveResign (idx, action, reason) {
      const event = action === 'duyet' ? 'approve' : 'reject'

      const form = new FormData()
      form.append('type', 'event')
      form.append('event', event)

      if (Object.keys(this.listData[idx].resign_info).length) {
        for (const [key, value] of Object.entries(this.listData[idx].resign_info)) {
          if (!value) continue
          form.append(`data[${key}]`, value)
        }
      }

      if (reason) {
        form.append('data[reason]', reason)
      }

      if (this.listData[idx].note) {
        form.append('data[note]', this.listData[idx].note)
      }

      if (Array.isArray(this.listData[idx].files)) {
        for (const group of this.listData[idx].files) {
          if (Array.isArray(group.file_add)) {
            group.file_add.forEach((file, idx) => {
              form.append(`files[${group.type}][${idx}]`, file)
            })
          }
        }
      }

      this.loadingResign.orderInfo = true

      const req = await hrOrderServiceNew.updateResignationProposal(this.listData[idx].id, form)
      const {success, message, data} = req.data
      if (success) {
        this.listData[idx].status = data.status
        helper.showMessage(message || 'Cập nhật trạng thái thành công !', 'success')

        // cập nhật lại người duyệt
        if (data.censor && Array.isArray(data.censor)) {
          this.censor = data.censor.map(user => user.id).toString()
        } else {
          this.censor = null
        }

        if (action === 'tu_choi') this.$bvModal.hide('reject-reason-modal-1')

        if (this.modalStyle) this.$emit('changeStatusOk', data)

        if (this.displayFrom && this.displayFrom === 'support-staff' && action === 'duyet') {
          this.$emit('confirmSuccess')
        }
      } else {
        helper.showMessage(message, 'warning')
      }

      this.rejectReason = null
      this.loadingResign.orderInfo = false
    },

    addOrderOk () {
      // this.resetFilter()
      this.getStatisticUserResign()
      this.getDataUserResign()
      this.$bvModal.hide('modal-order-resign-work')
      this.$bvModal.hide('modal-order-off-work')
    },

    updateLiquidateOk (data) {
      this.contract.status = data.contract_status
      this.contract.liquidate_date = data.liquidate_date
      // this.resetFilter()
      this.getStatisticUserResign()
      this.getDataUserResign()
    },

    resetFilter () {
      this.filter = {
        province: null,
        station: null,
        typeResign: 'stop_working',
        resign_info: null,
        username: null,
        department_id: null,
        position_id: null,
        search: false,
        tabResign: null,
        tagName: null,
        tag: null
      }
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

    updateStaffLogNote (idx, note) {
      if (!note) {
        alert('Vui lòng nhập thông tin!')
        return
      }

      if (!this.listData[idx]) {
        helper.showMessage('Không lấy được data update!')
        return
      }

      let data = {
        master_profile_id: this.listData[idx].profile_id,
        user_id: this.listData[idx].profile.user_id,
        id: this.listData[idx].id,
        note: note
      }

      this.loading = true
      this.$startLoading()
      hrOrderService.updateStaffLog(data)
        .then(res => {
          if (res.data.success) {
            let logNote = res.data.data.LogErpDbStaffLog
            this.listData[idx].logs.push(logNote)
            helper.showMessage(res.data.message || 'Thêm ghi chú thành công!', 'success')
            this.resetUpdateStatusData()
          } else {
            helper.showMessage(res.data.message || 'Thêm ghi chú Không thành công!')
          }
        })
        .finally(_ => {
          this.loading = false
          this.$stopLoading()
        })
    }
  }
}
</script>
