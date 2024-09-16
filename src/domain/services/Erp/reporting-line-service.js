import http from 'infrastructures/api-http'

export default {
  checkUserValidate: params => (http.get('AdReportingLine/checkUserValidate', {params}))
}
