<template>
  <div>
    <multiselect
      class="multiselect-primary"
      v-model="option"
      :options="options"
      placeholder="Chọn điểm/ đơn"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Đã chọn"
      selectLabel="Chọn"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-don-diem',

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      {
        id: 1,
        name: 'Theo đơn'
      },
      {
        id: 2,
        name: 'Theo điểm'
      }
    ]
  }),

  created () {
    this.option = this.options[0]
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedDonDiem', newValue)
    }
  },

  methods: {
  }
}
</script>
