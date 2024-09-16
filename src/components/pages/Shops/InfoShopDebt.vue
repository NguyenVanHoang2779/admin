<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading text-center">Phiên đối soát sắp tới</h4>
      <div>
        <form>
          <div class="form-filter">
            <b-form-row>
              <div class="col-md-6">
                <b-form-group label="Bộ lọc">
                  <multiselect
                    v-model="filterDebt"
                    track-by="name"
                    label="name"
                    placeholder="Sắp xếp số phiên nợ"
                    :options="filterOptions"
                    :searchable="false"
                    :allow-empty="false"
                  >
                  </multiselect>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group label="CSKH">
                  <select-ctmCare @selected="selected.ctmCare = $event" ref="select_ctmCare"></select-ctmCare>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="col-md-12">
                <b-form-group label="Mã shop">
                  <b-input type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: S1,S2..." v-model="shops.shop_code"/>
                </b-form-group>
              </div>
            </b-form-row>
            <b-form-row>
              <div class="mx-auto mt-4">
                <b-button
                  @click="resetForm"
                  class="btn"
                >
                  Nhập lại
                </b-button>
                <b-button
                  @click="searchShop(pageData.currentPage, true)"
                  class="btn btn-success"
                >
                  Tìm kiếm
                </b-button>
              </div>
            </b-form-row>
          </div>
        </form>
        <div class="result mt-4" v-if="checkResult">
          <b-card no-body v-if="listShops.length > 0">
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination :total-rows="pageData.totalItems"
                                v-model="pageData.currentPage"
                                :per-page="pageData.perPage"
                                v-on:change="pageChanged"
                  />
                  Tổng số hóa đơn: {{ pageData.totalItems }}
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
            <!-- / Pagination -->
            <div class="table-result">
              <div class="table-responsive mb-4">
                <table class="table mb-0 table-bordered table-striped">
                  <thead class="" style="width: 100%">
                  <tr>
                    <th width="30%">Thông tin Shop</th>
                    <th width="60%">Phiên đối soát sắp tới</th>
                    <th width="10%">Trạng thái</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(shop, index) in listShops" class="tr-bill">
                      <td>
                        <span class="font-weight-bold">Mã shop: </span><span>{{ shop.s_code }}</span> <br/>
                        <span class="font-weight-bold">Tên shop: </span><span>{{ shop.s_name }}</span> <br/>
                        <span class="font-weight-bold">CSKH: </span><br/>
                        <ul>
                          <li v-for="(cs) in shop.ctm_care">
                            {{cs}}
                          </li>
                        </ul>
                      </td>
                      <td>
                        <span class="font-weight-bold">Tiền thu hộ: </span><span>{{ shop.total_pick_money | toCurrency}}</span> <br/>
                        <span class="font-weight-bold">Tổng phí dịch vụ: </span><span>{{ shop.total_fee | toCurrency }}</span> <br/>
                        <ul class="detail-fee">
                          <li>Phí giao hàng: {{shop.total_ship_money | toCurrency}}</li>
                          <li>Phí chuyển hoàn: {{shop.total_return_fee | toCurrency}}</li>
                          <li>Phí bảo hiểm: {{shop.total_insurance | toCurrency}}</li>
                          <li>Phí thay đổi địa chỉ giao: {{shop.total_ch_addr_fee | toCurrency}}</li>
                          <li>Phí lưu kho: {{shop.total_store_fee | toCurrency}}</li>
                        </ul>
                        <span class="font-weight-bold">Tiền đối soát: </span><span>{{ shop.total_cashback | toCurrency }}</span> <br/>
                        <span class="font-weight-bold">Số lượng đơn hàng: </span><span>{{ shop.count_pkg }}</span> <br/><br/>
                        <span class="font-weight-bold text-danger">Tổng số phiên nợ: </span><span>{{ shop.debt_count }}</span> <br/>
                        <span class="font-weight-bold text-danger">Số tiền nợ: </span><span>{{ shop.debt_money | toCurrency}}</span> <br/>
                        <div v-if="shop.list_bill_debt.length > 0">
                          <!-- Using value -->
                          <b-link v-b-toggle="'show-debt-' + index">Xem chi tiết</b-link>
                          <!-- Element to collapse -->
                          <b-collapse v-bind:id="'show-debt-' + index">
                            <div>
                              <table class="table b-table">
                                <thead>
                                  <tr>
                                    <th>Mã hóa đơn</th>
                                    <th>Tiền nợ</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(debtBills) in shop.list_bill_debt">
                                    <td>{{debtBills.bill_code}}</td>
                                    <td>{{debtBills.bill_money | toCurrency}}</td>
                                    <td>{{debtBills.bill_created}}</td>
                                    <td>
                                      <div v-if="canDownload">
                                        <a :href="domainDownload + debtBills.file_path"
                                           target="_blank"
                                        >
                                          Tải xuống
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </b-collapse>
                        </div>

                      </td>
                      <td>
                        <div v-show="shop.check_am">
                          <b-badge variant="danger">Tiền đối soát âm</b-badge><br/>
                        </div>
                        <div v-show="shop.check_total_fee">
                          <b-badge variant="warning">Tiền phí dịch vụ >= 80% tiền thu hộ</b-badge><br/>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </b-card>
          <div class="no-data" v-if="listShops.length == 0">
            <b-alert show dismissible variant="warning">
              <i class="sidenav-icon ion ion-ios-warning"></i>
              {{messageNoti}}
            </b-alert>
          </div>
        </div>
        <BlockUI message="Dữ liệu đang được xử lý, vui lòng đợi!" :html="htmlTransfer" v-if="loadingTransfer" />
      </div>
    </div>
  </div>
