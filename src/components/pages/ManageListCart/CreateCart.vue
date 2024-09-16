<template>
  <div>
    <div class="ui-block">
      <div class="contentHeader">
        <h3 class="ui-block-heading text-left">Thêm tuyến mới</h3>
        <router-link :to="{name: 'manage-list-cart/list'}">
          <b-btn type="button" variant="success mb-4">Danh sách tuyến</b-btn></router-link>
      </div>
      <div>
        <b-form>
          <div class="form-filter">
            <b-form-row>
              <b-col md="7">
                <b-form-group label="Tên giỏ hàng">
                  <b-form-input v-model="input.cart_alias" placeholder="Nhập tên giỏ hàng"></b-form-input>
                  <div class="noti">Lưu ý: Tên giỏ giao & trả (VD: MT1-01-A1) sẽ được dùng trong mã đơn hàng: S14268.MT1-01-A1.123456789. Bạn không được đặt tên giỏ dài hơn 11 ký tự.</div>
                </b-form-group>
              </b-col>
              <b-col md="5">
                <b-form-group label="COD chính ca 1">
                  <multi-select-name-of-cod
                    @onChange="selectedCod1"
                    :multiple="false"
                    ref="selectedCod1Component"
                  ></multi-select-name-of-cod>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Kiểu giỏ hàng">
                  <b-form-select v-model="input.cart_type" :options="cartTypeOptions"></b-form-select>
                </b-form-group>

                <b-col cols="7" style="margin-bottom: 1rem; padding-left: 0">
                  <b-form-checkbox v-model="input.is_spread_package" :disabled="input.cart_type !== '2'" class="mt-2 text-nowrap">Dàn đơn</b-form-checkbox>
                </b-col>
              </b-col>
              <b-col md="5">
                <b-form-group label="COD ca 1 bổ sung">
                  <multi-select-name-of-cod
                    @onChange="multiSelectedCod1"
                    :multiple="true"
                    ref="multiSelectedCod1Component"
                  ></multi-select-name-of-cod>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Ca sạch tuyến">
                  <b-form-checkbox-group
                    v-model="input.clear_route"
                    :options="clearRouteOptions"
                  ></b-form-checkbox-group>
                </b-form-group>
              </b-col>
              <b-col md="5">
                <b-form-group label="COD chính ca 2">
                  <multi-select-name-of-cod
                    @onChange="selectedCod2"
                    :multiple="false"
                    ref="selectedCod2Component"
                  ></multi-select-name-of-cod>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row class="cart-parent">
              <b-col md="7" v-if="input.cart_type ==='2'">
                <b-form-group label="Giỏ cha">
                  <multi-select-cart-parent
                    @onChange="selectedCartParent"
                  ></multi-select-cart-parent>
                </b-form-group>
              </b-col>
              <b-col md="5" class="bs2">
                <b-form-group label="COD ca 2 bổ sung">
                  <multi-select-name-of-cod
                    @onChange="multiSelectedCod2"
                    :multiple="true"
                    ref="multiSelectedCod2Component"
                  ></multi-select-name-of-cod>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7" v-if="input.cart_type ==='2'">
                <b-form-group label="Giỏ con">
                  <b-form-input disabled></b-form-input>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Ca làm việc">
                  <b-form-select v-model="input.work_shift" :options="workShiftOptions"></b-form-select>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Kho hàng">
                  <multi-select-post-office
                    :type="'station'"
                    :multiple="false"
                    :placeholder="'Chọn kho hàng'"
                    @onChange="selectedStation"
                    ref="stationComponent"
                    :selected="getUserStation"
                  ></multi-select-post-office>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Thuộc bưu cục">
                  <multi-select-post-office
                    :type="'post_office'"
                    :multiple="false"
                    :placeholder="'Chọn bưu cục'"
                    @onChange="selectedPostOffice"
                    ref="postOfficeComponent"
                  ></multi-select-post-office>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Vùng tốc độ">
                  <b-form-select v-model="input.area_speed" :options="areaOptions"></b-form-select>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Vùng tính lương">
                  <b-form-select v-model="input.area" :options="areaOptions"></b-form-select>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Vùng tính lương trả">
                  <b-form-select v-model="input.area_return" :options="areaOptions"></b-form-select>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7" v-if="provinces && provinces.length > 0">
                <b-form-group label="Tỉnh/Thành phố">
                  <multiselect
                    v-model="province"
                    :options="provinces"
                    placeholder="Chọn Tỉnh/Thành phố"
                    :multiple="false"
                    label="name"
                    track-by="id"
                    :custom-label="customLabel"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      <span style="font-weight: bold">{{props.option.id}}:</span>
                      <span>{{props.option.name}}</span>
                    </template>
                    <template slot="option" slot-scope="props">
                      <span style="font-weight: bold">{{props.option.id}}:</span>
                      <span>{{props.option.name}}</span>
                    </template>
                  </multiselect>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Quận/Huyện">
                  <multi-select-address-v2
                    @onChange="selectedDistrict"
                    :type="[3,7]"
                    :parent_id="[input.province_id]"
                    :placeholder="'Chọn quận/huyện'"
                    :multiple="true"
                    ref="districtComponent"
                  ></multi-select-address-v2>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="7">
                <b-form-group label="Thuộc module">
                  <single-module
                    :station_id="input.station_id"
                    @selected="selectedModule"
                    ref="moduleComponent"
                  ></single-module>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="11">
                <b-form-group label="Đường/Phố">
                  <multi-select-address-v2
                    @onChange="selectedStreet"
                    :type="[2]"
                    :parent_id="districtId"
                    :placeholder="'Chọn đường/phố'"
                    ref="streetComponent"
                    :multiple="true"
                  ></multi-select-address-v2>
                </b-form-group>
              </b-col>
              <b-col md="1">
                <b-form-group>
                  <template v-slot:label>&nbsp;</template>
                  <ladda-btn
                    :loading="false"
                    @click.native="clearField('streetComponent')"
                    data-style="expand-right"
                    class="btn btn-md btn-outline-danger">
                    <i class="ion ion-md-trash"></i>
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row v-if="province && province.id === 126 && input.street_id && input.street_id.length > 0">
              <b-col md="11">
                <b-form-group label="Giỏ mặc định của đường/phố">
                  <multi-select-address-v2
                    @onChange="selectedDefaultStreet"
                    :type="[2]"
                    :parent_id="districtId"
                    :placeholder="'Chọn đường/phố'"
                    ref="streetSPComponent"
                    :multiple="true"
                  ></multi-select-address-v2>
                </b-form-group>
              </b-col>
              <b-col md="1">
                <b-form-group>
                  <template v-slot:label>&nbsp;</template>
                  <ladda-btn
                    :loading="false"
                    @click.native="clearField('streetSPComponent')"
                    data-style="expand-right"
                    class="btn btn-md btn-outline-danger">
                    <i class="ion ion-md-trash"></i>
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="11">
                <b-form-group label="Phường/Xã">
                  <multi-select-address-v2
                    @onChange="selectedWard"
                    :type="[1]"
                    :parent_id="districtId"
                    :placeholder="'Chọn phường/xã'"
                    ref="wardComponent"
                    :multiple="true"
                  ></multi-select-address-v2>
                </b-form-group>
              </b-col>
              <b-col md="1">
                <b-form-group>
                  <template v-slot:label>&nbsp;</template>
                  <ladda-btn
                    :loading="false"
                    @click.native="clearField('wardComponent')"
                    data-style="expand-right"
                    class="btn btn-md btn-outline-danger">
                    <i class="ion ion-md-trash"></i>
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row v-if="province && province.id === 126 && input.ward_id  && input.ward_id.length > 0">
              <b-col md="11">
                <b-form-group label="Giỏ mặc định của phường/xã">
                  <multi-select-address-v2
                    @onChange="selectedDefaultWard"
                    :type="[1]"
                    :parent_id="districtId"
                    :placeholder="'Chọn phường/xã'"
                    ref="wardSPComponent"
                    :multiple="true"
                  ></multi-select-address-v2>
                </b-form-group>
              </b-col>
              <b-col md="1">
                <b-form-group>
                  <template v-slot:label>&nbsp;</template>
                  <ladda-btn
                    :loading="false"
                    @click.native="clearField('wardSPComponent')"
                    data-style="expand-right"
                    class="btn btn-md btn-outline-danger">
                    <i class="ion ion-md-trash"></i>
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="11">
                <b-form-group label="Địa chỉ cấp 4">
                  <multi-select-address4
                    @onChange="selectedAddress4"
                    :province_id="input.province_id"
                    :district_id="districtId"
                    :cart_type="input.cart_type"
                    ref="address4Component"
                  ></multi-select-address4>
                </b-form-group>
              </b-col>
              <b-col md="1">
                <b-form-group>
                  <template v-slot:label>&nbsp;</template>
                  <ladda-btn
                    :loading="false"
                    @click.native="clearField('address4Component')"
                    data-style="expand-right"
                    class="btn btn-md btn-outline-danger">
                    <i class="ion ion-md-trash"></i>
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <support-service-form v-if="input.cart_type === '1'" @input="updateServices" :parent_address_ids="[input.province_id]"/>

            <b-form-row>
              <b-col md="8">
                <b-form-group label="Hỗ trợ giao tối">
                  <b-form-checkbox v-model="input.is_support_night"></b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row v-if="input.is_support_night" v-for="(spNight, index) in input.support_night" :key="spNight.id">
              <b-col md="8">
                <b-form-group label="Địa chỉ cấp 5">
                  <multi-select-address5
                    :params="paramLv4"
                    :lv4Ids = "lv4Ids"
                    :type="1"
                    @onChange="multiSelectedAddressNight($event, index)"
                  ></multi-select-address5>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="COD giao tối">
                  <multi-select-name-of-cod @onChange="multiSelectedCodNight($event, index)" :multiple="true"></multi-select-name-of-cod>
                </b-form-group>
              </b-col>
              <b-col md="1">
                <b-form-group>
                  <template v-slot:label>&nbsp;</template>
                  <ladda-btn
                    :loading="false"
                    @click.native="deleteThisRow(index)"
                    data-style="expand-right"
                    class="btn btn-md btn-outline-danger">
                    <i class="ion ion-md-trash"></i>
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row v-if="input.is_support_night" class="text-center">
              <b-col md="12">
                <b-form-group>
                  <ladda-btn v-if="input.is_support_night" @click.native="addRow" data-style="expand-right" class="btn btn-outline-success add-address5">
                    <i class="ion ion-md-add"></i>Thêm hỗ trợ giao tối
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="8">
                <b-form-group label="Hỗ trợ giao chủ nhật">
                  <b-form-checkbox v-model="input.is_support_sunday"></b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row v-if="input.is_support_sunday">
              <b-col md="11">
                <b-form-group label="Địa chỉ cấp 5">
                  <multi-select-address5
                    :params="paramLv4"
                    :lv4Ids = "lv4Ids"
                    :type="2"
                    @onChange="multiSelectedAddressSunday"
                    ref="supportSundayComponent"
                  ></multi-select-address5>
                </b-form-group>
              </b-col>
              <b-col md="1">
                <b-form-group>
                  <template v-slot:label>&nbsp;</template>
                  <ladda-btn
                    :loading="false"
                    @click.native="clearField('supportSundayComponent')"
                    data-style="expand-right"
                    class="btn btn-md btn-outline-danger">
                    <i class="ion ion-md-trash"></i>
                  </ladda-btn>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="8">
                <b-form-group label="Kích hoạt giỏ">
                  <b-form-checkbox v-model="input.is_visible"></b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="8">
                <b-form-group label="Giỏ xfast">
                  <b-form-checkbox v-model="input.is_xfast"></b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="8">
                <b-form-group label="Giỏ BigSize">
                  <b-form-checkbox v-model="input.is_big_size"></b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col md="8">
                <b-form-group>
                  <label>
                    Tuyến khó
                    <i v-b-popover.hover.left="'Config tuyến khó chỉ khả dụng với một số user.'" class="fa fa-info-circle ml-2" ></i>
                  </label>
                  <b-form-checkbox v-model="input.is_difficult" />
                </b-form-group>
              </b-col>
            </b-form-row>

            <div class="text-center">
              <ladda-btn :loading="loadingButton" class="btn btn-success" data-style="expand-right" @click.native="addCart">Lưu giỏ hàng</ladda-btn>
            </div>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import * as _ from 'lodash'
