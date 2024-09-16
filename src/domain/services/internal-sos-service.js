// import http from 'infrastructures/api-http'
import httpErp from 'infrastructures/api-erp-http'

export default {
  apiGetAllProvince (data) {
    return httpErp.get('sos/apiGetAllProvince', {'params': data})
  },
  apiGetAllStation (data) {
    return httpErp.get('sos/apiGetAllStation', {'params': data})
  },
  apiGetListUsers (data) {
    return httpErp.get('sos/apiGetListUsers', {'params': data})
  },
  apiGetAllReasonTicket (data) {
    return httpErp.get('sos/apiGetAllReasonTicket', {'params': data})
  },
  apiGetRelationParentToChild (data) {
    return httpErp.get('sos/apiGetRelationParentToChild', {'params': data})
  },
  apiGetTickets (data) {
    return httpErp.get('sos/apiGetListTickets', {'params': data})
  },
  apiExportTickets (data) {
    return httpErp.get('sos/apiExportTickets', {'params': data})
  },
  apiGetInfoUserLogin () {
    return httpErp.get('sos/apiGetInfoUserLogin')
  },
  apiInsertLogTicket (data) {
    return httpErp.post('sos/apiInsertLogTicket', data)
  },
  apiRemoveUserHandleTicket (data) {
    return httpErp.post('sos/apiRemoveUserHandleTicket', data)
  },
  apiAddUserHandleTicket (data) {
    return httpErp.post('sos/apiAddUserHandleTicket', data)
  },
  apiChangeStatusTicket (data) {
    return httpErp.post('sos/apiChangeStatusTicket', data)
  },
  apiGetListUsersHandleTicket (data) {
    return httpErp.get('sos/apiGetListUsersHandleTicket', {'params': data})
  },
  apiChangeTypeTicket (data) {
    return httpErp.post('sos/apiChangeTypeTicket', data)
  },
  apiGetCountTicketGroupByType (data) {
    return httpErp.get('sos/apiGetCountTicketGroupByType', {'params': data})
  },
  apiChangeStatusTicketUser (data) {
    return httpErp.post('sos/apiChangeStatusTicketUser', data)
  },
  addComment (data) {
    return httpErp.post('sos/comment', data)
  }
}
