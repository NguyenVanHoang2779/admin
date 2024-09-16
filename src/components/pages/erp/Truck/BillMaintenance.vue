<template>
  <div :class="getClassBillBorder(indexBill)">
    <div class="col-md-12">
      <b-col style="text-align: right;padding: 0 !important;">
        <b-button variant="danger" size="sm" @click="removeBill(indexBill)" class="delete-btn"><i class="fa fa-times"/></b-button>
      </b-col>
      <b-row>
        <b-col md="8">
          <b-form-group label-cols-sm="5">
            <span slot="label">Số hóa đơn <span class="text-danger">*</span></span>
            <b-form-input
              v-model="infoBill.invoice_no"
              id="invoiceNo"
              name="invoiceNo"
              v-validate="{required: true, min: 16, max: 16, regex: /^[1-6][C|K](\w){5}?\.(\d)+$/}"
              placeholder="Số hóa đơn, ví dụ: 1C23TAA.12345678"
              :class="{'is-danger': errors.has('invoiceNo')}"
            >
            </b-form-input>
            <span v-show="errors.firstRule('invoiceNo') === 'required'" class="help is-danger">Không để trống trường này </span>
            <span v-show="errors.firstRule('invoiceNo') === 'min'" class="help is-danger">Số hóa đơn phải đúng 16 ký tự </span>
            <span v-show="errors.firstRule('invoiceNo') === 'max'" class="help is-danger">Số hóa đơn phải đúng 16 ký tự </span>
            <span v-show="errors.firstRule('invoiceNo') == 'regex'" class="help is-danger">Số hóa đơn không đúng định dạng  </span>
          </b-form-group>
          <p style="font-style: italic; font-size: 12px;">( Chú ý: Yêu cầu điền Ký hiệu hoá đơn + Số hoá đơn, ngăn cách bằng dấu (.) ở giữa. Nếu số hoá đơn không có đủ 8 chữ số thì điền thêm số 0 đằng trước cho đủ 8 chữ số ) </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-form-group label-cols-sm="5">
            <span slot="label">Ngày hóa đơn <span class="text-danger">*</span></span>
            <v-date-picker
              :popover="{visibility: 'focus'}"
              mode="date"
              format='dd-MM-yyyy'
              v-model="infoBill.invoice_date"
              locale="vi"
              color="green"
              placeholder="Chon thời gian"
              @input="search"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <!-- Đơn giá trước thuế, loại thuế -->
      <b-row>
        <b-col md="8">
          <b-form-group label-cols-sm="5">
            <span slot="label">Đơn giá trước thuế <span class="text-danger">*</span></span>
            <b-form-input
              v-model="infoBill.price_before_tax"
              @update="convertMoney"
              :formatter="convertMoney"
              id="priceBeforeTax"
              name="priceBeforeTax"
              v-validate="{required: true, max: 999999999999999999}"
              :class="{'is-danger': errors.has('priceBeforeTax')}"
              :disabled="!((isHaveOrder && isOrderWrongMoney) || !isHaveOrder)"
              @input="changePriceBeforeTax(true)"
            >
            </b-form-input>
            <span v-show="errors.firstRule('priceBeforeTax') === 'required'" class="help is-danger">Không để trống trường này </span>
            <span v-show="errors.firstRule('priceBeforeTax') === 'max'" class="help is-danger">Nhập tối đa 999.999.999.999.999.999 ký tự </span>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-form-group label-cols-sm="5">
            <span slot="label">Loại thuế <span class="text-danger">*</span></span>
            <b-form-radio-group
              size="sm"
              class="w-100"
              v-model="infoBill.tax"
              buttons
              button-variant="outline-info"
              @input="changeTax(true)"
            >
              <b-form-radio v-for="(option, index) in tax_options" :disabled="(parseInt(infoBill.tax) !== option.value) && !((isHaveOrder && isOrderWrongMoney) || !isHaveOrder)" class="w-25" :value="option.value" :key="index" v-b-tooltip="option.tooltip">{{option.text}}</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

Vue.use(VeeValidate)

export default {
  name: 'bill-maintenance',
  components: {

  },

  props: [
    'indexBill', 'bills', 'isHaveOrder', 'isOrderWrongMoney', 'maintenanceDate'
  ],

  mounted () {
    this.options = this.packageChoose
  },

  watch: {
    bills: function (newValue) {
      if (newValue) {
        this.fillData()
      }
    },
    infoBill: {
      deep: true,
      handler (v) {
        this.$emit('onUpdateBill', {id: this.indexBill, data: v})
      }
    }
  },

  data: () => ({
    infoBatterySelect: null,
    options: [],
    infoTireSelect: null,
    infoBill: {
      invoice_no: '',
      invoice_date: '',
      price_before_tax: 0,
      tax: 10
    },
    'tax_options': [
      {value: 0, text: '0%'},
      {value: 5, text: '5%'},
      {value: 7, text: '7%'},
      {value: 8, text: '8%'},
      {value: 10, text: '10%'},
      {value: null, text: 'Không VAT', tooltip: 'Không VAT: Không ghi thuế'}
    ],
    maintenanceType: ''
  }),

  created () {
    if (this.bills.length > 0) {
      this.fillData()
    }
  },

  methods: {
    removeBill (indexBill) {
      this.$emit('removeBill', indexBill)
      if (!this.isHaveOrder) {
        this.$emit('onUpdateNumberCost', {indexBill: -1, number: null, tax: 0, onchange: true})
      }
    },
    fillData () {
      if (this.bills[this.indexBill]) {
        this.infoBill = this.bills[this.indexBill]
        if (this.infoBill.invoice_date) this.infoBill.invoice_date = new Date(this.infoBill.invoice_date)
        this.infoBill.price_before_tax = this.convertMoney(this.infoBill.price_before_tax)
        this.infoBill.tax = (this.infoBill.tax !== undefined) ? this.infoBill.tax : 10
      }
    },
    getClassBillBorder (index) {
      return (index > 0) ? 'bill-border' : ''
    },
    convertMoney (money) {
      let result = (money + '').replace(/\D/g, '')
      return commonHelper.formatMoney(+result)
    },
    search () {
      if (this.infoBill.invoice_date) {
        if (moment(this.infoBill.invoice_date).format('YYYY-MM-DD') < moment(this.maintenanceDate).format('YYYY-MM-DD')) return commonHelper.showMessage('Ngày hóa đơn thứ ' + (this.indexBill + 1) + ' phải lớn hơn hoặc bằng ngày bảo dưỡng', 'warn')
      }
    },
    changePriceBeforeTax (onchange) {
      if (this.infoBill.price_before_tax) {
        this.infoBill.price_before_tax = this.convertMoney(this.infoBill.price_before_tax)
        this.$emit('onUpdateNumberCost', {indexBill: this.indexBill, number: this.infoBill.price_before_tax, tax: this.infoBill.tax, onchange: onchange})
      }
    },
    changeTax (onchange) {
      if (this.infoBill.tax) {
        this.$emit('onUpdateNumberCost', {indexBill: this.indexBill, number: this.infoBill.price_before_tax, tax: this.infoBill.tax, onchange: onchange})
      } else {
        this.$emit('onUpdateNumberCost', {indexBill: this.indexBill, number: this.infoBill.price_before_tax, onchange: onchange})
      }
    }
  }
}
</script>

<style scoped>
.is-danger {
  border-color: #E0B4B4;
  color: #9F3A38;
  box-shadow: none;
}
.bill-border {
  border-top: 1px solid #e2e2e2;
  padding-top: 25px;
}
</style>
