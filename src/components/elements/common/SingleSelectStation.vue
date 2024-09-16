<template>
    <multiselect
      :class="selectClass"
      v-model="option"
      :options="options"
      :disabled="isDisabled"
      :placeholder="placeholder"
      label="name"
      track-by="name"
      selectedLabel=""
      deselectLabel="X"
      selectLabel=""
      :searchable="true"
      @select="op => { $emit('select', op) }"
      @remove="op => { $emit('remove', op) }"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">{{ placeholder }}</span>
    </multiselect>
</template>

<style scoped>
  .non-blur >>> .multiselect--disabled {
    opacity: 1!important;
  }
  .non-blur >>> .multiselect__tags {
    background: white;
  }
  .non-blur >>> .multiselect__tag-icon {
    display: none
  }
  .custom-multiselect {
    max-height: 200px;
    overflow: auto;
  }
</style>

<script>
import stationService from 'domain/services/station-service'
import WebStorage from 'infrastructures/web-storage'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-station',

  components: {
    Multiselect
  },

  props: {
    selectClass: '',
    stationId: {},
    regionId: {},
    provinceId: {},
    isDisabled: {
      type: Boolean
    },
    placeholder: {
      default: 'Chọn kho'
    },
    reset: {},
    isActive: {
      default: false
    }
  },
  data: () => ({
    option: null,
    options: [],
    storage: null
  }),

  created () {
    this.storage = new WebStorage()
    this.getAllStation()
  },

  watch: {
    provinceId: function (newId, oldId) {
      if (newId) {
        this.getStationListByProvinceId(newId)
      } else {
        this.option = null
        this.getAllStation()
      }
    },

    option: function (newOption, oldOption) {
      this.$emit('handleSelectedStation', newOption)
    },

    regionId: function (newId, oldId) {
      if (newId) {
        this.getStationListByRegionId(newId)
      } else {
        this.getAllStation()
      }
    },

    stationId: function (newId, oldId) {
      if (newId) {
        this.setSelectedOption()
      } else this.option = null
    },
    reset () {
      this.option = null
    }
  },

  methods: {
    resetOption () {
      this.option = null
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.stationId) {
        this.option = this.options.find((option) => {
          return parseInt(option.id) === parseInt(this.stationId)
        })
      }
    },

    getAllStation: function () {
      let cacheKey = 'allStationOfGHTK'
      let listStationCached = this.storage.get(cacheKey)
      if (listStationCached) {
        this.options = listStationCached
        this.setSelectedOption()
      } else {
        stationService.getAllStation({is_active: this.isActive})
          .then((response) => {
            if (response.data.success) {
              this.options = response.data.data
              this.storage.set(cacheKey, this.options)
              this.setSelectedOption()
            }
          }).catch((e) => {
            console.log(e)
          })
      }
    },

    getStationListByProvinceId: function (provinceId) {
      let params = {
        provinceId: provinceId
      }
      stationService.getStationListByProvinceId(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.option = null
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getStationListByRegionId: function (regionId) {
      let params = {
        regionId: regionId
      }
      stationService.getStationListByRegionId(params)
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.option = null
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
