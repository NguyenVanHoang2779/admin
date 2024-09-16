import httpErpNew from 'infrastructures/api-erp-new'

export default {

  getIncomeTaxListing (data) {
    return httpErpNew.get('income-tax/get-listing', {'params': data})
  },
  signSingleConfirmCertificate (data) {
    return httpErpNew.post('income-tax/sign-single-confirmation-file', data)
  },
  signMultiConfirmCertificates (data) {
    return httpErpNew.post('income-tax/sign-multi-confirmation-file', data)
  },
  sendSms (data) {
    return httpErpNew.post('income-tax/send-sms', data)
  },
  exportCertificates (data) {
    return httpErpNew.get('income-tax/export', {params: data, responseType: 'blob'})
  }
}
