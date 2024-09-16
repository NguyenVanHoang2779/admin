<template>
  <!-- Modal ghi chú ứng viên -->
    <b-modal modal-class="modal-custom" centered static :id="modalId" @hide="resetModal()"  hide-footer hide-header>
        <div class="modal-title">
            <span>Ghi chú</span>
        </div>
        <div class="modal-note-candidate">
            <div>
                <b-form-textarea
                    id="textarea-small"
                    size="sm"
                    placeholder="Nhập ghi chú"
                    rows="4"
                    v-model="content"
                ></b-form-textarea>
            </div>
        </div>
        <div class="text-center mt-3 mb-2">
            <b-btn variant="secondary" class="button-deny-modal" @click="closeModalNote()">Đóng</b-btn>
            <b-btn variant="ghtk" id='candidate-btn-save-add-note' name='candidate-btn-save-add-note' class="button-deny-modal" @click="note()">Lưu</b-btn>
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
.modal-title {
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
export default {
  name: 'ModalNote',
  props: {
    modalId: {
      default: 'modal-note'
    }
  },

  data () {
    return {
      content: null
    }
  },

  methods: {
    resetModal () {
      this.content = null
      this.$emit('hideModal')
    },

    note () {
      if (helper.isEmpty(this.note)) {
        helper.showMessage('Vui lòng nhâp nội dung ghi chú!', 'warning')
        return
      }
      this.$emit('makeNote', this.content)
    },

    closeModalNote () {
      this.$bvModal.hide(this.modalId)
      this.resetModal()
    }
  }
}
</script>

<style scoped>

</style>
