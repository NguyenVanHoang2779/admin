<template>
  <div>
    <multiselect
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :multiple="multiple"
      :disabled="disabled"
      label="name"
      track-by="value"
      :close-on-select="true"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
    >
    <span class="placeholder" slot="placeholder">{{placeholder}}</span>
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
</template>

<script>

import WebStorage from 'infrastructures/web-storage'
import commonService from 'domain/services/common-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'select-ethnic',

  components: {
    Multiselect
  },

  props: {
    ethnicValue: {
      default: null
    },
    placeholder: {
      type: String,
      default: 'Chọn dân tộc'
    },
    disabled: {
      type: Boolean
    },
    state: {
      default: null,
      type: Boolean
    },
    multiple: {
      default: false,
      type: Boolean
    }
  },

  data: () => ({
    storage: null,
    option: [],
    options: []
  }),

  created () {
    this.storage = new WebStorage()
    this.getListEthnic()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedEthnic', newValue)
    },

    ethnicValue (newValue, oldValue) {
      this.setSelectedOption()
    }
  },

  methods: {
    setSelectedOption () {
      if (!this.multiple) {
        if (this.options.length > 0 && this.ethnicValue) this.option = this.options.find((option) => (option.value === this.ethnicValue)) || null
        else this.option = null
        return
      }
      if (this.options.length > 0 && this.ethnicValue && this.ethnicValue.length > 0) {
        this.option = []
        this.ethnicValue.map(ethnic => {
          let op = this.options.find((option) => (option.value === ethnic)) || null
          if (op) this.option.push(op)
        })
      }
    },

    getListEthnic () {
      let listEthnicCached = this.storage.get('ethnicList')
      if (listEthnicCached && listEthnicCached.length > 0) {
        this.options = listEthnicCached
        this.setSelectedOption()
      } else {
        commonService.getEthnic()
          .then((response) => {
            if (response.data.success) {
              this.options = response.data.data
              if (this.options && this.options.length > 0) this.storage.set('ethnicList', this.options)
              this.setSelectedOption()
            }
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }
}
</script>
