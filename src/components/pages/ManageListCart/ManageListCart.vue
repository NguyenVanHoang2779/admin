<template>
    <div>
    <div class="ui-block">
     <div class="contentHeader">
        <h3 class="ui-block-heading text-left">Quản lý tuyến</h3>
        <router-link :to="{name: '/create-cart'}">
        <b-btn type="button" variant="success mb-4">Thêm tuyến mới</b-btn></router-link>
     </div>
      <div>
        <b-form>
          <div class="form-filter">
            <b-form-row>
              <b-col md="12">
                <b-form-group label="Miền">
                  <multiselect
                    v-model="dataInput.regions"
                    label="text"
                    track-by="value"
                    placeholder="Chọn tên miền"
                    :options="optionRegions"
                    :multiple="true"
                    :searchable="false"
                    :loading="false"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="false"
                    ref="mulSelRegion"
                  ></multiselect>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                <b-form-group label="Tỉnh">
                  <select-province :regions="dataInput.regions" @selected="selected.province = $event" ref="selectProvince"></select-province>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                <b-form-group label="Kho">
                 <select-station-carts :provinces="selected.province" @selected="selected.stations = $event" :stationDefault="dataInput.stationDefault" :flagStation="flagStation" ref="selectStations"></select-station-carts>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                <b-form-group label="Kiểu tuyến">
                  <multiselect
                    v-model="dataInput.type_line"
                    label="text"
                    track-by="value"
                    placeholder="Chọn kiểu tuyến"
                    :options="optionTypeLine"
                    :multiple="true"
                    :searchable="false"
                    :loading="false"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="false"
                    ref="mulSelLine"
                  ></multiselect>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                 <b-form-group label="Active">
                    <b-form-select  v-model="dataInput.active" :options="optionActive" style="width: 100%;"></b-form-select>
                 </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                 <b-form-group label="Tên Module">
                   <select-module :stations="selected.stations" @selected="selected.module = $event" :stationId="stationId" ref="selectModule"></select-module>
                 </b-form-group>
              </b-col>
            </b-form-row>
             <b-form-row>
              <b-col md="12">
                 <b-form-group label="Tên tuyến">
                   <select-line :station="selected.stations" :module="selected.module" :typeCart="dataInput.type_line" :active="dataInput.active"
                   @onChange="selectedLine" ref="selectLine"></select-line>
                 </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col md="12">
                 <b-form-group label="Shop">
                   <multi-select-shop-carts
                   @onChange="selectedShopCarts"
                    ref="shopComponent"
                  ></multi-select-shop-carts>
                 </b-form-group>
              </b-col>
            </b-form-row>
              <b-form-row class="cfButton">
                    <ladda-btn
                      :loading="loadingButton"
                      @click.native="searchManageLine(dataPage.currentPage, true)"
                      data-style="zoom-out"
                      class="btn btn-success btn-z-index b1"
                      >
                      <i class="sidenav-icon ion ion-md-search"></i>
                      Tìm kiếm
                    </ladda-btn>
            </b-form-row>
          </div>
        </b-form>
        <b-form>
          <div class="result" id="results" v-if="checkResult">
      <div class="form-filter mt-3">
      <b-form-row>
        <b-col md="12">
        <b-card >
            <div class="table-result" >
                <div class="table-responsive mb-4">
                    <table class="table mb-0 table-bordered">
                        <thead class="" style="width: 100%!important">
                        <tr>
                            <th style="width: 10%">Tên tuyến</th>
                            <th style="width: 15%">COD/Điều phối</th>
                            <th style="width: 35%">Shop/Địa điểm</th>
                            <th style="width: 30%">Kịch bản đơn ưu tiên</th>
                          <th style="width: 10%">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in dataLogs" :key="index">
                          <td>
                            <!-- <strong>{{dataLogs.data.types[item.Cart.alias]}}</strong> -->
                             <strong>{{item.carts.alias}}</strong>
                             <br>
                             <span v-if="item.carts.type === '1'">Lấy hàng</span>
                             <span v-if="item.carts.type === '2'">Giao hàng</span>
                             <span v-if="item.carts.type === '3'">Trả hàng</span>
                          </td>
                          <td>
                            <strong>COD ca 1</strong>:
                              <span>{{ item.first_cod.alias }}-{{item.first_cod.fullname}}</span>
                            <span v-if="item.first_cod == ''">chưa chọn</span>
                            <br>
                            <strong>COD ca 2</strong>: <span>{{ item.second_cod.alias }}-{{item.second_cod.fullname}}</span>
                            <span v-if="item.second_cod == ''">chưa chọn</span>
                          </td>
                          <td>
                            <strong>Shop</strong>: <span v-for="(itemShop, indexShop) in item.shop" :key="'A'+indexShop ">
                            <span v-if="indexShop != 0">, </span>{{ itemShop.code }} - {{ itemShop.name }}</span>
                            <span v-if="item.shop == ''">chưa chọn</span>
                            <br>
                            <strong>Quận/huyện</strong>: <span v-for="(itemDistrict,indexDistrict) in item.district" :key="'B'+indexDistrict">
                              <span v-if="indexDistrict != 0">, </span>{{itemDistrict.name}}</span>
                             <span v-if="item.district == ''">chưa chọn</span>
                             <br>
                            <strong>Đường</strong>: <span v-for="(itemStreet,indexStreet) in item.street" :key="'C'+indexStreet">
                              <span v-if="indexStreet != 0">, </span>{{itemStreet.name}}</span>
                            <span v-if="item.street == ''">chưa chọn</span>
                             <br>
                             <strong>Phường</strong>:
                             <span v-for="(itemWard,indexWart) in item.ward" :key="'D' + indexWart">
                               <span v-if="indexWart != 0">, </span>{{itemWard.name}}
                             </span>
                             <span v-if="item.ward == ''">chưa chọn</span>
                             <br>
                             <strong>Địa chỉ đặc biệt</strong>: <span v-for="(itemAddress,indexAdress) in item.special_address" :key="'E'+indexAdress">
                               <span v-if="indexAdress != 0">, </span>{{itemAddress.name}}</span>
                             <span v-if="item.special_address == ''">chưa chọn</span>
                             <br>
                             <strong>Địa chỉ cấp 4</strong>:
                             <span v-for="(itemLevelAddress, indexLevelAdreess) in item.four_lever_address" :key="'F'+ indexLevelAdreess">
                               <span v-if="indexLevelAdreess != 0">, </span>{{itemLevelAddress.name}}
                              </span>
                             <span v-if="item.four_lever_address == ''">chưa chọn</span>
                          </td>
                          <td>
                            <div v-for="(script, index) in item.scripts" class="mb-3" :key="index">
                              <div class="mb-1"><b>
                                Kịch bản {{ script.script_name }} ({{ [].concat(script.applies || []).join('') }}):
                              </b></div>
                              <div>
                                <span>{{
                                    [].concat(script.customer_types,
                                      script.shop_types,
                                      script.special_orders,
                                      script.order_types,
                                      script.receive_addresses,
                                      script.contact_ways,
                                      script.deliver_requirements
                                    ).filter(a => !!a).join(', ')
                                  }}</span>
                              </div>
                              <div>
                                <b>Tỉ lệ thành công:</b>
                                <span>{{ [].concat(script.success_rates || []).join(', ') }}</span>
                              </div>
                              <div>
                                <b>Thời gian giao hàng:</b>
                                <span>{{ [].concat(script.deliver_times || []).join(', ') }}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                              <div class="buttonAction">
                                <router-link :to="{name: '/edit-cart', params: { id: getCartIdEdit(item.carts)}}">
                                <button class="btn btn-success">Sửa</button>
                                </router-link>
                                <button class="btn btn-secondary mt-1">Xem log</button>
                                <router-link :to="{name: 'manage-list-cart/config-return-cart', params: { id: item.carts.id, alias: item.carts.alias}}">
                                  <button class="btn btn-info mt-1" v-if="item.carts.type === '1' || item.carts.type === '3'">Config Shop</button>
                                </router-link>
                              </div>
                          </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </b-card>
        </b-col>
      </b-form-row>
          </div>
          <div class="no-data" v-if="dataLogs.length == 0">
            <b-alert show dismissible variant="warning">
              <i class="sidenav-icon ion ion-ios-warning"></i>
               Không có dữ liệu phù hợp, vui lòng thử lại.
            </b-alert>
          </div>
          </div>
        </b-form>
      </div>
    <b-card-body class="pt-0 pb-3">
          <div class="row">
            <div class="col-md-12 pt-3 element">
              <div>
                Tổng số bản ghi: {{ dataPage.totalItems }}
                <b-pagination
                  style="z-index: 0;"
                  :total-rows="dataPage.totalItems"
                  v-model="dataPage.currentPage"
                  :per-page="dataPage.perPage"
                  v-on:change="pageChanged"
                />
              </div>
              <div class="select">
                <span class="text-muted" v-if="dataPage.totalItems"
                  >Trang {{ dataPage.currentPage }} trên {{ totalPages }}</span
                >
              </div>
            </div>
          </div>
        </b-card-body>
        <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>

