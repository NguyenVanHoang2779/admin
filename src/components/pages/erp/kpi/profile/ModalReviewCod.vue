<template>
  <div>
    <b-modal id="modal-review-cod" ref="modalReviewCod" @hidden="resetDefault">
          <template #modal-header="{ close }">
            <div style="display: flex;align-items: center; width: 100%;">
              <button type="button" class="btn btn-success" style="background: #00904A;" @click="hideModal()"><i
                class="fas fa-angle-left"></i></button>
              <div style="text-align: center; width: 85%;"><p style="margin: 0px;">Đánh giá</p></div>
            </div>
          </template>
          <div class="display-center">
            <input type="radio" name="green_status" id="rd-1" value="0" v-model="status"
                   style="width: 15px; height: 15px;"/><label for="rd-1" class="radio-button">Hài lòng</label>
            <input type="radio" name="green_status" id="rd-2" value="1" v-model="status"
                   style="width: 15px; height: 15px;"/><label for="rd-2" class="radio-button">Không hài lòng</label>
          </div>
          <div>
            <div v-if="status == 0" style="display: flex; margin-top: 20px;">
              <div style="width: 80px; margin-right: 10px;">
                <label>Lý do:</label>
              </div>
              <div class="display-flex-wrap my-buttons">
                <b-form-group
                  label=""
                  v-slot="{ ariaDescribedby }"
                >
                  <b-form-checkbox-group
                    v-model="valueReviewGod"
                    :options="typeReviewGod"
                    :aria-describedby="ariaDescribedby"
                    buttons
                    button-variant="outline-success"
                    size="lg"
                    name="buttons-2"
                  ></b-form-checkbox-group>
                </b-form-group>
              </div>
            </div>
            <div v-else style="display: flex; margin-top: 20px;">
              <div style="width: 80px; margin-right: 10px;">
                <label>Lý do:</label>
              </div>
              <div class="display-flex-wrap my-buttons">
                <b-form-group
                  label=""
                  v-slot="{ ariaDescribedby }"
                >
                  <b-form-checkbox-group
                    v-model="valueReviewBad"
                    :options="typeReviewBad"
                    :aria-describedby="ariaDescribedby"
                    buttons
                    button-variant="outline-success"
                    size="lg"
                    name="buttons-2"
                  ></b-form-checkbox-group>
                </b-form-group>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div>
                <label for="type-review-text-2" style="margin-right: 10px;width: 60px;">Khác:</label>
                <input type="text" id="type-review-text-2" name="type-review-text" placeholder="Nhập" v-if="status == 0" v-model="typeReviewGodText">
                <input type="text" id="type-review-text-3" name="type-review-text" placeholder="Nhập" v-else v-model="typeReviewBadText">
              </div>
              <div>
                <label for="content-review" style="margin-right: 10px;width: 60px;">Ghi chú:</label>
                <input type="text" id="content-review" name="content-review" placeholder="Nhập" v-model="contentReview">
              </div>
            </div>
          </div>
          <template #modal-footer="{ close }">
            <div style="display: flex;align-items: center; width: 100%;">
              <b-button variant="success" name="modal-review-cod-btn-confirm" id="modal-review-cod-btn-confirm" style="background: #00904A; width: 100%;" :disabled="disabled"
                      @click="addReviewCod()">Xác nhận
              </b-button>
            </div>
          </template>
    </b-modal>
  </div>
</template>
<style src="@/assets/sass/components/kpi-cod-profile.scss" lang="scss"></style>
<style scoped >
input[name="green_status"] {
  accent-color: #00904A;
}
.radio-button {
  font-size: 15px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 0px;
}

.display-center {
  display: flex;
  align-items: center;
  text-align: center;
}
.display-flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
input[type=text] {
  border: 0px solid #fff;
  border-bottom: 1px solid #c1bebe;
  outline: none;
}
::placeholder {
  color: #888888;
  opacity: 1; /* Firefox */
}
input[type=text]:focus {
  border: 0px solid #fff;
  border-bottom: 1px solid #c1bebe;
}
</style>

