<template>
  <div>
    <div class="ui-block">
      <div class="contentHeader">
        <h3 class="ui-block-heading text-left">Sửa tuyến</h3>
        <div>
          <router-link :to="{name: '/create-cart'}"><b-btn type="button" variant="success mb-4">Thêm tuyến mới</b-btn></router-link>
          <router-link :to="{name: 'manage-list-cart/list'}"><b-btn type="button" variant="success mb-4">Danh sách tuyến</b-btn></router-link>
        </div>
      </div>
      <div>
        <b-form>
          <!-- Start Code mới -->
          <b-form-row>
            <b-col md="8">
              <div class="border rounded p-3">
                <b-form-row>
                  <b-col cols="4">
                    <b-form-group label="Tên giỏ hàng">
                      <b-form-input v-model="input.cart_alias" placeholder="Nhập tên giỏ hàng"></b-form-input>
<!--                      <div class="noti">Lưu ý: Tên giỏ giao & trả (VD: MT1.A1) sẽ được dùng trong mã đơn hàng:
                        S14268.MT1.A1.123456789. Bạn không được đặt tên giỏ dài hơn 11 ký tự.
                      </div>-->
                    </b-form-group>
                  </b-col>

                  <b-col cols="4">
                    <b-form-group label="Kiểu giỏ hàng">
                      <b-form-select v-model="input.cart_type" :options="cartTypeOptions"></b-form-select>
                    </b-form-group>
                  </b-col>

                  <b-col cols="4">
                    <b-form-group label="Tình trạng giỏ">
                      <b-form-select v-model="input.is_visible" :options="statusLists"></b-form-select>
                    </b-form-group>
                  </b-col>

                  <b-col cols="12" style="margin-bottom: 1rem">
                    <b-form-checkbox v-model="input.is_spread_package" :disabled="input.cart_type !== '2'" class="mt-2 text-nowrap">Dàn đơn</b-form-checkbox>
                  </b-col>

                  <b-col cols="4">
                    <b-form-group label="Kho hàng">
                      <multi-select-post-office
                        :type="'station'"
                        :multiple="false"
                        :placeholder="'Chọn kho hàng'"
                        @onChange="selectedStation"
                        :selected="resStation"
                        ref="stationComponent"
                      ></multi-select-post-office>
                    </b-form-group>
                  </b-col>

                  <b-col cols="4">
                    <b-form-group label="Thuộc bưu cục">
                      <multi-select-post-office
                        :type="'post_office'"
                        :multiple="false"
                        :placeholder="'Chọn bưu cục'"
                        @onChange="selectedPostOffice"
                        :selected="resPostOffice"
                        ref="postOfficeComponent"
                      ></multi-select-post-office>
                    </b-form-group>
                  </b-col>

                  <b-col cols="4">
                    <b-form-group label="Thuộc module">
                      <single-module
                        :station_id="input.station_id"
                        @selected="selectedModule"
                        :selected="resModule"
                      ></single-module>
                    </b-form-group>
                  </b-col>

                  <div class="w-100"></div>

                  <b-col cols="6">
                    <b-form-group label="Vùng tốc độ">
                      <b-form-select v-model="input.area_speed" :options="areaOptions"></b-form-select>
                    </b-form-group>
                  </b-col>

                  <b-col cols="6">
                    <b-form-group label="Vùng tính lương">
                      <b-form-select v-model="input.area" :options="areaOptions"></b-form-select>
                    </b-form-group>
                  </b-col>

