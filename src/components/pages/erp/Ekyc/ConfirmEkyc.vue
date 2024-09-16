<template>
  <div v-loading="loading">
    <div v-if="error">
      <div class="col text-center">
        {{error}}
      </div>
      <div class="ml-3 mt-3">
        <div class="col text-center">
          <button class="rounded w-25 btn btn-sm btn-danger text-white" style="font-size: 16px" @click="$bvModal.show('modal-reason')">Từ chối</button>
        </div>
      </div>
    </div>
    <h3 v-else-if="helper.isEmpty(ekyc_data)" class="text-center">
      Chưa có thông tin eKYC
    </h3>
    <div class="confirm-e-kyc" v-else>
      <div class="mb-3 row" v-if="!helper.isEmpty(ekycImage.face_images)">
        <img v-for="(imgInfo, idx) in ekycImage.face_images" class="col-4" :key="`face-img-${idx}`"
             :src="imgInfo.link_path" :alt="imgInfo.type"/>
      </div>
      <div class="mb-3 row" v-if="!helper.isEmpty(ekycImage.identify_images)">
        <img v-for="(img, idx) in ekycImage.identify_images" :key="`ekyc-img-${idx}`" class="col-6" :src="img"
             alt="identify image"/>
      </div>
      <div class="row mb-3 ml-1" v-if="!helper.isEmpty(getEKycWarning)">
        <span class="w-100" style="color: #EA0505CC; font-size: 18px">
        <i class="fas fa-exclamation-triangle" style="color: #F2C94C; font-size: 15px"></i>
          {{getEKycWarning}}
        </span>
      </div>
      <div class="row mb-3 ml-1">
        <span class="w-100" style="font-size: 18px">
          Để đảm bảo tính chính xác của thông tin. Yêu cầu bạn kiểm tra lại kĩ các trường sau:
        </span>
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Họ và tên:</label>
        <b-form-input
          placeholder="Nhập họ và tên"
          class="col-md-9 text-left  fs-15"
          size="xs"
          type="text"
          v-model="ekyc_data.fullname.value"
        />
      </div>
      <div class="ml-3 row mt-2 input-number-no-arrows">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">CMND:</label>
        <b-form-input
          placeholder="Nhập CMND/CCCD"
          class="col-md-9 text-left fs-15"
          size="xs"
          type="number"
          v-model="ekyc_data.personal_id_number.value"
        />
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Ngày sinh:</label>
        <v-date-picker
          v-model="ekyc_data.birthday.value"
          :value="ekyc_data.birthday.value"
          locale="vi"
          class="col-md-9 p-0"
          color="green"
          :input-props="{ placeholder: 'Chọn ngày sinh', style: 'color: #4E5155; font-size: 15px; border-radius: unset;' }"
          :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Giới tính:</label>
        <b-form-select
          placeholder="Chọn giới tính"
          class="col-md-9 text-left  fs-15"
          size="xs"
          v-model="ekyc_data.gender.value"
          :options="[{ value: 'male', text: 'Nam' }, { value: 'female', text: 'Nữ' }]">
        </b-form-select>
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Quê quán:</label>
        <b-form-input
          placeholder="Nhập quê quán"
          class="col-md-9 text-left  fs-15"
          size="xs"
          type="text"
          v-model="ekyc_data.native_country_sub_district.value"
        />
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Nơi thường trú:</label>
        <b-form-input
          placeholder="Nhập nơi thường chú"
          class="col-md-9 text-left  fs-15"
          size="xs"
          type="text"
          v-model="ekyc_data.current_address_detail.value"
        />
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Nơi cấp:</label>
        <b-form-input
          placeholder="Nhập nơi cấp"
          class="col-md-9 text-left  fs-15"
          size="xs"
          type="text"
          v-model="ekyc_data.place_of_issue.value"
        />
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Ngày cấp:</label>
        <v-date-picker
          v-model="ekyc_data.issue_on.value" locale="vi"
           class="col-md-9 p-0"
          color="green"
          :input-props="{ placeholder: 'Chọn ngày cấp', style: 'color: #4E5155; font-size: 15px; border-radius: unset;' }"
          :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="ml-3 row mt-2">
        <label class="font-weight-bold col-md-2 mt-2 mr-4 text-left pl-0">Ngày hết hạn:</label>
        <v-date-picker
          v-model="ekyc_data.expired_date.value"
          :value="ekyc_data.expired_date.value"
          locale="vi"
          class="col-md-9 p-0"
          color="green"
          :popover="{visibility: 'focus'}"
          :input-props="{ placeholder: 'Chọn ngày hết hạn', style: 'color: #4E5155; font-size: 15px; border-radius: unset;' }"
        />
      </div>
      <b-form-checkbox
        class="ml-3 row mt-3 ghtk-checkbox"
        id="checkbox-1"
        v-model="acceptTerm"
        name="checkbox-1"
        :value="true"
        :unchecked-value="false"
      >
        Tôi cam kết những thông tin trên là chính xác, tôi sẽ chịu trách nhiệm trong trường hợp ảnh/thông tin bị sai!
      </b-form-checkbox>
      <div class="ml-3 mt-3">
        <div class="col text-center">
          <button
            :class="disabledConfirmButton ? 'btn-secondary' :  'btn-ghtk'"
            :disabled="disabledConfirmButton"
            class="rounded w-25 btn btn-sm text-white mr-3" style="font-size: 16px" @click="confirmIdentifyData"
          >Duyệt
          </button>
          <button class="rounded w-25 btn btn-sm btn-danger text-white" style="font-size: 16px" @click="$bvModal.show('modal-reason')">Từ chối</button>
        </div>
      </div>
    </div>
    <b-modal id="modal-reason" title="Từ chối thông tin eKYC" centered ref="note" title-class="w-100" header-class="text-center" hide-footer size="sm" @hide="reject_reason = null">
      <b-form-group label-size="lg">
        <textarea
          class="rounded form-control"
          v-model.trim="reject_reason"
          name="noteContent"
          rows="3"
          placeholder="Nhập lý do từ chối"
        ></textarea>
      </b-form-group>
      <div class="d-flex justify-content-between" v-loading="loading.note">
        <button class="btn btn-secondary rounded text-white lh-0-8" @click="$bvModal.hide('modal-reason')">Hủy</button>
        <button class="btn btn-ghtk rounded text-white lh-0-8" @click="rejectEkycData">Lưu</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
