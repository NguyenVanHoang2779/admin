<template>
  <multiselect
    :class="customClass"
    v-model="option"
    :options="options"
    :multiple="true"
    :placeholder="placeholder"
    label="name"
    track-by="id"
    selected-label=""
    deselect-label="X"
    select-label="Chọn"
    :disabled="isDisabled"
    :limit="limitProp"
    :hide-selected="hideSelected"
    :close-on-select="autoClose"
    @input="val => { $emit('input', val) }"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
  </multiselect>
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
  name: 'multi-select-region',

  components: {
    Multiselect
  },

  props: {
    isSelectAll: {
      default: 1
    },
    autoClose: {
      default: false
    },
    hideSelected: {
      default: false
    },
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    regions: {
      default: null
    },
    placeholder: {
      default: 'Chọn miền'
    },
    customClass: {
      default: 'multiselect-primary'
    }
  },

  data: () => ({
    option: null,
    options: [
      { id: 'HN', name: 'Hà Nội' },
      { id: 'HCM', name: 'Thành Phố HCM' },
      { id: 'MB', name: 'Miền Bắc' },
      { id: 'MT', name: 'Miền Trung' },
      { id: 'MN', name: 'Miền Nam' }
    ]
  }),

  created () {
    this.setSelectedOption()
  },

  watch: {
    regions (newValue, oldValue) {
      this.setSelectedOption()
    },

    option (newValue, oldValue) {
      this.$emit('handleSelectedRegion', newValue)
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.regions) {
        this.option = []
        this.regions.split(',').forEach(re => {
          let op = this.options.find(o => ('' + o.id === '' + re))
          if (op) this.option.push(op)
        })
      } else this.option = null
    }
  }
}
</script>
