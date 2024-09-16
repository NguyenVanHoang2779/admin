<template>
  <multiselect
    v-model="option"
    :options="options"
    :disabled="disabled"
    :placeholder="placeholder"
    label="type"
    track-by="value"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :searchable="true"
    @select="op => { $emit('select', op) }"
    @remove="op => { $emit('remove', op) }"
    @input="op => { $emit('input', op) }"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'

// entities
import Hrteam from 'domain/entities/Hrteam'

export default {
  name: 'select-management-target',

  components: {
    Multiselect
  },

  props: {
    subGroupType: {},
    disabled: {
      type: Boolean
    },
    placeholder: {
      default: 'Chọn nhân sự phụ trách'
    }
  },

  data: () => ({
    option: null,
    options: Hrteam.TeamSubGroupType
  }),

  created () {
    if (this.subGroupType) this.setOption()
  },

  watch: {
    target (newVal, oldVal) {
      if (newVal) this.setOption()
      else this.option = null
    }
  },

  methods: {
    setOption () {
      if (this.options.length > 0 && this.subGroupType) {
        this.option = this.options.find(op => (op.value === this.subGroupType)) || null
      }
    }
  }
}
</script>
