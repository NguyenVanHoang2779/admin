<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <h4 class="ml-2 mt-1">Hỗ trợ lương sale: &nbsp;</h4>
      </b-row>
      <hr>
      <b-row>
        <b-col cols="3">
            <b-form-group label="Nhập mã shop">
              <b-form-input v-model="shopCode" placeholder="Nhập mã shop"></b-form-input>
            </b-form-group>
        </b-col>
        <b-col cols="3">
          <b-row class="pl-3">
            <b-form-group label="Chọn kỳ lương">
              <vue-monthly-picker
                class="monthly-picker"
                v-model="salaryMonth"
                placeHolder="Chọn kỳ lương"
                :alignment="`center`"
                :dateFormat="`MM-YYYY`"
                :clearOption="false"
              ></vue-monthly-picker>
            </b-form-group>
          </b-row>
        </b-col>
        <div class="text-right action-div">
          <b-button variant="primary" class="mt-1 w-123" @click="getDataShopDetail()"><i class="ion ion-ios-search"></i> Tìm kiếm</b-button>
          <b-button variant="danger"  class="mt-1 w-123" @click="clear()"><i class="ion ion-ios-nuclear"></i> Làm mới</b-button>
        </div>
      </b-row>
      <hr>
      <h5 class="mt-2">Thông tin sale quản lý shop: &nbsp;</h5>
      <b-row class="mt-1">
        <b-col>
          <ul>
            <li v-if="data.saleName !== null">Username:&nbsp; {{data.saleName}}</li>
            <li v-else :class="{ hightlight: data.saleName === null}">Shop chưa được gán sale</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li v-if="data.saleRegion !== null" >Miền quản lí của sale:&nbsp; {{data.saleRegion}}</li>
          </ul>
        </b-col>
      </b-row>
      <h5 class="mt-2">Thông tin shop: &nbsp;</h5>
      <b-row class="mt-1">
        <b-col>
          <ul>
            <li>Tên shop:&nbsp; {{data.shopName}}</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Miền của shop:&nbsp; {{data.shopRegion}}</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Shop trùng:&nbsp; {{data.duplicateShop}}</li>
          </ul>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <ul>
            <li>Ngày lấy đơn thành công đâu tiên:&nbsp; {{data.f_pkg_time_ss}}</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Ngày lấy đơn thành công cuối cùng:&nbsp; {{data.l_pkg_time}}</li>
          </ul>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <ul>
            <li><b>Tổng các đơn trái miền không được tính doanh thu cho Sale:&nbsp; {{data.totalPkgLeftRegion}}</b></li>
          </ul>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <ul>
            <li>Tổng đơn Xfast:&nbsp; {{data.totalXF}}</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Doanh thu Xfast:&nbsp; <span v-numeral v-text="Math.floor(data.revenueXF)"></span></li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Tổng đơn Bigsize: &nbsp; {{data.totalBBS}}</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Doanh thu Bigsize: &nbsp; <span v-numeral v-text="Math.floor(data.revenueBBS)"></span></li>
          </ul>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <ul>
            <li>Tổng đơn FF: &nbsp; {{data.totalFF}}</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Doanh thu FF: &nbsp; <span v-numeral v-text="Math.floor(data.revenueFF)"></span></li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Tổng đơn Express: &nbsp; {{data.totalEX}}</li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li>Doanh thu Express: &nbsp; <span v-numeral v-text="Math.floor(data.revenueEX)"></span></li>
          </ul>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <ul>
            <li><b>Tổng số đơn: &nbsp; {{data.totalOrderPackages}}</b></li>
          </ul>
        </b-col>
        <b-col>
          <ul>
            <li><b>Tổng doanh số:  <span v-numeral v-text="Math.floor(data.totalOrderRevenue)"></span></b></li>
          </ul>
        </b-col>
      </b-row>

      <b-table
        class="card-table"
        id="shop-duplicate"
        ref="dataTable"
        :items="data.dataShopDetail"
        :fields="fields"
        :striped="false"
        :bordered="true"
        :outlined="true"
        :hover="true"
        style="text-align:center;"
      >
        <template #cell(revenue)="row">
          <span v-numeral v-text="Math.floor(row.item.revenue)"></span>
        </template>
        <template #cell(revenue_ff)="row">
          <span v-numeral v-text="Math.floor(row.item.revenue_ff)"></span>
        </template>
        <template #cell(revenue_xf)="row">
          <span v-numeral v-text="Math.floor(row.item.revenue_xf)"></span>
        </template>
        <template #cell(revenue_bbs)="row">
          <span v-numeral v-text="Math.floor(row.item.revenue_bbs)"></span>
        </template>
        <template #cell(revenue_ex)="row">
          <span v-numeral v-text="Math.floor(row.item.revenue_ex)"></span>
        </template>
        <template #cell(actions)="row">
          <b-button class="w-button detail" variant="outline-info" @click="info(row.item, row.index, $event.target)">
            <i class="ion ion-md-eye"></i>
          </b-button>
        </template>
      </b-table>
    </b-card-body>
    <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <b-row>
        <b-col>
          <ul>
            <li>Mã đơn Xfast:&nbsp;
              <span>
                {{ infoModal.content.packages_xf }}
              </span>
            </li>
          </ul>
          <ul>
            <li>Mã đơn Bigsize:&nbsp;
              <span>
                 {{ infoModal.content.packages_bbs }}
               </span>
            </li>
          </ul>
          <ul>
            <li>Mã đơn FF:&nbsp;
              <span>
                 {{ infoModal.content.packages_ff }}
               </span>
            </li>
          </ul>
          <ul>
            <li>Mã đơn Express:&nbsp;
               <span>
                 {{ infoModal.content.packages_ex }}
               </span>
            </li>
          </ul>
        </b-col>
      </b-row>
    </b-modal>

  </b-card>
