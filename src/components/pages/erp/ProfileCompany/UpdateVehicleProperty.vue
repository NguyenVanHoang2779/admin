<template>
  <div class="col-md-12" style="margin: 0 !important;padding: 0 !important;">
    <b-form-row style="height: 27px;">
      <b-form-group class="col-md-6">
        <template slot='label'>
          Xe RC
        </template>
      </b-form-group>
      <b-col class="col-md-2">
      </b-col>
      <b-col class="col-md-4">
        <div style="width: 100px !important;margin-top: 0 !important;padding-top: 0 !important;" class="ml-3 text-center py-2">
          <b-btn @click="addRC()" class="btn btn-outline-success add-row-price ml-3 btn-sm ml-3 text-center py-2" style="float: right;border-radius: 50%; font-size: 13px; padding: 0px !important; width: 20px; height: 20px;">
            <i class="fa fa-plus"/>
          </b-btn>
        </div>
      </b-col>
    </b-form-row>
    <div v-for="(rcCode,index) in tmpRc">
      <b-form-row v-bind:key="`${index}`">
        <b-form-group class="col-md-6">
          <b-input-group v-if="optionsRc.length > 0">
            <multi-select-rc-code
              :isDisabled="isPermissionEngineer"
              :rcCode="rcCode.code"
              :stationId="stationId"
              :isRentInfo="isRentInfo"
              :optionsRc="optionsRc"
              :lstRcCodes="tmpRc"
              :multiple="false"
              @handleChooseRcCode="handleChooseRcCodeTruckRent(index, ...arguments)"/>
          </b-input-group>
          <b-input-group v-else>
            <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-col class="col-md-2" v-if="!checkDeleted(rcCode.is_active)">
          <ladda-btn @click.native="showDelete(rcCode.code)" data-style="zoom-out" class="ml-3 text-center py-2 btn-outline-primary" style="margin-left: 0 !important;border: solid 0.5px #e8e8e8;min-width: 100%;">
            Dừng hoạt động
          </ladda-btn>
        </b-col>
        <!--Hủy dừng-->
        <b-col class="col-md-2" v-else>
          <ladda-btn @click.native="revertRc(rcCode.code)" data-style="zoom-out" class="ml-3 text-center py-2 btn btn-outline-danger" style="margin-left: 0 !important;border: solid 0.5px #e8e8e8;min-width: 100%;">
            Hủy dừng
          </ladda-btn>
        </b-col>
        <b-col class="col-md-4" v-if="!checkDeleted(rcCode.is_active)">
          <div class="ml-3 text-center py-2" style="width: 100px; margin-left: 5px !important; border: solid 0.5px #e8e8e8;float:left;">Định danh</div>
          <div style="margin-top: 10px !important; padding-top: 0 !important; margin-left: 0 !important; float: left;" class="ml-3 text-center py-2">
            <b-btn @click="removeRC(index, rcCode.code)" class="btn btn-outline-danger add-row-price ml-3 btn-sm ml-3 text-center py-2" style="float: right;border-radius: 50%; font-size: 14px; padding: 0px !important; width: 20px; height: 20px;">
              <i class="fa fa-minus"/>
            </b-btn>
          </div>
        </b-col>
        <b-col class="col-md-4" v-else>
          <div class="ml-3 text-center py-2" style="width: 100px; margin-left: 5px !important; border: solid 0.5px #e8e8e8;float:left;">Định danh</div>
        </b-col>
        <div v-if="checkDeleted(rcCode.is_active)" class="col-md-12 col" style="padding-left: 22px;color: #d9534f;font-size: 14px;margin-top: -8px;margin-bottom: 10px;">
          Lỗi: {{getReasonRcTruck(rcCode.type)}} - {{rcCode.username}}- Report lúc {{formatDate(rcCode.created)}}
        </div>
      </b-form-row>
    </div>
    <model-delete-rc
      :isShowDelete="isShowDelete"
      :vehicleDelete="vehicleDelete"
      :reasons="reasons"
      :orderTruck="orderTruck"
      @toggleModal="toggleTDeleteRcModal"
      @reloadRcAfterDelete="reloadRcAfterDelete"
    >
    </model-delete-rc>
  </div>
