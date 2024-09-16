<template>
  <b-modal
    title="Kết quả"
    modal-class="modal-cus"
    id="modal-proposal-result"
    header-class="justify-content-center header-modal-custom"
    size="sm"
    @hidden="resetData()"
    hide-footer
    static
  >
    <div class="wrap-cus">
      <div class="container-cus" :style="isDisabled ? ' overflow-y: auto;' : ''">
        <div class="proposal-cus">
          <div class="title-cus mb-2">Kết quả quá trình thuyết phục NLĐ</div>
          <b-form-group>
            <b-form-radio v-show="(selected === '1' && isDisabled) || !isDisabled " v-model="selected" class="mt-2"   :disabled="isDisabled"  name="some-radios" value="1">{{ dataSelect[0].name }}</b-form-radio>
            <label v-if="selected === '1'" class="problems-cus">Cụ thể</label>
            <textarea
              :rows="(detailsProposal && detailsProposal.length > 50) ? 2 : 1"
              v-if="selected === '1' && !isDisabled"
              class="form-control"
              v-model="detailsProposal"
              :disabled="isDisabled"
            />
            <p v-if="selected === '1' && isDisabled" class="p-details">
            {{ detailsProposal }}
          </p>
            <b-form-radio v-show="(selected === '2' && isDisabled) || !isDisabled " v-model="selected" class="mt-2"   :disabled="isDisabled"  name="some-radios" value="2">{{ dataSelect[1].name }}</b-form-radio>
            <label v-if="selected === '2'" class="problems-cus">Cụ thể</label>
            <textarea
              :rows="(detailsProposal && detailsProposal.length > 50) ? 2 : 1"
              v-if="selected === '2' && !isDisabled"
              class="form-control"
              v-model="detailsProposal"
              :disabled="isDisabled"
            />
            <p v-if="selected === '2' && isDisabled" class="p-details">
            {{ detailsProposal }}
          </p>
          </b-form-group>
        </div>
      </div>
      <div class="confirm-cus">
        <b-btn :disabled="loading || isDisabled" :style="(isDisableBtn() || isDisabled)? 'background-color: #BDBDBD;' : 'background-color: #069255;'" variant="ghtk" class="btn-cus" @click="confirm()">Xác nhận</b-btn>
      </div>
    </div>
  </b-modal>

</template>

<script>

// import hrOrderService from 'domain/services/hr-order-service'
// import helper from 'infrastructures/helpers/common-helpers'

import Multiselect from 'vue-multiselect'
import commonHelpers from '../../../../../infrastructures/helpers/common-helpers'
import staffResignService from 'domain/services/staff-resign-service'
export default {
  name: 'ModalProposalResult',
  components: {
    Multiselect
  },
  data: _ => ({
    loading: false,
    isDisabled: false,
    data: [],
    selected: null,
    detailsProposal: '',
    dataRequest: {
      result: '',
      detail: ''
    },
    dataSelect: [
      {
        id: 1,
        name: 'NLĐ tiếp tục gắn bó',
        alias: 'keep_working'
      },
      {
        id: 2,
        name: 'Mong muốn nghỉ việc của NLĐ là chính đáng, đề xuất cho NLĐ nghỉ việc',
        alias: 'resign_properly'
      }
    ]
  }),
  props: {
    idHrOrder: null,
    dataResultPlan: null
  },
  computed: {
  },
  created () {

  },
  watch: {
    selected: function (oldVal, newVal) {
      if (!this.isDisabled) {
        this.detailsProposal = ''
      }
    },
    dataResultPlan: {
      immediate: true,
      handler: function (oldVal, newVal) {
        if (this.dataResultPlan && this.dataResultPlan.data && this.dataResultPlan.data.result) {
          let result = this.dataSelect.filter((item) => item.alias.toUpperCase().replaceAll(' ', '') === this.dataResultPlan.data.result.toUpperCase().replaceAll(' ', ''))
          if (result.length > 0) {
            this.selected = String(result[0].id)
          }
          this.detailsProposal = this.dataResultPlan.data.detail
        }
        if (this.dataResultPlan && this.dataResultPlan.stepStatus && this.dataResultPlan.stepStatus === 'completed') {
          this.isDisabled = true
        }
      },
      deep: true
    }
  },
  methods: {
    isDisableBtn () {
      if (!this.selected) {
        return true
      }
      return false
    },

    resetData () {
      this.detailsProposal = ''
      this.selected = null

      this.dataRequest.result = ''
      this.dataRequest.detail = ''
      this.isDisabled = false
    },
    convertData (data) {
      return data.map((item) => item.name).join(', ')
    },

    async confirm () {
      if (!this.validateDataAndConvertData()) { return }

      try {
        this.loading = true
        let data = {
          id: this.idHrOrder,
          type: 'event',
          event: 'confirm_result',
          data: this.dataRequest
        }
        const res = await staffResignService.updateStep(data)
        if (res.data.success) {
          this.resetData()
          this.$bvModal.hide('modal-proposal-result')
          this.$emit('success')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra khi gửi kết quả đề xuất', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi gửi kết quả đề xuất', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    validateDataAndConvertData () {
      // validate data

      if (!this.selected) {
        commonHelpers.showMessage('Vui lòng chọn phương án', 'warning')
        return false
      }

      if (!this.idHrOrder) {
        commonHelpers.showMessage('Không xác định được id của đề xuất', 'warning')
        return false
      }

      // convert data
      switch (this.selected) {
        case '1':
          this.dataRequest.result = 'keep_working'
          break
        case '2':
          this.dataRequest.result = 'resign_properly'
          break
      }

      this.dataRequest.detail = this.detailsProposal

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .modal-cus {
  .modal-dialog {
    max-width: 45.5rem !important;
    align-items: center;
    min-height: calc(100% - (1.75rem * 2));
    display: flex;
    -webkit-box-align: center;
  }
  .modal-header {
    height: 3rem !important;
  }
  .modal-title {
    line-height: 0.7 !important;
  }
  .close {
    display: inline-block !important;
    font-size: 1.5rem !important;
  }
}
.wrap-cus {
  font-size: 15px;
  color: black;
  .container-cus {
    margin-bottom: 0.5rem;
    max-height: 45rem;
    .title-cus {
      font-weight: 500;
      font-size: 16px;
    }
    .problems-cus {
      margin-top: 0.5rem;
    }
  }
}
.confirm-cus {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  .btn-cus {
    width: 12rem;
    height: 2.4rem;
    font-weight: 700;
    font-size: 16px;
  }
}
/deep/ .multiselect__tags {
  padding-left: 0.8rem !important;
}
/deep/ .custom-control-input:disabled ~ .custom-control-label {
  color: black !important;
}
.p-details {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border: 1px solid #BDBDBD;
  border-radius: 5px;
  background-color: #f1f1f2;
  color: #4E5155;
}
</style>
