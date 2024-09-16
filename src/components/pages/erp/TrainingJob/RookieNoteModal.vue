<template>
  <!-- Modal ghi học viên -->
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
<!--    <div class="modal-title">-->
<!--      <span>Ghi chú</span>-->
<!--    </div>-->
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
import newStaffService from 'domain/services/new-staff.service'

export default {
  name: 'ModalNote',

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
      class_ids: [],
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
      if (this.user.hasOwnProperty('list_class')) {
        if (this.user.list_class.happening.length > 0) {
          this.class_ids = this.user.list_class.happening.map(item => item.id)
        } else {
          this.class_ids = this.user.list_class.completed.length > 0 ? [this.user.list_class.completed[0].id] : []
        }
      }
      // this.getNotes()
    },

    onClose () {
      this.class_ids = []
      this.currentNote = null
      this.openModal = false
      this.$emit('onCloseModal', 'noteModal')
    },

    async getNotes (classIds) {
      this.loading = true
      try {
        const res = await newStaffService.getUserNoteInClass({
          'user_id': this.user.id,
          'class_ids': classIds || this.class_ids
        })
        const {success, message, data} = res.data
        if (success) {
          console.log('getNotes', data)
        } else {
          commonHelper.showMessage(message, 'warning')
        }
      } catch (e) {
        commonHelper.showMessage(e.message, 'error')
      } finally {
        this.loading = false
      }
    },

    async onSaveNote () {
      this.loading = true
      try {
        const res = await newStaffService.addNoteEducate({
          'user_id': this.user.id,
          'master_profile_id': this.user.master_profile_id,
          'class_ids': this.class_ids,
          'note': this.currentNote
        })
        const {success, message} = res.data

        if (success) {
          if (this.options.callback) {
            this.options.callback()
          }
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
