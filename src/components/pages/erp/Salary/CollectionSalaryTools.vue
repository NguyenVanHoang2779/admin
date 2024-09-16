<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Tổng hợp tool lương team IT
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------1. Tool show lương COD-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          1. Show lương COD
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" :visible="one.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">

            <div class="col-md mb-6">
              <label class="form-label">Mã COD</label>
              <b-input type="text" v-model.trim="one.codAlias" placeholder=""/>
            </div>

            <div class="col-md mb-4">
              <label class="form-label">Chọn tháng lương</label>
              <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>
            </div>

            <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="one.loadingButton" @click.native="getSalaryCodByMonth" data-style="expand-right" class="btn btn-primary" style="width: 100%">
                  Show
                </ladda-btn>
            </div>
          </div>
          <div style="background-color: #EEEEEE" v-if="Object.getOwnPropertyNames(one.responseMessage).length > 1">
              <tree-view :data="one.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

     <!-----------------------------------------------2. Tool cập nhật snapshot cho NVVP tỉnh---------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2>
          2. Update snapshot cho NVVP tỉnh
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion2" :visible="two.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">

            <div class="col-md mb-6">
              <b-form-group label="Chọn kho">
                <select-stations :multiple="false" @selected="setSelectedStation"></select-stations>
              </b-form-group>
            </div>

            <div class="col-md mb-4">
              <label class="form-label d-none d-md-block">Ngày</label>
              <flat-pickr v-model="two.selectedDate" :config="{altInput: true, animate: false}" placeholder="Chọn ngày"/>
            </div>

            <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="one.loadingButton" @click.native="genSnapshotSalaryByDate" data-style="expand-right" class="btn btn-primary" style="width: 100%">
                  Update
                </ladda-btn>
            </div>
          </div>
          <div style="background-color: #EEEEEE" v-if="Object.getOwnPropertyNames(two.responseMessage).length > 1">
              <tree-view :data="two.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------3. Tool cập nhật công thức lương COD------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion3>
          3. Update công thức lương COD các tháng trước
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion3" :visible="three.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">

            <div class="col-md mb-6">
              <label class="form-label">Mã COD</label>
              <b-input placeholder="Các mã cod các nhau bởi dấu phẩy" type="text" v-model.trim="three.codAlias" />
            </div>

            <div class="col-md mb-4">
              <label class="form-label">Chọn tháng lương</label>
              <vue-monthly-picker v-model="three.selectedMonth"></vue-monthly-picker>
            </div>

            <div class="col-md mb-4">
              <b-form-group label="Chọn công thức lương" class="col">
                <multiselect v-model="three.selectedFormula"
                             label="name"
                             track-by="code"
                             :options="three.listFormulas"
                             :taggable="true"
                             placeholder="Chọn"
                ></multiselect>
              </b-form-group>
            </div>

            <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="three.loadingButton" @click.native="updateFormulaCOD" data-style="expand-right" class="btn btn-primary" style="width: 100%">
                  Update
                </ladda-btn>
            </div>
          </div>
          <div style="background-color: #EEEEEE" v-if="Object.getOwnPropertyNames(three.responseMessage).length > 1">
              <tree-view :data="three.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------4. Tool cập nhật lương tối thiểu COD------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion4>
          4. Update lương tối thiểu COD
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion4" :visible="four.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">

            <div class="col-md mb-6">
              <label class="form-label">Mã COD</label>
              <b-input type="text" v-model.trim="four.codAlias" placeholder=""/>
            </div>

            <div class="col-md mb-4">
              <label class="form-label">Chọn tháng lương</label>
              <vue-monthly-picker v-model="four.selectedMonth"></vue-monthly-picker>
            </div>

            <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="four.loadingButton" @click.native="getMinimumSalary" data-style="expand-right" class="btn btn-primary" style="width: 100%">
                  Update
                </ladda-btn>
            </div>
          </div>
          <div style="background-color: #EEEEEE" v-if="Object.getOwnPropertyNames(four.responseMessage).length > 1">
              <tree-view :data="four.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------5. Tool update đơn now COD----------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion5>
          <p>5. Update đơn now COD <span><i>(từ đầu tháng lương đến ngày được chọn)</i></span></p>
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion5" :visible="five.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">

            <div class="col-md mb-4">
              <label class="form-label d-none d-md-block">Ngày</label>
              <flat-pickr v-model="five.selectedDate" :config="{altInput: true, animate: false}" placeholder="Chọn ngày"/>
            </div>

            <div class="col-md col-xl-2 mb-4">
                <label class="form-label d-none d-md-block">&nbsp;</label>
                <ladda-btn :loading="five.loadingButton" @click.native="updateNowSalaryByDate" data-style="expand-right" class="btn btn-primary" style="width: 100%">
                  Update
                </ladda-btn>
            </div>

            <div class="col-md mb-4">
            </div>
          </div>
          <div style="background-color: #EEEEEE" v-if="Object.getOwnPropertyNames(five.responseMessage).length > 1">
              <tree-view :data="five.responseMessage" :options="{maxDepth: 1}"></tree-view>
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
import flatPickr from 'vue-flatpickr-component'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import salaryService from 'domain/services/salary-service'
import VueMonthlyPicker from 'vue-monthly-picker'
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import moment from 'moment'
import Multiselect from 'vue-multiselect'
import TreeView from 'vue-json-tree-view'
import SelectStations from 'components/elements/FilterBox/SelectStations'

