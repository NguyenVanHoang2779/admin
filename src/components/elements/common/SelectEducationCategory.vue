<template>
  <multiselect
    v-model="option"
    :options="options"
    :multiple="multiple"
    :placeholder="placeholder"
    label="name"
    :disabled="disable"
    track-by="id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :hide-selected="hideSelect"
    :close-on-select="autoClose"
    @input="val => { $emit('change', val) }"
    @select="val => { $emit('select', val) }"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
// build component
import Multiselect from 'vue-multiselect'
// service
import trainingService from 'domain/services/training-service'

export default {
  name: 'select-education-category',

  props: {
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      type: String,
      default: 'Danh mục'
    },
    multiple: {
      default: false,
      type: Boolean
    },
    category: {
      type: String,
      default: null
    },
    disable: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    let filter = {}
    this.get(filter)
  },

  watch: {
    category: {
      immediate: true,
      handler: function (newValue) {
        if (!newValue) {
          this.option = null
          return
        }
        this.set()
      }
    }
  },

  methods: {
    set () {
      if (!this.multiple) {
        let op = this.options.find(el => (el.id === this.category))
        this.option = op || null
        return
      }
      // multiple
      let categories = this.category && this.category.split(',')
      this.option = this.options.filter(el => categories.includes(el.id))
    },

    get (filter) {
      trainingService.getTrainingCategories(filter)
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
            this.set()
          }
        }).catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
</style>
