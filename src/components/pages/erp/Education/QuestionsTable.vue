<template>
    <div class="table-questions-wrap">
        <table class="table table-questions">
        <thead>
            <tr class="header">
                <th class="header__element" style="z-index: 2">Danh sách câu hỏi</th>
                <th class="header__element th-action" style="z-index: 2">Thao tác</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(question, index) in questions" :key="index" class="questions-list">
                <td class="question-element">
                    <div class="question-element__content" style="display: flex">
                      <label class="label-question" for="">Câu {{index + 1}}:</label>
                      <textarea
                          :ref="`textarea-question-${question.id}`"
                          v-if="questionId == question.id"
                          type="text" v-model="question.content"
                          class="input-question inp-content-edit"
                          v-autoresize
                      >
                      </textarea>
                      <div style="display: inline-block" class="inp-content" v-else>
                        <pre class="pre-text">{{question.content}}</pre>
                      </div>
                    </div>
                    <div class="question-element__answers">
                        <div
                            v-for="(answer, index) in question.answers"
                            :key="index" class="question-element__answer d-flex"
                            :class="(answer.is_correct == 1) ? 'answer-true' : ''"
                        >
                            <span style="position: relative;bottom: -1px;">{{ String.fromCharCode(97 + index).toUpperCase() }}.</span>
                            <textarea
                              :ref="`textarea-question-${question.id}`"
                              v-if="questionId == question.id"
                                type="text" v-model="answer.content"
                                class="inp-content-edit"
                                v-autoresize
                            >
                            </textarea>
                            <pre v-else class="pre-text">{{answer.content}}</pre>
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
                    <b-btn variant="outline-ghtk" class="question__action_button" @click="editQuestion('cancel', index)">Hủy</b-btn>
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
  name: 'QuestionsTable',
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
      if (value) this.editQuestion('confirm', this.question)
      this.questionId = null
    },
    questions (old, newVal) {
      this.questionBefore = null
    }
  },
  methods: {
    formattedText (text) {
      return text ? text.replace(/\n/g, '</br>') : ''
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
    async editQuestion (action, params) {
      if (action === 'cancel') {
        this.questionId = null
        if (this.questions && this.questions[params]) {
          this.questions[params] = JSON.parse(JSON.stringify(this.questionBefore.data))
        }
        return
      }
      // check validate params
      if (helper.isEmpty(params.content) || helper.isEmpty(params.answers) || helper.isEmpty(params.id)) {
        helper.showMessage('Thiếu dữ liệu đầu vào!', 'warning')
        return
      }
      // thêm khoảng trắng sau kí tự '<' nếu có (tránh trường hợp bị back-end cắt chuỗi khi check tấn công XSS
      let questionId = params.id
      let answers = this.checkDataAndConvert(params.answers)
      let content = this.checkDataAndConvert(params.content)
      document.getElementById('icon_show_' + questionId).classList.add('active')
      try {
        // const {data} = await TrainingQuestionsService.editQuestionMultipleNew({question_id: questionId, content, answers, has_test: params.hasTestQuestion, category_id: params.category_id})
        const {data} = await TrainingQuestionsService.editQuestionMultipleNew({question_id: questionId, content, answers})
        if (data.success) {
          this.$emit('action', {action: 'confirm', data: params})
          this.questionBefore = null
          helper.showMessage(data.message || 'Chỉnh sửa câu hỏi thành công trắc nghiệm!', 'success')
        } else {
          this.$emit('action', {action: 'errorEditQuestion'})
          helper.showMessage(data.message || 'Chỉnh sửa thất bại!', 'warning')
        }
      } catch (e) {
        this.$emit('action', {action: 'errorEditQuestion'})
        console.log(e)
      } finally {
        document.getElementById('icon_show_' + questionId).classList.remove('active')
        this.questionId = null
      }
    },
    checkDataAndConvert (data) {
      if (typeof (data) === 'string') {
        data = data.replace(/<\d/g, function (x) {
          return x.replace('<', '< ')
        })
      }
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].content) {
            data[i].content = data[i].content.replace(/<\d/g, function (x) {
              return x.replace('<', '< ')
            })
          }
        }
      }
      return data
    }
  }
}
</script>

<!--<style lang="css">-->
<!--/deep/ -->
<!--</style>-->

<style lang="scss" scoped>
    pre.pre-text {
      font-family: inherit;
      font-size: 100%;
      color: #000000;
      max-width: 60vw;
    }
    .icon-show-cus {
      position: absolute;
      top: 5.4rem;
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
                    padding-top: 48%;
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
                    z-index: 1;
                    padding-left: 2.4rem;
                    .question-element__answer {
                        padding-top: 15px;
                    }
                }
                .question-element__tags {
                    padding-top: 5px;
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

              .question-edit_true{
                display: block;
                border-bottom: 1px solid #00904A;
                padding-bottom: 0.6rem;
              }

                .inp-content {
                  width: 100%;
                  border: 0;
                  color: #000000;
                  background: #ffffff;
                }
                input:focus{
                  outline: none;
                }
                .inp-content-edit {
                  width: 95.8%;
                  border: 0;
                  color: #000000;
                  background: #ffffff;
                  border-bottom: 1px solid #00904A;
                }
                .answer-true {
                  .inp-content-edit {
                    color: #00904A;
                  }
                }
            }
        }
    }
    .label-question {
      width: 50px;
      margin-bottom: 0;
      margin-right: 0.5rem;
    }
    .input-question {
      width: 93% !important;
    }
    ::-webkit-scrollbar {
      height: 4px;              /* height of horizontal scrollbar ← You're missing this */
      width: 4px;               /* width of vertical scrollbar */
      border: 1px solid #d5d5d5;
    }
</style>
