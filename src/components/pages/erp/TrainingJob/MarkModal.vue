<template>
  <div>
    <b-modal
      class="modal-mark-cus"
      id='modal-mark'
      :title="nameModal"
      header-class="justify-content-center header-modal-custom"
      size="lg"
      @hidden="resetData()"
      hide-footer static>
        <div class="container-cus step-2 small-scrollbar test-left" v-loading="loading">
          <div class="period-test">
              <!--          Chấm điểm phần trắc nghiệm-->
              <div class="mark-essay" style="margin-bottom: 1.5rem;" v-if="listMultipleQuestion.length > 0">
                <div class="mark-header row">
                  <span class="mark-title col-9">PHẦN TRẮC NGHIỆM </span>
                  <span class="change-mark col-3 row">
                <span class="span-change-mark">
                  <span class="span-first">{{ currentScoreMultiple }} / {{ totalScoreMultiple }} điểm</span>
                </span>
              </span>
                </div>
                <div class="mark-content">
                  <div class="mark-detail-question" v-for="(question, idx) in listMultipleQuestion" :id="'mark_' + userTestId + question.id">
                    <div class="question-cus">
                      <span style="display: inline-block; white-space: pre-wrap">Câu {{(idx +1)}}: </span>
                      <span v-html="formattedText(question.content)"></span>
                    </div>
                    <div class="change-mark-container answer-cus d-flex" v-for="(answer, idA) in question.answers || []"
                         :id="'answer' + userTestId + answer.id">
                      <div v-if="answer.selected === 'selected'" class="d-inline-block">
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
                      <div class="ml-2">
                        <span style="display: inline-block; white-space: pre-wrap">{{
                            String.fromCharCode(97 + idA).toUpperCase()
                          }} </span>
                        <span v-html="formattedText(answer.content)"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--          Chấm điểm phần tự luận-->
              <div class="mark-essay" style="margin-bottom: 1.5rem;" v-for="(question, idx) in listEssayQuestion" :id="'mark_' + userTestId + question.id">
                <div class="mark-header row" v-if="+idx === 0">
                  <span class="mark-title col-9">PHẦN TỰ LUẬN</span>
                  <span class="change-mark col-3 row">
                <span class="span-change-mark">
                  <span class="span-first">{{ currentScoreEssay }} / {{ totalScoreEssay}} điểm</span>
                </span>
              </span>
                </div>
                <div class="mark-content">
                  <!--              Nội dung câu hỏi-->
                  <div class="mark-detail-question row">
                    <div class="col-10 question-cus"><span style="white-space: pre-wrap">Câu {{(listMultipleQuestion.length +idx +1)}}: </span> <span v-html="formattedText(question.content)"></span></div>
                    <span class="col-2 change-mark-container">
                      <span class="span-mark-detail">
                        <span class="char-cus" :style="getStyle(question.score_config, 'char-cus')">/</span>
                        <span class="score-config" :style="getStyle(question.score_config, 'score')"> {{ question.score_config }}</span>
                        <input
                          v-model="question.score"
                          type="number"
                          :id="'score' + userTestId + question.id"
                          name=""
                          step="0.01"
                          min="0.00"
                          max="10.00"
                          :class="String(question.score).length === 1 ? 'detail-score' : 'detail-score-4'"
                          :disabled="(question.user_answer && question.user_answer.length === 0)"
                          @input="calculateScore(question)"
                        >
                      </span>
                  </span>
                  </div>
                  <!--              Câu trả lời-->
                  <div class="answer-essay row">
                    <div class="col-6 answer-rookie">
                      <label for="" class="">Câu trả lời của học viên</label>
                      <div class="answer-rookie-content" style="display: flex;">
                        <p :style="((question.user_answer && question.user_answer.length === 0) || question.user_answer === null || question.user_answer === '') ? 'color: red; margin: auto' : ''">
                          <span v-if="question.user_answer && question.user_answer.length > 0" v-html="formattedText(question.user_answer)"></span>
                          <span v-else>{{'Không có câu trả lời từ học viên'}}</span>
                        </p>
                      </div>
                    </div>
                    <div class="col-6 answer-test">
                      <label for="" class="">Đáp án</label>
                      <div class="answer-test-content">
                        <span v-html="formattedText(question.answer)"></span>
                      </div>
                    </div>
                  </div>
                  <!--              Nhận xét-->
                  <div class="review row">
                    <label for="" class="">Nhận xét</label>
                    <textarea
                      @click="getClass(question.id)"
                      :id="'textarea' + userTestId + question.id"
                      placeholder="Nhập nhận xét từ 0 - 200 ký tự"
                      v-model="question.comment"
                      class="inp-content"
                      :disabled="(question.user_answer && question.user_answer.length === 0)"
                      :style=" (question.comment && question.comment.length > 200) ? 'outline: 1px solid red;' : ''"
                    />
                    <span class="number-characters">{{ question.comment && question.comment.length || 0}} / 200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div class="footer-cus">
          <div class="total-mark">
            <span class="wrap-mark">
              <span>TỔNG ĐIỂM: </span>
              <span class="mark-final">{{ +totalScore.toFixed(2) }}/10</span>
            </span>
          </div>
          <div class="text-center mt-4">
            <button class="btn btn-ghtk btn-md rounded" @click="submit">
              Xác nhận
            </button>
          </div>
        </div>
    </b-modal>
    <ConfirmMarkModal
      :username="username"
      :total-score="totalScore"
      :minimum-score="minimumScore"
      :data-request="dataRequest"
      :id-student="idStudent"
      :id-period="idPeriod"
      @successMark="successMark"
    >
    </ConfirmMarkModal>
  </div>
