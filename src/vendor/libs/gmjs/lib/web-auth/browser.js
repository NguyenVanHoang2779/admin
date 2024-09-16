import Emitter from 'tiny-emitter'
import * as Fingerprint2 from 'fingerprintjs2'
import * as UAParser from 'ua-parser-js'
import builderUtil from './builderUtil'
import util from '../helper/util'
import constants from './constants'
import http from './http'
import token from './token'
import oauthUtil from './oauthUtil'
import { PromiseQueue } from '../helper/PromiseQueue'
import { TokenManager } from './TokenManager'
import { AuthSdkError } from '../helper/error'
import SDK_VERSION from '../version'
import AuthStorageManager from './AuthStorageManager'

/**
 * GHTK Auth Builder
 * @param args
 * @constructor
 */
export function GhtkAuthBuilder (args) {
  const sdk = this

  builderUtil.assertValidConfig(args)

  this.options = {
    clientId: args.clientId,
    issuer: util.removeTrailingSlash(args.issuer),
    authorizeUrl: util.removeTrailingSlash(args.authorizeUrl),
    userinfoUrl: util.removeTrailingSlash(args.userinfoUrl),
    tokenUrl: util.removeTrailingSlash(args.tokenUrl),
    revokeUrl: util.removeTrailingSlash(args.revokeUrl),
    logoutUrl: util.removeTrailingSlash(args.logoutUrl),
    pkce: args.pkce !== false,
    redirectUri: args.redirectUri,
    postLogoutRedirectUri: args.postLogoutRedirectUri,
    responseMode: args.responseMode,
    httpRequestClient: args.httpRequestClient,
    storageUtil: args.storageUtil,
    headers: args.headers,
    onSessionExpired: args.onSessionExpired
  }

  this.userAgent = builderUtil.getUserAgent(args, `ghtk-auth-js/${SDK_VERSION}`)

  // Digital clocks will drift over time, so the server
  // can misalign with the time reported by the browser.
  // The maxClockSkew allows relaxing the time-based
  // validation of tokens (in seconds, not milliseconds).
  // It currently defaults to 300, because 5 min is the
  // default maximum tolerance allowed by Kerberos.
  // (https://technet.microsoft.com/en-us/library/cc976357.aspx)
  if (!args.maxClockSkew && args.maxClockSkew !== 0) {
    this.options.maxClockSkew = constants.DEFAULT_MAX_CLOCK_SKEW
  } else {
    this.options.maxClockSkew = args.maxClockSkew
  }

  sdk._tokenQueue = new PromiseQueue()
  sdk.token = {
    // getWithoutPrompt: util.bind(token.getWithoutPrompt, null, sdk),
    // getWithPopup: util.bind(token.getWithPopup, null, sdk),
    getWithRedirect: util.bind(token.getWithRedirect, null, sdk),
    prepareOauthParams: util.bind(token.prepareOauthParams, null, sdk),
    parseFromUrl: util.bind(token.parseFromUrl, null, sdk),
    decode: token.decodeToken,
    revoke: util.bind(token.revokeToken, null, sdk),
    renew: util.bind(token.renewToken, null, sdk),
    getUserInfo: util.bind(token.getUserInfo, null, sdk),
    verify: util.bind(token.verifyToken, null, sdk),
    isLoginRedirect: util.bind(oauthUtil.isLoginRedirect, null, sdk)
  }
  // Wrap all async token API methods using MethodQueue to avoid issues with concurrency
  Object.keys(sdk.token).forEach(key => {
    if (key === 'decode') { // sync methods should not be wrapped
      return
    }
    const method = sdk.token[key]
    sdk.token[key] = util.bind(PromiseQueue.prototype.push, sdk._tokenQueue, method, null)
  })
  // This is exposed so we can set window.location in our tests
  sdk.token.getWithRedirect._setLocation = function (url) {
    window.location = url
  }

  // This is exposed so we can mock getting window.history in our tests
  sdk.token.parseFromUrl._getHistory = function () {
    return window.history
  }

  // This is exposed so we can mock getting window.location in our tests
  sdk.token.parseFromUrl._getLocation = function () {
    return window.location
  }

  // This is exposed so we can mock getting window.document in our tests
  sdk.token.parseFromUrl._getDocument = function () {
    return window.document
  }

  sdk.fingerprint._getUserAgent = function () {
    return navigator.userAgent
  }

  const isWindowsPhone = /windows phone|iemobile|wpdesktop/i
  sdk.features.isFingerprintSupported = function () {
    const agent = sdk.fingerprint._getUserAgent()
    return agent && !isWindowsPhone.test(agent)
  }

  sdk.emitter = new Emitter()
  sdk.tokenManager = new TokenManager(sdk, args.tokenManager)
  sdk.tokenManager.on('error', this._onTokenManagerError, this)
}

