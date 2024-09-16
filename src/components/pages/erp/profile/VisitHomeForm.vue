<template>
<div v-loading="loading">
  <b-alert :show="!!noti.staffCode" variant="warning">
    <b>Lưu ý: </b> <span v-html="noti.staffCode"></span>
  </b-alert>
  <b-form-row>
    <b-form-group class="col-md-3" v-show="selectStaff">
      <span slot="label">{{ infoTypeDesc.staff_code }} <span class="text-danger" v-show="requiredField.staff_code">*</span></span>
      <input
        type="number"
        class="form-control"
        :class="{ 'is-invalid': visitInfo.staff_code === '' }"
        v-model="visitInfo.staff_code"
      />
    </b-form-group>
    <b-form-group label="Họ và tên nhân viên" class="col-md-3" v-show="selectStaff">
      <span slot="label">{{ infoTypeDesc.fullname }} <span class="text-danger" v-show="requiredField.fullname">*</span></span>
      <b-input v-model="visitInfo.fullname" disabled></b-input>
    </b-form-group>
    <b-form-group label="Người đi thăm" class="col-md-3">
      <span slot="label">{{ infoTypeDesc.user_visit_home }} <span class="text-danger" v-show="requiredField.user_visit_home">*</span></span>
      <SelectUser
        v-model="visitInfo.user_visit_home"
      />
    </b-form-group>
    <b-form-group label="Ngày thăm nhà" class="col-md-3 z-100">
      <span slot="label">{{ infoTypeDesc.date_visit_home }} <span class="text-danger" v-show="requiredField.date_visit_home">*</span></span>
      <datepicker
        :language="vi"
        v-model="visitInfo.date_visit_home"
        placeholder=""
        format="dd-MM-yyyy"
        :bootstrapStyling="true"
        :monday-first="true"
        :full-month-name="true"
        :required = "true"
        :calendar-button="true"
        calendar-button-icon="ion ion-md-calendar"
        :clear-button="true"
      />
    </b-form-group>
  </b-form-row>

  <b-form-row>
    <b-form-group label="NLĐ hiểu về trách nhiệm bảo lãnh" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.guardian_know_responsibility }} <span class="text-danger" v-show="requiredField.guardian_know_responsibility">*</span></span>
      <b-select :options="yesNoOptions" v-model="visitInfo.guardian_know_responsibility"></b-select>
    </b-form-group>
    <b-form-group label="Tình hình việc làm của NBL" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.guardian_work_state }} <span class="text-danger" v-show="requiredField.guardian_work_state">*</span></span>
      <b-select :options="workStateOptions" v-model="visitInfo.guardian_work_state"></b-select>
    </b-form-group>
    <b-form-group label="NBL đồng ý bảo lãnh" class="col-md-3">
      <span slot="label">{{ infoTypeDesc.guardian_agree }} <span class="text-danger" v-show="requiredField.guardian_agree">*</span></span>
      <b-select :options="yesNoOptions" v-model="visitInfo.guardian_agree"></b-select>
    </b-form-group>
    <b-form-group label="Nhân viên chia sẻ gì về định hướng gắn bó?" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.employee_career_path }} <span class="text-danger" v-show="requiredField.employee_career_path">*</span></span>
      <b-select :options="careerPathOptions" v-model="visitInfo.employee_career_path"></b-select>
    </b-form-group>

    <b-form-group label="Nhân viên kể gì về công việc ở GHTK?" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.employee_sharing }} <span class="text-danger" v-show="requiredField.employee_sharing">*</span></span>
      <textarea class="form-control" rows="1" v-model.trim="visitInfo.employee_sharing"></textarea>
    </b-form-group>
    <b-form-group label="Tình hình kinh tế gia đình" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.family_economic }} <span class="text-danger" v-show="requiredField.family_economic">*</span></span>
      <b-select :options="familyEconomicOptions" v-model="visitInfo.family_economic"></b-select>
    </b-form-group>
    <b-form-group label="Nhân viên có phải trụ cột kinh tế gia đình không?" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.is_breadwinner }} <span class="text-danger" v-show="requiredField.is_breadwinner">*</span></span>
      <b-select :options="yesNoOptions" v-model="visitInfo.is_breadwinner"></b-select>
    </b-form-group>
    <b-form-group label="Tính cách nhân viên qua đánh giá của NBL" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.character_by_guardian }} <span class="text-danger" v-show="requiredField.character_by_guardian">*</span></span>
      <textarea
        class="form-control" rows="1"
        v-model.trim="visitInfo.character_by_guardian"
      ></textarea>
    </b-form-group>

