import httpErp from 'infrastructures/api-erp-http'
import httpErpNew from 'infrastructures/api-erp-new'

export default {

  getUnionOffers (data) {
    return httpErp.get('ErpUnionOffer/getUnionOffers', {'params': data})
  },

  getUnionOffer (data) {
    return httpErp.get('ErpUnionOffer/getUnionOffer', {'params': data})
  },

  addUnionOffer (data) {
    return httpErp.post('ErpUnionOffer/addUnionOffer', data)
  },

  getUnionsByMasterProfileId (data) {
    return httpErp.get('ErpUnionOffer/getUnionsByMasterProfileId', {'params': data})
  },

  getUserCreate () {
    return httpErp.get('ErpUnionOffer/getUserCreate')
  },

  getUnionTypes () {
    return httpErp.get('ErpUnionOffer/getUnionTypes')
  },

  validUserUnion (data) {
    return httpErpNew.get('/master-profile/info', {'params': data})
  },

  deleteUnionOffer (data) {
    return httpErp.post('ErpUnionOffer/removeUnionOffer', data)
  },

  getAllProvince () {
    return httpErp.get('ErpUnionOffer/getAllProvince')
  },

  checkCanUpdateStatus (data) {
    return httpErp.get('ErpUnionOffer/checkCanUpdateStatus', {'params': data})
  },

  getUnionsForQuickUpdate (data) {
    return httpErp.get('ErpUnionOffer/getUnionsForQuickUpdate', {'params': data})
  },

  updateUnionStatus (data) {
    return httpErp.post('ErpUnionOffer/updateUnionStatus', data)
  },

  quickUpdate (data) {
    return httpErp.post('ErpUnionOffer/quickUpdate', data)
  },

  getUnionDocuments (data) {
    return httpErp.get('ErpUnionOffer/getUnionDocuments', {'params': data})
  },

  getListDistrictByProvinceCode (data) {
    return httpErp.get('ErpDependentPerson/getListDistrictByProvinceCode', {'params': data})
  },

  getListCommuneByDistrictCode (data) {
    return httpErp.get('ErpDependentPerson/getListCommuneByDistrictCode', {'params': data})
  }
}
