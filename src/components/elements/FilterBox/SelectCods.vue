<template>
    <multiselect
            v-model="selectedCods"
            :options="cods"
            :multiple="multiple"
            :placeholder="placeholder"
            :searchable="true"
            :loading="isLoading"
            open-direction="bottom"
            :internal-search="false"
            :clear-on-select="true"
            :close-on-select="false"
            :options-limit="300"
            :limit="20"
            :limit-text="limitText"
            :max-height="600"
            :show-no-results="false"
            :hide-selected="true"
            @search-change="asyncFind"
            track-by="id"
            id="ajax" label="fullname"
            :custom-label="aliasWithName"
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
  name: 'select-cods',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Nhập tên hoặc mã cod để tìm kiếm'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    cods: [],
    selectedCods: [],
    isLoading: false
  }),
  methods: {
    limitText (count) {
      return `và ${count} cods`
    },
    asyncFind (query) {
      this.isLoading = true
      if (query.length > 1) {
        axios.get(config.baseApiUrl + 'services/autocompleteCod?term=' + query).then(response => {
          this.cods = response.data.items
          this.isLoading = false
        })
      } else {
        this.isLoading = false
      }
    },
    aliasWithName ({ alias, fullname }) {
      return `${alias} - ${fullname}`
    },
    getOptions: function () {
      axios.get(config.baseApiUrl + 'bills/getOptionForSearchCod').then(response => {
        if (response.data.success) {
          this.cods = response.data.data.options.cods

          if (!this.multiple) {
            this.cods.unshift({
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
        if (this.selectedCods.length > 0) {
          for (let i = 0; i < this.selectedCods.length; i++) {
            data.push(this.selectedCods[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedCods = selectedOptions.id
        this.$emit('selected', this.selectedCods)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedCods.length; i++) {
          if (this.selectedCods[i].id !== removeOptions.id) {
            data.push(this.selectedCods[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedCods = this.multiple ? [] : ''
      this.$emit('selected', this.selectedCods)
    }
  },
  created () {
    // this.getOptions()
  }
}
</script>

<style scoped>

</style>
