<template>
  <multiselect
      placeholder="Chọn kỹ thuật xe"
      v-model="option"
      :options="options"
      label="text"
      track-by="value"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :searchable="true"
      :clear-on-select="false"
      :disabled="isDisabled"
  >
    <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
  </multiselect>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-truck-engineer',
  props: {
    engineerId: null,
    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Multiselect
  },

  mounted () {

  },

  data: () => ({
    option: null,
    options: []
  }),

  created () {
    this.getListTruckEngineer()
  },

  watch: {
    engineerId (v) {
      this.setSelectOption()
    },

    option (v) {
      this.$emit('handleChooseEngineer', v)
    }
  },
  methods: {
    getListTruckEngineer () {
      this.$startLoading()
      CompanyProfileService.getListTruckEngineer()
        .then((res) => {
          if (res.data.success) {
            this.options = res.data.data
            this.setSelectOption()
          } else {
            this.options = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    setSelectOption () {
      if (!this.engineerId) {
        this.option = null
      } else {
        if (this.options.length > 0) {
          this.option = this.options.find((item) => item.value === this.engineerId)
        } else this.option = null
      }
    }
  }
}
</script>

<style scoped>

</style>
