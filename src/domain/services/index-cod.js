// import httpRp from 'infrastructures/api-report-http'
// import http from 'infrastructures/api-http'
import httpErp from 'infrastructures/api-erp-http'
export default {
  getListCartByProvince (data) {
    return httpErp.get('config-cod-index/getListCartByProvinceStation', {'params': data})
  },
  createConfig (data) {
    return httpErp.post('config-cod-index/createConfig', data)
  },
  getConfig (data) {
    return httpErp.get('config-cod-index/getConfig', {'params': data})
  },
  deleteConfig (data) {
    return httpErp.get('config-cod-index/deleteConfig', {'params': data})
  }
}
