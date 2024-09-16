<template>
  <div class="d-none d-block fit-view-screen small-scrollbar main-stop-work">
    <!--  Tag  -->
    <b-row class="mx-0 header my-2 align-items-center">
      <b-col md="4" sm="3" class="mt-2">
        <h4 class="m-0">
          <b class="txt-title-main">Nghỉ việc (mới)</b>
        </h4>
      </b-col>

      <b-col md="8" sm="9" class="text-right header-tag">
        <div class="d-flex justify-content-end align-item-center">
          <div class="tab-work-scroll">
            <div class="pre-tab pre-tab-left" v-if="tabScroll.leftShow">
              <div class="pre-btn text-ghtk" @click="scrollTab('tab-work', 'left')">
                <i class="ion ion-ios-arrow-back"></i>
              </div>
            </div>
            <div class="work-options" v-scroll="checkScrollTab" id="tab-work" v-resize="checkScrollTab">
              <button
                v-for="(val, key) in statistics"
                :key="key"
                :class="cur_work === key ? 'btn-ghtk text-white' : 'btn-ghtk-disable'"
                class="btn btn-pill mb-1 mr-1"
                :id="val.id"
                :name="val.name"
                @click="searchHrOrder(val.tab, key)"
              >
                {{ val.desc }}
                <span v-if="val.tab">
                  <span v-show="!loadingStatics">({{ val.total }})</span>
                  <i v-show="loadingStatics" class="fas fa-spinner fa-pulse"></i>
                </span>
              </button>
            </div>
            <div class="pre-tab pre-tab-right" v-if="tabScroll.rightShow">
              <div class="pre-btn text-ghtk" @click="scrollTab('tab-work', 'right')">
                <i class="ion ion-ios-arrow-forward"></i>
              </div>
            </div>
          </div>
          <div class="ml-4 pt-2 list-tag-btn">
            <span class="text-ghtk cursor-pointer mx-2" @click="handleToggleModalHrTag(null)"><i class="fas fa-plus"></i> Tag</span>
          </div>
        </div>
      </b-col>
    </b-row>
    <!--  Bộ lọc  -->
    <div class="row box-input-filter filter pb-2 justify-content-between input-border">
      <div class="input-filter mb-2 mt-2">
        <multi-select-region
          :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
          :regions="filter.region"
          :auto-close="true"
          :placeholder="'Miền'"
          @handleSelectedRegion="handleRegionSelected"
        ></multi-select-region>
      </div>
      <div class="input-filter mb-2 mt-2">
        <multi-select-province
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :province-ids="filter.province"
          :region="filter.region"
          :auto-close="true"
          :hide-select="true"
          :placeholder="'Tỉnh'"
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
          :placeholder="'Kho'"
          @handleStationSelected="handleStationSelected"
        ></multi-select-station>
      </div>
      <div class="input-filter mb-2 mt-2">
        <multi-select-position
          :position-ids="filter.position_id"
          @handlePositionSelected="handlePositionSelected"
          :auto-close="false"
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :placeholder="'Vị trí'"
          :hide-selected="true">
        </multi-select-position>
      </div>
      <div class="input-filter mb-2 mt-2">
        <single-select-user
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          @onChange="selectedUser"
          placeholder="Nhân viên">
        </single-select-user>
      </div>
      <div class="input-filter mb-2 mt-2">
        <Multiselect
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          class="result-cus"
          :auto-close="true"
          :hide-selected="true"
          :options="listResult"
          :multiple="true"
          label="name"
          track-by="id"
          select-label=""
          v-model="filter.result_alias"
          placeholder="Kết quả"
          @select="changeData = true"
          @remove="changeData = true"
         >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </Multiselect>
      </div>
      <div class="input-filter mb-2 mt-2">
        <Multiselect
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          class="result-cus"
          :auto-close="true"
          :options="listHrOrder"
          :multiple="false"
          label="name"
          track-by="id"
          select-label=""
          v-model="filter.type_order"
          placeholder="Loại đề xuất"
          deselectLabel="X"
          selectLabel=""
          selectedLabel=""
          @select="changeData = true"
          @remove="changeData = true"
         >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </Multiselect>
      </div>
      <div class="input-filter mb-2 mt-2">
        <b-btn class="btn_search" name='stop-work-btn-search' id='stop-work-btn-search' variant="ghtk"
               @click="searchProposal()">Tìm kiếm
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
          </tr>
          </thead>
          <tbody class="position-relative" v-loading="loading">
          <template v-for="(data, index) in listData">
            <RowData :data="data"
                     :editableTag="editableTag"
                     :key="index"
                     :index="index"
                     :search="filter.search"
                     :permission="permission"
                     :list-solutions="listSolutions"
                     @changeAction="changeAction"
                     @showModalV2="showModalV2"/>
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
                v-model="page.per_page" @change="page.current = 1; getListDataPropsal()">
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
            @input="getListDataPropsal"
          >
          </b-pagination>
        </div>
      </div>
    </div>
    <!--  Show modal  -->
    <div class="modal-order row">
          <b-modal id="modal-order-resign-work" centered static modal-class="modal-xxl align-items-center" title="THÔNG TIN ĐỀ XUẤT CHỐT SỔ BẢO HIỂM XÃ HỘI"
                   header-class="justify-content-center font-weight-bold" hide-footer @hide="resetCurData()">
            <update-order-support-work
              :id-order="curOrder.id || null"
              :modal-style="true"
              :order-type="typeInsurance"
              @addOrderOk="addOrderOk"
              :profileId="masterId"
              :edit="permission.edit_action"
              hide-footer></update-order-support-work>
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

