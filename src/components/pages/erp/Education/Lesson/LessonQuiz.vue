<template>
  <div class="wrap-cus">
    <!--      bước chọn câu hỏi-->
    <div class="container-cus step-1" v-if="+stepCurrent === 1">
      <div class="m-2 lesson-quiz small-scrollbar test-left" v-loading="loading">
        <div class="test-left-header">
          <span class="title-step">LỌC CÂU HỎI</span>
        </div>
        <!--        filter-->
        <div class="row mt-3 mr-1 ml-1">
          <label class="col-md-4 mt-2 text-left text-black">Bô phận</label>
          <multi-select-department
            class="col-md-8 p-0 multiselect-ghtk multiselect-no-horizontal z-5"
            :auto-close="true"
            :is-multiple="true"
            :placeholder="'Bộ phận'"
            :department-ids="filter.department_id"
            @handleDepartmentSelected="handleDepartmentSelected">
          </multi-select-department>
        </div>
        <div class="row mt-3 mr-1 ml-1">
          <label class="col-md-4 mt-2 text-left text-black">Vị trí</label>
          <MultiSelectPosition
            class="col-md-8 p-0 multiselect-ghtk multiselect-no-horizontal"
            :is-multiple="true"
            :position-ids="filter.position_id"
            :department-ids="filter.department_id"
            :auto-close="true"
            :hide-selected="true"
            :exclude-department="[1]"
            placeholder="Vị trí"
            @handlePositionSelected="handlePositionSelected"
          />
        </div>
        <div class="row mt-3 mr-1 ml-1">
          <label class="col-md-4 mt-2 text-left text-black">Bài kiểm tra</label>
          <select-education-test-new
            class="col-md-8 p-0 multiselect-ghtk multiselect-no-horizontal"
            :test="filter.test_id"
            :multiple="false"
            :placeholder="'Chọn bài kiểm tra'"
            @change="handleEducationTestSelected"
          />
        </div>
        <div class="row mt-3 mr-1 ml-1">
          <label class="col-md-4 mt-2 text-left text-black">Nội dung câu hỏi</label>
          <b-form-input class="col-md-8" @input="changeFilterQuestionContent" v-model="filter.question_content" placeholder="Nhập nội dung câu hỏi"></b-form-input>
        </div>
        <div class="row filter-cus">
          <button class="btn btn-ghtk btn-md rounded btn-filter" :disabled="loadingFilter" @click="getListQuestions">
            <i class="ion ion-ios-funnel"></i>Lọc
            <i v-show="loadingFilter" class="fas fa-spinner fa-pulse spinner-filter"></i>
          </button>
        </div>

        <!--        Danh sách câu hỏi trắc nghiệm-->
        <div class="row mt-3 mr-1 ml-3">
          <div class="col-md-8 px-0 py-2">Chọn câu hỏi bài kiểm tra: {{ currentNumberMultiple + '/' + totalNumberMultiple }}</div>
          <b-form-checkbox
            class="col-md-4 ghtk-checkbox text-ghtk cursor-pointer mt-2"
            v-model="allMultiQuestion"
            :indeterminate="indeterminate"
            aria-describedby="testQuestions"
            aria-controls="testQuestions"
            @change="handleSelectAll"
          >
            {{ allMultiQuestion ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}}
          </b-form-checkbox>
        </div>
        <div class="checkbox-cus ml-3"
             id="scroll_multiple"
             ref="multiple_ref"
             @scroll="onScrollMultiple"
             >
          <div :id="String(question.id)" v-for="(question, idx) in multipleQuestions" :key="idx" class="mb-2">
            <span class="cursor-pointer question-icon" @click="handleChoiceQuestion(idx, question)"><i class="ion ion-ios-square-outline"></i></span>
            <span class="question-content">{{ question.content }}</span>
          </div>
          <div class="load-question load-question-emtpy" v-if="messageLoadMultiple.length > 0">
            {{ messageLoadMultiple }}
          </div>
          <div class="load-question" v-if="isLoadMultipleQuestionMore">
            <button class="btn btn-ghtk btn-md rounded btn-load-more" @click="loadMore">
              Xem thêm...
            </button>
          </div>
        </div>
      </div>

      <!--      Danh sách câu hỏi đã chọn-->
      <div class="m-2 lesson-quiz small-scrollbar test-right">
        <div class="test-right-header">
          <span>Danh sách câu hỏi đã chọn</span>
        </div>
        <div class="multiple-question checkbox-cus" v-if="listMultipleQuestionSelected.length > 0">
          <div class="list-question-choice">
            <div :id="'selected_' + question.id" v-for="(question, idx) in listMultipleQuestionSelected" :key="idx" class="mb-2">
              <span @click="handleUnChoice(idx, question)" class="cursor-pointer question-icon-selected"><i class="ion ion-ios-checkbox"></i></span>
              <span class="question-content-selected">{{ question.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--      bước show câu hỏi-->
    <div class="container-cus step-2" v-if="+stepCurrent === 2" v-loading="loading">
      <div class="exam__element multiple-choice">
        <div class="exam__element__content">
          <div class="question" v-for="(question, index) in questions">
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
    <div class="footer-cus">
      <div class="text-center mt-4" v-if="+stepCurrent === 1">
        <button class="btn btn-ghtk btn-md rounded" @click="handleNextStep()">
          Tiếp tục
        </button>
      </div>
      <div class="text-center mt-4" v-if="+stepCurrent === 2">
        <button class="btn btn-outline-ghtk btn-md rounded btn-back" @click="handleBack()">
          Quay lại
        </button>
        <button class="btn btn-ghtk btn-md rounded" @click="submitQuizzes">
          Xác nhận
        </button>
      </div>
    </div>
  </div>
</template>
<script>
// custom components
import SelectEducationCategory from 'components/elements/common/SelectEducationCategory'
import SelectEducationTestNew from 'components/elements/common/SelectEducationTestNew'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
// services
import trainingQuestionService from 'domain/services/training-questions-service'
import trainingQuestionUniService from 'domain/services/Erp/HrmUni/training-questions-service'

// helpers
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'Modal-quiz',
  components: {
    SelectEducationCategory,
    SelectEducationTestNew,
    MultiSelectDepartment,
    MultiSelectPosition
  },
  data: _ => ({
    filter: {
      department_id: null,
      position_id: null,
      category_id: '',
      test_id: '',
      question_content: ''
    },
    allMultiQuestion: false,
    indeterminate: false,
    originalMultiQuestions: [],
    multipleQuestions: [],
    listMultipleQuestionSelected: [],
    loading: false,
    stepCurrent: 1,
    currentNumberMultiple: 0,
    totalNumberMultiple: 0,
    listMultipleQuestion: [],
    loadingFilter: false,
    listQuestionBefore: [],
    isEditQuiz: false,
    listPositionBefore: [],
    listDepartmentBefore: [],
    idTestFilter: null,
    contentQuestionBefore: '',
    limit: 100,
    pageMultiple: 1,
    isLimitMultiple: false,
    filterBefore: {},
    isLoadMultipleQuestionMore: false,
    messageLoadMultiple: '',
    questions: {}
  }),
  props: {
    triggerGetQuestions: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'edit'
    },
    quiz: {
      type: Object,
      default: () => {}
    },
    resetData: {
      type: Boolean,
      default: false
    }

  },
  computed: {
    isSelectAll () {
      return (this.questions.length === 0 || (this.questions.filter(x => this.listMultipleQuestionSelected && this.listMultipleQuestionSelected.includes(x.id)).length !== this.questions.length))
    },
    helper () {
      return helper
    }
  },
  created () {},
  watch: {
    triggerGetQuestions: function () {
      this.resetDataModal()
      if (this.quiz.hasOwnProperty('dataStorage')) {
        let dataS = this.quiz.dataStorage
        if (dataS) {
          this.listMultipleQuestionSelected = dataS.dataMulEditNew
          this.listQuestionBefore = dataS.dataQuestionBefore
          this.isEditQuiz = true
        }
      } else if (this.quiz.questions && !this.helper.isEmpty(this.quiz.questions)) {
        this.listQuestionBefore = this.quiz.questions
        this.getListQuestionByQuestionIds(this.quiz.questions)
      }
    },
    resetData: function () {
      this.filter = {
        category_id: '',
        test_id: ''
      }
    },
    multipleQuestions: function (newVal, oldVal) {
      if (this.multipleQuestions.length === 0 && !this.allMultiQuestion && this.listMultipleQuestionSelected.length > 0) {
        this.allMultiQuestion = true
      }
    }
  },
  methods: {
    formattedText (text) {
      return text ? text.replace(/\n/g, '</br>') : ''
    },
    loadMore () {
      this.pageMultiple++
      if (!this.loadingFilter) {
        this.getListQuestions(false, false, 'more')
      }
    },
    onScrollMultiple () {
      const heightListMultiple = document.querySelector('#scroll_multiple')
      const HeightListMultipleWindow = this.$refs.multiple_ref.clientHeight
      if (HeightListMultipleWindow + heightListMultiple.scrollTop + 150 > heightListMultiple.scrollHeight && !this.isLimitMultiple && !this.loadingFilter && heightListMultiple.scrollTop !== 0) {
        // Lấy thêm log của từng user khi cuộn
        if (this.checkNoChangeFilter()) {
          this.pageMultiple++
          this.getListQuestions(false, false, 'scroll')
        }
      }
    },
    async getListQuestions (resetSelectedQuestion = false, isFirst = false, type = 'normal') {
      if (helper.isEmpty(this.filter.department_id) && helper.isEmpty(this.filter.position_id) && helper.isEmpty(this.filter.test_id)) {
        if (!isFirst) {
          return helper.showMessage('Vui lòng chọn bộ phận hoặc vị trí để lọc hoặc bài kiểm tra')
        }
        this.multipleQuestions = []
        this.originalMultiQuestions = []
        if (resetSelectedQuestion) this.listMultipleQuestionSelected = []
        return 0
      }
      if (type === 'normal') {
        this.pageMultiple = 1
      }
      let params = {
        limit: this.limit,
        page: this.pageMultiple,
        form: 'multiple_choice'
      }
      if (this.filter.department_id) {
        params.department_ids = this.filter.department_id.split(',')
      }
      if (this.filter.position_id) {
        params.position_ids = this.filter.position_id.split(',')
      }

      if (this.filter.test_id) {
        params.period_test_id = this.filter.test_id
      }

      if (this.filter.question_content) {
        params.question_content = this.filter.question_content
      }

      try {
        this.filterBefore = JSON.parse(JSON.stringify(this.filter))
        this.loadingFilter = true
        const res = await trainingQuestionService.getListQuestionsNew(params)
        if (res.data.success) {
          this.listPositionBefore = this.filter.position_id ? JSON.parse(JSON.stringify(this.filter.position_id)).split(',') : []
          this.listDepartmentBefore = this.filter.department_id ? JSON.parse(JSON.stringify(this.filter.department_id)).split(',') : []
          this.idTestFilter = this.filter.test_id ? JSON.parse(JSON.stringify(this.filter.test_id)) : null
          this.contentQuestionBefore = this.filter.question_content || ''
          let questions = res.data.data.questions
          let listIdSelected = this.listMultipleQuestionSelected.map((item) => item.id)
          let dataRes = questions.filter((item) => !listIdSelected.includes(+item.id))

          this.totalNumberMultiple = +res.data.data.total
          this.isLoadMultipleQuestionMore = false
          if (type === 'scroll') {
            this.multipleQuestions = this.multipleQuestions.concat(dataRes)
          } else {
            this.multipleQuestions = dataRes
            if (type === 'normal') {
              // Kiểm tra xem danh sách câu đã chọn đã đủ hết số câu vừa gọi bằng api lọc hay chưa
              if (this.multipleQuestions.length === 0 && questions.length > 0 && this.listMultipleQuestionSelected.length >= questions.length) {
                if (questions.length < +res.data.data.total) {
                  let numberQuestionSelectedWithFilterCurrent = 0
                  let dataOption = JSON.parse(JSON.stringify(this.listMultipleQuestionSelected))
                  dataOption.forEach((item) => {
                    if (this.listDepartmentBefore.includes(String(item.department_id)) || this.listPositionBefore.includes(String(item.position_id)) || (this.idTestFilter && (+this.idTestFilter === +item.test_id))) {
                      numberQuestionSelectedWithFilterCurrent++
                    }
                  })
                  this.messageLoadMultiple = 'Hiện tại bạn đã chọn ' + numberQuestionSelectedWithFilterCurrent + '/' + +res.data.data.total + ' câu cho các bộ phận, vị trí đang lọc.'
                  this.pageMultiple = Math.floor(numberQuestionSelectedWithFilterCurrent / this.limit)
                  if (numberQuestionSelectedWithFilterCurrent !== +res.data.data.total) {
                    this.isLoadMultipleQuestionMore = true
                  }
                }
                if (questions.length === +res.data.data.total) {
                  this.messageLoadMultiple = 'Bạn đã chọn tất cả ' + questions.length + '/' + +res.data.data.total + ' câu cho các bộ phận, vị trí đang lọc.'
                  this.isLoadMultipleQuestionMore = false
                }
              }
            }
            this.currentNumberMultiple = 0
            document.querySelector('#scroll_multiple').scrollTop = 0
          }
          this.isLimitMultiple = (+res.data.data.total === this.multipleQuestions.length) || questions.length === 0 || (questions.length < this.limit)
          this.allMultiQuestion = false

          if (questions.length === 0) {
            helper.showMessage('Chưa có câu hỏi cho vị trí đang tìm kiếm', 'warning')
          }
        } else {
          helper.showMessage(res.message || 'Có lỗi khi lấy danh sách câu hỏi', 'warning')
        }
      } catch (e) {
        helper.showMessage('Có lỗi xảy ra!', 'error')
      } finally {
        this.loadingFilter = false
        this.$forceUpdate()
      }
    },

    checkNoChangeFilter () {
      let listDepartmentBefore = this.listDepartmentBefore.join(',') || ''
      let listPositionBefore = this.listPositionBefore.join(',') || ''
      let idTestFilter = this.idTestFilter ? this.idTestFilter : ''
      let contentQuestionBefore = this.contentQuestionBefore || ''

      let listDepartmentCurrent = this.filter.department_id || ''
      let listPositionCurrent = this.filter.position_id || ''
      let idTestFilterCurrent = this.filter.test_id || ''
      let contentQuestionCurrent = this.filter.question_content || ''

      if (listDepartmentBefore !== listDepartmentCurrent) {
        return false
      }

      if (listPositionBefore !== listPositionCurrent) {
        return false
      }

      if (idTestFilter !== idTestFilterCurrent) {
        return false
      }

      if (contentQuestionBefore !== contentQuestionCurrent) {
        return false
      }

      return true
    },

    resetDataModal () {
      this.listMultipleQuestionSelected = []
      this.listMultipleQuestion = []
      this.multipleQuestions = []
      this.totalNumberMultiple = 0
      this.stepCurrent = 1
      this.currentNumberMultiple = 0
      this.totalNumberMultiple = 0
      this.allMultiQuestion = false
      this.isEditQuiz = false
      this.listPositionBefore = []
      this.listDepartmentBefore = []
      this.isLimitMultiple = false
      this.pageMultiple = 1
      this.isLoadMultipleQuestionMore = false
      this.messageLoadMultiple = ''
    },
    getListQuestionByQuestionIds (questionIds) {
      this.loading = true
      trainingQuestionUniService.getListQuestionByQuestionIds({question_id: questionIds})
        .then((res) => {
          if (res.data.success) {
            this.questions = res.data.data
            this.listMultipleQuestionSelected = JSON.parse(JSON.stringify(this.questions))
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
    handleNextStep () {
      if (this.listMultipleQuestionSelected.length === 0) {
        return helper.showMessage('Vui lòng chọn ít nhất 1 câu hỏi cho bài kiểm tra!', 'warning')
      }
      let listQuestionSelected = this.listMultipleQuestionSelected.map((item) => item.id)
      this.getListQuestionByQuestionIds(listQuestionSelected)
      this.stepCurrent++
    },

    handleBack () {
      if (this.listMultipleQuestionSelected.length === 0) {
        this.allMultiQuestion = false
      }
      this.stepCurrent--
    },

    resetDataLoadQuestion () {
      this.isLoadMultipleQuestionMore = false
      this.messageLoadMultiple = ''
    },

    handleEducationTestSelected (ops) {
      this.filter.test_id = ops ? String(ops.id) : ''
      this.resetDataLoadQuestion()
    },
    handleDepartmentSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.filter.department_id = ops ? ops.map(item => item.id).toString() : ''
      this.resetDataLoadQuestion()
    },
    handlePositionSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.filter.position_id = ops ? ops.map(item => item.id).toString() : ''
      this.resetDataLoadQuestion()
    },

    changeFilterQuestionContent () {
      this.resetDataLoadQuestion()
    },
    handleChoiceQuestion (idx, question) {
      this.multipleQuestions.splice(idx, 1)
      this.listMultipleQuestionSelected.push(question)
      this.currentNumberMultiple++
      this.isLoadMultipleQuestionMore = false
    },

    handleUnChoice (idx, question) {
      this.messageLoadMultiple = ''
      // Thêm lại phần tử vào đầu mảng
      // bỏ câu hỏi ra khỏi danh sách đã chọn
      this.listMultipleQuestionSelected.splice(idx, 1)
      // giảm số lượng câu hỏi
      if (this.currentNumberMultiple !== 0) this.currentNumberMultiple--
      // Phải thuộc filter hiện tại thì mới push vào, k thì xóa hẳn
      if (this.listDepartmentBefore.includes(String(question.department_id)) || this.listPositionBefore.includes(String(question.position_id)) || (this.idTestFilter && (+this.idTestFilter === +question.test_id))) {
        this.multipleQuestions = [question, ...this.multipleQuestions]
      }
    },

    handleSelectAll (checked) {
      this.messageLoadMultiple = ''
      if (checked) {
        this.listMultipleQuestionSelected = [...this.listMultipleQuestionSelected, ...this.multipleQuestions]
        this.currentNumberMultiple = this.multipleQuestions.length + this.currentNumberMultiple
        this.multipleQuestions = []
        if (this.currentNumberMultiple < this.totalNumberMultiple && this.checkNoChangeFilter() && this.currentNumberMultiple !== 0 && !this.isLimitMultiple) {
          this.isLoadMultipleQuestionMore = true
        }
        document.querySelector('#scroll_multiple').scrollTop = 0
      } else {
        let dataOption = JSON.parse(JSON.stringify(this.listMultipleQuestionSelected))
        dataOption.forEach((item) => {
          if (this.listDepartmentBefore.includes(String(item.department_id)) || this.listPositionBefore.includes(String(item.position_id)) || (this.idTestFilter && (+this.idTestFilter === +item.test_id))) {
            this.multipleQuestions.push(item)
          }
        })
        this.listMultipleQuestionSelected = []
        this.currentNumberMultiple = 0
        this.isLoadMultipleQuestionMore = false
      }
    },

    submitQuizzes () {
      let listQuestionSelected = this.listMultipleQuestionSelected.map((item) => {
        return {
          id: item.id
        }
      })
      let deleteQuestion = []
      let addQuestion = []
      let questions = this.listMultipleQuestionSelected.map((item) => item.id)
      // unique questions
      questions = questions.reduce((acc, current) => {
        if (acc.indexOf(current) === -1) {
          acc.push(current)
        }
        return acc
      }, [])
      if (helper.isEmpty(listQuestionSelected)) return helper.showMessage('Vui lòng chọn ít nhất 1 câu hỏi trước khi xác nhận!')
      let dataStorage = {}
      addQuestion = questions.filter(question => !this.listQuestionBefore.includes(question))
      addQuestion = addQuestion.reduce((acc, current) => {
        if (acc.indexOf(current) === -1) {
          acc.push(current)
        }
        return acc
      }, [])
      if (this.type === 'edit') {
        deleteQuestion = this.listQuestionBefore.filter(element => !questions.includes(element) && !addQuestion.includes(element))
      }
      dataStorage = {
        dataMulEditNew: this.listMultipleQuestionSelected,
        dataQuestionBefore: JSON.parse(JSON.stringify(this.listQuestionBefore))
      }
      this.$emit('action', {action: 'submit-quiz', questions: questions, addQuestion: addQuestion, deleteQuestion: deleteQuestion, dataStorage: dataStorage})
    }
  }
}
</script>

<style scoped lang="scss">
.lesson-quiz > * {
  color: black;
}
.popover-cus {
  top: 0;
  left: 0;
  width: 500px;
}

.list-question-cus::-webkit-scrollbar
{
  width: 0px;
  background-color: #dddddd;
  border-radius: 10px;
}

.list-question-cus::-webkit-scrollbar-thumb
{
  background-color: #b3b2b2;
  border-radius: 10px;
}

#scroll_multiple {
  max-height: 26vh !important;
  overflow-y: auto;
  overflow-x: hidden;
}

.btn-load-more {
  display: block;
  margin: auto;
  background: white;
  color: #069255;
  font-style: italic;
}

.question-icon {
  color: #00904A;
  font-size: 1rem;
  margin-right: 0.4rem;
}
.question-icon-selected {
  color: #00904A;
  font-size: 1rem;
  margin-right: 0.4rem;
}

.load-question-emtpy {
  text-align: center;
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
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
      width: 2rem;
      //height: 1.8rem;
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
    margin-top: 0.88rem;
  }

}

.filter-cus {
  justify-content: center;
  margin-top: 1rem;
  .spinner-filter {
    font-size: 12px;
    margin-left: 0.2rem;
  }
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
  .lesson-quiz {
    flex: 1 0;
  }
  .test-left {
     max-width: 48%;
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
        line-height: 2.15rem;
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

.multiple-question {
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
  max-height: 60vh;
  overflow-y: scroll;
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

.radio-cus /deep/ .custom-radio{
  margin-right: 2rem;
}

.btn-back {
  margin-right: 5rem !important;
}

// style màn show câu hỏi và đáp án
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
}
</style>
