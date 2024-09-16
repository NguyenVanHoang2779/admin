import Abstract from './Abstract'
import assert from '../helper/assert'

const recaptchaConfig = {
  sitekey: ''
}

class Recaptcha extends Abstract {
  setConfig (config = recaptchaConfig) {
    this.config = { ...recaptchaConfig, ...config }

    assert.check(
      this.config,
      { type: 'object', 'message': 'Config is not valid' },
      {
        sitekey: { type: 'string', required: true, message: 'Invalid sitekey' }
      }
    )
  }

  async render (placeElement) {
    if (this.widgetId !== undefined) {
      // Captcha already rendered
      window.grecaptcha.reset(this.widgetId)
      return
    }

    placeElement.classList.add('recaptcha-container')
    await this.injectRecaptchaScript()
    this.widgetId = window.grecaptcha.render(placeElement, this.config)

    // Responsive captcha box
    if (!document.getElementById('style-recaptcha-responsive')) {
      const s = document.createElement('style')
      s.id = 'style-recaptcha-responsive'
      s.innerHTML = `@media screen and (max-width: 429px) {
        .recaptcha-container {
          transform:scale(0.70);
          -webkit-transform:scale(0.70);
          transform-origin:0 0;
          -webkit-transform-origin:0 0;
        }
      }`
      this.getHeadElement().appendChild(s)
    }
  }

  getRequestData () {
    if (this.widgetId !== undefined) {
      return { 'g_recaptcha_response': window.grecaptcha.getResponse(this.widgetId) }
    }

    return {}
  }

  getHeadElement () {
    return document.getElementsByTagName('head').item(0)
  }

  injectRecaptchaScript () {
    if (typeof window.grecaptcha === 'object') {
      return
    }

    const scriptEl = document.createElement('script')
    scriptEl.async = true
    scriptEl.defer = true
    scriptEl.type = 'text/javascript'
    scriptEl.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    scriptEl.id = 'gmjs-recaptcha'

    return new Promise((resolve, reject) => {
      let intervalId
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        reject('Load google recaptcha timeout')
      }, 20000)

      scriptEl.onload = () => {
        clearInterval(intervalId)
        intervalId = setInterval(() => {
          if (typeof window.grecaptcha.render === 'function') {
            clearInterval(intervalId)
            clearTimeout(timeoutId)
            resolve(true)
          }
        }, 200)
      }

      this.getHeadElement().appendChild(scriptEl)
    })
  }
}

export default Recaptcha
