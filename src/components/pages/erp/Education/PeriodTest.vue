<template>
  <div class="wrap-cus">
    <div class="header-cus">
        <div class="wrap-step">
          <div class="step" :style="stepCurrent >= 1 ? 'background-color: #00904A' : ''">1</div>
          <div class="name-step">Chọn câu hỏi</div>
        </div>
        <span class="step-space"></span>
      <div class="wrap-step">
        <div class="step" :style="stepCurrent >= 2 ? 'background-color: #00904A' : ''">2</div>
        <div class="name-step">Thiết lập điểm</div>
      </div>
    </div>
    <!--      bước 1-->
    <div class="container-cus step-1" v-if="+stepCurrent === 1">
      <div class="m-2 period-test small-scrollbar test-left" style="max-width:48%" v-loading="loading">
        <div class="test-left-header">
          <span class="step-number">1</span>
          <span class="title-step">BƯỚC 1: CHỌN CÂU HỎI</span>
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
        <div class="row mt-3 mr-1 ml-1 radio-cus">
          <label class="col-md-4 mt-2 text-left text-black">Chọn dạng câu hỏi</label>
          <b-form-radio-group
            v-model="typeCheckbox"
            :options="optionsType"
            class="col-md-8 mt-2"
            value-field="id"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-radio-group>
        </div>
        <div class="row filter-cus">
          <button class="btn btn-ghtk btn-md rounded btn-filter" :disabled="loadingFilter" @click="getListQuestions">
            <i class="ion ion-ios-funnel"></i>Lọc
            <i v-show="loadingFilter" class="fas fa-spinner fa-pulse" style="font-size: 12px;margin-left: 0.2rem;"></i>
          </button>
        </div>

<!--        Danh sách câu hỏi trắc nghiệm-->
        <div v-if="+typeCheckbox === 1" class="row mt-3 mr-1 ml-3">
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
        <div v-if="+typeCheckbox === 1" class="checkbox-cus ml-3"
             id="scroll_multiple"
             ref="multiple_ref"
             @scroll="onScrollMultiple"
             style="max-height: 26vh !important; overflow-y: auto; overflow-x: hidden;">
          <div :id="String(question.id)" v-for="(question, idx) in multipleQuestions" :key="idx" style="margin-bottom: 0.4rem">
            <span @click="handleChoiceQuestion(idx, question)" style="position: relative; cursor: pointer"><i class="ion ion-ios-square-outline" style="color: #00904A; font-size: 1.2rem; margin-right: 0.4rem; position: absolute"></i></span>
            <span class="question-content">{{ question.content }}</span>
          </div>
          <div class="load-question" v-if="messageLoadMultiple.length > 0" style="text-align: center;margin-top: 0.6rem;margin-bottom: 0.6rem;">
            {{ messageLoadMultiple }}
          </div>
          <div class="load-question" v-if="isLoadMultipleQuestionMore">
            <button class="btn btn-ghtk btn-md rounded" @click="loadMore" style="display: block;margin: auto;background: white;color: #069255;font-style: italic;">
              Xem thêm...
            </button>
          </div>
        </div>

<!--         Danh sách câu hỏi tự luận-->
        <div v-if="+typeCheckbox === 2" class="row mt-3 mr-1 ml-3">
          <div class="col-md-8 px-0 py-2">Chọn câu hỏi bài kiểm tra: {{ currentNumberEssay + '/' + totalNumberEssay }}</div>
          <b-form-checkbox
            class="col-md-4 ghtk-checkbox text-ghtk cursor-pointer mt-2"
            v-model="allEssayQuestion"
            :indeterminate="indeterminate"
            aria-describedby="testQuestionsE"
            aria-controls="testQuestionsE"
            @change="handleSelectAll"
          >
            {{ allEssayQuestion ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}}
          </b-form-checkbox>
        </div>
        <div v-if="+typeCheckbox === 2" class="checkbox-cus ml-3"
             id="scroll_essay"
             ref="essay_ref"
             @scroll="onScrollEssay"
             style="max-height: 26vh !important; overflow-y: auto; overflow-x: hidden;">
          <div :id="String(question.id)" v-for="(question, idx) in essayQuestions" :key="idx" style="margin-bottom: 0.4rem">
            <span @click="handleChoiceQuestion(idx, question)" style="position: relative; cursor: pointer"><i class="ion ion-ios-square-outline" style="color: #00904A; font-size: 1.2rem; margin-right: 0.4rem; position: absolute"></i></span>
            <span class="question-content">{{ question.content }}</span>
          </div>
          <div class="load-question" v-if="messageLoadEssay.length > 0" style="text-align: center;margin-top: 0.6rem;margin-bottom: 0.6rem;">
            {{ messageLoadEssay }}
          </div>
          <div class="load-question" v-if="isLoadEssayQuestionMore">
            <button class="btn btn-ghtk btn-md rounded" @click="loadMore" style="display: block;margin: auto;background: white;color: #069255;font-style: italic;">
              Xem thêm...
            </button>
          </div>
        </div>
      </div>

