<template>
    <div>
        <div class="ui-block">
            <h4 class="ui-block-heading">Tìm kiếm nhân viên</h4>
            <div class="search-form-staff">
                <form>
                    <b-form-row>
                        <b-form-group label="Họ tên" class="col-md-2">
                            <b-input type="text" placeholder="Nhập họ tên" v-model="user.fullname"/>
                        </b-form-group>
                        <b-form-group label="Chứng minh thư hoặc hộ chiếu"  class="col-md-2">
                            <b-input placeholder="Nhập chứng minh thư hoặc hộ chiếu" v-model="user.national_id" />
                        </b-form-group>
                        <b-form-group label="Mã nhân viên" class="col-md-2">
                            <b-input type="text" placeholder="Nhập mã nhân viên" v-model="user.staff_code"/>
                        </b-form-group>
                        <b-form-group label="Tên đăng nhập" class="col-md-2">
                            <b-input type="text" placeholder="Nhập tên đăng nhập" v-model="user.username"/>
                        </b-form-group>
                        <b-form-group label="Số điện thoại" class="col-md-2">
                            <b-input type="text" placeholder="Nhập số điện thoại" v-model="user.tel"/>
                        </b-form-group>
                        <b-form-group label="Email ghtk" class="col-md-2">
                            <b-input type="email" placeholder="Email" v-model="user.email"/>
                        </b-form-group>
                    </b-form-row>
                    <b-form-row>
                        <!--Box chọn kho -->
                        <div class="col-md-2">
                          <b-form-group label="Chọn kho">
                            <select-stations @selected="selected.stations = $event" ref="select_stations" placehoder="Nhập kho cần tìm kiếm"></select-stations>
                          </b-form-group>
                        </div>
                        <!--Box chọn nhóm tài khoản -->
                        <div class="col-md-2">
                          <b-form-group label="Nhóm tài khoản">
                            <select-user-group :multiple="false" @selected="selected.group = $event" ref="select_groups"></select-user-group>
                          </b-form-group>
                        </div>
                        <!--Box chọn vị trí công việc -->
                        <div class="col-md-4">
                            <select-department-and-position-job
                                    @getPositionJobName="selected.position_job = $event"
                                    @getDepartment="selected.department = $event"
                                    ref="select_position_jobs">
                            </select-department-and-position-job>
                        </div>
                        <div class="col-md-2">
                            <b-form-group label="Trạng thái tài khoản(User)">
                                <b-form-select v-model="selected.user_status" :options="user_status_options"></b-form-select >
                            </b-form-group>
                        </div>
                        <div class="col-md-2">
                            <b-form-group label="Trạng thái COD">
                                <b-form-select v-model="selected.cod_status_id" :options="cod_status_options"></b-form-select >
                            </b-form-group>
                        </div>
                    </b-form-row>
                    <b-form-row>
                        <div class="col-md-2">
                            <b-form-group label="Khu vực">
                                <b-form-select v-model="selected.province_group" :options="province_group_options"></b-form-select >
                            </b-form-group>
                        </div>
                        <div>
                            <b-form-group label="Lọc thời gian với options">
                                <b-form-select v-model="selected.range_time_filter" :options="range_time_filter_options"></b-form-select >
                            </b-form-group>
                        </div>
                        <div class="col-md mb-4">
                            <b-form-group label="Lọc thời gian với options">
                                <flat-pickr v-model="selected.range_time" :config="rangeConfig" placeholder="Chọn khoảng thời gian" />
                            </b-form-group>
                        </div>
                        <div class="col-md-4">
                            <b-form-group>
                                <span slot="label">&nbsp;</span>
                                <div class="text-right center">
                                    <b-btn type="reset" @click="resetForm">Nhập lại</b-btn>
                                    <b-btn v-if="allowExport" type="reset" @click="showOptionsExp">Tùy chọn xuất excel</b-btn>
                                    <b-btn type="button" variant="primary" @click="searchUsers(pageData.currentPage, true, false)"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
                                </div>
                            </b-form-group>
                        </div>
                    </b-form-row>
                    <b-modal ref="expandExport" modal-class="modal-slide" hide-footer static>
                        <div slot="modal-title"><p class="text-center text-big mb-4">Columns file Excel</p></div>
                        <div class="drag">
                            <draggable v-model="listColumnsExport" class="dragArea" :options="{group:'colums'}" style="background: #92d9ff; min-height: 30px">
                                <div v-for="(element, idx) in listColumnsExport" style="line-height: 0.7" :key="idx">
                                    <li class="list-group-item"><span>{{element.name}}</span>
                                        <button type="reset" style="float: right" @click="removeColums(idx)">X</button>
                                    </li>
                                </div>
                            </draggable>
                        </div>
                        <div class="align-content-center center">
                            <b-btn type="button" variant="primary" @click="searchUsers(pageData.currentPage, true, true)"><i class="sidenav-icon ion ion-ios-document"></i> Xuất file</b-btn>
                        </div>
                    </b-modal>
                </form>
            </div>
            <div class="result" id="results"><br/>
                    <b-card no-body v-if="listUsers">
                        <!-- / Table controls -->
                        <div class="table-result" >
                        <!-- Table -->
                            <div class="table-responsive mb-4">
                                <table class="table mb-0 table-bordered">
                                    <thead class="" style="width: 100%">
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Họ tên</th>
                                        <th>Tên đăng nhập</th>
                                        <!--<th>SĐT</th>-->
                                        <th>Email</th>
                                        <!--<th>CMT/Hộ chiếu</th>-->
                                        <th>Bộ phận</th>
                                        <th>Vị trí</th>
                                        <th>Kho</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="dataUser in listUsers" :key="dataUser.id">
                                        <th scope="row" :data-user-id="dataUser.id">{{dataUser.staff_code}}</th>
                                        <td>{{dataUser.fullname}}</td>
                                        <td>{{dataUser.username}}</td>
                                        <!--<td>{{dataUser.tel}}</td>-->
                                        <td>{{dataUser.email}}</td>
                                        <!--<th>{{dataUser.personal_id}}</th>-->
                                        <td>{{dataUser.group}}</td>
                                        <td>{{dataUser.position}}</td>
                                        <td>{{dataUser.station}}</td>
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
                    <div class="no-data" v-if="!listUsers">
                        Không có dữ liệu phù hợp, vui lòng thử lại với điều kiện tìm kiếm khác.
                    </div>
                    <loading-mini-bottom :enable="appLoading"></loading-mini-bottom>
            </div>
        </div>
    </div>
