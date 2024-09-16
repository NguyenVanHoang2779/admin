<template>
  <!-- Modal ghi chú ứng viên -->
  <b-modal modal-class="modal-custom" centered  static id="modal-note-candidate" @hide="resetModal()"  hide-footer hide-header>
    <div class="modal-title-contact">
      <span>Ghi chú</span>
    </div>
    <div class="modal-note-candidate">
      <div>
        <b-form-textarea
          id="textarea-small"
          size="sm"
          placeholder="Nhập ghi chú"
          rows="4"
          v-model="currComment"
        ></b-form-textarea>
      </div>
    </div>
    <div class="text-center mt-3 mb-2">
      <b-btn variant="secondary" class="button-deny-modal" @click="closeModalNote()">Đóng</b-btn>
      <b-btn variant="ghtk" id='candidate-btn-save-add-note' name='candidate-btn-save-add-note' class="button-deny-modal" @click="comment(currentCandidate)">Lưu</b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
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
    }
    .modal-title-contact {
      text-align: center;
      padding-top: 6px;
      padding-bottom: 6px;
      font-size: 18px;
      color: white;
      background: #069255;
    }
    .modal-note-candidate {
      padding: 20px;
      font-size: 16px;
      color: #000;
    }

</style>

<script>

// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import candidateService from 'domain/services/candidate-service'
export default {
  name: 'ModalNote',
  props: {
    currentCandidate: {
      default: null
    }
  },
  data () {
    return {
      currComment: null
    }
  },
  methods: {
    resetModal () {
      this.currComment = null
    },

    comment (candidate) {
      let newComment = {}
      newComment['candidate_id'] = candidate.id
      newComment['content'] = this.currComment
      this.isLoading = true
      candidateService.addComment(newComment)
        .then(res => {
          if (res.data.success) {
            this.currentCandidate.logs = this.currentCandidate.logs || []
            this.currentCandidate.logs.push(res.data.candidate_log)
            this.closeModalNote()
            helper.showMessage('Thêm ghi chú thành công', 'success')
          }
          this.currComment = ''
        })
        .catch(e => {
          console.log(e)
        })
    },

    closeModalNote () {
      this.$bvModal.hide('modal-note-candidate')
    }
  }
}
</script>

<style scoped>

</style>
