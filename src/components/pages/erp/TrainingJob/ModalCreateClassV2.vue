<template>
  <div>
    <b-modal
        :class="'modal-custom'"
        modal-class="modal-custom-1024"
        :id="id"
        header-class="justify-content-center header-modal-custom header-modal-educate"
        @hidden="hideModal" hide-footer static
        @shown="showModal()"
    >
      <h4 class="w-100 m-0 text-center" slot="modal-header">{{ title }}</h4>

      <div class="p-3">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div><b>Địa điểm</b></div>
          <div class="col-10 px-0 z-1000">
            <SingleSelectStation
                placeholder="Địa điểm tổ chức lớp học"
                ref="singleSelectStation"
                :isActive="true"
                class="multiselect-ghtk"
                @select="handleSelectedStation(...arguments)"
                @remove="handleUnselectStation"
                :stationId="detailClass.station_id"
            />
          </div>
        </div>

        <!--   Chọn lớp   -->
        <div class="list-class mb-2" v-show="!hideClass">
          <div class="d-flex align-items-center justify-content-between">
            <div><b>Lớp học</b></div>
            <div class="d-flex box-filter z-100 col-10 px-0 justify-content-between">
              <div class="filter-training">
                <MultiSelectSyllabus
                  :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                  placeholder="Lọc chương trình"
                  :auto-close="true"
                  :reset="resetFilter"
                  :multiple="false"
                  class="mr-2 select-class"
                  v-model="syllabusFilter.id"
                  @handleSyllabusSelected="handleSyllabusSelected(...arguments, 'syllabus')"
                >
                </MultiSelectSyllabus>
              </div>
              <div class="filter-student">
                <SingleSelectUser
                  :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                  :reset="resetFilter"
                  @onChange="handleUserSelected(...arguments, 'student')"
                  placeholder="Lọc học viên"
                  v-model="syllabusFilter.userId"
                  :status-id="userStatus"
                  targetApi="hrm"
                />
              </div>
              <b-btn variant="outline-ghtk" class="btn-create-class" @click="showModalCreateClass">+ Thêm lớp học</b-btn>
            </div>
          </div>

          <div
            v-if="type === 'confirm'"
            v-loading="loadingBaseClass"
            class="mt-2 mb-2 info-class mih-5re position-relative"
            id="infoClass"
            ref="infoClass"
            @scroll="checkScroll"
          >
              <div
                  v-for="(classInfo, idx) in listClassPendingFilter"
                  class="base-info-class mr-2 cursor-pointer"
                  :class="parseInt(classInfo.class_id) === parseInt(classId) ? 'border-ghtk' : ''"
                  @click="selectedClass(classInfo)"
                  :key="idx"
              >
                  <div>
                      <b>{{ classInfo.content }} | {{ classInfo.numPeriod || 0 }} buổi</b>
                  </div>
                  <div>
                      <span>{{ classInfo.numberStudent || 0 }} học viên | </span>
                      <span>
                          <span v-if="classInfo.modified">{{ formatDate(classInfo.modified, 'DD-MM-YYYY H:mm') }}</span>
                      </span>
                </div>
              </div>
          </div>
        </div>

        <div class="position-relative mih-5re" v-loading="loadingClassDetail" v-if="syllabusDetail && !hideStudent">
        <!--   Tài liệu   -->
        <div class="list-document mb-3">
          <div class="document-info d-flex" >
            <div class="profile-document" v-if="classDetail">
              <template v-for="(classDocument, idxPeriodDoc) in classDetail || []">
                  <div :key="'fileClass-' + idxPeriodDoc" class="profile-document__element" v-if="classDocument.files.length !== 0">
                    <div class="document-type-desc">
                      Tài liệu buổi {{ idxPeriodDoc + 1 }}
                    </div>
                    <div class="num-img-extend">
                      <i class="icon ion-md-eye mr-2 cursor-pointer" @click="showModalViewDoc(classDocument)"></i>
                    </div>
                    <template>
                      <span><img
                        class="image-document" :src="previewImageRender()" :alt="'Tài liệu buổi '+ idxPeriodDoc"/>
                      </span>
                    </template>
                  </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Giảng viên -->
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div><b>Giảng viên</b></div>
          <div class="col-10 px-0">
            <MultiSelectUser
              :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
              :users="detailClass.lecturer"
              @input="inputLecturer(...arguments)"
              placeholder="Giảng viên lớp học"
              :status-id="userStatus"
            />
          </div>
        </div>

        <!--   học viên   -->
        <div class="list-student" v-if="syllabusDetail && !hideStudent">
          <div class="mb-3 d-flex align-items-center justify-content-between mb-2">
            <b>Học viên | {{ numberStudent }}</b>
            <div class="col-10 d-flex justify-content-between box-filter px-0">
              <MultiSelectStation
                ref="multiSelectStation"
                placeholder="Kho"
                class="filter-input"
                :isActive="true"
                :listStation="listStation"
                @input="selectFilterStudent(...arguments, 'stations')"
              />
              <MultiSelectPosition
                ref="multiSelectPosition"
                placeholder="Vị trí"
                :auto-close="true"
                :listPosition="listPosition"
                class="filter-input"
                @handlePositionSelected="selectFilterStudent(...arguments, 'positions')"
              />
              <b-btn variant="outline-ghtk" class="btn-create-class invisible">+ Thêm lớp học</b-btn>
            </div>
          </div>
          <div v-if="listStudents">
            <div class="info-student row mb-3 mh-25 overflow-auto">
              <div class="col-4 d-flex mb-2 box-info-user" v-for="(stu, idx) in listStudentFilter" :key="idx"
                   v-loading="loadingStudent"
              >
                <div class="student-box" :class="dataClassInfo && dataClassInfo.class.status === 'pending' && !stu.in_config_tp ? 'student-not-in-config': ''">
                  <div class="avt-user mr-3">
                    <img :src="stu.image_profile" alt="avt" width="30px">
                  </div>
                  <div class="info-user">
                    <div>
                      <b>{{ stu.name }} | {{ stu.username }}</b>
                    </div>
                    <div>
                      <span>{{ stu.position }} - {{ stu.station }}</span>
                    </div>
                  </div>
                  <div class="text-right flex-grow-1">
                    <i class="fas fa-times-circle text-danger cursor-pointer font-larger" @click="confirmDeleteStudent(stu.id)"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="action-add-student mb-3">
              <div class="d-flex row-modal mt-1">
                <div class="w-100 mr-4">
                  <single-select-user
                    :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                    @select="handleSelectedStudent"
                    placeholder="Chọn học viên"
                    :reset="resetStudentSelected"
                    :status-id="userStatus"
                    :trainingSyllabusId="syllabus"
                    targetApi="hrm"
                  ></single-select-user>
                </div>
                <div class="w-19 text-right" v-if="!classInfo.class || ['happening', 'coming_up', 'pending'].includes(classInfo.class.status)">
                  <b-btn variant="outline-ghtk" class="btn-add-student" @click="addStudent()">+ Thêm học viên
                  </b-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>

        <!--   button confirm   -->
        <div class="text-center row-modal-bottom" v-if="syllabusDetail && !hideStudent">
          <b-btn
            variant="ghtk" class="btn-add-class w-9rem"
            @click="!edit ? addClass() : updateClass()"
            :disabled="disabledConfirm"
          >
            Xác nhận
          </b-btn>
        </div>
      </div>
    </b-modal>
    <b-modal
      id="view-docs"
      title-class="font-weight-bold w-100"
      header-class="text-center"
      modal-class="modal-md"
      hide-footer
    >
      <h4 class="w-100 m-0" slot="modal-header">Tài liệu học buổi {{periodDocuments.order_number}}</h4>
      <ViewDocument
        :lessons="periodDocuments.files"
      />
    </b-modal>
    <ModalNoteDeleteStudent
      @deleteStudent="noteDeleteStudent"
    >
    </ModalNoteDeleteStudent>
  </div>
