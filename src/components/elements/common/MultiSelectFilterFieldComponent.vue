<template>
  <multiselect
    v-model="selected"
    track-by="id"
    label="text"
    :placeholder="placeholder || ''"
    :options="options"
    :multiple="multiple"
    :searchable="false"
    :loading="loading"
    selectLabel=""
    selectedLabel=""
    deselectLabel="x"
    :internal-search="false"
    :clear-on-select="true"
    :close-on-select="true"
    :hide-selected="false"
    :disabled="!!disabled"
  />
</template>
<script>
import Multiselect from 'vue-multiselect'
import manageListBagBoxService from './../../../domain/services/manage-list-bag-box-service'
import commonHelper from './../../../infrastructures/helpers/common-helpers'

export default {
  name: 'MultiSelectFilterFieldComponent',
  components: {
    Multiselect
  },
  props: {
    value: [Array, Number, String],
    placeholder: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    readonly: Boolean,
    multiple: {
      type: Boolean,
      default: true
    },
    field: {
      type: String,
      required: true
    }
  },
  computed: {
    selected: {
      get: function () {
        if (this.multiple) {
          if (!Array.isArray(this.value) || !this.value.length) {
            return []
          }
          return this.options.filter((row) => this.value.indexOf(row.id) !== -1)
        }
        return this.options.filter((row) => this.value === row.id)
      },
      set: function (newValue) {
        if (this.multiple) {
          this.$emit('input', newValue ? newValue.map(itemSelected => itemSelected.id) : [])
        } else {
          this.$emit('input', newValue ? newValue.id : null)
        }
      }
    }
  },
  data: () => ({
    loading: true,
    options: []
  }),
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      this.options = []
      this.loading = true
      try {
        const data = (await manageListBagBoxService.getFilterConfigs())
        if (data && data[this.field]) {
          Object.keys(data[this.field]).forEach((key) => {
            this.options.push({
              id: key,
              text: data[this.field][key]
            })
          })
        }
      } catch (reason) {
        commonHelper.showMessage(reason.toString(), 'error')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
