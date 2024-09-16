import httpErp from 'infrastructures/api-erp-http'

export default {
  getListMedals (data) {
    return httpErp.get('ErpMedal/getListMedals', {params: data})
  },

  createProfileMedal (data) {
    return httpErp.post('ErpMedal/createProfileMedal', data)
  },

  deleteProfileMedal (data) {
    return httpErp.post('ErpMedal/deleteProfileMedal', data)
  },

  getProfileInfo (data) {
    return httpErp.get('ErpMedal/getProfileInfo', {params: data})
  },

  getProfileMedals (data) {
    return httpErp.get('ErpMedal/getProfileMedals', {params: data})
  }
}
