<template>
  <div>
    <div class="ui-block">
      <b-form-row>
        <h4 class="ui-block-heading col-md-10">Quản lý khu vực lấy giao</h4>
      </b-form-row>
      <div class="search-form">
        <form>
          <b-form-row>
            <div class="col-md-6">
              <b-form-group>
                <select-addresses
                  ref="select_addresses"
                  @getProvince="filterData.province_ids = $event"
                  @getDistrict="filterData.district_ids = $event"
                  @getWardStreet="filterData.ward_street_ids = $event"
                  @getHamlet="filterData.hamlet_ids = $event"
                />
              </b-form-group>
            </div>

            <div class="col-md-6">
              <b-form-group label="Lý do">
                <multi-select
                  v-model="filterData.reason"
                  track-by="name"
                  label="name"
                  placeholder="Chọn lý do"
                  open-direction="bottom"
                  :options="listReasonsForSearch"
                  selectLabel=""
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="false"
                />
              </b-form-group>

              <b-form-group label="Lấy/Giao">
                <multi-select
                  v-model="filterData.pick_or_deliver"
                  track-by="name"
                  label="name"
                  placeholder="Lấy hoặc Giao"
                  open-direction="bottom"
                  :options="orderOptionsForSearch"
                  selectLabel=""
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="false"
                />
              </b-form-group>

              <b-form-group label="Loại shop">
                <multi-select
                  v-model="filterData.shop_type"
                  track-by="name"
                  label="name"
                  placeholder="Loại shop"
                  open-direction="bottom"
                  :options="listShopTypesForSearch"
                  selectLabel=""
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="false"
                />
              </b-form-group>

              <b-form-group label="Đã chặn/Chưa chặn">
                <multi-select
                  v-model="filterData.is_blocked"
                  track-by="name"
                  label="name"
                  placeholder="Đã chặn/Chưa chặn"
                  :options="blockTypesForSearch"
                  selectLabel=""
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="false"
                />
              </b-form-group>

              <b-form-row>
                <div class="col-md-6 mt-3">
                  <b-form-group class="box-close-from" label="Thời gian chặn từ ngày">
                    <date-picker
                      class="close-from"
                      v-model="filterData.close_from"
                      :bootstrap-styling=true
                      format="dd-MM-yyyy"
                      placeholder="Chặn từ ngày"
                      open-direction="bottom"
                      :calendar-button=true
                      calendar-button-icon="fa fa-calendar"
                      :clear-button="true"
                    />
                  </b-form-group>
                </div>
                <div class="col-md-6 mt-3">
                  <b-form-group class="box-close-from" label="Thời gian chặn đến ngày">
                    <date-picker
                      class="close-to"
                      v-model="filterData.close_to"
                      :bootstrap-styling=true
                      format="dd-MM-yyyy"
                      placeholder="Chặn đến ngày"
                      open-direction="bottom"
                      :calendar-button=true
                      calendar-button-icon="fa fa-calendar"
                      :clear-button="true"
                    />
                  </b-form-group>
                </div>
              </b-form-row>
            </div>
          </b-form-row>
        </form>
      </div>

      <b-form-row class="mt-4 mb-4">
        <div class="align-content-center center">
          <ladda-btn
            :loading="loading[7]"
            @click.native="resetForm"
            data-style="zoom-out"
            class="btn btn-secondary mr-1"
          >
            <i class="fas fa-sync-alt"></i>
            Nhập lại
          </ladda-btn>

          <ladda-btn
            :loading="loading[7]"
            @click.native="getAreasData(1)"
            data-style="zoom-out"
            class="btn btn-success"
          >
            <i class="sidenav-icon ion ion-md-search"></i>
            Tìm kiếm
          </ladda-btn>
        </div>
      </b-form-row>

      <div class="result" id="results" v-if="areasData">
        <div class="row">
          <div class="col-md-3 ml-4">
            <span class="text-muted" v-if="pageData.total_items">Tìm thấy {{ pageData.total_items }} địa chỉ</span>
          </div>
        </div>

        <!-- Pagination -->
          <b-card-body class="pt-0 pb-3">
            <div class="row">
              <div class="col-sm pt-3">
                <b-pagination
                  :total-rows="pageData.total_items"
                  v-model="pageData.current_page"
                  :per-page="pageData.perpage"
                  v-on:change="pageChanged"
                />
              </div>
              <div class="col-sm text-sm-left text-center pt-3">
                <span class="text-muted" v-if="pageData.total_items">Trang {{ pageData.current_page }} trên {{ pageData.total_pages }}</span>
              </div>
            </div>
          </b-card-body>
        <!-- / Pagination -->

        <b-modal id="modal-scrollable" scrollable hide-footer title="Lựa chọn cấu hình" v-model="isShowModalOptionDetail">
          <b-form-group class="box-close-from">
            <span class="title-form-area">Thời gian chặn từ ngày</span>
            <span class="ml-2" v-show="errors.first('select-close-from')" style="color: red">(Cần chọn thời gian chặn từ ngày)</span>
            <span class="ml-2" v-show="isFailValidateCloseFrom" style="color: red">(Thời gian từ ngày phải nhỏ hơn đến ngày)</span>
            <date-picker
              name="select-close-from"
              v-validate="'required'"
              class="close-from"
              v-model="selectCloseFrom"
              :bootstrap-styling=true
              format="dd-MM-yyyy"
              placeholder="Chặn từ ngày"
              open-direction="bottom"
              :calendar-button=true
              calendar-button-icon="fa fa-calendar"
              :clear-button="true"
            />
          </b-form-group>

          <b-form-group>
            <span class="title-form-area">Thời gian chặn đến ngày</span>
            <span class="ml-2" v-show="errors.first('select-close-to')" style="color: red">(Cần chọn thời gian chặn đến ngày)</span>
            <span class="ml-2" v-show="isFailValidateCloseTo" style="color: red">(Thời gian đến ngày phải lớn hơn từ ngày)</span>
            <date-picker
              name="select-close-to"
              v-validate="'required'"
              class="close-to"
              v-model="selectCloseTo"
              :bootstrap-styling=true
              format="dd-MM-yyyy"
              placeholder="Chặn đến ngày"
              open-direction="bottom"
              :calendar-button=true
              calendar-button-icon="fa fa-calendar"
              :clear-button="true"
            />
          </b-form-group>

          <b-form-group>
            <span class="title-form-area">Lý do</span>
            <span class="ml-2" v-show="errors.first('select-reason')" style="color: red">(Cần chọn lý do)</span>
            <multi-select
              name="select-reason"
              v-validate="'required'"
              v-model="selectedReason"
              track-by="name"
              label="name"
              placeholder="Chọn lý do"
              open-direction="bottom"
              :options="listReasons"
              selectLabel=""
              selectedLabel="Đang chọn"
              deselectLabel=""
              :allow-empty="false"
            >
            </multi-select>
          </b-form-group>

          <b-form-group label="Lấy/Giao">
            <multi-select
              v-model="selectedOrderOption"
              track-by="name"
              label="name"
              placeholder="Lấy hoặc Giao"
              open-direction="bottom"
              :options="orderOptions"
              selectLabel=""
              selectedLabel="Đang chọn"
              deselectLabel=""
              :allow-empty="false"
            />
          </b-form-group>

          <b-form-group label="Loại shop">
            <multi-select
              v-model="selectedShopType"
              track-by="name"
              label="name"
              placeholder="Loại shop"
              open-direction="bottom"
              :options="listShopTypes"
              selectLabel=""
              selectedLabel="Đang chọn"
              deselectLabel=""
              :allow-empty="false"
            />
          </b-form-group>

          <div class="mt-1">
            <b-button
              class="btn btn-secondary float-right ml-1"
              @click="isShowModalOptionDetail = false"
            >
              <i class="far fa-hand-point-left"></i>
              Quay lại
            </b-button>
            <b-button
              @click="validateOptionDetail"
              class="btn btn-success float-right"
            >
              <i class="fas fa-check"></i>
              Tiếp tục
            </b-button>
          </div>
        </b-modal>

        <b-modal id="modal-confirm-save" hide-footer v-model="isShowModalSave">
          <h4>Bạn có chắc chắn muốn cập nhật khu vực lấy giao?</h4>
          <div class="mt-1">
            <ladda-btn
              :loading="loading[7]"
              @click.native="isShowModalSave = false"
              data-style="zoom-out"
              class="btn btn-secondary float-right ml-1"
              v-b-modal.modal-1
            >
              <i class="far fa-hand-point-left"></i>
              Thôi, cho nghĩ lại đã!
            </ladda-btn>

            <ladda-btn
              :loading="loading[7]"
              @click.native="saveArea(7, 1)"
              data-style="zoom-out"
              class="btn btn-success float-right"
              v-b-modal.modal-1
            >
              <i class="fas fa-check"></i>
              Chắc chắn, cập nhật khu vực lấy giao!
            </ladda-btn>
          </div>
        </b-modal>

        <b-card no-body>
          <b-form-row class="mb-4">
            <b-button
              class="btn btn-warning config-reason"
              :to="'/area/reason'"
            >
              <i class="far fa-sticky-note"></i>
              Cấu hình lý do chặn đăng đơn
            </b-button>
          </b-form-row>
          <!-- / Table controls -->
          <div class="table-result">
            <!-- Table -->
            <div class="table-responsive mb-4" style="min-height: 300px !important;">
              <table class="table mb-0 table-bordered">
                <tr class="text-center">
                  <th style="width: 110px;">
                    <i class="fas fa-code"></i>
                    Mã địa chỉ
                  </th>
                  <th style="width: 280px;">
                    <i class="fas fa-map-marker-alt"></i>
                    Địa chỉ
                  </th>
                  <th style="width: 170px;">
                    <i class="fas fa-truck"></i>
                    Lấy/Giao
                  </th>
                  <th style="width: 170px;">
                    <i class="fas fa-shopping-bag"></i>
                    Loại shop
                  </th>
                  <th style="width: 380px;">
                    <i class="far fa-sticky-note"></i>
                    Lý do
                  </th>
                  <th>
                    <i class="far fa-clock"></i>
                    Chặn từ ngày
                  </th>
                  <th>
                    <i class="far fa-clock"></i>
                    Chặn đến ngày
                  </th>
                  <th style="width: 175px;">
                    <i class="fas fa-pencil-alt"></i>
                    Cập nhật lần cuối bởi
                  </th>
                  <th style="width: 100px;">
                    <b-form-checkbox
                      v-model="selectAllIsBlocked"
                      value="1"
                      unchecked-value="0"
                      @change="saveAll($event)"
                    >
                      <i class="fas fa-ban"></i>
                      Chặn
                    </b-form-checkbox>
                  </th>
                </tr>
                <tr class="text-center" v-for="(area, index) in areasData" :key="index">
                  <td>
                    <b-form-input
                      v-show="false"
                      v-model="area.id"
                      type="text"
                      disabled
                    />
                    <b-form-input
                      class="text-center"
                      v-model="area.address_id"
                      type="text"
                      disabled
                    />
                  </td>
                  <td class="text-wrap">
                    <!-- <b-form-input
                      class="text-center"
                      v-model="area.address_name"
                      type="text"
                      disabled
                    /> -->
                    {{ area.address_name }}
                  </td>
                  <td>
                    <div :id="'type_' + index" style="">
                      <multi-select
                        class="text-center"
                        v-model="area.type"
                        track-by="name"
                        label="name"
                        placeholder="Chưa có dữ liệu"
                        open-direction="bottom"
                        :options="orderOptions"
                        selectLabel=""
                        selectedLabel=""
                        deselectLabel=""
                        :allow-empty="false"
                        @select="changeType(index, area, $event)"
                      />
                    </div>
                    <div :class="'loading_' + index" style="display: none;">
                      <div class="sk-wave sk-primary" style=" height: 40px; margin: 0 auto;">
                        <div class="sk-rect sk-rect1"></div>
                        <div class="sk-rect sk-rect2"></div>
                        <div class="sk-rect sk-rect3"></div>
                        <div class="sk-rect sk-rect4"></div>
                        <div class="sk-rect sk-rect5"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div :id="'shop-type_' + index" style="">
                      <multi-select
                        class="text-center"
                        v-model="area.shop_type"
                        track-by="name"
                        label="name"
                        placeholder="Chưa có dữ liệu"
                        open-direction="bottom"
                        :options="listShopTypes"
                        selectLabel=""
                        selectedLabel=""
                        deselectLabel=""
                        :allow-empty="false"
                        @select="changeShopType(index, area, $event)"
                      />
                    </div>
                    <div :class="'loading_' + index" style="display: none;">
                      <div class="sk-wave sk-primary" style=" height: 40px; margin: 0 auto;">
                        <div class="sk-rect sk-rect1"></div>
                        <div class="sk-rect sk-rect2"></div>
                        <div class="sk-rect sk-rect3"></div>
                        <div class="sk-rect sk-rect4"></div>
                        <div class="sk-rect sk-rect5"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div :id="'reason_' + index" style="">
                      <multi-select
                        class="text-center"
                        v-model="area.reason"
                        track-by="name"
                        label="name"
                        placeholder="Chưa có dữ liệu"
                        open-direction="bottom"
                        :options="listReasons"
                        selectLabel=""
                        selectedLabel="Đang chọn"
                        deselectLabel=""
                        :allow-empty="false"
                        @select="changeReason(index, area, $event)"
                      />
                    </div>
                    <div :class="'loading_' + index" style="display: none;">
                      <div class="sk-wave sk-primary" style=" height: 40px; margin: 0 auto;">
                        <div class="sk-rect sk-rect1"></div>
                        <div class="sk-rect sk-rect2"></div>
                        <div class="sk-rect sk-rect3"></div>
                        <div class="sk-rect sk-rect4"></div>
                        <div class="sk-rect sk-rect5"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div :id="'close-from_' + index" style="">
                      <date-picker
                        class="close-from"
                        v-model="area.close_from"
                        :bootstrap-styling=true
                        format="dd-MM-yyyy"
                        placeholder="Chưa có dữ liệu"
                        open-direction="bottom"
                        :calendar-button=true
                        calendar-button-icon="fa fa-calendar"
                        :clear-button="true"
                        @selected="changeCloseFrom(index, area, $event)"
                      />
                    </div>
                    <div :class="'loading_' + index" style="display: none;">
                      <div class="sk-wave sk-primary" style=" height: 40px; margin: 0 auto;">
                        <div class="sk-rect sk-rect1"></div>
                        <div class="sk-rect sk-rect2"></div>
                        <div class="sk-rect sk-rect3"></div>
                        <div class="sk-rect sk-rect4"></div>
                        <div class="sk-rect sk-rect5"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div :id="'close-to_' + index" style="">
                      <date-picker
                        class="close-to"
                        v-model="area.close_to"
                        :bootstrap-styling=true
                        format="dd-MM-yyyy"
                        placeholder="Chưa có dữ liệu"
                        open-direction="bottom"
                        :calendar-button=true
                        calendar-button-icon="fa fa-calendar"
                        :clear-button="true"
                        @selected="changeCloseTo(index, area, $event)"
                      />
                    </div>
                    <div :class="'loading_' + index" style="display: none;">
                      <div class="sk-wave sk-primary" style=" height: 40px; margin: 0 auto;">
                        <div class="sk-rect sk-rect1"></div>
                        <div class="sk-rect sk-rect2"></div>
                        <div class="sk-rect sk-rect3"></div>
                        <div class="sk-rect sk-rect4"></div>
                        <div class="sk-rect sk-rect5"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div v-if="area.last_modified_by">
                      <b-badge pill variant="primary">{{ area.last_modified_username }} - {{ area.last_modified_fullname }}</b-badge><br>
                      <b-badge pill variant="secondary">Ngày: {{ area.modified }}</b-badge>
                    </div>
                    <div  v-else>
                      <b-badge pill>Chưa có dữ liệu</b-badge>
                    </div>
                  </td>
                  <td class="center">
                    <div :id="'checkbox_' + index" style="">
                      <b-form-checkbox
                        v-model="area.is_blocked"
                        :name="'is_blocked_' + index"
                        value="1"
                        unchecked-value="0"
                        @change="changeIsBlocked(index, area, $event)"
                      >
                    </b-form-checkbox>
                    </div>
                    <div :class="'loading_' + index" style="display: none;">
                      <div class="sk-wave sk-primary" style=" height: 40px; margin: 0 auto;">
                      <div class="sk-rect sk-rect1"></div>
                      <div class="sk-rect sk-rect2"></div>
                      <div class="sk-rect sk-rect3"></div>
                      <div class="sk-rect sk-rect4"></div>
                      <div class="sk-rect sk-rect5"></div>
                    </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <!-- Pagination -->
          <b-card-body class="pt-0 pb-3">
            <div class="row">
              <div class="col-sm pt-3">
                <b-pagination
                  :total-rows="pageData.total_items"
                  v-model="pageData.current_page"
                  :per-page="pageData.per_page"
                  v-on:change="pageChanged"
                />
              </div>
              <div class="col-sm text-sm-left text-center pt-3">
                <span class="text-muted" v-if="pageData.total_items">Trang {{ pageData.current_page }} trên {{ pageData.total_pages }}</span>
              </div>
            </div>
          </b-card-body>
        <!-- / Pagination -->
        </b-card>
      </div>
      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>

