<template>
  <b-modal header-class="justify-content-center" header-bg-variant="green" static no-close-on-esc hide-header-close
           :title="'Ghi chú kit ' + assetAlias + ' (ID: #' + kitUserId + ' )'" v-model="showModal" hide-footer scrollable
           id="privateNote" @hidden="hideModal">
    <div class="text-center pb-3 description-text ">
      Vui lòng nhập tối thiểu 10 ký tự và có khoảng trắng
    </div>
    <b-form-input  type="text" placeholder="Nhập ghi chú" v-model="privateNote"></b-form-input>
    <div class="text-center pt-3" >
      <b-button variant="success" style="width: 400px" @click="addPrivateNote" :disabled="isSubmitting">
        <i class="fa fa-spin fa-spinner" v-if="isSubmitting"/>
        <i class="fa fa-check" v-else/>
        Xác nhận
      </b-button>
    </div>
  </b-modal>
</template>

<script>
import commonHelper from './../../../infrastructures/helpers/common-helpers'
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'

export default {
  name: 'AddPrivateNoteForKit',
  props: {
    assetAlias: String,
    kitUserId: Number,
    userId: Number
  },
  data () {
    return {
      showModal: false,
      privateNote: null,
      isNoteSuccess: false,
      isSubmitting: false
    }
  },
  watch: {
    kitUserId (newValue) {
      if (newValue) {
        this.resetModal()
        this.showModal = true
      }
    }
  },
  methods: {
    hideModal () {
      this.showModal = false
      this.$emit('changedPrivateNoteKit', {
        isNoteSuccess: this.isNoteSuccess
      })
      this.resetModal()
    },
    resetModal () {
      this.privateNote = null
      this.isNoteSuccess = false
    },
    async addPrivateNote () {
      try {
        if (!this.privateNote || !this.privateNote.trim()) {
          throw new Error('Bạn cần nhập thông tin Ghi chú !')
        }
        if (this.privateNote.trim().length < 10 || this.privateNote.trim().length > 100) {
          throw new Error('Vui lòng nhập ít nhất 10 kí tự và tối đa 100 kí tự!')
        }
        this.isSubmitting = true
        const message = await manageListBagBoxService.addPrivateNoteKit(this.kitUserId, this.privateNote, this.userId)
        this.isNoteSuccess = true
        this.hideModal()
        commonHelper.showMessage(message, 'success')
      } catch (message) {
        commonHelper.showMessage(message.toString(), 'error')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.description-text {
  font-size: 15px;
  font-weight: bold;
}
</style>
