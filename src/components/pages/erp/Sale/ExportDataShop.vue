<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row>
          <h4 class="ml-2 mt-1">Xuất dữ liệu Shop: &nbsp;</h4>
        </b-row>
        <hr>
        <div class="row">
          <b-form-group label="Chọn miền" class="col-sm-3">
            <multiselect class="multiselect-success"
              v-model="region"
              :options="regions"
              placeholder=" Chọn miền"
              selectedLabel="Đã chọn"
              deselectLabel="Bỏ chọn"
              selectLabel="Chọn"
              track-by="name"
              label="name"
              :searchable="true"
              :multiple="false"
              :hide-selected="true"
              :allow-empty="false"
              :clearOption="true"
            >
              <span slot="noResult">Rất tiếc, không tìm thấy!</span>
            </multiselect>
          </b-form-group>
          <b-form-group label="Ngày bắt đầu" class="col-sm-3">
            <datepicker
                    v-model="from"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    placeholder=" Ngày bắt đầu"
            />
          </b-form-group>
          <b-form-group label="Ngày kết thúc" class="col-sm-3">
            <datepicker
                    v-model="to"
                    format="dd-MM-yyyy"
                    :bootstrapStyling="true"
                    :monday-first="true"
                    :full-month-name="true"
                    :calendar-button="true"
                    calendar-button-icon="ion ion-md-calendar"
                    :clear-button="true"
                    placeholder=" Ngày kết thúc"
            />
          </b-form-group>
          <b-form-group label="Chọn Sale" class="col-sm-3">
              <multiselect class="multiselect-success"
                           v-model="sales"
                           :options="users"
                           placeholder=" Chọn sale"
                           selectedLabel="Đã chọn"
                           deselectLabel="Bỏ chọn"
                           selectLabel="Chọn"
                           track-by="ErpUser"
                           label="ErpUser"
                           :searchable="true"
                           :multiple="true"
                           :hide-selected="true"
                           :allow-empty="true"
                           :clearOption="true"
                           :custom-label="customRecord"
              >
                <span slot="noResult">Rất tiếc, không tìm thấy!</span>
              </multiselect>
            </b-form-group>
        </div>
        <div class="text-right">
          <ladda-btn
            :loading="loadingSearch"
            @click.native="getDataShopDetail"
            data-style="expand-right"
            class="btn btn-primary mt-1"
          >
            Tìm kiếm
          </ladda-btn>

          <b-button variant="success" class="mt-1 w-123" @click="exportDataToExcel()"><i class="ion ion-md-cloud-download"></i> Xuất Excel</b-button>
          <b-button variant="danger"  class="mt-1 w-123" @click="clear(true)"><i class="ion ion-md-trash"></i> Xóa</b-button>
        </div>
        <hr>
        <h5 class="mt-2">Tổng quan shop: &nbsp;</h5>
        <b-row class="mt-1">
          <b-col>
            <ul>
              <li>Tổng đơn Xfast:&nbsp; {{orderXF}}</li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Tổng đơn FF: &nbsp; {{orderFF}}</li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Tổng đơn Bigsize: &nbsp; {{orderBBS}}</li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Tổng đơn Express: &nbsp; {{orderEX}}</li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Tổng đơn Nông thôn: &nbsp; {{orderNt}}</li>
            </ul>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col>
            <ul>
              <li>Doanh thu Xfast:&nbsp; <span v-numeral v-text="Math.floor(revenueXF)"></span></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Doanh thu FF: &nbsp; <span v-numeral v-text="Math.floor(revenueFF)"></span></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Doanh thu Bigsize: &nbsp; <span v-numeral v-text="Math.floor(revenueBBS)"></span></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Doanh thu Express: &nbsp; <span v-numeral v-text="Math.floor(revenueEX)"></span></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li>Doanh thu Nông thôn: &nbsp; <span v-numeral v-text="Math.floor(revenueNt)"></span></li>
            </ul>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col>
            <ul>
              <li><b>Tổng số shop: &nbsp; {{totalAllShop}}</b></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li><b>Tổng số đơn: &nbsp; {{totalOrderPackages}}</b></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li><b>Tổng doanh số: &nbsp; <span v-numeral v-text="Math.floor(totalOrderRevenue)"></span></b></li>
            </ul>
          </b-col>
          <b-col>
            <b-form-input class="text-right" size="sm" v-model="filter" placeholder="Tìm kiếm ..."></b-form-input>
          </b-col>
        </b-row>
        <b-table
          id="data-shop"
          ref="dataTable"
          :items="dataShopDetail"
          :fields="fields"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          :per-page="paginConfig.per_page"
          :current-page="paginConfig.current_page"
          style="text-align: center;"
          class="card-table"
          responsive
          :filter="filter"
          @filtered='onFiltered'>
          <template v-slot:cell(detail_order_1)="data">
                            <p v-for="(item_order, key) in data.item.data_order_1">
                              {{key}}: {{item_order.count}}</p>
          </template>
          <template v-slot:cell(detail_order_2)="data">
            <p v-for="(item_order, key) in data.item.data_order_2">
              {{key}}: {{item_order.count}}</p>
          </template>
          <template v-slot:cell(detail_order_3)="data">
            <p v-for="(item_order, key) in data.item.data_order_3">
              {{key}}: {{item_order.count}}</p>
          </template>
        </b-table>
        <b-pagination v-if="totalAllShop > 0"
          class="mt-2"
          v-model="paginConfig.current_page"
          :total-rows="totalAllShop"
          :per-page="paginConfig.per_page"
          align="center"
          size="sm"
        ></b-pagination>

        <!--<b-pagination-->
                <!--v-model="paginConfig.current_page"-->
                <!--:total-rows="totalAllShop"-->
                <!--:per-page="paginConfig.per_page"-->
                <!--aria-controls="my-table"-->
        <!--&gt;</b-pagination>-->
      </b-card-body>
    </b-card>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
  .monthly-picker >>> .input {
    max-width: 85px !important;
    font-weight: bold;
    color: red;
  }
  .w-123 {
    width: 123px;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import saleService from 'domain/services/sale-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

export default {
  name: 'show-sale-salary',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    Datepicker,
    LaddaBtn
  },

  data: () => ({
    sales: [],
    users: [],
    rangeTime: null,
    loadingSearch: false,
    config: {
      mode: 'range',
      altInput: true,
      altFormat: 'Y-m-d',
      dateFormat: 'Y-m-d',
      theme: 'light'
    },
    paginConfig: {
      per_page: 10,
      current_page: 1,
      total_row: 0
    },
    filter: null,
    totalShop: 0,
    totalPackages: 0,
    totalRevenue: 0,
    dataShopDetail: [],
    fields: [
      { key: 'province_name', label: 'Tỉnh', sortable: true },
      { key: 'shop_code', label: 'Mã shop', sortable: true },
      { key: 'shop_name', label: 'Tên shop', sortable: true },
      { key: 'sale', label: 'Sale', sortable: true },
      { key: 'shop_created', label: 'Thời gian tạo', sortable: true },
      { key: 'first_time_success', label: 'Thời gian lấy thành công', sortable: true },
      { key: 'first_time_success_group', label: 'Thời gian lấy thành công theo nhóm', sortable: true },
      { key: 'pkgs_1', label: 'Số đơn hàng thành T1', sortable: true },
      { key: 'revenue_1', label: 'Doanh số tháng 1', sortable: true },
      { key: 'pkgs_2', label: 'Số đơn hàng thành T2', sortable: true },
      { key: 'revenue_2', label: 'Doanh số tháng 2', sortable: true },
      { key: 'pkgs_3', label: 'Số đơn hàng thành T3', sortable: true },
      { key: 'revenue_3', label: 'Doanh số tháng 3', sortable: true },
      { key: 'revenue', label: 'Tổng doanh số', sortable: true },
      { key: 'detail_order_1', label: 'Chi tiết đơn tháng 1', sortable: true },
      { key: 'detail_order_2', label: 'Chi tiết đơn tháng 2', sortable: true },
      { key: 'detail_order_3', label: 'Chi tiết đơn tháng 3', sortable: true }
    ],
    region: {
      id: 'all',
      name: 'Cả nước'
    },
    regions: [
      {
        id: 'all',
        name: 'Cả nước'
      },
      {
        id: 'HN',
        name: 'TP Hà Nội'
      },
      {
        id: 'MB',
        name: 'Miền Bắc'
      },
      {
        id: 'MT',
        name: 'Miền Trung'
      },
      {
        id: 'MN',
        name: 'Miền Nam'
      },
      {
        id: 'HCM',
        name: 'TP HCM'
      }
    ],
    from: new Date(),
    to: new Date(),
    totalXfast: 0,
    totalBigsize: 0,
    totalFf: 0,
    totalEx: 0,
    totalExpress: 0,
    totalRevenueXfast: 0,
    totalRevenueBigsize: 0,
    totalRevenueFf: 0,
    totalRevenueEx: 0,
    totalRevenueExpress: 0
  }),

  created () {
    this.getAllSales('')
  },

  mounted () {},

  watch: {
    region: function (newVal, oldVal) {
      if (newVal.id === 'all') {
        this.getAllSales('')
      } else {
        this.getAllSales(newVal.id)
      }
      this.sales = []
      this.dataShopDetail = []
    }
  },

  computed: {
    totalAllShop () {
      return this.dataShopDetail.length
    },
    totalOrderPackages () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += (item.pkgs_1 + item.pkgs_2 + item.pkgs_3)
      })
      return totalOrder
    },
    totalOrderRevenue () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += (item.revenue_1 + item.revenue_2 + item.revenue_3)
      })
      return totalRevenue
    },
    orderXF () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += (item.data_order_1.XF.count + item.data_order_2.XF.count + item.data_order_3.XF.count)
      })
      return totalOrder
    },
    orderEX () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += (item.data_order_1.EXPRESS.count + item.data_order_2.EXPRESS.count + item.data_order_3.EXPRESS.count)
      })
      return totalOrder
    },
    orderFF () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += (item.data_order_1.FF.count + item.data_order_2.FF.count + item.data_order_3.FF.count)
      })
      return totalOrder
    },
    orderBBS () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += (item.data_order_1.BIGSIZE.count + item.data_order_2.BIGSIZE.count + item.data_order_3.BIGSIZE.count)
      })
      return totalOrder
    },
    revenueXF () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += (item.data_order_1.XF.revenue + item.data_order_2.XF.revenue + item.data_order_3.XF.revenue)
      })
      return totalRevenue
    },
    revenueFF () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += (item.data_order_1.FF.revenue + item.data_order_2.FF.revenue + item.data_order_3.FF.revenue)
      })
      return totalRevenue
    },
    revenueBBS () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += (item.data_order_1.BIGSIZE.revenue + item.data_order_2.BIGSIZE.revenue + item.data_order_3.BIGSIZE.revenue)
      })
      return totalRevenue
    },
    revenueEX () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += (item.data_order_1.EXPRESS.revenue + item.data_order_2.EXPRESS.revenue + item.data_order_3.EXPRESS.revenue)
      })
      return totalRevenue
    },
    orderNt () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += (item.data_order_1.NT.count + item.data_order_2.NT.count + item.data_order_3.NT.count)
      })
      return totalOrder
    },
    revenueNt () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += (item.data_order_1.NT.revenue + item.data_order_2.NT.revenue + item.data_order_3.NT.revenue)
      })
      return totalRevenue
    }
  },

  methods: {
    getAllSales: function (dataSend) {
      saleService.getAllSalesForExportDataShop(dataSend).then(res => {
        if (res.data.success) {
          this.users = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    clear: function (clearSales) {
      if (clearSales) {
        this.sales = []
      }
      this.totalShop = 0
      this.totalPackages = 0
      this.totalRevenue = 0
      this.dataShopDetail = []
      this.paginConfig.total_row = 0
      this.totalXfast = 0
      this.totalBigsize = 0
      this.totalFf = 0
      this.totalExpress = 0
      this.totalRevenueXfast = 0
      this.totalRevenueBigsize = 0
      this.totalRevenueFf = 0
      this.totalEx = 0
      this.totalRevenueEx = 0
      this.totalRevenueExpress = 0
    },

    customRecord: function ({ErpUser, ErpStation, ErpAddress}) {
      return `${ErpUser.fullname} (${ErpUser.username} - ${ErpStation.name} - ${ErpAddress.name})`
    },

    getDataShopDetail () {
      this.clear(false)
      this.loadingSearch = true
      this.dataShopDetail = []
      let userId = []
      if (this.sales.length !== 0) {
        this.sales.forEach(item => {
          userId.push(item.ErpUser.id)
        })
      } else {
        this.users.forEach(item => {
          userId.push(item.ErpUser.id)
        })
      }
      if (this.from > this.to) {
        commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!', 'warning')
        return
      }
      userId.forEach(item => {
        let parmas = {
          from: Moment(this.from).format('YYYY-MM-DD'),
          to: Moment(this.to).format('YYYY-MM-DD'),
          user_id: item
        }
        saleService.getShopDetailInRangeTime(parmas).then(res => {
          if (res.data.success) {
            this.dataShopDetail = this.dataShopDetail.concat(res.data.data)
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).then(() => {
          this.loadingSearch = false
        }).catch(error => {
          console.log(error)
        })
      })
    },
    exportDataToExcel: function () {
      if (this.dataShopDetail.length < 1) {
        commonHelper.showMessage('Dữ liệu shop rỗng!', 'warning')
        return
      }
      let data = {
        data_shop: this.dataShopDetail
      }
      saleService.exportDataShopToExcel(data).then(res => {
        if (res.data.success) {
          commonHelper.showMessage(res.data.message, 'success')
          window.location.href = res.data.path
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },

    onFiltered (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    }
  }
}
</script>