</template>

<style lang="scss" scoped>
.w-9rem {
    width: 9rem;
}
.border-ghtk {
    border: solid 2px rgba(0, 144, 74, 1) !important;
}

.document-info {
    justify-content: space-between;
    height: 140px;
}

.base-info-class {
    width: 32.6%;
    border: solid 1px rgba(196, 196, 196, 1);
    border-radius: 1px;
    padding: 6px 5px;
    margin-bottom: 6px;
}

.info-class {
  overflow-x: scroll;
  display: -webkit-box;
  width: 100%;

  &::-webkit-scrollbar {
    height: 6px !important;
  }
  &::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }
}

.delete-icon-document {
    position: absolute;
    right: 2px;
    top: 0px;
    z-index: 1;
    color: rgba(130, 130, 130, 1);
}

.num-img-extend {
    /*pointer-events: none;*/
    text-align: center;
    font-size: unset;
    color: white;
    background-color: rgba(0, 0, 0, 0.47);
    width: calc(100% - 20px);
    height: 100%;
    position: absolute;
    top: 10px;
    display: none;
    align-items: center;
    justify-content: center;
}

.profile-document__element:hover {
    .num-img-extend {
        display: flex;
    }
}

.profile-document {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    height: 100%;

  .profile-document__element {
      padding: 10px;
  }
}

.document-type-desc {
    text-align: center;
    font-size: 12px;
    color: white;
    background-color: rgba(0, 0, 0, 0.64);
    width: calc(100% - 20px);
    position: absolute;
    bottom: 0;
    pointer-events: none;
    padding: 3px;
}

.image-document {
    width: 100%;
    height: 100%;
    display: inline-block;
    vertical-align: middle;
}

.profile-document__element {
    width: 134px;
    position: relative;
    height: 99%;
    display: inline-block;
}

.profile-creator__element {
    width: 20%;
    font-size: 12px;
    padding: 0 10px;
    white-space: normal;
}

