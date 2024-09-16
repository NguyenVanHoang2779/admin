<template>
    <multiselect
      :id="id"
      :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :disabled="isDisabled"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      @select="op => { $emit('select', op) }"
      @input="op => { $emit('input', op) }"
      @remove="op => { $emit('remove', op) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<script>
import WebStorage from 'infrastructures/web-storage'
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-district',

  components: {
    Multiselect
  },

  props: {
    isGetAll: {
      type: Boolean,
      default: false
    },
    id: {
      default: 'select-district'
    },
    provinceId: null,
    districtId: null,
    isDisabled: {
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Chọn quận/huyện'
    }
  },

  data: () => ({
    storage: null,
    option: null,
    options: []
  }),

  created () {
    this.storage = new WebStorage()
    this.getListDistrict()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedDistrict', newValue)
    },

    provinceId: function (newValue, oldValue) {
      this.option = null
      this.options = []
      if (newValue !== null) {
        this.getListDistrict()
      }
    },

    districtId: function (newValue, oldValue) {
      if (newValue !== null && newValue !== '') {
        this.setSelectedOption()
      }
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.districtId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.districtId)
        })
      }
    },

    getListDistrict () {
      if (!this.isGetAll && (!this.provinceId)) {
        this.options = []
        this.option = null
        return
      }

      let cacheKey = `listDistrictsByProvince-${this.provinceId}`
      if (this.isGetAll) {
        cacheKey = `listAllDistricts`
      }
      let listDistrictsCached = this.storage.get(cacheKey)
      if (listDistrictsCached) {
        this.options = listDistrictsCached
        this.setSelectedOption()
      } else {
        let params = {
          isGetAll: +this.isGetAll,
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
<style scoped>
  .stateTrue >>> .multiselect__tags {
    border-color: #28a745;
  }
  .stateFalse >>> .multiselect__tags {
    border-color: #d9534f;
  }
</style>