import ConfigCart from 'domain/entities/ConfigCart'
import MultiSelectCartParent from '../../elements/common/MultiSelectCartParent'
import MultiSelectPostOffice from '../../elements/common/MultiSelectPostOffice'
// import MultiSelectAddress from '../../elements/FilterBox/MultiSelectAddress'
import SingleModule from '../../elements/FilterBox/SingleModule'
import MultiSelectAddress4 from '../../elements/FilterBox/MultiSelectAddress4'
import MultiSelectAddress5 from '../../elements/FilterBox/MultiSelectAddress5'
import MultiSelectNameOfCod from '../../elements/common/MultiSelectNameOfCod'
import Multiselect from 'vue-multiselect'
import MultiSelectAddressV2 from '../../elements/FilterBox/MultiSelectAddressV2'
import ManageLineService from 'domain/services/manage-line-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SupportServiceForm from './SupportServiceForm.vue'

export default {
  name: 'CreateCart',
  components: {
    MultiSelectCartParent,
    MultiSelectAddress4,
    MultiSelectNameOfCod,
    MultiSelectAddress5,
    SingleModule,
    MultiSelectAddressV2,
    MultiSelectPostOffice,
    Multiselect,
    LaddaBtn,
    SupportServiceForm
  },
  data: () => ({
    province: null,
    provinces: [],
    loadingButton: false,
    districtId: [],
    clearRouteOptions: ConfigCart.clearRouteOptions,
    cartTypeOptions: ConfigCart.cartTypeOptions,
    workShiftOptions: ConfigCart.workShiftOptions,
    areaOptions: ConfigCart.areaOptions,
    paramLv4: {},
    input: {
      cart_alias: '', // tên giỏ hàng
      cart_type: '1', // kiểu giỏ hàng
      clear_route: [], // ca sạch tuyến
      parent_carts: [], // giỏ cha
      child_carts: [], // giỏ con
      work_shift: '0', // ca làm việc
      station_id: '0', // kho hàng
      post_office_id: '0', // thuộc bưu cục
      area_speed: '0', // vùng tốc độ
      area: '0', // vùng tính lương
      area_return: '0', // vùng tính lương trả
      // area_all: 0, // vùng tính lương toàn trình
      first_cod_id: '', // cod chính ca 1
      cart_cod1: [], // cod ca 1 bổ sung
      second_cod_id: '', // cod chính ca 2
      cart_cod2: [], // cod ca 2 bổ sung
      province_id: '0', // Tỉnh/thành phố
      district_id: [], // quận/ huyện
      module_id: '', // thuộc module
      street_id: [], // đường/ phố
      default_street: [], // đường/ phố mặc định
      ward_id: [], // phường/ xã
      default_ward: [], // phường/ xã mặc định
      lv4_address_id: [], // địa chỉ cấp 4
      is_support_night: false, // hỗ trợ giao tối
      is_service_configured: false, // dịch vụ hỗ trợ
      support_night: [ // hỗ trợ giao tối
        {
          address: [],
          cod: []
        }
      ],
      services: [],
      is_support_sunday: false, // hỗ trợ CN
      support_sunday: [ // hỗ trợ giao CN
        {
          address: [],
          cod: []
        }
      ],
      is_visible: false, // kích hoạt giỏ
      is_xfast: false, // giỏ xfast
      is_big_size: false, // giỏ bigsize
      is_spread_package: false // giỏ dàn đơn
    },
    lv4Ids: null
  }),
  methods: {
    customLabel ({ id, name }) {
      return `${id}: ${name}`
    },

    clearField (componentName) {
      switch (componentName) {
        case 'streetComponent':
          this.$refs.streetComponent.resetValue()
          break
        case 'wardComponent':
          this.$refs.wardComponent.resetValue()
          break
        case 'address4Component':
          this.$refs.address4Component.resetValue()
          break
        case 'supportSundayComponent':
          this.$refs.supportSundayComponent.resetValue()
          break
        case 'stationComponent':
          this.$refs.stationComponent.resetValue()
          break
        case 'postOfficeComponent':
          this.$refs.postOfficeComponent.resetValue()
          break
        case 'districtComponent':
          this.$refs.districtComponent.resetValue()
          break
        case 'moduleComponent':
          this.$refs.moduleComponent.resetValue()
          break
        case 'selectedCod2Component':
          this.$refs.selectedCod2Component.resetValue()
          break
        case 'selectedCod1Component':
          this.$refs.selectedCod1Component.resetValue()
          break
        case 'multiSelectedCod1Component':
          this.$refs.multiSelectedCod1Component.resetValue()
          break
        case 'multiSelectedCod2Component':
          this.$refs.multiSelectedCod2Component.resetValue()
          break
        case 'streetSPComponent':
          this.$refs.streetSPComponent.resetValue()
          break
        case 'wardSPComponent':
          this.$refs.wardSPComponent.resetValue()
          break
        case 'provinceComponent':
          this.$refs.provinceComponent.resetValue()
          break
      }
    },
    multiSelectedAddressNight (option, index) {
      this.input.support_night[index]['address'] = []
      for (const op of option) {
        this.input.support_night[index]['address'].push({
          lv4_id: op.lv4_id,
          lv5_id: op.id
        })
      }
    },
    multiSelectedCodNight (option, index) {
      this.input.support_night[index]['cod'] = _.map(option, 'id')
    },
    multiSelectedAddressSunday (option) {
      this.input.support_sunday = [
        {
          address: [],
          cod: []
        }
      ]

      for (const op of option) {
        this.input.support_sunday[0]['address'].push({
          lv4_id: op.lv4_id,
          lv5_id: op.id
        })
      }
    },
    selectedCod1 (option) {
      if (!_.isEmpty(option)) {
        this.input.first_cod_id = option.id
      }
    },
    multiSelectedCod1 (option) {
      this.input.cart_cod1 = _.isEmpty(option) ? [] : _.map(option, 'id')
    },
    selectedCod2 (option) {
      if (!_.isEmpty(option)) {
        this.input.second_cod_id = option.id
      }
    },
    multiSelectedCod2 (option) {
      this.input.cart_cod2 = _.isEmpty(option) ? [] : _.map(option, 'id')
    },
    selectedModule (option) {
      if (!_.isEmpty(option)) {
        this.input.module_id = option.id
      }
    },
    selectedWard (option) {
      this.input.ward_id = _.isEmpty(option) ? [] : _.map(option, 'id')

      if (this.input.ward_id.length === 0) {
        this.input.default_ward = []
      }
    },
    selectedDefaultWard (option) {
      this.input.default_ward = _.isEmpty(option) ? [] : _.map(option, 'id')
    },
    selectedAddress4 (option) {
      this.input.lv4_address_id = []
      this.paramLv4 = {}
      for (const op of option) {
        this.input.lv4_address_id.push({
          address_id: op.id,
          address_type: op.type
        })
        const addressKey = 'lv4_address_id[' + op.id + ']'
        this.paramLv4[addressKey] = op.name
      }
      this.lv4Ids = option.map(function (item) {
        return item.id
      })
    },
    selectedStreet (option) {
      this.input.street_id = _.isEmpty(option) ? [] : _.map(option, 'id')

      if (this.input.street_id.length === 0) {
        this.input.default_street = []
      }
    },
    selectedDefaultStreet (option) {
      this.input.default_street = _.isEmpty(option) ? [] : _.map(option, 'id')
    },
    selectedDistrict (option) {
      this.input.district_id = []
      for (const op of option) {
        this.input.district_id.push({
          address_id: op.id,
          address_type: op.type
        })
      }

      this.districtId = _.map(option, 'id')
    },
    selectedPostOffice (option) {
      if (!_.isEmpty(option)) {
        this.input.post_office_id = option.id
      }
    },
    selectedStation (option) {
      if (!_.isEmpty(option)) {
        this.input.station_id = String(Array.isArray(option) ? option[0].id : option.id)
      }
    },
    selectedCartParent (option) {
      this.input.parent_carts = _.isEmpty(option) ? [] : _.map(option, 'id')
    },
    validParams () {
      if (_.isEmpty(this.input.cart_alias)) {
        commonHelper.showMessage('Vui lòng nhập tên giỏ hàng', 'error')
        this.loadingButton = false
        return false
      }

      if (this.input.station_id === '0') {
        commonHelper.showMessage('Vui lòng chọn kho', 'error')
        this.loadingButton = false
        return false
      }

      if (this.input.province_id === '0') {
        commonHelper.showMessage('Vui lòng chọn tỉnh/thành phố', 'error')
        this.loadingButton = false
        return false
      }

      if (_.isEmpty(this.input.district_id)) {
        commonHelper.showMessage('Vui lòng chọn quận/huyện', 'error')
        this.loadingButton = false
        return false
      }

      if (_.isEmpty(this.input.module_id)) {
        commonHelper.showMessage('Vui lòng chọn module', 'error')
        this.loadingButton = false
        return false
      }

      if (this.input.is_support_night) {
        for (const spNight of this.input.support_night) {
          if (_.isEmpty(spNight.address) || _.isEmpty(spNight.cod)) {
            commonHelper.showMessage('Nhập đủ thông tin khi chọn hỗ trợ giao tối', 'error')
            this.loadingButton = false
            return false
          }
        }
      }

      if (this.input.is_support_sunday) {
        for (const spSunday of this.input.support_sunday) {
          if (_.isEmpty(spSunday.address)) {
            commonHelper.showMessage('Nhập đủ thông tin khi chọn hỗ trợ giao chủ nhật', 'error')
            this.loadingButton = false
            return false
          }
        }
      }

      if (this.input.is_service_configured) {
        for (const service of this.input.services) {
          if (_.isEmpty(service.service_ids)) {
            commonHelper.showMessage('Dịch vụ hỗ trợ: thiếu thông tin về loại dịch vụ', 'error')
            this.loadingButton = false
            return false
          }

          if (_.isEmpty(service.main_cods)) {
            commonHelper.showMessage('Dịch vụ hỗ trợ: thiếu thông tin về CoD', 'error')
            this.loadingButton = false
            return false
          }

          if (service.is_shop_configured && _.isEmpty(service.config_shops)) {
            commonHelper.showMessage('Dịch vụ hỗ trợ: thiếu thông tin về config shop', 'error')
            this.loadingButton = false
            return false
          }

          if (service.is_address_configured && _.isEmpty(service.config_addresses)) {
            commonHelper.showMessage('Dịch vụ hỗ trợ: thiếu thông tin về config địa chỉ', 'error')
            this.loadingButton = false
            return false
          }

          if (service.main_cods.length !== 1) {
            commonHelper.showMessage('Dịch vụ hỗ trợ: chỉ được chọn 1 CoD lấy chính', 'error')
            this.loadingButton = false
            return false
          }
        }
      }

      return true
    },
    addCart () {
      this.loadingButton = true
      if (!this.validParams()) {
        return
      }

      ManageLineService.addCart(this.input).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.loadingButton = false
          if (response.data.success === true) {
            commonHelper.showMessage('Lưu thông tin thành công', 'success')
            this.resetForm()
          } else {
            commonHelper.showMessage(response.data.message, 'error')
          }
        }
      }).catch((error) => {
        if (error.response) {
          let response = error.response
          if (response.status === 422) {
            this.errors = response.data && response.data.message ? response.data.message : ''
            commonHelper.showMessage(this.errors, 'error')
          }
        }
        this.loadingButton = false
      })
    },
    resetForm () {
      this.province = []
      this.clearField('streetComponent')
      this.clearField('wardComponent')
      this.clearField('address4Component')
      this.clearField('supportSundayComponent')
      this.clearField('stationComponent')
      this.clearField('postOfficeComponent')
      this.clearField('districtComponent')
      this.clearField('moduleComponent')
      this.clearField('selectedCod2Component')
      this.clearField('selectedCod1Component')
      this.clearField('multiSelectedCod1Component')
      this.clearField('multiSelectedCod2Component')
      this.input = {
        cart_alias: '',
        cart_type: '1',
        clear_route: [],
        parent_carts: [],
        child_carts: [],
        work_shift: '0',
        station_id: '0',
        post_office_id: '0',
        area_speed: '0',
        area: '0',
        area_return: '0',
        // area_all: 0, // vùng tính lương toàn trình
        first_cod_id: '',
        cart_cod1: [],
        second_cod_id: '',
        cart_cod2: [],
        province_id: '0',
        district_id: [],
        module_id: '',
        street_id: [],
        default_street: [],
        default_ward: [],
        ward_id: [],
        lv4_address_id: [],
        is_support_night: false,
        support_night: [
          {
            id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
            address: [],
            cod: []
          }
        ],
        services: [],
        is_support_sunday: false,
        support_sunday: [
          {
            address: [],
            cod: []
          }
        ],
        is_visible: false,
        is_xfast: false,
        is_big_size: false,
        is_difficult: false
      }
    },
    addRow () {
      this.input.support_night.push({
        id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
        address: [],
        cod: []
      })
    },
    deleteThisRow (index) {
      this.input.support_night.splice(index, 1)
    },
    initSpNightFields () {
      this.input.support_night = [
        {
          id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
          address: [],
          cod: []
        }
      ]
    },
    getAddresses (dataSend) {
      ManageLineService.getAddressByType(dataSend).then(response => {
        if (response.data.success) {
          if (dataSend.type === 0) {
            this.provinces = response.data.data
          }
          if (_.isEmpty(response.data.data)) {
            this.message = 'Không tìm thấy kết quả'
          }
        } else {
          this.message = 'Không tìm thấy kết quả'
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    },
    updateServices (datas) {
      this.input.services = datas[0]
      this.input.is_service_configured = datas[1]
    }
  },
  computed: {
    getUserStation () {
      return _.isEmpty(this.$store.state.userInfo.Station) ? [] : [this.$store.state.userInfo.Station]
    }
  },
  watch: {
    'input.support_night': {
      deep: true,
      handler: function () {
        if (_.isEmpty(this.input.support_night)) {
          this.input.is_support_night = false
          this.initSpNightFields()
        }
      }
    },
    'input.is_support_sunday': {
      deep: true,
      handler: function () {
        this.input.support_sunday = [{address: [], cod: []}]
      }
    },
    'province': {
      deep: true,
      handler: function () {
        this.districtId = _.map([], 'id')
        this.input.province_id = this.province.id.toString()
      }
    },
    'input.cart_type': {
      deep: true,
      handler: function (newValue, oldValue) {
        if (newValue !== '1') {
          this.input.is_service_configured = false
          this.input.services = []
        }
      }
    }
  },
  created () {
    this.getAddresses({type: 0})
  }
}
</script>

<style lang="scss" scoped>
  .noti {
    color: red;
    font-size: 13px;
  }
  .form-filter {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    padding: 20px;
  }
  .add-sp-night {
    z-index: 0;
  }
  .bs2 {
    right: 0;
    position: absolute;
  }
  .cart-parent {
    position: relative;
  }
  .contentHeader {
    display: flex;
    justify-content: space-between;
  }
  /deep/ label.custom-control-label {
    font-weight: normal;
  }
  /deep/ .ladda-button .ladda-label {
    z-index: 0;
  }
</style>
