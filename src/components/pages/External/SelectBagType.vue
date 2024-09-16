<template>
  <multiselect
          v-model="SelectBagType"
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
  name: 'select-bag-type',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn kiểu bao'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    types: [
      {'code': 'sorting', 'name': 'sorting'},
      {'code': 'transit', 'name': 'transit'}
    ],
    SelectBagType: []
  }),
  methods: {
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.SelectBagType.length > 0) {
          for (let i = 0; i < this.SelectBagType.length; i++) {
            data.push(this.SelectBagType[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.SelectBagType = selectedOptions.code
        this.$emit('selected', this.SelectBagType)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.SelectBagType.length; i++) {
          if (this.SelectBagType[i].code !== removeOptions.code) {
            data.push(this.SelectBagType[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.SelectBagType = this.multiple ? [] : ''
      this.$emit('selected', this.SelectBagType)
    }
  }
}
</script>

<style scoped>

</style>
