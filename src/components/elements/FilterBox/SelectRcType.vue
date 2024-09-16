<template>
    <multiselect
            v-model="selectedRCType"
            :options="rcTypes"
            :multiple="false"
            :placeholder="placeholder"
            track-by="name"
            label="name"
            selectLabel=""
            selectedLabel=""
            deselectLabel="x"
            @select="onSelect"
            @remove="onRemove"
    />
</template>

<script>
import config from 'config/app.base'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
export default {
  name: 'select-rc-type',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn gói cam kết hoàn'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    rcTypes: [],
    selectedRCType: ''
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'shops/getReturnCouponType').then(response => {
        if (response.data.success) {
          this.rcTypes = response.data.data.options.rcTypes
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelect: function (selectedOptions) {
      this.selectedRCType = selectedOptions.code
      this.$emit('selected', this.selectedRCType)
    },
    onRemove: function () {
      this.$emit('selected', '')
    },
    reset: function () {
      this.selectedRCType = ''
      this.$emit('selected', this.selectedRCType.code)
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
