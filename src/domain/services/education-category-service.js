import http from 'infrastructures/api-http'

export default {
  getCategories () {
    return http.get('erp/training/questions/getCategories')
  }
}
