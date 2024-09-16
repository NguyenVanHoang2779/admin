<template>
  <div>
    <div class="top-title row mb-3" v-if="Hrview">
      <h2 class="col-md-3">{{title}}</h2>
      <div class="top-search-box col-md-4">
          <label class="nav-item navbar-text navbar-search-box p-0 active" v-if="type === 'edit'">
            <i class="ion ion-ios-search navbar-icon align-middle"></i>
            <input type="text" placeholder="Tìm theo Họ tên, CMND, SĐT, Email" class="form-control pl-2 border-0 border-bottom" v-model="seachString">
          </label>
      </div>
      <div class="col-md-1">
        <b-btn data-style="expand-right" class="btn btn-primary" v-if="type === 'edit'" @click="seachCandidate">
          <i class="ion ion-ios-search"></i>{{' Tìm kiếm'}}
        </b-btn>
      </div>
      <div class="top-title__right-button col-md-4 text-right">
          <b-btn data-style="expand-right" class="btn btn-success" @click="updateCandidate">
              <i class="ion ion-ios-add" v-if="type!=='edit'"></i>{{' ' + title}}
          </b-btn>
          <router-link :to="{name: 'list-candidate'}" class="btn btn-default" title="Về màn quản lý ứng viên"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
      </div>
    </div>
    <div v-else>
      <h2 class="col-md-3">Đăng kí ứng tuyển vào gia đình GHTK</h2>
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
                            v-model="candidate.name"
                            :state="candidate.name === '' ? false : null"
                          >
                          </b-form-input>
                        </b-form-group>
                        <b-form-group class="col-md-3">
                          <template slot='label'>
                            Số CMND/CCCD
                          </template>
                          <b-form-input
                            placeholder="Số CMND/CCCD"
                            @input="checkCandidateExist"
                            type='number'
                            v-model="candidate.identify_id"
                            :state="(candidate.identify_id === '' || (candidate.identify_id && candidate.identify_id.length !== 9 && candidate.identify_id.length !== 12)) ? false : null"
                          >
                          </b-form-input>
                          <span v-if="existCandidate && (candidate.identify_id && (candidate.identify_id.length === 9 || candidate.identify_id.length === 12))" class="is-danger">Ứng viên với số CMND đã tồn tại</span>
                          <span v-if="(candidate.identify_id && candidate.identify_id.length !== 9 && candidate.identify_id.length !== 12)" class="is-danger">Số CMND không hợp lệ</span>
                        </b-form-group>
                        <b-form-group class="col-md-3" :state="candidate.province_grant_identify_id === '' ? false : null">
                          <template slot='label'>
                            Nơi cấp <span class='red-text' v-if="!Hrview">(*)</span>
                          </template>
                          <single-select-poi-identity-card
                            :state="candidate.province_grant_identify_id == '' ? false : null"
                            :placeholder="'Nơi cấp CMND'"
                            @handleSelectedProvince="selectedPoiPersonalId"
                            :provinceId="candidate.province_grant_identify_id">
                          </single-select-poi-identity-card>
                        </b-form-group>
                        <b-form-group class="col-md-3">
                          <template slot='label'>
                            Ngày cấp CMND <span class='red-text' v-if="!Hrview">(*)</span>
                          </template>
                          <datepicker
                            :input-class="{'isValid': (candidate.date_grant_identify_id === null ? true : false)}"
                            v-model="candidate.date_grant_identify_id"
                            format="dd-MM-yyyy"
                            :bootstrapStyling="true"
                            :monday-first="true"
                            :full-month-name="true"
                            :calendar-button="true"
                            calendar-button-icon="ion ion-md-calendar"
                            :clear-button="true"
                            placeholder="Ngày cấp CMND"
                          />
                          <span v-show="candidate.date_grant_cmnd === ''" class="is-danger">Không để trống trường này </span>
                        </b-form-group>
                      </b-form-row>
                      <b-form-row>
                        <b-form-group class="col-md-3">
                            <template slot='label'>
                              Ngày sinh
                            </template>
                            <datepicker
                              v-model="candidate.birthday"
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
                            v-model="candidate.gender"
                            :options="infoOptions.gender"
                          >
                          </b-form-select>
                        </b-form-group>
                        <b-form-group class="col-md-3">
                          <template slot='label'>
                            Số điện thoại <span class='red-text'>(*)</span>
                          </template>
                          <b-form-input
                            v-model="candidate.phone"
                            type="number"
                            :state="(candidate.phone === '' || (candidate.phone && candidate.phone.length !== 10)) ? false : null"
                            placeholder="Số điện thoại"
                            @blur="validatePhone(candidate.phone)"
                          >
                          </b-form-input>
                          <span v-if="(candidate.phone && candidate.phone.length !== 10)" class="is-danger">Số điện thoại không hợp lệ</span>
                        </b-form-group>
                        <b-form-group id="input-group-phone" class="col-md-3">
                          <template slot='label'>
                            Email
                          </template>
                          <b-form-input v-model="candidate.mail" @blur="validateEmail(candidate.email)" type="email" placeholder="Email"></b-form-input>
                        </b-form-group>
                      </b-form-row>
                      <b-form-row>
                        <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                          <div>
                            <div class="col-form-label">Hộ khẩu thường trú <span class='red-text' v-if="!Hrview">(*)</span></div>
                            <b-form-row>
                              <single-select-province
                                class="col-md-4"
                                @handleSelectedProvince="handleSelectedLocation(...arguments, 'province_household_id')"
                                :state="candidate.province_household_id == '' ? false : null"
                                :provinceId="candidate.province_household_id"
                              >
                              </single-select-province>
                              <single-select-district
                                class="col-md-4"
                                @handleSelectedDistrict="handleSelectedLocation(...arguments, 'district_household_id')"
                                :state="candidate.district_household_id == '' ? false : null"
                                :provinceId="candidate.province_household_id"
                                :districtId="candidate.district_household_id"
                              >
                              </single-select-district>

                              <single-select-sub-district
                                class="col-md-4"
                                @handleSelectedSubDistrict="handleSelectedLocation(...arguments, 'subdistrict_household_id')"
                                :state="candidate.subdistrict_household_id == '' ? false : null"
                                :districtId="candidate.district_household_id"
                                :subDistrictId="candidate.subdistrict_household_id"
                              >
                              </single-select-sub-district>
                              <b-form-group class="col-md-12">
                                <b-form-textarea
                                  v-model="candidate.detail_household"
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
                                class="col-md-4"
                                @handleSelectedProvince="handleSelectedLocation(...arguments, 'province_now_id')"
                                :state="candidate.province_now_id == '' ? false : null"
                                :provinceId="candidate.province_now_id"
                              >
                              </single-select-province>

                              <single-select-district
                                class="col-md-4"
                                @handleSelectedDistrict="handleSelectedLocation(...arguments, 'district_now_id')"
                                :state="candidate.district_now_id == '' ? false : null"
                                :provinceId="candidate.province_now_id"
                                :districtId="candidate.district_now_id"
                              >
                              </single-select-district>

                              <single-select-sub-district
                                class="col-md-4"
                                @handleSelectedSubDistrict="handleSelectedLocation(...arguments, 'subdistrict_now_id')"
                                :state="candidate.subdistrict_now_id == '' ? false : null"
                                :districtId="candidate.district_now_id"
                                :subDistrictId="candidate.subdistrict_now_id"
                              >
                              </single-select-sub-district>

                              <b-form-group class="col-md-12">
                                <b-form-textarea
                                  v-model="candidate.detail_now"
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
                            Nguồn tuyển dụng <span class='red-text' v-if="Hrview">(*)</span>
                          </template>
                          <single-select-referral
                            :referral="candidate.recruitment_source"
                            @select="handleSelectedRefferal"
                            :hrview="Hrview"
                          >
                          </single-select-referral>
                        </b-form-group>
                        <b-form-group class="col-md-3" v-if="candidate.recruitment_source !== 'employee' ||  Hrview">
                          <template slot="label">
                            Kênh tuyển dụng <span class='red-text' v-if="Hrview">(*)</span>
                          </template>
                          <div v-if="candidate.recruitment_source === 'employee'">
                            <single-select-candidate-referrer
                              custom-class=""
                              :referrerId="candidate.referrer_id"
                              @handleChooseRefferer="handleChooseRefferer"
                            >
                            </single-select-candidate-referrer>
                          </div>
                          <multiselect
                            v-else-if="candidate.recruitment_source === 'web' || candidate.recruitment_source === 'facebook'"
                            v-model="candidate.recruitment_channel"
                            :options="candidate.recruitment_source ? (channelOptions[candidate.recruitment_source] ? channelOptions[candidate.recruitment_source] : []) : []"
                            label="text"
                            placeholder="Chọn kênh tuyển dụng"
                            selectLabel=""
                            deselectLabel="X"
                          >
                            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                          </multiselect>
                          <div v-else>
                            <b-form-input v-model="candidate.recruitment_channel"></b-form-input>
                          </div>
                        </b-form-group>
                        <b-form-group class="col-md-3" label="Ngày ứng tuyển">
                          <datepicker
                              v-model="candidate.apply_date"
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
                          <b-form-radio-group name="use-smart-phone" v-model="candidate.use_smart_phone">
                            <b-form-radio :value="true">Có</b-form-radio>
                            <b-form-radio :value="false">Không</b-form-radio>
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
                        <b-form-group class="col-md-3" :state="candidate.job_id === '' ? false : null">
                          <template slot='label'>
                            Vị trí làm việc <span class='red-text'>(*)</span>
                          </template>
                          <single-select-candidate-position
                            @handleChoosePosition="handleChoosePosition"
                            :jobId="candidate.job_id"
                            :hrview="Hrview"
                            custom-class=""
                          >
                          </single-select-candidate-position>
                        </b-form-group>
                        <b-form-group class="col-md-3" :state="(!Hrview && candidate.work_type === null) ? false : null">
                          <template slot='label'>
                            Hình thức làm việc <span class='red-text' v-if="!Hrview">(*)</span>
                          </template>
                          <multiselect
                            v-model="candidate.work_type"
                            :options="candidate.job_id === '2' ? workTypeOptions.driver : workTypeOptions.cod"
                            label="text"
                            selectLabel=""
                            deselectLabel="X"
                          >
                            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                            <span class="placeholder" slot="placeholder">Chọn hình thức làm việc</span>
                          </multiselect>
                        </b-form-group>
                        <b-form-group class="col-md-3">
                          <template slot='label'>
                            Ca làm việc
                          </template>
                          <multiselect
                            v-model="candidate.work_shift"
                            :options="candidate.work_type && candidate.work_type.value === 'parttime' ? workShiftOptions.parttime : workShiftOptions.fulltime"
                            label="text"
                            selectLabel=""
                            deselectLabel="X"
                          >
                            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
                            <span class="placeholder" slot="placeholder">Chọn ca làm việc</span>
                          </multiselect>
                        </b-form-group>
                        <b-form-group class="col-md-3">
                          <template slot='label'>
                            Tỉnh làm việc <span class='red-text'>(*)</span>
                          </template>
                          <single-select-province
                            @handleSelectedProvince="handleSelectedLocation(...arguments, 'province_register_id')"
                            :state="candidate.province_register_id == '' ? false : null"
                            :provinceId="candidate.province_register_id"
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
                          <multi-select-districts
                            @onChange="handleSelectedLocation(...arguments, 'district_register_id')"
                            :state="candidate.district_register_id == '' ? false : null"
                            :province-id="candidate.province_register_id"
                            :district-id="candidate.district_register_id"
                          >
                          </multi-select-districts>
                        </b-form-group>
                        <b-form-group class="col-md-3">
                          <template slot='label'>
                            Dự kiến nhận việc
                          </template>
                          <select-join-time
                            placeholder=""
                            :value="candidate.expected_join_time"
                            @change="val => { candidate.expected_join_time = val && val.value }"
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
                                <b-form-radio-group name="has-experient" class="col-md-5" v-model="candidate.has_experient">
                                  <b-form-radio :value="true">Đã có kinh nghiệm</b-form-radio>
                                  <b-form-radio :value="false">Chưa có kinh nghiệm</b-form-radio>
                                </b-form-radio-group>
                                <div class="input-group col-md-5" v-if="candidate.has_experient">
                                  <input type="number" class="form-control text-center" placeholder="Số năm kinh nghiệm" v-model="candidate.year_experient" @input="validYear('year_experient')">
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
                                <input type="text" class="form-control text-center" v-model="candidate.income_recent_from" @input="validMoney('income_recent_from')">
                                <div class="input-group-prepend">
                                  <span class="input-group-text">Đến</span>
                                </div>
                                <input type="text" class="form-control text-center" v-model="candidate.income_recent_to" @input="validMoney('income_recent_to')">
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
                            <b-form-row v-for="(company, index) in candidate.company" :key="index">
                                <div class="input-group col-md-8 mb-1">
                                  <div class="input-group-pepend">
                                    <span class="input-group-text">Công ty</span>
                                  </div>
                                  <input type="text" class="form-control" placeholder="Tên công ty" v-model="company.company_name">
                                </div>
                                <div class="input-group col-md-3 mb-1">
                                  <input type="number" class="form-control text-center" placeholder="Số năm kinh nghiệm" v-model="company.year_experient" @input="validYear('year_experient', index)">
                                  <div class="input-group-append">
                                    <span class="input-group-text">Năm</span>
                                  </div>
                                </div>
                                <div class="col-md-1 mb-1">
                                  <b-btn
                                    type="button"
                                    class="btn btn-success"
                                    @click="addCompany"
                                    v-if="index === candidate.company.length - 1"
                                  >
                                    <span class="ion ion-md-add"></span>
                                  </b-btn>
                                  <b-btn
                                    type="button"
                                    class="btn btn-danger"
                                    @click="deleteCompany(index)"
                                    v-if="index !== candidate.company.length - 1"
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
                            v-model="candidate.reason_resign_old_comp"
                            :options="infoOptions.reason_resign_old_comp_options"
                            name="reason_resign_old_comp"
                            stacked
                          ></b-form-checkbox-group>
                        </b-form-group>
                        <b-form-group label="Lý do chọn làm việc tại Giao Hàng Tiết Kiệm?" class="col-md-3">
                          <b-form-checkbox-group
                            v-model="candidate.reason_apply_ghtk"
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
                                <input type="text" class="form-control text-center" v-model="candidate.desired_salary_from" @input="validMoney('desired_salary_from')">
                                <div class="input-group-prepend">
                                  <span class="input-group-text">Đến</span>
                                </div>
                                <input type="text" class="form-control text-center" v-model="candidate.desired_salary_to" @input="validMoney('desired_salary_to')">
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
                                  v-model="candidate.time_work"
                                  :options="infoOptions.time_work_options"
                                  name="time_work"
                                >
                                </b-form-select>
                              </b-form-group>
                              <b-form-group label="Sẵn sàng làm thêm giờ hoặc làm thêm các công việc khác để gia tăng thu nhập không?">
                                <b-form-radio-group name="ready-ot" v-model="candidate.ready_ot">
                                  <b-form-radio :value="true">Có</b-form-radio>
                                  <b-form-radio :value="false">Không</b-form-radio>
                                </b-form-radio-group>
                              </b-form-group>
                            </b-form-group>
                        </div>
                      </b-form-row>
                      <b-form-row>
                        <b-form-group label="Câu hỏi cho Giao Hàng Tiết Kiệm không?" class="col-md-12">
                          <b-form-textarea rows="1"
                            v-model="candidate.other_questions"
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

    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="row no-gutters">
            <div class="col-md-12 col-lg-12 col-xl-12">
              <h6 class="card-header">
                  <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-file-info><i class="ion  ion-ios-add-circle"></i> FILE HỒ SƠ ỨNG TUYỂN</a>
              </h6>
              <b-collapse id="collapse-file-info" visible class="px-1_75re">
                <file-candidate
                  :file-exist="fileExist"
                  :edit="false"
                ></file-candidate>
              </b-collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer border-0 text-center py-3">
      <b-btn type="button" variant="btn btn-success" @click="updateCandidate" :disabled="isDisabled">
          <i class="ion ion-ios-add" v-if="type!=='edit'"></i>{{' ' + title}}
      </b-btn>
    </div>
    <b-modal id="modal-exist-profile" static title="Thông báo">
      <b-alert :show="!!(profileExist && profileExist.id)">
        Đã tồn tại <b-link :to="'/profile/master/edit/' + profileExist.id">Master Profile</b-link> <b>{{ profileStatus[profileExist.status] || '' }}</b> với số CMND/CCCD tương ứng và có tên là {{ profileExist.fullname }}
      </b-alert>
    </b-modal>
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
</style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import MultiSelectDistricts from 'components/elements/common/MultiSelectDistricts'
import SingleSelectCandidatePosition from './SingleSelectCandidatePosition'
import SingleSelectCandidateReferrer from './SingleSelectCandidateReferrer'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectRelation from 'components/elements/common/SingleSelectRelation'
import SingleSelectPoiIdentityCard from 'components/elements/common/SingleSelectPoiIdentityCard'
import SingleSelectReferral from './SingleSelectReferral'
import SelectJoinTime from './SelectJoinTime'
import FileCandidate from './FileCandidate'

