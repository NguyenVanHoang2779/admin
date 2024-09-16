import http from 'infrastructures/api-http'

export default {
  createJob: data => http.post('/AdDriverx/createJob', data),
  getJobs: params => http.get('/AdDriverx/getJobs', { 'params': params }),
  getJobCandidates: params => http.get('/AdDriverx/getJobCandidates', { 'params': params }),
  updateStatus: data => http.post('/AdDriverx/updateStatus', data),
  getDocumentTypes: data => http.post('/AdDriverx/getDocumentTypes', data),
  getJob: params => http.get('/AdDriverx/getJob', { 'params': params }),
  updateJob: data => http.post('/AdDriverx/updateJob', data),
  deleteJob: data => http.post('/AdDriverx/deleteJob', data),
  updateAppointment: data => http.post('/AdDriverx/updateAppointment', data),
  createTest: data => http.post('/AdDriverx/createTest', data),
  getTests: params => http.get('/AdDriverx/getTests', { 'params': params }),
  deleteTest: data => http.post('/AdDriverx/deleteTest', data),
  getTest: params => http.get('/AdDriverx/getTest', { 'params': params }),
  createPage: data => http.post('/AdDriverx/createPage', data),
  createQuestion: data => http.post('/AdDriverx/createQuestion', data),
  deletePage: data => http.post('/AdDriverx/deletePage', data),
  deleteQuestion: data => http.post('/AdDriverx/deleteQuestion', data),
  editPage: data => http.post('/AdDriverx/editPage', data),
  editQuestion: data => http.post('/AdDriverx/editQuestion', data),
  reActiveJob: data => http.post('/AdDriverx/reActiveJob', data)
}
