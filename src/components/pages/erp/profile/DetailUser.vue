<template>
    <div class="detail-user">
        <div class="row">
            <div class="col-md-12 create-user">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 input-user-info">
                            <div class="row no-gutters">
                                <div class="col-md-12 col-lg-12 col-xl-12">
                                    <h6 class="card-header">
                                        <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-tttk><i class="ion  ion-ios-add-circle"></i>Thông tin tài khoản </a>
                                    </h6>
                                    <b-collapse id="accordion-tttk" visible>
                                        <div class="card-body">
                                            <b-form-row>
                                                <div class="col-3 text-muted mb-3">Tạo bởi</div>
                                                <div class="col-3 mb-3"><span>{{this.userdata.created_by}}</span> </div>
                                                <div class="col-3 text-muted mb-3">Thời gian tạo</div>
                                                <div class="col-3 mb-3"><span>{{this.userdata.created}}</span> </div>
                                            </b-form-row>
                                            <b-form-row>
                                                <b-form-group label="Chọn kho" class="col-md-4">
                                                    <single-select-station
                                                            @handleSelectedStation="handleSelectedStation"
                                                            :station-id="userdata.station_id"
                                                            selectLabel="Chọn"
                                                            :isDisabled="true"
                                                    >
                                                    </single-select-station>
                                                </b-form-group>
                                                <b-form-group label="Module tính lương" class="col-md-4">
                                                    <single-select-module
                                                            @handleSelectedModule="handleSelectedModule"
                                                            :station-id="userdata.station_id"
                                                            :module-id="userdata.module_id"
                                                            selectLabel="Chọn"
                                                            :isDisabled="true"
                                                    >
                                                    </single-select-module>
                                                </b-form-group>
                                                <b-form-group label="Ngày lương chuẩn" class="col-md-4">
                                                    <datepicker
                                                            v-model="userdata.start_date_day"
                                                            :typeable=true
                                                            format="dd-MM-yyyy"
                                                            :bootstrapStyling="true"
                                                            :monday-first="true"
                                                            :full-month-name="true"
                                                            placeholder="Ngày lương chuẩn"
                                                            :calendar-button="true"
                                                            calendar-button-icon="ion ion-md-calendar"
                                                            :clear-button="true"
                                                            :disabled="true"
                                                    />
                                                </b-form-group>
                                            </b-form-row>
                                            <b-form-row>
                                                <b-form-group class="col-md-4"  label="Chọn bộ phận">
                                                    <single-select-department
                                                            @handleSelectedDepartment="handleSelectedDepartment"
                                                            :department-name="userdata.department"
                                                            :isDisabled="true"
                                                    >
                                                    </single-select-department>
                                                </b-form-group>
                                                <b-form-group class="col-md-4" label="Chọn vị trí">
                                                    <single-select-position
                                                            @handleSelectedPosition="handleSelectedPosition"
                                                            :department-name="userdata.department"
                                                            :position-job="userdata.position_job"
                                                            :isDisabled="true"
                                                    >
                                                    </single-select-position>
                                                </b-form-group>
                                                <b-form-group class="col-md-4"  label="Kiểu nhân viên">
                                                    <single-select-work-type
                                                            @handleSelectedWorkType="handleSelectedWorkType"
                                                            :position-job="userdata.position_job"
                                                            :work-type-id="userdata.work_type_id"
                                                            :isDisabled="true"
                                                    >
                                                    </single-select-work-type>
                                                </b-form-group>
                                            </b-form-row>
                                            <b-form-row v-if="isCod">
                                                <b-form-group class="col-md-4" label="Công thức lương COD">
                                                    <single-select-valid-cod-formula
                                                            @handleSelectedFormula="handleSelectedFormula"
                                                            :station-id="this.userdata.station_id"
                                                            :position-job="this.userdata.position_job"
                                                            :work-type-id="this.userdata.work_type_id"
                                                            :formula="this.userdata.cod_formula"
                                                            :username="this.userdata.username"
                                                            :isDisabled="true"
                                                    >
                                                    </single-select-valid-cod-formula>
                                                </b-form-group>
                                                <b-form-group  v-if="allow_edit_level" class="col-md-4" label="Cấp bậc NV">
                                                    <b-form-select
                                                            name="select-ranking"
                                                            v-model="userdata.ranking"
                                                            :options="options.ranking"
                                                            :disabled="true"
                                                    >
                                                    </b-form-select>
                                                </b-form-group>
                                                <b-form-group  v-if="allow_edit_level" class="col-md-4" label="Cấp bậc quản lý">
                                                    <b-form-select
                                                            name="select-manager-level"
                                                            v-model="userdata.manager_level"
                                                            :options="options.manager_level"
                                                            :disabled="true"
                                                    >
                                                    </b-form-select>
                                                </b-form-group>
                                            </b-form-row>
                                            <b-form-row v-show="show_defaultwork">
                                                <b-form-group class="col-md-12" label="Công việc mặc định">
                                                    <b-form-checkbox-group id="checkbox-default-work" v-model="userdata.default_work" name="select-default-work">
                                                        <b-form-checkbox class="custom-checkbox" value="loading_unloading" >Lên xuống tải</b-form-checkbox>
                                                        <b-form-checkbox class="custom-checkbox" value="bagging" >Đóng bao</b-form-checkbox>
                                                        <b-form-checkbox class="custom-checkbox" value="sorting" >Sorting</b-form-checkbox>
                                                        <b-form-checkbox class="custom-checkbox" value="labeling" >Làm hàng</b-form-checkbox>
                                                    </b-form-checkbox-group>
                                                </b-form-group>
                                            </b-form-row>
                                        </div>
                                    </b-collapse>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ttcn><i class="ion  ion-ios-add-circle"></i> Thông tin cá nhân</a>
                            </h6>
                            <b-collapse id="accordion-ttcn" visible>
                                <div class="card-body">
                                    <b-form-row>
                                        <b-media vertical-align="center" class="col-md-2 col-lg-2 col-xl-2 text-center">
                                            <b-img :src="masterProfile.image_profile" width="120" height="160" alt="avatar"/>
                                        </b-media>
                                        <div class="col-md-10 col-lg-10 col-xl-10">
                                            <b-form-row>
                                                <b-form-group label="Trạng thái profile" id="group-fullname" class="col-md-6">
                                                    <b-form-select v-model="masterProfile.status" :options="statusOptions" :disabled="true"></b-form-select>
                                                </b-form-group >
                                                <b-form-group label="Họ tên" id="group-fullname" class="col-md-6">
                                                    <b-form-input
                                                            v-model="masterProfile.fullname"
                                                            id="fullname"
                                                            name="fullname"
                                                            v-validate="'required'"
                                                            placeholder="Họ tên"
                                                            :disabled="true"
                                                            :class="{'is-danger': errors.has('fullname')}"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('fullname') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                </b-form-group >
                                            </b-form-row>
                                            <b-form-row>
                                                <b-form-group label="Số điện thoại" id="input-group-tel" class="col-md-6">
                                                    <b-form-input
                                                            v-model="masterProfile.tel"
                                                            name="input-tel"
                                                            :disabled="true"
                                                            v-validate="'required|numeric'"
                                                            :class="{'is-danger': errors.has('input-tel')}"
                                                            placeholder="Số điện thoại"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('input-tel') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                    <span v-show="errors.firstRule('input-tel') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                                </b-form-group>
                                                <b-form-group label="Email cá nhân" id="input-group-personal-email" class="col-md-6">
                                                    <b-form-input
                                                            v-model="masterProfile.personal_email"
                                                            id="input-personal-email"
                                                            name="personal-email"
                                                            :disabled="true"
                                                            placeholder="Email cá nhân"
                                                    >
                                                    </b-form-input>
                                                    <span v-show="errors.firstRule('personal-email') == 'email'" class="help is-danger">Email không đúng định dạng </span>
                                                </b-form-group>
                                            </b-form-row>
                                        </div>
                                    </b-form-row>
                                </div>
                            </b-collapse>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-so-yeu-li-lich><i class="ion  ion-ios-add-circle"></i>&nbsp;Sơ yếu lí lịch</a>
                            </h6>
                            <b-collapse id="collapse-so-yeu-li-lich" visible>
                                <b-form-row>
                                    <div class="col-md-12 col-lg-12 col-xl-12">
                                        <div class="card-body">
                                            <b-form-row>
                                                <b-form-group label="Ngày sinh" class="col-md-3">
                                                    <datepicker
                                                            v-model="masterProfile.birthday"
                                                            :typeable=true
                                                            name="birthday"
                                                            format="dd-MM-yyyy"
                                                            :bootstrapStyling="true"
                                                            :monday-first="true"
                                                            :full-month-name="true"
                                                            placeholder="Ngày sinh"
                                                            :calendar-button="true"
                                                            calendar-button-icon="ion ion-md-calendar"
                                                            :clear-button="true"
                                                            :disabled="true"
                                                    />
                                                </b-form-group>
                                                <b-form-group label="Giới tính" id="input-group-gender" class="col-md-3">
                                                    <b-form-select
                                                            :class="{'is-danger': errors.has('gender')}"
                                                            name="gender"
                                                            v-model="masterProfile.gender"
                                                            :disabled="true"
                                                            :options="options.gender">
                                                    </b-form-select>
                                                </b-form-group>
                                                <b-form-group label="CMND/CCCD" id="input-group-personal_id_number" class="col-md-3">
                                                    <b-form-input
                                                            v-model="masterProfile.personal_id_number"
                                                            id="personal-id-number"
                                                            name="personal-id-number"
                                                            :disabled="true"
                                                            placeholder="CMND/CCCD"
                                                    >
                                                    </b-form-input>
                                                </b-form-group>
                                                <b-form-group label="Ngày cấp CMND" class="col-md-3">
                                                    <datepicker
                                                            name="doi-personal-id-number"
                                                            v-model="masterProfile.doi_personal_id_number"
                                                            :typeable=true
                                                            format="dd-MM-yyyy"
                                                            :bootstrapStyling="true"
                                                            :monday-first="true"
                                                            :full-month-name="true"
                                                            placeholder="Ngày cấp CMND/CCCD"
                                                            :calendar-button="true"
                                                            calendar-button-icon="ion ion-md-calendar"
                                                            :clear-button="true"
                                                            :disabled="true"
                                                    />
                                                </b-form-group>
                                                <b-form-group label="Nơi cấp" class="col-md-3">
                                                    <single-select-province
                                                            :placeholder="'Nơi cấp CMND'"
                                                            @handleSelectedProvince="selectedPoiPersonalId"
                                                            :provinceId="masterProfile.poi_personal_id_number" :isDisabled="true">
                                                    </single-select-province>
                                                </b-form-group>
                                                <b-form-group label="Hôn nhân" id="input-group-ethnic" class="col-md-3">
                                                    <b-form-select
                                                            name="marital-status"
                                                            :disabled="true"
                                                            v-model="masterProfile.marital_status"
                                                            :options="options.marital_status">
                                                    </b-form-select>
                                                </b-form-group>
                                                <b-form-group label="Dân tộc" id="input-group-ethnic" class="col-md-3">
                                                    <b-form-input
                                                            v-model="masterProfile.ethnic"
                                                            id="input-ethnic"
                                                            placeholder="Dân tộc"
                                                            :disabled="true"
                                                    >
                                                    </b-form-input>
                                                </b-form-group>
                                                <b-form-group label="Quốc tịch" id="input-group-nationality" class="col-md-3">
                                                    <b-form-input
                                                            v-model="masterProfile.nationality"
                                                            id="input-nationality"
                                                            placeholder="Quốc tịch"
                                                            :disabled="true"
                                                    >
                                                    </b-form-input>
                                                </b-form-group>
                                            </b-form-row>
                                            <b-form-row>
                                                <div class="col-md-6 col-lg-6 col-xl-6">
                                                    <div>
                                                        <h6>Nơi sinh </h6>
                                                        <b-form-row>
                                                            <b-form-group id="input-group-birthplace-province" class="col-md-4">
                                                                <single-select-province
                                                                        @handleSelectedProvince="selectedBirthplaceProvince"
                                                                        :provinceId="masterProfile.birthplace_province" :isDisabled="true">
                                                                </single-select-province>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-birthplace-district" class="col-md-4">
                                                                <single-select-district
                                                                        @handleSelectedDistrict="selectedBirthplaceDistrict"
                                                                        :provinceId="masterProfile.birthplace_province"
                                                                        :districtId="masterProfile.birthplace_district" :isDisabled="true">
                                                                </single-select-district>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-birthplace-sub-district" class="col-md-4">
                                                                <single-select-sub-district
                                                                        @handleSelectedSubDistrict="selectedBirthplaceSubDistrict"
                                                                        :districtId="masterProfile.birthplace_district"
                                                                        :subDistrictId="masterProfile.birthplace_sub_district" :isDisabled="true">
                                                                </single-select-sub-district>
                                                            </b-form-group>
                                                        </b-form-row>
                                                        <h6>Chỗ ở hiện tại </h6>
                                                        <b-form-row>
                                                            <b-form-group id="input-group-current-address-province" class="col-md-4">
                                                                <single-select-province
                                                                        @handleSelectedProvince="selectedCurrentProvince"
                                                                        :provinceId="masterProfile.current_address_province" :isDisabled="true">
                                                                </single-select-province>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-current-address-district" class="col-md-4">
                                                                <single-select-district
                                                                        @handleSelectedDistrict="selectedCurrentDistrict"
                                                                        :provinceId="masterProfile.current_address_province"
                                                                        :districtId="masterProfile.current_address_district" :isDisabled="true">
                                                                </single-select-district>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-current-address-sub-district"
                                                                          class="col-md-4">
                                                                <single-select-sub-district
                                                                        @handleSelectedSubDistrict="selectedCurrentSubDistrict"
                                                                        :districtId="masterProfile.current_address_district"
                                                                        :subDistrictId="masterProfile.current_address_sub_district" :isDisabled="true">
                                                                </single-select-sub-district>
                                                            </b-form-group>
                                                            <b-form-group label="Chi tiết chỗ ở" class="col-md-12">
                                                                <b-form-textarea
                                                                        v-model="masterProfile.current_address_detail"
                                                                        placeholder="Chi tiết chỗ ở"
                                                                        rows="1"
                                                                        :disabled="true"
                                                                ></b-form-textarea>
                                                            </b-form-group>
                                                        </b-form-row>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 col-lg-6 col-xl-6">
                                                    <div>
                                                        <h6>Nguyên quán </h6>
                                                        <b-form-row>
                                                            <b-form-group id="input-group-native-country-province" class="col-md-4">
                                                                <single-select-province
                                                                        @handleSelectedProvince="selectedNativeProvince"
                                                                        :provinceId="masterProfile.native_country_province" :isDisabled="true">
                                                                </single-select-province>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-native-country-district" class="col-md-4">
                                                                <single-select-district
                                                                        @handleSelectedDistrict="selectedNativeDistrict"
                                                                        :provinceId="masterProfile.native_country_province"
                                                                        :districtId="masterProfile.native_country_district" :isDisabled="true">
                                                                </single-select-district>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-native-country-sub-district" class="col-md-4">
                                                                <single-select-sub-district
                                                                        @handleSelectedSubDistrict="selectedNativeSubDistrict"
                                                                        :districtId="masterProfile.native_country_district"
                                                                        :subDistrictId="masterProfile.native_country_sub_district" :isDisabled="true">
                                                                </single-select-sub-district>
                                                            </b-form-group>
                                                        </b-form-row>
                                                        <h6>Thường trú </h6>
                                                        <b-form-row>
                                                            <b-form-group id="input-group-resident-address-province" class="col-md-4">
                                                                <single-select-province
                                                                        @handleSelectedProvince="selectedResidentProvince"
                                                                        :provinceId="masterProfile.resident_address_province" :isDisabled="true">
                                                                </single-select-province>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-resident-address-district" class="col-md-4">
                                                                <single-select-district
                                                                        @handleSelectedDistrict="selectedResidentDistrict"
                                                                        :provinceId="masterProfile.resident_address_province"
                                                                        :districtId="masterProfile.resident_address_district" :isDisabled="true">
                                                                </single-select-district>
                                                            </b-form-group>
                                                            <b-form-group id="input-group-resident-address-sub-district"
                                                                          class="col-md-4">
                                                                <single-select-sub-district
                                                                        @handleSelectedSubDistrict="selectedResidentSubDistrict"
                                                                        :districtId="masterProfile.resident_address_district"
                                                                        :subDistrictId="masterProfile.resident_address_sub_district" :isDisabled="true">
                                                                </single-select-sub-district>
                                                            </b-form-group>
                                                            <b-form-group label="Chi tiết thường trú" class="col-md-12">
                                                                <b-form-textarea
                                                                        v-model="masterProfile.resident_address_detail"
                                                                        placeholder="Chi tiết thường trú"
                                                                        rows="1"
                                                                        :disabled="true"
                                                                ></b-form-textarea>
                                                            </b-form-group>
                                                        </b-form-row>
                                                    </div>
                                                </div>
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
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-6 col-lg-12 col-xl-6 current-salary">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-hoc-van-ngan-hang><i class="ion  ion-ios-add-circle"></i>&nbsp;Học vấn</a>
                            </h6>
                        </div>
                        <div class="col-md-6 col-lg-12 col-xl-6">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-hoc-van-ngan-hang><i class="ion  ion-ios-add-circle"></i>&nbsp;Tài khoản ngân hàng</a>
                            </h6>
                        </div>
                    </div>
                    <b-collapse id="collapse-hoc-van-ngan-hang" visible>
                        <div class="row no-gutters row-bordered">
                            <div class="col-md-6 col-lg-12 col-xl-6 current-salary">
                                <div class="card-body">
                                    <b-form-row>
                                        <b-form-group label="Học vấn" id="input-group-degree" class="col-md-6">
                                            <b-form-select
                                                    v-model="masterProfile.degree"
                                                    :disabled="true"
                                                    :options="options.degree"
                                            >
                                            </b-form-select>
                                        </b-form-group>
                                        <b-form-group label="Trường học" id="input-group-college" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.college"
                                                    id="input-college"
                                                    placeholder="Trường học"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Chuyên ngành" id="input-group-speciality" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.speciality"
                                                    id="input-speciality"
                                                    placeholder="Chuyên ngành"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Chứng chỉ" id="input-group-diploma" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.diploma"
                                                    id="input-diploma"
                                                    placeholder="Chứng chỉ"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-form-row>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-12 col-xl-6">
                                <div class="card-body">
                                    <b-form-row>
                                        <b-form-group label="Số TK ngân hàng" id="input-group-bank-account-number" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.bank_account_number"
                                                    id="bank-account-number"
                                                    name="bank-account-number"
                                                    :disabled="true"
                                                    placeholder="Số TK ngân hàng"
                                            >
                                            </b-form-input>
                                            <span v-show="errors.firstRule('bank-account-number') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                        </b-form-group>
                                        <b-form-group label="Tên chủ TK" id="input-group-bank-account-name" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.bank_account_name"
                                                    id="input-bank-account-name"
                                                    :disabled="true"
                                                    placeholder="Tên chủ TK"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Ngân hàng" id="input-group-bank-name" class="col-md-6">
                                            <single-select-bank
                                                    @handleSelectedBank="handleSelectedBank"
                                                    :bank-code="masterProfile.bank_name"
                                                    selectLabel="Chọn"
                                                    :isDisabled="true"
                                            >
                                            </single-select-bank>
                                        </b-form-group>
                                        <b-form-group label="Chi nhánh" id="input-group-bank-brand" class="col-md-6">
                                            <single-select-bank-brand
                                                    @handleSelectedBank="handleSelectedBankBrand"
                                                    :bank-code="masterProfile.bank_name"
                                                    :bank-id="masterProfile.bank_brand"
                                                    selectLabel="Chọn"
                                                    :isDisabled="true"
                                            >
                                            </single-select-bank-brand>
                                        </b-form-group>
                                    </b-form-row>
                                </div>
                            </div>
                        </div>
                    </b-collapse>
                </div>
            </div>
            <hr class="border-light container-m--x mt-0 mb-4">
            <br/>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-6 col-lg-12 col-xl-6">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-thue-bao-hiem><i class="ion  ion-ios-add-circle"></i>&nbsp;Thuế</a>
                            </h6>
                        </div>
                        <div class="col-md-6 col-lg-12 col-xl-6">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-thue-bao-hiem><i class="ion  ion-ios-add-circle"></i>Bảo hiểm</a>
                            </h6>
                        </div>
                    </div>
                    <b-collapse id="collapse-thue-bao-hiem" visible>
                        <div class="row no-gutters row-bordered">
                            <div class="col-md-6 col-lg-12 col-xl-6 current-salary">
                                <div class="card-body">
                                    <b-form-row>
                                        <b-form-group label="MST" id="input-group-tax-iden-number" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.tax_iden_number"
                                                    id="input-tax-iden-number"
                                                    placeholder="MST"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Ngày cấp MST" id="input-group-date-tax-iden-number" class="col-md-6">
                                            <datepicker
                                                    v-model="masterProfile.date_tax_iden_number"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Ngày cấp MST"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group label="Nơi cấp MST" id="input-group-poi-tax-iden-number" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.poi_tax_iden_number"
                                                    id="input-poi-tax-iden-number"
                                                    placeholder="Nơi cấp MST"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Số người phụ thuộc" id="input-group-no-of-dependants" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.no_of_dependants"
                                                    id="input-no-of-dependants"
                                                    type="number"
                                                    placeholder="Số người phụ thuộc"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-form-row>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-12 col-xl-6">
                                <div class="card-body">
                                    <b-form-row>
                                        <b-form-group label="Số sổ BH" id="input-group-insurance-register" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.insurance_register"
                                                    id="input-insurance-register"
                                                    placeholder="Số sổ BH"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Số thẻ BHYT" id="input-group-health-ins-number" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.health_ins_number"
                                                    id="input-health-ins-number"
                                                    placeholder="Số thẻ BHYT"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Nơi đăng kí KCB" id="input-group-hospital-register" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.hospital_register"
                                                    id="input-hospital-register"
                                                    placeholder="Nơi đăng kí KCB"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Số SHK" id="input-group-shk-number" class="col-md-6">
                                            <b-form-input
                                                    v-model="masterProfile.shk_number"
                                                    id="input-shk-number"
                                                    placeholder="Số SHK"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-form-row>
                                </div>
                            </div>
                        </div>
                    </b-collapse>
                </div>
            </div>
            <hr class="border-light container-m--x mt-0 mb-4">
            <br/>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-tham-chieu><i class="ion  ion-ios-add-circle"></i>&nbsp;Tham chiếu</a>
                            </h6>
                            <b-collapse id="collapse-tham-chieu" visible>
                                <div class="card-body">
                                    <b-form-row>
                                        <b-form-group label="Họ tên chủ hộ" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.full_name_household"
                                                    id="input-full-name-household"
                                                    placeholder="Họ tên chủ hộ"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Năm sinh chủ hộ" class="col-md-3 col-lg-3 col-xl-3">
                                            <datepicker
                                                    v-model="masterProfile.dob_household"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Năm sinh chủ hộ"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group label="MQH chủ hộ" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.relation_with_household"
                                                    id="input-relation-with-household"
                                                    placeholder="MQH chủ hộ"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="CMND chủ hộ" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.id_number_household"
                                                    name="id-number-household"
                                                    placeholder="CMND chủ hộ"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-form-row>
                                    <b-form-row>
                                        <b-form-group label="Họ tên Bố" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.father_name"
                                                    id="input-father-name"
                                                    placeholder="Họ tên Bố"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Năm sinh của bố" class="col-md-3 col-lg-3 col-xl-3">
                                            <datepicker
                                                    v-model="masterProfile.dob_father"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Năm sinh của bố"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group label="số CMND bố" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.cmnd_father"
                                                    name="id-number-father"
                                                    :disabled="true"
                                                    placeholder="số CMND bố"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Số ĐT bố" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.mobile_father"
                                                    id="tel-father"
                                                    name="tel-father"
                                                    :disabled="true"
                                                    :class="{'is-danger': errors.has('tel-father')}"
                                                    placeholder="Số ĐT bố"
                                            >
                                            </b-form-input>
                                            <span v-show="errors.firstRule('tel-father') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                        </b-form-group>
                                    </b-form-row>
                                    <b-form-row >
                                        <b-form-group label="Họ tên Mẹ" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.mother_name"
                                                    id="input-mother-name"
                                                    placeholder="Họ tên Mẹ"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Năm sinh của mẹ" class="col-md-3 col-lg-3 col-xl-3">
                                            <datepicker
                                                    v-model="masterProfile.dob_mother"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Năm sinh của mẹ"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group label="số CMND mẹ" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.cmnd_mother"
                                                    name="id-number-mother"
                                                    :disabled="true"
                                                    :class="{'is-danger': errors.has('id-number-mother')}"
                                                    placeholder="số CMND mẹ"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Số ĐT mẹ" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.mobile_mother"
                                                    id="tel-mother"
                                                    name="tel-mother"
                                                    :disabled="true"
                                                    placeholder="Số ĐT mẹ"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-form-row>
                                    <b-form-row>
                                        <b-form-group label="Con(nếu có ghi nhiều dòng)" id="input-group-list-child-household" class="col-md-4">
                                            <b-form-textarea
                                                    v-model="masterProfile.list_child_household"
                                                    placeholder="Con(nếu có ghi nhiều dòng)"
                                                    rows="3"
                                                    max-rows="8"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Các thành viên trong SHK" id="input-group-member-in-household" class="col-md-4">
                                            <b-form-textarea
                                                    v-model="masterProfile.member_in_household"
                                                    placeholder="Các thành viên trong SHK"
                                                    rows="3"
                                                    name="member-in-household"
                                                    max-rows="8"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Người bảo lãnh" id="input-group-reference-people" class="col-md-4">
                                            <b-form-textarea
                                                    v-model="masterProfile.reference_people"
                                                    placeholder="Thông tin người bảo lãnh"
                                                    rows="3"
                                                    max-rows="8"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                    </b-form-row>
                                </div>
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
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-qua-trinh-cong-tac>
                                    <i class="ion  ion-ios-add-circle"></i>&nbsp;Quá trình công tác
                                </a>
                            </h6>
                            <b-collapse id="collapse-qua-trinh-cong-tac" visible>
                                <div class="card-body">
                                    <b-form-row>
                                        <b-form-group label="Ngày vào" class="col-md-3">
                                            <datepicker
                                                    v-model="masterProfile.join_date"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Ngày vào"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group label="Ngày thử việc" class="col-md-3">
                                            <datepicker
                                                    v-model="mainUser.EmpProfile.trial_date"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Ngày thử việc"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group label="Ngày lương chuẩn" class="col-md-3">
                                            <datepicker
                                                    v-model="mainUser.EmpProfile.start_date_day"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Ngày lương chuẩn"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group label="Ngày chính thức" class="col-md-3">
                                            <datepicker
                                                    v-model="mainUser.EmpContract.contract_date"
                                                    :typeable=true
                                                    format="dd-MM-yyyy"
                                                    :bootstrapStyling="true"
                                                    :monday-first="true"
                                                    :full-month-name="true"
                                                    placeholder="Ngày lương chính thức"
                                                    :calendar-button="true"
                                                    calendar-button-icon="ion ion-md-calendar"
                                                    :clear-button="true"
                                                    :disabled="true"
                                            />
                                        </b-form-group>
                                        <b-form-group class="col-md-3"  label="Bộ phận">
                                            <single-select-department
                                                    @handleSelectedDepartment="mainUserSelectedDepartment"
                                                    :department-name="mainUser.EmpPosition.department"
                                                    :isDisabled="true"
                                            >
                                            </single-select-department>
                                        </b-form-group>
                                        <b-form-group class="col-md-3" label="Vị trí">
                                            <single-select-position
                                                    @handleSelectedDepartment="mainUserSelectedDepartment"
                                                    :department-name="mainUser.EmpPosition.department"
                                                    :position-job="mainUser.EmpPosition.position_job"
                                                    :disabled="true"
                                                    :isDisabled="true"
                                            >
                                            </single-select-position>
                                        </b-form-group>
                                        <b-form-group label="Loại hợp đồng" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="mainUser.EmpContract.type_contract"
                                                    placeholder="Loại hợp đồng"
                                                    :readonly="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Chức vụ" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-input
                                                    v-model="masterProfile.chuc_vu"
                                                    placeholder="Chức vụ"
                                                    :disabled="true"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                        <b-form-group label="Cơ cấu lương" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-textarea
                                                    v-model="masterProfile.salary_config"
                                                    placeholder="Cơ cấu lương"
                                                    rows="2"
                                                    max-rows="4"
                                                    :disabled="true"
                                            >
                                            </b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Bổ nhiệm" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-textarea
                                                    v-model="masterProfile.bo_nhiem"
                                                    placeholder="Bổ nhiệm"
                                                    rows="2"
                                                    max-rows="4"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Giáng chức" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-textarea
                                                    v-model="masterProfile.giang_chuc"
                                                    placeholder="Giáng chức"
                                                    rows="2"
                                                    max-rows="4"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Điều chuyển" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-textarea
                                                    v-model="masterProfile.dieu_chuyen"
                                                    placeholder="Điều chuyển"
                                                    rows="2"
                                                    max-rows="4"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Khen thưởng" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-textarea
                                                    v-model="masterProfile.khen_thuong"
                                                    placeholder="Khen thưởng"
                                                    rows="2"
                                                    max-rows="4"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Kỷ luật" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-textarea
                                                    v-model="masterProfile.ky_luat"
                                                    placeholder="Kỷ luật"
                                                    rows="2"
                                                    max-rows="4"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                        <b-form-group label="Ghi chú khác" class="col-md-3 col-lg-3 col-xl-3">
                                            <b-form-textarea
                                                    v-model="masterProfile.notes"
                                                    placeholder="Ghi chú khác"
                                                    rows="2"
                                                    max-rows="4"
                                                    :disabled="true"
                                            ></b-form-textarea>
                                        </b-form-group>
                                    </b-form-row>
                                </div>
                            </b-collapse>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="border-light container-m--x mt-0 mb-4">
            <br/>
        </div>
    </div>
