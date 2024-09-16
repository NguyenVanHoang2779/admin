import httpErp from 'infrastructures/api-erp-http'

export default {
  getAllTeams (data) {
    return httpErp.get('salaryHr/getAllTeams', {'params': data})
  },

  calSalaryInTime (data) {
    return httpErp.post('salaryHr/callKpiInTime', data)
  },

  callSalaryHr (data) {
    return httpErp.post('salaryHr/callSalaryHr', data)
  },

  saveSalaryNewStaff (data) {
    return httpErp.post('salaryHr/saveSalaryNewStaff', data)
  },

  exportDataToExcel (data) {
    return httpErp.post('salaryHr/exportDataToExcel', data)
  },

  loadFiles (data) {
    return httpErp.get('salaryHr/loadFiles', {'params': data})
  },

  deleteFile (data) {
    return httpErp.post('salaryHr/deleteFile', data)
  }
}
