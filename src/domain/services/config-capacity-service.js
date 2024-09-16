import http from 'infrastructures/api-http'

export default {
  /**
   * API get list regions
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  edit (data) {
    return http.post('AdAutoAssign/createOrUpdateCodCapacity', data)
  },
  search (params) {
    return http.get('AdAutoAssign/getCodCapacity', {'params': params})
  },
  getProvince (data) {
    return http.get('AdShopBank/getOptionSearch', {'params': data})
  },
  getStation (data) {
    return http.get('AdAddresses/getStationByProvinceFormat', {'params': data})
  },
  getTypeCod (data) {
    return http.get('services/autocompleteCod?term=', {'params': data})
  },
  getModule (data) {
    return http.get('AdModules/getAllModuleByStation', {'params': data})
  }
}
