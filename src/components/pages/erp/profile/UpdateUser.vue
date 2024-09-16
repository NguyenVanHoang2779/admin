<template>
    <div class="update-user small-scrollbar">
        <div class="row header">
            <div class="col-md-8">
                <h2 v-if="isAdd">Thêm tài khoản {{ masterInfo.id && (masterInfo.had_user ? 'phụ' : 'chính')}}</h2>
                <h2 v-else>Thông tin tài khoản</h2>
            </div>
            <div class="col-md-4">
                <b-row>
                    <b-col md="12" class="text-right">
                        <b-btn v-if="$route.name === 'edit-user'" variant="btn btn-outline-secondary" @click="toggleLogModal">Lịch sử thay đổi tài khoản</b-btn>
                        <router-link :to="{name: 'manager-master-profile'}" class="btn btn-outline-success ml-1"><i class="ion ion-ios-arrow-back"></i> Quản lý Profile</router-link>
                    </b-col>
                </b-row>
            </div>
        </div>
        <div class="notification-user">
            <b-alert
                    :variant="notify_add_user.type"
                    dismissible
                    fade
                    :show="notify_add_user.showDismissibleAlert"
                    @dismissed="notify_add_user.showDismissibleAlert = false"
            >
                <span v-html="notify_add_user.message"></span>
            </b-alert>
        </div>
        <div class="row">
            <div class="col-md-12 create-user">
                <div class="card">
                    <div class="row no-gutters row-bordered">
                        <div class="col-md-4 find-master-profile">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                                <h6 class="card-header"><i class="ion  ion-ios-add-circle"></i>&nbsp;Thông tin
                                    master profile </h6>
                                <div class="card-body">
