<template>
  <div>
    <b-row v-if="!editForm.isEdit">
      <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
        <div class="d-inline">Quản lý Config lương tối thiểu cho tài xế đường dài</div>
        <b-btn variant="success" @click="toggleEdit" class="float-right" style="marginTop: -10px">
          Thêm mới
        </b-btn>
      </h4>

        <!------------------------------------------------Quản lý Config lương tối thiểu cho tài xế đường dài-------------------------------------------------------------->
      <b-card no-body class="mb-1 w-100 " style="border: 2px #b2b2b2 solid; borderRadius: 10px">
        <b-card-body style="minHeight: 1000px">
          <div>
            <b-row>
              <b-col md="4" class="mt-3 mb-3">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="2"
                  label-size="lg"
                  label="Miền"
                  label-for="input-region"
                  label-align-sm="right"
                >
                  <b-form-select
                    id="input-region"
                    :options="regions"
                    v-model="formSearch.region"
                    @change="getProvinceFromRegion"
                  ></b-form-select>
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
                  <multiselect
                    id="input-province"
                    :options="provinces"
                    v-model="formSearch.province"
                    label="text"
                    track-by="text"
                  ></multiselect>
                </b-form-group>
              </b-col>
              <b-col md="4" class="mt-3 mb-3">
                <b-form-group
                  label-cols="5"
                  label-cols-lg="2"
                  label-size="lg"
                  label="Lương"
                  label-for="input-salary"
                  label-align-sm="right"
                >
                  <b-form-input
                    id="input-salary"
                    type="number"
                    placeholder="0"
                    v-model="formSearch.salary"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md=4></b-col>
              <b-col md=2 class="mt-3 mb-3">
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
                  @click.native="searchConfMinWageDriver(true)"
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
                :fields="tableRouteFields"
                :items="tableRouteData.listRoute"
                :current-page="tableRouteData.currentPage"
              >

                <template v-slot:cell(actions)="row">
                  <ladda-btn
                    class="btn btn-secondary"
                    @click.native="editRoute(row.item)"
                  >Sửa</ladda-btn>
                  <ladda-btn class="btn btn-danger" @click.native="apiRemoveConfMinWageDriver(row.item.id)">Xóa</ladda-btn>
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
    <CreateConfMinWageDriver
      v-else
      :toggleEdit="toggleEdit"
      :tmpRouteData="editForm.editData"
      :clearFormSearch="clearFormSearch"
    ></CreateConfMinWageDriver>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import routeService from 'domain/services/route-service'
import CreateConfMinWageDriver from './CreateConfMinWageDriver'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'manage-conf-min-wage-driver',

  metaInfo: {
    title: 'Quản lý Config lương tối thiểu tài xế'
  },

  components: {
    LaddaBtn,
    Multiselect,
    routeService,
    CreateConfMinWageDriver,
    commonHelper
  },

  data: () => ({
    formSearch: {
      loading: false,
      region: null,
      province: null,
      salary: null
    },
    storeFormSearch: {
      region: null,
      province: null,
      salary: null
    },
    tableRouteFields: [
      { key: 'name', label: 'Lộ trình lương tối thiểu' },
      { key: 'name_provinces', label: 'Danh sách tỉnh' },
      { key: 'num_ss', label: 'Số chuyến' },
      { key: 'salary', label: 'Lương tối thiểu' },
      { key: 'actions', label: 'Thao tác' }
    ],
    regions: [
      { value: null, text: 'Chọn miền (Bắc/Trung/Nam)' },
      { value: 'MB', text: 'Miền Bắc' },
      { value: 'MT', text: 'Miền Trung' },
      { value: 'MN', text: 'Miền Nam' },
      { value: 'HN', text: 'Hà Nội' },
      { value: 'HCM', text: 'Hồ Chí Minh' }
    ],
    provinces: [
      { value: null, text: 'Chọn tỉnh' }
    ],
    tableRouteData: {
      listRoute: null,
      count: 0,
      perPage: 5,
      currentPage: 1
    },
    editForm: {
      editData: null,
      isEdit: false
    }
  }),

  computed: {
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
    }
  },

  created () {
    this.searchConfMinWageDriver(false)
  },

  watch: {
    currentTablePage () {
      return this.nextPageConfMinWageDriver()
    }
  },

  methods: {
    toggleEdit: function () {
      this.editForm.isEdit = !this.editForm.isEdit
      this.editForm.editData = null
    },
    editRoute: function (data) {
      this.editForm.editData = data
      this.editForm.isEdit = true
    },
    getProvinceFromRegion: function () {
      if (!this.formSearch.region) return
      let provinceOptionDefault = [
        { value: null, text: 'Chọn tỉnh' }
      ]

      let dataSend = {
        region: this.formSearch.region
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
    searchConfMinWageDriver: function (isLoading) {
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
      let dataSend = {
        region: this.formSearch.region,
        province_id: this.formSearch.province ? this.formSearch.province.value : null,
        salary: this.formSearch.salary
      }
      this.apiGetConfMinWageDriver(dataSend).then(res => {
        this.formSearch.loading = false
      })
    },
    nextPageConfMinWageDriver: function () {
      let dataSend = {
        region: this.storeFormSearch.region,
        province_id: this.storeFormSearch.province ? this.storeFormSearch.province.value : null,
        salary: this.storeFormSearch.salary
      }
      this.apiGetConfMinWageDriver(dataSend).then(res => {
        this.formSearch.loading = false
      })
    },
    apiGetConfMinWageDriver: function (dataSend) {
      dataSend.limit = this.tableRouteData.perPage
      dataSend.page = this.currentTablePage
      return routeService.apiGetConfMinWageDriver(dataSend).then(res => {
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
        region: null,
        province: null,
        salary: null
      }
      this.formSearch = {
        loading: false,
        region: null,
        province: null,
        salary: null
      }
      if (this.tableRouteData.currentPage > 1) {
        this.tableRouteData.currentPage = 1
        return
      }
      this.searchConfMinWageDriver(false)
    },
    apiRemoveConfMinWageDriver: function (idRoute) {
      if (!confirm('Bạn có chắc chắn muốn xóa config này không?')) {
        return
      }
      let dataSend = {
        id: idRoute
      }
      routeService.apiRemoveConfMinWageDriver(dataSend).then(res => {
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
    }
  }
}
</script>
<style scoped>
  .ladda-button >>> .ladda-label {
    z-index: 0 !important;
  }
</style>
