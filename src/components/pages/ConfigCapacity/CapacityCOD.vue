<template>
    <div>
    <div class="ui-block">
      <h3 class="ui-block-heading ">Config Capacity</h3>
      <div>
        <b-form>
          <div class="form-filter">
            <b-form-row>
              <b-col md="9">
                  <multi-select-province-station-module
                    @getProvince="selected.province = $event"
                    @getStation="selected.station = $event"
                    @getModule="selected.module = $event"
                    ref="psm_capa"
                  ></multi-select-province-station-module>
              </b-col>
               <b-col md="3">
                <b-form-group label="Loại COD">
                  <multiselect
                    v-model="selected.type_cod"
                    label="text"
                    track-by="value"
                    placeholder="Chọn loại COD"
                    :options="options"
                    :multiple="true"
                    :searchable="false"
                    :loading="false"
                    :internal-search="false"
                    :clear-on-select="true"
                    :close-on-select="true"
                    :hide-selected="true"
                    ref="type_cod_capa"
                  ></multiselect>
                </b-form-group>
              </b-col>
            </b-form-row>
              <b-form-row class="cfButton">
                    <b-button class="b1" type="reset" @click="resetForm" >Nhập lại</b-button>
                     <ladda-btn
                     :loading="loadingButton"
                      @click.native="searchCapacity(dataPage.currentPage, true)"
                      data-style="zoom-out"
                      class="btn btn-success btn-z-index b1">
                      <i class="sidenav-icon ion ion-md-search"></i>
                      Tìm kiếm
                    </ladda-btn>
            </b-form-row>
          </div>
        </b-form>
        <b-form>
          <div class="result" id="results" v-if="checkResult">
          <div no-body v-if="dataLogs.length > 0">
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
                                        <th style="width: 7.5%">Tỉnh</th>
                                        <th style="width: 7.5%">Mã COD</th>
                                        <th style="width: 10%">Username</th>
                                        <th style="width: 12.5%">Tên COD</th>
                                        <th style="width: 15%">Thông tin COD</th>
                                        <th style="width: 10%">Giỏ</th>
                                        <th style="width: 10%">Module</th>
                                        <th style="width: 7.5%">Kho</th>
                                        <th style="width: 12.5%">Năng suất COD</th>
                                        <th style="width: 7.5%">Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item) in dataLogs" :key="item.cod_id">
                                      <td>
                                       {{item.province.name}}
                                      </td>
                                      <td>
                                       {{item.cod.alias}}
                                      </td>
                                      <td>
                                       {{item.cod.username}}
                                     </td>
                                     <td>
                                       {{item.cod.fullname}}
                                     </td>
                                     <td>
                                       <strong>Position Job:</strong> {{item.cod.work_type}}
                                       <br>
                                       <strong>Thâm niên:</strong> {{item.cod.seniority}} tháng
                                     </td>
                                     <td>
                                       {{item.cart.alias}}
                                     </td>
                                     <td>
                                       {{item.module.alias}}
                                     </td>
                                     <td>
                                       {{item.station.name}}
                                     </td>
                                     <td>
                                       <strong>Sáng:</strong> {{item.capacity.morning}}
                                       <br>
                                       <strong>Chiều:</strong> {{item.capacity.afternoon}}
                                       <br>
                                       <strong>Tối:</strong> {{item.capacity.evening}}
                                     </td>
                                     <td class="position">
                                       <button class="btn btn-success bcenter" @click.prevent="openModalEdit(item)">
                                         <i class="ion ion-md-create"></i>
                                         Sửa
                                         </button>
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
                      <b-pagination :total-rows="dataPage.totalItems"
                                  v-model="dataPage.currentPage"
                                  :per-page="dataPage.perPage"
                                  v-on:change="pageChanged"
                    />
                    </div>
                    <div class="select">
                      <span class="text-muted" v-if="dataPage.totalItems">Trang {{ dataPage.currentPage }} trên {{ totalPages }}</span>
                    </div>
                    <div >
                        <b-form-select v-model="dataPage.perPage" :options="options_perPage" v-on:change="pageChangedForSel" ></b-form-select>
                    </div>
                  </div>
                </div>
              </b-card-body>
      </div>
       <b-modal
       centered
        ref="editProductModal"
        title="Sửa năng suất"
        @ok="editProduct"
        @cancel="cancel"
        cancel-title="Hủy bỏ" static
      >
         <b-form-row>
          <b-col md="6">
            <b-form-group label="Sáng">
              <b-form-input min="0" type="number" v-model.trim="dataCapacityEdit.morning"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Chiều">
              <b-form-input min="0" type="number" v-model.trim="dataCapacityEdit.afternoon"></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="6">
            <b-form-group label="Tối">
              <b-form-input min="0" type="number" v-model.trim="dataCapacityEdit.evening"></b-form-input>
            </b-form-group>
          </b-col>
        </b-form-row>
      </b-modal>
      <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    </div>
  </div>
