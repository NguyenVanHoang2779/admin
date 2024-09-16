<template>
  <b-modal
    :title="'Xác nhận duyệt hồ sơ Thông tin tín dụng CIC'"
    id="modal-approve-cic-backup"
    modal-class="modal-approve-cic-docs"
    static
    @hidden="clearModal"
  >
    <b-form v-loading="loading">
      <div>
        <div class="history-cus mb-3">
          <label>Lịch sử nợ xấu trong 5 năm gần nhất <span class="text-danger ml-1">*</span></label>
          <b-form-group>
            <b-form-radio class="d-inline-block mr-5 ml-2" v-model="selected" name="some-radios" value="1">Có</b-form-radio>
            <b-form-radio class="d-inline-block" v-model="selected" name="some-radios" value="0" >Không</b-form-radio>
          </b-form-group>
        </div>

        <div class="credit-cus mb-3">
          <!--            Điểm tín dụng-->
          <div class="credit-score">
            <label>Điểm tín dụng</label>
            <div>
              <b-input v-model="dataDocsCic.credit_score"></b-input>
            </div>
          </div>
          <!--            Hạng-->
          <div class="level">
            <label>Hạng</label>
            <div>
              <div>
                <b-input
                  v-model="dataDocsCic.credit_level">
                </b-input>
              </div>
            </div>
          </div>
          <!--            Ngày chấm điểm-->
          <div class="date">
            <label>Ngày chấm điểm</label>
            <div>
              <div>
                <v-date-picker
                  class="date-cus"
                  :popover="{visibility: 'focus'}"
                  mode="date"
                  format='dd-MM-yyyy'
                  v-model="dataDocsCic.grading_date"
                  locale="vi"
                  color="green"
                  :input-props="{ placeholder: '', style: 'font-size: 0.894rem !important; color: #4E5155 !important;'}"
                />
              </div>

            </div>

          </div>
        </div>

        <!--        Thông tin tín dụng-->

        <div class="info-cus">
          <div class="label-head">Thông tin tín dụng</div>
          <div>
            <!--            Tổng tiền nợ xấu-->
            <div class="total-money-bad-debt">
              <label for="">Tổng tiền nợ xấu <span class="text-danger ml-1">*</span></label>
              <div class="div-right">
                <div class="money">
                  <b-input
                    class="input-first"
                    v-model="dataDocsCic.bad_debt_vnd"
                    @input="convertMoney(dataDocsCic.bad_debt_vnd, 'bad_debt_vnd')"
                  >
                  </b-input>
                  <span>VNĐ</span>
                </div>
                <div class="money">
                  <b-input
                    v-model="dataDocsCic.bad_debt_usd"
                    @input="convertMoney(dataDocsCic.bad_debt_usd, 'bad_debt_usd')"
                  >
                  </b-input>
                  <span>USD</span>
                </div>
              </div>
            </div>

            <!--            Tổng số ngân hàng đang nợ xấu-->
            <div class="total-bank-current">
              <label for="">Tổng số ngân hàng đang nợ xấu<span class="text-danger ml-1">*</span></label>
              <div class="div-right">
                <b-input
                  class="input-first"
                  v-model="dataDocsCic.number_bad_debt_banks"
                ></b-input>
              </div>
            </div>

            <!--            Tổng số tiền nợ thường-->
            <div class="total-money-ordinary-debt">
              <label for="">Tổng số tiền nợ thường<span class="text-danger ml-1">*</span></label>
              <div class="div-right">
                <div class="money">
                  <b-input
                    class="input-first"
                    v-model="dataDocsCic.ordinary_debt_vnd"
                    @input="convertMoney(dataDocsCic.ordinary_debt_vnd, 'ordinary_debt_vnd')"
                  ></b-input>
                  <span>VNĐ</span>
                </div>
                <div class="money">
                  <b-input
                    v-model="dataDocsCic.ordinary_debt_usd"
                    @input="convertMoney(dataDocsCic.ordinary_debt_usd, 'ordinary_debt_usd')"
                  ></b-input>
                  <span>USD</span>
                </div>
              </div>
            </div>
            <!--            Tổng số ngân hàng nợ thường-->

            <div class="total-bank-ordinary-debt">
              <label for="">Tổng số ngân hàng đang nợ thường<span class="text-danger ml-1">*</span></label>
              <div class="div-right">
                <b-input
                  v-model="dataDocsCic.number_ordinary_debt_banks"
                ></b-input>
              </div>
            </div>

          </div>
          <div>
            <div class="total-bank-last5years-debt">
              <label for="">Tổng số ngân hàng nợ xấu 5 năm gần nhất<span class="text-danger ml-1">*</span></label>
              <div class="div-right">
                <b-input
                  v-model="dataDocsCic.number_bad_debt_banks_5_year"
                ></b-input>
              </div>
            </div>
          </div>
          <div class="cic-note">
            <label for="" style="font-weight: bold">Ghi chú</label>
            <div class="div-right">
              <div class="cic-note-content" style="margin-left: 0.7rem">
                <b-input
                  class="input-first"
                  v-model="dataDocsCic.note"
                ></b-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-form>
    <template slot="modal-footer">
      <button id="confirm-cic-btn" type="button" class="btn btn-success" @click="save()">Xác nhận</button>

    </template>
  </b-modal>
