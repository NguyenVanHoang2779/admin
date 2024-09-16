<template>
  <div>
    <b-form-checkbox v-model.number="conditionSelected" :value="BY_MINUTE" class="mb-2">
      Theo phút:
      <b-input :disabled="conditionSelected !== BY_MINUTE" type="number" v-model.number="minuteAmountConfig" class="input-inline-sm"/>
      <small>phút</small>
    </b-form-checkbox>
    <b-form-checkbox v-model.number="conditionSelected" :value="BY_SESSION" class="mb-2">
      Theo phiên:
      <b-input :disabled="conditionSelected !== BY_SESSION" type="number" v-model.number="sessionAmountConfig" class="input-inline-sm"/>
      <small>phút nộp muộn</small>
    </b-form-checkbox>
    <b-form-checkbox v-model.number="conditionSelected" :value="BY_WORK_SHIFT" class="mb-2">
      Theo ca
    </b-form-checkbox>
    <div v-for="errorMessage in errorMessages"><i class="text-danger">{{ errorMessage }}</i></div>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'

export default {
  name: 'PaymentCondition',
  components: {
    multiselect,
    ManageLineService
  },
  props: {
    initConfig: {
      type: Object,
      default: () => ({
        byMinute: false,
        bySession: false,
        byWorkShift: false,
        minuteAmountConfig: 0,
        sessionAmountConfig: 0
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
  mounted () {
  },
  data: () => ({
    BY_MINUTE: 1,
    BY_SESSION: 2,
    BY_WORK_SHIFT: 3
  }),
  methods: {
    changeData (newRow) {
      const newConfig = {...this.initConfig, ...newRow}
      this.$emit('handlePaymentConditions', newConfig)
    }
  },
  watch: {
  },
  computed: {
    conditionSelected: {
      get () {
        if (this.initConfig.byMinute) {
          return this.BY_MINUTE
        }
        if (this.initConfig.bySession) {
          return this.BY_SESSION
        }
        if (this.initConfig.byWorkShift) {
          return this.BY_WORK_SHIFT
        }
      },
      set (val) {
        const newRow = {byMinute: false, bySession: false, byWorkShift: false}
        switch (val) {
          case this.BY_MINUTE:
            newRow.byMinute = true
            break
          case this.BY_SESSION:
            newRow.bySession = true
            break
          case this.BY_WORK_SHIFT:
            newRow.byWorkShift = true
            break
        }
        this.changeData(newRow)
      }
    },
    minuteAmountConfig: {
      get () {
        return this.initConfig.minuteAmountConfig
      },
      set (val) {
        this.changeData({minuteAmountConfig: val})
      }
    },
    sessionAmountConfig: {
      get () {
        return this.initConfig.sessionAmountConfig
      },
      set (val) {
        this.changeData({sessionAmountConfig: val})
      }
    }
  }
}
</script>

<style scoped>
</style>
