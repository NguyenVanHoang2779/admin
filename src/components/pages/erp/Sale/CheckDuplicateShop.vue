<template>
  <b-card no-body>
    <b-card-body>
      <h3>Kiểm tra shop trùng:</h3>
      <hr>
      <div class="dis-content">
        <b-row class="w-200px mt-2 mr-1 ml-1">
          <multiselect v-model="provinceModel"
                       :options="optionProvinces"
                       placeholder="Chọn tỉnh"
                       :searchable="true"
                       track-by="ErpAddress"
                       label="ErpAddress"
                       :show-labels="false"
                       :custom-label="customRecordProvince">
            <span slot="noResult">Rất tiếc, không tìm thấy!</span>
          </multiselect>
        </b-row>
        <b-row class="w-300 mt-2 mr-1 ml-1">
          <b-form-input v-model="shopAddress" placeholder="Nhập địa chỉ" :disabled="isDisableAll"></b-form-input>
        </b-row>
        <b-row class="w-300 mt-2 mr-1 ml-1">
          <b-form-input v-model="shopCode" placeholder="Nhập mã shop" :disabled="isDisableShop"></b-form-input>
        </b-row>
        <b-row class="w-300 mt-2 mr-1 ml-1">
          <b-form-input v-model="phoneNumber" placeholder="Nhập số điện thoại" :disabled="isDisable"></b-form-input>
        </b-row>
        <b-row class="w-300 mt-2 mr-1 ml-1">
          <b-form-input v-model="emailShop" placeholder="Nhập email" :disabled="isDisable"></b-form-input>
        </b-row>
        <b-row class="w-200px mt-2 mr-1 ml-1">
          <b-form-input v-model="bankNumber" placeholder="Nhập số tài khoản ngân hàng" :disabled="isDisable"></b-form-input>
        </b-row>
        <b-row class="mt-3 mr-1 ml-1 dis-inline">
          <b-button variant="success mr-1" class="w-button" @click="search"><i class="ion ion-md-search"></i> Tìm kiếm <i class="fa fa-spin fa-spinner" v-if="isBusy"></i></b-button>
          <b-button variant="danger ml-1" class="w-button" @click="clearSearch"><i class="ion ion-ios-close-circle-outline"></i> Xóa</b-button>
          <ladda-btn :loading="loadingButton" @click.native="runDailyPkg" data-style="expand-right"
                     class="btn btn-warning ladda-button ml-1">
            <i class="ion ion-md-settings"></i>
            Chạy sản lượng
          </ladda-btn>
        </b-row>
      </div><br>
      <hr><br>
      <b-table
        class="card-table"
        id="shop-duplicate"
        ref="dataTable"
        :items="dataShops"
        :fields="fields"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :hover="true"
        style="text-align:center;"
        :filter="filter"
        v-if="dataShops != null"
      >
        <template v-slot:cell(detail_f_pkg_ss)="row">
          <p v-if="row.item.detail_order.EXPRESS.first_pick !== null"><span>EXPRESS:</span> {{row.item.detail_order.EXPRESS.first_pick}}</p>
          <p v-if="row.item.detail_order.BIGSIZE.first_pick !== null"><span>BIGSIZE:</span> {{row.item.detail_order.BIGSIZE.first_pick}}</p>
        </template>
        <template v-slot:cell(detail_l_pkg_ss)="row">
          <p v-if="row.item.detail_order.EXPRESS.last_pick !== null"><span>EXPRESS:</span> {{row.item.detail_order.EXPRESS.last_pick}}</p>
          <p v-if="row.item.detail_order.BIGSIZE.last_pick !== null"><span>BIGSIZE:</span> {{row.item.detail_order.BIGSIZE.last_pick}}</p>
        </template>
      </b-table>
      <b-table
        class="card-table"
        id="shop-duplicate"
        ref="dataTable"
        :items="dataSearchByAddress"
        :fields="fieldsSearchByAddress"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :hover="true"
        style="text-align:center;"
        :filter="filter"
        v-if="dataSearchByAddress != null"
      >
        <template v-slot:cell(address)="row">
          {{`${row.item.first_address} ${row.item.last_address}`}}
        </template>
      </b-table>
      <div v-if="isBusy" class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
    </b-card-body>
  </b-card>
