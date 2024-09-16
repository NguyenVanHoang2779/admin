<template>
    <div>
        <b-modal id="modal-recompense" hide-footer ref="modalRecompense" @hide="reset(1)" @show="setDateDefault" hide-header static>
            <b-tabs card v-model="tabIndex">
                <b-tab no-body title="Phạt thẻ" @click="reset(1)">
                    <div class="recompense-container">
                        <b-form-group label="Loại hình" class="pd-t-5">
                            <b-form-radio-group
                                    id="radio-group-1"
                                    v-model="recompense.penalty_card"
                                    :options="optionPenance"
                                    name="penalty_card-options"
                            ></b-form-radio-group>
                        </b-form-group>
                        <b-form-group label="Mức phạt" class="pd-t-5">
                            <b-form-radio-group
                                    id="radio-morale-1"
                                    v-model="recompense.recompense_morale"
                                    :options="optionPenanceLevel"
                                    name="recompense_morale-options"
                            ></b-form-radio-group>

                            <div class="row" v-if="recompense.recompense_morale == 2 && recompense.type == 1">
                                <div class="col-3">
                                    <b-form-input type="number" :min="0" class="only-bottom-border" v-model="suggestion"></b-form-input>
                                </div>
                                <div class="col-3 position-relative">
                                    <b-form-select
                                            v-model="typeSuggest"
                                            :options="optionMoney"
                                            class="position-absolute bottom-0 only-bottom-border"
                                    ></b-form-select>
                                </div>
                            </div>
                        </b-form-group>
                        <b-form-group label="Nội dung" class="pd-t-5">
                             <b-form-select
                                  v-model="penanceContent"
                                  :options="optionPenanceContent"
                                  class=" bottom-0 only-bottom-border"
                                ></b-form-select>
                        </b-form-group>
                        <b-row>
                            <b-col class="col-md-6">
                                <b-form-group label="Ngày bắt đầu" id="input-group-start">
                                    <b-form-input id="start-date" type="date" v-model="recompense.start_date"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col class="col-md-6">
                                <b-form-group label="Ngày kết thúc" id="input-group-end">
                                    <b-form-input id="start-date" type="date" v-model="recompense.end_date"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <div>
                            <b-form-group label="Lý do thưởng/phạt" id="input-group-descrip">
                                <b-form-input type="text" class="only-bottom-border" v-model="recompense.descrip" placeholder="Nhập lý do thưởng/phạt"></b-form-input>
                            </b-form-group>
                        </div>
                    </div>
                </b-tab>

                <b-tab no-body title="Khen thưởng" lazy @click="reset(2)">
                    <div class="recompense-container">
                        <b-form-group label="Loại hình" class="pd-t-5">
                            <b-form-radio-group
                                    id="radio-group-reward"
                                    v-model="recompense.reward_type"
                                    :options="optionReward"
                                    name="reward-options"
                            ></b-form-radio-group>
                        </b-form-group>
                        <b-form-group label="Mức thưởng" class="pd-t-5">
                            <b-form-radio-group
                                    id="radio-group-morale-2"
                                    v-model="recompense.recompense_morale"
                                    :options="optionRewardLevel"
                                    name="recompense_morale-options-2"
                            ></b-form-radio-group>
                            <div class="row" v-if="recompense.recompense_morale === 2 && recompense.type === 2">
                                <div class="col-3">
                                    <b-form-input type="number" :min="0" class="only-bottom-border" v-model="suggestion"></b-form-input>
                                </div>
                                <div class="col-3 position-relative">
                                    <b-form-select
                                            v-model="typeSuggest"
                                            :options="optionMoney"
                                            class="position-absolute bottom-0 only-bottom-border"
                                    ></b-form-select>
                                </div>
                            </div>
                        </b-form-group>
                        <b-form-group label="Nội dung" class="pd-t-5">
                             <b-form-select
                                  v-model="rewardContent"
                                  :options="optionRewardContent"
                                  class=" bottom-0 only-bottom-border"
                                ></b-form-select>
                        </b-form-group>
                        <b-row>
                            <b-col class="col-md-6">
                                <b-form-group label="Ngày bắt đầu" id="input-group-start">
                                    <b-form-input id="start-date" type="date" v-model="recompense.start_date"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col class="col-md-6">
                                <b-form-group label="Ngày kết thúc" id="input-group-end">
                                    <b-form-input id="end-date" type="date" v-model="recompense.end_date"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <div>
                            <b-form-group label="Lý do thưởng/phạt" id="input-group-descrip" class="pd-t-5">
                                <b-form-checkbox-group
                                        id="radio-group-reason"
                                        v-model="recompense.recompense_reason"
                                        :options="optionReasonLevel"
                                        name="recompense_reason-options"
                                ></b-form-checkbox-group>
                                <b-form-input :disabled="isDisable" type="text" class="only-bottom-border" v-model="recompense.descrip" placeholder="Nhập lý do thưởng/phạt"></b-form-input>
                            </b-form-group>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>

            <b-button block variant="success" @click="addRecompense">Xác nhận</b-button>
        </b-modal>
    </div>
