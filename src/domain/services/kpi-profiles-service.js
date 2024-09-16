import httpErp from 'infrastructures/api-erp-http'
import httpAdmin from 'infrastructures/api-http'
import httpErpNew from '../../infrastructures/api-erp-new'
export default {
  // API lấy dữ liệu chuyên cần
  getDiligence (data) {
    return httpAdmin.get('AdMasterProfile/getDiligence', {'params': data})
  },
  // API lấy dữ liệu tiến độ học tập
  getTrainingProgress (data) {
    return httpAdmin.get('AdMasterProfile/getTrainingProgress', {'params': data})
  },
  // API lấy dữ liệu hồ sơ
  getDocumentUploadProgress (data) {
    return httpAdmin.get('AdMasterProfile/getDocumentUploadProgress', {'params': data})
  },
  // API lấy dữ liệu fastar
  getAvgEvaluation (data) {
    return httpAdmin.get('AdMasterProfile/getAvgEvaluation', {'params': data})
  },
  // API lấy dữ liệu fastar
  getSeniority (data) {
    return httpAdmin.get('AdMasterProfile/getSeniority', {'params': data})
  },
  // API lấy dữ liệu profile
  getProfileInfo (data) {
    return httpAdmin.get('AdMasterProfile/getProfileInfo', {'params': data})
  },
  // API lấy dữ liệu qlts
  getInfoAssetOrder (data) {
    return httpErp.get('profile/getInfoAssetOrder', {'params': data})
  },
  // API thêm đánh giá mới
  addReviewCod (data) {
    return httpErp.post('profile/addReviewCod', data)
  },
  // API lấy dữ liệu chat
  getGChatChannel (data) {
    return httpErp.get('profile/getGChatChannel', {'params': data})
  },
  // API lấy dữ liệu header cod
  getDataHeaderProfileCod (data) {
    return httpErp.get('profile/getDataHeaderProfileCod', {'params': data})
  },
  // API lấy dữ liệu header tài xế
  getDataHeaderProfileDriver (data) {
    return httpErp.get('profile/getHeaderDriver', {'params': data})
  },
  // API lấy dữ liệu header xlhh
  getDataHeaderProfileXLHH (data) {
    return httpErp.get('profile/getHeaderXLHH', {'params': data})
  },
  // API lấy dữ liệu header
  getShopReview (data) {
    return httpErp.get('profile/getShopReview', {'params': data})
  },
  // API lấy dữ liệu bigdata
  getDataSpeedDP (data) {
    return httpErp.get('profile/getDataSpeedDP', {'params': data})
  },
  // API lấy dữ liệu counter log
  getLogCounter (data) {
    return httpErp.get('profile/getLogCounter', {'params': data})
  },
  // API lấy dữ liệu chi tieest log
  getLogDetail (data) {
    return httpErp.get('profile/getLogDetail', {'params': data})
  },
  // API lấy dữ liệu cho biểu đồ Tỷ lệ giao/lấy hàng thành công
  getDataDeliveryPick (data) {
    return httpErp.get('profile/apiGetDataChartDeliveryAndPick', {'params': data})
  },
  // API lấy dữ liệu cho biểu đồ lương thưởng
  getDataSalaryReward (data) {
    return httpErp.get('profile/apiGetDataSnapshotSalary', {'params': data})
  },
  // API lấy dữ liệu cho biểu đồ phạt
  getDataPenalty (data) {
    return httpErp.get('profile/apiGetDataPenalty', {'params': data})
  },
  // API lấy dữ liệu cho biểu đồ bồi hoàn
  getDataRefund (data) {
    return httpErp.get('profile/apiGetDataRefund', {'params': data})
  },
  // API lấy danh sách tag ứng với category id
  getListTopics: data => httpErpNew.get('/tag-subjects/index', {params: data}),
  // Api thay đổi danh sách tag gắn với user
  changeTagCategories: data => httpErpNew.post('/tag-categories/update-tagging', data)
}
