import http from 'infrastructures/api-erp-http'

export default {
  getProvinceFromRegion (data) {
    return http.get('/salaryDrivers/apiGetProvinces', {'params': data})
  },
  getDistrictFromProvince (data) {
    return http.get('/salaryDrivers/apiGetDistricts', {'params': data})
  },
  getStreetFromDistrict (data) {
    return http.get('/salaryDrivers/apiGetStreet', {'params': data})
  },
  apiCreateLotrinhKho (data) {
    return http.post('/salaryDrivers/apiCreateLotrinhKho', data)
  },
  apiUpdateLotrinhKho (data) {
    return http.post('/salaryDrivers/apiUpdateLotrinhKho', data)
  },
  apiSearchLotrinhKho (data) {
    return http.get('/salaryDrivers/apiGetLoTrinhKho', {'params': data})
  },
  apiRemoveLoTrinhKho (data) {
    return http.post('/salaryDrivers/apiRemoveLoTrinhKho', data)
  },
  apiCreateConfMinWageDriver (data) {
    return http.post('/salaryDrivers/apiCreateConfMinWageDriver', data)
  },
  apiGetConfMinWageDriver (data) {
    return http.get('/salaryDrivers/apiGetConfMinWageDriver', {'params': data})
  },
  apiUpdateConfMinWageDriver (data) {
    return http.post('/salaryDrivers/apiUpdateConfMinWageDriver', data)
  },
  apiRemoveConfMinWageDriver (data) {
    return http.post('/salaryDrivers/apiRemoveConfMinWageDriver', data)
  },
  apiGetProvRentTruckConfig (data) {
    return http.get('/salaryDrivers/getListRentTruckConfigByProv', {'params': data})
  },
  getListCompanies () {
    return http.get('/salaryDrivers/apiGetCompanyRentTruck')
  },
  apiCreateProvRentTruck (data) {
    return http.post('/salaryDrivers/apiCreUpdateRentTruckConfig', data)
  },
  apiUpdateProvRentTruck (data) {
    return http.post('/salaryDrivers/apiCreUpdateRentTruckConfig', data)
  },
  apiDeleteProvRentTruck (data) {
    return http.post('/salaryDrivers/apiDeleteRentTruckConfig', data)
  },
  getListNameRentRoute (data) {
    return http.get('/rentTruckConfig/getListRentRouteNameByCompany', {'params': data})
  },
  apiGetLogUploadFileConfig (data) {
    return http.get('/rentTruckConfig/getLogUploadFileConfig', {'params': data})
  },
  apiUploadConfig (data) {
    return http.post('/rentTruckConfig/uploadRentTruckConfig', data)
  },
  downloadFileTemplate () {
    return http.get('/rentTruckConfig/downLoadFileTemplate')
  },
  getFileTemplate (data) {
    return http.get('/rentTruckConfig/getFileTemplate', {'params': data})
  },
  apiUploadFileTemplate (data) {
    return http.post('/rentTruckConfig/uploadFileTemplates', data)
  },
  removeFileAndDataUpload (data) {
    return http.get('/rentTruckConfig/removeFileAndDataUpload', {'params': data})
  },
  checkUserCanConfig (data) {
    return http.get('/rentTruckConfig/checkUserCanConfig', {'params': data})
  },
  getUserInfo () {
    return http.get('AdUsers/getUserInfo')
  }
}
