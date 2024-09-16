<template>
  <multiselect
          v-model="selectedCashier"
          :options="cashier"
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
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-cashier',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn người tạo hóa đơn'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    cashier: [],
    selectedCashier: []
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'bills/listCashier').then(response => {
        if (response.data.success) {
          this.cashier = response.data.data.options.cashier

          if (!this.multiple) {
            this.cashier.unshift({
              code: '',
              name: this.placeholder
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedCashier.length > 0) {
          for (let i = 0; i < this.selectedCashier.length; i++) {
            data.push(this.selectedCashier[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedCashier = selectedOptions.code
        this.$emit('selected', this.selectedCashier)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedCashier.length; i++) {
          if (this.selectedCashier[i].code !== removeOptions.code) {
            data.push(this.selectedCashier[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedCashier = this.multiple ? [] : ''
      this.$emit('selected', this.selectedCashier)
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
