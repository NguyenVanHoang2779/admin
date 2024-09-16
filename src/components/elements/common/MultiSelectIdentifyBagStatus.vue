<template>
  <multi-select-filter-field-component
    :disabled="!!disabled"
    field="identify_bag_status"
    v-model="selected"
    :multiple="multiple"
    :placeholder="placeholder"
  />
</template>
<script>
import MultiSelectFilterFieldComponent from './MultiSelectFilterFieldComponent'

export default {
  name: 'MultiSelectIdentifyBagStatus',
  props: {
    value: Array,
    placeholder: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    multiple: {
      type: Boolean,
      default: true
    }
  },
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
