<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading" style="display: inline-flex">Quản lý tuyến đường xe thuê</h4>
            <router-link :to="{name: 'add-truck-route'}" class="btn btn-outline-primary" style="float: right">Thêm tuyến mới</router-link>
            <hr>

            <div class="mb-2">
                <div class="flex-container">
                    <div>
                        <input placeholder="Nhập tên tuyến hoặc mã alias" v-model="searchText" type="text" @keyup.enter="searchRoute" class="form-control"/>
                    </div>
                    <div>
                        <b-form-select v-model="type" :options="optionRouteType" name="route_type" class="mb-3">
                            <template v-slot:first>
                                <option :value="null" disabled>-- Chọn loại tuyến --</option>
                            </template>
                        </b-form-select>
                    </div>
                    <div>
                        <b-form-select v-model="region" :options="optionRegions" class="only-bottom-border">
                            <template v-slot:first>
                                <option :value="null" disabled>-- Chọn miền --</option>
                            </template>
                        </b-form-select>
                    </div>
                    <div>
                        <single-select-province @handleSelectedProvince="handleSelectedProvince"></single-select-province>
                    </div>
                    <div>
                        <b-form-select v-model="isDeleted" :options="statusOptions" class="only-bottom-border">
                            <template v-slot:first>
                                <option :value="null" disabled>-- Chọn trạng thái tuyến đường --</option>
                            </template>
                        </b-form-select>
                    </div>
                </div>
                <b-row>
                    <b-col md="4" style="margin: 0 10px">
                        <multi-select-route-point @onChange="selectedPoint" :point="searchPoint" :region="region" :provinceId="provinceId"></multi-select-route-point>
                    </b-col>
                    <b-col md="2" class="text-right">
                        <b-btn type="button" variant="primary" @click="searchRoute()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                        <b-btn type="button" variant="success" class="btn btn-outline-primary" @click="reset()">Xóa lọc</b-btn>
                    </b-col>
                </b-row>
            </div>
        </div>
        <div class="mb-3">
            <div class="wrapper-list-master">
                <b-card no-body v-if="listRoutes.length > 0">
                    <table class="table mb-0 table-hover">
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên tuyến</th>
                            <th>Mã alias</th>
                            <th>Loại tuyến</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in listRoutes">
                            <td>{{index + currentPage * 10 - 9}}</td>
                            <td>{{item.ErpRentTruckRoute.name}}</td>
                            <td>{{item.ErpRentTruckRoute.alias}}</td>
                            <td>{{item.ErpRentTruckRoute.type}}</td>
                            <td>{{item.ErpRentTruckRoute.created}}</td>
                            <td>
                                <span v-if="item.ErpRentTruckRoute.is_deleted === '0'">Đang hoạt động</span>
                                <span v-else>Đã dừng hoạt động</span>
                            </td>
                            <td>
                                <router-link :to="{name: 'edit-truck-route', params: { id: item.ErpRentTruckRoute.id }}" class="btn btn-outline-secondary"><i class="ion ion-md-create"></i></router-link>
                                <b-btn class="btn btn-md btn-outline-danger" @click="deleteRoute(item)"><i class="ion ion-md-trash"></i></b-btn>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="mt-3" v-if="totalPages > 1">
                        <b-row>
                            <b-col md="6">
                                <b-pagination
                                        :total-rows="totalItems"
                                        v-model="currentPage"
                                        :per-page="perPage"
                                        v-on:input="getRentTruckRoutes()"
                                />
                            </b-col>
                            <b-col md="6">
                                <span class="text-muted">Trang {{ currentPage }} trên {{ totalPages }}</span>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
                <div v-if="listRoutes.length === 0">
                    <span class="pl-3 font-weight-bold">Rất tiếc, không tìm thấy tuyến đường nào!</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectCompanyProfile from 'components/elements/common/SingleSelectCompanyProfile'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import MultiSelectRoutePoint from 'components/elements/common/MultiSelectRoutePoint'
import VueUploadComponent from 'vue-upload-component'
import Vue from 'vue'

Vue.filter('fileSize', function (value) {
  if (!value) return ''
  const parts = String(value).split('.')
  return `${parts[0]}.${parts[1].slice(0, 2)}`
})
export default {
  name: 'ManageTruckRoute',
  components: {
    FileUpload: VueUploadComponent,
    LaddaBtn,
    SingleSelectCompanyProfile,
    SingleSelectProvince,
    MultiSelectRoutePoint
    // flatPickr
  },
  data: () => ({
    listRoutes: [],
    searchText: '',
    searchPoint: [],
    provinceId: '',
    isDeleted: null,
    currentPage: 1,
    totalItems: 0,
    perPage: 10,
    statusOptions: [
      {value: 0, text: 'Đang hoạt động'},
      {value: 1, text: 'Dừng hoạt động'}
    ],
    region: null,
    type: null,
    optionRegions: [
      { value: '10', text: 'Miền Bắc' },
      { value: '20', text: 'Miền Trung' },
      { value: '30', text: 'Miền Nam' }
    ],
    optionRouteType: [
      { value: 'lien-tinh', text: 'Liên tỉnh' },
      { value: 'lien-mien', text: 'Liên miền' },
      { value: 'noi-thanh', text: 'Nội thành' },
      { value: 'noi-tinh', text: 'Nội tỉnh' }
    ]
  }),

  created () {
    this.getRentTruckRoutes()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
  },

  methods: {
    searchRoute () {
      this.currentPage = 1
      this.getRentTruckRoutes()
    },

    selectedPoint (option) {
      this.searchPoint = option
    },
    getRentTruckRoutes: function () {
      const params = {
        isDeleted: this.isDeleted,
        searchText: this.searchText,
        provinceId: this.provinceId,
        region: this.region,
        type: this.type,
        // points: this.searchPoint,
        page: this.currentPage,
        limit: this.perPage
      }
      if (Array.isArray(this.searchPoint) && this.searchPoint.length) {
        params.points = this.searchPoint.map((point) => {
          return point.id
        })
      }
      CompanyProfileService.getRentTruckRoutes(params)
        .then(res => {
          if (res.data.success) {
            this.listRoutes = res.data.data
            this.totalItems = res.data.count
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
    },

    deleteRoute (item) {
      if (!confirm(`Bạn có chắc chắn muốn xóa tuyến có mã alias  ${item.ErpRentTruckRoute.alias}`)) {
        return
      }
      let dataSend = {
        'id': item.ErpRentTruckRoute.id
      }
      CompanyProfileService.deleteRoute(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getRentTruckRoutes()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    reset: function () {
      this.searchText = ''
      this.isDeleted = null
      this.searchPoint = []
      this.provinceId = ''
      this.region = null
      this.type = null
      this.getRentTruckRoutes()
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    }
  }
}
</script>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
    .table td {
        vertical-align: middle;
    }
    .only-bottom-border{
        border-top: none;
        border-left: none;
        border-right: none;
    }
    .flex-container {
        display: flex;
        flex-wrap: nowrap;
    }

    .flex-container > div {
        margin: 0 10px;
        text-align: center;
        width: 500px;
    }
</style>
