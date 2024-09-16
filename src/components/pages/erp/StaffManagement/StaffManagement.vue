<template>
  <div class="d-none d-md-block main-content">
    <div v-if="isPermission">
      <div class="mx-1 mt-2 mb-2 row">
        <div class="header-padding text-center-y">
          <div class="d-flex" style="align-items: baseline">
            <h4 class="m-0 font-weight-bold" style="font-size: 22px !important;">Quản lý nhân viên</h4>
          </div>
          <div v-if="isPermissionViewTagManagement" class="tag-cus" style="align-items: baseline">
            <div class="m-0">
              <router-link class="link action-toggle--not-active" :to="'/staff-work/tags-management'">
                Quản lý Tags
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- filter  -->
      <div class="mx-0 filter pb-1 row z-3 mb-1">
        <div class="row w-100">
          <div class="col-3 mb-2">
            <multi-select-region
              :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
              :regions="filter.region"
              :auto-close="true"
              :placeholder="'Miền'"
              @handleSelectedRegion="handleRegionSelected"
            ></multi-select-region>
          </div>
          <div class="col-3 mb-2">
            <multi-select-province
              :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
              :province-ids="filter.province"
              :region="filter.region"
              :auto-close="true"
              :hide-select="true"
              :placeholder="'Tỉnh'"
              @handleProvinceSelected="handleProvinceSelected"
            ></multi-select-province>
          </div>
          <div class="col-3 mb-2">
            <multi-select-station
              class="multiselect-ghtk multiselect-no-horizontal"
              :province-ids="filter.province"
              :station-ids="filter.station"
              :auto-close="true"
              :isActive="true"
              :hide-select="true"
              :placeholder="'Kho'"
              @handleStationSelected="handleStationSelected"
            ></multi-select-station>
          </div>
          <div class="col-3 mb-2">
            <MultiSelectPosition
              class="multiselect-ghtk multiselect-no-horizontal"
              :position-ids="filter.position"
              :auto-close="true"
              :hide-selected="true"
              placeholder="Vị trí"
              :isSyllabus="true"
              @handlePositionSelected="handleStudentPositionSelected"
            />
          </div>
          <div class="col-3 mb-0 mt-0">
            <SelectProfileStatus
              class="multiselect-ghtk multiselect-no-horizontal"
              :multiple="true"
              :auto-close="true"
              :hide-select="true"
              :status="filter.mp_status"
              @change="handleMpStatusSelected"
            />
          </div>
          <div class="col-3 mb-0 mt-0">
            <MultiSelectUser
              style="margin-top: 0rem !important;"
              :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal mt-0'"
              :custom-multiselect-class="'z-3'"
              :auto-close="true"
              :multiple="true"
              :placeholder="'username'"
              :stationId="filter.station"
              @onChange="handleUsersSelected"
            >
            </MultiSelectUser>
          </div>
          <div class="col-3 mb-0 mt-0 placeholder-contain">
            <!-- lọc theo khoảng thời gian -->
            <v-date-picker
              mode="range"
              v-model="filter.joinDate"
              locale="vi"
              color="green"
              :input-props="{
                placeholder: 'Ngày vào GHTK',
                style: 'border: 1px solid #BDBDBD; font-size: 14px;'
              }"
              :popover="{visibility: 'focus'}"
            />
          </div>
          <div class="col-3 mb-0 mt-0">
            <select class="form-control custom-select" :disabled="!isHrStaff" v-model="selectedViewMode" v-on:change="onChangeViewMode()">
              <option value="leader_tree">Theo Cấp Quản Lý</option>
              <option value="hr_team">Theo Team HR</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col mb-3" id="btn-search">
        <b-btn variant="ghtk" @click="search()" :disabled="loading_data"
               class="filter-containter__btn-search btn-header-class">Tìm kiếm
        </b-btn>
      </div>

      <!-- Table data  -->
      <div :class="'table-sticky'" class="table-data cusTable ml-1" style="max-height: 88vh;" @scroll="onScrollTable"
           id="tableRookie" ref="tableRef">
        <table class="table table-sm mb-0">
          <thead>
          <tr class="text-left">
            <th class="w-30 text-black th-cus" :class="addClassScroll ? 'th-cus-scroll' : ''">Thông tin nhân viên</th>
            <th class="w-60 text-black th-cus" :class="addClassScroll ? 'th-cus-scroll' : ''">Log chi tiết</th>
            <th class="w-10 text-black th-cus" style="padding: 0rem !important; text-align: center;"
                :class="addClassScroll ? 'th-cus-scroll' : ''">Thao tác
            </th>
          </tr>
          </thead>
          <tbody class="position-relative" v-loading="loading_data">
          <template v-for="(employee) in list_data">
            <StaffDetailRow
              ref="staffDetailRow"
              :view-mode="viewMode"
              :id-loading-modal-eval="idLoadingModal"
              :infoEmployee="employee"
              :user-id="employee.id"
              :key="employee.id"
              :eval-permission-expired="evaluatedPermissionExpired"
              @onClickChat="onClickChat"
              @onOpenModal="onOpenModal"
              @onOpenModalEvaluation="onOpenModalEvaluation"
              @viewDetailStaff="viewDetailStaff"
              @changeRemoteCheckin="search"
            >
            </StaffDetailRow>
          </template>
          <tr v-show="helper.isEmpty(list_data)">
            <td colspan="10">
              <div class="mih-25 d-flex justify-content-center align-items-center">
                <b v-show="!loading_data">Không có dữ liệu phù hợp !</b>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

      </div>

      <!-- paging  -->
      <div class="row mt-2 justify-content-between" id="pagination" style="line-height: 35px;">
        <div class="col order-first">
          <b-pagination
            class="paginator-ghtk mb-0"
            align="left"
            size="sm"
            v-model="pagination.current_page"
            :total-rows="pagination.total"
            :per-page="pagination.per_page"
            first-text="<<"
            prev-text="<"
            next-text=">"
            last-text=">>"
            @input="getListEmployee"
            :disabled="!countListStaff">
          </b-pagination>
        </div>
        <div class="col text-center font-14">
          <label class="font-weight-bold">Đang hiển thị:</label>
          <span>{{ countListStaff }}/{{ pagination.total }}</span>
        </div>
        <div class="col action order-last">
          <b-btn class="float-right" :disabled="!countListStaff" variant="ghtk" v-b-modal.visit-home-form>+ Thêm thông
            tin thăm nhà
          </b-btn>
        </div>
      </div>

      <CallStaffModal
        :open="showCallModal"
        :user="selected_user"
        :options="modalOptions"
        @onCloseModal="onCloseModal"
      />

      <ModalSetRemoteCheckIn :user="currentStaff" @changeDataRemoteCheckin="changeDataRemoteCheckin"></ModalSetRemoteCheckIn>

      <AddStaffNoteModal
        :open="showNoteModal"
        :user="selected_user"
        :options="modalOptions"
        :title="'Ghi chú'"
        @onCloseModal="onCloseModal"
      />

      <ChangeStatusAccountModal
        :open="showChangeSttModal"
        :user="selected_user"
        :options="modalOptions"
        :status-change="statusChange"
        :list-account="listAccount"
        @onCloseModal="onCloseModal"
      />

      <ModalChangeLeader
        :open="showChangeLeaderModal"
        :user="selected_user"
        :options="modalOptions"
        :list-leader="listLeader"
        :authUser="authUser"
        @reduceStaffList="reduceStaffList"
        @onCloseModal="onCloseModal"
        @changeSuccess="search"
      />
      <modal-edit-evaluation
        :loading-modal="loadingModal"
        :user-id="userIdChoice"
        :evaluated-permission-expired="evaluatedPermissionExpired"
        :manager-criteria="managerCriteria"
        :group-id="userInfo.ErpUser && userInfo.ErpUser.group_id"
        :criteria="criteria" :evaluation="evaluationModal"
        :isManagement="isManagement">
      </modal-edit-evaluation>
      <b-modal
        title="Cập nhật thông tin thăm nhà"
        titleClass="w-100 text-center"
        id="visit-home-form"
        hide-footer
        static
        modal-class="modal-xxl"
        @hidden="helper.resetData(visitHome.info)"
      >
        <VisitHomeForm
          :visitInfo="visitHome.info"
          :requiredField="visitHome.required"
          select-staff
          update-button
        />
      </b-modal>
    </div>
    <div v-if="!isPermission" style="text-align: center;margin-top: 19%;font-size: 30px;font-weight: 500;">
      <img :src="imgInfo" alt="" style="width: 242px;margin-bottom: 2rem;">
      <p>{{ messageCheckRole }}</p>
    </div>
    <ModalInfoStaff :user="currentStaff" :uidComponentStaff="uidComponentStaff" @onOpenModalStaff="onOpenModalStaff"></ModalInfoStaff>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
