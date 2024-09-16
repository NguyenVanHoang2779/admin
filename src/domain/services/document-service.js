import httpErp from 'infrastructures/api-erp-http'

export default {
  getAll (data) {
    return httpErp.get('/document/getListDocument', {'params': data})
  },
  get (data) {
    return httpErp.get('/document/getDocumentById', {'params': data})
  },
  add (data) {
    return httpErp.post('/document/addDocument', data)
  },
  update (data) {
    return httpErp.post('/document/updateDocument', data)
  },
  remove (data) {
    return httpErp.post('/document/removeDocument', data)
  },
  download (data) {
    return httpErp.post('/document/downloadDocument', data)
  },
  apiGetListDocumentOther (data) {
    return httpErp.get('document/apiGetListDocumentOther', {'params': data})
  },
  getListDocumentType (data) {
    return httpErp.get('document/getListDocumentType', {'params': data})
  },
  addDocumentType (data) {
    return httpErp.post('document/addDocumentType', data)
  },
  deleteDocumentType (data) {
    return httpErp.post('document/deleteDocumentType', data)
  },
  apiGetRegions (data) {
    return httpErp.get('document/apiGetRegions', {'params': data})
  },
  apiGetProvinces (data) {
    return httpErp.get('document/apiGetProvinces', {'params': data})
  },
  apiGetDistricts (data) {
    return httpErp.get('document/apiGetDistricts', {'params': data})
  },
  apiGetStations (data) {
    return httpErp.get('document/apiGetStations', {'params': data})
  },
  checkPermissionFull (data) {
    return httpErp.get('document/checkPermissionFull', {'params': data})
  },
  checkPermissionView (data) {
    return httpErp.get('document/checkPermissionView', {'params': data})
  },
  updateUserManage (data) {
    return httpErp.post('document/updateUserManage', data)
  },
  getListUserManage (data) {
    return httpErp.get('document/getListUserManage', data)
  },
  apiGetListUserMains (data) {
    return httpErp.get('document/apiGetListUserMains', {'params': data})
  }
}
