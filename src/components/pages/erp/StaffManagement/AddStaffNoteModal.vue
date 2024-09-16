<template>
  <!-- Modal ghi chú nhân viên -->
  <b-modal
    v-model="openModal"
    :title="'Thêm ghi chú'"
    modal-class="modal-custom"
    :header-class="'text-center justify-content-center d-flex'"
    centered
    static
    id="modal-note"
    hide-footer
    @show="onShow()"
    @hide="onClose()">
    <div class="modal-note" v-loading="loading">
      <div>
        <b-form-textarea
          id="textarea-small"
          size="sm"
          placeholder="Nhập ghi chú"
          rows="4"
          v-model="currentNote">
        </b-form-textarea>
      </div>
    </div>
    <div class="text-center mb-2">
<!--      <b-btn variant="secondary" class="button-deny-modal" @click="onClose()">Đóng</b-btn>-->
      <b-btn variant="ghtk" id='btn-save-add-note' name='btn-save-add-note' class="button-deny-modal" @click="onSaveNote()">Lưu</b-btn>
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

    /deep/ .modal-header {
      padding-top: 10px !important;
      padding-bottom: 10px !important;
    }

    .modal-note {
      padding: 20px;
      font-size: 16px;
      color: #000;
    }

</style>

<script>

// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// service
import staffService from 'domain/services/staff-management-service'

export default {
  name: 'AddStaffNoteModal',

  props: {
    open: {
      default: false
    },
    options: {
      default: {}
    },
    user: {
      default: {}
    }
  },

  data () {
    return {
      loading: false,
      openModal: false,
      currentNote: null
    }
  },

  watch: {
    open (v) {
      this.openModal = v
    }
  },

  methods: {
    onShow () {

    },

    onClose () {
      this.currentNote = null
      this.openModal = false
      this.$emit('onCloseModal', 'noteModal')
    },

    async onSaveNote () {
      if (this.currentNote === null) {
        return commonHelper.showMessage('Vui lòng nhập ghi chú', 'warning')
      }
      this.loading = true
      try {
        const res = await staffService.addUserNote({
          user_id: this.user.id,
          note: this.currentNote,
          view_mode: this.options.viewMode
        })
        const {success, message} = res.data

        if (success) {
          if (this.options.callback) {
            this.options.callback()
          }
          commonHelper.showMessage(message, 'success')
          this.onClose()
        } else {
          commonHelper.showMessage(message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style scoped>

</style>
