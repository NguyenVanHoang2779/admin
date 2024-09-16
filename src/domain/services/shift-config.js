import httpErp from 'infrastructures/api-erp-http'

export default {
  getShiftConfig (data) {
    return httpErp.get('/ErpKpiShift/getDataShift', {'params': data})
  },
  getListShiftConfig () {
    return httpErp.get('/ErpKpiShift/getListShiftConfig')
  },
  updateShiftConfig (data) {
    return httpErp.post('/ErpKpiShift/updateShiftConfig', data)
  },
  apiGetListUsers (data) {
    return httpErp.get('/salaryCods/searchCod', {'params': data})
  }
}
