import httpErp from 'infrastructures/api-erp-http'

export default {
  /**
   * API get list deposits
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getGroupIdOfUser (params) {
    return httpErp.get('ErpDeposits/getGroupIdOfUser', {'params': params})
  },
  getAll (data) {
    return httpErp.get('ErpDeposits/getAll', {'params': data})
  },
  add (data) {
    return httpErp.post('ErpDeposits/add', data)
  },
  changeStatusDeposit (data) {
    return httpErp.post('ErpDeposits/changeStatusDeposit', data)
  },
  saveDepositNote (data) {
    return httpErp.post('ErpDeposits/saveDepositNote', data)
  },
  insertDataUserDisabled (data) {
    return httpErp.post('ErpDeposits/insertDataUserDisabled', data)
  },
  insertOldDeposit (data) {
    return httpErp.post('ErpDeposits/insertOldDeposit', data)
  },
  insertDepositsByExcel (data) {
    return httpErp.post('ErpDeposits/insertDepositsByExcel', data)
  },
  insertRefundsByExcel (data) {
    return httpErp.post('ErpDeposits/insertRefundsByExcel', data)
  },
  requestRefund (data) {
    return httpErp.post('ErpDeposits/requestRefund', data)
  },
  getListRefunds (data) {
    return httpErp.get('ErpDeposits/getListRefunds', {'params': data})
  },
  changeStatusRequestRefund (data) {
    return httpErp.post('ErpDeposits/changeStatusRequestRefund', data)
  },
  getListRefundByHr (data) {
    return httpErp.get('ErpDeposits/getListRefundByHr', {'params': data})
  },
  apiGetListUsers (data) {
    return httpErp.get('ErpDeposits/apiGetListUsers', {'params': data})
  },
  updateInitialDeposit (data) {
    return httpErp.post('ErpDeposits/updateInitialDeposit', data)
  },
  deleteDeposit (data) {
    return httpErp.post('ErpDeposits/deleteDeposit', data)
  },
  getListUserNotHaveDeposit (data) {
    return httpErp.get('ErpDeposits/getListUserNotHaveDeposit', {'params': data})
  },
  setOriginDeposit (data) {
    return httpErp.post('ErpDeposits/setOriginDeposit', data)
  },
  getPermissionDeposit () {
    return httpErp.get('ErpDeposits/getPermissionDeposit')
  },
  exportDeposit (data) {
    return httpErp.get('ErpDeposits/exportDeposit', {'params': data})
  },
  exportDepositRefund (data) {
    return httpErp.get('ErpDeposits/exportDepositRefund', {'params': data})
  },
  checkJobStatus (data) {
    return httpErp.get('ErpDeposits/checkJobStatus', {'params': data})
  },
  getListWorkType (data) {
    return httpErp.get('ErpDeposits/getListWorkType', {'params': data})
  },
  getConfigDeposits (data) {
    return httpErp.get('ErpDeposits/getConfigDeposits', {'params': data})
  },
  updateConfigDeposit (data) {
    return httpErp.post('ErpDeposits/updateConfigDeposit', data)
  },
  deleteConfig (data) {
    return httpErp.post('ErpDeposits/deleteConfig', data)
  },
  updateConfig (data) {
    return httpErp.post('ErpDeposits/updateConfig', data)
  },
  updateDepositState (data) {
    return httpErp.post('ErpDeposits/updateDepositState', data)
  },
  exportDepositConfig () {
    return httpErp.post('ErpDeposits/exportDepositConfig')
  }
}
