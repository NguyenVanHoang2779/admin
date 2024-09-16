import http from 'infrastructures/api-http'

export default {
  getListProvinces () {
    return http.get('AdPostOfficesConfig/getListProvinces')
  },
  getListStations () {
    return http.get('AdPostOfficesConfig/getListStations')
  },
  getListPostOfficesConfigs (dataSend) {
    return http.get('AdPostOfficesConfig/getListPostOfficesConfigs', {'params': dataSend})
  },
  savePostOfficesConfigs (saveData) {
    return http.post('AdPostOfficesConfig/savePostOfficesConfigs', saveData)
  },
  removePostOfficesConfig (id) {
    return http.get('AdPostOfficesConfig/removePostOfficesConfig', {'params': {id: id}})
  }
}
