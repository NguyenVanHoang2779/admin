<template>
  <section class="workspace">
    <div class="left">
      <div
        class="page"
        v-for="(page, index) in test.pages"
        :key="`page${index}`"
      >
        <PageItem :page="page"
          @addQuestion="openAddQuestion"
          @refreshTest="getTest"
          @openEditPage="openEditPage"
          @openEditQuestion="openEditQuestion"
        />
      </div>
      <div class="add-page-btn" @click="openAddPage">
        Thêm trang
      </div>
    </div>
    <div class="right" v-loading="loading">
      <AddPage v-if="openning === 'add page'" @refreshTest="getTest" />
      <EditPage v-if="openning === 'edit page'" @refreshTest="getTest" :page="page"/>
      <AddQuestion
        v-if="openning === 'add question'"
        @save="createQuestion"
        :page="page"
        :resetAddQuestion="resetAddQuestion"
      />
      <EditQuestion
        v-if="openning === 'edit question'"
        @save="editQuestion"
        :question="question"
      />
    </div>
  </section>
</template>
<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import driverxService from 'domain/services/driverx-service'
import config from './config'
import AddQuestion from './AddQuestion'
import AddPage from './AddPage'
import PageItem from './PageItem'
import EditPage from './EditPage'
import EditQuestion from './EditQuestion'

export default {
  components: { AddQuestion, AddPage, PageItem, EditPage, EditQuestion },
  mounted () {
    this.getTest()
  },
  data () {
    return {
      loading: false,
      optionEdittor: config.optionEdittor,
      description: '',
      test: {},
      question: {},
      page: {},
      openning: '',
      resetAddQuestion: false
    }
  },
  methods: {
    openEditPage (page) {
      this.page = page
      this.openning = 'edit page'
    },
    async getTest () {
      try {
        this.loading = true
        const { data } = await driverxService.getTest({
          id: this.$route.params.id
        })
        if (data.success) this.test = data.test
        else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    openAddQuestion (page) {
      this.openning = 'add question'
      this.page = page
      this.resetAddQuestion = !this.resetAddQuestion
    },
    openAddPage () {
      this.openning = 'add page'
    },
    openEditQuestion (question) {
      this.openning = 'edit question'
      this.question = question
    },
    async createQuestion (reqData) {
      try {
        this.loading = true
        const { data } = await driverxService.createQuestion(reqData)
        if (data.success) {
          this.getTest()
          commonHelper.showMessage(data.message, 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    },
    async editQuestion (reqData) {
      try {
        this.loading = true
        const { data } = await driverxService.editQuestion(reqData)
        if (data.success) {
          this.getTest()
          commonHelper.showMessage(data.message, 'success')
        } else commonHelper.showMessage(data.message, 'warning')
      } catch (e) {
        commonHelper.showMessage(e.message, 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.workspace {
  display: grid;
  grid-template-columns: 1fr 3fr;
  min-height: 100vh;
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
