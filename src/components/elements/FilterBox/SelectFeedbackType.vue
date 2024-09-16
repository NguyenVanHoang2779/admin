<template>
  <multiselect
    v-model="selectedFeedbackType"
    :options="feedbackType"
    :multiple="multiple"
    :disabled="disabled"
    :placeholder="placeholder"
    track-by="id"
    label="name"
    selectLabel=""
    selectedLabel=""
    deselectLabel="x"
    @select="onSelect"
  >
    <template slot="placeholder">
      <span class="placeholder">{{placeholder}}</span>
    </template>
  </multiselect>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'SelectFeedbackType',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Chọn feedback type'
    },
    feedbackTypeId: {
      type: [ String, Number, Array ],
      default: ''
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    feedbackType: [],
    selectedFeedbackType: []
  }),
  watch: {
    feedbackTypeId: {
      handler: 'getOptions',
      immediate: true
    }
  },
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'feedback-type/getListFeedbackType').then(response => {
        if (response.data.success) {
          this.feedbackType = response.data.data.options.feedback_types
          this.selectedFeedbackType = this.feedbackType.filter(
            (el) => (parseInt(el.id) === parseInt(this.feedbackTypeId))
          )
        }
      }).catch(error => {
        if (error) {
          console.log(error)
        }
      })
    },
    onSelect: function (selectedOptions, id) {
      console.log(selectedOptions)
      this.selectedFeedbackType = selectedOptions.id
      this.$emit('selected', this.selectedFeedbackType)
    }
  }
}
</script>

<style scoped>

</style>
