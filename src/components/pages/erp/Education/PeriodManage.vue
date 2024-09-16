<template>
  <div v-loading="loading">
    <div v-for="(lecture, idx) in lectures" class="" :key="`period-${idx}`">
      <hr v-if="idx > 0"/>
      <div class="font-weight-bold mx-4 text-black">
        Buổi {{ idx + 1 }}
      </div>
      <div class="row mt-2 mx-4">
        <div class="col-md-2 mt-2 text-left pl-0 text-black">Tự học</div>
        <CheckboxCustom @change="changeFormPeriod(lecture, ...arguments)" :is-checked="lecture.form == 'self'"
                        :id="'period' + idx"></CheckboxCustom>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Nội dung<span class="text-danger ml-1">*</span></label>
        <b-form-input
          placeholder="Nội dung"
          class="rounded col-md-10 text-center"
          size="xs"
          :disabled="viewOnly"
          type="text"
          @input="handleContentChange(lecture, ...arguments)"
          v-model="lecture.content"
        />
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Giảng viên<span class="text-danger ml-1">*</span></label>
        <multi-select-position
          class="col-md-10 p-0 multiselect-ghtk multiselect-no-horizontal multiselect-center-placeholder"
          :auto-close="false"
          :placeholder="'Chọn vị trí giảng viên'"
          :disabled="viewOnly"
          :position-ids="lecture.teacher_position"
          @handlePositionSelected="(ops) => {lecture.teacher_position = ops ? ops.map(item => item.id).toString() : ''}"
        ></multi-select-position>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Tài liệu</label>
        <InputLesson @action="action(...arguments)" :type="type" :lessons="lecture.lessons" :lectureId="idx"></InputLesson>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Bài kiểm tra<span
          class="text-danger ml-1">*</span></label>
        <button v-if="(type === 'add' && helper.isEmpty(lecture.test.questions) || (type === 'edit' && !lecture.hasOwnProperty('id') && helper.isEmpty(lecture.test.questions)))"
                class="col-md-10 btn btn-outline-ghtk text-center rounded"
                @click="action({action: 'edit-test'}, lecture)">
          {{ manageTestDesc(lecture && lecture.test && lecture.test.questions) }}
        </button>
        <div class="col-md-10 d-flex p-0" v-else>
          <b-form-input
            class="text-center d-inline-block"
            :value="lecture.test.code"
            type="text"
            readonly
          />
          <button class="btn btn-outline-ghtk text-center rounded w-5 d-inline-flex justify-content-center"
                  @click="action({action: 'edit-test'}, lecture)">
            <i class="fas fa-pencil-alt pt-1"></i>
          </button>
          <button class="btn btn-outline-ghtk text-center rounded w-5 d-inline-flex justify-content-center"
                  @click="showModalDetailTest(lecture.id)">
            <i class="ion ion-md-eye pt-1"></i>
          </button>
        </div>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Thời gian làm bài (phút)<span
          class="text-danger ml-1">*</span></label>
        <div class="group-input-action col-md-10 p-0">
          <b-form-input
            placeholder="Thời gian làm bài (phút)"
            class="rounded text-center"
            size="xs"
            :disabled="viewOnly"
            type="number"
            v-model="lecture.max_test_time"
          />
          <div class="group-action group-input-action__remove" @click="decreaseMaxTime(lecture)">
            <i class="ion ion-md-remove"></i>
          </div>
          <div class="group-action group-input-action__add" @click="increaseMaxTime(lecture)">
            <i class="ion ion-md-add"></i>
          </div>
        </div>
      </div>
      <div class="row mt-2 mx-4">
        <label class="col-md-2 mt-2 text-left pl-0 text-black">Số lần làm lại bài</label>
        <div class="group-input-action col-md-10 p-0">
          <b-form-input
            placeholder="Số lần làm lại bài"
            class="rounded text-center w-100"
            size="xs"
            :disabled="viewOnly"
            type="number"
            v-model="lecture.max_retest_total"
          />
          <div class="group-action group-input-action__remove" @click="decreaseMaxRetestTotal(lecture)">
            <i class="ion ion-md-remove"></i>
          </div>
          <div class="group-action group-input-action__add" @click="increaseMaxRetestTotal(lecture)">
            <i class="ion ion-md-add"></i>
          </div>
        </div>
      </div>
    </div>
    <LessonFileDropzone @actionUploadLesson="actionUploadLesson(...arguments)" :trigger-upload="trigger.upload" :lecture-id="cur_lectureId" :cur_lesson="cur_lesson"/>
    <b-modal
      class="modal-test"
      modal-class="modal-xxl"
      id="edit-period-test"
      title-class="font-weight-bold w-100 pl-5"
      header-class="text-center"
      :title="manageTestDesc(cur_lecture && cur_lecture.test && cur_lecture.test.questions)"
      @hidden="trigger.reset_test_data = !trigger.reset_test_data"
      hide-footer
      static
    >
      <PeriodTest
        @action="action(...arguments)"
        :reset-data="trigger.reset_test_data"
        :test="cur_lecture.test"
        :type="type"
        :trigger-get-questions="trigger.get_question"
      />
    </b-modal>
    <b-modal
      class="modal-test"
      modal-class="modal-xxl"
      id="edit-quiz"
      title-class="font-weight-bold w-100 pl-5"
      header-class="text-center"
      :title="manageQuizDesc(cur_lesson.quiz)"
      hide-footer
      static
    >
      <ModalQuiz
        @action="action(...arguments)"
        :quiz="cur_lesson.quiz"
        :type="type"
        :trigger-get-questions="trigger.get_quiz"
      />
    </b-modal>
    <ModalDetailTest :tp-period-id="tpPeriodId"></ModalDetailTest>
    <ModalDetailQuiz @action="action(...arguments)" :quiz="cur_lesson.quiz"></ModalDetailQuiz>
  </div>
