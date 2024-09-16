<template>
  <multiselect
    :class="{'stateTrue': state === true, 'stateFalse' : state == false}"
    v-model="option"
    :options="options"
    :disabled="isDisabled"
    placeholder="Chọn phường/xã"
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
    <span class="placeholder" slot="placeholder">Chọn phường/xã</span>
  </multiselect>
</template>

<script>
import WebStorage from 'infrastructures/web-storage'
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-sub-district',

  components: {
    Multiselect
  },

  props: {
    districtId: null,
    subDistrictId: null,
    isDisabled: {
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.storage = new WebStorage()
    this.getListSubDistrict()
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedSubDistrict', newValue)
    },

    districtId: function (newValue, oldValue) {
      this.getListSubDistrict()
    },

    subDistrictId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      }
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options.length > 0 && this.subDistrictId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.subDistrictId)
        })
      }
    },

    getListSubDistrict () {
      if (!this.districtId) {
        this.option = null
        this.options = []
        return
      }

      let cacheKey = `listSubDistrictsAddressByDistrict-${this.districtId}`
      let listSubDistrictsCached = this.storage.get(cacheKey)
      if (listSubDistrictsCached) {
        this.options = listSubDistrictsCached
        this.setSelectedOption()
      } else {
        let params = {
          districtId: this.districtId
        }

        addressService.getSubDistrictAddressByDistrictId(params)
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
