<template>
    <b-modal scrollable id="modal-logs" size="lg" ref="modal-log" @hidden="$emit('close', false)"
    title="Lịch sử thay đổi tài khoản" static>
      <template slot="modal-title">
          <div>
            <span>Lịch sử thay đổi tài khoản</span>
            <span class="sub-modal-title" v-if="showLogType === 'old'" @click="showNewLogs">(Hiển thị logs mới)</span>
            <span class="sub-modal-title" v-else @click="getLogs">(Hiển thị logs cũ)</span>
          </div>
      </template>
    <div v-loading="loading">
      <section v-if="showLogType === 'old'">
        <div v-if="!logs.length">
          Không có lịch sử thay đổi tài khoản
        </div>
        <div class="scrollable strip">
            <div class="row" v-for="(log, index) in logs" :key="index" style="padding: 8px">
              <div class="col-4 text-center">
                  <router-link class="mt-2" :to="{name: 'edit-user', params: { id: log.created_user_id }}">{{ log.created_username }}</router-link> <br/>
                  {{ log.created }}
              </div>
              <div class="col-8">
                  <div v-for="(value, name) in log.data" :key="name">
                  <p v-if="name in logFieldLocale">
                      <template v-if="name === 'master_profile'">
                        Cập nhật master profile mới: <b><router-link :to="{name: 'edit-master-profile', params: { id: value.id }}">{{ value.fullname }}({{ value.staff_code}})</router-link></b>
                      </template>
                      <template v-else>
                      Cập nhật <b>"{{logFieldLocale[name]}}"</b> mới: <b>{{value}}</b>
                      </template>
                  </p>
                  </div>
              </div>
            </div>
        </div>
      </section>
      <section v-else>
          <div v-if="!newLogs.length">
            Không có lịch sử thay đổi tài khoản
          </div>
          <div class="scrollable strip">
            <div class="row" v-for="(log, index) in newLogs" :key="`log-${index}`" style="padding: 8px">
              <div class="col-4 text-center">
                {{ log.ErpProfileChangeLog.modifiedByName }}
              </div>
              <div class="col-8">
                Đã cập nhật từ <b>{{ log.ErpProfileChangeLog.old }}</b> thành <b>{{ log.ErpProfileChangeLog.new }}</b>
              </div>
            </div>
        </div>
      </section>
    </div>
    <div slot="modal-footer">
        <b-button
        variant="primary"
        @click="hideModal()"
        >
        Đóng
        </b-button>
    </div>
    </b-modal>
</template>

<style src="@/vendor/libs/spinkit/spinkit.scss" lang="scss"></style>
<style lang="scss" scoped>
    .scrollable {
      max-height: 600px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .strip>div:nth-child(odd){
      background: #f8f8f8;
    }
    .sub-modal-title {
      font-size: 14px;
      font-weight: normal;
      cursor: pointer;
      color: #0000EE;
    }
</style>

<script>
import userService from 'domain/services/user-service'
import moment from 'moment'

export default {
  name: 'modal-profile-log',

  components: {
  },

  props: [
    'profileId',
    'show'
  ],

  data: () => ({
    logFieldLocale: {
      'position_job_name': 'Vị trí làm việc',
      'ranking': 'Cấp bậc nhân viên',
      'manager_level': 'Cấp bậc quản lý',
      'start_date_day': 'Ngày lương chuẩn',
      'validate_tel': 'Xác minh số điện thoại',
      'group_name': 'Nhóm',
      'status_id': 'Trạng thái',
      'station_name': 'Kho',
      'module_name': 'Module tính lương',
      'virtual_user': 'Tài khoản ảo',
      'master_profile': 'Master Profile',
      'password': 'Mật khẩu',
      'active_date': 'Ngày tài khoản bắt đầu hoạt động',
      'disable_date': 'Ngày tài khoản ngừng hoạt động'
    },
    validateTels: {
      '1': 'Đã xác minh',
      '0': 'Chưa xác minh'
    },
    virtualUsers: {
      '0': 'Không phải là tài khoản ảo',
      '1': 'Là tài khoản ảo'
    },
    statusNames: {
      '1': 'Không hoạt động',
      '2': 'Bị khóa',
      '3': 'Đang hoạt động'
    },
    loading: true,
    logs: [],
    newLogs: [],
    showLogType: 'old'
  }),

  watch: {
    show: function (newVal, oldVal) {
      if (newVal) {
        this.getLogs(this.profileId)
        this.$refs['modal-log'].show()
      }
    }
  },

  methods: {
    hideModal () {
      this.$refs['modal-log'].hide()
    },

    formatDate (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },

    getLogs (profileId) {
      this.loading = true
      this.showLogType = 'old'
      let sendData = {
        profile_id: profileId
      }
      userService.getLogs(sendData)
        .then(response => {
          if (response.data.success) {
            this.logs = response.data.data
            this.formatData()
          }
        }).catch(e => {
          console.log(e)
        }).then(() => {
          this.loading = false
        })
    },

    formatData () {
      this.logs.forEach(log => {
        if (log.data.validate_tel) {
          log.data.validate_tel = this.validateTels['' + log.data.validate_tel]
        }
        if (log.data.virtual_user) {
          log.data.virtual_user = this.virtualUsers['' + log.data.virtual_user]
        }
        if (log.data.status_id) {
          log.data.status_id = this.statusNames['' + log.data.status_id]
        }
      })
    },
    showNewLogs () {
      this.showLogType = 'new'
      this.loading = true
      userService.getNewLogs(this.profileId)
        .then(response => {
          this.newLogs = response.data
        })
        .catch(e => console.log(e))
        .finally(_ => { this.loading = false })
    }
  }
}
</script>
