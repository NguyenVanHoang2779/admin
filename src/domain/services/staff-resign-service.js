import httpErp from 'infrastructures/api-erp-http'
import httpErpNew from 'infrastructures/api-erp-new'
export default {
  // Lấy thống kê số lượng theo thống kê
  getStatisticUserResign (data) {
    return httpErp.get('ErpStaffResign/getStatisticUserResign', {params: data})
  },

  // Lấy data onboard của nhân viên
  getDataUserResign (data) {
    return httpErp.get('ErpStaffResign/getDataUserResign', {params: data})
  },

  // Lấy data màn đề xuất hỗ trợ gắn bó
  // Lấy thông tin log đào tạo tân binh
  getDataStaffSupport: data => httpErpNew.get('/hr-order/resign/search', {params: data}),

  // Lấy thông tin log màn đề xuất hỗ trợ gắn bó
  getLogDetail: data => httpErpNew.get('/user-management/staff-log', {params: data}),

  // Lấy danh sách vấn đề
  getListProblems: data => httpErpNew.get('/hr-order/problem-catalog', {params: data}),

  // Lấy danh sách giải pháp
  getListSolution: data => httpErpNew.get('/hr-order/solution-catalog', {params: data}),

  // update trạng thái xử lý các bước đề xuất
  updateStep: data => httpErpNew.post('/hr-order/update', data),
  // Lấy thống kê số lượng theo thống kê
  getStatisticHrOrderV2: data => httpErpNew.get('/hr-order/resign/count', {params: data})
}
