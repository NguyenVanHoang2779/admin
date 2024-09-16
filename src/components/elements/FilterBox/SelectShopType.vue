<template>
  <multiselect
      v-model="selectedShopType"
      :options="type"
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
  name: 'select-shop-type',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn kiểu shop'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    type: [],
    selectedShopType: []
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'AdShopBank/getOptionSearch').then(response => {
        if (response.data.success) {
          this.type = response.data.data.options.shopTypes

          if (!this.multiple) {
            this.type.unshift({
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
        if (this.selectedShopType.length > 0) {
          for (let i = 0; i < this.selectedShopType.length; i++) {
            data.push(this.selectedShopType[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedShopType = selectedOptions.code
        this.$emit('selected', this.selectedShopType)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedShopType.length; i++) {
          if (this.selectedShopType[i].code !== removeOptions.code) {
            data.push(this.selectedShopType[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedShopType = this.multiple ? [] : ''
      this.$emit('selected', this.selectedShopType)
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
