import http, {handleResponse} from '../../infrastructures/api-http'

export default class SmartLockerService {
  /**
   * Lấy danh sách các cabinets có trong kho
   * @param params
   * @returns {Promise<*|undefined>}
   */
  static getCabinets (params) {
    return handleResponse(http.get('/AdSmartLocker/getCabinet', {params}), 'data')
  }

  /**
   * Lấy danh sách các carts được gán vào ngăn tủ
   * @param cellId
   * @returns {Promise<*|undefined>}
   */
  static getCartsOfCell (cellId) {
    return handleResponse(http.get('/AdSmartLocker/getCartsOfCell?cell_id=' + cellId, 'data'))
  }

  /**
   * Lưu lại các carts được gán vào mỗi ngăn tủ
   * @param cellId
   * @param cartIds
   * @returns {Promise<*|undefined>}
   */
  static saveCartsOfCell (cellId, cartIds) {
    return handleResponse(http.post('/AdSmartLocker/saveLockerCellCart', {
      cell_id: cellId,
      cart_ids: cartIds
    }), 'data')
  }
}
