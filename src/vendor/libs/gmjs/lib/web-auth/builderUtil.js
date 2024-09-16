import { AuthSdkError } from '../helper/error'

export default {
  assertValidConfig (args) {
    if (!args) {
      throw new AuthSdkError('No arguments passed to constructor. ' +
        'Required usage: new GhtkAuth(args)')
    }

    const issuer = args.issuer
    if (!issuer) {
      throw new AuthSdkError('No issuer passed to constructor. ' +
        'Required usage: new GhtkAuth({issuer: "https://auth.ghtk.vn"})')
    }

    const isUrlRegex = new RegExp('^http?s?://.+')
    if (!isUrlRegex.test(args.issuer)) {
      throw new AuthSdkError('Issuer must be a valid URL. ' +
        'Required usage: new GhtkAuth({issuer: "https://auth.ghtk.vn"})')
    }
  },

  getUserAgent (args, sdkValue) {
    const userAgent = args.userAgent || {}

    if (userAgent.value) {
      return userAgent.value
    }

    if (userAgent.template) {
      return userAgent.template.replace('$GHTK_AUTH_JS', sdkValue)
    }

    return sdkValue
  }
}
