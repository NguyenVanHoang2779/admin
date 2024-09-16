import httpErp from 'infrastructures/api-erp-http'
import httpErpNew from 'infrastructures/api-erp-new'

export default {
  listOrder (data) {
    return httpErp.get('/ErpHrOrder/listOrder', { params: data })
  },

  getOrderContracts (data) {
    return httpErp.get('/ErpHrOrder/getOrderContracts', { params: data })
  },

  getAmountContractByType (data) {
    return httpErp.get('/ErpHrOrder/getAmountContractByType', { params: data })
  },

  getTotal (data) {
    return httpErp.get('/ErpHrOrder/getTotalAmountOrder', { params: data })
  },

  createDirectChat (data) {
    return httpErp.get('/ErpGChat/createDirectChat', { params: data })
  },

  updateOrder (data) {
    return httpErp.post('/ErpHrOrder/updateOrder', data)
  },

  updateUserHandler (data) {
    return httpErp.post('/ErpHrOrder/updateUserHandler', data)
  },

  detailOrder (data) {
    return httpErp.get('/ErpHrOrder/detailOrder', { params: data })
  },

  getType (data) {
    return httpErp.get('/ErpHrOrder/getType', { params: data })
  },

  getProfile (data) {
    return httpErp.get('/ErpHrOrder/getProfile', { params: data })
  },

  sendComment (data) {
    return httpErp.post('/ErpHrOrder/sendComment', data)
  },

  updateStatus (data) {
    return httpErp.post('/ErpHrOrder/updateStatusOrder', data)
  },

  updateCensor (data) {
    return httpErp.post('/ErpHrOrder/updateCensor', data)
  },

  exportOrderHr (data) {
    return httpErp.post('/ErpHrOrder/exportOrderHr', data)
  },

  getOrderOfProfile (data) {
    return httpErp.post('/ErpHrOrder/getOrderOfProfile', data)
  },

  allowShowOnGchat (data) {
    return httpErp.post('/ErpHrOrder/checkAllowShowOnGchat', data)
  },

  getStatisticOrderHr (data) {
    return httpErp.get('/ErpHrOrder/getStatisticOrderHr', { params: data })
  },

  getHoliday (data) {
    return httpErp.get('/ErpHrOrder/getHoliday', { params: data })
  },

  suggestData (data) {
    return httpErp.post('/ErpHrOrder/suggestData', data)
  },

  getOrderMissDeadline (data) {
    return httpErp.get('/ErpHrOrder/getOrderMissDeadline', { params: data })
  },

  getLogUpdate (data) {
    return httpErp.get('/ErpHrOrder/getLogUpdate', { params: data })
  },

  getCensorForOrder (data) {
    return httpErp.get('/ErpHrOrder/getCensorForOrder', { params: data })
  },

  // lấy thông tin đề xuất màn nghỉ việc
  getAllOrderOrUserStopWork (data) {
    return httpErp.get('/ErpHrOrder/getAllOrderOrUserStopWork', { params: data })
  },

  // lấy thông tin chưa duyệt ảnh chụp lại ekyc
  getEkycImageChanges (data) {
    return httpErp.get('/ErpHrOrder/getEkycChanges', { params: data })
  },

  // lấy thông tin chưa duyệt đề xuất báo mất/làm lại CMND/CCCD
  getReportLostIdentityCardOrder (data) {
    return httpErp.get('/ErpHrOrder/getReportLostIdentityCard', { params: data })
  },

  // lấy thông tin số lượng đề xuất
  getCountOrderStopWork (data) {
    return httpErp.get('/ErpHrOrder/getCountOrderStopWork', {params: data})
  },

  getCensorForScreenStopWork (data) {
    return httpErp.get('/ErpHrOrder/getCensorForScreenStopWork', { params: data })
  },

  // Thêm action vào log
  updateStaffLog (data) {
    return httpErp.post('/ErpHrOrder/updateStaffLog', data)
  },

  removeHandlerStepOfOrder (data) {
    return httpErpNew.post('/hr-order/remove-handler', data)
  },

  addHandlerToStepOfOrder (data) {
    return httpErpNew.post('/hr-order/add-handler', data)
  },

  updateStaffLogV2 (data) {
    return httpErpNew.post('/hr-order/add-note', data)
  },

  // api thông báo nghỉ
  resignationNotify (data) {
    return httpErpNew.post('/hr-order/resignation-notify', data)
  }
}