<!--      Danh sách câu hỏi đã chọn-->
      <div class="m-2 period-test small-scrollbar test-right">
        <div class="test-right-header">
          <span>Danh sách câu hỏi đã chọn</span>
        </div>
        <div class="multiple-question checkbox-cus" v-if="listMultipleQuestionSelected.length > 0">
          <span class="label-question">Trắc nghiệm ({{ listMultipleQuestionSelected.length }} câu)</span>
          <div class="list-question-choice">
            <div :id="'selected_' + question.id" v-for="(question, idx) in listMultipleQuestionSelected" :key="idx" style="margin-bottom: 0.4rem">
              <span @click="handleUnChoice(idx, question, 1)" style="cursor: pointer"><i class="ion ion-ios-checkbox" style="color: #00904A; font-size: 1rem; margin-right: 0.4rem;"></i></span>
              <span class="question-content-selected">{{ question.content }}</span>
            </div>
          </div>
        </div>
        <div class="essay-question checkbox-cus" v-if="listEssayQuestionSelected.length > 0">
          <span class="label-question">Tự luận ({{ listEssayQuestionSelected.length }} câu)</span>
          <div class="list-question-choice">
              <div :id="'selected_' + question.id" v-for="(question, idx) in listEssayQuestionSelected" :key="idx" style="margin-bottom: 0.4rem">
                <span @click="handleUnChoice(idx, question, 2)" style="cursor: pointer"><i class="ion ion-ios-checkbox" style="color: #00904A; font-size: 1rem; margin-right: 0.4rem;"></i></span>
                <span class="question-content-selected">{{ question.content }}</span>
              </div>
          </div>
        </div>
      </div>
    </div>

<!--    bước 2-->
    <div class="container-cus step-2" v-if="+stepCurrent === 2">
      <div class="m-2 period-test small-scrollbar test-left" v-loading="loading">
        <div class="test-left-header" style="margin-bottom: 0.7rem">
          <span class="step-number">2</span>
          <span class="title-step">BƯỚC 2: THIẾT LẬP ĐIỂM</span>
        </div>
        <div class="wrap-mark">
<!--          Chấm điểm phần trắc nghiệm-->
          <div class="mark-essay" style="margin-bottom: 1.8rem;" v-if="listMultipleQuestionSelected.length > 0">
            <div class="mark-header row">
              <span class="mark-title col-9">PHẦN TRẮC NGHIỆM ({{listMultipleQuestionSelected.length}} CÂU)</span>
              <span class="change-mark col-3 row">
                <span class="span-change-mark">
                  <span class="span-first">{{currentMultiTestScore}} / </span>
                  <input
                    v-model="totalMultipleTestScore"
                    type="number"
                    id="totalScoreMulti"
                    name="totalScoreMulti"
                    step="1"
                    min="1"
                    max="10"
                    class="total-score"
                    :disabled="listMultipleQuestionSelected.length === 0"
                  >
                </span>
                <span class="span-third">ĐIỂM</span>
              </span>
            </div>
            <div class="mark-content">
              <div class="row mark-detail-question" v-for="(question, idx) in listMultipleQuestionSelected" :id="'mark_' + idx">
                <span class="col-9 list-question-cus" style="max-height: 4rem; padding: 13px;">Câu {{idx + 1}}: {{question.content.length > 180 ? question.content.slice(0, 180) : question.content }}
                  <b-button :id="'mark_btn_mul' + question.id" style="padding: 0; background-color: white; color: black" v-if="question.content.length > 180">
                  ...
                </b-button>
                </span>
                <span class="col-3 change-mark-container row">
                   <span class="span-mark-detail">
                    <input
                      v-model="question.score"
                      type="number"
                      :id="'score' + question.id"
                      name=""
                      step="0.01"
                      min="0.00"
                      max="10.00"
                      class="detail-score"
                      @input="recalculate(question, 1)"
                    >
                   </span>
                   <span class="span-third">
                     <i class='fas fa-times-circle' style='font-size: 18px;color: red;cursor: pointer' @click="handleUnChoice(idx, question, 1, true)"></i>
                   </span>
                  </span>
                  <b-popover :target="'mark_btn_mul' + question.id" triggers="hover" class="popover-cus">
                  <template #title>Câu {{listMultipleQuestionSelected.length + 1 + idx}}</template>
                  {{ question.content }}
                </b-popover>
              </div>
            </div>
          </div>