<script>
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import kpiProfilesService from 'domain/services/kpi-profiles-service'
import Moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'modal-review-cod',

  components: {
    SweetModal,
    SweetModalTab,
    Moment,
    commonHelper,
    kpiProfilesService
  },

  props: [
    'user',
    'pkg_order',
    'trigger',
    'type'
  ],

  data: () => ({
    status: '0',
    optionsStatus: [
      { text: 'Hài lòng', value: '0' },
      { text: 'Không hài lòng', value: '1' }
    ],
    headerBgVariant: 'success',
    typeReviewGod: [
      {text: 'Năng suất cao', value: 'Năng suất cao'},
      {text: 'Nghiệp vụ tốt', value: 'Nghiệp vụ tốt'},
      {text: 'Shop, KH đánh giá tốt', value: 'Shop, KH đánh giá tốt'},
      {text: 'Chủ động, hỗ trợ', value: 'Chủ động, hỗ trợ'},
      {text: 'Vượt khó', value: 'Vượt khó'},
      {text: 'Sáng tạo cải tiến', value: 'Sáng tạo cải tiến'}
    ],
    typeReviewBad: [
      {text: 'Sai nghiệp vụ', value: 'Sai nghiệp vụ'},
      {text: 'Shop, KH khiếu nại', value: 'Shop, KH khiếu nại'},
      {text: 'Shop, KH đánh giá xấu', value: 'Shop, KH đánh giá xấu'},
      {text: 'Thiếu tương tác', value: 'Thiếu tương tác'},
      {text: 'Thái độ làm việc kém', value: 'Thái độ làm việc kém'}
    ],
    valueReviewGod: [],
    valueReviewBad: [],
    typeReviewGodText: '',
    typeReviewBadText: '',
    contentReview: '',
    disabled: true
  }),

  created () {
  },

  watch: {
    trigger: function () {
      this.$refs['modalReviewCod'].show()
    },
    contentReview: function () {
      this.checkDisable()
    },
    typeReviewGodText: function () {
      this.checkDisable()
    },
    typeReviewBadText: function () {
      this.checkDisable()
    },
    valueReviewGod: function () {
      this.checkDisable()
    },
    valueReviewBad: function () {
      this.checkDisable()
    },
    status: function () {
      this.checkDisable()
    },
    type: function () {
      if (this.type === 'XLHH') {
        this.typeReviewGod = [
          {text: 'Năng suất cao', value: 'Năng suất cao'},
          {text: 'Nghiệp vụ tốt', value: 'Nghiệp vụ tốt'},
          {text: 'Chủ động, hỗ trợ', value: 'Chủ động, hỗ trợ'},
          {text: 'Vượt khó', value: 'Vượt khó'},
          {text: 'Sáng tạo cải tiến', value: 'Sáng tạo cải tiến'}
        ]
        this.typeReviewBad = [
          {text: 'Sai nghiệp vụ', value: 'Sai nghiệp vụ'},
          {text: 'Thiếu tương tác', value: 'Thiếu tương tác'},
          {text: 'Thái độ làm việc kém', value: 'Thái độ làm việc kém'}
        ]
      } else {
        this.typeReviewGod = [
          {text: 'Năng suất cao', value: 'Năng suất cao'},
          {text: 'Nghiệp vụ tốt', value: 'Nghiệp vụ tốt'},
          {text: 'Shop, KH đánh giá tốt', value: 'Shop, KH đánh giá tốt'},
          {text: 'Chủ động, hỗ trợ', value: 'Chủ động, hỗ trợ'},
          {text: 'Vượt khó', value: 'Vượt khó'},
          {text: 'Sáng tạo cải tiến', value: 'Sáng tạo cải tiến'}
        ]
        this.typeReviewBad = [
          {text: 'Sai nghiệp vụ', value: 'Sai nghiệp vụ'},
          {text: 'Shop, KH khiếu nại', value: 'Shop, KH khiếu nại'},
          {text: 'Shop, KH đánh giá xấu', value: 'Shop, KH đánh giá xấu'},
          {text: 'Thiếu tương tác', value: 'Thiếu tương tác'},
          {text: 'Thái độ làm việc kém', value: 'Thái độ làm việc kém'}
        ]
      }
    }
  },

  methods: {
    checkDisable () {
      if (this.contentReview &&
        ((this.status === '0' && (this.valueReviewGod.length > 0 || this.typeReviewGodText !== '')) ||
        (this.status === '1' && (this.valueReviewBad.length > 0 || this.typeReviewBadText !== '')))) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    hideModal () {
      this.$refs.modalReviewCod.hide()
    },
    resetDefault () {
      this.valueReviewGod = []
      this.valueReviewBad = []
      this.typeReviewGodText = ''
      this.typeReviewBadText = ''
      this.contentReview = ''
    },
    addReviewCod () {
      let parmas = {
        user_id: this.user,
        status_review: this.status,
        note: this.contentReview,
        reason: []
      }
      parmas.reason = []
      if (this.status) {
        parmas.reason = this.valueReviewBad
        if (this.typeReviewBadText) {
          parmas.reason.push(this.typeReviewBadText)
        }
      } else {
        parmas.reason = this.valueReviewGod
        if (this.typeReviewGodText) {
          parmas.reason.push(this.typeReviewGodText)
        }
      }
      kpiProfilesService.addReviewCod(parmas)
        .then((res) => {
          if (res.data.success) {
            commonHelper.showMessage(res.data.message, 'success')
            this.hideModal()
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
