import httpErp from 'infrastructures/api-erp-http'

export default {
  // bắt đầu màn config gói tiền
  getListRemunerationPackage () {
    return httpErp.get('ErpCollaborator/getListRemunerationPackage')
  },
  getTypeStaff (data) {
    return httpErp.get('ErpCollaborator/getTypeStaff', {'params': data})
  },
  getCalcuMethod (data) {
    return httpErp.get('ErpCollaborator/getCalcuMethod', {'params': data})
  },
  getAllowanceWorkday (data) {
    return httpErp.get('ErpCollaborator/getAllowanceWorkday', {'params': data})
  },
  getRemunerationPackage (data) {
    return httpErp.get('ErpCollaborator/getRemunerationPackage', {'params': data})
  },
  addRemunerationPackage (data) {
    return httpErp.post('/ErpCollaborator/addRemunerationPackage', data)
  },
  editRemunerationPackage (data) {
    return httpErp.post('/ErpCollaborator/editRemunerationPackage', data)
  },
  removeRemunerationPackage (data) {
    return httpErp.post('/ErpCollaborator/removeRemunerationPackage', data)
  },
  // kết thúc màn config gói tiền

  // bắt đầu màn cofig campaign
  getListSelectRemunerationPackage () {
    return httpErp.get('ErpCollaborator/getListSelectRemunerationPackage')
  },
  getAdditionalPackage () {
    return httpErp.get('ErpCollaborator/getAdditionalPackage')
  },
  getListCampaign () {
    return httpErp.get('ErpCollaborator/getListCampaign')
  },
  getCampaign (data) {
    return httpErp.get('ErpCollaborator/getCampaign', {'params': data})
  },
  createCampaign (data) {
    return httpErp.post('ErpCollaborator/createCampaign', data)
  },
  updateCampaign (data) {
    return httpErp.post('ErpCollaborator/updateCampaign', data)
  },
  removeCampaign (data) {
    return httpErp.post('ErpCollaborator/removeCampaign', data)
  },
  getConfigCampaign (data) {
    return httpErp.get('ErpCollaborator/getConfigCampaign', {'params': data})
  },
  createConfigCampaign (data) {
    return httpErp.post('ErpCollaborator/createConfigCampaign', data)
  },
  updateConfigCampaign (data) {
    return httpErp.post('ErpCollaborator/updateConfigCampaign', data)
  },
  // kết thúc màn cofig campaign
  // lấy modul và lấy cart
  getAllModuleByStationId (data) {
    return httpErp.get('ErpCollaborator/getAllModuleByStationId', {'params': data})
  },
  getAllCartByModuleIds (data) {
    return httpErp.get('ErpCollaborator/getAllCartByModuleIds', {'params': data})
  }
}
