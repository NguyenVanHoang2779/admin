<template>
  <multiselect
    v-model="optionRc"
    :options="optionsRc"
    placeholder="Chọn mã xe RC"
    :searchable="true"
    deselectLabel="Bỏ chọn"
    selectLabel="Chọn"
    selectedLabel="Đã chọn"
    track-by="name"
    label="name"
    :multiple="multiple"
    :disabled="isDisabled"
    :loading="asyncLoading"
    :custom-label="customLabel"
    @search-change="asyncFind"
  >
    <span slot="noResult">Rất tiếc không tìm thấy</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import AssetService from 'domain/services/asset-service'
import debounce from 'debounce'

export default {
  name: 'multi-select-rc-code',
  components: {
    Multiselect,
    AssetService,
    debounce
  },

  props: [
    'rcCode', 'multiple', 'optionsRc', 'isDisabled', 'stationId', 'isRentInfo', 'lstRcCodes'
  ],

  mounted () {
    this.optionRc = this.optionsRc.find((item) => item.name === this.rcCode)
  },

  watch: {
    rcCode (newValue, oldValue) {
      this.optionRc = this.optionsRc.find((item) => item.name === newValue)
    },

    optionRc (newValue, oldValue) {
      this.$emit('handleChooseRcCode', newValue, oldValue)
    },

    optionsRc (newValue) {
      if (newValue) {
        this.optionRc = this.optionsRc.find((item) => item.name === this.rcCode)
      }
    }
  },

  data: () => ({
    optionRc: null,
    asyncFound: [],
    asyncLoading: false,
    asyncTimeout: null,
    message: 'Nhập ít nhất 2 ký tự'
  }),

  created () {

  },

  methods: {
    customLabel ({name, asset}) {
      return asset ? `${name} - ${asset}` : `${name}`
    },
    asyncFind: debounce(function (query) {
      if (query.length < 14) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 14 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      let params = {
        asset_id: 1089,
        code_search: query || '',
        station_id: this.stationId || '',
        is_truck_rent: this.isRentInfo ? 1 : 0,
        count: 0
      }
      AssetService.getByIdentifierCode(params).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let checkDuplicate = false
            this.optionRc = response.data.data
            if (this.optionRc) {
              for (let lstRc of this.optionsRc) {
                if (lstRc.name === this.optionRc.name) {
                  checkDuplicate = true
                }
              }
            }
            if (!checkDuplicate) {
              this.optionsRc.push({key: this.optionsRc.length, name: this.optionRc.name})
            }
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500)
  }
}
</script>

<style scoped>

</style>
