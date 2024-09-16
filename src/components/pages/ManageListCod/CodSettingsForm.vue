<template>
  <div class="cod-settings-form">
    <div>
      <b-container fluid>
        <b-card no-body class="mb-3">
          <div class="d-flex pt-2 pb-2 pl-3 pr-3 align-items-center ">
            <i class="fa fa-chevron-left pr-2 cursor-pointer" @click.prevent="goBack()"  />
            <h4 class="col mb-0">Thông số cấu hình COD <span v-if="showForm">- {{User.fullname}} </span></h4>
          </div>
        </b-card>

        <template v-if="showForm">
          <b-card class="mb-3">
            <b-row class="align-items-center">
              <div class="user-photo" :style="{backgroundImage: `url('${User.link_avatar}')` }" />
              <b-col>
                <div><b>{{User.alias}} - {{User.fullname}}</b></div>
                <div>
                  <span class="mr-3"><b>Loại Cod:</b> {{User.type}} {{User.cart_types.join('/')}}</span>
                  <span class="mr-3"><b>Bưu cục:</b> {{User.stations_name}}</span>
                  <span class="mr-3"><b>Thâm niên:</b> {{ User.joined_years ? `${User.joined_years} năm` : ''}} {{ User.joined_months ? `${User.joined_months} tháng ` : ''}}</span>
                  <span class="mr-3"><b>Hình thức:</b> {{User.work_type_description}}</span>
                </div>
              </b-col>
            </b-row>
          </b-card>

          <b-card v-for="cart in Carts" class="mb-3" :key="cart.cart_id">
            <b-row>
              <b-col>
                <b-row class="mb-1">
                  <b-col sm="3"><b>Tên tuyến</b></b-col>
                  <b-col>{{cart.cart_alias}}</b-col>
                </b-row>
                <b-row class="mb-1">
                  <b-col sm="3"><b>Shop</b></b-col>
                  <b-col>
                    <template v-if="cart.shops.length" >
                      <div v-for="shop in cart.shops" :key="shop.id">
                        {{shop.name}} - {{shop.first_address}} <template v-if="shop.last_address">, {{shop.last_address}}</template>
                      </div>
                    </template>
                    <template v-else>
                      Không có shop nào được chọn
                    </template>
                  </b-col>
                </b-row>
                <b-row v-for="(address, index) in cart.address" :key="index" class="mb-1">
                  <b-col sm="3"><b>{{address.address_type}}</b></b-col>
                  <b-col>{{address.address_name}}</b-col>
                </b-row>
              </b-col>
              <div>
                <a class="btn btn-primary" target="_blank" :href="`/admin/carts/edit/${cart.cart_id}`">Sửa</a>
              </div>
            </b-row>
          </b-card>
        </template>

        <div v-if="!showForm && !message" class="text-center m-3">
          <i class="fa fa-spin fa-spinner"/> Đang tải, vui lòng đợi trong giây lát ...
        </div>

        <b-alert v-if="message" :variant="messageType" ref="nofity" class="message" show v-html="filterHtml(message)" />

        <b-form v-if="showForm" @submit.prevent="onSubmitForm">
          <b-card class="mb-3">
            <b-row>
              <b-col sm="12" md="6" lg="6">
                <b> Thời gian làm việc</b>
                <b-row class="mb-2 mt-2" v-for="workShift in WorkShifts" :key="workShift.shift_id">
                  <b-col sm="3">
                    <label class="col-form-label">{{ workShift.title }} </label>
                  </b-col>
                  <b-col sm="9" class="form-inline">
                    <b-form-input size="sm" type="time" v-model="workShift.start_time" class="mr-2 input-size" :required="!!workShift.end_time" />
                    -
                    <b-form-input size="sm" type="time" v-model="workShift.end_time" class="ml-2 input-size"  :required="!!workShift.start_time" />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-card>

          <pk-bus-setting
            class="mb-3"
            :user-id="userId"
          />

          <b-card class="mb-3">
            <b-row>
              <b-col sm="12" md="6" lg="6">
                <div class="row">
                  <b-form-checkbox v-model="CodSetting.green_tick" :value="true">
                    COD tick xanh
                  </b-form-checkbox>
                </div>
                <b-row>
                  <b class="mr-3">Cần kiểm tra khi chốt ca</b>
                  <b-col md="8" sm="12">
                    <div class="mb-1" v-for="confirmCondition in ConfirmWorkShiftsConditions" :key="confirmCondition.confirm_condition_id">
                      <b-form-checkbox v-model="confirmCondition.checked" :value="true" :disabled="!confirmCondition.isAllBill && isCheckedAllBill">
                        <template v-if="confirmCondition.title.indexOf('{x}')!==-1">
                          {{confirmCondition.title.split('{x}')[0]}}
                          <b-input type="number" @click.prevent :readonly="!confirmCondition.checked" class="input-inline-sm" min="0" max="255" step="1" v-model="confirmCondition.confirm_condition_value" />
                          {{confirmCondition.title.split('{x}')[1]}}
                        </template>
                        <template v-else>
                          {{confirmCondition.title}}
                        </template>
                      </b-form-checkbox>
                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <b-col sm="12" md="6" lg="6">
                <b class="mb-1 d-block">Cần kiểm tra delay</b>
                <div class="mb-1" v-for="delayCondition in NeedCheckDelayConditions" :key="delayCondition.delay_condition_id">
                  <b-form-checkbox v-model="delayCondition.checked" :value="true">
                    {{delayCondition.title}}
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>
          </b-card>

          <b-card class="mb-3">
            <b-row>
              <b-col>
                <b class="mb-1 d-block">Thanh toán CoD khi xuất giao</b>
                <div>
                  <b-form-checkbox
                    v-for="(eWalletCondition) in EWalletConditions"
                    :key="eWalletCondition.ewallet_condition_id"
                    v-model="selectedEWalletConditions"
                    class="mb-1"
                    @change="handleChangeCheckbox($event)"
                    :value="eWalletCondition.ewallet_condition_id"
                    :disabled="(eWalletCondition.ewallet_condition_id === ACTIVE_BAD_DEBT_COD_BORROW_MONEY && !initialDataCodBadDebt) "
                  >
                    {{ eWalletCondition.title }}
                    <i
                      v-if="eWalletCondition.ewallet_condition_id === ACTIVE_BAD_DEBT_COD_BORROW_MONEY"
                      v-b-popover.hover.right="'Chỉ Bộ phân Nhân sự có quyền bật cấu hình COD nợ xấu ứng tiền.'"
                      class="fa fa-info-circle ml-2"
                    />
                  </b-form-checkbox>
                </div>
                <b class="mt-4 mb-1 d-block">{{ MaxPayoutAmount.title }}</b>
                <div :style="{width: '250px'}">
                  <b-input-group append="VND">
                    <b-form-input
                      placeholder="Nhập số tiền"
                      class="form-control"
                      @keydown.space.prevent
                      @keydown="preventNotANumber($event)"
                      type="text"
                      v-model="formattedMoney"
                      ref="max-payout-amount"
                    />
                  </b-input-group>
                </div>
              </b-col>
            </b-row>
          </b-card>

          <delivery-setting
            class="mb-3"
            :master="{DeliverTime, DeliveryHabits, Characteristics}"
            :address-lv4="cartAddressLevel4Ids"
            v-model="StopPoints"
            v-if="isCartTypeDelivery"
          />

          <div class="text-right">
            <b-button class="mb-3 input-size" type="submit" variant="success" :disabled="isLoading">
              <i v-if="!isLoading" class="fa fa-save"/>
              <i v-else class="fa fa-spin fa-spinner"/>
              Lưu
            </b-button>
          </div>
        </b-form>

        <pick-payment-gate-way
          v-if="showForm"
          class="mb-3"
          :user-id="userId"
        />

        <d-team-receive
          class="mb-3"
          v-if="showForm"
          :user-id="userId"
        />

        <cod-payment-script
          class="mb-3"
          v-if="showForm"
          :user-id="userId"
        />

        <picking-setting
          class="mb-3"
          :user-id="userId"
          :cart-address-level4-ids="cartAddressLevel4Ids"
          v-if="isCartTypePicking"
        />

        <pick-capacity
          v-if="showForm"
          class="mb-3"
          :user-id="userId"
          :is-cod-bad-debt="isCodBadDebt"
        />
        <work-capacity
          v-if="showForm"
          class="mb-3"
          :user-id="userId"
          :is-cod-bad-debt="isCodBadDebt"
        />
      </b-container>
    </div>
  </div>
