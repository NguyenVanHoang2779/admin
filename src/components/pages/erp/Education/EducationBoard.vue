<template>
  <div class="small-scrollbar work-dash">
    <!-- Header + Action -->
    <b-row class="header mt-2 mb-3 align-items-center d-flex justify-content-between px-3">
      <div class="d-flex" style="align-items: baseline">
        <h4 class="m-0 font-weight-bold text-black">Đào tạo</h4>
        <router-link to="/staff-work/classes" class="m-0 header-setting">Quay lại</router-link>
      </div>
      <div class="action-wrap">
          <button
              style=""
              v-for="(val, key) in cur_work.button_action"
              :key="key"
              class="btn btn-ghtk rounded btn-act"
              @click="handleButtonAction(val)"
          >
          {{ val.desc }}
        </button>
        <div class="action-toggle">
            <div class="action-toggle__left">Chương trình</div>
            <router-link class="link action-toggle__right" :to="'/staff-work/questions'">
                  Câu hỏi
            </router-link>
        </div>
      </div>
    </b-row>
    <!-- Filter  -->
    <div class="row filter pb-2 justify-content-between input-border">
      <div class="mb-1 input-filter">
        <multi-select-syllabus
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          :syllabuse-ids="filter.syllabus_id"
          :auto-close="true"
          :placeholder="'Tên/Mã CT'"
          :reset="resetSelectSyllabus"
          @handleSyllabusSelected="handleSyllabusSelected"
        ></multi-select-syllabus>
      </div>
      <div class="mb-1 input-filter">
        <SelectStatusSyllabus
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          :regions="filter.region"
          :auto-close="true"
          :placeholder="'Trạng thái'"
          @input="handleStatusSelected"
        ></SelectStatusSyllabus>
      </div>
      <div class="mb-1 input-filter">
        <multi-select-region
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          :regions="filter.region"
          :auto-close="true"
          :placeholder="'Miền'"
          @handleSelectedRegion="handleRegionSelected"
        ></multi-select-region>
      </div>
      <div class="mb-1 input-filter">
        <multi-select-province
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          :province-ids="filter.province"
          :region="filter.region"
          :auto-close="true"
          :hide-select="true"
          :placeholder="'Tỉnh'"
          @handleProvinceSelected="handleProvinceSelected"
        ></multi-select-province>
      </div>
      <div class="mb-1 input-filter">
        <multi-select-station
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          :province-ids="filter.province"
          :station-ids="filter.station"
          :auto-close="true"
          :isActive="true"
          :hide-select="true"
          :placeholder="'Kho'"
          @handleStationSelected="handleStationSelected"
        ></multi-select-station>
      </div>
      <div class="mb-1 input-filter">
        <single-select-department
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :department-id="filter.student_department"
          :auto-close="true"
          :hide-selected="true"
          :placeholder="'Bộ phận học viên'"
          @handleSelectedDepartment="handleStudentDepartmentSelected"
        />
      </div>
      <div class="mb-1 input-filter">
        <MultiSelectPosition
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          :department-ids="filter.student_department"
          :position-ids="filter.student_position"
          :auto-close="true"
          :hide-selected="true"
          placeholder="Vị trí học viên"
          :isSyllabus="true"
          @handlePositionSelected="handleStudentPositionSelected"
        />
      </div>
      <div class="mb-1 input-filter">
        <MultiSelectWorkType
          @handleSelectedWorkType="handleSelectedWorkType"
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :custom-multiselect-class="'z-3'"
          :auto-close="true"
          :multiple="true"
          :positionCustom="filter.student_position"
          :placeholder="'Kiểu học viên'"
          :workTypeId="filter.work_type"
        >
        </MultiSelectWorkType>
      </div>
      <div class="mb-1 input-filter">
        <single-select-user
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          @onChange="op => {filter.creator = op ? op.id : null}"
          placeholder="Người tạo"
        ></single-select-user>
      </div>
      <div class="mb-1 input-filter">
        <v-date-picker
          v-model="filter.date"
          mode="range"
          locale="vi"
          color="green"
          :input-props="{ placeholder: 'Thời gian tạo', style: 'font-size:14px; line-height: unset', class: 'z-3 form-control rounded' }"
          :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="text-right input-filter"></div>
      <div class="text-right input-filter"></div>
      <div class="text-right input-filter"></div>
      <div class="text-right input-filter">
        <button
          style="line-height: initial; font-size: 18px;"
          class="btn btn-ghtk rounded w-100" @click="search()"
        >
          <i class="fas fa-search" style="padding: 0 10px"></i>
          <span>Tìm kiếm</span>
        </button>
      </div>
    </div>

    <!-- Table data  -->
    <div :class="scrollMode && 'table-sticky'" class="mh-75 table-data">
      <table class="table table-sm mb-0">
        <thead>
        <tr class="text-center">
          <th class="w-30 text-black">Chương trình học</th>
          <th class="text-black">Đối tượng & Nội dung</th>
          <th style="width: 16%" class="text-black">Thao tác</th>
        </tr>
        </thead>
        <tbody class="position-relative" v-loading="loading_data">
        <template v-for="(syllabus, idx) in list_data">
          <EducationRow @action="action(syllabus, ...arguments)" :syllabus="syllabus" :key="idx"></EducationRow>
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
    <div class="row mt-3 align-items-center">
      <div class="col col-md-9 text-left">
        <b class="text-black">
          Bản ghi/ trang
        </b>
        <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block"
                v-model="page.syllabus.limit" @change="getSyllabuses()">
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
            v-model="page.syllabus.page"
            :total-rows="+page.syllabus.total_row"
            :per-page="+page.syllabus.limit"
            @input="getSyllabuses()"
          >
          </b-pagination>
        </div>
      </div>
    </div>
    <!-- modal  -->
    <b-modal
      class="modal-syllabus"
      id="modal-create-syllabus"
      title-class="w-100 pl-5"
      body-class="p-0"
      header-class="text-center"
      modal-class="modal-xl"
      :no-close-on-backdrop="true"
      :title="editSyllabusTitle"
      hide-footer
      static
      @hidden="cur_row_data = {}"
    >
