import { AuthRedirectGuardMiddleware } from '../../vendor/libs/gmjs/lib'
import {getToken} from '../../infrastructures/gchat-auth'
import config from 'config/app.base'

export default function authIam ({ next, router }) {
  try {
    const gchatToken = getToken()
    if (!gchatToken) {
      const authRedirectGuardMiddleware = AuthRedirectGuardMiddleware(config.oidc)
      authRedirectGuardMiddleware.run(router.path, next)
    }
  } catch (e) {
    // Handle exception here
  }

  return next()
}