.preview {
  &-active {
    .file-label-inner {
      border: 2px dotted #069255;
      text-align: center;
      color: #069255;
      z-index: 1;
      width: 100%;
      height: 40px;
      margin: 0 !important;
    }

    .file-icon {
      position: absolute;
      font-size: medium;
      bottom: 11px;
      left: 20px;
    }

    .file-description {
      width: fit-content;
      position: absolute;
      left: 40px;
      bottom: 8px;
      font-weight: 500;
    }

    .num-file-extend {
      text-align: center;
      font-size: x-large;
      color: #fff;
      background-color: rgba(0, 0, 0, .47);
      width: 100%;
      height: 80%;
      position: absolute;
      top: 0;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      z-index: 1;
      cursor: pointer;
    }

    .document-preview {
      width: 175px;
      height: 168px !important;
      display: inline-block;
      border: 1px solid #ccc;
      vertical-align: middle;
    }
  }

  &-disable {
    .file-label-inner {
      border: 2px dotted #069255;
      text-align: center;
      color: #069255;
      z-index: 1;
      width: 100%;
      height: 200px;
    }

    .file-icon {
      position: absolute;
      font-size: xxx-large;
      top: 30%;
      left: 0;
      right: 0;
    }

    .file-description {
      font-weight: 500;
      font-size: large;
      position: absolute;
      top: 65%;
      left: 0;
      right: 0;
    }
  }
}

.btn-add-student, .btn-create-class {
  border-radius: 5px;
  width: 9rem;
}

.btn-add-class {
  padding: 0;
  border-radius: 5px;
  height: 40px;
  width: 264px;
  font-size: 18px;
  font-weight: 500;
}

.btn-add-document {
  border-radius: 5px;
  width: 9rem;
}

.modal-title {
  font-size: 18px;
}

.number__element {
  /*font-size: 18px;*/
  font-weight: 400;
  position: absolute;
  right: 47px;
}

.list-student {
  max-height: 400px;
}

.avt-user img {
  border-radius: 50%;
  width: 46px;
  height: 46px;
  object-fit: cover;
}

.btn__createClass {
  height: 54px;
  width: 64px;
}

.box-info-user {
  justify-content: start;
  padding: 6px;
  border-radius: 8px;
}
.student-box {
  width: 96%;
  display: flex;
  padding: 10px;
  border-radius: 5px;
}

.student-not-in-config {
  color: darkgrey;
  .avt-user img {
    opacity: 0.5;
  }
}

.info-student::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}

.box-filter {
  .filter-training, .filter-student, .filter-input {
    width: 17rem;
  }
}
</style>
<script>
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'

import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectSyllabus from 'components/elements/common/MultiSelectSyllabus'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import EditDocument from './EditDocument'
import MultiSelectClass from 'components/elements/common/MultiSelectClass'
import SingleSelectClass from 'components/elements/common/SingleSelectClass'
import linkDefault from '@/const/linkDefault'

// service
import trainingService from 'domain/services/training-service'
import ModalDeleteAcademy from './ModalDeleteAcademy.vue'
import ModalNoteDeleteStudent from './ModalNoteDeleteStudent.vue'
import classService from '../../../../domain/services/class-service'
import ViewDocument from './ViewDocument.vue'

// service

