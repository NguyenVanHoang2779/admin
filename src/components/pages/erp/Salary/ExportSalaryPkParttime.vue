<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Tool lương XLH thời vụ</div>
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------Tool xuất bảng lương tài xế -------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          Xuất bảng lương XLH thời vụ
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md-2"></div>
            <div class="col-md-6">
              <div class="center-input">
                <label class="form-label">Chọn tháng lương</label>
                <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="one.loadingButton" @click.native="exportSalaryPkParttime" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export lương theo tháng
              </ladda-btn>
            </div>
          </div>

          <div class="form-row">
            <div class="col-md-2"></div>
            <div class="col-md-3">
              <div class="center-input">
                <label class="form-label">Chọn ngày bắt đầu</label>
                <datepicker
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  v-model="two.from"
                >
                </datepicker>
              </div>
            </div>
            <div class="col-md-3">
              <div class="center-input">
                <label class="form-label">Chọn ngày kết thúc</label>
                <datepicker
                  v-model="two.to"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                >
                </datepicker>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="two.loadingButton" @click.native="exportSalaryPkParttimeByHour" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export lương trong khoảng thời gian
              </ladda-btn>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <notifications group="notifications-default" />
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>

import Vue from 'vue'
import moment from 'moment'
import VueMonthlyPicker from 'vue-monthly-picker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import salaryService from 'domain/services/salary-service'
import Datepicker from 'vuejs-datepicker'
import TreeView from 'vue-json-tree-view'
import commonHelper from 'infrastructures/helpers/common-helpers'

Vue.use(TreeView)

moment.suppressDeprecationWarnings = true

export default {
  name: 'export-salary-pg-parttime',

  metaInfo: {
    title: 'Tool lương XLH thời vụ'
  },

  components: {
    LaddaBtn,
    VueMonthlyPicker,
    salaryService,
    Datepicker
  },

  data: () => ({
    one: {
      visible: false,
      loadingButton: false,
      selectedMonth: moment(new Date()).format('YYYY/MM')
    },
    two: {
      visible: false,
      loadingButton: false,
      from: moment(new Date()).format('YYYY/MM/DD'),
      to: moment(new Date()).format('YYYY/MM/DD'),
      maxDate: moment(new Date()).format('YYYY/MM/DD')
    }
  }),

  created () {
    this.onChangeDateFrom()
  },

  watch: {
    'two.from': function () {
      this.onChangeDateFrom()
    },
    'two.to': function (newDate) {
      this.onChangeDateTo(newDate)
    }
  },

  methods: {
    onChangeDateTo (newDate) {
      if (new Date(newDate) > new Date(this.two.maxDate)) {
        commonHelper.showMessage('Vui lòng chọn ngày kết thúc nằm trong khoảng 1 tháng so với ngày bắt đầu', 'warning')
        this.two.to = new Date(this.two.maxDate)
      }
    },
    onChangeDateFrom () {
      let day = moment(this.two.from).format('DD')
      let month = moment(this.two.from).format('MM')
      day--
      month++
      this.two.maxDate = (moment().format('YYYY') + '-' + month + '-' + day)
      if (new Date(this.two.to) > new Date(this.two.maxDate)) {
        this.two.to = new Date(this.two.maxDate)
      }
    },
    exportSalaryPkParttime () {
      this.one.loadingButton = true
      let month = moment(this.one.selectedMonth).format('YYYY/MM')
      let str = month.split('/')
      let dataSend = {
        'year': str[0],
        'month': str[1]
      }
      salaryService.exportSalaryPkParttime(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          window.open(response.data.data, '_blank')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.one.loadingButton = false
      })
    },
    exportSalaryPkParttimeByHour () {
      this.two.loadingButton = true
      let dataSend = {
        'from': moment(this.two.from).format('YYYY/MM/DD'),
        'to': moment(this.two.to).format('YYYY/MM/DD')
      }
      salaryService.getDataSalaryPkParttimeByHour(dataSend).then(response => {
        if (response.data.success) {
          commonHelper.showMessage(response.data.message, 'success')
          window.open(response.data.data, '_blank')
        } else {
          commonHelper.showMessage(response.data.message, 'warning')
        }
      }).then(() => {
        this.two.loadingButton = false
      })
    }
  }
}
</script>
