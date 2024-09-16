import util from '../helper/util'
import oauthUtil from './oauthUtil'
import http from './http'
import PKCE from './pkce'
import constants from './constants'
import storageUtil from './browserStorage'
// import { storageBuilder } from './storageBuilder'
import { AuthSdkError, OAuthError, AuthApiError } from '../helper/error'

// Only the access token can be revoked in SPA applications
function revokeToken (sdk, token) {
  return Promise.resolve()
    .then(function () {
      if (!token || !token.accessToken) {
        throw new AuthSdkError('A valid access token object is required')
      }
      const clientId = sdk.options.clientId
      if (!clientId) {
        throw new AuthSdkError('A clientId must be specified in the GhtkAuth constructor to revoke a token')
      }
      const revokeUrl = oauthUtil.getOAuthUrls(sdk).revokeUrl
      const accessToken = token.accessToken
      const args = util.toQueryParams({
        // eslint-disable-next-line camelcase
        token_type_hint: 'access_token',
        token: accessToken
      }).slice(1)
      const creds = btoa(`${clientId}:`)
      return http.post(sdk, revokeUrl, args, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + creds
        }
      })
    })
}

function decodeToken (token) {
  const jwt = token.split('.')
  let decodedToken

  try {
    decodedToken = {
      header: JSON.parse(util.base64UrlToString(jwt[0])),
      payload: JSON.parse(util.base64UrlToString(jwt[1])),
      signature: jwt[2]
    }
  } catch (e) {
    throw new AuthSdkError('Malformed token')
  }

  return decodedToken
}

// Verify the id token
function verifyToken (sdk, token, validationParams) {
  return Promise.resolve()
    .then(function () {
      if (!token || !token.idToken) {
        throw new AuthSdkError('Only idTokens may be verified')
      }

      const validationOptions = {
        clientId: sdk.options.clientId,
        issuer: sdk.options.issuer,
        ignoreSignature: sdk.options.ignoreSignature
      }

      util.extend(validationOptions, validationParams)

      // Standard claim validation
      const jwt = decodeToken(token.idToken)
      oauthUtil.validateClaims(sdk, jwt.payload, validationOptions)

      return token
    })
}

function exchangeCodeForToken (sdk, oauthParams, authorizationCode, urls) {
  // PKCE authorization_code flow
  // Retrieve saved values and build oauthParams for call to /token
  const meta = PKCE.loadMeta(sdk)
  const getTokenParams = {
    clientId: oauthParams.clientId,
    authorizationCode: authorizationCode,
    codeVerifier: meta.codeVerifier,
    redirectUri: meta.redirectUri
  }
  return PKCE.getToken(sdk, getTokenParams, urls)
    .then(function (res) {
      if (res.ok) {
        validateResponse(res, getTokenParams)
        return res.dataJSON
      } else {
        throw new AuthApiError('Error when exchange code for token', res.dataJSON)
      }
    })
    .finally(function () {
      // TODO
      // PKCE.clearMeta(sdk)
    })
}

function validateResponse (res, oauthParams) {
  if (res.error || res.error_description) {
    throw new OAuthError(res.error, res.error_description)
  }

  if (res.state !== oauthParams.state) {
    throw new AuthSdkError('OAuth flow response state doesn\'t match request state')
  }
}

