import httpErp from 'infrastructures/api-erp-http'

export default {
  getParkingOrderList (data) {
    return httpErp.get('ErpParkingStation/getParkingOrderList', {'params': data})
  }
}
