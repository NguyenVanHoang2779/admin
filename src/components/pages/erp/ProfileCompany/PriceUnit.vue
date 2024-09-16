<template>
    <div>
        <div class="time-price-active row">
            <b-col md="3"  v-if="(priceHasRoute.length > 0 || priceNotRoute.length > 0 || priceTrunkVolumeHasRoute.length > 0) && !enable_add_price">
                Thời gian hiệu lực từ: &nbsp; <strong>{{from}}</strong> &nbsp; đến &nbsp; <strong>{{to}}</strong>
            </b-col>
            <div v-if="priceHasRoute.length === 0 && priceNotRoute.length === 0 && priceTrunkVolumeHasRoute.length === 0 && !isAddConfig" class="items-center text-danger">
                <span>Chưa có bảng giá nào được tạo!</span>
            </div>
            <b-col md="3" class="mb-2" v-if="isAddConfig || enable_add_price">
                <div style="margin-bottom: 5px;">Chọn khoảng thời gian bảng giá có hiệu lực:</div>
                <v-date-picker mode="range" v-model="range_time" locale="vi"
                               color="green"
                               :input-props="{ placeholder: 'Chọn khoảng thời gian', style: 'font-size:14px; line-height: unset' }"/>
            </b-col>
            <b-col>
                <button v-if="!isAddConfig && !enable_add_price" class="btn btn-outline-info add-appendix float-right" @click="copyNewConfig()">
                    <i class="ion-icon ion-md-copy" style="font-size: 14px; margin-right: 5px;"></i>
                    Copy đơn giá cũ
                </button>
                <button v-if="!isAddConfig && !enable_add_price" style="margin-right: 5px"  class="btn btn-outline-success add-appendix float-right" @click="showNewConfig()">
                    <i class="ion-icon ion-md-add" style="font-size: 14px; margin-right: 5px;"></i>
                    Thêm đơn giá
                </button>
            </b-col>
            <b-col v-if="enable_add_price" @click="cancelAdd()">
                <button class="btn btn-secondary add-appendix float-right">Hủy</button>
            </b-col>
        </div>
        <div class="row">
            <div class="col-md-12 contract-list">
                <div class="card">
                    <div class="card-body">
                        <div v-if="priceNotRoute.length > 0 || enable_add_price">
                            <div
                                class="price-child"
                                :class="visibleNotRoute ? null : 'collapsed'"
                                :aria-expanded="visibleNotRoute ? 'true' : 'false'"
                                aria-controls="collapse-4"
                                @click="visibleNotRoute = !visibleNotRoute"
                                >
                                <strong>
                                    <i class="ion ion-ios-arrow-forward mr-1" v-if="visibleNotRoute"></i>
                                    <i class="ion ion-ios-arrow-down mr-1" v-else></i>
                                    Không có lộ trình
                                </strong>
                            </div>
                            <b-collapse id="collapse-4" v-model="visibleNotRoute" class="mt-2">
                                <table class="table card-table">
                                    <thead class="thead-light">
                                    <tr v-if="priceNotRoute.length > 0">
                                        <th>Loại tuyến</th>
                                        <th>Đơn vị tính</th>
                                        <th>Tải trọng xe</th>
<!--                                        <th>Thời gian chạy/ngày</th>-->
                                        <th>Định mức km/tháng</th>
                                        <th>Giá km vượt</th>
