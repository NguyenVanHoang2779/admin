import http from 'infrastructures/api-http'
import httpG3PL from 'infrastructures/api-g3pl-http'

export default {
  getListStopPointByTerm (data) {
    return http.get('AdServices/autocompleteStopPointsV2', {'params': data})
  },
  getListOrg (data) {
    return httpG3PL.get('listOrg', {'params': data})
  },
  getListTypeTrip () {
    return httpG3PL.get('listType')
  },
  getListWeight () {
    return httpG3PL.get('listWeight')
  },
  getReasonBooking () {
    return httpG3PL.get('listReasonBooking')
  },
  booking (data) {
    return httpG3PL.post('createBooking', data)
  },
  getTemplateByName (data) {
    return httpG3PL.get('getTemplateByNameId', {'params': data})
  },
  getStopPointByTemplateId (data) {
    return httpG3PL.get('listTemplatePoint', {'params': data})
  },
  validateStopPoint (data) {
    return httpG3PL.post('validateStopPoint', data)
  }
}
