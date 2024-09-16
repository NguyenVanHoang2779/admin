<template>
  <div>
    <div class="ui-block">
      <h3 class="ui-block-heading">Danh sách cấu hình COD</h3>
      <div>
        <b-form>
          <div class="form-filter">
            <b-form-row>
                <b-col md="3">
                 <b-form-group label="Tên COD">
                <multi-select-cod
                  @onChange="selectedCod"
                  ref="selectCods">
                  </multi-select-cod>
              </b-form-group>
              </b-col>
              <b-col md="3">
                 <b-form-group label="Tuyến">
                <select-cart
                  @onChange="selectedCart"
                  ref="selectCarts">
                  </select-cart>
              </b-form-group>
              </b-col>
               <b-col md="3">
                 <b-form-group label="Kho">
                <select-station-frail
                  @onChange="selectedStation"
                  :stationCur = stationCur
                  ref="selectStationFrail">
                  </select-station-frail>
              </b-form-group>
              </b-col>
              <b-col md="3">
                 <b-form-group label="Miền">
                <multiselect
                    v-model="dataInput.regions"
                    label="text"
                    track-by="value"
                    placeholder="Chọn miền"
                    :options="options_region"
                    :multiple="true"
                    :searchable="false"
                    :loading="false"
                    selectLabel=""
                    selectedLabel=""
                    deselectLabel="x"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="false"
                    ref="regionCod"
                  ></multiselect>
              </b-form-group>
              </b-col>
            </b-form-row>
           <b-form-row class="cfButton">
              <ladda-btn
              :loading="loadingButton"
                @click.native="searchListCod()"
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
                        <!-- / Table controls -->
                        <div class="table-result" >
                        <!-- Table -->
                            <div class="table-responsive mb-4">
                                <table class="table mb-0 table-bordered">
                                    <thead class="" style="width: 100%!important">
                                    <tr>
                                        <th style="width: 15%">Tên COD</th>
                                        <th style="width: 12%">Thời gian làm việc</th>
                                        <th style="width: 12%">Chốt ca</th>
                                        <th style="width: 16%">Cần kiểm tra khi chốt ca</th>
                                        <th style="width: 16%">Cần kiểm tra delay</th>
                                        <th style="width: 10%">Hình thức thanh toán</th>
                                        <th style="width: 9%">Số điểm phát sinh trong ca</th>
                                        <th style="width: 8%">Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,index) in dataLogs" :key="index">
                                      <td >
                                        <strong v-if="item.Cod &&item.Cod.alias && item.Cod.fullname != ''">{{item.Cod.alias}} - {{item.Cod.fullname}}</strong>
                                        <div>Tuyến: <span v-if="item.Cart">{{item.Cart.alias || ''}}</span></div>
                                        <div>Kho: <span v-if="item.Station">{{item.Station.name || ''}}</span></div>
                                        <div>Hình thức: <span>{{item.WorkType || ''}}</span></div>
                                      </td>
                                      <td>
                                        <div v-for="(itemShift, indexShift) in item.workShifts" :key="'A'+indexShift">
                                          <template v-if="itemShift.start_time && itemShift.end_time">
                                            {{itemShift.title}}: {{removeSecondInTime(itemShift.start_time)}} - {{removeSecondInTime(itemShift.end_time)}}
                                          </template>
                                        </div>
                                      </td>
                                      <td>
                                        <template v-if="item.CodConfirmWorkShiftsTime && item.CodConfirmWorkShiftsTime.confirm_times">
                                          <div>{{item.CodConfirmWorkShiftsTime.confirm_times}} ca</div>
                                          <div class="mt-2" v-for="shiftIndex in Number(item.CodConfirmWorkShiftsTime.confirm_times)" :key="shiftIndex">
                                            Ca {{shiftIndex}} muộn nhất: {{removeSecondInTime(item.CodConfirmWorkShiftsTime[`confirm_time_${shiftIndex}`])}}<br>
                                            Ngày xuất ca
                                            <span v-if="Number(item.CodConfirmWorkShiftsTime[`confirm_day_${shiftIndex}`])">
                                              + {{item.CodConfirmWorkShiftsTime[`confirm_day_${shiftIndex}`]}}
                                            </span>
                                          </div>
                                        </template>
                                      </td>
                                      <td >
                                        <span v-for="(itemConfirmWorkShift, WorkShift) in item.CodConfirmWorkShiftsCondition" :key="'B'+WorkShift">
                                            {{itemConfirmWorkShift.title}}<br>
                                        </span>
                                      </td>
                                      <td >
                                        <span v-for="(itemCodNeedCheckDelay, WorkShift) in item.NeedCheckDelayConditions" :key="'B'+WorkShift">
                                            {{itemCodNeedCheckDelay.title}}<br>
                                        </span>
                                      </td>
                                      <td>
                                        <span v-for="(itemPayment, indexPayment) in item.CodPaymentGateway" :key="'C'+indexPayment">
                                          {{itemPayment.title}}<br>
                                        </span>
                                      </td>
                                      <td>
                                        <div v-for="(point, pointIndex) in item.CodIncurredPoint" :key="'A'+pointIndex">
                                          <template v-if="point">
                                            Ca {{pointIndex + 1}}: {{point}}
                                          </template>
                                        </div>
                                      </td>
                                      <td class="position">
                                        <router-link class="btn btn-success bcenter" :to="{ name: 'manage-list-cod/edit', params: { id: item.Cod.user_id }}" style="color:white">
                                          <i class="ion ion-md-create" /> Sửa
                                        </router-link>
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
              <div>
                <b-form-select
                  v-model="dataPage.perPage"
                  :options="options_perPage"
                  v-on:change="pageChangedForSel"
                ></b-form-select>
              </div>
            </div>
          </div>
        </b-card-body>
      </div>

      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>

