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
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn ca làm việc</span>
    </multiselect>
  </div>

</template>

<style scoped lang="scss">

</style>
<script>

import Multiselect from 'vue-multiselect'

export default {
  name: 'SelectWorkShift',

  components: {
    Multiselect
  },

  props: {
    workType: {
      type: String,
      default: null
    },
    workShift: null
  },

  data: () => ({
    options: {
      fulltime: [
        {
          id: 'day',
          text: 'Ca ngày'
        },
        {
          id: 'night',
          text: 'Ca đêm'
        },
        {
          id: 'all',
          text: 'Cả 2 ca'
        }

      ],
      parttime: [
        {
          id: 'morning ',
          text: 'Ca sáng'
        },
        {
          id: 'afternoon',
          text: 'Ca chiều'
        },
        {
          id: 'befornight',
          text: 'Ca tối'
        },
        {
          id: 'sunday',
          text: 'Chuyên chủ nhật'
        }
      ]
    }
  }),

  computed: {
    selectedOptionsList () {
      return this.workType && this.options[this.workType] ? this.options[this.workType] : this.options['fulltime']
    },
    selected: {
      get () {
        return this.selectedOptionsList ? this.selectedOptionsList.find(option => option.id === this.workShift) : null
      },
      set (newOption) {
        this.$emit('selected-option-changed', newOption)
      }
    }
  },

  watch: {
  },

  methods: {
    // emitSelectedOption (selectedOption) {
    //   this.$emit('selected-option-changed', selectedOption)
    // }
  }
}
</script>
