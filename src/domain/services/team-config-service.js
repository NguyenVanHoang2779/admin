// import httpErp from 'infrastructures/api-erp-http'
import httpErpNew from 'infrastructures/api-erp-new'

export default {
  getListTeam: data => httpErpNew.get('team/list-all-team', {params: data}),
  addMember: (team, data) => httpErpNew.post(`team/${team}/member`, data),
  getTeamConfig: (filter) => httpErpNew.get('team/list-team', {params: filter}),
  getTeamDetail: (teamId) => httpErpNew.get('/team/get-team-detail', {params: {team_id: teamId}}),
  deleteTeam: teamId => httpErpNew.delete(`/team/${teamId}`),
  getUserInfo: userId => httpErpNew.get('/team/member', {params: {member_id: userId}}),
  getListSkill: data => httpErpNew.get('/user-profile/skills', {params: data}),
  updateSkill: data => httpErpNew.post('/tag-staffs/update-tags', data),
  getSkillOfUser: userId => httpErpNew.get(`/user-profile/${userId}/skills`),

  getTeamConfigs: (data) => httpErpNew.get('teams/list-team', {params: data}),
  getChildTeam: (data) => httpErpNew.get('teams/get-children-team', {params: data}),
  removeTeam: teamId => httpErpNew.delete(`teams/delete/${teamId}`),
  searchTeam: (data) => httpErpNew.get(`teams/search`, {params: data}),
  getTeamFromSearch: (data) => httpErpNew.get(`teams/get-team-from-search`, {params: data}),
  getUserActiveByTeam: (data) => httpErpNew.get(`teams/get-user-active-by-team`, {params: data}),
  getUserHistoryByTeam: (data) => httpErpNew.get(`teams/get-user-history-by-team`, {params: data}),
  updateSkillTeam: (data) => httpErpNew.post(`teams/update-skill`, data),
  updateTeam: (data) => httpErpNew.post(`teams/update`, data),
  addMemberTeam: (data) => httpErpNew.post(`teams/add-member`, data),
  updateMemberTeam: (data) => httpErpNew.post(`teams/update-member`, data),
  updatePositionMember: (data) => httpErpNew.post(`teams/update-position-member`, data),
  deleteMember: logId => httpErpNew.delete(`teams/delete-member/${logId}`),
  infoUserInTeam: (data) => httpErpNew.post(`teams/info-user-in-team`, data),
  getTimeLine: (data) => httpErpNew.get(`teams/get-timeline`, {params: data}),
  getCountPosition: (data) => httpErpNew.get(`teams/get-count-position`, {params: data}),
  updateTeamKpi: (data) => httpErpNew.post(`teams/update-team-kpi`, data)
}
