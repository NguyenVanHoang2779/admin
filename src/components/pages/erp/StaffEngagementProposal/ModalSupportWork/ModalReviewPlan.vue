<template>
  <b-modal
    title="Review phương án"
    modal-class="modal-cus"
    id="modal-review-plan"
    header-class="justify-content-center header-modal-custom"
    size="sm"
    @hidden="resetData()"
    hide-footer
    static
  >
    <div class="wrap-cus">
      <div class="container-cus" :style="isDisabled ? ' overflow-y: auto;' : ''">
        <div class="proposal-cus">
          <div class="title-cus mb-2">Kết quả sau khi thuyết phục NLĐ</div>
          <b-form-group>
            <b-form-radio v-show="(selected === '1' && isDisabled) || !isDisabled" v-model="selected" class="mt-2" :disabled="isDisabled"  name="some-radios" value="1">{{ dataSelect[0].name }}</b-form-radio>
            <label v-if="selected === '1'" class="problems-cus">Cụ thể</label>
            <textarea
              :rows="(detail && detail.length > 50) ? 2 : 1"
              v-if="selected === '1' && !isDisabled"
              class="form-control"
              v-model="detail"
              placeholder="Nhập"
              :disabled="isDisabled"
            />
             <p v-if="selected === '1' && isDisabled" class="p-details">
            {{ detail }}
          </p>
            <b-form-radio v-show="(selected === '2' && isDisabled) || !isDisabled" v-model="selected" class="mt-2" :disabled="isDisabled"  name="some-radios" value="2">{{ dataSelect[1].name }}</b-form-radio>
            <label v-if="selected === '2'" class="problems-cus">Cụ thể</label>
            <textarea
              :rows="(detail && detail.length > 50) ? 2 : 1"
              v-if="selected === '2' && !isDisabled"
              class="form-control"
              v-model="detail"
              placeholder="Nhập"
              :disabled="isDisabled"
            />
             <p v-if="selected === '2' && isDisabled" class="p-details">
            {{ detail }}
          </p>
            <b-form-radio v-show="(selected === '3' && isDisabled) || !isDisabled" v-model="selected" class="mt-2 mb-2" :disabled="isDisabled"  name="some-radios" value="3">{{ dataSelect[2].name }}</b-form-radio>
            <Multiselect
              v-if="selected === '3' && !isDisabled"
              class="mb-2"
              v-model="listSolutionSelected"
              :options="listSolutions"
              :multiple="true"
              placeholder="Chọn"
              label="name"
              track-by="id"
              selected-label=""
              deselect-label="X"
              select-label="Chọn"
              :hide-selected="true"
              :close-on-select="true"
              :disabled="isDisabled"
              @input="handleSelectedSolution"
            >
              <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
            </Multiselect>
            <textarea
              :rows="(detailsProposal && detailsProposal.length > 50) ? 2 : 1"
              v-if="selected === '3' && !isDisabled"
              class="form-control"
              v-model="detailsProposal"
              placeholder="Chi tiết"
              :disabled="isDisabled"
            />
             <p v-if="selected === '3' && isDisabled" class="p-details">
            {{ detailsProposal }}
          </p>
            <b-form-radio v-show="(selected === '4' && isDisabled) || !isDisabled" v-model="selected" class="mt-2" :disabled="isDisabled"  name="some-radios" value="4">{{ dataSelect[3].name }}</b-form-radio>
            <label v-if="selected === '4'" class="problems-cus">Cụ thể</label>
            <textarea
              :rows="(detail && detail.length > 50) ? 2 : 1"
              v-if="selected === '4' && !isDisabled"
              class="form-control"
              v-model="detail"
              placeholder="Nhập"
              :disabled="isDisabled"
            />
             <p v-if="selected === '4' && isDisabled" class="p-details">
            {{ detail }}
          </p>
          </b-form-group>
        </div>
      </div>
      <div class="confirm-cus">
        <b-btn  :disabled="loading || isDisabled" :style="(isDisableBtn() || isDisabled) ? 'background-color: #BDBDBD;' : 'background-color: #069255;'" variant="ghtk" class="btn-cus" @click="confirm()">Xác nhận</b-btn>
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
  name: 'ModalReviewPlan',
  components: {
    Multiselect
  },
  data: _ => ({
    loading: false,
    isDisabled: false,
    data: [],
    selected: null,
    listSolutionSelected: [],
    detailsProposal: '',
    detail: '',
    dataRequest: {
      result: '',
      detail: '',
      propose_solution: [],
      propose_solution_detail: ''
    },
    dataSelect: [
      {
        id: 1,
        name: 'NLĐ hài lòng với kết quả và tiếp tục gắn bó',
        alias: 'keep_working'
      },
      {
        id: 2,
        name: 'Tiếp tục thực hiện phương án đã đề xuất',
        alias: 'continue_review_solution'
      },
      {
        id: 3,
        name: 'NLĐ chưa hài lòng với kết quả, đề xuất phương án khác',
        alias: 'propose_another_solution'
      },
      {
        id: 4,
        name: 'Mong muốn nghỉ việc của NLĐ là chính đáng, đề xuất cho NLĐ nghỉ việc',
        alias: 'resign_properly'
      }
    ],
    isUpdate: true
  }),
  props: {
    listSolutions: [],
    idHrOrder: null,
    dataReviewPlan: null
  },
  computed: {
  },
  created () {

  },
  watch: {
    selected: function (oldVal, newVal) {
      if (!this.isDisabled && this.isUpdate) {
        this.detailsProposal = ''
        this.detail = ''
      }
      this.isUpdate = true
    },
    dataReviewPlan: {
      immediate: true,
      handler: function (oldVal, newVal) {
        if (this.dataReviewPlan && this.dataReviewPlan.data && this.dataReviewPlan.data.result) {
          let result = this.dataSelect.filter((item) => item.alias.toUpperCase().replaceAll(' ', '') === this.dataReviewPlan.data.result.toUpperCase().replaceAll(' ', ''))
          if (result.length > 0) {
            this.selected = String(result[0].id)
          }
          if (this.selected === '3') {
            this.listSolutionSelected = this.listSolutions.filter((item) => this.dataReviewPlan.data.propose_solution.includes(String(item.id)))
            this.detailsProposal = this.dataReviewPlan.data.propose_solution_detail || ''
            this.isUpdate = false
          } else {
            this.detail = this.dataReviewPlan.data.detail
            this.isUpdate = false
          }
        }
        if (this.dataReviewPlan && this.dataReviewPlan.stepStatus && this.dataReviewPlan.stepStatus === 'completed') {
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
      this.listSolutionSelected = null
      this.detailsProposal = ''
      this.selected = null

      this.dataRequest.result = ''
      this.dataRequest.detail = ''
      this.dataRequest.propose_solution = []
      this.dataRequest.propose_solution_detail = ''
      this.isDisabled = false
      this.isUpdate = true
    },
    convertData (data) {
      return data.map((item) => item.name).join(', ')
    },

    async confirm () {
      if (!this.validateDataAndConvertData()) { return }

      let dataConvert = {}
      dataConvert.result = this.dataRequest.result
      if (this.selected === '3') {
        dataConvert.propose_solution = JSON.parse(JSON.stringify(this.dataRequest.propose_solution))
        dataConvert.propose_solution_detail = this.dataRequest.propose_solution_detail
      } else {
        dataConvert.detail = this.dataRequest.detail
      }
      try {
        this.loading = true
        let data = {
          id: this.idHrOrder,
          type: 'event',
          event: 'review_solution',
          data: dataConvert
        }
        const res = await staffResignService.updateStep(data)
        if (res.data.success) {
          this.resetData()
          this.$bvModal.hide('modal-review-plan')
          this.$emit('success')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra khi gửi review phương án', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi gửi review phương án', 'warning')
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

      if (this.selected === '3' && this.listSolutionSelected.length === 0) {
        commonHelpers.showMessage('Vui lòng chọn đề xuất phương án giải quyết', 'warning')
        return false
      }

      if (this.selected === '3' && this.detailsProposal.length === 0) {
        commonHelpers.showMessage('Vui lòng điền chi tiết phương án', 'warning')
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
          this.dataRequest.result = 'continue_review_solution'
          break
        case '3':
          this.dataRequest.result = 'propose_another_solution'
          this.dataRequest.propose_solution_detail = this.detailsProposal
          break
        case '4':
          this.dataRequest.result = 'resign_properly'
          break
      }
      this.handleSelectedSolution()
      this.dataRequest.detail = this.detail

      return true
    },

    handleSelectedSolution () {
      if (this.listSolutionSelected && this.listSolutionSelected.length > 0) {
        this.dataRequest.propose_solution = this.listSolutionSelected.map((item) => item.id)
      }
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