function handleOAuthResponse (sdk, oauthParams, res, urls) {
  urls = urls || {}

  let responseType = oauthParams.responseType
  if (!Array.isArray(responseType)) {
    responseType = [responseType]
  }

  const scopes = util.clone(oauthParams.scopes)
  const clientId = oauthParams.clientId || sdk.options.clientId
  const pkce = sdk.options.pkce !== false

  return Promise.resolve()
    .then(function () {
      validateResponse(res, oauthParams)

      // PKCE flow
      // We do not support "hybrid" scenarios where the response includes both a code and a token.
      // If the response contains a code it is used immediately to obtain new tokens.
      if (res.code && pkce) {
        // responseType is not sent to the token endpoint.
        // We populate this array to validate the response below
        responseType = ['token'] // an accessToken will always be returned
        if (scopes.indexOf('openid') !== -1) {
          responseType.push('id_token') // an idToken will be returned if "openid" is in the scopes
        }
        return exchangeCodeForToken(sdk, oauthParams, res.code, urls)
      } else {
        return res
      }
    }).then(function (res) {
      const tokenDict = {}
      const expiresIn = res.expires_in
      const tokenType = res.token_type
      const accessToken = res.access_token
      const idToken = res.id_token

      if (accessToken) {
        tokenDict.accessToken = {
          value: accessToken,
          accessToken: accessToken,
          expiresAt: Number(expiresIn) + Math.floor(Date.now() / 1000),
          tokenType: tokenType,
          scopes: scopes,
          authorizeUrl: urls.authorizeUrl,
          userinfoUrl: urls.userinfoUrl
        }
      }

      if (idToken) {
        const jwt = sdk.token.decode(idToken)

        const idTokenObj = {
          value: idToken,
          idToken: idToken,
          claims: jwt.payload,
          expiresAt: jwt.payload.exp,
          scopes: scopes,
          authorizeUrl: urls.authorizeUrl,
          issuer: urls.issuer,
          clientId: clientId
        }

        const validationParams = {
          clientId: clientId,
          issuer: urls.issuer,
          nonce: oauthParams.nonce,
          accessToken: accessToken
        }

        if (oauthParams.ignoreSignature !== undefined) {
          validationParams.ignoreSignature = oauthParams.ignoreSignature
        }

        return verifyToken(sdk, idTokenObj, validationParams)
          .then(function () {
            tokenDict.idToken = idTokenObj
            return tokenDict
          })
      }

      return tokenDict
    })
    .then(function (tokenDict) {
      // Validate received tokens against requested response types
      if (responseType.indexOf('token') !== -1 && !tokenDict.accessToken) {
        // eslint-disable-next-line max-len
        throw new AuthSdkError('Unable to parse OAuth flow response: response type "token" was requested but "access_token" was not returned.')
      }
      // if (responseType.indexOf('id_token') !== -1 && !tokenDict.idToken) {
      //   // eslint-disable-next-line max-len
      //   throw new AuthSdkError('Unable to parse OAuth flow response: response type "id_token" was requested but "id_token" was not returned.')
      // }

      return {
        tokens: tokenDict,
        state: res.state,
        code: res.code
      }
    })
}

function getDefaultOAuthParams (sdk) {
  return {
    pkce: sdk.options.pkce,
    clientId: sdk.options.clientId,
    redirectUri: sdk.options.redirectUri || window.location.href,
    responseType: ['token', 'id_token'],
    responseMode: sdk.options.responseMode,
    state: oauthUtil.generateState(),
    scopes: ['openid'],
    ignoreSignature: sdk.options.ignoreSignature
  }
}

function convertOAuthParamsToQueryParams (oauthParams) {
  // Quick validation
  if (!oauthParams.clientId) {
    throw new AuthSdkError('A clientId must be specified in the GhtkAuth constructor to get a token')
  }

  if (util.isString(oauthParams.responseType) && oauthParams.responseType.indexOf(' ') !== -1) {
    throw new AuthSdkError('Multiple OAuth responseTypes must be defined as an array')
  }

  // Convert our params to their actual OAuth equivalents
  const oauthQueryParams = util.removeNils({
    client_id: oauthParams.clientId,
    code_challenge: oauthParams.codeChallenge,
    code_challenge_method: oauthParams.codeChallengeMethod,
    redirect_uri: oauthParams.redirectUri,
    response_mode: oauthParams.responseMode,
    response_type: oauthParams.responseType,
    state: oauthParams.state
  })

  const arr = ['response_type']
  arr.forEach(function (mayBeArray) {
    if (Array.isArray(oauthQueryParams[mayBeArray])) {
      oauthQueryParams[mayBeArray] = oauthQueryParams[mayBeArray].join(' ')
    }
  })
  oauthQueryParams.scope = oauthParams.scopes.join(' ')

  return oauthQueryParams
}

function buildAuthorizeParams (oauthParams) {
  const oauthQueryParams = convertOAuthParamsToQueryParams(oauthParams)
  return util.toQueryParams(oauthQueryParams)
}

