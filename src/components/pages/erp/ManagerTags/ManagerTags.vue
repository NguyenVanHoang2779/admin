<template>
  <div class="d-none d-md-block main-content">
    <div class="mx-0 my-2 row">
      <div class="col-6 input-filter header-padding text-center-y">
        <div class="d-flex w-100 manage-cus">
          <div class="employee-cus" style="align-items: baseline">
            <div class="m-0 font-weight-bold"><router-link class="link action-toggle--not-active" :to="'/staff-work/staff-management'">
              Quản lý nhân viên
            </router-link></div>
          </div>
          <div class="tag-cus" style="align-items: baseline">
            <div class="m-0">Quản lý Tags</div>
          </div>
        </div>
      </div >
      <div class="col-6 text-right tab-class-action">
        <div class="px-1 d-inline-block cusBtn">
          <b-btn
            :variant="'outline-cus'"
            class="rounded pd-5 w-100"
            @click="onOpenModal({nameModal: 'TopicModal', type: 'Add', options: {}})">
            <span><i class="ion ion-ios-add mr-2"></i>Chủ đề</span>
          </b-btn>
        </div>
      </div>
    </div>
    <!-- filter  -->
    <div class="mx-0 filter pb-1 row z-3" style="margin-top: 0.7rem; margin-bottom: 0.7rem;">
      <div class="mb-1 input-filter pr-1">
        <multi-select-topics
          ref="resetListTopic"
          class="multiselect-ghtk multiselect-no-horizontal"
          :auto-close="true"
          :disabled="false"
          :list-topic-id="listTopicId"
          :add-data-topic="dataTopicSuccess"
          @handleSelectedTopic="handleSelectedTopic"
        >
        </multi-select-topics>
      </div>
      <div class="mb-1 input-filter pl-2 pr-1">
        <multi-select-department
          :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
          :auto-close="true"
          :is-multiple="false"
          :placeholder="'Bộ phận'"
          :department-ids="param.department_ids"
          @handleDepartmentSelected="handleDepartmentSelected">
        </multi-select-department>
      </div>
      <div class="mb-1 input-filter pl-2 pr-1">
        <MultiSelectPosition
          class="multiselect-ghtk multiselect-no-horizontal"
          :is-multiple="false"
          :position-ids="param.positions"
          :department-ids="param.department_ids"
          :auto-close="true"
          :hide-selected="true"
          placeholder="Vị trí"
          @handlePositionSelected="handlePositionSelected"
        />
      </div>
      <div class="mb-1 input-filter pl-2 pr-2">
        <multi-select-tags
          class="multiselect-ghtk multiselect-no-horizontal"
          :auto-close="true"
          :disabled="false"
          :list-position-id="param.positions"
          :list-tag-id="listTagId"
          @handleSelectedTag="handleSelectedTag"
        >
        </multi-select-tags>
      </div>
      <div class="mb-1 input-filter pr-3 pl-1">
        <b-btn variant="ghtk" @click="search()" class="filter-containter__btn-search btn-header-class"> Tìm kiếm</b-btn>
      </div>
    </div>

    <!-- Table data  -->
    <div class="table-data cusTable mr-3" id="tableTags">
<!--      header-->
      <div class="text-left title-table">
        <div class="w-7 text-black th-cus"><div style="margin-left: auto !important;">Chủ đề</div></div>
        <div class="w-7 text-black th-cus"><div>Bộ phận</div></div>
        <div class="w-7 text-black th-cus"><div>Vị trí</div></div>
        <div class="w-7 text-black th-cus"><div>Loại</div></div>
        <div class="w-12 text-black th-cus"><div>Danh mục</div></div>
        <div class="w-53 text-black th-cus"><div>Thông tin tag</div></div>
        <div class="w-7 text-black th-cus action-header"><div style="margin-left: auto !important;">Thao tác</div></div>
      </div>
<!--      body-->
      <div class="position-relative" v-loading="loading_data">
        <template v-for="(tag, index) in list_data">
          <TagsDetailRow
            :infoTags="tag"
            :key="index"
            :subject-index="index"
            @onOpenModal="onOpenModal"
            :data-update="dataCategory"
          >
          </TagsDetailRow>
        </template>
      <div  v-show="helper.isEmpty(list_data)">
        <div>
          <div class="mih-50 d-flex justify-content-center align-items-center">
            <b v-show="!loading_data">Không có dữ liệu phù hợp !</b>
          </div>
        </div>
      </div>
      </div>
    </div>