<script>

import manageListCodService from 'domain/services/manage-list-cod-service.js'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import ManageListCod from 'domain/entities/ManageListCod'
import Multiselect from 'vue-multiselect'
import SelectStationFrail from 'components/elements/FilterBox/SelectStationFrail'
import SelectCart from 'components/elements/FilterBox/SelectCart'
import MultiSelectCod from 'components/elements/FilterBox/MultiSelectCod'
import * as _ from 'lodash'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'

export default {
  data () {
    return {
      checkLength: [],
      loadingButton: false,
      stationCur: null,
      appLoading: false,
      checkResult: false,
      inputDisable: false,
      errorMessage: '',
      linkCod: '/carts/edit',
      dataInput: {
        stations: [],
        cods: [],
        carts: [],
        regions: []
      },
      dataPage: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 25
      },
      dataLogs: [],
      options_region: ManageListCod.optionsReport,
      options_perPage: ManageListCod.optionsPerpage
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.dataPage.totalItems / this.dataPage.perPage)
    },
    needRestoreFilter () {
      return this.$route.query.back === 'true'
    }
  },
  watch: {
    '$store.state.userInfo.Station': function (value) {
      if (!this.needRestoreFilter && value && value.id) {
        this.setFilters({stations: [value]})
      }
    }
  },
  components: {
    LaddaBtn,
    LoadingMiniBottom,
    Multiselect,
    SelectStationFrail,
    SelectCart,
    MultiSelectCod
  },
  methods: {
    offLoading () {
      this.appLoading = false
      this.loadingButton = false
    },
    selectedStation (option) {
      if (!_.isNil(option)) {
        this.dataInput.stations = option
      }
    },
    removeSecondInTime (time) {
      if (!time) {
        return ''
      }
      const timeParts = time.split(':')
      return [timeParts[0] || '', timeParts[1] || ''].join(':')
    },

    selectedCart (option) {
      if (!_.isNil(option)) {
        this.dataInput.carts = option
      }
    },
    selectedCod (option) {
      if (!_.isNil(option)) {
        this.dataInput.cods = option
      }
    },
    pageChanged (page) {
      // Event check pagination change
      this.dataPage.currentPage = page
      this.searchListCod()
    },
    pageChangedForSel () {
      // Event check pagination change
      this.dataPage.currentPage = 1
      this.searchListCod()
    },
    saveCurrentFilterState () {
      localStorage.setItem('ManagetListCOD_filter', JSON.stringify({
        cods: this.dataInput.cods,
        stations: this.dataInput.stations,
        carts: this.dataInput.carts,
        regions: this.dataInput.regions,
        currentPage: this.dataPage.currentPage,
        perPage: this.dataPage.perPage
      }))
    },
    restoreFilterState () {
      try {
        const filters = JSON.parse(localStorage.getItem('ManagetListCOD_filter'))
        this.setFilters(filters)
      } catch (e) {
      }
    },
    setFilters (filters) {
      this.dataInput.cods = Array.isArray(filters.cods) ? _.clone(filters.cods) : []
      this.dataInput.stations = Array.isArray(filters.stations) ? _.clone(filters.stations) : []
      this.dataInput.carts = Array.isArray(filters.carts) ? _.clone(filters.carts) : []
      this.dataInput.regions = Array.isArray(filters.regions) ? _.clone(filters.regions) : []

      this.$refs.selectCods.$data.asyncSelected = this.dataInput.cods
      this.$refs.selectCarts.$data.asyncSelected = this.dataInput.carts
      this.$refs.selectStationFrail.$data.asyncSelected = this.dataInput.stations

      this.currentPage = filters.currentPage || 1
      this.perPage = filters.perPage || 25

      this.searchListCod()
    },
    searchListCod () {
      this.appLoading = true
      this.loadingButton = true
      let params = {
      }
      if (_.isEmpty(this.dataInput.cods) && _.isEmpty(this.dataInput.stations)) {
        commonHelper.showMessage('Vui lòng chọn kho hoặc COD', 'warning')
        this.offLoading()
        return
      }

      params['station_id'] = _.map(this.dataInput.stations, 'id')

      if (this.dataInput.stations.length > 10 || this.dataInput.carts.length > 10 || this.dataInput.cods.length > 10) {
        commonHelper.showMessage('Vui lòng chỉ chọn tối đa 10 COD, Kho hoặc Tuyến', 'error')
        this.offLoading()
        return
      }

      this.saveCurrentFilterState()

      if (this.dataInput.carts.length > 0) {
        params['cart_id'] = _.map(this.dataInput.carts, 'id')
      }

      if (this.dataInput.regions.length > 0) {
        params['region'] = _.map(this.dataInput.regions, 'value')
      }
      if (this.dataInput.cods.length > 0) {
        params['cod_id'] = _.map(this.dataInput.cods, 'id')
      }
      params['page'] = this.dataPage.currentPage
      params['limit'] = this.dataPage.perPage

      manageListCodService
        .searchListCod(params)
        .then(response => {
          this.errorMessage = response.data.message ? response.data.message : 'Đã có lỗi xảy ra'
          if (response.data.success) {
            this.checkResult = response.data.success
            response = response.data.data
            this.dataPage.totalItems = response.total
            this.dataLogs = response.Cods
            this.offLoading()
          } else {
            commonHelper.showMessage(this.errorMessage, 'error')
            this.offLoading()
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
          this.offLoading()
        })
    }
  },
  mounted () {
    if (this.needRestoreFilter) {
      this.restoreFilterState()
    } else if (this.$store.state.userInfo.Station) {
      this.setFilters({stations: [this.$store.state.userInfo.Station]})
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
.element {
  display: flex;
  justify-content: space-between;
}
.bcenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.position {
  position: relative;
}
</style>
