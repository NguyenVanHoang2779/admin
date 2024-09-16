<template>
  <div>
      <b-modal :id="id" title="Tạo tài khoản nhanh" @hide="resetData"  modal-class="modal-xl" static @shown="initData()" ok-only footer-class="justify-content-center">
        <div class="form-create-user">
          <b-alert :show="true" variant="warning" v-if="!createOk">
            <span v-if="candidate.master_profile_id || (candidate.resign_info && candidate.resign_info.master_profile_id)">
              <h6 class="mb-2">Lưu ý:</h6>
              Nhân viên này đã có
              <router-link class="link" :to="{name: 'edit-master-profile', params: { id: candidate.master_profile_id || candidate.resign_info.master_profile_id }}" target="_blank">Master Profile</router-link>
              . Việc tạo tài khoản nhanh sẽ tự động mở <b>Master Profile</b> về trạng thái <b>Đang làm việc</b><br />
              Tự động tạo <b>tài khoản {{ position_name }}</b> cho ứng viên
            </span>
            <span v-else>
              <h6 class="mb-2">Lưu ý:</h6>
              Việc tạo tài khoản nhanh sẽ tự động tạo <b>Master Profile</b> và <b>tài khoản {{ position_name }}</b> cho ứng viên
            </span>
          </b-alert>
          <b-alert v-else :show="true">
            <div>Đã tạo thành công tài khoản <b>{{ position_name }}</b> cho ứng viên <b>{{ candidate.name }}</b></div>
            <div>- Tên đăng nhập: <b>{{ username }}</b></div>
            <div>- Mật khẩu: <b>{{ password }}</b></div>
            <div>- Mã COD: <b>{{ codAlias }}</b></div>
            <b-btn size="sm" variant="info" @click="sendAcc" class="my-2" v-if="!sendSms"><i class="fas fa-paper-plan"></i> Gửi thông tin tài khoản tới ứng viên</b-btn>
            <div class="text-success mt-2"><i class="fas fa-info-circle"></i> Kiểm tra log của ứng viên để lấy <b>Username</b> và <b>Mật khẩu</b> nếu không nhớ</div>
          </b-alert>
          <b-form-row>
            <b-form-group label="Tên nhân viên" class="col-md-4">
              <b-input
                v-model="candidate.name"
                :disabled="true"
              ></b-input>
            </b-form-group>
            <b-form-group label="Số điện thoại" class="col-md-4">
              <b-input
                v-model="candidate.phone"
                :disabled="true"
              ></b-input>
            </b-form-group>
            <b-form-group label="CMND/CCCD" class="col-md-4">
              <input
                class="form-control"
                type="number"
                v-model="user.identify_id"
                :disabled="false"
                @input="validValue(user, 'identify_id', { length: 12 })"
              />
            </b-form-group>
          </b-form-row>
          <b-form-row>
            <b-form-group class="col-md-6"  label="Địa chỉ hiện tại">
              <b-textarea
                v-model="user.detail_now"
              ></b-textarea>
            </b-form-group>
            <b-form-group class="col-md-6" label="Địa chỉ thường trú">
              <b-textarea
                v-model="user.detail_resident"
              ></b-textarea>
            </b-form-group>
          </b-form-row>
          <div class="font-weight-bold working-header">THÔNG TIN CÔNG VIỆC</div>
          <b-form-row>
            <b-form-group class="col-md-4"  label="Chọn bộ phận">
              <single-select-department
                :is-disabled="true"
                @handleSelectedDepartment="op => (user.department_id = op ? op.id : null)"
                :department-id="user.department_id"
              >
              </single-select-department>
            </b-form-group>
            <b-form-group class="col-md-4" label="Chọn vị trí">
              <span slot="label">Chọn vị trí <span class="text-danger">(*)</span></span>
              <single-select-position
                :department-id="user.department_id"
                :is-disabled="false"
                @handleSelectedPosition="selectPosition"
                :position-job="user.position_job"
              >
              </single-select-position>
            </b-form-group>
            <b-form-group class="col-md-4"  label="Kiểu nhân viên">
              <span slot="label">Hình thức <span class="text-danger">(*)</span></span>
              <single-select-work-type
                @handleSelectedWorkType="op => (user.work_type_id = op ? op.id : null)"
                :position-job="user.position_job"
                :work-type-id="user.work_type_id"
              >
              </single-select-work-type>
            </b-form-group>
            <b-form-group class="col-md-4" label="Chọn kho">
              <span slot="label">Chọn nơi làm việc <span class="text-danger">(*)</span></span>
              <single-select-station
                custom-class=""
                @handleSelectedStation="op => (user.station_id = op ? op.id : null)"
                :station-id="user.station_id"
                selectLabel=""
                placeholder="Nơi làm việc"
              >
              </single-select-station>
            </b-form-group>
            <b-form-group class="col-md-4"  label="Chọn chức vụ">
              <span slot="label">Chọn chức vụ <span class="text-danger">(*)</span></span>
              <single-select-duty
                @handleSelected="op => (user.duty_id = op ? op.id : null)"
                :duty-id="user.duty_id"
                :is-disabled="true"
              >
              </single-select-duty>
            </b-form-group>
            <b-form-group class="col-md-4"  label="Ngày vào">
              <Datepicker
                v-model="user.take_job_date"
                format="dd-MM-yyyy"
                :bootstrapStyling="true"
                :monday-first="true"
                :full-month-name="true"
                placeholder="--/--/----"
                :calendar-button="true"
                calendar-button-icon="ion ion-md-calendar"
                :clear-button="true"
                :disabled-dates="{ to: expectJoinFrom(candidate.apply_date || candidate.created) }"
              />
            </b-form-group>
          </b-form-row>

          <div class="font-weight-bold working-header">HỒ SƠ</div>
          <file-candidate
            :file-exist="fileExist"
            :file-add="fileAdd"
            :edit="!createOk"
          ></file-candidate>
        </div>
        <div slot="modal-footer" class="w-100 text-center" v-if="!createOk">
          <b-btn variant="success" @click="createAcc" :disabled="disableCreateBtn">Tạo Tài khoản</b-btn>
          <b-btn variant="outline-danger" @click="$bvModal.hide(id)">  Hủy  </b-btn>
        </div>
      </b-modal>
  </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<style lang="css" scoped>
  .working-header {
    font-size: 1rem;
    border-bottom: 3px solid #ddd;
    margin: 0.5rem 0 1rem 0;
  }
  .vdp-datepicker .vdp-datepicker__calendar-button, .vdp-datepicker .vdp-datepicker__clear-button {
    z-index: 1 !important;
  }
