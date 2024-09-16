<template>
  <multi-select-filter-field-component
    :disabled="!!disabled"
    field="bag_transfer_status"
    v-model="selected"
  />
</template>
<script>
import MultiSelectFilterFieldComponent from './MultiSelectFilterFieldComponent'

export default {
  name: 'MultiSelectBagTransferStatus',
  props: ['disabled', 'value'],
  components: {
    MultiSelectFilterFieldComponent
  },
  computed: {
    selected: {
      get: function () {
        return this.value
      },
      set: function (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