<!--       Modal ghi chú-->
          <b-modal
            id="reject-reason-modal"
            title="Ghi chú" centered
            title-class="w-100"
            header-class="text-center"
            modal-class="align-items-center modal-note-cus"
            hide-footer size="sm">
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

<!--      Người xử lý-->
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
<!--      Modal thông tin nghỉ việc-->
          <b-modal id="modal-order-off-work"
                   static modal-class="modal-xxl modal-update-order-cus"
                   title="THÔNG TIN ĐỀ XUẤT NGHỈ VIỆC"
                   hide-footer @hide="resetCurData">
            <update-order
              :id-order="orderId || null"
              :modal-style="true"
              :order-type="typeResign"
              :display-from="'support-staff'"
              @confirmSuccess="confirmSuccess()"
            ></update-order>
          </b-modal>

<!--      Modal xem chi tiết đề xuất-->
      <ModalProposalDetails
      :data-proposal-detail="dataProposalDetail"
      >
      </ModalProposalDetails>

      <!--      Modal HR xác nhận-->
      <ModalHRConfirm
        :id-hr-order="idHrOrder"
        :list-problems="listProblems"
        :list-solutions="listSolutions"
        :data-hr-confirm="hrConfirm"
        :data-proposal="dataConfirm"
        @success="getListDataPropsal"
      >
      </ModalHRConfirm>

      <!--      Modal quản lý xác nhận-->
      <ModalManagerConfirm
        :id-hr-order="idHrOrder"
        :list-problems="listProblems"
        :list-solutions="listSolutions"
        :data-manager-confirm="managerConfirm"
        :data-proposal="dataConfirm"
        @success="getListDataPropsal"
      >
      </ModalManagerConfirm>

      <!--      Modal đề xuất phương án-->
      <ModalProposedPlan
        :id-hr-order="idHrOrder"
        :list-solutions="listSolutions"
        :data-proposed-plan="dataProposedPlan"
        @success="getListDataPropsal"
      >
      </ModalProposedPlan>

      <!--      Modal review phương án-->
      <ModalReviewPlan
        :id-hr-order="idHrOrder"
        :list-solutions="listSolutions"
        :data-review-plan="dataReviewPlan"
        @success="getListDataPropsal"
      >
      </ModalReviewPlan>

      <!--      Modal kết quả-->
      <ModalProposalResult
        :id-hr-order="idHrOrder"
        :data-result-plan="dataResultPlan"
        @success="getListDataPropsal"
      >
      </ModalProposalResult>

      <!--      Modal thông báo nghỉ-->
      <ModalNoticeLeave
        :id-hr-order="idHrOrder"
        :data-form="dataForm"
        @resetData="resetDataForm"
        @changeEvent="changeEvent"
      >
      </ModalNoticeLeave>
      <ModalUpdateHandlerOfStep
        :handlers="this.censors"
        :step-id="this.stepId"
        @reset="this.getListDataPropsal"
      >
      </ModalUpdateHandlerOfStep>
        </div>

