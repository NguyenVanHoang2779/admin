<template>
  <div>
    <b-modal id="modal-statistic-detail-info" modal-class="modal-xl" :title="title[dataType]" hide-footer @show="getData">
        <div class="search-form-statistic">
          <form>
            <b-form-row>
              <b-form-group class="col-md-2">
                <b-input placeholder="Mã nhân viên/CMND/Hộ chiếu" v-model="search.national_id_staff_code"/>
              </b-form-group>
              <b-form-group class="col-md-2">
                <b-input type="text" placeholder="Họ tên/Username" v-model="search.fullname_username"/>
              </b-form-group>
              <div class="col-md-2">
                <single-select-province @handleSelectedProvince="handleSelectedProvince" :province-id="search.province_id"></single-select-province>
              </div>
              <div class="col-md-2">
                <b-form-group>
                  <multi-select-station
                    @handleStationSelected="handleStationSelected"
                    :province-ids="search.province_id">
                  </multi-select-station>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <select-department-and-position-job
                  @getPositionJobName="search.position_job = $event"
                  @getDepartment="search.department = $event"
                  ref="select_position_jobs">
                </select-department-and-position-job>
              </div>
            </b-form-row>
            <b-form-row>
                <div class="col-md-8">
                  <div>
                    <b-pagination
                      :total-rows="pageData.totalItems"
                      v-model="pageData.currentPage"
                      :per-page="pageData.perPage"
                      v-on:change="pageChanged"
                    />
                  </div>
                  <div class="text-sm-left text-center">
                    <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
                  </div>
                </div>
              <div class="text-right col-md-4">
                <b-btn type="button" variant="primary" @click="searchUsers(pageData.currentPage, true)"><i
                  class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
                </b-btn>
                <b-btn type="reset" @click="resetForm">Xóa bộ lọc</b-btn>
              </div>
            </b-form-row>
          </form>
        </div>
        <div>
          <b-card no-body v-if="listUsers">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                <tr>
                  <th v-if="configTable.fields.master_profile_id">Mã NV</th>
                  <th>Họ tên</th>
                  <th>Vị trí</th>
                  <th v-if="configTable.fields.station">Kho</th>
                  <th v-if="configTable.fields.contract_type">Loại hợp đồng</th>
                  <th v-if="configTable.fields.documents">Cần bổ xung</th>
                  <th v-if="configTable.fields.dependant_status">trạng thái NPT</th>
                  <th v-if="configTable.fields.province_register">Nơi đăng kí</th>
                  <th v-if="configTable.fields.apply_date">Ngày ứng tuyển</th>
                  <th v-if="configTable.fields.resign_date">Ngày nghỉ việc</th>
                  <th v-if="configTable.fields.contract_date">Ký HĐ chính thức</th>
                  <th v-if="configTable.fields.resign_reason">Lý do nghỉ việc</th>
                  <th v-if="configTable.fields.source">nguồn</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(dataUser, index) in listUsers" :key="index">
                  <td v-if="configTable.fields.master_profile_id">Mã NV</td>
                  <td>{{dataUser.fullname}}</td>
                  <td>{{dataUser.position}}</td>
                  <td v-if="configTable.fields.station">Kho</td>
                  <td v-if="configTable.fields.contract_type">Loại hợp đồng</td>
                  <td v-if="configTable.fields.documents">Cần bổ xung</td>
                  <td v-if="configTable.fields.dependant_status">trạng thái NPT</td>
                  <td v-if="configTable.fields.province_register">Nơi đăng kí</td>
                  <td v-if="configTable.fields.apply_date">Ngày ứng tuyển</td>
                  <td v-if="configTable.fields.resign_date">Ngày nghỉ việc</td>
                  <td v-if="configTable.fields.contract_date">Ký HĐ chính thức</td>
                  <td v-if="configTable.fields.resign_reason">Lý do nghỉ việc</td>
                  <td v-if="configTable.fields.source">nguồn</td>
                  <td><b-btn variant="primary" > Chi tiết </b-btn></td>
                </tr>
                </tbody>
              </table>
              <div class="text-center mt-3" v-if="!listUsers || listUsers.length === 0"><b>Không có dữ liệu</b></div>
            </div>
          </b-card>
        </div>
    </b-modal>
  </div>
