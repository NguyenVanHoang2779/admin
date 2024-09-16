<template>
  <b-modal
    :class="customClass" size="sm" :id="modalId"
    :header-class="'text-center justify-content-center d-flex modal-attendance'"
    @hidden="$bvModal.hide(modalId)"
    :title="checkinStatus === 'yes' ? 'Hủy điểm danh' : 'Điểm danh'"
    static centered hide-footer
  >
    <div class="text-black text-nowrap">
      Bạn có muốn {{checkinStatus === 'yes' ? 'hủy' : ''}} điểm danh học viên này không?
    </div>
    <div class="text-center mt-1 mb-1">
      <b-btn variant="ghtk" class="btn-roll-up-student rounded mt-2" style="width: 7rem;" @click="submit">Đồng ý</b-btn>
    </div>
  </b-modal>
</template>

<script>
// service
import trainingService from 'domain/services/training-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-attendance',
  props: {
    modalId: {
      default: 'modal-attendance'
    },
    customClass: {
      default: ''
    },
    classId: {
      default: null
    },
    classAcademyInfoId: {
      default: null
    },
    masterId: {
      default: null
    },
    checkinStatus: {
      default: null
    },
    classDetail: {
      default: null
    }
  },
  data: _ => ({
    note: null
  }),
  methods: {
    submit () {
      if (this.checkinStatus === 'yes') this.cancelRollupStudent()
      else this.rollUpStudent()
    },
    rollUpStudent () {
      let data = {
        class_academy_info_id: this.classAcademyInfoId
      }
      trainingService.rollUpStudent(data)
        .then((res) => {
          if (res.data.success) {
            this.$emit('actionAttendance', {action: 'rollUpStudent', class_period_id: this.classAcademyInfoId, master_id: this.masterId})
            this.$bvModal.hide(this.modalId)
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
    cancelRollupStudent () {
      let data = {
        id: this.classAcademyInfoId,
        classId: this.classDetail.class.id,
        masterId: this.masterId
      }
      trainingService.cancelRollupStudent(data)
        .then((res) => {
          if (res.data.success) {
            this.$emit('actionAttendance', {action: 'cancelRollupStudent', class_period_id: this.classAcademyInfoId, master_id: this.masterId})
            this.$bvModal.hide(this.modalId)
            helper.showMessage(res.data.message, 'success')
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi hủy điểm danh !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
