<template>
  <div>
    <div class="action">
      <div :style="{width: (viewOnly ? '100%' : '80%')}">
        <span class="action-left p-2">{{ page.name }}</span>
      </div>
      <div v-if="!viewOnly" class="cursor-pointer action-right" @click="$emit('addQuestion', page)">
        <i class="fa fa-plus"></i>
      </div>
    </div>
    <section>
      <div
        class="page-question"
        v-for="(question, index) in page.questions"
        :key="`question${index}`"
      >
        <div class="question period-question">
          <span v-html="question.name"></span>
          <div class="question-actions pl-3">
            <div v-if="!viewOnly" class="question-remove" @click="deleteQuestion(index)">
              <i class="fa fa-trash"></i>
            </div>
            <div class="question-edit" @click="openEditQuestion(question)">
              <i class="fa fa-edit"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import trainingService from 'domain/services/training-service'

export default {
  name: 'period-test-item',
  props: ['page', 'type'],
  data () {
    return {
    }
  },
  computed: {
    viewOnly () {
      return this.type === 'view'
    }
  },
  methods: {
    openEditQuestion (question) {
      this.$emit('openEditQuestion', question)
    },
    async execDeletePage () {
      try {
        this.loading = true
        const { data } = await trainingService.deleteTrainingPage({ id: this.page.id })
        if (data.success) {
          commonHelper.showMessage(data.message, 'success')
          this.$emit('refreshTest')
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
    },
    deleteQuestion (idx) {
      // this.$bvModal
      //   .msgBoxConfirm('Bạn có chắc xóa câu hỏi này?', {
      //     title: 'Xóa câu hỏi',
      //     size: 'sm',
      //     buttonSize: 'sm',
      //     okVariant: 'danger',
      //     okTitle: 'Tiếp tục',
      //     cancelTitle: 'Hủy',
      //     hideHeaderClose: false,
      //     centered: true
      //   })
      //   .then((ok) => {
      //     if (ok) {
      this.$emit('action', { action: 'delete-question', data: idx })
      // }
      // })
      // .catch((_) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.question-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.question > * {
  margin: 0;
}
.question {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  &-edit {
    margin-left: 10px;
  }
}
.page {
  &-header {
    min-height: 47px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 3px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    justify-content: space-between;
    padding-left: 1em;
    cursor: pointer;
    overflow: hidden;
  }
  &-question {
    cursor: pointer;
  }
  &-name {
    flex-grow: 10;
  }
  &-open {
    min-height: 50px;
    flex-grow: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-open:hover {
    background: #f4f4f5;
  }
}
.page-question {
  min-height: 42px;
  margin: 10px 0 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
}
.action {
  display: flex;
  justify-content: space-between;

  &-left {
    min-height: 42px;
    margin: 1em 0.5em 1em 0;
    justify-content: space-around;
    align-items: center;
    border-radius: 3px;
    width: 90%;
    flex-grow: 5;
    display: flex;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  }

  &-right {
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
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

  &-item {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-item:hover {
    background: #f4f4f5;
  }
}
</style>
