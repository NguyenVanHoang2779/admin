<template>
  <div class="small-scrollbar">
    <b-modal :id="id" title="Tạo tài khoản nhanh" @hide="resetData"  modal-class="modal-xl" static @shown="initData()" ok-only footer-class="justify-content-center" v-if="candidate">
      <div class="form-create-user">
        <b-alert :show="true" variant="warning" v-if="!createOk">
            <span v-if="hadProfile">
              <h6 class="mb-2">Lưu ý:</h6>
              Nhân viên này đã có
              <router-link class="link" :to="{name: 'edit-master-profile', params: { id: candidate.master_profile_id || candidate.resign_info.master_profile_id }}" target="_blank">Master Profile</router-link>
              . Việc tạo tài khoản nhanh sẽ tự động mở <b>Master Profile</b> về trạng thái
              <b>{{ isHr ? 'Đang làm việc' : 'Chờ nhận việc'}}</b><br />
              Mở <b>Tài khoản chính</b> về trạng thái <b>Đang hoạt động</b>
            </span>
          <span v-else>
              <h6 class="mb-2">Lưu ý:</h6>
              Việc tạo tài khoản nhanh sẽ tự động tạo <b>Master Profile</b> và <b>tài khoản {{ position_name }}</b> cho ứng viên
            </span>
        </b-alert>
        <b-alert v-else show>
          <div v-if="hadProfile && !password">
            <div>
              <router-link
                class="link"
                :to="{name: 'edit-master-profile', params: { id: candidate.master_profile_id || candidate.resign_info.master_profile_id }}"
                target="_blank"
              >
                Master Profile
              </router-link>
              đã được mở về trạng thái <b>Chờ nhận việc</b>
            </div>
            <div>
              Tài khoản chính
              <router-link
                class="link"
                :to="{name: 'edit-user', params: { id: userId }}"
                target="_blank"
              >
                {{ username }}
              </router-link>
              <span v-if="candidate.onboard_date && compareDate(candidate.onboard_date)"> sẽ được mở về trạng thái <b>Đang hoạt động</b> vào 0h ngày {{formatDate(candidate.onboard_date, 'DD-MM-YYYY')}}</span>
              <span v-else> đã được mở về trạng thái <b>Đang hoạt động</b></span>
            </div>
          </div>
          <div v-else>
            <div>Đã tạo thành công tài khoản cho ứng viên <b>{{ candidate.name }}</b></div>
            <div>- Tên đăng nhập: <b>{{ username }}</b></div>
            <div>- Mật khẩu: <b>{{ password }}</b></div>
            <div>- Mã COD: <b>{{ codAlias }}</b></div>
            <div class="text-success mt-2"><i class="fas fa-info-circle"></i> Kiểm tra log của ứng viên để lấy <b>Username</b> và <b>Mật khẩu</b> nếu không nhớ</div>
          </div>
        </b-alert>
        <b-form-row>
          <b-form-group label="Tên nhân viên" class="col-md-4">
            <b-input
              v-model="candidate.name"
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
              v-model="user.current_address"
            ></b-textarea>
          </b-form-group>
          <b-form-group class="col-md-6" label="Địa chỉ thường trú">
            <b-textarea
              v-model="user.permanent_address"
            ></b-textarea>
          </b-form-group>
        </b-form-row>
        <div>
          <!-- work info  -->
          <div class="font-weight-bold working-header">THÔNG TIN CÔNG VIỆC</div>
          <b-form-row>
            <b-form-group class="col-md-4 col-lg-3"  label="Chọn bộ phận">
              <single-select-department
                :is-disabled="false"
                @handleSelectedDepartment="op => (user.department_id = op ? op.id : null)"
                :department-id="user.department_id"
              >
              </single-select-department>
            </b-form-group>
            <b-form-group class="col-md-4 col-lg-3" label="Chọn vị trí">
              <span slot="label">Chọn vị trí <span class="text-danger">(*)</span></span>
              <single-select-position
                :department-id="user.department_id"
                :is-disabled="false"
                @handleSelectedPosition="selectPosition"
                :position-job="user.position_job"
              >
              </single-select-position>
            </b-form-group>
            <b-form-group class="col-md-4 col-lg-3"  label="Kiểu nhân viên">
              <span slot="label">Hình thức <span class="text-danger">(*)</span></span>
              <single-select-work-type
                @handleSelectedWorkType="op => (user.work_type_id = op ? op.id : null)"
                :position-job="user.position_job"
                :work-type-id="user.work_type_id"
              >
              </single-select-work-type>
            </b-form-group>
            <b-form-group class="col-md-4 col-lg-3" label="Chọn kho">
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
            <b-form-group label="Module tính lương" class="col-md-4 col-lg-3">
              <SelectModule
                custom-class=""
                @handleSelectedModule="selectModule"
                :station-id="user.station_id"
                :module-id="user.module_id"
                selectLabel=""
              />
            </b-form-group>
            <b-form-group class="col-md-4 col-lg-3"  label="Chọn chức vụ">
              <span slot="label">Chọn chức vụ <span class="text-danger">(*)</span></span>
              <single-select-duty
                @handleSelected="op => (user.duty_id = op ? op.id : null)"
                :duty-id="user.duty_id"
                :is-disabled="true"
              >
              </single-select-duty>
            </b-form-group>
            <b-form-group class="col-md-4 col-lg-3" label="Ngày vào">
              <Datepicker
                v-model="user.onboard_date"
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
            <b-form-group v-if="requiredShift || user.shift" class="col-md-4 col-lg-3">
              <span slot="label">Ca làm việc<span class="text-danger">(*)</span></span>
              <select-shift
                @select="handleSelectedShift"
              >
              </select-shift>
            </b-form-group>
          </b-form-row>
        </div>

        <!-- Cảnh báo gán quản lý, nhân viên -->
        <div class="seperate mb-3"></div>
        <b-form-row class="mb-2">
          <b-form-group class="col-md-12">
            <template slot="label">
              <div class="row">
                <div class="col-md-6">Thêm người quản lý <span class="text-danger" v-show="!hadProfile">(*)</span></div>
                <div class="col-md-6 text-right">
                  <button v-if="suggestLeaderEmployeeOK" class="btn btn-outline-danger btn-sm" @click="leaders = null, employees = null, suggestLeaderEmployeeOK = false">Xóa gợi ý</button>
                  <button v-else class="btn btn-outline-ghtk btn-sm" @click="suggestManagerEmployeeForUser()">Lấy gợi ý quản lý, nhân viên</button>
                </div>
              </div>
            </template>
            <SelectUser @onChange="selectedLeader" :users="leaders" />
          </b-form-group>
        </b-form-row>
      </div>
      <div slot="modal-footer" class="w-100 text-center" v-if="!createOk">
        <b-btn variant="outline-ghtk" @click="createAcc" :disabled="disableCreateBtn" id='driver-create-user-btn-create' name='driver-create-user-btn-create'>Tạo Tài khoản</b-btn>
        <b-btn variant="outline-danger" @click="$bvModal.hide(id)">Hủy</b-btn>
      </div>
      <div v-show="show_defaultwork">
        <b-form-group class="col-md-12 p-0" label="Công việc mặc định">
          <b-form-checkbox-group id="checkbox-default-work" v-model="default_work" name="select-default-work">
            <default-work-detail :config-default-work="default_work" @update-config="updateDefaultWorkConfig($event)" :is-onsite="is_onsite"></default-work-detail>
          </b-form-checkbox-group>
        </b-form-group>
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

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

