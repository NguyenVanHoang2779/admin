<template>
  <div>
      <b-modal :class="'modal-custom'" :id="id" title="Bài kiểm tra" header-class="justify-content-center header-modal-custom" size="xl" @hidden="hideModal" @shown="getData" hide-footer>
          <div class="wrapper exam">
              <div class="exam__element multiple-choice" v-if="data.multiple_choice && data.multiple_choice.questions && data.multiple_choice.questions.length > 0">
                  <div class="exam__element__title">
                      <div class="title">
                        Phần trắc nghiệm
                      </div>
                      <div class="score" v-if="data.multiple_choice && data.multiple_choice.total_score && data.multiple_choice.total_score_config">
                        {{data.multiple_choice.total_score + '/' + data.multiple_choice.total_score_config}}
                      </div>
                  </div>
                  <div class="exam__element__content" v-if="data.multiple_choice && data.multiple_choice.questions && data.multiple_choice.questions.length > 0">
                      <div class="question" v-for="(question, indexQuestion) in data.multiple_choice.questions">
                          <div class="content">
                              <span class="question__content">Câu {{indexQuestion + 1}}: </span>
                            <span v-html="formattedText(question.content)"></span>
                          </div>
                          <div class="answers">
                              <div class="answer" v-for="(answer, indexAnswer) in question.answers" :key="indexQuestion + '-' + indexAnswer">
                                    <div v-if="answer.selected === 'selected'" style="display: inline-block">
                                        <div v-if="answer.is_correct === 'correct'">
                                            <div class="checkbox-round border"  v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}">
                                                <div class="checked correct"  v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}">
                                                  <div class="text-center text-white line-height-1-rem" v-if="question.type === 'multiple'">&#10004;</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <div class="checkbox-round"  v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}">
                                                <div class="checked wrong"  v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}">
                                                  <div class="text-center text-white line-height-1-rem" v-if="question.type === 'multiple'">&#10006;</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="checkbox-round"  v-bind:class="{'border-radius-ghtk-4':question.type === 'multiple'}"></div>
                                  <div style="display: inline-block; padding-left: 5px">
                                    {{String.fromCharCode(indexAnswer + 65) + ". " }} <span v-html="formattedText(answer.content)"></span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="exam__element essay" v-if="data.essay && data.essay.questions && data.essay.questions.length > 0">
                  <div class="exam__element__title">
                      <div class="title">Phần tự luận</div>
                      <div class="score">{{data.essay.total_score + '/' + data.essay.total_score_config}}</div>
                  </div>
                  <div class="exam__element__content">
                      <div class="question" v-for="(question, index) in data.essay.questions">
                      <div class="content">
                          <span class="question__content">Câu {{index + 1}}: </span>
                          <span v-html="formattedText(question.content)"></span>
                      </div>
                      <div v-if="question.user_answer">
                          <div class="answer_essay">
                            <span v-html="formattedText(question.user_answer.answer)"></span>
                          </div>
                          <div v-if="question.user_answer.score">
                              <div class="score">
                                  <span>Điểm số:</span>
                                  <span>{{question.user_answer.score}}</span>
                              </div>
                          </div>
                          <div class="comment" v-if="question.user_answer.comment">
                              <span class="title">Nhận xét:</span>
                              <span>{{question.user_answer.comment}}</span>
                          </div>
                      </div>
                      <div class="answer_essay" v-else>
                          <span class="no-answer">Không có câu trả lời từ học viên</span>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
      </b-modal>
  </div>
</template>

<style lang="scss" scoped>
/deep/ .modal {
  .modal-dialog {
    max-width: 82rem !important;
  }
  .modal-body {
    background-color: #e2f5dc7a;
  }
}
.wrapper {
  margin: 0 1cm 0 1cm;
}
.wrapper.exam {
}
.wrapper.exam .exam__element {
  margin-bottom: 20px;
}
.wrapper.exam .exam__element .exam__element__title {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  background: #02a065;
  color: white;
  align-items: center;
  padding: 10px;
}
.wrapper.exam .exam__element .exam__element__title .score {
  display: inline-block;
  float: right
}
.wrapper.exam .exam__element .exam__element__title .title {
  display: inline-block;
}
.wrapper.exam .exam__element .exam__element__content {
  padding: 10px 20px;
  background-color: white;
}
.wrapper.exam .exam__element .exam__element__content .question {
  padding: 15px 0;
}
.wrapper.exam .exam__element .exam__element__content .score {
  color: #02a065;
  font-weight: bold;
}
.wrapper.exam .exam__element .exam__element__content .comment {
  color: orange;
}
.wrapper.exam .exam__element .exam__element__content .comment .title {
  font-weight: bold;
}

.wrapper.exam .exam__element .exam__element__content .content {
  font-weight: bold;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.wrapper.exam .exam__element .exam__element__content .answers {
  padding-left: 20px;
}

.wrapper.exam .exam__element .exam__element__content .answers .answer {
  display: flex;
}

.wrapper.exam .exam__element.multiple-choice {
  margin-bottom: 30px;
}

.wrapper.exam .exam__element.essay {

}
.wrapper.exam .exam__element.essay .answer_essay {
  margin: 10px 0;
  background-color: rgb(227, 225, 225);
  padding: 10px;
  border-radius: 5px;
  display: inline-block;
  word-break: break-word;
}
.wrapper.exam .exam__element.essay .answer_essay .no-answer {
  color: red;
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
}

.checkbox-round .checked {
  display: inline-block;
  position: absolute;
  width: 1rem;
  height: 1rem;
  top: 0;
  left: 0;
  border-radius: 50%;
}
.checkbox-round .checked.correct {
  background-color: #02a065;
}
.checkbox-round .checked.wrong {
  background-color: rgba(255, 0, 0, 0.94);
}
</style>

<script>

import trainingService from '../../../../domain/services/training-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalUserTest',

  components: {
  },

  props: {
    userTestId: {
      default: () => null
    },
    id: {
      default: () => 'modal-user-test'
    }
  },

  data () {
    return {
      loading: false,
      data: []
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
      trainingService.getUserTest({user_test_id: this.userTestId})
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
    hideModal () {
      this.data = []
      this.$bvModal.hide(this.id)
    }
  }
}
</script>
