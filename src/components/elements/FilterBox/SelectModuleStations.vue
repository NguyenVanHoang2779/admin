<template>
  <multiselect
          v-model="selectedModuleIds"
          :options="moduleIds"
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
import staffService from 'domain/services/staff-service'

export default {
  name: 'select-module-stations',
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
      default: 'Chọn nhóm được gán vào'
    },
    stationId: {

    }
  },
  components: {
    staffService,
    Multiselect
  },
  data: () => ({
    moduleIds: [],
    selectedModuleIds: []
  }),
  watch: {
    stationId: function (newValue, oldValue) {
      this.getOptions(newValue)
    }
  },
  methods: {
    getOptions: function (selectedStation) {
      let dataSend = {
        station_id: selectedStation
      }
      staffService.getListModuleByStationId(dataSend).then(response => {
        if (response.data.success) {
          this.moduleIds = response.data.data

          if (!this.multiple) {
            this.stations.unshift({
              id: '',
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
        if (this.selectedModuleIds.length > 0) {
          for (let i = 0; i < this.selectedModuleIds.length; i++) {
            data.push(this.selectedModuleIds[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedModuleIds = selectedOptions.id
        this.$emit('selected', this.selectedModuleIds)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedModuleIds.length; i++) {
          if (this.selectedModuleIds[i].id !== removeOptions.id) {
            data.push(this.selectedModuleIds[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedModuleIds = this.multiple ? [] : ''
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>

</style>
