<template>
  <div class="modal-report-wrong-ekyc">
    <b-modal id="modal-report-wrong-ekyc" ref="reportWrongEkycModalRef"
             header-class="justify-content-center" size="lg" @hidden="onCloseModal" footer-class="justify-content-center" static>
      <div slot="modal-title">
        Đề xuất báo sai thông tin eKYC
      </div>
      <div v-loading="">
        <div v-if="!isEmpty(currentEkycInfo)">
          <div class="modal-report-wrong-ekyc__list-image">
            <div class="modal-report-wrong-ekyc__list-image-item" v-for="(imageUrl, index) in currentEkycInfo.card_images" :key="index">
              <img :src="imageUrl" alt="">
            </div>
          </div>
          <p style="margin: 10px 0;">Để tạo đề xuất báo sai cho NLĐ, hãy kiểm tra kĩ các trường thông tin sau trên CMND/CCCD và chỉnh sửa thành thông tin đúng</p>
          <div class="rw-form-row">
            <div class="rw-form-row__left font-weight">Họ và tên</div>
            <div class="rw-form-row__right">
              <b-form-input
                v-model="currentEkycInfo.card_data.fullname"
                name="fullname"
                v-validate="'required'"
                placeholder="Họ tên"
                :class="{'is-danger': errors.has('fullname')}"
              >
              </b-form-input>
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">CMND/CCCD</div>
            <div class="rw-form-row__right">
              <b-form-input
                v-model="currentEkycInfo.card_data.personal_id_number"
                name="personal_id_number"
                v-validate="'required'"
                placeholder="Số CMND/CCCD"
                :class="{'is-danger': errors.has('personal_id_number')}"
              >
              </b-form-input>
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">Ngày sinh</div>
            <div class="rw-form-row__right">
              <datepicker
                v-model="currentEkycInfo.card_data.birthday"
                name="birthday"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                placeholder="Ngày sinh"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                v-validate="'required'"
                :class="{'is-danger': errors.has('birthday')}"
              />
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">Nguyên quán</div>
            <div class="rw-form-row__right">
              <b-form-input
                v-model="currentEkycInfo.card_data.ekyc_domicile"
                name="ekyc_domicile"
                v-validate="'required'"
                placeholder="Nguyên quán"
                :class="{'is-danger': errors.has('ekyc_domicile')}"
              >
              </b-form-input>
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">Địa chỉ thường trú</div>
            <div class="rw-form-row__right">
              <b-form-input
                v-model="currentEkycInfo.card_data.ekyc_permanent_address"
                name="ekyc_permanent_address"
                v-validate="'required'"
                placeholder="Địa chỉ thường trú"
                :class="{'is-danger': errors.has('ekyc_permanent_address')}"
              >
              </b-form-input>
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">Nơi cấp</div>
            <div class="rw-form-row__right">
              <b-form-input
                v-model="currentEkycInfo.card_data.ekyc_place_of_issue"
                name="ekyc_place_of_issue"
                v-validate="'required'"
                placeholder="Nơi cấp"
                :class="{'is-danger': errors.has('ekyc_place_of_issue')}"
              >
              </b-form-input>
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">Ngày cấp</div>
            <div class="rw-form-row__right">
              <datepicker
                v-model="currentEkycInfo.card_data.ekyc_issue_on"
                name="ekyc_issue_on"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                placeholder="Ngày cấp"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                v-validate="'required'"
                :class="{'is-danger': errors.has('ekyc_issue_on')}"
              />
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">Ngày hết hạn</div>
            <div class="rw-form-row__right">
              <datepicker
                v-model="currentEkycInfo.card_data.card_expired_date"
                name="card_expired_date"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                placeholder="Ngày hết hạn"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                v-validate="'required'"
                :class="{'is-danger': errors.has('card_expired_date')}"
              />
            </div>
          </div>
          <div class="rw-form-row">
            <div class="rw-form-row__left">Giới tính</div>
            <div class="rw-form-row__right">
              <b-form-select
                placeholder="Chọn giới tính"
                v-model="currentEkycInfo.card_data.gender"
                :options="[{ value: 'male', text: 'Nam' }, { value: 'female', text: 'Nữ' }]">
                name="gender"
                v-validate="'required'"
                :class="{'is-danger': errors.has('gender')}"
              </b-form-select>
            </div>
          </div>
          <div class="d-flex mt-4 ghtk-checkbox">
            <b-checkbox
              v-model="hasConfirmedInfo"
              :value="true"
              :unchecked-value="false"
            >
            </b-checkbox>
            <p  style="margin: 0;" @click="checkConfirmedInfo()">Tôi cam kết những thông tin trên là chính xác, tôi sẽ chịu trách nhiệm trong trường hợp ảnh/ thông tin bị sai!</p>
          </div>
        </div>
      </div>
      <template slot="modal-footer">
        <button type="button" class="btn btn-success" :disabled="!hasConfirmedInfo" @click="reportEkyc()">Đề xuất cập nhật</button>
      </template>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
  .modal-report-wrong-ekyc {
    &__footer {
      justify-content: center;
    }

    &__list-image {
      display: flex;
      justify-content: space-between;

      &-item {
        flex-grow: 1;
        margin-right: 5px;

        &:last-child {
          margin-right: 0;
        }
      }

      img {
        width: 100%;
        height: auto;
      }
    }

    .rw-form-row {
      display: flex;
      margin-bottom: 3px;

      &__left {
        flex-basis: 180px;
        display: flex;
        align-items: center;
      }

      &__right {
        flex-grow: 1;
      }
    }

    .is-danger {
      border-color: #E0B4B4;
      color: #9F3A38;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import profileService from 'domain/services/profile-service'
import VeeValidate from 'vee-validate'
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
Vue.use(VeeValidate)
export default {
  name: 'modal-report-wrong-ekyc',

  components: {
    Datepicker
  },

  props: {
    isShow: {
      default: false,
      type: Boolean
    },
    profileId: {
      type: String,
      required: true
    }
  },

  data: () => ({
    isLoading: false,
    currentEkycInfo: {},
    hasConfirmedInfo: false
    // currentEkycInfo: {
    //   card_data: {
    //     personal_id_number: '1811222331',
    //     fullname: 'Nguyen Van A',
    //     birthday: '1997-09-12',
    //     ekyc_domicile: '122',
    //     ekyc_permanent_address: '122',
    //     ekyc_place_of_issue: '122',
    //     ekyc_issue_on: '2021-09-12',
    //     card_expired_date: '2030-09-12',
    //     gender: 'male'
    //   }
    // }
  }),

  created () {
  },

  watch: {
    isShow (newValue, oldValue) {
      if (newValue) {
        if (commonHelper.isEmpty(this.currentEkycInfo)) {
          this.getEkycInfo()
        }
        this.showModal()
      }
    }
  },

  methods: {
    checkConfirmedInfo () {
      this.hasConfirmedInfo = !this.hasConfirmedInfo
    },

    async getEkycInfo () {
      this.isLoading = true
      let res = await profileService.getEkycInfo({ master_profile_id: this.profileId })
      if (res.data.success) {
        this.currentEkycInfo = res.data.data
      } else {
        commonHelper.showMessage(res.data.message, 'warning')
      }
      this.isLoading = false
    },

    async reportEkyc () {
      this.isLoading = true
      let dataReport = this.currentEkycInfo.card_data
      dataReport.master_profile_id = this.profileId
      let res = await profileService.reportWrongEkycData(dataReport)
      if (res.data.success) {
        commonHelper.showMessage('Gửi báo sai thành công', 'success')
        this.$emit('reportSuccessful', true)
        this.hideModal()
      } else {
        commonHelper.showMessage(res.data.message, 'warning')
      }
      this.isLoading = false
    },

    isEmpty (data) {
      return commonHelper.isEmpty(data)
    },

    toggleModal (isDisplay) {
      this.isShowModal = isDisplay
    },
    hideModal () {
      this.$refs.reportWrongEkycModalRef.hide()
    },

    showModal () {
      this.$refs.reportWrongEkycModalRef.show()
    },

    onCloseModal () {
      this.$emit('closeModal')
    }
  }
}
</script>
