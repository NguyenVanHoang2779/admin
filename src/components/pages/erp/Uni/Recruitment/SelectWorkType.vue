<template>
  <div>
    <multiselect
      v-model="selected"
      :options="selectedOptionsList"
      label="text"
      track-by="id"
      selectLabel=""
      deselectLabel="X"
      :multiple="false"
      @input="emitSelectedOption"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn hình thức làm việc</span>
    </multiselect>
  </div>

</template>

<style scoped lang="scss">

</style>
<script>

import Multiselect from 'vue-multiselect'

export default {
  name: 'SelectWorkType',

  components: {
    Multiselect
  },

  props: {
    workType: null,
    jobId: null
  },

  data: () => ({
    selected: null,
    options: [
      {
        id: 'fulltime',
        text: 'Toàn thời gian'
      },
      {
        id: 'parttime',
        text: 'Bán thời gian'
      }
    ],
    optionsDrivers: [
      {
        id: 'inprovince',
        text: 'Nội tỉnh'
      },
      {
        id: 'interprovince',
        text: 'Liên tỉnh'
      },
      {
        id: 'longdistance',
        text: 'Đường dài'
      }
    ]
  }),
  computed: {
    selectedOptionsList () {
      return this.jobId === 5 ? this.optionsDrivers : this.options
    }
  },

  watch: {
    workType: function (newVal, oldVal) {
      this.selected = this.selectedOptionsList.find(function (option) {
        return option.id === newVal
      })
    },
    selectedOptionsList: {
      immediate: true,
      handler (newOptions) {
        if (this.selected && !newOptions.some(option => option.id === this.selected.id)) {
          this.selected = null // Xóa option đã chọn
        }
      }
    }
  },

  methods: {
    emitSelectedOption (selectedOption) {
      this.$emit('selected-option-changed', selectedOption)
    }
  }
}
</script>
