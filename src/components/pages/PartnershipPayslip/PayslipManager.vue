<template>
  <div class="payslip-manager-page">
    <div class="ui-block">
      <h4 class="d-flex justify-content-between align-items-center w-100 font-weight-bold py-3 mb-4">
        <div>Quản lý lương NV hợp đồng hợp tác kinh doanh</div>
      </h4>
      <div class="search-form">
        <div class="row mb-4">
          <div class="col-md-3">
            <b-input type="text" placeholder="Nhập họ tên" v-model="searchData.fullname"/>
          </div>
          <div class="col-md-3">
            <b-input type="text" placeholder="Nhập tên đăng nhập" v-model="searchData.username"/>
          </div>
          <div class="col-md-3">
            <b-select v-model="searchData.month" :options="listMonths" />
          </div>
          <div class="col-md-3">
            <b-select v-model="searchData.year" :options="listYears" />
          </div>
        </div>
        <div class="row">
          <!--Box chọn vùng miền -->
          <div class="col-md-4">
            <select-region-and-province
              @getRegion="setSelectedRegion"
              @getProvince="setSelectedProvince">
            </select-region-and-province>
          </div>
          <!--Box chọn kho -->
          <div class="col-md-2">
            <b-form-group label="Chọn kho">
              <select-stations :multiple="false" @selected="setSelectedStation"></select-stations>
            </b-form-group>
          </div>
          <!--Box chọn nhóm tài khoản -->
          <div class="col-md-2">
            <b-form-group label="Nhóm tài khoản">
              <select-user-group :multiple="false" @selected="setSelectedGroup"></select-user-group>
            </b-form-group>
          </div>
          <!--Box chọn vị trí công việc -->
          <div class="col-md-4">
            <select-department-and-position-job
              @getPositionJobName="setSelectedPositionJob"
              @getDepartment="setSelectedDepartment">
            </select-department-and-position-job>
          </div>
        </div>
        <div class="mb-4 text-center">
          <b-btn type="button" variant="primary" @click="search()"><i class="sidenav-icon ion ion-md-search"></i> Tìm kiếm</b-btn>
          <ladda-btn :loading="isProcessingExport" @click.native="exportExcel()" data-style="expand-right" class="btn btn-success">
            <i class="sidenav-icon ion ion-md-document"></i> Xuất excel
          </ladda-btn>
          <b-btn v-if="!isProcessingExport && this.fileExcel.length > 0" type="button" variant="outline-danger btn-download" :href="getDownloadExcelLink()">
            <i class="ion d-block ion-ios-cloud-download"></i>
          </b-btn>
          <ecom-btn-create-payslip :data-filter="searchData" class="d-inline-block"></ecom-btn-create-payslip>
        </div>
        <div class="mb-4">
          <b-btn class="btn btn-outline-danger" @click="deleteByConditions">Xóa theo theo điều kiện lọc</b-btn>
        </div>
      </div>

      <b-card no-body>
        <div class="table-responsive mb-4">
          <table class="table mb-0 table-bordered">
            <thead>
              <tr>
                <th>Mã đối tác</th>
                <th>Họ tên</th>
                <th>Tên đăng nhập</th>
                <th>Bộ phận</th>
                <th>Vị trí</th>
                <th>Tháng/Năm</th>
                <th>Doanh thu phân chia</th>
                <th>Thưởng doanh thu</th>
                <th>Thưởng chất lượng</th>
                <th>Thưởng đảm bảo</th>
                <th>Tổng thu nhập NET</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="listPayslips.length > 0">
              <tr v-for="payslip in listPayslips">
                <th>{{payslip.EmpProfile.staff_code}}</th>
                <td>{{payslip.User.fullname}}</td>
                <td>{{payslip.User.username}}</td>
                <td>{{payslip.EmpPosition.department}}</td>
                <td>{{payslip.EmpPosition.position_name}}</td>
                <td>{{payslip.EmpPartnershipPayslip.month + '/' + payslip.EmpPartnershipPayslip.year}}</td>
                <td v-numeral v-text="payslip.EmpPartnershipPayslip.kpi_salary"></td>
                <td v-numeral v-text="payslip.EmpPartnershipPayslip.pro_reward_salary"></td>
                <td v-numeral v-text="payslip.EmpPartnershipPayslip.quality_salary"></td>
                <td v-numeral v-text="payslip.EmpPartnershipPayslip.min_salary"></td>
                <td v-numeral v-text="payslip.EmpPartnershipPayslip.net_salary"></td>
                <td>
                  <b-badge variant="outline-success" v-if="payslip.EmpPartnershipPayslip.status === 'approved'">Đã duyệt</b-badge>
                  <b-badge variant="outline-secondary" v-if="payslip.EmpPartnershipPayslip.status === 'pending'">Đang chờ duyệt</b-badge>
                </td>
                <td>
                  <router-link :to="getLinkPayslipDetail(payslip)" class="btn btn-outline-info btn-sm">Xem</router-link>
                  <b-btn v-if="payslip.EmpPartnershipPayslip.status != 'approved'" class="btn btn-outline-danger btn-sm" @click="deletePayslip(payslip.EmpPartnershipPayslip.id)">Xóa</b-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <b-card-body class="pt-0 pb-3">
          <div class="row">
            <div class="col-sm text-sm-left text-center pt-3">
              <span class="text-muted" v-if="totalItems">Page {{ currentPage }} of {{ totalPages }}</span>
            </div>
            <div class="col-sm pt-3">
              <b-pagination class="justify-content-center justify-content-sm-end m-0"
                  v-if="totalItems"
                  v-model="currentPage"
                  :total-rows="totalItems"
                  :per-page="perPage"
                  v-on:change="search"
                  size="sm"/>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import partnershipService from 'domain/services/partnership-payslip-service'
