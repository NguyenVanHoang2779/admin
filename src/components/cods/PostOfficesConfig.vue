<template>
    <div>
        <div class="ui-block">
            <b-form-row>
              <h4 class="ui-block-heading col-md-10">Bưu cục BBS chuyên tuyến</h4>
            </b-form-row>

            <div class="search-form">
              <b-form-group label="Tỉnh nguồn">
                 <multi-select
                  v-model="selectedProvince"
                  class="multiselect-success"
                  track-by="name"
                  label="name"
                  placeholder="Chọn Tỉnh nguồn"
                  :options="listProvinces"
                  :multiple="false"
                  :searchable="true"
                  selectLabel="x"
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="true"
                  group-values="detail"
                  group-label="region"
                  name="selected-provinces"
                />
              </b-form-group>
              <b-form-group label="Tỉnh đích">
                  <multi-select
                    v-model="selectedProvinceTransfer"
                    track-by="name"
                    label="name"
                    placeholder="Chọn Tỉnh đích"
                    :options="listProvinces"
                    :multiple="false"
                    :searchable="true"
                    selectLabel="x"
                    selectedLabel="Đang chọn"
                    deselectLabel=""
                    :allow-empty="true"
                    group-values="detail"
                    group-label="region"
                    name="selected-provinces"
                  />
              </b-form-group>
                <b-form-group label="Bưu cục">
                  <multi-select
                    v-model="selectedStations"
                    class="multiselect-success"
                    track-by="name"
                    label="name"
                    placeholder="Chọn Bưu cục"
                    :multiple="true"
                    :options="listStations"
                    selectLabel=""
                    selectedLabel="Đang chọn"
                    deselectLabel=""
                    :allow-empty="true"
                  />
                </b-form-group>
            </div>

            <b-form-row class="mt-4 mb-4 box-btn">
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
                  @click.native="getListPostOfficesConfigs(7, 1, true)"
                  data-style="zoom-out"
                  class="btn btn-primary mr-1"
                >
                  <i class="sidenav-icon ion ion-md-search"></i>
                  Tìm kiếm
                </ladda-btn>
                <ladda-btn
                  :loading="loading[7]"
                  class="btn btn-success add-config mr-1"
                  @click.native="showModalAdd"
                >
                  <i class="fas fa-plus"></i>
                  Thêm config BBS mới
                </ladda-btn>
                <ladda-btn
                  :loading="loading[7]"
                  class="btn btn-info mr-1"
                  @click.native="ExportExcel"
                >
                  <i class="far fa-file-excel"></i>
                  Xuất dữ liệu
                </ladda-btn>
              </div>
            </b-form-row>

            <b-modal id="modal-scrollable" scrollable hide-footer title="Thêm config bưu cục" v-model="isShowModalAdd">
              <b-form-group class="province-from">
                <span class="title-form-grp">Tỉnh nguồn</span>
                <span class="ml-2" v-show="errors.first('province')" style="color: red">(Cần chọn Tỉnh nguồn)</span>
                <multi-select
                  v-model="saveData.province"
                  v-validate="'required'"
                  class="multiselect-success"
                  track-by="name"
                  label="name"
                  placeholder="Chọn Tỉnh nguồn"
                  :options="listProvinces"
                  :multiple="false"
                  :searchable="true"
                  selectLabel=""
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="true"
                  group-values="detail"
                  group-label="region"
                  name="province"
                />
              </b-form-group>

              <b-form-group>
                <span class="title-form-grp">Tỉnh đích</span>
                <span class="ml-2" v-show="errors.first('transfer-province')" style="color: red">(Cần chọn Tỉnh đích)</span>
                <multi-select
                  v-model="saveData.transfer_province"
                  v-validate="'required'"
                  class="multiselect-success"
                  track-by="name"
                  label="name"
                  placeholder="Chọn Tỉnh đích"
                  :options="listProvinces"
                  :multiple="false"
                  :searchable="true"
                  selectLabel=""
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="true"
                  group-values="detail"
                  group-label="region"
                  name="transfer-province"
                />
              </b-form-group>

              <b-form-group>
                <span class="title-form-grp">Bưu cục</span>
                <span class="ml-2" v-show="errors.first('station')" style="color: red">(Cần chọn Bưu cục)</span>
                <multi-select
                  v-model="saveData.stations"
                  v-validate="'required'"
                  class="multiselect-success"
                  track-by="name"
                  label="name"
                  placeholder="Chọn Bưu cục"
                  :options="listStations"
                  :multiple="true"
                  :searchable="true"
                  selectLabel=""
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="true"
                  name="station"
                />
              </b-form-group>

              <div class="mt-1">
                <b-button
                  class="btn btn-secondary float-right ml-1"
                  @click="isShowModalAdd = false"
                >
                  <i class="far fa-hand-point-left"></i>
                  Quay lại
                </b-button>
                <b-button
                  @click="validateConfigData('add')"
                  class="btn btn-success float-right"
                >
                  <i class="fas fa-check"></i>
                  Tiếp tục
                </b-button>
              </div>
            </b-modal>

            <b-modal id="modal-scrollable" scrollable hide-footer title="Xác nhận thêm config" v-model="isShowConfirmAdd">
              <div>
                <h4>Bạn có chắc muốn thêm config này không?</h4>
              </div>
              <div class="mt-1">
                <ladda-btn
                  :loading="loading[7]"
                  @click.native="isShowConfirmAdd = false"
                  data-style="zoom-out"
                  class="btn btn-secondary float-right ml-1"
                  v-b-modal.modal-1
                >
                  <i class="far fa-hand-point-left"></i>
                  Thôi, cho nghĩ lại đã!
                </ladda-btn>

                <ladda-btn
                  :loading="loading[7]"
                  @click.native="savePostOfficesConfigs(7)"
                  data-style="zoom-out"
                  class="btn btn-success float-right"
                  v-b-modal.modal-1
                >
                  <i class="fas fa-check"></i>
                  Chắc chắn, thêm config mới!
                </ladda-btn>
              </div>
            </b-modal>

            <b-modal id="modal-scrollable" scrollable hide-footer title="Cập nhật config bưu cục" v-model="isShowModalUpdate">
              <b-form-group class="province-from">
                <span class="title-form-grp">Tỉnh nguồn</span>
                <span class="ml-2" v-show="errors.first('province')" style="color: red">(Cần chọn Tỉnh nguồn)</span>
                <multi-select
                  v-model="saveData.province"
                  v-validate="'required'"
                  class="multiselect-success"
                  track-by="name"
                  label="name"
                  placeholder="Chọn Tỉnh nguồn"
                  :options="listProvinces"
                  :multiple="false"
                  :searchable="true"
                  selectLabel="x"
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="false"
                  group-values="detail"
                  group-label="region"
                  name="province"
                />
              </b-form-group>

              <b-form-group>
                <span class="title-form-grp">Tỉnh đích</span>
                <span class="ml-2" v-show="errors.first('transfer-province')" style="color: red">(Cần chọn Tỉnh đích)</span>
                <multi-select
                  v-model="saveData.transfer_province"
                  v-validate="'required'"
                  class="multiselect-success"
                  track-by="name"
                  label="name"
                  placeholder="Chọn Tỉnh đích"
                  :options="listProvinces"
                  :multiple="false"
                  :searchable="true"
                  selectLabel="x"
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="false"
                  group-values="detail"
                  group-label="region"
                  name="transfer-province"
                />
              </b-form-group>

              <b-form-group>
                <span class="title-form-grp">Bưu cục</span>
                <span class="ml-2" v-show="errors.first('transfer-province')" style="color: red">(Cần chọn Bưu cục)</span>
                <multi-select
                  v-model="saveData.stations"
                  v-validate="'required'"
                  class="multiselect-success"
                  track-by="name"
                  label="name"
                  placeholder="Chọn Bưu cục"
                  :options="listStations"
                  :multiple="false"
                  :searchable="true"
                  selectLabel="x"
                  selectedLabel="Đang chọn"
                  deselectLabel=""
                  :allow-empty="false"
                />
              </b-form-group>

              <div class="mt-1">
                <b-button
                  class="btn btn-secondary float-right ml-1"
                  @click="isShowModalUpdate = false"
                >
                  <i class="far fa-hand-point-left"></i>
                  Quay lại
                </b-button>
                <b-button
                  @click="validateConfigData('update')"
                  class="btn btn-success float-right"
                >
                  <i class="fas fa-check"></i>
                  Tiếp tục
                </b-button>
              </div>
            </b-modal>

            <b-modal id="modal-scrollable" scrollable hide-footer title="Xác nhận cập nhật config" v-model="isShowConfirmUpdate">
              <div>
                <h4>Bạn có chắc muốn cập nhật config này không?</h4>
              </div>
              <div class="mt-1">
                <ladda-btn
                  :loading="loading[7]"
                  @click.native="isShowConfirmUpdate = false"
                  data-style="zoom-out"
                  class="btn btn-secondary float-right ml-1"
                  v-b-modal.modal-1
                >
                  <i class="far fa-hand-point-left"></i>
                  Thôi, cho nghĩ lại đã!
                </ladda-btn>

                <ladda-btn
                  :loading="loading[7]"
                  @click.native="savePostOfficesConfigs(7)"
                  data-style="zoom-out"
                  class="btn btn-success float-right"
                  v-b-modal.modal-1
                >
                  <i class="fas fa-check"></i>
                  Chắc chắn, cập nhật config!
                </ladda-btn>
              </div>
            </b-modal>

            <b-modal id="modal-scrollable" scrollable hide-footer title="Xác nhận xóa config" v-model="isShowConfirmDelete">
              <div>
                <h4>Bạn có chắc muốn xóa config này không?</h4>
              </div>
              <div class="mt-1">
                <ladda-btn
                  :loading="loading[7]"
                  class="btn btn-secondary float-right ml-1"
                  @click.native="isShowConfirmDelete = false"
                  v-b-modal.modal-1
                >
                  <i class="far fa-hand-point-left"></i>
                  Thôi, cho nghĩ lại đã!
                </ladda-btn>

                <ladda-btn
                  :loading="loading[7]"
                  @click.native="removePostOfficesConfig(7)"
                  data-style="zoom-out"
                  class="btn btn-success float-right"
                  v-b-modal.modal-1
                >
                  <i class="fas fa-check"></i>
                  Chắc chắn, xóa config!
                </ladda-btn>
              </div>
            </b-modal>

            <b-card no-body v-if="configsData.length !== 0">
              <!-- Pagination -->
              <b-card-body class="pt-0 pb-3">
                <div class="row">
                  <div class="col-sm pt-3">
                    <b-pagination
                      :total-rows="pageData.totalItems"
                      v-model="pageData.currentPage"
                      :per-page="pageData.perPage"
                      v-on:change="pageChanged"
                    />
                  </div>
                  <div class="col-sm text-sm-left text-center pt-3">
                    <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                  </div>
                </div>
              </b-card-body>
              <!-- / Pagination -->

              <div class="result">
                <div class="table-responsive mb-4">
                  <table class="table mb-0 table-bordered">
                    <tr class="text-center">
                      <th style="width: 80px;">
                        <i class="fas fa-code"></i>
                        ID
                      </th>
                      <th>
                        <i class="fas fa-map-marker-alt"></i>
                        Tỉnh nguồn
                      </th>
                      <th>
                        <i class="fas fa-map-marker-alt"></i>
                        Tỉnh đích
                      </th>
                      <th>
                        <i class="fas fa-warehouse"></i>
                        Bưu cục
                      </th>
                      <th style="width: 200px;">
                        <i class="fas fa-exclamation-triangle"></i>
                        Thao tác
                      </th>
                    </tr>

                    <tr v-for="(config, index) in configsData" :key="index">
                      <td>
                        <b-form-input
                          v-model="config.id"
                          class="text-center"
                          disabled
                        />
                      </td>
                      <td>
                        <multi-select
                          v-model="config.province"
                          class="text-center"
                          track-by="name"
                          label="name"
                          placeholder="Chọn Tỉnh nguồn"
                          :options="listProvinces"
                          :multiple="false"
                          :searchable="true"
                          selectedLabel="Đang chọn"
                          deselectLabel=""
                          :allow-empty="false"
                          disabled
                        />
                      </td>
                      <td>
                        <multi-select
                          v-model="config.transfer_province"
                          class="text-center"
                          track-by="name"
                          label="name"
                          placeholder="Chọn Tỉnh đích"
                          :options="listProvinces"
                          :multiple="false"
                          :searchable="true"
                          selectedLabel="Đang chọn"
                          deselectLabel=""
                          :allow-empty="false"
                          disabled
                        />
                      </td>
                      <td>
                        <multi-select
                          v-model="config.station"
                          class="text-center"
                          track-by="name"
                          label="name"
                          placeholder="Chọn Bưu cục"
                          :options="listProvinces"
                          :multiple="false"
                          :searchable="true"
                          selectedLabel="Đang chọn"
                          deselectLabel=""
                          :allow-empty="false"
                          disabled
                        />
                      </td>
                      <td>
                        <b-button
                          @click="confirmUpdate(config)"
                          class="btn btn-warning ml-1"
                        >
                          <i class="far fa-edit"></i>
                          Sửa
                        </b-button>
                        <b-button
                          @click="confirmDelete(config)"
                          class="btn btn-danger ml-1"
                        >
                          <i class="fas fa-trash"></i>
                          Xóa
                        </b-button>
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
                      :total-rows="pageData.totalItems"
                      v-model="pageData.currentPage"
                      :per-page="pageData.perPage"
                      v-on:change="pageChanged"
                    />
                  </div>
                  <div class="col-sm text-sm-left text-center pt-3">
                    <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                  </div>
                </div>
              </b-card-body>
              <!-- / Pagination -->
          </b-card>
          <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>

