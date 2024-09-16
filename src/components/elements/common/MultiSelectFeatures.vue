<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="alias"
        track-by="value"
        :placeholder="placeholder"
        :options="options"
        :multiple="multiple"
        :searchable="true"
        :internal-search="true"
        :clear-on-select="true"
        :close-on-select="true"
        :disabled="disabled"
      />
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'MultiSelectFeatures',
  components: {
    Multiselect
  },
  created () {
    if (this.selected) {
      this.asyncSelected = this.selected.map((value) => ({
        value: value,
        alias: this.master[value]
      }))
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => ([])
    },
    master: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    asyncSelected: {
      get: function () {
        if (!Array.isArray(this.selected)) {
          return []
        }
        return this.selected.map((value) => ({
          value: value,
          alias: this.master[value]
        }))
      },
      set: function (selected) {
        this.$emit('onChange', selected.map(a => a.value))
      }
    }
  }
}
</script>
