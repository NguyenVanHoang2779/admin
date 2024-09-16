<template>
  <div class="w-100">
    <multiselect
      v-model="truckDriverOption"
      :options="truckDriverOptions"
      placeholder="Tìm kiếm theo tên tài xế"
      track-by="username"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :disabled="disabled"
      :custom-label="customLabel"
      :allow-empty="empty"
      :multiple="multiple"
      :searchable="true"
      :max="maxSelected"
      :internal-search="false"
      :show-no-results="false"
      @search-change="search"
      @input="op => $emit('input', op)"
    >
      <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
      <span slot="maxElements">{{maxSelectedMessage}}</span>
    </multiselect>
  </div>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'multi-select-driver-truck-order',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    truckDrivers: {
      default: ''
    },
    truckOrder: {
      default: 0
    },
    empty: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    maxSelected: {
      default: 2
    },
    maxSelectedMessage: {
      type: String,
      default: 'Không thể chọn thêm! vui lòng bỏ chọn 1 lựa chọn nếu muốn chọn thêm'
    },
    truckId: {
      default: null
    }
  },
  components: {
    Multiselect
  },

  data: () => ({
    truckDriverOption: null,
    truckDriverOptions: [],
    saveAllTruckDriverOption: []
  }),

  created () {
  },

  watch: {
    truckDrivers: function (newVal, oldVal) {
      if (this.truckDriverOptions && this.truckDriverOptions.length > 0) {
        this.setList()
      }
    },
    truckId: {
      immediate: true,
      handler: function (newValue) {
        if (newValue) {
          this.getDriverByTruckCode(newValue)
        }
      }
    }
  },
  methods: {
    setList: function () {
      if (this.truckDrivers) {
        this.truckDriverOption = []
        this.truckDrivers.split(',').forEach(truckDriverId => {
          let option = this.truckDriverOptions.find(op => (('' + op.id) === truckDriverId))
          if (option) this.truckDriverOption.push(option)
        })
        this.$emit('input', this.truckDriverOption)
      } else this.truckDriverOption = null
    },

    getDriverByTruckCode: function () {
      let dataSend = {
        truck_id: this.truckId
      }
      CompanyProfileService.getDriverByTruckCode(dataSend)
        .then((res) => {
          if (res.data.success) {
            this.truckDriverOptions = res.data.data
            this.saveAllTruckDriverOption = res.data.data
            this.setList()
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },

    search: function (searchQuery) {
      let temp = this.saveAllTruckDriverOption.filter((item) => (item.username).search(searchQuery) !== -1)

      if (temp.length > 0) {
        this.truckDriverOptions = temp
      }
    },
    customLabel: function ({ code, username }) {
      return code ? `${username} - đang gán với xe ${code}` : `${username}`
    }
  }
}
</script>

<style scoped>

</style>
