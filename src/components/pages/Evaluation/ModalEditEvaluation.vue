<template>
  <div class="modal-cus">
    <b-modal size="lg" id="modal-edit-evaluation" hide-footer ref="myModalEdit" @show="setOldData" static>
      <i v-show="loadingModal" class="fas fa-spinner fa-pulse cusSpinner"></i>
      <div slot="modal-title">
        <span v-if="isAdd">Thêm đánh giá</span>
        <span v-else>Chỉnh sửa đánh giá</span>
      </div>
      <b-container fluid v-show="!loadingModal">
        <b-row class="mb-1 text-center">
          <b-col cols="6">
            <strong>Các tiêu chí</strong>
          </b-col>
          <b-col>
            <strong>Mức độ đánh giá</strong>
          </b-col>
        </b-row>
        <template v-for="(cri, index) in criteria">
          <b-row class="mb-1 margin-top-10" :key="index">
            <b-col cols="6"><span class="descrip-cri" :data-title="cri.descrip">{{cri.name}}</span>:</b-col>
            <b-col>
              <b-form-select
                v-model="standardEvaluation[cri.id]"
                :options="optionEvaluation"
                placeholder="Chọn mức độ đánh giá"
                @keyup.enter.native="editEvaluation"
              ></b-form-select>
            </b-col>
          </b-row>
        </template>
        <hr>
        <div v-if="isManagement === 1 && +groupId!==15">
          <strong>Tiêu chí dành cho quản lí</strong>
          <template v-for="(cri, index) in managerCriteria">
            <b-row class="mb-1 margin-top-10" :key="index">
              <b-col cols="6">{{cri.name}}:</b-col>
              <b-col>
                <b-form-select
                  v-model="standardEvaluation[cri.id]"
                  :options="optionEvaluation"
                  placeholder="Chọn mức độ đánh giá"
                  @keyup.enter.native="editEvaluation"
                ></b-form-select>
              </b-col>
            </b-row>
          </template>
        </div>
        <b-row>
          <b-col class="col-md-6">
            <b-form-group label="Ngày bắt đầu" id="input-group-start">
              <b-form-input :disabled="!(evaluatedPermissionExpired && isAdd)" id="start-date" type="date"
                            v-model="standardEvaluation.start_date"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col class="col-md-6">
            <b-form-group label="Ngày kết thúc" id="input-group-end">
              <b-form-input :disabled="!(evaluatedPermissionExpired && isAdd)" id="end-date" type="date"
                            v-model="standardEvaluation.end_date"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-form-group label="Nhận xét" id="input-group-tax-iden-number" class="col-md-12">
            <b-form-input
              v-model="standardEvaluation.descrip"
              id="input-tax-iden-number"
              placeholder="Nhập nhận xét đánh giá"
              @keyup.enter.native="editEvaluation"
            >
            </b-form-input>
          </b-form-group>
        </b-row>
        <b-row v-if="+groupId===15">
          <div v-b-toggle.collapse-guideline class="guideline">GUIDELINE</div>
          <b-collapse id="collapse-guideline" class="mt-2">
            <div class="guideline-detail">
              <table class="table table-bordered">
                <thead class="thead-dark">
                <tr class="text-center">
                  <th scope="col">Point</th>
                  <th scope="col">Fstar</th>
                  <th scope="col">% Hoàn thành mục tiêu</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>1- Cần cải thiện</td>
                  <td>Không thể hiện</td>
                  <td>Đạt nhỏ hơn 70% chỉ tiêu/yêu cầu công việc, xuất hiện lỗi/sự cố nằm ngoài phạm vi được
                    duyệt gây ảnh hưởng lớn đến tài chính/thương hiệu Cty và không xử lý được
                  </td>
                </tr>
                <tr>
                  <td>2- Bình thường</td>
                  <td>Ít thể hiện/thể hiện chưa rõ</td>
                  <td>Đạt 70->80% chỉ tiêu/yêu cầu công việc, có xuất hiện lỗi/sự cố nhỏ nằm ngoài
                    phạm vi
                    được duyệt, không gây thiệt hạit
                  </td>
                </tr>
                <tr>
                  <td>3- Đáng khen</td>
                  <td>Luôn luôn thể hiện</td>
                  <td>Đạt 90->95% chỉ tiêu/yêu cầu công việc, không có lỗi/sự cố nằm ngoài phạm vi
                    được
                    duyệt
                  </td>
                </tr>
                <tr>
                  <td>4- Tuyệt vời</td>
                  <td>Là tấm gương cho người khác học tập</td>
                  <td>
                    Đạt >95% chỉ tiêu/yêu cầu công việc trở lên và có những đóng góp vượt trội
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </b-collapse>
        </b-row>
      </b-container>
      <div class="text-center margin-top-10" v-show="!loadingModal">
        <b-button :disabled="appLoading" variant="primary" @click="editEvaluation()">Đánh giá<i v-show="appLoading" class="fas fa-spinner fa-pulse"></i></b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import evaluationService from 'domain/services/evaluation-service'
import cycleTime from 'infrastructures/helpers/date.js'
import commonHelper from 'infrastructures/helpers/common-helpers'
import {eventBus} from '../../../main'

