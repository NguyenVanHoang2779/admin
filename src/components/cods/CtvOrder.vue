<template>
    <div class="payslip-manager-page">
        <div class="ui-block">
            <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
                <div>Tool thống kê xuất đơn/ điểm của COD</div>
            </h4>
            <form id="app" method="post">
                <div class="row">
                    <b-form-group label="Nhập mã Alias" class="col-sm-4">
                        <b-textarea type="text" placeholder="Nhiều mã cách nhau bởi dấu phẩy. Ví dụ: T1,T2,T3..." :rows="4"
                                    v-model="alias"/>
                    </b-form-group>
                    <!--Box chọn ngày bắt đầu -->
                    <b-form-group class="col-sm-4" label="Ngày bắt đầu">
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
                    <!--Box chọn ngày kết thúc -->
                    <b-form-group class="col-sm-4" label="Ngày kết thúc">
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
                </div>
                <div class="row">
                    <div class="col-sm-12" style="text-align: center">
                            <ladda-btn :loading="loadingButton" type="button" class="btn btn-primary"
                                       @click.native="exportOrder"><i
                                    class="sidenav-icon ion ion-md-search"></i>
                                Xuất file
                            </ladda-btn>
                            <ladda-btn :loading="loadingButton" type="button" class="btn btn-primary"
                                       @click.native="exportOrderRegion">Xuất file theo vùng
                            </ladda-btn>
                    </div>
                </div>
            </form>
        </div>
        <hr/>
        <div class="table-responsive mb-4 text-center" style="overflow-y: scroll; overflow-x: hidden;">
            <b-tabs content-class="mt-3">
                <b-tab title="File đơn theo ngày" active>
                    <b-card no-body>
                        <b-table
                                id="my-table"
                                :items="loadData"
                                :fields="fields"
                                :per-page="perPage"
                                :current-page="currentPage"
                                class="text-center"
                        >
                            <template v-slot:cell(type)="data">
                                <b-badge variant="outline-success">{{data.item.type}}</b-badge>
                            </template>
                            <template v-slot:cell(status)="data">
                                <b-badge variant="outline-success" v-if="data.item.is_success === true">thành công
                                </b-badge>
                                <b-badge variant="outline-danger" v-if="data.item.is_success === false">thất bại
                                </b-badge>
                            </template>
                            <template v-slot:cell(username)="data">
                                <b-badge variant="outline-info">{{data.item.username}}</b-badge>
                            </template>
                            <template v-slot:cell(option)="data">
                                <a :href="data.item.file_path"><i class="ion ion-md-download"></i></a>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                                       v-on:click.once="deleteItem(data.item.id)"><i
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
                </b-tab>
                <b-tab title="File đơn theo vùng">
                    <b-card no-body>
                        <b-table
                                id="my-table"
                                :items="loadDataV2"
                                :fields="fields"
                                :per-page="perPageV2"
                                :current-page="currentPageV2"
                                class="text-center"
                        >
                            <template v-slot:cell(type)="data">
                                <b-badge variant="outline-success">{{data.item.type}}</b-badge>
                            </template>
                            <template v-slot:cell(status)="data">
                                <b-badge variant="outline-success" v-if="data.item.is_success === true">thành công
                                </b-badge>
                                <b-badge variant="outline-danger" v-if="data.item.is_success === false">thất bại
                                </b-badge>
                            </template>
                            <template v-slot:cell(username)="data">
                                <b-badge variant="outline-info">{{data.item.username}}</b-badge>
                            </template>
                            <template v-slot:cell(option)="data">
                                <a :href="data.item.file_path"><i class="ion ion-md-download"></i></a>
                                <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                                       v-on:click.once="deleteItem(data.item.id)"><i
                                        class="ion ion-md-close"></i>
                                </b-btn>
                            </template>
                        </b-table>
                        <hr>
                        <b-pagination
                                v-model="currentPageV2"
                                :total-rows="totalTableV2"
                                :per-page="perPageV2"
                                aria-controls="my-table"
                        ></b-pagination>
                    </b-card>
                </b-tab>
            </b-tabs>
        </div>
        <b-card>
            <BlockUI message="" :html="blockUI.html" v-if="loadingUI"/>
        </b-card>
    </div>