</template>
<style src="@/vendor/libs/vue-flatpickr-component/vue-flatpickr-component.scss" lang="scss"></style>
<script>
import staffService from 'domain/services/staff-service'
import Multiselect from 'vue-multiselect'
import InputTag from 'vue-input-tag'
import SelectUserGroup from 'components/elements/FilterBox/SelectUserGroup'
import SelectDepartmentAndPositionJob from 'components/elements/FilterBox/SelectDepartmentAndPositionJob'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import LoadingMiniBottom from 'components/elements/loading/LoadingMiniBottom'
import flatPickr from 'vue-flatpickr-component'
import VueMonthlyPicker from 'vue-monthly-picker'
import draggable from 'vuedraggable'

export default {
  name: 'staffsearch',
  components: {
    SelectStations,
    SelectDepartmentAndPositionJob,
    SelectUserGroup,
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
      range_time_filter: null,
      range_time: null
    },
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
    range_time_filter_options: [
      {value: null, text: 'Options áp dụng time'},
      {value: 'created_time', text: 'Ngày tạo user'},
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
    listColumnsExport: [],
    expandExport: true,
    allowExport: false

  }),
  methods: {
    getListColumnsExport () {
      staffService.getListColumnsExport().then(response => {
        if (response.data.success) {
          this.listColumnsExport = response.data.listcolums
        }
      }).catch(error => {
        console.log(error)
      })
    },
    pageChanged (page) { // Event check pagination change
      this.searchUsers(page)
      this.pageData.currentPage = page
    },
    searchUsers (page, newSearchConditions, isExport) {
      let rangeTime = null
      if (this.selected.range_time != null) {
        rangeTime = this.selected.range_time.split('to')
      }
      let dataSend = {
        'full_name': this.user.fullname,
        'staff_code': this.user.staff_code,
        'username': this.user.username,
        'national_id': this.user.national_id,
        'tel': this.user.tel,
        'email': this.user.email,
        'department': this.selected.department,
        'position_job': this.selected.position_job,
        'group_id': this.selected.group,
        'stations': this.selected.stations,
        'province_group': this.selected.province_group,
        'user_status': this.selected.user_status,
        'cod_status_id': this.selected.cod_status_id,
        'range_time_filter': this.selected.range_time_filter,
        'range_time': rangeTime,
        'page': page,
        'coloums_export': this.listColumnsExport
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
      if (isExport) {
        staffService.exportExcel(dataSend).then(response => {
          if (response.data.success) {
            window.open(response.data.path_file, '_blank')
          } else {
            this.success = false
          }
        }).then(() => {
          this.$stopLoading()
        })
      } else {
        staffService.searchStaff(dataSend).then(response => {
          if (response.data.success) {
            this.pageData.totalItems = response.data.pagination.total
            this.pageData.perPage = response.data.pagination.per_page
            this.pageData.totalPages = response.data.pagination.total_page
            this.listUsers = response.data.data
            this.allowExport = response.data.permissions.export
          } else {
            this.success = false
          }
        }).then(() => {
          this.$stopLoading()
        })
      }
    },
    showOptionsExp () {
      this.$refs.expandExport.show()
    },
    removeColums (index) {
      this.listColumnsExport.splice(index, 1)
    },
    resetForm () {
      this.user.fullname = null
      this.user.national_id = null
      this.user.staff_code = null
      this.user.username = null
      this.user.tel = null
      this.user.email = null
      this.selected.stations = []
      this.selected.department = null
      this.selected.position_job = null
      this.selected.province_group = null
      this.selected.user_status = null
      this.selected.cod_status_id = null
      this.selected.range_time_filter = null
      this.selected.range_time = null
      // Reset data of component select box
      this.$refs.select_stations.reset()
      this.$refs.select_groups.reset()
      this.$refs.select_position_jobs.reset()
    },
    showDate (date) {
      this.selected.date = date
    }
  },
  created () {
    this.searchUsers(this.pageData.currentPage) // Get data users
    this.getListColumnsExport()
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
