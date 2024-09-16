<template>
  <div class="small-scrollbar checkin-manager">
    <!-- Header + Action -->
    <b-row class="header my-2 align-items-center">
      <b-col md="2">
        <h4 class="m-0">Quản lý công</h4>
      </b-col>
      <b-col md="10" class="text-right">
        <button :class="filter.status === 'all' ? 'btn-ghtk' : 'btn-ghtk-disable'" class="btn btn-pill" @click="getTypeCheckin('all')">
          Tất cả
        </button>
        <button :class="filter.status === 'not_approve' ? 'btn-ghtk' : 'btn-ghtk-disable'" class="btn btn-pill" @click="getTypeCheckin('not_approve')">
          Công chưa duyệt <span>({{statistic.checkin_not_approve ? statistic.checkin_not_approve.total : 0}})</span>
        </button>
        <button :class="filter.status === 'ot_not_approve' ? 'btn-ghtk' : 'btn-ghtk-disable'" class="btn btn-pill" @click="getTypeCheckin('ot_not_approve')">
          Tăng ca chưa duyệt <span>({{statistic.checkin_ot_not_approve ? statistic.checkin_ot_not_approve.total : 0}})</span>
        </button>
        <button :class="filter.status === 'leave_not_approve' ? 'btn-ghtk' : 'btn-ghtk-disable'" class="btn btn-pill" @click="getTypeCheckin('leave_not_approve')">
          Xin nghỉ chưa duyệt <span>({{statistic.leave_not_approve.total ? statistic.leave_not_approve.total : 0}})</span>
        </button>
        <!-- <button disabled :class="filter.status === 'not_checkin' ? 'btn-ghtk' : 'btn-outline-ghtk'" class="btn btn-pill" @click="getTypeCheckin('not_checkin')">
          Chưa chấm công <span>({{ statistic.not_checkin.total }})</span>
        </button> -->
      </b-col>
    </b-row>

    <!-- Filter  -->
    <div class="row filter pb-2 justify-content-between input-border">
      <div class="mb-1 input-filter">
        <multi-select-province
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          :province-ids="filter.province"
          :auto-close="true"
          :hide-select="true"
          @handleProvinceSelected="handleProvinceSelected"
        ></multi-select-province>
      </div>
      <div class="mb-1 input-filter">
        <multi-select-station
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :province-ids="filter.province"
          :station-ids="filter.station"
          :auto-close="true"
          :hide-select="true"
          @handleStationSelected="handleStationSelected"
        ></multi-select-station>
      </div>
      <div class="mb-1 input-filter">
        <single-select-user
          class="z-3 multiselect-ghtk multiselect-no-horizontal"
          @onChange="op => {filter.employee = op ? op.id : null}"
          placeholder="Nhân viên"
          :in-scope="true"
          :reset="reset_employee"
        ></single-select-user>
      </div>
      <div class="mb-1 input-filter">
        <MultiSelectDepartment
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :department-ids="filter.department"
          :auto-close="true"
          :hide-selected="true"
          placeholder="Bộ phận"
          @handleDepartmentSelected="handleDepartmentSelected"
        />
      </div>
      <div class="mb-1 input-filter">
        <MultiSelectPosition
          :custom-class="'z-3 multiselect-ghtk multiselect-no-horizontal'"
          :department-ids="filter.department"
          :position-ids="filter.position"
          :auto-close="true"
          :hide-selected="true"
          placeholder="Vị trí"
          @handlePositionSelected="handlePositionSelected"
        />
      </div>
      <div class="mb-1 input-filter">
        <v-date-picker
          v-model="filter.date"
          locale="vi"
          color="green"
          :input-props="{ placeholder: 'Ngày', style: 'font-size:14px; line-height: unset' }"
          :popover="{visibility: 'focus'}"
        />
      </div>
      <div class="text-right input-filter">
        <button class="btn btn-ghtk rounded w-100" @click="handleReloadPage">
          <!-- <i class="fas fa-search"></i> -->
          Tìm kiếm
        </button>
        <!-- <button class="btn btn-ghtk" @click="resetFilter"><i class="fas fa-eraser"></i> Xóa lọc</button> -->
      </div>
    </div>

    <!-- Table data  -->
    <div :class="scrollMode && 'table-sticky'" class="mh-75 table-data">
      <table class="table table-sm mb-0">
        <thead>
          <tr class="text-center">
            <th class="w-30"><b>Nhân viên</b></th>
            <th><b>Chi tiết log</b></th>
            <th class="w-15"><b>Thao tác</b></th>
          </tr>
        </thead>
        <tbody class="position-relative" v-loading="loading">
          <template v-for="user_checkin in checkin_data">
