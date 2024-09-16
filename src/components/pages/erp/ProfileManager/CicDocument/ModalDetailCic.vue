<template>
  <b-modal
    :title="dataDocsCic ? 'Chi tiết thông tin hồ sơ Thông tin tín dụng CIC' : 'Thông báo'"
    id="modal-detail-cic"
    modal-class="modal-approve-cic-docs"
    @shown="getDataCic"
    static
  >
    <b-form v-loading="loading">
      <div v-if="type === 'have_cic_data'">
        <div class="history-cus mb-3">
          <label>Lịch sử nợ xấu trong 5 năm gần nhất <span class="text-danger ml-1">*</span></label>
          <b-form-group>
            <b-form-radio class="d-inline-block mr-5 ml-2" disabled v-model="selected" name="some-radios" value="1">Có</b-form-radio>
            <b-form-radio class="d-inline-block" disabled v-model="selected" name="some-radios" value="0">Không</b-form-radio>
          </b-form-group>
        </div>

        <div class="credit-cus mb-3">
          <!--            Điểm tín dụng-->
          <div class="credit-score">
            <label>Điểm tín dụng</label>
            <div>
              <div style="font-weight: 700;">{{ dataDocsCic.credit_score }}</div>
            </div>
          </div>
          <!--            Hạng-->
          <div class="level">
            <label>Hạng</label>
            <div>
              <div style="font-weight: 700">{{ dataDocsCic.credit_level }}</div>
            </div>
          </div>
          <!--            Ngày chấm điểm-->
          <div class="date">
            <label>Ngày chấm điểm</label>
            <div>
              <div style="font-weight: 700">{{ dataDocsCic.grading_date }}</div>
            </div>
          </div>
        </div>

        <!--        Thông tin tín dụng-->
        <div class="info-cus">
          <div class="label-head">Thông tin tín dụng</div>
          <div v-if="data_current_cic">
            <!--            Tổng tiền nợ xấu-->
            <div class="total-money-bad-debt">
              <label for="">Tổng tiền nợ xấu <span class="text-danger ml-1">*</span></label>
              <div class="div-right">
                <div class="money">
                  <b-input
                    disabled="disabled"
                    class="input-first"
                    v-model="dataDocsCic.bad_debt_vnd"
                    @input="convertMoney(dataDocsCic.bad_debt_vnd, 'bad_debt_vnd')"
                  >
                  </b-input>
                  <span>VNĐ</span>
                </div>
                <div class="money">
                  <b-input
                    disabled="disabled"
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
                  disabled="disabled"
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
                    disabled="disabled"
                    class="input-first"
                    v-model="dataDocsCic.ordinary_debt_vnd"
                    @input="convertMoney(dataDocsCic.ordinary_debt_vnd, 'ordinary_debt_vnd')"
                  ></b-input>
                  <span>VNĐ</span>
                </div>
                <div class="money">
                  <b-input
                    disabled="disabled"
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
                  disabled="disabled"
                  v-model="dataDocsCic.number_ordinary_debt_banks"
                ></b-input>
              </div>
            </div>

          </div>
          <div v-else>
            <p>Hiện tại khách hàng không còn dư nợ tại các TCTD</p>
          </div>
          <div v-if="dataDocsCic">
            <div class="total-bank-last5years-debt">
              <label for="">Tổng số ngân hàng nợ xấu 5 năm gần nhất<span class="text-danger ml-1">*</span></label>
              <div class="div-right">
                <b-input
                  disabled="disabled"
                  v-model="dataDocsCic.number_bad_debt_banks_5_year"
                ></b-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-file" v-else>
        <div v-if="message">
          {{message}}
        </div>
      </div>
      <div class="cic-note">
        <div v-if="dataDocsCic.note">
          <span style="font-weight: bold">Ghi chú: </span>
          <span>{{dataDocsCic.note}}</span>
        </div>
      </div>
    </b-form>
    <template slot="modal-footer">
      <div></div>
    </template>
  </b-modal>
</template>

<script>
import Moment from 'moment'

import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

import profileService from 'domain/services/profile-service'
import documentService from 'domain/services/Erp/document-service'
import commonHelpers from '../../../../../infrastructures/helpers/common-helpers'