<!--          Chấm điểm phần tự luận-->
          <div class="mark-essay" style="margin-bottom: 0.5rem;" v-if="listEssayQuestionSelected.length > 0">
            <div class="mark-header row">
              <span class="mark-title col-9">PHẦN TỰ LUẬN ({{listEssayQuestionSelected.length}} CÂU)</span>
              <span class="change-mark col-3 row">
                <span class="span-change-mark">
                  <span class="span-first">{{currentEssayTestScore}} / </span>
                  <input
                    v-model="totalEssayTestScore"
                    type="number"
                    id="totalScoreEssay"
                    name="totalScoreEssay"
                    step="1"
                    min="1"
                    max="10"
                    class="total-score"
                    :disabled="listEssayQuestionSelected.length === 0"
                  />
                </span>
                <span class="span-third">ĐIỂM</span>
              </span>
            </div>
            <div class="mark-content">
              <div class="row mark-detail-question" v-for="(question, idx) in listEssayQuestionSelected" :id="'mark_' + idx">
                <span class="col-9 list-question-cus" style="max-height: 4rem; padding: 13px;">Câu {{listMultipleQuestionSelected.length + 1 + idx}}: {{question.content.length > 180 ? question.content.slice(0, 180) : question.content }}
                  <b-button :id="'mark_btn' + question.id" style="padding: 0; background-color: white; color: black" v-if="question.content.length > 180">
                  ...
                </b-button>
                </span>
                <span class="col-3 change-mark-container row">
                  <span class="span-mark-detail">
                    <input
                      v-model="question.score"
                      type="number"
                      :id="'score' + question.id"
                      name=""
                      step="0.01"
                      min="0.00"
                      max="10.00"
                      class="detail-score"
                      @input="recalculate(question, 2)"
                    >
                  </span>
                  <span class="span-third">
                    <i class='fas fa-times-circle' style='font-size: 18px;color: red;cursor: pointer' @click="handleUnChoice(idx, question, 2, true)"></i>
                  </span>
                </span>
                <b-popover :target="'mark_btn' + question.id" triggers="hover" class="popover-cus">
                  <template #title>Câu {{listMultipleQuestionSelected.length + 1 + idx}}</template>
                  {{ question.content }}
                </b-popover>
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
        <button class="btn btn-ghtk btn-md rounded" style="background-color: rgb(255, 100, 100) !important;margin-right: 9rem;" @click="handleBack()">
          Quay lại
        </button>
        <button class="btn btn-ghtk btn-md rounded" @click="submitPeriodTests">
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
// import trainingService from 'domain/services/training-service'
import trainingQuestionService from 'domain/services/training-questions-service'

