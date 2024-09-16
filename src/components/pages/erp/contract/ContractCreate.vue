<template>
<div class="create-contract">
    <div class="row">
        <h4>Tạo hợp đồng mới</h4>
        <div class="col-md-12 contract-detail">
            <div class="card mb-4">
                <div class="row no-gutters row-bordered">
                    <div class="col-md-8 col-lg-12 col-xl-8">
                        <h6 class="card-header"><i class="ion  ion-ios-cloud-done"></i>&nbsp;Thông tin hợp đồng </h6>
                        <div class="card-body">
                            <b-form-row>
                                <b-form-group label="Nhập số hợp đồng"  class="col-md-12" v-if="contract.auto_create_contract_number ==='0'">
                                    <b-input placeholder="Nhập số hợp đồng" v-model="contract.contract_number" />
                                </b-form-group>
                                <b-form-group label="" class="col-md-12">
                                    <b-form-checkbox
                                        v-model="contract.auto_create_contract_number"
                                        value=1
                                        unchecked-value=0
                                    >
                                    <b>Tự động tạo mã hợp đồng</b>
                                    </b-form-checkbox>
                                </b-form-group>
                                <b-form-group label="Chọn loại hợp đồng" class="col-md-12">
                                    <b-form-select v-model="contract.type_contract" :options="contractType" class="mb-3" />
                                </b-form-group>
                                <b-form-group label="Nhập ngày kí hợp đồng" class="col-md-12">
                                    <datepicker
                                            v-model="contract.contract_date"
                                            format='dd-MM-yyyy'
                                            placeholder="dd-mm-yyyy"
                                            :bootstrapStyling="true"
                                            :monday-first="true"
                                            :full-month-name="true"
                                            :calendar-button="true"
                                            calendar-button-icon="ion ion-md-calendar"
                                            :clear-button="true"
                                            @input="onChangeContractDate"
                                    />
                                </b-form-group>
                                <b-form-group label="Chọn ngày HĐ có hiệu lực" class="col">
                                    <datepicker
                                        v-model="contract.start_date"
                                        format="dd-MM-yyyy"
                                        placeholder="dd-mm-yyyy"
                                        :bootstrapStyling="true"
                                        :monday-first="true"
                                        :full-month-name="true"
                                        :calendar-button="true"
                                        calendar-button-icon="ion ion-md-calendar"
                                        :clear-button="true"
                                        @input="onChangeStartDate"
                                    />
                                </b-form-group>
                                <b-form-group label="Chọn ngày kết thúc hợp đồng" class="col" v-if ="!Contract.noEndDateType.includes(contract.type_contract)">
                                    <datepicker
                                        v-model="contract.end_date"
                                        format='dd-MM-yyyy'
                                        placeholder="dd-mm-yyyy"
                                        :bootstrapStyling="true"
                                        :monday-first="true"
                                        :full-month-name="true"
                                        :calendar-button="true"
                                        calendar-button-icon="ion ion-md-calendar"
                                        :clear-button="true"
                                    />
                                </b-form-group>
                                <b-form-group label="" class="col-md-12">
                                    <b-form-checkbox
                                        v-model="contract.has_kpi"
                                        value="1"
                                        unchecked-value="0"
                                    >
                                        <b>Tính lương theo KPI</b>
                                    </b-form-checkbox>
                                </b-form-group>
                            </b-form-row>
                        </div>
                    </div>
                    <div class="col-md-4 col-lg-12 col-xl-4 current-salary">
                        <h6 class="card-header"><i class="ion ion-ios-person"></i>&nbsp;Thông tin cá nhân</h6>
                        <div class="card-body">
                            <b-form-group v-if="!user.disable_search">
                                <b-input-group>
                                    <b-btn slot="append" @click="doSearchUser" variant="outline-secondary"><i class="fas fa-search"></i></b-btn>
                                    <b-input v-model="user.username" placeholder="Nhập tài khoản khác" class="form-control" @keypress.enter="doSearchUser" />
                                </b-input-group>
                            </b-form-group>
                            <div class="row">
                                <div class="col-6 col-xl-5 text-muted mb-3">Mã nhân viên</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ user.staff_code }}</span></div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Họ tên</div>
                                <div class="col-6 col-xl-7 mb-3 text-big">{{ user.fullname }}
                                </div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Tài khoản chính</div>
                                <div class="col-6 col-xl-7 mb-3 text-big">
                                  {{ user.username }}
                                </div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Số CMT</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ user.national_id }}</span> </div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Vị trí</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ user.department }} - {{ user.position }}</span></div>
                                <div class="col-6 col-xl-5 text-muted mb-3">Kho</div>
                                <div class="col-6 col-xl-7 mb-3"><span class="text-big">{{ user.station }}</span></div>
                                <div class="col-12 mb-3">
                                  <b-alert :show="user.user_id && +user.status_id !== 3" variant="danger">
                                    <b>Lưu ý:</b><br/>
                                    <div v-show="+user.status_id !== 3">- User này đang không hoạt động, không thể tạo hợp đồng !</div>
                                  </b-alert>
                                </div>
                                <div class="col-6 col-xl-7 mb-3">
                                    <b-btn size="sm" variant="default" @click="changeSearchUser" v-if="user.disable_search">
                                        <span class="ion ion-md-person"></span>&nbsp;&nbsp;Chọn tài khoản khác</b-btn>
                                    <b-btn size="sm" variant="secondary" @click="changeSearchUser" v-if="!user.disable_search && user.fullname">
                                        <span class="ion ion-md-person"></span> Chọn tài khoản này</b-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr class="border-light container-m--x mt-0 mb-4"><br/>
    </div>
    <appendix
        :edit="true"
        :data-appendix="appendix"
        @update="updateAppendix"
        :contract="contract"
        v-if="Contract.appendixType.includes(contract.type_contract) || Contract.optionalAppendixType.includes(contract.type_contract)"
    ></appendix>

    <div class="text-center py-3">
        <b-btn variant="success" @click="createContract" :disabled="!showCreateButton">
            <i v-if="showCreateButton" class="fas fa-plus"/>
            <i v-else class="fa fa-spin fa-spinner"/>
            Tạo hợp đồng mới
        </b-btn>
    </div>
