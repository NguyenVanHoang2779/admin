import http from 'infrastructures/api-http'

export default {
  /**
   * API upload excel
   * @param data
   * @returns {AxiosPromise<any>}
   */
  uploadFileDDAgain (data) {
    return http.post('deduction-manager/uploadFileDDAgain', data)
  },
  searchShop (data) {
    return http.get('deduction-manager/getShopDDAgain', {'params': data})
  },
  runDeduction (data) {
    return http.get('deduction-manager/runDeductionAgain', {'params': data})
  },
  exportFileDD (data) {
    return http.get('deduction-manager/exportFileDD', {'params': data})
  },
  exportFileZip (data) {
    return http.get('deduction-manager/exportFileZip', {'params': data})
  },
  searchNewDeductionShop (data) {
    return http.get('new-deduction/getNewDeductionShop', {'params': data})
  },
  fillDataDdShop (data) {
    return http.get('new-deduction/fillDataDeductionShop', {'params': data})
  },
  saveDdShop (data) {
    return http.get('new-deduction/editDdShop', {'params': data})
  },
  searchNewDeductionResult (data) {
    return http.get('new-deduction/getNewDeductionResult', {'params': data})
  },
  exportNewDeductionResult (data) {
    return http.get('new-deduction/exportNewDeductionResult', {'params': data})
  },
  downloadFileZip (data) {
    return http.get('new-deduction/downloadFileZip', {'params': data})
  },
  exportBankTransfer (data) {
    return http.get('new-deduction/exportBankTransfer', {'params': data})
  },
  getSummaries (data) {
    return http.get('new-deduction/getSummaries', {'params': data})
  },
  /**
   * Điều chỉnh chiết khấu đặc biệt
   */
  uploadFileNewDDUpdate (data) {
    return http.post('new-deduction/uploadFileNewDDUpdate', data)
  },
  searchNewDDUpdate (data) {
    return http.get('new-deduction/getNewDDUpdate', {'params': data})
  },
  runNewDeductionUpdate (data) {
    return http.get('new-deduction/runNewDeductionUpdate', {'params': data})
  },
  exportFileNewDDUpdate (data) {
    return http.get('new-deduction/exportFileNewDDUpdate', {'params': data})
  },
  exportFileZipNewDDUpdate (data) {
    return http.get('new-deduction/downloadFileZipNewDDUpdate', {'params': data})
  },
  deleteDeductionResult (data) {
    return http.post('new-deduction/deleteDeductionResult', data)
  },
  uploadFileResultDeduction (data) {
    return http.post('new-deduction/uploadFileResultDeduction', data)
  }
}