function prepareOauthParams (sdk, options) {
  if (oauthUtil.isLoginRedirect(sdk)) {
    return Promise.reject(new AuthSdkError(
      'The app should not attempt to call getToken on callback. ' +
      'Authorize flow is already in process. Use parseFromUrl() to receive tokens.'
    ))
  }

  // clone and prepare options
  options = util.clone(options) || {}

  // build params using defaults + options
  const oauthParams = getDefaultOAuthParams(sdk)
  util.extend(oauthParams, options)

  if (oauthParams.pkce === false) {
    return Promise.resolve(oauthParams)
  }

  // PKCE flow
  if (!sdk.features.isPKCESupported()) {
    let errorMessage = 'PKCE requires a modern browser with encryption support running in a secure context.'
    if (!sdk.features.isHTTPS()) {
      // eslint-disable-next-line max-len
      errorMessage += '\nThe current page is not being served with HTTPS protocol. ' +
        'PKCE requires secure HTTPS protocol.'
    }
    if (!sdk.features.hasTextEncoder()) {
      // eslint-disable-next-line max-len
      errorMessage += '\n"TextEncoder" is not defined. ' +
        'To use PKCE, you may need to include a polyfill/shim for this browser.'
    }
    return Promise.reject(new AuthSdkError(errorMessage))
  }

  // set default code challenge method, if none provided
  if (!oauthParams.codeChallengeMethod) {
    oauthParams.codeChallengeMethod = PKCE.DEFAULT_CODE_CHALLENGE_METHOD
  }

  // responseType is forced
  oauthParams.responseType = 'code'

  return oauthUtil.getWellKnown(sdk, null)
    .then(function (response) {
      if (response.ok) {
        const methods = response.dataJSON.code_challenge_methods_supported || []
        if (methods.indexOf(oauthParams.codeChallengeMethod) === -1) {
          throw new AuthSdkError('Invalid code_challenge_method')
        }
      } else {
        throw new AuthApiError(response.dataJSON, response)
      }
    })
    .then(function () {
      // PKCE authorization_code flow
      const codeVerifier = PKCE.generateVerifier(oauthParams.codeVerifier)

      // We will need these values after redirect when we call /token
      const meta = {
        codeVerifier: codeVerifier,
        redirectUri: oauthParams.redirectUri
      }
      PKCE.saveMeta(sdk, meta)

      return PKCE.computeChallenge(codeVerifier)
    })
    .then(function (codeChallenge) {
      // Clone/copy the params. Set codeChallenge
      const clonedParams = util.clone(oauthParams) || {}
      util.extend(clonedParams, oauthParams, {
        codeChallenge: codeChallenge
      })
      return clonedParams
    })
}

function getWithRedirect (sdk, options) {
  if (arguments.length > 2) {
    return Promise.reject(new AuthSdkError('As of version 3.0, "getWithRedirect" takes only a single set of options'))
  }
  options = util.clone(options) || {}

  return prepareOauthParams(sdk, options)
    .then(function (oauthParams) {
      util.debugLS('debug_oauthParams', oauthParams)
      const urls = oauthUtil.getOAuthUrls(sdk, options)
      const requestUrl = urls.authorizeUrl + buildAuthorizeParams(oauthParams)

      // store the oauthParams
      storageUtil.getOauthParamsStorage().setStorage({
        clientId: oauthParams.clientId,
        responseType: oauthParams.responseType,
        state: oauthParams.state,
        scopes: oauthParams.scopes,
        urls: urls
      })

      util.delay(100).then(function () {
        sdk.token.getWithRedirect._setLocation(requestUrl)
      })
    })
}

function renewToken (sdk, token) {
  if (!oauthUtil.isToken(token)) {
    return Promise.reject(new AuthSdkError('Renew must be passed a token with ' +
      'an array of scopes and an accessToken or idToken'))
  }

  let responseType
  if (sdk.options.pkce) {
    responseType = 'code'
  } else if (token.accessToken) {
    responseType = 'token'
  } else {
    responseType = 'id_token'
  }

  return getWithRedirect(sdk, {
    responseType: responseType,
    scopes: token.scopes,
    authorizeUrl: token.authorizeUrl,
    userinfoUrl: token.userinfoUrl,
    issuer: token.issuer
  })
}

