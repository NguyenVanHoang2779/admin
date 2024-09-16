import httpErp from 'infrastructures/api-erp-http'

export default {
  getSOSTotalTicket () {
    return httpErp.get('/ErpStatistic/getSOSTotalTicket')
  },

  getSOSticketByStation () {
    return httpErp.get('/ErpStatistic/getSOSticketByStation')
  },

  getStatisticCandidate (data) {
    return httpErp.get('/ErpStatistic/getStatisticDataCandidate', {params: data})
  },

  getStatisticDataDependant (data) {
    return httpErp.get('/ErpStatistic/getStatisticDataDependant', {params: data})
  },

  getStatisticDataInsurance (data) {
    return httpErp.get('/ErpStatistic/getStatisticDataInsurance', {params: data})
  },

  getStatisticDataProfileStatus (data) {
    return httpErp.get('/ErpStatistic/getStatisticDataProfileStatus', {params: data})
  },

  getStatisticDataEmployeeContract (data) {
    return httpErp.get('/ErpStatistic/getStatisticDataEmployeeContract', {params: data})
  },

  getStatisticDataEmployeeDocument (data) {
    return httpErp.get('/ErpStatistic/getStatisticDataEmployeeDocument', {params: data})
  },

  getAmountUserLackDeposit (data) {
    return httpErp.get('/ErpStatistic/getAmountUserLackDeposit', { params: data })
  },

  getAmountUserRecompense (data) {
    return httpErp.get('/ErpStatistic/getAmountUserRecompense', { params: data })
  },

  getAmountUserFstar (data) {
    return httpErp.get('/ErpStatistic/getAmountUserFstar', { params: data })
  },

  getStatisticCheckinData (data) {
    return httpErp.get('/ErpStatistic/getCheckinStatistic', {params: data})
  },

  getCheckinDataDetail (data) {
    return httpErp.get('/ErpStatistic/getCheckinStatisticDetail', { params: data })
  },

  getAmountUserFstarOverView (data) {
    return httpErp.get('/ErpStatistic/getAmountUserFstarOverView', { params: data })
  },
  getListUserNotEvaluated (data) {
    return httpErp.get('/ErpStatistic/getListUserNotEvaluated', { params: data })
  },
  getListUserRecompense (data) {
    return httpErp.get('/ErpStatistic/getListUserRecompense', { params: data })
  },

  // Api thống kê các công việc cần làm tích hợp với GChat
  getStatisticMasterProfile (data) {
    return httpErp.get('/ErpStatistic/getStatisticMasterProfile', { params: data })
  },

  getStatisticHrOrder (data) {
    return httpErp.get('/ErpStatistic/getStatisticHrOrder', { params: data })
  },

  getStatisticCandidateV2 (data) {
    return httpErp.get('/ErpStatistic/getStatisticCandidateV2', { params: data })
  },

  getStatisticUnion (data) {
    return httpErp.get('/ErpStatistic/getStatisticUnion', { params: data })
  },

  getStatisticDependantV2 (data) {
    return httpErp.get('/ErpStatistic/getStatisticDependantV2', { params: data })
  },

  getTotalDriverxNews (data) {
    return httpErp.get('/ErpStatistic/getTotalDriverxNews', { params: data })
  },

  getTotalTrainingTests (data) {
    return httpErp.get('/ErpStatistic/getTotalTrainingTests', { params: data })
  },

  getTotalUserNotCompleteDocuments (data) {
    return httpErp.get('/ErpStatistic/getTotalUserNotCompleteDocuments', { params: data })
  }
}