<!--                  <b-col cols="4">-->
<!--                    <b-form-group label="Vùng tính lương trả">-->
<!--                      <b-form-select v-model="input.area_return" :options="areaOptions"></b-form-select>-->
<!--                    </b-form-group>-->
<!--                  </b-col>-->

                  <b-col cols="4">
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
                          <span style="font-weight: bold">{{ props.option.id }}:</span>
                          <span>{{ props.option.name }}</span>
                        </template>
                        <template slot="option" slot-scope="props">
                          <span style="font-weight: bold">{{ props.option.id }}:</span>
                          <span>{{ props.option.name }}</span>
                        </template>
                      </multiselect>
                    </b-form-group>
                  </b-col>

                  <b-col cols="4">
                    <b-form-group label="Quận/Huyện">
                      <multi-select-address-v2
                        @onChange="selectedDistrict"
                        :type="[3,7]"
                        :parent_id="[input.province_id]"
                        :placeholder="'Chọn quận/huyện'"
                        :multiple="true"
                        ref="districtComponent"
                        :selected="resDistrict"
                      ></multi-select-address-v2>
                    </b-form-group>
                  </b-col>

                  <b-col cols="4">
                    <b-form-group label="Phường/Xã">
                      <multi-select-address-v2
                        @onChange="selectedWard"
                        :type="[1]"
                        :parent_id="districtId"
                        :placeholder="'Chọn phường/xã'"
                        ref="wardComponent"
                        :selected="resWard"
                        :multiple="true"
                      ></multi-select-address-v2>
                    </b-form-group>
                  </b-col>

                  <b-col cols="12">
                    <b-form-group label="Đường">
                      <multi-select-address-v2
                        @onChange="selectedStreet"
                        :type="[2]"
                        :parent_id="districtId"
                        :placeholder="'Chọn đường'"
                        ref="streetComponent"
                        :selected="resStreet"
                        :multiple="true"
                      ></multi-select-address-v2>
                    </b-form-group>
                  </b-col>

                  <b-col cols="12">
                    <b-form-group label="Địa chỉ cấp 4">
                      <multi-select-address4
                        @onChange="selectedAddress4"
                        :province_id="input.province_id"
                        :district_id="districtId"
                        :cart_type="input.cart_type"
                        ref="address4Component"
                        :selected="resLv4"
                      ></multi-select-address4>
                    </b-form-group>
                  </b-col>

                </b-form-row>

                <support-service-form v-if="isPickCart" @input="updateServices" :parent_address_ids="[input.province_id]"/>

                <b-form-row class="mb-3">
                  <b-col class="flex-grow-0">
                    <b-form-checkbox v-model="input.is_support_night" class="mt-2 text-nowrap">Giao tối</b-form-checkbox>
                  </b-col>
                  <b-col>
                    <b-form-row v-if="input.is_support_night" v-for="(spNight, index, order) in resSupportNight"
                                :class="{'mb-3': order !== 0}"
                                :key="resSupportNight[index].id">
                      <b-col>
                        <multi-select-address5
                          :params="paramLv4"
                          :type="1"
                          @onChange="multiSelectedAddressNight($event, index)"
                          :selected="resSupportNight[index].address"
                          :lv4Ids="lv4Ids"
                        ></multi-select-address5>
                      </b-col>
                      <b-col md="3">
                        <multi-select-name-of-cod
                          @onChange="multiSelectedCodNight($event, index)"
                          :multiple="true"
                          :selected="resSupportNight[index].cod"
                        ></multi-select-name-of-cod>
                      </b-col>
                      <b-col class="flex-grow-0">
                        <div class="d-flex align-items-center">
                          <ladda-btn
                            :loading="false"
                            @click.native="deleteThisRow(index)"
                            data-style="expand-right"
                            class="btn btn-md btn-outline-danger mr-2">
                            <i class="ion ion-md-trash"></i>
                          </ladda-btn>
                          <ladda-btn @click.native="addRow" data-style="expand-right"
                                     class="btn btn-outline-success add-address5">
                            <i class="ion ion-md-add"></i>
                          </ladda-btn>
                        </div>
                      </b-col>
                    </b-form-row>
                  </b-col>
                </b-form-row>

                <b-form-row class="mb-3">
                  <b-col class="flex-grow-0">
                    <b-form-checkbox v-model="input.is_stall" class="mt-2 text-nowrap">Tuyến chành</b-form-checkbox>
                  </b-col>
                  <b-col v-if="input.is_stall">
                    <b-form-row>
                      <b-col>
                        <b-form-input v-model="input.location_stall_cart.lat" placeholder="Vĩ độ điểm chành"></b-form-input>
                      </b-col>
                      <b-col>
                        <b-form-input v-model="input.location_stall_cart.lng" placeholder="Kinh độ điểm chành"></b-form-input>
                      </b-col>
                    </b-form-row>
                  </b-col>
                </b-form-row>

                <b-form-row class="mb-3">
                  <b-col class="flex-grow-0">
                    <b-form-checkbox v-model="input.is_support_sunday" class="mt-2 text-nowrap">Giao chủ nhật</b-form-checkbox>
                  </b-col>
                  <b-col v-if="input.is_support_sunday">
                    <b-form-row>
                      <b-col>
                        <multi-select-address5
                          :params="paramLv4"
                          :type="2"
                          :selected="resSupportSunday[0]['address']"
                          @onChange="multiSelectedAddressSunday"
                          ref="supportSundayComponent"
                          :lv4Ids="lv4Ids"
                        ></multi-select-address5>
                      </b-col>
                      <b-col class="flex-grow-0">
                        <ladda-btn
                          :loading="false"
                          @click.native="clearField('supportSundayComponent')"
                          data-style="expand-right"
                          class="btn btn-md btn-outline-danger">
                          <i class="ion ion-md-trash"></i>
                        </ladda-btn>
                      </b-col>
                    </b-form-row>
                  </b-col>
                </b-form-row>

                <!-- START LNV-11654 -->
                <template v-if="isSupportCartPicking && isDeliverCart">
                  <b-form-row class="mb-3 w-100">
                    <b-col cols="2">
                      <b-form-checkbox v-model="input.is_support_picking" class="mt-2 text-nowrap">Hỗ trợ lấy hàng
                      </b-form-checkbox>
                    </b-col>
                    <template v-if="input.is_support_picking">
                      <b-col cols="4">
                        <MultiSelectShopType v-model="input.cart_support_picking.shop_type"/>
                      </b-col>
                      <b-col cols="5">
                        <MultiSelectQuantity v-model="input.cart_support_picking.quantities"/>
                      </b-col>
                      <b-col cols="1">
                        <ladda-btn :loading="loadingGetCartSupport" class="btn btn-success" data-style="zoom-in" @click.native="syncPickingAddressApi">Xác nhận</ladda-btn>
                      </b-col>
                    </template>
                  </b-form-row>
                  <template v-if="input.is_support_picking">
                    <b-form-row class="mb-3">
                      <b-col cols="1">
                        <div class="col-form-label">Shop</div>
                      </b-col>
                      <b-col>
                        <MultiSelectPickAddress
                          v-model="input.cart_support_picking.pick_address"
                          :district-ids="input.district_id" ref="selectPickAddress"
                          :pickAddressBigData="input.cart_support_picking.pick_address_bigdata"
                          @updatePickAddressBigData="input.cart_support_picking.pick_address_bigdata = $event"
                          :pickAddressSearch="input.cart_support_picking.pick_address_search"
                          @updatePickAddressSearch="input.cart_support_picking.pick_address_search = $event"
                        />
                      </b-col>
                    </b-form-row>
                    <b-form-row class="mb-3">
                      <b-col cols="1">
                        <div class="col-form-label">Giỏ lấy</div>
                      </b-col>
                      <b-col>
                        <b-form-input readonly v-model="input.cart_alias_pick"></b-form-input>
                      </b-col>
                    </b-form-row>
                  </template>
                </template>
                <!-- END LNV-11654 -->

                <div class="text-center mt-3">
                  <ladda-btn :loading="loadingButton" class="btn btn-success" data-style="expand-right" @click.native="editCart">Lưu giỏ hàng</ladda-btn>
                </div>
              </div>
            </b-col>
            <b-col md="4">
              <div class="border rounded p-3 mb-3">
                <b-form-row>
                  <b-col cols="12">
                    <b-form-group label="COD chính ca 1">
                      <multi-select-name-of-cod
                        @onChange="selectedCod1"
                        :multiple="false"
                        :selected="resFirstCod"
                      ></multi-select-name-of-cod>
                    </b-form-group>
                  </b-col>
