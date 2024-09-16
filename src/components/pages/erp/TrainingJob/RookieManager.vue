<template>
    <div class="d-none d-md-block main-content">
            <div class="header-padding text-center-y d-flex" style="justify-content: space-between; margin-top: 0.8rem; margin-bottom: 0.8rem;">
              <div class="d-flex">
                <div class="d-flex pt-1">
                  <h4 style="width: 5rem;" class="m-0 font-weight-bold">Đào tạo</h4>
                  <router-link style="width: 5rem;" to="/staff-work/syllabus" class="m-0 header-setting" v-if="dutySyllabus">Cài đặt</router-link>
                </div>

                <div class="action-toggle ml-3">
                  <router-link to="/staff-work/classes" class="link action-toggle--not-active">Lớp Học</router-link>
                  <div class="action-toggle--active">Học Viên</div>
                </div>
              </div>

                <div class="text-right tab-work-scroll" v-if="canAccess">
                  <div class="pre-tab pre-tab-left" v-if="tabScroll.leftShow">
                    <div class="pre-btn text-ghtk" @click="scrollTab('tab-work', 'left')">
                      <i class="ion ion-ios-arrow-back"></i>
                    </div>
                  </div>
                  <div class="work-options" v-scroll="checkScrollTab" v-resize="checkScrollTab" id="tab-work">
                    <div v-for="(rookieStatus, index) in rookieStatuses" :key="'status'+index" class="px-1 d-inline-block">
                      <b-btn
                        :variant="isActiveTab === 'status'+index ? 'ghtk' : 'outline-ghtk-color-custom'"
                        class="rounded pd-5 w-100"
                        @click="searchByStatus(rookieStatus.status, 'status'+index)">
                        <span v-if="rookieStatus.name">{{ rookieStatus.name }}</span>
                        <span>
                          <i v-show="loadingStatistic[index]" class="fas fa-spinner fa-pulse"></i>
                          <span v-show="!loadingStatistic[index] &&  ![null, undefined].includes(statistic[rookieStatus.alias])">
                            ({{ statistic[rookieStatus.alias] || 0 }})
                          </span>
                        </span>
                      </b-btn>
                    </div>
                  </div>
                  <div class="pre-tab pre-tab-right" v-if="tabScroll.rightShow">
                  <div class="pre-btn text-ghtk" @click="scrollTab('tab-work', 'right')">
                    <i class="ion ion-ios-arrow-forward"></i>
                  </div>
                </div>
              </div>
        </div>

        <!-- filter  -->
        <div class="mx-0 filter pb-1 row z-3" style="margin-right: -4px !important;">
          <div class="mb-1 input-filter pl-2 pr-1">
            <multi-select-region
              :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
              :regions="filter.region"
              :auto-close="true"
              :placeholder="'Miền'"
              @handleSelectedRegion="handleRegionSelected"
            ></multi-select-region>
          </div>
          <div class="mb-1 input-filter pl-2 pr-1">
            <multi-select-province
              :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
              :province-ids="filter.province"
              :region="filter.region"
              :auto-close="true"
              :hide-select="true"
              :placeholder="'Tỉnh'"
              @handleProvinceSelected="handleProvinceSelected"
              @handleProvinceOption="tmpProvinces = $event"
            ></multi-select-province>
          </div>
          <div class="mb-1 input-filter pl-2 pr-1">
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
          <div class="mb-1 input-filter pl-2 pr-1">
            <multi-select-syllabus
              :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
              :syllabuse-ids="filter.syllabus"
              :auto-close="true"
              :placeholder="'Chương trình'"
              @handleSyllabusSelected="handleSyllabusSelected"
            ></multi-select-syllabus>
          </div>
          <div class="mb-1 input-filter pl-2 pr-1">
            <MultiSelectPosition
              class="multiselect-ghtk multiselect-no-horizontal"
              :position-ids="filter.student_position"
              :auto-close="true"
              :hide-selected="true"
              placeholder="Vị trí"
              :isSyllabus="true"
              @handlePositionSelected="handleStudentPositionSelected"
            />
          </div>
          <div class="mb-1 input-filter pl-2 pr-1">
            <MultiSelectUser
              :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
              :custom-multiselect-class="'z-3'"
              :auto-close="true"
              :multiple="true"
              :placeholder="'username'"
              :stationId="filter.station"
              @onChange="filter.userIds = $event, changeFilter = true"
            >
            </MultiSelectUser>
          </div>
          <div class="input-filter pr-2 pl-1">
            <b-btn :disabled="!canAccess" variant="ghtk" @click="search()" class="filter-containter__btn-search btn-header-class"> Tìm kiếm</b-btn>
          </div>
        </div>

      <!-- Table data  -->
      <div :class="'table-sticky'" class="table-data cusTable" style="max-height: 81vh;" @scroll="onScrollTable" id="tableRookie">
        <table class="table table-sm mb-0">
          <thead>
          <tr class="text-left">
            <th class="w-40 text-black" style="border-bottom: 2px solid #f1f1f2;height: 3rem;vertical-align: middle;background-color: #f7f7f7;">Học viên</th>
            <th class="text-black" style="border-bottom: 2px solid #f1f1f2;height: 3rem;vertical-align: middle;background-color: #f7f7f7;">Lớp học</th>
          </tr>
          </thead>
          <tbody class="position-relative" v-loading="loading_data">
            <template v-for="(user) in list_data">
              <RookieDetailRow
                :infoRookie="user"
                :role-user-id="listCheckUserIsCalled['user_id_' + user.id]"
                :number-user-called="numberUserCalled"
                :key="user.id"
                :can-access="canAccess"
                @onClickChat="onClickChat"
                @onOpenModal="onOpenModal"
                @updateStatusCall="updateStatusCall"
              >
              </RookieDetailRow>
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
      <div class="row mt-3 align-items-center" v-show="!helper.isEmpty(list_data)">
        <div class="col col-md-9 text-left">
