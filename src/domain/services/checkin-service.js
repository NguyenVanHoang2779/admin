import httpKpi from 'infrastructures/api-kpi-http'

export default {
  getCheckin (data) {
    return httpKpi.get('erp/ErpCheckinManager/getCheckin', { params: data })
  },

  getStatisticCheckinNeedReview (data) {
    return httpKpi.get('erp/ErpCheckinManager/getStatisticCheckinNeedReview', { params: data })
  }
}
