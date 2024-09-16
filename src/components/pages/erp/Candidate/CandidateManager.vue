<template>
    <div class="d-none d-md-block main-content candidate_management_page">
        <div v-if="isSuccessOrFails" class="col-12 justify-content-center mt-3 mb-3">
            <b-alert variant="success" show class="alert-message">
                <div>{{ messageSuccessOrFails }}</div>
                <div style="color: red" v-if="fileError">Tệp lỗi: <a :href="fileError" target="_blank"> Click tải file ở đây.</a></div>
                <i class="fas fa-times alert-message__close-btn" @click="resetMessageImport"></i>
            </b-alert>
        </div>
        <b-row class="mx-0 header my-2 align-items-center">
            <b-col md="4" >
                <h4 class="m-0">Tuyển dụng</h4>
            </b-col>
            <b-col md="8" class="text-right">
                <b-btn
                  :variant="isActiveTab === 'all' ? 'ghtk' : 'outline-ghtk-color-custom'"
                  id="candidate-btn-all"
                  name="candidate-btn-all"
                  class="btn-radius pd-5 btn-filter-tag"
                  @click="searchAll()"
                >
                    Tất cả
                </b-btn>
                <b-btn
                    v-for="(candidateStatus, index) in candidateStatuses" :key="'status'+index"
                    :variant="isActiveTab === 'status'+index ? 'ghtk' : 'outline-ghtk-color-custom'"
                    class="btn-radius pd-5 btn-filter-tag"
                    :id="'candidate-btn-' + candidateStatus.status"
                    :name="'candidate-btn-' + candidateStatus.status"
                    @click="searchByStatus(candidateStatus.status, 'status'+index)"
                >
                    {{ candidateStatus.name }} ({{ candidateStatus.total }})
                </b-btn>
                <b-button class="tag-manage" pill variant="outline-secondary" @click="openTagManage()">+ Tag</b-button>
            </b-col>
        </b-row>
        <div class="filter-select-container">
            <b-row class="mx-0 filter pb-1">
                <b-col class="col-1-7 mb-1 placeholder-contain z-5">
                    <input
                        placeholder="Họ tên"
                        v-model="filter.full_name"
                        class="form-control"
                        @keyup.enter="search()"
                        style="border-radius: 4px"
                    />
                </b-col>
                <b-col class="col-1-7 mb-1 placeholder-contain z-5">
                    <input
                      placeholder="SĐT, Email, CMND"
                      v-model="filter.email_phone_identity_number"
                      class="form-control"
                      @keyup.enter="search()"
                      style="border-radius: 4px"
                    />
                </b-col>
                <b-col class="col-1-7 mb-1 placeholder-contain z-5">
                    <single-select-profile-region
                        class="z-5 multiselect-ghtk multiselect-no-horizontal"
                        :placeholder="'Chọn miền'"
                        @handleSelectedRegion="handleSelectedRegion"
                    >
                  </single-select-profile-region>
                </b-col>
                <b-col class="col-1-7 mb-1 z-5">
                    <multi-select-province
                        :customClass="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                        :province-ids="filter.provinceId"
                        :auto-close="true"
                        :hide-select="true"
                        @handleProvinceSelected="handleProvinceSelected"
                    ></multi-select-province>
                </b-col>
                <b-col class="col-1-7 mb-1 z-5">
                    <multi-select-districts
                        :customClass="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                        :auto-close="true"
                        :hide-select="true"
                        @onChange="handleSelectedLocation(...arguments, 'district_register_id')"
                        :province-id="filter.provinceId"
                        :district-id="filter.districtId"
                    >
                  </multi-select-districts>
                </b-col>
                <b-col class="col-1-7 mb-1 z-5">
                    <multi-select-station
                        :customClass="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                        :station-ids="filter.stationId"
                        :auto-close="true"
                        :hide-select="true"
                        @handleStationSelected="handleStationSelected"
                    ></multi-select-station>
                </b-col>
                <b-col class="col-1-7 mb-1 z-5">
                    <MultiSelectHrTag
                        :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                        v-model="filter.hr_tag_id"
                        :multiple="false"
                        :scope="'private'"
                        :table-name="'sgw_candidates'"
                        :placeholder="'Tag ứng viên'"
                        :type="'getJob'"
                        :reload="reloadListTag"
                        @handleHrTagSelected="handleHrTagSelected"
                    />
                </b-col>
            </b-row>
                <b-row class="mx-0 filter pb-1">
                    <b-col class="col-1-7 mb-1 placeholder-contain z-3">
                    <v-date-picker
                        mode="range"
                        v-model="filter.appointment_date"
                        locale="vi"
                        color="green"
                        :input-props="{ placeholder: 'Ngày hẹn', style: 'font-size:14px; line-height: unset; border: 1px solid #e8e8e8;' }"
                        @keyup.enter="search"
                    />
                  </b-col>
                <b-col class="col-1-7 mb-1 placeholder-contain z-3">
                    <multi-select-department
                        :custom-class="'multiselect-ghtk multiselect-no-horizontal z-3'"
                        @handleDepartmentSelected="handleDepartmentSelected"
                        :auto-close="false"
                        :hide-selected="true">
                    </multi-select-department>
                </b-col>
                <b-col class="col-1-7 mb-1 z-3">
                    <single-select-candidate-position
                        :custom-class="'multiselect-ghtk multiselect-no-horizontal z-3'"
                        :job-id="filter.jobId" @handleChoosePosition="setJob"
                        :hrview="true"
                    >
                    </single-select-candidate-position>
                </b-col>
                <b-col class="col-1-7 mb-1 placeholder-contain z-3">
                    <v-date-picker
                        mode="range"
                        v-model="filter.created_date"
                        locale="vi"
                        color="green"
                        :input-props="{ placeholder: 'Ngày tạo', style: 'font-size:14px; line-height: unset; border: 1px solid #e8e8e8;' }"
                        @keyup.enter="search"
                    />
                </b-col>
                <b-col class="col-1-7 mb-1 z-3">
                    <single-select-user
                        class="z-5 multiselect-ghtk multiselect-no-horizontal"
                        @onChange="selectCreator"
                        placeholder="Người tạo"
                        :in-scope="true"
                    ></single-select-user>
                </b-col>
                <b-col class="col-1-7 mb-1 z-3">
                    <single-select-referral
                        class="z-3 multiselect-ghtk multiselect-no-horizontal"
                        @on-select="handleSelectedRecruitmentSource"
                        placeholder="Nguồn tuyển dụng"
                    >
                    </single-select-referral>
                </b-col>
                <b-col class="col-1-7 mb-1">
                    <b-btn variant="ghtk" id='candidate-btn-search' name='candidate-btn-search' @click="search()" style="border-radius: 5px; width: 100%"> Tìm kiếm</b-btn>
                </b-col>
              </b-row>
            </div>
        <div class="order-table row mx-0 position-relative" v-loading="loading">
            <div class="col col-12 table-content" v-if="listCandidates.length > 0">
                <ListCandidates
                    :originTags="tags"
                    :originGlobalTags="globalTags"
                    :listCandidates="listCandidates"
                    :jobId="jobId"
                    :candidateJobId="candidateJobId"
                    :permissions="permissions"
                    @reloadCandidates="reloadPage()"
                    @refreshModelTags="reloadPage()"
                    @openTagManage="openTagManage"
                    @refreshCandidate="refreshCandidate()"
                >
                </ListCandidates>
            </div>
            <div v-else class="none-result">Không tìm thấy kết quả phù hợp</div>
        </div>

        <input type="hidden" id="code-name" :value="userInfo && userInfo.User ? userInfo.User.id : null">
      <!-- Phân trang-->
        <Pagination
            :page="page"
            @changePage="changePage"
            :isUploading="isUploading"
            :fileExcelCandidateDisabled="fileExcelCandidateDisabled"
            :duty="!isHasPermission('notAdd')"
            @changeFileExcelCandidateDisabled="changeFileExcelCandidateDisabled"
            @importing="resetMessageImport"
        >
        </Pagination>
        <HrTagModalV2
            :open="openTagModal"
            :tags="tags"
            :globalTags="globalTags"
            :tableName="tableName"
            :recordId="recordId"
            :attach-permission="attachPermission"
            :scope='scope'
            @refresh="refreshHrTags"
            @refreshModelTags="reloadPage"
            @toggleTagManage="toggleTagManage"
            @action="closeTagManage()"
            @refreshCandidate="refreshCandidate()"
        />
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
    .alert-message {
        position: relative;
    }
    .alert-message__close-btn {
        position: absolute;
        top: 5px;
        right: 8px;
        color: red;
        font-size: 1rem;
        cursor: pointer;
    }
    ::placeholder {
        color: #828282;
    }
    .button-close-modal-contact {
        border-radius: 5px;
        padding: 5px 30px;
    }
    .button-deny-modal {
        width: 100px;
        border-radius: 5px;
        padding: 5px 0px;
    }
    .button-add-candidate-modal {
        width: 42%;
        border-radius: 5px;
        padding: 5px 0px;
    }
    .modal-title-contact {
        text-align: center;
        padding-top: 6px;
        padding-bottom: 6px;
        font-size: 18px;
        color: white;
        background: #069255;
    }
    .button-import-data {
        width: 150px;
        border-radius: 5px;
        padding: 5px 0;
        a {
            color: #069255 !important;
        }
        a:hover {
            color: white !important;
        };
    }
    .modal-content-contact {
        padding: 10px 30px 0px 30px;
        font-size: 16px;
        color: #000;
    }
    .modal-content-import-data {
        padding: 15px;
        color: #000;
    }
    .modal-note-candidate {
        padding: 20px;
        font-size: 16px;
        color: #000;
    }
    .candidate-info-container {
        width: 80%;
    }
    .candidate-info-action {
        width: 20%;
        text-align: right;
    }
    .candidate-info {
        width: 82%;
    }
    .image-user {
        padding: 5px 5px 5px 5px;
        width: 66px;
        height: 66px;
    }
    .image-user img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .filter-select-container {
        width: 100%;
    }
    .search-button-container {
        width: 15%;
        text-align: right;
    }
    .table-order-list {
        max-height: 75vh;
        overflow: auto;
    }
    .table td {
        border-bottom: none;
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
    }
    .status-col, .deadline-col, .action-col {
        width: 10%;
    }
    .candidate-col {
        width: 45%;
    }
    .log-col {
        width: 40%;
    }
    .action-col {
        width: 15%;
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
        text-align: center;
    }
    .header-row {
        background-color: #f1f1f1;
        font-size: 16px;
        font-weight: 500;
    }

    .candidate-tag{
      margin: 5px;
      .candidate-tag-box{
        background-color: #069255;
        color: #fff;
        text-align: center;
        display: inline-block;
        position: relative;
        margin: 5px;
        &:hover .candidate-delete-tag{
          display: block;
        }
        .candidate-tag-item{
          padding: 6px 18px;
          cursor: pointer;
        }
      }
      .candidate-status-box{
        background-color: #ccc;
        color: #fff;
        text-align: center;
        display: inline-block;
        position: relative;
        margin: 5px;
        &:hover{
          background-color: #069255;
        }
        .candidate-status-item{
          padding: 6px 10px;
          cursor: pointer;
            &.active{
            background-color: #069255;
          }
        }
      }
      .candidate-delete-tag{
        display: none;
        position: absolute;
        top: -5px;
        right: -5px;
        color: #000;
        cursor: pointer;
      }
    }
    .tag-manage{
      font-size: 0.894rem;
      padding: 6px 18px;
      color: #069255;
      border: 0;
      background: none;
      &:focus{
        box-shadow: none
      }
      .focus{
        box-shadow: none
      }
    }
    .btn-filter-tag{
      margin: 5px;
    }
    .tag-filter{
      overflow-x: auto;
      display: flex;
    }
    .none-result {
        text-align: center;
        width: 100%;
        padding: 5%;
        font-size: 18px;
    }
    .exporting-btn {
        span {
            position: relative; padding-left: 20px
        }
        .sk-folding-cube.sk-primary{
            position: absolute; height: 12px; width: 12px; top: -37px; left: 0
        }
    }
    .col-1-7 {
      width: 14.2857%;
    }