<!--          <b class="text-black">-->
<!--            Bản ghi/ trang-->
<!--          </b>-->
<!--          <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"-->
<!--                  v-model="page.rookie.per_page" @change="getListRookie()">-->
<!--            <option>5</option>-->
<!--            <option>10</option>-->
<!--            <option>25</option>-->
<!--          </select>-->
          <div class="z-0 d-inline-block">
            <b-pagination
              class="paginator-ghtk mb-0"
              size="sm"
              align="left"
              v-model="page.rookie.current_page"
              :total-rows="+page.rookie.total_row"
              :per-page="+page.rookie.per_page"
              @input="getListRookie()"
            >
            </b-pagination>
          </div>
        </div>
      </div>

      <RookieTagModal
        :open="showTagModal"
        :user="selected_user"
        :options="modalOptions"
        :attach-permission="attachPermission"
        :can-access="canAccess"
        @onCloseModal="onCloseModal"
      />

      <RookieCallModal
        :open="showCallModal"
        :user="selected_user"
        :options="modalOptions"
        :can-access="canAccess"
        @onCloseModal="onCloseModal"
      />

      <RookieNoteModal
        :open="showNoteModal"
        :user="selected_user"
        :options="modalOptions"
        :can-access="canAccess"
        @onCloseModal="onCloseModal"
      />

    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
