import config from 'config/app.base'
import UnionService from 'domain/services/union-service'
import WebStorage from 'infrastructures/web-storage'

describe('UnionService', () => {
  it('HRM-13709: call api get master profile info', async () => {
    const webLocalStorage = new WebStorage('local')
    webLocalStorage.set(config.oidc.tokenIamStorage, {
      accessToken: {
        accessToken: process.env.ACCESS_TOKEN
      }
    })
    const response = await UnionService.validUserUnion({id: 40464})
    expect(response.data.success).toBe(true)
    expect(response.status).toEqual(200)
  })
})
