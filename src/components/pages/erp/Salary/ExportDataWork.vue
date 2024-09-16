<template>
  <div>
    <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
      <div>Xuất file dữ liệu làm việc và lương tháng cho COD</div>
    </h4>

    <!-- Filters -->
    <div class="ui-bordered px-4 pt-4 mb-4">
      <b-card no-body class="mb-2">
        <b-card-header>
          <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2-1>
            Xuất dữ liệu công việc
            <div class="collapse-icon"></div>
          </a>
        </b-card-header>
        <b-collapse id="accordion2-1" visible accordion="accordion2">
          <b-card-body>
            <div class="form-row">

              <div class="col-md mb-6">
                <label class="form-label">Mã COD</label>
                <b-input type="text" v-model="one.alias" @click.native="resetButton" placeholder="Nhập mã COD" />
              </div>

              <div class="col-md mb-4">
                <label class="form-label">Khoảng thời gian</label>
                <flat-pickr v-model="one.range" @change.native="resetButton" :config="one.rangeConfig" placeholder="Chọn" />
              </div>

              <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="one.loading" @click.native="exportAndDowload" data-style="expand-right" class="btn btn-info" v-bind:style="{ width: '100%', background: one.typeButton?'':'green' }">
                  <span :class="one.typeButton?'ion ion-ios-arrow-forward':'ion ion-ios-arrow-down'"></span>
                  &nbsp;&nbsp;{{one.typeButton ? 'Xuất dữ liệu' : 'Tải xuống file'}}
                </ladda-btn>
              </div>

            </div>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1">
        <b-card-header>
          <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2-2>
            Chạy lại lương và xuất dữ liệu lương cho COD
            <div class="collapse-icon"></div>
          </a>
        </b-card-header>
        <b-collapse id="accordion2-2" visible accordion="accordion2">
          <b-card-body>
            <div class="form-row">

              <div class="col-md mb-6">
                <label class="form-label">Mã COD</label>
                <b-input type="text" v-model="two.listAlias" @click.native="resetField" placeholder="Nhiều mã COD cách nhau bởi dấu phẩy" />
              </div>

              <div class="col-md mb-4">
                <label class="form-label">Chọn tháng lương</label>
                <vue-monthly-picker @selected="resetField" v-model="two.selectedMonth"></vue-monthly-picker>
              </div>

              <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="two.loadingButton1" @click.native="showModal" data-style="expand-right" class="btn btn-primary" style="width: 100%">
                  Chạy
                </ladda-btn>
              </div>

              <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="two.loadingButton2" @click.native="exportAndDowload2" data-style="expand-right" class="btn btn-info" v-bind:style="{ width: '100%', background: two.typeButton?'':'green' }">
                  <span :class="two.typeButton?'ion ion-ios-arrow-forward':'ion ion-ios-arrow-down'"></span>
                  &nbsp;&nbsp;{{two.typeButton ? 'Xuất dữ liệu' : 'Tải xuống file'}}
                </ladda-btn>
              </div>
            </div>
            <p style="font-size: small">{{two.updateMessage}}</p>
            <b-progress v-if="two.progressValue" :value="two.progressValue" height="0.25rem" />
            <div v-if="this.two.resultUpdate.success || this.two.resultUpdate.fail">
              <b style="font-size: small">Kết quả:</b>
              <i v-if="this.two.resultUpdate.success !== ''" class="ion d-block ion-md-checkmark" style="color: green; margin-left: 10px"> {{this.two.resultUpdate.success}}</i>
              <i v-if="this.two.resultUpdate.fail !== ''" class="ion d-block ion-md-close" style="color: red; margin-left: 10px"> {{this.two.resultUpdate.fail}}</i>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
    <b-table striped hover :items="one.listUrl"></b-table>
    <notifications group="notifications-default" />

    <b-modal ref="myModalRef" hide-footer static>
      <div class="d-block text-center">
        <h4>Bạn có chắc chắn muốn chạy lại lương cho COD?</h4>
      </div>
      <b-btn class="mt-3" variant="outline-success" block @click="resetDataSalary">Xác nhận</b-btn>
    </b-modal>
  </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import salaryService from 'domain/services/salary-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
