import http from 'infrastructures/api-erp-http'

export default {
  createHoliday (data) {
    return http.post('ErpHolidayWorkshiftConfig/addHoliday', data)
  },

  updateHoliday (data) {
    return http.post('ErpHolidayWorkshiftConfig/updateHoliday', data)
  },

  deleteHoliday (data) {
    return http.get('ErpHolidayWorkshiftConfig/deleteHoliday', {'params': data})
  },

  getAllHoliday (data) {
    return http.get('ErpHolidayWorkshiftConfig/getAllHoliday', {'params': data})
  }
}
