<template>
  <!-- popup dừng hoạt động xe RC-->
  <b-modal centered header-class="justify-content-center" title="Dừng hoạt động" v-model="isShow" size="md" :hide-footer="true" @hidden="hideModal">
    <div class="d-flex flex-column justify-content-start">
      <div class="d-flex align-items-center" style="margin-bottom: 20px !important;">
        <div class="d-flex p-0 justify-content-between">
          <span style="font-weight:bold; font-size: 20px; margin-right: 33px !important;" class="mr-sm-1">Lý do </span>
          <div class="d-flex" v-for="reason in reasons" style="cursor: pointer;">
            <span :class="`item-reason ${typeReason === reason.value ? 'pick-up' : ''}`" :type="reason.value" @click="pickUpReason($event)">{{ reason.text }}</span>
          </div>
          <div class="d-flex" style="cursor: pointer;">
            <b-form-input v-model="reasonDelete" id="reason_delete" name="reason_delete" key="reason_delete" placeholder="Khác" class="is-danger" @input="getReasonDelete">
            </b-form-input>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center" style="margin-bottom: 30px !important;">
        <div class="d-flex p-0 justify-content-between" v-if="typeReason === 1">
          <div class="d-flex flex-column ml-1">
            <span style="font-weight:bold;padding-bottom: 10px;">Vui lòng chọn kho chịu trách nhiệm trước khi xác nhận mất RC!</span>
            <single-select-station @handleSelectedStation="handleSelectedStation" :placeholder="'Nhập kho chịu trách nhiệm'"></single-select-station>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <b-button class="delete-asset-code" size="sm" @click="stopRcTruck(vehicle)">Xác nhận</b-button>
      </div>
    </div>
  </b-modal>
</template>
<script>
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import commonHelper from 'infrastructures/helpers/common-helpers'
import MultiSelectRcCode from 'components/elements/common/MultiSelectRcCode'
import AssetService from 'domain/services/asset-service'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import {eventBus} from '../../../../main'

Vue.use(VeeValidate)

export default {
  name: 'model-delete-rc',
  components: {
    commonHelper,
    MultiSelectRcCode,
    AssetService,
    SingleSelectStation
  },

  props: [
    'vehicleDelete', 'isShowDelete', 'reasons', 'orderTruck'
  ],

  mounted () {
  },

  watch: {
    isShowDelete: function (newValue, oldValue) {
      if (newValue) {
        this.isShow = newValue
        this.vehicle = this.vehicleDelete
      }
      this.$emit('toggleModal', newValue)
    },
    vehicleDelete: function (newValue, oldValue) {
    }
  },

  data: () => ({
    isShow: false,
    typeReason: 0,
    reasonDelete: '',
    stationId: '',
    vehicle: {}
  }),

  created () {
  },

  methods: {
    showModal () {
      this.$emit('toggleModal', true)
    },
    hideModal () {
      this.hideDeleteReason()
      this.$emit('toggleModal', false)
    },
    hideDeleteReason () {
      this.vehicle = ''
      this.reasonDelete = ''
      this.typeReason = 0
      this.isShow = false
    },
    pickUpReason: function (event) {
      this.reasonDelete = ''
      let element = event.currentTarget
      this.typeReason = parseInt(element.getAttribute('type'))
    },
    getReasonDelete (reason) {
      this.reasonDelete = reason
      if (this.reasonDelete) {
        this.typeReason = 4
      }
    },
    handleSelectedStation (option) {
      this.stationId = option ? option.id : null
    },
    stopRcTruck (vehicle) {
      if (!this.typeReason) {
        commonHelper.showMessage('Bạn chưa chọn lý do dừng hoạt động xe RC ' + vehicle, 'warning')
        return
      }
      if (this.reasonDelete.length > 225) {
        commonHelper.showMessage('Lý do dừng hoạt động xe RC không vượt quá 225 ký tự', 'warning')
        return
      }
      if (this.typeReason === 1 && !this.stationId) {
        commonHelper.showMessage('Bạn chưa chọn kho chịu trách nhiệm báo mất RC ' + vehicle, 'warning')
        return
      }
      if (!confirm(`Bạn có chắc chắn muốn dừng hoạt động xe RC ${vehicle} ?`)) {
        return
      }
      let dataSend = {
        'order_truck': this.orderTruck,
        'asset_code': vehicle,
        'station_id': this.stationId,
        'reason_delete': this.reasonDelete || '',
        'type_reason': this.typeReason || ''
      }
      AssetService.stopRcTruck(dataSend)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            eventBus.$emit('reloadRcAfterDelete', vehicle)
            this.hideDeleteReason()
            this.hideModal()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
            this.hideDeleteReason()
            this.hideModal()
          }
        })
        .catch(e => {
          console.log(e)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình dừng hoạt động của xe RC.'
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
  button.ladda-button {
    min-width: 112px;
  }
  button.btn.btn-success-all.ladda-button {
    min-width: 138px;
    text-align: center;
  }
  .delete-asset-code {
    background-color: #069255;
    padding: 5px 0;
    width: 173px;
    height: 40px;
    font-size: 16px;
  }
  .pick-up {
    color: #ffffff !important;
    background-color: #219653 !important;
  }
  .item-reason {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 8px;
    gap: 10px;
    height: 29px;
    border: 1px solid #219653;
    border-radius: 100px;
    flex: none;
    order: 0;
    flex-grow: 0;
    color: #219653;
    margin-right: 10px;
  }
  input#reason_delete {
    border: none;
    border-bottom: 1px solid #BDBDBD;
    height: 29px;
    padding: 5px 8px !important;
    min-height: 0;
    width: 80px;
  }
</style>
