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
  name: 'filter-shop',

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      {
        id: 1,
        name: 'Tổng shop active'
      },
      {
        id: 2,
        name: 'Số shop mới'
      },
      {
        id: 3,
        name: 'Tổng đơn'
      },
      {
        id: 4,
        name: 'TB đơn/shop'
      },
      {
        id: 5,
        name: 'Số shop rời bỏ'
      },
      {
        id: 6,
        name: 'Số shop quay lại'
      }
    ]
  }),

  created () {
    this.option = this.options[0]
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleFilterShop', newValue)
    }
  },

  methods: {
  }
}
</script>
