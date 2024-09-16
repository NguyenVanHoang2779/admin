<template>
    <div id="questions-wrap">
    <b-container fluid>
        <b-row class="header-wrap">
            <b-col class="header">
                <h4 class="m-0 font-weight-bold text-black title">Đào tạo</h4>
                <div class="action-wrap">
                  <div class="action-toggle">
                    <router-link class="link action-toggle--not-active" :to="'/staff-work/syllabus'">
                      Chương trình
                    </router-link>
                    <div class="action-toggle--active">Câu hỏi</div>
                  </div>
                  <button class="btn btn-question" @click="typeQuestion = 1 " :class="typeQuestion === 2 ? 'disabled-btn' : ''">
                    Trắc nghiệm
                  </button>
                  <button class="btn btn-question" @click="typeQuestion = 2" :class="typeQuestion === 1 ? 'disabled-btn' : ''">
                    Tự luận
                  </button>
                    <button class="btn btn-ghtk btn-add-cus rounded" @click="showModalAdd" v-if="permission.edit">
                        + Thêm
                    </button>
                </div>
            </b-col>
        </b-row>
        <b-row class="filter">
            <b-col cols="11">
                <b-row>
                    <b-col class="col-2 pr-0">
                      <multi-select-department
                        :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                        :auto-close="true"
                        :is-multiple="false"
                        :placeholder="'Bộ phận'"
                        :department-ids="filter.department_id"
                        @handleDepartmentSelected="handleDepartmentSelected">
                      </multi-select-department>
                    </b-col>
                    <b-col class="col-2 pr-0">
                      <MultiSelectPosition
                        class="multiselect-ghtk multiselect-no-horizontal"
                        :is-multiple="false"
                        :position-ids="filter.position_id"
                        :department-ids="filter.department_id"
                        :auto-close="true"
                        :hide-selected="true"
                        placeholder="Vị trí"
                        @handlePositionSelected="handlePositionSelected"
                      />
                    </b-col>
                    <b-col class="col-2 pr-0">
                        <multi-select-syllabus
                            :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
                            :syllabuse-ids="filter.syllabus_id"
                            :auto-close="true"
                            :multiple="false"
                            :placeholder="'Chương trình'"
                            @select="(option) => handleFilterSelected(option, 'syllabus_id')"
                            @remove="handleFilterUnSelected('syllabus_id')"
                        ></multi-select-syllabus>
                    </b-col>
                    <b-col class="col-2 pr-0">
                        <v-date-picker
                            v-model="filter.creation_time"
                            mode="range"
                            locale="vi"
                            color="green"
                            :input-props="{ placeholder: 'Ngày tạo', class: 'z-3 form-control rounded' }"
                            :popover="{visibility: 'focus'}"
                        />
                    </b-col>
                    <b-col class="col-2 pr-0">
                        <single-select-user
                            :placeholder="'Người tạo'"
                            @select="(option) => handleFilterSelected(option, 'creator')"
                            @remove="handleFilterUnSelected('creator')"
                        >
                        </single-select-user>
                    </b-col>
                    <b-col class="col-2 pr-0">
                        <input
                            placeholder="Câu hỏi"
                            v-model="filter.question_content"
                            class="form-control rounded"
                        />
                    </b-col>
              </b-row>
            </b-col>
            <b-col cols="1">
                <button
                    class="btn btn-ghtk rounded action-search"
                    @click="search"
                >
                    Tìm kiếm
                </button>
            </b-col>
        </b-row>
    </b-container>
    <b-container fluid class="questions-page-content">
        <b-row>
<!--          câu hỏi trắc nghiệm-->
            <b-col v-if="typeQuestion === 1">
                <QuestionsTable :questions="questions" v-loading="loading" @action="action" :edit="editQuestion" :permission="permission">
                </QuestionsTable>
            </b-col>
