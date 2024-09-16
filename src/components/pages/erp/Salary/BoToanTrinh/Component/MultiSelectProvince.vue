<template>
  <div>
    <multiselect class="multiselect-primary"
                 v-model="provinceOption"
                 :options="provinceOptions"
                 :multiple="true"
                 :limit="limit"
                 :placeholder="placeholder"
                 label="name"
                 track-by="id"
                 selectedLabel=""
                 deselect-label="X"
                 selectLabel=""
                 :close-on-select="autoClose"
                 :hide-selected="hideSelect"
                 :disabled="isDisabled"
                 @input="handleInput(provinceOption)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span slot="placeholder" class="placeholder">{{placeholder}}</span>
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
    limit: {
      default: 5
    },
    provinceIds: {},
    autoClose: {
      default: false
    },
    hideSelect: {
      default: false
    },
    displayAll: {
      default: false
    },
    isDisabled: {
      default: false
    },
    placeholder: {
      default: 'Chọn tỉnh'
    },
    preLoad: {
      default: true
    },
    region: {
      type: String,
      default: null
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    provinceOption: null,
    provinceOptions: []
  }),

  created () {
    if (this.preLoad) this.getListProvince()
  },

  watch: {
    provinceIds: function (newValue, oldValue) {
      this.setList()
    },

    provinceOption: function (newValue, oldValue) {
      if (!this.displayAll) {
        this.$emit('handleProvinceSelected', newValue)
      } else {
        let hasAll = (newValue && newValue.id === -1) || (newValue && newValue.length > 1 && newValue.findIndex((x) => x.id === -1) !== -1)
        if (hasAll === true) {
          let listProvince = (this.provinceOption && this.provinceOption !== '') ? this.provinceOption.filter((x) => !isNaN(x.id)) : ''
          this.$emit('handleProvinceSelected', listProvince)
        } else {
          this.$emit('handleProvinceSelected', newValue)
        }
      }
    },

    region (oldval, newVal) {
      this.getListProvince()
    }
  },

  methods: {
    setList () {
      if (this.provinceIds) {
        this.provinceOption = []
        let listProvince = this.provinceIds.split(',')
        let hasAll = true
        for (const region of ['MN', 'MB', 'MT', 'HN', 'HCM']) {
          if (!listProvince.includes(region)) hasAll = false
        }
        if (hasAll) {
          this.provinceOption = []
          this.provinceOption.push({id: -1, name: 'Toàn quốc'})
          return
        }
        listProvince.forEach(provinceId => {
          let op = this.provinceOptions.find(op => ('' + op.id === '' + provinceId))
          if (op) this.provinceOption.push(op)
        })
        return
      }

      if (!this.displayAll && !this.provinceIds) this.provinceOption = null
    },

    getAllProvince: function () {
      let region = [
        {id: -1, name: 'Toàn quốc'},
        {id: 'MB', name: 'Miền bắc'},
        {id: 'MN', name: 'Miền Nam'},
        {id: 'MT', name: 'Miền Trung'},
        {id: 'HCM', name: 'TP. Hồ Chí Minh'},
        {id: 'HN', name: 'TP. Hà Nội'}
      ]
      if (sessionStorage.getItem('allProvinces')) {
        let listProvince = JSON.parse(sessionStorage.getItem('allProvinces'))
        if (!this.displayAll) {
          this.provinceOptions = listProvince
        } else {
          this.provinceOptions = [...region, ...listProvince]
        }
        this.setList()
        return
      }
      SalaryService.getListProvince()
        .then((res) => {
          if (res.data.success) {
            if (!this.displayAll) {
              this.provinceOptions = res.data.data
              sessionStorage.setItem('allProvinces', JSON.stringify(this.provinceOptions))
            } else {
              this.provinceOptions = [...region, ...res.data.data]
            }
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getProvinceByRegion () {
      addressService.getProvincesByRegionHr({ region: this.region })
        .then(res => {
          if (res.data.success) {
            this.provinceOptions = res.data.data
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getListProvince () {
      if (!this.region) this.getAllProvince()
      else this.getProvinceByRegion()
    },

    handleInput: function (provinceOption) {
      if (!this.displayAll) {
        this.$emit('input', provinceOption)
        return
      }
      let hasAll = provinceOption == null || provinceOption.length === 0 || provinceOption.findIndex((x) => x.id === -1) === (provinceOption.length - 1)
      if (hasAll) {
        this.provinceOption = [{id: -1, name: 'Toàn quốc'}]
      } else {
        let allProvince = provinceOption.filter((x) => x.id !== -1)
        this.provinceOption = allProvince
      }
    }
  }
}
</script>
