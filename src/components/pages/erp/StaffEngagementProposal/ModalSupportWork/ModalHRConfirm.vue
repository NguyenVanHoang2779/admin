<template>
  <b-modal
  title="HR xác nhận"
  modal-class="modal-cus"
  id="modal-hr-confirm"
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
          <div class="before-status-cus">
               <label class="problems-cus">Trước đó, quản lý đã trao đổi/đưa phương án/giải quyết các vấn đề của NLĐ chưa? <span class="text-danger ml-1">*</span></label>
               <Multiselect
                 v-model="statusBefore"
                 :options="listStatus"
                 :multiple="false"
                 label="name"
                 track-by="id"
                 placeholder="Chọn"
                 selected-label=""
                 deselect-label="X"
                 select-label="Chọn"
                 :hide-selected="true"
                 :close-on-select="true"
                 :disabled="isDisabled"
                 @input="handleSelectedStatus"
               >
                 <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
               </Multiselect>
          </div>

          <div class="problems-current-cus">
            <label class="problems-cus">Vấn đề người lao động đang gặp phải <span class="text-danger ml-1">*</span></label>
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
  name: 'ModalHRConfirm',
  components: {
    Multiselect
  },
  data: _ => ({
    loading: false,
    data: [],
    statusBefore: null,
    isDisabled: false,
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
    detailSolution: '',
    otherProblems: '',
    listSolutionSelected: [],
    detailsProposal: '',
    dataRequest: {
      discussed_with_manager: null,
      employee_problems: [],
      employee_problem_detail: '',
      other_problems: '',
      propose_solution: [],
      propose_solution_detail: ''
    }
  }),
  props: {
    idHrOrder: null,
    listProblems: [],
    listSolutions: [],
    dataHrConfirm: null,
    dataProposal: null
  },
  computed: {
  },
  created () {
  },
  watch: {
    dataProposal: {
      immediate: true,
      handler: function (newValue) {
        if (this.dataProposal && this.dataProposal.type === 'HR-confirm') {
          if (this.dataHrConfirm) {
            if (this.dataHrConfirm.discussed_with_manager) {
              this.statusBefore = this.listStatus.filter((item) => item.name.toUpperCase().replaceAll(' ', '') === this.dataHrConfirm.discussed_with_manager.toUpperCase().replaceAll(' ', ''))
            }
            if (this.dataHrConfirm.employee_problem_detail) {
              this.detailProblems = JSON.parse(JSON.stringify(this.dataHrConfirm.employee_problem_detail))
            }

            if (this.dataHrConfirm.employee_problems && this.dataHrConfirm.employee_problems.length > 0) {
              let arrProblems = this.dataHrConfirm.employee_problems.map((item) => item.toUpperCase().replaceAll(' ', ''))
              this.listProblemsSelected = this.listProblems.filter((item) => arrProblems.includes(item.name.toUpperCase().replaceAll(' ', '')))
            }

            if (this.dataHrConfirm.other_problems) {
              this.otherProblems = JSON.parse(JSON.stringify(this.dataHrConfirm.other_problems))
            }

            if (this.dataHrConfirm.propose_solution && this.dataHrConfirm.propose_solution.length > 0) {
              let arrSolutions = this.dataHrConfirm.propose_solution.map((item) => item.toUpperCase().replaceAll(' ', ''))
              this.listSolutionSelected = this.listSolutions.filter((item) => arrSolutions.includes(item.name.toUpperCase().replaceAll(' ', '')))
            }

            if (this.dataHrConfirm.propose_solution_detail) {
              this.detailSolution = JSON.parse(JSON.stringify(this.dataHrConfirm.propose_solution_detail))
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

      this.dataRequest.discussed_with_manager = null
      this.dataRequest.employee_problems = []
      this.dataRequest.employee_problem_detail = ''
      this.dataRequest.other_problems = ''
      this.dataRequest.propose_solution = []
      this.dataRequest.propose_solution_detail = ''
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
          event: 'hr_confirm',
          data: this.dataRequest
        }

        const res = await staffResignService.updateStep(data)
        if (res.data.success) {
          this.resetData()
          this.$bvModal.hide('modal-hr-confirm')
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

    validateDataAndConvertData () {
      // validate data
      if (!this.statusBefore) {
        commonHelpers.showMessage('Vui lòng chọn đẩy đủ các trường bắt buộc', 'warning')
        return false
      }

      if (this.listProblemsSelected.length === 0) {
        commonHelpers.showMessage('Vui lòng chọn vấn đề người lao động đang gặp phải', 'warning')
        return false
      }

      if (this.detailProblems.length === 0) {
        commonHelpers.showMessage('Vui lòng điền chi tiết vấn đề người lao động đang gặp phải', 'warning')
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
      this.dataRequest.discussed_with_manager = this.statusBefore.name
      this.dataRequest.propose_solution_detail = this.detailSolution
      this.dataRequest.employee_problem_detail = this.detailProblems
      if (this.otherProblems.length > 0) {
        this.dataRequest.other_problems = this.otherProblems
      }

      if (this.statusBefore && this.statusBefore.name) {
        this.dataRequest.discussed_with_manager = this.statusBefore.name
      }

      return true
    },

    handleSelectedStatus () {
      if (this.statusBefore && this.statusBefore.name) {
        this.dataRequest.discussed_with_manager = this.statusBefore.name
      }
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
