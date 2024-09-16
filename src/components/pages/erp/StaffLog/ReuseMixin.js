import moment from 'moment'
import commonHelper from 'infrastructures/helpers/common-helpers'

export default {
  filters: {
    timeForHumans (value, format = 'DD-MM-YYYY HH:mm:ss') {
      return moment(value).format(format)
    },
    statusToText (v) {
      if (parseInt(v) === 4) return 'Đã chốt bồi hoàn'
      if (parseInt(v) === 5) return 'Đã đối soát bồi hoàn'
      return 'n/a'
    },
    money (amount) {
      return commonHelper.formatMoney(amount)
    },
    pkgStatusToText (status) {
      switch (parseInt(status)) {
        case 11:
          return 'Đã đối soát đơn không giao được'
        case 20:
          return 'Đang trả hàng'
        case 21:
          return 'Đã trả hàng'
        case 13:
          return 'Đơn bồi hoàn'
        default:
          return status
      }
    }
  }
}
