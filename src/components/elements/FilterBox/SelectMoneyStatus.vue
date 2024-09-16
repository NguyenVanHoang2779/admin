<template>
    <multiselect
            v-model="selectedMoneyStatus"
            :options="moneyStatus"
            :multiple="multiple"
            :disabled="disabled"
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
  name: 'select-money-status',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn trạng thái'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    moneyStatus: [
      { name: 'Tiền đã thu COD', code: 'bill_gen' },
      { name: 'Tiền đã chốt ĐP', code: 'committed' },
      { name: 'Tiền đã nộp NH', code: 'confirmed' },
      { name: 'Tiền KT đã duyệt', code: 'accountancy_cf' }
    ],
    selectedMoneyStatus: []
  }),
  methods: {
    onSelect: function (selectedOptions, id) {
      if (this.multiple) {
        let data = []
        if (this.selectedMoneyStatus.length > 0) {
          for (let i = 0; i < this.selectedMoneyStatus.length; i++) {
            data.push(this.selectedMoneyStatus[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedMoneyStatus = selectedOptions.code
        this.$emit('selected', this.selectedMoneyStatus)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedMoneyStatus.length; i++) {
          if (this.selectedMoneyStatus[i].code !== removeOptions.code) {
            data.push(this.selectedMoneyStatus[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedMoneyStatus = this.multiple ? [] : ''
      this.$emit('selected', this.selectedMoneyStatus)
    }
  }
}
</script>

<style scoped>

</style>
