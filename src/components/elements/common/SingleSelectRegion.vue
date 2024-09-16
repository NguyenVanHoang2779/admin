<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :disabled="isDisabled"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="X"
      selectLabel="Chọn"
      :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-region',

  components: {
    Multiselect
  },
  props: {
    isDisabled: {
      type: Boolean
    },
    placeholder: {
      default: 'Chọn khu vực'
    }
  },

  data: () => ({
    option: null,
    options: [
      {
        name: 'Miền Bắc',
        id: 10
      },
      {
        name: 'Miền Trung',
        id: 20
      },
      {
        name: 'Miền Nam',
        id: 30
      }
    ]
  }),

  created () {
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedRegion', newValue)
    }
  },

  methods: {
  }
}
</script>