</template>

<script>
import Moment from 'moment'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import VueMonthlyPicker from 'vue-monthly-picker'
import saleService from 'domain/services/sale-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
const SHOPINFO = {
  shopName: '',
  shopRegion: '',
  f_pkg_time_ss: '',
  l_pkg_time: '',
  totalXF: 0,
  revenueXF: 0,
  totalBBS: 0,
  revenueBBS: 0,
  totalFF: 0,
  revenueFF: 0,
  totalEX: 0,
  revenueEX: 0,
  totalPkgLeftRegion: 0,
  totalOrderPackages: 0,
  totalOrderRevenue: 0,
  duplicateShop: false,
  saleName: '',
  saleRegion: '',
  dataShopDetail: []
}
export default {
  name: 'support-salary-sale',
  components: {
    VueMonthlyPicker,
    LoadingMiniBottom
  },
  data: () => ({
    appLoading: false,
    shopCode: '',
    salaryMonth: new Moment(),
    data: SHOPINFO,
    fields: [
      { key: 'date', label: 'Ngày', sortable: true, thStyle: 'width: 10%' },
      { key: 'count_real', label: 'Số đơn shop', sortable: true, thStyle: 'width: 5%' },
      { key: 'count_pkgs', label: 'Số đơn tính cho sale', sortable: true, thStyle: 'width: 10%' },
      { key: 'revenue', label: 'Doanh thu', sortable: true, thStyle: 'width: 10%' },
      { key: 'count_ff', label: 'Số đơn FF', sortable: true, thStyle: 'width: 5%' },
      { key: 'revenue_ff', label: 'Doanh thu đơn FF', sortable: true, thStyle: 'width: 10%' },
      { key: 'count_xf', label: 'Số đơn XF', sortable: true, thStyle: 'width: 5%' },
      { key: 'revenue_xf', label: 'Doanh thu XF', sortable: true, thStyle: 'width: 10%' },
      { key: 'count_bbs', label: 'Số đơn BIGSIZE', sortable: true, thStyle: 'width: 5%' },
      { key: 'revenue_bbs', label: 'Doanh thu BIGSIZE', sortable: true, thStyle: 'width: 10%' },
      { key: 'count_ex', label: 'Số đơn EXPRESS', sortable: true, thStyle: 'width: 5%' },
      { key: 'revenue_ex', label: 'Doanh thu EXPRESS', sortable: true, thStyle: 'width: 10%' },
      { key: 'actions', label: 'Chi tiết', thStyle: 'width: 5%' }
    ],
    infoModal: {
      id: 'info-modal',
      title: '',
      content: ''
    }
  }),
  watch: {},
  methods: {
    info (item, index, button) {
      this.infoModal.title = `Ngày: ${item.date}`
      this.infoModal.content = item
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal () {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },

    getDataShopDetail: function () {
      let self = this
      this.data = SHOPINFO
      this.shopCode = this.shopCode.replace(/\s+/g, '')
      if (this.shopCode === '') {
        commonHelper.showMessage('Vui lòng nhập shop code!', 'warning')
        return
      }
      let month = this.salaryMonth.format('MM')
      let year = this.salaryMonth.format('YYYY')
      let dataSend = {
        shop_code: this.shopCode,
        month: month,
        year: year
      }
      self.appLoading = true
      saleService
        .getShopInfo(dataSend)
        .then(res => {
          if (res.data.success) {
            let data = res.data.data
            this.data = {
              shopName: data.shop_name,
              shopRegion: data.shop_region,
              f_pkg_time_ss: data.f_pkg_time_ss,
              l_pkg_time: data.l_pkg_time,
              saleName: data.sale_name,
              saleRegion: data.region_manager,
              totalXF: data.totalXF,
              revenueXF: data.revenueXF,
              totalBBS: data.totalBBS,
              revenueBBS: data.revenueBBS,
              totalEX: data.totalEX,
              revenueEX: data.revenueEX,
              totalFF: data.totalFF,
              revenueFF: data.revenueFF,
              totalPkgLeftRegion: data.total_pkg_left_region,
              totalOrderPackages: data.totalXF + data.totalBBS + data.totalEX + data.totalFF,
              totalOrderRevenue: parseInt(data.revenueBBS) + parseInt(data.revenueXF) + parseInt(data.revenueEX) + parseInt(data.revenueFF),
              dataShopDetail: data.reportPKgs
            }
            self.appLoading = false
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    clear () {
      this.shopCode = ''
      this.data = SHOPINFO
    }

  }
}
</script>

<style scoped type="text/css">
  .action-div {
    position: absolute;
    right: 20px
  }
  .hightlight {
    color: red;
  }
  .detail {
    padding: 0px 5px !important;
  }
</style>
