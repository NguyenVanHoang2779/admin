import http from 'infrastructures/api-erp-http'

export default {
  apiGetDriverConfigValue (data) {
    return http.get('/erpDriverConfigValue/apiGetListConfig', {'params': data})
  },
  apiCreateConfigBoPhat (data) {
    return http.post('/erpDriverConfigValue/apiCreateUpdateConfig', data)
  },
  apiDeleteConfigBoPhat (data) {
    return http.post('/erpDriverConfigValue/apiDeleteConfig', data)
  }
}
