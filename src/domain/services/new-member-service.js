import http from 'infrastructures/api-http'
import erpHttp from 'infrastructures/api-erp-http'

export default {
  getNewMembers: params => http.get('/AdHr/getNewMembers', { 'params': params }),
  getTotalNewMembers: params => http.get('/AdHr/getTotalNewMembers', { 'params': params }),
  getUserLogs: params => http.get('/AdHr/getUserByMasterProfileLogs', { 'params': params }),
  getPkgInfoByOrder: params => http.get('/adMostUsed/getPkgInfoByOrder', { 'params': params }),
  addNote: data => http.post('/AdHr/addNote', data),
  getUserTiketDetails: params => http.get('/AdHr/getUserTiketDetails', { 'params': params }),
  getTicketLogs: params => http.get('/AdHr/getTicketLogs', { 'params': params }),
  getRefundTotalMoney: params => http.get('/AdHr/getUserRefund', { 'params': params }),
  getUserFstarData: params => http.get('/AdHr/getFstarDataByMpId', { 'params': params }),
  getTotalSalary: params => erpHttp.get('/salaryCods/getSalaryCodByMonthV2', { 'params': params }),
  getListTagByMasterProfile: params => erpHttp.get('/ErpNewMemberTag/getList', { 'params': params }),
  createTag: params => erpHttp.post('/ErpNewMemberTag/create', params),
  deleteTag: params => erpHttp.post('/ErpNewMemberTag/delete', params),
  addTagToMasterProfile: params => erpHttp.post('/ErpNewMemberTag/addTagToMasterProfile', params),
  removeTagFromMasterProfile: params => erpHttp.post('/ErpNewMemberTag/removeTagFromMasterProfile', params)
}
