<template>
  <b-modal
    :id="noteModalId"
    modal-class="modal-custom"
    size="lg"
    centered
    static
    hide-footer
    hide-header
  >
    <div class="title-note-modal">
      <span>{{ title }}</span>
      <button class="btn-hide-note-modal" @click="closeModal()">
        <img src="../../../../assets/images/icon/icon-hide.png" alt="icon-hide">
      </button>
    </div>
    <div
      class="content-note-modal"
    >
      <b-form-group>
        <b-form-textarea
          :id="noteElementId"
          :name="noteElementId"
          v-model="form.content"
          :aria-describedby="inputNoteId"
          :state="validateState('content')"
          placeholder="Nhập ghi chú"
        ></b-form-textarea>
        <b-form-invalid-feedback class="invalid-text" :id="inputNoteId">
          {{ messages.required }}
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div class="text-center mt-2 mb-2">
      <b-btn
        variant="ghtk"
        class="btn button-close-note-modal"
        @click="save()"
      >
        Lưu
      </b-btn>
    </div>
  </b-modal>
</template>

<script>
// services
import ticketService from '../../../../domain/services/ticket-service'

// helpers
import helpers from '../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'NoteModal',
  props: {
    title: {
      type: String,
      default: 'Ghi chú'
    },
    noteModalId: {
      type: String,
      default: 'note-modal'
    },
    ticketId: {
      type: Number
    }
  },
  data: () => ({
    form: {
      content: null
    },
    noteElementId: 'note',
    inputNoteId: 'input-note',
    messages: {
      required: 'Bạn chưa nhập nội dung ghi chú'
    }
  }),
  created () {
    this.noteElementId = helpers.generateUniqueId(this.noteElementId)
    this.inputNoteId = helpers.generateUniqueId(this.inputNoteId)
  },
  methods: {
    validateState (ref) {
      if (this.form[ref] !== null) {
        return this.form[ref].length > 0
      }
      return null
    },
    closeModal () {
      this.$bvModal.hide(this.noteModalId)
    },
    save () {
      if (!this.form.content) {
        this.form.content = ''
        helpers.showMessage(this.messages.required, 'warning', 'Thông báo')
        return
      }
      this.createNote()
    },
    async createNote () {
      try {
        const res = await ticketService.createNote({
          ticket_id: this.ticketId,
          content: this.form.content
        })
        if (res.data.success) {
          helpers.showMessage('Tạo ghi chú thành công', 'success', 'Thành công')
          this.closeModal()
          this.form.content = null
          this.$parent.$parent.$parent.isRefreshDataLog = true
        } else {
          helpers.showMessage(res.data.message || 'Có lỗi khi tạo ghi chú!', 'error', 'Lỗi')
        }
      } catch (error) {
        console.log(error)
        helpers.showMessage('Có lỗi khi tạo ghi chú!', 'error', 'Lỗi')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../assets/sass/components/modal-common.scss';
</style>