</template>
<style src="@/assets/sass/components/cod-settings.scss" lang="scss"></style>

<script>
import manageListCodService from 'domain/services/manage-list-cod-service'
import Multiselect from 'vue-multiselect'
import DeliverySetting from './DeliverySettings/DeliverySetting'
import commonHelper from '../../../infrastructures/helpers/common-helpers'
import PkBusSetting from './PkBusSettings/PkBusSetting'
import PickingSetting from './PickingSettings/PickingSetting'
import ManageListCod from '../../../domain/entities/ManageListCod'
import WorkCapacity from './WorkCapacity/WorkCapacity'
import PickCapacity from './PickCapacity/PickCapacity'
import PickPaymentGateWay from './PickPaymentGateway/PickPaymentGateWay'
import CodPaymentScript from './CodPaymentScript/CodPaymentScript.vue'
import DTeamReceive from './DTeamReceive/DTeamReceive.vue'
import * as _ from 'lodash'

const ALL_BILL_ID = 1
const BAD_DEBT = 7
const ACTIVE_COD_BORROW_MONEY = 5
const MAX_PAYOUT_AMOUNT = 6
const COLLECT_MONEY_BY_MINUTE = 8
const COLLECT_MONEY_BY_SESSION = 9
const COLLECT_MONEY_BY_SHIFT = 10

