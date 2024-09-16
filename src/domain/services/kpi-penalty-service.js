import httpErp from 'infrastructures/api-erp-http'

export default {
  // API lấy dữ liệu phạt
  apiGetDataPenalties (data) {
    return httpErp.get('penalties/apiGetDataPenalties', {'params': data})
  },
  // API lưu dữ liệu thay đổi
  apiSavePenaltyData (data) {
    return httpErp.post('penalties/apiSavePenaltyData', data)
  },
  apiGetDataPenaltyLogs (data) {
    return httpErp.get('penalties/apiGetDataPenaltyLogs', {'params': data})
  },
  apiGetListTypes (data) {
    return httpErp.get('penalties/apiGetListTypes', {'params': data})
  },
  apiGetAllGroups (data) {
    return httpErp.get('/penalties/apiGetAllGroup', {'params': data})
  },
  apiGetAllPositions (data) {
    return httpErp.get('/penalties/apiGetAllPosition', {'params': data})
  },
  apiGetListBonus (data) {
    return httpErp.get('penalties/apiGetListBonus', {'params': data})
  },
  apiGetDataBonus (data) {
    return httpErp.get('penalties/apiGetDataBonus', {'params': data})
  },
  apiGetManagerDriverRentTruck (data) {
    return httpErp.get('penalties/getManageDriverRentTruck', {'params': data})
  }
}
