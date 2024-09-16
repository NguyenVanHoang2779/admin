import http from 'infrastructures/api-http'
import httpErp from 'infrastructures/api-erp-http'
import httpErpNew from 'infrastructures/api-erp-new'
import httpHrmUni from 'infrastructures/api-hrm-uni'

export default {
  createTrainingTest: data => http.post('/AdTraining/createTrainingTest', data),

  getTrainingTests: params => http.get('/AdTraining/getTrainingTests', { 'params': params }),

  deleteTrainingTest: data => http.post('/AdTraining/deleteTrainingTest', data),

  getTrainingTest: params => http.get('/AdTraining/getTrainingTest', { 'params': params }),

  createTrainingPage: data => http.post('/AdTraining/createTrainingPage', data),

  deleteTrainingPage: data => http.post('/AdTraining/deleteTrainingPage', data),

  editTrainingPage: data => http.post('/AdTraining/editTrainingPage', data),

  editTrainingQuestion: data => http.post('/AdTraining/editTrainingQuestion', data),

  createTrainingQuestion: data => http.post('/AdTraining/createTrainingQuestion', data),

  deleteTrainingQuestion: data => http.post('/AdTraining/deleteTrainingQuestion', data),

  getTrainingTestInfo: data => http.post('/AdTraining/getTrainingTestInfo', data),

  updateTrainingTest: data => http.post('/AdTraining/updateTrainingTest', data),

  getCategories: () => http.post('/AdTraining/getCategories'),

  // Màn đào tạo mới
  createTrainingSyllabus: data => httpErp.post('ErpTrainingSyllabus/createTrainingSyllabus', data),

  getListSubSyllabus: params => httpHrmUni.get('erp/ErpTrainingSyllabus/getListSubSyllabus', { 'params': params }),

  getAllSyllabus: params => httpHrmUni.get('erp/ErpTrainingSyllabus/getAllSyllabus', { 'params': params }),

  getAllTest: params => httpErp.get('/ErpTrainingSyllabus/getAllTest', { 'params': params }),

  getPeriodTestResult: params => httpErp.get('/ErpTpClass/getPeriodTestResult', { 'params': params }),

  getSyllabuses: params => httpErp.get('/ErpTrainingSyllabus/getSyllabuses', { 'params': params }),

  getSyllabusesCreateClass: params => httpHrmUni.get('erp/ErpTrainingSyllabus/getSyllabusesCreateClass', { 'params': params }),

  editSyllabus: data => httpErp.post('/ErpTrainingSyllabus/editSyllabus', data),

  generateTestPdf: data => httpErp.post('/ErpTrainingSyllabus/generateTestPdf', data),

  getClasses: params => httpErp.get('/ErpTpClass/getClasses', { 'params': params }),

  getTrainingProgram: params => httpHrmUni.get('erp/ErpTrainingSyllabus/getTrainingProgram', { 'params': params }),

  addClass: data => httpErp.post('/ErpTpClass/addClass', data),

  updateClass: data => httpErp.post('/ErpTpClass/updateClass', data),

  confirmClass: data => httpErp.post('/ErpTpClass/confirmClass', data),

  createClass: data => httpErpNew.post('/class/create', data),

  cancelClass: data => httpErpNew.post('/class/cancel', data),

  deleteStudent: data => httpErpNew.delete('/class/delete-student', {params: data}),

  rollUpListStudent: data => httpErp.post('/ErpTpClass/rollUpListStudent', data),

  rollUpStudent: data => httpErp.post('/ErpTpClass/rollUpStudent', data),

  cancelRollupStudent: data => httpErp.post('/ErpTpClass/cancelRollupStudent', data),

  addClassNote: data => httpErp.post('/ErpTpClass/addClassNote', data),

  addAcademyNote: data => httpErp.post('/ErpTpClass/addAcademyNote', data),

  completePeriod: data => httpErp.post('/ErpTpClass/completePeriod', data),

  getSendTestInfo: params => httpErp.get('/ErpTpClass/getSendTestInfo', { 'params': params }),

  getListStudentNoClass: params => httpErp.get('/ErpTpClass/getListStudentNoClass', { 'params': params }),

  canAddStudentToClass: params => httpErp.get('/ErpTpClass/canAddStudentToClass', { params }),

  canAddLecturerToClass: params => httpErp.get('/ErpTpClass/canAddLecturerToClass', { params }),

  addStudentToClass: data => httpErp.post('/ErpTpClass/addStudentToClass', data),

  getListStudentNoEnoughClass: params => httpErp.get('/ErpTpClass/getListStudentNoEnoughClass', { 'params': params }),

  sendMessageRollup: data => httpErp.post('/ErpTpClass/sendMessageRollup', data),

  confirmChooseClass: data => httpErp.post('/ErpTpClass/confirmChooseClass', data),

  senMessageTest: data => httpErp.post('/ErpTpClass/senMessageTest', data),

  apiGetListClass (data) {
    return httpHrmUni.get('/erp/ErpTpClass/apiGetListClass', {'params': data})
  },

  getListClass (data) {
    return httpErp.get('ErpTpClass/getListClass')
  },

  getStudentOfTrainingProgram (data) {
    return httpErp.get('ErpTpClass/getStudentOfTrainingProgram', {'params': data})
  },

  getStudentByClassId (data) {
    return httpErp.get('ErpTpClass/getStudentByClassId', {'params': data})
  },

  getClassListWaitingConfirm (params) {
    return httpHrmUni.get('/erp/ErpTpClass/getClassListWaitingConfirm', {'params': params})
  },

  getStatisticClass: params => httpHrmUni.get('/erp/ErpTpClass/getStatisticClass', {params: params}),

  getClassByUserId: data => httpHrmUni.get('/erp/ErpTpClass/getClassByUserId', {params: data}),

  reviewStudentAtEndCourse (data) {
    return httpErp.post('/ErpTpClass/reviewStudentAtEndCourse', data)
  },

  // màn câu hỏi mới
  getQuestions: params => httpErp.get('/ErpTrainingQuestions/getQuestions', { 'params': params }),

  getTrainingCategories: params => httpErp.get('/ErpTrainingQuestions/getCategories', { 'params': params }),

  // màn tân binh
  // Lấy list tân binh
  getListRookie: params => httpErp.get('/ErpNewStaff/getDataNewStaff', { 'params': params }),
  // Lấy các chỉ số thống kê
  getStatisticRookie: data => httpErp.get('/ErpNewStaff/getCountNewStaff', {params: data}),
  // Lấy thông tin log vận hành
  getListLogOperate: data => httpErp.get('/ErpNewStaff/getLogDetail', {params: data}),
  // Lấy thông tin log đào tạo tân binh
  getListLogRookie: data => httpErp.get('/ErpTpClass/getLogsOfStudentsInClasses', {params: data}),

  // Lấy danh sách lý do chốt ca đào tạo
  getListExplanationReason: data => httpHrmUni.get('/erp/ErpTrainingSyllabus/getListExplanationReason', {params: data}),
  // Lấy dữ liệu chốt ca đào tạo
  getDataConfirmShift: data => httpErp.get('/ErpTrainingSyllabus/getDataConfirmShift', {params: data}),
  // Giải trình chốt ca
  explainLockShift: data => httpErp.post('/ErpTrainingSyllabus/explainLockShift', data),

  getPeriodTest (data) {
    return httpHrmUni.get('/erp/period-test/show-test', {params: data})
  },

  getUserTest (data) {
    return httpErpNew.get('/class/user-test', {params: data})
  },

  getListStudents (data) {
    return httpHrmUni.get('erp/ErpTpClass/getListStudentOfClass', {params: data})
  },

  // lịch hẹn đào tạo
  createAppointment: data => httpErpNew.post('/appointment/create', data),
  updateAppointment: data => httpErpNew.put('/appointment/update', data),
  removeAppointment: data => httpErpNew.delete('/appointment/delete', {params: data}),

  // Đánh giá học viên
  getEvaluateByUserAndPeriod (data) {
    return httpErpNew.get('/student/get-evaluate', {params: data})
  },

  // Tạo hoặc cập nhật đánh giá
  createEvaluate (data) {
    return httpErpNew.post('/student/create-evaluate', data)
  }
}
