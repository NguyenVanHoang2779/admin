import httpErpNew from 'infrastructures/api-erp-new'
export default {
  // quản lý permission:
  getListPermission: params => httpErpNew.get('/permission-management/permission/get', { 'params': params }),

  createPermission: data => httpErpNew.post('/permission-management/permission/create', data),

  editPermission: data => httpErpNew.post('/permission-management/permission/edit', data),

  getListPermissionByRole: params => httpErpNew.get('/permission-management/permission/get-by-role', { 'params': params }),

  getListPermissionSuggest: params => httpErpNew.get('/permission-management/permission/suggest-permission', { 'params': params }),

  // quản lý role:
  getListRole: params => httpErpNew.get('/permission-management/role/get', { 'params': params }),

  getListRoleByPermission: params => httpErpNew.get('/permission-management/role/get-by-permission', { 'params': params }),

  addRoleToPermission: data => httpErpNew.post('/permission-management/role/add-to-permission', data),

  getListRoleSuggest: params => httpErpNew.get('/permission-management/role/suggest-role', { 'params': params }),

  deleteRoleFromPermission: data => httpErpNew.post('/permission-management/role/revoke-permission', data),

  updateRole: data => httpErpNew.post('/permission-management/role/update', data),

  getRoleDetailById: params => httpErpNew.get('/permission-management/role/get-by-id', { 'params': params }),

  getInfoGroupByRole: params => httpErpNew.get('/permission-management/role/get-info-group', { 'params': params }),

  updateListPermissionOfRole: data => httpErpNew.post('/permission-management/role/update-list-permission', data),

  createRole: data => httpErpNew.post('/permission-management/role/create', data),

  createRoleFromGroup: data => httpErpNew.post('/permission-management/role/create-from-group', data),

  removeGroupRole: data => httpErpNew.post('/permission-management/role/remove-group-role', data),

  getLogRolePermission: params => httpErpNew.get('/permission-management/role/get-log', { 'params': params }),

  getDataCompare: params => httpErpNew.get('/permission-management/role/get-data-compare', { 'params': params }),

  // quản lý user:
  getListModelByRole: params => httpErpNew.get('/permission-management/user-permission/get-by-role', { 'params': params }),

  checkCompleteJobAssignRole: params => httpErpNew.get('/permission-management/user-permission/check-complete-job-assign-role', { 'params': params }),

  getDataUser: params => httpErpNew.get('/permission-management/user-permission/get-info-user', { 'params': params }),

  // quản lý position:
  getListPositionByRole: params => httpErpNew.get('/permission-management/position-permission/get-by-role', { 'params': params }),

  getDataPosition: params => httpErpNew.get('/permission-management/position-permission/get-info-position', { 'params': params }),

  getListRolePosition: params => httpErpNew.get('/permission-management/position-permission/get-list-role-position')
}
