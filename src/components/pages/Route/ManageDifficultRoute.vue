<template>
  <div>
    <b-row v-if="!isEdit">
      <h4 class="justify-content-between align-items-center w-100 font-weight-bold">
        <div class="d-inline">Quản lý lộ trình khó</div>
        <b-btn variant="success" @click="toggleEdit" class="float-right" style="marginTop: -10px">
          Thêm lộ trình khó
        </b-btn>
      </h4>

      <!------------------------------------------------Quản lý lộ trình khó-------------------------------------------------------------->
      <b-card no-body class="mb-1" style="border: 2px #b2b2b2 solid; borderRadius: 10px">
        <b-card-body style="minHeight: 1000px">
          <div>
            <b-row>
              <b-col md="6">
                <b-col>
                  <b-form-group label-cols="5" label-cols-lg="2" label-size="lg" label="Miền" label-for="input-region" label-align-sm="left">
                    <b-form-select id="input-region" :options="regions" v-model="search.region" @change="getProvinceFromRegion">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label-cols="5" label-cols-lg="2" label-size="lg" label="Tỉnh" label-for="input-provinces" label-align-sm="left">
                    <multiselect
                      id="input-provinces"
                      :options="provinces"
                      v-model="search.province_id"
                      @input="getDistrictFromProvince"
                      label="text"
                      track-by="text"
                    >
                    </multiselect>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label-cols="5" label-cols-lg="2" label-size="lg" label="Loại" label-for="input-type" label-align-sm="left">
                    <b-form-select id="input-type" :options="types" v-model="search.type">
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-col>
              <b-col md="6">
                <b-col>
                  <b-form-group label-cols="5" label-cols-lg="2" label-size="lg" label="Quận/Huyện" label-for="input-districts" label-align-sm="left">
                    <multiselect
                      id="input-districts"
                      :options="districts"
                      v-model="search.district_id"
                      label="text"
                      track-by="text"
                    >
                    </multiselect>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label-cols="5" label-cols-lg="2" label-size="lg" label="Level" label-for="input-levels" label-align-sm="left">
                    <b-form-select id="input-levels" :options="levels" v-model="search.level">
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-col>
              <b-col md=4></b-col>
              <b-col md=2 class="mt-3 mb-3">
                <ladda-btn class="btn btn-secondary w-100" @click.native="clearFormSearch">Làm lại</ladda-btn>
              </b-col>
              <b-col md=2 class="mt-3 mb-3">
                <ladda-btn class="btn btn-success w-100" @click.native="searchLoTrinhKho(true, true)" :loading="loadingSearch">
                  <i class="sidenav-icon ion ion-md-search"></i>
                  Tìm kiếm
                </ladda-btn>
              </b-col>
              <b-col md=4></b-col>
              <div class="md-12">
                Trang <b> {{tableRoute.currentPage}}/{{totalPage}} </b>, <b> {{fromRecord}}-{{toRecord}} </b> trên <b> {{countData}} </b> bản ghi
              </div>
              <b-table
                striped hover
                :fields="fieldsRoute"
                :items="tableRoute.listData"
                :current-page="tableRoute.currentPage"
              >

                <template v-slot:cell(actions)="row">
                  <ladda-btn class="btn btn-secondary" @click.native="editRoute(row.item)">Sửa</ladda-btn>
                  <ladda-btn class="btn btn-danger" @click.native="apiRemoveLoTrinhKho(row.item.id)">Xóa</ladda-btn>
                </template>

                <template v-slot:cell(type)="row">
                  <div>
                    {{row.item.type === '1' ? 'KPI tài xế' : row.item.type === '2' ? 'Định mức dầu' : 'Cả hai loại'}}
                  </div>
                </template>

              </b-table>
              <b-pagination
                v-model="tableRoute.currentPage"
                :total-rows="countData"
                :per-page="tableRoute.perPage"
                aria-controls="my-table"
                align="right"
              ></b-pagination>
            </b-row>
          </div>
        </b-card-body>
      </b-card>
    </b-row>
    <CreateDifficultRoute v-else :toggleEdit="toggleEdit" :tmpRouteData="editData" :searchLoTrinhKho="searchLoTrinhKho" :clearFormSearch="clearFormSearch"></CreateDifficultRoute>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import routeService from 'domain/services/route-service'
