import http from 'infrastructures/api-http'
import httpErp from 'infrastructures/api-erp-http'
export default {
  /**
   * API search staff
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  searchStaff (data) {
    return http.get('AdSearchStaff/searchStaff', {'params': data})
  },
  /**
   * API export staff
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  exportExcel (data) {
    return http.get('AdSearchStaff/exportExcel', {'params': data})
  },

  /**
   * API lay danh sach phu kho theo kho
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getListWhStaffByStationId (data) {
    return http.get('AdSearchWHStaff/getListWhStaffByStationId', {'params': data})
  },
  /**
   * API search WH Staff
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getListLoadingBlockByUserAndDate (data) {
    return http.post('AdSearchWHStaff/getListLoadingBlockByUserAndDate', {'params': data})
  },

  /**
   * API get contract detail
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getContractDetail (data) {
    return http.get('AdContract/getContractDetail', {'params': data})
  },

  /**
   * API get user of contract
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getUserOfContract (data) {
    return http.get('AdContract/getUserOfContract', {'params': data})
  },
  /**
   * API create contract
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  createContract (data) {
    return http.post('AdContract/createContract', data)
  },
  /**
   * API update contract
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  updateContract (data) {
    return http.post('AdContract/updateContract', data)
  },
  /**
   * API disable Contract
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  disableContract (data) {
    return http.post('AdContract/disableContract', data)
  },

  getListColumnsExport () {
    return http.get('/AdSearchStaff/getListColumnsExport')
  },

  getContractList (data) {
    return http.get('AdContract/getContractList', {'params': data})
  },

  getContractById (data) {
    return http.get('AdContract/getContractById', {'params': data})
  },

  getAllProvince () {
    return http.get('AdContract/getAllProvince')
  },

  getProvinceByRegionId (data) {
    return http.get('AdContract/getProvinceByRegionId', {'params': data})
  },

  getAllStation () {
    return http.get('AdContract/getAllStation')
  },

  getStationListByProvinceId (data) {
    return http.get('AdContract/getStationListByProvinceId', {'params': data})
  },

  getStationListByRegionId (data) {
    return http.get('AdContract/getStationListByRegionId', {'params': data})
  },

  getProfile (data) {
    return http.get('AdMasterProfile/getProfile', {'params': data})
  },

  checkSameCmnd (data) {
    return http.post('AdMasterProfile/checkSameCmnd', data)
  },

  addProfile (data) {
    return http.post('AdMasterProfile/add', data)
  },

  editProfile (data) {
    return http.post('AdMasterProfile/edit', data)
  },

  editVirtualProfile (data) {
    return http.post('AdMasterProfile/editVirtualProfile', data)
  },

  editShift (data) {
    return httpErp.post('ErpKpiShift/updateShiftConfig', data)
  },

  getConfigByUser (data) {
    return httpErp.get('ErpKpiShift/getConfigByUser', {'params': data})
  },

  deleteProfile (data) {
    return http.get('AdMasterProfile/deleteProfile', {'params': data})
  },

  getUser (data) {
    return http.get('AdUsers/getUser', {'params': data})
  },

  getShiftByProfile (data) {
    return http.get('AdUsers/getShiftByProfile', {'params': data})
  },

  checkEditLevel (data) {
    return http.get('AdUsers/checkEditLevel', {'params': data})
  },

  addUser (data) {
    return http.post('AdUsers/addUser', data)
  },

  editUser (data) {
    return http.post('AdUsers/editUser', data)
  },

  getModuleByStation (data) {
    return http.get('AdMasterProfile/getModulesByStation', {'params': data})
  },

  getAllMasterProfile (data) {
    return http.get('AdMasterProfile/getAllMasterProfile', {'params': data})
  },

  getMasterProfile (data) {
    return http.get('AdMasterProfile/getMasterProfile', {'params': data})
  },

  getWorkTypeByPositionJob (data) {
    return http.get('AdUsers/getworktypeV2', {'params': data})
  },

  getListBank (data) {
    return http.get('AdMasterProfile/getListBanks', {'params': data})
  },

  getListBrandsByBankCode (data) {
    return http.get('AdMasterProfile/getListBrandsByBankCode', {'params': data})
  },

  getListModuleByStationId (data) {
    return http.get('AdSearchWHStaff/getListModuleByStationId', {'params': data})
  },

  getListExternalStation (data) {
    return http.get('AdStations/getListExternalStationForSelection', {'params': data})
  },

  getLeaderByStation (data) {
    return http.get('AdUsers/getLeaderByStation', {'params': data})
  },

  updateConfigReportLineMultipleStaff (data) {
    return http.post('AdReportingLine/updateConfigReportLineMultipleStaff', {'params': data})
  },

  updateConfigReportLineSingleStaff (data) {
    return http.post('AdReportingLine/updateConfigReportLineSingleStaff', {'params': data})
  },

  getListConfigByLeader (data) {
    return http.get('AdReportingLine/getReportingLineConfig', {'params': data})
  },

  getManagerEmployeeOfUser (data) {
    return http.get('AdReportingLine/getManagerEmployeeOfUser', { params: data })
  },

  updateManagerEmployeeOfUser (data) {
    return http.post('AdReportingLine/updateManagerEmployeeOfUser', data)
  },

  checkCanCustomUserName (data) {
    return http.get('AdUsers/checkCanCustomUserName', {'params': data})
  },

  suggestManagerEmployeeForUser (data) {
    return http.post('AdUsers/suggestManagerEmployeeForUser', data)
  },

  getMemberLeaderChange (data) {
    return http.get('AdUsers/getMemberChangeInDate', {'params': data})
  },

  checkPermissionEditCmnd (data) {
    return http.get('AdMasterProfile/checkPermissionEditCmnd', {'params': data})
  },

  getContractByProfile (data) {
    return http.get('AdContract/getContractByProfile', {params: data})
  },

  getListAppendix (data) {
    return http.get('AdContract/getListAppendix', {params: data})
  },

  uploadFileContract (data) {
    return http.post('AdContract/uploadFileContract', data)
  },

  getFileContract (data) {
    return http.get('AdContract/getFileContract', { params: data })
  },

  uploadFileSalary (data) {
    return http.post('AdContract/uploadFileSalary', data)
  },

  checkStatusUploadSalary (data) {
    return http.get('AdContract/checkStatusUploadSalary', {params: data})
  },

  checkPermissionUploadSalary (data) {
    return http.get('AdContract/CheckPermissionUploadSalary', {params: data})
  },

  // Thay đổi mật khẩu cho user từ màn chi tiết user
  quickChangePassword (data) {
    return http.post('AdUsers/quickChangePassword', data)
  },

  createNewUser (data) {
    return http.post('AdUsers/createNewUser', data)
  },

  checkIsChangeKpi (data) {
    return http.get('AdUsers/checkIsChangeKpi', {params: data})
  }
}
