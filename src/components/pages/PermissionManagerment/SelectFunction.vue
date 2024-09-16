<template>
  <div>
    <multiselect class="multiselect-primary"
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="apiFunction"
      :options="functionOptions"
      :multiple="multiple"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :hide-selected="hideSelect"
      :close-on-select="autoClose"
      :disabled="disabled"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import permissionService from 'domain/services/permission-managerment-service'

export default {
  name: 'select-function',

  props: {
    groupFunctionIds: {
      type: String,
      default: null
    },
    functionIds: { // Mảng id chức năng
      default: null
    },
    functionAdded: {
      default: null
    },
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      default: 'Chọn chức năng'
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
    apiFunction: null,
    functionOptions: []
  }),

  created () {
    this.getListFunction()
  },

  watch: {
    groupFunctionIds: function (newValue, oldValue) {
      this.getListFunction()
    },

    functionAdded: function (newValue, oldValue) {
      if (newValue) this.functionOptions.unshift(newValue)
    },

    functionIds: function (newValue, oldValue) {
      if (newValue && this.functionOptions && this.functionOptions.length > 0) this.setList()
      else this.apiFunction = this.multiple ? [] : null
    },

    apiFunction: function (newValue, oldValue) {
      this.$emit('handleFunctionSelected', newValue)
    }
  },

  methods: {
    setList () {
      if (!this.functionIds) {
        this.apiFunction = this.multiple ? [] : null
        return
      }
      if (this.multiple) {
        this.apiFunction = []
        this.functionIds.split(',').forEach(functionId => {
          let option = this.functionOptions.find(op => (+op.id === +functionId))
          if (option) this.apiFunction.push(option)
        })
        return
      }
      this.apiFunction = null
      let option = this.functionOptions.find(op => (+op.id === +this.functionIds))
      if (option) this.apiFunction = option
    },

    getListFunction: function () {
      permissionService.getListFunction({groupFunctionId: this.groupFunctionIds}).then((res) => {
        if (res.data.success) {
          this.functionOptions = res.data.data
          this.setList()
        } else {
          this.functionOptions = []
          this.apiFunction = null
        }
      }).catch((err) => {
        console.log(err)
      })
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
