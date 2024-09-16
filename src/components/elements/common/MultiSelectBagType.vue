<template>
  <multi-select-filter-field-component
    :disabled="!!disabled"
    :placeholder="placeholder"
    :multiple="multiple"
    field="bag_type"
    v-model="selected"
  />
</template>
<script>
import MultiSelectFilterFieldComponent from './MultiSelectFilterFieldComponent'

export default {
  name: 'MultiSelectBagType',
  props: {
    value: [Array, Number, String],
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
