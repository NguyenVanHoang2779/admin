<template>
  <multiselect
    v-model="selectedPickAddress"
    :options="pickAddress"
    :multiple="true"
    placeholder="Chọn shop lấy hàng"
    track-by="id"
    label="name"
    open-direction="bottom"
    :searchable="true"
    :loading="isLoading"
    :show-no-results="true"
    :hide-selected="true"
    @search-change="asyncFind"
    @select="onSelect"
    @remove="onRemove"
  >
    <span slot="noResult">Không tìm thấy kết quả</span>
    <span slot="noOptions">Nhập ít nhất 3 kí tự với mã shop</span>
  </multiselect>

</template>

<script>
import ManageLineService from '../../../domain/services/manage-line-service'
import Multiselect from 'vue-multiselect'
import debounce from 'debounce'
import * as _ from 'lodash'

export default {
  components: {Multiselect},
  data () {
    return {
      selectedPickAddress: [],
      pickAddress: [],
      isLoading: false
    }
  },
  props: {
    districtIds: {
      type: Array,
      required: true
    },
    value: {
      type: Array
    },
    pickAddressBigData: {
      type: Array
    },
    pickAddressSearch: {
      type: Array
    }
  },
  computed: {
    addressSearch: {
      get () {
        return this.pickAddressSearch
      },
      set (val) {
        this.$emit('updatePickAddressSearch', val)
      }
    },
    addressBigData: {
      get () {
        return this.pickAddressBigData
      },
      set (val) {
        this.$emit('updatePickAddressBigData', val)
      }
    }
  },
  mounted () {
    if (this.pickAddressBigData.length > 0) {
      this.selectedPickAddress.push(...this.pickAddressBigData)
    }
    if (this.pickAddressSearch.length > 0) {
      this.selectedPickAddress.push(...this.pickAddressSearch)
    }
  },
  watch: {
    selectedPickAddress () {
      this.$emit('input', _.map(this.selectedPickAddress, 'id'))
    },
    pickAddressBigData () {
      // Giữ lại pick_address search manual
      this.selectedPickAddress = []
      this.selectedPickAddress.push(...this.addressSearch, ...this.pickAddressBigData)
    }
  },
  methods: {
    onSelect: function (selectedOptions) {
      this.addressSearch.push(selectedOptions)
    },
    onRemove: function (removeOptions) {
      this.addressSearch = this.addressSearch.filter((selected) => {
        return selected.id !== removeOptions.id
      })
      this.addressBigData = this.addressBigData.filter((selected) => {
        return selected.id !== removeOptions.id
      })
    },
    asyncFind: debounce(function (query) {
      if (query.length < 3) {
        return
      }
      this.isLoading = true
      const params = {
        shop_code: query,
        district_ids: _.map(this.districtIds, 'address_id')
      }
      ManageLineService.searchPickAddress(params).then(response => {
        if (response.data.success) {
          this.pickAddress = response.data.data
        }
      }).catch((error) => {
        console.log(error)
      }).then(() => {
        this.isLoading = false
      })
    }, 400)
  }
}
</script>
