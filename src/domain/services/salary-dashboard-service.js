import httpErp from 'infrastructures/api-erp-http'

export default {
  getAllSalaryUserInMonth (data) {
    return httpErp.get('/salaryChange/apiGetSalaryInMonth', { params: data })
  },
  apiSearchAllUser (data) {
    return httpErp.get('/salaryChange/apiSearchAllUser', { params: data })
  }
}
