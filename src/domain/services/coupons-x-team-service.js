import httpErp from 'infrastructures/api-erp-http'

export default {
  getAllProvinces () {
    return httpErp.get('couponsXTeam/getAllProvinces')
  },

  getAllDistricts (data) {
    return httpErp.post('couponsXTeam/getAllDistricts', data)
  },

  getAllCoupons () {
    return httpErp.get('couponsXTeam/getListCoupons')
  },

  loadCouponsDistricts (data) {
    return httpErp.post('couponsXTeam/getAllCoupons', data)
  },

  addCouponsDistricts (data) {
    return httpErp.post('couponsXTeam/addCouponsDistricts', data)
  },

  deleteCouponDistrict (data) {
    return httpErp.post('couponsXTeam/deleteCouponDistrict', data)
  },

  updateDistrict (data) {
    return httpErp.post('couponsXTeam/updateDistrict', data)
  },

  addCoupon (data) {
    return httpErp.post('couponsXTeam/addCoupon', data)
  },

  deleteCoupon (data) {
    return httpErp.post('couponsXTeam/deleteCoupon', data)
  },

  updateCoupon (data) {
    return httpErp.post('couponsXTeam/updateCoupon', data)
  }
}