</template>

<script>
import evaluationService from 'domain/services/evaluation-service'
import cycleTime from 'infrastructures/helpers/date.js'
import commonHelper from 'infrastructures/helpers/common-helpers'
import { mapGetters } from 'vuex'

export default {
  name: 'modal-recompense',

  components: {
    evaluationService
  },

  props: [
    'userId'
  ],

  data: () => ({
    optionReward: [
      { value: 1, text: 'Thưởng nóng' },
      { value: 2, text: 'Ngôi sao tháng' }
    ],

    optionPenance: [
      { value: 1, text: 'Thẻ vàng' },
      { value: 2, text: 'Thẻ đỏ' }
    ],
    optionPenanceLevel: [
      { value: 1, text: 'Cảnh cáo' },
      { value: 2, text: 'Phạt tiền' }
    ],
    optionRewardLevel: [
      { value: 1, text: 'Tuyên dương' },
      { value: 2, text: 'Thưởng tiền' }
    ],
    optionMoney: [
      { value: 2, text: '% Lương' },
      { value: 1, text: 'VNĐ' }
    ],
    optionReasonLevel: [
      { value: 1, text: 'Thưởng từ mạng xã hội' }
    ],
    optionRewardContent: [
      { value: null, text: 'Chọn loại thưởng' },
      { value: 'hieu_qua', text: 'Hiệu quả công việc' },
      { value: 'trien_khai', text: 'Triển khai dự án mới' },
      { value: 'ho_tro', text: 'Hỗ trợ tích cực' },
      { value: 'dong_gop', text: 'Đóng góp văn hóa' },
      { value: 'vuot_kho', text: 'Vượt khó' },
      { value: 'sang_tao', text: 'Cải tiến, sáng tạo' },
      { value: 'top_sao', text: 'Top vote 5 sao/KH khen trên MXH' },
      { value: 'khac', text: 'Khác' }
    ],
    optionPenanceContent: [
      { value: null, text: 'Chọn loại phạt' },
      { value: 'ky_luat', text: 'Kỷ luật' },
      { value: 'trung_thuc', text: 'Trung thực' },
      { value: 'trach_nhiem', text: 'Tinh thần trách nhiệm' },
      { value: 'khac', text: 'Khác' }
    ],
    typeSuggest: 1,
    penanceContent: null,
    rewardContent: null,
    suggestion: null,
    recompense: {
      user_id: '',
      start_date: null,
      end_date: null,
      type: 1,
      penalty_card: null,
      reward_type: null,
      recompense_reason: null,
      recompense_morale: null,
      suggest_money: null,
      suggest_percent: null,
      medal: null,
      descrip: ''
    },
    isDisable: false,
    tabIndex: 0
  }),

  created () {
    this.setDateDefault()
  },

  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },

  watch: {
    recompense: {
      deep: true,
      handler (newVal, oldVal) {
        if (this.recompense.recompense_reason != null && this.recompense.recompense_reason[0] === 1) {
          this.isDisable = true
        } else {
          this.isDisable = false
        }
      }
    },

    userInfo: function (newValue, oldValue) {
      if (newValue && +newValue.ErpPosition.id === 154) {
        this.optionReward.push({ value: 3, text: 'Thưởng cống hiến' })
      }
    }
  },

  methods: {
    setDateDefault: function () {
      this.recompense.start_date = cycleTime.daysInCycleEvaluation().from
      this.recompense.end_date = cycleTime.daysInCycleEvaluation().to
    },

    addRecompense: function () {
      let data = {
        user_id: this.userId,
        type: this.recompense.type,
        penalty_card: this.recompense.penalty_card,
        reward_type: this.recompense.reward_type,
        recompense_reason: Array.isArray(this.recompense.recompense_reason) ? this.recompense.recompense_reason[0] : null,
        recompense_morale: this.recompense.recompense_morale != null ? this.recompense.recompense_morale : null,
        suggest_money: this.recompense.suggest_money,
        suggest_percent: this.recompense.suggest_percent,
        medal: this.recompense.medal,
        descrip: this.recompense.recompense_reason != null && this.recompense.recompense_reason[0] === 1 ? 'Thưởng từ mạng xã hội' : this.recompense.descrip,
        start_date: this.recompense.start_date || cycleTime.daysInCycleEvaluation().from,
        end_date: this.recompense.end_date || cycleTime.daysInCycleEvaluation().to,
        sub_type: this.recompense.type === 1 ? this.penanceContent : this.rewardContent
      }
      if (this.typeSuggest === 1) {
        this.$set(data, 'suggest_money', this.suggestion)
      } else {
        this.$set(data, 'suggest_percent', this.suggestion)
      }

      let validate = this.validateData(data)

      if (validate.status) {
        evaluationService.addRecompense(data)
          .then(res => {
            if (res.data.success) {
              commonHelper.showMessage(res.data.message, 'success')
              this.$emit('update-recompense')
              this.hideModal()
            } else {
              commonHelper.showMessage(res.data.message, 'warning')
            }
          })
          .catch(e => {
            console.log(e)
          })
          .then(() => {
            this.appLoading = false
          })
      } else {
        this.$notify({
          group: 'default',
          type: 'text-white bg-warning',
          title: 'Xảy ra lỗi',
          text: validate.message
        })
      }
    },

    validateData (data) {
      if (this.recompense.recompense_morale === 2) {
        if (data.suggest_money && data.suggest_money <= 0) return {status: false, message: 'Số tiền không hợp lệ'}
        if (data.suggest_percent && data.suggest_percent <= 0) return {status: false, message: 'Phần trăm phạt lương không hợp lệ'}
      }

      if (data.type === 1 && data.descrip.length < 50) {
        return {status: false, message: 'Lý do phạt không được dưới 50 ký tự'}
      }

      if (data.type === 2 && data.recompense_reason !== 1 && data.descrip.length < 50) {
        return {status: false, message: 'Lý do thưởng không được dưới 50 ký tự'}
      }

      return { status: true }
    },

    hideModal () {
      this.tabIndex = 0
      this.$refs.modalRecompense.hide()
    },

    updateEvaluation: function () {
      this.$emit('update-evaluation')
    },

    reset (val) {
      this.typeSuggest = 1
      this.suggestion = null
      this.penanceContent = null
      this.rewardContent = null
      this.recompense = {
        user_id: '',
        start_date: null,
        end_date: null,
        penalty_card: null,
        reward_type: null,
        recompense_morale: null,
        suggest_money: null,
        suggest_percent: null,
        medal: null,
        descrip: ''
      }
      if (typeof val !== 'undefined') {
        this.recompense.type = val
        this.setDateDefault()
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .only-bottom-border{
        border-top: none;
        border-left: none;
        border-right: none;
    }
    .margin-top-10 {
        margin-top: 10px;
    }
    .bottom-0 {
        bottom: 0;
    }
    .right-15 {
        right: 15px;
    }
    .recompense-container {
        padding: 10px;
        margin-top: 10px;
    }
    .pd-t-5 {
        padding-top: 5px;
    }
</style>
