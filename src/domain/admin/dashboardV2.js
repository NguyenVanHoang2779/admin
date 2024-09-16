import http from 'infrastructures/api-http'

export default {
  getRealtimeOperation (params) {
    return http.get('AdHome/getRealtimeOperation', {'params': params})
  },
  getPerformanceOperation (params) {
    return http.get('AdHome/getPerformanceOperation', {'params': params})
  },
  getPerformanceAccountant (params) {
    return http.get('AdHome/getPerformanceAccountant', {'params': params})
  },
  getShopPicking (params) {
    return http.get('AdHome/getShopPicking', {'params': params})
  },
  getProvincePicking (params) {
    return http.get('AdHome/getProvincePicking', {'params': params})
  },
  getDistrictDelivering (params) {
    return http.get('AdHome/getDistrictDelivering', {'params': params})
  },
  getProvinceDelivering (params) {
    return http.get('AdHome/getProvinceDelivering', {'params': params})
  },
  getProvinceList (params) {
    return http.get('AdHome/getProvinceList')
  }
}
