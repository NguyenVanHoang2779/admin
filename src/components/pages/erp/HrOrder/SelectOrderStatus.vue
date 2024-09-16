<template>
    <multiselect
      v-model="option"
      :options="options"
      :disabled="disabled"
      :multiple="multiple"
      :class="[{'stateTrue': state === true, 'stateFalse' : state == false}, CustomClass]"
      :placeholder="placeholder"
      label="desc"
      track-by="value"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :hide-selected="hideSelect"
      :close-on-select="autoClose"
      @input="val => { $emit('input', val) }"
      @select="val => { $emit('select', val) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<style scoped>
  .stateTrue >>> .multiselect__tags {
    border-color: #28a745;
  }
  .stateFalse >>> .multiselect__tags {
    border-color: #d9534f;
  }
</style>

<script>
// entities
import Order from 'domain/entities/Order'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-order-status',
  props: {
    status: {},
    statusOptions: {
      type: Array,
      default: _ => ([])
    },
    disabled: {
      default: false,
      type: Boolean
    },
    multiple: {
      default: false,
      type: Boolean
    },
    hideSelect: {
      default: false,
      type: Boolean
    },
    autoClose: {
      default: true,
      type: Boolean
    },
    placeholder: {
      default: 'Chọn trạng thái'
    },
    state: {
      type: Boolean,
      default: null
    },
    CustomClass: {
      default: ''
    }
  },
  components: {
    Multiselect
  },

  created () {
    if (this.statusOptions && this.statusOptions.length) {
      this.options = this.typeOptions
      this.setList()
    }
  },

  data: _ => ({
    option: null,
    options: Order.statusOptions
  }),

  watch: {
    status (newVal, oldval) {
      this.setList()
    }
  },

  methods: {
    setList () {
      if (!this.options || !this.options.length || !this.status) {
        this.option = null
        return
      }
      if (!this.multiple) {
        let op = this.options.find(op => (op.value === this.status))
        if (op) this.option = op
        return
      }

      let status = this.status.split(',')
      let ops = this.options.filter(op => (status.includes(op.value)))
      this.option = ops
    }
  }
}
</script>
