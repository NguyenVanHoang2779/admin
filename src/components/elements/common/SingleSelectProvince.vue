<template>
    <multiselect
      :class="[selectClass, {'stateTrue': state === true, 'stateFalse' : state == false}]"
      v-model="option"
      :options="options"
      :placeholder="placeholder"
      :disabled="isDisabled"
      label="name"
      track-by="id"
      selectedLabel=""
      deselectLabel="X"
      selectLabel="Chọn"
      :searchable="true"
      @select="op => { $emit('select', op) }"
      @input="op => { $emit('input', op) }"
      @remove="op => { $emit('remove', op) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<script>
import addressService from 'domain/services/address-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-province',

  components: {
    Multiselect
  },

  props: {
    placeholder: {
      type: String,
      default: 'Chọn tỉnh'
    },
    regionId: {
      type: String
    },
    regionName: {
      type: String
    },
    provinceId: {
    },
    isDisabled: {
      type: Boolean
    },
    unselect: {
      type: Boolean
    },
    state: {
      type: Boolean,
      default: null
    },
    selectClass: {
      default: ''
    },
    reset: {
      default: false
    }
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getAllProvince()
  },

  watch: {
    option (newVal, oldVal) {
      this.$emit('handleSelectedProvince', newVal)
    },

    regionId (newVal, oldVal) {
      if (newVal) {
        this.getProvinceByRegionId(newVal)
        return
      }
      this.option = null
      this.getAllProvince()
    },

    regionName (newVal, oldVal) {
      if (newVal) {
        this.getProvinceByRegionId(newVal)
        return
      }
      this.option = null
      this.getAllProvince()
    },

    provinceId (newValue, oldValue) {
      if (!newValue) {
        this.option = null
        return
      }
      this.setSelectedOption()
    },

    unselect (newValue, oldValue) {
      if (newValue) {
        this.option = null
      }
    },

    reset () {
      this.option = null
    }
  },

  methods: {
    setSelectedOption () {
      if (this.options && this.options.length && this.provinceId) {
        this.option = this.options.find(option => (parseInt(option.id) === parseInt(this.provinceId))) || null
      }
    },

    async getAllProvince () {
      this.options = await this.$store.getters['location/getRealProvinces']

      this.setSelectedOption()
    },

    getProvinceByRegionId (regionId) {
      if (this.regionName) {
        let params = {
          region: this.regionName
        }
        addressService.getProvincesByRegionHr(params)
          .then((response) => {
            if (response.data.success) {
              this.options = response.data.data
              if (this.options.length === 1 && (regionId === 'HN' || regionId === 'HCM')) this.option = this.options[0]
              else this.option = null
            }
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        let params = {
          regionId: regionId
        }
        addressService.getProvinceByRegionId(params)
          .then((response) => {
            if (response.data.success) {
              this.options = response.data.data
              this.option = null
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
