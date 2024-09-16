<template>
    <div>
        <b-modal :class="'modal-custom modal-xss-custom'" centered id='modal-roll-up' title="Điểm danh" @hidden="hideModal" hide-header hide-footer static>
            <div class="modal-header-custom text-center">
                <span class="text-header">Điểm danh</span>
                <button type="button" aria-label="Close" class="close" @click="hideModal()">×</button>
            </div>
            <div class="student-roll-up" title="Danh sách học viên cần điểm danh">
                <div v-for="(student, idx) in listStudents" v-if="listStudents" class="d-flex">
                    <div class="image-user">
                        <img v-bind:src="student.image_profile" alt="">
                    </div>
                    <div class="ml-1 d-flex align-items-center">{{student.fullname}} - {{student.username}} - {{student.position}}</div>
                    <div class="d-flex align-items-center ml-auto">
                        <b-form-checkbox
                                :id="'checkbox-1' + + idx"
                                v-model="student.isRollup"
                                :name="'checkbox-' + idx"
                                value="yes"
                                class="checkbox-ghtk"
                                unchecked-value="no"
                        >
                        </b-form-checkbox>
                    </div>
                </div>
            </div>
            <div class="text-center mt-1 mb-1">
                <b-btn variant="ghtk" class="btn-roll-up-student" @click="rollUpListStudent()">Điểm danh</b-btn>
            </div>
        </b-modal>

    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="css" scoped>
    .student-roll-up {
        padding: 5px;
        font-weight: 500;
    }
    .image-user {
        padding: 5px 5px 5px 5px;
        width: 33px;
        height: 33px;
    }
    .image-user img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .text-header {
        font-size: 18px;
        font-weight: 500;
    }
    .modal-header-custom {
        background-color: #069255;
        color: white;
        position: relative;
        padding: 5px 10px;
    }
    .modal-header-custom .close {
        opacity: 0.8;
        color: white;
        font-size: 22px;
        font-weight: 400;
        position: absolute;
        top: 50%;
        right: 10px;
        margin: 0;
        padding: 0;
        line-height: 1.47;
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
    }
    .btn-roll-up-student {
        border-radius: 3px;
        padding: 3px 33px;
    }
</style>

<script>
// import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'
// service
import trainingService from 'domain/services/training-service'

// service

export default {
  name: 'modal-roll-up',

  components: {
  },

  props: [
    'listStudents',
    'order',
    'classId'
  ],

  data: _ => ({
  }),

  created () {
  },

  computed: {
  },

  watch: {
  },

  methods: {
    rollUpListStudent () {
      let data = {
        listStudents: this.listStudents,
        order: this.order,
        classId: this.classId
      }
      trainingService.rollUpListStudent(data)
        .then((res) => {
          if (res.data.success) {
            this.$emit('refreshPage')
            this.hideModal()
            helper.showMessage(res.data.message, 'success')
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi điểm danh !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.loading = false
        })
    },
    hideModal () {
      this.$bvModal.hide('modal-roll-up')
    }
  }
}
</script>
