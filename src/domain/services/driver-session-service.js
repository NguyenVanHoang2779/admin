import httpErp from 'infrastructures/api-erp-http'

export default {
  getDriverSessionDataById (data) {
    return httpErp.get(`erpDriverStatistic/getDriverSessionDataBySessionId`, {'params': data})
  },
  getDriverSalaryInMonth (data) {
    return httpErp.get(`erpDriverStatistic/getSalarytDriverById`, {'params': data})
  },
  getRentTructCostInMonth (data) {
    return httpErp.get(`erpDriverStatistic/getRentTruckDataInMonth`, {'params': data})
  },
  getRentTructCostCompanyInDate (data) {
    return httpErp.get(`erpDriverStatistic/getRenTructCostCompanyInDate`, {'params': data})
  },
  getListFileDriverSsPointData (data) {
    return httpErp.post(`erpDriverStatistic/getListFileDriverSsPointData`, data)
  },
  downloadFileDriverSsPoint (data) {
    return httpErp.post(`erpDriverStatistic/downloadFileDriverSsPoint`, data)
  },
  removeFileDriverSsPoint (data) {
    return httpErp.post(`erpDriverStatistic/removeFileDriverSsPoint`, data)
  },
  exportDriverPointDataByDate (data) {
    return httpErp.post(`erpDriverStatistic/exportDriverPointDataByDates`, data)
  }
}
