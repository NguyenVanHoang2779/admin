<template>
    <multiselect
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :custom-label="customLabel"
      track-by="username"
      :limit="limit"
      selectedLabel=""
      deselectLabel="X"
      selectLabel="Chọn"
      :searchable="true"
      :disabled="disabled"
      :multiple="multiple"
      :hide-selected="multiple"
      :close-on-select="!multiple"
      @select="op => {$emit('select', op)}"
      @remove="op => {$emit('remove', op)}"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import hrteamService from 'domain/services/hrteam-service'

export default {
  name: 'select-hr-member',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      default: 'Chọn nhân sự'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    memberIds: {
      type: String,
      default: null
    },
    limit: {
      type: Number,
      default: 100
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },

  watch: {
    memberIds: function (newVal, oldVal) {
      if (!this.options || this.options.length === 0) {
        this.option = null
        return
      }
      if (!this.memberIds) this.option = null
      this.setList()
    },

    option: function (newValue, oldValue) {
      this.$emit('handleSelectedHrMember', newValue)
    }
  },

  methods: {
    customLabel ({fullname, username, stationname}) {
      return fullname + ' (' + username + ' - ' + stationname + ')'
    },

    setList () {
      if (this.memberIds) {
        if (this.multiple) {
          this.option = []
          this.memberIds.split(',').forEach(memberId => {
            if (memberId) {
              let op = this.options.find(op => (op.id === memberId))
              if (op) this.option.push(op)
            }
          })
          return
        }

        let member = this.options.find(op => (op.id === this.memberIds))
        if (member) this.option = member
      }
    },

    getList: function () {
      if (sessionStorage.getItem('allHrMember')) {
        this.options = JSON.parse(sessionStorage.getItem('allHrMember'))
        this.setList()
        return
      }
      hrteamService.getAllHrMember()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setList()
            sessionStorage.setItem('allHrMember', JSON.stringify(this.options))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }

  }
}
</script>
