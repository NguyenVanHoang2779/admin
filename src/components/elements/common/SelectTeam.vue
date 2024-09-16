<template>
  <multiselect
    :class="customClass"
    v-model="option"
    :options="options"
    :multiple="multiple"
    :placeholder="placeholder"
    :disabled="disabled"
    label="name"
    track-by="id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :hide-selected="hideSelect"
    :close-on-select="autoClose"
    @input="val => { $emit('change', val) }"
    @select="val => { $emit('select', val) }"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
// build component
import Multiselect from 'vue-multiselect'
// service
import staffShiftService from 'domain/services/staff-shift-service'

export default {
  name: 'select-team',

  props: {
    autoClose: {
      default: true
    },
    inTeam: {
      default: true
    },
    hideSelect: {
      default: false
    },
    disabled: {
      default: false
    },
    placeholder: {
      default: 'Chọn nhóm chốt ca'
    },
    multiple: {
      default: false,
      type: Boolean
    },
    customClass: {
      default: 'multiselect-ghtk multiselect-no-horizontal',
      type: String
    },
    team: {
      type: String,
      default: null
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    let filter = {}
    if (this.inTeam) filter.in_team = 1
    this.get(filter)
  },

  watch: {
    team: {
      immediate: true,
      handler: function (newValue, oldValue) {
        if (!newValue) {
          this.option = null
          return
        }
        this.set()
      }
    }
  },

  methods: {
    set () {
      if (!this.multiple) {
        let op = this.options.find(el => (el.id === this.team))
        this.option = op || null
        return
      }
      // multiple
      let teams = this.team.split(',')
      this.option = this.options.filter(el => teams.includes(el.id))
    },

    get (filter) {
      staffShiftService.getTeamOption(filter)
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
            this.set()
          }
        }).catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
</style>
