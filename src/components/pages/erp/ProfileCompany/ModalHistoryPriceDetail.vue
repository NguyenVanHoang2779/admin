<template>
    <div>
        <b-modal ref="modal-add-profile" id="modal-history-price-detail" title="Thông tin đơn giá cũ" @hide="resetData()" ok-only static>
            <div class="col-md-12 contract-list">
                <div class="card">
                    <div class="card-body">
                        <table class="table card-table">
                            <thead class="thead-light">
                            <tr>
                                <th>Loại tuyến</th>
                                <th>Tuyến</th>
                                <th>Đơn vị tính</th>
                                <th>Tải trọng xe</th>
                                <th>Từ thể tích</th>
                                <th>Tới thể tích</th>
                                <th>Loại xe</th>
                                <th>Đơn giá</th>
                                <th>Thuế VAT (%)</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="priceUnit in oldPriceUnits">
                                    <td>{{ priceUnit.route_type }}</td>
                                    <td>{{ priceUnit.route_name }}</td>
                                    <td>{{ priceUnit.charge_type }}</td>
                                    <td>{{ priceUnit.gross_ton }}</td>
                                    <td>{{ priceUnit.from_trunk_volume }}</td>
                                    <td>{{ priceUnit.to_trunk_volume }}</td>
                                    <td>{{ priceUnit.vehicle_type }}</td>
                                    <td v-numeral>{{ priceUnit.price }}</td>
                                    <td>{{ priceUnit.tax_rate }}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br/>
            </div>
        </b-modal>
    </div>
</template>

<style lang="scss">
    .sperator-right {
        border-right: 1px solid rgba(0, 0, 0, 0.2)
    }
    .modal-md .modal-dialog {
        max-width: 100%!important;
    }
</style>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})
export default {
  name: 'modal-history-price-detail',

  components: {
  },

  props: [
    'oldPriceUnits'
  ],

  data: () => ({
  }),

  watch: {
  },

  methods: {
    resetData () {
      this.oldPriceUnits = null
    }
  }
}
</script>
