<template>
  <div class="small-scrollbar take-care m-2">
    <!-- Header + Action -->
    <b-row class="header my-2 align-items-center">
      <b-col md="4">
        <h4 class="m-0">Chăm sóc nhân viên</h4>
      </b-col>
      <b-col md="8" class="text-right">
        <button :class="filter.type === 'all' ? 'btn-ghtk' : 'btn-ghtk-disable'"
                class="btn btn-pill btn-statistic"
                @click="getTypeTicket('all')">
          Tất cả <span>({{ data.all }})</span>
        </button>
        <button :class="filter.type === 'wait' ? 'btn-ghtk' : 'btn-ghtk-disable'"
                class="btn btn-pill btn-statistic"
                @click="getTypeTicket('wait')">
          Cần xử lý <span>({{ data.wait }})</span>
        </button>
        <button :class="filter.type === 'success' ? 'btn-ghtk' : 'btn-ghtk-disable'"
                class="btn btn-pill btn-statistic mr-1"
                @click="getTypeTicket('success')">
          Hoàn thành <span>({{ data.success }})</span>
        </button>
      </b-col>
    </b-row>

    <!-- Filter -->
    <div class="row filter pb-2 justify-content-between input-border">
      <!-- lọc theo miền -->
      <div class="mb-1 input-filter">
        <multi-select-region
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          placeholder="Miền"
          :auto-close="true"
          :hide-select="true"
          @handleSelectedRegion="handleRegionSelected"
        ></multi-select-region>
      </div>
      <!-- lọc theo tỉnh -->
      <div class="mb-1 input-filter">
        <multi-select-province
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          placeholder="Tỉnh"
          :province-ids="filter.province"
          :auto-close="true"
          :hide-select="true"
          @handleProvinceSelected="handleProvinceSelected"
        ></multi-select-province>
      </div>
      <!-- lọc theo kho -->
      <div class="mb-1 input-filter">
        <multi-select-station
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          placeholder="Kho"
          :province-ids="filter.province"
          :station-ids="filter.station"
          :auto-close="true"
          :hide-select="true"
          @handleStationSelected="handleStationSelected"
        ></multi-select-station>
      </div>
      <!-- lọc theo bộ phân -->
      <div class="mb-1 input-filter">
        <multi-select-department
          :department-ids="filter.departments"
          placeholder="Bộ phận"
          :auto-close="true"
          :hide-select="true"
          @handleDepartmentSelected="handleDepartmentSelected"
        ></multi-select-department>
      </div>
      <!-- lọc theo vị trí -->
      <div class="mb-1 input-filter">
        <multi-select-position
          :department-ids="filter.departments"
          class="multiselect-ghtk"
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          placeholder="Vị trí"
          :auto-close="true"
          :hide-select="true"
          @handlePositionSelected="handlePositionSelected"
        ></multi-select-position>
      </div>
      <!-- lọc theo nhân viên(fullname/username) -->
      <div class="mb-1 input-filter">
        <single-select-user
          class="z-5 multiselect-ghtk multiselect-no-horizontal"
          placeholder="Nhân viên"
          @onChange="option => {filter.user_ids = option ? option.id.toString() : null}"
        ></single-select-user>
      </div>
      <!-- lọc theo loại vấn đề -->
      <div class="mb-1 input-filter">
        <multi-select-problem
          class="multiselect-ghtk"
          :custom-class="'z-5 multiselect-ghtk multiselect-no-horizontal'"
          :auto-close="true"
          :hide-select="true"
          @handleProblemSelected="handleProblemSelected"
        ></multi-select-problem>
      </div>
      <!-- lọc theo khoảng thời gian tạo -->
      <div class="mb-1 input-filter">
        <v-date-picker
          mode="range"
          v-model="filter.createdDate"
          locale="vi"
          color="green"
          :input-props="{
            placeholder: 'Thời gian tạo',
            style: 'border-color: #BDBDBD'
          }"
          :popover="{visibility: 'focus'}"
        />
      </div>
    </div>
    <div class="row filter pb-2 justify-content-between input-border d-flex flex-row-reverse">
      <div class="text-right input-filter">
        <button class="btn btn-ghtk rounded w-100" @click="handleReloadPage">
          Tìm kiếm
        </button>
      </div>
    </div>

    <!-- Table data  -->
    <div :class="scrollMode && 'table-sticky'" class="mh-75 table-data">
      <table class="table table-sm mb-0 bordered">
        <thead>
        <tr class="text-center">
          <th class="w-15"><b>Nhân viên</b></th>
          <th class="w-35"><b>Danh sách vấn đề</b></th>
        </tr>
        </thead>
        <tbody class="position-relative" v-loading="loading">
        <tr v-for="(user, index) in data.data" :key="index">
          <td colspan="2">
            <StaffTicket
              :staffTicketInfo="user"
              :isCloseLogs="isCloseLogs"
            ></StaffTicket>
          </td>
        </tr>
        <!-- no record -->
        <tr v-show="loading">
          <td colspan="2" class="font-weight-bold text-center no-record">
            <div class="my-5"></div>
          </td>
        </tr>
        <tr v-show="!loading && !data.data.length">
          <td colspan="2" class="font-weight-bold text-center no-record">
            <div class="my-5">Không có ticket cần xử lý !</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div>
      <Paginate
        :page="page"
        @changePaginate="handleReloadPage()"
      >
      </Paginate>
    </div>
  </div>