</div>
</template>

<style src="@/vendor/libs/vuejs-datepicker/vuejs-datepicker.scss" lang="scss"></style>

<script>
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import Appendix from './Appendix'

// service
import staffService from 'domain/services/staff-service'
import contractService from 'domain/services/contract-service'

// entities
import Contract from 'domain/entities/Contract'

// helper
import helper from 'infrastructures/helpers/common-helpers'

export default {
  name: 'contract-create',
  components: {
    Appendix,
    Multiselect,
    Datepicker
  },
  data: () => ({
    Contract: Contract,
    showCreateButton: true,
    contract: {
      contract_number: '',
      type_contract: 'probation',
      start_date: '',
      end_date: '',
      contract_date: '',
      has_kpi: 1,
      auto_create_contract_number: 1
    },
    user: {
      user_id: '',
      disable_search: false,
      fullname: '',
      username: '',
      department: '',
      position: '',
      station: '',
      tel: '',
      staff_code: '',
      national_id: '',
      status_id: 3
    },
    appendix: {
      trial_salary: null,
      salary: null,
      trial_ot_salary: null,
      ot_salary: null,
      resp_allowance: null,
      trans_allowance: null,
      meal_allowance: null,
      mobile_allowance: null,
      biztrip_allowance: null
    },
    contractType: Contract.getTypeOptions()
  }),

  created () {
    if (this.$route.params.username) {
      this.user.username = this.$route.params.username
      this.searchUser()
      this.getInitSalary()
    }
  },

  methods: {
    getInitSalary () {
      if (!this.user.username) return

      contractService.getInitSalary({ username: this.user.username })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data
            this.appendix.salary = data.salary || null
            this.appendix.trial_salary = data.trial_salary || null
            this.appendix.ot_salary = data.ot_salary || null
            this.appendix.trial_ot_salary = data.trial_ot_salary || null
            this.appendix.meal_allowance = data.meal_allowance || null
          } else {
            helper.showMessage(res.data.message || 'Có lỗi xảy ra khi khởi tạo dữ liệu phụ lục hợp đồng !', 'warning')
          }
        })
        .catch(e => {
          helper.showMessage('Có lỗi xảy ra khi khởi tạo dữ liệu phụ lục hợp đồng !', 'warning')
          console.log(e)
        })
    },

    onChangeContractDate () {
      if (helper.isEmpty(this.contract.start_date) && helper.isEmpty(this.contract.end_date)) {
        this.contract.start_date = this.contract.contract_date

        this.contract.end_date = Contract.calculateEndDateByContractType(this.contract.type_contract, this.contract.contract_date)
      }
    },

    onChangeStartDate () {
      if (helper.isEmpty(this.contract.contract_date)) {
        this.contract.contract_date = this.contract.start_date
      }

      this.contract.end_date = Contract.calculateEndDateByContractType(this.contract.type_contract, this.contract.start_date)
    },

    updateAppendix (dataAppendix) {
      // Get data appendix
      this.appendix = dataAppendix
    },

    changeSearchUser () {
      this.user.disable_search = !this.user.disable_search
    },

    doSearchUser () {
      if (this.user.username) {
        this.$router.push('/contract/create/' + this.user.username)
        this.searchUser()
        return
      }
      helper.showMessage('Cần nhập tài khoản nhân viên !', 'warning')
    },

    searchUser () {
      if (!this.user.username) return

      staffService.getUserOfContract({ username: this.user.username })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data
            this.user.fullname = data.User.fullname
            this.user.user_id = data.User.id
            this.user.position = data.EmpPosition.position_name
            this.user.department = data.EmpPosition.department
            this.user.station = data.Station.name
            this.user.staff_code = data.MasterProfile.staff_code
            this.user.national_id = data.MasterProfile.personal_id_number
            this.user.status_id = data.User.status_id
            this.changeSearchUser()
          } else {
            this.resetDataUser()
            helper.showMessage(res.data.message || 'Có lỗi xảy ra khi tìm kiếm hồ sơ nhân viên !', 'warning', 'Lỗi')
          }
        })
        .catch(e => {
          console.log(e)
          this.resetDataUser()
          helper.showMessage('Có lỗi xảy ra khi tìm kiếm hồ sơ nhân viên !', 'warning', 'Lỗi')
        })
    },

    resetDataUser () {
      this.user = {
        disable_search: false,
        fullname: '',
        position: '',
        department: '',
        station: '',
        staff_code: '',
        national_id: ''
      }
    },

    createContract () {
      let self = this
      let dataSend = {
        ...self.appendix,
        ...self.contract,
        ...self.user
      }

      // format lại thông tin tiền để update
      this.updateMoney(
        dataSend,
        ['salary', 'trial_salary', 'ot_salary', 'trial_ot_salary', 'meal_allowance', 'resp_allowance', 'trans_allowance', 'mobile_allowance', 'biztrip_allowance']
      )
      if (this.contract.type_contract === 'indefinite') {
        this.contract.end_date = null
      }
      // check required field
      if (!dataSend.trial_salary && this.contract.type_contract === 'probation') {
        alert('Vui lòng nhập mức lương thử việc')
        return
      }
      if (!dataSend.salary && ['definite', 'definite_24', 'indefinite'].includes(this.contract.type_contract)) {
        alert('Vui lòng nhập mức lương chính thức')
        return
      }
      this.showCreateButton = false
      this.$startLoading()
      staffService.createContract(dataSend)
        .then(res => {
          if (res.data.success) {
            helper.showMessage((res.data.message || 'Tạo hợp đồng thành công') + ', đang chuyển hướng sang trang chi tiết hợp đồng ...', 'success', 'Thành công')
            setTimeout(
              function () {
                let contractID = res.data.data.EmpContract.id
                self.$router.push('/contract/detail/' + contractID)
              }, 3000
            )
          } else {
            helper.showMessage(res.data.message || 'Đã có lôi xảy ra, vui lòng liên hệ đội ngũ kỹ thuật để được hỗ trợ !', 'warning', 'Lỗi')
          }
          this.showCreateButton = true
        })
        .catch(e => {
          helper.showMessage('Đã có lỗi xảy ra, vui lòng liên hệ đội ngũ kỹ thuật để được hỗ trợ !', 'warning', 'Lỗi')
        })
        .then(_ => {
          this.$stopLoading()
        })
    },

    updateMoney (ref, field) {
      try {
        if (typeof field === 'string') {
          if (!ref[field] || typeof ref[field] !== 'string') return
          ref[field] = ref[field].replace(/\D/g, '')
        }
        if (Array.isArray(field) && field.length) {
          for (const fie of field) {
            if (!ref[fie] || typeof ref[fie] !== 'string') continue
            ref[fie] = ref[fie].replace(/\D/g, '')
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
  .row-bordered{
      overflow: unset;
  }
  .alert{
      max-width: 600px;
      margin: 0 auto;
  }
</style>
