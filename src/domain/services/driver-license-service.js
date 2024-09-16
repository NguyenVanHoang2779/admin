import httpErp from 'infrastructures/api-erp-http'

export default {
  getDriverLicenseOfProfile: data => httpErp.get('/ErpDriverLicense/getDriverLicenseOfProfile', {params: data})
}
