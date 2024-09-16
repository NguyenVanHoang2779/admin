import httpErp from 'infrastructures/api-erp-http'

export default {
  getEvaluationList (data) {
    return httpErp.get('evaluations/list', {'params': data})
  },
  getRecompenseAndVoteOfUser (data) {
    return httpErp.get('evaluations/getRecompenseAndVoteOfUser', {'params': data})
  },
  getEvaluationByUser (data) {
    return httpErp.get('evaluations/getEvaluationByUser', {'params': data})
  },
  getAvgEvaluationOfUserByMonth (data) {
    return httpErp.get('evaluations/getAvgEvaluationOfUserByMonth', {'params': data})
  },
  addEvaluation (data) {
    return httpErp.post('evaluations/add', data)
  },
  getListEvaluationNotes (data) {
    return httpErp.get('evaluations/getListEvaluationNotes', {'params': data})
  },
  addNote (data) {
    return httpErp.post('evaluations/addNote', data)
  },
  changeStatusEvaluationOfStaff (data) {
    return httpErp.post('evaluations/changeStatusEvaluationOfStaff', data)
  },
  changeStatusRecompenseOfStaff (data) {
    return httpErp.post('evaluations/changeStatusRecompenseOfStaff', data)
  },
  uploadReport (data) {
    return httpErp.post('evaluations/uploadReport', data)
  },
  checkIsManagement (data) {
    return httpErp.get('evaluations/checkIsManagement', {'params': data})
  },
  getPermissionEvaluationExpired () {
    return httpErp.get('ErpEvaluation/getPermissionEvaluationExpired')
  },
  exportRecompense (data) {
    return httpErp.get('ErpEvaluation/exportRecompenseList', {'params': data})
  },
  exportEvaluation (data) {
    return httpErp.get('ErpEvaluation/exportEvaluationList', {'params': data})
  },
  addRecompense (data) {
    return httpErp.post('recompenses/add', data)
  },
  getImageMinutes (data) {
    return httpErp.get('ErpEvaluation/getImageMinutes', {'params': data})
  },
  updateImageMinutes (data) {
    return httpErp.post('evaluations/updateImageMinutes', data)
  },
  getListCauseShop (data) {
    return httpErp.get('ErpRecompense/getListCauseShop', {'params': data})
  },
  getListShopVote (data) {
    return httpErp.get('ErpRecompense/getListShopVote', {'params': data})
  },
  updateStatusCodPenalty (data) {
    return httpErp.post('ErpRecompense/updateStatusCodPenalty', data)
  },
  updatePenaltyCard (data) {
    return httpErp.post('ErpRecompense/updatePenaltyCard', data)
  },
  updateUserPenalty (data) {
    return httpErp.post('ErpRecompense/updateUserPenalty', data)
  },
  deleteChannelId (data) {
    return httpErp.post('ErpRecompense/deleteChannelId', data)
  },
  apiGetListCod (data) {
    return httpErp.get('ErpEvaluation/apiGetListCod', {'params': data})
  },
  getReasonShopVote (data) {
    return httpErp.get('ErpRecompense/getReasonShopVote', {'params': data})
  },
  checkJobStatus (data) {
    return httpErp.get('ErpEvaluation/checkJobStatus', {'params': data})
  },
  exportData (data) {
    return httpErp.get('ErpRecompense/exportShopPenalty', {'params': data})
  },
  getPermissionShopVote () {
    return httpErp.get('ErpRecompense/getPermissionShopVote')
  }
}
