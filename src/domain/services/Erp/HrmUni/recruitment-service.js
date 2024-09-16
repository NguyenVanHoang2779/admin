import httpHrmUni from 'infrastructures/api-hrm-uni'

export default {
  getCandidates (data) {
    return httpHrmUni.get('/recruitment/candidates', {'params': data})
  },

  countCandidatesByStatus (data) {
    return httpHrmUni.get('/recruitment/candidates/count-by-status', {'params': data})
  },

  async rejectCandidate (data, id) {
    return httpHrmUni.post(`/recruitment/candidates/${id}/reject`, data)
  },

  async noteCandidate (data) {
    return httpHrmUni.post(`/recruitment/candidates/add-note`, data)
  },

  getPhoneCandidate (data) {
    return httpHrmUni.get('/recruitment/candidates/get-phone', {'params': data})
  },

  toChannelChat (data) {
    return httpHrmUni.post('/recruitment/candidates/add-hr-to-channel', data)
  },

  getCandidateReview (data) {
    return httpHrmUni.get('/recruitment/candidate/get-candidate-review', {'params': data})
  },

  reviewCandidate (data) {
    return httpHrmUni.post('/recruitment/candidate/create-candidate-review', data)
  },

  createSchedule (data) {
    return httpHrmUni.post('/recruitment/candidates/schedule/create', data)
  },

  createAccount (data, id) {
    return httpHrmUni.post(`/recruitment/candidates/${id}/approve`, data)
  },

  getTags (data) {
    return httpHrmUni.get(`/recruitment/tags/list`, {'params': data})
  },

  createTag (data) {
    return httpHrmUni.post(`/recruitment/tags/create`, data)
  },

  deleteTag (data) {
    return httpHrmUni.delete(`/recruitment/tags/delete`, {'params': data})
  },

  attachTag (data) {
    return httpHrmUni.post(`/recruitment/tags/attach`, data)
  },

  detachTag (data) {
    return httpHrmUni.delete(`/recruitment/tags/detach`, {'params': data})
  },

  getCandidateInfo (data) {
    return httpHrmUni.get(`/recruitment/candidate/get-candidate-info`, {'params': data})
  },

  updateCandidateInfo (data) {
    return httpHrmUni.post(`/recruitment/candidate/update-candidate-info`, data)
  },

  createCandidate (data) {
    return httpHrmUni.post(`/recruitment/candidate/create-candidate-info`, data)
  },

  getJobs (data) {
    return httpHrmUni.get(`/recruitment/jobs/list`)
  },

  getSchedule (data) {
    return httpHrmUni.get(`/recruitment/candidates/get-schedule`, {'params': data})
  },

  import (data) {
    return httpHrmUni.post(`/recruitment/candidate/create-candidate-with-file-upload`, data)
  },

  getProcessImport (data) {
    return httpHrmUni.get(`/recruitment/candidate/get-process-import-candidate`, {'params': data})
  },

  exportLogCandidateImport (data) {
    return httpHrmUni.get(`/recruitment/candidate/export-log-candidate-import`, {'params': data, responseType: 'blob'})
  },

  getCandidateForCloseShift (data) {
    return httpHrmUni.get('/recruitment/candidates/for-close-shift', {params: data})
  },

  closeShiftExplanation (id, data) {
    return httpHrmUni.post(`/recruitment/candidates/${id}/close-shift-explanation`, data)
  },

  getReferralCandidate (data) {
    return httpHrmUni.get('/recruitment/candidate/get-referral-code-web')
  },

  getCountDocument (data) {
    return httpHrmUni.get('/recruitment/candidates/get-count-document', {params: data})
  },

  getDocument (data) {
    return httpHrmUni.get('/recruitment/candidates/get-document', {params: data})
  },

  realDocument (data) {
    return httpHrmUni.post('/recruitment/candidates/origin-document', data)
  },

  async getAllJob () {
    let cacheKey = 'allRecruitmentJob'
    if (sessionStorage.getItem(cacheKey)) {
      return JSON.parse(sessionStorage.getItem(cacheKey))
    }
    try {
      let response = await this.getJobs()
      if (response.data.success) {
        let jobOptions = response.data.data.map(function (job) {
          return {
            id: job.id,
            name: job.name
          }
        })
        sessionStorage.setItem(cacheKey, JSON.stringify(jobOptions))
        return jobOptions
      }
    } catch (e) {
      console.log(e)
      return []
    }
  }
}