</template>

<script>
// services
import ticketService from '../../../../domain/services/ticket-service'

// helper
import moment from 'moment'
import helpers from '../../../../infrastructures/helpers/common-helpers'

// components
import MultiSelectProvince from '../../../elements/common/MultiSelectProvince'
import MultiSelectRegion from '../../../elements/common/MultiSelectRegion'
import MultiSelectStation from '../../../elements/common/MultiSelectStation'
import MultiSelectPosition from '../../../elements/common/MultiSelectPosition.vue'
import SingleSelectUser from '../../../elements/common/SingleSelectUser.vue'
import MultiSelectProblem from '../../../elements/common/MultiSelectProblem.vue'
import MultiSelectDepartment from '../../../elements/common/MultiSelectDepartment.vue'
import TimeLine from '../StaffLog/TimeLine.vue'
import StaffTicket from './Components/StaffTicket.vue'
import Paginate from '../../../elements/common/Paginate.vue'

export default {
  name: 'take-care',
  components: {
    Paginate,
    StaffTicket,
    TimeLine,
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectPosition,
    SingleSelectUser,
    MultiSelectProblem,
    MultiSelectDepartment
  },
  props: {
    scrollMode: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    moment: moment
  },
  data: _ => ({
    loading: false,
    isCloseLogs: false,
    page: {
      currentPage: 1,
      totalPages: 10,
      perPage: 10,
      totalItems: 100
    },
    filter: {
      regions: null,
      provinces: null,
      stations: null,
      departments: null,
      positions: null,
      user_ids: null,
      ticket_types: null,
      createdDate: {
        start: moment().subtract(1, 'month').toDate(),
        end: moment().toDate()
      },
      type: 'all'
    },
    createdDateDefault: {
      start: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD')
    },
    data: {
      all: 0,
      wait: 0,
      success: 0,
      data: [
        {
          user_id: null,
          info_user: null,
          list_leader: null,
          ticket_detail: null,
          count_ticket: 0,
          count_refund: 0,
          count_penalty: 0,
          count_salary: 0,
          count_leave: 0,
          count_overtime: 0,
          count_default: 0
        }
      ]
    }
  }),
  created () {
    this.getTickets()
  },
  methods: {
    handleReloadPage () {
      this.getTickets()
    },
    handleProvinceSelected (options) {
      this.filter.provinces = options ? options.map((item) => item.id).toString() : ''
    },
    handleRegionSelected (options) {
      this.filter.regions = options ? options.map((item) => item.id).toString() : ''
    },
    handleStationSelected (options) {
      this.filter.stations = options ? options.map((item) => item.id).toString() : ''
    },
    handleDepartmentSelected (options) {
      this.filter.departments = options ? options.map((item) => item.id).toString() : ''
    },
    handlePositionSelected (options) {
      this.filter.positions = options ? options.map((item) => item.id).toString() : ''
    },
    handleProblemSelected (options) {
      this.filter.ticket_types = options ? options.map((item) => item.id).toString() : ''
    },
    async getTickets () {
      this.loading = true
      let filter = helpers.cloneDeep(this.filter)
      filter.regions = filter.regions ? filter.regions.split(',') : null
      filter.provinces = filter.provinces ? filter.provinces.split(',') : null
      filter.stations = filter.stations ? filter.stations.split(',') : null
      filter.departments = filter.departments ? filter.departments.split(',') : null
      filter.positions = filter.positions ? filter.positions.split(',') : null
      filter.ticket_types = filter.ticket_types ? filter.ticket_types.split(',') : null
      filter.user_ids = filter.user_ids ? filter.user_ids.split(',') : null
      filter.from = this.createdDateDefault.start
      filter.to = this.createdDateDefault.end

      if (filter.createdDate) {
        filter.from = helpers.formatDate(this.filter.createdDate.start, 'YYYY-MM-DD')
        filter.to = helpers.formatDate(this.filter.createdDate.end, 'YYYY-MM-DD')
      }

      let page = {
        page: this.page.currentPage,
        limit: this.page.perPage
      }

      try {
        const res = await ticketService.getTickets({...filter, ...page})
        if (res.data) {
          this.data = helpers.cloneDeep(res.data.data)
          switch (this.filter.type) {
            case 'wait':
              this.page.totalItems = this.data.wait
              break
            case 'success':
              this.page.totalItems = this.data.success
              break
            default:
              this.page.totalItems = this.data.all
              break
          }
          this.page.totalPages = Math.ceil(this.page.totalItems / this.page.perPage)
          this.loading = false
        }
      } catch (e) {
        this.loading = false
        console.log(e)
        helpers.showMessage('Có lỗi khi lấy tickets!', 'error', 'Lỗi')
      }
    },
    getTypeTicket (type) {
      this.isCloseLogs = !this.isCloseLogs
      this.filter.type = type
      this.getTickets()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../assets/sass/components/take-care-staff.scss';
</style>
