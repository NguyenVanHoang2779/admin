<template>
  <b-modal hide-footer modal-class="modal-resign" id="modal-resign" ref="refResign"  @show="resetModal" size="md" static>
    <div slot="modal-title">
        Thông tin nghỉ việc
    </div>
    <div class="row">
        <div class="col-3 mt-2"><b>Ngày nghỉ <span class="text-danger">(*)</span>:</b></div>
        <div class="col-9">
            <datepicker
                  v-model="resignDate"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  placeholder="Ngày nghỉ"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
          />
        </div>
    </div>
    <div class="row mt-3" v-if="resignInfo.resign_editable && resignInfo.resign_date">
      <div class="col-3 mt-2"><b>Ngày làm lại <span class="text-danger">(*)</span>:</b></div>
      <div class="col-9">
        <datepicker
          :disabled-dates="{to: new Date(resignDate)}"
          v-model="comebackDate"
          format="dd-MM-yyyy"
          :bootstrapStyling="true"
          :monday-first="true"
          :full-month-name="true"
          placeholder="Ngày đi làm lại"
          :calendar-button="true"
          calendar-button-icon="ion ion-md-calendar"
          :clear-button="true"
        />
      </div>
    </div>
    <div class="row mt-3">
        <div class="col-3"><b>Loại nghỉ <span class="text-danger">(*)</span>:</b></div>
        <div class="col-9">
            <b-form-radio-group v-model="quitWorkType" :options="quitWorkTypeOptions" @change="resetInfoResign"></b-form-radio-group>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-3"><b>Lý do <span class="text-danger">(*)</span>:</b></div>
        <div class="col-9">
            <b-form-checkbox-group v-model="reasons" stacked @input="genComebackDate">
                <template v-for="(reason, index) in (quitWorkType === 'resign' ? resignReasonOptions : quitWorkType === 'pause' ? pauseReasonOptions : quitWorkType === 'sabbatical' ? sabbaticalReasonOptions : [])">
                  <b-form-checkbox
                    :value="reason"
                    :key="index"
                    class="mt-1"
                    @change="formatReason"
                    v-if="reason.hadOfficialContract"
                  >
                    {{reason.text}}
                  </b-form-checkbox>
                </template>
            </b-form-checkbox-group>
            <b-form-checkbox class="mt-2"
                v-if="quitWorkType === 'resign'"
                v-model="other"
            >
              {{otherReason.desc}}
            </b-form-checkbox>
            <b-form-input class="mt-2" v-if="other" placeholder="Nhập lý do" v-model="otherReason.text"></b-form-input>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-3 mt-2"><b>Chi tiết lý do:</b></div>
        <div class="col-9">
            <b-form-textarea class="mt-2" placeholder="Nhập chi tiết lý do" rows="3" v-model="reasonDetail"></b-form-textarea>
        </div>
    </div>
    <div class="row mt-3" v-if="quitWorkType === 'resign'">
        <div class="col-3"><b>Hình thức <span class="text-danger">(*)</span>:</b></div>
        <div class="col-9">
            <b-form-radio-group v-model="resignType" :options="resignTypeOptions"></b-form-radio-group>
        </div>
    </div>
    <div class="row mt-4" v-if="resignType === 'nghi_ngang'">
        <div class="col-3"><b>Mức phạt</b></div>
        <div class="col-9">
            <b-form-radio-group v-model="fineType">
              <b-form-radio value="all">Không thanh toán lương</b-form-radio>
              <b-form-radio value="part">Phạt: <div class="resignFineWraper"><b-form-input type="number" max=100 v-model="resignFinePercent"></b-form-input></div> %</b-form-radio>
            </b-form-radio-group>
        </div>
    </div>
   <hr> <!-- footer -->
      <b-row v-show="!viewOnly">
        <b-col>
          <b-btn variant="default" v-show="resignInfo.resign_editable && (resignInfo.resign_date || resignInfo.regign_type)" @click="confirmUserComeback"> Hủy thông tin nghỉ việc </b-btn>
        </b-col>
        <b-col class="text-right">
          <button type="button" class="btn btn-secondary" @click="hideModal">Đóng</button>
          <button v-if="resignInfo.resign_date == undefined || resignInfo.resign_editable" type="button" class="btn btn-primary" @click="confirmAddUser">Cập nhật</button>
        </b-col>
      </b-row>
  </b-modal>
</template>

<style scoped lang="scss">
  .resignFineWraper {
    position: relative;
    display: inline-block;
    width: 80px;

    .form-control{
      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-60%)
    }

  }

</style>

