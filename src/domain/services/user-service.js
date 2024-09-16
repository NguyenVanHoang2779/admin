import http from 'infrastructures/api-http'
import httpErpNew from 'infrastructures/api-erp-new'

export default {
  updateStatus (userId, statusId) {
    let param = {
      user_id: userId,
      status_id: statusId
    }

    return http.post('/AdProfiles/updateStatusUser', param)
  },

  changeVirtualUserStatus (userId, virtualUserStatus) {
    let param = {
      user_id: userId,
      virtual_user: virtualUserStatus
    }
    return http.post('/AdUsers/changeVirtualUserStatus', param)
  },

  getValidSalaryFormulasOfCod () {
    return http.get('/AdUsers/getValidSalaryFormulasOfCod')
  },

  calculateCodFormula (param) {
    return http.get('/AdUsers/calculateCodFormula', {'params': param})
  },

  getLeaveUsers (param) {
    return http.get('/AdUsers/getLeaveUsers', {'params': param})
  },

  updateLeaveBlance (data) {
    return http.post('/AdUsers/updateLeaveBlanceVer2', data)
  },

  getLogs (data) {
    return http.get('/AdUsers/getLogs', {'params': data})
  },

  fetchDataForUserFilter (data) {
    return http.get('AdUsers/fetchDataForUserFilter', {'params': data})
  },

  getSpecialPermissions (data) {
    return http.get('/AdUsers/getSpecialPermissions', {params: data})
  },

  getBasicInfoById (data) {
    return http.get('/AdUsers/getBasicInfoById', {'params': data})
  },

  getUserInfo () {
    return http.get('AdUsers/getUserInfo')
  },

  getUserDetailInfo (data) {
    return http.get('AdUsers/getUserDetailInfo', {params: data})
  },

  updateMainUser (data) {
    return http.post('/AdUsers/updateMainUser', data)
  },

  getListUser (data) {
    return http.get('AdUsers/getListUser', {params: data})
  },

  searchUser (data) {
    return httpErpNew.get('user/search', {params: data})
  },

  getAllLeaveType () {
    return http.get('AdTimeSheetManager/getAllLeaveType')
  },

  createLeaveBlance (data) {
    return http.post('/AdUsers/createLeaveBlance', data)
  },

  updateWorkHistory: data => http.post('/AdUsers/updateWorkHistory', data),
  getUserWorkHistory: id => http.get('/AdUsers/getUserWorkHistory', {'params': id}),
  updatePauseWorkHistory: data => http.post('/AdMasterProfile/resign', data),
  addLogPauseWorkHistory: data => http.post('/AdMasterProfile/addLogPauseWorkHistory', data),
  getUserPauseWorkHistory: id => http.get('/AdUsers/getUserPauseWorkHistory', {'params': id}),
  removeWorkHistory: id => http.get('/AdUsers/removeWorkHistory', {'params': id}),
  removePauseWorkHistory: id => http.get('/AdUsers/removePauseWorkHistory', {'params': id}),
  getNewLogs: id => http.get('/AdUsers/getNewLogs', {'params': {'profile_id': id}}),
  addCancelPauseWorkHistory: data => http.post('/AdMasterProfile/cancelResign', data),
  // createZoiperAcc: data => http.post('/AdUsers/setUserPhone', data)
  createZoiperAcc: data => httpErpNew.post('/call-center/create-user-phone', data),

  // api lấy số điện thoại:
  getPhoneByUserId: data => httpErpNew.get('/user/get-phone', {'params': data}),

  // check permission
  canPer: data => httpErpNew.get('/user/can', {'params': data}),

  // lấy gợi ý quản lý, nhân viên
  suggestManagerEmployee: data => httpErpNew.post('/user/suggest-manager-employee', data),
  // update quản lý, nhân viên
  updateManagerEmployee: data => httpErpNew.post('/user/update-manager-employee', data),
  // Cập nhật công việc mặc định
  updateDefaultWork (data) {
    return httpErpNew.post('/default-work/update-job-web', data)
  },
  getUserChangeLog: data => httpErpNew.get('/user/get-change-logs', {'params': data}),
}
