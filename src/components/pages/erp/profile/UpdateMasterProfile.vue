<template>
    <div class="update-master small-scrollbar">
        <div class="top-title">
            <h2 v-if="!isEdit">Thêm hồ sơ nhân viên</h2>
            <h2 v-else>Sửa hồ sơ nhân viên</h2>
            <div v-if="isEdit" class="top-search-box">
                <ul class="navbar-nav align-items-lg-center">
                    <label class="nav-item navbar-text navbar-search-box p-0 active">
                        <i class="ion ion-ios-search navbar-icon align-middle"></i>
                        <span class="navbar-search-input pl-2">
                            <input type="text" placeholder="Tìm theo username, CMND, Mã nhân viên" v-model="keyword" @keyup.enter="searchProfile" class="form-control navbar-text mx-2">
                        </span>
                    </label>
                </ul>
            </div>
            <div class="top-title__right-button">
                <span v-if="masterProfile && masterProfile.id">
                  <b-btn v-if="this.$route.params.id" variant="btn btn-default" @click="toggleLogButtonAction">
                    <i class="icon ion-md-list"></i> Xem lịch sử hồ sơ
                  </b-btn>
                  <ladda-btn v-if="!isEdit" :loading="isProcessingUpdate" @click.native="checkSameCmnd()" data-style="expand-right" class="btn btn-primary">
                      <i class="ion ion-ios-add"></i> Thêm hồ sơ nhân viên
                  </ladda-btn>
                  <span v-else>
                    <ladda-btn v-show="masterProfile.status !== 'not_verified'" :loading="isProcessingUpdate" @click.native="checkSameCmnd()" data-style="expand-right" class="btn btn-info">
                      <i class="icon ion-md-archive"></i> Cập nhật hồ sơ
                    </ladda-btn>
                    <span v-if="masterProfile.status === 'not_verified'">
                      <b-btn type="button" variant="btn btn-success" @click="verifiedProfile('active')" :disabled="checkAction" v-show="canVerifyProfile">
                        <i class="fa fa-check"></i> Duyệt hồ sơ
                      </b-btn>
                      <b-btn type="button" variant="btn btn-danger" v-b-modal.modal-reason-reject-profile>
                        <i class="fa fa-times"></i> Từ chối
                      </b-btn>
                    </span>
                  </span>
                </span>
                <button @click="$router.go(-1)" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</button>
            </div>
        </div>
        <div v-if="masterProfile.status === 'not_verified'">
          <b-alert :show="true">
            <div v-if="candidateLog.length !== 0">
              <span>
                <span v-if="candidateLog.created_at">{{ moment(candidateLog.created_at, 'DD-MM-YYYY HH:mm:ss')}}</span>&emsp;
                <router-link
                  v-if="candidateLog.created_by"
                  class="mt-2"
                  :to="{name: 'edit-user', params: { id: candidateLog.created_by }}"
                >
                  {{ candidateLog.fullname || null }}
                </router-link> &emsp;
                {{ candidateLog.desc }}
              </span>
              <!-- <div class="text-danger mt-1"><b>Cần nhân sự xác nhận lại</b></div> -->
            </div>
            <b-btn
              v-b-modal.modal-resign
              class="mt-1"
              variant="info"
              size="sm"
              v-show="resignObj && (resignObj.resign_date || resignObj.quit_work_type || (resignObj.resign_reason && resignObj.resign_reason.length))"
            >
              Thông tin nghỉ việc trước kia
            </b-btn>
          </b-alert>
        </div>
        <div v-if="!isLoading && !this.masterProfile">
            Không tìm thấy profile
        </div>
        <div v-else-if="notInArea && isEdit">
          <b-alert show variant="warning">
            <div class="mb-1"><b>LƯU Ý: <span class="text-danger">Nhân viên này không thuộc khu vực quản lý của bạn !</span></b></div>
            <div v-show="briefProfile && briefProfile.id" class="mb-2 row">
              <div class="col-xl-1 col-2">- Họ và tên:</div><div class="col-xl-11 col-10">{{ briefProfile.fullname }}</div>
              <div class="col-xl-1 col-2">- CMND/CCCD:</div><div class="col-xl-11 col-10">{{ briefProfile.personal_id }}</div>
              <div class="col-xl-1 col-2">- Trạng thái:</div><div class="col-xl-11 col-10">{{ statusOptions[briefProfile.status || null] || briefProfile.status }}</div>
              <div class="col-xl-1 col-2">- Kho:</div><div class="col-lg-11 col-10">{{ briefProfile.station }}</div>
            </div>
            <div v-show="teamHr && teamHr.length">
              Vui lòng liên hệ với team
              <span v-for="(team, idx) in teamHr" :key="team.id">{{ ((teamHr.length - 1) > idx) ? team.name + ',' : team.name }}</span>
              hoặc ban điều hành để được hỗ trợ
            </div>
          </b-alert>
        </div>
        <div v-else>
            <b-card no-body class="mb-2" v-if="isEdit && candidateLog.length !== 0">
                <h6 class="card-header">
                    <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-candidate-logs><i class="ion  ion-ios-add-circle"></i> Ghi chú của nhân sự</a>
                </h6>
                <b-collapse id="accordion-candidate-logs" visible>
                    <b-card-body>
                      <log-comment curr-user="" :master-profile-id=id :candidate-id=this.candidateLog.candidate_id :own-uni=this.candidateLog.own_uni></log-comment>
                    </b-card-body>
                </b-collapse>
            </b-card>
            <b-card no-body class="mb-2" v-if="isEdit">
                <h6 class="card-header">
                    <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-list-users><i class="ion  ion-ios-add-circle"></i> Thông tin tài khoản được liên kết</a>
                </h6>
                <b-collapse id="accordion-list-users" visible>
                    <b-card-body>
                        <div v-if="!listUsers || listUsers.length === 0">
                          Hồ sơ chưa có tài khoản nào được tạo !
                        </div>
                        <ListUser
                          v-else
                          :permissions="permissions"
                          :list-users.sync="listUsers"
                          :resign-info="resignObj"
                        />

                        <div v-if="!['pause', 'disable'].includes(masterProfile.status)" class="mt-1">
                          <router-link
                            :to="{name: 'add-user', params: { id: this.$route.params.id }}"
                            class="btn btn-outline-success btn-sm"
                          >
                            <i class="ion ion-ios-add"></i> {{ (listUsers && listUsers.length) ? 'Thêm tài khoản phụ' : 'Thêm tài khoản chính' }}
                          </router-link>
                          <button class="btn btn-outline-success btn-sm" v-b-modal.modal-add-exist-user><i class="ion ion-ios-add"></i> Thêm tài khoản có sẵn</button>
                          <modal-add-exist-user :master-id="this.$route.params.id" @handleAddedUser="handleAddedUser"></modal-add-exist-user>
                        </div>
                    </b-card-body>
                </b-collapse>
            </b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                                <h6 class="card-header ttcn-header">
                                    <a class="text-dark" href="javascript:void(0)" v-b-toggle.accordion-ttcn><i class="ion  ion-ios-add-circle"></i> Thông tin cá nhân</a>
                                    <div class="group-btn-confirm" v-if="isEdit">
                                        <button class="btn btn-outline-primary btn-sm" v-b-modal.modal-candidate>Liên kết ứng viên</button>
                                        <button class="btn btn-outline-info btn-sm" v-b-modal.modal-update-document>Thông tin giấy tờ</button>
                                        <!-- <button v-if="masterProfile.cnb_confirmed != 1" class="btn btn-outline-primary btn-sm" @click="confirmProfile">Xác nhận hồ sơ</button> -->
                                    </div>
                                    <modal-update-document :master-id="this.masterProfile.id" :documents="profileDocuments"></modal-update-document>
                                </h6>
                                <b-collapse id="accordion-ttcn" visible>
                                    <div class="card-body">
                                        <b-form-row>
                                            <b-media v-if="isEdit" vertical-align="center" class="col-md-2 col-lg-2 col-xl-2 text-center position-relative image-profile">
                                                <b-img :src="masterProfile.image_profile" style="width: 120px; height: 160px; object-fit: cover" alt="avatar"/>
                                                <i class="ion ion-ios-camera position-absolute icon-add-image" v-b-modal.modal-update-image-profile></i>
                                                <div class="cover-image-profile" v-b-modal.modal-update-image-profile></div>
                                            </b-media>
                                            <div class="col-md-10 col-lg-10 col-xl-10">
                                                <b-form-row class="mb-2">
                                                    <b-form-group label="Mã nhân viên:" class="col-md-3" v-if="isEdit">
                                                      <span>{{ masterProfile.staff_code }}</span>
                                                    </b-form-group >
                                                    <b-form-group label="Trạng thái hồ sơ:" class="col-md-3" v-if="isEdit">
                                                      <span :class="getBriefStatusClass(masterProfile.cnb_confirmed)">{{ getBriefStatusName(masterProfile.cnb_confirmed) }}</span>
                                                    </b-form-group >
                                                    <b-form-group label="Công ty" class="col-md-3">
                                                      <single-select-corporation
                                                        @handleSelected="handleSelectedCorporation"
                                                        :id="masterProfile.company_id">
                                                      </single-select-corporation>
                                                    </b-form-group >
                                                    <b-form-group label="Profile ảo" class="col-md-3">
                                                      <label class="switcher switcher-success">
                                                        <input type="checkbox" class="switcher-input"  v-model="masterProfile.is_virtual">
                                                        <span class="switcher-indicator">
                                                          <span class="switcher-yes"></span>
                                                          <span class="switcher-no"></span>
                                                        </span>
                                                      </label>
                                                    </b-form-group >
                                                </b-form-row>
                                                <b-form-row>
                                                    <b-form-group label="Trạng thái profile" id="group-fullname" class="col-md-3" disabled>
                                                        <b-form-select v-model="masterProfile.status" :options="statusOptions" :disabled="isAdd" @input="onChangeStatus"></b-form-select>
                                                    </b-form-group >
                                                    <b-form-group class="col-md-3">
                                                        <template slot='label'>
                                                            Ngày vào <span class='red-text'>(*)</span>
                                                        </template>
                                                        <Datepicker
                                                                v-model="masterProfile.join_date"
                                                                name="join-date"
                                                                format="dd-MM-yyyy"
                                                                :bootstrapStyling="true"
                                                                :monday-first="true"
                                                                :full-month-name="true"
                                                                placeholder="Ngày vào"
                                                                :calendar-button="true"
                                                                calendar-button-icon="ion ion-md-calendar"
                                                                :clear-button="true"
                                                                v-validate="'required'"
                                                                :class="{'is-danger': errors.has('join-date')}"
                                                        />
                                                        <span v-show="errors.firstRule('join-date') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-3">
                                                        <template slot='label'>
                                                            Họ tên <span class='red-text'>(*)</span>
                                                        </template>
                                                        <b-form-input
                                                                v-model="masterProfile.fullname"
                                                                id="fullname"
                                                                name="fullname"
                                                                v-validate="'required'"
                                                                placeholder="Họ tên"
                                                                :class="{'is-danger': errors.has('fullname')}"
                                                        >
                                                        </b-form-input>
                                                        <span v-show="errors.firstRule('fullname') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                    </b-form-group >
                                                    <b-form-group label="Miền" class="col-md-3">
                                                        <single-select-profile-region
                                                                @handleSelectedRegion="handleSelectedRegion"
                                                                :region="masterProfile.region">
                                                        </single-select-profile-region>
                                                    </b-form-group >
                                                </b-form-row>
                                                <b-form-row>
                                                    <b-form-group id="input-group-tel" class="col-md-3">
                                                        <template slot='label'>
                                                          Số điện thoại <span class='red-text'>(*)</span>
                                                        </template>
                                                        <b-form-input
                                                          v-if="!(permissions && permissions.view_mobile_number) && isEdit"
                                                          disabled
                                                          :value="masterProfile.tel_hide"
                                                          placeholder="Số điện thoại"
                                                        />
                                                        <template v-else>
                                                          <b-form-input
                                                            v-model="masterProfile.tel"
                                                            name="input-tel"
                                                            v-validate="{required:true, numeric: true, regex: /^(84|0)(3|5|7|8|9)([0-9]{8})$/}"
                                                            :class="{'is-danger': errors.has('input-tel')}"
                                                            placeholder="Số điện thoại"
                                                            @keyup="limitLength('tel', 15, ...arguments)"
                                                          >
                                                          </b-form-input>
                                                          <span v-show="errors.firstRule('input-tel') == 'required'" class="help is-danger">Không để trống trường này </span>
                                                          <span v-show="errors.firstRule('input-tel') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                                          <span v-show="errors.firstRule('input-tel') == 'regex'" class="help is-danger">Số điện thoại không đúng</span>
                                                        </template>
                                                    </b-form-group>
                                                    <b-form-group label="Email cá nhân" id="input-group-personal-email" class="col-md-3">
                                                        <b-form-input
                                                                v-model="masterProfile.personal_email"
                                                                id="input-personal-email"
                                                                name="personal-email"
                                                                v-validate="'email'"
                                                                :class="{'is-danger': errors.has('personal-email')}"
                                                                placeholder="Email cá nhân"
                                                        >
                                                        </b-form-input>
                                                        <span v-show="errors.firstRule('personal-email') == 'email'" class="help is-danger">Email không đúng định dạng </span>
                                                    </b-form-group>
                                                    <b-form-group label="Email GHTK" id="input-group-ghtk-email" class="col-md-3">
                                                        <b-form-input
                                                                v-model="masterProfile.company_email"
                                                                :disabled="true"
                                                                id="input-email"
                                                                name="company-email"
                                                                v-validate="'email'"
                                                                :class="{'is-danger': errors.has('company-email')}"
                                                                placeholder="Email công ty"
                                                        >
                                                        </b-form-input>
                                                        <span v-show="errors.firstRule('company-email') == 'email'" class="help is-danger">Email không đúng định dạng </span>
                                                    </b-form-group>
                                                    <b-form-group class="col-md-3">
                                                        <template slot='label'>
                                                            Ngày đi làm trở lại
                                                        </template>
                                                        <Datepicker
                                                                v-model="masterProfile.comeback_date"
                                                                name="comeback-date"
                                                                format="dd-MM-yyyy"
                                                                :bootstrapStyling="true"
                                                                :monday-first="true"
                                                                :full-month-name="true"
                                                                placeholder="Ngày đi làm lại"
                                                                :calendar-button="true"
                                                                calendar-button-icon="ion ion-md-calendar"
                                                                :clear-button="true"
                                                        />
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

            <div v-if="loginUser && loginUser.Group && (+loginUser.Group.id !== 22 || +loginUser.Station.id === 4558)">
                <!-- <div class="row" v-show="masterProfile.status === 'not_verified'">
                      <div class="col-md-12">
                        <div class="card mb-4">
                          <div class="row no-gutters row-bordered">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                              <h6 class="card-header">
                                <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-ho-so-ung-tuyen>
                                  <i class="ion  ion-ios-add-circle"></i>&nbsp;Hồ sơ ứng tuyển
                                </a>
                              </h6>
                              <b-collapse id="collapse-ho-so-ung-tuyen" visible>
                                <div class="card-body">
                                  hello
                                </div>
                              </b-collapse>
                            </div>
                            </div>
                          </div>
                      </div>
                      <hr class="border-light container-m--x mt-0 mb-4">
                      <br/>
                </div> -->
                <div class="row" v-if="masterProfile.status === 'not_verified'">
                  <div class="col-md-12">
                    <div class="card mb-4">
                      <div class="row no-gutters">
                        <div class="col-md-12 col-lg-12 col-xl-12">
                          <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-file-info><i class="ion  ion-ios-add-circle"></i> FILE HỒ SƠ ỨNG TUYỂN</a>
                          </h6>
                          <b-collapse id="collapse-file-info" visible class="px-1_75re">
                            <file-candidate
                              :id-candidate="candidateLog.candidate_id"
                              :edit="false"
                            ></file-candidate>
                          </b-collapse>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="!masterProfile.is_virtual">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-so-yeu-li-lich><i class="ion  ion-ios-add-circle"></i>&nbsp;Sơ yếu lí lịch</a>
                              <b-btn v-if="permissions && permissions.can_report_ekyc" class="btn btn-outline-info btn-sm ml-1" @click="openModalReportEkyc()">
                                <span v-if="!hasOrderReportEKYC">Báo sai</span>
                                <span v-else>Đã báo sai</span>
                              </b-btn>
                            </h6>
                            <b-collapse id="collapse-so-yeu-li-lich" visible>
                              <b-form-row>
                                <div class="col-md-12 col-lg-12 col-xl-12">
                                  <div class="card-body">
                                    <b-form-row>
                                      <b-form-group class="col-md-3">
                                        <template slot='label'>
                                          Ngày sinh <span class='red-text'>(*)</span>
                                        </template>
                                        <Datepicker
                                          v-model="masterProfile.birthday"
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
                                        <span v-show="errors.firstRule('birthday') == 'required'" class="help is-danger">Không để trống trường này </span>
                                      </b-form-group>
                                      <b-form-group id="input-group-gender" class="col-md-3">
                                        <template slot='label'>
                                          Giới tính <span class='red-text'>(*)</span>
                                        </template>
                                        <b-form-select
                                          :class="{'is-danger': errors.has('gender')}"
                                          name="gender"
                                          v-model="masterProfile.gender"
                                          :options="options.gender">
                                        </b-form-select>
                                      </b-form-group>
                                      <b-form-group id="input-group-personal_id_number" class="col-md-3">
                                        <template slot='label'>
                                          CMND/CCCD <span class='red-text'>(*)</span>
                                        </template>
                                        <b-form-input
                                          v-model="masterProfile.personal_id_number"
                                          id="personal-id-number"
                                          name="personal-id-number"
                                          :disabled="(!permissions || !permissions.update_personal_id.includes(masterProfile.region)) && isEdit"
                                          v-validate="{required:true, numeric: true, min: 9, max: 12, regex: /^(.{12}|.{9})$/}"
                                          :class="{'is-danger': errors.has('personal-id-number')}"
                                          placeholder="CMND/CCCD"
                                          @keyup="limitLength('personal_id_number', 12, ...arguments)"
                                        >
                                        </b-form-input>
                                        <span v-show="errors.firstRule('personal-id-number') == 'required'" class="help is-danger">Không để trống trường này </span>
                                        <span v-show="errors.firstRule('personal-id-number') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                                        <span v-show="errors.firstRule('personal-id-number') == 'min'" class="help is-danger">Không đủ ký tự CMND </span>
                                        <span v-show="errors.firstRule('personal-id-number') == 'max'" class="help is-danger">Vượt quá ký tự CMND</span>
                                        <span v-show="errors.firstRule('personal-id-number') == 'regex'" class="help is-danger">Số cmnd không đúng</span>
                                      </b-form-group>
                                      <b-form-group class="col-md-3">
                                        <template slot='label'>
                                          Ngày cấp CMND <span class='red-text'>(*)</span>
                                        </template>
                                        <Datepicker
                                          name="doi-personal-id-number"
                                          v-model="masterProfile.doi_personal_id_number"
                                          format="dd-MM-yyyy"
                                          :bootstrapStyling="true"
                                          :monday-first="true"
                                          :full-month-name="true"
                                          placeholder=""
                                          :calendar-button="true"
                                          calendar-button-icon="ion ion-md-calendar"
                                          :clear-button="true"
                                          v-validate="'required'"
                                          :class="{'is-danger': errors.has('doi-personal-id-number')}"
                                        />
                                        <span v-show="errors.firstRule('doi-personal-id-number') == 'required'" class="help is-danger">Không để trống trường này </span>
                                      </b-form-group>
                                      <b-form-group class="col-md-3">
                                        <template slot='label'>
                                          Nơi cấp <span class='red-text'>(*)</span>
                                        </template>
                                        <single-select-poi-identity-card
                                          :state="masterProfile.poi_personal_id_number == '' ? false : null"
                                          :placeholder="'Nơi cấp CMND'"
                                          @handleSelectedProvince="selectedPoiPersonalId"
                                          :provinceId="masterProfile.poi_personal_id_number">
                                        </single-select-poi-identity-card>
                                        <input v-validate="'required'" v-model="masterProfile.poi_personal_id_number" type="hidden" name="group-cmnd-province" >
                                        <span v-show="errors.firstRule('group-cmnd-province') == 'required'" class="help is-danger">Không để trống trường này </span>
                                      </b-form-group>
                                      <b-form-group label="Hôn nhân" id="input-group-ethnic" class="col-md-3">
                                        <b-form-select
                                          name="marital-status"
                                          v-model="masterProfile.marital_status"
                                          :options="options.marital_status">
                                        </b-form-select>
                                      </b-form-group>
                                      <b-form-group label="Dân tộc" id="input-group-ethnic" class="col-md-3">
                                        <!-- <b-form-input
                                                v-model="masterProfile.ethnic"
                                                id="input-ethnic"
                                                placeholder="Dân tộc"
                                        >
                                        </b-form-input> -->
                                        <single-select-ethnic
                                          :ethnicValue="masterProfile.ethnic"
                                          placeholder=""
                                          @handleSelectedEthnic="handleSelectedEthnic"
                                        >
                                        </single-select-ethnic>
                                      </b-form-group>
                                      <b-form-group label="Quốc tịch" id="input-group-nationality" class="col-md-3">
                                        <select-nationality
                                          @select="val => { masterProfile.nationality = val && val.value }"
                                          :nationality="masterProfile.nationality"
                                          placeholder=""
                                        >
                                        </select-nationality>
                                      </b-form-group>
                                    </b-form-row>
                                    <b-form-row>
                                      <div class="col-md-6 col-lg-6 col-xl-6">
                                        <h6 class="mb-2">Nguyên quán <span class='red-text'>(*)</span></h6>
                                        <b-form-row class="mb-3">
                                          <div class="col-md-4">
                                            <single-select-province
                                              @handleSelectedProvince="selectedNativeProvince"
                                              :provinceId="masterProfile.native_country_province">
                                            </single-select-province>
                                            <input v-validate="'required'" v-model="masterProfile.native_country_province" type="hidden" name="group-native-country-province" >
                                          </div>
                                          <div class="col-md-4">
                                            <single-select-district
                                              @handleSelectedDistrict="selectedNativeDistrict"
                                              :provinceId="masterProfile.native_country_province"
                                              :districtId="masterProfile.native_country_district">
                                            </single-select-district>
                                          </div>
                                          <div class="col-md-4">
                                            <single-select-sub-district
                                              @handleSelectedSubDistrict="selectedNativeSubDistrict"
                                              :districtId="masterProfile.native_country_district"
                                              :subDistrictId="masterProfile.native_country_sub_district">
                                            </single-select-sub-district>
                                          </div>
                                        </b-form-row>
                                        <span v-show="
                                                                        errors.firstRule('group-native-country-province') == 'required' ||
                                                                        errors.firstRule('group-native-country-district') == 'required' ||
                                                                        errors.firstRule('group-native-country-sub-district') == 'required' "
                                              class="help is-danger">Vui lòng nhập địa chỉ nguyên quán
                                                                </span>
                                        <h6 class="mb-2">Thường trú <span class='red-text'>(*)</span></h6>
                                        <b-form-row class="mb-3">
                                          <div class="col-md-4">
                                            <single-select-province
                                              @handleSelectedProvince="selectedResidentProvince"
                                              :provinceId="masterProfile.resident_address_province">
                                            </single-select-province>
                                            <input v-validate="'required'" v-model="masterProfile.resident_address_province" type="hidden" name="resident-address-province" >
                                          </div>
                                          <div class="col-md-4">
                                            <single-select-district
                                              @handleSelectedDistrict="selectedResidentDistrict"
                                              :provinceId="masterProfile.resident_address_province"
                                              :districtId="masterProfile.resident_address_district">
                                            </single-select-district>
                                            <input v-validate="'required'" v-model="masterProfile.resident_address_district" type="hidden" name="resident-address-district" >
                                          </div>
                                          <div class="col-md-4">
                                            <single-select-sub-district
                                              @handleSelectedSubDistrict="selectedResidentSubDistrict"
                                              :districtId="masterProfile.resident_address_district"
                                              :subDistrictId="masterProfile.resident_address_sub_district">
                                            </single-select-sub-district>
                                            <input v-validate="'required'" v-model="masterProfile.resident_address_sub_district" type="hidden" name="resident-address-sub-district" >
                                            <span v-show="
                                                                        errors.firstRule('resident-address-sub-district') == 'required' ||
                                                                        errors.firstRule('resident-address-district') == 'required' ||
                                                                        errors.firstRule('resident-address-province') == 'required' "
                                                  class="help is-danger">Vui lòng nhập địa chỉ thường trú
                                                                    </span>
                                          </div>
                                          <b-form-group  class="col-md-12 mt-2">
                                            <h6 class="label-form">Chi tiết thường trú <span class="red-text">(chỉ nhập số nhà, tên đường)</span></h6>
                                            <b-form-textarea v-if="isAdd"
                                                             v-model="masterProfile.resident_address_detail"
                                                             name="resident-address-detail"
                                                             placeholder="Số nhà, tên đường, ấp (nếu có)"
                                                             v-validate="'required'"
                                                             rows="1"
                                            ></b-form-textarea>
                                            <b-form-textarea v-else
                                                             v-model="masterProfile.resident_address_detail"
                                                             name="resident-address-detail"
                                                             placeholder="Số nhà, tên đường, ấp (nếu có)"
                                                             v-validate="'required'"
                                                             rows="1"
                                            ></b-form-textarea>
                                          </b-form-group>
                                          <span v-if="isEdit" v-show="errors.firstRule('resident-address-detail') == 'required'" class="help is-danger">
                                                                    Vui lòng nhập chi tiết địa chỉ thường trú
                                                                </span>
                                        </b-form-row>
                                      </div>
                                      <div class="col-md-6 col-lg-6 col-xl-6">
                                        <div>
                                          <h6 class="mb-2">Nơi sinh </h6>
                                          <b-form-row class="mb-3">
                                            <div class="col-md-4">
                                              <single-select-province
                                                @handleSelectedProvince="selectedBirthplaceProvince"
                                                :provinceId="masterProfile.birthplace_province">
                                              </single-select-province>
                                            </div>
                                            <div class="col-md-4">
                                              <single-select-district
                                                @handleSelectedDistrict="selectedBirthplaceDistrict"
                                                :provinceId="masterProfile.birthplace_province"
                                                :districtId="masterProfile.birthplace_district">
                                              </single-select-district>
                                            </div>
                                            <div class="col-md-4">
                                              <single-select-sub-district
                                                @handleSelectedSubDistrict="selectedBirthplaceSubDistrict"
                                                :districtId="masterProfile.birthplace_district"
                                                :subDistrictId="masterProfile.birthplace_sub_district">
                                              </single-select-sub-district>
                                            </div>
                                          </b-form-row>
                                          <h6 class="mb-2">Chỗ ở hiện tại </h6>
                                          <b-form-row>
                                            <div class="col-md-4">
                                              <single-select-province
                                                @handleSelectedProvince="selectedCurrentProvince"
                                                :provinceId="masterProfile.current_address_province">
                                              </single-select-province>
                                            </div>
                                            <div class="col-md-4">
                                              <single-select-district
                                                @handleSelectedDistrict="selectedCurrentDistrict"
                                                :provinceId="masterProfile.current_address_province"
                                                :districtId="masterProfile.current_address_district">
                                              </single-select-district>
                                            </div>
                                            <div class="col-md-4">
                                              <single-select-sub-district
                                                @handleSelectedSubDistrict="selectedCurrentSubDistrict"
                                                :districtId="masterProfile.current_address_district"
                                                :subDistrictId="masterProfile.current_address_sub_district">
                                              </single-select-sub-district>
                                            </div>
                                            <b-form-group class="col-md-12 mt-2">
                                              <h6 class="label-form">Chi tiết chỗ ở <span class="red-text">(chỉ nhập số nhà, tên đường)</span></h6>
                                              <b-form-textarea
                                                v-model="masterProfile.current_address_detail"
                                                placeholder="Chi tiết chỗ ở"
                                                rows="1"
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
                  <div class="row" v-show="masterProfile.status !== 'not_verified'">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-6 col-lg-12 col-xl-6 current-salary">
                            <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-hoc-van-ngan-hang><i class="ion  ion-ios-add-circle"></i>&nbsp;Học vấn</a>
                            </h6>
                          </div>
                          <div class="col-md-6 col-lg-12 col-xl-6">
                            <div class="row">
                              <div class="col-md-6 col-lg-12 col-xl-6">
                                <h6 class="card-header">
                                  <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-hoc-van-ngan-hang><i class="ion  ion-ios-add-circle"></i>&nbsp;Tài khoản ngân hàng (Người có thẩm quyền nhập)</a>
                                </h6>
                              </div>
                              <div class="col-md-6 col-lg-12 col-xl-6 text-right">
                                <h6 class="card-header">
                                  <a  href="javascript:void(0)" @click="showExportAtmModal(masterProfile)">&nbsp;In phiếu ATM</a>
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <b-collapse id="collapse-hoc-van-ngan-hang" visible>
                          <div class="row no-gutters row-bordered">
                            <div class="col-md-6 col-lg-12 col-xl-6 current-salary">
                              <div class="card-body">
                                <b-form-row>
                                  <b-form-group label="Học vấn" id="input-group-degree" class="col-md-6">
                                    <b-form-select v-model="masterProfile.degree"
                                                   :options="options.degree"></b-form-select>
                                  </b-form-group>
                                  <b-form-group label="Trường học" id="input-group-college" class="col-md-6">
                                    <b-form-input
                                      v-model="masterProfile.college"
                                      id="input-college"
                                      placeholder="Trường học"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Chuyên ngành" id="input-group-speciality" class="col-md-6">
                                    <b-form-input
                                      v-model="masterProfile.speciality"
                                      id="input-speciality"
                                      placeholder="Chuyên ngành"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Chứng chỉ" id="input-group-diploma" class="col-md-6">
                                    <b-form-input
                                      v-model="masterProfile.diploma"
                                      id="input-diploma"
                                      placeholder="Chứng chỉ"
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
                                      :disabled="!(permissions && permissions.update_bank_info)"
                                      v-validate="'numeric'"
                                      :class="{'is-danger': errors.has('bank-account-number')}"
                                      placeholder="Số TK ngân hàng"
                                    >
                                    </b-form-input>
                                    <span v-show="errors.firstRule('bank-account-number') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                  </b-form-group>
                                  <b-form-group label="Tên chủ TK" id="input-group-bank-account-name" class="col-md-6">
                                    <b-form-input
                                      v-model="masterProfile.bank_account_name"
                                      id="input-bank-account-name"
                                      :disabled="!(permissions && permissions.update_bank_info)"
                                      placeholder="Tên chủ TK"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Ngân hàng" id="input-group-bank-name" class="col-md-6">
                                    <single-select-bank
                                      @handleSelectedBank="handleSelectedBank"
                                      :bank-code="masterProfile.bank_name"
                                      :is-disabled="!(permissions && permissions.update_bank_info)"
                                      selectLabel="Chọn"
                                    >
                                    </single-select-bank>
                                  </b-form-group>
                                  <b-form-group label="Chi nhánh" id="input-group-bank-brand" class="col-md-6">
                                    <single-select-bank-brand
                                      @handleSelectedBankBrand="handleSelectedBankBrand"
                                      :bank-code="masterProfile.bank_name"
                                      :brand-id="masterProfile.bank_brand"
                                      :is-disabled="!(permissions && permissions.update_bank_info)"
                                      selectLabel="Chọn"
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
                  <div class="row" v-show="masterProfile.status !== 'not_verified'">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-insurance><i class="ion  ion-ios-add-circle"></i> Bảo hiểm</a>

                              <b-link
                                v-if="!employeeOrder.insurance"
                                target="_blank"
                                :to="{name: 'create-order', params: { profileId: masterProfile.id, orderType: null }}"
                                class="btn btn-outline-info btn-sm ml-1"
                              >
                                Đề xuất BHXH
                              </b-link>
                              <a href="javascript:void(0)" @click="showModalHistory" class="float-right">Lịch sử</a>
                            </h6>
                          </div>
                        </div>
                        <b-collapse id="collapse-insurance" visible>
                          <div class="row no-gutters row-bordered">
                            <div class="col-md-12 col-lg-12 col-xl-12">
                              <div class="card-body">
                                <b-form-row>
                                  <b-form-group label="Số sổ BH" id="input-group-insurance-register" class="col-md-3" disabled>
                                    <b-form-input
                                      v-model="masterProfile.insurance_register"
                                      id="input-insurance-register"
                                      placeholder="Số sổ BH"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Số thẻ BHYT" id="input-group-health-ins-number" class="col-md-3" disabled>
                                    <b-form-input
                                      v-model="masterProfile.health_ins_number"
                                      id="input-health-ins-number"
                                      placeholder="Số thẻ BHYT"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Người giữ sổ" id="input-select-health-ins-book-with-comp" class="col-md-3" disabled>
                                    <Multiselect
                                      :disabled="true"
                                      v-model="masterProfile.ins_book_with_comp"
                                      :options="options.ins_book_with_comp_options"
                                      track-by="desc"
                                      label="desc"
                                      placeholder=""
                                      select-label=""
                                      deselectLabel="X"
                                    >
                                    </Multiselect>
                                  </b-form-group>
                                  <b-form-group label="Số SHK" id="input-group-shk-number" class="col-md-3" disabled>
                                    <b-form-input
                                      v-model="masterProfile.shk_number"
                                      id="input-shk-number"
                                      placeholder="Số SHK"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Tỉnh đăng kí KCB" id="input-select-province-hospital-register" class="col-md-3">
                                    <Multiselect
                                      :disabled="false"
                                      v-model="masterProfile.province_hospital_register"
                                      :options="provinceOptions"
                                      track-by="name"
                                      label="name"
                                      placeholder=""
                                      select-label=""
                                      deselectLabel="X"
                                    >
                                    </Multiselect>
                                  </b-form-group>
                                  <b-form-group label="Bệnh viện đăng kí KCB" id="input-select-hospital-register" class="col-md-3">
                                    <Multiselect
                                      :disabled="false"
                                      v-model="masterProfile.hospital_register"
                                      :options="hospitalOptions"
                                      track-by="name"
                                      label="name"
                                      placeholder=""
                                      select-label=""
                                      deselectLabel="X"
                                    >
                                    </Multiselect>
                                  </b-form-group>
                                  <b-form-group label="Phương án" id="input-group-plan-insurrance" class="col-md-3" disabled>
                                    <b-form-select :options="ins_opts" v-model="masterProfile.insurance_plan" />
                                  </b-form-group>
                                  <b-form-group id="time-start-plan-insurrance" class="col-md-3">
                                    <template slot='label'>
                                      Tháng bắt đầu áp dụng
                                    </template>
                                    <Datepicker
                                      :disabled="true"
                                      v-model="masterProfile.insurance_apply_from"
                                      name="insurance_apply_from"
                                      format="dd-MM-yyyy"
                                      :bootstrapStyling="true"
                                      :monday-first="true"
                                      :full-month-name="true"
                                      placeholder="Tháng bắt đầu"
                                      :calendar-button="true"
                                      calendar-button-icon="ion ion-md-calendar"
                                      :clear-button="true"
                                      minimum-view="month"
                                      v-validate="{required: (masterProfile.insurance_plan ? true : false)}"
                                      :class="{'is-danger': errors.has('insurance_apply_from')}"
                                    />
                                    <span v-show="errors.firstRule('insurance_apply_from') == 'required' && masterProfile.insurance_plan" class="help is-danger">Không để trống trường này </span>
                                  </b-form-group>
                                </b-form-row>
                                <div v-if="employeeOrder.insurance">
                                  Nhân viên này có đề xuất: <br/>
                                  <div v-for="(group, keyField) in employeeOrder.insurance" :key="keyField">
                                    <div v-if="group">
                                      <div v-for="order in group" :key="order.id">
                                                    <span v-if="inprocessOrder(order.status)">
                                                      <b>- {{ order.order_type_name }}</b> với mã
                                                      <b-link :to="{name: 'list-order', params: { orderCode: genCodeOrder(order.id, 'BH') }}" target="_blank">
                                                        {{ genCodeOrder(order.id, 'BH') }}
                                                      </b-link>
                                                    </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </b-collapse>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-show="masterProfile.status !== 'not_verified'">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-thue-bao-hiem><i class="ion  ion-ios-add-circle"></i>&nbsp;Thuế</a>
                            </h6>
                          </div>
                        </div>
                        <b-collapse id="collapse-thue-bao-hiem" visible>
                          <div class="row no-gutters row-bordered">
                            <div class="col-md-12 col-lg-12 col-xl-12 current-salary">
                              <div class="card-body">
                                <b-form-row>
                                  <b-form-group
                                    label="MST"
                                    id="input-group-tax-iden-number"
                                    class="col-md-3"
                                    :disabled="!permissions || !permissions.update_tax_info.includes(masterProfile.region)"
                                  >
                                    <b-form-input
                                      v-model="masterProfile.tax_iden_number"
                                      id="input-tax-iden-number"
                                      name="input-tax-iden-number"
                                      :class="{'is-danger': errors.has('input-tax-iden-number')}"
                                      placeholder=""
                                      v-validate="{numeric: true, length: 10}"
                                      @keyup="limitLength('tax_iden_number', 10, ...arguments)"
                                    >
                                    </b-form-input>
                                    <span v-show="errors.firstRule('input-tax-iden-number') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                    <span v-show="errors.firstRule('input-tax-iden-number') == 'length'" class="help is-danger">Không đủ ký tự </span>
                                  </b-form-group>
                                  <b-form-group id="input-group-personal_id_number_tax" class="col-md-3">
                                    <template slot='label'>
                                      Số CMT (với trường hợp sửa lỗi trùng CMT)
                                    </template>
                                    <b-form-input
                                      v-model="masterProfile.tax_personal_id_number"
                                      name="tax-personal-id-number"
                                      v-validate="{min: 9, max: 20, regex: /^((\d{12}|\d{9})(.*?))$/}"
                                      :class="{'is-danger': errors.has('tax-personal-id-number')}"
                                      placeholder=""
                                      @keyup="limitLength('tax_personal_id_number', 20, ...arguments)"
                                    >
                                    </b-form-input>
                                    <span v-show="errors.firstRule('tax-personal-id-number') == 'min'" class="help is-danger">Không đủ ký tự CMND đăng kí thuế</span>
                                    <span v-show="errors.firstRule('tax-personal-id-number') == 'max'" class="help is-danger">Vượt quá ký tự CMND đăng kí thuế</span>
                                    <span v-show="errors.firstRule('tax-personal-id-number') == 'regex'" class="help is-danger">Số CMND đăng kí thuế không hợp lệ</span>
                                  </b-form-group>
                                  <!-- <b-form-group label="Ngày cấp MST" id="input-group-date-tax-iden-number" class="col-md-3">
                                      <Datepicker
                                              v-model="masterProfile.date_tax_iden_number"
                                              format="dd-MM-yyyy"
                                              :bootstrapStyling="true"
                                              :monday-first="true"
                                              :full-month-name="true"
                                              placeholder="Ngày cấp MST"
                                              :calendar-button="true"
                                              calendar-button-icon="ion ion-md-calendar"
                                              :clear-button="true"
                                      />
                                  </b-form-group>
                                  <b-form-group label="Nơi cấp MST" id="input-group-poi-tax-iden-number" class="col-md-3">
                                      <b-form-input
                                              v-model="masterProfile.poi_tax_iden_number"
                                              id="input-poi-tax-iden-number"
                                              placeholder="Nơi cấp MST"
                                      >
                                      </b-form-input>
                                  </b-form-group> -->
                                  <b-form-group label="Số người phụ thuộc" id="input-group-no-of-dependants" class="col-md-3">
                                    <div class="input-group mb-3">
                                      <input v-if="!(permissions && permissions.update_dependants)"
                                             disabled
                                             type="number"
                                             class="form-control"
                                             placeholder="Số người phụ thuộc"
                                             aria-label="number dependants"
                                             aria-describedby="basic-addon2"
                                             v-model="masterProfile.no_of_dependants"
                                      >
                                      <input v-else
                                             type="number"
                                             class="form-control"
                                             placeholder="Số người phụ thuộc"
                                             aria-label="number dependants"
                                             aria-describedby="basic-addon2"
                                             v-model="masterProfile.no_of_dependants"
                                      >
                                      <div class="input-group-append">
                                        <router-link :to="'/dependent-person/manager'+(masterProfile.staff_code ? '/'+masterProfile.staff_code: '')" class="blink">
                                          <button class="btn" type="button"><i class="ion ion-md-create"></i></button>
                                        </router-link>
                                      </div>
                                    </div>
                                  </b-form-group>
                                </b-form-row>
                              </div>
                            </div>
                          </div>
                        </b-collapse>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-show="masterProfile.status !== 'not_verified'">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-tham-chieu><i class="ion  ion-ios-add-circle"></i>&nbsp;Tham chiếu</a>
                            </h6>
                            <b-collapse id="collapse-tham-chieu" visible>
                              <div class="card-body">
                                <div>
                                  <div class="col-form-label">
                                    Người tham chiếu (Người liên hệ trực tiếp khi cần)
                                  </div>
                                  <table class="table b-table table-striped table-hover is_align_middle" v-if="masterProfile.reference_people && masterProfile.reference_people.length > 0">
                                    <tbody>
                                    <tr v-for="(reference, index) in masterProfile.reference_people" :key="index">
                                      <td>
                                        <b-input type="text" v-model="reference.relation" placeholder="Mối quan hệ với nhân viên" />
                                      </td>
                                      <td>
                                        <b-input type="text" v-model="reference.name" placeholder="Họ tên" />
                                      </td>
                                      <td>
                                        <Datepicker
                                          v-model="reference.birthday"
                                          placeholder="Ngày sinh"
                                          format="dd-MM-yyyy"
                                          :bootstrapStyling="true"
                                          :monday-first="true"
                                          :full-month-name="true"
                                          :required = "true"
                                          :calendar-button="true"
                                          calendar-button-icon="ion ion-md-calendar"
                                          :clear-button="true"
                                        />
                                      </td>
                                      <td><b-input type="text" v-model="reference.personal_id_number" placeholder="CMND" /></td>
                                      <td><b-input type="text" v-model="reference.mobile" placeholder="Số điện thoại" /></td>
                                      <td>
                                        <b-btn variant="default md-btn-flat icon-btn" size="sm" @click="removeReferencePeople(index)">
                                          <i class="ion ion-md-close"></i>
                                        </b-btn>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                  <div style="padding: 10px; font-style: italic;" v-else>
                                    Chưa có thông tin người tham chiếu
                                  </div>
                                  <b-btn variant="outline-primary" class="btn-sm sub_btn_add" @click="addReferencePeople">
                                    <i class="ion ion-md-add"></i>&nbsp; Thêm người tham chiếu
                                  </b-btn>
                                </div>
                                <div class="mt-3">
                                  <b>Người bảo lãnh</b>
                                </div>
                                <b-form-row class="mt-1">
                                  <b-form-group label="Trạng thái duyệt" class="col-md-3">
                                    <b-form-select
                                      @change="guardian.bltnds_reason = []"
                                      v-model="guardian.status"
                                      :options="options.statusBltndsOption"
                                    />
                                  </b-form-group>
                                  <b-form-group label="Lý do duyệt/từ chối" class="col-md-3 z-100">
                                    <Multiselect
                                      multiple
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
                                      v-model="guardian.relation"
                                      placeholder="Chọn option"
                                      relationOption="guardian"
                                    />
                                  </b-form-group>
                                  <b-form-group label="Họ và tên" class="col-md-3">
                                    <b-input type="text" v-model.trim="guardian.fullname" />
                                  </b-form-group>
                                  <b-form-group label="Số điện thoại" class="col-md-3">
                                    <b-input
                                      type="text"
                                      v-model.trim="guardian.phone"
                                      name="guardian-phone"
                                      v-validate="{numeric: true, regex: /^(84|0)(3|5|7|8|9)([0-9]{8})$/}"
                                      :class="{'is-danger': errors.has('guardian-phone')}"
                                      @keyup="limitLengthGuardian('phone', 15, ...arguments)"
                                    >
                                    </b-input>
                                    <span v-show="errors.firstRule('guardian-phone') == 'numeric'" class="help is-danger">Vui lòng nhập số </span>
                                    <span v-show="errors.firstRule('guardian-phone') == 'regex'" class="help is-danger">Số điện thoại không đúng</span>
                                  </b-form-group>

                                  <b-form-group label="Ngày sinh người bảo lãnh" class="col-md-3">
                                    <Datepicker
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
                                      :disabled-dates="disableBirthdayGuardian"
                                    />
                                  </b-form-group>
                                  <b-form-group label="CMND/CCCD" class="col-md-3">
                                    <b-input
                                      v-model.trim="guardian.personal_id"
                                      id="guardian-personal-id"
                                      name="guardian-personal-id"
                                      v-validate="{numeric: true, min: 9, max: 12, regex: /^(.{12}|.{9})$/}"
                                      :class="{'is-danger': errors.has('guardian-personal-id')}"
                                      @keyup="limitLengthGuardian('personal_id', 12, ...arguments)"
                                    />
                                    <span v-show="errors.firstRule('guardian-personal-id') == 'numeric'" class="help is-danger">Vui lòng nhập số</span>
                                    <span v-show="errors.firstRule('guardian-personal-id') == 'min'" class="help is-danger">Không đủ ký tự CMND </span>
                                    <span v-show="errors.firstRule('guardian-personal-id') == 'max'" class="help is-danger">Vượt quá ký tự CMND</span>
                                    <span v-show="errors.firstRule('guardian-personal-id') == 'regex'" class="help is-danger">Số cmnd không đúng</span>
                                  </b-form-group>
                                  <b-form-group label="Ngày cấp CMND/CCCD" class="col-md-3">
                                    <Datepicker
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
                                      placeholder=''
                                      @select="selectedPoiGuardian"
                                      :provinceId="guardian.personal_id_place">
                                    </single-select-poi-identity-card>
                                  </b-form-group>
                                  <b-form-group label="Nơi xác thực giấy bảo lãnh" class="col-md-3">
                                                <textarea
                                                  class="form-control" rows="1"
                                                  v-model.trim="guardian.license_place"
                                                ></textarea>
                                  </b-form-group>
                                  <b-form-group label="Thông tin khai thác thêm từ NBL" class="col-md-3">
                                                <textarea
                                                  class="form-control"
                                                  rows="1"
                                                  v-model.trim="guardian.other_info"
                                                ></textarea>
                                  </b-form-group>
                                  <b-form-group label="Ghi chú" class="col-md-3">
                                    <textarea class="form-control" rows="1" v-model.trim="guardian.note"></textarea>
                                  </b-form-group>

                                  <b-form-row class="px-0 mx-0 col-md-12">
                                    <div class="col-md-6 col-lg-6 col-xl-6">
                                      <h6 class="mb-2">Nơi đăng ký hộ khẩu thường trú</h6>
                                      <b-form-row>
                                        <div class="col-md-4">
                                          <single-select-province
                                            @input="op => {guardian.resident_province = op ? op.id : null}"
                                            :provinceId="guardian.resident_province"
                                          ></single-select-province>
                                        </div>
                                        <div class="col-md-4">
                                          <single-select-district
                                            @input="op => {guardian.resident_district = op ? op.id : null}"
                                            :provinceId="guardian.resident_province"
                                            :districtId="guardian.resident_district"
                                          ></single-select-district>
                                        </div>
                                        <div class="col-md-4">
                                          <single-select-sub-district
                                            @input="op => {guardian.resident_sub_district = op ? op.id : null}"
                                            :districtId="guardian.resident_district"
                                            :subDistrictId="guardian.resident_sub_district"
                                          ></single-select-sub-district>
                                        </div>
                                        <b-form-group class="col-md-12 mt-2" label="Chi tiết thường trú">
                                          <span slot="label">Chi tiết thường trú <span class="text-danger">(chỉ nhập số nhà, tên đường)</span></span>
                                          <b-form-textarea
                                            v-model="guardian.resident_detail"
                                            name="resident-address-detail"
                                            placeholder="Số nhà, tên đường, ấp (nếu có)"
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
                                            @input="op => {guardian.current_province = op ? op.id : null}"
                                            :provinceId="guardian.current_province"
                                          ></single-select-province>
                                        </div>
                                        <div class="col-md-4">
                                          <single-select-district
                                            @input="op => {guardian.current_district = op ? op.id : null}"
                                            :provinceId="guardian.current_province"
                                            :districtId="guardian.current_district"

                                          ></single-select-district>
                                        </div>
                                        <div class="col-md-4">
                                          <single-select-sub-district
                                            @input="op => {guardian.current_sub_district = op ? op.id : null}"
                                            :districtId="guardian.current_district"
                                            :subDistrictId="guardian.current_sub_district"
                                          ></single-select-sub-district>
                                        </div>
                                        <b-form-group class="col-md-12 mt-2" label="Chi tiết chỗ ở">
                                          <span slot="label">Chi tiết chỗ ở <span class="text-danger">(chỉ nhập số nhà, tên đường)</span></span>
                                          <b-form-textarea
                                            v-model="guardian.current_detail"
                                            placeholder="Chi tiết chỗ ở"
                                            rows="1"
                                          ></b-form-textarea>
                                        </b-form-group>
                                      </b-form-row>
                                    </div>
                                  </b-form-row>
                                </b-form-row>

                                <div class="mt-3">
                                  <b>Báo cáo thăm nhà</b>
                                </div>
                                <VisitHomeForm :visitInfo="visitInfo" :from-profile-user="true" class="mt-1" />

                                <ListChildrenForm :masterProfileId="+masterProfile.id" ref="list-children-form"/>

                                <b-form-row class="mt-3">
                                  <div class="col-form-label">
                                    Các thành viên trong Hộ gia đình
                                  </div>
                                  <table class="table table-sm table-borderless">
                                    <tbody v-if="masterProfile.member_in_household && masterProfile.member_in_household.length > 0">
                                    <tr v-for="(member, index) in masterProfile.member_in_household" :key="index">
                                      <td>
                                        <single-select-relation v-model="member.relation"></single-select-relation>
                                      </td>
                                      <td>
                                        <b-input type="text" v-model="member.fullname" placeholder="Họ tên" />
                                      </td>
                                      <td>
                                        <b-form-select
                                          v-model="member.gender"
                                          :options="options.gender"
                                          placeholder="Giới tính"
                                        ></b-form-select>
                                      </td>
                                      <td>
                                        <Datepicker
                                          v-model="member.birthday"
                                          placeholder="Ngày sinh"
                                          format="dd-MM-yyyy"
                                          :bootstrapStyling="true"
                                          :monday-first="true"
                                          :full-month-name="true"
                                          :required = "true"
                                          :calendar-button="true"
                                          calendar-button-icon="ion ion-md-calendar"
                                          :clear-button="true"
                                        />
                                      </td>
                                      <td><b-input type="text" v-model="member.personal_id" placeholder="CMND" /></td>
                                      <td><b-input type="text" v-model="member.phone" placeholder="Số điện thoại" /></td>
                                      <td>
                                        <b-btn variant="default md-btn-flat icon-btn" size="sm" @click="removeMember(index)">
                                          <i class="ion ion-md-close"></i>
                                        </b-btn>
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                  <b-btn variant="outline-ghtk" class="btn-sm sub_btn_add" @click="addMember">
                                    <i class="ion ion-md-add"></i>&nbsp; Thêm thành viên
                                  </b-btn>
                                </b-form-row>
                                <b-form-row class="mt-3">
                                  <b-form-group label="Ký quỹ" id="input-group-Datepickererence-people" class="col-md-12">
                                    <b-form-textarea
                                      v-model="masterProfile.margin_deposit"
                                      placeholder="Ký quỹ"
                                      rows="1"
                                      name="margin-deposit"
                                      max-rows="4"
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
                  <div class="row" v-if="isEdit">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <div>
                              <h6 class="card-header">
                                <a class="text-dark" hDatepicker="javascript:void(0)" v-b-toggle.collapse-quy-phep>
                                  <i class="ion  ion-ios-add-circle"></i> Quỹ phép
                                </a>
                              </h6>
                            </div>
                            <b-collapse id="collapse-quy-phep" visible>
                              <div v-if="userLeaves && userLeaves.length > 0" class="card-body">
                                <b-form-row>
                                  <div class="table-responsive">
                                    <table class="table b-table table-striped table-hover" aria-rowcount="100">
                                      <thead class="">
                                      <tr>
                                        <th aria-colindex="1" class="">STT</th>
                                        <th aria-colindex="2" class="">Loại phép</th>
                                        <th aria-colindex="3" class="">Số phép</th>
                                        <th aria-colindex="4" class="">Cập nhật bởi</th>
                                        <th aria-colindex="5" class="">Mô tả</th>
                                        <th aria-colindex="6" class="">Thời gian</th>
                                        <th aria-colindex="7" class="">Action</th>
                                      </tr>
                                      </thead>
                                      <tbody class="">
                                      <tr  v-for="(leave, index) in userLeaves" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ leave.leave_type }}</td>
                                        <td>
                                          <b-form-input v-if="allowEditLeave"
                                                        v-model="leave.value"
                                                        id="input-user-leave-value"
                                                        type="number"
                                                        :disabled="!allowEditLeave"
                                          ></b-form-input>
                                          <span v-else>{{ leave.value }}</span>
                                        </td>
                                        <td>{{ leave.username_create }}</td>
                                        <td>
                                          <b-form-input v-if="allowEditLeave"
                                                        v-model="leave.descriptions"
                                                        id="input-user-leave-descriptions"
                                                        placeholder="Lý do chỉnh sửa"
                                                        :disabled="!allowEditLeave"
                                          ></b-form-input>
                                          <span v-else>{{ leave.descriptions }}</span>
                                        </td>
                                        <td>{{ leave.created }}</td>
                                        <td>
                                          <button v-show="!allowEditLeave && leave.leave_type_id != 7" class="btn btn-sm btn-outline-secondary" @click="allowEditLeave = !allowEditLeave, rowLeaveEdit = leave.leave_type_id">Sửa phép</button>
                                          <button v-show="allowEditLeave && rowLeaveEdit == leave.leave_type_id" class="btn btn-sm btn-outline-success" @click="updateLeave(leave.id)">Cập nhật</button>
                                          <button v-show="allowEditLeave && rowLeaveEdit == leave.leave_type_id" class="btn btn-sm btn-outline-danger" @click="allowEditLeave = !allowEditLeave">Hủy</button>
                                        </td>
                                      </tr>
                                      </tbody>
                                    </table>
                                    <div v-if="userLeaves.length < 2 && userLeaves.length > 0">
                                      <div role="alert" aria-live="polite" aria-atomic="true" class="alert alert-warning" v-if="!hadOfficialContract">
                                        Các loại quỹ phép khác có khi nhân viên được tạo hợp đồng chính thức
                                      </div>
                                      <div v-else>
                                        <b-btn variant="outline-ghtk" class="btn-sm mt-1" @click="createLeaveBlance()">
                                          <i class="ion ion-md-add"></i> Khởi tạo quỹ phép chính thức
                                        </b-btn>
                                      </div>

                                    </div>
                                  </div>
                                </b-form-row>
                              </div>
                              <div v-else class="card-body">
                                <div role="alert" aria-live="polite" aria-atomic="true" class="alert alert-warning">Chưa có quỹ phép</div>
                                <b-btn variant="outline-ghtk" class="btn-sm mt-1" @click="createLeaveBlance()">
                                  <i class="ion ion-md-add"></i> Tạo mới quỹ phép
                                </b-btn>
                              </div>
                            </b-collapse>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr class="border-light container-m--x mt-0 mb-4">
                    <br/>
                  </div>
                  <div class="row" v-if="isEdit" v-show="masterProfile.status !== 'not_verified'">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-contract>
                                <i class="ion  ion-ios-add-circle"></i> Hợp đồng
                              </a>
                              <b-link
                                v-show="(!employeeOrder.contract || !employeeOrder.contract.contract) && !contractDraft.id"
                                :to="{name: 'create-order', params: { profileId: masterProfile.id, orderType: 'new_contract' }}" class="btn btn-outline-success btn-sm ml-1"
                                target="_blank"
                              >
                                <i class="fas fa-plus"></i> Tạo đề xuất hợp đồng
                              </b-link>
                            </h6>
                            <b-collapse id="collapse-contract" visible>
                              <!-- Đề xuất HĐ -->
                              <div v-if="employeeOrder.contract && employeeOrder.contract.contract" class="card-body">
                                Nhân viên này đã tồn tại đề xuất: <br/>
                                <div v-for="order in employeeOrder.contract.contract" :key="order.id">
                                            <span v-if="inprocessOrder(order.status)">
                                              <b>- {{ order.order_type_name }}</b> với mã
                                              <b-link :to="{name: 'list-order', params: { orderCode: genCodeOrder(order.id, 'HĐ') }}" target="_blank">
                                                {{ genCodeOrder(order.id, 'HĐ') }}
                                              </b-link>
                                            </span>
                                </div>
                              </div>
                              <!-- Bản nháp HĐ -->
                              <div v-if="contractDraft && contractDraft.id" class="card-body">
                                Nhân viên tồn tại một bản nháp HĐ chưa ký với số
                                <router-link :to="{name: 'contract-detail', params: {id: contractDraft.id || null }}" target="_blank">
                                  <b>{{ contractDraft.contract_number }}</b>
                                </router-link>
                              </div>
                              <!-- HĐ hiện tại -->
                              <div v-if="contract && contract.id" class="card-body">
                                <b-form-row>
                                  <b-form-group label="Mã hợp đồng" class="col-md-4 col-lg-4 col-xl-4">
                                    <b-form-input
                                      v-model="contract.contract_number"
                                      :disabled="true"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                  <b-form-group label="Loại hợp đồng" class="col-md-4 col-lg-4 col-xl-4">
                                    <b-form-select
                                      v-model="contract.type_contract"
                                      :options="options.type_contracts"
                                      :disabled="true"
                                    ></b-form-select>
                                  </b-form-group>
                                  <b-form-group label="KPI" class="col-md-4 col-lg-4 col-xl-4">
                                    <b-form-select
                                      v-model="contract.has_kpi"
                                      :options="options.has_kpis"
                                      :disabled="true"
                                    ></b-form-select>
                                  </b-form-group>
                                </b-form-row>
                                <b-form-row>
                                  <b-form-group label="Ngày ký" class="col-md-4 col-lg-4 col-xl-4">
                                    <Datepicker
                                      v-model="contract.contract_date"
                                      format="dd-MM-yyyy"
                                      :bootstrapStyling="true"
                                      :monday-first="true"
                                      :full-month-name="true"
                                      placeholder="Ngày ký"
                                      :calendar-button="true"
                                      calendar-button-icon="ion ion-md-calendar"
                                      :clear-button="true"
                                      :disabled="true"
                                    />
                                  </b-form-group>
                                  <b-form-group label="Ngày bắt đầu" class="col-md-4 col-lg-4 col-xl-4">
                                    <Datepicker
                                      v-model="contract.start_date"
                                      format="dd-MM-yyyy"
                                      :bootstrapStyling="true"
                                      :monday-first="true"
                                      :full-month-name="true"
                                      placeholder="Ngày bắt đầu"
                                      :calendar-button="true"
                                      calendar-button-icon="ion ion-md-calendar"
                                      :clear-button="true"
                                      :disabled="true"
                                    />
                                  </b-form-group>
                                  <b-form-group label="Ngày kết thúc" class="col-md-4 col-lg-4 col-xl-4">
                                    <Datepicker
                                      v-model="contract.end_date"
                                      format="dd-MM-yyyy"
                                      :bootstrapStyling="true"
                                      :monday-first="true"
                                      :full-month-name="true"
                                      placeholder="Ngày kết thúc"
                                      :calendar-button="true"
                                      calendar-button-icon="ion ion-md-calendar"
                                      :clear-button="true"
                                      :disabled="true"
                                    />
                                  </b-form-group>
                                </b-form-row>
                                <div class="text-center">
                                  <router-link :to="{name: 'contract-detail', params: {id: contract.id || null }}" class="btn btn-success"><i class="fas fa-search"></i> Xem hợp đồng</router-link>
                                </div>
                              </div>
                              <div v-if="!listUsers || !listUsers.length" class="card-body">
                                Tạo tài khoản trước khi tạo hợp đồng
                                <b-link :to="{name: 'add-user', params: { id: this.$route.params.id }}" class="btn btn-outline-success btn-sm"><i class="fas fa-plus"></i> Thêm tài khoản</b-link>
                              </div>
                            </b-collapse>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr class="border-light container-m--x mt-0 mb-4">
                    <br/>
                  </div>
                  <div class="row" v-show="masterProfile.status !== 'not_verified'">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <div class="card-header row">
                              <div class="col-6">
                                <h6>
                                  <a class="text-dark text-center" href="javascript:void(0)" v-b-toggle.collapse-qua-trinh-cong-tac>
                                    <i class="ion  ion-ios-add-circle"></i>&nbsp;Quá trình công tác
                                  </a>
                                </h6>
                              </div>
                              <div class="col-6 d-flex align-items-center justify-content-end">
                                <b-button variant="outline-primary" @click="toggleModalPauseWork(true)">
                                  <i class="fa fa-plus"></i> Tạm dừng/ Ngừng công tác
                                </b-button>
                                <b-button class="ml-2" variant="outline-primary" @click="toggleModalAddLogPauseWork(true)">
                                  Thêm log lịch sử công tác
                                </b-button>
                              </div>
                            </div>
                            <b-collapse id="collapse-qua-trinh-cong-tac" visible>
                              <div class="card-body">
                                <b-form-row>
                                  <b-form-group label="Ngày vào" class="col-md-3">
                                    <Datepicker
                                      v-model="masterProfile.join_date"
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
                                  <b-form-group label="Ngày thử việc" class="col-md-3">
                                    <Datepicker
                                      v-model="masterProfile.trial_date"
                                      format="dd-MM-yyyy"
                                      :bootstrapStyling="true"
                                      :monday-first="true"
                                      :full-month-name="true"
                                      placeholder="Ngày thử việc"
                                      :calendar-button="true"
                                      calendar-button-icon="ion ion-md-calendar"
                                      :clear-button="true"
                                    />
                                  </b-form-group>
                                  <b-form-group label="Ngày chính thức" class="col-md-3">
                                    <Datepicker
                                      v-model="masterProfile.contract_date"
                                      format="dd-MM-yyyy"
                                      :bootstrapStyling="true"
                                      :monday-first="true"
                                      :full-month-name="true"
                                      placeholder="Ngày lương chính thức"
                                      :calendar-button="true"
                                      calendar-button-icon="ion ion-md-calendar"
                                      :clear-button="true"
                                    />
                                  </b-form-group>
                                  <b-form-group label="Ngày lương chuẩn" class="col-md-3">
                                    <Datepicker
                                      v-model="mainUser.EmpProfile.start_date_day"
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
                                  <b-form-group label="Ngày đi làm lại" class="col-md-3" v-if="masterProfile.comeback_date !== '' && masterProfile.comeback_date !== null">
                                    <Datepicker
                                      v-model="masterProfile.comeback_date"
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
                                  <b-form-group class="col-md-3"  label="Bộ phận">
                                    <single-select-department
                                      @handleSelectedDepartment="handleSelectedDepartment"
                                      :department-id="mainUser.EmpPosition.department_id"
                                      :is-disabled="true"
                                    >
                                    </single-select-department>
                                  </b-form-group>
                                  <b-form-group class="col-md-3" label="Vị trí">
                                    <single-select-position
                                      @handleSelectedPosition="handleSelectedPosition"
                                      :department-id="mainUser.EmpPosition.department_id"
                                      :position-job="mainUser.EmpPosition.position_job"
                                      :is-disabled="true"
                                    >
                                    </single-select-position>
                                  </b-form-group>
                                  <b-form-group label="Chức vụ" class="col-md-3 col-lg-3 col-xl-3">
                                    <b-form-input
                                      v-model="masterProfile.chuc_vu"
                                      placeholder="Chức vụ"
                                    >
                                    </b-form-input>
                                  </b-form-group>
                                </b-form-row>
                              </div>
                              <WorkHistory :users="listUsers" @refreshMasterProfile="getProfile" :reload-history="reloadPauseWorkHistory"/>
                            </b-collapse>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr class="border-light container-m--x mt-0 mb-4">
                    <br/>
                  </div>

                  <div class="row" v-show="masterProfile.status !== 'not_verified'">
                    <div class="col-md-12">
                      <div class="card mb-4">
                        <div class="row no-gutters row-bordered">
                          <div class="col-md-12 col-lg-12 col-xl-12">
                            <h6 class="card-header">
                              <a class="text-dark" href="javascript:void(0)" v-b-toggle.collapse-qua-trinh-cong-tac>
                                <i class="ion  ion-ios-add-circle"></i>&nbsp;Hồ sơ điện tử
                              </a>
                            </h6>
                            <b-collapse id="collapse-qua-trinh-cong-tac" visible>
                              <div class="card-body">
                                <h5>Biên bản cam kết</h5>
                                <table class="table table-hover table-bordered table-striped" hover responsive outlined>
                                  <thead>
                                  <tr>
                                    <th>Trạng thái</th>
                                    <th>Ngày ký</th>
                                    <th>Hành động</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <template v-if="commitProfiles.length > 0">
                                    <tr v-for="(commitProfile, index) in commitProfiles" v-bind:key="index">
                                      <template>
                                        <td>{{ commitProfileStatusFormat(commitProfile.ErpCommitmentProfile.status) }}</td>
                                        <td>{{ commitProfile.ErpCommitmentProfile.status === 'active' ? dateFormat(commitProfile.ErpCommitmentProfile.modified) : "" }}</td>
                                        <td>
                                          <b-btn @click="redirectTo(storageHost + commitProfile.ErpCommitmentProfile.file)" class="btn btn-default">Xem chi tiết</b-btn>
                                        </td>
                                      </template>
                                    </tr>
                                  </template>
                                  <template v-if="isCreateCommitDaft">
                                    <tr>
                                      <td>
                                        <b-btn variant="ghtk" @click="checkCanCreateDraft(mainUser.User.id)">
                                          <i class="ion ion-ios-add-circle"></i> Tạo bản nháp
                                        </b-btn>
                                      </td>
                                    </tr>
                                  </template>
                                  </tbody>
                                </table>

                                <h5>Hợp đồng trách nhiệm vật chất</h5>
                                <table class="table table-hover table-bordered table-striped" hover responsive outlined>
                                  <thead>
                                  <tr>
                                    <th>Mã hợp đồng</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày ký</th>
                                    <th>Tổng số tiền cần cọc</th>
                                    <th>Số tiền cọc đầu vào</th>
                                    <th>Hành động</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <template v-if="responsibilityProfiles.length > 0">
                                    <tr v-for="(responsibilityProfile, index) in responsibilityProfiles" v-bind:key="index">
                                      <template>
                                        <td>{{ responsibilityProfile.ErpCommitmentProfile.commitment_number }}</td>
                                        <td>{{ commitProfileStatusFormat(responsibilityProfile.ErpCommitmentProfile.status) }}</td>
                                        <td>{{ responsibilityProfile.ErpCommitmentProfile.status === 'active' ? dateFormat(responsibilityProfile.ErpCommitmentProfile.modified) : "" }}</td>
                                        <td>{{ responsibilityProfile.ErpDeposit.payment_money }}</td>
                                        <td>{{ responsibilityProfile.ErpDeposit.total_deposited_money }}</td>
                                        <td>
                                          <b-btn @click="redirectTo(storageHost + responsibilityProfile.ErpCommitmentProfile.file)" class="btn btn-default">Xem chi tiết</b-btn>
                                        </td>
                                      </template>
                                    </tr>
                                  </template>
                                  <template v-else>
                                    <tr>
                                      <td>
                                        <b-btn variant="ghtk" @click="createDraftCommit({
                                                          user_id: mainUser.User.id,
                                                          alias: 'asset_responsibility_file'
                                                         })">
                                          <i class="ion ion-ios-add-circle"></i> Tạo bản nháp
                                        </b-btn>
                                      </td>
                                    </tr>
                                  </template>
                                  </tbody>
                                </table>
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

            </div>
            <div class="card-footer border-0 text-center py-3">
                <b-btn v-if="this.$route.params.id == null" variant="ghtk" @click="checkSameCmnd()" :disabled="isProcessingUpdate">
                  <i class="ion ion-ios-add-circle"></i> Thêm hồ sơ nhân viên
                </b-btn>
                <div v-else>
                  <span v-if="masterProfile && masterProfile.id">
                    <span v-show="masterProfile.status !== 'not_verified'">
                      <b-btn type="button" variant="btn btn-info" @click="checkSameCmnd()">
                        <i class="icon ion-md-archive"></i> Cập nhật hồ sơ
                      </b-btn>
                    </span>
                    <span v-if="masterProfile.status === 'not_verified'">
                      <b-btn type="button" variant="btn btn-success" @click="verifiedProfile('active')" :disabled="checkAction" v-show="canVerifyProfile">
                        <i class="fa fa-check"></i> Duyệt hồ sơ
                      </b-btn>
                      <b-btn type="button" variant="btn btn-danger" v-b-modal.modal-reason-reject-profile>
                        <i class="fa fa-times"></i> Từ chối
                      </b-btn>
                    </span>
                  </span>
                  <router-link :to="{name: 'manager-master-profile'}" class="btn btn-default"><i class="ion ion-ios-return-left"></i> Quay lại</router-link>
                </div>
            </div>
            <notifications group='add-emp'></notifications>
        </div>
        <modal-report-wrong-ekyc
          :profile-id="id"
          :is-show="isShowReportWrongEkycModal"
          @reportSuccessful="reportEkycSuccessful"
          @closeModal="closeModalReportEkyc">
        </modal-report-wrong-ekyc>
        <modal-export-atm-form
          :data-master-profile="dataMasterProfile"
          :is-show="isShowAtmModal"
          @toggleModal="toggleExportAtmModal">
        </modal-export-atm-form>
        <modal-resign
          :profile-id="masterProfile.id"
          :resign-info="resignObj"
          @notify="showNotifyResign"
        ></modal-resign>
        <modal-master-log :master-id="$route.params.id" :show="toggleLog" @hideModal="toggleLogButtonAction"></modal-master-log>
        <modal-candidate :master-id="$route.params.id" :identifyId="masterProfile.personal_id_number"></modal-candidate>
        <modal-update-image-profile :master-id="$route.params.id" @updateImageProfile="getProfile()"></modal-update-image-profile>
        <b-modal hide-footer ref="modal-log" title="Lịch sử" ok-only static centered size="lg" @show="getHistoryInsurance">
          <perfect-scrollbar  :options="{wheelSpeed: 0.2,  wheelPropagation: false }" class="mh-50">
            <table class="table table-hover table-bordered table-striped" hover responsive outlined>
              <tbody>
              <tr v-for="(history, index) in historyInsurances" v-bind:key="index">
                <td class="text-center"><b>{{history.fullname}}</b>
                  <div>({{history.created}})</div>
                </td>
                <td>Chuyển phương án <b>{{history.description}}</b>
                  áp dụng từ <b>{{history.from}}</b>
                  -> <b>{{history.to}}</b></td>
              </tr>
              </tbody>
            </table>
          </perfect-scrollbar>
        </b-modal>
        <b-modal static centered size="lg" id="modal-reason-reject-profile" title="Lý do từ chối">
          <b-textarea rows="3" v-model="reason_reject_profile"></b-textarea>
          <div class="w-100 text-center" slot="modal-footer">
            <b-btn @click="verifiedProfile('disable')">OK</b-btn>
          </div>
        </b-modal>
      <ModalAddPauseWorkHistory
        @toggle="toggleModalPauseWork"
        @refresh="reloadHistory"
        :open="openModalPauseWork"
        @refreshParent="getProfile"
        :users="listUsers"
        :is-update-status-mp="true"
        :modal-title="'Cập nhật trạng thái tạm dừng/ Ngừng công tác'"
      />
      <ModalAddPauseWorkHistory
        @toggle="toggleModalAddLogPauseWork"
        @refresh="reloadHistory"
        :open="openModalAddLogPauseWork"
        @refreshParent="getProfile"
        :users="listUsers"
        :is-update-status-mp="false"
        :modal-title="'Thêm log lịch sử công tác'"
      />
    </div>
