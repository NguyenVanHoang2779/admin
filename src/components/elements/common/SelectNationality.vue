<template>
  <div>
    <multiselect class="multiselect-primary"
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="option"
      :options="options"
      :multiple="multiple"
      :placeholder="placeholder"
      label="name"
      track-by="value"
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
  </div>
</template>

<script>
// build component
import Multiselect from 'vue-multiselect'

export default {
  name: 'select-nationality',

  props: {
    nationality: {
      type: String,
      default: null
    },
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      default: 'Chọn quốc tịch'
    },
    multiple: {
      default: false,
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    option: null,
    options: [
      { value: 'Vietnam', name: 'Việt Nam' },
      { value: 'Cambodia', name: 'Campuchia' },
      { value: 'Laos', name: 'Lào' },
      { value: 'Thailand', name: 'Thái Lan' },
      { value: 'China', name: 'Trung Quốc' },
      { value: 'other', name: 'Khác' }
    ]
  }),

  watch: {
    nationality: {
      immediate: true,
      handler: function (newValue, oldValue) {
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
        let op = this.options.find(el => (el.value === this.nationality))
        this.option = op || null
        return
      }
      // multiple
      let nationality = this.status.split(',')
      this.option = this.options.filter(el => nationality.includes(el.value))
    }
  }
}
</script>

<style scoped>
  .stateTrue >>> .multiselect__tags {
    border-color: #28a745;
  }
  .stateFalse >>> .multiselect__tags {
    border-color: #d9534f;
  }
</style>
