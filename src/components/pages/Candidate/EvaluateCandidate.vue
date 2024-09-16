<template>
  <div>
    <div class="top-title row mb-3">
      <h2 class="col-md-3">Đánh giá ứng viên</h2>
      <div class="top-title__right-button col-md-9 text-right">
        <b-btn data-style="expand-right" class="btn btn-success" @click="evaluateCandidate" v-if="isEvaluated">
          <span v-if="isAddEvaluation">Gửi đánh giá</span>
          <span v-else>Chỉnh sửa đánh giá</span>
        </b-btn>
        <router-link :to="{name: 'list-candidate'}" class="btn btn-default" title="Về màn quản lý ứng viên"><i
            class="ion ion-ios-return-left"></i> Quay lại
        </router-link>
      </div>
    </div>

    <!-- Thông tin ứng viên -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="row no-gutters">
            <div class="col-md-12 col-lg-12 col-xl-12">
              <h6 class="card-header">
                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-personal-info><i
                    class="ion  ion-ios-add-circle"></i> THÔNG TIN ỨNG VIÊN</a>
              </h6>
              <b-collapse id="collapse-personal-info" visible>
                <b-form-row>
                  <div class="col-md-8 col-lg-8 col-xl-8">
                    <div class="card-body" style="border-right: solid 1px #e0e1e1">
                      <b-form-row>
                        <b-form-group class="col-md-4">
                          <template slot='label'>
                            Họ và tên:
                          </template>
                          <b-form-input
                              placeholder="Họ và tên"
                              v-model="candidate.name"
                              :state="candidate.name === '' ? false : null"
                          >
                          </b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-4">
                          <template slot='label'>
                            Ngày sinh:
                          </template>
                          <datepicker
                              :input-class="{'isValid': (candidate.birthday === null ? true : false)}"
                              v-model="candidate.birthday"
                              name="birthday"
                              format="dd-MM-yyyy"
                              :bootstrapStyling="true"
                              :monday-first="true"
                              :full-month-name="true"
                              :calendar-button="true"
                              calendar-button-icon="ion ion-md-calendar"
                              :clear-button="true"
                              placeholder="Ngày sinh"
                          />
                        </b-form-group>
                        <b-form-group class="col-md-4">
                          <template slot='label'>
                            SĐT:
                          </template>
                          <b-form-input
                              placeholder="SĐT"
                              v-model="candidate.phone"
                              :state="candidate.phone === '' ? false : null"
                          >
                          </b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-3">
                          <template slot='label'>
                            Vị trí dự tuyển:
                          </template>
                          <single-select-candidate-position
                              @handleChoosePosition="handleChoosePosition"
                              :jobId="candidate.job_id"
                              :hrview="Hrview"
                          >
                          </single-select-candidate-position>
                        </b-form-group>
                        <div class="col-md-9">
                          <div class="col-form-label" style="padding-top: 0">Địa chỉ hiện tại:</div>
                          <b-form-row>
                            <single-select-province
                                class="col-md-4"
                                @handleSelectedProvince="handleSelectedLocation(...arguments, 'province_now_id')"
                                :state="candidate.province_now_id == '' ? false : null"
                                :provinceId="candidate.province_now_id"
                            >
                            </single-select-province>

                            <single-select-district
                                class="col-md-4"
                                @handleSelectedDistrict="handleSelectedLocation(...arguments, 'district_now_id')"
                                :state="candidate.district_now_id == '' ? false : null"
                                :provinceId="candidate.province_now_id"
                                :districtId="candidate.district_now_id"
                            >
                            </single-select-district>

                            <single-select-sub-district
                                class="col-md-4"
                                @handleSelectedSubDistrict="handleSelectedLocation(...arguments, 'subdistrict_now_id')"
                                :state="candidate.subdistrict_now_id == '' ? false : null"
                                :districtId="candidate.district_now_id"
                                :subDistrictId="candidate.subdistrict_now_id"
                            >
                            </single-select-sub-district>
                          </b-form-row>
                        </div>
                      </b-form-row>
                    </div>
                  </div>
                  <div class="col-md-4 col-lg-4 col-xl-4">
                    <div class="card-body">
                      <b-form-row>
                        <b-form-group class="col-md-12">
                          <template slot='label'>
                            Người phỏng vấn
                          </template>
                          <single-select-user @onChange="selectedUser" :user="candidate.interviewer"></single-select-user>
                        </b-form-group>
                        <b-form-group class="col-md-12">
                          <template slot='label'>
                            Thời gian phỏng vấn
                          </template>
                          <datepicker
                              :input-class="{'isValid': (candidate.interview_time === null ? true : false)}"
                              v-model="candidate.interview_time"
                              name="birthday"
                              format="dd-MM-yyyy"
                              :bootstrapStyling="true"
                              :monday-first="true"
                              :full-month-name="true"
                              :calendar-button="true"
                              calendar-button-icon="ion ion-md-calendar"
                              :clear-button="true"
                              placeholder="Thời gian phỏng vấn"
                          />
                        </b-form-group>
                      </b-form-row>
                    </div>
                  </div>
                </b-form-row>
              </b-collapse>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-light container-m--x mt-0 mb-4">
      <br/>
    </div>

    <!-- Bảng đánh giá phỏng vấn -->
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="row no-gutters">
            <div class="col-md-12 col-lg-12 col-xl-12">
              <h6 class="card-header">
                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-evaluation-form><i
                    class="ion  ion-ios-add-circle"></i> Form đánh giá ứng viên</a>
              </h6>
              <b-collapse id="collapse-evaluation-form" visible>
                <div class="card-body">
                  <table class="table table-bordered table-hover evaluation-form">
                    <thead>
                    <tr class="text-center bg-warning">
                      <th scope="col">#</th>
                      <th scope="col">Tiêu chí</th>
                      <th scope="col">Đánh giá</th>
                      <th scope="col">Ghi chú</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <th colspan="4" class="text-center bg-success">A.ĐIỀU KIỆN CẦN - BẮT BUỘC</th>
                    </tr>
                    <tr v-for="(condition,index) in evaluation.evaluationCriteriaObligate">
                      <th scope="row">{{ index + 1 }}</th>
                      <td>{{ condition.criteria }}  <span class='red-text'>(*)</span></td>
                      <td>
                        <b-form-group>
                          <b-form-radio-group
                              v-model="condition.point"
                              :options="optionA"
                              :name="condition.name"
                              class="custom-control-inline-individual"
                          ></b-form-radio-group>
                        </b-form-group>
                      </td>
                      <td>
                          <b-form-input v-model="condition.note" type="text" class="border-0" placeholder="Ghi chú"></b-form-input>
                      </td>
                    </tr>
                    <tr>
                      <th colspan="4" class="text-center bg-success text-white">B.ĐIỀU KIỆN ĐỦ</th>
                    </tr>
                    <tr>
                      <th colspan="4" class="text-center bg-secondary text-white">
                        I. Mong muốn làm việc: Ứng viên có thực sự mong muốn làm công việc này không? (Động lực, mong muốn)
                      </th>
                    </tr>
                    <tr v-for="(condition,index) in evaluation.evaluationExpectWork">
                      <th scope="row">{{ index + 7 }}</th>
                      <td>{{ condition.criteria }}</td>
                      <td>
                        <b-form-group>
                          <b-form-radio-group
                              v-model="condition.point"
                              :options="optionB"
                              :name="condition.name"
                              class="custom-control-inline-individual"
                          ></b-form-radio-group>
                        </b-form-group>
                      </td>
                      <td>
                        <b-form-input v-model="condition.note" type="text" class="border-0" placeholder="Ghi chú"></b-form-input>
                      </td>
                    </tr>
                    <tr>
                      <th colspan="4" class="text-center bg-secondary text-white">
                        II. Thái độ: Ứng viên này có phải là kiểu người GHTK đang cần không? (Phù hợp với văn hóa, con người, team)
                      </th>
                    </tr>
                    <tr v-for="(condition,index) in evaluation.evaluationHuman">
                      <th scope="row">{{ index + 14 }}</th>
                      <td>{{ condition.criteria }}</td>
                      <td>
                        <b-form-group>
                          <b-form-radio-group
                              v-model="condition.point"
                              :options="optionB"
                              :name="condition.name"
                              class="custom-control-inline-individual"
                          ></b-form-radio-group>
                        </b-form-group>
                      </td>
                      <td>
                        <b-form-input v-model="condition.note" type="text" class="border-0" placeholder="Ghi chú"></b-form-input>
                      </td>
                    </tr>
                    <tr>
                      <th colspan="4" class="text-center bg-secondary text-white">
                        III. Năng lực: Ứng viên này có năng lực đủ đáp ứng công việc này không? (Kỹ năng, kiến thức, kinh nghiệm)
                      </th>
                    </tr>
                    <tr v-for="(condition,index) in evaluation.evaluationSkill" v-if="show(condition.show)">
                      <th scope="row">{{ index + 17 }}</th>
                      <td>{{ condition.criteria }}</td>
                      <td>
                        <b-form-group>
                          <b-form-radio-group
                              v-model="condition.point"
                              :options="optionB"
                              :name="condition.name"
                              class="custom-control-inline-individual"
                          ></b-form-radio-group>
                        </b-form-group>
                      </td>
                      <td>
                        <b-form-input v-model="condition.note" type="text" class="border-0" placeholder="Ghi chú"></b-form-input>
                      </td>
                    </tr>
                    <tr class="bg-warning">
                      <th></th>
                      <th>Tổng điểm:</th>
                      <th style="padding-left: 30px">{{totalPoint}} / {{maxPoint}}</th>
                      <th></th>
                    </tr>
                    <tr class="bg-warning">
                      <th></th>
                      <th>Kết quả:</th>
                      <th>
                        <b-form-group>
                          <b-form-radio-group
                                  v-model="candidate.evaluation_result"
                                  :options="optionFinal"
                                  class="custom-control-inline-individual custom-control-inline-individual-result"
                          ></b-form-radio-group>
                        </b-form-group>
                      </th>
                      <th></th>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center">
                  <b-button variant="success"  @click="evaluateCandidate" v-if="isEvaluated">
                    <span v-if="isAddEvaluation">Gửi đánh giá</span>
                    <span v-else>Chỉnh sửa đánh giá</span>
                  </b-button>
                </div>
              </b-collapse>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-light container-m--x mt-0 mb-4">
      <br/>
    </div>

  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
