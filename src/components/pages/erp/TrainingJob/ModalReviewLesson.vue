<template>
  <b-modal :class="'modal-custom modal-custom-730'" id='id-modal-review-lesson' centered
           @hidden="hideModal" hide-header hide-footer static>
    <div class="modal-header-custom text-center">
      <span class="text-header">Đánh giá học viên</span>
      <button type="button" aria-label="Close" class="close" style="font-size: 27px" @click="hideModal()">×</button>
    </div>
    <div v-loading="loading">
      <div class="p-4">
        <b-row class="d-flex align-items-center m-0 p-0">
          <div class="pr-0">
            <b class="b-label">1. Tinh thần học tập</b>
          </div>

          <div class="pr-0 pr-0 mt-3 mb-4">
            <div class="review-options">
              <div v-for="(item, index) in ReviewStudentEntity.learningSpirits" :key="'status_learning_spirit_'+index" class="px-1 d-inline-block wrap-reviews tooltip-container">
                  <b-button
                    :variant="isActiveTabLearningSpirit === 'status_learning_spirit_' + item.id ? 'ghtk' : 'outline-ghtk-color-custom'"
                    :id="'id_btn_review_' + index"
                    class="rounded pd-5 w-100 btn-pill btn-reviews"
                    :class="(isActiveTabLearningSpirit !== 'status_learning_spirit_' + item.id) && isPeriodFinished ? 'no-hover' : ''"
                    @click="handleChoiceReview(item, 'learning-spirit')"
                    @mouseover="showTooltip(index)"
                    @mouseout="hideTooltip(index)"
                  >
                    <span>{{ item.name }}</span>
                  </b-button>
                <div class="tooltip-content" :id="'tooltip_' + index">{{ item.tooltip }}</div>
              </div>
            </div>
          </div>

        </b-row>

        <b-row class="d-flex align-items-center mb-2" style="margin: 0; padding: 0;">
          <div class="pr-0">
            <b class="b-label">2. Chuyên cần</b>
          </div>

          <div class="pr-0 pr-0 mt-3 mb-4">
            <div class="review-options">
              <div v-for="(item, index) in ReviewStudentEntity.attitudes" :key="'status_attitude_' + index" class="px-1 d-inline-block wrap-reviews">
                <b-btn
                  :variant="isActiveTabAttitude === 'status_attitude_'+item.id ? 'ghtk' : 'outline-ghtk-color-custom'"
                  class="rounded pd-5 w-100 btn-pill btn-reviews"
                  :class="(isActiveTabAttitude !== 'status_attitude_'+item.id) && isPeriodFinished ? 'no-hover' : ''"
                  @click="handleChoiceReview(item, 'attitude')">
                  <span>{{ item.name }}</span>
                </b-btn>
              </div>
            </div>
          </div>

        </b-row>

        <div class="align-items-center m-0 p-0">
          <div class="pr-0">
            <b class="b-label">3. Nhận xét riêng (nếu có)</b>
          </div>

          <div class="pr-0 pr-0 mt-3 mb-2">
            <b-form-input
              v-model="params.note"
              placeholder="Nhập nhận xét..."
              :disabled="isPeriodFinished"
            >
            </b-form-input>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center">
      <b-btn size="md" class="rounded mb-3 btn-ghtk font-initial btn-saveReviews" :disabled="isDisabled || isPeriodFinished" @click="saveReviews">Xác nhận</b-btn>
    </div>
  </b-modal>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style scoped lang="scss">
.modal-custom-730 {
  /deep/ .modal-dialog {
    max-width: 730px !important;
    width: 730px !important;
  }
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
  transform: translate(0, -50%);
}
::placeholder {
  color: #828282;
}
.b-label {
  font-size: 16px;
  font-weight: 500;
}

.wrap-reviews{
  margin-right: 0.5rem;
}

.review-options {
  white-space: nowrap;
}
.btn-reviews {
  width: 158px !important;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip-content {
  display: none;
  background-color: #505050;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  top: 118%;
  left: 10%;
  transition: opacity 0.3s;
  white-space: normal;
  width: 259px;
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 15px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
  }
}
.no-hover {
  &:hover {
    background: #EAEAEA !important;
    border-color: #EAEAEA !important;
    color: #069255 !important;
  }
}

.btn-saveReviews {
  line-height: 1rem;
  width: 8rem;
}

</style>

<script>
import trainingService from 'domain/services/training-service'
import ReviewStudentEntity from 'domain/entities/ReviewsStudentEntity'
// helper

import commonHelpers from 'infrastructures/helpers/common-helpers'
import Multiselect from 'vue-multiselect'