// import Notifications from 'vue-notification'
export default {
  name: 'export-work-data',
  metaInfo: {
    title: 'Export Data Work'
  },
  components: {
    flatPickr,
    LaddaBtn,
    salaryService,
    VueMonthlyPicker,
    SweetModal,
    SweetModalTab
  },
  data: () => ({
    one: {
      typeButton: 1,
      listUrl: [],
      loading: false,
      progress: false,
      range: null,
      alias: '',
      rangeConfig: {
        mode: 'range',
        altInput: true,
        dateFormat: 'Y-m-d',
        altFormat: 'Y-m-d'
      },
      urlDownload: ''
    },
    two: {
      listAlias: '',
      selectedMonth: '',
      loadingButton1: false,
      progressValue: 0,
      resultUpdate: {
        fail: '',
        success: ''
      },
      updateMessage: null,
      typeButton: 1,
      loadingButton2: false,
      urlDownload: ''
    }
  }),
  methods: {
    showModal () {
      if (this.two.listAlias === '' || this.two.selectedMonth === '' || this.two.loadingButton2 === true) return
      this.$refs.myModalRef.show()
    },
    // 1.xuat du lieu luong
    exportAndDowload () {
      if (this.one.typeButton === 1 && this.one.range !== null) {
        this.one.loading = true
        let str = this.one.range.split(' ')
        let dataSend = {
          alias: this.one.alias,
          from: str[0],
          to: str[2]
        }
        salaryService.exportWorkDataCod(dataSend).then(response => {
          if (response.data.hasOwnProperty('success')) {
            this.$notify({
              group: 'notifications-default',
              type: response.data.success ? '' : 'bg-danger text-white',
              title: response.data.success ? 'Thành công' : 'Lỗi',
              text: response.data.message
            })
            if (response.data.success) {
              this.one.typeButton = 0
              this.one.urlDownload = response.data.data
              this.one.listUrl.push({STT: this.one.listUrl.length + 1, Alias: this.one.alias, Link: this.one.urlDownload})
            }
            this.one.loading = false
          }
        }).catch(() => {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: 'Đã có lỗi xảy ra.'
          })
        }).then(() => {
          this.one.loading = false
        })
      }
      if (this.one.typeButton === 0) {
        window.location.href = this.one.urlDownload
      }
    },
    resetButton () {
      this.one.urlDownload = ''
      this.one.typeButton = 1
    },
    // 2.Chay lai luong
    resetDataSalary () {
      if (this.two.listAlias === '' || this.two.selectedMonth === '' || this.two.loadingButton2 === true) return
      this.resetField()
      this.$refs.myModalRef.hide()
      this.two.loadingButton1 = true
      let monthAndYear = this.two.selectedMonth._i.toString().split('/')
      let rangeDate = this.monthToRangeWorkDate(monthAndYear[1], monthAndYear[0])
      let listAlias = this.two.listAlias.toString().split(',')
      this.updateCodSalary(listAlias, rangeDate.from, rangeDate.to, listAlias.length)
    },
    monthToRangeWorkDate (month, year) {
      let prevMonth = month > 1 ? month - 1 : 12
      let prevYear = month > 1 ? year : year - 1
      if (month < 10) month = '0' + month
      if (prevMonth < 10) prevMonth = '0' + prevMonth
      let from = `${prevYear}-${prevMonth}-21`
      let to = `${year}-${month}-20`
      return {
        from: from,
        to: to
      }
    },
    updateCodSalary (listAlias, from, to, count) {
      if (listAlias.length === 0) return
      let dataSend = {
        alias: listAlias[0].trim(),
        fr: from,
        to: to
      }
      this.two.updateMessage = `Đang chạy dữ liệu cho COD ${dataSend.alias}...`
      salaryService.updateCodSalary(dataSend).then(response => {
        if (typeof response.data.type !== 'undefined' && response.data.type === 'notAllow') {
          this.two.updateMessage = ''
          listAlias = []
          this.two.loadingButton1 = false
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: response.data.message
          })
        } else {
          if (response.data.success) {
            this.two.resultUpdate.success += dataSend.alias + ' '
          } else {
            this.two.resultUpdate.fail += dataSend.alias + ' '
          }
          this.two.progressValue += 100 / count
          if (Math.round(this.two.progressValue) === 100) {
            this.two.loadingButton1 = false
            this.two.updateMessage = ''
            this.$notify({
              group: 'notifications-default',
              type: 'bg-info text-white',
              title: 'Hoàn tất',
              text: 'Đã cập nhật dữ liệu lương cho COD.'
            })
          }
        }
      }).catch(() => {
        this.two.loadingButton1 = false
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        listAlias.shift()
        this.updateCodSalary(listAlias, from, to, count)
      })
    },
    resetField () {
      this.two.progressValue = 0
      this.two.resultUpdate.success = ''
      this.two.resultUpdate.fail = ''
      this.two.updateMessage = ''
      this.two.typeButton = 1
    },
    exportAndDowload2 () {
      if (this.two.typeButton === 1) {
        if (this.two.listAlias === '' || this.two.selectedMonth === '' || this.two.loadingButton1 === true) return
        this.resetField()
        this.two.loadingButton2 = true
        let monthAndYear = this.two.selectedMonth._i.toString().split('/')
        let listAlias = this.two.listAlias.toString().split(',')
        let dataSend = {
          listAlias: listAlias,
          month: monthAndYear[1],
          year: monthAndYear[0]
        }
        salaryService.exportSalaryCod(dataSend).then(response => {
          if (response.data.success) {
            this.two.urlDownload = response.data.path
            this.two.typeButton = 0
          }
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }).catch(() => {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-danger text-white',
            title: 'Lỗi',
            text: 'Đã có lỗi xảy ra.'
          })
        }).then(() => {
          this.two.loadingButton2 = false
        })
      }
      if (this.two.typeButton === 0) {
        window.location.href = this.two.urlDownload
      }
    }
  }
}
</script>