</template>

<script>
import MultiSelectProvinceStationModule from 'components/elements/FilterBox/MultiSelectProvinceStationModule'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import BlockUI from 'vue-blockui'
import Vue from 'vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import configCapacityService from 'domain/services/config-capacity-service.js'
import Capacity from 'domain/entities/Capacity'
import Multiselect from 'vue-multiselect'
import * as _ from 'lodash'
Vue.use(BlockUI)
export default {
  data () {
    return {
      options: Capacity.optionsType,
      options_perPage: Capacity.optionsPerPage,
      productsResponse: [],
      dataCapacityEdit: {},
      isUpdate: false,
      dataPage: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 25
      },
      selected: {
        province: '',
        station: '',
        module: [],
        type_cod: []
      },
      dataLogs: [],
      loadingButton: false,
      appLoading: false,
      checkResult: false,
      htmlTransfer: `<div class="sk-folding-cube sk-primary">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
      </div>
      <h5 class="text-center mb-0">LOADING...</h5>`,
      loadingTransfer: false
    }
  },
  components: {
    LaddaBtn,
    LoadingMiniBottom,
    MultiSelectProvinceStationModule,
    Multiselect
  },
  methods: {
    cancel () {
      this.dataCapacityEdit = {}
    },
    editProduct (bvModalEvt) {
      let dataEdit = {}
      dataEdit = {
        cod_id: this.dataCapacityEdit.cod_id,
        capacity: {
          morning: this.dataCapacityEdit.morning,
          afternoon: this.dataCapacityEdit.afternoon,
          evening: this.dataCapacityEdit.evening
        }
      }
      configCapacityService.edit(dataEdit).then(res => {
        if (res.data.success) {
          commonHelper.showMessage('Sửa sản phẩm thành công', 'success')
          for (let i = 0; i < this.productsResponse.length; i++) {
            if (this.productsResponse[i].cod_id === dataEdit.cod_id) {
              this.productsResponse[i].capacity.morning = dataEdit.capacity.morning
              this.productsResponse[i].capacity.afternoon = dataEdit.capacity.afternoon
              this.productsResponse[i].capacity.evening = dataEdit.capacity.evening
              return
            }
          }
        } else {
          commonHelper.showMessage('Sửa sản phẩm thành công', 'success')
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    resetForm () {
      this.$refs.psm_capa.reset()
      this.selected.type_cod = ''
    },
    openModalEdit (item) {
      const swap = {
        cod_id: item.cod_id,
        morning: item.capacity.morning,
        afternoon: item.capacity.afternoon,
        evening: item.capacity.evening
      }
      this.dataCapacityEdit = swap
      this.$refs.editProductModal.show()
    },
    pageChanged (page) {
      // Event check pagination change
      this.dataPage.currentPage = page
      this.searchCapacity()
    },
    pageChangedForSel () {
    // Event check pagination change
      this.dataPage.currentPage = 1
      this.searchCapacity()
    },
    offLoading () {
      this.appLoading = false
      this.loadingButton = false
      this.loadingTransfer = false
    },
    searchCapacity (page, newSearchConditions) {
      this.appLoading = true
      let params = {}
      if (this.selected.province === '') {
        commonHelper.showMessage('Vui lòng chọn tỉnh', 'warning')
        this.offLoading()
        return
      }
      if (this.selected.station === '') {
        commonHelper.showMessage('Vui lòng chọn kho', 'warning')
        this.offLoading()
        return
      }
      if (this.selected.module) {
        params['module_ids'] = this.selected.module
      }
      if (newSearchConditions) {
        this.dataPage.currentPage = 1
        params.page = 1
        this.loadingButton = true
      }
      params['page'] = this.dataPage.currentPage
      params['limit'] = this.dataPage.perPage
      params['station_id'] = this.selected.station
      params['cod_types'] = _.map(this.selected.type_cod, 'value')
      configCapacityService.search(params).then((response) => {
        if (response.data.success) {
          this.checkResult = response.data.success
          this.dataPage.totalItems = response.data.data.count
          response = response.data.data
          this.dataLogs = response.data
          this.productsResponse = this.dataLogs
          this.offLoading()
        } else {
          commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
          this.offLoading()
        }
      }).catch((e) => {
        console.log(e)
        commonHelper.showMessage('Đã có lỗi xảy ra', 'error')
        this.offLoading()
      })
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.dataPage.totalItems / this.dataPage.perPage)
    }
  }
}
</script>

<style scoped>
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
.custom-select{
  width: 100px;
}
.btn-z-index {
  z-index: 0;
}
.page-item{
  z-index: 0;
}
.element{
  display: flex;
  justify-content: space-between;
}
*{
  font-family: inherit;
}
.notification-content{
  font-size: 15px;
  font-family: inherit;
}
.bcenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.position{
  position: relative;
}
</style>
