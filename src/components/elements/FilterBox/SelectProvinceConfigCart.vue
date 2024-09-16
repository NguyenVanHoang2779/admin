<template>
  <multiselect
          v-model="selectedProvinces"
          :options="optionProvince"
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
// import ManageLineService from 'domain/services/manage-line-service'
export default {
  name: 'select-province',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Chọn tỉnh'
    },
    province: {
      type: Object
    },
    provinces: {
      type: Array
    }
  },
  watch: {
    provinces: {
      immediate: true,
      handler: function (newValue) {
        this.optionProvince = newValue
      },
      deep: true
    },
    province: function (newValue) {
      this.selectedProvinces = newValue
    }
  },
  components: {
    Multiselect
  },
  data () {
    return {
      type: 0,
      optionProvince: [],
      selectedProvinces: this.province || null
    }
  },
  methods: {
    onSelect: function (selectedOptions) {
      if (this.multiple) {
        let data = []
        if (this.selectedProvinces.length > 0) {
          for (let i = 0; i < this.selectedProvinces.length; i++) {
            data.push(this.selectedProvinces[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedProvinces = {id: selectedOptions.id, name: selectedOptions.name}
        this.$emit('selected', this.selectedProvinces)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedProvinces.length; i++) {
          if (this.selectedProvinces[i].id !== removeOptions.id) {
            data.push(this.selectedProvinces[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedProvinces = this.multiple ? [] : {}
      this.$emit('selected', this.selectedProvinces)
    }
  }
}
</script>

<style scoped>
  .multiselect--active {
    z-index: 99;
  }
</style>
