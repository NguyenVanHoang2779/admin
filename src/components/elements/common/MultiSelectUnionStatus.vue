<template>
  <multiselect
    :class="customClass"
    v-model="option"
    :options="options"
    :multiple="true"
    :placeholder="placeholder"
    label="name"
    track-by="id"
    selected-label=""
    deselect-label="X"
    select-label=""
    :disabled="isDisabled"
    :limit="limitProp"
    :hide-selected="hideSelected"
    :close-on-select="autoClose"
    @input="handleInput"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'MultiSelectUnionStatus',
  components: {
    Multiselect
  },
  props: {
    autoClose: {
      default: true
    },
    hideSelected: {
      default: true
    },
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    placeholder: {
      default: 'Trạng thái'
    },
    customClass: {
      default: 'multiselect-ghtk'
    }
  },
  data: () => ({
    option: null,
    options: [
      { id: 1, name: 'Chờ HR duyệt' },
      { id: 2, name: 'Chờ C&B duyệt' },
      { id: 3, name: 'Đã duyệt' },
      { id: 4, name: 'Từ chối' }
    ]
  }),
  methods: {
    handleInput (options = null) {
      if (options) {
        this.option = options
      }
      this.$emit('onChangeStatusSelected', this.option)
    }
  }
}
</script>
