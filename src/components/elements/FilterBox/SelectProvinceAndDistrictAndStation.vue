<template>
  <div class="col-md-12">
    <b-form-row>
      <b-form-group class="col-md-6" label="Tỉnh/thành phố">
        <multiselect
          v-model="provinceSelectChildren"
          :options="provinces"
          :multiple="false"
          :placeholder="provincePlaceholder"
          track-by="code"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          label="name"
          @select="onSelectProvince"
          required
        />
      </b-form-group>
    </b-form-row>

    <b-form-row>
      <b-form-group class="col-md-6" label="Quận/huyện">
        <multiselect
          v-model="districtSelectChildren"
          :options="districts"
          :multiple="false"
          :placeholder="districtPlaceholder"
          track-by="code"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          label="name"
          @select="onSelectDistrict"
        />
      </b-form-group>
    </b-form-row>

    <b-form-row>
      <b-form-group class="col-md-6" label="Kho">
        <multiselect
          v-model="stationSelectChildren"
          :options="stations"
          :multiple="false"
          :placeholder="stationPlaceholder"
          track-by="code"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          label="name"
          @select="onSelectStation"
        />
      </b-form-group>
    </b-form-row>

    <b-form-row>
      <b-form-group class="col-md-6" label="Danh sách giỏ">
        <multiselect
          v-model="cartSelectChildren"
          :options="carts"
          :multiple="true"
          :placeholder="cartPlaceholder"
          track-by="code"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          :closeOnSelect="false"
          label="name"
          @select="onSelectCart"
          @remove="onRemoveCart"
        />
      </b-form-group>
    </b-form-row>
  </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'

