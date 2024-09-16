import http from 'infrastructures/api-http'

export default {
  getCod (data) {
    return http.get('cods/searchCod', {'params': data})
  },
  getShop (data) {
    return http.get('services/autocompleteShopV2', {'params': data})
  },
  getStation (data) {
    return http.get('services/autocompleteStationByTypePostOfficeAndStation', {'params': data})
  },
  search (data) {
    return http.get('AdPostOffices/getFrageImages', {'params': data})
  },
  edit (data) {
    return http.post('AdPostOffices/reportFrageImages', data)
  }
}
