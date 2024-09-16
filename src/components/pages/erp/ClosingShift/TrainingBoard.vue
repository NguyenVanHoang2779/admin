<template>
  <div class="training-board-cfs">
    <table class="table-profile-list table" style="max-height: 75vh">
      <thead>
      <tr class="header-row">
        <th class="text-center profile-col">Học viên</th>
        <th class="text-center log-col">Chi tiết</th>
        <th class="text-center action-col">Giải trình</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, idxUser) in listUsers" :key="idxUser" class="table-profile-content">
        <td class="info-col-content">
          <div class="profile-info-wrap">
            <div class="profile-info-container">
              <div class="d-flex" style="flex: 1">
                <div class="image-user">
                  <img :src="user.profile_image" alt="">
                </div>
                <div class="profile-info">
                  <div>
                    <strong>{{user.fullname}} ({{ user.username }})</strong>
                  </div>
                  <div>
                    <span>{{user.position_name}} - {{user.station_name}}</span>
                  </div>
                  <div>
                    <strong>Thâm niên: </strong> <span>{{user.user_seniority}} ngày</span>
                  </div>
                </div>
              </div>
              <div class="profile-info-action">
                <div>
                  <b-btn
                    variant="outline-ghtk"
                    class="action-btn btn-pill btn-sm profile-info-action__btn"
                    name='profile-btn-view'
                    @click="handleButtonViewProfile(user.group_id, user.user_id, user.master_profile_id)"
                  >
                    Xem
                  </b-btn>
                </div>
                <div>
                  <b-btn
                    variant="outline-ghtk"
                    name='profile-btn-call'
                    @click="handleButtonCall(user.user_id)"
                    class="action-btn btn-pill btn-sm mt-2 profile-info-action__btn"
                  >
                    Gọi
                  </b-btn>
                </div>
              </div>
            </div>
            <div class="profile-tag">
              <div class="profile-tag-box">
                <div class="profile-tag-item">{{ user.tag_name }}</div>
              </div>
            </div>
          </div>
        </td>
        <td class="log-col-content">
          <div v-if="user.student_status === 'not_assigned' || user.tag_alias === 'pending'" class="cursor-pointer" @click="openSyllabusPage(user.tp_id)">
            <strong>Chương trình phải tham gia theo thâm niên: </strong>
            <span class="ghtk-color">{{user.tp_code}} - {{user.tp_content}} - {{user.total_periods}} buổi</span>
          </div>
          <div v-else @click="openClassPage(user.class_code)" class="cursor-pointer">
            <strong>Lớp học: </strong>
            <span class="ghtk-color">{{user.class_code}} - {{user.tp_content}} - {{user.total_periods}} buổi</span>
          </div>
          <div class="mt-2 mb-1">
            <b v-if="user.student_status === 'not_assigned' || user.tag_alias === 'pending'">Log giải trình</b>
            <b v-else>Log đào tạo</b>
          </div>
          <div class="training-board-cfs__log-details">
            <LogLine
              :logs="user.logs"
              class="ml-0 mb-1"
              :headStyle="{'width' : '0.44rem', 'height': '0.44rem', 'background-color': 'black', 'top': '0.4rem'}"
              :tailStyle="{'left': 'calc(0.42rem/2 - 1px)', 'height': 'calc(100% - 0.25rem)', 'top': '0.9rem'}"
            />
          </div>
        </td>
        <td class="text-center action-col-content">
          <SingleSelectExplanationReason :reason-id="user.explanation_reason_id" @handleSelected="handleSelectReason($event, idxUser)"></SingleSelectExplanationReason>
          <div v-if="user.showReasonDetail" class="mt-2 box-other-reason">
            <b-form-input class="box-other-reason__input" v-model="user.explanation_reason_detail" placeholder="Nhập lý do khác" @keyup.enter.native="submitExplanationReason(idxUser)"></b-form-input>
            <i style="font-size: 20px" class="icon ion-ios-send ghtk-color box-other-reason__btn-send" @click="submitExplanationReason(idxUser)"></i>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <b-modal :id="modalPhoneNumber" title="Gọi ứng viên" centered ref="phone-number" title-class="w-100" header-class="text-center" hide-footer size="sm">
      <div class="d-block text-start" v-loading="loadingModalPhoneNumber">
        <div><b>Họ tên:</b> {{userPhoneNumber.fullName}}</div>
        <div><b>Vị trí:</b> {{userPhoneNumber.positionName}}</div>
        <div><b>Số điện thoại:</b> {{userPhoneNumber.tel}}</div>
      </div>
      <div class="row mt-3">
        <div class="col text-center">
          <button class="btn btn-ghtk rounded text-white" @click="closeModalPhone()">Đóng</button>
        </div>
      </div>
    </b-modal>
    <infinite-loading spinner="spiral" @infinite="loadMore" ref="infiniteLoading" >
        <div slot="no-more" class="text-center">Đã đến cuối trang !</div>
        <div slot="no-results" class="text-center">Không có dữ liệu nào !</div>
    </infinite-loading>
  </div>
