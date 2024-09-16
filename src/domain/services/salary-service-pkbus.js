import httpErp from 'infrastructures/api-erp-http'

export default {
  // Api màn hình config ca checkin pk bus
  createConfigCheckinV3 (data) {
    return httpErp.post('checkin-cod/configCheckinPkBus', data)
  },
  getAllConfigCheckin (data) {
    return httpErp.get('checkin-cod/getAllConfigCheckin', {'params': data})
  },
  getListStopPointByUser () {
    return httpErp.get('checkin-cod/getListStopPointByUser')
  },
  getInfoUserPkBus (data) {
    return httpErp.get('checkin-cod/getInfoUserPkBus', {'params': data})
  },
  getConfigByConfigId (data) {
    return httpErp.get('checkin-cod/getConfigByConfigId', {'params': data})
  },
  getAllConfigPkbus (data) {
    return httpErp.get('checkin-cod/getAllConfigPkbus', {'params': data})
  },
  deleteConfig (data) {
    return httpErp.get('checkin-cod/deleteConfig', {'params': data})
  }
}
