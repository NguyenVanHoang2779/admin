import { GhtkAuth } from './index'
import assert from '../helper/assert'
import AuthStorageManager from './AuthStorageManager'
import { getRefererPath } from './AuthRedirectGuardMiddleware'
import storageUtil from './browserStorage'
import util from '../helper/util'

class OAuth2CallbackHandler {
  constructor (config) {
    this.config = config

    assert.check(
      config,
      { type: 'object', message: 'input config is not valid' },
      {
        authnUrl: { required: true, type: 'string', message: 'authnUrl option is required' }
      }
    )

    this.ghtkAuth = new GhtkAuth(this.config)
  }

  /**
   * @returns {string}
   */
  getRefererPath () {
    return getRefererPath()
  }

  /**
   * Return authn url
   * @returns {{type: string, message: string, required: boolean}|string}
   */
  getAuthnUrl () {
    return this.config.authnUrl || ''
  }

  /**
   * @returns {Promise<boolean>}
   * @throws exception if has error occurred
   */
  async handle () {
    try {
      const response = await this.ghtkAuth.token.parseFromUrl()

      // Store id token
      if (response.tokens.idToken) {
        this.ghtkAuth.tokenManager.add('idToken', response.tokens.idToken)
      }

      // Store access token
      if (response.tokens.accessToken) {
        const authParams = storageUtil.getOauthParamsStorage().getStorage()
        const tokenInfo = response.tokens.accessToken
        this.ghtkAuth.tokenManager.add('accessToken', {
          accessToken: tokenInfo.accessToken,
          expiresAt: tokenInfo.expiresAt,
          tokenType: tokenInfo.tokenType,
          isTempAccessLogin: authParams.isTempAccessLogin
        })
      }

      // Delay 1.5 seconds to make sure token already stored
      await util.delay(1500)

      AuthStorageManager.setOnOauthCallbackJustNow()

      return true
    } catch (error) {
      if (error.name === 'OAuthError' && error.errorCode === 'invalid_session') {
        // Some times, the session expired or was revoked but the ID service still keep state logged in
        // It caused browser redirect forever between ID service and App.
        if (AuthStorageManager.getRedirectionCounter() >= 1) {
          window.location = `${this.getAuthnUrl()}/sign-out`
          return false
        }

        AuthStorageManager.increaseRedirectionCounter()

        const continueUrl = encodeURI(`${window.location.origin}${this.getRefererPath()}`)
        if (this.getAuthnUrl().indexOf('?') >= 0) {
          window.location = `${this.getAuthnUrl()}&continue=${continueUrl}`
        } else {
          window.location = `${this.getAuthnUrl()}?continue=${continueUrl}`
        }

        return false
      }

      throw error
    }
  }
}

export default function (config) {
  return new OAuth2CallbackHandler(config)
}