</template>
<style src="@/assets/sass/components/cod-ctv-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import debounce from 'debounce'
import SalaryService from 'domain/services/salary-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import flatPickr from 'vue-flatpickr-component'
import BlockUI from 'vue-blockui'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
Vue.use(BlockUI)
export default {
  name: 'cod-order',
  metaInfo: {
    title: 'Thống kê đơn/ điểm theo khoảng thời gian'
  },
  data () {
    return {
      alias: '',
      from: new Date(),
      to: new Date(),
      fields: [
        {
          key: 'created',
          label: 'Ngày tạo',
          sortable: true
        },
        {
          key: 'file_name',
          label: 'Tên file',
          sortable: true
        },
        {
          key: 'type',
          label: 'Loại file',
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
      perPageV2: 25,
      currentPage: 1,
      currentPageV2: 1,
      loadingButton: false,
      dataTable: [],
      dataTableV2: [],
      checkRun: '',
      idExCreated: '',
      totalTask: '',
      blockUI: {
        loading: false,
        html: `<div class="loading-container__wrapper-loader"><div class="loading-container__loader">Loading...</div><h5>Đang xử lý dữ liệu</h5></div>`
      }
    }
  },
  created () {
    this.getDataTable()
    this.getDataTableV2()
  },
  components: {
    Multiselect,
    debounce,
    SalaryService,
    Datepicker,
    flatPickr,
    moment,
    commonHelper,
    LaddaBtn
  },
  computed: {
    loadData () {
      return this.dataTable
    },
    loadDataV2 () {
      return this.dataTableV2
    },
    loadingUI () {
      return this.blockUI.loading
    },
    totalTable () {
      return this.dataTable.length
    },
    totalTableV2 () {
      return this.dataTableV2.length
    }
  },
  methods: {
    formatInput () {
      this.alias = ''
      this.from = new Date()
      this.to = new Date()
    },
    exportOrder () {
      this.idExCreated = ''
      this.totalTask = ''
      var from = moment(this.from).format('YYYY-MM-DD')
      var to = moment(this.to).format('YYYY-MM-DD')
      if (from > to) {
        return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      let parmas = {
        alias: this.alias,
        from: from,
        to: to
      }
      this.blockUI.loading = true
      SalaryService.exportCtvOrder(parmas).then(response => {
        if (response.data.success) {
          this.idExCreated = response.data.data.idCreated
          this.totalTask = response.data.data.totalTask
          this.formatInput()
          this.checkRun = setInterval(() => {
            this.checkProcess()
          }, 5000)
          return commonHelper.showMessage(response.data.message, 'success')
        }
        this.blockUI.loading = false
        return commonHelper.showMessage(response.data.message, 'warning')
      }).catch(() => {
        this.blockUI.loading = false
        return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
      }).then(() => {
        this.loadingButton = false
      })
    },
    getDataTable () {
      let parmas = {
        type: 'COD_ORDER'
      }
      SalaryService.listFileCtvOrder(parmas).then(response => {
        this.loadingButton = true
        if (response.data.success) {
          this.dataTable = response.data.data
          return commonHelper.showMessage(response.data.message, 'success')
        }
        return commonHelper.showMessage(response.data.message, 'warning')
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
      }).then(() => {
        this.loadingButton = false
      })
    },
    getDataTableV2 () {
      let parmas = {
        type: 'CTV_OR_RE'
      }
      SalaryService.listFileCtvOrder(parmas).then(response => {
        this.loadingButton = true
        if (response.data.success) {
          this.dataTableV2 = response.data.data
          return commonHelper.showMessage(response.data.message, 'success')
        }
        return commonHelper.showMessage(response.data.message, 'warning')
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
      }).then(() => {
        this.loadingButton = false
      })
    },
    checkProcess () {
      let params = {
        idExCreated: this.idExCreated,
        totalTask: this.totalTask
      }
      SalaryService.checkRunExcelCtv(params).then(response => {
        if (!response.data.success) {
          clearInterval(this.checkRun)
          return commonHelper.showMessage(response.data.data.message)
        }
        if (response.data.data.process === 100) {
          clearInterval(this.checkRun)
          this.getDataTable()
          this.getDataTableV2()
          this.blockUI.loading = false
          return commonHelper.showMessage('Xuất file thành công', 'success')
        }
      }).catch(() => {
        this.blockUI.loading = false
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
        this.getDataTable()
        if (response.data.success) {
          return commonHelper.showMessage('Xóa file thành công', 'success')
        } else {
          return commonHelper.showMessage('Xóa file thất bại', 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi khi xóa File', 'warning')
      })
    },
    exportOrderRegion () {
      this.idExCreated = ''
      this.totalTask = ''
      let parmas = {
        alias: this.alias,
        from: moment(this.from).format('YYYY-MM-DD'),
        to: moment(this.to).format('YYYY-MM-DD')
      }
      this.blockUI.loading = true
      SalaryService.exportCtvOrderRegion(parmas).then(response => {
        if (response.data.success) {
          this.idExCreated = response.data.data.idCreated
          this.totalTask = response.data.data.totalTask
          this.formatInput()
          this.checkRun = setInterval(() => {
            this.checkProcess()
          }, 5000)
          return commonHelper.showMessage(response.data.message, 'success')
        }
        this.blockUI.loading = false
        return commonHelper.showMessage(response.data.message, 'warning')
      }).catch(() => {
        this.blockUI.loading = false
        return commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau', 'warning')
      }).then(() => {
        this.loadingButton = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
