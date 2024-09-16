<template>
  <multiselect
      v-model="selectedCtmCare"
      :options="ctmCare"
      :multiple="multiple"
      :placeholder="placeholder"
      track-by="name"
      label="name"
      selectLabel=""
      selectedLabel=""
      deselectLabel="x"
      @select="onSelect"
      @remove="onRemove"
  />
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-ctmCare',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn CSKH'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    ctmCare: [],
    selectedCtmCare: []
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'AdShops/getListCustomerCare').then(response => {
        if (response.data.success) {
          this.ctmCare = response.data.data.options.ctmCare
          this.ctmCare.unshift({
            code: 'none',
            name: 'Chưa có'
          })
          if (!this.multiple) {
            this.ctmCare.unshift({
              code: '',
              name: this.placeholder
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedCtmCare.length > 0) {
          for (let i = 0; i < this.selectedCtmCare.length; i++) {
            data.push(this.selectedCtmCare[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedCtmCare = selectedOptions.code
        this.$emit('selected', this.selectedCtmCare)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedCtmCare.length; i++) {
          if (this.selectedCtmCare[i].code !== removeOptions.code) {
            data.push(this.selectedCtmCare[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedCtmCare = this.multiple ? [] : ''
      this.$emit('selected', this.selectedCtmCare)
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
