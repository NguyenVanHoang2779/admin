<template>
  <multiselect
          v-model="selectedTypeChart"
          :options="types"
          :multiple="multiple"
          :placeholder="placeholder"
          track-by="name"
          label="name"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          @select="onSelect"
          @remove="onRemove"
  />
</template>

<script>

import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-type-chart',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn kiểu hiển thị'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    types: [
      {'code': '1', 'name': 'Hiển thị theo giờ'},
      {'code': '2', 'name': 'Hiển thị theo ngày'},
      {'code': '3', 'name': 'Hiển thị theo tuần'},
      {'code': '4', 'name': 'Hiển thị theo tháng'}
    ],
    selectedTypeChart: []
  }),
  methods: {
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedTypeChart.length > 0) {
          for (let i = 0; i < this.selectedTypeChart.length; i++) {
            data.push(this.selectedTypeChart[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedTypeChart = selectedOptions.code
        this.$emit('selected', this.selectedTypeChart)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedTypeChart.length; i++) {
          if (this.selectedTypeChart[i].code !== removeOptions.code) {
            data.push(this.selectedTypeChart[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedTypeChart = this.multiple ? [] : ''
      this.$emit('selected', this.selectedTypeChart)
    }
  }
}
</script>

<style scoped>

</style>
