import httpHrmUni from 'infrastructures/api-hrm-uni'
export default {
  getListQuestionByQuestionIds: data => httpHrmUni.get('/education/api/tp/lessons/questions', {'params': data})
}