import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import trucksService from 'domain/services/trucks-service'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'

Vue.use(VeeValidate)
export default {
  components: {
    'multi-select': Multiselect,
    'ladda-btn': LaddaBtn,
    'loading-mini-bottom': LoadingMiniBottom
  },
  created () {
    this.getListProvinces()
    this.getListStations()
    this.getListPostOfficesConfigs(7, 1, true)
  },
  data: () => ({
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 20
    },
    saveData: {
      id: null,
      province: null,
      transfer_province: null,
      stations: null
    },
    configsData: null,
    selectedProvince: null,
    selectedProvinceTransfer: null,
    selectedStations: null,
    listProvinces: [],
    listStations: [],
    isShowModalAdd: false,
    isShowConfirmAdd: false,
    isShowModalUpdate: false,
    isShowConfirmUpdate: false,
    isShowConfirmDelete: false,
    appLoading: false,
    loading: [false, false, false, false, false, false, false, false, false, false, false, false]
  }),
  methods: {
    pageChanged (page) { // Event check pagination change
      this.getListPostOfficesConfigs(7, page, false)
      this.pageData.currentPage = page
    },
    updatePage (newTotal) {
      this.pageData.totalItems = newTotal
      this.pageData.totalPages = Math.ceil(newTotal / this.pageData.perPage)
    },
    getListProvinces () {
      trucksService.getListProvinces().then(response => {
        if (response.data.success) {
          this.listProvinces = response.data.data
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
    getListStations () {
      trucksService.getListStations().then(response => {
        if (response.data.success) {
          this.listStations = response.data.data
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
    validateConfigData (type) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (type === 'add') {
            this.isShowConfirmAdd = true
          }
          if (type === 'update') {
            this.isShowConfirmUpdate = true
          }
        }
      })
    },
    getListPostOfficesConfigs (timeLoading, page, isNewSearch) {
      let dataSend = {
        page: page,
        province_id: this.selectedProvince ? this.selectedProvince.code : null,
        transfer_province_id: this.selectedProvinceTransfer ? this.selectedProvinceTransfer.code : null,
        station_ids: this.selectedStations ? this.selectedStations.map(item => item.code) : null
      }

      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (isNewSearch) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }

      this.appLoading = true
      this.startLoading(timeLoading)
      trucksService.getListPostOfficesConfigs(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.configsData = response.data.data
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.updateLoadingValue(timeLoading, false)
        this.appLoading = false
      })
    },
    showModalAdd () {
      this.saveData = {
        id: null,
        province: null,
        transfer_province: null,
        stations: null
      }
      this.isShowModalAdd = true
    },
    confirmUpdate (config) {
      this.saveData = {
        id: config.id,
        province: config.province,
        transfer_province: config.transfer_province,
        stations: config.station
      }
      this.isShowModalUpdate = true
    },
    confirmDelete (config) {
      this.saveData = {
        id: config.id,
        province: config.province,
        transfer_province: config.transfer_province,
        stations: config.station
      }
      this.isShowConfirmDelete = true
    },
    savePostOfficesConfigs (timeLoading) {
      let saveData = {
        province: this.saveData.province ? this.saveData.province : null,
        transfer_province: this.saveData.transfer_province ? this.saveData.transfer_province : null,
        stations: this.saveData.stations ? this.saveData.stations : null
      }

      if (this.saveData.id) {
        saveData.id = this.saveData.id
        saveData.stations = this.saveData.stations ? this.saveData.stations : null
      } else {
        saveData.stations = this.saveData.stations ? this.saveData.stations : null
      }

      this.startLoading(timeLoading)
      trucksService.savePostOfficesConfigs(saveData).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'text-white bg-success',
            title: 'Thông báo',
            text: response.data.message
          })

          if (this.saveData.id) {
            this.getListPostOfficesConfigs(7, this.pageData.currentPage, false)
          } else {
            location.reload()
            // this.resetForm()
            // this.getListPostOfficesConfigs(7, 1, true)
          }

          this.isShowConfirmAdd = false
          this.isShowModalAdd = false
          this.isShowConfirmUpdate = false
          this.isShowModalUpdate = false
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.updateLoadingValue(timeLoading, false)
      })
    },
    removePostOfficesConfig (timeLoading) {
      this.startLoading(timeLoading)
      trucksService.removePostOfficesConfig(this.saveData.id).then(response => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'text-white bg-success',
            title: 'Thông báo',
            text: response.data.message
          })
          this.getListPostOfficesConfigs(7, this.pageData.currentPage, false)
          this.isShowConfirmAdd = false
          this.isShowModalAdd = false
          this.isShowConfirmUpdate = false
          this.isShowModalUpdate = false
          this.isShowConfirmDelete = false
        } else {
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.updateLoadingValue(timeLoading, false)
      })
    },
    resetForm () {
      this.selectedProvince = null
      this.selectedProvinceTransfer = null
      this.selectedStations = null
    },
    searchPostOfficesConfig (page) {
    },
    ExportExcel () {
      alert('Tính năng đang hoàn thiện, vui lòng quay lại sau!')
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
    }
  },
  computed: {
  },
  watch: {
  }
}
</script>

<style scoped>
.search-form {
  border: 1px solid #ccc;
  border-radius: 5px;
  background: white;
  padding: 20px;
}
.box-btn {
  /* margin-left: 36rem; */
}
.title-form-grp {
  color: #4E5155 !important;
  font-size: 13.3px !important;
  font-weight: 500 !important;
}
</style>
