import http from 'infrastructures/api-http'

export default {
  getStation (data) {
    return http.get('AdServices/autocompleteStationByTypePostOfficeAndStationV2', {'params': data})
  },
  getShop (data) {
    return http.get('AdServices/autocompleteShopV3', {'params': data})
  },
  search (data) {
    return http.get('FFM/search', {'params': data})
  },
  getImageGS (data) {
    return http.post('FFM/getImageGS', data)
  },
  edit (data) {
    return http.post('FFM/edit', data)
  },
  delete (data) {
    return http.post('FFM/delete', data)
  }
}
