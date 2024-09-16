<template>
  <div>
    <h3 class="mb-5">Quản lí review nhân viên (định kỳ 6 tháng)</h3>
    <b-row class="h-col-50">
      <b-col md="2">
          <input placeholder="Mã Profile" v-model="search.staffCode" type="number" min="9" max="12" @keyup.enter="getListStaffs" class="form-control"/>
      </b-col>
      <b-col md="2">
          <input type="text" placeholder="username, Họ tên" v-model="search.keyword" @keyup.enter="getListStaffs" class="form-control" />
      </b-col>
      <b-col md="2">
          <single-select-profile-region :region="search.region" @handleSelectedRegion="handleSelectedRegion"></single-select-profile-region>
      </b-col>
      <b-col md="2">
          <single-select-province :regionName="search.region" :provinceId="search.provinceId" @handleSelectedProvince="handleSelectedProvince"></single-select-province>
      </b-col>
      <b-col md="2">
          <single-select-station :provinceId="search.provinceId" @handleSelectedStation="handleSelectedStation"></single-select-station>
      </b-col>
      <b-col md="2" class="mb-2">
          <single-select-position @handleSelectedPosition="handleSelectedPosition" :position-job="search.positionId"></single-select-position>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12" class="text-right">
        <b-btn type="button" variant="primary" @click="getListStaffs()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
        <b-btn type="button" variant="outline-primary" @click="resetSeach()"><i class="ion ion-md-refresh"></i> Reset</b-btn>
      </b-col>
    </b-row>
    <table hover responsive outlined class="table b-table table-hover is_align_middle bg-white mt-3">
      <thead head-variant="light">
        <tr>
          <b-th>STT</b-th>
          <b-th>Mã nhân viên</b-th>
          <b-th>Họ và Tên</b-th>
          <b-th>Vị trí</b-th>
          <b-th>Ngày chính thức</b-th>
          <b-th>Thâm niên</b-th>
          <b-th key="action">Thao tác</b-th>
        </tr>
      </thead>
      <b-tbody>
        <b-tr v-for="(item ,index) in items" v-bind:key="`${index}-${item.id}`" :title="item.required_reviewed? 'Chưa có review trong vòng 6 tháng' : ''" :class="{ 'review-staff-warning' : item.required_reviewed }" >
          <b-td>{{(pageData.currentPage - 1) * pageData.perPage + index + 1}}</b-td>
          <b-td>{{item.staff_code}}</b-td>
          <b-td>{{item.fullname}}</b-td>
          <b-td>{{item.position_name}}</b-td>
          <b-td>{{item.contract_date}}</b-td>
          <b-td>{{item.contract_date ? ((item.diff_years ? (item.diff_years + ' năm ') : '') + (item.diff_months ? (item.diff_months + ' tháng') : '')) : ''}}</b-td>
          <b-td>
            <b-badge variant="info" class="button"><router-link :to="getTimeEvaluate(item)" class="blink">fstar</router-link></b-badge>
            <b-badge href="#" variant="secondary" @click="showHistory(item)" class="button">lịch sử</b-badge>
            <b-badge href="#" variant="success"  @click="showAddReview(item)" class="button">thêm</b-badge>
          </b-td>
        </b-tr>
      </b-tbody>
    </table>
    <div v-if="items.length === 0" class="text-center">Không có dữ liệu nhân viên</div>
      <div class="mt-3" v-if="pageData.totalPages > 1">
        <b-row>
          <b-col md="6">
            <b-pagination
            v-model="pageData.currentPage"
            :total-rows="pageData.totalItems"
            :per-page="pageData.perPage"
            v-on:change="pageChanged"
            aria-controls="my-table"
            align="left"
            ></b-pagination>
          </b-col>
          <b-col md="6">
            <span class="text-muted">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
          </b-col>
        </b-row>
      </div>
    <b-modal v-model="history.isShow" hide-footer ref="reviewLog" size="lg" :title="history.title" ok-only centered>
        <b-table-simple v-if="history.items.length" hover outlined class="table-bordered">
           <b-thead head-variant="light">
              <b-tr>
                <b-th>Thời gian</b-th>
                <b-th>Note</b-th>
                <b-th>Thao tác</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(item ,index) in history.items" v-bind:key="`${index}-${item.id}`">
                <b-td>{{item.created}}</b-td>
                <b-td><div class="review-note-pre" v-html="item.note"></div></b-td>
                <b-td><b-link @click="showAddReview(history.staff, item)">Sửa</b-link></b-td>
              </b-tr>
            </b-tbody>
        </b-table-simple>
        <div v-else>Chưa có dữ liệu</div>
        <div class="mt-3" v-if="history.pageData.totalPages > 1">
          <b-row>
            <b-col md="6">
              <b-pagination
              v-model="history.pageData.currentPage"
              :total-rows="history.pageData.totalItems"
              :per-page="history.pageData.perPage"
              v-on:change="pageHistoryChanged"
              aria-controls="my-table1"
              align="center"
              ></b-pagination>
            </b-col>
          </b-row>
        </div>
    </b-modal>
    <add-staff-review @updateOk="updateReviewOk" :trigger="addStaff.trigger" :isEdit="addStaff.isEdit" :staff="addStaff.staff" :item="addStaff.item"></add-staff-review>
  </div>
