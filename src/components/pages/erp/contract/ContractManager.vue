<template>
  <div class="small-scrollbar">
    <b-row>
      <b-col md=6>
        <h4 class="ui-block-heading">Quản lý hợp đồng</h4>
      </b-col>
      <b-col md="6" class="text-right">
        <b-btn
          v-if="allowUploadFileSalary !== false"
          @click="uploadSalaryFile"
          variant="ghtk"
        >
          <i class="fas" :class="{'fa-upload': !uploadStatus, 'fa-check': uploadStatus === 'closed', 'fa-spinner fa-spin' : uploadStatus === 'open'}"></i>
          {{ !uploadStatus || uploadStatus === 'open' ? 'Upload lương HĐ nhân viên' : uploadStatus === 'closed' ? 'Đã cập nhật xong lương' : '' }}
        </b-btn>
        <b-btn :to="{path: '/contract/create'}" variant="ghtk"><i class="fas fa-plus"></i> Thêm mới</b-btn>
      </b-col>
    </b-row>
    <hr>
    <b-row class="pb-2 multiselect-ghtk">
      <b-col sm="4" md="3" lg="2" class="mb-1">
        <input placeholder="CMND/Mã Profile" v-model="search.cmnd_profile_id" type="number" max="12" @keyup.enter="getContract()" class="form-control"/>
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <input type="text" placeholder="Username/Họ tên" v-model="search.username_name" @keyup.enter="getContract()" class="form-control" />
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <input type="text" placeholder="Mã hợp đồng" v-model="search.contract_number" @keyup.enter="getContract()" class="form-control" />
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <multi-select-region :regions="search.region" @handleSelectedRegion="region => (search.region = region ? region.map(re => re.id).toString() : null)"></multi-select-region>
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <multi-select-province :province-ids="search.province" @handleProvinceSelected="province => (search.province = province ? province.map(pro => pro.id).toString() : null)"></multi-select-province>
      </b-col>
      <b-col sm="4" md="3" lg="2" class="mb-1">
        <multi-select-station :province-ids="search.province" :station-ids="search.station" @handleStationSelected="station => (search.station = station ? station.map(sta => sta.id).toString() : null)"></multi-select-station>
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <multi-select-department :department-ids="search.department" @handleDepartmentSelected="department => (search.department = department ? department.map(dep => dep.id).toString() : null)"></multi-select-department>
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <multi-select-position :department-ids="search.department" :position-ids="search.position" @handlePositionSelected="position => (search.position = position ? position.map(pos => pos.id).toString() : null)"></multi-select-position>
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <select-contract-type :contract-type="search.contract_type" @input="type => (search.contract_type = type ? type.value : null)"></select-contract-type>
      </b-col>
      <b-col sm="4" md="3" lg="2">
        <multiselect class="multiselect-primary"
          v-model="printStatusSearch"
          :options="printOptions"
          placeholder="Trạng thái in"
          label="desc"
          track-by="value"
          selectedLabel=""
          deselectLabel="X"
          selectLabel=""
          @input="val => {search.print_status = val ? val.value : null}"
        >
          <span slot="noResult">Rất tiếc. Không tìm thấy.</span>
          <span class="placeholder" slot="placeholder">Trạng thái in</span>
        </multiselect>
      </b-col>
      <b-col sm="8" md="6" lg="4" class="text-right">
        <b-btn variant="ghtk" @click="getContract()"><i class="fas fa-search"></i> Tìm kiếm</b-btn>
        <b-btn variant="light" @click="resetSearch()"><i class="fas fa-eraser"></i> Xóa lọc</b-btn>
      </b-col>
    </b-row>

    <!-- table -->
    <b-card no-body>
      <div class="paging">
        <b-row v-if="page.total" class="mt-1">
          <b-col md="6" class="z-0">
            <b-pagination
              :total-rows="page.total"
              v-model="page.current"
              :per-page="page.per"
              @change="getContract()"
              class="mb-1"
              size="sm"
              align="left"
            />
          </b-col>
          <b-col md="6" class="text-right page-status align-middle text-muted">
            <b>Trang {{ page.current }}/{{ Math.ceil(page.total/page.per) }}</b>
          </b-col>
        </b-row>
      </div>

      <table class="table table-bordered table-hover font-weight-bold table-responsive-lg mb-0">
        <thead class="table-header-ghtk">
          <tr>
            <th class="text-center">Mã Profile</th>
            <th class="text-center">Họ tên</th>
            <th class="text-center">CMND</th>
            <th class="text-center">kho</th>
            <th class="text-center">Vị trí</th>
            <th class="text-center">Chức vụ</th>
            <th class="text-center">Lương thử việc</th>
            <th class="text-center">Tính KPI</th>
            <th class="text-center">Lương chính thức</th>
            <th class="text-center">Phụ cấp</th>
            <th class="text-center">Tình trạng</th>
            <th class="text-center">Chi tiết</th>
          </tr>
        </thead>
        <tbody class="position-relative" v-loading="loading">
          <tr v-for="(staff, idx) in contracts" :key="idx">
            <td class="text-center">{{ staff.id }}</td>
            <td>{{ staff.fullname }} ({{ staff.username }})</td>
            <td>{{ staff.personalId }}</td>
            <td>{{ staff.station }}</td>
            <td>{{ staff.position }}</td>
            <td>{{ staff.duty }}</td>
            <td>{{ formatMoney(staff.trialSalary) }}</td>
            <td>{{ staff.hasKpi }}</td>
            <td>{{ formatMoney(staff.salary) }}</td>
            <td>{{ formatMoney(staff.biztripAllowance + staff.mealAllowance + staff.transAllowance + staff.respAllowance + staff.mobileAllowance) }}</td>
            <td class="text-center">
              <b-badge :variant="getVariant(staff.printStatus)" class="w-5re">
                {{ printStatus[staff.printStatus] || (!staff.contractId ? 'Chưa có HĐ' : '')  }}
              </b-badge>
            </td>
            <td class="text-center">
              <b-btn variant="outline-ghtk" title="Xem chi tiết hợp đồng" @click="openDetailContract(staff)" size="sm" class="mb-1">
                <i class="fas fa-pencil-alt"></i>
              </b-btn>
              <span v-if="staff.contractId">
              </span>
              <span v-else>
                <router-link v-if="staff.username" :to="{name: 'contract-create', params: { username: staff.username }}" class="btn btn-sm btn-outline-ghtk mb-1">
                  <i class="ion ion-md-add"></i>
                </router-link>
                <router-link v-else :to="{name: 'contract-create'}" class="btn btn-sm btn-outline-ghtk">
                  <i class="ion ion-md-add"></i>
                </router-link>
              </span>
            </td>
          </tr>
          <tr v-show="loading || !contracts || !contracts.length">
            <td class="text-center align-middle font-line h-25vh" colspan="100">
              <b v-show="!loading">Rất tiếc, Không có bản ghi nào !</b>
            </td>
          </tr>
        </tbody>
      </table>
    </b-card>
    <!-- modal -->
    <modal-detail-contract
      id="detail-contract"
      :profile="currentProfile"
      @update-salary="updateSalary"
    ></modal-detail-contract>
    <modal-upload-salary
      id="upload-salary-file"
      @uploadSalaryStatus="val => (uploadStatus = val)"
    ></modal-upload-salary>
  </div>