const proto = GhtkAuthBuilder.prototype
proto._onTokenManagerError = function (error) {
  const code = error.errorCode
  if (code === 'login_required' && error.accessToken) {
    if (this.options.onSessionExpired) {
      this.options.onSessionExpired()
    } else {
      // eslint-disable-next-line no-console
      console.error('Session has expired or was closed outside the application.')
    }
  }
}

proto.features = {}

/**
 * Check if current browser supports crypto function
 * @return {boolean}
 */
proto.features.isTokenVerifySupported = function () {
  return typeof crypto !== 'undefined' && crypto.subtle && typeof Uint8Array !== 'undefined'
}

/**
 * Check if current browser supports textEncoder function
 * @return {boolean}
 */
proto.features.hasTextEncoder = function () {
  return typeof TextEncoder !== 'undefined'
}

/**
 * Check if current browser is valid for PKCE flow
 * @return {boolean}
 */
proto.features.isPKCESupported = function () {
  return proto.features.isTokenVerifySupported() && proto.features.hasTextEncoder()
}

/**
 * Check if current location is https
 * @return {boolean}
 */
proto.features.isHTTPS = function () {
  return window.location.protocol === 'https:'
}

/**
 * Check if current location is localhost
 * @return {boolean}
 */
proto.features.isLocalhost = function () {
  return window.location.hostname === 'localhost'
}

/**
 * GHTK issuer URL format like https://auth.ghtk.vn
 *
 * @return {string}
 */
proto.getIssuerOrigin = function () {
  return this.options.issuer
}

// { username, password }

/**
 *
 * @param opts
 * @return {Promise<string>}
 */