export default {
  name: 'modal-detail-cic',
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
      type: 'have_data_cic'
    }
  },
  methods: {
    async onClose () {
      this.reset()
    },
    reset () {
    },

    getDataCic: async function () {
      this.message = 'Hiện tại kho CIC không có thông tin tín dụng về khách hàng.'
      this.loading = true
      try {
        const res = await documentService.getDataCic({
          'profile_document_id': this.profileDocumentId
        })
        if (res.data.success) {
          this.convertDataCic(res.data.data)
        } else {
          this.type = 'no_data_cic'
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    convertDataCic (data) {
      this.type = data.type
      if (data.note) {
        this.dataDocsCic.note = data.note
      }
      if (data && data.type === 'invalid_id_number') {
        this.message = 'Không tìm thấy file CIC ứng với số CMND/CCCD của user ' + (this.user && this.user.username) + '. Vui lòng liên hệ với NLĐ để kiểm tra lại.'
        return
      } else if (this.type === 'can_not_read_cic') {
        this.message = 'Lỗi không đọc được file CIC. Vui lòng kiểm tra lại và đảm bảo file tải lên đúng định dạng và đúng nội dung yêu cầu.'
        return
      } else if (this.type === 'data_being_processed') {
        this.message = 'File CIC đang được xử lý vui lòng chờ ít phút '
        return
      } else if (this.type === 'no_data_cic') {
        this.message = 'Hiện tại kho CIC không có thông tin tín dụng về khách hàng.'
        return
      }
      this.data_current_cic = 1
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

      if (data.note) {
        this.dataDocsCic.note = data.note
      }

      // có nợ xấu
      if (data.credit_score) {
        this.dataDocsCic.credit_score = +data.credit_score
      }

      if (data.credit_level) {
        this.dataDocsCic.credit_level = +data.credit_level
      }

      if (data.grading_date) {
        var timestamp = Date.parse(data.grading_date)
        this.dataDocsCic.grading_date = this.dateToString(new Date(timestamp), 'd-m-Y')
      }

      if (data.bad_debt_vnd) {
        this.convertMoney(data.bad_debt_vnd, 'bad_debt_vnd')
      }
      if (data.bad_debt_usd) {
        this.convertMoney(data.bad_debt_usd, 'bad_debt_usd')
      }

      if (data.number_bad_debt_banks) {
        this.dataDocsCic.number_bad_debt_banks = +data.number_bad_debt_banks
      }

      if (data.ordinary_debt_vnd) {
        this.convertMoney(data.ordinary_debt_vnd, 'ordinary_debt_vnd')
      }

      if (data.ordinary_debt_usd) {
        this.convertMoney(data.ordinary_debt_usd, 'ordinary_debt_usd')
      }

      if (data.number_ordinary_debt_banks) {
        this.dataDocsCic.number_ordinary_debt_banks = +data.number_ordinary_debt_banks
      }

      if (data.number_bad_debt_banks_5_year) {
        this.selected = (+data.number_bad_debt_banks_5_year > 0) ? 1 : 0
        this.dataDocsCic.number_bad_debt_banks_5_year = +data.number_bad_debt_banks_5_year
      }

      if (+data.bad_debt_vnd === 0 && +data.bad_debt_usd === 0 && +data.ordinary_debt_vnd === 0 && +data.ordinary_debt_usd === 0) {
        this.data_current_cic = 0
      }
    },

    dateToString (date, format = 'Y-m-d') {
      if (format === 'Y-m-d') {
        return date.getFullYear() + '-' + (String(date.getMonth() + 1).padStart(2, '0')) + '-' + (String(date.getDate()).padStart(2, '0'))
      } else if (format === 'd-m-Y') {
        return (String(date.getDate()).padStart(2, '0')) + '-' + (String(date.getMonth() + 1).padStart(2, '0')) + '-' + date.getFullYear()
      }
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

    clearModal () {
      this.message = ''
      this.type = 'have_cic_data'
      this.loading = false
      this.selected = 0
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
  .cic-note {
    margin-top: 10px;
  }
}
.modal-footer {
  padding: 1rem !important;
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
      text-align: left;
      margin-left: 1.5rem;
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
