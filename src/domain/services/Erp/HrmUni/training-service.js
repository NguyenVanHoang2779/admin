
import httpHrmUni from 'infrastructures/api-hrm-uni'

export default {
  // Màn đào tạo mới
  createTrainingSyllabus: data => httpHrmUni.post('/education/api/tp/create', data),

  editSyllabus: data => httpHrmUni.post('/education/api/tp/update', data),

  createTpPeriod: data => httpHrmUni.post('/education/api/tp/periods/create', data),

  editTpPeriod: data => httpHrmUni.put('/education/api/tp/periods/update', data),

  createMasterTrainingSyllabus: data => httpHrmUni.post('/education/api/tp/create-master', data),

  editMasterTrainingSyllabus: data => httpHrmUni.post('/education/api/tp/update-master', data),

  detailTrainingSyllabus: data => httpHrmUni.get('/education/api/tp/detail', {'params': data}),

  getSyllabuses: data => httpHrmUni.get('/education/api/tp/list', {'params': data}),

  getLogSyllabus: data => httpHrmUni.get('/education/api/tp/logs', {'params': data}),

  getLinkFiles: data => httpHrmUni.get('/education/api/tp/lessons/docs/links', {'params': data})
}
