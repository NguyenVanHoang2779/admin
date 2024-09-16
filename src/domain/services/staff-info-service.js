import httpErp from 'infrastructures/api-erp-http'
export default {
  // Lấy thông tin hộ khẩu gia đình
  getHouseholdMember: (data) => httpErp.get('ErpStaffInfo/getHouseholdMember', {params: data}),
  // Lấy thông tin người bảo lãnh
  getGuardian: (data) => httpErp.get('ErpStaffInfo/getGuardian', {params: data}),
  // Lấy thông tin thăm nhà
  getVisitHomeInfo: data => httpErp.get('ErpStaffInfo/getVisitHomeInfo', {params: data}),
  // Cập nhật thông tin thăm nhà
  updateVisitHomeInfo: data => httpErp.post('ErpStaffInfo/updateVisitHomeInfo', data),
  // Lấy thông tin con nhỏ
  getChildrenInfo: data => httpErp.get('ErpStaffInfo/getChildrenInfo', {params: data}),
  // Lấy thông tin con nhỏ
  updateChildrenInfo: data => httpErp.post('ErpStaffInfo/updateChildrenInfo', data)
}
