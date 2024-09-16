<template>
    <multiselect
        :class="customClass"
        v-model="option"
        :options="options"
        :multiple="multiple"
        :placeholder="placeholder"
        :label="label"
        track-by="id"
        selected-label=""
        deselect-label="X"
        select-label=""
        :disabled="isDisabled"
        :limit="limit"
        :hide-selected="hideSelect"
        :close-on-select="autoClose"
        :custom-label="customLabel"
        @select="op => { $emit('select', op) }"
        @remove="op => { $emit('remove', op) }"
        @input="$emit('handleSyllabusSelected', option)"
    >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import trainingService from 'domain/services/training-service'
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'multi-select-syllabus',
  components: {
    Multiselect
  },
  props: {
    syllabusIds: {},
    autoClose: {
      default: false
    },
    hideSelect: {
      default: false
    },
    limit: {
      default: 5
    },
    multiple: {
      default: true
    },
    isDisabled: {
      default: false
    },
    placeholder: {
      default: 'Chọn nội dung'
    },
    customClass: {
      type: String,
      default: 'multiselect-primary'
    },
    label: {
      type: String,
      default: 'content'
    },
    reset: {
      default: false
    },
    activeOnly: {
      default: false
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
    option (newValue, oldValue) {
      // this.$emit('handleSyllabusSelected', newValue)
    },

    syllabusIds: function (newValue, oldValue) {
      if (this.options && this.options.length > 0) {
        this.setList()
      }
    },

    reset (newValue) {
      this.getList()
    }
  },
  methods: {
    customLabel ({code, content}) {
      return `${code} - ${content}`
    },
    select (option) {
      this.$emit('select', option)
    },
    remove (op) {
      this.$emit('remove', op)
    },

    setList () {
      if (this.syllabusIds) {
        if (this.multiple) this.option = []
        let syllabusIds = typeof this.syllabusIds === 'string' ? this.syllabusIds.split(',') : this.syllabusIds
        syllabusIds.forEach(syllabusId => {
          let syllabus = this.options.find(op => (+op.id === +syllabusId))
          if (syllabus) {
            if (this.multiple) this.option.push(syllabus)
            else this.option = syllabus
          }
        })
      } else this.option = null
    },

    async getList () {
      try {
        let params = {}
        if (this.activeOnly) params.status = 'open'
        const data = await trainingService.getAllSyllabus(params)
        if (data.data.success) {
          this.options = data.data.data
          this.setList()
        } else {
          helper.showMessage(data.data.message, 'warning')
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      }
    }
  }
}
</script>

<style scoped>
</style>
