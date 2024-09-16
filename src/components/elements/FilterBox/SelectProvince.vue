<template>
  <multiselect
          v-model="selectedProvinces"
          :options="provinces"
          :multiple="multiple"
          :placeholder="placeholder"
          track-by="id"
          label="name"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          @select="onSelect"
          @remove="onRemove"
  />
</template>

<script>
import Multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
import * as _ from 'lodash'
export default {
  name: 'select-province',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn tỉnh'
    },
    regions: {
      type: Array
    }
  },
  watch: {
    regions: function (newValue, oldValue) {
      this.getOptions()
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    provinces: [],
    type: 0,
    selectedProvinces: []
  }),
  created () {
    this.getOptions()
  },
  methods: {
    getOptions: function () {
      let dataSend = {
        region: _.isEmpty(this.regions) ? [] : this.regions.map(el => el.value),
        type: this.type
      }
      ManageLineService.getProvince(dataSend).then(response => {
        if (response.data.success) {
          this.provinces = response.data.data

          if (!this.multiple) {
            this.provinces.unshift({
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
        if (this.selectedProvinces.length > 0) {
          console.log(this.selectedProvinces)
          for (let i = 0; i < this.selectedProvinces.length; i++) {
            data.push(this.selectedProvinces[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedProvinces = selectedOptions.id
        this.$emit('selected', this.selectedProvinces)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedProvinces.length; i++) {
          if (this.selectedProvinces[i].id !== removeOptions.id) {
            data.push(this.selectedProvinces[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedProvinces = this.multiple ? [] : ''
      this.$emit('selected', this.selectedProvinces)
    }
  }
}
</script>

<style scoped>

</style>
