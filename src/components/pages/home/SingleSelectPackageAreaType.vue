<template>
  <div>
    <multiselect
      class="multiselect-primary"
      v-model="option"
      :options="options"
      placeholder="Chọn đơn nội tỉnh/ liên tỉnh"
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
  name: 'single-select-package-area-type',

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      {
        id: -1,
        name: 'Đơn nội tỉnh & liên tỉnh'
      },
      {
        id: 0,
        name: 'Đơn nội tỉnh'
      },
      {
        id: 1,
        name: 'Đơn liên tỉnh'
      }
    ]
  }),

  created () {
    this.option = this.options[0]
  },

  watch: {
    option: function (newValue, oldValue) {
      if (newValue && newValue.id === -1) {
        this.$emit('handleSelectedPackageAreaType', this.options.filter((x) => x.id !== -1))
      } else {
        this.$emit('handleSelectedPackageAreaType', [newValue])
      }
    }
  },

  methods: {
  }
}
</script>
