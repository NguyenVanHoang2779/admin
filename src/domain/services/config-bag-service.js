import http from 'infrastructures/api-http'

export default {
  async handleResponse (apiRequest, dataKey) {
    dataKey = dataKey || 'data'
    try {
      const apiResponse = await apiRequest
      if (apiResponse.data && Object.prototype.toString.call(apiResponse.data) !== '[object Object]') {
        throw new Error('Server trả về không đúng định dạng')
      }

      if (apiResponse.data.success !== undefined && !apiResponse.data.success) {
        const errorMessage = apiResponse.data.message || apiResponse.data.msg || 'Đã có lỗi xảy ra khi gọi API'
        if (apiResponse.data.message) {
          throw new Error(errorMessage.toString())
        }
      }

      if (dataKey && Array.isArray(apiResponse.data)) {
        throw new Error('Server trả về không đúng định dạng')
      }

      return apiResponse.data[dataKey]
    } catch (reason) {
      if (reason instanceof Error) {
        throw reason.toString()
      }
      if (Object.prototype.toString.call(reason) === '[object Object]' && reason.data && reason.data.message) {
        throw reason.data.message
      }
      throw reason.toString()
    }
  },
  getStation (data) {
    return http.get('AdServices/autocompleteStationByTypePostOfficeAndStationV2', {'params': data})
  },
  searchConfigBag (data) {
    return http.get('AdBags/searchConfigBag', {'params': data})
  },
  getBagTypeConfig () {
    return http.get('AdBags/getBagTypeConfig')
  },
  getListProvinces () {
    return http.get('AdServices/getListProvince')
  },
  deleteConfigBag (confiId) {
    return http.post('AdBags/removeConfigBag', {id: confiId})
  },
  searchUser (params) {
    return this.handleResponse(http.get('AdServices/autocompleteUsers', {params}))
  }
}
