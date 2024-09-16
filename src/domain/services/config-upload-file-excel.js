import http from './../../infrastructures/api-http'

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
  getFileConfigExcel () {
    return http.get('AdBags/getSampleConfigBag')
  }
}
