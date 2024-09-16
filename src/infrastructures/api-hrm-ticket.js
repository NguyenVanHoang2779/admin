import axios from 'axios'
import config from 'config/app.base'
import GchatAuth from './gchat-auth'
import WebStorage from './web-storage'
import {AuthRedirectGuardMiddleware} from '../vendor/libs/gmjs/lib'

const webLocalStorage = new WebStorage('local')
const webSessionStorage = new WebStorage('session', false)

const adminDomain = new URL(config.domain)
const currentURL = new URL(document.referrer || location.origin)
const isOnAdminDomain = adminDomain.host === currentURL.host

// const TOKEN_EXPIRED_CODE = 1108
const GCHAT_TOKEN_EXPIRED_CODE = 1109

let retry = 0

// axios error handle
const handleError = async (error) => {
  const {status, data} = error.response
  switch (status) {
    case 400:
      break
    case 401:
      if (!isOnAdminDomain) {
        if (data.code === GCHAT_TOKEN_EXPIRED_CODE || (data.errors && data.errors.includes(GCHAT_TOKEN_EXPIRED_CODE))) {
          await GchatAuth.refreshToken()
        }

        const gchatToken = GchatAuth.getToken()

        if (gchatToken && retry === 0) {
          // retry request with new token
          ++retry
          error.config.headers.GchatToken = gchatToken
          return axios.request(error.config)
        }
      } else {
        // Redirect to log in page if unauthenticated
        let reload = webSessionStorage.get('isReload')
        if (!reload || reload === 'false') {
          webLocalStorage.remove(config.oidc.tokenIamStorage)
          webSessionStorage.set('isReload', true)
          const authRedirectGuardMiddleware = AuthRedirectGuardMiddleware(config.oidc)
          try {
            await authRedirectGuardMiddleware.run(window.location.href)
          } catch (e) {
            // Handle exception here
          }
        }
      }
      break
    case 402:
      // Redirect if the backend asks it
      break
    case 404:
      // Show 404 page
      break
    case 405:
      // Method Not Allowed
      break
    case 419:
      // CSRF token mismatch
      // return refreshAppTokens().then(() => Promise.reject(error))
      break
    case 500:
      // Server Error redirect to 500
      break
    default:
      // Unknown Error
      break
  }
  return Promise.reject(error)
}

const httpHrmTicket = axios.create({
  baseURL: config.domainHrmTicket
})

httpHrmTicket.interceptors.request.use(
  (requestConfig) => {
    const iamAuth = webLocalStorage.get(config.oidc.tokenIamStorage)
    if (iamAuth && iamAuth.accessToken) {
      requestConfig.headers.Authorization = `${config.bearerKey} ${iamAuth.accessToken.accessToken}`
    }

    if (!isOnAdminDomain) {
      const gchatToken = GchatAuth.getToken()
      if (gchatToken) {
        requestConfig.headers.GchatToken = gchatToken
      }
    }

    return requestConfig
  }
)

// Add a response interceptor
httpHrmTicket.interceptors.response.use(function (response) {
  // Do something with response data
  retry = 0
  return response
}, handleError)

export default httpHrmTicket
