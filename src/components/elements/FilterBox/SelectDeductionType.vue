<template>
    <multiselect
            v-model="selectedDdType"
            :options="ddTypes"
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
  name: 'select-dd-type',
  props: {
    placeholder: {
      type: String,
      default: 'Chọn gói chiết khấu'
    }
  },
  components: {
    Multiselect
  },
  data: () => ({
    ddTypes: [],
    selectedDdType: ''
  }),
  methods: {
    getOptions: function () {
      axios.get(config.baseApiUrl + 'new-deduction/getDeductionType').then(response => {
        if (response.data.success) {
          this.ddTypes = response.data.data.options.ddTypes
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    onSelect: function (selectedOptions) {
      this.selectedDdType = selectedOptions.code
      this.$emit('selected', this.selectedDdType)
    },
    onRemove: function () {
      this.$emit('selected', '')
    },
    reset: function () {
      this.selectedDdType = ''
      this.$emit('selected', this.selectedDdType.code)
    }
  },
  created () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>
