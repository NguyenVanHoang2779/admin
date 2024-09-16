<template>
  <div class="mb-4">
    <multiselect
        v-model="option"
        :options="options"
        :disabled="isDisabled"
        placeholder="Chọn template"
        label="name"
        track-by="id"
        selectedLabel="Đã chọn"
        deselectLabel="Bỏ chọn"
        selectLabel="Chọn"
        :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn template</span>
    </multiselect>
  </div>
</template>

<style scoped>
  .non-blur >>> .multiselect--disabled {
    opacity: 1!important;
  }
  .non-blur >>> .multiselect__tags {
    background: white;
  }
  .non-blur >>> .multiselect__tag-icon {
    display: none
  }
  .custom-multiselect {
    max-height: 200px;
    overflow: auto;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-template',

  components: {
    Multiselect
  },

  props: {
    templates: null,
    templateType: null,
    isDisabled: {
      type: Boolean
    }
  },
  data: () => ({
    option: null,
    options: [],
    storage: null
  }),

  created () {
  },

  watch: {
    option: function (newOption, oldOption) {
      this.$emit('handleSelectedTemplate', newOption)
    },

    templateType: function (newType, oldType) {
      if (newType) {
        this.setSelectedOption(newType)
      }
    },

    templates: function (newVal, oldVal) {
      this.options = newVal.filter((option) => {
        return option.status === 'active'
      })
    }
  },

  methods: {
    setSelectedOption (newType) {
      this.option = null
      this.options = this.templates.filter((option) => {
        return option.type === newType && option.status === 'active'
      })
    }
  }
}
</script>
