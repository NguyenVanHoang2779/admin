import httpErp from 'infrastructures/api-erp-http'
export default {

  // Lấy menu công việc
  getMenuWork (data) {
    return httpErp.get('ErpStaffWork/getMenuWork', {params: data})
  },

  // Lấy thống kê công việc
  getStatisticWork (data) {
    return httpErp.get('ErpStaffWork/getStatisticWork', {params: data})
  },

  // Lấy data công việc
  getDataWork (data) {
    return httpErp.get('ErpStaffWork/getDataWork', {params: data})
  },

  // thêm ghi chú
  staffLog (data) {
    return httpErp.post('ErpStaffWork/staffLog', data)
  }
}
