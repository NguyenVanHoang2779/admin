import http from 'infrastructures/api-http'

export default {
  getReports: params => http.get('/AdHr/getEkycReports', { 'params': params }),
  approveEkycReport: data => http.post('/AdHr/approveEkycReport', data),
  confirmIdentifyData: data => http.post('/AdProfiles/confirmIdentifyData', data),
  rejectEkycData: data => http.post('/AdProfiles/rejectEkycData', data),
  getEkycImages: params => http.get('/AdProfiles/getEkycImages', { 'params': params }),
  getConfirmedEkycData: params => http.post('/AdProfiles/getConfirmedEkycData', params)
}
