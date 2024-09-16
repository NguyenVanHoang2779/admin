import http from 'infrastructures/api-http'

export default {
  getAll (data) {
    return http.get('/hrteams/getAll', {'params': data})
  },

  getAllModuleByStationIds (data) {
    return http.get('/hrteams/getAllModuleByStationIds', {'params': data})
  },

  getAllHrMember (data) {
    return http.get('/hrteams/getAllHrMember', {'params': data})
  },

  addHrTeam (data) {
    return http.post('/hrteams/add', data)
  },

  getHrTeamById (data) {
    return http.get('/hrteams/getTeam', {'params': data})
  },

  updateHrTeam (data) {
    return http.put('/hrteams/edit', data)
  },

  deleteHrTeam (data) {
    return http.post('hrteams/delete', {'team_id': data})
  },

  checkTeamByArea (data) {
    return http.get('hrteams/checkTeamByArea', { params: data })
  },

  checkTeamByUser (data) {
    return http.get('hrteams/checkTeamByUser', { params: data })
  }
}
