import util from '../helper/util'
import constants from './constants'
import AuthStorageManager from './AuthStorageManager'
import { AuthApiError, AuthSdkError } from '../helper/error'

function httpRequest (sdk, options) {
  options = options || {}
  const url = options.url
  const method = options.method
  const args = options.args
  const saveAuthnState = options.saveAuthnState
  const accessToken = options.accessToken
  const withCredentials = options.withCredentials !== false // default value is true
  const storageUtil = sdk.options.storageUtil
  const httpCache = storageUtil.getHttpCache()

  if (options.cacheResponse) {
    const cacheContents = httpCache.getStorage()
    const cachedResponse = cacheContents[url]
    if (cachedResponse && Date.now() / 1000 < cachedResponse.expiresAt) {
      return Promise.resolve(cachedResponse.response)
    }
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Ghtk-User-Agent-Extended': sdk.userAgent
  }
  util.extend(headers, sdk.options.headers, options.headers)

  if (accessToken && util.isString(accessToken)) {
    headers.Authorization = 'Bearer ' + accessToken
  }

  const ajaxOptions = {
    headers: headers,
    data: args || undefined,
    withCredentials: withCredentials
  }

  return sdk.options.httpRequestClient(method, url, ajaxOptions)
    .then(function (response) {
      if (response.ok) {
        // is 2xx Successful responses
        const resData = response.dataJSON
        if (saveAuthnState) {
          if (!resData.state || !resData.state.token) {
            AuthStorageManager.setAuthnState(null)
          }
        }

        if (resData && resData.state) {
          AuthStorageManager.setAuthnState(resData.state)
        }

        if (resData && options.cacheResponse) {
          const cacheResponseDuration = options.cacheResponseDuration || constants.DEFAULT_CACHE_DURATION
          httpCache.updateStorage(url, {
            expiresAt: Math.floor(Date.now() / 1000) + cacheResponseDuration,
            response: response
          })
        }
      } else {
        if (response.status >= 100 && response.status <= 199) {
          // is 1xx Informational responses
          // not handle yet
        } else if (response.status >= 300 && response.status <= 399) {
          // is 3xx Redirection messages
          // not handle yet
        } else if (response.status >= 400 && response.status <= 499) {
          // is 4xx Client error responses
          if (response.status === 403) {
            if (response.rawData && response.rawData.detail && response.rawData.detail.error_code === 'invalid_authn_token') {
              AuthStorageManager.setAuthnState(null)
            }
          }
        } else if (response.status >=  500 && response.status <= 599) {
          // is 5xx Server error responses
        } else {
          // unknown
          throw new AuthApiError('Unknown error', response)
        }
        //
        // if (response.status >= 400) {
        //   throw new AuthApiError('Unknown error', response)
        // }
      }

      return response
    })
    .catch(function (error) {
      if (error.name !== 'AuthApiError') {
        const msg = error.name + '::' + error.message
        throw new AuthSdkError(msg, error.xhr)
      } else {
        throw error
      }
    })
}

function get (sdk, url, options) {
  url = util.isAbsoluteUrl(url) ? url : sdk.getIssuerOrigin() + url
  const getOptions = {
    url: url,
    method: 'GET'
  }
  util.extend(getOptions, options)
  return httpRequest(sdk, getOptions)
}

function post (sdk, url, args, options) {
  url = util.isAbsoluteUrl(url) ? url : sdk.getIssuerOrigin() + url
  const postOptions = {
    url: url,
    method: 'POST',
    args: args,
    saveAuthnState: true
  }
  util.extend(postOptions, options)
  return httpRequest(sdk, postOptions)
}

export default {
  httpRequest,
  get,
  post
}
