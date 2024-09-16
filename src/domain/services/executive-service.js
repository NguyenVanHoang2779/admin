import http from 'infrastructures/api-http'

export default {
  getAll (data) {
    return http.get('/executive-team/getAll', {'params': data})
  },
  getSelectableMember (data) {
    return http.get('/executive-team/getSelectableMember', {'params': data})
  },
  createTeam (data) {
    return http.post('/executive-team/createTeam', data)
  },
  deleteTeam (data) {
    return http.post('/executive-team/deleteTeam', data)
  },
  updateTeam (data) {
    return http.post('/executive-team/updateTeam', data)
  }
}