// service
import candidateService from 'domain/services/candidate-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

// Components
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import SingleSelectCandidatePosition from './SingleSelectCandidatePosition'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'evaluate-candidate',

  components: {
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    SingleSelectCandidatePosition,
    SingleSelectUser,
    Datepicker
  },

  props: {
    type: {
      default: null
    },
    Hrview: {
      default: null
    }
  },

  data: () => ({
    candidate: {
      interviewer: null,
      interview_time: null,
      evaluation_result: null
    },
    selected: null,
    isAddEvaluation: true,
    optionA: [
      { text: 'Đạt', value: 5 },
      { text: 'Không đạt', value: 1 }
    ],
    optionB: [
      { text: 'Rất tệ', value: 1 },
      { text: 'Tệ', value: 2 },
      { text: 'Bình thường', value: 3 },
      { text: 'Tốt', value: 4 },
      { text: 'Rất tốt', value: 5 }
    ],
    optionFinal: [
      { text: 'Đạt', value: 'good' },
      { text: 'Không đạt', value: 'bad' }
    ],
    note: {},
    totalPoint: 0,
    maxPoint: 120,
    evaluation: {
      'evaluationCriteriaObligate': [
        { criteria: 'Lý lịch cá nhân', point: null, name: 'profile', note: '', show: '' },
        { criteria: 'Trình độ học vấn', point: null, name: 'academic_level', note: '', show: '' },
        { criteria: 'Sức khỏe', point: null, name: 'health', note: '', show: '' },
        { criteria: 'Có/ Có khả năng có smartphone Android', point: null, name: 'has_android', note: '', show: '' },
        { criteria: 'Độ tuổi phù hợp', point: null, name: 'age', note: '', show: '' },
        { criteria: 'Đáp ứng được thời gian làm việc', point: null, name: 'working_time', note: '', show: '' }
      ],
      'evaluationExpectWork': [
        { criteria: 'Mức độ mong muốn công việc', point: null, name: 'expect_job', note: '', show: '' },
        { criteria: 'Thu nhập tương xứng/ phù hợp', point: null, name: 'income', note: '', show: '' },
        { criteria: 'Mức độ quan tâm nhiều đến thu nhập', point: null, name: 'income_care', note: '', show: '' },
        { criteria: 'Chế độ, phúc lợi mong muốn tương xứng và mức độ quan tâm đến chế độ, phúc lợi', point: null, name: 'welfare_care', note: '', show: '' },
        { criteria: 'Mức độ quan tâm đến người quản lý trực tiếp', point: null, name: 'manager_care', note: '', show: '' },
        { criteria: 'Mức độ quan tâm đến môi trường, điều kiện làm việc', point: null, name: 'env_care', note: '', show: '' },
        { criteria: 'Mức độ gắn bó', point: null, name: 'adherence', note: '', show: '' }
      ],
      'evaluationHuman': [
        { criteria: 'Thái độ, hành vi ứng xử', point: null, name: 'attitude', note: '', show: '' },
        { criteria: 'Trung thực tin cậy', point: null, name: 'honest', note: '', show: '' },
        { criteria: 'Tính trách nhiệm, sẵn sàng hỗ trợ', point: null, name: 'responsibility', note: '', show: '' }
      ],
      'evaluationSkill': [
        { criteria: 'Kỹ năng giao tiếp, tương tác', point: null, name: 'communicate', note: '', show: '' },
        { criteria: 'Kỹ năng giải quyết vấn đề', point: null, name: 'problem_solve', note: '', show: '' },
        { criteria: 'Khả năng chịu được áp lực công việc', point: null, name: 'work_pressure', note: '', show: '' },
        { criteria: 'Mức độ sử dụng thành thạo smartphone', point: null, name: 'proficient_phone', note: '', show: '' },
        { criteria: 'Mức độ thành thạo đường', point: null, name: 'proficient_street', note: '', show: '1,2' },
        { criteria: 'Kinh nghiệm làm việc với khách hàng', point: null, name: 'cod_work_customer', note: '', show: '1' },
        { criteria: 'Kinh nghiệm về xử lý kỹ thuật xe cơ bản, Xử lý sự cố trên đường', point: null, name: 'driver_truck_control', note: '', show: '2' },
        { criteria: 'Kinh nghiệm từng làm công việc lao động nặng, bốc xếp, môi trường kho ...', point: null, name: 'wh_hard_labor', note: '', show: '3' }
      ]
    }
  }),

  computed: {
    isEvaluated () {
      if (this.candidate.status === 'interview') return true
    }
  },

  created () {
    if (this.$route.params.id) {
      this.getCandidateInfo(this.$route.params.id)
      this.getDataEvaluationById()
    }
  },

  watch: {
    evaluation: {
      handler: function (newValue) {
        let points = [].concat.apply([], Object.values(newValue)).map((val) => {
          return val.point
        })
        let total = 0
        for (let i = 0; i < points.length; i++) {
          total += parseInt(points[i] || 0)
        }
        this.totalPoint = total
        this.maxPoint = 5 * points.length
      },
      deep: true
    }
  },

  methods: {
    show (show) {
      if (show) {
        return show.includes(this.candidate.job_id)
      } else return true
    },

    selectedUser (option) {
      this.candidate.interviewer = option
    },

    getDataEvaluationById () {
      let params = {
        id: this.$route.params.id
      }
      candidateService.getDataEvaluationById(params).then((res) => {
        if (res.data.success) {
          this.evaluation = {...this.evaluation, ...res.data.data.data}
          if (typeof res.data.data.data === 'object') this.isAddEvaluation = false
          this.totalPoint = res.data.data.totalPoint
          this.maxPoint = res.data.data.maxPoint
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((e) => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    evaluateCandidate () {
      let data = {
        'evaluation': this.evaluation,
        'candidateId': this.$route.params.id,
        'interviewerId': this.candidate.interviewer.id,
        'interviewTime': this.candidate.interview_time,
        'evaluationResult': this.candidate.evaluation_result
      }
      candidateService.evaluateCandidate(data).then((res) => {
        if (res.data.success) {
          this.getDataEvaluationById()
          commonHelper.showMessage(res.data.message, 'success')
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((e) => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    getCandidateInfo (idCandidate) {
      this.$startLoading()
      if (idCandidate === null || idCandidate === '' || !idCandidate) commonHelper.showMessage('Không có Id ứng viên', 'warning')
      let params = {
        id: idCandidate
      }
      candidateService.getCandidateInfo(params).then((res) => {
        if (res.data.success) {
          this.candidate = {...this.candidate, ...res.data.data}
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((e) => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },
    handleSelectedLocation (location, name) {
      if (location) {
        this.candidate[name] = location.id
      } else {
        this.candidate[name] = ''
      }
    },

    handleChoosePosition (position) {
      if (position) {
        this.candidate['job_id'] = position.id
      } else {
        this.candidate['job_id'] = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .table th {
    vertical-align: unset !important;
  }
  .custom-control-inline-individual {
    display: flex;
    justify-content: space-around;
  }
  .custom-control-inline-individual-result {
    justify-content: left!important;
  }
</style>
