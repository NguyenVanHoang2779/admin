<template>
    <b-modal modal-class="modal-custom" size="sm"  static id="modal-force-active-wallet" hide-footer hide-header>
        <div class="modal-title-wallet">
            <span>Config bắt buộc kích hoạt ví</span>
        </div>
        <div class="modal-content-wallet">
            <b-form-checkbox v-model="isForce" name="check-button">
               <strong>Bắt buộc kích hoạt ví</strong>
            </b-form-checkbox>
        </div>
        <div class="text-center mb-2">
            <b-btn variant="ghtk" class="button-wallet" @click="saveConfigForceWallet()">Lưu config</b-btn>
            <b-btn variant="secondary" class="button-wallet" @click="hideModal()" >Đóng</b-btn>
        </div>
    </b-modal>
</template>

<style lang="scss" scoped>
    .modal-title-wallet {
        text-align: center;
        padding-top: 6px;
        padding-bottom: 6px;
        font-size: 18px;
        color: white;
        background: #069255;
    }
    .button-wallet {
        padding: 3px 10px;
        border-radius: 4px;
        width: 90px;
    }
    .modal-content-wallet {
        padding: 20px 30px;
    }
</style>

<script>
// service
import profileService from 'domain/services/profile-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-force-active-wallet',

  components: {
  },

  props: [
    'masterProfileId', 'isCurrentForce'
  ],

  data: () => ({
    isForce: false
  }),

  created () {
  },

  watch: {
    isCurrentForce: function (newValue, oldValue) {
      this.isForce = newValue
    }
  },

  methods: {
    hideModal () {
      this.isForce = false
      this.$bvModal.hide('modal-force-active-wallet')
      this.$emit('reset')
    },
    saveConfigForceWallet () {
      let data = {
        masterProfileId: this.masterProfileId,
        isForce: this.isForce
      }
      profileService.saveConfigForceWallet(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Thay đổi trạng thái bắt buộc kích hoạt ví thành công', 'success', 'Thông báo')
            this.hideModal()
          } else {
            helper.showMessage(res.data.message || 'Config bắt buộc kích hoạt ví thất bại', 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra.', 'warning', 'Lỗi')
        })
        .then(() => {
        })
    }
  }
}
</script>
