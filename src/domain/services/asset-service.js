import httpErp from 'infrastructures/api-erp-http'

export default {
  getRcCode () {
    return httpErp.get('ErpCompanyProfile/getAllRcCode')
  },
  getIdentifierCode (data) {
    return httpErp.get('ErpCompanyProfile/getIdentifierCode', { 'params': data })
  },
  getIdentifierCodeTruckRent (data) {
    return httpErp.get('ErpCompanyProfile/getIdentifierCodeTruckRent', { 'params': data })
  },
  getByIdentifierCode (data) {
    return httpErp.get('ErpCompanyProfile/getByIdentifierCode', { 'params': data })
  },
  stopRcTruck (data) {
    return httpErp.post('ErpCompanyProfileExtra/stopRcTruck', data)
  },
  revertRc (data) {
    return httpErp.post('ErpCompanyProfileExtra/revertRc', data)
  },
  deleteRcTruck (data) {
    return httpErp.post('ErpCompanyProfileExtra/deleteRcTruck', data)
  }
}
