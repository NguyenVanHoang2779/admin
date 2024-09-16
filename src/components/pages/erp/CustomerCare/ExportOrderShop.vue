<template>
    <div>
        <b-card no-body>
            <b-card-body>
                <b-row>
                    <h4 class="ml-2 mt-1">Xuất dữ liệu Shop B2C:</h4>
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
                    <b-form-group label="Chọn User" class="col-sm-3">
                        <multiselect class="multiselect-success"
                                     v-model="users"
                                     :options="optionUsers"
                                     placeholder=" Chọn User"
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
                    <b-form-group class="col-sm-12 text-right">
                        <b-button variant="primary" class="mt-1 w-123" @click="getDataShopDetail()"><i class="ion ion-ios-search"></i> Tìm kiếm</b-button>
                        <b-button variant="success" class="mt-1 w-123" @click="exportDataToExcel()"><i class="ion ion-md-cloud-download"></i> Xuất Excel</b-button>
                    </b-form-group>
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
                            <li>Doanh thu Xfast:&nbsp; <span v-numeral v-text="Math.floor(revenueXF)"></span></li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Tổng đơn Bigsize: &nbsp; {{orderBBS}}</li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Doanh thu Bigsize: &nbsp; <span v-numeral v-text="Math.floor(revenueBBS)"></span></li>
                        </ul>
                    </b-col>
                </b-row>
                <b-row class="mt-1">
                    <b-col>
                        <ul>
                            <li>Tổng đơn FF: &nbsp; {{orderFF}}</li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Doanh thu FF: &nbsp; <span v-numeral v-text="Math.floor(revenueFF)"></span></li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Tổng đơn Express: &nbsp; {{orderEX}}</li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Doanh thu Express: &nbsp; <span v-numeral v-text="Math.floor(revenueEX)"></span></li>
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
                    <template v-slot:cell(detail)="data">
                        <p v-for="(item_order, key) in data.item.detail">
                            {{key}}: {{item_order.count}}</p>
                    </template>
                </b-table>
                <hr>
                <b-pagination
                        v-model="paginConfig.current_page"
                        :total-rows="totalAllShop"
                        :per-page="paginConfig.per_page"
                        aria-controls="my-table"
                ></b-pagination>
            </b-card-body>
        </b-card>
        <b-card>
            <BlockUI message="" :html="blockUI.html" v-if="loadingUI"/>
        </b-card>
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import CustomerCareService from 'domain/services/customer-care-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import BlockUI from 'vue-blockui'
Vue.use(BlockUI)
export default {
  name: 'show-shop-b2c',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    Datepicker
  },

  data: () => ({
    totalXfast: 0,
    totalRevenueXfast: 0,
    totalBigsize: 0,
    totalRevenueBigsize: 0,
    totalFf: 0,
    totalRevenueFf: 0,
    totalEx: 0,
    totalRevenueEx: 0,
    totalShop: 0,
    totalPackages: 0,
    totalRevenue: 0,
    optionUsers: [],
    dataShopDetail: [],
    users: [],
    paginConfig: {
      per_page: 10,
      current_page: 1,
      total_row: 0
    },
    idFile: null,
    from: new Date(),
    to: new Date(),
    filter: null,
    fields: [
      { key: 'shop_code', label: 'Mã shop', sortable: true },
      { key: 'shop_name', label: 'Tên shop', sortable: true },
      { key: 'username', label: 'Member', sortable: true },
      { key: 'shop_created', label: 'Thời gian tạo', sortable: true },
      { key: 'shop_order_first', label: 'Thời gian lấy thành công', sortable: true },
      { key: 'count_pkgs', label: 'Tổng đơn hàng', sortable: true },
      { key: 'revenue', label: 'Tổng doanh số', sortable: true },
      { key: 'detail', label: 'Chi tiết đơn', sortable: true }
    ],
    regions: [
      {id: 'HN', name: 'Hà Nội'},
      {id: 'HCM', name: 'Hồ Chí Minh'},
      {id: 'MB', name: 'Miền Bắc'},
      {id: 'MT', name: 'Miền Trung'},
      {id: 'MN', name: 'Miền Nam'}
    ],
    region: [],
    blockUI: {
      loading: false,
      html: `<div class="loading-container__wrapper-loader"><div class="loading-container__loader">Loading...</div><h5>Đang xử lý dữ liệu</h5></div>`
    },
    checkRun: ''
  }),

  created () {
    this.getCustomterCares()
  },
  mounted () {},
  computed: {
    loadingUI () {
      return this.blockUI.loading
    },
    totalAllShop () {
      return this.dataShopDetail.length
    },
    totalOrderPackages () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += item.count_pkgs
      })
      return totalOrder
    },
    orderXF () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += item.detail.XF.count
      })
      return totalOrder
    },
    orderEX () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += item.detail.EXPRESS.count
      })
      return totalOrder
    },
    orderFF () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += item.detail.FF.count
      })
      return totalOrder
    },
    orderBBS () {
      let totalOrder = 0
      this.dataShopDetail.forEach(item => {
        totalOrder += item.detail.BBS.count
      })
      return totalOrder
    },
    revenueXF () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += item.detail.XF.revenue
      })
      return totalRevenue
    },
    revenueFF () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += item.detail.FF.revenue
      })
      return totalRevenue
    },
    revenueBBS () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += item.detail.BBS.revenue
      })
      return totalRevenue
    },
    revenueEX () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += item.detail.EXPRESS.revenue
      })
      return totalRevenue
    },
    totalOrderRevenue () {
      let totalRevenue = 0
      this.dataShopDetail.forEach(item => {
        totalRevenue += item.revenue
      })
      return totalRevenue
    },
    regionChange () {
      return this.region
    }
  },
  watch: {
    regionChange () {
      this.getCustomterCares()
    }

  },
  methods: {
    onFiltered (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    },
    getCustomterCares: function () {
      console.log(this.region)
      let params = {
        region: this.region.id
      }
      CustomerCareService.getAllCustomerCaresB2c(params).then(res => {
        if (res.data.success) {
          this.optionUsers = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    customRecord: function ({ErpUser, ErpStation, ErpAddress}) {
      return `${ErpUser.username} - ${ErpStation.name} - ${ErpAddress.name}`
    },
    getDataShopDetail () {
      this.dataShopDetail = []
      let userId = []
      if (this.users.length !== 0) {
        this.users.forEach(item => {
          userId.push(item.ErpUser.id)
        })
      } else {
        this.optionUsers.forEach(item => {
          userId.push(item.ErpUser.id)
        })
      }
      if (Moment(this.from).format('YYYY-MM-DD') > Moment(this.to).format('YYYY-MM-DD')) {
        return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      userId.forEach(item => {
        let parmas = {
          user_id: item,
          from: Moment(this.from).format('YYYY-MM-DD'),
          to: Moment(this.to).format('YYYY-MM-DD')
        }
        CustomerCareService.getDataRevenueShop(parmas).then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            if (res.data.data.length > 0) {
              this.dataShopDetail = this.dataShopDetail.concat(res.data.data)
            }
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).catch(error => {
          commonHelper.showMessage(error, 'warning')
        })
      })
    },
    exportDataToExcel () {
      let parmas = {
        dataExport: this.dataShopDetail
      }
      CustomerCareService.exportDataRevenueShop(parmas).then(res => {
        if (res.data.success) {
          location.href = res.data.data.url_file
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        commonHelper.showMessage(error, 'warning')
      })
    },
    checkProcess () {
      let params = {
        idFile: this.idFile
      }
      CustomerCareService.checkRunExcel(params).then(response => {
        if (response.data.success) {
          clearInterval(this.checkRun)
          this.blockUI.loading = false
          if (confirm('Xuất file thành công. Nhấn Ok để tải xuống')) {
            location.href = response.data.data.url_file
          }
        }
      }).catch(() => {
        this.blockUI.loading = false
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    }
  }
}
</script>
