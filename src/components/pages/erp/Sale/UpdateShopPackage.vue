<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <h4>Update shop package:</h4>
      </b-row>
      <hr>
      <b-row>
        <b-col class="mt-1 min-w-300">
          <b-form-input :type="`date`" v-model="from"></b-form-input>
        </b-col>
        <b-col class="mt-1 min-w-300">
          <b-form-input :type="`date`" v-model="to"></b-form-input>
        </b-col>
        <b-col class="mt-1 min-w-300">
          <b-form-input v-model="shopCode" placeholder="Nhập mã shop"></b-form-input>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <b-row>
          <p class="ml-2"><b>Đơn thành công đầu tiên:</b></p>
          <b-button class="ml-2 h-25" variant="success" size="sm" @click="searchLog">
            <i class="ion ion-md-search"></i> Tìm logs
          </b-button>
          </b-row>
          <ul>
            <li><b>Package order:</b> &nbsp; <span class="red">{{firstPackage.pkg_order}}</span></li>
            <li><b>Thời gian:</b> &nbsp; <span class="red">{{firstPackage.created}}</span></li>
          </ul>
        </b-col>
        <b-col>
          <p><b>Đơn thành công cuối cùng:</b></p>
          <ul>
            <li><b>Package order:</b> &nbsp; <span class="red">{{lastPackage.pkg_order}}</span></li>
            <li><b>Thời gian:</b> &nbsp; <span class="red">{{lastPackage.created}}</span></li>
          </ul>
        </b-col>
      </b-row>
      <b-row>
        <p class="ml-2"><b>Danh sách shop packages:</b></p>
        <b-button class="ml-2 h-25" size="sm" variant="danger" @click="searchShopPackage">
          <i class="ion ion-md-search"></i> Tìm shop
        </b-button>
        <b-button @click="createShopPackage" class="ml-2 h-25" variant="primary" size="sm">
          <i class="ion ion-ios-add"></i> Tao mới
        </b-button>
        <ladda-btn :loading="runShopReports.loadingButton" @click.native="runRenvenueShop" data-style="expand-right"
                   class="btn btn-success ladda-button ml-2 h-25 btn-sm" size="sm">
          Chạy doanh thu
        </ladda-btn>
      </b-row>
      <b-table
        class="card-table"
        id="shop-duplicate"
        ref="dataTable"
        :items="dataShopPackage"
        :fields="fields"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :hover="true"
        :per-page="paginConfig.per_page"
        :current-page="paginConfig.current_page"
        style="text-align:center;"
        :filter="filter"
        @filtered="onFiltered"
      >
        <template v-slot:cell(actions)="row">
          <div>
            <b-button class="mt-1" @click="updateFirstPackge(row.item)" variant="info" size="sm">Update first</b-button>
            <b-button class="mt-1" @click="updateLastPackge(row.item)" variant="info" size="sm">Update last</b-button>
            <b-button class="mt-1" @click="setActiveShopPackge(row.item)" variant="success" size="sm">Set Active</b-button>
          </div>
        </template>
      </b-table>
    </b-card-body>
  </b-card>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style lang="scss" scoped>
  .red {
    color: red;
  }

  .min-w-300 {
    min-width: 300px;
  }

  .h-25 {
    height: 25px;
  }

  .text-right {
    text-align: right;
  }
</style>

<script>
import saleService from 'domain/services/sale-service'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

