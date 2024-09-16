<template>
    <div>
      <b-form-row>
        <b-form-group class="col-md-12" label="Tỉnh/thành phố">
          <multi-select
            v-model="selectedProvinces"
            class="multiselect-success"
            track-by="name"
            label="name"
            placeholder="Chọn tỉnh/thành phố"
            open-direction="bottom"
            :options="listProvinces"
            :multiple="true"
            :searchable="true"
            selectLabel="x"
            selectedLabel="Đang chọn"
            deselectLabel=""
            :allow-empty="true"
            group-values="detail"
            group-label="region"
            name="selected-provinces"
            @select="onSelectProvince"
            @remove="onRemoveProvince"
          />
        </b-form-group>
      </b-form-row>

      <b-form-row>
        <b-form-group class="col-md-12" label="Quận/huyện">
          <multi-select
            v-model="selectedDistricts"
            class="multiselect-success"
            track-by="name"
            label="name"
            placeholder="Chọn quận/huyện"
            open-direction="bottom"
            :options="listDistricts"
            :multiple="true"
            :searchable="true"
            selectLabel="x"
            selectedLabel="Đang chọn"
            deselectLabel=""
            :allow-empty="true"
            name="selected-districts"
            @select="onSelectDistrict"
            @remove="onRemoveDistrict"
          />
        </b-form-group>
      </b-form-row>

      <b-form-row>
        <b-form-group class="col-md-12" label="Phường xã/Đường phố">
          <multi-select
            v-model="selectedWardsStreets"
            class="multiselect-success"
            track-by="name"
            label="name"
            placeholder="Chọn phường/xã"
            open-direction="bottom"
            :options="listWardsStreets"
            :multiple="true"
            :searchable="true"
            selectLabel="x"
            selectedLabel="Đang chọn"
            deselectLabel=""
            :allow-empty="true"
            name="selected-districts"
            @select="onSelectWardStreet"
            @remove="onRemoveWardStreet"
          />
        </b-form-group>
      </b-form-row>

      <b-form-row>
        <b-form-group class="col-md-12" label="Thôn ấp, đường phố, trường học...">
          <multi-select
            v-model="selectedHamlets"
            class="multiselect-success"
            label="FullName"
            track-by="FullName"
            placeholder="Gõ để tìm địa chỉ chi tiết (Lọc theo điều kiện này sẽ không tính các điều kiện địa chỉ khác)"
            open-direction="bottom"
            :options="listHamletAddresses"
            :multiple="true"
            :searchable="true"
            :loading="isLoading"
            :internal-search="false"
            :clear-on-select="true"
            :close-on-select="true"
            :options-limit="300"
            :limit="3"
            :max-height="600"
            :show-no-results="false"
            :hide-selected="false"
            :selectedLabel="``"
            :tagPlaceholder="``"
            :selectLabel="``"
            :deselectLabel="`X`"
            @search-change="asyncFind"
            @select="onSelectHamlet"
            @remove="onRemoveHamlet"
          >
          </multi-select>
        </b-form-group>
      </b-form-row>
    </div>
</template>

<script>

import Multiselect from 'vue-multiselect'
import areasService from 'domain/services/areas-service'
import debounce from 'debounce'

