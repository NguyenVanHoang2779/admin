import httpQlts from 'infrastructures/api-qlts'

export default {
  getCountProfileCarDriver () {
    return httpQlts.get('/api/rent-driver/count-profile-driver')
  }
}
