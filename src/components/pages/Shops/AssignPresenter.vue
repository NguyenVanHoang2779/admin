<template>
  <div>
    <div class="ui-block">
      <h4 class="ui-block-heading">Gán người giới thiệu shop</h4>
      <div class="search-form">
        <form>
          <b-form-row>
              <b-form-group label="Chọn shop" class="col-md-12">
                <select-shop @selected="selectedShop" ref="select_shops"></select-shop>
              </b-form-group>
          </b-form-row>
          <b-form-row>
            <div class="col-md-6">
              <b-form-group label="Chọn kho người giới thiệu">
                <select-stations @selected="selected.stations = $event" ref="select_stations" placeholder="Chọn kho người giới thiệu"></select-stations>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group label="Chọn người giới thiệu">
                <select-presenter @selected="selected.presenters = $event" placeholder="Nhập người giới thiệu" ref="select_presenters"></select-presenter>
              </b-form-group>
            </div>
          </b-form-row>
          <b-form-row>
            <div class="col-md-12">
              <b-form-group>
                <div style="text-align: center">
                  <b-btn type="button" variant="success" @click="addModal">
                    <i class="sidenav-icon ion ion-md-add"></i> Thêm người giới thiệu
                  </b-btn>
                  <b-btn type="button" variant="primary" @click="searchListShops(pageData.currentPage, true, false)">
                    <i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                  </b-btn>
                  <b-btn type="button" @click="getListShop" variant="info">Lấy danh sách</b-btn>
                  <b-btn type="reset" @click="resetForm" variant="default">Nhập lại</b-btn>
                </div>
              </b-form-group>
            </div>
          </b-form-row>
        </form>
      </div>
      <div class="result" id="results">
        <div class="col-sm text-sm-left text-center pt-3">
          <span class="text-muted" v-if="pageData.totalItems">Tìm thấy {{ pageData.totalItems }} bản ghi</span>
        </div>
        <br/>
        <b-card no-body v-if="listShops">
          <!-- / Table controls -->
          <div class="table-result" >
            <!-- Table -->
            <div class="table-responsive mb-4">
              <table class="table mb-0 table-bordered">
                <thead class="" style="width: 100%">
                <tr>
                  <th>Mã shop</th>
                  <th>Tên shop</th>
                  <th width="450px">Người giới thiệu</th>
                  <th>Ngày gán</th>
                  <th width="80px">Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="dataShop in listShops">
                  <th scope="row">{{ dataShop.shop_code }}</th>
                  <td>{{ dataShop.shop_name }}</td>
                  <td>
                    <div>{{ dataShop.fullname }} - <b-badge variant="outline-info">{{ dataShop.username }}</b-badge> - Kho: <span style="color: #1c99e6">{{ dataShop.station_name }}</span></div>
                  </td>
                  <td>{{ moment(dataShop.created).format('DD-MM-YYYY') }}</td>
                  <td>
                    <button id="btnRemovePresenterForShop" :user_id="dataShop.user_id" :shop_code="dataShop.shop_code" class="btn btn-danger" data-style="expand-left" style="width: 100%" @click="removePresenterForShop">
                      Gỡ gán người giới thiệu
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination -->
            <b-card-body class="pt-0 pb-3">
              <div class="row">
                <div class="col-sm pt-3">
                  <b-pagination
                    :total-rows="pageData.totalItems"
                    v-model="pageData.currentPage"
                    :per-page="pageData.perPage"
                    v-on:change="pageChanged"
                  />
                </div>
                <div class="col-sm text-sm-left text-center pt-3">
                  <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                </div>
              </div>
            </b-card-body>
            <!-- / Pagination -->
          </div>
        </b-card>
        <div class="no-data" v-if="!listShops">
          Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
        </div>
      </div>
    </div>
    <b-modal size="lg" id="modal-add-presenter" title="Gán người giới thiệu shop" hide-footer v-model="showModal" no-close-on-esc no-close-on-backdrop hide-header-close>
      <div class="search-form">
        <form>
          <b-form-row>
            <b-form-group label="Chọn shop" class="col-md-12">
              <select-shop @selected="selectedShop"></select-shop>
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group label="Chọn người giới thiệu" class="col-md-12">
              <select-presenter @selected="selected.presenters = $event" placeholder="Nhập người giới thiệu"></select-presenter>
            </b-form-group>
          </b-form-row>
        </form>
      </div>
      <div class="button-presenter mt-3">
        <b-button variant="default" class="mr-1" @click="closeModal">Đóng</b-button>
        <b-button variant="success" @click="assignPresenterForShop" v-if="loadingButton == false">Thêm</b-button>
        <b-button variant="success" disabled v-if="loadingButton">
          Đang lưu...
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import shopService from 'domain/services/shop-service'
import SelectShop from 'components/elements/FilterBox/SelectShop'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectPresenter from 'components/elements/FilterBox/SelectPresenter'
import moment from 'moment'

