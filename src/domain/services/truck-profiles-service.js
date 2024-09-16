import httpErp from 'infrastructures/api-erp-http'
export default {
  // API lấy dữ liệu profile truck
  getProfileTruck (data) {
    return httpErp.get('profile-truck/getProfileTruck', {'params': data})
  },
  // API lấy dữ liệu cho biểu đồ chi phí/bồi hoàn
  getDataChartCostTruck (data) {
    return httpErp.get('profile-truck/getDataChartCostTruck', {'params': data})
  },
  // API lấy dữ liệu năng suất xe tải
  getDataProductivityTruck (data) {
    return httpErp.get('profile-truck/apiGetDataProductivityTruck', {'params': data})
  },
  // API lấy dữ liệu Truck counter log
  getLogCounterTruck (data) {
    return httpErp.get('profile-truck/getLogCounterTruck', {'params': data})
  },
  // API lấy dữ liệu chi tiết log
  getLogDetail (data) {
    return httpErp.get('profile-truck/getLogDetail', {'params': data})
  }
}
