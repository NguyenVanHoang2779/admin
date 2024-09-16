<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <h4 class="pt-1">Quản Lý Sale trái miền</h4>
      </b-row>
      <hr>
      <b-row>
          <b-form-group label="Chọn Sale" class="col-sm-4">
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
          <b-form-group label="Chọn miền" class="col-sm-4">
            <multiselect class="multiselect-primary" :close-on-select="false"
                         v-model="region"
                         :options="listRegion"
                         placeholder="Chọn miền"
                         selectedLabel="Đã chọn"
                         deselectLabel="Bỏ chọn"
                         selectLabel="Chọn"
                         label="name"
                         track-by="name"
                         :searchable="true"
                         :multiple="true"
                         :hide-selected="true"
                         :allow-empty="true"
                         :clearOption="true"
            >
              <span slot="noResult">Rất tiếc, không tìm thấy!</span>
            </multiselect>
          </b-form-group>
          <b-form-group label="Chọn tỉnh" class="col-sm-4">
            <multiselect class="multiselect-primary" :close-on-select="false"
                         v-model="province"
                         :options="listProvince"
                         placeholder="Chọn tỉnh"
                         selectedLabel="Đã chọn"
                         deselectLabel="Bỏ chọn"
                         selectLabel="Chọn"
                         label="name"
                         track-by="name"
                         :searchable="true"
                         :multiple="true"
                         :hide-selected="true"
                         :allow-empty="true"
                         :clearOption="true"
            >
              <span slot="noResult">Rất tiếc, không tìm thấy!</span>
            </multiselect>
          </b-form-group>
        <b-form-group label="Ngày bắt đầu" class="col-sm-4">
          <datepicker
                  v-model="from"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  placeholder="Ngày bắt đầu"
          />
        </b-form-group>
        <b-form-group label="Ngày kết thúc" class="col-sm-4">
          <datepicker
                  v-model="to"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  placeholder="Ngày kết thúc"
          />
        </b-form-group>
        <b-form-group label="Tùy chọn" class="col-sm-4">
          <b-button class="btn btn-outline-success width-button" @click="addRegionSale"><i
            class="sidenav-icon ion ion-md-add"></i>Thêm
          </b-button>
        </b-form-group>
      </b-row>
      <b-row>
        <b-table
          id="my-table"
          class="table-file-mechanism text-center mt-md-5"
          :items="listData"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          responsive
          striped
          hover
        >
          <template v-slot:cell(type)="data">
            <span v-if="data.item.type == 0"> Tỉnh</span>
            <span v-if="data.item.type == 1"> Miền</span>
          </template>
          <template v-slot:cell(option)="data">
            <b-btn variant="outline-danger borderless icon-btn" class="btn-sm"
                   v-on:click="deleteItem(data.item.id)"><i
              class="ion ion-md-close"></i>
            </b-btn>
          </template>
        </b-table>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRow"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style scoped>
.width-button {
  width: 45%;
  margin-left: 5px;
}
</style>
<script>
import Multiselect from 'vue-multiselect'
import flatPickr from 'vue-flatpickr-component'
import saleService from 'domain/services/sale-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'show-sale-salary',

  components: {
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    Datepicker,
    Moment,
    commonHelper
  },

  data: () => ({
    salaryMonth: new Moment(),
    users: [],
    sales: [],
    region: [],
    listRegion: [
      {code: 1, name: 'Hà Nội'},
      {code: 126, name: 'Hồ Chí Minh'},
      {code: 10, name: 'Miền Bắc'},
      {code: 20, name: 'Miền Trung'},
      {code: 30, name: 'Miền Nam'}
    ],
    province: [],
    listProvince: [],
    from: null,
    to: null,
    perPage: 20,
    currentPage: 1,
    rows: 0,
    listData: [],
    fields: [
      {key: 'id', label: 'ID', sortable: true},
      {key: 'username', label: 'Username', sortable: true},
      {key: 'type', label: 'Loại khu vực', sortable: true},
      {key: 'region_name', label: 'Khu vực', sortable: true},
      {key: 'from_date', label: 'Bắt đầu', sortable: true},
      {key: 'to_date', label: 'Kết thúc', sortable: true},
      {key: 'option', label: 'Tùy chọn', sortable: true}
    ]
  }),

  created () {
    this.getAllSales('')
    this.getAllProvince()
    this.getRegionSale()
  },
  mounted () {},
  watch: {
    region: function (val) {
      this.getAllProvince()
    }
  },
  computed: {
    totalRow () {
      return this.listData.length
    }
  },
  methods: {
    clearInput () {
      this.from = null
      this.to = null
      this.province = []
      this.region = []
      this.sales = []
    },
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
    getAllProvince: function () {
      let regionModel = []
      this.region.forEach(element => {
        regionModel.push(element.code)
      })
      let params = {
        'region_id': regionModel
      }
      saleService.getAllProvince(params).then((res) => {
        if (res.data.success) {
          this.listProvince = res.data.data
        } else {
          return commonHelper.showMessage(res.data.message, 'false')
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    addRegionSale () {
      let from = null
      let to = null
      let userId = []
      let provinceIds = []
      let regions = []
      if (this.from !== null) {
        from = Moment(this.from).format('YYYY-MM-DD')
      }
      if (this.to !== null) {
        to = Moment(this.to).format('YYYY-MM-DD')
      }
      if (this.from !== null && this.to !== null && from > to) {
        return commonHelper.showMessage('Ngày bắt đầu nhỏ hơn ngày kết thúc', 'warning')
      }
      if ((this.province.length === 0 && this.region.length === 0) || this.sales.length === 0) {
        return commonHelper.showMessage('Sale không được bỏ trống. Miền hoặc tỉnh không được bỏ trống', 'warning')
      }
      if (this.province.length > 0) {
        this.province.forEach(element => {
          provinceIds.push(element.code)
        })
      }
      if (this.region.length > 0) {
        this.region.forEach(element => {
          regions.push(element.code)
        })
      }
      this.sales.forEach(element => {
        userId.push(element.ErpUser.id)
      })
      let params = {
        'provinceIds': provinceIds,
        'regionIds': regions,
        'userIds': userId,
        'from': from,
        'to': to
      }
      saleService.addRegionSale(params).then(res => {
        if (res.data.success) {
          this.getRegionSale()
          this.clearInput()
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra. Vui Lòng Thử Lại Sau', 'warning')
      })
    },
    getRegionSale () {
      saleService.getRegionSale().then(res => {
        if (res.data.success) {
          this.listData = res.data.data
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra. Vui Lòng Thử Lại Sau', 'warning')
      })
    },
    deleteItem (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }
      let params = {
        'id': id
      }
      saleService.deleteRegionSale(params).then(res => {
        if (res.data.success) {
          this.getRegionSale()
          return commonHelper.showMessage(res.data.message, 'success')
        } else {
          return commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch(() => {
        return commonHelper.showMessage('Có lỗi xảy ra. Vui Lòng Thử Lại Sau', 'warning')
      })
    }
  }
}
</script>
