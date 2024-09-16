<template>
    <b-modal id='modal-review-candidate' :title="title" size="lg" @shown="initModal" @hide="resetForm" static>
        <b-alert show variant="warning">
            <b>Lưu ý:</b>
            <div>Vui lòng điền đánh giá ứng viên trước khi chuyển trạng thái ứng viên</div>
        </b-alert>
        <div class="title">
            <h5 class="font-weight-bold title__content">THÔNG TIN ĐÁNH GIÁ</h5>
        </div>
        <form autocomplete="off" class="form__evaluate">
            <b-form-row>
                <b-col md="6">
                    <b-form-group
                        label="Kinh nghiệm"
                        label-class="font-weight-bold"
                        label-for="input-experience"
                    >
                        <b-form-select
                            v-model="work_experience.selected"
                            :options="work_experience.options"
                            value-field="value"
                            name="work_experience"
                            v-validate="'required'"
                            :class="{'input': true, 'danger': errors.has('work_experience') }"
                        ></b-form-select>
                        <i v-show="errors.has('work_experience')" class="fa fa-warning"></i>
                        <span v-show="errors.has('work_experience')" class="help field-text danger">{{ errors.first('work_experience') }}</span>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Hình thức"
                        label-class="font-weight-bold"
                        label-for="input-form"
                    >
                        <b-form-select
                            v-model="work_form.selected"
                            :options="work_form.options"
                            value-field="value"
                            name="work_form"
                            v-validate="'required'"
                            :class="{'input': true, 'danger': errors.has('work_form') }"
                        ></b-form-select>
                        <i v-show="errors.has('work_form')" class="fa fa-warning"></i>
                        <span v-show="errors.has('work_form')" class="help field-text danger">{{ errors.first('work_form') }}</span>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col md="6">
                    <b-form-group
                        label="Xuất xứ"
                        label-class="font-weight-bold"
                        label-for="input-origin"
                    >
                        <b-form-select
                            v-model="origin.selected"
                            :options="origin.options"
                            value-field="value"
                            name="origin"
                            v-validate="'required'"
                            :class="{'input': true, 'danger': errors.has('origin') }"
                        ></b-form-select>
                        <i v-show="errors.has('origin')" class="fa fa-warning"></i>
                        <span v-show="errors.has('origin')" class="help field-text danger">{{ errors.first('origin') }}</span>
                    </b-form-group>
                </b-col>
                <b-col md="6">
                    <b-form-group
                        label="Kì vọng lương"
                        label-class="font-weight-bold"
                        label-for="input-form"
                        type="text"
                    >
                        <b-form-input
                            :disabled="false"
                            v-model="desiredSalary"
                            @keypress="formatCurrency($event)"
                            name="desired_salary"
                            v-validate="'required'"
                            :class="{'input': true, 'danger': errors.has('desired_salary') }"
                        ></b-form-input>
                        <i v-show="errors.has('desired_salary')" class="fa fa-warning"></i>
                        <span v-show="errors.has('desired_salary')" class="help field-text danger">{{ errors.first('desired_salary') }}</span>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col md="12">
                    <b-form-group
                        label="Hoàn cảnh gia đình"
                        label-class="font-weight-bold"
                        label-for="input-family-circumstances"
                    >
                        <b-form-textarea
                            id="input-family-circumstances"
                            v-model="familyCircumstances"
                            rows="3"
                            max-rows="6"
                            name="family_circumstances"
                            v-validate="'required'"
                            :class="{'input': true, 'danger': errors.has('family_circumstances') }"
                        ></b-form-textarea>
                        <i v-show="errors.has('family_circumstances')" class="fa fa-warning"></i>
                        <span v-show="errors.has('family_circumstances')" class="help field-text danger">{{ errors.first('family_circumstances') }}</span>
                    </b-form-group>
                </b-col>
            </b-form-row>
            <b-form-row>
                <b-col md="12">
                    <b-form-group
                        label="Đánh giá"
                        label-class="font-weight-bold"
                        label-for="input-evaluate"
                    >
                        <b-form-textarea
                            id="input-evaluate"
                            v-model="overall_rating"
                            rows="3"
                            max-rows="6"
                            name="overall_rating"
                            v-validate="'required'"
                            :class="{'input': true, 'danger': errors.has('overall_rating') }"
                        ></b-form-textarea>
                        <i v-show="errors.has('overall_rating')" class="fa fa-warning"></i>
                        <span v-show="errors.has('overall_rating')" class="help field-text danger">{{ errors.first('overall_rating') }}</span>
                    </b-form-group>
                </b-col>
            </b-form-row>
        </form>
        <div slot="modal-footer" class="w-100 text-center">
            <b-btn class="btn-ghtk" variant="success" @click="submit()"> Lưu thông tin </b-btn>
            <b-btn @click="closeModal()"> Hủy </b-btn>
        </div>
    </b-modal>
</template>

<script>
import Vue from 'vue'
import vi from 'vee-validate/dist/locale/vi'
import VeeValidate from 'vee-validate'
import candidateService from 'domain/services/candidate-service'
import helper from 'infrastructures/helpers/common-helpers'

Vue.use(VeeValidate)

