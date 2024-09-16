import httpErpNew from 'infrastructures/api-erp-new'

export default {
  // Lấy list nhân viên
  getListEmployee: data => httpErpNew.post('/user-management/staff-list', data),

  // check quyền view link vào màn quản lý tag
  checkPermissionLinkTag: params => httpErpNew.get('/tags/check-permission', params),

  // Lấy thông tin log đào tạo tân binh
  getlistLogDetail: data => httpErpNew.get('/user-management/staff-log', {params: data}),

  // api thay đổi thông tin người quản lý của user
  apiChangeOwnerUser: data => httpErpNew.post('/user-management/set-leader', data),

  // thêm ghi chú
  addUserNote: data => httpErpNew.post('/user-management/add-note', data),

  // lấy số điện thoại nhân viên
  getStaffPhoneNumber: params => httpErpNew.get('/user-management/get-phone', {params}),

  // check quyền quản lý hoặc truy cập dữ liệu nhân viên
  canManagementStaff: (params) => {
    params.with_delete = 0
    return httpErpNew.get('/reporting-line/is-leader-of-staff', {params})
  },

  canAccessStaffData: (params) => {
    params.with_delete = 1 // được xem dữ liệu nhân cũ đã nghỉ việc trong voòng 45 ngày
    return httpErpNew.get('/reporting-line/is-leader-of-staff', {params})
  },

  setRemoteCheckin: data => httpErpNew.post('/user-management/set-remote-attendance', data),
  removeRemoteCheckin: data => httpErpNew.post('/user-management/remove-remote-attendance', data)
}
