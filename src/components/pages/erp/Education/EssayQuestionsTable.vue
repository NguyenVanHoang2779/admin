<template>
    <div class="table-questions-wrap">
        <table class="table table-questions">
        <thead>
            <tr class="header">
                <th class="header__element" style="z-index: 2;">Danh sách câu hỏi</th>
                <th class="header__element th-action" style="z-index: 2;">Thao tác</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(question, index) in questions" :key="index" class="questions-list">
                <td class="question-element">
                    <div class="question-element__content" :class="(questionId == question.id) ? 'question-edit_true' :'question-edit'">
                      <textarea
                        v-model="question.content"
                        class="inp-content"
                        :disabled="(questionId == question.id) ? false : true"
                        :ref="`textarea-question-${question.id}`"
                      />
                      <span class="number_question">Câu {{index + 1}}: </span>
                    </div>
                    <div class="question-element__answers"
                         v-if="permission.edit"
                         :class="getClassElement(question.id)"
                         :style="getStyleAnswer(question, 'margin')"
                    >
                        <div
                            :class="getStyleAnswer(question, 'class')"
                        >
                            <textarea
                                 v-model="question.answer"
                                 :placeholder="getStyleAnswer(question, 'placeholder')"
                                 class="inp-content inp-content-answer"
                                :disabled="(questionId == question.id) ? false : true"
                                 :ref="`textarea-question-${question.id}`"
                            />
                          <span
                            class="number_answer"
                            style="color:#00904A"
                            :style="getStyleAnswer(question, 'top')"
                          >Đáp án: </span>
                        </div>
                    </div>
                    <div class="question-element__tags">
                        <div v-for="(tag, index) in question.tags" :key="index" class="question-element__tag">
                          {{ tag }}
                        </div>
                    </div>
                  <i :id="'icon_show_' + question.id" class="fas fa-spinner fa-pulse icon-show-cus notActive"></i>
                </td>
                <td class="question__action" v-if="questionId !== question.id && permission.edit">
                  <div class="btn-action-question">
                    <b-btn variant="outline-ghtk" class="question__action_button" style="margin-bottom: 0.5rem;" @click="showModalAction('edit', {question: question, index: index})">
                      Sửa
                    </b-btn>
                    <b-btn variant="outline-ghtk" class="question__action_button" @click="showModalAction('delete', {question})">
                      Xóa
                    </b-btn>
                  </div>
                </td>
                <td v-else-if="permission.edit && questionId === question.id" class="question__action">
                  <div class="btn-action-question">
                    <b-btn variant="outline-ghtk" class="question__action_button" style="margin-bottom: 0.5rem;" @click="confirmEdit('edit', {question})">Xác nhận</b-btn>
                    <b-btn variant="outline-ghtk" class="question__action_button" @click="editEssayQuestion('cancel', index)">Hủy</b-btn>
                  </div>
                </td>
            </tr>
            <tr v-if="questions.length === 0">
              <td class="text-center" colspan="10">
                <div style="padding: 15px 10px">Không có dữ liệu phù hợp !</div>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
</template>

<script>

// helper
import helper from 'infrastructures/helpers/common-helpers'
// service

import TrainingQuestionsService from 'domain/services/training-questions-service'