export default {
  name: 'modal-edit-evaluation',

  components: {
    evaluationService
  },

  props: [
    'evaluation',
    'isManagement',
    'criteria',
    'managerCriteria',
    'groupId',
    'evaluatedPermissionExpired',
    'userId',
    'loadingModal'
  ],

  data: () => ({
    optionEvaluation: [
      {value: '1', text: 'Cần cải thiện'},
      {value: '2', text: 'Bình thường'},
      {value: '3', text: 'Đáng khen ngợi'},
      {value: '4', text: 'Quá tuyệt vời'}
    ],
    appLoading: false,
    standardEvaluation: {
      id: '',
      honest: '',
      responsibility: '',
      disciplinary: '',
      effective: '',
      core_values: '',
      resolve_problem: '',
      creation: '',
      descrip: '',
      user_id: '',
      start_date: '',
      end_date: ''
    }
  }),

  created () {
    this.setOldData()
    this.loadingModal = false
  },

  computed: {
    isAdd () {
      return this.evaluation == null
    }
  },

  methods: {
    hideModal () {
      this.$refs.myModalEdit.hide()
    },

    editEvaluation: function () {
      this.appLoading = true
      let data = {
        id: this.standardEvaluation.id,
        honest: this.standardEvaluation.honest,
        responsibility: this.standardEvaluation.responsibility,
        disciplinary: this.standardEvaluation.disciplinary,
        effective: this.standardEvaluation.effective,
        core_values: this.standardEvaluation.core_values,
        resolve_problem: this.standardEvaluation.resolve_problem,
        creation: this.standardEvaluation.creation,
        work_assign: this.standardEvaluation.work_assign,
        evaluate_control: this.standardEvaluation.evaluate_control,
        train_develop: this.standardEvaluation.train_develop,
        build_collectivity: this.standardEvaluation.build_collectivity,
        descrip: this.standardEvaluation.descrip,
        user_id: this.standardEvaluation.user_id,
        start_date: this.standardEvaluation.start_date,
        end_date: this.standardEvaluation.end_date
      }
      // call modal từ màn quản lý nhân viên
      if (typeof (this.standardEvaluation.user_id) === 'undefined' && this.isAdd && this.userId !== null) {
        data.user_id = this.userId
      }
      evaluationService.addEvaluation(data)
        .then(res => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.updateEvaluation(res.data.data)
            this.hideModal()
            if (this.userId !== null) {
              eventBus.$emit('updateLogStaff', this.userId)
            }
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
    },

    setOldData () {
      let temp = this.evaluation ? this.evaluation : {}
      this.standardEvaluation = {
        ...this.standardEvaluation,
        id: temp['id'] ? temp.id : null,
        honest: temp['honest'] ? temp.honest : '2',
        responsibility: temp['responsibility'] ? temp.responsibility : '2',
        disciplinary: temp['disciplinary'] ? temp.disciplinary : '2',
        effective: temp['effective'] ? temp.effective : '2',
        core_values: temp['core_values'] ? temp.core_values : '2',
        resolve_problem: temp['resolve_problem'] ? temp.resolve_problem : '2',
        creation: temp['creation'] ? temp.creation : '2',
        descrip: temp['descrip'] ? temp.descrip : '',
        user_id: temp['user_id'] ? temp.user_id : this.$route.params.id
      }

      if (parseInt(this.isManagement) === 1 && parseInt(this.groupId) !== 15) {
        this.standardEvaluation.work_assign = temp['work_assign'] ? temp.work_assign : '2'
        this.standardEvaluation.evaluate_control = temp['evaluate_control'] ? temp.evaluate_control : '2'
        this.standardEvaluation.train_develop = temp['train_develop'] ? temp.train_develop : '2'
        this.standardEvaluation.build_collectivity = temp['build_collectivity'] ? temp.build_collectivity : '2'
      }

      if (parseInt(this.groupId) === 15) {
        this.standardEvaluation.start_date = this.evaluation != null ? this.evaluation.start_date : cycleTime.cycleEvaluationForTech().from
        this.standardEvaluation.end_date = this.evaluation != null ? this.evaluation.end_date : cycleTime.cycleEvaluationForTech().to
      } else {
        this.standardEvaluation.start_date = this.evaluation != null ? this.evaluation.start_date : cycleTime.daysInCycleEvaluation().from
        this.standardEvaluation.end_date = this.evaluation != null ? this.evaluation.end_date : cycleTime.daysInCycleEvaluation().to
      }
    },

    updateEvaluation: function () {
      this.$emit('update-evaluation')
    }
  }
}
</script>

<style scoped lang="scss">
.cusSpinner {
  margin-top: 6rem;
  margin-left: 23rem;
  margin-bottom: 6rem;
}
.only-bottom-border {
  border-top: none;
  border-left: none;
  border-right: none;
}

.margin-top-10 {
  margin-top: 10px;
}

.descrip-cri {
  font-weight: 500;
}

[data-title]:hover:after {
  opacity: 1;
  transition: all 0.1s ease 0.5s;
  visibility: visible;
}

[data-title]:after {
  font-weight: 400;
  width: 500px;
  background: white;
  content: attr(data-title);
  position: absolute;
  top: 1em;
  left: 100%;
  padding: 4px 4px 4px 8px;
  color: #666;
  white-space: pre-wrap;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-box-shadow: 0px 0px 4px #666;
  -webkit-box-shadow: 0px 0px 4px #666;
  box-shadow: 0px 0px 4px #666;
  opacity: 0;
  z-index: 99999;
  visibility: hidden;
}

[data-title] {
  position: relative;
}

.guideline {
  padding: 5px;
  color: red;
  border: 1px solid;
  margin-left: 10px;
  border-radius: 3px;
}

.guideline-detail {
  padding: 10px;
}
</style>
<style scoped lang="css">
.modal-cus >>> .modal-title {
  margin: 0px auto !important;
}
</style>
