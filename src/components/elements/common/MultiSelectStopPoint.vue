<template>
  <div>
    <multiselect class="multiselect-primary"
     v-model="option"
     :options="options"
     :multiple="multiSelect"
     :placeholder="placeHoder"
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
import salaryService from 'domain/services/salary-service'

export default {
  name: 'multi-select-point',

  components: {
    Multiselect
  },

  props: {
    multiSelect: {
      default: true
    },
    placeHoder: {},
    provinceIds: {},
    isSelectAll: {
      default: 1
    },
    pointIds: {},
    autoClose: {},
    hideSelected: {},
    limitProp: {
      default: 5
    },
    isDisabled: {
      default: false
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
      this.$emit('handleStopPointSelected', newValue)
    },

    options: function (newVale, oldValue) {
      this.$emit('allStopPointsGot', newVale)
    },

    provinceIds: function (newValue, oldValue) {
      if (newValue === null) {
        this.getList()
      } else if (newValue) {
        this.getList(newValue)
        this.option = null
      }
    },

    pointIds: function (newVal, oldVal) {
      if (this.options !== undefined && this.options.length > 0) {
        this.setList()
      }
    }
  },

  methods: {
    setList () {
      if (this.pointIds) {
        this.option = []
        this.pointIds.split(',').forEach(pointId => {
          this.option.push(this.options.find(op => (('' + op.id) === pointId)))
        })
      } else {
        this.option = null
      }
    },

    getList: function (provinceIds) {
      let params = {
        'provinceIds': provinceIds
      }

      salaryService.getListStopPointByProvince(params)
        .then((res) => {
          if (res.data.success) {
            // for (let point in res.data.data) {
            // }
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
