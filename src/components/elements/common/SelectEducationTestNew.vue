<template>
  <multiselect
    v-model="option"
    :options="options"
    :multiple="multiple"
    :placeholder="placeholder"
    label="code"
    track-by="id"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :hide-selected="hideSelect"
    :close-on-select="autoClose"
    :disabled="disable"
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
import trainingQuestionsService from '../../../domain/services/training-questions-service'

export default {
  name: 'select-education-test-new',

  props: {
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      type: String,
      default: 'Bài kiểm tra'
    },
    multiple: {
      default: false,
      type: Boolean
    },
    test: {
      type: String,
      default: null
    },
    // category: {
    //   type: String,
    //   default: null
    // },
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
    // let filter = {}
    this.get()
  },

  watch: {
    test: {
      immediate: true,
      handler: function (newValue) {
        if (!newValue) {
          this.option = null
          return
        }
        this.set()
      }
    },
    category: function (newValue, oldValue) {
      this.get()
    }
  },

  methods: {
    set () {
      if (!this.multiple) {
        let op = this.options.find(el => (+el.id === +this.test))
        this.option = op || null
        return
      }
      // multiple
      let categories = this.test.split(',')
      this.option = this.options.filter(el => categories.includes(el.id))
    },

    get () {
      // let filter = {
      //   category_id: this.category
      // }
      trainingQuestionsService.getListTest()
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
