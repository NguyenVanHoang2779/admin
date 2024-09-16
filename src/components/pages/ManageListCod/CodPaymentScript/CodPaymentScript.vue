<template>
  <b-card>
    <div class="card-header px-0 d-flex justify-content-between">
      <h4 class="mb-0">Kịch bản Chốt nộp tiền, chốt ca</h4>
      <div v-if="dataLoading"><i class="fa fa-spin fa-spinner"/></div>
      <b-button variant="success" size="sm" @click.prevent="addScript()">
        <i class="fa fa-plus" aria-hidden="true"/>
        Thêm mới
      </b-button>
    </div>

    <div class="overflow-x-scroll table-responsive" style="max-height: 1000px">
      <table class="table w-xl-100 table-bordered" style="min-width: 800px">
        <tr class="text-center">
          <th style="width: 20%; min-width: 250px">Ngày</th>
          <th style="width: 22%; min-width: 150px">Thời gian thu tiền</th>
          <th style="width: 12%; min-width: 150px">Hình thức thanh toán</th>
          <th style="width: 40%; min-width: 400px">Chốt ca</th>
          <th>Thao tác</th>
        </tr>
        <tr v-for="(script, index) in codPaymentScripts" :key="index">
          <td>
            <day-of-week-multi-select
              :daysOfWeek="script.daysOfWeek"
              @handleDaysOfWeek="handleDaysOfWeek($event, index)"
              @change="computeDayOfWeekOptionsShouldBeIgnored"
              :session-index="index"
              :ignoreOptions="daysOfWeekShouldBeIgnored"
              :error-messages="errorMessages[index] ? errorMessages[index].daysOfWeek : []"
            />
          </td>
          <td>
            <payment-condition
              :initConfig.sync="script.paymentConditions"
              @handlePaymentConditions="handlePaymentConditions($event, index)"
              :session-index="index"
              :error-messages="errorMessages[index] ? errorMessages[index].paymentConditions : []"
            />
          </td>
          <td>
            <payment-gateway
              :initial.sync="script.paymentGateways"
              :session-index="index"
              @handlePaymentGateway="handlePaymentGateway($event, index)"
              :error-messages="errorMessages[index] ? errorMessages[index].paymentGateways : []"
            />
          </td>
          <td>
            <confirm-work-shift
              :initial-times.sync="script.confirmWorkShifts.times"
              :initial-details.sync="script.confirmWorkShifts.details"
              :session-index="index"
              @handleConfirmWorkShifts="handleConfirmWorkShifts($event, index)"
              :error-messages="errorMessages[index] ? errorMessages[index].confirmWorkShifts : []"

            />
          </td>
          <td>
            <b-button class="btn btn-light mt-2" size="sm" block @click.prevent="deleteScript(index)">Xóa</b-button>
          </td>
        </tr>
      </table>
    </div>
    <b-row class="mt-1">
      <b-col md="10" xs="12">
        <div v-if="mainErrorMessages.length" class="alert alert-warning">
          <div v-for="errorMessage in mainErrorMessages"><i class="text-danger">{{ errorMessage }}</i></div>
        </div>
      </b-col>
      <b-col md="2" xs="12" class="text-right">
        <b-button class="mb-3 input-size" @click.prevent="saveScript" variant="success" :disabled="dataLoading || !codPaymentScripts.length" v-if="codPaymentScripts.length || addButtonClicked">
          <i v-if="!dataLoading" class="fa fa-save"/>
          <i v-else class="fa fa-spin fa-spinner"/>
          Lưu
        </b-button>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import DayOfWeekMultiSelect from './DayOfWeekMultiSelect'
import PaymentCondition from './PaymentCondition.vue'
import PaymentGateway from './PaymentGateway.vue'
import ConfirmWorkShift from './ConfirmWorkShift'
import ManageListCodService from 'domain/services/manage-list-cod-service'
import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import DeliveryScript from '../../../../domain/entities/DeliveryScript'