</template>

<script>
import shopService from 'domain/services/shop-service'
import Multiselect from 'vue-multiselect'
import SelectCtmCare from 'components/elements/FilterBox/SelectCtmCare'
import SelectShopType from 'components/elements/FilterBox/SelectShopType'
import config from 'config/app.base'

import Vue from 'vue'
import BlockUI from 'vue-blockui'
Vue.use(BlockUI)

export default {
  components: {
    Multiselect,
    SelectCtmCare,
    SelectShopType
  },
  data: () => ({
    selected: {
      ctmCare: []
    },
    listShops: [],
    shops: {
      shop_code: ''
    },
    filterDebt: '',
    filterOptions: [
      { name: 'Số phiên nợ tăng dần', value: 'count_debt_asc' },
      { name: 'Số phiên nợ giảm dần', value: 'count_debt_desc' }
    ],
    checkResult: false,
    canDownload: false,
    domainDownload: config.domainDownloadFile,
    messageNoti: '',
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0
    },
    loadingTransfer: false,
    htmlTransfer: `<div class="sk-folding-cube sk-primary">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>
        <h5 class="text-center mb-0">LOADING...</h5>`
  }),
  methods: {
    resetForm: function () {
      this.$refs.select_ctmCare.reset()
      this.shops.shop_code = ''
      this.filterDebt = ''
    },
    searchShop: function (page, newSearchConditions) {
      let self = this
      let dataSend = {
        'shop_code': self.shops.shop_code,
        'ctm_care': self.selected.ctmCare,
        'filter_debt': self.filterDebt.value,
        'page': page
      }
      if (newSearchConditions) {
        self.pageData.currentPage = 1
        dataSend.page = 1
      }
      self.messageNoti = ''
      self.checkResult = false
      self.loadingTransfer = true
      self.listShops = []
      shopService.searchInfoShopDebt(dataSend).then(response => {
        if (response.data.success) {
          self.pageData.totalItems = response.data.options.total
          self.pageData.perPage = response.data.options.per_page
          self.pageData.totalPages = response.data.options.total_page
          self.listShops = response.data.options.shops
          self.canDownload = response.data.options.canDownload
        } else {
          self.messageNoti = response.data.message
        }
      }).catch(error => {
        if (error) {
        }
      }).then(function () {
        self.checkResult = true
        self.loadingTransfer = false
      })
    },
    downloadBill: function ($billId) {
      return '/admin/AdShopInfo/downloadBillDebt/' + $billId
    },
    pageChanged: function (page) {
      this.searchShop(page)
      this.pageData.currentPage = page
    }
  },
  filters: {
    toCurrency: function (value) {
      if (typeof value !== 'number' || value === 0) {
        return value
      }
      let formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      })
      return formatter.format(value)
    }
  }

}
</script>
<style scoped>
  .form-filter {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
    padding: 20px;
  }
</style>
