import httpErp from 'infrastructures/api-erp-http'

export default {
  getAllStationStatistic (data) {
    return httpErp.get('/ErpStationStatistic/getAllStationStatistic', {'params': data})
  }
}