</template>

<style lang="css" scoped>
</style>

<script>
import staffService from 'domain/services/staff-service'
import commonHelper from 'infrastructures/helpers/common-helpers'

import Contract from 'domain/entities/Contract'

import MultiSelectRegion from 'components/elements/common/MultiSelectRegion'
import MultiSelectProvince from 'components/elements/common/MultiSelectProvince'
import MultiSelectStation from 'components/elements/common/MultiSelectStation'
import MultiSelectDepartment from 'components/elements/common/MultiSelectDepartment'
import MultiSelectPosition from 'components/elements/common/MultiSelectPosition'
import SelectContractType from 'components/elements/common/SelectContractType'
import Multiselect from 'vue-multiselect'

// custom component
import ModalDetailContract from './ModalDetailContract'
import ModalUploadSalary from './ModalUploadSalary'

export default {
  name: 'contract-manager',

  components: {
    MultiSelectRegion,
    MultiSelectProvince,
    MultiSelectStation,
    MultiSelectDepartment,
    MultiSelectPosition,
    SelectContractType,
    ModalDetailContract,
    Multiselect,
    ModalUploadSalary
  },

  data: () => ({
    page: {
      current: 1,
      per: 20,
      total: 0
    },
    search: {
      cmnd_profile_id: null,
      username_name: null,
      contract_number: null,
      contract_type: null,
      region: null,
      province: null,
      station: null,
      department: null,
      position: null,
      contract_status: null,
      print_status: null
    },
    contracts: [],
    loading: true,
    printStatus: Contract.printStatus,
    currentProfile: null,
    printOptions: [...[{value: 'not_have', desc: 'Chưa có'}], ...Contract.printStatusOption],
    printStatusSearch: null,
    uploadStatus: null,
    allowUploadFileSalary: null
  }),

  beforeCreate () {
    if (!window.popStateDetected) {
      sessionStorage.removeItem('contractFilter')
    }
  },

  created () {
    let contractFilter = JSON.parse(sessionStorage.getItem('contractFilter'))
    if (contractFilter) {
      this.search.cmnd_profile_id = contractFilter.cmnd_profile_id || null
      this.search.username_name = contractFilter.username_name || null
      this.search.contract_number = contractFilter.contract_number || null
      this.search.contract_type = contractFilter.contract_type || null
      this.search.region = contractFilter.region || null
      this.search.province = contractFilter.province || null
      this.search.station = contractFilter.station || null
      this.search.department = contractFilter.department || null
      this.search.position = contractFilter.position || null
      this.search.contract_status = contractFilter.contract_status || null
      this.search.print_status = contractFilter.print_status || null

      this.printStatusSearch = this.printOptions.find(el => (el.value === contractFilter.print_status)) || null

      this.page.current = contractFilter.page
      this.page.per = contractFilter.limit
    }
    this.getContract()
  },

  computed: {
    totalPage () {
      return Math.ceil(this.page.total / this.page.per)
    }
  },

  methods: {
    getContract () {
      this.loading = true
      let params = {
        ...this.search,
        page: this.page.current,
        limit: this.page.per
      }
      sessionStorage.setItem('contractFilter', JSON.stringify(params))
      staffService.getContractList(params)
        .then(res => {
          if (res.data.success) {
            this.contracts = res.data.data.data || []
            this.page.total = res.data.data.total || 0
          } else {
            if (res.data.err_type === 'permission') {
              commonHelper.showMessage('Bạn không có quyền thao tác trên màn này !', 'warning')
              return
            }
            commonHelper.showMessage(res.data.message || 'Không lấy được dữ liệu hợp đồng !', 'warning')
          }
        })
        .catch(e => {
          commonHelper.showMessage('Đã có lỗi xảy ra, vui lòng thử lại sau !', 'warning')
          console.log(e)
        })
        .then(() => {
          this.loading = false
        })
    },

    resetSearch () {
      this.page.current = 1
      this.printStatusSearch = null
      for (const field in this.search) {
        this.search[field] = null
      }
      this.getContract()
    },

    formatMoney (amount) {
      return commonHelper.formatMoney(amount)
    },

    getVariant (status) {
      if (!status) return 'warning'
      if (['not_have'].includes(status)) return 'warning'
      if (['not_print'].includes(status)) return 'secondary'
      if (['printed'].includes(status)) return 'info'
      if (['received'].includes(status)) return 'success'
    },

    openDetailContract (staff) {
      if (!staff.id) return
      this.currentProfile = {
        id: staff.id,
        fullname: staff.fullname || null,
        userId: staff.userId || null,
        username: staff.username || null
      }
      this.$bvModal.show('detail-contract')
    },

    updateSalary (appendix) {
      if (this.currentProfile.id) {
        let idx = this.contracts.findIndex(el => (+el.id === +this.currentProfile.id))
        if (!isNaN(idx) && idx >= 0) {
          this.contracts[idx].salary = appendix.salary
          this.contracts[idx].trialSalary = appendix.trial_salary
          this.contracts[idx].otSalary = appendix.ot_salary
          this.contracts[idx].trialOtSalary = appendix.trial_ot_salary
          this.contracts[idx].mealAllowance = appendix.meal_allowance
          this.contracts[idx].mobileAllowance = appendix.mobile_allowance
          this.contracts[idx].respAllowance = appendix.resp_allowance
          this.contracts[idx].biztripAllowance = appendix.biztrip_allowance
          this.contracts[idx].transAllowance = appendix.trans_allowance
        }
      }
    },

    uploadSalaryFile () {
      this.$startLoading()
      staffService.checkPermissionUploadSalary()
        .then(res => {
          if (res.data.success && res.data.data.permission) {
            this.allowUploadFileSalary = true
            this.$bvModal.show('upload-salary-file')
          } else {
            commonHelper.showMessage(res.data.message || 'Bạn không có quyền upload file lương nhân viên !')
            this.allowUploadFileSalary = false
          }
        })
        .catch(e => {
          console.log(e)
        })
        .then(() => {
          this.$stopLoading()
        })
    }
  }
}
</script>
