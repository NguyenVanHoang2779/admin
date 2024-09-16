import httpErp from 'infrastructures/api-erp-http'

export default {
  getAll (data) {
    return httpErp.get('/ErpEmpCoupon/getListCouponSalary', {'params': data})
  },

  get (data) {
    return httpErp.get('/ErpEmpCoupon/getCouponSalaryById', {'params': data})
  },

  add (data) {
    return httpErp.post('/ErpEmpCoupon/addCouponSalary', data)
  },

  update (data) {
    return httpErp.post('/ErpEmpCoupon/updateCouponSalary', data)
  },

  remove (data) {
    return httpErp.post('/ErpEmpCoupon/removeCouponSalary', data)
  },

  exportSalaryByCouponId (data) {
    return httpErp.get('/ErpEmpCoupon/exportSalaryByCouponId', {'param': data})
  }
}
