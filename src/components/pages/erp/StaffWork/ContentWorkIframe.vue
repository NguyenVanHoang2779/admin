<template>
    <div class="overflow-hidden content-work">
        <div class="text-center no-permission" v-show="has_permission === false">Bạn chưa đăng nhập hoặc không có quyền thao tác trên màn này !</div>
        <div v-show="has_permission" class="small-scrollbar justify-content-end bg-white content-work-wrap">
            <div class="mx-2 d-none d-sm-block" id="hr-work-content">
                <router-view></router-view>
            </div>
                <MenuWork
                    :collapse-on-change="true"
                    :list-work="listWork"
                    :class="{'font-small': smallScreen}"
                />
        </div>
    </div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@/vendor/libs/vue-multiselect/vue-multiselect.scss" lang="scss"></style>
<style src="@/vendor/libs/vue-input-tag/vue-input-tag.scss" lang="scss"></style>
<style lang="css" scoped>
  .content-work-wrap {
      display: flex;
      min-height: 100vh;
  }

  .collapse-btn {
      position: fixed;
      top: 0;
      right: 0;
  }
  .no-permission {
      width: 300px;
      top: 0;
      right: 0;
      position: absolute;
  }

  #hr-work-content {
      flex: 1;
      min-width: calc(100vw - 280px);
  }

  #hr-work-content::-webkit-scrollbar {
      width: 0px;
      height: 0px;
  }
</style>
<script>
// service
import hrOrderService from 'domain/services/hr-order-service'
import hrStatisticService from 'domain/services/hr-statistic-service'
import staffWorkService from 'domain/services/staff-work-service'

// import HrWork from 'domain/entities/HrWork'

// custom component
import MenuWork from './MenuWork'
import { mapGetters } from 'vuex'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import IframeHelper from 'domain/entities/iframeHelper'
IframeHelper.startListen()

