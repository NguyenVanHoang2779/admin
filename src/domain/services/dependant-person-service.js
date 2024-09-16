import httpErp from 'infrastructures/api-erp-http'
import httpErpNew from 'infrastructures/api-erp-new'

export default {
  getAllProvince () {
    return httpErpNew.get('ErpDependentPerson/getAllProvince')
  },

  getListDistrictByProvinceCode (data) {
    return httpErpNew.get('ErpDependentPerson/getListDistrictByProvinceCode', {'params': data})
  },

  getListCommuneByDistrictCode (data) {
    return httpErpNew.get('ErpDependentPerson/getListCommuneByDistrictCode', {'params': data})
  },

  getDependantById (data) {
    return httpErpNew.get('ErpDependentPerson/getDependantById', {'params': data})
  },

  getFileByDependantId (data) {
    return httpErpNew.get('ErpDependentPerson/getFileByDependantId', {'params': data})
  },

  checkUserByStaffCode (data) {
    return httpErpNew.get('ErpDependentPerson/checkUserByStaffCode', {'params': data})
  },

  checkDependantByMst (data) {
    return httpErp.get('ErpDependentPerson/checkDependantByMst', {'params': data})
  },

  checkDependantByCMND (data) {
    return httpErp.get('ErpDependentPerson/checkDependantByCMND', {'params': data})
  },

  dependantPersonCheckOld (data) {
    return httpErp.get('ErpDependentPerson/dependentPersonCheck', {'params': data})
  },

  dependantPersonCheck (data) {
    return httpErpNew.get('ErpDependentPerson/dependentPersonCheck', {'params': data})
  },

  addDependantPerson (data) {
    return httpErpNew.post('ErpDependentPerson/addDependentPerson', data)
  },

  updateFileDependant (data) {
    return httpErpNew.post('ErpDependentPerson/updateFileDependant', data)
  },

  getDependantOfProfile (data) {
    return httpErpNew.get('ErpDependentPerson/getDependantOfProfile', {'params': data})
  },

  updateRegisterStatusDependant (data) {
    return httpErpNew.put('ErpDependentPerson/updateRegisterStatusDependant', data)
  },

  downloadDKNPT () {
    return httpErp.get('ErpDependentPerson/download20DKNPT')
  },

  downloadXNNPTTNCN () {
    return httpErp.get('ErpDependentPerson/download09XNNPTTNCN')
  },

  countUserHasDependant () {
    return httpErp.get('ErpDependentPerson/countUserHasDependant')
  },

  deleteDependant (data) {
    return httpErpNew.post('ErpDependentPerson/disableDependant', data)
  },

  getHistoryDependant (data) {
    return httpErpNew.get('ErpDependentPerson/getHistoryDependant', {'params': data})
  },

  exportDependant (data) {
    return httpErp.get('ErpDependentPerson/exportDependant', {'params': data})
  },

  checkCanUpdateRegisterStatus (data) {
    return httpErpNew.get('ErpDependentPerson/checkCanUpdateRegisterStatus', {'params': data})
  },

  getDependantForQuickUpdate (data) {
    return httpErpNew.get('ErpDependentPerson/getDependantForQuickUpdate', {'params': data})
  },

  checkDependantByName (data) {
    return httpErpNew.get('ErpDependentPerson/checkDependantByName', {'params': data})
  },

  updateNote (data) {
    return httpErpNew.put('ErpDependentPerson/updateNote', data)
  }
}
