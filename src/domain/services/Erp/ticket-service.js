import httpHrmTicket from 'infrastructures/api-hrm-ticket'

const hrOrderApiPrefix = 'hrorder/api/union/'

export default {
  getCountSosTicket (data) {
    return httpHrmTicket.get('/sos/api/need-handle/get-count', { params: data })
  },
  getCountClosingShiftSos (data) {
    return httpHrmTicket.get('/sos/api/closing-shift/get-count', { params: data })
  },
  getUnionTypes () {
    return httpHrmTicket.get(hrOrderApiPrefix + 'type/list')
  },
  getUnionOffers (data) {
    return httpHrmTicket.get(hrOrderApiPrefix + 'list', { params: data })
  },
  getUnionOffer (data) {
    return httpHrmTicket.get(hrOrderApiPrefix + 'detail', { params: data })
  },
  changeStatusUnionOffer (data) {
    return httpHrmTicket.post(hrOrderApiPrefix + 'admin/change-status', data)
  },
  getLogs (data) {
    return httpHrmTicket.get(hrOrderApiPrefix + 'get-log', { params: data })
  },
  getStatisticUnion () {
    return httpHrmTicket.get(hrOrderApiPrefix + 'count')
  },
  createUnionOffer (data) {
    return httpHrmTicket.post(hrOrderApiPrefix + 'admin/create', data)
  }
}
