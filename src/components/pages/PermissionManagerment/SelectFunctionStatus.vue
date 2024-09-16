<template>
  <div>
    <multiselect class="multiselect-primary"
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="status"
      :options="functionStatusOptions"
      :multiple="multiple"
      :placeholder="placeholder"
      label="desc"
      track-by="value"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :close-on-select="autoClose"
      :disabled="disabled"
    >
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'select-function-status',

  props: {
    functionStatus: {
      default: null
    },
    autoClose: {
      default: true
    },
    placeholder: {
      default: 'Chọn trạng thái'
    },
    multiple: {
      default: false,
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    },
    disabled: {
      default: false
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    status: null,
    functionStatusOptions: [
      {value: 'active', desc: 'Active'},
      {value: 'lock', desc: 'Lock'},
      {value: 'disable', desc: 'Disable'}
    ]
  }),

  watch: {

    functionStatus: function (newValue, oldValue) {
      if (newValue) this.setList()
      else this.status = this.multiple ? [] : null
    },

    status: function (newValue, oldValue) {
      this.$emit('handleFunctionStatusSelected', newValue)
    }
  },

  methods: {
    setList () {
      if (!this.functionStatus) {
        this.status = this.multiple ? [] : null
        return
      }
      if (this.multiple) {
        this.status = []
        this.functionStatus.split(',').forEach(status => {
          let option = this.functionStatusOptions.find(op => (op.value === status))
          if (option) this.status.push(option)
        })
        return
      }
      this.status = null
      let option = this.functionStatusOptions.find(op => (op.value === this.functionStatus))
      if (option) this.status = option
    }
  }
}
</script>

<style scoped>
  .stateTrue >>> .multiselect__tags {
    border-color: #28a745;
  }
  .stateFalse >>> .multiselect__tags {
    border-color: #d9534f;
  }
</style>