export default {
  name: 'update-shop-package',

  components: {
    Moment,
    commonHelper,
    saleService,
    LaddaBtn
  },

  data: () => ({
    shopCode: '',
    filter: null,
    from: '',
    to: '',
    firstPackage: {
      pkg_order: null,
      created: null
    },
    lastPackage: {
      pkg_order: null,
      created: null
    },
    dataShopPackage: [],
    fields: [
      { key: 's_code', label: 'Mã shop', sortable: true },
      { key: 'f_pkg_time_ss', label: 'Ngày lấy đơn thành công đâu tiên', sortable: true },
      { key: 'f_pkg_order_ss', label: 'Đơn lấy thành công đầu tiên', sortable: true },
      { key: 'l_pkg_time', label: 'Ngày lấy đơn thành công cuối cùng', sortable: true },
      { key: 'l_pkg_order', label: 'Đơn lấy thành công cuối cùng', sortable: true },
      { key: 'is_active', label: 'Active', sortable: true },
      { key: 'actions', label: 'Chỉnh sửa', sortable: true }
    ],
    paginConfig: {
      per_page: 10,
      current_page: 1,
      total_row: 0
    },
    runShopReports: {
      loadingButton: false
    }
  }),

  watch: {},

  methods: {
    searchShopPackage: function () {
      this.dataShopPackage = []
      this.shopCode = this.shopCode.replace(/\s+/g, '')
      if (this.shopCode === '') {
        commonHelper.showMessage('Vui lòng nhập shop code!', 'warning')
        return
      }
      let dataSend = {
        shop_code: this.shopCode
      }
      saleService
        .getShopPackage(dataSend)
        .then(res => {
          if (res.data.success) {
            this.dataShopPackage = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    runRenvenueShop () {
      this.runShopReports.loadingButton = true
      if (this.from === '') {
        commonHelper.showMessage('Vui lòng nhập thời gian!', 'warning')
        this.runShopReports.loadingButton = false
        return
      }
      let dataSend = {
        'month': Moment(this.from).format('MM'),
        'year': Moment(this.from).format('YYYY'),
        'scode': this.shopCode
      }
      saleService
        .runRenvenueSaleShop(dataSend)
        .then(res => {
          this.runShopReports.loadingButton = false
          if (res.data.success) {
            this.dataShopPackage = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchLog: function () {
      this.firstPackage = {
        pkg_order: null,
        created: null
      }
      this.lastPackage = {
        pkg_order: null,
        created: null
      }
      this.shopCode = this.shopCode.replace(/\s+/g, '')
      if (this.shopCode === '' || this.from === '' || this.to === '') {
        commonHelper.showMessage('Vui lòng nhập shop code, thời gian!', 'warning')
        return
      }
      let dataSend = {
        shop_code: this.shopCode,
        from: this.from,
        to: this.to,
        type: 'ASC'
      }
      // get first package success
      saleService
        .getPackageSuccess(dataSend)
        .then(res => {
          if (res.data.success) {
            this.firstPackage = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
      // get last package success
      let dataSend2 = {
        shop_code: this.shopCode,
        from: this.from,
        to: this.to,
        type: 'DESC'
      }
      saleService
        .getPackageSuccess(dataSend2)
        .then(res => {
          if (res.data.success) {
            this.lastPackage = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    updateFirstPackge: function (data) {
      if (this.firstPackage.pkg_order === null || this.firstPackage.created === null) {
        commonHelper.showMessage('Chưa có thông tin đơn lấy thành công đầu tiên', 'warning')
        return
      }
      let dataSend = {
        id: data.id,
        order: this.firstPackage.pkg_order,
        time: this.firstPackage.created,
        type: 1 // first package success
      }
      saleService
        .upadteFirstLastPackage(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.searchShopPackage()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    updateLastPackge: function (data) {
      if (this.lastPackage.pkg_order === null || this.lastPackage.created === null) {
        commonHelper.showMessage('Chưa có thông tin đơn lấy thành công cuối cùng', 'warning')
        return
      }
      let dataSend = {
        id: data.id,
        order: this.lastPackage.pkg_order,
        time: this.lastPackage.created,
        type: 2 // last package success
      }
      saleService
        .upadteFirstLastPackage(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.searchShopPackage()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    createShopPackage: function () {
      this.shopCode = this.shopCode.replace(/\s+/g, '')
      if (this.shopCode === '') {
        commonHelper.showMessage('Vui lòng nhập shop code!', 'warning')
        return
      }
      let dataSend = {
        shop_code: this.shopCode
      }
      saleService
        .createShopPackage(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.searchShopPackage()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    setActiveShopPackge: function (data) {
      let dataSend = {
        id: data.id,
        scode: data.s_code
      }
      saleService
        .setActiceShopPackage(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.searchShopPackage()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    onFiltered: function (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    }
  }
}
</script>
