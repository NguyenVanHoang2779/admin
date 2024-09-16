<template>
  <b-col>
    <b-form-checkbox v-model="cashInStation" class="mb-2">Bưu cục</b-form-checkbox>
    <b-form-checkbox disabled v-model="wallet" class="mb-2" >
      <span
        :id="`checkbox-wallet-${SessionIndex}`"
        v-b-popover.hover.right="'Lựa chọn thanh toán qua ví là lựa chọn bắt buộc'"
        class="pr-2"
      >
        Ví
      </span>
    </b-form-checkbox>
    <div v-for="errorMessage in errorMessages"><i class="text-danger">{{ errorMessage }}</i></div>
  </b-col>
</template>

<script>
export default {
  name: 'PaymentGateway',
  components: {
  },
  props: {
    initial: {
      type: Object,
      default: () => ({
        cashInStation: false,
        wallet: false
      })
    },
    errorMessages: {
      type: Array,
      default: () => ([])
    },
    SessionIndex: {
      type: Number,
      required: true
    }
  },
  created () {
  },
  data: () => ({
  }),
  methods: {
  },
  computed: {
    cashInStation: {
      get () {
        return this.initial.cashInStation
      },
      set (value) {
        const newConfig = {...this.initial, cashInStation: value}
        this.$emit('handlePaymentGateway', newConfig)
      }
    },
    wallet: {
      get () {
        return this.initial.wallet
      },
      set (value) {
        !value && this.$root.$emit('bv::show::popover', `checkbox-wallet-${this.SessionIndex}`)
        value && this.$root.$emit('bv::hide::popover', `checkbox-wallet-${this.SessionIndex}`)
        const newConfig = {...this.initial, wallet: value}
        this.$emit('handlePaymentGateway', newConfig)
      }
    }
  },
  watch: {
  }
}
</script>

<style scoped>
</style>
