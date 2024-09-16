<template>
  <div>
    <multiselect
      class="multiselect-primary"
      v-model="option"
      :options="options"
      placeholder="Chọn đơn mới/ đơn cũ"
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
  name: 'single-select-package-status-type',

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      {
        id: -1,
        name: 'Đơn mới & đơn cũ'
      },
      {
        id: 1,
        name: 'Đơn mới'
      },
      {
        id: 0,
        name: 'Đơn cũ'
      }
    ]
  }),

  created () {
    this.option = this.options[0]
  },

  watch: {
    option: function (newValue, oldValue) {
      if (newValue && newValue.id === -1) {
        this.$emit('handleSelectedPackageStatusType', this.options.filter((x) => x.id !== -1))
      } else {
        this.$emit('handleSelectedPackageStatusType', [newValue])
      }
    }
  },

  methods: {
  }
}
</script>
