import httpErp from 'infrastructures/api-erp-http'
export default {
  // Lấy thống kê số lượng theo thống kê
  getStatisticStatusOnboard (data) {
    return httpErp.get('ErpStaffOnboard/getStatisticStatusOnboard', {params: data})
  },

  // Lấy data onboard của nhân viên
  getDataStatusOnboard (data) {
    return httpErp.get('ErpStaffOnboard/getDataStatusOnboard', {params: data})
  }
}
