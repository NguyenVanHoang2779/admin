<template>
  <div class="row">
    <div class="col-md-12">
      <div class="ui-block center">
        <h4 class="ui-block-heading text-center">Đối soát nghỉ lễ</h4>
      </div>
      <b-card>
        <div class="row audit-config">
          <b-form-row class="col-md-6 col-lg-6 col-xl-6">
            <div class="col-xl-6 col-md-6">
              <div class="audit-config-col"><b>Loại đối soát</b></div>
            </div>
            <div class="col-xl-4 col-md-4">
              <div class="audit-config-col"><b>Thời gian</b></div>
            </div>
            <div class="col-xl-2 col-md-2">
              <div class="audit-config-col"><b>Hành động</b></div>
            </div>
          </b-form-row>
          <b-form-row class="col-md-6 col-lg-6 col-xl-6">
            <div class="col-xl-6 col-md-6">
              <div class="audit-config-col"><b>Loại đối soát</b></div>
            </div>
            <div class="col-xl-4 col-md-4">
              <div class="audit-config-col"><b>Thời gian</b></div>
            </div>
            <div class="col-xl-2 col-md-2">
              <div class="audit-config-col"><b>Hành động</b></div>
            </div>
          </b-form-row>
          <b-form-row class="col-md-6 col-lg-6 col-xl-6" v-for="(paymentPeriod, index) in paymentPeriods" :key="index">
            <div class="col-xl-6 col-md-6 audit-config-title">
              {{paymentPeriod}}
            </div >
            <div class="col-xl-4 col-md-4">
              <datepicker
                v-model="auditConfig[index]"
                :format="customFormatter"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                input="null"
                placeholder="--/--/----"
                @selected="changeTime(index)"
              />
            </div>
            <div class="col-xl-2 col-md-2">
              <b-button type="button" v-if="disableUpdate[index]" title="Bạn phải chọn thời gian" variant="secondary">Sửa</b-button>
              <b-button type="button" v-else variant="primary" @click="changeConfigHoliday(index, 'Thời gian đối soát bù ' + paymentPeriod)">Sửa</b-button>
            </div>
          </b-form-row>
        </div>
      </b-card>
    </div>
  </div>
</template>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<script>
import auditService from 'domain/services/audit-service'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

export default {
  data: () => ({
    paymentPeriods: {},
    auditConfig: {},
    disableUpdate: {}
  }),
  components: {
    Datepicker
  },
  computed: {
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('DD/MM/YYYY')
    },
    changeTime (type) {
      this.disableUpdate[type] = false
    },
    listPaymentPeriod: function () {
      let self = this
      auditService.listPaymentPeriod().then(response => {
        if (response.data.success) {
          self.paymentPeriods = response.data.paymentPeriods
          self.auditConfig = response.data.auditConfig
          self.disableUpdate = response.data.disableUpdate
        }
      }).catch(error => {
        if (error) {
        }
      })
    },
    changeConfigHoliday: function (type, paymentPeriod) {
      let self = this
      if (!confirm('Bạn có chắc chắn muốn thay đổi ' + paymentPeriod + '?')) {
        return
      }
      // Validate nếu chọn thời gian dừng đối soát
      if ((type === 'skip_audit_from' && moment(self.auditConfig[type]).format('YYYY-MM-DD') > moment(self.auditConfig.skip_audit_to).format('YYYY-MM-DD')) ||
        (type === 'skip_audit_to' && moment(self.auditConfig.skip_audit_from).format('YYYY-MM-DD') > moment(self.auditConfig[type]).format('YYYY-MM-DD'))
      ) {
        commonHelper.showMessage('Bạn phải nhập thời gian bắt đầu nhỏ hơn hoặc bằng thời gian kết thúc', 'error')
        return
      }
      let params = {
        type: type,
        date_set: moment(self.auditConfig[type]).format('DD-MM-YYYY')
      }
      auditService.changeConfigHoliday(params).then(response => {
        if (response.data.success) {
          this.disableUpdate[type] = true
          commonHelper.showMessage('Cập nhật ' + paymentPeriod + ' thành công', 'success')
        }
      }).catch(error => {
        if (error) {
        }
      })
    }
  },
  created () {
    this.listPaymentPeriod()
  }
}
</script>
<style scoped>
  .audit-config > div {
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 10px;
  }
  .audit-config-title {
    padding-top: 10px;
    padding-left: 10px;
  }
</style>
