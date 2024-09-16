<template>
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row>
          <h4 class="ml-2 mt-1">Xuất dữ liệu Shop BBS: &nbsp;</h4>
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
        <h5 class="mt-2">Tổng quan shop: </h5>
        <b-row class="mt-1">
          <b-col>
            <ul>
              <li><b>Tổng số shop: {{totalAllShop}}</b></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li><b>Tổng số đơn: {{totalOrderPackages}}</b></li>
            </ul>
          </b-col>
          <b-col>
            <ul>
              <li><b>Tổng doanh số: <span v-numeral v-text="Math.floor(totalOrderRevenue)"></span></b></li>
            </ul>
          </b-col>
          <b-col>
            <b-form-input class="text-right" size="sm" v-model="filter" placeholder="Tìm kiếm ..."></b-form-input>
          </b-col>
        </b-row>
        <b-table
          id="data-shop-bbs"
          ref="dataTable"
          :items="dataShopDetail"
          :fields="dataFields"
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
          <template v-slot:cell(T1)="data">
            <p v-for="(value, key) in data.item.T1">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(T2)="data">
            <p v-for="(value, key) in data.item.T2">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(T3)="data">
            <p v-for="(value, key) in data.item.T3">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(T4)="data">
            <p v-for="(value, key) in data.item.T4">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(T5)="data">
            <p v-for="(value, key) in data.item.T5">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(T6)="data">
            <p v-for="(value, key) in data.item.T6">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(detail_order_1)="data">
                            <p v-for="(value, key) in data.item.data_order_1">
                              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(detail_order_2)="data">
            <p v-for="(value, key) in data.item.data_order_2">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(detail_order_3)="data">
            <p v-for="(value, key) in data.item.data_order_3">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(detail_order_4)="data">
            <p v-for="(value, key) in data.item.data_order_3">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(detail_order_5)="data">
            <p v-for="(value, key) in data.item.data_order_3">
              {{key}}: {{value}}</p>
          </template>
          <template v-slot:cell(detail_order_6)="data">
            <p v-for="(value, key) in data.item.data_order_3">
              {{key}}: {{value}}</p>
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
import saleBbsService from 'domain/services/sale-bbs-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import AddressMixin from 'mixins/AddressMixin'

export default {
  name: 'export-data-shop-bbs',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    Datepicker,
    LaddaBtn
  },

  mixins: [AddressMixin],

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
    dataFields: [
      { key: 'province_name', label: 'Tỉnh', sortable: true },
      { key: 'shop_code', label: 'Mã shop', sortable: true },
      { key: 'shop_name', label: 'Tên shop', sortable: true },
      { key: 'sale', label: 'Sale', sortable: true },
      { key: 'shop_created', label: 'Thời gian tạo', sortable: true },
      { key: 'first_time_success', label: 'Thời gian lấy thành công', sortable: true },
      { key: 'first_time_success_group', label: 'Thời gian lấy thành công theo nhóm', sortable: true },
      { key: 'T1', label: 'Tháng 1', sortable: true },
      { key: 'T2', label: 'Tháng 2', sortable: true },
      { key: 'T3', label: 'Tháng 3', sortable: true },
      { key: 'T4', label: 'Tháng 4', sortable: true },
      { key: 'T5', label: 'Tháng 5', sortable: true },
      { key: 'T6', label: 'Tháng 6', sortable: true },
      { key: 'detail_order_1', label: 'Chi tiết đơn tháng 1', sortable: true },
      { key: 'detail_order_2', label: 'Chi tiết đơn tháng 2', sortable: true },
      { key: 'detail_order_3', label: 'Chi tiết đơn tháng 3', sortable: true },
      { key: 'detail_order_4', label: 'Chi tiết đơn tháng 4', sortable: true },
      { key: 'detail_order_5', label: 'Chi tiết đơn tháng 5', sortable: true },
      { key: 'detail_order_6', label: 'Chi tiết đơn tháng 6', sortable: true }
    ],
    region: {
      id: 'all',
      name: 'Cả nước'
    },
    regions: [],
    from: new Date(),
    to: new Date()
  }),

  created () {
    this.regions = this.getRegions()
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
        for (let i = 1; i <= 6; i++) {
          totalOrder += item[`T${i}`].pkg
        }
      })
      return totalOrder
    },
    totalOrderRevenue () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        for (let i = 1; i <= 6; i++) {
          totalRevenue += item[`T${i}`].revenue
        }
      })
      return totalRevenue
    }
  },

  methods: {
    getAllSales: function (dataSend) {
      saleBbsService.getAllSalesBbsForExportDataShop(dataSend).then(res => {
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
        saleBbsService.getShopBbsDetailInRangeTime(parmas).then(res => {
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
      saleBbsService.exportDataShopBbsToExcel(data).then(res => {
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
