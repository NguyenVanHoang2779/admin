import httpErp from 'infrastructures/api-erp-http'

export default {
  get (data) {
    return httpErp.get('/empPositions/getListPositions', {'params': data})
  },

  getConfigGroupType () {
    return httpErp.get('/empPositions/getConfigGroupType')
  },

  updatePosition (data) {
    return httpErp.post('/empPositions/updatePosition', data)
  },

  createPosition (data) {
    return httpErp.post('/empPositions/createPosition', data)
  },

  searchPosition (data) {
    return httpErp.get('/empPositions/searchPosition', {'params': data})
  }
}
