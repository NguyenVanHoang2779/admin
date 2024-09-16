import httpErp from 'infrastructures/api-erp-http'
export default {
  // API lấy dữ liệu profile station
  getProfileStation (data) {
    return httpErp.get('profile-station/getProfileStation', {'params': data})
  },
  // API lấy dữ liệu cho biểu đồ chi phí/bồi hoàn
  getDataChartCostStation (data) {
    return httpErp.get('profile-station/getDataChartCostStation', {'params': data})
  },
  // API lấy dữ liệu Station counter log
  getLogCounterStation (data) {
    return httpErp.get('profile-station/getLogCounterStation', {'params': data})
  },
  // API lấy dữ liệu chi tiết log
  getLogDetail (data) {
    return httpErp.get('profile-station/apiGetDataLogStation', {'params': data})
  },
  // API lấy dữ liệu cho biểu đồ chi phí nhân sự
  getDataCostPerson (data) {
    return httpErp.get('profile-station/apiGetDataCostPerson', {'params': data})
  },
  // API lấy dữ liệu biểu đồ cột và đường station
  getDataChartBarAndLineStation (data) {
    return httpErp.get('profile-station/apiDataChartBarAndLineStation', {'params': data})
  }
}
