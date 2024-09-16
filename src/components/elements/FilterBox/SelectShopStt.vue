<template>
  <multiselect
      v-model="selectedShopStt"
      :options="status"
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
  name: 'select-shop-stt',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn trạng thái shop'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    status: [],
    selectedShopStt: []
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'AdShopBank/getOptionSearch').then(response => {
        if (response.data.success) {
          this.status = response.data.data.options.shopStatuses

          if (!this.multiple) {
            this.status.unshift({
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
        if (this.selectedShopStt.length > 0) {
          for (let i = 0; i < this.selectedShopStt.length; i++) {
            data.push(this.selectedShopStt[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedShopStt = selectedOptions.code
        this.$emit('selected', this.selectedShopStt)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedShopStt.length; i++) {
          if (this.selectedShopStt[i].code !== removeOptions.code) {
            data.push(this.selectedShopStt[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedShopStt = this.multiple ? [] : ''
      this.$emit('selected', this.selectedShopStt)
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
