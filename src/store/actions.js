import userService from 'domain/services/user-service'
import config from 'config/app.base'
import WebStorage from 'infrastructures/web-storage'
import {AuthRedirectGuardMiddleware} from '../vendor/libs/gmjs/lib'

const webLocalStorage = new WebStorage('local')

export const getUserInfo = ({ commit }) => {
  userService.getUserInfo()
    .then((res) => {
      if (res.data.success) {
        commit('setUserInfo', res.data.userInfo)
        commit('setToken', res.data.token)
        sessionStorage.removeItem('isReload')
      } else {
        const adminDomain = new URL(config.domain)
        const currentURL = new URL(document.referrer || location.origin)
        const isOnAdminDomain = adminDomain.host === currentURL.host

        if (isOnAdminDomain) {
          // window.location.href = `${config.baseApiUrl}logout`
          webLocalStorage.remove(config.oidc.tokenIamStorage)
          const authRedirectGuardMiddleware = AuthRedirectGuardMiddleware(config.oidc)
          try {
            authRedirectGuardMiddleware.run(window.location.href)
          } catch (e) {
            // Handle exception here
          }
        }
      }
    })
    .catch((e) => {
      console.log('Có lỗi xảy ra khi lấy dữ liệu người dùng.')
    })
}
