<template>
  <b-modal
    title="Quản lý xác nhận"
    modal-class="modal-cus"
    id="modal-manager-confirm"
    header-class="justify-content-center header-modal-custom"
    size="sm"
    @hidden="resetData()"
    hide-footer
    static
  >
    <div class="wrap-cus">
      <div class="container-cus" :style="isDisabled ? ' overflow-y: auto;' : ''">
        <div class="confirm-problem-cus">
          <div class="title-cus">Xác nhận vấn đề NLĐ đang gặp phải</div>
          <div class="problems-current-cus">
            <label class="problems-cus">Xác nhận vấn đề NLĐ đang gặp phải <span class="text-danger ml-1">*</span></label>
            <Multiselect
              class="mb-2"
              v-model="listProblemsSelected"
              :options="listProblems"
              placeholder="Chọn"
              :multiple="true"
              label="name"
              track-by="id"
              selected-label=""
              deselect-label="X"
              select-label="Chọn"
              :hide-selected="true"
              :close-on-select="true"
              :disabled="isDisabled"
              @input="handleSelectedProblem">
              <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
            </Multiselect>
            <textarea
               v-if="!isDisabled"
              :rows="(detailProblems && detailProblems.length > 50) ? 2 : 1"
              class="form-control"
              v-model="detailProblems"
              placeholder="Chi tiết"
              :disabled="isDisabled"
            />
            <p v-else class="p-details">
              {{ detailProblems }}
            </p>
          </div>

          <div class="other-problems-cus">
            <label class="problems-cus">Vấn đề khác</label>
            <textarea
               v-if="!isDisabled"
              :rows="(otherProblems && otherProblems.length > 50) ? 2 : 1"
              class="form-control"
              v-model="otherProblems"
              placeholder="Nhập"
              :disabled="isDisabled"
            />
            <p v-else class="p-details">
              {{ otherProblems }}
            </p>
          </div>

          <div class="other-problems-cus">
            <label class="problems-cus">Đánh giá về quá trình làm việc của NLĐ <span class="text-danger ml-1">*</span></label>
            <textarea
               v-if="!isDisabled"
              :rows="(reviewNLD && reviewNLD.length > 50) ? 2 : 1"
              class="form-control"
              v-model="reviewNLD"
              placeholder="Nhập"
              :disabled="isDisabled"
            />
            <p v-else class="p-details">
              {{ reviewNLD }}
            </p>
          </div>

        </div>

        <div class="proposal-cus">
          <div class="title-cus mt-3 mb-2">Đề xuất phương án giải quyết<span class="text-danger ml-1">*</span></div>
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
            :disabled="isDisabled"
            @input="handleSelectedSolution"
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
        <b-btn :disabled="loading || isDisabled" :style="isDisabled ? 'background-color: #BDBDBD;' : 'background-color: #069255;'" variant="ghtk" class="btn-cus" @click="confirm()">Xác nhận</b-btn>
      </div>
    </div>
  </b-modal>

</template>

<script>

