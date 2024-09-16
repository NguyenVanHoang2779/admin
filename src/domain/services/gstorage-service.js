import httpErpNew from 'infrastructures/api-erp-new'

export default {
  getOriginFile (data) {
    return httpErpNew.get('storage/get-origin-file', {'params': data})
  }
}