<!--                                    <b-form-group v-if="isAdd" class="w-100" label="Tìm kiếm Profile">-->
<!--                                        <b-input-group>-->
<!--                                            <single-select-master-profile-->
<!--                                                    v-model="masterProfile.master_id"-->
<!--                                                    :show-info="true"-->
<!--                                                    @handleChooseMasterProfile="handleChooseMasterProfile"-->
<!--                                                    :master-id="masterProfile.master_id"-->
<!--                                            >-->
<!--                                            </single-select-master-profile>-->
<!--                                        </b-input-group>-->
<!--                                    </b-form-group>-->
                                    <div class="row">
                                        <div class="col-6 col-xl-5 text-muted mb-3">Họ tên</div>
                                        <div class="col-6 col-xl-7 mb-3">
                                            <span class="text-big">{{masterInfo.fullname}}</span>
                                        </div>
                                        <div class="col-6 col-xl-5 text-muted mb-3">Mã nhân viên</div>
                                        <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.staff_code}}</span> </div>
                                        <div class="col-6 col-xl-5 text-muted mb-3" v-if="viewUserInfo">Số CMT</div>
                                        <div class="col-6 col-xl-7 mb-3" v-if="viewUserInfo"><span class="text-big">{{masterInfo.personal_id_number}}</span></div>
                                        <div class="col-6 col-xl-5 text-muted mb-3">Điện thoại</div>
                                        <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.tel || masterInfo.tel2}}</span> </div>
                                        <div class="col-6 col-xl-5 text-muted mb-3">Email</div>
                                        <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{masterInfo.personal_email || masterInfo.company_email}}</span> </div>
                                    </div>
                                    <div v-if="isEdit && viewUserInfo">
                                        <router-link :to="{name: 'detail-evaluation', params: { id: $route.params.id }, query: { from: time_format.from, to: time_format.to }}">Thông tin đánh giá trong tháng <i class="ion ion-ios-arrow-dropright"></i></router-link>
                                    </div>
                                    <div class="mt-1">
                                        <router-link :to="{name: 'edit-master-profile', params: { id: masterProfile.master_id || null }}">Chi tiết profile <i class="ion ion-ios-arrow-dropright"></i></router-link>
                                    </div>
                                    <div class="mt-1" v-if="viewUserLevel && isTech">
                                        <a class="link-item" :href="`/adm/profile/staff/${userdata.id}`" target="_blank">Kỹ năng <i class="ion ion-ios-arrow-dropright"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8 input-user-info">
                            <div class="row no-gutters">
                                <div class="col-md-12 col-lg-12 col-xl-12">
                                    <h6 class="card-header">
                                      <i class="ion ion-ios-add-circle"></i>
                                      Thông tin tài khoản
                                      <span v-show="isEdit">
                                        <span v-show="isMainUser"><span class="text-success" >- Tài khoản chính</span></span>
                                        <span v-show="isMainUser === false"><span class="text-warning">- Tài khoản phụ</span></span>
                                      </span>
                                    </h6>
                                    <div v-show="masterProfile.master_id" class="card-body">
                                        <!-- Cảnh báo nghỉ việc -->
                                        <b-alert :show="userdata.lock_reason && +userdata.status_id !== 3" variant="warning">
                                          <b>{{ userStatusDesc[userdata.status_id] }}</b>
                                          do nhân viên <b>{{ userdata.lock_reason }}</b>
                                          <span v-if="userdata.no_checkin_from || masterInfo.resign_date">
                                            từ ngày <b>{{ moment(userdata.no_checkin_from || masterInfo.resign_date).format('DD-MM-YYYY') }}</b>
                                          </span>
                                          <b>(bởi {{ userdata.lock_by }})</b>
                                        </b-alert>
                                        <!-- Cảnh báo khi thêm ngày tài khoản dừng hoạt động -->
                                        <b-alert :show="showNotiDisableDate && +userdata.status_id === 3 && !masterInfo.resign_date" variant="warning">
                                          <b class="text-uppercase">Lưu ý: </b>
                                          Nếu nhân viên nghỉ việc vui lòng cập nhật thông tin nghỉ việc trong
                                          <router-link class="link" :to="{name: 'edit-master-profile', params: { id: masterProfile.master_id }}">Master Profile</router-link>
                                          , <i><b>Ngày tài khoản ngừng hoạt động</b></i> sẽ tự update theo ngày nghỉ việc
                                        </b-alert>
                                        <!-- Cảnh báo khóa tài khoản -->
                                        <b-alert :show="showNotiDisableDate && +userdata.status_id === 3" variant="warning">
                                          <b class="text-uppercase">Lưu ý: </b>
                                          <b>{{ moment(userdata.disable_date) > moment() ? 'Ngày ' + moment(userdata.disable_date).format('DD-MM-YYYY') : ''}}</b>
                                          Tài khoản sẽ <i><b class="text-danger">ngừng hoạt động</b></i>
                                        </b-alert>
                                        <!-- Cảnh báo tài khoản phụ -->
                                        <b-alert :show="isAdd && masterInfo.had_user" variant="warning">
                                          <b>Lưu ý: Thông tin của tài khoản phụ sẽ không thể thay đổi sau khi tạo user</b>
                                        </b-alert>
                                        <!-- form data  -->
                                      <div v-if="viewUserInfo">
                                        <b-form-row>
                                          <b-form-group v-if="masterInfo.is_virtual == 1" label="Tên tài khoản (Update cho tài khoản thuộc profile ảo)" class="col-md-12">
                                            <b-form-input v-model="userdata.fullname" class="w-50 d-inline-block"></b-form-input>
                                            <b-btn v-if="isEdit" @click="updateFullname()" class="btn btn-outline-success btn-sm">Thay đổi tên</b-btn>
                                          </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group v-if="isEdit" label="Username" class="col-md-4">
                                                <b-form-input :disabled="true" :value="userdata.username"></b-form-input>
                                            </b-form-group>
                                            <b-form-group v-if="isAdd && checkCanCustomizeUsername()" label="Username" class="col-md-4">
                                              <b-button v-if="!activeCustomizeUsername" class="btn btn-outline-success btn-sm" @click="customizeUsername()">Tạo username không theo rule</b-button>
                                              <div v-else>
                                                <b-form-input
                                                  v-model="userdata.username"
                                                  id="input-user-name"
                                                  placeholder="Nhập username"
                                                  v-validate="{regex: /^[a-zA-Z0-9]*$/ }"
                                                  name="input-user-name"
                                                  :class="{'is-danger': errors.has('input-user-name')}"
                                                >
                                                </b-form-input>
                                                <span v-show="errors.firstRule('input-user-name') == 'regex'" class="help is-danger">Vui lòng nhập chữ hoặc số</span>
                                                <b-button class="btn btn-outline-warning btn-sm mt-2" @click="cancelCustomizeUsername()">Bỏ qua</b-button>
                                              </div>
                                            </b-form-group>
                                            <b-form-group label="Ngày tài khoản bắt đầu hoạt động" class="col-md-4">
                                                <datepicker
                                                        v-model="userdata.active_date"
                                                        format="dd-MM-yyyy"
                                                        :bootstrapStyling="true"
                                                        :monday-first="true"
                                                        :full-month-name="true"
                                                        placeholder="Ngày tài khoản bắt đầu hoạt động"
                                                        :calendar-button="true"
                                                        calendar-button-icon="ion ion-md-calendar"
                                                        :clear-button="true"
                                                        :required="true"
                                                />
                                                <input v-validate="'required'" v-model="userdata.active_date" type="hidden" name="active-date" >
                                                <span v-show="errors.firstRule('active-date') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                            <b-form-group label="Ngày tài khoản ngừng hoạt động" class="col-md-4">
                                                <datepicker
                                                        v-model="userdata.disable_date"
                                                        format="dd-MM-yyyy"
                                                        :bootstrapStyling="true"
                                                        :monday-first="true"
                                                        :full-month-name="true"
                                                        placeholder="Ngày tài khoản ngừng hoạt động"
                                                        :calendar-button="true"
                                                        calendar-button-icon="ion ion-md-calendar"
                                                        :clear-button="true"
                                                        :disabled-dates="{to: new Date(userdata.active_date)}"
                                                />
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group label="Chọn kho" class="col-md-4">
                                                <single-select-station
                                                        custom-class=""
                                                        @handleSelectedStation="handleSelectedStation"
                                                        :station-id="userdata.station_id"
                                                        selectLabel="Chọn"
                                                >
                                                </single-select-station>
                                                <input v-validate="'required'" v-model="userdata.station_id" type="hidden" name="input-station" >
                                                <span v-show="errors.firstRule('input-station') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                            <b-form-group label="Module tính lương" class="col-md-4">
                                                <single-select-module
                                                        custom-class=""
                                                        @handleSelectedModule="handleSelectedModule"
                                                        :station-id="userdata.station_id"
                                                        :module-id="userdata.module_id"
                                                        selectLabel="Chọn"
                                                >
                                                </single-select-module>
                                            </b-form-group>
                                            <b-form-group label="Ngày lương chuẩn" class="col-md-4">
                                                <datepicker
                                                        v-model="userdata.start_date_day"
                                                        format="dd-MM-yyyy"
                                                        :bootstrapStyling="true"
                                                        :monday-first="true"
                                                        :full-month-name="true"
                                                        placeholder="Ngày lương chuẩn"
                                                        :required="true"
                                                        :calendar-button="true"
                                                        calendar-button-icon="ion ion-md-calendar"
                                                        :clear-button="true"
                                                />
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group class="col-md-4"  label="Chọn bộ phận">
                                                <single-select-department
                                                        @handleSelectedDepartment="handleSelectedDepartment"
                                                        :department-id="userdata.department_id"
                                                >
                                                </single-select-department>
                                                <input v-validate="'required'" v-model="userdata.department_id" type="hidden" name="input-department" >
                                                <span v-show="errors.firstRule('input-department') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                            <b-form-group class="col-md-4" label="Chọn vị trí">
                                                <single-select-position
                                                  @select="handleSelectedPosition"
                                                  :department-id="userdata.department_id"
                                                  :position-job="userdata.position_job"
                                                  :list-position-disable="listPositionDisable"
                                                >
                                                </single-select-position>
                                                <input v-validate="'required'" v-model="userdata.position_job" type="hidden" name="input-position" >
                                                <span v-show="errors.firstRule('input-position') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                <span v-if="isTech && timeApprove.time.position_job">
                                                  thời gian áp dụng {{ helper.formatDate(timeApprove.time.position_job) }}
                                                  <i class="fas fa-pencil-alt cursor-pointer text-ghtk" @click="checkApproveTime('position_job')"></i>
                                                </span>
                                            </b-form-group>
                                            <b-form-group class="col-md-4"  label="Kiểu nhân viên">
                                                <single-select-work-type
                                                  @handleSelectedWorkType="handleSelectedWorkType"
                                                  :position-job="userdata.position_job"
                                                  :work-type-id="userdata.work_type_id"
                                                  @select="op => checkApproveTime('work_type_id', op && op.id)"
                                                >
                                                </single-select-work-type>
                                                <span v-if="isTech &&timeApprove.time.work_type_id">
                                                  thời gian áp dụng {{ helper.formatDate(timeApprove.time.work_type_id) }}
                                                  <i class="fas fa-pencil-alt cursor-pointer text-ghtk" @click="checkApproveTime('work_type_id')"></i>
                                                </span>
                                                <input v-validate="'required'" v-model="userdata.work_type_id" type="hidden" name="input-work-type" >
                                                <span v-show="errors.firstRule('input-work-type') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row>
                                            <b-form-group class="col-md-4"  label="Chọn chức vụ">
                                                <single-select-duty
                                                  :dutyType="!isTech ? 'operation' : 'office'"
                                                  @handleSelected="handleSelectedDuty"
                                                  :duty-id="userdata.duty_id"
                                                  @select="op => checkApproveTime('duty_id', op && op.id)"
                                                >
                                                </single-select-duty>
                                                <span v-if="isTech && timeApprove.time.duty_id">
                                                  thời gian áp dụng {{ helper.formatDate(timeApprove.time.duty_id) }}
                                                  <i class="fas fa-pencil-alt cursor-pointer text-ghtk" @click="checkApproveTime('duty_id')"></i>
                                                </span>
                                                <input v-validate="'required'" v-model="userdata.duty_id" type="hidden" name="input-duty" >
                                                <span v-show="errors.firstRule('input-duty') == 'required'" class="help is-danger">Không để trống trường này </span>
                                            </b-form-group>
                                            <b-form-group class="col-md-4"  label="Thử thách chức vụ">
                                                <label class="switcher switcher-square">
                                                    <input type="checkbox" class="switcher-input" v-model="userdata.duty_challenge">
                                                    <span class="switcher-indicator">
                                                        <span class="switcher-yes"></span>
                                                        <span class="switcher-no"></span>
                                                      </span>
                                                    <span class="switcher-label">Thử thách</span>
                                                </label>
                                            </b-form-group>
                                            <b-form-group v-if="requiredShift" class="col-md-4"  label="Ca làm việc">
                                              <select-shift
                                                @select="handleSelectedShift"
                                                :shift="userdata.shift"
                                                :disabled="disabledSelectShift"
                                              >
                                              </select-shift>
                                              <input v-validate="'required'" v-model="userdata.shift" type="hidden" name="input-shift" id="input-shift" >
                                              <span v-show="errors.firstRule('input-shift') == 'required'" class="help is-danger">Không để trống trường này </span>
                                              <router-link v-if="isEdit" :to="{path: '/kpi/shift-manage'}" class="btn btn-outline-ghtk btn-sm" title="Sửa ca làm việc" target="_blank">
                                                <span>Sửa ca làm việc</span>
                                              </router-link>
                                              <!-- <b-btn v-else @click="editShift" variant="outline-ghtk" size="sm">Cập nhật ca làm việc</b-btn> -->
                                            </b-form-group>
                                        </b-form-row>

                                        <b-form-row v-if="isCod">
                                            <b-form-group class="col-md-6" label="Công thức lương COD">
                                                <single-select-valid-cod-formula
                                                        @handleSelectedFormula="handleSelectedFormula"
                                                         :station-id="this.userdata.station_id"
                                                         :position-job="this.userdata.position_job"
                                                         :work-type-id="this.userdata.work_type_id"
                                                         :formula="this.userdata.cod_formula"
                                                         :username="this.userdata.username"
                                                        :is-disabled="true"
                                                >
                                                </single-select-valid-cod-formula>
                                            </b-form-group>
                                        </b-form-row>
                                      </div>
                                        <!-- Cảnh báo gán quản lý, nhân viên -->
                                      <div v-if="viewUserReportingLine">
                                        <div class="seperate mb-3"></div>
                                        <b-alert :show="isAdd" variant="warning">
                                          <b>Lưu ý về gán quản lý, nhân viên cho user:</b>
                                          <div>- Quản lý, nhân viên của User sẽ ảnh hưởng đến việc đánh giá Fstar, vui lòng nhập đúng quản lý, nhân viên.</div>
                                          <div>- Nếu không chắc vui lòng để trống thông tin này.</div>
                                          <div>- Việc lấy gợi ý quản lý, nhân viên của user từ hệ thống chỉ mang tính chất tham khảo.</div>
                                        </b-alert>
                                        <b-form-row class="mb-2">
                                            <b-form-group class="col-md-12">
                                              <template slot="label">
                                                <div class="row">
                                                  <div class="col-md-6">Thêm người quản lý</div>
                                                  <div class="col-md-6 text-right" v-if="isEdit && editUserReportingLine">
                                                    <button class="btn btn-outline-ghtk btn-sm" @click="suggestManagerEmployeeForUser()">Lấy gợi ý quản lý, nhân viên</button>
                                                  </div>
                                                  <div class="col-md-6 text-right" v-if="isAdd">
                                                    <button v-if="suggestLeaderEmployeeOK" class="btn btn-outline-danger btn-sm" @click="removeSuggestManagerEmployee">Xóa gợi ý</button>
                                                    <button v-else class="btn btn-outline-ghtk btn-sm" @click="suggestManagerEmployeeForUser()">Lấy gợi ý quản lý, nhân viên</button>
                                                  </div>
                                                </div>
                                              </template>
                                              <SelectUser :key="resetSelectLeader" v-model="leaders" @select="checkUserValidate(...arguments, 'leader')" />
                                            </b-form-group>
                                            <b-form-group label="Thêm nhân viên" class="col-md-12">
                                              <SelectUser v-model="employees" />
                                            </b-form-group>
                                            <div class="text-center w-100" v-if="(!isMainUser || (!editUserInfo && editUserReportingLine)) && isEdit">
                                              <b-btn variant="outline-success" size="sm" @click="updateManagerEmployeeOfUser(true)">Cập nhật quản lý, nhân viên</b-btn>
                                            </div>
                                        </b-form-row>
                                      </div>
                                        <!-- Cấp bậc nhân viên, quản lý -->
                                      <div>
                                        <div class="seperate mb-3"></div>
                                        <b-form-row>
                                          <template v-if="viewUserLevel && !isTech">
                                            <b-form-group :disabled="!editUserlevel" class="col-md-4" label="Cấp bậc NV">
                                                <b-form-select
                                                   name="select-ranking"
                                                   v-model="userdata.ranking"
                                                   :options="options.ranking">
                                                </b-form-select>
                                            </b-form-group>
                                            <b-form-group :disabled="!editUserlevel" class="col-md-4" label="Cấp bậc quản lý">
                                                <b-form-select
                                                   name="select-manager-level"
                                                   v-model="userdata.manager_level"
                                                   :options="options.manager_level">
                                                </b-form-select>
                                            </b-form-group>
                                          </template>
                                          <template v-else-if="viewUserLevel">
                                            <b-form-group
                                              :disabled="!editUserlevel"
                                              class="col-md-4"
                                              :label="[1, 2, 3, 4, 5].includes(+userdata.duty_id) ? 'Cấp bậc quản lý' : 'Cấp bậc nhân viên'"
                                            >
                                              <b-form-select
                                                @input="checkApproveTime('ranking')"
                                                name="select-ranking"
                                                v-model="userdata.ranking"
                                                :options="options.rankingByDuty[userdata.duty_id] || []">
                                              </b-form-select>
                                              <span v-if="isTech && timeApprove.time.ranking">
                                                thời gian áp dụng {{ helper.formatDate(timeApprove.time.ranking) }}
                                                <i class="fas fa-pencil-alt cursor-pointer text-ghtk" @click="checkApproveTime('ranking')"></i>
                                              </span>
                                            </b-form-group>
                                          </template>
                                          <b-form-group disabled class="col-md-4" label="Mã Zoiper" v-if="userdata.zoiper_id">
                                              <b-input
                                                name="zoiper-id"
                                                v-model="userdata.zoiper_id"
                                              >
                                              </b-input>
                                          </b-form-group>
                                        </b-form-row>
                                        <b-form-row v-show="show_defaultwork">
                                            <b-form-group class="col-md-12" label="Công việc mặc định">
                                              <default-work-detail :config-default-work="userdata.default_work" @update-config="updateDefaultWorkConfig($event)" :is-onsite="is_onsite"></default-work-detail>
                                            </b-form-group>
                                        </b-form-row>
                                        <b-form-row v-if="isEdit" class="mb-4">
                                            <div class="col-md-12">
                                              <b-form-input disabled v-if="isChangePass" v-model="userdata.user_password" type="text" placeholder="Mật khẩu mới sẽ được hệ thống tự động tạo" class="w-50 d-inline-block"></b-form-input>
                                              <b-btn v-if="!isChangePass" @click="isChangePass=true" class="btn btn-warning btn-sm">Thay đổi mật khẩu</b-btn>
                                              <span v-else>
                                                <b-btn variant="outline-success" size="sm" @click="confirmChangePass">Thay đổi</b-btn>
                                                <b-btn @click="isChangePass=false" class="btn btn-default btn-sm">Hủy thay đổi mật khẩu</b-btn>
                                              </span>
                                              <b-btn v-if="canCreateZoiperAcc" @click="createZoiperAcc" class="btn btn-outline-ghtk btn-sm">Tạo tài khoản zoiper</b-btn>
                                            </div>
                                        </b-form-row>
                                        <b-form-row v-if="isEdit">
                                            <div class="col-3mb-3">
                                                <span class="text-muted">Tạo bởi:</span> {{this.userdata.created_by}}
                                                <span class="font-italic">({{this.userdata.created}})</span>
                                            </div>
                                        </b-form-row>
                                      </div>
                                    </div>
                                    <div v-show="!masterProfile.master_id" class="card-body">
                                        <div role="alert" aria-live="polite" style="text-align: center" aria-atomic="true" class="alert alert-danger">Vui lòng chọn profile trước khi thêm tài khoản ! nếu chưa có vui lòng tạo Profile</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-alert :show="isMainUser === false && isEdit" variant="warning" class="mb-0">
          <div class="text-center"><b>Lưu ý: </b> Tài khoản phụ sẽ không được tạo hợp đồng, cập nhật. Chỉ cho phép tạo hợp đồng, cập nhật quá trình công tác cho tài khoản chính</div>
        </b-alert>
        <div class="notification-user">
            <b-alert
                    :variant="notify_add_user.type"
                    dismissible
                    fade
                    :show="notify_add_user.showDismissibleAlert"
                    @dismissed="notify_add_user.showDismissibleAlert = false"
            >
                <span v-html="notify_add_user.message"></span>
            </b-alert>
        </div>
        <div v-show="masterProfile.master_id && editUserInfo" class="card-footer border-0 text-center pt-3">
          <span v-show="isEdit">
            <span v-show="isMainUser">
              <span v-show="!hasContract">
                <b-link
                  v-if="!employeeOrder.contract || !employeeOrder.contract.contract || !employeeOrder.contract.contract.new_contract"
                  :to="{name: 'create-order', params: { profileId: masterInfo.id || null, orderType: 'new_contract' }}"
                  class="btn btn-outline-success"
                  target="_blank"
                >
                  <i class="fas fa-plus"></i> Tạo đề xuất hợp đồng
                </b-link>
                <b-link
                  v-else
                  :to="{name: 'list-order', params: { orderCode: employeeOrder.contract.contract.new_contract.id || null }}"
                  class="btn btn-outline-primary"
                  target="_blank"
                >
                  <i class="fas fa-eye"></i> Xem đề xuất hợp đồng
                </b-link>
              </span>
              <router-link
                  v-show="hasContract"
                  :to="{ name: 'contract-detail', params: {id: (userdata.contract_id || null)} }"
                  class="btn btn-success"
                >
                  <i class="ion ion-md-search"></i> Xem chi tiết hợp đồng
                </router-link>
            </span>
          </span>
          <ladda-btn v-if="isAdd" :loading="isProcessingUpdate" @click.native="addUser()" data-style="expand-right" class="btn btn-primary">
              <i class="fas fa-plus"></i> Thêm tài khoản
          </ladda-btn>
          <ladda-btn v-else-if="isMainUser" :loading="isProcessingUpdate" @click.native="confirmEditUser()" data-style="expand-right" class="btn btn-info">
            <i class="icon ion-md-archive"></i> Cập nhật tài khoản
          </ladda-btn>
        </div>
        <div>
            <modal-create-fast-contract :user="userdata"
                :is-cod="isCod" :is-wh-staff="isWhStaff">
            </modal-create-fast-contract>
        </div>
        <modal-user-log :show="toogleLog" :user-id="userdata.id"></modal-user-log>