$ghtk-color: #069255;
.tag-cus {
  font-weight: 400 !important;
  margin-right: 2rem;

  div {
    font-size: 21px;
    margin-left: 2rem !important;
    margin-bottom: 0.1rem !important;

    a {
      color: $ghtk-color !important;
    }
  }
}

.headerTable {
  display: flex;
  background-color: #f7f7f7;
  padding: 8px;
  font-family: 'Roboto';
  font-weight: 700;
  font-size: 0.9rem !important;
  position: fixed;
  width: 100%;
  height: 2.5rem;
  z-index: 1;
}

.headerTable .hStudent {
  width: 40.2%;
}

.header-setting {
  color: #00904A;
  cursor: pointer;
  display: block;
  padding-left: 20px;
  font-size: 1.2rem;
}

.btn-sm-custom {
  font-size: 0.894rem;
  padding: 0 8px;
  line-height: 1.5;
}

.text-center-y {
  display: flex !important;
  align-items: center;
  line-height: normal;
}

.header-padding {
  padding-left: 0.25rem;
}

.btn-font-defualt {
  font-size: 0.894rem;
}

.icon-gear {
  margin-left: 0.3rem;
  width: 1.3rem;
  filter: invert(36%) sepia(66%) saturate(7499%) hue-rotate(148deg) brightness(98%) contrast(102%);
}