</template>
<script>
// import commonHelper from 'infrastructures/helpers/common-helpers'
import SingleSelectProfileRegion from 'components/elements/common/SingleSelectProfileRegion'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import SingleSelectStation from 'components/elements/common/SingleSelectStation'
import StaffReviewService from 'domain/services/staff-review-service'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import AddStaffReview from './AddStaffReview'
import moment from 'moment'

export default {
  name: 'manager-staff-review',

  props: [],

  components: {
    AddStaffReview,
    SingleSelectProfileRegion,
    SingleSelectProvince,
    SingleSelectStation,
    SingleSelectPosition
  },
  data () {
    return {
      search: {
        staffCode: '',
        keyword: '',
        positionId: '',
        region: '',
        provinceId: '',
        stationId: ''
      },
      items: [],
      addStaff: {
        isEdit: false,
        trigger: false,
        staff: {},
        item: ''
      },
      pageData: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        perPage: 10,
        totalRow: 0
      },
      history: {
        isShow: false,
        title: '',
        fullname: '',
        items: [],
        staff: '',
        pageData: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          perPage: 10,
          totalRow: 0
        }
      }
    }
  },

  created () {
    this.getListStaffs()
  },
  methods: {
    resetSeach () {
      this.search.staffCode = ''
      this.search.keyword = ''
      this.search.positionId = ''
      this.search.region = ''
      this.search.provinceId = ''
      this.search.stationId = ''
    },
    updateReviewOk (staff, item) {
      if (this.history.isShow) {
        if (this.history.staff.id === staff.id) {
          for (let i = 0; i < this.history.items.length; i++) {
            if (this.history.items[i].id === item.id) {
              this.history.items[i].note = item.note
              break
            }
          }
        }
      }
      this.getListStaffs()
    },
    getTimeEvaluate (item) {
      let linkEvaluataion = '/evaluation/detail/' + item.id
      let fromTime = new Date()
      let toTime = new Date()
      toTime.setDate(21)
      fromTime.setMonth(toTime.getMonth() - 6)
      fromTime.setDate(21)
      return linkEvaluataion + '?from=' + moment(fromTime).format('YYYY-MM-DD') + '&to=' + moment(toTime).format('YYYY-MM-DD')
    },
    showAddReview (staff, item) {
      this.addStaff.staff = staff
      if (item) {
        this.addStaff.isEdit = true
        this.addStaff.item = item
      } else {
        // check den thang review
        // if (!staff.is_month) return commonHelper.showMessage('Chưa đến kì review 6 tháng', 'warn')
        this.addStaff.isEdit = false
        this.addStaff.item = ''
      }
      this.addStaff.trigger = !this.addStaff.trigger
    },
    showHistory (staff) {
      this.history.staff = staff
      this.history.title = staff.fullname + ' - lịch sử review'
      this.history.items = []
      this.$startLoading()
      this.$refs['reviewLog'].show()
      StaffReviewService.getStaffReviews({page: this.pageData.currentPage, user_id: staff.id}).then(response => {
        if (response.data.success) {
          this.history.items = response.data.data ? response.data.data.data : []
          this.history.pageData = response.data.data ? response.data.data.pagination : {}
        }
      }).then(() => {
        this.$stopLoading()
      })
    },
    pageChanged (page) { // Event check pagination change
      this.pageData.currentPage = page
      this.getListStaffs()
    },
    getListStaffs () {
      this.$startLoading()
      let params = {...this.search, page: this.pageData.currentPage}

      StaffReviewService.getListStaffs(params).then(response => {
        if (response.data.success) {
          this.items = response.data.data ? response.data.data.data : []
          this.pageData = response.data.data ? response.data.data.pagination : {}
        }
      }).then(() => {
        this.$stopLoading()
      })
    },

    handleSelectedPosition: function (option) {
      this.search.positionId = option ? option.id : ''
    },

    handleSelectedRegion (option) {
      this.search.region = option ? option.id : ''
    },

    handleSelectedProvince: function (option) {
      this.search.provinceId = option ? option.id : ''
    },

    handleSelectedStation: function (option) {
      this.search.stationId = option ? option.id : ''
    }
  }
}
</script>
<style scoped>
.review-note-pre {
  font-size: inherit;
  font-family: inherit;
  overflow-wrap: anywhere;
}
.review-staff-warning {
  background-color: #b9e3e8;
}
.review-staff-warning:hover {
  background-color: #bbe0e4 !important;
}
</style>
