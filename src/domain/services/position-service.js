import http from 'infrastructures/api-http'

export default {
  // Lấy dữ liệu config
  get (data) {
    return http.get('/position/getPositionLeader', {'params': data})
  },

  // Xóa config leader
  delete (data) {
    return http.delete('/position/deletePositionLeader', {'params': data})
  },

  // Cập nhật config leader
  update (data) {
    return http.post('/position/updatePositionLeader', data)
  },

  // Lấy toàn bộ nhân viên có thể là leader
  getAllLeader () {
    return http.get('/position/getAllLeader')
  },

  // Lấy config leader theo id cảu vị trí
  getById (data) {
    return http.get('/position/getPositionConfigById', {'params': data})
  }

}
