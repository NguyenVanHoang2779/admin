import httpErp from 'infrastructures/api-erp-http'

export default {
  getListTemplates (data) {
    return httpErp.get('ErpTemplate/getListTemplates', {'params': data})
  },

  getListVariable (data) {
    return httpErp.get('ErpTemplate/getListVariable', {'params': data})
  },

  deleteVariable (data) {
    return httpErp.delete('ErpTemplate/deleteVariable', {'params': data})
  },

  getVariableById (data) {
    return httpErp.get('ErpTemplate/getVariableById', {'params': data})
  },

  updateVariable (data) {
    return httpErp.post('ErpTemplate/updateVariable', data)
  },

  addVariable (data) {
    return httpErp.post('ErpTemplate/addVariable', data)
  }
}
