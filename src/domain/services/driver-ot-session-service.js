import httpErp from 'infrastructures/api-erp-http'

export default {
  getListProvinces () {
    return httpErp.post('erpDriverOtSession/getListProvince')
  },
  getListStations (data) {
    return httpErp.post('erpDriverOtSession/getListStations', data)
  },
  searchDriverOtSession (data) {
    return httpErp.post('erpDriverOtSession/searchDriverOtSession', data)
  },
  updateStatusRecord (data) {
    return httpErp.post('erpDriverOtSession/updateDriverOtSession', data)
  },
  showReviewHistory (data) {
    return httpErp.post('erpDriverOtSession/showReviewHistory', data)
  }
}
