import httpErp from 'infrastructures/api-erp-http'

export default {
  getAllProvince () {
    return httpErp.get('salaryCods/getAllProvince')
  },
  getListPenalties (data) {
    return httpErp.get('salaryCods/searchPkBrokenPenalties', {'params': data})
  },
  requestConfirm (data) {
    return httpErp.post('salaryCods/requestConfirm', data)
  },
  exportExcelReportPenalties (data) {
    return httpErp.post('salaryCods/exportFileReportPenalties', data)
  },
  checkProcessExcel (data) {
    return httpErp.get('salaryCods/checkProcessFile', {'params': data})
  },

  checkRolePenaltiesDriver () {
    return httpErp.get('driverPenalties/checkRoleUser')
  },
  getListPenaltiesDriver (data) {
    return httpErp.get('driverPenalties/getReportDriver', {'params': data})
  },
  requestConfirmDriver (data) {
    return httpErp.post('driverPenalties/requestConfirm', data)
  }
}
