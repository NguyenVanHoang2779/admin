<template>
  <b-modal
    title="Đề xuất phương án"
    modal-class="modal-cus"
    id="modal-proposed-plan"
    header-class="justify-content-center header-modal-custom"
    size="sm"
    @hidden="resetData()"
    hide-footer
    static
  >
    <div class="wrap-cus">
      <div class="container-cus" :style="isDisabled ? ' overflow-y: auto;' : ''">
        <div class="proposal-cus">
          <div class="title-cus mt-3 mb-2">Phương án thuyết phục người lao động ở lại làm việc<span class="text-danger ml-1">*</span></div>
          <Multiselect
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
            @input="handleSelectedSolution"
            :disabled="isDisabled"
          >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          </Multiselect>
          <textarea
            v-if="!isDisabled"
            :rows="(detailSolution && detailSolution.length > 50) ? 2 : 1"
            class="form-control"
            v-model="detailSolution"
            placeholder="Chi tiết"
            :disabled="isDisabled"
          />
          <p v-else class="p-details">
            {{ detailSolution }}
          </p>
        </div>
      </div>
      <div class="confirm-cus">
        <b-btn variant="ghtk" :disabled="loading || isDisabled " :style="isDisabled ? 'background-color: #BDBDBD;' : 'background-color: #069255;'" class="btn-cus" @click="confirm()">Xác nhận</b-btn>
      </div>
    </div>
  </b-modal>

</template>

<script>

import Multiselect from 'vue-multiselect'
import staffResignService from 'domain/services/staff-resign-service'
import commonHelpers from '../../../../../infrastructures/helpers/common-helpers'
export default {
  name: 'ModalProposedPlan',
  components: {
    Multiselect
  },
  data: _ => ({
    loading: false,
    isDisabled: false,
    listSolutionSelected: [],
    detailSolution: '',
    dataRequest: {
      solutions: [],
      detail: ''
    }
  }),
  props: {
    listSolutions: [],
    idHrOrder: null,
    dataProposedPlan: null
  },
  computed: {
  },
  created () {

  },
  watch: {
    dataProposedPlan: {
      immediate: true,
      handler: function (oldVal, newVal) {
        if (this.dataProposedPlan && this.dataProposedPlan.data && this.dataProposedPlan.data.status) {
          if (this.dataProposedPlan.data.detail) {
            this.detailSolution = this.dataProposedPlan.data.detail
          }

          if (this.dataProposedPlan.data.specific_solutions && this.dataProposedPlan.data.specific_solutions.length > 0) {
            this.listSolutionSelected = this.listSolutions.filter((item) => this.dataProposedPlan.data.specific_solutions.includes(+item.id))
          }

          if (this.dataProposedPlan && this.dataProposedPlan.data) {
            if (this.dataProposedPlan.stepStatus === 'processing' && this.dataProposedPlan.data.status === 'wait_confirm') {
              this.isDisabled = true
            }
          }
        }
        if (this.dataProposedPlan && this.dataProposedPlan.stepStatus && this.dataProposedPlan.stepStatus === 'completed') {
          this.isDisabled = true
        }
      },
      deep: true
    }
  },
  methods: {
    resetData () {
      this.listSolutionSelected = []
      this.detailSolution = null
      this.dataRequest.solutions = []
      this.dataRequest.detail = ''
      this.isDisabled = false
    },

    async confirm () {
      if (!this.validateDataAndConvertData()) { return }

      try {
        this.loading = true
        let data = {
          id: this.idHrOrder,
          type: 'event',
          event: 'propose_solution',
          data: this.dataRequest
        }
        const res = await staffResignService.updateStep(data)
        if (res.data.success) {
          this.resetData()
          this.$bvModal.hide('modal-proposed-plan')
          this.$emit('success')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra khi Hr xác nhận', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi Hr xác nhận', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    handleSelectedSolution () {
      if (this.listSolutionSelected && this.listSolutionSelected.length > 0) {
        this.dataRequest.solutions = this.listSolutionSelected.map((item) => item.id)
      }
    },

    validateDataAndConvertData () {
      // validate data
      if (this.listSolutionSelected.length === 0) {
        commonHelpers.showMessage('Vui lòng chọn đề xuất phương án thuyết phục lại người lao động', 'warning')
        return false
      }
      if (this.detailSolution.length === 0) {
        commonHelpers.showMessage('Vui lòng điền chi tiết phương án thuyết phục người lao động', 'warning')
        return false
      }

      if (!this.idHrOrder) {
        commonHelpers.showMessage('Không xác định được id của đề xuất', 'warning')
        return false
      }
      // convert data
      this.handleSelectedSolution()
      this.dataRequest.detail = this.detailSolution

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
.p-details {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border: 1px solid #BDBDBD;
  border-radius: 5px;
  background-color: #f1f1f2;
  color: #4E5155;
}
</style>
