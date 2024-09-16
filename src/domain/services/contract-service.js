import http from 'infrastructures/api-http'

export default {
  /**
   * API fast create contract
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  fastCreateContract (data) {
    return http.post('AdContract/createDefaultContract', data)
  },

  getInitSalary (data) {
    return http.get('AdContract/getInitSalary', {'params': data})
  },

  exportContract (data) {
    return http.get('AdContract/getContract', {'params': data})
  },

  getPositionDetail (data) {
    return http.get('AdPositionDetail/getPostionDetail', {'params': data})
  },

  updatePositionDetail (data) {
    return http.post('AdPositionDetail/updatePositionDetail', data)
  },

  // Xóa HĐ
  deleteContract (data) {
    return http.delete('AdContract/deleteContract', { params: data })
  },

  // Xóa phụ lục
  deleteAppendix (data) {
    return http.delete('AdContract/deleteAppendix', { params: data })
  },

  // Cập nhật trạng thái HĐ (active, draft, disabled)
  updateStatusContract (data) {
    return http.post('AdContract/updateStatusContract', data)
  },

  createChatForSigning (data) {
    return http.post('AdContract/createChatForSigning', data)
  },

  genAppendixNumber (data) {
    return http.post('AdContract/genAppendixNumber', data)
  },

  /**
   * API create appendix
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  createAppendix (data) {
    return http.post('AdContract/createAppendix', data)
  },

  /**
   * API get detail Appendix
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getDetailAppendix (data) {
    return http.get('AdContract/getDetailAppendix', {'params': data})
  },

  /**
   * API get list Appendix of Contract
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getListAppendixOfContract (data) {
    return http.get('AdContract/getListAppendixOfContract', {'params': data})
  },

  /**
   * API get appendix of constract
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getAppendixOfContract (data) {
    return http.get('AdContract/getValidAppendixOfContract', {'params': data})
  },

  updateAppendix (data) {
    return http.post('AdContract/updateAppendix', data)
  },

  // lấy thông tin thanh lý HĐ
  getLiquidateInfo (data) {
    return http.get('AdContract/getLiquidateInfo', {params: data})
  },

  // Cập nhật thông tin thanh lý HĐ
  updateLiquidateInfo (data) {
    return http.post('AdContract/updateLiquidateInfo', data)
  },

  // kiểm tra quyền thao tác trên HĐ
  getPermissionOnContract (data) {
    return http.get('AdContract/getPermissionOnContract', {params: data})
  },

  // API get contract detail
  getContractDetail (data) {
    return http.get('AdContract/getContractDetail', {params: data})
  }
}
