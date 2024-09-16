<template>
    <multiselect
      v-model="option"
      :options="options"
      :multiple="true"
      :placeholder="placeholder"
      label="name"
      track-by="id"
      selected-label=""
      deselect-label="X"
      select-label=""
      :disabled="isDisabled"
      :limit="limitProp"
      :hide-selected="hideSelected"
      :close-on-select="autoClose"
      @input="emitStation()"
      @select="select"
      @remove="remove"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span slot="placeholder" class="placeholder">{{placeholder}}</span>
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
  name: 'multi-select-station',

  components: {
    Multiselect
  },

  props: {
    provinceIds: {},
    stationIds: {},
    autoClose: {
      default: true
    },
    hideSelected: {
      default: false
    },
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    placeholder: {
      default: 'Chọn kho'
    },
    reset: {
      default: false
    },
    listStation: {},
    isActive: {
      default: false
    },
    triggerDuplicateChange: {
      default: false
    }
  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
  },

  watch: {
    option (newValue, oldValue) {
      this.$emit('input', newValue)
    },

    stationIds: function (newValue, oldValue) {
      if (this.triggerDuplicateChange) {
        return
      }
      this.setList()
    },
    triggerDuplicateChange: function (newValue, oldValue) {
      this.$emit('handleTriggerDuplicateChange', newValue)
    },
    provinceIds: {
      immediate: true,
      handler: function (newValue, oldValue) {
        if (!this.listStation) this.getList(newValue)
        this.option = null
      }
    },
    reset () {
      this.option = null
    },

    listStation: {
      immediate: true,
      handler: function (newValue, oldValue) {
        this.getListById(newValue)
        this.option = null
      }
    }
  },

  methods: {
    select (option) {
      this.$emit('select', option)
    },

    remove (op) {
      this.$emit('remove', op)
    },

    emitStation () {
      this.$emit('handleStationSelected', this.option)
    },

    resetOption () {
      this.option = null
    },

    setList () {
      if (this.stationIds) {
        this.option = []
        this.stationIds.split(',').forEach(stationId => {
          let station = this.options.find(op => (('' + op.id) === stationId))
          if (station) this.option.push(station)
        })
      } else this.option = null
    },

    getList: function (provinceIds) {
      provinceIds = provinceIds && provinceIds.constructor === Array ? provinceIds.join() : provinceIds
      stationService.getAllStationByProvinceIds({ provinceIds: provinceIds, is_active: this.isActive })
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.triggerDuplicateChange = false
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getListById: function (stationIds) {
      stationIds = stationIds && stationIds.constructor === Array ? stationIds.join() : stationIds
      stationService.getAllStationByIds({ stationIds: stationIds, is_active: this.isActive })
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