<!--    Định vị nhà của NBL-->

    <b-form-group label="Định vị nhà của NBL" class="col-md-3" label-class="text-overflow-ellipsis">
      <span slot="label">{{ infoTypeDesc.locate_guardian_house}} <span class="text-danger" v-if="!fromProfileUser">*</span></span>
      <input
        type="text"
        placeholder="Nhập"
        @input="checkValidLocateData()"
        v-model="visitInfo.locate_guardian_house"
        class="form-control"
      />
      <span class="text-danger d-inline-block mt-1" v-if="!isValidLocate"> {{ messageError }} </span>
    </b-form-group>
  </b-form-row>

  <b-form-row>
    <b-form-group label="Ghi chú" class="col-md-6">
      <span slot="label">{{ infoTypeDesc.note }} <span class="text-danger" v-show="requiredField.note">*</span></span>
      <textarea class="form-control" rows="2" v-model.trim="visitInfo.note"></textarea>
    </b-form-group>
    <b-form-group label="Ảnh check-in tại nhà NBL" class="col-md-6">
      <span slot="label">{{ infoTypeDesc.file_visit }} <span class="text-danger" v-show="requiredField.file_visit">*</span></span>
      <FileViewUpload
        class="d-inline-block"
        :input-id="'file_visit'"
        :input-style="{ width: '3.75rem' }"
        :hideUploadButton="true"
        height="3.75rem"
        :edit="true"
        input-placeholder="Thêm ảnh"
        :files="visitInfo.file_visit"
        :file-add="visitInfo.file_visit_add"
        :file-delete="visitInfo.file_visit_delete"
      />
    </b-form-group>
  </b-form-row>

  <!--  Người bảo lãnh-->
  <b-form-row class="mt-1" v-if="!fromProfileUser">
    <b-form-group label="Trạng thái duyệt" class="col-md-3">
      <b-form-select
        :disabled="true"
        v-model="guardian.status"
        :options="options.statusBltndsOption"
      />
    </b-form-group>
    <b-form-group label="Lý do duyệt/từ chối" class="col-md-3 z-100">
      <Multiselect
        multiple
        :disabled="true"
        v-model="guardian.bltnds_reason"
        :options="guardian.status === 'rejected' ? options.rejectBltndsOption : options.approveBltndsOption"
        track-by="value"
        label="text"
        placeholder=""
        select-label=""
        deselectLabel="X"
      ></Multiselect>
    </b-form-group>
    <b-form-group label="Mối quan hệ với NLĐ" class="col-md-3">
      <SingleSelectRelation
        :disabled="true"
        v-model="guardian.relation"
        relationOption="guardian"
      />
    </b-form-group>
    <b-form-group label="Họ và tên" class="col-md-3">
      <b-input  :disabled="true" type="text" v-model.trim="guardian.fullname" />
    </b-form-group>
    <b-form-group label="Số điện thoại" class="col-md-3">
      <b-input
        :disabled="true"
        type="text"
        v-model.trim="guardian.phone"
        name="guardian-phone"
      >
      </b-input>
    </b-form-group>

    <b-form-group label="Ngày sinh người bảo lãnh" class="col-md-3">
      <Datepicker
        :disabled="true"
        v-model="guardian.birthday"
        placeholder=""
        format="dd-MM-yyyy"
        :bootstrapStyling="true"
        :monday-first="true"
        :full-month-name="true"
        :required = "true"
        :calendar-button="true"
        calendar-button-icon="ion ion-md-calendar"
        :clear-button="true"
      />
    </b-form-group>
    <b-form-group label="CMND/CCCD" class="col-md-3">
      <b-input
        :disabled="true"
        v-model.trim="guardian.personal_id"
        id="guardian-personal-id"
        name="guardian-personal-id"
      />
    </b-form-group>
    <b-form-group label="Ngày cấp CMND/CCCD" class="col-md-3">
      <Datepicker
        :disabled="true"
        v-model="guardian.personal_id_date"
        placeholder=""
        format="dd-MM-yyyy"
        :bootstrapStyling="true"
        :monday-first="true"
        :full-month-name="true"
        :required = "true"
        :calendar-button="true"
        calendar-button-icon="ion ion-md-calendar"
        :clear-button="true"
      />
    </b-form-group>
    <b-form-group label="Nơi cấp CMND/CCCD" class="col-md-3">
      <single-select-poi-identity-card
        :is-disabled="true"
        :placeholder="''"
        :provinceId="guardian.personal_id_place">
      </single-select-poi-identity-card>
    </b-form-group>
    <b-form-group label="Nơi xác thực giấy bảo lãnh" class="col-md-3">
                                                <textarea
                                                  :disabled="true"
                                                  class="form-control" rows="1"
                                                  v-model.trim="guardian.license_place"
                                                ></textarea>
    </b-form-group>
    <b-form-group label="Thông tin khai thác thêm từ NBL" class="col-md-3">
                                                <textarea
                                                  :disabled="true"
                                                  class="form-control"
                                                  rows="1"
                                                  v-model.trim="guardian.other_info"
                                                ></textarea>
    </b-form-group>
    <b-form-group label="Ghi chú" class="col-md-3">
      <textarea
        :disabled="true"
        class="form-control"
        rows="1"
        v-model.trim="guardian.note"
      ></textarea>
    </b-form-group>

    <b-form-row class="px-0 mx-0 col-md-12">
      <div class="col-md-6 col-lg-6 col-xl-6">
        <h6 class="mb-2">Nơi đăng ký hộ khẩu thường trú</h6>
        <b-form-row>
          <div class="col-md-4">
            <single-select-province
              :placeholder="''"
              :is-disabled="true"
              :provinceId="guardian.resident_province"
            ></single-select-province>
          </div>
          <div class="col-md-4">
            <single-select-district
              :placeholder="''"
              :is-disabled="true"
              :provinceId="guardian.resident_province"
              :districtId="guardian.resident_district"
            ></single-select-district>
          </div>
          <div class="col-md-4">
            <single-select-sub-district
              :placeholder="''"
              :is-disabled="true"
              :districtId="guardian.resident_district"
              :subDistrictId="guardian.resident_sub_district"
            ></single-select-sub-district>
          </div>
          <b-form-group class="col-md-12 mt-2" label="Chi tiết thường trú">
            <span slot="label">Chi tiết thường trú</span>
            <b-form-textarea
              :disabled="true"
              v-model="guardian.resident_detail"
              name="resident-address-detail"
              rows="1"
            ></b-form-textarea>
          </b-form-group>
        </b-form-row>
      </div>
      <div class="col-md-6 col-lg-6 col-xl-6">
        <h6 class="mb-2">Địa chỉ hiện tại</h6>
        <b-form-row>
          <div class="col-md-4">
            <single-select-province
              :placeholder="''"
              :is-disabled="true"
              :provinceId="guardian.current_province"
            ></single-select-province>
          </div>
          <div class="col-md-4">
            <single-select-district
              :placeholder="''"
              :is-disabled="true"
              :provinceId="guardian.current_province"
              :districtId="guardian.current_district"
            ></single-select-district>
          </div>
          <div class="col-md-4">
            <single-select-sub-district
              :placeholder="''"
              :is-disabled="true"
              :districtId="guardian.current_district"
              :subDistrictId="guardian.current_sub_district"
            ></single-select-sub-district>
          </div>
          <b-form-group class="col-md-12 mt-2" label="Chi tiết chỗ ở">
            <span slot="label">Chi tiết chỗ ở</span>
            <b-form-textarea
              :disabled="true"
              v-model="guardian.current_detail"
              placeholder="Chi tiết chỗ ở"
              rows="1"
            ></b-form-textarea>
          </b-form-group>
        </b-form-row>
      </div>
    </b-form-row>
  </b-form-row>

  <div class="text-center">
    <b-btn v-if="updateButton" variant="ghtk" @click="updateVisitHomeInfo(visitInfo)" class="w-5re">Lưu</b-btn>
  </div>