proto.signIn = async function (opts) {
  const sdk = this
  opts = util.clone(opts || {})

  /**
   *
   * @param options
   * @return {Promise<unknown>}
   */
  function postToTransaction (options) {
    return http.post(sdk, '/api/v1/authn', opts, options)
  }

  let transactionOptions = {}
  const fingerprint = await sdk.fingerprint()
  // if can get fingerprint
  if (fingerprint) {
    transactionOptions = {
      headers: {
        'X-Device-Fingerprint': fingerprint
      }
    }
  }

  try {
    const response = await postToTransaction(transactionOptions)
    const transactionState = this.getTransactionStateFromSignInResponse(response)
    this.storeAuthnData(response)
    return transactionState
  } catch (e) {
    // console.log(e)
    // switch (true) {
    //   case e.xhr && e.xhr.dataJSON && e.xhr.dataJSON.detail && e.xhr.dataJSON.detail.error_code === 'invalid_captcha':
    //     return constants.TRANSACTION_STATUS.INVALID_CAPTCHA
    //   case e.xhr && e.xhr.headers && e.xhr.headers['captcha-require'] && e.xhr.headers['captcha-require'] === '1':
    //     return constants.TRANSACTION_STATUS.REQUIRE_CAPTCHA
    //   case e.xhr && e.xhr.dataJSON && e.xhr.dataJSON.detail && e.xhr.dataJSON.detail.error_code === 'authn_fail':
    //     return constants.TRANSACTION_STATUS.AUTHN_FAIL
    // }
    //
    // return constants.TRANSACTION_STATUS.AUTHN_UNKNOWN
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
}

/**
 *
 * @param response
 */
proto.storeAuthnData = function (response) {
  const data = response.dataJSON

  if (!data) {
    return
  }

  // Store session
  if (data.ss_expires_at) {
    AuthStorageManager.setSession({ signedIn: true, expiresAt: data.ss_expires_at })
  }

  // Store account info
  AuthStorageManager.setAccount({ id: data.account_id, info: data.account_info })

  // Store account factor
  AuthStorageManager.setAccountFactors({ factors: data.account_factors })
}

/**
 *
 * @param {Object} response
 * @return {string}
 */
proto.getTransactionStateFromSignInResponse = function (response) {
  // let transactionState = constants.TRANSACTION_STATUS.AUTHN_SERVER_ERROR
  let transactionState = constants.STATE.UNKNOWN
  if (response.ok) {
    // in 2xx range
    // get state name from backend api
    let stateCodeFromAPI = ''
    if (response.rawData.data && response.rawData.data.state && response.rawData.data.state.name) {
      stateCodeFromAPI = response.rawData.data.state.name
    }
    switch (stateCodeFromAPI) {
      case 'success':
        // transactionState = constants.TRANSACTION_STATUS.AUTHN_SUCCESS
        transactionState = constants.STATE.AUTHN.SUCCESS
        break
      case 'mfa_required':
        // transactionState = constants.TRANSACTION_STATUS.AUTHN_MFA_REQUIRED
        transactionState = constants.STATE.AUTHN.MFA_REQUIRED
        break
      case 'mfa_challenge':
        transactionState = constants.STATE.AUTHN.MFA_CHALLENGE
        break
      case 'mfa_enroll':
        transactionState = constants.STATE.AUTHN.MFA_ENROLL
        break
      case 'mfa_enroll_active':
        transactionState = constants.STATE.AUTHN.MFA_ENROLL_ACTIVE
        break
      case 'recovery':
        transactionState = constants.STATE.AUTHN.RECOVERY
        break
      case 'recovery_challenge':
        transactionState = constants.STATE.AUTHN.RECOVERY_CHALLENGE
        break
      case 'password_reset':
        transactionState = constants.STATE.AUTHN.PASSWORD_RESET
        break
      case 'password_expired':
        // transactionState = constants.TRANSACTION_STATUS.AUTHN_PASSWORD_EXPIRED
        transactionState = constants.STATE.AUTHN.PASSWORD_EXPIRED
        break
      case 'unauthenticated':
        transactionState = constants.STATE.AUTHN.UNAUTHENTICATED
        break
      default:
        // transactionState = constants.TRANSACTION_STATUS.AUTHN_FAIL
        transactionState = constants.STATE.UNKNOWN_AUTHN_STATE
        break
    }
  } else {
    // check require captcha
    if (response.status >= 400 && response.status <= 499) {
      if (response.headers['captcha-require'] && response.headers['captcha-require'] === '1') {
        transactionState = constants.STATE.REQUIRE_CAPTCHA
      }
    }

    // ranges: 4xx, 5xx
    if (response.status >= 400) {
      let errorCodeFromAPI = ''
      if (response.rawData.detail && response.rawData.detail.error_code) {
        errorCodeFromAPI = response.rawData.detail.error_code
      }
      transactionState = constants.STATE.UNKNOWN_ERROR_STATE
      switch (response.status) {
        case 400:
          if (errorCodeFromAPI === 'invalid_api_condition') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_API_CONDITION
          } else if (errorCodeFromAPI === 'illegal_request_param') {
            transactionState = constants.STATE.ERROR.CLIENT.ILLEGAL_REQUEST_PARAM
          } else if (errorCodeFromAPI === 'illegal_request') {
            transactionState = constants.STATE.ERROR.CLIENT.ILLEGAL_REQUEST
          } else if (errorCodeFromAPI === 'invalid_captcha') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_CAPTCHA
          } else if (errorCodeFromAPI === 'resource_duplicated') {
            transactionState = constants.STATE.ERROR.CLIENT.RESOURCE_DUPLICATED
          } else if (errorCodeFromAPI === 'exceed_secondary_contact_limit') {
            transactionState = constants.STATE.ERROR.CLIENT.EXCEED_SECONDARY_CONTACT_LIMIT
          }
          break
        case 401:
          if (errorCodeFromAPI === 'authn_fail') {
            transactionState = constants.STATE.ERROR.CLIENT.AUTHN_FAIL
          } else if (errorCodeFromAPI === 'password_expired') {
            transactionState = constants.STATE.ERROR.CLIENT.PASSWORD_EXPIRED
          } else if (errorCodeFromAPI === 'login_required') {
            transactionState = constants.STATE.ERROR.CLIENT.LOGIN_REQUIRED
          } else if (errorCodeFromAPI === 'consent_required') {
            transactionState = constants.STATE.ERROR.CLIENT.CONSENT_REQUIRED
          } else if (errorCodeFromAPI === 'invalid_token') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_TOKEN
          } else if (errorCodeFromAPI === 'invalid_authz_code') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_AUTHZ_CODE
          } else if (errorCodeFromAPI === 'invalid_pkce_code') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_PKCE_CODE
          } else if (errorCodeFromAPI === 'invalid_recovery_token') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_RECOVERY_TOKEN
          } else if (errorCodeFromAPI === 'invalid_refresh_token') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_REFRESH_TOKEN
          } else if (errorCodeFromAPI === 'invalid_temp_access_code') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_TEMP_ACCESS_CODE
          }
          break
        case 403:
          if (errorCodeFromAPI === 'permission_denied') {
            transactionState = constants.STATE.ERROR.CLIENT.PERMISSION_DENIED
          } else if (errorCodeFromAPI === 'exceed_session_limit') {
            transactionState = constants.STATE.ERROR.CLIENT.EXCEED_SESSION_LIMIT
          } else if (errorCodeFromAPI === 'password_policy_violation') {
            transactionState = constants.STATE.ERROR.CLIENT.PASSWORD_POLICY_VIOLATION
          } else if (errorCodeFromAPI === 'security_policy_violation') {
            transactionState = constants.STATE.ERROR.CLIENT.SECURITY_POLICY_VIOLATION
          } else if (errorCodeFromAPI === 'invalid_session') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_SESSION
          } else if (errorCodeFromAPI === 'invalid_authn_token') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_AUTHN_TOKEN
          } else if (errorCodeFromAPI === 'illegal_authn_state') {
            transactionState = constants.STATE.ERROR.CLIENT.ILLEGAL_AUTHN_STATE
          } else if (errorCodeFromAPI === 'invalid_passcode') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_PASSCODE
          } else if (errorCodeFromAPI === 'invalid_client') {
            transactionState = constants.STATE.ERROR.CLIENT.INVALID_CLIENT
          } else if (errorCodeFromAPI === 'exceed_direct_token_limit') {
            transactionState = constants.STATE.ERROR.CLIENT.EXCEED_DIRECT_TOKEN_LIMIT
          } else if (errorCodeFromAPI === 'exceed_temp_access_limit') {
            transactionState = constants.STATE.ERROR.CLIENT.EXCEED_TEMP_ACCESS_LIMIT
          }
          break
        case 404:
          if (errorCodeFromAPI === 'resource_not_found') {
            transactionState = constants.STATE.ERROR.CLIENT.RESOURCE_NOT_FOUND
          }
          break
        case 429:
          if (errorCodeFromAPI === 'email_too_many_request') {
            transactionState = constants.STATE.ERROR.CLIENT.EMAIL_TOO_MANY_REQUEST
          } else if (errorCodeFromAPI === 'sms_too_many_request') {
            transactionState = constants.STATE.ERROR.CLIENT.SMS_TOO_MANY_REQUEST
          } else if (errorCodeFromAPI === 'too_many_request') {
            transactionState = constants.STATE.ERROR.CLIENT.TOO_MANY_REQUEST
          }
          break
        case 500:
          if (errorCodeFromAPI === 'internal_error') {
            transactionState = constants.STATE.ERROR.SERVER.INTERNAL_ERROR
          } else if (errorCodeFromAPI === 'notify_sms_fail') {
            transactionState = constants.STATE.ERROR.SERVER.NOTIFY_SMS_FAIL
          } else if (errorCodeFromAPI === 'notify_email_fail') {
            transactionState = constants.STATE.ERROR.SERVER.NOTIFY_EMAIL_FAIL
          }
          break
        case 502:
          transactionState = constants.STATE.ERROR.SERVER.BAD_GATEWAY
          break
        case 503:
          transactionState = constants.STATE.ERROR.SERVER.SERVICE_UNAVAILABLE
          break
        case 504:
          transactionState = constants.STATE.ERROR.SERVER.GATEWAY_TIMEOUT
          break
      }
    }

    // if (response.status === 400 || response.status === 401) {
    //   transactionState = constants.TRANSACTION_STATUS.AUTHN_FAIL
    // }
  }

  return transactionState
}