<!--        <modal-work-process-->
<!--            :end-old-work.sync="userdata.endOldWork"-->
<!--            :start-new-work.sync="userdata.startNewWork"-->
<!--            @confirmEditUser="editUser()"-->
<!--        ></modal-work-process>-->
        <modal-confirm-create-user
            :update-without-create="update_without_create"
            :user-data="userdata"
            :user-data-old="userdataOld"
            :user-id="$route.params.id"
            :master-profile-id="masterProfile.master_id"
            @editUser="editUser"
        >
        </modal-confirm-create-user>
        <b-modal static hide-footer id="select-time-approve" title="Chọn ngày bắt đầu áp dụng" @hidden="checkHasTimeApprove">
          <SelectTimeApprove v-model="timeApprove.time[timeApprove.field]" :label="timeApprove.title" @input="$bvModal.hide('select-time-approve')" />
          <div class="text-center w-100">
            <!-- <b-btn variant="ghtk" @click="$bvModal.hide('select-time-approve')">Xác nhận</b-btn> -->
          </div>
        </b-modal>
    </div>
</template>

<script>
import config from 'config/app.base'
import GchatAuth from 'infrastructures/gchat-auth.js'

import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import SelectUser from 'components/elements/common/SelectUser'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectModule from 'components/elements/common/SingleSelectModule'
import SingleSelectMasterProfile from 'components/elements/common/SingleSelectMasterProfile'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectShift from 'components/elements/common/SingleSelectShift'
import SelectShift from 'components/elements/common/SelectShift'
import SingleSelectDuty from 'components/elements/common/SingleSelectDuty'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectValidCodFormula from 'components/elements/common/SingleSelectValidCodFormula'
import ModalCreateFastContract from 'components/pages/erp/profile/ModalCreateFastContract'
// import ModalWorkProcess from 'components/pages/erp/profile/ModalWorkProcess'
import ModalConfirmCreateUser from 'components/pages/erp/profile/ModalConfirmCreateUser'
import ModalUserLog from './ModalUserLog'
import SelectTimeApprove from './SelectTimeApprove.vue'
import TechStack from '../TeamConfig/TechStack.vue'
import DefaultWorkDetail from './DefaultWorkDetail.vue'

