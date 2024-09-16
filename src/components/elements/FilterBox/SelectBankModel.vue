<template>
  <div>
    <b-form-group class="col-sm-12">
      <label class="font-weight-bold">Ngân hàng</label>
      <multiselect
          v-model="valueBank"
          :options="bank"
          :multiple="false"
          :placeholder="bankPlaceholder"
          track-by="name"
          label="name"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          @select="onSelect"
          @remove="onRemove"
          :taggable="true"
          v-bind:class="{ errorClass: errBank }"
          @open="errBank = false"
      />
    </b-form-group>
    <b-form-group class="col-sm-12">
      <label class="font-weight-bold">Chi nhánh ngân hàng</label>
      <multiselect
          v-model="valueBankBrand"
          :options="banksBrand"
          :multiple="false"
          :placeholder="brandPlaceholder"
          track-by="name"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          label="name" @select="onSelectBrand" @remove="onRemoveBrand"
          v-bind:class="{ errorClass: errBankBrand }"
          @open="errBankBrand = false"
      />
    </b-form-group>
  </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import shopService from 'domain/services/shop-service'
export default {
  name: 'select-bank-model',
  props: {
    bankPlaceholder: {
      type: String,
      default: 'Nhập ngân hàng'
    },
    brandPlaceholder: {
      type: String,
      default: 'Nhập chi nhánh ngân hàng'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    valueBank: '',
    valueBankBrand: '',
    bank: [],
    banksBrand: [],
    newSelectedBanks: '',
    newSelectedBanksBrand: '',
    errBank: false,
    errBankBrand: false
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'AdShopBank/getOptionSearch').then(response => {
        if (response.data.success) {
          this.bank = response.data.data.options.banks
          this.bank.unshift({
            code: '',
            name: this.placeholder
          })
        }
      })
    },
    onSelect: function (selectedOptions) {
      let self = this
      self.newSelectedBanks = selectedOptions.code
      self.$emit('selectedBank', this.newSelectedBanks)
      let bankCode = {
        'bank_code': self.newSelectedBanks
      }
      shopService.getBankBrand(bankCode).then(result => {
        if (result.data.success) {
          if (result.data.bank_brand) {
            self.banksBrand = result.data.bank_brand
            self.valueBankBrand = ''
            self.banksBrand.unshift({
              code: '',
              name: this.brandPlaceholder
            })
            self.newSelectedBanksBrand = ''
            this.$emit('selectedBankBrand', self.newSelectedBanksBrand)
          } else {
            self.banksBrand = [{
              code: 'không cần chi nhánh',
              name: 'Không cần chọn chi nhánh'
            }]
            self.valueBankBrand = self.banksBrand
            self.newSelectedBanksBrand = 'không cần chi nhánh'
            self.$emit('selectedBankBrand', self.newSelectedBanksBrand)
            self.errBankBrand = false
          }
        } else {
          alert('Có lỗi xảy ra')
        }
      })
    },
    onSelectBrand: function (selectedOptions) {
      this.newSelectedBanksBrand = selectedOptions.code
      this.$emit('selectedBankBrand', this.newSelectedBanksBrand)
    },
    onRemove: function () {
      this.newSelectedBanks = ''
      this.$emit('selectedBank', '')
    },
    onRemoveBrand: function () {
      this.newSelectedBanksBrand = ''
      this.$emit('selectedBankBrand', '')
    },
    reset: function () {
      this.newSelectedBanks = ''
      this.newSelectedBanksBrand = ''
    },
    fillOption: function (shopCode) {
      let self = this
      shopService.fillDataBank(shopCode).then(result => {
        if (result.data.success) {
          if (result.data.bank_shop.bank.code) {
            self.bank = result.data.banks
            self.banksBrand = result.data.brands
            self.bank.unshift({
              code: '',
              name: this.bankPlaceholder
            })
            self.banksBrand.unshift({
              code: '',
              name: this.brandPlaceholder
            })
            self.valueBank = result.data.bank_shop.bank
            self.valueBankBrand = result.data.bank_shop.brand
            self.newSelectedBanks = result.data.bank_shop.bank.code
            self.newSelectedBanksBrand = result.data.bank_shop.brand.code
            self.$emit('selectedBank', self.newSelectedBanks)
            self.$emit('selectedBankBrand', self.newSelectedBanksBrand)
          } else {
            self.bank = result.data.banks
            self.banksBrand = [{
              code: '',
              name: this.brandPlaceholder
            }]
            self.valueBank = ''
            self.valueBankBrand = ''
            self.newSelectedBanks = ''
            self.newSelectedBanksBrand = ''
            self.$emit('selectedBank', self.newSelectedBanks)
            self.$emit('selectedBankBrand', self.newSelectedBanksBrand)
          }
        } else {
          alert('Có lỗi xảy ra')
        }
      })
    },
    submit: function (errBank, errBankBrand) {
      this.errBank = errBank
      this.errBankBrand = errBankBrand
    }
  }
}
</script>

<style scoped>
  .errorClass {
    border: 1px solid red;
  }
</style>
