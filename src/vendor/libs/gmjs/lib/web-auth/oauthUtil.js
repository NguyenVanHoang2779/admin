import http from './http'
import util from '../helper/util'
import storageUtil from './browserStorage'
import { AuthSdkError } from '../helper/error'

export default {
  generateState () {
    return util.genRandomString(64)
  },

  isToken (obj) {
    if (obj &&
      (obj.accessToken || obj.idToken) &&
      Array.isArray(obj.scopes)) {
      return true
    }
    return false
  },

  addListener (eventTarget, name, fn) {
    if (eventTarget.addEventListener) {
      eventTarget.addEventListener(name, fn)
    } else {
      eventTarget.attachEvent('on' + name, fn)
    }
  },

  removeListener (eventTarget, name, fn) {
    if (eventTarget.removeEventListener) {
      eventTarget.removeEventListener(name, fn)
    } else {
      eventTarget.detachEvent('on' + name, fn)
    }
  },

  loadFrame (src) {
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = src

    return document.body.appendChild(iframe)
  },

  loadPopup (src, options) {
    const title = options.popupTitle || 'External Identity Provider User Authentication'
    const appearance = 'toolbar=no, scrollbars=yes, resizable=yes, ' +
      'top=100, left=500, width=600, height=600'

    if (util.isIE11OrLess()) {
      // IE<=11 doesn't fully support postMessage at time of writting.
      // the following simple solution happened to solve the issue
      // without adding another proxy layer which makes flow more complecated.
      const winEl = window.open('/', title, appearance)
      winEl.location.href = src
      return winEl
    } else {
      return window.open(src, title, appearance)
    }
  },

  getWellKnown (sdk, issuer) {
    const authServerUri = (issuer || sdk.options.issuer)
    return http.get(sdk, authServerUri + '/api/v1/oauth2/.well-known/oauth-authorization-server', {
      cacheResponse: true
    })
  },

  getKey (sdk, issuer, kid) {
    const httpCache = storageUtil.getHttpCache()

    return this.getWellKnown(sdk, issuer)
      .then(function (wellKnown) {
        wellKnown = wellKnown.dataJSON

        const jwksUri = wellKnown.jwks_uri

        // Check our kid against the cached version (if it exists and isn't expired)
        const cacheContents = httpCache.getStorage()
        const cachedResponse = cacheContents[jwksUri]
        if (cachedResponse && Date.now() / 1000 < cachedResponse.expiresAt) {
          const cachedKey = util.find(cachedResponse.response.dataJSON.keys, {
            kid: kid
          })

          if (cachedKey) {
            return cachedKey
          }
        }

        // Remove cache for the key
        httpCache.clearStorage(jwksUri)

        // Pull the latest keys if the key wasn't in the cache
        return http.get(sdk, jwksUri, {
          cacheResponse: true
        })
          .then(function (res) {
            const key = util.find(res.dataJSON.keys, {
              kid: kid
            })

            if (key) {
              return key
            }

            throw new AuthSdkError('The key id, ' + kid + ', was not found in the server\'s keys')
          })
      })
  },

  validateClaims (sdk, claims, validationParams) {
    const aud = validationParams.clientId
    const iss = validationParams.issuer

    if (!claims || !iss || !aud) {
      throw new AuthSdkError('The jwt, iss, and aud arguments are all required')
    }

    const now = Math.floor(Date.now() / 1000)

    if (claims.iss !== iss) {
      throw new AuthSdkError('The issuer [' + claims.iss + '] ' +
        'does not match [' + iss + ']')
    }

    if (claims.aud !== aud) {
      throw new AuthSdkError('The audience [' + claims.aud + '] ' +
        'does not match [' + aud + ']')
    }

    if (claims.iat > claims.exp) {
      throw new AuthSdkError('The JWT expired before it was issued')
    }

    if ((now - sdk.options.maxClockSkew) > claims.exp) {
      throw new AuthSdkError('The JWT expired and is no longer valid')
    }

    if (claims.iat > (now + sdk.options.maxClockSkew)) {
      throw new AuthSdkError('The JWT was issued in the future')
    }
  },

  getOAuthUrls (sdk, options) {
    if (arguments.length > 2) {
      throw new AuthSdkError('As of version 3.0, "getOAuthUrls" takes only a single set of options')
    }
    options = options || {}

    // Get user-supplied arguments
    let authorizeUrl = util.removeTrailingSlash(options.authorizeUrl) || sdk.options.authorizeUrl
    const issuer = util.removeTrailingSlash(options.issuer) || sdk.options.issuer
    let userinfoUrl = util.removeTrailingSlash(options.userinfoUrl) || sdk.options.userinfoUrl
    let tokenUrl = util.removeTrailingSlash(options.tokenUrl) || sdk.options.tokenUrl
    let logoutUrl = util.removeTrailingSlash(options.logoutUrl) || sdk.options.logoutUrl
    let revokeUrl = util.removeTrailingSlash(options.revokeUrl) || sdk.options.revokeUrl

    const baseUrl = issuer

    authorizeUrl = authorizeUrl || baseUrl + '/api/v1/oauth2/authorize'
    userinfoUrl = userinfoUrl || baseUrl + '/api/v1/oauth2/userinfo'
    tokenUrl = tokenUrl || baseUrl + '/api/v1/oauth2/token'
    revokeUrl = revokeUrl || baseUrl + '/api/v1/oauth2/revoke'
    logoutUrl = logoutUrl || baseUrl + '/api/v1/logout'

    return {
      issuer: issuer,
      authorizeUrl: authorizeUrl,
      userinfoUrl: userinfoUrl,
      tokenUrl: tokenUrl,
      revokeUrl: revokeUrl,
      logoutUrl: logoutUrl
    }
  },

  urlParamsToObject (hashOrSearch) {
    // Predefine regexes for parsing hash
    const plus2space = /\+/g
    const paramSplit = /([^&=]+)=?([^&]*)/g
    let fragment = hashOrSearch

    // Some hash based routers will automatically add a / character after the hash
    if (fragment.charAt(0) === '#' && fragment.charAt(1) === '/') {
      fragment = fragment.substring(2)
    }

    // Remove the leading # or ?
    if (fragment.charAt(0) === '#' || fragment.charAt(0) === '?') {
      fragment = fragment.substring(1)
    }

    const obj = {}

    // Loop until we have no more params
    let param
    while (true) { // eslint-disable-line no-constant-condition
      param = paramSplit.exec(fragment)
      if (!param) {
        break
      }

      const key = param[1]
      const value = param[2]

      // id_token should remain base64url encoded
      if (key === 'id_token' || key === 'access_token' || key === 'code') {
        obj[key] = value
      } else {
        obj[key] = decodeURIComponent(value.replace(plus2space, ' '))
      }
    }
    return obj
  },

  hasTokensInHash (hash) {
    return /((id|access)_token=)/i.test(hash)
  },

  hasCodeInUrl (hashOrSearch) {
    return /([?&]+code=)/i.test(hashOrSearch)
  },

  /**
   * Check if tokens or a code have been passed back into the url
   */
  isLoginRedirect (sdk) {
    const authParams = sdk.options
    if (authParams.pkce || authParams.responseType === 'code' || authParams.responseMode === 'query') {
      // Look for code
      return authParams.responseMode === 'fragment'
        ? this.hasCodeInUrl(window.location.hash)
        : this.hasCodeInUrl(window.location.search)
    }
    // Look for tokens (Implicit OIDC flow)
    return this.hasTokensInHash(window.location.hash)
  }
}