import Multiselect from 'vue-multiselect'
import staffResignService from 'domain/services/staff-resign-service'
import commonHelpers from '../../../../../infrastructures/helpers/common-helpers'
export default {
  name: 'ModalManagerConfirm',
  components: {
    Multiselect
  },
  data: _ => ({
    loading: false,
    isDisabled: false,
    data: [],
    statusBefore: null,
    listStatus: [
      {
        id: 1,
        name: 'Quản lý chưa trao đổi'
      },
      {
        id: 2,
        name: 'Quản lý đã trao đổi nhưng chưa đưa ra giải pháp'
      },
      {
        id: 3,
        name: 'Quản lý đã trao đổi, đưa ra giải pháp nhưng chưa thực thi'
      },
      {
        id: 4,
        name: 'Quản lý đã trao đổi, đưa ra giải pháp và thực thi nhưng NLĐ chưa hài lòng về kết quả'
      }
    ],
    listProblemsSelected: [],
    detailProblems: '',
    otherProblems: '',
    reviewNLD: '',
    listSolutionSelected: [],
    detailSolution: '',
    dataRequest: {
      employee_problems: [],
      employee_problem_detail: '',
      other_problems: '',
      employee_evaluation: '',
      propose_solution: [],
      propose_solution_detail: ''
    }
  }),
  props: {
    idHrOrder: null,
    listProblems: [],
    listSolutions: [],
    dataProposal: null,
    dataManagerConfirm: null
  },
  computed: {
  },
  created () {

  },
  watch: {
    dataProposal: {
      immediate: true,
      handler: function (newValue) {
        if (this.dataProposal && this.dataProposal.type === 'manager-confirm') {
          if (this.dataManagerConfirm) {
            if (this.dataManagerConfirm.employee_problems && this.dataManagerConfirm.employee_problems.length > 0) {
              let arrProblems = this.dataManagerConfirm.employee_problems.map((item) => item.toUpperCase().replaceAll(' ', ''))
              this.listProblemsSelected = this.listProblems.filter((item) => arrProblems.includes(item.name.toUpperCase().replaceAll(' ', '')))
            }

            if (this.dataManagerConfirm.employee_problem_detail) {
              this.detailProblems = JSON.parse(JSON.stringify(this.dataManagerConfirm.employee_problem_detail))
            }

            if (this.dataManagerConfirm.other_problems) {
              this.otherProblems = JSON.parse(JSON.stringify(this.dataManagerConfirm.other_problems))
            }

            if (this.dataManagerConfirm.employee_evaluation) {
              this.reviewNLD = JSON.parse(JSON.stringify(this.dataManagerConfirm.employee_evaluation))
            }

            if (this.dataManagerConfirm.propose_solution && this.dataManagerConfirm.propose_solution.length > 0) {
              let arrSolutions = this.dataManagerConfirm.propose_solution.map((item) => item.toUpperCase().replaceAll(' ', ''))
              this.listSolutionSelected = this.listSolutions.filter((item) => arrSolutions.includes(item.name.toUpperCase().replaceAll(' ', '')))
            }

            if (this.dataManagerConfirm.propose_solution_detail) {
              this.detailSolution = JSON.parse(JSON.stringify(this.dataManagerConfirm.propose_solution_detail))
            }
            this.isDisabled = true
          } else {
            if (this.dataProposal.problems && this.dataProposal.problems.length > 0) {
              this.listProblemsSelected = this.listProblems.filter(item => this.dataProposal.problems.includes(item.id))
              this.dataRequest.employee_problems = this.listProblemsSelected.map((item) => item.name)
            }
            if (this.dataProposal.solutions && this.dataProposal.solutions.length > 0) {
              this.listSolutionSelected = this.listSolutions.filter(item => this.dataProposal.solutions.includes(item.id))
              this.dataRequest.propose_solution = this.listSolutionSelected.map((item) => item.name)
            }
            if (this.dataProposal.status && this.dataProposal.status === 'completed') {
              this.isDisabled = true
            }
          }
        }
      },
      deep: true
    }
  },

  methods: {
    resetData () {
      this.otherProblems = ''
      this.detailProblems = ''
      this.listProblemsSelected = []
      this.statusBefore = null
      this.detailSolution = ''
      this.listSolutionSelected = []
      this.reviewNLD = ''

      this.dataRequest.employee_problems = []
      this.dataRequest.employee_problem_detail = ''
      this.dataRequest.other_problems = ''
      this.dataRequest.propose_solution = []
      this.dataRequest.propose_solution_detail = ''
      this.dataRequest.employee_evaluation = ''
      this.isDisabled = false
    },

    async getdataProposal () {
      this.loading = true
      try {
        const res = await staffResignService.getListProblems()
        if (res.data.success) {
          // let data = res.data.data
        } else {
          commonHelpers.showMessage(res.data.success || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra ', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    async confirm () {
      if (!this.validateDataAndConvertData()) { return }

      try {
        this.loading = true
        let data = {
          id: this.idHrOrder,
          type: 'event',
          event: 'manager_confirm',
          data: this.dataRequest
        }
        const res = await staffResignService.updateStep(data)
        if (res.data.success) {
          this.resetData()
          this.$bvModal.hide('modal-manager-confirm')
          this.$emit('success')
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra khi quản lý xác nhận', 'warning')
        }
      } catch (e) {
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra khi quản lý xác nhận', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    validateDataAndConvertData () {
      // validate data

      if (this.listProblemsSelected.length === 0) {
        commonHelpers.showMessage('Vui lòng chọn vấn đề người lao động đang gặp phải', 'warning')
        return false
      }

      if (this.detailProblems.length === 0) {
        commonHelpers.showMessage('Vui lòng điền chi tiết vấn đề người lao động đang gặp phải', 'warning')
        return false
      }

      if (this.reviewNLD.length === 0) {
        commonHelpers.showMessage('Vui lòng điền đánh giá về quá trình người lao động gặp phải', 'warning')
        return false
      }

      if (this.listSolutions.length === 0) {
        commonHelpers.showMessage('Vui lòng chọn đề xuất phương án giải quyết', 'warning')
        return false
      }
      if (this.detailSolution.length === 0) {
        commonHelpers.showMessage('Vui lòng điền chi tiết phương án giải quyết', 'warning')
        return false
      }

      if (!this.idHrOrder) {
        commonHelpers.showMessage('Không xác định được id của đề xuất', 'warning')
        return false
      }

      // convert data
      this.dataRequest.employee_evaluation = this.reviewNLD
      this.dataRequest.propose_solution_detail = this.detailSolution
      this.dataRequest.employee_problem_detail = this.detailProblems
      if (this.otherProblems.length > 0) {
        this.dataRequest.other_problems = this.otherProblems
      }

      return true
    },

    handleSelectedProblem () {
      if (this.listProblemsSelected && this.listProblemsSelected.length > 0) {
        this.dataRequest.employee_problems = this.listProblemsSelected.map((item) => item.name)
      }
    },
    handleSelectedSolution () {
      if (this.listSolutionSelected && this.listSolutionSelected.length > 0) {
        this.dataRequest.propose_solution = this.listSolutionSelected.map((item) => item.name)
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
.p-details {
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border: 1px solid #BDBDBD;
  border-radius: 5px;
  background-color: #f1f1f2;
  color: #4E5155;
}
</style>
