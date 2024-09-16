<template>
  <div class="table-responsive">
    <div class="search-truck">
      <div class="row">
        <div class="col-2">
          <datepicker
            placeholder="Chọn thời gian chạy"
            v-model="filter.runDate"
            format="dd-MM-yyyy"
            :bootstrapStyling="true"
            :monday-first="true"
            :full-month-name="true"
            :calendar-button="true"
            calendar-button-icon="ion ion-md-calendar"
            :clear-button="true"
          />
        </div>
        <div class="col-2">
          <multiselect
                       placeholder="Chọn tuyến"
                       v-model="filter.router"
                       :options="routerOptions"
                       label="text"
                       track-by="value"
                       selectedLabel="Đã chọn"
                       deselectLabel="Bỏ chọn"
                       selectLabel="Chọn"
                       :searchable="true"
                       :clear-on-select="false"
          >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          </multiselect>
        </div>
        <div class="col-2">
          <multiselect
                       placeholder="Chọn BKS"
                       v-model="filter.code"
                       :options="codeOptions"
                       label="text"
                       track-by="text"
                       selectedLabel="Đã chọn"
                       deselectLabel="Bỏ chọn"
                       selectLabel="Chọn"
                       :searchable="true"
                       :clear-on-select="false"
          >
            <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          </multiselect>
        </div>
        <div class="col-6">
          <button class="btn btn-success" @click="getListRentPlans(1)">Tìm kiếm</button>
        </div>
      </div>
    </div>
    <table class="table b-table table-striped table-hover" aria-rowcount="100" v-loading="isLoading">
      <thead class="">
        <tr>
          <th aria-colindex="4">Thời gian</th>
          <th aria-colindex="4">Tên tuyến</th>
          <th aria-colindex="4">Kho xuất</th>
          <th aria-colindex="2">Chiều</th>
          <th aria-colindex="4">CCDC</th>
          <th aria-colindex="4">BKS</th>
          <th aria-colindex="4">CMT/CCCD</th>
          <th aria-colindex="4">Tên tài xế</th>
          <th aria-colindex="4">SĐT</th>
          <th aria-colindex="4">Ghi chú</th>
          <th aria-colindex="2" class="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody v-if="listPlansData && listPlansData.length > 0">
        <tr v-for="(res, index) in listPlansData" :key="index">
          <td v-if="res.to_date">{{ moment(res.from_date).format('DD/MM/YYYY') !== 'Invalid date' ? moment(res.from_date).format('DD/MM/YYYY') : '' || ''}} -
            {{ moment(res.to_date).format('DD/MM/YYYY') !== 'Invalid date' ?  moment(res.to_date).format('DD/MM/YYYY') : '' || ''}}</td>
          <td v-else>Từ {{ moment(res.from_date).format('DD/MM/YYYY') !== 'Invalid date' ? moment(res.from_date).format('DD/MM/YYYY') : '' || ''}}</td>
          <td>{{ res.router_name }}</td>
          <td>{{ res.station_name }}</td>
          <td>{{ res.number_dimensional }}</td>
          <td>{{ res.tool }}</td>
          <td>{{ res.code }}</td>
          <td>{{ res.personal_id_number }}</td>
          <td>{{ res.fullname }}</td>
          <td>{{ res.tel }}</td>
          <td>{{ res.note }}</td>
          <td class="text-center">
            <router-link :to="{name: 'edit-truck-plan', params: { id: res.id }, query: {'profile_id': profileId}}" class="btn btn-sm btn-outline-success"><i class="fa fas fa-edit"></i></router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <b-pagination
      v-if="totalItems"
      v-model="currentPage"
      :total-rows="totalItems"
      :per-page="perPage"
      aria-controls="my-table"
      @input="getListRentPlans(currentPage)"
    ></b-pagination>
  </div>
</template>

<script>
import CompanyProfileService from 'domain/services/company-profile-service'
import commonHelper from 'infrastructures/helpers/common-helpers'
import Datepicker from 'vuejs-datepicker'
import Multiselect from 'vue-multiselect'
import Viewer from 'v-viewer'
import Vue from 'vue'
import moment from 'moment'

Vue.use(Viewer)

export default {
  name: 'rent-list-plan',

  components: {
    Datepicker,
    Multiselect
  },

  props: ['profileId', 'isFresh'],

  data: () => ({
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    listPlans: [],
    listPlansData: [],
    isLoading: false,
    filter: {
      runDate: null,
      router: '',
      code: ''
    },
    routerOptions: [],
    codeOptions: []
  }),

  computed: {

  },

  watch: {
    listPlans: function (newVal, oldVal) {
      this.listPlansData = JSON.parse(JSON.stringify(newVal))
    },
    profileId: function (newVal, oldVal) {
    },
    isFresh: function (newVal, oldVal) {
      this.getListRentPlans(this.currentPage)
    }
  },

  created () {
    this.getListRentPlans(1)
  },

  methods: {
    moment (data) {
      return moment(data)
    },
    getListRentPlans: function (currentPage) {
      this.$startLoading()
      this.isLoading = true
      let dataRequest = {
        id: this.profileId,
        page: currentPage,
        limit: this.perPage,
        run_date: this.filter.runDate || null,
        router_id: this.filter.router ? this.filter.router.value : '',
        code: this.filter.code ? this.filter.code.text : ''
      }
      CompanyProfileService.getListRentPlans(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.listPlans = res.data.data.data
            this.totalItems = res.data.data.total
            this.getListRoutes()
            this.getCodeByRentTrucks()
          } else {
            this.listPlans = []
          }
        })
        .catch((e) => {
          commonHelper.showMessage('Có lỗi xảy ra khi lấy dữ liệu', 'warning')
        }).then(() => {
          this.isLoading = false
          this.$stopLoading()
        })
    },
    clearFilter () {
      this.filter = {
        runDate: null,
        router: '',
        code: ''
      }
    },
    getCodeByRentTrucks () {
      this.$startLoading()
      let dataRequest = {
        profile_id: this.profileId
      }
      CompanyProfileService.getCodeByRentTrucks(dataRequest)
        .then((res) => {
          if (res.data.success) {
            this.codeOptions = res.data.data
          } else {
            this.codeOptions = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    },
    getListRoutes () {
      this.$startLoading()
      CompanyProfileService.getListRoutes()
        .then((res) => {
          if (res.data.success) {
            this.routerOptions = res.data.data
          } else {
            this.routerOptions = []
          }
        })
        .catch((e) => {
          console.log(e)
        }).then(() => {
          this.$stopLoading()
        })
    }
  }
}
</script>

<style scoped>
.search-truck {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
}

</style>
