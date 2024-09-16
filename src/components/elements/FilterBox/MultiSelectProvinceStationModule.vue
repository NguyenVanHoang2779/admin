<template>
  <div class="col-md-12">
    <b-form-row>
      <b-form-group class="col-md-4" label="Chọn Tỉnh/thành phố">
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
      <b-form-group class="col-md-4" label="Chọn Kho">
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
      <b-form-group class="col-md-4" label="Chọn Module">
        <multiselect
            v-model="selectedModule"
            :options="modules"
            :multiple="!multiple"
            :placeholder="modulePlaceholder"
            track-by="id"
            selectLabel=""
            selectedLabel=""
            deselectLabel="x"
            label="alias" @select="onSelectModule" @remove="onRemoveModule"/>
      </b-form-group>
    </b-form-row>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import ConfigCapacity from 'domain/services/config-capacity-service'
export default {
  name: 'select-province-station',

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    provincePlaceholder: {
      type: String,
      default: 'Nhập Tỉnh/Thành phố'
    },
    stationPlaceholder: {
      type: String,
      default: 'Nhập kho'
    },
    modulePlaceholder: {
      type: String,
      default: 'Nhập Module'
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
    selectedStation: [],
    modules: [],
    selectedModule: []
  }),
  methods: {
    getOptions: function () {
      // Header check login
      ConfigCapacity.getProvince().then(response => {
        if (response.data.success) {
          this.provinces = response.data.data.options.provinces
          if (!this.multiple) {
            this.provinces.unshift({
              code: '',
              name: this.provincePlaceholder
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
        dataS.push(selectedOptions.code)
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
      ConfigCapacity.getStation(dataSend).then(response => {
        if (response.data.success) {
          this.stations = response.data.data
          if (!this.multiple) {
            this.stations.unshift({
              code: '',
              name: this.stationPlaceholder
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
      ConfigCapacity.getStation(dataSend).then(response => {
        if (response.data.sucess) {
          this.stations = response.data.data
          if (this.multiple) {
            this.stations.unshift({
              code: '',
              name: this.stationPlaceholder
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
      let dataS = []
      if (this.multiple) {
        if (this.selectedStation.length > 0) {
          for (let i = 0; i < this.selectedStation.length; i++) {
            dataS.push(this.selectedStation[i].code)
          }
        }
        dataS.push(selectedOptions.code)
        this.$emit('getStation', dataS)
        this.$emit('getModule', '')
      } else {
        dataS.push(selectedOptions.code)
        this.selectedStation = selectedOptions.code
        this.$emit('getStation', this.selectedStation)
        this.$emit('getModule', '')
      }
      let dataSend = {
        'station_id': dataS
      }
      ConfigCapacity.getModule(dataSend).then(response => {
        if (response.data.success) {
          this.modules = response.data.data.modules
          if (this.multiple) {
            this.modules.unshift({
              code: '',
              name: this.selectedModule
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
    onRemoveStation: function (removeOptions) {
      let dataS = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedStation.length; i++) {
          if (this.selectedStation[i].code !== removeOptions.code) {
            dataS.push(this.selectedStation[i].code)
          }
        }
        this.$emit('getStation', dataS)
      }
      let dataSend = {
        'station_id': dataS
      }
      // Update district
      this.modules = []
      this.selectedModule = []
      ConfigCapacity.getModule(dataSend).then(response => {
        if (response.data.sucess) {
          this.modules = response.data.data
          if (!this.multiple) {
            this.modules.unshift({
              code: '',
              name: this.selectedModule
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
    onSelectModule: function (selectedOptions) {
      let data = []
      if (!this.multiple) {
        if (this.selectedModule.length > 0) {
          for (let i = 0; i < this.selectedModule.length; i++) {
            data.push(this.selectedModule[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('getModule', data)
      } else {
        this.selectedModule = selectedOptions.id
        this.$emit('getModule', this.selectedModule)
      }
    },
    onRemoveModule: function (removeOptions) {
      let data = []
      if (!this.multiple) {
        for (let i = 0; i < this.selectedModule.length; i++) {
          if (this.selectedModule[i].code !== removeOptions.code) {
            data.push(this.selectedModule[i].code)
          }
        }
        this.$emit('getModule', data)
      }
    },
    reset: function () {
      this.selectedStation = this.multiple ? [] : ''
      this.$emit('getStation', this.selectedStation)
      this.selectedProvince = this.multiple ? [] : ''
      this.$emit('getProvince', this.selectedProvince)
      this.selectedModule = this.multiple ? [] : ''
      this.$emit('getModule', this.selectedModule)
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
