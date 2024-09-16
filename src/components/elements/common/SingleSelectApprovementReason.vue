<template>
  <select class="form-control custom-select" @change="onChange">
    <option value="">Lý do duyệt</option>
    <option v-for="(option, idx) in options" :key="idx" :value="option.value" :selected="selectedOption(option)">
      {{ option.text }}
    </option>
  </select>
</template>

<script>

export default {
  name: 'single-select-relation',

  components: {
  },

  props: ['value'],
  data: () => ({
    selected: null,
    options: [
      {
        text: 'Đủ thông tin & dấu mộc đỏ + Đúng NBL + NBL Đồng ý bảo lãnh',
        value: 'approved_license'
      },
      {
        text: 'Đủ thông tin & Có ảnh NBL và CCCD + Đúng NBL + NBL Đồng ý bảo lãnh',
        value: 'approved_image'
      }
    ]
  }),

  methods: {
    selectedOption (option) {
      if (this.value) {
        return option.value === this.value
      }
    },

    onChange (event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
