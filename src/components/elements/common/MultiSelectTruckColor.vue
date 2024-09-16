<template>
  <multiselect
    placeholder="Chọn màu xe"
    v-model="option"
    :options="options"
    label="text"
    track-by="value"
    selectedLabel="Đã chọn"
    deselectLabel="Bỏ chọn"
    selectLabel="Chọn"
    :searchable="true"
    :clear-on-select="false"
    :disabled="isDisabled"
    >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-truck-color',
  props: {
    vehicleColor: null,
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Multiselect
  },

  mounted () {

  },

  data: () => ({
    option: null,
    options: [
      { value: '1', text: 'Trắng' },
      { value: '2', text: 'Xanh lá cây' }
    ]
  }),

  created () {

  },

  watch: {
    vehicleColor (v) {
      this.setSelectOption()
    },

    option (v) {
      this.$emit('handleChooseTruckColor', v)
    }
  },
  methods: {
    setSelectOption () {
      if (!this.vehicleColor) {
        this.option = null
      } else {
        if (this.options.length > 0) {
          this.option = this.options.find((item) => item.value === this.vehicleColor)
        } else this.option = null
      }
    }
  }
}
</script>

<style scoped>

</style>
