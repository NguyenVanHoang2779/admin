process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import staffService from '@/domain/services/staff-service'
import WebStorage from '@/infrastructures/web-storage'
import config from 'config/app.base'


describe('services/staff-service.js', () => {
  it('HRM-13830: call api edit user', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken : {
        accessToken: process.env.ACCESS_TOKEN
      }
    })
    const response = await staffService.editUser({
      id: 112,
      position_job: 23
    })
    console.log(response)
    expect(response.data.success).toBe(false)
  })
})
