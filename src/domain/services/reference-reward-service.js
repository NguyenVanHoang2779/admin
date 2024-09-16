import http from 'infrastructures/api-http'
import config from 'config/app.base'

export default {
  getRefRewardList (data) {
    return http.get('/ref-reward/getList', {'params': data})
  },
  getRole (data) {
    return http.get('/ref-reward/getRole', {'params': data})
  },
  confirm (data) {
    return http.post('/ref-reward/confirm', data)
  },
  abort (data) {
    return http.post('ref-reward/abort', data)
  },
  requestExportFile (data) {
    return http.get('/AdReferenceRewards/exportRefReward', {'params': data})
  },
  getDownloadExcelLink (filePath) {
    return config.baseApiUrl + `AdReferenceRewards/downloadExportFile?file=${filePath}`
  }
}