import candidateService from 'domain/services/candidate-service'
import profileService from 'domain/services/profile-service'

import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'

// import moment from 'moment'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import router from '@/router'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'modal-edit-candidate',

  components: {
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectCandidatePosition,
    SingleSelectCandidateReferrer,
    SingleSelectPoiIdentityCard,
    Multiselect,
    SingleSelectRelation,
    SingleSelectProfileRegion,
    Notification,
    Datepicker,
    SingleSelectSubDistrict,
    SingleSelectPosition,
    PerfectScrollbar,
    SingleSelectReferral,
    SelectJoinTime,
    MultiSelectDistricts,
    FileCandidate
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
    isDisabled: false,
    seachString: null,
    existCandidate: null,
    title: null,
    formValided: true,
    candidate: {
      id: null,
      status: null,
      evaluate: null,
      name: null,
      province_grant_identify_id: null,
      identify_id: null,
      date_grant_identify_id: '',
      birthday: '',
      gender: null,
      phone: null,
      mail: null,
      has_experient: null,
      year_experient: null,
      reason_resign_old_comp: [],
      reason_apply_ghtk: [],
      desired_salary_from: null,
      desired_salary_to: null,
      income_recent_from: null,
      income_recent_to: null,
      ready_ot: null,
      time_work: null,
      other_questions: null,
      province_now_id: null,
      district_now_id: null,
      subdistrict_now_id: null,
      detail_now: null,
      province_household_id: null,
      district_household_id: null,
      subdistrict_household_id: null,
      detail_household: null,
      use_smart_phone: null,
      referrer_id: null,
      recruitment_source: null,
      recruitment_channel: null,
      job_id: null,
      work_type: '',
      work_shift: '',
      province_register_id: null,
      district_register_id: null,
      apply_date: '',
      expected_join_time: null,
      company: [
        {
          company_name: '',
          year_experient: ''
        }
      ]
    },
    workTypeOptions: {
      cod: [
        {
          value: 'fulltime',
          text: 'Toàn thời gian'
        },
        {
          value: 'parttime',
          text: 'Bán thời gian'
        }
      ],
      driver: [
        {
          value: 'inprovince',
          text: 'Nội tỉnh'
        },
        {
          value: 'interprovince',
          text: 'Liên tỉnh'
        },
        {
          value: 'longdistance',
          text: 'Đường dài'
        }
      ]
    },
    workShiftOptions: {
      fulltime: [
        {
          value: 'day',
          text: 'Ca ngày'
        },
        {
          value: 'night',
          text: 'Ca đêm'
        },
        {
          value: 'all',
          text: 'Cả 2 ca'
        }

      ],
      parttime: [
        {
          value: 'morning ',
          text: 'Ca sáng'
        },
        {
          value: 'afternoon',
          text: 'Ca chiều'
        },
        {
          value: 'befornight',
          text: 'Ca tối'
        },
        {
          value: 'sunday',
          text: 'Chuyên chủ nhật'
        }
      ]
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
        { text: 'Thay đổi môi trường', value: 'env' },
        { text: 'Thay đổi địa điểm làm việc', value: 'change_place' },
        { text: 'Định hướng công việc mới', value: 'new_work' },
        { text: 'Lương & phúc lợi', value: 'salary_welfare' },
        { text: 'Không phù hợp với quản lý', value: 'inconsonant' },
        { text: 'Khác', value: 'other' }
      ],
      reason_apply_ghtk_options: [
        { text: 'Văn hóa và môi trường làm việc phù hợp', value: 'env' },
        { text: 'Địa điểm làm việc phù hợp', value: 'place' },
        { text: 'Cơ hội phát triển và thăng tiến', value: 'opportunity' },
        { text: 'Lương & phúc lợi', value: 'salary_welfare' },
        { text: 'Được giới thiệu', value: 'introduced' },
        { text: 'Khác', value: 'other' }
      ],
      time_work_options: [
        { text: 'Ngắn hạn dưới 1 năm', value: '1' },
        { text: 'Trung bình 1-3 năm', value: '3' },
        { text: 'Lâu dài', value: 'longtime' }
      ]
    },
    channelOptions: {
      outdoor: [
        {
          text: 'Poster/Banner/Tờ rơi',
          value: 'poster'
        },
        {
          text: 'Booth tuyển dụng',
          value: 'booth'
        }
      ],
      web: [
        {
          text: 'Ybox',
          value: 'ybox'
        },
        {
          text: 'Vieclam24h',
          value: 'vieclam24h'
        },
        {
          text: 'Timviecnhanh',
          value: 'timviecnhanh'
        },
        {
          text: 'JobsGO',
          value: 'jobsgo'
        },
        {
          text: 'Top CV',
          value: 'topcv'
        },
        {
          text: 'Career Builder',
          value: 'career_builder'
        },
        {
          text: 'Chợ tốt',
          value: 'cho_tot'
        },
        {
          text: 'Career Link',
          value: 'career_link'
        },
        {
          text: 'Khác',
          value: 'other'
        }
      ],
      facebook: [
        {
          text: 'Facebook Ads',
          value: 'facebook_ads'
        },
        {
          text: 'Fanpage toàn quốc',
          value: 'nationwide_fanpage'
        },
        {
          text: 'Fanpage tỉnh',
          value: 'provincial_fanpage'
        },
        {
          text: 'Facebook cá nhân',
          value: 'personal_facebook'
        },
        {
          text: 'Zalo',
          value: 'zalo'
        },
        {
          text: 'Tiktok',
          value: 'tiktok'
        }
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

  created () {
    router.push({ path: '/recruitment/candidate/create' })
    if (this.type === 'edit') {
      this.title = 'Chỉnh sửa ứng viên'
      if (this.$route.params.id) {
        this.getCandidateInfo(this.$route.params.id)
      }
    } else this.title = 'Thêm ứng viên'
  },

  watch: {
  },

  methods: {
    handleSelectedLocation (location, name) {
      if (location) {
        if (location.id) this.candidate[name] = location.id
        else if (Array.isArray(location)) {
          this.candidate[name] = location.map(lo => lo.id).join(',')
        }
      } else {
        this.candidate[name] = ''
      }
    },
    selectedPoiPersonalId (option) {
      this.candidate.province_grant_identify_id = option ? option.id : ''
    },

    handleSelectedRefferal (referral) {
      this.candidate['referrer_id'] = null
      this.candidate['recruitment_channel'] = null
      if (referral) {
        this.candidate['recruitment_source'] = referral.value
      } else {
        this.candidate['recruitment_source'] = ''
      }
    },

    handleChooseRefferer (referrer) {
      if (referrer) {
        this.candidate['referrer_id'] = referrer.id
      } else {
        this.candidate['referrer_id'] = ''
      }
    },

    handleChoosePosition (position) {
      if (position) {
        this.candidate['job_id'] = position.id
      } else {
        this.candidate['job_id'] = ''
      }
    },

    addCompany () {
      let len = this.candidate.company.length
      if (this.candidate.company[len - 1].company_name.length > 0) {
        this.candidate.company.push({
          company_name: '',
          year_experient: null
        })
      }
    },

    deleteCompany (index) {
      this.candidate.company.splice(index, 1)
    },

    validMoney (field) {
      this.candidate[field] = this.candidate[field].replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    validYear (field, index) {
      if (!isNaN(index)) {
        if (+this.candidate.company[index][field] > 99) this.candidate.company[index][field] = ~~(+this.candidate.company[index][field] / 10)
        if (+this.candidate.company[index][field] < 0) this.candidate.company[index][field] = null
        return
      }

      if (+this.candidate[field] > 99) this.candidate[field] = ~~(this.candidate[field] / 10)
      if (+this.candidate[field] < 0) this.candidate[field] = null
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
      this.validateForm()
      if (this.formValided === 'missing') {
        alert('Vui lòng điền đầy đủ thông tin cần thiết')
        this.isDisabled = false
        return
      }
      if (this.formValided === 'invalid') {
        this.isDisabled = false
        return
      }

      if (this.type === 'create' && this.existCandidate) {
        alert('Ứng viên với số CMND tương ứng đã tồn tại')
        this.isDisabled = false
        return
      }
      let dataSend = new FormData()

      Object.keys(this.candidate).forEach(key => {
        if (this.candidate[key] === null || this.candidate[key] === '') {
          // formdata chỉ có thể gửi string hay file data, mọi thứ khác bị chuyển về string do đó
          // chuyển về string rỗng với giá trị null nếu không sẽ bị gửi string 'null' tới server
          dataSend.append(key, '')
          return
        }
        if (key === 'recruitment_channel' || key === 'work_type' || key === 'work_shift') {
          if (typeof (this.candidate[key]) === 'object' && this.candidate[key]) dataSend.append(key, this.candidate[key].value)
          else if (key === 'recruitment_channel' && this.candidate[key]) dataSend.append(key, this.candidate[key])
          else dataSend.append(key, '')
          return
        }
        if (key === 'company') {
          dataSend.append(key, JSON.stringify(this.candidate[key]))
          return
        }
        if (key === 'birthday' || key === 'date_grant_identify_id' || key === 'apply_date') {
          if (!this.candidate[key] || this.candidate[key] === '') return
          let day = new Date(this.candidate[key])
          dataSend.append(key, day.toUTCString())
          return
        }
        dataSend.append(key, this.candidate[key])
      })
      this.$startLoading()
      if (this.type === 'create') {
        candidateService.createCandidate(dataSend).then(res => {
          if (res.data.success) {
            commonHelper.showMessage('Thêm ứng viên thành công', 'success')
            if (res.data.data && res.data.data.id) {
              this.candidate.id = res.data.data.id
              this.candidate.status = res.data.data.status
              this.candidate.evaluate = res.data.data.evaluate
              this.type = 'edit'
              this.title = 'Chỉnh sửa ứng viên'
            }
          } else {
            commonHelper.showMessage(res.data.message, 'warning')
          }
        }).catch((e) => {
          console.log(e)
        }).then(() => {
          this.isDisabled = false
          this.$stopLoading()
        })
      } else {
        candidateService.updateCandidate(dataSend).then(res => {
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
      }
      this.isDisabled = false
    },

    reformatCandidate () {
      // format reason_resign_old_comp, reason_apply_ghtk and company
      if (this.candidate.reason_resign_old_comp && this.candidate.reason_resign_old_comp.length > 0) this.candidate.reason_resign_old_comp = this.candidate.reason_resign_old_comp.split(',')
      else this.candidate.reason_resign_old_comp = []
      if (this.candidate.reason_apply_ghtk && this.candidate.reason_apply_ghtk.length > 0) this.candidate.reason_apply_ghtk = this.candidate.reason_apply_ghtk.split(',')
      else this.candidate.reason_apply_ghtk = []
      if (!this.candidate.company) {
        this.candidate.company = [
          {
            company_name: '',
            year_experient: ''
          }
        ]
      }
      // format work_type, work_shift and recruitment channel
      if (this.candidate.work_type) {
        let workTypeValue = this.candidate.work_type
        Object.keys(this.workTypeOptions).forEach((key) => {
          let workType = this.workTypeOptions[key].find(workType => (workType.value === workTypeValue))
          if (workType) this.candidate.work_type = workType
        })
      }
      if (this.candidate.work_shift) {
        let workShiftValue = this.candidate.work_shift
        Object.keys(this.workShiftOptions).forEach((key) => {
          let workShift = this.workShiftOptions[key].find(workShift => (workShift.value === workShiftValue))
          if (workShift) this.candidate.work_shift = workShift
        })
      }
      if (this.candidate.recruitment_source) {
        let channelValue = this.candidate.recruitment_channel
        if (this.channelOptions[this.candidate.recruitment_source]) { channelValue = this.channelOptions[this.candidate.recruitment_source].find(channel => (channel.value === channelValue)) }
        if (channelValue) this.candidate.recruitment_channel = channelValue
      }
    },

    getCandidateInfo (idCandidate) {
      this.$startLoading()
      if (idCandidate === null || idCandidate === '' || !idCandidate) commonHelper.showMessage('Không có Id ứng viên', 'warning')
      let params = {
        id: idCandidate
      }
      candidateService.getCandidateInfo(params).then((res) => {
        if (res.data.success) {
          let resData = res.data.data
          if (resData.personal_id_file && resData.personal_id_file.length) this.fileExist.personal_id_file = resData.personal_id_file
          if (resData.curriculum_vitae_file && resData.curriculum_vitae_file.length) this.fileExist.curriculum_vitae_file = resData.curriculum_vitae_file
          if (resData.driver_license_file && resData.driver_license_file.length) this.fileExist.driver_license_file = resData.driver_license_file
          if (resData.avatar_file && resData.avatar_file.length) this.fileExist.avatar_file = resData.avatar_file
          if (resData.guarantee_file && resData.guarantee_file.length) this.fileExist.guarantee_file = resData.guarantee_file
          if (resData.contract_file && resData.contract_file.length) this.fileExist.contract_file = resData.contract_file
          if (resData.asset_responsibility_file && resData.asset_responsibility_file.length) this.fileExist.asset_responsibility_file = resData.asset_responsibility_file
          if (resData.commitment_cheat_file && resData.commitment_cheat_file.length) this.fileExist.commitment_cheat_file = resData.commitment_cheat_file
          if (resData.commitment_security_file && resData.commitment_security_file.length) this.fileExist.commitment_security_file = resData.commitment_security_file
          delete res.data.data.personal_id_file
          delete res.data.data.curriculum_vitae_file
          delete res.data.data.driver_license_file
          delete res.data.data.avatar_file
          delete res.data.data.guarantee_file
          delete res.data.data.contract_file
          delete res.data.data.asset_responsibility_file
          delete res.data.data.commitment_cheat_file
          delete res.data.data.commitment_security_file
          this.candidate = {...this.candidate, ...res.data.data}
          this.candidate.district_register_id = res.data.data.district_register_id
          this.reformatCandidate()
        } else commonHelper.showMessage(res.data.message, 'warning')
      }).catch((e) => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    checkCandidateExist (cmnd) {
      if (!cmnd || (cmnd.length !== 9 && cmnd.length !== 12)) return
      let params = {
        cmnd: cmnd
      }
      candidateService.checkCandidateExist(params).then((res) => {
        if (res.data.success) {
          if (!this.Hrview) {
            this.candidate = res.data.data
            this.reformatCandidate()
          } else {
            this.existCandidate = true
          }
        } else {
          this.existCandidate = false
        }
      }).catch((e) => {
        console.log(e)
      })
    },

    seachCandidate () {
      if (!this.seachString || this.seachString.trim() === '') return
      let params = {
        seachString: this.seachString.trim()
      }
      candidateService.seachCandidate(params).then((res) => {
        if (res.data.success) {
          this.candidate = res.data.data
          this.reformatCandidate()
        } else {
          commonHelper.showMessage('Không có ứng viên thỏa điều kiện')
        }
      }).catch((e) => {
        console.log(e)
      })
    },

    createProfile () {
      if (this.candidate.identify_id) {
        let dataSend = {
          'field': 'personal_id_number',
          'value': this.candidate.identify_id
        }
        profileService.existedFieldValue(dataSend)
          .then(response => {
            if (response.data.success) {
              if (response.data.exist) {
                this.profileExist = response.data.data
                this.$bvModal.show('modal-exist-profile')
              } else {
                this.redirectToMasterProfile()
              }
            } else {
              this.redirectToMasterProfile()
            }
          })
      } else {
        this.redirectToMasterProfile()
      }
    },

    redirectToMasterProfile () {
      let dataCandidate = {}
      if (this.candidate.id) {
        dataCandidate['id'] = this.candidate.id
      }
      if (this.candidate.name) {
        dataCandidate['name'] = this.candidate.name
      }
      if (this.candidate.birthday) {
        dataCandidate['birthday'] = this.candidate.birthday
      }
      if (this.candidate.mail) {
        dataCandidate['mail'] = this.candidate.mail
      }
      if (this.candidate.phone) {
        dataCandidate['phone'] = this.candidate.phone
      }
      if (this.candidate.gender) {
        dataCandidate['gender'] = this.candidate.gender
      }
      if (this.candidate.identify_id) {
        dataCandidate['identify_id'] = this.candidate.identify_id
      }
      if (this.candidate.type_marriage_name) {
        dataCandidate['marital_status_name'] = this.candidate.type_marriage_name
      }
      if (this.candidate.province_now_id) {
        dataCandidate['province_now_id'] = this.candidate.province_now_id
      }
      if (this.candidate.district_now_id) {
        dataCandidate['district_now_id'] = this.candidate.district_now_id
      }
      if (this.candidate.subdistrict_now_id) {
        dataCandidate['subdistrict_now_id'] = this.candidate.subdistrict_now_id
      }
      if (this.candidate.detail_now) {
        dataCandidate['detail_now'] = this.candidate.detail_now
      }
      if (this.candidate.province_household_id) {
        dataCandidate['province_household_id'] = this.candidate.province_household_id
      }
      if (this.candidate.district_household_id) {
        dataCandidate['district_household_id'] = this.candidate.district_household_id
      }
      if (this.candidate.subdistrict_household_id) {
        dataCandidate['subdistrict_household_id'] = this.candidate.subdistrict_household_id
      }
      if (this.candidate.detail_household) {
        dataCandidate['detail_household'] = this.candidate.detail_household
      }
      if (this.candidate.province_register_id) {
        dataCandidate['province_register_id'] = this.candidate.province_register_id
      }
      if (this.candidate.district_register_id) {
        dataCandidate['district_register_id'] = this.candidate.district_register_id
      }
      if (this.candidate.province_grant_identify_id) {
        dataCandidate['province_grant_identify_id'] = this.candidate.province_grant_identify_id
      }
      if (this.candidate.date_grant_identify_id) {
        dataCandidate['date_grant_identify_id'] = this.candidate.date_grant_identify_id
      }
      if (this.candidate.academy_level) {
        dataCandidate['academy_level'] = this.candidate.academy_level
      }
      if (this.candidate.type_marriage_name) {
        dataCandidate['type_marriage_name'] = this.candidate.type_marriage_name
      }
      dataCandidate['status'] = this.candidate.status
      dataCandidate['evaluate'] = this.candidate.evaluate

      sessionStorage.setItem('candidate', JSON.stringify(dataCandidate))
      this.$router.push({name: 'add-master-profile'})
    }
  }
}
</script>