// helpers
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'period-test',
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
    allEssayQuestion: false,
    indeterminate: false,
    originalMultiQuestions: [],
    originalEssayQuestions: [],
    multipleQuestions: [],
    essayQuestions: [],
    listMultipleQuestionSelected: [],
    listEssayQuestionSelected: [],
    test_questions: [],
    loading: false,
    test_category_name: '',
    stepCurrent: 1,
    typeCheckbox: 1,
    currentMultiTestScore: 5,
    currentEssayTestScore: 5,
    totalMultipleTestScore: 5,
    totalEssayTestScore: 5,
    currentNumberMultiple: 0,
    totalNumberMultiple: 0,
    currentNumberEssay: 0,
    totalNumberEssay: 0,
    isRecalculate: true,
    optionsType: [
      {
        id: 1,
        name: 'Trắc nghiệm',
        type: 'multiple'
      },
      {
        id: 2,
        name: 'Tự luận',
        type: 'assay'
      }
    ],
    listMultipleQuestion: [],
    listEssayQuestion: [],
    loadingFilter: false,
    listQuestionBefore: [],
    isEditTest: false,
    listPositionBefore: [],
    listDepartmentBefore: [],
    idTestFilter: null,
    contentQuestionBefore: '',
    limit: 100,
    pageMultiple: 1,
    pageEssay: 1,
    isLimitMultiple: false,
    isLimitEssay: false,
    filterBefore: {},
    isLoadMultipleQuestionMore: false,
    isLoadEssayQuestionMore: false,
    messageLoadMultiple: '',
    messageLoadEssay: ''
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
    test: {
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
      if (this.test.hasOwnProperty('dataStorage')) {
        let dataS = this.test.dataStorage
        if (dataS) {
          this.listMultipleQuestionSelected = dataS.dataMulEditNew
          this.listEssayQuestionSelected = dataS.dataEssayEditNew
          this.currentMultiTestScore = dataS.currentMultiTestScore
          this.totalMultipleTestScore = dataS.totalMultipleTestScore
          this.currentEssayTestScore = dataS.currentEssayTestScore
          this.totalEssayTestScore = dataS.totalEssayTestScore
          this.isEditTest = true
        }
      } else if (this.test.hasOwnProperty('id')) {
        this.getListQuestionByTest(this.test.id)
      }
    },
    resetData: function () {
      this.filter = {
        category_id: '',
        test_id: ''
      }
    },
    // 'filter.test_id': function (newVal, oldVal) {
    //   // bỏ các option đã chọn của bài test cũ khi thay đổi bài kiểm tra
    //   if (oldVal && this.test_questions[oldVal]) {
    //     let questionIds = this.test_questions[oldVal].map(x => x.id)
    //     this.listMultipleQuestionSelected = this.listMultipleQuestionSelected.filter(x => !questionIds.includes(x)) || []
    //   }
    // },
    multipleQuestions: function (newVal, oldVal) {
      if (this.multipleQuestions.length === 0 && !this.allMultiQuestion && this.listMultipleQuestionSelected.length > 0) {
        this.allMultiQuestion = true
      }
    },
    essayQuestions: function (newVal, oldVal) {
      if (this.essayQuestions.length === 0 && !this.allEssayQuestion && this.listEssayQuestionSelected.length > 0) {
        this.allEssayQuestion = true
      }
    },
    totalMultipleTestScore: function (newVal, oldVal) {
      if (+newVal < 10 && +newVal > 0 && this.totalEssayTestScore > 0) {
        this.totalEssayTestScore = 10 - newVal
      }
    },
    totalEssayTestScore: function (newVal, oldVal) {
      if (+newVal < 10 && +newVal > 0 && this.totalMultipleTestScore > 0) {
        this.totalMultipleTestScore = 10 - newVal
      }
    },
    typeCheckbox: function (newVal, oldVal) {
      if (+this.typeCheckbox === 1) {
        this.messageLoadMultiple = ''
      } else {
        this.messageLoadEssay = ''
      }
    }
  },
  methods: {
    loadMore () {
      if (+this.typeCheckbox === 1) {
        this.pageMultiple++
      } else {
        this.pageEssay++
      }
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
    onScrollEssay () {
      const heightListEssay = document.querySelector('#scroll_essay')
      const HeightListEssayWindow = this.$refs.essay_ref.clientHeight
      if (HeightListEssayWindow + heightListEssay.scrollTop + 150 > heightListEssay.scrollHeight && !this.isLimitEssay && !this.loadingFilter && heightListEssay.scrollTop !== 0) {
        // Lấy thêm log của từng user khi cuộn
        this.pageEssay++
        this.getListQuestions(false, false, 'scroll')
      }
    },
    async getListQuestions (resetSelectedQuestion = false, isFirst = false, type = 'normal') {
      if (helper.isEmpty(this.filter.department_id) && helper.isEmpty(this.filter.position_id) && helper.isEmpty(this.filter.test_id)) {
        if (!isFirst) {
          return helper.showMessage('Vui lòng chọn bộ phận hoặc vị trí để lọc hoặc bài kiểm tra')
        }
        if (+this.typeCheckbox === 1) {
          this.multipleQuestions = []
          this.originalMultiQuestions = []
          if (resetSelectedQuestion) this.listMultipleQuestionSelected = []
        } else {
          this.essayQuestions = []
          this.originalEssayQuestions = []
          if (resetSelectedQuestion) this.listEssayQuestionSelected = []
        }
        return 0
      }
      if (type === 'normal') {
        this.pageMultiple = 1
        this.pageEssay = 1
      }
      let params = {
        limit: this.limit,
        page: (+this.typeCheckbox === 1) ? this.pageMultiple : this.pageEssay,
        form: (+this.typeCheckbox === 1) ? 'multiple_choice' : 'essay'
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
          if (+this.typeCheckbox === 1) {
            // this.originalMultiQuestions = res.data.data.questions
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
            if ((+res.data.data.total === this.multipleQuestions.length) || questions.length === 0 || (questions.length < this.limit)) {
              this.isLimitMultiple = true
            } else {
              this.isLimitMultiple = false
            }
            this.allMultiQuestion = false
          } else {
            // this.originalEssayQuestions = res.data.data.questions
            let listIdSelected = this.listEssayQuestionSelected.map((item) => item.id)
            let dataRes = questions.filter((item) => !listIdSelected.includes(+item.id))
            this.totalNumberEssay = +res.data.data.total
            this.isLoadEssayQuestionMore = false
            if (type === 'scroll') {
              this.essayQuestions = this.essayQuestions.concat(dataRes)
            } else {
              this.essayQuestions = dataRes
              if (type === 'normal') {
                // Kiểm tra xem danh sách câu đã chọn đã đủ hết số câu vừa gọi bằng api lọc hay chưa
                if (this.essayQuestions.length === 0 && questions.length > 0 && this.listEssayQuestionSelected.length >= questions.length) {
                  if (questions.length < +res.data.data.total) {
                    let numberQuestionSelectedWithFilterCurrent = 0
                    let dataOption = JSON.parse(JSON.stringify(this.listEssayQuestionSelected))
                    dataOption.forEach((item) => {
                      if (this.listDepartmentBefore.includes(String(item.department_id)) || this.listPositionBefore.includes(String(item.position_id)) || (this.idTestFilter && (+this.idTestFilter === +item.test_id))) {
                        numberQuestionSelectedWithFilterCurrent++
                      }
                    })
                    this.messageLoadEssay = 'Hiện tại bạn đã chọn ' + numberQuestionSelectedWithFilterCurrent + '/' + +res.data.data.total + ' câu cho các bộ phận, vị trí đang lọc.'
                    this.pageEssay = Math.floor(numberQuestionSelectedWithFilterCurrent / this.limit)
                    if (numberQuestionSelectedWithFilterCurrent !== +res.data.data.total) {
                      this.isLoadEssayQuestionMore = true
                    }
                  }
                  if (questions.length === +res.data.data.total) {
                    this.messageLoadEssay = 'Bạn đã chọn tất cả ' + questions.length + '/' + +res.data.data.total + ' câu cho các bộ phận, vị trí đang lọc.'
                    this.isLoadEssayQuestionMore = false
                  }
                }
              }
              this.currentNumberEssay = 0
              document.querySelector('#scroll_essay').scrollTop = 0
            }
            if ((+res.data.data.total === this.essayQuestions.length) || questions.length === 0 || (questions.length < this.limit)) {
              this.isLimitEssay = true
            } else {
              this.isLimitEssay = false
            }
            this.allEssayQuestion = false
          }
          if (questions.length === 0) {
            helper.showMessage('Chưa có câu hỏi cho vị trí đang tìm kiếm', 'warning')
          }
        } else {
          helper.showMessage(res.message || 'Có lỗi khi lấy danh sách câu hỏi', 'warning')
        }
      } catch (e) {
        console.log(e)
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
      this.listEssayQuestionSelected = []
      this.listMultipleQuestion = []
      this.listEssayQuestion = []
      this.multipleQuestions = []
      this.essayQuestions = []
      this.totalNumberEssay = 0
      this.totalNumberMultiple = 0
      this.currentEssayTestScore = 0
      this.currentMultiTestScore = 0
      this.stepCurrent = 1
      this.typeCheckbox = 1
      this.isRecalculate = true
      this.currentNumberMultiple = 0
      this.totalNumberMultiple = 0
      this.currentNumberEssay = 0
      this.totalNumberEssay = 0
      this.allMultiQuestion = false
      this.allEssayQuestion = false
      this.isEditTest = false
      this.listPositionBefore = []
      this.listDepartmentBefore = []
      this.isLimitMultiple = false
      this.isLimitEssay = false
      this.pageMultiple = 1
      this.pageEssay = 1
      this.isLoadMultipleQuestionMore = false
      this.isLoadEssayQuestionMore = false
      this.messageLoadMultiple = ''
      this.messageLoadEssay = ''
    },

    async getListQuestionByTest (testId) {
      let params = {
        tp_period_test_id: testId
      }

      if (helper.isEmpty(params.tp_period_test_id)) {
        return helper.showMessage('không tìm thấy id của bài kiểm tra')
      }
      try {
        const res = await trainingQuestionService.getListQuestionsByTest(params)
        if (res.data.success) {
          this.isEditTest = true
          if (res.data.data.hasOwnProperty('essay')) {
            this.listEssayQuestionSelected = res.data.data.essay.map((item) => {
              return {
                id: item.question_id,
                content: item.content,
                testId: item.test_id,
                score: item.score_config,
                department_id: item.department_id,
                position_id: item.position_id
              }
            })
            // let arr = this.listEssayQuestionSelected.map(item => +item.score)
            if (this.listEssayQuestionSelected.length > 0) {
              this.totalEssayTestScore = this.listEssayQuestionSelected.reduce(function (total, item) {
                return total + (+item.score)
              }, 0)
              if (('' + this.totalEssayTestScore).length > 5) {
                this.totalEssayTestScore = Math.ceil(+this.totalEssayTestScore)
              }
              this.currentEssayTestScore = JSON.parse(JSON.stringify(this.totalEssayTestScore))
            } else {
              this.totalEssayTestScore = 0
              this.currentEssayTestScore = 0
            }
          }
          if (res.data.data.hasOwnProperty('multiple_choice')) {
            this.listMultipleQuestionSelected = res.data.data.multiple_choice.map((item) => {
              return {
                id: item.question_id,
                content: item.content,
                testId: item.test_id,
                score: item.score_config,
                department_id: item.department_id,
                position_id: item.position_id
              }
            })
            if (this.listMultipleQuestionSelected.length > 0) {
              this.totalMultipleTestScore = this.listMultipleQuestionSelected.reduce(function (total, item) {
                return total + (+item.score)
              }, 0)
              if (('' + this.totalMultipleTestScore).length > 5) {
                this.totalMultipleTestScore = Math.ceil(+this.totalMultipleTestScore)
              }
              this.currentMultiTestScore = JSON.parse(JSON.stringify(this.totalMultipleTestScore))
            } else {
              this.totalMultipleTestScore = 0
              this.currentMultiTestScore = 0
            }
          }
          this.listQuestionBefore = [...this.listMultipleQuestionSelected, ...this.listEssayQuestionSelected].map((item) => {
            return {
              id: item.id,
              score: item.score
            }
          })
        } else {
          this.isEditTest = false
          return helper.showMessage(res.data.message || 'Có lỗi xảy ra khi lấy danh sách câu hỏi', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && +e.response.status === 422) { return helper.showMessage(e.response.data.message, 'warning') }
      }
    },

    calculateScore () {
      if (this.listEssayQuestionSelected.length > 0 && this.listMultipleQuestionSelected.length === 0) {
        this.totalEssayTestScore = 10
        this.totalMultipleTestScore = 0
        this.currentEssayTestScore = 10
        this.currentMultiTestScore = 0
      } else if (this.listMultipleQuestionSelected.length > 0 && this.listEssayQuestionSelected.length === 0) {
        this.totalMultipleTestScore = 10
        this.totalEssayTestScore = 0
        this.currentMultiTestScore = 10
        this.currentEssayTestScore = 0
      }

      if (this.listMultipleQuestionSelected.length > 0) {
        // Tính điểm của từng câu: tổng điểm / số câu
        let score = Number(this.totalMultipleTestScore / this.listMultipleQuestionSelected.length)
        if (score.toString().length > 4) {
          score = Number(score.toString().slice(0, 4))
        }
        this.listMultipleQuestionSelected = this.listMultipleQuestionSelected.map((item) => {
          return {
            id: item.id,
            content: item.content,
            score: score
          }
        })
        // bù điểm vào câu hỏi đầu
        let scoreFirst = this.totalMultipleTestScore - this.roundNumber((this.listMultipleQuestionSelected.length - 1) * score)
        scoreFirst = scoreFirst.toFixed(2)
        this.listMultipleQuestionSelected[0].score = scoreFirst
        // set lại tổng điểm hiện tại:
        this.currentMultiTestScore = JSON.parse(JSON.stringify(this.totalMultipleTestScore))
      }

      if (this.listEssayQuestionSelected.length > 0) {
        // Tính điểm của từng câu: tổng điểm / số câu
        let score = Number(this.totalEssayTestScore / this.listEssayQuestionSelected.length)
        if (score.toString().length > 4) {
          score = Number(score.toString().slice(0, 4))
        }
        this.listEssayQuestionSelected = this.listEssayQuestionSelected.map((item) => {
          return {
            id: item.id,
            content: item.content,
            score: score
          }
        })
        // bù điểm vào câu hỏi đầu
        let scoreFirst = this.totalEssayTestScore - this.roundNumber((this.listEssayQuestionSelected.length - 1) * score)
        scoreFirst = scoreFirst.toFixed(2)
        this.listEssayQuestionSelected[0].score = scoreFirst
        this.currentEssayTestScore = JSON.parse(JSON.stringify(this.totalEssayTestScore))
      }
    },

    recalculate (question, type) {
      let total = null
      if (type === 1) {
        total = this.calculateTotalScore(question, this.listMultipleQuestionSelected)
        if (total !== null) {
          this.currentMultiTestScore = total
        }
      } else {
        total = this.calculateTotalScore(question, this.listEssayQuestionSelected)
        if (total !== null) {
          this.currentEssayTestScore = total
        }
      }
    },

    calculateTotalScore (question, listSelected) {
      if (typeof (+question.score) === 'number') {
        let listScore = []
        listSelected.forEach((item) => {
          if (typeof (+item.score) === 'number') {
            let _score = (isNaN(+item.score)) ? 0 : (+item.score)
            listScore.push(_score)
          }
        })
        return parseFloat(listScore.reduce((tong, diem) => tong + diem, 0).toFixed(3))
      }
      return null
    },

    handleNextStep () {
      if (this.listEssayQuestionSelected.length === 0 && this.listMultipleQuestionSelected.length === 0) {
        return helper.showMessage('Vui lòng chọn ít nhất 1 câu hỏi cho bài kiểm tra!', 'warning')
      }
      if (this.currentNumberEssay !== 0 || this.currentNumberMultiple !== 0) {
        this.totalMultipleTestScore = 5
        this.totalEssayTestScore = 5
        this.calculateScore()
      } else {
        if (this.listMultipleQuestionSelected.length > 0) {
          let newScore = 0
          this.listMultipleQuestionSelected.forEach((item) => {
            if (typeof (+item.score) === 'number') {
              let _score = (isNaN(+item.score)) ? 0 : (+item.score)
              newScore = newScore + _score
              newScore = +(newScore.toFixed(2))
            }
          })
          // chia lại điểm khi edit chỉ xóa câu hỏi trắc nghiệm (không xóa toàn bộ)
          if (this.currentMultiTestScore > newScore) {
            // Tính điểm của từng câu: tổng điểm / số câu
            let score = Number(this.totalMultipleTestScore / this.listMultipleQuestionSelected.length)
            if (score.toString().length > 4) {
              score = Number(score.toString().slice(0, 4))
            }
            this.listMultipleQuestionSelected = this.listMultipleQuestionSelected.map((item) => {
              return {
                id: item.id,
                content: item.content,
                score: score
              }
            })
            // bù điểm vào câu hỏi đầu
            let scoreFirst = this.totalMultipleTestScore - this.roundNumber((this.listMultipleQuestionSelected.length - 1) * score)
            scoreFirst = scoreFirst.toFixed(2)
            this.listMultipleQuestionSelected[0].score = scoreFirst
            // set lại tổng điểm hiện tại:
            this.currentMultiTestScore = JSON.parse(JSON.stringify(this.totalMultipleTestScore))
          }
        } else {
          this.currentMultiTestScore = 0
          this.totalMultipleTestScore = 0
        }

        if (this.listEssayQuestionSelected.length > 0) {
          let newScore = 0
          this.listEssayQuestionSelected.forEach((item) => {
            if (typeof (+item.score) === 'number') {
              let _score = (isNaN(+item.score)) ? 0 : (+item.score)
              newScore = newScore + _score
              newScore = +(newScore.toFixed(2))
            }
          })
          this.currentEssayTestScore = newScore.toFixed(2)
          // chia lại điểm khi edit chỉ xóa câu hỏi trắc nghiệm (xóa toàn bộ)
          if (this.listMultipleQuestionSelected.length === 0) {
            this.calculateScore()
          }
          // if (('' + this.currentEssayTestScore).length > 5) {
          //   this.currentEssayTestScore = Math.ceil(+this.currentEssayTestScore)
          // }
        } else {
          this.currentEssayTestScore = 0
          this.totalEssayTestScore = 0
        }
      }
      this.stepCurrent++
    },

    handleBack () {
      if (this.listEssayQuestionSelected.length === 0 && this.listMultipleQuestionSelected.length === 0) {
        this.isRecalculate = true
      } else {
        this.isRecalculate = false
      }
      if (this.listEssayQuestionSelected.length === 0) {
        this.allEssayQuestion = false
      }
      if (this.listMultipleQuestionSelected.length === 0) {
        this.allMultiQuestion = false
      }
      this.stepCurrent--
    },

    // làm tròn đến 2 chữ số
    roundNumber (number) {
      return Math.round(number * 100) / 100
    },

    // async fillSelectedQuestion () {
    //   try {
    //     if (helper.isEmpty(this.filter.test_id)) return 0
    //     if (helper.isEmpty(this.filter.test_id)) return 0
    //     this.loading = true
    //     let filter = {
    //       test_id: this.filter.test_id
    //     }
    //     const {data} = await trainingService.getQuestions(filter)
    //     if (data.success) {
    //       let questionIds = this.originalMultiQuestions.map(x => x.id)
    //
    //       data.data.questions.map(question => {
    //         if (!this.selected_questions.includes(question.id) && questionIds.includes(question.id)) this.selected_questions.push(question.id)
    //       })
    //       this.test_questions[this.filter.test_id] = data.data.questions
    //     } else helper.showMessage(data.message || 'Có lỗi xảy ra trong quá trình tự fill câu hỏi!', 'warning')
    //   } catch (e) {
    //     helper.showMessage(e.message, 'warning')
    //   } finally {
    //     this.loading = false
    //   }
    // },

    resetDataLoadQuestion () {
      this.isLoadMultipleQuestionMore = false
      this.isLoadEssayQuestionMore = false
      this.messageLoadMultiple = ''
      this.messageLoadEssay = ''
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

    // // quick search
    // searchQuestion () {
    //   if (+this.typeCheckbox === 1) {
    //     this.multipleQuestions = this.originalMultiQuestions.filter((question) => question.content.toLowerCase().includes(this.filter.question_content.toLowerCase()))
    //   } else {
    //     this.essayQuestions = this.originalEssayQuestions.filter((question) => question.content.toLowerCase().includes(this.filter.question_content.toLowerCase()))
    //   }
    // },
    handleChoiceQuestion (idx, question) {
      if (+this.typeCheckbox === 1) {
        this.multipleQuestions.splice(idx, 1)
        this.listMultipleQuestionSelected.push(question)
        this.currentNumberMultiple++
      } else {
        // Loại bỏ phần tử đã chọn ra khỏi danh sách
        this.essayQuestions.splice(idx, 1)
        // Thêm vào danh sách đã chọn
        this.listEssayQuestionSelected.push(question)
        this.currentNumberEssay++
      }
      this.isLoadMultipleQuestionMore = false
      this.isLoadEssayQuestionMore = false
    },

    handleUnChoice (idx, question, type, isCalculateScore = false) {
      this.messageLoadMultiple = ''
      this.messageLoadEssay = ''
      // Thêm lại phần tử vào đầu mảng
      if (type === 1) {
        // bỏ câu hỏi ra khỏi danh sách đã chọn
        this.listMultipleQuestionSelected.splice(idx, 1)
        if (question.hasOwnProperty('score')) {
          question.score = 0
        }
        // giảm số lượng câu hỏi
        if (this.currentNumberMultiple !== 0) this.currentNumberMultiple--
        // Phải thuộc filter hiện tại thì mới push vào, k thì xóa hẳn
        if (this.listDepartmentBefore.includes(String(question.department_id)) || this.listPositionBefore.includes(String(question.position_id)) || (this.idTestFilter && (+this.idTestFilter === +question.test_id))) {
          this.multipleQuestions = [question, ...this.multipleQuestions]
        }
      } else {
        this.listEssayQuestionSelected.splice(idx, 1)
        if (question.hasOwnProperty('score')) {
          question.score = 0
        }
        this.currentNumberEssay--
        // Phải thuộc filter hiện tại thì mới push vào, k thì xóa hẳn
        if (this.listDepartmentBefore.includes(String(question.department_id)) || this.listPositionBefore.includes(String(question.position_id)) || (this.idTestFilter && (+this.idTestFilter === +question.test_id))) {
          this.essayQuestions = [question, ...this.essayQuestions]
        }
      }
      // if (isCalculateScore) {
      //   this.recalculate(question, type)
      // }
      if (isCalculateScore) {
        this.calculateScore()
      }
    },

    handleSelectAll (checked) {
      if (+this.typeCheckbox === 1) {
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
      } else {
        this.messageLoadEssay = ''
        if (checked) {
          this.listEssayQuestionSelected = [...this.listEssayQuestionSelected, ...this.essayQuestions]
          this.currentNumberEssay = this.essayQuestions.length + this.currentNumberEssay
          this.essayQuestions = []
          if (this.currentNumberEssay < this.totalNumberEssay && this.checkNoChangeFilter() && this.currentNumberEssay !== 0 && !this.isLimitEssay) {
            this.isLoadEssayQuestionMore = true
          }
          document.querySelector('#scroll_essay').scrollTop = 0
        } else {
          let dataOption = JSON.parse(JSON.stringify(this.listEssayQuestionSelected))
          dataOption.forEach((item) => {
            if (this.listDepartmentBefore.includes(String(item.department_id)) || this.listPositionBefore.includes(String(item.position_id)) || (this.idTestFilter && (+this.idTestFilter === +item.test_id))) {
              this.essayQuestions.push(item)
            }
          })
          this.listEssayQuestionSelected = []
          this.currentNumberEssay = 0
          this.isLoadEssayQuestionMore = false
        }
      }
    },

    submitPeriodTests () {
      let listQuestionSelected = [...this.listMultipleQuestionSelected, ...this.listEssayQuestionSelected].map((item) => {
        return {
          id: item.id,
          score: item.score
        }
      })
      if (helper.isEmpty(listQuestionSelected)) return helper.showMessage('Vui lòng chọn ít nhất 1 câu hỏi trước khi xác nhận!')
      let isEdit = false
      // kiểm tra xem có thay đổi gì k
      if (this.type === 'edit') {
        if (this.listQuestionBefore.length === listQuestionSelected.length) {
          for (let i = 0; i < this.listQuestionBefore.length; i++) {
            if (+this.listQuestionBefore[i].id !== +listQuestionSelected[i].id) {
              isEdit = true
              break
            } else {
              if (+this.listQuestionBefore[i].score !== +listQuestionSelected[i].score) {
                isEdit = true
                break
              }
            }
          }
        } else {
          isEdit = true
        }
      }

      let dataStorage = {}
      dataStorage = {
        dataMulEditNew: this.listMultipleQuestionSelected,
        dataEssayEditNew: this.listEssayQuestionSelected,
        currentMultiTestScore: this.currentMultiTestScore,
        totalMultipleTestScore: this.totalMultipleTestScore,
        currentEssayTestScore: this.currentEssayTestScore,
        totalEssayTestScore: this.totalEssayTestScore
      }
      // validate mark
      if (this.listMultipleQuestionSelected.length > 0) {
        for (let i = 0; i < this.listMultipleQuestionSelected.length; i++) {
          if (isNaN(+this.listMultipleQuestionSelected[i].score) || (String(this.listMultipleQuestionSelected[i].score).length === 0) || +this.listMultipleQuestionSelected[i].score < 0) {
            return helper.showMessage('Câu số ' + (i + 1) + ' phần trắc nghiệm chưa đúng định dạng hoặc chưa được thiết lập điểm', 'warning')
          }
        }
      }

      if (this.listEssayQuestionSelected.length > 0) {
        for (let i = 0; i < this.listEssayQuestionSelected.length; i++) {
          if (isNaN(+this.listEssayQuestionSelected[i].score) || (String(this.listEssayQuestionSelected[i].score).length === 0) || +this.listEssayQuestionSelected[i].score < 0) {
            return helper.showMessage('Câu số ' + (i + 1) + ' phần tự luận chưa đúng định dạng hoặc chưa được thiết lập điểm', 'warning')
          }
        }
      }

      if ((+this.totalMultipleTestScore + (+this.totalEssayTestScore) !== 10) || ((+this.currentMultiTestScore + (+this.currentEssayTestScore) !== 10))) {
        return helper.showMessage('Tổng số điểm chưa chính xác', 'warning')
      }

      if (this.listMultipleQuestionSelected.length > 0 && (+this.totalMultipleTestScore !== +this.currentMultiTestScore)) {
        return helper.showMessage('Tổng số điểm phần trắc nghiệm chưa đủ', 'warning')
      }

      if (this.listEssayQuestionSelected.length > 0 && (+this.totalEssayTestScore !== +this.currentEssayTestScore)) {
        return helper.showMessage('Tổng số điểm phần tự luận chưa đủ', 'warning')
      }

      // gen bài kiểm tra pdf
      this.$emit('action', {action: 'update-test-categories', data: {category_id: this.filter.category_id}})
      this.$emit('action', {action: 'submit-test', data: listQuestionSelected, isEdit: isEdit, dataStorage: dataStorage})
    }
  }
}
</script>

<style scoped lang="scss">
.period-test > * {
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

.wrap-cus {
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

.radio-cus /deep/ .custom-radio{
  margin-right: 2rem;
}

// style phần chấm điểm:
.mark-multiple, .mark-essay {
  border: 1px solid #DBDBDB;
}
.mark-header {
  margin: 0;
  padding: 0.72rem 0rem 1rem 1rem;
  background: #E5E5E5;
  border: 1px solid #E5E5E5;
  height: 2.8rem;
  .mark-title {
    font-size: 15px;
    font-weight: 500;
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
    top: -0.35rem;
    padding-left: 8rem;
    padding-right: 0;
    .span-change-mark {
      position: absolute;
      top: -0.1rem;
      right: 4.4rem;
      display: inline-block;
      border-bottom: 2px solid #B0B0B0;
    }
    .span-first {
      font-size: 19px;
      font-weight: 500;
      display: inline-block;
      max-width: 4rem;
      text-align: center;
      height: 1.95rem;
      margin-right: -0.4rem;
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
  max-height: 25vh;
  overflow-y: scroll;
  .mark-detail-question {
    height: 4rem;
    border-bottom: 1px solid #e5e5e5;
    margin: 0;
  span {
    margin: auto;
    }
  }
  .detail-score {
    margin-right: 0.5rem;
    width: 4.58rem;
    font-weight: 500;
    font-size: 19px;
    color: #474747;
    outline: none;
    background: #FFFFFF;
    border: 1px solid rgba(218, 218, 218, 0.8);
    border-radius: 3px;
    text-align: center;
  }
  .change-mark-container {
    position: relative;
    display: inline-block;
    padding-left: 3rem;
    padding-right: 0;
    .span-mark-detail {
      position: absolute;
      top: -0.8rem;
      right: 4.4rem;
      display: inline-block;
    }
    .span-third{
      position: absolute;
      right: 2rem;
      top: -0.5rem;
    }
  }
}

</style>
