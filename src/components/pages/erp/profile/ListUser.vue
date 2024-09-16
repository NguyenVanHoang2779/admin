<template>
    <div class="table-responsive">
        <table class="table table-hover table-sm m-0" aria-rowcount="100">
            <thead>
            <tr>
                <th aria-colindex="1">UserId</th>
                <th aria-colindex="2">username</th>
                <th aria-colindex="1">Mã COD</th>
                <th aria-colindex="4">Kho</th>
                <th aria-colindex="4">Bộ phận</th>
                <th aria-colindex="4">Vị trí</th>
                <th aria-colindex="4">Kiểu nhân viên</th>
                <th aria-colindex="4">Ngày lương chuẩn</th>
                <th aria-colindex="4">Tài khoản ảo</th>
                <th aria-colindex="4">Trạng thái</th>
                <th aria-colindex="4">Tài khoản chính</th>
                <th aria-colindex="4">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in listUsersData" :key="'user' + index" :title="+user.User.status_id !== 3 ? getReasonLock(index) : ''">
                <td>{{ user.User.id }}</td>
                <td>
                  <p  :class="codGroupIds.includes(parseInt(user.User.group_id)) ? 'text-success-hover text-underline-hover cursor-pointer' : ''"
                      class="member-info-item"
                      @click="gotoCodProfile(user.User.group_id, user.User.id)">
                    {{ user.User.username }}</p>
                  </td>
                <td>{{ user.Cod.alias }}</td>
                <td>{{ user.Station.name }}</td>
                <td>{{ user.EmpDepartment.name }}</td>
                <td>{{ user.EmpPosition.position_name }}</td>
                <td>{{ user.WorkType.work_type_description }}</td>
                <td>{{ convertTime(user.EmpProfile.start_date_day) }}</td>
                <td>
                    <b-checkbox
                      v-model="user.User.virtual_user"
                      value="1"
                      unchecked-value="0"
                      @input="changeVirtualUserStatus(index, ...arguments)"
                    >
                    </b-checkbox>
                </td>
                <td>
                    <b-form-select
                    v-model="user.User.status_id"
                    :options="statusOptions"
                    size="sm"
                    :disabled="+mainUserId === +user.User.id && permissions && !permissions.update_main_user_status"
                  ></b-form-select>
                </td>
                <td>
                    <b-form-radio
                    v-model="mainUserId"
                    name="mainUser"
                    :value="user.User.id"
                    :disabled="!permissions || !permissions.update_main_user"
                  ></b-form-radio>
                </td>
                <td>
                    <ladda-btn
                    :disabled="+mainUserId === +user.User.id && permissions && !permissions.update_main_user_status"
                    :loading="isUpdatingStatus[index]"
                    @click.native="updateStatus(index)"
                    data-style="zoom-out"
                    class="btn btn-outline-primary btn-sm"
                    >
                      Thay đổi trạng thái
                    </ladda-btn>
                    <router-link :to="{name: 'edit-user', params: { id: user.User.id }}" class="btn btn-outline-secondary btn-sm">
                      <i :class="+mainUserId !== +user.User.id ? 'ion ion-md-eye' : 'ion ion-md-create'"></i>
                    </router-link>
                </td>
            </tr>
            <tr>
                <td colspan="10">
                  <div v-if="showNoCheckinNote()" class="text-danger">
                    <i class="fas fa-info-circle"></i>
                    Tài khoản chính
                    <b> {{statusOptions[listUsersData[mainUserIndex].User.status_id]}}</b>
                    do nhân viên
                    <b> {{listUsersData[mainUserIndex].EmpProfile.lock_reason}}</b>
                    từ ngày
                    <b> {{convertTime(listUsersData[mainUserIndex].EmpProfile.no_checkin_from)}}</b>
                  </div>
                </td>
                <td>
                    <button
                      v-if="permissions && permissions.update_main_user"
                      class="btn btn-outline-success btn-sm"
                      @click="updateMainUser"
                    >Cập nhật tài khoản chính</button>
                </td>
                <td class=""></td>
            </tr>
            </tbody>
        </table>
        <b-modal static id="confirm-change-main-user" size="md" title="Thông báo" @hide="hideModalConfirmMainUser()">
          <div v-show="!!(listUsersData[mainUserIndex] && listUsersData[mainUserIndex].User.username)">
            <div>Việc chuyển user chính từ <b>{{ listUsersData[mainUserIndex].User.username }}</b> sang <b>{{ listUsersData[userIdxUpdate] && listUsersData[userIdxUpdate].User.username || '' }}</b> sẽ chuyển:</div>
            <div v-if="!!(listUsersData[mainUserIndex].EmpContract && listUsersData[mainUserIndex].EmpContract.id)" class="font-weight-bold">
              - Hợp đồng {{ typeContract[listUsersData[mainUserIndex].EmpContract.type_contract] || '' }}
            </div>
            <div class="font-weight-bold">- Quỹ phép</div>
            của user <b>{{ listUsersData[mainUserIndex].User.username }}</b> sang cho user <b>{{ listUsersData[userIdxUpdate] && listUsersData[userIdxUpdate].User.username }}</b>
          </div>
          <div slot="modal-footer" class="text-center w-100 font-weight-bold">
            <b-btn variant="outline-success" @click="updateMainUser(false)"><i class="fas fa-retweet"></i> Chuyển tài khoản chính</b-btn>
            <b-btn variant="outline-danger" @click="hideModalConfirmMainUser()"><i class="fas fa-times"></i> Hủy</b-btn>
          </div>
        </b-modal>
    </div>
