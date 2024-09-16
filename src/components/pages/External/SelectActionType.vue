<template>
  <multiselect
          v-model="SelectActionType"
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
  name: 'select-action-type',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn mốc (tạo bao, nhập kho , xuất kho)'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    types: [
      {'code': 'Imported', 'name': 'Nhập kho'},
      {'code': 'Exported', 'name': 'Xuất kho'},
      {'code': 'Created', 'name': 'Tạo bao'}
    ],
    SelectActionType: []
  }),
  methods: {
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.SelectActionType.length > 0) {
          for (let i = 0; i < this.SelectActionType.length; i++) {
            data.push(this.SelectActionType[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.SelectActionType = selectedOptions.code
        this.$emit('selected', this.SelectActionType)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.SelectActionType.length; i++) {
          if (this.SelectActionType[i].code !== removeOptions.code) {
            data.push(this.SelectActionType[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.SelectActionType = this.multiple ? [] : ''
      this.$emit('selected', this.SelectActionType)
    }
  }
}
</script>

<style scoped>

</style>
