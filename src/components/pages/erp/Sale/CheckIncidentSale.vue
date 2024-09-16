<template>
    <div>
        <b-modal id="modal-1" v-if="showModal" @close="showModal = true" :hide-footer="true" :hide-header="true">
            <b>Mã Shop: {{shopDetail.shop_code}}</b>
            <hr>
            <div class="row">
                <b-table
                        id="my-table2"
                        :items="shopDetail.detail"
                        :fields="fieldsDetail"
                        class="text-center"
                >
                    <template v-slot:cell(revenue)="data">
                        <strong v-numeral>{{data.item.revenue}}</strong>
                    </template>
                </b-table>
            </div>
            <br>
            <div class="mb-4 text-center">
                <b-btn type="button" @click="$bvModal.hide('modal-1')">Đóng</b-btn>
            </div>
        </b-modal>
        <b-card no-body>
            <b-card-body>
                <h2>Check Sale & Shop</h2>
                <hr>
                <div class="row">
                    <b-form-group label="Chọn Sale" class="col-sm-3">
                        <multiselect
                                v-model="asyncSelected"
                                label="name"
                                track-by="id"
                                placeholder=""
                                :options="asyncFound"
                                :multiple="false"
                                :searchable="true"
                                :loading="asyncLoading"
                                :internal-search="false"
                                :clear-on-select="true"
                                :close-on-select="true"
                                :hide-selected="true"
                                @search-change="asyncFind">
                            <span slot="noResult">{{message}}</span>
                            <span slot="noOptions">{{message}}</span>
                        </multiselect>
                    </b-form-group>
                    <b-form-group class="col-sm-3" label="Nhập mã Shop">
                        <b-input v-model="s_code" :placeholder="`Ví dụ S1,S2,S3`"></b-input>
                    </b-form-group>
                    <b-form-group class="col-sm-3" label="Chọn tháng">
                        <vue-monthly-picker v-model="date" alignment="center" date-format="MM/YYYY"></vue-monthly-picker>
                    </b-form-group>
                    <b-form-group class="col-sm-3" label="Tùy chọn">
                        <b-btn type="button" variant="outline-success" @click="runCheck">Kiểm tra</b-btn>
                        <b-btn type="button" variant="outline-primary" @click="runRevenue">Chạy doanh thu Shop</b-btn>
                    </b-form-group>
                </div>
            </b-card-body>
        </b-card>
        <b-card no-body v-if="true">
            <b-card-body>
                <b-row class="mt-1">
                    <b-col>
                        <ul>
                            <li>Miền: <b>{{data.detailSale.region}}</b></li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Vị trí làm việc: <b>{{data.detailSale.position_name}}</b></li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Username: <b>{{data.detailSale.user_name}}</b> </li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Fullname: <b>{{data.detailSale.full_name}}</b> </li>
                        </ul>
                    </b-col>
                </b-row>
                <b-row class="mt-1">
                    <b-col>
                        <ul>
                            <li>Công chính thức: <b>{{data.detailSale.employee_work_shift}}</b> </li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Công thử việc: <b>{{data.detailSale.probationary_work_shift}}</b></li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Nghỉ phép: <b>{{data.detailSale.probationary_holiday}}</b></li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Mức lương áp dụng tính phép: <b>{{data.detailSale.salary_applied_leave}}</b></li>
                        </ul>
                    </b-col>
                    <b-col>
                        <ul>
                            <li>Tổng lương: <b>{{data.detailSale.total_salary}}</b></li>
                        </ul>
                    </b-col>
                </b-row>
            </b-card-body>
        </b-card>
        <b-card no-body>
            <b-table
                    id="my-table"
                    :items="data.s_shop"
                    :fields="fields"
                    class="text-center"
            >
                <template v-slot:cell(shop_name)="data">
                    <b>{{data.item.shop_name}}</b>
                </template>
                <template v-slot:cell(revenue_1)="data">
                    <strong v-numeral>{{data.item.revenue_1}}</strong>
                </template>
                <template v-slot:cell(revenue_2)="data">
                    <strong v-numeral>{{data.item.revenue_2}}</strong>
                </template>
                <template v-slot:cell(option)="data">
                    <b-btn variant="outline-success borderless icon-btn" class="btn-sm"
                           v-on:click="detail(data.item)"><i class="d-md-block fab fa-searchengin"></i></b-btn>
                </template>
            </b-table>
        </b-card>
        <b-card>
            <BlockUI message="" :html="blockUI.html" v-if="loadingUI"/>
        </b-card>
    </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
</style>

