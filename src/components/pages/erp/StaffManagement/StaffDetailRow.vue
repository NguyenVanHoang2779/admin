<template>
  <tr class="education-row" ref="infoBox">
    <td class="leftTd">
      <div class="leftContent">
        <!--          info user-->
        <div class="row infoUser">
          <div class="">
            <img :src="infoEmployee.master_profile.image_profile || infoEmployee.link_avatar" alt="">
          </div>
          <div class="description col-8 p-1">
            <div class="d-flex justify-content-between" style="margin-bottom: 5px !important;">
              <span>
                <b style="text-transform: capitalize">
                  {{ infoEmployee.fullname.toLowerCase() }} ({{ infoEmployee.username}})
                </b>
              </span>
            </div>
            <div>
              <span>{{ infoEmployee.position.position_name }} - {{ convertNameStation(infoEmployee.station.name) }}</span>
            </div>
          </div>
          <div class="popupView col-2 pl-0">
            <!--          popup xem, gọi -->
            <button
              class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset"
              @click="viewDetail">Xem</button>

            <button
              class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset"
              @click="onOpenModal('callModal', infoEmployee, {title: 'Gọi học viên'})">Gọi</button>

          </div>
        </div>
        <div class="class-log-document">
          <!--          Ngày vào-->
          <b class="b-info-cus">Ngày vào: </b><span>{{infoEmployee.master_profile.comeback_date === null ? formatDate(infoEmployee.master_profile.join_date) : formatDate(infoEmployee.master_profile.comeback_date)}}</span>
        </div>
        <div class="class-log-document">
          <!--          Quản lý-->
          <b class="b-info-cus">Quản lý: </b>
          <span
            v-for="(leader, index) in infoEmployee.leaders" :key="index"
            class="text-capitalize"
          >{{ (index > 0 ? ', ' : '') + leader.fullname.toLowerCase() }}</span>
        </div>
        <div class="class-log-document">
          <!--          Tài khoản-->
          <b class="b-info-cus">Tài khoản: </b>
          <div>
            <ul class="log-timeline content-detail-log p-0 ul-cus">
              <li class="log-timeline-item" v-for="(account, idx) in listAccount" :key="idx">
                <div class="log-timeline-item-head"
                     :style="account.status_id !== 3 ? ' background-color: #FD0101 !important;' : ' background-color: #00904A !important;'"></div>
                <div class="log-timeline-item-content">
                  <span>{{ account.username }} - {{account.station.name}} - {{ account.position.position_name}} </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div style="margin-top: -1.2rem!important;">
          <!-- Trạng thái làm việc -->
          <div class="btn-tags mb-2">
              <div class="d-inline-block mr-2 pr-2 pl-2 tag-item font-14" v-if="infoEmployee.master_profile.status === 'active'">
                Đang làm việc
              </div>
              <div class="d-inline-block mr-2 pr-2 pl-2 tag-item font-14" v-if="infoEmployee.master_profile.status === 'not_verified'">
                Chờ nhận việc
              </div>
              <div class="d-inline-block mr-2 pr-2 pl-2 tag-item font-14" v-if="infoEmployee.master_profile.status === 'pause'">
                Tạm dừng công việc
              </div>
              <div class="d-inline-block mr-2 pr-2 pl-2 tag-item font-14" v-if="infoEmployee.master_profile.status === 'disable'">
                Đã nghỉ việc
              </div>
              <div class="d-inline-block mr-2 pr-2 pl-2 tag-warning font-14" v-if="infoEmployee.can_remote_attendance">
                Điểm danh từ xa
              </div>
          </div>
        </div>
      </div>
    </td>
    <td class="rightTd">
      <div class="d-flex flex-column" style="padding-left: 0.3rem;">
        <div class="log-cus">
            <i v-show="loadingLogDetail" class="fas fa-spinner fa-pulse cusSpinnerEdu"></i>
          <div v-if="listLogDetail.length > 0" class="log-cus-detail">
            <!--log-->
            <div class="detail-logs" v-show="!loadingLogDetail && listLogDetail.length > 0">
              <div class="content-detail-log">
                <ul class="log-timeline ul-log-cus" @scroll="onScrollLogDetail" ref="infoHeightLog" :id="infoEmployee.id">
                  <li class="log-timeline-item" v-for="(data, idxLog) in listLogDetail" :key="idxLog">
                    <div class="log-timeline-item-tail"
                         :style="(idxLog === (listLogDetail.length -1)) ? 'display:none;' : ''"></div>
                    <div class="log-timeline-item-head"
                         :style="' background-color: #00904A;'"></div>
                    <div class="log-timeline-item-content">
                      <span>{{ formatDate(data.action_created, 'DD/MM/YYYY HH:mm:ss') }} {{ data.message }} </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          </div>
        </div>
    </td>
    <!-- action  -->
    <td class="text-center actionCus">
      <div class="popupAction pl-0" style="padding-top: 1rem;">
        <!--          popup xem, gọi -->
        <button
          :disabled="infoEmployee.status_id === 1"
          :style="infoEmployee.status_id === 1 ? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
          class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset btn-cus-action"
          ref="actionLockAcc"
          @click="onOpenModal('changeSttModal', infoEmployee, {statusChange: 'lock', callback: updateStatusAccount})">Khoá TK</button>

        <button
          :disabled="infoEmployee.status_id === 1"
          :style="infoEmployee.status_id === 1 ? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
          class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset btn-cus-action"
          ref="actionOpenAcc"
          @click="onOpenModal('changeSttModal', infoEmployee, {statusChange: 'unlock', callback: updateStatusAccount})">Mở TK</button>

        <button
          :disabled="infoEmployee.status_id === 1"
          :style="infoEmployee.status_id === 1 ? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
          class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset btn-cus-action"
          ref="actionChangeLeader"
          @click="onOpenModal('changeLeader', infoEmployee, {callback: getListLeader})">Sửa NQL</button>

        <button
          :disabled="infoEmployee.status_id === 1"
          :style="(infoEmployee.status_id === 1 || !checkManagerValid() || !checkValidJoinDateOrComebackDate())? 'color: #8b8b8b; background-color: rgb(241, 241, 242); border-color: rgb(219,219,219)' : ''"
          class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset btn-cus-action"
          ref="actionEvaluation"
          @click="onOpenModalEvaluation()">Đánh giá <i v-show="loadingModalEval" class="fas fa-spinner fa-pulse"/></button>

        <button
          class="btn btn-sm btn-outline-ghtk btn-pill mb-2 font-unset btn-cus-action"
          ref="actionNote"
          @click="onOpenModal('noteModal', infoEmployee, {callback: getLogUpdateNode})">Ghi chú</button>

      </div>
    </td>
  </tr>
