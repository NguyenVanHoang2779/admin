<template>
  <div>
      <multiselect class="multiselect-primary"
      v-model="leaderOption"
      :options="leaderOptions"
      :multiple="true"
      :limit="limit"
      placeholder="Chọn leader"
      label="fullname"
      :custom-label="customLabel"
      track-by="fullname"
      selectedLabel="Đã chọn"
      deselectLabel="Nhấn để bỏ chọn leader"
      selectLabel="Nhấn enter để chọn"
      :close-on-select="autoClosed"
      :hide-selected="hideSelect"
      :disabled="isDisabled"
      @input="handleInput(leaderOption)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<style scoped>
  .non-blur >>> .multiselect--disabled {
    opacity: 1!important;
  }
  .non-blur >>> .multiselect__tags {
    background: white;
  }
  .non-blur >>> .multiselect__tag-icon {
    display: none
  }
  .custom-multiselect {
    max-height: 200px;
    overflow: auto;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import positionService from 'domain/services/position-service'

export default {
  name: 'multi-select-leader',

  props: {
    limitProp: {},
    leaderIds: {},
    autoClose: {},
    hideSelected: {},
    displayAll: {},
    isDisabled: {
      default: false
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    leaderOption: null,
    hideSelect: false,
    leaderOptions: [],
    autoClosed: true,
    limit: 1
  }),

  created () {
    this.getAllLeader()
    if (this.limitProp) this.limit = this.limitProp
    if (this.autoClose !== undefined && this.autoClose !== null) this.autoClosed = this.autoClose
    if (this.hideSelected !== undefined && this.hideSelected !== null) this.hideSelect = this.hideSelected
    if (this.isDisable !== undefined && this.isDisable !== null) this.disabled = this.isDisable
  },

  watch: {

    hideSelected: function (newVal, oldVal) {
      this.hideSelect = this.hideSelected
    },

    autoClose: function (newVal, oldVal) {
      this.autoClosed = this.autoClose
    },

    leaderOption: function (newValue, oldValue) {
      if (this.displayAll) {
        this.$emit('handleLeaderSelected', newValue)
      } else {
        let hasAll = (newValue && newValue.id === -1) || (newValue && newValue.length > 1 && newValue.findIndex((x) => x.id === -1) !== -1)
        if (hasAll === true) {
          this.$emit('handleLeaderSelected', this.leaderOptions)
        } else {
          this.$emit('handleLeaderSelected', newValue)
        }
      }
    },

    limitProp: function (newValue, oldValue) {
      this.limit = newValue
    },

    leaderIds: function (newVal, oldVal) {
      if (!newVal) {
        this.leaderOption = null
        return
      }
      if (this.leaderOptions && this.leaderOptions.length > 0) {
        this.setList()
      }
    }
  },

  methods: {
    setList () {
      if (this.leaderIds) {
        this.leaderOption = []
        this.leaderIds.split(',').forEach(leaderId => {
          let leader = this.leaderOptions.find(op => (('' + op.id) === leaderId))
          if (leader) {
            this.leaderOption.push(leader)
          }
        })
      }
    },

    getAllLeader: function () {
      positionService.getAllLeader()
        .then((res) => {
          if (res.data.success) {
            if (this.displayAll) {
              this.leaderOptions = res.data.data
              this.setList()
            } else {
              this.leaderOptions = [{id: -1, name: '...'}, ...res.data.data]
              this.leaderOptions = this.leaderOptions[0]
              this.setList()
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    handleInput: function (leaderOption) {
      if (this.displayAll) return
      let all = leaderOption.findIndex((x) => x.id === -1) === leaderOption.length - 1
      if (all) {
        this.leaderOption = {id: -1, name: '...'}
      } else {
        let allLeader = leaderOption.filter((x) => x.id !== -1)
        this.leaderOption = allLeader
      }
    },

    customLabel: function ({fullname, username}) {
      return `${fullname} (${username})`
    }
  }
}
</script>