<script>
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import debounce from 'debounce'
import saleService from 'domain/services/sale-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import BlockUI from 'vue-blockui'
import SalaryService from 'domain/services/salary-service'
Vue.use(BlockUI)
export default {
  name: 'check-incident-sale',
  metaInfo: {
    title: 'Tool check Shop & Sale'
  },
  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    moment,
    commonHelper,
    saleService,
    Datepicker,
    SalaryService
  },
  data () {
    return {
      message: 'Nhập ít nhất 2 ký tự',
      asyncSelected: [],
      asyncFound: [],
      asyncLoading: false,
      s_code: '',
      fields: [
        {
          key: 'shop_address',
          label: 'Địa chỉ',
          sortable: true
        },
        {
          key: 'shop_name',
          label: 'Tên Shop',
          sortable: true
        },
        {
          key: 'shop_code',
          label: 'Mã Shop',
          sortable: true
        },
        {
          key: 'date_first',
          label: 'Ngày lên đơn đầu',
          sortable: true
        },
        {
          key: 'date_last',
          label: 'Ngày lên đơn cuối',
          sortable: true
        },
        {
          key: 'count_pkgs_1',
          label: 'Số đơn tháng đầu',
          sortable: true
        },
        {
          key: 'revenue_1',
          label: 'Sản lượng tháng đầu',
          sortable: true
        },
        {
          key: 'count_pkgs_2',
          label: 'Số đơn tháng hai',
          sortable: true
        },
        {
          key: 'revenue_2',
          label: 'Sản lượng tháng hai',
          sortable: true
        },
        {
          key: 'option',
          label: 'Chi tiết',
          sortable: true
        }
      ],
      fieldsDetail: [
        {
          key: 'date',
          label: 'Ngày',
          sortable: true
        },
        {
          key: 'count_pkgs',
          label: 'Số đơn',
          sortable: true
        },
        {
          key: 'revenue',
          label: 'Sản lượng',
          sortable: true
        },
        {
          key: 'modified',
          label: 'Ngày cập nhật',
          sortable: true
        }
      ],
      blockUI: {
        loading: false,
        html: `<div class="loading-container__wrapper-loader"><div class="loading-container__loader">Loading...</div></div>Đang xử lý dữ liệu...</h5>`
      },
      date: moment().format('YYYY-MM'),
      data: {
        detailSale: {
          user_name: null,
          full_name: null,
          region: null,
          position_name: null,
          salary_applied_leave: null,
          salary_applied_holiday: null,
          employee_work_shift: null,
          probationary_work_shift: null,
          probationary_holiday: null,
          total_salary: null
        },
        s_shop: []
      },
      showSale: false,
      showShop: false,
      showModal: true,
      shopDetail: []
    }
  },
  created () {
  },
  computed: {
    loadingUI () {
      return this.blockUI.loading
    },
    totalTable () {
      return this.dataTable.length
    }
  },
  methods: {
    asyncFind: debounce(function (query) {
      if (query.length < 2) {
        this.asyncFound = []
        this.message = 'Nhập ít nhất 2 ký tự'
        return
      }
      this.asyncLoading = true
      this.asyncFound = []
      saleService.searchSale({term: query}).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.asyncFound = response.data.data
          } else {
            this.message = 'Không tìm thấy kết quả'
          }
        }
      }).catch(() => {
        this.message = 'Không tìm thấy kết quả'
      }).then(() => {
        this.asyncLoading = false
      })
    }, 500),
    runRevenue () {
      if (this.s_code === '' || this.date === '') {
        return commonHelper.showMessage('Thời gian và mã Shop không được bỏ trống', 'warning')
      }
      let parmas = {
        scode: this.s_code,
        month: moment(this.date).month() + 1,
        year: moment(this.date).year()
      }
      saleService.runRevenueShop(parmas).then(response => {
        if (response.data.success) {
          return commonHelper.showMessage(response.data.message, 'success')
        }
        return commonHelper.showMessage(response.data.message, 'warning')
      })
    },
    runCheck () {
      let parmas = {
        userId: this.asyncSelected.id,
        scode: this.s_code,
        month: moment(this.date).month() + 1,
        year: moment(this.date).year()
      }
      if (this.asyncSelected.id) {
        this.showSale = true
      }
      if (this.s_code) {
        this.showShop = true
      }
      saleService.checkSale(parmas).then(response => {
        if (response.data.success) {
          this.data = response.data.data
          return commonHelper.showMessage(response.data.message, 'success')
        }
        return commonHelper.showMessage(response.data.message, 'warning')
      })
    },
    detail (item) {
      this.shopDetail = []
      this.shopDetail = item
      this.$bvModal.show('modal-1')
    }
  }
}
</script>
