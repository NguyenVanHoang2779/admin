<template>
    <multiselect
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="groupOption"
      :options="groupOptions"
      :multiple="multiple"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :hide-selected="hideSelect"
      :close-on-select="autoClose"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
</template>

<script>
// build component
import Multiselect from 'vue-multiselect'

// service
import profileService from 'domain/services/profile-service'

export default {
  name: 'select-group',

  props: {
    groupIds: {
      type: String,
      default: null
    },
    autoClose: {
      default: true
    },
    hideSelect: {
      default: true
    },
    placeholder: {
      default: 'Chọn nhóm'
    },
    multiple: {
      default: true,
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    groupOption: null,
    groupOptions: []
  }),

  created () {
    this.getGroup()
  },

  watch: {
    groupIds: function (newValue, oldValue) {
      if (newValue && this.groupOptions && this.groupOptions.length > 0) this.setList()
      else this.groupOption = null
    },

    groupOption: function (newValue, oldValue) {
      this.$emit('handleGroupSelected', newValue)
    }
  },

  methods: {
    setList () {
      if (this.groupIds && this.multiple) {
        this.groupOption = []
        this.groupIds.split(',').forEach(groupId => {
          let option = this.groupOptions.find(op => (+op.id === +groupId))
          if (option) this.groupOption.push(option)
        })
        return
      }
      if (this.groupIds) {
        this.groupOption = null
        let option = this.groupOptions.find(op => (+op.id === +this.groupIds))
        if (option) this.groupOption = option
      }
    },

    getGroup: function () {
      if (sessionStorage.getItem('allGroup')) {
        this.groupOptions = JSON.parse(sessionStorage.getItem('allGroup'))
        this.setList()
        return
      }
      profileService.getGroupList().then((res) => {
        if (res.data.success) {
          this.groupOptions = res.data.data
          this.setList()
          sessionStorage.setItem('allGroup', JSON.stringify(this.groupOptions))
        }
      }).catch((e) => {
        console.log(e)
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
