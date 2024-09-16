import commonHelper from 'infrastructures/helpers/common-helpers'
import payslipService from 'domain/services/payslip-service'
import payslipFactory from 'domain/factories/payslip-factory'
import MaskedInput from 'vue-text-mask'
import * as textMaskAddons from 'text-mask-addons/dist/textMaskAddons'
import EcomPayslipDetailInfo from 'components/pages/Payslip/PayslipDetailInfo'

export default {
  name: 'ecom-payslip-detail',

  components: {
    MaskedInput,
    EcomPayslipDetailInfo
  },

  data () {
    return {
      numberMask: textMaskAddons.createNumberMask({
        prefix: ''
      }),
      statusOptions: [
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Đang chờ duyệt', value: 'pending' }
      ],
      listDeductions: [
        {value: '', text: 'Chọn loại'},
        {value: 'vi_pham', text: 'Vi phạm'},
        {value: 'boi_hoan', text: 'Bồi hoàn'},
        {value: 'ky_quy', text: 'Ký quỹ'},
        {value: 'tam_ung', text: 'Tạm ứng'},
        {value: 'khac', text: 'Khác'}
      ],
      listAdjustments: [
        {value: '', text: 'Chọn loại'},
        {value: 'luong', text: 'Lương'},
        {value: 'thue', text: 'Thuế'},
        {value: 'bao_hiem', text: 'Bảo hiểm'},
        {value: 'doan_phi', text: 'Đoàn phí'},
        {value: 'khac', text: 'Khác'}
      ],
      payslipData: {
        other_allowances: [],
        deductions: [],
        adjustments: []
      },
      profile: {},
      workType: {},
      contract: {},
      contractSalary: {},
      insuranceId: 2, // Không đóng BHXH
      hasDataLoaded: false
    }
  },

  computed: {
    /**
     * Check xem có đóng BHXH hay không
     * @returns {number}
     */
    hasInsurance () {
      return [1, 6].includes(parseInt(this.insuranceId)) ? 1 : 0
    },

    /**
     * Tổng BHXH người lao động đóng
     * @returns {number}
     */
    totalInsuranceByEmployee () {
      return parseFloat(this.payslipData.bhxh_employee) + parseFloat(this.payslipData.bhyt_employee) +
        parseFloat(this.payslipData.bhtn_employee)
    },

    /**
     * Tổng BHXH người lao động công ty đóng
     * @returns {number}
     */
    totalInsuranceByCompany () {
      return parseFloat(this.payslipData.bhxh_company) + parseFloat(this.payslipData.bhyt_company) +
        parseFloat(this.payslipData.bhtn_company)
    },

    /**
     * Lương ngoài giờ
     * @returns {number}
     */
    otSalary () {
      if (parseFloat(this.payslipData.total_workday) === 0 || this.checkHasKPI()) {
        return 0
      }

      return (parseFloat(this.payslipData.ot_trial_workday) / parseFloat(this.payslipData.total_workday)) * parseFloat(this.contractSalary.trial_ot_salary) +
        (parseFloat(this.payslipData.ot_workday) / parseFloat(this.payslipData.total_workday)) * parseFloat(this.contractSalary.ot_salary)
    },

    /**
     * Tổng thu nhập
     * @returns {number}
     */
    totalIncome () {
      let totalAllowances = this.payslipData.other_allowances.reduce((accumulator, currentValue) => {
        let amount = Number.isInteger(parseFloat(currentValue.amount)) ? parseFloat(currentValue.amount) : 0
        return accumulator + amount
      }, 0)

      const bonusGoodEmployee = isNaN(parseFloat(this.payslipData.bonus_good_employee)) ? 0 : parseFloat(this.payslipData.bonus_good_employee)
      const bonusHoliday = isNaN(parseFloat(this.payslipData.bonus_holiday)) ? 0 : parseFloat(this.payslipData.bonus_holiday)

      return parseFloat(this.payslipData.basic_salary_by_workday) + parseFloat(this.payslipData.allowance_by_workday) +
        parseFloat(this.payslipData.kpi_salary) + parseFloat(bonusGoodEmployee) +
        parseFloat(bonusHoliday) + parseFloat(this.otSalary) + totalAllowances
    },

    /**
     * Thu nhập chịu thuế
     * @returns {number}
     */
    incomeBeTax () {
      if (parseFloat(this.payslipData.total_workday) === 0) {
        return this.totalIncome
      }

      return this.totalIncome - this.sumTotalAllowanceHasNotTax() *
        (parseFloat(this.payslipData.trial_workday) + parseFloat(this.payslipData.workday)) / parseFloat(this.payslipData.total_workday)
    },

    /**
     * Thu nhập tính thuế
     * @returns {number}
     */
    lastIncomeBeTax () {
      if ((this.workType.group_type === 'cod' && this.hasInsurance === 0) || (this.workType.group_type !== 'cod' && this.workType.work_type === 'part_time')) {
        return this.incomeBeTax
      }

      if (this.insuranceId === 3) { // Đóng BHXH ở nơi khác
        return this.incomeBeTax - this.hasInsurance * (this.totalInsuranceByEmployee)
      }

      let noOfDependants = this.profile.no_of_dependants ? parseFloat(this.profile.no_of_dependants) : 0

      return this.incomeBeTax - 9000000 - noOfDependants * 3600000 - this.hasInsurance * (this.totalInsuranceByEmployee)
    },

    /**
     * Thuế thu nhập cá nhân
     * @returns {number}
     */
    personalIncomeTax () {
      const workType = this.workType.work_type
      if (workType === 'part_time' || (this.workType.group_type === 'cod' && workType === 'full_time' && this.hasInsurance === 0)) {
        if (this.lastIncomeBeTax >= 2000000) {
          return 0.1 * this.lastIncomeBeTax
        }
        return 0
      } else if (this.lastIncomeBeTax > 80000000) {
        return this.lastIncomeBeTax * 0.35 - 9850000
      } else if (this.lastIncomeBeTax > 52000000) {
        return this.lastIncomeBeTax * 0.3 - 5850000
      } else if (this.lastIncomeBeTax > 32000000) {
        return this.lastIncomeBeTax * 0.25 - 3250000
      } else if (this.lastIncomeBeTax > 18000000) {
        return this.lastIncomeBeTax * 0.2 - 1650000
      } else if (this.lastIncomeBeTax > 10000000) {
        return this.lastIncomeBeTax * 0.15 - 750000
      } else if (this.lastIncomeBeTax > 5000000) {
        return this.lastIncomeBeTax * 0.1 - 250000
      } else if (this.lastIncomeBeTax > 0) {
        return this.lastIncomeBeTax * 0.05
      }

      return 0
    },

    /**
     * Thu nhập sau nghĩa vụ nhà nước
     * @returns {number}
     */
    incomeAfterTax () {
      return this.totalIncome - this.hasInsurance * (this.totalInsuranceByEmployee) - this.personalIncomeTax -
        this.hasInsurance * parseFloat(this.payslipData.union_dues_employee)
    },

    /**
     * Tổng thu nhập NET
     * @returns {number}
     */
    netSalary () {
      let totalDeductions = this.payslipData.deductions.reduce((accumulator, currentValue) => {
        let amount = Number.isInteger(parseFloat(currentValue.amount)) ? parseFloat(currentValue.amount) : 0
        return accumulator + amount
      }, 0)

      let totalAdjustments = this.payslipData.adjustments.reduce((accumulator, currentValue) => {
        let amount = Number.isInteger(parseFloat(currentValue.amount)) ? parseFloat(currentValue.amount) : 0
        return accumulator + amount
      }, 0)

      return this.incomeAfterTax - totalDeductions + totalAdjustments
    }

  },

  beforeCreate () {
    this.$startLoading()

    let data = {
      id: this.$route.params.id
    }
    payslipService.getDetail(data).then((response) => {
      if (response.data.success) {
        this.payslipData = payslipFactory(response.data.payslip)
        this.profile = response.data.profile
        this.workType = response.data.work_type
        this.contract = response.data.contract
        this.contractSalary = response.data.contract_salary
        this.insuranceId = response.data.insurance_id

        if (!this.checkHasKPI()) {
          this.payslipData.kpi_salary = 0
        }
      }

      if (commonHelper.isEmpty(this.profile)) {
        this.$router.push({ name: 'error-404' })
      } else {
        this.hasDataLoaded = true
      }
    }).catch((error) => {
      console.log(error)
    }).then(() => {
      this.$stopLoading()
    })
  },

  methods: {
    /**
     * Check bảng lương có tính theo cơ chế KPI hay không
     * @returns {boolean}
     */
    checkHasKPI () {
      return this.contract.has_kpi === '1' || this.workType.group_type === 'cod'
    },

    /**
     * Thêm trợ cấp
     */
    addOtherAllowance () {
      if (commonHelper.isEmpty(this.payslipData.other_allowances)) {
        this.payslipData.other_allowances = []
      }
      this.payslipData.other_allowances.push({
        amount: '',
        description: ''
      })
    },

    /**
     * Thêm khoản trừ
     */
    addDeduction () {
      if (commonHelper.isEmpty(this.payslipData.deductions)) {
        this.payslipData.deductions = []
      }
      this.payslipData.deductions.push({
        type: '',
        amount: '',
        description: ''
      })
    },

    /**
     * Thêm truy thu, bồi hoàn
     */
    addAdjustment () {
      if (commonHelper.isEmpty(this.payslipData.adjustments)) {
        this.payslipData.adjustments = []
      }
      this.payslipData.adjustments.push({
        type: '',
        amount: '',
        description: ''
      })
    },

    removeOtherAllowance (index) {
      this.payslipData.other_allowances.splice(index, 1)
    },

    removeDeduction (index) {
      this.payslipData.deductions.splice(index, 1)
    },

    removeAdjustment (index) {
      this.payslipData.adjustments.splice(index, 1)
    },

    sumTotalAllowanceHasNotTax () {
      let sum = 0
      let listAllowanceNames = [
        'resp_allowance', 'trans_allowance', 'meal_allowance',
        'mobile_allowance', 'biztrip_allowance'
      ]

      listAllowanceNames.forEach((name) => {
        if (this.contractSalary[name] && this.contractSalary[name].has_tax === '0') {
          sum += parseFloat(this.contractSalary[name].value)
        }
      })

      return sum
    },

    /**
     * Action when click button save
     */
    saveData () {
      this.$startLoading()
      let data = {
        id: this.$route.params.id,
        status: this.payslipData.status,
        bonus_good_employee: this.payslipData.bonus_good_employee,
        bonus_holiday: this.payslipData.bonus_holiday,
        other_allowances: JSON.stringify(this.payslipData.other_allowances),
        deductions: JSON.stringify(this.payslipData.deductions),
        adjustments: JSON.stringify(this.payslipData.adjustments)
      }

      payslipService.update(data).then((response) => {
        if (response.data.success) {
          this.$notify({
            group: 'default',
            type: 'bg-success text-white',
            title: 'Thông báo',
            text: 'Update thành công!'
          })
        } else {
          this.$notify({
            group: 'default',
            type: 'bg-warning text-dark',
            title: 'Thông báo',
            text: 'Có lỗi xảy ra trong quá trình update'
          })
        }
      }).catch((error) => {
        console.log(error)
        this.$notify({
          group: 'default',
          type: 'bg-warning text-dark',
          title: 'Thông báo',
          text: 'Có lỗi xảy ra trong quá trình update'
        })
      }).then(() => {
        this.$stopLoading()
      })
    },

    /**
     * Action when click button cancel
     */
    clickCancel () {
      this.$router.push({ name: 'payslip-manager' })
    }
  }
}
