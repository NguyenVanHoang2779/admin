<template>
  <div>
      <b-modal :class="'modal-custom'" id='modal-detail-test' title="Bài kiểm tra" header-class="justify-content-center header-modal-custom" size="xl" @hidden="hideModal" @shown="getData" hide-footer>
          <div class="wrapper exam">
              <div class="exam__element multiple-choice" v-if="data.multiple_choice && data.multiple_choice.questions && data.multiple_choice.questions.length > 0">
                  <div class="exam__element__title">
                    <div class="title">Phần trắc nghiệm</div>
                  </div>
                  <div class="exam__element__content">
                      <div class="question" v-for="(question, index) in data.multiple_choice.questions">
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
                                  <div style="display: inline-block; padding-left: 5px">
                                    {{String.fromCharCode(index + 65) + ". " }} <span v-html="formattedText(answer['content'])"></span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="exam__element essay" v-if="data.essay && data.essay.questions && data.essay.questions.length > 0">
                  <div class="exam__element__title">
                      <div class="title">Phần tự luận</div>
                  </div>
                  <div class="exam__element__content">
                      <div class="question" v-for="(question, index) in data.essay.questions">
                          <div class="content">
                              <span class="question__content">Câu {{index + 1}}: </span>
                              <span v-html="formattedText(question.content)"></span>
                          </div>
                          <div class="answer">
                              <span v-html="formattedText(question.answer)"></span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </b-modal>
  </div>
</template>

<script>

import trainingService from '../../../../domain/services/training-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalDetailTest',

  components: {
  },

  props: {
    tpPeriodId: {
      default: () => null
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
      trainingService.getPeriodTest({tp_period_id: this.tpPeriodId})
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
      this.$bvModal.hide('modal-add-student')
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ #modal-detail-test {
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
}
.wrapper.exam {
}
.wrapper.exam .exam__element {
  margin-bottom: 20px;
}
.wrapper.exam .exam__element .exam__element__title {
}
.wrapper.exam .exam__element .exam__element__title .title {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  background: #02a065;
  color: white;
  align-items: center;
  padding: 10px;
}
.wrapper.exam .exam__element .exam__element__content {
  padding: 10px 20px;
  background-color: white;
}
.wrapper.exam .exam__element .exam__element__content .question {
  padding: 15px 0;
}
.wrapper.exam .exam__element .exam__element__content .comment .title {
  font-weight: bold;
  page-break-after: avoid;
}

.wrapper.exam .exam__element .exam__element__content .question .content {
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
.wrapper.exam .exam__element.essay .answer {
  margin: 10px 0;
  background-color: rgba(155, 248, 189, 0.58);
  padding: 10px;
  border-radius: 5px;
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
.question__content {
  font-weight: bold;
}
</style>
