<template>
  <multiselect v-model="selectedPkOnsites"
               id="ajax"
               label="name"
               track-by="code"
               placeholder="Gõ để tìm pk onsite"
               open-direction="bottom"
               :options="pkOnsites"
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
  name: 'search-pkonsite',
  components: {
    Multiselect,
    debounce
  },
  props: {
    selected_pk_onsite: {}
  },
  data: () => ({
    selectedPkOnsites: [],
    pkOnsites: [],
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
      //   text: 'Đã chọn pk onsite'
      // })
      if (this.selectedPkOnsites && this.selectedPkOnsites.hasOwnProperty('name')) {
        this.$emit('selected', this.selectedPkOnsites.name)
      } else {
        this.$emit('selected', null)
      }
    },
    excuteData (data) {
      return Object.entries(data).map(([code, name]) => ({code, name}))
    },
    asyncFind: debounce(function (query) {
      this.isLoading = true
      shopService.searchPkOnsiteName({'name': query}).then(response => {
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
                this.pkOnsites = this.excuteData(response.data.data)
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
        this.$emit('updateSelectedPkOnsite', this.selectedPkOnsites)
        this.isLoading = false
      })
    }, 300)
  },
  created () {
    // let all = {
    //   name: 'Tất cả',
    //   code: 'all'
    // }
    // if (this.pkOnsites) {
    //   this.pkOnsites.push(all)
    // } else {
    //   this.pkOnsites = []
    //   this.pkOnsites.push(all)
    // }
    // this.searchPkOnsites()
  },
  watch: {
    selected_pk_onsite: function (newVal) {
      if (Object.keys(newVal).length === 0) {
        this.selectedPkOnsites = {}
      }
    }
  }
}
</script>

<style scoped>

</style>