// số phút tối đa có thể config thu tiền theo phút: 1 ca 24h => 24x60 = 1440 phút
const MAX_MINUTE_COLLECT_MONEY = 1440

// Ứng tiền COD
const EWALLET_ADVANCE_MONEY = [
  ACTIVE_COD_BORROW_MONEY,
  MAX_PAYOUT_AMOUNT,
  BAD_DEBT
]

// Thời gian thu tiền
const EWALLET_COLLECT_MONEY = [
  COLLECT_MONEY_BY_MINUTE,
  COLLECT_MONEY_BY_SESSION,
  COLLECT_MONEY_BY_SHIFT
]

export default {
  components: {
    WorkCapacity,
    PickCapacity,
    PkBusSetting,
    PickingSetting,
    CodPaymentScript,
    DeliverySetting,
    PickPaymentGateWay,
    Multiselect,
    DTeamReceive
  },

  created () {
    this.getSettings()
  },

  computed: {
    formattedMoney: {
      get: function () {
        if (this.MaxPayoutAmount.value === 0) {
          return ''
        }
        return this.MaxPayoutAmount.value.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
      set: function (newValue) {
        this.MaxPayoutAmount.value = Number(newValue.replace(/\D/g, '').replace(/,/g, ''))
      }
    },
    isCheckedAllBill () {
      return this.ConfirmWorkShiftsConditions.some(condition => condition.checked && condition.isAllBill)
    },
    /**
     * Danh sách các địa chỉ cấp 4 của giỏ hàng được gán với COD hiện tại
     */
    cartAddressLevel4Ids () {
      if (!this.Carts || !Array.isArray(this.Carts)) {
        return []
      }
      const addressLv4 = new Set()
      this.Carts.forEach(cart => {
        if (!cart.address || !Array.isArray(cart.address)) {
          return
        }
        cart.address.forEach(address => {
          if (address.lv4_id) {
            addressLv4.add(parseInt(address.lv4_id))
          }
        })
      })
      return Array.from(addressLv4)
    },

    isCartTypeDelivery () {
      return this.Carts.some(cart => Number(cart.cart_type) === ManageListCod.DELIVERY_CART)
    },

    isCartTypePicking () {
      return this.Carts.some(cart => Number(cart.cart_type) === ManageListCod.PICKING_CART)
    },

    isCodBadDebt () {
      const selected = this.selectedEWalletConditions.map((item) => Number(item))
      return selected.includes(BAD_DEBT)
    }
  },
  data () {
    return {
      isLoading: true,
      message: '',
      messageType: 'warn',
      showForm: false,
      MAX_PAYOUT_AMOUNT: 6,
      ACTIVE_COD_BORROW_MONEY: 5,
      ACTIVE_BAD_DEBT_COD_BORROW_MONEY: 7,
      COLLECT_MONEY_BY_MINUTE: COLLECT_MONEY_BY_MINUTE,
      DEFAULT_MAX_PAYOUT_AMOUNT: 40000000, // giá trị autofill max-payout-amount là 40 triệu
      User: {},
      Carts: [],
      WorkShifts: [],
      ConfirmWorkShiftsConditions: [],
      EWalletConditions: {},
      DeliverTime: [], // Khung thời gian giao hàng.
      DeliveryHabits: [], // Thói quen nhận hàng.
      Characteristics: [], // Đặc điểm khu vực giao hàng.
      NeedCheckDelayConditions: [],
      StopPoints: [],
      DayConfirms: [
        {value: 0, text: 'Ngày xuất giao'},
        {value: 1, text: 'Ngày xuất giao + 1'}
      ],
      ShiftsConfirms: [
        {value: 1, text: '1 ca'},
        {value: 2, text: '2 ca'},
        {value: 3, text: '3 ca'}
      ],
      userId: Number(this.$route.params.id),
      MaxPayoutAmount: {},
      selectedEWalletConditions: [],
      CodSetting: {},
      CollectMooney: [],
      // Dữ liệu config ban đầu khi call api lấy thông tin COD. Nếu config ban đầu là nợ xấu --> cho phép thao tác tắt
      initialDataCodBadDebt: false
    }
  },
  methods: {
    preventNotANumber (e) {
      let allowedKeys = [8, 46, 38, 40, 37, 39]
      const keyPressed = e.which || e.keyCode
      if (/\D/.test(e.key)) {
        if (allowedKeys.every(e => e !== keyPressed)) {
          e.preventDefault()
        }
      }
    },
    filterHtml (message) {
      return commonHelper.filterHtml(message)
    },
    goBack () {
      this.$router.push({name: 'manage-list-cod/list', query: {back: 'true'}})
    },
    handleChangeCheckbox (selectedConditionId) {
      this.selectedEWalletConditions = selectedConditionId ? [selectedConditionId] : []

      switch (selectedConditionId) {
        case this.ACTIVE_COD_BORROW_MONEY:
          // Gợi ý số tiền hàng tối đa
          this.$refs['max-payout-amount'].focus()
          if (this.MaxPayoutAmount.value === 0) {
            this.MaxPayoutAmount.value = this.DEFAULT_MAX_PAYOUT_AMOUNT
          }
          break
      }
    },
    handleChangeCollectMoney (selectedConditionId, eWalletConditionId) {
      if (!selectedConditionId) {
        return
      }
      this.CollectMooney = this.CollectMooney.map((condition) => {
        return {
          ewallet_condition_id: condition.ewallet_condition_id,
          ewallet_condition_value: condition.ewallet_condition_value,
          title: condition.title,
          checked: condition.ewallet_condition_id === eWalletConditionId
        }
      })
    },
    async onSubmitForm () {
      const ConfirmWorkShiftsConditions = this.isCheckedAllBill
        ? this.ConfirmWorkShiftsConditions.filter((condtion) => condtion.isAllBill)
        : this.ConfirmWorkShiftsConditions.filter((condtion) => condtion.checked)
      const CollectMoney = this.CollectMooney.filter((condtion) => condtion.checked)

      const collectMoneyData = CollectMoney.map(condition => {
        return {
          ewallet_condition_id: condition.ewallet_condition_id,
          ewallet_condition_value: condition.ewallet_condition_value
        }
      })

      const eWalletConditionsData = this.selectedEWalletConditions.map((condition) => {
        return {ewallet_condition_id: condition}
      })

      const data = {
        WorkShifts: this.WorkShifts,
        ConfirmWorkShiftsConditions: ConfirmWorkShiftsConditions.map(condition => {
          return {
            confirm_condition_id: condition.confirm_condition_id,
            confirm_condition_value: condition.confirm_condition_value
          }
        }),
        NeedCheckDelayConditions: this.NeedCheckDelayConditions.filter(gate => gate.checked).map(gate => {
          return {
            delay_condition_id: gate.delay_condition_id
          }
        }),
        EWalletConditions: eWalletConditionsData.concat(collectMoneyData),
        CodSetting: {
          green_tick: this.CodSetting.green_tick
        },
        CodStopPointConfig: this.getStopPoints()
      }
      if (this.MaxPayoutAmount.value !== 0) {
        data.EWalletConditions.push({
          ewallet_condition_id: this.MaxPayoutAmount.ewallet_condition_id,
          ewallet_condition_value: !_.isEmpty(this.MaxPayoutAmount.value) ? 0 : this.MaxPayoutAmount.value
        })
      }

      try {
        this.message = ''
        this.validateInputData(data)
        this.isLoading = true
        const message = await manageListCodService.saveCodSetting(this.$route.params.id, data)
        this.setMessage(message, 'info')
        this.updateDataAfterSaving(data)
      } catch (reason) {
        this.setMessage(reason instanceof Error ? reason.message : reason.toString(), 'warning')
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Kiểm tra dữ liệu user nhập vào đã đầy đủ hay chưa
     */
    validateInputData (data) {
      const errorMessage = {}
      const errors = []

      // Validate lộ trình
      if (data.CodStopPointConfig.length) {
        data.CodStopPointConfig.forEach((stopPoint, stopPointIndex) => {
          const stopPointError = []
          if (!stopPoint.points.length) {
            stopPointError.push('Bạn chưa vị trí các điểm.')
          }

          if (!stopPoint.delivery_habits.length) {
            stopPointError.push('Bạn chưa chọn Yêu cầu nhận hàng.')
          }

          if (!stopPoint.characteristics.length) {
            stopPointError.push('Bạn chưa chọn Đặc tính khu vực.')
          }

          if (!stopPoint.deliver_time.length) {
            stopPointError.push('Bạn chưa chọn Khung thời gian nhận hàng.')
          }

          if (stopPointError.length) {
            errorMessage.CodStopPointConfig = errorMessage.CodStopPointConfig || []
            errorMessage.CodStopPointConfig.push(`<ul>Điểm ${stopPointIndex + 1}:<li> ${stopPointError.join('</li> <li>')}</li></ul>`)
          }
        })

        if (errorMessage.CodStopPointConfig && errorMessage.CodStopPointConfig.length) {
          errors.push('<b>Lộ Trình:</b> ' + errorMessage.CodStopPointConfig.join(' '))
        }
      }

      // validate cấu hình thanh toán CoD
      if (this.selectedEWalletConditions.length > 1) {
        errors.push('Chỉ được chọn 1 trong 2 cấu hình thanh toán CoD.')
      }

      // validate số tiền tối đa được xuất giao
      data.EWalletConditions.forEach((condition) => {
        switch (condition.ewallet_condition_id) {
          case this.MAX_PAYOUT_AMOUNT:
            if (condition.ewallet_condition_value < 0 || !Number.isInteger(condition.ewallet_condition_value)) {
              errors.push('Số tiền hàng tối đa COD được xuất giao trong 1 ca phải là một số nguyên > 0.')
            }
            if (condition.ewallet_condition_value.toString().length > 9) {
              errors.push('Số tiền hàng tối đa COD được xuất giao trong 1 ca tối đa 9 chữ số.')
            }
            break
          case this.COLLECT_MONEY_BY_MINUTE:
            if (condition.ewallet_condition_value < 0 || (typeof condition.ewallet_condition_value !== 'number')) {
              errors.push('Số phút phải lớn hơn hoặc bằng 0.')
            }
            if (Number(condition.ewallet_condition_value) > MAX_MINUTE_COLLECT_MONEY) {
              errors.push(`Số phút không quá ${MAX_MINUTE_COLLECT_MONEY} phút.`)
            }
            break
        }
      })
      // Có lỗi validate
      if (errors.length) {
        throw new Error('<li>' + errors.join('</li><li>') + '</li>')
      }
    },

    /**
     * Tạo format để lưu thông tin về lộ trình
     */
    getStopPoints () {
      if (!this.StopPoints || !Array.isArray(this.StopPoints)) {
        return []
      }

      return this.StopPoints.map((stopPoint, stopPointIndex) => {
        // Format lại dữ liệu
        ['delivery_habits', 'characteristics'].forEach(fieldName => {
          if (!Array.isArray(stopPoint[fieldName])) {
            stopPoint[fieldName] = []
          }

          stopPoint[fieldName] = stopPoint[fieldName].map(item => {
            const id = Number(item.id)
            return {id: isNaN(id) ? null : id, name: item.name}
          })
        })

        // Format lại deliver_time
        stopPoint.deliver_time = Array.isArray(stopPoint.deliver_time) ? stopPoint.deliver_time : []
        stopPoint.deliver_time = stopPoint.deliver_time.map(deliverTime => {
          const id = Number(deliverTime.id)
          return {
            id: isNaN(id) ? null : id,
            start_time: deliverTime.start_time,
            end_time: deliverTime.end_time
          }
        })

        return stopPoint
      })
    },

    removeSecondInTime (time) {
      if (!time) {
        return ''
      }
      const timeParts = time.split(':')
      return [timeParts[0] || '', timeParts[1] || ''].join(':')
    },

    setData (data) {
      this.User = data.Cod
      this.Carts = data.Carts

      this.WorkShifts = data.Master.WorkShifts.map((shift) => {
        const shiftValue = data.Settings.WorkShifts.find((userShift) => Number(userShift.shift_id) === shift.shift_id)
        shift.start_time = shiftValue ? this.removeSecondInTime(shiftValue.start_time) : ''
        shift.end_time = shiftValue ? this.removeSecondInTime(shiftValue.end_time) : ''
        shift.pick_count = shiftValue ? shiftValue.pick_count : ''
        return shift
      })

      this.CodSetting = data.Settings.CodSetting

      this.ConfirmWorkShiftsConditions = data.Master.ConfirmWorkShiftsConditions.map((condition) => {
        const confirmValue = data.Settings.ConfirmWorkShiftsConditions.find((row) => Number(row.confirm_condition_id) === condition.confirm_condition_id)
        return {
          confirm_condition_id: condition.confirm_condition_id,
          confirm_condition_value: confirmValue ? confirmValue.confirm_condition_value : null,
          title: condition.title,
          checked: !!confirmValue,
          isAllBill: condition.confirm_condition_id === ALL_BILL_ID
        }
      })

      this.CollectMooney = data.Master.CollectMoney.map((condition) => {
        const confirmValue = data.Settings.CollectMoney.find((row) => Number(row.ewallet_condition_id) === condition.ewallet_condition_id)
        return {
          ewallet_condition_id: condition.ewallet_condition_id,
          ewallet_condition_value: confirmValue ? Number(confirmValue.ewallet_condition_value) : 0,
          title: condition.title,
          checked: !!confirmValue
        }
      })

      this.NeedCheckDelayConditions = data.Master.NeedCheckDelayConditions.map((gate) => {
        return {
          delay_condition_id: gate.delay_condition_id,
          title: gate.title,
          checked: data.Settings.NeedCheckDelayConditions.some((row) => Number(row.delay_condition_id) === gate.delay_condition_id)
        }
      })

      data.Master.EWalletConditions.forEach((condition) => {
        condition.ewallet_condition_id = Number(condition.ewallet_condition_id)
        if (condition.ewallet_condition_id !== this.MAX_PAYOUT_AMOUNT) {
          this.EWalletConditions[condition.ewallet_condition_id] = condition
          return
        }

        this.MaxPayoutAmount = {
          title: condition.title,
          ewallet_condition_id: condition.ewallet_condition_id,
          value: 0
        }
      })

      data.Settings.EWalletConditions.forEach((condition) => {
        if (Number(condition.ewallet_condition_id) !== this.MAX_PAYOUT_AMOUNT) {
          this.selectedEWalletConditions.push(condition.ewallet_condition_id)
        } else {
          this.MaxPayoutAmount.value = Number(condition.ewallet_condition_value)
        }
        if (Number(condition.ewallet_condition_id) === this.ACTIVE_BAD_DEBT_COD_BORROW_MONEY) {
          this.initialDataCodBadDebt = true
        }
      })

      this.DeliverTime = data.Master.DeliverTime
      this.DeliveryHabits = data.Master.DeliveryHabits
      this.Characteristics = data.Master.Characteristics
      this.StopPoints = data.Settings.CodStopPointConfig || []
    },
    setMessage (message, messageType) {
      this.message = message
      this.messageType = messageType
      if (this.message) {
        this.$nextTick(() => {
          if (this.$refs.nofity && this.$refs.nofity.$el) {
            // Browser Safari not support this feature
            this.$refs.nofity.$el.scrollIntoView({
              block: 'center',
              inline: 'center',
              behavior: 'smooth'
            })
          }
        })
      }
    },
    updateDataAfterSaving (data) {
      // OSNV-9297: Update lại UI set nợ xấu: disable button bật nợ xấu sau khi có action tắt nợ xấu.
      const badDebtCodData = data.EWalletConditions.find(ewalletCondition => {
        return ewalletCondition.ewallet_condition_id === this.ACTIVE_BAD_DEBT_COD_BORROW_MONEY
      })
      if (badDebtCodData) {
        this.initialDataCodBadDebt = true
      } else {
        this.initialDataCodBadDebt = false
      }
    },

    async getSettings () {
      try {
        this.showForm = false
        this.isLoading = true
        const apiResponse = await manageListCodService.getCodSetting(this.$route.params.id)
        this.setData(this.formatData(apiResponse))
        this.showForm = true
      } catch (reason) {
        this.setMessage(reason.toString(), 'warning')
      } finally {
        this.isLoading = false
      }
    },

    formatData (data) {
      const eWalletConditions = data.Settings.EWalletConditions
      const eWalletConditionMasters = data.Master.EWalletConditions
      data.Settings.CollectMoney = eWalletConditions.filter((condition) => EWALLET_COLLECT_MONEY.includes(Number(condition.ewallet_condition_id)))
      data.Settings.EWalletConditions = eWalletConditions.filter((condition) => EWALLET_ADVANCE_MONEY.includes(Number(condition.ewallet_condition_id)))
      data.Master.CollectMoney = eWalletConditionMasters.filter((condition) => EWALLET_COLLECT_MONEY.includes(Number(condition.ewallet_condition_id)))
      data.Master.EWalletConditions = eWalletConditionMasters.filter((condition) => EWALLET_ADVANCE_MONEY.includes(Number(condition.ewallet_condition_id)))

      return data
    }
  }
}
</script>