export default {
  name: 'AssignPresenter',
  components: {
    'select-shop': SelectShop,
    'select-stations': SelectStations,
    'select-presenter': SelectPresenter
  },
  data: () => ({
    success: true,
    shop: {
      code: ''
    },
    selected: {
      stations: [],
      presenters: []
    },
    listShops: [],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    showModal: false,
    loadingButton: false
  }),
  methods: {
    selectedShop: function (shopCode) {
      if (!shopCode) this.shop.code = ''
      this.shop.code = shopCode
    },
    pageChanged: function (page) {
      this.searchListShops(page)
      this.pageData.currentPage = page
    },
    searchListShops: function (page, newSearchConditions) {
      let dataSend = {
        'presenter': this.selected.presenters,
        'stations': this.selected.stations,
        'page': page
      }
      if (this.shop.code) {
        dataSend.shop_code = this.shop.code
      }
      if (newSearchConditions) {
        this.pageData.currentPage = 1
        dataSend.page = 1
      }
      this.$startLoading()
      shopService.getListShopForPresenter(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listShops = response.data.data
        } else {
          this.success = false
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
      })
    },
    assignPresenterForShop: function () {
      this.loadingButton = true
      shopService.assignPresenterForShop(this.selected.presenters, this.shop.code).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
              this.showModal = false
            } else {
              this.$notify({
                group: 'default',
                type: 'text-white bg-success',
                title: 'Thông báo',
                text: response.data.message
              })
              this.showModal = false
            }
          }
        }
      }).catch(error => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.loadingButton = false
        this.selected.presenters = []
        this.selected.stations = []
        this.shop.code = ''
        this.searchListShops(this.pageData.currentPage)
      }, 50)
    },
    removePresenterForShop: function (event) {
      event.target.innerHTML = 'Đang gỡ gán...'
      event.target.setAttribute('disabled', 'true')
      let userId = event.target.getAttribute('user_id')
      let shopCode = event.target.getAttribute('shop_code')
      shopService.removePresenterForShop(userId, shopCode).then(response => {
        if (response.hasOwnProperty('data')) {
          if (response.data.hasOwnProperty('success')) {
            if (!response.data.success) {
              this.$notify({
                group: 'default',
                type: 'text-white bg-danger',
                title: 'Thông báo',
                text: response.data.message
              })
            } else {
              this.$notify({
                group: 'default',
                type: 'text-white bg-success',
                title: 'Thông báo',
                text: response.data.message
              })
            }
          }
        }
      }).catch(error => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'text-white bg-danger',
          title: 'Thông báo',
          text: 'Đã có lỗi xảy ra, vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ'
        })
      }).then(() => {
        this.getListShop()
        event.target.innerHTML = 'Gỡ gán người giới thiệu'
        event.target.removeAttribute('disabled')
      }, 50)
    },
    resetForm: function () {
      this.selected.presenters = []
      this.shop.code = ''
      this.selected.stations = []
      this.$refs.select_stations.reset()
      this.$refs.select_presenters.selectedPresenters = []
      this.$refs.select_shops.selectedShops = []
    },
    getListShop: function () {
      let dataSend = {
        'presenter': '',
        'stations': [],
        'page': 1
      }
      this.$startLoading()
      shopService.getListShopForPresenter(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listShops = response.data.data
        } else {
          this.success = false
          this.$notify({
            group: 'default',
            type: 'text-white bg-danger',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
        this.pageData.currentPage = 1
      })
    },
    addModal: function () {
      this.showModal = true
      this.selected.presenters = []
      this.shop.code = ''
      this.selected.stations = []
      this.$refs.select_stations.reset()
      this.$refs.select_presenters.selectedPresenters = []
      this.$refs.select_shops.selectedShops = []
    },
    closeModal: function () {
      this.showModal = false
      this.selected.presenters = []
      this.shop.code = ''
      this.selected.stations = []
    },
    moment (data) {
      return moment(data)
    }
  },
  created: function () {
    this.searchListShops(this.pageData.currentPage)
  },
  computed: {
    totalItems () {
      return this.listShops.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  metaInfo: {
    title: 'Gán người giới thiệu shop'
  }
}
</script>

<style scoped>
.button-presenter {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 1.25rem 1.3125rem;
  border-top: 1px solid rgba(24,28,33,0.075);
  border-bottom-right-radius: calc(.25rem - 0px);
  border-bottom-left-radius: calc(.25rem - 0px);
}
</style>