<!--            <CheckinLogDetailV1 v-for="(checkin, idx) in user_checkin.check_ins" :idx="idx" :key="checkin.checkin_log.id + idx" :user-checkin="user_checkin" :checkin="checkin" @showCheckinDetail="showCheckinDetail"></CheckinLogDetailV1>-->
            <tr v-for="(checkin, idx) in user_checkin.check_ins">
              <td class="border-right" :rowspan="user_checkin.check_ins.length || 1" v-if="!idx">
                <div class="pl-3">
                  <div>
                    <b>{{ user_checkin.user.fullname }} ({{ user_checkin.user.username }})</b> <br>
                    <span>{{ user_checkin.user.position_name }} - {{ user_checkin.user.work_type_name }} - {{ user_checkin.user.station_name }}</span> <br>
                    <span>{{ user_checkin.user.tel }}</span>
                  </div>
                  <div class="mt-2">
                    <button class="btn btn-ghtk btn-sm btn-pill" @click="showCheckinCalendar(user_checkin.user.user_id, user_checkin.month_salary_from, user_checkin.month_salary_to)">
                      Công thường: {{ user_checkin.statistic.normal_approved }}/{{ user_checkin.statistic.standard }}
                    </button>
                    <button class="btn btn-ghtk btn-sm btn-pill" @click="showCheckinCalendar(user_checkin.user.user_id, user_checkin.month_salary_from, user_checkin.month_salary_to)">
                      Tăng ca: {{ user_checkin.statistic.ot_approved }}
                    </button>
                  </div>
                </div>
              </td>
              <td class="border-right">
                <div class="mh-10re overflow-auto pt-1">
                  <TimeLine
                    :logs="checkin.logs"
                    :itemStyle="{}"
                    time-field="time"
                    message-field="message"
                    :timeFormat="formatDate"
                  />
                </div>
              </td>
              <td class="text-center">
                <div v-for="(actionDesc, action) in checkin.action || []" :key="action">
                  <button
                    class="btn btn-outline-ghtk btn-pill btn-sm w-50 mb-2"
                    @click="showCheckinDetail(checkin.checkin_log.id, action, user_checkin.user.user_id)"
                  >
                    {{ actionDesc }}
                  </button>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="!checkin_data.length">
            <td colspan="10">
              <div class="mih-25 d-flex justify-content-center align-items-center">
                <b v-show="!loading">Không có dữ liệu phù hợp !</b>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- paging  -->
    <div class="row mt-3">
      <div class="col col-md-10 text-left">
        <b>
          Bản ghi/ trang
        </b>
        <select class="form-control form-control-sm w-4re text-ghtk rounded border-ghtk d-inline-block" v-model="page.per_page" @change="getCheckin()">
          <option>5</option>
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
        <div class="z-0 d-inline-block">
          <b-pagination
            class="paginator-ghtk mb-0"
            size="sm"
            align="left"
            v-model="page.current_page"
            :total-rows="+page.total"
            :per-page="+page.per_page"
            @input="getCheckin()"
          >
          </b-pagination>
        </div>
      </div>
      <div class="col col-md-2 text-right">
        <b>Trang {{ page.current_page }}/{{ page.total_page}}</b>
      </div>
    </div>

    <!-- modal  -->
    <b-modal id="modal-checkin-calendar" modal-class="modal-xxl" hide-footer hide-header>
      <DetailWorkShift :shift-range="workShift" :user-id="curUser" @reloadPage="handleReloadPage"/>
    </b-modal>
    <ModalUpdateCheckin :user-id="curUser" :type="'edit'" :checkin-id="curCheckin" :pr-status="curAction" @reloadCalendar="handleReloadPage" @getHistories="getHistories" :histories="workshiftActivities"
    />
  </div>
</template>