.syllabus-name-wrap {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: 2px;

  .syllabus-name {
    display: inline-block;
    max-width: 85%;
  }

  .syllabus-name-action {
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 8px;
  }
}

@media only screen and (max-width: 1400px) {
  .syllabus-name-wrap {
    .syllabus-name {
      max-width: 80%;
    }
  }
}

.header-action-center {
  width: 71.429%;
}

.header-action-right {
  button {
    border-radius: 5px;
    width: 100%;
  }
}

.log-timeline .log-timeline-item:last-child .log-timeline-item-tail {
  height: calc(100% - 30px);
}

.main-content {
  color: #000000 !important;
}

.student-have-not-class {
  margin: -0.15rem 0.5rem 0.75rem;

  div {
    padding: 0 10px;
  }
}

.btn-radius {
  border-radius: 20px;
}

.w-80 {
  width: 80%;
}

.class-global {
  border: solid 1px #f1f1f2;

  .class-info-wrap {
    padding-left: 10px;
  }
}

.class-title {
  font-size: 14px;
  background: #dadada;
  padding: 10px;
  width: 100%;
  font-weight: 600;
  color: #000000;
}

::placeholder {
  color: #828282;
}

.class-info-wrap {
  width: 90%;
  border-right: 1px solid #dfe1e3;
}

.class-info {
  /*height: 200px;*/
  width: 40%;
  border-right: 1px solid #dfe1e3;
}

.class-document {
  //height: 120px;
  width: 80%;
  padding: 10px 0 10px 0;
  position: relative;
}

.content-log-class {
  /*width: 40%;*/
}

.class-action {
  font-size: 0.9rem;
  width: 15%;
  text-align: center;
  padding-top: 10px;
}

.class-log-document {
  padding: 10px;
  border-left: solid 1px #f1f1f2;
}

.filter-select-container {
  flex: 1;
}

.filter-containter__btn-search {
  border-radius: 5px;
  width: 100%;
}

.btn-header-class {
  font-size: 18px;
  line-height: initial;
}

.search-button-container {
  padding-right: 12px;
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
  width: 110px;
  text-align: center;

  button {
    padding: 5px 30px;
  }
}

.check-style {
  color: white;
  background: #BDBDBD;
  border-radius: 10px;
}

.active {
  background: #069255;
}

.inactive {
  background: red;
}

.view-pdf {
  position: unset !important;
}

.document-type-desc {
  text-align: center;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
  padding: 3px;
}

.image-document {
  width: 100%;
  height: 120px;
  display: inline-block;
  vertical-align: middle;
  object-fit: cover;
}

.default-tag {
  background: rgb(6, 146, 85);
  padding: 3px 5px;
  color: white;
  height: 25px;
  display: inline-block;
  margin: 2px 0px;
}

.create-tag {
  /*padding: 3px 5px;*/
  height: 25px;
  display: inline-block;
  margin: 2px 0px;
  line-height: 25px;

}

