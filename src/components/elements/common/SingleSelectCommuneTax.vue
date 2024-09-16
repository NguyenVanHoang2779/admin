<template>
  <div class="mb-4">
    <multiselect
      v-model="option"
      :options="options"
      :disabled="isDisabled"
      placeholder="Chọn thị trấn/xã"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn thị trấn/xã</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import dependantPersonService from 'domain/services/dependant-person-service'

export default {
  name: 'single-select-commune-tax',

  components: {
    Multiselect
  },

  props: {
    districtCode: {
      default: null
    },
    communeCode: {
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
    districtCode: function (newId, oldId) {
      if (newId && parseInt(newId) !== parseInt(oldId)) {
        this.getListCommuneByDistrictCode(newId)
      } else if (!newId) {
        this.option = null
        this.options = []
      }
    },

    option: function (newOption, oldOption) {
      this.$emit('handleSelectedCommune', newOption)
    }
  },

  mounted () {
    if (this.districtCode) {
      setTimeout(() => this.getListCommuneByDistrictCode(this.districtCode), 2000)
    }
  },
  methods: {
    getListCommuneByDistrictCode (districtCode) {
      let params = {
        districtCode: districtCode
      }
      dependantPersonService.getListCommuneByDistrictCode(params).then(response => {
        if (response.data.success) {
          this.options = response.data.data
          if (this.communeCode && this.option === null) {
            this.option = this.options.find((option) => {
              return parseInt(option.code) === parseInt(this.communeCode)
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