/**
 * Ends the current GHTK SSO session without redirecting
 * @param accessToken
 * @return {Promise<unknown>}
 */
proto.closeSession = function closeSession (accessToken) {
  const sdk = this

  // Clear all local tokens
  sdk.tokenManager.clear()

  return http.get(sdk, '/api/v1/logout', { accessToken })
    .catch(function (e) {
      if (e.name === 'AuthApiError') {
        // Session does not exist or has already been closed
        return
      }
      throw e
    })
}

/**
 * Revokes the access token for the application session
 * @param accessToken
 * @return {Promise<void|*>}
 */
proto.revokeAccessToken = async function revokeAccessToken (accessToken) {
  const sdk = this
  if (!accessToken) {
    accessToken = await sdk.tokenManager.get('accessToken')
  }
  // Access token may have been removed. In this case, we will silently succeed.
  if (!accessToken) {
    return Promise.resolve()
  }
  return sdk.token.revoke(accessToken)
}

/**
 * Revokes accessToken, clears all local tokens, then redirects to Okta to end the SSO session.
 * @param options
 * @return {Promise<void>}
 */
proto.signOut = async function (options) {
  options = util.extend({}, options)

  // postLogoutRedirectUri must be whitelisted in Okta Admin UI
  const defaultUri = window.location.origin
  const postLogoutRedirectUri = options.postLogoutRedirectUri ||
    this.options.postLogoutRedirectUri ||
    defaultUri

  let accessToken = options.accessToken
  const revokeAccessToken = options.revokeAccessToken !== false

  const sdk = this

  if (revokeAccessToken && typeof accessToken === 'undefined') {
    accessToken = await sdk.tokenManager.get('accessToken')
  }

  // Clear all local tokens
  sdk.tokenManager.clear()

  // Clear all sign in storage
  AuthStorageManager.setAccountFactors({})
  AuthStorageManager.setAccount({})
  AuthStorageManager.setSession({})
  AuthStorageManager.setAuthnState(null)

  if (revokeAccessToken && accessToken) {
    await sdk.revokeAccessToken(accessToken)
  }

  // Do not close session if current session is temp access
  if (accessToken && accessToken.isTempAccessLogin) {
    window.location = '/'
  } else {
    return sdk.closeSession(accessToken) // can throw if the user cannot be signed out
      .then(function () {
        localStorage.clear()
        if (postLogoutRedirectUri === defaultUri) {
          window.location.reload()
        } else {
          window.location.assign(postLogoutRedirectUri)
        }
      })
  }
}

