<template>
    <multiselect
        v-model="option"
        :options="options"
        :placeholder="placeholder"
        :multiple="true"
        :disabled="isDisabled"
        label="name"
        track-by="id"
        :close-on-select="closeSelect"
        :clear-on-select="clearSelect"
        selectedLabel=""
        deselectLabel="X"
        selectLabel="Chọn"
        @input="input"
    >
        <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        <span slot="placeholder" class="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<style scoped>
</style>

<script>

import WebStorage from 'infrastructures/web-storage'
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-districts',

  components: {
    Multiselect
  },

  props: {
    provinceId: null,
    districtId: {
      default: []
    },
    isDisabled: {
      type: Boolean
    },
    placeholder: {
      default: 'Chọn quận/huyện'
    },
    clearSelect: {
      default: false
    },
    closeSelect: {
      default: false
    }
  },

  data: () => ({
    storage: null,
    option: [],
    options: []
  }),

  created () {
    this.storage = new WebStorage()
    this.getListDistrict()
  },

  watch: {
    provinceId: function (newValue, oldValue) {
      this.option = []
      this.options = []
      this.$emit('onChange', null)
      this.getListDistrict()
    }
  },

  methods: {
    input (options) {
      this.$emit('onChange', options)
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.districtId) {
        this.option = this.options.filter(op => (this.districtId.includes('' + op.id) || this.districtId.includes(+op.id)))
      }
    },

    getListDistrict () {
      if (!this.provinceId || this.provinceId == null) {
        this.options = []
        this.option = null
        return
      }

      let cacheKey = `listDistrictsByProvince-${this.provinceId}`
      let listDistrictsCached = this.storage.get(cacheKey)
      if (listDistrictsCached) {
        this.options = listDistrictsCached
        this.setSelectedOption()
      } else {
        let params = {
          provinceId: this.provinceId
        }

        addressService.getDistrictByProvinceId(params)
          .then((response) => {
            if (response.data.success) {
              this.options = response.data.data
              this.storage.set(cacheKey, this.options)
              this.setSelectedOption()
            }
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }
}
</script>
