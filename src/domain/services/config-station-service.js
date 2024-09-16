import http from 'infrastructures/api-http'

export default {
  /**
   * Config kho bất ổn, ổn định, trung bình
   */
  getListConfigStations (data) {
    return http.get('config-station/index', {'params': data})
  },
  addConfigStation (data) {
    return http.post('config-station/create', data)
  }
}