<!--                  <b-col cols="12">
                    <b-form-group label="COD ca 1 bổ sung">
                      <multi-select-name-of-cod
                        @onChange="multiSelectedCod1"
                        :multiple="true"
                        :selected="resCartCod1"
                      ></multi-select-name-of-cod>
                    </b-form-group>
                  </b-col>-->

                  <b-col cols="12" v-if="isDeliverCart">
                    <div class="d-flex align-items-center mb-3">
                      <div class="font-label">COD hỗ trợ ca 1</div>
                      <b-button
                        class="ml-3"
                        variant="outline-success"
                        size="sm"
                        @click.prevent="triggerCodSupport1"
                        :disabled="isDisabledAddCodSupport1"
                      ><i class="fas fa-plus"/>
                        Thêm
                      </b-button>
                    </div>
                    <b-form-group>
                      <config-cod-support ref="codSupportRef1" @is-disable-add-button="value => isDisabledAddCodSupport1 = value"
                        v-model="CodSupportFirstWorkshift.cod_supports" :day-of-week="DayOfWeeks" :workshift="1"
                      ></config-cod-support>
                    </b-form-group>
                  </b-col>

                  <b-col cols="12">
                    <b-form-group label="COD chính ca 2">
                      <multi-select-name-of-cod
                        @onChange="selectedCod2"
                        :multiple="false"
                        :selected="resSecondCod"
                      ></multi-select-name-of-cod>
                    </b-form-group>
                  </b-col>

<!--                  <b-col cols="12" class="cart-parent">
                    <b-form-group label="COD ca 2 bổ sung">
                      <multi-select-name-of-cod
                        @onChange="multiSelectedCod2"
                        :multiple="true"
                        :selected="resCartCod2"
                      ></multi-select-name-of-cod>
                    </b-form-group>
                  </b-col>-->

                  <b-col cols="12" v-if="isDeliverCart">
                    <div class="d-flex align-items-center mb-3">
                      <div class="font-label">COD hỗ trợ ca 2</div>
                      <b-button
                        class="ml-3"
                        variant="outline-success"
                        size="sm"
                        @click.prevent="triggerCodSupport2"
                        :disabled="isDisabledAddCodSupport2"
                      ><i class="fas fa-plus"/>
                        Thêm
                      </b-button>
                    </div>
                    <b-form-group>
                      <config-cod-support ref="codSupportRef2" @is-disable-add-button="value => isDisabledAddCodSupport2 = value"
                        v-model="CodSupportSecondWorkshift.cod_supports" :day-of-week="DayOfWeeks" :workshift="2"
                      ></config-cod-support>
                    </b-form-group>
                  </b-col>

                  <b-col cols="12" v-if="isDeliverCart">
                    <div class="text-right">
                      <b-button
                        class="input-size w-100"
                        type="submit"
                        variant="success"
                        :disabled="loadingButtonCodSP"
                        @click.prevent="saveConfigCodSupport"
                      >Lưu cấu hình
                      </b-button>
                    </div>
                  </b-col>
                </b-form-row>
              </div>

              <div class="border rounded p-3">
                <b-form-row>
                  <b-col cols="3" class="font-weight-500 font-label">
                    Ca sạch tuyến
                  </b-col>
                  <b-col>
                    <b-form-group>
                      <b-form-checkbox-group
                        v-model="input.clear_route"
                        :options="clearRouteOptions"
                      ></b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-form-row>

                <b-form-row>
                  <b-col cols="3">
                    <b-form-checkbox v-model="input.is_xfast">Giỏ xfast</b-form-checkbox>
                  </b-col>
                  <b-col cols="3">
                    <b-form-checkbox v-model="input.is_big_size">Giỏ BigSize</b-form-checkbox>
                  </b-col>
                  <b-col cols="3">
                    <b-form-checkbox v-model="input.is_difficult">Tuyến khó</b-form-checkbox>
                  </b-col>
                </b-form-row>

                <div class="text-center mt-3">
                  <ladda-btn :loading="loadingButton" class="btn btn-success w-100" data-style="expand-right"
                             @click.native="editCart">Lưu ca
                  </ladda-btn>
                </div>
              </div>
            </b-col>
          </b-form-row>
          <!-- End Code mới -->

