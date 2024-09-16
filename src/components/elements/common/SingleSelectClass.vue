<template>
    <multiselect
            :class="customClass"
            v-model="option"
            :options="options"
            placeholder="Chọn lớp"
            label="name"
            track-by="name"
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :searchable="true"
            :disabled="isDisabled"
    >
        <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        <span class="placeholder" slot="placeholder">Chọn lớp</span>
    </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import trainingService from 'domain/services/training-service'

export default {
  name: 'single-select-class',

  components: {
    Multiselect
  },
  props: {
    classId: null,
    isDisabled: {
      type: Boolean
    },
    customClass: {
      type: String,
      default: 'multiselect-primary'
    }
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getList()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelected', newValue)
    },

    classId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    }
  },

  methods: {
    getList: function () {
      trainingService.getListClass()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.classId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.classId)
        })
      }
    }
  }
}
</script>
