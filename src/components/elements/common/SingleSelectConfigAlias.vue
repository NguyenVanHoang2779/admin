<template>
  <div class="select-alias-config-type">
    <multiselect
            v-model="option"
            :options="options"
            :disabled="isDisabled"
            label="value"
            track-by="value"
            placeholder="Chọn..."
            selectedLabel="Đã chọn"
            deselectLabel="Bỏ chọn"
            selectLabel="Chọn"
            :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{title}}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'SingleSelectAlias',

  components: {
    Multiselect
  },

  created () {
    if (this.typeRole) {
      this.options = this.typeRole[0]
      if (this.typeRole[1] === 'object') {
        this.title = 'Chọn loại phạm vi'
      }
    }
    if (this.aliasConfig) {
      this.setSelectedOption()
    }
  },
  props: {
    aliasConfig: null,
    typeRole: '',
    isDisabled: false
  },
  data: () => ({
    option: null,
    options: [],
    title: 'Chọn alias config'
  }),
  watch: {
    aliasConfig: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    },
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedOption', newValue)
    }
  },

  methods: {
    setSelectedOption () {
      if (this.aliasConfig && this.options && this.options.length) {
        this.option = this.options.find(option => {
          return option.name === this.aliasConfig
        })
      }
    }
  }
}
</script>