</template>
<script>
import insuranceService from 'domain/services/insurance-service'
import SelectDepartmentAndPositionJob from 'components/elements/FilterBox/SelectDepartmentAndPositionJob'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import SingleSelectProvince from 'components/elements/common/SingleSelectProvince'
import moment from 'moment'
// import Datepicker from 'vuejs-datepicker'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'modal-statistic-detail-info',

  props: {
    dataType: {
      default: null,
      type: String
    }
  },

  components: {
    MultiSelectStation,
    commonHelper,
    SelectDepartmentAndPositionJob,
    SingleSelectProvince
  },

  data: () => ({
    title: {
      insurance: 'Thông tin bảo hiểm nhân viên',
      dependant: 'Thông tin người phụ thuộc của nhân viên',
      employeeDocument: 'Thông tin hồ sơ cần hoàn thiện của nhân viên',
      candidate: 'Thông tin ứng tuyển',
      employeeWorking: 'Thông tin nhân viên đang làm việc',
      employeeResign: 'Thông tin nhân viên nghỉ việc'
    },
    configTable: {
      fields: {},
      data: {}
    },
    listUsers: [],
    search: {
      fullname_username: '',
      national_id_staff_code: '',
      province_id: null,
      station_id: [],
      department: null,
      position_job: null
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

  created () {
  },

  watch: {
    dataType: function (newValue, oldValue) {
      switch (newValue) {
        case 'insurance':
          this.configTable = {
            fields: {
              master_profile_id: true
            }
          }
          break
        case 'dependant':
          this.configTable = {
            fields: {
              master_profile_id: true,
              dependant_status: true
            }
          }
          break
        case 'employeeDocument':
          this.configTable = {
            fields: {
              master_profile_id: true,
              documents: true
            }
          }
          break
        case 'candidate':
          this.configTable = {
            fields: {
              province_register: true,
              apply_date: true,
              source: true
            }
          }
          break
        case 'employeeWorking':
          this.configTable = {
            fields: {
              master_profile_id: true,
              station: true,
              contract_type: true,
              contract_date: true
            }
          }
          break
        case 'employeeResign':
          this.configTable = {
            fields: {
              master_profile_id: true,
              station: true,
              contract_type: true,
              contract_date: true,
              resign_reason: true
            }
          }
          break
      }
    }
  },

  methods: {
    moment (data, month) {
      if (month && data) return moment(data).format('MM/YYYY')
      if (data) { return moment(data).format('DD/MM/YYYY') }
    },

    pageChanged: function (page) { // Event check pagination change
      this.searchUsers(page)
      this.pageData.currentPage = page
    },

    searchUsers (page, newSearchConditions) {
      this.$startLoading()
      let dataSend = {
        'fullname_username': this.search.fullname_username,
        'national_id_staff_code': this.search.national_id_staff_code,
        'province_id': this.search.province_id,
        'position_job': this.search.position_job,
        'stations': this.search.stations,
        'page': page
      }
      insuranceService.insuranceCheck(dataSend).then(response => {
        if (response.data.success) {
          this.pageData.totalItems = response.data.pagination.total
          this.pageData.perPage = response.data.pagination.per_page
          this.pageData.totalPages = response.data.pagination.total_page
          this.listUsers = response.data.data
        }
      }).then(() => {
        this.$stopLoading()
      })
    },

    resetForm () {
      this.search.fullname_username = null
      this.search.national_id_staff_code = null
      this.search.station_id = []
      this.search.department = null
      this.search.position_job = null
      this.search.province_id = null
      // Reset data of component select box
      this.$refs.select_stations.reset()
      this.$refs.select_position_jobs.reset()
    },

    handleSelectedProvince (option) {
      this.search.province_id = option ? option.id : null
    },

    handleStationSelected (options) {
      this.search.station_id = []
      if (Array.isArray(options)) options.map((item) => this.search.station_id.push(item.id))
    },

    getData () {
    }
  }
}
</script>
<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>
<style lang="scss">
  .center {
    margin: 0 auto;
  }
  .search-form-statistic {
    .col-form-label {
      display: none !important;
    }
  }
  .loader-export-excel-insurance {
    vertical-align: sub;
    display: inline-block;
    border: 4px solid #f3f3f3;
    border-radius: 50%;
    border-top: 4px solid #26b4ff;
    border-bottom: 4px solid #26b4ff;
    width: 15px;
    height: 15px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
  }

  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