</template>

<script>
// helper
import helper from 'infrastructures/helpers/common-helpers'

import staffService from 'domain/services/staff-management-service'
import {mapGetters} from 'vuex'

// custom component
import PeriodLine from '../Education/PeriodLine'
import {eventBus} from '../../../../main'
import ClassManager from '../TrainingJob/ClassManager'

export default {
  name: 'staff-detail-row',
  components: {
    ClassManager,
    PeriodLine
  },
  props: {
    viewMode: {
      type: String,
      default: 'leader_tree'
    },
    syllabus: {
      type: Object,
      default: () => ({})
    },
    permissionEdit: {
      type: Boolean,
      default: false
    },
    infoEmployee: {
      type: Object,
      default: () => ({})
    },
    userId: null,
    currentUser: null,
    idLoadingModalEval: null
  },
  watch: {
    infoEmployee (newVal, oldVal) {
      this.page = 1
      this.getLogDetail('first')
    },
    idLoadingModalEval (newVal, oldVal) {
      if ((this.idLoadingModalEval === +this.infoEmployee.id) && this.infoEmployee.id !== null) {
        this.loadingModalEval = true
      } else {
        this.loadingModalEval = false
      }
    }
  },
  computed: {
    helper: function () {
      return helper
    },
    statusMapper: function () {
      let desc = ''
      if (this.syllabus.status === 'closed') desc = 'Đóng'
      if (this.syllabus.status === 'open') return 'Mở'
      return desc
    },
    ...mapGetters({
      authUser: 'userInfo'
    })
  },
  created () {
    this.checkValidJoinDateOrComebackDate()
    eventBus.$on('updateLogStaff', this.handleEventUpdateLog)
  },
  mounted () {
    this.listAccount = this.infoEmployee.sub_accounts
    this.infoEmployee.link_avatar = this.infoEmployee.link_avatar !== null ? this.infoEmployee.link_avatar : 'https://uploads-ssl.webflow.com/5fb85f26f126ce08d792d2d9/62d66b80b43387c88d617c8c_After_kime%402x-100.jpg'
    this.page = 1
    this.getLogDetail('first')
  },
  destroyed () {
    eventBus.$off('updateLogStaff', this.handleEventUpdateLog)
  },

  data: _ => ({
    styleComingClass: 'width: 100%;',
    showClass: [],
    listLogDetail: [],
    loadingLogDetail: false,
    limit: 15,
    page: 1,
    perPage: 10,
    isLimit: false,
    listAccount: [],
    loadingModalEval: false
  }),

  methods: {
    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
    },
    handleEventUpdateLog (userIdEvent) {
      if (userIdEvent === this.infoEmployee.id) {
        this.isLimit = false
        this.page = 1
        this.getLogDetail('first')
      }
    },
    updateStatusAccount ({userIdAcc, statusIdAfter}) {
      if (this.listAccount !== null) {
        // Thay đổi tài khoản không phải tài khoản chính
        this.updateStatusAcc(userIdAcc, statusIdAfter)
      }
      if (+userIdAcc === +this.infoEmployee.id) {
        // Thay đổi tài khoản là tài khoản chính
        this.infoEmployee.status_id = statusIdAfter
      }
      this.isLimit = false
      this.page = 1
      this.getLogDetail('first')
    },
    updateStatusAcc: function (userIdAcc, statusIdAfter) {
      for (let i = 0; i < this.listAccount.length; i++) {
        if (this.listAccount[i].id === userIdAcc) {
          // status = 3: Đang hoạt động | status = 1,2 : Dừng hoạt động, tạm khoá
          this.listAccount[i].status_id = statusIdAfter
        }
      }
    },
    getListLeader ({listLeader, log}) {
      this.infoEmployee.leaders = listLeader
      this.isLimit = false
      this.page = 1
      this.getLogDetail('first')
    },

    getLogUpdateNode () {
      this.isLimit = false
      this.page = 1
      this.getLogDetail('first')
    },

    // Chỉ quản lý trực tiếp mới được đánh giá
    checkManagerValid () {
      let arrManager = this.infoEmployee.leaders.map(item => item.id)
      if (arrManager.includes(+this.authUser.User.id)) {
        return true
      }
      return false
    },

    // phải đi làm tối thiểu 10 ngày mới được đánh giá
    checkValidJoinDateOrComebackDate () {
      let dateCheck = this.infoEmployee.master_profile.comeback_date === null ? this.infoEmployee.master_profile.join_date : this.infoEmployee.master_profile.comeback_date
      let now = new Date()
      if (+helper.calDistanceDate(dateCheck, now) >= 10) { return true }
      return false
    },

    convertNameStation (nameStation) {
      if (nameStation.slice(0, 3) === 'Kho' || nameStation.slice(0, 3) === 'kho') {
        return nameStation
      }
      return 'Kho ' + nameStation
    },
    async onScrollLogDetail () {
      let idTag = '[id="' + this.userId + '"]'
      const logDetail = document.querySelector(idTag)
      const HeightLogWindow = this.$refs.infoHeightLog.clientHeight
      if (HeightLogWindow + logDetail.scrollTop + 100 > logDetail.scrollHeight && !this.loadingLogDetail && !this.isLimit) {
        // Lấy thêm log của từng user khi cuộn
        this.page++
        this.getLogDetail('Add')
      }
    },

    openLink (link) {
      window.open(link, '_blank')
    },

    onOpenModal (modal, user, options) {
      this.$emit('onOpenModal', {modal, user, options})
    },

    onOpenModalEvaluation () {
      if (!this.checkValidJoinDateOrComebackDate()) {
        return helper.showMessage('Chỉ đánh giá được nhân viên đã làm việc tối thiểu 10 ngày', 'warning')
      }
      if (!this.checkManagerValid()) {
        return helper.showMessage('Chỉ quản lý trực tiếp mới được đánh giá', 'warning')
      }
      this.$emit('onOpenModalEvaluation', this.infoEmployee.id)
    },

    onClickChat (userId) {
      // truyền id của HR
      this.$emit('onClickChat', userId)
    },

    async getLogDetail (type) {
      if (this.isLimit || this.loadingLogDetail) { return true }
      this.loadingLogDetail = true
      try {
        let params = {
          user_id: this.userId,
          per_page: this.perPage,
          page: this.page,
          view_mode: this.viewMode
        }
        const res = await staffService.getlistLogDetail(params)
        const {success, message, data} = res.data
        if (success) {
          if (type === 'first') {
            this.listLogDetail = data
          } else {
            this.listLogDetail = this.listLogDetail.concat(data)
          }
          if (+res.data.current_page === +res.data.last_page) {
            this.isLimit = true
          }

          this.page = res.data.current_page
        } else {
          if (type === 'first') {
            this.listLogDetail = []
          }
          helper.showMessage(message, 'warning')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingLogDetail = false
      }
    },

    viewDetail () {
      this.$emit('viewDetailStaff', this.infoEmployee, this._uid)
    },

    openModalFromInfoStaff (action = '', userStaff, uidComponentStaff) {
      if (uidComponentStaff === this._uid) {
        this.infoEmployee = userStaff
        if (action === 'openAcc') {
          this.$refs.actionOpenAcc.click()
        } else if (action === 'lockAcc') {
          this.$refs.actionLockAcc.click()
        } else if (action === 'changeLeader') {
          this.$refs.actionChangeLeader.click()
        } else if (action === 'evaluation') {
          this.$refs.actionEvaluation.click()
        } else if (action === 'note') {
          this.$refs.actionNote.click()
        }
      }
    },

    onChangeDataRemoteCheckin (status, userStaff, uidComponentStaff) {
      if (uidComponentStaff === this._uid) {
        this.infoEmployee = userStaff
        this.userId = this.infoEmployee.id
        this.infoEmployee.can_remote_attendance = status

        this.$bvModal.hide('modal-info-staff')
        this.$emit('changeRemoteCheckin')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip{
  opacity: 1 !important;
}
.organize-form {
  &-active, &-disable {
    border-radius: 100px;
    width: 16px;
    height: 16px;

    .checkmark {
      transform: rotate(45deg);
      height: 9px;
      width: 5px;
      margin-top: 0.12rem;
      margin-left: 37%;
      border-bottom: 1px solid #FFFFFF;
      border-right: 1px solid #FFFFFF;
    }
  }

  &-active {
    background-color: #14a05b;
    border-color: #14a05b;
  }

  &-disable {
    background-color: #BDBDBD;
    border-color: #BDBDBD;
  }
}

.contentClassComing::-webkit-scrollbar {
  width: 0 !important
}

.cusBox::-webkit-scrollbar {
  width: 0 !important
}

.detail-logs::-webkit-scrollbar {
  width: 0 !important
}

.log-cus-detail b, .class-log-document b {
  font-size: 0.9rem !important;
}

.description b {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem !important;
  line-height: 19px
}

.description span {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 0.9rem !important;
  line-height: 19px
}

.profile-document {
  position: relative;
  width: 100%;
  height: 100%;

  &-container {
    width: 5vw;
    height: 13vh;
  }
}

.education-row {
  color: #000;
}

.content-tag {
  max-width: 61%;
  flex-wrap: wrap;
}

.tag-item {
  height: 1.8rem;
  background-color: rgb(6, 146, 85);
  color: white;
  text-align: center;
  padding-top: 0.25rem;
  margin-top: 0.8rem;
}

.tag-warning {
  height: 1.8rem;
  background-color: #FF9A54;
  color: white;
  text-align: center;
  padding-top: 0.25rem;
  margin-top: 0.8rem;
}

.w-51 {
  width: 51% !important;
}

.check-style {
  color: white;
  background: #BDBDBD;
  border-radius: 10px;
}

.active {
  background: #069255;
}

.inactive {
  background: red;
}

.view-pdf {
  position: unset !important;
}

.documentParent {
  max-width: 96%;
}

.document-type-desc {
  text-align: center;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.64);
  width: 100%;
  position: absolute;
  bottom: 0;
  pointer-events: none;
  padding: 3px;
}

.image-document {
  width: 100%;
  height: 120px;
  display: inline-block;
  vertical-align: middle;
  object-fit: cover;
}

.num-img-extend {
  /*pointer-events: none;*/
  text-align: center;
  font-size: 11px;
  color: white;
  background-color: rgba(0, 0, 0, 0.47);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.docChild {
  width: 66px;
  margin-right: 26px;
}

.profile-document__element {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3)) !important;
  overflow: hidden;
  position: relative;
  border: 1px solid #ddd;

  &:hover .num-img-extend {
    display: flex;
  }
}

.scrollbar {
  float: left;
  width: 100%;
}

.force-overflow {
  //min-height: 150px;
}

.scrollbar-primary::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.scrollbar-primary::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #A4A4A4;
}

.scrollbar-primary {
  scrollbar-color: #A4A4A4 #F5F5F5;
}

.small-scrollbar ::-webkit-scrollbar-track {
  background: #ffffff !important;
}

.small-scrollbar ::-webkit-scrollbar-thumb {
  background: #A4A4A4 !important;
}

.small-scrollbar ::-webkit-scrollbar-thumb:hover {
  background: #A8A8A8 !important;
}

.text-center-y {
  display: flex !important;
  align-items: center;
  line-height: normal;
}

@media only screen and (max-width: 1280px) {
  .class-document {
    //height: 90px;
    .image-document {
      font-size: 0.4em;
      width: 100%;
    }

    .document-type-desc {
      width: 100%;
      font-size: 0.4em;
    }

    .num-img-extend {
      width: 100%;
    }
  }

  .documentParent {
    max-width: 102%;
  }

  .content-tag {
    max-width: 95%;
  }

}

.content-detail-log {
  ul.log-timeline {
    height: 29vh;
    overflow-y: scroll;
    li:last-child {
      margin-bottom: -18px;
    }
  }

  .log-timeline {
    box-sizing: border-box;
    color: #000;
    font-variant: tabular-nums;
    line-height: 1.9;
    -webkit-font-feature-settings: "tnum", "tnum";
    font-feature-settings: "tnum", "tnum";
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .log-timeline-item {
    position: relative;
    margin: 0;
    padding: 0 4px 0;
    list-style: none;
    top: 11px;
  }

  .log-timeline-item-tail {
    position: absolute;
    top: 8px;
    left: 0.41rem;
    height: calc(100% - 4px);
    border-left: 2px solid #BDBDBD;
  }

  .log-timeline-item-head {
    width: 6px;
    height: 6px;
    border: 2px solid transparent;
    border-radius: 89%;
  }

  .log-timeline-item-content {
    position: relative;
    top: -15px;
    margin: 0 0 0 14px;
    word-break: break-word;

    span.btn {
      border-radius: 20px;
      border: 1px solid #00904A;
    }
  }
}

</style>
<style scoped>

.leftTd, .rightTd, .actionCus {
  border: 1px solid #E0E0E0;
  padding: 0.8rem;
}
.leftTd {
  height: 32vh;
}
.actionCus {
  padding: 0rem;
  text-align: center;
}
.ul-log-cus::-webkit-scrollbar {
  width: 0!important;
}
.b-info-cus {
  display: inline-block;
  margin-top: 0.3rem;
  margin-right: 0.3rem;
}
.b-info-cus span {
  font-weight: 500;
}
.ul-cus {
  max-height: 10vh;
  overflow-y: scroll;
}
.ul-cus::-webkit-scrollbar {
  width: 0!important;
}
.contentClassComing p {
  margin: 5px 0px 0px 0px;
}

.btn-cus-action {
  display: block;
  margin-bottom: 1rem !important;
  width: 5rem;
  height: 2rem;
}

.titleClass div {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  font-size: 0.9rem !important;
}

.leftContent {
  margin-top: 2px;
}

.infoUser {
  display: flex;
}

.infoUser img {
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  width: 59px;
  height: 59px;
  border-radius: 50%;
  object-fit: cover
}

.infoUser .description {
  max-width: 62% !important;
}

.popupAction {
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75rem;
  padding-top: 1rem;
  margin: 0 auto;
}

.popupView {
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75rem;
  margin: 0 -1.5rem 0 auto;
}

.popupView .btn {
  min-width: 3rem;
  margin-right: 0.5%;
}

.log-cus {
  position: relative;
}

.infoDetailHr img {
  width: 52px !important;
  height: 52px !important;
}

.log-cus .description {
  padding-top: 0.2rem;
}

.cusSpinnerOpe {
  position: absolute;
  top: 11rem;
  left: 16rem;
}
.cusSpinnerEdu {
  position: absolute;
  top: 9rem;
  left: 29rem;
}

@media only screen and (max-width: 1280px) {
  .logEdu .detail-logs[data-v-d0950ee2] {
    height: 15vh;
    overflow-y: scroll;
  }

  .popupView .btn {
    min-width: 3rem;
    margin-right: 0.5%;
  }

  .cusSpinnerEdu {
    position: absolute;
    top: 3rem;
    left: 16rem;
  }

  .cusSpinnerOpe {
    position: absolute;
    top: 10rem;
    left: 10rem;
  }
}
@media only screen and (max-width: 1600px) {
  .popupView {
    margin-right: -0.7rem !important;
  }
}
</style>
