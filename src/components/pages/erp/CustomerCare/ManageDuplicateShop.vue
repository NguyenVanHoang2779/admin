<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col cols="6">
          <h4 class="pt-1">Quản lý shop trùng</h4>
        </b-col>
        <b-col cols="6">
          <b-row class="pl-3">
            <h5 class="pt-2"><span class="c-red">(*)</span> Chọn kỳ lương: &nbsp;</h5>
            <vue-monthly-picker
              class="monthly-picker"
              v-model="salaryMonth"
              :alignment="`center`"
              :dateFormat="`MM-YYYY`"
              :min="minMonth"
              :max="maxMonth"
              :clearOption="true"
            ></vue-monthly-picker>
          </b-row>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col md="3">
          <b-input v-model="shopCode" :placeholder="`Nhập mã shop để tìm kiếm`"></b-input>
        </b-col>
        <b-col md="3">
          <b-input v-model="listShop" :placeholder="`Nhập list mã shop (S1,S2,S3) để tạo trùng`"></b-input>
        </b-col>
        <b-col>
          <b-btn class="w-lg-100" :disabled="isProcessing" variant="outline-info" @click="getShopDuplicate">Lấy thông tin <i class="fa fa-eye"></i> <i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-btn>
        </b-col>
        <b-col>
          <b-btn class="w-lg-100" :disabled="isProcessing" variant="outline-danger" @click="createGroupShopDuplicate">Thêm nhóm shop trùng <i class="fa fa-plus-circle"></i> <i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-btn>
        </b-col>
        <b-col>
          <b-btn class="w-lg-100" :disabled="isProcessing" variant="outline-success" @click="exportShopDuplicate">Xuất danh sách shop trùng <i class="fa fa-file-excel"></i> <i v-if="isProcessing" class="fa fa-spin fa-spinner"></i></b-btn>
        </b-col>
      </b-row>
      <br>
      <hr>
      <br>
      <b-row>
        <b-col cols="2">
          <b-form-input class="search-size ml-1" v-model="filter" placeholder="Nhập để lọc kết quả tìm kiếm ..."></b-form-input>
        </b-col>
        <b-col cols="3">
          <multiselect class="multiselect-primary"
                       v-model="optionPagination"
                       :options="optionsPagination"
                       placeholder="Chọn số dòng hiển thị trong một trang"
                       label="name"
                       track-by="name"
                       selectedLabel="Đã chọn"
                       deselectLabel="Bỏ chọn"
                       selectLabel="Chọn"
                       :hide-selected="true"
                       :close-on-select="true"
          >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          </multiselect>
        </b-col>
        <b-table
          responsive
          sticky-header
          class="card-table ml-3 mr-3 mt-3"
          ref="dataTable"
          :items="dataShopDuplicate"
          :fields="fieldsShopDuplicate"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          :per-page="paginConfig.per_page"
          :current-page="paginConfig.current_page"
          style="text-align: center;"
          :filter="filter"
        >
          <template v-slot:cell(manage)="row">
              <b-btn variant="danger" @click="deleteShopDuplicate(row.item.id)"><i class="ion d-block ion-ios-trash"></i></b-btn>
              <b-btn variant="success" v-if="row.item.status === 'approved'" @click="updateStatus(row.item.id, 'auto')"><i class="ion d-block ion-md-checkmark-circle-outline"></i></b-btn>
              <b-btn variant="danger" v-if="row.item.status === 'auto'" @click="updateStatus(row.item.id, 'approved')"><i class="ion d-block ion-md-close-circle-outline"></i></b-btn>
          </template>
        </b-table>
      </b-row>
      <b-pagination
        v-if="paginConfig.total_row > 0"
        class="mt-2"
        v-model="paginConfig.current_page"
        :total-rows="paginConfig.total_row"
        :per-page="paginConfig.per_page"
        align="center"
      ></b-pagination>
    </b-card-body>
  </b-card>
</template>

