import http from 'infrastructures/api-http'

export default {
  getDeadlineOpts: () => http.get('/AdMasterProfile/getDeadlineOpts'),
  addDocumentType: data => http.post('/AdMasterProfile/addDocumentType', data),
  getDocumentTypes: param => http.get('/AdMasterProfile/getDocumentTypes', {'params': param}),
  deleteDocumentType: data => http.post('/AdMasterProfile/deleteDocumentType', data),
  updateDocumentType: data => http.post('/AdMasterProfile/updateDocumentType', data),
  addPositionDocumentConfig: data => http.post('/AdMasterProfile/addPositionDocumentConfig', data),
  removePositionDocumentConfig: data => http.post('/AdMasterProfile/removePositionDocumentConfig', data),
  updatePositionDocumentConfig: data => http.post('/AdMasterProfile/updatePositionDocumentConfig', data),
  getPositionDocumentConfig: param => http.get('/AdMasterProfile/getPositionDocumentConfig', {'params': param}),
  createDocument: data => http.post('/AdMasterProfile/createDocument', data),
  approveDocument: data => http.post('/AdMasterProfile/approveDocument', data),
  getDocuments: param => http.get('/AdMasterProfile/getDocumentUploads', {'params': param}),
  getDocumentAnalytic: param => http.get('/AdMasterProfile/getDocumentAnalytic', {'params': param}),
  removeDocument: data => http.post('/AdMasterProfile/removeDocument', data),
  getDocumentDataFromMPId: param => http.get('/AdMasterProfile/getDocumentDataFromMPId', {'params': param}),
  getAnalyticList: param => http.get('/AdMasterProfile/getAnalyticList', { 'params': param }),
  uploadFileTaxCode: data => http.post('/AdMasterProfile/uploadFileTaxCode', data),
  uploadFileAccountNumber: data => http.post('/AdMasterProfile/uploadFileAccountNumber', data),
  checkStatusJob: param => http.get('/AdMasterProfile/checkStatusJob', {'params': param}),
  createNote: data => http.post('/AdProfiles/createNote', data),
  handoverStaff: data => http.post('/AdMasterProfile/handoverStaff', data),
  sendChat: data => http.post('/AdMasterProfile/sendChatAboutDocument', data),
  getPhoneNumber: param => http.get('/AdMasterProfile/getPhoneNumber', {'params': param})
}
