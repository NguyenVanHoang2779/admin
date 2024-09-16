<template>
  <multiselect v-model="selectedShops"
               id="ajax"
               label="name"
               track-by="code"
               placeholder="Gõ để tìm shop"
               open-direction="bottom"
               :options="shops"
               :multiple="false"
               :searchable="true"
               :loading="isLoading"
               :internal-search="false"
               :clear-on-select="true"
               :close-on-select="true"
               :options-limit="300"
               :limit="3"
               :max-height="600"
               :show-no-results="false"
               :hide-selected="false"
               :selectedLabel="``"
               :tagPlaceholder="``"
               :selectLabel="``"
               :deselectLabel="`X`"
               @search-change="asyncFind"
               @input="selected"
  >
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import shopService from 'domain/services/shop-service'
import debounce from 'debounce'

export default {
  name: 'search-shop',
  components: {
    Multiselect,
    debounce
  },
  data: () => ({
    selectedShops: [],
    shops: [],
    isLoading: false
  }),
  methods: {
    clearAll () {
    },
    selected () {
      // this.$notify({
      //   group: 'default',
      //   type: 'text-white bg-success',
      //   title: 'Thông báo',
      //   text: 'Đã chọn shop'
      // })
      if (this.selectedShops && this.selectedShops.hasOwnProperty('code')) {
        this.$emit('selected', this.selectedShops.code)
      } else {
        this.$emit('selected', null)
      }
    },
    asyncFind: debounce(function (query) {
      this.isLoading = true
      shopService.searchShop({'shop_code': query}).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              if (response.data.data) {
                this.shops = response.data.data
              }
            }
          }
        }
      }).catch((error) => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.isLoading = false
      })
    }, 400)
  },
  created () {
    // let all = {
    //   name: 'Tất cả',
    //   code: 'all'
    // }
    // if (this.shops) {
    //   this.shops.push(all)
    // } else {
    //   this.shops = []
    //   this.shops.push(all)
    // }
    // this.searchShops()
  }
}
</script>

<style scoped>

</style>
