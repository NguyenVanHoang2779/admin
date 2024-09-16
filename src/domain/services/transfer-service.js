import http from 'infrastructures/api-http'

export default {
  /**
   * API search shop quick transfer info
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  searchShopQuickTransfer (data) {
    return http.get('AdQuickTransfer/getShopQuickTransfer', {'params': data})
  },
  viewPackageWaitTransfer (data) {
    return http.get('AdQuickTransfer/viewPackageWaitTransfer', {'params': data})
  },
  quickTransfer (data) {
    return http.post('/AdQuickTransfer/quickTransfer', data)
  },
  searchTransferRealtime (data) {
    return http.get('AdQuickTransfer/getTransferRealtime', {'params': data})
  },
  viewTransferRealtime (data) {
    return http.get('AdQuickTransfer/viewTransferRealtime', {'params': data})
  },
  exportPackageTransfer (data) {
    return http.get('AdQuickTransfer/exportPkgTransferRealtime', {'params': data})
  },
  searchRequestWaitConfirm (data) {
    return http.get('AdQuickTransfer/getRequestWaitConfirm', {'params': data})
  },
  viewPackageConflict (data) {
    return http.get('AdQuickTransfer/viewPackageConflictMoney', {'params': data})
  },
  confirmTransferRealtime (data) {
    return http.post('/AdQuickTransfer/confirmTransferRealtime', data)
  },
  rejectTransferRealtime (data) {
    return http.post('/AdQuickTransfer/rejectRequestShop', data)
  }
}
