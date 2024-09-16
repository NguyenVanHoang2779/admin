<template>
  <multiselect
    :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
    v-model="option"
    :options="options"
    :multiple="multiple"
    :placeholder="placeholder"
    label="tag_name"
    track-by="tag_id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :hide-selected="hideSelect"
    :close-on-select="autoClose"
    @input="ops => $emit('input', ops ? (multiple ? ops.map(op => op.tag_id).toString() : ops.id) : null)"
    @select="op => $emit('select', op)"
    @remove="op => $emit('remove', op)"
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
  name: 'select-tech-stack',

  props: {
    department_id: {},
    position_id: {},
    value: {},
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      default: 'Chọn techstack'
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
    this.getListOption(this.department_id, this.position_id)
  },

  watch: {
    value (newValue, oldValue) {
      this.setOption()
    },

    department_id () {
      this.getListOption(this.department_id, this.position_id)
    },

    position_id () {
      this.getListOption(this.department_id, this.position_id)
    }
  },

  methods: {
    setOption () {
      if (this.multiple) {
        this.option = []
        let value = ''
        if (this.value) value = this.value
        value.split(',').forEach(tagId => {
          let option = this.options.find(op => (+op.tag_id === +tagId))
          if (option) this.option.push(option)
        })
        return
      }
      this.option = null
      this.option = this.options.find(op => (+op.tag_id === +this.value)) || null
    },

    getListOption (departmentId, positionIds) {
      if (positionIds) {
        if (!Array.isArray(positionIds)) positionIds = [positionIds]
      } else positionIds = []

      teamConfigService.getListSkill({department_id: departmentId, position_ids: positionIds})
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
