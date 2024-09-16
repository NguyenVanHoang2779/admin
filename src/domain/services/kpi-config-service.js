import httpErp from 'infrastructures/api-erp-http'

export default {
  getKpiConfig (data) {
    return httpErp.get('ErpKpiConfig/getKpiConfig', { params: data })
  },

  updateKpiConfig (data) {
    return httpErp.post('ErpKpiConfig/updateKpiConfig', data)
  },

  deleteKpiConfig (data) {
    return httpErp.delete('ErpKpiConfig/deleteKpiConfig', { params: data })
  }
}
