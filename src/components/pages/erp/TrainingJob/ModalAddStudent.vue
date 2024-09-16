<template>
    <div>
        <b-modal :class="'modal-custom'" id='modal-add-student' title="Thêm học viên" header-class="justify-content-center header-modal-custom" size="lg" @hidden="hideModal" hide-footer static>
            <div class="program" id="student-info">
                <div class="d-flex row-modal" v-for="(student, idx) in listStudents" :key="idx">
                    <div class="w-45">
                        <span>{{student.name}} | {{student.username}}</span>
                    </div>
                    <div class="w-30">
                        <span>Kho: {{student.station}}</span>
                    </div>
                    <div class="w-20">
                        <span>Vị trí: {{student.position}}</span>
                    </div>
                    <div class="w-5 text-right text-danger font-larger">
                      <i class="fa fa-times-circle cursor-pointer" @click="deleteStudent(idx)"></i>
                    </div>
                </div>
                <div class="d-flex row-modal mt-1">
                    <div class="w-100">
                        <single-select-user
                              :custom-class="'multiselect-ghtk multiselect-no-horizontal'"
                              @select="handleSelectedStudent"
                              placeholder="Chọn học viên"
                              :classId="classId"
                              :statusId="statusId"
                              :reset-after="true"
                              :trainingSyllabusId="syllabus"
                              targetApi="hrm"
                        ></single-select-user>
                    </div>
                </div>
            </div>
            <div class="text-center mb-2 row-modal-bottom">
                <b-btn variant="ghtk" :disabled="loading" class="btn-submit" @click="addStudent()">Xác nhận</b-btn>
            </div>
        </b-modal>
    </div>
</template>

<style lang="css" scoped>
    .btn-submit {
        padding: 5px 25px;
        border-radius: 5px;
    }
    .program {
        padding: 0 20px;
    }
    .w-100 {
        width: 100% !important;
    }
    .w-81 {
        width: 81% !important;
    }
    .w-35 {
        width: 35% !important;
    }
    .w-20 {
        width: 20% !important;
    }
    .student-info {
        font-size: 14px;
        font-weight: 500;
        padding: 5px 0;
    }
    .row-modal-top {
      padding-top: 12px;
      padding-bottom: 6px;
    }
    .row-modal-bottom {
      padding-top: 6px;
      padding-bottom: 6px;
    }
    .row-modal {
      padding-top: 6px;
      padding-bottom: 6px;
    }
</style>

<script>
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import classService from '../../../../domain/services/class-service'

export default {
  name: 'ModalAddStudent',

  components: {
    SingleSelectStation,
    SingleSelectUser
  },

  props: ['classId', 'classPeriodId', 'syllabus'],

  data: _ => ({
    loading: false,
    listStudents: [],
    statusId: 3
  }),

  created () {
  },

  computed: {
  },

  watch: {

  },

  methods: {
    addStudent () {
      this.loading = true
      const data = {
        class_id: this.classId,
        class_period_id: this.classPeriodId,
        user_ids: this.listStudents.map(function (item) {
          return item.id
        })
      }

      classService.addClassStudent(data)
        .then((res) => {
          const {success, message} = res.data

          if (success) {
            helper.showMessage('Thêm học viên vào lớp thành công.', 'success')
            this.hideModal()
            this.$emit('refreshPage')
          } else {
            helper.showMessage(message, 'warning')
          }
        })
        .catch((e) => {
          if (e.response && e.response.data && e.response.data.message) {
            helper.showMessage(e.response.data.message, 'error')
          } else {
            helper.showMessage('Có lỗi xảy ra, vui lòng thử lại!', 'error')
          }
        })
        .then(() => {
          this.loading = false
          this.$stopLoading()
        })
    },

    handleSelectedStudent: function (option) {
      this.$startLoading()
      classService.checkCanAddStudentToClassOfTp({class_id: this.classId, student_id: option.id})
        .then(res => {
          if (res.data.success) {
            var student = option.name.split(' - ')
            this.listStudents.push({
              id: option.id,
              name: student[1],
              username: student[0],
              station: student[3],
              position: student[2]
            })
          } else {
            helper.showMessage(res.data.message)
            console.log(res.data.message)
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },
    deleteStudent (idx) {
      this.listStudents.splice(idx, 1)
    },

    hideModal () {
      this.$bvModal.hide('modal-add-student')
      this.listStudents = []
    }
  }
}
</script>
