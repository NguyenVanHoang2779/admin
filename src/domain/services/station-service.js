import http from 'infrastructures/api-http'

export default {
  getAllStation (params = null) {
    return http.get('AdStations/getAllStation', {'params': params})
  },

  getStationListByProvinceId (data) {
    return http.get('AdStations/getStationListByProvinceId', {'params': data})
  },

  getStationListByRegionId (data) {
    return http.get('AdStations/getStationListByRegionId', {'params': data})
  },

  getAllStationByProvinceIds: function (params) {
    return http.get('AdStations/getAllStationByProvinceIds', {'params': params})
  },

  getAllStationByIds: function (params) {
    return http.get('AdStations/getAllStationByIds', {'params': params})
  },

  getAllStationByDistrictIds: function (params) {
    return http.get('AdStations/getAllStationByDistrictIds', {'params': params})
  },

  getListStationByProvinceIds: function (params) {
    return http.get('AdStations/getListStationByProvinceIds', {'params': params})
  },

  getStationInfo (data) {
    return http.get('AdStations/getStationInfo', {params: data})
  }
}