<script>
import manageLine from 'domain/entities/manageLine'
import * as _ from 'lodash'
import Multiselect from 'vue-multiselect'
import SelectLine from 'components/elements/FilterBox/SelectLine'
import SelectModule from 'components/elements/FilterBox/SelectModule'
import SelectProvince from 'components/elements/FilterBox/SelectProvince'
import SelectStationCarts from 'components/elements/FilterBox/SelectStationCarts'
import MultiSelectShopCarts from 'components/elements/common/MultiSelectShopCarts'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import ManageLineService from 'domain/services/manage-line-service'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  data () {
    return {
      optionTypeLine: manageLine.optionsTypeLine,
      optionRegions: manageLine.optionsRegions,
      optionActive: manageLine.optionsActive,
      inputDisable: false,
      flagStation: 1,
      dataPage: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 25
      },
      dataInput: {
        type_line: [],
        regions: [],
        active: 1,
        stationDefault: [
        ]
      },
      stationId: '',
      selected: {
        shops: [],
        stations: [],
        line: [],
        province: [],
        module: []
      },
      dataLogs: [],
      loadingButton: false,
      appLoading: false,
      checkResult: false,
      loadingTransfer: false
    }
  },
  watch: {
    'dataInput.regions': function (newValue, oldValue) {
      this.selected.province = []
      this.$refs.selectProvince.reset()
      this.selected.stations = []
      this.$refs.selectStations.reset()
      this.dataInput.type_line = []
      this.selected.module = []
      this.$refs.selectModule.reset()
      this.selected.line = []
      this.$refs.selectLine.resetValue()
    },
    'selected.province': function (newValue, oldValue) {
      this.selected.stations = []
      this.$refs.selectStations.reset()
      this.dataInput.type_line = []
      this.selected.module = []
      this.$refs.selectModule.reset()
      this.selected.line = []
      this.$refs.selectLine.resetValue()
    },
    'selected.stations': function (newValue, oldValue) {
      this.dataInput.type_line = []
      this.selected.module = []
      this.$refs.selectModule.reset()
      this.selected.line = []
      this.$refs.selectLine.resetValue()
    },
    'selected.module': function (newValue, oldValue) {
      this.selected.line = []
      this.$refs.selectLine.resetValue()
    }
  },
  async created () {
    await this.getUserInfo()
    await this.searchManageLine()
  },
  mounted () {
  },
  components: {
    Multiselect,
    SelectLine,
    SelectModule,
    SelectProvince,
    SelectStationCarts,
    MultiSelectShopCarts,
    LaddaBtn,
    LoadingMiniBottom
  },
  methods: {
    async searchManageLine (page, newSearchConditions) {
      this.appLoading = true
      this.loadingButton = true
      let params = {}

      if (this.dataInput.regions.length > 0) {
        params['region_id'] = this.dataInput.regions.map(el => el.value)
      }

      if (this.selected.province) {
        params['province_id'] = this.selected.province
      }

      if (this.selected.stations.length > 0) {
        this.flagStation = 1
        params['station_id'] = this.selected.stations
      } else {
        this.flagStation = 2
        params['station_id'] = this.stationId
      }

      if (this.dataInput.type_line.length > 0) {
        params['type'] = this.dataInput.type_line.map(el => el.value)
      }

      if (this.dataInput.active) {
        params['is_visible'] = this.dataInput.active
      }

      if (this.selected.module) {
        params['module_id'] = this.selected.module
      }

      if (this.selected.line) {
        params['lst_cart_id'] = this.selected.line
      }

      if (this.selected.shops) {
        params['shop_id'] = this.selected.shops
      }

      if (newSearchConditions) {
        this.dataPage.currentPage = 1
        params.page = 1
      }

      params['page'] = this.dataPage.currentPage
      params['limit'] = this.dataPage.perPage
      await ManageLineService.searchManageLine(params).then((response) => {
        if (response.data.success) {
          this.checkResult = response.data.success
          this.dataPage.totalItems = response.data.count
          this.dataLogs = response.data.data
          this.offLoading()
          this.flagStation = 1
        } else {
          commonHelper.showMessage('Không có dữ liệu', 'error')
          this.offLoading()
          this.flagStation = 1
        }
      }).catch((e) => {
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
        this.offLoading()
        this.flagStation = 1
      })
    },
    async getUserInfo () {
      const res = await ManageLineService.getUserInfo()
      if (res.data.success) {
        this.dataInput.stationDefault = [res.data.userInfo.Station]
        this.stationId = res.data.userInfo.Station.id
      }
    },
    pageChanged (page) {
      this.dataPage.currentPage = page
      this.searchManageLine()
    },
    selectedShopCarts (option) {
      if (!_.isNil(option)) {
        this.selected.shops = _.map(option, 'id')
      }
    },
    selectedLine (option) {
      if (!_.isNil(option)) {
        this.selected.line = _.map(option, 'id')
      }
    },
    offLoading () {
      this.appLoading = false
      this.loadingButton = false
      this.loadingTransfer = false
    },
    getCartIdEdit (cart) {
      if (_.isEmpty(cart.support_cart_delivery)) {
        return cart.id
      }
      return cart.support_cart_delivery.cart_id
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.dataPage.totalItems / this.dataPage.perPage)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-filter {
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  padding: 20px;
}
.cfButton {
  margin-left: 20px;
  display: flex;
  justify-content: center;
}
.cfButton .b1 {
  margin-left: 20px;
}
.custom-select {
  width: 100px;
}
.btn-z-index {
  z-index: 0;
}
.contentHeader {
  display: flex;
  justify-content: space-between;
}
#add-line {
  color: white;
}
.element {
  display: flex;
  justify-content: space-between;
}
</style>
