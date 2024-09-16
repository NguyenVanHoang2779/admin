import http from 'infrastructures/api-http'

export default {
  getStats (data) {
    return http.get('AdProfileStatistic/getStats', {'params': data})
  },
  getUserStat (data) {
    return http.get('AdProfileStatistic/getUserStat', {'params': data})
  },
  getAgeStat (data) {
    return http.get('AdProfileStatistic/getMasterProfileByAge', {'params': data})
  },
  exportUserStat (data) {
    return http.get('AdProfileStatistic/exportUserProfile', {'params': data})
  },
  exportAgeStat (data) {
    return http.get('AdProfileStatistic/exportAge', {'params': data})
  }
}
