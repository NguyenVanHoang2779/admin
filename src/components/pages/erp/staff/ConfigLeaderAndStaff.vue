<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading">Danh Sách Quản Lý và Nhân Viên</h4>
            <div class="float-right">
                <b-btn type="button" variant="secondary" @click="openModal"><i class="sidenav-icon ion ion-md-add"></i> Tạo Mới</b-btn>
            </div>
            <div class="search-form">
                <form>
                    <b-form-row>
                        <b-form-group label="Chọn Kho Liên Vùng" class="col-md-4">
                            <select-external-stations :multiple="false" @selected="setSelectedStation" ref="select_stations" placehoder="Nhập kho cần tìm kiếm"></select-external-stations>
                        </b-form-group>
                        <b-form-group label="Chọn Trưởng Module/Điều Phối" class="col-md-4">
                            <select-leader-by-station :multiple="false" :stationId="selectedStation" @selected="setSelectedLeader" ref="select_stations" placehoder="Nhập kho cần tìm kiếm"></select-leader-by-station>
                        </b-form-group>
                        <div class="col-md-4">
                            <b-form-group>
                                <span slot="label">&nbsp;</span>
                                <div class="align-content-center center">
                                    <b-btn type="button" variant="primary" @click="searchConfig(pageData.currentPage, true, false)"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                                </div>
                            </b-form-group>
                        </div>
                    </b-form-row>
                </form>
            </div>
            <div class="result" id="results"><br/>
                <b-card no-body v-if="listData">
                    <!-- / Table controls -->
                    <div class="table-result" >
                        <!-- Table -->
                        <div class="table-responsive mb-4">
                            <table class="table mb-0 table-bordered">
                                <thead class="" style="width: 100%">
                                <tr>
                                    <th>Quản lý</th>
                                    <th>Nhân Viên</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(dataConfig, idx) in listData" :key="idx">

                                        <td>{{dataConfig.leader_fullname}}</td>
                                        <td>{{dataConfig.staff_fullname}}</td>
                                        <td>
                                            <b-btn class="btn btn-md btn-outline-danger" @click="deleteConfig(dataConfig)"><i class="ion ion-md-trash"></i></b-btn>
                                        </td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <b-card-body class="pt-0 pb-3">
                            <div class="row">
                                <div class="col-sm pt-3">
                                    <b-pagination :total-rows="pageData.totalItems"
                                                  v-model="pageData.currentPage"
                                                  :per-page="pageData.perPage"
                                                  v-on:change="pageChanged"
                                    />
                                </div>
                                <div class="col-sm text-sm-left text-center pt-3">
                                    <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                                </div>
                            </div>
                        </b-card-body>
                        <!-- / Pagination -->
                    </div>
                </b-card>
                <div class="no-data" v-if="!listData">
                    Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
                </div>
                <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
            </div>
            <modal-create-config-leader-and-staff :trigger="showModal" @handleSuccess="showSuccess" @autoSearch="handleSearch"></modal-create-config-leader-and-staff>
        </div>
    </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>

import SelectExternalStations from 'components/pages/erp/staff/SelectExternalStations'
import SelectLeaderByStation from 'components/pages/erp/staff/SelectLeaderByStation'
import ModalCreateConfigLeaderAndStaff from 'components/pages/erp/staff/ModalCreateConfigLeaderAndStaff'
import StaffService from 'domain/services/staff-service'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'

export default {
  name: 'config-leader-and-staff',

  components: {
    SelectExternalStations,
    SelectLeaderByStation,
    ModalCreateConfigLeaderAndStaff,
    StaffService,
    LoadingMiniBottom
  },

  data: () => ({
    success: true,
    appLoading: false,
    selectedStation: '',
    selectedLeader: '',
    showModal: false,
    listData: [],
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    }
  }),

  methods: {

    handleSearch (data) {
      this.setSelectedStation(data.id_station)
      this.setSelectedLeader(data.id_leader)
      this.searchConfig(this.pageData.currentPage)
    },

    showSuccess (response) {
      this.$notify({
        group: 'default',
        type: response.data.success ? '' : 'bg-danger text-white',
        title: 'Thông báo',
        text: response.data.message
      })
    },

    openModal () {
      this.showModal = !this.showModal
    },

    setSelectedStation (stationIds) {
      this.selectedStation = stationIds
    },

    setSelectedLeader (leaderIds) {
      this.selectedLeader = leaderIds
    },

    pageChanged (page) { // Event check pagination change
      this.searchConfig(page)
      this.pageData.currentPage = page
    },

    searchConfig (page, newSearchConditions) {
      let dataSend = {
        'id_leader': this.selectedLeader,
        'page': page
      }

      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      // Enable loading
      this.$startLoading()
      StaffService.getListConfigByLeader(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listData = response.data.data
        } else {
          this.success = false
        }
      }).then(() => {
        this.$stopLoading()
      }).catch(e => {
        console.log(e)
      })
    },

    deleteConfig (config) {
      if (!confirm(`Bạn có chắc chắn muốn xóa config giữa quản lý ${config.leader_fullname} và ${config.staff_fullname} ?`)) {
        return
      }

      let dataConfig = {
        'id_leader': config.id_leader,
        'id_staff': config.id_staff
      }

      this.$startLoading()
      StaffService.updateConfigReportLineSingleStaff(dataConfig)
        .then(res => {
          if (res.data.success) {
            this.$notify({
              group: 'default',
              type: 'bg-success text-white',
              title: 'Thông báo',
              text: 'Xóa Config thành công'
            })
            this.searchConfig(this.pageData.currentPage)
          } else {
            this.$notify({
              group: 'default',
              type: 'bg-warning text-dark',
              title: 'Thông báo',
              text: res.data.message
            })
          }
        })
        .then(() => {
          this.appLoading = false
          this.$stopLoading()
        })
        .catch(e => {
          console.log(e)
        })
    }

  },

  created () {

  },

  computed: {
    totalItems () {
      return this.listData.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  }
}
</script>
<style scoped>

</style>
