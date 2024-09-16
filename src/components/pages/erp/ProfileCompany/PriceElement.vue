<template>
    <div style="display: table-row-group">
        <tr>
            <td v-if="typeConfig != 3">
                <b-form-select v-model="tmpPU.route_type" :options="(typeConfig == 2 || typeConfig == 4) ? routesHasPoint : routes" class="mb-3" :disabled="!enableAddPrice">
                    <template v-slot:first>
                        <option :value="null" disabled>-- Chọn loại tuyến --</option>
                    </template>
                </b-form-select>
            </td>
            <td>
                <b-form-select v-model="tmpPU.charge_type" :options="typeConfig == 3 ? unitDryRents : (typeConfig == 2 || typeConfig == 4) ? unitHasPointRents : unitRents" class="mb-3" :disabled="!enableAddPrice">
                    <template v-slot:first>
                        <option :value="null" disabled>-- Chọn đơn vị tính --</option>
                    </template>
                </b-form-select>
            </td>
            <td v-if="typeConfig == 2 || typeConfig == 4">
                <single-select-route @onChange="selectedRoute" :route="route" :route-type="tmpPU.route_type" :is-disabled="!enableAddPrice"></single-select-route>
            </td>
            <td v-if="typeConfig != 4">
                <b-form-select v-model="tmpPU.gross_ton" :options="deadWeights" class="mb-3" :disabled="!enableAddPrice">
                    <template v-slot:first>
                        <option :value="null" disabled>-- Chọn tải trọng (tấn) --</option>
                    </template>
                </b-form-select>
            </td>
<!--            <td v-if="!hasRoute">-->
<!--                <b-form-select v-model="tmpPU.active_truck_time" :options="activeTruckTimeOptions" class="mb-3" :disabled="!enableAddPrice || !isProvincial">-->
<!--                    <template v-slot:first>-->
<!--                        <option :value="null" disabled>&#45;&#45; Chọn thời gian chạy / ngày &#45;&#45;</option>-->
<!--                    </template>-->
<!--                </b-form-select>-->
<!--            </td>-->
            <td v-if="typeConfig == 1">
                <b-form-input
                        v-model="tmpPU.km_quota"
                        type="number"
                        :disabled="!enableAddPrice  || !isProvincial"
                >
                </b-form-input>
            </td>
            <td v-if="typeConfig == 1">
                <b-form-input
                        v-model="tmpPU.price_km_exceed"
                        type="number"
                        :disabled="!enableAddPrice  || !isProvincial"
                >
                </b-form-input>
            </td>
<!--            <td>-->
<!--                <b-form-select v-model="tmpPU.truck_volume" :options="truckVolumes" class="mb-3" :disabled="!enableAddPrice">-->
<!--                    <template v-slot:first>-->
<!--                        <option :value="null" disabled>&#45;&#45; Chọn thể tích thùng xe &#45;&#45;</option>-->
<!--                    </template>-->
<!--                </b-form-select>-->
<!--            </td>-->
          <td v-if="typeConfig == 4">
            <b-form-input
              v-model="tmpPU.from_trunk_volume"
              type="number"
              :disabled="!enableAddPrice"
            >
            </b-form-input>
          </td>
          <td v-if="typeConfig == 4">
            <b-form-input
              v-model="tmpPU.to_trunk_volume"
              type="number"
              :disabled="!enableAddPrice"
            >
            </b-form-input>
          </td>
            <td>
                <b-form-input
                        v-model="tmpPU.price"
                        type="number"
                        placeholder="Nhập đơn giá có VAT"
                        :disabled="!enableAddPrice"
                >
                </b-form-input>
            </td>
            <td>
                <b-form-input
                        v-model="tmpPU.tax_rate"
                        type="number"
                        placeholder="Nhập thuế VAT"
                        :disabled="!enableAddPrice"
                >
                </b-form-input>
            </td>
            <td v-if="enableAddPrice">
                <b-btn class="btn btn-md btn-outline-danger" @click="deletePrice(index)"><i class="ion ion-md-trash"></i></b-btn>
            </td>
        </tr>
    </div>
