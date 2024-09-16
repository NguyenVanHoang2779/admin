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
  name: 'select-administrative-province',

  props: {
    provinceCode: {
      default: null
    },
    autoClose: {
      default: true
    },
    hideSelect: {
      default: false
    },
    placeholder: {
      default: 'Chọn tỉnh hành chính'
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

  data: _ => ({
    option: null,
    options: []
  }),

  created () {
    this.getAdministrativeProvinces()
  },

  watch: {
    provinceCode (newVal, oldVal) {
      if (newVal) {
        this.setList()
      } else this.option = null
    }
  },

  methods: {
    setList () {
      if (this.provinceCode && this.multiple) {
        this.option = []
        this.provinceCode.split(',').forEach(code => {
          let option = this.options.find(op => (op.code === code))
          if (option) this.option.push(option)
        })
        return
      }
      if (this.provinceCode) {
        this.option = null
        let option = this.options.find(op => (op.code === this.provinceCode))
        if (option) this.option = option
      }
    },

    getAdministrativeProvinces () {
      if (sessionStorage.getItem('administrativeProvinces')) {
        this.options = JSON.parse(sessionStorage.getItem('administrativeProvinces'))
        this.setList()
        return
      }
      commonService.getAdministrativeArea()
        .then(res => {
          if (res.data.success) {
            this.options = res.data.data
            this.setList()
            sessionStorage.setItem('administrativeProvinces', JSON.stringify(this.options))
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
