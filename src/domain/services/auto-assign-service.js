import http from 'infrastructures/api-http'

export default {
  /**
   * API get list regions
   *
   * @param data
   * @returns {AxiosPromise<any>}
   */
  getListAreas (params) {
    let type = 'conditions'
    if (!params.name && params.stations.length === 0 && params.provinces.length === 0 && params.districts.length === 0) {
      type = 'all'
    }
    if (!params.districts && type !== 'all') {
      params.districts = []
    }
    return http.get('/AdAutoAssign/getListAreas', {
      params: {
        name: params.name,
        stations: params.stations,
        provinces: params.provinces,
        districts: params.districts,
        page: params.page,
        type: type
      }
    })
  },
  getListStationByDistric (districtIds) {
    return http.get('/AdAddresses/getStationByProvinceFormat', {
      params: {
        province_id: districtIds
      }
    })
  },
  removeArea (id) {
    return http.post('/AdAutoAssign/removeAreas', {
      id: id
    })
  },
  addArea (data) {
    return http.post('/AdAutoAssign/addArea', data)
  },
  editArea (data) {
    return http.post('/AdAutoAssign/editArea', data)
  },
  getArea (id) {
    return http.get('/AdAutoAssign/getArea', {
      params: {
        area_id: id
      }
    })
  },
  getConfigCart (id) {
    return http.get('/AdAutoAssign/getListAreasAssignCarts', {
      params: {
        aa_id: id
      }
    })
  },
  updateConfigCart (data) {
    return http.post('/AdAutoAssign/createOrUpdateConfigCart', data)
  },

  updatePriorityForCart (data) {
    return http.post('/AdAutoAssign/addPriority', data)
  },

  getCartNeighbor (aaId, leftCartId) {
    return http.get('/AdAutoAssign/getCartNeighbor', {
      params: {
        aa_id: aaId,
        left_cart_id: leftCartId
      }
    })
  }
}
