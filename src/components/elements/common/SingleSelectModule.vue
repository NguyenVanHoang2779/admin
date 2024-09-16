<template>
  <div :class="customClass || ''">
    <multiselect
      v-model="option"
      :options="options"
      :disabled="isDisabled"
      placeholder="Chọn module"
      label="name"
      track-by="name"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span class="placeholder" slot="placeholder">Chọn module</span>
    </multiselect>
  </div>
</template>

<script>
import staffService from 'domain/services/staff-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-module',

  components: {
    Multiselect
  },

  props: {
    stationId: {},
    moduleId: {},
    isDisabled: {
      type: Boolean
    },
    customClass: {
      default: 'mb-4'
    }
  },
  data: () => ({
    option: null,
    options: []
  }),

  created () {
    if (this.stationId) {
      this.getModuleByStation()
    }
  },

  watch: {
    option: function (newValue, oldValue) {
      this.$emit('handleSelectedModule', newValue)
    },

    stationId: function (newValue, oldValue) {
      if (newValue) {
        this.getModuleByStation()
      }
    },

    moduleId: function (newValue, oldValue) {
      if (newValue) {
        this.setSelectedOption()
      } else this.option = null
    }
  },

  methods: {
    getModuleByStation () {
      let data = {
        station_id: this.stationId
      }

      staffService.getModuleByStation(data)
        .then((response) => {
          if (response.data.success) {
            this.options = response.data.data
            if (this.moduleId) {
              this.setSelectedOption()
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    setSelectedOption () {
      if (this.options.length > 0 && this.moduleId) {
        this.option = this.options.find((option) => {
          return option.id === this.moduleId
        })
      }
    }
  }
}
</script>
