<template>
  <multiselect
          v-model="SelectTransportType"
          :options="types"
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

import Multiselect from 'vue-multiselect'

export default {
  name: 'select-transport-type',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn kiểu hiển thị'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    types: [
      {'code': 'fly', 'name': 'fly'},
      {'code': 'road', 'name': 'road'}
    ],
    SelectTransportType: []
  }),
  methods: {
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.SelectTransportType.length > 0) {
          for (let i = 0; i < this.SelectTransportType.length; i++) {
            data.push(this.SelectTransportType[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.SelectTransportType = selectedOptions.code
        this.$emit('selected', this.SelectTransportType)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.SelectTransportType.length; i++) {
          if (this.SelectTransportType[i].code !== removeOptions.code) {
            data.push(this.SelectTransportType[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.SelectTransportType = this.multiple ? [] : ''
      this.$emit('selected', this.SelectTransportType)
    }
  }
}
</script>

<style scoped>

</style>
