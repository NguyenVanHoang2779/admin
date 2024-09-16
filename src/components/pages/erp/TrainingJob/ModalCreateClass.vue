<template>
    <div>
        <b-modal
            :class="'modal-custom'"
            modal-class="modal-custom-1024"
            :id="id"
            header-class="justify-content-center header-modal-custom"
            @hidden="hideModal" hide-footer
            static @shown="showModal()"
        >
            <template slot="modal-header">
                <h4 class="w-100 m-0 text-center">{{title}}</h4>
            </template>
            <div class="choose-class class-title justify-content-between mt-2" v-if="detailClass.show" @click="toggleChoose">
            <div class="justify-content-start text-title-choose">
              <span>Lớp học: <span>{{ detailClass.nameClass }}</span> | <span>{{ detailClass.regionClass }}</span> | {{ detailClass.countStudentClass }} học viên</span>
            </div>
            <div class="justify-content-end">
              <a href="#" type="button" class="modal-collapse__button" :class="detailClass.open ? '' : 'active'"></a>
            </div>
            </div>
                <div class="program" style="padding: 0px 20px">
                    <div class="row-modal-top" v-if="type === 'confirm'" :class="detailClass.open ? 'hide-class' : ''">
                        <div class="d-flex align-items-center">
                            <i>Chọn lớp để xác nhận thông tin</i>
                        </div>
                        <div class="base-info-class-container mt-2 mb-2">
                            <div v-for="classInfo in listClassPending" class="base-info-class cursor-pointer" :class="parseInt(classInfo.class_id) === parseInt(classId) ? 'border-ghtk' : ''" @click="selectedClass(classInfo)">
                                <div>
                                    <b>{{classInfo.content}}</b>
                                </div>
                                <div>
                                    <span><span v-if="classInfo.province">{{classInfo.province}} | </span>{{classInfo.form}}</span> |  <span>{{classInfo.numberAcademy}} học viên</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex row-modal-top" v-else>
                        <div class="d-flex align-items-center w-2278">
                            <span>Nội dung <span class="text-danger">*</span></span>
                        </div>
                        <div class="w-7822 pl-10">
                            <multi-select-syllabus
                                :custom-class="'multiselect col-md-12 p-0 multiselect-ghtk multiselect-ghtk-right multiselect-no-horizontal multiselect__placeholder--center'"
                                :auto-close="true"
                                :multiple="false"
                                :isDisabled="edit"
                                :placeholder="'Chọn nội dung lớp học'"
                                :syllabusIds="syllabus"
                                @handleSyllabusSelected="handleSyllabusSelected"
                            >
                            </multi-select-syllabus>
                        </div>
                    </div>
                </div>
                <div class="class-title">
                    <span>Thông tin buổi học</span>
                    <a href="#" type="button" class="modal-collapse__button" :class="lessonInfoVisible ? 'active' : ''"
                       v-b-toggle.lesson-info></a>
                </div>
                <b-collapse id="lesson-info" v-model="lessonInfoVisible" v-if="syllabusDetail">
                    <div class="program mb-2" v-if="type !== 'confirm'">
                        <div class="d-flex row-modal">
                            <div class="d-flex align-items-center w-2278">
                                <span>Người phụ trách <span class="text-danger">*</span></span>
                            </div>
                            <div class="w-7822 pl-10 ">
                                <single-select-user
                                        :custom-class="'multiselect p-0 multiselect-ghtk multiselect-ghtk-right multiselect__placeholder--center'"
                                        :placeholder="'Chọn người phụ trách'"
                                        :user="personInChange"
                                        :status-id="userStatus"
                                        :roles="roles"
                                        @onChange="selectPersonInChange">
                                </single-select-user>
                            </div>
                        </div>
                    </div>
                    <div class="program d-flex">
                        <div class="w-12 text-center p-eletment">
                            <b>Buổi</b>
                        </div>
                        <div class="w-88 d-flex">
                            <div class="w-25 text-center p-eletment"
                                 v-for="(template, index) in templatePeriod" :key="index">
                                <b>{{template.title}}</b>
                            </div>
                        </div>
                    </div>

                    <div class="program d-flex" v-for="(value, key) in classDetail" :key="value.id">
                        <div class="w-12 d-flex align-items-center">
                            <b>{{value.content}}</b>
                        </div>
                        <div class="w-88 d-flex">
                            <div class="w-25 text-center">
                                <div class="row-modal">
                                    <div class="p-eletment">
                                        <b-form-input name="join-date" type="datetime-local"
                                                      v-model="value.date"
                                                      :disabled="value.status !== 'coming_up'"
                                                      @blur="validateTime(value.date)"
                                                      class="input-radius"></b-form-input>
                                    </div>
                                </div>
                            </div>
                            <div class="w-25 text-center">
                                <div class="row-modal">
                                    <div class="p-eletment">
                                        <b-form-select :disabled="value.status !== 'coming_up'"
                                            :id="'radio-group-1' + key"
                                            :name="'radio-options' + key"
                                            :options="organOptions"
                                            v-model="value.organ">
                                        </b-form-select>
                                    </div>
                                </div>
                            </div>
                            <div class="w-25 text-center">
                                <div class="row-modal">
                                    <div class="d-flex p-eletment" v-if="value.organ === 'offline'">
                                        <single-select-station
                                            :placeholder="'Địa điểm tổ chức buổi ' + (key + 1)"
                                            :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                                            @handleSelectedStation="handleSelectedStation(key, ...arguments)"
                                            :isDisabled="value.status !== 'coming_up' ? true : false"
                                            :stationId="value.stationId"
                                        >
                                        </single-select-station>
                                    </div>
                                    <div class="d-flex p-eletment" v-if="value.organ === 'online'">
                                        <b-form-input
                                            :placeholder="'Điền link học buổi ' + (key + 1)"
                                            :disabled="value.status !== 'coming_up'"
                                            v-model="value.link"
                                        >
                                        </b-form-input>
                                    </div>
                                </div>
                            </div>
                            <div class="w-25 text-center">
                                <div class="row-modal">
                                    <div class="p-eletment">
                                        <single-select-user
                                            :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                                            :user="value.lecturerObject"
                                            @onChange="op => {value.lecturers = op ? op.id : null}"
                                            :placeholder="'Giảng viên buổi ' + (key + 1)"
                                            :isDisabled="value.status !== 'coming_up' ? true : false"
                                            :status-id="userStatus"
                                        ></single-select-user>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-collapse>
                <div class="class-title">
                    <span>Học viên</span>
                    <span class="number__element">{{numberStudent}} HV</span>
                    <a href="#" type="button" class="modal-collapse__button" :class="studentInfoVisible ? 'active' : ''"
                       v-b-toggle.student-info></a>
                </div>
                <b-collapse class="program" id="student-info" v-model="studentInfoVisible">
                    <div class="info-student">
                        <div class="d-flex row-modal" v-for="(stu, idx) in listStudents" :key="idx"
                             v-loading="loadingStudent">
                            <div class="w-45">
                                <span>{{stu.name}} | {{stu.username}}</span>
                            </div>
                            <div :class="edit ? 'w-35' : 'w-30'">
                                <span>Kho: {{stu.station}}</span>
                            </div>
                            <div class="w-20">
                                <span>Vị trí: {{stu.position}}</span>
                            </div>
                            <div class="w-5 text-end pr-1" v-if="!edit || type !== 'update'">
                                <i class="fas fa-trash-alt text-danger cursor-pointer" @click="deleteStudent(idx)"></i>
                            </div>
                        </div>
                    </div>
                    <div class="action-add-student">
                        <div class="d-flex row-modal mt-1">
                            <div class="w-100 mr-10">
                                <single-select-user
                                        :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                                        @select="handleSelectedStudent"
                                        placeholder="Chọn học viên"
                                        :reset="resetStudentSelected"
                                        :status-id="userStatus"
                                        :trainingSyllabusId="syllabus"
                                ></single-select-user>
                            </div>
                            <div class="w-19 text-right">
                                <b-btn variant="outline-ghtk" class="btn-add-student" @click="addStudent()">+ Thêm học
                                    viên
                                </b-btn>
                            </div>
                        </div>
                    </div>
                </b-collapse>
                <div class="class-title">
                    <span>Tài liệu</span>
                    <span class="number__element">{{numberFile}} TL</span>
                    <a
                      href="#" type="button" class="modal-collapse__button"
                      :class="documentInfoVisible ? 'active' : ''"
                      v-b-toggle.document-info
                    >
                    </a>
                </div>
                <b-collapse id="document-info" v-model="documentInfoVisible" v-if="syllabusDetail">
                    <div class="profile-document">
                        <template v-for="(classDocument, idxPeriodDoc) in classDetail || []">
                            <template v-for="(link, idxUpload) in classDocument.files || []">
                                <div :key="link + idxPeriodDoc + idxUpload" class="profile-document__element">
                                    <div class="document-type-desc">
                                        Tài liệu buổi {{ idxPeriodDoc + 1 }}
                                    </div>
                                    <div class="num-img-extend">
                                        <i class="icon ion-md-eye mr-2 cursor-pointer" @click="openLink(getUrl(link))"></i>
                                        <i class="icon ion-md-download cursor-pointer" @click="openLink(getUrl(link))"></i>
                                    </div>
                                    <i class="icon ion-md-close-circle cursor-pointer delete-icon-document" v-if="checkIsFileClass(classDocument, idxUpload)" @click="removeFile(idxPeriodDoc, idxUpload)"></i>
                                    <template>
                                      <span>
                                        <img
                                                v-if="['pdf', 'video', 'image', 'doc'].includes(helper.getFileType(link))"
                                                :class="idxUpload"
                                                class="image-document"
                                                :src="previewImageRender(link)"
                                                :alt="'Tài liệu buổi '+ idxPeriodDoc"
                                        />
                                      </span>
                                    </template>
                                </div>
                            </template>
                        </template>
                    </div>
                    <div class="profile-creator mt-1">
                        <template v-for="(classDocument, idxClass) in classDetail || []">
                            <template v-for="(creator, index) in classDocument.fileCreators || []">
                                    <div class="d-flex flex-column profile-creator__element" :key="creator.id + idxClass + index">
                                        <span class="text-black"><b>Người tạo:</b> {{helper.isEmpty(creator) ? '' : (creator.fullName + ' (' + creator.username + ')')}}</span>
                                        <span class="text-black"><b>Vị trí:</b> {{ helper.isEmpty(creator) ? '' : creator.positionName }}</span>
                                        <span class="text-black"><b>Thời gian tạo:</b>{{ helper.isEmpty(creator) ? '' : creator.created }}</span>
                                    </div>
                            </template>
                        </template>
                    </div>

                    <div class="text-center pt-4 py-4">
                        <b-btn variant="outline-ghtk" class="btn-add-class" @click="showModalEditDocument">+ Thêm tài liệu</b-btn>
                    </div>

                </b-collapse>
                <div class="text-center mb-2 row-modal-bottom">
                    <b-btn
                        variant="ghtk" class="btn-add-class" @click="!edit ? addClass() : updateClass()"
                        :disabled="disabledConfirm">Xác nhận
                    </b-btn>
                </div>
        </b-modal>

        <b-modal
            id="edit-documents" title="Tài liệu học" title-class="font-weight-bold w-100"
            header-class="text-center" modal-class="modal-custom-600" hide-footer
        >
            <template slot="modal-header">
                <h4 class="w-100 m-0 text-center">Tài liệu học</h4>
            </template>
            <EditDocument
                @action="action(...arguments)"
                @changeFile="changeFileByPeriod"
                :fileClass="tmpFileClass"
                :fileSyllabus="tmpFileSyllabus"
            />
        </b-modal>
    </div>
