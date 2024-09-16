<template>
  <b-modal
    class="modalMarkConfirm"
    v-model="openModal"
    :title="'Xác nhận chấm điểm'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-confirm-mark"
    hide-footer
    @hide="onClose()">
    <div class="modal-mark-confirm">
      <div class="row">
        <label class="col-4">Học viên: </label>
        <span class="username">{{ username }}</span>
      </div>
      <div class="row">
        <label class="col-4">Tổng điểm: </label>
        <span class="total-score">{{ totalScore }}/10</span>
        <span class="pass-cus"> - {{ (totalScore >= minimumScore) ? 'Đạt' : 'Không đạt' }}</span>
      </div>
    </div>
    <div class="text-center mb-2">
      <b-btn :disabled="loading" variant="ghtk" id='btn-save-add-note' name='btn-save-add-note' class="button-deny-modal" @click="onSave()">Xác nhận <i v-show="loading" class="fas fa-spinner fa-pulse"></i></b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
    .modalMarkConfirm /deep/ .modal-dialog {
      max-width: 25rem !important;
    }
    .modalMarkConfirm /deep/ .close {
      font-size: 1.5rem !important;
      margin-top: -0.4rem;
      margin-right: -1rem;
    }
    ::placeholder {
      color: #828282;
    }
    .button-close-modal-contact {
      border-radius: 5px;
      padding: 5px 30px;
    }
    .button-deny-modal {
      width: 100px;
      border-radius: 5px;
      padding: 5px 0px;
      margin-bottom: 1rem;
    }

    /deep/ .modal-header {
      padding-top: 10px !important;
      padding-bottom: 10px !important;
    }

    .modal-mark-confirm {
      padding: 1.5rem 1.5rem 0rem 1.5rem;
      font-size: 15px;
      color: #000;
      div {
        margin-left: 1rem;
        margin-bottom: 0.5rem;
        label {
          font-weight: 500;
        }
        .total-score, .username {
          margin-left: -1rem;
          display: inline-block;
        }
        .pass-cus {
          display: inline-block;
          margin-left: 0.3rem;
        }
      }
    }

</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'
// service
import trainingQuestionService from 'domain/services/training-questions-service'
import {eventBus} from '../../../../main'

export default {
  name: 'ModalNote',

  props: {
    username: {
      default: ''
    },
    totalScore: {
      type: Number,
      default: 0
    },
    minimumScore: {
      type: Number,
      default: 0
    },
    dataRequest: {
      default: null
    },
    idStudent: null,
    idPeriod: null
  },

  data () {
    return {
      openModal: false,
      loading: false
    }
  },

  watch: {
    open (v) {
      this.openModal = v
    }
  },

  methods: {
    onClose () {
    },
    async onSave () {
      if (this.dataRequest === null) {
        return commonHelper.showMessage('Thiếu dữ liệu bài kiểm tra', 'warning')
      }
      let data = {
        ...this.dataRequest
      }
      try {
        this.loading = true
        const res = await trainingQuestionService.gradingEssay(data)
        if (res.data.success) {
          commonHelper.showMessage('Chấm điểm thành công', 'success')
          this.$emit('successMark')
          let dataEvent = {
            idStudent: this.idStudent,
            idPeriod: this.idPeriod,
            totalScore: this.totalScore,
            userTestId: this.dataRequest.test_id
          }
          eventBus.$emit('updateScore', dataEvent)
          this.$bvModal.hide('modal-confirm-mark')
        } else {
          return commonHelper.showMessage(res.data.message || 'Có lỗi xảy ra khi chấm bài', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (+e.response.status === 422) { return commonHelper.showMessage(e.response.data.message, 'warning') }
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>
</style>
