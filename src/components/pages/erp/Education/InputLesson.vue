<template>
  <div class="col-md-10 text-center m-0 p-0">
    <draggable class="col-md-12 row text-center m-0 p-0" v-model="lessons" draggable=".item" @change="onChange">
      <b-card v-for="(lesson, idx) in lessons" :key="`lesson-${lectureId}-${idx}`"
              class="col-sm-12 col-md-4 col-lg-4 col-xl-3 shadow-sm rounded item mb-2 ml-0 mr-3 mt-2">
        <span class="button-close cursor-pointer text-danger" @click="removeAt(idx)">
          <i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
        </span>
        <div
          class="position-relative thumbnail__element"
          :class="lesson.fileThumbnail ? 'preview-active' : 'preview-disable'"
        >
          <div v-if="lesson.fileThumbnail">
                  <img
                    :src="previewImageRender(lesson.fileThumbnail)"
                    class="mw-100 document-preview"
                    alt=""
                  />
          </div>
          <div v-if="lesson.fileThumbnail && !lesson.uploading" class="document-extend mb-1">
            <!-- Xem tài liệu học -->
            <span class="action-document cursor-pointer d-inline-flex mb-1" @click="action({action: 'open-link'}, lesson.fileUrl)">
              <i class="far fa-eye font-10 text-ghtk"></i>
              <span class="text-ghtk">Xem</span>
            </span>
            <!-- Thay thế tài liệu học -->
            <span class="action-document cursor-pointer d-inline-flex mt-1 mb-1" @click="action({action: 'edit-period-docs'}, lesson)">
              <i class="fas fa-pencil-alt text-ghtk"></i>
              <span class="text-ghtk">Thay thế</span>
            </span>
            <!-- Xóa câu hỏi nhanh -->
            <span class="action-document text-danger cursor-pointer d-inline-flex mt-1" @click="action({action: 'delete-file'}, lesson)">
                <i class="fa fa-trash-alt"></i>
                <span>Xóa</span>
            </span>
          </div>
          <div v-else-if="lesson.uploading" :class="lesson.fileThumbnail ? 'progress-extend mb-1' : 'file-label-inner'">
            <b-progress class="progress-lesson" :value="lesson.progress" :max="100" show-progress animated variant="success"></b-progress>
            <b class="file-description">Đang upload file</b>
          </div>
          <div v-else class="file-label-inner" @click="action({action: 'edit-period-docs'}, lesson)">
            <i class="fas fa-plus file-icon"></i>
            <b class="file-description">Tài liệu học</b>
          </div>
        </div>
        <div class="text-truncate w-100 border-bottom border-success mt-2"
             :class="lesson.isEdit ?  'd-none' : 'd-inline-block'"
             v-b-popover.hover.top="`${lesson.order_number + '. ' + lesson.title}`"
             @click="updateTitileLesson(lesson.order_number)"
        >
          {{lesson.title === ''? 'Vui lòng chọn để nhập tiêu đề' : `${lesson.order_number + '. ' + lesson.title}`}}
        </div>
        <textarea
          v-model="lesson.title"
          class="mt-1 rounded text-center w-100 p-0"
          :class="lesson.isEdit ? 'd-inline-block' : 'd-none'"
          placeholder="Nhập tiêu đề tài liệu"
          v-on:focusout="updateTitleLesson"
          maxlength="70"
          :ref='`textarea-lesson-title-${lectureId}-${lesson.order_number}`'
        />
        <button v-if="helper.isEmpty(lesson.quiz.questions)" class="mt-1 btn btn-outline-ghtk text-center rounded w-100"
                :class=" helper.isEmpty(lesson.title) || helper.isEmpty(lesson.fileId) ? 'disable-button' : ''"
                :disabled="helper.isEmpty(lesson.title) || helper.isEmpty(lesson.fileId)"
                @click="action({action: 'edit-quiz'}, lesson)"
        >
          <i class="fas fa-plus pt-1"></i><span> Câu hỏi</span>
        </button>
        <button v-else class="mt-1 btn btn-outline-ghtk text-center rounded w-100"
                @click="action({action: 'view-quiz'}, lesson)"
        >
          <span>Xem câu hỏi</span>
        </button>
      </b-card>
      <b-card v-if="type !== 'view'"  slot="footer" class="col-sm-12 col-md-4 col-lg-4 col-xl-3 shadow-sm rounded mb-2 ml-0 mr-2 mt-2">
        <div class="position-relative cursor-pointer preview-disable"
             @click="addByDefaultLesson"
        >
          <div class="file-label-inner">
            <i class="fas fa-plus file-icon"></i>
            <b class="file-description">Tài liệu học</b>
          </div>
        </div>
        <textarea
          class="mt-1 rounded text-center w-100 p-0"
          v-model="defaultLesson.title"
          placeholder="Nhập tiêu đề tài liệu"
          maxlength="70"
          v-on:focusout="addTitlleByDefaultLesson"
        />
        <button disabled class="mt-1 btn btn-outline-ghtk text-center rounded w-100 disable-button">
          <i class="fas fa-plus pt-1"></i><span> Câu hỏi</span>
        </button>
      </b-card>
    </draggable>
  </div>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import draggable from 'vuedraggable'
