import http from 'infrastructures/api-http'
import httpErpNew from 'infrastructures/api-erp-new'
import httpHrmUni from 'infrastructures/api-hrm-uni'

export default {
  getCandidateList (data) {
    return http.get('/manage-candidates/getCandidates', {'params': data})
  },
  getCandidateListV2 (data) {
    return http.get('/manage-candidates/getCandidateV2s', {'params': data})
  },
  getCountCandidateV2s (data) {
    return http.get('/manage-candidates/getCountCandidateV2s', {'params': data})
  },
  apiGetListCandidates (data) {
    return http.get('/manage-candidates/apiGetListCandidates', {'params': data})
  },
  getJobList (data) {
    return http.get('manage-candidates/jobs')
  },
  getReffererList (data) {
    return http.get('manage-candidates/referrers')
  },
  getCandidateInfo (data) { // lấy thông tin candidate theo id
    return http.get('manage-candidates/getCandidateById', {'params': data})
  },
  checkCandidateExist (data) { // Kiểm tra ứng viên đã tồn tại chưa
    return http.get('manage-candidates/checkCandidateExist', {'params': data})
  },
  seachCandidate (data) {
    return http.get('manage-candidates/seachCandidate', {'params': data})
  },
  getProcessorList (data) {
    return http.get('manage-candidates/processors')
  },

  // Màn ứng viên cũ
  updateStatus (data) {
    return http.put('manage-candidates/changeStatus', data)
  },

  // Màn tuyển dụng mới
  updateStatusCandidate (data) {
    return http.put('manage-candidates/updateStatusCandidate', data)
  },
  addComment (data) {
    return http.post('manage-candidates/comment', data)
  },
  addProcessor (data) {
    return http.post('manage-candidates/addProcessor', data)
  },
  removeProcessor (data) {
    return http.delete('manage-candidates/removeProcessor', {'params': data})
  },
  getCurrUser (data) {
    return http.get('manage-candidates/getInfoCurrentUser', data)
  },
  updateCandidate (data) {
    return http.post('manage-candidates/updateCandidate', data)
  },
  createCandidate (data) {
    return http.post('manage-candidates/createCandidate', data)
  },
  linkToMasterProfile (data) {
    return http.put('manage-candidates/linkToMasterProfile', data)
  },
  existedMasterProfile (data) {
    return http.get('manage-candidates/existedMasterProfile', {'params': data})
  },
  updateAppointmentDate (data) {
    return http.post('manage-candidates/updateAppointmentDate', data)
  },
  exportCandidateList (data) {
    return http.post('manage-candidates/exportCandidates', data)
  },
  importCandidateList (data) {
    return http.post('manage-candidates/importCandidates', data)
  },
  checkCanExport () {
    return http.get('manage-candidates/canExportCandidates')
  },
  updateReferrer (data) {
    return http.put('manage-candidates/updateReferrer', data)
  },
  exportCvCandidate (data) {
    return http.get('manage-candidates/exportCvCandidate', {params: data})
  },
  getListTagByHr (data) {
    return http.get('AdCandidates/getListTagByHr', {params: data})
  },
  addTagByHr (data) {
    return http.post('AdCandidates/addTagByHr', data)
  },
  deleteTagByHr (data) {
    return http.post('AdCandidates/deleteTagByHr', data)
  },
  cancelAttachTag (data) {
    return http.post('AdCandidates/cancelAttachTag', data)
  },
  attachTagCandidate (data) {
    return http.post('AdCandidates/attachTagCandidate', data)
  },
  evaluateCandidate (data) {
    return http.post('AdCandidates/evaluateCandidate', data)
  },
  getDataEvaluationById (data) {
    return http.get('manage-candidates/getDataEvaluationById', {'params': data})
  },
  sendSmsToCandidate (data) {
    return http.post('manage-candidates/sendSmsToCandidate', data)
  },
  getFileCandidate (data) {
    return http.get('manage-candidates/getFileCandidate', { params: data })
  },
  getTagsOfCandidate (data) {
    return http.post('manage-candidates/getTagsOfCandidate', data)
  },
  sendSmsAccToEmployee (data) {
    return http.post('manage-candidates/sendSmsAccToEmployee', data)
  },
  quickCreateCandidate: data => http.post('AdCandidates/quickCreateCandidate', data),
  countCandidateByStatus: data => http.get('AdCandidates/countCandidateByStatus', { params: data }),
  countCandidateByTag: data => http.get('AdCandidates/countCandidateByTag', { params: data }),
  getJobOrCandidate: data => http.get('AdCandidates/getJobOrCandidate', { params: data }),

  updateStatusJob (data) {
    return http.post('manage-candidates/updateStatusJob', data)
  },

  reviewCandidate (data) {
    return http.post('manage-candidates/reviewCandidate', data)
  },

  getCandidateReview (data) {
    return http.get('manage-candidates/get-candidate-review', {'params': data})
  },

  getLogs (data) {
    return httpErpNew.get('/candidate/get-log-mp', {params: data})
  },

  getLatestLog (data) {
    return httpErpNew.get('/candidate/get-latest-log-mp', {params: data})
  },

  addNote (data) {
    return httpHrmUni.post('/recruitment/candidate/add-comment', data)
  }
}
