import http from 'infrastructures/api-http'

export default {
  getShopRealtimeDataList (params) {
    return http.get('AdDashboardV4/getShopRealtimeDataList', {'params': params})
  },

  getAllProvince () {
    return http.get('AdDashboardV4/getAllProvince')
  },

  getInfoByPackageType: function (params) {
    return http.get('AdDashboardV4/getInfoByPackageType', {'params': params})
  },

  getChartShopTimeData: function (params) {
    return http.get('AdDashboardV4/getChartShopTimeData', {'params': params})
  },

  getChartShopSpaceData: function (params) {
    return http.get('AdDashboardV4/getChartShopSpaceData', {'params': params})
  },

  getChartPackageSpaceData: function (params) {
    return http.get('AdDashboardV4/getChartPackageSpaceData', {'params': params})
  },

  getOperationSpeedPickData: function (params) {
    return http.get('AdDashboardV4/getOperationSpeedPickData', {'params': params})
  },

  getOperationSpeedDeliverData: function (params) {
    return http.get('AdDashboardV4/getOperationSpeedDeliverData', {'params': params})
  },

  getOperationSpeedTransitData: function (params) {
    return http.get('AdDashboardV4/getOperationSpeedTransitData', {'params': params})
  },

  getOperationSpeedReturnData: function (params) {
    return http.get('AdDashboardV4/getOperationSpeedReturnData', {'params': params})
  },

  getOperationReportFailedPickPieChartData: function (params) {
    return http.get('AdDashboardV4/getOperationReportFailedPickPieChartData', {'params': params})
  },

  getAllStationByProvinceIds: function (params) {
    return http.get('AdDashboardV4/getAllStationByProvinceIds', {'params': params})
  },

  getOperationReportFailedDeliverPieChartData: function (params) {
    return http.get('AdDashboardV4/getOperationReportFailedDeliverPieChartData', {'params': params})
  },

  getOperationReportDelayPickPieChartData: function (params) {
    return http.get('AdDashboardV4/getOperationReportDelayPickPieChartData', {'params': params})
  },

  getOperationReportDelayDeliverPieChartData: function (params) {
    return http.get('AdDashboardV4/getOperationReportDelayDeliverPieChartData', {'params': params})
  },

  getOperationReportDelayReturnPieChartData: function (params) {
    return http.get('AdDashboardV4/getOperationReportDelayReturnPieChartData', {'params': params})
  },

  getOperationOverviewData: function (params) {
    return http.get('AdDashboardV4/getOperationOverviewData', {'params': params})
  },

  getOperationCodPerformanceData: function (params) {
    return http.get('AdDashboardV4/getOperationCodPerformanceData', {'params': params})
  },

  getOperationSpeedPickDeliverBarData: function (params) {
    return http.get('AdDashboardV4/getOperationSpeedPickDeliverBarData', {'params': params})
  },

  getOperationSpeedTransitBarData: function (params) {
    return http.get('AdDashboardV4/getOperationSpeedTransitBarData', {'params': params})
  },

  getOperationSpeedReturnBarData: function (params) {
    return http.get('AdDashboardV4/getOperationSpeedReturnBarData', {'params': params})
  },

  getStation6hListByProvinceIds: function (params) {
    return http.get('AdDashboardV4/getStation6hListByProvinceIds', {'params': params})
  },

  getStation12hListByProvinceIds: function (params) {
    return http.get('AdDashboardV4/getStation12hListByProvinceIds', {'params': params})
  }
}
