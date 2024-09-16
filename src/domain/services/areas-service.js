import http from 'infrastructures/api-http'

export default {
  searchAddress (name) {
    return http.get('AdAreasManager/searchAddress', {'params': {term: name}})
  },
  getListAddresses (type, listProvinceIds, listDistrictIds) {
    return http.get('AdAreasManager/getListAddresses', {'params': {type: type, province_ids: listProvinceIds, district_ids: listDistrictIds}})
  },
  getListBlockReasons () {
    return http.get('AdAreasManager/getListAreaBlockReasons')
  },
  getAreasData (dataSearch) {
    return http.get('AdAreasManager/getAreasData', {'params': dataSearch})
  },
  saveAreasData (saveData) {
    return http.post('AdAreasManager/saveAreasData', saveData)
  },
  addBlockReason (saveData) {
    return http.post('AdAreasManager/addBlockReason', saveData)
  },
  removeBlockReason (reasonId) {
    return http.post('AdAreasManager/removeBlockReason', { id: reasonId })
  },
  updateBlockReason (saveData) {
    return http.post('AdAreasManager/updateBlockReason', saveData)
  }
}