.deleteTag {
  position: absolute;
  top: -5px;
  right: -5px;
  color: black;
  display: none;
}

.tag {
  display: inline-block;
  padding: 0 0.25rem;
}

table tbody:nth-of-type(1) tr:nth-of-type(1) td {
  border-top: none !important;
}

.th-cus {
  border: 1px solid #E0E0E0;
  height: 3rem;
  vertical-align: middle;
  background-color: #f7f7f7;
  padding: 0.8rem;
  font-weight: 700;
  top: -1px !important;
}

.th-cus-scroll {
  box-shadow: inset 0 1px 0 #d9d9d9, inset 0 -1px 0 #d9d9d9;
}

.detail-logs {
  ul.log-timeline {
    li:last-child {
      margin-bottom: -18px;
    }
  }

  .log-timeline {
    box-sizing: border-box;
    color: #000;
    font-variant: tabular-nums;
    line-height: 1rem;
    -webkit-font-feature-settings: "tnum", "tnum";
    font-feature-settings: "tnum", "tnum";
    padding: 0;
    list-style: none;
  }

  .log-timeline-item {
    position: relative;
    margin: 0;
    padding: 0 4px 0;
    list-style: none;
  }

  .log-timeline-item-tail {
    position: absolute;
    top: 8px;
    left: 6px !important;
    height: calc(100% - 4px);
    border-left: 1px solid #BDBDBD;
  }

  .log-timeline-item-head-blue {
    color: #14a05b;
    border-color: #14a05b !important;
  }

  .log-timeline-item-head {
    width: 6px;
    height: 6px;
    background-color: #000000;
    border: 2px solid transparent;
    border-radius: 89%;
  }

  .log-timeline-item-content {
    position: relative;
    top: -12px;
    margin: 0 0 0 14px;
    word-break: break-word;

    span.btn {
      border-radius: 20px;
      border: 1px solid #00904A;
    }
  }

  .time-log {
    color: #828282;
    font-size: 14px;
  }

  .content-detail-log {
    overflow-y: auto;
    padding-top: 10px;
    min-height: 3rem;
    max-height: 9rem;
  }

  .content-detail-log::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}

.note-class {
  padding: 6px 0;

  input.no-outline {
    width: 400px;
  }
}

.filter-select-container__input {
  border-radius: 0.25rem;
}

.class-info__item {
  padding: 5px 15px 0 0;
}

.profile-document__element {
  width: 23%;
  position: relative;
  height: 99%;
  display: inline-block;
  cursor: pointer;
  margin-left: 5px;
}

.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  padding-top: 9px;
  padding-bottom: 10px;
  /*border-right: solid 1px #dfe1e3;*/
}

.btn-filter-tag {
  margin: 0 2px;
}

.num-img-extend {
  pointer-events: none;
  text-align: center;
  font-size: unset;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-document {
  //overflow-x: auto;
  max-height: 134px !important;
  white-space: nowrap;
}

.h-100 {
  height: 100%;
}

//.h-100__30 {
//    height: calc(100% - 30px);
//}
.small-scrollbar ::-webkit-scrollbar-thumb {
  width: 0 !important;
  height: 0 !important;
}

.input-filter {
  z-index: 3;
  width: 14.2857%;

  .my-1 {
    margin-top: 0 !important;
  }
}

.paging {
  margin-top: 3rem;
}

.cusBtn {
  width: 14.1%;
}

.cusBtn button {
  font-size: 0.78rem;
  padding: 8px 0px 8px 0px !important;
}

@media only screen and (max-width: 1280px) {
  .cusTable {
    max-height: 75vh !important;
    overflow-x: hidden
  }
  .class-document {
    //height: 90px;
    .image-document {
      font-size: 0.4em;
      width: 100%;
    }

    .document-type-desc {
      width: 100%;
      font-size: 0.4em;
    }

    .num-img-extend {
      width: 100%;
    }
  }
  .cusBtn {
    width: 25%;
    margin-bottom: 0.5rem;
  }
  .btnAll {
    margin-left: 0.2rem;
  }
  .cusBtn button {
    font-size: 0.75rem;
  }
  h4 {
    font-size: 1.1rem !important;
  }
  .headerTable .hStudent {
    width: 32.8%;
  }
}

#pagination {
  position: fixed !important;
  bottom: 0 !important;
  width: calc(100vw - 260px) !important;
}

