<template>
  <div>
    <multiselect
            v-model="option"
            :options="options"
            :disabled="isDisabled"
            placeholder="Chọn chi nhánh"
            label="name"
            track-by="name"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import staffService from 'domain/services/staff-service'

export default {
  name: 'single-select-bank-brand',

  components: {
    Multiselect
  },

  props: {
    isDisabled: {
      type: Boolean
    },
    bankCode: {},
    brandId: {}
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    if (this.bankCode) {
      this.getListBrandsByBankCode(this.bankCode)
    }
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedBankBrand', newValue)
    },

    bankCode: function (newValue, oldValue) {
      this.getListBrandsByBankCode(newValue)
    },

    brandId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      }
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.brandId) {
        this.option = this.options.find((option) => {
          return option.id === this.brandId
        })
      }
    },

    getListBrandsByBankCode: function (bankCode) {
      let params = {
        bank_code: bankCode
      }
      staffService.getListBrandsByBankCode(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
