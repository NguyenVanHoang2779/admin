<template>
  <multiselect
          v-model="selectedStations"
          :options="stations"
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
import Multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
export default {
  name: 'select-station-carts',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn kho'
    },
    provinces: {
      type: Array
    },
    stationDefault: {
      type: Array
    },
    flagStation: {
      type: Number
    }
  },
  mounted () {
    this.selectedStations = this.stationDefault
  },
  created () {
    this.getOptions()
  },
  components: {
    Multiselect
  },
  watch: {
    provinces: function (newValue, oldValue) {
      this.getOptions()
    },
    flagStation: function (newValue, oldValue) {
      if (this.flagStation === 2) {
        this.selectedStations = this.stationDefault
      }
    }
  },
  data: () => ({
    stations: [],
    selectedStations: []
  }),
  methods: {
    getOptions: function () {
      let dataSend = {
        province_id: this.provinces
      }
      ManageLineService.getStationCarts(dataSend).then(response => {
        if (response.data.success) {
          this.stations = response.data.data
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
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedStations.length > 0) {
          for (let i = 0; i < this.selectedStations.length; i++) {
            data.push(this.selectedStations[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedStations = selectedOptions.id
        this.$emit('selected', this.selectedStations)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedStations.length; i++) {
          if (this.selectedStations[i].id !== removeOptions.id) {
            data.push(this.selectedStations[i].id)
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
