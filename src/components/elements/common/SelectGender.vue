<template>
  <div>
    <multiselect class="multiselect-primary"
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="option"
      :options="options"
      :multiple="multiple"
      :placeholder="placeholder"
      label="desc"
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
  name: 'select-gender',

  props: {
    gender: {
      type: String,
      default: null
    },
    autoClose: {
      default: true
    },
    hideSelect: {
      default: true
    },
    placeholder: {
      default: 'Chọn giới tính'
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
      { value: 'male', desc: 'Nam' },
      { value: 'female', desc: 'Nữ' },
      { value: 'other', desc: 'Khác' }
    ]
  }),

  watch: {
    gender: {
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
        let op = this.options.find(el => (el.value === this.gender))
        this.option = op || null
        return
      }
      // multiple
      let gender = this.gender.split(',')
      this.option = this.options.filter(el => gender.includes(el.value))
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
