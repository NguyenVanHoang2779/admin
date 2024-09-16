<template>
  <div>
    <b-row v-if="!editForm.isEdit">
      <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
        <div class="d-inline">Quản lý Config tỉnh cho cước đường dài</div> <br />
        <b-btn variant="success" @click="toggleEdit" class="float-right" style="margin-left: 10px">
          Thêm mới
        </b-btn>
        <b-btn v-if="isConfigUser" variant="success" @click="toggleUpload" class="float-right" style="margin-left: 10px">
          Upload file
        </b-btn>
        <b-select class="d-inline-block w-auto float-right" size="md" v-model="typeSelectCal" :options="typeCalOptions" style="font-size: 14px"></b-select>
      </h4>

        <!------------------------------------------------Quản lý Config tỉnh của cước liên miền-------------------------------------------------------------->
      <b-card no-body class="mb-1 w-100 " style="border: 2px #b2b2b2 solid; borderRadius: 10px">
        <b-card-body style="minHeight: 1000px">
          <div>
            <b-row>
              <b-col md="4" class="mt-3 mb-3">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="2"
                  label-size="lg"
                  label="Công ty"
                  label-for="input-companies"
                  label-align-sm="right"
                >
                  <multiselect class="multiselect-success"
                               v-model="formSearch.companies"
                               :options="companies"
                               selectedLabel="Đã chọn"
                               deselectLabel="Bỏ chọn"
                               selectLabel="Chọn"
                               track-by="value"
                               label="text"
                               :searchable="true"
                               :multiple="false"
                               :allow-empty="true"
                               :hide-selected="false"
                               :clearOption="true"
                  >
                  </multiselect>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mt-3 mb-3">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="2"
                  label-size="lg"
                  label="Tỉnh"
                  label-for="input-province"
                  label-align-sm="right"
                >
                  <multiselect class="multiselect-success"
                               v-model="formSearch.provinces"
                               :options="provinces"
                               placeholder="Chọn tỉnh"
                               selectedLabel="Đã chọn"
                               deselectLabel="Bỏ chọn"
                               selectLabel="Chọn"
                               track-by="value"
                               label="text"
                               :searchable="true"
                               :multiple="false"
                               :hide-selected="false"
                               :allow-empty="true"
                               :clearOption="true"
                  >
                  </multiselect>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mt-3 mb-3">
                <form action="" autocomplete="off">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="3"
                  label-size="lg"
                  label="Ngày tính cước"
                  label-for="input-date"
                  label-align-sm="right"
                  style="font-size: 13px"
                >
                  <datepicker
                    id="input-to"
                    v-model="formSearch.date"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    :allow-empty="true"
                    onautocomplete="off"
                  />
                </b-form-group>
                </form>
              </b-col>
              <b-col md="4" class="mt-3 mb-3" v-if="typeSelectCal === 1">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="2"
                  label-size="lg"
                  label="Trọng tải"
                  label-for="input-weight"
                  label-align-sm="right"
                >
                  <multiselect
                    id="input-weight"
                    :options="weights"
                    v-model="formSearch.weight"
                    label="text"
                    track-by="text"
                    :allow-empty="true"
                    :clearOption="true"
                  ></multiselect>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mt-3 mb-3" v-if="typeSelectCal === 2">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="2"
                  label-size="lg"
                  label="Thể tích"
                  label-for="input-trunk-volume"
                  label-align-sm="right"
                >
                  <b-input type="number" v-model="formSearch.trunk_volume"/>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mt-3 mb-3">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="2"
                  label-size="lg"
                  label="Tuyến giá"
                  label-for="input-rent_route_name"
                  label-align-sm="right"
                >
                <multiselect class="multiselect-success"
                               v-model="formSearch.rentRouteNames"
                               :options="rentRouteNames"
                               placeholder="Chọn Tuyến giá"
                               selectedLabel="Đã chọn"
                               deselectLabel="Bỏ chọn"
                               selectLabel="Chọn"
                               track-by="value"
                               label="text"
                               :searchable="true"
                               :multiple="false"
                               :allow-empty="true"
                               :hide-selected="false"
                               :clearOption="true">
                </multiselect>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mt-3 mb-3"></b-col>
              <b-col md="4" class="mt-3 mb-3"></b-col>
              <b-col md="2" class="mt-3 mb-3">
                <ladda-btn
                  class="btn btn-secondary w-100"
                  @click.native="clearFormSearch"
                >
                    Làm lại
                </ladda-btn>
              </b-col>
              <b-col md=2 class="mt-3 mb-3">
                <ladda-btn
                  class="btn btn-success w-100"
                  @click.native="searchProvRentTruck(true)"
                  :loading="formSearch.loading"
                >
                  <i class="sidenav-icon ion ion-md-search"></i>
                  Tìm kiếm
                </ladda-btn>
              </b-col>
              <b-col md=4></b-col>
              <div class="md-12 mt-3">
                Trang <b> {{currentTablePage}} / {{totalPage}} </b>, <b> {{fromRecord}}-{{toRecord}} </b> trên <b> {{countRoute}} </b> bản ghi
              </div>
              <b-table
                striped hover
                :fields="computedFields"
                :items="tableRouteData.listRoute"
                :current-page="tableRouteData.currentPage"
              >

                <template v-slot:cell(actions)="row">
                  <ladda-btn
                    class="btn btn-secondary"
                    @click.native="editRoute(row.item)"
                  >Sửa</ladda-btn>
                  <ladda-btn class="btn btn-danger" @click.native="removeProvRentTruck(row.item.id)">Xóa</ladda-btn>
                </template>
                <template v-slot:cell(salary)="row">
                  <div>
                    {{parseFloat(row.item.salary).toLocaleString()}}
                  </div>
                </template>

              </b-table>
              <b-pagination
                v-model="tableRouteData.currentPage"
                :total-rows="countRoute"
                :per-page="tableRouteData.perPage"
                aria-controls="my-table"
                align="right"
              ></b-pagination>
            </b-row>
          </div>
        </b-card-body>
      </b-card>
    </b-row>
    <CreateProvinceRentTruck
      v-else-if="manageUpload === false"
      :toggleEdit="toggleEdit"
      :tmpRouteData="editForm.editData"
      :clearFormSearch="clearFormSearch"
    ></CreateProvinceRentTruck>
    <ManageUploadProvinceRentTruck
    v-if="manageUpload === true"
    :toggleUpload="toggleUpload"
    :clearFormSearch="clearFormSearch"
    ></ManageUploadProvinceRentTruck>
  </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import routeService from 'domain/services/route-service'
