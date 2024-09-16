<template>
  <tr>
    <td>
      <SelectUser v-model="users" multiple :placeholder="placeholder" @input="checkMemberAdded"/>
    </td>
    <td>
      <input type="date" v-model="from" class="form-control" />
    </td>
    <td>
      <b-btn variant="outline-ghtk" class="w-100" @click="addMember" :disabled="loading">
        <span v-show="!loading">{{ placeholder }}</span>
        <i v-show="loading" class="fas fa-spinner fa-pulse"></i>
      </b-btn>
    </td>
  </tr>
</template>

<script>
import SelectUser from 'components/elements/common/SelectUser'

// helper
import helper from 'infrastructures/helpers/common-helpers'

const today = new Date().toISOString().split('T')[0]

export default {
  name: 'add-member-form',

  components: {
    SelectUser
  },

  props: {
    placeholder: {
      default: 'Thêm thành viên'
    },
    loading: {
      dafault: false,
      type: Boolean
    },
    memberAdded: {
      type: Array,
      default: _ => ([])
    }
  },

  data: _ => ({
    users: [],
    from: today
  }),

  methods: {
    checkMemberAdded () {
      for (let idx in this.users) {
        let mem = this.users[idx]
        if (this.memberAdded.includes(+mem.id)) {
          helper.showMessage('Thành viên này đã đươc thêm vào team')
          this.users.pop()
        }
      }
    },

    addMember () {
      this.$emit('addMember', this.users, this.from)
    },

    reset () {
      this.users = []
      this.from = today
    }
  }
}
</script>
