import http from 'infrastructures/api-http'
import erpHttp from 'infrastructures/api-erp-http'

export default {
  getDataCic (data) {
    return http.get('AdMasterProfile/apiGetDataCic', {'params': data})
  },
  apiApproveDocument (data) {
    return erpHttp.post('ErpProfileDocument/apiApproveDocument', data)
  }
}
