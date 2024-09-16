<template>
  <multiselect
    :class="customClass"
    v-model="option"
    :options="options"
    :multiple="false"
    :placeholder="placeholder"
    label="name"
    track-by="id"
    selected-label=""
    deselect-label="X"
    select-label="Chọn"
    :disabled="isDisabled"
    :limit="limitProp"
    :hide-selected="hideSelected"
    :close-on-select="autoClose"
    @input="val => { $emit('input', val) }"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
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

export default {
  name: 'SelectStatusSyllabus',

  components: {
    Multiselect
  },

  props: {
    isSelectAll: {
      default: 1
    },
    autoClose: {
      default: false
    },
    hideSelected: {
      default: false
    },
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    status: {
      default: null
    },
    placeholder: {
      default: 'Chọn trạng thái'
    },
    customClass: {
      default: 'multiselect-primary'
    }
  },

  data: () => ({
    option: null,
    options: [
      { id: 'coming_up', name: 'Sắp diễn ra' },
      { id: 'happening', name: 'Đang diễn ra' },
      { id: 'finished', name: 'Kết thúc' }
    ]
  })
}
</script>
