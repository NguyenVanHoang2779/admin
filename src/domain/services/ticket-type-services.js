import httpErp from 'infrastructures/api-erp-http'

export default {
  getAllTicketTypes () {
    return httpErp.get('/sos/getListTypes')
  },
  getChildTicketTypes (data) {
    return httpErp.get('/sos/getChildListTypes/', {'params': data})
  },
  createTicketType (data) {
    return httpErp.post('/sos/createTicketTypes', data)
  },
  editTicketType (data) {
    return httpErp.put('/sos/editTicketTypes', data)
  },
  deleteTicketType (data) {
    return httpErp.delete('/sos/deleteTicketTypes', { params: data })
  },
  getListUserHandleTicketType (data) {
    return httpErp.get('/sos/getListUserHandleTicketType', {'params': data})
  },
  getListGroupHandleTicketType (data) {
    return httpErp.get('/sos/getListGroupHandleTicketType', {'params': data})
  },
  getListGroupTicketType () {
    return httpErp.get('/sos/getListGroupTicketType')
  },
  addHandleTicketType (data) {
    return httpErp.post('/sos/addHandleTicketType', data)
  },
  deleteHandleTicketType (data) {
    return httpErp.post('/sos/deleteHandleTicketType', data)
  },
  getListUserViewTicket () {
    return httpErp.get('/sos/getListUserViewTicket')
  },
  deleteUserViewTicket (data) {
    return httpErp.post('/sos/deleteUserViewTicket', data)
  },
  addUserViewTicket (data) {
    return httpErp.post('/sos/addUserViewTicket', data)
  },
  updateHandleTicketType (data) {
    return httpErp.post('/sos/updateHandleTicketType', data)
  }
}