export default {
  name: 'EssayQuestionsTable',
  props: {
    questions: {
      default: null
    },
    edit: {
      default: false,
      type: Boolean
    },
    permission: {
      view: {
        default: false,
        type: Boolean
      },
      edit: {
        default: false,
        type: Boolean
      }
    }
  },

  directives: {
    autoresize: {
      bind (el) {
        el.style.overflowY = 'hidden' // Ẩn thanh cuộn dọc
        el.style.resize = 'none' // Ẩn biểu tượng kéo để thay đổi kích thước
      },
      created (el) {
        el.style.height = 'auto' // Đặt chiều cao về mặc định
        el.style.height = (el.scrollHeight + 2) + 'px' // Đặt chiều cao dựa trên scrollHeight
      },
      update (el) {
        el.style.height = 'auto' // Đặt chiều cao về mặc định
        el.style.height = (el.scrollHeight + 2) + 'px' // Đặt chiều cao dựa trên scrollHeight
      }
    }
  },

  data: () => ({
    questionId: null,
    question: [],
    questionBefore: null
  }),
  watch: {
    edit (value) {
      if (value) this.editEssayQuestion('confirm', this.question)
      this.questionId = null
    },
    questions (old, newVal) {
      this.questionBefore = null
    }
  },
  methods: {
    getStyleAnswer (question, type) {
      if (question.answer !== null) {
        if (type === 'class') { return 'question-element__answer' }
        if (question.answer.length) { return '' }
      }
      if (type === 'margin') { return 'padding-top: 0.85rem;padding-bottom: 1.2rem;' }
      if (type === 'placeholder') { return 'Nhập để thêm đáp án' }
      if (type === 'top') { return 'top: 1.4rem' }
    },
    getClassElement (questionId) {
      let strClass = 'question-edit'
      if (+this.questionId === +questionId) {
        strClass = 'question-edit_true'
      }
      return strClass
    },
    showModalAction (action, data) {
      if (action === 'edit') {
        if (this.questions[data.index] && this.questionBefore && (+this.questions[data.index].id !== +this.questionBefore.data.id)) {
          this.questions[this.questionBefore.index] = JSON.parse(JSON.stringify(this.questionBefore.data))
        }
        this.questionBefore = {
          index: data.index,
          data: JSON.parse(JSON.stringify(data.question))
        }
        this.questionId = data.question.id
        this.$nextTick(() => {
          this.$refs[`textarea-question-${this.questionId}`].forEach(textarea => {
            // Thực hiện thao tác trên textarea
            textarea.style.height = 'auto'
            textarea.style.height = (textarea.scrollHeight + 2) + 'px'
          })
        })
        return
      }
      this.$emit('action', {action, data: data.question || null})
    },
    confirmEdit (action, data) {
      this.question = data.question
      this.$emit('action', {action, data: data.question || null})
    },
    async editEssayQuestion (action, params) {
      if (action === 'cancel') {
        this.questionId = null
        if (this.questions && this.questions[params]) {
          this.questions[params] = JSON.parse(JSON.stringify(this.questionBefore.data))
        }
        return
      }
      // check validate params
      if (helper.isEmpty(params.content) || helper.isEmpty(params.id)) {
        helper.showMessage('Thiếu dữ liệu đầu vào!', 'warning')
        this.$emit('action', {action: 'confirmErrorFromEssayComponent', data: params})
        return
      }
      let dataRequest = {
        question_id: params.id,
        content: params.content,
        answer: params.answer,
        has_test: params.hasTestQuestion,
        category_id: params.category_id
      }
      document.getElementById('icon_show_' + params.id).classList.add('active')
      try {
        const {data} = await TrainingQuestionsService.editEssayQuestion(dataRequest)
        if (data.success) {
          this.$emit('action', {action: 'confirm', data: params})
          helper.showMessage(data.message || 'Chỉnh sửa câu hỏi thành công!', 'success')
          this.questionBefore = null
        } else {
          helper.showMessage(data.message || 'Chỉnh sửa thất bại!', 'warning')
          this.$emit('action', {action: 'confirmErrorFromEssayComponent', data: params})
        }
      } catch (e) {
        if (+e.response.status === 422) { helper.showMessage(e.response.data.message, 'warning') }
        this.$emit('action', {action: 'confirmErrorFromEssayComponent', data: params})
      } finally {
        document.getElementById('icon_show_' + params.id).classList.remove('active')
        this.questionId = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .icon-show-cus {
      position: absolute;
      top: 1.3rem;
      right: 2.2rem;
      font-size: 11px;
      color: #069255;
      display: none;
    }
    .active {
      display: inline-block;
    }
    .table-questions-wrap {
        min-height: 25vh;
        max-height: 75vh;
        overflow-y: scroll;
        .table-questions {
            position: relative;
            thead {
                th {
                    position: sticky;
                    top: 0;
                    background-color: #f7f7f7;
                    border: none;
                    margin: 0;
                    text-align: center;
                }
                .th-action{
                  width: 10%;
                }
            }
            .questions-list {
              position: relative;
                .question__action {
                  border-left: 1px solid #f1f1f2;
                  text-align: center;
                    .btn-action-question {
                      width: 100%;
                      margin: auto;
                    }
                    .question__action_button {
                        box-shadow: 1px 3px 2px #c9c3c3ed;
                        border-radius: 8px;
                        padding-top: 0.3rem;
                        padding-bottom: 0.3rem;
                        font-size: 14px;
                        text-align: center;
                        width: 100px;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                .question-element__answers {
                    display: none ;
                    position: relative;
                    z-index: 1;
                    .question-element__answer {
                      padding-top: 0.3rem;
                    }
                }
                .question-element__no-answers {
                  padding-top: 1rem;
                  padding-bottom: 1rem;
                }
                .question-element__tags {
                    display: flex;
                    flex-wrap: wrap;
                    .question-element__tag {
                        background-color: #069255;
                        padding: 3px 10px;
                        margin-right: 10px;
                        color: white;
                        margin-top: 10px;
                    }
                }

                .question-element__content {
                  position: relative;
                }

                .question-edit{
                  display: block;
                  padding-bottom: 0.6rem;
                }

                .question-edit_true{
                  display: block;
                  border-bottom: 1px solid #00904A;
                  padding-bottom: 0.6rem;
                }

                .inp-content {
                  display: inline-table;
                  width: 100%;
                  border: 0;
                  color: #000000;
                  background: #ffffff;
                  text-indent: 3rem;
                  outline: none;
                  word-break: break-word;
                  height: 1rem;
                  line-height: 1.62rem;
                }
                input:focus{
                  outline: none;
                }
                .inp-content-answer{
                  text-indent: 3.5rem !important;
                }
              .number_question {
                position: absolute;
                top: 0.22rem;
                left: 0;
                width: 3.2rem;
              }
              .number_answer {
                position: absolute;
                top: 0.55rem;
                left: 0;
                width: 4rem;
              }
                .answer-true {
                  .inp-content-edit {
                    color: #00904A;
                  }
                }
            }
        }
    }
    ::-webkit-scrollbar {
      height: 4px;              /* height of horizontal scrollbar ← You're missing this */
      width: 4px;               /* width of vertical scrollbar */
      border: 1px solid #d5d5d5;
    }
</style>
