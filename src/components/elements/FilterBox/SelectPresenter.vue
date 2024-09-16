<template>
  <multiselect v-model="selectedPresenters"
               id="ajax"
               label="alias"
               track-by="id"
               placeholder="Nhập người giới thiệu shop"
               open-direction="bottom"
               :options="presenters"
               :multiple="true"
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
  name: 'select-presenter',
  components: {
    Multiselect,
    debounce
  },
  data: () => ({
    selectedPresenters: [],
    presenters: [],
    isLoading: false
  }),
  methods: {
    selected () {
      if (this.selectedPresenters) {
        let data = []
        if (this.selectedPresenters.length > 0) {
          for (let i = 0; i < this.selectedPresenters.length; i++) {
            data.push(this.selectedPresenters[i].id)
          }
        }
        this.$emit('selected', data)
      } else {
        this.$emit('selected', null)
      }
    },
    asyncFind: debounce(function (query) {
      this.isLoading = true
      shopService.searchPresenter({'term': query}).then(response => {
        if (response.hasOwnProperty('data')) {
          if (!response.data) {
            this.$notify({
              group: 'default',
              type: 'text-white bg-danger',
              title: 'Thông báo',
              text: 'Không có người giới thiệu shop cần tìm'
            })
          } else {
            if (response.data.items) {
              this.presenters = response.data.items
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
    }, 300)
  }
}
</script>

<style scoped>

</style>
