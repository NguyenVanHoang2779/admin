<template>
    <div class="w-100">
        <multiselect
                v-model="truckOption"
                :options="truckOptions"
                placeholder="Tìm kiếm theo biển số"
                track-by="id"
                selectedLabel="Đã chọn"
                deselectLabel="Bỏ chọn"
                selectLabel="Chọn"
                :custom-label="customLabel"
                :allow-empty="true"
                :searchable="true"
                :internal-search="false"
                :show-no-results="false"
                @search-change="search"
        >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
        </multiselect>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  name: 'singe-select-truck',

  props: {
    truckOrder: {
      default: ''
    },
    showInfo: {
      type: Boolean,
      default: false
    },
    listVehicles: {
      type: Array,
      default: () => []
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    truckOption: null,
    truckOptions: [],
    saveAllTruckOption: []
  }),

  created () {
    this.handleTruckOptions()
  },

  watch: {
    truckOption: function (newprofileOption, oldprofileOption) {
      this.$emit('handleChooseTruck', newprofileOption)
    },
    listVehicles: function () {
      this.handleTruckOptions()
    }
  },

  methods: {
    handleTruckOptions: function () {
      let self = this
      this.truckOptions = this.listVehicles
      this.saveAllTruckOption = this.listVehicles
      this.truckOption = this.truckOrder ? this.truckOptions.find((item) => item.order === self.truckOrder) : null
    },

    search: function (searchQuery) {
      let temp = this.saveAllTruckOption.filter((item) => (item.code.toLowerCase()).search(searchQuery) !== -1)
      if (temp.length > 0) {
        this.truckOptions = temp
      }
    },
    customLabel: function ({ code }) {
      return `${code}`
    }
  }
}
</script>
