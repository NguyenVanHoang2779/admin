<template>
  <div>
    <div class="ui-block">
      <b-row>
        <b-col md="6"><h4 class="ui-block-heading">Quản lý coupon</h4></b-col>
        <b-col md="6"><div class="text-right w-100">
            <b-btn variant="outline-primary" @click="exportSalaryByCouponId()"><i class="ion ion-md-print"></i> Xuất bảng lương </b-btn>
        </div></b-col>
      </b-row>
      <hr>
      <div class="mb-3">
        <b-row>
          <b-col md="2">
            <b-input type="text" placeholder="Tên coupon" v-model="couponName"/>
          </b-col>
          <b-col md="2">
            <single-select-province @handleSelectedProvince="handleSelectedProvince"></single-select-province>
          </b-col>
          <b-col md="2">
            <single-select-station :province-id="provinceId" @handleSelectedStation="handleSelectedStation"></single-select-station>
          </b-col>
           <b-col md="2">
              <single-select-module :station-id="stationId" @handleSelectedModule="handleSelectedModule"></single-select-module>
          </b-col>
          <b-col md="2">
            <single-select-department @handleSelectedDepartment="handleSelectedDepartment"></single-select-department>
          </b-col>
          <b-col md="2">
            <single-select-position @handleSelectedPosition="handleSelectedPosition" :department-id="departmentId"></single-select-position>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2">
            <flat-pickr v-model="rawTime" :config="rangeConfig" placeholder="Chọn khoảng thời gian" class="mb-4"/>
          </b-col>
          <b-col md="10" class="text-right">
            <b-btn type="button" variant="primary" @click="currentPage = 1; search();"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
            <router-link :to="{name: 'coupon-add'}" class="btn btn-md btn-outline-info ml-1"><i class="ion ion-md-add"></i> Thêm coupon</router-link>
          </b-col>
        </b-row>
      </div>
      <div class="mb-3">
        <div>
          <b-card no-body>
            <table class="table mb-0 table-hover table-bordered">
              <thead>
              <tr>
                <th>STT</th>
                <th>Tên coupon</th>
                <th>Tỉnh</th>
                <th>Kho</th>
                <th>Vị trí</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Thưởng (%)</th>
                <th>Action</th>
                <th>Xuất dữ liệu</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(coupon, index) in coupons" :key="index">
                  <td>{{(currentPage - 1) * perPage + index + 1}}</td>
                  <td>
                    {{coupon.name}}
                  </td>
                  <td>
                    <multi-select-province class="limit-width" :province-ids="coupon.province_id" :limit-prop=7 ></multi-select-province>
                  </td>
                  <td>
                    <multi-select-station class="limit-width" :province-ids="coupon.province_id" :station-ids="coupon.station_id" :limit-prop=7 ></multi-select-station>
                  </td>
                  <td>
                    <multi-select-position :department-ids="coupon.department_ids" :position-ids="coupon.position_id"></multi-select-position>
                  </td>
                  <td>{{moment(coupon.start_date).format('DD-MM-YYYY')}}</td>
                  <td>{{moment(coupon.end_date).format('DD-MM-YYYY')}}</td>
                  <td>{{coupon.bonus}}</td>
                  <td style="min-width: 120px">
                    <div class="text-center w-100">
                      <router-link :to="{name: 'coupon-edit', params: { id: coupon.id }}" class="btn btn-outline-secondary"><i class="ion ion-md-create"></i></router-link>
                      <b-btn class="btn btn-md btn-outline-danger" @click="deleteCoupon(coupon)"><i class="ion ion-md-trash"></i></b-btn>
                    </div>
                  </td>
                  <td>
                    <div class="text-center w-100"><b-btn variant="outline-primary" @click="exportSalaryByCouponId(coupon.id)"> <i class="ion ion-md-print"></i> </b-btn></div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3" v-if="totalPages > 1">
              <b-row>
                <b-col>
                  <b-pagination
                    :total-rows="totalItems"
                    v-model="currentPage"
                    :per-page="perPage"
                    v-on:input="search"
                    align="center"
                  />
                </b-col>
              </b-row>
            </div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>

<script>
import couponService from 'domain/services/coupon-service'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import flatPickr from 'vue-flatpickr-component'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'coupon-manage',
  components: {
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectPosition,
    SingleSelectDepartment,
    SingleSelectModule,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectPosition,
    flatPickr
  },

  data: () => ({
    rangeConfig: {
      mode: 'range',
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y'
    },
    provinceId: '',
    stationId: '',
    departmentId: '',
    positionId: '',
    currentPage: 1,
    totalItems: 0,
    perPage: 5,
    coupons: [],
    couponName: '',
    startDate: null,
    endDate: null,
    rawTime: null
  }),

  created () {
    this.search()
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  watch: {
    rawTime: function (newVal, oldVal) {
      if (newVal !== null) {
        let range = newVal.split('to').map(item => item.trim())
        if (range.length === 2) {
          this.startDate = moment(range[0], 'DD-MM-YYYY').format('YYYY-MM-DD')
          this.endDate = moment(range[1], 'DD-MM-YYYY').format('YYYY-MM-DD')
          return
        }
      }
      this.startDate = null
      this.endDate = null
    }
  },

  methods: {
    moment (data) {
      return moment(data)
    },

    handleSelectedModule (option) {
      this.moduleId = option ? option.id : null
    },

    search: function () {
      this.appLoading = true
      let params = {
        name: this.couponName,
        province_id: this.provinceId,
        station_id: this.stationId,
        module_id: this.moduleId,
        department: this.departmentId,
        position_id: this.positionId,
        start_date: this.startDate,
        end_date: this.endDate,
        page: this.currentPage,
        limit: this.perPage
      }
      couponService.getAll(params)
        .then(res => {
          if (res.data.success) {
            this.coupons = res.data.data
            this.totalItems = res.data.total
            if (this.totalItems === 0) {
              this.coupons = []
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.appLoading = false
        })
      this.firstTime = false
    },

    handleSelectedProvince: function (option) {
      this.provinceId = option ? option.id : ''
    },

    handleSelectedStation: function (option) {
      this.stationId = option ? option.id : ''
    },

    handleSelectedDepartment: function (option) {
      this.departmentId = option ? option.id : ''
    },

    handleSelectedPosition: function (option) {
      this.positionId = option ? option.id : ''
    },

    deleteCoupon (coupon) {
      if (!confirm(`Bạn có chắc chắn muốn xóa coupon ${coupon.name} ?`)) {
        return
      }
      this.$startLoading()
      couponService.remove({id: coupon.id})
        .then(res => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: 'Xóa coupon thành công!'
            })
            this.search()
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình xóa nhóm.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },

    exportSalaryByCouponId (couponId) {
      if (!couponId) couponId = 0
      couponService.exportSalaryByCouponId({id: couponId})
        .then(response => {
          if (response.data.success) {
            let fileUrl = response.data.data['fileUrl']
            window.location.href = fileUrl
          } else {
            commonHelper.showMessage('Có lỗi xảy ra trong quá trình xuất file', 'failed')
          }
        })
    }
  }
}
</script>
