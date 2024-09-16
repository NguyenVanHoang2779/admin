<template>
  <div>
    <div class="d-none d-md-block main-content candidate_management_page">
      <div v-if="isSuccessOrFails" class="col-12 justify-content-center mt-3 mb-3">
        <b-alert variant="success" show class="alert-message">
          <div>{{ messageSuccessOrFails }}</div>
          <div style="color: red" v-if="importError">
            <b-button class="tag-manage" pill variant="outline-secondary" @click="downLoadErrorFile()"> Tải tệp lỗi</b-button>
          </div>
          <i class="fas fa-times alert-message__close-btn" @click="resetMessageImport"></i>
        </b-alert>
      </div>
      <b-row class="mx-0 header my-2 align-items-center">
        <b-col md="4" >
          <h4 class="m-0">Tuyển dụng</h4>
        </b-col>
        <b-col md="8" class="text-right">
          <b-btn
            v-for="(candidateStatus, index) in candidatesByStatuses" :key="'status'+index"
            :variant="currentCandidateStatus === candidateStatus.name ? 'ghtk' : 'outline-ghtk-color-custom'"
            class="btn-radius pd-5 btn-filter-tag"
            :id="'candidate-btn-' + candidateStatus.name"
            :name="'candidate-btn-' + candidateStatus.name"
            @click="searchByStatus(candidateStatus.name)"
          >
            {{ candidateStatus.label }} ({{ candidateStatus.count }})
          </b-btn>
          <b-button class="tag-manage" pill variant="outline-secondary" @click="openTagManage()">+ Tag</b-button>
        </b-col>
      </b-row>
      <div class="filter-select-container">
        <b-row class="mx-0 filter pb-1">
          <b-col class="col-1-7 mb-1 placeholder-contain z-5">
            <input
              placeholder="Họ tên"
              v-model="filter.name"
              class="form-control"
              style="border-radius: 4px; border: 1px solid #e8e8e8 !important "
            />
          </b-col>
          <b-col class="col-1-7 mb-1 placeholder-contain z-5">
            <input
              placeholder="SĐT, Email"
              v-model="filter.email_or_phone"
              class="form-control"
              @keyup.enter="search()"
              style="border-radius: 4px; border: 1px solid #e8e8e8 !important "
            />
          </b-col>
          <b-col class="col-1-7 mb-1 placeholder-contain z-5">
            <input
              placeholder="CMND/CCCD"
              v-model="filter.card_id"
              class="form-control"
              @keyup.enter="search()"
              style="border-radius: 4px; border: 1px solid #e8e8e8 !important "
            />
          </b-col>
          <b-col class="col-1-7 mb-1 placeholder-contain z-5">
            <single-select-profile-region
              class="z-5 multiselect-ghtk multiselect-no-horizontal"
              :placeholder="'Chọn miền'"
              :multiple="true"
              @handleSelectedRegion="handleRegionsSelected"
            >
            </single-select-profile-region>
          </b-col>
          <b-col class="col-1-7 mb-1 z-5">
            <multi-select-province
              :customClass="'z-5 multiselect-ghtk multiselect-no-horizontal'"
              :region="filter.regions"
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
              :province-id="filter.provinces"
              :district-id="filter.districts"
            >
            </multi-select-districts>
          </b-col>
          <b-col class="col-1-7 mb-1 z-5">
            <multi-select-station
              :customClass="'z-5 multiselect-ghtk multiselect-no-horizontal'"
              :auto-close="true"
              :hide-select="true"
              @handleStationSelected="handleStationSelected"
            ></multi-select-station>
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
          <b-col class="col-1-7 mb-1 z-3">
            <SelectJob
              :multiple="true"
              @selected-option-changed="handlePositionsSelected"
            >
            </SelectJob>
          </b-col>
          <b-col class="col-1-7 mb-1 placeholder-contain z-3">
            <multiselect
              placeholder="Trạng thái hồ sơ"
              label="text"
              track-by="key"
              v-model="filter.document_status"
              :options="optionsDocumentStatus"
              open-direction="bottom"
              selectLabel=""
              selectedLabel="Chọn"
              deselectLabel="x"
              :allow-empty="true"
            >
            </multiselect>
          </b-col>
          <b-col class="col-1-7 mb-1 placeholder-contain z-3">
            <v-date-picker
              mode="range"
              v-model="filter.created_at"
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
              :multiple="true"
              :in-scope="true"
            ></single-select-user>
          </b-col>
          <b-col class="col-1-7 mb-1 z-3">
            <SelectSourceRecruitment
              class="z-3 multiselect-ghtk multiselect-no-horizontal"
              :multiple="true"
              @handleSourceSelected="handleSourcesSelected"
            >
            </SelectSourceRecruitment>
          </b-col>
          <b-col class="col-1-7 mb-1 z-3">
            <SelectTag
              :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
              :placeholder="'Tag ứng viên'"
              :type="'getJob'"
              @handleTagsSelected="handleTagsSelected"
            >
            </SelectTag>
          </b-col>
        </b-row>
        <div class="row justify-content-center mb-2">
          <div class="col-md-2">
            <b-btn variant="ghtk" id='candidate-btn-search' name='candidate-btn-search' @click="search()" style="border-radius: 5px; width: 100%"> Tìm kiếm</b-btn>
          </div>
        </div>
      </div>
      <div class="order-table row mx-0 position-relative" v-loading="loading">
        <div class="col col-12 table-content" style="max-height: 75vh; overflow: auto" v-if="listCandidates.length > 0">
          <ListCandidate
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
            @openTagOfCandidate="openTagManage"
          >
          </ListCandidate>
        </div>
        <div v-else class="none-result">Không tìm thấy kết quả phù hợp</div>
      </div>

      <input type="hidden" id="code-name" :value="userInfo && userInfo.User ? userInfo.User.id : null">

      <!-- Phân trang-->
      <div class="paging mt-3 d-flex">
        <div style="width: 85%">
          <div>
            <b class="float-left">Trang {{ page.currentPage }}/{{ Math.ceil(page.totalItems/page.perPage) }}</b>
          </div>
          <div class="z-0 d-inline-block paginator-ghtk ml-2">
            <b-pagination
              class="mb-1"
              size="sm"
              align="left"
              v-model="page.currentPage"
              :total-rows="page.totalItems"
              :per-page="page.perPage"
              @input="changePage()"
            >
            </b-pagination>
          </div>
        </div>
        <div class="search-button-container">
          <b-row class="mx-0 filter pb-1 border-bottom">
            <b-col :md="showQr ? 6 : 12" class="text-right">
              <b-btn right variant="ghtk" class="float-right" style="border-radius: 5px" @click="openModalAddCandidate">
              <span slot="button-content">
                <i class="fas fa-plus"></i> Thêm ứng viên
              </span>
              </b-btn>
            </b-col>
            <b-col md="6" class="text-right" v-if="showQr">
              <b-btn right variant="ghtk" class="float-right" style="border-radius: 5px" @click="openModalReferralCandidate">
              <span slot="button-content">
                <i class="fa fa-qrcode"></i> Mã cá nhân
              </span>
              </b-btn>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
    <CandidateTagModal
      :record-id="curCandidate.id"
      :tags-candidate="curCandidate.tags"
      @attach="pushTagToCandidate"
    ></CandidateTagModal>
    <ModalAddCandidate @openModalImportData="openModalImportData"></ModalAddCandidate>
    <ModalReferralCandidate :referralInfo="referralInfo" v-if="showQr"></ModalReferralCandidate>
    <ModalImportData
      :isUploading="isUploading"
      :fileExcelCandidateDisabled="fileExcelCandidateDisabled"
      @changeFileExcelCandidateDisabled="changeFileExcelCandidateDisabled"
    >
    </ModalImportData>
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
import MultiSelectDepartment from '../../../../elements/common/MultiSelectDepartment.vue'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectDistricts from '../../../../elements/common/MultiSelectDistricts.vue'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import Datepicker from 'vuejs-datepicker'
import SingleSelectCandidatePosition from 'components/pages/Candidate/SingleSelectCandidatePosition'
import SingleSelectReferral from '../../../Candidate/SingleSelectReferral.vue'
import QuickCreateUser from 'components/pages/Candidate/ModalDriverxCreateUser'
import HrTagModalV2 from '@/components/pages/erp/HrOrder/HrTagModalV2.vue'
import MultiSelectHrTag from '@/components/elements/common/MultiSelectHrTag.vue'
import SingleSelectUser from '../../../../elements/common/SingleSelectUser.vue'
import SingleSelectProfileRegion from '../../../../elements/common/SingleSelectProfileRegion.vue'
import ListCandidate from './ListCandidate.vue'
import CandidateTagModal from './ModalCandidateTag.vue'
import SingleSelectPosition from '../../../Position/SingleSelectPosition.vue'
import SelectTag from './SelectTag.vue'
import SelectJob from './SelectJob.vue'