.tab-work-scroll {
  display: flex;
  justify-content: end;
  align-items: center;
  overflow: auto;
  margin-left: 1rem;
  position: relative;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.work-options {
  margin-right: 2rem;
  margin-left: 2rem;
  overflow: auto;
  white-space: nowrap;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.pre-tab {
  top: -1px;
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 100;
  &-left {
    left: 0.25rem;
    font-size: 24px;
    cursor: pointer;
    &:after {
      content: "";
      pointer-events: none;
      height: 100%;
      width: 3rem;
      background: linear-gradient(to right,rgba(255, 255, 255, 0.98) 20%,rgba(255,255,255,0) 80%);
    }
  }
  &-right {
    right: 0.25rem;
    font-size: 24px;
    cursor: pointer;
    &:before {
      content: "";
      pointer-events: none;
      height: 100%;
      width: 3rem;
      background: linear-gradient(to left,rgba(255, 255, 255, 0.98) 20%,rgba(255,255,255,0) 80%);
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
        padding-left: 4px;
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

    .detail-logs {
      ul.log-timeline {
        li:last-child {
          margin-bottom: -18px;
        }
      }
      .log-timeline{
        box-sizing: border-box;
        color: #000;
        font-variant: tabular-nums;
        line-height: 1rem;
        -webkit-font-feature-settings: "tnum","tnum";
        font-feature-settings: "tnum","tnum";
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
      .time-log{
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
        margin-top: 0!important;
      }
    }
    .paging {
      margin-top: 3rem;
    }

    .cusBtn {
      width: 14.1%;
    }

    @media only screen and (max-width: 1280px) {
      .cusTable {
        max-height: 81vh !important;
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
      .headerTable .hStudent {
        width: 32.8%;
      }
    }

    .action-toggle {
      --width: 200px;
      --height: 30px;
      width: var(--width);
      height: var(--height);
      box-shadow: 0 1px 3px #cfcfcf;
      border-radius: var(--height);
      cursor: pointer;
      margin-bottom: 0;
      display: flex;
      line-height: var(--height);
      font-weight: 700;
    }

    .action-toggle__left {
      width: calc(var(--width) / 2 + 20px);
      height: calc(var(--height));
      border-radius: calc(var(--height) / 2);
      background-color: #069255;
      box-shadow: 0 1px 3px #cfcfcf;
      color: white;
      text-align: center;
      line-height: var(--height);
    }

    .action-toggle__right {
      width: calc(var(--width) / 2 - 20px);
      text-align: center;
      color: #000000;
    }

    .action-toggle--active {
      width: calc(var(--width) / 2 + 20px);
      height: calc(var(--height));
      border-radius: calc(var(--height) / 2);
      background-color: #069255;
      box-shadow: 0 1px 3px #cfcfcf;
      color: white;
      text-align: center;
      line-height: var(--height);
    }

    .action-toggle--not-active {
      width: calc(var(--width) / 2 - 20px);
      text-align: center;
      color: #000000;
    }
</style>

<script>
// custom component
import TimeLine from '../StaffLog/TimeLine.vue'
import ModalCreateClassV2 from './ModalCreateClassV2.vue'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import ListAcademy from './ListAcademy'
import ModalRollUp from './ModalRollUp'
import ModalConfirmClass from './ModalConfirmClass'
import ModalCompletePeriod from './ModalCompletePeriod'
import Multiselect from 'vue-multiselect'
import ModalStudentNoClass from './ModalStudentNoClass'
import ModalSendTest from './ModalSendTest'
import PeriodTestBuilder from '../Education/PeriodTestBuilder'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import MultiSelectClass from 'components/elements/common/MultiSelectClass'
import EditPeriodDocuments from 'components/pages/erp/Education/edit-period-documents'
import ModalDeleteAcademy from './ModalDeleteAcademy'
import ModalAddStudent from './ModalAddStudent'
import ModalAttendance from './ModalAttendance'
import RookieDetailRow from '../Education/RookieDetailRow'
import RookieTagModal from './RookieTagModal'
import RookieCallModal from './RookieCallModal'
import RookieNoteModal from './RookieNoteModal'

// filter
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectSyllabus from 'components/elements/common/MultiSelectSyllabus'
// import Datepicker from 'vuejs-datepicker'

// service
import newStaffService from 'domain/services/new-staff.service'

import trainingService from 'domain/services/training-service'
// helper

import helper from 'infrastructures/helpers/common-helpers'
// entities
import ModalConfirmTraining from './ModalConfirmTraining'

import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'rookie-manager',

  components: {
    RookieNoteModal,
    RookieCallModal,
    RookieDetailRow,
    RookieTagModal,
    ModalConfirmTraining,
    ModalAttendance,
    ModalAddStudent,
    ModalDeleteAcademy,
    ModalStudentNoClass,
    TimeLine,
    ModalConfirmClass,
    ModalCompletePeriod,
    ModalRollUp,
    ListAcademy,
    SingleSelectUser,
    Multiselect,
    PeriodTestBuilder,
    ModalSendTest,
    MultiSelectUser,
    MultiSelectClass,
    EditPeriodDocuments,
    ModalCreateClassV2,
    MultiSelectProvince,
    MultiSelectRegion,
    MultiSelectStation,
    MultiSelectPosition,
    MultiSelectSyllabus
  },

  props: {
    scrollMode: {
      type: Boolean,
      default: true
    },
    blankMode: {
      type: Boolean
    }
  },

  data: _ => ({
    canAccess: false,
    loading: {
      listRookie: false,
      logOperation: false,
      logEducation: false
    },
    isActiveTab: 'status0',
    status: null,
    rookieStatuses: [
      {
        alias: 'tat_ca',
        status: 'tat_ca',
        name: 'Tất cả'
      },
      {
        alias: 'chua_xep_lop',
        status: 'chua_xep_lop',
        name: 'Chưa xếp lớp'
      },
      {
        alias: 'chua_diem_danh',
        status: 'chua_diem_danh',
        name: 'Chưa điểm danh'
      },
      {
        alias: 'chua_lam_bai',
        status: 'chua_lam_bai',
        name: 'Chưa làm bài'
      },
      {
        alias: 'diem_kem',
        status: 'diem_kem',
        name: 'Điểm kém'
      },
      {
        alias: 'the_phat',
        status: 'the_phat',
        name: 'Thẻ phạt'
      },
      {
        alias: 'da_nghi',
        status: 'da_nghi',
        name: 'Đã nghỉ'
      }
    ],
    loadingStatistic: {
      0: true,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true
    },
    statistic: {
      tat_ca: null,
      chua_xep_lop: null,
      chua_diem_danh: null,
      chua_lam_bai: null,
      diem_kem: null,
      the_phat: null,
      da_nghi: null
    },
    permissionHr: false,
    permissionVh: false,
    permissionIt: false,
    list_data: [],
    changeFilter: true,
    filter: {
      region: '',
      province: '',
      station: '',
      student_position: '',
      userIds: [],
      syllabus: '',
      type: 'tat_ca'
    },
    page: {
      rookie: {
        current_page: 1,
        total_row: 0,
        per_page: 5
      }
    },
    list_log_operate: [],
    attachPermission: true,
    selected_user: null,
    modalOptions: null,
    showTagModal: false,
    showCallModal: false,
    showNoteModal: false,
    isLimitUser: false,
    listCheckUserIsCalled: {},
    limitHeight: 0,
    isSetScrollCompleted: true,
    numberUserCalled: 2,
    param: {
      type: 'tat_ca',
      provinces: [],
      stations: [],
      positions: [],
      userIds: [],
      syllabus: []
    },
    tmpProvinces: [],
    tabScroll: {
      leftShow: false,
      rightShow: false
    }

  }),

  async created () {
    const res = await newStaffService.canAccess()
    const {success, message} = res.data
    if (success) {
      this.canAccess = true
      await this.getListRookie()
      await this.getStatisticRookie()
      let el = document.getElementById('tab-work')
      if (el) this.checkScrollTab(null, el)
    } else {
      this.canAccess = false
      helper.showMessage(message || 'Bạn không có quyền truy cập màn Học viên!', 'warning')
    }
  },

  computed: {
    helper: function () {
      return helper
    },
    loading_data () {
      return this.loading.listRookie
    },
    dutySyllabus () {
      return this.$route.query.dutySyllabus
    },
    ...mapGetters({
      permissions: 'education/getPermissions'
    })
  },

  watch: {
    status (newVal, oldVal) {
      this.filter.status = newVal ? newVal.map((item) => item.status).toString() : ''
    }
  },

  async mounted () {
    window.addEventListener('resize', this.handleScrollTab)
    // setTimeout(() => {
    //   let el = document.getElementById('tab-work')
    //   if (el) this.checkScrollTab(null, el)
    // }, 5000)
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
    window.removeEventListener('resize', this.handleScrollTab)
  },

  methods: {
    ...mapActions({
      setPermissions: 'education/setPermissions'
    }),
    async onScrollTable () {
      const table = document.querySelector('#tableRookie')
      if (table.clientHeight + table.scrollTop + 100 >= this.limitHeight && !this.loading.listRookie && !this.isLimitUser) {
        // Lấy log vận hành, thông tin lớp học, tối đa 2
        if (this.isSetScrollCompleted) {
          await this.setDataCallWhenScroll()
        }
      }
    },

    scrollTab (el, type) {
      el = document.getElementById(el)
      if (!el) return
      el.scroll({left: el.scrollLeft + (type === 'right' ? 150 : -150)})
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
      if (this.tabScroll.rightShow) {
        el.style.marginRight = '2rem'
      } else {
        el.style.marginRight = '0'
      }
    },

    setDataCallWhenScroll () {
      this.isSetScrollCompleted = false
      let count = 0
      Object.values(this.listCheckUserIsCalled).forEach((item) => {
        if (count === 2) {
          return true
        }
        if (!item.isCalled) {
          this.listCheckUserIsCalled['user_id_' + item.userId].roleCall = true
          this.numberUserCalled++
          count++
        }
      })
    },
    async search () {
      await this.setDefault()
      this.page.currentPage = 1
      this.page.perPage = 5
      this.changeFilter = true
      this.buildQuery()
      this.getStatisticRookie()
      this.getListRookie()
    },
    async searchByStatus (value, currentIndex) {
      await this.setDefault()
      this.filter.type = value
      this.isActiveTab = currentIndex
      this.buildQuery()
      this.getStatisticRookie()
      this.getListRookie()
    },
    async searchAll () {
      await this.setDefault()
      this.filter.region = null
      this.filter.provinces = null
      this.filter.stations = null
      this.filter.positions = null
      this.filter.userIds = null
      this.filter.syllabus = null
      this.filter.type = 'tat_ca'
      this.getStatisticRookie()
      this.getListRookie()
    },
    setDefault () {
      document.querySelector('#tableRookie').scrollTop = 0
      this.limitHeight = 0
      this.numberUserCalled = 2
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
      this.filter.student_position = ops ? ops.map(item => item.id).toString() : ''
      this.changeFilter = true
    },
    handleSyllabusSelected: function (option) {
      this.filter.syllabus = option.length ? option.map((item) => item.id).toString() : ''
      this.changeFilter = true
    },
    handleRegionSelected: function (option) {
      this.filter.region = option.length ? option.map((item) => item.id).toString() : ''
      this.changeFilter = true
    },
    buildQuery () {
      this.param = {
        type: 'tat_ca',
        provinces: [],
        stations: [],
        positions: [],
        userIds: [],
        syllabus: []
      }
      if (this.filter.station.length > 0) {
        this.param.stations = this.filter.station.split(',')
      }
      if (this.filter.province.length > 0) {
        this.param.provinces = this.filter.province.split(',')
      }
      if (this.filter.province.length === 0 && this.filter.region.length > 0 && this.filter.region.length < 15) {
        this.param.provinces = this.tmpProvinces
      }
      if (this.filter.student_position.length > 0) {
        this.param.positions = this.filter.student_position.split(',')
      }
      if (this.filter.syllabus.length > 0) {
        this.param.syllabus = this.filter.syllabus.split(',')
      }
      if (this.filter.userIds !== null && this.filter.userIds.length > 0) {
        this.param.userIds = this.filter.userIds.map(a => a.id)
      }
      this.param.type = this.filter.type
    },
    async getStatisticRookie () {
      try {
        if (!this.changeFilter) {
          return true
        }
        this.changeFilter = false
        this.loadingStatistic[0] = true
        this.loadingStatistic[1] = true
        this.loadingStatistic[2] = true
        this.loadingStatistic[3] = true
        this.loadingStatistic[4] = true
        this.loadingStatistic[5] = true
        this.loadingStatistic[6] = true
        this.loadingStatistic[7] = true
        let filter = {
          provinces: this.param.provinces,
          stations: this.param.stations,
          positions: this.param.positions,
          userIds: this.param.userIds,
          syllabus: this.param.syllabus,
          type: 'tat_ca'
        }
        let filter0 = filter
        trainingService.getStatisticRookie(filter0)
          .then((res) => {
            if (res.data.success) {
              this.statistic.tat_ca = res.data.data.tat_ca
              this.statistic.da_nghi = res.data.data.da_nghi
            } else {
              helper.showMessage(res.data.message, 'warning')
            }
          })
          .catch((e) => {
            console.error(e)
          }).then(() => {
            this.loadingStatistic[0] = false
            this.loadingStatistic[6] = false
          })
        let filter1 = filter
        filter1.type = 'chua_xep_lop'
        trainingService.getStatisticRookie(filter1)
          .then((res) => {
            if (res.data.success) {
              this.statistic.chua_xep_lop = res.data.data.chua_xep_lop
            } else {
              helper.showMessage(res.data.message, 'warning')
            }
          })
          .catch((e) => {
            console.error(e)
          }).then(() => {
            this.loadingStatistic[1] = false
          })
        let filter2 = filter
        filter2.type = 'chua_diem_danh'
        trainingService.getStatisticRookie(filter2)
          .then((res) => {
            if (res.data.success) {
              this.statistic.chua_diem_danh = res.data.data.chua_diem_danh
              this.statistic.chua_lam_bai = res.data.data.chua_lam_bai
              this.statistic.diem_kem = res.data.data.diem_kem
            } else {
              helper.showMessage(res.data.message, 'warning')
            }
          })
          .catch((e) => {
            console.log(e)
          }).then(() => {
            this.loadingStatistic[2] = false
            this.loadingStatistic[3] = false
            this.loadingStatistic[4] = false
          })
        let filter3 = filter
        filter3.type = 'the_phat'
        trainingService.getStatisticRookie(filter3)
          .then((res) => {
            if (res.data.success) {
              this.statistic.the_phat = res.data.data.the_phat
            } else {
              helper.showMessage(res.data.message, 'warning')
            }
          })
          .catch((e) => {
            console.error(e)
          }).then(() => {
            this.loadingStatistic[5] = false
          })
      } catch (e) {
        helper.showMessage(e.message, 'error')
      }
    },
    async getListRookie () {
      // edit here return list_data
      try {
        this.loading.listRookie = true
        let filter = {...this.param}
        const res = await trainingService.getListRookie({
          ...filter,
          ...this.page.rookie
        })
        if (res.data.success) {
          helper.showMessage(res.data.message, 'success')
          this.list_data = res.data.data
          this.page.rookie.total_row = Number(res.data.total)
          // this.permission = data.data.data.permission
          if (this.list_data.length > 0) {
            this.listCheckUserIsCalled = this.setDataCheckCalled(this.list_data)
          }
        } else {
          helper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        helper.showMessage(e.message, 'error')
      } finally {
        this.loading.listRookie = false
      }
    },

    setDataCheckCalled (data) {
      // số lần cho phép call, nếu có 5 phần tử, call 2,2,1 | có 3 phần tử call 3 luôn
      let limitCall = (data.length === 3) ? 3 : 2
      let arr = []
      for (let i = 0; i < data.length; i++) {
        let k = 'user_id_' + data[i].id
        // mặc định gọi 2 giá trị đầu tiên
        if (i < limitCall) {
          arr[k] = {
            userId: data[i].id,
            roleCall: true,
            isCalled: false
          }
        } else {
          arr[k] = {
            userId: data[i].id,
            roleCall: false,
            isCalled: false
          }
        }
      }
      return arr
    },

    onOpenModal (args) {
      const {modal, user, options} = args
      this.selected_user = user
      this.modalOptions = options || {}
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
      }
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
      }
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

    updateStatusCall (userId, height) {
      this.listCheckUserIsCalled['user_id_' + userId].isCalled = true
      this.limitHeight += height
      // số quyền call api = số lần call xong
      let numberCalled = this.checkCallAllCompleted()
      if (numberCalled === this.numberUserCalled) {
        this.isSetScrollCompleted = true
      }
    },

    checkCallAllCompleted () {
      let count = 0
      Object.values(this.listCheckUserIsCalled).forEach((item) => {
        if (item.isCalled) {
          count++
        }
      })
      return count
    }

  }
}
</script>