/**
 * Post OTP Challenge
 * @param {string} factorId
 * @param {{token: string}} opts
 * @return {Promise<string>}
 */
proto.otpChallenge = async function (factorId, opts) {
  try {
    const response = await http.post(this, '/api/v1/authn/factors/' + factorId + '/challenge', opts)
    const transactionState = this.getTransactionStateFromSignInResponse(response)
    this.storeAuthnData(response)
    return transactionState
  } catch (e) {
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
}

/**
 * Post passcode to verify
 * @param {string} factorId
 * @param {{token: string, passcode: string}} opts
 * @return {Promise<string>}
 */
proto.otpVerify = async function (factorId, opts) {
  try {
    const response = await http.post(this, '/api/v1/authn/factors/' + factorId + '/verify', opts)
    const transactionState = this.getTransactionStateFromSignInResponse(response)
    this.storeAuthnData(response)
    return transactionState
  } catch (e) {
    // let state = constants.TRANSACTION_STATUS.AUTHN_UNKNOWN
    // if (e.xhr && e.xhr.dataJSON && e.xhr.dataJSON.detail && e.xhr.dataJSON.detail.error_code) {
    //   switch (e.xhr.dataJSON.detail.error_code) {
    //     case 'invalid_authn_token':
    //       state = constants.TRANSACTION_STATUS.INVALID_AUTHN_TOKEN
    //       break
    //
    //     case 'invalid_passcode':
    //       state = constants.TRANSACTION_STATUS.INVALID_PASSCODE
    //       break
    //   }
    // }
    //
    // return state
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
}

/**
 * Request to recover password
 * @param {{username: string, factor_type: string}} opts
 * @return {Promise<string>}
 */
proto.forgotPassword = async function (opts) {
  try {
    const response = await http.post(this, '/api/v1/authn/recovery/password', opts)
    if (response.ok) {
      AuthStorageManager.setAuthnState(response.dataJSON.state)
      // return constants.TRANSACTION_STATUS.RECOVERY_CHALLENGE
    }
    return this.getTransactionStateFromSignInResponse(response)
  } catch (e) {
    // return constants.TRANSACTION_STATUS.RECOVERY_CHALLENGE_FAIL
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
  // return constants.TRANSACTION_STATUS.RECOVERY_CHALLENGE_FAIL
}

/**
 * Verify recovery
 * @param {string} factorType
 * @param {{token: string, passcode: string}} opts
 * @return {Promise<string|*>}
 */
proto.verifyRecoveryToken = async function (factorType, opts) {
  try {
    const response = await http.post(this, '/api/v1/authn/recovery/factors/' + factorType + '/verify', opts)
    const transactionState = this.getTransactionStateFromSignInResponse(response)
    if (response.ok) {
      AuthStorageManager.setAuthnState(response.dataJSON.state)
      // return constants.TRANSACTION_STATUS.RECOVERY
      if (transactionState === constants.STATE.AUTHN.RECOVERY) {
        AuthStorageManager.setRecoveryQuestion(response.dataJSON.recovery_question)
      }
    }

    return transactionState
  } catch (e) {
    // let state = constants.TRANSACTION_STATUS.RECOVERY_FAIL
    // if (e.xhr && e.xhr.dataJSON && e.xhr.dataJSON.detail && e.xhr.dataJSON.detail.error_code) {
    //   switch (e.xhr.dataJSON.detail.error_code) {
    //     case 'invalid_authn_token':
    //       state = constants.TRANSACTION_STATUS.INVALID_AUTHN_TOKEN
    //       break
    //
    //     case 'invalid_recovery_token':
    //       state = constants.TRANSACTION_STATUS.INVALID_RECOVERY_TOKEN
    //       break
    //
    //     case 'invalid_passcode':
    //       state = constants.TRANSACTION_STATUS.INVALID_PASSCODE
    //       break
    //   }
    // }
    //
    // return state
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
  // return constants.TRANSACTION_STATUS.RECOVERY_FAIL
}

/**
 * Call verify recovery question
 * @param {{token: string, answer: string}} opts
 * @return {Promise<string>}
 */
proto.verifyRecoveryQuestion = async function (opts) {
  try {
    const response = await http.post(this, '/api/v1/authn/recovery/answer', opts)
    if (response.ok) {
      AuthStorageManager.setAuthnState(response.dataJSON.state)
    }
    return this.getTransactionStateFromSignInResponse(response)
  } catch (e) {
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
}

/**
 * Call reset password
 * @param {{token: string, new_password: string}} opts
 * @return {Promise<string|*>}
 */
proto.resetPassword = async function (opts) {
  try {
    const response = await http.post(this, '/api/v1/authn/credentials/reset_password', opts)
    if (response.ok) {
      AuthStorageManager.setAuthnState(response.dataJSON.state)
      // return constants.TRANSACTION_STATUS.PASSWORD_RESET
    }
    return this.getTransactionStateFromSignInResponse(response)
  } catch (e) {
    // return constants.TRANSACTION_STATUS.PASSWORD_RESET_FAIL
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
  // return constants.TRANSACTION_STATUS.PASSWORD_RESET_FAIL
}

/**
 * Call change password
 * @param {{token: string, old_password: string, new_password: string}} opts
 * @return {Promise<string|*>}
 */
proto.changePassword = async function (opts) {
  try {
    const response = await http.post(this, '/api/v1/authn/credentials/change_password', opts)
    const transactionState = this.getTransactionStateFromSignInResponse(response)
    this.storeAuthnData(response)
    return transactionState
  } catch (e) {
    // return constants.TRANSACTION_STATUS.AUTHN_UNKNOWN
    return constants.STATE.UNKNOWN_ERROR_STATE
  }
}

/**
 * Authentication with temp access
 * @param shortCode
 * @param codeChallenge
 * @param codeChallengeMethod
 * @param state
 * @return {Promise<*>}
 */
proto.authWithTempAccess = async function (shortCode, codeChallenge, codeChallengeMethod, state) {
  const params = new URLSearchParams()
  params.set('short_code', shortCode)
  params.set('code_challenge', codeChallenge)
  params.set('code_challenge_method', codeChallengeMethod)
  params.set('state', state)
  const response = await http.get(this, `/api/v1/oauth2/temp_access?${params.toString()}`)
  return response.dataJSON.redirect_uri
}

/**
 * Get temp access information
 * @param shortCode
 * @return {Promise<*>}
 */
proto.getTempAccessInfo = async function (shortCode) {
  const response = await http.get(this, `/api/v1/oauth2/temp_access_info/${shortCode}`)
  return response.dataJSON.temp_access_redirect_uri
}

/**
 * get login settings
 * @return {Promise<{}|Object.data.data>}
 */
proto.getLoginSettings = async function () {
  const response = await http.get(this, '/api/v1/authn/login_setting')
  return response.dataJSON
}

/**
 * introspect access token
 * @param token
 * @param tokenTypeHint
 * @param basicAuthCredential
 * @return {Promise<any>}
 */
proto.introspectAccessToken = async function (token, tokenTypeHint, basicAuthCredential) {
  const response = await http.post(
    this, '/api/v1/oauth2/introspect',
    { token, token_type_hint: tokenTypeHint },
    {
      cacheResponse: true,
      // Cache response in 2 minutes
      cacheResponseDuration: 60 * 2,
      headers: {
        Authorization: `Basic ${btoa(basicAuthCredential)}`
      }
    }
  )

  // Clear http cache if token inactive
  if (response.dataJSON.active !== true) {
    this.options.storageUtil.getHttpCache().clearStorage(`${this.getIssuerOrigin()}/api/v1/oauth2/introspect`)
  }

  return response
}

/**
 * generate fingerprint for browser
 * @return {Promise<unknown>}
 */
proto.fingerprint = async function () {
  const sdk = this
  if (!sdk.features.isFingerprintSupported()) {
    return Promise.reject(new AuthSdkError('Fingerprinting is not supported on this device'))
  }

  // https://gist.github.com/zmts/b26ba9a61aa0b93126fc6979e7338ca3
  return new Promise((resolve, reject) => {
    async function getHash () {
      const options = {
        excludes: {
          plugins: true,
          localStorage: true,
          adBlock: true,
          screenResolution: true,
          availableScreenResolution: true,
          enumerateDevices: true,
          pixelRatio: true,
          doNotTrack: true
        },
        preprocessor: (key, value) => {
          if (key === 'userAgent') {
            const parser = new UAParser(value)
            // return customized user agent (without browser version)
            return `${parser.getOS().name} :: ${parser.getBrowser().name} :: ${parser.getEngine().name}`
          }
          return value
        }
      }

      try {
        const components = await Fingerprint2.getPromise(options)
        const values = components.map(component => component.value)
        // console.log('fingerprint hash components', components)

        return String(Fingerprint2.x64hash128(values.join(''), 31))
      } catch (e) {
        reject(e)
      }
    }

    if (window.requestIdleCallback) {
      // console.log('get fp hash @ requestIdleCallback')
      requestIdleCallback(async () => resolve(await getHash()))
    } else {
      // console.log('get fp hash @ setTimeout')
      setTimeout(async () => resolve(await getHash()), 500)
    }
  })
}
