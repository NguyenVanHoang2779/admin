<template>
  <div class="question">
    <div class="question-title">
      <quill-editor
        ref="myQuillEditor"
        :options="optionEdittor"
        v-model="name"
        :disabled="viewOnly"
      />
    </div>
    <div class="question-answers" v-for="(answer, index) in answers" :key="`ans-${index}`">
      <b-form-input :disabled="viewOnly" placeholder="Nhập đáp án..." v-model="answers[index].name" :state="+answer.correct === 1"></b-form-input>
      <div class="answer-action">
        <button class="my-btn answer-mark answer-check" v-if="!viewOnly" @click="setCorrect(index)">
          <i class="fa fa-check correct" v-if="answer.correct == 1"></i>
          <i class="fa fa-times" v-else></i>
        </button>
        <button class="my-btn answer-remove" v-if="!viewOnly" @click="removeAnswer(index)">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
    <div class="add" v-if="!viewOnly">
      <button class="my-btn add-normal" @click="addAnswer">Thêm đáp án <i class="fa fa-plus"></i></button>
      <button class="my-btn save" @click="save">Lưu <i class="fa fa-floppy-o" aria-hidden="true"></i></button>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import config from 'components/pages/erp/Training/config'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  props: {
    question: {
      default: () => {},
      type: Object
    },
    type: {
      default: null
    }
  },
  components: {quillEditor},
  data () {
    return {
      optionEdittor: config.optionEdittor,
      name: '',
      answers: []
    }
  },
  computed: {
    viewOnly () {
      return this.type === 'view'
    }
  },
  mounted () {
    this.answers = this.question.answers
    this.name = this.question.name
  },
  methods: {
    validateQuestion () {
      if (helper.isEmpty(this.name)) return 'Thiếu câu hỏi!'
      if (helper.isEmpty(this.answers)) return 'Thiếu câu trả lời!'
      let trueAnsExist = 0
      for (let i = 0; i < this.answers.length; i++) {
        if (this.answers[i].correct === 1 || this.answers[i].correct === true || this.answers[i].correct === '1') trueAnsExist = 1
        if (helper.isEmpty(this.answers[i].name)) return 'Câu trả lời chưa hợp lệ!'
      }
      if (!trueAnsExist) return 'Phải chọn ít nhất 1 câu trả lời là câu trả lời đúng!'
      return ''
    },
    addAnswer () {
      this.answers.push({
        name: '',
        correct: this.answers.length < 1,
        valid: false
      })
    },
    setCorrect (id) {
      this.answers.map((_, index) => {
        if (index === id) this.answers[id].correct = 1
        else this.answers[index].correct = 0
      })
    },
    save () {
      let validate = this.validateQuestion()
      console.log(validate)
      if (validate) return helper.showMessage(validate)
      this.$emit('save', {
        name: this.name,
        answers: this.answers,
        id: this.question.id
      })
    },
    removeAnswer (index) {
      if (this.answers[index].correct && this.answers.length > 0) this.answers[0].correct = true
      this.answers.splice(index, 1)
    }
  },
  watch: {
    answers: {
      deep: true,
      handler (newValue) {
        newValue.map((answer, index) => {
          if (!answer.name) this.answers[index].valid = false
          else this.answers[index].valid = true
        })
      }
    },
    question (q) {
      this.answers = q.answers
      this.name = q.name
    }
  }
}
</script>

<style lang="scss" scoped>
.question{
  padding-top: 1em;
  &-answers{
    display: flex;
    margin-top: 1em;
    justify-items: baseline;
  }
}
.correct{
  color: #02a065;
}
.save{
  background-color: #02a065 !important;
  margin-left: 5px !important;
  color: white !important;
}
.my-btn{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: .1s;
  font-weight: 500;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.add{
  margin-top: 1em;
  display: flex;
  justify-items: baseline;
}
.answer{
  &-action{
    display: flex;
    justify-content: flex-end;
  }
  &-check{
    margin-left: 5px !important;
    margin-right: 5px !important;
  }
}
</style>

<style>
.question .ql-container{
  height: 150px;
}
.question .ql-toolbar.ql-snow{
  border: 1px solid rgba(24, 28, 33, 0.1);
}
.question .ql-container.ql-snow{
  border: 1px solid rgba(24, 28, 33, 0.1);
}
</style>
