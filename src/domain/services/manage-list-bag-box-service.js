import http from './../../infrastructures/api-http'
import httpInter from './../../infrastructures/api-inter-http'
import httpNewBag from './../../infrastructures/api-new-bag-http'
import CacheEngine from './../../infrastructures/cache-engine'

export default {
  async handleResponse (apiRequest, dataKey) {
    dataKey = dataKey || 'data'
    try {
      const apiResponse = await apiRequest
      if (apiResponse.data && Object.prototype.toString.call(apiResponse.data) !== '[object Object]') {
        throw new Error('Server trả về không đúng định dạng')
      }

      if (apiResponse.data.success !== undefined && !apiResponse.data.success) {
        const errorMessage = apiResponse.data.message || apiResponse.data.msg || 'Đã có lỗi xảy ra khi gọi API'
        if (apiResponse.data.message) {
          throw new Error(errorMessage.toString())
        }
      }

      if (dataKey && Array.isArray(apiResponse.data)) {
        throw new Error('Server trả về không đúng định dạng')
      }

      return apiResponse.data[dataKey]
    } catch (reason) {
      if (reason instanceof Error) {
        throw reason.toString()
      }
      if (Object.prototype.toString.call(reason) === '[object Object]' && reason.data && reason.data.message) {
        throw reason.data.message
      }
      throw reason.toString()
    }
  },
  getFilterConfigs () {
    const CACHE_TIME_IN_MINUTES = 60 // Thời gian cache 1 giờ
    return new CacheEngine().remember('ManageListBagBoxService:getFilterConfigs', CACHE_TIME_IN_MINUTES, async () => {
      return this.handleResponse(http.get('AdGreenBoxes/getAllConfig'))
    })
  },
  searchUser (params) {
    return this.handleResponse(http.get('AdGreenBoxes/autocompleteUser', {params}))
  },
  async searchStation (params) {
    return this.handleResponse(http.get('services/autocompleteAllStation', {params}), 'items')
  },
  async searchStationOrPostOffice (params) {
    return this.handleResponse(http.get('services/autocompleteStationOrPostOffice', {params}), 'items')
  },
  async searchTruck (params) {
    return this.handleResponse(http.get('services/autocompleteTruckInBagsLog', {params}), 'items')
  },
  searchBag (filterOptions) {
    return this.handleResponse(http.get('AdGreenBoxes/getBags', {params: filterOptions}))
  },
  searchIdentifyBag (filterOptions) {
    return this.handleResponse(httpNewBag.post('api/identify/bag/search', filterOptions))
  },
  searchBox (filterOptions) {
    return this.handleResponse(http.get('AdGreenBoxes/getListBoxLogs', {params: filterOptions}))
  },
  searchKit (filterOptions) {
    return this.handleResponse(httpInter.get('kit/get-list-kit-logs', {params: filterOptions}))
  },
  get (url) {
    return http.get(url)
  },
  reportMissingBox (erpAlias, stationId) {
    return this.handleResponse(http.post('AdGreenBoxes/reportMissingBox', {
      erp_alias: erpAlias,
      station_id: stationId
    }), 'message')
  },
  reportFoundBox (erpAlias, stationIds) {
    return this.handleResponse(http.post('AdGreenBoxes/reportFoundBox', {
      erp_alias: erpAlias,
      route_sent_from_source: stationIds
    }), 'message')
  },
  addPrivateNote (boxId, privateNote) {
    return this.handleResponse(http.post('AdGreenBoxes/addPrivateNoteForBox', {
      box_id: boxId,
      desc: privateNote
    }), 'message')
  },
  reportMissingKit (kitId, kitUserId, stationId, userId) {
    return this.handleResponse(httpInter.post('kit/report-lost-and-find-kit', {
      kit_id: kitId,
      kit_user_id: kitUserId,
      station_id: stationId,
      type: 1, // 1 - Báo mất
      user_id: userId
    }), 'message')
  },
  reportFoundKit (kitId, kitUserId, stationId, userId) {
    return this.handleResponse(httpInter.post('kit/report-lost-and-find-kit', {
      kit_id: kitId,
      kit_user_id: kitUserId,
      station_id: stationId,
      type: 2, // 2 - Báo tìm thấy
      user_id: userId
    }), 'message')
  },
  addPrivateNoteKit (kitUserId, privateNote, userId) {
    return this.handleResponse(httpInter.post('kit/add-note', {
      kit_user_id: kitUserId,
      note: privateNote,
      user_id: userId
    }), 'message')
  },
  reportIdentifyBag (
    cycleIdentifyBagId,
    identifyBagId,
    bagOrder,
    stationId,
    userId,
    username,
    action,
    desc
  ) {
    return this.handleResponse(httpNewBag.post('api/identify/bag/report-action', {
      cycle_identify_bag_id: cycleIdentifyBagId,
      identify_bag_id: identifyBagId,
      bag_order: bagOrder,
      station_id: stationId,
      user_id: userId,
      username: username,
      action: action,
      desc: desc
    }), 'message')
  }
}