<!--     paging  -->
    <div class="row mt-3 align-items-center" v-show="!helper.isEmpty(list_data)">
      <div class="col col-md-9 text-left">
        <div class="z-0 d-inline-block">
          <b-pagination
            class="paginator-ghtk mb-0"
            size="sm"
            align="left"
            v-model="page"
            :total-rows="+total_page"
            :per-page="+per_page"
          >
          </b-pagination>
        </div>
      </div>
    </div>

    <TagModal
      :open="showTagModal"
      @onCloseModal="onCloseModal"
      :data-modal-tag="dataModalTag"
      @updateTagSuccess="updateTagSuccess"
      @updateListTag="updateListTag"
    />

    <TopicModal
      :open="showTopicModal"
      :type-modal="typeModal"
      :data-modal="dataModalTopic"
      :func-callback="fCallBack"
      :data-update-topic="dataUpdateTopic"
      @onCloseModal="onCloseModal"
      @openAddTag="onOpenModal"
      @AddTopicAndTagSuccess="AddTopicAndTagSuccess"
      @openModalConfirm="onOpenModal"
      @updateCategorySuccess="UpdateCategorySuccess"
    />

    <ConfirmModal
      :open="showConfirmModal"
      :data-modal="dataModalConfirm"
      @onCloseModal="onCloseModal"
      @updateCategorySuccess="UpdateCategorySuccess"
    />

  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
$ghtk-color: #069255;

.manage-cus {
  font-size: 22px !important;
  .employee-cus {
    font-weight: 700 !important;
    margin-right: 2rem;
    a {
      color: black !important;
    }
  }
  .tag-cus {
    font-weight: 400 !important;
    margin-right: 2rem;
    color: $ghtk-color;
  }
  .topic-cus {
    font-weight: 400 !important;
    color: $ghtk-color;
  }
}