</template>

<style scoped>
  .dis-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-grow: 1;
  }

  .w-300 {
    width: 300px;
  }

  .w-button {
    width: 112px;
  }

  .dis-inline {
    display: flex;
    flex-direction: row;
  }
  .bold {
    font-weight: bold;
  }
</style>

<script>
import saleService from 'domain/services/sale-service'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Multiselect from 'vue-multiselect'

export default {
  name: 'check-duplicate-shop',

  components: {
    Moment,
    commonHelper,
    saleService,
    LaddaBtn,
    Multiselect
  },

  data: () => ({
    shopAddress: '',
    shopCode: '',
    phoneNumber: '',
    bankNumber: '',
    emailShop: '',
    isDisable: false,
    isDisableShop: false,
    isDisableAll: false,
    filter: null,
    dataShops: null,
    fields: [
      { key: 'code', label: 'Mã shop', sortable: true },
      { key: 'name', label: 'Tên shop', sortable: true },
      { key: 'created', label: 'Ngày tạo', sortable: true },
      { key: 'username', label: 'Tài khoản quản lý', sortable: true },
      { key: 'fullname', label: 'Họ tên người quản lý', sortable: true },
      { key: 'type', label: 'Loại quản lý', sortable: true },
      { key: 'tel', label: 'Số điện thoại', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'against_bank_account', label: 'Tài khoản NH', sortable: true },
      { key: 'time_assign_latest', label: 'Thời gian chuyển care gần nhất', sortable: true },
      { key: 'f_pkg_time_ss', label: 'Ngày lấy đơn thành công đâu tiên', sortable: true },
      { key: 'l_pkg_time', label: 'Ngày lấy đơn thành công cuối cùng', sortable: true },
      { key: 'detail_f_pkg_ss', label: 'Chi tiết đơn lấy thành công đầu tiên', sortable: true },
      { key: 'detail_l_pkg_ss', label: 'Chi tiết đơn lấy thành công cuối cùng', sortable: true },
      { key: 'pkg_2_month_ago', label: 'Sản lượng 3 tháng gần nhất(1)', sortable: true },
      { key: 'pkg_last_month', label: 'Sản lượng 3 tháng gần nhất(2)', sortable: true },
      { key: 'pkg_cur_month', label: 'Sản lượng 3 tháng gần nhất(3)', sortable: true }
    ],
    isBusy: false,
    dataSearchByAddress: null,
    fieldsSearchByAddress: [
      { key: 'code', label: 'Mã shop', sortable: true },
      { key: 'fullname', label: 'Tên shop', sortable: true },
      { key: 'address', label: 'Địa chỉ', sortable: true },
      { key: 'district', label: 'Huyện', sortable: true },
      { key: 'tel', label: 'Số điện thoại', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'lat', label: 'Latitude', sortable: true },
      { key: 'lng', label: 'Longitude', sortable: true },
      { key: 'created_username', label: 'Tạo bởi', sortable: true },
      { key: 'modified_username', label: 'Chỉ sửa lần cuối bởi', sortable: true },
      { key: 'created', label: 'Ngày tạo', sortable: true }
    ],
    loadingButton: false,
    provinceModel: '',
    optionProvinces: []
  }),

  watch: {
    shopCode: function (newVal, oldVal) {
      if (newVal === '') this.isDisable = false
      else {
        this.isDisable = true
        this.isDisableAll = true
        this.phoneNumber = ''
        this.bankNumber = ''
        this.emailShop = ''
        this.shopAddress = ''
      }
    },

    shopAddress: function (newVal, oldVal) {
      if (newVal === '') {
        this.isDisable = false
        this.isDisableShop = false
      } else {
        this.isDisable = true
        this.isDisableShop = true
        this.phoneNumber = ''
        this.bankNumber = ''
        this.emailShop = ''
        this.shopCode = ''
      }
    },

    phoneNumber: function (newVal, oldVal) {
      if (newVal === '' && this.emailShop === '' && this.bankNumber === '') {
        this.isDisableShop = false
        this.isDisableAll = false
      } else {
        this.isDisableShop = true
        this.isDisableAll = true
        this.shopCode = ''
        this.shopAddress = ''
      }
    },

    emailShop: function (newVal, oldVal) {
      if (newVal === '' && this.phoneNumber === '' && this.bankNumber === '') {
        this.isDisableShop = false
        this.isDisableAll = false
      } else {
        this.isDisableShop = true
        this.isDisableAll = true
        this.shopCode = ''
        this.shopAddress = ''
      }
    },

    bankNumber: function (newVal, oldVal) {
      if (newVal === '' && this.emailShop === '' && this.phoneNumber === '') {
        this.isDisableShop = false
        this.isDisableAll = false
      } else {
        this.isDisableShop = true
        this.isDisableAll = true
        this.shopCode = ''
        this.shopAddress = ''
      }
    }
  },

  created () {
    this.getListProvince()
  },

  methods: {
    clearSearch: function () {
      this.phoneNumber = ''
      this.bankNumber = ''
      this.emailShop = ''
      this.shopCode = ''
      this.shopAddress = ''
    },

    searchByAddress: function () {
      let dataSend = {
        address: this.shopAddress,
        district: this.shopAddress,
        province_id: this.provinceModel.ErpAddress.id
      }
      this.dataSearchByAddress = null
      saleService.getListShopByAddress(dataSend).then(res => {
        if (res.data.success) {
          this.dataSearchByAddress = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        }
        this.dataSearchByAddress = null
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau', 'warning')
      }).finally(() => {
        this.isBusy = false
      })
    },

    search: function () {
      this.dataShops = null
      this.isBusy = true

      if (this.shopAddress !== '') return this.searchByAddress()

      if (this.provinceModel === '') {
        this.isBusy = false
        return commonHelper.showMessage('Vui lòng chọn tỉnh!', 'warning')
      }

      if (this.shopCode === '' && this.phoneNumber === '' && this.emailShop === '' && this.bankNumber === '') {
        this.isBusy = false
        return commonHelper.showMessage('Vui lòng nhập shop code, số điện thoại, email hoặc tài khoản ngân hàng hoặc địa chỉ!', 'warning')
      }

      let data = {}
      if (this.shopCode !== '') data.shop_code = this.shopCode.replace(/\s+/g, '')

      if (this.phoneNumber !== '') {
        if (!this.validatePhone(this.phoneNumber)) return commonHelper.showMessage('Số điện thoại không hợp lệ!', 'warning')
        data.phone = this.phoneNumber.replace(/([+]|[.]|\s+)/g, '')
      }

      if (this.emailShop !== '') {
        if (!this.validateEmail(this.emailShop)) return commonHelper.showMessage('Email không hợp lệ!', 'warning')
        data.email = this.emailShop.replace(/\s+/g, '')
      }

      if (this.bankNumber !== '') {
        if (!this.validateBank(this.bankNumber)) return commonHelper.showMessage('Số tài khoản ngân hàng không hợp lệ!', 'warning')
        data.bank = this.bankNumber.replace(/\s+/g, '')
      }

      saleService.checkDuplicateShop(data).then(res => {
        if (res.data.success) {
          this.dataShops = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message, 'warning')
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra')
      }).finally(() => {
        this.isBusy = false
      })
    },

    validateEmail: function (email) {
      var format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
      if (format.test(email)) return true
      return false
    },

    validateBank: function (data) {
      var format = /[0-9]+/
      if (format.test(data.replace(/\s+/g, ''))) return true
      return false
    },

    validatePhone: function (phone) {
      var format = /d/
      if (format.test(phone.replace(/([+]|[.]|\s+)/g, ''))) return false
      return true
    },

    runDailyPkg: function () {
      if (this.shopCode === '') {
        alert('Thiếu mã shop')
        return
      }
      this.loadingButton = true
      let dataSend = {
        'shop_code': this.shopCode.replace(/\s+/g, '')
      }
      console.log(dataSend)
      saleService.runDailyPkg(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.loadingButton = false
      })
    },
    customRecordProvince: function ({ErpAddress}) {
      return `${ErpAddress.name}`
    },
    getListProvince: function () {
      saleService.getLstProvinces().then(res => {
        if (res.data.success) {
          this.optionProvinces = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
