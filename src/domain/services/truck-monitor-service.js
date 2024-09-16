import httpErp from 'infrastructures/api-erp-http'

export default {
  // Lấy danh sách user giám sát xe tải
  getAllStaffTruckMonitor () {
    return httpErp.get('salary-truck-monitor/getAllStaffTruckMonitor')
  },
  // Tính lương
  calSalary (data) {
    return httpErp.get('salary-truck-monitor/apiCalSalaryTruckMonitor', {'params': data})
  },
  // Xuất lương
  exportAllSalary (data) {
    return httpErp.post('salary-truck-monitor/apiExportSalaryTruckMonitor', data)
  },
  // Lấy thông tin chi tiết lương của một user
  getInfoSalaryUser (data) {
    return httpErp.get('salary-truck-monitor/getInfoSalaryUser', {'params': data})
  }
}
