<template>
    <multiselect
      v-model="option"
      :options="options"
      :multiple="true"
      placeholder="Chọn kho"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :disabled="isDisabled"
      :limit="limit"
      :hide-selected="hideSelect"
      :close-on-select="autoClose"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
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
import Multiselect from 'vue-multiselect'
import stationService from 'domain/services/station-service'

export default {
  name: 'multi-select-stations',

  components: {
    Multiselect
  },

  props: {
    stationIds: {},
    allStation: {},
    autoClose: {
      default: false
    },
    hideSelect: {
      default: false
    },
    limit: {
      default: 5
    },
    isDisabled: {
      default: false
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    if (this.allStation && this.allStation.length > 0) {
      this.options = this.allStation
      if (this.stationIds && this.stationIds.length > 0) {
        this.option = this.allStation.filter((item) => {
          return this.stationIds.split(',').includes(item.id.toString())
        })
      }
    }
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('stationIds', this.option.map(item => item.id))
    },

    allStation: function (newVal, oldVal) {
      this.options = newVal
    },

    stationIds: function (newVal, oldVal) {
      if (newVal && this.allStation.length > 0) {
        this.option = this.allStation.filter((item) => {
          return newVal.split(',').includes(item.id.toString())
        })
      }
    }
  },

  methods: {
    getAllStations: function () {
      stationService.getAllStationByProvinceIds()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