</template>
<script>
// custom components
import ConfirmMarkModal from './ConfirmMarkModal.vue'
// services
import trainingQuestionService from 'domain/services/training-questions-service'

// helpers
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'mark-modal',
  components: {
    ConfirmMarkModal
  },
  data: _ => ({
    loading: false,
    listMultipleQuestion: [],
    listEssayQuestion: [],
    currentScoreMultiple: 0,
    totalScoreMultiple: 0,
    currentScoreEssay: 0,
    totalScoreEssay: 0,
    idQuestionBefore: null,
    totalScore: 0,
    minimumScore: 0,
    dataRequest: {}
  }),
  props: {
    classId: null,
    userTestId: null,
    nameModal: '',
    username: '',
    idObject: null,
    idStudent: null,
    idPeriod: null
  },
  computed: {
  },
  created () {

  },
  watch: {
    userTestId: function (oldVal, newVal) {
      if (this.userTestId !== null) {
        this.getTestById()
      }
    }
  },
  methods: {
    formattedText (text) {
      return text ? '' + text.replace(/\n/g, '</br>') : ''
    },

    getClass: function (idQuestion) {
      let idElement = 'textarea' + idQuestion
      if (this.idQuestionBefore !== null) {
        const el = document.getElementById(this.idQuestionBefore)
        el.classList.remove('textarea-active')
      }
      const element = document.getElementById(idElement)
      element.classList.add('textarea-active')
      this.idQuestionBefore = idElement
    },
    getStyle: function (data, type) {
      if (type === 'color') {
        if (data.hasOwnProperty('is_correct')) {
          return data.is_correct === 'correct' ? 'color: #219653;' : 'color: #EA0505;'
        }
      }

      if (type === 'score') {
        if (String(data).length === 1) {
          return 'right: 2.5rem;'
        }
        if (String(data).length === 2) {
          return 'right: 2.4rem;'
        }
        if (String(data).length === 3) {
          return 'right: 2rem;'
        }
        if (String(data).length === 4) {
          return 'right: 1.6rem;'
        }

        if (type === 'char-cus') {
          if (String(data).length === 1) {
            return 'right: 3.4rem;'
          }
          if (String(data).length === 2) {
            return 'right: 3.8rem;'
          }
          // if (String(data).length === 3) {
          //   return 'right: 2rem;'
          // }
          // if (String(data).length === 4) {
          //   return 'right: 1.6rem;'
          // }
        }
      }
    },

    submit: function () {
      // Validate score
      let listQuestionNoScore = []
      if (this.listEssayQuestion.length > 0) {
        for (let i = 0; i < this.listEssayQuestion.length; i++) {
          let numberQuestion = (this.listMultipleQuestion.length || 0) + i + 1
          if (String(this.listEssayQuestion[i].score).indexOf('.') !== -1) {
            let locationDot = String(this.listEssayQuestion[i].score).indexOf('.')
            let decimalPart = String(this.listEssayQuestion[i].score).slice(locationDot)
            if (decimalPart.length > 3) {
              return helper.showMessage('Điểm câu số ' + numberQuestion + ' phải là số nguyên hoặc dạng số thập phân có 2 số sau dấu phẩy', 'warning')
            }
          }
          if (+this.listEssayQuestion[i].score > +this.listEssayQuestion[i].score_config) {
            return helper.showMessage('Câu ' + numberQuestion + ' vượt quá số điểm tối đa. Vui lòng kiểm tra lại', 'warning')
          }
          if (this.listEssayQuestion[i].comment && this.listEssayQuestion[i].comment.length > 200) {
            return helper.showMessage('Câu ' + numberQuestion + ' có nhận xét vượt quá 200 ký tự. Vui lòng kiểm tra lại', 'warning')
          }
          if (+this.listEssayQuestion[i].score < 0 || (isNaN(+this.listEssayQuestion[i].score)) || this.listEssayQuestion[i].score === '') {
            listQuestionNoScore.push(numberQuestion)
          }
        }
      }
      if (listQuestionNoScore.length > 0) {
        return helper.showMessage('Câu ' + listQuestionNoScore.join(',') + ' chưa được chấm điểm. Vui lòng kiểm tra lại', 'warning')
      }
      let arrQuestion = []
      // Chỉ gửi lên những câu hỏi mà học viên có trả lời
      this.listEssayQuestion.forEach((item) => {
        if (item.user_answer && item.user_answer.length > 0) {
          arrQuestion.push({
            id: item.id,
            score: item.score || 0,
            comment: item.comment || ''
          })
        }
      })
      this.dataRequest.test_id = this.userTestId
      this.dataRequest.questions = arrQuestion || []
      this.$bvModal.show('modal-confirm-mark')
    },

    calculateScore (question) {
      let idElement = 'score' + this.userTestId + question.id
      const el = document.getElementById(idElement)
      // remove class
      el.className = ''
      if (String(question.score).length === 1) {
        el.classList.add('detail-score-1')
      } else if (String(question.score).length === 2) {
        el.classList.add('detail-score-2')
      } else if (String(question.score).length === 3) {
        el.classList.add('detail-score-3')
      } else if (String(question.score).length === 4) {
        el.classList.add('detail-score-4')
      } else if (String(question.score).length === 5) {
        el.classList.add('detail-score-5')
      } else if (String(question.score).length > 5) {
        el.classList.add('detail-score-max')
      } else {
        el.classList.add('detail-score')
      }

      if (typeof (+question.score) === 'number') {
        let newScore = 0
        this.listEssayQuestion.forEach((item) => {
          if (typeof (+item.score) === 'number') {
            let _score = (isNaN(+item.score)) ? 0 : (+item.score)
            newScore = newScore + _score
            newScore = +(newScore.toFixed(2))
          }
        })
        this.currentScoreEssay = newScore
      }
      this.totalScore = this.currentScoreEssay + this.currentScoreMultiple
      this.totalScore = Math.round(+this.totalScore * 100) / 100
    },

    successMark () {
      this.resetData()
      this.$bvModal.hide('modal-mark')
    },

    resetData () {
      this.listMultipleQuestion = []
      this.listEssayQuestion = []
      this.currentScoreMultiple = 0
      this.currentScoreEssay = 0
      this.totalScoreMultiple = 0
      this.totalScoreEssay = 0
      this.totalScore = 0
      this.dataRequest = {}
      this.$emit('resetUserTestId')
    },

    async getTestById () {
      let params = {
        test_id: this.userTestId
      }
      try {
        const res = await trainingQuestionService.getTestById(params)
        if (res.data.success) {
          let data = res.data.data
          if (data.hasOwnProperty('essay')) {
            this.listEssayQuestion = data.essay.hasOwnProperty('questions') ? data.essay.questions : []
            this.totalScoreEssay = data.essay.hasOwnProperty('score_config') ? data.essay.score_config : 0
            this.listEssayQuestion = this.listEssayQuestion.map((item) => {
              return {
                id: item.id,
                answer: item.answer,
                content: item.content,
                score_config: item.score_config,
                user_answer: item.user_answer || '',
                score: item.score || 0,
                comment: item.comment || ''
              }
            })
            this.currentScoreEssay = this.listEssayQuestion.reduce(function (total, item) {
              return total + (+item.score)
            }, 0)
            this.currentScoreEssay = Math.round(+this.currentScoreEssay * 100) / 100
          }
          if (data.hasOwnProperty('multiple_choice')) {
            this.listMultipleQuestion = data.multiple_choice.hasOwnProperty('questions') ? data.multiple_choice.questions : []
            this.totalScoreMultiple = data.multiple_choice.hasOwnProperty('score_config') ? data.multiple_choice.score_config : 0
            this.currentScoreMultiple = data.multiple_choice.hasOwnProperty('total_score') ? +data.multiple_choice.total_score : 0
          }
          if (data.hasOwnProperty('benchmark')) {
            this.minimumScore = +data.benchmark
          }
          this.totalScore = this.currentScoreEssay + this.currentScoreMultiple
          this.totalScore = Math.round(+this.totalScore * 100) / 100
        } else {
          return helper.showMessage(res.data.message || 'Có lỗi xảy ra khi lấy danh sách câu hỏi', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (+e.response.status === 422) { return helper.showMessage(e.response.data.message, 'warning') }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.modal-mark-cus /deep/ .modal-lg {
  max-width: 68rem !important;
}
.modal-mark-cus /deep/ .modal-body {
  padding: 0.8rem 0.6rem;
  background-color: #F4FEF6;
}
.modal-mark-cus /deep/ .modal-title {
  font-size: 18px;
}
.period-test > * {
  color: black;
}

.header-cus {
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  text-align: center;
  .wrap-step {
    margin: 0;
    padding: 0;
    .step {
      display: inline-block;
      width: 1.8rem;
      height: 1.8rem;
      color: white;
      background-color: #B0B0B0;
      border-radius: 50%;
      text-align: center;
      font-weight: 900;
      line-height: 2rem;
    }
    .name-step {
      font-size: 16px;
      font-weight: 500;
      margin-top: 0.6rem;
      color: #000;
    }
  }
  .step-space {
    display: inline-block;
    width: 12rem;
    border-top: 3px solid #00904A;
    margin-left: -1.6rem;
    margin-right: -1.9rem;
    margin-top: 0.73rem;
  }

}

.filter-cus {
  justify-content: center;
  margin-top: 1rem;
  .btn-filter {
    display: inline-block;
    color: white;
    background-color: #00904A;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    i {
      margin-right: 0.4rem;
    }
  }
}

.container-cus {
  box-shadow: 0px 2px 30px #ebebeb;
  margin-top: 0.6rem;
  border-radius: 3px;
  background-color: #FFFFFF;
  display: flex;
  .period-test {
    flex: 1 0;
    background: #edf1f0b5;
    width: 100%;
  }
  .test-left {
    .test-left-header {
        padding: 0.5rem;
        .step-number {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          color: white;
          border-radius: 50%;
          text-align: center;
          font-weight: 900;
          line-height: 2rem;
          font-size: 18px;
          background-color: #00904A;
        }
        .title-step {
          margin-left: 0.5rem;
          font-size: 16px;
          font-weight: 500;
        }
    }
    label {
      font-weight: 500;
    }
  }
  .test-right {
    border-left: 1px solid #00904A;
    .test-right-header {
      padding: 0.6rem;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }
  }
}

.multiple-question, .essay-question {
  padding-top: 1rem;
  padding-left: 1.1rem;
}
.label-question {
  font-size: 15px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 0.8rem;
}
.list-question-choice {
  max-height: 24vh;
  overflow-y: scroll;
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

.checkbox-cus /deep/ .custom-control-label::before {
  border-color: #069255 !important;
  width: 0.8rem !important;
  height: 0.8rem !important;
  top: 0.22rem;
  border-radius: 1px !important;
  cursor: pointer;
}

.checkbox-cus /deep/ .custom-control.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
  border-color: #069255 !important;
  background-color: #069255 !important;
  border-color: #069255 !important;
  width: 0.8rem !important;
  height: 0.8rem !important;
  top: 0.22rem;
  border-radius: 1px !important;
  cursor: pointer;
}

.question-content {
  margin-left: 1.5rem;
}

.answer-essay {
  margin-left: 0.2rem;
  margin-bottom: 3rem;
  label {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 0.6rem;
  }
}

.answer-rookie-content, .answer-test-content {
  padding: 0.5rem;
  background-color: #F2F2F2;
  border-radius: 3px;
  height: 13vh;
  overflow-y: scroll;
}

.answer-test-content {
  background: rgba(0, 144, 74, 0.2);
  width: calc(100% - 0.9rem);
}

.answer-test-content::-webkit-scrollbar
{
  width: 0px;
  background-color: #dddddd;
  border-radius: 10px;
}

.answer-test-content::-webkit-scrollbar-thumb
{
  background-color: #b3b2b2;
  border-radius: 10px;
}

.radio-cus /deep/ .custom-radio{
  margin-right: 4rem;
}

.review {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  margin-right: 0.9rem;
  margin-bottom: 2rem;
  position: relative;
  label {
    font-size: 15px;
    font-weight: 500;
  }
  textarea {
    height: 4.5rem;
    border: 1px solid #E5E5E5;
    border-radius: 3px;
    padding-top: 1.5rem;
    padding-left: 1rem;
    outline: none;
  }
  .textarea-active {
    padding-top: 0.8rem;
    padding-left: 0.8rem;
    outline: 1px solid rgba(0, 144, 74, 0.8);
  }
  .number-characters {
    position: absolute;
    bottom: 0.5rem;
    right: 1rem;
    color:#A2A2A2;
    font-size: 15px;
  }
}

// style phần chấm điểm:
.mark-multiple, .mark-essay {
  box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.15);
  background-color: white;
  border-radius: 10px 10px 10px 10px;
}
.mark-header {
  position: relative;
  border-radius: 6px 6px 0px 0px;
  margin: 0;
  padding: 0.72rem 0rem 1rem 1rem;
  background: #DADADA;
  border: 1px solid #DADADA;
  height: 2.8rem;
  .mark-title {
    font-size: 16px;
    font-weight: 500;
    padding: 0;
  }
  .total-score {
    width: 2.58rem;
    border: none;
    background-color: #E5E5E5;
    font-weight: 500;
    font-size: 19px;
    color: #00904A;
    outline: none;
    margin-left: 0.2rem;
  }
  .change-mark {
    position: relative;
    display: inline-block;
    top: -0.18rem;
    text-align: right;
    padding-right: 0;
    .span-change-mark {
      display: inline-block;
    }
    .span-first {
      font-size: 16px;
      font-weight: 500;
      display: inline-block;
    }
    .span-third{
      position: absolute;
      right: 1rem;
      top: 0.4rem;
      font-weight: 500;
      font-size: 15px;
    }
  }
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
opacity: 1;
}
.mark-content {
  max-height: 46vh;
  overflow-x: hidden;
  .mark-detail-question {
    margin: 0rem 0rem 1.5rem 0rem;
    .question-cus {
      display: flex;
      font-size: 15px;
      font-weight: 500;
      padding-left: 1rem;
      margin-top: 1rem;
    }
    span {
      display: inline-block;
      }
  }
  .detail-score, .detail-score-1, .detail-score-2, .detail-score-3, .detail-score-4, .detail-score-5, .detail-score-max {
    margin-right: 0.5rem;
    font-weight: 500;
    font-size: 16px;
    outline: none;
    background: #FFFFFF;
    border: none;
    width: 6.55rem;
  }
  .detail-score {
    padding-left: 2rem;
  }
  .detail-score-1 {
    padding-left: 2rem;
  }
  .detail-score-2 {
    padding-left: 1.5rem;
  }
  .detail-score-3 {
    padding-left: 1.3rem;
  }
  .detail-score-4 {
    padding-left: 0.6rem;
  }
  .detail-score-5 {
    padding-left: 0.1rem;
  }
  .detail-score-max {
    padding-left: 0rem;
    width: 6.9rem;
  }
  .change-mark-container {
    position: relative;
    margin-top: 0.5rem;
    padding-left: 1rem;
    padding-right: 0;
    .span-mark-detail {
      position: relative;
      top: 0.3rem;
      right: -2.2rem;
      display: inline-block;
      border-bottom: 1px solid #828282;
      .score-config {
        position: absolute;
        font-size: 17px;
        font-weight: 500;
        right: 2.5rem;
        color: #00904A;
      }
      .char-cus {
        position: absolute;
        top: 0.06rem;
        right: 3.8rem;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .span-third{
      position: absolute;
      right: 2rem;
      top: -0.5rem;
    }
  }
}

.total-mark {
  .wrap-mark {
    font-size: 16px;
    font-weight: 500;
    display: inline-block;
    border: 1px solid #00904A;
    border-radius: 3px;
    padding: 0.3rem 0.7rem;
    background-color: white;
    .mark-final {
      color: #00904A;
    }
  }
}

</style>