<!--                                        <th>Thể tích thùng xe</th>-->
                                        <th>Đơn giá có VAT</th>
                                        <th>Thuế VAT (%)</th>
                                        <th v-if="enable_add_price">Action</th>
                                    </tr>
                                    </thead>
                                    <price-element v-for="(price,index) in priceNotRoute" :key="index" :index="index" :price="price"
                                                   :enable-add-price="enable_add_price" :is-updated="isUpdated"
                                                   :type-config="1"
                                                   @updatePriceHasRoute="updatePriceHasRoute($event, index)"
                                                   @updatePriceNotRoute="updatePriceNotRoute($event, index)"
                                                   @updatePriceTrunkVolumeHasRoute="updatePriceTrunkVolumeHasRoute($event, index)"
                                                   @deletePriceRow="deletePriceRow($event)">
                                    </price-element>
                                </table>
                                <div>
                                    <button v-if="enable_add_price" type="button" class="btn btn-success add-appendix" @click="addPriceRowNotRoute">
                                        +
                                    </button>
                                </div>
                            </b-collapse>
                        </div>

                        <!-- Có lộ trình-->
                        <div class="mt-2" v-if="priceHasRoute.length > 0 || enable_add_price">
                            <div
                                    class="price-child"
                                    :class="visibleHasRoute ? null : 'collapsed'"
                                    :aria-expanded="visibleHasRoute ? 'true' : 'false'"
                                    aria-controls="collapse-2"
                                    @click="visibleHasRoute = !visibleHasRoute"
                            >
                                <strong>
                                    <i class="ion ion-ios-arrow-forward mr-1" v-if="visibleHasRoute"></i>
                                    <i class="ion ion-ios-arrow-down mr-1" v-else></i>
                                    Có lộ trình
                                </strong>
                            </div>
                            <b-collapse id="collapse-2" v-model="visibleHasRoute" class="mt-2">
                                <table class="table card-table">
                                    <thead class="thead-light">
                                    <tr v-if="priceHasRoute.length > 0">
                                        <th>Loại tuyến</th>
                                        <th>Đơn vị tính</th>
                                        <th>Tuyến đường</th>
                                        <th>Tải trọng xe</th>
<!--                                        <th>Thể tích thùng xe</th>-->
                                        <th>Đơn giá có VAT</th>
                                        <th>Thuế VAT (%)</th>
                                        <th v-if="enable_add_price && isUpdated">Action</th>
                                    </tr>
                                    </thead>
                                    <price-element v-for="(price,index) in priceHasRoute" :key="index" :index="index  + priceNotRoute.length" :price="price"
                                                   :enable-add-price="enable_add_price" :is-updated="isUpdated"
                                                   :type-config="2"
                                                   @updatePriceHasRoute="updatePriceHasRoute($event, index)"
                                                   @updatePriceNotRoute="updatePriceNotRoute($event, index)"
                                                   @deletePriceRow="deletePriceRow($event)">
                                    </price-element>
                                </table>
                                <div>
                                    <button v-if="enable_add_price" type="button" class="btn btn-success add-appendix" @click="addPriceRowHasRoute">
                                        +
                                    </button>
                                </div>
                            </b-collapse>
                        </div>

                        <!-- Xe khô-->
                        <div class="mt-2" v-if="priceDry.length > 0 || enable_add_price">
                            <div
                                    class="price-child"
                                    :class="visibleDryTruck ? null : 'collapsed'"
                                    :aria-expanded="visibleDryTruck ? 'true' : 'false'"
                                    aria-controls="collapse-2"
                                    @click="visibleDryTruck = !visibleDryTruck"
                            >
                                <strong>
                                    <i class="ion ion-ios-arrow-forward mr-1" v-if="visibleDryTruck"></i>
                                    <i class="ion ion-ios-arrow-down mr-1" v-else></i>
                                    Xe khô
                                </strong>
                            </div>
                            <b-collapse id="collapse-2" v-model="visibleDryTruck" class="mt-2">
                                <table class="table card-table">
                                    <thead class="thead-light">
                                    <tr v-if="priceHasRoute.length > 0">
                                        <th>Đơn vị tính</th>
                                        <th>Tải trọng xe</th>
                                        <th>Đơn giá có VAT</th>
                                        <th>Thuế VAT (%)</th>
                                        <th v-if="enable_add_price && isUpdated">Action</th>
                                    </tr>
                                    </thead>
                                    <price-element v-for="(price,index) in priceDry" :key="index" :index="index  + priceNotRoute.length + priceHasRoute.length" :price="price"
                                                   :enable-add-price="enable_add_price" :is-updated="isUpdated"
                                                   :type-config="3"
                                                   @updatePriceHasRoute="updatePriceHasRoute($event, index)"
                                                   @updatePriceNotRoute="updatePriceNotRoute($event, index)"
                                                   @deletePriceRow="deletePriceRow($event)">
                                    </price-element>
                                </table>
                                <div>
                                    <button v-if="enable_add_price" type="button" class="btn btn-success add-appendix" @click="addPriceRowDry">
                                        +
                                    </button>
                                </div>
                            </b-collapse>
                        </div>

                        <!-- Có lộ trình xe container-->
