<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      placeholder="Chọn trường so sánh"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Đã chọn"
      selectLabel="Chọn"
      :allow-empty="false"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'filter-package-time',

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      {
        id: 1,
        name: 'Nội tỉnh/ liên tỉnh'
      },
      {
        id: 2,
        name: 'Ngày/ tối/ cn'
      },
      {
        id: 3,
        name: 'Giao nội thành/ huyện'
      }
    ]
  }),

  created () {
    this.option = this.options[0]
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleFilterPackageTime', newValue)
    }
  },

  methods: {
  }
}
</script>