import CreateProvinceRentTruck from './CreateProvinceRentTruck.vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import ManageUploadProvinceRentTruck from './ManageUploadProvinceRentTruck.vue'
import {mapGetters} from 'vuex'
import {eventBus} from '../../../../main'
// import moment from "moment"

const TYPE_CAL_OPTIONS = [
  { value: 1, text: 'Trọng tải' },
  { value: 2, text: 'Thể tích thùng xe' }
]

export default {
  name: 'manage-conf-prov-rent-truck',
  metaInfo: {
    title: 'Quản lý Config tỉnh cước đường dài'
  },

  components: {
    LaddaBtn,
    Multiselect,
    routeService,
    CreateProvinceRentTruck,
    commonHelper,
    Datepicker,
    ManageUploadProvinceRentTruck
  },

  data: () => ({
    formSearch: {
      loading: false,
      companies: {
        text: null,
        value: 0
      },
      weight: {
        text: null,
        value: 0
      },
      provinces: {
        text: null,
        value: 0
      },
      date: null,
      trunk_volume: null,
      rentRouteNames: {
        text: null,
        value: 0
      }
    },
    storeFormSearch: {
      companies: {
        text: null,
        value: 0
      },
      weight: {
        text: null,
        value: 0
      },
      provinces: {
        text: null,
        value: 0
      },
      date: null,
      rentRouteNames: {
        text: null,
        value: 0
      }
    },
    tableRouteFields: [
      { key: 'name', label: 'Tên config tỉnh' },
      { key: 'company', label: 'Công ty' },
      { key: 'dateFrom', label: 'Ngày bắt đầu' },
      { key: 'dateTo', label: 'Ngày kết thúc' },
      { key: 'gross_ton', label: 'Trọng tải' },
      { key: 'prov_names', label: 'Danh sách tỉnh' },
      { key: 'price_rent_truck', label: 'Cước chưa VAT' },
      { key: 'tax_rate', label: 'Thuế VAT(%)' },
      { key: 'actions', label: 'Thao tác' }
    ],
    tableTrunkVolumeFields: [
      { key: 'name', label: 'Tên config tỉnh' },
      { key: 'company', label: 'Công ty' },
      { key: 'dateFrom', label: 'Ngày bắt đầu' },
      { key: 'dateTo', label: 'Ngày kết thúc' },
      { key: 'from_trunk_volume', label: 'Từ thể tích' },
      { key: 'to_trunk_volume', label: 'Tới thể tích' },
      { key: 'prov_names', label: 'Danh sách tỉnh' },
      { key: 'price_rent_truck', label: 'Cước chưa VAT' },
      { key: 'tax_rate', label: 'Thuế VAT(%)' },
      { key: 'actions', label: 'Thao tác' }
    ],
    weights: [
      { value: 1.25, text: 1.25 },
      { value: 1.9, text: 1.9 },
      { value: 3.5, text: 3.5 },
      { value: 5, text: 5 },
      { value: 8, text: 8 },
      { value: 10, text: 10 },
      { value: 15, text: 15 },
      { value: 20, text: 20 }
    ],
    companies: [],
    provinces: [],
    rentRouteNames: [],
    tableRouteData: {
      listRoute: null,
      count: 0,
      perPage: 5,
      currentPage: 1
    },
    editForm: {
      editData: null,
      isEdit: false,
      isUpload: false
    },
    typeSelectCal: 1,
    manageUpload: false,
    isConfigUser: false
  }),

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    countRoute () {
      return this.tableRouteData.count
    },
    totalPage () {
      if (this.tableRouteData.count === 0) return 1
      if (this.tableRouteData.count % this.tableRouteData.perPage === 0) {
        return parseInt(this.tableRouteData.count / this.tableRouteData.perPage)
      }
      return parseInt(this.tableRouteData.count / this.tableRouteData.perPage) + 1
    },
    fromRecord () {
      if (this.countRoute === 0) {
        return 0
      }
      let from = (this.tableRouteData.currentPage - 1) * this.tableRouteData.perPage + 1
      if (from > this.countRoute) from = from - this.tableRouteData.perPage
      return from
    },
    toRecord () {
      let to = this.tableRouteData.currentPage * this.tableRouteData.perPage
      return to > this.countRoute ? this.countRoute : to
    },
    currentTablePage () {
      return this.tableRouteData.currentPage
    },
    computedFields () {
      if (this.typeSelectCal === 1) return this.tableRouteFields
      else return this.tableTrunkVolumeFields
    }
  },

  created () {
    this.getListCompanies()
    this.getAllProvince()
    this.searchProvRentTruck(false)
    this.typeCalOptions = TYPE_CAL_OPTIONS
    eventBus.$on('uploadConfigSuccess', this.getDataUpload)
  },

  watch: {
    currentTablePage () {
      return this.nextPageProvRentTruck()
    },
    typeSelectCal: function () {
      this.tableRouteData.currentPage = 1
      return this.searchProvRentTruck(false)
    },
    'formSearch.companies' () {
      if (this.formSearch.companies !== null) {
        let companyId = this.formSearch.companies.value ? this.formSearch.companies.value : 0
        return this.getListNameRentRoute(companyId)
      } else {
        this.rentRouteNames = []
        this.formSearch.rentRouteNames = null
      }
    },
    userInfo () {
      if (this.userInfo && this.userInfo.User.username && this.userInfo.User.id) {
        return this.getDataUser(this.userInfo.User.username, this.userInfo.User.id)
      }
    }
  },

  methods: {
    getListCompanies: function () {
      routeService.getListCompanies().then(res => {
        let companyOptionDefault = [
          { value: null, text: 'Chọn công ty' }
        ]
        if (res.data.success) {
          let listCompanies = []
          for (let key in res.data.data) {
            let option = {
              value: res.data.data[key].value,
              text: res.data.data[key].text
            }
            listCompanies.push(option)
          }
          this.companies = companyOptionDefault.concat(listCompanies)
          // commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getListNameRentRoute: function (data) {
      let rentRouteNamesDefault = []
      if (data !== 0) {
        let dataSend = {
          company_id: data
        }
        routeService.getListNameRentRoute(dataSend).then(res => {
          if (res.data.success) {
            let listRentRoute = []
            for (let key in res.data.data) {
              let option = {
                value: res.data.data[key].id,
                text: res.data.data[key].name ? res.data.data[key].name : ''
              }
              listRentRoute.push(option)
            }
            this.rentRouteNames = rentRouteNamesDefault.concat(listRentRoute)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    getAllProvince: function () {
      let provinceOptionDefault = [
        { value: null, text: 'Chọn tỉnh' }
      ]

      let dataSend = {
        region: 'all'
      }
      routeService.getProvinceFromRegion(dataSend).then(res => {
        if (res.data.success) {
          let listProvince = []
          for (let key in res.data.data) {
            let option = {
              value: key,
              text: res.data.data[key] ? res.data.data[key] : ''
            }
            listProvince.push(option)
          }
          this.provinces = provinceOptionDefault.concat(listProvince)
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        console.log(err)
        commonHelper.showMessage('Xảy ra lỗi trong quá trình lấy danh sách tỉnh')
      })
    },
    toggleEdit: function () {
      this.editForm.isEdit = !this.editForm.isEdit
      this.editForm.editData = null
    },
    toggleUpload: function () {
      this.manageUpload = !this.manageUpload
      this.editForm.isEdit = !this.editForm.isEdit
      this.editForm.isUpload = !this.editForm.isUpload
    },
    editRoute: function (data) {
      this.editForm.editData = data
      this.editForm.isEdit = true
    },
    searchProvRentTruck: function (isLoading) {
      if (isLoading) {
        this.formSearch.loading = true
      }
      this.storeFormSearch = {...this.formSearch}
      if (this.tableRouteData.currentPage > 1) {
        if (isLoading) {
          this.formSearch.loading = true
          this.tableRouteData.currentPage = 1
          return
        }
      }
      if (this.typeSelectCal === 1) {
        this.formSearch.trunk_volume = 0
      }

      let dataSend = {
        company_id: this.formSearch.companies !== null ? this.formSearch.companies.value : 0,
        weight: this.formSearch.weight !== null ? this.formSearch.weight.value : 0,
        province: this.formSearch.provinces !== null ? this.formSearch.provinces.value : '',
        date: this.formSearch.date,
        trunk_volume: this.formSearch.trunk_volume,
        type_cal: this.typeSelectCal,
        rent_route_name: this.formSearch.rentRouteNames !== null ? this.formSearch.rentRouteNames.text : ''
      }

      console.log(dataSend)
      this.apiGetProvRentTruckConfig(dataSend).then(res => {
        this.formSearch.loading = false
      })
    },
    nextPageProvRentTruck: function () {
      if (this.typeSelectCal === 1) {
        this.formSearch.trunk_volume = 0
      }
      let dataSend = {
        company_id: this.formSearch.companies.value,
        weight: this.formSearch.weight.value,
        province: this.formSearch.provinces.value,
        date: this.formSearch.date,
        trunk_volume: this.formSearch.trunk_volume,
        type_cal: this.typeSelectCal,
        rent_route_name: this.formSearch.rentRouteNames.text
      }
      this.apiGetProvRentTruckConfig(dataSend).then(res => {
        this.formSearch.loading = false
      })
    },
    apiGetProvRentTruckConfig: function (dataSend) {
      dataSend.limit = this.tableRouteData.perPage
      dataSend.page = this.currentTablePage
      return routeService.apiGetProvRentTruckConfig(dataSend).then(res => {
        if (res.data.success) {
          // lay data thanh cong
          let arrData = []
          res.data.data.forEach(element => {
            arrData.push(element)
          })
          this.tableRouteData.count = res.data.count
          this.tableRouteData.listRoute = arrData
        } else {
          // lay data that bai
          this.tableRouteData.count = 0
          this.tableRouteData.listRoute = []
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        console.log(err)
        commonHelper.showMessage('Đã xảy ra lỗi!', 'warning')
      })
    },
    clearFormSearch: function () {
      this.storeFormSearch = {
        companies: {
          text: null,
          value: 0
        },
        weight: {
          text: null,
          value: 0
        },
        provinces: {
          text: null,
          value: 0
        },
        date: null,
        rentRouteNames: {
          text: null,
          value: 0
        }
      }
      this.formSearch = {
        loading: false,
        companies: {
          text: null,
          value: 0
        },
        weight: {
          text: null,
          value: 0
        },
        provinces: {
          text: null,
          value: 0
        },
        date: null,
        rentRouteNames: {
          text: null,
          value: 0
        }
      }
      this.rentRouteNames = []
      if (this.tableRouteData.currentPage > 1) {
        this.tableRouteData.currentPage = 1
        return
      }
      this.searchProvRentTruck(false)
    },
    removeProvRentTruck: function (idRoute) {
      if (!confirm('Bạn có chắc chắn muốn xóa config này không?')) {
        return
      }
      let dataSend = {
        id: idRoute
      }
      routeService.apiDeleteProvRentTruck(dataSend).then(res => {
        if (res.data.success) {
          this.clearFormSearch()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình xóa config!', 'warning')
        console.log(err)
      })
    },
    getDataUser: function (userName, userId) {
      let dataSend = {
        username: userName,
        id: userId
      }
      routeService.checkUserCanConfig(dataSend).then(res => {
        if (res.data.success === true) {
          this.isConfigUser = true
          console.log('User config ' + this.isConfigUser)
        }
      })
    },
    getDataUpload: function () {
      this.searchProvRentTruck(false)
    }
  }
}
</script>
<style scoped>
  .ladda-button >>> .ladda-label {
    z-index: 0 !important;
  }
</style>
