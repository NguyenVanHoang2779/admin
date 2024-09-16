import httpErp from 'infrastructures/api-erp-http'

export default {

  getListStaffs (data) {
    return httpErp.get('ErpStaffReview/getListStaffs', {'params': data})
  },

  getStaffReviews (data) {
    return httpErp.get('ErpStaffReview/getStaffReviews', {'params': data})
  },

  addStaffReview (data) {
    return httpErp.post('ErpStaffReview/addStaffReview', data)
  }
}