</template>
<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Viewer from 'v-viewer'
import VueImg from 'v-img'
import 'viewerjs/dist/viewer.css'
import MultiSelectRcCode from 'components/elements/common/MultiSelectRcCode'
import AssetService from 'domain/services/asset-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import commonHelper from 'infrastructures/helpers/common-helpers'
import ModelDeleteRc from 'components/pages/erp/Truck/ModelDeleteRc'
import {eventBus} from '../../../../main'
import Truck from 'domain/entities/Truck'
import moment from 'moment'

Vue.use(Viewer)
Vue.use(VeeValidate)
Vue.use(VueImg, {
  altAsTitle: true
})

export default {
  name: 'update-vehicle-property',
  components: {
    Multiselect,
    MultiSelectRcCode,
    AssetService,
    LaddaBtn,
    ModelDeleteRc,
    commonHelper,
    Truck
  },

  props: [
    'isAdd', 'isEdit', 'stationId', 'orderTruck', 'isRentInfo', 'assetCodeTruckRents', 'lstCodeTruckRents', 'isPermissionEngineer', 'isReloadRC'
  ],

  data: () => ({
    assetCode: '',
    optionsRc: [],
    index: 0,
    total: 0,
    tmpRc: {
      code: ''
    },
    arrSelected: [],
    arrSelectedValidate: [],
    vehicleDelete: {},
    reasonDelete: '',
    typeReason: 0,
    reasons: [
      {value: 1, text: 'RC mất'},
      {value: 2, text: 'RC hỏng'},
      {value: 3, text: 'RC mất mã'}
    ],
    isShowDelete: false,
    isReloadTruckRC: false,
    countReload: 0
  }),

  created () {
    this.getIdentifierCodeTruckRent(this.stationId)
    this.setRc()
    eventBus.$on('reloadRcAfterDelete', this.reloadRcAfterDelete)
  },
  destroyed () {
    eventBus.$off('reloadRcAfterDelete', this.reloadRcAfterDelete)
  },

  computed: {
  },

  watch: {
    orderTruck (newValue, oldValue) {
      this.isReloadTruckRC = false
      this.orderTruck = newValue
      this.getIdentifierCodeTruckRent(this.stationId)
    },
    lstCodeTruckRents: function (newValue) {
      this.isReloadTruckRC = false
      if (newValue) {
        this.setRc()
      }
    },
    isReloadRC (newValue) {
      this.isReloadTruckRC = newValue
    }
  },

  methods: {
    toggleTDeleteRcModal (value) {
      this.isShowDelete = value
    },
    setRc: function () {
      this.tmpRc = this.lstCodeTruckRents
      this.total = this.tmpRc.length
      if (this.total === 0) {
        this.addRC()
      }
    },
    getIdentifierCodeTruckRent (stationId) {
      let params = {
        order: this.orderTruck || '',
        asset_id: 1089,
        rc_asset_ids: [1089, 1341],
        station_id: stationId || '',
        count: 0
      }
      AssetService.getIdentifierCodeTruckRent(params)
        .then(res => {
          if (res.data.success) {
            this.optionsRc = res.data.data
          } else {
            this.optionsRc = ''
          }
        }).catch((e) => {
          console.log(e)
        })
    },
    addRC () {
      // Thêm biến code_asset: nếu click thêm mới xe RC thì code_asset = null
      if (this.optionsRc.length === 0 && this.total > 0) {
        commonHelper.showMessage('Danh sách xe RC không có nên không thể thêm xe Rc', 'warning')
      } else if (this.optionsRc.length <= this.total && this.total > 0) {
        commonHelper.showMessage('Thêm xe RC vượt quá danh sách xe RC hiện có', 'warning')
      } else {
        this.tmpRc.push({
          code: '',
          code_asset: ''
        })
        this.total++
      }
    },
    removeRC (index, rcCode) {
      if (this.tmpRc[index] && this.tmpRc[index]['code_asset']) {
        this.deleteRcTruck(rcCode, index)
      } else {
        this.tmpRc.splice(index, 1)
        this.arrSelectedValidate.splice(index, 1)
      }
    },
    showDelete (rcCode) {
      this.vehicleDelete = rcCode
      this.toggleTDeleteRcModal(true)
    },
    hideDeleteReason () {
      this.vehicleDelete = null
      this.reasonDelete = ''
      this.typeReason = 0
    },
    pickUpReason: function (event) {
      let element = event.currentTarget
      this.typeReason = parseInt(element.getAttribute('type'))
    },
    handleChooseRcCodeTruckRent (index, optionRc, oldRc) {
      if (this.isReloadTruckRC && this.countReload === 0) {
        this.countReload = 1
      }
      this.rcCode = (optionRc && optionRc.name) ? optionRc.name : ''
      if (this.rcCode) {
        this.tmpRc[index].code = this.rcCode
        this.arrSelectedValidate[index] = this.rcCode
        this.optionsRc.forEach((element, indx) => {
          if (this.optionsRc[indx]['name'] === this.rcCode) {
            this.optionsRc[indx]['selected'] = 1
            this.arrSelected[indx] = this.rcCode
          }
        })
      } else if (oldRc) {
        this.optionsRc.forEach((element, indx) => {
          if (this.optionsRc[indx]['name'] === oldRc.name) {
            this.optionsRc[indx]['selected'] = 0
            this.arrSelected.splice(indx, 1)
          }
        })
      }

      if (!this.rcCode) {
        this.arrSelectedValidate.splice(index, 1)
      }

      this.$emit('updateRcTruckRent', {arrSelectedValidate: this.arrSelectedValidate})
    },
    checkDeleted: function (val = '1') {
      return val !== '1'
    },
    revertRc: function (vehicle) {
      if (!confirm(`Bạn có chắc chắn muốn khôi phục trạng thái hoạt động của xe RC ${vehicle} ?`)) {
        return
      }
      this.$startLoading()
      let dataSend = {
        'order_truck': this.orderTruck,
        'asset_code': vehicle
      }
      AssetService.revertRc(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            eventBus.$emit('reloadRc', vehicle)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình khôi phục trạng thái hoạt động của xe RC.'
          })
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    },
    getReasonRcTruck (reason) {
      return Truck.getReasonRcTruck(reason)
    },
    formatDate (date, format = 'H:m:s YYYY-MM-DD') {
      if (!date) return ''
      return moment(date).format(format)
    },
    reloadRcAfterDelete () {
      eventBus.$emit('reloadRc')
    },
    deleteRcTruck (rcCode, index) {
      if (!rcCode) {
        return commonHelper.showMessage('Không tồn tại mã xe RC ' + rcCode, 'warning')
      }
      if (!confirm(`Bạn có chắc chắn muốn bỏ gán mã xe RC ${rcCode} ra khỏi xe tải?`)) {
        return false
      }
      let dataSend = {
        'asset_code': rcCode || ''
      }
      AssetService.deleteRcTruck(dataSend)
        .then(res => {
          if (res.data.success) {
            this.tmpRc.splice(index, 1)
            this.arrSelectedValidate.splice(index, 1)
            commonHelper.showMessage(res.data.message, 'success')
            eventBus.$emit('reloadRc', rcCode)
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình xóa xe RC.'
          })
        })
        .finally(() => {
          this.appLoading = false
          this.$stopLoading()
        })
    }
  }
}
</script>

<style scoped>
  .multi-vehicle .multiselect--active {
    margin-bottom: 200px !important;
  }
  #modal-update-truck-document .img-bounder img {
    width: 128px;
    height: 150px;
  }
</style>
<style>
</style>
