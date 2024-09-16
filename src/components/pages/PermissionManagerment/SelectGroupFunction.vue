<template>
  <div>
    <multiselect class="multiselect-primary"
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="groupFunction"
      :options="groupFunctionOptions"
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
  name: 'select-group-function',

  props: {
    groupFunctionIds: {
      type: String,
      default: null
    },
    groupAdded: {
      default: null
    },
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      default: 'Chọn nhóm chức năng'
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
    groupFunction: null,
    groupFunctionOptions: []
  }),

  created () {
    this.getListGroupFunction()
  },

  watch: {
    groupAdded: function (newValue, oldValue) {
      if (newValue) this.groupFunctionOptions.unshift(newValue)
    },

    groupFunctionIds: function (newValue, oldValue) {
      if (newValue && this.groupFunctionOptions && this.groupFunctionOptions.length > 0) this.setList()
      else this.groupFunction = this.multiple ? [] : null
    },

    groupFunction: function (newValue, oldValue) {
      this.$emit('handleGroupFunctionSelected', newValue)
    }
  },

  methods: {
    setList () {
      if (!this.groupFunctionIds) {
        this.groupFunction = this.multiple ? [] : null
        return
      }
      if (this.multiple) {
        this.groupFunction = []
        this.groupFunctionIds.split(',').forEach(groupFunctionId => {
          let option = this.groupFunctionOptions.find(op => (+op.id === +groupFunctionId))
          if (option) this.groupFunction.push(option)
        })
        return
      }
      this.groupFunction = null
      let option = this.groupFunctionOptions.find(op => (+op.id === +this.groupFunctionIds))
      if (option) this.groupFunction = option
    },

    getListGroupFunction: function () {
      permissionService.getListGroupFunction().then((res) => {
        if (res.data.success) {
          this.groupFunctionOptions = res.data.data
          this.setList()
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
