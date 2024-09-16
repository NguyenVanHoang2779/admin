<template>
  <div class="mb-4">
    <multiselect
      v-model="option"
      :options="options"
      :disabled="isDisabled"
      placeholder="Chọn quận/huyện"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn quận/huyện</span>
    </multiselect>
  </div>
</template>

<script>
import dependantPersonService from 'domain/services/dependant-person-service'
import Multiselect from 'vue-multiselect'
export default {
  name: 'single-select-district-tax',

  components: {
    Multiselect
  },

  props: {
    districtCode: {
      default: null
    },
    provinceCode: {
      default: null
    },
    isDisabled: {
      type: Boolean
    },
    state: Boolean
  },

  data () {
    return {
      option: null,
      options: []
    }
  },

  watch: {
    provinceCode: function (newId, oldId) {
      this.option = null
      if (newId && parseInt(newId) !== parseInt(oldId)) {
        this.getListDistrictByProvinceCode(newId)
      } else if (!newId) {
        this.options = []
      }
    },

    option: function (newOption, oldOption) {
      this.$emit('handleSelectedDistrict', newOption)
    }
  },

  mounted () {
    if (this.provinceCode) {
      this.getListDistrictByProvinceCode(this.provinceCode)
    }
  },

  methods: {
    getListDistrictByProvinceCode (provinceCode) {
      let params = {
        prvCode: provinceCode
      }
      dependantPersonService.getListDistrictByProvinceCode(params).then(response => {
        if (response.data.success) {
          this.options = response.data.data
          if (this.districtCode && this.option === null) {
            this.option = this.options.find((option) => {
              return parseInt(option.code) === parseInt(this.districtCode)
            })
          }
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
