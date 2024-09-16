import Abstract from './Abstract'
import axios from 'axios'
import assert from '../helper/assert'

const customCaptchaConfig = {
  serviceUrl: '',
  answerLabel: 'Mã captcha',
  answerPlaceholder: 'Nhập mã captcha đang hiện',
  showLabel: false,
}

class CustomCaptcha extends Abstract {
  setConfig (config = customCaptchaConfig) {
    this.config = { ...customCaptchaConfig, ...config }

    assert.check(
      this.config,
      { type: 'object', message: 'config is not valid' },
      {
        serviceUrl: { type: 'string', required: true, message: 'Invalid serviceUrl' },
        answerLabel: { type: 'string', message: 'Invalid answerLabel' },
        answerPlaceholder: { type: 'string', message: 'Invalid answerPlaceholder' },
        showLabel: { type: 'boolean', message: 'Invalid showLabel' },
      }
    )

    this.init()
  }

  init () {
    this.captcha = {}
    this.answer = ''
  }

  async reload () {
    this.init()
    await this.render(this.placeElement)
  }

  async render (placeElement) {
    if (!placeElement) {
      throw Error('Invalid place element')
    }

    this.placeElement = placeElement

    this.captcha = await this.generateCaptcha()

    const answerLabel = this.config.answerLabel || customCaptchaConfig.answerLabel
    const answerPlaceholder = this.config.answerPlaceholder || customCaptchaConfig.answerPlaceholder

    const label = `<label for="captcha-answer">${answerLabel}</label>`
    placeElement.innerHTML = `
      <div id="custom-captcha">
        ${this.config.showLabel ? label : ''}
        <div class="captcha-image-wrapper" title="Reload" style="cursor: pointer;text-align: center;background: #efefef">
            <img src="${this.captcha.data}" class="captcha-image" style="max-width: 100%"/>
        </div>
        <div class="captcha-answer-wrapper">
            <input 
             name="captcha-answer"
             class="captcha-answer form-control"
             placeholder="${answerPlaceholder}" 
             id="captcha-answer"
            />
        </div>
      </div>
    `

    // Collect answer value
    placeElement
      .getElementsByClassName('captcha-answer')
      .item(0)
      .addEventListener('change', ({ target }) => {
        this.answer = target.value
      })

    // Reload captcha image
    placeElement
      .getElementsByClassName('captcha-image-wrapper')
      .item(0)
      .addEventListener('click', this.reload.bind(this))

    // Clear old timeout
    clearTimeout(this.timeoutId)
    // Reload captcha after 9m
    const reloadDuration = 1000 * 60 * 60 * 9
    this.timeoutId = setTimeout(this.reload.bind(this), reloadDuration)
  }

  getRequestData () {
    return {
      answer: this.answer || '',
      id: this.captcha.id,
    }
  }

  async generateCaptcha () {
    const response = await axios.get(`${this.config.serviceUrl}/api/v1/custom-captcha/generate`)
    return response.data.data
  }
}

export default CustomCaptcha
