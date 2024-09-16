<template>
  <b-modal :class="'modal-custom modal-custom-500'" id='id-modal-confirm-complete-period' centered title="Xác nhận hoàn thành"
           @hidden="hideModalConfirm" hide-header hide-footer static>
    <div class="modal-header-custom text-center" style="line-height: 2rem">
      <span class="text-header"> {{ !isCompleteSuccess ? 'Xác nhận hoàn thành': 'Thông báo' }}</span>
      <button type="button" aria-label="Close" class="close" @click="hideModalConfirm()">×</button>
    </div>
    <div v-loading="loading" class="content-custom">
      <div class="content-custom" v-if="!isCompleteSuccess">
        <p>Xác nhận hoàn thành Buổi {{ currentPeriod }}:</p>
        <p v-if="+currentPeriod === +totalPeriod && +totalPeriod !== 0">Tiến độ lớp học chuyển sang Hoàn thành</p>
        <p v-else>Tiến độ lớp học chuyển sang Đang diễn ra Buổi {{ Number(currentPeriod) + 1 }}</p>
        <p>Bạn có chắc chắn muốn xác nhận ?</p>
      </div>
      <div class="content-custom text-align-center pb-0" v-else>
        <p>Hoàn thành buổi {{ currentPeriod }} thành công !</p>
      </div>
    </div>

    <div class="text-center mb-3">
      <b-btn size="md" class="mt-1 btn-outline-success rounded mb-2 font-initial btn-custom mr-4" @click="hideModalConfirm()">Đóng</b-btn>
      <b-btn :disabled="loading" size="md" class="mt-1 rounded mb-2 btn-ghtk font-initial btn-custom" v-if="!isCompleteSuccess" @click="confirm()">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="scss" scoped>
.modal-complete-custom {
    /deep/ .modal-dialog {
    max-width: 500px !important;
    width: 500px !important;
  }
}

.table-content-custom {
  max-height: 26rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.content-custom {
  padding: 0.5rem 1rem;
  p {
    margin-bottom: 0.8rem;
    font-size: 15px;
  }

  p:last-child {
    font-weight: 500;
  }
}

.btn-custom {
  line-height: 1rem;
  width: 8rem;
}

.text-color-black {
    color: black;
}

.text-header {
    font-size: 18px;
    font-weight: 500;
}
.modal-header-custom {
   background-color: #069255;
   color: white;
   position: relative;
   padding: 10px 10px;
   line-height: 2rem;
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

::placeholder {
  color: #828282;
}

</style>

<script>
// service

// helper
import Multiselect from 'vue-multiselect'
// service
import trainingService from 'domain/services/training-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-confirm-complete-period',

  components: {
    Multiselect
  },
  props: {
    dataConfirm: null
  },

  data: _ => ({
    loading: false,
    isCompleteSuccess: false,
    currentPeriod: 0,
    totalPeriod: 0
  }),

  created () {
  },

  watch: {
    'dataConfirm': {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (this.dataConfirm && this.dataConfirm.dataComplete) {
          this.currentPeriod = this.dataConfirm.dataComplete.order || 0
          this.totalPeriod = this.dataConfirm.dataComplete.total_periods || 0
        }
      },
      deep: true
    }
  },

  methods: {
    confirmCompletePeriod () {
      this.$bvModal.show('id-modal-confirm-complete-period')
    },

    hideModalConfirm () {
      this.$emit('closeModal')
      this.$bvModal.hide('id-modal-confirm-complete-period')
      if (this.isCompleteSuccess) {
        this.$bvModal.hide('modal-complete-period')
      }
      this.resetData()
    },

    resetData () {
      this.isCompleteSuccess = false
      this.currentPeriod = 0
      this.totalPeriod = 0
    },

    async confirm () {
      if (!this.dataConfirm) {
        return true
      }

      let dataReviews = {
        'class_period_id': null,
        'user_id': [],
        'learning_spirit': [],
        'assiduous': [],
        'note': []
      }
      let dataCompletePeriod = this.dataConfirm.dataComplete || null

      if (this.dataConfirm.dataComplete && this.dataConfirm.dataComplete.class_period_id) {
        dataReviews.class_period_id = this.dataConfirm.dataComplete.class_period_id
      }

      if (this.dataConfirm.dataReviews) {
        this.dataConfirm.dataReviews.forEach((item) => {
          if (item.user_id && (item.learning_spirit || item.assiduous || item.note)) {
            dataReviews.user_id.push(item.user_id)
            dataReviews.learning_spirit.push((item.learning_spirit && +item.learning_spirit.id) || null)
            dataReviews.assiduous.push((item.assiduous && +item.assiduous.id) || null)
            dataReviews.note.push((item.note) || null)
          }
        })
      }

      this.loading = true
      await Promise.all([
        // Call api lưu đánh giá:
        this.saveReviewListStudent(dataReviews),
        // Call api hoàn thành
        this.completePeriod(dataCompletePeriod)
      ]).then((values) => {
        if (values && values[1] && values[1] === 'complete-error') {
          this.isCompleteSuccess = false
          this.$bvModal.hide('modal-complete-period')
          this.$bvModal.hide('id-modal-confirm-complete-period')
        } else {
          this.isCompleteSuccess = true
        }
        this.$emit('refreshReview')
      }).catch((e) => {
        return helper.showMessage('Có lỗi xảy ra', 'warning')
      }).finally(() => {
        this.loading = false
      })
    },

    async saveReviewListStudent (data) {
      if (+data.user_id.length === 0 ||
        +data.learning_spirit.length === 0 ||
        +data.assiduous.length === 0 ||
        +data.note.length === 0
      ) {
        return true
      }

      try {
        const res = await trainingService.createEvaluate(data)
        if (res.data.success) {
          this.hideModal()
        } else {
          helper.showMessage(res.data.message || 'Có lỗi xảy ra khi đánh giá', 'warning')
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          helper.showMessage(e.response.data.message || 'Có lỗi xảy ra khi đánh giá', 'warning')
        }
      } finally {
      }
    },

    async completePeriod (data) {
      try {
        const res = await trainingService.completePeriod(data)
        if (res.data.success) {
          helper.showMessage(res.data.message, 'success')
        } else {
          if (res.data && res.data.data && res.data.data.not_graded_users && res.data.data.not_graded_users.length > 0) {
            this.$emit('showModalNotice', res.data.data.not_graded_users)
            return 'complete-error'
          } else {
            helper.showMessage(res.data.message || 'Gặp lỗi khi thêm ghi chú !', 'warning')
          }
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          helper.showMessage(e.response.data.message || 'Có lỗi xảy ra khi đánh giá', 'warning')
        }
      } finally {
      }
    }
  }
}
</script>
