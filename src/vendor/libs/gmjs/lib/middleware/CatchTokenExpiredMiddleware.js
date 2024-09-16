import browserStorage from '../web-auth/browserStorage'

class CatchTokenExpiredMiddleware {
  constructor () {
    this.onTokenInvalidFn = () => {
      browserStorage.getHttpCache().clearStorage()
      window.location.reload()
    }
  }

  /**
   * @param fn Callback when token invalid
   */
  onTokenInvalid (fn) {
    this.onTokenInvalidFn = fn
  }

  /**
   * @param response
   * @returns response
   */
  catchResponse (response) {
    const statusCode = response.status || response.response.status
    // If server response status 401, it mean the token has been invalidated
    if (statusCode === 401) {
      this.onTokenInvalidFn(response)
    }

    if (response instanceof Error) {
      throw response
    }

    return response
  }
}

/**
 * Use this class to catch the request with token expired.
 * @example Inject to Axios middleware
 * axiosInstance.interceptors.response.use(
 *    CatchTokenExpiredMiddleware.catchResponse.bind(CatchTokenExpiredMiddleware),
 *    CatchTokenExpiredMiddleware.catchResponse.bind(CatchTokenExpiredMiddleware)
 * )
 */
export default new CatchTokenExpiredMiddleware()
