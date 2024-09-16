<template>
  <multiselect
          v-model="selectedRegions"
          :options="listRegions"
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
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-regions',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn vùng miền'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    listRegions: [],
    selectedRegions: []
  }),
  methods: {
    getOptions () {
      addressService.getListRegions().then(response => {
        if (response.data.success) {
          this.listRegions = response.data.regions

          if (!this.multiple) {
            this.listRegions.unshift({
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
    onSelect (selectedOptions, id) {
      if (this.multiple) {
        let data = []
        if (this.selectedRegions.length > 0) {
          for (let i = 0; i < this.selectedRegions.length; i++) {
            data.push(this.selectedRegions[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedRegions = selectedOptions.code
        this.$emit('selected', this.selectedRegions)
      }
    },
    onRemove () {
      this.selectedRegions = this.multiple ? [] : ''
      this.$emit('selected', [])
    },
    reset () {
      this.selectedRegions = this.multiple ? [] : ''
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>
