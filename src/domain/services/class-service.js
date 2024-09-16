import httpErpNew from 'infrastructures/api-erp-new'
export default {
  updateClass (data) {
    return httpErpNew.post('/class/update', data)
  },

  checkCanAddStudentToClassOfTp (data) {
    return httpErpNew.post('/syllabus/can-add-student-to-class', data)
  },

  addClassStudent (data) {
    return httpErpNew.post('class/students/add', data)
  }
}
