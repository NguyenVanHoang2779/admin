import { GhtkAuth } from './index'
import OauthUtil from './oauthUtil'
import assert from '../helper/assert'
import jsrsasign from 'jsrsasign'
import AuthStorageManager from './AuthStorageManager'

class TokenChecker {
  constructor (config) {
    assert.check(config, { type: 'object', 'message': 'Invalid config', optional: false }, {
      clientId: {
        required: true,
        type: 'string',
        message: 'clientId option is required'
      }
    })

    this.config = config
    this.ghtkAuth = new GhtkAuth(this.config)
  }

  /**
   * @returns Object header payload
   */
  getTokenHeader () {
    return JSON.parse(atob(this.accessToken.split('.')[0]))
  }

  /**
   * @returns {string}
   */
  getKid () {
    return this.getTokenHeader().kid
  }

  /**
   * @returns {string}
   */
  getAlgorithm () {
    return this.getTokenHeader().alg
  }

  /**
   * Convert a JWK to RSA key pair
   * @returns {Promise<RSAKey|*|undefined>}
   */
  async getPublicKeyPair () {
    const jwkObject = await OauthUtil.getKey(this.ghtkAuth, null, this.getKid())
    return jsrsasign.KEYUTIL.getKey(jwkObject)
  }

  /**
   * @param accessToken
   * @returns {TokenChecker}
   */
  setAccessToken (accessToken) {
    this.accessToken = accessToken
    return this
  }

  /**
   * Validate access token
   * @returns {boolean}
   */
  async isValid () {
    // Validate header
    if (!this.getAlgorithm() || !this.getKid()) {
      return false
    }

    let isTokenValidOffline = true

    const publicKeyPair = await this.getPublicKeyPair()

    // Verify signature with public key and expire time
    isTokenValidOffline = jsrsasign.KJUR.jws.JWS.verifyJWT(this.accessToken, publicKeyPair, { alg: [this.getAlgorithm()] })

    /*eslint-disable-next-line*/
    // console.log("Offline verify: Is token valid", isTokenValidOffline, "token", this.accessToken)

    // If token is valid or exchanged just now
    // call to endpoint introspect to make sure it is still accepted by auth server.
    // Some certain machines, with a magical reason the method verify offline given incorrect result
    // after redirected from oauth callback.
    // So we temporary fixing by ignore verify offline after redirected from oauth callback.
    if (isTokenValidOffline || AuthStorageManager.isOnOauthCallbackJustNow()) {
      try {
        const response = await this.ghtkAuth.introspectAccessToken(
          this.accessToken,
          'access_token',
          `${this.config.clientId}:`
        )

        /*eslint-disable-next-line*/
        // console.log("Introspect token response", response)

        // Must be exactly true
        return response.dataJSON.active === true
      } catch (e) {
        /*eslint-disable-next-line*/
        // console.log("Token checker error", e, e.xhr)

        // If status code is 401 it mean the token has been expired or has been revoked
        if (e.xhr && e.xhr.status === 401) {
          return false
        }

        throw new Error(e)
      }
    }

    return false
  }
}

export default TokenChecker
