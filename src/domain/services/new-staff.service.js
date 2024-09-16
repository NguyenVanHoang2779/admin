import httpErp from 'infrastructures/api-erp-http'

export default {

  canAccess () {
    return httpErp.get('new-staff/canAccess')
  },

  // get all new staff tags
  getTags (params) {
    return httpErp.get('new-staff/getTags', {params})
  },

  // create new staff tag
  createTag (data) {
    return httpErp.post('new-staff/createTag', data)
  },

  // delete new staff tag
  deleteTag (data) {
    return httpErp.post('new-staff/deleteTag', data)
  },

  // get tags of user
  getUserTags (data) {
    return httpErp.post('new-staff/getUserTags', data)
  },

  // attach user tag
  attachTag (data) {
    return httpErp.post('new-staff/attachTag', data)
  },

  // detach user tag
  detachTag (data) {
    return httpErp.post('new-staff/detachTag', data)
  },

  getUserNoteInClass (data) {
    return httpErp.post('new-staff/getUserNoteInClass', data)
  },

  setUserNoteInClass (data) {
    return httpErp.post('new-staff/setUserNoteInClass', data)
  },

  addNoteEducate (data) {
    return httpErp.post('new-staff/addNoteEducate', data)
  },

  getUserPhoneNumber (params) {
    return httpErp.get('new-staff/getUserPhoneNumber', {params})
  },

  createDirectChat (params) {
    return httpErp.get('message/createDirectChat', {params})
  }

}
