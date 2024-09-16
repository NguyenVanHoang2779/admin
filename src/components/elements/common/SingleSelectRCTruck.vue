<template>
  <div class="w-100">
    <multiselect
      v-model="rcCodeOption"
      :options="rcCodeOptions"
      placeholder="Tìm kiếm theo mã xe RC"
      track-by="code"
      selectedLabel="Đã chọn"
      deselectLabel="Bỏ chọn"
      selectLabel="Chọn"
      :disabled="disabled"
      :custom-label="customLabel"
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
import AssetService from 'domain/services/asset-service'
import Multiselect from 'vue-multiselect'

export default {
  name: 'single-select-RC-truck',

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    assetCode: {
      default: ''
    },
    showInfo: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Multiselect
  },

  data: () => ({
    rcCodeOption: null,
    rcCodeOptions: [],
    saveAllRcCodeOption: [],
    masterInfo: []
  }),

  created () {
    this.getRcCodeList()
  },

  watch: {
    rcCodeOption: function (newrcCodeOption, oldrcCodeOption) {
      this.$emit('handleChooseRcCodeList', newrcCodeOption)
    },
    assetCode: function () {
      this.rcCodeOption = this.assetCode ? this.rcCodeOptions.find((item) => item.code === this.assetCode) : null
    }
  },

  methods: {
    getRcCodeList: function () {
      AssetService.getRcCode()
        .then((res) => {
          if (res.data.success) {
            this.rcCodeOptions = res.data.data
            this.saveAllRcCodeOption = res.data.data
            this.rcCodeOption = this.assetCode ? this.rcCodeOptions.find((item) => item.code === this.assetCode) : null
          }
        })
        .catch((e) => {
          console.log('where error: handleChooseObjectType')
        }).then(() => {
          this.$stopLoading()
        })
    },

    search: function (searchQuery) {
      let temp = this.saveAllRcCodeOption.filter((item) => (item.code).search(searchQuery) !== -1)
      if (temp.length > 0) {
        this.rcCodeOptions = temp
      }
    },
    customLabel: function ({ code }) {
      return `${code}`
    }
  }
}
</script>
