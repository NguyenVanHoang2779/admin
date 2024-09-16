import SDK_VERSION from './version'
import { GhtkAuth } from './web-auth'
import CatchTokenExpiredMiddleware from './middleware/CatchTokenExpiredMiddleware'
import AuthStorageManager from './web-auth/AuthStorageManager'
import AuthRedirectGuardMiddleware from './web-auth/AuthRedirectGuardMiddleware'
import OAuth2CallbackTempHandler from './web-auth/OAuth2CallbackTempHandler'
import OAuth2CallbackHandler from './web-auth/OAuth2CallbackHandler'
import constants from './web-auth/constants'
import CaptchaFactory from './captcha/Factory'
import CookieHelper from './helper/cookie'

export {
  CatchTokenExpiredMiddleware,
  AuthStorageManager,
  AuthRedirectGuardMiddleware,
  OAuth2CallbackHandler,
  OAuth2CallbackTempHandler,
  GhtkAuth,
  constants as AuthConstants,
  CaptchaFactory,
  CookieHelper
}

export default { version: SDK_VERSION }
