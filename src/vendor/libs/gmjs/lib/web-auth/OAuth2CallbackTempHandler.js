import { GhtkAuth } from './index'
import storageUtil from './browserStorage'
import oauthUtil from './oauthUtil'

class OAuth2CallbackTempHandler {
  constructor (config) {
    this.config = config
    this.ghtkAuth = new GhtkAuth(this.config)
  }

  /**
   * @param shortCode
   * @returns {Promise<void>}
   */
  async handle (shortCode) {
    if (!shortCode) {
      throw new Error('Missing short code')
    }

    const oauthParams = await this.ghtkAuth.token.prepareOauthParams(this.config)

    storageUtil.getOauthParamsStorage().setStorage({
      clientId: oauthParams.clientId,
      responseType: oauthParams.responseType,
      state: oauthParams.state,
      scopes: oauthParams.scopes,
      urls: oauthUtil.getOAuthUrls(this.ghtkAuth, this.config),
      isTempAccessLogin: true
    })

    const codeChallenge = oauthParams.codeChallenge
    const codeChallengeMethod = oauthParams.codeChallengeMethod
    const state = oauthParams.state
    window.location = await this.ghtkAuth.authWithTempAccess(shortCode, codeChallenge, codeChallengeMethod, state)
  }
}

/**
 * @example
 *   import newOAuth2CallbackHandler from 'gmjs/lib/web-auth/OAuth2CallbackHandler'
 *   try {
 *      await newOAuth2CallbackTempHandler(oidc).handle(shortCode)
 *   }catch(e) {
 *     // handle error here
 *   }
 *
 * @param config the OIDC
 * @returns {OAuth2CallbackTempHandler}
 */
export default (config) => {
  return new OAuth2CallbackTempHandler(config)
}