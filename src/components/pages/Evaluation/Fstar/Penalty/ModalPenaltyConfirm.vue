<template>
  <div>
    <b-modal
      id="modal-action-penalty-confirm"
      :title="title"
      scrollable
      hide-footer
      header-class="justify-content-center"
      centered
      @show="reason = ''"
    >
      <div class="mb-4 text-center">
        Bạn vui lòng nhập lý do bỏ phạt <span class="text-danger">*</span>
        <b-textarea v-model="reason" class="mt-2" rows="5" placeholder="Nhập lý do gỡ phạt"></b-textarea>
      </div>
      <div class="mt-1 text-center" v-loading="loadingComponent">
        <button
          data-style="zoom-out"
          class="btn btn-outline-success mr-4 w-25"
          @click="$bvModal.hide('modal-action-penalty-confirm'); reason = ''"
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
  name: 'ModalPenaltyConfirm',
  props: {
    action: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    dataPenalty: {
      type: Object,
      default: _ => ({})
    }
  },
  computed: {
    helper: _ => helper
  },
  data () {
    return {
      loadingComponent: false,
      reward: {},
      reason: ''
    }
  },
  methods: {
    emitSuccess () {
      this.$bvModal.hide('modal-action-penalty-confirm')
      this.$emit('reloadListFstar')
    },
    async submit () {
      this.loadingComponent = true
      if (this.action === 'cancel') {
        await this.submitCancelPenalty()
      }
      this.loadingComponent = false
    },
    async submitCancelPenalty () {
      if (this.reason === '') {
        helper.showMessage('Vui lòng nhập lý do bỏ phạt', 'warning')
        this.loadingComponent = false
        return
      }

      await fstarService.cancelPenalty({
        id: this.dataPenalty.id,
        reason: this.reason
      })
        .then(response => {
          if (response.data.success) {
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
/deep/ #modal-action-penalty-confirm {
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