export default {
  name: 'modal-create-class-v2',

  components: {
    ViewDocument,
    ModalDeleteAcademy,
    MultiSelectStation,
    MultiSelectPosition,
    SingleSelectStation,
    EditDocument,
    MultiSelectSyllabus,
    MultiSelectUser,
    SingleSelectUser,
    MultiSelectClass,
    SingleSelectClass,
    ModalNoteDeleteStudent
  },

  props: {
    title: {
      default: 'Tạo lớp học'
    },
    id: {
      default: 'modal-create-class'
    },
    type: {
      default: 'create'
    },
    classInfo: {
      type: Object,
      default: _ => ({})
    },
    reloadClass: {},
    activeClass: {}
  },

  data: _ => ({
    acceptFile: ['pdf', 'video', 'image', 'doc'],
    lessonInfoVisible: true,
    documentInfoVisible: true,
    studentInfoVisible: false,
    files: [],
    originCount: 0,
    canDeleteOrigin: false,
    idx: null,
    fileClass: [],
    fileCreators: [],
    tmpFileClass: [],
    tmpFileSyllabus: [],
    syllabus: null,
    classId: null,
    dataClassInfo: null,
    personInChange: {},
    syllabusDetail: null,
    classDetail: [],
    listStudents: [],
    listStudentsTemp: [],
    studentFilter: {
      positions: [],
      stations: []
    },
    listStudentFilter: [],
    listClassPending: [],
    listClassPendingFilter: [],
    organOptions: [
      {value: 'offline', text: 'Offline'},
      {value: 'online', text: 'Online'}
    ],
    templatePeriod: [
      {title: 'Thời gian', field: 'time'},
      {title: 'Hình thức', field: 'form'},
      {title: 'Địa điểm', field: 'station'},
      {title: 'Giảng viên', field: 'teacher_id'}
    ],
    student: null,
    studentId: null,
    resetStudentSelected: false,
    userStatus: 3,
    roles: [3],
    organizeOptions: [
      {
        value: 'offline',
        text: 'offline'
      },
      {
        value: 'online',
        text: 'online'
      }
    ],
    periodDocType: 'edit',
    disabledConfirm: false,
    loadingStudent: false,
    loadingClassDetail: false,
    loadingBaseClass: false,
    detailClass: {
      nameClass: null,
      regionClass: null,
      countStudentClass: 0,
      show: false,
      open: false,
      station_id: null,
      lecturer: null
    },
    createClass: {
      stationId: null,
      lecturer: null
    },
    numPeriod: 1,
    numberStudent: 0,
    stopScroll: null,
    reset: true,
    resetFilter: true,
    hideClass: false,
    syllabusFilter: {
      id: null,
      userId: null,
      classIds: []
    },
    hideStudent: false,

    periods: [],

    listPosition: [],
    listStation: [],

    currentStudentId: null,
    listStudentAdd: [],
    listStudentRemove: [],
    listFileRemove: [],
    listFileAdd: [],
    periodDocuments: {
      order_number: 1,
      files: []
    },
    currentPage: 1,
    totalPage: 0,
    scrollContainer: null
  }),

  created () {
  },

  computed: {
    edit () {
      return !!this.classInfo
    },
    helper: function () {
      return helper
    },
    numberFile: function () {
      let number = 0
      this.classDetail.forEach((classInfo) => {
        number += classInfo.files.length
      })
      return number
    },
    maxNumLecturer () {
      let maxNumLecture = 1
      if (this.syllabusDetail && +this.syllabusDetail.is_master) {
        maxNumLecture = this.syllabusDetail.child_syllabus.length || 1
      }

      return maxNumLecture
    }
  },

  watch: {
    syllabus (newVal, oldVal) {
      if (newVal) {
        this.getTrainingProgram(newVal)
      }
    },
    classDetail (newVal, oldVal) {
      if (newVal && this.type === 'create') {
        this.chooseStudents()
      }
      this.periods = newVal.map(function (element) {
        return {
          class_period_id: element.id,
          order_number: element.order_number
        }
      })
    },
    classId (newVal, oldVal) {
      if ((oldVal || Object.keys(this.classInfo).length === 0) && newVal) this.getClasses()
    },

    listStudents (newVal, oldVal) {
      this.listStudentFilter = this.listStudents
      this.listStudentFilter.forEach(student => {
        this.listPosition.push(student.position_id)
        this.listStation.push(student.station_id)
      })
    },

    reloadClass () {
      this.getClassListWaitingConfirm(true)
    },

    activeClass (newVal, oldVal) {
      this.setActiveClass(newVal)
    }
  },

  methods: {
    checkScroll (el) {
      if ((el.target.offsetWidth + el.target.scrollLeft) >= el.target.scrollWidth) {
        if (parseInt(this.currentPage) < parseInt(this.totalPage)) {
          this.currentPage = this.currentPage + 1
          this.getClassListWaitingConfirm()
        }
      }
    },

    noteDeleteStudent (note) {
      let studentRemove = this.listStudents.find(function (element) {
        return element.id === this.student_id
      }, {'student_id': this.currentStudentId})

      this.listStudentRemove.push({...studentRemove, ...{'note': note}})
      this.listStudentFilter = this.listStudentFilter.filter(function (item) {
        return item.id !== this.currentStudentId
      }, {'currentStudentId': this.currentStudentId})
      this.listStudents = this.listStudents.filter(function (item) {
        return item.id !== this.currentStudentId
      }, {'currentStudentId': this.currentStudentId})

      this.changeNumberStudent()
    },

    addEventToElement () {
      const $classInfo = document.getElementById('infoClass')
      if ($classInfo) {
        $classInfo.onwheel = function (e) {
          $classInfo.scrollLeft += (e.deltaY)
          e.preventDefault()
        }
      }
    },

    getUrl (file) {
      if (helper.isEmpty(file)) return null
      if (typeof file === 'string') return file
      return URL.createObjectURL(file)
    },

    getClasses () {
      this.hideClass = false
      this.hideStudent = false
      if (!this.classId) return
      const params = {
        classId: this.classId,
        status: 'pending'
      }

      this.loadingClassDetail = true
      trainingService.getClasses(params)
        .then((res) => {
          if (res.data.success) {
            this.dataClassInfo = res.data.data.data[0]
            this.checkClassInfo(this.dataClassInfo)
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.changeNumberStudent()
          this.loadingClassDetail = false
        })
    },

    showModal () {
      this.resetFilter = !this.resetFilter
      this.checkClassInfo()
    },

    getClassListWaitingConfirm (reload) {
      this.hideClass = false
      this.numberStudent = 0

      if (!this.createClass.stationId) {
        this.listClassPendingFilter = []
        return
      }
      this.loadingBaseClass = true
      trainingService.getClassListWaitingConfirm({stationId: this.createClass.stationId, page: this.currentPage, tp_id: this.syllabusFilter.id, user_id: this.syllabusFilter.userId})
        .then((res) => {
          if (res.data.success) {
            if (reload) {
              this.listClassPendingFilter = res.data.data
            } else {
              this.listClassPendingFilter = [...this.listClassPendingFilter, ...res.data.data]
            }

            this.currentPage = res.data.current_page
            this.totalPage = res.data.total_page
            if (this.listClassPendingFilter.length < 1) {
              helper.showMessage('Không có lớp ứng với địa điểm!')
            } else {
              helper.showMessage('Lấy danh sách lớp học thành công.', 'success')
            }

            this.hideStudent = this.checkHideStudent()
            this.setActiveClass(this.activeClass)
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(_ => {
          this.loadingBaseClass = false
          this.addEventToElement()
        })
    },

    checkClassInfo (dataClassInfo) {
      this.resetData()
      this.dataClassInfo = dataClassInfo || this.classInfo

      if (this.dataClassInfo && Object.keys(this.dataClassInfo).length > 0) {
        // format trương tình + người phụ trách
        this.syllabus = this.dataClassInfo.class.tp_id
        this.classId = this.dataClassInfo.class.id
        if (this.dataClassInfo.class.curator) {
          this.personInChange = {
            id: this.dataClassInfo.class.curator.user_id,
            name: `${this.dataClassInfo.class.curator.username} - ${this.dataClassInfo.class.curator.fullname} - ${this.dataClassInfo.class.curator.position_name} - ${this.dataClassInfo.class.curator.station_name}`
          }
        }

        // format thông tin giảng viên
        if (this.dataClassInfo.class.lecturers) {
          let lecturers = []
          this.dataClassInfo.class.lecturers.forEach(lecturer => {
            lecturers.push({
              id: lecturer.user_id,
              name: `${lecturer.username} - ${lecturer.fullname} - ${lecturer.position_name} - ${lecturer.station_name}`
            })
          })

          this.detailClass.lecturer = lecturers
          this.createClass.lecturer = lecturers.map(op => op.id).toString()
        }

        // Lấy thông tin kho
        this.detailClass.station_id = this.dataClassInfo.class.station_id

        // format thông tin học viên
        this.listPosition = []
        this.listStation = []
        this.dataClassInfo.listStudents.forEach(stu => {
          this.listStudents.push({
            id: stu.user_id,
            name: stu.fullname,
            image_profile: stu.image_profile,
            username: stu.username,
            position: stu.position,
            station: stu.station,
            position_id: stu.position_id,
            station_id: stu.station_id,
            in_config_tp: stu.in_config_tp
          })
          this.listPosition.push(stu.position_id)
          this.listStation.push(stu.station_id)
        })
        this.listStudentsTemp = this.listStudents
        // format thông tin buổi học
        if (this.dataClassInfo.class.periods) {
          this.classDetail.splice(0, this.classDetail.length)
          this.dataClassInfo.class.periods.forEach(period => {
            let fileClass = []
            let fileSyllabus = []
            let fileCreators = []

            this.classDetail.push({
              id: period.ErpTpClassPeriod.id,
              tpPeriodId: period.ErpTpClassPeriod.tp_period_id,
              content: period.ErpTpPeriod.content,
              date: period.ErpTpClassPeriod.start_time ? this.formatDate(period.ErpTpClassPeriod.start_time, 'YYYY-MM-DDTH:MM') : null,
              organ: period.ErpTpClassPeriod.form,
              status: period.ErpTpClassPeriod.status,
              link: period.ErpTpClassPeriod.link,
              isDisableOrgan: this.disableForm(period.ErpTpPeriod.form),
              lecturers: period.ErpTpClassPeriod.teacher_id,
              stationId: period.Station.id,
              fileClass: fileClass,
              fileSyllabus: fileSyllabus,
              files: period.file,
              fileCreators: fileCreators,
              order_number: period.ErpTpPeriod.order_number
            })
          })
        }
      }
    },

    action (action, idx) {
      if (action.action === 'new-file') {
        this.classDetail[idx - 1].fileClass.push(action.data.file)
        let classPeriodId = this.classDetail[idx - 1].id
        let fileAddByClassPeriodId = this.listFileAdd.find(function (element) {
          return element.class_period_id === classPeriodId
        }, {classPeriodId: classPeriodId})
        if (!fileAddByClassPeriodId) {
          this.listFileAdd.push({
            'class_period_id': classPeriodId,
            'files': [action.data.file]
          })
        } else {
          fileAddByClassPeriodId.files.push(action.data.file)
        }

        this.classDetail[idx - 1].files.push(action.data.file)
      }
      if (action.action === 'delete-file') {
        let numberFileSyllabus = this.classDetail[idx - 1].fileSyllabus.length
        this.classDetail[idx - 1].fileClass.splice(action.data.idx, 1)
        this.classDetail[idx - 1].files.splice(action.data.idx - numberFileSyllabus, 1)
      }
      if (action.action === 'close') {
        this.$bvModal.hide('edit-documents')
      }
    },

    showModalViewDoc (period) {
      this.periodDocuments.order_number = period.order_number
      this.periodDocuments.files = period.files
      this.$bvModal.show('view-docs')
    },

    async getTrainingProgram (syllabus) {
      let params = {
        syllabus: syllabus
      }

      if ((syllabus !== null || syllabus !== undefined) && this.type !== 'confirm') this.hideClass = true

      this.hideStudent = false
      this.lessonInfoVisible = true
      this.documentInfoVisible = true
      const {data} = await trainingService.getTrainingProgram(params)
      this.syllabusDetail = data.data
      this.numPeriod = this.syllabusDetail.tpPeriod.length || 1
      if (!this.edit) {
        let tmp = []
        if (this.syllabusDetail) {
          this.syllabusDetail.tpPeriod.forEach((period) => {
            tmp.push({
              tpPeriodId: period.id,
              lecturers: this.classInfo.class.lecturer,
              date: null,
              time: null,
              fileClass: [],
              originCount: period.files ? period.files.length : 0,
              organ: period.form !== 'all' ? period.form : null,
              stationId: this.classInfo.class.station_id,
              isDisableOrgan: this.disableForm(period.form),
              order_number: period.ErpTpPeriod.order_number
            })
          })
        }
        this.classDetail = tmp
      } else if (this.classInfo && Object.keys(this.classInfo).length > 0 && this.classInfo.class.id) {
        this.getStudentByClassId(this.classInfo.class.id)
      }

      this.changeNumberStudent()
    },

    disableForm (form) {
      return form !== 'all'
    },

    checkData () {
      if (!this.syllabus) {
        return {
          'status': false,
          'message': 'Bạn phải chọn chương trình học!'
        }
      }
      if (!this.personInChange || !this.personInChange.id) {
        if (this.type !== 'confirm' && this.classInfo.class.status !== 'pending') {
          return {
            'status': false,
            'message': 'Bạn phải chọn người phụ trách!'
          }
        }
      }
      // var classInformation = this.classDetail
      var createClass = this.createClass
      if (!createClass) {
        return {
          'status': false,
          'message': 'Bạn phải điền đầy đủ thông tin các buổi học!'
        }
      }

      return {
        'status': true
      }
    },

    addClass () {
      var validatorResult = this.checkData()
      if (validatorResult.status === false) {
        helper.showMessage(validatorResult.message, 'warning')
        return
      }
      let formData = new FormData()
      formData.append('syllabus', this.syllabus)
      formData.append('syllabusCode', this.syllabusDetail.code)
      formData.append('pic', this.personInChange.id)
      formData.append('listStudents', JSON.stringify(this.listStudents))
      formData.append('classDetail', JSON.stringify(this.classDetail))
      formData.append('createClass', JSON.stringify(this.createClass))

      this.disabledConfirm = true
      this.$startLoading()
      trainingService.addClass(formData)
        .then((res) => {
          if (res.data.success) {
            this.$emit('updateOk')
            helper.showMessage('Tạo lớp học thành công.', 'success')
            this.hideModal()
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.disabledConfirm = false
          this.$stopLoading()
        })
    },

    formDataAppendObject (formData, obj, key) {
      var i, k
      for (i in obj) {
        k = key ? key + '[' + i + ']' : i
        if (typeof obj[i] === 'object') { this.formDataAppendObject(formData, obj[i], k) } else { formData.append(k, obj[i]) }
      }
    },

    async updateClass () {
      this.disabledConfirm = true
      // Tạo form update
      let formData = new FormData()
      if (this.detailClass.station_id) {
        formData.append('station_id', this.detailClass.station_id)
      }

      formData.append('class_id', this.dataClassInfo.class.id)
      this.listStudentAdd.forEach(function (student) {
        formData.append('add_student_ids[]', student.id)
      })

      this.listStudentRemove.forEach(function (element, idx) {
        Object.entries(element).forEach(([key, value]) => {
          if (['id', 'note'].includes(key)) {
            formData.append('remove_students[' + idx + ']' + '[' + key + ']', value)
          }
        })
      })
      this.listFileRemove.forEach(function (file) {
        formData.append('remove_files[]', file)
      })
      this.listFileAdd.forEach(function (element, idx) {
        Object.entries(element).forEach(([key, value]) => {
          if (key === 'files') {
            value.forEach(function (file, idxFile) {
              formData.append('add_files[' + idx + ']' + '[' + key + ']' + '[' + idxFile + ']', file)
            })
          } else {
            formData.append('add_files[' + idx + ']' + '[' + key + ']', value)
          }
        })
      })

      this.detailClass.lecturer.forEach(function (lecturer) {
        formData.append('lecturers_ids[]', lecturer.id)
      })

      try {
        const res = await classService.updateClass(formData)
        if (res.data.success) {
          this.$emit('updateOk')
          this.hideModal()
        } else {
          helper.showMessage(res.data.message, 'warning')
        }
      } catch (e) {
        if (+e.response.status === 422) { return helper.showMessage(e.response.data.message, 'warning') }
        console.log(e)
      } finally {
        this.disabledConfirm = false
        this.$stopLoading()
      }
    },

    confirmClass () {
      let data = {
        classId: this.dataClassInfo.class.id
      }

      trainingService.confirmClass(data)
        .then((res) => {
          if (res.data.success) {
            // list classes
            helper.showMessage(res.data.message, 'success')
            this.$emit('updateOk')
            this.hideModal()
          } else {
            if (res.data.error_code && res.data.error_code === 'not_have_student') {
              this.$emit('removeAllStudentOfClass', this.dataClassInfo.class.id)
            }
            helper.showMessage(res.data.message || 'Gặp lỗi khi xác nhận lớp học !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.$bvModal.hide('modal-create-class')
          this.loading = false
        })
    },

    hideModal () {
      this.$bvModal.hide('modal-create-class')
      this.detailClass = {
        nameClass: null,
        regionClass: null,
        countStudentClass: 0,
        show: false,
        open: false,
        station_id: null,
        lecturer: null
      }
      this.lessonInfoVisible = false
      this.documentInfoVisible = false
      this.createClass.stationId = null
      this.createClass.lecturer = null
      this.handleSelectedStation(null)
      this.syllabusDetail = null
      this.resetData()
    },
    handleSyllabusSelected: function (option) {
      this.syllabusFilter.id = option ? option.id : ''
      this.getClassListWaitingConfirm(true)
    },
    handleUserSelected: function (option) {
      this.syllabusFilter.userId = option ? option.id : ''
      this.getClassListWaitingConfirm(true)
    },

    setActiveClass (classId) {
      let classInfo = this.listClassPendingFilter.find(c => (+c.class_id === +classId))

      if (classInfo) this.selectedClass(classInfo)
    },

    selectedClass (classInfo) {
      this.lessonInfoVisible = true
      this.documentInfoVisible = true
      this.classId = classInfo.class_id
      this.detailClass.countStudentClass = classInfo.numberStudent
      this.detailClass.nameClass = classInfo.content
      this.detailClass.regionClass = classInfo.province
      this.detailClass.show = true
      this.detailClass.open = true
    },

    handleSelectedStation: function (option) {
      this.resetFilter = !this.resetFilter
      this.createClass.stationId = option ? option.id : ''
      this.detailClass.station_id = option ? option.id : ''
      this.totalPage = 0
      this.currentPage = 1
      this.chooseStudents()
      if (this.type === 'confirm') {
        this.resetDataAfterSelectStation()
        if (this.createClass.stationId) this.getClassListWaitingConfirm(true)
      }
    },

    handleUnselectStation () {
      this.detailClass.station_id = null
    },

    inputLecturer (ops) {
      this.detailClass.lecturer = ops
      this.createClass.lecturer = ops.map(op => op.id).toString()
    },

    handleSelectedStudent: function (option) {
      this.student = option ? option.name : null
      this.studentId = option ? option.id : null
    },

    addStudent () {
      this.resetStudentSelected = !this.resetStudentSelected
      if (!this.student) {
        return
      }

      let studentId = +this.studentId
      // Nếu học viên ở trong list học viên đã bị xóa thì thêm luôn
      let studentInListRemove = this.listStudentRemove.find(function (student) {
        return +student.id === studentId
      })
      this.listStudentRemove = this.listStudentRemove.filter(function (student) {
        return +student.id !== studentId
      })

      if (typeof studentInListRemove !== 'undefined') {
        this.listStudents.push(studentInListRemove)
        this.changeNumberStudent()
        return
      }

      // Nếu không phải thì kiểm tra học viên có thỏa mãn config không
      this.$startLoading()

      classService.checkCanAddStudentToClassOfTp({class_id: this.classId, student_id: this.studentId})
        .then(res => {
          if (res.data.success) {
            let student = this.student.split(' - ')
            let newStudent = {
              id: this.studentId,
              name: student[1],
              username: student[0],
              station: student[3],
              position: student[2],
              station_id: null,
              position_id: null,
              image_profile: null,
              in_config_tp: 1
            }
            this.listStudents.push(newStudent)
            this.listStudentAdd.push(newStudent)

            this.listClassPendingFilter.map(c => {
              if (+c.class_id === +this.classId) c.numberStudent = parseInt(c.numberStudent) + 1
            })
          } else {
            helper.showMessage(res.data.message)
            console.log(res.data.message)
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
          this.student = null
          this.studentId = null
          this.disabledConfirm = false
          this.numberStudent = this.listStudents.length
        })
    },

    confirmDeleteStudent (studentId) {
      let studentInClass = this.listStudentsTemp.find(function (element) {
        return element.id === studentId
      })

      if (!studentInClass) {
        this.listStudents = this.listStudents.filter(function (student) {
          return student.id !== studentId
        })
        this.listStudentAdd = this.listStudentAdd.filter(function (student) {
          return +student.id !== studentId
        })
      } else {
        this.currentStudentId = studentId
        this.$bvModal.show('modal-note-delete-student')
      }
    },

    deleteStudent (idx) {
      this.listStudents.splice(idx, 1)
      this.numberStudent = this.listStudents.length
      this.listClassPendingFilter.map(e => {
        if (e.class_id === this.classId) e.numberStudent = parseInt(e.numberStudent) - 1

        return e
      })
    },

    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },

    resetData () {
      this.syllabus = null
      this.personInChange = {}
      this.classDetail = []
      this.listStudents = []
      this.student = null
      this.classId = null
      this.studentId = null
      this.currentStudentId = null
      this.listStudentRemove = []
      this.listStudentAdd = []
      this.listFileAdd = []
      this.listFileRemove = []
    },

    checkIsFileClass (classDocument, idx) {
      return idx >= classDocument.fileSyllabus.length
    },

    previewImageRender () {
      return linkDefault.DEFAULT_THUMBNAIL
    },

    chooseStudents () {
      if (!this.edit) {
        let params = {
          tpId: this.syllabus,
          class: this.classDetail
        }
        this.loadingStudent = true
        trainingService.getStudentOfTrainingProgram(params)
          .then((res) => {
            if (res.data.success) {
              this.listStudents = []
              if (Array.isArray(res.data.data)) {
                res.data.data.forEach((stu) => {
                  this.listStudents.push({
                    id: stu.user_id,
                    name: stu.fullname,
                    username: stu.username,
                    station: stu.station_name,
                    position: stu.position_name,
                    station_id: stu.station_id,
                    position_id: stu.position_id,
                    image_profile: stu.image_profile
                  })
                  this.listPosition.push(stu.position_id)
                  this.listStation.push(stu.station_id)
                })
              }
            }

            this.loadingStudent = false
          })
          .catch((e) => {
            console.log(e)
          })
          .finally(() => {
            this.loadingStudent = false
          })
      }
    },

    getStudentByClassId (classId) {
      this.listPosition = []
      this.listStation = []
      this.hideStudent = false
      if (!classId) {
        return
      }
      trainingService.getStudentByClassId({classId: classId})
        .then((res) => {
          if (res.data.success) {
            this.listStudents = []
            if (Array.isArray(res.data.data)) {
              res.data.data.forEach((stu) => {
                this.listPosition.push(stu.position_id)
                this.listStation.push(stu.station_id)
                this.listStudents.push({
                  id: stu.user_id,
                  name: stu.fullname,
                  username: stu.username,
                  station: stu.station_name,
                  position: stu.position_name,
                  station_id: stu.station_id,
                  position_id: stu.position_id,
                  image_profile: stu.image_profile,
                  in_config_tp: stu.in_config_tp
                })
              })
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    toggleChoose () {
      this.detailClass.open = !this.detailClass.open
    },

    showModalCreateClass () {
      this.$emit('showModalCreateClass', {stationId: this.createClass.stationId})
    },

    selectFilterStudent (ops, field) {
      if (!ops) this.studentFilter[field] = []
      else {
        this.studentFilter[field] = []
        ops.forEach(op => {
          this.studentFilter[field].push(+op.id, op.name)
        })
      }

      this.filterStudent()
    },

    filterStudent () {
      this.listStudentFilter = this.listStudents.filter(student => {
        let inPosition = !this.studentFilter.positions || !this.studentFilter.positions.length || this.studentFilter.positions.includes(student.position_id) || this.studentFilter.positions.includes(student.position)
        let inStation = !this.studentFilter.stations || !this.studentFilter.stations.length || this.studentFilter.stations.includes(student.station_id) || this.studentFilter.stations.includes(student.station)
        return inPosition && inStation
      })
    },

    changeFileByPeriod (option) {
      this.tmpFileClass = this.classDetail[option - 1].fileClass
      this.tmpFileSyllabus = this.classDetail[option - 1].fileSyllabus
    },

    changeNumberStudent () {
      let check = (this.listStudents && this.listStudents.length)
      if (check === 0) {
        this.disabledConfirm = true
      } else {
        this.disabledConfirm = false
      }

      if (this.listStudents && this.listStudents.length > 0) {
        this.disabledConfirm = false
      }

      this.numberStudent = check
    },

    resetDataAfterSelectStation () {
      this.classId = null
      this.numberStudent = 0
      this.listStudents = []
      this.hideStudent = true
    },

    checkHideStudent () {
      let hide = true;
      this.listClassPendingFilter.filter(classPending => {
        if (parseInt(this.classId) === parseInt(classPending.class_id)) {
          hide = false
        }
      })

      return hide
    },
  }
}
</script>
