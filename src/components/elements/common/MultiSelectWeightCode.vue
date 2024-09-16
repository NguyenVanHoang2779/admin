<template>
  <multiselect
    v-model="optionWeight"
    :options="optionsWeight"
    placeholder="Chọn cân"
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
  name: 'multi-select-weight-code',
  components: {
    Multiselect
  },

  props: [
    'weightCodes', 'multiple', 'optionsWeight', 'isDisabled'
  ],

  mounted () {
    this.optionWeight = this.optionsWeight.find((item) => item.name === this.weightCodes)
  },

  watch: {
    weightCodes (newValue, oldValue) {
      this.optionWeight = this.optionsWeight.find((item) => item.name === newValue)
    },

    optionWeight (newValue, oldValue) {
      this.$emit('handleChooseWeightCode', newValue)
    },

    optionsWeight (newValue) {
      if (newValue) {
        this.optionWeight = this.optionsWeight.find((item) => item.name === this.weightCodes)
      }
    }
  },

  data: () => ({
    optionWeight: null
  }),

  created () {

  },

  methods: {

  }
}
</script>

<style scoped>

</style>