<!--    Modal gắn tag-->
    <!--  HrTag  -->
    <HrTagModal :open="openModalHrTag" :attachPermission="curTagData.attach" :scope="'global'"
                    :recordId="curTagData.record.id" :tableName="'staff_support'" :tags="tags" @action="actionUpdateRecord"></HrTagModal>
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

.header {
  &-tag .btn {
    height: 36px;
    padding: 6px 10px;
    border-radius: 0.24rem !important;
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
    width: 12%;
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
    padding: 1rem !important;

    .modal-title {
      text-align: center;
      font-weight: bold;
      color: #FFFFFF;
      font-size: 18px;
    }

    .close {
      display: none !important;
      font-size: 1.5rem !important;
    }
  }

  .modal-body {
    padding: 1.2rem !important;
    .txt-reason {
      color: #000000;
      font-size: 0.894rem;
      font-weight: bold;
    }

    textarea {
      border-radius: 10px;
    }
  }

  .btn {
    border-radius: 6px;
    height: 34px;
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

/deep/ .modal-note-cus {
  .modal-header {
    padding: 0.7rem !important;
    .close {
      font-size: 1.5rem !important;
    }
  }
}
/deep/ modal-note-cus {
  .modal-body {
    padding: 1.2rem !important;
  }

}
img {
  object-fit: cover;
}
.txt-title-main {
  color: #000000;
}
.proposal-cus  {
  /deep/ .multiselect__tags {
    height: 1.5rem !important;
    line-height: 1.5rem !important;
    padding-left: 0.8rem !important;
  }
}

/deep/ .modal-update-order-cus {
  .modal-title {
    line-height: 0.7 !important;
  }
  .close {
    display: inline-block !important;
    font-size: 1.5rem !important;
  }
}

.result-cus /deep/ .multiselect__tags {
  padding-top: 0.4rem !important;
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
import UpdateOrderSupportWork from 'components/pages/erp/StaffEngagementProposal/UpdateOrderSupportWork'
import UpdateOrder from 'components/pages/erp/HrOrder/UpdateOrder'
import RowData from 'components/pages/erp/StaffEngagementProposal/RowData'

import ModalProposalDetails from 'components/pages/erp/StaffEngagementProposal/ModalSupportWork/ModalProposalDetails'
import ModalHRConfirm from 'components/pages/erp/StaffEngagementProposal/ModalSupportWork/ModalHRConfirm'
import ModalManagerConfirm from 'components/pages/erp/StaffEngagementProposal/ModalSupportWork/ModalManagerConfirm'
import ModalProposedPlan from 'components/pages/erp/StaffEngagementProposal/ModalSupportWork/ModalProposedPlan'
import ModalReviewPlan from 'components/pages/erp/StaffEngagementProposal/ModalSupportWork/ModalReviewPlan'
import ModalProposalResult from 'components/pages/erp/StaffEngagementProposal/ModalSupportWork/ModalProposalResult'
import ModalNoticeLeave from 'components/pages/erp/StaffEngagementProposal/ModalSupportWork/ModalNoticeLeave'
import ModalUpdateHandlerOfStep from './ModalSupportWork/ModalUpdateHandlerOfStep.vue'
import Multiselect from 'vue-multiselect'
// service
import staffResignService from 'domain/services/staff-resign-service'
import hrOrderService from 'domain/services/hr-order-service'
import hrTagService from 'domain/services/hr-tag-service'
// entities
// import ManageListCod from 'domain/entities/ManageListCod'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import InfiniteLoading from 'vue-infinite-loading'
// import moment from 'moment'
import TimeLine from '../StaffLog/TimeLine'
import {mapGetters} from 'vuex'

export default {
  name: 'staff-support-work-dashboard',

  components: {
    ModalUpdateHandlerOfStep,
    RowData,
    UpdateOrder,
    UpdateOrderSupportWork,
    MultiSelectPosition,
    TimeLine,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectRegion,
    SingleSelectUser,
    ModalLiquidateContract,
    HrTagModal,
    MultiSelectHrTag,
    InfiniteLoading,
    ModalProposalDetails,
    ModalHRConfirm,
    ModalManagerConfirm,
    ModalProposedPlan,
    ModalReviewPlan,
    ModalProposalResult,
    ModalNoticeLeave,
    Multiselect
  },

  data: _ => ({
    loading: false,
    loadingStatics: false,
    statusDeposit: false,
    dataForm: {},
    page: {
      current: 1,
      total: 0,
      per_page: 10
    },
    listResult: [
      {
        id: 1,
        name: 'Tiếp tục gắn bó',
        alias: 'keep_working'
      },
      {
        id: 2,
        name: 'Nghỉ việc đúng quy trình',
        alias: 'resign_properly'
      },
      {
        id: 3,
        name: 'Nghỉ việc trước hạn',
        alias: 'resign_early'
      },
      {
        id: 4,
        name: 'Nghỉ ngang',
        alias: 'resign_unexpected'
      },
      {
        id: 5,
        name: 'Cho thôi việc/Sa thải',
        alias: 'lay_off'
      }
    ],
    filter: {
      region: null,
      province: null,
      station: null,
      position_id: null,
      user: null,
      // search: false,
      result_alias: null,
      type_order: null,
      step: null
    },
    listHrOrder: [
      {
        id: 1,
        name: 'Đề xuất hỗ trợ gắn bó',
        alias: 'pre_resign_proposal'
      },
      {
        id: 2,
        name: 'Đề xuất nghỉ việc',
        alias: 'resign'
      }
    ],
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
        total: 0
      },
      hr_confirm: {
        tab: 'hr_confirm',
        tableName: 'stop_working',
        type: 'all',
        desc: 'HR chưa xác nhận',
        id: 'hr-confirm-btn-all',
        name: 'hr-confirm-btn-all',
        total: 0
      },
      manager_confirm: {
        tab: 'manager_confirm',
        tableName: 'stop_working',
        type: 'all',
        desc: 'Quản lý chưa xác nhận',
        id: 'manager-confirm-btn-all',
        name: 'manager-confirm-btn-all',
        total: 0
      },
      no_proposal_plan: {
        tab: 'propose_solution',
        tableName: 'stop_working',
        type: 'all',
        desc: 'Chưa đề xuất phương án',
        id: 'no-proposal-plan-btn-all',
        name: 'no-proposal-plan-btn-all',
        total: 0
      },
      no_review_plan: {
        tab: 'review_solution',
        tableName: 'stop_working',
        type: 'all',
        desc: 'Chưa review phương án',
        id: 'no-review-plan-btn-all',
        name: 'no-review-plan-btn-all',
        total: 0
      },
      no_confirm_result: {
        tab: 'confirm_result',
        tableName: 'stop_working',
        type: 'all',
        desc: 'Chưa xác nhận kết quả',
        id: 'no-review-plan-btn-all',
        name: 'no-review-plan-btn-all',
        total: 0
      },
      order_resign: {
        tableName: 'stop_working',
        tab: 'order_resign',
        type: 'stop_working',
        desc: 'Chưa duyệt đề xuất nghỉ việc',
        id: 'stop-work-btn-pending',
        name: 'stop-work-btn-pending',
        total: 0
      },
      recall_asset: {
        tableName: 'stop_working',
        tab: 'recall_asset',
        type: 'status_CCDC',
        desc: 'Chưa thu hồi CCDC',
        total: 0,
        id: 'stop-work-btn-not-refund-ccdc',
        name: 'stop-work-btn-not-refund-ccdc'
      },
      payment_deposit: {
        tableName: 'stop_working',
        tab: 'payment_deposit',
        type: 'new_deposit',
        desc: 'Chưa thanh toán cọc',
        total: 0,
        id: 'stop-work-btn-deposit-not-paid',
        name: 'stop-work-btn-deposit-not-paid'
      },
      order_insurance: {
        tableName: 'stop_working',
        tab: 'order_insurance',
        type: 'suplly_bhxh',
        desc: 'Chưa chốt sổ BHXH',
        total: 0,
        id: 'stop-work-btn-not-complete-social-insurance',
        name: 'stop-work-btn-not-complete-social-insurance'
      },
      liquidate_contract: {
        tableName: 'stop_working',
        tab: 'liquidate_contract',
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
    tabScroll: {
      leftShow: false,
      rightShow: false
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
    permission: [],
    dataProposalDetail: null,
    dataConfirm: {
      type: null,
      status: null,
      problems: [],
      solutions: []
    },
    hrConfirm: null,
    managerConfirm: null,
    dataProposedPlan: {
      data: null,
      stepStatus: null
    },
    dataReviewPlan: {
      data: null,
      stepStatus: null
    },
    dataResultPlan: {
      data: null,
      stepStatus: null
    },
    stepId: null,
    listProblems: [],
    listSolutions: [],
    changeData: true
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
    this.getListProblems()
    this.getListSolutions()
    this.getListDataPropsal()
    this.getStaticHrOrder()
    this.cur_work = 'all'
  },

  mounted () {
    helper.importLibraryTracingLogs()
    window.addEventListener('resize', this.handleScrollTab)
    let el = document.getElementById('tab-work')
    if (el) this.checkScrollTab(null, el)
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
    window.removeEventListener('resize', this.handleScrollTab)
  },

  methods: {
    scrollTab (id, type) {
      let el = document.getElementById(id)
      if (!el) return
      let offset = el.scrollWidth - el.offsetWidth
      offset = (offset > 150) ? 150 : Math.abs(offset / 2)
      el.scroll({left: el.scrollLeft + (type === 'right' ? offset : -offset)})
    },

    handleScrollTab () {
      let el = document.getElementById('tab-work')
      if (el) this.checkScrollTab(null, el)
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

    // reset data
    resetCurData () {
      this.censors = []
      this.curOrder.id = null
      this.actionHandler = null
      this.curOrder.idx = null
      // this.filter.search = false
      // this.filter.tabResign = null
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

    // Lấy list vấn đề
    async getListProblems () {
      try {
        const res = await staffResignService.getListProblems({is_active: 1, ref_hr_orders: [43]})
        if (res.data.success) {
          this.listProblems = res.data.data || []
        } else {
          helper.showMessage(res.data.message || 'Không lấy được danh sách các vấn đề !')
        }
      } catch (e) {
        console.log(e)
      }
    },

    async getListSolutions () {
      try {
        const res = await staffResignService.getListSolution({is_active: 1, ref_hr_orders: [43]})
        if (res.data.success) {
          this.listSolutions = res.data.data || []
        } else {
          helper.showMessage(res.data.message || 'Không lấy được danh sách các giải pháp !')
        }
      } catch (e) {
        console.log(e)
      }
    },

    initData (type) {
      let params = {}
      if (this.filter.region && this.filter.region.length > 0) {
        params.regions = this.filter.region.split(',')
      }
      if (this.filter.province && this.filter.province.length > 0) {
        params.provinces = this.filter.province.split(',')
      }
      if (this.filter.station && this.filter.station.length > 0) {
        params.stations = this.filter.station.split(',')
      }
      if (this.filter.position_id && this.filter.position_id.length > 0) {
        params.positions = this.filter.position_id.split(',')
      }
      if (this.filter.user && this.filter.user.id) {
        params.user_id = [this.filter.user.id]
      }
      if (this.filter.result_alias && this.filter.result_alias.length > 0) {
        params.result = this.filter.result_alias.map((item) => item.alias)
      }
      if (this.filter.step && this.filter.step.length > 0 && this.filter.step !== 'all') {
        params.step = [this.filter.step]
        params.step_status = ['pending', 'processing']
        if (type === 'count') {
          params.step = ['hr_confirm', 'manager_confirm', 'propose_solution', 'review_solution',
            'confirm_result', 'order_resign', 'recall_asset', 'liquidate_contract', 'payment_deposit', 'order_insurance']
        }
      }
      if (this.filter.type_order && this.filter.type_order.alias) {
        params.order_alias = [this.filter.type_order.alias]
      } else {
        params.order_alias = ['pre_resign_proposal', 'resign']
      }
      return params
    },

    async getListDataPropsal (isTab = false) {
      if (this.loading) return
      let params = this.initData('get')
      let data = {...params}
      data.per_page = this.page.per_page
      data.page = this.page.current
      data.sort_by = 'created_at'
      data.sort = 'desc'
      data.response = 'full'
      try {
        this.loading = true
        const res = await staffResignService.getDataStaffSupport(data)
        if (res.data.success) {
          this.listData = res.data.data
          this.page.current = res.data.current_page
          this.page.total = res.data.total
          if (!isTab) {
            this.statistics.all.total = res.data.total || 0
          }
          this.permission = {
            add_note: true,
            create_tag: true,
            edit_action: true,
            view: true
          }
        } else {
          helper.showMessage(res.data.message || 'Không lấy được danh sách đề xuất !')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
        this.masterId = null
      }
    },

    getStaticHrOrder () {
      if (!this.changeData) {
        return
      }
      let data = this.initData('count')
      data.step_status = ['pending', 'processing']
      this.loadingStatics = true
      staffResignService.getStatisticHrOrderV2(data)
        .then(res => {
          if (res.data.success) {
            let dataStatics = res.data.data
            this.statistics.hr_confirm.total = dataStatics.hr_confirm || 0
            this.statistics.manager_confirm.total = dataStatics.manager_confirm || 0
            this.statistics.no_proposal_plan.total = dataStatics.propose_solution || 0
            this.statistics.no_review_plan.total = dataStatics.review_solution || 0
            this.statistics.no_confirm_result.total = dataStatics.confirm_result || 0
            this.statistics.order_resign.total = dataStatics.order_resign || 0
            this.statistics.order_insurance.total = dataStatics.order_insurance || 0
            this.statistics.liquidate_contract.total = dataStatics.liquidate_contract || 0
            this.statistics.payment_deposit.total = dataStatics.payment_deposit || 0
            this.statistics.recall_asset.total = dataStatics.recall_asset || 0
            this.changeData = false
          } else {
            helper.showMessage(res.data.message || 'Không lấy được số lượng các đề xuất !')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !')
          console.log(e)
        })
        .finally(_ => {
          this.loadingStatics = false
        })
    },

    getTags () {
      let params = {
        table_name: 'staff_support',
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
    handleRegionSelected: function (option) {
      this.filter.region = option.length ? option.map((item) => item.id).toString() : ''
      this.changeData = true
    },

    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
      this.changeData = true
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
      this.changeData = true
    },

    handlePositionSelected (ops) {
      this.filter.position_id = ops ? ops.map(item => item.id).toString() : ''
      this.changeData = true
    },

    handleResultSelected (ops) {
      this.filter.result_alias = ops ? ops.map(item => item.alias).toString() : ''
      this.changeData = true
    },

    selectedUser (option) {
      this.filter.user = option
      this.changeData = true
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

    searchHrOrder (tab = null, key = null) {
      if (tab) {
        this.page.current = 1
        this.page.per_page = 10
        this.filter.step = tab
      }
      if (key) {
        this.cur_work = key
        this.page.total = this.statistics[key].total || 0
      }
      this.filter.typeResign = null
      if (key === 'all') {
        this.resetCurData()
      }
      // this.getStaticHrOrder()
      this.getListDataPropsal(true)
    },

    searchProposal () {
      this.page.current = 1
      this.page.per_page = 10
      this.getListDataPropsal()
      this.getStaticHrOrder()
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
      // if (action === 'chot_so') {
      //   this.curOrder.idx = this.listData[idx].profile_id || null
      //   this.masterId = this.listData[idx].profile_id || null
      //   this.curOrder.id = null
      //   if (!helper.isEmpty(this.listData[idx].orderInsurance)) {
      //     this.curOrder.id = this.listData[idx].orderInsurance.hrOrder.id
      //   }
      //   this.$bvModal.show('modal-order-resign-work')
      // }
      if (action === 'thong_bao_nghi') {
        // this.idxCurrentOrderUpdateStatus = idx
        // this.rejectReason = null
        this.idHrOrder = this.listData[idx].id
        if (this.listData[idx] && this.listData[idx].resign_order) {
          this.dataForm = this.listData[idx].resign_order
        } else {
          this.dataForm = {}
        }
        this.$bvModal.show('modal-notice-leave')
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
        this.stepId = data.stepId || null
        if (this.stepId) {
          this.$bvModal.show('modal-censor-order-v2')
        } else {
          this.$bvModal.show('modal-censor-order')
        }
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

    // ModalV2
    showModalV2 (data) {
      if (this.listData[data.indexOrder] && this.listData[data.indexOrder].id) {
        this.idHrOrder = this.listData[data.indexOrder].id
      }
      // show popup xem chi tiết đề xuất
      if (data.type === 'proposal-details') {
        if (this.listData[data.indexOrder] && this.listData[data.indexOrder].problems) {
          this.dataProposalDetail = this.listData[data.indexOrder].problems
        }
        this.$bvModal.show('modal-proposal-details')
      }
      // show popup HR xác nhận và popup quản lý xác nhận
      if (data.type === 'HR-confirm' || data.type === 'manager-confirm') {
        this.dataConfirm.status = null
        this.dataConfirm.problems = []
        this.dataConfirm.solutions = []
        if (this.listData[data.indexOrder] && this.listData[data.indexOrder].problems) {
          let arr = this.listData[data.indexOrder].problems
          arr.forEach((item) => {
            if (item.problems && item.problems.length > 0) {
              this.dataConfirm.problems = [...this.dataConfirm.problems || [], ...item.problems.map(i => i.id)]
            }
            if (item.solutions && item.solutions.length > 0) {
              this.dataConfirm.solutions = [...this.dataConfirm.solutions || [], ...item.solutions.map(i => i.id)]
            }
          })
        }
        if (data.type === 'HR-confirm') {
          this.dataConfirm.type = 'HR-confirm'
          this.dataConfirm.status = this.listData[data.indexOrder].steps[0].status
          if (this.listData[data.indexOrder] && this.listData[data.indexOrder].steps[0] && this.listData[data.indexOrder].steps[0].result) {
            this.hrConfirm = this.listData[data.indexOrder].steps[0].result
          } else {
            this.hrConfirm = null
          }
          this.$bvModal.show('modal-hr-confirm')
        } else {
          this.dataConfirm.type = 'manager-confirm'
          this.dataConfirm.status = this.listData[data.indexOrder].steps[1].status
          if (this.listData[data.indexOrder] && this.listData[data.indexOrder].steps[1] && this.listData[data.indexOrder].steps[1].result) {
            this.managerConfirm = this.listData[data.indexOrder].steps[1].result
          } else {
            this.managerConfirm = null
          }
          this.$bvModal.show('modal-manager-confirm')
        }
      }
      // show popup đề xuất phương án
      if (data.type === 'proposed-plan') {
        this.dataProposedPlan.stepStatus = null
        this.dataProposedPlan.data = null
        if (this.listData[data.indexOrder] && this.listData[data.indexOrder].latest_solution) {
          this.dataProposedPlan.data = this.listData[data.indexOrder].latest_solution
        } else {
          this.dataProposedPlan.data = null
        }
        if (this.dataProposedPlan && this.listData[data.indexOrder].steps[2] && this.listData[data.indexOrder].steps[2].status) {
          this.dataProposedPlan.stepStatus = this.listData[data.indexOrder].steps[2].status
        }
        this.$bvModal.show('modal-proposed-plan')
      }
      // show popup review phương án
      if (data.type === 'review-plan') {
        this.dataReviewPlan.stepStatus = null
        this.dataReviewPlan.data = null
        if (this.listData[data.indexOrder] && this.listData[data.indexOrder].steps[3]) {
          if (this.listData[data.indexOrder].steps[3].status) {
            this.dataReviewPlan.stepStatus = this.listData[data.indexOrder].steps[3].status
          }
          if (this.listData[data.indexOrder].steps[3].result) {
            this.dataReviewPlan.data = this.listData[data.indexOrder].steps[3].result
          }
        }
        this.$bvModal.show('modal-review-plan')
      }
      // show popup kết quả
      if (data.type === 'proposal-result') {
        this.dataResultPlan.stepStatus = null
        this.dataResultPlan.data = null
        if (this.listData[data.indexOrder] && this.listData[data.indexOrder].steps[4]) {
          if (this.listData[data.indexOrder].steps[4].status) {
            this.dataResultPlan.stepStatus = this.listData[data.indexOrder].steps[4].status
          }
          if (this.listData[data.indexOrder].steps[4].result) {
            this.dataResultPlan.data = this.listData[data.indexOrder].steps[4].result
          }
        }
        this.$bvModal.show('modal-proposal-result')
      }

      // Duyệt đề xuất nghỉ việc
      if (data.type === 'browse-proposals') {
        this.orderId = this.listData[data.indexOrder].resign_order.id
        this.$bvModal.show('modal-order-off-work')
      }

      // Thanh lý hợp đồng
      if (data.type === 'liquidation') {
        this.contract = this.listData[data.indexOrder].resign_order.contract
        this.$bvModal.show('detail-liquidate-contract-resign-work')
      }

      // Chốt xở BHXH
      if (data.type === 'insurance') {
        this.curOrder.idx = this.listData[data.indexOrder].resign_order.profile_id || null
        this.masterId = this.listData[data.indexOrder].resign_order.profile_id || null
        this.curOrder.id = null
        if (!helper.isEmpty(this.listData[data.indexOrder].resign_order.orderInsurance)) {
          this.curOrder.id = this.listData[data.indexOrder].resign_order.orderInsurance.hrOrder.id
        }
        this.$bvModal.show('modal-order-resign-work')
      }
    },
    resetDataForm () {
      this.dataForm = {}
    },
    // action
    // update user handler
    updateUserHandler (op, type, action) {
      if (type === 'delete') {
        if (!confirm('Bạn có chắc chắn muốn xóa người này khỏi xử lý đề xuất!')) {
          return
        }
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
            this.getListDataPropsal()
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
      if (action && action !== 'browse-proposals' && action !== 'chot_so_bhxh') {
        this.updateUserHandler(op, type, action)
        return
      }
      if (type === 'delete') {
        if (!confirm('Bạn có chắc chắn muốn xóa người này khỏi xử lý đề xuất !')) {
          return
        }
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
            this.getListDataPropsal()
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
        this.getListDataPropsal()
        this.reloadTag++
        if (this.curTagData.record.tags && action.data) {
          this.curTagData.record.tags.push(action.data)
          this.recordUpdateVal.type = 'tag'
          this.recordUpdateVal.data = this.curTagData.record
        }
      }
      if (action.action === 'refreshHrTag') {
        this.getTags()
        this.getListDataPropsal()
        this.reloadTag++
      }
      if (action.action === 'closeHrTag') {
        this.openModalHrTag = false
      }
      if (action.action === 'view_profile_cod' && action.data) {
        let profileUrl = '/adm/profile/staff/'
        window.open(profileUrl + action.data, '_blank')
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

    // Duyệt đề xuất nghỉ việc
    updateStatus (idx, action, rejectReason = null) {
      if (!action || !this.listData[idx] || !this.listData[idx].id) return
      if (action === 'tu_choi' && !rejectReason) {
        alert('Vui lòng nhập lý do từ chối')
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
            this.getStaticHrOrder()
            this.getListDataPropsal()
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

    addOrderOk () {
      this.resetFilter()
      this.getStaticHrOrder()
      this.getListDataPropsal()
      this.$bvModal.hide('modal-order-resign-work')
    },

    confirmSuccess () {
      this.getListDataPropsal()
      this.$bvModal.hide('modal-order-off-work')
    },

    updateLiquidateOk (data) {
      this.contract.status = data.contract_status
      this.contract.liquidate_date = data.liquidate_date
      this.resetFilter()
      this.getStaticHrOrder()
      this.getListDataPropsal()
    },

    resetFilter () {
      this.filter = {
        province: null,
        station: null,
        position_id: null,
        user: null,
        // search: false,
        result_alias: null,
        type_order: null,
        step: null
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
        hr_order_id: this.listData[idx].id,
        note: note
      }

      this.loading = true
      this.$startLoading()
      hrOrderService.updateStaffLogV2(data)
        .then(res => {
          if (res.data.success) {
            let logNote = ''
            if (res.data.data && res.data.data.message) {
              logNote = res.data.data.message || ''
            }
            this.listData[idx].logs.unshift(logNote)
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
    },
    changeEvent ({type, data}) {
      if (type === 'create_notice_success') {
        this.getListDataPropsal()
        this.getStaticHrOrder()
        this.cur_work = 'all'
      }
    }
  }
}
</script>
