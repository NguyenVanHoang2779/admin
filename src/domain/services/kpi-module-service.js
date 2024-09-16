// import httpErp from 'infrastructures/api-erp-http'
import http from 'infrastructures/api-http'

export default {
  // API lấy dữ liệu module
  apiGetDataModules (data) {
    return http.get('kpi-module/apiGetDataModules', {'params': data})
  },
  // API lấy dữ liệu user trong module
  apiGetDetailModuleUsers (data) {
    return http.get('kpi-module/apiGetDetailModuleUsers', {'params': data})
  },
  // API lấy danh sách user
  apiGetListUsers (data) {
    return http.get('kpi-module/apiGetListUsers', {'params': data})
  },
  apiSaveDataModuleUsers (data) {
    return http.post('kpi-module/apiSaveDataModuleUsers', data)
  }
}