<!--          Câu hỏi tự luận -->
          <b-col v-if="typeQuestion === 2">
            <EssayQuestionsTable :questions="essayQuestions" v-loading="loading" @action="action" :edit="editEssayQuestion" :permission="permission">
            </EssayQuestionsTable>
          </b-col>
        </b-row>
        <b-row>
            <b-col class="questions-page-pagination" v-if="typeQuestion === 1">
                <b>
                  Bản ghi/ trang
                </b>
                <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block" v-model="page.per_page" @change="getQuestions()">
                    <option>15</option>
                    <option>25</option>
                    <option>35</option>
                    <option>45</option>
                    <option>55</option>
                </select>
                <div class="z-0 d-inline-block">
                <b-pagination
                    class="paginator-ghtk mb-0"
                    size="sm"
                    align="left"
                    v-model="page.current_page"
                    :total-rows="+page.total_page"
                    :per-page="+page.per_page"
                    @input="getQuestions()"
                >
                </b-pagination>
              </div>
            </b-col>
            <b-col class="questions-page-pagination" v-if="typeQuestion === 2">
            <b>
              Bản ghi/ trang
            </b>
            <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block" v-model="page.per_page_essay" @change="getQuestions()">
              <option>15</option>
              <option>25</option>
              <option>35</option>
              <option>45</option>
              <option>55</option>
            </select>
            <div class="z-0 d-inline-block">
              <b-pagination
                class="paginator-ghtk mb-0"
                size="sm"
                align="left"
                v-model="page.current_page_essay"
                :total-rows="+page.total_page_essay"
                :per-page="+page.per_page_essay"
                @input="getQuestions()"
              >
              </b-pagination>
            </div>
          </b-col>
        </b-row>
    </b-container>
    <!--  Modal  -->
    <div class="modal-questions">
      <!--    modal add question    -->
        <ModalUploadFile
            :id="'modal-upload-questions'"
            :title="'Thêm câu hỏi'"
            :nameFile="'câu hỏi'"
            :urlDefault="urlDownloadFile"
            :type-question="typeQuestion"
            @uploadFile="importQuestions"
        >
        </ModalUploadFile>

        <!--    modal delete or edit of question    -->
        <b-modal id="modal-notification" hide-footer header-class="justify-content-center" @hide="resetModal"
                 modal-class="align-items-center" centered static class="d-flex align-items-center modal-notification-cus" hide-header-close>
          <template slot="modal-title">
            <div class="text-title pl-3"><span>Thông báo</span></div>
            <div class="btn-close btn" @click="closeModal"><i class="fa fa-times"></i></div>
          </template>
          <div class="text-center mb-2 text-black">{{ contentNotification }}</div>
          <div class="btn-action d-flex justify-content-center mt-2">
            <b-button v-if="typeAction !== 'delete'" class="btn-ghtk btn__confirm text-center" @click="confirmAction(typeAction, questionId)">Xác nhận</b-button>
            <b-button v-if="typeAction === 'delete'" class="btn-ghtk btn__confirm text-center" @click="confirmAction(typeAction, questionId)">{{ checkDeleteQuestion ? 'Đóng' : 'Xác nhận'}}</b-button>
          </div>
        </b-modal>
    </div>
    </div>
</template>

<script>
import MultiSelectSyllabus from '../../../elements/common/MultiSelectSyllabus'
import Datepicker from 'vuejs-datepicker'
import SingleSelectUser from '../../../elements/common/SingleSelectUser'
import QuestionsTable from './QuestionsTable'
import EssayQuestionsTable from './EssayQuestionsTable'

