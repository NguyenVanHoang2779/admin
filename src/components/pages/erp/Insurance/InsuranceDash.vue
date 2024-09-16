<template>
  <div class="small-scrollbar">
    <b-row class="mb-1">
      <b-col md="6">
        <h4 class="ui-block-heading">QUẢN LÝ THÔNG TIN BHXH</h4>
      </b-col>
      <b-col class="text-right">
        <b-btn variant="outline-ghtk" v-b-modal.upload-insurance-info><i class="fas fa-file-import"></i> Import thông tin BH</b-btn>
      </b-col>
      <template v-if="checkPermissionExportAllPage()">
        <b-button variant="outline-ghtk" disabled v-if="exporting">
          <i class="fas fa-spinner fa-pulse"></i> Đang xuất...
        </b-button>
        <b-btn variant="outline-ghtk" @click="exportInsurance()" title="Xuất Excel theo điều kiện" v-else>
          <i class="fas fa-file-excel"></i> Xuất excel
        </b-btn>
      </template>
    </b-row>
    <div class="search-form-insurance">
      <form autocomplete="off">
        <b-form-row>
          <div class="col-md-2 mb-1">
            <b-input placeholder="Mã nhân viên/CMND/Hộ chiếu" v-model="search.national_id_staff_code"/>
          </div>
          <div class="col-md-2 mb-1">
            <b-input type="text" placeholder="Họ tên/Username" v-model="search.fullname_username"/>
          </div>
          <div class="col-md-2 mb-1">
            <b-input placeholder="Mã số BHXH" v-model="search.insurance_register"/>
          </div>
          <!--chọn trạng thái MP-->
          <div class="col-md-2 mb-1">
            <Multiselect
              v-model="search.mp_status"
              :options="profileStatusOps"
              track-by="desc"
              label="desc"
              placeholder="Trạng thái MP"
              select-label=""
              deselectLabel="X"
            >
              <template slot="placeholder">
                <span class="placeholder">Trạng thái MP</span>
              </template>
            </Multiselect>
          </div>
          <!--Chọn phương án BHXH-->
          <div class="col-md-2 mb-1">
            <b-form-select :options="insOpts" v-model="search.ins_status" />
          </div>
          <!--Box chọn kho -->
          <div class="col-md-2 mb-1">
            <select-stations
              @selected="search.station = $event"
              ref="select_stations"
            >
            </select-stations>
          </div>
        </b-form-row>
        <b-form-row>
          <!-- phòng ban -->
          <div class="col-md-2">
            <single-select-department
              :departmentId="search.department"
              @handleSelectedDepartment="op => search.department = op && op.id || null"
            ></single-select-department>
          </div>
          <!-- Vị trí -->
          <div class="col-md-2">
            <single-select-position
              :department-id="search.department"
              :position-job="search.position"
              @handleSelectedPosition="op => search.position = op && op.id || null"
            ></single-select-position>
          </div>
          <!-- Tháng tham gia BHXH -->
          <div class="col-md-2">
            <Datepicker
              v-model="search.ins_time"
              name="insurance-date"
              format="dd-MM-yyyy"
              :bootstrapStyling="true"
              :monday-first="true"
              :full-month-name="true"
              placeholder="Tháng tham gia BHXH"
              :calendar-button="true"
              calendar-button-icon="ion ion-md-calendar"
              :clear-button="true"
              minimum-view="month"
              :language="language.vi"
            />
          </div>
          <!-- action -->
          <div class="col-md-6 text-right">
            <b-btn type="button" variant="ghtk" @click="searchUsers(1)"><i
              class="sidenav-icon ion ion-md-search"></i> Tìm kiếm
            </b-btn>
            <b-btn type="reset" @click="resetForm"><i class="fas fa-eraser"></i> Xóa bộ lọc</b-btn>
          </div>
        </b-form-row>
      </form>
      <!-- / Table controls -->
      <table class="table table-bordered table-sm table-hover position-relative mt-3 mih-25 bg-white" v-loading="loading">
        <thead class="" style="width: 100%">
          <tr>
            <th class="text-center">Mã NV</th>
            <th class="text-center">Họ tên</th>
            <th class="text-center">CMND</th>
            <th class="text-center">Mã số BHXH</th>
            <th class="text-center">Tháng tham gia BHXH</th>
            <th class="text-center">Phương án BHXH</th>
            <th class="text-center">Trạng thái MP</th>
            <th class="text-center">Ngày nghỉ việc</th>
            <th class="text-center">Lương chính thức</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(profile, idx) in listProfile" :key="idx" :title="getReasonLock(profile)" :class="{'table-danger': +profile.user_status_id !== 3}">
            <th class="text-center">{{ profile.staff_code }}</th>
            <td>{{ profile.fullname }}</td>
            <td class="text-center">{{ profile.national_id }}</td>
            <td class="text-center">{{ profile.insurance_register }}</td>
            <td class="text-center">{{ moment(profile.ins_time, 'MM/YYYY') }}</td>
            <td align="center">
              <select
                class="form-control form-control-sm"
                v-model="profile.insurance_id"
                @click="setOldPlan(profile)"
                @change="changePlan(profile)"
              >
                <option v-for="(ins, insIdx) in insOpts" :key="insIdx" :value="ins.value">{{ ins.text }}</option>
              </select>
              <div v-show="curUpdate.insurance && profile.mp_id === curUpdate.profile && !isPageChanged">
                <div class="text-left align-content-center">
                  <b>Tháng áp dụng</b> <button class="btn btn-sm btn-outline-danger px-1 py-0" @click="cancelChangePlan(profile)"><i class="fas fa-times"></i></button>
                </div>
                <datepicker
                  class="mt-1"
                  v-model="curUpdate.from"
                  name="from-month"
                  format="dd-MM-yyyy"
                  :bootstrapStyling="true"
                  :monday-first="true"
                  :full-month-name="true"
                  placeholder="Tháng áp dụng"
                  :calendar-button="true"
                  calendar-button-icon="ion ion-md-calendar"
                  :clear-button="true"
                  minimum-view="month"
                  :language="language.vi"
                />
              </div>
            </td>
            <td class="text-center">{{ profile.mp_status }}</td>
            <td class="text-center">{{ moment(profile.resign_date, 'DD/MM/YYYY') }}</td>
            <td class="text-center">{{ profile.contract_id ? (profile.salary ? formatMoney(profile.salary) : '*******') : 'Chưa có HĐ' }}</td>
            <td class="text-center">
              <b-btn variant="outline-ghtk" size="sm" @click="showModalDetail(profile)" title="Xem thông tin chi tiết" class="mb-sm-1 mb-xl-0">
                <i class="fas fa-info-circle"></i>
              </b-btn>
              <b-btn variant="outline-ghtk" size="sm" @click="updateInsurance()" title="Cập nhật thay đổi">
                <i class="fas fa-save"></i>
              </b-btn>
            </td>
          </tr>
          <tr v-show="!listProfile.length">
            <td colspan="9" class="text-center align-middle">Không có người lao động phù hợp !</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div class="row mt-2">
        <div class="col-sm">
          <b-pagination
            class="paginator-ghtk"
            size="sm"
            :total-rows="pageData.totalItems"
            v-model="pageData.currentPage"
            :per-page="pageData.perPage"
            @change="pageChanged"
          />
        </div>
        <div class="col-sm text-sm-left text-center">
          <span class="text-muted" v-if="pageData.totalItems">Trang {{ pageData.currentPage }} trên {{ pageData.totalPages }}</span>
        </div>
      </div>
      <!-- / Pagination -->
    </div>
    <div>
      <!-- modal detail insurance info -->
      <b-modal id="modal-info" static centered hide-footer modal-class="modal-xxl">
        <template v-slot:modal-title>
          <h5 class="mb-0">
            Thông tin chi tiết
            (<span @click="$refs['modal-log'].show()" class="text-info cursor-pointer">Lịch sử</span>)
          </h5>
        </template>
        <div v-if="!!curDetail">
          <div class="text-danger mb-1" v-if="+curDetail.user_status_id !== 3 && curDetail.user_lock_reason"><i class="fas fa-info-circle"></i> {{ getReasonLock(curDetail) }}</div>
          <b-row>
            <b-col>
              <div class="text-left">
                <p><b>Nhân Viên: </b>{{ curDetail.fullname }}({{ curDetail.username }} - {{ curDetail.mp_status }})</p>
                <p><b>Bộ phận: </b>{{ curDetail.department }}</p>
                <p><b>Vị Trí: </b>{{ curDetail.position_name }}</p>
                <p><b>Mã BHXH: </b>{{ curDetail.insurance_register }}</p>
                <p><b>Nơi đăng kí KCB: </b>{{ curDetail.hospital_register }}</p>
                <p><b>Người giữ sổ: </b>{{ curDetail.ins_book_with_comp }}</p>
              </div>
            </b-col>
            <b-col>
              <div class="text-left">
                <p><b>Phương án: </b>{{ curDetail.insurance_text }}</p>
                <p><b>Áp dụng từ tháng: </b>{{ moment(curDetail.fromMonth, 'MM/YYYY') }}</p>
                <p><b>Mã thẻ BHYT: </b>{{ curDetail.health_ins_number }}</p>
                <p><b>Tháng tham gia BHXH: </b>{{ moment(curDetail.ins_time, 'MM/YYYY') }}</p>
                <p><b>NLĐ đóng: </b><span v-if="curDetail.worker_cost">{{ curDetail.worker_cost }} %</span></p>
                <p><b>Công ty đóng: </b><span v-if="curDetail.worker_cost">{{ curDetail.company_cost }} %</span></p>
              </div>
            </b-col>
          </b-row>
          <table class="table table-hover table-bordered table-sm" v-show="!!curDetail.type_contract">
            <thead class="thead-light">
            <tr>
              <th  scope="col">Loại hợp đồng</th>
              <th  scope="col">Số hợp đồng</th>
              <th  scope="col">Ngày bắt đầu</th>
              <th  scope="col">Ngày kết thúc</th>
              <th  scope="col">Ngày nghỉ việc</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <th>{{ curDetail.type_contract }}</th>
              <th>{{ curDetail.contract_number }}</th>
              <th>{{ moment(curDetail.start_date, 'DD/MM/YYYY') }}</th>
              <th>{{ moment(curDetail.end_date, 'DD/MM/YYYY') }}</th>
              <th>{{ moment(curDetail.resign_date, 'DD/MM/YYYY') }}</th>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center w-100" slot="modal-footer"><b-button @click="$bvModal.hide('modal-info')">Đóng</b-button></div>
      </b-modal>
      <!-- modal log  -->
      <b-modal hide-footer ref="modal-log" title="Lịch sử" ok-only static centered size="lg" @show="getHistoryInsurance">
        <table class="table table-hover table-bordered table-striped table-sm mh-50">
          <tbody>
          <tr v-for="(history, idx) in historyInsurances" v-bind:key="idx">
            <td class="text-center"><b>{{ history.fullname }}</b>
              <div>({{ history.created }})</div>
            </td>
            <td>Chuyển phương án <b>{{ history.description }}</b>
              áp dụng từ <b>{{ history.from }}</b>
              -> <b>{{ history.to }}</b></td>
          </tr>
          </tbody>
        </table>
      </b-modal>

      <UploadInsuranceInfo id="upload-insurance-info" />
    </div>
  </div>
