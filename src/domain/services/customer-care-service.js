import httpErp from 'infrastructures/api-erp-http'

export default {
  isLeaderB2C () {
    return httpErp.get('customerCares/isLeaderB2C')
  },
  getCustomerCares () {
    return httpErp.get('customerCares/getCustomerCaresB2C')
  },
  getAllCustomerCaresB2c (data) {
    return httpErp.get('customerCares/getAllCustomerCaresB2C', {'params': data})
  },
  checkRunExcel (data) {
    return httpErp.get('customerCares/checkRunExcel', {'params': data})
  },
  exportDataRevenueShop (data) {
    return httpErp.post('customerCares/exportDataRevenueShopB2C', data)
  },
  getDataRevenueShop (data) {
    return httpErp.get('customerCares/getDataRevenueShop', {'params': data})
  },
  insertCustomerCareTeam (data) {
    return httpErp.post('customerCares/createTeam', data)
  },
  getCustomerCareTeams (data) {
    return httpErp.get('customerCares/getTeams', {'params': data})
  },
  deleteTeam (data) {
    return httpErp.put('customerCares/deleteTeam', data)
  },
  getAllMemberCustomerCareB2C () {
    return httpErp.get('customerCares/getAllMemberCustomerCaresB2C')
  },
  getAllLeaderCustomerCareB2C () {
    return httpErp.get('customerCares/getAllLeaderCustomerCaresB2C')
  },
  createMemberSalary (data) {
    return httpErp.get('customerCares/calEachMemberSalary', {'params': data})
  },
  createLeaderSalary (data) {
    return httpErp.get('customerCares/calEachLeaderSalary', {'params': data})
  },
  showCustomerCareB2CSalary (data) {
    return httpErp.post('customerCares/showCustomerCareB2CSalaryByMonth', data)
  },
  exportCustomerCareB2CSalary (data) {
    return httpErp.post('customerCares/exportCustomerCareB2CSalary', data)
  },
  getListShopGoneAway (data) {
    return httpErp.get('customerCares/getListShopGoneAway', {'params': data})
  },
  checkShopNoRevenue (data) {
    return httpErp.get('customerCares/checkShopNoRevenue', {'params': data})
  },
  checkUserNoSalary (data) {
    return httpErp.get('customerCares/checkUserNoSalary', {'params': data})
  },
  getAllCustomerC2c (data) {
    return httpErp.get('customerCares/getAllCustomerC2c', {'params': data})
  },
  showSalaryCustomerC2c (data) {
    return httpErp.get('customerCares/showSalaryCustomerC2c', {'params': data})
  },
  getDataSalaryC2c (data) {
    return httpErp.get('customerCares/getDataSalaryC2c', {'params': data})
  },
  exportDataFromClient (data) {
    return httpErp.post('customerCares/exportDataFromClient', data)
  },
  getShopDuplicate (data) {
    return httpErp.get('customerCares/getShopDuplicate', {'params': data})
  },
  deleteShopDuplicate (data) {
    return httpErp.get('customerCares/deleteShopDuplicate', {'params': data})
  },
  exportShopDuplicateByMonth (data) {
    return httpErp.get('customerCares/exportShopDuplicateByMonth', {'params': data})
  },
  createGroupShopDuplicate (data) {
    return httpErp.get('customerCares/createGroupShopDuplicate', {'params': data})
  },
  updateShopDuplicate (data) {
    return httpErp.post('customerCares/updateStatusShopDupicate', data)
  }
}
