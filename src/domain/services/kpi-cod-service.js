import httpErp from 'infrastructures/api-erp-http'

export default {
  // API màn hình config công thức lương
  apiGetAllFormulaByDistrict () {
    return httpErp.get('formulaCods/apiGetAllFormulaByDistrict')
  },
  apiGetListWorkTypes () {
    return httpErp.get('formulaCods/apiGetListWorkTypes')
  },
  apiGetListPositions () {
    return httpErp.get('formulaCods/apiGetListPositions')
  },
  apiGetListDistricts () {
    return httpErp.get('formulaCods/apiGetListDistricts')
  },
  apiSaveDataFormula (data) {
    return httpErp.post('formulaCods/apiSaveDataFormula', data)
  },
  apiSaveDataFormulaByDistrict (data) {
    return httpErp.post('formulaCods/apiSaveDataFormulaByDistrict', data)
  },
  apiConfigFormulaDistrict (data) {
    return httpErp.post('formulaCods/apiConfigFormulaDistrict', data)
  },
  apiGetDataFormulaByDistrict (data) {
    return httpErp.get('formulaCods/apiGetDataFormulaByDistrict', {'params': data})
  },
  apiChangeStatusFormula (data) {
    return httpErp.post('formulaCods/apiChangeStatusFormula', data)
  },
  apiGetFilteredStations (data) {
    return httpErp.get('formulaCods/apiGetFilteredStations', {'params': data})
  },

  // API màn hình xuất lương
  apiExportSalaryCod (data) {
    return httpErp.post('export-salary-cod/apiExportSalaryCod', data)
  },
  apiCreateSalary (data) {
    return httpErp.post('salaryCods/apiCreateSalary', data)
  },
  apiGetCountTasksProcess (data) {
    return httpErp.post('export-salary-cod/apiGetCountTasksProcess', data)
  },
  apiMergeAllFileToExport (data) {
    return httpErp.post('export-salary-cod/apiMergeAllFileToExport', data)
  },
  // API màn hình xuất lương
  apiExportSalaryCodV2 (data) {
    return httpErp.post('export-salary-cod/apiExportSalaryCodV2', data)
  },
  apiGetCountTasksProcessV2 (data) {
    return httpErp.post('export-salary-cod/apiGetCountTasksProcessV2', data)
  },
  apiMergeAllFileToExportV2 (data) {
    return httpErp.post('export-salary-cod/apiMergeAllFileToExportV2', data)
  },
  apiCancelProcessExportSalary (data) {
    return httpErp.post('export-salary-cod/apiCancelProcessExportSalary', data)
  },
  apiGetAllFileExportInMonthSalary (data) {
    return httpErp.post('export-salary-cod/apiGetAllFileExportInMonthSalary', data)
  },
  apiGetLastProcessInTable () {
    return httpErp.post('export-salary-cod/apiGetLastProcessInTable')
  },
  apiDeleteFileSalaryCodExport (data) {
    return httpErp.post('export-salary-cod/apiDeleteFileSalaryCodExport', data)
  },
  apiRenameFileSalaryCodExport (data) {
    return httpErp.post('export-salary-cod/apiRenameFileSalaryCodExport', data)
  },

  // API màn hình config CTVTV
  apiCtvGetRegions (data) {
    return httpErp.get('ctv-salary/apiGetRegions', {'params': data})
  },
  apiCtvGetProvinces (data) {
    return httpErp.get('ctv-salary/apiGetProvinces', {'params': data})
  },
  apiCtvGetDistricts (data) {
    return httpErp.get('ctv-salary/apiGetDistricts', {'params': data})
  },
  apiCtvGetStations (data) {
    return httpErp.get('ctv-salary/apiGetStations', {'params': data})
  },
  apiCtvGetWorkTypes (data) {
    return httpErp.get('ctv-salary/apiGetCtvWorkTypes', {'params': data})
  },
  apiGetDataConfig (data) {
    return httpErp.get('ctv-salary/apiGetDataConfig', {'params': data})
  },
  apiGetObjectTypes (data) {
    return httpErp.get('ctv-salary/apiGetObjectTypes', {'params': data})
  },
  apiSaveCtvObject (data) {
    return httpErp.post('ctv-salary/apiSaveCtvObject', data)
  },
  apiGetListObjects (data) {
    return httpErp.get('ctv-salary/apiGetListObjects', {'params': data})
  },
  apiSaveCtvConfig (data) {
    return httpErp.post('ctv-salary/apiSaveCtvConfig', data)
  },
  deleteConfig (data) {
    return httpErp.post('ctv-salary/deleteConfig', data)
  },
  deleteObject (data) {
    return httpErp.post('ctv-salary/deleteObject', data)
  },
  searchUserIdByLocal (data) {
    return httpErp.get('ctv-salary/searchUserIdByLocal', {'params': data})
  },

  // API màn hình config CTVTV phase 2
  apiGetCampaignData (data) {
    return httpErp.get('ctv-salary/apiGetCampaignData', {'params': data})
  },
  apiSaveCtvCampaign (data) {
    return httpErp.post('ctv-salary/apiSaveCtvCampaign', data)
  },
  apiGetCtvConfigs (data) {
    return httpErp.get('ctv-salary/apiGetCtvConfigs', {'params': data})
  },
  apiChangeStatusCampaign (data) {
    return httpErp.post('ctv-salary/apiChangeStatusCampaign', data)
  },
  apiSaveCtvConfigV2 (data) {
    return httpErp.post('ctv-salary/apiSaveCtvConfigV2', data)
  },
  apiChangeStatusConfig (data) {
    return httpErp.post('ctv-salary/apiChangeStatusConfig', data)
  },
  apiSearchUserCtv (data) {
    return httpErp.get('ctv-salary/apiSearchUserCtv', {'params': data})
  },
  apiGetListUsersByUsernames (data) {
    return httpErp.get('ctv-salary/apiGetListUsersByUsernames', {'params': data})
  },
  apiGetCampaignDataV2 (data) {
    return httpErp.get('ctv-salary/apiGetCampaignDataV2', {'params': data})
  },
  apiGetCtvConfigsV2 (data) {
    return httpErp.get('ctv-salary/apiGetCtvConfigsV2', {'params': data})
  }
}
