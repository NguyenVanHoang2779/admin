import httpErp from 'infrastructures/api-erp-http'

export default {
  // API lấy dữ liệu lộ trình xteam theo thao tác thực tế
  apiGetDetailRouteXteam (data) {
    return httpErp.get('salaryCods/apiGetRouteRealityXteam', {'params': data})
  },
  // API lấy dữ liệu lộ trình xteam theo hệ thống
  apiGetRouteSystemXteam (data) {
    return httpErp.get('salaryCods/apiGetRouteSystemXteam', {'params': data})
  },
  // API lấy dữ liệu lộ trình xteam theo cơ chế mới
  apiGetDetailRouteXteamNew (data) {
    return httpErp.get('salaryCods/apiGetDetailRouteXteamNew', {'params': data})
  },
  // API lấy dữ liệu chi tiết các gói đơn
  apiGetInfoListPackages (data) {
    return httpErp.get('salaryCods/apiGetInfoListPackages', {'params': data})
  },
  // API lấy dữ liệu tính lương xteam
  getSalaryCodWorkshift (data) {
    return httpErp.get('salaryCods/getSalaryCodWorkshift', {'params': data})
  }
}
