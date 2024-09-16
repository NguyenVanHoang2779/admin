<template>
  <multiselect
          v-model="selectedStations"
          :options="stations"
          :multiple="multiple"
          :disabled="disabled"
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
import Multiselect from 'vue-multiselect'
import salaryService from 'domain/services/salary-service'

export default {

  name: 'select-province-stations',

  props: {

    disabled: {
      type: Boolean,
      default: false
    },

    multiple: {
      type: Boolean,
      default: true
    },

    placeholder: {
      type: String,
      default: 'Chọn kho'
    }
  },

  components: {
    Multiselect,
    salaryService
  },

  data: () => ({
    stations: [],
    selectedStations: []
  }),

  methods: {

    getOptions: function () {
      // Header check login
      salaryService.getListProvinceStation().then(response => {
        if (response.data.success) {
          this.stations = response.data.data.stations

          if (!this.multiple) {
            this.stations.unshift({
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

    onSelect: function (selectedOptions, id) {
      if (this.multiple) {
        let data = []
        if (this.selectedStations.length > 0) {
          for (let i = 0; i < this.selectedStations.length; i++) {
            data.push(this.selectedStations[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('selected', data)
      } else {
        this.selectedStations = selectedOptions.code
        this.$emit('selected', this.selectedStations)
      }
    },

    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedStations.length; i++) {
          if (this.selectedStations[i].code !== removeOptions.code) {
            data.push(this.selectedStations[i].code)
          }
        }
        this.$emit('selected', data)
      }
    },

    reset: function () {
      this.selectedStations = this.multiple ? [] : ''
    }
  },

  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>

</style>
