<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-3">
      <div>Quản lý thanh toán lương</div>
    </h4>
    <b-card class="mb-1">
      <div class="row mb-2">
        <div class="col-md-4">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Nhân viên:</label>
              </b-col>
              <b-col sm="9">
                <select-user-penalty @model="searchData.selectUser = $event"></select-user-penalty>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Bộ phân:</label>
              </b-col>
              <b-col sm="9">
                <select-group-penalty @model="searchData.selectGroup = $event"></select-group-penalty>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Vị trí:</label>
              </b-col>
              <b-col sm="9">
                <select-position-penalty @model="searchData.selectPosition = $event"></select-position-penalty>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="col-md-4">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Tỉnh:</label>
              </b-col>
              <b-col sm="9">
                <select-province-penalty @model="searchData.selectProvince = $event"></select-province-penalty>
              </b-col>
            </b-row>
          </div>

          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Kho:</label>
              </b-col>
              <b-col sm="9">
                <selected-station-penalty @model="searchData.selectStation = $event"></selected-station-penalty>
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Trạng thái:</label>
              </b-col>
              <b-col sm="9">
                <select-status-payment @model="searchData.selectStatusPayment = $event"></select-status-payment>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="col-md-4">
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Từ ngày:</label>
              </b-col>
              <b-col sm="9">
                <datepicker
                  v-model="searchData.from"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  placeholder=""
                />
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Đến ngày:</label>
              </b-col>
              <b-col sm="9">
                <datepicker
                  v-model="searchData.to"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  placeholder=""
                />
              </b-col>
            </b-row>
          </div>
          <div>
            <b-row class="my-1">
              <b-col class="label-penalty-search" sm="3">
                <label class="font-italic font-label">Loại giao dịch:</label>
              </b-col>
              <b-col sm="9">
                <select-type-payment @model="searchData.selectTypePayment = $event"></select-type-payment>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
      <div class="row mb-2" style="text-align: right; direction: rtl;">
        <div>
          <b-col class="my-1">
            <b-button class="mb-1 btn btn-info btn-block"
                      :loading="buttonExport.loading"
                      :disabled="buttonExport.disabled"
                      @click="exportData"
            >
              <i class="fas fa-download"></i> Xuất dữ liệu
            </b-button>
          </b-col>
        </div>
        <div>
          <b-col class="my-1">
            <b-btn type="button" variant="success" class="btn-block" @click="checkTransaction"><i
              class="sidenav-icon ion ion-md-help"></i> Kiểm tra
            </b-btn>
          </b-col>
        </div>
        <div>
          <b-col class="my-1">
            <b-btn type="button" variant="primary" class="btn-block" @click="getListTransaction"><i
              class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
            </b-btn>
          </b-col>
        </div>
      </div>
    </b-card>
    <b-card>
      <b-row class="mb-2">
        <b-col>
          Mỗi trang:
          <b-select size="sm" @input="getListTransaction" v-model="page.perPage" :options="[20, 50, 100]" class="d-inline-block w-auto" />
        </b-col>
        <b-col v-if="page.totalItems" class="col-sm text-sm-left text-center">
          <div class="row float-right">
            <span class="text-muted mr-2">Trang {{ page.currentPage }}/{{Math.ceil(page.totalItems / page.perPage)}} trên {{page.totalItems}} bản ghi</span>
            <b-pagination class="justify-content-center justify-content-sm-end m-0 clear-zindex"
                          v-model="page.currentPage"
                          :total-rows="page.totalItems"
                          :per-page="page.perPage"
                          v-on:input="getListTransaction"
                          size="sm"
            >
            </b-pagination>
          </div>
        </b-col>
      </b-row>
      <b-table
        id="my-table"
        ref="dataTable"
        :items="dataTable"
        :fields="fields"
        :bordered="true"
        :outlined="true"
        head-variant="light"
        striped
        hover
        style="text-align: center;"
        class="card-table"
        :per-page="page.perPage"
        :current-page="1"
        responsive>
        <template v-slot:cell(user_info)="data">
          <p class="text-left text-primary">{{ data.item.username }} - {{ data.item.fullname }} </p>
          <p class="text-left text-success">Kho: {{ data.item.station }} </p>
        </template>
        <template v-slot:cell(position_info)="data">
          <p class="text-left">Bộ phận: <b>{{ data.item.group }}</b></p>
          <p class="text-left">Vị trí: <b>{{ data.item.position_name }} </b></p>
        </template>
        <template v-slot:cell(time_info)="data">
          <p class="text-left">Ngày: {{ data.item.date }} </p>
          <p class="text-left">Tháng lương: {{ data.item.month }} </p>
          <p class="text-left">Năm lương: {{ data.item.year }} </p>
        </template>
        <template v-slot:cell(salary_info)="data">
          <p class="text-left text-success">Money: {{ (data.item.money).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }} VNĐ <i class="fab fa-bitcoin"></i></p>
          <p class="text-left text-success">Fee: {{ (data.item.fee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }} VNĐ <i class="fab fa-bitcoin"></i></p>
          <p class="text-left text-info">Gross: {{ (data.item.gross).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }} VNĐ</p>
          <p class="text-left text-danger">Refund: {{ (data.item.refund).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }} VNĐ</p>
          <p class="text-left text-danger">Tax: {{ (data.item.tax).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }} VNĐ</p>
          <p class="text-left text-danger">Non-tax: {{ (data.item.non_tax).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }} VNĐ</p>
          <p class="text-left text-info">Total_salary: {{ (data.item.total_salary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }} VNĐ</p>
        </template>
        <template v-slot:cell(transaction_info)="data">
          <p class="text-left pr-1">Loại giao dịch:
            <b class="text-danger" v-if="data.item.type == 'bank'"> Ngân hàng  <i class="fas fa-piggy-bank"></i> </b>
            <b class="text-success" v-if="data.item.type == 'eKyc'"> Ví GHTK Pay  <i class="fas fa-wallet"></i> </b>
          </p>
          <p class="text-left">Mã giao dịch: <i class="text-info">{{ data.item.batch_number }}</i></p>
          <p class="text-left">Lô giao dịch: <i class="text-info">{{ data.item.transaction_number }}</i></p>
        </template>
        <template v-slot:cell(status)="data" >
          <div v-if="data.item.status == 0">
            <b-btn type="button" variant="secondary" class="btn-block" disabled><i class="ion ion-ios-paper-plane"></i>  Chờ giao dịch
            </b-btn>
          </div>
          <div v-if="data.item.status == 1">
            <b-btn type="button" variant="primary" class="btn-block" disabled><i class="ion ion-md-stopwatch"></i>  Đang giao dịch
            </b-btn>
          </div>
          <div v-if="data.item.status == 2">
            <b-btn type="button" variant="success" class="btn-block" disabled><i class="ion ion-md-checkmark-circle"></i>  Thành công
            </b-btn>
          </div>
          <div v-if="data.item.status == 3">
            <b-btn type="button" variant="danger" class="btn-block" disabled><i class="ion ion-md-close-circle"></i>  Thất bại
            </b-btn>
          </div>
          <div v-if="data.item.status == 4">
            <b-btn type="button" variant="info" S class="btn-block" @click="showModal(data.item)"><i class="ion ion-ios-eye"></i>  Cần Đối soát
            </b-btn>
          </div>
          <p class="text-center"><i>{{ data.item.note }}</i></p>
        </template>
      </b-table>
    </b-card>
    <div>
      <b-modal ref="modal-doi-soat" hide-footer title="Đối soát giao dịch">
        <div class="d-block text-leftr">
          <b-form-group label="Ghi chú:">
            <b-form-textarea
              id="textarea"
              v-model="update.note"
              placeholder="Comment"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>
        </div>
        <div class="">
          <div class="row">
            <div class="col-4">
              <b-button class="mt-3" variant="outline-success" block @click="updateTransaction(2)">Thành công</b-button>
            </div>
            <div class="col-4">
              <b-button class="mt-3" variant="outline-danger" block @click="updateTransaction(3)">Thất bại</b-button>
            </div>
            <div class="col-4">
              <b-button class="mt-3" variant="outline-secondary" block @click="hideModal">Bỏ qua</b-button>
            </div>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/assets/sass/components/kpi-penalty-config.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
.font-label {
  font-weight: 700;
}
</style>

<script>
import kpiPenaltyService from 'domain/services/kpi-penalty-service'
import PaymentService from 'domain/services/payment-service'
import Multiselect from 'vue-multiselect'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import flatPickr from 'vue-flatpickr-component'
import vueNumeric from 'vue-numeric'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import CustomButton from 'components/elements/common/CustomButton'
import SelectUserPenalty from 'components/pages/erp/kpi/penalties/SelectUserPenalty'
import SelectedStationPenalty from 'components/pages/erp/kpi/penalties/SelectedStationPenalty'
import SelectProvincePenalty from 'components/pages/erp/kpi/penalties/SelectProvincePenalty'
import SelectGroupPenalty from 'components/pages/erp/kpi/penalties/SelectGroupPenalty'
import SelectPositionPenalty from 'components/pages/erp/kpi/penalties/SelectPositionPenalty'
import SelectStatusPayment from './SelectStatusPayment'
import SelectTypePayment from './SelectTypePayment'
import cycleTime from 'infrastructures/helpers/date.js'

export default {
  name: 'kpi-payment',
  metaInfo: {
    title: 'KPI - payment'
  },
  components: {
    kpiPenaltyService,
    Multiselect,
    SweetModal,
    SweetModalTab,
    commonHelper,
    flatPickr,
    vueNumeric,
    LaddaBtn,
    PerfectScrollbar,
    Datepicker,
    Moment,
    SingleSelectStation,
    CustomButton,
    SelectUserPenalty,
    SelectProvincePenalty,
    SelectedStationPenalty,
    cycleTime,
    SelectStatusPayment,
    SelectTypePayment,
    PaymentService,
    SelectGroupPenalty,
    SelectPositionPenalty
  },
  data: () => ({
    page: {
      currentPage: 1,
      totalPages: 1,
      perPage: 20,
      totalItems: 0
    },
    searchData: {
      from: null,
      to: null,
      selectUser: [],
      selectStation: [],
      selectStatusPayment: [],
      selectTypePayment: [],
      selectProvince: [],
      selectGroup: [],
      selectPosition: []
    },
    backupData: [],
    loading: {
      search: false,
      confirm: false
    },
    dataTable: [],
    fields: [
      {key: 'user_info', label: 'Nhân viên', sortable: true},
      {key: 'position_info', label: 'Vị trí', sortable: true},
      {key: 'time_info', label: 'Thời gian', sortable: true},
      {key: 'salary_info', label: 'Số tiền giao dịch', sortable: true},
      {key: 'transaction_info', label: 'Thông tin giao dịch', sortable: true},
      {key: 'status', label: 'Trạng thái giao dịch', sortable: true}
    ],
    update: {
      id: null,
      note: ''
    },
    data_date_key: '',
    buttonExport: {
      loading: false,
      disabled: false
    }
  }),
  created () {
    this.setDate()
    this.getListTransaction()
  },
  computed: {
  },
  methods: {
    setDate () {
      this.searchData.to = Moment(new Date()).format('YYYY-MM-DD')
      this.data_date_key = Moment(new Date()).format('YYYY-MM-21')
      this.searchData.from = (this.searchData.to > this.data_date_key) ? this.data_date_key : Moment(this.searchData.to).subtract(1, 'M').format('YYYY-MM-21')
    },
    showModal (data) {
      this.update.id = data.id
      this.$refs['modal-doi-soat'].show()
    },
    hideModal () {
      this.update.id = null
      this.update.note = ''
      this.$refs['modal-doi-soat'].hide()
    },
    updateTransaction (data) {
      if (this.update.id === null) return false
      let parmas = {
        id: this.update.id,
        status: data,
        note: this.update.note
      }
      PaymentService.updateTransaction(parmas)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.getListTransaction()
          }
        })
        .catch((e) => {
          console.log(e)
        })
      this.hideModal()
    },
    checkTransaction () {
      PaymentService.checkTransaction()
        .then((res) => {
          if (res.data.success) {
            this.getListTransaction()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getListTransaction () {
      let parmas = {
        users: this.searchData.selectUser,
        status: this.searchData.selectStatusPayment,
        types: this.searchData.selectTypePayment,
        stations: this.searchData.selectStation,
        provinces: this.searchData.selectProvince,
        groups: this.searchData.selectGroup,
        positions: this.searchData.selectPosition,
        from: Moment(this.searchData.from).format('YYYY-MM-DD'),
        to: Moment(this.searchData.to).format('YYYY-MM-DD'),
        limit: this.page.perPage,
        currentPage: this.page.currentPage
      }
      PaymentService.getListTransaction(parmas)
        .then((res) => {
          if (res.data.success) {
            this.dataTable = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
          if (res.data.general) {
            this.page.totalItems = res.data.general
          } else {
            this.page.totalItems = 0
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    formatterParams (key, params) {
      if (!params) return ''
      else if (typeof params === 'object') {
        if (params.length === 0) return ''
        else return key + '[]=' + params.join('&' + key + '[]=') + '&'
      } else return key + '=' + params + '&'
    },
    exportData () {
      this.buttonExport.loading = true
      let parmas = {
        users: this.searchData.selectUser,
        status: this.searchData.selectStatusPayment,
        types: this.searchData.selectTypePayment,
        stations: this.searchData.selectStation,
        provinces: this.searchData.selectProvince,
        groups: this.searchData.selectGroup,
        positions: this.searchData.selectPosition,
        from: Moment(this.searchData.from).format('YYYY-MM-DD'),
        to: Moment(this.searchData.to).format('YYYY-MM-DD'),
        limit: this.page.perPage,
        currentPage: this.page.currentPage
      }
      PaymentService.apiExportDataPaymentToCsv(parmas)
        .then((res) => {
          if (res.data.success) {
            window.location.href = res.data.data
            commonHelper.showMessage(res.data.message, 'success')
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
          this.buttonExport.loading = false
        })
        .catch((e) => {
          this.buttonExport.loading = false
          console.log(e)
        })
    }
  }
}
</script>
