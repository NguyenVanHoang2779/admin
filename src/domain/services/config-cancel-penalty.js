import httpErp from '../../infrastructures/api-erp-http'

export default {
  apiGetListFormula (data) {
    return httpErp.get('/cancelPenalties/getListFormula', {'params': data})
  },
  apiGetListPenalties (data) {
    return httpErp.get('/cancelPenalties/getListPenalties', {'params': data})
  },
  apiSaveCancelPenalties (data) {
    return httpErp.post('/cancelPenalties/insertCancelPenalty', data)
  },
  apiGetConfig (data) {
    return httpErp.get('/cancelPenalties/getConfig', {'params': data})
  },
  apiUpdateConfig (data) {
    return httpErp.post('/cancelPenalties/updateConfig', data)
  },
  apiImportExcel (data) {
    return httpErp.post('/cancelPenalties/apiImportExcel', data)
  },
  apiExportTemplateExcel (data) {
    return httpErp.get('/cancelPenalties/exportTemplateExcel', {'params': data})
  },
  apiGetTypePenalties () {
    return httpErp.get('/cancelPenalties/getTypePenalties', {})
  },
  exportTemplateExcel () {
    return httpErp.get('/cancelPenalties/exportTemplateExcel', {})
  },
  // màn config salary
  apiGetTypeConfigSalary () {
    return httpErp.get('/cancelPenalties/getTypeConfigSalary', {})
  },
  apiGetListConfigSalary (data) {
    return httpErp.get('/cancelPenalties/getListConfigSalary', {'params': data})
  }
}
