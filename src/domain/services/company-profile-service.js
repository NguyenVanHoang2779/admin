import httpErp from 'infrastructures/api-erp-http'

export default {
  getUserList (data) {
    return httpErp.get('AdProfiles/getUserList', {'params': data})
  },

  getUserCompany (data) {
    return httpErp.get('ErpCompanyProfile/getUserCompany', {'params': data})
  },

  getCompanyProfileList (data) {
    return httpErp.get('ErpCompanyProfile/getCompanyProfileList', {'params': data})
  },

  getCompanyProfile (data) {
    return httpErp.get('ErpCompanyProfile/getCompanyProfile', {'params': data})
  },

  getPriceRentTruck (data) {
    return httpErp.get('ErpCompanyProfile/getPriceRentTruck', {'params': data})
  },

  getListPriceUnit (data) {
    return httpErp.get('ErpCompanyProfile/getListPriceUnit', {'params': data})
  },

  getTruckDetail (data) {
    return httpErp.get('ErpCompanyProfile/getTruckDetail', {'params': data})
  },

  uploadReport (data) {
    return httpErp.post('ErpCompanyProfile/uploadReport', data)
  },
  addUser (data) {
    return httpErp.post('ErpCompanyProfile/addUser', data)
  },
  editUser (data) {
    return httpErp.post('ErpCompanyProfile/editUser', data)
  },
  addCompanyProfile (data) {
    return httpErp.post('ErpCompanyProfile/addCompanyProfile', data)
  },

  editCompanyProfile (data) {
    return httpErp.post('ErpCompanyProfile/editCompanyProfile', data)
  },

  updateVehicle (data) {
    return httpErp.post('ErpCompanyProfile/updateVehicle', data)
  },

  updateAwb (data) {
    return httpErp.post('ErpCompanyProfile/updateAwb', data)
  },

  addAwb (data) {
    return httpErp.post('ErpCompanyProfile/addAwb', data)
  },

  getAwbList (data) {
    return httpErp.get('ErpCompanyProfile/getAwbList', {'params': data})
  },

  getAwbs (data) {
    return httpErp.get('ErpCompanyProfile/getAwbs', {'params': data})
  },
  exportAwb (data) {
    return httpErp.get('ErpCompanyProfile/exportAwb', {'params': data})
  },

  uploadAwb (data) {
    return httpErp.post('ErpCompanyProfile/insertAwbInfo', data)
  },
  getAwbPrice () {
    return httpErp.get('ErpAwbPrice/getAll')
  },
  getAirLineCode () {
    return httpErp.get('ErpAwbPrice/getAllAirplaneCode')
  },
  getAwbPriceConfig (data) {
    return httpErp.post('ErpAwbPrice/getConfig', data)
  },
  getPointCode () {
    return httpErp.get('ErpAwbPrice/getPointCode')
  },
  // train bill
  getTrainBills (data) {
    return httpErp.post('ErpCompanyProfile/getTrainBills', data)
  },
  exportTrainBill (data) {
    return httpErp.post('ErpCompanyProfile/exportTrainBill', data)
  },
  getListTrain () {
    return httpErp.get('ErpCompanyProfile/getTrainList')
  },
  getListTrainProvince () {
    return httpErp.get('ErpCompanyProfile/getListTrainProvince')
  },
  deleteTruck (data) {
    return httpErp.post('ErpCompanyProfile/deleteTruck', data)
  },

  changeApprovalStatus (data) {
    return httpErp.post('ErpCompanyProfile/changeApprovalStatus', data)
  },

  changeLeaseType (data) {
    return httpErp.post('ErpCompanyProfile/changeLeaseType', data)
  },

  revertTruck (data) {
    return httpErp.post('ErpCompanyProfile/revertTruck', data)
  },

  deleteAwb (data) {
    return httpErp.post('ErpCompanyProfile/deleteAwb', data)
  },

  mapTruckAndUser (data) {
    return httpErp.post('ErpCompanyProfile/mapTruckAndUser', data)
  },

  getListVehiclesOfCompany (data) {
    return httpErp.post(`ErpCompanyProfile/getListVehiclesOfCompany?company_id=${data}`)
  },

  getAllTruck (data) {
    return httpErp.get('ErpCompanyProfile/getAllTruck', {'params': data})
  },

  buildTruckLog (data) {
    return httpErp.get('ErpCompanyProfile/buildTruckLog', {'params': data})
  },

  addPriceTruck (data) {
    return httpErp.post('ErpCompanyProfile/addPriceRentTruck', data)
  },

  updatePriceTruck (data) {
    return httpErp.post('ErpCompanyProfile/updatePriceRentTruck', data)
  },

  getListTruckPoint (data) {
    return httpErp.get('ErpCompanyProfile/getListTruckPoint', {'params': data})
  },

  updateTruckRoute (data) {
    return httpErp.post('ErpCompanyProfile/updateTruckRoute', data)
  },

  getRentTruckRoutes (data) {
    return httpErp.get('ErpCompanyProfile/getRentTruckRoutes', {'params': data})
  },

  getDetailTruckRoute (data) {
    return httpErp.get('ErpCompanyProfile/getDetailTruckRoute', {'params': data})
  },

  deleteRoute (data) {
    return httpErp.post('ErpCompanyProfile/deleteRoute', data)
  },

  getListTruckRoutes (data) {
    return httpErp.get('ErpCompanyProfile/getListTruckRoutes', {'params': data})
  },

  getInfoTimeDryTruck (data) {
    return httpErp.get('ErpCompanyProfile/getInfoTimeDryTruck', {'params': data})
  },

  getListRentTruckTime (data) {
    return httpErp.get('ErpCompanyProfile/getListRentTruckTime', {'params': data})
  },

  getTruckChangeLog (data) {
    return httpErp.get('ErpCompanyProfile/getTruckChangeLog', {'params': data})
  },

  getTruckComponent (data) {
    return httpErp.get('ErpCompanyProfile/getTruckComponent', {'params': data})
  },

  updateTruckComponent (data) {
    return httpErp.post('ErpCompanyProfile/updateTruckComponent', data)
  },

  updateTruckDocument (data) {
    return httpErp.post('ErpCompanyProfile/updateTruckDocument', data)
  },

  getTruckMaintenanceInfo (data) {
    return httpErp.get('ErpCompanyProfile/getTruckMaintenanceInfo', {'params': data})
  },

  getTruckMaintenance (data) {
    return httpErp.get('ErpCompanyProfile/getTruckMaintenanceV2', {'params': data})
  },

  addTruckMaintenance (data) {
    return httpErp.post('ErpCompanyProfile/addTruckMaintenance', data)
  },

  addTruckMaintenanceV2 (data) {
    return httpErp.post('ErpCompanyProfile/addTruckMaintenanceV2', data)
  },

  removeTruckMaintenance (data) {
    return httpErp.post('ErpCompanyProfile/removeTruckMaintenance', data)
  },

  getTruckMaintenanceDocuments (data) {
    return httpErp.get('ErpCompanyProfile/getTruckMaintenanceDocuments', {'params': data})
  },

  apiGetListDriver (data) {
    return httpErp.get('ErpCompanyProfile/apiGetListDriver', {'params': data})
  },

  exportTruckInfo (data) {
    return httpErp.get('ErpCompanyProfile/exportTruckInfo', {'params': data})
  },

  exportTruckMaintain (data) {
    return httpErp.get('ErpCompanyProfile/exportTruckMaintain', {'params': data})
  },

  getTruckMaintenanceConfig (data) {
    return httpErp.get('ErpCompanyProfile/getTruckMaintenanceConfig', {'params': data})
  },

  getTruckMaintenanceAgents (data) {
    return httpErp.get('ErpCompanyProfile/getTruckMaintenanceAgents', {'params': data})
  },

  updateTruckMaintenanceAgent (data) {
    return httpErp.post('ErpCompanyProfile/updateTruckMaintenanceAgent', data)
  },

  uploadTruckData (data) {
    return httpErp.post('ErpCompanyProfile/uploadTruckData', data)
  },

  getConfigOilLimit (data) {
    return httpErp.post('ErpConfigOilLimit/getConfig', data)
  },

  getListTruckOrder () {
    return httpErp.get('ErpConfigOilLimit/getListTruck')
  },

  getListStationBagConfig () {
    return httpErp.get('ErpBagConfig/getListStations')
  },

  getListProvinceBagConfig () {
    return httpErp.get('ErpBagConfig/getListProvince')
  },

  getListBagConfig (data = null) {
    return httpErp.post('ErpBagConfig/getListBagConfig', data)
  },

  deleteBagConfigById (data = null) {
    return httpErp.post('ErpBagConfig/deleteConfigById', {id: data})
  },

  createBagConfig (data = null) {
    return httpErp.post('ErpBagConfig/createConfig', data)
  },

  updateBagConfigById (data = null) {
    return httpErp.post('ErpBagConfig/updateConfigById', data)
  },

  getListUserById (data = null) {
    return httpErp.post('ErpBagConfig/getListUserById', data)
  },

  getListWsQualityConfig (data = null) {
    return httpErp.post('ErpWsQualityConfig/getListWsQualityConfig', data)
  },

  createWsQualityConfig (data = null) {
    return httpErp.post('ErpWsQualityConfig/createConfig', data)
  },

  updateWsQualityConfig (data = null) {
    return httpErp.post('ErpWsQualityConfig/updateConfigById', data)
  },

  deleteWsQualityConfig (data = null) {
    return httpErp.post('ErpWsQualityConfig/deleteConfigById', data)
  },

  getListStations () {
    return httpErp.get('ErpWsQualityConfig/getListStation')
  },

  getWsQualityConfigById (data) {
    return httpErp.post('ErpWsQualityConfig/getWsQualityConfigById', data)
  },

  getListModuleProvince (data) {
    return httpErp.post('ErpModuleProvince/getListModuleProvince', data)
  },

  createModuleProvince (data) {
    return httpErp.post('ErpModuleProvince/createModuleProvince', data)
  },

  deleteModuleProvince (data) {
    return httpErp.post('ErpModuleProvince/deleteModuleProvince', data)
  },

  updateModuleProvince (data) {
    return httpErp.post('ErpModuleProvince/updateModuleProvince', data)
  },

  getListModuleProvinceLV (data) {
    return httpErp.post('ErpModuleProvince/getListModuleLV', data)
  },

  getTruckDriver (data) {
    return httpErp.get('ErpCompanyProfile/getTruckDriver', {'params': data})
  },

  uploadImage (data) {
    return httpErp.post('ErpCompanyProfile/uploadImage', data)
  },

  updateIncident (data) {
    return httpErp.post('ErpTruckIncident/updateOrCreateIncident', data)
  },

  getAllTruckIncident (data) {
    return httpErp.get('ErpTruckIncident/getAllTruckIncident', {'params': data})
  },

  getTruckIncident (data) {
    return httpErp.get('ErpTruckIncident/getTruckIncident', {'params': data})
  },

  getDriverByTruckCode (data) {
    return httpErp.get('ErpTruckIncident/getDriverByTruckCode', {'params': data})
  },

  deleteTruckIncident (data) {
    return httpErp.post('ErpTruckIncident/deleteTruckIncident', data)
  },

  getCategoryExtern (data) {
    return httpErp.get('ErpCompanyProfile/getCategoryExtern', {'params': data})
  },

  getListRentPlans (data) {
    return httpErp.get('ErpCompanyProfile/getListRentPlans', {'params': data})
  },

  getListRoutes () {
    return httpErp.get('ErpCompanyProfile/getListRoutes')
  },

  getCodeByRentTrucks (data) {
    return httpErp.get('ErpCompanyProfile/getCodeByRentTrucks', {'params': data})
  },

  importRentCarPlan (data) {
    return httpErp.post('ErpCompanyProfile/importRentCarPlan', data)
  },

  exportFileInformationStation (data) {
    return httpErp.get('ErpCompanyProfile/exportFileInformationStation', {'params': data})
  },

  getAllStations () {
    return httpErp.get('ErpCompanyProfile/getAllStations')
  },

  getListRentDriverByCompanys (data) {
    return httpErp.get('ErpCompanyProfile/getListRentDriverByCompanys', {'params': data})
  },

  updateRentTruckPlan (data) {
    return httpErp.post('ErpCompanyProfile/updateRentTruckPlan', data)
  },

  getDetailRentTruckPlan (data) {
    return httpErp.get('ErpCompanyProfile/getDetailRentTruckPlan', {'params': data})
  },

  updateRentTruckDriver (data) {
    return httpErp.post('ErpCompanyProfile/updateRentTruckDriver', data)
  },

  getDetailRentTruckDriver (data) {
    return httpErp.get('ErpCompanyProfile/getDetailRentTruckDriver', {'params': data})
  },

  getRentDriverByProfileId (data) {
    return httpErp.get('ErpCompanyProfile/getRentDriverByProfileId', {'params': data})
  },

  getListRentDrivers (data) {
    return httpErp.get('ErpCompanyProfile/getListRentDrivers', {'params': data})
  },

  importRentCarDriver (data) {
    return httpErp.post('ErpCompanyProfile/importRentCarDriver', data)
  },

  getListTruckEngineer () {
    return httpErp.get('ErpCompanyProfile/getListTruckEngineer')
  },

  getTruckBankMortgage (data) {
    return httpErp.get('ErpCompanyProfile/getTruckBankMortgage', {'params': data})
  },

  updateMortgage (data) {
    return httpErp.post('ErpCompanyProfile/updateMortgage', data)
  },

  checkPermission (data) {
    return httpErp.get('ErpCompanyProfile/checkPermission', {'params': data})
  },

  saveCensorTruck (data) {
    return httpErp.post('ErpCompanyProfile/saveCensorTruck', data)
  },

  checkPermissionManagerTruck (data) {
    return httpErp.get('ErpCompanyProfile/checkPermissionManagerTruck', {'params': data})
  },

  updateTruckSecurityInfo (data) {
    return httpErp.post('ErpCompanyProfile/updateTruckSecurityInfo', data)
  },

  getRecordCensor (data) {
    return httpErp.get('ErpCompanyProfile/getRecordCensor', {'params': data})
  },

  changeStatusRentDriver (data) {
    return httpErp.post('ErpCompanyProfile/changeStatusRentDriver', data)
  },

  getCodeTruck (data) {
    return httpErp.get('ErpCompanyProfile/getCodeTruck', {'params': data})
  },

  getStatusCompanyProfileToQlts (data) {
    return httpErp.get('ErpCompanyProfile/getStatusCompanyProfileToQlts', {'params': data})
  },

  getEcomTruckFlowActivation (data) {
    return httpErp.get('ErpCompanyProfile/getEcomTruckFlowActivation', {'params': data})
  }
}
