import httpErp from 'infrastructures/api-erp-http'

export default {
  updateFunction (data) {
    return httpErp.post('ErpFunctionPermission/updateFunction', data)
  },

  updateFunctionGroup (data) {
    return httpErp.post('ErpFunctionPermission/updateFunctionGroup', data)
  },

  updatePermission (data) {
    return httpErp.post('ErpFunctionPermission/updatePermission', data)
  },

  getListGroupFunction (data) {
    return httpErp.get('ErpFunctionPermission/getListGroupFunction', {params: data})
  },

  getListFunction (data) {
    return httpErp.post('ErpFunctionPermission/getListFunction', data)
  },

  getPermission (data) {
    return httpErp.get('ErpFunctionPermission/getPermission', {params: data})
  },

  getFunctionById (data) {
    return httpErp.get('ErpFunctionPermission/getFunctionById', {params: data})
  }
}
