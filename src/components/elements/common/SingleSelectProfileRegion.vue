<template>
  <div>
    <multiselect
      class="multiselect-primary"
      :class="selectClass"
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
      :multiple="multiple"
      :disabled="isDisabled"
      @input="handleInput"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    </multiselect>
  </div>
</template>
<style scoped>
/deep/ .multiselect-primary .multiselect__tag {
  margin: 0 0.375rem 0.375rem 0 !important;
  background-color: rgba(24, 28, 33, 0.1) !important;
  color: #4E5155 !important;
}
</style>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-profile-region',

  components: {
    Multiselect
  },

  props: {
    selectClass: '',
    placeholder: {
      type: String,
      default: 'Chọn miền'
    },
    region: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    all: {
      type: Boolean,
      default: false
    },
    reset: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    option: null,
    options: [
      {
        name: 'TP Hà Nội',
        id: 'HN'
      },
      {
        name: 'Miền Bắc',
        id: 'MB'
      },
      {
        name: 'Miền Trung',
        id: 'MT'
      },
      {
        name: 'TP Hồ Chí Minh',
        id: 'HCM'
      },
      {
        name: 'Miền Nam',
        id: 'MN'
      }
    ]
  }),

  created () {
    if (this.all) this.options.unshift({id: -1, name: 'Toàn quốc'})
    this.setSelectedOption()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedRegion', newValue)
    },

    region: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else {
        this.option = null
      }
    },

    reset () {
      this.option = null
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.region) {
        if (this.multiple) {
          this.option = []
          let listRegion = this.region.split(',')
          let hasAll = true
          for (const region of ['MN', 'MB', 'MT', 'HN', 'HCM']) {
            if (!listRegion.includes(region)) hasAll = false
          }
          if (hasAll) {
            this.option.push({id: -1, name: 'Toàn quốc'})
            return
          }
          listRegion.forEach(reg => {
            let op = this.options.find(o => (o.id === reg))
            if (op) this.option.push(op)
          })
        } else {
          let op = this.options.find((option) => { return option.id === this.region })
          this.option = op
        }
      }
    },

    handleInput (op) {
      if (!this.all) return
      let indexAllElement = op.findIndex((x) => x.id === -1)
      let hasAll = op && indexAllElement >= 0 && (indexAllElement === op.length - 1)
      if (hasAll) {
        this.option = [{id: -1, name: 'Toàn quốc'}]
      } else {
        let opt = op.filter((x) => x.id !== -1)
        this.option = opt
      }
    }
  }
}
</script>