</template>

<script>
import trainingService from 'domain/services/training-service'
import userService from 'domain/services/user-service'
import ExplanationReason from 'domain/entities/ExplanationReason'
import ManageListCod from 'domain/entities/ManageListCod'
// helper
import helper from 'infrastructures/helpers/common-helpers'
// build-in Component
import InfiniteLoading from 'vue-infinite-loading'
import SingleSelectExplanationReason from 'components/elements/common/SingleSelectExplanationReason'
import LogLine from 'components/elements/logs/LogLine'

export default {
  name: 'training-board',
  components: {
    InfiniteLoading,
    SingleSelectExplanationReason,
    LogLine
  },
  props: {
    teamId: {
      default: null
    }
  },
  data () {
    return {
      listUsers: [],
      loading: false,
      page: 1,
      limit: 6,
      userPhoneNumber: {},
      modalPhoneNumber: 'modalTpShiftPhoneNumber',
      loadingModalPhoneNumber: false,
      teamIdData: null
    }
  },

  watch: {
    teamId (newVal) {
      if (newVal) {
        this.resetLoadData()
      }
    }
  },

  created () {
    this.resetLoadData()
  },

  methods: {
    resetLoadData () {
      this.listUsers = []
      this.page = 1
      this.getDataConfirmShift()
    },

    loadMore ($state) {
      if (this.page > 1) {
        if ($state) {
          this.stateLoad = $state
        }
        this.getDataConfirmShift()
      }
    },

    async getDataConfirmShift () {
      this.loading = true
      const params = {
        team_id: this.teamId,
        page: this.page,
        limit: this.limit
      }

      try {
        const { data } = await trainingService.getDataConfirmShift(params)
        if (data.success) {
          if (data.data.list.length) {
            for (let i = 0; i < data.data.list.length; i++) {
              data.data.list[i].showReasonDetail = parseInt(data.data.list[i].explanation_reason_id) === ExplanationReason.LY_DO_KHAC
            }
            this.listUsers = this.listUsers || []
            this.listUsers.push(...data.data.list)
            this.sortListUsers()
            this.page = this.page + 1
            if (this.stateLoad) {
              this.stateLoad.loaded()
            }
          } else {
            if (this.stateLoad) {
              this.stateLoad.complete()
            }
          }
        } else {
          helper.showMessage(data.message || 'Không thuộc vùng quản lý !', 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    sortListUsers () {
      let listExplained = []
      let listNotExplained = []
      for (let i = 0; i < this.listUsers.length; i++) {
        if (helper.isEmpty(this.listUsers[i].explanation_reason_id)) {
          listNotExplained.push(this.listUsers[i])
        } else {
          listExplained.push(this.listUsers[i])
        }
      }
      for (let i = 0; i < listExplained.length; i++) {
        listExplained[i].lastExplainedLog = this.getLastExplainedLog(listExplained[i].logs)
      }
      listExplained.sort((a, b) => {
        if (a.lastExplainedLog.created > b.lastExplainedLog.created) {
          return 1
        }
        if (a.lastExplainedLog.created < b.lastExplainedLog.created) {
          return -1
        }

        return 0
      })
      this.listUsers = listNotExplained.concat(listExplained)
    },

    getLastExplainedLog (logs) {
      if (helper.isEmpty(logs)) {
        return null
      }
      const totalLogs = logs.length
      let lastLog = null
      for (let i = 0; i < totalLogs; i++) {
        if (logs[i].action === 'explainLockShift' && (lastLog === null || lastLog.created < logs[i].created)) {
          lastLog = logs[i]
        }
      }
      return lastLog
    },

    handleButtonCall (userId) {
      if (userId) {
        let params = {
          user_id: userId,
          get_full_tel: true
        }
        this.getUserInfo(params)
        this.$bvModal.show(this.modalPhoneNumber)
      }
    },

    handleButtonViewProfile (groupId, userId, mpId) {
      ManageListCod.redirectProfile(groupId, userId, mpId)
    },

    handleSelectReason (option, idxUser) {
      let isSubmitExplanation = true
      if (!helper.isEmpty(option) && this.listUsers[idxUser].explanation_reason_id === option.id) {
        // Tránh lần đầu tự động submit giải trình
        isSubmitExplanation = false
      }
      this.listUsers[idxUser].explanation_reason_id = !helper.isEmpty(option) ? option.id : null
      if (option && parseInt(option.id) === ExplanationReason.LY_DO_KHAC) {
        this.listUsers[idxUser].showReasonDetail = true
      } else {
        this.listUsers[idxUser].showReasonDetail = false
        if (!helper.isEmpty(option) && isSubmitExplanation) {
          this.submitExplanationReason(idxUser)
        }
      }
    },

    async submitExplanationReason (idxUser) {
      let params = {
        'id': this.listUsers[idxUser].row_id,
        'reason_id': this.listUsers[idxUser].explanation_reason_id,
        'type': this.listUsers[idxUser].student_status,
        'reason_detail': this.listUsers[idxUser].explanation_reason_detail,
        'tag_alias': this.listUsers[idxUser].tag_alias
      }
      try {
        const { data } = await trainingService.explainLockShift(params)
        if (data.success) {
          helper.showMessage('Giải trình thành công', 'success')

          this.$emit('explain')
          // Bổ sung log mới nhất
          this.listUsers[idxUser].logs.push(data.data.log)
          // Sắp xếp lại bản ghi theo thứ tự giải trình
          this.sortListUsers()
        } else {
          helper.showMessage(data.message, 'warning')
        }
      } catch (e) {
        console.log(e)
      } finally {
      }
    },

    closeModalPhone () {
      this.userPhoneNumber = {}
      this.$bvModal.hide(this.modalPhoneNumber)
    },

    getUserInfo (params) {
      this.loadingModalPhoneNumber = true
      userService.getUserDetailInfo(params)
        .then(res => {
          if (res.data.success) {
            this.userPhoneNumber = res.data.userInfo
          } else {
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu người dùng!', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .finally(() => {
          this.loadingModalPhoneNumber = false
        })
    },

    openSyllabusPage (tpId) {
      const routeData = this.$router.resolve({name: 'syllabus-manager', query: {id: tpId}})
      window.open(routeData.href, '_blank')
    },

    openClassPage (classCode) {
      const routeData = this.$router.resolve({name: 'class-manager', query: {code: classCode}})
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
  .training-board-cfs {
    &__log-details {
      max-height: 65px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  }
  ::placeholder {
    color: #828282;
  }

  .action-btn {
    border-radius: 20px;
    text-align: center;
    .action-btn__explain {
      border: 1px solid #D40000;
      color: #D40000;
    }
    .action-btn__explain:hover {
      color: #FFFFFF;
    }
  }

  .profile-tag {
    margin: 5px;
    .profile-tag-box{
      background-color: #069255;
      color: #fff;
      text-align: center;
      display: inline-block;
      position: relative;
      margin: 5px;
      &:hover .profile-delete-tag{
        display: block;
      }
      .profile-tag-item{
        padding: 6px 18px;
        cursor: pointer;
      }
    }
    .profile-status-box{
      background-color: #ccc;
      color: #fff;
      text-align: center;
      display: inline-block;
      position: relative;
      margin: 5px;
      &:hover{
        background-color: #069255;
      }
      .profile-status-item{
        padding: 6px 10px;
        cursor: pointer;
        &.active{
          background-color: #069255;
        }
      }
    }
    .profile-delete-tag{
      display: none;
      position: absolute;
      top: -5px;
      right: -5px;
      color: #000;
      cursor: pointer;
    }
  }

  .tag-manage {
    font-size: 0.894rem;
    padding: 6px 18px;
    color: #069255;
    border: 0;
    background: none;
    &:focus{
      box-shadow: none
    }
    .focus{
      box-shadow: none
    }
  }

  .btn-filter-tag {
    margin: 5px;
  }

  .tag-filter {
    overflow-x: auto;
    display: flex;
  }

  .table-profile-content {
    .info-col-content .profile-info-wrap {
      display: block;
    }
  }

  .profile-info-container {
    width: 100%;
    display: flex;
  }

  .profile-info-action {
    width: 20%;
    text-align: right;
    .profile-info-action__btn {
      width: 50px;
    }
  }

  .profile-info {
    width: 82%;
  }

  .image-user {
    padding: 5px 5px 5px 5px;
    width: 66px;
    height: 66px;
  }

  .image-user img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .box-other-reason {
    position: relative;
    &__input {
      border-top: none;
      border-left: none;
      border-right: none;
      padding-right: 35px;
    }

    &__btn-send {
      position: absolute;
      top: 2px;
      right: 10px;
    }
  }

  .table-profile-list {
    min-height: 25vh;
    max-height: 75vh;
    overflow: auto;
    border: 1px solid #f1f1f2;
    background-color: #fff;
    thead {
      width: 100%;
      .header-row {
        .profile-col {
          width: 30%;
        }
        .log-col {
          width: 55%;
        }
        .action-col {
          width: 15%;
        }
        .profile-col, .log-col, .action-col {
          font-weight: bolder;
          height: 3rem;
          vertical-align: middle;
          background-color: #f7f7f7;
          border-top: 0;
        }
        th {
          position: sticky;
          z-index: 2;
          top: -2px;
        }
      }
    }

    td {
      border-bottom: none;
      border-right: 1px solid rgba(24, 28, 33, 0.06) !important;
    }
  }
</style>
