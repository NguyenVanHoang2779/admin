import httpErp from 'infrastructures/api-erp-http'

export default {
  // API lấy dữ liệu người duyệt phạt
  apiGetDataApprovalPenaltyData (data) {
    return httpErp.get('penalties/apiGetDataApprovalPenaltyData', {'params': data})
  },
  // API update liệu thay đổi
  apiSaveApprovalPenaltyData (data) {
    return httpErp.post('penalties/apiSaveApprovalPenaltyData', data)
  },
  // API lưu dữ liệu thay đổi
  apiCreateApprovalPenaltyData (data) {
    return httpErp.post('penalties/apiCreateApprovalPenaltyData', data)
  },
  deleteApprovalPenalty (data) {
    return httpErp.post('penalties/deleteApprovalPenalty', data)
  },
  // API lấy list group
  apiGetSubjectGroupOptions () {
    return httpErp.get('penalties/apiGetSubjectGroupOptions')
  },
  // API lấy list positions
  apiGetSubjectPositionsOptions () {
    return httpErp.get('penalties/apiGetSubjectPositionsOptions')
  }
}
