import httpErp from 'infrastructures/api-erp-http'

export default {
  getAdministrativeArea (data) {
    return httpErp.get('ErpCommon/getAdministrativeArea', {params: data})
  },

  getHospitals (data) {
    return httpErp.get('ErpCommon/getHospitals', {params: data})
  },

  getEthnic (data) {
    return httpErp.get('ErpCommon/getEthnic', {params: data})
  }
}
