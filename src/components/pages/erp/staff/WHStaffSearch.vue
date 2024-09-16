<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading">Tìm kiếm thông tin nhân viên xử lý hàng</h4>
            <div class="search-form">
                <form>
                    <b-form-row>
                        <b-form-group label="Chọn kho" class="col-md-4">
                            <select-stations :multiple="false" @selected="setSelectedStation" ref="select_stations" placehoder="Nhập kho cần tìm kiếm" ></select-stations>
                        </b-form-group>
                        <b-form-group label="Chọn nhóm được gán vào" class="col-md-4">
                            <select-module-stations :stationId="selectedStation" :multiple="true" @selected="setSelectedModuleStations" ref="select_modules_stations"></select-module-stations>
                        </b-form-group>
                        <b-form-group label="Chọn nhân viên xử lý hàng" class="col-md-4">
                            <select-wh-staff-by-module :moduleIds="selectedModuleStations" :multiple="true" @selected="setSelectedWhStaffsIds" ref="select_wh_staff"></select-wh-staff-by-module>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <div class="col-md mb-4">
                            <label class="form-label d-none d-md-block">Chọn Ngày Bắt Đầu </label>
                            <flat-pickr v-model="selected.start_date_time" :config="{altInput: true, animate: false}" placeholder="Chọn ngày"/>
                        </div>
                        <div class="col-md mb-4">
                            <label class="form-label d-none d-md-block">Chọn Ngày Kết Thúc </label>
                            <flat-pickr v-model="selected.end_date_time" :config="{altInput: true, animate: false}" placeholder="Chọn ngày"/>
                        </div>
                        <div class="col-md-4">
                            <b-form-group >
                                <label class="form-label">&nbsp;</label>
                                <div class="align-content-center center">
                                    <b-btn type="reset" @click="resetForm">Nhập lại</b-btn>
                                    <b-btn type="button" variant="primary" @click="searchUsers(pageData.currentPage, true, false)"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
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
                                        <th>Mã NV</th>
                                        <th>Họ tên</th>
                                        <th>Nhóm được gán vào</th>
                                        <th>Ngày</th>
                                        <th>Thời gian Sorting</th>
                                        <th>KPI Sorting</th>
                                        <th>Thời gian LXT</th>
                                        <th>Sản lượng LXT (thực tế)</th>
                                        <th>KPI quét kiểm bao (thực tế)</th>
                                        <th>KPI bắn hàng (thực tế)</th>
                                        <th>KPI bắn hàng nội miền (thực tế)</th>
                                        <th>KPI bắn hàng liên miền (thực tế)</th>
                                        <th>KPI sản lượng</th>
                                        <th>Thưởng chất lượng</th>
                                        <th>Quản Lý hiện tại</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="dataUser in listData" :key="dataUser.staff_code">
                                        <th scope="row" :data-user-id="dataUser.user_id">{{dataUser.staff_code}}</th>
                                        <td>
                                            <router-link :to="{name: 'edit-master-profile', params: { id: dataUser.master_profile_id }}" >{{dataUser.fullname}}</router-link>
                                        </td>
                                        <td>{{dataUser.child_module_alias}}</td>
                                        <td>{{dataUser.date}}</td>
                                        <td>{{dataUser.sorting_hours}}</td>
                                        <td>{{dataUser.sorting_kpi}}</td>
                                        <td>
