import http from 'infrastructures/api-http'
import {handleResponse} from '../../infrastructures/api-http'

export default {
  /**
   * API get list regions
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  addCart (data) {
    return http.post('AdCartsV2/addCart', data)
  },
  editCart (data) {
    return http.post('AdCartsV2/edit', data)
  },
  getCartById (params) {
    return http.get('AdCartsV2/getCartInfo', {params: params})
  },
  searchManageLine (params) {
    return http.get('AdCartsV2/searchCarts', {params: params})
  },
  getAddressByType (data) {
    return http.get('AdCartsV2/getListAddressWithCondition', {'params': data})
  },
  getAddress4 (data) {
    return http.get('AdCartsV2/searchSpecialAddressesLv4', {'params': data})
  },
  getAddress5 (data) {
    return http.post('AdCartsV2/getAddressLv5', data)
  },
  getProvince (data) {
    return http.get('AdCartsV2/getListAddressWithCondition', {'params': data})
  },
  getStationCarts (data) {
    return http.get('AdCartsV2/getListStationByProvinceIds', {'params': data})
  },
  getLine (data) {
    return http.get('AdCartsV2/getListCartWithCondition', {'params': data})
  },
  getModule (data) {
    return http.get('AdCartsV2/getListModuleByStationAndTerm', {'params': data})
  },
  getShopCarts (data) {
    return http.get('AdCartsV2/getListShopWithCondition', {'params': data})
  },
  getInfoShopCart (data) {
    return http.get('carts/getPickAddressByShopId', {'params': data})
  },
  getCartParent (data) {
    return http.get('carts/autoSearchAllVisibleCartStationV2', {'params': data})
  },
  getCartChild (data) {
    return http.get('', {'params': data})
  },
  getPostOffice (data) {
    return http.get('AdCartsV2/getListStationByProvinceIds', {'params': data})
  },
  getDistrict (data) {
    return http.get('AdCartsV2/getListAddressWithCondition', {'params': data})
  },
  getWard (data) {
    return http.get('AdCartsV2/getListAddressWithCondition', {'params': data})
  },
  getStreet (data) {
    return http.get('AdCartsV2/getListAddressWithCondition', {'params': data})
  },
  getCod (data) {
    return http.get('services/autocompleteCod', {'params': data})
  },
  getConfigShop (data) {
    return http.get('AdCartsV2/getCartShops', {'params': data})
  },
  getUserInfo () {
    return http.get('AdUsers/getUserInfo')
  },
  saveConfigShop (params) {
    return http.post('AdCartsV2/saveCartShops', params)
  },
  getCartServices (data) {
    return handleResponse(http.get('AdCartsV2/getCartServices', {params: data}))
  },
  getAllServiceTypes () {
    return handleResponse(http.get('AdCartsV2/getAllServiceTypes'))
  },

  /**
   * Lấy thông tin config ngày trong tuần
   */
  getDayOfWeekDefault () {
    return handleResponse(http.get('cod-weekly-support/getDayOfWeekDefault'))
  },

  /**
   * Lấy thông tin config cod hỗ trợ
   */
  getConfigCodWeeklySupport (data) {
    return handleResponse(http.get('cod-weekly-support/getConfigCodWeeklySupport', {params: data}))
  },

  /**
   * Lấy thông tin config capacity của cod hỗ trợ
   */
  getCodCapacityByCodId (data) {
    return handleResponse(http.get('cod-weekly-support/getCodCapacityByCodId', {params: data}))
  },

  /**
   * Lấy thông tin config capacity của cod hỗ trợ
   */
  saveConfigCodWeeklySupport (cartId, data) {
    return handleResponse(http.post(`cod-weekly-support/saveConfigCodWeeklySupport?cart_id=${cartId}`, data), 'data')
  },

  /**
   * Lấy thông tin shop by cart
   * @since OSNV-3644
   */
  getShopsByCartForCartScripts (data) {
    return handleResponse(http.get(`AdCartScript/getShopByCart`, {'params': data}, data), 'data')
  },
  getScripts (data) {
    return handleResponse(http.get(`AdCartScript/getScripts`, {'params': data}, data), 'data')
  },
  deleteScript (data) {
    return handleResponse(http.post(`AdCartScript/deleteScript`, data), 'message')
  },
  saveScript (data) {
    return handleResponse(http.post(`AdCartScript/saveScript`, data), 'data')
  },

  /**
   * Config kịch bản giao hàng, check khách
   */
  getCartSessionScript (data) {
    return handleResponse(http.get(`AdCartScript/getCartSessionScript`, {'params': data}, data), 'data')
  },
  saveCodCapacityScript (data) {
    return handleResponse(http.post(`AdCartScript/saveCodCapacityScript`, data))
  },
  deleteCodCapacityScript (data) {
    return handleResponse(http.post(`AdCartScript/deleteCodCapacityScript`, data))
  },
  getCodCapacityScript (data) {
    return handleResponse(http.get(`AdCartScript/getCodCapacityScript`, {'params': data}, data), 'data')
  },
  deleteCartSessionScript (data) {
    return handleResponse(http.post(`AdCartScript/deleteCartSessionScript`, data))
  },
  saveCartSessionScript (data) {
    return handleResponse(http.post(`AdCartScript/saveCartSessionScript`, data))
  },
  searchShop (data) {
    return http.get('shops/autocomplete', {'params': data}, data)
  },
  getPickAddress (data) {
    return http.post('AdCartsV2/getPickingAddressShop', data)
  },
  searchPickAddress (params) {
    return http.get('AdCartsV2/searchShopByCode', {params: params})
  },
  getGlobalStationSupportCartPicking () {
    return http.get('AdCartsV2/getGlobalStationSupportCartPicking')
  }
}