export default {
  name: 'ModalEvaluateCandidate',
  props: {
    candidateId: {
      default: null
    },
    reviewType: {
      default: null
    },
    jobDriverX: {
      default: null
    },
    candidate: {
      default: null
    }
  },

  created () {
    this.$validator.localize('vi', {
      messages: vi.messages,
      attributes: {
        work_experience: 'Kinh nghiệm làm việc',
        work_form: 'Hình thức làm việc',
        origin: 'Xuất xứ',
        desired_salary: 'Kỳ vọng lương',
        family_circumstances: 'Hoàn cảnh gia đình',
        overall_rating: 'Đánh giá'
      }
    })

    // start with english locale.
    this.$validator.localize('vi')
  },

  data () {
    return {
      title: 'Đánh giá ứng viên',
      work_experience: {
        selected: null,
        options: [
          { value: null, text: 'Hãy chọn kinh nghiệm làm việc' },
          { value: 'have_experience', text: 'Đã có kinh nghiệm' },
          { value: 'no_experience', text: 'Chưa có kinh nghiệm' },
          { value: 'leave_go_back_work', text: 'Nghỉ việc đi làm lại' }
        ]
      },
      work_form: {
        selected: null,
        options: [
          { value: null, text: 'Hãy chọn hình thức làm việc' },
          { value: 'student_part_time', text: 'Sinh viên làm thêm' },
          { value: 'labor_part_time', text: 'Lao động làm thêm' },
          { value: 'full_time', text: 'Toàn thời gian' }
        ]
      },
      origin: {
        selected: null,
        options: [
          { value: null, text: 'Hãy chọn xuất xứ' },
          { value: 'in_province', text: 'Bản địa' },
          { value: 'out_province', text: 'Ngoại tỉnh' }
        ]
      },
      desiredSalary: null,
      familyCircumstances: null,
      overall_rating: null,

      form: {
        candidate_id: null,
        review_type: null,
        experience: null,
        work_form: null,
        origin: null,
        desired_salary: null,
        family_circumstances: null,
        overall_rating: null,
        job_driverx_id: null
      }
    }
  },

  methods: {
    initModal: function () {
      if (this.candidateId && this.reviewType) {
        this.getCandidateReview()
      }
    },

    resetForm: function () {
      this.work_experience.selected = null
      this.work_form.selected = null
      this.origin.selected = null
      this.desiredSalary = null
      this.familyCircumstances = null
      this.overall_rating = null

      this.form = {
        candidate_id: null,
        review_type: null,
        work_experience: null,
        work_form: null,
        origin: null,
        desired_salary: null,
        family_circumstances: null,
        overall_rating: null,
        job_driverx_id: null
      }

      this.$nextTick(() => {
        this.$validator.reset()
      })
    },

    submit: function () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.form = {
            candidate_id: this.candidateId,
            review_type: this.reviewType,
            work_experience: this.work_experience.selected,
            work_form: this.work_form.selected,
            origin: this.origin.selected,
            desired_salary: this.desiredSalary ? this.desiredSalary.match(/\d/g).join('') : 0,
            family_circumstances: this.familyCircumstances,
            overall_rating: this.overall_rating,
            job_driverx_id: this.jobDriverX ? this.jobDriverX.job_id : null
          }

          candidateService.reviewCandidate(this.form)
            .then(res => {
              if (res.data.success) {
                helper.showMessage(res.data.message ? res.data.message : 'Successfully', 'success')
                this.closeModal()
                this.candidate.logs = this.candidate.logs || []
                this.candidate.logs.push(res.data.data.log)
                this.$emit('reviewCandidateSuccess')
              } else {
                helper.showMessage(res.data.message ? res.data.message : 'Failed', 'warning')
              }
            })
            .catch(e => {
              console.log(e)
              helper.showMessage('Đã có lỗi xảy ra !', 'warning')
            })
        }
      })
    },

    closeModal: function () {
      this.$bvModal.hide('modal-review-candidate')
    },

    /**
     * Format input to money
     * @author annt164
     * @param event
     */
    formatCurrency (event) {
      if ([38, 40, 37, 39, 8, 46].includes(event.keyCode)) {
        return
      }

      let key = String.fromCharCode(event.keyCode)
      let regex = /[0-9|/]/
      if (!regex.test(key)) {
        event.preventDefault()
      }
      let input = this.desiredSalary ? (this.desiredSalary.toString() + key) : key
      // eslint-disable-next-line no-useless-escape
      input = input ? input.toString().replace(/[\D\s\._\-]+/g, '') : 0
      input = input ? parseInt(input, 10) : 0
      this.desiredSalary = input.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})
      event.preventDefault()
    },

    toCurrency (value) {
      // eslint-disable-next-line no-useless-escape
      value = value ? value.toString().replace(/[\D\s\._\-]+/g, '') : 0
      value = value ? parseInt(value, 10) : 0
      return value.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})
    },

    getCandidateReview () {
      candidateService.getCandidateReview({
        candidate_id: this.candidateId,
        review_type: this.reviewType,
        job_driverx_id: this.jobDriverX ? this.jobDriverX.job_id : null
      })
        .then(res => {
          if (res.data.success) {
            if (res.data.data && Object.keys(res.data.data).length) {
              this.title = 'Chỉnh sửa đánh giá ứng viên'
              this.work_experience.selected = res.data.data.work_experience
              this.work_form.selected = res.data.data.work_form
              this.origin.selected = res.data.data.origin
              this.desiredSalary = this.toCurrency(res.data.data.desired_salary)
              this.familyCircumstances = res.data.data.family_circumstances
              this.overall_rating = res.data.data.overall_rating
            }
          } else {
            helper.showMessage(res.data.message ? res.data.message : 'Failed', 'warning')
            this.closeModal()
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Đã có lỗi xảy ra !', 'warning')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
    .title {
        border-bottom: 1px #9b9b9b solid;
           .title__content {
             margin: 0;
             padding-bottom: 10px;
           }
    }
    .form__evaluate {
        padding: 20px 5px;
    }
</style>
