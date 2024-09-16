import http from 'infrastructures/api-http'
import config from 'config/app.base'

export default {
  /**
   * API get list payslip
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getList (data) {
    return http.get('/AdPartnershipPayslip/getList', {'params': data})
  },

  /**
   * API get payslip detail
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getDetail (data) {
    return http.get('/AdPartnershipPayslip/getDetail', {'params': data})
  },

  /**
   * Save
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  update (data) {
    return http.post('/AdPartnershipPayslip/update', data)
  },

  delete (id) {
    let data = { id }
    return http.post('/AdPartnershipPayslip/delete', data)
  },

  deleteByConditions (conditions) {
    return http.post('/AdPartnershipPayslip/deleteByConditions', conditions)
  },

  requestExportFile (data) {
    return http.get('/AdPartnershipPayslip/exportExcel', {'params': data})
  },

  checkExportFileComplete (data) {
    return http.get('/AdPartnershipPayslip/checkExportFileComplete', {'params': data})
  },

  getDownloadExcelLink (filePath) {
    return config.baseApiUrl + `AdPartnershipPayslip/downloadExportFile?file=${filePath}`
  },

  checkBeforeCreatePayslip (data) {
    return http.get('/AdPartnershipPayslip/countUserByFilter', {'params': data})
  },

  createPayslipByFilter (data) {
    return http.get('/AdPartnershipPayslip/createPayslipByFilter', {'params': data})
  },

  uploadExcelPayslip () {
    return http.get('/AdPartnershipPayslip/uploadExcelPayslip')
  }
}
