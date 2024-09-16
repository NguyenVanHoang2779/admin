<template>
  <multiselect
          v-model="selectedBillType"
          :options="types"
          :multiple="multiple"
          :placeholder="placeholder"
          track-by="name"
          label="name"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          @select="onSelect"
          @remove="onRemove"
  />
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-bill-type',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn kiểu hóa đơn'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    types: [
      {'code': 'refund', 'name': 'Hóa đơn thu tiền'},
      {'code': 'refund_online', 'name': 'Hóa đơn thu tiền online'},
      {'code': 'refund_payment', 'name': 'Hóa đơn buyer thanh toán'},
      {'code': 'prepayment', 'name': 'Hóa đơn trả trước'},
      {'code': 'prepayment_online', 'name': 'Hóa đơn trả trước online'},
      {'code': 'prepayment_qr', 'name': 'Hóa đơn trả trước QR'},
      {'code': 'debt', 'name': 'Hóa đơn shop nợ'},
      {'code': 'debt_online', 'name': 'Hóa đơn shop nợ online'},
      {'code': 'debt_qr', 'name': 'Hóa đơn shop nợ QR'},
      {'code': 'return_debt', 'name': 'Hóa đơn thu nợ trả hàng'},
      {'code': 'return_debt_online', 'name': 'Hóa đơn thu nợ trả hàng online'},
      {'code': 'return_debt_qr', 'name': 'Hóa đơn thu nợ trả hàng QR'},
      {'code': 'idebt', 'name': 'Hóa đơn buyer nợ'},
      {'code': 'refund_payment_qr', 'name': 'Hóa đơn chốt ca qua QR'}
    ],
    selectedBillType: []
  }),
  methods: {
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedBillType.length > 0) {
          for (let i = 0; i < this.selectedBillType.length; i++) {
            data.push(this.selectedBillType[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedBillType = selectedOptions.code
        this.$emit('selected', this.selectedBillType)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedBillType.length; i++) {
          if (this.selectedBillType[i].code !== removeOptions.code) {
            data.push(this.selectedBillType[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedBillType = this.multiple ? [] : ''
      this.$emit('selected', this.selectedBillType)
    }
  }
}
</script>

<style scoped>

</style>
