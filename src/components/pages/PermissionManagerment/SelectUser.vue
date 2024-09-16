<template>
  <div>
    <multiselect
      :class="multiselectClass"
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :custom-label="customLabel"
      track-by="username"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
      :disabled="disabled"
      :multiple="multiple"
      :hide-selected="hideSelected"
      :close-on-select="autoClose"
      @input="op => { $emit('input', op) }"
      @select="op => { $emit('select', op) }"
      @remove="op => { $emit('remove', op) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import userService from 'domain/services/user-service'

export default {
  name: 'select-user',

  components: {
    Multiselect
  },

  props: {
    autoClose: {
      default: true
    },
    placeholder: {
      default: 'Chọn nhân viên'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    userIds: {
      type: String
    },
    hideSelected: {
      default: true
    },
    groupUser: {
      default: null
    },
    multiselectClass: {
      default: 'multiselect-primary'
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getListUser()
  },

  watch: {
    userIds (newVal, oldVal) {
      if (!this.options || this.options.length === 0 || !this.userIds) {
        this.option = null
        return
      }
      this.setList()
    },

    option (newVal, oldVal) {
      this.$emit('handleSelectedUser', newVal)
    },

    groupUser (newVal, oldVal) {
      this.getListUser()
    }
  },

  methods: {
    customLabel ({fullname, username, stationName}) {
      return username + ' (' + fullname + ' - ' + stationName + ')'
    },

    setList () {
      if (!this.userIds) {
        this.option = null
        return
      }
      if (this.multiple) {
        this.option = []
        this.userIds.split(',').forEach(memberId => {
          if (memberId) {
            let op = this.options.find(op => (op.id === memberId))
            if (op) this.option.push(op)
          }
        })
      } else {
        let member = this.options.find(op => (op.id === this.userIds))
        if (member) this.option = member
      }
    },

    getListUser () {
      let groupUser = [...this.groupUser]
      let groupUserKey = 'listUser_' + [...new Set(groupUser)].sort((a, b) => (a - b)).join('_')
      if (sessionStorage.getItem(groupUserKey)) {
        this.options = JSON.parse(sessionStorage.getItem(groupUserKey))
        this.setList()
        return
      }
      let params = {
        groupId: this.groupUser
      }
      userService.getListUser(params).then((res) => {
        if (res.data.success) {
          this.options = res.data.data
          this.setList()
          sessionStorage.setItem(groupUserKey, JSON.stringify(this.options))
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>
