import httpKpi from 'infrastructures/api-kpi-http'
const prefixAdTimesheet = 'admin/AdTimeSheetManager'

export default {
  getDataCalendarForUser (data) {
    return httpKpi.get(`${prefixAdTimesheet}/getDataCalendarForUser`, {'params': data})
  },
  getDetailCheckinLog (data) {
    return httpKpi.get(`${prefixAdTimesheet}/getDetailCheckinLog`, {'params': data})
  },
  getActivitiesOfCheckinLog (data) {
    return httpKpi.get(`${prefixAdTimesheet}/getActivitiesOfCheckinLog`, {'params': data})
  },
  changeDataOfCheckinLog (data) {
    return httpKpi.post(`/admin/timesheet/api/approve-request-checkin`, data)
  },
  createCheckinLog (data) {
    return httpKpi.post(`/admin/timesheet/api/request-checkin-by-approval`, data)
  }
}