<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<style scoped>
  .monthly-picker >>> .input {
    max-width: 85px !important;
    font-weight: bold;
    color: red;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CustomerCareService from 'domain/services/customer-care-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'

export default {
  name: 'manage-shop-duplicate',

  components: {
    Multiselect,
    commonHelper,
    CustomerCareService,
    VueMonthlyPicker,
    Moment
  },

  props: [],

  data: () => ({
    filter: null,
    minMonth: new Moment('2019-10'),
    maxMonth: new Moment().add(1, 'M').format('YYYY-MM'),
    salaryMonth: new Moment(),
    shopCode: '',
    listShop: '',
    month: Moment(new Moment()).format('MM'),
    year: Moment(new Moment()).format('YYYY'),
    isProcessing: false,
    fieldsShopDuplicate: [
      { key: 'id', label: 'Id', sortable: true },
      { key: 'group', label: 'Group id', sortable: true },
      { key: 's_code', label: 'Mã shop', sortable: true },
      { key: 'f_pkg_time_ss_group', label: 'Ngày lên đơn thành công theo nhóm trùng', sortable: true },
      { key: 'f_pkg_time_ss', label: 'Ngày lên đơn thành công của shop', sortable: true },
      { key: 'manage', label: 'Quản lý', sortable: true }
    ],
    dataShopDuplicate: [],
    paginConfig: {
      per_page: 5,
      current_page: 1,
      total_row: 0
    },
    optionsPagination: [
      {id: 5, name: 'Hiển thị 5 kết quả một trang'},
      {id: 10, name: 'Hiển thị 10 kết quả một trang'},
      {id: 15, name: 'Hiển thị 15 kết quả một trang'},
      {id: 20, name: 'Hiển thị 20 kết quả một trang'}
    ],
    optionPagination: [
      {id: 5, name: 'Hiển thị 5 kết quả một trang'}
    ]
  }),

  created () {
  },

  mounted () {},
  watch: {
    salaryMonth (newVal, oldVal) {
      this.month = Moment(newVal).format('MM')
      this.year = Moment(newVal).format('YYYY')
    },
    optionPagination (newVal, oldVal) {
      this.paginConfig.per_page = newVal.id
    }
  },
  computed: {},
  methods: {
    createGroupShopDuplicate () {
      if (this.listShop === '') return commonHelper.showMessage('Vui lòng nhập danh sách shop cần tạo trùng')
      this.isProcessing = true
      CustomerCareService.createGroupShopDuplicate({month: this.month, year: this.year, list_shop: this.listShop}).then(res => {
        if (res.data.success) {
          this.shopCode = res.data.data
          this.getShopDuplicate()
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      }).finally(() => {
        this.isProcessing = false
      })
    },
    updateStatus (id, status) {
      let parmas = {
        'id': id,
        'status': status
      }
      CustomerCareService.updateShopDuplicate(parmas).then(res => {
        if (res.data.success) {
          this.getShopDuplicate()
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      })
    },
    getShopDuplicate () {
      if (this.shopCode === '') return commonHelper.showMessage('Vui lòng nhập mã shop code')
      this.isProcessing = true
      this.dataShopDuplicate = []
      CustomerCareService.getShopDuplicate({month: this.month, year: this.year, shop_code: this.shopCode}).then(res => {
        if (res.data.success) {
          this.dataShopDuplicate = res.data.data
          this.paginConfig.total_row = res.data.data.length
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      }).finally(() => {
        this.isProcessing = false
      })
    },
    deleteShopDuplicate (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi?')) return
      this.isProcessing = true
      CustomerCareService.deleteShopDuplicate({id}).then(res => {
        if (res.data.success) {
          this.getShopDuplicate()
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      }).finally(() => {
        this.isProcessing = false
      })
    },
    exportShopDuplicate () {
      this.isProcessing = true
      CustomerCareService.exportShopDuplicateByMonth({month: this.month, year: this.year}).then(res => {
        if (res.data.success) {
          window.location.href = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        }
        commonHelper.showMessage(res.data.message)
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau')
      }).finally(() => {
        this.isProcessing = false
      })
    }
  }
}
</script>
