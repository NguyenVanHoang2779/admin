import http from 'infrastructures/api-http'

export default {
  getRealtimeOperationV5 (params) {
    return http.get('AdHome/getRealtimeOperationV5', {'params': params})
  },

  getStationQuantityV5 (params) {
    return http.get('AdHome/getStationQuantityV5', {'params': params})
  },

  getLvStation () {
    return http.get('AdHome/getLvStation')
  }
}