Vue.use(TreeView)

export default {
  name: 'collection-salary-tools',
  metaInfo: {
    title: 'Collection Salary Tools'
  },
  components: {
    SelectStations,
    flatPickr,
    LaddaBtn,
    salaryService,
    VueMonthlyPicker,
    SweetModal,
    SweetModalTab,
    Multiselect
  },
  data: () => ({
    one: {
      visible: false,
      codAlias: '',
      selectedMonth: moment(new Date(), 'YYYY/MM'),
      loadingButton: false,
      responseMessage: {}
    },

    two: {
      visible: false,
      selectedStation: '',
      selectedDate: '',
      loadingButton: false,
      responseMessage: {}
    },

    three: {
      visible: false,
      codAlias: '',
      selectedMonth: moment(new Date(), 'YYYY/MM'),
      selectedFormula: '',
      listFormulas: [],
      loadingButton: false,
      responseMessage: {}
    },

    four: {
      visible: false,
      codAlias: '',
      selectedMonth: moment(new Date(), 'YYYY/MM'),
      loadingButton: false,
      responseMessage: {}
    },

    five: {
      visible: false,
      codAlias: '',
      selectedDate: '',
      loadingButton: false,
      responseMessage: {}
    }
  }),
  methods: {

    // 1. Tool show lương COD
    getSalaryCodByMonth () {
      if (!this.one.codAlias || !this.one.selectedMonth) return
      let date = this.one.selectedMonth.toDate()
      let dataSend = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        cod_alias: this.one.codAlias
      }
      this.one.loadingButton = true
      this.one.responseMessage = {}
      salaryService.getSalaryCodByMonth(dataSend).then(response => {
        this.one.responseMessage = response.data
        if (!response.data.hasOwnProperty('data')) {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-waring text-white',
            title: 'Thành công',
            text: 'Không có dữ liệu!'
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.one.loadingButton = false
      })
    },

    // 2. Tool cập nhật snapshot cho NVVP tỉnh
    setSelectedStation (stationIds) {
      this.two.selectedStation = stationIds
    },
    genSnapshotSalaryByDate () {
      if (!this.two.selectedStation || !this.two.selectedDate) return
      let dataSend = {
        date: this.two.selectedDate,
        station_id: this.two.selectedStation
      }
      this.two.loadingButton = true
      this.two.responseMessage = {}
      salaryService.genSnapshotSalaryByDate(dataSend).then(response => {
        this.two.responseMessage = response.data
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.two.loadingButton = false
      })
    },

    // 3. Tool cập nhật công thức lương COD
    updateFormulaCOD () {
      if (!this.three.codAlias || !this.three.selectedMonth || !this.three.selectedFormula) return
      let date = this.three.selectedMonth.toDate()
      let dataSend = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        cod_alias: this.three.codAlias,
        formula: this.three.selectedFormula.code
      }
      this.three.loadingButton = true
      this.three.responseMessage = {}
      salaryService.updateFormulaCOD(dataSend).then(response => {
        this.three.responseMessage = response.data
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.three.loadingButton = false
      })
    },

    // 4. Tool cập nhật lương tối thiêu COD
    getMinimumSalary () {
      if (!this.four.codAlias || !this.four.selectedMonth) return
      let date = this.four.selectedMonth.toDate()
      let dataSend = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        cod_alias: this.four.codAlias
      }
      this.four.loadingButton = true
      this.four.responseMessage = {}
      salaryService.getMinimumSalary(dataSend).then(response => {
        this.four.responseMessage = response.data
        if (!response.data.hasOwnProperty('data')) {
          this.$notify({
            group: 'notifications-default',
            type: 'bg-waring text-white',
            title: 'Thành công',
            text: 'Không có dữ liệu!'
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.four.loadingButton = false
      })
    },

    // 5. Tool update đơn now COD
    updateNowSalaryByDate () {
      if (!this.five.selectedDate) return
      let dataSend = {
        date: this.five.selectedDate
      }
      this.five.loadingButton = true
      this.five.responseMessage = {}
      salaryService.updateNowSalaryByDate(dataSend).then(response => {
        this.five.responseMessage = response.data
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
      }).catch(() => {
        this.$notify({
          group: 'notifications-default',
          type: 'bg-danger text-white',
          title: 'Lỗi',
          text: 'Đã có lỗi xảy ra.'
        })
      }).then(() => {
        this.five.loadingButton = false
      })
    }
  },

  created () {
    salaryService.apiGetAllFormulaSalary().then(response => {
      this.three.listFormulas = response.data
    })
    let urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get('id')
    if (id === '1' || !id) this.one.visible = true
    if (id === '2') this.two.visible = true
    if (id === '3') this.three.visible = true
    if (id === '4') this.four.visible = true
    if (id === '5') this.five.visible = true
  }
}
</script>
