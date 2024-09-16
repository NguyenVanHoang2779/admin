<template>
  <div class="col-md-12">
    <b-form-row>
      <b-form-group class="col-md-6" label="Chọn Tỉnh/thành phố">
        <multiselect
            v-model="selectedProvince"
            :options="provinces"
            :multiple="multiple"
            :placeholder="provincePlaceholder"
            track-by="name"
            selectLabel=""
            selectedLabel=""
            deselectLabel="x"
            label="name" @select="onSelectProvince" @remove="onRemoveProvince"/>
      </b-form-group>
      <b-form-group class="col-md-6" label="Chọn Kho">
        <multiselect
            v-model="selectedStation"
            :options="stations"
            :multiple="multiple"
            :placeholder="stationPlaceholder"
            track-by="name"
            selectLabel=""
            selectedLabel=""
            deselectLabel="x"
            label="name" @select="onSelectStation" @remove="onRemoveStation"/>
      </b-form-group>
    </b-form-row>
  </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-province-station',

  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    provincePlaceholder: {
      type: String,
      default: 'Nhập tỉnh/thành phố'
    },
    stationPlaceholder: {
      type: String,
      default: 'Nhập kho'
    },
    initProvince: {
      type: Object
    },
    initStation: {
      type: Object
    }
  },

  components: {
    Multiselect
  },
  data: () => ({
    provinces: [],
    stations: [],
    selectedProvince: [],
    selectedStation: []
  }),
  methods: {
    getOptions: function () {
      // Header check login
      axios.get(config.baseApiUrl + 'AdShopBank/getOptionSearch').then(response => {
        if (response.data.success) {
          this.provinces = response.data.data.options.provinces
          if (!this.multiple) {
            this.provinces.unshift({
              code: '',
              name: this.selectedProvince
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelectProvince: function (selectedOptions) {
      let dataS = []
      if (this.multiple) {
        if (this.selectedProvince.length > 0) {
          for (let i = 0; i < this.selectedProvince.length; i++) {
            dataS.push(this.selectedProvince[i].code)
          }
        }
        dataS.push(selectedOptions.code)
        this.$emit('getProvince', dataS)
        this.$emit('getStation', '')
      } else {
        this.selectedProvince = selectedOptions.code
        this.$emit('getProvince', this.selectedProvince)
        this.$emit('getStation', '')
      }
      let dataSend = {
        'province_id': dataS
      }
      // Update district
      this.stations = []
      this.selectedStation = []
      axios.get(config.baseApiUrl + 'AdAddresses/getStationByProvinceFormat', {'params': dataSend}).then(response => {
        if (response.data.success) {
          this.stations = response.data.data
          if (!this.multiple) {
            this.stations.unshift({
              code: '',
              name: this.selectedStation
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
    },
    onRemoveProvince: function (removeOptions) {
      this.stations = []
      this.selectedStation = []
      let dataS = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedProvince.length; i++) {
          if (this.selectedProvince[i].code !== removeOptions.code) {
            dataS.push(this.selectedProvince[i].code)
          }
        }
        this.$emit('getProvince', dataS)
      }
      let dataSend = {
        'province_id': dataS
      }
      // Update district
      this.stations = []
      this.selectedStation = []
      axios.get(config.baseApiUrl + 'AdAddresses/getStationByProvinceFormat', {'params': dataSend}).then(response => {
        if (response.data.sucess) {
          this.stations = response.data.data
          if (!this.multiple) {
            this.stations.unshift({
              code: '',
              name: this.selectedStation
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
    },
    onSelectStation: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedStation.length > 0) {
          for (let i = 0; i < this.selectedStation.length; i++) {
            data.push(this.selectedStation[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('getStation', data)
      } else {
        this.selectedStation = selectedOptions.code
        this.$emit('getStation', this.selectedStation)
      }
    },
    onRemoveStation: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedStation.length; i++) {
          if (this.selectedStation[i].code !== removeOptions.code) {
            data.push(this.selectedStation[i].code)
          }
        }
        this.$emit('getStation', data)
      }
    },
    reset: function () {
      this.selectedStation = this.multiple ? [] : ''
      this.$emit('getStation', this.selectedStation)
      this.selectedProvince = this.multiple ? [] : ''
      this.$emit('getProvince', this.selectedProvince)
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>
  .multiselect--active {
    z-index: 99;
  }
</style>
