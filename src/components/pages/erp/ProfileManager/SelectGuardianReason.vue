<template>
  <multiselect
    :value="value"
    :options="options[optionType] || []"
    :multiple="multiple"
    :placeholder="placeholder"
    label="text"
    track-by="value"
    selected-label=""
    deselect-label="X"
    select-label=""
    :disabled="disabled"
    :hide-selected="hideSelected"
    :close-on-select="autoClose"
    @input="ops => { $emit('input', ops) }"
    @change="op => { $emit('change', op) }"
    @remove="op => { $emit('remove', op) }"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import {approveBltndsOption, rejectBltndsOption} from './OptionConst.js'

export default {
  name: 'select-guardian-reason',

  components: {
    Multiselect
  },

  props: {
    value: {
      default: null
    },
    reasons: {
      default: null
    },
    optionType: {
      default: 'approved'
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    hideSelected: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      default: 'Chọn lý do'
    }
  },

  data: () => ({
    options: {
      approved: approveBltndsOption,
      rejected: rejectBltndsOption
    }
  }),

  created () {},

  watch: {
    reasons (newValue, oldValue) {
      this.setOption()
    }
  },

  methods: {
  }
}
</script>
