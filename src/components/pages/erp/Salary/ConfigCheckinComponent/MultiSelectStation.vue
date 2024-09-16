<template>
  <div>
    <multiselect class="multiselect-primary"
     v-model="option"
     :options="options"
     :multiple="isMultiple"
     placeholder="Chọn kho"
     label="name"
     track-by="name"
     selectedLabel="Đã chọn"
     deselectLabel="Bỏ chọn"
     selectLabel="Chọn"
     :disabled="isDisabled"
     :limit="limitProp"
     :hide-selected="hideSelect"
     :close-on-select="autoClosed"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
    </multiselect>
  </div>
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
    isSelectAll: {
      default: 1
    },
    stationIds: {},
    autoClose: {},
    hideSelected: {},
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
    },
    isMultiple: {
      default: true
    }
  },

  data: () => ({
    autoClosed: true,
    hideSelect: false,
    option: null,
    options: []
  }),

  created () {
    if (this.autoClose !== undefined && this.autoClose !== null) this.autoClosed = this.autoClose
    if (this.hideSelected !== undefined && this.hideSelected !== null) this.hideSelect = this.hideSelected
    this.getList()
  },

  watch: {
    hideSelected: function (newVal, oldVal) {
      this.hideSelect = this.hideSelected
    },

    isSelectAll: function (newval, oldVal) {
      if (this.isSelectAll === 2) {
        this.option = []
        this.option = this.options.filter(element => element.id)
      }
      if (this.isSelectAll === 3) {
        this.option = null
      }
    },

    autoClose: function (newVal, oldVal) {
      this.autoClosed = this.autoClose
    },

    option: function (newValue, oldValue) {
      this.$emit('handleStationSelected', newValue)
    },

    options: function (newVale, oldValue) {
      this.$emit('allStationsGot', newVale)
    },

    provinceIds: function (newValue, oldValue) {
      if (newValue === null) {
        this.getList()
      } else if (newValue) {
        this.getList(newValue)
        this.option = null
      }
    },

    stationIds: function (newVal, oldVal) {
      if (this.options !== undefined && this.options.length > 0) {
        this.setList()
      }
    }
  },

  methods: {
    setList () {
      if (this.stationIds && String(this.stationIds).length > 0) {
        this.option = []
        this.stationIds.split(',').forEach(stationId => {
          this.option.push(this.options.find(op => (('' + op.id) === stationId)))
        })
      } else {
        this.option = null
      }
    },

    getList: function (provinceIds) {
      let params = {
        'provinceIds': provinceIds
      }

      stationService.getAllStationByProvinceIds(params)
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