<style lang="scss" scoped>
  .filter {
    padding: 0 0.75rem 0 0.5rem;
  }
  .input-filter {
    width: 14%;
    padding: 0 0.25rem;
  }
  .checkin-manager {
    font-weight: 500;
  }
  .input-border {
    input {
      border-radius: 4px;
    }
  }
  .table-data {
    border-bottom: 1px solid #ddd;
    table {
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
    th {
      height: 3rem;
      vertical-align: middle;
      background-color: #f7f7f7;
    }
  }
</style>

<script>
// custom component
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import SingleSelectUser from 'components/elements/common/SingleSelectUser'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import TimeLine from '../StaffLog/TimeLine'
import ModalUpdateCheckin from './ModalUpdateCheckin'
import DetailWorkShift from './DetailWorkShift'
// import CheckinLogDetailV1 from './checkinLogDetailV1'

// service
import checkinService from 'domain/services/checkin-service'
import checkinManageService from 'domain/services/checkin-manage-service'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

export default {
  name: 'checkin-manager',

  components: {
    MultiSelectProvince,
    MultiSelectStation,
    SingleSelectUser,
    MultiSelectDepartment,
    MultiSelectPosition,
    TimeLine,
    ModalUpdateCheckin,
    DetailWorkShift
  },

  props: {
    scrollMode: {
      type: Boolean
    },
    blankMode: {
      type: Boolean
    }
  },

  data: _ => ({
    loading: false,
    page: {
      current_page: 1,
      total_page: 0,
      per_page: 10,
      total: 0
    },
    filter: {
      province: null,
      station: null,
      employee: null,
      department: null,
      position: null,
      date: null,
      status: 'not_approve'
    },
    reset_employee: false,
    statistic: {
      all: 0,
      not_approve: 0,
      ot_not_approve: 0,
      not_checkin: 0,
      leave_not_approve: 0
    },
    checkin_data: [],
    curCheckin: null,
    curUser: null,
    curAction: null,
    workShift: {
      from: null,
      to: null
    },
    workshiftActivities: []
  }),

  computed: {
    moment: moment
  },

  created () {
    // Lấy mặc định kỳ lương hiện tại
    let curDate = new Date()
    let curDay = curDate.getDate()
    if (curDay < 21) {
      this.workShift.from = curDate.getFullYear() + '-' + ('0' + curDate.getMonth()).slice(-2) + '-21'
      this.workShift.to = curDate.getFullYear() + '-' + ('0' + (curDate.getMonth() + 1)).slice(-2) + '-20'
    } else {
      this.workShift.from = curDate.getFullYear() + '-' + ('0' + (curDate.getMonth() + 1)).slice(-2) + '-21'
      this.workShift.to = curDate.getFullYear() + '-' + ('0' + (curDate.getMonth() + 2)).slice(-2) + '-20'
    }

    // Lấy mặc định là ngày hôm qua
    this.filter.date = moment().subtract(1, 'days').toDate()
    // Lấy data
    this.getCheckin()
    this.getStatisticCheckinNeedReview()
  },

  methods: {
    handleReloadPage () {
      this.getCheckin()
      this.getStatisticCheckinNeedReview()
    },

    getTypeCheckin (type) {
      this.filter.status = type
      this.getCheckin()
    },

    async getStatisticCheckinNeedReview () {
      try {
        let filter = helper.cloneDeep(this.filter)
        filter.date = helper.formatDate(this.filter.date, 'YYYY-MM-DD')
        let res = await checkinService.getStatisticCheckinNeedReview({'date': filter.date})
        if (res.data.success) {
          this.statistic = helper.cloneDeep(res.data.data)
        } else {
          helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin thống kê !')
        }
      } catch (e) {
        console.log(e)
        helper.showMessage('Có lỗi khi lấy thông tin thống kê !')
      }
    },

    async getCheckin () {
      this.loading = true
      try {
        let filter = helper.cloneDeep(this.filter)
        filter.date = helper.formatDate(this.filter.date, 'YYYY-MM-DD')
        filter.station = filter.station ? filter.station.split(',') : null
        filter.province = filter.province ? filter.province.split(',') : null
        filter.department = filter.department ? filter.department.split(',') : null
        filter.position = filter.position ? filter.position.split(',') : null
        let page = helper.cloneDeep(this.page)
        page.page = page.current_page
        page.limit = page.per_page
        let res = await checkinService.getCheckin({...filter, ...page})
        if (res.data.success) {
          this.checkin_data = helper.cloneDeep(res.data.data)

          this.page.total_page = res.data.meta.total_pages
          this.page.total = res.data.meta.total
          this.loading = false
        } else {
          helper.showMessage(res.data.message || 'Có lỗi khi lấy thông tin chấm công !')
        }
      } catch (e) {
        this.loading = false
        console.log(e)
        helper.showMessage('Có lỗi khi lấy thông tin chấm công !')
      }
    },

    resetFilter () {
      for (const field in this.filter) {
        if (field === 'status') continue
        this.filter[field] = null
      }
      this.reset_employee = !this.reset_employee
      this.getCheckin()
    },

    formatDate (date, format = 'DD/MM/YYYY') {
      return helper.formatDate(date, format)
    },

    showCheckinDetail (checkinId, action = 'view', userId) {
      this.curCheckin = checkinId
      this.curAction = action
      this.curUser = +userId
      this.$bvModal.show('modal-update-checkin')
    },

    showCheckinCalendar (userId, from, to) {
      this.curUser = +userId
      this.workShift.from = from
      this.workShift.to = to
      this.$bvModal.show('modal-checkin-calendar')
    },

    handleProvinceSelected (ops) {
      this.filter.province = ops ? ops.map((item) => item.id).toString() : ''
    },

    handleStationSelected (ops) {
      this.filter.station = ops ? ops.map(item => item.id).toString() : ''
    },

    handleDepartmentSelected (ops) {
      this.filter.department = ops ? ops.map(item => item.id).toString() : ''
    },

    handlePositionSelected (ops) {
      this.filter.position = ops ? ops.map(item => item.id).toString() : ''
    },
    getHistories (checkinId) {
      checkinManageService.getActivitiesOfCheckinLog({
        checkin_id: checkinId,
        from: this.formatDate(this.workShift.from, 'YYYY-MM-DD'),
        to: this.formatDate(this.workShift.to, 'YYYY-MM-DD')
      })
        .then(res => {
          if (res.data.success) {
            this.workshiftActivities = res.data.data
          } else {
            helper.showMessage(res.data.message || 'Không lấy được dữ liệu lịch sử duyệt công!', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
    }
  }
}
</script>
