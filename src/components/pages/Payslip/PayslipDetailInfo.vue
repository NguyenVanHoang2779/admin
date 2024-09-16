<template>
  <div class="ui-block">
    <div class="row d-flex top-detail">
      <div class="col-sm-6 col-xl-3">
        <b-card no-body class="mb-4">
          <b-card-header header-tag="h5">Thông tin cá nhân</b-card-header>
          <b-card-body>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Họ và tên:</div>
              <div class="col-md-8" v-text="profile.fullname"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">username:</div>
              <div class="col-md-8" v-text="profile.username"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Bộ phân:</div>
              <div class="col-md-8" v-text="profile.department"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Vị trí:</div>
              <div class="col-md-8" v-text="profile.position_name"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Kiểu nhân viên:</div>
              <div class="col-md-8" v-text="workType.work_type_description"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Kho:</div>
              <div class="col-md-8" v-text="profile.station_name"></div>
            </div>
          </b-card-body>
        </b-card>
      </div>
      <div class="col-sm-6 col-xl-3">
        <b-card no-body class="mb-4">
          <b-card-header header-tag="h5">Lương hợp đồng</b-card-header>
          <b-card-body>
            <h6>Lương cơ bản</h6>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Thử việc:</div>
              <div class="col-md-8" v-numeral v-text="contractSalary.trial_salary"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Chính thức:</div>
              <div class="col-md-8" v-numeral v-text="contractSalary.salary"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Mức lương tính ngoài giờ thử việc: </span><span v-numeral v-text="contractSalary.trial_ot_salary"></span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Mức lương tính ngoài giờ chính thức: </span><span v-numeral v-text="contractSalary.ot_salary"></span>
              </div>
            </div>
            <h6>Phụ cấp chịu thuế TNCN</h6>
            <div class="row mb-2" v-for="allowance in taxAllowances">
              <div class="col-md-12">
                <span class="text-muted">{{ allowance.name }}: </span><span v-numeral v-text="allowance.value">0</span>
              </div>
            </div>
            <h6>Phụ cấp không chịu thuế TNCN</h6>
            <div class="row mb-2" v-for="allowance in noTaxAllowances">
              <div class="col-md-12">
                <span class="text-muted">{{ allowance.name }}: </span><span v-numeral v-text="allowance.value">0</span>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
      <div class="col-sm-6 col-xl-3">
        <b-card no-body class="mb-4">
          <b-card-header header-tag="h5">Thông tin BHXH</b-card-header>
          <b-card-body>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Lương tính BHXH: </span><span v-numeral v-text="payslip.bhxh_salary"></span>
              </div>
            </div>
            <h6>Các khoản người lao động đóng</h6>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">BHXH:</div><div class="col-md-8" v-numeral v-text="payslip.bhxh_employee"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">BHYT:</div><div class="col-md-8" v-numeral v-text="payslip.bhyt_employee"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">BHTN:</div><div class="col-md-8" v-numeral v-text="payslip.bhtn_employee"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Cộng:</div><div class="col-md-8" v-numeral v-text="totalInsuranceByEmployee"></div>
            </div>
            <h6>Các khoản công ty phải trả</h6>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">BHXH:</div><div class="col-md-8" v-numeral v-text="payslip.bhxh_company"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">BHYT:</div><div class="col-md-8" v-numeral v-text="payslip.bhyt_company"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">BHTN:</div><div class="col-md-8" v-numeral v-text="payslip.bhtn_company"></div>
            </div>
            <div class="row mb-2">
              <div class="col-md-4 text-muted">Cộng:</div><div class="col-md-8" v-numeral v-text="totalInsuranceByCompany"></div>
            </div>
          </b-card-body>
        </b-card>
      </div>
      <div class="col-sm-6 col-xl-3">
        <b-card no-body class="mb-4">
          <b-card-header header-tag="h5">Công đoàn phí</b-card-header>
          <b-card-body>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Đoàn phí người lao động đóng: </span><span v-numeral v-text="payslip.union_dues_employee"></span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Đoàn phí công ty đóng: </span><span v-numeral v-text="payslip.union_dues_company"></span>
              </div>
            </div>
          </b-card-body>
        </b-card>
        <b-card no-body class="mb-4">
          <b-card-header header-tag="h5">Thông tin thuế TNCN</b-card-header>
          <b-card-body>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Mã số thuế: </span><span v-text="profile.tax_iden_number"></span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Bản thân: </span><span>9,000,000</span>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-md-12">
                <span class="text-muted">Phụ thuộc: </span><span>3,600,000 x {{ profile.no_of_dependants ? profile.no_of_dependants : 0 }} người</span>
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ecom-payslip-detail-info',

  props: {
    profile: {
      type: Object,
      required: true
    },
    workType: {
      type: Object,
      required: true
    },
    contract: {
      type: Object,
      required: true
    },
    contractSalary: {
      type: Object,
      required: true
    },
    payslip: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      taxAllowances: [],
      noTaxAllowances: []
    }
  },

  computed: {
    /**
     * Tổng BHXH người lao động đóng
     */
    totalInsuranceByEmployee () {
      return parseInt(this.payslip.bhxh_employee) + parseInt(this.payslip.bhyt_employee) +
        parseInt(this.payslip.bhtn_employee)
    },

    /**
     * Tổng BHXH người lao động công ty đóng
     */
    totalInsuranceByCompany () {
      return parseInt(this.payslip.bhxh_company) + parseInt(this.payslip.bhyt_company) +
        parseInt(this.payslip.bhtn_company)
    }
  },

  created () {
    let listAllowances = {
      resp_allowance: 'Phụ cấp trách nhiệm',
      trans_allowance: 'Xăng xe, ăn đêm',
      meal_allowance: 'Cơm trưa',
      mobile_allowance: 'Điện thoại',
      biztrip_allowance: 'Khoản công tác'
    }

    Object.keys(listAllowances).forEach((key) => {
      if (this.contractSalary[key]) {
        let allowance = this.contractSalary[key]
        allowance.name = listAllowances[key]

        if (allowance.has_tax === '1') {
          this.taxAllowances.push(allowance)
        } else {
          this.noTaxAllowances.push(allowance)
        }
      }
    })
  }
}
</script>