</template>

<script>
// custom components
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import PeriodTestBuilder from './PeriodTestBuilder'
import PeriodTest from './PeriodTest'
import CheckboxCustom from './CheckboxCustom'
import InputLesson from './InputLesson.vue'

import helper from 'infrastructures/helpers/common-helpers'
// import trainingService from 'domain/services/training-service'
import trainingQuestionsService from '../../../../domain/services/training-questions-service'
import ModalDetailTest from './ModalDetailTest.vue'
import EditPeriodDocuments from './edit-period-documents.vue'
import ModalQuiz from './Lesson/LessonQuiz.vue'
import ModalDetailQuiz from './Lesson/ModalDetailQuiz.vue'
import LessonFileDropzone from './Lesson/LessonFileDropzone.vue'
import linkDefault from '@/const/linkDefault'

export default {
  name: 'edit-period',
  data () {
    return {
      accept_file: ['pdf', 'video', 'image', 'doc'],
      loading: false,
      test_pdf: null,
      cur_lecture: {
        name: '',
        files: []
      },
      cur_lectureId: null,
      cur_lesson: {
        title: ''
      },
      defaultQuiz: {
        isEdit: false,
        delete_questions: [],
        add_questions: [],
        questions: []
      },
      trigger: {
        get_quiz: false,
        get_question: false,
        reset_test_data: false,
        upload: false
      },
      test: false,
      tpPeriodId: null
    }
  },

  components: {
    LessonFileDropzone,
    ModalDetailQuiz,
    ModalQuiz,
    EditPeriodDocuments,
    InputLesson,
    CheckboxCustom,
    MultiSelectPosition,
    PeriodTest,
    PeriodTestBuilder,
    ModalDetailTest
  },
  props: {
    lectures: {
      type: Array,
      default: () => []
    },
    type: {
      default: 'edit'
    },
    syllabus: {
      default: () => {}
    }
  },
  computed: {
    helper: function () {
      return helper
    },
    viewOnly () {
      return this.type === 'view'
    }
  },
  watch: {
    'syllabus.code': function (newVal) {
      this.lectures.map(lecture => {
        lecture.test.code = [newVal, lecture.content].filter(t => t).join(' - ')
      })
      this.$forceUpdate()
    }
  },
  methods: {
    showModalDetailTest (tpPeriodId) {
      this.tpPeriodId = tpPeriodId
      this.$bvModal.show('modal-detail-test')
    },

    actionUploadLesson (action, file) {
      if (action.action === 'upload-all-file-success') {
        this.$emit('disableSubmit', false)
        return
      }

      const lesson = this.lectures[this.cur_lectureId].lessons.find(lesson => lesson.uploadId === file.lessonUploadId)

      if (lesson) {
        switch (action.action) {
          case 'start-upload':
            lesson.progress = 0
            lesson.uploading = true
            this.$emit('disableSubmit', true)
            break
          case 'upload-progress':
            lesson.progress = file.progress
            break
          case 'upload-file-success':
            lesson.fileId = file.file_id

            if (file.storage === 'gdrive') {
              lesson.fileUrl = file.links.gdrive
            } else {
              lesson.fileUrl = file.links.direct
            }

            if (file.links.thumbnail) {
              lesson.fileThumbnail = file.links.thumbnail
            } else {
              lesson.fileThumbnail = file.file_type === 'image' ? file.links.direct : linkDefault.DEFAULT_THUMBNAIL
            }

            lesson.uploading = false

            helper.showMessage('Upload tài liệu thành công', 'success')
            break
          case 'upload-file-error':
            lesson.uploading = false
            helper.showMessage(file.error.response.message, 'warning')
            break
        }
      }
    },
    action (action, data) {
      // các thao tác với file tài liệu học
      if (action.action === 'delete-doc') {
        if (this.type !== 'add' && data.idLessonDelete !== null) {
          this.lectures[data.lectureId].lessons_delete.push(data.idLessonDelete)
        }
        this.lectures[data.lectureId].lessons = data.lessons
      }
      if (action.action === 'edit-period-docs') {
        this.cur_lesson = data.cur_lesson
        this.cur_lectureId = data.lectureId
        let oldLesson = this.lectures[this.cur_lectureId].lessons.find(obj => obj.order_number === this.cur_lesson.order_number)
        if (oldLesson) {
          Object.assign(oldLesson, this.cur_lesson)
        } else {
          this.lectures[this.cur_lectureId].lessons.push(this.cur_lesson)
        }
        this.trigger.upload = !this.trigger.upload
      }
      if (action.action === 'delete-file') {
        data.cur_lesson.fileUrl = ''
        data.cur_lesson.fileId = null
        data.cur_lesson.fileThumbnail = null
      }
      // end các thao tác với file tài liệu học
      // các action với test
      if (action.action === 'edit-test') {
        // data.test.name = data.content
        this.cur_lecture = data
        this.trigger.get_question = !this.trigger.get_question
        this.$bvModal.show('edit-period-test')
      }
      if (action.action === 'change-test') {
        this.cur_lecture.test = action.data
      }
      if (action.action === 'submit-test') {
        this.cur_lecture.test.questions = action.data // gán giá trị câu hỏi đã chọn sau khi submit
        if (action.hasOwnProperty('dataStorage')) {
          this.cur_lecture.test.dataStorage = action.dataStorage
        }
        if (this.type === 'edit' && action.isEdit) {
          this.cur_lecture.isEdit = 1
        }
        this.generateTestPdf(action.data)
        this.$bvModal.hide('edit-period-test')
      }
      if (action.action === 'update-test-categories') {
        // hiển thị tên bài
        // this.cur_lecture.test_category = action.data.category_desc
        this.cur_lecture.test.code = [this.syllabus.code, this.cur_lecture.content].filter(t => t).join(' - ')
        this.cur_lecture.test.category_id = action.data.category_id
      }
      // end các action với test
      // quiz
      if (action.action === 'view-quiz') {
        this.cur_lesson = data.cur_lesson
        this.cur_lectureId = data.lectureId
        this.$bvModal.show('modal-detail-quiz')
      }
      if (action.action === 'update-quiz') {
        this.$bvModal.hide('modal-detail-quiz')
        this.trigger.get_quiz = !this.trigger.get_quiz
        this.cur_lesson.quiz.isEdit = true
        this.$bvModal.show('edit-quiz')
      }
      if (action.action === 'edit-quiz') {
        this.cur_lesson = data.cur_lesson
        this.cur_lectureId = data.lectureId
        this.trigger.get_quiz = !this.trigger.get_quiz
        this.$bvModal.show('edit-quiz')
      }
      if (action.action === 'delete-quiz-from-detail') {
        let lesson = this.lectures[this.cur_lectureId].lessons.find(obj => obj.order_number === this.cur_lesson.order_number)
        if (lesson.hasOwnProperty('id')) {
          lesson.quiz.isEdit = false
          lesson.quiz.delete_questions = JSON.parse(JSON.stringify(lesson.quiz.questions))
          lesson.quiz.questions = []
        } else {
          lesson.quiz = JSON.parse(JSON.stringify(this.defaultQuiz))
        }
        helper.showMessage('Xóa câu hỏi thành công!', 'success')
        this.$bvModal.hide('modal-detail-quiz')
      }
      if (action.action === 'submit-quiz') {
        this.cur_lesson.quiz.questions = action.questions
        this.cur_lesson.quiz.add_questions = action.addQuestion
        this.cur_lesson.quiz.delete_questions = action.deleteQuestion
        let oldLesson = this.lectures[this.cur_lectureId].lessons.find(obj => obj.order_number === this.cur_lesson.order_number)
        Object.assign(oldLesson, this.cur_lesson)
        if (action.hasOwnProperty('dataStorage')) {
          this.cur_lesson.quiz.dataStorage = action.dataStorage
        }
        if (this.cur_lesson.quiz.isEdit) {
          helper.showMessage('Sửa câu hỏi thành công!!', 'success')
        } else {
          helper.showMessage('Thêm câu hỏi thành công!', 'success')
        }
        this.$bvModal.hide('edit-quiz')
      }
      // end quiz
    },
    handleContentChange (lecture, value) {
      lecture.test.code = [this.syllabus.code, value].filter(t => t).join(' - ')
    },
    async generateTestPdf (questions) {
      if (questions.length === 0 || !questions) {
        return helper.showMessage('Bài kiểm tra chưa có câu hỏi', 'warning')
      }
      let params = {
        question_ids: questions.map((item) => item.id)
      }
      try {
        this.loading = true
        const {data} = await trainingQuestionsService.generateTestPdfNew({params})
        if (data.success) {
          let urlGs = 'https://cache.giaohangtietkiem.vn'
          this.cur_lecture.test.pdf = data.data.file
          this.cur_lecture.test.original_file = data.data.origin_file.slice(urlGs.length)
          this.cur_lecture.test.file = data.data.file.slice(urlGs.length)
          let mes = 'Tạo bài kiểm tra thành công'
          if (this.type === 'edit') {
            mes = 'Chỉnh sửa bài kiểm tra thành công'
          }
          helper.showMessage(mes, 'success')
        } else helper.showMessage(data.message)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    manageTestDesc (question) {
      if (this.type === 'view') return 'Xem bài kiểm tra'
      if (helper.isEmpty(question)) return 'Tạo bài kiểm tra'
      return 'Sửa bài kiểm tra'
    },
    changeFormPeriod (lecture, checked) {
      if (checked) {
        lecture.form = 'self'
      } else {
        lecture.form = 'offline'
      }
    },

    decreaseMaxTime (lecture) {
      lecture.max_test_time = parseInt(lecture.max_test_time) - 5
    },

    increaseMaxTime (lecture) {
      lecture.max_test_time = parseInt(lecture.max_test_time) + 5
    },

    decreaseMaxRetestTotal (lecture) {
      lecture.max_retest_total = parseInt(lecture.max_retest_total) - 1
    },

    increaseMaxRetestTotal (lecture) {
      lecture.max_retest_total = parseInt(lecture.max_retest_total) + 1
    },
    manageQuizDesc (quiz) {
      if (!helper.isEmpty(quiz) && quiz.isEdit) return 'Sửa câu hỏi'
      return 'Thêm câu hỏi'
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  &-active {
    .file-label-inner {
      border: 2px dotted #069255;
      text-align: center;
      color: #069255;
      z-index: 1;
      width: 100%;
      height: 2em;
      margin: 0 !important;
      padding-top: 0.2rem;
    }
    .file-icon {
      font-size: medium;
    }
    .file-description {
      font-weight: 500;
    }
    .num-file-extend {
      text-align: center;
      font-size: x-large;
      color: #fff;
      background-color: rgba(0,0,0,.47);
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
      width: 12em;
      height: 8.1em !important;
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
      height: 9.1rem;
    }
    .file-icon {
      position: absolute;
      font-size: xxx-large;
      top: 25%;
      left: 0;
      right: 0;
    }
    .file-description {
      font-weight: 500;
      font-size: large;
      position: absolute;
      top: 62%;
      left: 0;
      right: 0;
    }
  }
}
.modal-test /deep/ .modal-body {
  background-color: #F9FFFC;
  padding: 1.2rem 0.5rem;
}
.modal-test /deep/ .modal-dialog {
  max-width: 98% !important;
  width: 66vw !important;
  margin-top: 0 !important;
}

.modal-test /deep/ .modal-title {
  font-size: 18px;
  width: 100%;
}
.group-input-action {
  position: relative;
  width: 80%;

  &__remove {
    left: 3px;
    top: 4px;
    border-right: 1px solid #BDBDBD;
  }
  &__add {
    right: 3px;
    top: 4px;
    border-left: 1px solid #BDBDBD;
  }
}
.group-action {
  position: absolute;
  cursor: pointer;
  color: #069255;
  width: 31px;
  z-index: 1;
  background-color: white;
  height: 30px;
  text-align: center;
  line-height: 36px;
}
/* Any additional styling can be applied here */
.button-close {
  position: absolute;
  top: -10px;
  right: -10px;
  /* Adjust styles for close button as needed */
}
</style>
