<template>
  <!-- Modal ghi chú ứng viên -->
    <b-modal modal-class="modal-custom" centered static id="modal-note-ticket" @hide="resetModal()"  hide-footer hide-header>
        <div class="modal-title-note">
            <span>Ghi chú</span>
        </div>
        <div class="modal-note-ticket">
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
            <b-btn variant="secondary" class="button-deny-modal" @click="closeModal()">Đóng</b-btn>
            <b-btn variant="ghtk" id='btn-save-note-ticket' name='btn-save-note-ticket' class="button-deny-modal" @click="comment()">Lưu</b-btn>
        </div>
    </b-modal>
</template>
<style lang="scss" scoped>
    ::placeholder {
        color: #828282;
    }
    .btn-save-note-ticket {
        border-radius: 5px;
        padding: 5px 30px;
    }
    .button-deny-modal {
        width: 100px;
        border-radius: 5px;
        padding: 5px 0px;
    }
    .modal-title-note {
        text-align: center;
        padding-top: 6px;
        padding-bottom: 6px;
        font-size: 18px;
        color: white;
        background: #069255;
    }
    .modal-note-ticket {
        padding: 20px;
        font-size: 16px;
        color: #000;
    }

</style>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import sosService from 'domain/services/internal-sos-service'
export default {
  name: 'ModalNote',
  props: {
    ticketId: {
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
    comment () {
      let newComment = {}
      newComment['ticket_id'] = this.ticketId
      newComment['note'] = this.currComment
      this.isLoading = true
      sosService.addComment(newComment)
        .then(res => {
          if (res.data.success) {
            this.closeModal()
            this.$emit('noteSuccess', res.data.data.noteJustAdded)
            helper.showMessage(res.data.message, 'success')
          }
          this.currComment = ''
        })
        .catch(e => {
          console.log(e)
        })
    },

    closeModal () {
      this.$emit('closeModalNote')
      this.$bvModal.hide('modal-note-ticket')
    }
  }
}
</script>
