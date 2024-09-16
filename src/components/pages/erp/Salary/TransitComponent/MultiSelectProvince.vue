<template>
  <div>
    <multiselect class="multiselect-primary"
     v-model="provinceOption"
     :options="provinceOptions"
     :multiple="multiSelect"
     :limit="limit"
     placeholder="Chọn tỉnh"
     label="name"
     track-by="name"
     selectedLabel="Đã chọn"
     deselectLabel="Nhấn để bỏ chọn tỉnh"
     selectLabel=""
     :close-on-select="autoClosed"
     :hide-selected="hideSelect"
     :disabled="isDisabled"
     @input="handleInput(provinceOption)"
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
import addressService from 'domain/services/address-service'
import SalaryService from 'domain/services/salary-service'

export default {
  name: 'multi-select-province',

  props: {
    limitProp: {},
    provinceIds: {},
    autoClose: {},
    multiSelect: {
      default: true
    },
    hideSelected: {},
    displayAll: {},
    isDisabled: {
      default: false
    },
    region: {}
  },

  components: {
    Multiselect
  },

  data: () => ({
    provinceOption: null,
    hideSelect: false,
    provinceOptions: [],
    autoClosed: true,
    limit: 5
  }),

  created () {
    this.getAllProvince()
    if (this.limitProp) this.limit = this.limitProp
    if (this.autoClose !== undefined && this.autoClose !== null) this.autoClosed = this.autoClose
    if (this.hideSelected !== undefined && this.hideSelected !== null) this.hideSelect = this.hideSelected
    if (this.isDisable !== undefined && this.isDisable !== null) this.disabled = this.isDisable
  },

  watch: {

    hideSelected: function (newVal, oldVal) {
      this.hideSelect = this.hideSelected
    },

    autoClose: function (newVal, oldVal) {
      this.autoClosed = this.autoClose
    },

    provinceOption: function (newValue, oldValue) {
      if (this.displayAll) {
        this.$emit('handleProvinceSelected', newValue)
      } else {
        let hasAll = (newValue && newValue.id === -1) || (newValue && newValue.length > 1 && newValue.findIndex((x) => x.id === -1) !== -1)
        if (hasAll === true) {
          this.$emit('handleProvinceSelected', this.provinceOptions)
        } else {
          this.$emit('handleProvinceSelected', newValue)
        }
      }
    },

    limitProp: function (newValue, oldValue) {
      this.limit = newValue
    },

    provinceIds: function (newVal, oldVal) {
      if (!newVal) {
        this.provinceOption = null
        return
      }
      if (this.provinceOptions && this.provinceOptions.length > 0) {
        this.setList()
      }
    },

    region: function (newVal, oldVal) {
      if (newVal === 'HN') {
        this.provinceOptions = [{id: 1, 'name': 'Hà Nội City'}]
        return 1
      }
      if (newVal === 'HCM') {
        this.provinceOptions = [{id: 126, 'name': 'Hồ Chí Minh City'}]
        return 1
      }
      SalaryService.getListIdsProvinceByRegion({'region': this.region}).then(res => {
        if (res.data.success) {
          this.provinceOption = null
          this.provinceOptions = res.data.data
        }
      }).catch(() => {
      })
    }
  },

  methods: {
    setList () {
      if (this.provinceIds) {
        this.provinceOption = []
        this.provinceIds.split(',').forEach(provinceId => {
          this.provinceOption.push(this.provinceOptions.find(op => (('' + op.id) === provinceId)))
        })
      }
    },

    getAllProvince: function () {
      addressService.getAllProvince()
        .then((res) => {
          if (res.data.success) {
            if (this.displayAll) {
              this.provinceOptions = res.data.data
              this.setList()
            } else {
              this.provinceOptions = [{id: -1, name: 'Toàn quốc'}, ...res.data.data]
              this.provinceOption = this.provinceOptions[0]
              this.setList()
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    handleInput: function (provinceOption) {
      if (this.displayAll) return
      let all = provinceOption.findIndex((x) => x.id === -1) === provinceOption.length - 1
      if (all) {
        this.provinceOption = {id: -1, name: 'Toàn quốc'}
      } else {
        let allProvince = provinceOption.filter((x) => x.id !== -1)
        this.provinceOption = allProvince
      }
    }
  }
}
</script>