</template>

<style src="@/vendor/libs/vue-notification/vue-notification.scss" lang="scss"></style>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'
import Notifications from 'vue-notification'
import staffService from 'domain/services/staff-service'
import VeeValidate from 'vee-validate'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import SingleSelectMasterProfile from 'components/elements/common/SingleSelectMasterProfile'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectValidCodFormula from 'components/elements/common/SingleSelectValidCodFormula'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import MasterProfileListUser from 'components/pages/erp/profile/ListUser'
import SingleSelectBank from 'components/elements/common/SingleSelectBank'
import SingleSelectBankBrand from 'components/elements/common/SingleSelectBankBrand'
import MasterProfile from 'domain/entities/MasterProfile'

Vue.use(Notifications)
Vue.use(VeeValidate)
export default {
  name: 'DetailUser',
  components: {
    Notification,
    Multiselect,
    Datepicker,
    SingleSelectStation,
    SingleSelectModule,
    SingleSelectMasterProfile,
    SingleSelectWorkType,
    SingleSelectDepartment,
    SingleSelectPosition,
    SingleSelectValidCodFormula,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    MasterProfileListUser,
    SingleSelectBank,
    SingleSelectBankBrand
  },
  data: () => ({
    listGroupCod: ['12', '14', '17', '18'],
    selectedModule: null,
    userdata: {
      department: '',
      position_job: '',
      work_type_id: '',
      default_work: [],
      station_id: '',
      module_id: '',
      ranking: '',
      manager_level: '',
      start_date_day: '',
      cod_formula: 0,
      created: '',
      created_by: '',
      modified_by: ''
    },
    masterInfo: {
      master_id: ''
    },
    options: {
      default_work: [
        { text: 'Lên xuống tải', value: 'loading_unloading' },
        { text: 'Đóng bao', value: 'bagging' },
        { text: 'Sorting', value: 'sorting' },
        { text: 'Làm hàng', value: 'labeling' }
      ],
      ranking: [
        { text: 'Chọn cấp bậc', value: '' },
        { text: 'F1', value: 'F1' },
        { text: 'F2', value: 'F2' },
        { text: 'J1', value: 'J1' },
        { text: 'J2', value: 'J2' },
        { text: 'J3', value: 'J3' },
        { text: 'S1', value: 'S1' },
        { text: 'S2', value: 'S2' },
        { text: 'S3', value: 'S3' },
        { text: 'S4', value: 'S4' },
        { text: 'S5', value: 'S5' },
        { text: 'Xóa cấp bậc', value: ' ' }
      ],
      manager_level: [
        { text: 'Chọn cấp quản lý', value: '' },
        { text: 'M1', value: 'M1' },
        { text: 'M2', value: 'M2' },
        { text: 'M3', value: 'M3' },
        { text: 'M4', value: 'M4' },
        { text: 'M5', value: 'M5' },
        { text: 'M6', value: 'M6' },
        { text: 'M7', value: 'M7' },
        { text: 'M8', value: 'M8' },
        { text: 'M9', value: 'M9' },
        { text: 'M10', value: 'M10' },
        { text: 'Xóa cấp quản lý', value: ' ' }
      ],
      gender: [
        {
          text: 'Giới tính',
          value: null
        },
        {
          text: 'Nam',
          value: 'male'
        },
        {
          text: 'Nữ',
          value: 'female'
        }
      ],
      marital_status: [
        {
          text: 'Tình trạng hôn nhân',
          value: null
        },
        {
          text: 'Tái hôn',
          value: 'remarried'
        },
        {
          text: 'Ly hôn',
          value: 'divorced'
        },
        {
          text: 'Độc thân',
          value: 'single'
        },
        {
          text: 'Đã kết hôn',
          value: 'married'
        }
      ],
      degree: [
        {
          text: 'Trình độ học vấn',
          value: null
        },
        {
          text: 'Trên đại học',
          value: 'Trên đại học'
        },
        {
          text: 'Đại học',
          value: 'Đại học'
        },
        {
          text: 'Cao đẳng/ Cao đẳng nghề',
          value: 'Cao đẳng/ Cao đẳng nghề'
        },
        {
          text: 'Sơ cấp nghề',
          value: 'Sơ cấp nghề'
        },
        {
          text: 'Dạy nghề thường xuyên',
          value: 'Dạy nghề thường xuyên'
        },
        {
          text: 'Chưa qua đào tạo',
          value: 'Chưa qua đào tạo'
        }
      ]
    },
    show_defaultwork: false,
    allow_edit_level: false,
    listUsers: null,
    statusOptions: MasterProfile.statusOptions,
    mainUser: {
      EmpContract: {
        contract_date: '',
        contract_number: '',
        end_date: '',
        start_date: '',
        type_contract: ''
      },
      EmpProfile: {
        start_date_day: '',
        trial_date: ''
      },
      EmpPosition: {
        department: '',
        position_name: '',
        position_job: ''
      }
    },
    contract: null,
    masterProfile: {
      status: 'active', // Trạng thái
      fullname: '', // họ tên
      tel: '', // Số điện thoại
      contract_number: '',
      gender: null, // Giới tính
      college: '', // Trường học
      diploma: '', // Chứng chỉ
      degree: null, // Trình độ học vấn
      speciality: '', // Chứng chỉ
      birthday: '', // Ngày sinh
      marital_status: null, // Ngày sinh
      ethnic: '', // Dân tộc
      nationality: '', // Quốc tịch
      personal_id_number: '', // CMT/CCCD
      personal_email: '', // Email cá nhân
      doi_personal_id_number: '', // Ngày cấp CMND
      poi_personal_id_number: '', // Nơi cấp CMND
      bank_name: '', // Tên ngân hàng ( bank_code)
      bank_account_number: '', // Số TK ngân hàng
      bank_account_name: '', // Tên chủ TK ngân hàng
      bank_brand: '', // Chi nhánh ngân hàng
      tax_iden_number: '', // Mã số thuế
      poi_tax_iden_number: '', // nơi cấp MST
      date_tax_iden_number: '', // Ngày cấp mã số thuế
      no_of_dependants: '', // Số người phụ thuộc
      insurance_register: '', // Số sổ bảo hiểm
      health_ins_number: '', // Số thẻ BHYT
      hospital_register: '', // Nơi đăng kí KCB
      shk_number: '', // Số sổ HK
      full_name_household: '', // Tên chủ hộ
      dob_household: '', // Ngày sinh chủ hộ
      relation_with_household: '', // Quan hệ với chủ hộ
      id_number_household: '', // CMND chủ hộ
      father_name: '', // Họ tên bố
      dob_father: '', // Ngày sinh của bố
      cmnd_father: '', // CMND bố
      mobile_father: '', // SĐT bố
      mother_name: '', // Họ tên mẹ
      dob_mother: '', // Ngày sinh của mẹ
      cmnd_mother: '', // CMND mẹ
      mobile_mother: '', // SĐT mẹ
      birthplace_province: '', // Nơi sinh - Tỉnh/ thành phố
      birthplace_district: '', // Nơi sinh - Quận/ huyện
      birthplace_sub_district: '', // Nơi sinh - Phường/xã/thị trấn
      native_country_province: '', // Nguyên quán - tỉnh/tp
      native_country_district: '', // Nguyên quán - Quận/ huyện
      native_country_sub_district: '', // Nguyên quán - Xã/phường
      resident_address_province: '', // Địa chỉ thường trú Tỉnh/TP
      resident_address_district: '', // Địa chỉ thường trú Quận/ huyện
      resident_address_sub_district: '', // Địa chỉ thường trú Xã/phường
      resident_address_detail: '', // Địa chỉ thường trú Xã/phường
      current_address_province: '', // Chỗ hiện tại  Tỉnh/TP
      current_address_district: '', // Chỗ hiện tại  Quận/Huyện
      current_address_sub_district: '', // Chỗ hiện tại Xã/phường
      current_address_detail: '', // Chỗ hiện tại / Chi tiết
      list_child_household: '', // danh sách con
      member_in_household: '', // thành viên trong shk
      contact_information: '', // Thông tin liên hệ khi cần
      join_date: '', // Ngày vào
      salary_config: '', // Cơ cấu lương
      chuc_vu: '',
      bo_nhiem: '',
      giang_chuc: '',
      dieu_chuyen: '',
      khen_thuong: '',
      ky_luat: '',
      notes: '', // Ghi chú khác
      image_profile: ''
    }
  }),

  computed: {
    isCod: function () {
      return this.listGroupCod.includes(this.userdata.group_id)
    },
    isEdit: function () {
      return this.$route.params.id > 0
    }
  },

  mounted: function () {
    this.$watch('userdata', function () {
      if ([40, 41, 42, 72].includes(parseInt(this.userdata.position_job))) {
        this.show_defaultwork = true
      } else {
        this.show_defaultwork = false
      }
      if (this.userdata.position_job) {
        let dataCheckEditLevel = {
          user_id: this.userdata.id
        }
        staffService.checkEditLevel(dataCheckEditLevel).then(response => {
          if (response.data.hasOwnProperty('success')) {
            if (response.data.success) {
              this.allow_edit_level = response.data.allow_edit
            }
          }
        })
      }
    }, {deep: true})
  },

  methods: {
    getProfile () {
      this.$startLoading()
      this.isLoading = true
      // load profile to edit
      let dataRequest = {
        master_id: this.masterInfo.master_id
      }
      staffService.getProfile(dataRequest).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let data = response.data.data
            this.masterProfile = data.detail
            this.listUsers = data.listUsers
            if (this.listUsers && this.listUsers.length > 0) {
              this.mainUser = this.listUsers.find((user) => {
                return user.User.main_profile_id === user.EmpProfile.id
              })
              if (this.mainUser.EmpPosition.id) {
                this.mainUser.EmpPosition.position_job = this.mainUser.EmpPosition.id
              }
            }
          } else {
            this.masterProfile = null
            this.notify.success = false
            this.notify.message = response.data.message
            this.showNotification(false)
          }
        } else {
          this.masterProfile = null
          this.notify.success = false
          this.notify.message = 'Có lỗi xảy ra, không load được thông tin profile'
          this.showNotification(false)
        }
      }).catch((error) => {
        this.masterProfile = null
        console.log(error)
      }).then(() => {
        this.isLoading = false
        this.$stopLoading()
      })
    },

    handleChooseMasterProfile (option) {
      this.masterInfo.master_id = option ? option.id : ''
      this.getMasterProfile(option.id)
    },

    handleSelectedModule (option) {
      this.userdata.module_id = option ? option.id : ''
    },

    handleSelectedStation (option) {
      this.userdata.station_id = option ? option.id : ''
    },

    handleSelectedDepartment (option) {
      this.userdata.department = option ? option.name : ''
    },

    handleSelectedPosition (option) {
      this.userdata.position_job = option ? option.id : ''
    },

    handleSelectedWorkType (option) {
      this.userdata.work_type_id = option ? option.id : ''
    },

    handleSelectedFormula (option) {
      this.userdata.cod_formula = option ? option.value : ''
    },

    selectedBirthplaceProvince (option) {
      this.masterProfile.birthplace_province = option ? option.id : ''
    },

    selectedBirthplaceDistrict (option) {
      this.masterProfile.birthplace_district = option ? option.id : ''
    },

    selectedBirthplaceSubDistrict (option) {
      this.masterProfile.birthplace_sub_district = option ? option.id : ''
    },

    selectedNativeProvince (option) {
      this.masterProfile.native_country_province = option ? option.id : ''
    },

    selectedNativeDistrict (option) {
      this.masterProfile.native_country_district = option ? option.id : ''
    },

    selectedNativeSubDistrict (option) {
      this.masterProfile.native_country_sub_district = option ? option.id : ''
    },

    selectedResidentProvince (option) {
      this.masterProfile.resident_address_province = option ? option.id : ''
    },

    selectedResidentDistrict (option) {
      this.masterProfile.resident_address_district = option ? option.id : ''
    },

    selectedResidentSubDistrict (option) {
      this.masterProfile.resident_address_sub_district = option ? option.id : ''
    },

    selectedCurrentProvince (option) {
      this.masterProfile.current_address_province = option ? option.id : ''
    },

    selectedCurrentDistrict (option) {
      this.masterProfile.current_address_district = option ? option.id : ''
    },

    selectedCurrentSubDistrict (option) {
      this.masterProfile.current_address_sub_district = option ? option.id : ''
    },

    selectedPoiPersonalId (option) {
      this.masterProfile.poi_personal_id_number = option ? option.id : ''
    },

    mainUserSelectedDepartment (option) {
      this.mainUser.EmpPosition.department = option ? option.id : ''
    },

    mainUserleSelectedPosition (option) {
      this.mainUser.EmpPosition.position_job = option ? option.id : ''
    },

    handleSelectedBank (option) {
      this.masterProfile.bank_name = option ? option.id : ''
    },

    handleSelectedBankBrand (option) {
      this.masterProfile.bank_brand = option ? option.id : ''
    }
  },
  created () {
    if (!this.$route.params.id) {
      return
    }
    let dataRequest = {
      user_id: this.$route.params.id
    }
    staffService.getUser(dataRequest).then(response => {
      if (response.data.hasOwnProperty('success')) {
        if (response.data.success) {
          this.masterInfo.master_id = response.data.data.MasterProfile.id
          this.userdata.department = response.data.data.EmpPosition.department
          this.userdata.position_job = response.data.data.EmpProfile.position_job
          this.userdata.work_type_id = response.data.data.UserWorkType.work_type_id
          this.userdata.default_work = response.data.data.EmpProfile.default_work
          this.userdata.start_date_day = response.data.data.EmpProfile.start_date_day
          this.userdata.station_id = response.data.data.Station.id
          this.userdata.module_id = response.data.data.User.module_id
          this.userdata.created_by = response.data.data.User.created_by
          this.userdata.created = response.data.data.User.created
          this.userdata.modified_by = response.data.data.User.modified_by
          this.userdata.ranking = response.data.data.EmpProfile.ranking
          this.userdata.manager_level = response.data.data.EmpProfile.manager_level
          this.userdata.cod_formula = parseInt(response.data.cod_formula.formula)
          this.getProfile()
        } else {
          this.notify.success = false
          this.notify.message = response.data.message
          this.showNotification(false)
        }
      } else {
        this.notify.message = 'Có lỗi xảy ra, không load được thông tin tài khoản'
        this.showNotification(false)
        this.$router.push({ name: 'manager-master-profile' })
      }
    })
  }

}

</script>

<style>
    .row-bordered {
        overflow: unset;
    }

    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }

    #checkbox-default-work .custom-checkbox {
        margin-top: 3px;
        width: 22%;
    }
</style>
