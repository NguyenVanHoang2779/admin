<template>
    <tr>
        <td>
            <b-form-select v-model="tmpPU.route_type" :options="routes" class="mb-3" :disabled="!enableAddPrice">
                <template v-slot:first>
                    <option :value="null" disabled>-- Chọn tuyến đường --</option>
                </template>
            </b-form-select>
        </td>
        <td>
            <b-form-select v-model="tmpPU.charge_type" :options="unitRents" class="mb-3" :disabled="!enableAddPrice">
                <template v-slot:first>
                    <option :value="null" disabled>-- Chọn đơn vị tính --</option>
                </template>
            </b-form-select>
        </td>
        <td>
            <b-form-select v-model="tmpPU.gross_ton" :options="deadWeights" class="mb-3" :disabled="!enableAddPrice">
                <template v-slot:first>
                    <option :value="null" disabled>-- Chọn tải trọng (tấn) --</option>
                </template>
            </b-form-select>
        </td>
        <td>
            <b-form-select v-model="tmpPU.truck_volume" :options="trunkVolumes" class="mb-3" :disabled="!enableAddPrice">
                <template v-slot:first>
                    <option :value="null" disabled>-- Chọn thể tích thùng xe --</option>
                </template>
            </b-form-select>
        </td>
        <td v-if="enableAddPrice && isUpdated">
            <b-btn class="btn btn-md btn-outline-danger" @click="deletePrice(index)"><i class="ion ion-md-trash"></i></b-btn>
        </td>
    </tr>
</template>
<script>
import Vue from 'vue'
import Notifications from 'vue-notification'

Vue.use(Notifications)
export default {
  name: 'PriceElement',
  components: {Notification},
  props: [
    'price',
    'enableAddPrice',
    'index',
    'isUpdated'
  ],
  data: () => ({
    tmpPU: {
      route_type: null,
      charge_type: null,
      gross_ton: null,
      truck_volume: null
    },
    active: true,
    unitRents: [
      { value: 'km', text: 'Km' },
      { value: 'ca', text: 'Ca' },
      { value: 'thang', text: 'Tháng' },
      { value: 'chuyen', text: 'Chuyến' }
    ],
    routes: [
      { value: 'lien-tinh', text: 'Liên tỉnh' },
      { value: 'lien-mien', text: 'Liên miền' },
      { value: 'noi-tinh', text: 'Nội tỉnh' },
      { value: 'noi-thanh', text: 'Nội thành' }
    ],
    deadWeights: [
      { value: '1.25', text: '1.25 Tấn' },
      { value: '1.9', text: '1.9 Tấn' },
      { value: '5', text: '5 Tấn' }
    ],
    trunkVolumes: [
      { value: '9', text: '9 Khối' },
      { value: '10', text: '10 Khối' },
      { value: '14', text: '14 Khối' },
      { value: '26', text: '26 Khối' }
    ]
  }),

  watch: {
    tmpPU: {
      deep: true,
      handler (newVal, oldVal) {
        this.$emit('updatePrice', newVal)
      }
    },
    price: function () {
      this.setPrice()
    }
  },

  created () {
    this.tmpPU = this.price || this.tmpPU
    this.setPrice()
  },

  methods: {
    setPrice: function () {
      this.tmpPU.route_type = this.price.route_type
      this.tmpPU.charge_type = this.price.charge_type
      this.tmpPU.gross_ton = this.price.gross_ton
      this.tmpPU.truck_volume = this.price.truck_volume
      this.tmpPU.price = this.price.price
    },
    deletePrice: function () {
      this.$emit('deletePriceRow', this.index)
    }
  }
}
</script>

<style scoped>
</style>
