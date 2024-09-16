import httpErpNew from 'infrastructures/api-erp-new'

export default {
  getReward: (data) => httpErpNew.get(`fstar-reward/get-data`, {params: data}),
  getPenalty: (data) => httpErpNew.get(`fstar-penalty/get-data`, {params: data}),
  getTypeReward: () => httpErpNew.get(`fstar-reward/get-type`),
  getTypePenalty: () => httpErpNew.get(`fstar-penalty/get-type`),
  createReward: (data) => httpErpNew.post(`fstar-reward/insert-data`, data),
  createPenalty: (data) => httpErpNew.post(`fstar-penalty/insert-data`, data),
  updateReward: (data) => httpErpNew.post(`fstar-reward/update-data`, data),
  updatePenalty: (data) => httpErpNew.post(`fstar-penalty/update-data`, data),
  approveReward: (data) => httpErpNew.post(`fstar-reward/approve`, data),
  deleteReward: (data) => httpErpNew.post(`fstar-reward/delete`, data),
  cancelReward: (data) => httpErpNew.post(`fstar-reward/reject`, data),
  cancelPenalty: (data) => httpErpNew.post(`fstar-penalty/cancel`, data),
  totalReward: (data) => httpErpNew.get(`fstar-reward/count-data`, {params: data}),
  totalPenalty: (data) => httpErpNew.get(`fstar-penalty/count-data`, {params: data})
}
