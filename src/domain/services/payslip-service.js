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
    return http.get('/AdPayslip/getList', {'params': data})
  },

  /**
   * API get payslip detail
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getDetail (data) {
    return http.get('/AdPayslip/getDetail', {'params': data})
  },

  /**
   * Save
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  update (data) {
    return http.post('/AdPayslip/update', data)
  },

  delete (id) {
    let data = { id }
    return http.post('/AdPayslip/delete', data)
  },

  deleteByConditions (conditions) {
    return http.post('/AdPayslip/deleteByConditions', conditions)
  },

  requestExportFile (data) {
    return http.get('/AdPayslip/exportExcel', {'params': data})
  },

  checkExportFileComplete (data) {
    return http.get('/AdPayslip/checkExportFileComplete', {'params': data})
  },

  getDownloadExcelLink (filePath) {
    return config.baseApiUrl + `AdPayslip/downloadExportFile?file=${filePath}`
  },

  checkBeforeCreatePayslip (data) {
    return http.get('/AdPayslip/countUserByFilter', {'params': data})
  },

  createPayslipByFilter (data) {
    return http.get('/AdPayslip/createPayslipByFilter', {'params': data})
  },

  uploadExcelPayslip () {
    return http.get('/AdPayslip/uploadExcelPayslip')
  },
  getListSalaryFormulaCod () {
    return http.get('/AdPayslip/getListSalaryFormulaOfCod')
  },
  changeStatusPayslip (id, status) {
    let data = {id, status}
    return http.post('/AdPayslip/changeStatusPayslip', data)
  }
}
