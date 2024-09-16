import { GhtkAuth } from './index'
import browserStorage from './browserStorage'
import TokenChecker from './TokenChecker'

class AuthRedirectGuardMiddleware {
  constructor (config) {
    this.config = { transitionTimeout: 10, ...config }

    if (!this.config.clientId) {
      throw new Error('Missing client id')
    }

    this.ghtkAuth = new GhtkAuth(this.config)
    this.setIsAuthenticatedChecker(this.defaultAuthenticatedChecker)
    this.tokenChecker = new TokenChecker(this.config)
  }

  /**
   *
   * @param fn is a function check authenticate status
   * @returns {AuthRedirectGuardMiddleware}
   */
  setIsAuthenticatedChecker (fn) {
    this.isAuthenticatedChecker = fn
    return this
  }

  /**
   * Default authenticate checker will check the access token only
   * @returns {Promise<*>}
   */
  async defaultAuthenticatedChecker () {
    let isValid = false
    const tokenInfo = await this.ghtkAuth.tokenManager.get('accessToken')

    // If access token already exist in local storage
    if (tokenInfo && tokenInfo.accessToken && tokenInfo.accessToken.length) {
      isValid = await this.tokenChecker.setAccessToken(tokenInfo.accessToken).isValid()
    }

    return isValid
  }

  /**
   * Determine user logged in or not
   * @returns {*}
   */
  async isAuthenticated () {
    return await this.isAuthenticatedChecker()
  }

  /**
   * @param rawConfig
   * @returns {*}
   */
  buildAuthRedirectParams (rawConfig) {
    const config = rawConfig || {} // accept empty

    // Legacy support: allow a property named 'scope' to be either an array or a string.
    let scopes = config.scopes
    if (!scopes && config.scope) {
      if (Array.isArray(config.scope)) {
        scopes = config.scope
      } else {
        scopes = config.scope.split(/\s+/)
      }
    }

    // Legacy support: allow 'responseType' to be a string or an array
    let responseType = config.responseType || config.response_type
    if (typeof responseType === 'string' && responseType.indexOf(' ') >= 0) {
      responseType = responseType.split(/\s+/)
    }

    return {
      clientId: config.clientId || config.client_id,
      redirectUri: config.redirectUri || config.redirect_uri,
      responseType: responseType,
      scopes: scopes,
      ...config,
    }
  }

  /**
   * The middleware execute fn
   * @param fromPath
   * @param nextFn
   */
  async run (fromPath, nextFn) {
    if (!(await this.isAuthenticated())) {
      if (!getRefererPath(true)) {
        setRefererPath(fromPath || window.location.href.replace(window.location.origin, ''))
      }

      return this.ghtkAuth.token.getWithRedirect(this.buildAuthRedirectParams(this.config))
    }

    setTimeout(nextFn, this.config.transitionTimeout)
  }
}

/**
 * @param fromPath
 */
export function setRefererPath (fromPath) {
  if (!fromPath) {
    browserStorage.getLocalStorage().removeItem('referrerPath')
    return
  }

  browserStorage.getLocalStorage().setItem('referrerPath', fromPath)
}

/**
 * Get the referer path
 * @param keepIt {boolean}
 * @returns {string}
 */
export function getRefererPath (keepIt = false) {
  const refererPath = browserStorage.getLocalStorage().getItem('referrerPath') || ''

  if (!keepIt) {
    browserStorage.getLocalStorage().removeItem('referrerPath')
  }

  return refererPath
}

export default function (config) {
  return new AuthRedirectGuardMiddleware(config)
}
