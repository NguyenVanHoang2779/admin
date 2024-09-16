import httpErp from 'infrastructures/api-erp-http'

export default {
  getSalryRangeTime (data) {
    return httpErp.get('sales/getRangeTimeSalaryByMonth', {'params': data})
  },
  createTeamProcess (data) {
    return httpErp.post('sales/createTeamProcess', data)
  },
  deleteTeamProcess (data) {
    return httpErp.put(`sales/deleteTeamProcess?team_id=${data}`)
  },
  getListBssidSuggestionByStation (data) {
    return httpErp.get(`wifi-manager/getListBssidSuggestion?stationId=${data}`)
  },
  addWifi (data) {
    return httpErp.post('wifi-manager/addWifi', data)
  },
  getListWifi (data) {
    return httpErp.get('wifi-manager/searchWifi', {'params': data})
  }
}
