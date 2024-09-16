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
  >
    <template slot="placeholder">
      <span class="placeholder">{{placeholder}}</span>
    </template>
  </multiselect>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-stations',
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
    }
  },
  methods: {
    getOptions: function () {
      // Header check login
      axios.get(config.baseApiUrl + 'AdSearchStaff/getOptionForSearchBox').then(response => {
        if (response.data.success) {
          this.stations = response.data.data.options.stations
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
