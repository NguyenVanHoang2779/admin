<template>
  <div>
      <b-modal :class="'modal-custom'" id='modal-detail-quiz' title="Xem câu hỏi" header-class="justify-content-center header-modal-custom" size="xl" @shown="getData" hide-footer>
          <div class="wrapper exam" v-loading="loading">
            <div class="exam__element multiple-choice">
              <div class="exam__element__content">
                <div class="question" v-for="(question, index) in data">
                  <div class="content">
                    <span class="question__content">Câu {{index + 1}}: </span>
                    <span v-html="formattedText(question.content)"></span>
                  </div>
                  <div class="answers" v-for="(answer, index) in question.answers">
                    <div class="answer">
                      <div class="checkbox-round" v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}" v-if="answer.is_correct">
                        <div v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}" class="checked correct">
                          <div class="text-center text-white line-height-1-rem" v-if="question.type === 'multiple'">&#10004;</div>
                        </div>
                      </div>
                      <div class="checkbox-round" v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}" v-else></div>
                      <div class="answer-content">
                        {{String.fromCharCode(index + 65) + ". " }} <span v-html="formattedText(answer['content'])"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="text-center mt-4">
              <button class="btn btn-outline-ghtk btn-md rounded btn-edit-position" @click="$emit('action', {action: 'update-quiz'})">
                Chỉnh sửa
              </button>
              <button v-b-modal.modal-delete class="btn btn-outline-danger btn-md rounded">
                Xóa
              </button>
            </div>
          </div>
      </b-modal>
      <b-modal id="modal-delete" ref="modalDelete" size="sm" header-class="justify-content-center header-modal-custom" title="Xóa tất cả câu hỏi" hide-header-close hide-footer>
        <div>
          <p class="text-center">Bạn có chắc chắn xóa tất cả Câu hỏi?</p>
          <div class="text-center mt-4 d-flex justify-content-sm-around">
            <button class="btn btn-outline-danger btn-md rounded col-4" @click="cancelDelete">
              Hủy
            </button>
            <button class="btn btn-outline-ghtk btn-md rounded col-4" @click="confirmDelete">
              Xác nhận
            </button>
          </div>
        </div>
      </b-modal>
  </div>
</template>

<script>
import helper from 'infrastructures/helpers/common-helpers'
import trainingQuestionsService from 'domain/services/Erp/HrmUni/training-questions-service'

export default {
  name: 'ModalDetailQuiz',

  components: {
  },

  props: {
    quiz: {
      default: () => null
    }
  },

  data () {
    return {
      loading: false,
      data: {}
    }
  },

  created () {
  },

  computed: {
  },

  watch: {

  },

  methods: {
    formattedText (text) {
      return text ? text.replace(/\n/g, '</br>') : ''
    },

    async getData () {
      this.loading = true
      trainingQuestionsService.getListQuestionByQuestionIds({question_id: this.quiz.questions})
        .then((res) => {
          if (res.data.success) {
            this.data = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi lấy thông tin bài kiểm tra !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    cancelDelete () {
      this.$refs.modalDelete.hide()
    },
    confirmDelete () {
      this.$refs.modalDelete.hide()
      this.$emit('action', {action: 'delete-quiz-from-detail'})
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ #modal-detail-quiz {
   .modal-dialog {
    max-width: 82rem !important;
  }
  .modal-body {
    background-color: #e2f5dc7a;
  }
}
.wrapper {
  width: 100%;
  min-height: 200px;
  .exam__element {
    margin-bottom: 20px;
    .exam__element__title .title {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      font-weight: bold;
      font-size: 15px;
      background: #02a065;
      color: white;
      align-items: center;
      padding: 10px;
    }
    .exam__element__content {
      padding: 10px 20px;
      background-color: white;
      .question {
        padding: 15px 0;
        .content {
          font-weight: bold;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
        }
      }
      .comment .title {
        font-weight: bold;
        page-break-after: avoid;
      }
      .answers {
        padding-left: 20px;
        .answer {
          display: flex;
          .answer-content {
            display: inline-block;
            padding-left: 5px;
          }
        }
      }
    }
  }
}

.wrapper.exam .exam__element.multiple-choice {
  margin-bottom: 30px;
}

.checkbox-round {
  display: inline-block;
  position: relative;
  top: 1px;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  border: 1px solid #ddd;
  .checked {
    display: inline-block;
    position: absolute;
    width: 1rem;
    height: 1rem;
    top: 0;
    left: 0;
    border-radius: 50%;
  }
  .checked.correct {
    background-color: #02a065;
  }
}
.question__content {
  font-weight: bold;
}
.btn-edit-position {
  margin-right: 5rem !important;
}
</style>
