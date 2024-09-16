<template>
    <multiselect
            v-model="selectedPackageType"
            :options="packageTypes"
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
  name: 'select-package-type',
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
      default: 'Chọn loại đơn'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    packageTypes: [
      { name: 'Nội tỉnh', code: 'noitinh' },
      { name: 'Nội miền', code: 'noimien' },
      { name: 'Liên miền', code: 'lienmien' },
      { name: 'Đặc biệt', code: 'dacbiet' }
    ],
    selectedPackageType: []
  }),
  methods: {
    onSelect: function (selectedOptions, id) {
      if (this.multiple) {
        let data = []
        if (this.selectedPackageType.length > 0) {
          for (let i = 0; i < this.selectedPackageType.length; i++) {
            data.push(this.selectedPackageType[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedPackageType = selectedOptions.code
        this.$emit('selected', this.selectedPackageType)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedPackageType.length; i++) {
          if (this.selectedPackageType[i].code !== removeOptions.code) {
            data.push(this.selectedPackageType[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedPackageType = this.multiple ? [] : ''
      this.$emit('selected', this.selectedPackageType)
    }
  }
}
</script>

<style scoped>

</style>
