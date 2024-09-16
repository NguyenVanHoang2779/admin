import httpRp from 'infrastructures/api-report-http'
import http from 'infrastructures/api-http'
import httpErp from 'infrastructures/api-erp-http'

export default {
  exportWorkDataCod (data) {
    return httpRp.get('RpCods/exportWorkDataOfCodByArea', {'params': data})
  },
  updateCodSalary (data) {
    return httpErp.get('salaryCods/updateCodSalary', {'params': data})
  },
  exportSalaryCod (data) {
    return httpRp.get('RpCods/exportSalaryCod', {'params': data})
  },
  deleteUpdateArea (data) {
    return http.post('AdPackageSalary/deleteUpdateArea', data)
  },
  updateSalaryArea (data) {
    return http.post('AdPackageSalary/updateSalaryArea', data)
  },
  deleteAllPackagesData (data) {
    return http.post('AdPackageSalary/deleteAllPackagesData', data)
  },
  updateDataAreaPackages (data) {
    return http.post('AdPackageSalary/updateDataAreaPackages', data)
  },
  getAllPackagesOfCodInRangeTime (data) {
    return http.get('AdSalaryCods/getAllPackagesOfCodInRangeTime', {'params': data})
  },
  getInfoCod (data) {
    return http.get('AdCods/getInfoCodByAlias', {'params': data})
  },
  updateWhStaffsSalary (data) {
    return http.get('AdWarehouse/updateSnapshotByUser', {'params': data})
  },
  exportSalaryWHManagerHNHCM (data) {
    return http.post('AdWarehouse/exportSalaryWHManagerHNHCM', {'params': data})
  },
  exportSalaryWHManagerProvince (data) {
    return http.post('AdWarehouse/exportSalaryWHManagerProvince', {'params': data})
  },
  exportDataPackagesArea (data) {
    return http.post('AdSalaryCods/exportDataPackagesArea', data)
  },
  updateDataAreaByCod (data) {
    return http.post('AdPackageSalary/updateDataAreaByCod', data)
  },
  apiGetInfoRoutes (data) {
    return httpErp.get('salaryDrivers/apiGetInfoRoutes', {'params': data})
  },
  apiSaveExtraRouteConfig (data) {
    return httpErp.post('salaryDrivers/apiSaveExtraRouteConfig', data)
  },
  getSalaryCodByMonth (data) {
    return httpRp.get('cods/getSalaryCodByMonthV2', {'params': data})
  },
  genSnapshotSalaryByDate (data) {
    return httpRp.get('provinces/genSnapshotSalaryByDate', {'params': data})
  },
  apiGetAllFormulaSalary () {
    return httpErp.get('formulaCods/apiGetAllFormulaSalary')
  },
  updateFormulaCOD (data) {
    return httpErp.post('formulaCods/updateFormulaCOD', data)
  },
  getMinimumSalary (data) {
    return httpErp.get('salaryCods/getMinimumSalary', {'params': data})
  },
  apiGetAllDriversFromStation (data) {
    return httpErp.get('salaryDrivers/apiGetAllDriversFromStation', {'params': data})
  },
  apiGetInfoDriver (data) {
    return httpErp.get('salaryDrivers/apiGetInfoDriver', {'params': data})
  },
  apiGetDataWorkDriverInRangeTime (data) {
    return httpErp.get('salaryDrivers/apiGetDataWorkDriverInRangeTimeOld', {'params': data})
  },
  /**
   * API lay danh sach phu kho theo module Id
   *getOptionForSearchBox
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getListWhStaffByChildModuleId (data) {
    return http.get('AdSearchWHStaff/getListWhStaffByChildModuleId', {'params': data})
  },
  /**
   * API search WH Staff
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  searchWHStaff (data) {
    return http.get('AdSearchWHStaff/searchWhStaff', {'params': data})
  },
  exportProvinceOfficeStaff (data) {
    return httpRp.post('provinces/exportProvinceOfficeStaff', data)
  },
  exportCityOfficeStaff (data) {
    return httpRp.post('provinces/exportCityOfficeStaff', data)
  },
  getListProvinceStation (data) {
    return httpRp.get('provinces/getListProvinceStation', data)
  },
  getListCityStation (data) {
    return httpRp.get('provinces/getListCityStation', data)
  },
  exportOfficeStaff (data) {
    return httpRp.post('provinces/exportOfficeStaff', data)
  },
  getListCityAndProvinceStation (data) {
    return httpRp.get('provinces/getListCityAndProvinceStation', data)
  },
  // API màn hình config lương tối thiểu
  getAllFormulaCod () {
    return httpErp.get('salaryCods/apiGetAllFormulaSalary')
  },
  createConfigSalary (data) {
    return httpErp.post('salaryCods/createConfigMinimumSalary', data)
  },
  getConfigMinimumSalaryCod (data) {
    return httpErp.get('salaryCods/getConfigMinimumSalary', {'params': data})
  },
  deleteConfigMinimumSalaryCod (data) {
    return httpErp.delete(`salaryCods/deleteConfigMinimumSalary?id=${data}`)
  },
  // API quản lý cod trung chuyển partime
  getListIdsProvinceByRegion (data) {
    return httpErp.get(`transits/getListIdsProvinceByRegion`, {'params': data})
  },
  getDataTransitByCondition (data) {
    return httpErp.get(`transits/getDataTransitByCondition`, {'params': data})
  },
  getDataTransitByRangeTime (data) {
    return httpErp.get(`transits/getDataTransitByRangeTime`, {'params': data})
  },
  getTransitDetailByDate (data) {
    return httpErp.get(`transits/getTransitDetailByDate`, {'params': data})
  },
  getTransitDataByStation (data) {
    return httpErp.get(`transits/getTransitDataByStation`, {'params': data})
  },
  exportDataTransit (data) {
    return httpErp.post(`transits/exportDataTransit`, data)
  },
  getAllCodByCondition (data) {
    return httpErp.get(`transits/getAllCodByCondition`, {'params': data})
  },
  getAllExportedFile (data) {
    return httpErp.get(`transits/getAllExportedFile`, {'params': data})
  },
  // Api màn hình config ca checkin cod
  createConfigCheckinV2 (data) {
    return httpErp.post('checkin-cod/createConfigCheckin', data)
  },
  getConfigCheckinCod (data) {
    return httpErp.get('salaryCods/getConfigCheckin', {'params': data})
  },
  getConfigCheckinCodV2 (data) {
    return httpErp.get('checkin-cod/getConfigCheckin', {'params': data})
  },
  getConfigUser (data) {
    return httpErp.get('checkin-cod/getUserConfig', {'params': data})
  },
  getConfigUserNew (data) {
    return httpErp.get('checkin-cod/getUserConfigNew', {'params': data})
  },
  deleteConfigCheckinV2 (data) {
    return httpErp.post('checkin-cod/deleteConfigCheckin', {'id_config': data})
  },
  updateConfigCheckinV2 (data) {
    return httpErp.post('checkin-cod/updateConfigCheckin', {'params': data})
  },
  // Api màn hình quản lý checkin
  getListStopPointByProvince (data) {
    return httpErp.get('salaryCods/getListStopPointByProvince', {'params': data})
  },
  getAllDataCheckinByCondition (data) {
    return httpErp.get('salaryCods/getAllDataCheckinByRangeTime', {'params': data})
  },
  getAllDataCheckinByConditionNew (data) {
    return httpErp.get('salaryCods/getAllDataCheckinByRangeTimeNew', {'params': data})
  },
  exportDataCheckin (data) {
    return httpErp.get('salaryCods/exportDataCheckin', {'params': data})
  },
  getUser (data) {
    return httpErp.get('checkin-cod/getInfoCod', {'params': data})
  },
  addCheckinUser (data) {
    return httpErp.post('checkin-cod/addCheckinUser', data)
  },
  addCheckinUserNew (data) {
    return httpErp.post('checkin-cod/addCheckinUserNew', data)
  },
  updateStatusCheckin (data) {
    return httpErp.post('salaryCods/updateStatusCheckin', data)
  },
  getLogPkBus (data) {
    return httpErp.get('salaryCods/getLogPkBus', {'params': data})
  },
  //  quản lý các file data, lương xuất trên bảng chung sgw_excel_export_processes
  getExportedFileByCondition (data) {
    return httpErp.get('transits/getExportedFileByCondition', {'params': data})
  },
  deleteFile (data) {
    return httpErp.get('transits/deleteExportedFileById', {'params': data})
  },
  /*
  * // Các hàm xuất lương cho tài xế
  * */
  exportSalaryDriver (data) {
    return httpErp.post('ErpExportSalaryDriver/exportSalaryDriver', data)
  },
  runDriverSalary (data) {
    return httpErp.post('ErpExportSalaryDriver/runSalaryDriver', data)
  },
  exportBOTPoints (data) {
    return httpErp.post('ErpExportSalaryDriver/exportBOTPoints', data)
  },
  exportSalaryDriverDetail (data) {
    return httpErp.post('ErpExportSalaryDriver/exportSalaryDriverDetail', data)
  },
  exportSalaryDriverRangeTime (data) {
    return httpErp.post('ErpExportSalaryDriver/exportSalaryDriverRangeTime', data)
  },
  exportKpiSalaryDriver (data) {
    return httpErp.post('ErpExportSalaryDriver/exportKpiSalaryDriver', data)
  },
  exportKpiSalaryDriverRangeTime (data) {
    return httpErp.post('ErpExportSalaryDriver/exportKpiSalaryDriverRangeTime', data)
  },
  exportSsLienMienKpi (data) {
    return httpErp.post('ErpExportSalaryDriver/exportSsLienMienKpi', data)
  },
  runCancelSs (data) {
    return httpErp.post('ErpExportSalaryDriver/runReviewCancelSs', data)
  },
  runDriverHistories (data) {
    return httpErp.get('ErpExportSalaryDriver/runDriverHistories', {'params': data})
  },
  // F1000 cod tinh
  showSalary (data) {
    return httpErp.get('salaryCods/getSalaryCodByMonthV2', {'params': data})
  },
  showSalaryDate (data) {
    return httpErp.get('salaryCods/getSalaryCodWorkshift', {'params': data})
  },
  showDataDetailByDate (data) {
    return httpErp.get('salaryCods/getDetailDataByDate', {'params': data})
  },
  showSalaryByYear (data) {
    return httpErp.get('salaryCods/showSalaryCodProvinceByYear', {'params': data})
  },
  exportSalaryCodProvinceV2 (data) {
    return httpErp.post('salaryCods/exportSalaryCodProvinceV2', data)
  },
  exportTransitCodSalary (data) {
    return httpErp.post('erpExportTransitCodSalary/exportTransitCodSalary', data)
  },
  exportTransitCodSalaryByUsername (data) {
    return httpErp.post('erpExportTransitCodSalary/exportTransitCodSalaryByUsernames', data)
  },
  exportTransitCodSalaryByRangeTime (data) {
    return httpErp.post('erpExportTransitCodSalary/exportTransitCodSalaryRangeTime', data)
  },
  getListFiles () {
    return httpErp.post('erpExportTransitCodSalary/getListFiles')
  },
  removeExportFile (data) {
    return httpErp.post('erpExportTransitCodSalary/removeExportFile', data)
  },
  getListFilesDataDriver (data) {
    return httpErp.post('erpExportSalaryDriver/getListFilesDataDriver', data)
  },
  getListFilesSalaryDriver (data) {
    return httpErp.post('erpExportSalaryDriver/getListFilesExportDriverSalary', data)
  },
  removeExportFileDataDriver (data) {
    return httpErp.post('erpExportSalaryDriver/removeExportFileDataDriver', data)
  },
  getListRunningFilesDataDriver (data) {
    return httpErp.post('erpExportSalaryDriver/getListRunningFilesDataDriver', data)
  },
  // bo toan trinh
  removeQuality (data) {
    return httpErp.post('time-remove-quality/addTimeRemoveQuality', data)
  },
  getConfigBoToanTrinh (data) {
    return httpErp.post('time-remove-quality/getTimeRemoveQuality', data)
  },
  getGroupTimeRemoveQuality (data) {
    return httpErp.post('time-remove-quality/getGroupTimeRemoveQuality', data)
  },
  deleteConfigTRQ (data) {
    return httpErp.post('time-remove-quality/deleteConfigByListId', data)
  },
  getListStationsToanTrinh () {
    return httpErp.get('time-remove-quality/getListStations')
  },
  getListStationsByCondition (data) {
    return httpErp.post('time-remove-quality/getListStationsByCondition', data)
  },
  getListProvince () {
    return httpErp.get('time-remove-quality/getListProvince')
  },
  updateConfigTRQ (data) {
    return httpErp.post('time-remove-quality/updateConfigById', data)
  },
  getListStationByProvinceIdsV2 (params) {
    return httpErp.get('time-remove-quality/getListStationByProvinceIdsV2', {'params': params})
  },
  // salary lien vung
  exportSalaryLV (data) {
    return httpErp.post('salary-lien-vung/exportSalaryLV', data)
  },
  getListStations () {
    return httpErp.get('salary-lien-vung/getListStations')
  },
  getListLvAndNvStation () {
    return httpErp.get('salary-lien-vung/getListLvAndNvStation')
  },
  getLuongLV (data) {
    return httpErp.post('salary-lien-vung/getLuongLV', data)
  },
  autoCompleteUserLV (data) {
    return httpErp.post('salary-lien-vung/autoCompleteUser', data)
  },
  apiGetUserLV (data) {
    return httpErp.post('salary-lien-vung/apiGetUser', data)
  },
  // salary noi vung
  exportSalaryNV (data) {
    return httpErp.post('salary-noi-vung/exportSalaryNV', data)
  },
  getLuongNV (data) {
    return httpErp.post('salary-noi-vung/getLuongNV', data)
  },
  getListStationsNV () {
    return httpErp.get('salary-noi-vung/getListStations')
  },
  autoCompleteUserNV (data) {
    return httpErp.post('salary-noi-vung/autoCompleteUser', data)
  },
  apiGetUserNV (data) {
    return httpErp.post('salary-noi-vung/apiGetUser', data)
  },
  // salary noi vung huyen
  getListStationsNVHuyen () {
    return httpErp.get('salary-noi-vung-tinh/getListStationsHuyen')
  },
  // salary noi vung tinh
  exportSalaryNVTinh (data) {
    return httpErp.post('salary-noi-vung-tinh/exportSalary', data)
  },
  getListStationsNVTinh (data) {
    return httpErp.get('salary-noi-vung-tinh/getListStationsTinh', {'params': data})
  },
  // salary dp noi vung city
  exportSalaryNVCity (data) {
    return httpErp.post('salary-city/exportSalaryStaffCity', data)
  },
  getListStationsNVCity (data) {
    return httpErp.get('salary-city/getListStationsCity', {'params': data})
  },
  // Tối ưu thu nhập
  getSalaryOptimize (data) {
    return httpErp.get('optimizeSalary/getSalary', {'params': data})
  },
  getDetailOptimizeSalary (data) {
    return httpErp.get('optimizeSalary/getSalaryDetail', {'params': data})
  },
  // salary PO
  exportSalaryPO (data) {
    return httpErp.post('salary-po/exportSalaryPO', data)
  },
  //
  exportSalaryXLH2021 (data) {
    return httpErp.post('salary-xlhh/exportSalaryByMonth', data)
  },
  exportSalaryXlhBuuCuc2021 (data) {
    return httpErp.post('sal-po/exportSalaryXlhBcByMonth', data)
  },
  exportSalaryXLHOnsite2020 (data) {
    return httpErp.post('salary-onsite/apiExportDataToCsv', data)
  },
  exportSalaryPo2021 (data) {
    return httpErp.post('sal-po/exportSalaryByMonth', data)
  },
  exportSalaryWs2021 (data) {
    return httpErp.post('sal-ws/exportSalaryByMonth', data)
  },
  exportSalaryPoManager2021 (data) {
    return httpErp.post('sal-po/exportSalManagerByMonth', data)
  },
  exportSalaryFulFillment2021 (data) {
    return httpErp.post('sal-ff/exportSalaryByMonth', data)
  },
  exportSalaryNVBC2022 (data) {
    return httpErp.post('sal-po-v2/exportSalaryPoV2ByMonth', data)
  },
  exportSalaryOnsite (data) {
    return httpErp.post('ErpSalOnsite/exportSalaryByMonth', data)
  },
  getListStationsPO () {
    return httpErp.get('salary-po/getListStations')
  },
  // salary DPLV
  exportSalaryDPLV (data) {
    return httpErp.post('salary-lien-vung/exportSalaryDPLV', data)
  },
  getListStationsDPLVTinh () {
    return httpErp.get('salary-lien-vung/getListStationsDPLVTinh')
  },
  getListStationsDPLVCity () {
    return httpErp.get('salary-lien-vung/getListStationsDPLVCity')
  },
  // Config pk part time
  getConfigPkPartTime (data) {
    return httpErp.post('xlh-thoi-vu/getConfigPkPartTime', data)
  },
  updateConfigPkPartTime (data) {
    return httpErp.post('xlh-thoi-vu/updateConfigPkPartTime', data)
  },
  updateConfigPkPartTimeV2 (data) {
    return httpErp.post('xlh-thoi-vu/updateConfigPkPartTimeV2', data)
  },
  createConfigPkPartTime (data) {
    return httpErp.post('xlh-thoi-vu/createConfigPkPartTime', data)
  },
  createConfigPkPartTimeV2 (data) {
    return httpErp.post('xlh-thoi-vu/createConfigPkPartTimeV2', data)
  },
  getListRegion () {
    return httpErp.post('xlh-thoi-vu/getListRegion')
  },
  getListProvinceByRegion (data) {
    return httpErp.post('xlh-thoi-vu/getListProvinceByRegion', data)
  },
  getListStationByRegion (data) {
    return httpErp.post('xlh-thoi-vu/getListStationByRegion', data)
  },
  getListStationByAddress (data) {
    return httpErp.post('xlh-thoi-vu/getListStationByAddress', data)
  },
  getStationUseConfig (data) {
    return httpErp.post('xlh-thoi-vu/getStationUseConfig', data)
  },
  getProvinceUseConfig (data) {
    return httpErp.post('xlh-thoi-vu/getProvinceUseConfig', data)
  },
  getRegionUseConfig (data) {
    return httpErp.post('xlh-thoi-vu/getRegionUseConfig', data)
  },
  setConfigForListStation (data) {
    return httpErp.post('xlh-thoi-vu/setConfigForListStation', data)
  },
  setConfigForListProvince (data) {
    return httpErp.post('xlh-thoi-vu/setConfigForListProvince', data)
  },
  setConfigForListRegion (data) {
    return httpErp.post('xlh-thoi-vu/setConfigForListRegion', data)
  },
  getAddressFromListStation (data) {
    return httpErp.post('xlh-thoi-vu/getAddressFromListStation', data)
  },
  getRegionFromListProvince (data) {
    return httpErp.post('xlh-thoi-vu/getRegionFromListProvince', data)
  },
  delConfigForListStation (data) {
    return httpErp.post('xlh-thoi-vu/delConfigForListStation', data)
  },
  delConfigForListRegion (data) {
    return httpErp.post('xlh-thoi-vu/delConfigForListRegion', data)
  },
  exportSalaryPkParttime (data) {
    return httpErp.post('xlh-thoi-vu/exportSalaryPkParttime', data)
  },
  getDataSalaryPkParttimeByHour (data) {
    return httpErp.post('xlh-thoi-vu/getDataSalaryPkParttimeByHour', data)
  },
  getCodNote () {
    return httpErp.get('cods/note')
  },
  postCodNote (data) {
    return httpErp.post('cods/note/addNote', data)
  },
  postCodNoteDelete (data) {
    return httpErp.post('cods/note/delete', data)
  },
  postCodNoteUpdate (data) {
    return httpErp.post('cods/note/updateItem', data)
  },
  seachCodNote (data) {
    return httpErp.get('cods/note/search', {'params': data})
  },
  exportExcel () {
    return httpErp.get('cods/note/exportExcelCod')
  },
  searchCod (data) {
    return httpErp.get('cods/note/searchCod', {'params': data})
  },
  importExcel (data) {
    return httpErp.post('cods/note/importexcel', data)
  },
  // Config bỏ phạt
  createConfigFine (data) {
    return httpErp.post('salaryCods/createConfigFine', data)
  },
  getConfigFine (data) {
    return httpErp.post('salaryCods/getConfigFine', data)
  },
  exportConfigFine (data) {
    return httpErp.get('salaryCods/exportConfigFine', {'params': data})
  },
  deleteGroupConfigFine (data) {
    return httpErp.get('salaryCods/deleteGroupConfigFine', {'params': data})
  },
  calSalaryCodFine (data) {
    return httpErp.post('salaryCods/calSalaryCodFine', data)
  },
  postMessageCod (data) {
    return httpErp.post('message/sentMessageMissKpi', data)
  },
  getProvincesByRegion (data) {
    return httpErp.get('message/getProvince', {'params': data})
  },
  getlistStationByProvince (data) {
    return httpErp.get('message/getStation', {'params': data})
  },
  searchUser (data) {
    return httpErp.get('message/searchUser', {'params': data})
  },
  checkRunMessage (data) {
    return httpErp.get('message/checkRunMessage', {'params': data})
  },
  searchUserIdByLocal (data) {
    return httpErp.post('message/searchUserIdByLocal', data)
  },
  searchPostition () {
    return httpErp.get('message/getPostitionGroup')
  },
  getDataMessageAlert () {
    return httpErp.get('message/listMessageSended')
  },
  getSearchDataByDate (data) {
    return httpErp.post('message/searchMessageByDate', data)
  },
  getSearchCodStar (data) {
    return httpErp.get('salaryCods/searchCodStar', {'params': data})
  },
  runSalaryCodStar (data) {
    return httpErp.get('salaryCods/calKpiCodStar', {'params': data})
  },
  ExportCodStar (data) {
    return httpErp.post('salaryCods/exportExcelCodStar', data)
  },
  getlistExcelCodStar () {
    return httpErp.get('salaryCods/getListExcelCodStar')
  },
  loadProcessCodStar (data) {
    return httpErp.get('salaryCods/loadProcessExcel', {'params': data})
  },
  checkRunCodStar (data) {
    return httpErp.get('salaryCods/checkRunCodStar', {'params': data})
  },
  codStarDelete (data) {
    return httpErp.get('salaryCods/deteteExCodStar', {'params': data})
  },
  getLisCodCtv () {
    return httpErp.get('cod/ctv/listAll')
  },
  exportExcelCodCtv (data) {
    return httpErp.post('cod/ctv/exportExcel', data)
  },
  exportExcelCodCtvV2 (data) {
    return httpErp.post('cod/ctv/exportPkgCtv', data)
  },
  checkRunExcelCtv (data) {
    return httpErp.get('cod/ctv/checkRunExcel', {'params': data})
  },
  codCtvDelete (data) {
    return httpErp.get('cod/ctv/deleteCodCtv', {'params': data})
  },
  exportSalaryCodCtv (data) {
    return httpErp.post('cod/ctv/excelSalaryCtv', data)
  },
  listSalaryCodCTV () {
    return httpErp.get('cod/ctv/listSalaryCodCTV')
  },
  changeFile (data) {
    return httpErp.get('cod/ctv/changeFile', {'params': data})
  },
  searchCtvCod (data) {
    return httpErp.post('cod/ctv/searchUserCtv', data)
  },
  checkConfigByUserCtv (data) {
    return httpErp.get('cod/ctv/checkSalaryByUser', {'params': data})
  },
  addFileDoc (data) {
    return httpErp.post('file-document/addFile', data)
  },
  upateFileDoc (data) {
    return httpErp.post('file-document/updateItem', data)
  },
  deleteFileDoc (data) {
    return httpErp.post('file-document/deleteItem', data)
  },
  listAllFile () {
    return httpErp.post('file-document/listAll')
  },
  exportCtvOrder (data) {
    return httpErp.post('cod/ctv/exportOrderOfDay', data)
  },
  listFileCtvOrder (data) {
    return httpErp.get('cod/ctv/listDataFile', {'params': data})
  },
  runSalaryCod (data) {
    return httpErp.post('cod/ctv/runSalary', data)
  },
  exportIndicatorCod (data) {
    return httpErp.get('salaryCods/exportIndicatorCod', {'params': data})
  },
  listCodTraining () {
    return httpErp.get('salaryCods/listTrainingHouseCodStar')
  },
  addCodTraining (data) {
    return httpErp.post('salaryCods/addTrainingHouseCodStar', data)
  },
  importCodTraining (data) {
    return httpErp.post('salaryCods/importTrainingCodStar', data)
  },
  editCodTraining (data) {
    return httpErp.post('salaryCods/editTrainingHouseCodStar', data)
  },
  deleteCodTraining (data) {
    return httpErp.post('salaryCods/deleteTrainingHouseCodStar', data)
  },
  searchCodTraining (data) {
    return httpErp.get('salaryCods/searchTrainingHouseCodStar', {'params': data})
  },
  exportCtvOrderRegion (data) {
    return httpErp.post('cod/ctv/exportOrderRegion', data)
  },
  searchCodByStations (data) {
    return httpErp.post('salaryCods/searchCodByStations', data)
  },
  searchCodV2 (data) {
    return httpErp.get('salaryCods/searchCod', {'params': data})
  },
  getWorkingOvertimes (data) {
    return httpErp.get('ErpWorkingOvertime/getWorkingOvertimes', {'params': data})
  },
  searchXLHH (data) {
    return httpErp.get('xlh-thoi-vu/searchXLHH', {'params': data})
  },
  getConfigPkBusById (data) {
    return httpErp.get('checkin-cod/getConfigPkBusById', {'params': data})
  },
  exportSalaryByMonthGsXFast (data) {
    return httpErp.get('ErpSalGsXFast/exportSalaryByMonth', {'params': data})
  },
  exportSalaryByMonth2022Gsk (data) {
    return httpErp.get('ErpSalWs/exportSalaryByMonth2022', {'params': data})
  },

  checkPermission () {
    return httpErp.get('salaryCods/checkPermission')
  }
}
