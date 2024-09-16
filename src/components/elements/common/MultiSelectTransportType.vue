<template>
  <multi-select-filter-field-component
    :disabled="!!disabled"
    field="transport_type"
    v-model="selected"
  />
</template>
<script>
import MultiSelectFilterFieldComponent from './MultiSelectFilterFieldComponent'

export default {
  name: 'MultiSelectTransportType',
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