// service
import TrainingQuestionsService from '../../../../domain/services/training-questions-service'
import ModalUploadFile from '../../../elements/common/ModalUploadFile'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'QuestionsManagement',

  components: {
    ModalUploadFile,
    QuestionsTable,
    MultiSelectSyllabus,
    Datepicker,
    SingleSelectUser,
    EssayQuestionsTable,
    MultiSelectDepartment,
    MultiSelectPosition
  },

  created () {
    this.initData()
  },

  data: () => ({
    filter: {
      department_id: null,
      position_id: null,
      category_id: null,
      syllabus_id: null,
      creation_time: null,
      creator: null,
      question_content: null,
      page: 1,
      limit: 10
    },
    page: {
      current_page: 1,
      per_page: 15,
      total_page: 0,
      current_page_essay: 1,
      per_page_essay: 15,
      total_page_essay: 0
    },
    questions: [],
    essayQuestions: [],
    loading: true,
    contentNotification: null,
    typeAction: null,
    questionId: null,
    editQuestion: false,
    editEssayQuestion: false,
    permission: {
      view: false,
      edit: false
    },
    typeQuestion: 1, // type = 1 trắc nghiệm, type = 2 tự luận,
    urlDownloadFile: 'https://cache.giaohangtietkiem.vn/d/89d6bd47f07dae95fb327f1e2d01c534.xlsx', // url download mẫu câu hỏi trắc nghiệm
    checkDeleteQuestion: false
  }),

  methods: {
    async initData () {
      await this.getPermistion()
      this.getQuestionMultiple()
      this.getEssayQuestions()
    },

    async getPermistion () {
      try {
        const res = await TrainingQuestionsService.getPermission()
        if (res.data.success) {
          let data = res.data.data
          if (data.includes('education.view')) {
            this.permission.view = true
          }
          if (data.includes('education.edit')) {
            this.permission.edit = true
          }
        } else {
          helper.showMessage('Có lỗi xảy ra khi kiểm tra quyền người dùng', 'warning')
        }
      } catch (e) {
        console.log(e)
      }
    },

    handleFilterSelected (option, filter) {
      this.filter[filter] = option ? option.id : null
    },

    handleFilterUnSelected (filter) {
      this.filter[filter] = null
    },

    getQuestions () {
      if (this.typeQuestion === 1) {
        this.getQuestionMultiple()
      } else {
        this.getEssayQuestions()
      }
    },

    async getQuestionMultiple () {
      this.loading = true
      this.filter.page = this.page.current_page
      this.filter.limit = this.page.per_page

      const params = {
        ...this.filter
      }

      if (params.creation_time && params.creation_time.start && params.creation_time.end) {
        params.creation_time_start = helper.formatDate(params.creation_time.start, 'YYYY-MM-DD')
        params.creation_time_end = helper.formatDate(params.creation_time.end, 'YYYY-MM-DD')
        delete params.creation_time
      }

      try {
        const {data} = await TrainingQuestionsService.getListMultipleQuestion(params)
        if (data.success) {
          this.questions = data.data.hasOwnProperty('questions') ? data.data.questions : []
          this.page.total_page = data.data.total
        } else {
          helper.showMessage((data.message || 'Có lỗi xảy ra khi lấy danh sách câu hỏi trắc nghiệm'), 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.$nextTick(() => {
          this.loading = false
        })
      }
    },

    async getEssayQuestions () {
      this.loading = true
      this.filter.page = this.page.current_page_essay
      this.filter.limit = this.page.per_page_essay

      const params = {
        ...this.filter
      }

      if (params.creation_time && params.creation_time.start && params.creation_time.end) {
        params.creation_time_start = helper.formatDate(params.creation_time.start, 'YYYY-MM-DD')
        params.creation_time_end = helper.formatDate(params.creation_time.end, 'YYYY-MM-DD')
        delete params.creation_time
      }

      try {
        const {data} = await TrainingQuestionsService.getListEssayQuestion(params)
        if (data.success) {
          this.essayQuestions = data.data.hasOwnProperty('questions') ? data.data.questions : []
          this.page.total_page_essay = data.data.total
        } else {
          helper.showMessage((data.message || 'Có lỗi xảy ra khi lấy danh sách câu hỏi tự luận'), 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.$nextTick(() => {
          this.loading = false
        })
      }
    },

    handleDepartmentSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.filter.department_id = ops ? ops.map(item => item.id).toString() : ''
    },

    handlePositionSelected (ops) {
      if (ops !== null) {
        // trường hợp là single select
        if (!Array.isArray(ops)) {
          ops = [ops]
        }
      }
      this.filter.position_id = ops ? ops.map(item => item.id).toString() : ''
    },

    search () {
      if (this.typeQuestion === 1) {
        this.page.current_page = 1
      } else {
        this.page.current_page_essay = 1
      }
      this.getQuestions()
    },

    selectedUser (option) {
      this.filter.username = option
    },

    showModalAdd () {
      if (this.typeQuestion === 2) {
        this.urlDownloadFile = 'https://cache.giaohangtietkiem.vn/d/0385d6fd2feef4aaf17c254a58583ac2.xlsx'
      } else {
        this.urlDownloadFile = 'https://cache.giaohangtietkiem.vn/d/89d6bd47f07dae95fb327f1e2d01c534.xlsx'
      }
      this.$bvModal.show('modal-upload-questions')
    },

    action (data) {
      if (data.action === 'confirmErrorFromEssayComponent') {
        this.editEssayQuestion = false
      }
      if (data.action === 'errorEditQuestion') {
        this.editQuestion = false
        return
      }
      let hasTestQuestion = false
      let contentName = ''
      this.typeAction = data.action
      this.questionId = data.data.id
      if (data.data.syllabuses && data.data.syllabuses.length > 0) {
        hasTestQuestion = true
        data.data.syllabuses.forEach((item) => {
          contentName += item + ', '
        })
      }
      if (this.typeAction === 'confirm') {
        this.getQuestions()
        if (this.typeQuestion === 1) {
          this.editQuestion = false
        } else {
          this.editEssayQuestion = false
        }
        return
      }
      if (this.typeAction === 'edit' && !hasTestQuestion) {
        if (this.typeQuestion === 1) {
          this.editQuestion = true
        } else {
          this.editEssayQuestion = true
        }
        return
      }
      if (this.typeAction === 'edit' && hasTestQuestion) {
        this.contentNotification = 'Câu hỏi đang nằm trong các Bài kiểm tra thuộc chương trình ' + contentName + 'bạn có chắc chắn muốn Sửa không?'
        this.$bvModal.show('modal-notification')
        return
      }
      if (this.typeAction === 'delete') {
        this.contentNotification = 'Bạn có chắc chắn muốn Xóa câu hỏi không?'
        if (hasTestQuestion) {
          this.contentNotification = 'Không thể xóa câu hỏi do câu hỏi đang nằm trong các Bài kiểm tra thuộc chương trình ' + contentName + ' !'
          this.checkDeleteQuestion = true
        }
        this.$bvModal.show('modal-notification')
      }
    },

    confirmAction (action, questionId) {
      if (action === 'delete') {
        if (this.checkDeleteQuestion) {
          this.resetModal()
        } else {
          this.deleteQuestion(questionId)
        }
        return
      }

      if (action === 'edit') {
        if (this.typeQuestion === 1) {
          this.editQuestion = true
        } else {
          this.editEssayQuestion = true
        }
        this.resetModal()
      }
    },

    resetModal () {
      this.$bvModal.hide('modal-notification')
      this.checkDeleteQuestion = false
    },

    async deleteQuestion (questionId) {
      this.loading = true
      try {
        const {data} = await TrainingQuestionsService.deleteQuestionNew({question_id: questionId})
        if (data.success) {
          this.resetModal()
          this.changeListData('delete', questionId)
          return helper.showMessage(data.message || 'Xóa câu hỏi thành công', 'success')
        } else {
          return helper.showMessage(data.message || 'Xóa câu hỏi không thành công!', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    changeListData (action, questionId) {
      if (action === 'delete') {
        if (+this.typeQuestion === 1) {
          this.questions = this.questions.filter((question) => {
            if (+question.id !== +questionId) return question
          })
        } else {
          this.essayQuestions = this.essayQuestions.filter((question) => {
            if (+question.id !== +questionId) return question
          })
        }
      }
    },

    closeModal () {
      this.resetModal()
      this.editQuestion = false
      this.editEssayQuestion = false
    },

    importQuestions (file) {
      if (this.typeQuestion === 1) {
        this.importQuestionsMultiple(file)
      } else {
        this.importQuestionsAssay(file)
      }
    },

    async importQuestionsMultiple (file) {
      try {
        this.$startLoading()
        if (!file) {
          helper.showMessage('Vui lòng chọn 1 file để upload !')
          return
        }

        let dataSend = new FormData()
        dataSend.append('file', file)

        const response = await TrainingQuestionsService.importMultipleQuestions(dataSend)
        if (response.data.success) {
          await this.getQuestionMultiple()
          helper.showMessage(response.data.message, 'success')
        } else {
          helper.showMessage(response.data.message || 'Không thể upload file, vui lòng liên hệ với IT để được hộ trợ !', 'warning')
        }
      } catch (e) {
        helper.showMessage('Không thể upload file, vui lòng liên hệ với IT để được hỗ trợ !', 'warning')
        console.log(e)
      } finally {
        this.$stopLoading()
        this.$bvModal.hide('modal-upload-questions')
      }
    },

    async importQuestionsAssay (file) {
      try {
        this.$startLoading()
        if (!file) {
          helper.showMessage('Vui lòng chọn 1 file để upload !')
          return
        }

        let dataSend = new FormData()
        dataSend.append('file', file)

        const response = await TrainingQuestionsService.importEssayQuestions(dataSend)
        if (response.data.success) {
          await this.getEssayQuestions()
          helper.showMessage(response.data.message, 'success')
        } else {
          helper.showMessage(response.data.message || 'Không thể upload file, vui lòng liên hệ với IT để được hộ trợ !', 'warning')
        }
      } catch (e) {
        helper.showMessage('Không thể upload file, vui lòng liên hệ với IT để được hỗ trợ !', 'warning')
        console.log(e)
      } finally {
        this.$stopLoading()
        this.$bvModal.hide('modal-upload-questions')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-notification-cus /deep/ .modal-dialog {
  width: 30% !important;
}
.modal-notification-cus /deep/ .modal-header {
  height: 45px !important;
}

.modal-notification-cus /deep/ .modal-body {
  padding: 1.2rem !important;
}
$ghtk-color: #069255;
    .col-2-4 {
      width: 20%;
    }
    #questions-wrap {
        color: #000000;
        .header {
            display: flex;
            justify-content: space-between;
            padding-top: 0.5rem;
            padding-bottom: 1rem;
            .title {

            }
            .action-wrap {
                display: flex;
                align-items: center;
                button {
                    line-height: 1.2;
                    font-weight: 700;
                    margin-left: 0.5rem;
                }
                .action-toggle {
                    --width: 260px;
                    --height: 30px;
                    width: var(--width);
                    height: var(--height);
                    box-shadow: 0 1px 3px #cfcfcf;
                    border-radius: var(--height);
                    cursor: pointer;
                    margin-bottom: 0;
                    display: flex;
                    line-height: var(--height);
                    font-weight: 700;
                }
                .action-toggle--active {
                    width: calc(var(--width) / 2 + 20px);
                    height: calc(var(--height));
                    border-radius: calc(var(--height) / 2);
                    background-color: #069255;
                    box-shadow: 0 1px 3px #cfcfcf;
                    color: white;
                    text-align: center;
                    line-height: var(--height);
                }
                .action-toggle--not-active {
                    width: calc(var(--width) / 2 - 20px);
                    text-align: center;
                    color: #000000;
                }
            }
        }

        .filter {
            .action-search {
              float: right;
            }
        }

        .questions-page-content {
            padding-top: 2rem;
            padding-bottom: 2rem;
        }

        .text-title {
          font-size: 20px;
        }

        .btn-close {
          position: absolute;
          top: 0;
          right: 0;
        }

        .questions-page-pagination {
            padding-top: 30px;
        }
    }

    .btn-action {
      .btn__confirm {
        width: 24%;
        border-radius: 10px;
        margin-top: 0.6rem;
      }
    }

    // override
    .container-fluid {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
    }

    button {
      max-width: 100%;
    }

    .btn-question {
      width: 6.9rem!important;
      border-color: transparent;
      background-color: $ghtk-color;
      color: white;
      font-weight: 400 !important;
      height: 92%;
    }

    .disabled-btn {
      color: #00904A;
      background: #EAEAEA;
    }

    .btn-add-cus {
      width: 6.1rem;
    }
</style>
