<template>
  <select class="form-control" @input="$emit('input', $event.target.value)" :class="selectClass" :value="value">
    <option :value="!value && value" disabled hidden selected>{{ placeholder }}</option>
    <slot name="options">
      <option v-for="(op, idx) in options" :key="idx" :value="op.value" :class="optionClass">{{ op.text }}</option>
    </slot>
  </select>
</template>

<script>
export default {
  name: 'select-option',

  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      default: []
    },
    selectClass: {
      default: null
    },
    optionClass: {
      default: null
    },
    placeholder: {
      default: ''
    }
  },

  data: () => ({
    // val: this.value
  }),

  methods: {
  }
}
</script>
