<template>
  <div>
    <div class="page-header">
      <span class="page-name">{{ page.name }}</span>
      <span class="page-open" @click="open = !open">
        <i class="fa fa-minus" v-if="open"></i>
        <i class="fa fa-plus" v-else></i>
      </span>
    </div>
    <section v-show="open">
      <div
        class="page-question"
        v-for="(question, index) in page.questions"
        :key="`question${index}`"
      >
        <div class="question">
          <span v-html="question.name"></span>
          <div class="question-actions">
            <div class="question-remove" @click="deleteQuestion(question.id)">
              <i class="fa fa-trash"></i>
            </div>
            <div class="question-edit" @click="openEditQuestion(question)">
              <i class="fa fa-edit"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="action">
        <div class="action-left">
          <div class="action-item" @click="$emit('openEditPage', page)">
            <i class="fa fa-edit"></i>
          </div>
          <div class="action-item" @click="deletePage">
            <i class="fa fa-trash"></i>
          </div>
          <div class="action-item">
            <i class="fa fa-copy"></i>
          </div>
        </div>
        <div class="action-right" @click="$emit('addQuestion', page)">
          <i class="fa fa-plus"></i>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import driverxService from 'domain/services/driverx-service'

export default {
  props: ['page'],
  data () {
    return {
      open: false
    }
  },
  methods: {
    openEditQuestion (question) {
      this.$emit('openEditQuestion', question)
    },
    deletePage () {
      this.$bvModal
        .msgBoxConfirm('Bạn có chắc xóa trang này?', {
          title: 'Xóa trang',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Tiếp tục',
          cancelTitle: 'Hủy',
          hideHeaderClose: false,
          centered: true
        })
        .then((ok) => {
          if (ok) this.execDeletePage()
        })
        .catch((_) => {})
    },
    async execDeletePage () {
      try {
        this.loading = true
        const { data } = await driverxService.deletePage({ id: this.page.id })
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

    deleteQuestion (id) {
      this.$bvModal
        .msgBoxConfirm('Bạn có chắc xóa câu hỏi này?', {
          title: 'Xóa câu hỏi',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Tiếp tục',
          cancelTitle: 'Hủy',
          hideHeaderClose: false,
          centered: true
        })
        .then((ok) => {
          if (ok) this.execDeleteQuestion(id)
        })
        .catch((_) => {})
    },
    async execDeleteQuestion (id) {
      try {
        this.loading = true
        const { data } = await driverxService.deleteQuestion({ id })
        if (data.success) {
          commonHelper.showMessage(data.message)
          this.$emit('refreshTest')
        } else commonHelper.showMessage(data.message)
      } catch (e) {
        commonHelper.showMessage(e.message)
      } finally {
        this.loading = false
      }
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
    justify-content: baseline;
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
    width: 80%;
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
