import httpErp from 'infrastructures/api-erp-http'

export default {
  getPermissions (data) {
    return httpErp.get('ErpWorkSchedule/getPermissionConfig', {'params': data})
  },

  getConfigByMonth (data) {
    return httpErp.get('ErpWorkSchedule/getConfigByMonth', {'params': data})
  },

  updateConfig (data) {
    return httpErp.post('/ErpWorkSchedule/updateConfig', data)
  },

  getAmountHumanOfStation (data) {
    return httpErp.get('ErpWorkSchedule/getAmountHumanOfStation', {'params': data})
  },

  getScheduleByDate (data) {
    return httpErp.get('ErpWorkSchedule/getScheduleByDate', {'params': data})
  },

  getScheduleByCod (data) {
    return httpErp.get('ErpWorkSchedule/getScheduleByCod', {'params': data})
  },

  createWorkSchedule (data) {
    return httpErp.post('/ErpWorkSchedule/createWorkSchedule', data)
  },

  createScheduleForNewUser (data) {
    return httpErp.post('/ErpWorkSchedule/createScheduleForNewUser', data)
  },

  updateSchedule (data) {
    return httpErp.post('/ErpWorkSchedule/updateSchedule', data)
  },

  copyConfig (data) {
    return httpErp.post('/ErpWorkSchedule/apiCopyConfig', data)
  },

  checkCanRedirect (data) {
    return httpErp.get('/ErpKpi/checkHasConfig', {'params': data})
  }
}