// entities
import User from 'domain/entities/User'
import Group from 'domain/entities/Group'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import cycleTime from 'infrastructures/helpers/date.js'

// service
import hrOrderService from 'domain/services/hr-order-service'
import staffService from 'domain/services/staff-service'
import profileService from 'domain/services/profile-service'
import userService from 'domain/services/user-service'
import teamConfigService from 'domain/services/team-config-service'
import reportingLineService from 'domain/services/Erp/reporting-line-service'
import departmentSuggestLeaderEmployee from '@/const/department'

import moment from 'moment'
import { mapGetters } from 'vuex'

Vue.use(VeeValidate)

const token = (_ => {
  let token = {}
  const iamAuth = JSON.parse(localStorage.getItem(config.oidc.tokenIamStorage))
  if (iamAuth && iamAuth.accessToken) {
    token.IAM = `${config.bearerKey} ${iamAuth.accessToken.accessToken}`
  }

  const gchatToken = GchatAuth.getToken()
  if (gchatToken) {
    token.GchatToken = gchatToken
  }

  return token
})()

export default {
  name: 'add-user',

  components: {
    DefaultWorkDetail,
    LaddaBtn,
    Multiselect,
    Datepicker,
    SelectUser,
    SingleSelectStation,
    SingleSelectModule,
    SingleSelectMasterProfile,
    SingleSelectWorkType,
    SingleSelectDepartment,
    SingleSelectPosition,
    SingleSelectValidCodFormula,
    ModalCreateFastContract,
    ModalUserLog,
    SingleSelectDuty,
    SingleSelectShift,
    // ModalWorkProcess,
    ModalConfirmCreateUser,
    SelectTimeApprove,
    TechStack,
    SelectShift
  },

  props: {
    id: {
      default: null
    }
  },

  data: () => ({
    suggestLeaderEmployeeOK: false,
    listGroupCod: ['12', '14', '17', '18'],
    listPositionDisable: [99, 129],
    isProcessingUpdate: false,
    selectedModule: null,
    whStaffPositions: User.WH_STAFF_GROUPS,
    isChangePass: false,
    leaders: [],
    oldLeaders: [],
    resetSelectLeader: 1,
    employees: [],
    userdata: {
      id: null,
      group_id: null,
      profile_id: null,
      contract_id: null,
      department: '',
      department_id: '',
      position_job: '',
      work_type_id: '',
      duty_id: '',
      duty_challenge: 0,
      shift: null,
      default_work: [],
      station_id: '',
      module_id: '',
      ranking: '',
      manager_level: '',
      start_date_day: '',
      active_date: new Date(),
      disable_date: '',
      cod_formula: 0,
      created: '',
      created_by: '',
      modified_by: '',
      user_password: '',
      username: '',
      fullname: '',
      saveWorkHistory: false,
      main_profile_id: null,
      is_main_user: null,
      endOldWork: null,
      startNewWork: null,
      zoiper_id: null
    },
    skills: [],
    userdataOld: {},
    masterProfile: {
      master_id: ''
    },
    masterInfo: {},
    options: {
      default_work: User.whDefaultWork,
      ranking: User.rankingOption,
      manager_level: User.managerLevelOption,
      rankingByDuty: User.rankingByDuty
    },
    show_defaultwork: false,
    is_onsite: false,
    notify_add_user: {
      showDismissibleAlert: false,
      message: '',
      type: ''
    },
    update_without_create: false,
    toogleLog: false,
    time_format: '',
    userStatusDesc: User.statusOptions,
    showNotiDisableDate: null,
    isFirstLoadPosition: true,
    employeeOrder: {},
    activeCustomizeUsername: false,
    permissions: {},
    timeApprove: {
      field: null,
      title: '',
      time: {
        position_job: null,
        ranking: null,
        duty_id: null,
        work_type_id: null
      }
    }
  }),

  created () {
    this.getStartEndFromTimeRange()
    if (this.$route.name === 'add-user') {
      this.masterProfile.master_id = this.$route.params.id
      this.getMasterProfile(this.masterProfile.master_id)
    }
  },

  computed: {
    helper: _ => helper,
    moment: _ => moment,

    ...mapGetters({
      loginUser: 'userInfo',
      tokenData: 'tokenData'
    }),

    isAdd: function () {
      return this.$route.name === 'add-user'
    },

    isEdit: function () {
      return this.$route.name === 'edit-user'
    },

    isCod: function () {
      return this.listGroupCod.includes(this.userdata.group_id)
    },

    isTech () {
      return +this.userdata.department_id === 2
    },

    isWhStaff: function () {
      return this.userdata.position_job ? [40, 41, 42, 79, 80, 123].includes(parseInt(this.userdata.position_job)) : false
    },

    isPostOfficeStaff: function () {
      return parseInt(this.userdata.group_id) === 19
    },

    isDistributor: function () {
      return parseInt(this.userdata.group_id) === 6
    },

    isDriver: function () {
      return parseInt(this.userdata.group_id) === 16
    },

    isCSB2C: function () {
      return parseInt(this.userdata.position_job) === 34
    },

    isHr () {
      return +this.userdata.group_id === 3
    },

    isOfficeDepartment () {
      return +this.userdata.department_id === 27
    },

    requiredShift () {
      return Group.checkGroupWHStaff(this.userdata.group_id)
    },

    disabledSelectShift () {
      if (this.userdata.shift === null) {
        return false
      }
      return this.userdata.shift.from && this.userdata.shift.to && this.isEdit
    },

    hasContract: function () {
      return this.userdata.contract_id != null
    },

    isMainUser () {
      return this.userdata.main_profile_id ? +this.userdata.main_profile_id === +this.userdata.profile_id : this.userdata.is_main_user
    },

    viewUserInfo () {
      return this.permissions.view_user_info || this.isAdd
    },

    editUserInfo () {
      return this.permissions.edit_user_info || this.isAdd
    },

    viewUserLevel () {
      return this.permissions.view_user_level || this.isAdd
    },

    editUserlevel () {
      return (this.permissions.edit_user_level || this.isAdd) && this.userdata.position_job
    },

    viewUserReportingLine () {
      if (this.isAdd) return true
      if (!this.permissions.view_user_reporting_line) return false
      return this.permissions.view_user_reporting_line === true ||
        (this.permissions.view_user_reporting_line.group && this.permissions.view_user_reporting_line.group.includes(+this.userdata.group_id)) ||
        (this.permissions.view_user_reporting_line.position && this.permissions.view_user_reporting_line.position.includes(+this.userdata.position_job))
    },

    editUserReportingLine () {
      if (this.isAdd) return true
      if (!this.permissions.edit_user_reporting_line) return false
      return this.permissions.edit_user_reporting_line === true ||
        (this.permissions.edit_user_reporting_line.group && this.permissions.edit_user_reporting_line.group.includes(+this.userdata.group_id)) ||
        (this.permissions.edit_user_reporting_line.position && this.permissions.edit_user_reporting_line.position.includes(+this.userdata.position_job))
    },

    canCreateZoiperAcc () {
      return this.isEdit && (this.isHr || this.isOfficeDepartment) && !this.userdata.zoiper_id && this.permissions.create_zoiper
    }
  },

  watch: {
    userdata: {
      handler: function (newValue) {
        if (this.whStaffPositions.includes(parseInt(this.userdata.group_id)) && this.userdata.position_job !== User.WH_STAFF_BIG_SIZE_POSITIONS) {
          this.show_defaultwork = true
        } else {
          this.show_defaultwork = false
        }
        if (+this.userdata.position_job === +User.WH_STAFF_ONSITE_POSITIONS) {
          this.is_onsite = true
        } else {
          this.is_onsite = false
        }
      },
      deep: true
    },

    'userdata.position_job': function (newValue) {
      if (newValue) {
        this.suggestDuty(newValue)
      } else {
        this.userdata.duty_id = 6 // mặc định là nhân viên
      }
      if (!this.isAdd || !newValue || !this.userdata.department_id || !this.userdata.station_id) return
      this.suggestManagerEmployeeForUser()
    },

    isChangePass: function (newVal, oldVal) {
      if (newVal === false) {
        this.userdata.user_password = ''
      }
    },

    'userdata.station_id': function (newValue, oldValue) {
      if (!this.isAdd || !newValue || !this.userdata.department_id || !this.userdata.position_job) return
      this.suggestManagerEmployeeForUser()
    },

    'userdata.module_id' (newVal, oldVal) {
      if (!this.isAdd || !newVal || !this.userdata.department_id || !this.userdata.position_job || !this.userdata.station_id) return
      this.suggestManagerEmployeeForUser()
    },

    'userdata.disable_date': function (newVal, oldVal) {
      this.showNotiDisableDate = !!newVal
    },

    isMainUser (newVal, oldVal) {
      if (newVal && this.masterInfo.id) this.getOrderOfProfile(this.masterInfo.id)
    },

    id: {
      immediate: true,
      handler: function (newVal, oldval) {
        if (newVal) {
          if (this.isAdd) {
            this.masterProfile.master_id = newVal
            return
          }
          this.getDetail(newVal)
        }
      }
    }
  },

  methods: {
    checkCanCustomizeUsername () {
      return this.loginUser && this.loginUser.User && ['ngoctv5', 'binhvt', 'hungtd3'].includes(this.loginUser.User.username)
    },

    customizeUsername () {
      this.activeCustomizeUsername = true
    },

    cancelCustomizeUsername () {
      this.userdata.username = ''
      this.activeCustomizeUsername = false
    },

    checkEditLevel (positionId) {
      if (!positionId) positionId = this.userdata.position_job
      if (!positionId) {
        this.allow_edit_level = false
        return
      }

      staffService.checkEditLevel({ user_id: positionId })
        .then(response => {
          if (response.data.success) {
            this.allow_edit_level = response.data.allow_edit
          } else {
            this.allow_edit_level = false
          }
        })
        .catch(e => {
          console.log(e)
          this.allow_edit_level = false
        })
    },

    suggestDuty (positionId = null) {
      if (!positionId) positionId = this.userdata.position_job
      if (!positionId) {
        this.userdata.duty_id = 6 // mặc định là nhân viên
        return
      }
      profileService.suggestDutyByPosition(positionId)
        .then(res => {
          if (res.data.success) {
            if (!this.isFirstLoadPosition || this.isAdd) {
              this.userdata.duty_id = res.data.data.dutyId
            }
            this.isFirstLoadPosition = false
          } else {
            throw new Error(res.data.message)
          }
        }).catch(e => {
          let message = e.message ? e.message : 'Có lỗi xảy ra khi gợi ý chức vụ!'
          helper.showMessage(message, 'warning')
        })
    },

    getStartEndFromTimeRange () {
      this.time_format = {
        from: cycleTime.daysInThisMonth(21, 20).from,
        to: cycleTime.daysInThisMonth(21, 20).to
      }
      return true
    },

    getManagerEmployeeOfUser (userId) {
      let dataSend = {
        userId: userId
      }
      staffService.getManagerEmployeeOfUser(dataSend)
        .then(res => {
          if (res.data.success) {
            this.leaders = res.data.data.leaders || []
            this.employees = res.data.data.employees || []
          } else {
            this.leaders = []
            this.employees = []
          }
          this.oldLeaders = this.leaders
        })
        .catch(e => {
          console.log(e)
        })
    },

    toggleLogModal () {
      this.toogleLog = !this.toogleLog
    },

    getDetail (userId) {
      this.$startLoading()
      let dataRequest = {
        user_id: userId
      }
      staffService.getUser(dataRequest)
        .then(response => {
          if (response.data.hasOwnProperty('success')) {
            if (response.data.success) {
              let infoUser = response.data.data
              this.userdata.id = infoUser.User.id
              // Lấy thông tin quản lý, nhân viên của user
              this.getManagerEmployeeOfUser(this.userdata.id)
              // this.getSkillOfUser(this.userdata.id)
              this.masterProfile.master_id = infoUser.MasterProfile.id
              this.userdata.contract_id = infoUser.EmpContract.id
              this.userdata.main_profile_id = infoUser.User.main_profile_id
              this.userdata.is_main_user = infoUser.User.is_main_user
              this.userdata.contract_id = infoUser.EmpContract.id
              this.userdata.group_id = infoUser.User.group_id
              this.userdata.profile_id = infoUser.EmpProfile.id
              this.userdata.username = infoUser.User.username
              this.userdata.fullname = infoUser.User.fullname
              this.userdata.department = infoUser.EmpDepartment.name
              this.userdata.duty_id = infoUser.EmpProfile.duty_id
              this.userdata.duty_challenge = parseInt(infoUser.EmpProfile.duty_challenge)
              this.userdata.department_id = infoUser.EmpDepartment.id
              this.userdata.position_job = infoUser.EmpProfile.position_job
              this.userdata.work_type_id = infoUser.UserWorkType.work_type_id
              this.userdata.default_work = (infoUser.DefaultWork && infoUser.DefaultWork.length !== 0) ? infoUser.DefaultWork : [
                {
                  from_date: moment().format('YYYY-MM-DD'),
                  to_date: null,
                  alias_job: []
                }
              ]
              this.userdata.start_date_day = infoUser.EmpProfile.start_date_day
              this.userdata.active_date = infoUser.EmpProfile.active_date
              this.userdata.disable_date = infoUser.EmpProfile.disable_date
              this.userdata.station_id = infoUser.Station.id
              this.userdata.module_id = infoUser.User.module_id
              this.userdata.created_by = infoUser.User.created_by
              this.userdata.created = infoUser.User.created
              this.userdata.modified_by = infoUser.User.modified_by
              this.userdata.status_id = infoUser.User.status_id
              this.userdata.ranking = infoUser.EmpProfile.ranking
              this.userdata.manager_level = infoUser.EmpProfile.manager_level
              this.userdata.cod_formula = parseInt(response.data.cod_formula.formula)
              this.userdata.lock_reason = infoUser.EmpProfile.lock_reason
              this.userdata.lock_from = infoUser.EmpProfile.lock_from
              this.userdata.lock_by = infoUser.EmpProfile.lock_by
              this.userdata.no_checkin_from = infoUser.EmpProfile.no_checkin_from
              this.userdata.shift = infoUser.shift
              this.userdata.zoiper_id = infoUser.zoiper_id
              this.masterInfo = infoUser.MasterProfile
              this.userdataOld = {...this.userdata}
              this.permissions = response.data.permissions || {}
            } else {
              helper.showMessage(response.data.message || 'Không lấy được thông tin tài khoản !', 'warning')
            }
          } else {
            helper.showMessage(response.data.message || 'Có lỗi xảy ra, không load được thông tin tài khoản !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    getSkillOfUser (userId) {
      teamConfigService.getSkillOfUser(userId)
        .then(res => {
          if (res.data.success) {
            this.skills = res.data.data || []
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi lấy kỹ năng của nhân viên')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi khi lấy kỹ năng của nhân viên')
          console.log(e)
        })
        .finally(_ => {

        })
    },

    // auto tạo đề xuất khi tạo user chính
    autoCreateContract (userId) {
      if (!this.masterInfo.id) return
      if (!userId) userId = this.userdata.id

      // Khởi tạo data cho đề xuất hợp đồng dịch vụ
      let dataOrderContract = {
        profile_id: this.masterInfo.id,
        user_id: userId,
        order_category: 'contract',
        order_group: 'contract',
        order_type_id: 34,
        order_type_alias: 'new_contract',
        order_type_name: 'Thêm hợp dồng',
        group_name: 'Hợp đồng',
        note: 'Người lao động mới',
        auto: true
      }

      hrOrderService.updateOrder(dataOrderContract)
        .then(res => {
          if (res.data.success) {
            if (!this.employeeOrder) this.employeeOrder = {}
            if (!this.employeeOrder.contract) this.employeeOrder.contract = {}
            if (!this.employeeOrder.contract.contract) this.employeeOrder.contract.contract = {}
            if (!this.employeeOrder.contract.contract.new_contract) {
              this.employeeOrder.contract.contract.new_contract = {
                category: 'contract',
                category_name: 'Hợp đồng',
                created_by: 1,
                deadline: null,
                group_alias: 'contract',
                group_name: 'Hợp đồng',
                id: res.data.data.id,
                order_type_alias: 'new_contract',
                order_type_id: 34,
                order_type_name: 'Thêm hợp đồng',
                profile_id: res.data.data.profile_id,
                status: res.data.data.status,
                note: res.data.data.note
              }
            }
          } else {
            helper.showMessage('Không thể tự động tạo hợp đồng dịch vụ cho nhân viên, Lý do: ' + (res.data.message || ''), 'warning')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    // Lấy đề xuất chưa hoàn thành của nhân viên
    getOrderOfProfile (profileId = null) {
      if (!profileId) profileId = this.masterInfo.id
      if (!profileId) return
      hrOrderService.getOrderOfProfile({ profile_id: profileId, status: ['cho_duyet', 'da_duyet_supervisor', 'da_duyet_leader', 'thieu_ho_so'], category: 'contract' })
        .then(res => {
          if (res.data.success) {
            if (res.data.data) this.employeeOrder = res.data.data
          } else {
            console.log(res.data.message || 'getOrderOfProfile: Không thể lấy thông tin các đề xuất của nhân viên !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    addUser () {
      if (!this.validateForm()) return false
      this.$validator.validateAll().then(result => {
        if (result) {
          this.userdata.saveWorkHistory = true
          let dataSend = this.userdata
          dataSend.master_id = this.masterProfile.master_id
          dataSend.csrf_token = this.tokenData ? this.tokenData.csrf_token : null
          if (this.isTech && !helper.isEmpty(this.timeApprove.time)) {
            dataSend.timeApprove = this.timeApprove.time
            dataSend.token = token
          }
          if (!this.show_defaultwork) {
            delete dataSend.default_work
          }
          this.isProcessingUpdate = true
          staffService.addUser(dataSend)
            .then(res => {
              if (res.data.success) {
                let userId = res.data.data.user_id
                this.userdata.id = userId
                this.updateManagerEmployeeOfUser(false)
                this.userdata.is_main_user = res.data.data.is_main_user
                // auto tạo hợp đồng cho user chính
                if (this.userdata.is_main_user) this.autoCreateContract(userId)
                helper.showMessage('Tạo tài khoản cho nhân viên thành công', 'success', 'Thành công')
                this.notify_add_user.type = 'success'
                this.notify_add_user.showDismissibleAlert = true
                this.notify_add_user.message = res.data.message

                this.$router.push({ name: 'edit-user', params: { id: userId } })
              } else {
                helper.showMessage(res.data.message || 'Không thêm được tài khoản !', 'warning', 'Lỗi')
              }
            })
            .catch(e => {
              console.log(e)
              helper.showMessage('Có lỗi xảy ra, liên hệ IT để được hỗ trợ !', 'warning', 'Lỗi')
            })
            .then(_ => {
              this.isProcessingUpdate = false
            })
        }
      }).catch(e => {
        console.log(e)
      })
    },

    confirmEditUser () {
      if (!this.validateForm()) return false
      this.$validator.validateAll().then(result => {
        if (result) {
          this.checkIsChangeKpi()
        } else {
          helper.showMessage('Vui lòng nhập đủ thông tin yêu cầu !', 'warning', 'Thiếu thông tin')
        }
      }).catch(e => {
        console.log(e)
      })
    },

    async checkIsChangeKpi () {
      if ((parseInt(this.userdataOld.station_id) === parseInt(this.userdata.station_id) &&
        parseInt(this.userdataOld.position_job) === parseInt(this.userdata.position_job) &&
        parseInt(this.userdataOld.work_type_id) === parseInt(this.userdata.work_type_id)) ||
        this.masterInfo.status === 'not_verified'
      ) {
        this.editUser()
      } else {
        let data = {
          user_id: this.userdata.id,
          old_station_id: this.userdataOld.station_id,
          old_position_id: this.userdataOld.position_job,
          old_work_type_id: this.userdataOld.work_type_id,
          new_station_id: this.userdata.station_id,
          new_position_id: this.userdata.position_job,
          new_work_type_id: this.userdata.work_type_id
        }
        let res = await staffService.checkIsChangeKpi(data)
        if (res.data.success && res.data.isChange) {
          this.update_without_create = res.data.update_without_create || false
          this.$bvModal.show('modal-confirm-create-user')
        } else {
          this.editUser()
        }
      }
    },

    editUser (workHistotyAction = null) {
      if (!this.validateForm()) return false
      this.$validator.validateAll().then(result => {
        if (result) {
          this.userdata.saveWorkHistory = true
          this.updateManagerEmployeeOfUser(false)
          this.updateDefaultWork()
          let dataSend = Object.assign({}, this.userdata)
          dataSend.csrf_token = this.tokenData ? this.tokenData.csrf_token : null
          delete dataSend.username
          delete dataSend.default_work
          dataSend.user_id = this.$route.params.id
          dataSend.master_id = this.masterProfile.master_id
          // phương án cập nhật quá trình công tác (tạo mới, cập nhật bản ghi cuối, xóa bản ghi cuối, ... Mặc định là tạo mới nếu không có)
          // create, update_last, delete_last, ...
          if (workHistotyAction) dataSend.work_history_action = workHistotyAction
          if (this.isTech && !helper.isEmpty(this.timeApprove.time)) {
            dataSend.timeApprove = this.timeApprove.time
            dataSend.token = token
          }
          if (!this.show_defaultwork) {
            delete dataSend.default_work
          }
          this.isProcessingUpdate = true
          staffService.editUser(dataSend)
            .then(res => {
              if (res.data.success) {
                helper.showMessage(res.data.message || 'Cập nhật tài khoản thành công', 'success')
                this.getDetail(this.id)
                helper.resetData(this.timeApporve, null, 10)
              } else {
                helper.showMessage(res.data.message || 'không cập nhật được thông tin tài khoản !', 'warning', 'Lỗi')
              }
            })
            .catch(e => {
              console.log(e)
            })
            .finally(_ => {
              this.isProcessingUpdate = false
            })
        } else {
          helper.showMessage('Vui lòng nhập đủ thông tin yêu cầu !', 'warning', 'Thiếu thông tin')
        }
      }).catch(e => {
        console.log(e)
      })
    },

    confirmChangePass () {
      if (confirm(`Hệ thống sẽ tự động tạo mật khẩu ngẫu nhiên. Bạn có chắc chắn muốn thay đổi mật khẩu của ${this.userdata.username} không?`)) {
        this.quickChangePassword()
      }
    },

    // Thay đổi mật khẩu cho user
    quickChangePassword () {
      this.$startLoading()
      let data = {
        user_id: this.userdata.id,
        password: this.userdata.user_password
      }
      staffService.quickChangePassword(data)
        .then(res => {
          if (res.data.success) {
            this.userdata.user_password = res.data.data.password
            helper.showMessage(`Thay đổi mật khẩu thành công. Mật khẩu mới là ${res.data.data.password}`, 'success')
          } else {
            helper.showMessage(res.data.message || 'Thay đổi mật khẩu thất bại !', 'warning')
          }
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi xảy ra khi thay đổi mật khẩu !')
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    closeConfirmEditLeader () {
      this.leaders = this.oldLeaders
      this.resetSelectLeader = this.resetSelectLeader + 1
    },

    // Kiểm tra user có thỏa mãn vị trí
    checkUserValidate (user, type = null) {
      // không cho tự gắn user hiện tại làm leader
      if (parseInt(this.userdata.id) === parseInt(user.id)) {
        this.closeConfirmEditLeader()
        helper.showMessage('Thông tin quản lý không hợp lệ', 'warning')
        return
      }

      // Nếu là config mới thì ko cần call api cũ để check nữa
      if (Object.values(departmentSuggestLeaderEmployee).includes(parseInt(this.userdata.department_id))) {
        return
      }

      let params = { user_id: this.userdata.id }
      if (type === 'leader' || !type) {
        params.leader_id = user.id
      }
      if (type === 'staff' || !type) {
        params.staff_id = user.id
      }

      this.$startLoading()
      reportingLineService.checkUserValidate(params)
        .then(res => {
          if (res.data.success) {
            if (!res.data.data.validate) {
              helper.showMessage(res.data.data.messages.toString())
              if (type === 'leader') {
                let idx = this.leaders.findIndex(l => +l.id === +user.id)
                this.leaders.splice(idx, 1)
              }
              if (type === 'staff') {
                let idx = this.employees.findIndex(e => +e.id === +user.id)
                this.employees.splice(idx, 1)
              }
            }
          } else {
            helper.showMessage(res.data.message)
          }
        })
        .catch(e => {
          helper.showMessage(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    // Lấy leader gợi ý khi tạo mới user
    suggestManagerEmployeeForUser () {
      this.$startLoading()
      let data = {
        user_id: this.userdata.id,
        station_id: this.userdata.station_id,
        module_id: this.userdata.module_id,
        department_id: this.userdata.department_id,
        position_id: this.userdata.position_job,
        duty_id: this.userdata.duty_id
      }

      let getSuggest
      if (Object.values(departmentSuggestLeaderEmployee).includes(parseInt(data.department_id))) {
        getSuggest = userService.suggestManagerEmployee(data)
      } else {
        getSuggest = staffService.suggestManagerEmployeeForUser(data)
      }
      getSuggest.then(res => {
        if (res.data.success) {
          if (data.auto_update) helper.showMessage(res.data.message || 'Cập nhật quản lý, nhân viên cho User thành công', 'success')
          if (res.data.data && res.data.data.leaders) {
            this.leaders = res.data.data.leaders
            this.oldLeaders = this.leaders
          }
          if (res.data.data && res.data.data.employees) {
            this.employees = res.data.data.employees
          }
          this.suggestLeaderEmployeeOK = true
        } else {
          helper.showMessage(res.data.message || 'Không lấy được gợi ý quản lý, nhân viên cho User !', 'warning')
        }
      })
        .catch(e => {
          helper.showMessage('Không lấy được gợi ý, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    // Xóa gợi ý leader, nhân viên
    removeSuggestManagerEmployee () {
      this.leaders = []
      this.employees = []
      this.suggestLeaderEmployeeOK = false
    },

    // update lại leader từ các màn congfig khác
    getMemberLeaderChange () {
      this.$startLoading()
      staffService.getMemberLeaderChange()
        .then(res => {
          if (res.data.success) {
            this.getManagerEmployeeOfUser(this.userdata.id)
            helper.showMessage(res.data.message, 'success')
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    // update quản lý, nhân viên cho User
    updateManagerEmployeeOfUser (showSuccess = false) {
      if (!this.userdata.id) {
        helper.showMessage('Không có User ID, không thể cập nhật quản lý, nhân viên cho user !', 'warning')
        return
      }
      let leaders = []
      let employees = []
      if (Array.isArray(this.leaders)) leaders = this.leaders.map(l => l.id)
      if (Array.isArray(this.employees)) employees = this.employees.map(e => e.id)

      let data = {
        userId: this.userdata.id,
        leaders: leaders,
        employees: employees
      }

      let updateManageEmployee
      if (Object.values(departmentSuggestLeaderEmployee).includes(parseInt(this.userdata.department_id))) {
        updateManageEmployee = userService.updateManagerEmployee(data)
      } else {
        updateManageEmployee = staffService.updateManagerEmployeeOfUser(data)
      }

      updateManageEmployee.then(res => {
        if (res.data.success) {
          if (showSuccess) helper.showMessage(res.data.message || 'Cập nhật quản lý và nhân viên cho User thành công.', 'success')
        } else {
          if (res.data.err_type && res.data.err_type === 'permission') {
            helper.showMessage('Bạn không có quyền cập nhật quản lý và nhân viên cho User !', 'warning')
          } else helper.showMessage(res.data.message || 'Không thể cập nhật quản lý và nhân viên cho User !', 'warning')
        }
      })
        .catch((e) => {
          console.log(e)
          helper.showMessage('Không thể cập nhật quản lý và nhân viên cho User !', 'warning')
        })
    },

    // Tạo tài khoản phone cho nhân viên
    async createZoiperAcc () {
      if (!confirm(`Bạn có chắc muốn tạo tài khoản Zoiper cho user ${this.userdata.username} ?`)) return
      const {data} = await userService.createZoiperAcc({user_id: this.userdata.id})
      if (data.success) {
        this.userdata.zoiper_id = data.data.phone_auth
        helper.showMessage(data.message || 'Tạo tài khoản phone cho nhân viên thành công', 'success')
      } else helper.showMessage(data.message || 'Có lỗi khi tạo tài khoản phone cho nhân viên !')
    },

    getMasterProfile (masterId) {
      let dataSend = {
        master_id: masterId
      }
      staffService.getMasterProfile(dataSend).then((response) => {
        if (response.data.success) {
          this.masterInfo = response.data.data
          this.userdata.fullname = this.masterInfo.fullname
        }
      })
    },

    handleChooseMasterProfile (option) {
      this.masterProfile.master_id = option ? option.id : ''
      this.getMasterProfile(option.id)
    },

    handleSelectedModule (option) {
      this.userdata.module_id = option ? option.id : ''
    },

    handleSelectedStation (option) {
      this.userdata.station_id = option ? option.id : ''
    },

    handleSelectedDepartment (option) {
      this.userdata.department_id = option ? option.id : ''
      this.userdata.department = option ? option.name : ''
    },

    handleSelectedPosition (option) {
      this.userdata.position_job = option ? option.id : ''
      this.userdata.group_id = option ? option.group_id : ''
      if (+this.userdata.group_id !== 23) this.userdata.shift = null
      this.checkApproveTime('position_job')
    },

    checkApproveTime (field, newval = null) {
      if (!field) return
      if (newval === null || newval === undefined) newval = this.userdata[field]
      if (+this.userdata.department_id !== 2 || newval === this.userdataOld[field] || (!newval && !this.userdataOld[field])) {
        this.timeApprove.time[field] = null
        return
      }
      this.timeApprove.field = field
      if (field === 'position_job') this.timeApprove.title = 'Vị trí áp dụng từ ngày:'
      else if (field === 'duty_id') this.timeApprove.title = 'Chức vụ áp dụng từ ngày:'
      else if (field === 'ranking') this.timeApprove.title = 'Cấp bậc áp dụng từ ngày:'
      else if (field === 'work_type_id') this.timeApprove.title = 'Kiểu nhân viên áp dụng từ ngày:'
      else this.timeApprove.title = 'Áp dụng từ ngày:'

      this.$bvModal.show('select-time-approve')
    },

    checkHasTimeApprove () {
      if (!this.timeApprove.time[this.timeApprove.field]) {
        helper.showMessage('Vui lòng nhập ngày bắt đầu áp dụng !')
        this.userdata[this.timeApprove.field] = this.userdataOld[this.timeApprove.field]
      }
    },

    handleSelectedWorkType (option) {
      this.userdata.work_type_id = option ? option.id : ''
    },

    handleSelectedDuty (option) {
      this.userdata.duty_id = option ? option.id : ''
    },

    handleSelectedShift (option) {
      this.userdata.shift = option
    },

    handleSelectedFormula (option) {
      this.userdata.cod_formula = option ? option.value : ''
    },

    validateForm () {
      if (this.show_defaultwork) {
        if (!this.userdata.default_work || helper.isEmpty(this.userdata.default_work)) {
          helper.showMessage('Vui lòng chọn công việc mặc định !', 'warning')
          return false
        } else {
          return this.validateTimeConfig(this.userdata.default_work)
        }
      }

      if (!this.userdata.shift && parseInt(this.currentGroupId) === 23) {
        helper.showMessage('Vui lòng chọn ca làm việc!', 'warning')
        return false
      }

      return true
    },

    updateFullname () {
      if (!confirm(`Bạn có chắc chắn muốn đổi sang tên ${this.userdata.fullname} ?`)) {
        return false
      }
      let data = {
        user_id: this.userdata.id,
        fullname: this.userdata.fullname
      }

      profileService.updateFullname(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message, 'success')
          } else {
            helper.showMessage(res.data.message, 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
          helper.showMessage('Có lỗi khi cập nhật fullname!', 'warning')
        })
    },

    editShift () {
      let dataSend = {
        from: this.userdata.shift.from,
        to: this.userdata.shift.to,
        user_id: this.userdata.id
      }
      this.$stopLoading = true
      staffService.editShift(dataSend)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật thông tin ca làm việc thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Tồn tại ca làm việc đã hết hiệu lực. Vui lòng đi vào màn [Sửa ca làm việc] để tạo ca mới.', 'warning', 'Thông báo')
          }
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading = false
        })
    },
    updateDefaultWorkConfig (data) {
      this.userdata.default_work = data
    },
    validateTimeConfig (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === undefined) {
          continue
        }
        if (helper.isEmpty(data[i].alias_job)) {
          helper.showMessage('Vui lòng chọn công việc mặc định !', 'warning')
          return false
        }
        if (moment(data[i].to_date).format('YYYY-MM-DD') < moment(data[i].from_date).format('YYYY-MM-DD')) {
          helper.showMessage('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', 'warning')
          return false
        }
        if (data[i + 1] !== undefined && moment(data[i].to_date).format('YYYY-MM-DD') >= moment(data[i + 1].from_date).format('YYYY-MM-DD')) {
          helper.showMessage('Thời gian config công việc mặc định không hợp lệ. Thời gian config sau không được đè lên thời gian config trước', 'warning')
          return false
        }
      }

      return true
    },
    updateDefaultWork () {
      if (!this.userdata.default_work || helper.isEmpty(this.userdata.default_work)) {
        helper.showMessage('Vui lòng chọn công việc mặc định !', 'warning')
        return
      }

      if (!this.validateTimeConfig(this.userdata.default_work)) {
        return
      }

      let data = {
        user_id: this.userdata.id,
        config_default_work: this.userdata.default_work
      }
      userService.updateDefaultWork(data)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật công việc mặc định thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi cập nhật công việc mặc định.', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi khi cập nhật công việc mặc định', 'warning')
        })
    }
  }
}
</script>

<style scoped>
    .link:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    .row-bordered {
      overflow: unset;
    }

    .is-danger {
        border-color: #E0B4B4;
        color: #9F3A38;
        box-shadow: none;
    }

    #checkbox-default-work .df-checkbox {
        margin-top: 8px;
        width: 180px;
    }
    /deep/ .custom-control.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
      background-color: #02BC77;
      border-color: #02BC77;
    }

</style>