</style>

<script>
// custom component
import MultiSelectDepartment from '../../../elements/common/MultiSelectDepartment'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectDistricts from '../../../elements/common/MultiSelectDistricts'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import Datepicker from 'vuejs-datepicker'
import SingleSelectCandidatePosition from 'components/pages/Candidate/SingleSelectCandidatePosition'
import SingleSelectReferral from '../../Candidate/SingleSelectReferral'
import QuickCreateUser from 'components/pages/Candidate/ModalDriverxCreateUser'
import HrTagModalV2 from '@/components/pages/erp/HrOrder/HrTagModalV2.vue'
import MultiSelectHrTag from '@/components/elements/common/MultiSelectHrTag.vue'
import Pagination from './Pagination'
import SingleSelectUser from '../../../elements/common/SingleSelectUser'
import SingleSelectProfileRegion from '../../../elements/common/SingleSelectProfileRegion'

// service
import candidateService from 'domain/services/candidate-service'
import profileService from 'domain/services/profile-service'
import hrTagService from 'domain/services/hr-tag-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
import moment from 'moment'
import Candidate from 'domain/entities/Candidate'
import { mapGetters } from 'vuex'
import ListCandidates from './ListCandidates'

export default {
  name: 'candidate-manager',
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
    ListCandidates,
    MultiSelectProvince,
    MultiSelectDistricts,
    MultiSelectStation,
    SingleSelectProfileRegion,
    MultiSelectDepartment,
    SingleSelectCandidatePosition,
    SingleSelectReferral,
    SingleSelectUser,
    Datepicker,
    QuickCreateUser,
    HrTagModalV2,
    MultiSelectHrTag,
    Pagination
  },

  mounted () {
    helper.importLibraryTracingLogs()
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
  },

  data: _ => ({
    isActiveTab: 'all',
    noRecordNoti: '',
    idCandidateCv: null,
    ulrCvFile: '',
    exporting: false,
    exported: false,
    URLExportedFile: null,
    processorActive: false,
    currEditing: null,
    triggerEdit: false,
    typeEdit: '',
    currUser: {},
    isUploading: false,
    referralEnums: {
      facebook: 'Facebook/internet',
      web: 'Jobsite tuyển dụng',
      workfes: 'Ngày hội việc làm',
      gtvlservice: 'Dịch vụ GTVL',
      ghtk: 'Nhân viên GHTK',
      employee: 'Giới thiệu nội bộ',
      friend: 'Bạn bè, người thân',
      collabor: 'CTV tuyển dụng',
      other: 'Khác',
      outdoor: 'Quảng cáo ngoài trời'
    },
    jobId: '',
    candidateJobId: '',
    permissions: [],
    stageStatus: {
      candidate_id: null,
      status: null
    },
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
      totalItems: 0
    },
    dateFilterOptions: [
      {value: 'created', name: 'Ngày tạo hồ sơ'},
      {value: 'expected_interview_date', name: 'Ngày hẹn phỏng vấn'},
      {value: 'expected_join_date', name: 'Ngày hẹn nhận việc'}
    ],
    reasonSaveinfOption: [
      { text: 'Không liên hệ được', value: 'contact_fail' },
      { text: 'Hủy ứng tuyển', value: 'cancel_recruit' },
      { text: 'Trượt phỏng vấn', value: 'rejected' },
      { text: 'Từ chối nhận việc', value: 'refused' },
      { text: 'khác', value: 'other' }
    ],
    listCandidates: [],
    countStatus: {},
    showReffererSelection: false,
    masterIdLinkable: null,
    cv_file: null,
    dateFilterTypeOp: null,
    dateFilter: null,
    optionRegion: {
      value: 0,
      disabled: true,
      options: [
        {value: 0, text: 'Chọn tất cả'},
        {value: 10, text: 'Miền Bắc'},
        {value: 20, text: 'Miền Trung'},
        {value: 30, text: 'Miền Nam'}
      ]
    },
    filter: {
      full_name: null,
      email_phone_identity_number: null,
      region: null,
      provinceId: null,
      districtId: null,
      stationId: null,
      jobId: null,
      appointment_date: null,
      status: null,
      hr_tag_id: null,
      creator_id: null,
      recruitment_source: null,
      created_date: null,
      departmentIds: null
    },
    appointment_date: null,
    searchTag: null,
    tag: null,
    isAddTag: [],
    loading: false,
    openQuickAdd: false,
    fileExcelCandidateDisabled: [],
    tagReasons: [
      {
        name: 'Không liên hệ được',
        active: false,
        alias: 'khong-lien-he-duoc-2'
      },
      {
        name: 'Không phù hợp',
        active: false,
        alias: 'khong-phu-hop-1'
      },
      {
        name: 'Hủy ứng tuyển',
        active: false,
        alias: 'huy-ung-tuyen'
      },
      {
        name: 'Không đi phỏng vấn',
        active: false,
        alias: 'khong-di-phong-van'
      },
      {
        name: 'Không nhận việc',
        active: false,
        alias: 'khong-nhan-viec'
      }
    ],
    openTagModal: false,
    attachPermission: true,
    tags: [],
    globalTags: [],
    tableName: 'sgw_candidates',
    scope: 'private',
    recordId: null,
    candidateStatuses: [],
    candidateTags: [],
    currComment: null,
    isSuccessOrFails: false,
    messageSuccessOrFails: '',
    reasonRejectJob: null,
    reasonRejectTag: [],
    saveOk: false,
    reloadListTag: false,
    fileError: null,
    notAddCandidate: true
  }),

  created () {
    this.getTags()
    this.countCandidateByStatus()
    this.getCandidates()
    // this.countCandidateByTag()
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  watch: {
    fileExcelCandidateDisabled: function (newVal) {
      if (newVal) {
        this.importCandidates(newVal)
      }
    }
  },

  methods: {
    changeFileExcelCandidateDisabled (data) {
      this.fileExcelCandidateDisabled = data
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    changePage (e) {
      this.page.currentPage = e
      this.getCandidates()
    },

    selectCreator (option) {
      this.filter.creator_id = option ? option.id : null
    },

    handleSelectedRecruitmentSource (recruitmentSource) {
      if (recruitmentSource) {
        this.filter.recruitment_source = recruitmentSource.value
      } else {
        this.filter.recruitment_source = ''
      }
    },

    handleDepartmentSelected: function (option) {
      this.filter.departmentIds = option ? option.map((item) => item.id).toString() : ''
    },

    async getCandidates () {
      this.loading = true
      this.filter.page = this.page.currentPage
      this.filter.limit = this.page.per_page

      const params = {
        ...this.filter,
        page: this.page.currentPage,
        limit: this.page.perPage
      }

      try {
        const {data} = await candidateService.getCandidateListV2(params)
        if (data.success) {
          this.page.totalItems = data.count
          this.listCandidates = data.data
          this.permissions = data.permission
        } else {
          helper.showMessage(data.message || 'Không thuộc vùng quản lý !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.jobId = ''
        this.candidateJobId = ''
        this.$nextTick(() => {
          this.loading = false
        })
      }
    },

    resetModal () {
      this.curCandidate = {}
      this.currComment = null
      this.jobId = ''
      this.candidateJobId = ''
    },

    async quickCreateCandidate (reqData) {
      try {
        const {data} = await candidateService.quickCreateCandidate(reqData)
        if (data.success) {
          this.getCandidates(this.filter)
          helper.showMessage('Thành công!', 'success')
          this.openQuickAdd = false
        } else helper.showMessage(data.message, 'warning')
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      }
    },
    canEditExpectJoin (candidate) {
      if (!candidate) return false
      return ['expect_join', 'interview'].includes(candidate.status)
    },

    updateCandidate (updated) {
      for (let i = 0; i < this.listCandidates.length; i++) {
        if (this.listCandidates[i].id === updated.id) this.listCandidates[i] = updated
        this.$forceUpdate()
        return
      }
    },

    clearSource () {
      this.currEditing.source = null
    },

    toggleDetail (candidate) {
      candidate.showDetail = !candidate.showDetail
      candidate.showProcessor = candidate.showDetail
      this.$forceUpdate()
    },

    toggleResignInfo (candidate) {
      candidate.showResignInfo = !candidate.showResignInfo
      this.$forceUpdate()
    },

    resetExport () {
      this.exporting = false
      this.exported = false
      this.URLExportedFile = null
    },

    redirectToLinkMasterProfile () {
      if (this.masterIdLinkable !== undefined && this.masterIdLinkable !== null) {
        this.$router.push({name: 'edit-master-profile', params: {id: this.masterIdLinkable}})
      }
    },

    redirectToMasterProfile (candidate) {
      let dataCandidate = {}
      if (candidate.id) {
        dataCandidate['id'] = candidate.id
      }
      if (candidate.name) {
        dataCandidate['name'] = candidate.name
      }
      if (candidate.birthday) {
        dataCandidate['birthday'] = candidate.birthday
      }
      if (candidate.mail) {
        dataCandidate['mail'] = candidate.mail
      }
      if (candidate.phone) {
        dataCandidate['phone'] = candidate.phone
      }
      if (candidate.gender) {
        dataCandidate['gender'] = candidate.gender
      }
      if (candidate.identify_id) {
        dataCandidate['identify_id'] = candidate.identify_id
      }
      if (candidate.type_marriage_name) {
        dataCandidate['marital_status_name'] = candidate.type_marriage_name
      }
      if (candidate.province_now_id) {
        dataCandidate['province_now_id'] = candidate.province_now_id
      }
      if (candidate.district_now_id) {
        dataCandidate['district_now_id'] = candidate.district_now_id
      }
      if (candidate.subdistrict_now_id) {
        dataCandidate['subdistrict_now_id'] = candidate.subdistrict_now_id
      }
      if (candidate.detail_now) {
        dataCandidate['detail_now'] = candidate.detail_now
      }
      if (candidate.province_household_id) {
        dataCandidate['province_household_id'] = candidate.province_household_id
      }
      if (candidate.district_household_id) {
        dataCandidate['district_household_id'] = candidate.district_household_id
      }
      if (candidate.subdistrict_household_id) {
        dataCandidate['subdistrict_household_id'] = candidate.subdistrict_household_id
      }
      if (candidate.detail_household) {
        dataCandidate['detail_household'] = candidate.detail_household
      }
      if (candidate.province_register_id) {
        dataCandidate['province_register_id'] = candidate.province_register_id
      }
      if (candidate.district_register_id) {
        dataCandidate['district_register_id'] = candidate.district_register_id
      }
      if (candidate.province_grant_identify_id) {
        dataCandidate['province_grant_identify_id'] = candidate.province_grant_identify_id
      }
      if (candidate.date_grant_identify_id) {
        dataCandidate['date_grant_identify_id'] = candidate.date_grant_identify_id
      }
      if (candidate.academy_level) {
        dataCandidate['academy_level'] = candidate.academy_level
      }
      if (candidate.type_marriage_name) {
        dataCandidate['type_marriage_name'] = candidate.type_marriage_name
      }
      if (this.curCandidate) {
        dataCandidate['status'] = this.curCandidate.status || candidate.status
        dataCandidate['evaluate'] = this.curCandidate.evaluate
      }

      sessionStorage.setItem('candidate', JSON.stringify(dataCandidate))
      if (this.blankMode) {
        let routeData = this.$router.resolve({name: 'add-master-profile'})
        window.open(routeData.href, '_blank')
        return
      }

      this.$router.push({name: 'add-master-profile'})
    },

    createMasterProfile (candidate) {
      this.masterIdLinkable = null
      if (candidate.identify_id) {
        let dataSend = {
          'field': 'personal_id_number',
          'value': candidate.identify_id
        }
        profileService.existedFieldValue(dataSend)
          .then(response => {
            if (response.data.success) {
              if (response.data.exist) {
                this.masterIdLinkable = response.data.data

                let dataSend = {
                  'candidate_id': candidate.id,
                  'master_id': this.masterIdLinkable
                }

                candidateService.existedMasterProfile(dataSend)
                  .then(res => {
                    if (res.data.success) {
                      if (res.data.data) {
                        alert('Đã tồn tại ứng viên liên kết đến Master Profile có cùng số CMND/CCCD này')
                      } else {
                        this.$refs.refLinkModal.show()
                      }
                    }
                  })
              } else {
                this.redirectToMasterProfile(candidate)
              }
            } else {
              alert('Đã có lỗi xảy ra, vui lòng thử lại.')
            }
          })
      } else {
        this.redirectToMasterProfile(candidate)
      }
    },

    resetMessageImport () {
      this.isSuccessOrFails = false
      this.messageSuccessOrFails = null
      this.fileError = null
    },

    importCandidates (file) {
      if (file && file.name) {
        let fileExtension = file.name.split('.').pop()
        if (fileExtension !== 'xlsx') {
          alert('Bạn phải upload file định dạng .xlsx!')
          return
        }
        this.fileError = null
        this.isUploading = true
        let dataSend = new FormData()
        dataSend.append('file_upload', file)
        candidateService.importCandidateList(dataSend)
          .then(res => {
            if (res.data.success) {
              helper.showMessage(res.data.message, 'success')
              this.checkJobImportStatus(res.data.data.id_job)
            } else {
              this.isUploading = false
              helper.showMessage(res.data.message, 'warning')
            }
          })
          .catch(e => {
            this.isUploading = false
            console.log(e)
          })
          .finally(_ => {
            this.fileExcelCandidateDisabled = null
          })
      }
    },

    checkJobImportStatus (jobId) {
      if (!jobId) helper.showMessage('Đã có lỗi xảy ra', 'warning')
      let getJobStat = setInterval(() => {
        profileService.checkJobImportStatus({job_id: jobId})
          .then(response => {
            if (response.data.success) {
              var dataAll = response.data.data
              if (dataAll.job_status === 'closed') {
                clearInterval(getJobStat)
                helper.showMessage('Đã import xong file dữ liệu', 'success')
                this.isUploading = false
                this.isSuccessOrFails = true
                this.messageSuccessOrFails = dataAll.message
                if (dataAll.data.url_error && dataAll.data.url_error.length > 0) {
                  helper.showMessage('Có dữ liệu lỗi khi import ứng viên, vui lòng tải file có dữ liệu lỗi!')
                  this.fileError = dataAll.data.url_error
                }
                this.fileExcelCandidateDisabled = null
                this.$bvModal.hide('modal-import-data-candidate')
                document.body.scrollTop = document.documentElement.scrollTop = 0 // Scroll lên đầu trang nơi có thông báo sau khi upload thành công
              }
            } else {
              helper.showMessage(response.data.message, 'warning')
              clearInterval(getJobStat)
              this.isUploading = false
              this.fileExcelCandidateDisabled = null
            }
          })
      }, 2000)
    },

    showHideProcessor (candidate) {
      candidate.showProcessor = !candidate.showProcessor
      this.$forceUpdate()
    },

    openModalCandidate (type, candidate) {
      this.$router.push({name: 'add-candidate'})
    },

    updateStageStatus (candidate) {
      if (this.stageStatus.candidate_id !== candidate.id) {
        this.stageStatus.candidate_id = candidate.id
        this.stageStatus.status = candidate.status
      }
    },

    moment: function (data) {
      return moment(data)
    },

    getCurrUser () {
      candidateService.getCurrUser()
        .then(res => {
          if (res.data.success) {
            this.currUser = res.data.data
          }
        }).catch(e => {
          console.log(e)
        })
    },

    overdate (candidate) {
      if (!candidate || !['interview', 'expect_join'].includes(candidate.status)) return false
      if (candidate.status === 'interview') return moment(candidate.expected_interview_date).add(1, 'days').isBefore()
      if (candidate.status === 'expect_join') return moment(candidate.expected_join_date).add(1, 'days').isBefore()
    },

    addLog (candidateIdx, log) {
      if (!log) return
      if (isNaN(candidateIdx) || candidateIdx < 0 || !this.listCandidates[candidateIdx].id) return
      this.listCandidates[candidateIdx].logs.push(log)
    },

    resetOrder () {
      this.filter.orderField = null
      this.filter.orderType = null
    },

    getCandidateStatusName (status) {
      let candidate = new Candidate()
      return candidate.getStatusName(status)
    },

    getCandidateStatusClass (status) {
      let candidate = new Candidate()
      return candidate.getStatusClass(status)
    },

    async updateAppointmentDate (candidate, date) {
      if (date) date = moment(date).format('YYYY-MM-DD')
      let dateType = ''
      if (candidate.status === 'expect_join') dateType = 'ngày hẹn nhận việc'
      if (candidate.status === 'interview') dateType = 'ngày hẹn phỏng vấn'
      await candidateService.updateAppointmentDate({
        id: candidate.id,
        date: date || null
      })
        .then(res => {
          if (res.data.success) {
            if (candidate.status === 'expect_join') candidate.expected_join_date = date
            if (candidate.status === 'interview') candidate.expected_interview_date = date
            helper.showMessage(date ? `${dateType} mới: ${moment(date).format('DD-MM-YYYY')}` : `${dateType} đã xóa`, 'success', 'Cập nhật thành công')
          } else {
            helper.showMessage(`không cập nhật được ${dateType}`, 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
      this.$forceUpdate()
    },

    setJob (job) {
      this.filter.jobId = job ? job.id : null
    },

    exportCvCandidate (idCandidate) {
      if (!idCandidate) {
        helper.showMessage('Không có ID ứng viên')
        return
      }
      this.idCandidateCv = idCandidate
      window.open('/admin/manage-candidates/exportCvCandidate?id_candidate=' + idCandidate, '_blank')
    },

    expectJoinFrom (applyDate) {
      if (!applyDate) return
      applyDate = new Date(applyDate)
      applyDate.setDate(applyDate.getDate() - 1)
      return applyDate
    },

    canSendSms (candidate) {
      return (['expect_join', 'contact_fail', 'interview'].includes(candidate.status)) &&
        (!candidate.sentSms || candidate.sentSms !== candidate.status) &&
        !+candidate.master_profile_id
    },

    showModalSmsContent (candidateIdx = -1) {
      if (!isNaN(candidateIdx) && candidateIdx > -1 && this.listCandidates[candidateIdx]) {
        this.curCandidate.idx = candidateIdx
        this.curCandidate.candidate_id = this.listCandidates[candidateIdx].id
        this.curCandidate.status = this.listCandidates[candidateIdx].status
        this.curCandidate.evaluate = null
        this.curCandidate.reason_saveinfo = null
        this.curCandidate.apply_date = this.listCandidates[candidateIdx].apply_date || this.listCandidates[candidateIdx].created
      }
      if (!this.listCandidates[this.curCandidate.idx] || !this.canSendSms(this.listCandidates[this.curCandidate.idx])) return
      this.$bvModal.show('modal-send-sms')
    },

    canQuickCreateAcc (candidate) {
      if ([1, 2, 3, 25].includes(parseInt(candidate.jobId))) return false
      if (!candidate) return false
      return (candidate.status === 'take_job' || candidate.status === 'expect_join') && !candidate.master_profile_id && +candidate.job_id === 1
    },

    showOriginTel (candidateIndex) {
      this.listCandidates[candidateIndex].phone_display = this.listCandidates[candidateIndex].phone_origin
    },

    handleProvinceSelected (ops) {
      this.filter.provinceId = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleSelectedLocation (options) {
      this.filter.districtId = options ? options.map((item) => item.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.stationId = ops ? ops.map(item => item.id).toString() : ''
    },

    async onDetach (candidate, tag) {
      try {
        if (confirm('Bạn có chắc muốn bỏ gắn tag ' + tag.name + ' ?')) {
          const {data} = await hrTagService.detach({
            table_name: this.tableName,
            record_id: candidate.id,
            hr_tag_id: tag.id
          })

          if (data.success) {
            await this.reloadPage()
          } else {
            helper.showMessage(data.data.message, 'warning')
          }
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
      }
    },

    openTagManage (candidate) {
      this.recordId = candidate ? candidate.id : null
      this.attachPermission = !!candidate
      this.openTagModal = true
    },

    closeTagManage () {
      this.recordId = null
      this.openTagModal = false
    },

    async getTags () {
      this.reloadListTag = true
      try {
        const {data} = await hrTagService.getList({
          scope: 'private',
          table_name: 'sgw_candidates'
        })

        this.tags = data.success ? data.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            table_name: item.table_name
          }
        }) : []

        const gData = await hrTagService.getList({
          scope: 'global',
          table_name: 'sgw_candidates'
        })

        this.globalTags = gData.data.success ? gData.data.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            table_name: item.table_name
          }
        }) : []
      } catch (e) {
        console.log(e.getMessage())
      } finally {
        this.reloadListTag = false
      }
    },

    async countCandidateByStatus () {
      try {
        const {data} = await candidateService.countCandidateByStatus(this.filter)
        this.candidateStatuses = data.data
      } catch (e) {
        console.log(e)
      } finally {
      }
    },

    async countCandidateByTag () {
      try {
        const {data} = await candidateService.countCandidateByTag(this.filter)
        this.candidateTags = data.data
      } catch (e) {
      } finally {
      }
    },

    async refreshHrTags () {
      await this.getTags()
    },

    async reloadPage () {
      await this.countCandidateByStatus()
      await this.getCandidates()
    },

    toggleTagManage (recordId, state) {
      this.recordId = recordId
      this.openTagModal = state
    },

    refreshCandidate () {
      this.filter = {
        full_name: null,
        email_phone_identity_number: null,
        region: null,
        provinceId: null,
        districtId: null,
        stationId: null,
        jobId: null,
        appointment_date: null,
        status: null,
        hr_tag_id: null,
        departmentIds: null
      }
      this.getCandidates()
    },

    handleSelectedRegion (option) {
      this.filter.region = option ? option.id : null
    },

    searchByStatus (value, currentIndex) {
      this.filter.hr_tag_id = null
      this.filter.status = value
      this.isActiveTab = currentIndex
      this.getCandidates(this.filter)
    },

    searchByTag (value, currentIndex) {
      this.filter.hr_tag_id = value
      this.filter.status = null
      this.isActiveTab = currentIndex
      this.getCandidates(this.filter)
    },

    searchAll () {
      this.filter.hr_tag_id = null
      this.filter.status = null
      this.isActiveTab = 'all'
      this.getCandidates(this.filter)
    },

    handleHrTagSelected (values) {
      this.filter.hr_tag_id = values.map((value) => {
        return value.id
      })
    },

    search () {
      this.countCandidateByStatus()
      this.getCandidates()
    },

    isHasPermission (action) {
      return this.permissions.includes(action)
    }
  }
}
</script>