<!--                        <div class="mt-2" v-if="priceTrunkVolumeHasRoute.length > 0 || enable_add_price">-->
                        <div class="mt-2">
                          <div
                            class="price-child"
                            :class="visibleTrunkVolumeHasRoute ? null : 'collapsed'"
                            :aria-expanded="visibleTrunkVolumeHasRoute ? 'true' : 'false'"
                            aria-controls="collapse-2"
                            @click="visibleTrunkVolumeHasRoute = !visibleTrunkVolumeHasRoute"
                          >
                            <strong>
                              <i class="ion ion-ios-arrow-forward mr-1" v-if="visibleTrunkVolumeHasRoute"></i>
                              <i class="ion ion-ios-arrow-down mr-1" v-else></i>
                              Container
                            </strong>
                          </div>
                          <b-collapse id="collapse-2" v-model="visibleTrunkVolumeHasRoute" class="mt-2">
                            <table class="table card-table">
                              <thead class="thead-light">
                              <tr v-if="priceTrunkVolumeHasRoute.length > 0">
                                <th>Loại tuyến</th>
                                <th>Đơn vị tính</th>
                                <th>Tuyến đường</th>
                                <!--                                <th>Tải trọng xe</th>-->
                                <th>Từ thể tích</th>
                                <th>Tới thể tích</th>
                                <th>Đơn giá có VAT</th>
                                <th>Thuế VAT (%)</th>
                                <th v-if="enable_add_price && isUpdated">Action</th>
                              </tr>
                              </thead>
                              <price-element v-for="(price,index) in priceTrunkVolumeHasRoute" :key="index" :index="index + priceNotRoute.length + priceHasRoute.length + priceDry.length" :price="price"
                                             :enable-add-price="enable_add_price" :is-updated="isUpdated"
                                             :type-config="4"
                                             @updatePriceHasRoute="updatePriceHasRoute($event, index)"
                                             @updatePriceNotRoute="updatePriceNotRoute($event, index)"
                                             @updatePriceDry="updatePriceDry($event, index)"
                                             @deletePriceRow="deletePriceRow($event)">
                              </price-element>
                            </table>
                            <div>
                              <button v-if="enable_add_price" type="button" class="btn btn-success add-appendix" @click="addPriceRowTrunkVolumeHasRoute">
                                +
                              </button>
                            </div>
                          </b-collapse>
                        </div>
                        <div>
                            <button v-if="!enable_add_price && (this.priceHasRoute.length !== 0 || this.priceNotRoute.length !== 0 || this.priceDry.length !== 0 || this.priceTrunkVolumeHasRoute.length !== 0)" class="btn btn-outline-success add-appendix float-right" @click="createPriceUnit">
                                Chỉnh sửa đơn giá
                            </button>
                        </div>
                        <div class="text-center">
                            <button  v-if="enable_add_price && !isUpdated" type="button" class="btn btn-success add-price" @click="updatePriceTruck">
                                <span> <i class="ion ion-ios-save" ></i> Lưu lại </span>
                            </button>
                            <button  v-if="enable_add_price && isUpdated" type="button" class="btn btn-success add-price" @click="addPriceTruck">
                                <span> <i class="ion ion-ios-save" ></i> Lưu lại </span>
                            </button>
                        </div>
                        <div style="margin-top: 5px">
                            <list-price-unit :company_id="company_id"></list-price-unit>
                        </div>
                    </div>
                </div>
                <br/>
            </div>
            <notifications group='create-appendix'></notifications>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Notifications from 'vue-notification'
