<template>
  <b-card no-body>
    <b-card-body>
      <b-row>
        <b-col>
          <multiselect
            class="multiselect-primary"
           v-model="listUserB2c"
           :options="optionListUserB2c"
           :multiple="true"
           placeholder="Chọn user"
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
        <b-col cols="6">
          <b-row class="pl-3">
            <h5 class="pt-2"><span class="c-red">(*)</span> Chọn kỳ lương: &nbsp;</h5>
            <vue-monthly-picker
              class="monthly-picker"
              v-model="salaryMonth"
              :alignment="`center`"
              :dateFormat="`MM-YYYY`"
              :clearOption="true"
            ></vue-monthly-picker>
          </b-row>
        </b-col>
        <b-col md="2">
          <b-btn variant="outline-info" @click="getListShopGoneAway"><i class="fa fa-eye"></i> Xem DS Shop Rời Bỏ</b-btn>
        </b-col>
        <b-col md="2">
          <b-btn variant="outline-success" @click="exportListShopGoneAway"><i class="fas fa-file-excel"></i> Xuất DS Shop Rời Bỏ</b-btn>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-table
          responsive
          sticky-header
          class="card-table"
          ref="dataTable"
          :items="dataShopGoneAway"
          :fields="fieldsShopGoneAway"
          :striped="false"
          :bordered="true"
          :outlined="true"
          :hover="true"
          style="text-align: center;"
        ></b-table>
      </b-row>
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

  .c-red {
    color: red;
  }

  .cus-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .right {
    text-align: center;
  }

  .w-130 {
    width: 130px;
  }
</style>

<script>
import Multiselect from 'vue-multiselect'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CustomerCareService from 'domain/services/customer-care-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import Moment from 'moment'

export default {
  name: 'export-shop-gone-away',

  components: {
    Multiselect,
    commonHelper,
    CustomerCareService,
    VueMonthlyPicker,
    Moment
  },

  props: [],

  data: () => ({
    listUserB2c: [],
    optionListUserB2c: [],
    salaryMonth: new Moment(),
    fieldsShopGoneAway: [
      { key: 'user_id', label: 'Id User', sortable: true },
      { key: 'username', label: 'Username', sortable: true },
      { key: 'fullname', label: 'Họ tên', sortable: true },
      { key: 'list_shop', label: 'Danh sách shop rời bỏ', sortable: true },
      { key: 'percent_gone_away', label: 'Phầm trăm rời bỏ', sortable: true },
      { key: 'total_shop_assign', label: 'Tổng shop gán trong kỳ lương', sortable: true },
      { key: 'total_shop_gone_away', label: 'Tổng shop rời bỏ', sortable: true },
      { key: 'salary', label: 'Lương', sortable: true }
    ],
    dataShopGoneAway: []
  }),

  created () {
    this.getMemberB2c()
  },

  watch: {
  },

  methods: {
    getMemberB2c () {
      CustomerCareService.getCustomerCares().then(res => {
        if (res.data.success) {
          this.optionListUserB2c = res.data.data.map(customer => {
            return {
              'id': customer.ErpUser.id,
              'name': `${customer.ErpUser.fullname} - ${customer.ErpUser.username}`
            }
          })
        } else {
          commonHelper.showMessage('Không lấy được danh sách cskh')
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại sau')
      })
    },
    getListShopGoneAway () {
      if (this.salaryMonth === null) return commonHelper.showMessage('Vui lòng chọn kỳ lương')
      let month = Moment(this.salaryMonth).format('MM')
      let year = Moment(this.salaryMonth).format('YYYY')
      let userIds = null
      if (this.listUserB2c.length > 0) {
        userIds = this.listUserB2c.map(customer => { return customer.id })
      }

      CustomerCareService.getListShopGoneAway({month: month, year: year, user_ids: userIds}).then(res => {
        if (res.data.success) {
          this.dataShopGoneAway = res.data.data
          commonHelper.showMessage(res.data.message, 'success')
        } else {
          commonHelper.showMessage('Không lấy được danh sách shop rời bỏ')
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại sau')
      })
    },

    exportListShopGoneAway: function () {
      if (this.salaryMonth === null) return commonHelper.showMessage('Vui lòng chọn kỳ lương')
      let month = Moment(this.salaryMonth).format('MM')
      let year = Moment(this.salaryMonth).format('YYYY')
      let userIds = null
      if (this.listUserB2c.length > 0) {
        userIds = this.listUserB2c.map(customer => { return customer.id })
      }

      CustomerCareService.getListShopGoneAway({month: month, year: year, user_ids: userIds, is_export: true}).then(res => {
        if (res.data.success) {
          window.location.href = res.data.data
        } else {
          commonHelper.showMessage('Không lấy được danh sách shop rời bỏ')
        }
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra vui lòng thử lại sau')
      })
    }
  }
}
</script>