</style>

<script>
// helper
import commonHelper from 'infrastructures/helpers/common-helpers'

// custom component
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectDuty from 'components/elements/common/SingleSelectDuty'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import Datepicker from 'vuejs-datepicker'
import FileCandidate from './FileCandidate'

// service
import profileService from 'domain/services/profile-service'
import candidateService from 'domain/services/candidate-service'

import { mapGetters } from 'vuex'

export default {
  name: 'modal-quick-create-user',

  components: {
    SingleSelectStation,
    SingleSelectWorkType,
    SingleSelectDepartment,
    SingleSelectDuty,
    SingleSelectPosition,
    FileViewUpload,
    Datepicker,
    FileCandidate
  },

  props: {
    id: {
      type: String,
      default: 'modal-quick-create-user'
    },
    candidate: {
      type: Object,
      default: _ => ({})
    }
  },

  data: _ => ({
    position_name: null,
    createOk: null,
    username: null,
    password: null,
    codAlias: null,
    sendSms: false,
    disableCreateBtn: false,
    fileAdd: {
      avatar_file: [],
      personal_id_file: [],
      curriculum_vitae_file: [],
      guarantee_file: [],
      contract_file: [],
      asset_responsibility_file: [],
      commitment_cheat_file: [],
      commitment_security_file: [],
      driver_license_file: []
    },
    fileExist: {
      avatar_file: [],
      personal_id_file: [],
      curriculum_vitae_file: [],
      guarantee_file: [],
      contract_file: [],
      asset_responsibility_file: [],
      commitment_cheat_file: [],
      commitment_security_file: [],
      driver_license_file: []
    },
    user: {
      candidate_id: null,
      station_id: null,
      department_id: 14,
      position_job: null,
      work_type_id: null,
      duty_id: 6,
      detail_now: null,
      detail_resident: null,
      identify_id: null,
      take_job_date: null
    }
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    })
  },

  watch: {
    candidate: {
      immediate: true,
      handler: function () {
        if (this.candidate) {
          this.user.identify_id = this.candidate.identify_id || null
          this.user.take_job_date = this.candidate.expected_join_date
        }
      },
      deep: true
    }
  },

  methods: {
    initData () {
      this.getFileCandidate()
      if (this.candidate) {
        this.user.identify_id = this.candidate.identify_id || null
        this.user.take_job_date = this.candidate.expected_join_date
      }
    },

    createAcc () {
      this.user.candidate_id = this.candidate.id
      let validData = this.validData()
      if (validData && typeof validData === 'string') {
        alert('Vui lòng nhập đúng và đầy đủ thông tin \n' + validData)
        return
      }
      if (validData === false) {
        alert('Vui lòng nhập đúng và đầy đủ thông tin !')
        return
      }
      this.$startLoading()
      let data = new FormData()
      for (const field in this.user) {
        if (field === 'take_job_date') {
          if (!this.user.take_job_date) data.append(field, '')
          if (this.user.take_job_date instanceof Date) data.append(field, this.user.take_job_date.toDateString())
          if (this.user.take_job_date instanceof String) data.append(field, this.user.take_job_date)
        }
        if (!this.user[field]) data.append(field, '')
        else data.append(field, this.user[field])
      }
      // Lấy file
      for (const fileType in this.fileAdd) {
        if (!this.fileAdd[fileType] || !Array.isArray(this.fileAdd[fileType]) || !this.fileAdd[fileType].length) continue
        for (const idx in this.fileAdd[fileType]) {
          if (this.fileAdd[fileType][idx]) data.append(fileType + '[' + idx + ']', this.fileAdd[fileType][idx])
        }
      }
      this.disableCreateBtn = true
      profileService.quickCreateUser(data)
        .then(res => {
          if (res.data.success) {
            this.createOk = true
            this.candidate.status = 'take_job'
            this.candidate.master_profile_id = res.data.data.master_profile_id || null
            this.username = res.data.data.username
            this.codAlias = res.data.data.cod_alias
            this.password = res.data.data.password
            this.candidate.identify_id = this.user.identify_id
            this.candidate.take_job_date = this.user.take_job_date
            if (!this.candidate.logs) this.candidate.logs = []
            this.candidate.logs.push(res.data.data.log_candidate)
            this.$emit('createUserSuccess')
            commonHelper.showMessage(res.data.message || 'Tạo tài khoản cho nhân viên thành công', 'success')
            this.getFileCandidate()
          } else {
            commonHelper.showMessage(res.data.message || 'Không thể tạo tài khoản cho nhân viên', 'warning')
            this.createOk = null
          }
        })
        .catch(e => {
          this.createOk = null
          commonHelper.showMessage('Có lỗi xảy ra, không thể tạo tài khoản !', 'warning')
        })
        .then(_ => {
          this.disableCreateBtn = false
          this.$stopLoading()
        })
    },

    validData () {
      let required = {
        candidate_id: 'Ứng viên',
        position_job: 'Vị trí làm việc',
        station_id: 'Kho làm việc',
        work_type_id: 'Kiểu nhân viên',
        identify_id: 'Số CMND/CCCD'
      }

      let fileRequired = {
        personal_id_file: 'File CMND/CCCD',
        curriculum_vitae_file: 'File sổ hộ khẩu',
        contract_file: 'File hợp đồng dịch vụ',
        asset_responsibility_file: 'File hợp đồng trách nhiệm vật chất',
        commitment_cheat_file: 'File cam kết không gian lận',
        commitment_security_file: 'File cam kết bảo mật thông tin'
        // avatar_file: 'Avatar',
        // guarantee_file: 'Giấy bảo lãnh trách nhiệm dân sự'
      }

      let messsage = ''

      for (const field in required) {
        if (!this.user[field] || !this.user[field].length) messsage += '- ' + required[field] + '\n'
      }
      if (this.user.identify_id && this.user.identify_id.length !== 9 && this.user.identify_id.length !== 12) {
        messsage += '- Số CMND/CCCD không hợp lệ\n'
      }

      for (const fileType in fileRequired) {
        if (
          (!this.fileExist[fileType] || !this.fileExist[fileType].length) &&
          (!this.fileAdd[fileType] || !this.fileAdd[fileType].length)
        ) messsage += '- ' + fileRequired[fileType] + '\n'
      }

      return messsage
    },

    getFileCandidate (candidateId) {
      if (!candidateId) candidateId = this.candidate.id || null
      if (!candidateId) return
      candidateService.getFileCandidate({ candidate_id: candidateId })
        .then(res => {
          if (res.data.success) {
            this.fileExist.avatar_file = res.data.data.avatar_file || []
            this.fileExist.personal_id_file = res.data.data.personal_id_file || []
            this.fileExist.curriculum_vitae_file = res.data.data.curriculum_vitae_file || []
            this.fileExist.guarantee_file = res.data.data.guarantee_file || []
            this.fileExist.contract_file = res.data.data.contract_file || []
            this.fileExist.asset_responsibility_file = res.data.data.asset_responsibility_file || []
            this.fileExist.commitment_cheat_file = res.data.data.commitment_cheat_file || []
            this.fileExist.commitment_security_file = res.data.data.commitment_security_file || []
          } else {
            commonHelper.showMessage(res.data.message || 'Không lấy được file hồ sơ ứng viên !', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, không lấy được file hồ sơ ứng viên !', 'warning')
        })
    },

    resetData () {
      this.user.candidate_id = null
      this.user.station_id = null
      this.user.departmnet_id = null
      this.user.position_job = null
      this.user.work_type_id = null
      this.user.detail_now = null
      this.user.detail_resident = null
      this.user.take_job_date = null
      this.user.identify_id = null
      this.fileExist.guarantee_file = []
      this.fileExist.asset_responsibility_file = []
      this.fileExist.commitment_cheat_file = []
      this.fileExist.commitment_security_file = []
      this.fileExist.avatar_file = []
      this.fileExist.personal_id_file = []
      this.fileExist.curriculum_vitae_file = []
      this.fileExist.contract_file = []
      this.fileAdd.guarantee_file.length = 0
      this.fileAdd.asset_responsibility_file.length = 0
      this.fileAdd.commitment_cheat_file.length = 0
      this.fileAdd.commitment_security_file.length = 0
      this.fileAdd.avatar_file.length = 0
      this.fileAdd.personal_id_file.length = 0
      this.fileAdd.curriculum_vitae_file.length = 0
      this.fileAdd.contract_file.length = 0
      this.createOk = null
      this.disableCreateBtn = null
      this.username = null
      this.password = null
      this.codAlias = null
    },

    selectPosition (op) {
      if (op) {
        this.user.position_job = op.id
        this.position_name = op.name
      } else {
        this.user.position_job = null
        this.position_name = null
      }
    },

    expectJoinFrom (applyDate) {
      if (!applyDate) return
      applyDate = new Date(applyDate)
      applyDate.setDate(applyDate.getDate() - 1)
      return applyDate
    },

    setTakeJobdate (date) {
      console.log(date)
      if (date instanceof Date) this.user.take_job_date = date.toDateString()
      if (date instanceof String) this.user.take_job_date = date
    },

    validValue (ref, field, option) {
      commonHelper.validValue(ref, field, option)
    },

    sendAcc () {
      if (!this.username || !this.password) {
        commonHelper.showMessage('Không tìm thấy tài khoản và mật khẩu cho ứng viên này !', 'warning')
        return
      }

      if (!confirm(`Bạn có chắc muốn gửi thông tin tài khoản cho ứng viên ${this.candidate.name} `)) return

      let data = new FormData()
      data.append('username', this.username)
      data.append('password', this.password)
      data.append('codAlias', this.codAlias)
      data.append('phone', this.candidate.phone)

      candidateService.sendSmsAccToEmployee(data)
        .then(res => {
          if (res.data.success) {
            this.sendSms = true
            commonHelper.showMessage('Gửi thông tin tài khoản đến ứng viên thành công', 'success')
          } else {
            commonHelper.showMessage(res.data.message || 'Không gửi được tin nhắn đến ứng viên !', 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
