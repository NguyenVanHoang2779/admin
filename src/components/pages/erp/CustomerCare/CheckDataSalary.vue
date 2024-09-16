<template>
  <b-card no-body>
    <h1 class="mt-3 ml-3">Tool Check Dữ Liệu Lương</h1>
    <b-card-body>
      <div class="mb-3">
        <b-button class="btn-question-size" v-b-toggle.why-shop-no-revenue variant="outline-info">Tại sao shop không nhảy doanh thu <i class="fa fa-question"></i></b-button>
      </div>
      <b-collapse id="why-shop-no-revenue">
        <b-card>
          <b-row>
            <b-col>
              <b-input v-model="shopCode" placeholder="Nhập mã shop"></b-input>
            </b-col>
            <b-col>
              <vue-monthly-picker
                class="monthly-picker"
                v-model="salaryMonth"
                :alignment="`center`"
                :dateFormat="`MM-YYYY`"
                :clearOption="true"
              ></vue-monthly-picker>
            </b-col>
            <b-col>
              <b-btn variant="outline-info" @click="checkShopNoRevenue">Kiểm tra <i v-if="isProcessingCheckShopRevenue" class="fa fa-spinner fa-spin"></i></b-btn>
            </b-col>
          </b-row>
          <b-row>
            <h5 class="ml-3 mr-3 mt-3">{{reasonShopNoRevenue}}</h5>
          </b-row>
        </b-card>
      </b-collapse>

      <div class="mb-3 mt-3">
        <b-button class="btn-question-size" v-b-toggle.why-no-salary-export variant="outline-info">Tại sao user không có trong bảng lương <i class="fa fa-question"></i></b-button>
      </div>
      <b-collapse id="why-no-salary-export">
        <b-card>
          <b-row>
            <b-col>
              <b-input v-model="username" placeholder="Nhập username"></b-input>
            </b-col>
            <b-col>
              <vue-monthly-picker
                class="monthly-picker"
                v-model="salaryMonth"
                :alignment="`center`"
                :dateFormat="`MM-YYYY`"
                :clearOption="true"
              ></vue-monthly-picker>
            </b-col>
            <b-col>
              <b-btn variant="outline-info" @click="checkUserNoSalary">Kiểm tra <i v-if="isProcessingCheckNoSalary" class="fa fa-spinner fa-spin"></i></b-btn>
            </b-col>
          </b-row>
          <b-row>
            <h5 class="ml-3 mr-3 mt-3">{{reasonNoSalary}}</h5>
          </b-row>
        </b-card>
      </b-collapse>
    </b-card-body>
  </b-card>
</template>
<style scoped>
.btn-question-size {
  width: 300px;
}
</style>
<script>
import Moment from 'moment'
import VueMonthlyPicker from 'vue-monthly-picker'
import commonHelper from 'infrastructures/helpers/common-helpers'
import CustomerCareService from 'domain/services/customer-care-service'

export default {
  name: 'check-salary-customer-care',
  components: {
    Moment,
    VueMonthlyPicker
  },
  data: () => ({
    shopCode: '',
    salaryMonth: new Moment(),
    username: '',
    isProcessingCheckShopRevenue: false,
    reasonShopNoRevenue: '',
    isProcessingCheckNoSalary: false,
    reasonNoSalary: ''
  }),
  methods: {
    checkShopNoRevenue () {
      if (this.shopCode === '') return commonHelper.showMessage('Vui lòng nhập mã shop code')
      let month = Moment(this.salaryMonth).format('MM')
      let year = Moment(this.salaryMonth).format('YYYY')
      this.isProcessingCheckShopRevenue = true
      this.reasonShopNoRevenue = ''
      CustomerCareService.checkShopNoRevenue({month, year, shop_code: this.shopCode}).then(res => {
        if (!res.data.success) return commonHelper.showMessage(res.data.message, 'warning')
        this.reasonShopNoRevenue = 'Kết quả: ' + res.data.message
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau')
      }).finally(() => {
        this.isProcessingCheckShopRevenue = false
      })
    },

    checkUserNoSalary () {
      if (this.username === '') return commonHelper.showMessage('Vui lòng nhập username')
      let month = Moment(this.salaryMonth).format('MM')
      let year = Moment(this.salaryMonth).format('YYYY')
      this.isProcessingCheckNoSalary = true
      CustomerCareService.checkUserNoSalary({month, year, username: this.username}).then(res => {
        if (!res.data.success) return commonHelper.showMessage(res.data.message, 'warning')
        this.reasonNoSalary = 'Kết quả: ' + res.data.message
      }).catch(() => {
        commonHelper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau')
      }).finally(() => {
        this.isProcessingCheckNoSalary = false
      })
    }
  }
}
</script>