export default {
  name: 'select-province-and-district-and-station',

  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    provincePlaceholder: {
      type: String,
      default: 'Nhập tỉnh/thành phố'
    },
    districtPlaceholder: {
      type: String,
      default: 'Nhập quận/huyện'
    },
    stationPlaceholder: {
      type: String,
      default: 'Nhập kho'
    },
    cartPlaceholder: {
      type: String,
      default: 'Nhập giỏ'
    },

    type: {
      type: String,
      default: ''
    },
    area_id: {
      type: String,
      default: ''
    },
    selectedCart: {
      type: Array,
      default: () => []
    },
    selectedProvince: {
      type: Object
    },
    selectedDistrict: {
      type: Object
    },
    selectedStation: {
      type: Object
    }
  },

  components: {
    Multiselect
  },
  data: () => ({
    provinces: [],
    districts: [],
    stations: [],
    carts: [],
    provinceSelectChildren: {},
    districtSelectChildren: {},
    stationSelectChildren: {},
    cartSelectChildren: []
    // cartData: []
  }),
  methods: {
    getOptions: function () {
      // Header check login
      axios
        .get(config.baseApiUrl + 'AdShopBank/getOptionSearch')
        .then((response) => {
          if (response.data.success) {
            this.provinces = response.data.data.options.provinces
          }
        })
        .catch((error) => {
          if (error) {
          }
        })
    },
    onSelectProvince: function (selectedOptions) {
      this.$emit('getProvince', selectedOptions)
      let dataSend = {
        province_id: selectedOptions.code
      }

      this.provinceSelectChildren = {
        code: selectedOptions.code,
        name: selectedOptions.name
      }
      this.districtSelectChildren = {}
      this.stationSelectChildren = {}
      this.cartSelectChildren = []

      this.$emit('getDistrict', this.districtSelectChildren)
      this.$emit('getStation', this.stationSelectChildren)
      this.$emit('getCart', this.cartSelectChildren)
      axios
        .get(config.baseApiUrl + 'AdShopBank/apiGetDistrictForSearch', {
          params: dataSend
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.districts = response.data
          }
        })
        .catch((error) => {
          if (error) {
          }
        })
        .then(function () {
          self.app_mode = 'running'
        })

      // Update station
      let dataProvince = {
        province_id: selectedOptions.code
      }

      axios
        .get(config.baseApiUrl + 'AdAddresses/getStationByProvinceV2', {
          params: dataProvince
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.stations = response.data
          }
        })
        .catch((error) => {
          if (error) {
          }
        })
        .then(function () {
          self.app_mode = 'running'
        })
    },

    onSelectDistrict: function (selectedOptions) {
      this.districtSelectChildren = {
        code: selectedOptions.code,
        name: selectedOptions.name
      }
      // this.stationSelectChildren = {}
      // this.cartSelectChildren = []
      this.$emit('getDistrict', selectedOptions)
      // this.$emit('getStation', this.stationSelectChildren)
      // this.$emit('getCart', this.cartSelectChildren)

      // // Update station
      // let dataDistrict = {
      //   district_id: selectedOptions.code
      // }
      //
      // axios
      //   .get(config.baseApiUrl + 'AdAddresses/getStationByDistrict', {
      //     params: dataDistrict
      //   })
      //   .then((response) => {
      //     if (response.data.length > 0) {
      //       this.stations = response.data
      //     }
      //   })
      //   .catch((error) => {
      //     if (error) {
      //     }
      //   })
      //   .then(function () {
      //     self.app_mode = 'running'
      //   })
    },

    onSelectStation: function (selectedOptions) {
      this.stationSelectChildren = {
        code: selectedOptions.code,
        name: selectedOptions.name
      }
      this.cartSelectChildren = []
      this.$emit('getCart', this.cartSelectChildren)
      this.$emit('getStation', selectedOptions)

      // Update cart
      let dataStation = {
        'station_id': selectedOptions.code,
        'type': 2
      }
      this.carts = []
      axios.get(config.baseApiUrl + 'AdCarts/getCartByStationForSelect', {'params': dataStation}).then(response => {
        for (var key of Object.keys(response.data)) {
          this.carts.push({'code': key, 'name': response.data[key]})
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
    },

    onSelectCart: function (selectedOptions) {
      let cartData = []
      if (this.cartSelectChildren.length > 0) {
        for (let i = 0; i < this.cartSelectChildren.length; i++) {
          cartData.push(this.cartSelectChildren[i].code)
        }
      }
      cartData.push(selectedOptions.code)
      this.$emit('getCart', cartData)
    },

    onRemoveCart: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.cartSelectChildren.length; i++) {
          if (this.cartSelectChildren[i].code !== removeOptions.code) {
            data.push(this.cartSelectChildren[i].code)
          }
        }
        this.$emit('getCart', data)
      }
    }
  },

  watch: {
    selectedProvince: function (val) {
      this.provinceSelectChildren = this.selectedProvince
      let dataSend = {
        province_id: this.provinceSelectChildren.code
      }
      axios
        .get(config.baseApiUrl + 'AdShopBank/apiGetDistrictForSearch', {
          params: dataSend
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.districts = response.data
          }
        })
        .catch((error) => {
          if (error) {
          }
        })
        .then(function () {
          self.app_mode = 'running'
        })

      let dataProvince = {
        province_id: this.provinceSelectChildren.code
      }
      axios
        .get(config.baseApiUrl + 'AdAddresses/getStationByProvinceV2', {
          params: dataProvince
        })
        .then((response) => {
          if (response.data.length > 0) {
            this.stations = response.data
          }
        })
        .catch((error) => {
          if (error) {
          }
        })
        .then(function () {
          self.app_mode = 'running'
        })
    },
    selectedDistrict: function (val) {
      this.districtSelectChildren = this.selectedDistrict
      // let dataDistrict = {
      //   province_id: this.districtSelectChildren.code
      // }
      // axios
      //   .get(config.baseApiUrl + 'AdAddresses/getStationByProvinceV2', {
      //     params: dataDistrict
      //   })
      //   .then((response) => {
      //     if (response.data.length > 0) {
      //       this.stations = response.data
      //     }
      //   })
      //   .catch((error) => {
      //     if (error) {
      //     }
      //   })
      //   .then(function () {
      //     self.app_mode = 'running'
      //   })
    },
    selectedStation: function (val) {
      this.stationSelectChildren = this.selectedStation
      let dataStation = {
        'station_id': this.stationSelectChildren.code,
        'type': 2
      }
      this.carts = []
      axios.get(config.baseApiUrl + 'AdCarts/getCartByStationForSelect', {'params': dataStation}).then(response => {
        for (var key of Object.keys(response.data)) {
          this.carts.push({'code': key, 'name': response.data[key]})
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.app_mode = 'running'
      })
    },
    selectedCart: function (val) {
      this.cartSelectChildren = this.selectedCart
      let cartsList = []
      for (var key in this.cartSelectChildren) {
        cartsList.push(this.cartSelectChildren[key].code)
      }
      this.$emit('getCart', cartsList)
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