function parseFromUrl (sdk, options) {
  options = options || {}
  if (util.isString(options)) {
    options = { url: options }
  }

  const defaultResponseMode = sdk.options.pkce ? 'fragment' : 'query'

  const url = options.url
  const responseMode = options.responseMode || sdk.options.responseMode || defaultResponseMode
  const nativeLoc = sdk.token.parseFromUrl._getLocation()
  let paramStr

  if (responseMode === 'query') {
    paramStr = url ? url.substring(url.indexOf('?')) : nativeLoc.search
  } else {
    paramStr = url ? url.substring(url.indexOf('#')) : nativeLoc.hash
  }

  if (!paramStr) {
    return Promise.reject(new AuthSdkError('Unable to parse a token from the url'))
  }

  try {
    const oauthParams = storageUtil.getOauthParamsStorage().getStorage()
    const urls = oauthParams.urls

    return Promise.resolve(oauthUtil.urlParamsToObject(paramStr))
      .then(function (res) {
        if (!url) {
          // Clean hash or search from the url
          // TODO enable again
          // responseMode === 'query' ? removeSearch(sdk) : removeHash(sdk)
        }
        return handleOAuthResponse(sdk, oauthParams, res, urls)
      })
  } catch (e) {
    return Promise.reject(new AuthSdkError('Unable to parse the ' +
      constants.REDIRECT_OAUTH_PARAMS_COOKIE_NAME + ' : ' + e.message))
  }
}

async function getUserInfo (sdk, accessTokenObject, idTokenObject) {
  // If token objects were not passed, attempt to read from the TokenManager
  if (!accessTokenObject) {
    accessTokenObject = await sdk.tokenManager.get('accessToken')
  }
  if (!idTokenObject) {
    idTokenObject = await sdk.tokenManager.get('idToken')
  }

  if (!accessTokenObject ||
    (!oauthUtil.isToken(accessTokenObject) && !accessTokenObject.accessToken && !accessTokenObject.userinfoUrl)) {
    return Promise.reject(new AuthSdkError('getUserInfo requires an access token object'))
  }

  if (!idTokenObject ||
    (!oauthUtil.isToken(idTokenObject) && !idTokenObject.idToken)) {
    return Promise.reject(new AuthSdkError('getUserInfo requires an ID token object'))
  }

  return http.httpRequest(sdk, {
    url: accessTokenObject.userinfoUrl,
    method: 'GET',
    accessToken: accessTokenObject.accessToken
  })
    .then(userInfo => {
      // Only return the userinfo response if subjects match to mitigate token substitution attacks
      if (userInfo.sub === idTokenObject.claims.sub) {
        return userInfo
      }
      return Promise.reject(new AuthSdkError('getUserInfo request was rejected due to token mismatch'))
    })
    .catch(function (err) {
      if (err.xhr && (err.xhr.status === 401 || err.xhr.status === 403)) {
        let authenticateHeader
        if (err.xhr.headers && util.isFunction(err.xhr.headers.get) && err.xhr.headers.get('WWW-Authenticate')) {
          authenticateHeader = err.xhr.headers.get('WWW-Authenticate')
        } else if (util.isFunction(err.xhr.getResponseHeader)) {
          authenticateHeader = err.xhr.getResponseHeader('WWW-Authenticate')
        }
        if (authenticateHeader) {
          const errorMatches = authenticateHeader.match(/error="(.*?)"/) || []
          const errorDescriptionMatches = authenticateHeader.match(/error_description="(.*?)"/) || []
          const error = errorMatches[1]
          const errorDescription = errorDescriptionMatches[1]
          if (error && errorDescription) {
            err = new OAuthError(error, errorDescription)
          }
        }
      }
      throw err
    })
}

export default {
  revokeToken: revokeToken,
  // getToken: getToken,
  // getWithoutPrompt: getWithoutPrompt,
  // getWithPopup: getWithPopup,
  getWithRedirect: getWithRedirect,
  parseFromUrl: parseFromUrl,
  decodeToken: decodeToken,
  renewToken: renewToken,
  getUserInfo: getUserInfo,
  verifyToken: verifyToken,
  handleOAuthResponse: handleOAuthResponse,
  prepareOauthParams: prepareOauthParams
}
