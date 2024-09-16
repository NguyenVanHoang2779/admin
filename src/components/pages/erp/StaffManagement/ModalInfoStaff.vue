<template>
  <div>
    <b-modal
      size="lg"
      scrollable
      hide-footer
      title="THÔNG TIN NHÂN VIÊN"
      header-class="justify-content-center"
      centered
      class="custom-modal"
      id="modal-info-staff"
    >
      <div class="m-2" v-loading="isLoading">
        <div class="card" v-if="data.detail && mainUser.EmpPosition">
          <div class="mt-2 mb-2 mr-3 ml-3">
            <div class="d-flex justify-content-between m-1">
              <h3 class="card-title-info">Thông tin cá nhân</h3>
              <button class="btn btn-ghtk btn-sm" @click="openLink(`/adm/profile/staff/${user.id}`)">Xem chi tiết</button>
            </div>
            <div class="mt-3">
              <div class="row">
                <div class="col-3">
                  <img class="avatar mr-2" :src="data.detail.image_profile" alt="avatar">
                </div>
                <div class="col-3">
                  <p class="info-detail">Họ và tên</p>
                  <p class="text-wrap">{{ data.detail.fullname }}</p>
                  <p class="info-detail">Ngày vào</p>
                  <p class="text-wrap">{{ data.detail.join_date }}</p>
                </div>
                <div class="col-3">
                  <p class="info-detail">Vị trí</p>
                  <p class="text-wrap">{{ mainUser.EmpPosition.position_name }}</p>
                  <p class="info-detail">Ngày thử việc</p>
                  <p class="text-wrap">{{ data.detail.trial_date }}</p>
                </div>
                <div class="col-3">
                  <p class="info-detail">Chức vụ</p>
                  <p class="text-wrap">{{ data.detail.chuc_vu }}</p>
                  <p class="info-detail">Ngày chính thức</p>
                  <p class="text-wrap">{{ data.detail.contract_date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2">
          <div class="mt-2 mb-2 mr-3 ml-3">
            <h3 class="card-title-info">Thông tin hợp đồng</h3>
            <div class="info mt-4">
              <div class="d-flex justify-content-around">
                <div>
                  <p class="info-detail">Mã hợp đồng</p>
                  <p class="text-wrap">{{ contract.contract_number }}</p>
                </div>
                <div>
                  <p class="info-detail">Loại hợp đồng</p>
                  <p class="text-wrap">{{ getTypeContract(contract.type_contract) }}</p>
                </div>
                <div>
                  <p class="info-detail">Ngày ký</p>
                  <p class="text-wrap">{{ contract.contract_date }}</p>
                </div>
                <div>
                  <p class="info-detail">Ngày bắt đầu</p>
                  <p class="text-wrap">{{ contract.start_date }}</p>
                </div>
                <div>
                  <p class="info-detail">Ngày kết thúc</p>
                  <p class="text-wrap">{{ contract.end_date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-2">
          <div class="mt-2 mb-2 mr-3 ml-3">
            <h3 class="card-title-info">Thông tin quá trình công tác</h3>
            <div class="info mt-4 ml-3 mr-3">
              <p class="sub-title mt-0">Điều chuyển/Thuyên chuyển</p>
              <table class="w-100">
                <thead>
                <tr>
                  <th class="w-25">Ngày hiệu lực</th>
                  <th class="w-25">Phân loại</th>
                  <th class="w-25">Thay đổi từ</th>
                  <th class="w-25">Thay đổi thành</th>
                </tr>
                </thead>
                <tbody  v-if="userWorkHistory && userWorkHistory.length > 0">
                <tr v-for="(history, index) in userWorkHistory" :key="index">
                  <td>{{ history.ErpWorkHistory.start_date | formatDate }}</td>
                  <td>{{ history.ErpWorkHistory.type | showType }}</td>
                  <td>{{ history.ErpWorkHistory.from_text }}</td>
                  <td>{{ history.ErpWorkHistory.to_text }}</td>
                </tr>
                </tbody>
              </table>
              <div class="w-100" v-if="userWorkHistory && userWorkHistory.length < 1"><span>Hiện chưa có lịch sử công việc</span></div>
              <p class="sub-title mt-4">Bổ nhiệm/Giáng chức</p>
              <table class="w-100">
                <thead>
                <tr>
                  <th class="w-25">Ngày hiệu lực</th>
                  <th class="w-25">Phân loại</th>
                  <th class="w-25">Chức danh cũ</th>
                  <th class="w-25">Chức danh mới</th>
                </tr>
                </thead>
                <tbody v-if="promotionWorkHistory && promotionWorkHistory.length > 0">
                <tr v-for="(history, index) in promotionWorkHistory" :key="index">
                  <td>{{ history.ErpWorkHistory.start_date | formatDate }}</td>
                  <td>{{ history.ErpWorkHistory.type | showType }}</td>
                  <td>{{ history.ErpWorkHistory.from_text }}</td>
                  <td>{{ history.ErpWorkHistory.to_text }}</td>
                </tr>
                </tbody>
              </table>
              <div class="w-100" v-if="promotionWorkHistory && promotionWorkHistory.length < 1"><span>Hiện chưa có lịch sử công việc</span></div>
              <p class="sub-title mt-4">Tạm dừng/Ngừng công tác</p>
              <table class="w-100">
                <thead>
                <tr>
                  <th class="w-25">Loại thay đổi</th>
                  <th class="w-25">Ngày bắt đầu</th>
                  <th class="w-25">Ngày kết thúc</th>
                  <th class="w-25">Lý do</th>
                </tr>
                </thead>
                <tbody v-if="pauseWorkDetail && pauseWorkDetail.length >0">
                <tr v-for="(history, index) in pauseWorkDetail" :key="index">
                  <td>{{ history.ErpPauseWorkHistory.type | typeToText }}</td>
                  <td>{{ history.ErpPauseWorkHistory.start_date | formatDate }}</td>
                  <td>{{ history.ErpPauseWorkHistory.end_date | formatDate }}</td>
                  <td>{{ history.ErpPauseWorkHistory.reason }}</td>
                </tr>
                </tbody>
              </table>
              <div class="w-100" v-if="pauseWorkDetail && pauseWorkDetail.length < 1"><span>Hiện chưa có lịch sử nghỉ việc</span></div>
            </div>
          </div>
        </div>
        <div class="card mt-2">
          <div class="mt-2 mb-2 mr-3 ml-3">
            <h3 class="card-title-info">Thông tin người tham chiếu</h3>
            <table class="mt-4 ml-3 w-100">
              <thead>
              <tr>
                <th class="w-20">Họ và tên</th>
                <th class="w-20">Mối quan hệ</th>
                <th class="w-20">Ngày sinh</th>
                <th class="w-20">CMND/CCCD</th>
                <th class="w-20">Số điện thoại</th>
              </tr>
              </thead>
              <tbody class="reference-people">
              <tr v-for="(reference, index) in referencePeople" :key="index">
                <td>{{ reference.name }}</td>
                <td>{{ reference.relation }}</td>
                <td>{{ commonHelpers.formatDate(reference.birthday) }}</td>
                <td>{{ reference.personal_id_number }}</td>
                <td>{{ reference.mobile }}</td>
              </tr>
              </tbody>
            </table>
            <div v-if="referencePeople && referencePeople.length < 1"><span>Chưa có thông tin người tham chiếu</span></div>
          </div>
        </div>
        <div class="mt-3" v-if="user">
          <button class="d-flex justify-content-between align-items-center list-action p-2 w-100 action-staff"
                  :disabled="user.status_id === 1"
                  :style="user.status_id === 1 ? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
                  @click="onOpenModal('openAcc')"
          >
            <span class="ml-3">Mở tài khoản</span><i class="fa fa-chevron-right icon-right mr-3" aria-hidden="true"></i>
          </button>
          <button class="d-flex justify-content-between align-items-center list-action p-2 w-100 action-staff"
                  :disabled="user.status_id === 1"
                  :style="user.status_id === 1 ? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
                  @click="onOpenModal('lockAcc')"
          >
            <span class="ml-3">Khóa tài khoản</span><i class="fa fa-chevron-right icon-right mr-3" aria-hidden="true"></i>
          </button>
          <button class="d-flex justify-content-between align-items-center list-action p-2 w-100 action-staff"
                  :disabled="user.status_id === 1"
                  :style="user.status_id === 1 ? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
                  @click="onOpenModal('changeLeader')"
          >
            <span class="ml-3">Sửa NQL</span><i class="fa fa-chevron-right icon-right mr-3" aria-hidden="true"></i>
          </button>
          <button class="d-flex justify-content-between align-items-center list-action p-2 w-100 action-staff"
                  :disabled="user.status_id === 1"
                  :style="(user.status_id === 1 || !checkManagerValid() || !checkValidJoinDateOrComebackDate())? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
                  @click="onOpenModal('evaluation')"
          >
            <span class="ml-3">Đánh giá</span><i class="fa fa-chevron-right icon-right mr-3" aria-hidden="true"></i>
          </button>
          <button class="d-flex justify-content-between align-items-center list-action p-2 w-100 action-staff"
                  @click="onOpenModal('note')"
          >
            <span class="ml-3">Ghi chú</span><i class="fa fa-chevron-right icon-right mr-3" aria-hidden="true"></i>
          </button>
          <button class="d-flex justify-content-between align-items-center list-action p-2 w-100 action-staff"
                  :disabled="user.status_id === 1"
                  :style="user.status_id === 1 ? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
                  @click="onOpenModal('setRemoteCheckin')"
                  v-if="user.has_remote_attendance"
          >
            <span class="ml-3">Config điểm danh từ xa</span><i class="fa fa-chevron-right icon-right mr-3" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<style lang="scss" scoped>
.reference-people {
  height: auto;
}
tbody {
  display:block;
  max-height: 120px;
  overflow:auto;
}
table {
  scrollbar-width: thin;
}
thead, tbody tr {
  display:table;
  width: 98%;
  table-layout:fixed;
}
thead {
  margin-bottom: 15px;
}
td {
  padding-top: 3px;
  padding-bottom: 12px;
}
thead {
  width: calc( 100% - 1em )
}
.card-title-info {
  font-size: 18px;
  font-weight: 600;
}
.info-detail {
  font-weight: bold;
}
.avatar {
  width: 120px;
  height: 150px;
}
.sub-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}
.icon-right {
  font-size: 12px;
  color: #606060;
}
.list-action {
  border-bottom: #DADADA 1px solid;
  cursor: pointer;
}
.list-action:hover {
  background-color: #ebebef;
}
.action-staff {
  background-color: #fff;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  color: #302e2e;
  outline: none;
}
</style>

<script>

// helper
import helper from 'infrastructures/helpers/common-helpers'
// service
import staffService from 'domain/services/staff-service'
import Contract from 'domain/entities/Contract'
import userService from 'domain/services/user-service'
import moment from 'moment/moment'
import {pausWorkOptions} from '../profile/PauseWorkConst'
import {mapGetters} from 'vuex'
import commonHelpers from '@/infrastructures/helpers/common-helpers'

export default {
  name: 'ModalInfoStaff',
  components: {
  },

  props: {
    user: {
      type: Object | null,
      default: null
    },
    uidComponentStaff: {
      type: Number | null,
      default: null
    }
  },

  data () {
    return {
      isLoading: false,
      data: {},
      mainUser: {},
      resetComponent: true,
      contract: {},
      userWorkHistory: [],
      promotionWorkHistory: [],
      pauseWorkDetail: [],
      referencePeople: []
    }
  },

  watch: {
    user () {
      this.getProfile()
    }
  },

  computed: {
    commonHelpers () {
      return commonHelpers
    },
    ...mapGetters({
      authUser: 'userInfo'
    })
  },

  methods: {
    getTypeContract (typeContract) {
      if (typeContract) {
        const contractType = Contract.getTypeOptions().filter(function (item) {
          return item.value === typeContract
        })
        return contractType[0].text || ''
      }
      return ''
    },

    // phải đi làm tối thiểu 10 ngày mới được đánh giá
    checkValidJoinDateOrComebackDate () {
      let dateCheck = this.user.master_profile.comeback_date === null ? this.user.master_profile.join_date : this.user.master_profile.comeback_date
      let now = new Date()
      return +helper.calDistanceDate(dateCheck, now) >= 10
    },

    // Chỉ quản lý trực tiếp mới được đánh giá
    checkManagerValid () {
      let arrManager = this.user.leaders.map(item => item.id)
      return !!arrManager.includes(+this.authUser.User.id)
    },

    getProfile () {
      this.$startLoading()
      this.isLoading = true
      staffService.getProfile({
        master_id: this.user.master_profile_id
      }).then(async response => {
        if (response.data.hasOwnProperty('success')) {
          if (response.data.success) {
            this.data = response.data.data
            if (this.data.listUsers && this.data.listUsers.length > 0) {
              this.mainUser = this.data.listUsers.find(user => (+user.User.main_profile_id === +user.EmpProfile.id))
              if (this.mainUser.EmpPosition.id) {
                this.mainUser.EmpPosition.position_job = this.mainUser.EmpPosition.id
              }
            }
            if (this.data.contract) {
              if (this.data.contract.active) this.contract = this.data.contract.active || {}
            }

            if (this.data.detail.reference_people) {
              this.referencePeople = JSON.parse(this.data.detail.reference_people)
            }

            await this.showDetail('transfer')
            await this.showDetail('promotion')
            await this.showPauseWorkDetail()

            this.resetComponent = false
            this.resetComponent = true
          } else {
            this.$bvModal.hide('modal-info-staff')
            helper.showMessage(response.data.message || 'Không lấy được thông tin Master Profile !', 'Lỗi')
          }
        } else {
          this.$bvModal.hide('modal-info-staff')
          helper.showMessage(response.data.message || 'Có lỗi xảy ra, không load được thông tin Master Profile !', 'Lỗi')
        }
      }).catch(e => {
        this.$bvModal.hide('modal-info-staff')
        console.log(e)
      }).then(() => {
        this.isLoading = false
        this.$stopLoading()
      })
    },

    async showPauseWorkDetail () {
      try {
        this.$startLoading()
        const {data} = await userService.getUserPauseWorkHistory({id: this.user.master_profile_id})
        if (!data.success) {
          helper.showMessage(data.message || 'Có lỗi xảy ra', 'warning')
          return
        }
        this.pauseWorkDetail = data.histories.filter(function (item) {
          return (item.ErpPauseWorkHistory.is_deleted === false)
        })
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },

    async showDetail (searchType = 'transfer') {
      try {
        this.$startLoading()
        const {data} = await userService.getUserWorkHistory({id: this.user.master_profile_id, type: searchType})
        if (!data.success) {
          helper.showMessage(data.message || 'Có lỗi xảy ra', 'warning')
          return
        }
        if (searchType === 'transfer') {
          this.userWorkHistory = data.histories
        } else if (searchType === 'promotion') {
          this.promotionWorkHistory = data.histories
        }
      } catch (e) {
        helper.showMessage(e.message, 'warning')
      } finally {
        this.$stopLoading()
      }
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    onOpenModal (action) {
      this.$emit('onOpenModalStaff', action)
    }
  },

  filters: {
    showType (type) {
      switch (type) {
        case 'station':
          return 'Kho'
        case 'department':
          return 'Bộ phận'
        case 'position':
          return 'Vị trí'
        case 'jobType':
          return 'Hình thức'
        case 'appoint':
          return 'Bổ nhiệm'
        case 'reduction':
          return 'Giáng chức'
        case 'disable_date':
          return 'Ngày tài khoản ngừng hoạt động'
        case 'ranking':
          return 'Cấp bậc nhân viên'
        case 'active_date':
          return 'Ngày tài khoản bắt đầu hoạt động'
        case 'manager_level':
          return 'Cấp bậc quản lý'
        default:
          return 'N/A'
      }
    },
    formatDate: function (date) {
      return date ? moment(date).format('DD-MM-YYYY') : 'N/A'
    },
    created: function (date) {
      return moment(date).format('DD-MM-YYYY H:mm:ss')
    },
    typeToText (v) {
      return pausWorkOptions.find((option) => option.value === v) ? (pausWorkOptions.find((option) => option.value === v).text || 'N/A') : 'N/A'
    }
  }
}
</script>

<style scoped>

</style>
