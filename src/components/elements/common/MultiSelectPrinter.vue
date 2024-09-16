<template>
  <multiselect
    v-model="option"
    :options="options"
    placeholder="Chọn máy in"
    :searchable="true"
    deselectLabel="Bỏ chọn"
    selectLabel="Chọn"
    selectedLabel="Đã chọn"
    track-by="name"
    label="name"
    :multiple="multiple"
    :disabled="isDisabled"
  >
    <span slot="noResult">Rất tiếc không tìm thấy</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-printer',
  components: {
    Multiselect
  },

  props: [
    'printerCodes', 'multiple', 'options', 'isDisabled'
  ],

  mounted () {
    this.option = this.options.find((item) => item.name === this.printerCodes)
  },

  watch: {
    printerCodes (newValue, oldValue) {
      this.option = this.options.find((item) => item.name === newValue)
    },

    option (newValue, oldValue) {
      this.$emit('handleChoosePrinterCode', newValue)
    },

    options (newValue) {
      if (newValue) {
        this.option = this.options.find((item) => item.name === this.printerCodes)
      }
    }
  },

  data: () => ({
    option: null
  }),

  created () {

  },

  methods: {

  }
}
</script>

<style scoped>

</style>