<!--                                            <router-link :to="{}" v-b-modal.modal-detail @click.native="showPopup(dataUser.master_profile_id) ">{{dataUser.loading_hours}}</router-link>-->
                                            <router-link :to="{}" v-b-modal.modal-detail @click.native="showPopup(dataUser.user_id, dataUser.date) ">{{dataUser.loading_hours}}</router-link>
                                        </td>
                                        <td>{{dataUser.load_unloading_kpi}} - ({{dataUser.load_unloading_raw}})</td>
                                        <td>{{dataUser.verify_bag_kpi}} - ({{dataUser.verify_bag_raw}})</td>
                                        <td>{{dataUser.put_action_kpi}}</td>
                                        <td>{{dataUser.int_put_action_kpi}} - ({{dataUser.int_put_action_raw}})</td>
                                        <td>{{dataUser.ext_put_action_kpi}} - ({{dataUser.ext_put_action_raw}})</td>
                                        <td>{{dataUser.productivity_kpi}}</td>
                                        <td>{{dataUser.quality_reward}}</td>
                                        <td>{{dataUser.manager}}</td>
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
            <modal-detail-loading-kpi :requestData="requestData" :masterProfileId="userId"></modal-detail-loading-kpi>
        </div>
    </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import salaryService from 'domain/services/salary-service'
import Multiselect from 'vue-multiselect'
import InputTag from 'vue-input-tag'
import SelectUserGroup from 'components/elements/FilterBox/SelectUserGroup'
import SelectDepartmentAndPositionJob from 'components/elements/FilterBox/SelectDepartmentAndPositionJob'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectModuleStations from 'components/elements/FilterBox/SelectModuleStations'
import SelectWhStaffByModule from 'components/elements/FilterBox/SelectWhStaffByModule'
import ModalDetailLoadingKpi from 'components/pages/erp/profile/ModalDetailLoadingKpi'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import flatPickr from 'vue-flatpickr-component'
import VueMonthlyPicker from 'vue-monthly-picker'
import draggable from 'vuedraggable'

export default {
  name: 'whstaffsearch',
  components: {
    SelectStations,
    SelectModuleStations,
    SelectWhStaffByModule,
    SelectDepartmentAndPositionJob,
    SelectUserGroup,
    ModalDetailLoadingKpi,
    LoadingMiniBottom,
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    InputTag,
    draggable
  },
  data: () => ({
    success: true,
    appLoading: false,
    selectedMonth: '',
    selectedStation: '',
    selectedModuleStations: '',
    selectedWhStaffsIds: '',
    masterProfileId: '',
    userId: '',
    requestData: {
      id: null,
      date: null
    },
    user: {
      work_types: ''
    },
    listData: [],
    selected: {
      start_date_time: null,
      end_date_time: null
    },
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
    showPopup (userId, date) {
      this.userId = userId
      this.requestData.id = userId
      this.requestData.date = date
    },
    setSelectedStation (stationIds) {
      this.selectedStation = stationIds
    },
    setSelectedModuleStations (moduleIds) {
      this.selectedModuleStations = moduleIds
    },
    setSelectedWhStaffsIds (whstaffIds) {
      this.selectedWhStaffsIds = whstaffIds
    },
    pageChanged (page) { // Event check pagination change
      this.searchUsers(page)
      this.pageData.currentPage = page
    },
    searchUsers (page, newSearchConditions) {
      let dataSend = {
        'module_ids': this.selectedModuleStations,
        'user_ids': this.selectedWhStaffsIds,
        'start_date_time': this.selected.start_date_time,
        'end_date_time': this.selected.end_date_time,
        'page': page
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }
      // Enable loading
      this.$startLoading()
      salaryService.searchWHStaff(dataSend).then(response => {
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
    resetForm () {
      this.selected.range_time_fillter = null
      this.selected.range_time = null
      // Reset data of component select box
      this.$refs.select_stations.reset()
      this.$refs.select_modules_stations.reset()
      this.$refs.select_wh_staff.reset()
    },
    showDate (date) {
      this.selected.date = date
    }
  },
  created () {
    this.searchUsers(this.pageData.currentPage) // Get data users
  },
  computed: {
    totalItems () {
      return this.listData.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  metaInfo: {
    title: 'Tìm kiếm nhân viên'
  }
}
</script>
<style scoped>
    .center {
        margin: 0 auto;
    }

    .align-content-center {
        text-align: center;
    }
</style>
