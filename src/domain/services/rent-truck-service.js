import httpErp from 'infrastructures/api-erp-http'

export default {
  getListCompany (data) {
    return httpErp.post('erpExportRentTruckPrice/getListCompany', data)
  },
  exportPriceRentTruckAll (data) {
    return httpErp.post('erpExportRentTruckPrice/exportPriceRentTruckAll', data)
  },
  exportPriceRentTruckDetail (data) {
    return httpErp.post('erpExportRentTruckPrice/exportPriceRentTruckDetail', data)
  },
  runPriceRentTruck (data) {
    return httpErp.post('erpExportRentTruckPrice/runPriceRentTruck', data)
  },
  getListFiles (data) {
    return httpErp.post('erpExportRentTruckPrice/getListFiles', data)
  },
  removeExportFile (data) {
    return httpErp.post('erpExportRentTruckPrice/removeExportFile', data)
  },
  exportDryRentTruck (data) {
    return httpErp.post('erpExportRentTruckPrice/exportDryRentTruck', data)
  },
  exportDetailRentTruckQuick (data) {
    return httpErp.post('erpExportRentTruckPrice/exportDetailRentTruckQuick', data)
  },
  downloadRentTruckFileQuick (data) {
    return httpErp.post('erpExportRentTruckPrice/downloadRentTruckFileQuick', data)
  },
  removeExportFileQuick (data) {
    return httpErp.post('erpExportRentTruckPrice/removeExportFileQuick', data)
  },
  runDryRentTruck (data) {
    return httpErp.get('ErpSalaryDriver/apiCreateDryRentTruck', {'params': data})
  }
}