</div>
</template>

<script>
// custom component
import SelectUser from 'components/elements/common/SelectUser'
import FileViewUpload from 'components/elements/common/FileViewUpload'

// built-in component
import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

// service
import staffInfoService from 'domain/services/staff-info-service'
// helper
import helper from 'infrastructures/helpers/common-helpers'

import StaffInfo from 'domain/entities/StaffInfo.js'
import Multiselect from 'vue-multiselect'
import {approveBltndsOption, rejectBltndsOption} from '../ProfileManager/OptionConst.js'

import SingleSelectRelation from 'components/elements/common/SingleSelectRelation'
import SingleSelectPoiIdentityCard from 'components/elements/common/SingleSelectPoiIdentityCard'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
export default {
  name: 'visit-home-form',

  components: {
    Multiselect,
    Datepicker,
    SelectUser,
    FileViewUpload,
    SingleSelectRelation,
    SingleSelectPoiIdentityCard,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict
  },

  props: {
    selectStaff: {
      type: Boolean,
      default: false
    },
    updateButton: {
      type: Boolean,
      default: false
    },
    requiredField: {
      type: Object,
      default: _ => ({})
    },
    visitInfo: {
      type: Object,
      default: _ => ({})
    },
    // Nếu được import vào màn edit user thì sẽ k hiện phần thông tin người bảo lãnh do đã có r
    fromProfileUser: {
      type: Boolean,
      default: false
    }
  },

  data: _ => ({
    loading: false,
    infoTypeDesc: StaffInfo.infoTypeDesc,

    yesNoOptions: StaffInfo.yesNoOptions,
    workStateOptions: StaffInfo.workStateOptions,
    careerPathOptions: StaffInfo.careerPathOptions,
    familyEconomicOptions: StaffInfo.familyEconomicOptions,

    noti: {
      staffCode: null
    },
    guardian: { // thông tin người bảo lãnh trách nhiệm dân sự
      status: null,
      bltnds_reason: [],
      resident_province: null,
      resident_district: null,
      resident_sub_district: null,
      resident_detail: null,
      current_province: null,
      current_district: null,
      current_sub_district: null,
      current_detail: null
    },
    isValidLocate: true,
    messageError: '',
    options: {
      statusBltndsOption: [
        { text: 'Duyệt', value: 'approved', disabled: false },
        { text: 'Từ chối', value: 'rejected', disabled: false }
      ],
      approveBltndsOption: approveBltndsOption,
      rejectBltndsOption: rejectBltndsOption
    }
  }),

  watch: {
    'visitInfo.staff_code': function (newVal) {
      this.checkStaffCode()
    }
  },

  computed: {
    vi: _ => (vi)
  },

  methods: {
    checkStaffCode () {
      if (!this.visitInfo.staff_code) {
        this.noti.staffCode = null
        helper.resetData(this.visitInfo, 'staff_code')
        helper.resetData(this.guardian)
        return
      }
      if (this.visitInfo.staff_code.length < 8) {
        this.noti.staffCode = 'Mã nhân viên phải bao gồm 8 ký tự số VD: 00345678'
        helper.resetData(this.visitInfo, 'staff_code')
        helper.resetData(this.guardian)
        return
      }

      if (this.visitInfo.staff_code.length > 8) {
        this.noti.staffCode = 'Mã nhân viên phải bao gồm 8 ký tự số VD: 00345678'
        helper.resetData(this.visitInfo, 'staff_code')
        helper.resetData(this.guardian)
        return
      }

      if (this.visitInfo.staff_code.length === 8) {
        this.noti.staffCode = null
        this.getVisitHomeInfo(+this.visitInfo.staff_code)
        this.getGuardian(+this.visitInfo.staff_code)
      }
    },

    checkValidLocateData () {
      this.messageError = ''
      if (this.visitInfo && this.visitInfo.locate_guardian_house) {
        if (this.visitInfo.locate_guardian_house.length > 100) {
          this.messageError = 'Nhập tối đa 100 kí tự'
        }

        if (this.visitInfo.locate_guardian_house.length < 7) {
          this.messageError = 'Nhập tối thiểu 7 kí tự'
        }

        let arr = this.visitInfo.locate_guardian_house.split('') || []
        let allowChar = ['', '.', ',']
        if (arr.length > 0) {
          for (let i in arr) {
            if (isNaN(+arr[i]) && !allowChar.includes(arr[i])) {
              this.messageError = 'Chỉ được nhập các số từ 0-9, dấu (.) (,) và khoảng trắng.'
              break
            }
          }
        }
      }

      if (this.messageError.length > 0) {
        this.isValidLocate = false
      } else {
        this.isValidLocate = true
      }
    },

    validateVisitInfo (visitInfo) {
      let missingField = []
      for (const typeInfo in this.requiredField || []) {
        if (typeInfo === 'file_visit') {
          if (visitInfo.file_visit_add.length + visitInfo.file_visit.length <= visitInfo.file_visit_delete.length) {
            missingField.push(this.infoTypeDesc[typeInfo] || typeInfo)
          }
          continue
        }
        if (helper.isEmpty(visitInfo[typeInfo]) && visitInfo[typeInfo] !== 0) missingField.push(this.infoTypeDesc[typeInfo] || typeInfo)
      }

      return missingField
    },

    async updateVisitHomeInfo (visitInfo) {
      let missingField = this.validateVisitInfo(visitInfo)
      if (missingField && missingField.length) {
        alert('Vui lòng nhập đủ thông tin:\n- ' + missingField.join('\n- '))
        return
      }
      if (!this.isValidLocate) {
        alert('Định dạng trường Định vị thăm nhà chưa đúng')
        return
      }
      let dataUpdate = helper.createFormData(visitInfo)
      dataUpdate.append('master_profile_id', +visitInfo.staff_code)
      dataUpdate.delete('fullname')
      this.loading = true
      const {data} = await staffInfoService.updateVisitHomeInfo(dataUpdate)
      this.loading = false
      if (data.success) {
        helper.showMessage(data.message || 'Cập nhật thông tin thăm nhà thành công !', 'success')
        this.getVisitHomeInfo(+this.visitInfo.staff_code)
      } else helper.showMessage(data.message || 'Có lỗi khi cập nhật thông tin thăm nhà !')

      this.$emit('update', data)
    },

    async getVisitHomeInfo (masterProfileId, getProfileInfo = true) {
      if (!masterProfileId) return
      this.loading = true
      const {data} = await staffInfoService.getVisitHomeInfo({ master_profile_id: masterProfileId, get_profile_info: getProfileInfo })
      this.loading = false
      if (data.success) {
        this.noti.staffCode = null
        if (!helper.isEmpty(data.data)) {
          for (const key in data.data) {
            this.visitInfo[key] = data.data[key]
          }
          if (!data.data.date_visit_home) {
            helper.resetData(this.visitInfo, ['staff_code', 'fullname'])
          }

          this.visitInfo.file_visit_add.length = 0
          this.visitInfo.file_visit_delete.length = 0
        } else if (!helper.isEmpty(this.visitInfo)) helper.resetData(this.visitInfo)
        else this.visitInfo = {}
      } else {
        this.noti.staffCode = data.message
        helper.showMessage(data.message || 'Có lỗi khi lấy thông tin thăm nhà !')
      }
    },

    getGuardian: async function (masterProfileId) {
      this.loading = true
      try {
        const res = await staffInfoService.getGuardian({master_profile_id: masterProfileId})
        if (res.data.success) {
          if (!helper.isEmpty(res.data.data)) {
            if (!res.data.data.bltnds_reason) res.data.data.bltnds_reason = []
            this.guardian = res.data.data
          } else if (!helper.isEmpty(this.guardian)) helper.resetData(this.guardian)
          else this.guardian = {}
        } else {
          helper.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        console.log(e)
        helper.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