import PriceElement from './PriceElement'
import ListPriceUnit from './ListPriceUnit'
import CompanyProfileService from 'domain/services/company-profile-service'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(Notifications)
export default {
  name: 'PriceUnit',
  components: {
    Notification,
    PriceElement,
    ListPriceUnit
  },
  props: [
    'company_id'
  ],
  data: () => ({
    visibleNotRoute: true,
    visibleHasRoute: true,
    visibleDryTruck: true,
    visibleTrunkVolumeHasRoute: true,
    hasRoute: true,
    isAddConfig: false,
    priceHasRoute: [],
    priceNotRoute: [],
    priceDry: [],
    priceTrunkVolumeHasRoute: [],
    priceElement: null,
    priceRoute: null,
    active: true,
    from: null,
    to: null,
    created: '',
    notify: {
      message: '',
      class: '',
      title: ''
    },
    range_time: null,
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'd-m-Y',
      altFormat: 'd-m-Y'
    },
    not_found: false,
    showBackToContract: false,
    enable_add_price: false,
    isUpdated: false
  }),

  watch: {
    data_appendix: {
      handler: function (newValue) {
        this.initDataAppendix()
      },
      deep: true
    }
  },

  created () {
    this.getPriceRentTruck()
  },

  methods: {
    updatePriceHasRoute (dataPrice, index) {
      this.priceHasRoute[index] = dataPrice
    },

    updatePriceNotRoute (dataPrice, index) {
      this.priceNotRoute[index] = dataPrice
    },

    updatePriceDry (dataPrice, index) {
      this.priceDry[index] = dataPrice
    },

    updatePriceTrunkVolumeHasRoute (dataPrice, index) {
      this.priceTrunkVolumeHasRoute[index] = dataPrice
    },

    showNewConfig: function () {
      this.priceHasRoute = []
      this.priceNotRoute = []
      this.createPriceUnit()
      this.addPriceRowNotRoute()
      this.isAddConfig = !this.isAddConfig
      this.isUpdated = true
    },

    copyNewConfig: function () {
      this.createPriceUnit()
      this.isAddConfig = !this.isAddConfig
      this.isUpdated = true
    },

    addPriceRowHasRoute: function () {
      this.priceHasRoute.push({
        company_id: this.company_id,
        charge_type: null,
        route_id: null,
        gross_ton: null,
        price: null,
        tax_rate: 10,
        route_type: null,
        truck_volume: null
      })
    },

    addPriceRowDry: function () {
      this.priceDry.push({
        company_id: this.company_id,
        charge_type: null,
        gross_ton: null,
        price: null,
        tax_rate: 10
      })
    },

    addPriceRowNotRoute: function () {
      this.priceNotRoute.push({
        company_id: this.company_id,
        charge_type: null,
        gross_ton: null,
        km_quota: null,
        price_km_exceed: null,
        price: null,
        tax_rate: 10,
        route_type: null,
        truck_volume: null
      })
    },

    addPriceRowTrunkVolumeHasRoute: function () {
      this.priceTrunkVolumeHasRoute.push({
        company_id: this.company_id,
        charge_type: null,
        route_id: null,
        from_trunk_volume: null,
        to_trunk_volume: null,
        price: null,
        tax_rate: 10,
        route_type: null,
        truck_volume: null,
        vehicle_type: 'container'
      })
    },

    getStartEndFromTimeRange () {
      if (!this.range_time) {
        return {
          from: this.from,
          to: this.to
        }
      }
      return {
        from: moment(this.range_time.start).format('YYYY-MM-DD'),
        to: moment(this.range_time.end).format('YYYY-MM-DD')
      }
    },

    addPriceTruck: function () {
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let data = {
        from: timeRange.from,
        to: timeRange.to,
        company_id: this.company_id,
        price: {
          'notRoute': this.priceNotRoute,
          'hasRoute': this.priceHasRoute,
          'dry': this.priceDry,
          'trunkVolumeHasRoute': this.priceTrunkVolumeHasRoute
        }
      }
      CompanyProfileService.addPriceTruck(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.enable_add_price = false
            this.isUpdated = !this.isUpdated
            this.isAddConfig = !this.isAddConfig
            this.getPriceRentTruck()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    updatePriceTruck: function () {
      let timeRange = this.range_time != null ? this.getStartEndFromTimeRange(this.range_time) : {}
      let data = {
        from: timeRange.from,
        to: timeRange.to,
        company_id: this.company_id,
        price: {
          'notRoute': this.priceNotRoute,
          'hasRoute': this.priceHasRoute,
          'dry': this.priceDry,
          'trunkVolumeHasRoute': this.priceTrunkVolumeHasRoute
        }
      }
      CompanyProfileService.updatePriceTruck(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.enable_add_price = false
            this.isUpdated = !this.isUpdated
            this.getPriceRentTruck()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    deletePriceRow: function (index) {
      if (index < this.priceNotRoute.length) {
        this.priceNotRoute.splice(index, 1)
      } else if (index >= this.priceNotRoute.length && index < this.priceNotRoute.length + this.priceHasRoute.length) {
        this.priceHasRoute.splice(index - this.priceNotRoute.length, 1)
      } else if (index >= this.priceNotRoute.length + this.priceHasRoute.length && index < this.priceNotRoute.length + this.priceHasRoute.length + this.priceDry.length) {
        this.priceDry.splice(index - this.priceNotRoute.length - this.priceHasRoute.length, 1)
      } else {
        this.priceTrunkVolumeHasRoute.splice(index - this.priceNotRoute.length - this.priceHasRoute.length - this.priceDry.length, 1)
      }
    },

    cancelAdd: function () {
      this.enable_add_price = false
      this.isUpdated = !this.isUpdated
      this.isAddConfig = false
      this.getPriceRentTruck()
    },

    getPriceRentTruck: function () {
      this.appLoading = true
      let params = {
        company_id: this.company_id
      }
      CompanyProfileService.getPriceRentTruck(params)
        .then(res => {
          if (res.data.success) {
            this.priceNotRoute = res.data.data.notRoute || []
            this.priceHasRoute = res.data.data.hasRoute || []
            this.priceDry = res.data.data.dry || []
            this.priceTrunkVolumeHasRoute = res.data.data.trunkVolumeHasRoute || []
            if (this.priceNotRoute.length > 0) {
              this.from = this.priceNotRoute[0].from
              this.to = this.priceNotRoute[0].to
            } else if (this.priceHasRoute.length > 0) {
              this.from = this.priceHasRoute[0].from
              this.to = this.priceHasRoute[0].to
            } else if (this.priceDry.length > 0) {
              this.from = this.priceDry[0].from
              this.to = this.priceDry[0].to
            } else if (this.priceTrunkVolumeHasRoute.length > 0) {
              this.from = this.priceTrunkVolumeHasRoute[0].from
              this.to = this.priceTrunkVolumeHasRoute[0].to
            }
            this.range_time = {
              start: new Date(this.from),
              end: new Date(this.to)
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    createPriceUnit: function () {
      this.enable_add_price = true
      this.isUpdated = false
    }
  }
}
</script>
<style scoped>
    .add-price {
        width: 600px;
        margin: 0 auto;
    }
    .time-price-active {
        padding: 10px 25px;
        font-size: 16px;
    }
    .items-center {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
    }
    .price-child {
        padding: 10px;
        background: #8897AA;
        color: white;
    }
</style>