<!--      <template slot="modal-header">-->
<!--        <h4 class="w-100 m-0">{{ editSyllabusTitle }}</h4>-->
<!--      </template>-->
      <EditSyllabus
        :edit-syllabus-data="cur_row_data"
        :type="edit_syllabus_type"
        :list-program="listProgram"
        :trigger-syllabus="triggerSyllabus"
        @action="action(null, ...arguments)"
      />
    </b-modal>

    <b-modal id="view-period-documents" title-class="font-weight-bold w-100"
             header-class="text-center" modal-class="modal-md" hide-footer>
      <template slot="modal-header">
        <h4 class="w-100 m-0">Tài liệu học buổi {{this.cur_lecture.order_number}}</h4>
      </template>
     <ViewDocumentTpPeriod :lessons="this.cur_lecture.documents"></ViewDocumentTpPeriod>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
    .action-wrap {
      display: flex;
      align-items: center;
    }

    .action-toggle {
        --width: 260px;
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

    .btn-act {
        line-height: 1.2;
        margin-right: 10px;
        font-weight: 700;
    }

    .header-setting {
        color: #00904A;
        cursor: pointer;
        display: block;
        padding-left: 20px;
        font-size: 1.2rem;
    }

    .icon-gear {
        margin-left: 0.3rem;
        width: 1.3rem;
        filter: invert(36%) sepia(66%) saturate(7499%) hue-rotate(148deg) brightness(98%) contrast(102%);
    }

    .filter {
        padding: 0 0.5rem 0 0.5rem;
    }

    .input-filter {
        width: 20%;
        padding: 0 0.5rem;
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
    .modal-syllabus /deep/ .modal-title{
      font-size: 18px;
    }
</style>

<script>
// custom component
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectWorkType from 'components/elements/common/MultiSelectWorkType'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectHrTag from 'components/elements/common/MultiSelectHrTag'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectSyllabus from 'components/elements/common/MultiSelectSyllabus'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SelectStatusSyllabus from './SelectStatusSyllabus.vue'
import EditPeriodDocuments from './edit-period-documents'
import Multiselect from 'vue-multiselect'
import TimeLine from '../StaffLog/TimeLine'

// service
import trainingService from 'domain/services/training-service'
import trainingUniService from 'domain/services/Erp/HrmUni/training-service'
// entities

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import EditSyllabus from './EditSyllabus'
import EducationRow from './EducationRow'
import ViewDocumentTpPeriod from './ViewDocumentTpPeriod.vue'

export default {
  name: 'education-dashboard',

  components: {
    ViewDocumentTpPeriod,
    SelectStatusSyllabus,
    EducationRow,
    EditSyllabus,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    SingleSelectUser,
    MultiSelectDepartment,
    MultiSelectPosition,
    TimeLine,
    MultiSelectHrTag,
    MultiSelectSyllabus,
    EditPeriodDocuments,
    MultiSelectWorkType,
    SingleSelectDepartment,
    Multiselect
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
      statistic_syllabus: false,
      statistic_classroom: false
    },
    page: {
      syllabus: {
        page: 1,
        total_row: 0,
        limit: 5
      }
    },
    filter: {
      region: null,
      province: null,
      station: null,
      employee: null,
      student_department: null,
      student_position: null,
      teacher_position: null,
      status: null,
      form: null,
      work_type: null,
      syllabus_id: null,
      prerequisite_syllabus_id: null,
      tag: null,
      date: null
    },
    triggerSyllabus: false,
    edit_syllabus_type: 'add',
    cur_syllabus: {},
    cur_work: {},
    statistics: {
      syllabus: {
        type: 'syllabus',
        button_action: {
          create_new_syllabus: {
            desc: '+ Thêm',
            type: 'add',
            alias: 'create_syllabus'
          }
        }
      }
    },
    cur_row_data: {},
    cur_lecture: {},
    EditPeriodDocType: 'view',
    resetEditSyllabus: false,
    reload_tag: 0,
    cur_tag_data: {
      record: {},
      attach: true
    },
    list_data: [],
    resetSelectSyllabus: false,
    listProgram: []
  }),

  computed: {
    moment: moment,
    loading_data () {
      return this.loading.statistic_syllabus || this.loading.statistic_classroom
    },
    helper () {
      return helper
    },
    editSyllabusTitle () {
      if (this.edit_syllabus_type === 'add') return 'Tạo chương trình'
      if (this.edit_syllabus_type === 'edit') return 'Sửa chương trình'
      if (this.edit_syllabus_type === 'view') return 'Xem chương trình'
    }
  },

  created () {
    this.cur_work = this.statistics.syllabus
    if (!helper.isEmpty(this.$route.query.id)) {
      this.filter.syllabus_id = this.$route.query.id
    }
    this.getAllSyllabusExceptMaster()
  },

  watch: {
    cur_work: {
      deep: true,
      handler: function (newVal, oldval) {
        this.search()
      }
    }
  },
  methods: {
    getAllSyllabusExceptMaster: async function () {
      try {
        let params = {}
        params.is_master = 0
        const data = await trainingService.getAllSyllabus(params)
        if (data.data.success) {
          this.listProgram = data.data.data
        } else {
          helper.showMessage(data.data.message, 'warning')
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      }
    },
    action (syllabus, action) {
      this.cur_row_data = syllabus
      if (action.action === 'edit-syllabus') {
        this.handleButtonAction({alias: 'edit_syllabus'})
      }
      if (action.action === 'view-syllabus') {
        this.handleButtonAction({alias: 'view-syllabus'})
      }
      if (action.action === 'update-syllabus-status') {
        this.updateStatusSyllabus(action.data.status, action.data.old_status)
      }
      if (action.action === 'update-syllabus-ok') {
        this.$bvModal.hide('modal-create-syllabus')
        this.resetSelectSyllabus = !this.resetSelectSyllabus
        this.getSyllabuses()
      }
      if (action.action === 'close-update-syllabus') {
        this.$bvModal.hide('modal-create-syllabus')
      }
      if (action.action === 'view-documents') {
        this.cur_lecture = action.data
        this.$bvModal.show('view-period-documents')
      }
    },
    search () {
      this.page.syllabus.page = 1
      this.getSyllabuses()
    },
    handleButtonAction (key) {
      this.triggerSyllabus = !this.triggerSyllabus
      if (key.alias === 'create_syllabus') {
        this.edit_syllabus_type = 'add'
        this.$bvModal.show('modal-create-syllabus')
      }
      if (key.alias === 'edit_syllabus') {
        this.edit_syllabus_type = 'edit'
        this.$bvModal.show('modal-create-syllabus')
      }
      if (key.alias === 'view-syllabus') {
        this.edit_syllabus_type = 'view'
        helper.showMessage('Do chương trình đang có lớp học Đang diễn ra nên bạn chỉ có thể Xem!')
        this.$bvModal.show('modal-create-syllabus')
      }
    },

    async updateStatusSyllabus (status, oldStatus) {
      try {
        this.loading.statistic_syllabus = true
        const data = await trainingService.editSyllabus({
          type: 'single',
          old_syllabus: {
            id: this.cur_row_data.id,
            status: oldStatus
          },
          syllabus: {
            id: this.cur_row_data.id,
            status: status
          }
        })
        if (data.data.success) {
          helper.showMessage('Cập nhật trạng thái thành công!', 'success')
          this.cur_row_data.status = status
        } else helper.showMessage(data.data.message, 'warning')
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading.statistic_syllabus = false
      }
    },
    async getSyllabuses () {
      try {
        this.loading.statistic_syllabus = true
        let filter = {...this.filter}
        if (!helper.isEmpty(this.filter.date)) {
          filter.start_date = helper.formatDate(this.filter.date.start, 'YYYY-MM-DD')
          filter.end_date = helper.formatDate(this.filter.date.end, 'YYYY-MM-DD')
        }
        if (!helper.isEmpty(filter.form)) filter.form = filter.form.value
        // if (!helper.isEmpty(filter.status)) filter.status = filter.status.value
        const data = await trainingUniService.getSyllabuses({
          ...filter,
          ...this.page.syllabus
        })
        if (data.data.success) {
          helper.showMessage(data.data.message, 'success')
          this.list_data = data.data.data.data
          this.page.syllabus.total_row = data.data.data.total
        } else helper.showMessage(data.data.message, 'warning')
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.loading.statistic_syllabus = false
      }
    },
    resetFilter () {
      for (const field in this.filter) {
        if (field === 'status') continue
        this.filter[field] = null
      }
    },
    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
    },
    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
    },
    handleStatusSelected (option) {
      this.filter.status = option ? option.id.toString() : ''
    },
    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },
    handleStudentDepartmentSelected (option) {
      this.filter.student_department = option ? option.id : ''
    },
    handlePositionSelected (ops) {
      this.filter.position = ops ? ops.map(item => item.id).toString() : ''
    },
    handleStudentPositionSelected (ops) {
      this.filter.student_position = ops ? ops.map(item => item.id).toString() : ''
    },
    handleTeacherPositionSelected (ops) {
      this.filter.teacher_position = ops ? ops.map(item => item.id).toString() : ''
    },
    handleHrTagSelected (ops) {
      this.filter.tag = ops ? ops.map(item => item.id).toString() : ''
    },
    handleSyllabusSelected: function (option) {
      this.filter.syllabus_id = option ? option.map((item) => item.id).toString() : ''
    },
    handlePreRequisiteSyllabusSelected: function (option) {
      this.filter.prerequisite_syllabus_id = option ? option.map((item) => item.id).toString() : ''
    },
    handleRegionSelected: function (option) {
      this.filter.region = option ? option.map((item) => item.id).toString() : ''
    },
    handleSelectedWorkType (options) {
      this.filter.work_type = options ? options.map(option => option.id).toString() : ''
    }
  }
}
</script>
