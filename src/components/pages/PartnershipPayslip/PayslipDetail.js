import commonHelper from 'infrastructures/helpers/common-helpers'
import partnershipService from 'domain/services/partnership-payslip-service'
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
        deductions: [],
        adjustments: []
      },
      profile: {},
      workType: {},
      contract: {},
      hasDataLoaded: false
    }
  },

  computed: {
    kpiSalary () {
      return parseInt(this.payslipData.kpi_salary)
    },

    proRewardSalary () {
      return parseInt(this.payslipData.pro_reward_salary)
    },

    qualitySalary () {
      return parseInt(this.payslipData.quality_salary)
    },

    minSalary () {
      return parseInt(this.payslipData.min_salary)
    },

    /**
     * Thuế giá trị gia tăng
     * @returns {number}
     */
    vat () {
      return 3 / 100 * this.payslipData.kpi_salary
    },

    /**
     * Thuế thu nhập cá nhân
     * @returns {number}
     */
    personalIncomeTax () {
      let tax = this.qualitySalary >= 2000000 ? 0.1 * this.qualitySalary : 0

      return 1.5 / 100 * this.proRewardSalary + 1.5 / 100 * this.minSalary + 1 / 100 * this.qualitySalary + tax
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

      let totalSalary = this.kpiSalary + this.proRewardSalary +
        this.qualitySalary + this.minSalary
      let incomeAfterTax = totalSalary - this.vat - this.personalIncomeTax

      return incomeAfterTax + totalDeductions
    }

  },

  beforeCreate () {
    this.$startLoading()

    let data = {
      id: this.$route.params.id
    }
    partnershipService.getDetail(data).then((response) => {
      if (response.data.success) {
        this.payslipData = payslipFactory(response.data.payslip)
        this.profile = response.data.profile
        this.workType = response.data.work_type
        this.contract = response.data.contract
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

    removeDeduction (index) {
      this.payslipData.deductions.splice(index, 1)
    },

    /**
     * Action when click button save
     */
    saveData () {
      this.$startLoading()
      let data = {
        id: this.$route.params.id,
        status: this.payslipData.status,
        quality_salary: this.payslipData.quality_salary,
        deductions: JSON.stringify(this.payslipData.deductions)
      }

      partnershipService.update(data).then((response) => {
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
      this.$router.push({ name: 'partnership-payslip-manager' })
    }
  }
}
