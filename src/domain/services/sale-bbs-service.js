import httpErp from 'infrastructures/api-erp-http'

export default {
  getAllSalesBbsForExportDataShop (data) {
    return httpErp.get(`sales/getSalesBbs?region=${data}`)
  },
  getShopBbsDetailInRangeTime (data) {
    return httpErp.get('sales/getShopBbsDetailInRangeTime', {'params': data})
  },
  exportDataShopBbsToExcel (data) {
    return httpErp.post('sales/exportDataShopBbsToExcel', data)
  }
}
