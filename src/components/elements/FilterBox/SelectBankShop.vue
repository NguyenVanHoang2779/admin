<template>
    <multiselect
            v-model="selectedBank"
            :options="banks"
            :multiple="multiple"
            :disabled="disabled"
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
  name: 'select-bank',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn ngân hàng'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    banks: [],
    selectedBank: []
  }),
  methods: {
    getOptions: function () {
      // Header check login
      axios.get(config.baseApiUrl + 'AdQuickTransfer/getOptionBank').then(response => {
        if (response.data.success) {
          this.banks = response.data.data.options.banks

          if (!this.multiple) {
            this.banks.unshift({
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
    onSelect: function (selectedOptions, id) {
      if (this.multiple) {
        let data = []
        if (this.selectedBank.length > 0) {
          for (let i = 0; i < this.selectedBank.length; i++) {
            data.push(this.selectedBank[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedBank = selectedOptions.code
        this.$emit('selected', this.selectedBank)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedBank.length; i++) {
          if (this.selectedBank[i].code !== removeOptions.code) {
            data.push(this.selectedBank[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedBank = this.multiple ? [] : ''
      this.$emit('selected', this.selectedBank)
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>

</style>
