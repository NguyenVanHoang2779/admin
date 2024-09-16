<template>
  <b-card>
    <div class="card-header px-0 d-flex justify-content-between">
      <h4 class="mb-0">Thời gian nhận hàng Dteam</h4>
      <div v-if="dataLoading"><i class="fa fa-spin fa-spinner"/></div>
    </div>

    <div class="overflow-x-scroll " style="max-height: 1000px">
      <b-row class="mb-3 mt-2">
        <b-col sm="2">
          <label class="col-form-label">Cần nhận</label>
        </b-col>
        <b-col sm="9">
          <b-select :options="numberOfShiftOptions" v-model="workShiftDTeamListLength" size="sm" class="input-size" />
        </b-col>
      </b-row>

      <b v-show="workShiftDTeamListLength" >Thời gian nhận hàng </b>
      <b-row class="mb-2 mt-2" v-for="(shift,index) in workShiftDTeamList.slice(0, workShiftDTeamListLength)" :key="index">
        <b-col sm="2">
          <label class="col-form-label">Phiên {{index + 1}}</label>
        </b-col>
        <b-col sm="9" class="form-line d-flex">
          <b-form-input size="sm" type="time" :value="shift" @input="handleDetailTime($event, index)" class="input-size mr-3" required />
        </b-col>
      </b-row>
    </div>
        <b-row class="mt-1">
          <b-col md="10" xs="12">
            <div v-if="errorMessages.length" class="alert alert-warning">
              <div><i class="text-danger">{{ errorMessages.toString() }}</i></div>
            </div>
          </b-col>
          <b-col md="2" xs="12" class="text-right">
            <b-button class="mb-3 input-size" @click.prevent="saveConfig()" variant="success"
                      :disabled="dataLoading || !workShiftDTeamList.length">
              <i v-if="!dataLoading" class="fa fa-save"/>
              <i v-else class="fa fa-spin fa-spinner"/>
              Lưu
            </b-button>
          </b-col>
        </b-row>
  </b-card>
</template>

<script>

import commonHelper from '../../../../infrastructures/helpers/common-helpers'
import ConfirmWorkShift from '../CodPaymentScript/ConfirmWorkShift.vue'
import ManageListCodService from '../../../../domain/services/manage-list-cod-service'

export default {
  name: 'DTeamReceive',
  components: {
    ConfirmWorkShift
  },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  created () {
    this.getDTeamReceive()
  },
  data () {
    return {
      message: '',
      dataLoading: false,
      errorMessages: [],
      workShiftDTeamList: [],
      workShiftDTeamListLength: 0,
      numberOfShiftOptions: [
        {value: 1, text: '1 phiên'},
        {value: 2, text: '2 phiên'},
        {value: 3, text: '3 phiên'},
        {value: 4, text: '4 phiên'},
        {value: 5, text: '5 phiên'},
        {value: 6, text: '6 phiên'},
        {value: 7, text: '7 phiên'},
        {value: 8, text: '8 phiên'},
        {value: 9, text: '9 phiên'},
        {value: 10, text: '10 phiên'}
      ]
    }
  },
  computed: {
  },
  methods: {
    /**
     * Lấy cấu hình
     */
    async getDTeamReceive () {
      try {
        this.dataLoading = true
        const dataFromServer = await ManageListCodService.getDTeamReceiveSettings({user_id: this.userId})
        this.initConfirmWorkShiftDTeam(dataFromServer)
        this.dataLoading = false
      } catch (reason) {
        commonHelper.showMessage(reason, 'error', 'Có lỗi xảy ra')
        this.message = reason.toString()
      } finally {
        this.dataLoading = false
      }
    },
    /**
     * @param dataFromServer
     */
    initConfirmWorkShiftDTeam (dataFromServer) {
      this.workShiftDTeamListLength = Object.keys(dataFromServer).length
      for (let i = 1; i <= 10; i++) {
        if (`receive_time_${i}` in dataFromServer) {
          this.workShiftDTeamList.push(dataFromServer[`receive_time_${i}`].substring(0, 5))
        } else {
          this.workShiftDTeamList.push(null)
        }
      }
    },
    handleDetailTime (val, index) {
      this.workShiftDTeamList[index] = val
    },
    /**
     * Lưu cấu hình
     */
    async saveConfig () {
      this.dataLoading = true
      try {
        if (this.validateSubmit()) {
          let dataSave = this.workShiftDTeamList.slice(0, this.workShiftDTeamListLength)
          const dataObject = {}
          dataSave.forEach((item, index) => {
            dataObject[`receive_time_${index + 1}`] = item ? `${item}:00` : null
          })

          await ManageListCodService.saveDTeamReceiveSettings({user_id: this.userId, session_time: dataObject})
          commonHelper.showMessage('Lưu cấu hình thành công', 'success', 'Thành công')
        }
      } catch (reason) {
        this.errorMessages.push(reason instanceof Error ? reason.message : reason.toString())
        commonHelper.showMessage(reason instanceof Error ? reason.message : reason.toString(), 'error', 'Có lỗi xảy ra')
      } finally {
        this.dataLoading = false
      }
    },
    /**
     * Validate giá trị cấu hình
     */
    validateSubmit () {
      const dataSave = this.workShiftDTeamList.slice(0, this.workShiftDTeamListLength)
      this.errorMessages = []
      if (!dataSave.length) {
        this.errorMessages.push('Trường phiên nhận không được để trống.')
      }

      dataSave.forEach((session) => {
        if (session == null && !this.errorMessages.length) {
          this.errorMessages.push('Thời gian cấu hình không được để trống.')
        }
      })

      return !this.errorMessages.length
    }
  }
}
</script>

<style scoped>
</style>