export default {
  name: 'CodPaymentScript',
  components: {
    PaymentCondition,
    DayOfWeekMultiSelect,
    PaymentGateway,
    ConfirmWorkShift
  },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  created () {
    this.getCodPaymentScripts()
  },
  data () {
    return {
      message: '',
      dataLoading: false,
      codPaymentScripts: [],
      daysOfWeekShouldBeIgnored: [],
      errorMessages: [],
      mainErrorMessages: [],
      COLLECT_MONEY_BY_MINUTE: 8,
      COLLECT_MONEY_BY_SESSION: 9,
      COLLECT_MONEY_BY_WORK_SHIFT: 10,
      GATEWAY_CASH_IN_STATION: 2,
      GATEWAY_WALLET: 3,
      disabledSave: true,
      addButtonClicked: false
    }
  },
  computed: {
  },
  methods: {
    /**
     * Lấy cấu hình kịch bản
     * @returns {Promise<void>}
     */
    async getCodPaymentScripts () {
      try {
        this.dataLoading = true
        const data = await ManageListCodService.getCodPaymentScripts({user_id: this.userId})
        this.codPaymentScripts = this.initCodPaymentScript(data)
        this.dataLoading = false
      } catch (reason) {
        commonHelper.showMessage(reason, 'error', 'Có lỗi xẩy ra')
        this.message = reason.toString()
      } finally {
        this.dataLoading = false
      }
    },
    /**
     *
     * @param data
     * @returns {Promise<*>}
     */
    initCodPaymentScript (data) {
      return data.map((dataItem) => {
        return this.generateScript(dataItem)
      })
    },
    generateScript (dataItem) {
      const script = {
        paymentConditions: {},
        paymentGateways: {},
        confirmWorkShifts: {}
      }
      script.daysOfWeek = dataItem.days || []
      const paymentConditions = dataItem.payment_conditions || []

      const paymentConditionByMinute = paymentConditions.find((condition) => (Number(condition.id) === this.COLLECT_MONEY_BY_MINUTE)) || {}
      const paymentConditionBySession = paymentConditions.find((condition) => (Number(condition.id) === this.COLLECT_MONEY_BY_SESSION)) || {}
      const paymentConditionByWorkShift = paymentConditions.find((condition) => (Number(condition.id) === this.COLLECT_MONEY_BY_WORK_SHIFT)) || {}

      script.paymentConditions.byMinute = !!paymentConditionByMinute.id
      script.paymentConditions.minuteAmountConfig = paymentConditionByMinute.value || 0

      script.paymentConditions.bySession = !!paymentConditionBySession.id
      script.paymentConditions.sessionAmountConfig = paymentConditionBySession.value || 0

      script.paymentConditions.byWorkShift = !!paymentConditionByWorkShift.id

      const paymentGateway = dataItem.payment_gateways || []
      // const gatewayWallet = paymentGateway.find(gateway => (Number(gateway) === this.GATEWAY_WALLET))
      const gatewayCashInStation = paymentGateway.find(gateway => (Number(gateway) === this.GATEWAY_CASH_IN_STATION))

      // script.paymentGateways.wallet = !!gatewayWallet
      script.paymentGateways.wallet = true // phần wallet luôn được set là true theo yêu cầu của BA
      script.paymentGateways.cashInStation = !!gatewayCashInStation

      const inputConfirms = dataItem.confirm_work_shifts || {}
      script.confirmWorkShifts.times = Number(inputConfirms.times) || 0

      const confirmDetails = []
      confirmDetails.push(
        {time: (inputConfirms.confirm_time_1 || '').substring(0, 5), date: String(inputConfirms.confirm_day_1)},
        {time: (inputConfirms.confirm_time_2 || '').substring(0, 5), date: String(inputConfirms.confirm_day_2)},
        {time: (inputConfirms.confirm_time_3 || '').substring(0, 5), date: String(inputConfirms.confirm_day_3)}
      )
      script.confirmWorkShifts.details = confirmDetails
      return script
    },
    handleDaysOfWeek (days, index) {
      this.codPaymentScripts[index].daysOfWeek.splice(0, this.codPaymentScripts[index].daysOfWeek.length, ...days)
    },
    handlePaymentConditions (paymentConditions, index) {
      this.codPaymentScripts[index].paymentConditions = {...paymentConditions}
    },
    handlePaymentGateway (paymentGateways, index) {
      this.codPaymentScripts[index].paymentGateways = {...paymentGateways}
    },
    handleConfirmWorkShifts (confirmWorkShifts, index) {
      this.codPaymentScripts[index].confirmWorkShifts = {...confirmWorkShifts}
    },
    // Tính lại các options, vì sau khi chọn một lựa chọn thì lựa chọn này sẽ bị ẩn đi ở tất cả kịch bản
    computeDayOfWeekOptionsShouldBeIgnored () {
      this.daysOfWeekShouldBeIgnored = this.codPaymentScripts.map((script) => {
        return script.daysOfWeek
      }).flat()
    },
    /**
     * Show modal confirm xóa
     */
    async deleteScript (index) {
      this.$bvModal.msgBoxConfirm('Bạn có chắc chắn muốn xóa kịch bản này?', {
        title: 'Xác nhận xóa kịch bản',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Xác nhận',
        cancelTitle: 'Không',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(async value => {
          if (value) {
            this.codPaymentScripts.splice(index, 1)
            this.errorMessages.splice(index, 1)
            const newLength = this.codPaymentScripts.length
            if (!newLength) {
              this.disabledSave = true
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * Thêm kịch bản
     */
    addScript () {
      this.codPaymentScripts.push(this.generateScript({}))
      this.disabledSave = false
      this.addButtonClicked = true
    },
    /**
     * Lưu cấu hình kịch bản
     */
    async saveScript () {
      this.dataLoading = true
      try {
        if (this.validateSubmit()) {
          const dataSave = this.prepareDataSave(this.codPaymentScripts)
          await ManageListCodService.saveCodPaymentScripts({user_id: this.userId, details: dataSave})
          commonHelper.showMessage('Lưu cấu hình thành công', 'success', 'Thành công')
        }
      } catch (reason) {
        this.mainErrorMessages.push(reason instanceof Error ? reason.message : reason.toString())
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString(), 'error', 'Có lỗi xẩy ra')
      } finally {
        this.dataLoading = false
      }
    },
    /**
     * Validate giá trị cấu hình capacity của Cod theo phiên
     */
    validateSubmit () {
      this.errorMessages = []
      this.mainErrorMessages = []
      const daysOfWeekCheck = [false, false, false, false, false, false, false, false, false]
      this.codPaymentScripts.forEach((script) => {
        const errorMessage = {
          daysOfWeek: [],
          paymentConditions: [],
          paymentGateways: [],
          confirmWorkShifts: []
        }
        script.daysOfWeek.forEach(day => {
          daysOfWeekCheck[day] = true
        })
        if (!script.daysOfWeek.length) {
          errorMessage.daysOfWeek.push('Trường Ngày trong tuần không được để trống.')
        }
        if (!script.paymentConditions.byMinute && !script.paymentConditions.bySession && !script.paymentConditions.byWorkShift) {
          errorMessage.paymentConditions.push('Vui lòng cấu hình Thời gian thu tiền.')
        }
        if (
          (isNaN(parseInt(script.paymentConditions.minuteAmountConfig)) && script.paymentConditions.byMinute) ||
          (isNaN(parseInt(script.paymentConditions.sessionAmountConfig)) && script.paymentConditions.bySession)) {
          errorMessage.paymentConditions.push('Vui lòng nhập số phút hợp lệ.')
        }
        if (
          (script.paymentConditions.minuteAmountConfig < 0 && script.paymentConditions.byMinute) ||
          (script.paymentConditions.sessionAmountConfig < 0 && script.paymentConditions.bySession)) {
          errorMessage.paymentConditions.push('Vui lòng nhập số phút lớn hơn hoặc bằng 0.')
        }
        if (
          (script.paymentConditions.minuteAmountConfig > 1440 && script.paymentConditions.byMinute)) {
          errorMessage.paymentConditions.push('Vui lòng nhập số phút nhỏ hơn hoặc bằng 1440 phút.')
        }

        if (!script.paymentGateways.wallet) {
          errorMessage.paymentGateways.push('Lựa chọn thanh toán qua ví là lựa chọn bắt buộc.')
        }
        if (!script.paymentGateways.wallet && !script.paymentGateways.cashInStation) {
          errorMessage.paymentGateways.push('Vui lòng cấu hình Hình thức thanh toán.')
        }
        if (!script.confirmWorkShifts.times) {
          errorMessage.confirmWorkShifts.push('Vui lòng chọn số lượng ca cần chốt.')
        }
        script.confirmWorkShifts.details.slice(0, Number(script.confirmWorkShifts.times)).forEach((d, index) => {
          if (!d.time || isNaN(d.date)) {
            errorMessage.confirmWorkShifts.push(`Vui lòng cấu hình hạn chốt ca ${index + 1}.`)
          }
        })
        this.errorMessages.push(errorMessage)
      })
      const missingDays = []
      for (let i = 2; i <= 8; i++) {
        if (!daysOfWeekCheck[i]) {
          missingDays.push(i)
        }
      }
      if (missingDays.length > 0) {
        this.mainErrorMessages.push(
          `Vui lòng tạo kịch bản cho tất cả các ngày trong tuần. Còn thiếu: ${DeliveryScript.dayOfWeekOptions.filter((d) => missingDays.includes(d.value)).map(d => d.text).join(', ')}`
        )
      }
      const errorCount = this.errorMessages.map(eM => Object.values(eM)).flat(2).length + this.mainErrorMessages.length
      return !errorCount
    },
    /**
     * Format data trước khi gọi API lưu
     * @returns {{paymentGateways: {}, paymentConditions: {}, confirmWorkShifts: {}}}
     * @param scripts
     */
    prepareDataSave (scripts) {
      return scripts.map((script) => {
        const scriptToSave = {
          payment_conditions: [],
          payment_gateways: [],
          confirm_work_shifts: {}
        }
        scriptToSave.days = script.daysOfWeek || []

        const paymentConditions = script.paymentConditions || {}
        const paymentConditionsToSave = []
        paymentConditions.byMinute && paymentConditionsToSave.push({id: this.COLLECT_MONEY_BY_MINUTE, value: paymentConditions.minuteAmountConfig || 0})
        paymentConditions.bySession && paymentConditionsToSave.push({id: this.COLLECT_MONEY_BY_SESSION, value: paymentConditions.sessionAmountConfig || 0})
        paymentConditions.byWorkShift && paymentConditionsToSave.push({id: this.COLLECT_MONEY_BY_WORK_SHIFT, value: null})
        scriptToSave.payment_conditions = paymentConditionsToSave

        const paymentGateways = script.paymentGateways || {}
        const paymentGatewaysToSave = []
        paymentGateways.wallet && paymentGatewaysToSave.push(this.GATEWAY_WALLET)
        paymentGateways.cashInStation && paymentGatewaysToSave.push(this.GATEWAY_CASH_IN_STATION)
        scriptToSave.payment_gateways = paymentGatewaysToSave

        const scriptConfirmWorkShifts = script.confirmWorkShifts || {}
        const scriptConfirmWorkShiftDetails = scriptConfirmWorkShifts.details || []
        scriptToSave.confirm_work_shifts.times = scriptConfirmWorkShifts.times || 0
        scriptToSave.confirm_work_shifts.confirm_time_1 = scriptConfirmWorkShifts.times >= 1
          ? (scriptConfirmWorkShiftDetails[0] || {}).time + ':00'
          : null
        scriptToSave.confirm_work_shifts.confirm_day_1 = scriptConfirmWorkShifts.times >= 1 ? Number((scriptConfirmWorkShiftDetails[0] || {}).date) : null

        scriptToSave.confirm_work_shifts.confirm_time_2 = scriptConfirmWorkShifts.times >= 2
          ? (scriptConfirmWorkShiftDetails[1] || {}).time + ':00'
          : null
        scriptToSave.confirm_work_shifts.confirm_day_2 = scriptConfirmWorkShifts.times >= 2 ? Number((scriptConfirmWorkShiftDetails[1] || {}).date) : null

        scriptToSave.confirm_work_shifts.confirm_time_3 = scriptConfirmWorkShifts.times >= 3
          ? (scriptConfirmWorkShiftDetails[2] || {}).time + ':00'
          : null
        scriptToSave.confirm_work_shifts.confirm_day_3 = scriptConfirmWorkShifts.times >= 3 ? Number((scriptConfirmWorkShiftDetails[2] || {}).date) : null

        return scriptToSave
      })
    }
  }
}
</script>

<style scoped>
</style>