<script>
import moment from 'moment'
import profileService from 'domain/services/profile-service'
import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-resign',

  components: {
    Datepicker
  },

  props: ['profileId', 'resignInfo', 'viewOnly'],

  data: () => ({
    resignDate: '', // ngày nghỉ
    comebackDate: null, // ngày đi làm lại
    quitWorkType: null, // kiểu nghỉ việc
    reasons: [],
    reasonDetail: '', // chi tiết lý do nghỉ
    resignType: null, // Hình thức nghỉ
    fineType: null, // loại phạt
    resignFinePercent: null, // phần trăm phạt
    quitWorkTypeOptions: [ // list kiểu nghỉ việc (hiện tại chỉ có tạm nghỉ với nghỉ hẳn)
      {text: 'Tạm nghỉ dài hạn', value: 'pause'},
      {text: 'Nghỉ hẳn', value: 'resign'}
      // {text: 'Nghỉ phép', value: 'sabbatical', disabled: true}
    ],
    resignReasonOptions: [ // list lý do nghỉ hẳn
      {text: 'Sức khỏe không đảm bảo', planInsurance: 'GH'},
      {text: 'Không đáp ứng được thời gian, địa điểm', planInsurance: 'GH'},
      {text: 'Không phù hợp với tính chất công việc', planInsurance: 'GH'},
      {text: 'Không phù hợp với môi trường, văn hóa', planInsurance: 'GH'},
      {text: 'Việc cá nhân/gia đình', planInsurance: 'GH'},
      {text: 'Định hướng công việc mới', planInsurance: 'GH'},
      {text: 'Cho nghỉ gian lận', planInsurance: 'GH'},
      {text: 'Chế độ, thu nhập không đảm bảo', planInsurance: 'GH'},
      {text: 'Năng lực yếu kém', planInsurance: 'GH'},
      {text: 'Hết HĐ/Thời vụ', planInsurance: 'GH'},
      {text: 'Nghỉ sinh (vi phạm thỏa thuận)', planInsurance: 'GH'},
      {text: 'Thái độ làm việc kém', planInsurance: 'GH'}
    ],
    pauseReasonOptions: [ // list lý do tạm nghỉ
      {text: 'Nghỉ chế độ thai sản', planInsurance: 'TS', hadOfficialContract: true}, // BHXH nghỉ thai sản
      {text: 'Nghỉ chế độ ốm đau', planInsurance: 'OF', hadOfficialContract: true}, // BHXH nghỉ do ốm đau
      {text: 'Nghỉ không lương dài hạn', planInsurance: 'KL'}, // BHXH nghỉ không lương
      {text: 'Nghỉ do thiên tai, dịch bệnh', planInsurance: 'GH'},
      {text: 'Nghỉ do tạm đình chỉ', planInsurance: 'GH'}
    ],
    sabbaticalReasonOptions: [
      {value: 'getMarred', text: 'Nhân sự kết hôn (nghỉ 3 ngày)', hadOfficialContract: true},
      {value: 'ChildMarred', text: 'Con cái kết hôn (Nghỉ 1 ngày)', hadOfficialContract: true},
      {value: 'mourning', text: 'Tứ thân, phụ mẫu mất (nghỉ 3 ngày)', hadOfficialContract: true},
      {value: 'annualSabbatical', text: 'Nghỉ phép thường niên', hadOfficialContract: true}
    ],
    resignTypeOptions: [ // list hình thức nghỉ
      {
        text: 'Nghỉ đúng quy trình',
        value: 'nghi_dung_quy_trinh'
      },
      {
        text: 'Nghỉ ngang',
        value: 'nghi_ngang'
      },
      {
        text: 'Sa thải',
        value: 'sa_thai'
      }
    ],
    other: false,
    otherReason: { // lý do nghỉ khác
      text: '',
      planInsurance: 'GH',
      desc: 'Khác'
    },
    savePauseWorkHistory: false
  }),

  created () {
  },

  watch: {
    resignDate (newVal, oldVal) {
      this.genComebackDate(this.reasons)
    }
  },

  methods: {
    genComebackDate (value) {
      if (!this.resignDate) {
        this.comebackDate = null
        return
      }
      if (value && value[0] && value[0].planInsurance === 'TS' && !this.comebackDate) this.comebackDate = moment(this.resignDate).add(4, 'M').format('YYYY-MM-DD')
    },

    formatReason (value) {
      if ((this.quitWorkType === 'pause' || this.quitWorkType === 'sabbatical') && value) this.reasons = [value]
    },

    resetInfoResign (value) {
      this.reasons = []
      if (value === 'resign') return
      this.resignType = null
      this.resignFinePercent = null
      this.fineType = null
      this.other = false
      this.resignFinePercent = null
      this.otherReason.text = null
    },

    hideModal () {
      this.$refs.refResign.hide()
    },

    resetModal () {
      if (this.resignInfo.resign_date || this.resignInfo.resign_type) {
        this.resignDate = this.resignInfo.resign_date
        this.quitWorkType = this.resignInfo.quit_work_type
        this.resignType = this.resignInfo.resign_type
        this.reasonDetail = this.resignInfo.resign_detail
        if (+this.resignInfo.resign_fine >= 100) {
          this.fineType = 'all'
          this.resignFinePercent = null
        } else {
          this.fineType = 'part'
          this.resignFinePercent = +this.resignInfo.resign_fine
        }

        // format lý do nghỉ việc
        let option = null
        this.reasons = []
        this.otherReason.text = ''
        this.resignInfo.resign_reason.forEach(reason => {
          let reasonOptions = this.resignReasonOptions
          if (this.quitWorkType === 'pause') reasonOptions = this.pauseReasonOptions
          option = reasonOptions.find(op => (op.text === reason))
          if (option) this.reasons.push(option)
          else if (this.quitWorkType === 'resign') {
            this.other = true
            this.otherReason.text += reason + ', '
          }
        })
      } else {
        this.quitWorkType = null
        this.resignDate = ''
        this.reasons = []
        this.resignType = null
      }
    },

    confirmAddUser () {
      this.$bvModal.msgBoxConfirm('Đây có phải là một thay đổi chính thức, cần lưu vào lịch sử quá trình công tác của nhân viên tại GHTK?', {
        title: 'Lưu lịch sử công tác',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'info',
        okTitle: 'Có',
        cancelTitle: 'Không',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(val => {
          this.savePauseWorkHistory = val
          this.resign()
        })
        .catch(err => {
          throw err
        })
    },

    confirmUserComeback () {
      this.$bvModal.msgBoxConfirm('Đây có phải là một thay đổi chính thức, cần lưu vào lịch sử quá trình công tác của nhân viên tại GHTK?', {
        title: 'Lưu lịch sử công tác',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'info',
        okTitle: 'Có',
        cancelTitle: 'Không',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(val => {
          this.savePauseWorkHistory = val
          this.cancelResign()
        })
        .catch(err => {
          throw err
        })
    },

    resign () {
      if (!this.profileId) {
        commonHelper.showMessage('Thiếu profile ID người nghỉ việc', 'warning')
        return
      }
      if (!this.resignDate) {
        commonHelper.showMessage('Thiếu ngày nghỉ việc', 'warning')
        return
      }
      if (!this.quitWorkType) {
        commonHelper.showMessage('Thiếu loại hình nghỉ', 'warning')
        return
      }
      if ((!this.reasons || this.reasons.length === 0) && (!this.other || !this.otherReason.text)) {
        commonHelper.showMessage('Thiếu lý do nghỉ việc', 'warning')
        return
      }
      let dataSend = {
        'id': this.profileId,
        'resign_date': moment(this.resignDate).format('YYYY-MM-DD'),
        'resign_reason': this.reasons,
        'resign_type': this.resignType,
        'resign_detail': this.reasonDetail,
        'quit_work_type': this.quitWorkType,
        'savePauseWorkHistory': this.savePauseWorkHistory
      }
      if (this.other) dataSend.resign_reason = dataSend.resign_reason.concat(this.otherReason)
      if (this.resignType === 'nghi_ngang' && this.fineType) dataSend['resign_fine'] = (this.fineType === 'all') ? 100 : this.resignFinePercent
      else dataSend['resign_fine'] = null
      if (!dataSend.resign_date || !dataSend.resign_reason || !dataSend.quit_work_type) {
        commonHelper.showMessage('Thiếu thông tin nghỉ việc', 'warning')
        return
      }
      profileService.resign(dataSend)
        .then(response => {
          this.$emit('notify', response.data)
          if (response.data.success) {
            this.resignInfo.resign_date = this.resignDate
            this.resignInfo.resign_reason = this.reasons
            this.resignInfo.resign_type = this.resignType
            this.resignInfo.resign_detail = this.reasonDetail
            this.hideModal()
            commonHelper.showMessage(response.data.message, 'success')
            setTimeout(() => { this.$router.go() }, 1000)
          }
        })
    },

    cancelResign () {
      if (!this.comebackDate) {
        commonHelper.showMessage('Thiếu ngày đi làm lại', 'warning')
        return
      }
      let dataSend = {
        'comebackDate': moment(this.comebackDate).format('YYYY-MM-DD'),
        'id': this.profileId,
        'savePauseWorkHistory': this.savePauseWorkHistory
      }
      profileService.cancelResign(dataSend)
        .then(response => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message, 'success')
            this.hideModal()
            setTimeout(() => { this.$router.go() }, 1000)
          } else {
            commonHelper.showMessage(response.data.message, 'warning')
          }
        })
    }
  }
}
</script>