import CreateDifficultRoute from './CreateDifficultRoute'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'manage-difficult-route',

  metaInfo: {
    title: 'Quản lý lộ trình khó'
  },

  components: {
    LaddaBtn,
    Multiselect,
    routeService,
    CreateDifficultRoute,
    commonHelper
  },

  data: () => ({
    loadingSearch: false,
    editData: null,
    isEdit: false,
    fieldsRoute: [
      { key: 'name', label: 'Tên lộ trình' },
      { key: 'id_lotrinh', label: 'Mã lộ trình' },
      { key: 'name_dist', label: 'List quận/huyện' },
      { key: 'street_name', label: 'Tên đường' },
      { key: 'level', label: 'Level' },
      { key: 'type', label: 'Loại' },
      { key: 'actions', label: 'Thao tác' }
    ],
    tableRoute: {
      count: 0,
      listData: null,
      perPage: 5,
      currentPage: 1
    },
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
    districts: [
      { value: null, text: 'Chọn quận/huyện' }
    ],
    levels: [
      { value: null, text: 'Chọn Level 1/Level 2' },
      { value: 1, text: 'Level 1' },
      { value: 2, text: 'Level 2' }
    ],
    types: [
      { value: null, text: 'Chọn loại tuyến' },
      { value: 1, text: 'KPI tài xế' },
      { value: 2, text: 'Định mức dầu' },
      { value: 3, text: 'Cả hai loại' }
    ],
    search: {
      type: null,
      region: null,
      province_id: null,
      district_id: null,
      level: null
    },
    nextPage: {
      type: null,
      region: null,
      province_id: null,
      district_id: null,
      level: null
    }
  }),

  computed: {
    countData () {
      return this.tableRoute.count
    },
    totalPage () {
      if (this.tableRoute.count === 0) return 1
      if (this.tableRoute.count % this.tableRoute.perPage === 0) {
        return parseInt(this.tableRoute.count / this.tableRoute.perPage)
      }
      return parseInt(this.tableRoute.count / this.tableRoute.perPage) + 1
    },
    fromRecord () {
      if (this.countData === 0) {
        return 0
      }
      let from = (this.tableRoute.currentPage - 1) * this.tableRoute.perPage + 1
      return from > this.countData ? from - this.tableRoute.perPage : from
    },
    toRecord () {
      let to = this.tableRoute.currentPage * this.tableRoute.perPage
      return to > this.countData ? this.countData : to
    },
    currentTablePage () {
      return this.tableRoute.currentPage
    }
  },

  created () {
    this.searchLoTrinhKho()
  },

  watch: {
    currentTablePage () {
      return this.searchLoTrinhKho(false)
    }
  },

  methods: {
    toggleEdit: function () {
      this.isEdit = !this.isEdit
      this.editData = null
    },
    editRoute: function (data) {
      this.editData = data
      this.isEdit = true
    },
    getProvinceFromRegion: function () {
      if (!this.search.region) return
      let provinceDefault = [
        { value: null, text: 'Chọn tỉnh' }
      ]
      let dataSend = {
        region: this.search.region
      }
      routeService.getProvinceFromRegion(dataSend).then(res => {
        if (res.data.success) {
          let listProvince = []
          for (let key in res.data.data) {
            let dataProvince = {
              value: key,
              text: res.data.data[key]
            }
            listProvince.push(dataProvince)
          }
          this.provinces = provinceDefault.concat(listProvince)
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình lấy danh sách tỉnh!', 'warning')
        console.log(err)
      })
    },
    getDistrictFromProvince: function () {
      if (!this.search.province_id.value) return
      let districtDefault = [
        { value: null, text: 'Chọn quận/huyện' }
      ]
      let dataSend = {
        province_id: this.search.province_id.value
      }
      routeService.getDistrictFromProvince(dataSend).then(res => {
        if (res.data.success) {
          let listDistrict = []
          for (let key in res.data.data) {
            let dataProvince = {
              value: key,
              text: res.data.data[key]
            }
            listDistrict.push(dataProvince)
          }
          this.districts = districtDefault.concat(listDistrict)
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình lấy danh sách quận/huyện!', 'warning')
        console.log(err)
      })
    },
    searchLoTrinhKho: function (isLoading = true, btnSearch = false) {
      if (isLoading) {
        this.loadingSearch = true
      }
      if (btnSearch) {
        this.nextPage = {
          type: this.search.type,
          region: this.search.region,
          province_id: this.search.province_id ? this.search.province_id.value : null,
          district_id: this.search.district_id ? this.search.district_id.value : null,
          level: this.search.level
        }
        if (this.tableRoute.currentPage > 1) {
          this.tableRoute.currentPage = 1
          return
        }
      }

      let dataSend = {
        type: btnSearch ? this.search.type : this.nextPage.type,
        region: btnSearch ? this.search.region : this.nextPage.region,
        province_id: btnSearch ? (this.search.province_id ? this.search.province_id.value : null) : this.nextPage.province_id,
        district_id: btnSearch ? (this.search.district_id ? this.search.district_id.value : null) : this.nextPage.district_id,
        level: btnSearch ? this.search.level : this.nextPage.level,
        limit: this.tableRoute.perPage,
        page: this.currentTablePage
      }
      routeService.apiSearchLotrinhKho(dataSend).then(res => {
        if (res.data.success) {
          let arrayData = []
          for (let key in res.data.data) {
            arrayData.push(res.data.data[key])
          }
          this.tableRoute.count = res.data.count
          this.tableRoute.listData = arrayData
        } else {
          this.tableRoute.count = 0
          this.tableRoute.listData = []
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        console.log(err)
        commonHelper.showMessage('Đã xảy ra lỗi!', 'warning')
      }).then(() => {
        this.loadingSearch = false
      })
    },
    clearFormSearch: function () {
      this.nextPage = {
        type: null,
        region: null,
        province_id: null,
        district_id: null,
        level: null
      }
      this.provinces = [{ value: null, text: 'Chọn tỉnh' }]
      this.districts = [{ value: null, text: 'Chọn quận/huyện' }]
      this.search = {
        type: null,
        region: null,
        province_id: null,
        district_id: null,
        level: null
      }
      if (this.tableRoute.currentPage > 1) {
        this.tableRoute.currentPage = 1
        return
      }
      this.searchLoTrinhKho(false)
    },
    apiRemoveLoTrinhKho: function (idRoute) {
      if (!confirm('Bạn có chắc chắn muốn xóa lộ trình này không?')) {
        return
      }
      let dataSend = {
        id: idRoute
      }
      routeService.apiRemoveLoTrinhKho(dataSend).then(res => {
        if (res.data.success) {
          this.clearFormSearch()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(err => {
        commonHelper.showMessage('Xảy ra lỗi trong quá trình xóa lộ trình!', 'warning')
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