import LaddaBtn from '@/vendor/libs/ladda/Ladda'
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SelectUserGroup from 'components/elements/FilterBox/SelectUserGroup'
import SelectDepartmentAndPositionJob from 'components/elements/FilterBox/SelectDepartmentAndPositionJob'
import SelectRegionAndProvince from 'components/elements/FilterBox/SelectRegionAndProvince'
import EcomBtnCreatePayslip from 'components/pages/PartnershipPayslip/BtnCreatePayslip'

export default {
  name: 'ecom-partnership-manager',

  metaInfo: {
    title: 'Quản lý lương NV hợp đồng hợp tác kinh doanh'
  },

  components: {
    LaddaBtn,
    SelectStations,
    SelectDepartmentAndPositionJob,
    SelectUserGroup,
    SelectRegionAndProvince,
    EcomBtnCreatePayslip
  },

  data () {
    return {
      searchData: {
        fullname: '',
        username: '',
        month: '',
        year: moment().year(),
        region: '',
        provinces: [],
        stations: [],
        groupId: '',
        department: '',
        position_job: ''
      },
      listMonths: this.getListMonths(),
      listYears: this.getListYears(),
      listPayslips: [],
      totalItems: 0,
      currentPage: 1,
      perPage: 10,
      jobId: null,
      isProcessingExport: false,
      fileExcel: '',
      clockExport: null
    }
  },

  computed: {
    totalPages () {
      return Math.ceil(this.totalItems / this.perPage)
    }
  },

  created () {
    this.search(1)
  },

  methods: {
    setSelectedRegion (regionId) {
      this.searchData.region = regionId
    },

    setSelectedProvince (provinceIds) {
      this.searchData.provinces = provinceIds
    },

    setSelectedStation (stationIds) {
      this.searchData.stations = stationIds
    },

    setSelectedGroup (groupId) {
      this.searchData.groupId = groupId
    },

    setSelectedDepartment (department) {
      this.searchData.department = department
    },

    setSelectedPositionJob (positionJob) {
      this.searchData.positionJob = positionJob
    },

    /**
     * Search payslip
     *
     * @param page
     */
    search (page = 1) {
      this.$startLoading()
      this.currentPage = page
      let dataSearch = {
        page: this.currentPage,
        limit: this.perPage,
        fullname: this.searchData.fullname,
        username: this.searchData.username,
        month: this.searchData.month,
        year: this.searchData.year,
        region: this.searchData.region,
        provinces: this.searchData.provinces,
        stations: this.searchData.stations,
        group_id: this.searchData.groupId,
        department: this.searchData.department,
        position_job: this.searchData.positionJob
      }

      partnershipService.getList(dataSearch).then((response) => {
        if (response.data.success) {
          this.listPayslips = response.data.list_payslips
          this.totalItems = response.data.total
        }
      }).then(() => {
        this.$stopLoading()
      })
    },

    getLinkPayslipDetail (payslip) {
      return `/erp/partnership-payslip/detail/${payslip.EmpPartnershipPayslip.id}`
    },

    getListMonths () {
      let listMonths = [{
        value: '',
        text: 'Chọn tháng'
      }]
      for (let i = 1; i <= 12; i++) {
        listMonths.push({
          value: i,
          text: i
        })
      }

      return listMonths
    },

    getListYears () {
      let listYears = [{
        value: '',
        text: 'Chọn năm'
      }]
      for (let i = 2015; i <= moment().year(); i++) {
        listYears.push({
          value: i,
          text: i
        })
      }

      return listYears
    },

    /**
     * Request export excel
     */
    exportExcel () {
      if (this.isProcessingExport) {
        return
      }

      this.isProcessingExport = true
      this.$startLoading()
      let dataSearch = {
        fullname: this.searchData.fullname,
        username: this.searchData.username,
        month: this.searchData.month,
        year: this.searchData.year,
        region: this.searchData.region,
        provinces: this.searchData.provinces,
        stations: this.searchData.stations,
        group_id: this.searchData.groupId,
        department: this.searchData.department,
        position_job: this.searchData.positionJob
      }

      partnershipService.requestExportFile(dataSearch).then((response) => {
        if (response.data.success) {
          this.jobId = response.data.data.job_id
          this.clockExport = setInterval(() => {
            this.checkExportFileComplete()
          }, 1500)
        } else {
          this.isProcessingExport = false
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => { // eslint-disable-line
        this.isProcessingExport = false
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra trong quá trình xuất excel'
        })
      }).then(() => {
        this.$stopLoading()
      })
    },

    /**
     * Check export file complete
     */
    checkExportFileComplete () {
      const data = {
        job_id: this.jobId
      }
      partnershipService.checkExportFileComplete(data).then((response) => {
        if (response.data.success) {
          let status = response.data.data.status
          let filePath = response.data.data.file_path
          if (status === 'closed') {
            clearInterval(this.clockExport)
            if (filePath && filePath.length > 0) {
              this.isProcessingExport = false
              this.fileExcel = filePath

              this.$notify({
                group: 'default',
                type: 'bg-success text-white',
                title: 'Thông báo',
                text: 'Đã hoàn thành quá trình xuất file excel bảng lương'
              })
            }
          }
        } else {
          clearInterval(this.clockExport)
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.data.message
          })
        }
      }).then(() => {
        this.$stopLoading()
      })
    },

    getDownloadExcelLink () {
      return partnershipService.getDownloadExcelLink(this.fileExcel)
    },

    deletePayslip (id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này không?')) {
        return
      }

      this.$startLoading()
      partnershipService.delete(id).then((response) => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: 'Đã xóa thành công'
          })
          this.search(this.currentPage)
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => { // eslint-disable-line
        this.isProcessingExport = false
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra trong quá trình xóa bảng lương'
        })
      }).then(() => {
        this.$stopLoading()
      })
    },

    /**
     * Xóa bảng lương theo điều kiện lọc
     */
    deleteByConditions () {
      if (!confirm('Bạn có chắc chắn muốn xóa các bảng lương theo điều kiện lọc này không?')) {
        return
      }

      let dataSearch = {
        fullname: this.searchData.fullname,
        username: this.searchData.username,
        month: this.searchData.month,
        year: this.searchData.year,
        region: this.searchData.region,
        provinces: this.searchData.provinces,
        stations: this.searchData.stations,
        group_id: this.searchData.groupId,
        department: this.searchData.department,
        position_job: this.searchData.positionJob
      }

      this.$startLoading()
      partnershipService.deleteByConditions(dataSearch).then((response) => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: 'Đã xóa thành công'
          })
          this.search(this.currentPage)
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: response.data.message
          })
        }
      }).catch((error) => { // eslint-disable-line
        this.isProcessingExport = false
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra trong quá trình xóa bảng lương'
        })
      }).then(() => {
        this.$stopLoading()
      })
    }
  }

}
</script>

<style lang="scss">
  .payslip-manager-page {
    .search-form {
      .col-form-label {
        display: none !important;
      }
    }
    .btn-download {
      height: 38px;
      line-height: 38px;
    }
  }
</style>