// custom component
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import SingleSelectWorkType from 'components/elements/common/SingleSelectWorkType'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectDuty from 'components/elements/common/SingleSelectDuty'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import FileViewUpload from 'components/elements/common/FileViewUpload'
import Datepicker from 'vuejs-datepicker'
import FileCandidate from './FileCandidate'
import SelectUser from 'components/elements/common/MultiSelectUser'
import SelectModule from 'components/elements/common/SingleSelectModule'
import SingleSelectShift from 'components/elements/common/SingleSelectShift'
import DefaultWorkDetail from '../../profile/DefaultWorkDetail.vue'
import SelectShift from 'components/elements/common/SelectShift'
// service
import staffService from 'domain/services/staff-service'
import recruitmentService from 'domain/services/Erp/HrmUni/recruitment-service'

import { mapGetters } from 'vuex'
import moment from 'moment'
import userService from 'domain/services/user-service'

// entities
import User from 'domain/entities/User'
import departmentSuggestLeaderEmployee from '@/const/department'
import Group from 'domain/entities/Group'

Vue.use(VeeValidate)

export default {
  name: 'ModalCreateUser',

  components: {
    SingleSelectStation,
    SingleSelectWorkType,
    SingleSelectDepartment,
    SingleSelectDuty,
    SingleSelectPosition,
    SingleSelectShift,
    SelectShift,
    FileViewUpload,
    Datepicker,
    FileCandidate,
    SelectUser,
    SelectModule,
    DefaultWorkDetail
  },

  props: {
    id: {
      type: String,
      default: 'modal-quick-create-user'
    },
    candidate: {
      type: Object,
      default () {
        return {
          name: null
        }
      }
    },
    jobId: {
      type: String,
      default: ''
    },
    candidateJobId: {
      type: String,
      default: ''
    }
  },

  data: _ => ({
    position_name: null,
    createOk: null,
    userId: null,
    username: null,
    password: null,
    codAlias: null,
    disableCreateBtn: false,
    group_id_by_position: null,
    default_work: [],
    user: {
      candidate_id: null,
      station_id: null,
      department_id: 14,
      position_job: null,
      work_type_id: null,
      duty_id: 6,
      module_id: null,
      current_address: null,
      permanent_address: null,
      identify_id: null,
      onboard_date: null,
      group_id: null,
      shift: null
    },
    suggestLeaderEmployeeOK: false,
    leaders: null,
    employees: null,
    searchData: {
      selectLeader: [],
      selectEmployee: [],
      loadingSearch: false
    },
    oldProfile: {
      station_id: null,
      username: null,
      user_id: null,
      group_id: null,
      shift: {
        from: null,
        shiftInterval: null,
        to: null
      }
    },
    is_onsite: false,
    show_defaultwork: false,
    whStaffPositions: User.WH_STAFF_GROUPS
  }),
  computed: {
    ...mapGetters({
      curUser: 'userInfo'
    }),

    isHr () {
      return this.curUser && this.curUser.Group && [3, 15].includes(+this.curUser.Group.id)
    },

    hadProfile () {
      // return +this.candidate.master_profile_id || (this.candidate.resign_info && +this.candidate.resign_info.master_profile_id)
      return false
    },

    getStaffLeaderWatcher () {
      return this.user.department_id + '_' + this.user.position_job + '_' + this.user.station_id + '_' + this.user.module_id + '_' + this.user.duty_id
    },

    requiredShift () {
      return Group.checkGroupWHStaff(this.user.group_id)
    }
  },

  watch: {
    candidate: {
      immediate: true,
      handler: function () {
        if (this.candidate) {
          this.user.identify_id = this.candidate.identify_id || null
          this.user.onboard_date = this.candidate.expected_join_date
          this.user.permanent_address = this.candidate.address
        }
      },
      deep: true
    },

    user: {
      handler: function (newValue) {
        if (this.whStaffPositions.includes(parseInt(this.user.group_id)) && Number(this.user.position_job) !== User.WH_STAFF_BIG_SIZE_POSITIONS) {
          this.show_defaultwork = true
        } else {
          this.show_defaultwork = false
        }
        if (+this.user.position_job === +User.WH_STAFF_ONSITE_POSITIONS) {
          this.is_onsite = true
        } else {
          this.is_onsite = false
        }
      },
      deep: true
    },

    getStaffLeaderWatcher () {
      if (this.user.department_id && this.user.position_job && this.user.station_id && this.user.duty_id) {
        this.suggestManagerEmployeeForUser()
      }
    },

    hadProfile (newVal, oldval) {
      if (this.createOk) return
      helper.resetData(this.oldProfile, null, 2)
      if (newVal) this.getShiftByProfile()
    }
  },

  methods: {
    formatDateToString (date) {
      const year = date.toLocaleString('default', {year: 'numeric'})
      const month = date.toLocaleString('default', {month: '2-digit'})
      const day = date.toLocaleString('default', {day: '2-digit'})

      return [year, month, day].join('-')
    },

    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },
    compareDate (date1, date2) {
      if (!date2) date2 = new Date()
      date1 = new Date(date1)
      date2 = new Date(date2)
      return date1.getTime() > date2.getTime()
    },
    initData () {
      if (this.candidate) {
        this.user.identify_id = this.candidate.identify_id || null
        this.user.onboard_date = this.candidate.expected_join_date
      }
    },
    validate () {
      if (!this.user.position_job) {
        helper.showMessage('Vui lòng chọn vị trí')
        return false
      }

      if (!this.user.work_type_id) {
        helper.showMessage('Vui lòng chọn hình thức')
        return false
      }

      if (!this.user.station_id) {
        helper.showMessage('Vui lòng chọn nơi làm việc')
        return false
      }
      return true
    },

    async createAcc () {
      if (!this.validate()) return false
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
      let data = {}
      if (this.user.onboard_date) {
        data.onboard_date = this.formatDateToString(this.user.onboard_date)
      }
      if (this.requiredShift && this.user.shift) {
        data.from_shift = this.user.shift.from
        data.to_shift = this.user.shift.to
      }

      data.candidate_id = this.user.candidate_id ? this.user.candidate_id : null
      data.station_id = this.user.station_id ? this.user.station_id : null
      data.department_id = this.user.department_id ? this.user.department_id : null
      data.position_job = this.user.position_job ? this.user.position_job : null
      data.duty_id = this.user.duty_id ? this.user.duty_id : null
      data.module_id = this.user.module_id ? this.user.module_id : null
      data.current_address = this.user.current_address ? this.user.current_address : null
      data.permanent_address = this.user.permanent_address ? this.user.permanent_address : null
      data.identify_id = this.user.identify_id ? this.user.identify_id : null
      data.group_id = this.user.group_id ? this.user.group_id : null
      data.work_type_id = this.user.work_type_id ? this.user.work_type_id : null
      if (this.show_defaultwork) {
        data.default_work = this.default_work
      }

      let leaderIds = []
      leaderIds = this.searchData.selectLeader.map((leader) => {
        return leader.id
      }).join(',')
      data.leader_ids = leaderIds

      this.disableCreateBtn = true
      recruitmentService.createAccount(data, this.user.candidate_id)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Tạo tài khoản cho nhân viên thành công', 'success')
            this.createOk = true
            this.username = res.data.data.username
            this.password = res.data.data.password
            this.codAlias = res.data.data.cod_alias
          } else {
            helper.showMessage(res.data.message || 'Không thể tạo tài khoản cho nhân viên', 'warning')
            this.createOk = null
          }
        })
        .catch(e => {
          this.createOk = null
          helper.showMessage('Có lỗi xảy ra, không thể tạo tài khoản !', 'warning')
        })
        .finally(_ => {
          this.disableCreateBtn = false
          this.$stopLoading()
        })
    },

    validData () {
      if (this.show_defaultwork) {
        if (!this.default_work || helper.isEmpty(this.default_work)) {
          helper.showMessage('Vui lòng chọn công việc mặc định !', 'warning')
          return
        } else {
          return this.validateTimeConfig(this.default_work)
        }
      }

      if (this.requiredShift && (!this.user.shift || !this.user.shift.from)) {
        return '- Thiếu thông tin ca làm việc\n'
      }
      if (this.hadProfile) return
      let required = {
        candidate_id: 'Ứng viên',
        position_job: 'Vị trí làm việc',
        station_id: 'Kho làm việc',
        work_type_id: 'Kiểu nhân viên',
        identify_id: 'Số CMND/CCCD'
      }

      let messsage = ''

      for (const field in required) {
        if (!this.user[field]) messsage += '- ' + required[field] + '\n'
      }
      if (this.user.identify_id && this.user.identify_id.length !== 9 && this.user.identify_id.length !== 12) {
        messsage += '- Số CMND/CCCD không hợp lệ\n'
      }

      if (!this.searchData.selectLeader || !Array.isArray(this.searchData.selectLeader) || !this.searchData.selectLeader.length) {
        return '- Người quản lý\n'
      }

      return messsage
    },

    resetData () {
      if (this.createOk) {
        this.$emit('createUserSuccess')
      }
      this.user.candidate_id = null
      this.user.station_id = null
      this.user.departmnet_id = null
      this.user.position_job = null
      this.user.work_type_id = null
      this.user.current_address = null
      this.user.permanent_address = null
      this.user.onboard_date = null
      this.user.identify_id = null
      this.user.shift = null
      this.createOk = null
      this.disableCreateBtn = null
      this.username = null
      this.userId = null
      this.password = null
      this.codAlias = null
      this.leaders = null
      this.employees = null
    },

    selectPosition (op) {
      if (op) {
        this.user.position_job = op.id
        this.position_name = op.name
        this.user.group_id = op.group_id
      } else {
        this.user.position_job = null
        this.position_name = null
        this.user.group_id = null
      }
    },

    handleSelectedShift (option) {
      this.user.shift = option
    },

    expectJoinFrom (applyDate) {
      if (!applyDate) return
      applyDate = new Date(applyDate)
      applyDate.setDate(applyDate.getDate() - 1)
      return applyDate
    },

    setTakeJobdate (date) {
      if (date instanceof Date) this.user.onboard_date = date.toDateString()
      if (date instanceof String) this.user.onboard_date = date
    },

    selectModule (op) {
      this.user.module_id = op ? op.id : null
    },

    validValue (ref, field, option) {
      helper.validValue(ref, field, option)
    },

    selectedLeader (option) {
      this.searchData.selectLeader = option
    },

    selectedEmployee (option) {
      this.searchData.selectEmployee = option
    },

    // Lấy leader gợi ý khi tạo mới user
    suggestManagerEmployeeForUser () {
      this.$startLoading()
      let data = {
        user_id: this.user.id,
        station_id: this.user.station_id,
        module_id: this.user.module_id,
        department_id: this.user.department_id,
        position_id: this.user.position_job,
        duty_id: this.user.duty_id,
        work_type_id: this.user.work_type_id
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

    getShiftByProfile (mpId = null) {
      if (!mpId) mpId = this.candidate.master_profile_id
      if (!mpId) return
      staffService.getShiftByProfile({masterProfileId: mpId})
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              this.oldProfile.group_id = res.data.data.group_id || null
              this.oldProfile.user_id = res.data.data.id || null
              this.oldProfile.station_id = res.data.data.station_id || null
              this.oldProfile.username = res.data.data.username || null
              if (res.data.data.shift) this.oldProfile.shift = res.data.data.shift
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    // update quản lý, nhân viên cho User
    updateManagerEmployeeOfUser (showSuccess = false) {
      let leaders = []
      let employees = []
      if (Array.isArray(this.searchData.selectLeader)) leaders = this.searchData.selectLeader.map(leader => (leader.id))
      if (Array.isArray(this.searchData.selectEmployee)) employees = this.searchData.selectEmployee.map(employee => (employee.id))

      let data = {
        userId: this.userId,
        leaders: leaders,
        employees: employees
      }

      if (leaders && leaders.length) {
        if (!data.userId) {
          helper.showMessage('Không có User ID, không thể cập nhật quản lý, nhân viên cho user !', 'warning')
          return
        }
      }

      staffService.updateManagerEmployeeOfUser(data)
        .then(res => {
          if (res.data.success) {
            if (showSuccess) helper.showMessage(res.data.message || 'Cập nhật quản lý và nhân viên cho User thành công.', 'success')
          } else {
            if (res.data.err_type === 'permission') {
              helper.showMessage('Bạn không có quyền cập nhật quản lý và nhân viên cho User !', 'warning')
            } else helper.showMessage(res.data.message || 'Không thể cập nhật quản lý và nhân viên cho User !', 'warning')
          }
        })
        .catch((e) => {
          console.log(e)
          helper.showMessage('Không thể cập nhật quản lý và nhân viên cho User !', 'warning')
        })
    },
    updateDefaultWorkConfig (data) {
      this.default_work = data
    },
    validateTimeConfig (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === undefined) {
          continue
        }
        if (moment(data[i].to_date).format('YYYY-MM-DD') < moment(data[i].from_date).format('YYYY-MM-DD')) {
          helper.showMessage('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', 'warning')
          return false
        }
        if (helper.isEmpty(data[i].alias_job)) {
          helper.showMessage('Vui lòng chọn công việc mặc định !', 'warning')
          return false
        }
        if (data[i + 1] !== undefined && moment(data[i].to_date).format('YYYY-MM-DD') >= moment(data[i + 1].from_date).format('YYYY-MM-DD')) {
          helper.showMessage('Thời gian config công việc mặc định không hợp lệ. Thời gian config sau không được đè lên thời gian config trước', 'warning')
          return false
        }
      }

      return true
    },
    created () {
      this.default_work = [
        {
          from_date: moment().format('YYYY-MM-DD'),
          to_date: null,
          alias_job: []
        }
      ]
    }
  }
}
</script>