.multiselect-ghtk /deep/ > .multiselect-primary .multiselect__tag {
  margin: 0 0.375rem 0.375rem 0 !important;
  background-color: rgba(24, 28, 33, 0.1) !important;
  color: #4E5155 !important;
}

#btn-search {
  display: flex;
  flex-direction: row-reverse;

  button {
    margin-left: calc(75% + 6px);
    margin-right: 12px;
  }
}
</style>

<script>
// custom component
import CallStaffModal from './CallStaffModal'
import AddStaffNoteModal from './AddStaffNoteModal'
import ChangeStatusAccountModal from './ChangeStatusAccountModal'
import StaffDetailRow from './StaffDetailRow'
import ModalChangeLeader from './ModalChangeLeader.vue'
import ModalEditEvaluation from '../../Evaluation/ModalEditEvaluation'
import VisitHomeForm from '../profile/VisitHomeForm.vue'

// filter
import Multiselect from 'vue-multiselect'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import SelectProfileStatus from 'components/elements/common/SelectProfileStatus'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'

// service
import newStaffService from 'domain/services/new-staff.service'

import staffService from 'domain/services/staff-management-service'
// helper

import helper from 'infrastructures/helpers/common-helpers'
// entities

import {mapGetters, mapActions} from 'vuex'
import User from 'domain/entities/User'
import evaluationService from 'domain/services/evaluation-service'
import ModalInfoStaff from './ModalInfoStaff.vue'
import ModalSetRemoteCheckIn from './ModalSetRemoteCheckIn.vue'

