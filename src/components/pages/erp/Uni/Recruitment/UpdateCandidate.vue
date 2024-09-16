<template>
  <div>
      <div class="top-title row mb-3">
          <h2 class="col-md-3">{{ 'Chỉnh sửa thông tin ứng viên' }}</h2>
          <div class="top-title__right-button col-md-4 text-right"  style="margin-left: auto; margin-right: 0">
              <b-btn @click="openLink('/adm/staff-work/recruitment')" class="btn btn-default" title="Về màn quản lý ứng viên"><i class="ion ion-ios-return-left"></i> Quay lại</b-btn>
          </div>
      </div>
      <div class="row">
          <div class="col-md-12">
              <div class="card mb-4">
                  <div class="row no-gutters">
                      <div class="col-md-12 col-lg-12 col-xl-12">
                          <h6 class="card-header">
                            <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-personal-info><i class="ion  ion-ios-add-circle"></i> THÔNG TIN CÁ NHÂN</a>
                          </h6>
                          <b-collapse id="collapse-personal-info" visible>
                              <b-form-row>
                                  <div class="col-md-12 col-lg-12 col-xl-12">
                                  <div class="card-body">
                                      <b-form-row>
                                          <b-form-group class="col-md-3">
                                              <template slot='label'>
                                                  Họ và tên <span class='red-text'>(*)</span>
                                              </template>
                                              <b-form-input
                                                  placeholder="Họ và tên"
                                                  v-model="user_info.name"
                                                  :state="user_info.name === '' ? false : null"
                                              >
                                              </b-form-input>
                                          </b-form-group>
                                          <b-form-group class="col-md-3">
                                              <template slot='label'>
                                                  Số CMND/CCCD
                                              </template>
                                              <b-form-input
                                                placeholder="Số CMND/CCCD"
                                                type='number'
                                                v-model="user_info.card_id"
                                              >
                                              </b-form-input>
                                          </b-form-group>
                                          <b-form-group class="col-md-3" :state="user_info.place_issue_card_id  === '' ? false : null">
                                              <template slot='label'>
                                                  Nơi cấp
                                              </template>
                                              <single-select-poi-identity-card
                                                  :state="user_info.place_issue_card_id === '' ? false : null"
                                                  :placeholder="'Nơi cấp CMND'"
                                                  @handleSelectedProvince="handleSelectSingle(...arguments, user_info, ['place_issue_card_id'])"
                                                  :provinceId="user_info.place_issue_card_id">
                                              </single-select-poi-identity-card>
                                          </b-form-group>
                                          <b-form-group class="col-md-3">
                                              <template slot='label'>
                                                  Ngày cấp CMND
                                              </template>
                                              <datepicker
                                                  :input-class="{'isValid': (user_info.date_issue_card_id === null)}"
                                                  v-model="user_info.date_issue_card_id"
                                                  format="dd-MM-yyyy"
                                                  :bootstrapStyling="true"
                                                  :monday-first="true"
                                                  :full-month-name="true"
                                                  :calendar-button="true"
                                                  calendar-button-icon="ion ion-md-calendar"
                                                  :clear-button="true"
                                                  placeholder="Ngày cấp CMND"
                                              />
                                            <span v-show="user_info.date_issue_card_id === ''" class="is-danger">Không để trống trường này </span>
                                          </b-form-group>
                                      </b-form-row>
                                      <b-form-row>
                                          <b-form-group class="col-md-3">
                                              <template slot='label'>
                                                  Ngày sinh
                                              </template>
                                              <datepicker
                                                  v-model="user_info.birthday"
                                                  name="birthday"
                                                  format="dd-MM-yyyy"
                                                  :bootstrapStyling="true"
                                                  :monday-first="true"
                                                  :full-month-name="true"
                                                  :calendar-button="true"
                                                  calendar-button-icon="ion ion-md-calendar"
                                                  :clear-button="true"
                                                  placeholder="Ngày sinh"
                                              />
                                          </b-form-group>
                                          <b-form-group class="col-md-3">
                                            <template slot='label'>
                                              Giới tính
                                            </template>
                                            <b-form-select
                                              v-model="user_info.gender"
                                              :options="infoOptions.gender"
                                            >
                                            </b-form-select>
                                          </b-form-group>
                                          <b-form-group class="col-md-3">
                                              <template slot='label'>
                                                  Số điện thoại <span class='red-text'>(*)</span>
                                              </template>
                                              <b-form-input
                                                  v-model="user_info.phone"
                                                  type="number"
                                                  :state="(user_info.phone === '' || (user_info.phone && user_info.phone.length !== 10)) ? false : null"
                                                  placeholder="Số điện thoại"
                                                  @blur="validatePhone(user_info.phone)"
                                              >
                                              </b-form-input>
                                              <span v-if="(user_info.phone && user_info.phone.length !== 10)" class="is-danger">Số điện thoại không hợp lệ</span>
                                          </b-form-group>
                                          <b-form-group id="input-group-phone" class="col-md-3">
                                              <template slot='label'>
                                                Email
                                              </template>
                                              <b-form-input v-model="user_info.email" @blur="validateEmail(user_info.email)" type="email" placeholder="Email"></b-form-input>
                                          </b-form-group>
                                      </b-form-row>
                                      <b-form-row>
                                          <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                              <div>
                                                  <div class="col-form-label">Hộ khẩu thường trú </div>
                                                  <b-form-row>
                                                      <single-select-province
                                                          class="col-md-4 select-element"
                                                          @handleSelectedProvince="handleSelectedLocation(...arguments, user_info.resident_address, ['resident_address_province'])"
                                                          :state="user_info.resident_address.resident_address_province === '' ? false : null"
                                                          :provinceId="user_info.resident_address.resident_address_province"
                                                      >
                                                      </single-select-province>
                                                      <single-select-district
                                                          class="col-md-4 select-element"
                                                          @handleSelectedDistrict="handleSelectedLocation(...arguments, user_info.resident_address, ['resident_address_district'])"
                                                          :provinceId="user_info.resident_address.resident_address_province"
                                                          :districtId="user_info.resident_address.resident_address_district"
                                                      >
                                                      </single-select-district>
                                                      <single-select-sub-district
                                                        class="col-md-4 select-element"
                                                        @handleSelectedSubDistrict="handleSelectedLocation(...arguments, user_info.resident_address, ['resident_address_sub_district'])"
                                                        :districtId="user_info.resident_address.resident_address_district"
                                                        :subDistrictId="user_info.resident_address.resident_address_sub_district"
                                                      >
                                                      </single-select-sub-district>
                                                      <b-form-group class="col-md-12">
                                                          <b-form-textarea
                                                              v-model="user_info.resident_address.resident_address_detail"
                                                              placeholder="Số nhà, tên tổ/thôn/xóm/đường/ấp (nếu có)"
                                                              rows="1"
                                                          >
                                                          </b-form-textarea>
                                                      </b-form-group>
                                                  </b-form-row>
                                              </div>
                                          </div>
                                          <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                              <div>
                                                  <div class="col-form-label">Địa chỉ hiện tại<span class='red-text'>(*)</span></div>
                                                  <b-form-row>
                                                      <single-select-province
                                                          class="col-md-4 select-element"
                                                          @handleSelectedProvince="handleSelectedLocation(...arguments, user_info.current_address,  ['current_address_province'])"
                                                          :state="user_info.current_address.current_address_province === '' ? false : null"
                                                          :provinceId="user_info.current_address.current_address_province"
                                                      >
                                                      </single-select-province>
                                                      <single-select-district
                                                          class="col-md-4 select-element"
                                                          @handleSelectedDistrict="handleSelectedLocation(...arguments, user_info.current_address, ['current_address_district'])"
                                                          :state="user_info.current_address.current_address_district === '' ? false : null"
                                                          :provinceId="user_info.current_address.current_address_province"
                                                          :districtId="user_info.current_address.current_address_district"
                                                      >
                                                      </single-select-district>
                                                      <single-select-sub-district
                                                          class="col-md-4 select-element"
                                                          @handleSelectedSubDistrict="handleSelectedLocation(...arguments, user_info.current_address, ['current_address_sub_district'])"
                                                          :state="user_info.current_address.current_address_sub_district === '' ? false : null"
                                                          :districtId="user_info.current_address.current_address_district"
                                                          :subDistrictId="user_info.current_address.current_address_sub_district"
                                                      >
                                                      </single-select-sub-district>
                                                      <b-form-group class="col-md-12">
                                                        <b-form-textarea
                                                          v-model="user_info.current_address.current_address_detail"
                                                          placeholder="Số nhà, tên tổ/thôn/xóm/đường/ấp (nếu có)"
                                                          rows="1"
                                                        >
                                                        </b-form-textarea>
                                                      </b-form-group>
                                                  </b-form-row>
                                              </div>
                                          </div>
                                      </b-form-row>
                                      <b-form-row>
                                          <b-form-group class="col-md-3">
                                              <template slot="label">
                                                  Nguồn tuyển dụng <span class='red-text'>(*)</span>
                                              </template>
                                              <SelectSourceRecruitment
                                                  :disable="user_info.source === 'employee'"
                                                  :source="user_info.source"
                                                  @selected-option-changed="handleSelectSingle(...arguments, user_info, ['source'])"
                                              >
                                              </SelectSourceRecruitment>
                                          </b-form-group>
                                          <b-form-group class="col-md-3">
                                              <template slot="label">
                                                  Kênh tuyển dụng <span class='red-text'>(*)</span>
                                              </template>
                                              <div>
                                                  <div v-if="user_info.source === 'employee'">
                                                      <SelectReferrer
                                                        :disable="true"
                                                        :referrerId="user_info.channel"
                                                        @selected-option-changed="handleSelectSingle(...arguments, user_info, ['channel'])"
                                                      >
                                                      </SelectReferrer>
                                                  </div>
                                                  <div v-else-if="user_info.source === 'web' || user_info.source === 'social_network'">
                                                      <SelectChannelRecruitment
                                                        :channel="user_info.channel"
                                                        :source="user_info.source"
                                                        @selected-option-changed="handleSelectSingle(...arguments, user_info, ['channel'])"
                                                      >
                                                      </SelectChannelRecruitment>
                                                  </div>
                                                  <div v-else>
                                                    <b-form-input v-model="user_info.channel"></b-form-input>
                                                  </div>
                                              </div>
                                          </b-form-group>
                                          <b-form-group class="col-md-3" label="Ngày ứng tuyển">
                                              <datepicker
                                                  v-model="user_info.apply_date"
                                                  name="apply_date"
                                                  format="dd-MM-yyyy"
                                                  :bootstrapStyling="true"
                                                  :monday-first="true"
                                                  :full-month-name="true"
                                                  :calendar-button="true"
                                                  calendar-button-icon="ion ion-md-calendar"
                                                  :clear-button="true"
                                              />
                                          </b-form-group>
                                          <b-form-group label="Có dùng smart phone HĐH Android không?" class="col-md-3 text-center">
                                            <b-form-radio-group name="use-smart-phone" v-model="user_info.device_android">
                                                <b-form-radio :value="1">Có</b-form-radio>
                                                <b-form-radio :value="0">Không</b-form-radio>
                                            </b-form-radio-group>
                                          </b-form-group>
                                          </b-form-row>
                                  </div>
                                </div>
                              </b-form-row>
                          </b-collapse>
                      </div>
                  </div>
              </div>
          </div>
          <hr class="border-light container-m--x mt-0 mb-4">
          <br/>
      </div>

      <div class="row">
          <div class="col-md-12">
              <div class="card mb-4">
                  <div class="row no-gutters">
                  <div class="col-md-12 col-lg-12 col-xl-12">
                      <h6 class="card-header">
                        <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-apply-info><i class="ion  ion-ios-add-circle"></i> THÔNG TIN ỨNG TUYỂN</a>
                      </h6>
                      <b-collapse id="collapse-apply-info" visible>
                          <b-form-row>
                              <div class="col-md-12 col-lg-12 col-xl-12">
                              <div class="card-body">
                                  <b-row class="mb-2">
                                      <b-form-group class="col-md-3" :state="apply_info.job_id === '' ? false : null">
                                          <template slot='label'>
                                              Vị trí làm việc <span class='red-text'>(*)</span>
                                          </template>
                                          <SelectJob
                                            @selected-option-changed="handleSelectSingle(...arguments, apply_info, ['job_id'])"
                                            :jobId="apply_info.job_id"
                                          >
                                          </SelectJob>
                                      </b-form-group>
                                      <b-form-group class="col-md-3" :state="(apply_info.work_type === null) ? false : null">
                                          <template slot='label'>
                                            Hình thức làm việc
                                          </template>
                                          <SelectWorkType
                                            :work-type="apply_info.work_type"
                                            :job-id="apply_info.job_id"
                                            @selected-option-changed="handleSelectSingle(...arguments, apply_info, ['work_type'])"
                                          >
                                          </SelectWorkType>
                                      </b-form-group>
                                      <b-form-group class="col-md-3">
                                          <template slot='label'>
                                              Ca làm việc
                                          </template>
                                          <SelectWorkShift
                                              :work-type="apply_info.work_type"
                                              :work-shift="apply_info.work_shift"
                                              @selected-option-changed="handleSelectSingle(...arguments, apply_info, ['work_shift'])"
                                          >
                                          </SelectWorkShift>
                                      </b-form-group>
                                      <b-form-group class="col-md-3">
                                          <template slot='label'>
                                              Tỉnh làm việc <span class='red-text'>(*)</span>
                                          </template>
                                          <single-select-province
                                              @handleSelectedProvince="handleSelectedLocation(...arguments, apply_info, ['province_register_id'])"
                                              :provinceId="apply_info.province_register_id"
                                              custom-class=""
                                          >
                                          </single-select-province>
                                      </b-form-group>
                                  </b-row>
                                  <b-row>
                                      <b-form-group class="col-md-3">
                                        <template slot='label'>
                                            Huyện làm việc
                                        </template>
                                        <single-select-district
                                          :id="'candidate-district-register'"
                                          @select="handleSelectedLocation(...arguments, apply_info, ['district_register_id'])"
                                          :province-id="apply_info.province_register_id"
                                          :district-id="apply_info.district_register_id"
                                        >
                                        </single-select-district>
                                      </b-form-group>
                                      <b-form-group class="col-md-3">
                                          <template slot='label'>
                                              Dự kiến nhận việc
                                          </template>
                                          <select-join-time
                                              placeholder=""
                                              :value="apply_info.expected_join_time"
                                              @change="val => { apply_info.expected_join_time = val && val.value }"
                                          ></select-join-time>
                                      </b-form-group>
                                  </b-row>
                              </div>
                            </div>
                          </b-form-row>
                      </b-collapse>
                  </div>
                </div>
              </div>
          </div>
          <hr class="border-light container-m--x mt-0 mb-4">
          <br/>
      </div>

      <div class="row">
          <div class="col-md-12">
              <div class="card mb-4">
              <div class="row no-gutters">
                  <div class="col-md-12 col-lg-12 col-xl-12">
                  <h6 class="card-header">
                      <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-experience-info><i class="ion  ion-ios-add-circle"></i> KINH NGHIỆM LÀM VIỆC</a>
                  </h6>
                  <b-collapse id="collapse-experience-info" visible>
                      <b-form-row>
                      <div class="col-md-12 col-lg-12 col-xl-12">
                          <div class="card-body">
                          <b-form-row>
                              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                  <div>
                                      <div class="col-form-label">Đã có kinh nghiệm ở vị trí dự tuyển chưa?</div>
                                      <b-form-row>
                                        <b-form-radio-group name="has-experient" class="col-md-5" v-model="work_experience.have_experience">
                                            <b-form-radio :value="1">Đã có kinh nghiệm</b-form-radio>
                                            <b-form-radio :value="0">Chưa có kinh nghiệm</b-form-radio>
                                        </b-form-radio-group>
                                        <div class="input-group col-md-5" v-if="work_experience.have_experience">
                                            <input type="number" min="0" class="form-control text-center" placeholder="Số năm kinh nghiệm" v-model="work_experience.year_experience" onkeydown="commonHelpers.validatePositiveNumber(event)">
                                            <div class="input-group-append">
                                              <span class="input-group-text">Năm</span>
                                            </div>
                                        </div>
                                      </b-form-row>
                                  </div>
                              </div>
                              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                                  <div>
                                      <div class="col-form-label">Mức thu nhập trong 6 tháng gần đây?</div>
                                      <b-form-row>
                                          <div class="input-group col-md-12 mb-1">
                                              <div class="input-group-prepend">
                                                  <span class="input-group-text">Từ</span>
                                              </div>
                                              <input type="text" class="form-control text-center" v-model="work_experience.income_last_six_month.from" @input="validMoney('income_recent_from')">
                                              <div class="input-group-prepend">
                                                  <span class="input-group-text">Đến</span>
                                              </div>
                                              <input type="text" class="form-control text-center" v-model="work_experience.income_last_six_month.to" @input="validMoney('income_recent_to')">
                                              <div class="input-group-append">
                                                  <span class="input-group-text">VNĐ</span>
                                              </div>
                                          </div>
                                      </b-form-row>
                                  </div>
                              </div>
                          </b-form-row>
                          <b-form-row class="mt-3">
                              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <div>
                                  <div class="col-form-label">Kể tên các công ty từng làm việc và số năm làm việc?</div>
                                  <b-form-row v-for="(company, index) in work_experience.company" :key="index">
                                      <div class="input-group col-md-8 mb-1">
                                          <div class="input-group-pepend">
                                              <span class="input-group-text">Công ty</span>
                                          </div>
                                          <input type="text" class="form-control" placeholder="Tên công ty" v-model="company.name">
                                      </div>
                                      <div class="input-group col-md-3 mb-1">
                                          <input type="number" min="0" class="form-control text-center" placeholder="Số năm kinh nghiệm" v-model="company.experience_year" onkeydown="commonHelpers.validatePositiveNumber(event)">
                                          <div class="input-group-append">
                                              <span class="input-group-text">Năm</span>
                                          </div>
                                      </div>
                                      <div class="col-md-1 mb-1">
                                          <b-btn
                                              type="button"
                                              class="btn btn-success"
                                              @click="addCompany"
                                              v-if="index === work_experience.company.length - 1"
                                          >
                                              <span class="ion ion-md-add"></span>
                                          </b-btn>
                                          <b-btn
                                              type="button"
                                              class="btn btn-danger"
                                              @click="deleteCompany(index)"
                                              v-if="index !== work_experience.company.length - 1"
                                          >
                                              <span class="ion ion-md-close"></span>
                                          </b-btn>
                                      </div>
                                  </b-form-row>
                              </div>
                            </div>
                          </b-form-row>
                          <b-form-row class="mt-3">
                              <b-form-group label="Lí do nghỉ ở công ty cũ là gì?" class="col-md-3">
                                  <b-form-checkbox-group
                                    v-model="work_experience.reason_leave"
                                    :options="infoOptions.reason_resign_old_comp_options"
                                    name="reason_resign_old_comp"
                                    stacked
                                  ></b-form-checkbox-group>
                              </b-form-group>
                              <b-form-group label="Lý do chọn làm việc tại Giao Hàng Tiết Kiệm?" class="col-md-3">
                                  <b-form-checkbox-group
                                      v-model="work_experience.reasons_choosing_ghtk"
                                      :options="infoOptions.reason_apply_ghtk_options"
                                      name="reason_aplly_ghtk"
                                      stacked
                                  ></b-form-checkbox-group>
                              </b-form-group>
                              <div class="col-md-6">
                                  <b-form-group label="Mức lương mong muốn đạt được?">
                                      <div class="input-group mb-1">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text">Từ</span>
                                          </div>
                                          <input type="text" class="form-control text-center" v-model="work_experience.desired_salary.from" @input="validMoney('desired_salary_from')">
                                          <div class="input-group-prepend">
                                              <span class="input-group-text">Đến</span>
                                          </div>
                                          <input type="text" class="form-control text-center" v-model="work_experience.desired_salary.to" @input="validMoney('desired_salary_to')">
                                          <div class="input-group-append">
                                              <span class="input-group-text">VNĐ</span>
                                          </div>
                                      </div>
                                  </b-form-group>
                                  <b-form-group>
                                  <b-form-group>
                                      <template slot='label'>
                                          Muốn gắn bó với GHTK bao lâu?
                                      </template>
                                      <b-form-select
                                          lable="Muốn gắn bó với GHTK bao lâu?"
                                          v-model="work_experience.stick_with_ghtk"
                                          :options="infoOptions.time_work_options"
                                          name="time_work"
                                      >
                                      </b-form-select>
                                  </b-form-group>
                                  <b-form-group label="Sẵn sàng làm thêm giờ hoặc làm thêm các công việc khác để gia tăng thu nhập không?">
                                      <b-form-radio-group name="ready-ot" v-model="work_experience.work_overtime">
                                          <b-form-radio :value="1">Có</b-form-radio>
                                          <b-form-radio :value="0">Không</b-form-radio>
                                      </b-form-radio-group>
                                  </b-form-group>
                                </b-form-group>
                              </div>
                          </b-form-row>
                          <b-form-row>
                              <b-form-group label="Câu hỏi cho Giao Hàng Tiết Kiệm không?" class="col-md-12">
                                  <b-form-textarea
                                      rows="1"
                                      v-model="work_experience.question"
                                  >
                                  </b-form-textarea>
                              </b-form-group>
                          </b-form-row>
                        </div>
                      </div>
                    </b-form-row>
                  </b-collapse>
                </div>
              </div>
            </div>
          </div>
          <hr class="border-light container-m--x mt-0 mb-4">
          <br/>
      </div>
      <div class="row" v-if="documentRequired != 0">
        <div class="col-md-12">
          <div class="card mb-4">
            <div class="row no-gutters">
              <div class="col-md-12 col-lg-12 col-xl-12">
                <h6 class="card-header">
                  <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-document-info><i class="ion  ion-ios-add-circle"></i> HỒ SƠ CÁ NHÂN</a>
                </h6>
                <b-collapse id="collapse-document-info" visible>
                  <b-form-row>
                    <div class="col-md-12 col-lg-12 col-xl-12">
                      <div class="card-body">
                        <div class="p-4 d-flex flex-wrap">
                          <div class="pb-2 col-md-3" v-for="document in documents || []">
                            <strong class="pb-2">{{ document.document_name || 'Hồ sơ'  }} </strong>
                            <ViewDocument :document="document" class="mt-2" v-if="document.url.length > 0"></ViewDocument>
                            <p v-else class="font-italic">(Chưa có)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-form-row>
                </b-collapse>
              </div>
            </div>
          </div>
        </div>
        <hr class="border-light container-m--x mt-0 mb-4">
        <br/>
      </div>
      <div class="card-footer border-0 text-center py-3">
        <b-btn type="button" variant="btn btn-success" @click="updateCandidate" :disabled="isDisabled">
          Cập nhật
        </b-btn>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.sperator-right {
  border-right: 1px solid rgba(0, 0, 0, 0.2)
}
.is-danger {
  font-size: 12px;
  color: red;
}
.isValid {
  border-color: #d9534f;
}
.px-1_75re {
  padding-left: 1.75rem;
  padding-right: 1.75rem;
}
.select-element {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import MultiSelectDistricts from 'components/elements/common/MultiSelectDistricts'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectRelation from 'components/elements/common/SingleSelectRelation'
import SingleSelectPoiIdentityCard from 'components/elements/common/SingleSelectPoiIdentityCard'
import SelectJoinTime from '../../../Candidate/SelectJoinTime.vue'
import FileCandidate from './FileCandidate'
import SelectSourceRecruitment from './SelectSourceRecruitment.vue'
import SelectWorkShift from './SelectWorkShift.vue'
import SelectWorkType from './SelectWorkType.vue'
import SelectJob from './SelectJob.vue'
import SelectChannelRecruitment from './SelectChannelRecruitment.vue'

import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
import SelectReferrer from './SelectReferrer.vue'

// import moment from 'moment'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import ViewDocument from './ViewDocument.vue'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'UpdateCandidate',

  components: {
    ViewDocument,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectPoiIdentityCard,
    Multiselect,
    SingleSelectRelation,
    SingleSelectProfileRegion,
    Notification,
    Datepicker,
    SingleSelectSubDistrict,
    SingleSelectPosition,
    PerfectScrollbar,
    SelectJoinTime,
    MultiSelectDistricts,
    FileCandidate,
    SelectSourceRecruitment,
    SelectWorkShift,
    SelectWorkType,
    SelectJob,
    SelectReferrer,
    SelectChannelRecruitment
  },

  props: {
    currEditing: {
      default: null
    },
    type: {
      default: null
    },
    Hrview: {
      default: null
    }
  },

  data: () => ({
    documentRequired: 0,
    isDisabled: false,
    title: null,
    formValided: true,
    apply_info: {
      district_register_id: null,
      expected_join_time: null,
      job_id: null,
      province_register_id: null,
      work_shift: null,
      work_type: null
    },
    documents: [],
    user_info: {
      apply_date: null,
      birthday: null,
      card_id: null,
      channel: null,
      source: null,
      current_address: {
        current_address_detail: null,
        current_address_district: null,
        current_address_province: null,
        current_address_sub_district: null
      },
      date_issue_card_id: null,
      place_issue_card_id: null,
      device_android: null,
      email: null,
      gender: null,
      name: null,
      phone: null,
      resident_address: {
        resident_address_detail: null,
        resident_address_district: null,
        resident_address_province: null,
        resident_address_sub_district: null
      }
    },
    work_experience: {
      company: [
        {
          name: '',
          experience_year: ''
        }
      ],
      desired_salary: {
        from: '',
        to: ''
      },
      have_experience: null,
      income_last_six_month: {
        from: '',
        to: ''
      },
      question: null,
      reason_leave: [],
      reasons_choosing_ghtk: [],
      stick_with_ghtk: null,
      work_overtime: null
    },
    infoOptions: {
      gender: [
        {
          text: 'Chọn giới tính',
          value: null,
          disabled: true
        },
        {
          text: 'Nam',
          value: 'male'
        },
        {
          text: 'Nữ',
          value: 'female'
        },
        {
          text: 'Khác',
          value: 'other'
        }
      ],
      reason_resign_old_comp_options: [
        { text: 'Thay đổi môi trường', value: 'environment_change' },
        { text: 'Thay đổi địa điểm làm việc', value: 'change_work_location' },
        { text: 'Định hướng công việc mới', value: 'new_orientation' },
        { text: 'Lương & phúc lợi', value: 'salary_benefits' },
        { text: 'Không phù hợp với quản lý', value: 'not_suitable_management' },
        { text: 'Khác', value: 'other' }
      ],
      reason_apply_ghtk_options: [
        { text: 'Văn hóa và môi trường làm việc phù hợp', value: 'culture_working_environment' },
        { text: 'Địa điểm làm việc phù hợp', value: 'working_place' },
        { text: 'Cơ hội phát triển và thăng tiến', value: 'promotion_opportunities' },
        { text: 'Lương & phúc lợi', value: 'salary_benefits' },
        { text: 'Được giới thiệu', value: 'introduced' },
        { text: 'Khác', value: 'other' }
      ],
      time_work_options: [
        { text: 'Ngắn hạn dưới 1 năm', value: 'less_than_one_year' },
        { text: 'Trung bình 1-3 năm', value: 'one_to_three_years' },
        { text: 'Lâu dài', value: 'castle' }
      ]
    },
    fileExist: {
      personal_id_file: [],
      driver_license_file: [],
      curriculum_vitae_file: [],
      asset_responsibility_file: [],
      avatar_file: [],
      commitment_cheat_file: [],
      commitment_security_file: [],
      contract_file: [],
      guarantee_file: []
    },
    profileStatus: {
      active: 'Đang hoạt động',
      disable: 'Đã nghỉ việc',
      pause: 'Tạm dừng công việc',
      not_verified: 'Chờ nhận việc'
    },
    profileExist: {
      id: null,
      status: null,
      fullname: null
    }
  }),

  async created () {
    this.title = 'Chỉnh sửa ứng viên'
    if (this.$route.params.id) {
      await this.getDocument(this.$route.params.id)
      await this.getCandidateInfo(this.$route.params.id)
    }
  },

  watch: {
  },

  methods: {
    async getDocument (id) {
      this.$startLoading()
      recruitmentService.getCountDocument({'candidate_id': [id]})
        .then(res => {
          if (res.data.success) {
            let result = res.data.data
            result = result[id]
            if (result.count_required) {
              this.documentRequired = result.count_required
            }
          } else {
            commonHelper.showMessage(res.data.message || 'Có lỗi khi lấy document!')
          }
        })
        .catch(e => {
          commonHelper.showMessage(e.message || 'Lỗi xảy ra, vui lòng liên hệ IT để được hỗ trợ!', 'error')
        })
      this.$stopLoading()
    },

    updateObjectByKeys (obj, keys, value) {
      if (!obj || typeof obj !== 'object' || !Array.isArray(keys) || keys.length === 0) {
        return
      }

      let currentObj = this
      const lastKeyIndex = keys.length - 1

      for (let i = 0; i < lastKeyIndex; i++) {
        const key = keys[i]
        if (!currentObj.hasOwnProperty(key) || typeof currentObj[key] !== 'object') {
          currentObj[key] = {}
        }
        currentObj = currentObj[key]
      }

      currentObj[keys[lastKeyIndex]] = value
    },

    handleSelectedLocation (location, object, keys) {
      var value = null
      if (location) {
        if (location.id) {
          value = +location.id
        } else if (Array.isArray(location)) {
          value = location.map(lo => +lo.id).join(',')
        }
      } else {
        value = null
      }
      commonHelper.updateObjectByKeys(object, keys, value)
    },

    handleSelectSingle (option, object, keys) {
      var value = option ? option.id : ''
      commonHelper.updateObjectByKeys(object, keys, value)
      if (Array.isArray(keys) && keys.includes('source')) {
        this.user_info.channel = null
      }
    },

    addCompany () {
      let len = this.work_experience.company.length
      if (this.work_experience.company[len - 1].name.length > 0) {
        this.work_experience.company.push({
          company_name: '',
          experience_year: null
        })
      }
    },

    deleteCompany (index) {
      this.work_experience.company.splice(index, 1)
    },

    validMoney (field) {
      this.candidate[field] = this.candidate[field].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    validYear (field, index) {
      if (!isNaN(index)) {
        if (+this.work_experience.company[index][field] > 99) this.work_experience.company[index][field] = ~~(+this.work_experience.company[index][field] / 10)
        if (+this.work_experience.company[index][field] < 0) this.work_experience.company[index][field] = null
        return
      }

      if (+this.work_experience.company[field] > 99) this.work_experience.company[field] = ~~(this.work_experience.company[field] / 10)
      if (+this.work_experience.company[field] < 0) this.work_experience.company[field] = null
    },

    validatePhone (phone) {
      // eslint-disable-next-line camelcase
      let vnf_regex = /((09|03|07|08|05|84)+([0-9]{8})\b)/g
      if (vnf_regex.test(phone) === false) {
        commonHelper.showMessage('Định dạng số điện thoại là giới hạn 10 số và số bắt đầu là số 0!', 'warning')
        this.candidate.phone = null
      }
    },

    validateEmail (email) {
      if (!'@'.include(email)) {
        commonHelper.showMessage('Email của bạn không đúng định dạng!', 'warning')
        this.candidate.email = null
      }
    },

    validateForm () {
      this.formValided = true
      // candidate required
      let requiredCandidate = {
        name: null,
        province_grant_identify_id: null,
        identify_id: null,
        date_grant_identify_id: '',
        phone: null,
        province_now_id: null,
        district_now_id: null,
        subdistrict_now_id: null,
        province_household_id: null,
        district_household_id: null,
        subdistrict_household_id: null,
        job_id: null,
        work_type: '',
        province_register_id: null,
        district_register_id: null
      }
      // Hr required
      let requiredHr = {
        name: null,
        // identify_id: null,
        phone: null,
        province_now_id: null,
        district_now_id: null,
        job_id: null,
        province_register_id: null,
        recruitment_source: null
        // district_register_id: null
      }

      if (this.candidate.recruitment_source === 'employee') {
        requiredHr['referrer_id'] = null
      } else {
        requiredHr['recruitment_channel'] = null
      }
      let required = null
      if (this.Hrview) {
        required = requiredHr
      } else required = requiredCandidate
      for (let field in required) {
        if (this.candidate[field] === null || this.candidate[field] === '') {
          this.formValided = 'missing'
          if (required[field] === null || required[field] === '') {
            this.candidate[field] = ''
          } else {
            this.candidate[field] = null
          }
        }
      }
      if (this.candidate.identify_id && this.candidate.identify_id.length !== 9 && this.candidate.identify_id.length !== 12 && this.candidate.identify_id !== '') {
        alert('Số CMND không hợp lệ')
        this.formValided = 'invalid'
      }
      if (this.candidate.phone.length !== 10 && this.candidate.phone !== '') {
        alert('Số Điện thoại không hợp lệ')
        this.formValided = 'invalid'
      }
      if (this.candidate.mail && this.candidate.mail !== '') {
        let pattermEmail = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if (!pattermEmail.test(this.candidate.mail)) {
          alert('Email không hợp lệ')
          this.formValided = 'invalid'
        }
      }
    },

    updateCandidate () {
      this.isDisabled = true
      this.$startLoading()
      let formData = new FormData()
      commonHelper.addFieldValue(formData, 'candidate_id', this.$route.params.id)
      commonHelper.addFieldValue(formData, 'name', this.user_info.name)
      commonHelper.addFieldValue(formData, 'card_id', this.user_info.card_id)
      commonHelper.addFieldValue(formData, 'place_issue_card_id', this.user_info.place_issue_card_id)
      if (this.user_info.date_issue_card_id) {
        commonHelper.addFieldValue(formData, 'date_issue_card_id', commonHelper.format_date(this.user_info.date_issue_card_id))
      }
      if (this.user_info.birthday) {
        commonHelper.addFieldValue(formData, 'birthday', commonHelper.format_date(this.user_info.birthday))
      }
      commonHelper.addFieldValue(formData, 'gender', this.user_info.gender)
      commonHelper.addFieldValue(formData, 'phone', this.user_info.phone)
      commonHelper.addFieldValue(formData, 'email', this.user_info.email)
      commonHelper.addFieldValue(formData, 'resident_address_province', this.user_info.resident_address.resident_address_province)
      commonHelper.addFieldValue(formData, 'resident_address_district', this.user_info.resident_address.resident_address_district)
      commonHelper.addFieldValue(formData, 'resident_address_detail', this.user_info.resident_address.resident_address_detail)
      commonHelper.addFieldValue(formData, 'resident_address_sub_district', this.user_info.resident_address.resident_address_sub_district)
      commonHelper.addFieldValue(formData, 'current_address_province', this.user_info.current_address.current_address_province)
      commonHelper.addFieldValue(formData, 'current_address_district', this.user_info.current_address.current_address_district)
      commonHelper.addFieldValue(formData, 'current_address_sub_district', this.user_info.current_address.current_address_sub_district)
      commonHelper.addFieldValue(formData, 'current_address_detail', this.user_info.current_address.current_address_detail)
      commonHelper.addFieldValue(formData, 'source', this.user_info.source)
      commonHelper.addFieldValue(formData, 'channel', this.user_info.channel)
      commonHelper.addFieldValue(formData, 'apply_date', this.user_info.apply_date)
      if (this.user_info.apply_date) {
        commonHelper.addFieldValue(formData, 'apply_date', commonHelper.format_date(this.user_info.apply_date))
      }
      commonHelper.addFieldValue(formData, 'device_android', this.user_info.device_android)
      commonHelper.addFieldValue(formData, 'work_type', this.apply_info.work_type)
      commonHelper.addFieldValue(formData, 'work_shift', this.apply_info.work_shift)
      commonHelper.addFieldValue(formData, 'job_id', this.apply_info.job_id)
      commonHelper.addFieldValue(formData, 'district_register_id', this.apply_info.district_register_id)
      commonHelper.addFieldValue(formData, 'province_register_id', this.apply_info.province_register_id)
      commonHelper.addFieldValue(formData, 'expected_join_time', this.apply_info.expected_join_time)
      commonHelper.addFieldValue(formData, 'have_experience', this.work_experience.have_experience)
      if (this.work_experience.income_last_six_month.from) {
        commonHelper.addFieldValue(formData, 'income_last_six_month[from]', this.work_experience.income_last_six_month.from.replace(/,/g, ''))
      }
      if (this.work_experience.income_last_six_month.to) {
        commonHelper.addFieldValue(formData, 'income_last_six_month[to]', this.work_experience.income_last_six_month.to.replace(/,/g, ''))
      }

      let company = this.work_experience.company.filter(function (element) {
        return element.name && element.experience_year
      })
      commonHelper.addFieldValue(formData, 'company', company)
      commonHelper.addFieldValue(formData, 'reason_leave', this.work_experience.reason_leave)
      commonHelper.addFieldValue(formData, 'reasons_choosing_ghtk', this.work_experience.reasons_choosing_ghtk)
      if (this.work_experience.desired_salary.from) {
        commonHelper.addFieldValue(formData, 'desired_salary[from]', this.work_experience.desired_salary.from.replace(/,/g, ''))
      }
      if (this.work_experience.desired_salary.to) {
        commonHelper.addFieldValue(formData, 'desired_salary[to]', this.work_experience.desired_salary.to.replace(/,/g, ''))
      }
      commonHelper.addFieldValue(formData, 'stick_with_ghtk', this.work_experience.stick_with_ghtk)
      commonHelper.addFieldValue(formData, 'work_overtime', this.work_experience.work_overtime)
      commonHelper.addFieldValue(formData, 'question', this.work_experience.question)

      recruitmentService.updateCandidateInfo(formData).then(res => {
        if (res.data.success) {
          commonHelper.showMessage('Cập nhật thông tin ứng viên thành công', 'success')
        } else {
          commonHelper.showMessage(res.data.message, 'warning')
        }
      }).catch((e) => {
        console.log(e)
      }).then(() => {
        this.isDisabled = false
        this.$stopLoading()
      })
      this.isDisabled = false
    },

    formatDate (date) {
      let day = date.getMonth() + 1
      let month = date.getDate()
      day = day < 10 ? '0' + day : day
      month = month < 10 ? '0' + month : month
      return date.getFullYear() + '-' + month + '-' + day
    },

    async getCandidateInfo (idCandidate) {
      this.$startLoading()
      if (idCandidate === null || idCandidate === '' || !idCandidate) commonHelper.showMessage('Không có Id ứng viên', 'warning')
      const res = await recruitmentService.getCandidateInfo({candidate_id: idCandidate})
      if (res.data.success) {
        this.formatDataCandidate(res.data.data)
        commonHelper.showMessage(res.data.message, 'success')
      } else {
        commonHelper.showMessage(res.data.message || 'Không lấy được thông tin ứng viên !', 'warning')
      }
      this.$stopLoading()
    },

    formatDataCandidate (candidate) {
      this.apply_info = {...this.apply_info, ...candidate.apply_info}
      this.user_info = {...this.user_info, ...candidate.user_info}
      this.work_experience = {...this.work_experience, ...candidate.work_experience}
      if (!this.work_experience.company.length) {
        this.work_experience.company = [
          {
            name: '',
            experience_year: ''
          }
        ]
      }
      this.documents = candidate.documents || []
    },

    openLink (link) {
      window.open(link)
    }
  }
}
</script>