// Service
import ekycService from 'domain/services/ekyc-service'
import profileService from 'domain/services/profile-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
export default {
  name: 'confirm-ekyc',
  data () {
    return {
      loading: false,
      acceptTerm: false,
      reject_reason: null,
      ekycImage: {
        face_images: [],
        identify_images: []
      },
      ekyc_data: null,
      ekyc_status: null,
      face_score: null,
      total_action_ekyc: null,
      error: null
    }
  },
  props: {
    userInfo: {
      type: Object
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.getConfirmedEkycData()
          this.getEkycImages()
        }
      }}
  },
  computed: {
    helper: function () {
      return helper
    },
    getEKycWarning () {
      if (+this.face_score < 0.21 && +this.total_action_ekyc <= 3) return 'Hệ thống cảnh báo tỷ lệ khớp khuôn mặt ở mức thấp, vui lòng từ chối để EKYC lại!'
      if (+this.face_score < 0.21 && +this.total_action_ekyc > 3) return 'Hệ thống cảnh báo tỷ lệ khớp khuôn mặt ở mức thấp, vui lòng yêu cầu EKYC lại!'
      if ((+this.face_score >= 0.21 && +this.face_score < 0.42)) return 'Tỷ lệ khớp khuôn mặt ở mức trung bình!'
      return ''
    },
    disabledConfirmButton () {
      return +this.total_action_ekyc >= 1 && +this.total_action_ekyc <= 3 && +this.face_score < 0.21
    }
  },
  methods: {
    async getEkycImages () {
      try {
        this.loading = true
        const {data} = await ekycService.getEkycImages({
          userId: this.userInfo.user_id
        })
        if (data.success) {
          this.ekycImage = data.images
          if (!helper.isEmpty(this.ekycImage.identify_images)) await this.viewIdentify()
        } else helper.showMessage(data.message || 'Có lỗi xảy ra trong quá trình lấy ảnh ekyc')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
          helper.showMessage(e.response.data.message, 'warning')
        } else {
          helper.showMessage(e.message || 'Có lỗi xảy ra trong quá trình lấy ảnh ekyc', 'error')
        }
      } finally {
        this.loading = false
      }
    },
    async getConfirmedEkycData () {
      try {
        this.loading = true
        const {data} = await ekycService.getConfirmedEkycData({
          master_profile_id: this.userInfo.id
        })
        if (data.success) {
          this.ekyc_data = data.data
          this.ekyc_status = data.ekyc_status
          this.face_score = data.face_score
          this.total_action_ekyc = data.total_action_ekyc
          if (this.ekyc_data.birthday.value) this.ekyc_data.birthday.value = new Date(this.ekyc_data.birthday.value)
          if (this.ekyc_data.issue_on.value) this.ekyc_data.issue_on.value = new Date(this.ekyc_data.issue_on.value)
          if (this.ekyc_data.expired_date.value) this.ekyc_data.expired_date.value = new Date(this.ekyc_data.expired_date.value)
        } else if (data.error === 'not_found_ekyc_change_log') {
          this.error = data.message
        } else helper.showMessage(data.message || 'Có lỗi xảy ra trong quá trình lấy thông tin ekyc')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
          helper.showMessage(e.response.data.message, 'warning')
        } else {
          helper.showMessage(e.message || 'Có lỗi xảy ra trong quá trình lấy thông tin ekyc', 'error')
        }
      } finally {
        this.loading = false
      }
    },
    validateEkycData: function () {
      if (!this.acceptTerm) return 'Vui lòng chọn cam kết xác nhận trước khi duyệt!'
      if (helper.isEmpty(this.ekyc_data.personal_id_number.value)) return 'Thiếu thông tin CCCD/CMND!'
      if (helper.isEmpty(this.ekyc_data.fullname.value)) return 'Thiếu thông tin họ và tên!'
      if (helper.isEmpty(this.ekyc_data.birthday.value)) return 'Thiếu thông tin ngày sinh!'
      if (helper.isEmpty(this.ekyc_data.gender.value)) return 'Thiếu thông tin giới tính!'
      if (helper.isEmpty(this.ekyc_data.issue_on.value)) return 'Thiếu thông tin ngày cấp!'
      if (helper.isEmpty(this.ekyc_data.place_of_issue.value)) return 'Thiếu thông tin nơi cấp!'
      if (helper.isEmpty(this.ekyc_data.native_country_sub_district.value)) return 'Thiếu thông tin quê quán'
      if (helper.isEmpty(this.ekyc_data.current_address_detail.value)) return 'Thiếu thông tin nơi thường trú!'
      // if (helper.isEmpty(this.ekyc_data.expired_date.value)) return 'Thiếu thông tin ngày hết hạn!'
    },
    async confirmIdentifyData () {
      let validateMsg = this.validateEkycData()
      if (!helper.isEmpty(validateMsg)) return helper.showMessage(validateMsg)
      try {
        this.loading = true
        const {data} = await ekycService.confirmIdentifyData({
          master_profile_id: this.userInfo.id,
          personal_id_number: this.ekyc_data.personal_id_number.value,
          fullname: this.ekyc_data.fullname.value,
          birthday: helper.formatDate(this.ekyc_data.birthday.value, 'YYYY-MM-DD'),
          gender: this.ekyc_data.gender.value,
          issue_on: helper.formatDate(this.ekyc_data.issue_on.value, 'YYYY-MM-DD'),
          place_of_issue: this.ekyc_data.place_of_issue.value,
          domicile: this.ekyc_data.native_country_sub_district.value,
          permanent_address: this.ekyc_data.current_address_detail.value,
          expired_date: helper.formatDate(this.ekyc_data.expired_date.value, 'YYYY-MM-DD')
        })
        if (data.success) {
          this.$emit('reloadPage')
          helper.showMessage(data.message || 'Duyệt EKYC thành công', 'success')
        } else helper.showMessage(data.message || 'Có lỗi xảy ra trong quá trình duyệt thông tin ekyc')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
          helper.showMessage(e.response.data.message, 'warning')
        } else {
          helper.showMessage(e.message || 'Có lỗi xảy ra trong quá trình duyệt thông tin ekyc', 'error')
        }
      } finally {
        this.loading = false
      }
    },
    async rejectEkycData () {
      try {
        this.loading = true
        const {data} = await ekycService.rejectEkycData({
          master_profile_id: this.userInfo.id,
          reason: this.reject_reason
        })
        if (data.success) {
          this.$bvModal.hide('modal-reason')
          this.$emit('reloadPage')
          this.$emit('refresh')
          helper.showMessage(data.message || 'Từ chối EKYC thành công', 'success')
        } else helper.showMessage(data.message || 'Có lỗi xảy ra trong quá trình từ chối thông tin ekyc')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.message.length > 0) {
          helper.showMessage(e.response.data.message, 'warning')
        } else {
          helper.showMessage(e.message || 'Có lỗi xảy ra trong quá trình từ chối thông tin ekyc', 'error')
        }
      } finally {
        this.loading = false
      }
    },
    async viewIdentify () {
      const {data} = await profileService.getOriginImage({urls: this.ekycImage.identify_images})
      let urls = []
      data.urls.forEach(item => urls.push(item.path))
      this.ekycImage.identify_images = urls
    }
  }
}
</script>

<style scoped>
.custom-control.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before, .custom-control.custom-radio .custom-control-input:checked ~ .custom-control-label::before {
  border-color: #069255 !important;
  background-color: #069255 !important;
}
.fs-15 {
  font-size: 15px;
}
.confirm-e-kyc > * {
  color: #000;
}
</style>