export default {
  name: 'staff-management',

  components: {
    ModalSetRemoteCheckIn,
    ModalInfoStaff,
    Multiselect,
    MultiSelectProvince,
    MultiSelectRegion,
    MultiSelectStation,
    MultiSelectPosition,
    SelectProfileStatus,
    MultiSelectUser,
    ModalChangeLeader,
    AddStaffNoteModal,
    CallStaffModal,
    StaffDetailRow,
    ChangeStatusAccountModal,
    ModalEditEvaluation,
    VisitHomeForm
  },

  props: {
    scrollMode: {
      type: Boolean
    },
    blankMode: {
      type: Boolean
    }
  },

  data: _ => ({
    viewMode: 'leader_tree',
    selectedViewMode: 'leader_tree',
    allowGroups: [1, 3, 4, 5, 6, 8, 9, 10, 15, 19, 21, 22, 24, 25],
    loading: {
      listEmployee: false
    },
    status: null,
    permissionHr: false,
    permissionVh: false,
    permissionIt: false,
    list_data: [],
    changeFilter: true,
    filter: {
      region: '',
      province: '',
      station: '',
      position: '',
      mp_status: '',
      joinDate: null,
      userIds: []
    },
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 0
    },
    attachPermission: true,
    selected_user: null,
    modalOptions: null,
    showTagModal: false,
    showCallModal: false,
    showNoteModal: false,
    showChangeSttModal: false,
    showChangeLeaderModal: false,
    param: {
      regions: [],
      provinces: [],
      stations: [],
      positions: [],
      mp_status: [],
      staff_ids: []
    },
    listAccount: [],
    listLeader: [],
    statusChange: null,
    perPage: 10,
    isPermission: false,
    messageCheckRole: 'Đang truy cập...',
    imgInfo: 'https://dauso1900.vn/wp-content/uploads/2020/04/84181473_2862109443850624_6202619776917831680_o.png',
    evaluatedPermissionExpired: false,
    managerCriteria: User.defaultManagerCriteriaFstar,
    isManagement: '',
    evaluationModal: {},
    from: '',
    to: '',
    userInfo: {},
    evaluations: [],
    loadingModal: false,
    userIdChoice: null,
    idLoadingModal: null,
    isPermissionViewTagManagement: false,
    visitHome: {
      info: {
        staff_code: true,
        character_by_guardian: null,
        date_visit_home: null,
        employee_career_path: null,
        employee_sharing: null,
        family_economic: null,
        guardian_agree: null,
        guardian_know_responsibility: null,
        guardian_work_state: null,
        is_breadwinner: null,
        note: null,
        user_visit_home: null,
        file_visit: [],
        file_visit_add: [],
        file_visit_delete: []
      },
      required: {
        staff_code: true,
        character_by_guardian: true,
        date_visit_home: true,
        employee_career_path: true,
        employee_sharing: true,
        family_economic: true,
        guardian_agree: true,
        guardian_know_responsibility: true,
        guardian_work_state: true,
        is_breadwinner: true,
        user_visit_home: true,
        file_visit: true,
        locate_guardian_house: true
      }
    },
    addClassScroll: false,
    currentStaff: null,
    uidComponentStaff: null
  }),

  created () {
    if (this.authUser.User) {
      this.checkPermission()
    }
  },

  computed: {
    helper: function () {
      return helper
    },
    loading_data () {
      return this.loading.listEmployee
    },
    countListStaff () {
      if (!this.list_data || !Array.isArray(this.list_data)) {
        return 0
      }
      return this.list_data.length
    },
    ...mapGetters({
      permissions: 'education/getPermissions'
    }),
    ...mapGetters({
      authUser: 'userInfo'
    }),
    criteria () {
      if (!this.userInfo.ErpUser) return User.techCriteriaFstar
      let groupId = this.userInfo.ErpUser.group_id
      if (+groupId !== 15) {
        return User.defaultCriteriaFstar
      }
      return User.techCriteriaFstar
    },
    isHrStaff () {
      return this.authUser && parseInt(this.authUser.User.group_id) === 3
    }
  },

  watch: {
    authUser: {
      handler: function (newVal, oldVal) {
        if ((!oldVal.User && newVal.User) || newVal.User.id !== oldVal.User.id) {
          this.checkPermission()
        }
      }
    }
  },

  methods: {
    changeDataRemoteCheckin (statusRemoteCheckin) {
      const detailRow = this.$refs.staffDetailRow.find((item) => {
        item._uid = this.uidComponentStaff
      })
      if (detailRow) {
        detailRow.onChangeDataRemoteCheckin(statusRemoteCheckin, this.currentStaff, this.uidComponentStaff)
      }
    },

    onOpenModalStaff (action) {
      if (action === 'setRemoteCheckin' && this.currentStaff.has_remote_attendance) {
        this.$bvModal.show('config-set-remote-checkin')
      } else {
        const detailRow = this.$refs.staffDetailRow.find((item) => {
          item._uid = this.uidComponentStaff
        })
        if (detailRow) {
          detailRow.openModalFromInfoStaff(action, this.currentStaff, this.uidComponentStaff)
        }
      }
    },

    ...mapActions({
      setPermissions: 'education/setPermissions'
    }),

    onChangeViewMode () {
      if (this.viewMode !== this.selectedViewMode && !this.loading.listEmployee) {
        this.viewMode = this.selectedViewMode
        this.list_data = []
        this.pagination.current_page = 1
        this.pagination.per_page = 10
        this.pagination.total = 0
        this.getListEmployee()
      }
    },

    async checkPermission () {
      if (this.authUser && this.authUser.User) {
        const groupId = parseInt(this.authUser.User.group_id)
        if (this.isHrStaff) {
          this.viewMode = 'hr_team'
          this.selectedViewMode = 'hr_team'
        }
        // group id được quyền truy cập
        if (this.allowGroups.includes(groupId)) {
          this.getListEmployee()
          this.getPermissionEvaluationExpired()
          this.getDateSalary()
          this.isPermission = true
          // Quyền nhìn thấy link đến màn quản lý tag
          await this.getPermissionViewLinkTag()
        } else {
          this.messageCheckRole = 'Bạn không có quyền thao tác !'
          this.imgInfo = 'https://cache.giaohangtietkiem.vn/d/479f30a04d3d49da901783561217fcbe.jpg?width=450&height=346'
          helper.showMessage('Bạn không có quyền thao tác')
        }
      } else {
        this.imgInfo = 'https://cache.giaohangtietkiem.vn/d/479f30a04d3d49da901783561217fcbe.jpg?width=450&height=346'
        this.messageCheckRole = 'Bạn chưa đăng nhập !'
      }
    },

    async getPermissionViewLinkTag () {
      try {
        const res = await staffService.checkPermissionLinkTag()
        if (res.data.success) {
          this.isPermissionViewTagManagement = true
        } else {
          this.isPermissionViewTagManagement = false
        }
      } catch (e) {
        console.log(e)
        this.isPermissionViewTagManagement = false
      } finally {
      }
    },

    getDateSalary () {
      let d = new Date()
      let month = d.getMonth() + 1
      let year = d.getFullYear()
      let nextMonth = (+month) === 12 ? 1 : (month + 1)
      let nextYear = (+nextMonth) === 1 ? (year + 1) : year
      this.from = year + '-' + month + '-' + '21'
      this.to = nextYear + '-' + nextMonth + '-' + '20'
    },

    async onScrollTable () {
      const table = document.querySelector('#tableRookie')
      if (+table.scrollTop > 0) {
        this.addClassScroll = true
      } else {
        this.addClassScroll = false
      }
    },
    search () {
      this.list_data = []
      this.pagination.current_page = 1
      this.pagination.per_page = 10
      this.pagination.total = 0
      this.buildQuery()
      this.getListEmployee()
    },
    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
      this.changeFilter = true
    },
    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
      this.changeFilter = true
    },
    handleStudentPositionSelected (ops) {
      this.filter.position = ops ? ops.map(item => item.id).toString() : ''
      this.changeFilter = true
    },
    handleRegionSelected: function (option) {
      this.filter.region = option.length ? option.map((item) => item.id).toString() : ''
      this.changeFilter = true
    },
    handleMpStatusSelected: function (option) {
      this.filter.mp_status = option ? option.map((item) => item.value).join(',') : null
      this.changeFilter = true
    },
    handleUsersSelected: function (option) {
      this.filter.userIds = option
      if (this.filter.userIds !== null) {
        this.changeFilter = true
      }
    },
    buildQuery () {
      this.param = {
        provinces: [],
        stations: [],
        positions: [],
        mp_status: [],
        staff_ids: []
      }
      if (this.filter.region.length > 0) {
        this.param.regions = this.filter.region.split(',')
      }
      if (this.filter.province.length > 0) {
        this.param.provinces = this.filter.province.split(',')
      }
      if (this.filter.station.length > 0) {
        this.param.stations = this.filter.station.split(',')
      }
      if (this.filter.position.length > 0) {
        this.param.positions = this.filter.position.split(',')
      }
      if (this.filter.mp_status.length > 0) {
        this.param.mp_status = this.filter.mp_status.split(',')
      }
      if (this.filter.userIds !== null && this.filter.userIds.length > 0) {
        this.param.staff_ids = this.filter.userIds.map(a => a.id)
      }
      if (this.filter.joinDate !== null) {
        this.param.join_date_from = helper.formatDate(this.filter.joinDate.start, 'YYYY-MM-DD')
        this.param.join_date_to = helper.formatDate(this.filter.joinDate.end, 'YYYY-MM-DD')
      }
    },

    getPermissionEvaluationExpired () {
      evaluationService.getPermissionEvaluationExpired()
        .then(response => {
          if (response.data.success) {
            this.evaluatedPermissionExpired = response.data.allowed
          }
        })
    },

    async getListEmployee () {
      // edit here return list_data
      if (this.loading.listEmployee) {
        return
      }
      this.changeFilter = false
      try {
        this.loading.listEmployee = true
        let params = {
          filters: {
            ...this.param
          },
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          view_mode: this.viewMode
        }
        const res = await staffService.getListEmployee(params)
        const {success, message, data} = res.data
        if (success) {
          this.list_data = data

          if (res.data.current_page && res.data.per_page) {
            this.pagination = res.data
            delete this.pagination.success
            delete this.pagination.message
            delete this.pagination.data
          }

          if (!this.pagination.current_page) {
            this.pagination.current_page = params.page
          }
          if (!this.pagination.per_page) {
            this.pagination.current_page = params.per_page
          }
        } else {
          helper.showMessage(message, 'warning')
        }
      } catch (e) {
        helper.showMessage(e.message, 'error')
      } finally {
        this.loading.listEmployee = false
      }
    },

    onOpenModal (args) {
      const {modal, user, options} = args
      this.selected_user = user
      this.modalOptions = options || {}
      this.modalOptions.viewMode = this.viewMode
      if (options.hasOwnProperty('statusChange')) {
        this.statusChange = options.statusChange
      }
      if (modal === 'changeSttModal') {
        let subAccount = this.convertData(user)
        // Thêm user chính vào
        this.listAccount = [...subAccount, {
          id: user.id,
          username: user.username,
          isMain: true,
          status_id: user.status_id
        }]
        if (this.statusChange === 'lock') {
          this.listAccount = this.listAccount.filter(item => item.status_id === 3)
        } else {
          this.listAccount = this.listAccount.filter(item => item.status_id !== 3)
        }
      }
      if (modal === 'changeLeader') {
        let listLeader = this.convertDataLeader(user)
        // Thêm user chính vào
        this.listLeader = [...listLeader]
      }
      switch (modal) {
        case 'tagModal':
          this.showTagModal = true
          break
        case 'callModal':
          this.showCallModal = true
          break
        case 'noteModal':
          this.showNoteModal = true
          break
        case 'changeSttModal':
          this.showChangeSttModal = true
          break
        case 'changeLeader':
          this.showChangeLeaderModal = true
          break
      }
    },

    reduceStaffList (id) {
      this.list_data = this.list_data.filter((item) => item.id !== id)
    },

    onCloseModal (modal) {
      this.selected_user = null
      this.modalOptions = null
      switch (modal) {
        case 'tagModal':
          this.showTagModal = false
          break
        case 'callModal':
          this.showCallModal = false
          break
        case 'noteModal':
          this.showNoteModal = false
          break
        case 'changeSttModal':
          this.showChangeSttModal = false
          break
        case 'changeLeader':
          this.showChangeLeaderModal = false
          break
      }
    },

    async onOpenModalEvaluation (userId) {
      this.evaluationModal = null
      this.loadingModal = true
      this.idLoadingModal = userId
      let params = {
        id: userId,
        from: this.from,
        to: this.to
      }
      this.userIdChoice = userId
      await Promise.all([
        this.checkIsManagement(userId),
        this.getEvaluationByUser(params)
      ]).then((values) => {
        if (values.includes('error')) {
          this.loadingModal = false
          this.idLoadingModal = null
          return helper.showMessage('Đã xảy ra lỗi khi lấy thông tin đánh giá của nhân viên', 'warning')
        } else {
          if (!this.checkNotEnoughEva(this.evaluations)) {
            this.loadingModal = false
            this.idLoadingModal = null
            return helper.showMessage('Bạn không có quyền đánh giá hoặc chưa đến chu kì đánh giá', 'warning')
          } else {
            this.$bvModal.show('modal-edit-evaluation')
            this.loadingModal = false
            this.idLoadingModal = null
          }
        }
      })
    },

    getEvaluationByUser: async function (params) {
      try {
        const res = await evaluationService.getEvaluationByUser(params)
        if (res.data.hasOwnProperty('success')) {
          if (res.data.success) {
            this.userInfo = res.data.data.UserInfo
            this.evaluations = res.data.data.Evaluations
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        }
      } catch (e) {
        return 'error'
      }
    },

    checkIsManagement: async function (userId) {
      try {
        let params = {
          id: userId
        }
        const res = await evaluationService.checkIsManagement(params)
        if (res.data.hasOwnProperty('success')) {
          if (res.data.success) {
            if (res.data.success) {
              this.isManagement = res.data.data
            }
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        }
      } catch (e) {
        return 'error'
      }
    },

    checkNotEnoughEva (eva) {
      if (this.evaluatedPermissionExpired) return true
      if (this.userInfo.ErpUser && parseInt(this.userInfo.ErpUser.group_id) === 15) {
        return true
      }
      let now = new Date()
      let dd = now.getDate()
      if ((dd > 9 && dd < 21) || dd > 24) return false
      if (dd > 20 && dd < 25) {
        if (eva.length < 2) return true
      }
      if (dd > 4 && dd < 9) {
        if (eva.length < 1) return true
      }
      return false
    },

    async onClickChat (userId) {
      const res = await newStaffService.createDirectChat({user_id: userId})
      const {success, message, data} = res.data
      if (success) {
        const channelId = data.channel_id
        helper.openLink(`https://ghtk.me/channel/internal/${channelId}`)
      } else {
        helper.showMessage(message, 'warning')
      }
    },

    convertData (user) {
      let data = []
      if (user.hasOwnProperty('sub_accounts')) {
        if (user.sub_accounts !== null) {
          user.sub_accounts.forEach((account) => {
            data.push({
              id: account.id,
              username: account.username,
              isMain: false,
              status_id: account.status_id
            })
          })
        }
      }
      return data
    },

    convertDataLeader (user) {
      let data = []
      if (user.hasOwnProperty('leaders')) {
        if (user.leaders.length > 0) {
          user.leaders.forEach((account) => {
            data.push({
              id: account.id,
              username: account.username,
              name: account.name
            })
          })
        }
      }
      return data
    },

    viewDetailStaff (staffInfo, uidComponentStaff) {
      this.currentStaff = staffInfo
      this.uidComponentStaff = uidComponentStaff
      this.$bvModal.show('modal-info-staff')
    }

  }
}
</script>
