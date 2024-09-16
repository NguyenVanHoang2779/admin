<template>
  <b-modal modal-class="modal-custom" centered  static id="modal-review-student" @hide="resetModal()"  hide-footer hide-header>
    <div class="modal-title-contact">
      <span>Đánh giá học viên</span>
    </div>
    <div class="modal-review-student">
      <div>
        <b-form-textarea
          size="lg"
          placeholder="Nhập ghi chú, đánh giá học viên"
          rows="4"
          v-model="review"
        ></b-form-textarea>
      </div>
    </div>
    <div class="text-center mt-3 mb-2">
      <b-btn variant="secondary" class="button-deny-modal" @click="closeModal()">Đóng</b-btn>
      <b-btn variant="ghtk" id='student-btn-save-add-note' name='student-btn-save-add-note' class="button-deny-modal" @click="reviewStudent()">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>
<style lang="scss" scoped>
::placeholder {
  color: #828282;
}
.button-close-modal-contact {
  border-radius: 5px;
  padding: 5px 30px;
}
.button-deny-modal {
  width: 100px;
  border-radius: 5px;
  padding: 5px 0px;
}
.modal-title-contact {
  text-align: center;
  padding-top: 6px;
  padding-bottom: 6px;
  font-size: 18px;
  color: white;
  background: #069255;
}
.modal-review-student {
  padding: 20px;
  font-size: 16px;
  color: #000;
}

</style>

<script>

// helper
import helper from 'infrastructures/helpers/common-helpers'

// service
import trainingService from '../../../../domain/services/training-service'
import {eventBus} from '../../../../main'
export default {
  name: 'ModalReviewStudent',
  props: {
    studentId: {
      default: null
    },
    classId: {
      default: null
    }
  },
  data () {
    return {
      review: null
    }
  },
  methods: {
    resetModal () {
      this.review = null
    },

    async reviewStudent () {
      let data = {}
      data['student_id'] = this.studentId
      data['review'] = this.review
      data['class_id'] = this.classId
      this.isLoading = true
      try {
        const res = await trainingService.reviewStudentAtEndCourse(data)
        if (res.data.success) {
          this.closeModal()
          this.$emit('reviewStudentSuccess')
          eventBus.$emit('reviewStudentSuccess', {studentId: this.studentId, log: res.data.data.message_log})
          helper.showMessage(res.data.message, 'success')
        } else {
          helper.showMessage(res.data.message)
          this.review = ''
        }
      } catch (e) {
        console.log(e)
        helper.showMessage('Đã có lỗi xảy ra')
      } finally {
        this.closeModal()
      }
    },

    closeModal () {
      this.$bvModal.hide('modal-review-student')
    }
  }
}
</script>

<style scoped>

</style>
