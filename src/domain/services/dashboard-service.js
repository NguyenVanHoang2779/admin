import http from 'infrastructures/api-http'

export default {
  /**
   * API get list payslip
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getMaxTimeOfData () {
    return http.get('/AdHome/getMaxTimeOfData')
  },

  getMaxTimeOfDataV5 () {
    return http.get('/AdHome/getMaxTimeOfDataV5')
  }
}
