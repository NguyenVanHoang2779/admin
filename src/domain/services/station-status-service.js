
import httpErp from 'infrastructures/api-erp-http'

export default {
  getStationStatus (data) {
    return httpErp.get('ErpStationStatus/getStationStatus', {params: data})
  },

  getStationManager (data) {
    return httpErp.get('ErpStationStatus/getStationManager', {params: data})
  }
}
