import httpErp from 'infrastructures/api-erp-http'
export default {
  updateHandler: params => httpErp.post('ErpStaffWorkHandler/updateHandler', params)
}
