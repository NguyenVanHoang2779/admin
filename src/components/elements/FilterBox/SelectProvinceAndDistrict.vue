<template>
  <div class="col-md-8">
    <b-form-row>
      <b-form-group class="col-md-6" label="Tỉnh/thành phố">
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
      <b-form-group class="col-md-6" label="Quận/huyện">
        <multiselect
            v-model="selectedDistrict"
            :options="districts"
            :multiple="multiple"
            :placeholder="districtPlaceholder"
            track-by="name"
            selectLabel=""
            selectedLabel=""
            deselectLabel="x"
            label="name" @select="onSelectDistrict" @remove="onRemoveDistrict"/>
      </b-form-group>
    </b-form-row>
  </div>
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-province-and-district',

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
    }
  },

  components: {
    Multiselect
  },
  data: () => ({
    provinces: [],
    districts: [],
    selectedProvince: [],
    selectedDistrict: []
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
        this.$emit('getDistrict', '')
      } else {
        this.selectedProvince = selectedOptions.code
        this.$emit('getProvince', this.selectedProvince)
        this.$emit('getDistrict', '')
      }
      let dataSend = {
        'province_id': dataS
      }
      // Update district
      this.districts = []
      this.selectedDistrict = []
      axios.get(config.baseApiUrl + 'AdShopBank/apiGetDistrictForSearch', {'params': dataSend}).then(response => {
        if (response.data.length > 0) {
          this.districts = response.data
          if (!this.multiple) {
            this.districts.unshift({
              code: '',
              name: this.selectedDistrict
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
      this.districts = []
      this.selectedDistrict = []
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
      this.districts = []
      this.selectedDistrict = []
      axios.get(config.baseApiUrl + 'AdShopBank/apiGetDistrictForSearch', {'params': dataSend}).then(response => {
        if (response.data.length > 0) {
          this.districts = response.data
          if (!this.multiple) {
            this.districts.unshift({
              code: '',
              name: this.selectedDistrict
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
    onSelectDistrict: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedDistrict.length > 0) {
          for (let i = 0; i < this.selectedDistrict.length; i++) {
            data.push(this.selectedDistrict[i].code)
          }
        }
        data.push(selectedOptions.code)
        this.$emit('getDistrict', data)
      } else {
        this.selectedDistrict = selectedOptions.code
        this.$emit('getDistrict', this.selectedDistrict)
      }
    },
    onRemoveDistrict: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedDistrict.length; i++) {
          if (this.selectedDistrict[i].code !== removeOptions.code) {
            data.push(this.selectedDistrict[i].code)
          }
        }
        this.$emit('getDistrict', data)
      }
    },
    reset: function () {
      this.selectedDistrict = this.multiple ? [] : ''
      this.$emit('getDistrict', this.selectedDistrict)
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
