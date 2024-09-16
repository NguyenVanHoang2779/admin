<template>
    <div>
        <b-modal size="lg" id="modal-request-refund" ref="modalRequestRefund" :hide-footer="true" title="Yêu cầu tiền hoàn cọc " @hide="reSet" static>
            <div>
                <b-form-group id="input-group-1" :label="'Nhập số tiền cần hoàn cọc cho nhân viên ' + item.fullname + ':'">
                    <b-form-input
                            v-model="request_money"
                            name="request_money"
                            v-validate="{required: true, numeric: true, max_value: item.total_deposited_money}"
                            placeholder="Nhập số tiền"
                            :class="{'is-danger': errors.has('request_money')}"
                    ></b-form-input>
                    <span v-show="errors.firstRule('request_money') == 'required'" class="help is-danger">Không để trống trường này </span>
                    <span v-show="errors.firstRule('request_money') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                    <span v-show="errors.firstRule('request_money') == 'max_value'" class="help is-danger">Số tiền không được vượt quá {{formatMoney(item.total_deposited_money)}} VNĐ</span>
                </b-form-group>
                <b-form-group  id="input-group-2" label="Ngày dự kiến hoàn cọc:">
                    <b-form-input v-model="date_expect_refund" type="date" disabled></b-form-input>
                </b-form-group>
                <b-button :loading="isProcessingUpdate" @click="requestRefund()" variant="primary">Yêu cầu</b-button>
                <b-button @click="reSet()" variant="danger">Reset</b-button>
            </div>
        </b-modal>
    </div>
</template>

<style scoped>
    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }
</style>

<script>
import depositService from 'domain/services/deposit-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import cycleTime from 'infrastructures/helpers/date.js'
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})
export default {
  name: 'modal-request-refund',

  components: {},

  props: [
    'item'
  ],

  data: () => ({
    isProcessingUpdate: false,
    request_money: '',
    show: true
  }),

  created () {
  },

  watch: {},

  computed: {
    date_expect_refund () {
      return cycleTime.getDateExpectRefund()
    }
  },

  methods: {
    formatMoney (value) {
      return commonHelper.formatMoney(value)
    },
    requestRefund: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let data = {
            'master_profile_id': this.item.master_profile_id,
            'deposit_id': this.item.deposit_id,
            'request_money': this.request_money,
            'date_expect_refund': this.date_expect_refund
          }

          depositService.requestRefund(data)
            .then((res) => {
              if (res.data.success) {
                commonHelper.showMessage(res.data.message, 'success')
                this.hideModal()
              } else {
                commonHelper.showMessage(res.data.message, 'warning')
              }
            })
            .catch((e) => {
              console.log(e)
            })
            .then(() => {
              this.$stopLoading()
            })
        }
      })
    },
    hideModal: function () {
      this.$refs.modalRequestRefund.hide()
    },
    updateData: function () {
      this.$emit('updateData')
    },
    reSet: function () {
      this.request_money = ''
    }
  }
}
</script>
