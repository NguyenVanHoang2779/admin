import http, {handleResponse} from '../../infrastructures/api-http'
import erpHttpClient from '../../infrastructures/api-erp-http'
import CacheEngine from '../../infrastructures/cache-engine'

export default {
  getCarts (data) {
    return http.get('services/autocompleteCartV2', {'params': data})
  },
  searchListCod (data) {
    return http.post('cod-setting/listCodByCondition', data)
  },
  searchCod (data) {
    return http.get('services/autocompleteCODV2', {'params': data})
  },

  /** Lấy config của COD */
  getCodSetting (codId) {
    return handleResponse(http.get('cod-settings/getCodSettings', {params: {user_id: codId}}), 'data')
  },

  /** Lưu lại phần setting của cod */
  saveCodSetting (codId, data) {
    return handleResponse(http.post(`cod-settings/saveCodSettings?user_id=${codId}`, data), 'message')
  },

  /** Search địa chỉ cấp 5 từ địa chỉ cấp 4 */
  getAddress5 (data) {
    return handleResponse(http.post('cod-settings/getAddressLv5', data), 'data')
  },

  /** Lấy log thay đổi của stop point */
  getDeliverySettingLog (stopPointId) {
    return handleResponse(http.get('cod-settings/getStopPointLog', {
      params: {
        stop_point_id: stopPointId
      }
    }), 'data')
  },

  /** Lấy thông tin tính toán tọa độ điểm */
  calculateDeliveringPointCoordinates (points) {
    return handleResponse(http.post('cod-settings/calculatePointCoordinates', {points: points}), 'data')
  },

  /** Lấy thông tin Config PKBus của COD */
  getAllConfigPKBus (userId) {
    return handleResponse(erpHttpClient.get('checkin-cod/getAllConfigPkbus', {
      params: {
        objectType: 2,
        objectId: userId
      }
    }), 'data')
  },

  /** Lấy thông tin Log Config PKBus của COD */
  getConfigPKBusLog (userId) {
    return handleResponse(erpHttpClient.get('checkin-cod/getLogByUser', {
      params: {
        userId: userId
      }
    }), 'data')
  },

  /** Lấy config điểm dừng của PK */
  getPickingSettingRoute (codId) {
    return handleResponse(http.get('cod-settings/getCodRoute', {params: {user_id: codId}}), 'data')
  },

  /** Lưu lại Cấu hình lộ trình của PK */
  saveConfigPkRoute (codId, data) {
    return handleResponse(http.post(`cod-settings/saveCodRoutes?user_id=${codId}`, data), 'message')
  },

  /** Lấy danh sách các điểm lấy hàng của shop. Dùng trong config Pk */
  getPickingAddressList (userId) {
    return handleResponse(http.get('cod-settings/getAllPickAddressByCoD', {params: {user_id: userId}}), 'data')
  },

  /** Thời gian config lấy hàng theo pick_address_id . Dùng trong config Pk */
  getPickTimeByPickAddress (pickAddressIds) {
    const cache = new CacheEngine('session')
    const cacheKeyPrefix = 'ManageListCodService.getPickTimeByPickAddress:'

    return cache.rememberByIds(pickAddressIds, cacheKeyPrefix, 30, (idsNeedCache) => {
      return handleResponse(http.post('cod-settings/getPickTimeByPickAddress', {
        pick_address_id: idsNeedCache
      }), 'data')
    })
  },

  /** Lấy log thay đổi của pk stop point */
  getPickingSettingLog (stopPointId) {
    return handleResponse(http.get('cod-settings/getPickingStopPointLog', {
      params: {
        stop_point_id: stopPointId
      }
    }), 'data')
  },

  /** Lấy thông tin tính toán tọa độ điểm */
  calculatePickingPointCoordinates (points) {
    return handleResponse(http.post('cod-settings/calculatePickingPointCoordinates', {points: points}), 'data')
  },

  /** Lấy thông tin cấu hình năng suất COD */
  getCodCapacities (userId) {
    return handleResponse(http.get('cod-settings/getCodCapacities', {params: {user_id: userId}}), 'data')
  },

  /** Lấy thông tin cấu hình năng suất lấy của COD */
  getCodPickCapacities (userId) {
    return handleResponse(http.get('AdCodSettings/getPickCodCapacities', {params: {user_id: userId}}), 'data')
  },

  /** Lấy thông tin log cấu hình năng suất COD */
  getCodCapacityLogs (userId, workShiftId) {
    return handleResponse(http.get('cod-settings/getCodCapacityLogs', {
      params: {
        user_id: userId,
        work_shift: workShiftId
      }
    }), 'data')
  },

  /** Lấy thông tin log cấu hình năng lấy của COD */
  getCodPickCapacityLogs (userId, workShiftId) {
    return handleResponse(http.get('AdCodSettings/getPickCapacityLogs', {
      params: {
        user_id: userId,
        work_shift: workShiftId
      }
    }), 'data')
  },

  /** Lấy thông tin log cấu hình năng suất COD */
  saveCodCapacities (userId, data) {
    return handleResponse(http.post('cod-settings/saveCodCapacities', data, {
      params: {
        user_id: userId
      }
    }), 'message')
  },

  /** Lưu cấu hình năng suất lấy của COD */
  saveCodPickCapacities (userId, data) {
    return handleResponse(http.post('AdCodSettings/savePickCodCapacities', data, {
      params: {
        user_id: userId
      }
    }), 'message')
  },

  /** Thời gian config lấy hàng theo mp_address_id . Dùng trong config Pk */
  getMpShopAddress (params) {
    return handleResponse(http.get('cod-settings/getMpShopAddress', {
      params: params
    }), 'data')
  },

  /** Thời gian config lấy hàng theo mp_address_id . Dùng trong config Pk */
  getPickTimeByMpAddress (mpAddressIds) {
    const cache = new CacheEngine('session')
    const cacheKeyPrefix = 'ManageListCodService.getPickTimeByMpAddress:'

    return cache.rememberByIds(mpAddressIds, cacheKeyPrefix, 30, (idsNeedCache) => {
      return handleResponse(http.post('cod-settings/getPickTimeByMpAddress', {
        mp_address_id: idsNeedCache
      }), 'data')
    })
  },
  getCodPaymentScripts (data) {
    return handleResponse(http.get(`cod-settings/getPaymentScriptSettings`, {params: data}), 'data')
  },
  saveCodPaymentScripts (data) {
    return handleResponse(http.post(`cod-settings/savePaymentScriptSettings`, data))
  },
  getPickPaymentGateWay (data) {
    return handleResponse(http.get(`cod-settings/getPickPaymentGateWay`, {params: data}), 'data')
  },
  savePickPaymentGateWay (data) {
    return handleResponse(http.post(`cod-settings/savePickPaymentGateWay`, data))
  },
  getDTeamReceiveSettings (data) {
    return handleResponse(http.get(`cod-settings/getDTeamReceiveSettings`, {params: data}), 'data')
  },
  saveDTeamReceiveSettings (data) {
    return handleResponse(http.post(`cod-settings/saveDTeamReceiveSettings`, data))
  }
}
