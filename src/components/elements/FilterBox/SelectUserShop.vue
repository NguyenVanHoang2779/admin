<template>
  <multiselect
      v-model="selectedUserShop"
      :options="users"
      :multiple="false"
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
  name: 'select-user-shop',
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    users: [
      { name: 'Tất cả', code: '' }
    ],
    selectedUserShop: { name: 'Tất cả', code: '' }
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'AdShopBank/getOptionSearch').then(response => {
        if (response.data.success) {
          this.users = response.data.data.options.users
          this.users.unshift({
            code: '',
            name: 'Tất cả'
          })
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelect: function (selectedOptions) {
      this.selectedUserShop = selectedOptions.code
      this.$emit('selected', this.selectedUserShop)
    },
    onRemove: function () {
      this.$emit('selected', '')
    },
    reset: function () {
      this.selectedUserShop = { name: 'Tất cả', code: '' }
      this.$emit('selected', this.selectedUserShop.code)
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
