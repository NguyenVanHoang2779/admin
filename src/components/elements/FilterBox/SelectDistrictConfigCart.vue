<template>
  <multiselect
          v-model="selectedDistricts"
          :options="provinces"
          :multiple="multiple"
          :placeholder="placeholder"
          track-by="id"
          label="name"
          selectLabel=""
          selectedLabel=""
          deselectLabel="x"
          @select="onSelect"
          @remove="onRemove"
  />
</template>

<script>
import Multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
import * as _ from 'lodash'
export default {
  name: 'select-district',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Chọn quận/huyện'
    },
    provinceId: {
      type: Object
    },
    district: {
      type: Object
    }
  },
  watch: {
    provinceId: function (newValue, oldValue) {
      this.provinces = []
      this.reset()
      this.getOptions()
    },
    district: function (newValue) {
      this.selectedDistricts = newValue
    }
  },
  components: {
    Multiselect
  },
  data () {
    return {
      // districtDefault: this.district && this.district.id ? this.district : null,
      provinces: [],
      type: 3,
      selectedDistricts: this.district || null,
      selectId: ''
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    getOptions: function () {
      if (!_.isEmpty(this.provinceId)) {
        this.selectId = this.provinceId.id
      }
      let dataSend = {
        type: this.type,
        parent_id: this.selectId
      }
      ManageLineService.getDistrict(dataSend).then(response => {
        if (response.data.success) {
          this.provinces = response.data.data

          if (!this.multiple) {
            this.provinces.unshift({
              code: '',
              name: this.placeholder
            })
          }
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedDistricts.length > 0) {
          for (let i = 0; i < this.selectedDistricts.length; i++) {
            data.push(this.selectedDistricts[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedDistricts = {id: selectedOptions.id, name: selectedOptions.name}
        this.$emit('selected', this.selectedDistricts)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedDistricts.length; i++) {
          if (this.selectedDistricts[i].id !== removeOptions.id) {
            data.push(this.selectedDistricts[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedDistricts = this.multiple ? [] : {}
      this.$emit('selected', this.selectedDistricts)
    }
  }
}
</script>

<style scoped>
  .multiselect--active {
    z-index: 99;
  }
</style>
