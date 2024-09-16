import erpHttp from 'infrastructures/api-erp-http'

export default {
  getList: params => erpHttp.get('/ErpHrTag/getList', { 'params': params }),
  create: params => erpHttp.post('/ErpHrTag/create', params),
  attach: params => erpHttp.post('/ErpHrTag/attach', params),
  detach: params => erpHttp.post('/ErpHrTag/detach', params),
  delete: params => erpHttp.post('/ErpHrTag/delete', params)
}
