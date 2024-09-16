import http from 'infrastructures/api-erp-http'

export default {
  apiConfig (data) {
    return http.post('ErpKpi/apiConfigObjects', data)
  },

  deleteConfig (data) {
    return http.get('ErpKpi/apiDeleteConfigObjects', {'params': data})
  },

  getListConfig (data) {
    return http.get('ErpKpi/getListConfigRole', {'params': data})
  },

  getListAliasAndObjectType () {
    return http.get('ErpKpi/getListAliasAndObject')
  }
}
