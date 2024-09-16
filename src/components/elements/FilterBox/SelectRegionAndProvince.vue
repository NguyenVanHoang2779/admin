<template>
  <div class="region-and-province row">
    <b-form-group label="Chọn vùng miền" class="col-sm-6 ">
      <multiselect
        v-model="selectedRegion"
        :options="listRegions"
        :multiple="false"
        :placeholder="regionPlaceholder"
        track-by="name"
        selectLabel=""
        selectedLabel=""
        deselectLabel="x"
        label="name" @select="onSelectRegion" @remove="onRemoveRegion"/>
    </b-form-group>
    <b-form-group label="Chọn tỉnh" class="col-sm-6">
      <multiselect
        v-model="selectedProvince"
        :options="listProvinces"
        :multiple="false"
        :placeholder="provincePlaceholder"
        track-by="name"
        selectLabel=""
        selectedLabel=""
        deselectLabel="x"
        label="name" @select="onSelectProvince" @remove="onRemoveProvince"/>
    </b-form-group>
  </div>
</template>

<script>
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-region-and-province',

  props: {
    regionPlaceholder: {
      type: String,
      default: 'Chọn vùng miền'
    },
    provincePlaceholder: {
      type: String,
      default: 'Chọn tỉnh'
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    listRegions: [],
    listProvinces: [],
    selectedRegion: '',
    selectedProvince: []
  }),

  created () {
    this.getListRegions()
    this.getListProvinceByRegion('')
  },

  methods: {
    getListRegions () {
      addressService.getListRegions().then(response => {
        if (response.data.success) {
          this.listRegions = response.data.regions

          if (this.listRegions.length > 0) {
            this.listRegions.unshift({
              code: '',
              name: this.regionPlaceholder
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },

    getListProvinceByRegion (regionId) {
      addressService.getListProvinceByRegions(regionId).then(response => {
        if (response.data.success) {
          this.listProvinces = response.data.provinces

          if (this.listProvinces.length > 0) {
            this.listProvinces.unshift({
              code: '',
              name: this.provincePlaceholder
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },

    onSelectRegion (selectedOption, id) {
      this.selectedProvince = []
      this.getListProvinceByRegion(selectedOption.code)

      this.$emit('getRegion', selectedOption.code)
      this.$emit('getProvince', '')
    },

    onRemoveRegion () {
      this.listProvinces = []
      this.$emit('getRegion', '')
    },

    onSelectProvince (selectedOption, id) {
      this.$emit('getProvince', selectedOption.code)
    },

    onRemoveProvince () {
      this.selectedProvince = []
      this.$emit('getProvince', '')
    }
  }
}
</script>
