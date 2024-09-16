<template>
    <div class="region-and-province row">
        <b-form-group label="Chọn vùng miền" class="col-sm-6 ">
            <multiselect class="multiselect-success"
                         v-model="selectedRegion"
                         :options="listRegions"
                         placeholder="Chọn vùng miền"
                         track-by="name"
                         :disabled="false"
                         :searchable="true"
                         :loading="regionsLoading"
                         :multiple="true"
                         :hide-selected="true"
                         :allow-empty="true"
                         :close-on-select="false"
                         label="name" @select="onSelectRegion" @remove="onRemoveRegion"/>
        </b-form-group>
        <b-form-group label="Chọn tỉnh" class="col-sm-6">
            <multiselect class="multiselect-primary"
                         v-model="selectedProvince"
                         :options="listProvinces"
                         placeholder="Chọn tỉnh"
                         track-by="name"
                         selectLabel=""
                         selectedLabel=""
                         deselectLabel="x"
                         :disabled="false"
                         :loading="provincesLoading"
                         :searchable="true"
                         :multiple="true"
                         :hide-selected="true"
                         :allow-empty="true"
                         :close-on-select="false"
                         label="name" @select="onSelectProvince" @remove="onRemoveProvince"/>
        </b-form-group>
    </div>
</template>

<script>
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-region-and-province',
  props: {
  },
  components: {
    Multiselect
  },

  data: () => ({
    listRegions: [],
    listProvinces: [],
    selectedRegion: [],
    selectedProvince: [],
    regionsLoading: true,
    provincesLoading: false
  }),

  created () {
    this.getListRegions()
    // this.getListProvinceByRegion('')
  },
  watch: {
    selectedRegion () {
      this.$emit('getRegion', this.selectedRegion)
    },
    selectedProvince () {
      this.$emit('getProvince', this.selectedProvince)
    }
  },

  methods: {
    reset () {
      this.selectedRegion = []
      this.selectedProvince = []
    },
    getListRegions () {
      addressService.getListRegions().then(response => {
        if (response.data.success) {
          this.listRegions = response.data.regions
        }
        this.regionsLoading = false
      }).catch(error => {
        console.log(error)
      })
    },

    getListProvinceByRegion (regionId) {
      this.provincesLoading = true
      addressService.getListProvinceByRegions(regionId).then(response => {
        if (response.data.success) {
          this.listProvinces = [...this.listProvinces.concat(response.data.provinces)]
          this.provincesLoading = false
        }
      }).catch(error => {
        console.log(error)
      })
    },

    onSelectRegion (selectedOption, id) {
      this.selectedProvince = []
      this.getListProvinceByRegion(selectedOption.code)
      this.$emit('getRegion', this.selectedRegion)
      this.$emit('getProvince', this.selectedProvince)
    },

    onRemoveRegion (selectedOption, id) {
      this.selectedRegion = this.selectedRegion.filter(item => item !== selectedOption)
      this.listProvinces = []
      this.selectedRegion.forEach(item => this.getListProvinceByRegion(item.code))
      this.$emit('getRegion', '')
    },
    onSelectProvince (selectedOption, id) {
      this.$emit('getProvince', selectedOption)
    },

    onRemoveProvince () {
      this.selectedProvince = []
      this.$emit('getProvince', '')
    }
  }
}
</script>
