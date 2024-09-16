import http from 'infrastructures/api-http'

export default {

  getExternalDataFromImpala (params) {
    return http.get('AdDashboardExternal/getExternalDataFromImapala', {'params': params})
  }
}
