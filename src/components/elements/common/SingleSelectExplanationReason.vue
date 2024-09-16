<template>
  <div>
    <multiselect
      v-model="option"
      :options="options"
      placeholder="Chọn lý do"
      label="content"
      track-by="content"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :disabled="isDisabled"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn lý do</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import trainingService from 'domain/services/training-service'

export default {
  name: 'single-select-explanation-reason',

  components: {
    Multiselect
  },
  props: {
    reasonId: null,
    isDisabled: {
      type: Boolean
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

    reasonId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    }
  },

  methods: {
    getList: function () {
      let cacheKey = `listExplanationReason`
      if (sessionStorage.getItem(cacheKey)) {
        this.options = JSON.parse(sessionStorage.getItem(cacheKey))
        this.setSelectedOption()
        return
      }
      trainingService.getListExplanationReason()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectedOption()
            sessionStorage.setItem(cacheKey, JSON.stringify(this.options))
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.reasonId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.reasonId)
        })
      }
    }
  }
}
</script>
