<template>
  <section class="workspace">
    <div class="left">
      <div
        class="page"
      >
        <PeriodTestItem
          :page="page"
          :type="type"
          @addQuestion="openAddQuestion"
          @openEditQuestion="openEditQuestion"
          @action="action(...arguments)"
        />
      </div>
    </div>
    <div class="right" v-loading="loading">
      <EditTrainingPage v-if="opening === 'edit page'" :page="page"/>
      <AddTrainingTestQuestion
        v-if="opening === 'add question' && type !== 'view'"
        @save="addNewQuestion"
        :page="page"
        :resetAddQuestion="resetAddQuestion"
        :only-view="onlyView"
      />
      <EditPeriodTestQuestion
        v-if="opening === 'edit question'"
        :type="type"
        @save="editQuestion"
        :question="JSON.parse(JSON.stringify(question))"
        :only-view="onlyView"
      />
    </div>
  </section>
</template>
<script>
import helper from 'infrastructures/helpers/common-helpers'
import config from 'components/pages/erp/Training/config'
import PeriodTestItem from './PeriodTestItem'
import EditPeriodTestQuestion from './EditPeriodTestQuestion'
import EditTrainingPage from 'components/pages/erp/Training/EditTraningPage'
import AddTrainingTestQuestion from './AddTrainingTestQuestion'

export default {
  components: { AddTrainingTestQuestion, PeriodTestItem, EditTrainingPage, EditPeriodTestQuestion },
  mounted () {
  },
  props: {
    test: {
      default: () => {},
      type: Object
    },
    type: {
      default: 'edit'
    },
    onlyView: {
      default: () => false,
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      optionEdittor: config.optionEdittor,
      description: '',
      question: {},
      questions: [],
      page: {
        name: '',
        questions: []
      },
      opening: 'add question',
      resetAddQuestion: false
    }
  },
  watch: {
    test: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        if (newValue) {
          this.page = newValue
        }
      }
    },
    page: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        if (newValue) {
          this.$emit('action', {action: 'change-test', data: newValue})
        }
      }
    }
  },
  methods: {
    addNewQuestion (question) {
      this.page.questions.push(question)
      this.resetAddQuestion = !this.resetAddQuestion
      helper.showMessage('Thêm câu hỏi thành công', 'success')
    },
    editQuestion (question) {
      this.question.answers = question.answers
      this.question.name = question.name
      helper.showMessage('Sửa câu hỏi thành công', 'success')
    },
    openAddQuestion (page) {
      this.opening = 'add question'
      this.page = page
      this.resetAddQuestion = !this.resetAddQuestion
    },
    openEditQuestion (question) {
      this.opening = 'edit question'
      this.question = question
    },
    action (action) {
      if (action.action === 'delete-question') {
        this.page.questions.splice(action.data, 1)
        this.opening = 'add question'
        this.resetAddQuestion = !this.resetAddQuestion
        helper.showMessage('Xóa câu hỏi thành công', 'success')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.workspace {
  display: grid;
  grid-template-columns: 1fr 3fr;
  min-height: 50vh;
  background-color: #fff;
}
.page {
  margin-top: 1em;
}

.add-page-btn{
  cursor: pointer;
  width: 100% !important;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, .1);
  border-radius: 3px;
  min-height: 42px;
  margin: 1em 0 1em 0;
  width: 20%;
  background-color: #02a065;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left {
  height: 100%;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  border-right: thin solid rgba(77, 52, 70, 0.2);
  padding: 0.5em;
}
.right {
  padding: 0.5em 1em 1em 1em;
}
</style>