import selectAddresses from 'components/area/SelectAddresses'
import SelectProvinces from 'components/elements/FilterBox/SelectProvinces'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import areasService from 'domain/services/areas-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import moment from 'moment'
import { mapGetters } from 'vuex'

Vue.use(VeeValidate)
export default {
  name: 'AreasManager',
  components: {
    'select-addresses': selectAddresses,
    'select-provinces': SelectProvinces,
    'date-picker': Datepicker,
    'multi-select': Multiselect,
    'ladda-btn': LaddaBtn,
    'loading-mini-bottom': LoadingMiniBottom
  },
  data: () => ({
    timestamp: '',
    pageData: {
      current_page: 1,
      total_pages: 0,
      total_items: 0,
      perpage: 20,
      sort_by: 'id',
      sort_desc: false
    },
    appLoading: false,
    loading: [false, false, false, false, false, false, false, false, false, false, false, false],
    filterData: {
      province_ids: [],
      district_ids: [],
      ward_street_ids: [],
      hamlet_ids: [],
      close_from: null,
      close_to: null,
      reason: {name: 'Chưa chọn', code: ''},
      pick_or_deliver: {name: 'Chưa chọn', code: ''},
      shop_type: {name: 'Chưa chọn', code: ''},
      is_blocked: {name: 'Chưa chọn', code: ''}
    },
    listReasons: [
      {name: 'Chưa chọn', code: ''}
    ],
    listReasonsForSearch: [
      {name: 'Chưa chọn', code: ''}
    ],
    orderOptions: [
      {name: 'Tất cả', code: 'none'},
      {name: 'Lấy', code: 'pick'},
      {name: 'Giao', code: 'deliver'}
    ],
    orderOptionsForSearch: [
      {name: 'Chưa chọn', code: ''},
      {name: 'Tất cả', code: 'none'},
      {name: 'Lấy', code: 'pick'},
      {name: 'Giao', code: 'deliver'}
    ],
    listShopTypes: [
      {name: 'Tất cả', code: '-1'},
      {name: 'Shop Standard', code: '0'},
      {name: 'Shop Pro', code: '1'},
      {name: 'Shop VIP', code: '2'},
      {name: 'Shop Premier', code: '3'},
      {name: 'Shop Thư Vận', code: '4'}
    ],
    listShopTypesForSearch: [
      {name: 'Chưa chọn', code: ''},
      {name: 'Tất cả', code: '-1'},
      {name: 'Shop Standard', code: '0'},
      {name: 'Shop Pro', code: '1'},
      {name: 'Shop VIP', code: '2'},
      {name: 'Shop Premier', code: '3'},
      {name: 'Shop Thư Vận', code: '4'}
    ],
    blockTypesForSearch: [
      {name: 'Chưa chọn', code: ''},
      {name: 'Đã chặn', code: '1'},
      {name: 'Chưa chặn', code: '0'},
      {name: 'Hiển thị tất cả địa chỉ đã chặn (Lọc theo điều kiện này sẽ không tính các điều kiện khác)', code: '-1'}
    ],
    addressData: null,
    areasData: null,
    selectedReason: null,
    selected_addresses: null,
    selectedOrderOption: {name: 'Tất cả', code: 'none'},
    selectedShopType: {name: 'Tất cả', code: '-1'},
    isShowModalAddrSave: false,
    isShowSaveMessage: false,
    failWhenSaveAreasMessage: null,
    isShowAddressDetail: false,
    isShowModalOptionDetail: false,
    isShowModalSave: false,
    dismissCountDownSuccess: 0,
    dismissCountDownError: 0,
    selectCloseFrom: null,
    selectCloseTo: null,
    isFailValidateCloseFrom: false,
    isFailValidateCloseTo: false,
    preventUpdate: false,
    isShowUpdateAll: true,
    selectAllIsBlocked: '0',
    selectedIsBlocked: []
  }),
  methods: {
    resetForm () {
      this.$refs.select_addresses.reset()
      this.filterData.close_from = null
      this.filterData.close_to = null
      this.filterData.reason = {name: 'Chưa chọn', code: ''}
      this.filterData.pick_or_deliver = {name: 'Chưa chọn', code: ''}
      this.filterData.shop_type = {name: 'Chưa chọn', code: ''}
      this.filterData.is_blocked = {name: 'Chưa chọn', code: ''}
    },
    getNow () {
      let today = new Date()
      let day = '' + (today.getDate())
      if (day.length < 2) {
        day = '0' + day
      }
      let month = '' + (today.getMonth() + 1)
      if (month.length < 2) {
        month = '0' + month
      }
      let hours = '' + today.getHours()
      if (hours.length < 2) {
        hours = '0' + hours
      }
      let minutes = '' + today.getMinutes()
      if (minutes.length < 2) {
        minutes = '0' + minutes
      }
      const date = today.getFullYear() + '-' + month + '-' + day
      const time = hours + ':' + minutes
      const dateTime = date + ' ' + time
      return dateTime
    },
    saveAll (e) {
      if (e === '1') {
        this.selectCloseFrom = null
        this.selectCloseTo = null
        this.selectedReason = null
        this.selectedOrderOption = {name: 'Tất cả', code: 'none'}
        this.selectedShopType = {name: 'Tất cả', code: '-1'}
        this.areasData.forEach(function (area) {
          area.is_blocked = 1
        })
        this.isShowModalOptionDetail = true
      } else {
        this.areasData.forEach(function (area) {
          area.is_blocked = 0
        })
        this.isShowModalOptionDetail = true
      }
    },
    changeReason (index, area, e) {
      area.reason = e
      this.saveAddressById(index, area)
    },
    changeShopType (index, area, e) {
      area.shop_type = e
      this.saveAddressById(index, area)
    },
    changeType (index, area, e) {
      area.type = e
      this.saveAddressById(index, area)
    },
    changeCloseFrom (index, area, e) {
      area.close_from = moment(String(e)).format('YYYY-MM-DD 00:00:00')
      if (e === null) {
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Ngày bắt đầu không được để trống!'
        })
      } else {
        if (area.close_from > area.close_to) {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!'
          })
        } else {
          this.saveAddressById(index, area)
        }
      }
    },
    changeCloseTo (index, area, e) {
      area.close_to = moment(String(e)).format('YYYY-MM-DD 23:59:59')
      if (e === null) {
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Ngày kết thúc không được để trống!'
        })
      } else {
        if (area.close_to < area.close_from) {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!'
          })
        } else {
          this.saveAddressById(index, area)
        }
      }
    },
    changeIsBlocked (index, area, e) {
      area.is_blocked = e
      this.saveAddressById(index, area)
    },
    pageChanged (page) { // Event check pagination change
      this.getAreasData(page)
      this.pageData.current_page = page
    },
    updatePage (newTotal) {
      this.pageData.total_items = newTotal
      this.pageData.total_pages = Math.ceil(newTotal / this.pageData.per_page)
    },
    startLoading (timeLoading) {
      if (this.loading[timeLoading]) {
        return
      }
      this.updateLoadingValue(timeLoading, true)
    },
    updateLoadingValue (timeLoading, value) {
      this.loading[timeLoading] = value
      // Trigger update
      this.loading = this.loading.slice(0)
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    saveAddressById (idLoading, addressData) {
      let type = addressData.type ? addressData.type.code : null
      let shopType = addressData.shop_type ? addressData.shop_type.code : null
      let reason = addressData.reason ? addressData.reason.code : null
      let closeFrom = addressData.close_from ? addressData.close_from : null
      let closeTo = addressData.close_to ? addressData.close_to : null

      if (type === null || shopType === null || reason === null || closeFrom === null || closeTo === null) {
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Cần nhập đủ thông tin!'
        })
      } else {
        this.addressData = addressData
        this.areasData[idLoading].modified = this.getNow()
        this.areasData[idLoading].last_modified_by = this.userInfo.User.id
        this.areasData[idLoading].last_modified_username = this.userInfo.User.username
        this.areasData[idLoading].last_modified_fullname = this.userInfo.User.fullname
        this.saveArea(7, 0, idLoading)
      }
    },
    saveArea: function (timeLoading, isMany, idLoading) {
      var loadings = document.getElementsByClassName('loading_' + idLoading)
      let checkboxIndex = 'checkbox_' + idLoading
      let closeFromIndex = 'close-from_' + idLoading
      let closeToIndex = 'close-to_' + idLoading
      let reasonIndex = 'reason_' + idLoading
      let shopTypeIndex = 'shop-type_' + idLoading
      let typeIndex = 'type_' + idLoading
      let saveData = null
      if (isMany === 1) {
        saveData = {
          is_many: 1,
          reason_id: this.selectedReason.code,
          shop_type: this.selectedShopType.code,
          type: this.selectedOrderOption.code,
          detail: this.areasData,
          close_from: moment(String(this.selectCloseFrom)).format('YYYY-MM-DD 00:00:00'),
          close_to: moment(String(this.selectCloseTo)).format('YYYY-MM-DD 23:59:59')
        }
      } else {
        saveData = {
          is_many: 0,
          id: this.addressData.id,
          address_id: this.addressData.address_id,
          reason_id: this.addressData.reason ? this.addressData.reason.code : 'none',
          shop_type: this.addressData.shop_type ? this.addressData.shop_type.code : 'none',
          type: this.addressData.type ? this.addressData.type.code : 'none',
          is_blocked: this.addressData.is_blocked
        }

        if (this.addressData.id) {
          saveData.close_from = this.addressData.close_from
          saveData.close_to = this.addressData.close_to
        } else {
          saveData.close_from = moment(String(this.addressData.close_from)).format('YYYY-MM-DD 00:00:00')
          saveData.close_to = moment(String(this.addressData.close_to)).format('YYYY-MM-DD 23:59:59')
        }

        document.getElementById(checkboxIndex).style.display = 'none'
        document.getElementById(closeFromIndex).style.display = 'none'
        document.getElementById(closeToIndex).style.display = 'none'
        document.getElementById(reasonIndex).style.display = 'none'
        document.getElementById(shopTypeIndex).style.display = 'none'
        document.getElementById(typeIndex).style.display = 'none'
        for (var i = 0; i < loadings.length; i += 1) {
          loadings[i].style.display = ''
        }
      }

      this.startLoading(timeLoading)
      this.preventUpdate = true
      this.isShowUpdateAll = false
      areasService.saveAreasData(saveData).then(response => {
        if (response.data.success) {
          this.dismissCountDownSuccess = 2
          this.$notify({
            group: 'default',
            type: 'text-white bg-success',
            title: 'Thông báo',
            text: response.data.message
          })
        } else {
          this.dismissCountDownError = 2
          this.failWhenSaveAreasMessage = response.data.message
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.isShowAddressDetail = false
        this.isShowModalAddrSave = false
        this.isShowModalOptionDetail = false
        this.isShowModalSave = false
        this.isShowSaveMessage = true
        this.updateLoadingValue(timeLoading, false)

        document.getElementById(checkboxIndex).style.display = ''
        document.getElementById(closeFromIndex).style.display = ''
        document.getElementById(closeToIndex).style.display = ''
        document.getElementById(reasonIndex).style.display = ''
        document.getElementById(shopTypeIndex).style.display = ''
        document.getElementById(typeIndex).style.display = ''
        for (var i = 0; i < loadings.length; i += 1) {
          loadings[i].style.display = 'none'
        }
        this.preventUpdate = false
        this.isShowUpdateAll = true
      })

      if (isMany === 1) {
        setTimeout(function () {
          location.reload()
        }, 1700)
        // this.getAreasData(this.pageData.current_page)
      }
    },
    getAreasData: function (page) {
      let dataSearch = {
        page: page,
        province_ids: this.filterData.province_ids,
        district_ids: this.filterData.district_ids.map(item => item.code),
        ward_street_ids: this.filterData.ward_street_ids.map(item => item.code),
        hamlet_ids: this.filterData.hamlet_ids,
        close_from: this.filterData.close_from ? moment(String(this.filterData.close_from)).format('YYYY-MM-DD 00:00:00') : null,
        close_to: this.filterData.close_to ? moment(String(this.filterData.close_to)).format('YYYY-MM-DD 23:59:59') : null,
        reason: this.filterData.reason ? this.filterData.reason.code : null,
        type: this.filterData.pick_or_deliver ? this.filterData.pick_or_deliver.code : null
      }

      if (this.filterData.is_blocked && this.filterData.is_blocked.code !== '') {
        dataSearch.is_blocked = this.filterData.is_blocked.code
      }
      if (this.filterData.shop_type && this.filterData.shop_type.code !== '') {
        dataSearch.shop_type = this.filterData.shop_type.code
      }

      this.appLoading = true
      areasService.getAreasData(dataSearch).then(response => {
        if (response.data.success) {
          this.pageData.total_items = response.data.pagination.total
          this.pageData.per_page = response.data.pagination.per_page
          this.pageData.total_pages = response.data.pagination.total_page
          this.areasData = response.data.data
          this.areasData.forEach(function (item) {
            if (item.type === 'none') {
              item.type = {name: 'Tất cả', code: 'none'}
            } else if (item.type === 'pick') {
              item.type = {name: 'Lấy', code: 'pick'}
            } else if (item.type === 'deliver') {
              item.type = {name: 'Giao', code: 'deliver'}
            }

            if (item.shop_type === '-1') {
              item.shop_type = {name: 'Tất cả', code: '-1'}
            } else if (item.shop_type === '0') {
              item.shop_type = {name: 'Shop Standard', code: '0'}
            } else if (item.shop_type === '1') {
              item.shop_type = {name: 'Shop Pro', code: '1'}
            } else if (item.shop_type === '2') {
              item.shop_type = {name: 'Shop VIP', code: '2'}
            } else if (item.shop_type === '3') {
              item.shop_type = {name: 'Shop Premier', code: '3'}
            } else if (item.shop_type === '4') {
              item.shop_type = {name: 'Shop Thư Vận', code: '4'}
            }
          })
        }
      }).then(() => {
        let arrdBlockedData = this.areasData.filter(item => (item.is_blocked === 1))
        if (this.areasData && this.areasData.length === arrdBlockedData.length) {
          this.selectAllIsBlocked = '1'
        } else {
          this.selectAllIsBlocked = 0
        }
        this.appLoading = false
      })
    },
    getListBlockReasons () {
      areasService.getListBlockReasons().then(response => {
        if (response.data.success) {
          this.listReasons = response.data.data
          let self = this
          response.data.data.forEach(function (item) {
            self.listReasonsForSearch.push(item)
          })
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      })
    },
    selectedAddressId (result) {
    },
    validateOptionDetail () {
      this.$validator.validateAll().then((result) => {
        if (result && this.selectCloseFrom < this.selectCloseTo) {
          this.isShowModalSave = true
        }
      })
    },
    validateAddressData () {
      this.$validator.validateAll().then((result) => {
        if (result && this.addressData.close_from < this.addressData.close_to) {
          this.isShowModalAddrSave = true
        }
      })
    }
  },
  created () {
    this.getListBlockReasons()
    this.getAreasData(1)
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  watch: {
    selectCloseFrom: function (newVal) {
      if (newVal && this.selectCloseTo !== null && newVal > this.selectCloseTo) {
        this.isFailValidateCloseFrom = true
      } else {
        this.isFailValidateCloseFrom = false
      }
    },
    selectCloseTo: function (newVal) {
      if (newVal && this.selectCloseFrom !== null && newVal < this.selectCloseFrom) {
        this.isFailValidateCloseTo = true
      } else {
        this.isFailValidateCloseTo = false
      }
    }
  },
  metaInfo: {
    title: 'Quản lý khu vực lấy giao'
  }
}
</script>
<style>
.center {
  margin: 0 auto;
}

.align-content-center {
  text-align: center;
}

.box-close-from {
  margin-top: -16px;
}

.saving {
  position: fixed;
  bottom: 10px;
  right: 30px;
  z-index: 99;
  border: none;
  outline: none;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 8px;
  opacity: 0.8
}

.search-form {
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  padding: 20px;
}

.config-reason {
  position: absolute;
  top: -71px;
  right: 1px
}

.title-form-area {
  color: #4E5155 !important;
  font-size: 13.3px !important;
  font-weight: 500 !important;
}
</style>