</template>

<style lang="scss" scoped>
    @import "src/assets/sass/components/master-profile";

    .px-1_75re {
      padding: 0 1.75rem 0 1.75rem;
    }
</style>

<script>
// service
import commonService from 'domain/services/common-service'
import staffService from 'domain/services/staff-service'
import userService from 'domain/services/user-service'
import profileService from 'domain/services/profile-service'
import hrOrderService from 'domain/services/hr-order-service'
import insuranceService from 'domain/services/insurance-service'
import staffInfoService from 'domain/services/staff-info-service'
import candidateService from 'domain/services/candidate-service'

// entities
import MasterProfile from 'domain/entities/MasterProfile'
import Contract from 'domain/entities/Contract'
import {approveBltndsOption, rejectBltndsOption} from '../ProfileManager/OptionConst.js'
// helper
import moment from 'moment'
import helper from 'infrastructures/helpers/common-helpers'
// built-in component
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import PerfectScrollbar from '@/vendor/libs/perfect-scrollbar/PerfectScrollbar'
// custome-component
import SelectNationality from 'components/elements/common/SelectNationality'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectPoiIdentityCard from 'components/elements/common/SingleSelectPoiIdentityCard'
import SingleSelectDistrict from 'components/elements/common/SingleSelectDistrict'
import SingleSelectSubDistrict from 'components/elements/common/SingleSelectSubDistrict'
import ListUser from 'components/pages/erp/profile/ListUser'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import SingleSelectBank from 'components/elements/common/SingleSelectBank'
import SingleSelectEthnic from 'components/elements/common/SelectEthnic'
import SingleSelectBankBrand from 'components/elements/common/SingleSelectBankBrand'
import ModalAddExistUser from 'components/pages/erp/profile/ModalAddExistUser'
import ModalExportAtmForm from 'components/pages/erp/profile/ModalExportAtmForm'
import SingleSelectRelation from 'components/elements/common/SingleSelectRelation'
import ModalUpdateDocument from './ModalUpdateDocument'
import ModalMasterLog from './ModalMasterLog.vue'
import LogComment from 'components/pages/Candidate/LogComment'
import ModalResign from './ModalResign'
import ModalCandidate from './ModalCandidate'
import ModalUpdateImageProfile from './ModalUpdateImageProfile'
import WorkHistory from './WorkHistory.vue'
import FileCandidate from 'components/pages/Candidate/FileCandidate'
import SingleSelectCorporation from 'components/elements/common/SingleSelectCorporation'
import ModalReportWrongEkyc from 'components/pages/erp/profile/ModalReportWrongEkyc'
import VisitHomeForm from './VisitHomeForm.vue'
import ListChildrenForm from '../../../elements/children/ListChildrenForm.vue'