</template>

<style lang="scss">
</style>

<script>
// build-in component
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import {vi} from 'vuejs-datepicker/dist/locale'

// helper
import helper from 'infrastructures/helpers/common-helpers'
import moment from 'moment'

// entities
import User from 'domain/entities/User'
import MasterProfile from 'domain/entities/MasterProfile'

// service
import insuranceService from 'domain/services/insurance-service'

// custom component
import SelectStations from 'components/elements/FilterBox/SelectStations'
import SingleSelectDepartment from 'components/elements/common/SingleSelectDepartment'
import SingleSelectPosition from 'components/elements/common/SingleSelectPosition'
import UploadInsuranceInfo from './ModalUploadInsuranceInfo'

// mixins
import ExportMixin from 'mixins/ExportMixin'

export default {
  name: 'insurance-dash',
  mixins: [ExportMixin],
  components: {
    Datepicker,
    SelectStations,
    Multiselect,
    SingleSelectPosition,
    SingleSelectDepartment,
    UploadInsuranceInfo
  },

  data: _ => ({
    exporting: false,
    pathExcel: null,
    historyInsurances: null,
    search: {
      department: null,
      position: null,
      station: null,
      fullname_username: null,
      insurance_register: null,
      health_ins_number: null,
      hospital_register: null,
      shk_number: null,
      ins_time: null,
      email: null,
      national_id_staff_code: null,
      work_status: null,
      ins_book_with_comp: null,
      ins_status: null,
      mp_status: { desc: 'Đang Làm việc', value: 'active' }
    },
    pageData: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10
    },
    curDetail: null,

    listProfile: [],

    profileStatusOps: MasterProfile.profileStatusOps,
    userStatusOps: User.statusOptions,
    insOpts: [],

    curUpdate: {
      profile: '',
      insurance: '',
      from: '',
      oldPlan: ''
    },
    isPageChanged: false,
    loading: false,
    language: {
      vi: vi
    }
  }),

  created () {
    this.searchUsers(this.pageData.currentPage) // Get data users
    insuranceService.apiListTypeInsurance()
      .then(res => {
        if (res.data.success) {
          this.insOpts = res.data.data || []
        }
      })
      .catch(e => {
        console.log(e)
      })
  },

  watch: {
    pathExcel (newValue, oldValue) {
      if (newValue) {
        window.open(newValue, '_blank')
        this.pathExcel = null
        this.exporting = null
      }
    }
  },

  methods: {
    changePlan (profile) {
      if (this.isPageChanged) return
      this.curUpdate.insurance = profile.insurance_id
    },

    setOldPlan (profile) {
      if (!profile) return
      if (+this.curUpdate.profile !== +profile.mp_id) {
        this.curUpdate.oldPlan = profile.insurance_id
        this.curUpdate.profile = profile.mp_id
        this.curUpdate.insurance = ''
        this.curUpdate.from = ''
      }
    },

    cancelChangePlan (profile) {
      this.curUpdate.profile = ''
      this.curUpdate.insurance = ''
      this.curUpdate.from = ''
      profile.insurance_id = this.curUpdate.oldPlan
      this.curUpdate.oldPlan = ''
    },

    getHistoryInsurance () {
      let params = {
        mp_id: this.curDetail.mp_id
      }
      insuranceService.getHistoryInsurance(params).then(res => {
        if (res.data.success) {
          this.historyInsurances = res.data.data
          for (const [idx, value] of this.historyInsurances.entries()) {
            value.from = value.from ? this.moment(value.from) : this.moment(value.created)
            value.to = value.to ? this.moment(value.to) : ((idx - 1) > -1 ? this.historyInsurances[idx - 1].from : value.to)
          }
        } else helper.showMessage(res.data.message || 'Không lấy được thông tin BHXH !', 'warning')
      }).catch(e => {
        helper.showMessage('Không lấy được thông tin BHXH !', 'warning')
        console.log(e)
      })
    },

    formatMoney (val) {
      return helper.formatMoney(val)
    },

    moment (data, format = 'DD/MM/YYYY') {
      if (!data) return
      return moment(data).format(format)
    },

    pageChanged: function (page) { // Event check pagination change
      this.isPageChanged = true
      this.searchUsers(page)
      this.pageData.currentPage = page
    },

    searchUsers (page) {
      this.isPageChanged = true
      // Truong hop nguoi dung tim kiem voi dieu kien loc moi
      this.pageData.currentPage = page

      this.loading = true
      let dataSend = {
        fullname_username: this.search.fullname_username,
        insurance_register: this.search.insurance_register,
        national_id_staff_code: this.search.national_id_staff_code,
        tel: this.search.tel,
        email: this.search.email,
        department: this.search.department,
        position_job: this.search.position,
        stations: this.search.station,
        ins_status: this.search.ins_status,
        mp_status: this.search.mp_status ? this.search.mp_status.value : null,
        ins_time: this.search.ins_time,
        page: page || this.pageData.currentPage,
        perpage: this.pageData.perPage
      }

      insuranceService.insuranceCheck(dataSend)
        .then(res => {
          if (res.data.success) {
            this.pageData.totalItems = res.data.pagination.total || 0
            this.pageData.totalPages = res.data.pagination.total_page
            this.listProfile = res.data.data
            this.$nextTick(function () {
              this.isPageChanged = false
            })
          } else {
            helper.showMessage(res.data.message || 'Có lỗi xảy ra khi lấy thông tin BHXH !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra khi lấy thông tin BHXH !', 'warning')
          console.log(e)
        })
        .finally(_ => {
          this.curUpdate.profile = null
          this.loading = false
        })
    },

    getReasonLock (profile) {
      if (profile.user_status_id === 3) return ''
      let resignFrom = ''
      let lockReason = ''
      let lockBy = profile.user_lock_by ? ' (bởi ' + profile.user_lock_by + ')' : ''
      if (profile.user_no_checkin_from) resignFrom = ' từ ngày ' + moment(profile.user_no_checkin_from).format('DD-MM-YYYY')
      else resignFrom = ''
      if (profile.user_lock_reason) lockReason = ' do nhân viên ' + profile.user_lock_reason

      return 'Tài khoản ' + this.userStatusOps[profile.user_status_id] + lockReason + resignFrom + lockBy
    },

    exportInsurance () {
      // lấy condition xuất data giống search
      let dataSend = {
        fullname_username: this.search.fullname_username,
        insurance_register: this.search.insurance_register,
        national_id_staff_code: this.search.national_id_staff_code,
        department: this.search.department,
        position_job: this.search.position,
        stations: this.search.station,
        ins_status: this.search.ins_status,
        mp_status: this.search.mp_status ? this.search.mp_status.value : '',
        ins_time: this.search.ins_time
      }

      let link = '/erp/ErpInsurance/exportInsurance?'
      for (const key in dataSend) {
        if (dataSend[key] && dataSend[key].length > 0) link += key + '=' + dataSend[key] + '&'
      }
      window.open(link, '_blank')
    },

    resetForm () {
      this.search.insurance_register = null
      this.search.fullname_username = null
      this.search.national_id_staff_code = null
      this.search.tel = null
      this.search.email = null
      this.search.station = null
      this.search.ins_status = null
      this.search.ins_time = null
      this.search.department = null
      this.search.position = null

      this.$refs['select_stations'].reset()

      this.searchUsers()
    },

    updateInsurance () {
      if (!this.curUpdate.insurance) {
        helper.showMessage('Thiếu phương án áp dụng mới !', 'warning')
        return
      }
      if (!this.curUpdate.from) {
        helper.showMessage('Thiếu tháng áp dụng !', 'warning')
        return
      }
      this.$startLoading()
      let dataSend = {
        mp_id: this.curUpdate.profile,
        insurance_id: this.curUpdate.insurance,
        from: moment(this.curUpdate.from).format('YYYY-MM-DD')
      }
      insuranceService.updateInsurance(dataSend)
        .then(res => {
          if (res.data.success) {
            helper.showMessage(res.data.message || 'Cập nhật thành công', 'success')
            this.curUpdate.profile = null
            this.curUpdate.from = null
            this.curUpdate.insurance = null
            this.curUpdate.oldPlan = null
          } else {
            helper.showMessage(res.data.message || 'Không thể cập nhật phương án BHXH !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra, không thể cập nhật phương án BHXH !', 'warning')
          console.log(e)
        })
        .finally(_ => {
          this.$stopLoading()
        })
    },

    showModalDetail (profile) {
      this.curDetail = profile
      for (const plan of this.insOpts) {
        if (+plan.value === +profile.insurance_id) {
          this.curDetail.insurance_text = plan.text
        }
      }
      if (this.curDetail) this.$bvModal.show('modal-info')
    }
  }
}
</script>
