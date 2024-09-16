import httpErpNew from '../../infrastructures/api-erp-new'

export default {
  getTickets (data) {
    return httpErpNew.get('hr-care/get-ticket', { params: data })
  },
  createNote (data) {
    return httpErpNew.post('hr-care/insert-log', data)
  },
  getTicketTypes () {
    return httpErpNew.get('hr-care/get-ticket-types')
  },
  completeTicket (data) {
    return httpErpNew.post('hr-care/complete-ticket', data)
  },
  getLogs (data) {
    return httpErpNew.get('hr-care/get-logs', { params: data })
  }
}
