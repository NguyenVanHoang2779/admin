import BaseEntity from './BaseEntity'
import moment from 'moment'

export default class Contract extends BaseEntity {
  static typeOptions = {
    probation: 'Thử việc',
    parttime: 'Cộng tác viên',
    partnership: 'Hợp tác kinh doanh',
    definite: 'Có thời hạn 12 tháng',
    definite_24: 'Có thời hạn 24 tháng',
    indefinite: 'Không thời hạn',
    service_contract: 'Hợp đồng dịch vụ',
    apprenticeship: 'Hợp đồng học việc'
  }

  static status = {
    active: 'Có hiệu lực',
    draft: 'Bản nháp',
    disable: 'Hết hiệu lực',
    signed: 'Đã ký'
  }

  static salaryDateOps = [
    { text: 'Ngày vào', value: 'join_date' },
    { text: 'Sau 2 tháng từ ngày vào', value: 'after_2_month' },
    { text: 'Sau 1 tháng từ ngày vào', value: 'after_1_month' }
  ]

  static arrayTypeContract = [
    { value: 'indefinite', desc: 'Không thời hạn' },
    { value: 'definite', desc: 'Thời hạn 12 tháng' },
    { value: 'definite_24', desc: 'Thời hạn 24 tháng' },
    { value: 'probation', desc: 'Thử việc' },
    { value: 'partnership', desc: 'Hợp tác kinh doanh' },
    { value: 'parttime', desc: 'Cộng tác viên' },
    { value: 'service_contract', desc: 'Dịch vụ' },
    { value: 'apprenticeship', desc: 'Học việc' }
  ]

  static printStatus = {
    not_print: 'Chưa in',
    printed: 'Đã in',
    received: 'Đã nhận'
  }
  static printStatusOption = [
    { value: 'not_print', desc: 'Chưa in' },
    { value: 'printed', desc: 'Đã in' },
    { value: 'received', desc: 'Đã nhận' }
  ]

  static reasonLiquidate = [
    { value: 'unilaterally', text: '(1) Do Bên B đơn phương chấm dứt HĐLĐ - Nghỉ ngang' },
    { value: 'agreement', text: '(2) Do 2 bên thỏa thuận chấm dứt - Nghỉ việc đúng quy trình/ Cho thôi việc' },
    { value: 'expire', text: '(3) Hợp đồng hết thời hạn đã giao kết.' },
    { value: 'other', text: 'Khác (Điền chi tiết lý do)' }
  ]

  static appendixType = ['probation', 'parttime', 'definite', 'definite_24', 'indefinite']
  static optionalAppendixType = ['service_contract', 'apprenticeship']

  static noEndDateType = ['indefinite', 'service_contract']

  static fastContractOption = [
    {
      text: 'Hợp tác kinh doanh',
      value: 'partnership'
    },
    {
      text: 'Cộng tác viên',
      value: 'parttime'
    },
    {
      text: 'Hợp đồng dịch vụ',
      value: 'service_contract'
    }
  ]

  static getTypeOptions () {
    let rs = []
    Object.keys(Contract.typeOptions).forEach((key) => {
      rs.push({
        text: Contract.typeOptions[key],
        value: key
      })
    })
    return rs
  }

  static calculateEndDateByContractType (contractType, fromDate) {
    let endDate = ''
    switch (contractType) {
      case 'parttime': // Hợp đồng CTV
        endDate = moment(fromDate).add(12, 'months').subtract(1, 'days').format('YYYY-MM-DD')
        break
      case 'definite': // Hợp đồng LĐ có thời hạn 12 tháng
        endDate = moment(fromDate).add(12, 'months').subtract(1, 'days').format('YYYY-MM-DD')
        break
      case 'definite_24': // Hợp đồng LĐ có thời hạn 24 tháng
        endDate = moment(fromDate).add(24, 'months').subtract(1, 'days').format('YYYY-MM-DD')
        break
      case 'apprenticeship': // Hợp đồng học việc thời giạn 3 tháng
        endDate = moment(fromDate).add(3, 'months').subtract(1, 'days').format('YYYY-MM-DD')
        break
      case 'probation': // Hợp đồng thử việc thời giạn 2 tháng
        endDate = moment(fromDate).add(2, 'months').subtract(1, 'days').format('YYYY-MM-DD')
        break
      default:
        break
    }

    return endDate
  }
}
