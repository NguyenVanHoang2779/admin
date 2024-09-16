<template>
  <multiselect
    :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
    v-model="option"
    :options="options"
    :multiple="multiple"
    :placeholder="placeholder"
    label="name"
    track-by="id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :hide-selected="hideSelect"
    :close-on-select="autoClose"
    @input="ops => $emit('input', ops ? (multiple ? ops.map(op => op.id).toString() : ops.id) : null)"
    @select="op => $emit('select', op)"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
// build component
import Multiselect from 'vue-multiselect'

// service
import teamConfigService from 'domain/services/team-config-service'

export default {
  name: 'select-team',

  props: {
    value: {},
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      default: 'Chọn team'
    },
    multiple: {
      default: false,
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
    option: null,
    options: []
  }),

  created () {
    this.getListOption()
  },

  watch: {
    value (newValue, oldValue) {
      this.setOption()
    }
  },

  methods: {
    setOption () {
      if (this.multiple) {
        this.option = []
        let value = ''
        if (this.value) value = this.value
        value.split(',').forEach(teamId => {
          let option = this.options.find(op => (+op.id === +teamId))
          if (option) this.option.push(option)
        })
        return
      }
      this.option = null
      this.option = this.options.find(op => (+op.id === +this.value)) || null
    },

    getListOption () {
      teamConfigService.getListTeam()
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
            this.setOption()
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