</template>

<style lang="scss" scoped>
    .hide-class {
      display: none;
    }
    .choose-class {
      cursor: pointer;
    }
    .base-info-class-container {
        display: flex;
        justify-content: space-between;
        max-height: 142px;
        overflow: auto;
        flex-wrap: wrap;
    }
    .border-ghtk {
        border: solid 2px rgba(0, 144, 74, 1) !important;
    }
    .base-info-class {
        width: 310px;
        height: 58px;
        margin-bottom: 26px;
        border: solid 1px rgba(196, 196, 196, 1);
        border-radius: 5px;
        padding: 6px 5px;
        overflow-y: auto;
    }
    .base-info-class::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    .pt-6-px {
        padding-top: 6px;
    }
    .delete-icon-document {
        position: absolute;
        right: 3px;
        top: -11px;
        z-index: 99999;
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
        top: 0;
        display: none;
        align-items: center;
        justify-content: center;
    }

    .profile-document__element:hover {
        .num-img-extend {
            display: flex;
        }
    }

    .profile-document .profile-document__element {
        padding: 0 10px;
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
        width: 20%;
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
                idth: fit-content;
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

    .btn-add-student {
        border-radius: 5px;
    }

    .btn-add-class {
        padding: 5px 25px;
        border-radius: 5px;
      width: 15%;
    }

    .program {
        padding: 7px 20px;
    }

    .row-pad-1 {
        padding: 5px 10px;
        width: 100%;
    }

    .row-pad-2 {
        padding: 10px 10px;
    }

    .class-title {
        background: #f1f1f1;
        padding: 10px 20px;
        font-weight: 600;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 16px;
    }
    .modal-title {
        font-size: 18px;
    }
    .p-10 {
        padding-right: 10px;
        padding-left: 10px;
    }

    .w-22 {
        width: 22% !important;
    }

    .w-78 {
        width: 78% !important;
    }

    .w-12 {
        width: 12% !important;
    }

    .w-88 {
        width: 88% !important;
    }

    .w-100 {
        width: 100% !important;
    }

    .w-50 {
        width: 50% !important;
    }

    .w-33 {
        width: 33.3% !important;
    }

    .w-25 {
        width: 25% !important;
    }

    .w-20 {
        width: 20% !important;
    }

    .w-81 {
        width: 81% !important;
    }

    .w-19 {
        width: 19% !important;
    }

    .w-45 {
        width: 45% !important;
    }

    .w-35 {
        width: 35% !important;
    }

    .w-20 {
        width: 20% !important;
    }

    .text-end {
        text-align: end;
    }

    .w-5 {
        width: 5% !important;
    }

    .w-2278 {
        width: 17.16% !important;
    }

    .w-7822 {
        width: 82.84% !important;
    }

    .student-info {
        font-size: 14px;
        font-weight: 500;
        padding: 5px 0;
    }

    .row-modal-top {
        padding-top: 12px;
        padding-bottom: 6px;
    }

    .row-modal-bottom {
        padding-top: 6px;
        padding-bottom: 6px;
    }

    .row-modal {
        padding-top: 6px;
        padding-bottom: 6px;
    }

    .p-eletment {
        padding-left: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .mr-10 {
        margin-right: 10px;
    }

    .modal-collapse__button {
        width: 2.5rem;
        position: absolute;
        right: 11px;
        bottom: 0;
        top: -6px;
    }

    .number__element {
        /*font-size: 18px;*/
        font-weight: 400;
        position: absolute;
        right: 47px;
    }

    .modal-collapse__button:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        right: 0;
        margin: 0;
        width: 0;
        height: 0;
        border-width: 4px 4px 0 4px;
        margin-left: -4px;
        border-color: #a3a4a6 transparent transparent transparent;
        border-style: solid;
    }

    .active.modal-collapse__button:before {
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .info-student {
        overflow-y: auto;
        max-height: 350px;
    }

    .info-student::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }
    .profile-document {
        height: 225px;
        overflow-x: auto;
        /*height: 100%;*/
        white-space: nowrap;
        padding: 20px 10px 0 10px;
    }
    .profile-creator {
        display: flex;
        padding: 0 10px;
    }
</style>

<script>
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'

import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import MultiSelectSyllabus from 'components/elements/common/MultiSelectSyllabus'
import MultiSelectUser from 'components/elements/common/MultiSelectUser'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import EditDocument from './EditDocument'
import MultiSelectClass from 'components/elements/common/MultiSelectClass'
import SingleSelectClass from 'components/elements/common/SingleSelectClass'

// service
import trainingService from 'domain/services/training-service'

// service

export default {
  name: 'modal-create-class',

  components: {
    SingleSelectStation,
    EditDocument,
    MultiSelectSyllabus,
    MultiSelectUser,
    SingleSelectUser,
    MultiSelectClass,
    SingleSelectClass
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
    }
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
    listClassPending: [],
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
    detailClass: {
      nameClass: null,
      regionClass: null,
      countStudentClass: 0,
      show: false,
      open: false
    }
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
    numberStudent: function () {
      return (this.dataClassInfo && Object.keys(this.dataClassInfo).length > 0) ? this.dataClassInfo.listStudents.length : 0
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
    },
    classId (newVal, oldVal) {
      console.log(newVal, oldVal, 'classId')
      if ((oldVal || Object.keys(this.classInfo).length === 0) && newVal) this.getClasses()
    }
  },

  methods: {
    changeFileByPeriod (option) {
      this.tmpFileClass = this.classDetail[option - 1].fileClass
      this.tmpFileSyllabus = this.classDetail[option - 1].fileSyllabus
    },
    getClassPeriodCss (periods) {
      let count = periods.length
      switch (count) {
        case 1:
          return 'w-100'
        case 2:
          return 'w-50'
        case 3:
          return 'w-33'
        case 4:
          return 'w-25'
        case 5:
          return 'w-20'
        default:
          return 'w-33'
      }
    },

    getUrl (file) {
      console.log(file)
      if (helper.isEmpty(file)) return null
      if (typeof file === 'string') return file
      return URL.createObjectURL(file)
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    getClasses () {
      if (!this.classId) return
      const params = {
        classId: this.classId
      }

      trainingService.getClasses(params)
        .then((res) => {
          if (res.data.success) {
            // list classes
            this.dataClassInfo = res.data.data.data[0]
            this.checkClassInfo(this.dataClassInfo)
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    showModal () {
      this.checkClassInfo()
      if (this.type === 'confirm') {
        this.getBaseClassInfo()
      }
    },
    getBaseClassInfo () {
      trainingService.getBaseClassInfo()
        .then((res) => {
          if (res.data.success) {
            this.listClassPending = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    checkClassInfo (dataClassInfo) {
      this.resetData()
      this.dataClassInfo = dataClassInfo || this.classInfo

      if (this.dataClassInfo && Object.keys(this.dataClassInfo).length > 0) {
        // format trương tình + người phụ trách
        this.syllabus = this.dataClassInfo.class.tp_id
        this.classId = this.dataClassInfo.class.id
        if (this.dataClassInfo.class.curator && this.dataClassInfo.class.curator.User) {
          this.personInChange = {
            id: this.dataClassInfo.class.curator.User.id,
            name: `${this.dataClassInfo.class.curator.User.username} - ${this.dataClassInfo.class.curator.User.fullname} - ${this.dataClassInfo.class.curator.ErpPosition.position_name} - ${this.dataClassInfo.class.curator.Station.name}`
          }
        }

        // format thông tin học viên
        this.dataClassInfo.listStudents.forEach(stu => {
          this.listStudents.push({
            id: stu.user_id,
            name: stu.fullname,
            image_profile: stu.image_profile,
            username: stu.username,
            position: stu.position,
            station: stu.station
          })
        })
        // format thông tin buổi học
        if (this.dataClassInfo.class.periods) {
          this.classDetail.splice(0, this.classDetail.length)
          this.dataClassInfo.class.periods.forEach(period => {
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
              fileClass: period.fileClass,
              fileSyllabus: period.fileSyllabus,
              files: period.files,
              fileCreators: period.fileCreators,
              lecturerObject: {
                id: period.ErpTpClassPeriod.teacher.User ? period.ErpTpClassPeriod.teacher.User.id : null,
                name: period.ErpTpClassPeriod.teacher.User ? `${period.ErpTpClassPeriod.teacher.User.username} - ${period.ErpTpClassPeriod.teacher.User.fullname} - ${period.ErpTpClassPeriod.teacher.ErpPosition.position_name} - ${period.ErpTpClassPeriod.teacher.Station.name}` : null
              }
            })
          })
        }
      }
    },
    action (action, idx) {
      if (action.action === 'new-file') {
        this.classDetail[idx - 1].fileClass.push(action.data.file)
        this.classDetail[idx - 1].files.push(action.data.file)
      }
      if (action.action === 'delete-file') {
        let numberFileSyllabus = this.classDetail[idx - 1].fileSyllabus.length
        this.classDetail[idx - 1].fileClass.splice(action.data.idx, 1)
        this.classDetail[idx - 1].files.splice(action.data.idx + numberFileSyllabus, 1)
      }
      if (action.action === 'close') {
        this.$bvModal.hide('edit-documents')
      }
    },

    removeFile (idxPeriodDoc, idxUpload) {
      let numberFileSyllabus = this.classDetail[idxPeriodDoc].fileSyllabus.length
      this.classDetail[idxPeriodDoc].files.splice(idxUpload, 1)
      this.classDetail[idxPeriodDoc].fileClass.splice(idxUpload - numberFileSyllabus, 1)
    },

    showModalEditDocument () {
      this.$bvModal.show('edit-documents')
    },

    async getTrainingProgram (syllabus) {
      let params = {
        syllabus: syllabus
      }

      this.lessonInfoVisible = true
      this.documentInfoVisible = true
      const {data} = await trainingService.getTrainingProgram(params)
      this.syllabusDetail = data.data
      if (!this.edit) {
        let tmp = []
        if (this.syllabusDetail) {
          this.syllabusDetail.tpPeriod.forEach((period) => {
            tmp.push({
              tpPeriodId: period.id,
              lecturers: null,
              date: null,
              time: null,
              fileClass: [],
              originCount: period.files ? period.files.length : 0,
              organ: period.form !== 'all' ? period.form : null,
              stationId: null,
              isDisableOrgan: this.disableForm(period.form)
            })
          })
        }
        this.classDetail = tmp
      } else if (this.classInfo && Object.keys(this.classInfo).length > 0 && this.classInfo.class.id) {
        this.getStudentByClassId(this.classInfo.class.id)
      }
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
        if (this.type !== 'confirm') {
          return {
            'status': false,
            'message': 'Bạn phải chọn người phụ trách!'
          }
        }
      }
      var classInformation = this.classDetail
      if (!classInformation) {
        return {
          'status': false,
          'message': 'Bạn phải điền đầy đủ thông tin các buổi học!'
        }
      } else {
        for (const element of classInformation) {
          if (!element.date || !element.lecturers || !element.organ || !element.tpPeriodId) {
            return {
              'status': false,
              'message': 'Bạn phải điền đầy đủ thông tin các buổi học!'
            }
          }
          if (element.organ === 'offline' && !element.stationId) {
            return {
              'status': false,
              'message': 'Bạn phải điền đầy đủ thông tin các buổi học!'
            }
          }
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
      this.classDetail.forEach((period, i) => {
        period.fileClass.forEach((f, j) => {
          if (f.name) formData.append(i + '[' + j + ']', f)
        })
      })
      formData.append('classDetail', JSON.stringify(this.classDetail))

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

    updateClass () {
      let validatorResult = this.checkData()
      if (validatorResult.status === false) {
        helper.showMessage(validatorResult.message, 'warning')
        return
      }
      this.disabledConfirm = true

      let formData = new FormData()
      formData.append('syllabus', this.syllabus)
      formData.append('type', this.type)
      formData.append('class_id', this.dataClassInfo.class.id)
      if (this.personInChange.id) {
        formData.append('pic', this.personInChange.id)
      }
      formData.append('listStudents', JSON.stringify(this.listStudents))
      this.classDetail.forEach((period, i) => {
        period.fileClass.forEach((f, j) => {
          if (f.name) formData.append(i + '[' + j + ']', f)
        })
      })
      formData.append('classDetail', JSON.stringify(this.classDetail))
      this.$startLoading()
      trainingService.updateClass(formData)
        .then((res) => {
          if (res.data.success) {
            if (this.type === 'confirm') {
              this.confirmClass()
            } else {
              this.$emit('updateOk')
              this.hideModal()
            }
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
        open: false
      }
      this.lessonInfoVisible = false
      this.documentInfoVisible = false
      this.resetData()
    },
    handleSyllabusSelected: function (option) {
      this.listStudents = []
      this.syllabus = option ? option.id : ''
    },
    handleSelectedClass (option) {
      this.classId = option ? option.id : ''
    },
    selectedClass (classInfo) {
      this.lessonInfoVisible = true
      this.documentInfoVisible = true
      this.classId = classInfo.class_id
      this.detailClass.countStudentClass = classInfo.numberAcademy
      this.detailClass.nameClass = classInfo.content
      this.detailClass.regionClass = classInfo.province
      this.detailClass.show = true
      this.detailClass.open = true
    },

    /*
      * Gán data id của người phụ trách lớp học
      * @parm: option: người phụ trách đã chọn (chọn 1 người)
      */
    selectPersonInChange (option) {
      this.personInChange = option || {}
    },
    handleSelectedStation: function (key, option) {
      this.classDetail[key].stationId = option ? option.id : ''
      this.chooseStudents()
    },
    handleSelectedStudent: function (option) {
      this.student = option ? option.name : null
      this.studentId = option ? option.id : null
    },
    addStudent () {
      this.resetStudentSelected = !this.resetStudentSelected
      if (!this.student) return
      let student = this.student.split(' - ')
      this.listStudents.push({
        id: this.studentId,
        name: student[1],
        username: student[0],
        station: student[3],
        position: student[2]
      })
      this.student = null
      this.studentId = null
    },

    deleteStudent (idx) {
      this.listStudents.splice(idx, 1)
    },

    formatDate (date, format) {
      return moment(date || null).format(format || 'DD-MM-YYYY')
    },

    resetData () {
      this.syllabus = null
      this.personInChange = {}
      // this.syllabusDetail = null
      this.classDetail = []
      this.listStudents = []
      this.student = null
      this.classId = null
      this.studentId = null
    },

    checkIsFileClass (classDocument, idx) {
      return idx >= classDocument.fileSyllabus.length
    },

    previewImageRender (file) {
      if (helper.isEmpty(file)) return ''
      let fileType = helper.getFileType(file)
      if (fileType === 'doc') return 'https://gs.giaohangtietkiem.vn/d/e24bec4ee88441bdb3e79466dd541152.png?height=250'
      if (typeof file === 'object') {
        if (fileType === 'pdf') return 'https://gs.giaohangtietkiem.vn/d/d7d5ef9e764e4227b7aef2c11dfd1371.pngheight=250'
        if (fileType === 'video') return 'https://ghtk.me/images/icon-file-video.png?height=250'
        if (fileType === 'image') return URL.createObjectURL(file)
      } else {
        // là file đã được uplaod lên server
        if (['pdf', 'video'].includes(fileType)) return file + '?extract=thumb'
      }

      return file
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
              res.data.data.forEach((stu) => {
                this.listStudents.push({
                  id: stu.user_id,
                  name: stu.fullname,
                  username: stu.username,
                  station: stu.station_name,
                  position: stu.position_name
                })
              })
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
      if (!classId) {
        return
      }
      trainingService.getStudentByClassId({classId: classId})
        .then((res) => {
          if (res.data.success) {
            this.listStudents = []
            res.data.data.forEach((stu) => {
              this.listStudents.push({
                id: stu.user_id,
                name: stu.fullname,
                username: stu.username,
                station: stu.station_name,
                position: stu.position_name
              })
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    toggleChoose () {
      this.detailClass.open = !this.detailClass.open
    },
    validateTime (time) {
      let timeCurrent = new Date().toLocaleTimeString()
      let timeCheck = new Date(time).toLocaleTimeString()
      if (timeCurrent < timeCheck) {
        helper.showMessage('Thời gian không được là quá khứ!', 'warning')
      }
    }
  }
}
</script>
