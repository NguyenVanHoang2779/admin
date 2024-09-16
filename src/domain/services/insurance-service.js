import httpErp from 'infrastructures/api-erp-http'

export default {
  /**
   * API get list type insurance
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  apiListTypeInsurance () {
    return httpErp.get('ErpInsurance/apiListTypeInsurance')
  },

  /**
   * API check insurance information of emps
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  insuranceCheck (data) {
    return httpErp.get('ErpInsurance/insuranceCheck', {'params': data})
  },

  /**
   * API check insurance information of emps
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  exportInsurance (data) {
    return httpErp.get('ErpInsurance/exportInsurance', {'params': data})
  },

  /**
   * API update Insurance
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  updateInsurance (data) {
    return httpErp.get('ErpInsurance/updateInsurance', {'params': data})
  },

  getHistoryInsurance (data) {
    return httpErp.get('ErpInsurance/getHistoryInsurance', {'params': data})
  },

  importDataInsurance (data) {
    return httpErp.post('ErpInsurance/importDataInsurance', data)
  }
}