export default {
  name: 'modal-review-lesson',

  components: {
    Multiselect,
    trainingService,
    commonHelpers,
    ReviewStudentEntity
  },
  props: {
    dataReviews: null
  },

  data: _ => ({
    loading: false,
    isActiveTabLearningSpirit: '',
    isActiveTabAttitude: '',
    params: {
      learningSpirit: null,
      attitude: null,
      note: null
    },
    isDisabled: true,
    isPeriodFinished: false
  }),

  created () {
  },

  computed: {
    ReviewStudentEntity () {
      return ReviewStudentEntity
    }
  },

  watch: {
    dataReviews: function (val, oldVal) {
      this.initDataModal()
    },
    'params.note': function (val, oldVal) {
      if (this.params.note && this.params.note.length > 0) {
        this.isDisabled = false
      } else {
        if (!this.params.learningSpirit && !this.params.attitude) {
          this.isDisabled = true
        }
      }
    }
  },

  methods: {
    initDataModal () {
      if (this.dataReviews) {
        this.resetData()
        this.getEvaluateByUserAndPeriod()
        if (this.dataReviews.status_period === 'finished') {
          this.isPeriodFinished = true
        }
      }
    },

    resetData () {
      this.isActiveTabLearningSpirit = ''
      this.isActiveTabAttitude = ''
      this.isPeriodFinished = false
      this.params.learningSpirit = null
      this.params.attitude = null
      this.params.note = null
      this.isDisabled = true
    },

    async getEvaluateByUserAndPeriod () {
      if (!this.dataReviews || !this.dataReviews.class_period_id || !this.dataReviews.user_id) {
        return true
      }

      let params = {
        class_period_id: this.dataReviews.class_period_id,
        user_id: [this.dataReviews.user_id]
      }

      this.loading = true
      try {
        const res = await trainingService.getEvaluateByUserAndPeriod(params)
        if (res.data.success) {
          let results = null
          if (res.data.data && res.data.data[0]) {
            results = res.data.data[0]
          }

          if (results) {
            if (results.learning_spirit) {
              this.isActiveTabLearningSpirit = 'status_learning_spirit_' + results.learning_spirit
              this.params.learningSpirit = results.learning_spirit
            }

            if (results.assiduous) {
              this.isActiveTabAttitude = 'status_attitude_' + results.assiduous
              this.params.assiduous = results.assiduous
            }

            if (results.note) {
              this.params.note = results.note
            }
          }
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra khi lấy thông tin đánh giá', 'warning')
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    async saveReviews () {
      if (this.isDisabled) {
        return true
      }

      let dataValidate = this.validateData()
      if (!dataValidate.success) {
        return commonHelpers.showMessage(dataValidate.message, 'warning')
      }

      let params = {
        class_period_id: this.dataReviews.class_period_id,
        user_id: [this.dataReviews.user_id]
      }

      if (this.params.learningSpirit) {
        params.learning_spirit = [this.params.learningSpirit]
      }

      if (this.params.attitude) {
        params.assiduous = [this.params.attitude]
      }

      if (this.params.note) {
        params.note = [this.params.note]
      }

      this.loading = true
      try {
        const res = await trainingService.createEvaluate(params)
        if (res.data.success) {
          commonHelpers.showMessage(res.data.message || 'Thành công', 'success')
          this.$emit('refreshReview')
          this.hideModal()
        } else {
          commonHelpers.showMessage(res.data.message || 'Có lỗi xảy ra khi đánh giá', 'warning')
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          commonHelpers.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    validateData () {
      if (!this.dataReviews) {
        return {
          success: false,
          message: 'Thông tin đánh giá trống !'
        }
      } else {
        if (!this.dataReviews.class_period_id) {
          return {
            success: false,
            message: 'Không xác định được buổi học !'
          }
        }

        if (!this.dataReviews.user_id) {
          return {
            success: false,
            message: 'Không xác định được user cần đánh giá !'
          }
        }

        if (!this.dataReviews.user_id) {
          return {
            success: false,
            message: 'Không xác định được user cần đánh giá !'
          }
        }
      }

      if (!this.params.learningSpirit && !this.params.attitude && !this.params.note) {
        return {
          success: false,
          message: 'Vui lòng chọn đánh giá !'
        }
      }

      return {
        success: true
      }
    },

    showTooltip (index) {
      document.getElementById('tooltip_' + index).style.display = 'block'
    },
    hideTooltip (index) {
      document.getElementById('tooltip_' + index).style.display = 'none'
    },

    hideModal () {
      this.$bvModal.hide('id-modal-review-lesson')
    },

    handleChoiceReview (data, type) {
      if (this.isPeriodFinished) {
        return true
      }

      switch (type) {
        case 'learning-spirit':
          if (this.isActiveTabLearningSpirit === 'status_learning_spirit_' + data.id) {
            this.isActiveTabLearningSpirit = ''
            this.params.learningSpirit = null
            if (!this.params.attitude && !this.params.note) {
              this.isDisabled = true
            }
          } else {
            this.isActiveTabLearningSpirit = 'status_learning_spirit_' + data.id
            this.params.learningSpirit = data.id
            this.isDisabled = false
          }
          break
        case 'attitude':
          if (this.isActiveTabAttitude === 'status_attitude_' + data.id) {
            this.isActiveTabAttitude = ''
            this.params.attitude = null
            if (!this.params.learningSpirit && !this.params.note) {
              this.isDisabled = true
            }
          } else {
            this.isActiveTabAttitude = 'status_attitude_' + data.id
            this.isDisabled = false
            this.params.attitude = data.id
          }
          break
      }
    }
  }

}
</script>
