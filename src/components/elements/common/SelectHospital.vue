<template>
  <multiselect
    :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
    v-model="option"
    :options="options"
    :multiple="multiple"
    :placeholder="placeholder"
    label="name"
    track-by="code"
    selectedLabel=""
    deselectLabel="X"
    selectLabel=""
    :hide-selected="hideSelect"
    :close-on-select="autoClose"
    @select="val => {$emit('select', val)}"
    @input="val => {$emit('input', val)}"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
  </multiselect>
</template>

<script>
// build component
import Multiselect from 'vue-multiselect'

// service
import commonService from 'domain/services/common-service'

export default {
  name: 'select-hospital',

  props: {
    provinceCode: {
      default: null
    },
    hospitalCode: {
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
      default: 'Chọn bệnh viện'
    },
    multiple: {
      default: false,
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    },
    preloadAll: {
      default: false
    }
  },

  components: {
    Multiselect
  },

  data: _ => ({
    option: null,
    options: []
  }),

  created () {
    if (this.preloadAll) this.getHospital()
  },

  watch: {
    provinceCode: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal) this.getHospitals(newVal)
      }
    },
    hospitalCode (newVal, oldVal) {
      if (newVal && this.options && this.options.length) this.setList()
      else this.option = null
    }
  },

  methods: {
    setList () {
      if (this.hospitalCode && this.multiple) {
        this.option = []
        this.hospitalCode.split(',').forEach(code => {
          let option = this.options.find(op => (op.code === code))
          if (option) this.option.push(option)
        })
        return
      }
      if (this.hospitalCode) {
        this.option = null
        let option = this.options.find(op => (op.code === this.hospitalCode))
        if (option) this.option = option
      }
    },

    getHospitals (provinceCode) {
      commonService.getHospitals({ province_code: provinceCode })
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
            this.setList()
          }
        })
        .catch(e => {
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
