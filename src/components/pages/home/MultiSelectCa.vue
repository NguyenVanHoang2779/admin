<template>
  <div>
      <multiselect class="multiselect-primary"
      v-model="option"
      :options="options"
      :multiple="true"
      placeholder="Chọn ca"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      @input="handleInput(option)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-ca',

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      {
        id: -1,
        name: 'Tất cả ca làm việc'
      },
      {
        id: 1,
        name: 'Ca sáng'
      },
      {
        id: 2,
        name: 'Ca chiều'
      },
      {
        id: 3,
        name: 'Ca tối'
      }
    ]
  }),

  created () {
    this.option = this.options[0]
  },

  watch: {
    option: function (newValue, oldValue) {
      if (newValue && newValue.id === -1) {
        this.$emit('handleSelectedCa', null)
      } else {
        this.$emit('handleSelectedCa', newValue)
      }
    }
  },

  methods: {
    handleInput: function (option) {
      let all = option.findIndex((x) => x.id === -1) === option.length - 1 || option.filter((x) => x.id !== -1).length === 3

      if (all) {
        this.option = {id: -1, name: 'Tất cả ca làm việc'}
      } else {
        let options = option.filter((x) => x.id !== -1)
        this.option = options
      }
    }
  }
}
</script>
