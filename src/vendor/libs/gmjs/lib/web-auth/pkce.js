import { AuthSdkError } from '../helper/error'
import http from './http'
import util from '../helper/util'

// Code verifier: Random URL-safe string with a minimum length of 43 characters.
// Code challenge: Base64 URL-encoded SHA-256 hash of the code verifier.
const MIN_VERIFIER_LENGTH = 43
const MAX_VERIFIER_LENGTH = 128
const DEFAULT_CODE_CHALLENGE_METHOD = 'S256'

function dec2hex (dec) {
  return ('0' + dec.toString(16)).substr(-2)
}

function getRandomString (length) {
  const a = new Uint8Array(Math.ceil(length / 2))
  crypto.getRandomValues(a)
  const str = Array.from(a, dec2hex).join('')
  return str.slice(0, length)
}

function generateVerifier (prefix) {
  let verifier = prefix || ''
  if (verifier.length < MIN_VERIFIER_LENGTH) {
    verifier = verifier + getRandomString(MIN_VERIFIER_LENGTH - verifier.length)
  }
  return encodeURIComponent(verifier).slice(0, MAX_VERIFIER_LENGTH)
}

function getStorage (sdk, options) {
  options = options || {}
  return sdk.options.storageUtil.getPKCEStorage(options)
}

function saveMeta (sdk, meta) {
  const storage = getStorage(sdk)
  storage.setStorage(meta)
}

function loadMeta (sdk) {
  let storage = getStorage(sdk)
  let obj = storage.getStorage()
  // Verify the Meta
  if (!obj.codeVerifier) {
    // If meta is not valid, try reading from localStorage.
    storage = getStorage(sdk, { preferLocalStorage: true })
    obj = storage.getStorage()
    if (!obj.codeVerifier) {
      // If meta is not valid, throw an exception to avoid misleading server-side error
      // The most likely cause of this error is trying to handle a callback twice
      throw new AuthSdkError('Could not load PKCE codeVerifier from storage')
    }
  }
  return obj
}

function clearMeta (sdk) {
  const storage = getStorage(sdk)
  storage.clearStorage()
}

function computeChallenge (str) {
  const buffer = new TextEncoder().encode(str)
  return crypto.subtle.digest('SHA-256', buffer).then(function (arrayBuffer) {
    const hash = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
    // url-safe base64 variant
    return util.stringToBase64Url(hash)
  })
}

function validateOptions (oauthOptions) {
  // Quick validation
  if (!oauthOptions.clientId) {
    throw new AuthSdkError('A clientId must be specified in the GhtkAuth constructor to get a token')
  }

  if (!oauthOptions.redirectUri) {
    throw new AuthSdkError('The redirectUri passed to /authorize must also be passed to /token')
  }

  if (!oauthOptions.authorizationCode) {
    throw new AuthSdkError('An authorization code (returned from /authorize) must be passed to /token')
  }

  if (!oauthOptions.codeVerifier) {
    throw new AuthSdkError('The "codeVerifier" (generated and saved by your app) must be passed to /token')
  }
}

function getPostData (options) {
  // Convert options to OAuth params
  const params = util.removeNils({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    grant_type: 'authorization_code',
    code: options.authorizationCode,
    code_verifier: options.codeVerifier
  })
  // Encode as URL string
  return util.toQueryParams(params).slice(1)
}

// exchange authorization code for an access token
function getToken (sdk, oauthOptions, urls) {
  validateOptions(oauthOptions)
  const data = getPostData(oauthOptions)

  return http.httpRequest(sdk, {
    url: urls.tokenUrl,
    method: 'POST',
    args: data,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export default {
  DEFAULT_CODE_CHALLENGE_METHOD,
  generateVerifier,
  clearMeta,
  saveMeta,
  loadMeta,
  computeChallenge,
  getToken
}
