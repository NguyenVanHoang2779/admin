<template>
  <div class="col-md-12" style="margin: 0 !important;padding: 0 !important;">
    <b-form-row style="height: 27px;">
      <b-form-group class="col-md-5">
        <template slot='label'>
          Xe RC
        </template>
      </b-form-group>
      <b-col class="col-md-3">
      </b-col>
      <b-col class="col-md-3">
        <div style="width: 100px !important;margin-top: 0 !important;padding-top: 0 !important;" class="ml-3 text-center py-2">
          <b-btn @click="addRC()" class="btn btn-outline-success add-row-price ml-3 btn-sm ml-3 text-center py-2" style="float: right;border-radius: 50%; font-size: 13px; padding: 0px !important; width: 20px; height: 20px;">
            <i class="fa fa-plus"/>
          </b-btn>
        </div>
      </b-col>
    </b-form-row>
    <div v-for="(rcCode,index) in tmpRc">
      <b-form-row v-bind:key="`${index}`">
        <b-form-group class="col-md-5">
          <b-input-group v-if="optionsRc.length > 0">
            <multi-select-rc-code
              :isDisabled="isPermissionEngineer"
              :rcCode="rcCode.code"
              :stationId="stationId"
              :isRentInfo="isRentInfo"
              :optionsRc="optionsRc"
              :lstRcCodes="tmpRc"
              :multiple="false"
              @handleChooseRcCode="handleChooseRcCodeTruckRent"/>
          </b-input-group>
          <b-input-group v-else>
            <b-form-input :disabled="isPermissionEngineer" placeholder="Không tồn tại tài sản trong kho để chọn"></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-col class="col-md-3">
          <ladda-btn @click.native="showDelete(rcCode)" data-style="zoom-out" class="ml-3 text-center py-2 btn-outline-primary" style="margin-top: 0.1rem !important;margin-left: 0 !important;border: solid 0.5px #e8e8e8;min-width: 100%;">
            Dừng hoạt động
          </ladda-btn>
        </b-col>
        <b-col class="col-md-3">
          <div class="ml-3 text-center py-2" style="width: 100px; margin-top: 0.1rem !important; margin-left: 5px !important; border: solid 0.5px #e8e8e8;float:left;">Định danh</div>
          <div style="margin-top: 10px !important; padding-top: 0px !important; margin-left: 0 !important; float: left;" class="ml-3 text-center py-2">
            <b-btn @click="removeRC(index)" class="btn btn-outline-success add-row-price ml-3 btn-sm ml-3 text-center py-2" style="float: right;border-radius: 50%; font-size: 14px; padding: 0px !important; width: 20px; height: 20px;">
              <i class="fa fa-minus"/>
            </b-btn>
          </div>
        </b-col>
      </b-form-row>
    </div>
  </div>
</template>
<!-- popup dừng hoạt động xe RC-->
<b-modal centered header-class="justify-content-center" title="Dừng hoạt động" ref="showDelete" size="lg" :hide-footer="true" @hidden="hideDeleteReason">
  <div class="d-flex flex-column justify-content-start">
    <div class="d-flex align-items-center" style="margin-bottom: 43px !important;">
      <span style="font-weight:bold; font-size: 20px; margin-right: 33px !important;" class="mr-sm-1">Lý do </span>
      <div class="d-flex p-0 justify-content-between ">
        <div class="d-flex" v-for="reason in reasons" style="cursor: pointer;">
          <span :class="`item-reason ${typeReason === reason.value ? 'pick-up' : ''}`" :type="reason.value" @click="pickUpReason($event)">{{ reason.text }}</span>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <b-button class="delete-asset-code" size="sm" @click="deleteTruck(vehicleDelete)">Xác nhận</b-button>
    </div>
  </div>
</b-modal>
<script>
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import MultiSelectRcCode from 'components/elements/common/MultiSelectRcCode'
import AssetService from 'domain/services/asset-service'

Vue.use(VeeValidate)

