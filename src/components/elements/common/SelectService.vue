<template>
  <b-row>
    <b-col sm="12">
      <multiselect
        v-model="asyncSelected"
        label="name"
        track-by="service_id"
        :placeholder="placeholder"
        :options="customOptions"
        :multiple="multiple"
        :searchable="true"
        :internal-search="true"
        :clear-on-select="true"
        :close-on-select="true"
        @open="handleOpen"
        @close="handleClose">
        </multiselect>
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from 'vue-multiselect'
// import * as _ from 'lodash'

export default {
  name: 'SelectService',
  components: {
    Multiselect
  },
  data: () => ({
    customOptions: []
  }),
  created () {
    if (this.selected) {
      this.asyncSelected = this.selected
    }
    this.$emit('onChange', this.asyncSelected.map(a => a.service_id))
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
      default: () => []
    },
    showCurrentSelectedInOptionList: {
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
        return this.selected
      },
      set: function (selected) {
        this.$emit('onChange', selected.map(a => a.service_id))
      }
    }
  },
  methods: {
    handleOpen () {
      if (this.asyncSelected && this.showCurrentSelectedInOptionList) {
        this.customOptions = this.asyncSelected.concat(this.options)
      } else {
        this.customOptions = this.options
      }
    },
    handleClose () {
      this.customOptions = this.options
    }
  }
}
</script>
