import httpErp from 'infrastructures/api-erp-http'
import http from 'infrastructures/api-http'

export default {
  getTeamOption: params => http.get('/AdHrTeams/getTeamOption', { params: params }),
  lockShift: data => httpErp.post('/ErpStaffShift/lockShift', data),
  explain: data => httpErp.post('/ErpStaffShift/explain', data),
  getNumStaffWorkOnDay: params => httpErp.get('/ErpStaffShift/getNumStaffWorkOnDay', {params}),
  getClosingShiftBoardPermission: () => httpErp.get('/ErpStaffShift/getClosingShiftBoardPermission')
}
