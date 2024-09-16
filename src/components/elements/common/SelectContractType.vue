<template>
  <div>
    <multiselect
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :multiple="multiple"
      :disabled="disabled"
      label="desc"
      track-by="value"
      :close-on-select="autoClose"
      :hide-selected="hideSelect"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      @input="op => { $emit('input', op) }"
      @select="op => { $emit('select', op) }"
      @remove="op => { $emit('remove', op) }"
    >
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>

import Multiselect from 'vue-multiselect'
import Contract from 'domain/entities/Contract'

export default {
  name: 'select-contract-type',

  components: {
    Multiselect
  },

  props: {
    contractType: {
      default: null
    },
    placeholder: {
      type: String,
      default: 'Chọn loại hợp đồng'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    state: {
      default: null,
      type: Boolean
    },
    multiple: {
      default: false,
      type: Boolean
    },
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    }
  },

  data: () => ({
    storage: null,
    option: [],
    options: Contract.arrayTypeContract
  }),

  created () {
    this.setSelectedOption()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('change', newValue)
    },

    contractType (newValue, oldValue) {
      this.setSelectedOption()
    }
  },

  methods: {
    setSelectedOption () {
      if (!this.multiple) {
        if (this.options.length > 0 && this.contractType) this.option = this.options.find((option) => (option.value === this.contractType)) || null
        else this.option = null
        return
      }
      if (this.options.length > 0 && this.contractType) {
        this.option = []
        let contractType = this.contractType.split(',')
        let op = this.options.filter(option => (contractType.includes(option.value)))
        this.option.push(...op)
      }
    }
  }
}
</script>