</template>
<script>
import Vue from 'vue'
import Notifications from 'vue-notification'
import SingleSelectRoute from 'components/elements/common/SingleSelectRoute'
import CompanyProfileService from 'domain/services/company-profile-service'

Vue.use(Notifications)
export default {
  name: 'PriceElement',
  components: {
    Notification,
    SingleSelectRoute
  },
  props: [
    'price',
    'enableAddPrice',
    'index',
    'isUpdated',
    'typeConfig'
  ],
  data: () => ({
    searchRoute: null,
    route: null,
    tmpPU: {
      route_type: null,
      charge_type: null,
      gross_ton: null,
      truck_volume: null,
      active_truck_time: null,
      km_quota: null,
      price_km_exceed: null,
      from_trunk_volume: null,
      to_trunk_volume: null,
      route_id: null
    },
    active: true,
    unitRents: [
      { value: 'km', text: 'Km' },
      { value: 'ca', text: 'Ca' },
      { value: 'thang', text: 'Tháng' },
      { value: 'chuyen', text: 'Chuyến' }
    ],
    unitHasPointRents: [
      { value: 'chuyen', text: 'Chuyến' }
    ],
    unitDryRents: [
      { value: 'thang', text: 'Tháng' }
    ],
    routes: [
      { value: 'lien-tinh', text: 'Liên tỉnh' },
      { value: 'lien-mien', text: 'Liên miền' },
      { value: 'noi-tinh', text: 'Nội tỉnh' },
      { value: 'noi-thanh', text: 'Nội thành' }
    ],
    routesHasPoint: [
      // { value: 'lien-tinh', text: 'Liên tỉnh' },
      { value: 'lien-mien', text: 'Liên miền' }
    ],
    deadWeights: [
      { value: '0.5', text: '0.5 Tấn' },
      { value: '1.25', text: '1.25 Tấn' },
      { value: '1.9', text: '1.9 Tấn' },
      { value: '3.5', text: '3.5 Tấn' },
      { value: '5', text: '5 Tấn' },
      { value: '8', text: '8 Tấn' },
      { value: '10', text: '10 Tấn' },
      { value: '15', text: '15 Tấn' },
      { value: '20', text: '20 Tấn' }
    ],
    activeTruckTimeOptions: [
      { value: '12', text: '12h' },
      { value: '18', text: '18h' },
      { value: '24', text: '24h' }
    ]
    // truckVolumes: [
    //   { value: '9', text: '9 Khối' },
    //   { value: '10', text: '10 Khối' },
    //   { value: '14', text: '14 Khối' },
    //   { value: '26', text: '26 Khối' }
    // ]
  }),

  watch: {
    tmpPU: {
      deep: true,
      handler (newVal, oldVal) {
        if (parseInt(this.typeConfig) === 1) {
          this.$emit('updatePriceNotRoute', newVal)
        } else if (parseInt(this.typeConfig) === 2) {
          this.$emit('updatePriceHasRoute', newVal)
        } else if (parseInt(this.typeConfig) === 4) {
          this.$emit('updatePriceTrunkVolumeHasRoute', newVal)
        } else {
          this.$emit('updatePriceDry', newVal)
        }
      }
    },
    price: function () {
      this.setPrice()
      this.getListTruckRoutes()
    }
  },

  computed: {
    isProvincial () {
      return this.tmpPU.route_type === 'noi-tinh' || this.tmpPU.route_type === 'noi-thanh'
    }
  },

  created () {
    this.tmpPU = this.price || this.tmpPU
    this.setPrice()
    this.getListTruckRoutes()
  },

  methods: {
    getListTruckRoutes () {
      const dataSend = {
        routeId: this.price.route_id
      }
      CompanyProfileService.getListTruckRoutes(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.route = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    },

    setPrice: function () {
      this.tmpPU = this.price
    },

    deletePrice: function () {
      this.$emit('deletePriceRow', this.index)
    },

    selectedRoute (option) {
      this.searchRoute = option
      this.price.route_id = option.id
    }
  }
}
</script>

<style scoped>
</style>