export default {
  name: 'content-work-iframe',

  components: {
    MenuWork
  },

  created () {
    IframeHelper.sendMessage({type: 'content_ready', payload: {status: true}}, null)
    // Lấy menu
    this.getMenuWork()
  },

  data: () => ({
    has_permission: true,
    smallScreen: true,
    listWork: {},
    filter: {
      profileStatus: null,
      orderGroup: null,
      orderType: null,
      orderCategory: null,
      dependantStatus: null,
      unionStatus: null
    },
    apiStatisticMap: {
      contract: 'getStatisticHrOrder',
      working_process: 'getStatisticHrOrder',
      insurance: 'getStatisticHrOrder',
      stop_working: 'getStatisticHrOrder',
      master_profile: 'getStatisticMasterProfile',
      driverx: 'getTotalDriverxNews',
      candidate: 'getStatisticCandidateV2',
      union: 'getStatisticUnion',
      tax: 'getStatisticDependantV2',
      training: 'getTotalTrainingTests',
      profile_document: 'getTotalUserNotCompleteDocuments'
    },
    permissionSyllabus: false
  }),

  computed: {
    ...mapGetters({
      curUser: 'userInfo',
      gchatAuth: 'gchatAuth'
    })
  },

  watch: {
  },

  mounted () {
    this.checkSmallScreen()
  },

  updated () {
    this.checkSmallScreen()
  },

  methods: {
    checkSmallScreen () {
      let screenContent = document.getElementById('hr-work-content')
      this.smallScreen = (!screenContent || screenContent.getBoundingClientRect().width < 1200)
    },

    // hàm này không còn được dùng
    allowShowOnGchat (gchatToken) {
      hrOrderService.allowShowOnGchat({token: gchatToken || null})
        .then(res => {
          if (res.data.success) {
            let data = res.data.data || null
            if (data.has_permission) {
              this.has_permission = true
              IframeHelper.sendMessage({type: 'user', payload: {has_permission: true}}, null)
              IframeHelper.sendMessage({type: 'status_iframe', payload: {is_focus: false}}, null)

              // Lấy lại user đăng nhập mới nếu user trước là nhóm OnlyCheckin (21)
              if (this.curUser && this.curUser.Group && (+this.curUser.Group.id === 21)) this.$store.dispatch('getUserInfo')
            } else {
              this.has_permission = false
              console.log(res.data.message)
            }
          } else {
            this.has_permission = false
            console.log(res.data.message)
          }
        })
        .catch(e => {
          this.has_permission = false
          console.log(e)
        })
        .finally(_ => {
          // Xóa cookie cũ của user ảo
          document.cookie = 'PHPSESSID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; secure;'
        })
    },

    getMenuWork () {
      staffWorkService.getMenuWork()
        .then(res => {
          if (res.data.success) {
            if (res.data.data && !Array.isArray(res.data.data)) this.listWork = res.data.data || {}
            // Lấy số liệu thống kê công việc cần làm
            this.getStatistic()
          } else {
            console.log(res.data.message || 'Có lỗi khi lấy menu công việc !')
            this.listWork = {}
          }
        })
        .catch(e => {
          console.log(e)
          this.listWork = {}
        })
        .finally(_ => {
          if (!helper.isEmpty(this.listWork)) {
            IframeHelper.sendMessage({type: 'user', payload: {has_permission: true}}, null)
          } else {
            IframeHelper.sendMessage({type: 'user', payload: {has_permission: false}}, null)
          }
        })
    },

    getStatistic (key) {
      for (const workType in this.listWork) {
        if (this.listWork[workType] && this.listWork[workType].list_work && typeof this.listWork[workType].list_work === 'object') {
          if (key) {
            if (
              this.listWork[workType].list_work[key] &&
              this.apiStatisticMap[key] &&
              this[this.apiStatisticMap[key]]
            ) this[this.apiStatisticMap[key]](this.listWork[workType].list_work)
          } else {
            let called = []
            for (const work in this.listWork[workType].list_work) {
              if (this.apiStatisticMap[work] && this[this.apiStatisticMap[work]] && !called.includes(this.apiStatisticMap[work])) {
                this[this.apiStatisticMap[work]](this.listWork[workType].list_work)
                called.push(this.apiStatisticMap[work])
              }
            }
          }
        }
      }
    },

    getStatisticHrOrder (listWork = null) {
      if (!listWork) return
      hrStatisticService.getStatisticHrOrder()
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              for (const category in res.data.data) {
                listWork[category].num_need_action = res.data.data[category].num_need_action
                listWork[category].subwork = res.data.data[category].subwork
              }
            }
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getStatisticMasterProfile (listWork = null) {
      if (!listWork) return
      hrStatisticService.getStatisticMasterProfile()
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              listWork.master_profile.num_need_action = res.data.data.num_need_action || 0
              if (res.data.data.subwork) listWork.master_profile.subwork = res.data.data.subwork
            }
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getStatisticCandidateV2 (listWork = null) {
      if (!listWork) return
      hrStatisticService.getStatisticCandidateV2()
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              listWork.candidate.num_need_action = res.data.data.num_need_action || 0
              if (res.data.data.subwork) listWork.candidate.subwork = res.data.data.subwork
            }
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getStatisticUnion (listWork = null) {
      if (!listWork) return
      hrStatisticService.getStatisticUnion()
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              listWork.union.num_need_action = res.data.data.num_need_action || 0
              if (res.data.data.subwork) listWork.union.subwork = res.data.data.subwork
            }
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getStatisticDependantV2 (listWork = null) {
      if (!listWork) return
      hrStatisticService.getStatisticDependantV2()
        .then(res => {
          if (res.data.success) {
            if (res.data.data) {
              listWork.tax.num_need_action = res.data.data.num_need_action || 0
              if (res.data.data.subwork) listWork.tax.subwork = res.data.data.subwork
            }
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getTotalDriverxNews (listWork = null) {
      if (!listWork) return
      hrStatisticService.getTotalDriverxNews()
        .then(res => {
          if (res.data.success) {
            listWork.driverx.num_need_action = res.data.total || 0
            if (res.data.subwork) listWork.driverx.subwork = res.data.subwork
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getTotalTrainingTests (listWork = null) {
      if (!listWork) return
      hrStatisticService.getTotalTrainingTests()
        .then(res => {
          if (res.data.success) {
            listWork.training.num_need_action = res.data.total || 0
            if (res.data.subwork) listWork.training.subwork = res.data.subwork
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    getTotalUserNotCompleteDocuments (listWork = null) {
      if (!listWork) return
      hrStatisticService.getTotalUserNotCompleteDocuments()
        .then(res => {
          if (res.data.success) {
            listWork.profile_document.num_need_action = res.data.total || 0
            if (res.data.subwork) listWork.profile_document.subwork = res.data.subwork
          } else {
            console.log(res.data.message || 'Không lấy được dữ liệu thống kê !')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    changeWorkActive (data) {
      this.permissionSyllabus = data.permission
      this.workActive.work = 'education_manage'
    }
  }
}
</script>