export default {
  name: 'truck-rent-rc',
  components: {
    commonHelper,
    LaddaBtn,
    MultiSelectRcCode,
    AssetService
  },

  props: [
    'isPermissionEngineer', 'stationId', 'isRentInfo', 'lstRcCodeTruckRent', 'orderTruck', 'indexPackage'
  ],

  mounted () {
    this.options = this.packageChoose
    if (this.stationId) {
      this.getIdentifierCodeTruckRent(this.stationId)
    }
  },

  watch: {
    lstRcCodeTruckRent: function (newValue) {
      if (newValue) {
        this.setRcTruckRent()
      }
    },
    stationId: function (newValue, oldValue) {
      this.getIdentifierCodeTruckRent(newValue)
    },
    orderTruck (newValue, oldValue) {
      this.orderTruck = newValue
      this.getIdentifierCodeTruckRent(this.stationId)
    }
  },

  data: () => ({
    index: 0,
    total: 0,
    tmpRc: {
      code: ''
    },
    optionsRc: [],
    arrSelected: [],
    maintenanceType: '',
    vehicleDelete: '',
    reasonDelete: '',
    typeReason: 0,
    reasons: [
      {value: 1, text: 'RC mất'},
      {value: 2, text: 'RC hỏng'},
      {value: 3, text: 'RC mất mã'}
    ]
  }),

  created () {
    this.setRcTruckRent()
  },

  methods: {
    setRcTruckRent: function () {
      this.tmpRc = this.lstRcCodeTruckRent
      this.total = this.tmpRc.length
      if (this.total === 0) {
        this.addRC()
      }
      console.log('this.tmpRc')
      console.log(this.tmpRc)
    },
    handleChooseRcCodeTruckRent (optionRc, oldRc) {
      this.rcCode = optionRc ? optionRc.name : ''
      let rcCodeSelected = optionRc ? optionRc.selected : 0
      if (this.rcCode) {
        let checkRcDuplicate = false
        this.optionsRc.forEach((element, index) => {
          if (this.optionsRc[index]['name'] === this.rcCode) {
            this.optionsRc[index]['selected'] = 1
            this.arrSelected[index] = this.rcCode
          }
        })
        this.optionsRc.forEach((element, index) => {
          if (this.optionsRc[index]['selected'] === 1 && rcCodeSelected === this.optionsRc[index]['selected']) {
            checkRcDuplicate = true
          }
        })
        if (checkRcDuplicate) {
          commonHelper.showMessage('Mã RC ' + this.rcCode + ' đã được gán cho xe. Vui lòng kiểm tra lại', 'warn')
          this.rcCode = ''
          console.log('this.arrSelected')
          console.log(this.tmpRc)
          return
        }
      } else if (oldRc) {
        this.optionsRc.forEach((element, index) => {
          if (this.optionsRc[index]['name'] === oldRc.name) {
            this.optionsRc[index]['selected'] = 0
            this.arrSelected.splice(index, 1)
          }
        })
      }
      this.$emit('updateRc', this.arrSelected)
    },
    getIdentifierCodeTruckRent (stationId) {
      let params = {
        order: this.orderTruck || '',
        asset_id: 1089,
        station_id: stationId || '',
        count: 0
      }
      AssetService.getIdentifierCodeTruckRent(params)
        .then(res => {
          if (res.data.success) {
            this.optionsRc = res.data.data
            this.optionsRc.forEach((element, index) => { this.optionsRc[index]['selected'] = 0 })
          } else {
            this.optionsRc = []
          }
        }).catch((e) => {
          console.log(e)
        })
    },
    showDelete (rcCode) {
      this.$refs.showDelete.show()
      this.vehicleDelete = rcCode
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
    closeMaintenance (indexPackage) {
      this.$emit('removePackage', indexPackage)
    },
    addRC () {
      this.tmpRc.push({
        code: ''
      })
      this.total++
    },
    removeRC (index) {
      console.log('removeRC')
      console.log(index)
      this.tmpRc.splice(index, 1)
    }
  }
}
</script>

<style scoped>
</style>
