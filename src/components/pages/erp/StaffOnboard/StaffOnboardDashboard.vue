<template>
  <div class="small-scrollbar fit-view-screen text-black">
    <!-- Header + Step -->
    <b-row v-if="showElement" class="header my-2 align-items-center">
      <b-col md="2">
        <h4 class="m-0">Nhận việc</h4>
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
              v-for="(val, key) in statistics"
              :key="key"
              :class="val.active ? 'btn-ghtk' : 'btn-ghtk-disable'"
              class="btn btn-pill mr-1 mb-1"
              :id="val.id"
              :name="val.name"
              @click="activeWork(val)"
            >
              {{ val.desc }}
              <span>
                <i v-if="val.total === null" class="fas fa-spinner fa-pulse"></i>
                <span v-else-if="val.total === 0 || val.total > 0">({{ val.total || 0 }})</span>
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
          <span class="text-ghtk cursor-pointer mx-2" name="on-board-btn-tag" id="on-board-btn-tag" @click="handleToggleModalHrTag(null)"><i class="fas fa-plus"></i> Tag</span>
        </div>
        </div>
      </b-col>
    </b-row>
    <!-- Filter  -->
    <div v-if="showElement" class="row filter pb-2 justify-content-between input-border">
      <div class="mb-1 input-filter">
        <SelectUser
          class="z-1000 multiselect-ghtk multiselect-no-horizontal"
          @onChange="op => {filter.employee = op ? op.id : null}"
          placeholder="Họ tên"
        ></SelectUser>
      </div>
      <div class="mb-1 input-filter">
        <multi-select-province
          :custom-class="'z-1000 multiselect-ghtk multiselect-no-horizontal'"
          :province-ids="filter.province"
          :auto-close="true"
          :hide-select="true"
          @handleProvinceSelected="handleProvinceSelected"
        ></multi-select-province>
      </div>
      <div class="mb-1 input-filter z-1000">
        <multi-select-station
          :custom-class="'z-1000 multiselect-ghtk multiselect-no-horizontal'"
          :province-ids="filter.province"
          :station-ids="filter.station"
          :auto-close="true"
          :hide-select="true"
          @handleStationSelected="handleStationSelected"
        ></multi-select-station>
      </div>
      <!-- <div class="mb-1 input-filter">
        <MultiSelectDepartment
          :custom-class="'z-1000 multiselect-ghtk multiselect-no-horizontal'"
          :department-ids="filter.department"
          :auto-close="true"
          :hide-selected="true"
          placeholder="Bộ phận"
          @handleDepartmentSelected="handleDepartmentSelected"
        />
      </div> -->
      <div class="mb-1 input-filter z-1000">
        <MultiSelectPosition
          :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
          :position-ids="filter.position"
          :auto-close="true"
          :hide-selected="true"
          placeholder="Vị trí"
          @handlePositionSelected="handlePositionSelected"
        />
      </div>
      <div class="mb-1 input-filter z-1000">
        <v-date-picker
          v-model="filter.join_date"
          locale="vi"
          color="green"
          :input-props="{ placeholder: 'Ngày vào', style: 'font-size:14px; line-height: unset', class: 'form-control rounded' }"
          :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="mb-1 input-filter z-100">
        <MultiSelectHrTag
          :reload="reloadTag"
          :tableName="curTagData.tableName"
          :custom-class="'z-1000 multiselect-ghtk multiselect-no-horizontal'"
          :auto-close="true"
          :hide-selected="true"
          placeholder="Tag"
          @handleHrTagSelected="handleHrTagSelected"
        />
      </div>
      <div class="text-right input-filter">
        <button class="btn btn-ghtk rounded w-100" @click="search(); changeAction()">
          Tìm kiếm
        </button>
      </div>
    </div>

    <!-- Table data  -->
    <div :class="scrollMode && showElement && 'table-sticky'" class="table-data">
      <table class="table table-sm mb-0">
        <thead>
          <tr class="text-center">
            <th class="w-30"><b>Thông tin nhân viên</b></th>
            <th><b>Trạng thái nhận việc</b></th>
            <th class="w-15"><b>Thao tác</b></th>
          </tr>
        </thead>
        <tbody class="position-relative" v-loading="loading.data">
          <template v-for="(profile, idx) in list_data">
            <RowData @action="action(profile, ...arguments)" :profile="profile" :key="idx" :actionSearch="actionSearch" :showAction="showElement" />
          </template>
          <tr v-show="(!list_data || !list_data.length)">
            <td colspan="10">
              <div class="mih-25 d-flex justify-content-center align-items-center">
                <b v-show="!loading.data">Không có dữ liệu phù hợp !</b>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- paging  -->
    <div v-if="showElement" class="row my-3 align-items-center">
      <div class="col col-md-9 text-left">
        <b>
          Bản ghi/ trang
        </b>
        <select
          class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
          v-model="page.statistic.per_page"
          @change="search()"
        >
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
            v-model="page.statistic.current_page"
            :total-rows="+page.statistic.total_row"
            :per-page="+page.statistic.per_page"
            @input="search(false)"
          >
          </b-pagination>
        </div>
      </div>
    </div>
    <!-- modal  -->
    <b-modal modal-class="modal-custom" size="sm" centered  static id="modal-deny-candidate-onboard" hide-footer hide-header>
      <div class="modal-title-contact">
        <span>Thông báo</span>
      </div>
      <div class="modal-content-contact">
        <div>
          <span>Bạn chắc chắn muốn từ chối ứng viên này</span>
        </div>
      </div>
      <div class="text-center mt-3 mb-2">
        <b-btn variant="secondary" class="button-deny-modal" @click="$bvModal.hide('modal-deny-candidate-onboard')">Đóng</b-btn>
        <b-btn variant="ghtk" class="button-deny-modal" @click="updateStatusCandidate('saveinfo')">Xác nhận</b-btn>
      </div>
    </b-modal>

    <b-modal :id="modalPhoneNumber" title="Gọi ứng viên" centered ref="phone-number" title-class="w-100" header-class="text-center" hide-footer size="sm">
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

    <b-modal id="modal-note" title="Ghi chú" centered ref="note" title-class="w-100" header-class="text-center" hide-footer size="sm" @hide="candidateNote = ''">
      <b-form-group label-size="lg">
        <textarea
          class="rounded form-control"
          v-model.trim="candidateNote"
          name="noteContent"
          rows="4"
          placeholder="Nhập ghi chú"
        ></textarea>
      </b-form-group>
      <div class="d-flex justify-content-between" v-loading="loading.note">
        <button class="btn btn-m-closed rounded text-white lh-0-8" @click="$bvModal.hide('modal-note')">Đóng</button>
        <button class="btn btn-ghtk rounded text-white lh-0-8" @click="handlerNoteAction">Lưu</button>
      </div>
    </b-modal>

    <b-modal static centered size="lg" id="modal-reason-reject-profile" @hide="hideModal()" title="Lý do từ chối">
      <b-textarea rows="3" v-model="reason_reject_profile"></b-textarea>
      <div class="w-100 text-center" slot="modal-footer">
        <b-btn @click="verifiedProfile('disable')">OK</b-btn>
      </div>
    </b-modal>

    <b-modal id="modal-order-onboard" static modal-class="modal-xxl" title="THÔNG TIN ĐỀ XUẤT" hide-footer>
      <update-order
        :id-order="orderContractId"
        :modal-style="true"
        :order-type="'new_contract'"
        @addOrderOk="search(); $bvModal.hide('modal-order-onboard')"
      ></update-order>
    </b-modal>

    <!--
    </b-modal>
    <b-modal static title="Nhập lý do từ chối" id="reject-reason-modal" @hide="">
      <textarea
        name="reject-reason-input"
        rows="4"
        class="form-control"
        v-model=""
      ></textarea>
      <div slot="modal-footer" class="w-100 text-center">
        <b-btn variant="ghtk" @click="">Từ chối</b-btn>
        <b-btn variant="danger" @click="$bvModal.hide('reject-reason-modal')">Hủy</b-btn>
      </div>
    </b-modal> -->
    <b-modal title="Xác thực eKYC" title-class="w-100" header-class="text-center" id="modal-confirm-ekyc" ref="modal-confirm-ekyc" size="lg" hide-footer>
      <ConfirmEkyc :user-info="curRowData" @reloadPage="reloadOnEkyc"></ConfirmEkyc>
    </b-modal>
    <b-modal title="Hồ sơ chưa duyệt" title-class="w-100" header-class="text-center" id="modal-unconfirm-profile" ref="modal-unconfirm-profile" size="lg" hide-footer>
      <b-row v-loading="loading.document"  class="position-relative mih-10re m-0">
        <DocumentUploadItem
          class="mb-3"
          :custom-class="'col-4 border'"
          v-for="(item, index) in documentList"
          :key="`upload-${index}`"
          :item="item"
          @approve="approve"
          @remove="remove"
        />
      </b-row>
      <!-- paging  -->
      <b-pagination
        class="paginator-ghtk m-0 mt-3"
        size="sm"
        align="center"
        v-model="page.document.current_page"
        :total-rows="+page.document.total"
        :per-page="+page.document.per_page"
        @input="getDocumentList"
      >
      </b-pagination>
    </b-modal>
    <HrTagModal
      :scope="'global'"
      :open="openModalHrTag"
      :attachPermission="curTagData.attach"
      :recordId="curTagData.record.id"
      :tableName="curTagData.tableName"
      @action="actionUpdateRecord"
    ></HrTagModal>
    <b-modal title="Cập nhật người xử lý" title-class="w-100" header-class="text-center" id="modal-edit-censor" hide-footer>
      <!--      <Censor :order="hr_order_data.cur_order" :order-id="hr_order_data.cur_order.id" @updateCensor="reloadOnUpdate"/>-->
      <CensorV3 :censorData="curCensorData" @action="actionUpdateRecord"/>
    </b-modal>

    <ModalViewPdf :link="file_pdf.link" :title="file_pdf.name"/>

    <infinite-loading ref="infiniteLoading" v-if="!showElement" spinner="spiral" @infinite="infiniteHandlerOnBoard">
      <div slot="no-more" class="text-center">Đã đến cuối trang!</div>
      <div slot="no-results" class="text-center">
        <span v-if="list_data">Đã đến cuối trang!</span>
        <span v-else>Không có dữ liệu nào! </span>
      </div>
    </infinite-loading>
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
  .z-1000 {
    z-index: 1000;
  }
  .lh-0-8 {
    line-height: 0.8rem;
  }
  .btn-m-closed {
    background: #BDBDBD;
  }
  .filter {
    padding: 0 0.5rem 0 0.5rem;
  }
  .input-filter {
    width: 14%;
    padding: 0 0.25rem;
  }
  .checkin-manager {
    font-weight: 500;
  }
  .input-border {
    input {
      border-radius: 4px;
    }
  }
  .table-data {
    border-bottom: 1px solid #ddd;
    width: 100%;
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
  .loading-data {
    position: absolute;
    bottom: 0;
    height: calc(100% - 3rem);
    width: 100%;
  }
</style>

<script>
// custom component
import ConfirmEkyc from 'components/pages/erp/Ekyc/ConfirmEkyc'
import DocumentUploadItem from 'components/pages/erp/ProfileManager/DocumentUploadItem'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectHrTag from 'components/elements/common/MultiSelectHrTag'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import TimeLine from '../StaffLog/TimeLine'
import HrTagModal from 'components/pages/erp/HrOrder/HrTagModal'
import RowData from './RowData.vue'
import CensorV3 from './CensorV3'
import UpdateOrder from 'components/pages/erp/HrOrder/UpdateOrder'
import SelectUser from 'components/elements/common/SingleSelectUser.vue'
import ModalViewPdf from 'components/elements/common/ModalViewPdf'

// service
import profileManagerService from 'domain/services/profile-mamanger-service'
import profileService from 'domain/services/profile-service'
import userService from 'domain/services/user-service'
import hrOrderService from 'domain/services/hr-order-service'
import staffOnboardService from 'domain/services/staff-onboard-service'
import candidateService from 'domain/services/candidate-service'

// entities
import ManageListCod from 'domain/entities/ManageListCod'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'staff-onboard-dashboard',

  components: {
    ConfirmEkyc,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectDepartment,
    MultiSelectPosition,
    TimeLine,
    HrTagModal,
    MultiSelectHrTag,
    RowData,
    DocumentUploadItem,
    CensorV3,
    UpdateOrder,
    SelectUser,
    ModalViewPdf,
    InfiniteLoading
  },
  beforeDestroy () {
    helper.removeLibraryTracingLogs()
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
    },
    teamId: {
      default: null
    },
    showElement: {
      type: Boolean,
      default: true
    },
    getOnboardTrigger: {
      default: false
    }
  },

  data: _ => ({
    reason_reject_profile: '',
    curRowData: {},
    orderContractId: null,
    candidateNote: '',
    documentList: [],
    loading: {
      statistic: false,
      data: false,
      document: false,
      note: false
    },
    page: {
      statistic: {
        current_page: 1,
        total_row: 0,
        per_page: 10
      },
      document: {
        per_page: 3,
        current_page: 1,
        total: 0
      }
    },
    filter: {
      employee: null,
      province: null,
      station: null,
      department: null,
      position: null,
      tag: null,
      join_date: null
    },
    statistics: {
      all: {
        active: true,
        alias: 'all',
        desc: 'Tất cả',
        filter: {},
        id: 'on-board-btn-all',
        name: 'on-board-btn-all'
      },
      // candidate_take_job: {
      //   active: false,
      //   total: null,
      //   filter: {}
      // },
      // create_user_pending: {
      //   active: false,
      //   total: null,
      //   filter: {
      //     status: 'pending',
      //     step: 'create_user'
      //   }
      // },
      ekyc_pending: {
        active: false,
        total: null,
        desc: 'Chưa eKYC',
        filter: {
          status: 'pending',
          step: 'ekyc'
        },
        id: 'on-board-btn-no-eKYC',
        name: 'on-board-btn-no-eKYC'
      },
      document_pending: {
        active: false,
        total: null,
        desc: 'Chưa duyệt HS',
        filter: {
          status: 'pending',
          step: 'document'
        },
        id: 'on-board-btn-profile-not-approved',
        name: 'on-board-btn-profile-not-approved'
      },
      contract_pending: {
        active: false,
        total: null,
        desc: 'Chưa ký HĐ',
        filter: {
          status: 'pending',
          step: 'contract'
        },
        id: 'on-board-btn-profile-no-contract',
        name: 'on-board-btn-profile-no-contract'
      },
      active_wallet_pending: {
        active: false,
        total: null,
        desc: 'Chưa kích hoạt ví',
        filter: {
          status: 'pending',
          step: 'active_wallet'
        },
        id: 'on-board-btn-profile-no-active-wallet',
        name: 'on-board-btn-profile-no-active-wallet'
      },
      asset_pending: {
        active: false,
        total: null,
        desc: 'Chưa cấp phát',
        filter: {
          status: 'pending',
          step: 'asset'
        },
        id: 'on-board-btn-profile-pending-asset',
        name: 'on-board-btn-profile-pending-asset'
      },
      deposit_pending: {
        active: false,
        total: null,
        desc: 'Chưa đóng cọc',
        filter: {
          status: 'pending',
          step: 'deposit'
        },
        id: 'on-board-btn-profile-pending-deposit',
        name: 'on-board-btn-profile-pending-deposit'
      },
      attach_group_pending: {
        active: false,
        total: null,
        desc: 'Chưa gán nhóm',
        filter: {
          status: 'pending',
          step: 'attach_group'
        }
      }
      // training_pending: {
      //   active: false,
      //   total: null,
      //   desc: 'Chưa đào tạo',
      //   filter: {
      //     status: 'pending',
      //     step: 'training'
      //   }
      // }
    },
    list_data: [],
    reloadTag: 0,
    userPhoneNumber: [],
    recordUpdateVal: {
      type: '',
      data: null
    },
    curCensorData: {
      censors: [],
      action: '',
      masterProfileId: null
    },
    curTagData: {
      record: {},
      attach: true,
      tableName: 'profile_onboard'
    },
    openModalHrTag: false,
    tags: [],
    file_pdf: {
      link: null,
      name: ''
    },
    actionSearch: false,
    tabScroll: {
      leftShow: false,
      rightShow: false
    },
    checkLoadData: true,
    checkLoadTotal: true
  }),

  watch: {
    getOnboardTrigger () {
      this.list_data = []
      this.page.statistic.current_page = 1
      if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.stateChanger.reset()
      let filter = {
        onboard_status: 'pending',
        teamId: this.teamId,
        current_page: this.page.statistic.current_page,
        per_page: this.page.statistic.per_page
      }
      this.getDataStatusOnboard(filter, null, true)
      // this.getStatisticStatusOnboard({teamId: this.teamId})
    }
  },

  computed: {
    moment: moment,
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  mounted () {
    helper.importLibraryTracingLogs()
    let el = document.getElementById('tab-work')
    if (el) this.checkScrollTab(null, el)
  },

  created () {
    if (this.showElement && !this.teamId) {
      this.getStatisticStatusOnboard({onboard_status: 'pending'})
      this.search()
    } else {
      this.page.statistic.current_page = 1
      this.page.statistic.per_page = 6
      let filter = {
        onboard_status: 'pending',
        teamId: this.teamId,
        current_page: this.page.statistic.current_page,
        per_page: this.page.statistic.per_page
      }
      // this.getStatisticStatusOnboard({teamId: this.teamId})
      this.getDataStatusOnboard(filter, null, true)
    }
  },

  methods: {
    infiniteHandlerOnBoard ($state) {
      this.page.statistic.current_page += 1
      let filter = {
        onboard_status: 'pending',
        teamId: this.teamId,
        current_page: this.page.statistic.current_page,
        per_page: this.page.statistic.per_page
      }
      if (this.checkLoadData) {
        this.getDataStatusOnboard(filter, $state)
      }
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

    verifiedProfile (status) {
      if (!status) return
      if (status === 'disable' && !this.reason_reject_profile) {
        alert('Bạn cần nhập lý do từ chối ứng viên này !')
        return
      }
      let params = {
        profile_id: this.curRowData.id,
        status: status,
        note: this.reason_reject_profile,
        source: 'web'
      }
      this.$startLoading()
      profileService.verifiedProfile(params)
        .then(res => {
          if (res.data.success) {
            if (this.teamId) {
              let filter = {
                onboard_status: 'pending',
                teamId: this.teamId,
                current_page: this.page.statistic.current_page,
                per_page: this.page.statistic.per_page
              }
              this.getDataStatusOnboard(filter)
            } else {
              this.search()
            }
            this.$bvModal.hide('modal-reason-reject-profile')
            helper.showMessage(res.data.message || 'Duyệt hồ sơ thành công', 'success')
          } else helper.showMessage(res.data.message || 'Không thể duyệt hồ sơ, vui lòng thử lại sau !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Không thể duyệt hồ sơ, vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    async updateStatusCandidate (candidate, newStatus) {
      let data = {
        id: candidate.id,
        newStatus: newStatus
      }
      try {
        const res = await candidateService.updateStatusCandidate(data)
        if (res.data.success) {
          helper.showMessage(res.data.message, 'success')
          await this.refreshModelTags()

          if (newStatus === 'saveinfo') this.$bvModal.hide('modal-deny-candidate-onboard')
        } else {
          helper.showMessage(res.data.message || 'Không cập nhật được trạng thái cho ứng viên !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    activeWork (step) {
      this.actionSearch = false
      if (step) step.active = !step.active
      if (step.alias === 'all') {
        for (let key in this.statistics) {
          if (key !== 'all') this.statistics[key].active = false
        }
      } else {
        this.statistics.all.active = false
      }
      let countActive = 0
      for (let key in this.statistics) {
        if (this.statistics[key].active) countActive++
      }
      if (!countActive) step.active = true
      this.search()
    },

    search (resetPage = true) {
      if (resetPage) this.page.statistic.current_page = 1
      let filter = {
        ...this.filter,
        current_page: this.page.statistic.current_page,
        per_page: this.page.statistic.per_page,
        onboard_status: 'pending',
        onboard_step: ''
      }
      if (!this.statistics.all.active) {
        for (let key in this.statistics) {
          if (this.statistics[key].active) filter.onboard_step += this.statistics[key].filter.step + ','
        }
      }
      this.getDataStatusOnboard(filter)
    },

    getStatisticStatusOnboard (filter) {
      // if (!this.checkLoadTotal) return
      this.loading.statistic = true
      this.checkLoadTotal = false
      staffOnboardService.getStatisticStatusOnboard(filter)
        .then(res => {
          if (res.data.success) {
            if (this.teamId) {
              this.$emit('getTotal', {action: 'total_on_board', total: res.data.data.total || 0})
            } else {
              for (let key in res.data.data) {
                if (this.statistics[key]) this.statistics[key].total = res.data.data[key]
              }
            }
            this.checkLoadTotal = true
          } else {
            this.checkLoadTotal = true
            helper.showMessage(res.data.message || 'Có lỗi khi lấy dữ liệu thồng kê tình trạng nhận việc của nhân viên !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy dữ liệu thồng kê tình trạng nhận việc của nhân viên !')
        })
        .finally(_ => {
          this.checkLoadTotal = true
          this.loading.statistic = false
        })
    },

    getDataStatusOnboard ($filter, $state = null, reset = false) {
      if (!this.checkLoadData) return
      if (this.teamId !== null) this.showElement = false
      this.loading.data = true
      this.checkLoadData = false
      staffOnboardService.getDataStatusOnboard($filter)
        .then(res => {
          if (res.data.success) {
            if (!helper.isEmpty($state)) {
              if (helper.isEmpty(res.data.data)) $state.complete()
              else if (!reset) {
                this.list_data.push(...res.data.data)
                $state.loaded()
              }
            }

            if (this.teamId) {
              if (reset || helper.isEmpty($state)) {
                this.list_data = res.data.data
                if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.stateChanger.reset()
                this.page.statistic.current_page = 1
              }
            } else {
              res.data.data.map(el => {
                el.fixedTags = []
                // el.fixedTags.push({
                //   name: 'Cần theo dõi',
                //   style: {'background-color': '#069255', 'color': 'white', 'margin-right': '0.25rem'}
                // })
                if (!helper.isEmpty(el.current_process_tag)) {
                  el.fixedTags.push({
                    name: el.current_process_tag,
                    style: {'background-color': '#069255', 'color': 'white'}
                  })
                }
              })
              this.list_data = res.data.data
            }
            this.page.statistic.total_row = res.data.total

            let checkOpen = false
            if (this.list_data && this.list_data.length > 0) checkOpen = true
            this.$emit('getTotal', {action: 'total_on_board', total: res.data.total || 0})
            this.$emit('action', {action: 'check_open', checkOpen: checkOpen, screen: 'on_board'})
            this.checkLoadData = true
          } else {
            this.checkLoadData = true
            if (!helper.isEmpty($state)) {
              $state.complete()
            }
            helper.showMessage(res.data.message || 'Có lỗi khi lấy dữ liệu nhận việc của nhân viên !')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy dữ liệu nhận việc của nhân viên !')
        })
        .finally(_ => {
          this.checkLoadData = true
          this.loading.data = false
        })
    },
    onPageChange (page) {
      this.page.document.current_page = page
      this.getDocumentList()
    },
    async getDocumentList () {
      try {
        this.loading.document = true
        const {data} = await profileManagerService.getDocuments({
          page: this.page.document.current_page,
          limit: this.page.document.per_page,
          mpId: this.curRowData.id
        })
        if (data.success) {
          this.documentList = data.data.list
          this.getDocumentCount()
        } else helper.showMessage(data.message)
      } catch (e) {
        helper.showMessage(e.message)
      } finally {
        this.loading.document = false
      }
    },
    async getDocumentCount () {
      try {
        this.loading.document = true
        const {data} = await profileManagerService.getDocuments({
          page: this.page.document.current_page,
          limit: this.page.document.per_page,
          mpId: this.curRowData.id,
          isCount: true
        })
        this.page.document.total = data.data.total
      } catch (e) {
        helper.showMessage(e.message)
      } finally {
        this.loading.document = false
      }
    },
    approve (doc) {
      let id = doc.doc.ProfileDocument.id
      let status = doc.status
      this.$bvModal.msgBoxConfirm('Bạn có chắc muốn duyệt hồ sơ này?', {
        title: 'Duyệt hồ sơ',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        hideHeaderClose: false,
        centered: true
      })
        .then(ok => {
          if (ok) {
            this.execApprove({id, status})
            this.getDocumentCount()
          }
        })
        .catch(_ => {})
    },
    async execApprove ({id, status}) {
      try {
        this.loading.document = true
        const {data} = await profileManagerService.approveDocument({
          info: {id, status},
          query: {
            page: this.page.document.current_page,
            limit: this.page.document.per_page,
            mpId: this.curRowData.id
          }
        })
        if (data.success) {
          helper.showMessage('Duyệt hồ sơ thành công', 'success')
          this.documentList = data.data.list
        } else helper.showMessage(data.message, 'warning')
      } catch (e) {
        helper.showMessage(e.message)
      } finally {
        this.loading.document = false
      }
    },
    remove (id) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc muốn xóa hồ sơ này?', {
        title: 'Xóa hồ sơ',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Tiếp tục',
        cancelTitle: 'Hủy',
        hideHeaderClose: false,
        centered: true
      })
        .then(ok => {
          if (ok) {
            this.execRemove(id)
            this.getDocumentCount()
          }
        })
        .catch(_ => {})
    },
    async execRemove (id) {
      try {
        this.loading.document = true
        const {data} = await profileManagerService.removeDocument({
          id,
          query: {
            page: this.page.document.current_page,
            limit: this.page.document.per_page,
            mpId: this.curRowData.id
          }
        })
        if (data.success) {
          helper.showMessage('Xóa hồ sơ thành công', 'success')
          this.documentList = data.data.list
          // this.page.document.total = data.data.total
        } else helper.showMessage(data.message, 'warning')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading.document = false
      }
    },

    async createNote () {
      try {
        this.loading.note = true
        const {data} = await profileManagerService.createNote({
          mpId: this.curRowData.id,
          note: this.candidateNote,
          groupType: 'onboard'
        })
        if (data.success) {
          this.$bvModal.hide('modal-note')
          let newNote = data.data
          this.curRowData.logs.push({
            id: newNote.id,
            message: newNote.desc,
            created: newNote.created
          })
          helper.showMessage(data.data.message || 'Thêm ghi chú thành công', 'success')
        } else helper.showMessage(data.message, 'warning')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading.note = false
      }
    },
    actionUpdateRecord (action) {
      if (action.action === 'attachTag') {
        if (this.curTagData.record.tags && action.data) {
          this.curTagData.record.tags.push(action.data)
        }
        if (this.curRowData.logs && action.log) {
          if (Array.isArray(action.log)) {
            action.log.forEach(log => {
              this.curRowData.logs.push({
                id: log.id,
                message: log.desc,
                created: log.created
              })
            })
          } else {
            this.curRowData.logs.push({
              id: action.log.id,
              message: action.log.desc,
              created: action.log.created
            })
          }
        }
      }
      if (action.action === 'refreshHrTag') {
        this.reloadTag++
      }
      if (action.action === 'closeHrTag') {
        this.openModalHrTag = false
      }
      if (action.action === 'delete_censor') {
        this.curRowData.handlers[this.curCensorData.action] = this.curRowData.handlers[this.curCensorData.action].filter(x => {
          return +x.id !== +action.data.id
        })
      }
      if (action.action === 'add_censor') {
        // this.curRowData.handlers[this.curCensorData.action].push(action.data.censor)
      }
    },

    handlerNoteAction () {
      if (helper.isEmpty(this.candidateNote)) return helper.showMessage('Nội dung ghi chú không được để trống !')
      this.createNote()
    },

    action (profile, action) {
      this.curRowData = profile
      // this.curRowData.user_id = 335663
      // this.curRowData.id = 182237
      if (action.action === 'deleteTag') {
        if (this.curRowData.tags && action.data) {
          this.curRowData.tags = this.curRowData.tags.filter(x => {
            return +x.id !== +action.data.id
          })
        }
        if (this.curRowData.logs && action.log) {
          this.curRowData.logs.push({
            id: action.log.id,
            message: action.log.desc,
            created: action.log.created
          })
        }
      }
      if (action.action === 'confirm_document') {
        this.getDocumentList()
        this.$bvModal.show('modal-unconfirm-profile')
      }
      if (action.action === 'confirm_ekyc') {
        this.$bvModal.show('modal-confirm-ekyc')
      }
      if (action.action === 'tu_choi') {
        this.checkStatusUpdate('tu_choi')
      }
      if (action.action === 'phone') {
        this.handleToggleModalPhoneNumber(profile.user_id)
      }
      if (action.action === 'view_profile') {
        ManageListCod.redirectProfile(profile.group_id, profile.user_id, profile.id)
      }
      if (action.action === 'tag') {
        this.handleToggleModalHrTag(profile)
      }
      if (action.action === 'note') {
        this.$bvModal.show('modal-note')
      }
      if (action.action === 'chat_user') {
        this.gotoGroupChat({id: action.data.user_id})
      }
      if (action.action === 'edit_handler') {
        this.$bvModal.show('modal-edit-censor')
        this.curCensorData = action.data
      }
      if (action.action === 'reject') {
        this.$bvModal.show('modal-reason-reject-profile')
      }
      if (action.action === 'confirm_contract') {
        this.orderContractId = profile.order_contract_id
        this.$bvModal.show('modal-order-onboard')
      }
      if (action.action === 'handover_staff') {
        this.handoverStaff()
      }
      if (action.action === 'view_document_list') {
        this.viewIdentify(action)
      }
      if (action.action === 'view_file_pdf') {
        this.file_pdf = action.data
        this.$bvModal.show('model-view-pdf')
      }
      if (action.action === 'showModalExplainOnboard') {
        this.$emit('action', {action: action.action, data: profile})
      }
    },
    // async handoverStaff (tag) {
    //   try {
    //     if (helper.isEmpty(this.curRowData.user_id)) return helper.showMessage('Thiếu dữ liệu id người dùng!')
    //       const data = await hrTagService.delete({
    //         id: tag.id
    //       if (data.data.success) {
    //         commonHelper.showMessage(data.data.message, 'success')
    //         this.tagList = this.tagList.filter(x => {
    //           return +x.id !== +tag.id
    //         })
    //         this.$emit('refresh')
    //         this.$emit('action', {action: 'refresh', data: {}})
    //       } else {
    //         commonHelper.showMessage(data.data.message, 'warning')
    //       }
    //     }
    //   } catch (e) {
    //     commonHelper.showMessage(e.message, 'warning')
    //   } finally {
    //     this.loading = false
    //   }
    // },
    gotoGroupChat (censor) {
      if (!censor || !censor.id) return
      if (censor.channel_id) {
        window.open('https://ghtk.me/channel/internal/' + censor.channel_id, '_blank')
      } else { // Tạo group chat nếu chưa có
        hrOrderService.createDirectChat({userId: censor.id})
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
          .finally(_ => {
            this.loading = false
          })
      }
    },
    async handoverStaff () {
      this.loading.statistic = true
      try {
        const {data} = await profileManagerService.handoverStaff({user_id: this.curRowData.user_id})
        if (data.success) {
          helper.showMessage(data.message, 'success')
          this.curRowData.can_handover = false
          this.curRowData.logs.push({
            id: data.data.id,
            message: data.data.desc,
            created: data.data.created
          })
          // this.list_data = this.list_data.filter(x => {
          //   return +x.id !== +this.curRowData.id
          // })
        } else {
          helper.showMessage(data.message, 'warning')
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading.statistic = false
      }
    },
    handleToggleModalHrTag (data = null) {
      if (helper.isEmpty(data)) {
        this.curTagData.attach = false
        this.openModalHrTag = true
        return
      }
      if (data.id) {
        this.curTagData.attach = true
        this.curTagData.record = data
        this.openModalHrTag = true
      }
    },

    handleToggleModalPhoneNumber (userId) {
      if (userId) {
        let params = {
          user_id: userId,
          get_full_tel: true
        }
        this.getUserInfo(params)
        this.$bvModal.show(this.modalPhoneNumber)
      }
    },

    async viewIdentify (action) {
      for (const identityFile of this.curRowData.documents.file_documents[action.data.doc_idx].files) {
        const {data} = await profileService.getOriginImage({urls: identityFile.links})
        let urls = []
        data.urls.forEach(item => urls.push(item.path))
        identityFile.links = urls
      }
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
        .finally(() => {
          // this.loading = false
        })
    },

    reloadOnUpdateCensor () {
      this.getDataStatusOnboard()
      this.$bvModal.hide('modal-edit-censor')
    },

    reloadOnEkyc () {
      if (this.teamId) {
        let filter = {
          current_page: this.page.statistic.current_page,
          per_page: this.page.statistic.per_page,
          onboard_status: 'pending',
          teamId: this.teamId
        }
        this.getStatisticStatusOnboard(filter)
      } else {
        this.search(false)
      }
      this.$bvModal.hide('modal-confirm-ekyc')
    },

    resetFilter () {
      for (const field in this.filter) {
        if (field === 'status') continue
        this.filter[field] = null
      }
      this.search()
    },

    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
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

    handleHrTagSelected (ops) {
      this.filter.tag = ops ? ops.map(item => item.id).toString() : ''
    },

    changeAction () {
      this.actionSearch = true
    },

    closeModalPhone () {
      this.userPhoneNumber = {}
      this.$bvModal.hide(this.modalPhoneNumber)
    },
    hideModal () {
      this.reason_reject_profile = ''
    }
  }
}
</script>
