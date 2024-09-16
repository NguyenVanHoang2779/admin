<template>
  <multiselect
    v-model="option"
    :options="options"
    placeholder="Chọn máy quét"
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
  name: 'multi-select-scanning-gun',
  components: {
    Multiselect
  },

  props: [
    'scanningCodes', 'multiple', 'options', 'isDisabled'
  ],

  mounted () {
    this.option = this.options.find((item) => item.name === this.scanningCodes)
  },

  watch: {
    scanningCodes (newValue, oldValue) {
      this.option = this.options.find((item) => item.name === newValue)
    },

    option (newValue, oldValue) {
      this.$emit('handleChooseScanningCode', newValue)
    },

    options (newValue) {
      if (newValue) {
        this.option = this.options.find((item) => item.name === this.scanningCodes)
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