<!--          <div class="form-filter">
            <b-form-row>
              <b-col md="7">

                <b-form-row class="cart-parent">
                  <b-col v-if="input.cart_type ==='2'">
                    <b-form-group label="Giỏ cha">
                      <multi-select-cart-parent
                        @onChange="selectedCartParent"
                        :cartId="this.$route.params.id"
                        :selected="resParentCart"
                      ></multi-select-cart-parent>
                    </b-form-group>
                  </b-col>
                </b-form-row>

                <b-form-row>
                  <b-col v-if="input.cart_type ==='2'">
                    <b-form-group label="Giỏ con">
                      <b-form-input disabled v-model="childAliasNames"></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-form-row>

                <b-form-row>
                  <b-col>
                    <b-form-group label="Ca làm việc">
                      <b-form-select v-model="input.work_shift" :options="workShiftOptions"></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-form-row>

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
                    :selected="resStreet"
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

            <b-form-row v-if="province && parseInt(province.id) === 126 && input.street_id && input.street_id.length > 0">
              <b-col md="11">
                <b-form-group label="Giỏ mặc định của đường/phố">
                  <multi-select-address-v2
                    @onChange="selectedDefaultStreet"
                    :type="[2]"
                    :parent_id="districtId"
                    :placeholder="'Chọn đường/phố'"
                    ref="streetSPComponent"
                    :selected="resDefaultStreet"
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

            <b-form-row v-if="province && parseInt(province.id) === 126 && input.ward_id  && input.ward_id.length > 0">
              <b-col md="11">
                <b-form-group label="Giỏ mặc định của phường/xã">
                  <multi-select-address-v2
                    @onChange="selectedDefaultWard"
                    :type="[1]"
                    :parent_id="districtId"
                    :placeholder="'Chọn phường/xã'"
                    ref="wardSPComponent"
                    :selected="resDefaultWard"
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

            <div class="text-center">
              <ladda-btn :loading="loadingButton" class="btn btn-success" data-style="expand-right" @click.native="editCart">Lưu giỏ hàng</ladda-btn>
            </div>
          </div>-->
        </b-form>
      </div>
      <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingTransfer" />
    </div>
    <b-form class="mt-3 form-filter" v-if="isPickCart">
      <process-time-config/>
    </b-form>

    <!--Kịch bản Capacity theo phiên của cod-->
    <b-form class="mt-3 form-filter"  v-if="isDeliverCart">
      <config-cod-script :cod-options="CodOptions"/>
    </b-form>

    <!-- kịch bản giao hàng check khách -->
    <b-form class="mt-3 form-filter"  v-if="isDeliverCart">
      <config-cart-script :provinceOptions="provinces"/>
    </b-form>
  </div>
</template>

<script>
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import * as _ from 'lodash'
import ConfigCart from 'domain/entities/ConfigCart'
import MultiSelectCartParent from '../../elements/common/MultiSelectCartParent'
import MultiSelectPostOffice from '../../elements/common/MultiSelectPostOffice'
import MultiSelectAddress from '../../elements/FilterBox/MultiSelectAddress'
import SingleModule from '../../elements/FilterBox/SingleModule'
import MultiSelectAddress4 from '../../elements/FilterBox/MultiSelectAddress4'
import MultiSelectAddress5 from '../../elements/FilterBox/MultiSelectAddress5'
import MultiSelectNameOfCod from '../../elements/common/MultiSelectNameOfCod'
import Multiselect from 'vue-multiselect'
import MultiSelectAddressV2 from '../../elements/FilterBox/MultiSelectAddressV2'
import ManageLineService from 'domain/services/manage-line-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import SupportServiceForm from './SupportServiceForm.vue'
import ConfigCodSupport from './ConfigCodSupport'
import ProcessTimeConfig from './ProcessTimeConfig/ProcessTimeConfig'
import ConfigCartScript from './ConfigScript/ConfigCartScript.vue'
import ConfigCodScript from './ConfigScript/ConfigCodScript.vue'
import MultiSelectShopType from '../../elements/FilterBox/MultiSelectShopType.vue'
import MultiSelectQuantity from '../../elements/FilterBox/MultiSelectQuantity.vue'
import MultiSelectPickAddress from '../../elements/FilterBox/MultiSelectPickAddress.vue'

