<template>
    <div>
        <b-card no-body>
            <b-card-body>
                <h2>Màn xuất lương Sale theo khoảng thời gian</h2>
                <hr>
                <div class="row">
                    <b-form-group label="Chọn Username" class="col-sm-3">
                        <multiselect
                                v-model="asyncSelected"
                                label="name"
                                track-by="id"
                                placeholder=""
                                :options="asyncFound"
                                :multiple="true"
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
                    <b-form-group class="col-sm-3" label="Ngày bắt đầu">
                        <datepicker
                                v-model="from"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                        />
                    </b-form-group>
                    <b-form-group class="col-sm-3" label="Ngày kết thúc">
                        <datepicker
                                v-model="to"
                                format="dd-MM-yyyy"
                                :bootstrapStyling="true"
                                :monday-first="true"
                                :full-month-name="true"
                                :calendar-button="true"
                                calendar-button-icon="ion ion-md-calendar"
                                :clear-button="true"
                        />
                    </b-form-group>
                    <b-form-group class="col-sm-3" label="Tùy chọn">
                        <b-btn type="button" variant="outline-success" @click="exportSalary">Xuất file</b-btn>
                    </b-form-group>
                </div>
            </b-card-body>
            <hr>
            <b-table
                    id="my-table"
                    :items="dataTable"
                    :fields="fields"
                    :per-page="perPage"
                    :current-page="currentPage"
                    class="text-center"
            >
                <template v-slot:cell(status)="data">
                    <b-badge variant="outline-success" v-if="data.item.is_success === true">thành công</b-badge>
                    <b-badge variant="outline-danger" v-if="data.item.is_success === false">thất bại</b-badge>
                </template>
                <template v-slot:cell(username)="data">
                    <b-badge variant="outline-info">{{data.item.username}}</b-badge>
                </template>
                <template v-slot:cell(option)="data">
                    <a :href="data.item.file_path"><i class="ion ion-md-download"></i></a>
                    <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                           v-on:click="deleteItem(data.item.id)"><i
                            class="ion ion-md-close"></i>
                    </b-btn>
                </template>
            </b-table>
            <hr>
            <b-pagination
                    v-model="currentPage"
                    :total-rows="totalTable"
                    :per-page="perPage"
                    aria-controls="my-table"
            ></b-pagination>
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
  name: 'export-sale-day',
  metaInfo: {
    title: 'Xuất lương Sale theo khoảng thời gian'
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
      from: new Date(),
      to: new Date(),
      dataTable: [],
      fields: [
        {
          key: 'file_name',
          label: 'Tên file',
          sortable: true
        },
        {
          key: 'created',
          label: 'Ngày tạo',
          sortable: true
        },
        {
          key: 'status',
          label: 'Trạng thái',
          sortable: true
        },
        {
          key: 'username',
          label: 'Người tạo',
          sortable: true
        },
        {
          key: 'option',
          label: 'Thao tác',
          sortable: true
        }
      ],
      perPage: 25,
      currentPage: 1,
      idCreated: '',
      totalTask: 0,
      checkRun: '',
      blockUI: {
        loading: false,
        html: `<div class="loading-container__wrapper-loader"><div class="loading-container__loader">Loading...</div></div>Đang xử lý dữ liệu...</h5>`
      }
    }
  },
  created () {
    this.listDataTable()
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
    exportSalary () {
      var userId = this.asyncSelected.map(function (i) {
        return i.id
      })
      var from = moment(this.from).format('YYYY-MM-DD')
      var to = moment(this.to).format('YYYY-MM-DD')
      userId = userId.join()
      let parmas = {
        userId: userId,
        to: to,
        from: from
      }
      if (from > to) {
        return commonHelper.showMessage('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'warning')
      }
      this.blockUI.loading = true
      saleService.exportSaleDay(parmas).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.idCreated = response.data.data.idCreated
            this.totalTask = response.data.data.total
            this.checkRun = setInterval(() => {
              this.process()
            }, 5000)
            commonHelper.showMessage('Tạo tiến trình thành công', 'success')
          } else {
            this.blockUI.loading = false
            return commonHelper.showMessage('Tạo tiến trình thất bại', 'warning')
          }
        }
      }).catch(() => {
        this.blockUI.loading = false
        return commonHelper.showMessage('Tạo tiến trình thất bại', 'warning')
      })
    },
    process () {
      let parmas = {
        id: this.idCreated,
        total: this.totalTask
      }
      saleService.checkProcessSale(parmas).then(response => {
        if (response.data.success) {
          clearInterval(this.checkRun)
          this.listDataTable()
          this.blockUI.loading = false
          return commonHelper.showMessage('Xuất file thành công', 'success')
        }
      })
    },
    listDataTable () {
      saleService.listDataSaleStage().then(response => {
        if (response.data.success) {
          this.dataTable = response.data.data
          return commonHelper.showMessage('Hiện thị kết quả thành công', 'success')
        }
        return commonHelper.showMessage('Có lỗi khi lấy dữ liệu', 'warning')
      })
    },
    deleteItem (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let parmas = {
        id: id
      }
      SalaryService.codCtvDelete(parmas).then(response => {
        if (response.data.success) {
          this.listDataTable()
          return commonHelper.showMessage('Xóa file thành công', 'success')
        } else {
          return commonHelper.showMessage('Xóa file thất bại', 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi xóa File', 'warning')
      })
    }
  }
}
</script>