import ModalQuiz from './Lesson/LessonQuiz.vue'
import EditPeriodDocuments from './edit-period-documents.vue'
export default {
  props: {
    lectureId: {
      default: 0
    },
    type: {
      default: 'edit'
    },
    lessons: []
  },
  components: {
    EditPeriodDocuments,
    ModalQuiz,
    draggable
  },
  data () {
    return {
      accept_file: ['pdf', 'video', 'image', 'doc'],
      cur_lesson: {
        title: ''
      },
      defaultLesson: {
        order_number: 1,
        title: '',
        fileUrl: '',
        fileId: null,
        fileThumbnail: null,
        isEdit: false,
        uploading: false,
        progress: 0,
        quiz: {
          isEdit: false,
          delete_questions: [],
          add_questions: [],
          questions: []
        }
      }
    }
  },
  watch: {
  },
  computed: {
    helper: function () {
      return helper
    },
    viewOnly () {
      return this.type === 'view'
    }
  },
  methods: {
    // các thac tác trong component
    action (action, data) {
      // các thao tác với file tài liệu học
      if (action.action === 'edit-period-docs') {
        data.uploadId = helper.generateUniqueId()
        this.cur_lesson = data
        this.$emit('action', {action: 'edit-period-docs'}, {cur_lesson: this.cur_lesson, lectureId: this.lectureId})
      }
      if (action.action === 'delete-file') {
        this.cur_lesson = data
        this.$emit('action', {action: 'delete-file'}, {cur_lesson: this.cur_lesson, lectureId: this.lectureId})
      }
      if (action.action === 'open-link') {
        helper.openLink(this.getUrl(data))
      }
      // end các thao tác với file tài liệu học
      // các thao tác với quiz
      if (action.action === 'view-quiz') {
        this.cur_lesson = data
        this.$emit('action', {action: 'view-quiz'}, {cur_lesson: this.cur_lesson, lectureId: this.lectureId})
      }
      if (action.action === 'edit-quiz') {
        this.cur_lesson = data
        this.$emit('action', {action: 'edit-quiz'}, {cur_lesson: this.cur_lesson, lectureId: this.lectureId})
      }
      // end các thao tác với quiz
    },
    // thêm tài liệu học qua phần tử mặc định
    addByDefaultLesson () {
      let totalLesson = this.lessons.length
      this.defaultLesson.order_number = ++totalLesson // số thứ tự của bài học
      if (this.defaultLesson.title !== '') {
        this.defaultLesson.title = ''
      }
      this.cur_lesson = JSON.parse(JSON.stringify(this.defaultLesson))
      this.action({action: 'edit-period-docs'}, this.cur_lesson)
    },
    // thêm tiêu đề tài liệu qua phần tử mặc định
    addTitlleByDefaultLesson (e) {
      if (this.defaultLesson.title === '') {
        return
      }
      let totalLesson = this.lessons.length
      this.defaultLesson.order_number = ++totalLesson // số thứ tự của bài học
      this.lessons.push(JSON.parse(JSON.stringify(this.defaultLesson)))
      this.defaultLesson.title = ''
    },
    // thêm câu hỏi nhanh qua phần tử mặc định
    addQuizByDefaultLesson () {
      helper.showMessage('Khối tài liệu có Câu hỏi bắt buộc phải có Tiêu đề, File đính kèm.  Bạn vui lòng kiểm tra lại !', 'warning')
    },
    // xóa lesson trong buổi học
    removeAt (index) {
      let idLessonDelete = this.lessons[index].hasOwnProperty('id') ? this.lessons[index].id : null

      this.lessons.splice(index, 1)
      this.reorder()
      this.$emit('action', {action: 'delete-doc'}, {lessons: this.lessons, lectureId: this.lectureId, idLessonDelete: idLessonDelete})
    },
    // cập nhật lại số thứ tự của buổi học khi có thay đổi
    onChange (event) {
      this.reorder()
    },
    reorder () {
      this.lessons.forEach((item, index) => (item.order_number = index + 1))
    },
    // end cập nhật lại số thứ tự của buổi học khi có thay đổi
    updateTitileLesson (order) {
      this.cur_lesson = this.lessons.find(obj => obj.order_number === order)
      this.cur_lesson.isEdit = true
      if (this.cur_lesson.isEdit) {
        let element = `textarea-lesson-title-${this.lectureId}-${order}`
        this.$nextTick(() => (this.$refs[element][0].focus()))
      }
    },
    updateTitleLesson (e) {
      this.cur_lesson.isEdit = false
    },
    // preview tài liệu học
    previewImageRender (file, fileType = null) {
      if (helper.isEmpty(file)) return ''
      if (fileType === 'doc') return 'https://gs.giaohangtietkiem.vn/d/e24bec4ee88441bdb3e79466dd541152.png?height=250'
      if (fileType === 'pdf') return 'https://gs.giaohangtietkiem.vn/d/d7d5ef9e764e4227b7aef2c11dfd1371.pngheight=250'

      return file
    },
    getUrl (file) {
      if (helper.isEmpty(file)) return null
      if (typeof file === 'string') return file
      return URL.createObjectURL(file)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .popover-body {
  color: #fff;
  background-color: #505050;
  border-radius: 6px;
}
/deep/ .arrow::after {
  border-top-color: #505050 !important;
}
.document-extend {
  /*pointer-events: none;*/
  text-align: center;
  font-size: 11px;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.progress-extend {
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #FFFFFF;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  align-items: center;
  justify-content: center;
  z-index: 3;
  .progress-lesson {
    left: 5%;
    width: 90%;
    position: absolute;
    top: 40%;
  }
  .file-description {
    left: 20%;
    position: absolute;
    top: 50%;
    font-weight: 500;
  }
}

.thumbnail__element {
  overflow: hidden;
  position: relative;
  &:hover .document-extend {
    display: flex;
    flex-direction: column;
  }
  .action-document {
    display: block;
    width: 70px;
    height: 18px;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    border-radius: 0.5rem;
    background: #F1F1F1;
  }
}

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

    .document-preview {
      height: 7rem;
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
  }

  &-disable {
    .file-label-inner {
      border: 2px dotted #069255;
      text-align: center;
      color: #069255;
      z-index: 1;
      width: 100%;
      height: 7rem;
    }

    .progress-lesson {
      width: 100%;
      position: absolute;
      top: 40%;
    }

    .file-icon {
      position: absolute;
      font-size: xxx-large;
      top: 20%;
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

.button-close {
  position: absolute;
  top: -10px;
  right: -10px;
}
</style>