export default {
  name: 'selected-addresses',
  props: {
    selected_addresses: null
  },

  components: {
    'multi-select': Multiselect,
    debounce
  },
  data: () => ({
    listProvinces: [],
    listDistricts: [],
    listWardsStreets: [],
    listHamletAddresses: [],
    listProvinceIds: [],
    listDistrictIds: [],
    listWardStreetIds: [],
    listHamletIds: [],
    selectedProvinces: null,
    selectedDistricts: null,
    selectedWardsStreets: null,
    selectedWard: null,
    selectedHamlets: null,
    isLoading: false
  }),
  methods: {
    asyncFind: debounce(function (query) {
      this.isLoading = true
      areasService.searchAddress(query).then(response => {
        if (response.data.success) {
          this.listHamletAddresses = response.data.data
        }
      }).catch((error) => {
        console.log(error)
      }).then(() => {
        this.isLoading = false
      })
    }, 400),
    getListAddresses: function (type) {
      let listProvinceIds = null
      if (this.listProvinceIds) {
        listProvinceIds = this.listProvinceIds
      }
      let listDistrictIds = null
      if (this.listDistrictIds) {
        listDistrictIds = this.listDistrictIds.map(item => item.code)
      }

      areasService.getListAddresses(type, listProvinceIds, listDistrictIds).then(response => {
        if (response.data.success) {
          if (type === '1') {
            this.listProvinces = response.data.data['province']
          } else if (type === '2') {
            this.listDistricts = response.data.data['district']
          } else if (type === '3') {
            this.listWardsStreets = response.data.data['ward_street']
          }
        }
      }).catch((error) => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      })
    },
    onSelectProvince: function (selectedProvince) {
      this.listProvinceIds.push(selectedProvince.code)
      this.getListAddresses('2')
      this.$emit('getProvince', this.listProvinceIds)
    },
    onRemoveProvince: function (removedProvince) {
      // this.selectedDistricts = this.selectedDistricts ? this.selectedDistricts.filter(item => item.parent_id !== removedProvince.code) : []
      this.listDistrictIds = []
      this.selectedDistricts = []
      this.listWardStreetIds = []
      this.selectedWardsStreets = []

      this.listProvinceIds = this.listProvinceIds.filter(item => item !== removedProvince.code)
      this.$emit('getProvince', this.listProvinceIds)
      this.$emit('getDistrict', [])
      this.$emit('getWardStreet', [])
    },
    onSelectDistrict: function (selectedDistrict) {
      this.listDistrictIds.push({code: selectedDistrict.code, parent_id: selectedDistrict.parent_id})
      this.getListAddresses('3')

      this.$emit('getDistrict', this.listDistrictIds)
    },
    onRemoveDistrict: function (removedDistrict) {
      // this.selectedWardsStreets = this.selectedWardsStreets ? this.selectedWardsStreets.filter(item => item.parent_id !== removedDistrict.code) : []
      this.listWardStreetIds = []
      this.selectedWardsStreets = []
      this.listDistrictIds = this.listDistrictIds.filter(item => item.code !== removedDistrict.code)

      this.$emit('getDistrict', this.listDistrictIds)
      this.$emit('getWardStreet', [])
    },
    onSelectWardStreet: function (selectedWardStreet) {
      this.listWardStreetIds.push({code: selectedWardStreet.code, parent_id: selectedWardStreet.parent_id})
      this.$emit('getWardStreet', this.listWardStreetIds)
    },
    onRemoveWardStreet: function (removedWardStreet) {
      this.listWardStreetIds = this.listWardStreetIds.filter(item => item.code !== removedWardStreet.code)
      this.$emit('getWardStreet', this.listWardStreetIds)
    },
    onSelectHamlet: function (selectedHamlet) {
      if (selectedHamlet.AddressId) {
        this.listHamletIds.push(selectedHamlet.AddressId)
      }
      this.$emit('getHamlet', this.listHamletIds)
    },
    onRemoveHamlet: function (removedHamlet) {
      console.log(removedHamlet)
      this.listHamletIds = this.listHamletIds.filter(item => item !== removedHamlet.AddressId)
      this.$emit('getHamlet', this.listHamletIds)
    },
    reset () {
      this.listProvinceIds = []
      this.listDistrictIds = []
      this.listWardStreetIds = []
      this.selectedProvinces = []
      this.selectedDistricts = []
      this.selectedWardsStreets = []
      this.$emit('getProvince', this.listProvinceIds)
      this.$emit('getDistrict', this.listDistrictIds)
      this.$emit('getWardStreet', this.selectedWardsStreets)
    }
  },
  created () {
    this.getListAddresses('1')
  }
}
</script>

<style scoped>
  .multiselect--active {
    z-index: 99;
  }
</style>
