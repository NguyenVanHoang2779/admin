import http from 'infrastructures/api-http'

export default {
  getLogBagOrder (data) {
    return http.get('AdBags/getBagLogs', {'params': data})
  }
}