</template>

<style scoped>

</style>

<script>
import commonHelper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'
import userService from 'domain/services/user-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'

// entities
import Contract from 'domain/entities/Contract'
import User from 'domain/entities/User'
import ManageListCod from 'domain/entities/ManageListCod'

export default {
  name: 'master-profile-list-user',

  components: {
    LaddaBtn
  },

  props: {
    listUsers: {
      type: Array,
      required: true
    },
    resignInfo: {
      type: Object,
      default: () => ({
        resign_date: null,
        resign_reason: null
      })
    },
    permissions: {
      type: Object,
      default: _ => ({})
    }
  },

  data: () => ({
    statusOptions: User.statusOptions,
    listUsersData: [],
    isUpdatingStatus: [],
    mainUserId: null,
    mainUserIndex: null,
    updateMainUserOk: null,
    typeContract: Contract.typeOptions,
    userIdxUpdate: null,
    codGroupIds: ManageListCod.codGroupIds
  }),

  watch: {
    listUsers: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        this.listUsersData = JSON.parse(JSON.stringify(this.listUsers))
        this.listUsersData.forEach((user, index) => {
          if (user.User.main_profile_id === user.EmpProfile.id) {
            this.mainUserId = user.User.id
            this.mainUserIndex = index
          }
        })
        this.isUpdatingStatus = Array(this.listUsers.length).fill(true)
      }
    },

    mainUserId (newVal, oldVal) {
      if (newVal && !newVal !== +oldVal && +newVal !== +(this.listUsersData[this.mainUserIndex].User && this.listUsersData[this.mainUserIndex].User.id)) {
        this.$bvModal.show('confirm-change-main-user')
        this.userIdxUpdate = this.listUsersData.findIndex(user => (+user.User.id === +newVal))
      }
    }
  },

  methods: {
    showNoCheckinNote () {
      return this.listUsersData[this.mainUserIndex].EmpProfile.lock_reason && this.listUsersData[this.mainUserIndex].EmpProfile.no_checkin_from &&
          !this.resignInfo.resign_date && +this.listUsersData[this.mainUserIndex].User.status_id !== 3
    },

    gotoCodProfile (groupId, userId) {
      ManageListCod.redirectProfile(groupId, userId)
    },

    hideModalConfirmMainUser () {
      if (!this.updateMainUserOk) { // Rollback lại user chính nếu update không thành công
        this.mainUserId = this.listUsersData[this.mainUserIndex].User && this.listUsersData[this.mainUserIndex].User.id
      } else if (!isNaN(this.userIdxUpdate)) { // update lại thông tin user chính
        this.mainUserIndex = this.userIdxUpdate
        this.listUsersData[this.mainUserIndex].User.status_id = 3
        let mainProfileId = this.listUsersData[this.mainUserIndex].EmpProfile.id
        for (let idx in this.listUsersData) {
          this.listUsersData[idx].User.main_profile_id = mainProfileId
        }
      }
      this.updateMainUserOk = null
      this.userIdxUpdate = null
      this.$bvModal.hide('confirm-change-main-user')
    },

    updateMainUser (showConfirm = true) {
      if (showConfirm && !confirm('Bạn có chắc chắn muốn cập nhật lại tài khoản chính không?')) {
        return false
      }

      let dataSend = {
        mainUserId: this.mainUserId
      }
      userService.updateMainUser(dataSend).then(response => {
        if (response.data.success) {
          this.updateMainUserOk = true
          commonHelper.showMessage(response.data.message || 'Cập nhật tài khoản chính thành công', 'success')
        } else {
          this.updateMainUserOk = null
          commonHelper.showMessage(response.data.message || 'Không cập nhật được tài khoản chính !', 'warning')
        }
      }).catch(e => {
        this.updateMainUserOk = null
        commonHelper.showMessage('Có lỗi xảy ra !', 'warning')
        console.log(e)
      }).then(_ => {
        this.hideModalConfirmMainUser()
      })
    },

    convertTime (time) {
      return time ? moment(time).format('DD-MM-YYYY') : ''
    },

    updateStatus (userIdx) {
      if (!this.listUsersData[userIdx] || !this.listUsersData[userIdx].User || !this.listUsersData[userIdx].User.id) {
        commonHelper.showMessage('Có lỗi xảy ra, không tìm được thông tin User !', 'warning')
        return false
      }
      if (confirm(`Bạn có muốn chuyển trạng thái của tài khoản ${this.listUsersData[userIdx].User.username} ?`)) {
        this.isUpdatingStatus[userIdx] = true
        let statusId = this.listUsersData[userIdx].User.status_id
        let userId = this.listUsersData[userIdx].User.id

        userService.updateStatus(userId, statusId)
          .then(res => {
            if (res.data.success) {
              commonHelper.showMessage(res.data.message || 'Cập nhật trạng thái thành công', 'success')
            } else {
              commonHelper.showMessage(res.data.message || 'Không cập nhật được trạng thái !', 'warning')
            }
          }).catch(e => {
            console.log(e)
            commonHelper.showMessage('Có lỗi xảy ra trong quá trình cập nhật !', 'warning')
          }).then(_ => {
            setTimeout(_ => {
              this.isUpdatingStatus[userIdx] = false
            }, 800)
          })
      }
    },

    changeVirtualUserStatus (userIdx, status) {
      if (!this.listUsersData[userIdx] || !this.listUsersData[userIdx].User || !this.listUsersData[userIdx].User.id) {
        commonHelper.showMessage('Có lỗi xảy ra, không tìm được thông tin User !', 'warning')
        return false
      }

      let virtualUserStatus = status || this.listUsersData[userIdx].User.virtual_user
      let userId = this.listUsersData[userIdx].User.id

      this.$startLoading()
      userService.changeVirtualUserStatus(userId, virtualUserStatus)
        .then(response => {
          if (response.data.success) {
            commonHelper.showMessage(response.data.message || 'Cập nhật thành công', 'success')
          } else {
            commonHelper.showMessage(response.data.message || 'Cập nhật thất bại !', 'warning')
          }
        }).catch(e => {
          console.log(e)
          commonHelper.showMessage('Có lỗi xảy ra trong quá trình update !', 'warning')
        }).then(() => {
          this.$stopLoading()
        })
    },

    getReasonLock (indexUser) {
      let user = this.listUsersData[indexUser]
      if (user.User.status_id === 3) return ''
      let resignFrom = null
      let lockFrom = null
      let lockReason = null
      let lockBy = user.EmpProfile.lock_by ? ' (bởi ' + user.EmpProfile.lock_by + ')' : ''
      if (user.EmpProfile.no_checkin_from || this.resignInfo.resign_date) resignFrom = ' từ ngày ' + moment(user.EmpProfile.no_checkin_from || this.resignInfo.resign_date).format('DD-MM-YYYY')
      else resignFrom = ''
      if (user.EmpProfile.lock_from) lockFrom = ' từ ngày ' + moment(user.EmpProfile.lock_from).format('DD-MM-YYYY')
      else lockFrom = ''

      if (user.EmpProfile.lock_reason) lockReason = ' do nhân viên ' + user.EmpProfile.lock_reason

      if (lockReason) return this.statusOptions[user.User.status_id] + lockReason + resignFrom + lockBy
      return this.statusOptions[user.User.status_id] + lockFrom + lockBy
    }
  }
}
</script>