// service
import profileService from 'domain/services/profile-service'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'

// entities
import moment from 'moment'
import Candidate from 'domain/entities/Candidate'
import { mapGetters } from 'vuex'
import SelectSourceRecruitment from './SelectSourceRecruitment.vue'
import ModalAddCandidate from './ModalAddCandidate.vue'
import ModalImportData from './ModalImportData.vue'
import ModalReferralCandidate from './ModalReferralCandidate.vue'
import Multiselect from 'vue-multiselect'

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
    Multiselect,
    ModalReferralCandidate,
    ModalAddCandidate,
    SingleSelectPosition,
    ListCandidate,
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
    CandidateTagModal,
    SelectTag,
    SelectSourceRecruitment,
    SelectJob,
    ModalImportData
  },

  mounted () {
    helper.importLibraryTracingLogs()
  },

  beforeDestroy () {
    helper.removeLibraryTracingLogs()
  },

  data: function () {
    return {
      processKey: null,
      currentCandidateStatus: 'all',
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
      optionsDocumentStatus: [
        {key: 0, text: 'Thiếu hồ sơ'},
        {key: 1, text: 'Đủ hồ sơ'}
      ],
      filter: {
        name: null,
        card_id: null,
        email_or_phone: null,
        regions: null,
        provinces: null,
        districts: null,
        stations: null,
        positions: null,
        job_id: null,
        appointment_date: null,
        status: null,
        tags: null,
        created_by: null,
        source: null,
        created_at: null,
        departments: null,
        document_status: null
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
      candidatesByStatuses: [],
      candidateTags: [],
      currComment: null,
      isSuccessOrFails: false,
      messageSuccessOrFails: '',
      reasonRejectJob: null,
      reasonRejectTag: [],
      saveOk: false,
      reloadListTag: false,
      importError: false,
      notAddCandidate: true,
      curCandidate: {
        id: null,
        tags: null
      },
      referralInfo: {
        referralCode: '',
        referralQr: ''
      },
      showQr: false
    }
  },

  created () {
    this.getReferralCode()
    this.countCandidateByStatus()
    this.getCandidates()
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
    async getReferralCode () {
      try {
        const {data} = await recruitmentService.getReferralCandidate()
        if (data.success) {
          this.referralInfo.referralCode = data.data.referral_code
          this.referralInfo.referralQr = data.data.referral_qr
          this.showQr = true
        } else {
          this.showQr = false
        }
      } catch (e) {
        console.log(e)
        this.showQr = false
      }
    },
    openModalImportData () {
      this.$bvModal.hide('modal-add-candidate')
      this.$bvModal.show('modal-import-data-candidate')
    },
    pushTagToCandidate (tag) {
      let candidate = this.listCandidates.find((element) => element.id === tag.candidate_id)
      candidate.tags.push({
        tag_id: tag.tag_id,
        name: tag.tag_name,
        type: tag.tag_type
      })
    },

    changeFileExcelCandidateDisabled (data) {
      this.fileExcelCandidateDisabled = data
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    changePage () {
      this.getCandidates()
    },

    openModalAddCandidate () {
      this.$bvModal.show('modal-add-candidate')
    },

    openModalReferralCandidate () {
      this.$bvModal.show('modal-referral-candidate')
    },

    selectCreator (option) {
      this.filter.created_by = option ? option.map((item) => item.id) : null
    },
    handleSelectedRecruitmentSource (recruitmentSource) {
      if (recruitmentSource) {
        this.filter.source = recruitmentSource.value
      } else {
        this.filter.source = ''
      }
    },

    handleDepartmentSelected: function (option) {
      this.filter.departments = option ? option.map((item) => item.id) : null
    },

    handlePositionsSelected: function (option) {
      this.filter.job_id = option ? option.map((item) => item.id) : null
    },

    formatDatetimeRange (datetime, dateOny = true) {
      let format = dateOny ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return [
        moment(datetime.start).format(format),
        moment(datetime.end).format(format)
      ]
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

      if (this.filter.document_status) {
        params.document_status = this.filter.document_status.key
      }

      if (params.appointment_date) {
        params.appointment_date = this.formatDatetimeRange(params.appointment_date)
      }

      if (params.created_at) {
        params.created_at = this.formatDatetimeRange(params.created_at, false)
      }

      Object.keys(params).forEach(key => {
        if (params[key] === null) {
          delete params[key]
        }
      })

      try {
        const {data} = await recruitmentService.getCandidates(params)
        if (data.success) {
          this.page.totalItems = data.total
          this.page.totalPages = data.last_page
          this.listCandidates = data.data
          this.permissions = data.permission
        } else {
          this.page.totalItems = 0
          this.page.totalPages = 0
          this.listCandidates = []
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
        const {data} = await recruitmentService.quickCreateCandidate(reqData)
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

                recruitmentService.existedMasterProfile(dataSend)
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
      this.importError = false
      this.processKey = null
    },

    importCandidates (file) {
      if (file && file.name) {
        let fileExtension = file.name.split('.').pop()
        if (fileExtension !== 'xlsx') {
          alert('Bạn phải upload file định dạng .xlsx!')
          return
        }
        this.importError = false
        this.isUploading = true
        let dataSend = new FormData()
        dataSend.append('excel_file', file)
        recruitmentService.import(dataSend)
          .then(res => {
            if (res.data.success) {
              helper.showMessage('Vui lòng đợi để lấy kết quả', 'warning')
              this.checkJobImportStatus(res.data.data.process_key)
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

    checkJobImportStatus (processKey) {
      if (!processKey) helper.showMessage('Đã có lỗi xảy ra', 'warning')
      this.processKey = processKey
      let getJobStat = setInterval(() => {
        recruitmentService.getProcessImport({process_key: processKey})
          .then(response => {
            if (response.data.success) {
              if (response.data.data.import_done) {
                var dataAll = response.data.data
                clearInterval(getJobStat)
                helper.showMessage('Đã import xong file dữ liệu', 'success')
                this.isUploading = false
                this.isSuccessOrFails = true
                this.messageSuccessOrFails = 'Import thành công: ' + dataAll.total_success + '/' + dataAll.total
                if (+dataAll.total_success < +dataAll.total) {
                  this.importError = true
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
      recruitmentService.getCurrUser()
        .then(res => {
          if (res.data.success) {
            this.currUser = res.data.data
          }
        }).catch(e => {
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
      await recruitmentService.updateAppointmentDate({
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

    setJob (ops) {
      this.filter.positions = ops ? ops.map((item) => item.id).toString() : null
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
      if ([1, 2, 3, 25].includes(parseInt(candidate.job_id))) return false
      if (!candidate) return false
      return (candidate.status === 'take_job' || candidate.status === 'expect_join') && !candidate.master_profile_id && +candidate.job_id === 1
    },

    showOriginTel (candidateIndex) {
      this.listCandidates[candidateIndex].phone_display = this.listCandidates[candidateIndex].phone_origin
    },

    handleProvinceSelected (ops) {
      this.filter.provinces = ops ? ops.map((item) => item.id) : null
    },

    handleSelectedLocation (options) {
      this.filter.districts = options ? options.map((item) => item.id) : null
    },

    handleStationSelected (ops) {
      this.filter.stations = ops ? ops.map(item => item.id) : null
    },

    openTagManage (candidate) {
      if (candidate) {
        this.curCandidate = candidate
      }
      this.$bvModal.show('candidate-tag-modal')
    },

    closeTagManage () {
      this.recordId = null
      this.openTagModal = false
    },

    async countCandidateByStatus () {
      try {
        let params = {
          ...this.filter
        }

        if (this.filter.document_status) {
          params.document_status = this.filter.document_status.key
        }

        if (params.appointment_date) {
          params.appointment_date = this.formatDatetimeRange(params.appointment_date)
        }

        if (params.created_at) {
          params.created_at = this.formatDatetimeRange(params.created_at, false)
        }

        if (params.status) {
          delete params.status
        }

        const {data} = await recruitmentService.countCandidatesByStatus(params)
        this.candidatesByStatuses = data.data
      } catch (e) {
        console.log(e)
      } finally {
      }
    },

    async countCandidateByTag () {
      try {
        const {data} = await recruitmentService.countCandidateByTag(this.filter)
        this.candidateTags = data.data
      } catch (e) {
      } finally {
      }
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
        name: null,
        email_or_phone: null,
        region: null,
        provinces: null,
        districts: null,
        stations: null,
        job_id: null,
        appointment_date: null,
        status: null,
        hr_tag_id: null,
        departments: null
      }
      this.getCandidates()
    },

    searchByStatus (value) {
      if (value === 'all') {
        this.filter.status = null
      } else {
        this.filter.status = [value]
      }
      this.currentCandidateStatus = value
      this.getCandidates(this.filter)
    },

    searchByTag (value, currentIndex) {
      this.filter.hr_tag_id = value
      this.filter.status = null
      this.currentCandidateStatus = currentIndex
      this.getCandidates(this.filter)
    },

    searchAll () {
      this.filter.hr_tag_id = null
      this.filter.status = null
      this.currentCandidateStatus = 'all'
      this.getCandidates(this.filter)
    },

    handleTagsSelected (values) {
      this.filter.tags = values.map((value) => {
        return value.id
      })
    },

    handleSourcesSelected (values) {
      this.filter.source = values.map((value) => {
        return value.id
      })
    },

    handleRegionsSelected (values) {
      this.filter.regions = values.map((value) => {
        return value.id
      })
    },

    search () {
      this.countCandidateByStatus()
      this.getCandidates()
    },

    downLoadErrorFile () {
      recruitmentService.exportLogCandidateImport({process_key: this.processKey})
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'data.xlsx')
          document.body.appendChild(link)
          link.click()
        }).catch(async (error) => {
          let responseText = await error.response.data.text()
          if (error) {
            let responseObj = JSON.parse(responseText)
            helper.showMessage(responseObj.message || 'Có lỗi xảy ra. Hãy thử lại nhé!', 'warning')
          }
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    }
  }
}
</script>
