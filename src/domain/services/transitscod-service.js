import httpErp from 'infrastructures/api-erp-http'

export default {
  getSalaryTrans (data) {
    return httpErp.get('ErpHistoryTransitCod/getSalaryTrans', {params: data})
  },
  getTransByDay (data) {
    return httpErp.get('ErpHistoryTransitCod/getTransByDay', {params: data})
  },
  detailTransBySession (data) {
    return httpErp.get('ErpHistoryTransitCod/detailTransBySession', {params: data})
  }

}
