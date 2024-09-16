import CustomCaptcha from './CustomCaptcha'
import Recaptcha from './Recaptcha'

/**
 * Use this factory to get captcha by type and inject captcha to a form
 * @example
 *  import { CaptchaFactory } from 'gmjs'
 *  const cFactory = new CaptchaFactory()
 *  const cInstance = cFactory.get(CaptchaFactory.CaptchaTypeCustom, {...some options require by each captcha type...})
 *  // Show captcha
 *  cInstance.render(document.getElementById('captcha_container'))
 *  // Get data and send it to your backend service to verify
 *  axios.post('/sign-in', {..., captcha: cInstance.getRequestData() )
 */
class CaptchaFactory {
  constructor () {
    // Define captcha types
    this.CaptchaTypeCustom = 'custom'
    this.CaptchaTypeReCaptcha = 'recaptcha'
  }

  /**
   * Get captcha by type
   * @param type
   * @param config
   * @return {CustomCaptcha|Recaptcha}
   */
  get (type, config = {}) {
    let captcha = null

    switch (type) {
      case this.CaptchaTypeCustom:
        captcha = new CustomCaptcha()
        break
      case this.CaptchaTypeReCaptcha:
        captcha = new Recaptcha()
        break
      default:
        throw new Error('Captcha type not supported')
    }

    captcha.setConfig(config)
    return captcha
  }
}

export default CaptchaFactory
