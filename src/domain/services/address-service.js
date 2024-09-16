import http from 'infrastructures/api-http'

export default {
  /**
   * API get list regions
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getListRegions () {
    return http.get('/AdSearchStaff/getRegionList')
  },

  getListProvinceByRegions (regionId) {
    let data = { 'region_id': regionId }
    return http.get('/AdSearchStaff/getProvincesByRegion', {'params': data})
  },

  getAllProvince () {
    return http.get('AdAddresses/getListRealProvince')
  },

  getProvinceByRegionId (data) {
    return http.get('AdAddresses/getProvinceByRegionId', {'params': data})
  },

  getDistrictByProvinceId (data) {
    return http.get('AdAddresses/getListRealDistrictByProvinceId', {'params': data})
  },

  getDistrictByProvinceIdV2 (data) {
    return http.get('AdAddresses/getListRealDistrictByProvinceIdV2', {'params': data})
  },

  getSubDistrictByDistrictId (data) {
    return http.get('AdAddresses/getListRealSubDistrictByDistrictId', {'params': data})
  },

  getProvincesByRegionHr (data) {
    return http.get('AdAddresses/getProvincesByRegionHr', {'params': data})
  },

  getProvincesByRegion (data) {
    return http.get('AdAddresses/getProvincesByRegion', {'params': data})
  },

  getDistrictByID (data) {
    return http.get('AdAddresses/getDistrictByID', {'params': data})
  },

  getWardByDistrictByID (data) {
    return http.get('AdAddresses/getWardByDistrictID', {'params': data})
  },

  getDistrictAddressByProvinceId (data) {
    return http.get('AdAddresses/getDistrictsByProvinceId', {'params': data})
  },

  getSubDistrictAddressByDistrictId (data) {
    return http.get('AdAddresses/getSubDistrictsByDistrictId', {'params': data})
  }
}
