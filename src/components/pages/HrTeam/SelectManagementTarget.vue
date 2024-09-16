<template>
  <multiselect
    v-model="option"
    :options="options"
    :disabled="disabled"
    :placeholder="placeholder"
    label="desc"
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
    target: {},
    disabled: {
      type: Boolean
    },
    placeholder: {
      default: 'Chọn đối tượng quản lý'
    }
  },

  data: () => ({
    option: null,
    options: Hrteam.ManagementTarget
  }),

  created () {
    if (this.target) this.setOption()
  },

  watch: {
    target (newVal, oldVal) {
      if (newVal) this.setOption()
      else this.option = null
    }
  },

  methods: {
    setOption () {
      if (this.options.length > 0 && this.target) {
        this.option = this.options.find(op => (op.value === this.target)) || null
      }
    }
  }
}
</script>
