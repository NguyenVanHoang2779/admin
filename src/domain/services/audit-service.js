import http from 'infrastructures/api-http'

export default {
  /**
   * API upload excel
   * @param data
   * @returns {AxiosPromise<any>}
   */
  uploadFileAuditShopee (data) {
    return http.post('AdAuditShopee/uploadFile', data)
  },
  searchAuditPackage (data) {
    return http.get('AdAuditShopee/getAuditsPackages', {'params': data})
  },
  deleteWAuditPackage (data) {
    return http.post('AdAuditShopee/deletePkgOrder', data)
  },
  fileUploadInfo (data) {
    return http.get('AdUploadManager/indexUpload', {'params': data})
  },
  exportFile (data) {
    return http.get('AdAuditShopee/exportFile', {'params': data})
  },
  exportFileV2 (data) {
    return http.get('AdAuditShopee/exportFileV2', {'params': data})
  },
  fileDownloadInfo (data) {
    return http.get('AdDownloadManager/indexDownloadShopee', {'params': data})
  },
  getListShop (data) {
    return http.get('AdNewAudits/getListShop', {'params': data})
  },
  changeAuditShop (shopId) {
    return http.post('AdNewAudits/changeAuditShop/' + shopId)
  },
  changeAuditShopOneBill (shopOrder) {
    return http.post('AdNewAudits/changeAuditShopOneBill/' + shopOrder)
  },
  auditShopManual (shopId) {
    return http.post('AdNewAudits/auditShopManual/' + shopId)
  },
  listAuditPackage (data) {
    return http.get('AdNewAudits/listAuditPackage', {'params': data})
  },
  listExportBillAudit (data) {
    return http.get('AdNewAudits/listExportBillAudit', {'params': data})
  },
  listPaymentPeriod (data) {
    return http.get('AdNewAudits/listPaymentPeriod', {'params': data})
  },
  changeConfigHoliday (data) {
    return http.post('AdNewAudits/changeConfigHoliday', data)
  },
  uploadFileAuditException (data) {
    return http.post('AdNewAudits/uploadFileAuditException', data)
  },
  uploadFileWriteOff (data) {
    return http.post('AdNewAudits/uploadFileWriteOff', data)
  },
  auditDebtBillWriteOff (data) {
    return http.post('AdNewAudits/auditDebtBillWriteOff', data)
  },
  auditShopActiveLow (data) {
    return http.get('AdNewAudits/auditShopActiveLow', {'params': data})
  }
}
