<template>
  <div>
    <h4 class="font-weight-bold py-3 mb-4">
      Tổng hợp tool lương NVVH
    </h4>

    <hr class="border-light container-m--x mt-0 mb-5">

    <!------------------------------------------------1. Tool Chạy lương cho quản lý liên vùng HN / HCM-------------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion1>
          1. Chạy lương cho quản lý liên vùng HN / HCM
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion1" :visible="one.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md mb-4">
              <label class="form-label">Chọn tháng lương</label>
              <vue-monthly-picker v-model="one.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="one.loadingButton" @click.native="exportSalaryManagerHNHCM" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(one.responseMessage).length >1">
            <tree-view :data="one.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

     <!-----------------------------------------------2. Tool Chạy lương cho quản lý liên vùng tỉnh---------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion2>
          2. Chạy lương cho quản lý liên vùng tỉnh
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion2" :visible="two.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            <div class="col-md mb-4">
              <label class="form-label">Chọn tháng lương</label>
              <vue-monthly-picker v-model="two.selectedMonth"></vue-monthly-picker>
            </div>
            <div class="col-md col-xl-2 mb-4">
              <label class="form-label d-none d-md-block">&nbsp;</label>
              <ladda-btn :loading="two.loadingButton" @click.native="exportSalaryManagerProvince" data-style="expand-right"
                         class="btn btn-primary" style="width: 100%">
                Export
              </ladda-btn>
            </div>
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(two.responseMessage).length >1">
            <tree-view :data="two.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------3. Tool Chạy lương cho nhân viên xử lý hàng------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion3>
          3. Chạy lương cho nhân viên xử lý hàng
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion3" :visible="three.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            Chức năng đang trong quá trình phát triển
<!--            <div class="col-md mb-6">-->
<!--              <b-form-group label="Chọn kho">-->
<!--                <select-stations :multiple="false" @selected="setSelectedStation"></select-stations>-->
<!--              </b-form-group>-->
<!--            </div>-->

<!--            <div class="col-md mb-6">-->
<!--              <b-form-group label="Chọn nhân viên xử lý hàng">-->
<!--                <select-wh-staffs :stationId="three.selectedStation" :multiple="true" @selected="setSelectedWhStaffs"></select-wh-staffs>-->
<!--              </b-form-group>-->
<!--            </div>-->

<!--            <div class="col-md mb-4">-->
<!--              <label class="form-label">Chọn tháng lương</label>-->
<!--              <vue-monthly-picker v-model="three.selectedMonth"></vue-monthly-picker>-->
<!--            </div>-->

<!--            <div class="col-md col-xl-2 mb-4">-->
<!--              <label class="form-label d-none d-md-block">&nbsp;</label>-->
<!--              <ladda-btn :loading="three.loadingButton" @click.native="updateWhStaffsSalary" data-style="expand-right" class="btn btn-primary" style="width: 100%">-->
<!--                Update-->
<!--              </ladda-btn>-->
<!--            </div>-->
          </div>
          <div :style="buttonBackGround" v-if="Object.getOwnPropertyNames(three.responseMessage).length >1">
            <tree-view :data="three.responseMessage" :options="{maxDepth: 1}"></tree-view>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------4. Tool Show lương nhân viên xử lý hàng------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion4>
          4. Show lương nhân viên xử lý hàng
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion4" :visible="four.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            Chức năng đang trong quá trình phát triển
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <!------------------------------------------------5. Tool Export bảng lương nhân viên xử lý hàng----------------------------------------------------------->
    <b-card no-body class="mb-1">
      <b-card-header>
        <a class="d-flex justify-content-between text-dark" href="javascript:void(0)" v-b-toggle.accordion5>
          <p>5. Export bảng lương nhân viên xử lý hàng</p>
          <div class="collapse-icon"></div>
        </a>
      </b-card-header>
      <b-collapse id="accordion5" :visible="five.visible" accordion="accordion">
        <b-card-body>
          <div class="form-row">
            Chức năng đang trong quá trình phát triển
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
import SelectWhStaffs from 'components/elements/FilterBox/SelectWhStaffs'
import EcomTableJobLogReport from 'components/pages/erp/Salary/EcomTableJobLogReport'

Vue.use(TreeView)

export default {
  name: 'collection-wh-staff-tools',
  metaInfo: {
    title: 'Collection WH staff Tools'
  },
  components: {
    SelectStations,
    flatPickr,
    LaddaBtn,
    salaryService,
    VueMonthlyPicker,
    SweetModal,
    SweetModalTab,
    Multiselect,
    SelectWhStaffs,
    EcomTableJobLogReport
  },
  data: () => ({
    one: {
      visible: false,
      selectedMonth: moment(new Date(), 'YYYY/MM'),
      responseMessage: {}
    },

    two: {
      visible: false,
      selectedMonth: moment(new Date(), 'YYYY/MM'),
      responseMessage: {}
    },

    three: {
      visible: false,
      selectedStation: '',
      selectedWhStaffs: '',
      selectedMonth: moment(new Date(), 'YYYY/MM'),
      loadingButton: false,
      responseMessage: {}
    },

    four: {
      visible: false,
      responseMessage: {}
    },

    five: {
      visible: false
    },

    buttonBackGround: {
      backgroundColor: '#EEEEEE'
    }
  }),
  methods: {

    // 1. Tool chạy lương cho quản lý liên vùng HN / HCM
    exportSalaryManagerHNHCM () {
      if (!this.one.selectedMonth) return
      let dataSend = {
        month: moment(this.one.selectedMonth).format('MM'),
        year: moment(this.one.selectedMonth).format('YYYY'),
        city: true
      }
      salaryService.exportSalaryWHManagerHNHCM(dataSend).then(response => {
        this.one.responseMessage = response.data
        if (response.data.hasOwnProperty('success') && response.data.success === true) {
          window.open(response.data.file_path, '_blank')
        }
      }).then(() => {
        this.three.loadingButton = false
      })
    },

    // 2. Tool chạy lương cho quản lý liên vùng tỉnh
    exportSalaryManagerProvince () {
      if (!this.one.selectedMonth) return
      let dataSend = {
        month: moment(this.one.selectedMonth).format('MM'),
        year: moment(this.one.selectedMonth).format('YYYY'),
        province: true
      }
      salaryService.exportSalaryWHManagerProvince(dataSend).then(response => {
        this.one.responseMessage = response.data
        if (response.data.hasOwnProperty('success') && response.data.success === true) {
          window.open(response.data.file_path, '_blank')
        }
      }).then(() => {
        this.three.loadingButton = false
      })
    },

    // 3. Tool cập nhật lương cho nhân viên xử lý hàng

    setSelectedStation (stationIds) {
      this.three.selectedStation = stationIds
    },

    setSelectedWhStaffs (staffIds) {
      this.three.selectedWhStaffs = staffIds
    },

    updateWhStaffsSalary () {
      if (!this.three.selectedStation || !this.three.selectedWhStaffs || !this.three.selectedMonth) return
      let dataSend = {
        month: moment(this.three.selectedMonth).format('MM'),
        year: moment(this.three.selectedMonth).format('YYYY'),
        user_ids: this.three.selectedWhStaffs
      }
      salaryService.updateWhStaffsSalary(dataSend).then(response => {
        this.three.responseMessage = response.data
        if (response.data.hasOwnProperty('success')) {
          this.$notify({
            group: 'notifications-default',
            type: response.data.success ? '' : 'bg-danger text-white',
            title: response.data.success ? 'Thành công' : 'Lỗi',
            text: response.data.message
          })
        }
      }).then(() => {
        this.three.loadingButton = false
      })
    }
  },
  created () {
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