import { mapGetters } from 'vuex'
import VeeValidate from 'vee-validate'
import Vue from 'vue'
import ModalAddPauseWorkHistory from './ModalAddPauseWorkHistory.vue'
Vue.use(VeeValidate, {
  fieldsBagName: 'veeFields'
})

export default {
  name: 'update-master-profile',

  props: {
    id: {
      default: null
    }
  },

  components: {
    ModalAddPauseWorkHistory,
    SingleSelectCorporation,
    LaddaBtn,
    ModalUpdateDocument,
    SingleSelectRelation,
    SingleSelectProfileRegion,
    Notification,
    Multiselect,
    Datepicker,
    SingleSelectPoiIdentityCard,
    SingleSelectProvince,
    SingleSelectDistrict,
    SingleSelectSubDistrict,
    ListUser,
    SingleSelectDepartment,
    SingleSelectBank,
    SingleSelectBankBrand,
    SingleSelectPosition,
    ModalAddExistUser,
    ModalMasterLog,
    ModalExportAtmForm,
    LogComment,
    ModalResign,
    ModalCandidate,
    ModalUpdateImageProfile,
    PerfectScrollbar,
    SingleSelectEthnic,
    SelectNationality,
    WorkHistory,
    FileCandidate,
    ModalReportWrongEkyc,
    VisitHomeForm,
    ListChildrenForm
  },

  data: () => ({
    historyInsurances: null,
    ins_opts: [],
    toggleLog: false,
    isLoading: false,
    isProcessingUpdate: false,
    listUsers: [],
    statusOptions: MasterProfile.statusOptions,
    profileDocuments: [],
    mainUser: {
      User: {
        id: '',
        username: '',
        fullname: '',
        status_id: ''
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
    userLeaves: [],
    keyword: '',
    contract: {},
    contractDraft: {},
    masterProfile: {
      is_virtual: 0,
      status: 'not_verified', // Trạng thái
      fullname: '', // họ tên
      tel: '', // Số điện thoại
      region: '', // Miền
      gender: null, // Giới tính
      college: '', // Trường học
      diploma: '', // Chứng chỉ
      degree: null, // Trình độ học vấn
      speciality: '', // Chứng chỉ
      birthday: '', // Ngày sinh
      marital_status: null, // Tình trạng hôn nhân
      ethnic: 'kinh', // Dân tộc
      nationality: 'Vietnam', // Quốc tịch
      personal_id_number: '', // CMT/CCCD
      company_email: '', // Email ghtk
      personal_email: '', // Email cá nhân
      doi_personal_id_number: '', // Ngày cấp CMND
      poi_personal_id_number: null, // Nơi cấp CMND
      bank_name: '', // Tên ngân hàng ( bank_code)
      bank_account_number: '', // Số TK ngân hàng
      bank_account_name: '', // Tên chủ TK ngân hàng
      bank_brand: '', // Chi nhánh ngân hàng
      tax_iden_number: '', // Mã số thuế
      poi_tax_iden_number: '', // nơi cấp MST
      date_tax_iden_number: '', // Ngày cấp mã số thuế
      no_of_dependants: '', // Số người phụ thuộc
      insurance_register: '', // Số sổ bảo hiểm
      insurance_plan: '', // Phương án BHXH
      insurance_apply_from: '', // Tháng bắt đầu áp dụng phương án BHXH
      health_ins_number: '', // Số thẻ BHYT
      hospital_register: '', // Nơi đăng kí KCB
      shk_number: '', // Số sổ HK
      full_name_household: '', // Tên chủ hộ
      dob_household: '', // Ngày sinh chủ hộ
      relation_with_household: '', // Quan hệ với chủ hộ
      id_number_household: '', // CMND chủ hộ
      father: '', // Họ tên bố
      dob_father: '', // Ngày sinh của bố
      cmnd_father: '', // CMND bố
      mobile_father: '', // SĐT bố
      mother: '', // Họ tên mẹ
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
      member_in_household: [], // thành viên trong shk
      contact_information: '', // Thông tin liên hệ khi cần
      reference_people: [], // Thông tin người tham chiếu
      guarantor: '', // Thông tin người bảo lãnh, giới thiệu vào làm
      join_date: '', // Ngày vào
      trial_date: '', // Ngày thử việc
      contract_date: '', // Ngày chính thức
      comeback_date: '', // Ngày đi làm trở lại
      salary_config: '', // Cơ cấu lương
      chuc_vu: '',
      bo_nhiem: '',
      giang_chuc: '',
      dieu_chuyen: '',
      khen_thuong: '',
      ky_luat: '',
      notes: '', // Ghi chú khác
      image_profile: '',
      cnb_confirmed: 0,
      margin_deposit: '',
      resign_date: null,
      resign_type: null,
      resign_reason: null, // lý do nghỉ việc
      ins_book_with_comp: '', // người giữ sổ
      province_hospital_register: '', // Tỉnh nơi đăng kí khám chữa bệnh
      tax_personal_id_number: null
    },
    disableBirthdayGuardian: {
      to: null,
      from: null
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
    visitInfo: {
      character_by_guardian: null,
      date_visit_home: null,
      employee_career_path: null,
      employee_sharing: null,
      family_economic: null,
      guardian_agree: null,
      guardian_know_responsibility: null,
      guardian_work_state: null,
      is_breadwinner: null,
      note: null,
      user_visit_home: null,
      file_visit: [],
      file_visit_add: [],
      file_visit_delete: [],
      locate_guardian_house: null
    },
    options: {
      gender: [
        { text: 'Giới tính', value: null },
        { text: 'Nam', value: 'male' },
        { text: 'Nữ', value: 'female' }
        // { text: 'Khác', value: 'other' }
      ],
      marital_status: [
        { text: 'Tình trạng hôn nhân', value: null },
        { text: 'Tái hôn', value: 'remarried' },
        { text: 'Ly hôn', value: 'divorced' },
        { text: 'Độc thân', value: 'single' },
        { text: 'Đã kết hôn', value: 'married' }
      ],
      degree: [
        { text: 'Trình độ học vấn', value: null },
        { text: 'Trên đại học', value: 'Trên đại học' },
        { text: 'Đại học', value: 'Đại học' },
        { text: 'Cao đẳng/ Cao đẳng nghề', value: 'Cao đẳng/ Cao đẳng nghề' },
        { text: 'Sinh viên', value: 'Sinh viên' },
        { text: 'Sơ cấp nghề', value: 'Sơ cấp nghề' },
        { text: 'Dạy nghề thường xuyên', value: 'Dạy nghề thường xuyên' },
        { text: 'Chưa qua đào tạo', value: 'Chưa qua đào tạo' }
      ],
      type_contracts: Contract.getTypeOptions(),
      has_kpis: [
        { text: 'Tính KPI', value: '' },
        { text: 'Có', value: '1' },
        { text: 'Không', value: '0' }
      ],
      ins_book_with_comp_options: [
        { desc: 'Công ty', value: '1' },
        { desc: 'Nhân viên', value: '2' }
      ],
      statusBltndsOption: [
        { text: '--Chọn tình trạng--', value: null, disabled: true },
        { text: 'Duyệt', value: 'approved', disabled: false },
        { text: 'Từ chối', value: 'rejected', disabled: false }
      ],
      approveBltndsOption: approveBltndsOption,
      rejectBltndsOption: rejectBltndsOption
    },
    employeeOrder: {},
    allowEditLeave: false,
    rowLeaveEdit: '',
    resignObj: {},
    loadProfileOK: false,
    loadProvinceOK: false,
    permissions: null,
    provinceOptions: [],
    hospitalOptions: [],
    isShowAtmModal: false,
    dataMasterProfile: null,
    personal_id: null,
    reason_reject_profile: null,
    notInArea: null,
    briefProfile: {},
    teamHr: [],
    responsibilityProfiles: [],
    commitProfiles: [],
    storageHost: '',
    checkAction: false,
    isShowReportWrongEkycModal: false,
    hasOrderReportEKYC: false,
    dataCommitmentDraft: [],
    dataCommitmentActive: [],
    isCreateCommitDaft: true,
    openModalPauseWork: false,
    openModalAddLogPauseWork: false,
    reloadPauseWorkHistory: true,
    candidateLog: []
  }),

  computed: {
    ...mapGetters({
      loginUser: 'userInfo'
    }),

    isAdd: function () {
      return this.$route.name === 'add-master-profile'
    },

    isEdit: function () {
      return this.$route.params.id > 0
    },

    isFormalContract: function () {
      return ['indefinite', 'definite', 'definite_24'].includes(this.contract.type_contract)
    },

    hadOfficialContract () {
      return ['definite', 'definite_24', 'indefinite'].includes(this.contract.type_contract)
    },

    canVerifyProfile () {
      return this.masterProfile.status === 'not_verified' && (!this.permissions || this.permissions.verify_profile === undefined || this.permissions.verify_profile)
    }
  },

  created () {
    this.getFromStorage()
    if (!this.id) return

    this.getUserPermissions(this.id)
    this.getProfile()
    this.getInsurrancePlan(true)
    this.getAdministrativeProvinces()
    this.getCommitProfiles({
      master_profile_id: this.id
    })

    if (this.dataCommitmentDraft.length > 0) {
      this.dataCommitmentDraft = []
    }

    if (this.dataCommitmentActive.length > 0) {
      this.dataCommitmentActive = []
    }

    if (!this.isCreateCommitDaft) {
      this.isCreateCommitDaft = true
    }

    this.getDataCheckCreateCommitDraft({
      master_profile_id: this.id
    })

    this.setDisableDate()
    this.getLatestCandidateLog()
  },

  watch: {
    id (newValue, oldValue) {
      if (newValue) {
        this.getProfile(newValue)
      }
    },

    loadProfileOK: function (newValue, oldValue) {
      if (this.loadProvinceOK && newValue) {
        this.setOptionsInsurance()
      }
    },

    loadProvinceOK: function (newValue, oldValue) {
      if (this.loadProfileOK && newValue) {
        this.setOptionsInsurance()
      }
    },

    'masterProfile.province_hospital_register' (newVal, oldValue) {
      if (newVal && typeof (newVal) === 'object') {
        this.getHospitals(newVal.code)
      } else {
        this.getHospitals()
      }
    },

    'masterProfile.insurance_plan' (newValue, oldValue) {
      if (this.masterProfile && this.masterProfile.insurance_apply_from && this.masterProfile.insurance_plan) return
      if ([8, 11].includes(+newValue)) { // nếu chưa có BHXH thì lấy ngày áp dụng là ngày kí hợp đồng
        if (this.hadOfficialContract) {
          let startMonth = new Date(this.contract.start_date)
          let date = startMonth.getDate()
          let month = startMonth.getMonth()
          let year = startMonth.getFullYear()
          if (date < 16) startMonth = year + '-' + (month + 1) + '-01'
          else {
            if (month < 11) startMonth = year + '-' + (month + 2) + '-01'
            else startMonth = (year + 1) + '-01-01' // ngày áp dụng chuyển sang tháng 1 năm sau nếu kí hợp đồng sau ngày 15/12
          }
          this.masterProfile.insurance_apply_from = startMonth
        }
      } else {
        this.masterProfile.insurance_apply_from = null
      }
    },

    'masterProfile.personal_id_number' (newValue, oldValue) {
      if (newValue !== this.personal_id && (newValue || this.personal_id)) {
        if (document.querySelector('.toast-style') || this.isAdd) return
        helper.showToast('Đối với trường hợp NLD cập nhật số CMT/CCCD mới trên cơ quan nhà nước (mà không phải do sai sót từ phía nhập liệu của HR), BDH tổng hợp và báo lại admin thuế hàng tháng', 'warning')
      } else {
        helper.cleanToast()
      }
    }
  },
  methods: {
    getLatestCandidateLog () { // lấy ra logs cuối cùng của candidate
      this.isLoading = true
      let param = {}
      param['master_profile_id'] = this.id
      candidateService.getLatestLog(param)
        .then(res => {
          if (res.data.success) {
            this.candidateLog = res.data.data
          }
          this.isLoading = false
        })
        .catch(e => {
          console.log(e)
        })
    },
    openModalReportEkyc () {
      this.isShowReportWrongEkycModal = true
    },

    closeModalReportEkyc () {
      this.isShowReportWrongEkycModal = false
    },

    reportEkycSuccessful () {
      this.hasOrderReportEKYC = true
    },

    createLeaveBlance () {
      if (!this.masterProfile.id) {
        alert('Không có mã nhân viên !')
        return
      }
      if (!confirm(`Bạn có muốn tạo mới quỹ phép cho ${this.masterProfile.fullname} ?`)) return
      let data = {
        master_profile_id: this.masterProfile.id
      }
      this.$startLoading()
      userService.createLeaveBlance(data)
        .then(res => {
          if (res.data.success) {
            this.getLeave()
            helper.showMessage(res.data.message || 'Tạo mới quỹ phép thành công', 'success')
          } else {
            helper.showMessage(res.data.message || 'Có lỗi khi tạo quỹ phép cho nhân viên', 'warning')
          }
        })
        .catch(e => {
          console.log('Có lỗi khi tạo quỹ phép')
        })
        .finally(_ => this.$stopLoading())
    },

    setProvinceHospitalRegister (code) {
      if (!code || !this.provinceOptions || !this.provinceOptions.length) return
      if (this.masterProfile.province_hospital_register && +this.masterProfile.province_hospital_register.code === +code) return
      let op = this.provinceOptions.find(element => (+element.province_code === +code))
      this.masterProfile.province_hospital_register = op || null
    },

    setDisableDate (type = null) {
      // set tuổi người bảo lãnh từ đủ 18 đến dưới 65 tuổi
      if (!type || type === 'guardian') {
        this.disableBirthdayGuardian.to = moment().subtract(65, 'y').toDate()
        this.disableBirthdayGuardian.from = moment().subtract(18, 'y').toDate()
      }
    },

    setOptionsInsurance () {
      // tạo dropdown list chọn phương án BHXH
      let len = this.ins_opts.length
      let planIns = this.ins_opts
      // Hr chỉ có quyền update 2 trạng thái
      // 8: Tăng mới
      // 11: tăng tham gia
      let viewArrayHr = [this.masterProfile.insurance_plan, '8', '11', null]
      for (var i = 0; i < len; i++) {
        if (!viewArrayHr.includes(planIns[i].value)) {
          planIns[i] = null
        }
      }
      this.ins_opts = planIns.filter(function (el) {
        return el != null
      })
    },

    getHistoryInsurance () {
      let params = {
        mp_id: this.masterProfile.id
      }
      insuranceService.getHistoryInsurance(params).then(response => {
        if (response.data.success) {
          this.historyInsurances = response.data.data
          for (const [index, value] of this.historyInsurances.entries()) {
            value.from = value.from ? this.moment(value.from, 'DD/MM/YYYY') : this.moment(value.created, 'DD/MM/YYYY')
            value.to = value.to ? this.moment(value.to, 'DD/MM/YYYY') : ((index - 1) > -1 ? this.historyInsurances[index - 1].from : value.to)
          }
        }
      }).catch(e => {
        console.log(e)
      })
    },

    getAdministrativeProvinces () {
      if (sessionStorage.getItem('administrativeProvinces')) {
        this.provinceOptions = JSON.parse(sessionStorage.getItem('administrativeProvinces'))
        this.setProvinceHospitalRegister()
        return
      }
      commonService.getAdministrativeArea().then(response => {
        if (response.data.success) {
          this.provinceOptions = response.data.data
          this.setProvinceHospitalRegister()
          sessionStorage.setItem('administrativeProvinces', JSON.stringify(this.provinceOptions))
        }
      }).catch(e => {
        console.log(e)
      })
    },

    getHospitals (provinceCode) {
      commonService.getHospitals({ province_code: provinceCode })
        .then(res => {
          if (res.data.success) {
            this.hospitalOptions = res.data.data
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getInsurrancePlan (hrView) {
      if (sessionStorage.getItem('typeInsurance')) {
        this.ins_opts = JSON.parse(sessionStorage.getItem('typeInsurance'))
        this.loadProvinceOK = true
        return
      }
      insuranceService.apiListTypeInsurance().then(response => {
        if (response.data.success) {
          this.ins_opts = response.data.data
          this.loadProvinceOK = true
          sessionStorage.setItem('typeInsurance', JSON.stringify(this.ins_opts))
        }
      }).catch(e => {
        console.log(e)
      })
    },

    moment (data, format) {
      if (!data) return
      return moment(data).format(format || 'DD-MM-YYYY')
    },

    getUserPermissions (profileId) {
      userService.getSpecialPermissions({'profile_id': profileId})
        .then(res => {
          if (res.data.success) {
            this.permissions = res.data.permissions
          }
        }).catch(e => {
          console.log(e)
        })
    },

    toggleLogButtonAction () {
      this.toggleLog = !this.toggleLog
    },

    limitLength (varName, length) {
      let len = this.masterProfile[varName].length
      if (len > length) {
        this.masterProfile[varName] = this.masterProfile[varName].substring(0, length)
      }
    },

    limitLengthGuardian (varName, length) {
      let len = this.guardian[varName].length
      if (len > length) {
        this.guardian[varName] = this.guardian[varName].substring(0, length)
      }
    },

    /**
     * Lấy thông tin profile khi tạo master profile từ trang hồ sơ ứng viên
     */
    getFromStorage () {
      if (sessionStorage.getItem('candidate')) {
        let data = JSON.parse(sessionStorage.getItem('candidate'))
        console.log(data)
        if (data) {
          this.masterProfile.candidate = {
            id: data['id'],
            status: data['status'],
            evaluate: data['evaluate'] ? data['evaluate'] : ''
          }
        }
        if (data['name']) {
          this.masterProfile['fullname'] = data['name']
        }
        if (data['phone']) {
          this.masterProfile['tel'] = data['phone']
        }
        if (data['identify_id']) {
          this.masterProfile['personal_id_number'] = data['identify_id']
        }
        if (data['mail']) {
          this.masterProfile['personal_email'] = data['mail']
        }
        if (data['gender']) {
          this.masterProfile['gender'] = data['gender']
        }
        if (data['birthday']) {
          this.masterProfile.birthday = data['birthday']
        }
        if (data['detail_now']) {
          this.masterProfile.current_address_detail = data['detail_now']
        }
        if (data['subdistrict_now_id']) {
          this.masterProfile.current_address_sub_district = data['subdistrict_now_id']
        }
        if (data['district_now_id']) {
          this.masterProfile.current_address_district = data['district_now_id']
        }
        if (data['province_now_id']) {
          this.masterProfile.current_address_province = data['province_now_id']
        }
        if (data['detail_household']) {
          this.masterProfile.resident_address_detail = data['detail_household']
        }
        if (data['subdistrict_household_id']) {
          this.masterProfile.resident_address_sub_district = data['subdistrict_household_id']
        }
        if (data['district_household_id']) {
          this.masterProfile.resident_address_district = data['district_household_id']
        }
        if (data['province_household_id']) {
          this.masterProfile.resident_address_province = data['province_household_id']
        }
        if (data['province_grant_identify_id']) {
          this.masterProfile.poi_personal_id_number = data['province_grant_identify_id']
        }
        if (data['date_grant_identify_id']) {
          this.masterProfile.doi_personal_id_number = data['date_grant_identify_id']
        }
        if (data['academy_level']) {
          this.masterProfile.college = data['academy_level']
        }
        if (data['type_marriage_name']) {
          switch (data['type_marriage_name']) {
            case 'Độc thân':
              this.masterProfile.marital_status = 'single'
              break
            case 'Đã kết hôn':
              this.masterProfile.marital_status = 'married'
          }
        }
        sessionStorage.removeItem('candidate')
      }
    },

    getProfile (profileId) {
      this.$startLoading()
      this.isLoading = true
      // load profile to edit
      let dataRequest = {
        master_id: profileId || this.id || +this.$route.params.id
      }
      staffService.getProfile(dataRequest).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.notInArea = null
            let data = response.data.data
            this.masterProfile = data.detail || {}
            this.masterProfile.is_virtual = parseInt(this.masterProfile.is_virtual)
            if (data.contract) {
              if (data.contract.active) this.contract = data.contract.active || {}
              if (data.contract.draft) this.contractDraft = data.contract.draft || {}
            }
            if (this.masterProfile.id) {
              this.getOrderOfProfile(this.masterProfile.id)
              this.getLeave()
              this.getHouseholdMember(this.masterProfile.id)
              this.getGuardian(this.masterProfile.id)
              this.getVisitHomeInfo(this.masterProfile.id)
              this.$refs['list-children-form'].getChildrenInfo(this.masterProfile.id)
            }
            this.personal_id = this.masterProfile.personal_id_number
            this.profileDocuments = data.documents

            this.masterProfile.join_date = helper.checkValidDateFormat(this.masterProfile.join_date) ? this.masterProfile.join_date : ''
            this.masterProfile.trial_date = helper.checkValidDateFormat(this.masterProfile.trial_date) ? this.masterProfile.trial_date : ''
            this.masterProfile.contract_date = helper.checkValidDateFormat(this.masterProfile.contract_date) ? this.masterProfile.contract_date : ''

            let referencePeople = []
            try {
              referencePeople = JSON.parse(this.masterProfile.reference_people)
            } catch (e) {
              referencePeople = []
            }
            this.masterProfile.reference_people = Array.isArray(referencePeople) ? referencePeople : []

            this.listUsers = data.listUsers
            if (this.listUsers && this.listUsers.length > 0) {
              this.mainUser = this.listUsers.find(user => (+user.User.main_profile_id === +user.EmpProfile.id))
              if (this.mainUser.EmpPosition.id) {
                this.mainUser.EmpPosition.position_job = this.mainUser.EmpPosition.id
              }
            }

            if (this.masterProfile['resign_date'] || this.masterProfile['resign_type']) {
              this.resignObj = {
                'resign_date': this.masterProfile['resign_date'],
                'resign_type': this.masterProfile['resign_type'],
                'resign_reason': this.masterProfile['resign_reason'],
                'resign_detail': this.masterProfile['resign_detail'],
                'resign_fine': this.masterProfile['resign_fine'],
                'resign_editable': this.masterProfile['resign_editable'],
                'quit_work_type': this.masterProfile.resign_type ? 'resign' : 'pause'
              }
            }

            for (const val of this.options.ins_book_with_comp_options) {
              if (val.value === this.masterProfile.ins_book_with_comp) this.masterProfile.ins_book_with_comp = val
            }
            this.loadProfileOK = true
          } else {
            if (response.data.data) {
              this.notInArea = true
              this.briefProfile = response.data.data.profile
              this.teamHr = response.data.data.teamHr
            }
            helper.showMessage(response.data.message || 'Không lấy được thông tin Master Profile !', 'Lỗi')
          }
        } else {
          helper.showMessage(response.data.message || 'Có lỗi xảy ra, không load được thông tin Master Profile !', 'Lỗi')
        }
      }).catch(e => {
        this.notInArea = null
        this.masterProfile = null
        console.log(e)
      }).then(() => {
        this.isLoading = false
        this.$stopLoading()
      })
    },

    // Lấy đề xuất chưa hoàn thành
    getOrderOfProfile (profileId) {
      if (!profileId) return
      hrOrderService.getOrderOfProfile({ profile_id: profileId, status: ['cho_duyet', 'da_duyet_supervisor', 'da_duyet_leader', 'thieu_ho_so'] })
        .then(res => {
          if (res.data.success) {
            if (!helper.isEmpty(res.data.data)) {
              this.employeeOrder = res.data.data
              this.hasOrderReportEKYC = !helper.isEmpty(this.employeeOrder.working_process.user_info.modify_ekyc_info)
            }
          } else {
            console.log(res.data.message || 'getOrderOfProfile: Không thể lấy thông tin các đề xuất của nhân viên !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getLeave () {
      if (!this.masterProfile.id) return
      let dataRequest = {
        master_profile_id: this.masterProfile.id
      }
      userService.getLeaveUsers(dataRequest)
        .then(res => {
          if (res.data.success) this.userLeaves = res.data.data || []
          else helper.showMessage(res.data.message || 'Lấy quỹ phép thất bại !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Có lỗi khi lấy thong tin quỹ phép !', 'warning')
        })
    },

    updateLeave (idUpdate) {
      let objUpdate = this.userLeaves.find(obj => (+obj.id === +idUpdate))
      if (!objUpdate) return
      let dataUpdate = {
        mp_update: objUpdate.master_profile_id,
        leave_type: objUpdate.leave_type_id,
        descriptions: objUpdate.descriptions,
        new_leaveblance: objUpdate.value
      }
      this.$startLoading()
      userService.updateLeaveBlance(dataUpdate)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật quỹ phép thành công', 'success')
            this.allowEditLeave = false
          } else {
            helper.showMessage(res.data.message || 'không cập nhật được quỹ phép !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, không cập nhật được thông tin quỹ phép !', 'warning')
          console.log(e)
        })
        .finally(_ => this.$stopLoading())
    },

    scrollAndForcusFirstError () {
      const firstField = Object.keys(this.errors.collect())[0]
      let firstFieldElement = document.getElementsByName(firstField)[0] || null
      if (firstFieldElement) {
        firstFieldElement.focus()
        firstFieldElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'})
      }
    },

    checkSameCmnd () {
      if (this.masterProfile.is_virtual) {
        return this.editVirtualProfile()
      }
      this.isProcessingUpdate = true
      this.$startLoading()
      let dataSend = {
        personal_id_number: this.masterProfile['personal_id_number'],
        master_id: this.masterProfile['id'] || null
      }
      staffService.checkSameCmnd(dataSend).then(response => {
        if (response.data.checkMaster) {
          if (response.data.checkProfile) {
            if (this.isAdd) this.addProfile()
            if (this.isEdit) {
              this.$refs['list-children-form'].updateChildrenInfo(this.masterProfile.id)
              this.editProfile()
            }
          } else {
            if (confirm(response.data.message + '.Bỏ qua thông báo này và tiếp tục!')) {
              if (this.isAdd) this.addProfile()
              if (this.isEdit) {
                this.$refs['list-children-form'].updateChildrenInfo(this.masterProfile.id)
                this.editProfile()
              }
            }
          }
        } else {
          helper.showMessage(response.data.message, 'warning')
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.isProcessingUpdate = false
        this.$stopLoading()
      })
    },

    addProfile () {
      this.isProcessingUpdate = true
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$startLoading()
          let dataSend = this.masterProfile
          staffService.addProfile(dataSend).then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                helper.showMessage(response.data.message || 'Thêm Master Profile thành công', 'success')
                let masterId = response.data.data.id

                this.$router.push({ name: 'manager-master-profile', params: { id: masterId } })
              } else {
                helper.showMessage(response.data.message || 'Không thêm được Master Profile !', 'warning')
              }
            } else {
              helper.showMessage('Có lỗi xảy ra, không thêm được Master Profile !', 'warning')
            }
          }).catch(e => {
            console.log(e)
          }).then(() => {
            this.isProcessingUpdate = false
            this.$stopLoading()
          })
        } else {
          this.isProcessingUpdate = false
          this.scrollAndForcusFirstError()
          helper.showMessage('Vui lòng nhập đủ thông tin yêu cầu !', 'warning', 'Thiếu thông tin')
        }
      })
    },

    toggleExportAtmModal (value) {
      this.isShowAtmModal = value
    },

    showExportAtmModal (item) {
      this.dataMasterProfile = item
      this.toggleExportAtmModal(true)
    },

    editProfile () {
      if (this.masterProfile.is_virtual) {
        return this.editVirtualProfile()
      }
      // validate trường định vị nhà
      if (this.visitInfo && this.visitInfo.locate_guardian_house && this.visitInfo.locate_guardian_house.length > 0) {
        if (!this.checkValidLocateData(this.visitInfo.locate_guardian_house)) {
          return helper.showMessage('Sai định dạng trường: định vị nhà của NBL', 'warning')
        }
      }

      this.isProcessingUpdate = true
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$startLoading()
          let formData = helper.createFormData(this.masterProfile)
          helper.createFormData(this.guardian, formData, 'guardian')
          helper.createFormData(this.visitInfo, formData, 'visitInfo')

          staffService.editProfile(formData).then(response => {
            if (response.data.hasOwnProperty('success')) {
              if (response.data.success) {
                if (this.masterProfile.status === 'lock') {
                  this.getProfile()
                }
                this.getHouseholdMember(this.masterProfile.id)
                this.getVisitHomeInfo(this.masterProfile.id)
                helper.showMessage(response.data.message || 'Cập nhật Master Profile thành công', 'success')
              } else {
                helper.showMessage(response.data.message || 'Không cập nhật được Master Profile !', 'warning', 'Lỗi')
              }
            } else {
              helper.showMessage('Có lỗi xảy ra, không cập nhật được Master Profile !', 'warning', 'Lỗi')
            }
          }).catch(e => {
            console.log(e)
          }).then(() => {
            helper.cleanToast()
            this.isProcessingUpdate = false
            this.$stopLoading()
          })
        } else {
          this.isProcessingUpdate = false
          this.scrollAndForcusFirstError()
          helper.showMessage('Vui lòng nhập đủ thông tin yêu cầu !', 'warning', 'Thiếu thông tin')
        }
      })
    },

    editVirtualProfile () {
      this.isProcessingUpdate = true
      this.$startLoading()
      let dataUpdate = {
        id: this.masterProfile.id,
        fullname: this.masterProfile.fullname,
        tel: this.masterProfile.tel,
        join_date: moment(this.masterProfile.join_date).format('YYYY-MM-DD')
      }
      staffService.editVirtualProfile(dataUpdate).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            helper.showMessage(response.data.message || 'Cập nhật Master Profile thành công', 'success')
          } else {
            helper.showMessage(response.data.message || 'Không cập nhật được Master Profile !', 'warning', 'Lỗi')
          }
        } else {
          helper.showMessage('Có lỗi xảy ra, không cập nhật được Master Profile !', 'warning', 'Lỗi')
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        helper.cleanToast()
        this.isProcessingUpdate = false
        this.$stopLoading()
      })
    },

    checkValidLocateData (data) {
      if (data.length > 100 || data.length < 7) {
        return false
      }
      let arr = data.split('') || []
      let allowChar = ['', '.', ',']
      let isValid = true
      if (arr.length > 0) {
        for (let i in arr) {
          if (isNaN(+arr[i]) && !allowChar.includes(arr[i])) {
            isValid = false
            break
          }
        }
      }
      return isValid
    },

    getHouseholdMember (masterprofileId) {
      if (!masterprofileId) return
      this.$startLoading()
      staffInfoService.getHouseholdMember({master_profile_id: masterprofileId})
        .then(res => {
          if (res.data.success) {
            this.masterProfile.member_in_household = res.data.data || []
          } else helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin hộ khẩu !')
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    getGuardian (masterProfileId) {
      if (!masterProfileId) return
      this.$startLoading()
      staffInfoService.getGuardian({master_profile_id: masterProfileId})
        .then(res => {
          if (res.data.success) {
            if (!helper.isEmpty(res.data.data)) {
              if (!res.data.data.bltnds_reason) res.data.data.bltnds_reason = []
              this.guardian = res.data.data
            } else if (!helper.isEmpty(this.guardian)) helper.resetData(this.guardian)
            else this.guardian = {}
          } else helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin người bảo lãnh trách nhiệm dân sự !')
        })
        .catch(e => {
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    async getVisitHomeInfo (masterProfileId) {
      if (!masterProfileId) return
      const {data} = await staffInfoService.getVisitHomeInfo({master_profile_id: masterProfileId})
      if (data.success) {
        if (data.data) {
          this.visitInfo = {...this.visitInfo, ...data.data}
          this.visitInfo.file_visit_add.length = 0
          this.visitInfo.file_visit_delete.length = 0
        } else if (!helper.isEmpty(this.visitInfo)) helper.resetData(this.visitInfo)
        else this.visitInfo = {}
      } else helper.showMessage(data.message || 'Có lỗi khi lấy thông tin thăm nhà !')
    },

    confirmProfile () {
      let message = 'Bạn có chắc chắn xác nhận hồ sơ đã đầy đủ, chính xác?'
      if (!this.profileDocuments[0].value || !this.profileDocuments[1].value || !this.profileDocuments[1].value) {
        message = 'Hồ sơ chưa đầy đủ cả Sơ yếu lý lịch, CMND, Sổ hổ khẩu, bạn vẫn muốn xác nhận hồ sơ?'
      }
      if (!confirm(message)) {
        return
      }

      let dataSend = {
        master_id: this.$route.params.id,
        confirm_value: 1
      }
      profileService.confirmProfile(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            helper.showMessage(response.data.message || 'Xác nhận hồ sơ thành công', 'success')
            this.masterProfile.cnb_confirmed = 1
          } else {
            helper.showMessage(response.data.message || 'Có lỗi xảy ra, không xác nhận được hồ sơ !', 'warning')
          }
        } else {
          helper.showMessage(response.data.message || 'Có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
        }
      })
    },

    handleSelectedEthnic (option) {
      this.masterProfile.ethnic = option ? option.value : null
    },

    handleSelectedRegion (option) {
      this.masterProfile.region = option ? option.id : ''
    },

    handleSelectedCorporation (option) {
      this.masterProfile.company_id = option ? option.id : ''
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
      if (this.isAdd) {
        this.masterProfile.birthplace_province = this.masterProfile.birthplace_province || this.masterProfile.native_country_province
        this.masterProfile.resident_address_province = this.masterProfile.resident_address_province || this.masterProfile.native_country_province
      }
    },

    selectedNativeDistrict (option) {
      this.masterProfile.native_country_district = option ? option.id : ''
      if (this.isAdd) {
        if (this.masterProfile.birthplace_province === this.masterProfile.native_country_province) this.masterProfile.birthplace_district = this.masterProfile.birthplace_district || this.masterProfile.native_country_district
        if (this.masterProfile.resident_address_province === this.masterProfile.native_country_province) this.masterProfile.resident_address_district = this.masterProfile.resident_address_district || this.masterProfile.native_country_district
      }
    },

    selectedNativeSubDistrict (option) {
      this.masterProfile.native_country_sub_district = option ? option.id : ''
      if (this.isAdd) {
        if (this.masterProfile.native_country_district === this.masterProfile.birthplace_district) this.masterProfile.birthplace_sub_district = this.masterProfile.birthplace_sub_district || this.masterProfile.native_country_sub_district
        if (this.masterProfile.native_country_district === this.masterProfile.resident_address_district) this.masterProfile.resident_address_sub_district = this.masterProfile.resident_address_sub_district || this.masterProfile.native_country_sub_district
      }
    },

    selectedResidentProvince (option) {
      this.masterProfile.resident_address_province = option ? option.id : ''
      if (this.isAdd) {
        this.masterProfile.native_country_province = this.masterProfile.native_country_province || this.masterProfile.resident_address_province
        this.masterProfile.birthplace_province = this.masterProfile.birthplace_province || this.masterProfile.resident_address_province
      }
    },

    selectedResidentDistrict (option) {
      this.masterProfile.resident_address_district = option ? option.id : ''
      if (this.isAdd) {
        if (this.masterProfile.resident_address_province === this.masterProfile.native_country_province) this.masterProfile.native_country_district = this.masterProfile.native_country_district || this.masterProfile.resident_address_district
        if (this.masterProfile.resident_address_province === this.masterProfile.birthplace_province) this.masterProfile.birthplace_district = this.masterProfile.birthplace_district || this.masterProfile.resident_address_district
      }
    },

    selectedResidentSubDistrict (option) {
      this.masterProfile.resident_address_sub_district = option ? option.id : ''
      if (this.isAdd) {
        if (this.masterProfile.resident_address_district === this.masterProfile.native_country_district) this.masterProfile.native_country_sub_district = this.masterProfile.native_country_sub_district || this.masterProfile.resident_address_sub_district
        if (this.masterProfile.resident_address_district === this.masterProfile.birthplace_district) this.masterProfile.birthplace_sub_district = this.masterProfile.birthplace_sub_district || this.masterProfile.resident_address_sub_district
      }
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

    selectedPoiGuardian (op) {
      this.guardian.personal_id_place = op ? op.id : ''
    },

    handleSelectedDepartment (option) {
      this.mainUser.EmpPosition.department_id = option ? option.id : ''
    },

    handleSelectedPosition (option) {
      this.mainUser.EmpPosition.position_job = option ? option.id : ''
    },

    handleSelectedBank (option) {
      this.masterProfile.bank_name = option ? option.id : ''
    },

    handleSelectedBankBrand (option) {
      this.masterProfile.bank_brand = option ? option.id : ''
    },

    handleAddedUser (success) {
      if (success) {
        this.getProfile()
      }
    },

    searchProfile () {
      this.$startLoading()
      let dataSend = {
        keyword: this.keyword
      }
      profileService.searchProfile(dataSend).then(response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            let masterId = response.data.data.master_id
            this.$router.push({ name: 'edit-master-profile', params: { id: masterId } })
            setTimeout(() => {
              window.location.href = document.URL
            }, 500)
          } else {
            helper.showMessage('Không tìm thấy Master Profile !', 'warning')
          }
        } else {
          helper.showMessage('Có lỗi xảy ra, không tìm được Master Profile !', 'warning')
        }
      }).catch(e => {
        console.log(e)
      }).then(() => {
        this.$stopLoading()
      })
    },

    getBriefStatusName (briefStatus) {
      return MasterProfile.getBriefStatusName(briefStatus)
    },

    getBriefStatusClass (briefStatus) {
      return MasterProfile.getBriefStatusClass(briefStatus)
    },

    onChangeStatus () {
      if (this.masterProfile.status === MasterProfile.DISABLE_STATUS) {
        helper.showMessage('Các tài khoản liên kết sẽ bị khóa khi khóa tài khoản master profile !', 'warning', 'Cảnh báo', 6000)
      }
    },

    addMember () {
      this.masterProfile.member_in_household.push({
        relation: '',
        fullname: '',
        birthday: '',
        gender: '',
        personal_id: '',
        phone: ''
      })
    },

    removeMember (index) {
      this.masterProfile.member_in_household.splice(index, 1)
    },

    addReferencePeople () {
      this.masterProfile.reference_people.push({
        relation: '',
        name: '',
        birthday: '',
        gender: '',
        personal_id_number: '',
        mobile: ''
      })
    },

    removeReferencePeople (index) {
      this.masterProfile.reference_people.splice(index, 1)
    },

    showNotifyResign (option) {
      helper.showMessage(option.message, 'success')
    },

    showModalHistory () {
      this.$refs['modal-log'].show()
    },

    verifiedProfile (status) {
      if (!status) return
      if (status === 'disable' && !this.reason_reject_profile) {
        alert('Bạn cần nhập lý do từ chối ứng viên này !')
        return
      }
      let params = {
        profile_id: this.masterProfile.id,
        status: status,
        note: this.reason_reject_profile,
        source: 'web'
      }
      this.checkAction = true
      this.$startLoading()
      profileService.verifiedProfile(params)
        .then(res => {
          if (res.data.success) {
            this.masterProfile.status = status
            if (status === 'active') this.mainUser.User.status_id = 3
            if (status === 'disable') {
              this.mainUser.User.status_id = 2
              this.$bvModal.hide('modal-reason-reject-profile')
            }
            helper.showMessage(res.data.message || 'Duyệt hồ sơ thành công', 'success')
          } else helper.showMessage(res.data.message || 'Không thể duyệt hồ sơ, vui lòng thử lại sau !', 'warning')
        })
        .catch(e => {
          console.log(e)
          helper.showMessage('Không thể duyệt hồ sơ, vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.checkAction = false
          this.$stopLoading()
        })
    },

    genCodeOrder (id, prefix = 'BH', postfix = '', codeLength = 6) {
      return helper.genCode(id, prefix, postfix, codeLength)
    },

    inprocessOrder (status) {
      if (!status) return false
      return ['cho_duyet', 'da_duyet_supervisor', 'da_duyet_leader', 'thieu_ho_so'].includes(status)
    },

    // auto tạo đề xuất HDED cho COD mọi vị trí,
    // Nhân viên xử lý hàng, nhân viên xử lý hàng onsite,trưởng nhóm xử lý hàng, Khai thác hàng sân bay, trưởng nhóm khai thác hàng sân bay, phụ xe BBS
    autoCreateContract (userId) {
      if (!this.masterProfile.id || !this.mainUser.User.id) return

      // Khởi tạo data cho đề xuất hợp đồng dịch vụ
      let dataOrderContract = {
        profile_id: this.masterProfile.id,
        user_id: this.mainUser.User.id,
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
            this.getOrderOfProfile(dataOrderContract.profile_id)
          } else {
            console.log('Không thể tự động tạo hợp đồng dịch vụ cho nhân viên, Lý do: ' + (res.data.message || ''))
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    showApproveButton () {
      if ([77, 10028, 18509, 9509, 10019, 17664, 307, 4470, 18180].includes(parseInt(this.mainUser.Station.id))) {
        return !([49, 65, 77, 132, 133, 134].includes(parseInt(this.mainUser.EmpPosition.position_job)) || parseInt(this.mainUser.EmpPosition.department_id) === 14)
      }

      return true
    },

    async rejectProfile (profile) {
      try {
        let startDate = profile.comeback_date ? profile.comeback_date : profile.join_date

        this.$startLoading()
        await userService.updatePauseWorkHistory({
          id: profile.id,
          type: 'normal_quit',
          quit_work_type: 'resign',
          resign_fine: 0,
          resign_type: 'nghi_dung_quy_trinh',
          startDate: moment(startDate).format('YYYY-MM-DD'),
          resign_reason: 'Từ chối nhận việc.',
          source: 'reject'
        })

        this.getProfile()
        helper.showMessage('Từ chối hồ sơ thành công.', 'success')
      } catch (e) {
        helper.showMessage('Có lỗi xảy ra, vui lòng thử lại sau.', 'warning')
      } finally {
        this.$stopLoading()
      }
    },

    getCommitProfiles (params) {
      this.$startLoading()
      profileService.getCommitProfiles(params)
        .then(res => {
          if (res.data.success) {
            this.responsibilityProfiles = res.data.data.responsibilityProfiles
            this.commitProfiles = res.data.data.commitProfiles
            this.storageHost = res.data.data.storageHost
          } else {
            // helper.showMessage(res.data.message || 'Không thể lấy hợp đồng điện tử !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Không thể lấy hợp đồng điện tử !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    async getDataCheckCreateCommitDraft (params) {
      this.$startLoading()
      try {
        const res = await profileService.getDataCheckCreateCommitDraft(params)
        if (res.data.success) {
          if (res.data.data) {
            if (res.data.data.active) {
              this.dataCommitmentActive = res.data.data.active
            }
            if (res.data.data.draft) {
              this.dataCommitmentDraft = res.data.data.draft
            }
          }
        } else {
          this.isCreateCommitDaft = false
          helper.showMessage(res.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } catch (e) {
        this.isCreateCommitDaft = false
        console.log(e)
        if (e.response && e.response.data && e.response.data.message) {
          helper.showMessage(e.response.data.message || 'Có lỗi xảy ra', 'warning')
        }
      } finally {
        this.$stopLoading()
      }
    },

    checkCanCreateDraft (userId) {
      let params = {
        user_id: userId
      }
      if (this.dataCommitmentActive && this.dataCommitmentActive.length > 0) {
        if (this.dataCommitmentActive[0]) {
          return helper.showMessage('Không thể tạo thêm bản nháp mới. ' + 'User ' + this.mainUser.User.username + ' đã tồn tại bản cam kết ' + this.dataCommitmentActive[0].name + ' đã ký.' || 'Không thể tạo thêm bản nháp mới. User đã tồn tại bản nháp Cam kết đã ký.', 'warning')
        }
      }

      if (this.dataCommitmentDraft && this.dataCommitmentDraft.length > 0) {
        if (this.dataCommitmentDraft[0]) {
          return helper.showMessage('Không thể tạo thêm bản nháp mới. ' + 'User ' + this.mainUser.User.username + ' đang tồn tại bản nháp ' + this.dataCommitmentDraft[0].name + ' chưa ký.' || 'Không thể tạo thêm bản nháp mới. User đang tồn tại bản nháp Cam kết chưa ký.', 'warning')
        }
      }

      this.createDraftCommit(params)
    },

    isResponsibilityType (type) {
      return type === 'asset_responsibility_file'
    },

    dateFormat (date) {
      if (date) {
        return moment(date).format('DD/MM/YYYY')
      }
      return null
    },

    commitProfileStatusFormat (status) {
      return status === 'active' ? 'Đã ký' : 'Chưa ký'
    },

    createDraftCommit (params) {
      this.$startLoading()
      profileService.createDraftCommit(params)
        .then(res => {
          if (res.data.success) {
            this.getCommitProfiles({master_profile_id: this.id})
          } else {
            helper.showMessage(res.data.message || 'Không thể tạo bản nháp, vui lòng thử lại sau !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Không thể tạo bản nháp, vui lòng thử lại sau !', 'warning')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    redirectTo (url) {
      window.location.href = url
    },
    toggleModalAddLogPauseWork (status) {
      this.openModalAddLogPauseWork = status
    },
    toggleModalPauseWork (status) {
      this.openModalPauseWork = status
    },
    reloadHistory () {
      this.reloadPauseWorkHistory = !this.reloadPauseWorkHistory
    }
  }
}
</script>
