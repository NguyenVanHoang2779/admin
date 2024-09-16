import httpErp from 'infrastructures/api-erp-http'

export default {
  getSalryRangeTime (data) {
    return httpErp.get('sales/getRangeTimeSalaryByMonth', {'params': data})
  },
  getCurrentUserInfo () {
    return httpErp.get('sales/getCurrentUserInfo')
  },
  calSaleSalaryByMonth (data) {
    return httpErp.get('sales/calSaleSalaryByMonth', {'params': data})
  },
  getShopDetailInRangeTime (data) {
    return httpErp.get('sales/getShopDetailInRangeTime', {'params': data})
  },
  getAllSalesForTeamProcess () {
    return httpErp.get('sales/getAllSalesTeamProcess')
  },
  createTeamProcess (data) {
    return httpErp.post('sales/createTeamProcess', data)
  },
  getTeamProcess () {
    return httpErp.get('sales/getTeamProcess')
  },
  isLeaderProcessTeam () {
    return httpErp.get('sales/isLeaderTeamProcess')
  },
  deleteTeamProcess (data) {
    return httpErp.put(`sales/deleteTeamProcess?team_id=${data}`)
  },
  checkDuplicateShop (data) {
    return httpErp.get('sales/checkShopDuplicate', {'params': data})
  },
  getListShopByAddress (data) {
    return httpErp.post('sales/getListShopByAddress', data)
  },
  getShopPackage (data) {
    return httpErp.get('sales/getShopPackages', {'params': data})
  },
  getShopInfo (data) {
    return httpErp.get('sales/getShopInfo', {'params': data})
  },
  getPackageSuccess (data) {
    return httpErp.get('sales/getFirstLastPackageSuccessOfShop', {'params': data})
  },
  upadteFirstLastPackage (data) {
    return httpErp.post('sales/updateFirstLastPackageSuccess', data)
  },
  createShopPackage (data) {
    return httpErp.post('sales/createShopPackage', data)
  },
  setActiceShopPackage (data) {
    return httpErp.post('sales/setShopPackageActive', data)
  },
  getAllSalesForExportDataShop (data) {
    return httpErp.get(`sales/getSalesForExportDataShop?region=${data}`)
  },
  exportDataShopToExcel (data) {
    return httpErp.post('sales/exportDataShopToExcel', data)
  },
  isLeaderSale () {
    return httpErp.get('sales/isLeaderSale')
  },
  getAllSalesForAssignMember () {
    return httpErp.get('sales/getSalesForAssignMember')
  },
  getTeamSale () {
    return httpErp.get('sales/getTeams')
  },
  createTeamSale (data) {
    return httpErp.post('sales/createTeam', data)
  },
  deleteTeamSale (data) {
    return httpErp.put('sales/deleteTeam', data)
  },
  getAllSales (data) {
    return httpErp.get(`sales/getAllSales`, {'params': data})
  },
  getSaleSalary (data) {
    return httpErp.get(`sales/showSaleSalary`, {'params': data})
  },
  createSalaryForEachSale (data) {
    return httpErp.get(`sales/createSalaryForEachSale`, {'params': data})
  },
  exportSalarySale (data) {
    return httpErp.post(`sales/exportSalarySaleToExcel`, data)
  },
  exportSaleDay (data) {
    return httpErp.post('sales/exportSalarySaleDay', data)
  },
  searchSale (data) {
    return httpErp.get('sales/searchSale', {'params': data})
  },
  checkProcessSale (data) {
    return httpErp.get('sales/checkProcessExport', {'params': data})
  },
  listDataSaleStage () {
    return httpErp.get('sales/listDataSaleStage')
  },
  checkSale (data) {
    return httpErp.get('sales/checkSaleShop', {'params': data})
  },
  runRevenueShop (data) {
    return httpErp.get('sales/createDataShopReportLastMonth', {'params': data})
  },
  listDataSaleFormula () {
    return httpErp.get('sales/listSaleFormula')
  },
  addSaleFormula (data) {
    return httpErp.post('sales/addSaleFormula', data)
  },
  deleteSaleFormula (data) {
    return httpErp.get('sales/deleteSaleFormula', {'params': data})
  },
  runRenvenueSaleShop (data) {
    return httpErp.get('sales/createDataShopReportLastMonth', {'params': data})
  },
  getAllProvince (data) {
    return httpErp.get('sales/getProvince', {'params': data})
  },
  addRegionSale (data) {
    return httpErp.post('sales/addRegionSale', data)
  },
  getRegionSale () {
    return httpErp.get('sales/getRegionSale')
  },
  deleteRegionSale (data) {
    return httpErp.post('sales/deleteRegionSale', data)
  },
  runDailyPkg (data) {
    return httpErp.post('sales/apiRunShopDailyIn2Month', data)
  },
  getLstProvinces () {
    return httpErp.get('sales/getListProvince')
  }
}
