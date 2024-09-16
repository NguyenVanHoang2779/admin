import httpErp from 'infrastructures/api-erp-http'
import httpErpNew from 'infrastructures/api-erp-new'
import httpHrmUni from 'infrastructures/api-hrm-uni'

export default {
  getListQuestions (params) {
    return httpErp.get('training/questions/getListQuestions', {'params': params})
  },

  getCategories () {
    return httpErp.get('/training/questions/getCategories')
  },

  deleteQuestion (data) {
    return httpErp.post('/training/questions/deleteQuestion', {data})
  },

  deleteQuestionNew (data) {
    return httpErpNew.post('/questions/delete', data)
  },

  editQuestion (data) {
    return httpErp.post('/training/questions/editQuestion', {data})
  },

  importQuestions (data) {
    return httpErp.post('/training/questions/importQuestions', data)
  },
  // Lấy danh sách câu hỏi tự luận
  getListEssayQuestion (data) {
    return httpErpNew.get('questions/list-essay', {'params': data})
  },
  // import câu hỏi tự luận
  importEssayQuestions (data) {
    return httpErpNew.post('/questions/import-essay', data)
  },
  // chỉnh sửa câu hỏi
  editEssayQuestion (data) {
    return httpErpNew.post('/questions/update-essay', data)
  },

  getListQuestionsNew (params) {
    return httpErpNew.get('questions/question-create-test', {'params': params})
  },
  // Check phân quyền
  getPermission () {
    return httpErpNew.get('questions/get-permissions')
  },

  // Lấy danh sách câu hỏi trắc nghiệm
  getListMultipleQuestion (data) {
    return httpErpNew.get('questions/list-multiple-choice', {'params': data})
  },
  // import câu hỏi trắc nghiệm
  importMultipleQuestions (data) {
    return httpErpNew.post('/questions/import-multiple-choice', data)
  },
  // lấy danh sách câu hỏi theo id bài test
  getListQuestionsByTest (params) {
    return httpErpNew.get('period-test/questions-of-test', {'params': params})
  },
  // lấy list câu hỏi bài kiểm tra của học viên theo id
  getTestById (params) {
    return httpErpNew.get('user-test/get-to-grading', {'params': params})
  },
  // Chấm điểm tự luận
  gradingEssay (data) {
    return httpErpNew.post('/user-test/grading-essay', data)
  },

  // gen file pdf new
  generateTestPdfNew (data) {
    return httpHrmUni.get('/erp/period-test/generate-test-pdf', data)
  },
  // Lấy danh sách bài kiểm tra trong popup tạo bài
  getListTest () {
    return httpErpNew.get('/period-test/list')
  },
  // Chấm điểm tự luận
  editQuestionMultipleNew (data) {
    return httpErpNew.post('/questions/update-multiple-choice', data)
  }
}
