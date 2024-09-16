<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading">Quản lý sale B2C</h4>
            <div class="search-form">
                <form>
                    <b-form-row>
                        <b-form-group label="Chọn quản lý sale B2C" class="col-md-12">
                            <select-b2c-sale-leader @selected="selectedLeader">
                            </select-b2c-sale-leader>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <!--Box chọn kho -->
                        <div class="col-md-3">
                            <b-form-group label="Chọn kho">
                                <select-stations @selected="selected.stations = $event" ref="select_stations" placehoder="Nhập kho cần tìm kiếm"></select-stations>
                            </b-form-group>
                        </div>
                        <b-form-group label="Họ tên" class="col-md-3">
                            <b-input type="text" placeholder="Nhập họ tên" v-model="user.fullname"/>
                        </b-form-group>
                        <b-form-group label="Tên đăng nhập" class="col-md-3">
                            <b-input type="text" placeholder="Nhập tên đăng nhập" v-model="user.username"/>
                        </b-form-group>
                        <div class="col-md-3">
                            <b-form-group label="&nbsp">
                                <b-form-select :options="filter_staff_options" v-model="selected.staff_type" :disabled="disableSelectFilterType"></b-form-select >
                            </b-form-group>
                        </div>
                    </b-form-row>
                    <b-form-row>
                        <div class="col-md-12">
                            <b-form-group label="&nbsp">
                                <div class="align-content-center center">
                                    <b-btn type="reset" @click="resetForm">Nhập lại</b-btn>
                                    <b-btn type="button" variant="primary" @click="searchSaleStaffs(pageData.currentPage, true, false)">
                                        <i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                                    </b-btn>
                                </div>
                            </b-form-group>
                        </div>
                    </b-form-row>
                </form>
            </div>
            <div class="result" id="results"><br/>
                <div class="col-sm text-sm-left text-center pt-3">
                    <span class="text-muted" v-if="pageData.totalItems">Tìm thấy {{ pageData.totalItems }} nhân viên</span>
                </div>
                <br/>
                <b-card no-body v-if="listUsers">
                    <!-- / Table controls -->
                    <div class="table-result" >
                        <!-- Table -->
                        <div class="table-responsive mb-4">
                            <table class="table mb-0 table-bordered">
                                <thead class="" style="width: 100%">
                                <tr>
                                    <th>Mã NV</th>
                                    <th>Thông tin</th>
                                    <th>Bộ phận</th>
                                    <th>Vị trí</th>
                                    <th>Kho</th>
                                    <th width="80px">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="dataUser in listUsers">
                                    <th scope="row" :data-user-id="dataUser.id">{{dataUser.staff_code}}</th>
                                    <td>
                                        <div>{{dataUser.fullname}}</div>
                                        <b-badge variant="outline-info">{{dataUser.username}} <span v-if="dataUser.personal_email">/</span> {{dataUser.personal_email}}</b-badge>
                                    </td>
                                    <td>{{dataUser.group}}</td>
                                    <td>{{dataUser.position}}</td>
                                    <td>{{dataUser.station}}</td>
                                    <td>
                                        <set-staff :staff_id="dataUser.id" :leader_id="leader.id" :force_update="countUpdate"></set-staff>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Pagination -->
                        <b-card-body class="pt-0 pb-3">
                            <div class="row">
                                <div class="col-sm pt-3">
                                    <b-pagination
                                        :total-rows="pageData.totalItems"
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
                <div class="no-data" v-if="!listUsers">
                    Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
                </div>
            </div>
        </div>
    </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import shopService from 'domain/services/shop-service'
import Multiselect from 'vue-multiselect'
import InputTag from 'vue-input-tag'
import SelectUserGroup from 'components/elements/FilterBox/SelectUserGroup'
import SelectDepartmentAndPositionJob from 'components/elements/FilterBox/SelectDepartmentAndPositionJob'
import SelectB2CSaleLeader from 'components/elements/FilterBox/SelectB2CSaleLeader'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SetStaffOfLeaderSaleB2C from 'components/elements/ActionBox/SetStaffOfLeaderSaleB2C'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import flatPickr from 'vue-flatpickr-component'
import VueMonthlyPicker from 'vue-monthly-picker'
import draggable from 'vuedraggable'

