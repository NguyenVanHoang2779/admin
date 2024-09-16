<template>
  <multiselect
          v-model="selectedModules"
          :options="modules"
          :multiple="multiple"
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
import * as _ from 'lodash'
import Multiselect from 'vue-multiselect'
import ManageLineService from 'domain/services/manage-line-service'
export default {
  name: 'select-module',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Nhập tên module. Lưu ý Module phải ở trong Kho đã chọn'
    },
    stations: {
      type: Array
    },
    stationId: {
      type: String
    }
  },
  components: {
    Multiselect
  },
  watch: {
    stations: function (newValue, oldValue) {
      this.getOptions()
    },
    stationId: function (newValue, oldValue) {
      this.getOptions()
    }
  },
  created () {
    this.getOptions()
  },
  data: () => ({
    modules: [],
    selectedModules: []
  }),
  methods: {
    getOptions: function () {
      let dataSend = {
        station_id: _.isEmpty(this.stations) ? [this.stationId] : this.stations
      }
      ManageLineService.getModule(dataSend).then(response => {
        if (response.data.success) {
          this.modules = response.data.data

          if (!this.multiple) {
            this.modules.unshift({
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
        if (this.selectedModules.length > 0) {
          for (let i = 0; i < this.selectedModules.length; i++) {
            data.push(this.selectedModules[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedModules = selectedOptions.id
        this.$emit('selected', this.selectedModules)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedModules.length; i++) {
          if (this.selectedModules[i].id !== removeOptions.id) {
            data.push(this.selectedModules[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedModules = this.multiple ? [] : ''
      this.$emit('selected', this.selectedModules)
    }
  }
}
</script>

<style scoped>

</style>
