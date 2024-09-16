<template>
  <multiselect
          v-model="selectedWhStaffs"
          :options="whStaffs"
          :multiple="multiple"
          :disabled="disabled"
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
import Multiselect from 'vue-multiselect'
import staffService from 'domain/services/staff-service'

export default {
  name: 'select-wh-staffs',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Chọn phụ kho'
    },
    stationId: {

    }
  },
  components: {
    Multiselect,
    staffService
  },
  data: () => ({
    whStaffs: [],
    selectedWhStaffs: []
  }),
  watch: {
    stationId: function (newValue, oldValue) {
      this.getOptions(newValue)
    }
  },
  methods: {
    getOptions: function (selectedStation) {
      let dataSend = {
        station_id: selectedStation
      }
      staffService.getListWhStaffByStationId(dataSend).then(response => {
        if (response.data.success) {
          this.whStaffs = response.data.data

          if (!this.multiple) {
            this.stations.unshift({
              id: '',
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
        if (this.selectedWhStaffs.length > 0) {
          for (let i = 0; i < this.selectedWhStaffs.length; i++) {
            data.push(this.selectedWhStaffs[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedWhStaffs = selectedOptions.id
        this.$emit('selected', this.selectedWhStaffs)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedWhStaffs.length; i++) {
          if (this.selectedWhStaffs[i].id !== removeOptions.id) {
            data.push(this.selectedWhStaffs[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedWhStaffs = this.multiple ? [] : ''
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>

</style>
