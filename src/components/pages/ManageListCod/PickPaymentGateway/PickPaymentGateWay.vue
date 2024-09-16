<template>
  <div class="pick-payment-gateway">
    <b-card>
      <b-row>
        <b-col>
          <b class="mb-1 d-block">Phương thức chốt nộp cho PK</b>
          <div class="mb-1" v-for="paymentGate in paymentGateways.settings" :key="paymentGate.payment_gateway_id">
            <b-form-checkbox v-model="paymentGate.checked" :value="true">
              {{ paymentGate.title }}
            </b-form-checkbox>
          </div>
        </b-col>
      </b-row>
      <div class="d-flex justify-content-end align-items-center">
        <b-button class="input-size" type="button" variant="success" :disabled="saveLoading"
                  @click="onSubmit">
          <i v-if="!saveLoading" class="fa fa-save"/>
          <i v-else class="fa fa-spin fa-spinner"/>
          Lưu
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import manageListCodService from '../../../../domain/services/manage-list-cod-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'PickPaymentGateWay',
  components: {},
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      paymentGateways: {
        settings: [],
        current: []
      },
      loading: true,
      errorMessage: '',
      saveLoading: true
    }
  },
  created () {
    this.getConfigs()
  },
  methods: {
    async getConfigs () {
      if (!this.userId) {
        this.errorMessage = 'UserId không hợp lệ.'
        return
      }

      try {
        // get capacity config
        this.saveLoading = true
        const data = await manageListCodService.getPickPaymentGateWay({user_id: this.userId})
        this.paymentGateways.settings = data.settings.map((gate) => {
          return {
            payment_gateway_id: gate.payment_gateway_id,
            title: gate.title,
            checked: data.current.includes(gate.payment_gateway_id)
          }
        })
        this.paymentGateways.current = data.current
      } catch (reason) {
        this.errorMessage = reason.toString()
      } finally {
        this.saveLoading = false
      }
    },
    async onSubmit () {
      this.validationMessage = ''
      const gatewayIds = this.paymentGateways.settings.filter((gate) => gate.checked).map((gate) => gate.payment_gateway_id)
      // Kiểm tra thay đổi data
      if (!gatewayIds.length) {
        commonHelper.showMessage('Vui lòng chọn một phương thức chốt nộp cho PK.', 'warning')
        return
      }
      const changeConfig = gatewayIds.length !== this.paymentGateways.current.length || gatewayIds.filter((gateId) => !this.paymentGateways.current.includes(gateId)).length
      if (!changeConfig) {
        commonHelper.showMessage('Phương thức chốt nộp cho PK không thay đổi.', 'warning')
        return
      }

      try {
        this.saveLoading = true
        await manageListCodService.savePickPaymentGateWay({
          user_id: this.userId,
          configs: gatewayIds
        })
        commonHelper.showMessage('Lưu thông tin thành công.', 'success')
        await this.getConfigs()
      } catch (reason) {
        commonHelper.showMessage('Có lỗi xảy ra: ' + reason, 'warning')
      } finally {
        this.saveLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
