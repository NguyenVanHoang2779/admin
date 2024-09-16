<template>
  <multiselect
          v-model="selectedStaffs"
          :options="staffs"
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
  name: 'select-leader-by-station',
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
      default: 'Chọn Điều Phối / Trưởng Module'
    },
    stationId: {

    }
  },
  components: {
    Multiselect,
    staffService
  },
  data: () => ({
    staffs: [],
    selectedStaffs: []
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
      staffService.getLeaderByStation(dataSend).then(response => {
        if (response.data.success) {
          this.staffs = response.data.data

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
        if (this.selectedStaffs.length > 0) {
          for (let i = 0; i < this.selectedStaffs.length; i++) {
            data.push(this.selectedStaffs[i].id)
          }
        }
        data.push(selectedOptions.id)
        this.$emit('selected', data)
      } else {
        this.selectedStaffs = selectedOptions.id
        this.$emit('selected', this.selectedStaffs)
      }
    },
    onRemove: function (removeOptions) {
      let data = []
      if (this.multiple) {
        for (let i = 0; i < this.selectedStaffs.length; i++) {
          if (this.selectedStaffs[i].id !== removeOptions.id) {
            data.push(this.selectedStaffs[i].id)
          }
        }
        this.$emit('selected', data)
      }
    },
    reset: function () {
      this.selectedStaffs = this.multiple ? [] : ''
    }
  },
  created () {
    this.getOptions() // Get option filters
  }
}
</script>

<style scoped>

</style>