Vue.use(BlockUI)

export default {
  name: 'EditCart',
  components: {
    MultiSelectPickAddress,
    MultiSelectQuantity,
    MultiSelectShopType,
    MultiSelectCartParent,
    MultiSelectAddress4,
    MultiSelectNameOfCod,
    MultiSelectAddress5,
    SingleModule,
    MultiSelectAddress,
    MultiSelectPostOffice,
    Multiselect,
    MultiSelectAddressV2,
    LaddaBtn,
    SupportServiceForm,
    ConfigCodSupport,
    ProcessTimeConfig,
    ConfigCartScript,
    ConfigCodScript
  },
  data: () => ({
    isDisabledAddCodSupport1: false,
    isDisabledAddCodSupport2: false,
    province: null,
    lv4Ids: null,
    provinces: [],
    loadingButton: false,
    loadingTransfer: false,
    loadingButtonCodSP: false,
    loadingGetCartSupport: false,
    districtId: [],
    resDistrict: [],
    resProvicne: [],
    resStreet: [],
    resDefaultStreet: [],
    resWard: [],
    resDefaultWard: [],
    resStation: [],
    resPostOffice: [],
    resModule: [],
    resLv4: [],
    resSecondCod: [],
    resFirstCod: [],
    resCartCod1: [],
    resCartCod2: [],
    resParentCart: [],
    resSupportNight: [],
    resSupportSunday: [],
    childAliasNames: '',
    clearRouteOptions: ConfigCart.clearRouteOptions,
    cartTypeOptions: ConfigCart.cartTypeOptions,
    workShiftOptions: ConfigCart.workShiftOptions,
    areaOptions: ConfigCart.areaOptions,
    paramLv4: {},
    statusLists: {
      'false': 'Không hoạt động',
      'true': 'Đang hoạt động'
    },
    stationSupportCartPicking: [],
    input: {
      cart_alias: '', // tên giỏ hàng
      cart_type: '1', // kiểu giỏ hàng
      clear_route: [], // ca sạch tuyến
      parent_carts: [], // giỏ cha
      work_shift: '0', // ca làm việc
      station_id: '0', // kho hàng
      post_office_id: '0', // thuộc bưu cục
      area_speed: '0', // vùng tốc độ
      area: '0', // vùng tính lương
      area_return: '0', // vùng tính lương trả
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
      services: [], // DV hỗ trợ
      support_night: [ // hỗ trợ giao tối
        {
          address: [],
          cod: []
        }
      ],
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
      is_spread_package: false, // giỏ dàn đơn
      is_difficult: false, // OSNV-2028 tuyến khó
      is_support_picking: false, // hỗ trợ lấy hàng
      cart_alias_pick: '', // tên giỏ hỗ trợ lấy hàng
      cart_support_picking: {
        shop_type: null,
        quantities: [],
        pick_address_bigdata: [],
        pick_address_search: [],
        pick_address: []
      },
      is_stall: false, // tuyến chành
      location_stall_cart: {
        lng: '', // kinh độ
        lat: '' // vĩ độ
      }
    },
    pick_address_bigdata_selected: [],
    ready: false,
    CodSupports: {},
    CodSupportFirstWorkshift: {
      cod_id: '',
      work_shift: 1,
      cod_supports: []
    },
    CodSupportSecondWorkshift: {
      cod_id: '',
      work_shift: 2,
      cod_supports: []
    },
    DayOfWeeks: [],
    htmlTransfer: `<div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>
        <h5 class="text-center mb-0">LOADING...</h5>`,
    CodOptions: []
  }),
  methods: {
    triggerCodSupport1 () {
      this.$refs.codSupportRef1.addConfigCodSupport()
    },
    triggerCodSupport2 () {
      this.$refs.codSupportRef2.addConfigCodSupport()
    },
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
        case 'streetSPComponent':
          this.$refs.streetSPComponent.resetValue()
          break
        case 'wardSPComponent':
          this.$refs.wardSPComponent.resetValue()
          break
      }
    },
    multiSelectedAddressNight (option, index) {
      this.resSupportNight[index]['address'] = option
    },
    multiSelectedCodNight (option, index) {
      this.resSupportNight[index]['cod'] = option
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
        this.CodSupportFirstWorkshift.cod_id = option.id
      }
    },
    multiSelectedCod1 (option) {
      this.input.cart_cod1 = _.isEmpty(option) ? [] : _.map(option, 'id')
    },
    selectedCod2 (option) {
      if (!_.isEmpty(option)) {
        this.input.second_cod_id = option.id
        this.CodSupportSecondWorkshift.cod_id = option.id
      }
    },
    multiSelectedCod2 (option) {
      this.input.cart_cod2 = _.isEmpty(option) ? [] : _.map(option, 'id')
    },
    selectedModule (option) {
      if (!_.isEmpty(option)) {
        this.input.module_id = String(Array.isArray(option) ? option[0].id : option.id)
      }
    },
    selectedWard (option) {
      this.input.ward_id = _.isEmpty(option) ? [] : _.map(option, 'id')

      if (this.input.street_id.length === 0) {
        this.resDefaultWard = []
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
        this.resDefaultStreet = []
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
        this.input.post_office_id = String(Array.isArray(option) ? option[0].id : option.id)
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
    editCart () {
      this.loadingButton = true

      if (_.isEmpty(this.input.cart_alias)) {
        commonHelper.showMessage('Vui lòng nhập tên giỏ hàng', 'error')
        this.loadingButton = false
        return
      }

      if (this.input.station_id === '0') {
        commonHelper.showMessage('Vui lòng chọn kho', 'error')
        this.loadingButton = false
        return
      }

      if (this.input.province_id === '0') {
        commonHelper.showMessage('Vui lòng chọn tỉnh/thành phố', 'error')
        this.loadingButton = false
        return
      }

      if (_.isEmpty(this.input.district_id)) {
        commonHelper.showMessage('Vui lòng chọn quận/huyện', 'error')
        this.loadingButton = false
        return
      }

      if (_.isEmpty(this.input.module_id)) {
        commonHelper.showMessage('Vui lòng chọn module', 'error')
        this.loadingButton = false
        return
      }

      this.input['cart_id'] = this.$route.params.id
      this.input.support_night = []
      for (const spNight of this.resSupportNight) {
        const inputAddress = []
        for (const address of spNight.address) {
          inputAddress.push({
            lv4_id: address.lv4_id,
            lv5_id: address.id
          })
        }
        this.input.support_night.push({
          address: inputAddress,
          cod: _.map(spNight.cod, 'id')
        })
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
            commonHelper.showMessage('Dịch vụ hỗ trợ: thiếu thông tin về CoD', 'error')
            this.loadingButton = false
            return false
          }
        }
      }

      if (this.input.is_support_night) {
        for (const spNight of this.input.support_night) {
          if (_.isEmpty(spNight.address) || _.isEmpty(spNight.cod)) {
            commonHelper.showMessage('Nhập đủ thông tin khi chọn hỗ trợ giao tối', 'error')
            this.loadingButton = false
            return
          }
        }
      }

      if (this.input.is_support_sunday) {
        for (const spSunday of this.input.support_sunday) {
          if (_.isEmpty(spSunday.address)) {
            commonHelper.showMessage('Nhập đủ thông tin khi chọn hỗ trợ giao chủ nhật', 'error')
            this.loadingButton = false
            return
          }
        }
      }

      if (this.input.is_stall) {
        const stallCartLat = this.input.location_stall_cart.lat
        const stallCartLng = this.input.location_stall_cart.lng
        if (_.isEmpty(stallCartLat) || _.isEmpty(stallCartLng)) {
          commonHelper.showMessage('Nhập đủ thông tin khi chọn tuyến chành', 'error')
          this.loadingButton = false
          return
        }

        if (!_.isEmpty(stallCartLat) || !_.isEmpty(stallCartLng)) {
          const isLatRegex = new RegExp('^[-+]?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$')
          const isLngRegex = new RegExp('^[-+]?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$')
          if (
            !isLatRegex.test(stallCartLat) ||
            parseInt(stallCartLat) === 0
          ) {
            commonHelper.showMessage('Vĩ độ không đúng cú pháp', 'error')
            this.loadingButton = false
            return
          }
          if (
            !isLngRegex.test(stallCartLng) ||
            parseInt(stallCartLng) === 0
          ) {
            commonHelper.showMessage('Kinh độ không đúng cú pháp', 'error')
            this.loadingButton = false
            return
          }
        }
      }
      ManageLineService.editCart(this.input).then(response => {
        if (response.data.hasOwnProperty('success')) {
          this.loadingButton = false
          if (response.data.success === true) {
            commonHelper.showMessage('Lưu thông tin thành công', 'success')
          } else {
            commonHelper.showMessage(response.data.message, 'error')
          }
        }
      }).catch((error) => {
        console.log(error)
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
    addRow () {
      this.resSupportNight.push({
        id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
        address: [],
        cod: []
      })
    },
    deleteThisRow (index) {
      this.resSupportNight.splice(index, 1)
    },
    initSpNightFields () {
      this.resSupportNight = [
        {
          id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
          address: [],
          cod: []
        }
      ]
    },
    initFormData () {
      this.loadingTransfer = true
      ManageLineService.getCartById({ id: this.$route.params.id }).then(response => {
        if (response.data.success && !_.isEmpty(response.data.data)) {
          this.initField(response.data.data)
          this.ready = true
          this.loadingTransfer = false
        } else {
          this.loadingTransfer = false
          commonHelper.showMessage(response.data.message, 'error')
        }
      }).catch((e) => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại', 'error')
        this.loadingTransfer = false
      }).then(() => {
        this.loadingTransfer = false
      })
    },
    initField (data) {
      if (!_.isNull(data.cart_support_picking)) {
        this.input.is_support_picking = !!data.cart_support_picking.is_visible
        this.input.cart_alias_pick = data.cart_support_picking.alias
        this.input.cart_support_picking.shop_type = data.cart_support_picking.shop_type
        this.input.cart_support_picking.quantities = data.cart_support_picking.quantities
        this.input.cart_support_picking.pick_address_bigdata = data.cart_support_picking.pick_address_bigdata
        this.pick_address_bigdata_selected = data.cart_support_picking.pick_address_bigdata
        this.input.cart_support_picking.pick_address_search = data.cart_support_picking.pick_address_search
      } else {
        this.input.cart_alias_pick = 'L.' + data.cart_alias
      }

      this.input.cart_alias = data.cart_alias
      this.input.cart_type = data.cart_type
      this.input.clear_route = data.clear_route
      this.resParentCart = data.parent_carts
      this.input.work_shift = _.isNil(data.work_shift) ? '0' : data.work_shift
      this.resStation = data.station_id === '0' ? [] : [
        {
          id: data.station_id,
          name: data.station_name
        }
      ]
      this.resPostOffice = data.post_office_id === '0' ? [] : [
        {
          id: data.post_office_id,
          name: data.post_office_name
        }
      ]
      this.input.area_speed = data.area_speed
      this.input.area = data.area
      this.input.area_return = data.area_return
      this.resFirstCod = _.isEmpty(data.first_cod_id) ? [] : [
        {
          id: data.first_cod_id,
          fullname: data.first_cod_name
        }
      ]
      if (!_.isEmpty(data.first_cod_id)) {
        this.CodOptions.push(
          {
            id: data.first_cod_id,
            fullname: data.first_cod_name
          }
        )
      }
      this.resSecondCod = _.isEmpty(data.second_cod_id) ? [] : [
        {
          id: data.second_cod_id,
          fullname: data.second_cod_name
        }
      ]
      if (!_.isEmpty(data.second_cod_id)) {
        this.CodOptions.push(
          {
            id: data.second_cod_id,
            fullname: data.second_cod_name
          }
        )
      }
      this.input.cart_cod1 = _.isEmpty(data.cart_cod1) ? [] : _.map(data.cart_cod1, 'id')
      this.resCartCod1 = data.cart_cod1
      this.input.cart_cod2 = _.isEmpty(data.cart_cod2) ? [] : _.map(data.cart_cod2, 'id')
      this.resCartCod2 = data.cart_cod2
      this.resProvicne = data.provinces
      this.province = data.provinces[0]

      for (const districtItem of data.districts) {
        this.input.district_id.push({
          address_id: districtItem.id,
          address_type: districtItem.type
        })
      }
      this.resDistrict = data.districts

      this.input.street_id = _.isEmpty(data.street) ? [] : _.map(data.street, 'id')
      this.resStreet = data.streets
      this.input.ward_id = _.isEmpty(data.wards) ? [] : _.map(data.wards, 'id')
      this.resWard = data.wards

      this.resLv4 = data.lv4_addresses
      for (const lv4Item of data.lv4_addresses) {
        this.input.lv4_address_id.push({
          address_id: lv4Item.id,
          address_type: lv4Item.type
        })
      }

      this.input.is_visible = data.is_visible === '1'
      this.input.is_xfast = data.is_xfast === '1'
      this.input.is_big_size = data.is_big_size === '1'
      this.input.is_difficult = data.is_difficult === '1'
      this.input.is_support_night = data.is_support_night
      this.input.is_support_sunday = data.is_support_sunday
      this.input.is_spread_package = data.is_spread_package === '1'
      this.input.is_stall = data.is_stall
      this.resModule = _.isEmpty(data.module_id) ? [] : [
        {
          id: data.module_id,
          name: data.module_name
        }
      ]

      data.support_night.forEach((item) => {
        this.resSupportNight.push({
          id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
          ...item
        })
      })

      if (_.isEmpty(this.resSupportNight)) {
        this.resSupportNight = [
          {
            id: 'id_' + new Date().getTime().toString() + '_' + Math.random().toString(),
            address: [],
            cod: []
          }
        ]
      }

      this.resSupportSunday = _.isEmpty(data.support_sunday) ? [{address: [], cod: []}] : data.support_sunday
      this.childAliasNames = _.map(data.child_carts, 'alias').toString()
      this.input.default_street = _.isEmpty(data.default_streets) ? [] : _.map(data.default_streets, 'id')
      this.resDefaultStreet = data.default_streets
      this.input.default_ward = _.isEmpty(data.default_wards) ? [] : _.map(data.default_wards, 'id')
      this.resDefaultWard = data.default_wards
      this.input.location_stall_cart.lat = data.location_stall_cart.lat
      this.input.location_stall_cart.lng = data.location_stall_cart.lng
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
    },
    getDayOfWeekDefault () {
      ManageLineService.getDayOfWeekDefault().then(response => {
        if (response) {
          this.DayOfWeeks = response
        } else {
          this.message = 'Không tìm thấy thông tin'
        }
      }).catch(() => {
        this.message = 'Không tìm thấy thông tin'
      }).then(() => {
        this.asyncLoading = false
      })
    },
    getConfigCodWeeklySupport () {
      ManageLineService.getConfigCodWeeklySupport({ cart_id: this.$route.params.id }).then(response => {
        if (response) {
          this.CodSupports = response
          if (!_.isEmpty(this.CodSupports[1])) {
            this.CodSupportFirstWorkshift = this.CodSupports[1]
          }
          if (!_.isEmpty(this.CodSupports[2])) {
            this.CodSupportSecondWorkshift = this.CodSupports[2]
          }
        } else {
          this.message = 'Không tìm thấy thông tin'
        }
      }).catch(() => {
        this.message = 'Không tìm thấy thông tin'
      }).then(() => {
        this.asyncLoading = false
      })
    },
    async saveConfigCodSupport () {
      this.loadingButtonCodSP = true
      const codSupportFirstWorkshift = !_.isEmpty(this.CodSupportFirstWorkshift.cod_supports) ? this.CodSupportFirstWorkshift.cod_supports : []
      const codSupportSecondWorkshift = !_.isEmpty(this.CodSupportSecondWorkshift.cod_supports) ? this.CodSupportFirstWorkshift.cod_supports : []
      const codSupports = [codSupportFirstWorkshift, codSupportSecondWorkshift]

      for (const codSupportItem of codSupports) {
        if (_.isEmpty(codSupportItem)) {
          continue
        }
        for (const codSupportRow of codSupportItem) {
          if (_.isEmpty(codSupportRow.cod_support.id)) {
            commonHelper.showMessage('Cod hỗ trợ chưa được truyền lên', 'error')
            this.loadingButtonCodSP = false
            return false
          }
        }
      }

      // Set data để lưu
      const codSupportData = {
        1: this.CodSupportFirstWorkshift,
        2: this.CodSupportSecondWorkshift
      }

      let data = {cod_support_data: codSupportData}
      let cartId = this.$route.params.id

      try {
        await ManageLineService.saveConfigCodWeeklySupport(cartId, data)
        commonHelper.showMessage('Lưu thông tin Cod hỗ trợ thành công', 'success')
        this.loadingButtonCodSP = false
      } catch (reason) {
        commonHelper.showMessage(reason, 'error')
        this.loadingButtonCodSP = false
      }
    },
    async syncPickingAddressApi () {
      this.loadingGetCartSupport = true
      const addressIds = _.map(this.input.lv4_address_id, (item) => Number(item.address_id))
      if (addressIds.length === 0) {
        addressIds.push(
          ..._.map(this.input.street_id, (streetId) => Number(streetId)),
          ..._.map(this.input.ward_id, (wardId) => Number(wardId))
        )
      }
      const params = {
        address_ids: addressIds,
        shop_type: this.input.cart_support_picking.shop_type,
        quantities: this.input.cart_support_picking.quantities
      }
      ManageLineService.getPickAddress(params).then(response => {
        if (response.data.success) {
          if (response.data.data.length === 0) {
            commonHelper.showMessage('Không tìm thấy shop thỏa mãn, chọn điều kiện khác.', 'warning')
          } else {
            this.input.cart_support_picking.pick_address_bigdata = response.data.data
          }
        } else {
          commonHelper.showMessage(response.data.message, 'error')
        }
      }).catch((error) => {
        console.log(error)
      })
      this.loadingGetCartSupport = false
    },
    getStationSupportCartPicking () {
      ManageLineService.getGlobalStationSupportCartPicking().then(response => {
        if (response.data.success) {
          this.stationSupportCartPicking = response.data.data
        } else {
          commonHelper.showMessage(response.data.message, 'error')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    resetPickAddressBigData () {
      if (this.pick_address_bigdata_selected.length > 0) {
        this.input.cart_support_picking.pick_address_bigdata = this.pick_address_bigdata_selected
      } else {
        this.input.cart_support_picking.pick_address_bigdata = []
      }
    }
  },
  computed: {
    isDeliverCart () {
      return Number(this.input.cart_type) === ConfigCart.cartTypes.delivering.value
    },
    isPickCart () {
      return (Number(this.input.cart_type) === ConfigCart.cartTypes.picking.value) && this.ready
    },
    isSupportCartPicking () {
      if (_.includes(this.stationSupportCartPicking, '*')) {
        return true
      }
      const stationIds = this.stationSupportCartPicking.map(stationId => Number(stationId))
      return _.includes(stationIds, Number(this.input.station_id))
    }
  },
  watch: {
    'resSupportNight': {
      deep: true,
      handler: function () {
        if (_.isEmpty(this.resSupportNight)) {
          this.input.is_support_night = false
          this.initSpNightFields()
        }
      }
    },
    'input.district_id': {
      deep: true,
      handler: function () {
        this.districtId = _.map(this.input.district_id, 'address_id')
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
        this.districtId = []
        this.input.province_id = String(Array.isArray(this.province) ? this.province[0].id : this.province.id)
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
    },
    'input.cart_support_picking.shop_type': function () {
      this.resetPickAddressBigData()
    },
    'input.cart_support_picking.quantities': function () {
      this.resetPickAddressBigData()
    }
  },
  created () {
    this.getStationSupportCartPicking()
    this.initFormData()
    this.getDayOfWeekDefault()
    this.getAddresses({type: 0})
    this.getConfigCodWeeklySupport()
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
