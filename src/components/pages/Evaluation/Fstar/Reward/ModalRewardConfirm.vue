<template>
  <div>
    <b-modal
      id="modal-action-reward-confirm"
      :title="title"
      scrollable
      hide-footer
      header-class="justify-content-center"
      centered
    >
      <div class="mb-4 text-center">
        {{content}}
      </div>
      <div class="mt-1 text-center" v-loading="loadingComponent">
        <button
          data-style="zoom-out"
          class="btn btn-outline-success mr-4 w-25"
          @click="$bvModal.hide('modal-action-reward-confirm')"
        >
          Hủy
        </button>
        <button
          data-style="zoom-out"
          class="btn btn-success ml-4 w-25"
          @click="submit"
        >
          Xác nhận
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import fstarService from 'domain/services/fstar-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'ModalRewardConfirm',
  props: {
    action: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    dataReward: {
      type: Object,
      default: _ => ({})
    }
  },
  computed: {
    helper: _ => helper
  },
  watch: {
    dataReward (newValue) {
      this.reward = newValue
    }
  },
  data () {
    return {
      loadingComponent: false,
      reward: {}
    }
  },
  methods: {
    emitSuccess () {
      this.$bvModal.hide('modal-action-reward-confirm')
      this.$emit('reloadListFstar')
    },
    async submit () {
      this.loadingComponent = true
      if (this.action === 'approve') {
        await this.submitApproveReward()
      } else if (this.action === 'remove') {
        await this.submitDeleteReward()
      } else if (this.action === 'cancel') {
        await this.submitCancelReward()
      }
      this.loadingComponent = false
    },
    async submitApproveReward () {
      await fstarService.approveReward({
        id: this.reward.id
      })
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.emitSuccess()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    },
    async submitDeleteReward () {
      await fstarService.deleteReward({
        id: this.reward.id
      })
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.emitSuccess()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    },
    async submitCancelReward () {
      await fstarService.cancelReward({
        id: this.reward.id
      })
        .then(response => {
          if (response.data.success) {
            helper.showMessage(response.data.message, 'success')
            this.emitSuccess()
          } else {
            helper.showMessage(response.data.message, 'error')
          }
        })
        .catch(error => {
          helper.showMessage(error.response.data.message, 'error')
        })
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ #modal-action-reward-confirm {
  div {
    div {
      border-radius: 8px;
      header {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
    }
  }
}
</style>
