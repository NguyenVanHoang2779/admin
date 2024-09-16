<template>
    <multiselect
        v-model="option"
        :options="options"
        :placeholder="placeholder"
        label="name"
        track-by="name"
        selectedLabel="Đã chọn"
        deselectLabel="Bỏ chọn"
        selectLabel="Chọn"
        :searchable="true"
        @select="op => { $emit('select', op) }"
        @remove="op => { $emit('remove', op) }"
    >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import TrainingQuestionsService from '../../../../domain/services/training-questions-service'

export default {
  name: 'SingleSelectCategory',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      type: String,
      default: 'Danh mục'
    },
    categoryId: {
      default: null
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getCategories()
  },

  watch: {
    categoryId (newValue, oldValue) {
      if (!newValue) {
        this.option = null
        return
      }
      this.setSelectedOption()
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options && this.options.length && this.provinceId) {
        this.option = this.options.find(option => (parseInt(option.id) === parseInt(this.categoryId))) || null
      }
    },

    getCategories () {
      TrainingQuestionsService.getCategories()
        .then((response) => {
          if (response.data.success) {
            this.options = response.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })

      this.setSelectedOption()
    }
  }
}
</script>

<style scoped>

</style>
