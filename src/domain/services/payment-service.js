import httpErp from 'infrastructures/api-erp-http'

export default {
  // API lấy dữ liệu giao dich
  getListTransaction (data) {
    return httpErp.get('payment/getListTransaction', {'params': data})
  },
  updateTransaction (data) {
    return httpErp.post('payment/updateTransaction', data)
  },
  checkTransaction (data) {
    return httpErp.get('payment/checkTransaction', {'params': data})
  },
  apiExportDataPaymentToCsv (data) {
    return httpErp.get('payment/apiExportDataPaymentToCsv', {'params': data})
  }
}
