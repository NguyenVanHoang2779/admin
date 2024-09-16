<template>
  <multiselect
    v-model="shopType"
    :options="types"
    :placeholder="placeholder"
    track-by="id"
    label="name"
  />
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'MultiSelectShopType',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn loại shop'
    },
    value: {
      type: Number
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    types: [
      {id: 0, name: 'C2C'},
      {id: 1, name: 'B2C'},
      {id: 2, name: 'Tất cả'}
    ],
    shopType: {}
  }),
  mounted () {
    this.syncShopType()
  },
  methods: {
    syncShopType () {
      let $this = this
      this.shopType = this.types.find(function (item) {
        if (typeof $this.value === 'undefined') {
          return false
        }
        return $this.value === Number(item.id)
      })
    }
  },
  watch: {
    shopType () {
      if (this.shopType) {
        this.$emit('input', this.shopType.id)
      } else {
        this.$emit('input', null)
      }
    },
    value () {
      this.syncShopType()
    }
  }
}
</script>