.title-table {
  display: flex;
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

.w-7 {
  width: 7% !important;
}

.w-12 {
  width: 12% !important;
}

.w-53 {
  width: 53% !important;
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
  .my-2 {
    margin-top: 1rem !important;
  }
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
  width: 20%;
  .my-1 {
    margin-top: 0!important;
  }
}
.paging {
  margin-top: 3rem;
}

.cusBtn {
  width: 15%;
  margin-left: 0.6rem;
}
.cusBtn button{
  font-size: 0.9rem;
  padding: 5px 0px 5px 0px!important;
}

.cusTable {
  .th-cus{
    height: 3rem;vertical-align: middle;
    background-color: #FAFAFA;
    border: 1px solid #E0E0E0 !important;
    border-right: 0px !important;
    font-weight: 700;
    display: flex;
    div {
      margin: auto;
      margin-left: 0.5rem !important;
    }
  }
  .action-header {
    border-right: 1px solid #E0E0E0 !important;
  }
}

@media only screen and (max-width: 1280px) {
  .cusTable {
    max-height: 75vh !important;
    overflow-x: hidden;
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
  .cusBtn button{
    font-size: 0.75rem;
  }
  h4 {
    font-size: 1.1rem !important;
  }
  .headerTable .hStudent {
    width: 32.8%;
  }
}
</style>

<script>
// custom component
import Multiselect from 'vue-multiselect'
import TagsDetailRow from './TagsDetailRow'
import MultiSelectTopics from './MultiSelectTopics'
import MultiSelectTags from './MultiSelectTags'
import TagModal from './TagModal'
import TopicModal from './TopicModal'
import ConfirmModal from './ConfirmModal'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'

// import Datepicker from 'vuejs-datepicker'

// service
import ManageTagService from 'domain/services/manage-tags-service'

// helper

import helper from 'infrastructures/helpers/common-helpers'
// entities

import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'tag-management',

  components: {
    Multiselect,
    TagsDetailRow,
    MultiSelectPosition,
    MultiSelectDepartment,
    MultiSelectTopics,
    MultiSelectTags,
    TagModal,
    TopicModal,
    ConfirmModal
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
    loading: {
      listTopics: false
    },
    status: null,
    listTopicOptions: [],
    listTagOptions: [],
    permissionHr: false,
    permissionVh: false,
    permissionIt: false,
    showConfirmModal: false,
    list_data: [],
    filter: {
      topics: [],
      department_ids: [],
      positions: [],
      tags: []
    },
    page: 1,
    total_page: 0,
    per_page: 2,
    listTopicId: '',
    listTagId: '',
    param: {
      topicId: null,
      department_ids: null,
      positions: null,
      tagId: null
    },
    attachPermission: true,
    modalOptions: null,
    showTopicModal: false,
    showTagModal: false,
    listTag: [],
    typeModal: 'Add',
    dataModalTopic: null,
    fCallBack: null,
    dataModalTag: null,
    dataCategory: null,
    dataUpdateTopic: null,
    dataModalConfirm: null,
    dataTopicSuccess: 0
  }),

  created () {
    this.getDataTopics()
  },

  computed: {
    helper: function () {
      return helper
    },
    loading_data () {
      return this.loading.listTopics
    },

    ...mapGetters({
      permissions: 'education/getPermissions'
    })
  },

  watch: {
    page (newVal, oldVal) {
      this.getDataTopics()
    }
  },

  methods: {
    ...mapActions({
      setPermissions: 'education/setPermissions'
    }),
    handleSelectedTopic (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
        this.param.topicId = ops ? ops.map(item => item.id).toString() : '' // gửi dạng string
      } else {
        this.param.topicId = ''
      }
    },
    handleSelectedTag (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
        this.param.tagId = ops ? ops.map(item => item.tag_id).toString() : '' // gửi dạng string
      } else {
        this.param.tagId = ''
      }
    },
    async search () {
      if (this.page !== 1) {
        this.page = 1
      } else {
        this.getDataTopics()
      }
    },
    handleDepartmentSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.param.department_ids = ops ? ops.map(item => item.id).toString() : ''
    },
    handlePositionSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.param.positions = ops ? ops.map(item => item.id).toString() : ''
    },
    async getDataTopics (data) {
      // edit here return list_data
      try {
        this.loading.listTopics = true
        let params = {
          subject_id: this.param.topicId,
          department_id: this.param.department_ids,
          position_id: this.param.positions,
          tag_id: this.param.tagId,
          page: this.page
        }
        if (data) {
          params.subject_id = data.subjectId
        }
        const res = await ManageTagService.getDataTopics(params)
        if (res.data.success) {
          this.list_data = res.data.data.data
          this.total_page = Number(res.data.data.total) || 0
          if (data || this.param.topicId) {
            await this.$refs.resetListTopic.getListOptions()
            this.listTopicId = (data) ? String(data.subjectId) : String(this.param.topicId)
            this.$refs.resetListTopic.setList()
          }
        } else {
          helper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        helper.showMessage(e.response.data.message, 'warning')
      } finally {
        this.loading.listTopics = false
      }
    },

    AddTopicAndTagSuccess () {
      // Cập nhật lại list option topic
      this.dataTopicSuccess++
      this.changeParams()
      if (this.page !== 1) {
        this.page = 1
      } else {
        this.getDataTopics()
      }
    },

    // Cập nhật lại listTag
    updateTagSuccess (data) {
      this.dataCategory = data
    },

    // Cập nhật lại listTag, category trong modal tạo chủ đề và tag
    updateListTag (data) {
      this.dataUpdateTopic = data
    },

    // cập nhật lại listTag, ca
    async UpdateCategorySuccess (data) {
      if (data.subjectId) {
        if (this.page !== 1) {
          this.param.topicId = data.subjectId
          this.page = 1
        } else {
          this.getDataTopics(data)
        }
        this.showConfirmModal = false
        this.showTopicModal = false
      }
    },

    changeParams (topicId = null, departmentIds = null, positionId = null, tagId = null) {
      this.param.topicId = topicId || null
      this.param.department_ids = departmentIds || null
      this.param.positions = positionId || null
      this.param.tag_id = tagId || null
    },

    onOpenModal (args) {
      const {nameModal, type, options} = args
      if (type === 'AddTag') {
        this.dataModalTag = options
      } else if (type === 'Confirm') {
        this.dataModalConfirm = options
      } else {
        this.dataModalTopic = options
        this.typeModal = type
      }
      switch (nameModal) {
        case 'TopicModal':
          this.showTopicModal = true
          break
        case 'TagModal':
          this.showTagModal = true
          break
        case 'ConfirmModal':
          this.showConfirmModal = true
          break
      }
    },

    onCloseModal (nameModal) {
      switch (nameModal) {
        case 'TopicModal':
          this.showTopicModal = false
          break
        case 'TagModal':
          this.showTagModal = false
          break
        case 'ConfirmModal':
          this.showConfirmModal = false
          break
      }
    }

  }
}
</script>