export default {
  name: 'AssignLeaderSaleB2C',
  components: {
    SelectStations,
    SelectDepartmentAndPositionJob,
    SelectUserGroup,
    LoadingMiniBottom,
    Multiselect,
    flatPickr,
    VueMonthlyPicker,
    InputTag,
    draggable,
    'select-b2c-sale-leader': SelectB2CSaleLeader,
    'set-staff': SetStaffOfLeaderSaleB2C
  },
  data: () => ({
    success: true,
    appLoading: false,
    leader: {
      id: ''
    },
    countUpdate: 0,
    disableSelectFilterType: true,
    user: {
      fullname: '',
      username: '',
      email: '',
      staff_code: '',
      national_id: '',
      work_status: ''
    },
    listUsers: [],
    selected: {
      null_default: null,
      stations: [],
      department: [],
      group: [],
      position_job: [],
      user_status: null,
      cod_status_id: null,
      province_group: null,
      range_time_fillter: null,
      range_time: null,
      staff_type: 0,
      leader_id: ''
    },
    filter_staff_options: [
      {value: '0', text: 'Hiện tất cả'},
      {value: '1', text: 'Chỉ hiện nhân viên'}
    ],
    user_status_options: [
      {value: null, text: 'Trạng thái user'},
      {value: '1', text: 'Bị khóa'},
      {value: '2', text: 'Chưa kích hoạt'},
      {value: '3', text: 'Đã kích hoạt'}
    ],
    cod_status_options: [
      {value: null, text: 'Trạng thái cod'},
      {value: '1', text: 'Đang thử việc'},
      {value: '2', text: 'Đang làm việc'},
      {value: '3', text: 'Đã nghỉ'},
      {value: '4', text: 'Cộng tác viên'}
    ],
    province_group_options: [
      {value: null, text: 'Chọn khu vực'},
      {value: 'hn_group', text: 'Hà nội'},
      {value: 'dn_group', text: 'Đà nẵng'},
      {value: 'hcm_group', text: 'HCM'},
      {value: 'mb_group', text: 'Miền bắc'},
      {value: 'mt_group', text: 'Miền trung'},
      {value: 'mn_group', text: 'Miền nam'}
    ],
    range_time_fillter_options: [
      {value: null, text: 'Options áp dụng time'},
      {value: 'join_date', text: 'Ngày vào'},
      {value: 'trial_date', text: 'Ngày thử việc'},
      {value: 'start_date_day', text: 'Ngày chính thức'},
      {value: 'resignation', text: 'Ngày nghỉ việc'},
      {value: 'ins_time', text: 'Thời gian đóng bảo hiểm'}
    ],
    rangeConfig: {
      mode: 'range',
      altInput: true,
      dateFormat: 'Y-m-d',
      altFormat: 'Y-m-d'
    },
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
      sortBy: 'id',
      sortDesc: false
    },
    export_file: false,
    listColumnsExport: []
  }),
  methods: {
    pageChanged (page) { // Event check pagination change
      this.searchSaleStaffs(page)
      this.pageData.currentPage = page
    },
    searchSaleStaffs (page, newSearchConditions) {
      let dataSend = {
        'full_name': this.user.fullname,
        'username': this.user.username,
        'national_id': this.user.national_id,
        'tel': this.user.tel,
        'email': this.user.email,
        'stations': this.selected.stations,
        'page': page,
        'staff_type': this.selected.staff_type
      }
      if (this.leader.id) {
        dataSend.leader_id = this.leader.id
      }
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      if (newSearchConditions) {
        this.pageData.currentPage = 1 // Set current page to 1
        dataSend.page = 1
      }

      if (this.selected.department !== null) {
        dataSend.department = this.selected.department
        if (this.selected.position_job !== null) {
          dataSend.position_job = this.selected.position_job
        }
      }

      // Enable loading
      this.$startLoading()
      this.countUpdate += 1

      shopService.searchSaleStaff(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listUsers = response.data.data
        } else {
          this.success = false
        }
      }).then(() => {
        this.$stopLoading()
        this.countUpdate += 1
      })
    },
    selectedLeader (result) {
      this.leader.id = parseInt(result)
      if (result) {
        this.disableSelectFilterType = false
      } else {
        this.disableSelectFilterType = true
      }
    },
    resetForm () {
      this.user.fullname = null
      this.user.username = null
      this.user.email = null
      this.selected.stations = []
      // Reset data of component select box
      this.$refs.select_stations.reset()
      this.$refs.select_groups.reset()
    },
    showDate (date) {
      this.selected.date = date
    }
  },
  created () {
    this.searchSaleStaffs(this.pageData.currentPage) // Get data users
  },
  computed: {
    totalItems () {
      return this.listUsers.length
    },
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },
  metaInfo: {
    title: 'Quản lý sale B2C'
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
