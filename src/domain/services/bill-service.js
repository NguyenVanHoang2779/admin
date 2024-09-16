import http from 'infrastructures/api-http'

export default {
  /**
   * API search bill
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  searchBillCod (data) {
    return http.get('AdBills/getBillsCod', {'params': data})
  },
  /**
   * Ajax get Package in Bill
   */
  listCodPackages (data) {
    return http.get('bills/listCodPackages/' + data)
  },
  /**
   * Thông tin tổng hợp
   * @param {type} data
   * @returns {unresolved}
   */
  getSummariesCod (data) {
    return http.get('bills/getSummariesCod', {'params': data})
  },
  /**
   * Ajax get Package in DebtBill
   */
  listPackagesDebtBill (data) {
    return http.get('bills/listPackagesDebtBill/' + data)
  },
  listPackagesReturnDebtBill (data) {
    return http.get('bills/listPackagesReturnDebtBill/' + data)
  },
  exportPackageExcel (data) {
    return http.get('bills/exportPackageExcel', {'params': data})
  },
  exportDetailExcel (data) {
    return http.get('bills/exportDetailExcel', {'params': data})
  },
  exportStationExcel (data) {
    return http.get('bills/exportStationExcel', {'params': data})
  },
  saveLogCustomerTelAdd (data) {
    return http.post('xem-thong-tin/saveViewCustomerTelLog', data)
  },
  billDownloadInfo (data) {
    return http.get('AdDownloadManager/indexDownloadCod', {'params': data})
  },
  searchRequestPayPartDebt (data) {
    return http.get('bills/getRequestPayPartDebt', {'params': data})
  },
  revertPayPartDebt (data) {
    return http.get('bills/revertPayPartDebt/' + data)
  },
  confirmPayPartDebt (data) {
    return http.get('bills/confirmPayPartDebt/' + data)
  },
  rejectPayPartDebt (data) {
    return http.get('bills/rejectPayPartDebt/' + data)
  },
  exportPayPartDebt (data) {
    return http.get('bills/exportPayPartDebt', {'params': data})
  },
  exportBillAudit (data) {
    return http.get('bills/exportBillAudit', {'params': data})
  }
}
