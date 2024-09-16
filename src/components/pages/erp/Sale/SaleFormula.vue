<template>
    <div>
        <b-card no-body>
            <b-card-body>
                <b-row>
                    <h4 class="ml-2 mt-1">Cơ chế sale đặc biệt</h4>
                </b-row>
                <hr>
                <div class="row">
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
                    <b-form-group label="Chọn cơ chế" class="col-sm-3">
                        <multiselect class="multiselect-success"
                                     v-model="fomula"
                                     :options="fomulas"
                                     placeholder="Chọn cơ chế"
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
                </div>
                <div class="text-right">
                    <b-btn type="button" variant="outline-primary" @click="addSaleFormula"><i class="fa fa-plus-square" aria-hidden="true"></i> Thêm
                    </b-btn>
                </div>
                <hr>
                <b-table
                        ref="dataTable"
                        :items="dataTable"
                        :fields="fields"
                        :striped="false"
                        :bordered="true"
                        :outlined="true"
                        :hover="true"
                        style="text-align: center;"
                        class="card-table"
                        responsive
                        :filter="filter"
                        @filtered='onFiltered'>
                    <template v-slot:cell(options)="data">
                        <b-btn variant="outline-danger borderless icon-btn" class="btn-xs"
                               v-on:click="deleteItem(data.item)"><i
                                class="ion ion-md-close"></i>
                        </b-btn>
                    </template>
                </b-table>
            </b-card-body>
        </b-card>
    </div>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
</style>

<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import saleService from 'domain/services/sale-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'show-sale-formula',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Moment,
    commonHelper,
    Datepicker
  },

  data: () => ({
    sales: [],
    users: [],
    rangeTime: null,
    paginConfig: {
      per_page: 10,
      current_page: 1,
      total_row: 0
    },
    filter: null,
    dataTable: [],
    fields: [
      { key: 'id', label: 'Id', sortable: true },
      { key: 'username', label: 'Username', sortable: true },
      { key: 'fullname', label: 'Họ tên', sortable: true },
      { key: 'formula', label: 'Loại cơ chế', sortable: true },
      { key: 'from', label: 'Thời gian bắt đầu', sortable: true },
      { key: 'to', label: 'Thời gian kết thúc', sortable: true },
      { key: 'options', label: 'Tùy chọn', sortable: true }
    ],
    fomulas: [
      {
        id: 'FF',
        name: 'FF'
      },
      {
        id: 'BBS',
        name: 'BBS'
      },
      {
        id: 'XF',
        name: 'XF'
      },
      {
        id: 'BLH',
        name: 'BLH'
      },
      {
        id: 'Sale_NT',
        name: 'Sale_NT'
      }
    ],
    fomula: '',
    isBusy: false,
    from: '',
    to: ''
  }),

  created () {
    this.getAllSales('')
    this.listDataSaleFormula()
  },

  mounted () {},

  computed: {},

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
    customRecord: function ({ErpUser, ErpStation, ErpAddress}) {
      return `${ErpUser.fullname} (${ErpUser.username} - ${ErpStation.name} - ${ErpAddress.name})`
    },
    onFiltered (filteredItems) {
      this.paginConfig.total_row = filteredItems.length
      this.paginConfig.current_page = 1
    },
    addSaleFormula () {
      let from = Moment(this.from).format('YYYY-MM-DD')
      let to = Moment(this.to).format('YYYY-MM-DD')
      if (this.sales.length === 0 || this.fomula.length === 0) {
        return commonHelper.showMessage('Dữ liệu sale và cơ chế không được bỏ trống', 'warning')
      }
      if (from > to) {
        return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      if (this.from === '' || this.from === null) {
        from = ''
      }
      if (this.to === '' || this.to === null) {
        to = ''
      }
      let userIds = []
      for (let i = 0; i < this.sales.length; i++) {
        userIds.push(this.sales[i].ErpUser.id)
      }
      let data = {
        userIds: userIds,
        formula: this.fomula.id,
        from: from,
        to: to
      }
      saleService.addSaleFormula(data).then(res => {
        if (res.data.success) {
          this.listDataSaleFormula()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    listDataSaleFormula () {
      saleService.listDataSaleFormula().then(res => {
        if (res.data.success) {
          this.dataTable = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    deleteItem (item) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let data = {
        id: item.id
      }
      saleService.deleteSaleFormula(data).then(res => {
        if (res.data.success) {
          this.listDataSaleFormula()
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