</template>

<script>
import Moment from 'moment'
// import commonHelpers from 'infrastructures/helpers/common-helpers'

import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

import profileService from 'domain/services/profile-service'
import documentService from 'domain/services/Erp/document-service'
import commonHelpers from '../../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'modal-approve-cic-backup',
  components: {
    Moment,
    Datepicker,
    profileService
  },
  props: {
    profileDocumentId: null,
    user: null
  },
  data () {
    return {
      loading: false,
      selected: 0,
      language: {
        vi: vi
      },
      message: null,
      dataDocsCic: {
        bad_debt: 0,
        credit_score: 0,
        credit_level: 0,
        grading_date: null,
        bad_debt_vnd: 0,
        bad_debt_usd: 0,
        number_bad_debt_banks: 0,
        ordinary_debt_vnd: 0,
        ordinary_debt_usd: 0,
        number_ordinary_debt_banks: 0,
        number_bad_debt_banks_5_year: 0,
        note: ''
      },
      data_current_cic: 1,
      showNumberBadDebtBanks5Year: false
    }
  },
  watch: {
  },
  methods: {
    async onClose () {
      this.reset()
    },
    reset () {
    },

    convertMoney (money, type) {
      if (typeof money !== 'string') {
        money = String(money)
      }
      let locationDot = money.indexOf(',')
      if (locationDot !== 0) {
        money = money.replaceAll(',', '')
      }
      money = Number(money).toLocaleString('en-US')

      switch (type) {
        case 'bad_debt_vnd':
          this.dataDocsCic.bad_debt_vnd = money
          break
        case 'bad_debt_usd':
          this.dataDocsCic.bad_debt_usd = money
          break
        case 'ordinary_debt_vnd':
          this.dataDocsCic.ordinary_debt_vnd = money
          break
        case 'ordinary_debt_usd':
          this.dataDocsCic.ordinary_debt_usd = money
          break
        default:
          break
      }
    },

    convertMoneyToNumber (money) {
      if (typeof money !== 'string') {
        money = String(money)
      }
      let locationDot = money.indexOf('.')
      if (locationDot !== 0) {
        money = money.replaceAll(',', '')
      }
      return money
    },

    async save () {
      this.loading = true
      document.getElementById('confirm-cic-btn').disabled = true
      try {
        let dataUpload = {}
        var dataCic = {...this.dataDocsCic}
        dataCic.bad_debt_vnd = this.convertMoneyToNumber(dataCic.bad_debt_vnd)
        dataCic.bad_debt_usd = this.convertMoneyToNumber(dataCic.bad_debt_usd)
        dataCic.ordinary_debt_vnd = this.convertMoneyToNumber(dataCic.ordinary_debt_vnd)
        dataCic.ordinary_debt_usd = this.convertMoneyToNumber(dataCic.ordinary_debt_usd)
        dataCic.grading_date = dataCic.grading_date ? this.dateToString(dataCic.grading_date) : null
        dataUpload = {...dataCic, ...{'profile_document_id': this.profileDocumentId}}

        const res = await documentService.apiApproveDocument(dataUpload)

        if (res.data.success) {
          commonHelpers.showMessage('Thành công', 'success')
          this.$emit('approved')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        document.getElementById('confirm-cic-btn').disabled = false
        this.loading = false
      }
    },

    dateToString (date, format = 'Y-m-d') {
      if (format === 'Y-m-d') {
        return date.getFullYear() + '-' + (String(date.getMonth() + 1).padStart(2, '0')) + '-' + (String(date.getDate()).padStart(2, '0'))
      } else if (format === 'd-m-Y') {
        return (String(date.getDate()).padStart(2, '0')) + '-' + (String(date.getMonth() + 1).padStart(2, '0')) + '-' + date.getFullYear()
      }
    },

    closeModal () {
      this.clearModal()
      this.$bvModal.hide('modal-approve-cic-backup')
    },

    reConfirm () {
      this.closeModal()
      this.$bvModal.show('')
    },

    clearModal () {
      this.message = ''
      this.loading = false
      this.selected = 0
      this.language = {
        vi: vi
      }
      this.dataDocsCic = {
        bad_debt: 0,
        credit_score: 0,
        credit_level: 0,
        grading_date: null,
        bad_debt_vnd: 0,
        bad_debt_usd: 0,
        number_bad_debt_banks: 0,
        ordinary_debt_vnd: 0,
        ordinary_debt_usd: 0,
        number_ordinary_debt_banks: 0,
        number_bad_debt_banks_5_year: 0,
        note: ''
      }
      this.data_current_cic = 1
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .modal-approve-cic-docs {
  .modal-footer {
    padding: 0 1rem 1.2rem 1rem !important;
  }
  .modal-dialog {
    margin-top: -1rem;
    max-width: 42.5rem !important;
    align-items: center;
    min-height: calc(100% - (1.75rem * 2));
    display: flex;
    -webkit-box-align: center;
  }
  .modal-header {
    height: 3rem !important;
  }
  .modal-body {
    padding: 1rem 1.5rem !important;
  }
  .modal-footer {
    justify-content: center !important;
    border-top: none !important;
  }
  .modal-title {
    line-height: 0.7 !important;
  }
  .close {
    display: inline-block !important;
    font-size: 1.5rem !important;
  }
}
#confirm-cic-btn {
  background-color: #069255;
}

.history-cus {
  label {
    font-weight: 600;
  }
}

.credit-cus {
  display: flex;
  label {
    font-weight: 700;
    color: #00904A;
  }
  .credit-score, .level, .date {
    text-align: center;
    input {
      border: none !important;
      border-bottom: 1px solid #ccc !important;
      text-align: center;
      font-weight: 700;
      width: 34%;
      margin-left: 1.5rem;
    }
  }

  .credit-score {
    width: 20%;
    text-align: center;
    margin-right: 4rem;
    label {
      margin-left: 0.7rem;
    }
    input {
      margin-left: 1.5rem;
      width: 80px;
      text-align: center;
    }
  }
  .level {
    width: 35%;
    margin-right: 4rem;
    input {
      display: inline-block;
    }
  }
  .date {
    text-align: center;
    /deep/ .date-cus input {
      width: 9rem;
      border: none !important;
      border-bottom: 1px solid #ccc !important;
      text-align: center;
      font-weight: 700;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    /deep/ .date-cus .vdp-datepicker__clear-button {
      display: none;
    }
    /deep/ .date-cus .vdp-datepicker__calendar {
      width: 16rem !important;
    }
    .vdp-datepicker__calendar .selected {
      background: green !important;
      color: #fff !important;
    }
  }
}

.info-cus {
  .label-head {
    font-weight: 600;
    margin-bottom: 1rem;
  }
  label {
    margin-left: 0.7rem;
  }
  .total-money-bad-debt, .total-bank-current, .total-money-ordinary-debt, .total-bank-ordinary-debt, .total-bank-last5years-debt {
    display: flex;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #E5E5E5;
    label {
      width: 28%;
    }
    .div-right {
      width: 70%;
      margin-left: 7rem;
      .input-first {
        margin-bottom: 0.5rem;
      }
    }
  }
  .total-money-bad-debt {
    border-top: none;
    padding-top: 0rem;
  }
}

.money {
  position: relative;
  span {
    position: absolute;
    font-weight: 500;
    top: 0.6rem;
    right: 0.6rem;
  }
}

.no-file {
  display: flex;
  .notice-cus {
    margin-left: 0.5rem;
    font-style: italic;
  }
}
</style>
