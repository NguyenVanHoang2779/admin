<template>
  <div>
    <h4>Cấu hình tủ thông minh</h4>

    <b-card class="mb-3">
      <div class="d-flex">
        <multi-select-station class="width-200 mr-3" v-model="filters.station" :multiple="false"/>

        <select-carts-v2
          class="width-200 mr-1"
          v-model="filters.carts"
          :params="{
            type: cartTypeIds,
            is_visible: 1
          }"
        />

        <div>
          <b-button variant="success" v-on:click="doSearch()" :disabled="loading">
            <i v-if="loading" class="fa fa-spin fa-spinner" />
            <i v-else class="fa fa-search" />
            Tìm kiếm
          </b-button>
        </div>

        <div></div>
      </div>
    </b-card>

    <b-card>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
          <tr>
            <th>Ngăn tủ</th>
            <th>Tủ</th>
            <th>Kho</th>
            <th>Tuyến</th>
            <th>Sửa lúc</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item of datatable" :key="item.cell_id">
            <td>{{ item.cell_name }}</td>
            <td>{{ item.cabinet_name }}</td>
            <td>{{ item.station_name }}</td>
            <td>{{ item.carts.join(', ') }}</td>
            <td>{{ item.desc }}</td>
            <td>
              <b-btn type="button" class="btn btn-success pl-4 pr-4 action-edit-cart" @click="showModalEditConfig(item)">Sửa</b-btn>
            </td>
          </tr>
          <tr v-if="!datatable.length">
            <td colspan="6">Không có dữ liệu phù hợp.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </b-card>

    <modal-config-cart
      v-if="showModalEditCart && activeRow"
      @closed="onHideModalEditConfig"
      :cell="activeRow"
      :params="{
        type: cartTypeIds,
        is_visible: 1
      }"
    />

  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from './../../../infrastructures/helpers/common-helpers'
import SmartLockerService from '../../../domain/services/smart-locker-service'
import MultiSelectStation from './../../elements/common/MultiSelectStationV2'
import ManageLineService from 'domain/services/manage-line-service'
import ConfigCart from '../../../domain/entities/ConfigCart'
import ModalConfigCart from './ModalConfigCart'
import SelectCartsV2 from '../../elements/FilterBox/SelectCartsV2'

export default {
  name: 'ConfigCarts',
  components: {
    ModalConfigCart,
    Multiselect,
    MultiSelectStation,
    SelectCartsV2,
    ManageLineService
  },
  data () {
    return {
      loading: false,
      cartTypeIds: [ConfigCart.cartTypes.delivering.value],
      filters: {
        carts: [],
        cells: [],
        station: null
      },
      datatable: [],
      cells: [],
      cartsOptions: [],
      stationId: null,

      activeRow: null,
      showModalEditCart: false
    }
  },
  watch: {
    '$store.state.userInfo.Station': function (value) {
      if (!this.filters.station && value && value.id) {
        this.filters.station = value
        this.getCabinets()
      }
    }
  },
  created () {
    if (this.$store.state.userInfo.Station) {
      this.filters.station = this.$store.state.userInfo.Station
      this.doSearch()
    }
  },
  methods: {
    /**
     * Lấy thông tin toàn bộ cabinet trong kho
     */
    async getCabinets () {
      try {
        this.loading = true
        const params = {
          station_id: this.filters.station.id
        }
        const cabinets = await SmartLockerService.getCabinets(params)
        this.stationId = params.station_id

        this.cells = []
        cabinets.forEach((cabinet) => {
          cabinet.cells.forEach(cell => {
            this.cells.push({
              cell_id: cell.id,
              cell_name: cell.name,
              cabinet_name: cabinet.cabinet_name,
              station_id: cabinet.station_id,
              station_name: cabinet.station_name,
              desc: cell.desc,
              carts: cell.cart
            })
          })
        })
        return true
      } catch (reason) {
        commonHelper.showMessage(reason.toString())
        return false
      } finally {
        this.loading = false
      }
    },

    showModalEditConfig (cell) {
      this.activeRow = cell
      this.showModalEditCart = true
    },

    onHideModalEditConfig () {
      this.activeRow = null
      this.showModalEditCart = false
    },

    /**
     * Lọc danh sách các ngăn tủ theo điều kiện người dùng
     */
    async doSearch () {
      // Khi thay đổi kho -> Lấy lại danh sách cabinets
      if (this.filters.station && this.stationId !== this.filters.station.id) {
        if (!await this.getCabinets()) {
          return
        }
      }

      // Filters
      const cartAlias = this.filters.carts.length ? this.filters.carts.map(cart => cart.name) : null
      this.datatable = this.cells.filter(cell => {
        // Lọc theo giỏ
        if (cartAlias) {
          // Ngăn chưa được gán giỏ
          if (!cell.carts || !Array.isArray(cell.carts)) {
            return false
          }
          return cell.carts.some(alias => cartAlias.includes(alias))
        }

        return true
      })
    }
  }
}
</script>

<style scoped>
.width-200 {
  width: 200px;
}
</style>
