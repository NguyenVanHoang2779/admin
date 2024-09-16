import httpErpNew from 'infrastructures/api-erp-new'

export default {
  // Hr Order v2 common api
  addHrOrderNote (id, data) {
    return httpErpNew.post(`/hr-order/${id}/note`, data)
  },

  updateHandler (id, data) {
    return httpErpNew.post(`/hr-order/${id}/handler`, data)
  },
  // End of Hr Order v2 common api

  // Api đề xuất nghỉ việc
  updateResignationProposal (id, data) {
    return httpErpNew.post(`/hr-order/resignations/${id}`, data)
  },

  // -- Đếm đề xuất nghỉ việc + đề xuất hỗ trợ gắn bó
  countResignationProposals () {
    return httpErpNew.get(`/hr-order/resignations/count`)
  },

  // -- Search/list xuất nghỉ việc + đề xuất hỗ trợ gắn bó
  searchResignationProposals () {
    return httpErpNew.get(`/hr-order/resignations/search`)
  },
  // End of Api đề xuất nghỉ việc

  // Api đề xuất hỗ trợ gắn bó
  getPreResignationProposalDetail (id) {
    return httpErpNew.get(`/hr-order/pre-resignations/${id}`)
  },

  createPreResignationProposal (data) {
    return httpErpNew.post(`/hr-order/pre-resignations`, data)
  },

  updatePreResignationProposal (id, data) {
    return httpErpNew.post(`/hr-order/pre-resignations/${id}`, data)
  },

  unexpectedResignation (id, data) {
    return httpErpNew.post(`/hr-order/pre-resignations/${id}/unexpected-resign`, data)
  }
  // End of Api đề xuất hỗ trợ gắn bó
}
