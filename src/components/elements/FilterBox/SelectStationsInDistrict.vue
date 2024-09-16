<template>
  <b-form-group label="Chọn Kho">
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
  >
    <template slot="placeholder">
      <span class="placeholder">{{placeholder}}</span>
    </template>
  </multiselect>
  </b-form-group>
</template>

<script>
import Multiselect from 'vue-multiselect'
import autoAssignService from 'domain/services/auto-assign-service.js'
export default {
  name: 'select-stations-in-district',
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
    },
    stationId: {
      type: String,
      default: ''
    },
    districtIds: {
      type: Array
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    stations: [],
    selectedStations: []
  }),
  watch: {
    stationId: {
      handler: 'getOptions',
      immediate: true
    },
    districtIds: {
      handler: 'getOptions',
      immediate: true
    }
  },
  methods: {
    getOptions: function () {
      // Header check login
      autoAssignService.getListStationByDistric(this.districtIds).then(response => {
        if (response.data.success) {
          console.log(response.data.data)
          this.stations = response.data.data
          this.selectedStations = this.stations.filter(
            (el) => (parseInt(el.code) === parseInt(this.stationId))
          )
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
      this.$emit('selected', this.selectedStations)
    }
  }
}
</script>

<style scoped>

</style>
