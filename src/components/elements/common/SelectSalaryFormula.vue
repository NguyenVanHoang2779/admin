<template>
  <multiselect
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
</template>

<script>
// build component
import Multiselect from 'vue-multiselect'

// service
import profileService from 'domain/services/profile-service'

export default {
  name: 'select-formula',

  props: {
    formula: {
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
      default: 'Chọn công thức lương'
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
    options: []
  }),

  watch: {
    formula: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (!newVal) {
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
        let op = this.options.find(el => (el.value === this.formula))
        this.option = op || null
        return
      }
      // multiple
      let formula = this.status.split(',')
      this.option = this.options.filter(el => formula.includes(el.value))
    },

    get () {
      profileService.getListFormula()
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
            this.set()
            // sessionStorage.setItem('allGroup', JSON.stringify(this.groupOptions))
          }
        }).catch(e => {
          console.log(e)
        })
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
