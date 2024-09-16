import http from 'infrastructures/api-http'
import httpErp from 'infrastructures/api-erp-http'

export default {
  getUserList (data) {
    return http.get('AdProfiles/getUserList', {'params': data})
  },

  getPositionList () {
    return http.get('AdProfiles/getPositionList')
  },

  getDepartmentList () {
    return http.get('AdProfiles/getDepartmentList')
  },

  getPositionListByDepartment (data) {
    return http.get('AdProfiles/getPositionListByDepartment', {'params': data})
  },

  getAllPositionByDepartmentIds (data) {
    return http.get('/AdProfiles/getAllPositionByDepartmentIds', {'params': data})
  },

  getDutiesList () {
    return http.get('AdProfiles/getDutiesList')
  },

  suggestDutyByPosition (positionId) {
    let data = {position_id: positionId}
    return http.get('AdProfiles/suggestDutyByPosition', {'params': data})
  },

  updateMainProfile (data) {
    return http.post('AdProfiles/updateMainProfile', data)
  },

  deleteProfile (id) {
    return http.post('AdMasterProfile/deleteProfile', {master_id: id})
  },

  getMasterProfileList (data) {
    return http.get('AdProfiles/getMasterProfileList', {'params': data})
  },

  getUsersByMasterProfileId (data) {
    return http.get('AdProfiles/getUsersByMasterProfileId', {'params': data})
  },

  searchProfile (data) {
    return http.get('AdProfiles/searchProfile', {'params': data})
  },

  confirmProfile (data) {
    return http.post('/AdMasterProfile/confirmProfile', data)
  },

  addExistUserIntoMasterProfile (data) {
    return http.post('/AdMasterProfile/addExistUser', data)
  },

  updateDocuments (data) {
    return http.post('AdMasterProfile/updateDocuments', data)
  },

  getLogs (data) {
    return http.get('AdMasterProfile/getLogs', {'params': data})
  },

  resign (data) {
    return http.post('AdMasterProfile/resign', data)
  },

  updateDocumentFiles (data) {
    return http.post('AdMasterProfile/updateDocumentFiles', data)
  },

  getDocumentFile (data) {
    return http.get('AdMasterProfile/getDocumentFile', {'params': data})
  },

  existedFieldValue (data) {
    return http.get('AdMasterProfile/existedFieldValue', {'params': data})
  },

  exportMasterProfile (data) {
    return http.get('AdProfiles/exportMasterProfileList', {'params': data})
  },
  exportMasterProfileImage (data) {
    return http.get('AdProfiles/exportMasterProfileImage', {'params': data})
  },
  exportRank (data) {
    return http.get('AdProfiles/exportRank', {'params': data})
  },

  getPermissionExportMasterProfile () {
    return http.get('AdProfiles/getPermissionExportMasterProfile')
  },

  getTitlesToExportMasterProfile () {
    return http.get('AdProfiles/getTitlesToExportMasterProfile')
  },

  checkJobStatus (data) {
    return http.get('AdProfiles/checkJobStatus', {'params': data})
  },

  checkJobImportStatus (data) {
    return http.get('AdProfiles/checkJobImportStatus', {'params': data})
  },

  cancelResign (data) {
    return http.post('AdMasterProfile/cancelResign', data)
  },

  uploadImage (data) {
    return http.post('AdProfiles/uploadImage', data)
  },

  transferImageProfileFromGallery (data) {
    return http.post('AdProfiles/transferImageProfileFromGallery', data)
  },

  getGalleryProfile (data) {
    return http.get('AdProfiles/getGalleryProfile', {'params': data})
  },

  getGroupList (data) {
    return http.get('AdProfiles/getGroupList', {'params': data})
  },

  exportAtmTemplate (data) {
    return http.get('AdProfiles/exportAtmTemplate', {'params': data})
  },

  getListStaff (data) {
    return httpErp.get('ErpUsers/getListStaff', {'params': data})
  },

  controlUserApp (data) {
    return httpErp.post('ErpUsers/controlUserApp', data)
  },

  getPhoneNumberByUserId (params) {
    return httpErp.get('ErpUsers/getPhoneNumberByUserId', {'params': params})
  },

  addTemplate (data) {
    return httpErp.post('ErpTemplate/addTemplate', data)
  },

  deleteTemplate (data) {
    return httpErp.post('ErpTemplate/deleteTemplate', data)
  },

  changeStatusTemplate (data) {
    return httpErp.post('ErpTemplate/changeStatusTemplate', data)
  },

  downloadFile (data) {
    return httpErp.post('ErpTemplate/downloadFile', data)
  },

  getListKey () {
    return httpErp.get('ErpAccessToken/getListKey')
  },

  updateKey (data) {
    return httpErp.post('ErpAccessToken/updateKey', data)
  },

  addKey (data) {
    return httpErp.post('ErpAccessToken/addKey', data)
  },

  deleteKey (data) {
    return httpErp.post('ErpAccessToken/deleteKey', data)
  },

  checkPermissionManage () {
    return httpErp.get('ErpTemplate/checkPermissionManage')
  },

  verifiedProfile (data) {
    return http.post('AdMasterProfile/verifiedProfile', data)
  },

  quickCreateUser (data) {
    return http.post('AdMasterProfile/addProfileAndUserByDistribute', data)
  },

  getOriginImage: (data) => http.post('AdMasterProfile/getRealIdentifyImage', data),

  getListMemberCoporations () {
    return http.get('AdMasterProfile/getListMemberCorporations')
  },

  getListUserSwapDxteam (data) {
    return http.get('AdProfiles/getListUserSwapDxteam', {params: data})
  },

  swapUserDxteam (data) {
    return http.post('AdProfiles/swapUserDxteam', data)
  },

  getConfigPlanDteam () {
    return http.post('AdProfiles/getConfigPlanDteam')
  },

  saveConfigPlanDteam (data) {
    return http.post('AdProfiles/saveConfigPlanDteam', data)
  },

  getProfileForPrint (data) {
    return http.get('AdMasterProfile/getProfileForPrint', {params: data})
  },

  updateFullname (data) {
    return http.post('/users/updateFullname', data)
  },

  getCommitProfiles (data) {
    return http.get('/AdProfiles/getCommitProfiles', {params: data})
  },

  createDraftCommit (data) {
    return http.post('/AdProfiles/createDraftCommit', data)
  },

  exportContract (data) {
    return http.get('AdProfiles/exportContractList', {'params': data})
  },

  saveConfigForceWallet (data) {
    return http.post('AdMasterProfile/saveConfigForceWallet', data)
  },

  getEkycInfo (data) {
    return http.get('AdProfiles/getEkycInfo', {'params': data})
  },

  reportWrongEkycData (data) {
    return http.post('AdProfiles/reportWrongEkycData', data)
  },
  apiGetClearFile: param => http.get('/AdMasterProfile/apiGetClearFile', {'params': param}),

  getDataCheckCreateCommitDraft (data) {
    return http.get('/AdProfiles/getDataCheckCreateCommitDraft', {params: data})
  }

}
